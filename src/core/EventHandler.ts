//mini state event handler for arbitrary data event callback handling

//a graph representing a callstack of nodes which can be arranged arbitrarily with forward and backprop or propagation to wherever
export class EventHandler {

    data={} as {[key:string]:any}
    triggers={} as {[key:string]:{sub:number,onchange:Function,[key:string]:any}[]}
    ctr = 0; //sub counter, always ensures unique values

    constructor(data?:{[key:string]:any}) { if(typeof data === 'object') this.data = data; }

    setState = (updateObj:{[key:string]:any}) => {
        Object.assign(this.data, updateObj);
        
        let props = Object.getOwnPropertyNames(updateObj)
        for (const prop of props) {
            this.triggerEvent(prop, this.data[prop]);
        }
        if(this.triggers[statesubKey]) {
            let run = (fn) => { fn(updateObj); }
            const l = this.triggers[statesubKey].length;
            for (let i = l - 1; i >= 0; i--) {
                run(this.triggers[statesubKey][i].onchange); //go in reverse in case a trigger pops
            }
        }
        
        return this.data;
    }
    setValue = (key, value) => {
        this.data[key] = value;
        this.triggerEvent(key,value);
    }
    triggerEvent = (key, value) => {
        if(this.triggers[key]) {
            let fn = (obj) => { obj.onchange(value); };
            const l = this.triggers[key].length;
            for (let i = l - 1; i >= 0; i--) {
                fn(this.triggers[key][i]); //go in reverse in case a trigger pops
            }
        }
    }
    subscribeState = (onchange:(res:any)=>void) => { 
        return this.subscribeEvent(statesubKey, onchange);
    }
    unsubscribeState = (sub:number) => { 
        return this.unsubscribeEvent(statesubKey, sub);
    }
    subscribeEvent = (key:string,onchange:(res:any)=>void, refObject?:{[key:string]:any}, refKey?:string) => {
        if(key) {
            if(refObject && refKey && !this.triggers[key]) { 
                //this acts more like an observer rather than needing to hard copy stuff
                Object.defineProperty(this.data,key,{
                    get:()=>{
                        return refObject[refKey];
                    },
                    set:(value) => {
                        refObject[refKey] = value;
                    },
                    enumerable:true,
                    configurable:true
                });
            }

            if(!this.triggers[key]) {
                this.triggers[key] = [];
            }

            let l = this.ctr; 
            this.ctr++;
            
            this.triggers[key].push({sub:l, onchange});
            return l;
        } else return undefined;
    }
    unsubscribeEvent = (key:string,sub?:number) => {
        let triggers = this.triggers[key];
        if (triggers){
            if(sub === undefined) {
                delete this.triggers[key];
                delete this.data[key]; //garbage collect useless data
            }
            else {
                let idx = undefined;
                let obj = triggers.find((o,i)=>{
                    if(o.sub===sub) {
                        idx = i;
                        return true;
                    }
                });

                if(obj) triggers.splice(idx,1);
                if(Object.keys(triggers).length === 0) {
                    delete this.triggers[key];
                    delete this.data[key]; //garbage collect useless data
                }
                
                if(this.onRemoved) this.onRemoved(obj);
                return true;
            }
        }
    }
    subscribeEventOnce = (key:string, onchange:(res:any)=>void) => {
        let sub;
        
        let changed = (value) => {
            onchange(value);
            this.unsubscribeEvent(key, sub);
        }
        sub = this.subscribeEvent(key,changed);

        return sub;
    }
    getEvent = (key,sub?) => {
        if(typeof sub !== 'number') return this.triggers[key];
        for(const s in this.triggers[key]) {
            if(this.triggers[key][s].sub === sub) return this.triggers[key][s];
        }
    }
    getSnapshot = () => { //shallow copies the current state
        const snapshot = {};
        for(const key in this.data) {
            snapshot[key] = this.data[key]; //runs getters etc if data not set explicitly in state but passed by reference from a source object
        }
    }
    onRemoved:(trigger:{sub:number, onchange:Function})=>void;
}

let statesubKey = '*s';

