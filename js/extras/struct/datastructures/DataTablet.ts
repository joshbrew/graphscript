import * as DS from './DataStructures'
import { ArbitraryObject, Struct, DataStruct } from './types';

export class DataTablet {

    // NOTE: Totally undefined
    workerId: any;
    id: any;
    
    threaded: boolean;
    workers: any;
    DS: any = DS;
    collections: Map<string, any> = new Map();
    data:any = {
        byTime:{}, //everything is indexed by time
        notes:{}, //or everything is indexed by type, then by time
        events:{},
        sleep:{}, 
        food:{},
        rx:{},
        hr:{},
        ppg:{},
        hrv:{},
        ecg:{},
        emg:{},
        eeg:{},
        fnirs:{}
    }

    rolloverLimit:number = 50000;
    dataSorts:Map<string, any> = new Map(); //what to do with data based on struct or data type
    watches:any = {};

    constructor(
        props={}
    ) {


        Object.assign(this.data,props);

        this.dataSorts = new Map(); //what to do with data based on struct or data type
        this.watches = {};

        this.setSort(
            'event',
            (dataObj:any)=>{
                if(!this.data.events[dataObj.timestamp])
                    this.data.events[dataObj.timestamp] = [dataObj];
                else this.data.events[dataObj.timestamp].push(dataObj);

                if(dataObj.event === 'sleep') {
                    if(!this.data.sleep[dataObj.timestamp])
                        this.data.sleep[dataObj.timestamp] = [dataObj];
                    else this.data.sleep[dataObj.timestamp].push(dataObj);
                }

                return dataObj;
            }
        );

        this.setSort(
            ['notes','note','link'],
            (dataObj:any) => {
                if(!this.data.notes[dataObj.timestamp])
                    this.data.notes[dataObj.timestamp] = [dataObj];
                else this.data.notes[dataObj.timestamp].push(dataObj);
                                    
                if(!this.data.byTime[dataObj.timestamp])
                    this.data.byTime[dataObj.timestamp] = [dataObj];
                else this.data.byTime[dataObj.timestamp].push(dataObj);

                return dataObj;
            }
        );

        //this.setSort();

        this.id = this.randomId('dataTablet');

    }

    randomId(tag = '') {
        return `${tag+Math.floor(Math.random()+Math.random()*Math.random()*10000000000000000)}`;
    }

    setLocalData (structs: (Partial<Struct>)[]|(Partial<Struct>)) {

        let setInCollection = (s:Partial<Struct>) => {
            let type = s.structType;
        
            let collection = this.collections.get(type as string);
            if(!collection) {
                collection = new Map();
                this.collections.set(type as string,collection);
            }
            collection.set(s._id,s);
            this.onCollectionSet(type,collection);
        }

        if(Array.isArray(structs)) {
            structs.forEach((s)=>{
                setInCollection(s)
            });
        }
        else setInCollection(structs)
    }

    //pull a struct by collection, owner, and key/value pair from the local platform, leave collection blank to pull all ownerId associated data
    getLocalData(collection:string, query:any) {

        // Split Query
        let ownerId:string = ''
        let key:string = ''
        let value:any = ''
        if (typeof query === 'object'){
            ownerId = query.ownerId
            // TODO: Make more robust. Does not support more than one key (aside from ownerId)
            const keys = Object.keys(query).filter(k => k != 'ownerId')
            key = keys[0]
            value = query[key]
        } else value = query
        
        if (!collection && !ownerId && !key && !value) return [];

        let result:any[] = [];
        if(!collection && (ownerId || key)) {
            this.collections.forEach((c) => { //search all collections
                if((key === '_id' || key === 'id') && value) {
                    let found = c.get(value);
                    if(found) result.push(found);
                }
                else {
                    c.forEach((struct:any) => {
                        if(key && value) {
                            if(struct[key] === value && struct.ownerId === ownerId) {
                                result.push(struct);
                            }
                        }
                        else if(struct.ownerId === ownerId) {
                            result.push(struct);
                        }
                    });
                }
            });
            return result;
        }
        else {
            let c = this.collections.get(collection);
            if(!c) return result; 

            if(!key && !ownerId) {
                c.forEach((struct:any) => {result.push(struct);})
                return result; //return the whole collection
            }
            
            if((key === '_id' || key === 'id') && value) return c.get(value); //collections store structs by id so just get the one struct
            else {
                c.forEach((struct:any,_:string) => {
                    if(key && value && !ownerId) {
                        if(struct[key] === value) result.push(struct);
                    }   
                    else if(ownerId && !key) {
                        if(struct.ownerId === ownerId) result.push(struct);
                    } 
                    else if (ownerId && key && value) {
                        if(struct.ownerId === ownerId && struct[key]) {
                            if(struct[key] === value) result.push(struct);
                        }
                    }
                });
            }
        }
        return result;                            //return an array of results
    }

    // //customize what to do with the updated collection after setting
    onCollectionSet = (type:any, collection:any) => {
        
    }

    runSort(key:string,dataObj={},newdata=[],tablet=this) {
        let result:any;
        
        let sort = this.getSort(key);
        if (sort) result = sort(dataObj,newdata,tablet);
        else return false;
        
        return result
    }

    //how sorts work:
    /**
     * Unsorted data structs come in with a minimum 'structType' and 'timestamp' set of values.
     * 
     * If a sort key matches the structType or dataType (from a data struct.data array),
     *  it can return a modified struct or push to the newdata array with a set of newly made structs. 
     * Return undefined to process the input data by default structType/dataType and timestamp into the tablet, so you can do this 
     *   plus split up additional structs or processed structs into each other. This is intentionally vague until we refine this idea into clearer hooks.
     * The newdata array accumulates all of the data structs supplied on a sort pass which gets sent to this.onSorted() at the end of the sorting pass.
     */

    setSort(
        key:string | string[],
        response=(data:any,newdata:any[]=[],tablet=this)=>{}
    ) {
        
        if(Array.isArray(key))
            key.forEach((k) => {this.dataSorts.set(k,response);});
        else
            this.dataSorts.set(key,response);
        
    }

    getSort(key:string) {
       
        return this.dataSorts.get(key as string);
        
    }

    checkWatches(sorted:ArbitraryObject={}) {
        for(const prop in this.watches) {
            let triggered = this.watches[prop].ondata(sorted, this.watches[prop].accum, this.watches[prop].ownerId);
            if(triggered) { //manual trigger function
                this.watches[prop].ontrigger(this.watches[prop].accum);
                this.watches[prop].triggered = false;
            }
        }
    }

    //after the data is sorted these will trigger
    //how this works:
    /**
     * - pass the sorted structure to the accumulator object which is just an empty object you can do whatever with
     * - ondata checks the data if it's relevant and keeps a record via the accumulator
     * - if the accumlator condition is satisfied, return true which triggers ontrigger(accum), else return a falsey value
     * - ontrigger function then is passed the accumulator object to do whatever with, 
     *      e.g. supply it to an 'alert' struct, set alert:true, and data:accum, and update the server to notify any connected peers.
     */

    setWatch(
        name:string,
        ownerId:string|undefined,
        ondata=(sorted:any,accum:any, ownerId:string)=>{ 
            if(sorted.ownerId === ownerId)
            accum.data[sorted._id] = sorted; 
            if(Object.keys(accum.data).length > 10) {
                return true; //return true if some condition is met
            } 
            else return false; //else return falsey value (false, null, undefined)
        },
        ontrigger=(accum:any)=>{
            console.log(accum); //e.g.
            let alert = DS.Struct('alert',{alert:true, data:accum},{_id:accum[Object.keys(accum)[0]].ownerId});
            //client.setData(alert);
            accum = {}; //e.g. reset the accumulator
        }) {
        this.watches[name] = {
            accum:{}, //data accumulated for checking a trigger
            ownerId:ownerId, //particular owner id to watch for?
            ondata,
            ontrigger
        };
    }

    //after the data is sorted these will trigger
    getWatch(name:string) {
        return this.watches[name];   
    }

    async sortStructsIntoTable(datastructs:Struct[]=[]) {
        //sort by timestamp, datastructs must be objects with a timestamp key to be sortable
        let ascending = function(a:any,b:any) { if(a.timestamp && b.timestamp) return a.timestamp - b.timestamp; }
        /**
         * let descending = function(a,b) { return b.timestamp-a.timestamp };
         */
        datastructs.sort(ascending as any); //reorder

        let newdata:any[] = [];

        //now distribute into data
        for(let i = 0; i < datastructs.length; i++) {
            let struct = datastructs[i];
            if(!struct.timestamp) continue;
            let timestamp = struct.timestamp;

            if(!this.data.byTime[timestamp])
                this.data.byTime[timestamp] = [struct];
            else this.data.byTime[timestamp].push(struct);

            if(struct.structType === 'data' && (struct as DataStruct).data) {
                //we should sort instanced fitbit data into timestamped bins with markers for different resolutions
                //other data in data.data array will be like {dataType:'notes',data:'abcdefg'} 
                (struct as DataStruct).data.forEach(async (dat:any) => {
                    if(typeof dat === 'object' && !Array.isArray(dat)) {
                        let typ:string = dat.dataType;
                        dat.ownerId = struct.ownerId;
                        if(!dat.timestamp) dat.timestamp = timestamp;
                        if(typ) {
                            let sorted = this.runSort(typ, dat, newdata as any,this);
                            if(!sorted) { //generic
                                if(!this.data[typ]) this.data[typ] = {};
    
                                dat.timestamp = timestamp;
                                if(!this.data[typ][timestamp]) 
                                    this.data[typ][timestamp] = [dat];
                                else this.data[typ][timestamp].push(dat);
                                if(!this.data.byTime[timestamp])
                                    this.data.byTime[timestamp] = [dat];
                                else this.data.byTime[timestamp].push(dat); 
                                this.checkWatches(dat);
                                this.onUpdate(timestamp, dat);
                                newdata.push(dat);  
                            }
                            else {
                                if(sorted.constructor?.name !== 'Promise') {
                                    this.checkWatches(sorted);
                                    this.onUpdate(timestamp, sorted);
                                    newdata.push(sorted); 
                                }
                            }
                        }
                    }
                });
            }
            else {
                let sorted = this.runSort(struct.structType as string,struct,newdata as any,this);
                if(!sorted) { //generic
                    let typ = struct.structType as string; // TODO: Reconcile that data could be the type...
                    if(!this.data[typ]) this.data[typ] = {};
                    if(!this.data[typ][timestamp])
                        this.data[typ][timestamp] = [struct];
                    else this.data[typ][timestamp].push(struct); 
                    this.checkWatches(struct);
                    this.onUpdate(timestamp, struct);
                    newdata.push(struct);
                } else {
                    this.checkWatches(sorted);
                    this.onUpdate(timestamp, sorted);
                    newdata.push(sorted);
                }
                
            }
            
        }

        for(const prop in this.data) {
            this.data[prop as string] = this.sortObjectByPropName(this.data[prop as string]); //should arrange the object by timestamp
        }


        this.onSorted(newdata);
    }

    onUpdate(_:any, __:any, ___=this.data) {}

    onSorted(_:any[]=[]) {}

    getDataByTimestamp(timestamp: number, ownerId: string) {
        let result = this.data.byTime[timestamp];
        if(ownerId && result) result = result.filter((o:any)=>{if(!ownerId) return true; else if(ownerId === o.ownerId) return true; else return false});
        return result;
    }

    getDataByTimeRange(begin:number,end:number,type:string,ownerId:string) {
       
        let result:ArbitraryObject = {};
        if(type) {
            for(const key in this.data[type]) {
                let t = parseInt(key);
                if(t > begin && t < end){
                    result[key] = [...this.data[type][key]];
                }
            }
            if(type === 'sleep') {
                result = this.filterSleepResults(result);
            }
            
        }
        else {
            for(const key in this.data.byTime) {
                let t = parseInt(key);
                if(t > begin && t < end){
                    result[key] = [...this.data.byTime[key]];
                }
            }
        }
        if(ownerId && result) {
            for(const key in result) {
                let popidx:any[] = [];
                result[key] = result[key];
                result[key].forEach((o:any, i:number) => {
                    if(o.ownerId !== ownerId) {
                        popidx.push(i);
                    }
                });
                popidx.reverse().forEach((idx) => {
                    result[key].splice(idx,1);
                });
                if(result[key].length === 0) delete result[key];
            }
        }

        return result;
    }

    getDataByType(type:string,timestamp:number,ownerId:string) {
        if(!this.data[type]) return undefined;

        let result = {...this.data[type]};
        if(timestamp) result = [...result[timestamp]];

        if(ownerId && result) {
            for(const key in result) {
                let popidx:any[] = [];
                result[key] = [...result[key]];
                result[key].forEach((o:any, i:number) => {
                    if(o.ownerId !== ownerId) {
                        popidx.push(i);
                    }
                });
                popidx.reverse().forEach((idx) => {
                    result[key].splice(idx,1);
                });
                if(result[key].length === 0) delete result[key];
            }
        }
        if(type === 'sleep') {
            result = this.filterSleepResults(result);
        }
        return result;
        
    }

    filterSleepResults(unfiltered:ArbitraryObject = {}) {
        //need to check if any events are overlapping with fitbit data then pop any fitbit data, assuming events are more accurate
        let events:any[] = [];
        for(const key in unfiltered) {
            unfiltered[key] = [...unfiltered[key]]; //copy result
            events.push(...unfiltered[key].filter((o:any) => {
                if(o.structType === 'event') return true;
                else return false
            }));
        }

        events.forEach((ev) => {
            let foundidx;
            for(const key in unfiltered) {
                unfiltered[key].forEach((o:any, i:number) => {
                    //assume sleep data within 12 hours and longer than 2 hours is to be replaced
                    if(o.structType === 'fitbitsleep' && ev.startTime && ev.endTime) {
                        if(Math.abs(o.startTime - ev.startTime) < 1000*12*3600 && Math.abs(o.endTime - ev.endTime) < 1000*12*3600 && (ev.endTime - ev.startTime) > 1000*2*3600) {
                            foundidx = i;
                            return true;
                        } else return false
                    } else return false
                }); 
                if(foundidx) unfiltered[key].splice(foundidx,1);
            }   
        });
        
        let result = unfiltered;
        return result;
    } 

    sortObjectByPropName(object:ArbitraryObject) {

        const ordered = Object.keys(object).sort().reduce(
            (obj: ArbitraryObject, key: string) => { 
              obj[key] = object[key]; 
              return obj;
            }, 
            {}
          );
    
        return ordered;
    }

    //cuts array sizes of object properties in the collection to the set limit (holdover from DataAtlas)
    checkRollover(collection:string, limit=this.rolloverLimit) { //'eeg','heg', etc
		if(!collection) return false;

        let c = this.collections.get(collection);
        if(!c) return false;

        c.forEach((struct:any) => {
            for(const prop in struct) {
                if(Array.isArray(struct[prop])) {
                    if(struct[prop].length > limit)  {
                        struct[prop].slice(struct[prop].length-limit);
                        if(prop === 'ffts') { //adjust counters
                            struct.fftCount = struct[prop].length;
                        }
                        else if (prop === 'times') {
                            struct.count = struct[prop].length;
                        }
                    }
                } else if (typeof struct[prop] === 'object') {
                    this.checkRollover(struct[prop]);
                }
            }
        });

        return true

	}


}