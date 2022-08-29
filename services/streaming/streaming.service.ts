import { Routes, Service, ServiceOptions } from "../Service";



//generic object streaming using setState, subscribe to the stream by id and do whatever with efficiently buffered results e.g. to only stream new data when available
export class StreamingService extends Service {

    name='streaming'

    //more rudimentary object streaming
	STREAMLATEST = 0;
	STREAMALLLATEST = 1;
    streamSettings:{
        [key:string]:{
            object:{[key:string]:any}, //the object we want to watch
            settings:{ //the settings for how we are handling the transform on the watch loop
                keys?: string[]
                callback?:0|1|Function,
                lastRead?:number,
                [key:string]:any
            }
        }
    } = {};


    constructor(options:ServiceOptions) {
        super(options);
        this.load(this.routes);
    }


    streamFunctions:any = {
        //these default functions will only send the latest of an array or value if changes are detected, and can handle single nested objects 
        // you can use the setting to create watch properties (e.g. lastRead for these functions). 
        // All data must be JSONifiable
        allLatestValues:(prop:any, setting:any)=>{ //return arrays of hte latest values on an object e.g. real time data streams. More efficient would be typedarrays or something
            let result:any = undefined;

            if(Array.isArray(prop)) {
                if(prop.length !== setting.lastRead) {
                    result = prop.slice(setting.lastRead);
                    setting.lastRead = prop.length;
                }
            }
            else if (typeof prop === 'object') {
                result = {};
                for(const p in prop) {
                    if(Array.isArray(prop[p])) {
                        if(typeof setting === 'number') setting = {[p]:{lastRead:undefined}}; //convert to an object for the sub-object keys
                        else if(!setting[p]) setting[p] = {lastRead:undefined};
                        
                        if(prop[p].length !== setting[p].lastRead) {
                            result[p] = prop[p].slice(setting[p].lastRead);
                            setting[p].lastRead = prop[p].length;
                        }
                    }
                    else {
                        if(typeof setting === 'number') setting = {[p]:{lastRead:undefined}}; //convert to an object for the sub-object keys
                        else if(!setting[p]) setting[p] = {lastRead:undefined};

                        if(setting[p].lastRead !== prop[p]) {
                            result[p] = prop[p];
                            setting[p].lastRead = prop[p];
                        }
                    }
                }
                if(Object.keys(result).length === 0) result = undefined;
            }
            else { 
                if(setting.lastRead !== prop) {
                    result = prop;
                    setting.lastRead = prop;
                } 
            }

            return result;

            
        },
        latestValue:(prop:any,setting:any)=>{
            let result:any = undefined;
            if(Array.isArray(prop)) {
                if(prop.length !== setting.lastRead) {
                    result = prop[prop.length-1];
                    setting.lastRead = prop.length;
                }
            }
            else if (typeof prop === 'object') {
                result = {};
                for(const p in prop) {
                    if(Array.isArray(prop[p])) {
                        if(typeof setting === 'number') setting = {[p]:{lastRead:undefined}}; //convert to an object for the sub-object keys
                        else if(!setting[p]) setting[p] = {lastRead:undefined};
                        
                        if(prop[p].length !== setting[p].lastRead) {
                            result[p] = prop[p][prop[p].length-1];
                            setting[p].lastRead = prop[p].length;
                        }
                    }
                    else {
                        if(typeof setting === 'number') setting = {[p]:{lastRead:undefined}}; //convert to an object for the sub-object keys
                        else if(!setting[p]) setting[p] = {lastRead:undefined};

                        if(setting[p].lastRead !== prop[p]) {
                            result[p] = prop[p];
                            setting[p].lastRead = prop[p];
                        }
                    }
                }
            }
            else { 
                if(setting.lastRead !== prop) {
                    result = prop;
                    setting.lastRead = prop;
                } 
            }

            return result;
        },
    };

	setStreamFunc = (
        name:string,
        key:string,
        callback:0|1|Function=this.streamFunctions.allLatestValues) => {
		if(!this.streamSettings[name].settings[key]) 
			this.streamSettings[name].settings[key] = {lastRead:0};
		
		if(callback === this.STREAMLATEST) 
			this.streamSettings[name].settings[key].callback = this.streamFunctions.latestValue; //stream the latest value 
		else if(callback === this.STREAMALLLATEST) 
			this.streamSettings[name].settings[key].callback = this.streamFunctions.allLatestValues; //stream all of the latest buffered data
		else if (typeof callback === 'string') 
			this.streamSettings[name].settings[key].callback = this.streamFunctions[callback]; //indexed functions
		else if (typeof callback === 'function')
			this.streamSettings[name].settings[key].callback = callback; //custom function

		if(!this.streamSettings[name].settings[key].callback) this.streamSettings[name].settings[key].callback = this.streamFunctions.allLatestValues; //default
		
        return true;
	}

	addStreamFunc = (name,callback=(data)=>{}) => {
		this.streamFunctions[name] = callback;
	}

	// 		object:{key:[1,2,3],key2:0,key3:'abc'}, 		// Object we are buffering data from
	//		settings:{
	//      	callback:0, 	// Default data streaming mode for all keys
	//			keys:['key','key2'], 	// Keys of the object we want to buffer into the stream
	// 			key:{
	//				callback:0 //specific modes for specific keys or can be custom functions
	// 				lastRead:0,	
	//			} //just dont name an object key 'keys' :P
	//		}
	setStream = (
		object={},   //the object you want to watch
		settings: {
			keys?: string[]
			callback?: Function
		}={}, //settings object to specify how data is pulled from the object keys
		streamName=`stream${Math.floor(Math.random()*10000000000)}` //used to remove or modify the stream by name later
	) => {

		///stream all of the keys from the object if none specified
		if(settings.keys) { 
			if(settings.keys.length === 0) {
				let k = Object.keys(object);
				if(k.length > 0) {
					settings.keys = Array.from(k);
				}
			}
		} else {
			settings.keys = Array.from(Object.keys(object));
		}

		this.streamSettings[streamName] = {
			object,
			settings
		};

		// if(!settings.callback) settings.callback = this.STREAMALLLATEST;

		settings.keys.forEach((prop) => {
			if(settings[prop]?.callback)
				this.setStreamFunc(streamName,prop,settings[prop].callback);
			else
				this.setStreamFunc(streamName,prop,settings.callback);
		});

		return this.streamSettings[streamName];

	}

	//can remove a whole stream or just a key from a stream if supplied
	removeStream = (streamName,key) => {
		if(streamName && !key) delete this.streamSettings[streamName];
		else if (key && this.streamSettings[streamName]?.settings?.keys) {
			let idx = (this.streamSettings[streamName].settings.keys as any).indexOf(key);
			if(idx > -1) 
            (this.streamSettings[streamName].settings.keys as any).splice(idx,1);
			if(this.streamSettings[streamName].settings[key]) 
				delete this.streamSettings[streamName].settings[key];
            return true;
		}
        return false;
	}

	//can update a stream object by object assignment (if you don't have a direct reference)
	updateStreamData = (streamName, data={}) => {
		if(this.streamSettings[streamName]) {
			Object.assign(this.streamSettings[streamName].object,data);
			return this.streamSettings[streamName].object;
		}
		return false;
	} 

    getStreamUpdate = (streamName:string) => {
        if(!this.streamSettings[streamName]) return;
        let streamUpdate = {};
        (this.streamSettings[streamName].settings.keys as any).forEach((key) => {
            if(this.streamSettings[streamName].settings[key]) {
                let data = this.streamSettings[streamName].settings[key].callback(
                    this.streamSettings[streamName].object[key],
                    this.streamSettings[streamName].settings[key]
                );
                if(data !== undefined) streamUpdate[key] = data; //overlapping props will be overwritten (e.g. duplicated controller inputs)
            }
        });
        this.setState({[streamName]:streamUpdate}); // the streamName
        return streamUpdate;
    }

    getAllStreamUpdates = () => {
        let updateObj = {};

        for(const streamName in this.streamSettings) {
            let streamUpdate = this.getStreamUpdate(streamName);
            Object.assign(updateObj,streamUpdate);
        }

        return updateObj;
        
	}

    routes:Routes = {
        setStreamFunc:this.setStreamFunc,
        addStreamFunc:this.addStreamFunc,
        setStream:this.setStream,
        removeStream:this.removeStream,
        updateStreamData:this.updateStreamData,
        getStreamUpdate:this.getStreamUpdate,
        getAllStreamUpdates:this.getAllStreamUpdates,
        streamLoop:{
            operator:this.getAllStreamUpdates,
            loop:10
        }
    }
}