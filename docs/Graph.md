# Graphs

The Graph and GraphNode classes are an implementation of the acyclic graphs and node-based hierarchical programming. You can design control workflows very easily this way, essentially we are providing a general model for piping and stately programming. We took this further by unifying Graphs with a uniform message passing system via Services, allowing for complex multithreading and backend + frontend workflows to be constructed very clearly within a few hundred lines of code.


```ts
export type GraphNodeProperties = {
    __props?:Function|GraphNodeProperties,
    __operator?:((...args:any[])=>any)|string,
    __children?:{[key:string]:GraphNodeProperties},
    __listeners?:{[key:string]:((result)=>void)|{callback:(result)=>void}},
    __onconnected?:((node)=>void|((node)=>void)[]),
    __ondisconnected?:((node)=>void|((node)=>void)[]),
    __node?:{
        tag?:string,
        state?:EventHandler, //by default has a global shared state
        inputState?:boolean //we can track inputs on a node, subscribe to state with 'input' on the end of the tag or 'tag.prop' 
        [key:string]:any
    },
    [key:string]:any
}
```

```ts
export type GraphProperties = {
    tree?:{[key:string]:any},
    loaders?:{[key:string]:{node:GraphNode,parent:Graph|GraphNode,graph:Graph,tree:any,properties:GraphNodeProperties}},
    state?:EventHandler,
    childrenKey?:string,
    mapGraphs?:false, //if adding a Graph as a node, do we want to map all the graph's nodes with the parent graph tag denoting it (for uniqueness)?
    [key:string]:any
}

export type GraphOptions = {
    tree?:{[key:string]:any},
    loaders?:{[key:string]:(
        node:GraphNode,
        parent:Graph|GraphNode,
        graph:Graph,
        tree:any,
        properties:GraphNodeProperties
    )=>void},
    state?:EventHandler,
    childrenKey?:string,
    mapGraphs?:false, //if adding a Graph as a node, do we want to map all the graph's nodes with the parent graph tag denoting it (for uniqueness)?
    [key:string]:any
}
```