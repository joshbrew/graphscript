# Routers

Routers are used to quickly collect services into one unified framework in order to quickly define which outputs from which functions you want to pipe through remote or internal services in a unified fashion. You can simply call services by name or access their class methods directly, and run functions on the router the same way they function in the node and graph, just with a higher level way to allow services to have awareness of each other. 

Additionally, it includes ways to select the fastest available endpoints from selected services and automatically stream updates from watched objects through whatever routes or endpoints you desire e.g. for linking game and server state across many clients or simplifying frontend business logic down to a few object and function calls.


## Example:

### Backend:
```ts

type RouterOptions = {
    linkServices?:boolean, //have all services map each other's nodes?
    includeClassName?:boolean, //reroute services with their class/variable/service name if defined (anonymous objects won't add reroutes!!)
    loadDefaultRoutes?:boolean, //default route access
    routeFormat?:string,
    customRoutes?:ServiceOptions['customRoutes'],
    customChildren?:ServiceOptions['customChildren']
}

let roptions = {
    loadDefaultRoutes:true
};

let router = new Router([
    HTTPbackend,
    WSSbackend,
    SSEbackend
],
    roptions
);

//when ping is run it should pong through wss and sse now

//console.log(router);

router.run(
    'http/setupServer',
    {
        protocol:'http',
        host:'localhost',
        port:8080,
        startpage:'index.html',
        // certpath:'cert.pem', 
        // keypath:'key.pem',
        // passphrase:'encryption',
        //errpage:undefined,
        pages:{
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
            all:{
                inject:{
                    hotreload:'ws://localhost:8080/hotreload' 
                    //You can add routes that are either template strings or functions accepting arguments (like the above url) to inject anything into pages. 
                    //You can even specify which pages are injected with which templates, or build entire pages from a mix of hand coded and prewritten components (IDK it's cool)
                }
            }
        }
    } as ServerProps
).then((served:ServerInfo) => { //this function returns a promise so we can use .then, only explicitly async or promise-returning functions can be awaited or .then'd for good performance!
    
    const socketserver = router.run(
        'wss/setupWSS',
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
        'wss/setupWSS',
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
        'sse/setupSSE',
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
//router.services.http.run('setupServer');
//router.services.http.setupServer();
//router.services.http.routes.setupServer();
//router.routes.['http/setupServer'](); //this the original function/property object, it won't set state.

console.log('main service routes',router.service.routes);
console.log('http service routes',router.services.http.routes);

const sub1 = router.pipe('ping','log','wss');
const sub2 = router.pipe('ping','log','sse');

```

### Frontend:
```ts


const router = new Router([
    HTTPfrontend,
    WSSfrontend,
    SSEfrontend
], {
    loadDefaultRoutes:true
});

router.run( 
    'http/listen'
);

// const hotreloadinfo = router.run('wss/openWS',{
//     host:'localhost',
//     port:8080,
//     path:'hotreload'
// } as WebSocketProps) as WebSocketInfo;

const socketinfo = router.run('wss/openWS',{
    host:'localhost',
    port:8080,
    path:'wss'
} as WebSocketProps) as WebSocketInfo;

const sseinfo = router.run('sse/openSSE',{
    url:'http://localhost:8080/sse',
    events:{
        'test':(ev)=>{console.log('test',ev.data)}
    }
} as EventSourceProps) as EventSourceInfo;

router.run(
    'http/GET',
    'http://localhost:8080/ping'
).then((res:string) => console.log("http GET", res));

let button = document.createElement('button');
button.innerHTML = 'ping!';
button.onclick = () => {
    router.run(
        'http/GET',
        'http://localhost:8080/ping'
    ).then((res:string) => console.log("http GET", res));
}

document.body.appendChild(button);


console.log("Router:",router);


```


# User Router

This is where the router really shines. You can create users and shared remote data sessions in just a few lines, where every user is automatically associated with their endpoints and then persistent user sessions can be created with efficient checks are used to only update users with new data as necessary over one-on-one, or async/sync group sessions (i.e. where only one user or all users share data to other connected users).


## Example:

### Backend:
```ts

let router = new UserRouter([
    HTTPbackend,
    WSSbackend,
    SSEbackend
],
{
    loadDefaultRoutes:true
});


router.run(
    'http.setupServer',
    {
        protocol:'http',
        host:'localhost',
        port:8080,
        startpage:'index.html',
        // certpath:'cert.pem', 
        // keypath:'key.pem',
        // passphrase:'encryption',
        //errpage:undefined,
        pages:{
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
                inject:{
                    hotreload:'ws://localhost:8080/hotreload'
                }
            }
        }
    } as ServerProps
).then((served:ServerInfo) => { //this function returns a promise so we can use .then, only explicitly async or promise-returning functions can be awaited or .then'd for good performance!
    
    const socketserver = router.run(
        'wss.setupWSS',
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
        'wss.setupWSS',
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
        'sse.setupSSE',
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

router.addUser({ //e.g. we can have an admin user to build controls for ourselves
    _id:'admin'
} as UserProps);

router.run('sessionLoop'); //run the loop to check session updates and pipe to users automatically

let session = router.openSharedSession({
    _id:'webrtcrooms',
    settings:{
        name:'webrtcrooms',
        propnames:{
            rooms:true //if these props are updated on the user object locally then we'll return them to the rest of the users (or to the host if hosted). the user's app needs to track updates independently and stream them, the functions we give will autocorrect based on user updates (incl if they leave the session) and otherwise use minimal bandwidth.
        }  
    }
},'admin');

///console.log('session',session, 'sessions', router.sessions);

router.subscribe('addUser', (res) =>{ //we are going to automatically add every new user to a session to show available webrtc rooms from users and connect them to each other
    //console.log('user joining webrtcrooms', res._id);
    if (typeof res === 'object') {
        let user = res;
        let joined = router.joinSession('webrtcrooms',user);
        
        if(joined) {
            user.send(
                JSON.stringify({route:'joinSession',args:[joined._id,user._id,joined]})
            );
     }
    }
})


```

### Then frontend again:
```ts


const router = new UserRouter([
    HTTPfrontend,
    WSSfrontend,
    SSEfrontend,
    WebRTCService
], {
    loadDefaultRoutes:true
});


router.run( 
    'http/listen'
);

const hotreloadinfo = router.run('wss/openWS',{
    host:'localhost',
    port:8080,
    path:'hotreload'
} as WebSocketProps) as WebSocketInfo;

const socketinfo = router.run('wss/openWS',{
    host:'localhost',
    port:8080,
    path:'wss'
} as WebSocketProps) as WebSocketInfo;

const sseinfo = router.run('sse/openSSE',{
    url:'http://localhost:8080/sse',
    events:{
        'test':(ev)=>{console.log('test',ev.data)}
    }
} as EventSourceProps) as EventSourceInfo;

router.run(
    'http/GET',
    'http://localhost:8080/ping'
).then((res:string) => console.log("http GET", res));

let button = document.createElement('button');
button.innerHTML = 'ping!';
button.onclick = () => {
    router.run(
        'http/GET',
        'http://localhost:8080/ping'
    ).then((res:string) => console.log("http GET", res));
}

document.body.appendChild(button);


console.log("Router:",router);


let p = router.addUser(
    {
        sockets:{
            [socketinfo.address]:socketinfo
            // 'ws':{ //declare props too
            //     host:'localhost',
            //     port:8080,
            //     path:'wss'
            // } as WebSocketProps
        },
        eventsources:{
            [sseinfo.url]:sseinfo
            // 'sse':{
            //     url:'http://localhost:8080/sse',
            //     events:{
            //         'test':(ev)=>{console.log('test',ev.data)}
            //     }
            // } as EventSourceProps
        }
    } as UserProps
).then((user:UserProps) => {
    //connected user, trigger backend to add the same user id
    console.log("Added user:", user);
    let info = router.getConnectionInfo(user);

    let connectbutton = document.createElement('button');
    connectbutton.innerHTML = 'Open RTC Room';
    let myrooms = document.createElement('div');
    myrooms.innerHTML = 'My Rooms<br>';
    myrooms.id = user._id as string;
    let allrooms = document.createElement('div');
    allrooms.innerHTML = 'Available Rooms<br>'

    document.body.appendChild(connectbutton);
    document.body.appendChild(allrooms);
    allrooms.appendChild(myrooms);
    
    user.rooms = {};
    user.localrtc = {};

    connectbutton.onclick = () => {

        let newId = `rtc${Math.floor(Math.random()*1000000000000000)}`;

        user.rooms[newId] = {
            joined:false,
            ownerId:user._id,
            deleted:false,
            isLive:false,
            hostcandidates:{},
            hostdescription:undefined,
            peercandidates:{},
            peerdescription:undefined
        };

        (router.services.webrtc as WebRTCfrontend).openRTC({
            _id:newId,
            onicecandidate:(ev) => {
                if(ev.candidate) {
                    let cid = `hostcandidate${Math.floor(Math.random()*1000000000000000)}`;
                    user.rooms[newId].hostcandidates[cid] = ev.candidate;   
                    console.log('setting ice candidate!', cid, ev.candidate);
                }
            },
        }).then((room:WebRTCInfo) => {

            user.rooms[newId].hostdescription = room.hostdescription;
            user.localrtc[newId] = room;
            
            myrooms.insertAdjacentHTML('beforeend',`
                <div id='${room._id}'>
                    Room ID: ${room._id}<br>
                    <div id='${room._id}joined'>Available: ${!user.rooms[room._id].joined}</div>
                    <button id='${room._id}close'>Close</button>
                </div>
            `);

            (document.getElementById(room._id+'close') as HTMLButtonElement).onclick = () => {
                (router.services.webrtc as WebRTCfrontend).terminate(room._id);
                document.getElementById(room._id)?.remove();
                user.rooms[room._id].deleted = true;                
            }
        });
    }

    router.subscribe('joinSession',(res) => {
        console.log('joinSessions fired', res);
        if(res?.settings.name === 'webrtcrooms') { //we are automatically added to this session by the backend when creating a user (for this example)
            router.subscribeToSession('webrtcrooms',(user as any)._id,
            (res:any)=>{ //whenever we receive an update from webrtcrooms session, do this:
                console.log(res);
                if(res.data.shared) {
                    for(const userId in res.data.shared) {
                        if(userId == user._id) { // this is your data returned to you
                            console.log(userId, '(my data, returned from server)',res.data.shared[userId]);
                        }
                        else { //this is data from other windows
                            console.log(userId, res.data.shared[userId]);
                            let userrooms = allrooms.querySelector('#'+userId);
                            if(!userrooms) {
                                allrooms.insertAdjacentHTML('beforeend',`
                                    <div id='${userId}'>
                                        User ${userId} rooms:<br>
                                    </div> 
                                `);
                                userrooms = allrooms.querySelector('#'+userId);
                            } 

                            if(userrooms && res.data.shared[userId].rooms) {
                                for(const roomId in res.data.shared[userId].rooms) {

                                    const remoteroom = res.data.shared[userId].rooms[roomId];


                                    if(remoteroom.deleted) {
                                        if((myrooms.querySelector('#'+roomId+'joined') as any)) (myrooms.querySelector('#'+roomId) as any).remove();
                                        else if((userrooms.querySelector('#'+roomId+'joined') as any)) (userrooms.querySelector('#'+roomId) as any).remove();
                                        delete user.rooms[roomId];
                                    } 
                                    else if(!allrooms.querySelector('#'+roomId) && remoteroom.ownerId === userId) {
                                            userrooms.insertAdjacentHTML('beforeend',`
                                                <div id='${roomId}'>
                                                    Room ID: ${roomId}<br>
                                                    <div id='${roomId}joined'>Available: ${!remoteroom.joined}</div>
                                                    <button id='${roomId}join'>Join</button>
                                                </div>
                                            `);

                                            (document.getElementById(roomId+'join') as HTMLButtonElement).onclick = () => {

                                                user.rooms[roomId] = {
                                                    joined:true,
                                                    ownerId:userId,
                                                    isLive:false,
                                                    hostcandidates:{},
                                                    hostdescription:remoteroom.hostdescription,
                                                    peercandidates:{},
                                                    peerdescription:undefined
                                                };

                                                (router.services.webrtc as WebRTCfrontend).openRTC({
                                                    _id:roomId, 
                                                    hostdescription:remoteroom.hostdescription,
                                                    onicecandidate:(ev) => {
                                                        if(ev.candidate) user.rooms[roomId].peercandidates[`peercandidate${Math.floor(Math.random()*1000000000000000)}`] = ev.candidate;
                                                    },
                                                }).then((localroom) => {

                                                    user.localrtc[roomId] = localroom;
                                                    user.rooms[roomId].peerdescription = localroom.peerdescription;
                                                    
                                                    if(remoteroom.hostcandidates) {
                                                        for(const c in remoteroom.hostcandidates) {
                                                            console.log('adding host ice candidate!', remoteroom.hostcandidates[c], 'for room', localroom)
                                                            user.rooms[roomId].hostcandidates[c] = true;
                                                            (localroom.rtc as RTCPeerConnection).addIceCandidate(remoteroom.hostcandidates[c]);
                                                        }
                                                    }
                                                });
                                            }
                                         
                                    } else {

                                        console.log('remote room',remoteroom, ', local room?',user.localrtc[roomId]);
                                        (allrooms.querySelector('#'+roomId+'joined') as any).innerHTML = 'Available: ' + !remoteroom.joined;

                                        if(remoteroom.hostcandidates && user.rooms[roomId] && user._id !== remoteroom.ownerId) {
                                            for(const c in remoteroom.hostcandidates) {
                                                if(!(c in user.rooms[roomId].hostcandidates)) {
                                                    console.log('adding new host ice candidate!', remoteroom.hostcandidates[c], 'for room', user.localrtc[roomId].rtc)
                                                    user.rooms[roomId].hostcandidates[c] = true;
                                                    (user.localrtc[roomId].rtc as RTCPeerConnection).addIceCandidate(remoteroom.hostcandidates[c]);
                                                }
                                            }
                                            if(remoteroom.isLive && !user.rooms[roomId].isLive) {
                                                user.rooms[roomId].isLive = true;
                                                console.log('session is live!', roomId)
                                            }
                                        } 
                                        
                                        if (
                                            remoteroom.peerdescription && 
                                            user.rooms[roomId] && 
                                            user._id === remoteroom.ownerId 
                                        ) {
                                            if(!user.rooms[roomId].peerdescription) {
                                                (router.services.webrtc as WebRTCfrontend).answerPeer((user.localrtc[roomId].rtc as RTCPeerConnection), remoteroom).then(() => {
                                                    user.rooms[roomId].isLive = true;
                                                    user.rooms[roomId].joined = true;
                                                    user.rooms[roomId].peerdescription = remoteroom.peerdescription;
                                                    if(user.rooms[roomId].peercandidates) {
                                                        for(const c in user.rooms[roomId].peercandidates) {
                                                            console.log('adding new peer ice candidate!', remoteroom.peercandidates[c], 'for room', user.localrtc[roomId].rtc);
                                                            user.rooms[roomId].peercandidates[c] = true;
                                                        }
                                                    }
                                                    console.log('session is live!', roomId);

                                                    setTimeout(() => {
                                                        console.log('attempting to ping');
                                                        (user.localrtc[roomId] as WebRTCInfo).run('ping').then((r)=>{console.log('returned from remote peer:',r);  }).catch(console.error);
                                                    }, 1000)
                                                })
                                                // remoteroom.peerdescription = JSON.parse(decodeURIComponent(remoteroom.peerdescription));
                                                // (user.localrtc[roomId].rtc as RTCPeerConnection).setRemoteDescription(remoteroom.peerdescription).then(() => {
                                                //     user.rooms[roomId].peerdescription = remoteroom.peerdescription;
                                                //     for(const c in remoteroom.peercandidates) {
                                                //         console.log('adding new peer ice candidate!', remoteroom.peercandidates[c], 'for room', user.localrtc[roomId].rtc);
                                                //         (user.localrtc[roomId].rtc as RTCPeerConnection).addIceCandidate(remoteroom.peercandidates[c]);
                                                //         user.rooms[roomId].peercandidates[c] = true;
                                                //     }
                                                // });
                                            } else if(remoteroom.peercandidates) {
                                                for(const c in remoteroom.peercandidates) {
                                                    if(!user.rooms[roomId].peercandidates[c]) {
                                                        console.log('adding new peer ice candidate!', remoteroom.peercandidates[c], 'for room', user.localrtc[roomId].rtc);
                                                        (user.localrtc[roomId].rtc as RTCPeerConnection).addIceCandidate(remoteroom.peercandidates[c]);
                                                        user.rooms[roomId].peercandidates[c] = true;
                                                    }
                                                }
                                            }
                                        } 

                                        
                                    }
                                }
                            }
                        }
                    }
                }
            });
        }
    });


    (user as any).send(JSON.stringify({route:'addUser',args:info}));
    
    router.run('userUpdateLoop',user); //initialize the user updates 

```






Mmmmagic


