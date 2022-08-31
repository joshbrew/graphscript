## HTTPbackend

The HTTPbackend service puts the power of graphs and services into a full featured HTTP or HTTPS server. This lets you serve static assets or dynamic content straight from routes all through standard or customizable http fetch calls. This means you can implement your entire own http protocols and state machines willy nilly and feel like a backend master, it's a lot of fun! 

See `examples/httpserver` to get started with a simple implementation.

The extended `RouteProp` when declaring routes/nodes in Service.ts was made for this:
```ts
type RouteProp = { //these are just multiple methods you can call on a route/node tag kind of like http requests but really it applies to any function you want to add to a route object if you specify that method even beyond these http themed names :D
    get?:OperatorType|((...args:any)=>any|void),  //returned in HTTP GET requests, defasults to the operator. Returned strings get posted as HTTP, or returned file paths will be evaluated as strings
    post?:OperatorType|((...args)=>any|void), //post response 
    put?:(...args:any)=>any|void,
    head?:(...args:any)=>any|void,
    delete?:(...args:any)=>any|void,
    patch?:(...args:any)=>any|void,
    options?:(...args:any)=>any|void,
    connect?:(...args:any)=>any|void,
    trace?:(...args:any)=>any|void,
    aliases?:string[] 
} & GraphNodeProperties


```

These routes work like any other graph nodes, but we reserve the http methods (lower case!) to allow for multiplexing with http requests, or any other methods specified via service messages or http requests.

Now let's spin up a quick server:

```ts

import {HTTPbackend} from 'graphscript-node'

type ServerProps = {
    host:string,
    port:number,
    certpath?:string, 
    keypath?:string,
    passphrase?:string,
    startpage?: string,
    errpage?:string,
    pages?:{
        [key:'all'|string]:string|{  //objects get loaded as nodes which you can modify props on
            template?:string,
            onrequest?:GraphNode|string|((self:HTTPbackend, node:GraphNode, request:http.IncomingMessage, response:http.ServerResponse)=>void), //run a function or node? the template, request and response are passed as arguments, you can write custom node logic within this function to customize inputs etc.
            redirect?:string, // can redirect the url to call a different route instead, e.g. '/':{redirect:'home'} sets the route passed to the receiver as 'home'
            inject?:{[key:string]:{}|null}|string[]|string| ((...args:any)=>any) //append html      
        } & RouteProp
    },
    protocol?:'http'|'https',
    type?:'httpserver'|string,
    keepState?:boolean, //setState whenever a route is run? State will be available at the address (same key of the object storing it here)
    [key:string]:any
}

type ServerInfo = {
    server:https.Server|http.Server,
    address:string
} & ServerProps

const http = new HTTPbackend();

http.setupServer(
    {
        protocol:'http',
        host:'localhost',
        port:8080,
        pages:{ //other than _all, these routes are created unique to this port. Specify any route props, as well as some custom properties for useful behaviors like custom request handling e.g. dynamic http, redirects, customizing file loads (if a valid file path is returned)
            '/':{
                template:`<div>Nice...</div>`,
                onrequest:(self,node,req,res)=>{ 
                    node.get = `<h3>Hello World!! The Time: ${new Date(Date.now()).toISOString()}</h3>`  
                }
            },
            'config':{
                template:'tinybuild.config.js'
            },
            'home':{
                redirect:'/'
            },
            'redir':{
                redirect:'https://google.com'
                onrequest:(self,node,req,res) => {
                    console.log('redirected to google')
                }
            },
            'test':'<div>TEST</div>',
            _all:{
                inject:{ //page building
                    hotreload:'ws://localhost:8080/hotreload' //this is a route that exists as dynamic content with input arguments, in this case it's a url, could pass objects etc in as arguments
                }
            }
        }//,
        // startpage:'index.html',
        // errpage:undefined,
        // certpath:'cert.pem', 
        // keypath:'key.pem',
        // passphrase:'encryption',
    } as ServerProps
).then((served:ServerInfo) => { //this function returns a promise so we can use .then, only explicitly async or promise-returning functions can be awaited or .then'd for good performance!
    
    console.log(http.nodes.keys())

});

```

Easy!

The page specification lets you quickly set up static and dynamic page behaviors, if you pass an object then the routes are interpreted as node definitions which you can make as complicated as you want to run graph trees.

If a node's .get/.template returns a file path it will see if it can load the file on the server, just a nice way for dynamic file routing. 

From here we can apply websocket, sse, and other services to build efficient web servers. See `examples/httpserver` for a quick implementation