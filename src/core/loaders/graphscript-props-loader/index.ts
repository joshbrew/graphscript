import { getAllProperties } from "../../Graph";


const proxyFunction = (k, obj) => {
    const fn = obj[k];
    return (...args) => fn.call(obj, ...args) //simple proxy to preserve original function scope
}
export default (properties) => {

    let proxied= {}
    let ogProxy = properties.__props;
    Object.defineProperty(properties, '__props', {
        get: () => ogProxy,  // TODO: Make this adapt to additional changes...

        set: (obj) => {
            if (!ogProxy) ogProxy = obj
            const allProps = getAllProperties(obj);
            for(const k of allProps) {
                if(!(k in proxied)) {

                    const ogValue = properties[k]
                    const hasOGValue = k in properties
                    const isFunction = typeof obj[k] === 'function'
                    if (isFunction) properties[k] = proxyFunction(k, obj)
                    else Object.defineProperty(properties, k, {
                        // get: ()=> wasFunction ? fn : obj[k],
                        get: () => obj[k],
                        set: (value) => {
                            // if (typeof value === 'function') fn = proxyFunction(k, obj) // Proxy new functions
                            // else 
                            obj[k] = value
                        },
                        // enumerable: true,
                        configurable: true // Can add a getter / setter
                    });

                    proxied[k] = true
                    if (hasOGValue) properties[k] = ogValue // setting original value
                }
            }
        }
    })
    
    if(ogProxy) { //e.g. some generic javascript object or class constructor that we want to proxy. Functions passed here are treated as constructors. E.g. pass an HTML canvas element for the node then set this.width on the node to set the canvas width  
        if (typeof ogProxy === 'function') ogProxy = new ogProxy();
        if (typeof ogProxy === 'object') properties.__props = ogProxy ; // Trigger the setter
    }

    return properties
}