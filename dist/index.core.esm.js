function G(h=""){let e=a=>a.replace(/^\W*(function[^{]+\{([\s\S]*)\}|[^=]+=>[^{]*\{([\s\S]*)\}|[^=]+=>(.+))/i,"$2$3$4"),i=(a=>{let n=a.indexOf("=>")+1;return n<=0&&(n=a.indexOf("){")),n<=0&&(n=a.indexOf(") {")),a.slice(0,a.indexOf("{",n)+1)})(h),s=e(h),r;if(i.includes("function")){let a=i.split("(")[1].split(")")[0];r=new Function(a,s)}else if(i.substring(0,6)===s.substring(0,6)){let a=i.split("(")[1].split(")")[0];r=new Function(a,s.substring(s.indexOf("{")+1,s.length-1))}else try{r=(0,eval)(i+s+"}")}catch{}return r}var b={pushToState:{},data:{},triggers:{},setState(h){Object.assign(b.data,h);for(let e of Object.getOwnPropertyNames(h))b.triggers[e]&&b.triggers[e].forEach(t=>t.onchange(b.data[e]));return b.data},subscribeTrigger(h,e){if(h){b.triggers[h]||(b.triggers[h]=[]);let t=b.triggers[h].length;return b.triggers[h].push({idx:t,onchange:e}),b.triggers[h].length-1}else return},unsubscribeTrigger(h,e){let t,i=b.triggers[h];if(i)if(!e)delete b.triggers[h];else return i.find(r=>{if(r.idx===e)return!0})&&i.splice(t,1),!0},subscribeTriggerOnce(h,e){let t,i=s=>{e(s),b.unsubscribeTrigger(h,t)};t=b.subscribeTrigger(h,i)}},c=class{constructor(e={},t,i){this.nodes=new Map;this._initial={};this.state=b;this.isLooping=!1;this.isAnimating=!1;this.looper=void 0;this.animation=void 0;this.forward=!0;this.backward=!1;this.runSync=!1;this.firstRun=!0;this.DEBUGNODE=!1;this.operator=(...e)=>e;this.runOp=(...e)=>{this.DEBUGNODE&&console.time(this.tag);let t=this.operator(...e);return t instanceof Promise?t.then(i=>(i!==void 0&&this.setState({[this.tag]:i}),this.DEBUGNODE&&(console.timeEnd(this.tag),t!==void 0&&console.log(`${this.tag} result:`,t)),i)):(t!==void 0&&this.setState({[this.tag]:t}),this.DEBUGNODE&&(console.timeEnd(this.tag),t!==void 0&&console.log(`${this.tag} result:`,t))),t};this.setOperator=e=>(typeof e!="function"||(this.operator=e.bind(this)),e);this.runAsync=(...e)=>new Promise((t,i)=>{t(this.run(...e))});this.transformArgs=(e=[])=>e;this.run=(...e)=>{if(typeof this.transformArgs=="function"&&(e=this.transformArgs(e,this)),!(this.firstRun&&(this.firstRun=!1,this.children&&this.forward||this.parent&&this.backward||this.repeat||this.delay||this.frame||this.recursive||this.branch||(this.runSync=!0),this.animate&&!this.isAnimating&&this.runAnimation(this.animation,e),this.loop&&typeof this.loop=="number"&&!this.isLooping&&this.runLoop(this.looper,e),this.loop||this.animate)))return this.runSync?this.runOp(...e):new Promise(async t=>{if(this){let i=(r,a=0,...n)=>new Promise(async o=>{a++;let g=await r.runOp(...n);if(r.repeat){for(;a<r.repeat;){if(r.delay){setTimeout(async()=>{o(await i(r,a,...n))},r.delay);break}else if(r.frame&&window?.requestAnimationFrame){requestAnimationFrame(async()=>{o(await i(r,a,...n))});break}else g=await r.runOp(...n);a++}if(a===r.repeat){o(g);return}}else if(r.recursive){for(;a<r.recursive;){if(r.delay){setTimeout(async()=>{o(await i(r,a,...g))},r.delay);break}else if(r.frame&&window?.requestAnimationFrame){requestAnimationFrame(async()=>{o(await i(r,a,...g))});break}else g=await r.runOp(...g);a++}if(a===r.recursive){o(g);return}}else{o(g);return}}),s=async()=>{let r=await i(this,void 0,...e);return r!==void 0&&(this.backward&&this.parent instanceof c&&(Array.isArray(r)?await this.runParent(this,...r):await this.runParent(this,r)),this.children&&this.forward&&(Array.isArray(r)?await this.runChildren(this,...r):await this.runChildren(this,r)),this.branch&&this.runBranch(this,r)),r};this.delay?setTimeout(async()=>{t(await s())},this.delay):this.frame&&window?.requestAnimationFrame?requestAnimationFrame(async()=>{t(await s())}):t(await s())}else t(void 0)})};this.runParent=async(e,...t)=>{e.backward&&e.parent&&(typeof e.parent=="string"&&(e.graph&&e.graph?.get(e.parent)?(e.parent=e.graph,e.parent&&this.nodes.set(e.parent.tag,e.parent)):e.parent=this.nodes.get(e.parent)),e.parent instanceof c&&await e.parent.run(...t))};this.runChildren=async(e,...t)=>{if(typeof e.children=="object")for(let i in e.children)typeof e.children[i]=="string"?(e.graph&&e.graph?.get(e.children[i])&&(e.children[i]=e.graph.get(e.children[i]),e.nodes.get(e.children[i].tag)||e.nodes.set(e.children[i].tag,e.children[i])),!e.children[i]&&e.nodes.get(e.children[i])&&(e.children[i]=e.nodes.get(e.children[i]))):(typeof e.children[i]>"u"||e.children[i]===!0)&&(e.graph&&e.graph?.get(i)&&(e.children[i]=e.graph.get(i),e.nodes.get(e.children[i].tag)||e.nodes.set(e.children[i].tag,e.children[i])),!e.children[i]&&e.nodes.get(i)&&(e.children[i]=e.nodes.get(i))),e.children[i]?.runOp&&await e.children[i].run(...t)};this.runBranch=async(e,t)=>{if(e.branch){let i=Object.keys(e.branch);await Promise.all(i.map(async s=>{typeof e.branch[s].if=="object"&&(e.branch[s].if=j(e.branch[s].if));let r=!1;return typeof e.branch[s].if=="function"?r=e.branch[s].if(t):typeof t=="object"?j(t)===e.branch[s].if&&(r=!0):t===e.branch[s].if&&(r=!0),r&&(e.branch[s].then instanceof c?Array.isArray(t)?await e.branch[s].then.run(...t):await e.branch[s].then.run(...t):typeof e.branch[s].then=="function"?Array.isArray(t)?await e.branch[s].then(...t):await e.branch[s].then(t):typeof e.branch[s].then=="string"&&(e.graph?e.branch[s].then=e.graph.nodes.get(e.branch[s].then):e.branch[s].then=e.nodes.get(e.branch[s].then),e.branch[s].then instanceof c&&(Array.isArray(t)?await e.branch[s].then.run(...t):await e.branch[s].then.run(...t)))),r}))}};this.runAnimation=(e=this.animation,t=[])=>{if(this.animation=e,e||(this.animation=this.operator),this.animate&&!this.isAnimating&&"requestAnimationFrame"in window){this.isAnimating=!0;let i=async()=>{if(this.isAnimating){this.DEBUGNODE&&console.time(this.tag);let s=this.animation(...t);s instanceof Promise&&(s=await s),this.DEBUGNODE&&(console.timeEnd(this.tag),s!==void 0&&console.log(`${this.tag} result:`,s)),s!==void 0&&(this.tag&&this.setState({[this.tag]:s}),this.backward&&this.parent?.run&&(Array.isArray(s)?await this.runParent(this,...s):await this.runParent(this,s)),this.children&&this.forward&&(Array.isArray(s)?await this.runChildren(this,...s):await this.runChildren(this,s)),this.branch&&this.runBranch(this,s),this.setState({[this.tag]:s})),requestAnimationFrame(i)}};requestAnimationFrame(i)}};this.runLoop=(e=this.looper,t=[],i=this.loop)=>{if(this.looper=e,e||(this.looper=this.operator),typeof i=="number"&&!this.isLooping){this.isLooping=!0;let s=async()=>{if(this.isLooping){this.DEBUGNODE&&console.time(this.tag);let r=this.looper(...t);r instanceof Promise&&(r=await r),this.DEBUGNODE&&(console.timeEnd(this.tag),r!==void 0&&console.log(`${this.tag} result:`,r)),r!==void 0&&(this.tag&&this.setState({[this.tag]:r}),this.backward&&this.parent?.run&&(Array.isArray(r)?await this.runParent(this,...r):await this.runParent(this,r)),this.children&&this.forward&&(Array.isArray(r)?await this.runChildren(this,...r):await this.runChildren(this,r)),this.branch&&this.runBranch(this,r),this.setState({[this.tag]:r})),setTimeout(async()=>{await s()},i)}};s()}};this.setParent=e=>{this.parent=e,this.backward&&(this.runSync=!1)};this.setChildren=e=>{this.children=e,this.forward&&(this.runSync=!1)};this.add=(e={})=>(typeof e=="function"&&(e={operator:e}),e instanceof c||(e=new c(e,this,this.graph)),this.nodes.set(e.tag,e),this.graph&&(this.graph.nodes.set(e.tag,e),this.graph.nNodes=this.graph.nodes.size),e);this.remove=e=>{typeof e=="string"&&(e=this.nodes.get(e)),e instanceof c&&(this.nodes.delete(e.tag),this.children[e.tag]&&delete this.children[e.tag],this.graph&&(this.graph.nodes.delete(e.tag),this.graph.nNodes=this.graph.nodes.size),this.nodes.forEach(t=>{t.nodes.get(t.tag)&&(t.nodes.delete(t.tag),t.children[t.tag]&&delete t.children[t.tag],t.parent?.tag===t.tag&&delete t.parent)}),e.ondelete&&e.ondelete(e))};this.append=(e,t=this)=>{typeof e=="string"&&(e=this.nodes.get(e)),e instanceof c&&(t.addChildren(e),e.forward&&(e.runSync=!1))};this.subscribe=(e,t=this.tag)=>e instanceof c?this.subscribeNode(e):this.state.subscribeTrigger(t,e);this.unsubscribe=(e,t=this.tag)=>{this.state.unsubscribeTrigger(t,e)};this.addChildren=e=>{this.children||(this.children={}),typeof e=="object"&&Object.assign(this.children,e),this.convertChildrenToNodes(),this.forward&&(this.runSync=!1)};this.callParent=(...e)=>{if(typeof this.parent=="string"&&(this.graph&&this.graph?.get(this.parent)?(this.parent=this.graph,this.parent&&this.nodes.set(this.parent.tag,this.parent)):this.parent=this.nodes.get(this.parent)),typeof this.parent?.operator=="function")return this.parent.runOp(...e)};this.callChildren=(...e)=>{let t;if(typeof this.children=="object")for(let i in this.children)this.children[i]?.runOp&&this.children[i].runOp(...e);return t};this.getProps=(e=this)=>({tag:e.tag,operator:e.operator,graph:e.graph,children:e.children,parent:e.parent,forward:e.forward,backward:e.bacward,loop:e.loop,animate:e.animate,frame:e.frame,delay:e.delay,recursive:e.recursive,repeat:e.repeat,branch:e.branch,oncreate:e.oncreate,DEBUGNODE:e.DEBUGNODE,...this._initial});this.setProps=(e={})=>{let t=Object.assign({},e);t.children&&(this.addChildren(e.children),delete t.children),t.operator&&(this.setOperator(e.operator),delete t.operator),Object.assign(t,e),this.children&&this.forward||this.parent&&this.backward||this.repeat||this.delay||this.frame||this.recursive||(this.runSync=!0)};this.removeTree=e=>{if(e&&typeof e=="string"&&(e=this.nodes.get(e)),e instanceof c){let t={},i=s=>{if(typeof s.children=="object"&&!t[s.tag]){t[s.tag]=!0;for(let r in s.children)s.children[r].stopNode&&s.children[r].stopNode(),s.children[r].tag&&(this.nodes.get(s.children[r].tag)&&this.nodes.delete(s.children[r].tag),this.nodes.forEach(a=>{a.nodes.get(s.children[r].tag)&&a.nodes.delete(s.children[r].tag),a.children[r]instanceof c&&delete a.children[r]}),i(s.children[r]))}};e.stopNode&&e.stopNode(),e.tag&&(this.nodes.delete(e.tag),this.children[e.tag]&&delete this.children[e.tag],this.parent?.tag===e.tag&&delete this.parent,this[e.tag]instanceof c&&delete this[e.tag],this.nodes.forEach(s=>{s?.tag&&(s.nodes.get(s.tag)&&s.nodes.delete(s.tag),s.children[s.tag]instanceof c&&delete s.children[s.tag])}),i(e),this.graph?this.graph.removeTree(e,t):e.ondelete&&e.ondelete(e))}};this.checkNodesHaveChildMapped=(e,t,i={})=>{let s=e.tag;s||(s=e.name),i[s]||(i[s]=!0,e.children&&t.tag in e.children&&e.children[t.tag]instanceof c&&(e.nodes.get(t.tag)||e.nodes.set(t.tag,t),e.children[t.tag]=t,e.firstRun||(e.firstRun=!0)),e.parent instanceof c&&(e.nodes.get(t.tag)&&!e.parent.nodes.get(t.tag)&&e.parent.nodes.set(t.tag,t),e.parent.children?this.checkNodesHaveChildMapped(e.parent,t,i):e.nodes&&e.nodes.forEach(r=>{i[r.tag]||this.checkNodesHaveChildMapped(r,t,i)})),e.graph&&e.parent&&e.parent.name!==e.graph.name&&e.graph.nodes.forEach(r=>{i[r.tag]||this.checkNodesHaveChildMapped(r,t,i)}))};this.convertChildrenToNodes=(e=this)=>{if(e?.children){for(let t in e.children)if(!(e.children[t]instanceof c))if(typeof e.children[t]=="object")e.children[t].tag||(e.children[t].tag=t),e.nodes.get(e.children[t].tag)||(e.children[t]=new c(e.children[t],e,e.graph),this.checkNodesHaveChildMapped(e,e.children[t]));else{if(typeof e.children[t]>"u"||e.children[t]==!0)e.children[t]=e.graph.get(t),e.children[t]||(e.children[t]=e.nodes.get(t));else if(typeof e.children[t]=="string"){let i=e.children[t];e.children[t]=e.graph.get(i),e.children[t]||(e.children[t]=e.nodes.get(t))}if(e.children[t]instanceof c){if(e.graph){let i=e.children[t].getProps();delete i.parent,delete i.graph,e.source instanceof O?e.children[t]=new c(i,e,e.source):e.children[t]=new c(i,e,e.graph)}e.nodes.set(e.children[t].tag,e.children[t]),this.checkNodesHaveChildMapped(e,e.children[t]),e.children[t].tag in e||(e[e.children[t].tag]=e.children[t])}}}return e.children};this.stopLooping=(e=this)=>{e.isLooping=!1};this.stopAnimating=(e=this)=>{e.isAnimating=!1};this.stopNode=(e=this)=>{e.stopAnimating(e),e.stopLooping(e)};this.subscribeNode=e=>{if(typeof e=="string"&&(e=this.nodes.get(e)),e.tag&&this.nodes.set(e.tag,e),e)return this.state.subscribeTrigger(this.tag,t=>{Array.isArray(t)?e.run(...t):e.run(t)})};this.print=(e=this,t=!0,i=[])=>{let s=new c;if(typeof e=="string"&&(e=this.nodes.get(e)),e instanceof c){i.push(e.tag);let r={tag:e.tag,operator:e.operator.toString()};if(e.parent&&(r.parent=e.parent.tag),typeof e.children=="object")for(let a in e.children)return typeof e.children[a]=="string"?e.children[a]:i.includes(e.children[a].tag)?e.children[a].tag:t?e.children[a].print(e.children[a],t,i):e.children[a].tag;for(let a in e)a==="parent"||a==="children"||typeof s[a]>"u"&&(typeof e[a]=="function"?r[a]=e[a].toString():typeof e[a]=="object"?r[a]=JSON.stringifyWithCircularRefs(e[a]):r[a]=e[a]);return JSON.stringify(r)}};this.reconstruct=e=>{let t=A(e);if(t)return this.add(t)};this.setState=this.state.setState;this.DEBUGNODES=(e=!0)=>{this.DEBUGNODE=e,this.nodes.forEach(t=>{e?t.DEBUGNODE=!0:t.DEBUGNODE=!1})};if(typeof e=="function"&&(e={operator:e}),typeof e=="object"){if(e instanceof c&&e._initial&&Object.assign(e,e._initial),e instanceof O){let r=e;e={source:r,operator:a=>{if(typeof a=="object"){let n={};for(let o in a)typeof r[o]=="function"?Array.isArray(a[o])?n[o]=r[o](...a[o]):n[o]=r[o](a[o]):(r[o]=a[o],n[o]=r[o]);return n}return r}},r.operator&&(e.operator=r.operator),r.children&&(e.children=r.children),r.forward&&(e.forward=r.forward),r.backward&&(e.backward=r.backward),r.repeat&&(e.repeat=r.repeat),r.recursive&&(e.recursive=r.recursive),r.loop&&(e.loop=r.loop),r.animate&&(e.animate=r.animate),r.looper&&(e.looper=r.looper),r.animation&&(e.animation=r.animation),r.delay&&(e.delay=r.delay),r.tag&&(e.tag=r.tag),r.oncreate&&(e.oncreate=r.oncreate),r.node&&r.node._initial&&Object.assign(e,r.node._initial),r._initial&&Object.assign(e,r._initial),this.nodes=r.nodes,r.node=this,i&&r.nodes.forEach(a=>{i.nodes.get(a.tag)||(i.nodes.set(a.tag,a),i.nNodes++)})}if(e.tag&&(i||t)){let r;if(i?.nodes&&(r=i.nodes.get(e.tag)),!r&&t?.nodes&&(r=t.nodes.get(e.tag)),r){Object.assign(this,r),this.source||(this.source=r);let a=r.getProps();delete a.graph,delete a.parent,Object.assign(e,a)}}e?.operator&&(e.operator=this.setOperator(e.operator)),!e.tag&&i?e.tag=`node${i.nNodes}`:e.tag||(e.tag=`node${Math.floor(Math.random()*1e10)}`);let s=Object.getOwnPropertyNames(this);for(let r in e)s.includes(r)||(this._initial[r]=e[r]);if(e.children&&(this._initial.children=Object.assign({},e.children)),Object.assign(this,e),this.tag||(i?this.tag=`node${i.nNodes}`:this.tag=`node${Math.floor(Math.random()*1e10)}`),i&&(this.graph=i,i.nodes.get(this.tag)&&(this.tag=`${this.tag}${i.nNodes+1}`),i.nodes.set(this.tag,this),i.nNodes++),t&&(this.parent=t,(t instanceof c||t instanceof O)&&t.nodes.set(this.tag,this)),typeof e.tree=="object")for(let r in e.tree){typeof e.tree[r]=="object"&&(!e.tree[r]).tag&&(e.tree[r].tag=r);let a=new c(e.tree[r],this,i);this.nodes.set(a.tag,a)}this.children&&this.convertChildrenToNodes(this),(this.parent instanceof c||this.parent instanceof O)&&this.checkNodesHaveChildMapped(this.parent,this),typeof this.oncreate=="function"&&this.oncreate(this),this.firstRun||(this.firstRun=!0)}else return e}},O=class{constructor(e,t,i){this.nNodes=0;this.nodes=new Map;this.state=b;this.tree={};this.add=(e={})=>{let t=e;return e instanceof c?(this.nNodes=this.nodes.size,e.tag&&(this.tree[e.tag]=t,this.nodes.set(e.tag,e))):e=new c(t,this,this),e};this.setTree=(e=this.tree)=>{if(!!e){for(let t in e)if(this.nodes.get(t)){let i=this.nodes.get(t);if(typeof e[t]=="function")i.setOperator(e[t]);else if(typeof e[t]=="object")if(e[t]instanceof c)this.add(e[t]);else if(e[t]instanceof O){let s=e[t],r={};s.operator&&(r.operator=s.operator),s.children&&(r.children=s.children),s.forward&&(r.forward=s.forward),s.backward&&(r.backward=s.backward),s.repeat&&(r.repeat=s.repeat),s.recursive&&(r.recursive=s.recursive),s.loop&&(r.loop=s.loop),s.animate&&(r.animate=s.animate),s.looper&&(r.looper=s.looper),s.animation&&(r.animation=s.animation),s.delay&&(r.delay=s.delay),s.tag&&(r.tag=s.tag),s.oncreate&&(r.oncreate=s.oncreate),s.node?._initial&&Object.assign(r,s.node._initial),r.nodes=s.nodes,r.source=s,i.setProps(r)}else i.setProps(e[t])}else if(typeof e[t]=="function")this.add({tag:t,operator:e[t]});else if(typeof e[t]=="object"&&!Array.isArray(e[t])){e[t].tag||(e[t].tag=t);let i=this.add(e[t]);e[t].aliases&&e[t].aliases.forEach(s=>{this.nodes.set(s,i)})}else this.add({tag:t,operator:(...i)=>e[t]});this.nodes.forEach(t=>{if(typeof t.children=="object")for(let i in t.children)typeof t.children[i]=="string"?this.nodes.get(t.children[i])&&(t.children[i]=this.nodes.get(t.children[i])):(t.children[i]===!0||typeof t.children[i]>"u")&&this.nodes.get(i)&&(t.children[i]=this.nodes.get(i)),t.children[i]instanceof c&&t.checkNodesHaveChildMapped(t,t.children[i]);typeof t.parent=="string"&&this.nodes.get(t.parent)&&(t.parent=this.nodes.get(t.parent),t.nodes.set(t.parent.tag,t.parent))})}};this.get=e=>this.nodes.get(e);this.set=e=>this.nodes.set(e.tag,e);this.run=(e,...t)=>{if(typeof e=="string"&&(e=this.nodes.get(e)),e instanceof c)return e.run(...t)};this.runAsync=(e,...t)=>(typeof e=="string"&&(e=this.nodes.get(e)),e instanceof c?new Promise((i,s)=>{i(e.run(...t))}):new Promise((i,s)=>{i(void 0)}));this.removeTree=(e,t)=>{if(typeof e=="string"&&(e=this.nodes.get(e)),e instanceof c){t||(t={});let i=s=>{s.children&&!t[s.tag]&&(t[s.tag]=!0,Array.isArray(s.children)?s.children.forEach(r=>{r.stopNode&&r.stopNode(),r.tag&&this.nodes.get(r.tag)&&this.nodes.delete(r.tag),this.nodes.forEach(a=>{a.nodes.get(r.tag)&&a.nodes.delete(r.tag)}),i(r)}):typeof s.children=="object"&&(s.stopNode&&s.stopNode(),s.tag&&this.nodes.get(s.tag)&&this.nodes.delete(s.tag),this.nodes.forEach(r=>{r.nodes.get(s.tag)&&r.nodes.delete(s.tag)}),i(s)))};e.stopNode&&e.stopNode(),e.tag&&(this.nodes.delete(e.tag),this.nodes.forEach(s=>{s.nodes.get(s.tag)&&s.nodes.delete(s.tag)}),this.nNodes=this.nodes.size,i(e)),e.ondelete&&e.ondelete(e)}return e};this.remove=e=>(typeof e=="string"&&(e=this.nodes.get(e)),e instanceof c&&(e.stopNode(),e?.tag&&this.nodes.get(e.tag)&&(this.nodes.delete(e.tag),this.nodes.forEach(t=>{t.nodes.get(t.tag)&&t.nodes.delete(t.tag)})),e.ondelete&&e.ondelete(e)),e);this.append=(e,t)=>{t.addChildren(e)};this.callParent=async(e,...t)=>{if(e?.parent)return await e.callParent(...t)};this.callChildren=async(e,...t)=>{if(e?.children)return await e.callChildren(...t)};this.subscribe=(e,t)=>{if(!!t){if(e instanceof c&&typeof t=="function")return e.subscribe(t);if(t instanceof c||typeof t=="string")return this.subscribeNode(e,t);if(typeof e=="string")return this.state.subscribeTrigger(e,t)}};this.unsubscribe=(e,t)=>{this.state.unsubscribeTrigger(e,t)};this.subscribeNode=(e,t)=>{let i;if(e?.tag?i=e.tag:typeof e=="string"&&(i=e),typeof t=="string"&&(t=this.nodes.get(t)),e&&t)return this.state.subscribeTrigger(i,r=>{Array.isArray(r)?t.run(...r):t.run(r)})};this.stopNode=e=>{typeof e=="string"&&(e=this.nodes.get(e)),e instanceof c&&e.stopNode()};this.print=(e=void 0,t=!0)=>{if(e instanceof c)return e.print(e,t);{let i="{";return this.nodes.forEach(s=>{i+=`
"${s.tag}:${s.print(s,t)}"`}),i}};this.reconstruct=e=>{let t=A(e);if(t)return this.add(t)};this.create=(e,t,i)=>R(e,t,i,this);this.setState=this.state.setState;this.DEBUGNODES=(e=!0)=>{this.nodes.forEach(t=>{e?t.DEBUGNODE=!0:t.DEBUGNODE=!1})};this.tag=t||`graph${Math.floor(Math.random()*1e11)}`,i&&(Object.assign(this,i),this._initial=i),(e||Object.keys(this.tree).length>0)&&this.setTree(e)}};function P(h,e,t){let i=A(h);if(i)return new c(i,e,t)}function A(h="{}"){try{let e=typeof h=="string"?JSON.parse(h):h,t=i=>{for(let s in i)if(typeof i[s]=="string"){let r=G(i[s]);typeof r=="function"&&(i[s]=r)}else typeof i[s]=="object"&&t(i[s]);return i};return t(e)}catch(e){console.error(e);return}}var E=function(){let h=new Map,e=[],t=["this"];function i(){h.clear(),e.length=0,t.length=1}function s(a,n){var o=e.length-1,g=e[o];if(typeof g=="object")if(g[a]===n||o===0)t.push(a),e.push(n.pushed);else for(;o-->=0;){if(g=e[o],typeof g=="object"&&g[a]===n){o+=2,e.length=o,t.length=o,--o,e[o]=n,t[o]=a;break}o--}}function r(a,n){if(n!=null&&typeof n=="object"){a&&s(a,n);let o=h.get(n);if(o)return"[Circular Reference]"+o;h.set(n,t.join("."))}return n}return function(n,o){try{return e.push(n),JSON.stringify(n,r,o)}finally{i()}}}();JSON.stringifyWithCircularRefs===void 0&&(JSON.stringifyWithCircularRefs=E);var j=function(){let h=new Map,e=[],t=["this"];function i(){h.clear(),e.length=0,t.length=1}function s(a,n){var o=e.length-1;if(e[o]){var g=e[o];if(typeof g=="object")if(g[a]===n||o===0)t.push(a),e.push(n.pushed);else for(;o-->=0;){if(g=e[o],typeof g=="object"&&g[a]===n){o+=2,e.length=o,t.length=o,--o,e[o]=n,t[o]=a;break}o++}}}function r(a,n){let o;if(n!=null)if(typeof n=="object"){let g=n.constructor.name;a&&g==="Object"&&s(a,n);let f=h.get(n);if(f)return"[Circular Reference]"+f;if(h.set(n,t.join(".")),g==="Array")n.length>20?o=n.slice(n.length-20):o=n;else if(g.includes("Set"))o=Array.from(n);else if(g!=="Object"&&g!=="Number"&&g!=="String"&&g!=="Boolean")o="instanceof_"+g;else if(g==="Object"){let d={};for(let l in n)if(n[l]==null)d[l]=n[l];else if(Array.isArray(n[l]))n[l].length>20?d[l]=n[l].slice(n[l].length-20):d[l]=n[l];else if(n[l].constructor.name==="Object"){d[l]={};for(let p in n[l])if(Array.isArray(n[l][p]))n[l][p].length>20?d[l][p]=n[l][p].slice(n[l][p].length-20):d[l][p]=n[l][p];else if(n[l][p]!=null){let y=n[l][p].constructor.name;y.includes("Set")?d[l][p]=Array.from(n[l][p]):y!=="Number"&&y!=="String"&&y!=="Boolean"?d[l][p]="instanceof_"+y:d[l][p]=n[l][p]}else d[l][p]=n[l][p]}else{let p=n[l].constructor.name;p.includes("Set")?d[l]=Array.from(n[l]):p!=="Number"&&p!=="String"&&p!=="Boolean"?d[l]="instanceof_"+p:d[l]=n[l]}o=d}else o=n}else o=n;return o}return function(n,o){e.push(n);let g=JSON.stringify(n,r,o);return i(),g}}();JSON.stringifyFast===void 0&&(JSON.stringifyFast=j);function R(h,e,t,i){return typeof t=="object"?(t.operator=h,new c(t,e,i)):new c({operator:h},e,i)}var w=class extends O{constructor(t={}){super(void 0,t.name?t.name:`service${Math.floor(Math.random()*1e14)}`,t.props);this.routes={};this.loadDefaultRoutes=!1;this.keepState=!0;this.firstLoad=!0;this.init=t=>{t?t=Object.assign({},t):t={},t.customRoutes?Object.assign(t.customRoutes,this.customRoutes):t.customRoutes=this.customRoutes,t.customChildren?Object.assign(t.customChildren,this.customChildren):t.customChildren=this.customChildren,Array.isArray(t.routes)?t.routes.forEach(i=>{this.load(i,t.includeClassName,t.routeFormat,t.customRoutes,t.customChildren)}):(t.routes||(Object.keys(this.routes).length>0||this.loadDefaultRoutes)&&this.firstLoad)&&this.load(t.routes,t.includeClassName,t.routeFormat,t.customRoutes,t.customChildren)};this.load=(t,i=!0,s=".",r,a)=>{if(!t&&!this.loadDefaultRoutes&&(Object.keys(this.routes).length>0||this.firstLoad))return;this.firstLoad&&(this.firstLoad=!1),r?r=Object.assign(this.customRoutes,r):r=this.customRoutes,a&&(a=Object.assign(this.customChildren,a));let n,o={};if(t){if(!(t instanceof O)&&t?.name)if(t.module){let f=t;t={},Object.getOwnPropertyNames(t.module).forEach(d=>{i?t[f.name+s+d]=t.module[d]:t[d]=t.module[d]})}else typeof t=="function"&&(n=new t({loadDefaultRoutes:this.loadDefaultRoutes}),n.load(),t=n.routes);else if(t instanceof O||t.source instanceof O){n=t,t={};let f;i&&(f=n.name,f||(f=n.tag,n.name=f),f||(f=`graph${Math.floor(Math.random()*1e15)}`,n.name=f,n.tag=f)),n.customRoutes&&!this.customRoutes?this.customRoutes=n.customRoutes:n.customRoutes&&this.customRoutes&&Object.assign(this.customRoutes,n.customRoutes),n.customChildren&&!this.customChildren?this.customChildren=n.customChildren:n.customChildren&&this.customChildren&&Object.assign(this.customChildren,n.customChildren),n.nodes.forEach(d=>{t[d.tag]=d;let l={},p=(y,u)=>{if((!l[y.tag]||u&&i&&!l[u?.tag+s+y.tag])&&(u?l[u.tag+s+y.tag]=!0:l[y.tag]=!0,y instanceof O||y.source instanceof O)){if(i){let m=y.name;m||(m=y.tag,y.name=m),m||(m=`graph${Math.floor(Math.random()*1e15)}`,y.name=m,y.tag=m)}y.nodes.forEach(m=>{i&&!t[y.tag+s+m.tag]?t[y.tag+s+m.tag]=m:t[m.tag]||(t[m.tag]=m),p(m,y)})}};p(d)})}else if(typeof t=="object"){let f=t.constructor.name;if(f==="Object"&&(f=Object.prototype.toString.call(t),f&&(f=f.split(" ")[1]),f&&(f=f.split("]")[0])),f&&f!=="Object"){let d=t;t={},Object.getOwnPropertyNames(d).forEach(l=>{i?t[f+s+l]=d[l]:t[l]=d[l]})}}if(n instanceof O&&n.name&&i){t=Object.assign({},t);for(let f in t){let d=t[f];delete t[f],t[n.name+s+f]=d}}}if(this.loadDefaultRoutes){let f=Object.assign({},this.defaultRoutes);t?(Object.assign(f,this.routes),t=Object.assign(f,t)):t=Object.assign(f,this.routes),this.loadDefaultRoutes=!1}t||(t=this.routes);let g=0;for(let f in t){g++;let d=(l,p)=>{if(typeof l=="object"&&(l.tag||(l.tag=p),typeof l?.children=="object")){e:for(let y in l.children)if(g++,typeof l.children[y]=="object"){let u=l.children[y];if(u.tag&&o[u.tag])continue;if(a){for(let N in a)if(u=a[N](u,y,l,t,o),!u)continue e}u.id&&!u.tag&&(u.tag=u.id);let m;if(u.tag)if(o[u.tag]){let N=`${u.tag}${g}`;o[N]=u,u.tag=N,d(o[N],y),m=N}else o[u.tag]=u,d(o[u.tag],y),m=u.tag;else if(o[y]){let N=`${y}${g}`;o[N]=u,u.tag=N,d(o[N],y),m=N}else o[y]=u,d(o[y],y),m=y;n?.name&&i?(o[n.name+s+m]=u,delete o[m]):o[m]=u}}};o[f]=t[f],d(t[f],f)}e:for(let f in o)if(typeof o[f]=="object"){let d=o[f];if(typeof d=="object"){if(r){for(let l in r)if(d=r[l](d,f,o),!d)continue e}d.get&&d.get,d.post,d.delete,d.put,d.head,d.patch,d.options,d.connect,d.trace,d.post&&!d.operator?o[f].operator=d.post:!d.operator&&typeof d.get=="function"&&(o[f].operator=d.get)}}for(let f in t)typeof t[f]=="object"?this.routes[f]?typeof this.routes[f]=="object"?Object.assign(this.routes[f],t[f]):this.routes[f]=t[f]:this.routes[f]=t[f]:this.routes[f]?typeof this.routes[f]=="object"?Object.assign(this.routes[f],t[f]):this.routes[f]=t[f]:this.routes[f]=t[f];if(n)for(let f in this.routes)this.routes[f]instanceof c&&(this.nodes.set(f,this.routes[f]),this.nNodes=this.nodes.size);else this.setTree(this.routes);for(let f in this.routes)this.routes[f]?.aliases&&this.routes[f].aliases.forEach(l=>{n?.name&&i?t[n.name+s+l]=this.routes[f]:t[l]=this.routes[f]});return this.routes};this.unload=(t=this.routes)=>{if(!t)return;let i;!(t instanceof w)&&typeof t=="function"?(i=new w,t=i.routes):t instanceof w&&(t=t.routes);for(let s in t)delete this.routes[s],this.nodes.get(s)&&this.remove(s);return this.routes};this.handleMethod=(t,i,s)=>{let r=i.toLowerCase();return r==="get"&&this.routes[t]?.get?.transform instanceof Function?Array.isArray(s)?this.routes[t].get.transform(...s):this.routes[t].get.transform(s):this.routes[t]?.[r]?this.routes[t][r]instanceof Function?this.routes[t][r](s):(s&&(this.routes[t][r]=s),this.routes[t][r]):this.handleServiceMessage({route:t,args:s,method:i})};this.transmit=(...t)=>typeof t[0]=="object"?t[0].method?this.handleMethod(t[0].route,t[0].method,t[0].args):t[0].route?this.handleServiceMessage(t[0]):t[0].node?this.handleGraphNodeCall(t[0].node,t[0].args):(this.keepState&&(t[0].route&&this.setState({[t[0].route]:t[0].args}),t[0].node&&this.setState({[t[0].node]:t[0].args})),t):t;this.receive=(...t)=>{if(t[0]&&typeof t[0]=="string"){let i=t[0].substring(0,8);(i.includes("{")||i.includes("["))&&(i.includes("\\")&&(t[0]=t[0].replace(/\\/g,"")),t[0][0]==='"'&&(t[0]=t[0].substring(1,t[0].length-1)),t[0]=JSON.parse(t[0]))}return typeof t[0]=="object"?t[0].method?this.handleMethod(t[0].route,t[0].method,t[0].args):t[0].route?this.handleServiceMessage(t[0]):t[0].node?this.handleGraphNodeCall(t[0].node,t[0].args):(this.keepState&&(t[0].route&&this.setState({[t[0].route]:t[0].args}),t[0].node&&this.setState({[t[0].node]:t[0].args})),t):t};this.pipe=(t,i,s,r,a)=>{if(t instanceof c)return a?t.subscribe(n=>{let o=a(n);o!==void 0?this.transmit({route:i,args:o,method:r}):this.transmit({route:i,args:n,method:r},s)}):this.subscribe(t,n=>{this.transmit({route:i,args:n,method:r},s)});if(typeof t=="string")return this.subscribe(t,n=>{this.transmit({route:i,args:n,method:r},s)})};this.pipeOnce=(t,i,s,r,a)=>{if(t instanceof c)return a?t.state.subscribeTriggerOnce(t.tag,n=>{let o=a(n);o!==void 0?this.transmit({route:i,args:o,method:r}):this.transmit({route:i,args:n,method:r},s)}):this.state.subscribeTriggerOnce(t.tag,n=>{this.transmit({route:i,args:n,method:r},s)});if(typeof t=="string")return this.state.subscribeTriggerOnce(t,n=>{this.transmit({route:i,args:n,method:r},s)})};this.terminate=(...t)=>{this.nodes.forEach(i=>{i.stopNode()})};this.recursivelyAssign=(t,i)=>{for(let s in i)typeof i[s]=="object"?typeof t[s]=="object"?this.recursivelyAssign(t[s],i[s]):t[s]=this.recursivelyAssign({},i[s]):t[s]=i[s];return t};this.defaultRoutes={"/":{get:()=>this.print(),aliases:[""]},ping:()=>(console.log("ping"),"pong"),echo:(...t)=>(this.transmit(...t),t),assign:t=>typeof t=="object"?(Object.assign(this,t),!0):!1,recursivelyAssign:t=>typeof t=="object"?(this.recursivelyAssign(this,t),!0):!1,log:{post:(...t)=>{console.log("Log: ",...t)},aliases:["info"]},error:t=>{let i=new Error(t);return console.error(t),i},state:t=>t?this.state.data[t]:this.state.data,printState:t=>t?E(this.state.data[t]):E(this.state.data),spliceTypedArray:this.spliceTypedArray,transmit:this.transmit,receive:this.receive,load:this.load,unload:this.unload,pipe:this.pipe,terminate:this.terminate,run:this.run,_run:this._run,subscribe:this.subscribe,subscribeNode:this.subscribeNode,unsubscribe:this.unsubscribe,stopNode:this.stopNode,get:this.get,add:this.add,remove:this.remove,setTree:this.setTree,setState:this.setState,print:this.print,reconstruct:this.reconstruct,handleMethod:this.handleMethod,handleServiceMessage:this.handleServiceMessage,handleGraphNodeCall:this.handleGraphNodeCall};t.name?this.name=t.name:t.name=this.tag,"loadDefaultRoutes"in t&&(this.loadDefaultRoutes=t.loadDefaultRoutes,this.routes=Object.assign(this.defaultRoutes,this.routes)),(t||Object.keys(this.routes).length>0)&&this.init(t)}handleServiceMessage(t){let i;return typeof t=="object"&&(t.route?i=t.route:t.node&&(i=t.node)),i?Array.isArray(t.args)?this.run(i,...t.args):this.run(i,t.args):t}handleGraphNodeCall(t,i){if(!t)return i;if(i?.args)this.handleServiceMessage(i);else return Array.isArray(i)?this.run(t,...i):this.run(t,i)}isTypedArray(t){return ArrayBuffer.isView(t)&&Object.prototype.toString.call(t)!=="[object DataView]"}spliceTypedArray(t,i,s){let r=t.subarray(0,i),a;s&&(a=t.subarray(s+1));let n;return(r.length>0||a?.length>0)&&(n=new t.constructor(r.length+a.length)),r.length>0&&n.set(r),a&&a.length>0&&n.set(a,r.length),n}};var F={setRoute:function(h,e){return typeof h=="string"&&(h=G(h)),typeof h=="function"?(e||(e=h.name),this.graph.get(e)?this.graph.get(e).setOperator(h):this.graph.load({[e]:{operator:h}}),!0):!1},setNode:function(h,e){return typeof h=="string"&&(h=G(h)),typeof h=="function"?(e||(e=h.name),this.graph.get(e)?this.graph.get(e).setOperator(h):this.graph.add({tag:e,operator:h}),!0):!1},setMethod:function(h,e,t){return typeof e=="string"&&(e=G(e)),typeof e=="function"?(t||(t=e.name),this.graph.get(h)?this.graph.get(h)[t]=e:this.graph.add({tag:t,[t]:e}),!0):!1},assignRoute:function(h,e){this.graph.get(h)&&typeof e=="object"&&Object.assign(this.graph.get(h),e)},transferClass:(h,e)=>{if(typeof h=="object"){let t=h.toString();return{route:"receiveClass",args:[t,e]}}return!1},receiveClass:function(h,e){if(typeof h=="string"&&h.indexOf("class")===0){let t=(0,eval)("("+h+")"),i=e;return i||(i=t.name),this.graph[i]=t,!0}return!1},setGlobal:(h,e)=>(globalThis[h]=e,!0),assignGlobalObject:(h,e)=>globalThis[h]?(typeof e=="object"&&Object.assign(globalThis[h],e),!0):!1,setValue:function(h,e){return this.graph[h]=e,!0},assignObject:function(h,e){return this.graph[h]?(typeof e=="object"&&Object.assign(this.graph[h],e),!0):!1},setGlobalFunction:(h,e)=>(typeof h=="string"&&(h=G(h)),typeof h=="function"?(e||(e=h.name),globalThis[e]=h,!0):!1),assignFunctionToGlobalObject:function(h,e,t){return globalThis[h]?(typeof e=="string"&&(e=G(e)),typeof e=="function"?(t||(t=e.name),this.graph[h][t]=e,!0):!1):!1},setFunction:function(h,e){return typeof h=="string"&&(h=G(h)),typeof h=="function"?(e||(e=h.name),this.graph[e]=h,!0):!1},assignFunctionToObject:function(h,e,t){return this.graph[h]?(typeof e=="string"&&(e=G(e)),typeof e=="function"?(t||(t=e.name),this.graph[h][t]=e,!0):!1):!1}};var S=class extends w{constructor(t){super(t);this.entities={};this.systems={};this.map=new Map;this.order=[];this.animating=!0;this.updateEntities=(t=this.order,i,s=!1)=>{t.forEach(r=>{this.systems[r]&&(i?(s&&(s=performance.now()),this.systems[r].run(this.map.get(r)),s&&console.log("system",r,"took",performance.now()-s,"ms for",Object.keys(this.map.get(r)).length,"entities")):(s&&(s=performance.now()),this.systems[r].run(this.entities),s&&console.log("system",r,"took",performance.now()-s,"ms for",Object.keys(this.entities).length,"entities")))})};this.animate=(t=!0,i)=>{requestAnimationFrame(()=>{this.animating&&(this.updateEntities(i,t),this.animate(t,i))})};this.stop=()=>{this.animating=!1};this.start=t=>{this.animating=!0,this.animate(t)};this.addEntities=(t,i={},s=1)=>{let r=0,a={};for(;r<s;){let n=this.addEntity(t,i);a[n.tag]=n,r++}return Object.keys(a)};this.addEntity=(t={},i={})=>{if(!t)return;let s=this.recursivelyAssign({},t);if(s.components=i,Object.keys(i).length===0&&Object.keys(this.systems).forEach(r=>{i[r]=!0}),s.tag&&this.entities[s.tag]){let r=s.tag,a=2;for(;this.entities[s.tag];)s.tag=`${r}${a}`,a++}else s.tag||(s.tag=`entity${Math.floor(Math.random()*1e15)}`);return this.load({[s.tag]:s}),this.entities[s.tag]=this.nodes.get(s.tag),this.setupEntity(this.entities[s.tag]),this.entities[s.tag]};this.addSystems=(t={},i)=>{for(let s in t)t[s].tag=s,this.addSystem(t[s],void 0,void 0,i);return this.systems};this.addSystem=(t,i,s,r)=>{if(!t)return;let a=this.recursivelyAssign({},t);if(i&&(a.setupEntities=i),s&&(a.operator=s),a.tag&&this.systems[a.tag]){let n=a.tag,o=2;for(;this.systems[a.tag];)a.tag=`${n}${o}`,o++}else a.tag||(a.tag=`system${Math.floor(Math.random()*1e15)}`);if(this.load({[a.tag]:a}),this.systems[a.tag]=this.nodes.get(a.tag),this.map.get(a.tag)||this.map.set(a.tag,{}),this.systems[a.tag]?.setupEntities){let n=this.filterObject(this.entities,(o,g)=>{if(g.components[a.tag])return!0});this.systems[a.tag].setupEntities(a,n),Object.assign(this.map.get(a.tag),n)}return r?this.order=r:this.order.push(a.tag),this.systems[a.tag]};this.setupEntity=t=>{if(t?.components)for(let i in t.components)this.systems[i]&&(this.systems[i].setupEntity(this.systems[i],t),this.map.get(i)[t.tag]=t)};this.removeEntity=t=>{let i=this.entities[t];for(let s in i.components)this.map.get(s)&&delete this.map.get(s)[i.tag];return delete this.entities[t],this.remove(t)};this.removeSystem=t=>(delete this.systems[t],this.map.delete(t),this.order.splice(this.order.indexOf(t),1),this.remove(t));this.bufferValues=(t,i,s,r)=>{if(!Array.isArray(s)&&typeof s=="object"&&(s=Object.keys(s)),!r){let n=Object.keys(t);s?r=new Float32Array(n.length*s.length):typeof t[n[0]][i]=="object"?(s=Object.keys(t[n[0]][i]),r=new Float32Array(n.length*s.length)):r=new Float32Array(n.length)}let a=0;for(let n in t)if(t[n][i])if(s)for(let o=0;o<s.length;o++)r[a]=t[n][i][s[o]],a++;else r[a]=t[n][i],a++;return r};this.routes={animateEntities:this.animate,startEntityAnimation:this.start,stopEntityAnimation:this.stop,addEntity:this.addEntity,addSystem:this.addSystem,addSystems:this.addSystems,removeEntity:this.removeEntity,removeSystem:this.removeSystem,setupEntity:this.setupEntity,addEntities:this.addEntities,filterObject:this.filterObject,bufferValues:this.bufferValues};if(this.routes&&this.load(this.routes),t.systems)for(let i in t.systems)this.addSystem(t.systems[i],void 0,void 0,t.order);if(t.entities)for(let i in t.entities)this.addEntity(t.entities[i],t.entities[i].components)}filterObject(t,i){return Object.fromEntries(Object.entries(t).filter(([s,r])=>{i(s,r)}))}};export{S as ECSService,O as Graph,c as GraphNode,w as Service,R as createNode,G as parseFunctionFromText,P as reconstructNode,A as reconstructObject,b as state,j as stringifyFast,E as stringifyWithCircularRefs,F as unsafeRoutes};
