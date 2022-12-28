import { Graph } from "../../Graph";

export default (properties, parent) => {
    if(!properties.__parent && parent) properties.__parent = parent;

    const root = properties.__node

    if(parent?.__node && (!(parent instanceof Graph || properties instanceof Graph))) 
    root.tag = parent.__node.tag + '.' + root.tag; //load parents first

    // TODO: Allow for directly setting this to reparent?
    Object.defineProperty(properties, '__parent', {
        value: parent,
        enumerable: false,
        writable: true,
        configurable: false
    })

    if(parent instanceof Graph && properties instanceof Graph) {

        if(root.loaders) Object.assign(parent.__node.loaders ? parent.__node.loaders : {}, root.loaders); //let the parent graph adopt the child graph's loaders

        if(parent.__node.mapGraphs) {
            //do we still want to register the child graph's nodes on the parent graph with unique tags for navigation? Need to add cleanup in this case
            root.nodes.forEach((n) => {parent.set(root.tag+'.'+n.__node.tag,n)});

            let ondelete = () => { root.nodes.forEach((n) => {parent.__node.nodes.delete(root.tag+'.'+n.__node.tag)}); }
            root.addOnDisconnected(ondelete);

        }
    }


    return properties
}