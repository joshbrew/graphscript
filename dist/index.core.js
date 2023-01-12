(()=>{var p=class{constructor(e){this.pushToState={};this.data={};this.triggers={};this.setState=e=>{Object.assign(this.data,e);let t=Object.getOwnPropertyNames(e);for(let _ of t)if(this.triggers[_]){let n=i=>{i.onchange(this.data[_])};this.triggers[_].forEach(n)}return this.data};this.setValue=(e,t)=>{this.data[e]=t,this.triggerEvent(e,t)};this.triggerEvent=(e,t)=>{if(this.triggers[e]){let _=n=>{n.onchange(t)};this.triggers[e].forEach(_)}};this.subscribeEvent=(e,t,_,n)=>{if(e){_&&n&&!this.triggers[e]&&Object.defineProperty(this.data,e,{get:()=>_[n],set:o=>{_[n]=o},enumerable:!0,configurable:!0}),this.triggers[e]||(this.triggers[e]=[]);let i=this.triggers[e].length;return this.triggers[e].push({sub:i,onchange:t}),this.triggers[e].length-1}else return};this.unsubscribeEvent=(e,t)=>{let _=this.triggers[e];if(_)if(!t)delete this.triggers[e],delete this.data[e];else{let n,i=_.find((o,r)=>{if(o.sub===n)return n=r,!0});return i&&_.splice(n,1),Object.keys(_).length===0&&(delete this.triggers[e],delete this.data[e]),this.onRemoved&&this.onRemoved(i),!0}};this.subscribeEventOnce=(e,t)=>{let _,n=i=>{t(i),this.unsubscribeEvent(e,_)};_=this.subscribeEvent(e,n)};this.getEvent=(e,t)=>{for(let _ in this.triggers[e])if(this.triggers[e][_].sub===t)return this.triggers[e][_]};this.getSnapshot=()=>{let e={};for(let t in this.data)e[t]=this.data[t]};typeof e=="object"&&(this.data=e)}};var N=new p,h=class{constructor(e,t,_){this.__node={tag:`node${Math.floor(Math.random()*1e15)}`,unique:`${Math.floor(Math.random()*1e15)}`,state:N};this.__setProperties=(e,t,_)=>{if((()=>{let i=e;typeof e=="function"?m(e)?e=new e:e={__operator:e,__node:{forward:!0,tag:e.name}}:typeof e=="string"&&_?.get(e)&&(e=_.get(e)),e.__node.initial||(e.__node.initial=i)})(),typeof e=="object"){let i=()=>{e.__node?.state&&(this.__node.state=e.__node.state)},o=()=>{e.__props&&(typeof e.__props=="function"&&(e.__props=new e.__props),typeof e.__props=="object"&&this.__proxyObject(e.__props))},r=()=>{e.__node.tag||(e.__operator?.name?e.__node.tag=e.__operator.name:e.__node.tag=`node${Math.floor(Math.random()*1e15)}`)},l=()=>{typeof e.__node=="string"?_?.get(e.__node.tag)?e=_.get(e.__node.tag):e.__node={}:e.__node||(e.__node={}),_&&(e.__node.graph=_),e instanceof y&&(e.__node.source=e)},a=()=>{if(!e.__parent&&t&&(e.__parent=t),t?.__node&&!(t instanceof y||e instanceof y)&&(e.__node.tag=t.__node.tag+"."+e.__node.tag),t instanceof y&&e instanceof y&&(e.__node.loaders&&Object.assign(t.__node.loaders?t.__node.loaders:{},e.__node.loaders),t.__node.mapGraphs)){e.__node.nodes.forEach(u=>{t.set(e.__node.tag+"."+u.__node.tag,u)});let f=()=>{e.__node.nodes.forEach(u=>{t.__node.nodes.delete(e.__node.tag+"."+u.__node.tag)})};this.__addOndisconnected(f)}},c=()=>{if(typeof e.default=="function"&&!e.__operator&&(e.__operator=e.default),e.__operator){if(typeof e.__operator=="string"&&_){let f=_.get(e.__operator);f&&(e.__operator=f.__operator),!e.__node.tag&&e.__operator.name&&(e.__node.tag=e.__operator.name)}typeof e.__operator=="function"&&(e.__operator=this.__setOperator(e.__operator)),e.default&&(e.default=e.__operator)}},d=()=>{e.__node=Object.assign(this.__node,e.__node);let f=Object.getOwnPropertyNames(e);for(let u of f)this[u]=e[u]};i(),r(),o(),l(),a(),d(),c()}};this.__subscribe=(e,t,_,n,i)=>{let o=(l,a=(d,f)=>d,c=e)=>{let d=this.__node.state.subscribeEvent(l,c,this,t),f=this.__node.state.getEvent(l,d);return f.source=this.__node.tag,t&&(f.key=t),f.target=a(e),n&&(f.bound=n),d},r=l=>{if(!this.__node.graph.get(l)&&l.includes(".")){let c=this.__node.graph.get(l.substring(0,l.lastIndexOf("."))),d=l.substring(l.lastIndexOf(".")+1);c&&typeof c[d]=="function"&&(l=(...f)=>c[d](...f))}};if(t){if((!this.__node.localState||!this.__node.localState[t])&&this.__addLocalState(this,t),typeof e=="string"){if(i){if(this.__node.graph?.get(i)){let c=this.__node.graph?.get(i);if(typeof c[e]=="function"){let d=c[e];e=(...f)=>{d(...f)}}else{let d=e;e=u=>{c[d]=u}}}}else if(typeof this[e]=="function"){let c=this[e];e=(...d)=>{c(...d)}}else this.__node.graph?.get(e)&&r(e);if(typeof e!="function")return}let l,a=_?this.__node.unique+"."+t+"input":this.__node.unique+"."+t;return typeof e=="function"?l=o(a):e?.__node&&(l=o(a,(c,d)=>d||c.__node.unique,(...c)=>{e.__operator&&e.__operator(...c)})),l}else{if(typeof e=="string"&&(this.__node.graph.get(e)&&(e=this.__node.graph.get(e)),typeof e!="object"))return;let l,a=_?this.__node.unique+"input":this.__node.unique;return typeof e=="function"?l=o(a):e?.__node&&(l=o(a,(c,d)=>d||c.__node.unique,(...c)=>{e.__operator&&e.__operator(...c)})),l}};this.__unsubscribe=(e,t,_)=>t?this.__node.state.unsubscribeEvent(_?this.__node.unique+"."+t+"input":this.__node.unique+"."+t,e):this.__node.state.unsubscribeEvent(_?this.__node.unique+"input":this.__node.unique,e);this.__setOperator=e=>{e=e.bind(this),this.__args&&this.__node.graph&&(e=G(e,this.__args,this.__node.graph));let t=`${this.__node.unique}input`;if(this.__operator=(..._)=>{this.__node.state.triggers[t]&&this.__node.state.setValue(t,_);let n=e(..._);return this.__node.state.triggers[this.__node.unique]&&(typeof n?.then=="function"?n.then(i=>{i!==void 0&&this.__node.state.setValue(this.__node.unique,i)}).catch(console.error):n!==void 0&&this.__node.state.setValue(this.__node.unique,n)),n},this.__parent instanceof h&&!this.__subscribedToParent&&this.__parent.__operator){let _=this.__parent.__subscribe(this),n=()=>{this.__parent?.__unsubscribe(_),delete this.__subscribedToParent};this.__addOndisconnected(n),this.__subscribedToParent=!0}return this.__operator};this.__addLocalState=(e,t)=>{if(!e)return;this.__node.localState||(this.__node.localState={});let _=this.__node.localState,n=(i,o)=>{let r=this.__node.unique+"."+o,l=`${r}input`;if(typeof i[o]=="function"&&o!=="__operator"){let a=i[o].bind(this);i[o]=(...c)=>{this.__node.state.triggers[l]&&this.__node.state.setValue(l,c);let d=a(...c);return this.__node.state.triggers[r]&&(typeof d?.then=="function"?d.then(f=>{this.__node.state.triggerEvent(r,f)}).catch(console.error):this.__node.state.triggerEvent(r,d)),d}}else{let a,c;this.__props?.[o]?(a=()=>this.__props[o],c=f=>{this.__props[o]=f,this.__node.state.triggers[r]&&this.__node.state.triggerEvent(r,f)}):(_[o]=i[o],a=()=>_[o],c=f=>{_[o]=f,this.__node.state.triggers[r]&&this.__node.state.triggerEvent(r,f)});let d={get:a,set:c,enumerable:!0,configurable:!0};if(Object.defineProperty(i,o,d),typeof this.__node.initial=="object"){let f=Object.getOwnPropertyDescriptor(this.__node.initial,o);(f===void 0||f?.configurable)&&Object.defineProperty(this.__node.initial,o,d)}}};if(t)n(e,t);else for(let i in e)n(e,i)};this.__proxyObject=e=>{let t=j(e);for(let _ of t)typeof e[_]=="function"?this[_]=(...n)=>e[_](...n):Object.defineProperty(this,_,{get:()=>e[_],set:i=>{e[_]=i},enumerable:!0,configurable:!0})};this.__setProperties(e,t,_)}__addOnconnected(e){Array.isArray(this.__onconnected)?this.__onconnected.push(e):typeof this.__onconnected=="function"?this.__onconnected=[e,this.__onconnected]:this.__onconnected=e}__addOndisconnected(e){Array.isArray(this.__ondisconnected)?this.__ondisconnected.push(e):typeof this.__ondisconnected=="function"?this.__ondisconnected=[e,this.__ondisconnected]:this.__ondisconnected=e}__callConnected(e=this){if(typeof this.__onconnected=="function")this.__onconnected(this);else if(Array.isArray(this.__onconnected)){let t=_=>{_(this)};this.__onconnected.forEach(t)}}__callDisconnected(e=this){if(typeof this.__ondisconnected=="function")this.__ondisconnected(this);else if(Array.isArray(this.__ondisconnected)){let t=_=>{_(this)};this.__ondisconnected.forEach(t)}}},y=class{constructor(e){this.__node={tag:`graph${Math.floor(Math.random()*1e15)}`,unique:`${Math.random()}`,nodes:new Map,state:N,roots:{}};this.init=e=>{if(e){let t=Object.assign({},e);delete t.roots,O(this.__node,t),e.roots&&this.load(e.roots)}};this.load=e=>{function t(i,o,r=!0,l=!0){if(l&&(i?Object.assign(i,o):i=Object.assign({},o),t(i,o,!0,!1)),o.__children&&!r)o.__children?.constructor.name==="Object"?i.__children?.constructor.name==="Object"?t(i.__children,o.__children,!0,!1):i.__children=t({},o.__children,!0,!1):i.__children=o.__children;else if(r)for(let a in o)i[a]=Object.assign({},o[a]),o[a].__children&&t({},o[a].__children,!1,!1);return i}this.__node.roots=t(this.__node.roots?this.__node.roots:{},e);let _=Object.assign({},e);_.__node&&delete _.__node;let n=this.recursiveSet(_,this,void 0,e);if(e.__node){if(!e.__node.tag)e.__node._tag=`roots${Math.floor(Math.random()*1e15)}`;else if(!this.get(e.__node.tag)){let i=new h(e,this,this);this.set(i.__node.tag,i),this.runLoaders(i,this,e,e.__node.tag),i.__listeners&&(n[i.__node.tag]=i.__listeners)}}else e.__listeners&&this.setListeners(e.__listeners);return this.setListeners(n),_};this.setLoaders=(e,t)=>(t?this.__node.loaders=e:Object.assign(this.__node.loaders,e),this.__node.loaders);this.runLoaders=(e,t,_,n)=>{for(let i in this.__node.loaders)typeof this.__node.loaders[i]=="object"?(this.__node.loaders[i].init&&this.__node.loaders[i](e,t,this,this.__node.roots,_,n),this.__node.loaders[i].connected&&e.__addOnconnected(this.__node.loaders[i].connect),this.__node.loaders[i].disconnected&&e.__addOndisconnected(this.__node.loaders[i].disconnect)):typeof this.__node.loaders[i]=="function"&&this.__node.loaders[i](e,t,this,this.__node.roots,_,n)};this.add=(e,t)=>{let _={};typeof t=="string"&&(t=this.get(t));let n;if(typeof e=="function"?m(e)?e.prototype instanceof h?(e=e.prototype.constructor(e,t,this),n=!0):e=new e:e={__operator:e}:typeof e=="string"&&(e=this.__node.roots[e]),!!e){if(!n){let i=Object.getOwnPropertyNames(e),o={};for(let r of i)o[r]=e[r];e=o}if(e.__node||(e.__node={}),e.__node.initial=e,typeof e=="object"&&(!e?.__node?.tag||!this.get(e.__node.tag))){let i;if(n?i=e:i=new h(e,t,this),this.set(i.__node.tag,i),this.runLoaders(i,t,e,i.__node.tag),this.__node.roots[i.__node.tag]=e,i.__children&&(i.__children=Object.assign({},i.__children),this.recursiveSet(i.__children,i,_,i.__children)),i.__listeners){_[i.__node.tag]=Object.assign({},i.__listeners);for(let o in i.__listeners){let r=i.__listeners[o];i[o]&&(delete _[i.__node.tag][o],_[i.__node.tag][i.__node.tag+"."+o]=r),typeof r=="string"&&(i.__children?.[r]?_[i.__node.tag][o]=i.__node.tag+"."+r:t instanceof h&&(t.__node.tag===r||t.__node.tag.includes(".")&&t.__node.tag.split(".").pop()===r)&&(_[i.__node.tag][o]=t.__node.tag))}}return this.setListeners(_),i.__callConnected(),i}}};this.recursiveSet=(e,t,_={},n)=>{let i=Object.getOwnPropertyNames(n);for(let o of i){if(o.includes("__"))continue;let r=n[o];if(Array.isArray(r))continue;let l;if(typeof r=="function"?m(r)?(r=new r,r instanceof h&&(r=r.prototype.constructor(r,t,this),l=!0)):r={__operator:r}:typeof r=="string"?this.__node.nodes.get(r)?r=this.__node.nodes.get(r):r=this.__node.roots[r]:typeof r=="boolean"&&(this.__node.nodes.get(o)?r=this.__node.nodes.get(o):r=this.__node.roots[o]),typeof r=="object"){if(!l&&!(r instanceof h)){let d=Object.getOwnPropertyNames(r),f={};for(let u of d)f[u]=r[u];r=f}if(r.__node||(r.__node={}),r.__node.tag||(r.__node.tag=o),r.__node.initial||(r.__node.initial=e[o]),this.get(r.__node.tag)&&!(!(t instanceof y)&&t?.__node)||t?.__node&&this.get(t.__node.tag+"."+r.__node.tag))continue;let a,c=!1;if(l||r instanceof h?a=r:(a=new h(r,t,this),c=!0),!c&&r instanceof h&&!l&&t instanceof h){let d=this.subscribe(t.__node.tag,a.__node.tag),f=u=>{this.unsubscribe(t.__node.tag,d)};a.__addOndisconnected(f)}else{if(this.set(a.__node.tag,a),this.runLoaders(a,t,e[o],o),e[o]=a,this.__node.roots[a.__node.tag]=r,a.__children&&(a.__children=Object.assign({},a.__children),this.recursiveSet(a.__children,a,_,a.__children)),a.__listeners){_[a.__node.tag]=Object.assign({},a.__listeners);for(let d in a.__listeners){let f=a.__listeners[d],u=d;a[d]&&(delete _[a.__node.tag][d],u=a.__node.tag+"."+d,_[a.__node.tag][u]=f),typeof f=="string"&&(a.__children?.[f]?_[a.__node.tag][u]=a.__node.tag+"."+f:t instanceof h&&(t.__node.tag===f||t.__node.tag.includes(".")&&t.__node.tag.split(".").pop()===f)&&(_[a.__node.tag][u]=t.__node.tag))}}a.__callConnected()}}}return _};this.remove=(e,t=!0)=>{if(this.unsubscribe(e),typeof e=="string"&&(e=this.get(e)),e instanceof h){this.delete(e.__node.tag),delete this.__node.roots[e.__node.tag],t&&this.clearListeners(e),e.__callDisconnected();let _=n=>{for(let i in n)this.unsubscribe(n[i]),this.delete(n[i].__node.tag),delete this.__node.roots[n[i].__node.tag],this.delete(i),delete this.__node.roots[i],n[i].__node.tag=n[i].__node.tag.substring(n[i].__node.tag.lastIndexOf(".")+1),t&&this.clearListeners(n[i]),n[i].__callDisconnected(),n[i].__children&&_(n[i].__children)};e.__children&&_(e.__children)}return e?.__node.tag&&e?.__parent&&(delete e?.__parent,e.__node.tag=e.__node.tag.substring(e.__node.tag.indexOf(".")+1)),e};this.run=(e,...t)=>{if(typeof e=="string"){let _=this.get(e);if(!_&&e.includes(".")){if(_=this.get(e.substring(0,e.lastIndexOf("."))),typeof _?.[e.substring(e.lastIndexOf(".")+1)]=="function")return _[e.substring(e.lastIndexOf(".")+1)](...t)}else if(_?.__operator)return _.__operator(...t)}if(e?.__operator)return e?.__operator(...t)};this.setListeners=e=>{for(let t in e){let _=this.get(t);if(typeof e[t]=="object")for(let n in e[t]){let i=this.get(n),o;if(typeof e[t][n]!="object")e[t][n]={__callback:e[t][n]};else if(!e[t][n].__callback)for(let r in e[t][n]){typeof e[t][n][r]!="object"&&(e[t][n][r]={__callback:e[t][n][r]},(e[t][n][r].__callback===!0||typeof e[t][n][r].__callback>"u")&&(e[t][n][r].__callback=_.__operator));let l=this.get(r);if(l)if(l)o=this.subscribe(l,e[t][n][r].__callback,e[t][n].__args,void 0,e[t][n].inputState,t,n),typeof _.__listeners[n][r]!="object"&&(_.__listeners[n][r]={__callback:e[t][n][r].__callback,inputState:e[t][n][r]?.inputState}),_.__listeners[n][r].sub=o;else{let a=n.substring(0,n.lastIndexOf("."));l=this.get(a),i&&(o=this.subscribe(l,e[t][n][r].__callback,e[t][n][r].__args,n.substring(n.lastIndexOf(".")+1),e[t][n][r].inputState,t,n),typeof _.__listeners[n][r]!="object"&&(_.__listeners[n][r]={__callback:e[t][n][r].__callback,inputState:e[t][n][r]?.inputState}),_.__listeners[n][r].sub=o)}}if("__callback"in e[t][n])if((e[t][n].__callback===!0||typeof e[t][n].__callback>"u")&&(e[t][n].__callback=_.__operator),typeof e[t][n].__callback=="function"&&(e[t][n].__callback=e[t][n].__callback.bind(_)),typeof _.__listeners!="object"&&(_.__listeners={}),i)o=this.subscribe(i,e[t][n].__callback,e[t][n].__args,void 0,e[t][n].inputState,t,n),typeof _.__listeners[n]!="object"&&(_.__listeners[n]={__callback:e[t][n].__callback,inputState:e[t][n]?.inputState}),_.__listeners[n].sub=o;else{let r=n.substring(0,n.lastIndexOf("."));i=this.get(r),i&&(o=this.subscribe(i,e[t][n].__callback,e[t][n].__args,n.substring(n.lastIndexOf(".")+1),e[t][n].inputState,t,n),typeof _.__listeners[n]!="object"&&(_.__listeners[n]={__callback:e[t][n].__callback,inputState:e[t][n]?.inputState}),_.__listeners[n].sub=o)}}}};this.clearListeners=(e,t)=>{if(typeof e=="string"&&(e=this.get(e)),e?.__listeners)for(let _ in e.__listeners){if(t&&_!==t||typeof e.__listeners[_]?.sub!="number")continue;let n=this.get(_);if(n)if(e.__listeners[_]?.__callback)e.__listeners[_]?.sub&&(this.unsubscribe(n,e.__listeners[_].sub,void 0,e.__listeners[_].inputState),e.__listeners[_].sub=void 0);else for(let i in e.__listeners[_])e.__listeners[_][i]?.sub&&(this.unsubscribe(n,e.__listeners[_][i].sub,void 0,e.__listeners[_][i].inputState),e.__listeners[_][i].sub=void 0);else if(n=this.get(_.substring(0,_.lastIndexOf("."))),n)if(e.__listeners[_]?.__callback)e.__listeners[_]?.sub&&(this.unsubscribe(n,e.__listeners[_].sub,_.substring(_.lastIndexOf(".")+1),e.__listeners[_].inputState),e.__listeners[_].sub=void 0);else for(let i in e.__listeners[_])e.__listeners[_][i]?.sub&&(this.unsubscribe(n,e.__listeners[_][i].sub,_.substring(_.lastIndexOf(".")+1),e.__listeners[_][i].inputState),e.__listeners[_][i].sub=void 0)}};this.get=e=>this.__node.nodes.get(e);this.set=(e,t)=>this.__node.nodes.set(e,t);this.delete=e=>this.__node.nodes.delete(e);this.getProps=(e,t)=>{if(typeof e=="string"&&(e=this.get(e)),e instanceof h){let _;if(t)_=Object.assign({},this.__node.roots[e.__node.tag]);else{_=Object.assign({},e);for(let n in _)n.includes("__")&&delete _[n]}}};this.subscribe=(e,t,_,n,i,o,r)=>{let l=e;typeof e=="string"&&(l=this.get(e),!l&&e.includes(".")&&(l=this.get(e.substring(0,e.lastIndexOf("."))),n=e.substring(e.lastIndexOf(".")+1)));let a;if(o instanceof h&&(o=o.__node.tag),typeof t=="string"){let c=t,d=f=>{if(this.get(f)?.__operator){let u=this.get(f);f=function(...g){return u.__operator(...g)}}else if(f.includes(".")){let u=this.get(f.substring(0,f.lastIndexOf("."))),g=f.substring(f.lastIndexOf(".")+1);typeof u[g]=="function"?u[g]instanceof h?f=u[g]:f=function(...b){return u[g](...b)}:f=function(b){return u[g]=b,u[g]}}return f};if(o){let f=this.get(o);typeof f?.[t]=="function"?t=function(...u){return f[c](...u)}:f[c]?f[c]instanceof h?t=f[c]:t=function(u){return f[c]=u,f[c]}:t=d(t)}else t=d(t)}if((typeof t=="function"||t instanceof h)&&_&&(t instanceof h&&t.__operator&&(t=function(c){return t.__operator(c)}),t=G(t,_,this)),l instanceof h){a=l.__subscribe(t,n,i,o,r);let c=()=>{l.__unsubscribe(a,n,i)};l.__addOndisconnected(c)}else if(typeof e=="string")if(this.get(e))if(t instanceof h&&t.__operator){a=this.get(e).__subscribe(t.__operator,n,i,o,r);let c=()=>{this.get(e).__unsubscribe(a)};t.__addOndisconnected(c)}else(typeof t=="function"||typeof t=="string")&&(a=this.get(e).__subscribe(t,n,i,o,r),this.__node.state.getEvent(this.get(e).__node.unique,a).source=e);else typeof t=="string"&&(t=this.__node.nodes.get(t).__operator),typeof t=="function"&&(a=this.__node.state.subscribeEvent(e,t));return a};this.unsubscribe=(e,t,_,n)=>e instanceof h?e.__unsubscribe(t,_,n):this.get(e)?.__unsubscribe(t,_,n);this.setState=e=>{this.__node.state.setState(e)};this.init(e)}};function O(s,e){for(let t in e)e[t]?.constructor.name==="Object"&&!Array.isArray(e[t])?s[t]?.constructor.name==="Object"&&!Array.isArray(s[t])?O(s[t],e[t]):s[t]=O({},e[t]):s[t]=e[t];return s}function j(s){var e=[],t=s;do{var _=Object.getOwnPropertyNames(t);let n=function(i){e.indexOf(i)===-1&&e.push(i)};_.forEach(n)}while(t=Object.getPrototypeOf(t));return e}function I(s){let e=j(s),t={};for(let _ of e)t[_]=s[_];return t}function m(s){return typeof s=="function"&&s.hasOwnProperty("prototype")&&!s.hasOwnProperty("arguments")}var G=(s,e,t)=>{let _=[],n=r=>{if(t.get(r)?.__operator){let l=t.get(r);return(...a)=>{l.__operator(...a)}}else if(r.includes(".")){let l=r.split("."),a=l.pop(),c=l.join("."),d=t.get(c);return typeof t.get(c)?.[a]=="function"?(...f)=>d[a](...f):()=>d[a]}else if(t.get(r)){let l=t.get(r);return()=>l}else{let l=r;return()=>l}},i=(r,l)=>{if(r==="__output")_[l]=a=>a;else if(typeof r=="string")_[l]=n(r);else if(typeof r=="function"){let a=r;_[l]=(...c)=>a(...c)}else if(typeof r=="object"&&r.__input){let a=function(c){let d=c.__input;if(typeof c.__input=="string"&&(d=n(c.__input)),c.__args&&(d=G(d,c.__args,t)),c.__output){let f=c.__output;if(typeof c.__output=="string"?f=n(f):typeof r.__output=="object"&&(f=a(f)),typeof f=="function"){let u=d;d=(...g)=>f(u(...g))}}return d};_[l]=a(r)}else{let a=r;_[l]=()=>a}};e.forEach(i),typeof s=="string"&&(s=n(s));let o=s;return s=function(...r){let l=a=>a(...r);return o(..._.map(l))},s};var x=(s,e,t)=>{s.__node.backward&&e instanceof h&&t.setListeners({[e.__node.tag]:{[s.__node.tag]:e}})},S=(s,e,t)=>{if(s.__operator&&!s.__node.looperSet){if(typeof s.__node.delay=="number"){let _=s.__operator;s.__setOperator((...n)=>new Promise((i,o)=>{setTimeout(async()=>{i(await _(...n))},s.__node.delay)}))}else if(s.__node.frame===!0){let _=s.__operator;s.__setOperator((...n)=>new Promise((i,o)=>{requestAnimationFrame(async()=>{i(await _(...n))})}))}if(typeof s.__node.repeat=="number"||typeof s.__node.recursive=="number"){let _=s.__operator;s.__setOperator(async(...n)=>{let i=s.__node.repeat?s.__node.repeat:s.__node.recursive,o,r=async(l,...a)=>{for(;l>0;){if(s.__node.delay||s.__node.frame){_(...a).then(async c=>{s.__node.recursive?await r(l,c):await r(l,...a)});break}else o=await _(...n);l--}};return await r(i,...n),o})}if(s.__node.loop&&typeof s.__node.loop=="number"){s.__node.looperSet=!0;let _=s.__operator;s.__setOperator((...i)=>{"looping"in s.__node||(s.__node.looping=!0),s.__node.looping&&(_(...i),setTimeout(()=>{s.__operator(...i)},s.__node.loop))}),s.__node.looping&&s.__operator();let n=i=>{i.__node.looping&&(i.__node.looping=!1)};s.__addOndisconnected(n)}}},P=(s,e,t)=>{if(s.__node.animate===!0||s.__animation){let _=s.__operator;s.__setOperator((...i)=>{"animating"in s.__node||(s.__node.animating=!0),s.__node.animating&&(typeof s.__animation=="function"?s.__animation(...i):_(...i),requestAnimationFrame(()=>{s.__operator(...i)}))}),(s.__node.animating||(!("animating"in s.__node)||s.__node.animating)&&s.__animation)&&setTimeout(()=>{requestAnimationFrame(s.__operator)},10);let n=i=>{i.__node.animating&&(i.__node.animating=!1)};s.__addOndisconnected(n)}},w=(s,e,t)=>{if(typeof s.__branch=="object"&&s.__operator&&!s.__branchApplied){let _=s.__operator;s.__branchApplied=!0,s.__operator=(...n)=>{let i=_(...n);for(let o in s.__branch){let r=()=>{typeof s.__branch[o].then=="function"?s.__branch[o].then(i):s.__branch[o].then instanceof h&&s.__branch[o].then.__operator?s.__branch[o].then.__operator(i):i=s.__branch[o].then};typeof s.__branch[o].if=="function"?s.__branch[o].if(i)==!0&&r():s.__branch[o].if===i&&r()}return i}}if(s.__listeners){for(let _ in s.__listeners)if(typeof s.__listeners[_]=="object"&&s.__listeners[_].branch&&!s.__listeners[_].branchApplied){let n=s.__listeners[_].callback;s.__listeners[_].branchApplied=!0,s.__listeners.callback=i=>{let o=()=>{typeof s.__listeners[_].branch.then=="function"?i=s.__listeners[_].branch.then(i):s.__listeners[_].branch.then instanceof h&&s.__listeners[_].branch.then.__operator?i=s.__listeners[_].branch.then.__operator(i):i=s.__listeners[_].branch.then};return typeof s.__listeners[_].branch.if=="function"?s.__listeners[_].branch.if(i)&&o():s.__listeners[_].branch.if===i&&o(),n(i)}}}},A=(s,e,t)=>{if(s.__listeners)for(let _ in s.__listeners)typeof s.__listeners[_]=="object"&&s.__listeners[_].oncreate&&s.__listeners[_].callback(s.__listeners[_].oncreate)},q=(s,e,t)=>{if(s.__listeners)for(let _ in s.__listeners)typeof s.__listeners[_]=="object"&&typeof s.__listeners[_].binding=="object"&&(s.__listeners.callback=s.__listeners.callback.bind(s.__listeners[_].binding))},L=(s,e,t)=>{if(s.__listeners){for(let _ in s.__listeners)if(typeof s.__listeners[_]=="object"&&typeof s.__listeners[_].transform=="function"&&!s.__listeners[_].transformApplied){let n=s.__listeners[_].callback;s.__listeners[_].transformApplied=!0,s.__listeners.callback=i=>(i=s.__listeners[_].transform(i),n(i))}}},k=(s,e,t)=>{s.post&&!s.__operator?s.__setOperator(s.post):!s.__operator&&typeof s.get=="function"&&s.__setOperator(s.get),!s.get&&s.__operator&&(s.get=s.__operator),s.aliases&&s.aliases.forEach(_=>{t.set(_,s);let n=i=>{t.__node.nodes.delete(_)};s.__addOndisconnected(n)}),typeof t.__node.roots?.[s.__node.tag]=="object"&&s.get&&(t.__node.roots[s.__node.tag].get=s.get)},V={backprop:x,loop:S,animate:P,branching:w,triggerListenerOncreate:A,bindListener:q,transformListenerResult:L,substitute__operator:k};})();
