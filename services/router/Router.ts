import { Graph, GraphNode } from "../../Graph"
import { Routes, Service, ServiceMessage, ServiceOptions } from "../Service"

/*
Goals of router:

Accept graph connections, incl local,
relay subscriptions from one graph to another,

Now use that to sync subscriptions

Backend Graph
      |
    Router--
     |      \
Frontend 1   Frontend 2

*/


export type User = { //users have macros to call grouped connections generically, based on what's available
    _id:string,
    send:(...args:any[])=>any,
    request:(...args:any[])=>Promise<any>|Promise<any>[]|undefined,
    post:(...args:any[])=>void,
    run:(...args:any[])=>Promise<any>|Promise<any>[]|undefined,
    subscribe:(...args:any[])=>Promise<number>|Promise<number>[]|undefined,
    unsubscribe:(...args:any[])=>Promise<boolean>|Promise<boolean>[]|undefined,
    terminate:(...args:any[]) => boolean,
    onclose?:(user:User)=>void,
    [key:string]:any
} 


export type ConnectionProps = {
    connection:GraphNode|Graph|{[key:string]:any}|string, //can be a node, graph, connection Info object or _id string 
    service?:string|Graph|Service, //
    source?:string, //group of connections the connection belongs to, e.g. a user id or a service 
    onclose?:(connection:ConnectionInfo,...args:any[])=>void
}
//valid connections: WebRTCInfo, WebSocketInfo, SocketInfo, SocketServerInfo, SSEChannelInfo, SSESessionInfo, EventSourceInfo, ServerInfo

export type ConnectionInfo = {
    connection:GraphNode|Graph|{[key:string]:any}, //can be a node, graph, connection Info object or _id string 
    service?:string|Service|Graph,
    _id:string,
    source:string, // base connections can have multiple sources if you add the same connection again via addConnection with a new source specified!! These objects will be duplicated on each source container
    connectionType?:string, //if we know the key on the service we sourced an endpoint connection from, this helps with keeping track of things 
    connectionsKey?:string, //if we know the object on the service that the connection info is stored on
    send?:(message:any, ...a:any[])=>any,
    request?:(message:any, method?:any,...a:any[])=>Promise<any>|Promise<any>[],
    post?:(route:any, args?:any, method?:string, ...a:any[])=>void,
    run?:(route:any, args?:any, method?:string, ...a:any[])=>Promise<any>|Promise<any>[],
    subscribe?:(route:any, callback?:((res:any)=>void)|string, ...a:any[])=>Promise<number>|Promise<number>[]|undefined,
    unsubscribe?:(route:any, sub:number, ...arrayBuffer:any[])=>Promise<boolean>|Promise<boolean>[],
    terminate:(...a:any[]) => boolean,
    onclose?:(connection:ConnectionInfo,...args:any[])=>void
}

export type RouterOptions = ServiceOptions & {
    services?:{
        [key:string]:Service|any|{
            service:Service|any,
            connections:string[]|{[key:string]:any},
            config?:{ //configure connections per service
                [key:string]:{ //configure multiple connection instances using the generic 'open' function
                    _id?:string,
                    source?:string,
                    onclose?:(c:ConnectionInfo,...args:any[])=>void,
                    args?:any[], //other arguments a service spec expects other than the main config object (try to make it just one object for easier config automation!)
                    [key:string]:any //configuration settings
                }
            }, //configure new connections after adding the relevant services?
        } //can be a service constructor
    }
    syncServices?:boolean,
    order?:string[]
}

export class Router extends Service {

    name = 'router'

    //we need to store connection settings and available endpoints
    connections:{
        [key:string]:ConnectionInfo //the services/graphs/nodes and connections by which to send on, these will be the corresponding info objects and the create/terminate functions for the appropriate services
    }={}

    sources:{ //grouped connection settings
        [key:string]:{ //id'd connections e.g. different graphs local or remote
            [key:string]:ConnectionInfo //the services/graphs/nodes and connections by which to send on, these will be the corresponding info objects and the create/terminate functions for the appropriate services
        }
    } = {}

    services:{ //lets you open whatever connections knowing the correct i/o
        [key:string]:Service
    } = {}

    serviceConnections:{ //the service's connections objects if provided, these are managed by the services themselves so we don't need to perform cleanup
        [key:string]:{[key:string]:{[key:string]:any}}
    } = {}

    users:{[key:string]:User} = {}; //jsonifiable information

    order:string[]; //execute connections in preferred order

    constructor(options?:RouterOptions){
        super(options);
        this.load(this.routes);
        if(options) {
            if(options.order) this.order = options.order;

            if(options.services) {
                for(const key in options.services) {
                    let opt = (options.services[key] as any);
                    if(opt instanceof Service) {
                        opt.service.name = key; opt.service.tag = key;
                        this.addService(opt.service, opt.connections, options.includeClassName, options.routeFormat, options.syncServices);
                    } else if (typeof opt === 'function') {
                        let service = new opt() as Service; //instantiate a class prototype
                        service.name = key; service.tag = key;
                        if(service) 
                            this.addService(
                                service, 
                                service.connections, 
                                options.includeClassName, 
                                options.routeFormat, 
                                options.syncServices
                            );
                    }
                    else {
                        if (typeof opt.service === 'function') {
                            let service = new opt.service({name:key}) as Service; //instantiate a class prototype
                            service.name = key; service.tag = key;
                            if(service) 
                                this.addService(
                                    service, 
                                    undefined, 
                                    options.includeClassName, 
                                    options.routeFormat, 
                                    options.syncServices
                                );
                                opt.service = service;
                        }
                        else if(opt.service instanceof Service) {
                            opt.service.name = key; opt.service.tag = key;
                            this.addService(
                                opt.service, 
                                undefined,
                                options.includeClassName, 
                                options.routeFormat, 
                                options.syncServices
                            );
                        }
                        if(typeof opt.service === 'object') {
                            if(opt.connections) {
                                if(Array.isArray(opt.connections)) {
                                    (opt.connections as any).forEach((k) => {
                                        this.addServiceConnections(opt[key].service,k);
                                    })
                                } else this.addServiceConnections(opt.service,opt.connections);
                            }
                            if(opt.config) {
                                for(const c in opt.config) {
                                    this.openConnection(
                                        opt.service, 
                                        opt.config[c],
                                        opt.config[c].source,
                                        opt.config[c].args
                                    );
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    addUser = async (
        info:{_id:string} & {onclose?:(connection:ConnectionInfo,...args:any[])=>void},
        connections?:{[key:string]:ConnectionProps|string|ConnectionInfo},
        config?:{ //configure connections per service
            [key:string]:{ //configure multiple connection instances using the generic 'open' function
                service:Service,
                _id?:string,
                onclose?:(c:ConnectionInfo,...args:any[])=>void,
                args?:any[], //other arguments a service spec expects other than the main config object (try to make it just one object for easier config automation!)
                [key:string]:any //configuration settings
            }
        }, //configure new connections after adding the relevant services?
        receiving?:boolean //is this the receiving router?
    ) => {
        if(!info._id) {
            info._id = `user${Math.floor(Math.random()*1000000000000000)}`;
        }

        let user:User = Object.assign({},info) as any;//Profile(info._id,info) as User;
        
        if(connections){
            for(const key in connections) {
                if(typeof connections[key] === 'object') {
                    if(!(connections[key] as any).connection._id) {
                        await new Promise((res,rej) => {
                            let start = performance.now();
                            let checker = () => {
                                if(!(connections[key] as any).connection._id) {
                                    if(performance.now() - start > 3000) {
                                        delete connections[key];
                                        rej(false);
                                    } else {
                                        setTimeout(()=>{
                                            checker();
                                        },100); //check every 100ms
                                    }
                                } else {
                                    res(true);
                                }
                            }
        
                            checker();
        
                        }).catch((er) => {
                            console.error('Connections timed out:', er); 
                        });
                    }
                }
            }
            for(const key in connections) {
                connections[key] = this.addConnection(connections[key], user._id) as any;
            }
        }
        if(config) {
            for(const c in config) {
                this.openConnection(
                    config[c].service, 
                    config[c],
                    user._id,
                    config[c].args
                );
            }
        }

        let send = (message:any, ...a:any[]) => {
            let connection = this.getConnection(user._id, 'send');
            if(connection?.send) return connection.send(message, ...a);
        }

        let request = (message:any, method?:any, ...a:any[]) => {
            let connection = this.getConnection(user._id, 'request');
            if(connection?.request) return connection.request(message, method, ...a);
        }

        let post = (route:any, args?:any, method?:string, ...a:any[]) => {
            let connection = this.getConnection(user._id, 'post');
            if(connection?.post) return connection.post(route, args, method, ...a);
        }

        let run = (route:any, args?:any, method?:string, ...a:any[]) => {
            let connection = this.getConnection(user._id, 'run');
            if(connection?.run) return connection.run(route, args, method, ...a);
        }

        let subscribe = (route:any, callback?:((res:any)=>void)|string,...a:any[]) => {
            let connection = this.getConnection(user._id, 'subscribe');
            if(connection?.subscribe) return connection.subscribe(route, callback, ...a);
        }

        let unsubscribe = (route:any, sub:number, ...a:any[]) => {
            let connection = this.getConnection(user._id, 'unsubscribe');
            if(connection?.unsubscribe) return connection.unsubscribe(route, sub, ...a);
        }

        let terminate = () => {
            return this.removeUser(user)
        }

        user.send = send;
        user.request = request;
        user.post = post;
        user.run = run;
        user.subscribe = subscribe;
        user.unsubscribe = unsubscribe;
        user.terminate = terminate;
        //these are macros to get available connections

        this.users[user._id] = user;

        if(connections && !receiving) {
            let connectionIds = {}; 
            let pass = false;
            Object.keys(connections).map((k,i) => {
                if((connections[k] as any)?._id) {
                    connectionIds[`${i}`] = (connections[k] as any)?._id
                    pass = true;
                }
            });
            if(pass) {
                //console.log(user._id,connectionIds)
                user.send({
                    route:'addUser',
                    args:[
                        {_id:user._id},
                        connectionIds,
                        undefined,
                        true
                    ]
                });
            }
        }
            
        return user;
    }
    
    removeUser(
        profile:string | User | {_id:string, [key:string]:any},
        terminate?:boolean
    ) {
        if(terminate) this.removeConnection(profile as any, terminate);

        if (typeof profile === 'string') profile = this.users[profile];
        if(typeof profile === 'object' && profile._id) {
            delete this.users[profile._id];
            if(profile.onclose) profile.onclose(profile);
        }


        return true;
    }

    //pick the preferred connection by service name if passing a source, or pick the connection by id if not a source
    getConnection = (sourceId:string, hasMethod?:string):ConnectionInfo|undefined => {
        if(this.sources[sourceId]) {
            //console.log(this.sources[sourceId]);
            if (this.order) {
                for(let i = 0; i < this.order.length; i++) {
                    let k = this.order[i];  
                    for(const key in this.sources[sourceId as string]) {
                        if(this.sources[sourceId as string][key].service) {
                            if(typeof this.sources[sourceId as string][key].service === 'object') {
                                if((this.sources[sourceId as string][key].service as Graph).tag === k) {
                                    if(this.sources[sourceId as string][key].connectionType && (this.sources[sourceId as string][key].service as any)?.name) {
                                        if(!this.serviceConnections[(this.sources[sourceId as string][key] as any).service.name]) {
                                            this.removeConnection(this.sources[sourceId as string][key]); //some auto cleanup
                                            continue;
                                        }
                                    }
                                    return this.sources[sourceId as string][key];
                                }
                            } else if (this.sources[sourceId as string][key].service === k) {
                                if(this.sources[sourceId as string][key].connectionType && (this.sources[sourceId as string][key].service as any)?.name) {
                                    if(!this.serviceConnections[(this.sources[sourceId as string][key] as any).service.name]) this.removeConnection(this.sources[sourceId as string][key]); //some auto cleanup
                                    continue;
                                }
                                return this.sources[sourceId as string][key];
                            }
                        }
                    }
                }
            }
            else {
                for(const k in this.sources[sourceId as string]) {
                    if(this.sources[sourceId as string][k].connectionType && (this.sources[sourceId as string][k].service as any)?.name) {
                        if(!this.serviceConnections[(this.sources[sourceId as string][k] as any).service.name]) 
                        {
                            this.removeConnection(this.sources[sourceId as string][k]); //some auto cleanup
                            continue;
                        }
                    }
                    if(hasMethod && this.sources[sourceId as string][k][hasMethod]) {
                        return this.sources[sourceId as string][k];
                    }
                    else {
                        return this.sources[sourceId as string][k];
                    }
                }
                
            }
        } else if (this.order) {
            for(let i = 0; i < this.order.length; i++) {
                let k = this.order[i];  
                if(this.sources[k]?.[sourceId]) {
                    if (this.sources[k][sourceId].connectionType && (this.sources[k][sourceId].service as any)?.name) {
                        if (!this.serviceConnections[(this.sources[k][sourceId].service as any).service.name]) {
                            this.removeConnection((this.sources[k][sourceId].service as any));
                            continue;
                        }
                    }
                    if(hasMethod && this.sources[k][sourceId as string]?.[hasMethod]) {
                        return this.sources[k][sourceId as string];
                    }
                    else {
                        return this.sources[k][sourceId as string];
                    }
                }
              
            }
        } 
        if(typeof sourceId === 'string' && this.connections[sourceId] && this.connections[sourceId].send) {
            return this.connections[sourceId]; //regardless of method, as this is a direct connection reference
        } 
    }


    //get all connections with matching properties e.g. connectionType and connectionsKey
    getConnections = (sourceId:string, hasMethod?:string, props?:{}) => {
        if(this.sources[sourceId]) {
            if(!props && !hasMethod) return this.sources[sourceId];

            let found = {};
            for(const key in this.sources[sourceId]) {
                if(typeof this.sources[sourceId][key] === 'object') {
                    if(!this.sources[sourceId][key]._id) {
                        for(const k in this.sources[sourceId][key]) {
                            if(typeof this.sources[sourceId][key][k] === 'object') {
                                let pass = true;
                                if(hasMethod && !this.sources[sourceId][key][k][hasMethod]) pass = false;
                                for(const p in props) {
                                    if(typeof this.sources[sourceId][key][k][p] === 'object' && typeof props[p] === 'object') {
                                        //check one level down
                                        for(const pp in props[p]) {
                                            if(props[p][pp] !== this.sources[sourceId][key][k][p][pp]) {
                                                pass = false;
                                                break;
                                            }
                                        }
                                    }
                                    else if(this.sources[sourceId][key][k][p] !== props[p]) {
                                        pass = false;
                                    } else {
                                        pass = false;
                                        break;
                                    }
                                }
                                if(pass) {
                                    found[this.sources[sourceId][key][k]._id] = this.sources[sourceId][key][k];
                                }
                            }
                        }
                    } else {
                        let pass = true;
                        if(hasMethod && !this.sources[sourceId][key][hasMethod]) pass = false;
                        for(const p in props) {
                            if(typeof this.sources[sourceId][key][p] === 'object' && typeof props[p] === 'object') {
                                //check one level down
                                for(const pp in props[p]) {
                                    if(props[p][pp] !== this.sources[sourceId][key][p][pp]) {
                                        pass = false;
                                        break;
                                    }
                                }
                            }
                            else if(this.sources[sourceId][key][p] !== props[p]) {
                                pass = false;
                            } else {
                                pass = false;
                                break;
                            }
                        }
                        if(pass) {
                            if(this.getConnection(this.sources[sourceId][key] as any, hasMethod))
                                found[this.sources[sourceId][key]._id] = this.sources[sourceId][key];
                        }
                    }
                }
            }
        }
    }

    addConnection = (options:ConnectionProps|ConnectionInfo|string,source?:string) => {
        let settings:ConnectionInfo = {} as any;
        if(typeof options === 'string') {
            if (this.connections[options]) {
                options = this.connections[options];
            } else { //check all the service-managed connection objects that we linked
                for(const j in this.serviceConnections) {
                    for (const k in this.serviceConnections[j]) {
                        if(this.serviceConnections[j][k][options as string]) {
                            options = {connection:this.serviceConnections[j][k][options as string]};
                            options.service = j;
                            settings.connectionType = j;
                            settings.connectionsKey = k;
                            break;
                        }
                    }
                }
            }
            if(typeof options === 'string' && this.nodes.get(options)) options = {connection:this.nodes.get(options)};
        } 
        if(!options || typeof options === 'string') return undefined;

        if(source) settings.source = source;

        if(options.connection instanceof GraphNode) {
            settings.connection = options.connection;
            let node = settings.connection as GraphNode;
            settings.send = async (message:ServiceMessage) => {
                if(message.method) {
                    if(Array.isArray(message.args)) {
                        return node[message.method]?.(...message.args)
                    } else return node[message.method]?.(message.args)
                } else {
                    if(Array.isArray(message.args)) {
                        return node.run(...message.args)
                    } else return node.run(message.args)
                }
            }
            settings.request = async (message:any,method?:string) => {
                if(method) {
                    if(Array.isArray(message.args)) {
                        return node[method]?.(...message.args)
                    } else return node[method]?.(message.args)
                } else {
                    if(Array.isArray(message.args)) {
                        return node.run(...message.args)
                    } else return node.run(message.args)
                }
            }
            settings.post = async (route?:string, args?:any, method?:string) => {
                if(route && node.get(route)) {
                    let n = node.get(route);
                    if(method) {
                        if(Array.isArray(args)) {
                            return n[method]?.(...args)
                        } else return n[method]?.(args)
                    } else {
                        if(Array.isArray(args)) {
                            return n.run(...args)
                        } else return n.run(args)
                    }
                }
                else {
                    if(method) {
                        if(Array.isArray(args)) {
                            return node[method]?.(...args)
                        } else return node[method]?.(args)
                    } else {
                        if(Array.isArray(args)) {
                            return node.run(...args)
                        } else return node.run(args)
                    }
                }
            }
            settings.run = settings.post as any;
            settings.subscribe = async (route:string|undefined, callback:((res:any)=>void)) => {
                return node.subscribe(callback,route) as number;
            };
            settings.unsubscribe = async (route:any, sub:number) => {
                return node.unsubscribe(sub,route) as boolean;
            }
            settings.terminate = () => {
                node.graph.remove(node);
                return true;
            }
            settings.onclose = options.onclose;
            if(settings.onclose) {
                let oldondelete;
                if(node.ondelete) oldondelete = node.ondelete;
                node.ondelete = (n:GraphNode) => { if(settings.onclose) settings.onclose(settings,n); if(oldondelete) oldondelete(n); }
            }
        } else if (options.connection instanceof Graph) {
            if(options.connection.nodes.get('open'))
                settings.service = options.connection;
            let graph = settings.connection as Graph;
            settings.send = async (message:ServiceMessage) => {
                if(Array.isArray(message.args))
                    graph.run(message.route as string, ...message.args);
                else graph.run(message.route as string,message.args);
            }
            settings.request = async (message:any,method?:string) => {
                if(!message.route) return undefined;
                if(method) {
                    if(Array.isArray(message.args)) {
                        return graph.nodes.get(message.route)[method]?.(...message.args)
                    } else return graph.nodes.get(message.route)[method]?.(message.args)
                } else {
                    if(Array.isArray(message.args)) {
                        return graph.run(message.route,...message.args)
                    } else return graph.run(message.route,message.args)
                }
            }
            settings.post = async (route:string, args?:any, method?:string) => {
                if(route && graph.get(route)) {
                    let n = graph.get(route);
                    if(method) {
                        if(Array.isArray(args)) {
                            return n[method]?.(...args)
                        } else return n[method]?.(args)
                    } else {
                        if(Array.isArray(args)) {
                            return n.run(...args)
                        } else return n.run(args)
                    }
                }
            }
            settings.run = settings.post as any;
            settings.subscribe = async (route:string|GraphNode, callback:((res:any)=>void)) => {
                return graph.subscribe(route,callback) as number;
            };
            settings.unsubscribe = async (route:any, sub:number) => {
                return graph.unsubscribe(route,sub) as boolean;
            }
            settings.terminate = (n) => {
                graph.remove(n);
                return true;
            }
        } else if(!((options as ConnectionInfo)._id && this.connections[(options as ConnectionInfo)._id])) {
            let c = options.connection;
            if(typeof c === 'string') { //get by connection ID

                if (this.connections[c]) c = this.connections[c];
                else if(options.service) {
                    if(typeof options.service === 'string') {
                        options.service = this.services[options.service];
                    }
                    if(typeof options.service === 'object') {
                        if(options.service.connections) { //reference we have on available services
                            for(const key in options.service.connections) {
                                if(options.service.connections[key][c as string]) {   
                                    c = options.service.connections[key][c as string];
                                    settings.connectionType = key;
                                    settings.connectionsKey = c as string;
                                    break;
                                }
                            }
                        }
                    }
                } else { //check all the service-managed connection objects that we linked
                    for(const j in this.serviceConnections) {
                        for (const k in this.serviceConnections[j]) {
                            if(this.serviceConnections[j][k][c as string]) {
                                c = this.serviceConnections[j][k][c as string];
                                options.service = j;
                                settings.connectionType = j;
                                settings.connectionsKey = k;
                                break;
                            }
                        }
                    }
                }
            } 
            if(typeof c !== 'object') return undefined;
            settings._id = c._id;
            settings.send = c.send;
            settings.request = c.request;
            settings.run = c.run;
            settings.post = c.post;
            settings.subscribe = c.subscribe;
            settings.unsubscribe = c.unsubscribe;
            settings.terminate = c.terminate;
            settings.onclose = options.onclose;

            //default onclose cleanup handlers to remove users and dead connections as needed
            if(settings.onclose) {
                if(!(c.onclose && settings.onclose.toString() === c.onclose.toString())) {
                    let oldonclose = c.onclose;
                    c.onclose = (...args:any[]) => { 
                        if(settings.onclose) settings.onclose(settings, ...args); 
                        if(this.users[settings.source] && Object.keys(this.sources[settings.source]).length === 0) {
                            this.removeUser(settings.source, false); 
                        }  
                        if(oldonclose) oldonclose(...args); 
                    }
                }
            } else {
                let oldonclose = c.onclose;
                c.onclose = (...args:any[]) => { 
                    this.removeConnection(settings); 
                    if(this.users[settings.source] && Object.keys(this.sources[settings.source]).length === 0) {
                        this.removeUser(settings.source, false); 
                    } 
                    if(oldonclose) oldonclose(...args); 
                } //default cleanup
            }
            
            if(options.service) {   
                if(typeof options.service === 'string') options.service = this.services[options.service];         
                settings.service = options.service;
            } else if(c.graph) settings.service = c.graph;

        }

        if(!settings.source && options.source) {
            settings.source = options.source;
        }
        else if(!settings.source && options.service) {
            settings.source = typeof options.service === 'object' ? options.service.name : undefined;
        } else if (!settings.source && (settings.connection instanceof GraphNode || settings.connection instanceof Graph)) {
            settings.source = 'local';
            if(!this.order.indexOf('local')) this.order.unshift('local'); 
        }

        if(!settings._id) settings._id = `connection${Math.floor(Math.random()*1000000000000000)}`;
    
        if(settings.source) {
            if(!this.sources[settings.source])
                this.sources[settings.source] = {};
                this.sources[settings.source][settings._id] = settings;
        }

        if(!this.connections[settings._id]) 
            this.connections[settings._id] = settings; //we may want to assign multiple sources so we can ignore later calls on addConnection

        return settings;
    }

    removeConnection = (connection:string|ConnectionInfo|{_id:string,[key:string]:any}, terminate:boolean=false) => {
        if(typeof connection === 'object' && connection._id) connection = connection._id;
        if(typeof connection === 'string') {
            if(this.connections[connection]) {
                if(terminate && this.connections[connection]) 
                    this.connections[connection].terminate();
                delete this.connections[connection];
                for(const key in this.sources) {
                    if(this.sources[key][connection])
                        delete this.sources[key][connection];
                    else {
                        for(const k in this.sources[key]) {
                            if(this.sources[key][k]?.[connection]) {
                                delete this.sources[key][connection];
                            }
                        }
                    }
                }
                return true;
            } else if (this.sources[connection]) {
                for(const key in this.sources[connection]) {
                    this.removeConnection(this.sources[connection][key],terminate);
                }
                return true;
            }
        }
    }

    addService = (
        service:Service,
        connections?:any, //the object on the service we want to associate connections wtih
        includeClassName?:boolean,
        routeFormat?:string,
        syncServices?:boolean,
        source?:string,
        order?:string[],
    ) => {
        //console.log(service)
        this.load(service,includeClassName,routeFormat,this.customRoutes,this.customChildren);
        this.services[service.name] = service;
        if(connections) {
            if(typeof connections === 'string') this.addServiceConnections(service,connections,source);
            else {
                for(const c in connections) {
                    this.addServiceConnections(service,c,source);
                }
            }
        }
        if(syncServices) this.syncServices(); //maps all uncommon nodes to each service 
        if(order) this.order = order;
        else {
            if(!this.order) this.order = [];
            this.order.push(service.name);
        }
    }

    addServiceConnections = ( //sync connection objects that match our boilerplate (send/request/terminate etc) for quicker piping
        service:Service|string,
        connectionsKey:any,
        source?:string
    ) => {
        if(typeof service === 'string') {
            service = this.services[service];
        }
        if(connectionsKey && service[connectionsKey]) {
            let newConnections = {};
            if(!this.serviceConnections[service.name]) this.serviceConnections[service.name] = {};
            this.serviceConnections[service.name][connectionsKey] = service[connectionsKey];

            for(const key in service[connectionsKey]) {
                if(!this.connections[key]) 
                    {
                        newConnections[key] = this.addConnection({connection:service[connectionsKey][key], service},source);
                        newConnections[key].connectionType = connectionsKey;
                    }
            }
            return newConnections;
        }
    }

    openConnection = async (
        service:string|Service, //the service we are calling
        options:{[key:string]:any},  //all of the creation function start with objects in our service library 
        source?:string,
        ...args:any[] //potentially other arguments in custom services
    ) => {
        if(typeof service === 'string') {
            service = this.services[service];
        }
        if(service instanceof Service) {
            let connection = service.run('open', options, ...args);
            if(connection instanceof Promise) {
                return connection.then(async (info) => {
                    if(!info._id) {
                        await new Promise((res,rej) => {
                            let start = performance.now();
                            let checker = () => {
                                if(!info._id) {
                                    if(performance.now() - start > 3000) {
                                        rej(false);
                                    } else {
                                        setTimeout(()=>{
                                            checker();
                                        },100); //check every 100ms
                                    }
                                } else {
                                    res(true);
                                }
                            }
        
                            checker();
        
                        }).catch((er) => {console.error('Connections timed out:', er); });
                    }
                    if(info._id) this.addConnection({connection:info, service}, source);
                })
            } else if(connection) {
                if(!connection._id) {
                    await new Promise((res,rej) => {
    
                        let start = performance.now();
                        let checker = () => {
                            if(!connection._id) {
                                if(performance.now() - start > 3000) {
                                    rej(false);
                                } else {
                                    setTimeout(()=>{
                                        checker();
                                    },100); //check every 100ms
                                }
                            } else {
                                res(true);
                            }
                        }
    
                        checker();
    
                    }).catch((er) => {console.error('Connections timed out:', er); });
                }
                if(connection._id) return this.addConnection({connection, service}, source);
            }
        }
    }

    terminate = (connection:string|ConnectionInfo) => {
        if(typeof connection === 'string') connection = this.connections[connection];
        return connection.terminate();
    }

    subscribeThroughConnection = (
        route:string, //the route on the endpoint we want to subscribe to outputs from
        relay:string|ConnectionInfo, //the router we are trying to relay messages through
        endpoint:string, //the endpoint on the router that we want to subscribe to through the router
        callback:string|((res:any)=>void),
        ...args:any[]
    ) => {
        if(typeof relay === 'string') {
            relay = this.getConnection(relay,'run') as ConnectionInfo;
        }

        if(typeof relay === 'object')
            return new Promise((res,rej) => {
                (relay as any).run('routeConnections',[route,endpoint,(relay as any)._id,...args]).then((sub) => {
                    this.subscribe(endpoint, (res) => {
                        if(res?.callbackId === route) {
                            if(!callback) this.setState({[endpoint]:res.args});
                            else if(typeof callback === 'string') { //just set state 
                                this.setState({[callback]:res.args});
                            }
                            else callback(res.args);
                        }
                    });
                    res(sub);
                }).catch(rej);
            });
    }

    //we will use the router to relay subscriptions between endpoints generically
    routeConnections = (
        route:string, //the route on the endpoint we want to subscribe to outputs from
        transmitter:string|ConnectionInfo, //the endpoint we want to subscribe to through the router
        receiver:string|ConnectionInfo, //the endpoint we want to receive messages on from the router
        ...args:any[]
    ) => {
        
        let rxsrc;
        if(typeof receiver === 'string') {
            if(this.sources[receiver]) {
                rxsrc = receiver;
            }
            receiver = this.getConnection(receiver,'send') as ConnectionInfo;

        }

        //let txsrc;
        if(typeof transmitter === 'string') {
            // if(this.sources[transmitter]) {
            //     txsrc = transmitter;
            // }
            transmitter = this.getConnection(transmitter,'subscribe') as ConnectionInfo;
        }

        if((transmitter as ConnectionInfo)?.subscribe && (receiver as ConnectionInfo)?.send) {

            let res:Promise<number> = new Promise((res,rej) => {
                (transmitter as any).subscribe(
                    route,
                    (transmitter as any)._id,
                    (res:any) => {
                        if(!this.connections[(receiver as any)._id] && rxsrc) {
                            if(this.sources[rxsrc]) {
                                rxsrc = receiver;
                                Object.keys(this.sources[rxsrc]).forEach((k) => {
                                    if(this.sources[receiver as string][k].send) {
                                        receiver = this.sources[receiver as string][k]
                                    }
                                });
                            }
                        }
                        if(this.connections[(receiver as any)._id]) //if connection is still registered
                            (receiver as any).send({ callbackId:route, args:res });
                        //else this.unsubscribe(route,undefined);    
                    },
                    ...args
                ).then((sub:number) => {
                    res(sub);
                });
            });
            return res;
        }
    }

    //tie node references together across service node maps so they can call each other's relative routes
    syncServices = () => {
        for(const name in this.services) { 
            if('users' in this.services[name]) this.services[name].users = this.users;
            this.nodes.forEach((n,tag) => {
                if(!this.services[name].nodes.get(n.tag)) {
                    this.services[name].nodes.set(n.tag,n);
                } else {
                    if(!this.services[name].nodes.get(tag) && n._UNIQUE !== this.services[name].nodes.get(n.tag)._UNIQUE) //use the remapped key if it's not the same node
                        this.services[name].nodes.set(tag,n);
                }
            });
        }
    }


    setUserData = (user:string|User, data:{[key:string]:any}|string) => {
        if(user) if(typeof user === 'string') {
            user = this.users[user as string];
            if(!user) return false;
        }
        if(data) if(typeof data === 'string') {
            data = JSON.parse(data as string);
        }

        if(typeof data === 'object') {
            this.recursivelyAssign(user,data);
            return true;
        }

        //console.log(user,props)
    }

    routes:Routes={
        addUser:this.addUser,
        removeUser:this.removeUser,
        getConnection:this.getConnection,
        addConnection:this.addConnection,
        removeConnection:this.removeConnection,
        addService:this.addService,
        addServiceConnections:this.addServiceConnections,
        openConnection:this.openConnection,
        terminate:this.terminate,
        routeConnections:this.routeConnections,
        subscribeThroughConnection:this.subscribeThroughConnection,
        syncServices:this.syncServices
    }

}