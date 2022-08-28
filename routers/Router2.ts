import { Graph, GraphNode } from "../Graph"
import { Routes, Service, ServiceMessage, ServiceOptions } from "../services/Service"

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

export type ConnectionProps = {
    connection:GraphNode|Graph|any, //will include the service as 'graph' from our boilerplate
    service?:string|Graph|Service,
    _id?:string,   //unique id
    source?:string //group of connections the connection belongs to, e.g. a user id or a service 
}
//valid connections: SocketInfo, SocketServerInfo, SSEChannelInfo, SSESessionInfo, EventSourceInfo, ServerInfo

export type ConnectionInfo = {
    connection:GraphNode|Graph|any,
    service?:string|Service|Graph,
    _id:string,
    source?:string,
    send?:(...args:any[])=>any,
    request?:(...args:any[])=>Promise<any>|Promise<any>[],
    post?:(...args:any[])=>void,
    run?:(...args:any[])=>Promise<any>|Promise<any>[],
    subscribe?:(...args:any[])=>Promise<number>|Promise<number>[]|undefined,
    unsubscribe?:(...args:any[])=>Promise<boolean>|Promise<boolean>[],
    terminate:(...args:any[]) => boolean
}

export type RouterOptions = ServiceOptions & {
    connections?:{[key:string]:ConnectionProps}
    services?:{
        [key:string]:{
            service:Service,
            connectionKeys:string|string[]
        }
    },
    syncServices?:boolean
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
    }

    services:{ //lets you open whatever connections knowing the correct i/o
        [key:string]:Service
    } = {}

    order:string[]=[]; //execute connections in preferred order

    constructor(options:ServiceOptions){
        super(options);
        if(options.order) this.order = options.order;

        if(options.services) {
            for(const key in options.services) {
                this.addService(options.services[key].service, undefined, options.includeClassName, options.routeFormat, options.syncServices);
                if(options.services[key].connectionKeys) {
                    if(Array.isArray(options.services[key].connectionKeys)) {
                        options.services[key].connectionKeys.forEach((k) => {
                            this.addConnections(options.services[key].service,k);
                        })
                    } else this.addConnections(options.services[key].service,options.services[key].connectionKeys);
                }
            }
        }
        if(options.connections){
            for(const key in options.connections) {
                this.addConnection({connection:options.connections[key], service:options.connections[key].service});
            }
        }
    }

    addConnection = (options:ConnectionProps|string,source?:string) => {
        let settings:ConnectionInfo = {} as any;

        if(source) settings.source = source;
        if(typeof options === 'string') {
            options = this.connections[options];
        } if(!options) return undefined;

        if(options.connection instanceof GraphNode) {
            settings.connection = options.connection;
            settings.source = 'local';
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
        } else if (options.connection instanceof Graph) {
            if(options.connection.nodes.get('open'))
                settings.service = options.connection;
            settings.source = 'local';
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
        } else {
            let c = options.connection;
            settings._id = c._id;
            settings.send = c.send;
            settings.request = c.request;
            settings.run = c.run;
            settings.post = c.post;
            settings.subscribe = c.subscribe;
            settings.unsubscribe = c.unsubscribe;
            settings.terminate = c.terminate;
            if(options.service) {            
                settings.service = options.service;
            } else if(c.graph) settings.service = c.graph;
            if(!settings.source && options.service) {
                settings.source = typeof options.service === 'string' ? options.service : options.service.name;
            }
        }

        if(!settings._id) settings._id = options._id ? options._id : `connection${Math.floor(Math.random()*1000000000000000)}`;
    
    
        if(settings.source) {
            if(!this.sources[settings.source])
                this.sources[settings.source] = {};
                this.sources[settings.source][settings._id] = settings;
        }

        this.connections[settings._id] = settings;

        return settings;
    }

    removeConnection = (connection:string|ConnectionInfo) => {
        if(typeof connection === 'string') {
            delete this.connections[connection];
            for(const key in this.sources) {
                if(this.sources[key][connection])
                    delete this.sources[key][connection];
            }
        } else {
            delete this.connections[connection._id];
            if(connection.source) delete this.sources[connection.source][connection._id];
        }
    }

    addService = (
        service:Service,
        connectionsKey?:any, //the object on the service we want to associate connections wtih
        includeClassName?:boolean,
        routeFormat?:string,
        syncServices?:boolean,
        order?:string[]
    ) => {
        this.load(service,includeClassName,routeFormat,this.customRoutes,this.customChildren);
        this.services[service.name] = service;
        if(connectionsKey) this.addConnections(service,connectionsKey);
        if(syncServices) this.syncServices(); //maps all uncommon nodes to each service 
        if(order) this.order = order;
        else this.order.push(service.name);
    }

    addConnections = ( //sync connection objects that match our boilerplate (send/request/terminate etc) for quicker piping
        service:Service,
        connectionsKey:any
    ) => {
        if(connectionsKey && service[connectionsKey]) {
            let newConnections = {};
            for(const key in service[connectionsKey]) {
                if(!this.connections[key]) 
                    newConnections[key] = this.addConnection({connection:service[connectionsKey][key]}, service.name);
            }
            return newConnections;
        }
    }

    openConnection = (service:string|Service, ...args:any[]) => {
        if(typeof service === 'string') {
            service = this.services[service];
        }
        if(service instanceof Service) {
            let connection = service.run('open', ...args);
            if(connection instanceof Promise) {
                connection.then((info) => {
                    this.addConnection({connection:info, service});
                })
            } else if(connection) {
                this.addConnection({connection, service});
            }
        }
    }

    terminate = (connection:string|ConnectionInfo) => {
        if(typeof connection === 'string') connection = this.connections[connection];
        return connection.terminate();
    }

    subscribeToConnection = (
        route:string, //the route on the endpoint we want to subscribe to outputs from
        router:string|ConnectionInfo, //the router we are trying to relay messages through
        transmitter:string|ConnectionInfo, //the endpoint on the router that we want to subscribe to through the router
        callback:string|((res:any)=>void),
        ...args:any[]
    ) => {
        if(typeof router === 'string') {
            if(this.sources[router]) {
                if(this.order) {
                    for(let i = 0; i < this.order.length; i++) {
                        let k = this.order[i];  
                        if(this.sources[router as string][k]?.run) {
                            router = this.sources[router as string][k];
                            break;
                        }
                    }
                }
            } else if (this.connections[router] && this.connections[router].run) {
                router = this.connections[router];
            } else return undefined;
        }
        if(typeof transmitter === 'object') {
            transmitter = transmitter._id;
        }

        return new Promise((res,rej) => {
            (router as any).run('subscribeConnection',[route,transmitter,(router as any)._id,...args]).then((sub) => {
                this.subscribe((transmitter as ConnectionInfo)._id, (res) => {
                    if(res?.callbackId === route) {
                        if(!callback) this.setState({[(transmitter as ConnectionInfo)._id]:res.args});
                        else if(typeof callback === 'string') { //just set state 
                            this.setState({[callback]:res.args});
                        }
                        else callback(res.args);
                    }
                });
                res(sub);
            }).catch(rej);
        })
    }

    //we will use the router to relay subscriptions between endpoints generically
    subscribeConnection = (
        route:string, //the route on the endpoint we want to subscribe to outputs from
        transmitter:string|ConnectionInfo, //the endpoint we want to subscribe to through the router
        receiver:string|ConnectionInfo, //the endpoint we want to receive messages on from the router
        ...args:any[]
    ) => {
        
        if(typeof receiver === 'string') {
            if(this.sources[receiver]) {
                if(this.order) {
                    for(let i = 0; i < this.order.length; i++) {
                        let k = this.order[i];  
                        if(this.sources[receiver as string][k]?.send) {
                            receiver = this.sources[receiver as string][k];
                            break;
                        }
                    }
                }
            } else if (this.connections[receiver] && this.connections[receiver].send) {
                receiver = this.connections[receiver];
            } else return undefined;
        }
        if(typeof transmitter === 'string') {
            if(this.sources[transmitter]) {
                if(this.order) {
                    for(let i = 0; i < this.order.length; i++) {
                        let k = this.order[i];  
                        if(this.sources[transmitter as string][k]?.subscribe) {
                            transmitter = this.sources[transmitter as string][k];
                            break;
                        }
                    }
                } else {
                    transmitter = Object.keys(this.sources[transmitter])[0];
                }
            } else if (this.connections[transmitter]) {
                transmitter = this.connections[transmitter];
            } else return undefined;
        }

        if((transmitter as ConnectionInfo)?.subscribe && (receiver as ConnectionInfo)?.send) {

            let res:Promise<number> = new Promise((res,rej) => {
                (transmitter as any).subscribe(
                    route,
                    (transmitter as any)._id,
                    (res:any) => {
                        (receiver as any).send({ callbackId:route, args:res });
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
            this.nodes.forEach((n) => {
                if(!this.services[name].nodes.get(n.tag)) {
                    this.services[name].nodes.set(n.tag,n);
                } 
            });
        }
    }

    routes:Routes={
        addConnection:this.addConnection,
        removeConnection:this.removeConnection,
        terminate:this.terminate,
        subscribeConnection:this.subscribeConnection,
        subscribeToConnection:this.subscribeToConnection
    }

}