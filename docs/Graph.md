# Graphs

The Graph and GraphNode classes are an implementation of the acyclic graphs and node-based hierarchical programming. You can design control workflows very easily this way. Essentially we are providing a general workflow programming model within javascript for pipes and stately programming and more imposed as needed. It is one that requires very little mental workload to jump into and takes care of the sync/async connectivity between your program modules for you.


### First Steps

To create a Graph, simply declare an object as your "tree" or your program hierarchy then load it into the graph. After that your nodes become interactive through both the definition objects and through accessors on the Graph instance.

```ts

import {Graph} from 'graphscript'


let nodeA = {
        x:5,
        y:2,
        jump:()=>{console.log('jump!'); return 'jumped!'; },
        __listeners:{
            'nodeB.x':'jump', //string listeners in a scope are methods bound to 'this' node
            'nodeB.nodeC':function(op_result){console.log('nodeA listener: nodeC operator returned:', op_result, this)},
            'nodeB.nodeC.z':function(newZ){console.log('nodeA listener: nodeC z prop changed:', newZ, this)},
        }
};

let nodeB = {
        x:3,
        y:4,
        __children:{
                nodeC:{
                    z:4,
                    __operator:function(a) { this.z += a; console.log('nodeC operator: nodeC z prop added to',this); return this.z; },
                    __listeners:{
                        'nodeA.x':function(newX) { console.log('nodeC listener: nodeA x prop updated', newX);},
                        'nodeA.jump':function(jump) { 
                            console.log('nodeC listener: nodeA ', jump);
                        }
                    }
                }
            }
};

let tree = {
    nodeA,
    nodeB
};

let graph = new Graph({tree});


nodeB.x += 1; //should trigger nodeA listener 'nodeB.x'

nodeB.__children.nodeC.z *= 5; //should trigger nodeA listener 'nodeB.nodeC.z'

graph.get('nodeB.nodeC').__operator(5); //should trigger nodeA listeners 'nodeB.nodeC.z' and 'nodeB.nodeC'

```

Why would you do this? Well the more you script things in software, the more you'll find yourself retreading the same problems over and over again to set up your states, run asynchronous tasks, and build functional abstraction layers for all of your different code pieces to talk to each other. Each time it often leads to nontrivial solutions that work for your particular use case but might be a bit nonsensical coming from the outside or nonreusable. Imposing a little bit of a general theoretical programming structure here, i.e. graph theory, can go a long ways to simplifying APIs and improving performance across the board. Javascript lends itself well to this with it's inherent dynamic programming and object oriented scoping that you can easily pass-by-reference. 

Javascript has hundreds of features for you to, well, script your web pages and applications. We can synthesize it into a properly generalized game engine sandbox format for workflow programming and software construction that does not burden the developer with heavy abstractions or leave you lost with how to connect separate modules. It makes life much better for developers and code far more readable and reusable. This should lead to quality improvements in general in our products as less time gets lost on the menial labor of debugging our own custom business logic that nobody else can read or use, and more on actually creating usable systems that you know will slot in with the rest of your own or others' programs from the outset. 

We have a synthesis of this idea we're calling a form of "graph script" which provides a simple way to link functions, objects, modules, scopes, etc. in your program in an object tree that imbues these objects with state and listener powers - and much more - on an acyclic graph abstraction with very minimal overhead and constraints. This is a minimal workflow programming implementation that respects javascript's robust offerings without getting in the way, and allows for all kinds of combination and composition.



### Graph Node Properties

Graph nodes can have many properties, and even more if you specify loaders on the Graph (see below).

```ts
type GraphNodeProperties = {
    __props?:Function|GraphNodeProperties, //a class constructor function (calls 'new x()') or an object we want to proxy all of the methods on this node. E.g. an html element gains 'this' access through operators and listeners on this node.
    __operator?:((...args:any[])=>any)|string, //The 'main' function of the graph node, children will call this function if triggered by a parent. Functions passed as graphnodeproperties become the operator which can set state.
    __children?:{[key:string]:GraphNodeProperties}, //child nodes belonging to this node, e.g. for propagating results
    __listeners?:{[key:string]:((result)=>void)|{callback:(result)=>void,subInput?:boolean,[key:string]:any}}, //subscribe by tag to nodes or their specific properties and method outputs
    __onconnected?:((node)=>void|((node)=>void)[]), //what happens once the node is created?
    __ondisconnected?:((node)=>void|((node)=>void)[]), //what happens when the node is deleted?
    __node?:{ //node specific properties, can contain a lot more things
        tag?:string,
        state?:EventHandler, //by default has a global shared state
        inputState?:boolean //we can track inputs on a node, subscribe to state with 'input' on the end of the tag or 'tag.prop' 
        [key:string]:any
    },
    [key:string]:any
}
```

One special property to note here is `__props`. If you provide an object, class instance, or class constructor function (to be instanced) under `__props`, all of the object's methods will be made available by proxy on the graph node. This enables the proxied object to be mutated by the node as its own properties, e.g. to control an HTML node within the graph node scope. E.g. setting `__props:document.body` then with the resulting node setting  `node.style.backgroundColor = 'black'` should turn the page black, because the node is acting as the referenced HTML node now.


### Graph Options

Graphs also have several options:
```ts

type GraphOptions = {
    tree?:{[key:string]:any},
    loaders?:{[key:string]:(
        node:GraphNode,
        parent:Graph|GraphNode,
        graph:Graph,
        tree:any,
        properties:GraphNodeProperties,
        key:string
    )=>void},
    state?:EventHandler,
    mapGraphs?:false, //if adding a Graph as a node, do we want to map all the graph's nodes with the parent graph tag denoting it (for uniqueness)?
    [key:string]:any
}
```

[Loaders](../Loaders.ts) are important and allow for as many complex behaviors to be defined as you desire when running the node load order. After the node is defined it will run each loader function that has been supplied. This makes it so you can quickly specify new properties and usages of the node hierarchies.

### Loaders and more

With additional [loaders](../Loaders.ts), we can quickly turn nodes into self contained loops and animations, html nodes, threads and thread-thread message ports, server endpoints, user representations, and more so we can quickly script out very complex programs, with the tree as a simple reference point to remix these features via the application trees. We can also export these node definitions as their own esm modules for easy module development.

The most complex examples we have so far do things like relay P2P initial connections through a socket backend, animate tens of thousands of boids with multiple threads, process and debug sensor data with 8 separate task threads. 

Each example is only a few hundred lines of code and roughly understandable in one pass at reading.

Here is a bigger graph from [`examples/graph`](../examples/graph/):

```ts

import {Graph, loaders} from 'graphscript'

let tree = {

    nodeA: {
        x:5,
        y:2,
        jump:()=>{console.log('jump!'); return 'jumped!'; },
        __listeners:{
            'nodeB.x':'jump', //string listeners in a scope are methods bound to 'this' node
            'nodeB.nodeC':function(op_result){console.log('nodeA listener: nodeC operator returned:', op_result, this)},
            'nodeB.nodeC.z':function(newZ){console.log('nodeA listener: nodeC z prop changed:', newZ, this)},
            'nodeE': 'jump'
        }
    },

    nodeB:{
        x:3,
        y:4,
        __children:{
                nodeC:{
                    z:4,
                    __operator:function(a) { this.z += a; console.log('nodeC operator: nodeC z prop added to',this); return this.z; },
                    __listeners:{
                        'nodeA.x':function(newX) { console.log('nodeC listener: nodeA x prop updated', newX);},
                        'nodeA.jump':function(jump) { 
                            console.log('nodeC listener: nodeA ', jump);
                        }
                    }
                }
            }
    },

    nodeD:(a,b,c)=>{ return a+b+c; }, //becomes the .__operator prop and calling triggers setState for this tag (or nested tag if a child)

    nodeE:{
        __operator:()=>{console.log('looped!'); return true;},
        __node:{ //more properties
            loop:1000, //default loaders include this, allowing you to define a timer loop
            looping:true //start looping as soon as the node is defined?
        }
    },

    nodeF:{ //this is a way to control HTML nodes
        __props:document.createElement('div'), //properties on the '__props' object will be proxied and mutatable as 'this' on the node. E.g. for representing HTML elements
        __onconnected:function (node) { 
            this.innerHTML = 'Test';
            this.style.backgroundColor = 'green'; 
            document.body.appendChild(this.__props); 
            console.log(this,this.__props);
        },
        __ondisconnected:function(node) {
            document.body.removeChild(this.__props);
        }
        
    }

};

let graph = new Graph({
    tree,
    loaders
});


```


We took this much further by unifying Graphs with a uniform message passing system via Services, allowing for complex multithreading and backend + frontend workflows to be constructed very clearly within a few hundred lines of code. With this we have created a graph-based full stack API for browser frontend and node backend development. There is much more to come. See [Services](./Service.md)