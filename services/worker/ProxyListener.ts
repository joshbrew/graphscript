//from UI thread

declare var WorkerGlobalScope;

/////////////https://threejsfundamentals.org/threejs/lessons/threejs-offscreencanvas.html
const mouseEventHandler = makeSendPropertiesHandler([
    'ctrlKey',
    'metaKey',
    'shiftKey',
    'button',
    'pointerType',
    'clientX',
    'clientY',
    'pageX',
    'pageY',
  ]);
  const wheelEventHandlerImpl = makeSendPropertiesHandler([
    'deltaX',
    'deltaY',
  ]);
  const keydownEventHandler = makeSendPropertiesHandler([
    'ctrlKey',
    'metaKey',
    'shiftKey',
    'keyCode',
  ]);
  
  function wheelEventHandler(event, sendFn) {
    event.preventDefault();
    wheelEventHandlerImpl(event, sendFn);
  }
  
  function preventDefaultHandler(event) {
    event.preventDefault();
  }
  
  function copyProperties(src, properties, dst) {
    for (const name of properties) {
        dst[name] = src[name];
    }
  }
  
  function makeSendPropertiesHandler(properties) {
    return function sendProperties(event, sendFn) {
      const data = {type: event.type};
      copyProperties(event, properties, data);
      sendFn(data);
    };
  }
  
  function touchEventHandler(event, sendFn) {
    const touches = [];
    const data = {type: event.type, touches};
    for (let i = 0; i < event.touches.length; ++i) {
      const touch = event.touches[i];
      touches.push({
        pageX: touch.pageX,
        pageY: touch.pageY,
      });
    }
    sendFn(data);
  }
  
  // The four arrow keys
  const orbitKeys = {
    '37': true,  // left
    '38': true,  // up
    '39': true,  // right
    '40': true,  // down
  };

  function filteredKeydownEventHandler(event, sendFn) {
    const {keyCode} = event;
    if (orbitKeys[keyCode]) {
      event.preventDefault();
      keydownEventHandler(event, sendFn);
    }
  }

export const eventHandlers = { //you can register more event handlers in this object
  contextmenu: preventDefaultHandler,
  mousedown: mouseEventHandler,
  mousemove: mouseEventHandler,
  mouseup: mouseEventHandler,
  pointerdown: mouseEventHandler,
  pointermove: mouseEventHandler,
  pointerup: mouseEventHandler,
  touchstart: touchEventHandler,
  touchmove: touchEventHandler,
  touchend: touchEventHandler,
  wheel: wheelEventHandler,
  keydown: filteredKeydownEventHandler,
};

  //do this on main thread
export function initProxyElement(element, worker, id) {

    if( !id ) id = 'proxy'+Math.floor(Math.random()*1000000000000000);

    const sendEvent = (data) => {
      if(!worker) {
        handleProxyEvent(data,id);
      } else worker.postMessage({route:'handleProxyEvent',args:[data,id]}); //for use with our service syntax
    };

    // register an id
    //worker.postMessage({route:'makeProxy', args:id})

    let entries = Object.entries(eventHandlers);
    
    for (const [eventName, handler] of entries) {
      element.addEventListener(eventName, function(event) { //add all of the event listeners we care about
        handler(event, sendEvent);
      });
    }

    const sendSize = () => {
      
        const rect = element.getBoundingClientRect();
        sendEvent({
          type: 'resize',
          left: rect.left,
          top: rect.top,
          width: element.clientWidth,
          height: element.clientHeight,
        });
    }

    sendSize();
    // really need to use ResizeObserver
    globalThis.addEventListener('resize', sendSize);
  
    return id;

}


//From Worker Thread

/////////////https://threejsfundamentals.org/threejs/lessons/threejs-offscreencanvas.html
export class EventDispatcher {

  __listeners:any;


	addEventListener( type, listener ) {
		if ( this.__listeners === undefined ) this.__listeners = {};
		const listeners = this.__listeners;
		if ( listeners[ type ] === undefined ) {
			listeners[ type ] = [];
		}

		if ( listeners[ type ].indexOf( listener ) === - 1 ) {
			listeners[ type ].push( listener );
		}

	}

	hasEventListener( type, listener ) {
		if ( this.__listeners === undefined ) return false;
		const listeners = this.__listeners;
		return listeners[ type ] !== undefined && listeners[ type ].indexOf( listener ) !== - 1;
	}

	removeEventListener( type, listener ) {
		if ( this.__listeners === undefined ) return;
		const listeners = this.__listeners;
		const listenerArray = listeners[ type ];
		if ( listenerArray !== undefined ) {
			const index = listenerArray.indexOf( listener );
			if ( index !== - 1 ) {
				listenerArray.splice( index, 1 );
			}
		}
	}

	dispatchEvent( event, target ) {
    //console.log(event,this.__listeners);
		if ( this.__listeners === undefined ) return;
		const listeners = this.__listeners;
		const listenerArray = listeners[ event.type ];
		if ( listenerArray !== undefined ) {
      if(!target)
  			event.target = this;
			else event.target = target;
        // Make a copy, in case listeners are removed while iterating.
			const array = listenerArray.slice( 0 );
			for ( let i = 0, l = array.length; i < l; i ++ ) {
				array[ i ].call( this, event );
			}
			event.target = null;
		}
	}
}

function noop() {
};
/////////////https://threejsfundamentals.org/threejs/lessons/threejs-offscreencanvas.html
export class ElementProxyReceiver extends EventDispatcher  {

  __listeners:any = {};
  proxied:any;
  style:any = {};
  width:any;
  left:any;
  right:any;
  top:any;
  height:any;

  constructor() {
    super();
    // because OrbitControls try to set style.touchAction;
    this.style = {};
  }
  get clientWidth() {
      return this.width;
  }
  get clientHeight() {
      return this.height;
  }
  // OrbitControls call these as of r132. Maybe we should implement them
  setPointerCapture = () => {}

  releasePointerCapture = () => {}

  getBoundingClientRect = () => {
      return {
          left: this.left,
          top: this.top,
          width: this.width,
          height: this.height,
          right: this.left + this.width,
          bottom: this.top + this.height,
      };
  }

  handleEvent = (data) => {
    if (data.type === 'resize') {
        this.left = data.left;
        this.top = data.top;
        this.width = data.width;
        this.height = data.height;

        if(typeof this.proxied === 'object') { //provide size information to the object for resize functions to use on a thread 
          this.proxied.style.width = this.width + 'px';
          this.proxied.style.height = this.height + 'px';
          this.proxied.clientWidth = this.width;
          this.proxied.clientHeight = this.height;
        }
    }
    data.preventDefault = noop;
    data.stopPropagation = noop;
    this.dispatchEvent(data, this.proxied);
  }

  focus() {}

}

/////////////https://threejsfundamentals.org/threejs/lessons/threejs-offscreencanvas.html
export class ProxyManager {

    targets:any={};

    constructor() {
      if(!globalThis.document) globalThis.document = {} as any; //threejs hack for workers
    }

    makeProxy = (id, addTo=undefined) => {    //addTo installs the desirable functions to the object you want     
        if(!id) id = `proxyReceiver${Math.floor(Math.random()*1000000000000000)}`;
        
        let proxy;
        if(this.targets[id]) proxy = this.targets[id];
        else {
          proxy = new ElementProxyReceiver();
          this.targets[id] = proxy;
        }
        if(typeof addTo === 'object') {
          addTo.proxy = proxy;
          proxy.proxied = addTo;

          //console.log(proxy, addTo);

          if(typeof WorkerGlobalScope !== 'undefined') addTo.style = proxy.style;

          if(proxy.width) {
            addTo.style.width = proxy.width + 'px';
            addTo.clientWidth = proxy.width;
          }
          if(proxy.height) {
            addTo.style.height = proxy.height + 'px';
            addTo.clientHeight = proxy.height;
          }
          
          addTo.setPointerCapture = proxy.setPointerCapture.bind(proxy);
          addTo.releasePointerCapture = proxy.releasePointerCapture.bind(proxy);
          addTo.getBoundingClientRect = proxy.getBoundingClientRect.bind(proxy);
          addTo.addEventListener = proxy.addEventListener.bind(proxy);
          addTo.removeEventListener = proxy.removeEventListener.bind(proxy);
          addTo.handleEvent = proxy.handleEvent.bind(proxy);
          addTo.dispatchEvent = proxy.dispatchEvent.bind(proxy);
          addTo.focus = proxy.focus.bind(proxy);
        }
    }

    getProxy = (id) => {
      return this.targets[id];
    }

    handleEvent = (data,id) => {
      if(!this.targets[id]) this.makeProxy(id);
      if(this.targets[id]) {
        this.targets[id].handleEvent(data);
        //console.log(this.targets[id],data)
        return true;
      }
      return undefined;
    }
}

function makeProxy(id, elm?) {

  if(this?.__node?.graph) {

    if(!this.__node.graph.ProxyManager) this.__node.graph.ProxyManager = new ProxyManager();

    this.__node.graph.ProxyManager.makeProxy(id, elm);

  }
  else {
    if(!globalThis.ProxyManager) globalThis.ProxyManager = new ProxyManager();

    globalThis.ProxyManager.makeProxy(id, elm);
  }
    return id;
}
function handleProxyEvent( data, id){
  if(this?.__node?.graph) {
    if(!this.__node.graph.ProxyManager) this.__node.graph.ProxyManager = new ProxyManager();
    if(this.__node.graph.ProxyManager.handleEvent(data, id)) return data;
  } else {
    if(!globalThis.ProxyManager) globalThis.ProxyManager = new ProxyManager();
    if(globalThis.ProxyManager.handleEvent(data, id)) return data;
  }
}

//just load these into the worker service front and back. These are integrated in the worker canvas routes as well
export const proxyElementWorkerRoutes = {
    initProxyElement:initProxyElement,
    makeProxy:makeProxy,
    handleProxyEvent:handleProxyEvent
} 


//how to use

/*
  Frontend:

    let id = canvas.id;

    service.run('initProxyElement',[HTMLElement, worker, id])

  Backend worker:
    service.run('makeProxy', [id, offscreen]) //now install addEventListener etc to the offscreen canvas and it can now proxy html mouse events

    offscreen.addEventListener('mousedown',(ev)=>{ ... })

*/