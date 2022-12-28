export default (properties) => {
               
    if (typeof properties.default === 'function' && !properties.__operator) { //make it so the node is subscribable
        let fn = properties.default
        const defaultFunction = (...args) => {
            if(properties.__node.inputState) properties.__node.state.setValue(properties.__node.unique+'input',args);
            let result = fn(...args);
            if(typeof result?.then === 'function') {
                result.then((res)=>{ if(res !== undefined) properties.__node.state.setValue( properties.__node.unique,res ) }).catch(console.error);
            } else if(result !== undefined) properties.__node.state.setValue(properties.__node.unique,result);
            return result;
        } 

        properties.default = defaultFunction;
    }
    
    return properties
}