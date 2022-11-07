(()=>{var A=class{constructor(n){this.pushToState={};this.data={};this.triggers={};this.setState=n=>{Object.assign(this.data,n);for(let e of Object.getOwnPropertyNames(n))this.triggers[e]&&this.triggers[e].forEach(i=>i.onchange(this.data[e]));return this.data};this.setValue=(n,e)=>{this.data[n]=e,this.triggers[n]&&this.triggers[n].forEach(i=>i.onchange(this.data[n]))};this.subscribeTrigger=(n,e)=>{if(n){this.triggers[n]||(this.triggers[n]=[]);let i=this.triggers[n].length;return this.triggers[n].push({idx:i,onchange:e}),this.triggers[n].length-1}else return};this.unsubscribeTrigger=(n,e)=>{let i=this.triggers[n];if(i)if(!e)delete this.triggers[n];else{let t;return i.find((r,a)=>{if(r.idx===e)return t=a,!0})&&i.splice(t,1),!0}};this.subscribeTriggerOnce=(n,e)=>{let i,t=s=>{e(s),this.unsubscribeTrigger(n,i)};i=this.subscribeTrigger(n,t)};typeof n=="object"&&(this.data=n)}};var T=new A,g=class{constructor(n,e,i){this.__node={tag:`node${Math.floor(Math.random()*1e15)}`,unique:`${Math.random()}`,state:T};this.__subscribe=(n,e,i)=>{if(e){if(this.__node.localState||this._addLocalState(this),typeof n=="string"&&(this.__node.graph?n=this.__node.graph.get(n):n=this.__node.graph.nodes.get(n)),typeof n=="function")return this.__node.events.subscribeTrigger(i&&e+"input",n);if(n?.__node)return this.__node.events.subscribeTrigger(i?e+"input":e,t=>{n.__operator&&n.__operator(t)})}else{if(typeof n=="string"&&(this.__node.graph?n=this.__node.graph.get(n):n=this.__node.graph.nodes.get(n)),typeof n=="function")return this.__node.state.subscribeTrigger(i?this.__node.tag+"input":this.__node.tag,n);if(n?.__node)return this.__node.state.subscribeTrigger(i?this.__node.tag+"input":this.__node.tag,t=>{n.__operator&&n.__operator(t)})}};this.__subscribeState=n=>{if(typeof n=="string"&&(this.__node.graph?n=this.__node.graph.get(n):n=this.__node.graph.nodes.get(n)),typeof n=="function")return this.__node.state.subscribeTrigger(this.__node.unique,n);if(n?.__node)return this.__node.state.subscribeTrigger(this.__node.unique,e=>{n?.__operator&&n.__operator(e)})};this.__unsubscribe=(n,e,i)=>e&&this.__node.events?this.__node.events.unsubscribeTrigger(i?e+"input":e,n):this.__node.state.unsubscribeTrigger(i?this.__node.tag+"input":this.__node.tag,n);this.__setOperator=n=>(n=n.bind(this),this.__operator=(...e)=>{this.__node.inputState&&this.__node.events.setValue(this.__node.tag+"input",e);let i=n(...e);return typeof i?.then=="function"?i.then(t=>{t!==void 0&&this.__node.state.setValue(this.__node.tag,t)}).catch(console.error):i!==void 0&&this.__node.state.setValue(this.__node.tag,i),i},this.__operator);if(typeof n=="function"?n={__node:{operator:n,tag:n.name}}:typeof n=="string"&&i?.get(n)&&(n=i.get(n)),typeof n=="object"){if(typeof n.__node=="string"?i?.get(n.__node)?n=i.get(n.__node):n.__node={}:n.__node||(n.__node={}),e&&(n.__parent=e),i&&(n.__node.graph=i),typeof n.default=="function")n.default=this.__setOperator(n.default);else if(n.__operator){if(typeof n.__operator=="string"&&i){let t=i.get(n.__operator);t&&(n.__operator=t.__operator),!n.__node.tag&&n.__operator.name&&(n.__node.tag=n.__operator.name)}typeof n.__operator=="function"&&(n.__operator=this.__setOperator(n.__operator))}if(n.__node.tag||(n.__operator?.name?n.__node.tag=n.__operator.name:n.__node.tag=`node${Math.floor(Math.random()*1e15)}`),e?.__node&&(!(e instanceof m)||n instanceof m)&&(n.__node.tag=e.__node.tag+"."+n.__node.tag),e instanceof m&&n instanceof m&&(n.__node.loaders&&Object.assign(e.__node.loaders?e.__node.loaders:{},n.__node.loaders),e.__node.mapGraphs)){n.__node.nodes.forEach(s=>{e.__node.nodes.set(n.__node.tag+"."+s.__node.tag,s)});let t=()=>{n.__node.nodes.forEach(s=>{e.__node.nodes.delete(n.__node.tag+"."+s.__node.tag)})};Array.isArray(this.__ondisconnected)?this.__ondisconnected.push(t):this.__ondisconnected?this.__ondisconnected=[t,this.__ondisconnected]:this.__ondisconnected=[t]}if(n.__node.initial=n,n.__node=Object.assign(this.__node,n.__node),Object.assign(this,n),n.__operator&&e instanceof g&&e.__operator){let t=e.__subscribe(this),s=()=>{e?.__unsubscribe(t)};Array.isArray(this.__ondisconnected)?this.__ondisconnected.push(s):this.__ondisconnected?this.__ondisconnected=[s,this.__ondisconnected]:this.__ondisconnected=[s]}n instanceof m&&(this.__node.source=n),typeof this.__onconnected=="function"?this.__onconnected(this):Array.isArray(this.__onconnected)&&this.__onconnected.forEach(t=>{t(this)})}}_addLocalState(n){if(!n)return;this.__node.localState||(this.__node.localState={}),this.__node.events||(this.__node.events=new A(this.__node.localState));let e=this.__node.localState;for(let i in n)if(typeof n[i]=="function"){if(!i.startsWith("_")){let t=n[i].bind(this);n[i]=(...s)=>{this.__node.inputState&&this.__node.events.setValue(i+"input",s);let r=t(...s);return typeof r?.then=="function"?r.then(a=>{this.__node.events.setValue(i,a)}).catch(console.error):this.__node.events.setValue(i,r),r},this[i]=n[i]}}else{e[i]=n[i];let t={get:()=>e[i],set:a=>{this.__node.state.triggers[this.__node.unique]&&this.__node.state.setValue(this.__node.unique,this),this.__node.events.setValue(i,a)},enumerable:!0,configurable:!0};Object.defineProperty(this,i,t);let s=this.__node.initial,r=Object.getOwnPropertyDescriptor(s,i);(r===void 0||r?.configurable)&&Object.defineProperty(s,i,t)}}},m=class{constructor(n){this.__node={tag:`graph${Math.floor(Math.random()*1e15)}`,nodes:new Map,state:T};this.init=n=>{n&&(C.call(this,this.__node,n),n.tree&&this.setTree(n.tree))};this.setTree=n=>{this.__node.tree=Object.assign(this.__node.tree?this.__node.tree:{},n);let e=Object.assign({},n);delete e.__node;let i=this.recursiveSet(e,this);if(n.__node){n.__node.tag||(n.__node._tag=`tree${Math.floor(Math.random()*1e15)}`);let t=new g(n,this,this);for(let s in this.__node.loaders)this.__node.loaders[s](t,this,this,n);this.__node.nodes.set(t.__node.tag,t),t.__listeners&&(i[t.__node.tag]=t.__listeners)}this.setListeners(i)};this.setLoaders=(n,e)=>(e?this.__node.loaders=n:Object.assign(this.__node.loaders,n),this.__node.loaders);this.add=(n,e)=>{let i={};typeof e=="string"&&(e=this.get(e));let t=new g(n,e,this);for(let s in this.__node.loaders)this.__node.loaders[s](t,e,this,n);return this.__node.nodes.set(t.__node.tag,t),t.__listeners&&(i[t.__node.tag]=t.__listeners),t.__children&&(t.__children=Object.assign({},t.__children),this.recursiveSet(t.__children,t,i)),t.__node.tree&&this.setTree(t.__node.tree),this.setListeners(i),t};this.recursiveSet=(n,e,i={})=>{for(let t in n){let s=n[t];if(!Array.isArray(s)&&(typeof s=="function"?s={__node:{operator:s}}:typeof s=="string"?s=this.__node.tree[s]:typeof s=="boolean"?s=this.__node.tree[t]:typeof s.default=="function"&&(s.__operator=s.default),typeof s=="object")){if(s=Object.assign({},s),s.__node||(s.__node={}),s.__node.tag||(s.__node.tag=t),this.get(s.__node.tag))continue;let r=new g(s,e,this);for(let a in this.__node.loaders)this.__node.loaders[a](r,e,this,n);n[t]=r,this.__node.tree[r.__node.tag]=s,this.set(r.__node.tag,r),r.__listeners?i[r.__node.tag]=r.__listeners:r.__children&&(r.__children=Object.assign({},r.__children),this.recursiveSet(r.__children,r,i)),r.__node.tree&&this.setTree(r.__node.tree)}}return i};this.remove=(n,e=!0)=>{if(this.unsubscribe(n),typeof n=="string"&&(n=this.get(n)),n instanceof g){this.__node.nodes.delete(n.__node.tag),delete this.__node.tree[n.__node.tag],e&&this.clearListeners(n),typeof n.__ondisconnected=="function"?n.__ondisconnected(n):Array.isArray(n.__ondisconnected)&&n.__ondisconnected.forEach(t=>{t(n)});let i=t=>{for(let s in t)this.unsubscribe(t[s]),this.__node.nodes.delete(t[s].__node.tag),delete this.__node.tree[t[s].__node.tag],this.__node.nodes.delete(s),delete this.__node.tree[s],t[s].__node.tag=t[s].__node.tag.substring(t[s].__node.tag.lastIndexOf(".")+1),e&&this.clearListeners(t[s]),typeof t[s]?.___ondisconnected=="function"?t[s].__ondisconnected(t[s]):Array.isArray(t[s]?.__ondisconnected)&&t[s]?.__ondisconnected.forEach(r=>{r(n)}),t[s].__children&&i(t[s].__children)};n.__children&&i(n.__children)}return n?.__node.tag&&n?.__parent&&(delete n?.__parent,n.__node.tag=n.__node.tag.substring(n.__node.tag.indexOf(".")+1)),n};this.removeTree=n=>{};this.run=(n,...e)=>{if(typeof n=="string"&&(n=this.get(n)),n?.__node?.operator)return n?.__node?.operator(...e)};this.setListeners=n=>{for(let e in n){let i=this.get(e);if(typeof n[e]=="object")for(let t in n[e]){let s=this.get(t),r;if(typeof n[e][t]=="function"&&(n[e][t]={callback:n[e][t]}),n[e][t].callback=n[e][t].callback.bind(i),typeof i.__listeners!="object"&&(i.__listeners={}),s)r=this.subscribe(s,void 0,n[e][t].callback,n[e][t].inputState),typeof i.__listeners[t]!="object"&&(i.__listeners[t]={callback:n[e][t].callback,inputState:n[e][t]?.inputState}),i.__listeners[t].sub=r;else{let a=t.substring(0,t.lastIndexOf("."));s=this.get(a),s&&(r=this.subscribe(s,t.substring(t.lastIndexOf(".")+1),n[e][t].callback,n[e][t].inputState),typeof i.__listeners[t]!="object"&&(i.__listeners[t]={callback:n[e][t].callback,inputState:n[e][t]?.inputState}),i.__listeners[t].sub=r)}}}};this.clearListeners=(n,e)=>{if(typeof n=="string"&&(n=this.get(n)),n?.__listeners)for(let i in n.__listeners){if(e&&i!==e||typeof n.__listeners[i].sub!="number")continue;let t=this.get(i);t?this.unsubscribe(t,void 0,n.__listeners[i].sub,n.__listeners[i].inputState):(t=this.get(i.substring(0,i.lastIndexOf("."))),t&&this.unsubscribe(t,i.substring(i.lastIndexOf(".")+1),n.__listeners[i].sub,n.__listeners[i].inputState)),delete n.__listeners[i]}};this.get=n=>this.__node.nodes.get(n);this.set=(n,e)=>{this.__node.nodes.set(n,e)};this.getProps=(n,e)=>{if(typeof n=="string"&&(n=this.get(n)),n instanceof g){let i;e?i=Object.assign({},this.__node.tree[n.__node.tag]):(i=Object.assign({},n),delete i.__unsubscribe,delete i.__setOperator,delete i.__node,delete i.__subscribeState,delete i.__subscribe)}};this.subscribe=(n,e,i,t)=>{let s;n instanceof g||(s=this.get(n));let r;if(s instanceof g){r=s.__subscribe(i,e,t);let a=()=>{s.__unsubscribe(r,e,t)};s.__ondisconnected?Array.isArray(s.__ondisconnected)?s.__ondisconnected.push(a):s.__ondisconnected=[a,s.__ondisconnected]:s.__ondisconnected=[a]}else if(typeof n=="string")if(typeof i=="string"&&(i=this.get(i)),i instanceof g&&i.__operator){r=this.__node.state.subscribeTrigger(n,i.__operator);let a=()=>{this.__node.state.unsubscribeTrigger(n,r)};i.__ondisconnected?Array.isArray(i.__ondisconnected)?i.__ondisconnected.push(a):i.__ondisconnected=[a,i.__ondisconnected]:i.__ondisconnected=[a]}else typeof i=="function"&&(r=this.__node.state.subscribeTrigger(n,i));return r};this.unsubscribe=(n,e,i,t)=>n instanceof g?n.__unsubscribe(i,e,t):this.get(n)?.__unsubscribe(i,e,t);this.setState=n=>{this.__node.state.setState(n)};this.init(n)}};function C(o,n){for(let e in n)n[e]?.constructor.name==="Object"&&!Array.isArray(n[e])?o[e]?.constructor.name==="Object"&&!Array.isArray(o[e])?C(o[e],n[e]):o[e]=C({},n[e]):o[e]=n[e];return o}var N=(o,n,e)=>{o.__node.backward&&n instanceof g&&e.setListeners({[n.__node.tag]:{[o.__node.tag]:n}})},w=(o,n,e)=>{if(o.__operator&&!o.__node.looperSet){if(o.__node.looperSet=!0,typeof o.__node.delay=="number"){let i=o.__operator;o.__operator=(...t)=>new Promise((s,r)=>{setTimeout(async()=>{s(await i(...t))},o.__node.delay)})}else if(o.__node.frame===!0){let i=o.__operator;o.__operator=(...t)=>new Promise((s,r)=>{requestAnimationFrame(async()=>{s(await i(...t))})})}if(typeof o.__node.repeat=="number"||typeof o.__node.recursive=="number"){let i=o.__operator;o.__operator=async(...t)=>{let s=o.__node.repeat?o.__node.repeat:o.__node.recursive,r,a=async(f,...c)=>{for(;f>0;){if(o.__node.delay||o.__node.frame){i(...c).then(async y=>{o.__node.recursive?await a(f,y):await a(f,...c)});break}else r=await i(...t);f--}};return await a(s,...t),r}}if(o.__node.loop&&typeof o.__node.loop=="number"){"looping"in o.__node||(o.__node.looping=!0),o.__node.looper=()=>{o.__node.looping&&(o.__operator(),setTimeout(o.__node.looper,o.__node.loop))},o.__node.looping&&o.__node.looper();let i=t=>{t.__node.looping&&(t.__node.looping=!1)};typeof o.__ondisconnected>"u"?o.__ondisconnected=[i]:typeof o.__ondisconnected=="function"?o.__ondisconnected=[i,o.__ondisconnected]:Array.isArray(o.__ondisconnected)&&o.__ondisconnected.unshift(i)}}},k=(o,n,e)=>{if(o.__node.animate===!0||o.__node.animation){typeof o.__node.animate=="function"&&(o.__node.animate=o.__node.animate.bind(o)),requestAnimationFrame(s=>{"animating"in s.__node||(s.__node.animating=!0),s.__node.animate=()=>{s.__node.animating&&(typeof s.__node.animate=="function"?s.__node.animation():s.__operator(),requestAnimationFrame(s.__node.animation))},requestAnimationFrame(s.__node.animation),s.__node.animating&&s.__node.animation()});let t=s=>{s.__node.animating&&(s.__node.animating=!1)};typeof o.__ondisconnected>"u"?o.__ondisconnected=[t]:typeof o.__ondisconnected=="function"?o.__ondisconnected=[t,o.__ondisconnected]:Array.isArray(o.__ondisconnected)&&o.__ondisconnected.unshift(t)}},P=(o,n,e)=>{if(typeof o.__node.branch=="object"&&o.__operator&&!o.__node.branchApplied){let i=o.__operator;o.__node.branchApplied=!0,o.__operator=(...t)=>{let s=i(...t);for(let r in o.__node.branch){let a=()=>{typeof o.__node.branch[r].then=="function"?o.__node.branch[r].then(s):o.__node.branch[r].then instanceof g&&o.__node.branch[r].then.__operator?o.__node.branch[r].then.__operator(s):s=o.__node.branch[r].then};typeof o.__node.branch[r].if=="function"?o.__node.branch[r].if(s)&&a():o.__node.branch[r].if===s&&a()}return s}}if(o.__listeners){for(let i in o.__listeners)if(typeof o.__listeners[i]=="object"&&o.__listeners[i].branch&&!o.__listeners[i].branchApplied){let t=o.__listeners[i].callback;o.__listeners[i].branchApplied=!0,o.__listeners.callback=s=>{let r=()=>{typeof o.__listeners[i].branch.then=="function"?o.__listeners[i].branch.then(s):o.__listeners[i].branch.then instanceof g&&o.__listeners[i].branch.then.__operator?o.__listeners[i].branch.then.__operator(s):s=o.__listeners[i].branch.then};return typeof o.__listeners[i].branch.if=="function"?o.__listeners[i].branch.if(s)&&r():o.__listeners[i].branch.if===s&&r(),t(s)}}}},F=(o,n,e)=>{if(o.__listeners)for(let i in o.__listeners)typeof o.__listeners[i]=="object"&&o.__listeners[i].oncreate&&o.__listeners[i].callback(o.__listeners[i].oncreate)},M=(o,n,e)=>{if(o.__listeners)for(let i in o.__listeners)typeof o.__listeners[i]=="object"&&typeof o.__listeners[i].binding=="object"&&(o.__listeners.callback=o.__listeners.callback.bind(o.__listeners[i].binding))},U=(o,n,e)=>{if(o.__listeners){for(let i in o.__listeners)if(typeof o.__listeners[i]=="object"&&typeof o.__listeners[i].transform=="function"&&!o.__listeners[i].transformApplied){let t=o.__listeners[i].callback;o.__listeners[i].transformApplied=!0,o.__listeners.callback=s=>(s=o.__listeners[i].transform(s),t(s))}}},q=(o,n,e)=>{o.post&&!o.__operator?o.__setOperator(o.post):!o.__operator&&typeof o.get=="function"&&o.__setOperator(o.get),o.aliases&&o.aliases.forEach(i=>{e.__node.nodes.set(i,o);let t=s=>{e.__node.nodes.delete(i)};typeof o.__ondisconnected>"u"?o.__ondisconnected=[t]:typeof o.__ondisconnected=="function"?o.__ondisconnected=[t,o.__ondisconnected]:Array.isArray(o.__ondisconnected)&&o.__ondisconnected.unshift(t)})},O={backprop:N,loop:w,animate:k,branching:P,triggerListenerOncreate:F,bindListener:M,transformListenerResult:U,substitute__operator:q};var G=class extends m{constructor(e){super({...e,loaders:e?.loaders?Object.assign({...O},e.loaders):{...O}});this.name=`service${Math.floor(Math.random()*1e15)}`;this.handleMethod=(e,i,t)=>{let s=i.toLowerCase(),r=this.__node.nodes.get(e);return r||(r=this.__node.tree[e]),r?.[s]?r[s]instanceof Function?r[s](t):(t&&(r[s]=t),r[s]):this.handleServiceMessage({route:e,args:t,method:i})};this.transmit=(...e)=>typeof e[0]=="object"?e[0].method?this.handleMethod(e[0].route,e[0].method,e[0].args):e[0].route?this.handleServiceMessage(e[0]):e[0].node?this.handleGraphNodeCall(e[0].node,e[0].args):(this.__node.keepState&&(e[0].route&&this.setState({[e[0].route]:e[0].args}),e[0].node&&this.setState({[e[0].node]:e[0].args})),e):e;this.receive=(...e)=>{if(e[0]&&typeof e[0]=="string"){let i=e[0].substring(0,8);(i.includes("{")||i.includes("["))&&(i.includes("\\")&&(e[0]=e[0].replace(/\\/g,"")),e[0][0]==='"'&&(e[0]=e[0].substring(1,e[0].length-1)),e[0]=JSON.parse(e[0]))}return typeof e[0]=="object"?e[0].method?this.handleMethod(e[0].route,e[0].method,e[0].args):e[0].route?this.handleServiceMessage(e[0]):e[0].node?this.handleGraphNodeCall(e[0].node,e[0].args):(this.__node.keepState&&(e[0].route&&this.setState({[e[0].route]:e[0].args}),e[0].node&&this.setState({[e[0].node]:e[0].args})),e):e};this.pipe=(e,i,t,s,r)=>{if(e instanceof g)return r?this.subscribe(e,void 0,a=>{let f=r(a);f!==void 0?this.transmit({route:i,args:f,method:s}):this.transmit({route:i,args:a,method:s},t)}):this.subscribe(e,void 0,a=>{this.transmit({route:i,args:a,method:s},t)});if(typeof e=="string")return this.subscribe(e,void 0,a=>{this.transmit({route:i,args:a,method:s},t)})};this.pipeOnce=(e,i,t,s,r)=>{if(e instanceof g)return r?e.__node.state.subscribeTriggerOnce(e.__node.tag,a=>{let f=r(a);f!==void 0?this.transmit({route:i,args:f,method:s}):this.transmit({route:i,args:a,method:s},t)}):this.__node.state.subscribeTriggerOnce(e.__node.tag,a=>{this.transmit({route:i,args:a,method:s},t)});if(typeof e=="string")return this.__node.state.subscribeTriggerOnce(e,a=>{this.transmit({route:i,args:a,method:s},t)})};this.terminate=(...e)=>{};this.isTypedArray=E;this.recursivelyAssign=j;this.spliceTypedArray=L;this.ping=()=>(console.log("pinged"),"pong");this.echo=(...e)=>(this.transmit(...e),e);e?.services&&this.addServices(e.services),this.setTree(this)}addServices(e){for(let i in e)typeof e[i]=="function"?this.setTree(new e[i]):typeof e[i]=="object"&&this.setTree(e[i])}handleServiceMessage(e){let i;return typeof e=="object"&&(e.route?i=e.route:e.node&&(i=e.node)),i?Array.isArray(e.args)?this.run(i,...e.args):this.run(i,e.args):e}handleGraphNodeCall(e,i){if(!e)return i;if(i?.args)this.handleServiceMessage(i);else return Array.isArray(i)?this.run(e,...i):this.run(e,i)}};function E(o){return ArrayBuffer.isView(o)&&Object.prototype.toString.call(o)!=="[object DataView]"}var j=(o,n)=>{for(let e in n)typeof n[e]=="object"&&!Array.isArray(n[e])?typeof o[e]=="object"&&!Array.isArray(o[e])?j(o[e],n[e]):o[e]=j({},n[e]):o[e]=n[e];return o};function L(o,n,e){let i=o.subarray(0,n),t;e&&(t=o.subarray(e+1));let s;return(i.length>0||t?.length>0)&&(s=new o.constructor(i.length+t.length)),s&&(i.length>0&&s.set(i),t&&t.length>0&&s.set(t,i.length)),s}function S(o=""){let n=r=>r.replace(/^\W*(function[^{]+\{([\s\S]*)\}|[^=]+=>[^{]*\{([\s\S]*)\}|[^=]+=>(.+))/i,"$2$3$4"),i=(r=>{let a=r.indexOf("=>")+1;return a<=0&&(a=r.indexOf("){")),a<=0&&(a=r.indexOf(") {")),r.slice(0,r.indexOf("{",a)+1)})(o),t=n(o),s;if(i.includes("function")){let r=i.split("(")[1].split(")")[0];s=new Function(r,t)}else if(i.substring(0,6)===t.substring(0,6)){let r=i.split("(")[1].split(")")[0];s=new Function(r,t.substring(t.indexOf("{")+1,t.length-1))}else try{s=(0,eval)(i+t+"}")}catch{}return s}var R=function(){let o=new Map,n=[],e=["this"];function i(){o.clear(),n.length=0,e.length=1}function t(r,a){var f=n.length-1,c=n[f];if(typeof c=="object")if(c[r]===a||f===0)e.push(r),n.push(a.pushed);else for(;f-->=0;){if(c=n[f],typeof c=="object"&&c[r]===a){f+=2,n.length=f,e.length=f,--f,n[f]=a,e[f]=r;break}f--}}function s(r,a){if(a!=null&&typeof a=="object"){r&&t(r,a);let f=o.get(a);if(f)return"[Circular Reference]"+f;o.set(a,e.join("."))}return a}return function(a,f){try{return n.push(a),JSON.stringify(a,s,f)}finally{i()}}}();JSON.stringifyWithCircularRefs===void 0&&(JSON.stringifyWithCircularRefs=R);var V=function(){let o=new Map,n=[],e=["this"];function i(){o.clear(),n.length=0,e.length=1}function t(r,a){var f=n.length-1;if(n[f]){var c=n[f];if(typeof c=="object")if(c[r]===a||f===0)e.push(r),n.push(a.pushed);else for(;f-->=0;){if(c=n[f],typeof c=="object"&&c[r]===a){f+=2,n.length=f,e.length=f,--f,n[f]=a,e[f]=r;break}f++}}}function s(r,a){let f;if(a!=null)if(typeof a=="object"){let c=a.constructor.name;r&&c==="Object"&&t(r,a);let y=o.get(a);if(y)return"[Circular Reference]"+y;if(o.set(a,e.join(".")),c==="Array")a.length>20?f=a.slice(a.length-20):f=a;else if(c.includes("Set"))f=Array.from(a);else if(c!=="Object"&&c!=="Number"&&c!=="String"&&c!=="Boolean")f="instanceof_"+c;else if(c==="Object"){let l={};for(let d in a)if(a[d]==null)l[d]=a[d];else if(Array.isArray(a[d]))a[d].length>20?l[d]=a[d].slice(a[d].length-20):l[d]=a[d];else if(a[d].constructor.name==="Object"){l[d]={};for(let u in a[d])if(Array.isArray(a[d][u]))a[d][u].length>20?l[d][u]=a[d][u].slice(a[d][u].length-20):l[d][u]=a[d][u];else if(a[d][u]!=null){let h=a[d][u].constructor.name;h.includes("Set")?l[d][u]=Array.from(a[d][u]):h!=="Number"&&h!=="String"&&h!=="Boolean"?l[d][u]="instanceof_"+h:l[d][u]=a[d][u]}else l[d][u]=a[d][u]}else{let u=a[d].constructor.name;u.includes("Set")?l[d]=Array.from(a[d]):u!=="Number"&&u!=="String"&&u!=="Boolean"?l[d]="instanceof_"+u:l[d]=a[d]}f=l}else f=a}else f=a;return f}return function(a,f){n.push(a);let c=JSON.stringify(a,s,f);return i(),c}}();JSON.stringifyFast===void 0&&(JSON.stringifyFast=V);var ee={setRoute:function(o,n){if(typeof o=="string"&&(o=S(o)),typeof o=="function"){if(n||(n=o.name),this.__node.graph.get(n))this.__node.graph.get(n).__setOperator(o);else{let e=this.__node.graph.add({__node:{tag:n,operator:o}})}return!0}return!1},setNode:function(o,n){return typeof o=="string"&&(o=S(o)),typeof o=="function"?(n||(n=o.name),this.__node.graph.get(n)?this.__node.graph.get(n).__setOperator(o):this.__node.graph.add({__node:{tag:n,operator:o}}),!0):!1},setMethod:function(o,n,e){return typeof n=="string"&&(n=S(n)),typeof n=="function"?(e||(e=n.name),this.__node.graph.get(o)?this.__node.graph.get(o)[e]=n:this.__node.graph.add({__node:{tag:e,[e]:n}}),!0):!1},assignRoute:function(o,n){this.__node.graph.get(o)&&typeof n=="object"&&Object.assign(this.__node.graph.get(o),n)},transferClass:(o,n)=>{if(typeof o=="object"){let e=o.toString();return{route:"receiveClass",args:[e,n]}}return!1},receiveClass:function(o,n){if(typeof o=="string"&&o.indexOf("class")===0){let e=(0,eval)("("+o+")"),i=n;return i||(i=e.name),this.__node.graph[i]=e,!0}return!1},setGlobal:(o,n)=>(globalThis[o]=n,!0),assignGlobalObject:(o,n)=>globalThis[o]?(typeof n=="object"&&Object.assign(globalThis[o],n),!0):!1,setValue:function(o,n){return this.__node.graph[o]=n,!0},assignObject:function(o,n){return this.__node.graph[o]?(typeof n=="object"&&Object.assign(this.__node.graph[o],n),!0):!1},setGlobalFunction:(o,n)=>(typeof o=="string"&&(o=S(o)),typeof o=="function"?(n||(n=o.name),globalThis[n]=o,!0):!1),assignFunctionToGlobalObject:function(o,n,e){return globalThis[o]?(typeof n=="string"&&(n=S(n)),typeof n=="function"?(e||(e=n.name),this.__node.graph[o][e]=n,!0):!1):!1},setFunction:function(o,n){return typeof o=="string"&&(o=S(o)),typeof o=="function"?(n||(n=o.name),this.__node.graph[n]=o,!0):!1},assignFunctionToObject:function(o,n,e){return this.__node.graph[o]?(typeof n=="string"&&(n=S(n)),typeof n=="function"?(e||(e=n.name),this.__node.graph[o][e]=n,!0):!1):!1}};var x=class extends G{constructor(e){super(e);this.name="router";this.connections={};this.sources={};this.services={};this.serviceConnections={};this.users={};this.addUser=async(e,i,t,s)=>{e._id||(e._id=`user${Math.floor(Math.random()*1e15)}`);let r=Object.assign({},e);if(i){for(let h in i)typeof i[h]=="object"&&(i[h].connection._id||await new Promise((_,p)=>{let b=performance.now(),v=()=>{i[h].connection._id?_(!0):performance.now()-b>3e3?(delete i[h],p(!1)):setTimeout(()=>{v()},100)};v()}).catch(_=>{console.error("Connections timed out:",_)}));for(let h in i)i[h]=this.addConnection(i[h],r._id)}if(t)for(let h in t)this.openConnection(t[h].service,t[h],r._id,t[h].args);let a=(h,..._)=>{let p=this.getConnection(r._id,"send");if(p?.send)return p.send(h,..._)},f=(h,_,...p)=>{let b=this.getConnection(r._id,"request");if(b?.request)return b.request(h,_,...p)},c=(h,_,p,...b)=>{let v=this.getConnection(r._id,"post");if(v?.post)return v.post(h,_,p,...b)},y=(h,_,p,...b)=>{let v=this.getConnection(r._id,"run");if(v?.run)return v.run(h,_,p,...b)},l=(h,_,...p)=>{let b=this.getConnection(r._id,"subscribe");if(b?.subscribe)return b.subscribe(h,_,...p)},d=(h,_,...p)=>{let b=this.getConnection(r._id,"unsubscribe");if(b?.unsubscribe)return b.unsubscribe(h,_,...p)},u=()=>this.removeUser(r);if(r.send=a,r.request=f,r.post=c,r.run=y,r.subscribe=l,r.unsubscribe=d,r.terminate=u,this.users[r._id]=r,i&&!s){let h={},_=!1;Object.keys(i).map((p,b)=>{i[p]?._id&&(h[`${b}`]=i[p]?._id,_=!0)}),_&&r.send({route:"addUser",args:[{_id:r._id},h,void 0,!0]})}return r};this.getConnection=(e,i)=>{if(this.sources[e])if(this.order)for(let t=0;t<this.order.length;t++){let s=this.order[t];for(let r in this.sources[e])if(this.sources[e][r].service){if(typeof this.sources[e][r].service=="object"){if(this.sources[e][r].service.__node.tag===s){if(this.sources[e][r].connectionType&&this.sources[e][r].service?.name&&!this.serviceConnections[this.sources[e][r].service.name]){this.removeConnection(this.sources[e][r]);continue}return this.sources[e][r]}}else if(this.sources[e][r].service===s){if(this.sources[e][r].connectionType&&this.sources[e][r].service?.name){this.serviceConnections[this.sources[e][r].service.name]||this.removeConnection(this.sources[e][r]);continue}return this.sources[e][r]}}}else for(let t in this.sources[e]){if(this.sources[e][t].connectionType&&this.sources[e][t].service?.name&&!this.serviceConnections[this.sources[e][t].service.name]){this.removeConnection(this.sources[e][t]);continue}return i&&this.sources[e][t][i]?this.sources[e][t]:this.sources[e][t]}else if(this.order)for(let t=0;t<this.order.length;t++){let s=this.order[t];if(this.sources[s]?.[e]){if(this.sources[s][e].connectionType&&this.sources[s][e].service?.name&&!this.serviceConnections[this.sources[s][e].service.service.name]){this.removeConnection(this.sources[s][e].service);continue}return i&&this.sources[s][e]?.[i]?this.sources[s][e]:this.sources[s][e]}}if(typeof e=="string"&&this.connections[e]&&this.connections[e].send)return this.connections[e]};this.getConnections=(e,i,t)=>{if(this.sources[e]){if(!t&&!i)return this.sources[e];let s={};for(let r in this.sources[e])if(typeof this.sources[e][r]=="object"){if(this.sources[e][r]._id){let a=!0;i&&!this.sources[e][r][i]&&(a=!1);for(let f in t)if(typeof this.sources[e][r][f]=="object"&&typeof t[f]=="object"){for(let c in t[f])if(t[f][c]!==this.sources[e][r][f][c]){a=!1;break}}else if(this.sources[e][r][f]!==t[f])a=!1;else{a=!1;break}a&&this.getConnection(this.sources[e][r],i)&&(s[this.sources[e][r]._id]=this.sources[e][r])}else for(let a in this.sources[e][r])if(typeof this.sources[e][r][a]=="object"){let f=!0;i&&!this.sources[e][r][a][i]&&(f=!1);for(let c in t)if(typeof this.sources[e][r][a][c]=="object"&&typeof t[c]=="object"){for(let y in t[c])if(t[c][y]!==this.sources[e][r][a][c][y]){f=!1;break}}else if(this.sources[e][r][a][c]!==t[c])f=!1;else{f=!1;break}f&&(s[this.sources[e][r][a]._id]=this.sources[e][r][a])}}}};this.addConnection=(e,i)=>{let t={};if(typeof e=="string"){if(this.connections[e])e=this.connections[e];else for(let s in this.serviceConnections)for(let r in this.serviceConnections[s])if(this.serviceConnections[s][r][e]){e={connection:this.serviceConnections[s][r][e]},e.service=s,t.connectionType=s,t.connectionsKey=r;break}typeof e=="string"&&this.__node.nodes.get(e)&&(e={connection:this.__node.nodes.get(e)})}if(!(!e||typeof e=="string")){if(i&&(t.source=i),e.connection instanceof g){t.connection=e.connection;let s=t.connection;if(t.send=async r=>r.method?Array.isArray(r.args)?s[r.method]?.(...r.args):s[r.method]?.(r.args):s.__operator?Array.isArray(r.args)?s.__operator(...r.args):s.__operator(r.args):void 0,t.request=async(r,a)=>a?Array.isArray(r.args)?s[a]?.(...r.args):s[a]?.(r.args):s.__operator?Array.isArray(r.args)?s.__operator(...r.args):s.__operator(r.args):void 0,t.post=async(r,a,f)=>{if(r&&s.__node.graph.get(r)){let c=s.__node.graph.get(r);return f?Array.isArray(a)?c[f]?.(...a):c[f]?.(a):Array.isArray(a)?c.__operator(...a):c.__operator(a)}else return f?Array.isArray(a)?s[f]?.(...a):s[f]?.(a):Array.isArray(a)?s.__operator(...a):s.__operator(a)},t.run=t.post,t.subscribe=async(r,a)=>s.__subscribe(a,r),t.unsubscribe=async(r,a)=>s.__unsubscribe(a,void 0,r),t.terminate=()=>(s.__node.graph.remove(s),!0),t.onclose=e.onclose,t.onclose){let r;s.__ondisconnected&&(r=s.__ondisconnected),s.__ondisconnected=a=>{t.onclose&&t.onclose(t,a),r&&r(a)}}}else if(e.connection instanceof m){e.connection.__node.nodes.get("open")&&(t.service=e.connection);let s=t.connection;t.send=async r=>{Array.isArray(r.args)?s.run(r.route,...r.args):s.run(r.route,r.args)},t.request=async(r,a)=>{if(!!r.route)return a?Array.isArray(r.args)?s.__node.nodes.get(r.route)[a]?.(...r.args):s.__node.nodes.get(r.route)[a]?.(r.args):Array.isArray(r.args)?s.run(r.route,...r.args):s.run(r.route,r.args)},t.post=async(r,a,f)=>{if(r&&s.get(r)){let c=s.get(r);return f?Array.isArray(a)?c[f]?.(...a):c[f]?.(a):Array.isArray(a)?c.run(...a):c.run(a)}},t.run=t.post,t.subscribe=async(r,a)=>s.subscribe(r,void 0,a),t.unsubscribe=async(r,a)=>s.unsubscribe(r,void 0,a),t.terminate=r=>(s.remove(r),!0)}else if(!(e._id&&this.connections[e._id])){let s=e.connection;if(typeof s=="string"){if(this.connections[s])s=this.connections[s];else if(e.service){if(typeof e.service=="string"&&(e.service=this.services[e.service]),typeof e.service=="object"&&e.service.connections){for(let r in e.service.connections)if(e.service.connections[r][s]){s=e.service.connections[r][s],t.connectionType=r,t.connectionsKey=s;break}}}else for(let r in this.serviceConnections)for(let a in this.serviceConnections[r])if(this.serviceConnections[r][a][s]){s=this.serviceConnections[r][a][s],e.service=r,t.connectionType=r,t.connectionsKey=a;break}}if(typeof s!="object")return;if(t._id=s._id,t.send=s.send,t.request=s.request,t.run=s.run,t.post=s.post,t.subscribe=s.subscribe,t.unsubscribe=s.unsubscribe,t.terminate=s.terminate,t.onclose=e.onclose,t.onclose){if(!(s.onclose&&t.onclose.toString()===s.onclose.toString())){let r=s.onclose;s.onclose=(...a)=>{t.onclose&&t.onclose(t,...a),this.users[t.source]&&Object.keys(this.sources[t.source]).length===0&&this.removeUser(t.source,!1),r&&r(...a)}}}else{let r=s.onclose;s.onclose=(...a)=>{this.removeConnection(t),this.users[t.source]&&Object.keys(this.sources[t.source]).length===0&&this.removeUser(t.source,!1),r&&r(...a)}}e.service?(typeof e.service=="string"&&(e.service=this.services[e.service]),t.service=e.service):s.graph&&(t.service=s.graph)}return!t.source&&e.source?t.source=e.source:!t.source&&e.service?t.source=typeof e.service=="object"?e.service?.name:void 0:!t.source&&(t.connection instanceof g||t.connection instanceof m)&&(t.source="local",this.order.indexOf("local")||this.order.unshift("local")),t._id||(t._id=`connection${Math.floor(Math.random()*1e15)}`),t.source&&(this.sources[t.source]||(this.sources[t.source]={}),this.sources[t.source][t._id]=t),this.connections[t._id]||(this.connections[t._id]=t),t}};this.removeConnection=(e,i=!1)=>{if(typeof e=="object"&&e._id&&(e=e._id),typeof e=="string"){if(this.connections[e]){i&&this.connections[e]&&this.connections[e].terminate(),delete this.connections[e];for(let t in this.sources)if(this.sources[t][e])delete this.sources[t][e];else for(let s in this.sources[t])this.sources[t][s]?.[e]&&delete this.sources[t][e];return!0}else if(this.sources[e]){for(let t in this.sources[e])this.removeConnection(this.sources[e][t],i);return!0}}};this.addService=(e,i,t,s,r)=>{if(this.setTree(e),this.services[e.name]=e,i)if(typeof i=="string")this.addServiceConnections(e,i,s);else for(let a in i)this.addServiceConnections(e,a,s);t&&this.syncServices(),r?this.order=r:(this.order||(this.order=[]),this.order.push(e.name))};this.addServiceConnections=(e,i,t)=>{if(typeof e=="string"&&(e=this.services[e]),i&&e[i]){let s={};this.serviceConnections[e.name]||(this.serviceConnections[e.name]={}),this.serviceConnections[e.name][i]=e[i];for(let r in e[i])this.connections[r]||(s[r]=this.addConnection({connection:e[i][r],service:e},t),s[r].connectionType=i);return s}};this.openConnection=async(e,i,t,...s)=>{if(typeof e=="string"&&(e=this.services[e]),e instanceof G){let r=e.run("open",i,...s);if(r instanceof Promise)return r.then(async a=>{a._id||await new Promise((f,c)=>{let y=performance.now(),l=()=>{a._id?f(!0):performance.now()-y>3e3?c(!1):setTimeout(()=>{l()},100)};l()}).catch(f=>{console.error("Connections timed out:",f)}),a._id&&this.addConnection({connection:a,service:e},t)});if(r&&(r._id||await new Promise((a,f)=>{let c=performance.now(),y=()=>{r._id?a(!0):performance.now()-c>3e3?f(!1):setTimeout(()=>{y()},100)};y()}).catch(a=>{console.error("Connections timed out:",a)}),r._id))return this.addConnection({connection:r,service:e},t)}};this.terminate=e=>(typeof e=="string"&&(e=this.connections[e]),e.terminate());this.subscribeThroughConnection=(e,i,t,s,r,...a)=>{if(typeof i=="string"&&(i=this.getConnection(i,"run")),typeof i=="object")return new Promise((f,c)=>{i.run("routeConnections",[e,t,i._id,...a]).then(y=>{this.subscribe(t,r,l=>{l?.callbackId===e&&(s?typeof s=="string"?this.setState({[s]:l.args}):s(l.args):this.setState({[t]:l.args}))}),f(y)}).catch(c)})};this.routeConnections=(e,i,t,...s)=>{let r;if(typeof t=="string"&&(this.sources[t]&&(r=t),t=this.getConnection(t,"send")),typeof i=="string"&&(i=this.getConnection(i,"subscribe")),i?.subscribe&&t?.send)return new Promise((f,c)=>{i.subscribe(e,i._id,y=>{!this.connections[t._id]&&r&&this.sources[r]&&(r=t,Object.keys(this.sources[r]).forEach(l=>{this.sources[t][l].send&&(t=this.sources[t][l])})),this.connections[t._id]&&t.send({callbackId:e,args:y})},...s).then(y=>{f(y)})})};this.syncServices=()=>{for(let e in this.services)"users"in this.services[e]&&(this.services[e].users=this.users),this.__node.nodes.forEach((i,t)=>{this.services[e].__node.nodes.get(i.tag)?!this.services[e].__node.nodes.get(t)&&i._UNIQUE!==this.services[e].__node.nodes.get(i.tag)._UNIQUE&&this.services[e].__node.nodes.set(t,i):this.services[e].__node.nodes.set(i.tag,i)})};this.setUserData=(e,i)=>{if(e&&typeof e=="string"&&(e=this.users[e],!e))return!1;if(i&&typeof i=="string"&&(i=JSON.parse(i)),typeof i=="object")return this.recursivelyAssign(e,i),!0};if(this.setTree(this),e&&(e.order&&(this.order=e.order),e.services))for(let i in e.services){let t=e.services[i];if(t instanceof G)t.name=i,t.__node.tag=i,this.addService(t,t.connections,e.syncServices);else if(typeof t=="function"){let s=new t;s.name=i,s.__node.tag=i,s instanceof G&&this.addService(s,s.connections,e.syncServices)}else{if(typeof t?.service=="function"){let s=new t.service({name:i});s.name=i,s.__node.tag=i,s&&this.addService(s),t.service=s}else t?.service instanceof G&&(t.service.name=i,t.service.tag=i,this.addService(t.service,e.syncServices));if(typeof t?.service=="object"&&(t.connections&&(Array.isArray(t.connections)?t.connections.forEach(s=>{this.addServiceConnections(t[i].service,s)}):this.addServiceConnections(t.service,t.connections)),t.config))for(let s in t.config)this.openConnection(t.service,t.config[s],t.config[s].source,t.config[s].args)}}}removeUser(e,i){return i&&this.removeConnection(e,i),typeof e=="string"&&(e=this.users[e]),typeof e=="object"&&e._id&&(delete this.users[e._id],e.onclose&&e.onclose(e)),!0}};})();
