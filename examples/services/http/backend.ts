import { HTTPbackend, ServerProps, ServerInfo, SSEbackend, SSEProps, WSSbackend, SocketServerProps } from "../../../index.node"//"graphscript-node";
import { Router } from '../../../src/services/router/Router';

function exitHandler(options, exitCode) {
        
    if (exitCode || exitCode === 0) console.log('SERVER EXITED WITH CODE: ',exitCode);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));


const router = new Router({
    services:{
        'http':HTTPbackend,
        'wss':WSSbackend,
        'sse':SSEbackend
    }
});


let server = router.run(
    'setupServer',
    {
        protocol:'http',
        host:'localhost',
        port:8080,
        pages:{
            '/*':{
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
)

if(server instanceof Promise) server.then((served:ServerInfo) => { //this function returns a promise so we can use .then, only explicitly async or promise-returning functions can be awaited or .then'd for good performance!
    
    //console.log(router.__node.nodes.keys());

    const socketserver = router.run(
        'setupWSS',
        {
            server:served.server,
            host:served.host,
            port:8081,
            path:'wss',
            onconnection:(ws,req,serverinfo,id)=>{
                ws.send('Hello from WSS!');
            }
        } as SocketServerProps
    );
    
    const hotreload = router.run(
        'setupWSS',
        {
            server:served.server,
            host:served.host,
            port:7000,
            path:'hotreload',
            onconnection:(ws)=>{
                ws.send('Hot reload port opened!');
            }
        } as SocketServerProps
    );

    const sseinfo = router.run(
        'setupSSE',
        {
            server:served.server,
            path:'sse',
            channels:['test'],
            onconnection:(session,sseinfo,id,req,res)=>{
                console.log('pushing sse!')
                session.push('Hello from SSE!');
                sseinfo.channels.forEach(
                    (c:string) => sseinfo.channel.broadcast(
                        'SSE connection at '+req.headers.host+'/'+req.url, c 
                    )
                );
            },
        } as SSEProps
    )

    //console.log(socketserver);
    //console.log(sseinfo)
}); //make a default server