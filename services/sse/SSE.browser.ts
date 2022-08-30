import { HTTPfrontend, RequestOptions } from "../http/HTTP.browser";
import { Service, Routes, ServiceOptions, ServiceMessage } from "../Service";

export type EventSourceProps = {
    url:string,
    events:{
        message?:(ev:any,sseinfo?:EventSourceInfo)=>void,  //will use this.receive as default
        open?:(ev:any,sseinfo?:EventSourceInfo)=>void,
        close?:(ev:any,sseinfo?:EventSourceInfo)=>void,
        error?:(ev:any,sseinfo?:EventSourceInfo)=>void,
        [key:string]:any
    }
    //these callbacks are copied to events object above if not defined, just simpler
    onmessage?:(ev:any,sseinfo?:EventSourceInfo)=>void,  //will use this.receive as default
    onopen?:(ev:any,sseinfo?:EventSourceInfo)=>void,
    onclose?:(ev:any,sseinfo?:EventSourceInfo)=>void,
    onerror?:(ev:any,sseinfo?:EventSourceInfo)=>void,
    evoptions?:boolean|AddEventListenerOptions,
    type?:'eventsource'|string,
    _id?:string,
    keepState?:boolean
}

export type EventSourceInfo = {
    source:EventSource,
    send:(message:any)=>any,
    request:(message:any, method?:string)=>Promise<any>,
    post:(route:any, args?:any)=>void,
    run:(route:any, args?:any, method?:string)=>Promise<any>,
    subscribe:(route:any, callback?:((res:any)=>void)|string)=>any,
    unsubscribe:(route:any, sub:number)=>Promise<boolean>,
    terminate:() => void,
    graph:SSEfrontend
} & EventSourceProps

export class SSEfrontend extends Service {

    name='sse'
    
    eventsources:{
        [key:string]:EventSourceInfo
    }={}

    connections = { //higher level reference for Router
        eventsources:this.eventsources
    }

    constructor(options?:ServiceOptions) {
        super(options);
        this.load(this.routes);
    }
    
    openSSE = (
        options:EventSourceProps
    ) => {
        let source = new EventSource(options.url);

        let sse = {
            source,
            type:'eventsource',
            ...options
        } as EventSourceInfo;

        if(!('keepState' in options)) options.keepState = true; //default true
        if(!options.events) options.events = {};

        if(options.events.close) {
            let close = options.events.close;
            options.events.close = (ev) => { if(sse.onclose) sse.onclose(ev,sse); close(ev,sse); };
        }
        if(options.events.open) {
            let open = options.events.open;
            options.events.open = (ev) => { if(sse.onopen) sse.onopen(ev,sse); open(ev,sse); };
        }
        if(options.events.error) {
            let error = options.events.error;
            options.events.error = (ev) => { if(sse.onerror) sse.onerror(ev,sse); error(ev,sse); };
        }
        if(options.events.message) {
            let message = options.events.message;
            options.events.message = (ev) => { if(sse.onmessage) sse.onmessage(ev,sse); message(ev,sse); };
        }

        if(!options.events.message) {
            options.events.message = (ev, sse) => {

                let data = ev.data;

                if(data) if(typeof data === 'string') {
                    let substr = data.substring(0,8);
                    if(substr.includes('{') || substr.includes('[')) {    
                        if(substr.includes('\\')) data = data.replace(/\\/g,"");
                        if(data[0] === '"') { data = data.substring(1,data.length-1)};
                        //console.log(message)
                        data = JSON.parse(data); //parse stringified objects

                        if(data.route === 'setId' && sse) {
                            sse._id = data.args;
                            options.events.message = (e, sse) => { //clear extra logic after id is set
                                const result = this.receive(e.data,sse);
                                if(options.keepState) this.setState({[options.url]:e.data}); 
                            }
                        }
                    }
                } 

                const result = this.receive(ev.data,sse);
                if(options.keepState) this.setState({[options.url]:data}); 
            }
        }
        if(!options.events.error) options.events.error = (ev, sse) => {
            this.terminate(sse as any);
            delete this.eventsources[options.url];
        }

        if(options.events) {
            if(!options.evoptions) options.evoptions = false;
            for(const key in options.events) {
                if(typeof options.events[key] !== 'function') {
                    options.events[key] = (ev:MessageEvent) => { //default callback 
                        const result = this.receive(ev.data, sse);
                        if(options.keepState) this.setState({[options.url]:result}); 
                    }
                } else {
                    let l = options.events[key];
                    options.events[key] = (ev:MessageEvent) => {l(ev,sse);};
                }
                source.addEventListener(key,options.events[key],options.evoptions);
            }
        }

        let send = (message:ServiceMessage|any) => {
            return this.transmit(message,options.url);
        }

        let request = (message:ServiceMessage|any, method?:string,  sessionId?:string) => {
            return this.request(message, options.url, sessionId, method);
        }

        let post = (route:any, args?:any, method?:string) => {
            //console.log('sent', message)
            let message:any = {
                route,
                args
            };
            if(method) message.method = method;

            return this.transmit(message,options.url);
        }

        let run = (route:any,args?:any,method?:string,sessionId?:string) => {
            return this.request({route,args}, options.url, method, sessionId);
        }

        let subscribe = (route:any, callback?:((res:any)=>void)|string):Promise<number> => {
            return this.subscribeToSSE(route, options.url, callback, sse._id);
        }

        let unsubscribe = (route:any, sub:number):Promise<any> => {
            return run('unsubscribe',[route,sub]);
        }

        let terminate = () => {
            return this.terminate(options.url);
        }

        sse.send = send;
        sse.request = request;
        sse.post = post;
        sse.run = run;
        sse.subscribe = subscribe;
        sse.unsubscribe = unsubscribe;
        sse.terminate = terminate;
        sse.graph = this;

        this.eventsources[options.url] = sse;
        //console.log(source);

        return sse;
    }

    POST = (
        message:any|ServiceMessage, 
        url:string|URL='http://localhost:8080/echo', 
        type:XMLHttpRequestResponseType='', 
        mimeType?:string|undefined
    ) => {
        if(typeof message === 'object' && (type === 'json' || type === 'text' || !type)) {
            message = JSON.stringify(message);
        }

        if(type === 'json') mimeType = 'application/json';
        return new Promise((resolve,reject) => {
            let xhr = HTTPfrontend.request({
                method:'POST',
                url,
                data:message,
                responseType:type,
                mimeType,
                onload:(ev)=>{ 
                    let data;
                    if(xhr.responseType === '' || xhr.responseType === 'text')
                        data = xhr.responseText;
                    else data = xhr.response;
                    if(url instanceof URL) url = url.toString();
                    this.setState({[url]:data});
                    resolve(data);
                },
                onabort:(er)=>{ reject(er); }
            });
        }).catch(console.error);

    }

    transmit = (
        message:any|ServiceMessage, 
        url:string|URL
    ) => {
        return this.POST(message,url,'json');
    }

    request = (
        message:ServiceMessage|any,
        url:string,
        method?:string,
        sessionId?:string //indicates this unique session id for the server to identify you
    ) => {
        return new Promise((res,rej) => {
            let callbackId = `${Math.random()}`;
            let req:any = {route:'runRequest',args:[message,url,callbackId,sessionId]}
            if(method) req.method = method;
            let evs = this.eventsources[url].source;

            let onmessage = (ev:any) => {
                let data = ev.data;
                if(typeof data === 'string') if(data.includes('callbackId')) data = JSON.parse(data);
                if(typeof data === 'object') if(data.callbackId === callbackId) {
                    evs.removeEventListener('message',onmessage);
                    res(data.args);
                }
            }

            evs.addEventListener('message',onmessage);
            this.POST(message, url,'json');
        });
    }

    runRequest = (
        message:any,
        url:string|any,
        callbackId:string|number,
        sessionId?:string
    ) => {
        let res = this.receive(message);
        if(url) {
            if(res instanceof Promise) {
                res.then((r) => {
                    let message = {args:r,callbackId,sessionId};
                    this.POST(message,url,'json');
                })
            } else {
                let message = {args:res,callbackId,sessionId};
                this.POST(message,url,'json');
            }
        }
        return res;
    }

    subscribeSSE = (route:string,url:string) => {
        return this.subscribe(route,(res) => {
            this.POST(res,url,'json');
        })
    }
    
    subscribeToSSE = (route:string, url:string, callback?:string|((res:any)=>void), sessionId?:string) => {
        if(url) {
            this.subscribe(url,(res) => {
                let msg = JSON.parse(res);
                if(msg?.callbackId === route) {
                    if(!callback) this.setState({[url]:msg.args}); //just set state
                    else if(typeof callback === 'string') { //run a local node
                        this.run(callback,msg.args);
                    }
                    else callback(msg.args);
                }
            });

            return this.eventsources[url].run('subscribeSSE',[route,url,sessionId])
        } 
    }

    terminate = (sse:EventSourceInfo|EventSource|string) => {
        if(typeof sse === 'string') {
            let str = sse;
            sse = this.eventsources[sse];
            delete this.eventsources[str];
        }
        if(!sse) return;
        if(typeof sse === 'object') {
            if((sse as EventSourceInfo).source) {
                sse = (sse as EventSourceInfo).source;
            }
           
            if (sse instanceof EventSource) 
                if(sse.readyState !== 2)
                    (sse as EventSource).close();
        }
    } 

    routes:Routes = {
        openSSE:{
            operator:this.openSSE,
            aliases:['open']
        },
        request:this.request,
        runRequest:this.runRequest,
        transmit:this.transmit,
        POST:this.POST,
        terminate:this.terminate,
        subscribeToSSE:this.subscribeToSSE, //outgoing subscriptions
        subscribeSSE:this.subscribeSSE, //incoming subcriptions
    }
}