# graphscript
[![Npm package version](https://img.shields.io/npm/v/graphscript)](https://npmjs.com/package/graphscript)
[![Npm package monthly downloads](https://badgen.net/npm/dm/graphscript)](https://npmjs.ccom/package/graphscript)
[![License: AGPL v3](https://img.shields.io/badge/license-AGPL_v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Discord](https://img.shields.io/badge/community-discord-7289da.svg?sanitize=true)](https://discord.gg/CDxskSh9ZB)


<p align="center">
<img src="./gs_logo_min.png"  width=350px height=350px><br>
For happy code!
</p>

## This API is still under construction
There's plenty of working tools available already. However, we are randomly breaking/finding old broken code and improving things constantly as we push out a model we feel can be competitive. 100% FOSS!

**GraphScript** is a highly customizable, high performance library for creating complex full stack software and library architectures. It's based around graphs hierarchies, event systems, and microservices, with an intuitive composition and node/function indexing tree system for rapid development.

Check out the code in [examples](./examples) for very clear, compelling implementatons that flex our rapidly evolving feature sets. Please join our small cabal of open source contributors and help us grow this library as an alternative full stack framework. 

## Core Concepts
**graphscript** is organized by the basic principles of graph theory:

1. **Graph:** These are contained in a shared scope.
2. **Nodes:** There is a hierarchy of objects.
3. **Connections:** Within each shared scope, properties can be linked in order to react to each other.

Beyond these basic concepts, nodes can be direct proxies for generic javascript functions, objects or class instances from any libraries, enabling an intuitive frontend/backend hierarchical organization scheme that can plug right in as an event system for existing object-oriented programs. 

### Graphs and Graph Nodes
See [Graphs and GraphNodes](./docs/Graph.md) for more information.

The basic connectivity framework. You can design entire apps or modules as nested object (or scope) associations with the graph node properties and event system. We've demonstrated dozens of modules in the examples and throughout the source code. Just dump them in a Graph and you can quickly build event systems with a clear readable hierarchy. This isn't a rigid system as you'll see in the [examples](./examples/). Add more GraphScript properties (which we distinguish with a *__*) using **loaders** to customize node instantiation behaviors e.g. for spawning a multithreaded app from a fairly simple hierarchical definition for the desired i/o scheme.

### Services
See [Services](./docs/Service.md) for more information.

This forms a microservices layer on top of the graph system. It makes it easier to communicate between separate graphs that track their own properties. We've implemented all kinds of protocols (HTTP, WebRTC, WSS, Event Sources, End-to-End encryption, etc) on top of this to demonstrate the convenience of a graph-based event system for software pipelining.

[Included Services](./docs/Service.md#included-services) contains a reference of the services included in the main graphscript packages.

## Packages

### `graphscript`: A GraphScript distribution for browsers (~211kb)
#### Package Features
- Graphs, Services
- Web Workers, including convenient canvas renderer multithreading and MessageChannel pipelining
- WebRTC
- WebSockets 
- Event Sources
- Session system for syncing data across connections (e.g. for game servers)
- Router for creating user systems and connection routing by user assocation.
- End 2 End encryption (via `sjcl`)

### `graphscript-node`: A GraphScript build for Node.js (~238Kb)
#### Package Features
- Graphs, Services
- Experimental pure nodejs HTTP/HTTPS server for rapid prototyping. Tie requests to graph node properties or use a simple page templating system. 
- Websocket server and Websockets (via `ws`)
- Server-Sent Events (via `better-sse`)
- Child-Processes (still need to add a polyfill for web workers)
- Session system for syncing data across connections (e.g. for game servers)
- Router for creating user systems and connection routing by user assocation.
- End 2 End encryption (via `sjcl`) 


### `graphscript-core` : (~26kb)
#### Package Features
- A minimal GraphScript distribution featuring only Graphs, the EventHandler, and the base loaders. Should work in browser and node.js

### `graphscript-services`: A collection of additional GraphScript services and general bloat.
#### Package Features
- User database system made for use with Mongoose/MongoDB. Includes dozens of boilerplate data structures for a simple query system with optional user permissions and access token verification.
- Entity Component System - a semi out-of-date but functional ECS format.
- WebGL plotter, can handle millions of points.
- Node templates (e.g. for use with the remoteGraphRoutes) for receiving data from sensors and stuff. 

#### Extras
 - `graphscript-services.gpu`: Experimental `gpu.js` plugin. ~500kb, use it with workers for best results.
 - `graphscript-services.storage`: Some BrowserFS, CSV, and Google Drive utilities. Not very complete.

### Contributing

Want to see this API improve faster? Please contribute or create issues and offer perspective. This repo is mostly a labor of love by Josh, with Garrett swooping in to reality check the actual utility of it from time to time. We want this to API to give you open web super powers, so we can all move on to building much more interesting end products as a community, as well as get more students, engineers, and researchers working in a collaborative development environment. This is the future! Down with knowledge and tool hoarding!

### See also:
- [`device-decoder`](https://github.com/brainsatplay/device-decoder) - Complex Browser USB and Browser or Native Mobile Bluetooth driver set that is by-default multithreaded using our web worker system. You can use the worker system to create fully-threaded pipelines from the device codec without touching the main thread.

## Acknowledgments
This library is maintained by [Joshua Brewster](https://github.com/joshbrew) and [Garrett Flynn](https://github.com/garrettmflynn), who use contract work and community contributions to support themselves to build free/libre software and hardware plans. You can contribute to our work through [Open Collective](https://opencollective.com/brainsatplay), or get in touch. 

### Backers
[Support us with a monthly donation](https://opencollective.com/brainsatplay#backer) and help us continue our activities!

<a href="https://opencollective.com/brainsatplay/backer/0/website" target="_blank"><img src="https://opencollective.com/brainsatplay/backer/0/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/backer/1/website" target="_blank"><img src="https://opencollective.com/brainsatplay/backer/1/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/backer/2/website" target="_blank"><img src="https://opencollective.com/brainsatplay/backer/2/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/backer/3/website" target="_blank"><img src="https://opencollective.com/brainsatplay/backer/3/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/backer/4/website" target="_blank"><img src="https://opencollective.com/brainsatplay/backer/4/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/backer/5/website" target="_blank"><img src="https://opencollective.com/brainsatplay/backer/5/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/backer/6/website" target="_blank"><img src="https://opencollective.com/brainsatplay/backer/6/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/backer/7/website" target="_blank"><img src="https://opencollective.com/brainsatplay/backer/7/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/backer/8/website" target="_blank"><img src="https://opencollective.com/brainsatplay/backer/8/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/backer/9/website" target="_blank"><img src="https://opencollective.com/brainsatplay/backer/9/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/backer/10/website" target="_blank"><img src="https://opencollective.com/brainsatplay/backer/10/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/backer/11/website" target="_blank"><img src="https://opencollective.com/brainsatplay/backer/11/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/backer/12/website" target="_blank"><img src="https://opencollective.com/brainsatplay/backer/12/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/backer/13/website" target="_blank"><img src="https://opencollective.com/brainsatplay/backer/13/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/backer/14/website" target="_blank"><img src="https://opencollective.com/brainsatplay/backer/14/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/backer/15/website" target="_blank"><img src="https://opencollective.com/brainsatplay/backer/15/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/backer/16/website" target="_blank"><img src="https://opencollective.com/brainsatplay/backer/16/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/backer/17/website" target="_blank"><img src="https://opencollective.com/brainsatplay/backer/17/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/backer/18/website" target="_blank"><img src="https://opencollective.com/brainsatplay/backer/18/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/backer/19/website" target="_blank"><img src="https://opencollective.com/brainsatplay/backer/19/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/backer/20/website" target="_blank"><img src="https://opencollective.com/brainsatplay/backer/20/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/backer/21/website" target="_blank"><img src="https://opencollective.com/brainsatplay/backer/21/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/backer/22/website" target="_blank"><img src="https://opencollective.com/brainsatplay/backer/22/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/backer/23/website" target="_blank"><img src="https://opencollective.com/brainsatplay/backer/23/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/backer/24/website" target="_blank"><img src="https://opencollective.com/brainsatplay/backer/24/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/backer/25/website" target="_blank"><img src="https://opencollective.com/brainsatplay/backer/25/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/backer/26/website" target="_blank"><img src="https://opencollective.com/brainsatplay/backer/26/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/backer/27/website" target="_blank"><img src="https://opencollective.com/brainsatplay/backer/27/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/backer/28/website" target="_blank"><img src="https://opencollective.com/brainsatplay/backer/28/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/backer/29/website" target="_blank"><img src="https://opencollective.com/brainsatplay/backer/29/avatar.svg"></a>

### Sponsors

[Become a sponsor](https://opencollective.com/brainsatplay#sponsor) and get your logo here with a link to your site!

<a href="https://opencollective.com/brainsatplay/sponsor/0/website" target="_blank"><img src="https://opencollective.com/brainsatplay/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/sponsor/1/website" target="_blank"><img src="https://opencollective.com/brainsatplay/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/sponsor/2/website" target="_blank"><img src="https://opencollective.com/brainsatplay/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/sponsor/3/website" target="_blank"><img src="https://opencollective.com/brainsatplay/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/sponsor/4/website" target="_blank"><img src="https://opencollective.com/brainsatplay/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/sponsor/5/website" target="_blank"><img src="https://opencollective.com/brainsatplay/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/sponsor/6/website" target="_blank"><img src="https://opencollective.com/brainsatplay/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/sponsor/7/website" target="_blank"><img src="https://opencollective.com/brainsatplay/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/sponsor/8/website" target="_blank"><img src="https://opencollective.com/brainsatplay/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/sponsor/9/website" target="_blank"><img src="https://opencollective.com/brainsatplay/sponsor/9/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/sponsor/10/website" target="_blank"><img src="https://opencollective.com/brainsatplay/sponsor/10/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/sponsor/11/website" target="_blank"><img src="https://opencollective.com/brainsatplay/sponsor/11/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/sponsor/12/website" target="_blank"><img src="https://opencollective.com/brainsatplay/sponsor/12/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/sponsor/13/website" target="_blank"><img src="https://opencollective.com/brainsatplay/sponsor/13/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/sponsor/14/website" target="_blank"><img src="https://opencollective.com/brainsatplay/sponsor/14/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/sponsor/15/website" target="_blank"><img src="https://opencollective.com/brainsatplay/sponsor/15/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/sponsor/16/website" target="_blank"><img src="https://opencollective.com/brainsatplay/sponsor/16/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/sponsor/17/website" target="_blank"><img src="https://opencollective.com/brainsatplay/sponsor/17/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/sponsor/18/website" target="_blank"><img src="https://opencollective.com/brainsatplay/sponsor/18/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/sponsor/19/website" target="_blank"><img src="https://opencollective.com/brainsatplay/sponsor/19/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/sponsor/20/website" target="_blank"><img src="https://opencollective.com/brainsatplay/sponsor/20/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/sponsor/21/website" target="_blank"><img src="https://opencollective.com/brainsatplay/sponsor/21/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/sponsor/22/website" target="_blank"><img src="https://opencollective.com/brainsatplay/sponsor/22/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/sponsor/23/website" target="_blank"><img src="https://opencollective.com/brainsatplay/sponsor/23/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/sponsor/24/website" target="_blank"><img src="https://opencollective.com/brainsatplay/sponsor/24/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/sponsor/25/website" target="_blank"><img src="https://opencollective.com/brainsatplay/sponsor/25/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/sponsor/26/website" target="_blank"><img src="https://opencollective.com/brainsatplay/sponsor/26/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/sponsor/27/website" target="_blank"><img src="https://opencollective.com/brainsatplay/sponsor/27/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/sponsor/28/website" target="_blank"><img src="https://opencollective.com/brainsatplay/sponsor/28/avatar.svg"></a>
<a href="https://opencollective.com/brainsatplay/sponsor/29/website" target="_blank"><img src="https://opencollective.com/brainsatplay/sponsor/29/avatar.svg"></a>
