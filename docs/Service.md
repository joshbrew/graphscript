# Services

See [Included Services](https://github.com/brainsatplay/graphscript/blob/master/docs/Service.md#included-services)

Services extend Graphs to build on the idea of creating pluggable [microservices](https://www.akana.com/resources/microservices-why-should-businesses-care) in a unified, componentized programming interface, and simplifies the amount of work required to implement increasing numbers of protocols with more syntax and functionality than we can normally remember. Building these instead as Services and following the general formula here can vastly speed up feature development and feature meshing. 


### Worker Service example
e.g.
```ts

import {WorkerService} from 'graphscript'

import worker from 'graphscript/services/worker/Worker' //includes Math loaded as a service
//our tinybuild bundler will convert this to a file or dataurl for us


//This is a useless example of running math callbacks through workers 
//  in a quick chain then feeding the output to the document body.
let workers = new WorkerService({
    roots:{
        worker1:{
            workerUrl:worker,
            callback:'log10'
            __children:{
                worker2:{
                    workerUrl:worker,
                    callback:'sinh', //will receive a message directly from worker1 and not through the main thread
                    __children:{
                        output:{ //receives output directly from worker2
                            __props:document.body,
                            __operator:function (inp) {
                                this.innerHTML += `${inp}<br/>`;
                            }
                        }
                    }
                }
            }
        }
    }
});


workers.run('worker1', 100);

workers.run('worker1', 500);

```
You can see here easily that Services are a moderate twist on the Graph format to introduce new arbitrary keys for doing different things specific to a javascript tool, in this case multithreading with Web Workers. We have covered a diverse number of use cases already for full stack usage but they still only scratch the surface of what we can do here to make for extremely minimal application code. 

And the Worker.ts
```ts
//functionality
import { WorkerService } from './Worker.service';
import { Math2 } from 'brainsatplay-math';

//wonder if we can have a scheme to dynamic import within the services? e.g. to bring in node-only or browser-only services without additional workers

declare var WorkerGlobalScope;

if(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
    (self as any).SERVICE = new WorkerService({
        services:{
            Math,
            Math2
        }
    });
    
}

export default self as any;

```

The Service class extends the Graph class and adds additional methods for creating and linking execution graphs. All extended Services (WorkerService, HTTPbackend, etc) can load any other Services/Graphs/trees/etc. to serve as the entry point to your program depending on how you need to stage your programs. The only incompatibilities are based on nodejs or browser-specific functionality like OS access (command line) or DOM access (without a document and window renderer in node anyway).

Services provide a unifying function/class loading and message passing framework to make it really easy to chain program functions across http, socket, sse, webrtc, thread, child process, frontend rendering and any of your own protocols. It has more features to help with scoping connected node services as well. Each service we have on hand produces a single control pattern to make it easier to work with different protocols as well as enable cross-communication by simply defining endpoint nodes and i/o behaviors. 

We are reworking some things to update tree node definitions for routing user endpoints.

Create routed nodes with any functions, node/graph/service prototypes, any objects at all (e.g. the built in Math object in browsers) to gain state machine and flowgraph functionalities across your program, even remotely as we demonstrated above with threads.


### Service Messages

For microservices to be able to talk to each other, we use a common set of keys in an object used for message passing and transmitting/receiving between services and nodes, including those on other servers or threads. We then simply write handlers specific to a messenging API (sockets, web workers, HTTP, etc) to interpret graph messages generically to trigger i/o on either end, easily allowing for posting, subscribing, awaiting, etc.   

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

### Connection Templating

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
These services provide defaults for mostly zero config wiring up for programs, just specify ports, node tags, ids, etc. as you need for increasing control over your program. There are no restrictions on the base protocols, it's all just boiled down to one liners like transmit() and receive() i.e. similar calls between services for mental clarity and a recommended configuration by default to enable the most desirable functionality.

Everything in the base javascript tooling is available still for direct calls to save overhead - of which there is very little in our added system here. Ideally we are using the bare minimum needed to generalize each protocol's message passing system to maximize application performance for general use cases without sacrificing readability and composability.

The subscribe and unsubscribe functions act the same as they do locally and configure the endpoints with a state subscription on arbitrary nodes for you to do what you want with on the listening port.

# Included Services

We will elaborate on all of this with individual docs for each microservice, as they can go pretty deep. 

For all services with remote message passing support (http, wss, sse, webrtc, etc.) they are by default configured to handle our service messages alongside arbitrary callbacks or basic standard functions (e.g. file serving in the http server). This allows them to be quickly wired together with your custom services without worrying about formats matching up.

For frontend HTML use the simple [html loader](https://github.com/brainsatplay/graphscript/blob/master/loaders/html/html.loader.ts) which includes support for simple HTML nodes and complex web components within tree definitions. See the [examples](https://github.com/brainsatplay/graphscript/blob/master/examples) for usage.

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

This is all receiving constant updates and is not entirely tested or may receive breaking changes in the interim of cleaning up the base API layers.
