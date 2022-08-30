(()=>{function O(h=""){let e=n=>n.replace(/^\W*(function[^{]+\{([\s\S]*)\}|[^=]+=>[^{]*\{([\s\S]*)\}|[^=]+=>(.+))/i,"$2$3$4"),i=(n=>{let a=n.indexOf("=>")+1;return a<=0&&(a=n.indexOf("){")),a<=0&&(a=n.indexOf(") {")),n.slice(0,n.indexOf("{",a)+1)})(h),s=e(h),r;if(i.includes("function")){let n=i.split("(")[1].split(")")[0];r=new Function(n,s)}else if(i.substring(0,6)===s.substring(0,6)){let n=i.split("(")[1].split(")")[0];r=new Function(n,s.substring(s.indexOf("{")+1,s.length-1))}else try{r=(0,eval)(i+s+"}")}catch{}return r}var m={pushToState:{},data:{},triggers:{},setState(h){Object.assign(m.data,h);for(let e of Object.getOwnPropertyNames(h))m.triggers[e]&&m.triggers[e].forEach(t=>t.onchange(m.data[e]));return m.data},subscribeTrigger(h,e){if(h){m.triggers[h]||(m.triggers[h]=[]);let t=m.triggers[h].length;return m.triggers[h].push({idx:t,onchange:e}),m.triggers[h].length-1}else return},unsubscribeTrigger(h,e){let t,i=m.triggers[h];if(i)if(!e)delete m.triggers[h];else return i.find(r=>{if(r.idx===e)return!0})&&i.splice(t,1),!0},subscribeTriggerOnce(h,e){let t,i=s=>{e(s),m.unsubscribeTrigger(h,t)};t=m.subscribeTrigger(h,i)}};function S(h){for(let e in h)e!=="_state"&&(this._state[e]=h[e],Object.defineProperty(this,e,{get:()=>this._state[e],set:t=>this._state[e]=t,enumerable:!0}))}var p=class{constructor(e={},t,i){this.nodes=new Map;this._initial={};this._state={};this._unique=Math.random();this.state=m;this.isLooping=!1;this.isAnimating=!1;this.looper=void 0;this.animation=void 0;this.forward=!0;this.backward=!1;this.runSync=!1;this.firstRun=!0;this.DEBUGNODE=!1;this.merge=S;this.operator=(...e)=>e;this.runOp=(...e)=>{this.DEBUGNODE&&console.time(this.tag);let t=this.operator(...e);return t instanceof Promise?t.then(i=>(i!==void 0&&this.setState({[this.tag]:i}),this.DEBUGNODE&&(console.timeEnd(this.tag),t!==void 0&&console.log(`${this.tag} result:`,t)),i)):(t!==void 0&&this.setState({[this.tag]:t}),this.DEBUGNODE&&(console.timeEnd(this.tag),t!==void 0&&console.log(`${this.tag} result:`,t))),t};this.setOperator=e=>(typeof e!="function"||(this.operator=e.bind(this)),e);this.runAsync=(...e)=>new Promise((t,i)=>{t(this.run(...e))});this.transformArgs=(e=[])=>e;this.isRunSync=()=>!(this.children&&this.forward||this.parent&&this.backward||this.repeat||this.delay||this.frame||this.recursive||this.branch);this.run=(...e)=>{if(typeof this.transformArgs=="function"&&(e=this.transformArgs(e,this)),!(this.firstRun&&(this.firstRun=!1,this.runSync=this.isRunSync(),this.animate&&!this.isAnimating&&this.runAnimation(this.animation,e),this.loop&&typeof this.loop=="number"&&!this.isLooping&&this.runLoop(this.looper,e),this.loop||this.animate)))return this.runSync?this.runOp(...e):new Promise(async t=>{if(this){let i=(r,n=0,...a)=>new Promise(async o=>{n++;let c=await r.runOp(...a);if(r.repeat){for(;n<r.repeat;){if(r.delay){setTimeout(async()=>{o(await i(r,n,...a))},r.delay);break}else if(r.frame&&window?.requestAnimationFrame){requestAnimationFrame(async()=>{o(await i(r,n,...a))});break}else c=await r.runOp(...a);n++}if(n===r.repeat){o(c);return}}else if(r.recursive){for(;n<r.recursive;){if(r.delay){setTimeout(async()=>{o(await i(r,n,...c))},r.delay);break}else if(r.frame&&window?.requestAnimationFrame){requestAnimationFrame(async()=>{o(await i(r,n,...c))});break}else c=await r.runOp(...c);n++}if(n===r.recursive){o(c);return}}else{o(c);return}}),s=async()=>{let r=await i(this,void 0,...e);return r!==void 0&&(this.backward&&this.parent instanceof p&&(Array.isArray(r)?await this.runParent(this,...r):await this.runParent(this,r)),this.children&&this.forward&&(Array.isArray(r)?await this.runChildren(this,...r):await this.runChildren(this,r)),this.branch&&this.runBranch(this,r)),r};this.delay?setTimeout(async()=>{t(await s())},this.delay):this.frame&&window?.requestAnimationFrame?requestAnimationFrame(async()=>{t(await s())}):t(await s())}else t(void 0)})};this.runParent=async(e,...t)=>{e.backward&&e.parent&&(typeof e.parent=="string"&&(e.graph&&e.graph?.get(e.parent)?(e.parent=e.graph,e.parent&&this.nodes.set(e.parent.tag,e.parent)):e.parent=this.nodes.get(e.parent)),e.parent instanceof p&&await e.parent.run(...t))};this.runChildren=async(e,...t)=>{if(typeof e.children=="object")for(let i in e.children)typeof e.children[i]=="string"?(e.graph&&e.graph?.get(e.children[i])&&(e.children[i]=e.graph.get(e.children[i]),e.nodes.get(e.children[i].tag)||e.nodes.set(e.children[i].tag,e.children[i])),!e.children[i]&&e.nodes.get(e.children[i])&&(e.children[i]=e.nodes.get(e.children[i]))):(typeof e.children[i]>"u"||e.children[i]===!0)&&(e.graph&&e.graph?.get(i)&&(e.children[i]=e.graph.get(i),e.nodes.get(e.children[i].tag)||e.nodes.set(e.children[i].tag,e.children[i])),!e.children[i]&&e.nodes.get(i)&&(e.children[i]=e.nodes.get(i))),e.children[i]?.runOp&&await e.children[i].run(...t)};this.runBranch=async(e,t)=>{if(e.branch){let i=Object.keys(e.branch);await Promise.all(i.map(async s=>{typeof e.branch[s].if=="object"&&(e.branch[s].if=j(e.branch[s].if));let r=!1;return typeof e.branch[s].if=="function"?r=e.branch[s].if(t):typeof t=="object"?j(t)===e.branch[s].if&&(r=!0):t===e.branch[s].if&&(r=!0),r&&(e.branch[s].then.run?Array.isArray(t)?await e.branch[s].then.run(...t):await e.branch[s].then.run(...t):typeof e.branch[s].then=="function"?Array.isArray(t)?await e.branch[s].then(...t):await e.branch[s].then(t):typeof e.branch[s].then=="string"&&(e.graph?e.branch[s].then=e.graph.nodes.get(e.branch[s].then):e.branch[s].then=e.nodes.get(e.branch[s].then),e.branch[s].then.run&&(Array.isArray(t)?await e.branch[s].then.run(...t):await e.branch[s].then.run(...t)))),r}))}};this.runAnimation=(e=this.animation,t=[])=>{if(this.animation=e,e||(this.animation=this.operator),this.animate&&!this.isAnimating&&"requestAnimationFrame"in window){this.isAnimating=!0;let i=async()=>{if(this.isAnimating){this.DEBUGNODE&&console.time(this.tag);let s=this.animation.call(this,...t);s instanceof Promise&&(s=await s),this.DEBUGNODE&&(console.timeEnd(this.tag),s!==void 0&&console.log(`${this.tag} result:`,s)),s!==void 0&&(this.tag&&this.setState({[this.tag]:s}),this.backward&&this.parent?.run&&(Array.isArray(s)?await this.runParent(this,...s):await this.runParent(this,s)),this.children&&this.forward&&(Array.isArray(s)?await this.runChildren(this,...s):await this.runChildren(this,s)),this.branch&&this.runBranch(this,s),this.setState({[this.tag]:s})),requestAnimationFrame(i)}};requestAnimationFrame(i)}};this.runLoop=(e=this.looper,t=[],i=this.loop)=>{if(this.looper=e,e||(this.looper=this.operator),typeof i=="number"&&!this.isLooping){this.isLooping=!0;let s=async()=>{if(this.isLooping){this.DEBUGNODE&&console.time(this.tag);let r=this.looper.call(this,...t);r instanceof Promise&&(r=await r),this.DEBUGNODE&&(console.timeEnd(this.tag),r!==void 0&&console.log(`${this.tag} result:`,r)),r!==void 0&&(this.tag&&this.setState({[this.tag]:r}),this.backward&&this.parent?.run&&(Array.isArray(r)?await this.runParent(this,...r):await this.runParent(this,r)),this.children&&this.forward&&(Array.isArray(r)?await this.runChildren(this,...r):await this.runChildren(this,r)),this.branch&&this.runBranch(this,r),this.setState({[this.tag]:r})),setTimeout(async()=>{await s()},i)}};s()}};this.setParent=e=>{this.parent=e,this.backward&&(this.runSync=!1)};this.setChildren=e=>{this.children=e,this.forward&&(this.runSync=!1)};this.add=(e={})=>(typeof e=="function"&&(e={operator:e}),e instanceof p||(e=new p(e,this,this.graph)),this.nodes.set(e.tag,e),this.graph&&(this.graph.nodes.set(e.tag,e),this.graph.nNodes=this.graph.nodes.size),e);this.remove=e=>{typeof e=="string"&&(e=this.nodes.get(e)),e?.tag&&(this.nodes.delete(e.tag),this.children[e.tag]&&delete this.children[e.tag],this.graph&&(this.graph.nodes.delete(e.tag),this.graph.nNodes=this.graph.nodes.size),this.nodes.forEach(t=>{t.nodes.get(t.tag)&&(t.nodes.delete(t.tag),t.children[t.tag]&&delete t.children[t.tag],t.parent?.tag===t.tag&&delete t.parent)}),e.ondelete&&e.ondelete(e))};this.append=(e,t=this)=>{typeof e=="string"&&(e=this.nodes.get(e)),e?.nodes&&(t.addChildren(e),e.forward&&(e.runSync=!1))};this.subscribe=(e,t=this.tag)=>e.run?this.subscribeNode(e):this.state.subscribeTrigger(t,e);this.unsubscribe=(e,t=this.tag)=>this.state.unsubscribeTrigger(t,e);this.addChildren=e=>{this.children||(this.children={}),typeof e=="object"&&Object.assign(this.children,e),this.convertChildrenToNodes(),this.forward&&(this.runSync=!1)};this.callParent=(...e)=>{if(typeof this.parent=="string"&&(this.graph&&this.graph?.get(this.parent)?(this.parent=this.graph,this.parent&&this.nodes.set(this.parent.tag,this.parent)):this.parent=this.nodes.get(this.parent)),typeof this.parent?.operator=="function")return this.parent.runOp(...e)};this.callChildren=(...e)=>{let t;if(typeof this.children=="object")for(let i in this.children)this.children[i]?.runOp&&this.children[i].runOp(...e);return t};this.getProps=(e=this)=>({tag:e.tag,operator:e.operator,graph:e.graph,children:e.children,parent:e.parent,forward:e.forward,backward:e.bacward,loop:e.loop,animate:e.animate,frame:e.frame,delay:e.delay,recursive:e.recursive,repeat:e.repeat,branch:e.branch,oncreate:e.oncreate,DEBUGNODE:e.DEBUGNODE,...this._initial});this.setProps=(e={})=>{let t=Object.assign({},e);t.children&&(this.addChildren(e.children),delete t.children),t.operator&&(this.setOperator(e.operator),delete t.operator),Object.assign(t,e),this.runSync=this.isRunSync()};this.removeTree=e=>{if(e&&typeof e=="string"&&(e=this.nodes.get(e)),e?.nodes){let t={},i=s=>{if(typeof s.children=="object"&&!t[s.tag]){t[s.tag]=!0;for(let r in s.children)s.children[r].stopNode&&s.children[r].stopNode(),s.children[r].tag&&(this.nodes.get(s.children[r].tag)&&this.nodes.delete(s.children[r].tag),this.nodes.forEach(n=>{n.nodes.get(s.children[r].tag)&&n.nodes.delete(s.children[r].tag),n.children[r]instanceof p&&delete n.children[r]}),i(s.children[r]))}};e.stopNode&&e.stopNode(),e.tag&&(this.nodes.delete(e.tag),this.children[e.tag]&&delete this.children[e.tag],this.parent?.tag===e.tag&&delete this.parent,this[e.tag]instanceof p&&delete this[e.tag],this.nodes.forEach(s=>{s?.tag&&(s.nodes.get(s.tag)&&s.nodes.delete(s.tag),s.children[s.tag]instanceof p&&delete s.children[s.tag])}),i(e),this.graph?this.graph.removeTree(e,t):e.ondelete&&e.ondelete(e))}};this.checkNodesHaveChildMapped=(e,t,i={})=>{let s=e.tag;s||(s=e.name),i[s]||(i[s]=!0,e.children&&t.tag in e.children&&e.children[t.tag]instanceof p&&(e.nodes.get(t.tag)||e.nodes.set(t.tag,t),e.children[t.tag]=t,e.firstRun||(e.firstRun=!0)),e.parent instanceof p&&(e.nodes.get(t.tag)&&e.parent.nodes.set(t.tag,t),e.parent.children?this.checkNodesHaveChildMapped(e.parent,t,i):e.nodes&&e.nodes.forEach(r=>{i[r.tag]||this.checkNodesHaveChildMapped(r,t,i)})),e.graph&&e.parent&&e.parent.name!==e.graph.name&&e.graph.nodes.forEach(r=>{i[r.tag]||this.checkNodesHaveChildMapped(r,t,i)}))};this.convertChildrenToNodes=(e=this)=>{if(e?.children){for(let t in e.children)if(!(e.children[t]instanceof p))if(typeof e.children[t]=="object")e.children[t].tag||(e.children[t].tag=t),e.nodes.get(e.children[t].tag)||(e.children[t]=new p(e.children[t],e,e.graph),this.checkNodesHaveChildMapped(e,e.children[t]));else{if(typeof e.children[t]>"u"||e.children[t]==!0)e.children[t]=e.graph.get(t),e.children[t]||(e.children[t]=e.nodes.get(t));else if(typeof e.children[t]=="string"){let i=e.children[t];e.children[t]=e.graph.get(i),e.children[t]||(e.children[t]=e.nodes.get(t))}e.children[t]instanceof p&&(e.nodes.set(e.children[t].tag,e.children[t]),this.checkNodesHaveChildMapped(e,e.children[t]),e.children[t].tag in e||(e[e.children[t].tag]=e.children[t]))}}return e.children};this.stopLooping=(e=this)=>{e.isLooping=!1};this.stopAnimating=(e=this)=>{e.isAnimating=!1};this.stopNode=(e=this)=>{e.stopAnimating(e),e.stopLooping(e)};this.subscribeNode=e=>{if(typeof e=="string"&&(e=this.nodes.get(e)),e.tag&&this.nodes.set(e.tag,e),e)return this.state.subscribeTrigger(this.tag,t=>{Array.isArray(t)?e.run(...t):e.run(t)})};this.print=(e=this,t=!0,i=[])=>{let s=new p;if(typeof e=="string"&&(e=this.nodes.get(e)),e instanceof p){i.push(e.tag);let r={tag:e.tag,operator:e.operator.toString()};if(e.parent&&(r.parent=e.parent.tag),typeof e.children=="object")for(let n in e.children)return typeof e.children[n]=="string"?e.children[n]:i.includes(e.children[n].tag)?e.children[n].tag:t?e.children[n].print(e.children[n],t,i):e.children[n].tag;for(let n in e)n==="parent"||n==="children"||typeof s[n]>"u"&&(typeof e[n]=="function"?r[n]=e[n].toString():typeof e[n]=="object"?r[n]=JSON.stringifyWithCircularRefs(e[n]):r[n]=e[n]);return JSON.stringify(r)}};this.reconstruct=e=>{let t=A(e);if(t)return this.add(t)};this.setState=this.state.setState;this.DEBUGNODES=(e=!0)=>{this.DEBUGNODE=e,this.nodes.forEach(t=>{e?t.DEBUGNODE=!0:t.DEBUGNODE=!1})};if(typeof e=="function"&&(e={operator:e}),typeof e=="object"){if(e instanceof p&&e._initial&&Object.assign(e,e._initial),e instanceof b){let r=e;e={source:r,operator:n=>{if(typeof n=="object"){let a={};for(let o in n)typeof r[o]=="function"?Array.isArray(n[o])?a[o]=r[o](...n[o]):a[o]=r[o](n[o]):(r[o]=n[o],a[o]=r[o]);return a}return r}},r.operator&&(e.operator=r.operator),r.children&&(e.children=r.children),r.forward&&(e.forward=r.forward),r.backward&&(e.backward=r.backward),r.repeat&&(e.repeat=r.repeat),r.recursive&&(e.recursive=r.recursive),r.loop&&(e.loop=r.loop),r.animate&&(e.animate=r.animate),r.looper&&(e.looper=r.looper),r.animation&&(e.animation=r.animation),r.delay&&(e.delay=r.delay),r.tag&&(e.tag=r.tag),r.oncreate&&(e.oncreate=r.oncreate),r.node&&r.node._initial&&Object.assign(e,r.node._initial),r._initial&&Object.assign(e,r._initial),this.nodes=r.nodes,r.node=this,i&&r.nodes.forEach(n=>{i.nodes.get(n.tag)||(i.nodes.set(n.tag,n),i.nNodes++)})}if(e.tag&&(i||t)){let r;if(i?.nodes&&(r=i.nodes.get(e.tag)),!r&&t?.nodes&&(r=t.nodes.get(e.tag)),r){this.merge(r),this.source||(this.source=r);let n=r.getProps();delete n.graph,delete n.parent;for(let a in n)e[a]=n[a]}}e?.operator&&(e.operator=this.setOperator(e.operator)),!e.tag&&i?e.tag=`node${i.nNodes}`:e.tag||(e.tag=`node${Math.floor(Math.random()*1e10)}`);let s=Object.getOwnPropertyNames(this);for(let r in e)s.includes(r)||(this._initial[r]=e[r]);if(e.children&&(this._initial.children=Object.assign({},e.children)),this.merge(e),this.tag||(i?this.tag=`node${i.nNodes}`:this.tag=`node${Math.floor(Math.random()*1e10)}`),i&&(this.graph=i,i.nodes.get(this.tag)&&(this.tag=`${this.tag}${i.nNodes+1}`),i.nodes.set(this.tag,this),i.nNodes++),t&&(this.parent=t,(t instanceof p||t instanceof b)&&t.nodes.set(this.tag,this)),typeof e.tree=="object")for(let r in e.tree){typeof e.tree[r]=="object"&&(!e.tree[r]).tag&&(e.tree[r].tag=r);let n=new p(e.tree[r],this,i);this.nodes.set(n.tag,n)}this.children&&this.convertChildrenToNodes(this),(this.parent instanceof p||this.parent instanceof b)&&this.checkNodesHaveChildMapped(this.parent,this),typeof this.oncreate=="function"&&this.oncreate(this),this.firstRun||(this.firstRun=!0)}else return e}},b=class{constructor(e,t,i){this.nNodes=0;this.nodes=new Map;this.state=m;this._state={};this._unique=Math.random();this.tree={};this.merge=S;this.add=(e={})=>{let t=e;return e instanceof p?(this.nNodes=this.nodes.size,e.tag&&(this.tree[e.tag]=t,this.nodes.set(e.tag,e))):e=new p(t,this,this),e};this.setTree=(e=this.tree)=>{if(!!e){for(let t in e){let i=this.nodes.get(t);if(i){if(typeof e[t]=="function")i.setOperator(e[t]);else if(typeof e[t]=="object")if(e[t]instanceof p)this.add(e[t]);else if(e[t]instanceof b){let s=e[t],r={};s.operator&&(r.operator=s.operator),s.children&&(r.children=s.children),s.forward&&(r.forward=s.forward),s.backward&&(r.backward=s.backward),s.repeat&&(r.repeat=s.repeat),s.recursive&&(r.recursive=s.recursive),s.loop&&(r.loop=s.loop),s.animate&&(r.animate=s.animate),s.looper&&(r.looper=s.looper),s.animation&&(r.animation=s.animation),s.delay&&(r.delay=s.delay),s.tag&&(r.tag=s.tag),s.oncreate&&(r.oncreate=s.oncreate),s.node?._initial&&Object.assign(r,s.node._initial),r.nodes=s.nodes,r.source=s,i.setProps(r)}else i.setProps(e[t])}else if(typeof e[t]=="function")this.add({tag:t,operator:e[t]});else if(typeof e[t]=="object"&&!Array.isArray(e[t])){e[t].tag||(e[t].tag=t);let s=this.add(e[t]);e[t].aliases&&e[t].aliases.forEach(r=>{this.nodes.set(r,s)})}else this.add({tag:t,operator:(...s)=>e[t]})}this.nodes.forEach(t=>{if(typeof t.children=="object")for(let i in t.children)typeof t.children[i]=="string"?this.nodes.get(t.children[i])&&(t.children[i]=this.nodes.get(t.children[i])):(t.children[i]===!0||typeof t.children[i]>"u")&&this.nodes.get(i)&&(t.children[i]=this.nodes.get(i)),t.children[i]instanceof p&&t.checkNodesHaveChildMapped(t,t.children[i]);typeof t.parent=="string"&&this.nodes.get(t.parent)&&(t.parent=this.nodes.get(t.parent),t.nodes.set(t.parent.tag,t.parent))})}};this.get=e=>this.nodes.get(e);this.set=e=>this.nodes.set(e.tag,e);this.run=(e,...t)=>{if(typeof e=="string"&&(e=this.nodes.get(e)),e?.run)return e.run(...t)};this.runAsync=(e,...t)=>(typeof e=="string"&&(e=this.nodes.get(e)),e?.run?new Promise((i,s)=>{i(e.run(...t))}):new Promise((i,s)=>{i(void 0)}));this.removeTree=(e,t)=>{if(typeof e=="string"&&(e=this.nodes.get(e)),e?.nodes){t||(t={});let i=s=>{s.children&&!t[s.tag]&&(t[s.tag]=!0,Array.isArray(s.children)?s.children.forEach(r=>{r.stopNode&&r.stopNode(),r.tag&&this.nodes.get(r.tag)&&this.nodes.delete(r.tag),this.nodes.forEach(n=>{n.nodes.get(r.tag)&&n.nodes.delete(r.tag)}),i(r)}):typeof s.children=="object"&&(s.stopNode&&s.stopNode(),s.tag&&this.nodes.get(s.tag)&&this.nodes.delete(s.tag),this.nodes.forEach(r=>{r.nodes.get(s.tag)&&r.nodes.delete(s.tag)}),i(s)))};e.stopNode&&e.stopNode(),e.tag&&(this.nodes.delete(e.tag),this.nodes.forEach(s=>{s.nodes.get(s.tag)&&s.nodes.delete(s.tag)}),this.nNodes=this.nodes.size,i(e)),e.ondelete&&e.ondelete(e)}return e};this.remove=e=>(typeof e=="string"&&(e=this.nodes.get(e)),e?.nodes&&(e.stopNode&&e.stopNode(),e?.tag&&this.nodes.get(e.tag)&&(this.nodes.delete(e.tag),this.nodes.forEach(t=>{t.nodes.get(t.tag)&&t.nodes.delete(t.tag)})),e.ondelete&&e.ondelete(e)),e);this.append=(e,t)=>{t.addChildren(e)};this.callParent=async(e,...t)=>{if(e?.parent)return await e.callParent(...t)};this.callChildren=async(e,...t)=>{if(e?.children)return await e.callChildren(...t)};this.subscribe=(e,t)=>{if(!!t){if(e?.subscribe&&typeof t=="function")return e.subscribe(t);if(t instanceof p||typeof t=="string")return this.subscribeNode(e,t);if(typeof e=="string")return this.state.subscribeTrigger(e,t)}};this.unsubscribe=(e,t)=>this.state.unsubscribeTrigger(e,t);this.subscribeNode=(e,t)=>{let i;if(e?.tag?i=e.tag:typeof e=="string"&&(i=e),typeof t=="string"&&(t=this.nodes.get(t)),e&&t)return this.state.subscribeTrigger(i,r=>{Array.isArray(r)?t.run(...r):t.run(r)})};this.stopNode=e=>{typeof e=="string"&&(e=this.nodes.get(e)),e?.stopNode&&e.stopNode()};this.print=(e,t=!0)=>{if(e?.print)return e.print(e,t);{let i="{";return this.nodes.forEach(s=>{i+=`
"${s.tag}:${s.print(s,t)}"`}),i}};this.reconstruct=e=>{let t=A(e);if(t)return this.add(t)};this.create=(e,t,i)=>M(e,t,i,this);this.setState=this.state.setState;this.DEBUGNODES=(e=!0)=>{this.nodes.forEach(t=>{e?t.DEBUGNODE=!0:t.DEBUGNODE=!1})};this.tag=t||`graph${Math.floor(Math.random()*1e11)}`,i&&(this.merge(i),this._initial=i),(e||Object.keys(this.tree).length>0)&&this.setTree(e)}};function C(h,e,t){let i=A(h);if(i)return new p(i,e,t)}function A(h="{}"){try{let e=typeof h=="string"?JSON.parse(h):h,t=i=>{for(let s in i)if(typeof i[s]=="string"){let r=O(i[s]);typeof r=="function"&&(i[s]=r)}else typeof i[s]=="object"&&t(i[s]);return i};return t(e)}catch(e){console.error(e);return}}var w=function(){let h=new Map,e=[],t=["this"];function i(){h.clear(),e.length=0,t.length=1}function s(n,a){var o=e.length-1,c=e[o];if(typeof c=="object")if(c[n]===a||o===0)t.push(n),e.push(a.pushed);else for(;o-->=0;){if(c=e[o],typeof c=="object"&&c[n]===a){o+=2,e.length=o,t.length=o,--o,e[o]=a,t[o]=n;break}o--}}function r(n,a){if(a!=null&&typeof a=="object"){n&&s(n,a);let o=h.get(a);if(o)return"[Circular Reference]"+o;h.set(a,t.join("."))}return a}return function(a,o){try{return e.push(a),JSON.stringify(a,r,o)}finally{i()}}}();JSON.stringifyWithCircularRefs===void 0&&(JSON.stringifyWithCircularRefs=w);var j=function(){let h=new Map,e=[],t=["this"];function i(){h.clear(),e.length=0,t.length=1}function s(n,a){var o=e.length-1;if(e[o]){var c=e[o];if(typeof c=="object")if(c[n]===a||o===0)t.push(n),e.push(a.pushed);else for(;o-->=0;){if(c=e[o],typeof c=="object"&&c[n]===a){o+=2,e.length=o,t.length=o,--o,e[o]=a,t[o]=n;break}o++}}}function r(n,a){let o;if(a!=null)if(typeof a=="object"){let c=a.constructor.name;n&&c==="Object"&&s(n,a);let f=h.get(a);if(f)return"[Circular Reference]"+f;if(h.set(a,t.join(".")),c==="Array")a.length>20?o=a.slice(a.length-20):o=a;else if(c.includes("Set"))o=Array.from(a);else if(c!=="Object"&&c!=="Number"&&c!=="String"&&c!=="Boolean")o="instanceof_"+c;else if(c==="Object"){let l={};for(let d in a)if(a[d]==null)l[d]=a[d];else if(Array.isArray(a[d]))a[d].length>20?l[d]=a[d].slice(a[d].length-20):l[d]=a[d];else if(a[d].constructor.name==="Object"){l[d]={};for(let g in a[d])if(Array.isArray(a[d][g]))a[d][g].length>20?l[d][g]=a[d][g].slice(a[d][g].length-20):l[d][g]=a[d][g];else if(a[d][g]!=null){let u=a[d][g].constructor.name;u.includes("Set")?l[d][g]=Array.from(a[d][g]):u!=="Number"&&u!=="String"&&u!=="Boolean"?l[d][g]="instanceof_"+u:l[d][g]=a[d][g]}else l[d][g]=a[d][g]}else{let g=a[d].constructor.name;g.includes("Set")?l[d]=Array.from(a[d]):g!=="Number"&&g!=="String"&&g!=="Boolean"?l[d]="instanceof_"+g:l[d]=a[d]}o=l}else o=a}else o=a;return o}return function(a,o){e.push(a);let c=JSON.stringify(a,r,o);return i(),c}}();JSON.stringifyFast===void 0&&(JSON.stringifyFast=j);function M(h,e,t,i){return typeof t=="object"?(t.operator=h,new p(t,e,i)):new p({operator:h},e,i)}var G=class extends b{constructor(t={}){super(void 0,t.name?t.name:`service${Math.floor(Math.random()*1e14)}`,t.props);this.routes={};this.loadDefaultRoutes=!1;this.keepState=!0;this.firstLoad=!0;this.customRoutes={};this.customChildren={};this.init=t=>{t?t=Object.assign({},t):t={},t.customRoutes?Object.assign(t.customRoutes,this.customRoutes):t.customRoutes=this.customRoutes,t.customChildren?Object.assign(t.customChildren,this.customChildren):t.customChildren=this.customChildren,Array.isArray(t.routes)?t.routes.forEach(i=>{this.load(i,t.includeClassName,t.routeFormat,t.customRoutes,t.customChildren)}):(t.routes||(Object.keys(this.routes).length>0||this.loadDefaultRoutes)&&this.firstLoad)&&this.load(t.routes,t.includeClassName,t.routeFormat,t.customRoutes,t.customChildren)};this.load=(t,i=!0,s=".",r,n)=>{if(!t&&!this.loadDefaultRoutes&&(Object.keys(this.routes).length>0||this.firstLoad))return;this.firstLoad&&(this.firstLoad=!1),r?r=Object.assign(this.customRoutes,r):r=this.customRoutes;let a,o={};if(t){if(!(t instanceof b)&&t?.name&&!t.setTree)if(t.module){let f=t;t={},Object.getOwnPropertyNames(t.module).forEach(l=>{i?t[f.name+s+l]=t.module[l]:t[l]=t.module[l]})}else typeof t=="function"&&(a=new t({loadDefaultRoutes:this.loadDefaultRoutes}),a.load(),t=a.routes,a.customRoutes&&!this.customRoutes?this.customRoutes=a.customRoutes:a.customRoutes&&this.customRoutes&&Object.assign(this.customRoutes,a.customRoutes),a.customChildren&&!this.customChildren?this.customChildren=a.customChildren:a.customChildren&&this.customChildren&&Object.assign(this.customChildren,a.customChildren));else if(t instanceof b||t.source instanceof b||t.setTree){if(a=t,t={},i){let f=a.name;f||(f=a.tag,a.name=f),f||(f=`graph${Math.floor(Math.random()*1e15)}`,a.name=f,a.tag=f)}a.customRoutes&&!this.customRoutes?this.customRoutes=a.customRoutes:a.customRoutes&&this.customRoutes&&Object.assign(this.customRoutes,a.customRoutes),a.customChildren&&!this.customChildren?this.customChildren=a.customChildren:a.customChildren&&this.customChildren&&Object.assign(this.customChildren,a.customChildren),a.nodes.forEach(f=>{t[f.tag]=f;let l={},d=(g,u)=>{if((!l[g.tag]||u&&i&&!l[u?.tag+s+g.tag])&&(u?l[u.tag+s+g.tag]=!0:l[g.tag]=!0,g instanceof b||g.source instanceof b||g.setTree)){if(i){let y=g.name;y||(y=g.tag,g.name=y),y||(y=`graph${Math.floor(Math.random()*1e15)}`,g.name=y,g.tag=y)}g.nodes.forEach(y=>{i&&!t[g.tag+s+y.tag]?t[g.tag+s+y.tag]=y:t[y.tag]||(t[y.tag]=y),d(y,g)})}};d(f)})}else if(typeof t=="object"){let f=t.constructor.name;if(f==="Object"&&(f=Object.prototype.toString.call(t),f&&(f=f.split(" ")[1]),f&&(f=f.split("]")[0])),f&&f!=="Object"){let l=t;t={},Object.getOwnPropertyNames(l).forEach(d=>{i?t[f+s+d]=l[d]:t[d]=l[d]})}}if((a instanceof b||a?.setTree)&&a.name&&i){t=Object.assign({},t);for(let f in t){let l=t[f];delete t[f],t[a.name+s+f]=l}}}if(this.loadDefaultRoutes){let f=Object.assign({},this.defaultRoutes);t?(Object.assign(f,this.routes),t=Object.assign(f,t)):t=Object.assign(f,this.routes),this.loadDefaultRoutes=!1}t||(t=this.routes);let c=0;for(let f in t){c++;let l=(d,g)=>{if(typeof d=="object"&&(d.tag||(d.tag=g),typeof d?.children=="object")){e:for(let u in d.children)if(c++,typeof d.children[u]=="object"){let y=d.children[u];if(y.tag&&o[y.tag])continue;if(n){for(let N in n)if(y=n[N](y,u,d,t,o),!y)continue e}y.id&&!y.tag&&(y.tag=y.id);let E;if(y.tag)if(o[y.tag]){let N=`${y.tag}${c}`;o[N]=y,y.tag=N,l(o[N],u),E=N}else o[y.tag]=y,l(o[y.tag],u),E=y.tag;else if(o[u]){let N=`${u}${c}`;o[N]=y,y.tag=N,l(o[N],u),E=N}else o[u]=y,l(o[u],u),E=u;a?.name&&i?(o[a.name+s+E]=y,delete o[E]):o[E]=y}}};o[f]=t[f],l(t[f],f)}e:for(let f in o)if(typeof o[f]=="object"){let l=o[f];if(typeof l=="object"){if(r){for(let d in r)if(l=r[d](l,f,o),!l)continue e}l.get&&l.get,l.post,l.delete,l.put,l.head,l.patch,l.options,l.connect,l.trace,l.post&&!l.operator?o[f].operator=l.post:!l.operator&&typeof l.get=="function"&&(o[f].operator=l.get)}}for(let f in t)typeof t[f]=="object"?this.routes[f]?typeof this.routes[f]=="object"?Object.assign(this.routes[f],t[f]):this.routes[f]=t[f]:this.routes[f]=t[f]:this.routes[f]?typeof this.routes[f]=="object"?Object.assign(this.routes[f],t[f]):this.routes[f]=t[f]:this.routes[f]=t[f];if(a)for(let f in this.routes)(this.routes[f]instanceof p||this.routes[f].constructor.name.includes("GraphNode"))&&(this.nodes.set(f,this.routes[f]),this.nNodes=this.nodes.size);else this.setTree(this.routes);for(let f in this.routes)this.routes[f]?.aliases&&this.routes[f].aliases.forEach(d=>{a?.name&&i?t[a.name+s+d]=this.routes[f]:t[d]=this.routes[f]});return this.routes};this.unload=(t=this.routes)=>{if(!t)return;let i;!(t instanceof G)&&typeof t=="function"?(i=new G,t=i.routes):t instanceof G&&(t=t.routes);for(let s in t)delete this.routes[s],this.nodes.get(s)&&this.remove(s);return this.routes};this.handleMethod=(t,i,s)=>{let r=i.toLowerCase(),n=this.nodes.get(t);return n||(n=this.routes[t],n||(n=this.tree[t])),n?.[r]?n[r]instanceof Function?n[r](s):(s&&(n[r]=s),n[r]):this.handleServiceMessage({route:t,args:s,method:i})};this.transmit=(...t)=>typeof t[0]=="object"?t[0].method?this.handleMethod(t[0].route,t[0].method,t[0].args):t[0].route?this.handleServiceMessage(t[0]):t[0].node?this.handleGraphNodeCall(t[0].node,t[0].args):(this.keepState&&(t[0].route&&this.setState({[t[0].route]:t[0].args}),t[0].node&&this.setState({[t[0].node]:t[0].args})),t):t;this.receive=(...t)=>{if(t[0]&&typeof t[0]=="string"){let i=t[0].substring(0,8);(i.includes("{")||i.includes("["))&&(i.includes("\\")&&(t[0]=t[0].replace(/\\/g,"")),t[0][0]==='"'&&(t[0]=t[0].substring(1,t[0].length-1)),t[0]=JSON.parse(t[0]))}return typeof t[0]=="object"?t[0].method?this.handleMethod(t[0].route,t[0].method,t[0].args):t[0].route?this.handleServiceMessage(t[0]):t[0].node?this.handleGraphNodeCall(t[0].node,t[0].args):(this.keepState&&(t[0].route&&this.setState({[t[0].route]:t[0].args}),t[0].node&&this.setState({[t[0].node]:t[0].args})),t):t};this.pipe=(t,i,s,r,n)=>{if(t instanceof p)return n?t.subscribe(a=>{let o=n(a);o!==void 0?this.transmit({route:i,args:o,method:r}):this.transmit({route:i,args:a,method:r},s)}):this.subscribe(t,a=>{this.transmit({route:i,args:a,method:r},s)});if(typeof t=="string")return this.subscribe(t,a=>{this.transmit({route:i,args:a,method:r},s)})};this.pipeOnce=(t,i,s,r,n)=>{if(t instanceof p)return n?t.state.subscribeTriggerOnce(t.tag,a=>{let o=n(a);o!==void 0?this.transmit({route:i,args:o,method:r}):this.transmit({route:i,args:a,method:r},s)}):this.state.subscribeTriggerOnce(t.tag,a=>{this.transmit({route:i,args:a,method:r},s)});if(typeof t=="string")return this.state.subscribeTriggerOnce(t,a=>{this.transmit({route:i,args:a,method:r},s)})};this.terminate=(...t)=>{this.nodes.forEach(i=>{i.stopNode()})};this.recursivelyAssign=(t,i)=>{for(let s in i)typeof i[s]=="object"?typeof t[s]=="object"?this.recursivelyAssign(t[s],i[s]):t[s]=this.recursivelyAssign({},i[s]):t[s]=i[s];return t};this.defaultRoutes={"/":{get:()=>this.print(),aliases:[""]},ping:()=>(console.log("ping"),"pong"),echo:(...t)=>(this.transmit(...t),t),assign:t=>typeof t=="object"?(Object.assign(this,t),!0):!1,recursivelyAssign:t=>typeof t=="object"?(this.recursivelyAssign(this,t),!0):!1,log:{post:(...t)=>{console.log("Log: ",...t)},aliases:["info"]},error:t=>{let i=new Error(t);return console.error(t),i},state:t=>t?this.state.data[t]:this.state.data,printState:t=>t?w(this.state.data[t]):w(this.state.data),spliceTypedArray:this.spliceTypedArray,transmit:this.transmit,receive:this.receive,load:this.load,unload:this.unload,pipe:this.pipe,terminate:this.terminate,run:this.run,subscribe:this.subscribe,subscribeNode:this.subscribeNode,unsubscribe:this.unsubscribe,stopNode:this.stopNode,get:this.get,add:this.add,remove:this.remove,setTree:this.setTree,setState:this.setState,print:this.print,reconstruct:this.reconstruct,handleMethod:this.handleMethod,handleServiceMessage:this.handleServiceMessage,handleGraphNodeCall:this.handleGraphNodeCall};t.name?this.name=t.name:t.name=this.tag,"loadDefaultRoutes"in t&&(this.loadDefaultRoutes=t.loadDefaultRoutes,this.routes=Object.assign(this.defaultRoutes,this.routes)),(t||Object.keys(this.routes).length>0)&&this.init(t)}handleServiceMessage(t){let i;return typeof t=="object"&&(t.route?i=t.route:t.node&&(i=t.node)),i?Array.isArray(t.args)?this.run(i,...t.args):this.run(i,t.args):t}handleGraphNodeCall(t,i){if(!t)return i;if(i?.args)this.handleServiceMessage(i);else return Array.isArray(i)?this.run(t,...i):this.run(t,i)}isTypedArray(t){return ArrayBuffer.isView(t)&&Object.prototype.toString.call(t)!=="[object DataView]"}spliceTypedArray(t,i,s){let r=t.subarray(0,i),n;s&&(n=t.subarray(s+1));let a;return(r.length>0||n?.length>0)&&(a=new t.constructor(r.length+n.length)),r.length>0&&a.set(r),n&&n.length>0&&a.set(n,r.length),a}};var B={setRoute:function(h,e){if(typeof h=="string"&&(h=O(h)),typeof h=="function"){if(e||(e=h.name),this.graph.get(e))this.graph.get(e).setOperator(h.bind(this.graph.get(e)));else{let t=this.graph.add({tag:e,operator:h});this.graph instanceof G&&this.graph.load({[e]:t})}return!0}return!1},setNode:function(h,e){return typeof h=="string"&&(h=O(h)),typeof h=="function"?(e||(e=h.name),this.graph.get(e)?this.graph.get(e).setOperator(h):this.graph.add({tag:e,operator:h}),!0):!1},setMethod:function(h,e,t){return typeof e=="string"&&(e=O(e)),typeof e=="function"?(t||(t=e.name),this.graph.get(h)?this.graph.get(h)[t]=e:this.graph.add({tag:t,[t]:e}),!0):!1},assignRoute:function(h,e){this.graph.get(h)&&typeof e=="object"&&Object.assign(this.graph.get(h),e)},transferClass:(h,e)=>{if(typeof h=="object"){let t=h.toString();return{route:"receiveClass",args:[t,e]}}return!1},receiveClass:function(h,e){if(typeof h=="string"&&h.indexOf("class")===0){let t=(0,eval)("("+h+")"),i=e;return i||(i=t.name),this.graph[i]=t,!0}return!1},setGlobal:(h,e)=>(globalThis[h]=e,!0),assignGlobalObject:(h,e)=>globalThis[h]?(typeof e=="object"&&Object.assign(globalThis[h],e),!0):!1,setValue:function(h,e){return this.graph[h]=e,!0},assignObject:function(h,e){return this.graph[h]?(typeof e=="object"&&Object.assign(this.graph[h],e),!0):!1},setGlobalFunction:(h,e)=>(typeof h=="string"&&(h=O(h)),typeof h=="function"?(e||(e=h.name),globalThis[e]=h,!0):!1),assignFunctionToGlobalObject:function(h,e,t){return globalThis[h]?(typeof e=="string"&&(e=O(e)),typeof e=="function"?(t||(t=e.name),this.graph[h][t]=e,!0):!1):!1},setFunction:function(h,e){return typeof h=="string"&&(h=O(h)),typeof h=="function"?(e||(e=h.name),this.graph[e]=h,!0):!1},assignFunctionToObject:function(h,e,t){return this.graph[h]?(typeof e=="string"&&(e=O(e)),typeof e=="function"?(t||(t=e.name),this.graph[h][t]=e,!0):!1):!1}};var R=class extends G{constructor(t){super(t);this.entities={};this.systems={};this.entityMap=new Map;this.entityKeyMap=new Map;this.order=[];this.animating=!1;this.entityCt=0;this.systemCt=0;this.updateEntities=(t=this.order,i,s=!1)=>{t.forEach(r=>{this.systems[r]&&(i?(s&&(s=performance.now()),this.entityKeyMap.get(r).length>0&&this.systems[r].run(this.entityMap.get(r)),s&&console.log("system",r,"took",performance.now()-s,"ms for",Object.keys(this.entityMap.get(r)).length,"entities")):(s&&(s=performance.now()),this.entityKeyMap.get(r).length>0&&this.systems[r].run(this.entities),s&&console.log("system",r,"took",performance.now()-s,"ms for",Object.keys(this.entities).length,"entities")))})};this.animate=(t=!0,i)=>{if(this.animating===!1)if(this.animating=!0,typeof requestAnimationFrame<"u"){let s=()=>{requestAnimationFrame(()=>{this.animating&&(this.updateEntities(i,t),s())})};s()}else{let s=()=>{setTimeout(async()=>{this.animating&&(this.updateEntities(i,t),s())},10)};s()}};this.stop=()=>{this.animating=!1};this.start=t=>{this.animate(t)};this.addEntities=(t,i={},s=1)=>{let r=0,n={};for(;r<s;){let a=this.addEntity(t,i);n[a.tag]=a,r++}return Object.keys(n)};this.addEntity=(t={},i={})=>{if(!t)return;let s=this.recursivelyAssign({},t);if(s.components=i,Object.keys(i).length===0&&Object.keys(this.systems).forEach(r=>{i[r]=!0}),s.tag&&this.entities[s.tag]){this.entityCt++;let r=s.tag+this.entityCt;for(;this.entities[s.tag];)this.entityCt++,s.tag=`${r}${this.entityCt}`}else s.tag||(s.tag=`entity${Math.floor(Math.random()*1e15)}`);return this.add(s),this.entities[s.tag]=this.nodes.get(s.tag),this.setupEntity(this.entities[s.tag]),this.entities[s.tag]};this.addSystems=(t={},i)=>{for(let s in t)t[s].tag=s,this.addSystem(t[s],void 0,void 0,void 0,void 0,i);return this.systems};this.addSystem=(t,i,s,r,n,a)=>{if(!t)return;let o=this.recursivelyAssign({},t);if(i&&(o.setupEntities=i),s&&(o.setupEntity=s),r&&(o.operator=r),n&&(o.remove=n),o.tag&&this.systems[o.tag]){this.systemCt++;let c=o.tag+this.systemCt;for(;this.systems[o.tag];)this.systemCt++,o.tag=`${c}${this.systemCt}`}else o.tag||(o.tag=`system${Math.floor(Math.random()*1e15)}`);if(this.add(o),this.systems[o.tag]=this.nodes.get(o.tag),this.entityMap.get(o.tag)||this.entityMap.set(o.tag,{}),this.entityKeyMap.get(o.tag)||this.entityKeyMap.set(o.tag,[]),this.systems[o.tag].entities=this.entityMap.get(o.tag),this.systems[o.tag].entityKeys=this.entityKeyMap.get(o.tag),this.systems[o.tag]?.setupEntities){let c=this.filterObject(this.entities,(f,l)=>{if(l.components[o.tag])return!0});this.systems[o.tag].setupEntities(c),Object.assign(this.entityMap.get(o.tag),c)}return a?this.order=a:this.order.push(o.tag),this.systems[o.tag]};this.setupEntity=t=>{if(t?.components)for(let i in t.components)this.systems[i]&&(this.systems[i].setupEntity(t),this.entityMap.get(i)[t.tag]=t,this.entityKeyMap.get(i).push(t.tag))};this.removeEntity=t=>{let i=this.entities[t];for(let s in i.components)this.entityMap.get(s)&&(delete this.entityMap.get(s)[i.tag],this.entityKeyMap.get(s).splice(this.entityKeyMap.get(s).indexOf(i.tag),1)),this.systems[s]?.remove&&this.systems[s].remove(i,this.entityMap.get(s));return delete this.entities[t],this.remove(t)};this.removeSystem=t=>{if(this.systems[t]?.remove)for(let i in this.entityKeyMap.get(t))this.systems[t].remove(this.entityMap.get(t)[i],this.entityMap.get(t));return delete this.systems[t],this.entityMap.delete(t),this.entityKeyMap.delete(t),this.order.splice(this.order.indexOf(t),1),this.remove(t)};this.setEntities=(t,i)=>{if(Array.isArray(t))t.forEach(s=>{this.entities[s]&&this.recursivelyAssign(this.entities[s],i)});else for(let s in this.entities)this.setEntity(this.entities[s],i);return!0};this.setEntity=(t,i)=>this.recursivelyAssign(t,i);this.bufferValues=(t,i,s,r)=>{if(!Array.isArray(s)&&typeof s=="object"&&(s=Object.keys(s)),!r){let a=Object.keys(t);s?r=new Float32Array(a.length*s.length):typeof t[a[0]][i]=="object"?(s=Object.keys(t[a[0]][i]),r=new Float32Array(a.length*s.length)):r=new Float32Array(a.length)}let n=0;for(let a in t)if(t[a][i])if(s)for(let o=0;o<s.length;o++)r[n]=t[a][i][s[o]],n++;else r[n]=t[a][i],n++;return r};this.routes={animateEntities:this.animate,startEntityAnimation:this.start,stopEntityAnimation:this.stop,addEntity:this.addEntity,addSystem:this.addSystem,addSystems:this.addSystems,removeEntity:this.removeEntity,removeEntities:this.removeEntities,removeSystem:this.removeSystem,setupEntity:this.setupEntity,addEntities:this.addEntities,filterObject:this.filterObject,bufferValues:this.bufferValues,setEntity:this.setEntity,setEntities:this.setEntities};if(this.routes&&this.load(this.routes),t.systems)for(let i in t.systems)this.addSystem(t.systems[i],void 0,void 0,void 0,void 0,t.order);if(t.entities)for(let i in t.entities)this.addEntity(t.entities[i],t.entities[i].components)}removeEntities(t){Array.isArray(t)||(t=Object.keys(t)),t.forEach(i=>{this.removeEntity(i)})}filterObject(t,i){return Object.fromEntries(Object.entries(t).filter(([s,r])=>{i(s,r)}))}};})();
