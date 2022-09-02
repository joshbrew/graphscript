# Services

See [Included Services](https://github.com/brainsatplay/graphscript/blob/master/docs/Service.md#included-services)

Before reading and getting immediately confused by this alien API, scroll through the code in [Examples](https://github.com/brainsatplay/graphscript/blob/master/examples) for very clear, compelling implementatons that flex our feature sets.

Services extend Graphs to build on the idea of creating pluggable [microservices](https://www.akana.com/resources/microservices-why-should-businesses-care) in a unified, componentized programming interface, and simplifies the amount of work required to implement increasing numbers of protocols with more syntax and functionality than we can normally remember. Building these instead as Services and following the general formula here can vastly speed up feature development and feature meshing. 

The Service class extends the Graph class and adds additional methods for creating and linking execution graphs. All extended Services (WorkerService, HTTPbackend, etc) can load any other Services/Graphs/routes/etc. to serve as the entry point to your program depending on how you need to stage your programs. The only incompatibilities are based on nodejs or browser-specific functionality like command line or DOM access (without a document and window renderer in node anyway).

Services provide a unifying function/class loading and message passing framework to make it really easy to chain program functions across http, socket, sse, webrtc, thread, child process, frontend rendering and any of your own protocols. It has more features to help with scoping connected node services as well. 

Create routed nodes with any functions, node/graph/service prototypes, any objects at all (e.g. the built in Math object in browsers) to gain state machine and flowgraph functionalities across your program, even remotely.



```ts
type RouteProp = { //these are just multiple methods you can call on a route/node tag kind of like http requests but really it applies to any function you want to add to a route object if you specify that method even beyond these http themed names :D
    get?:((...args:any)=>any|void),
    post?:OperatorType|((...args)=>any|void), 
    put?:(...args:any)=>any|void,
    head?:(...args:any)=>any|void,
    delete?:(...args:any)=>any|void,
    patch?:(...args:any)=>any|void,
    options?:(...args:any)=>any|void,
    connect?:(...args:any)=>any|void,
    trace?:(...args:any)=>any|void,
    aliases?:string[] 
} & GraphNodeProperties


type Routes = { //same as the tree in the base acyclic graph but adds aliases and RouteProps handling
    [key:string]:
        GraphNode |
        Graph | //special nodes, the graph will live on the .source property of this node and the operator accepts objects with key:value pairs to run functions on the graph and return a results object with corresponding key:value pairs.
        Service | 
        GraphNodeProperties |
        ((...args)=>any|void) |
        { aliases?:string[] } & GraphNodeProperties |
        RouteProp
}

//the input options are kind of complex but allow for robust programmatic customization. 
export type ServiceOptions = {
    routes?:Routes|Routes[], 
    name?:string, 
    props?:{[key:string]:any}, 
    loadDefaultRoutes?:boolean,
    includeClassName?:boolean,
    routeFormat?:string,
    customRoutes?:{ //modify routes or execute other functions based on the route properties? e.g. addElement in DOMService
        [key:string]:(route:Route, routeKey:string, routes:Routes)=>Route|any|void
    },
    customChildren?:{ //modify child routes in the tree based on parent conditions
        [key:string]:(child:Route, childRouteKey:string, parent:Route, routes:Routes, checked:Routes)=>Route|any|void
    },
    sharedState?:boolean, //share state between services? default is true, graphs have independent states at the base
    [key:string]:any
};


//these are the same as trees except they can turn get or post into operators,
// this makes more sense when the http server is involved but you can specify any
let routes:Routes = {
    add:{
        post:(a,b) => {
            return a+b;
        },
        aliases:['addition'] //these are in the base graph too as a feature
    }
}

const service = new Service({routes});

```

In a Service you declare `routes` instead of a `tree` (the 'tree' proprerty still functional internally but not used in the service's constructor), which adds customizable GraphNodePrototypes for more advanced scripting, e.g. for DOM or Web Worker controls. The routes aim to multiplex the calls to GraphNodes the same way you can get/post/delete etc over single HTTP urls to on a REST api, or in our case calling any existing method (functions or e.g. stored html template strings) you specify on a route/node. Every service includes a set of optional default routes for basic operations like getting/setting/logging/subscribing/pinging/etc. so each service is self contained and works as the entry point to your program using whatever composition of services that have been loaded into it. 

Services supply additional functions for piping the outputs of one function to others, including through to other services you've loaded into your main parent service interface. A lot of this is much better explained with code. The Router service works as an even more general service bundler for creating easy user and server pipelines.

Multiple services also support custom route formats which you can easily mirror when developing your own services with our object tree-based programmable systems. We spent a lot of time most notably on the DOM service which lets you quickly compose your web UI with HTML and heavily customizable web components. Support is expanding to include on-the-fly .md or .jsx format parsing, for example, which can include the needed scripts for you in-browser.

## Service Messages

For microservices to be able to talk to each other, we use a common set of keys in an object used for message passing and transmitting/receiving between services and nodes, including those on other servers or threads. 

```ts
type ServiceMessage = {
    route?:string,  //the function/node to execute
    args?:any, //route args or data depending on what we're handling
    method?:string, //can specify get, post, etc. on http requests or on multiplexed routes using the RouteProp format
    node?:string|GraphNode, //alt tag for routes
    [key:string]:any //it's an object so do whatever, any messages meant for web protocols need to be stringified or buffered
}


let message:ServiceMessage = {route:'add', args:[10,20], method:'post'};

service.transmit(message); //these get customized in services representing their specific protocols e.g. http or websockets to deal with those specific interface requirements

```

All of the remote message passing services with two way communication channels (excluding http/sse currently) have the following functions available on each instance of your socket, rtc peer, worker thread (including worker->worker message ports), child process, etc. connections to make it really easy to build complex message passing functions e.g. for server or multiplayer communication and remote control. 

```ts

type ConnectionTemplate = {
    _id?:string,
    send?:(message:any, ...args:any[])=>any,
    request?:(message:any, method?:any,...args:any[])=>Promise<any>|Promise<any>[],
    post?:(route:any, args?:any, method?:string, ...args:any[])=>void,
    run?:(route:any, args?:any, method?:string, ...args:any[])=>Promise<any>|Promise<any>[],
    subscribe?:(route:any, callback?:((res:any)=>void)|string, ...args:any[])=>Promise<number>|Promise<number>[]|undefined,
    unsubscribe?:(route:any, sub:number, ...args:any[])=>Promise<boolean>|Promise<boolean>[],
    terminate:(...args:any[]) => boolean,
    [key:string]:any //e.g. http server settings, or websocket paths, webrtc peer candidates, etc.
}

```
These services provide defaults for mostly zero config wiring up for programs, just specify ports, routes, ids, etc. as you need increasing control over your program. There are no restrictions on top of the base protocols, it's all just boiled down to one liners and similar calls between services for mental clarity and a recommended configuration by default to enable the most desirable functionality e.g. if you do not specify your own onmessage callbacks for sockets or threads.

The subscribe and unsubscribe functions act the same as they do locally and configure the endpoints with a state subscription on arbitrary routes for you to do what you want with on the listening port.

To help out the `Router` service with less configuration, you can also stick all of your connections in a `connections:{}` object, which can objects that further group connections (e.g. socket servers versus sockets). This makes it easier to find connections that have opened and closed in real time to know when users join and leave or for associating endpoints properly, otherwise the Router provides configuration handles for everything you need to load your own services as long as the remote connection format is followed.

# Included Services

We will elaborate on all of this with individual docs for each microservice, as they can go pretty deep. 

For all services with remote message passing support (http, wss, sse, webrtc, etc.) they are by default configured to handle our service messages alongside arbitrary callbacks or basic standard functions (e.g. file serving in the http server). This allows them to be quickly wired together with your custom services without worrying about formats matching up.

- DOM - Create elements, detailed web components, or a macro for canvases that tie in with the graph. Really quickly script out whole web pages with heavy interactivity with a lot less fuss. Includes .md and .jsx interpreting options (rough). (browser only) 
    - - [DOMService](./services/dom/dom.service.md)

- HTTP - Create [http/https servers](https://nodejs.org/api/http.html) and manage REST calls and create static or dynamic websites instantly. The server is set up to handle custom GET/POST requests using our route format encoded in the request body as well as standard GET/POST calls for serving files. The backend HTTP service allows you to construct webpages just from strings and inject code e.g. for hotreloading into your page with simple one liners. You can even build whole pages from lists of functions and template strings.
    - - [HTTPbackend](./services/http/http.node.md)
    - - [HTTPfrontend](./services/http/http.browser.md)

- WSS - Websocket server frontend and backend to route service messages and for general use. It's a simple single function call to create the socket server on the backend with your http server and then open connections on the frontend. Leverages the small [`ws`](https://github.com/websockets/ws) library for nodejs. 
    - - [WSSbackend](./services/wss/wss.node.md)
    - - [WSSfrontend](./services/wss/wss.browser.md)

- Router - Arbitrary connection pooling using our templated connections
    - - [Router](./services/router/Router.md)

- SSE - [Server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events) using [`better-sse`](https://www.npmjs.com/package/better-sse), this allows for one way communication to connected clients. This api gives you handles for each client as well, so individuals can be messaged on a shared channel without notifying others. This has much less overhead when two way communication is unnecessary or when you can fire-and-forget message results.
    - - [SSEbackend](./services/sse/sse.node.md)
    - - [SSEfrontend](./services/sse/sse.browser.md)

- [Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) - Multithreading is essential for high performance applications, and essentially all logic not running directly on the UI should be offloaded to workers in a production environment, so we handled the message passing system for you. In nodejs, threads can even run their entire own servers. In browser, they can handle canvas draw calls, sockets, REST calls, etc.  See examples for canvas, threejs, and entity component system samples.
    - - [WorkerService](./services/worker/worker.service.md)
    - - [Workers](./services/worker/worker.md)

- [WebRTC](https://webrtc.org/) - Browser supported peer 2 peer streaming and data channels with [WebRTC](https://webrtc.org/). We can easily use the service and Router user framework to share room information or create remote commander/listener instances through a server.
    - - [WebRTCfrontend](./services/webrtc/webrtc.browser.md)

- CMD - Command [child processes](https://nodejs.org/api/child_process.html), load processes that run their own CMD services to listen for cross-process service messages. This is the entry point for containerized applications with independent memory pools e.g. for rapid testing or for server multiplexing. (server only)
    - - [CMDService](./services/cmd/cmd.service.md)

- Struct - Comprehensive data structure system for users. This includes basic access permissions, persistent notifications e.g. for chatroom data, and options to hook into MongoDB or basic local in-memory data maps for cloud server or frontend usage. 

- E2EE - End 2 End encryption made easy with the minimal [Stanford Javascript Cryptography Library](https://crypto.stanford.edu/sjcl/). It's set up to generate keys which you can copy to the desired endpoint (should do it securely) to pass encrypted service messages that automatically reroute through the encryption service. It can even encrypt the hash key table with a server side secret. 

- GPU - This service implements an instance of [gpu.js](https://gpu.rocks/#/) via our [`gpujsutils`](https://github.com/joshbrew/gpujsutils) library, which is a stable gpu.js distribution and macro set. Kernels are created persistently on the gpu via webgl2 and i/o can be resized dynamically, so this runs as fast as Webgl2 allows. Hoping gpujs sees some upgrades for WebGPU as it lets you write shader code in plain loosely typed javascript!

- ECS - [Entity Component System](https://github.com/SanderMertens/ecs-faq#what-is-ecs) Service provides a simple spec to help you organize 'entities' with 'components' that tell different 'systems' to execute based on an execution order you provide. E.g. physics entities may have a collision system and a movement system before a final render system, and each entity will have values stored that get mutated by each system in an order that makes physical sense (e.g. check collision -> update velocity -> update position -> update render each frame). This is a loose spec, the rest is provided by the base Service/Graph node composition tools to give you full flow graph and state management under the hood. 

- Unsafe - These let you dynamically transfer functions and classes or read/write global values across service instances, e.g. to other threads or between frontend/backend. Use with caution as it is reliant on eval(), but generally this is an easy way to generate and control entire backends and thread pools from a single file.

This is all receiving constant updates and is not entirely tested. 
