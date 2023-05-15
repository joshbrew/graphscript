import { getCallbackFromString, wrapArgs } from "../../src/core/Graph";


export let replaceListenerArg = (
    graph,
    listener, //get this off the node
    arg:string|{__input:string,__args?:any[]},
    position:{[key:number]:true|{[key:number]:true|any}}
) => {

    let foundPosition = false;
    let depth = position;
    let tracea = listener.arguments;  // the prototype string-based structure
    let traceb = listener.__args; // the wrapped functions, same structure
    while(!foundPosition) {
        let key = Object.keys(depth)[0];
        if(tracea[key]) {
            if(typeof depth[key] === 'object' && tracea[key].__args) {
                depth = depth[key]
                tracea = tracea[key].__args;
                traceb = traceb[key].__args;
            } else if (depth[key] == true) {
                tracea[key] = arg; //replace the prototype
                let callback;
                if(typeof arg === 'string')
                    callback = getCallbackFromString(arg, graph);
                else if (typeof arg === 'object') {
                    callback = getCallbackFromString(arg.__input, graph);
                    if(typeof callback === 'function' && arg.__args && !arg.__args[0]?.__callback) { //unwrapped (fresh) args
                        let wrapped = wrapArgs(callback, arg.__args, graph);
                        callback = wrapped.__callback;
                        traceb[key].__args = wrapped.__args;
                    }
                }
                traceb[key].__callback = callback; //replace the callback
                foundPosition = true;
            }
        } else break;
    }

    return;

}
