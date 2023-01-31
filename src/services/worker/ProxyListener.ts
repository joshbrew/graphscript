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
    'movementX',
    'movementY',
    'x',
    'y',
    'timeStamp'
  ]);

const wheelEventHandlerImpl = makeSendPropertiesHandler([
  'deltaX',
  'deltaY',
]);

const keydownEventHandler = makeSendPropertiesHandler([
  'ctrlKey',
  'metaKey',
  'shiftKey',
  'altKey',
  'isComposing',
  'keyCode',
  'key',
  'code',
  'repeat',
  'timeStamp'
]);

function focusEventHandler(event, sendFn) {
  const data = { type:event.type } as any;
  data.isTrusted = event.isTrusted;
  data.bubbles = event.bubbles;
  data.cancelBubble = event.cancelBubble;
  data.cancelable = event.cancelable;
  data.composed = event.composed;
  data.defaultPrevent = event.defaultPrevented;
  data.eventPhase = event.eventPhase;
  data.returnValue = event.returnValue;

  data.currentTarget = event.currentTarget.id ? event.currentTarget.id : event.currentTarget.constructor.name;
  data.target = data.currentTarget;
  data.srcElement = data.currentTarget;

  sendFn(data);
}

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

let i = 1;
let keys = {};
while(i < 222) { //proxy all key events
  keys[i] = true; //avoid F keys
  i++;
}


function filteredKeydownEventHandler(event, sendFn) {
  let {keyCode} = event;
  if (keys[keyCode]) {
    if(event.preventDefault && (keyCode < 110 || keyCode > 123)) event.preventDefault();
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
  pointerlockchange: mouseEventHandler,
  webkitpointerlockchange: mouseEventHandler,
  focus: focusEventHandler,
  blur: focusEventHandler,
  pointerout: mouseEventHandler,
  touchstart: touchEventHandler,
  touchmove: touchEventHandler,
  touchend: touchEventHandler,
  wheel: wheelEventHandler,
  keydown: filteredKeydownEventHandler,
  keyup: filteredKeydownEventHandler
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

    if(eventHandlers.keydown) {
      globalThis.addEventListener('keydown', function(ev) {
        eventHandlers.keydown(ev, sendEvent);
      })
    }

    if(eventHandlers.keyup) {
      globalThis.addEventListener('keyup', function(ev) {
        eventHandlers.keyup(ev, sendEvent);
      })
    }

    // if(eventHandlers.focus) {
    //   globalThis.addEventListener('focus', function(ev) {
    //     eventHandlers.focus(ev, sendEvent);
    //   })
    // }

    // if(eventHandlers.blur) {
    //   globalThis.addEventListener('blur', function(ev) {
    //     eventHandlers.blur(ev, sendEvent);
    //   })
    // }

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
    //console.log(type,listener);
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
			//event.target = null;
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

  blur() {}

}

/////////////https://threejsfundamentals.org/threejs/lessons/threejs-offscreencanvas.html
export class ProxyManager {

    targets:any={};

    constructor() {
      if(!globalThis.document) globalThis.document = {
        elementFromPoint:(...args:any[])=>{ //hax
          return this.targets[Object.keys(this.targets)[0]].proxied;
        }
      } as any; //threejs hack for workers
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
          addTo.blur = proxy.blur.bind(proxy);
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