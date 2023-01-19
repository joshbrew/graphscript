var p=class{constructor(e){this.pushToState={};this.data={};this.triggers={};this.setState=e=>{Object.assign(this.data,e);let t=Object.getOwnPropertyNames(e);for(let _ of t)this.triggerEvent(_,this.data[_]);return this.data};this.setValue=(e,t)=>{this.data[e]=t,this.triggerEvent(e,t)};this.triggerEvent=(e,t)=>{if(this.triggers[e]){let _=i=>i.onchange(t);this.triggers[e].forEach(_)}};this.subscribeEvent=(e,t,_,i)=>{if(e){_&&i&&!this.triggers[e]&&Object.defineProperty(this.data,e,{get:()=>_[i],set:o=>{_[i]=o},enumerable:!0,configurable:!0}),this.triggers[e]||(this.triggers[e]=[]);let n=this.triggers[e].length;return this.triggers[e].push({sub:n,onchange:t}),this.triggers[e].length-1}else return};this.unsubscribeEvent=(e,t)=>{let _=this.triggers[e];if(_)if(!t)delete this.triggers[e],delete this.data[e];else{let i,n=_.find((o,r)=>{if(o.sub===i)return i=r,!0});return n&&_.splice(i,1),Object.keys(_).length===0&&(delete this.triggers[e],delete this.data[e]),this.onRemoved&&this.onRemoved(n),!0}};this.subscribeEventOnce=(e,t)=>{let _,i=n=>{t(n),this.unsubscribeEvent(e,_)};_=this.subscribeEvent(e,i)};this.getEvent=(e,t)=>{for(let _ in this.triggers[e])if(this.triggers[e][_].sub===t)return this.triggers[e][_]};this.getSnapshot=()=>{let e={};for(let t in this.data)e[t]=this.data[t]};typeof e=="object"&&(this.data=e)}};var N=new p,u=class{constructor(e,t,_){this.__node={tag:`node${Math.floor(Math.random()*1e15)}`,unique:`${Math.floor(Math.random()*1e15)}`,state:N};this.__setProperties=(e,t,_)=>{if((()=>{let n=e;typeof e=="function"?m(e)?e=new e:e={__operator:e,__node:{forward:!0,tag:e.name}}:typeof e=="string"&&_?.get(e)&&(e=_.get(e)),e.__node.initial||(e.__node.initial=n)})(),typeof e=="object"){let n=()=>{e.__node?.state&&(this.__node.state=e.__node.state)},o=()=>{e.__props&&(typeof e.__props=="function"&&(e.__props=new e.__props),typeof e.__props=="object"&&this.__proxyObject(e.__props))},r=()=>{e.__node.tag||(e.__operator?.name?e.__node.tag=e.__operator.name:e.__node.tag=`node${Math.floor(Math.random()*1e15)}`)},f=()=>{typeof e.__node=="string"?_?.get(e.__node.tag)?e=_.get(e.__node.tag):e.__node={}:e.__node||(e.__node={}),_&&(e.__node.graph=_),e instanceof y&&(e.__node.source=e)},a=()=>{if(!e.__parent&&t&&(e.__parent=t),t?.__node&&!(t instanceof y||e instanceof y)&&(e.__node.tag=t.__node.tag+"."+e.__node.tag),t instanceof y&&e instanceof y&&(e.__node.loaders&&Object.assign(t.__node.loaders?t.__node.loaders:{},e.__node.loaders),t.__node.mapGraphs)){e.__node.nodes.forEach(g=>{t.set(e.__node.tag+"."+g.__node.tag,g)});let h=()=>{e.__node.nodes.forEach(g=>{t.__node.nodes.delete(e.__node.tag+"."+g.__node.tag)})};this.__addOndisconnected(h)}},d=()=>{if(typeof e.default=="function"&&!e.__operator&&(e.__operator=e.default),e.__operator){if(typeof e.__operator=="string"&&_){let h=_.get(e.__operator);h&&(e.__operator=h.__operator),!e.__node.tag&&e.__operator.name&&(e.__node.tag=e.__operator.name)}typeof e.__operator=="function"&&(e.__operator=this.__setOperator(e.__operator)),e.default&&(e.default=e.__operator)}},l=()=>{e.__node=Object.assign(this.__node,e.__node);let h=Object.getOwnPropertyNames(e);for(let g of h)this[g]=e[g]},c=()=>{this.__onconnected&&(typeof this.__onconnected=="function"?this.__onconnected=this.__onconnected.bind(this):Array.isArray(this.__onconnected)&&(this.__onconnected=this.__onconnected.map(h=>h.bind(this))),typeof this.__ondisconnected=="function"?this.__ondisconnected=this.__ondisconnected.bind(this):Array.isArray(this.__ondisconnected)&&(this.__ondisconnected=this.__ondisconnected.map(h=>h.bind(this))))};n(),r(),o(),f(),a(),l(),c(),d()}};this.__subscribe=(e,t,_,i,n)=>{let o=(f,a=(l,c)=>l,d=e)=>{let l=this.__node.state.subscribeEvent(f,d,this,t),c=this.__node.state.getEvent(f,l);return c.source=this.__node.tag,t&&(c.key=t),c.target=a(e),i&&(c.bound=i),l},r=f=>{if(!this.__node.graph.get(f)&&f.includes(".")){let d=this.__node.graph.get(f.substring(0,f.lastIndexOf("."))),l=f.substring(f.lastIndexOf(".")+1);d&&typeof d[l]=="function"&&(f=(...c)=>d[l](...c))}};if(t){if((!this.__node.localState||!this.__node.localState[t])&&this.__addLocalState(this,t),typeof e=="string"){if(n){if(this.__node.graph?.get(n)){let d=this.__node.graph?.get(n);if(typeof d[e]=="function"){let l=d[e];e=(...c)=>{l(...c)}}else{let l=e;e=h=>{d[l]=h}}}}else if(typeof this[e]=="function"){let d=this[e];e=(...l)=>{d(...l)}}else this.__node.graph?.get(e)&&r(e);if(typeof e!="function")return}let f,a=_?this.__node.unique+"."+t+"input":this.__node.unique+"."+t;return typeof e=="function"?f=o(a):e?.__node&&(f=o(a,(d,l)=>l||d.__node.unique,(...d)=>{e.__operator&&e.__operator(...d)})),f}else{if(typeof e=="string"&&(this.__node.graph.get(e)&&(e=this.__node.graph.get(e)),typeof e!="object"))return;let f,a=_?this.__node.unique+"input":this.__node.unique;return typeof e=="function"?f=o(a):e?.__node&&(f=o(a,(d,l)=>l||d.__node.unique,(...d)=>{e.__operator&&e.__operator(...d)})),f}};this.__unsubscribe=(e,t,_)=>t?this.__node.state.unsubscribeEvent(_?this.__node.unique+"."+t+"input":this.__node.unique+"."+t,e):this.__node.state.unsubscribeEvent(_?this.__node.unique+"input":this.__node.unique,e);this.__setOperator=e=>{e=e.bind(this),this.__args&&this.__node.graph&&(e=G(e,this.__args,this.__node.graph));let t=`${this.__node.unique}input`;if(this.__operator=(..._)=>{this.__node.state.triggers[t]&&this.__node.state.setValue(t,_);let i=e(..._);return this.__node.state.triggers[this.__node.unique]&&(typeof i?.then=="function"?i.then(n=>{n!==void 0&&this.__node.state.setValue(this.__node.unique,n)}).catch(console.error):i!==void 0&&this.__node.state.setValue(this.__node.unique,i)),i},this.__parent instanceof u&&!this.__subscribedToParent&&this.__parent.__operator){let _=this.__parent.__subscribe(this),i=()=>{this.__parent?.__unsubscribe(_),delete this.__subscribedToParent};this.__addOndisconnected(i),this.__subscribedToParent=!0}return this.__operator};this.__addLocalState=(e,t)=>{if(!e)return;this.__node.localState||(this.__node.localState={});let _=this.__node.localState,i=(n,o)=>{let r=this.__node.unique+"."+o,f=`${r}input`;if(typeof n[o]=="function"&&o!=="__operator"){let a=n[o].bind(this);n[o]=(...d)=>{this.__node.state.triggers[f]&&this.__node.state.setValue(f,d);let l=a(...d);return this.__node.state.triggers[r]&&(typeof l?.then=="function"?l.then(c=>{this.__node.state.triggerEvent(r,c)}).catch(console.error):this.__node.state.triggerEvent(r,l)),l}}else{let a,d;this.__props?.[o]?(a=()=>this.__props[o],d=c=>{this.__props[o]=c,this.__node.state.triggers[r]&&this.__node.state.triggerEvent(r,c)}):(_[o]=n[o],a=()=>_[o],d=c=>{_[o]=c,this.__node.state.triggers[r]&&this.__node.state.triggerEvent(r,c)});let l={get:a,set:d,enumerable:!0,configurable:!0};if(Object.defineProperty(n,o,l),typeof this.__node.initial=="object"){let c=Object.getOwnPropertyDescriptor(this.__node.initial,o);(c===void 0||c?.configurable)&&Object.defineProperty(this.__node.initial,o,l)}}};if(t)i(e,t);else for(let n in e)i(e,n)};this.__proxyObject=e=>{let t=j(e);for(let _ of t)if(typeof e[_]=="function")this[_]=(...i)=>e[_](...i);else{let i={get:()=>e[_],set:n=>{e[_]=n},enumerable:!0,configurable:!0};if(Object.defineProperty(this,_,i),typeof this.__node.initial=="object"){let n=Object.getOwnPropertyDescriptor(this.__node.initial,_);(n===void 0||n?.configurable)&&Object.defineProperty(this.__node.initial,_,i)}}};this.__setProperties(e,t,_)}__addOnconnected(e){e=e.bind(this),Array.isArray(this.__onconnected)?this.__onconnected.push(e):typeof this.__onconnected=="function"?this.__onconnected=[e,this.__onconnected]:this.__onconnected=e}__addOndisconnected(e){e=e.bind(this),Array.isArray(this.__ondisconnected)?this.__ondisconnected.push(e):typeof this.__ondisconnected=="function"?this.__ondisconnected=[e,this.__ondisconnected]:this.__ondisconnected=e}__callConnected(e=this){if(typeof this.__onconnected=="function")this.__onconnected(this);else if(Array.isArray(this.__onconnected)){let t=_=>{_(this)};this.__onconnected.forEach(t)}}__callDisconnected(e=this){if(typeof this.__ondisconnected=="function")this.__ondisconnected(this);else if(Array.isArray(this.__ondisconnected)){let t=_=>{_(this)};this.__ondisconnected.forEach(t)}}},y=class{constructor(e){this.__node={tag:`graph${Math.floor(Math.random()*1e15)}`,unique:`${Math.random()}`,nodes:new Map,state:N,roots:{}};this.init=e=>{if(e){let t=Object.assign({},e);delete t.roots,O(this.__node,t),e.roots&&this.load(e.roots)}};this.load=e=>{function t(n,o,r=!0,f=!0){if(f&&(n?Object.assign(n,o):n=Object.assign({},o),t(n,o,!0,!1)),o.__children&&!r)o.__children?.constructor.name==="Object"?n.__children?.constructor.name==="Object"?t(n.__children,o.__children,!0,!1):n.__children=t({},o.__children,!0,!1):n.__children=o.__children;else if(r)for(let a in o)n[a]=Object.assign({},o[a]),o[a].__children&&t({},o[a].__children,!1,!1);return n}this.__node.roots=t(this.__node.roots?this.__node.roots:{},e);let _=Object.assign({},e);_.__node&&delete _.__node;let i=this.recursiveSet(_,this,void 0,e);if(e.__node){if(!e.__node.tag)e.__node._tag=`roots${Math.floor(Math.random()*1e15)}`;else if(!this.get(e.__node.tag)){let n=new u(e,this,this);this.set(n.__node.tag,n),this.runLoaders(n,this,e,e.__node.tag),n.__listeners&&(i[n.__node.tag]=n.__listeners)}}else e.__listeners&&this.setListeners(e.__listeners);return this.setListeners(i),_};this.setLoaders=(e,t)=>(t?this.__node.loaders=e:Object.assign(this.__node.loaders,e),this.__node.loaders);this.runLoaders=(e,t,_,i)=>{for(let n in this.__node.loaders)typeof this.__node.loaders[n]=="object"?(this.__node.loaders[n].init&&this.__node.loaders[n](e,t,this,this.__node.roots,_,i),this.__node.loaders[n].connected&&e.__addOnconnected(this.__node.loaders[n].connect),this.__node.loaders[n].disconnected&&e.__addOndisconnected(this.__node.loaders[n].disconnect)):typeof this.__node.loaders[n]=="function"&&this.__node.loaders[n](e,t,this,this.__node.roots,_,i)};this.add=(e,t)=>{let _={};typeof t=="string"&&(t=this.get(t));let i;if(typeof e=="function"?m(e)?e.prototype instanceof u?(e=e.prototype.constructor(e,t,this),i=!0):e=new e:e={__operator:e}:typeof e=="string"&&(e=this.__node.roots[e]),!!e){if(!i){let n=Object.getOwnPropertyNames(e),o={};for(let r of n)o[r]=e[r];e=o}if(e.__node||(e.__node={}),e.__node.initial=e,typeof e=="object"&&(!e?.__node?.tag||!this.get(e.__node.tag))){let n;if(i?n=e:n=new u(e,t,this),this.set(n.__node.tag,n),this.runLoaders(n,t,e,n.__node.tag),this.__node.roots[n.__node.tag]=e,n.__children&&(n.__children=Object.assign({},n.__children),this.recursiveSet(n.__children,n,_,n.__children)),n.__listeners){_[n.__node.tag]=Object.assign({},n.__listeners);for(let o in n.__listeners){let r=n.__listeners[o];n[o]&&(delete _[n.__node.tag][o],_[n.__node.tag][n.__node.tag+"."+o]=r),typeof r=="string"&&(n.__children?.[r]?_[n.__node.tag][o]=n.__node.tag+"."+r:t instanceof u&&(t.__node.tag===r||t.__node.tag.includes(".")&&t.__node.tag.split(".").pop()===r)&&(_[n.__node.tag][o]=t.__node.tag))}}return this.setListeners(_),n.__callConnected(),n}}};this.recursiveSet=(e,t,_={},i)=>{let n=Object.getOwnPropertyNames(i);for(let o of n){if(o.includes("__"))continue;let r=i[o];if(Array.isArray(r))continue;let f;if(typeof r=="function"?m(r)?(r=new r,r instanceof u&&(r=r.prototype.constructor(r,t,this),f=!0)):r={__operator:r}:typeof r=="string"?this.__node.nodes.get(r)?r=this.__node.nodes.get(r):r=this.__node.roots[r]:typeof r=="boolean"&&(this.__node.nodes.get(o)?r=this.__node.nodes.get(o):r=this.__node.roots[o]),typeof r=="object"){if(!f&&!(r instanceof u)){let l=Object.getOwnPropertyNames(r),c={};for(let h of l)c[h]=r[h];r=c}if(r.__node||(r.__node={}),r.__node.tag||(r.__node.tag=o),r.__node.initial||(r.__node.initial=e[o]),this.get(r.__node.tag)&&!(!(t instanceof y)&&t?.__node)||t?.__node&&this.get(t.__node.tag+"."+r.__node.tag))continue;let a,d=!1;if(f||r instanceof u?a=r:(a=new u(r,t,this),d=!0),!d&&r instanceof u&&!f&&t instanceof u){let l=this.subscribe(t.__node.tag,a.__node.tag),c=h=>{this.unsubscribe(t.__node.tag,l)};a.__addOndisconnected(c)}else{if(this.set(a.__node.tag,a),this.runLoaders(a,t,e[o],o),e[o]=a,this.__node.roots[a.__node.tag]=r,a.__children&&(a.__children=Object.assign({},a.__children),this.recursiveSet(a.__children,a,_,a.__children)),a.__listeners){_[a.__node.tag]=Object.assign({},a.__listeners);for(let l in a.__listeners){let c=a.__listeners[l],h=l;a[l]&&(delete _[a.__node.tag][l],h=a.__node.tag+"."+l,_[a.__node.tag][h]=c),typeof c=="string"&&(a.__children?.[c]?_[a.__node.tag][h]=a.__node.tag+"."+c:t instanceof u&&(t.__node.tag===c||t.__node.tag.includes(".")&&t.__node.tag.split(".").pop()===c)&&(_[a.__node.tag][h]=t.__node.tag))}}a.__callConnected()}}}return _};this.remove=(e,t=!0)=>{if(this.unsubscribe(e),typeof e=="string"&&(e=this.get(e)),e instanceof u){this.delete(e.__node.tag),delete this.__node.roots[e.__node.tag],t&&this.clearListeners(e),e.__callDisconnected();let _=i=>{for(let n in i)this.unsubscribe(i[n]),this.delete(i[n].__node.tag),delete this.__node.roots[i[n].__node.tag],this.delete(n),delete this.__node.roots[n],i[n].__node.tag=i[n].__node.tag.substring(i[n].__node.tag.lastIndexOf(".")+1),t&&this.clearListeners(i[n]),console.log(n,i[n].__listeners),i[n].__callDisconnected(),i[n].__children&&_(i[n].__children)};e.__children&&_(e.__children)}return e?.__node.tag&&e?.__parent&&(delete e?.__parent,e.__node.tag=e.__node.tag.substring(e.__node.tag.indexOf(".")+1)),e};this.run=(e,...t)=>{if(typeof e=="string"){let _=this.get(e);if(!_&&e.includes(".")){if(_=this.get(e.substring(0,e.lastIndexOf("."))),typeof _?.[e.substring(e.lastIndexOf(".")+1)]=="function")return _[e.substring(e.lastIndexOf(".")+1)](...t)}else if(_?.__operator)return _.__operator(...t)}if(e?.__operator)return e?.__operator(...t)};this.setListeners=e=>{for(let t in e){let _=this.get(t);if(typeof e[t]=="object")for(let i in e[t]){let n=this.get(i),o;if(typeof e[t][i]!="object")e[t][i]={__callback:e[t][i]};else if(!e[t][i].__callback)for(let r in e[t][i]){typeof e[t][i][r]!="object"&&(e[t][i][r]={__callback:e[t][i][r]},(e[t][i][r].__callback===!0||typeof e[t][i][r].__callback>"u")&&(e[t][i][r].__callback=_.__operator));let f=this.get(r);if(f)if(f)o=this.subscribe(f,e[t][i][r].__callback,e[t][i].__args,void 0,e[t][i].inputState,t,i),typeof _.__listeners[i][r]!="object"&&(_.__listeners[i][r]={__callback:e[t][i][r].__callback,inputState:e[t][i][r]?.inputState}),_.__listeners[i][r].sub=o;else{let a=i.substring(0,i.lastIndexOf("."));f=this.get(a),n&&(o=this.subscribe(f,e[t][i][r].__callback,e[t][i][r].__args,i.substring(i.lastIndexOf(".")+1),e[t][i][r].inputState,t,i),typeof _.__listeners[i][r]!="object"&&(_.__listeners[i][r]={__callback:e[t][i][r].__callback,inputState:e[t][i][r]?.inputState}),_.__listeners[i][r].sub=o)}}if("__callback"in e[t][i])if((e[t][i].__callback===!0||typeof e[t][i].__callback>"u")&&(e[t][i].__callback=_.__operator),typeof e[t][i].__callback=="function"&&(e[t][i].__callback=e[t][i].__callback.bind(_)),typeof _.__listeners!="object"&&(_.__listeners={}),n)o=this.subscribe(n,e[t][i].__callback,e[t][i].__args,void 0,e[t][i].inputState,t,i),typeof _.__listeners[i]!="object"&&(_.__listeners[i]={__callback:e[t][i].__callback,inputState:e[t][i]?.inputState}),_.__listeners[i].sub=o;else{let r=i.substring(0,i.lastIndexOf("."));n=this.get(r),n&&(o=this.subscribe(n,e[t][i].__callback,e[t][i].__args,i.substring(i.lastIndexOf(".")+1),e[t][i].inputState,t,i),typeof _.__listeners[i]!="object"&&(_.__listeners[i]={__callback:e[t][i].__callback,inputState:e[t][i]?.inputState}),_.__listeners[i].sub=o)}}}};this.clearListeners=(e,t)=>{if(typeof e=="string"&&(e=this.get(e)),e?.__listeners)for(let _ in e.__listeners){if(t&&_!==t||typeof e.__listeners[_]?.sub!="number")continue;let i=this.get(_);if(i)if(typeof!e.__listeners[_]?.__callback=="number")for(let n in e.__listeners[_])e.__listeners[_][n]?.sub&&(this.unsubscribe(i,e.__listeners[_][n].sub,void 0,e.__listeners[_][n].inputState),e.__listeners[_][n].sub=void 0);else typeof e.__listeners[_]?.sub=="number"&&(this.unsubscribe(i,e.__listeners[_].sub,void 0,e.__listeners[_].inputState),e.__listeners[_].sub=void 0);else if(i=this.get(_.substring(0,_.lastIndexOf("."))),i)if(typeof e.__listeners[_]=="object"&&!e.__listeners[_]?.__callback)for(let n in e.__listeners[_])typeof e.__listeners[_][n]?.sub=="number"&&(this.unsubscribe(i,e.__listeners[_][n].sub,_.substring(_.lastIndexOf(".")+1),e.__listeners[_][n].inputState),e.__listeners[_][n].sub=void 0);else typeof e.__listeners[_]?.sub=="number"&&(this.unsubscribe(i,e.__listeners[_].sub,_.substring(_.lastIndexOf(".")+1),e.__listeners[_].inputState),e.__listeners[_].sub=void 0)}};this.get=e=>this.__node.nodes.get(e);this.set=(e,t)=>this.__node.nodes.set(e,t);this.delete=e=>this.__node.nodes.delete(e);this.getProps=(e,t)=>{if(typeof e=="string"&&(e=this.get(e)),e instanceof u){let _;if(t)_=Object.assign({},this.__node.roots[e.__node.tag]);else{_=Object.assign({},e);for(let i in _)i.includes("__")&&delete _[i]}}};this.subscribe=(e,t,_,i,n,o,r)=>{let f=e;typeof e=="string"&&(f=this.get(e),!f&&e.includes(".")&&(f=this.get(e.substring(0,e.lastIndexOf("."))),i=e.substring(e.lastIndexOf(".")+1)));let a;if(o instanceof u&&(o=o.__node.tag),typeof t=="string"){let d=t,l=c=>{if(this.get(c)?.__operator){let h=this.get(c);c=function(...g){return h.__operator(...g)}}else if(c.includes(".")){let h=this.get(c.substring(0,c.lastIndexOf("."))),g=c.substring(c.lastIndexOf(".")+1);typeof h[g]=="function"?h[g]instanceof u?c=h[g]:c=function(...b){return h[g](...b)}:c=function(b){return h[g]=b,h[g]}}return c};if(o){let c=this.get(o);typeof c?.[t]=="function"?t=function(...h){return c[d](...h)}:c[d]?c[d]instanceof u?t=c[d]:t=function(h){return c[d]=h,c[d]}:t=l(t)}else t=l(t)}if((typeof t=="function"||t instanceof u)&&_&&(t instanceof u&&t.__operator&&(t=function(d){return t.__operator(d)}),t=G(t,_,this)),f instanceof u){a=f.__subscribe(t,i,n,o,r);let d=()=>{f.__unsubscribe(a,i,n)};f.__addOndisconnected(d)}else if(typeof e=="string")if(this.get(e))if(t instanceof u&&t.__operator){a=this.get(e).__subscribe(t.__operator,i,n,o,r);let d=()=>{this.get(e).__unsubscribe(a)};t.__addOndisconnected(d)}else(typeof t=="function"||typeof t=="string")&&(a=this.get(e).__subscribe(t,i,n,o,r),this.__node.state.getEvent(this.get(e).__node.unique,a).source=e);else typeof t=="string"&&(t=this.__node.nodes.get(t).__operator),typeof t=="function"&&(a=this.__node.state.subscribeEvent(e,t));return a};this.unsubscribe=(e,t,_,i)=>e instanceof u?e.__unsubscribe(t,_,i):this.get(e)?.__unsubscribe(t,_,i);this.setState=e=>{this.__node.state.setState(e)};this.init(e)}};function O(s,e){for(let t in e)e[t]?.constructor.name==="Object"&&!Array.isArray(e[t])?s[t]?.constructor.name==="Object"&&!Array.isArray(s[t])?O(s[t],e[t]):s[t]=O({},e[t]):s[t]=e[t];return s}function j(s){var e=[],t=s;do{var _=Object.getOwnPropertyNames(t);let i=function(n){e.indexOf(n)===-1&&e.push(n)};_.forEach(i)}while(t=Object.getPrototypeOf(t));return e}function I(s){let e=j(s),t={};for(let _ of e)t[_]=s[_];return t}function m(s){return typeof s=="function"&&s.hasOwnProperty("prototype")&&!s.hasOwnProperty("arguments")}var G=(s,e,t)=>{let _=[],i=r=>{if(t.get(r)?.__operator){let f=t.get(r);return(...a)=>{f.__operator(...a)}}else if(r.includes(".")){let f=r.split("."),a=f.pop(),d=f.join("."),l=t.get(d);return typeof t.get(d)?.[a]=="function"?(...c)=>l[a](...c):()=>l[a]}else if(t.get(r)){let f=t.get(r);return()=>f}else{let f=r;return()=>f}},n=(r,f)=>{if(r==="__output")_[f]=a=>a;else if(typeof r=="string")_[f]=i(r);else if(typeof r=="function"){let a=r;_[f]=(...d)=>a(...d)}else if(typeof r=="object"&&r.__input){let a=function(d){let l=d.__input;if(typeof d.__input=="string"&&(l=i(d.__input)),d.__args&&(l=G(l,d.__args,t)),d.__output){let c=d.__output;if(typeof d.__output=="string"?c=i(c):typeof r.__output=="object"&&(c=a(c)),typeof c=="function"){let h=l;l=(...g)=>c(h(...g))}}return l};_[f]=a(r)}else{let a=r;_[f]=()=>a}};e.forEach(n),typeof s=="string"&&(s=i(s));let o=s;return s=function(...r){let f=a=>a(...r);return o(..._.map(f))},s};var x=(s,e,t)=>{s.__node.backward&&e instanceof u&&t.setListeners({[e.__node.tag]:{[s.__node.tag]:e}})},S=(s,e,t)=>{if(s.__operator&&!s.__node.looperSet){if(typeof s.__node.delay=="number"){let _=s.__operator;s.__setOperator((...i)=>new Promise((n,o)=>{setTimeout(async()=>{n(await _(...i))},s.__node.delay)}))}else if(s.__node.frame===!0){let _=s.__operator;s.__setOperator((...i)=>new Promise((n,o)=>{requestAnimationFrame(async()=>{n(await _(...i))})}))}if(typeof s.__node.repeat=="number"||typeof s.__node.recursive=="number"){let _=s.__operator;s.__setOperator(async(...i)=>{let n=s.__node.repeat?s.__node.repeat:s.__node.recursive,o,r=async(f,...a)=>{for(;f>0;){if(s.__node.delay||s.__node.frame){_(...a).then(async d=>{s.__node.recursive?await r(f,d):await r(f,...a)});break}else o=await _(...i);f--}};return await r(n,...i),o})}if(s.__node.loop&&typeof s.__node.loop=="number"){s.__node.looperSet=!0;let _=s.__operator;s.__setOperator((...n)=>{"looping"in s.__node||(s.__node.looping=!0),s.__node.looping&&(_(...n),setTimeout(()=>{s.__operator(...n)},s.__node.loop))}),s.__node.looping&&s.__operator();let i=n=>{n.__node.looping&&(n.__node.looping=!1)};s.__addOndisconnected(i)}}},P=(s,e,t)=>{if(s.__node.animate===!0||s.__animation){let _=s.__operator;s.__setOperator((...n)=>{"animating"in s.__node||(s.__node.animating=!0),s.__node.animating&&(typeof s.__animation=="function"?s.__animation(...n):_(...n),requestAnimationFrame(()=>{s.__operator(...n)}))}),(s.__node.animating||(!("animating"in s.__node)||s.__node.animating)&&s.__animation)&&setTimeout(()=>{requestAnimationFrame(s.__operator)},10);let i=n=>{n.__node.animating&&(n.__node.animating=!1)};s.__addOndisconnected(i)}},w=(s,e,t)=>{if(typeof s.__branch=="object"&&s.__operator&&!s.__branchApplied){let _=s.__operator;s.__branchApplied=!0,s.__operator=(...i)=>{let n=_(...i);for(let o in s.__branch){let r=()=>{typeof s.__branch[o].then=="function"?s.__branch[o].then(n):s.__branch[o].then instanceof u&&s.__branch[o].then.__operator?s.__branch[o].then.__operator(n):n=s.__branch[o].then};typeof s.__branch[o].if=="function"?s.__branch[o].if(n)==!0&&r():s.__branch[o].if===n&&r()}return n}}if(s.__listeners){for(let _ in s.__listeners)if(typeof s.__listeners[_]=="object"&&s.__listeners[_].branch&&!s.__listeners[_].branchApplied){let i=s.__listeners[_].callback;s.__listeners[_].branchApplied=!0,s.__listeners.callback=n=>{let o=()=>{typeof s.__listeners[_].branch.then=="function"?n=s.__listeners[_].branch.then(n):s.__listeners[_].branch.then instanceof u&&s.__listeners[_].branch.then.__operator?n=s.__listeners[_].branch.then.__operator(n):n=s.__listeners[_].branch.then};return typeof s.__listeners[_].branch.if=="function"?s.__listeners[_].branch.if(n)&&o():s.__listeners[_].branch.if===n&&o(),i(n)}}}},A=(s,e,t)=>{if(s.__listeners)for(let _ in s.__listeners)typeof s.__listeners[_]=="object"&&s.__listeners[_].oncreate&&s.__listeners[_].callback(s.__listeners[_].oncreate)},q=(s,e,t)=>{if(s.__listeners)for(let _ in s.__listeners)typeof s.__listeners[_]=="object"&&typeof s.__listeners[_].binding=="object"&&(s.__listeners.callback=s.__listeners.callback.bind(s.__listeners[_].binding))},L=(s,e,t)=>{if(s.__listeners){for(let _ in s.__listeners)if(typeof s.__listeners[_]=="object"&&typeof s.__listeners[_].transform=="function"&&!s.__listeners[_].transformApplied){let i=s.__listeners[_].callback;s.__listeners[_].transformApplied=!0,s.__listeners.callback=n=>(n=s.__listeners[_].transform(n),i(n))}}},F=(s,e,t)=>{s.post&&!s.__operator?s.__setOperator(s.post):!s.__operator&&typeof s.get=="function"&&s.__setOperator(s.get),!s.get&&s.__operator&&(s.get=s.__operator),s.aliases&&s.aliases.forEach(_=>{t.set(_,s);let i=n=>{t.__node.nodes.delete(_)};s.__addOndisconnected(i)}),typeof t.__node.roots?.[s.__node.tag]=="object"&&s.get&&(t.__node.roots[s.__node.tag].get=s.get)},D={backprop:x,loop:S,animate:P,branching:w,triggerListenerOncreate:A,bindListener:q,transformListenerResult:L,substitute__operator:F};export{y as Graph,u as GraphNode,P as animate,x as backprop,q as bindListener,w as branching,j as getAllProperties,I as instanceObject,m as isNativeClass,D as loaders,S as loop,N as state,F as substitute__operator,L as transformListenerResult,A as triggerListenerOncreate,G as wrapArgs};
