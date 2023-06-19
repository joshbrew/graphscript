import { Service, ServiceMessage, ServiceOptions } from "../Service";
import * as http from 'http'
import * as https from 'https'
import * as fs from 'fs'
import * as path from 'path'
import { GraphNode, GraphNodeProperties } from "../../core/Graph";

export * from './boilerplate/index'

export type ServerProps = {
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
        } & GraphNodeProperties
    },
    protocol?:'http'|'https',
    type?:'httpserver'|string,
    keepState?:boolean, //setState whenever a route is run? State will be available at the address (same key of the object storing it here)
    onopen?:(served:ServerInfo)=>void, //onopen callback
    onclose?:(served:ServerInfo)=>void, //server close callback
    _id?:string,
    [key:string]:any
}

export type ServerInfo = {
    server:https.Server|http.Server,
    address:string,
    terminate:()=>void,
    graph:HTTPbackend,
    _id:string
} & ServerProps

export type ReqOptions = {
    protocol:'http'|'https'|string
    host:string,
    port:number,
    method:string,
    path?:string,
    headers?:{
        [key:string]:any,
        'Content-Type'?:string, //e.g...
        'Content-Length'?:number
    }
}

//http/s server 
export class HTTPbackend extends Service {

    name='http';

    server:any

    debug:boolean=false

    servers:{
        [key:string]:ServerInfo
    }={}

    mimeTypes:{[key:string]:string} = { 
        '.html': 'text/html', '.htm': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.txt':'text/plain',
        '.png': 'image/png', '.jpg': 'image/jpg', '.jpeg': 'image/jpg','.gif': 'image/gif', '.svg': 'image/svg+xml', '.xhtml':'application/xhtml+xml', '.bmp':'image/bmp',
        '.wav': 'audio/wav', '.mp3':'audio/mpeg', '.mp4': 'video/mp4', '.xml':'application/xml', '.webm':'video/webm', '.webp':'image/webp', '.weba':'audio/webm',
        '.woff': 'font/woff', 'woff2':'font/woff2', '.ttf': 'application/font-ttf', '.eot': 'application/vnd.ms-fontobject', '.otf': 'application/font-otf',
        '.wasm': 'application/wasm', '.zip':'application/zip','.xlsx':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', '.tif':'image/tiff',
        '.sh':'application/x-sh', '.csh':'application/x-csh', '.rar':'application/vnd.rar','.ppt':'application/vnd.ms-powerpoint', '.pptx':'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        '.odt':'application/vnd.oasis.opendocument.text','.ods':'application/vnd.oasis.opendocument.spreadsheet','.odp':'application/vnd.oasis.opendocument.presentation',
        '.mpeg':'video/mpeg','.mjs':'text/javascript','.cjs':'text/javascript','.jsonld':'application/ld+json', '.jar':'application/java-archive', '.ico':'image/vnd.microsoft.icon',
        '.gz':'application/gzip', 'epub':'application/epub+zip', '.doc':'application/msword', '.docx':'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.csv':'text/csv', '.avi':'video/x-msvideo', '.aac':'audio/aac', '.mpkg':'application/vnd.apple.installer+xml','.oga':'audio/ogg','.ogv':'video/ogg','ogx':'application/ogg',
        '.php':'application/x-httpd-php', '.rtf':'application/rtf', '.swf':'application/x-shockwave-flash', '.7z':'application/x-7z-compressed', '.3gp':'video/3gpp'
    };

    constructor(
        options?:ServiceOptions,
        settings?:ServerProps
    ) {
        super(options);
        this.load(this);

        //console.log(settings);
        if(settings) {
            this.setupServer(settings);
        }
    
    }

    //on server started
    onStarted = (protocol:'http'|'https'|string,host:string,port:number) => {
        console.log(`🐱 Node server running at 
            ${protocol}://${host}:${port}/`
        );
    }
    
    setupServer = (
        options:ServerProps={
            protocol:'http',
            host:'localhost',
            port:8080,
            startpage:'index.html'
        },
        requestListener?:http.RequestListener,
        onStarted?:()=>void
    )=>{
        //console.log(options);
        if(options.pages) {
            for(const key in options.pages) {
                if (typeof options.pages[key] === 'string') {
                    this.addPage(`${options.port}/${key}`, options.pages[key] as string)
                } else if (typeof options.pages[key] === 'object' || typeof options.pages[key] === 'function') {
                    if((options.pages[key] as any).template) {
                        (options.pages[key] as any).get = (options.pages[key] as any).template;
                    }
                    let rt = `${options.port}/${key}`;
                    if(key !== '_all') this.load({[rt]:options.pages[key]});
                }
            }
        }

        if(options.protocol === 'https') {
            return this.setupHTTPSserver(options as any, requestListener, onStarted);
        }
        else
            return this.setupHTTPserver(options, requestListener, onStarted);
    }
    
    open = this.setupServer;

    //insecure server, todo merge commands since they're basically copied
    setupHTTPserver = (
        options:ServerProps={
            host:'localhost' as string,
            port:8080 as number,
            startpage:'index.html',
            errpage:undefined
        },
        requestListener?:http.RequestListener,
        onStarted:()=>void = ()=>{this.onStarted('http',options.host,options.port)}
    ) => {

        const host = options.host;
        const port = options.port;
        options.protocol = 'http';

        if(!host || !port) return;

        const address = `${host}:${port}`;

        if(this.servers[address]) this.terminate(this.servers[address]);

        if(!('keepState' in options)) options.keepState = true; //default true

        const served = {
            server:undefined as any,
            type:'httpserver',
            address,
            ...options
        } as ServerInfo

        if(!requestListener) 
            requestListener = (
                request:http.IncomingMessage,
                response:http.ServerResponse
            ) => { 
            
            let received:any = {
                args:{request, response}, 
                method:request.method, 
                served
            }

            let url = (request as any).url.slice(1);
            if(!url) url = '/';
            //console.log(options)
            
            if(options.pages) {
                getPageOptions.call(this, url, received, options.pages, request, response, options.port);
            } else received.route = url;

            this.receive(received); 
        } //default requestListener

        //var http = require('http');
        const server = http.createServer(
            requestListener
        );

        served.server = server;
        served.terminate = () => {
            this.terminate(served);
        }
        served.service = this;

        // server.on('upgrade', (request, socket, head) => {
        //     this.onUpgrade(request, socket, head);
        // });

        this.servers[address] = served;
        served._id = options._id ? options._id : address;



        //SITE AVAILABLE ON PORT:
        return new Promise((resolve,reject) => {
            let resolved;
            server.on('error',(err)=>{
                console.error('Server error:', err.toString());
                if(!resolved) reject(err);
            });
            server.on('clientError',(err) =>{
                console.error(err);
            });
            server.listen( 
                port,host,
                ()=>{
                    onStarted(); 
                    if(served.onopen) served.onopen(served);
                    resolved = true;
                    resolve(served);
                }
            );
        }) as Promise<ServerInfo> ;
    }

    //secure server
    setupHTTPSserver = (
        options:ServerProps = {
            host:'localhost' as string,
            port:8080 as number,
            startpage:'index.html',
            certpath:'cert.pem' as string, 
            keypath:'key.pem' as string,
            passphrase:'encryption' as string,
            errpage:undefined as undefined|string
        },
        requestListener?:http.RequestListener,
        onStarted:()=>void = ()=>{this.onStarted('https',options.host,options.port)}
    ) => {

        const host = options.host;
        const port = options.port;
        options.protocol = 'https';

        if(!host || !port || !options.certpath || !options.keypath) return;
    
        if(this.servers[`${host}:${port}`]) this.terminate(this.servers[`${host}:${port}`])

        var opts = {
            key: fs.readFileSync(options.keypath),
            cert: fs.readFileSync(options.certpath),
            passphrase:options.passphrase
        };

        if(!('keepState' in options)) options.keepState = true; //default true

        const address = `${host}:${port}`;

        const served = {
            server:undefined as any,
            type:'httpserver',
            address,
            ...options
        } as ServerInfo;

        //default requestListener
        if(!requestListener) requestListener = (request:http.IncomingMessage,response:http.ServerResponse) => { 
            
            let received:any = {
                args:{request, response}, 
                method:request.method, 
                served
            }

            let url = (request as any).url.slice(1);
            if(!url) url = '/';

            if(options.pages) {
                getPageOptions.call(this, url, received, options.pages, request, response, options.port);
            } else received.route = url;
            
            this.receive(received); 
        } //default requestListener


        //var http = require('http');
        const server = https.createServer(
            opts,
            requestListener 
        );

        served.server = server;
        served.terminate = () => {
            this.terminate(served);
        }
        served.service = this;
        
        // server.on('upgrade', (request, socket, head) => {
        //     this.onUpgrade(request, socket, head);
        // });

        this.servers[address] = served;
        served._id = options._id ? options._id : address;


        //SITE AVAILABLE ON PORT:
        return new Promise((resolve,reject) => {
            let resolved;
            server.on('error',(err)=>{
                console.error('Server error:', err.toString());
                if(!resolved) reject(err);
            });
            server.on('clientError',(err) =>{
                console.error(err);
            });
            server.listen( 
                port,host,
                ()=>{
                    onStarted(); 
                    if(served.onopen) served.onopen(served);
                    resolved = true;
                    resolve(served);
                }
            );
        }) as Promise<ServerInfo>;
    }

    transmit = ( //generalized http request. The default will try to post back to the first server in the list
        message:any | ServiceMessage, 
        options:string|{
            protocol:'http'|'https'|string
            host:string,
            port:number,
            method:string,
            path?:string,
            headers?:{
                [key:string]:any,
                'Content-Type'?:string,
                'Content-Length'?:number
            }
        },
        ondata?:(chunk:any)=>void,
        onend?:()=>void

    ) => {
        let input = message;
        if(typeof input === 'object') input = JSON.stringify(input);

        if(typeof options === 'string' && message) return this.POST(options,message);
        else if(typeof options === 'string') return this.GET(options);
        
        if(!options) { //fill a generic post request for the first server if none provided
            let server = this.servers[Object.keys(this.servers)[0]];
            options = {
                protocol:server.protocol as any,
                host:server.host,
                port:server.port,
                method:'POST',
                path:message.route,
                headers:{
                    'Content-Type':'application/json',
                    'Content-Length':input.length
                }
            };
        } //get first server and use its settings for a generic post request
        else if (!options.headers) {
            options.headers = {
                'Content-Type':'application/json',
                'Content-Length':input.length
            }
        }

        return this.request(options,input,ondata,onend);
    }

    withResult = (
        response:http.ServerResponse,
        result:any,
        message:{
            route:string, 
            args:{request:http.IncomingMessage,response:http.ServerResponse},  //data will be an object containing request, response
            method?:string,
            served?:ServerInfo //server deets
        }
    ) => {
        if(result && !response.writableEnded && !response.destroyed) {
        
            let mimeType = 'text/plain';
            
            if(typeof result === 'string') {
                let extname = path.extname(result);

                if(extname && fs.existsSync(path.join(process.cwd(),result))) { //load file paths if returned
                    mimeType = this.mimeTypes[extname] || 'application/octet-stream';

                    result = fs.readFileSync(path.join(process.cwd(),result));
                    if(mimeType === 'text/html' && (message.served?.pages?._all || message.served?.pages?.[message.route])) {
                        result = this.injectPageCode(result.toString(),message.route,message.served as any) as any;
                    }
                }
                else if(typeof result === 'string' && result.includes('<') && result.includes('>') && (result.indexOf('<') < result.indexOf('>'))) //probably an html template
                    {
                        if(message?.served?.pages?._all || message?.served?.pages?.[message.route]) {
                            result = this.injectPageCode(result,message.route,message.served) as any;
                        }
                        response.writeHead(200,{'Content-Type':'text/html'});
                        response.end(result,'utf-8');
                        return;
                    }
            } else if(typeof result === 'object') {
                result = JSON.stringify(result);
                mimeType = 'application/json'
            }

            response.writeHead(200,{'Content-Type':mimeType});
            response.end(result,'utf-8');
        }
    }

    injectPageCode = (
        templateString:string, 
        url:string,             
        served:ServerInfo 
    ) => { 
        if ((served?.pages?.[url] as any)?.inject) { //inject per url
            if(typeof (served as any).pages[url].inject === 'object') 
                templateString = this.buildPage((served as any).pages[url].inject as any, templateString);
            else if (typeof (served as any).pages[url].inject === 'function') 
                templateString += ((served as any).pages[url].inject as any)();
            else if (typeof (served as any).pages[url].inject === 'string' || typeof (served as any).pages[url].inject === 'number') 
                templateString += (served as any).pages[url].inject;
        }
        if((served?.pages?._all as any)?.inject) { //any per server
            if(typeof (served.pages as any)._all.inject === 'object') 
                templateString = this.buildPage((served as any).pages._all.inject, templateString);
            else if (typeof (served as any).pages._all.inject === 'function') 
                templateString += (served as any).pages._all.inject();
            else if (typeof (served as any).pages._all.inject === 'string' || typeof (served as any).pages._all.inject === 'number') 
                templateString += (served as any).pages._all.inject;
        }  
        
        return templateString;
    }

    receive = ( //our fancy request response handler
        message:{
            route:string, 
            args:{request:http.IncomingMessage,response:http.ServerResponse},  //data will be an object containing request, response
            method?:string,
            node?:string, // alt for route
            served?:ServerInfo, //server deets
            redirect?:string //if we redirected the route according to page options
        }
    ) => {
        const request = message.args.request; 
        const response = message.args.response; 
        const method = message.method; 
        const served = message.served;

        if(this.debug) console.log(request.method, request.url);
        //console.log(request); //debug

        let result = new Promise((resolve,reject) => {

            response.on('error', (err) => {
                if(!response.writableEnded || !response.destroyed ) {
                    response.statusCode = 400;
                    response.end(undefined,undefined as any,()=>{                
                        reject(err);
                    });
                }
            });

            let getFailed = () => {
                if(response.writableEnded || response.destroyed) reject(requestURL); 
                if(requestURL == './' || requestURL == served?.startpage) {
                    let template = `<!DOCTYPE html><html><head></head><body style='background-color:#101010 color:white;'><h1>Brains@Play Server</h1></body></html>`; //start page dummy
                    if(served?.pages?._all || served?.pages?.error) {
                        template = this.injectPageCode(template,message.route,served) as any;
                    }
                    response.writeHead(200, { 'Content-Type': 'text/html' });
                    response.end(template,'utf-8',() => {
                        resolve(template);
                    }); //write some boilerplate server page, we should make this an interactive debug page
                    if(served?.keepState) this.setState({[served.address]:template});
                    //return;
                }
                else if(this.debug) console.log(`File ${requestURL} does not exist on path!`);
                response.writeHead(500); //set response headers
                response.end(undefined,undefined as any,()=>{
                    reject(requestURL);
                });
               
                //return;
            }
            
            if(method === 'GET' || method === 'get') {
                //process the request, in this case simply reading a file based on the request url    
                var requestURL = '.' + request.url;
    
                if (requestURL == './' && served?.startpage) { //root should point to start page
                    requestURL = served.startpage; //point to the start page
                }

                //lets remove ? mark url extensions for now
                if(requestURL.includes('?')) requestURL = requestURL.substring(0,requestURL.indexOf('?'));
                
                if((request.url !== '/' || served?.startpage) && fs.existsSync(path.join(process.cwd(),requestURL))) {
                
                    if(response.writableEnded || response.destroyed) reject(requestURL);
                    //read the file on the server
                    fs.readFile(path.join(process.cwd(),requestURL), (error, content) => {
                        if (error) {
                            if(error.code == 'ENOENT') { //page not found: 404
                                if(served?.errpage) {
                                    fs.readFile(served.errpage, (er, content) => {
                                        response.writeHead(404, { 'Content-Type': 'text/html' }); //set response headers
    
                                        
                                        //add hot reload if specified
                                        // if(process.env.HOTRELOAD && requestURL.endsWith('.html') && cfg.hotreload) {
                                        //     content = addHotReloadClient(content,`${cfg.socket_protocol}://${cfg.host}:${cfg.port}/hotreload`);
                                        // }

                                        if(served.pages?._all || served.pages?.error) {
                                            content = this.injectPageCode(content.toString(),message.route,served) as any;
                                        }
    
                                        response.end(content, 'utf-8'); //set response content
                                        reject(content);
                                        //console.log(content); //debug
                                    });
                                }
                                else {
                                    response.writeHead(404, { 'Content-Type': 'text/html' });
                                    let content = `<!DOCTYPE html><html><head></head><body style='background-color:#101010 color:white;'><h1>Error: ${error.code}</h1></body></html>`
                                    if(served?.pages?._all || served?.pages?.[message.route]) {
                                        content = this.injectPageCode(content.toString(),message.route,served as any) as any;
                                    }
                                    response.end(content,'utf-8', () => {
                                        reject(error.code);
                                    });
                                    //return;
                                }
                            }
                            else { //other error
                                response.writeHead(500); //set response headers
                                response.end('Something went wrong: '+error.code+' ..\n','utf-8', () => {
                                    reject(error.code);
                                }); //set response content
                                //return;
                            }
                        }
                        else { //file read successfully, serve the content back
    
                            //set content type based on file path extension for the browser to read it properly
                            var extname = String(path.extname(requestURL)).toLowerCase();
    
                            var contentType = this.mimeTypes[extname] || 'application/octet-stream';

                            if(contentType === 'text/html' && (served?.pages?._all || served?.pages?.[message.route])) {
                                content = this.injectPageCode(content.toString(),message.route,served as any) as any;
                            }

                            response.writeHead(200, { 'Content-Type': contentType }); //set response headers
                            response.end(content, 'utf-8', () => {
                                //console.log(response,content,contentType);
                                resolve(content);
                            }); //set response content
                            
                            //console.log(content); //debug
                            //return;
                        }
                    });
                } else if (message.route) {
                    let route;
                    if(served) {
                        let rt = `${served.port}/${message.route}`;
                        if(this.__node.nodes.get(rt)) route = rt
                    }
                    if(!route && this.__node.nodes.get(message.route)) route = message.route;
                    
                    if(route) {
                        let res:any;
                        if(message.method) {
                            res = this.handleMethod(route, message.method, undefined); //these methods are being passed request/response in the data here, post methods will parse the command objects instead while this can be used to get html templates or play with req/res custom callbakcs
                        }
                        else if (message.node) {
                            res = this.handleGraphNodeCall(message.node, undefined);
                        }
                        else res = this.handleServiceMessage({route,args:undefined,method:message.method});
    
                        if(res instanceof Promise) res.then((r) => {
                            if(served?.keepState) this.setState({[served.address]:res});
                            this.withResult(response,r,message);
                            resolve(res);
                            
                            //return;
                        })
                        else if(res) {
                            if(served?.keepState) this.setState({[served.address]:res});
                            this.withResult(response,res,message);
                            resolve(res);
                           // return;
                        } //else we can move on to check the get post
                    }
                    else if (message.redirect) {
                        response.writeHead(301, {'Location':message.redirect});
                        response.end();
                        resolve(true);
                    } 
                    else getFailed();
                } else getFailed();
            } else {
                //get post/put/etc body if any
                let body:any = [];
                request.on('data',(chunk)=>{ //https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/
                    body.push(chunk);
                }).on('end',() => {
                    body = Buffer.concat(body).toString(); //now it's a string
                            
                    if(typeof body === 'string') {
                        let substr = body.substring(0,8);
                        if(substr.includes('{') || substr.includes('[')) {
                            if(substr.includes('\\')) body = body.replace(/\\/g,""); 
                            if(body[0] === '"') { body = body.substring(1,body.length-1)};
                            body = JSON.parse(body); //parse stringified args, this is safer in a step
                        }
                    }
                    
                    let route,method,args;
                    if(body?.route){ //if arguments were posted 
                        route = body.route;
                        method = body.method;
                        args = body.args;
                        if(!route) {
                            if(typeof body.route === 'string') if(body.route.includes('/') && body.route.length > 1) body.route = body.route.split('/').pop();
                            route = body.route;
                        }
                    }
                    if(!route) { //body post did not provide argument so use the request route
                        if (message?.route) {
                            let route = message.route;
                            method = message.method;
                            args = message.args;
                            if(!route) {
                                if(typeof message.route === 'string') if(message.route.includes('/') && message.route.length > 1) message.route = message.route.split('/').pop() as string;
                                route = message.route;
                            }
                        }
                    }
                    let res:any = body;
                    if(route) {
                        if(body.method) {
                            res = this.handleMethod(route, method, args);
                        }
                        else if (body.node) {
                            res = this.handleGraphNodeCall(body.node, body.args);
                        }
                        else res = this.handleServiceMessage({route, args:args, method:method});

                        if(res instanceof Promise) {
                            res.then((r) => {
                                this.withResult(response,r,message);
                                if(served?.keepState) this.setState({[served.address]:res});
                                resolve(res);
                            });
                        } else {
                            this.withResult(response,res,message);
                            if(served?.keepState) this.setState({[served.address]:res});
                            resolve(res);
                        }
                    }
                    else if(!response.writableEnded || !response.destroyed) {
                        response.statusCode = 200;
                        response.end(undefined,undefined as any, () => {
                            resolve(res);
                        }); //posts etc. shouldn't return anything but a 200 usually
                    } else resolve(res); //get requests resolve first and return otherwise this will resolve 
                });

            }

    
        }).catch((er)=>{ console.error("Request Error:", er); });

        return result;
    }

    request = ( 
        options:ReqOptions|any,
        send?:any,
        ondata?:(chunk:any)=>void,
        onend?:()=>void
    ) => {

        let client = http;
        
        if ((options.protocol as string)?.includes('https')) {
            client = https as any;
        }
    
        delete options.protocol;

        const req = client.request(options,(res)=>{
            if(ondata) res.on('data',ondata)
            if(onend) res.on('end',onend);
        });

        if(options.headers) {
            for(const head in options.headers) {
                req.setHeader(head,options.headers[head])
            }
        }

        if(send) req.write(send);
        req.end();

        return req;
    }

    POST = (
        url:string|URL,
        data:any,
        headers?:{
            'Content-Type'?:string,
            'Content-Length'?:number,
            [key:string]:any
        }
    ) => {

        let urlstring = url;
        if(urlstring instanceof URL) urlstring = url.toString();
        let protocol = urlstring.startsWith('https') ? 'https' : 'http';
        let host, port,path;
        let split = urlstring.split('/');
        split.forEach((s) => {
            if(s.includes(':')) {
                let ss = s.split(':');
                host = ss[0]; port = ss[1];
            }
        });

        if(split.length > 3) {
            path = split.slice(3).join('/');
        }

        let req = this.request(
            {
                protocol,
                host,
                port,
                path,
                method:'POST',
                headers
            },
            data
        );

        return req;
    }

    GET = (url:string|URL|http.RequestOptions) => {
        return new Promise<Buffer>((resolve, reject) => {
        
            let client = http;
        
            let urlstring = url;
            if(url instanceof URL) urlstring = url.toString();
            
            if ((urlstring as string).includes('https')) {
                client = https as any;
            }
        
            client.get(url, (resp) => {
            let chunks:any[] = [];
        
            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                chunks.push(chunk);
            });
        
            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                resolve(Buffer.concat(chunks));
            });
        
            }).on("error", (err) => {
                reject(err);
            });
        });
    }

    terminate = (served:string|ServerInfo) => {
        if(typeof served === 'string') served = this.servers[served];

        if(typeof served === 'object') {
            served.server.close();
            if(served.onclose) served.onclose(served);
        }
    }

    getRequestBody(req:http.IncomingMessage) {
        let chunks:any[] = [];
        return new Promise<Buffer>((resolve,reject) => {
            req.on('data',(chunk) => {
                chunks.push(chunk);
            }).on('end',() => {
                resolve(Buffer.concat(chunks));
            }).on('error',(er)=>{
                reject(er);
            })
        });
    }

    //??? just need a way to pass a fake request/response in
    // spoofRequest = (url:string, body:any, type:string='json', server:http.Server|https.Server) => {
    //     return this.receive({
    //         route:url,
    //         args:{request:{
    //             url,
    //         } as http.IncomingMessage, response:{} as http.ServerResponse},
    //         method:'GET'
    //     })
    // }

    addPage = (path:string, template:string) => { //add an html page template as a get
        if(typeof template === 'string') {
            if(!template.includes('<html')) template = '<!DOCTYPE html><html>'+template+'</html>'; //add a root
        }
        if(typeof this.__node.roots?.[path] === 'object') {
            (this.__node.roots[path] as any).get = template;
            this.__node.nodes.get(path).get = template;
        }
        else this.load({
                [path]: {
                    get:template
                }
            });
    }

    addHTML = (path:string, template:string) => { //add an html component template e.g. route: component/button then set up logic to chain
        if(typeof template === 'string') {
            if(!template.includes('<') || (!template.includes('>'))) template = '<div>'+template+'</div>';
        }
        if(typeof this.__node.roots?.[path] === 'object') {
            (this.__node.roots[path] as any).get = template;
            this.__node.nodes.get(path).get = template;
        }
        else this.load({
                [path]: {
                    get:template
                }
            });
    }

    buildPage = (pageStructure:{[key:string]:{}|null|any} | string[] | string | ((...args:any)=>any), baseTemplate:string) => { //construct a page from available components, child component templates will be inserted before the last '<' symbol or at end of the previous string depending
        let result = ``; if(baseTemplate) result += baseTemplate;
        let appendTemplate = (obj:{[key:string]:{}|null|any}|string[],r:string|any, res:string) => {
            if(!Array.isArray(obj[r]) && typeof obj[r] === 'object') {
                for(const key in obj) {
                    appendTemplate(obj, key, res); //recursive append
                }
            } else if(this.__node.nodes.get(r)?.get) {
                let toAdd = this.__node.nodes.get(r)?.get;
                if(typeof toAdd === 'function') {
                    if(Array.isArray(obj[r])) {
                        toAdd = toAdd(...obj[r]);
                    }
                    else toAdd = toAdd(obj[r]);
                }
                if(typeof toAdd === 'string')  {
                    let lastDiv = res.lastIndexOf('<');
                    if(lastDiv > 0) {
                        let end = res.substring(lastDiv)
                        res = res.substring(0,lastDiv) + toAdd + end;
                    } else res += toAdd; 
                }
                
            } else if (this.__node.nodes.get(r)?.__operator) {
                let routeresult;
                if(this.__node.nodes.get(r)?.__operator) routeresult = this.__node.nodes.get(r).__operator(obj[r]); 
                if(typeof routeresult === 'string') {   
                    let lastDiv = res.lastIndexOf('<');
                    if(lastDiv > 0) {
                        let end = res.substring(lastDiv)
                        res = res.substring(0,lastDiv) + routeresult + end;
                    } 
                    else res += routeresult;
                    //console.log(lastDiv, res, routeresult)
                }
            } else if (typeof this.__node.nodes.get(r) === 'string') res += this.__node.nodes.get(r);
            return res;
        }

        if(Array.isArray(pageStructure)) {  
            pageStructure.forEach((r)=>{
                result = appendTemplate(pageStructure, r, result);
            })
        } else if (typeof pageStructure === 'object') {
            for(const r in pageStructure) {
                result = appendTemplate(pageStructure, r, result);
            }
        } else if (typeof pageStructure === 'string') result += pageStructure;
        else if (typeof pageStructure === 'function') result += pageStructure();
        return result;
    }

    hotreload = (socketURL:string|URL=`http://localhost:8080/wss`, esbuild_cssFileName?:string) => { 
        if(socketURL instanceof URL) socketURL = socketURL.toString();


        const HotReloadClient = (socketUrl, esbuild_cssFileName) => {
            //hot reload code injected from backend
            //const socketUrl = `ws://${cfg.host}:${cfg.hotreload}`;
            let socket = new WebSocket(socketUrl);
        
        
            function reloadLink(file?) {
        
              let split = file.includes('/') ? file.split('/') : file.split('\\');
              let fname = split[split.length-1];
        
              var links = document.getElementsByTagName("link") as any as HTMLLinkElement;
              for (var cl in links)
              {
                  var link = links[cl];
        
                  if(!file || link.href?.includes(fname)) {
                    let href = link.getAttribute('href')
                                                    .split('?')[0];
                              
                    let newHref = href += "";
        
                    link.setAttribute('href', newHref);

                  }
              }
            }
        
        
            function reloadAsset(file, reloadscripts?, isJs?) { //reloads src tag elements
              let split = file.includes('/') ? file.split('/') : file.split('\\');
              let fname = split[split.length-1];
              let elements = document.querySelectorAll('[src]') as any as HTMLScriptElement[];
              let found = false;
              for(const s of elements) {
                if(s.src.includes(fname)) { //esbuild compiles entire file so just reload app
                  if(s.tagName === 'SCRIPT' && !reloadscripts) {//&& s.tagName === 'SCRIPT'
                    window.location.reload();
                    return;
                  } else {
                    let placeholder = document.createElement('object');
                    s.insertAdjacentElement('afterend', placeholder);
                    s.remove();
                    let elm = s.cloneNode(true) as HTMLElement;
                    placeholder.insertAdjacentElement('beforebegin',elm);
                    placeholder.remove();
                    found = true;
                  }
                }
              }
              if(!found) window.location.reload();
            }
        
                
            socket.addEventListener('message',(ev) => {
                let message = ev.data;
        
                if(typeof message === 'string' && message.startsWith('{')) {
                message = JSON.parse(message);
                }
                if(message.file) {
                let f = message.file;
                let rs = message.reloadscripts;
                if(f.endsWith('html') || f.endsWith('xml') || f.endsWith('wasm')) { //could add other formats
                    window.location.reload();
                } else if(f.endsWith('css')) {
                    if(!esbuild_cssFileName.endsWith('css')) esbuild_cssFileName += '.css';
                    reloadLink(esbuild_cssFileName); //reload all css since esbuild typically bundles one file same name as the dist file
                } else if (f.endsWith('js') || f.endsWith('ts') || f.endsWith('jsx') || f.endsWith('tsx') || f.endsWith('vue')) { //IDK what other third party formats would be nice to haves
                    reloadAsset(f, rs);
                } else {
                    //could be an href or src
                    reloadLink(f);
                    reloadAsset(f);
                }
                }
            });
  
  
            socket.addEventListener('close',()=>{
              // Then the server has been turned off,
              // either due to file-change-triggered reboot,
              // or to truly being turned off.
          
              // Attempt to re-establish a connection until it works,
              // failing after a few seconds (at that point things are likely
              // turned off/permanantly broken instead of rebooting)
              const interAttemptTimeoutMilliseconds = 100;
              const maxDisconnectedTimeMilliseconds = 3000;
              const maxAttempts = Math.round(maxDisconnectedTimeMilliseconds/interAttemptTimeoutMilliseconds);
              let attempts = 0;
              const reloadIfCanConnect = ()=>{
                attempts ++ ;
                if(attempts > maxAttempts){
                  console.error("Could not reconnect to dev server.");
                  return;
                }
                socket = new WebSocket(socketUrl);
                socket.onerror = (er) => {
                  console.error(`Hot reload port disconnected, will reload on reconnected. Attempt ${attempts} of ${maxAttempts}`);
                }
                socket.addEventListener('error',()=>{
                  setTimeout(reloadIfCanConnect,interAttemptTimeoutMilliseconds);
                });
                socket.addEventListener('open',()=>{
                  location.reload();
                });
              };
              reloadIfCanConnect();
            });
        }
        
        return `
            <script>
                console.log('Hot Reload port available at ${socketURL}');  
                (`+HotReloadClient.toString()+`)('${socketURL}',${esbuild_cssFileName ? `'${esbuild_cssFileName}'` : undefined}); 
            </script>
        `
    }

}



function getPageOptions(url, received, pages, request, response, port) {
    let pageOptions = pages[url];
    let key = url;
    //check alternative page definition keys
    if(!pageOptions) { 
        let url2 = '/'+url; // e.g. '/home'
        pageOptions = pages[url2]; 
        key = url2;
        if(!pageOptions && !path.extname(url)) {
            let split = url.split('/');
            key = split[0]+'/*';
            if(pages[key]) { // e.g. /* or home/*
                pageOptions = pages[key];
                received.route = key;
                request.url = key;
            } else { 
                // e.g. /home with /* specified, or /home/* etc.
                let spl = url2.split('/'); //split the modified string so the beginning is a blank string
                spl[spl.length-1] = ''; //replace with empty string e.g. /home -> ['','']
                key = spl.join('/')+'*'; //now merge url
                if(pages[key]) {
                    pageOptions = pages[key];
                    received.route = key;
                    request.url = key;
                } 
            }
        } else {
            received.route = url2;
            request.url = url2;
            
        }
    } else {
        received.route = url;
        request.url = url;
    }
    if(typeof pageOptions === 'object') {
        if((pageOptions as any).redirect) {
            url = (pageOptions as any).redirect;
            received.redirect = url;
            received.route = url;
        }
        if((pageOptions as any).onrequest) {
            if(typeof (pageOptions as any).onrequest === 'string') {
                (pageOptions as any).onrequest = this.__node.nodes.get((pageOptions as any).onrequest);
            }
            if(typeof (pageOptions as any).onrequest === 'object') {
                if((pageOptions as any).onrequest.__operator) {
                    ((pageOptions as any).onrequest as GraphNode).__operator(pageOptions, request, response);
                } 
            } else if(typeof (pageOptions as any).onrequest === 'function') {
                (pageOptions as any).onrequest(
                    this, 
                    this.__node.nodes.get(`${port}/${key}`), 
                    request, 
                    response
                );
            }
        }
    }

    return pageOptions;
}
