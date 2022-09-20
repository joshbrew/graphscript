import { Graph, GraphNode, GraphNodeProperties, OperatorType, stringifyWithCircularRefs } from "../Graph";

/**
 * 
 * A service extends acyclic graph to enhance networking operations and aggregate for our microservices
 * 
 */

export type RouteProp = { //these are just multiple methods you can call on a route/node tag kind of like http requests but really it applies to any function you want to add to a route object if you specify that method even beyond these http themed names :D
    get?:((...args:any)=>any|void),
    post?:OperatorType|((...args)=>any|void), 
    put?:(...args:any)=>any|void,
    head?:(...args:any)=>any|void,
    delete?:(...args:any)=>any|void,
    patch?:(...args:any)=>any|void,
    options?:(...args:any)=>any|void,
    connect?:(...args:any)=>any|void,
    trace?:(...args:any)=>any|void,
    aliases?:string[] 
} & GraphNodeProperties

export type Class = { new(...args: any[]): any; };

export type Route = 
    GraphNode |
    GraphNodeProperties |
    Graph | Service |
    OperatorType |
    ((...args)=>any|void) |
    { aliases?:string[] } & GraphNodeProperties |
    RouteProp | Class | any

export type Routes = { //same as the tree in the base acyclic graph but adds aliases and RouteProps handling
    [key:string]: Route
}

export type ServiceMessage = {
    route?:string,  //the function/node to execute
    args?:any, //route args or data depending on what we're handling
    method?:string, //can specify get, post, etc. on http requests or on multiplexed routes using the RouteProp format
    node?:string|GraphNode, //alt tag for routes
    [key:string]:any //it's an object so do whatever, any messages meant for web protocols need to be stringified or buffered
}

export type ServiceOptions = {
    routes?:Routes|Routes[], 
    name?:string, 
    props?:{[key:string]:any}, 
    loadDefaultRoutes?:boolean,
    includeClassName?:boolean,
    routeFormat?:string,
    customRoutes?:{ //modify routes or execute other functions based on the route properties? e.g. addElement in DOMService
        [key:string]:(route:Route, routeKey:string, routes:Routes)=>Route|any|void
    },
    customChildren?:{ //modify child routes in the tree based on parent conditions
        [key:string]:(child:Route, childRouteKey:string, parent:Route, routes:Routes, checked:Routes)=>Route|any|void
    },
    sharedState?:boolean, //share state between services? default is true
    [key:string]:any
};

export type TypedArray =
| Int8Array
| Uint8Array
| Uint8ClampedArray
| Int16Array
| Uint16Array
| Int32Array
| Uint32Array
| Float32Array
| Float64Array;


export class Service extends Graph {

    //routes denote paths and properties callable across interfaces and inherited by parent services (adding the service name in the 
    // front of the route like 'http/createServer'.
    routes:Routes={}
    loadDefaultRoutes = false;
    keepState:boolean = true; //routes that don't trigger the graph on receive can still set state
    firstLoad = true;
    customRoutes:any = {};
    customChildren:any = {};

    constructor(options:ServiceOptions={}) {
        super(undefined,options.name ? options.name : `service${Math.floor(Math.random()*100000000000000)}`,options.props);
        if(options.name) this.name = options.name;
        else options.name = this.tag;
        
        if('loadDefaultRoutes' in options) {
            this.loadDefaultRoutes = options.loadDefaultRoutes;
            this.routes = Object.assign(this.defaultRoutes,this.routes);
        }
        
        if(options || Object.keys(this.routes).length > 0) this.init(options);
    }

    init = (options?:ServiceOptions) => {
        if(options) options = Object.assign({},options);
        else options = {};

        if(options.customRoutes) Object.assign(options.customRoutes,this.customRoutes);
        else options.customRoutes = this.customRoutes;
        
        if(options.customChildren) Object.assign(options.customChildren,this.customChildren);
        else options.customChildren = this.customChildren;
        
        if(Array.isArray(options.routes)) {
            options.routes.forEach((r) => {
                this.load(
                    r, 
                    options.includeClassName, 
                    options.routeFormat,
                    options.customRoutes,
                    options.customChildren,
                    options.sharedState
                );
            });
        }
        else if(options.routes || ((Object.keys(this.routes).length > 0 || this.loadDefaultRoutes) && this.firstLoad)) 
            this.load(
                options.routes, 
                options.includeClassName, 
                options.routeFormat,
                options.customRoutes,
                options.customChildren,
                options.sharedState
            ); //now process the routes for the acyclic graph to load them as graph nodes :-D
    }
    
    load = (
        routes?:Service|Graph|Routes|{name:string,module:{[key:string]:any}}|any, 
        includeClassName:boolean=true, //enumerate routes with the service or class name so they are run as e.g. 'http/createServer' so services don't accidentally overlap
        routeFormat:string='.',
        customRoutes:ServiceOptions["customRoutes"]=this.customRoutes,
        customChildren:ServiceOptions["customChildren"]=this.customChildren,
        sharedState:boolean = true
    ) => { 
        if(!routes && !this.loadDefaultRoutes && (Object.keys(this.routes).length > 0 || this.firstLoad)) return;
        if(this.firstLoad) this.firstLoad = false;

        if(customRoutes) customRoutes = Object.assign(this.customRoutes,customRoutes);
        else customRoutes = this.customRoutes;

        //console.log(this.routes);
        let service;
        let allRoutes = {};
        if(routes) {
            if(!(routes instanceof Graph) && (routes as any)?.name && !(routes.setTree)) { //class prototype
                if(routes.module) {
                    let mod = routes;
                    routes = {};
                    Object.getOwnPropertyNames(routes.module).forEach((prop) => { //iterate through 
                        if(includeClassName) routes[mod.name+routeFormat+prop] = routes.module[prop];
                        else routes[prop] =  routes.module[prop];
                    });
                } else if (typeof routes === 'function') { //it's a service prototype... probably
                    service = new routes({loadDefaultRoutes:this.loadDefaultRoutes});
                    service.load();

                    if(sharedState) service.state = this.state;

                    routes = service.routes;

                    if(service.customRoutes && !this.customRoutes) this.customRoutes = service.customRoutes;
                    else if (service.customRoutes && this.customRoutes) Object.assign(this.customRoutes,service.customRoutes);

                    if(service.customChildren && !this.customChildren) this.customChildren = service.customChildren;
                    else if (service.customChildren && this.customChildren) Object.assign(this.customChildren, service.customChildren);
                } 
            } //we can instantiate a class and load the routes. Routes should run just fine referencing the classes' internal data structures without those being garbage collected.
            else if (routes instanceof Graph || routes.source instanceof Graph || routes.setTree) { //class instance
                service = routes;
                routes = {};
                if(sharedState) service.state = this.state;
                if(includeClassName) {
                    let name = service.name;
                    if(!name) {
                        name = service.tag;
                        service.name = name;
                    }
                    if(!name) {
                        name = `graph${Math.floor(Math.random()*1000000000000000)}`;
                        service.name = name; 
                        service.tag = name;
                    }
                } 

                if(service.customRoutes && !this.customRoutes) this.customRoutes = service.customRoutes;
                else if (service.customRoutes && this.customRoutes) Object.assign(this.customRoutes,service.customRoutes);

                if(service.customChildren && !this.customChildren) this.customChildren = service.customChildren;
                else if (service.customChildren && this.customChildren) Object.assign(this.customChildren, service.customChildren);

                service.nodes.forEach((node)=>{
                    //if(includeClassName) routes[name+routeFormat+node.tag] = node;
                    //else 
                    routes[node.tag] = node;
                    
                    let checked = {};
                    let checkChildGraphNodes = (nd:GraphNode, par?:GraphNode) => {
                        if(!checked[nd.tag] || (par && includeClassName && !checked[par?.tag+routeFormat+nd.tag])) {
                            if(!par) checked[nd.tag] = true;
                            else checked[par.tag+routeFormat+nd.tag] = true;

                            if(nd instanceof Graph || nd.source instanceof Graph || nd.setTree) {
                                if(sharedState) nd.state = this.state;
                                if(includeClassName) {
                                    let nm = nd.name;
                                    if(!nm) {
                                        nm = nd.tag;
                                        nd.name = nm;
                                    }
                                    if(!nm) {
                                        nm = `graph${Math.floor(Math.random()*1000000000000000)}`;
                                        nd.name = nm; 
                                        nd.tag = nm;
                                    }
                                } 
                                nd.nodes.forEach((n) => {
                                    if(includeClassName && !routes[nd.tag+routeFormat+n.tag]) routes[nd.tag+routeFormat+n.tag] = n;
                                    else if(!routes[n.tag]) routes[n.tag] = n; 
                                    checkChildGraphNodes(n,nd);
                                });
                            }
                        }
                    }

                    checkChildGraphNodes(node);
                });
            }
            else if (typeof routes === 'object') {
                let name = routes.constructor.name;
                if(name === 'Object') {
                    name = Object.prototype.toString.call(routes);
                    if(name) name = name.split(' ')[1];
                    if(name) name = name.split(']')[0];
                } 
                if(name && name !== 'Object') { 
                    let module = routes;
                    routes = {};
                    Object.getOwnPropertyNames(module).forEach((route) => {
                        if(includeClassName) routes[name+routeFormat+route] = module[route];
                        else routes[route] = module[route];
                    });
                }
            }

            if((service instanceof Graph || service?.setTree) && service.name && includeClassName) {     
                //the routes provided from a service will add the route name in front of the route so like 'name/route' to minimize conflicts, 
                //incl making generic service routes accessible per service. The services are still independently usable while the loader 
                // service provides routes to the other services
                routes = Object.assign({},routes); //copy props to a new object so we don't delete the original service routes
                for(const prop in routes) { 
                    let route = routes[prop];
                    delete routes[prop]; 
                    routes[service.name+routeFormat+prop] = route;  //store the routes in the loaded service under aliases including the service name
                }
            } 

        }

        if(this.loadDefaultRoutes) {
            let rts = Object.assign({},this.defaultRoutes); //load all default routes
            if(routes) {
                Object.assign(rts,this.routes); //then load declared routesin this object
                routes = Object.assign(rts,routes); //then load new routes in constructor
            } else routes = Object.assign(rts,this.routes); //then load declared routesin this object
            
            //console.log(this.name,this.routes,routes);
            this.loadDefaultRoutes = false;
        }

        if(!routes) routes = this.routes;
        
        
        let incr = 0;
        for(const tag in routes) {
            incr++;
            let childrenIter = (route:RouteProp, routeKey:string) => {
                if(typeof route === 'object') {
                    if(!route.tag) route.tag = routeKey;
                    if(typeof route?.children === 'object') {
                        nested:
                        for(const key in route.children) {
                            incr++;
                            if(typeof route.children[key] === 'object') {
                                let rt = (route.children[key] as any);
                            
                                if(rt.tag && allRoutes[rt.tag]) continue;

                                if(customChildren) {
                                    for(const k in customChildren) {
                                        rt = customChildren[k](rt,key,route,routes,allRoutes);
                                        if(!rt) continue nested;
                                    }
                                }

                                if(rt.id && !rt.tag) {
                                    rt.tag = rt.id;
                                } 

                                let k:any;
                                if (rt.tag) {
                                    if(allRoutes[rt.tag]) {
                                        let randkey = `${rt.tag}${incr}`;
                                        allRoutes[randkey] = rt; 
                                        rt.tag = randkey;
                                        childrenIter(allRoutes[randkey],key)
                                        k = randkey;
                                    }
                                    else {
                                        allRoutes[rt.tag] = rt;
                                        childrenIter(allRoutes[rt.tag],key)
                                        k = rt.tag;
                                    }
                                } else {
                                    if(allRoutes[key]) {
                                        let randkey = `${key}${incr}`;
                                        allRoutes[randkey] = rt; 
                                        rt.tag = randkey;
                                        childrenIter(allRoutes[randkey],key)
                                        k = randkey;
                                    }
                                    else {
                                        allRoutes[key] = rt;
                                        childrenIter(allRoutes[key],key)
                                        k = key;
                                    }
                                }

                                if(service?.name && includeClassName) {
                                    allRoutes[service.name+routeFormat+k] = rt;
                                    delete allRoutes[k];
                                } else allRoutes[k] = rt;
                            }
                        }
                    }
                }
            }
            allRoutes[tag] = routes[tag]
            childrenIter(routes[tag],tag);
        }

        //console.log(Object.keys(allRoutes))
        top:
        for(const route in allRoutes) { //modify all routes incl children
            if(typeof allRoutes[route] === 'object') {
                let r = allRoutes[route] as RouteProp;

                if(typeof r === 'object') {

                    if(customRoutes) { //mutate routes or run custom node creation functions
                        for(const key in customRoutes) {
                            //console.log(r, r.constructor.name)
                            r = customRoutes[key](r,route,allRoutes);
                            if(!r) continue top; //nothing returned so continue
                        }
                    }
 
                    if(r.get) { //maybe all of the http method mimics should get some shared extra specifications? 
                        if(typeof r.get == 'object') {
                            
                        }
                    }
                    if(r.post) {}
                    if(r.delete) {}
                    if(r.put) {}
                    if(r.head) {}
                    if(r.patch) {}
                    if(r.options) {}
                    if(r.connect) {}
                    if(r.trace) {}

                    //console.log('route', r)
                    if(r.post && !r.operator) {
                        allRoutes[route].operator = r.post;
                    } else if (!r.operator && typeof r.get == 'function') {
                        allRoutes[route].operator = r.get;
                    }
                }
            }
        }

        for(const route in routes) {
            if(typeof routes[route] === 'object') {
                if(this.routes[route]) {
                    if(typeof this.routes[route] === 'object') Object.assign(this.routes[route],routes[route]);
                    else this.routes[route] = routes[route];
                } else this.routes[route] = routes[route];
            } else if(this.routes[route]) {
                if(typeof this.routes[route] === 'object') Object.assign(this.routes[route],routes[route]);
                else this.routes[route] = routes[route];
            } else this.routes[route] = routes[route];
        }

        if(service) {
            for(const key in this.routes) {
                if(this.routes[key] instanceof GraphNode || this.routes[key].constructor.name.includes('GraphNode')) {
                    this.nodes.set(key,this.routes[key]);
                    this.nNodes = this.nodes.size;
                }
            }
        }
        else this.setTree(this.routes);

        for(const prop in routes) { //now set the aliases on the routes, the aliases share the same node otherwise
            if((routes[prop] as any)?.aliases) {
                let aliases = (routes[prop] as any).aliases;
                aliases.forEach((a:string) => {
                    if(service?.name && includeClassName) this.routes[service.name+routeFormat+a] = routes[prop]; //we're just gonna copy the routes to the aliases for simplicity 
                    else this.routes[a] = routes[prop];
                });
            }
        }

        //console.log(this.name,this.routes);
        return this.routes;
    }

    unload = (routes:Service|Routes|any=this.routes) => { //tries to delete the nodes along with the routes, incl stopping any looping nodes
        if(!routes) return; 
        let service;
        if(!(routes instanceof Service) && typeof routes === 'function') {
            service = new Service();
            routes = service.routes;
        } //we can instantiate a class and load the routes. Routes should run just fine referencing the classes' internal data structures without those being garbage collected.
        else if (routes instanceof Service) {
            routes = routes.routes; //or pull routes from an existing class
        }
        for(const r in routes) {
            delete this.routes[r]; //this is its own object separate from the node tree map
            if(this.nodes.get(r)) this.remove(r);
        }

        return this.routes;
    }

    handleMethod = (
        route:string, 
        method:string, 
        args?:any
    ) => { //For handling RouteProp or other routes with multiple methods 
        let m = method.toLowerCase(); //lower case is enforced in the route keys
        let src = this.nodes.get(route);
        if(!src) {
            src = this.routes[route];
            if(!src) src = this.tree[route]; //maybe it's here?
        }
        if(src?.[m]) {
            if(!(src[m] instanceof Function)) {
                if(args) src[m] = args; //if args were passed set the value
                return src[m]; //could just be a stored local variable we are returning like a string or object
            }
            else return src[m](args); 
            
        }//these could be any function or property call
        else return this.handleServiceMessage({route,args,method}) //process normally if the method doesn't return
    }

    handleServiceMessage(message:ServiceMessage) {
        let call; 
        //console.log('message', message)
        if(typeof message === 'object') {
            if(message.route) call = message.route; else if (message.node) call = message.node;
        }
        if(call) {
            //console.log('call',call,'message',message, 'nodes:', this.nodes.keys(),this)
            if(Array.isArray(message.args)) return this.run(call,...message.args);
            else return this.run(call,message.args);
        } else return message;
    }

    handleGraphNodeCall(route:string|GraphNode, args:any) {
        if(!route) return args;
        if((args as ServiceMessage)?.args) {
            this.handleServiceMessage(args);
        }
        else if(Array.isArray(args)) return this.run(route,...args);
        else return this.run(route, args);
    }

    //transmit http requests, socket messages, webrtc, osc, etc. with this customizable callback
    transmit:(...args)=>any|void = (
        ...args:[ServiceMessage|any,...any[]]|any[]
    ) => {
        if(typeof args[0] === 'object') {
            if(args[0].method) { //run a route method directly, results not linked to graph
                return this.handleMethod(args[0].route, args[0].method, args[0].args);
            } else if(args[0].route) {
                return this.handleServiceMessage(args[0]);
            } else if (args[0].node){
                return this.handleGraphNodeCall(args[0].node, args[0].args);
            } else if(this.keepState) {    
                if(args[0].route)
                    this.setState({[args[0].route]:args[0].args});
                if(args[0].node)
                    this.setState({[args[0].node]:args[0].args});
            }
            return args;
        } else return args;
    } 

    //process http requests, socket messages, webrtc, osc, etc. with this customizable callback. This default still works in some scenarios
    receive:(...args)=>any|void = (
        ...args:[ServiceMessage|any,...any[]]|any[] //generalized args for customizing, it looks weird I know
    ) => {
        if(args[0]) if(typeof args[0] === 'string') {
            let substr = args[0].substring(0,8);
            if(substr.includes('{') || substr.includes('[')) {    
                if(substr.includes('\\')) args[0] = args[0].replace(/\\/g,""); //double jsonified string
                if(args[0][0] === '"') { args[0] = args[0].substring(1,args[0].length-1)};
                //console.log(args[0])
                args[0] = JSON.parse(args[0]); //parse stringified args
            }
        }

        if(typeof args[0] === 'object') {
            if(args[0].method) { //run a route method directly, results not linked to graph
                return this.handleMethod(args[0].route, args[0].method, args[0].args);
            } else if(args[0].route) {
                return this.handleServiceMessage(args[0]);
            } else if (args[0].node){
                return this.handleGraphNodeCall(args[0].node, args[0].args);
            } else if(this.keepState) {    
                if(args[0].route)
                    this.setState({[args[0].route]:args[0].args});
                if(args[0].node)
                    this.setState({[args[0].node]:args[0].args});
            } 
            return args;
        } else return args;
    }//these are fairly identical on the base template plus json parsing on the receive end

    //we may want to auto pipe outputs from a node through our frontend<-->backend service protocol
    pipe = (
        source:GraphNode|string, 
        destination:string, 
        endpoint?:string|any, //the address or websocket etc. of the endpoint on the service we're using, this is different e.g. for sockets or http
        method?:string, 
        callback?:(res:any)=>any|void
    ) => {
        if(source instanceof GraphNode) {
            if(callback) return source.subscribe((res)=>{
                let mod = callback(res); //either a modifier or a void function to do a thing before transmitting the data
                if(mod !== undefined) this.transmit({route:destination, args:mod, method});
                else this.transmit({route:destination, args:res, method}, endpoint);
            })
            else return this.subscribe(source,(res)=>{ this.transmit({route:destination, args:res, method}, endpoint); });
        }
        else if(typeof source === 'string') 
            return this.subscribe(source,(res)=>{ 
                this.transmit({route:destination, args:res, method}, endpoint); 
            });
    }

    //one-shot callback pipe e.g. to return results back through an endpoint
    pipeOnce = (
        source:GraphNode|string, 
        destination:string, 
        endpoint?:string|any, //the address or websocket etc. of the endpoint on the service we're using, this is different e.g. for sockets or http
        method?:string, 
        callback?:(res:any)=>any|void
    ) => {
        if(source instanceof GraphNode) {
            if(callback) return source.state.subscribeTriggerOnce(source.tag,(res)=>{
                let mod = callback(res); //either a modifier or a void function to do a thing before transmitting the data
                if(mod !== undefined) this.transmit({route:destination, args:mod, method});
                else this.transmit({route:destination, args:res, method},endpoint);
            })
            else return this.state.subscribeTriggerOnce(source.tag,(res)=>{ 
                this.transmit({route:destination, args:res, method},endpoint); });
        }
        else if(typeof source === 'string') 
            return this.state.subscribeTriggerOnce(source,(res)=>{ 
                this.transmit({route:destination, args:res, method},endpoint); 
            });
    }

    terminate = (...args:any) => {
       this.nodes.forEach((n) => {
           n.stopNode(); //stops any loops
       });
    }
    
    isTypedArray(x:any) { //https://stackoverflow.com/a/40319428
        return (ArrayBuffer.isView(x) && Object.prototype.toString.call(x) !== "[object DataView]");
    }

    recursivelyAssign = (target,obj) => {
        for(const key in obj) {
            if(typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                if(typeof target[key] === 'object' && !Array.isArray(target[key])) this.recursivelyAssign(target[key], obj[key]);
                else target[key] = this.recursivelyAssign({},obj[key]); 
            } else target[key] = obj[key];
        }
    
        return target;
    }
    
    //splice out a section of a typed array. If end is undefined we'll splice all values from the starting position to the end
    //if you want to replace values, just use .set, this is for quickly removing values to trim arrays e.g. if an entity is popped
    spliceTypedArray(arr:TypedArray,start:number,end?:number) {
        let s = arr.subarray(0,start)
        let e;
        if(end) {
            e = arr.subarray(end+1);
        }

        let n:TypedArray;
        if(s.length > 0 || e?.length > 0) n = new (arr as any).constructor(s.length+e.length); //use the same constructor
        if(s.length > 0) n.set(s);
        if(e && e.length > 0) n.set(e,s.length);

        return n;
    }
    
    defaultRoutes:Routes = { //declared at the end so everything on this class is defined to pass through as node props
        '/':{ //if no start page provided to HTTPbackend this will print instead on GET
            get:()=>{ //if only a get or post are defined the will become the operator for making graph calls
                return this.print();
            },
            aliases:['']
        } as RouteProp,
        ping:()=>{ //define functions, graph props, etc. All methods defined in a route object are callable
            console.log('ping');//this.transmit('pong');
            return 'pong';
        },
        echo:(...args:any)=>{ //this transmits input arguments, so to echo on a specific service do e.g. 'wss/echo'
            this.transmit(...args);
            return args;
        },
        assign:(source:{[key:string]:any}) => { //assign source to this
            if(typeof source === 'object') 
            {Object.assign(this,source);
            return true;} return false;
        },
        recursivelyAssign:(source:{[key:string]:any}) => { //assign source object to this
            if(typeof source === 'object') 
            {this.recursivelyAssign(this,source);
            return true;} return false;
        },
        log:{ //console.log/info
            post:(...args:any)=>{
                console.log("Log: ",...args);
            },
            aliases:['info']
        } as RouteProp,
        error:(message:string)=>{ //console.error
            let er = new Error(message);
            console.error(message);
            return er;
        },
        state:(key?:string) => { //get state values
            if(key) {
                return this.state.data[key];
            }
            else return this.state.data;
        },
        printState:(key?:string) => {
            if(key) {
                return stringifyWithCircularRefs(this.state.data[key]);
            } else return stringifyWithCircularRefs(this.state.data);
        },
        //bunch of methods generically available on routes for each service e.g. 'http/run' :-O
        spliceTypedArray:this.spliceTypedArray,
        transmit:this.transmit,
        receive:this.receive,
        load:this.load,
        unload:this.unload,
        pipe:this.pipe,
        terminate:this.terminate,
        run:this.run,
        subscribe:this.subscribe,
        subscribeNode:this.subscribeNode,
        unsubscribe:this.unsubscribe,
        stopNode:this.stopNode,
        get:this.get,
        add:this.add,
        remove:this.remove,
        setTree:this.setTree,
        setState:this.setState,
        print:this.print,
        reconstruct:this.reconstruct,
        handleMethod:this.handleMethod,
        handleServiceMessage:this.handleServiceMessage,
        handleGraphNodeCall:this.handleGraphNodeCall
    }

}