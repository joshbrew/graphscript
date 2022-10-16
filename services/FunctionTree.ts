import { EventHandler } from "./EventHandler";


export type FunctionNode = {
    operator:Function|string, 
    children?:{[key:string]:Function|FunctionNode},
    [key:string]:any
};

export type FunctionTreeProps = {[key:string]:FunctionNode|Function}

//micro graph tree execution without the flow logic except for automatic propagation to {children:{[key:string]:Function|MessengerNode}}
export class FunctionTree {

    routes:{[key:string]:FunctionNode|Function};
    nodes:Map<string, Function>=new Map();
    _returnServiceMessage?:boolean;
    state?:EventHandler;

    constructor(options:{
        routes:{[key:string]:FunctionNode|Function},  
        state:EventHandler,
        returnMessageFormat?:boolean
    }) {
        this.routes = options.routes;
        if(options.returnMessageFormat) this._returnServiceMessage = options.returnMessageFormat;
        if(options.state) this.state = options.state;
    }

    setTree = (
        tree:FunctionTreeProps,
        transform?:(node:FunctionNode, key:string, parent:{[key:string]:FunctionNode|Function}|FunctionNode,tree:FunctionTreeProps)=>Function|FunctionNode //we could run a callback with each route (or a callback that calls a series of callbacks :P) for additional setup powers 
    ) => {
        const setRoute = (rt:any,key:string,parent:{[key:string]:FunctionNode|Function}|FunctionNode) => {
            if((typeof rt === 'string' || rt == true) && typeof parent?.children === 'object') { //we are using a tag 
                setTimeout(()=>{
                    if(typeof rt === 'string') rt = this.nodes.get(rt);
                    else if(rt === true) rt = this.nodes.get(key);
                    (parent.children as any)[key] = rt;
                    if(rt) {
                        if(typeof rt === 'object'){
                            rt = Object.assign({},rt); //copy the route
                        }
                        if(typeof parent.tag === 'string') {
                            rt.tag = parent.tag+'.'+key;
                        } 
                        if(transform) {
                            let r =  transform(rt,key,parent,tree); //run some callback on the route
                            if(r) rt = r; //can replace the route if it returns something
                        }
                        this.nodes.set(rt.tag,rt);
                    }
                },0.001)
            } else {
    
                if(transform) {
                    let r =  transform(rt,key,parent,tree); //run some callback on the route
                    if(r) rt = r; //can replace the route if it returns something
                }

                if(typeof rt === 'function') {
                    rt = {operator:rt};
                    if(rt.name) {
                        if(typeof parent.tag === 'string') {
                            rt.tag = parent.tag+'.'+rt.name;
                        }
                        else rt.tag = rt.name;
                    }
                }
                if(typeof rt === 'object') {
                    if(typeof rt.operator === 'string') {
                        rt.operator = this.nodes.get(rt.operator);
                        if(typeof rt.operater === 'object') rt.operator = rt.operator.operator;
                    } if(typeof rt.operator === 'function') {
                        rt.operator.bind(rt); //bind non-arrow functions to the object's 'this' context
                        if(!rt.tag) {
                            if(typeof parent.tag === 'string') rt.tag = parent.tag+'.'+(rt.operator as Function).name;
                            else rt.tag = (rt.operator as Function).name;
                            
                        }
                    } else if(rt.tag) {
                        rt.operator = this.nodes.get(rt.tag); //get the node which could be a function or object
                        if(typeof rt.operator === 'object') rt.operator = rt.operator; //if object grab the operator
                    }
                    if(!rt.tag) {
                        if(typeof parent.tag === 'string') rt.tag = parent.tag+'.'+key;
                        else rt.tag = key;
                    }
    
                    if(typeof rt?.children === 'object') {
                        for(const key in rt.children) {
                            setRoute(rt.children[key],key,parent);
                        }
                    }

                    if(rt.tag) this.nodes.set(rt.tag,rt);
                } //MessengerNode/GraphNodeProperties
            }
        }

        for(const nm in tree) {
            setRoute(tree[nm],nm,tree);
        }
    }

    //receiving a service message which tells which route to execute next via an object property, used for remote control between classes, 
    //   which can be on separate threads and servers, we are just organizing the way we talk to each other
    receive = (data:{route:string, args:any}) => {
        if(data?.route) {
            if(Array.isArray(data.args)) {
                return this.run(data.route,...data.args);
            } else return this.run(data.route,data.args);
        } //that's it! The functions handle worker communication internally
    }

    //running functions and children without any of the flow and state logic so pure input/output with the option to resolve service messages to receive on other messengers
    run = (fn:string|Function|FunctionNode, ...args:any) => {
        if(typeof fn === 'string') {
            fn = this.nodes.get(fn) as any;
        }
        if(typeof fn === 'function') {
            let r = fn(...args);
            
            if(r instanceof Promise) {
                return new Promise((res) => {
                    r.then((rr) => {
                        if(this.state && (fn as Function).name) {this.state.setState({[(fn as Function).name]:rr})};
                        if(this._returnServiceMessage) res({route:(fn as Function).name, args:rr});
                        else res(rr);
                    })
                });
            } else {
                if(this.state && (fn as Function).name) {this.state.setState({[(fn as Function).name]:r})}
                if(this._returnServiceMessage) return {route:(fn as Function).name, args:r};
                else return r;
            }
        } else if(typeof fn === 'object') {
            if(typeof fn?.operator === 'function') {
                let r = fn.operator(...args);
                if(r instanceof Promise) {
                    return new Promise((res) => {
                        r.then((rr) => {
                            if((fn as FunctionNode).children) {
                                for(const key in (fn as FunctionNode).children) {
                                    this.run(((fn as FunctionNode).children as any)[key] as Function|FunctionNode, rr);
                                }
                            }
                            if(this.state && (fn as FunctionNode).tag) {this.state.setState({[(fn as FunctionNode).tag]:rr})}
                            else if(this.state && ((fn as FunctionNode).operator as Function).name) {this.state.setState({[((fn as FunctionNode).operator as Function).name]:rr})}
                             
                            if(this._returnServiceMessage) res({route:(fn as Function).name, args:rr});
                            else res(rr);
                        });
                    });
                
                } else {
                    if(fn.children) {
                        for(const key in fn.children) {
                            this.run(fn.children[key] as Function|FunctionNode, r);
                        } 
                        if(this.state && (fn as FunctionNode).tag) {this.state.setState({[(fn as FunctionNode).tag]:r});}
                        else if(this.state && ((fn as FunctionNode).operator as Function).name) {this.state.setState({[((fn as FunctionNode).operator as Function).name]:r});}
                    }
                }
                if(this._returnServiceMessage) return {route:fn.operator.name, args:r};
                return r;
            }
        }
    }

    subscribe = (node:string,callback:(res:any)=>void|string) => {
        if(!this.state) return;
        if(typeof callback === 'string' && this.nodes.get(callback)) {
            return this.state.subscribeTrigger(node, (r)=>{ this.run(callback,r); })
        } 
        else if(typeof callback === 'function') return this.state.subscribeTrigger(node,callback);
    }

    unsubscribe =(node:string,sub:number) => {
        if(!this.state) return;
        this.state.unsubscribeTrigger(node,sub);
    }

}


/*

let t = new FunctionTree({
    routes:{
        'add':(a=3,b=2)=>{return a+b;}
        'multiply':(a=3,b=2)=>{return a*b},
        'sequence:{
            operator:'multiply',
            children:{
                'add':true
            }
        }
    },

});

t.subscribe('sequence.add',(result)=>{console.log(result);});

t.run('add',3,4);
t.run('sequence',3,4); //should log the subscription


*/