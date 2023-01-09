import { isNativeClass } from '../../core/Graph'
import {Service, ServiceMessage} from '../Service'

//trying to generalize e.g. the Socket and Worker classes 

export class RemoteService extends Service {

    endpoints:{
        [key:string]:{
            connection:any,
            postCmd:Function,
            class:any,
            classArgs?:any
        }
    }

    class:any;
    onmessage:string;
    close:string;
    onerror?:string;
    onclose?:string;
    onmessageTransform?:(message:any) => any;
    onerrorTransform?:(er:any) => any;
    post:string;

    createConnection = (instanceArgs:any[], settings?:{[key:string]:Function}) => {

        let info = {
            _id: `connection${Math.floor(Math.random()*1000000000000000)}`
        } as any;

        if(typeof this.class === 'function') {
            if(isNativeClass(this.class)) {
                info.connection = new this.class(...instanceArgs);
            } else {
                info.connection = this.class(...instanceArgs);
            }
        } else info.connection = this.class;


        //defaults
        if(this.onmessage) {
            info.connection[this.onmessage] = (message:any) => {
                if(this.onmessageTransform) {
                    message = this.onmessageTransform(message);
                }
                this.receive(message);
                this.setState({[info._id]:message});
            }
        }

        if(this.onerror) {
            info.connection[this.onerror] = (er) => {
                if(this.onerrorTransform) er = this.onerrorTransform(er);
            }
        }

        //overwrite callbacks with settings
        if(settings) {
            for(const key in settings) {
                info.connection[key] = settings[key];
            }
        }

        return info;
    }

    __wrapConnection = (info:any) => {
        info.send = () => {};
        info.post = () => {};
        info.run = () => {};
        info.request = () => {};
        info.subscribe = () => {};
        info.unsubscribe = () => {};
        info.start = async () => {};
        info.stop = async () => {};
        info.terminate = () => {};
        return info;
    }   

    transmit = (message:ServiceMessage|any, endpoint:string|any, transformer?:(message:any,endpoint:any) => any[] ) => {
        
        // put in transformer 
        // if(!transfer) {
        //     transfer = this.getTransferable(message); //automatically transfer arraybuffers
        // }
        if(typeof endpoint === 'string') {
            endpoint = this.endpoints[endpoint];
        }

        if(typeof endpoint === 'object') {
            if(transformer) {
                let args = transformer(message,endpoint) as any[];
                endpoint.connection[endpoint.post](...args);
            } else {
                endpoint.connection[endpoint.post](message);
            }

            return true;
        }

        return false;
    }

}