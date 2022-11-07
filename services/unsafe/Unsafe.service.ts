import { parseFunctionFromText } from "../utils"
import { Graph } from "../../Graph"
import { Service } from "../Service";

//Contains evals and other things you probably don't want wide open on an API
export const unsafeRoutes = {
    
    //add a route and parse it from text
    setRoute:function(fn:string|((...args:[])=>any),fnName?:string){
        //console.log(fn, fnName)
        //if(fnName === 'setupChart') console.log(fn);
        if(typeof fn === 'string') fn = parseFunctionFromText(fn);
        //if(fnName === 'setupChart') console.log(fn);
        if(typeof fn === 'function') {
            if(!fnName) fnName = fn.name;
            if(this.__node.graph.get(fnName)) {
                this.__node.graph.get(fnName).__setOperator(fn); //overwrite operator
            }
            else {
                let node = (this.__node.graph as Graph).add({__node:{tag:fnName},__operator:fn});
            }
            return true;
        }
        return false;
    },
    setNode:function(fn:string|((...args:[])=>any),fnName?:string){
        //console.log(fn, fnName)
        if(typeof fn === 'string') fn = parseFunctionFromText(fn);
        //console.log(fn);
        if(typeof fn === 'function') {
            if(!fnName) fnName = fn.name;
            if(this.__node.graph.get(fnName)) {
                this.__node.graph.get(fnName).__setOperator(fn); //overwrite operator
            }
            else (this.__node.graph as Graph).add({__node:{tag:fnName},__operator:fn});
            //console.log(this)
            return true;
        }
        return false;
    },
    setMethod:function(route:string,fn:string|((...args:[])=>any),fnName?:string){ //set a method on a route
        //console.log(fn, fnName)
        if(typeof fn === 'string') fn = parseFunctionFromText(fn);
        //console.log(fn);
        if(typeof fn === 'function') {
            if(!fnName) fnName = fn.name;
            if(this.__node.graph.get(route)) {
                this.__node.graph.get(route)[fnName] = fn; //overwrite method
            }
            else (this.__node.graph as Graph).add({__node:{tag:fnName,[fnName]:fn}});
            //console.log(this)
            return true;
        }
        return false;
    },
    assignRoute:function(route:string,source:{[key:string]:any}) { //set values on a route
        //console.log(fn, fnName)
        if(this.__node.graph.get(route) && typeof source === 'object') {
            Object.assign(this.__node.graph.get(route),source);
        }
    },
    transferClass:(classObj:any, className?:string)=>{ //send a class over a remote service
        if(typeof classObj === 'object') {
            let str = classObj.toString();//needs to be a class prototype
            let message = {route:'receiveClass',args:[str,className]};

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
    assignFunctionToGlobalObject:function (globalObjectName:string, fn:any, fnName:any) { //assign a value on an object on the globalThis scope
        if(! globalThis[globalObjectName]) return false;
        if(typeof fn === 'string') fn = parseFunctionFromText(fn);
        //console.log(fn);
        if(typeof fn === 'function') {
            if(!fnName) fnName = fn.name;
            this.__node.graph[globalObjectName][fnName] = fn;
            //console.log(this)
            return true;
        }
        return false;
    },
    setFunction:function(fn:any, fnName?:string){ //set a value on the globalThis scope
        if(typeof fn === 'string') fn = parseFunctionFromText(fn);
        //console.log(fn);
        if(typeof fn === 'function') {
            if(!fnName) fnName = fn.name;
            this.__node.graph[fnName] = fn;
            //console.log(this)
            return true;
        }
        return false;
    },
    assignFunctionToObject:function(objectName:string, fn:any, fnName:any) { //assign a value on an object on the globalThis scope
        if(! this.__node.graph[objectName]) return false;
        if(typeof fn === 'string') fn = parseFunctionFromText(fn);
        //console.log(fn);
        if(typeof fn === 'function') {
            if(!fnName) fnName = fn.name;
            this.__node.graph[objectName][fnName] = fn;
            //console.log(this)
            return true;
        }
        return false;
    }
}