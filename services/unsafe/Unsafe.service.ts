import { GraphNode, parseFunctionFromText } from "../../Graph"
import { Graph } from "../../Graph"

//Contains evals and other things you probably don't want wide open on an API
export const unsafeRoutes = {
    
    //add a route and parse it from text
    setRoute:(self:GraphNode,origin:any,fn:string|((...args:[])=>any),fnName?:string) => {
        //console.log(origin, fn, fnName)
        if(typeof fn === 'string') fn = parseFunctionFromText(fn);
        //console.log(fn);
        if(typeof fn === 'function') {
            if(!fnName) fnName = fn.name;
            if(self.graph.get(fnName)) {
                self.graph.get(fnName).setOperator(fn); //overwrite operator
            }
            else (self.graph as Graph).add({tag:fnName,operator:fn});
            //console.log(self)
            return true;
        }
        return false;
    },
    transferClass:(classObj:any)=>{ //send a class over a remote service
        if(typeof classObj === 'object') {
            let str = classObj.toString();//needs to be a class prototype
            let message = {route:'receiveClass',args:str};

            return message;
        }
        return false;
    },
    receiveClass:(self:GraphNode,origin:any,stringified:string)=>{ //eval a class string and set it as a key on the local graph by class name, so self.graph.method exists
        if(typeof stringified === 'string') {
            if(stringified.indexOf('class') === 0) {
                let cls = (0,eval)('('+stringified+')');
                let name = cls.name; //get classname
                self.graph[name] = cls;
                return true;
            }
        }
        return false;
    }
}