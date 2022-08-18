console.log("Hello World!"); 
if(typeof window !== "undefined") 
document.body.innerHTML += "Hello World!";

document.body.insertAdjacentHTML('beforeend',`<div id='webrtc'></div>`)

//import { Router } from "../../routers/Router";
import { UserProps, UserRouter } from "../../../routers/users/User.router";
import { HTTPfrontend } from "../../../services/http/HTTP.browser";
import { SSEfrontend, EventSourceProps, EventSourceInfo } from "../../../services/sse/SSE.browser";
import { WSSfrontend, WebSocketProps, WebSocketInfo } from '../../../services/wss/WSS.browser';
import { WebRTCfrontend, WebRTCInfo, WebRTCProps } from '../../../services/webrtc/WebRTC.browser';

const router = new UserRouter({
    HTTPfrontend,
    WSSfrontend,
    SSEfrontend,
    WebRTCfrontend,
    Math
},{loadDefaultRoutes:true});

// router.run( 
//     'http/listen'
// );

// const hotreloadinfo = router.run('wss/openWS',{
//     host:'localhost',
//     port:8080,
//     path:'hotreload'
// } as WebSocketProps) as WebSocketInfo;

const socketinfo = router.run('wss.openWS',{
    host:'localhost',
    port:8080,
    path:'wss'
} as WebSocketProps) as WebSocketInfo;

const sseinfo = router.run('sse.openSSE',{
    url:'http://localhost:8080/sse',
    events:{
        'test':(ev)=>{console.log('test',ev.data)}
    }
} as EventSourceProps) as EventSourceInfo;


console.log("Router:",router);

router.run(
    'http.GET',
    'http://localhost:8080/ping'
).then((res:string) => console.log("http GET", res));

let button = document.createElement('button');
button.innerHTML = 'ping!';
button.onclick = () => {
    router.run(
        'http.GET',
        'http://localhost:8080/ping'
    ).then((res:string) => console.log("http GET", res));
}

document.body.appendChild(button);



//console.log(router,socketinfo,sseinfo);

//send ping via xhr to http server,
//receive pong through SSE and WS
console.log('adding user')
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

    let button = document.createElement('button');
    button.innerHTML = 'Open RTC Room';
    let myrooms = document.createElement('div');
    myrooms.innerHTML = 'My Rooms<br>'
    let allrooms = document.createElement('div');
    allrooms.innerHTML = 'Available Rooms<br>'

    document.body.appendChild(button);
    document.body.appendChild(myrooms);
    document.body.appendChild(allrooms);
    
    user.rooms = {};

    button.onclick = () => {
        (router.services.webrtc as WebRTCfrontend).openRTC().then((room:WebRTCInfo) => {
            user.rooms[room._id] = {
                joined:false,
                ownerId:user._id,
                deleted:false
            };

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
                            } else if(res.data.shared[userId].rooms) {
                                for(const roomId in res.data.shared[userId].rooms) {
                                    
                                    const room = res.data.shared[userId].rooms[roomId];

                                    if(room.deleted) {
                                        if((myrooms.querySelector('#'+roomId+'joined') as any)) (myrooms.querySelector('#'+roomId) as any).remove();
                                        else if((userrooms.querySelector('#'+roomId+'joined') as any)) (userrooms.querySelector('#'+roomId) as any).remove();
                                        delete user.rooms[roomId];
                                    } 
                                    else if(!userrooms.querySelector('#'+roomId)) {
                                        if(myrooms.querySelector('#'+roomId)) {
                                            (myrooms.querySelector('#'+roomId+'joined') as any).innerHTML = 'Available: ' + !room.joined;
                                            user.rooms[roomId].joined = room.joined;
                                        } else if(room.ownerId === userId) {

                                            userrooms.insertAdjacentHTML('beforeend',`
                                                <div id='${roomId}'>
                                                    Room ID: ${roomId}<br>
                                                    <div id='${roomId}joined'>Available: ${!room.joined}</div>
                                                    <button id='${roomId}join'>Join</button>
                                                </div>
                                            `);

                                            (document.getElementById(roomId+'join') as HTMLButtonElement).onclick = () => {
                                                //(router.services.webrtc as WebRTCfrontend).openRTC({_id:roomId})
                                                user.rooms[roomId] = {
                                                    joined:true
                                                };
                                            }
                                        } 
                                    } else {
                                        (userrooms.querySelector('#'+roomId+'joined') as any).innerHTML = 'Available: ' + !room.joined;
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

    // user.request({route:'getSessionInfo'}).then((res) => {
    //     console.log('getSessionInfo',res);
    // });

    // (user as any).request({route:'openSharedSession',args:{settings:{name:'testsession',propnames:{x:true, test:true}}}})
    //     .then(session => {
    //         let res;
    //         if(session?._id) res = router.run('joinSession',session._id,user,session); //this will call the state
    //         //console.log(res);
    //         //send session data over webrtc data channel

    //     });
    // router.run(
    //     'http/POST',
    //     info,
    //     'http://localhost:8080/addUser'
    // );
});

console.log(p);

