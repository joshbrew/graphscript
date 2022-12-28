export default (properties, graph) => {
    if(graph?.get(properties)) return graph.get(properties);
    else return properties
}