(()=>{var p=class{constructor(e){this.pushToState={};this.data={};this.triggers={};this.setState=e=>{Object.assign(this.data,e);let t=Object.getOwnPropertyNames(e);for(let n of t)this.triggerEvent(n,this.data[n]);return this.data};this.setValue=(e,t)=>{this.data[e]=t,this.triggerEvent(e,t)};this.triggerEvent=(e,t)=>{if(this.triggers[e]){let n=i=>i.onchange(t);this.triggers[e].forEach(n)}};this.subscribeEvent=(e,t,n,i)=>{if(e){n&&i&&!this.triggers[e]&&Object.defineProperty(this.data,e,{get:()=>n[i],set:o=>{n[i]=o},enumerable:!0,configurable:!0}),this.triggers[e]||(this.triggers[e]=[]);let _=this.triggers[e].length;return this.triggers[e].push({sub:_,onchange:t}),this.triggers[e].length-1}else return};this.unsubscribeEvent=(e,t)=>{let n=this.triggers[e];if(n)if(!t)delete this.triggers[e],delete this.data[e];else{let i,_=n.find((o,r)=>{if(o.sub===i)return i=r,!0});return _&&n.splice(i,1),Object.keys(n).length===0&&(delete this.triggers[e],delete this.data[e]),this.onRemoved&&this.onRemoved(_),!0}};this.subscribeEventOnce=(e,t)=>{let n,i=_=>{t(_),this.unsubscribeEvent(e,n)};n=this.subscribeEvent(e,i)};this.getEvent=(e,t)=>{for(let n in this.triggers[e])if(this.triggers[e][n].sub===t)return this.triggers[e][n]};this.getSnapshot=()=>{let e={};for(let t in this.data)e[t]=this.data[t]};typeof e=="object"&&(this.data=e)}};var N=new p,h=class{constructor(e,t,n){this.__node={tag:`node${Math.floor(Math.random()*1e15)}`,unique:`${Math.floor(Math.random()*1e15)}`,state:N};this.__setProperties=(e,t,n)=>{if((()=>{let _=e;typeof e=="function"?m(e)?e=new e:e={__operator:e,__node:{forward:!0,tag:e.name}}:typeof e=="string"&&n?.get(e)&&(e=n.get(e)),e.__node.initial||(e.__node.initial=_)})(),typeof e=="object"){let _=()=>{e.__node?.state&&(this.__node.state=e.__node.state)},o=()=>{e.__props&&(typeof e.__props=="function"&&(e.__props=new e.__props),typeof e.__props=="object"&&this.__proxyObject(e.__props))},r=()=>{e.__node.tag||(e.__operator?.name?e.__node.tag=e.__operator.name:e.__node.tag=`node${Math.floor(Math.random()*1e15)}`)},f=()=>{typeof e.__node=="string"?n?.get(e.__node.tag)?e=n.get(e.__node.tag):e.__node={}:e.__node||(e.__node={}),n&&(e.__node.graph=n),e instanceof y&&(e.__node.source=e)},a=()=>{if(!e.__parent&&t&&(e.__parent=t),t?.__node&&!(t instanceof y||e instanceof y)&&(e.__node.tag=t.__node.tag+"."+e.__node.tag),t instanceof y&&e instanceof y&&(e.__node.loaders&&Object.assign(t.__node.loaders?t.__node.loaders:{},e.__node.loaders),t.__node.mapGraphs)){e.__node.nodes.forEach(g=>{t.set(e.__node.tag+"."+g.__node.tag,g)});let u=()=>{e.__node.nodes.forEach(g=>{t.__node.nodes.delete(e.__node.tag+"."+g.__node.tag)})};this.__addOndisconnected(u)}},d=()=>{if(typeof e.default=="function"&&!e.__operator&&(e.__operator=e.default),e.__operator){if(typeof e.__operator=="string"&&n){let u=n.get(e.__operator);u&&(e.__operator=u.__operator),!e.__node.tag&&e.__operator.name&&(e.__node.tag=e.__operator.name)}typeof e.__operator=="function"&&(e.__operator=this.__setOperator(e.__operator)),e.default&&(e.default=e.__operator)}},l=()=>{e.__node=Object.assign(this.__node,e.__node);let u=Object.getOwnPropertyNames(e);for(let g of u)this[g]=e[g]},c=()=>{this.__onconnected&&(typeof this.__onconnected=="function"?this.__onconnected=this.__onconnected.bind(this):Array.isArray(this.__onconnected)&&(this.__onconnected=this.__onconnected.map(u=>u.bind(this))),typeof this.__ondisconnected=="function"?this.__ondisconnected=this.__ondisconnected.bind(this):Array.isArray(this.__ondisconnected)&&(this.__ondisconnected=this.__ondisconnected.map(u=>u.bind(this))))};_(),r(),o(),f(),a(),l(),c(),d()}};this.__subscribe=(e,t,n,i,_)=>{let o=(f,a=(l,c)=>l,d=e)=>{let l=this.__node.state.subscribeEvent(f,d,this,t),c=this.__node.state.getEvent(f,l);return c.source=this.__node.tag,t&&(c.key=t),c.target=a(e),i&&(c.bound=i),l},r=f=>{if(!this.__node.graph.get(f)&&f.includes(".")){let d=this.__node.graph.get(f.substring(0,f.lastIndexOf("."))),l=f.substring(f.lastIndexOf(".")+1);d&&typeof d[l]=="function"&&(f=(...c)=>d[l](...c))}};if(t){if((!this.__node.localState||!this.__node.localState[t])&&this.__addLocalState(this,t),typeof e=="string"){if(_){if(this.__node.graph?.get(_)){let d=this.__node.graph?.get(_);if(typeof d[e]=="function"){let l=d[e];e=(...c)=>{l(...c)}}else{let l=e;e=u=>{d[l]=u}}}}else if(typeof this[e]=="function"){let d=this[e];e=(...l)=>{d(...l)}}else this.__node.graph?.get(e)&&r(e);if(typeof e!="function")return}let f,a=n?this.__node.unique+"."+t+"input":this.__node.unique+"."+t;return typeof e=="function"?f=o(a):e?.__node&&(f=o(a,(d,l)=>l||d.__node.unique,(...d)=>{e.__operator&&e.__operator(...d)})),f}else{if(typeof e=="string"&&(this.__node.graph.get(e)&&(e=this.__node.graph.get(e)),typeof e!="object"))return;let f,a=n?this.__node.unique+"input":this.__node.unique;return typeof e=="function"?f=o(a):e?.__node&&(f=o(a,(d,l)=>l||d.__node.unique,(...d)=>{e.__operator&&e.__operator(...d)})),f}};this.__unsubscribe=(e,t,n)=>t?this.__node.state.unsubscribeEvent(n?this.__node.unique+"."+t+"input":this.__node.unique+"."+t,e):this.__node.state.unsubscribeEvent(n?this.__node.unique+"input":this.__node.unique,e);this.__setOperator=e=>{e=e.bind(this),this.__args&&this.__node.graph&&(e=G(e,this.__args,this.__node.graph));let t=`${this.__node.unique}input`;if(this.__operator=(...n)=>{this.__node.state.triggers[t]&&this.__node.state.setValue(t,n);let i=e(...n);return this.__node.state.triggers[this.__node.unique]&&(typeof i?.then=="function"?i.then(_=>{_!==void 0&&this.__node.state.setValue(this.__node.unique,_)}).catch(console.error):i!==void 0&&this.__node.state.setValue(this.__node.unique,i)),i},this.__parent instanceof h&&!this.__subscribedToParent&&this.__parent.__operator){let n=this.__parent.__subscribe(this),i=()=>{this.__parent?.__unsubscribe(n),delete this.__subscribedToParent};this.__addOndisconnected(i),this.__subscribedToParent=!0}return this.__operator};this.__addLocalState=(e,t)=>{if(!e)return;this.__node.localState||(this.__node.localState={});let n=this.__node.localState,i=(_,o)=>{let r=this.__node.unique+"."+o,f=`${r}input`;if(typeof _[o]=="function"&&o!=="__operator"){let a=_[o].bind(this);_[o]=(...d)=>{this.__node.state.triggers[f]&&this.__node.state.setValue(f,d);let l=a(...d);return this.__node.state.triggers[r]&&(typeof l?.then=="function"?l.then(c=>{this.__node.state.triggerEvent(r,c)}).catch(console.error):this.__node.state.triggerEvent(r,l)),l}}else{let a,d;this.__props?.[o]?(a=()=>this.__props[o],d=c=>{this.__props[o]=c,this.__node.state.triggers[r]&&this.__node.state.triggerEvent(r,c)}):(n[o]=_[o],a=()=>n[o],d=c=>{n[o]=c,this.__node.state.triggers[r]&&this.__node.state.triggerEvent(r,c)});let l={get:a,set:d,enumerable:!0,configurable:!0};if(Object.defineProperty(_,o,l),typeof this.__node.initial=="object"){let c=Object.getOwnPropertyDescriptor(this.__node.initial,o);(c===void 0||c?.configurable)&&Object.defineProperty(this.__node.initial,o,l)}}};if(t)i(e,t);else for(let _ in e)i(e,_)};this.__proxyObject=e=>{let t=j(e);for(let n of t)if(typeof e[n]=="function")this[n]=(...i)=>e[n](...i);else{let i={get:()=>e[n],set:_=>{e[n]=_},enumerable:!0,configurable:!0};if(Object.defineProperty(this,n,i),typeof this.__node.initial=="object"){let _=Object.getOwnPropertyDescriptor(this.__node.initial,n);(_===void 0||_?.configurable)&&Object.defineProperty(this.__node.initial,n,i)}}};this.__setProperties(e,t,n)}__addOnconnected(e){e=e.bind(this),Array.isArray(this.__onconnected)?this.__onconnected.push(e):typeof this.__onconnected=="function"?this.__onconnected=[e,this.__onconnected]:this.__onconnected=e}__addOndisconnected(e){e=e.bind(this),Array.isArray(this.__ondisconnected)?this.__ondisconnected.push(e):typeof this.__ondisconnected=="function"?this.__ondisconnected=[e,this.__ondisconnected]:this.__ondisconnected=e}__callConnected(e=this){if(typeof this.__onconnected=="function")this.__onconnected(this);else if(Array.isArray(this.__onconnected)){let t=n=>{n(this)};this.__onconnected.forEach(t)}}__callDisconnected(e=this){if(typeof this.__ondisconnected=="function")this.__ondisconnected(this);else if(Array.isArray(this.__ondisconnected)){let t=n=>{n(this)};this.__ondisconnected.forEach(t)}}},y=class{constructor(e){this.__node={tag:`graph${Math.floor(Math.random()*1e15)}`,unique:`${Math.random()}`,nodes:new Map,state:N,roots:{}};this.init=e=>{if(e){let t=Object.assign({},e);delete t.roots,O(this.__node,t),e.roots&&this.load(e.roots)}};this.load=e=>{function t(_,o,r=!0,f=!0){if(f&&(_?Object.assign(_,o):_=Object.assign({},o),t(_,o,!0,!1)),o.__children&&!r)o.__children?.constructor.name==="Object"?_.__children?.constructor.name==="Object"?t(_.__children,o.__children,!0,!1):_.__children=t({},o.__children,!0,!1):_.__children=o.__children;else if(r)for(let a in o)_[a]=Object.assign({},o[a]),o[a].__children&&t({},o[a].__children,!1,!1);return _}this.__node.roots=t(this.__node.roots?this.__node.roots:{},e);let n=Object.assign({},e);n.__node&&delete n.__node;let i=this.recursiveSet(n,this,void 0,e);if(e.__node){if(!e.__node.tag)e.__node._tag=`roots${Math.floor(Math.random()*1e15)}`;else if(!this.get(e.__node.tag)){let _=new h(e,this,this);this.set(_.__node.tag,_),this.runLoaders(_,this,e,e.__node.tag),_.__listeners&&(i[_.__node.tag]=_.__listeners)}}else e.__listeners&&this.setListeners(e.__listeners);return this.setListeners(i),n};this.setLoaders=(e,t)=>(t?this.__node.loaders=e:Object.assign(this.__node.loaders,e),this.__node.loaders);this.runLoaders=(e,t,n,i)=>{for(let _ in this.__node.loaders)typeof this.__node.loaders[_]=="object"?(this.__node.loaders[_].init&&this.__node.loaders[_](e,t,this,this.__node.roots,n,i),this.__node.loaders[_].connected&&e.__addOnconnected(this.__node.loaders[_].connect),this.__node.loaders[_].disconnected&&e.__addOndisconnected(this.__node.loaders[_].disconnect)):typeof this.__node.loaders[_]=="function"&&this.__node.loaders[_](e,t,this,this.__node.roots,n,i)};this.add=(e,t)=>{let n={};typeof t=="string"&&(t=this.get(t));let i;if(typeof e=="function"?m(e)?e.prototype instanceof h?(e=e.prototype.constructor(e,t,this),i=!0):e=new e:e={__operator:e}:typeof e=="string"&&(e=this.__node.roots[e]),!!e){if(!i){let _=Object.getOwnPropertyNames(e),o={};for(let r of _)o[r]=e[r];e=o}if(e.__node||(e.__node={}),e.__node.initial=e,typeof e=="object"&&(!e?.__node?.tag||!this.get(e.__node.tag))){let _;if(i?_=e:_=new h(e,t,this),this.set(_.__node.tag,_),this.runLoaders(_,t,e,_.__node.tag),this.__node.roots[_.__node.tag]=e,_.__children&&(_.__children=Object.assign({},_.__children),this.recursiveSet(_.__children,_,n,_.__children)),_.__listeners){n[_.__node.tag]=Object.assign({},_.__listeners);for(let o in _.__listeners){let r=_.__listeners[o];_[o]&&(delete n[_.__node.tag][o],n[_.__node.tag][_.__node.tag+"."+o]=r),typeof r=="string"&&(_.__children?.[r]?n[_.__node.tag][o]=_.__node.tag+"."+r:t instanceof h&&(t.__node.tag===r||t.__node.tag.includes(".")&&t.__node.tag.split(".").pop()===r)&&(n[_.__node.tag][o]=t.__node.tag))}}return this.setListeners(n),_.__callConnected(),_}}};this.recursiveSet=(e,t,n={},i)=>{let _=Object.getOwnPropertyNames(i);for(let o of _){if(o.includes("__"))continue;let r=i[o];if(Array.isArray(r))continue;let f;if(typeof r=="function"?m(r)?(r=new r,r instanceof h&&(r=r.prototype.constructor(r,t,this),f=!0)):r={__operator:r}:typeof r=="string"?this.__node.nodes.get(r)?r=this.__node.nodes.get(r):r=this.__node.roots[r]:typeof r=="boolean"&&(this.__node.nodes.get(o)?r=this.__node.nodes.get(o):r=this.__node.roots[o]),typeof r=="object"){if(!f&&!(r instanceof h)){let l=Object.getOwnPropertyNames(r),c={};for(let u of l)c[u]=r[u];r=c}if(r.__node||(r.__node={}),r.__node.tag||(r.__node.tag=o),r.__node.initial||(r.__node.initial=e[o]),this.get(r.__node.tag)&&!(!(t instanceof y)&&t?.__node)||t?.__node&&this.get(t.__node.tag+"."+r.__node.tag))continue;let a,d=!1;if(f||r instanceof h?a=r:(a=new h(r,t,this),d=!0),!d&&r instanceof h&&!f&&t instanceof h){let l=this.subscribe(t.__node.tag,a.__node.tag),c=u=>{this.unsubscribe(t.__node.tag,l)};a.__addOndisconnected(c)}else{if(this.set(a.__node.tag,a),this.runLoaders(a,t,e[o],o),e[o]=a,this.__node.roots[a.__node.tag]=r,a.__children&&(a.__children=Object.assign({},a.__children),this.recursiveSet(a.__children,a,n,a.__children)),a.__listeners){n[a.__node.tag]=Object.assign({},a.__listeners);for(let l in a.__listeners){let c=a.__listeners[l],u=l;a[l]&&(delete n[a.__node.tag][l],u=a.__node.tag+"."+l,n[a.__node.tag][u]=c),typeof c=="string"&&(a.__children?.[c]?n[a.__node.tag][u]=a.__node.tag+"."+c:t instanceof h&&(t.__node.tag===c||t.__node.tag.includes(".")&&t.__node.tag.split(".").pop()===c)&&(n[a.__node.tag][u]=t.__node.tag))}}a.__callConnected()}}}return n};this.remove=(e,t=!0)=>{if(this.unsubscribe(e),typeof e=="string"&&(e=this.get(e)),e instanceof h){this.delete(e.__node.tag),delete this.__node.roots[e.__node.tag],t&&this.clearListeners(e),e.__callDisconnected();let n=i=>{for(let _ in i)this.unsubscribe(i[_]),this.delete(i[_].__node.tag),delete this.__node.roots[i[_].__node.tag],this.delete(_),delete this.__node.roots[_],i[_].__node.tag=i[_].__node.tag.substring(i[_].__node.tag.lastIndexOf(".")+1),t&&this.clearListeners(i[_]),console.log(_,i[_].__listeners),i[_].__callDisconnected(),i[_].__children&&n(i[_].__children)};e.__children&&n(e.__children)}return e?.__node.tag&&e?.__parent&&(delete e?.__parent,e.__node.tag=e.__node.tag.substring(e.__node.tag.indexOf(".")+1)),e};this.run=(e,...t)=>{if(typeof e=="string"){let n=this.get(e);if(!n&&e.includes(".")){if(n=this.get(e.substring(0,e.lastIndexOf("."))),typeof n?.[e.substring(e.lastIndexOf(".")+1)]=="function")return n[e.substring(e.lastIndexOf(".")+1)](...t)}else if(n?.__operator)return n.__operator(...t)}if(e?.__operator)return e?.__operator(...t)};this.setListeners=e=>{for(let t in e){let n=this.get(t);if(typeof e[t]=="object")for(let i in e[t]){let _=this.get(i),o;if(typeof e[t][i]!="object")e[t][i]={__callback:e[t][i]};else if(!e[t][i].__callback)for(let r in e[t][i]){typeof e[t][i][r]!="object"&&(e[t][i][r]={__callback:e[t][i][r]},(e[t][i][r].__callback===!0||typeof e[t][i][r].__callback>"u")&&(e[t][i][r].__callback=n.__operator));let f=this.get(r);if(f)if(f)o=this.subscribe(f,e[t][i][r].__callback,e[t][i].__args,void 0,e[t][i].inputState,t,i),typeof n.__listeners[i][r]!="object"&&(n.__listeners[i][r]={__callback:e[t][i][r].__callback,inputState:e[t][i][r]?.inputState}),n.__listeners[i][r].sub=o;else{let a=i.substring(0,i.lastIndexOf("."));f=this.get(a),_&&(o=this.subscribe(f,e[t][i][r].__callback,e[t][i][r].__args,i.substring(i.lastIndexOf(".")+1),e[t][i][r].inputState,t,i),typeof n.__listeners[i][r]!="object"&&(n.__listeners[i][r]={__callback:e[t][i][r].__callback,inputState:e[t][i][r]?.inputState}),n.__listeners[i][r].sub=o)}}if("__callback"in e[t][i])if((e[t][i].__callback===!0||typeof e[t][i].__callback>"u")&&(e[t][i].__callback=n.__operator),typeof e[t][i].__callback=="function"&&(e[t][i].__callback=e[t][i].__callback.bind(n)),typeof n.__listeners!="object"&&(n.__listeners={}),_)o=this.subscribe(_,e[t][i].__callback,e[t][i].__args,void 0,e[t][i].inputState,t,i),typeof n.__listeners[i]!="object"&&(n.__listeners[i]={__callback:e[t][i].__callback,inputState:e[t][i]?.inputState}),n.__listeners[i].sub=o;else{let r=i.substring(0,i.lastIndexOf("."));_=this.get(r),_&&(o=this.subscribe(_,e[t][i].__callback,e[t][i].__args,i.substring(i.lastIndexOf(".")+1),e[t][i].inputState,t,i),typeof n.__listeners[i]!="object"&&(n.__listeners[i]={__callback:e[t][i].__callback,inputState:e[t][i]?.inputState}),n.__listeners[i].sub=o)}}}};this.clearListeners=(e,t)=>{if(typeof e=="string"&&(e=this.get(e)),e?.__listeners)for(let n in e.__listeners){if(t&&n!==t||typeof e.__listeners[n]?.sub!="number")continue;let i=this.get(n);if(i)if(typeof!e.__listeners[n]?.__callback=="number")for(let _ in e.__listeners[n])e.__listeners[n][_]?.sub&&(this.unsubscribe(i,e.__listeners[n][_].sub,void 0,e.__listeners[n][_].inputState),e.__listeners[n][_].sub=void 0);else typeof e.__listeners[n]?.sub=="number"&&(this.unsubscribe(i,e.__listeners[n].sub,void 0,e.__listeners[n].inputState),e.__listeners[n].sub=void 0);else if(i=this.get(n.substring(0,n.lastIndexOf("."))),i)if(typeof e.__listeners[n]=="object"&&!e.__listeners[n]?.__callback)for(let _ in e.__listeners[n])typeof e.__listeners[n][_]?.sub=="number"&&(this.unsubscribe(i,e.__listeners[n][_].sub,n.substring(n.lastIndexOf(".")+1),e.__listeners[n][_].inputState),e.__listeners[n][_].sub=void 0);else typeof e.__listeners[n]?.sub=="number"&&(this.unsubscribe(i,e.__listeners[n].sub,n.substring(n.lastIndexOf(".")+1),e.__listeners[n].inputState),e.__listeners[n].sub=void 0)}};this.get=e=>this.__node.nodes.get(e);this.set=(e,t)=>this.__node.nodes.set(e,t);this.delete=e=>this.__node.nodes.delete(e);this.getProps=(e,t)=>{if(typeof e=="string"&&(e=this.get(e)),e instanceof h){let n;if(t)n=Object.assign({},this.__node.roots[e.__node.tag]);else{n=Object.assign({},e);for(let i in n)i.includes("__")&&delete n[i]}}};this.subscribe=(e,t,n,i,_,o,r)=>{let f=e;typeof e=="string"&&(f=this.get(e),!f&&e.includes(".")&&(f=this.get(e.substring(0,e.lastIndexOf("."))),i=e.substring(e.lastIndexOf(".")+1)));let a;if(o instanceof h&&(o=o.__node.tag),typeof t=="string"){let d=t,l=c=>{if(this.get(c)?.__operator){let u=this.get(c);c=function(...g){return u.__operator(...g)}}else if(c.includes(".")){let u=this.get(c.substring(0,c.lastIndexOf("."))),g=c.substring(c.lastIndexOf(".")+1);typeof u[g]=="function"?u[g]instanceof h?c=u[g]:c=function(...b){return u[g](...b)}:c=function(b){return u[g]=b,u[g]}}return c};if(o){let c=this.get(o);typeof c?.[t]=="function"?t=function(...u){return c[d](...u)}:c[d]?c[d]instanceof h?t=c[d]:t=function(u){return c[d]=u,c[d]}:t=l(t)}else t=l(t)}if((typeof t=="function"||t instanceof h)&&n&&(t instanceof h&&t.__operator&&(t=function(d){return t.__operator(d)}),t=G(t,n,this)),f instanceof h){a=f.__subscribe(t,i,_,o,r);let d=()=>{f.__unsubscribe(a,i,_)};f.__addOndisconnected(d)}else if(typeof e=="string")if(this.get(e))if(t instanceof h&&t.__operator){a=this.get(e).__subscribe(t.__operator,i,_,o,r);let d=()=>{this.get(e).__unsubscribe(a)};t.__addOndisconnected(d)}else(typeof t=="function"||typeof t=="string")&&(a=this.get(e).__subscribe(t,i,_,o,r),this.__node.state.getEvent(this.get(e).__node.unique,a).source=e);else typeof t=="string"&&(t=this.__node.nodes.get(t).__operator),typeof t=="function"&&(a=this.__node.state.subscribeEvent(e,t));return a};this.unsubscribe=(e,t,n,i)=>e instanceof h?e.__unsubscribe(t,n,i):this.get(e)?.__unsubscribe(t,n,i);this.setState=e=>{this.__node.state.setState(e)};this.init(e)}};function O(s,e){for(let t in e)e[t]?.constructor.name==="Object"&&!Array.isArray(e[t])?s[t]?.constructor.name==="Object"&&!Array.isArray(s[t])?O(s[t],e[t]):s[t]=O({},e[t]):s[t]=e[t];return s}function j(s){var e=[],t=s;do{var n=Object.getOwnPropertyNames(t);let i=function(_){e.indexOf(_)===-1&&e.push(_)};n.forEach(i)}while(t=Object.getPrototypeOf(t));return e}function T(s){let e=j(s),t={};for(let n of e)t[n]=s[n];return t}function m(s){return x(s)==="class"}function x(s){return typeof s=="function"?s.prototype?Object.getOwnPropertyDescriptor(s,"prototype")?.writable?"function":"class":s.constructor.name==="AsyncFunction"?"async":"arrow":""}var G=(s,e,t)=>{let n=[],i=r=>{if(t.get(r)?.__operator){let f=t.get(r);return(...a)=>{f.__operator(...a)}}else if(r.includes(".")){let f=r.split("."),a=f.pop(),d=f.join("."),l=t.get(d);return typeof t.get(d)?.[a]=="function"?(...c)=>l[a](...c):()=>l[a]}else if(t.get(r)){let f=t.get(r);return()=>f}else{let f=r;return()=>f}},_=(r,f)=>{if(r==="__output")n[f]=a=>a;else if(typeof r=="string")n[f]=i(r);else if(typeof r=="function"){let a=r;n[f]=(...d)=>a(...d)}else if(typeof r=="object"&&r.__input){let a=function(d){let l=d.__input;if(typeof d.__input=="string"&&(l=i(d.__input)),d.__args&&(l=G(l,d.__args,t)),d.__output){let c=d.__output;if(typeof d.__output=="string"?c=i(c):typeof r.__output=="object"&&(c=a(c)),typeof c=="function"){let u=l;l=(...g)=>c(u(...g))}}return l};n[f]=a(r)}else{let a=r;n[f]=()=>a}};e.forEach(_),typeof s=="string"&&(s=i(s));let o=s;return s=function(...r){let f=a=>a(...r);return o(...n.map(f))},s};var S=(s,e,t)=>{s.__node.backward&&e instanceof h&&t.setListeners({[e.__node.tag]:{[s.__node.tag]:e}})},P=(s,e,t)=>{if(s.__operator&&!s.__node.looperSet){if(typeof s.__node.delay=="number"){let n=s.__operator;s.__setOperator((...i)=>new Promise((_,o)=>{setTimeout(async()=>{_(await n(...i))},s.__node.delay)}))}else if(s.__node.frame===!0){let n=s.__operator;s.__setOperator((...i)=>new Promise((_,o)=>{requestAnimationFrame(async()=>{_(await n(...i))})}))}if(typeof s.__node.repeat=="number"||typeof s.__node.recursive=="number"){let n=s.__operator;s.__setOperator(async(...i)=>{let _=s.__node.repeat?s.__node.repeat:s.__node.recursive,o,r=async(f,...a)=>{for(;f>0;){if(s.__node.delay||s.__node.frame){n(...a).then(async d=>{s.__node.recursive?await r(f,d):await r(f,...a)});break}else o=await n(...i);f--}};return await r(_,...i),o})}if(s.__node.loop&&typeof s.__node.loop=="number"){s.__node.looperSet=!0;let n=s.__operator;s.__setOperator((..._)=>{"looping"in s.__node||(s.__node.looping=!0),s.__node.looping&&(n(..._),setTimeout(()=>{s.__operator(..._)},s.__node.loop))}),s.__node.looping&&s.__operator();let i=_=>{_.__node.looping&&(_.__node.looping=!1)};s.__addOndisconnected(i)}}},w=(s,e,t)=>{if(s.__node.animate===!0||s.__animation){let n=s.__operator;s.__setOperator((..._)=>{"animating"in s.__node||(s.__node.animating=!0),s.__node.animating&&(typeof s.__animation=="function"?s.__animation(..._):n(..._),requestAnimationFrame(()=>{s.__operator(..._)}))}),(s.__node.animating||(!("animating"in s.__node)||s.__node.animating)&&s.__animation)&&setTimeout(()=>{requestAnimationFrame(s.__operator)},10);let i=_=>{_.__node.animating&&(_.__node.animating=!1)};s.__addOndisconnected(i)}},A=(s,e,t)=>{if(typeof s.__branch=="object"&&s.__operator&&!s.__branchApplied){let n=s.__operator;s.__branchApplied=!0,s.__operator=(...i)=>{let _=n(...i);for(let o in s.__branch){let r=()=>{typeof s.__branch[o].then=="function"?s.__branch[o].then(_):s.__branch[o].then instanceof h&&s.__branch[o].then.__operator?s.__branch[o].then.__operator(_):_=s.__branch[o].then};typeof s.__branch[o].if=="function"?s.__branch[o].if(_)==!0&&r():s.__branch[o].if===_&&r()}return _}}if(s.__listeners){for(let n in s.__listeners)if(typeof s.__listeners[n]=="object"&&s.__listeners[n].branch&&!s.__listeners[n].branchApplied){let i=s.__listeners[n].callback;s.__listeners[n].branchApplied=!0,s.__listeners.callback=_=>{let o=()=>{typeof s.__listeners[n].branch.then=="function"?_=s.__listeners[n].branch.then(_):s.__listeners[n].branch.then instanceof h&&s.__listeners[n].branch.then.__operator?_=s.__listeners[n].branch.then.__operator(_):_=s.__listeners[n].branch.then};return typeof s.__listeners[n].branch.if=="function"?s.__listeners[n].branch.if(_)&&o():s.__listeners[n].branch.if===_&&o(),i(_)}}}},q=(s,e,t)=>{if(s.__listeners)for(let n in s.__listeners)typeof s.__listeners[n]=="object"&&s.__listeners[n].oncreate&&s.__listeners[n].callback(s.__listeners[n].oncreate)},L=(s,e,t)=>{if(s.__listeners)for(let n in s.__listeners)typeof s.__listeners[n]=="object"&&typeof s.__listeners[n].binding=="object"&&(s.__listeners.callback=s.__listeners.callback.bind(s.__listeners[n].binding))},F=(s,e,t)=>{if(s.__listeners){for(let n in s.__listeners)if(typeof s.__listeners[n]=="object"&&typeof s.__listeners[n].transform=="function"&&!s.__listeners[n].transformApplied){let i=s.__listeners[n].callback;s.__listeners[n].transformApplied=!0,s.__listeners.callback=_=>(_=s.__listeners[n].transform(_),i(_))}}},M=(s,e,t)=>{s.post&&!s.__operator?s.__setOperator(s.post):!s.__operator&&typeof s.get=="function"&&s.__setOperator(s.get),!s.get&&s.__operator&&(s.get=s.__operator),s.aliases&&s.aliases.forEach(n=>{t.set(n,s);let i=_=>{t.__node.nodes.delete(n)};s.__addOndisconnected(i)}),typeof t.__node.roots?.[s.__node.tag]=="object"&&s.get&&(t.__node.roots[s.__node.tag].get=s.get)},R={backprop:S,loop:P,animate:w,branching:A,triggerListenerOncreate:q,bindListener:L,transformListenerResult:F,substitute__operator:M};})();
