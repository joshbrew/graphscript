(()=>{var g=class{constructor(e){this.pushToState={};this.data={};this.triggers={};this.setState=e=>{Object.assign(this.data,e);for(let n of Object.getOwnPropertyNames(e))this.triggers[n]&&this.triggers[n].forEach(t=>t.onchange(this.data[n]));return this.data};this.setValue=(e,n)=>{this.data[e]=n,this.triggers[e]&&this.triggers[e].forEach(t=>t.onchange(this.data[e]))};this.subscribeTrigger=(e,n)=>{if(e){this.triggers[e]||(this.triggers[e]=[]);let t=this.triggers[e].length;return this.triggers[e].push({sub:t,onchange:n}),this.triggers[e].length-1}else return};this.unsubscribeTrigger=(e,n)=>{let t=this.triggers[e];if(t)if(!n)delete this.triggers[e];else{let _,s=t.find((r,a)=>{if(r.sub===_)return _=a,!0});return s&&t.splice(_,1),this.onRemoved&&this.onRemoved(s),!0}};this.subscribeTriggerOnce=(e,n)=>{let t,_=s=>{n(s),this.unsubscribeTrigger(e,t)};t=this.subscribeTrigger(e,_)};this.getTrigger=(e,n)=>{for(let t in this.triggers[e])if(this.triggers[e][t].sub===n)return this.triggers[e][t]};typeof e=="object"&&(this.data=e)}};var y=new g,h=class{constructor(e,n,t){this.__node={tag:`node${Math.floor(Math.random()*1e15)}`,unique:`${Math.random()}`,state:y};this.__subscribe=(e,n,t,_,s)=>{let r=(o,f=(u,l)=>u,d=e)=>{let u=this.__node.state.subscribeTrigger(o,d),l=this.__node.state.getTrigger(o,u);return l.source=this.__node.tag,n&&(l.key=n),l.target=f(e),_&&(l.bound=_),u},a=o=>{if(!this.__node.graph.get(o)&&o.includes(".")){let d=this.__node.graph.get(o.substring(0,o.lastIndexOf("."))),u=o.substring(o.lastIndexOf(".")+1);d&&typeof d[u]=="function"&&(o=(...l)=>d[u](...l))}};if(n){this.__node.localState||this.__addLocalState(this),typeof e=="string"&&(typeof this[e]=="function"?e=this[e]:this.__node.graph&&a(e));let o,f=t?this.__node.unique+"."+n+"input":this.__node.unique+"."+n;return typeof e=="function"?o=r(f):e?.__node&&(o=r(f,(d,u)=>u||d.__node.unique,d=>{e.__operator&&e.__operator(d)})),o}else{typeof e=="string"&&(this.__node.graph?e=this.__node.graph.get(e):e=this.__node.graph.nodes.get(e));let o,f=t?this.__node.unique+"input":this.__node.unique;return typeof e=="function"?o=r(f):e?.__node&&(o=r(f,(d,u)=>u||d.__node.unique,d=>{e.__operator&&e.__operator(d)})),o}};this.__unsubscribe=(e,n,t)=>n?this.__node.state.unsubscribeTrigger(t?this.__node.unique+"."+n+"input":this.__node.unique+"."+n,e):this.__node.state.unsubscribeTrigger(t?this.__node.unique+"input":this.__node.unique,e);this.__setOperator=e=>(e=e.bind(this),this.__operator=(...n)=>{this.__node.inputState&&this.__node.state.setValue(this.__node.unique+"input",n);let t=e(...n);return this.__node.state.triggers[this.__node.unique]&&(typeof t?.then=="function"?t.then(_=>{_!==void 0&&this.__node.state.setValue(this.__node.unique,_)}).catch(console.error):t!==void 0&&this.__node.state.setValue(this.__node.unique,t)),t},this.__operator);this.__proxyObject=e=>{let n=b(e);for(let t of n)typeof this[t]>"u"&&(typeof e[t]=="function"?this[t]=(..._)=>{this.__node.inputState&&this.__node.state.setValue(this.__node.unique+"."+t+"input",_);let s=e[t](..._);return this.__node.state.triggers[this.__node.unique+"."+t]&&(typeof s?.then=="function"?s.then(r=>{this.__node.state.setValue(this.__node.unique+"."+t,r)}).catch(console.error):this.__node.state.setValue(this.__node.unique+"."+t,s)),s}:Object.defineProperty(this,t,{get:()=>e[t],set:s=>{e[t]=s,this.__node.state.triggers[this.__node.unique+"."+t]&&this.__node.state.setValue(this.__node.unique+"."+t,s)},enumerable:!0,configurable:!0}))};let _=e;if(typeof e=="function"?e={__operator:e,__node:{forward:!0,tag:e.name}}:typeof e=="string"&&t?.get(e)&&(e=t.get(e)),e.__node.initial||(e.__node.initial=_),typeof e=="object"){if(e.__props&&(typeof e.__props=="function"&&(e.__props=new e.__props),typeof e.__props=="object"&&this.__proxyObject(e.__props)),typeof e.__node=="string"?t?.get(e.__node.tag)?e=t.get(e.__node.tag):e.__node={}:e.__node||(e.__node={}),!e.__parent&&n&&(e.__parent=n),t&&(e.__node.graph=t),e.__operator){if(typeof e.__operator=="string"&&t){let r=t.get(e.__operator);r&&(e.__operator=r.__operator),!e.__node.tag&&e.__operator.name&&(e.__node.tag=e.__operator.name)}typeof e.__operator=="function"&&(e.__operator=this.__setOperator(e.__operator))}if(e.__node.tag||(e.__operator?.name?e.__node.tag=e.__operator.name:e.__node.tag=`node${Math.floor(Math.random()*1e15)}`),n?.__node&&!(n instanceof c||e instanceof c)&&(e.__node.tag=n.__node.tag+"."+e.__node.tag),n instanceof c&&e instanceof c&&(e.__node.loaders&&Object.assign(n.__node.loaders?n.__node.loaders:{},e.__node.loaders),n.__node.mapGraphs)){e.__node.nodes.forEach(a=>{n.set(e.__node.tag+"."+a.__node.tag,a)});let r=()=>{e.__node.nodes.forEach(a=>{n.__node.nodes.delete(e.__node.tag+"."+a.__node.tag)})};this.__addDisconnected(r)}e.__node=Object.assign(this.__node,e.__node);let s=Object.getOwnPropertyNames(e);for(let r of s)this[r]=e[r];if(e.__operator&&n instanceof h&&n.__operator){let r=n.__subscribe(this),a=()=>{n?.__unsubscribe(r)};this.__addDisconnected(a)}else if(typeof e.default=="function"&&!e.__operator){let r=e.default.bind(this);this.default=(...a)=>{this.__node.inputState&&this.__node.state.setValue(this.__node.unique+"input",a);let o=r(...a);return typeof o?.then=="function"?o.then(f=>{f!==void 0&&this.__node.state.setValue(this.__node.unique,f)}).catch(console.error):o!==void 0&&this.__node.state.setValue(this.__node.unique,o),o},e.default=this.default}e instanceof c&&(this.__node.source=e)}}__addLocalState(e){if(!e)return;this.__node.localState||(this.__node.localState={});let n=this.__node.localState;for(let t in e)if(!(this.__props&&this.__props[t]))if(typeof e[t]=="function"){if(!t.startsWith("_")){let _=e[t].bind(this);e[t]=(...s)=>{this.__node.inputState&&this.__node.state.setValue(this.__node.unique+"."+t+"input",s);let r=_(...s);return typeof r?.then=="function"?this.__node.state.triggers[this.__node.unique+"."+t]&&r.then(a=>{this.__node.state.setValue(this.__node.unique+"."+t,a)}).catch(console.error):this.__node.state.triggers[this.__node.unique+"."+t]&&this.__node.state.setValue(this.__node.unique+"."+t,r),r},this[t]=e[t]}}else{n[t]=e[t];let _={get:()=>n[t],set:s=>{n[t]=s,this.__node.state.triggers[this.__node.unique+"."+t]&&this.__node.state.setValue(this.__node.unique+"."+t,s)},enumerable:!0,configurable:!0};if(Object.defineProperty(this,t,_),typeof this.__node.initial=="object"){let s=Object.getOwnPropertyDescriptor(this.__node.initial,t);(s===void 0||s?.configurable)&&Object.defineProperty(this.__node.initial,t,_)}}}__addOnconnected(e){Array.isArray(this.__ondisconnected)?this.__onconnected.push(e):typeof this.__onconnected=="function"?this.__onconnected=[e,this.__onconnected]:this.__onconnected=e}__addDisconnected(e){Array.isArray(this.__ondisconnected)?this.__ondisconnected.push(e):typeof this.__ondisconnected=="function"?this.__ondisconnected=[e,this.__ondisconnected]:this.__ondisconnected=e}__callConnected(e=this){typeof this.__onconnected=="function"?this.__onconnected(this):Array.isArray(this.__onconnected)&&this.__onconnected.forEach(n=>{n(this)})}__callDisconnected(e=this){typeof this.__ondisconnected=="function"?this.__ondisconnected(this):Array.isArray(this.__ondisconnected)&&this.__ondisconnected.forEach(n=>{n(this)})}},c=class{constructor(e){this.__node={tag:`graph${Math.floor(Math.random()*1e15)}`,nodes:new Map,state:y};this.init=e=>{e&&(p(this.__node,e),e.tree&&this.setTree(e.tree))};this.setTree=e=>{this.__node.tree=Object.assign(this.__node.tree?this.__node.tree:{},e);let n=Object.assign({},e);n.__node&&delete n.__node;let t=this.recursiveSet(n,this,void 0,e);if(e.__node){if(!e.__node.tag)e.__node._tag=`tree${Math.floor(Math.random()*1e15)}`;else if(!this.get(e.__node.tag)){let _=new h(e,this,this);for(let s in this.__node.loaders)this.__node.loaders[s](_,this,this,e,e,e.__node.tag);this.set(_.__node.tag,_),_.__listeners&&(t[_.__node.tag]=_.__listeners)}}return this.setListeners(t),n};this.setLoaders=(e,n)=>(n?this.__node.loaders=e:Object.assign(this.__node.loaders,e),this.__node.loaders);this.add=(e,n)=>{let t={};typeof n=="string"&&(n=this.get(n)),typeof e=="function"?e={__operator:e}:typeof e=="string"&&(e=this.__node.tree[e]);let _=Object.assign({},e);if(_.__node||(_.__node={}),_.__node.initial=e,typeof e=="object"&&(!_?.__node?.tag||!this.get(_.__node.tag))){let s=new h(_,n,this);for(let r in this.__node.loaders)this.__node.loaders[r](s,n,this,this.__node.tree,e);return this.set(s.__node.tag,s),this.__node.tree[s.__node.tag]=e,s.__listeners&&(t[s.__node.tag]=s.__listeners),s.__children&&(s.__children=Object.assign({},s.__children),this.recursiveSet(s.__children,s,t,s.__children)),this.setListeners(t),s.__callConnected(),s}};this.recursiveSet=(e,n,t={},_)=>{let s=Object.getOwnPropertyNames(_);for(let r of s){if(r.includes("__"))continue;let a=_[r];if(!Array.isArray(a)&&(typeof a=="function"?a={__operator:a}:typeof a=="string"?a=this.__node.tree[a]:typeof a=="boolean"&&(a=this.__node.tree[r]),typeof a=="object")){if(a=Object.assign({},a),a.__node||(a.__node={}),a.__node.tag||(a.__node.tag=r),a.__node.initial=e[r],this.get(a.__node.tag)&&!(n?.__node&&this.get(n.__node.tag+"."+a.__node.tag))||n?.__node&&this.get(n.__node.tag+"."+a.__node.tag))continue;let o=new h(a,n,this);for(let f in this.__node.loaders)this.__node.loaders[f](o,n,this,e,e[r],r);e[r]=o,this.__node.tree[o.__node.tag]=a,this.set(o.__node.tag,o),o.__listeners?t[o.__node.tag]=o.__listeners:o.__children&&(o.__children=Object.assign({},o.__children),this.recursiveSet(o.__children,o,t,o.__children)),o.__callConnected()}}return t};this.remove=(e,n=!0)=>{if(this.unsubscribe(e),typeof e=="string"&&(e=this.get(e)),e instanceof h){this.delete(e.__node.tag),delete this.__node.tree[e.__node.tag],n&&this.clearListeners(e),e.__callDisconnected();let t=_=>{for(let s in _)this.unsubscribe(_[s]),this.delete(_[s].__node.tag),delete this.__node.tree[_[s].__node.tag],this.delete(s),delete this.__node.tree[s],_[s].__node.tag=_[s].__node.tag.substring(_[s].__node.tag.lastIndexOf(".")+1),n&&this.clearListeners(_[s]),_[s].__callDisconnected(),_[s].__children&&t(_[s].__children)};e.__children&&t(e.__children)}return e?.__node.tag&&e?.__parent&&(delete e?.__parent,e.__node.tag=e.__node.tag.substring(e.__node.tag.indexOf(".")+1)),e};this.run=(e,...n)=>{if(typeof e=="string"){let t=this.get(e);if(!t&&e.includes(".")){if(t=this.get(e.substring(0,e.lastIndexOf("."))),typeof t?.[e.substring(e.lastIndexOf(".")+1)]=="function")return t[e.substring(e.lastIndexOf(".")+1)](...n)}else if(t?.__operator)return t.__operator(...n)}if(e?.__operator)return e?.__operator(...n)};this.setListeners=e=>{for(let n in e){let t=this.get(n);if(typeof e[n]=="object")for(let _ in e[n]){let s=this.get(_),r;if(typeof e[n][_]!="object"&&(e[n][_]={callback:e[n][_]}),typeof e[n][_].callback=="function"&&(e[n][_].callback=e[n][_].callback.bind(t)),typeof t.__listeners!="object"&&(t.__listeners={}),s)r=this.subscribe(s,e[n][_].callback,void 0,e[n][_].inputState,n,_),typeof t.__listeners[_]!="object"&&(t.__listeners[_]={callback:e[n][_].callback,inputState:e[n][_]?.inputState}),t.__listeners[_].sub=r;else{let a=_.substring(0,_.lastIndexOf("."));s=this.get(a),s&&(r=this.subscribe(s,e[n][_].callback,_.substring(_.lastIndexOf(".")+1),e[n][_].inputState,n,_),typeof t.__listeners[_]!="object"&&(t.__listeners[_]={callback:e[n][_].callback,inputState:e[n][_]?.inputState}),t.__listeners[_].sub=r)}}}};this.clearListeners=(e,n)=>{if(typeof e=="string"&&(e=this.get(e)),e?.__listeners)for(let t in e.__listeners){if(n&&t!==n||typeof e.__listeners[t].sub!="number")continue;let _=this.get(t);_?this.unsubscribe(_,e.__listeners[t].sub,void 0,e.__listeners[t].inputState):(_=this.get(t.substring(0,t.lastIndexOf("."))),_&&this.unsubscribe(_,e.__listeners[t].sub,t.substring(t.lastIndexOf(".")+1),e.__listeners[t].inputState)),delete e.__listeners[t]}};this.get=e=>this.__node.nodes.get(e);this.set=(e,n)=>this.__node.nodes.set(e,n);this.delete=e=>this.__node.nodes.delete(e);this.getProps=(e,n)=>{if(typeof e=="string"&&(e=this.get(e)),e instanceof h){let t;n?t=Object.assign({},this.__node.tree[e.__node.tag]):(t=Object.assign({},e),delete t.__unsubscribe,delete t.__setOperator,delete t.__node,delete t.__subscribeState,delete t.__subscribe)}};this.subscribe=(e,n,t,_,s,r)=>{let a=e;e instanceof h||(a=this.get(e));let o;if(typeof n=="string")if(s){let f=this.get(s)?.[n];typeof f=="function"&&(n=f)}else n=this.get(n)?.__operator;if(a instanceof h){o=a.__subscribe(n,t,_,s,r);let f=()=>{a.__unsubscribe(o,t,_)};a.__addDisconnected(f)}else if(typeof e=="string")if(this.get(e))if(n instanceof h&&n.__operator){o=this.get(e).__subscribe(n.__operator,t,_,s,r);let f=()=>{this.get(e).__unsubscribe(o)};n.__addDisconnected(f)}else(typeof n=="function"||typeof n=="string")&&(o=this.get(e).__subscribe(n,t,_,s,r),this.__node.state.getTrigger(this.get(e).__node.unique,o).source=e);else typeof n=="string"&&(n=this.__node.nodes.get(n).__operator),typeof n=="function"&&(o=this.__node.state.subscribeTrigger(e,n));return o};this.unsubscribe=(e,n,t,_)=>e instanceof h?e.__unsubscribe(n,t,_):this.get(e)?.__unsubscribe(n,t,_);this.setState=e=>{this.__node.state.setState(e)};this.init(e)}};function p(i,e){for(let n in e)e[n]?.constructor.name==="Object"&&!Array.isArray(e[n])?i[n]?.constructor.name==="Object"&&!Array.isArray(i[n])?p(i[n],e[n]):i[n]=p({},e[n]):i[n]=e[n];return i}function b(i){var e=[],n=i;do{var t=Object.getOwnPropertyNames(n);t.forEach(function(_){e.indexOf(_)===-1&&e.push(_)})}while(n=Object.getPrototypeOf(n));return e}function w(i){let e=b(i),n={};for(let t of e)n[t]=i[t];return n}var G=(i,e,n)=>{i.__node.backward&&e instanceof h&&n.setListeners({[e.__node.tag]:{[i.__node.tag]:e}})},m=(i,e,n)=>{if(i.__operator&&!i.__node.looperSet){if(i.__node.looperSet=!0,typeof i.__node.delay=="number"){let t=i.__operator;i.__operator=(..._)=>new Promise((s,r)=>{setTimeout(async()=>{s(await t(..._))},i.__node.delay)})}else if(i.__node.frame===!0){let t=i.__operator;i.__operator=(..._)=>new Promise((s,r)=>{requestAnimationFrame(async()=>{s(await t(..._))})})}if(typeof i.__node.repeat=="number"||typeof i.__node.recursive=="number"){let t=i.__operator;i.__operator=async(..._)=>{let s=i.__node.repeat?i.__node.repeat:i.__node.recursive,r,a=async(o,...f)=>{for(;o>0;){if(i.__node.delay||i.__node.frame){t(...f).then(async d=>{i.__node.recursive?await a(o,d):await a(o,...f)});break}else r=await t(..._);o--}};return await a(s,..._),r}}if(i.__node.loop&&typeof i.__node.loop=="number"){let t=i.__operator;i.__operator=(...s)=>{"looping"in i.__node||(i.__node.looping=!0),i.__node.looping&&(t(...s),setTimeout(()=>{i.__operator(...s)},i.__node.loop))},i.__node.looping&&i.__operator();let _=s=>{s.__node.looping&&(s.__node.looping=!1)};i.__addDisconnected(_)}}},O=(i,e,n)=>{if(i.__node.animate===!0||i.animation){let t=i.__operator;i.__operator=(...s)=>{"animating"in i.__node||(i.__node.animating=!0),i.__node.animating&&(typeof i.animation=="function"?i.animation(...s):t(...s),requestAnimationFrame(()=>{i.__operator(...s)}))},(i.__node.animating||(!("animating"in i.__node)||i.__node.animating)&&i.animation)&&setTimeout(()=>{requestAnimationFrame(i.__operator())},10);let _=s=>{s.__node.animating&&(s.__node.animating=!1)};i.__addDisconnected(_)}},N=(i,e,n)=>{if(typeof i.__node.branch=="object"&&i.__operator&&!i.__node.branchApplied){let t=i.__operator;i.__node.branchApplied=!0,i.__operator=(..._)=>{let s=t(..._);for(let r in i.__node.branch){let a=()=>{typeof i.__node.branch[r].then=="function"?i.__node.branch[r].then(s):i.__node.branch[r].then instanceof h&&i.__node.branch[r].then.__operator?i.__node.branch[r].then.__operator(s):s=i.__node.branch[r].then};typeof i.__node.branch[r].if=="function"?i.__node.branch[r].if(s)&&a():i.__node.branch[r].if===s&&a()}return s}}if(i.__listeners){for(let t in i.__listeners)if(typeof i.__listeners[t]=="object"&&i.__listeners[t].branch&&!i.__listeners[t].branchApplied){let _=i.__listeners[t].callback;i.__listeners[t].branchApplied=!0,i.__listeners.callback=s=>{let r=()=>{typeof i.__listeners[t].branch.then=="function"?s=i.__listeners[t].branch.then(s):i.__listeners[t].branch.then instanceof h&&i.__listeners[t].branch.then.__operator?s=i.__listeners[t].branch.then.__operator(s):s=i.__listeners[t].branch.then};return typeof i.__listeners[t].branch.if=="function"?i.__listeners[t].branch.if(s)&&r():i.__listeners[t].branch.if===s&&r(),_(s)}}}},j=(i,e,n)=>{if(i.__listeners)for(let t in i.__listeners)typeof i.__listeners[t]=="object"&&i.__listeners[t].oncreate&&i.__listeners[t].callback(i.__listeners[t].oncreate)},q=(i,e,n)=>{if(i.__listeners)for(let t in i.__listeners)typeof i.__listeners[t]=="object"&&typeof i.__listeners[t].binding=="object"&&(i.__listeners.callback=i.__listeners.callback.bind(i.__listeners[t].binding))},x=(i,e,n)=>{if(i.__listeners){for(let t in i.__listeners)if(typeof i.__listeners[t]=="object"&&typeof i.__listeners[t].transform=="function"&&!i.__listeners[t].transformApplied){let _=i.__listeners[t].callback;i.__listeners[t].transformApplied=!0,i.__listeners.callback=s=>(s=i.__listeners[t].transform(s),_(s))}}},v=(i,e,n)=>{i.post&&!i.__operator?i.__setOperator(i.post):!i.__operator&&typeof i.get=="function"&&i.__setOperator(i.get),!i.get&&i.__operator&&(i.get=i.__operator),i.aliases&&i.aliases.forEach(t=>{n.set(t,i);let _=s=>{n.__node.nodes.delete(t)};i.__addDisconnected(_)}),typeof n.__node.tree[i.__node.tag]=="object"&&i.get&&(n.__node.tree[i.__node.tag].get=i.get)},L={backprop:G,loop:m,animate:O,branching:N,triggerListenerOncreate:j,bindListener:q,transformListenerResult:x,substitute__operator:v};})();
