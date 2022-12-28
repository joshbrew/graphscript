
// export function isNativeClass (thing) {
//     return typeof thing === 'function' && thing.hasOwnProperty('prototype') && !thing.hasOwnProperty('arguments')
// }

export function isNativeClass (thing) {
    return isFunction(thing) === 'class'
}


export function isFunction(x) {
    const res = typeof x === 'function'
        ? x.prototype
            ? Object.getOwnPropertyDescriptor(x, 'prototype').writable
                ? 'function'
                : 'class'
        : x.constructor.name === 'AsyncFunction'
        ? 'async'
        : 'arrow'
    : '';

    return res
}

export default (properties) => {
    if ( isNativeClass(properties) ) return new properties(); //this is a class that returns a node definition
    else return {
        __operator:properties,
        __node:{
            forward:true, //propagate operator results to children
            tag:properties.name
        }
    };
}