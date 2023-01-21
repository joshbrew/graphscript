import { parseFunctionFromText, recursivelyStringifyFunctions } from "../utils"
import { Graph, GraphNodeProperties } from "../../core/Graph"
import { methodstrings } from "../../loaders/methodstrings";
import { recursivelyAssign } from "../Service";

export const nodeTemplates = {};

//Contains evals and other things you probably don't want wide open on an API, for running graphs over remote contexts
export const remoteGraphRoutes = {
    
    transferNode: (
        properties:Function|(GraphNodeProperties & { __methods?:{[key:string]:Function|string} })|string, 
        connection:any | Worker | WebSocket, //put any info connection template in with 
        name?:string 
    ) => {
        let str;
        if(typeof properties === 'object') {
            if(!properties.__node) { properties.__node = {}; }
            if(name) properties.__node.tag = name;
            
            for(const key in properties) {
                if(typeof properties[key] === 'function') {
                    if(!properties.__methods) properties.__methods = {};
                    properties.__methods[key] = properties[key].toString();
                }
            }
    
            str = recursivelyStringifyFunctions(properties);
    
        } else if (typeof properties === 'function') str = properties.toString();
        else if (typeof properties === 'string') str = properties;
        if(str) {

            if((connection as any).run) 
                return (connection as any).run('setNode',[str]);
            else if ((connection as Worker).postMessage) {
                (connection as Worker).postMessage({route:'setNode', args:str},undefined);
                return new Promise ((r) => r(name));
            } else if ((connection as WebSocket).send) {
                (connection as WebSocket).send(JSON.stringify({route:'setNode', args:str}));
                return new Promise ((r) => r(name));
        }
        }
    
    },

    setNode:function (
        properties:string|((...args:[])=>any)|(GraphNodeProperties & { __methods?:{[key:string]:Function|string} })
    ) {
        if(typeof properties === 'object') {
            if(properties.__methods) { //stringified methods
                if(!this.__node.graph.__node.loaders.methodstrings) {
                    this.__node.graph.__node.loaders.methodstrings = methodstrings;
                }
            }
        }
        if(typeof properties === 'string') {
            let f = parseFunctionFromText(properties);
            if(typeof f === 'function') properties = {__operator:f, __node:{tag:f.name}};
            else {
                f = JSON.parse(properties);
                if(typeof f === 'object') properties = f;
            }
        }
        if(typeof properties === 'object' || typeof properties === 'function') {
            let template = Object.assign({},properties);
            let node = this.__node.graph.add(properties);
            nodeTemplates[node.__node.tag] = template; //can just instantiate this again later
            return node.__node.tag;
        } else return false;
    },

    proxyRemoteNode:function (
        name:string,
        connection:any, //put any info connection template in with a .run function, does not work with base workers/sockets etc as it relies on our promise system
    ) {
        return new Promise((res,rej) => {
            connection.run('getNodeProperties',name).then((props:any)=>{
                let proxy = {};
                if(typeof props === 'object') {
                    for(const key in props) {
                        if(props[key] === 'function') {
                           proxy[key] = (...args:any) => {
                                return new Promise((r) => {
                                    connection.run(
                                        name,
                                        args,
                                        key
                                    ).then(r);
                                });
                           }
                        } else {
                            Object.defineProperty(
                                proxy,
                                key,
                                {
                                    get:()=>{
                                        return new Promise((r)=>{
                                            connection.run(
                                                name,
                                                undefined,
                                                key
                                            ).then((r))
                                        });
                                    },
                                    set:(value) => {
                                        connection.post(
                                            name,
                                            value,
                                            key
                                        )
                                    },
                                    configurable:true,
                                    enumerable:true
                                }
                            )
                        }
                    }
                }

                res(proxy);

            });
        });
    },

    makeNodeTransferrable:function (
        properties:GraphNodeProperties,
        name?:string
    ) {
        if(!properties.__node) { properties.__node = {}; }
        if(name) properties.__node.tag = name;
        
        for(const key in properties) {
            if(typeof properties[key] === 'function') {
                if(!properties.__methods) properties.__methods = {};
                properties.__methods[key] = properties[key].toString();
            }
        }

        const str = recursivelyStringifyFunctions(properties);

        return str;
    },

    setTemplate:function(        
        properties:string|((...args:[])=>any)|(GraphNodeProperties & { __methods?:{[key:string]:Function|string} }), 
        name?:string
    ) {
        if(typeof properties === 'object') {
            if(properties.__methods) { //stringified methods
                if(!this.__node.graph.__node.loaders.methodstrings) {
                    this.__node.graph.__node.loaders.methodstrings = methodstrings;
                }
            }
        }
        if(typeof properties === 'string') {
            let f = parseFunctionFromText(properties);
            if(typeof f === 'function') {
                if(!name) name = f.name;
                properties = {__operator:f, __node:{tag:name}};
            }
            else {
                f = JSON.parse(properties);
                if(typeof f === 'object') {
                    properties = f;
                    if(!name && f.__node?.tag) name = f.__node.tag;
                }
            }
        }
        if(!name) name = `node${Math.floor(Math.random()*1000000000000000)}`
        if(typeof properties === 'object' || typeof properties === 'function') {
            nodeTemplates[name] = properties;
            return name;
        } else return false;
    },

    loadFromTemplate:function(
        templateName:string, 
        name?:string
    ) {
        if(nodeTemplates[templateName]) {
            let cpy = recursivelyAssign({},nodeTemplates[templateName]);
            if(name) {
                if(!cpy.__node) cpy.__node = {};
                cpy.__node.tag = name;
            }
            let node = this.__node.graph.add(cpy);
            return node.__node.tag;
        }
    },

    setMethod:function(
        route:string,fn:string|((...args:[])=>any),
        methodKey?:string
    ){ //set a method on a route
        //console.log(fn, fnName)
        if(typeof fn === 'string') {
            let f = parseFunctionFromText(fn);
            if(typeof f === 'function') fn = f;
        }
        //console.log(fn);
        if(!methodKey && typeof fn === 'function') methodKey = fn.name;
        if(this.__node.graph.get(route)) {
            this.__node.graph.get(route)[methodKey] = fn; //overwrite method
        }
        else (this.__node.graph as Graph).add({__node:{tag:methodKey,[methodKey]:fn}});
        //console.log(this)
        return true;
    },

    assignNode:function(nodeTag:string,source:{[key:string]:any}) { //set values on a node
        //console.log(fn, fnName)
        if(this.__node.graph.get(nodeTag) && typeof source === 'object') {
            Object.assign(this.__node.graph.get(nodeTag),source);
        }
    },

    getNodeProperties:function(nodeTag:string) {
        let node = this.__node.graph.get(nodeTag);
        if(node) {
            let properties = Object.getOwnPropertyNames(node);
            let result = {};
            for(const key in properties) {
                result[key] = typeof node[key];
            }
            return result;
        } return undefined;
    },

    transferClass:(
        classObj:any, 
        connection:any | Worker | WebSocket, 
        className?:string 
    )=>{ //send a class over a remote service
        if(typeof classObj === 'object') {
            let str = classObj.toString();//needs to be a class prototype
            let message = {route:'receiveClass',args:[str,className]};
            if((connection as any).run) 
                return (connection as any).run('receiveClass',[str,className]);
            else if ((connection as Worker).postMessage) {
                (connection as Worker).postMessage({route:'receiveClass', args:[str,className]},undefined);
                return new Promise ((r) => r(name));
            } else if ((connection as WebSocket).send) {
                (connection as WebSocket).send(JSON.stringify({route:'receiveClass', args:[str,className]}));
                return new Promise ((r) => r(name));
            }
            return message;
        }
        return false;
    },

    receiveClass:function(stringified:string, className?:string){ //eval a class string and set it as a key on the local graph by class name, so this.__node.graph.method exists
        if(typeof stringified === 'string') {
            //console.log(stringified)
            if(stringified.indexOf('class') === 0) {
                let cls = (0,eval)('('+stringified+')');
                let name = className;
                
                if(!name)
                    name = cls.name; //get classname
                    this.__node.graph[name] = cls;
                
                return true;
            }
        }
        return false;
    },
    
    //requires unsafe service to load on other end
    transferFunction: (fn:Function, connection:any | Worker | WebSocket, fnName?:string) => {
        if(!fnName) fnName = fn.name;
        let str = fn.toString();//needs to be a class prototype
        let message = {route:'receiveClass',args:[str,fnName]};
        if((connection as any).run) 
            return (connection as any).run('setFunction',[str,fnName]);
        else if ((connection as Worker).postMessage) {
            (connection as Worker).postMessage({route:'setFunction', args:[str,fnName]},undefined);
            return new Promise ((r) => r(name));
        } else if ((connection as WebSocket).send) {
            (connection as WebSocket).send(JSON.stringify({route:'setFunction', args:[str,fnName]}));
            return new Promise ((r) => r(name));
        }
        return message;
    },

    setGlobal:(key:string, value:any) => { //set a value on the globalThis scope
        globalThis[key] = value;
        return true;
    },

    assignGlobalObject:(target:string, source:{[key:string]:any}) => { //assign a value on an object on the globalThis scope
        if(!globalThis[target]) return false;
        if(typeof source === 'object') Object.assign(globalThis[target],source);
        return true;
    },

    setValue:function(key:string, value:any) { //set a value on the graph scope
        this.__node.graph[key] = value;
        return true;
    },
    
    assignObject:function(target:string, source:{[key:string]:any}){ //assign a value on an object on the globalThis scope
        if(!this.__node.graph[target]) return false;
        if(typeof source === 'object') Object.assign( this.__node.graph[target],source);
        return true;
    },

    setGlobalFunction:(fn:any, fnName?:string) => { //set a value on the globalThis scope
        if(typeof fn === 'string') fn = parseFunctionFromText(fn);
        //console.log(fn);
        if(typeof fn === 'function') {
            if(!fnName) fnName = fn.name;
            globalThis[fnName] = fn;
            //console.log(this)
            return true;
        }
        return false;
    },
    
    setGraphFunction:function(fn:any, fnName?:string){ //set a value on the graph scope
        if(typeof fn === 'string') fn = parseFunctionFromText(fn);
        //console.log(fn);
        if(typeof fn === 'function') {
            if(!fnName) fnName = fn.name;
            this.__node.graph[fnName] = fn;
            //console.log(this)
            return true;
        }
        return false;
    }

}