import { Graph, GraphNode, GraphOptions } from "../Graph2";
import {loaders} from '../Loaders';


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

export type ServiceMessage = {
    route?:string,  //the function/node to execute
    args?:any, //route args or data depending on what we're handling
    method?:string, //can specify get, post, etc. on http requests or on multiplexed routes using the RouteProp format
    node?:string|GraphNode, //alt tag for routes
    [key:string]:any //it's an object so do whatever, any messages meant for web protocols need to be stringified or buffered
}

export type ServiceOptions = GraphOptions & { services:Service|Function|{[key:string]:any} }

export class Service extends Graph {
    
    name = `service${Math.floor(Math.random()*1000000000000000)}`;

    constructor(options?:ServiceOptions) {
        super({ //assign properties to the graph
                ...options,
                loaders: options?.loaders ? Object.assign({...loaders},options.loaders) : {...loaders}
                //tree:
        });

        if(options?.services) {
            for(const s in options.services) {
                if(typeof options.services[s] === 'function') this.setTree(new options.services[s]()); //instantiate a constructor
                else if(typeof options.services[s] === 'object') this.setTree(options.services[s]);
            }
        }

        this.setTree(this);
    }


    handleMethod = (
        route:string, 
        method:string, 
        args?:any
    ) => { //For handling RouteProp or other routes with multiple methods 
        let m = method.toLowerCase(); //lower case is enforced in the route keys
        let src = this._node.nodes.get(route);
        if(!src) {
            src = this._node.tree[route];
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
            } else if(this._node.keepState) {    
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
            } else if(this._node.keepState) {    
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
            if(callback) return this.subscribe(source,undefined,(res)=>{
                let mod = callback(res); //either a modifier or a void function to do a thing before transmitting the data
                if(mod !== undefined) this.transmit({route:destination, args:mod, method});
                else this.transmit({route:destination, args:res, method}, endpoint);
            })
            else return this.subscribe(source,undefined,(res)=>{ this.transmit({route:destination, args:res, method}, endpoint); });
        }
        else if(typeof source === 'string') 
            return this.subscribe(source,undefined,(res)=>{ 
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
            if(callback) return source._node.state.subscribeTriggerOnce(source._node.tag,(res)=>{
                let mod = callback(res); //either a modifier or a void function to do a thing before transmitting the data
                if(mod !== undefined) this.transmit({route:destination, args:mod, method});
                else this.transmit({route:destination, args:res, method},endpoint);
            })
            else return this._node.state.subscribeTriggerOnce(source._node.tag,(res)=>{ 
                this.transmit({route:destination, args:res, method},endpoint); });
        }
        else if(typeof source === 'string') 
            return this._node.state.subscribeTriggerOnce(source,(res)=>{ 
                this.transmit({route:destination, args:res, method},endpoint); 
            });
    }

    terminate = (...args:any) => {}
    
    isTypedArray = isTypedArray;
    recursivelyAssign = recursivelyAssign;
    spliceTypedArray = spliceTypedArray;
    ping = ()=>{ //define functions, graph props, etc. All methods defined in a route object are callable
        console.log('pinged');//this.transmit('pong');
        return 'pong';
    }
    echo = (...args:any)=>{ //this transmits input arguments, so to echo on a specific service do e.g. 'wss/echo'
        this.transmit(...args);
        return args;
    }
    
}


export function isTypedArray(x:any) { //https://stackoverflow.com/a/40319428
    return (ArrayBuffer.isView(x) && Object.prototype.toString.call(x) !== "[object DataView]");
}

export const recursivelyAssign = (target,obj) => {
    for(const key in obj) {
        if(typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            if(typeof target[key] === 'object' && !Array.isArray(target[key])) recursivelyAssign(target[key], obj[key]);
            else target[key] = recursivelyAssign({},obj[key]); 
        } else target[key] = obj[key];
    }

    return target;
}

//splice out a section of a typed array. If end is undefined we'll splice all values from the starting position to the end
//if you want to replace values, just use .set, this is for quickly removing values to trim arrays e.g. if an entity is popped
export function spliceTypedArray(arr:TypedArray,start:number,end?:number):TypedArray {
    let s = arr.subarray(0,start)
    let e;
    if(end) {
        e = arr.subarray(end+1);
    }

    let ta;
    if(s.length > 0 || e?.length > 0) ta = new (arr as any).constructor(s.length+e.length); //use the same constructor
    if(ta) {
        if(s.length > 0) ta.set(s);
        if(e && e.length > 0) ta.set(e,s.length);
    }
    return ta as TypedArray;
}
