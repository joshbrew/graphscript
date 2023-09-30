

export let recursivelyStringifyFunctions = (obj:{[key:string]:any}) => {
    let cpy = {};
    for(const key in obj) {
        if(typeof obj[key] === 'object') {
            cpy[key] = recursivelyStringifyFunctions(obj[key]);
        }
        else if (typeof obj[key] === 'function') {
            cpy[key] = obj[key].toString();
        } else cpy[key] = obj[key];
    } 
    return cpy;
}

export function getFnParamNames(fn){
    if(typeof fn !== 'string') fn = fn.toString();
    const arrowMatch = fn.match(/\(?[^]*?\)?\s*=>/) 
    if (arrowMatch) return arrowMatch[0].replace(/[()\s]/gi,'').replace('=>','').split(',')
    const match = fn.match(/\([^]*?\)/) 
    return match ? match[0].replace(/[()\s]/gi,'').split(',') : []
}

export let getFunctionHead = (methodString) => {
    let startindex = methodString.indexOf('=>')+1;
    if(startindex <= 0) {
        startindex = methodString.indexOf('){');
    }
    if(startindex <= 0) {
        startindex = methodString.indexOf(') {');
    }
    return methodString.slice(0, methodString.indexOf('{',startindex) + 1);
}

export function parseFunctionFromText(method='') {
    //Get the text inside of a function (regular or arrow);
    let getFunctionBody = (methodString) => {
        return methodString.replace(/^\W*(function[^{]+\{([\s\S]*)\}|[^=]+=>[^{]*\{([\s\S]*)\}|[^=]+=>(.+))/i, '$2$3$4');
    }

    let newFuncHead = getFunctionHead(method);
    let newFuncBody = getFunctionBody(method);

    let newFunc;
    if (newFuncHead.includes('function')) {
        let varName = newFuncHead.substring(newFuncHead.indexOf('(')+1,newFuncHead.lastIndexOf(')'));
        newFunc = new Function(varName, newFuncBody);
    } else {
        if (newFuncHead.substring(0, 6) === newFuncBody.substring(0, 6)) {
            let varName = newFuncHead.substring(newFuncHead.indexOf('(')+1,newFuncHead.lastIndexOf(')'));
            newFunc = new Function(varName, newFuncBody.substring(newFuncBody.indexOf('{') + 1, newFuncBody.length - 1));
        } else {
            try { newFunc = (0, eval)(method); } catch { } // Just evaluate the method
        }
    }

    return newFunc;

}

//parse stringified object with stringified functions
export function reconstructObject(json:string|{[x:string]: any}='{}') {
    try{

        // Allow raw object
        let parsed = (typeof json === 'string') ? JSON.parse(json) : json

        const parseObj = (obj) => {
            for(const prop in obj) {
                if(typeof obj[prop] === 'string') {
                    let funcParsed = parseFunctionFromText(obj[prop]);
                    if(typeof funcParsed === 'function') {
                        obj[prop] = funcParsed;
                    }
                } else if (typeof obj[prop] === 'object') {
                    parseObj(obj[prop]);
                }
            }
            return obj;
        }

        return parseObj(parsed);
    } catch(err) {console.error(err); return undefined;}

}

export const stringifyWithCircularRefs = (function() {
    const refs = new Map();
    const parents:any[] = [];
    const path = ["this"];

    function clear() {
        refs.clear();
        parents.length = 0;
        path.length = 1;
    }

    function updateParents(key, value) {
        var idx = parents.length - 1;
        var prev = parents[idx];
        if(typeof prev === 'object') {
            if (prev[key] === value || idx === 0) {
                path.push(key);
                parents.push(value.pushed);
            } else {
                while (idx-- >= 0) {
                    prev = parents[idx];
                    if(typeof prev === 'object') {
                        if (prev[key] === value) {
                            idx += 2;
                            parents.length = idx;
                            path.length = idx;
                            --idx;
                            parents[idx] = value;
                            path[idx] = key;
                            break;
                        }
                    }
                    idx--;
                }
            }
        }
    }

    function checkCircular(key, value) {
    if (value != null) {
        if (typeof value === "object") {
        if (key) { updateParents(key, value); }

        let other = refs.get(value);
            if (other) {
                return '[Circular Reference]' + other;
            } else {
                refs.set(value, path.join('.'));
            }
        }
    }
    return value;
    }

    return function stringifyWithCircularRefs(obj, space?) {
    try {
        parents.push(obj);
        return JSON.stringify(obj, checkCircular, space);
    } finally {
        clear();
    }
    }
})();

if((JSON as any).stringifyWithCircularRefs === undefined) {
    //Workaround for objects containing DOM nodes, which can't be stringified with JSON. From: https://stackoverflow.com/questions/4816099/chrome-sendrequest-error-typeerror-converting-circular-structure-to-json
    (JSON as any).stringifyWithCircularRefs = stringifyWithCircularRefs;
}


export const stringifyWithFunctionsAndCircularRefs = (function() {
    const refs = new Map();
    const parents:any[] = [];
    const path = ["this"];

    function clear() {
        refs.clear();
        parents.length = 0;
        path.length = 1;
    }

    function updateParents(key, value) {
        var idx = parents.length - 1;
        var prev = parents[idx];
        if(typeof prev === 'object') {
            if (prev[key] === value || idx === 0) {
                path.push(key);
                parents.push(value.pushed);
            } else {
                while (idx-- >= 0) {
                    prev = parents[idx];
                    if(typeof prev === 'object') {
                        if (prev[key] === value) {
                            idx += 2;
                            parents.length = idx;
                            path.length = idx;
                            --idx;
                            parents[idx] = value;
                            path[idx] = key;
                            break;
                        }
                    }
                    idx--;
                }
            }
        }
    }

    function checkCircular(key, value) {
    if (value != null) {
        if (typeof value === "object") {
        if (key) { updateParents(key, value); }

        let other = refs.get(value);
            if (other) {
                return '[Circular Reference]' + other;
            } else {
                refs.set( typeof value === 'function' ? value.toString() : value, path.join('.'));
            }
        }
    }
        return typeof value === 'function' ? value.toString() : value;
    }

    return function stringifyWithFunctionsAndCircularRefs(obj, space?) {
    try {
        parents.push(obj);
        return JSON.stringify(obj, checkCircular, space);
    } finally {
        clear();
    }
    }
})();

if((JSON as any).stringifyWithFunctionsAndCircularRefs === undefined) {
    //Workaround for objects containing DOM nodes, which can't be stringified with JSON. From: https://stackoverflow.com/questions/4816099/chrome-sendrequest-error-typeerror-converting-circular-structure-to-json
    (JSON as any).stringifyWithFunctionsAndCircularRefs = stringifyWithFunctionsAndCircularRefs;
}
//partial stringification for objects and removing circular references. This allows MUCH faster object equivalency comparison with three-tier depth checking
export const stringifyFast = (function() {
    const refs = new Map();
    const parents:any = [];
    const path = ["this"];

    function clear() {
        refs.clear();
        parents.length = 0;
        path.length = 1;
    }

    function updateParents(key, value) {
        var idx = parents.length - 1;
        //console.log(idx, parents[idx])
        if(parents[idx]){
            var prev = parents[idx];
            //console.log(value); 
            if(typeof prev === 'object') {
                if (prev[key] === value || idx === 0) {
                    path.push(key);
                    parents.push(value.pushed);
                } else {
                    while (idx-- >= 0) {
                        prev = parents[idx];
                        if(typeof prev === 'object') {
                            if (prev[key] === value) {
                                idx += 2;
                                parents.length = idx;
                                path.length = idx;
                                --idx;
                                parents[idx] = value;
                                path[idx] = key;
                                break;
                            }
                        }
                        idx++;
                    }
                }
            }
        }
    }

    function checkValues(key, value) {
        let val;
        if (value != null) {
            if (typeof value === "object") {
                //if (key) { updateParents(key, value); }
                let c = value.constructor.name;
                if (key && c === 'Object') {updateParents(key, value); }

                let other = refs.get(value);
                if (other) {
                    return '[Circular Reference]' + other;
                } else {
                    refs.set(value, path.join('.'));
                }
                if(c === "Array") { //Cut arrays down to 100 samples for referencing
                    if(value.length > 20) {
                        val = value.slice(value.length-20);
                    } else val = value;
                   // refs.set(val, path.join('.'));
                }  
                else if (c.includes("Set")) {
                    val = Array.from(value)
                }  
                else if (c !== "Object" && c !== "Number" && c !== "String" && c !== "Boolean") { //simplify classes, objects, and functions, point to nested objects for the state manager to monitor those properly
                    val = "instanceof_"+c;
                }
                else if (c === 'Object') {
                    let obj = {};
                    for(const prop in value) {
                        if (value[prop] == null){
                            obj[prop] = value[prop]; 
                        }
                        else if(Array.isArray(value[prop])) { 
                            if(value[prop].length>20)
                                obj[prop] = value[prop].slice(value[prop].length-20); 
                            else obj[prop] = value[prop];
                        } //deal with arrays in nested objects (e.g. means, slices)
                        else if (value[prop].constructor.name === 'Object') { //additional layer of recursion for 3 object-deep array checks
                            obj[prop] = {};
                            for(const p in value[prop]) {
                                if(Array.isArray(value[prop][p])) {
                                    if(value[prop][p].length>20)
                                        obj[prop][p] = value[prop][p].slice(value[prop][p].length-20); 
                                    else obj[prop][p] = value[prop][p];
                                }
                                else { 
                                    if (value[prop][p] != null){
                                        let con = value[prop][p].constructor.name;
                                        if (con.includes("Set")) {
                                            obj[prop][p] = Array.from(value[prop][p])
                                        } else if(con !== "Number" && con !== "String" && con !== "Boolean") {
                                            obj[prop][p] = "instanceof_"+con; //3-deep nested objects are cut off
                                        }  else {
                                            obj[prop][p] = value[prop][p]; 
                                        }
                                    } else {
                                        obj[prop][p] = value[prop][p]; 
                                    }
                                }
                            }
                        }
                        else { 
                            let con = value[prop].constructor.name;
                            if (con.includes("Set")) {
                                obj[prop] = Array.from(value[prop])
                            } else if(con !== "Number" && con !== "String" && con !== "Boolean") {
                                obj[prop] = "instanceof_"+con;
                            } else {
                                obj[prop] = value[prop]; 
                            }
                        }
                    }
                    //console.log(obj, value)
                    val = obj;
                    //refs.set(val, path.join('.'));
                }
                else {
                    val = value;
                }
            } else {
                val = value;
            }
        }
        //console.log(value, val)
        return val;
    }

    return function stringifyFast(obj, space?) {
        parents.push(obj);
        let res = JSON.stringify(obj, checkValues, space);
        clear();
        return res;
    }
})();

if((JSON as any).stringifyFast === undefined) {
    //Workaround for objects containing DOM nodes, which can't be stringified with JSON. From: https://stackoverflow.com/questions/4816099/chrome-sendrequest-error-typeerror-converting-circular-structure-to-json
    (JSON as any).stringifyFast = stringifyFast;
}

