(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/web-worker/cjs/browser.js
  var require_browser = __commonJS({
    "node_modules/web-worker/cjs/browser.js"(exports, module) {
      module.exports = Worker;
    }
  });

  // Graph.ts
  function parseFunctionFromText(method = "") {
    let getFunctionBody = (methodString) => {
      return methodString.replace(/^\W*(function[^{]+\{([\s\S]*)\}|[^=]+=>[^{]*\{([\s\S]*)\}|[^=]+=>(.+))/i, "$2$3$4");
    };
    let getFunctionHead = (methodString) => {
      let startindex = methodString.indexOf("=>") + 1;
      if (startindex <= 0) {
        startindex = methodString.indexOf("){");
      }
      if (startindex <= 0) {
        startindex = methodString.indexOf(") {");
      }
      return methodString.slice(0, methodString.indexOf("{", startindex) + 1);
    };
    let newFuncHead = getFunctionHead(method);
    let newFuncBody = getFunctionBody(method);
    let newFunc;
    if (newFuncHead.includes("function")) {
      let varName = newFuncHead.split("(")[1].split(")")[0];
      newFunc = new Function(varName, newFuncBody);
    } else {
      if (newFuncHead.substring(0, 6) === newFuncBody.substring(0, 6)) {
        let varName = newFuncHead.split("(")[1].split(")")[0];
        newFunc = new Function(varName, newFuncBody.substring(newFuncBody.indexOf("{") + 1, newFuncBody.length - 1));
      } else {
        try {
          newFunc = (0, eval)(newFuncHead + newFuncBody + "}");
        } catch {
        }
      }
    }
    return newFunc;
  }
  var state = {
    pushToState: {},
    data: {},
    triggers: {},
    setState(updateObj) {
      Object.assign(state.data, updateObj);
      for (const prop of Object.getOwnPropertyNames(updateObj)) {
        if (state.triggers[prop])
          state.triggers[prop].forEach((obj) => obj.onchange(state.data[prop]));
      }
      return state.data;
    },
    subscribeTrigger(key, onchange) {
      if (key) {
        if (!state.triggers[key]) {
          state.triggers[key] = [];
        }
        let l = state.triggers[key].length;
        state.triggers[key].push({ idx: l, onchange });
        return state.triggers[key].length - 1;
      } else
        return void 0;
    },
    unsubscribeTrigger(key, sub) {
      let idx = void 0;
      let triggers = state.triggers[key];
      if (triggers) {
        if (!sub)
          delete state.triggers[key];
        else {
          let obj = triggers.find((o) => {
            if (o.idx === sub) {
              return true;
            }
          });
          if (obj)
            triggers.splice(idx, 1);
          return true;
        }
      }
    },
    subscribeTriggerOnce(key, onchange) {
      let sub;
      let changed = (value) => {
        onchange(value);
        state.unsubscribeTrigger(key, sub);
      };
      sub = state.subscribeTrigger(key, changed);
    }
  };
  var GraphNode = class {
    constructor(properties = {}, parentNode, graph) {
      this.nodes = /* @__PURE__ */ new Map();
      this._initial = {};
      this.state = state;
      this.isLooping = false;
      this.isAnimating = false;
      this.looper = void 0;
      this.animation = void 0;
      this.forward = true;
      this.backward = false;
      this.runSync = false;
      this.firstRun = true;
      this.DEBUGNODE = false;
      this.operator = (...args) => {
        return args;
      };
      this.runOp = (...args) => {
        if (this.DEBUGNODE)
          console.time(this.tag);
        let result = this.operator(...args);
        if (result instanceof Promise) {
          result.then((res) => {
            if (res !== void 0)
              this.setState({ [this.tag]: res });
            if (this.DEBUGNODE) {
              console.timeEnd(this.tag);
              if (result !== void 0)
                console.log(`${this.tag} result:`, result);
            }
            ;
            return res;
          });
        } else {
          if (result !== void 0)
            this.setState({ [this.tag]: result });
          if (this.DEBUGNODE) {
            console.timeEnd(this.tag);
            if (result !== void 0)
              console.log(`${this.tag} result:`, result);
          }
          ;
        }
        return result;
      };
      this.setOperator = (operator) => {
        if (typeof operator !== "function")
          return operator;
        this.operator = operator.bind(this);
        return operator;
      };
      this.runAsync = (...args) => {
        return new Promise((res, rej) => {
          res(this.run(...args));
        });
      };
      this.transformArgs = (args = []) => args;
      this.run = (...args) => {
        if (typeof this.transformArgs === "function")
          args = this.transformArgs(args, this);
        if (this.firstRun) {
          this.firstRun = false;
          if (!(this.children && this.forward || this.parent && this.backward || this.repeat || this.delay || this.frame || this.recursive || this.branch))
            this.runSync = true;
          if (this.animate && !this.isAnimating) {
            this.runAnimation(this.animation, args);
          }
          if (this.loop && typeof this.loop === "number" && !this.isLooping) {
            this.runLoop(this.looper, args);
          }
          if (this.loop || this.animate)
            return;
        }
        if (this.runSync) {
          let res = this.runOp(...args);
          return res;
        }
        return new Promise(async (resolve) => {
          if (this) {
            let run = (node, tick = 0, ...input) => {
              return new Promise(async (r) => {
                tick++;
                let res = await node.runOp(...input);
                if (node.repeat) {
                  while (tick < node.repeat) {
                    if (node.delay) {
                      setTimeout(async () => {
                        r(await run(node, tick, ...input));
                      }, node.delay);
                      break;
                    } else if (node.frame && window?.requestAnimationFrame) {
                      requestAnimationFrame(async () => {
                        r(await run(node, tick, ...input));
                      });
                      break;
                    } else
                      res = await node.runOp(...input);
                    tick++;
                  }
                  if (tick === node.repeat) {
                    r(res);
                    return;
                  }
                } else if (node.recursive) {
                  while (tick < node.recursive) {
                    if (node.delay) {
                      setTimeout(async () => {
                        r(await run(node, tick, ...res));
                      }, node.delay);
                      break;
                    } else if (node.frame && window?.requestAnimationFrame) {
                      requestAnimationFrame(async () => {
                        r(await run(node, tick, ...res));
                      });
                      break;
                    } else
                      res = await node.runOp(...res);
                    tick++;
                  }
                  if (tick === node.recursive) {
                    r(res);
                    return;
                  }
                } else {
                  r(res);
                  return;
                }
              });
            };
            let runnode = async () => {
              let res = await run(this, void 0, ...args);
              if (res !== void 0) {
                if (this.backward && this.parent instanceof GraphNode) {
                  if (Array.isArray(res))
                    await this.runParent(this, ...res);
                  else
                    await this.runParent(this, res);
                }
                if (this.children && this.forward) {
                  if (Array.isArray(res))
                    await this.runChildren(this, ...res);
                  else
                    await this.runChildren(this, res);
                }
                if (this.branch) {
                  this.runBranch(this, res);
                }
              }
              return res;
            };
            if (this.delay) {
              setTimeout(async () => {
                resolve(await runnode());
              }, this.delay);
            } else if (this.frame && window?.requestAnimationFrame) {
              requestAnimationFrame(async () => {
                resolve(await runnode());
              });
            } else {
              resolve(await runnode());
            }
          } else
            resolve(void 0);
        });
      };
      this.runParent = async (n, ...args) => {
        if (n.backward && n.parent) {
          if (typeof n.parent === "string") {
            if (n.graph && n.graph?.get(n.parent)) {
              n.parent = n.graph;
              if (n.parent)
                this.nodes.set(n.parent.tag, n.parent);
            } else
              n.parent = this.nodes.get(n.parent);
          }
          if (n.parent instanceof GraphNode)
            await n.parent.run(...args);
        }
      };
      this.runChildren = async (n, ...args) => {
        if (typeof n.children === "object") {
          for (const key in n.children) {
            if (typeof n.children[key] === "string") {
              if (n.graph && n.graph?.get(n.children[key])) {
                n.children[key] = n.graph.get(n.children[key]);
                if (!n.nodes.get(n.children[key].tag))
                  n.nodes.set(n.children[key].tag, n.children[key]);
              }
              if (!n.children[key] && n.nodes.get(n.children[key]))
                n.children[key] = n.nodes.get(n.children[key]);
            } else if (typeof n.children[key] === "undefined" || n.children[key] === true) {
              if (n.graph && n.graph?.get(key)) {
                n.children[key] = n.graph.get(key);
                if (!n.nodes.get(n.children[key].tag))
                  n.nodes.set(n.children[key].tag, n.children[key]);
              }
              if (!n.children[key] && n.nodes.get(key))
                n.children[key] = n.nodes.get(key);
            }
            if (n.children[key]?.runOp)
              await n.children[key].run(...args);
          }
        }
      };
      this.runBranch = async (n, output) => {
        if (n.branch) {
          let keys = Object.keys(n.branch);
          await Promise.all(keys.map(async (k) => {
            if (typeof n.branch[k].if === "object")
              n.branch[k].if = stringifyFast(n.branch[k].if);
            let pass = false;
            if (typeof n.branch[k].if === "function") {
              pass = n.branch[k].if(output);
            } else {
              if (typeof output === "object") {
                if (stringifyFast(output) === n.branch[k].if)
                  pass = true;
              } else if (output === n.branch[k].if)
                pass = true;
            }
            if (pass) {
              if (n.branch[k].then instanceof GraphNode) {
                if (Array.isArray(output))
                  await n.branch[k].then.run(...output);
                else
                  await n.branch[k].then.run(...output);
              } else if (typeof n.branch[k].then === "function") {
                if (Array.isArray(output))
                  await n.branch[k].then(...output);
                else
                  await n.branch[k].then(output);
              } else if (typeof n.branch[k].then === "string") {
                if (n.graph)
                  n.branch[k].then = n.graph.nodes.get(n.branch[k].then);
                else
                  n.branch[k].then = n.nodes.get(n.branch[k].then);
                if (n.branch[k].then instanceof GraphNode) {
                  if (Array.isArray(output))
                    await n.branch[k].then.run(...output);
                  else
                    await n.branch[k].then.run(...output);
                }
              }
            }
            return pass;
          }));
        }
      };
      this.runAnimation = (animation = this.animation, args = []) => {
        this.animation = animation;
        if (!animation)
          this.animation = this.operator;
        if (this.animate && !this.isAnimating && "requestAnimationFrame" in window) {
          this.isAnimating = true;
          let anim = async () => {
            if (this.isAnimating) {
              if (this.DEBUGNODE)
                console.time(this.tag);
              let result = this.animation.call(this, ...args);
              if (result instanceof Promise) {
                result = await result;
              }
              if (this.DEBUGNODE) {
                console.timeEnd(this.tag);
                if (result !== void 0)
                  console.log(`${this.tag} result:`, result);
              }
              ;
              if (result !== void 0) {
                if (this.tag)
                  this.setState({ [this.tag]: result });
                if (this.backward && this.parent?.run) {
                  if (Array.isArray(result))
                    await this.runParent(this, ...result);
                  else
                    await this.runParent(this, result);
                }
                if (this.children && this.forward) {
                  if (Array.isArray(result))
                    await this.runChildren(this, ...result);
                  else
                    await this.runChildren(this, result);
                }
                if (this.branch) {
                  this.runBranch(this, result);
                }
                this.setState({ [this.tag]: result });
              }
              requestAnimationFrame(anim);
            }
          };
          requestAnimationFrame(anim);
        }
      };
      this.runLoop = (loop = this.looper, args = [], timeout = this.loop) => {
        this.looper = loop;
        if (!loop)
          this.looper = this.operator;
        if (typeof timeout === "number" && !this.isLooping) {
          this.isLooping = true;
          let looping = async () => {
            if (this.isLooping) {
              if (this.DEBUGNODE)
                console.time(this.tag);
              let result = this.looper.call(this, ...args);
              if (result instanceof Promise) {
                result = await result;
              }
              if (this.DEBUGNODE) {
                console.timeEnd(this.tag);
                if (result !== void 0)
                  console.log(`${this.tag} result:`, result);
              }
              ;
              if (result !== void 0) {
                if (this.tag)
                  this.setState({ [this.tag]: result });
                if (this.backward && this.parent?.run) {
                  if (Array.isArray(result))
                    await this.runParent(this, ...result);
                  else
                    await this.runParent(this, result);
                }
                if (this.children && this.forward) {
                  if (Array.isArray(result))
                    await this.runChildren(this, ...result);
                  else
                    await this.runChildren(this, result);
                }
                if (this.branch) {
                  this.runBranch(this, result);
                }
                this.setState({ [this.tag]: result });
              }
              setTimeout(async () => {
                await looping();
              }, timeout);
            }
          };
          looping();
        }
      };
      this.setParent = (parent) => {
        this.parent = parent;
        if (this.backward)
          this.runSync = false;
      };
      this.setChildren = (children) => {
        this.children = children;
        if (this.forward)
          this.runSync = false;
      };
      this.add = (n = {}) => {
        if (typeof n === "function")
          n = { operator: n };
        if (!(n instanceof GraphNode))
          n = new GraphNode(n, this, this.graph);
        this.nodes.set(n.tag, n);
        if (this.graph) {
          this.graph.nodes.set(n.tag, n);
          this.graph.nNodes = this.graph.nodes.size;
        }
        return n;
      };
      this.remove = (n) => {
        if (typeof n === "string")
          n = this.nodes.get(n);
        if (n instanceof GraphNode) {
          this.nodes.delete(n.tag);
          if (this.children[n.tag])
            delete this.children[n.tag];
          if (this.graph) {
            this.graph.nodes.delete(n.tag);
            this.graph.nNodes = this.graph.nodes.size;
          }
          this.nodes.forEach((n2) => {
            if (n2.nodes.get(n2.tag)) {
              n2.nodes.delete(n2.tag);
              if (n2.children[n2.tag])
                delete n2.children[n2.tag];
              if (n2.parent?.tag === n2.tag)
                delete n2.parent;
            }
          });
          if (n.ondelete)
            n.ondelete(n);
        }
      };
      this.append = (n, parentNode = this) => {
        if (typeof n === "string")
          n = this.nodes.get(n);
        if (n instanceof GraphNode) {
          parentNode.addChildren(n);
          if (n.forward)
            n.runSync = false;
        }
      };
      this.subscribe = (callback, tag = this.tag) => {
        if (callback instanceof GraphNode) {
          return this.subscribeNode(callback);
        } else
          return this.state.subscribeTrigger(tag, callback);
      };
      this.unsubscribe = (sub, tag = this.tag) => {
        this.state.unsubscribeTrigger(tag, sub);
      };
      this.addChildren = (children) => {
        if (!this.children)
          this.children = {};
        if (typeof children === "object") {
          Object.assign(this.children, children);
        }
        this.convertChildrenToNodes();
        if (this.forward)
          this.runSync = false;
      };
      this.callParent = (...args) => {
        if (typeof this.parent === "string") {
          if (this.graph && this.graph?.get(this.parent)) {
            this.parent = this.graph;
            if (this.parent)
              this.nodes.set(this.parent.tag, this.parent);
          } else
            this.parent = this.nodes.get(this.parent);
        }
        if (typeof this.parent?.operator === "function")
          return this.parent.runOp(...args);
      };
      this.callChildren = (...args) => {
        let result;
        if (typeof this.children === "object") {
          for (const key in this.children) {
            if (this.children[key]?.runOp)
              this.children[key].runOp(...args);
          }
        }
        return result;
      };
      this.getProps = (n = this) => {
        return {
          tag: n.tag,
          operator: n.operator,
          graph: n.graph,
          children: n.children,
          parent: n.parent,
          forward: n.forward,
          backward: n.bacward,
          loop: n.loop,
          animate: n.animate,
          frame: n.frame,
          delay: n.delay,
          recursive: n.recursive,
          repeat: n.repeat,
          branch: n.branch,
          oncreate: n.oncreate,
          DEBUGNODE: n.DEBUGNODE,
          ...this._initial
        };
      };
      this.setProps = (props = {}) => {
        let tmp = Object.assign({}, props);
        if (tmp.children) {
          this.addChildren(props.children);
          delete tmp.children;
        }
        if (tmp.operator) {
          this.setOperator(props.operator);
          delete tmp.operator;
        }
        Object.assign(tmp, props);
        if (!(this.children && this.forward || this.parent && this.backward || this.repeat || this.delay || this.frame || this.recursive))
          this.runSync = true;
      };
      this.removeTree = (n) => {
        if (n) {
          if (typeof n === "string")
            n = this.nodes.get(n);
        }
        if (n instanceof GraphNode) {
          let checked = {};
          const recursivelyRemove = (node) => {
            if (typeof node.children === "object" && !checked[node.tag]) {
              checked[node.tag] = true;
              for (const key in node.children) {
                if (node.children[key].stopNode)
                  node.children[key].stopNode();
                if (node.children[key].tag) {
                  if (this.nodes.get(node.children[key].tag))
                    this.nodes.delete(node.children[key].tag);
                  this.nodes.forEach((n2) => {
                    if (n2.nodes.get(node.children[key].tag))
                      n2.nodes.delete(node.children[key].tag);
                    if (n2.children[key] instanceof GraphNode)
                      delete n2.children[key];
                  });
                  recursivelyRemove(node.children[key]);
                }
              }
            }
          };
          if (n.stopNode)
            n.stopNode();
          if (n.tag) {
            this.nodes.delete(n.tag);
            if (this.children[n.tag])
              delete this.children[n.tag];
            if (this.parent?.tag === n.tag)
              delete this.parent;
            if (this[n.tag] instanceof GraphNode)
              delete this[n.tag];
            this.nodes.forEach((n2) => {
              if (n2?.tag) {
                if (n2.nodes.get(n2.tag))
                  n2.nodes.delete(n2.tag);
                if (n2.children[n2.tag] instanceof GraphNode)
                  delete n2.children[n2.tag];
              }
            });
            recursivelyRemove(n);
            if (this.graph)
              this.graph.removeTree(n, checked);
            else if (n.ondelete)
              n.ondelete(n);
          }
        }
      };
      this.checkNodesHaveChildMapped = (n, child, checked = {}) => {
        let tag = n.tag;
        if (!tag)
          tag = n.name;
        if (!checked[tag]) {
          checked[tag] = true;
          if (n.children) {
            if (child.tag in n.children) {
              if (n.children[child.tag] instanceof GraphNode) {
                if (!n.nodes.get(child.tag))
                  n.nodes.set(child.tag, child);
                n.children[child.tag] = child;
                if (!n.firstRun)
                  n.firstRun = true;
              }
            }
          }
          if (n.parent instanceof GraphNode) {
            if (n.nodes.get(child.tag) && !n.parent.nodes.get(child.tag))
              n.parent.nodes.set(child.tag, child);
            if (n.parent.children) {
              this.checkNodesHaveChildMapped(n.parent, child, checked);
            } else if (n.nodes) {
              n.nodes.forEach((n2) => {
                if (!checked[n2.tag]) {
                  this.checkNodesHaveChildMapped(n2, child, checked);
                }
              });
            }
          }
          if (n.graph) {
            if (n.parent && n.parent.name !== n.graph.name) {
              n.graph.nodes.forEach((n2) => {
                if (!checked[n2.tag]) {
                  this.checkNodesHaveChildMapped(n2, child, checked);
                }
              });
            }
          }
        }
      };
      this.convertChildrenToNodes = (n = this) => {
        if (n?.children) {
          for (const key in n.children) {
            if (!(n.children[key] instanceof GraphNode)) {
              if (typeof n.children[key] === "object") {
                if (!n.children[key].tag)
                  n.children[key].tag = key;
                if (!n.nodes.get(n.children[key].tag)) {
                  n.children[key] = new GraphNode(n.children[key], n, n.graph);
                  this.checkNodesHaveChildMapped(n, n.children[key]);
                }
              } else {
                if (typeof n.children[key] === "undefined" || n.children[key] == true) {
                  n.children[key] = n.graph.get(key);
                  if (!n.children[key])
                    n.children[key] = n.nodes.get(key);
                } else if (typeof n.children[key] === "string") {
                  let k = n.children[key];
                  n.children[key] = n.graph.get(k);
                  if (!n.children[key])
                    n.children[key] = n.nodes.get(key);
                }
                if (n.children[key] instanceof GraphNode) {
                  if (n.graph) {
                    let props = n.children[key].getProps();
                    delete props.parent;
                    delete props.graph;
                    if (n.source instanceof Graph) {
                      n.children[key] = new GraphNode(props, n, n.source);
                    } else {
                      n.children[key] = new GraphNode(props, n, n.graph);
                    }
                  }
                  n.nodes.set(n.children[key].tag, n.children[key]);
                  this.checkNodesHaveChildMapped(n, n.children[key]);
                  if (!(n.children[key].tag in n))
                    n[n.children[key].tag] = n.children[key];
                }
              }
            }
          }
        }
        return n.children;
      };
      this.stopLooping = (n = this) => {
        n.isLooping = false;
      };
      this.stopAnimating = (n = this) => {
        n.isAnimating = false;
      };
      this.stopNode = (n = this) => {
        n.stopAnimating(n);
        n.stopLooping(n);
      };
      this.subscribeNode = (n) => {
        if (typeof n === "string")
          n = this.nodes.get(n);
        if (n.tag)
          this.nodes.set(n.tag, n);
        if (n)
          return this.state.subscribeTrigger(
            this.tag,
            (res) => {
              if (Array.isArray(res))
                n.run(...res);
              else
                n.run(res);
            }
          );
      };
      this.print = (n = this, printChildren = true, nodesPrinted = []) => {
        let dummyNode = new GraphNode();
        if (typeof n === "string")
          n = this.nodes.get(n);
        if (n instanceof GraphNode) {
          nodesPrinted.push(n.tag);
          let jsonToPrint = {
            tag: n.tag,
            operator: n.operator.toString()
          };
          if (n.parent)
            jsonToPrint.parent = n.parent.tag;
          if (typeof n.children === "object") {
            for (const key in n.children) {
              if (typeof n.children[key] === "string")
                return n.children[key];
              if (nodesPrinted.includes(n.children[key].tag))
                return n.children[key].tag;
              else if (!printChildren) {
                return n.children[key].tag;
              } else
                return n.children[key].print(n.children[key], printChildren, nodesPrinted);
            }
          }
          for (const prop in n) {
            if (prop === "parent" || prop === "children")
              continue;
            if (typeof dummyNode[prop] === "undefined") {
              if (typeof n[prop] === "function") {
                jsonToPrint[prop] = n[prop].toString();
              } else if (typeof n[prop] === "object") {
                jsonToPrint[prop] = JSON.stringifyWithCircularRefs(n[prop]);
              } else {
                jsonToPrint[prop] = n[prop];
              }
            }
          }
          return JSON.stringify(jsonToPrint);
        }
      };
      this.reconstruct = (json) => {
        let parsed = reconstructObject(json);
        if (parsed)
          return this.add(parsed);
      };
      this.setState = this.state.setState;
      this.DEBUGNODES = (debugging = true) => {
        this.DEBUGNODE = debugging;
        this.nodes.forEach((n) => {
          if (debugging)
            n.DEBUGNODE = true;
          else
            n.DEBUGNODE = false;
        });
      };
      if (typeof properties === "function") {
        properties = { operator: properties };
      }
      if (typeof properties === "object") {
        if (properties instanceof GraphNode && properties._initial)
          Object.assign(properties, properties._initial);
        if (properties instanceof Graph) {
          let source = properties;
          properties = {
            source,
            operator: (input) => {
              if (typeof input === "object") {
                let result = {};
                for (const key in input) {
                  if (typeof source[key] === "function") {
                    if (Array.isArray(input[key]))
                      result[key] = source[key](...input[key]);
                    else
                      result[key] = source[key](input[key]);
                  } else {
                    source[key] = input[key];
                    result[key] = source[key];
                  }
                }
                return result;
              }
              return source;
            }
          };
          if (source.operator)
            properties.operator = source.operator;
          if (source.children)
            properties.children = source.children;
          if (source.forward)
            properties.forward = source.forward;
          if (source.backward)
            properties.backward = source.backward;
          if (source.repeat)
            properties.repeat = source.repeat;
          if (source.recursive)
            properties.recursive = source.recursive;
          if (source.loop)
            properties.loop = source.loop;
          if (source.animate)
            properties.animate = source.animate;
          if (source.looper)
            properties.looper = source.looper;
          if (source.animation)
            properties.animation = source.animation;
          if (source.delay)
            properties.delay = source.delay;
          if (source.tag)
            properties.tag = source.tag;
          if (source.oncreate)
            properties.oncreate = source.oncreate;
          if (source.node) {
            if (source.node._initial)
              Object.assign(properties, source.node._initial);
          }
          if (source._initial)
            Object.assign(properties, source._initial);
          this.nodes = source.nodes;
          source.node = this;
          if (graph) {
            source.nodes.forEach((n) => {
              if (!graph.nodes.get(n.tag)) {
                graph.nodes.set(n.tag, n);
                graph.nNodes++;
              }
            });
          }
        }
        if (properties.tag && (graph || parentNode)) {
          let hasnode;
          if (graph?.nodes) {
            hasnode = graph.nodes.get(properties.tag);
          }
          if (!hasnode && parentNode?.nodes) {
            hasnode = parentNode.nodes.get(properties.tag);
          }
          if (hasnode) {
            for (let k in hasnode)
              this[k] = hasnode[k];
            if (!this.source)
              this.source = hasnode;
            let props = hasnode.getProps();
            delete props.graph;
            delete props.parent;
            for (let k in props)
              properties[k] = props[k];
          }
        }
        if (properties?.operator) {
          properties.operator = this.setOperator(properties.operator);
        }
        if (!properties.tag && graph) {
          properties.tag = `node${graph.nNodes}`;
        } else if (!properties.tag) {
          properties.tag = `node${Math.floor(Math.random() * 1e10)}`;
        }
        let keys = Object.getOwnPropertyNames(this);
        for (const key in properties) {
          if (!keys.includes(key))
            this._initial[key] = properties[key];
        }
        if (properties.children)
          this._initial.children = Object.assign({}, properties.children);
        for (let k in properties)
          this[k] = properties[k];
        if (!this.tag) {
          if (graph) {
            this.tag = `node${graph.nNodes}`;
          } else {
            this.tag = `node${Math.floor(Math.random() * 1e10)}`;
          }
        }
        if (graph) {
          this.graph = graph;
          if (graph.nodes.get(this.tag)) {
            this.tag = `${this.tag}${graph.nNodes + 1}`;
          }
          graph.nodes.set(this.tag, this);
          graph.nNodes++;
        }
        if (parentNode) {
          this.parent = parentNode;
          if (parentNode instanceof GraphNode || parentNode instanceof Graph)
            parentNode.nodes.set(this.tag, this);
        }
        if (typeof properties.tree === "object") {
          for (const key in properties.tree) {
            if (typeof properties.tree[key] === "object") {
              if ((!properties.tree[key]).tag) {
                properties.tree[key].tag = key;
              }
            }
            let node = new GraphNode(properties.tree[key], this, graph);
            this.nodes.set(node.tag, node);
          }
        }
        if (this.children)
          this.convertChildrenToNodes(this);
        if (this.parent instanceof GraphNode || this.parent instanceof Graph)
          this.checkNodesHaveChildMapped(this.parent, this);
        if (typeof this.oncreate === "function")
          this.oncreate(this);
        if (!this.firstRun)
          this.firstRun = true;
      } else
        return properties;
    }
  };
  var Graph = class {
    constructor(tree, tag, props) {
      this.nNodes = 0;
      this.nodes = /* @__PURE__ */ new Map();
      this.state = state;
      this.tree = {};
      this.add = (n = {}) => {
        let props = n;
        if (!(n instanceof GraphNode))
          n = new GraphNode(props, this, this);
        else {
          this.nNodes = this.nodes.size;
          if (n.tag) {
            this.tree[n.tag] = props;
            this.nodes.set(n.tag, n);
          }
        }
        return n;
      };
      this.setTree = (tree = this.tree) => {
        if (!tree)
          return;
        for (const node in tree) {
          const n = this.nodes.get(node);
          if (!n) {
            if (typeof tree[node] === "function") {
              this.add({ tag: node, operator: tree[node] });
            } else if (typeof tree[node] === "object" && !Array.isArray(tree[node])) {
              if (!tree[node].tag)
                tree[node].tag = node;
              let newNode = this.add(tree[node]);
              if (tree[node].aliases) {
                tree[node].aliases.forEach((a) => {
                  this.nodes.set(a, newNode);
                });
              }
            } else {
              this.add({ tag: node, operator: (...args) => {
                return tree[node];
              } });
            }
          } else {
            if (typeof tree[node] === "function") {
              n.setOperator(tree[node]);
            } else if (typeof tree[node] === "object") {
              if (tree[node] instanceof GraphNode) {
                this.add(tree[node]);
              } else if (tree[node] instanceof Graph) {
                let source = tree[node];
                let properties = {};
                if (source.operator)
                  properties.operator = source.operator;
                if (source.children)
                  properties.children = source.children;
                if (source.forward)
                  properties.forward = source.forward;
                if (source.backward)
                  properties.backward = source.backward;
                if (source.repeat)
                  properties.repeat = source.repeat;
                if (source.recursive)
                  properties.recursive = source.recursive;
                if (source.loop)
                  properties.loop = source.loop;
                if (source.animate)
                  properties.animate = source.animate;
                if (source.looper)
                  properties.looper = source.looper;
                if (source.animation)
                  properties.animation = source.animation;
                if (source.delay)
                  properties.delay = source.delay;
                if (source.tag)
                  properties.tag = source.tag;
                if (source.oncreate)
                  properties.oncreate = source.oncreate;
                if (source.node?._initial)
                  Object.assign(properties, source.node._initial);
                properties.nodes = source.nodes;
                properties.source = source;
                n.setProps(properties);
              } else {
                n.setProps(tree[node]);
              }
            }
          }
        }
        this.nodes.forEach((node) => {
          if (typeof node.children === "object") {
            for (const key in node.children) {
              if (typeof node.children[key] === "string") {
                if (this.nodes.get(node.children[key])) {
                  node.children[key] = this.nodes.get(node.children[key]);
                }
              } else if (node.children[key] === true || typeof node.children[key] === "undefined") {
                if (this.nodes.get(key)) {
                  node.children[key] = this.nodes.get(key);
                }
              }
              if (node.children[key] instanceof GraphNode) {
                node.checkNodesHaveChildMapped(node, node.children[key]);
              }
            }
          }
          if (typeof node.parent === "string") {
            if (this.nodes.get(node.parent)) {
              node.parent = this.nodes.get(node.parent);
              node.nodes.set(node.parent.tag, node.parent);
            }
          }
        });
      };
      this.get = (tag) => {
        return this.nodes.get(tag);
      };
      this.set = (n) => {
        return this.nodes.set(n.tag, n);
      };
      this.run = (n, ...args) => {
        if (typeof n === "string")
          n = this.nodes.get(n);
        if (n instanceof GraphNode)
          return n.run(...args);
        else
          return void 0;
      };
      this.runAsync = (n, ...args) => {
        if (typeof n === "string")
          n = this.nodes.get(n);
        if (n instanceof GraphNode)
          return new Promise((res, rej) => {
            res(n.run(...args));
          });
        else
          return new Promise((res, rej) => {
            res(void 0);
          });
      };
      this.removeTree = (n, checked) => {
        if (typeof n === "string")
          n = this.nodes.get(n);
        if (n instanceof GraphNode) {
          if (!checked)
            checked = {};
          const recursivelyRemove = (node) => {
            if (node.children && !checked[node.tag]) {
              checked[node.tag] = true;
              if (Array.isArray(node.children)) {
                node.children.forEach((c) => {
                  if (c.stopNode)
                    c.stopNode();
                  if (c.tag) {
                    if (this.nodes.get(c.tag))
                      this.nodes.delete(c.tag);
                  }
                  this.nodes.forEach((n2) => {
                    if (n2.nodes.get(c.tag))
                      n2.nodes.delete(c.tag);
                  });
                  recursivelyRemove(c);
                });
              } else if (typeof node.children === "object") {
                if (node.stopNode)
                  node.stopNode();
                if (node.tag) {
                  if (this.nodes.get(node.tag))
                    this.nodes.delete(node.tag);
                }
                this.nodes.forEach((n2) => {
                  if (n2.nodes.get(node.tag))
                    n2.nodes.delete(node.tag);
                });
                recursivelyRemove(node);
              }
            }
          };
          if (n.stopNode)
            n.stopNode();
          if (n.tag) {
            this.nodes.delete(n.tag);
            this.nodes.forEach((n2) => {
              if (n2.nodes.get(n2.tag))
                n2.nodes.delete(n2.tag);
            });
            this.nNodes = this.nodes.size;
            recursivelyRemove(n);
          }
          if (n.ondelete)
            n.ondelete(n);
        }
        return n;
      };
      this.remove = (n) => {
        if (typeof n === "string")
          n = this.nodes.get(n);
        if (n instanceof GraphNode) {
          n.stopNode();
          if (n?.tag) {
            if (this.nodes.get(n.tag)) {
              this.nodes.delete(n.tag);
              this.nodes.forEach((n2) => {
                if (n2.nodes.get(n2.tag))
                  n2.nodes.delete(n2.tag);
              });
            }
          }
          if (n.ondelete)
            n.ondelete(n);
        }
        return n;
      };
      this.append = (n, parentNode) => {
        parentNode.addChildren(n);
      };
      this.callParent = async (n, ...args) => {
        if (n?.parent) {
          return await n.callParent(...args);
        }
      };
      this.callChildren = async (n, ...args) => {
        if (n?.children) {
          return await n.callChildren(...args);
        }
      };
      this.subscribe = (n, callback) => {
        if (!callback)
          return;
        if (n instanceof GraphNode && typeof callback === "function") {
          return n.subscribe(callback);
        } else if (callback instanceof GraphNode || typeof callback === "string")
          return this.subscribeNode(n, callback);
        else if (typeof n == "string") {
          return this.state.subscribeTrigger(n, callback);
        }
      };
      this.unsubscribe = (tag, sub) => {
        this.state.unsubscribeTrigger(tag, sub);
      };
      this.subscribeNode = (inputNode, outputNode) => {
        let tag;
        if (inputNode?.tag)
          tag = inputNode.tag;
        else if (typeof inputNode === "string")
          tag = inputNode;
        if (typeof outputNode === "string")
          outputNode = this.nodes.get(outputNode);
        if (inputNode && outputNode) {
          let sub = this.state.subscribeTrigger(tag, (res) => {
            if (Array.isArray(res))
              outputNode.run(...res);
            else
              outputNode.run(res);
          });
          return sub;
        }
      };
      this.stopNode = (n) => {
        if (typeof n === "string") {
          n = this.nodes.get(n);
        }
        if (n instanceof GraphNode) {
          n.stopNode();
        }
      };
      this.print = (n = void 0, printChildren = true) => {
        if (n instanceof GraphNode)
          return n.print(n, printChildren);
        else {
          let printed = `{`;
          this.nodes.forEach((n2) => {
            printed += `
"${n2.tag}:${n2.print(n2, printChildren)}"`;
          });
          return printed;
        }
      };
      this.reconstruct = (json) => {
        let parsed = reconstructObject(json);
        if (parsed)
          return this.add(parsed);
      };
      this.create = (operator, parentNode, props) => {
        return createNode(operator, parentNode, props, this);
      };
      this.setState = this.state.setState;
      this.DEBUGNODES = (debugging = true) => {
        this.nodes.forEach((n) => {
          if (debugging)
            n.DEBUGNODE = true;
          else
            n.DEBUGNODE = false;
        });
      };
      this.tag = tag ? tag : `graph${Math.floor(Math.random() * 1e11)}`;
      if (props) {
        for (let k in props)
          this[k] = props[k];
        this._initial = props;
      }
      if (tree || Object.keys(this.tree).length > 0)
        this.setTree(tree);
    }
  };
  function reconstructObject(json = "{}") {
    try {
      let parsed = typeof json === "string" ? JSON.parse(json) : json;
      const parseObj = (obj) => {
        for (const prop in obj) {
          if (typeof obj[prop] === "string") {
            let funcParsed = parseFunctionFromText(obj[prop]);
            if (typeof funcParsed === "function") {
              obj[prop] = funcParsed;
            }
          } else if (typeof obj[prop] === "object") {
            parseObj(obj[prop]);
          }
        }
        return obj;
      };
      return parseObj(parsed);
    } catch (err) {
      console.error(err);
      return void 0;
    }
  }
  var stringifyWithCircularRefs = function() {
    const refs = /* @__PURE__ */ new Map();
    const parents = [];
    const path = ["this"];
    function clear() {
      refs.clear();
      parents.length = 0;
      path.length = 1;
    }
    function updateParents(key, value) {
      var idx = parents.length - 1;
      var prev = parents[idx];
      if (typeof prev === "object") {
        if (prev[key] === value || idx === 0) {
          path.push(key);
          parents.push(value.pushed);
        } else {
          while (idx-- >= 0) {
            prev = parents[idx];
            if (typeof prev === "object") {
              if (prev[key] === value) {
                idx += 2;
                parents.length = idx;
                path.length = idx;
                --idx;
                parents[idx] = value;
                path[idx] = key;
                break;
              }
            }
            idx--;
          }
        }
      }
    }
    function checkCircular(key, value) {
      if (value != null) {
        if (typeof value === "object") {
          if (key) {
            updateParents(key, value);
          }
          let other = refs.get(value);
          if (other) {
            return "[Circular Reference]" + other;
          } else {
            refs.set(value, path.join("."));
          }
        }
      }
      return value;
    }
    return function stringifyWithCircularRefs2(obj, space) {
      try {
        parents.push(obj);
        return JSON.stringify(obj, checkCircular, space);
      } finally {
        clear();
      }
    };
  }();
  if (JSON.stringifyWithCircularRefs === void 0) {
    JSON.stringifyWithCircularRefs = stringifyWithCircularRefs;
  }
  var stringifyFast = function() {
    const refs = /* @__PURE__ */ new Map();
    const parents = [];
    const path = ["this"];
    function clear() {
      refs.clear();
      parents.length = 0;
      path.length = 1;
    }
    function updateParents(key, value) {
      var idx = parents.length - 1;
      if (parents[idx]) {
        var prev = parents[idx];
        if (typeof prev === "object") {
          if (prev[key] === value || idx === 0) {
            path.push(key);
            parents.push(value.pushed);
          } else {
            while (idx-- >= 0) {
              prev = parents[idx];
              if (typeof prev === "object") {
                if (prev[key] === value) {
                  idx += 2;
                  parents.length = idx;
                  path.length = idx;
                  --idx;
                  parents[idx] = value;
                  path[idx] = key;
                  break;
                }
              }
              idx++;
            }
          }
        }
      }
    }
    function checkValues(key, value) {
      let val;
      if (value != null) {
        if (typeof value === "object") {
          let c = value.constructor.name;
          if (key && c === "Object") {
            updateParents(key, value);
          }
          let other = refs.get(value);
          if (other) {
            return "[Circular Reference]" + other;
          } else {
            refs.set(value, path.join("."));
          }
          if (c === "Array") {
            if (value.length > 20) {
              val = value.slice(value.length - 20);
            } else
              val = value;
          } else if (c.includes("Set")) {
            val = Array.from(value);
          } else if (c !== "Object" && c !== "Number" && c !== "String" && c !== "Boolean") {
            val = "instanceof_" + c;
          } else if (c === "Object") {
            let obj = {};
            for (const prop in value) {
              if (value[prop] == null) {
                obj[prop] = value[prop];
              } else if (Array.isArray(value[prop])) {
                if (value[prop].length > 20)
                  obj[prop] = value[prop].slice(value[prop].length - 20);
                else
                  obj[prop] = value[prop];
              } else if (value[prop].constructor.name === "Object") {
                obj[prop] = {};
                for (const p in value[prop]) {
                  if (Array.isArray(value[prop][p])) {
                    if (value[prop][p].length > 20)
                      obj[prop][p] = value[prop][p].slice(value[prop][p].length - 20);
                    else
                      obj[prop][p] = value[prop][p];
                  } else {
                    if (value[prop][p] != null) {
                      let con = value[prop][p].constructor.name;
                      if (con.includes("Set")) {
                        obj[prop][p] = Array.from(value[prop][p]);
                      } else if (con !== "Number" && con !== "String" && con !== "Boolean") {
                        obj[prop][p] = "instanceof_" + con;
                      } else {
                        obj[prop][p] = value[prop][p];
                      }
                    } else {
                      obj[prop][p] = value[prop][p];
                    }
                  }
                }
              } else {
                let con = value[prop].constructor.name;
                if (con.includes("Set")) {
                  obj[prop] = Array.from(value[prop]);
                } else if (con !== "Number" && con !== "String" && con !== "Boolean") {
                  obj[prop] = "instanceof_" + con;
                } else {
                  obj[prop] = value[prop];
                }
              }
            }
            val = obj;
          } else {
            val = value;
          }
        } else {
          val = value;
        }
      }
      return val;
    }
    return function stringifyFast2(obj, space) {
      parents.push(obj);
      let res = JSON.stringify(obj, checkValues, space);
      clear();
      return res;
    };
  }();
  if (JSON.stringifyFast === void 0) {
    JSON.stringifyFast = stringifyFast;
  }
  function createNode(operator, parentNode, props, graph) {
    if (typeof props === "object") {
      props.operator = operator;
      return new GraphNode(props, parentNode, graph);
    }
    return new GraphNode({ operator }, parentNode, graph);
  }

  // services/Service.ts
  var Service = class extends Graph {
    constructor(options = {}) {
      super(void 0, options.name ? options.name : `service${Math.floor(Math.random() * 1e14)}`, options.props);
      this.routes = {};
      this.loadDefaultRoutes = false;
      this.keepState = true;
      this.firstLoad = true;
      this.init = (options) => {
        if (options)
          options = Object.assign({}, options);
        else
          options = {};
        if (options.customRoutes)
          Object.assign(options.customRoutes, this.customRoutes);
        else
          options.customRoutes = this.customRoutes;
        if (options.customChildren)
          Object.assign(options.customChildren, this.customChildren);
        else
          options.customChildren = this.customChildren;
        if (Array.isArray(options.routes)) {
          options.routes.forEach((r) => {
            this.load(
              r,
              options.includeClassName,
              options.routeFormat,
              options.customRoutes,
              options.customChildren
            );
          });
        } else if (options.routes || (Object.keys(this.routes).length > 0 || this.loadDefaultRoutes) && this.firstLoad)
          this.load(
            options.routes,
            options.includeClassName,
            options.routeFormat,
            options.customRoutes,
            options.customChildren
          );
      };
      this.load = (routes, includeClassName = true, routeFormat = ".", customRoutes, customChildren) => {
        if (!routes && !this.loadDefaultRoutes && (Object.keys(this.routes).length > 0 || this.firstLoad))
          return;
        if (this.firstLoad)
          this.firstLoad = false;
        if (customRoutes)
          customRoutes = Object.assign(this.customRoutes, customRoutes);
        else
          customRoutes = this.customRoutes;
        if (customChildren)
          customChildren = Object.assign(this.customChildren, customChildren);
        let service;
        let allRoutes = {};
        if (routes) {
          if (!(routes instanceof Graph) && routes?.name) {
            if (routes.module) {
              let mod = routes;
              routes = {};
              Object.getOwnPropertyNames(routes.module).forEach((prop) => {
                if (includeClassName)
                  routes[mod.name + routeFormat + prop] = routes.module[prop];
                else
                  routes[prop] = routes.module[prop];
              });
            } else if (typeof routes === "function") {
              service = new routes({ loadDefaultRoutes: this.loadDefaultRoutes });
              service.load();
              routes = service.routes;
            }
          } else if (routes instanceof Graph || routes.source instanceof Graph) {
            service = routes;
            routes = {};
            let name;
            if (includeClassName) {
              name = service.name;
              if (!name) {
                name = service.tag;
                service.name = name;
              }
              if (!name) {
                name = `graph${Math.floor(Math.random() * 1e15)}`;
                service.name = name;
                service.tag = name;
              }
            }
            if (service.customRoutes && !this.customRoutes)
              this.customRoutes = service.customRoutes;
            else if (service.customRoutes && this.customRoutes)
              Object.assign(this.customRoutes, service.customRoutes);
            if (service.customChildren && !this.customChildren)
              this.customChildren = service.customChildren;
            else if (service.customChildren && this.customChildren)
              Object.assign(this.customChildren, service.customChildren);
            service.nodes.forEach((node) => {
              routes[node.tag] = node;
              let checked = {};
              let checkChildGraphNodes = (nd, par) => {
                if (!checked[nd.tag] || par && includeClassName && !checked[par?.tag + routeFormat + nd.tag]) {
                  if (!par)
                    checked[nd.tag] = true;
                  else
                    checked[par.tag + routeFormat + nd.tag] = true;
                  if (nd instanceof Graph || nd.source instanceof Graph) {
                    if (includeClassName) {
                      let nm = nd.name;
                      if (!nm) {
                        nm = nd.tag;
                        nd.name = nm;
                      }
                      if (!nm) {
                        nm = `graph${Math.floor(Math.random() * 1e15)}`;
                        nd.name = nm;
                        nd.tag = nm;
                      }
                    }
                    nd.nodes.forEach((n) => {
                      if (includeClassName && !routes[nd.tag + routeFormat + n.tag])
                        routes[nd.tag + routeFormat + n.tag] = n;
                      else if (!routes[n.tag])
                        routes[n.tag] = n;
                      checkChildGraphNodes(n, nd);
                    });
                  }
                }
              };
              checkChildGraphNodes(node);
            });
          } else if (typeof routes === "object") {
            let name = routes.constructor.name;
            if (name === "Object") {
              name = Object.prototype.toString.call(routes);
              if (name)
                name = name.split(" ")[1];
              if (name)
                name = name.split("]")[0];
            }
            if (name && name !== "Object") {
              let module = routes;
              routes = {};
              Object.getOwnPropertyNames(module).forEach((route) => {
                if (includeClassName)
                  routes[name + routeFormat + route] = module[route];
                else
                  routes[route] = module[route];
              });
            }
          }
          if (service instanceof Graph && service.name && includeClassName) {
            routes = Object.assign({}, routes);
            for (const prop in routes) {
              let route = routes[prop];
              delete routes[prop];
              routes[service.name + routeFormat + prop] = route;
            }
          }
        }
        if (this.loadDefaultRoutes) {
          let rts = Object.assign({}, this.defaultRoutes);
          if (routes) {
            Object.assign(rts, this.routes);
            routes = Object.assign(rts, routes);
          } else
            routes = Object.assign(rts, this.routes);
          this.loadDefaultRoutes = false;
        }
        if (!routes)
          routes = this.routes;
        let incr = 0;
        for (const tag in routes) {
          incr++;
          let childrenIter = (route, routeKey) => {
            if (typeof route === "object") {
              if (!route.tag)
                route.tag = routeKey;
              if (typeof route?.children === "object") {
                nested:
                  for (const key in route.children) {
                    incr++;
                    if (typeof route.children[key] === "object") {
                      let rt = route.children[key];
                      if (rt.tag && allRoutes[rt.tag])
                        continue;
                      if (customChildren) {
                        for (const k2 in customChildren) {
                          rt = customChildren[k2](rt, key, route, routes, allRoutes);
                          if (!rt)
                            continue nested;
                        }
                      }
                      if (rt.id && !rt.tag) {
                        rt.tag = rt.id;
                      }
                      let k;
                      if (rt.tag) {
                        if (allRoutes[rt.tag]) {
                          let randkey = `${rt.tag}${incr}`;
                          allRoutes[randkey] = rt;
                          rt.tag = randkey;
                          childrenIter(allRoutes[randkey], key);
                          k = randkey;
                        } else {
                          allRoutes[rt.tag] = rt;
                          childrenIter(allRoutes[rt.tag], key);
                          k = rt.tag;
                        }
                      } else {
                        if (allRoutes[key]) {
                          let randkey = `${key}${incr}`;
                          allRoutes[randkey] = rt;
                          rt.tag = randkey;
                          childrenIter(allRoutes[randkey], key);
                          k = randkey;
                        } else {
                          allRoutes[key] = rt;
                          childrenIter(allRoutes[key], key);
                          k = key;
                        }
                      }
                      if (service?.name && includeClassName) {
                        allRoutes[service.name + routeFormat + k] = rt;
                        delete allRoutes[k];
                      } else
                        allRoutes[k] = rt;
                    }
                  }
              }
            }
          };
          allRoutes[tag] = routes[tag];
          childrenIter(routes[tag], tag);
        }
        top:
          for (const route in allRoutes) {
            if (typeof allRoutes[route] === "object") {
              let r = allRoutes[route];
              if (typeof r === "object") {
                if (customRoutes) {
                  for (const key in customRoutes) {
                    r = customRoutes[key](r, route, allRoutes);
                    if (!r)
                      continue top;
                  }
                }
                if (r.get) {
                  if (typeof r.get == "object") {
                  }
                }
                if (r.post) {
                }
                if (r.delete) {
                }
                if (r.put) {
                }
                if (r.head) {
                }
                if (r.patch) {
                }
                if (r.options) {
                }
                if (r.connect) {
                }
                if (r.trace) {
                }
                if (r.post && !r.operator) {
                  allRoutes[route].operator = r.post;
                } else if (!r.operator && typeof r.get == "function") {
                  allRoutes[route].operator = r.get;
                }
              }
            }
          }
        for (const route in routes) {
          if (typeof routes[route] === "object") {
            if (this.routes[route]) {
              if (typeof this.routes[route] === "object")
                Object.assign(this.routes[route], routes[route]);
              else
                this.routes[route] = routes[route];
            } else
              this.routes[route] = routes[route];
          } else if (this.routes[route]) {
            if (typeof this.routes[route] === "object")
              Object.assign(this.routes[route], routes[route]);
            else
              this.routes[route] = routes[route];
          } else
            this.routes[route] = routes[route];
        }
        if (service) {
          for (const key in this.routes) {
            if (this.routes[key] instanceof GraphNode) {
              this.nodes.set(key, this.routes[key]);
              this.nNodes = this.nodes.size;
            }
          }
        } else
          this.setTree(this.routes);
        for (const prop in this.routes) {
          if (this.routes[prop]?.aliases) {
            let aliases = this.routes[prop].aliases;
            aliases.forEach((a) => {
              if (service?.name && includeClassName)
                routes[service.name + routeFormat + a] = this.routes[prop];
              else
                routes[a] = this.routes[prop];
            });
          }
        }
        return this.routes;
      };
      this.unload = (routes = this.routes) => {
        if (!routes)
          return;
        let service;
        if (!(routes instanceof Service) && typeof routes === "function") {
          service = new Service();
          routes = service.routes;
        } else if (routes instanceof Service) {
          routes = routes.routes;
        }
        for (const r in routes) {
          delete this.routes[r];
          if (this.nodes.get(r))
            this.remove(r);
        }
        return this.routes;
      };
      this.handleMethod = (route, method, args) => {
        let m = method.toLowerCase();
        if (m === "get" && this.routes[route]?.get?.transform instanceof Function) {
          if (Array.isArray(args))
            return this.routes[route].get.transform(...args);
          else
            return this.routes[route].get.transform(args);
        }
        if (this.routes[route]?.[m]) {
          if (!(this.routes[route][m] instanceof Function)) {
            if (args)
              this.routes[route][m] = args;
            return this.routes[route][m];
          } else
            return this.routes[route][m](args);
        } else
          return this.handleServiceMessage({ route, args, method });
      };
      this.transmit = (...args) => {
        if (typeof args[0] === "object") {
          if (args[0].method) {
            return this.handleMethod(args[0].route, args[0].method, args[0].args);
          } else if (args[0].route) {
            return this.handleServiceMessage(args[0]);
          } else if (args[0].node) {
            return this.handleGraphNodeCall(args[0].node, args[0].args);
          } else if (this.keepState) {
            if (args[0].route)
              this.setState({ [args[0].route]: args[0].args });
            if (args[0].node)
              this.setState({ [args[0].node]: args[0].args });
          }
          return args;
        } else
          return args;
      };
      this.receive = (...args) => {
        if (args[0]) {
          if (typeof args[0] === "string") {
            let substr = args[0].substring(0, 8);
            if (substr.includes("{") || substr.includes("[")) {
              if (substr.includes("\\"))
                args[0] = args[0].replace(/\\/g, "");
              if (args[0][0] === '"') {
                args[0] = args[0].substring(1, args[0].length - 1);
              }
              ;
              args[0] = JSON.parse(args[0]);
            }
          }
        }
        if (typeof args[0] === "object") {
          if (args[0].method) {
            return this.handleMethod(args[0].route, args[0].method, args[0].args);
          } else if (args[0].route) {
            return this.handleServiceMessage(args[0]);
          } else if (args[0].node) {
            return this.handleGraphNodeCall(args[0].node, args[0].args);
          } else if (this.keepState) {
            if (args[0].route)
              this.setState({ [args[0].route]: args[0].args });
            if (args[0].node)
              this.setState({ [args[0].node]: args[0].args });
          }
          return args;
        } else
          return args;
      };
      this.pipe = (source, destination, endpoint, method, callback) => {
        if (source instanceof GraphNode) {
          if (callback)
            return source.subscribe((res) => {
              let mod = callback(res);
              if (mod !== void 0)
                this.transmit({ route: destination, args: mod, method });
              else
                this.transmit({ route: destination, args: res, method }, endpoint);
            });
          else
            return this.subscribe(source, (res) => {
              this.transmit({ route: destination, args: res, method }, endpoint);
            });
        } else if (typeof source === "string")
          return this.subscribe(source, (res) => {
            this.transmit({ route: destination, args: res, method }, endpoint);
          });
      };
      this.pipeOnce = (source, destination, endpoint, method, callback) => {
        if (source instanceof GraphNode) {
          if (callback)
            return source.state.subscribeTriggerOnce(source.tag, (res) => {
              let mod = callback(res);
              if (mod !== void 0)
                this.transmit({ route: destination, args: mod, method });
              else
                this.transmit({ route: destination, args: res, method }, endpoint);
            });
          else
            return this.state.subscribeTriggerOnce(source.tag, (res) => {
              this.transmit({ route: destination, args: res, method }, endpoint);
            });
        } else if (typeof source === "string")
          return this.state.subscribeTriggerOnce(source, (res) => {
            this.transmit({ route: destination, args: res, method }, endpoint);
          });
      };
      this.terminate = (...args) => {
        this.nodes.forEach((n) => {
          n.stopNode();
        });
      };
      this.recursivelyAssign = (target, obj) => {
        for (const key in obj) {
          if (typeof obj[key] === "object") {
            if (typeof target[key] === "object")
              this.recursivelyAssign(target[key], obj[key]);
            else
              target[key] = this.recursivelyAssign({}, obj[key]);
          } else
            target[key] = obj[key];
        }
        return target;
      };
      this.defaultRoutes = {
        "/": {
          get: () => {
            return this.print();
          },
          aliases: [""]
        },
        ping: () => {
          console.log("ping");
          return "pong";
        },
        echo: (...args) => {
          this.transmit(...args);
          return args;
        },
        assign: (source) => {
          if (typeof source === "object") {
            Object.assign(this, source);
            return true;
          }
          return false;
        },
        recursivelyAssign: (source) => {
          if (typeof source === "object") {
            this.recursivelyAssign(this, source);
            return true;
          }
          return false;
        },
        log: {
          post: (...args) => {
            console.log("Log: ", ...args);
          },
          aliases: ["info"]
        },
        error: (message) => {
          let er = new Error(message);
          console.error(message);
          return er;
        },
        state: (key) => {
          if (key) {
            return this.state.data[key];
          } else
            return this.state.data;
        },
        printState: (key) => {
          if (key) {
            return stringifyWithCircularRefs(this.state.data[key]);
          } else
            return stringifyWithCircularRefs(this.state.data);
        },
        spliceTypedArray: this.spliceTypedArray,
        transmit: this.transmit,
        receive: this.receive,
        load: this.load,
        unload: this.unload,
        pipe: this.pipe,
        terminate: this.terminate,
        run: this.run,
        _run: this._run,
        subscribe: this.subscribe,
        subscribeNode: this.subscribeNode,
        unsubscribe: this.unsubscribe,
        stopNode: this.stopNode,
        get: this.get,
        add: this.add,
        remove: this.remove,
        setTree: this.setTree,
        setState: this.setState,
        print: this.print,
        reconstruct: this.reconstruct,
        handleMethod: this.handleMethod,
        handleServiceMessage: this.handleServiceMessage,
        handleGraphNodeCall: this.handleGraphNodeCall
      };
      if (options.name)
        this.name = options.name;
      else
        options.name = this.tag;
      if ("loadDefaultRoutes" in options) {
        this.loadDefaultRoutes = options.loadDefaultRoutes;
        this.routes = Object.assign(this.defaultRoutes, this.routes);
      }
      if (options || Object.keys(this.routes).length > 0)
        this.init(options);
    }
    handleServiceMessage(message) {
      let call;
      if (typeof message === "object") {
        if (message.route)
          call = message.route;
        else if (message.node)
          call = message.node;
      }
      if (call) {
        if (Array.isArray(message.args))
          return this.run(call, ...message.args);
        else
          return this.run(call, message.args);
      } else
        return message;
    }
    handleGraphNodeCall(route, args) {
      if (!route)
        return args;
      if (args?.args) {
        this.handleServiceMessage(args);
      } else if (Array.isArray(args))
        return this.run(route, ...args);
      else
        return this.run(route, args);
    }
    isTypedArray(x) {
      return ArrayBuffer.isView(x) && Object.prototype.toString.call(x) !== "[object DataView]";
    }
    spliceTypedArray(arr, start, end) {
      let s = arr.subarray(0, start);
      let e;
      if (end) {
        e = arr.subarray(end + 1);
      }
      let n;
      if (s.length > 0 || e?.length > 0)
        n = new arr.constructor(s.length + e.length);
      if (s.length > 0)
        n.set(s);
      if (e && e.length > 0)
        n.set(e, s.length);
      return n;
    }
  };

  // services/worker/Worker.service.ts
  var import_web_worker = __toESM(require_browser());
  var WorkerService = class extends Service {
    constructor(options) {
      super(options);
      this.name = "worker";
      this.workers = {};
      this.threadRot = 0;
      this.customRoutes = {
        "worker": (route, routeKey, routes) => {
          let rt = route;
          if (rt?.worker || rt?.workerId) {
            if (rt.workerUrl)
              rt.url = rt.workerUrl;
            if (rt.workerId)
              rt.tag = rt.workerId;
            if (!rt.tag)
              rt.tag = routeKey;
            rt._id = rt.tag;
            let worker;
            if (this.workers[rt._id])
              worker = this.workers[rt._id];
            if (!worker)
              worker = this.addWorker(rt);
            rt.worker = worker;
            if (rt.transferFunctions) {
              for (const prop in rt.transferFunctions) {
                this.transferFunction(worker, rt.transferFunctions[prop], prop);
              }
            }
            if (rt.transferClasses) {
              for (const prop in rt.transferClasses) {
                this.transferClass(worker, rt.transferClasses[prop], prop);
              }
            }
            if (worker) {
              if (!rt.operator) {
                rt.operator = (...args) => {
                  console.log("operator", args);
                  if (rt.callback) {
                    if (!this.nodes.get(rt.tag)?.children)
                      worker.post(rt.callback, args);
                    else
                      return worker.run(rt.callback, args);
                  } else {
                    if (!this.nodes.get(rt.tag)?.children)
                      worker.send(args);
                    else
                      return worker.request(args);
                  }
                };
              }
            }
          }
          return rt;
        }
      };
      this.customChildren = {
        "worker": (child, childRouteKey, parent, routes, checked) => {
          let worker;
          if (child?.worker || child?.workerId) {
            if (child.workerUrl)
              child.url = child.workerUrl;
            if (child.workerId)
              child.tag = child.workerId;
            if (!child.tag)
              child.tag = childRouteKey;
            child._id = child.tag;
            if (this.workers[child._id])
              worker = this.workers[child._id];
            if (!worker)
              worker = this.addWorker(child);
            child.worker = worker;
            if (child.transferFunctions) {
              for (const prop in child.transferFunctions) {
                this.transferFunction(worker, child.transferFunctions[prop], prop);
              }
            }
            if (child.transferClasses) {
              for (const prop in child.transferClasses) {
                this.transferClass(worker, child.transferClasses[prop], prop);
              }
            }
            if (worker) {
              if (!child.operator) {
                child.operator = (...args) => {
                  console.log("operator", args);
                  if (child.callback) {
                    if (!this.nodes.get(child.tag)?.children)
                      worker.post(child.callback, args);
                    else
                      return worker.run(child.callback, args);
                  } else {
                    if (!this.nodes.get(child.tag)?.children)
                      worker.send(args);
                    else
                      return worker.request(args);
                  }
                };
              }
            }
          }
          if (child.parentRoute && (parent?.worker || parent?.workerId)) {
            if (worker) {
              let portId = this.establishMessageChannel(worker, parent.worker.worker);
              worker.post("subscribeToWorker", child.parentRoute, portId, child.callback);
            } else {
              parent.worker.subscribe(child.parentRoute, (result) => {
                this.nodes.get(child.tag ? child.tag : childRouteKey).run(result);
              });
            }
          }
        }
      };
      this.addWorker = (options) => {
        let worker;
        if (!options._id)
          options._id = `worker${Math.floor(Math.random() * 1e15)}`;
        if (options.url)
          worker = new import_web_worker.default(options.url);
        else if (options.port) {
          worker = options.port;
        } else if (this.workers[options._id]) {
          if (this.workers[options._id].port)
            worker = this.workers[options._id].port;
          else
            worker = this.workers[options._id].worker;
        }
        if (!worker)
          return;
        let send = (message, transfer) => {
          return this.transmit(message, worker, transfer);
        };
        let post = (route, args, transfer, method) => {
          let message = {
            route,
            args
          };
          if (method)
            message.method = method;
          return this.transmit(message, worker, transfer);
        };
        let run = (route, args, transfer, method) => {
          return new Promise((res, rej) => {
            let callbackId = Math.random();
            let req = { route: "runRequest", args: [{ route, args }, options._id, callbackId] };
            if (method)
              req.args[0].method = method;
            let onmessage = (ev) => {
              if (typeof ev.data === "object") {
                if (ev.data.callbackId === callbackId) {
                  worker.removeEventListener("message", onmessage);
                  res(ev.data.args);
                }
              }
            };
            worker.addEventListener("message", onmessage);
            this.transmit(req, worker, transfer);
          });
        };
        let request = (message, transfer, method) => {
          return new Promise((res, rej) => {
            let callbackId = Math.random();
            let req = { route: "runRequest", args: [message, options._id, callbackId] };
            if (method)
              req.method = method;
            let onmessage = (ev) => {
              if (typeof ev.data === "object") {
                if (ev.data.callbackId === callbackId) {
                  worker.removeEventListener("message", onmessage);
                  res(ev.data.args);
                }
              }
            };
            worker.addEventListener("message", onmessage);
            this.transmit(req, worker, transfer);
          });
        };
        let subscribe = (route, callback) => {
          return this.subscribeToWorker(route, options._id, callback);
        };
        let unsubscribe = (route, sub) => {
          return run("unsubscribe", [route, sub]);
        };
        if (!options.onmessage)
          options.onmessage = (ev) => {
            this.receive(ev.data);
            this.setState({ [options._id]: ev.data });
          };
        if (!options.onerror) {
          options.onerror = (ev) => {
            console.error(ev.data);
          };
        }
        worker.onmessage = options.onmessage;
        worker.onerror = options.onerror;
        this.workers[options._id] = {
          worker,
          send,
          post,
          run,
          request,
          subscribe,
          unsubscribe,
          ...options
        };
        return this.workers[options._id];
      };
      this.toObjectURL = (scriptTemplate) => {
        let blob = new Blob([scriptTemplate], { type: "text/javascript" });
        return URL.createObjectURL(blob);
      };
      this.transmit = (message, worker, transfer) => {
        if (!transfer) {
          transfer = this.getTransferable(message);
        }
        if (worker instanceof import_web_worker.default || worker instanceof MessagePort) {
          worker.postMessage(message, transfer);
        } else if (typeof worker === "string") {
          if (this.workers[worker]) {
            if (this.workers[worker].port)
              this.workers[worker].port.postMessage(message, transfer);
            else if (this.workers[worker].worker)
              this.workers[worker].worker.postMessage(message, transfer);
          }
        } else {
          let keys = Object.keys(this.workers);
          this.workers[keys[this.threadRot]].worker.postMessage(message, transfer);
          this.threadRot++;
          if (this.threadRot === keys.length)
            this.threadRot = 0;
        }
        return message;
      };
      this.terminate = (worker) => {
        if (typeof worker === "string") {
          let obj = this.workers[worker];
          if (obj)
            delete this.workers[worker];
          worker = obj.worker;
        }
        if (worker instanceof import_web_worker.default) {
          worker.terminate();
          return true;
        }
        if (worker instanceof MessagePort) {
          worker.close();
          return true;
        }
        return false;
      };
      this.establishMessageChannel = (worker, worker2) => {
        let workerId;
        if (typeof worker === "string") {
          workerId = worker;
          if (this.workers[worker]) {
            if (this.workers[worker].port)
              worker = this.workers[worker].port;
            else
              worker2 = this.workers[worker].worker;
          }
        }
        if (typeof worker2 === "string") {
          if (this.workers[worker2]) {
            if (this.workers[worker2].port)
              worker2 = this.workers[worker2].port;
            else
              worker2 = this.workers[worker2].worker;
          }
        }
        if (worker instanceof import_web_worker.default || worker instanceof MessagePort) {
          let channel = new MessageChannel();
          let portId = `port${Math.floor(Math.random() * 1e15)}`;
          worker.postMessage({ route: "addWorker", args: { port: channel.port1, _id: portId } }, [channel.port1]);
          if (worker2 instanceof import_web_worker.default || worker2 instanceof MessagePort) {
            worker2.postMessage({ route: "addWorker", args: { port: channel.port2, _id: portId } }, [channel.port2]);
          } else if (workerId && this.workers[workerId])
            this.workers[workerId].port = channel.port2;
          return portId;
        }
        return false;
      };
      this.request = (message, workerId, transfer, method) => {
        let worker = this.workers[workerId].worker;
        return new Promise((res, rej) => {
          let callbackId = Math.random();
          let req = { route: "runRequest", args: [message, callbackId] };
          if (method)
            req.method = method;
          let onmessage = (ev) => {
            if (typeof ev.data === "object") {
              if (ev.data.callbackId === callbackId) {
                worker.removeEventListener("message", onmessage);
                res(ev.data.args);
              }
            }
          };
          worker.addEventListener("message", onmessage);
          this.transmit(req, worker, transfer);
        });
      };
      this.runRequest = (message, worker, callbackId) => {
        let res = this.receive(message);
        if (typeof worker === "string" && this.workers[worker]) {
          if (this.workers[worker].port)
            worker = this.workers[worker].port;
          else
            worker = this.workers[worker].worker;
        }
        if (res instanceof Promise) {
          res.then((r) => {
            if (worker instanceof import_web_worker.default || worker instanceof MessagePort)
              worker.postMessage({ args: r, callbackId });
            else if (typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope)
              globalThis.postMessage({ args: r, callbackId });
          });
        } else {
          if (worker instanceof import_web_worker.default || worker instanceof MessagePort)
            worker.postMessage({ args: res, callbackId });
          else if (typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope)
            globalThis.postMessage({ args: res, callbackId });
        }
        return res;
      };
      this.subscribeWorker = (route, worker) => {
        if (typeof worker === "string" && this.workers[worker]) {
          if (this.workers[worker].port)
            worker = this.workers[worker].port;
          else
            worker = this.workers[worker].worker;
        }
        return this.subscribe(route, (res) => {
          if (res instanceof Promise) {
            res.then((r) => {
              if (worker?.postMessage)
                worker.postMessage({ args: r, callbackId: route });
              else if (globalThis.postMessage)
                globalThis.postMessage({ args: r, callbackId: route });
            });
          } else {
            if (worker?.postMessage)
              worker.postMessage({ args: res, callbackId: route });
            else if (globalThis.postMessage)
              globalThis.postMessage({ args: res, callbackId: route });
          }
        });
      };
      this.subscribeToWorker = (route, workerId, callback) => {
        if (typeof workerId === "string" && this.workers[workerId]) {
          this.subscribe(workerId, (res) => {
            if (res?.callbackId === route) {
              if (!callback)
                this.setState({ [workerId]: res.args });
              else if (typeof callback === "string") {
                this.run(callback, res.args);
              } else
                callback(res.args);
            }
          });
          return this.workers[workerId].run("subscribeWorker", [route, workerId]);
        }
      };
      this.routes = {
        addWorker: this.addWorker,
        toObjectURL: this.toObjectURL,
        request: this.request,
        runRequest: this.runRequest,
        establishMessageChannel: this.establishMessageChannel,
        subscribeWorker: this.subscribeWorker,
        subscribeToWorker: this.subscribeToWorker,
        unsubscribe: this.unsubscribe
      };
      this.load(this.routes);
      if (typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope) {
        globalThis.onmessage = (ev) => {
          let result = this.receive(ev.data);
          if (this.keepState)
            this.setState({ [this.name]: result });
        };
      }
    }
    getTransferable(message) {
      let transfer;
      if (typeof message === "object") {
        if (message.args) {
          if (message.args.constructor?.name === "Object") {
            for (const key in message.args) {
              if (ArrayBuffer.isView(message.args[key])) {
                if (!transfer)
                  transfer = [message.args[key].buffer];
                else
                  transfer.push(message.args[key].buffer);
              } else if (message.args[key]?.constructor?.name === "ArrayBuffer") {
                if (!transfer)
                  transfer = [message.args[key]];
                else
                  transfer.push(message.args[key]);
              }
            }
          } else if (Array.isArray(message.args) && message.args.length < 11) {
            message.args.forEach((arg) => {
              if (ArrayBuffer.isView(arg)) {
                transfer = [arg.buffer];
              } else if (arg.constructor?.name === "ArrayBuffer")
                transfer = [arg];
            });
          } else if (ArrayBuffer.isView(message.args)) {
            transfer = [message.args.buffer];
          } else if (message.args.constructor?.name === "ArrayBuffer") {
            transfer = [message];
          }
        } else if (message.constructor?.name === "Object") {
          for (const key in message) {
            if (ArrayBuffer.isView(message[key])) {
              if (!transfer)
                transfer = [message[key].buffer];
              else
                transfer.push(message[key].buffer);
            } else if (message[key]?.constructor?.name === "ArrayBuffer") {
              if (!transfer)
                transfer = [message[key]];
              else
                transfer.push(message[key]);
            }
          }
        } else if (Array.isArray(message) && message.length < 11) {
          message.forEach((arg) => {
            if (ArrayBuffer.isView(arg)) {
              transfer = [arg.buffer];
            } else if (arg.constructor?.name === "ArrayBuffer")
              transfer = [arg];
          });
        } else if (ArrayBuffer.isView(message)) {
          transfer = [message.buffer];
        } else if (message.constructor?.name === "ArrayBuffer") {
          transfer = [message];
        }
      }
      return transfer;
    }
    transferFunction(worker, fn, fnName) {
      if (!fnName)
        fnName = fn.name;
      return worker.request({
        route: "setRoute",
        args: [
          fn.toString(),
          fnName
        ]
      });
    }
    transferClass(worker, cls, className) {
      if (!className)
        className = cls.name;
      return worker.request({
        route: "receiveClass",
        args: [
          cls.toString(),
          className
        ]
      });
    }
  };

  // services/worker/ProxyListener.ts
  var mouseEventHandler = makeSendPropertiesHandler([
    "ctrlKey",
    "metaKey",
    "shiftKey",
    "button",
    "pointerType",
    "clientX",
    "clientY",
    "pageX",
    "pageY"
  ]);
  var wheelEventHandlerImpl = makeSendPropertiesHandler([
    "deltaX",
    "deltaY"
  ]);
  var keydownEventHandler = makeSendPropertiesHandler([
    "ctrlKey",
    "metaKey",
    "shiftKey",
    "keyCode"
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
      const data = { type: event.type };
      copyProperties(event, properties, data);
      sendFn(data);
    };
  }
  function touchEventHandler(event, sendFn) {
    const touches = [];
    const data = { type: event.type, touches };
    for (let i = 0; i < event.touches.length; ++i) {
      const touch = event.touches[i];
      touches.push({
        pageX: touch.pageX,
        pageY: touch.pageY
      });
    }
    sendFn(data);
  }
  var orbitKeys = {
    "37": true,
    "38": true,
    "39": true,
    "40": true
  };
  function filteredKeydownEventHandler(event, sendFn) {
    const { keyCode } = event;
    if (orbitKeys[keyCode]) {
      event.preventDefault();
      keydownEventHandler(event, sendFn);
    }
  }
  var eventHandlers = {
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
    keydown: filteredKeydownEventHandler
  };
  function initProxyElement(element, worker, id) {
    if (!id)
      id = "proxy" + Math.floor(Math.random() * 1e15);
    const sendEvent = (data) => {
      worker.postMessage({ route: "handleProxyEvent", args: [data, id] });
    };
    let entries = Object.entries(eventHandlers);
    for (const [eventName, handler] of entries) {
      element.addEventListener(eventName, function(event) {
        handler(event, sendEvent);
      });
    }
    const sendSize = () => {
      const rect = element.getBoundingClientRect();
      sendEvent({
        type: "resize",
        left: rect.left,
        top: rect.top,
        width: element.clientWidth,
        height: element.clientHeight
      });
    };
    sendSize();
    globalThis.addEventListener("resize", sendSize);
    return id;
  }
  var EventDispatcher = class {
    addEventListener(type, listener) {
      if (this._listeners === void 0)
        this._listeners = {};
      const listeners = this._listeners;
      if (listeners[type] === void 0) {
        listeners[type] = [];
      }
      if (listeners[type].indexOf(listener) === -1) {
        listeners[type].push(listener);
      }
    }
    hasEventListener(type, listener) {
      if (this._listeners === void 0)
        return false;
      const listeners = this._listeners;
      return listeners[type] !== void 0 && listeners[type].indexOf(listener) !== -1;
    }
    removeEventListener(type, listener) {
      if (this._listeners === void 0)
        return;
      const listeners = this._listeners;
      const listenerArray = listeners[type];
      if (listenerArray !== void 0) {
        const index = listenerArray.indexOf(listener);
        if (index !== -1) {
          listenerArray.splice(index, 1);
        }
      }
    }
    dispatchEvent(event, target) {
      if (this._listeners === void 0)
        return;
      const listeners = this._listeners;
      const listenerArray = listeners[event.type];
      if (listenerArray !== void 0) {
        if (!target)
          event.target = this;
        else
          event.target = target;
        const array = listenerArray.slice(0);
        for (let i = 0, l = array.length; i < l; i++) {
          array[i].call(this, event);
        }
        event.target = null;
      }
    }
  };
  function noop() {
  }
  var ElementProxyReceiver = class extends EventDispatcher {
    constructor() {
      super();
      this._listeners = {};
      this.style = {};
      this.setPointerCapture = () => {
      };
      this.releasePointerCapture = () => {
      };
      this.getBoundingClientRect = () => {
        return {
          left: this.left,
          top: this.top,
          width: this.width,
          height: this.height,
          right: this.left + this.width,
          bottom: this.top + this.height
        };
      };
      this.handleEvent = (data) => {
        if (data.type === "resize") {
          this.left = data.left;
          this.top = data.top;
          this.width = data.width;
          this.height = data.height;
          if (typeof this.proxied === "object") {
            this.proxied.width = this.width;
            this.proxied.height = this.height;
            this.proxied.clientWidth = this.width;
            this.proxied.clientHeight = this.height;
          }
        }
        data.preventDefault = noop;
        data.stopPropagation = noop;
        this.dispatchEvent(data, this.proxied);
      };
      this.style = {};
    }
    get clientWidth() {
      return this.width;
    }
    get clientHeight() {
      return this.height;
    }
    focus() {
    }
  };
  var ProxyManager = class {
    constructor() {
      this.targets = {};
      this.makeProxy = (id, addTo = void 0) => {
        if (!id)
          id = `proxyReceiver${Math.floor(Math.random() * 1e15)}`;
        let proxy;
        if (this.targets[id])
          proxy = this.targets[id];
        else {
          proxy = new ElementProxyReceiver();
          this.targets[id] = proxy;
        }
        if (typeof addTo === "object") {
          addTo.proxy = proxy;
          proxy.proxied = addTo;
          console.log(proxy, addTo);
          addTo.style = proxy.style;
          if (proxy.width) {
            addTo.width = proxy.width;
            addTo.clientWidth = proxy.width;
          }
          if (proxy.height) {
            addTo.height = proxy.height;
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
      };
      this.getProxy = (id) => {
        return this.targets[id];
      };
      this.handleEvent = (data, id) => {
        if (!this.targets[id])
          this.makeProxy(id);
        if (this.targets[id]) {
          this.targets[id].handleEvent(data);
          return true;
        }
        return void 0;
      };
      if (!globalThis.document)
        globalThis.document = {};
    }
  };
  var proxyElementWorkerRoutes = {
    initProxyElement,
    makeProxy: function(id, elm) {
      if (!this.graph.ProxyManager)
        this.graph.ProxyManager = new ProxyManager();
      this.graph.ProxyManager.makeProxy(id, elm);
      return id;
    },
    handleProxyEvent: function(data, id) {
      if (!this.graph.ProxyManager)
        this.graph.ProxyManager = new ProxyManager();
      if (this.graph.ProxyManager.handleEvent(data, id))
        return data;
    }
  };

  // services/worker/WorkerCanvas.ts
  var workerCanvasRoutes = {
    ...proxyElementWorkerRoutes,
    transferCanvas: function(worker, options, route) {
      if (!options)
        return void 0;
      if (!options._id)
        options._id = `canvas${Math.floor(Math.random() * 1e15)}`;
      let offscreen = options.canvas.transferControlToOffscreen();
      let message = { route: route ? route : "receiveCanvas", args: { canvas: offscreen, context: options.context, _id: options._id } };
      this.graph.run("initProxyElement", options.canvas, worker, options._id);
      if (options.draw) {
        if (typeof options.draw === "function")
          message.args.draw = options.draw.toString();
        else
          message.args.draw = options.draw;
      }
      if (options.update) {
        if (typeof options.update === "function")
          message.args.update = options.update.toString();
        else
          message.args.update = options.update;
      }
      if (options.init) {
        if (typeof options.init === "function")
          message.args.init = options.init.toString();
        else
          message.args.init = options.init;
      }
      if (options.clear) {
        if (typeof options.clear === "function")
          message.args.clear = options.clear.toString();
        else
          message.args.clear = options.clear;
      }
      worker.postMessage(message, [offscreen]);
      const workercontrols = {
        _id: options._id,
        worker,
        draw: (props) => {
          worker.postMessage({ route: "drawFrame", args: [options._id, props] });
        },
        update: (props) => {
          worker.postMessage({ route: "updateCanvas", args: [options._id, props] });
        },
        clear: () => {
          worker.postMessage({ route: "clearCanvas", args: options._id });
        },
        init: () => {
          console.log("Posting init");
          worker.postMessage({ route: "initCanvas", args: options._id });
        },
        stop: () => {
          worker.postMessage({ route: "stopAnim", args: options._id });
        },
        start: () => {
          worker.postMessage({ route: "startAnim", args: options._id });
        },
        set: (newDrawProps) => {
          worker.postMessage({ route: "setDraw", args: [newDrawProps, options._id] });
        }
      };
      return workercontrols;
    },
    receiveCanvas: function(options) {
      if (!this.graph.CANVASES)
        this.graph.CANVASES = {};
      let canvasOptions = options;
      options._id ? canvasOptions._id = options._id : canvasOptions._id = `canvas${Math.floor(Math.random() * 1e15)}`;
      typeof options.context === "string" ? canvasOptions.context = options.canvas.getContext(options.context) : canvasOptions.context = options.context;
      "animating" in options ? canvasOptions.animating = options.animating : canvasOptions.animating = true;
      if (this.graph.CANVASES[canvasOptions._id]) {
        this.graph.run("setDraw", canvasOptions);
      } else {
        canvasOptions.graph = this.graph;
        this.graph.CANVASES[canvasOptions._id] = canvasOptions;
        this.graph.run("makeProxy", canvasOptions._id, canvasOptions.canvas);
        if (options.width)
          canvasOptions.canvas.width = options.width;
        if (options.height)
          canvasOptions.canvas.height = options.height;
        if (typeof canvasOptions.draw === "string") {
          canvasOptions.draw = parseFunctionFromText(canvasOptions.draw);
        }
        if (typeof canvasOptions.update === "string") {
          canvasOptions.update = parseFunctionFromText(canvasOptions.update);
        }
        if (typeof canvasOptions.init === "string") {
          canvasOptions.init = parseFunctionFromText(canvasOptions.init);
        }
        if (typeof canvasOptions.clear === "string") {
          canvasOptions.clear = parseFunctionFromText(canvasOptions.clear);
        }
        if (typeof canvasOptions.init === "function")
          canvasOptions.init(canvasOptions, canvasOptions.canvas, canvasOptions.context);
        if (typeof canvasOptions.draw === "function" && canvasOptions.animating) {
          let draw = (s, canvas, context) => {
            if (s.animating) {
              s.draw(s, canvas, context);
              requestAnimationFrame(() => {
                draw(s, canvas, context);
              });
            }
          };
          draw(canvasOptions, canvasOptions.canvas, canvasOptions.context);
        }
      }
      return canvasOptions._id;
    },
    setDraw: function(settings, _id) {
      let canvasopts;
      if (_id)
        canvasopts = this.graph.CANVASES?.[settings._id];
      else if (settings._id)
        canvasopts = this.graph.CANVASES?.[settings._id];
      else
        canvasopts = this.graph.CANVASES?.[Object.keys(this.graph.CANVASES)[0]];
      if (canvasopts) {
        if (settings.canvas) {
          canvasopts.canvas = settings.canvas;
          this.graph.run("makeProxy", canvasopts._id, canvasopts.canvas);
        }
        if (typeof settings.context === "string")
          canvasopts.context = canvasopts.canvas.getContext(settings.context);
        else if (settings.context)
          canvasopts.context = settings.context;
        if (settings.width)
          canvasopts.canvas.width = settings.width;
        if (settings.height)
          canvasopts.canvas.height = settings.height;
        if (typeof settings.draw === "string")
          settings.draw = parseFunctionFromText(settings.draw);
        if (typeof settings.draw === "function") {
          canvasopts.draw = settings.draw;
        }
        if (typeof settings.update === "string")
          settings.update = parseFunctionFromText(settings.update);
        if (typeof settings.update === "function") {
          canvasopts.update = settings.update;
        }
        if (typeof settings.init === "string")
          settings.init = parseFunctionFromText(settings.init);
        if (typeof settings.init === "function") {
          canvasopts.init = settings.init;
        }
        if (typeof settings.clear === "string")
          settings.clear = parseFunctionFromText(settings.clear);
        if (typeof settings.clear === "function") {
          canvasopts.clear = settings.clear;
        }
        return settings._id;
      }
      return void 0;
    },
    drawFrame: function(props, _id) {
      let canvasopts;
      if (!_id)
        canvasopts = this.graph.CANVASES?.[Object.keys(this.graph.CANVASES)[0]];
      else
        canvasopts = this.graph.CANVASES?.[_id];
      if (canvasopts) {
        if (props)
          Object.assign(canvasopts, props);
        if (canvasopts.draw) {
          canvasopts.draw(canvasopts, canvasopts.canvas, canvasopts.context);
          return _id;
        }
      }
      return void 0;
    },
    clearCanvas: function(_id) {
      let canvasopts;
      if (!_id)
        canvasopts = this.graph.CANVASES?.[Object.keys(this.graph.CANVASES)[0]];
      else
        canvasopts = this.graph.CANVASES?.[_id];
      if (canvasopts?.clear) {
        canvasopts.clear(canvasopts, canvasopts.canvas, canvasopts.context);
        return _id;
      }
      return void 0;
    },
    initCanvas: function(_id) {
      let canvasopts;
      if (!_id)
        canvasopts = this.graph.CANVASES?.[Object.keys(this.graph.CANVASES)[0]];
      else
        canvasopts = this.graph.CANVASES?.[_id];
      if (canvasopts?.init) {
        canvasopts.init(canvasopts, canvasopts.canvas, canvasopts.context);
        return _id;
      }
      return void 0;
    },
    updateCanvas: function(input, _id) {
      let canvasopts;
      if (!_id)
        canvasopts = this.graph.CANVASES?.[Object.keys(this.graph.CANVASES)[0]];
      else
        canvasopts = this.graph.CANVASES?.[_id];
      if (canvasopts?.update) {
        canvasopts.update(canvasopts, canvasopts.canvas, canvasopts.context, input);
        return _id;
      }
      return void 0;
    },
    setProps: function(props, _id) {
      let canvasopts;
      if (!_id)
        canvasopts = this.graph.CANVASES?.[Object.keys(this.graph.CANVASES)[0]];
      else
        canvasopts = this.graph.CANVASES?.[_id];
      if (canvasopts) {
        Object.assign(canvasopts, props);
        if (props.width)
          canvasopts.canvas.width = props.width;
        if (props.height)
          canvasopts.canvas.height = props.height;
        return _id;
      }
      return void 0;
    },
    startAnim: function(_id, draw) {
      let canvasopts;
      if (!_id)
        canvasopts = this.graph.CANVASES?.[Object.keys(this.graph.CANVASES)[0]];
      else
        canvasopts = this.graph.CANVASES?.[_id];
      canvasopts.animating = true;
      if (canvasopts && draw) {
        if (typeof draw === "string")
          draw = parseFunctionFromText(draw);
        if (typeof draw === "function") {
          canvasopts.draw = draw;
        }
        return _id;
      }
      if (typeof canvasopts?.draw === "function") {
        let draw2 = (s, canvas, context) => {
          if (s.animating) {
            s.draw(s, canvas, context);
            requestAnimationFrame(() => {
              draw2(s, canvas, context);
            });
          }
        };
        if (typeof canvasopts.clear === "function")
          canvasopts.clear(canvasopts, canvasopts.canvas, canvasopts.context);
        if (typeof canvasopts.init === "function")
          canvasopts.init(canvasopts, canvasopts.canvas, canvasopts.context);
        draw2(canvasopts, canvasopts.canvas, canvasopts.context);
        return _id;
      }
      return void 0;
    },
    stopAnim: function(_id) {
      let canvasopts;
      if (!_id)
        canvasopts = this.graph.CANVASES?.[Object.keys(this.graph.CANVASES)[0]];
      else
        canvasopts = this.graph.CANVASES?.[_id];
      if (canvasopts) {
        canvasopts.animating = false;
        if (typeof canvasopts.clear === "function")
          canvasopts.clear(canvasopts, canvasopts.canvas, canvasopts.context);
        return _id;
      }
      return void 0;
    }
  };

  // services/unsafe/Unsafe.service.ts
  var unsafeRoutes = {
    setRoute: function(fn, fnName) {
      if (typeof fn === "string")
        fn = parseFunctionFromText(fn);
      if (typeof fn === "function") {
        if (!fnName)
          fnName = fn.name;
        if (this.graph.get(fnName)) {
          this.graph.get(fnName).setOperator(fn);
        } else
          this.graph.load({ [fnName]: { operator: fn } });
        return true;
      }
      return false;
    },
    setNode: function(fn, fnName) {
      if (typeof fn === "string")
        fn = parseFunctionFromText(fn);
      if (typeof fn === "function") {
        if (!fnName)
          fnName = fn.name;
        if (this.graph.get(fnName)) {
          this.graph.get(fnName).setOperator(fn);
        } else
          this.graph.add({ tag: fnName, operator: fn });
        return true;
      }
      return false;
    },
    setMethod: function(route, fn, fnName) {
      if (typeof fn === "string")
        fn = parseFunctionFromText(fn);
      if (typeof fn === "function") {
        if (!fnName)
          fnName = fn.name;
        if (this.graph.get(route)) {
          this.graph.get(route)[fnName] = fn;
        } else
          this.graph.add({ tag: fnName, [fnName]: fn });
        return true;
      }
      return false;
    },
    assignRoute: function(route, source) {
      if (this.graph.get(route) && typeof source === "object") {
        Object.assign(this.graph.get(route), source);
      }
    },
    transferClass: (classObj, className) => {
      if (typeof classObj === "object") {
        let str = classObj.toString();
        let message = { route: "receiveClass", args: [str, className] };
        return message;
      }
      return false;
    },
    receiveClass: function(stringified, className) {
      if (typeof stringified === "string") {
        if (stringified.indexOf("class") === 0) {
          let cls = (0, eval)("(" + stringified + ")");
          let name = className;
          if (!name)
            name = cls.name;
          this.graph[name] = cls;
          return true;
        }
      }
      return false;
    },
    setGlobal: (key, value) => {
      globalThis[key] = value;
      return true;
    },
    assignGlobalObject: (target, source) => {
      if (!globalThis[target])
        return false;
      if (typeof source === "object")
        Object.assign(globalThis[target], source);
      return true;
    },
    setValue: function(key, value) {
      this.graph[key] = value;
      return true;
    },
    assignObject: function(target, source) {
      if (!this.graph[target])
        return false;
      if (typeof source === "object")
        Object.assign(this.graph[target], source);
      return true;
    },
    setGlobalFunction: (fn, fnName) => {
      if (typeof fn === "string")
        fn = parseFunctionFromText(fn);
      if (typeof fn === "function") {
        if (!fnName)
          fnName = fn.name;
        globalThis[fnName] = fn;
        return true;
      }
      return false;
    },
    assignFunctionToGlobalObject: function(globalObjectName, fn, fnName) {
      if (!globalThis[globalObjectName])
        return false;
      if (typeof fn === "string")
        fn = parseFunctionFromText(fn);
      if (typeof fn === "function") {
        if (!fnName)
          fnName = fn.name;
        this.graph[globalObjectName][fnName] = fn;
        return true;
      }
      return false;
    },
    setFunction: function(fn, fnName) {
      if (typeof fn === "string")
        fn = parseFunctionFromText(fn);
      if (typeof fn === "function") {
        if (!fnName)
          fnName = fn.name;
        this.graph[fnName] = fn;
        return true;
      }
      return false;
    },
    assignFunctionToObject: function(objectName, fn, fnName) {
      if (!this.graph[objectName])
        return false;
      if (typeof fn === "string")
        fn = parseFunctionFromText(fn);
      if (typeof fn === "function") {
        if (!fnName)
          fnName = fn.name;
        this.graph[objectName][fnName] = fn;
        return true;
      }
      return false;
    }
  };

  // services/ecs/ECS.service.ts
  var ECSService = class extends Service {
    constructor(options) {
      super(options);
      this.entities = {};
      this.systems = {};
      this.map = /* @__PURE__ */ new Map();
      this.order = [];
      this.animating = true;
      this.updateEntities = (order = this.order, filter, debug = false) => {
        order.forEach((k) => {
          if (this.systems[k]) {
            if (filter) {
              if (debug)
                debug = performance.now();
              this.systems[k].run(
                this.map.get(k)
              );
              if (debug)
                console.log("system", k, "took", performance.now() - debug, "ms for", Object.keys(this.map.get(k)).length, "entities");
            } else {
              if (debug)
                debug = performance.now();
              this.systems[k].run(
                this.entities
              );
              if (debug)
                console.log("system", k, "took", performance.now() - debug, "ms for", Object.keys(this.entities).length, "entities");
            }
          }
        });
      };
      this.animate = (filter = true, order) => {
        requestAnimationFrame(() => {
          if (this.animating) {
            this.updateEntities(order, filter);
            this.animate(filter, order);
          }
        });
      };
      this.stop = () => {
        this.animating = false;
      };
      this.start = (filter) => {
        this.animating = true;
        this.animate(filter);
      };
      this.addEntities = (prototype, components = {}, count = 1) => {
        let i = 0;
        let newEntities = {};
        while (i < count) {
          let entity = this.addEntity(
            prototype,
            components
          );
          newEntities[entity.tag] = entity;
          i++;
        }
        return Object.keys(newEntities);
      };
      this.addEntity = (prototype = {}, components = {}) => {
        if (!prototype)
          return;
        const entity = this.recursivelyAssign({}, prototype);
        entity.components = components;
        if (Object.keys(components).length === 0) {
          Object.keys(this.systems).forEach((k) => {
            components[k] = true;
          });
        }
        if (entity.tag && this.entities[entity.tag]) {
          let tag = entity.tag;
          let i = 2;
          while (this.entities[entity.tag]) {
            entity.tag = `${tag}${i}`;
            i++;
          }
        } else if (!entity.tag)
          entity.tag = `entity${Math.floor(Math.random() * 1e15)}`;
        this.load({ [entity.tag]: entity });
        this.entities[entity.tag] = this.nodes.get(entity.tag);
        this.setupEntity(this.entities[entity.tag]);
        return this.entities[entity.tag];
      };
      this.addSystems = (systems = {}, order) => {
        for (const key in systems) {
          systems[key].tag = key;
          this.addSystem(systems[key], void 0, void 0, order);
        }
        return this.systems;
      };
      this.addSystem = (prototype, setup, update, order) => {
        if (!prototype)
          return;
        const system = this.recursivelyAssign({}, prototype);
        if (setup)
          system.setupEntities = setup;
        if (update)
          system.operator = update;
        if (system.tag && this.systems[system.tag]) {
          let tag = system.tag;
          let i = 2;
          while (this.systems[system.tag]) {
            system.tag = `${tag}${i}`;
            i++;
          }
        } else if (!system.tag)
          system.tag = `system${Math.floor(Math.random() * 1e15)}`;
        this.load({ [system.tag]: system });
        this.systems[system.tag] = this.nodes.get(system.tag);
        if (!this.map.get(system.tag))
          this.map.set(system.tag, {});
        if (this.systems[system.tag]?.setupEntities) {
          let filtered = this.filterObject(this.entities, (key, v) => {
            if (v.components[system.tag])
              return true;
          });
          this.systems[system.tag].setupEntities(system, filtered);
          Object.assign(this.map.get(system.tag), filtered);
        }
        if (!order)
          this.order.push(system.tag);
        else
          this.order = order;
        return this.systems[system.tag];
      };
      this.setupEntity = (entity) => {
        if (entity?.components) {
          for (const key in entity.components) {
            if (this.systems[key]) {
              this.systems[key].setupEntity(this.systems[key], entity);
              this.map.get(key)[entity.tag] = entity;
            }
          }
        }
      };
      this.removeEntity = (tag) => {
        const entity = this.entities[tag];
        for (const key in entity.components) {
          if (this.map.get(key))
            delete this.map.get(key)[entity.tag];
        }
        delete this.entities[tag];
        return this.remove(tag);
      };
      this.removeSystem = (tag) => {
        delete this.systems[tag];
        this.map.delete(tag);
        this.order.splice(this.order.indexOf(tag), 1);
        return this.remove(tag);
      };
      this.bufferValues = (entities, property, keys, buffer) => {
        if (!Array.isArray(keys) && typeof keys === "object")
          keys = Object.keys(keys);
        if (!buffer) {
          let entkeys = Object.keys(entities);
          if (keys)
            buffer = new Float32Array(entkeys.length * keys.length);
          else {
            if (typeof entities[entkeys[0]][property] === "object") {
              keys = Object.keys(entities[entkeys[0]][property]);
              buffer = new Float32Array(entkeys.length * keys.length);
            } else
              buffer = new Float32Array(entkeys.length);
          }
        }
        let i = 0;
        for (const key in entities) {
          if (entities[key][property]) {
            if (keys) {
              for (let j = 0; j < keys.length; j++) {
                buffer[i] = entities[key][property][keys[j]];
                i++;
              }
            } else {
              buffer[i] = entities[key][property];
              i++;
            }
          }
        }
        return buffer;
      };
      this.routes = {
        animateEntities: this.animate,
        startEntityAnimation: this.start,
        stopEntityAnimation: this.stop,
        addEntity: this.addEntity,
        addSystem: this.addSystem,
        addSystems: this.addSystems,
        removeEntity: this.removeEntity,
        removeSystem: this.removeSystem,
        setupEntity: this.setupEntity,
        addEntities: this.addEntities,
        filterObject: this.filterObject,
        bufferValues: this.bufferValues
      };
      if (this.routes)
        this.load(this.routes);
      if (options.systems)
        for (const key in options.systems) {
          this.addSystem(options.systems[key], void 0, void 0, options.order);
        }
      if (options.entities) {
        for (const key in options.entities) {
          this.addEntity(options.entities[key], options.entities[key].components);
        }
      }
    }
    filterObject(o, filter) {
      return Object.fromEntries(
        Object.entries(o).filter(([key, value]) => {
          filter(key, value);
        })
      );
    }
  };

  // services/worker/Worker.ts
  if (typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope) {
    self.SERVICE = new WorkerService({
      routes: [
        self.SERVICE,
        workerCanvasRoutes,
        ECSService,
        unsafeRoutes
      ],
      includeClassName: false
    });
  }
  var Worker_default = self;
})();
