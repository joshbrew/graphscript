
function addOnConnected(callback:(node)=>void) {
    this.__node.connectCallbacks.push(callback);
}

function addOnDisconnected(callback:(node)=>void) {
    this.__node.disconnectCallbacks.push(callback);
}

function callConnected() {
    const ref = this.__node.ref;
    this.__node.connectCallbacks.forEach((o:Function) => { o.call(ref,ref); })
}

function callDisconnected() {
    const ref = this.__node.ref;
    this.__node.disconnectCallbacks.forEach((o:Function) => { o.call(ref, ref) });
}

export default function (properties, original, graph) {

    // Create a new object to store the properties
    if (typeof properties.__node === 'string') {
        if(graph?.get(properties.__node.tag))  properties = graph.get(properties.__node.tag);
    }

    let root = properties.__node ?? {}
    if (root?.state) this.__node.state = root.state; //make sure we're subscribing to the right state if we're passing a custom one in
    root = Object.assign(this.__node, root)
    root.properties = properties // track properties object
    root.ref = this; // track the reference to the node

    const desc = {
        value: root,
        enumerable: false,
        writable: false,
        configurable: false
    }

    Object.defineProperty(properties, '__node', desc);

    // Add lifecycle methods
    root.addOnConnected = addOnConnected.bind(properties);
    root.addOnDisconnected = addOnDisconnected.bind(properties);
    root.callConnected = callConnected.bind(properties);
    root.callDisconnected = callDisconnected.bind(properties);
    const onconnect = properties.__onconnected
    const ondisconnect = properties.__ondisconnected
    
    root.connectCallbacks = onconnect ? [onconnect] : [];
    root.disconnectCallbacks = ondisconnect ? [ondisconnect] : [];

    // Ensure you track the graph
    if(graph) root.graph = graph;


    // Track Original
    if (!properties.__node.initial) properties.__node.initial = original; //original object or function

    // Provide the node with a name
    if(!root.tag) {
        if(properties.__operator?.name) root.tag = properties.__operator.name;
        else root.tag = `node${Math.floor(Math.random()*1000000000000000)}`;
    }

    return properties
}