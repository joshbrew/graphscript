(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };

  // ../../../Graph.ts
  var ARGUMENT_NAMES = /([^,]*)/g;
  function getFnParamInfo(fn) {
    var fstr = fn.toString();
    const openPar = fstr.indexOf("(");
    const closePar = fstr.indexOf(")");
    const getFirstBracket = (str, offset = 0) => {
      const fb = offset + str.indexOf("{");
      if (fb < closePar && fb > openPar) {
        return getFirstBracket(str.slice(fb), offset + fb);
      } else
        return fb;
    };
    const firstBracket = getFirstBracket(fstr);
    let innerMatch;
    if (firstBracket === -1 || closePar < firstBracket)
      innerMatch = fstr.slice(fstr.indexOf("(") + 1, fstr.indexOf(")"));
    else
      innerMatch = fstr.match(/([a-zA-Z]\w*|\([a-zA-Z]\w*(,\s*[a-zA-Z]\w*)*\)) =>/)?.[1];
    const matches = innerMatch.match(ARGUMENT_NAMES).filter((e) => !!e);
    const info = /* @__PURE__ */ new Map();
    matches.forEach((v) => {
      let [name, value] = v.split("=");
      name = name.trim();
      try {
        if (name)
          info.set(name, (0, eval)(`(${value})`));
      } catch (e) {
        info.set(name, void 0);
        console.warn(`Argument ${name} could be parsed for`, fn.toString());
      }
    });
    return info;
  }
  function parseFunctionFromText(method = "") {
    let getFunctionBody = (methodString) => {
      return methodString.replace(/^\W*(function[^{]+\{([\s\S]*)\}|[^=]+=>[^{]*\{([\s\S]*)\}|[^=]+=>(.+))/i, "$2$3$4");
    };
    let getFunctionHead = (methodString) => {
      let startindex = methodString.indexOf(")");
      return methodString.slice(0, methodString.indexOf("{", startindex) + 1);
    };
    let newFuncHead = getFunctionHead(method);
    let newFuncBody = getFunctionBody(method);
    let newFunc;
    if (newFuncHead.includes("function ")) {
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
      this.arguments = /* @__PURE__ */ new Map();
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
      this.operator = (self = this, origin, ...args) => {
        return args;
      };
      this.runOp = (node = this, origin = this, ...args) => {
        if (node.DEBUGNODE)
          console.time(node.tag);
        let result = node.operator(node, origin, ...args);
        if (result instanceof Promise) {
          result.then((res2) => {
            if (res2 !== void 0)
              this.setState({ [node.tag]: res2 });
            if (node.DEBUGNODE) {
              console.timeEnd(node.tag);
              if (result !== void 0)
                console.log(`${node.tag} result:`, result);
            }
            ;
            return res2;
          });
        } else {
          if (result !== void 0)
            this.setState({ [node.tag]: result });
          if (node.DEBUGNODE) {
            console.timeEnd(node.tag);
            if (result !== void 0)
              console.log(`${node.tag} result:`, result);
          }
          ;
        }
        return result;
      };
      this.setOperator = (operator) => {
        if (typeof operator !== "function")
          return operator;
        let params = getFnParamInfo(operator);
        if (params.size === 0)
          params.set("input", void 0);
        const keys = params.keys();
        const paramOne = keys.next().value;
        const paramTwo = keys.next().value;
        const restrictedOne = ["self", "node"];
        const restrictedTwo = ["origin", "parent", "graph", "router"];
        if (!restrictedOne.includes(paramOne) && !restrictedTwo.includes(paramTwo)) {
          let fn = operator;
          operator = (self, origin, ...args) => {
            return fn(...args);
          };
          this.arguments = params;
        }
        this.operator = operator;
        return operator;
      };
      this.run = (...args) => {
        return this._run(this, void 0, ...args);
      };
      this.runAsync = (...args) => {
        return new Promise((res2, rej) => {
          res2(this._run(this, void 0, ...args));
        });
      };
      this._run = (node = this, origin, ...args) => {
        if (!(typeof node === "object")) {
          if (typeof node === "string") {
            let fnd = void 0;
            if (this.graph)
              fnd = this.graph.nodes.get(node);
            if (!fnd)
              fnd = this.nodes.get(node);
            node = fnd;
          }
          if (!node)
            return void 0;
        }
        if (node.firstRun) {
          node.firstRun = false;
          if (!(node.children && node.forward || node.parent && node.backward || node.repeat || node.delay || node.frame || node.recursive || node.branch))
            node.runSync = true;
          if (node.animate && !node.isAnimating) {
            node.runAnimation(node.animation, args, node, origin);
          }
          if (node.loop && typeof node.loop === "number" && !node.isLooping) {
            node.runLoop(node.looper, args, node, origin);
          }
          if (node.loop || node.animate)
            return;
        }
        if (node.runSync) {
          let res2 = node.runOp(node, origin, ...args);
          return res2;
        }
        return new Promise(async (resolve) => {
          if (node) {
            let run = (node2, tick = 0, ...input2) => {
              return new Promise(async (r) => {
                tick++;
                let res2 = await node2.runOp(node2, origin, ...input2);
                if (node2.repeat) {
                  while (tick < node2.repeat) {
                    if (node2.delay) {
                      setTimeout(async () => {
                        r(await run(node2, tick, ...input2));
                      }, node2.delay);
                      break;
                    } else if (node2.frame && window?.requestAnimationFrame) {
                      requestAnimationFrame(async () => {
                        r(await run(node2, tick, ...input2));
                      });
                      break;
                    } else
                      res2 = await node2.runOp(node2, origin, ...input2);
                    tick++;
                  }
                  if (tick === node2.repeat) {
                    r(res2);
                    return;
                  }
                } else if (node2.recursive) {
                  while (tick < node2.recursive) {
                    if (node2.delay) {
                      setTimeout(async () => {
                        r(await run(node2, tick, ...res2));
                      }, node2.delay);
                      break;
                    } else if (node2.frame && window?.requestAnimationFrame) {
                      requestAnimationFrame(async () => {
                        r(await run(node2, tick, ...res2));
                      });
                      break;
                    } else
                      res2 = await node2.runOp(node2, origin, ...res2);
                    tick++;
                  }
                  if (tick === node2.recursive) {
                    r(res2);
                    return;
                  }
                } else {
                  r(res2);
                  return;
                }
              });
            };
            let runnode = async () => {
              let res2 = await run(node, void 0, ...args);
              if (res2 !== void 0) {
                if (node.backward && node.parent instanceof GraphNode) {
                  if (Array.isArray(res2))
                    await this.runParent(node, ...res2);
                  else
                    await this.runParent(node, res2);
                }
                if (node.children && node.forward) {
                  if (Array.isArray(res2))
                    await this.runChildren(node, ...res2);
                  else
                    await this.runChildren(node, res2);
                }
                if (node.branch) {
                  this.runBranch(node, res2);
                }
              }
              return res2;
            };
            if (node.delay) {
              setTimeout(async () => {
                resolve(await runnode());
              }, node.delay);
            } else if (node.frame && window?.requestAnimationFrame) {
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
      this.runParent = async (node, ...args) => {
        if (node.backward && node.parent) {
          if (typeof node.parent === "string") {
            if (node.graph && node.graph?.get(node.parent)) {
              node.parent = node.graph;
              if (node.parent)
                this.nodes.set(node.parent.tag, node.parent);
            } else
              node.parent = this.nodes.get(node.parent);
          }
          if (node.parent instanceof GraphNode)
            await node.parent._run(node.parent, this, ...args);
        }
      };
      this.runChildren = async (node, ...args) => {
        if (typeof node.children === "object") {
          for (const key in node.children) {
            if (typeof node.children[key] === "string") {
              if (node.graph && node.graph?.get(node.children[key])) {
                node.children[key] = node.graph.get(node.children[key]);
                if (!node.nodes.get(node.children[key].tag))
                  node.nodes.set(node.children[key].tag, node.children[key]);
              }
              if (!node.children[key] && node.nodes.get(node.children[key]))
                node.children[key] = node.nodes.get(node.children[key]);
            }
            if (node.children[key]?.runOp)
              await node.children[key]._run(node.children[key], node, ...args);
          }
        }
      };
      this.runBranch = async (node, output) => {
        if (node.branch) {
          let keys = Object.keys(node.branch);
          await Promise.all(keys.map(async (k) => {
            if (typeof output === "object") {
              if (typeof node.branch[k].if === "object")
                node.branch[k].if = stringifyFast(node.branch[k].if);
              if (stringifyFast(output) === node.branch[k].if) {
                if (node.branch[k].then instanceof GraphNode) {
                  if (Array.isArray(output))
                    await node.branch[k].then.run(...output);
                  else
                    await node.branch[k].then.run(output);
                } else if (typeof node.branch[k].then === "function") {
                  if (Array.isArray(output))
                    await node.branch[k].then(...output);
                  else
                    await node.branch[k].then(output);
                } else if (typeof node.branch[k].then === "string") {
                  if (node.graph)
                    node.branch[k].then = node.graph.nodes.get(node.branch[k].then);
                  else
                    node.branch[k].then = node.nodes.get(node.branch[k].then);
                  if (node.branch[k].then instanceof GraphNode) {
                    if (Array.isArray(output))
                      await node.branch[k].then.run(...output);
                    else
                      await node.branch[k].then.run(output);
                  }
                }
                return true;
              }
            } else {
              await node.branch[k].then(output);
              return true;
            }
          }));
        }
      };
      this.runAnimation = (animation = this.animation, args = [], node = this, origin) => {
        this.animation = animation;
        if (!animation)
          this.animation = this.operator;
        if (node.animate && !node.isAnimating) {
          node.isAnimating = true;
          let anim = async () => {
            if (node.isAnimating) {
              if (node.DEBUGNODE)
                console.time(node.tag);
              let result = this.animation(node, origin, ...args);
              if (result instanceof Promise) {
                result = await result;
              }
              if (node.DEBUGNODE) {
                console.timeEnd(node.tag);
                if (result !== void 0)
                  console.log(`${node.tag} result:`, result);
              }
              ;
              if (result !== void 0) {
                if (this.tag)
                  this.setState({ [this.tag]: result });
                if (node.backward && node.parent?._run) {
                  if (Array.isArray(result))
                    await this.runParent(node, ...result);
                  else
                    await this.runParent(node, result);
                }
                if (node.children && node.forward) {
                  if (Array.isArray(result))
                    await this.runChildren(node, ...result);
                  else
                    await this.runChildren(node, result);
                }
                if (node.branch) {
                  this.runBranch(node, result);
                }
                this.setState({ [node.tag]: result });
              }
              requestAnimationFrame(anim);
            }
          };
          requestAnimationFrame(anim);
        }
      };
      this.runLoop = (loop = this.looper, args = [], node = this, origin, timeout = node.loop) => {
        node.looper = loop;
        if (!loop)
          node.looper = node.operator;
        if (typeof timeout === "number" && !node.isLooping) {
          node.isLooping = true;
          let looping = async () => {
            if (node.isLooping) {
              if (node.DEBUGNODE)
                console.time(node.tag);
              let result = node.looper(node, origin, ...args);
              if (result instanceof Promise) {
                result = await result;
              }
              if (node.DEBUGNODE) {
                console.timeEnd(node.tag);
                if (result !== void 0)
                  console.log(`${node.tag} result:`, result);
              }
              ;
              if (result !== void 0) {
                if (node.tag)
                  node.setState({ [node.tag]: result });
                if (node.backward && node.parent?._run) {
                  if (Array.isArray(result))
                    await this.runParent(node, ...result);
                  else
                    await this.runParent(node, result);
                }
                if (node.children && node.forward) {
                  if (Array.isArray(result))
                    await this.runChildren(node, ...result);
                  else
                    await this.runChildren(node, result);
                }
                if (node.branch) {
                  this.runBranch(node, result);
                }
                node.setState({ [node.tag]: result });
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
      this.add = (node = {}) => {
        if (typeof node === "function")
          node = { operator: node };
        if (!(node instanceof GraphNode))
          node = new GraphNode(node, this, this.graph);
        this.nodes.set(node.tag, node);
        if (this.graph) {
          this.graph.nodes.set(node.tag, node);
          this.graph.nNodes++;
        }
        return node;
      };
      this.remove = (node) => {
        if (typeof node === "string")
          node = this.nodes.get(node);
        if (node instanceof GraphNode) {
          this.nodes.delete(node.tag);
          if (this.graph) {
            this.graph.nodes.delete(node.tag);
            this.graph.nNodes--;
          }
          this.nodes.forEach((n) => {
            if (n.nodes.get(node.tag))
              n.nodes.delete(node.tag);
          });
        }
      };
      this.append = (node, parentNode = this) => {
        if (typeof node === "string")
          node = this.nodes.get(node);
        if (node instanceof GraphNode) {
          parentNode.addChildren(node);
          if (node.forward)
            node.runSync = false;
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
        if (typeof children === "object")
          Object.assign(this.children, children);
        this.convertChildrenToNodes();
        if (this.forward)
          this.runSync = false;
      };
      this.callParent = (...args) => {
        const origin = this;
        if (typeof this.parent === "string") {
          if (this.graph && this.graph?.get(this.parent)) {
            this.parent = this.graph;
            if (this.parent)
              this.nodes.set(this.parent.tag, this.parent);
          } else
            this.parent = this.nodes.get(this.parent);
        }
        if (typeof this.parent?.operator === "function")
          return this.parent.runOp(this.parent, origin, ...args);
      };
      this.callChildren = (idx, ...args) => {
        const origin = this;
        let result;
        if (typeof this.children === "object") {
          for (const key in this.children) {
            if (this.children[key]?.runOp)
              this.children[key].runOp(this.children[key], origin, ...args);
          }
        }
        return result;
      };
      this.setProps = (props = {}) => {
        Object.assign(this, props);
        if (!(this.children && this.forward || this.parent && this.backward || this.repeat || this.delay || this.frame || this.recursive))
          this.runSync = true;
      };
      this.removeTree = (node) => {
        if (node) {
          if (typeof node === "string")
            node = this.nodes.get(node);
        }
        if (node instanceof GraphNode) {
          const recursivelyRemove = (node2) => {
            if (typeof node2.children === "object") {
              for (const key in node2.children) {
                if (node2.children[key].stopNode)
                  node2.children[key].stopNode();
                if (node2.children[key].tag) {
                  if (this.nodes.get(node2.children[key].tag))
                    this.nodes.delete(node2.children[key].tag);
                  if (this[node2.children[key].tag] instanceof GraphNode)
                    delete this[node2.children[key].tag];
                }
                this.nodes.forEach((n) => {
                  if (n.nodes.get(node2.children[key].tag))
                    n.nodes.delete(node2.children[key].tag);
                  if (n[node2.children[key].tag] instanceof GraphNode)
                    delete n[node2.children[key].tag];
                });
                recursivelyRemove(node2.children[key]);
              }
            }
          };
          if (node.stopNode)
            node.stopNode();
          if (node.tag) {
            this.nodes.delete(node.tag);
            if (this[node.tag] instanceof GraphNode)
              delete this[node.tag];
            this.nodes.forEach((n) => {
              if (node?.tag) {
                if (n.nodes.get(node.tag))
                  n.nodes.delete(node.tag);
                if (n[node.tag] instanceof GraphNode)
                  delete n[node.tag];
              }
            });
            recursivelyRemove(node);
            if (this.graph)
              this.graph.removeTree(node);
          }
        }
      };
      this.checkNodesHaveChildMapped = (node, child, checked = {}) => {
        let tag = node.tag;
        if (!tag)
          tag = node.name;
        if (!checked[tag]) {
          checked[tag] = true;
          if (node.children) {
            if (child.tag in node.children) {
              if (!(node.children[child.tag] instanceof GraphNode))
                node.children[child.tag] = child;
            }
          }
          if (node.parent) {
            if (node.parent.children) {
              this.checkNodesHaveChildMapped(node.parent, child, checked);
            } else if (node.nodes) {
              node.nodes.forEach((n) => {
                if (!checked[n.tag]) {
                  this.checkNodesHaveChildMapped(n, child, checked);
                }
              });
            }
          }
          if (node.graph) {
            if (node.parent && node.parent.name !== node.graph.name) {
              node.graph.nodes.forEach((n) => {
                if (!checked[n.tag]) {
                  this.checkNodesHaveChildMapped(n, child, checked);
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
              if (typeof n.children[key] === "undefined" || n.children[key] === true) {
                n.children[key] = n.graph.get(key);
                if (!n.children[key])
                  n.children[key] = n.nodes.get(key);
                if (n.children[key] instanceof GraphNode) {
                  if (!n.nodes.get(n.children[key].tag))
                    n.nodes.set(n.children[key].tag, n.children[key]);
                  if (!(n.children[key].tag in n))
                    n[n.children[key].tag] = n.children[key].tag;
                  this.checkNodesHaveChildMapped(n, n.children[key]);
                }
              } else if (typeof n.children[key] === "string") {
                let child = n.graph.get(n.children[key]);
                n.children[key] = child;
                if (!child)
                  child = n.nodes.get(key);
                if (child instanceof GraphNode) {
                  if (!n.nodes.get(n.children[key].tag))
                    n.nodes.set(n.children[key].tag, n.children[key]);
                  if (!(n.children[key].tag in n))
                    n[n.children[key].tag] = n.children[key].tag;
                  this.checkNodesHaveChildMapped(n, child);
                }
              } else if (typeof n.children[key] === "object") {
                if (!n.children[key].tag)
                  n.children[key].tag = key;
                n.children[key] = new GraphNode(n.children[key], n, n.graph);
                this.checkNodesHaveChildMapped(n, n.children[key]);
              }
            }
          }
        }
        return n.children;
      };
      this.stopLooping = (node = this) => {
        node.isLooping = false;
      };
      this.stopAnimating = (node = this) => {
        node.isAnimating = false;
      };
      this.stopNode = (node = this) => {
        node.stopAnimating(node);
        node.stopLooping(node);
      };
      this.subscribeNode = (node) => {
        if (node.tag)
          this.nodes.set(node.tag, node);
        return this.state.subscribeTrigger(this.tag, (res2) => {
          node._run(node, this, res2);
        });
      };
      this.print = (node = this, printChildren = true, nodesPrinted = []) => {
        let dummyNode = new GraphNode();
        if (typeof node === "string")
          node = this.nodes.get(node);
        if (node instanceof GraphNode) {
          nodesPrinted.push(node.tag);
          let jsonToPrint = {
            tag: node.tag,
            operator: node.operator.toString()
          };
          if (node.parent)
            jsonToPrint.parent = node.parent.tag;
          if (typeof node.children === "object") {
            for (const key in node.children) {
              if (typeof node.children[key] === "string")
                return node.children[key];
              if (nodesPrinted.includes(node.children[key].tag))
                return node.children[key].tag;
              else if (!printChildren) {
                return node.children[key].tag;
              } else
                return node.children[key].print(node.children[key], printChildren, nodesPrinted);
            }
          }
          for (const prop in node) {
            if (prop === "parent" || prop === "children")
              continue;
            if (typeof dummyNode[prop] === "undefined") {
              if (typeof node[prop] === "function") {
                jsonToPrint[prop] = node[prop].toString();
              } else if (typeof node[prop] === "object") {
                jsonToPrint[prop] = JSON.stringifyWithCircularRefs(node[prop]);
              } else {
                jsonToPrint[prop] = node[prop];
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
        let source;
        if (properties instanceof Graph) {
          source = properties;
          properties = {
            source,
            operator: (input2) => {
              if (typeof input2 === "object") {
                let result = {};
                for (const key in input2) {
                  if (typeof source[key] === "function") {
                    if (Array.isArray(input2[key]))
                      result[key] = source[key](...input2[key]);
                    else
                      result[key] = source[key](input2[key]);
                  } else {
                    source[key] = input2[key];
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
          this.nodes = source.nodes;
          if (graph) {
            source.nodes.forEach((n) => {
              if (!graph.nodes.get(n.tag)) {
                graph.nodes.set(n.tag, n);
                graph.nNodes++;
              }
            });
          }
        }
        if (properties.tag) {
          if (graph?.nodes) {
            let hasnode = graph.nodes.get(properties.tag);
            source = hasnode;
          }
          if (parentNode?.nodes) {
            let hasnode = parentNode.nodes.get(properties.tag);
            source = hasnode;
          }
          if (source) {
            Object.assign(this, source);
            if (!this.source)
              this.source = source;
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
        Object.assign(this, properties);
        if (!this.tag) {
          if (graph) {
            this.tag = `node${graph.nNodes}`;
          } else {
            this.tag = `node${Math.floor(Math.random() * 1e10)}`;
          }
        }
        if (parentNode)
          this.parent = parentNode;
        if (graph)
          this.graph = graph;
        if (graph) {
          if (graph.nodes.get(this.tag))
            graph.nodes.set(`${graph.nNodes}${this.tag}`, this);
          else
            graph.nodes.set(this.tag, this);
          graph.nNodes++;
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
        if (!graph && typeof this.oncreate === "function")
          this.oncreate(this);
      } else
        return properties;
    }
  };
  var Graph = class {
    constructor(tree2, tag, props) {
      this.nNodes = 0;
      this.nodes = /* @__PURE__ */ new Map();
      this.state = state;
      this.tree = {};
      this.add = (node = {}, fromTree = false) => {
        let props = node;
        if (!(node instanceof GraphNode))
          node = new GraphNode(props, this, this);
        if (node.tag)
          this.tree[node.tag] = props;
        if (!fromTree) {
          if (node.oncreate)
            node.oncreate(node);
        }
        return node;
      };
      this.setTree = (tree2 = this.tree) => {
        if (!tree2)
          return;
        let oncreate = {};
        for (const node in tree2) {
          if (!this.nodes.get(node)) {
            if (typeof tree2[node] === "function") {
              this.add({ tag: node, operator: tree2[node] }, true);
            } else if (typeof tree2[node] === "object" && !Array.isArray(tree2[node])) {
              if (!tree2[node].tag)
                tree2[node].tag = node;
              let newNode = this.add(tree2[node]);
              if (tree2[node].aliases) {
                tree2[node].aliases.forEach((a) => {
                  this.nodes.set(a, newNode);
                });
              }
            } else {
              this.add({ tag: node, operator: (self, origin, ...args) => {
                return tree2[node];
              } }, true);
            }
            if (this.nodes.get(node)?.oncreate) {
              oncreate[node] = this.nodes.get(node).oncreate;
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
        for (const key in oncreate) {
          oncreate[key](this.nodes.get(key));
        }
      };
      this.get = (tag) => {
        return this.nodes.get(tag);
      };
      this.set = (node) => {
        return this.nodes.set(node.tag, node);
      };
      this.run = (node, ...args) => {
        if (typeof node === "string")
          node = this.nodes.get(node);
        if (node instanceof GraphNode)
          return node._run(node, this, ...args);
        else
          return void 0;
      };
      this.runAsync = (node, ...args) => {
        if (typeof node === "string")
          node = this.nodes.get(node);
        if (node instanceof GraphNode)
          return new Promise((res2, rej) => {
            res2(node._run(node, this, ...args));
          });
        else
          return new Promise((res2, rej) => {
            res2(void 0);
          });
      };
      this._run = (node, origin = this, ...args) => {
        if (typeof node === "string")
          node = this.nodes.get(node);
        if (node instanceof GraphNode)
          return node._run(node, origin, ...args);
        else
          return void 0;
      };
      this.removeTree = (node) => {
        if (typeof node === "string")
          node = this.nodes.get(node);
        if (node instanceof GraphNode) {
          const recursivelyRemove = (node2) => {
            if (node2.children) {
              if (Array.isArray(node2.children)) {
                node2.children.forEach((c) => {
                  if (c.stopNode)
                    c.stopNode();
                  if (c.tag) {
                    if (this.nodes.get(c.tag))
                      this.nodes.delete(c.tag);
                  }
                  this.nodes.forEach((n) => {
                    if (n.nodes.get(c.tag))
                      n.nodes.delete(c.tag);
                  });
                  recursivelyRemove(c);
                });
              } else if (typeof node2.children === "object") {
                if (node2.stopNode)
                  node2.stopNode();
                if (node2.tag) {
                  if (this.nodes.get(node2.tag))
                    this.nodes.delete(node2.tag);
                }
                this.nodes.forEach((n) => {
                  if (n.nodes.get(node2.tag))
                    n.nodes.delete(node2.tag);
                });
                recursivelyRemove(node2);
              }
            }
          };
          if (node.stopNode)
            node.stopNode();
          if (node.tag) {
            this.nodes.delete(node.tag);
            this.nodes.forEach((n) => {
              if (n.nodes.get(node.tag))
                n.nodes.delete(node.tag);
            });
            this.nNodes--;
            recursivelyRemove(node);
          }
        }
        return node;
      };
      this.remove = (node) => {
        if (typeof node === "string")
          node = this.nodes.get(node);
        if (node?.tag) {
          node.stopNode();
          if (node?.tag) {
            if (this.nodes.get(node.tag)) {
              this.nodes.delete(node.tag);
              this.nodes.forEach((n) => {
                if (n.nodes.get(node.tag))
                  n.nodes.delete(node.tag);
              });
            }
          }
        }
        return node;
      };
      this.append = (node, parentNode) => {
        parentNode.addChildren(node);
      };
      this.callParent = async (node, origin = node, ...args) => {
        if (node?.parent) {
          return await node.callParent(node, origin, ...args);
        }
      };
      this.callChildren = async (node, idx, ...args) => {
        if (node?.children) {
          return await node.callChildren(idx, ...args);
        }
      };
      this.subscribe = (node, callback) => {
        if (!callback)
          return;
        if (node instanceof GraphNode) {
          return node.subscribe(callback);
        } else if (typeof node == "string")
          return this.state.subscribeTrigger(node, callback);
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
        return this.state.subscribeTrigger(tag, (res2) => {
          this.run(outputNode, inputNode, ...res2);
        });
      };
      this.stopNode = (node) => {
        if (typeof node === "string") {
          node = this.nodes.get(node);
        }
        if (node instanceof GraphNode) {
          node.stopNode();
        }
      };
      this.print = (node = void 0, printChildren = true) => {
        if (node instanceof GraphNode)
          return node.print(node, printChildren);
        else {
          let printed = `{`;
          this.nodes.forEach((n) => {
            printed += `
"${n.tag}:${n.print(n, printChildren)}"`;
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
      if (tree2 || Object.keys(this.tree).length > 0)
        this.setTree(tree2);
      if (props)
        Object.assign(this, props);
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
      let res2 = JSON.stringify(obj, checkValues, space);
      clear();
      return res2;
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

  // ../../../services/Service.ts
  var Service = class extends Graph {
    constructor(options = {}) {
      super(void 0, options.name, options.props);
      this.routes = {};
      this.loadDefaultRoutes = true;
      this.name = `service${Math.floor(Math.random() * 1e14)}`;
      this.keepState = true;
      this.load = (routes2, enumRoutes = true) => {
        if (!routes2 && !this.loadDefaultRoutes)
          return;
        let service;
        if (!(routes2 instanceof Graph) && routes2?.name) {
          if (routes2.module) {
            let mod = routes2;
            routes2 = {};
            Object.getOwnPropertyNames(routes2.module).forEach((prop) => {
              if (enumRoutes)
                routes2[mod.name + "/" + prop] = routes2.module[prop];
              else
                routes2[prop] = routes2.module[prop];
            });
          } else if (typeof routes2 === "function") {
            service = new routes2();
            service.load();
            routes2 = service.routes;
          }
        } else if (routes2 instanceof Graph && (routes2.routes || routes2.tree)) {
          service = routes2;
          if (routes2.routes)
            routes2 = routes2.routes;
          else if (routes2.tree)
            routes2 = routes2.tree;
        } else if (typeof routes2 === "object") {
          let name = routes2.constructor.name;
          if (name === "Object") {
            name = Object.prototype.toString.call(routes2);
            if (name)
              name = name.split(" ")[1];
            if (name)
              name = name.split("]")[0];
          }
          if (name && name !== "Object") {
            let module = routes2;
            routes2 = {};
            Object.getOwnPropertyNames(module).forEach((route) => {
              if (enumRoutes)
                routes2[name + "/" + route] = module[route];
              else
                routes2[route] = module[route];
            });
          }
        }
        if (service instanceof Graph && service.name) {
          routes2 = Object.assign({}, routes2);
          for (const prop in routes2) {
            let route = routes2[prop];
            delete routes2[prop];
            routes2[service.name + "/" + prop] = route;
          }
        }
        if (this.loadDefaultRoutes) {
          let rts = Object.assign({}, this.defaultRoutes);
          if (routes2) {
            Object.assign(rts, this.routes);
            routes2 = Object.assign(rts, routes2);
          } else
            routes2 = Object.assign(rts, this.routes);
          this.loadDefaultRoutes = false;
        }
        for (const tag in routes2) {
          let childrenIter = (route) => {
            if (typeof route?.children === "object") {
              for (const key in route.children) {
                if (typeof route.children[key] === "object") {
                  let rt = route.children[key];
                  if (!rt.parent)
                    rt.parent = tag;
                  if (rt.tag) {
                    routes2[rt.tag] = route.children[key];
                    childrenIter(routes2[rt.tag]);
                  } else if (rt.id) {
                    rt.tag = rt.id;
                    routes2[rt.tag] = route.children[key];
                    childrenIter(routes2[rt.tag]);
                  }
                }
              }
            }
          };
          childrenIter(routes2[tag]);
        }
        for (const route in routes2) {
          if (typeof routes2[route] === "object") {
            let r = routes2[route];
            if (typeof r === "object") {
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
                routes2[route].operator = r.post;
              } else if (!r.operator && typeof r.get == "function") {
                routes2[route].operator = r.get;
              }
            }
            if (this.routes[route]) {
              if (typeof this.routes[route] === "object")
                Object.assign(this.routes[route], routes2[route]);
              else
                this.routes[route] = routes2[route];
            } else
              this.routes[route] = routes2[route];
          } else if (this.routes[route]) {
            if (typeof this.routes[route] === "object")
              Object.assign(this.routes[route], routes2[route]);
            else
              this.routes[route] = routes2[route];
          } else
            this.routes[route] = routes2[route];
        }
        this.setTree(this.routes);
        for (const prop in this.routes) {
          if (this.routes[prop]?.aliases) {
            let aliases = this.routes[prop].aliases;
            aliases.forEach((a) => {
              if (service)
                routes2[service.name + "/" + a] = this.routes[prop];
              else
                routes2[a] = this.routes[prop];
            });
          }
        }
        return this.routes;
      };
      this.unload = (routes2 = this.routes) => {
        if (!routes2)
          return;
        let service;
        if (!(routes2 instanceof Service) && typeof routes2 === "function") {
          service = new Service();
          routes2 = service.routes;
        } else if (routes2 instanceof Service) {
          routes2 = routes2.routes;
        }
        for (const r in routes2) {
          delete this.routes[r];
          if (this.nodes.get(r))
            this.remove(r);
        }
        return this.routes;
      };
      this.handleMethod = (route, method, args, origin) => {
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
          return this.handleServiceMessage({ route, args, method, origin });
      };
      this.transmit = (...args) => {
        if (typeof args[0] === "object") {
          if (args[0].method) {
            return this.handleMethod(args[0].route, args[0].method, args[0].args);
          } else if (args[0].route) {
            return this.handleServiceMessage(args[0]);
          } else if (args[0].node) {
            return this.handleGraphNodeCall(args[0].node, args[0].args, args[0].origin);
          } else if (this.keepState) {
            if (args[0].route)
              this.setState({ [args[0].route]: args[0].args });
            if (args[0].node)
              this.setState({ [args[0].node]: args[0].args });
          }
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
            return this.handleGraphNodeCall(args[0].node, args[0].args, args[0].origin);
          } else if (this.keepState) {
            if (args[0].route)
              this.setState({ [args[0].route]: args[0].args });
            if (args[0].node)
              this.setState({ [args[0].node]: args[0].args });
          }
        } else
          return args;
      };
      this.pipe = (source, destination, endpoint, origin, method, callback) => {
        if (source instanceof GraphNode) {
          if (callback)
            return source.subscribe((res2) => {
              let mod = callback(res2);
              if (mod !== void 0)
                this.transmit({ route: destination, args: mod, origin, method });
              else
                this.transmit({ route: destination, args: res2, origin, method }, endpoint);
            });
          else
            return this.subscribe(source, (res2) => {
              this.transmit({ route: destination, args: res2, origin, method }, endpoint);
            });
        } else if (typeof source === "string")
          return this.subscribe(source, (res2) => {
            this.transmit({ route: destination, args: res2, origin, method }, endpoint);
          });
      };
      this.pipeOnce = (source, destination, endpoint, origin, method, callback) => {
        if (source instanceof GraphNode) {
          if (callback)
            return source.state.subscribeTriggerOnce(source.tag, (res2) => {
              let mod = callback(res2);
              if (mod !== void 0)
                this.transmit({ route: destination, args: mod, origin, method });
              else
                this.transmit({ route: destination, args: res2, origin, method }, endpoint);
            });
          else
            return this.state.subscribeTriggerOnce(source.tag, (res2) => {
              this.transmit({ route: destination, args: res2, origin, method }, endpoint);
            });
        } else if (typeof source === "string")
          return this.state.subscribeTriggerOnce(source, (res2) => {
            this.transmit({ route: destination, args: res2, origin, method }, endpoint);
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
        transmit: this.transmit,
        receive: this.receive,
        load: this.load,
        unload: this.unload,
        pipe: this.pipe,
        terminate: this.terminate,
        run: this.run,
        _run: this._run,
        subscribe: this.subscribe,
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
      if ("loadDefaultRoutes" in options)
        this.loadDefaultRoutes = options.loadDefaultRoutes;
      if (options.name)
        this.name = options.name;
      if (Array.isArray(options.routes)) {
        options.routes.forEach((r) => {
          this.load(r);
        });
      } else if (options.routes)
        this.load(options.routes);
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
        if (message.origin) {
          if (Array.isArray(message.args))
            return this._run(call, message.origin, ...message.args);
          else
            return this._run(call, message.origin, message.args);
        } else {
          if (Array.isArray(message.args))
            return this.run(call, ...message.args);
          else
            return this.run(call, message.args);
        }
      } else
        return message;
    }
    handleGraphNodeCall(route, args, origin) {
      if (!route)
        return args;
      if (args?.args) {
        this.handleServiceMessage(args);
      } else if (origin) {
        if (Array.isArray(args))
          return this._run(route, origin, ...args);
        else
          return this._run(route, origin, args);
      } else if (Array.isArray(args))
        return this.run(route, ...args);
      else
        return this.run(route, args);
    }
    isTypedArray(x) {
      return ArrayBuffer.isView(x) && Object.prototype.toString.call(x) !== "[object DataView]";
    }
  };

  // ../../../routers/Router.ts
  var Router = class {
    constructor(services, options) {
      this.id = `router${Math.floor(Math.random() * 1e15)}`;
      this.service = new Service();
      this.run = this.service.run;
      this._run = this.service._run;
      this.add = this.service.add;
      this.remove = this.service.remove;
      this.stopNode = this.service.stopNode;
      this.subscribe = this.service.subscribe;
      this.unsubscribe = this.service.unsubscribe;
      this.get = this.service.get;
      this.reconstruct = this.service.reconstruct;
      this.setState = this.service.setState;
      this.recursivelyAssign = this.service.recursivelyAssign;
      this.state = this.service.state;
      this.routes = {};
      this.services = {};
      this.load = (service, linkServices = true) => {
        if (!(service instanceof Graph) && typeof service === "function") {
          service = new service(void 0, service.name);
          service.load();
        } else if (!service)
          return;
        if (service instanceof Graph && service.name) {
          this.services[service.name] = service;
        } else {
          if (service.constructor.name === "Object") {
            let name = Object.prototype.toString.call(service);
            if (name)
              name = name.split(" ")[1];
            if (name)
              name = name.split("]")[0];
            if (name && name !== "Object" && name !== "Function") {
              this.services[name] = service;
            }
          } else
            this.services[service.constructor.name] = service;
        }
        this.service.load(service, linkServices);
        if (linkServices) {
          for (const name in this.services) {
            this.service.nodes.forEach((n) => {
              if (this.services[name]?.nodes) {
                if (!this.services[name].nodes.get(n.tag)) {
                  this.services[name].nodes.set(n.tag, n);
                }
              }
            });
          }
        }
        return this.services[service.name];
      };
      this.pipe = (source, destination, transmitter, origin, method, callback) => {
        if (!transmitter && source && destination) {
          if (callback)
            return this.subscribe(source, (res2) => {
              let mod = callback(res2);
              if (mod)
                res2 = mod;
              this.run(destination, res2);
            });
          return this.subscribe(source, (res2) => {
            this.run(destination, res2);
          });
        }
        if (transmitter) {
          if (transmitter === "sockets")
            transmitter = "wss";
          const radio = this.services[transmitter];
          if (radio) {
            if (callback) {
              return this.subscribe(source, (res2) => {
                let mod = callback(res2);
                if (mod)
                  res2 = mod;
                radio.transmit({ route: destination, args: res2, origin, method });
              });
            } else
              return this.subscribe(source, (res2) => {
                radio.transmit({ route: destination, args: res2, origin, method });
              });
          } else {
            let endpoint = this.getEndpointInfo(transmitter);
            if (endpoint) {
              return this.services[endpoint.service].pipe(source, destination, transmitter, origin, method, callback);
            }
          }
        }
        return false;
      };
      this.pipeOnce = (source, destination, transmitter, origin, method, callback) => {
        if (source instanceof GraphNode)
          source = source.tag;
        if (!transmitter && typeof source === "string" && destination) {
          if (callback)
            return this.state.subscribeTriggerOnce(source, (res2) => {
              let mod = callback(res2);
              if (mod)
                res2 = mod;
              this.run(destination, res2);
            });
          return this.state.subscribeTriggerOnce(source, (res2) => {
            this.run(destination, res2);
          });
        }
        if (transmitter) {
          if (transmitter === "sockets")
            transmitter = "wss";
          const radio = this.services[transmitter];
          if (radio) {
            if (callback) {
              return this.state.subscribeTriggerOnce(source, (res2) => {
                let mod = callback(res2);
                if (mod)
                  res2 = mod;
                radio.transmit({ route: destination, args: res2, origin, method });
              });
            } else
              return this.state.subscribeTriggerOnce(source, (res2) => {
                radio.transmit({ route: destination, args: res2, origin, method });
              });
          } else {
            let endpoint = this.getEndpointInfo(transmitter);
            if (endpoint) {
              return this.services[endpoint.service].pipeOnce(source, destination, transmitter, origin, method, callback);
            }
          }
        }
        return false;
      };
      this.sendAll = (message, connections, channel) => {
        let sent = false;
        if (typeof connections === "object") {
          for (const protocol in connections) {
            for (const info in connections[protocol]) {
              let obj = connections[protocol][info];
              if (obj.socket) {
                if (obj.socket.readyState === 1) {
                  obj.socket.send(message);
                  sent = true;
                } else
                  delete connections[protocol][info];
              } else if (obj.wss) {
                obj.wss.clients.forEach((c) => {
                  c.send(message);
                });
                sent = true;
              } else if (obj.sessions) {
                if (channel) {
                  obj.channel.broadcast(message, channel);
                  sent = true;
                } else
                  for (const s in obj.sessions) {
                    if (obj.sessions[s].isConnected) {
                      obj.sessions[s].push(message);
                      sent = true;
                    }
                  }
              } else if (obj.session) {
                if (channel) {
                  obj.served.channel.broadcast(message, channel);
                  sent = true;
                } else if (obj.session.isConnected) {
                  obj.session.push(message);
                  sent = true;
                } else
                  delete connections[protocol][info];
              } else if (obj.rtc) {
                if (channel && obj.channels[channel]) {
                  obj.channels[channel].send(message);
                  sent = true;
                } else if (obj.channels.data) {
                  obj.channels.data.send(message);
                  sent = true;
                } else {
                  let firstchannel = Object.keys(obj.channels)[0];
                  obj.channels[firstchannel].send(message);
                  sent = true;
                }
              } else if (obj.server) {
                if (this.services.http) {
                  this.services.http.transmit(message, channel);
                  sent = true;
                }
              }
            }
          }
        }
        return sent;
      };
      this.getEndpointInfo = (path, service) => {
        if (!path)
          return void 0;
        let testpath = (path2, service2) => {
          if (this.services[service2]) {
            if (this.services[service2].rtc?.[path2]) {
              return this.services[service2].rtc[path2];
            } else if (this.services[service2].servers?.[path2]) {
              return this.services[service2].servers[path2];
            } else if (this.services[service2].sockets?.[path2]) {
              return this.services[service2].sockets[path2];
            } else if (this.services[service2].eventsources?.[path2]) {
              return this.services[service2].eventsources[path2];
            } else if (this.services[service2].workers?.[path2]) {
              return this.services[service2].workers[path2];
            }
          }
          return void 0;
        };
        if (service) {
          let found = testpath(path, service);
          if (found)
            return {
              endpoint: found,
              service
            };
        }
        for (const s in this.services) {
          let found = testpath(path, s);
          if (found)
            return {
              endpoint: found,
              service: s
            };
        }
        return void 0;
      };
      this.pipeFastest = (source, destination, origin, method, callback, services = this.services) => {
        for (const service in services) {
          if (services[service].rtc) {
            return this.pipe(source, destination, "webrtc", origin, method, callback);
          }
          if (services[service].eventsources) {
            let keys = Object.keys(services[service].eventsources);
            if (keys[0]) {
              if (this.services[service].eventsources[keys[0]].sessions)
                return this.pipe(source, destination, "sse", origin, method, callback);
            }
          }
          if (services[service].sockets) {
            return this.pipe(source, destination, "wss", origin, method, callback);
          }
          if (services[service].servers) {
            return this.pipe(source, destination, "http", origin, method, callback);
          }
          if (services[service].workers) {
            return this.pipe(source, destination, "worker", origin, method, callback);
          }
        }
        return false;
      };
      this.getFirstRemoteEndpoint = (services = this.services) => {
        let serviceInfo;
        for (const service in services) {
          if (services[service].rtc) {
            serviceInfo = services[service].rtc;
          }
          if (services[service].eventsources && !serviceInfo) {
            let keys2 = Object.keys(services[service].eventsources);
            if (keys2[0]) {
              if (this.services[service].eventsources[keys2[0]]?.sessions)
                serviceInfo = services[service].eventsources;
            }
          }
          if (services[service].sockets && !serviceInfo) {
            serviceInfo = services[service].sockets;
          }
          if (services[service].servers && !serviceInfo) {
            serviceInfo = services[service].servers;
          }
          if (services[service].workers && !serviceInfo) {
            serviceInfo = services[service].workers;
          }
        }
        let keys = Object.keys(serviceInfo);
        if (keys[0])
          return serviceInfo[keys[0]];
        return false;
      };
      this.STREAMLATEST = 0;
      this.STREAMALLLATEST = 1;
      this.streamSettings = {};
      this.streamFunctions = {
        allLatestValues: (prop, setting) => {
          let result = void 0;
          if (Array.isArray(prop)) {
            if (prop.length !== setting.lastRead) {
              result = prop.slice(setting.lastRead);
              setting.lastRead = prop.length;
            }
          } else if (typeof prop === "object") {
            result = {};
            for (const p in prop) {
              if (Array.isArray(prop[p])) {
                if (typeof setting === "number")
                  setting = { [p]: { lastRead: void 0 } };
                else if (!setting[p])
                  setting[p] = { lastRead: void 0 };
                if (prop[p].length !== setting[p].lastRead) {
                  result[p] = prop[p].slice(setting[p].lastRead);
                  setting[p].lastRead = prop[p].length;
                }
              } else {
                if (typeof setting === "number")
                  setting = { [p]: { lastRead: void 0 } };
                else if (!setting[p])
                  setting[p] = { lastRead: void 0 };
                if (setting[p].lastRead !== prop[p]) {
                  result[p] = prop[p];
                  setting[p].lastRead = prop[p];
                }
              }
            }
            if (Object.keys(result).length === 0)
              result = void 0;
          } else {
            if (setting.lastRead !== prop) {
              result = prop;
              setting.lastRead = prop;
            }
          }
          return result;
        },
        latestValue: (prop, setting) => {
          let result = void 0;
          if (Array.isArray(prop)) {
            if (prop.length !== setting.lastRead) {
              result = prop[prop.length - 1];
              setting.lastRead = prop.length;
            }
          } else if (typeof prop === "object") {
            result = {};
            for (const p in prop) {
              if (Array.isArray(prop[p])) {
                if (typeof setting === "number")
                  setting = { [p]: { lastRead: void 0 } };
                else if (!setting[p])
                  setting[p] = { lastRead: void 0 };
                if (prop[p].length !== setting[p].lastRead) {
                  result[p] = prop[p][prop[p].length - 1];
                  setting[p].lastRead = prop[p].length;
                }
              } else {
                if (typeof setting === "number")
                  setting = { [p]: { lastRead: void 0 } };
                else if (!setting[p])
                  setting[p] = { lastRead: void 0 };
                if (setting[p].lastRead !== prop[p]) {
                  result[p] = prop[p];
                  setting[p].lastRead = prop[p];
                }
              }
            }
          } else {
            if (setting.lastRead !== prop) {
              result = prop;
              setting.lastRead = prop;
            }
          }
          return result;
        }
      };
      this.setStreamFunc = (name, key, callback = this.streamFunctions.allLatestValues) => {
        if (!this.streamSettings[name].settings[key])
          this.streamSettings[name].settings[key] = { lastRead: 0 };
        if (callback === this.STREAMLATEST)
          this.streamSettings[name].settings[key].callback = this.streamFunctions.latestValue;
        else if (callback === this.STREAMALLLATEST)
          this.streamSettings[name].settings[key].callback = this.streamFunctions.allLatestValues;
        else if (typeof callback === "string")
          this.streamSettings[name].settings[key].callback = this.streamFunctions[callback];
        else if (typeof callback === "function")
          this.streamSettings[name].settings[key].callback = callback;
        if (!this.streamSettings[name].settings[key].callback)
          this.streamSettings[name].settings[key].callback = this.streamFunctions.allLatestValues;
        return true;
      };
      this.addStreamFunc = (name, callback = (data) => {
      }) => {
        this.streamFunctions[name] = callback;
      };
      this.setStream = (object = {}, settings = {}, streamName = `stream${Math.floor(Math.random() * 1e10)}`) => {
        if (settings.keys) {
          if (settings.keys.length === 0) {
            let k = Object.keys(object);
            if (k.length > 0) {
              settings.keys = Array.from(k);
            }
          }
        } else {
          settings.keys = Array.from(Object.keys(object));
        }
        this.streamSettings[streamName] = {
          object,
          settings
        };
        settings.keys.forEach((prop) => {
          if (settings[prop]?.callback)
            this.setStreamFunc(streamName, prop, settings[prop].callback);
          else
            this.setStreamFunc(streamName, prop, settings.callback);
        });
        return this.streamSettings[streamName];
      };
      this.removeStream = (streamName, key) => {
        if (streamName && !key)
          delete this.streamSettings[streamName];
        else if (key && this.streamSettings[streamName]?.settings?.keys) {
          let idx = this.streamSettings[streamName].settings.keys.indexOf(key);
          if (idx > -1)
            this.streamSettings[streamName].settings.keys.splice(idx, 1);
          if (this.streamSettings[streamName].settings[key])
            delete this.streamSettings[streamName].settings[key];
          return true;
        }
        return false;
      };
      this.updateStreamData = (streamName, data = {}) => {
        if (this.streamSettings[streamName]) {
          Object.assign(this.streamSettings[streamName].object, data);
          return this.streamSettings[streamName].object;
        }
        return false;
      };
      this.streamLoop = (connections, channel) => {
        let updateObj = {};
        for (const prop in this.streamSettings) {
          this.streamSettings[prop].settings.keys.forEach((key) => {
            if (this.streamSettings[prop].settings[key]) {
              let data = this.streamSettings[prop].settings[key].callback(this.streamSettings[prop].object[key], this.streamSettings[prop].settings[key]);
              if (data !== void 0)
                updateObj[key] = data;
            }
          });
        }
        if (connections) {
          this.sendAll(updateObj, connections, channel);
        }
        return updateObj;
      };
      this.receive = (message, service, ...args) => {
        if (service)
          for (const key in this.services) {
            if (key === service || this.services[key].name === service) {
              return this.services[key].receive(message, ...args);
            }
          }
        return this.service.receive(message, ...args);
      };
      this.transmit = (message, service, ...args) => {
        if (service)
          for (const key in this.services) {
            if (key === service || this.services[key].name === service) {
              return this.services[key].transmit(message, ...args);
            }
          }
        return this.service.transmit(message, ...args);
      };
      this.defaultRoutes = {
        getEndpointInfo: this.getEndpointInfo,
        pipeOnce: this.pipeOnce,
        pipeFastest: this.pipeFastest,
        setStream: this.setStream,
        removeStream: this.removeStream,
        updateStreamData: this.updateStreamData,
        addStreamFunc: this.addStreamFunc,
        setStreamFunc: this.setStreamFunc,
        sendAll: this.sendAll,
        streamLoop: {
          operator: this.streamLoop,
          loop: 10
        }
      };
      if (options && options?.loadDefaultRoutes)
        this.load(this.defaultRoutes);
      if (this.routes) {
        if (Object.keys(this.routes).length > 0)
          this.load(this.routes);
      }
      if (Array.isArray(services)) {
        services.forEach((s) => this.load(s, options?.linkServices));
      } else if (typeof services === "object") {
        Object.keys(services).forEach((s) => this.load(services[s], options?.linkServices));
      }
    }
  };

  // ../../../services/dom/DOMElement.js
  var DOMElement = class extends HTMLElement {
    constructor() {
      super();
      __publicField(this, "template", (props, self = this) => {
        return `<div> Custom Fragment Props: ${JSON.stringify(props)} </div>`;
      });
      __publicField(this, "props", {});
      __publicField(this, "useShadow", false);
      __publicField(this, "styles");
      __publicField(this, "oncreate");
      __publicField(this, "onresize");
      __publicField(this, "ondelete");
      __publicField(this, "onchanged");
      __publicField(this, "renderonchanged", false);
      __publicField(this, "FRAGMENT");
      __publicField(this, "attachedShadow", false);
      __publicField(this, "obsAttributes", ["props", "options", "onchanged", "onresize", "ondelete", "oncreate", "template"]);
      __publicField(this, "delete", () => {
        this.remove();
        if (typeof this.ondelete === "function")
          this.ondelete(this.props);
      });
      __publicField(this, "render", (props = this.props) => {
        if (typeof this.template === "function")
          this.templateResult = this.template(props, this);
        else
          this.templateResult = this.template;
        const t = document.createElement("template");
        if (typeof this.templateResult === "string")
          t.innerHTML = this.templateResult;
        else if (this.templateResult instanceof HTMLElement) {
          if (this.templateResult.parentNode) {
            this.templateResult.parentNode.removeChild(this.templateResult);
          }
          t.appendChild(this.templateResult);
        }
        const fragment = t.content;
        if (this.FRAGMENT) {
          if (this.useShadow) {
            this.shadowRoot.removeChild(this.FRAGMENT);
          } else
            this.removeChild(this.FRAGMENT);
        }
        if (this.useShadow) {
          if (!this.attachedShadow)
            this.attachShadow({ mode: "open" });
          this.shadowRoot.prepend(fragment);
          this.FRAGMENT = this.shadowRoot.childNodes[0];
        } else
          this.prepend(fragment);
        this.FRAGMENT = this.childNodes[0];
        let rendered = new CustomEvent("rendered", { detail: { props: this.props, self: this } });
        this.dispatchEvent("rendered");
        if (this.oncreate)
          this.oncreate(this, props);
      });
      __publicField(this, "state", {
        pushToState: {},
        data: {},
        triggers: {},
        setState(updateObj) {
          Object.assign(this.pushToState, updateObj);
          if (Object.keys(this.triggers).length > 0) {
            for (const prop of Object.getOwnPropertyNames(this.triggers)) {
              if (this.pushToState[prop]) {
                this.data[prop] = this.pushToState[prop];
                delete this.pushToState[prop];
                this.triggers[prop].forEach((obj) => {
                  obj.onchanged(this.data[prop]);
                });
              }
            }
          }
          return this.pushToState;
        },
        subscribeTrigger(key, onchanged = (res2) => {
        }) {
          if (key) {
            if (!this.triggers[key]) {
              this.triggers[key] = [];
            }
            let l = this.triggers[key].length;
            this.triggers[key].push({ idx: l, onchanged });
            return this.triggers[key].length - 1;
          } else
            return void 0;
        },
        unsubscribeTrigger(key, sub) {
          let idx = void 0;
          let triggers = this.triggers[key];
          if (triggers) {
            if (!sub)
              delete this.triggers[key];
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
        subscribeTriggerOnce(key = void 0, onchanged = (value) => {
        }) {
          let sub;
          let changed = (value) => {
            onchanged(value);
            this.unsubscribeTrigger(key, sub);
          };
          sub = this.subscribeTrigger(key, changed);
        }
      });
    }
    get observedAttributes() {
      return this.obsAttributes;
    }
    get obsAttributes() {
      return this.obsAttributes;
    }
    set obsAttributes(att) {
      if (typeof att === "string") {
        this.obsAttributes.push(att);
      } else if (Array.isArray(att))
        this.obsAttributes = att;
    }
    static get tag() {
      return this.name.toLowerCase() + "-";
    }
    static addElement(tag = this.tag, cls = this, extend = void 0) {
      addCustomElement(cls, tag, extend);
    }
    attributeChangedCallback(name, old, val) {
      if (name === "onchanged") {
        let onchanged = val;
        if (typeof onchanged === "string")
          onchanged = parseFunctionFromText2(onchanged);
        if (typeof onchanged === "function") {
          this.onchanged = onchanged;
          this.state.data.props = this.props;
          this.state.unsubscribeTrigger("props");
          this.state.subscribeTrigger("props", this.onchanged);
          let changed = new CustomEvent("changed", { detail: { props: this.props, self: this } });
          this.state.subscribeTrigger("props", () => {
            this.dispatchEvent(changed);
          });
        }
      } else if (name === "onresize") {
        let onresize = val;
        if (typeof onresize === "string")
          onresize = parseFunctionFromText2(onresize);
        if (typeof onresize === "function") {
          if (this.ONRESIZE) {
            try {
              window.removeEventListener("resize", this.ONRESIZE);
            } catch (err) {
            }
          }
          this.ONRESIZE = (ev) => {
            this.onresize(this.props, this);
          };
          this.onresize = onresize;
          window.addEventListener("resize", this.ONRESIZE);
        }
      } else if (name === "ondelete") {
        let ondelete = val;
        if (typeof ondelete === "string")
          ondelete = parseFunctionFromText2(ondelete);
        if (typeof ondelete === "function") {
          this.ondelete = () => {
            if (this.ONRESIZE)
              window.removeEventListener("resize", this.ONRESIZE);
            this.state.unsubscribeTrigger("props");
            if (ondelete)
              ondelete(this.props, this);
          };
        }
      } else if (name === "oncreate") {
        let oncreate = val;
        if (typeof oncreate === "string")
          oncreate = parseFunctionFromText2(oncreate);
        if (typeof oncreate === "function") {
          this.oncreate = oncreate;
        }
      } else if (name === "renderonchanged") {
        let rpc = val;
        if (typeof this.renderonchanged === "number")
          this.unsubscribeTrigger(this.renderonchanged);
        if (typeof rpc === "string")
          rpc = parseFunctionFromText2(rpc);
        if (typeof rpc === "function") {
          this.renderonchanged = this.state.subscribeTrigger("props", (p) => {
            this.render(p);
            rpc(this, p);
          });
        } else if (rpc != false)
          this.renderonchanged = this.state.subscribeTrigger("props", this.render);
      } else if (name === "props") {
        let newProps = val;
        if (typeof newProps === "string")
          newProps = JSON.parse(newProps);
        Object.assign(this.props, newProps);
        this.state.setState({ props: this.props });
      } else if (name === "template") {
        let template = val;
        this.template = template;
        this.render(this.props);
        let created = new CustomEvent("created", { detail: { props: this.props } });
        this.dispatchEvent(created);
      } else {
        let parsed = val;
        if (name.includes("eval_")) {
          name = name.split("_");
          name.shift();
          name = name.join();
          parsed = parseFunctionFromText2(val);
        } else if (typeof val === "string") {
          try {
            parsed = JSON.parse(val);
          } catch (err) {
            parsed = val;
          }
        }
        this[name] = parsed;
        if (name !== "props")
          this.props[name] = parsed;
      }
    }
    connectedCallback() {
      let newProps = this.getAttribute("props");
      if (typeof newProps === "string")
        newProps = JSON.parse(newProps);
      Object.assign(this.props, newProps);
      this.state.setState({ props: this.props });
      Array.from(this.attributes).forEach((att) => {
        let name = att.name;
        let parsed = att.value;
        if (name.includes("eval_")) {
          name = name.split("_");
          name.shift();
          name = name.join();
          parsed = parseFunctionFromText2(att.value);
        } else if (typeof att.value === "string") {
          try {
            parsed = JSON.parse(att.value);
          } catch (err) {
            parsed = att.value;
          }
        }
        if (!this[name]) {
          Object.defineProperties(this, att, {
            value: parsed,
            writable: true,
            get() {
              return this[name];
            },
            set(val) {
              this.setAttribute(name, val);
            }
          });
        }
        this[name] = parsed;
        if (name !== "props")
          this.props[name] = parsed;
        this.obsAttributes.push(name);
      });
      let resizeevent = new CustomEvent("resized", { detail: { props: this.props, self: this } });
      let changed = new CustomEvent("changed", { detail: { props: this.props, self: this } });
      let deleted = new CustomEvent("deleted", { detail: { props: this.props, self: this } });
      let created = new CustomEvent("created", { detail: { props: this.props, self: this } });
      if (this.styles) {
        let elm = `
            <style>
                ${templateStr}
            </style>
            `;
        if (this.template.indexOf("<style")) {
          this.template.splice(this.template.indexOf("<style" + 7), this.template.indexOf("</style"), templateStr);
        } else {
          if (this.template.indexOf("<head")) {
            this.template.splice(this.template.indexOf("<head" + 6), 0, elm);
          } else
            this.template = elm + this.template;
        }
        this.useShadow = true;
      }
      this.render(this.props);
      this.dispatchEvent(created);
      this.state.subscribeTrigger("props", () => {
        this.dispatchEvent(changed);
      });
      if (typeof this.onresize === "function") {
        if (this.ONRESIZE) {
          try {
            window.removeEventListener("resize", this.ONRESIZE);
          } catch (err) {
          }
        }
        this.ONRESIZE = (ev) => {
          this.onresize(this, this.props);
          this.dispatchEvent(resizeevent);
        };
        window.addEventListener("resize", this.ONRESIZE);
      }
      if (typeof this.ondelete === "function") {
        let ondelete = this.ondelete;
        this.ondelete = (props = this.props) => {
          if (this.ONRESIZE)
            window.removeEventListener("resize", this.ONRESIZE);
          this.state.unsubscribeTrigger("props");
          this.dispatchEvent(deleted);
          ondelete(this, props);
        };
      }
      if (typeof this.onchanged === "function") {
        this.state.data.props = this.props;
        this.state.subscribeTrigger("props", this.onchanged);
      }
      if (this.renderonchanged) {
        let rpc = this.renderonchanged;
        if (typeof this.renderonchanged === "number")
          this.unsubscribeTrigger(this.renderonchanged);
        if (typeof rpc === "string")
          rpc = parseFunctionFromText2(rpc);
        if (typeof rpc === "function") {
          this.renderonchanged = this.state.subscribeTrigger("props", (p) => {
            this.render(p);
            rpc(this, p);
          });
        } else if (rpc !== false)
          this.renderonchanged = this.state.subscribeTrigger("props", this.render);
      }
    }
    get props() {
      return this.props;
    }
    set props(newProps = {}) {
      this.setAttribute("props", newProps);
    }
    get template() {
      return this.template;
    }
    set template(template) {
      this.setAttribute("template", template);
    }
    get render() {
      return this.render;
    }
    get delete() {
      return this.delete;
    }
    get state() {
      return this.state;
    }
    get onchanged() {
      return this.onchanged;
    }
    set onchanged(onchanged) {
      this.setAttribute("onchanged", onchanged);
    }
    get styles() {
      return this.styles;
    }
    set styles(templateStr2) {
      let elm = `
        <style>
            ${templateStr2}
        </style>
        `;
      if (this.template.indexOf("<style")) {
        this.template.splice(this.template.indexOf("<style" + 7), this.template.indexOf("</style"), templateStr2);
      } else {
        if (this.template.indexOf("<head")) {
          this.template.splice(this.template.indexOf("<head" + 6), 0, elm);
        } else
          this.template = elm + this.template;
      }
      if (this.querySelector("style")) {
        if (!this.useShadow) {
          this.useShadow = true;
          this.render();
        } else
          this.querySelector("style").innerHTML = templateStr2;
      } else {
        this.useShadow = true;
        this.render();
      }
    }
    get renderonchanged() {
      return this.renderonchanged;
    }
    set renderonchanged(onchanged) {
      this.setAttribute("renderonchanged", onchanged);
    }
    get onresize() {
      return this.props;
    }
    set onresize(onresize) {
      this.setAttribute("onresize", onresize);
    }
    get ondelete() {
      return this.props;
    }
    set ondelete(ondelete) {
      this.setAttribute("ondelete", ondelete);
    }
    get oncreate() {
      return this.oncreate;
    }
    set oncreate(oncreate) {
      this.setAttribute("oncreated", oncreate);
    }
  };
  function addCustomElement(cls, tag, extend = null) {
    try {
      if (extend) {
        if (tag)
          window.customElements.define(tag, cls, { extends: extend });
        else
          window.customElements.define(cls.name.toLowerCase() + "-", cls, { extends: extend });
      } else {
        if (tag)
          window.customElements.define(tag, cls);
        else
          window.customElements.define(cls.name.toLowerCase() + "-", cls);
      }
    } catch (err) {
    }
  }
  function parseFunctionFromText2(method) {
    let getFunctionBody = (methodString) => {
      return methodString.replace(/^\W*(function[^{]+\{([\s\S]*)\}|[^=]+=>[^{]*\{([\s\S]*)\}|[^=]+=>(.+))/i, "$2$3$4");
    };
    let getFunctionHead = (methodString) => {
      let startindex = methodString.indexOf(")");
      return methodString.slice(0, methodString.indexOf("{", startindex) + 1);
    };
    let newFuncHead = getFunctionHead(method);
    let newFuncBody = getFunctionBody(method);
    let newFunc;
    try {
      if (newFuncHead.includes("function ")) {
        let varName = newFuncHead.split("(")[1].split(")")[0];
        newFunc = new Function(varName, newFuncBody);
      } else {
        if (newFuncHead.substring(0, 6) === newFuncBody.substring(0, 6)) {
          let varName = newFuncHead.split("(")[1].split(")")[0];
          newFunc = new Function(varName, newFuncBody.substring(newFuncBody.indexOf("{") + 1, newFuncBody.length - 1));
        } else {
          try {
            newFunc = (0, eval)(newFuncHead + newFuncBody + "}");
          } catch (err) {
            newFunc = (0, eval)(method);
          }
        }
      }
    } catch (err) {
    }
    return newFunc;
  }

  // ../../../services/dom/DOM.service.ts
  var DOMService = class extends Graph {
    constructor(options, parentNode) {
      super(void 0, options.name, options.props);
      this.routes = {};
      this.loadDefaultRoutes = true;
      this.name = `dom${Math.floor(Math.random() * 1e15)}`;
      this.keepState = true;
      this.parentNode = document.body;
      this.elements = {};
      this.components = {};
      this.templates = {};
      this.addElement = (options, generateChildElementNodes = false) => {
        let elm = this.createElement(options);
        let oncreate = options.oncreate;
        delete options.oncreate;
        let node = new GraphNode({
          element: elm,
          operator: (node2, origin, props) => {
            if (typeof props === "object")
              for (const key in props) {
                if (node2.element) {
                  if (typeof node2.element[key] === "function" && typeof props[key] !== "function") {
                    if (Array.isArray(props[key]))
                      node2.element[key](...props[key]);
                    else
                      node2.element[key](props[key]);
                  } else if (key === "style") {
                    Object.assign(node2.element[key], props[key]);
                  } else
                    node2.element[key] = props[key];
                }
              }
            return props;
          },
          ...options
        }, void 0, this);
        let divs = Array.from(elm.querySelectorAll("*"));
        if (generateChildElementNodes) {
          divs = divs.map((d, i) => this.addElement({ element: d }));
        }
        this.elements[options.id] = { element: elm, node, parentNode: options.parentNode, divs };
        if (options.onresize) {
          let onresize = options.onresize;
          options.onresize = (ev) => {
            onresize(ev, elm, this.elements[options.id]);
          };
          window.addEventListener("resize", options.onresize);
        }
        if (!elm.parentNode) {
          setTimeout(() => {
            if (typeof options.parentNode === "object")
              options.parentNode.appendChild(elm);
            if (oncreate)
              oncreate(elm, this.elements[options.id]);
          }, 0.01);
        }
        return this.elements[options.id];
      };
      this.createElement = (options) => {
        let elm;
        if (options.element) {
          if (typeof options.element === "string") {
            elm = document.querySelector(options.element);
            if (!elm)
              elm = document.getElementById(options.element);
          } else
            elm = options.element;
        } else if (options.tagName)
          elm = document.createElement(options.tagName);
        else if (options.id && document.getElementById(options.id))
          elm = document.getElementById(options.id);
        if (!elm)
          return void 0;
        this.updateOptions(options, elm);
        return elm;
      };
      this.updateOptions = (options, element) => {
        if (!options.id)
          options.id = `${options.tagName ?? "element"}${Math.floor(Math.random() * 1e15)}`;
        if (!options.id && options.tag)
          options.id = options.tag;
        if (!options.tag && options.id)
          options.tag = options.id;
        if (!options.id)
          options.id = options.tagName;
        if (typeof options.parentNode === "string")
          options.parentNode = document.getElementById(options.parentNode);
        if (!options.parentNode) {
          if (!this.parentNode)
            this.parentNode = document.body;
          options.parentNode = this.parentNode;
        }
        element.id = options.id;
        if (options.style)
          Object.assign(element.style, options.style);
        if (options.innerHTML && element.innerHTML !== options.innerHTML)
          element.innerHTML = options.innerHTML;
        if (options.innerText && element.innerText !== options.innerText)
          element.innerText = options.innerText;
        if (options.attributes)
          Object.assign(element, options.attributes);
        return options;
      };
      this.addComponent = (options, generateChildElementNodes = true) => {
        if (options.oncreate) {
          let oncreate = options.oncreate;
          options.oncreate = (self) => {
            oncreate(self, options);
          };
        }
        if (options.onresize) {
          let onresize = options.onresize;
          options.onresize = (self) => {
            onresize(self, options);
          };
        }
        if (options.ondelete) {
          let ondelete = options.ondelete;
          options.ondelete = (self) => {
            ondelete(self, options);
          };
        }
        if (typeof options.renderonchanged === "function") {
          let renderonchanged = options.renderonchanged;
          options.renderonchanged = (self) => {
            renderonchanged(self, options);
          };
        }
        class CustomElement extends DOMElement {
          constructor() {
            super(...arguments);
            this.props = options.props;
            this.styles = options.styles;
            this.template = options.template;
            this.oncreate = options.oncreate;
            this.onresize = options.onresize;
            this.ondelete = options.ondelete;
            this.renderonchanged = options.renderonchanged;
          }
        }
        delete options.oncreate;
        if (!options.tagName)
          options.tagName = `custom-element${Math.random() * 1e15}`;
        CustomElement.addElement(options.tagName);
        let elm = document.createElement(options.tagName);
        let completeOptions = this.updateOptions(options, elm);
        this.templates[completeOptions.id] = completeOptions;
        let divs = Array.from(elm.querySelectorAll("*"));
        if (generateChildElementNodes) {
          divs = divs.map((d) => this.addElement({ element: d }));
        }
        let node = new GraphNode({
          element: elm,
          operator: (node2, origin, props) => {
            if (typeof props === "object")
              for (const key in props) {
                if (node2.element) {
                  if (typeof node2.element[key] === "function" && typeof props[key] !== "function") {
                    if (Array.isArray(props[key]))
                      node2.element[key](...props[key]);
                    else
                      node2.element[key](props[key]);
                  } else
                    node2.element[key] = props[key];
                }
              }
            return props;
          },
          ...completeOptions
        }, void 0, this);
        this.components[completeOptions.id] = {
          element: elm,
          class: CustomElement,
          node,
          divs,
          ...completeOptions
        };
        if (!elm.parentNode) {
          setTimeout(() => {
            if (typeof options.parentNode === "object")
              options.parentNode.appendChild(elm);
          }, 0.01);
        }
        return this.components[completeOptions.id];
      };
      this.addCanvasComponent = (options) => {
        if (!options.canvas) {
          options.template = `<canvas `;
          if (options.width)
            options.template += `width="${options.width}"`;
          if (options.height)
            options.template += `height="${options.height}"`;
          options.template += ` ></canvas>`;
        } else
          options.template = options.canvas;
        if (options.oncreate) {
          let oncreate = options.oncreate;
          options.oncreate = (self) => {
            oncreate(self, options);
          };
        }
        if (options.onresize) {
          let onresize = options.onresize;
          options.onresize = (self) => {
            onresize(self, options);
          };
        }
        if (options.ondelete) {
          let ondelete = options.ondelete;
          options.ondelete = (self) => {
            ondelete(self, options);
          };
        }
        if (typeof options.renderonchanged === "function") {
          let renderonchanged = options.renderonchanged;
          options.renderonchanged = (self) => {
            renderonchanged(self, options);
          };
        }
        class CustomElement extends DOMElement {
          constructor() {
            super(...arguments);
            this.props = options.props;
            this.styles = options.styles;
            this.template = options.template;
            this.oncreate = options.oncreate;
            this.onresize = options.onresize;
            this.ondelete = options.ondelete;
            this.renderonchanged = options.renderonchanged;
          }
        }
        delete options.oncreate;
        if (!options.tagName)
          options.tagName = `custom-element${Math.random() * 1e15}`;
        CustomElement.addElement(options.tagName);
        let elm = document.createElement(options.tagName);
        const completeOptions = this.updateOptions(options, elm);
        let animation = () => {
          if (this.components[completeOptions.id]?.animating) {
            this.components[completeOptions.id].draw(this.components[completeOptions.id].element, this.components[completeOptions.id]);
            requestAnimationFrame(animation);
          }
        };
        this.templates[completeOptions.id] = completeOptions;
        let node = new GraphNode({
          element: elm,
          operator: (node2, origin, props) => {
            if (typeof props === "object")
              for (const key in props) {
                if (node2.element) {
                  if (typeof node2.element[key] === "function" && typeof props[key] !== "function") {
                    if (Array.isArray(props[key]))
                      node2.element[key](...props[key]);
                    else
                      node2.element[key](props[key]);
                  } else
                    node2.element[key] = props[key];
                }
              }
            return props;
          },
          ...completeOptions
        }, void 0, this);
        let canvas = elm.querySelector("canvas");
        if (completeOptions.style)
          Object.assign(canvas.style, completeOptions.style);
        let context;
        if (typeof completeOptions.context === "object")
          context = options.context;
        else if (typeof completeOptions.context === "string")
          context = canvas.getContext(completeOptions.context);
        this.components[completeOptions.id] = {
          element: elm,
          class: CustomElement,
          template: completeOptions.template,
          canvas,
          node,
          ...completeOptions
        };
        this.components[completeOptions.id].context = context;
        elm.canvas = canvas;
        elm.context = context;
        node.canvas = canvas;
        node.context = context;
        if (!elm.parentNode) {
          setTimeout(() => {
            if (typeof options.parentNode === "object")
              options.parentNode.appendChild(elm);
          }, 0.01);
        }
        node.runAnimation(animation);
        return this.components[completeOptions.id];
      };
      this.load = (routes2, enumRoutes = true) => {
        if (!routes2 && !this.loadDefaultRoutes)
          return;
        let service;
        if (!(routes2 instanceof Graph) && routes2?.name) {
          if (routes2.module) {
            let mod = routes2;
            routes2 = {};
            Object.getOwnPropertyNames(routes2.module).forEach((prop) => {
              if (enumRoutes)
                routes2[mod.name + "/" + prop] = routes2.module[prop];
              else
                routes2[prop] = routes2.module[prop];
            });
          } else if (typeof routes2 === "function") {
            service = new routes2();
            service.load();
            routes2 = service.routes;
          }
        } else if (routes2 instanceof Graph && (routes2.routes || routes2.tree)) {
          service = routes2;
          if (routes2.routes)
            routes2 = routes2.routes;
          else if (routes2.tree)
            routes2 = routes2.tree;
        } else if (typeof routes2 === "object") {
          let name = routes2.constructor.name;
          if (name === "Object") {
            name = Object.prototype.toString.call(routes2);
            if (name)
              name = name.split(" ")[1];
            if (name)
              name = name.split("]")[0];
          }
          if (name && name !== "Object") {
            let module = routes2;
            routes2 = {};
            Object.getOwnPropertyNames(module).forEach((route) => {
              if (enumRoutes)
                routes2[name + "/" + route] = module[route];
              else
                routes2[route] = module[route];
            });
          }
        }
        if (service instanceof Graph && service.name) {
          routes2 = Object.assign({}, routes2);
          for (const prop in routes2) {
            let route = routes2[prop];
            delete routes2[prop];
            routes2[service.name + "/" + prop] = route;
          }
        }
        if (this.loadDefaultRoutes) {
          let rts = Object.assign({}, this.defaultRoutes);
          if (routes2) {
            Object.assign(rts, this.routes);
            routes2 = Object.assign(rts, routes2);
          } else
            routes2 = Object.assign(rts, this.routes);
          this.loadDefaultRoutes = false;
        }
        for (const tag in routes2) {
          let childrenIter = (route) => {
            if (typeof route?.children === "object") {
              for (const key in route.children) {
                if (typeof route.children[key] === "object") {
                  let rt = route.children[key];
                  if (!rt.parent)
                    rt.parent = tag;
                  if (rt.tag) {
                    routes2[rt.tag] = route.children[key];
                    childrenIter(routes2[rt.tag]);
                  } else if (rt.id) {
                    rt.tag = rt.id;
                    routes2[rt.tag] = route.children[key];
                    childrenIter(routes2[rt.tag]);
                  }
                }
              }
            }
          };
          childrenIter(routes2[tag]);
        }
        for (const route in routes2) {
          if (typeof routes2[route] === "object") {
            let r = routes2[route];
            if (typeof r === "object") {
              if (r.template) {
                if (!routes2[route].tag)
                  routes2[route].tag = route;
                this.addComponent(routes2[route]);
              } else if (r.context) {
                if (!routes2[route].tag)
                  routes2[route].tag = route;
                this.addCanvasComponent(routes2[route]);
              } else if (r.tagName || r.element) {
                if (!routes2[route].tag)
                  routes2[route].tag = route;
                this.addElement(routes2[route]);
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
                routes2[route].operator = r.post;
              } else if (!r.operator && typeof r.get == "function") {
                routes2[route].operator = r.get;
              }
            }
            if (this.routes[route]) {
              if (typeof this.routes[route] === "object")
                Object.assign(this.routes[route], routes2[route]);
              else
                this.routes[route] = routes2[route];
            } else
              this.routes[route] = routes2[route];
          } else if (this.routes[route]) {
            if (typeof this.routes[route] === "object")
              Object.assign(this.routes[route], routes2[route]);
            else
              this.routes[route] = routes2[route];
          } else
            this.routes[route] = routes2[route];
        }
        this.setTree(this.routes);
        for (const prop in this.routes) {
          if (this.routes[prop]?.aliases) {
            let aliases = this.routes[prop].aliases;
            aliases.forEach((a) => {
              if (service)
                routes2[service.name + "/" + a] = this.routes[prop];
              else
                routes2[a] = this.routes[prop];
            });
          }
        }
        return this.routes;
      };
      this.unload = (routes2 = this.routes) => {
        if (!routes2)
          return;
        let service;
        if (!(routes2 instanceof Service) && typeof routes2 === "function") {
          service = new Service();
          routes2 = service.routes;
        } else if (routes2 instanceof Service) {
          routes2 = routes2.routes;
        }
        for (const r in routes2) {
          delete this.routes[r];
          if (this.nodes.get(r))
            this.remove(r);
        }
        return this.routes;
      };
      this.handleMethod = (route, method, args, origin) => {
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
          return this.handleServiceMessage({ route, args, method, origin });
      };
      this.transmit = (...args) => {
        if (typeof args[0] === "object") {
          if (args[0].method) {
            return this.handleMethod(args[0].route, args[0].method, args[0].args);
          } else if (args[0].route) {
            return this.handleServiceMessage(args[0]);
          } else if (args[0].node) {
            return this.handleGraphNodeCall(args[0].node, args[0].args, args[0].origin);
          } else if (this.keepState) {
            if (args[0].route)
              this.setState({ [args[0].route]: args[0].args });
            if (args[0].node)
              this.setState({ [args[0].node]: args[0].args });
          }
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
            return this.handleGraphNodeCall(args[0].node, args[0].args, args[0].origin);
          } else if (this.keepState) {
            if (args[0].route)
              this.setState({ [args[0].route]: args[0].args });
            if (args[0].node)
              this.setState({ [args[0].node]: args[0].args });
          }
        } else
          return args;
      };
      this.pipe = (source, destination, endpoint, origin, method, callback) => {
        if (source instanceof GraphNode) {
          if (callback)
            return source.subscribe((res2) => {
              let mod = callback(res2);
              if (mod !== void 0)
                this.transmit({ route: destination, args: mod, origin, method });
              else
                this.transmit({ route: destination, args: res2, origin, method }, endpoint);
            });
          else
            return this.subscribe(source, (res2) => {
              this.transmit({ route: destination, args: res2, origin, method }, endpoint);
            });
        } else if (typeof source === "string")
          return this.subscribe(source, (res2) => {
            this.transmit({ route: destination, args: res2, origin, method }, endpoint);
          });
      };
      this.pipeOnce = (source, destination, endpoint, origin, method, callback) => {
        if (source instanceof GraphNode) {
          if (callback)
            return source.state.subscribeTriggerOnce(source.tag, (res2) => {
              let mod = callback(res2);
              if (mod !== void 0)
                this.transmit({ route: destination, args: mod, origin, method });
              else
                this.transmit({ route: destination, args: res2, origin, method }, endpoint);
            });
          else
            return this.state.subscribeTriggerOnce(source.tag, (res2) => {
              this.transmit({ route: destination, args: res2, origin, method }, endpoint);
            });
        } else if (typeof source === "string")
          return this.state.subscribeTriggerOnce(source, (res2) => {
            this.transmit({ route: destination, args: res2, origin, method }, endpoint);
          });
      };
      this.terminate = (element) => {
        if (typeof element === "object") {
          if (element.animating)
            element.animating = false;
          if (element.element)
            element = element.element;
        } else if (typeof element === "string" && this.components[element]) {
          if (this.components[element].node.isAnimating)
            this.components[element].node.stopNode();
          if (this.components[element].divs)
            this.components[element].divs.forEach((d) => this.terminate(d));
          let temp = this.components[element].element;
          delete this.components[element];
          element = temp;
        } else if (typeof element === "string" && this.elements[element]) {
          if (this.elements[element].divs)
            this.elements[element].divs.forEach((d) => this.terminate(d));
          let temp = this.elements[element].element;
          if (this.elements[element].onresize)
            window.removeEventListener("resize", this.elements[element].onresize);
          if (this.elements[element].ondelete)
            this.elements[element].ondelete(temp, this.elements[element]);
          delete this.elements[element];
          element = temp;
        }
        if (element) {
          if (this.nodes.get(element.id)) {
            this.removeTree(element.id);
          }
          if (element instanceof DOMElement)
            element.delete();
          else if (element?.parentNode) {
            element.parentNode.removeChild(element);
          }
          return true;
        }
        return false;
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
        transmit: this.transmit,
        receive: this.receive,
        load: this.load,
        unload: this.unload,
        pipe: this.pipe,
        terminate: this.terminate,
        run: this.run,
        _run: this._run,
        subscribe: this.subscribe,
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
        handleGraphNodeCall: this.handleGraphNodeCall,
        addElement: this.addElement,
        addComponent: this.addComponent,
        addCanvasComponent: this.addCanvasComponent
      };
      if ("loadDefaultRoutes" in options)
        this.loadDefaultRoutes = options.loadDefaultRoutes;
      if (options.name)
        this.name = options.name;
      if (parentNode instanceof HTMLElement)
        this.parentNode = parentNode;
      else if (options.parentNode instanceof HTMLElement)
        this.parentNode = parentNode;
      if (Array.isArray(options.routes)) {
        options.routes.forEach((r) => {
          this.load(r);
        });
      } else if (options.routes)
        this.load(options.routes);
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
        if (message.origin) {
          if (Array.isArray(message.args))
            return this._run(call, message.origin, ...message.args);
          else
            return this._run(call, message.origin, message.args);
        } else {
          if (Array.isArray(message.args))
            return this.run(call, ...message.args);
          else
            return this.run(call, message.args);
        }
      } else
        return message;
    }
    handleGraphNodeCall(route, args, origin) {
      if (!route)
        return args;
      if (args?.args) {
        this.handleServiceMessage(args);
      } else if (origin) {
        if (Array.isArray(args))
          return this._run(route, origin, ...args);
        else
          return this._run(route, origin, args);
      } else if (Array.isArray(args))
        return this.run(route, ...args);
      else
        return this.run(route, args);
    }
    isTypedArray(x) {
      return ArrayBuffer.isView(x) && Object.prototype.toString.call(x) !== "[object DataView]";
    }
  };

  // ../tree.ts
  var operators = {
    add: (a, b = 1) => {
      console.log("add", a, b);
      return a + b;
    },
    subtract: (a, b = 1) => {
      console.log("sub", a, b);
      return a - b;
    }
  };
  var routes = {
    subtract: {
      operator: operators.subtract
    }
  };
  var tree = {
    add: {
      children: {
        "subtract": true
      },
      operator: operators.add
    },
    nested: new DOMService({
      name: "nested",
      routes,
      loadDefaultRoutes: false
    })
  };
  var expected = (input2 = []) => operators.subtract(operators.add(input2[0], input2[1]));

  // index.ts
  var input = 3;
  var router = new Router([tree], { loadDefaultRoutes: false });
  router.subscribe("subtract", (res2) => document.body.innerHTML = `
    <h2>Router</h2>
    <p><b>Result:</b> ${res2}</p>
    <p><b>Expected:</b> ${expected([input])}</p>
    <p><b>Test Passed:</b> ${res2 == expected([input])}</p>
`);
  console.log("Router", router);
  var res = router.run("add", input);
  console.log("Router res", res);
})();
