(() => {
  // ../../../Graph.ts
  function getFnParamNames(fn) {
    var fstr = fn.toString();
    return fstr.match(/\(.*?\)/)[0].replace(/[()]/gi, "").replace(/\s/gi, "").split(",");
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
      this.attributes = /* @__PURE__ */ new Set();
      this.state = state;
      this.isLooping = false;
      this.isAnimating = false;
      this.looper = void 0;
      this.animation = void 0;
      this.forward = true;
      this.backward = false;
      this.runSync = false;
      this.firstRun = true;
      this.operator = (self = this, origin, ...args) => {
        return args;
      };
      this.runOp = (node = this, origin = this, ...args) => {
        let result = node.operator(node, origin, ...args);
        if (result instanceof Promise) {
          result.then((res) => {
            if (res !== void 0)
              this.setState({ [node.tag]: res });
            return res;
          });
        } else {
          if (result !== void 0)
            this.setState({ [node.tag]: result });
        }
        return result;
      };
      this.run = (...args) => {
        return this._run(this, void 0, ...args);
      };
      this.runAsync = (...args) => {
        return new Promise((res, rej) => {
          res(this._run(this, void 0, ...args));
        });
      };
      this._run = (node = this, origin, ...args) => {
        if (!(node instanceof GraphNode)) {
          if (!node)
            return void 0;
          if (Object.getPrototypeOf(node) === String.prototype) {
            let fnd = void 0;
            if (this.graph)
              fnd = this.graph.nodes.get(node);
            if (!fnd)
              fnd = this.nodes.get(node);
            node = fnd;
          }
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
          let res = node.runOp(node, origin, ...args);
          return res;
        }
        return new Promise(async (resolve) => {
          if (node) {
            let run = (node2, tick = 0, ...input) => {
              return new Promise(async (r) => {
                tick++;
                let res = await node2.runOp(node2, origin, ...input);
                if (node2.repeat) {
                  while (tick < node2.repeat) {
                    if (node2.delay) {
                      setTimeout(async () => {
                        r(await run(node2, tick, ...input));
                      }, node2.delay);
                      break;
                    } else if (node2.frame && window?.requestAnimationFrame) {
                      requestAnimationFrame(async () => {
                        r(await run(node2, tick, ...input));
                      });
                      break;
                    } else
                      res = await node2.runOp(node2, origin, ...input);
                    tick++;
                  }
                  if (tick === node2.repeat) {
                    r(res);
                    return;
                  }
                } else if (node2.recursive) {
                  while (tick < node2.recursive) {
                    if (node2.delay) {
                      setTimeout(async () => {
                        r(await run(node2, tick, ...res));
                      }, node2.delay);
                      break;
                    } else if (node2.frame && window?.requestAnimationFrame) {
                      requestAnimationFrame(async () => {
                        r(await run(node2, tick, ...res));
                      });
                      break;
                    } else
                      res = await node2.runOp(node2, origin, ...res);
                    tick++;
                  }
                  if (tick === node2.recursive) {
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
              let res = await run(node, void 0, ...args);
              if (res !== void 0) {
                if (node.backward && node.parent?._run) {
                  if (Array.isArray(res))
                    await this.runParent(node, ...res);
                  else
                    await this.runParent(node, res);
                }
                if (node.children && node.forward) {
                  if (Array.isArray(res))
                    await this.runChildren(node, ...res);
                  else
                    await this.runChildren(node, res);
                }
                if (node.branch) {
                  this.runBranch(node, res);
                }
              }
              return res;
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
          if (node.parent?.run)
            await node.parent._run(node.parent, this, ...args);
        }
      };
      this.runChildren = async (node, ...args) => {
        if (Array.isArray(node.children)) {
          for (let i = 0; i < node.children.length; i++) {
            if (Object.getPrototypeOf(node.children[i]) === String.prototype) {
              if (node.graph && node.graph?.get(node.children[i])) {
                node.children[i] = node.graph.get(node.children[i]);
                if (!node.nodes.get(node.children[i].tag))
                  node.nodes.set(node.children[i].tag, node.children[i]);
              }
              if (!node.children[i] && node.nodes.get(node.children[i]))
                node.children[i] = node.nodes.get(node.children[i]);
            }
            if (node.children[i]?.runOp)
              await node.children[i]._run(node.children[i], node, ...args);
          }
        } else if (node.children) {
          if (Object.getPrototypeOf(node.children) === String.prototype) {
            if (node.graph && node.graph?.get(node.children)) {
              node.children = node.graph.get(node.children);
              if (!node.nodes.get(node.children.tag))
                node.nodes.set(node.children.tag, node.children);
            }
            if (!node.children && node.nodes.get(node.children))
              node.children = node.nodes.get(node.children);
          }
          if (node.children?.runOp)
            await node.children._run(node.children, node, ...args);
        }
      };
      this.runBranch = async (node, output) => {
        if (node.branch) {
          let keys = Object.keys(node.branch);
          await Promise.all(keys.map(async (k) => {
            if (output instanceof Object) {
              if (node.branch[k].if instanceof Object)
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
                    node.branch[k].then = node.graph.nodes.get(node.branch[k].then);
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
              let result = this.animation(node, origin, ...args);
              if (result instanceof Promise) {
                result = await result;
              }
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
              let result = node.looper(node, origin, ...args);
              if (result instanceof Promise) {
                result = await result;
              }
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
      this.setOperator = (operator) => {
        this.operator = operator;
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
        if (this.graph)
          this.graph.nodes.set(node.tag, node);
        return node;
      };
      this.remove = (node) => {
        if (typeof node === "string")
          node = this.nodes.get(node);
        if (node instanceof GraphNode) {
          this.nodes.delete(node.tag);
          if (this.graph)
            this.graph.nodes.delete(node.tag);
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
          this.children = [];
        if (!Array.isArray(this.children)) {
          this.children = [children];
          if (typeof children === "object" && children.tag) {
            this.nodes.set(children.tag, children);
            if (this.graph)
              this.graph.nodes.set(children.tag, children);
          }
        } else if (Array.isArray(children)) {
          this.children.push(...children);
          children.forEach((c) => {
            if (typeof c === "object" && c.tag) {
              this.nodes.set(c.tag, c);
              if (this.graph)
                this.graph.nodes.set(c.tag, c);
            }
          });
        } else {
          this.children.push(children);
          if (typeof children === "object" && children.tag) {
            this.nodes.set(children.tag, children);
            if (this.graph)
              this.graph.nodes.set(children.tag, children);
          }
        }
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
        if (Array.isArray(this.children)) {
          if (idx) {
            if (Object.getPrototypeOf(this.children[idx]) === String.prototype) {
              if (this.graph && this.graph.get(this.children[idx])) {
                this.children[idx] = this.graph.get(this.children[idx]);
                if (!this.nodes.get(this.children[idx].tag))
                  this.nodes.set(this.children[idx].tag, this.children[idx]);
              }
              if (!this.children[idx] && this.nodes.get(this.children[idx]))
                this.children[idx] = this.nodes.get(this.children[idx]);
            }
            if (this.children[idx]?.runOp)
              result = this.children[idx].runOp(this.children[idx], origin, ...args);
          } else {
            result = [];
            for (let i = 0; i < this.children.length; i++) {
              if (Object.getPrototypeOf(this.children[i]) === String.prototype) {
                if (this.graph && this.graph.get(this.children[i])) {
                  this.children[i] = this.graph.get(this.children[i]);
                  if (!this.nodes.get(this.children[i].tag))
                    this.nodes.set(this.children[i].tag, this.children[i]);
                }
                if (!this.children[i] && this.nodes.get(this.children[i]))
                  this.children[i] = this.nodes.get(this.children[i]);
              }
              if (this.children[i]?.runOp)
                result.push(this.children[i].runOp(this.children[i], origin, ...args));
            }
          }
        } else if (this.children) {
          if (Object.getPrototypeOf(this.children) === String.prototype) {
            if (this.graph && this.graph.get(this.children)) {
              this.children = this.graph.get(this.children);
              if (!this.nodes.get(this.children.tag))
                this.nodes.set(this.children.tag, this.children);
            }
            if (!this.children && this.nodes.get(this.children))
              this.children = this.nodes.get(this.children);
          }
          result = this.children.runOp(this.children, origin, ...args);
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
          if (Object.getPrototypeOf(node) === String.prototype)
            node = this.nodes.get(node);
        }
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
            recursivelyRemove(node);
            if (this.graph)
              this.graph.nodes.removeTree(node);
          }
        }
      };
      this.convertChildrenToNodes = (n) => {
        if (n?.children instanceof GraphNode) {
          if (!this.graph?.nodes.get(n.tag))
            this.graph.nodes.set(n.tag, n);
          if (!this.nodes.get(n.tag))
            this.nodes.set(n.tag, n);
        } else if (Array.isArray(n.children)) {
          for (let i = 0; i < n.children.length; i++) {
            if (n.children[i] instanceof GraphNode) {
              if (!this.graph?.nodes.get(n.children[i].tag))
                this.graph.nodes.set(n.children[i].tag, n.children[i]);
              if (!this.nodes.get(n.children[i].tag))
                this.nodes.set(n.children[i].tag, n.children[i]);
              continue;
            } else if (typeof n.children[i] === "object" || typeof n.children[i] === "function") {
              n.children[i] = new GraphNode(n.children[i], n, this.graph);
              this.nodes.set(n.children[i].tag, n.children[i]);
              this.convertChildrenToNodes(n.children[i]);
            } else if (typeof n.children[i] === "string") {
              if (this.graph && this.graph.get(n.children[i])) {
                n.children[i] = this.graph.get(n.children[i]);
                if (!this.nodes.get(n.children[i].tag))
                  this.nodes.set(n.children[i].tag, n.children[i]);
              }
              if (!n.children[i] && this.nodes.get(n.children[i]))
                n.children[i] = this.nodes.get(n.children[i]);
            }
          }
        } else if (typeof n.children === "object" || typeof n.children === "function") {
          n.children = new GraphNode(n.children, n, this.graph);
          this.nodes.set(n.children.tag, n.children);
          this.convertChildrenToNodes(n.children);
        } else if (typeof n.children === "string") {
          if (this.graph && this.graph.get(n.children)) {
            n.children = this.graph.get(n.children);
            if (!this.nodes.get(n.children.tag))
              this.nodes.set(n.children.tag, n.children);
          }
          if (!n.children && this.nodes.get(n.children))
            n.children = this.nodes.get(n.children);
        }
        return n.children;
      };
      this.get = (tag) => {
        return this.nodes.get(tag);
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
        return this.state.subscribeTrigger(this.tag, (res) => {
          node._run(node, this, res);
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
          if (node.children) {
            if (Array.isArray(node.children)) {
              node.children = node.children.map((c) => {
                if (typeof c === "string")
                  return c;
                if (nodesPrinted.includes(c.tag))
                  return c.tag;
                else if (!printChildren) {
                  return c.tag;
                } else
                  return c.print(c, printChildren, nodesPrinted);
              });
            } else if (typeof node.children === "object") {
              if (!printChildren) {
                jsonToPrint.children = [node.children.tag];
              }
              if (nodesPrinted.includes(node.children.tag))
                jsonToPrint.children = [node.children.tag];
              else
                jsonToPrint.children = [node.children.print(node.children, printChildren, nodesPrinted)];
            } else if (typeof node.children === "string")
              jsonToPrint.children = [node.children];
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
      if (typeof properties === "function") {
        properties = { operator: properties };
      }
      if (typeof properties === "object") {
        if (properties.tag) {
          if (graph?.nodes) {
            let hasnode = graph.nodes.get(properties.tag);
            if (hasnode)
              return hasnode;
          }
          if (parentNode?.nodes) {
            let hasnode = parentNode.nodes.get(properties.tag);
            if (hasnode)
              return hasnode;
          }
        }
        if (properties?.operator) {
          let params = getFnParamNames(properties.operator);
          if (!(params[0] == "self" || params[0] == "node" || params[1] == "origin" || params[1] == "parent" || params[1] == "graph" || params[1] == "router")) {
            let fn = properties.operator;
            properties.operator = (self, origin, ...args) => {
              return fn(...args);
            };
          }
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
        this.parent = parentNode;
        this.graph = graph;
        if (graph) {
          graph.nNodes++;
          graph.nodes.set(this.tag, this);
        }
        if (this.children)
          this.convertChildrenToNodes(this);
      } else
        return properties;
    }
  };
  var Graph = class {
    constructor(tree, tag) {
      this.nNodes = 0;
      this.nodes = /* @__PURE__ */ new Map();
      this.state = state;
      this.tree = {};
      this.add = (node = {}) => {
        let props = node;
        if (!(node instanceof GraphNode))
          node = new GraphNode(props, void 0, this);
        this.tree[node.tag] = props;
        return node;
      };
      this.setTree = (tree = this.tree) => {
        if (!tree)
          return;
        for (const node in tree) {
          if (!this.nodes.get(node)) {
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
              this.add({ tag: node, operator: (self, origin, ...args) => {
                return tree[node];
              } });
            }
          }
        }
      };
      this.get = (tag) => {
        return this.nodes.get(tag);
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
          return new Promise((res, rej) => {
            res(node._run(node, this, ...args));
          });
        else
          return new Promise((res, rej) => {
            res(void 0);
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
            recursivelyRemove(node);
          }
        }
      };
      this.remove = (node) => {
        if (typeof node === "string")
          node = this.nodes.get(node);
        if (node?.tag) {
          node.stopNode();
          if (node?.tag)
            this.nodes.delete(node.tag);
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
        if (typeof node !== "string")
          node = node.tag;
        if (node instanceof GraphNode) {
          return node.subscribe(callback);
        } else
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
        return this.state.subscribeTrigger(tag, (res) => {
          this.run(outputNode, inputNode, ...res);
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
      this.tag = tag ? tag : `graph${Math.floor(Math.random() * 1e11)}`;
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
                for (const p2 in value[prop]) {
                  if (Array.isArray(value[prop][p2])) {
                    if (value[prop][p2].length > 20)
                      obj[prop][p2] = value[prop][p2].slice(value[prop][p2].length - 20);
                    else
                      obj[prop][p2] = value[prop][p2];
                  } else {
                    if (value[prop][p2] != null) {
                      let con = value[prop][p2].constructor.name;
                      if (con.includes("Set")) {
                        obj[prop][p2] = Array.from(value[prop][p2]);
                      } else if (con !== "Number" && con !== "String" && con !== "Boolean") {
                        obj[prop][p2] = "instanceof_" + con;
                      } else {
                        obj[prop][p2] = value[prop][p2];
                      }
                    } else {
                      obj[prop][p2] = value[prop][p2];
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

  // ../../services/Service.ts
  var Service = class extends Graph {
    constructor(routes, name) {
      super(void 0, name);
      this.routes = {};
      this.firstLoad = true;
      this.name = `service${Math.floor(Math.random() * 1e14)}`;
      this.keepState = true;
      this.load = (routes) => {
        if (!routes && !this.firstLoad)
          return;
        let service;
        if (!(routes instanceof Service) && routes?.name) {
          if (routes.module) {
            let mod = routes;
            routes = {};
            Object.getOwnPropertyNames(routes.module).forEach((prop) => {
              routes[mod.name + "/" + prop] = routes.module[prop];
            });
          } else {
            service = new routes();
            service.load();
            routes = service.routes;
          }
        } else if (routes instanceof Service) {
          service = routes;
          routes = routes.routes;
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
              routes[name + "/" + route] = module[route];
            });
          }
        }
        if (service instanceof Service) {
          routes = Object.assign({}, routes);
          for (const prop in routes) {
            let route = routes[prop];
            delete routes[prop];
            routes[service.name + "/" + prop] = route;
          }
        }
        if (this.firstLoad) {
          let rts = Object.assign({}, this.defaultRoutes);
          if (routes) {
            Object.assign(rts, this.routes);
            routes = Object.assign(rts, routes);
          } else
            routes = Object.assign(rts, this.routes);
          this.firstLoad = false;
        }
        for (const route in routes) {
          if (typeof routes[route] === "object") {
            let r = routes[route];
            for (const prop in r) {
              r[prop.toLowerCase()] = r[prop];
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
              routes[route].operator = r.post;
            } else if (!r.operator && typeof r.get == "function") {
              routes[route].operator = r.get;
            }
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
        this.setTree(this.routes);
        for (const prop in this.routes) {
          if (this.routes[prop]?.aliases) {
            let aliases = this.routes[prop].aliases;
            aliases.forEach((a) => {
              if (service)
                routes[service.name + "/" + a] = this.routes[prop];
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
            return this.routes[route][m];
          } else
            return this.routes[route][m](args);
        } else
          return this.handleServiceMessage({ route, args, method, origin });
      };
      this.transmit = (...args) => {
        if (args[0] instanceof Object) {
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
          if (Object.getPrototypeOf(args[0]) === String.prototype) {
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
        if (args[0] instanceof Object) {
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
            return source.subscribe((res) => {
              let mod = callback(res);
              if (mod !== void 0)
                this.transmit({ route: destination, args: mod, origin, method });
              else
                this.transmit({ route: destination, args: res, origin, method }, endpoint);
            });
          else
            return this.subscribe(source, (res) => {
              this.transmit({ route: destination, args: res, origin, method }, endpoint);
            });
        } else if (typeof source === "string")
          return this.subscribe(source, (res) => {
            this.transmit({ route: destination, args: res, origin, method }, endpoint);
          });
      };
      this.pipeOnce = (source, destination, endpoint, origin, method, callback) => {
        if (source instanceof GraphNode) {
          if (callback)
            return source.state.subscribeTriggerOnce(source.tag, (res) => {
              let mod = callback(res);
              if (mod !== void 0)
                this.transmit({ route: destination, args: mod, origin, method });
              else
                this.transmit({ route: destination, args: res, origin, method }, endpoint);
            });
          else
            return this.state.subscribeTriggerOnce(source.tag, (res) => {
              this.transmit({ route: destination, args: res, origin, method }, endpoint);
            });
        } else if (typeof source === "string")
          return this.state.subscribeTriggerOnce(source, (res) => {
            this.transmit({ route: destination, args: res, origin, method }, endpoint);
          });
      };
      this.terminate = (...args) => {
        this.nodes.forEach((n) => {
          n.stopNode();
        });
      };
      this.recursivelyAssign = (target, obj) => {
        for (const key in obj) {
          if (obj[key] instanceof Object) {
            if (target[key] instanceof Object)
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
          if (source instanceof Object) {
            Object.assign(this, source);
            return true;
          }
          return false;
        },
        recursivelyAssign: (source) => {
          if (source instanceof Object) {
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
      if (name)
        this.name = name;
      if (routes)
        this.load(routes);
    }
    handleServiceMessage(message) {
      let call;
      if (message instanceof Object) {
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

  // ../../routers/Router.ts
  var Router = class {
    constructor(services) {
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
      this.load = (service) => {
        if (!(service instanceof Service) && typeof service === "function") {
          service = new service(void 0, service.name);
          service.load();
        } else if (!service)
          return;
        if (service instanceof Service) {
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
        this.service.load(service);
        for (const name in this.services) {
          this.service.nodes.forEach((n) => {
            if (this.services[name]?.nodes) {
              if (!this.services[name].nodes.get(n.tag)) {
                this.services[name].nodes.set(n.tag, n);
              }
            }
          });
        }
        return this.services[service.name];
      };
      this.pipe = (source, destination, transmitter, origin, method, callback) => {
        if (!transmitter && source && destination) {
          if (callback)
            return this.subscribe(source, (res) => {
              let mod = callback(res);
              if (mod)
                res = mod;
              this.run(destination, res);
            });
          return this.subscribe(source, (res) => {
            this.run(destination, res);
          });
        }
        if (transmitter) {
          if (transmitter === "sockets")
            transmitter = "wss";
          const radio = this.services[transmitter];
          if (radio) {
            if (callback) {
              return this.subscribe(source, (res) => {
                let mod = callback(res);
                if (mod)
                  res = mod;
                radio.transmit({ route: destination, args: res, origin, method });
              });
            } else
              return this.subscribe(source, (res) => {
                radio.transmit({ route: destination, args: res, origin, method });
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
            return this.state.subscribeTriggerOnce(source, (res) => {
              let mod = callback(res);
              if (mod)
                res = mod;
              this.run(destination, res);
            });
          return this.state.subscribeTriggerOnce(source, (res) => {
            this.run(destination, res);
          });
        }
        if (transmitter) {
          if (transmitter === "sockets")
            transmitter = "wss";
          const radio = this.services[transmitter];
          if (radio) {
            if (callback) {
              return this.state.subscribeTriggerOnce(source, (res) => {
                let mod = callback(res);
                if (mod)
                  res = mod;
                radio.transmit({ route: destination, args: res, origin, method });
              });
            } else
              return this.state.subscribeTriggerOnce(source, (res) => {
                radio.transmit({ route: destination, args: res, origin, method });
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
        if (connections instanceof Object) {
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
            for (const p2 in prop) {
              if (Array.isArray(prop[p2])) {
                if (typeof setting === "number")
                  setting = { [p2]: { lastRead: void 0 } };
                else if (!setting[p2])
                  setting[p2] = { lastRead: void 0 };
                if (prop[p2].length !== setting[p2].lastRead) {
                  result[p2] = prop[p2].slice(setting[p2].lastRead);
                  setting[p2].lastRead = prop[p2].length;
                }
              } else {
                if (typeof setting === "number")
                  setting = { [p2]: { lastRead: void 0 } };
                else if (!setting[p2])
                  setting[p2] = { lastRead: void 0 };
                if (setting[p2].lastRead !== prop[p2]) {
                  result[p2] = prop[p2];
                  setting[p2].lastRead = prop[p2];
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
            for (const p2 in prop) {
              if (Array.isArray(prop[p2])) {
                if (typeof setting === "number")
                  setting = { [p2]: { lastRead: void 0 } };
                else if (!setting[p2])
                  setting[p2] = { lastRead: void 0 };
                if (prop[p2].length !== setting[p2].lastRead) {
                  result[p2] = prop[p2][prop[p2].length - 1];
                  setting[p2].lastRead = prop[p2].length;
                }
              } else {
                if (typeof setting === "number")
                  setting = { [p2]: { lastRead: void 0 } };
                else if (!setting[p2])
                  setting[p2] = { lastRead: void 0 };
                if (setting[p2].lastRead !== prop[p2]) {
                  result[p2] = prop[p2];
                  setting[p2].lastRead = prop[p2];
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
      this.load(this.defaultRoutes);
      if (this.routes) {
        if (Object.keys(this.routes).length > 0)
          this.load(this.routes);
      }
      if (Array.isArray(services)) {
        services.forEach((s) => this.load(s));
      } else if (typeof services === "object") {
        Object.keys(services).forEach((s) => this.load(services[s]));
      }
    }
  };

  // ../../routers/users/User.router.ts
  var UserRouter = class extends Router {
    constructor(services) {
      super(services);
      this.users = {};
      this.sessions = {
        private: {},
        shared: {}
      };
      this.runAs = (node, userId, ...args) => {
        if (userId instanceof Object)
          userId = userId._id;
        return this._run(node, userId, ...args);
      };
      this.pipeAs = (source, destination, transmitter, userId, method, callback) => {
        if (typeof userId === "object")
          userId = userId._id;
        return this.pipe(source, destination, transmitter, userId, method, callback);
      };
      this._initConnections = (connections) => {
        if (connections.sockets && this.services.wss) {
          for (const address in connections.sockets) {
            if (connections.sockets[address]._id) {
              if (this.services.wss.servers) {
                for (const addr in this.services.wss.servers) {
                  for (const _id in this.services.wss.servers[addr].clients) {
                    if (_id === connections.sockets[address]._id) {
                      connections.sockets[address] = { socket: this.services.wss.servers[addr].clients[_id], _id, address };
                      break;
                    }
                  }
                }
              }
              if (!connections.sockets[address].socket) {
                for (const s in this.services.wss.sockets) {
                  if (this.services.wss.sockets[s]._id === connections.sockets[address]._id) {
                    connections.sockets[address] = this.services.wss.sockets[address];
                    break;
                  }
                }
              }
            }
            if (!connections.sockets[address].socket) {
              connections.sockets[address] = this.run("wss/openWS", connections.sockets[address]);
            }
            if (connections.onmessage)
              connections.sockets[address].socket.addEventListener("message", connections.onmessage);
            if (connections.onclose)
              connections.sockets[address].socket.addEventListener("close", connections.onclose);
          }
        }
        if (connections.wss && this.services.wss) {
          for (const address in connections.wss) {
            if (connections.wss[address]._id) {
              for (const s in this.services.wss.servers) {
                if (this.services.wss.servers[s]._id === connections.server[address]._id) {
                  connections.wss[address] = this.services.wss.server[address];
                  break;
                }
              }
            }
            if (!connections.wss[address].wss) {
              connections.wss[address] = this.run("wss/openWSS", connections.wss[address]);
            }
            if (connections.onmessage)
              connections.wss[address].wss.addEventListener("message", connections.onmessage);
            if (connections.onclose)
              connections.wss[address].wss.addEventListener("close", connections.onclose);
          }
        }
        if (connections.eventsources && this.services.sse) {
          for (const path in connections.eventsources) {
            if (connections.eventsources[path]._id) {
              for (const s in this.services.sse.eventsources) {
                if (this.services.sse.eventsources[s]._id === connections.eventsources[path]._id) {
                  connections.eventsources[path] = this.services.sse.eventsources[s];
                  break;
                } else if (this.services.sse.eventsources[s].sessions?.[connections.eventsources[path]._id]) {
                  connections.eventsources[path] = { session: this.services.sse.eventsources[s].sessions[connections.eventsources[path]._id], _id: path };
                  break;
                } else if (this.services.sse.eventsources[s].session?.[connections.eventsources[path]._id]) {
                  connections.eventsources[path] = this.services.sse.eventsources[s];
                  break;
                }
              }
            }
            if (!connections.eventsources[path].source && !connections.eventsources[path].sessions && !connections.eventsources[path].session) {
              connections.eventsources[path] = this.run("sse/openSSE", connections.eventsources[path]);
            }
            if (connections.eventsources[path].source) {
              if (connections.onmessage)
                connections.eventsources[path].source.addEventListener("message", connections.onmessage);
              if (connections.onclose)
                connections.eventsources[path].source.addEventListener("close", connections.onclose);
            }
          }
        }
        if (connections.servers && this.services.http) {
          for (const address in connections.servers) {
            if (!connections.servers[address].server) {
              connections.servers[address] = this.run("http/setupServer", connections.servers[address]);
            }
            if (connections.onmessage)
              this.subscribe(address, connections.onmessage);
          }
        }
        if (connections.webrtc && this.services.webrtc) {
          for (const _id in connections.webrtc) {
            if (connections.webrtc[_id].rtc) {
              let channel = connections.webrtc[_id].channels.data;
              if (!channel)
                channel = connections.webrtc[_id].channels[Object.keys(connections.webrtc[_id].channels)[0]];
              if (channel)
                channel.addEventListener("message", connections.onmessage);
            }
          }
        }
        if (connections.sessions && connections._id) {
          for (const s in connections.sessions) {
            if (typeof connections.sessions[s] === "string")
              connections.sessions[s] = this.joinSession(connections.sessions[s], connections._id);
            else if (typeof connections.sessions[s] === "object")
              connections.sessions[s] = this.joinSession(s, connections._id, connections.sessions[s]);
          }
        }
      };
      this.addUser = async (user, timeout = 5e3) => {
        if (!user)
          user = {};
        if (!user._id)
          user._id = `user${Math.floor(Math.random() * 1e15)}`;
        user.tag = user._id;
        if (typeof user === "object") {
          if (!user.onmessage) {
            user.onmessage = (message) => {
              this.setState({ [user.tag]: message });
            };
          }
          if (!user.onclose)
            user.onclose = () => {
              this.removeUser(user._id);
            };
          user.operator = user.onmessage;
          if (!user.send) {
            user.send = (message, channel) => {
              if (!this.users[user._id])
                return;
              if (this.users[user._id].sendAll instanceof Object) {
                if (message.route && !message.origin)
                  message.origin = user._id;
                if (message instanceof Object)
                  message = JSON.stringify(message);
                for (const protocol in this.users[user._id].sendAll) {
                  for (const info in this.users[user._id].sendAll[protocol]) {
                    let obj = this.users[user._id].sendAll[protocol][info];
                    if (obj.socket) {
                      if (obj.socket.readyState === 1) {
                        obj.socket.send(message);
                      } else
                        delete this.users[user._id].sendAll[protocol][info];
                    } else if (obj.rtc) {
                      if (channel && obj.channels[channel])
                        obj.channels[channel].send(message);
                      else if (obj.channels.data)
                        obj.channels.data.send(message);
                      else {
                        let firstchannel = Object.keys(obj.channels)[0];
                        obj.channels[firstchannel].send(message);
                      }
                    } else if (obj.wss) {
                      obj.wss.clients.forEach((c) => {
                        c.send(message);
                      });
                    } else if (obj.sessions) {
                      if (channel)
                        obj.channel.broadcast(message, channel);
                      else
                        for (const s in obj.sessions) {
                          if (obj.sessions[s].isConnected) {
                            obj.sessions[s].push(message);
                          }
                        }
                    } else if (obj.session) {
                      if (channel)
                        obj.served.channel.broadcast(message, channel);
                      else if (obj.session.isConnected)
                        obj.session.push(message);
                      else
                        delete this.users[user._id].sendAll[protocol][info];
                    } else if (obj.server) {
                      if (this.services.http)
                        this.services.http.transmit(message, channel);
                    }
                  }
                }
              } else {
                let connections;
                if (this.users[user._id].sendAll) {
                  if (Object.getPrototypeOf(this.users[user._id].sendAll) === String.prototype) {
                    connections = this.user[this.users[user._id].sendAll];
                    this.users[user._id].sendAll = {};
                  }
                }
                if (connections) {
                } else {
                  this.users[user._id].sendAll = {};
                  if (this.users[user._id].webrtc) {
                    let key = Object.keys(this.users[user._id].webrtc)[0];
                    if (key)
                      this.users[user._id].sendAll.webrtc = { [key]: this.users[user._id].webrtc[key] };
                  } else if (this.users[user._id].eventsources && this.users[user._id].eventsources[Object.keys(this.users[user._id].eventsources)[0]].session) {
                    let key = Object.keys(this.users[user._id].eventsources)[0];
                    if (key) {
                      this.users[user._id].sendAll.eventsources = { [key]: this.users[user._id].eventsources[key] };
                    }
                  } else if (this.users[user._id].eventsources && this.users[user._id].eventsources[Object.keys(this.users[user._id].eventsources)[0]].sessions) {
                    let key = Object.keys(this.users[user._id].eventsources)[0];
                    if (key) {
                      this.users[user._id].sendAll.eventsources = { [key]: this.users[user._id].eventsources[key] };
                    }
                  } else if (this.users[user._id].sockets) {
                    let key = Object.keys(this.users[user._id].sockets)[0];
                    if (key)
                      this.users[user._id].sendAll.sockets = { [key]: this.users[user._id].sockets[key] };
                  } else if (this.users[user._id].wss) {
                    let key = Object.keys(this.users[user._id].wss)[0];
                    if (key)
                      this.users[user._id].sendAll.wss = { [key]: this.users[user._id].wss[key] };
                  } else if (this.users[user._id].servers) {
                    let key = Object.keys(this.users[user._id].servers)[0];
                    if (key)
                      this.users[user._id].sendAll.servers = { [key]: this.users[user._id].servers[key] };
                  }
                }
                if (this.users[user._id].sendAll) {
                  if (Object.keys(this.users[user._id].sendAll).length > 0)
                    this.users[user._id].send(message, channel);
                }
              }
            };
          }
          if (!user.request) {
            user.request = (message, connection, connectionId, origin, method) => {
              if (!connection) {
                if (this.users[user._id].sockets)
                  for (const prop in this.users[user._id].sockets) {
                    if (this.users[user._id].sockets[prop].socket) {
                      connectionId = this.users[user._id].sockets[prop]._id;
                      if (!connectionId)
                        continue;
                      connection = this.users[user._id].sockets[prop].socket;
                      break;
                    }
                  }
                if (!connection) {
                  if (this.users[user._id].webrtc)
                    for (const prop in this.users[user._id].webrtc) {
                      if (this.users[user._id].webrtc[prop].channels.data) {
                        connectionId = this.users[user._id].webrtc[prop]._id;
                        if (!connectionId)
                          return void 0;
                        connection = this.users[user._id].webrtc[prop].channels.data;
                        break;
                      } else if (Object.keys(this.users[user._id].webrtc[prop].channels).length > 0) {
                        connectionId = this.users[user._id].webrtc[prop]._id;
                        if (!connectionId)
                          return void 0;
                        connection = this.users[user._id].webrtc[prop].channels[Object.keys(this.users[user._id].webrtc[prop].channels)[0]];
                        break;
                      }
                    }
                }
                if (!connection)
                  return void 0;
              }
              let callbackId = `${Math.random()}`;
              let req = { route: "runRequest", args: [message, connectionId, callbackId], origin: user._id };
              if (method)
                req.method = method;
              if (origin)
                req.origin = origin;
              return new Promise((res, rej) => {
                let onmessage = (ev) => {
                  let data = ev.data;
                  if (typeof data === "string") {
                    if (data.includes("callbackId"))
                      data = JSON.parse(data);
                  }
                  if (data instanceof Object) {
                    if (data.callbackId === callbackId) {
                      connection.removeEventListener("message", onmessage);
                      res(data.args);
                    }
                  }
                };
                connection.addEventListener("message", onmessage);
                connection.send(JSON.stringify(req));
              });
            };
          }
          this._initConnections(user);
          if (!(user instanceof GraphNode))
            this.users[user._id] = new GraphNode(user, void 0, this.service);
          if (this.users[user._id].sockets || this.users[user._id].eventsources || this.users[user._id].webrtc) {
            let needsId = [];
            for (const prop in this.users[user._id].sockets) {
              if (!this.users[user._id].sockets[prop]._id) {
                needsId.push(this.users[user._id].sockets[prop]);
              }
            }
            for (const prop in this.users[user._id].eventsources) {
              if (!this.users[user._id].eventsources[prop]._id && this.users[user._id].eventsources[prop].source) {
                needsId.push(this.users[user._id].eventsources[prop]);
              }
            }
            for (const prop in this.users[user._id].webrtc) {
              if (!this.users[user._id].webrtc[prop]._id) {
                needsId.push(this.users[user._id].webrtc[prop]);
              }
            }
            if (needsId.length > 0) {
              return await new Promise((res, rej) => {
                let start = performance.now();
                let checker = () => {
                  let filtered = needsId.filter((n) => {
                    if (!n._id)
                      return true;
                  });
                  if (filtered.length > 0) {
                    if (performance.now() - start > timeout) {
                      rej(filtered);
                      return this.users[user._id];
                    } else {
                      setTimeout(() => {
                        checker();
                      }, 100);
                    }
                  } else {
                    res(this.users[user._id]);
                    return this.users[user._id];
                  }
                };
                checker();
              }).catch((er) => {
                console.error("Connections timed out:", er);
              });
            }
          }
        }
        return await this.users[user._id];
      };
      this.removeUser = (user) => {
        if (typeof user === "string")
          user = this.users[user];
        if (!user)
          return false;
        if (user.sockets) {
          for (const address in user.sockets) {
            if (user.sockets[address].socket) {
              this.run("wss/terminate", address);
            }
          }
        }
        if (user.wss) {
          for (const address in user.wss) {
            if (user.wss[address].wss) {
              this.run("wss/terminate", address);
            }
          }
        }
        if (user.eventsources) {
          for (const path in user.eventsources) {
            if (user.eventsources[path].source || user.eventsources[path].sessions) {
              this.run("sse/terminate", path);
            }
          }
        }
        if (user.servers) {
          for (const address in user.servers) {
            if (user.servers[address].server) {
              this.run("http/terminate", address);
            }
          }
        }
        if (user.webrtc) {
          for (const id in user.webrtc) {
            if (user.webrtc[id].rtc) {
              this.run("webrtc/terminate", id);
            }
          }
        }
        if (user.sessions) {
        }
        delete this.users[user._id];
        return true;
      };
      this.updateUser = (user, options) => {
        if (typeof user === "string")
          user = this.users[user];
        if (!user)
          return false;
        this._initConnections(options);
        if (options._id !== user._id) {
          delete this.users[user._id];
          user._id = options._id;
          this.users[user._id] = user;
        }
        this.recursivelyAssign(this.users[user._id], options);
        return user;
      };
      this.setUser = (user, props) => {
        if (user) {
          if (Object.getPrototypeOf(user) === String.prototype) {
            user = this.users[user];
            if (!user)
              return false;
          }
        }
        if (props) {
          if (Object.getPrototypeOf(props) === String.prototype) {
            props = JSON.parse(props);
          }
        }
        this.recursivelyAssign(user, props);
        return true;
      };
      this.getConnectionInfo = (user) => {
        let connectionInfo = {
          _id: user._id
        };
        if (user.sockets) {
          connectionInfo.sockets = {};
          for (const prop in user.sockets) {
            if (user.sockets[prop]._id)
              connectionInfo.sockets[prop] = {
                _id: user.sockets[prop]._id,
                host: user.sockets[prop].host,
                port: user.sockets[prop].port,
                path: user.sockets[prop].path,
                address: user.sockets[prop].address
              };
          }
        }
        if (user.eventsources) {
          connectionInfo.eventsources = {};
          for (const prop in user.eventsources) {
            if (user.eventsources[prop]._id)
              connectionInfo.eventsources[prop] = {
                _id: user.eventsources[prop]._id,
                url: user.eventsources[prop].url
              };
          }
        }
        if (user.webrtc) {
          connectionInfo.webrtc = {};
          for (const prop in user.webrtc) {
            if (user.webrtc[prop]._id)
              connectionInfo.webrtc[prop] = {
                _id: user.webrtc[prop]._id,
                icecandidate: user.webrtc[prop].icecandidate
              };
          }
        }
        if (user.servers) {
          connectionInfo.servers = {};
          for (const prop in user.servers) {
            if (user.servers[prop].server)
              connectionInfo.servers[prop] = {
                host: user.servers[prop].host,
                port: user.servers[prop].port,
                protocol: user.servers[prop].protocol,
                address: user.servers[prop].address
              };
          }
        }
        if (user.wss) {
          connectionInfo.wss = {};
          for (const prop in user.wss) {
            if (user.wss[prop]._id)
              connectionInfo.wss[prop] = {
                host: user.wss[prop].host,
                port: user.wss[prop].port,
                path: user.wss[prop].path,
                address: user.wss[prop].address
              };
          }
        }
        if (user.sessions) {
          connectionInfo.sessions = {};
          for (const prop in user.sessions) {
            if (user.sessions[prop]._id)
              connectionInfo.sessions[prop] = {
                _id: user.sessions[prop]._id,
                type: user.sessions[prop].type,
                users: user.sessions[prop].users
              };
          }
        }
        return connectionInfo;
      };
      this.getSessionInfo = (sessionId, userId) => {
        if (userId instanceof Object)
          userId = userId._id;
        if (!sessionId) {
          return this.sessions.shared;
        } else {
          if (this.sessions.private[sessionId]) {
            let s = this.sessions.private[sessionId];
            if (s.settings) {
              if (s.settings.source === userId || s.settings.listener === userId || s.settings.ownerId === userId || s.settings.admins?.[userId] || s.settings.moderators?.[userId])
                return { private: { [sessionId]: s } };
            }
          } else if (this.sessions.shared[sessionId]) {
            return { shared: { [sessionId]: this.sessions.shared[sessionId] } };
          } else {
            let res = {};
            for (const id in this.sessions.shared) {
              if (this.sessions.shared[id].settings?.name)
                res[id] = this.sessions.shared.settings;
            }
            if (Object.keys(res).length > 0)
              return res;
          }
        }
      };
      this.openPrivateSession = (options = {}, userId) => {
        if (typeof userId === "object")
          userId = userId._id;
        if (!options._id) {
          options._id = `private${Math.floor(Math.random() * 1e15)}`;
          if (this.sessions.private[options._id]) {
            delete options._id;
            this.openPrivateSession(options, userId);
          }
        }
        if (options._id) {
          if (userId) {
            if (!options.settings)
              options.settings = { listener: userId, source: userId, propnames: { latency: true }, admins: { [userId]: true }, ownerId: userId };
            if (!options.settings.listener)
              options.settings.listener = userId;
            if (!options.settings.source)
              options.settings.source = userId;
            if (!this.users[userId].sessions)
              this.users[userId].sessions = {};
            this.users[userId].sessions[options._id] = options;
          }
          if (!options.data)
            options.data = {};
          if (this.sessions.private[options._id]) {
            return this.updateSession(options, userId);
          } else if (options.settings?.listener && options.settings.source)
            this.sessions.private[options._id] = options;
        }
        return options;
      };
      this.openSharedSession = (options, userId) => {
        if (typeof userId === "object")
          userId = userId._id;
        if (!options._id) {
          options._id = `shared${Math.floor(Math.random() * 1e15)}`;
          if (this.sessions.shared[options._id]) {
            delete options._id;
            this.openSharedSession(options, userId);
          }
        }
        if (options._id) {
          if (typeof userId === "string") {
            if (!options.settings)
              options.settings = { name: "shared", propnames: { latency: true }, users: { [userId]: true }, admins: { [userId]: true }, ownerId: userId };
            if (!options.settings.users)
              options.settings.users = { [userId]: true };
            if (!options.settings.admins)
              options.settings.admins = { [userId]: true };
            if (!options.settings.ownerId)
              options.settings.ownerId = userId;
            if (!this.users[userId].sessions)
              this.users[userId].sessions = {};
            this.users[userId].sessions[options._id] = options;
          } else if (!options.settings)
            options.settings = { name: "shared", propnames: { latency: true }, users: {} };
          if (!options.data)
            options.data = { private: {}, shared: {} };
          if (!options.settings.name)
            options.name = options.id;
          if (this.sessions.shared[options._id]) {
            return this.updateSession(options, userId);
          } else
            this.sessions.shared[options._id] = options;
        }
        return options;
      };
      this.updateSession = (options, userId) => {
        if (typeof userId === "object")
          userId = userId._id;
        let session;
        if (options._id && typeof userId === "string") {
          session = this.sessions.private[options._id];
          if (!session)
            session = this.sessions.shared[options._id];
          if (this.sesh.private[options._id]) {
            let sesh = this.sessions.shared[options._id];
            if (sesh.settings && (sesh?.settings.source === userId || sesh.settings.admins?.[userId] || sesh.settings.moderators?.[userId] || sesh.settings.ownerId === userId)) {
              return Object.assign(this.session.shared[options._id], options);
            }
          } else if (options.settings?.source) {
            return this.openPrivateSession(options, userId);
          } else
            return this.openSharedSession(options, userId);
        }
        return false;
      };
      this.joinSession = (sessionId, userId, options) => {
        if (typeof userId === "object")
          userId = userId._id;
        if (!userId)
          return false;
        let sesh = this.sessions.shared[sessionId];
        if (sesh?.settings) {
          if (sesh.settings?.banned) {
            if (sesh.settings.banned[userId])
              return false;
          }
          if (sesh.settings?.password) {
            if (!options?.settings?.password)
              return false;
            if (options.settings.password !== sesh.settings.password)
              return false;
          }
          sesh.settings.users[userId] = true;
          if (!this.users[userId].sessions)
            this.users[userId].sessions = {};
          this.users[userId].sessions[sessionId] = sesh;
          if (options) {
            return this.updateSession(options, userId);
          }
          ;
          return sesh;
        } else if (options?.source || options?.listener)
          return this.openPrivateSession(options, userId);
        else if (options)
          return this.openSharedSession(options, userId);
        return false;
      };
      this.leaveSession = (sessionId, userId, clear = true) => {
        if (typeof userId === "object")
          userId = userId._id;
        let session = this.sessions.private[sessionId];
        if (!session)
          session = this.sessions.shared[sessionId];
        if (session) {
          if (this.sessions.private[sessionId]) {
            if (userId === session.settings.source || userId === session.settings.listener || session.settings.admins?.[userId] || session.settings.moderators?.[userId]) {
              delete this.sessions.private[sessionId];
              delete this.users[userId].sessions[sessionId];
              if (clear) {
                if (session.settings.admins?.[userId])
                  delete (this.sessions.shared[sessionId].settings?.admins)[userId];
                if (session.settings.moderators?.[userId])
                  delete (this.sessions.shared[sessionId].settings?.moderators)[userId];
              }
            }
          } else if (this.sessions.shared[sessionId]) {
            delete this.sessions.shared.settings.users[userId];
            delete this.users[userId].sessions[sessionId];
            if (clear) {
              if (session.settings.admins?.[userId])
                delete (this.sessions.shared[sessionId].settings?.admins)[userId];
              if (session.settings.moderators?.[userId])
                delete (this.sessions.shared[sessionId].settings?.moderators)[userId];
              if (session.data.shared[userId])
                delete this.sessions.shared[sessionId].data?.shared[userId];
              if (session.settings.host === userId) {
                delete session.settings.host;
                delete session.data.shared;
                session.data.shared = {};
                this.swapHost(session);
              }
            }
          }
          return true;
        }
        return false;
      };
      this.swapHost = (session, newHostId) => {
        if (typeof session === "string") {
          if (this.sessions.private[session])
            session = this.sessions.private[session];
          else if (this.sessions.shared[session])
            session = this.sessions.shared[session];
        }
        if (typeof session === "object" && session.settings) {
          delete session.settings.host;
          if (newHostId) {
            if (session.settings.users[newHostId])
              session.settings.host = newHostId;
          }
          if (session.settings.ownerId && !session.settings.host) {
            if (session.settings.users[session.settings.ownerId])
              session.settings.host = session.settings.ownerId;
          }
          if (session.settings.admins && !session.settings.host) {
            let match = this.getFirstMatch(session.settings.users, session.settings.admins);
            if (match)
              session.settings.host = match;
          }
          if (session.settings.moderators && !session.settings.host) {
            let match = this.getFirstMatch(session.settings.users, session.settings.moderators);
            if (match)
              session.settings.host = match;
          }
          if (!session.settings.host)
            session.settings.host = Object.keys(session.settings.users)[0];
          return true;
        }
        return false;
      };
      this.deleteSession = (sessionId, userId) => {
        if (typeof userId === "object")
          userId = userId._id;
        let session = this.sessions.private[sessionId];
        if (!session)
          session = this.sessions.shared[sessionId];
        if (session) {
          if (session.source === userId || session.listener === userId || session.admins?.[userId] || session.ownerId === userId) {
            for (const user in session.settings.users) {
              delete this.users.sessions[sessionId];
            }
            if (this.sessions.private[sessionId])
              delete this.sessions.private[sessionId];
            else if (this.sessions.shared[sessionId])
              delete this.sessions.private[sessionId];
          }
        }
        return true;
      };
      this.subscribeToSession = (session, userId, onmessage, onopen, onclose) => {
        if (userId instanceof Object)
          userId = userId._id;
        if (typeof session === "string") {
          let s = this.sessions.private[session];
          if (!s)
            s = this.sessions.shared[session];
          if (!s)
            return void 0;
          session = s;
        }
        if (typeof session.onopen === "function") {
          let sub = this.subscribe("joinSession", (res) => {
            if (res._id === session._id)
              session.onopen(session, userId);
            this.unsubscribe("joinSession", sub);
          });
        }
        if (session instanceof Object) {
          if (onmessage)
            session.onmessage = onmessage;
          if (onopen)
            session.onclose = onopen;
          if (onclose)
            session.onclose = onclose;
        }
        return session;
      };
      this.sessionLoop = (sendAll = true) => {
        let updates = {
          private: {},
          shared: {}
        };
        for (const session in this.sessions.private) {
          const sesh = this.sessions.private[session];
          const updateObj = {
            _id: sesh._id,
            settings: {
              listener: sesh.listener,
              source: sesh.source
            },
            data: {}
          };
          if (!this.users[sesh.source]) {
            delete this.sessions.private[session];
            break;
          }
          if (sesh.settings && sesh.data) {
            for (const prop in sesh.settings.propnames) {
              if (this.users[sesh.source][prop]) {
                if (this.sessions.private[session].data) {
                  if (sesh.data[prop] instanceof Object) {
                    if (this.users[sesh.source][prop] && (stringifyFast(sesh.data[prop]) !== stringifyFast(this.users[sesh.source][prop]) || !(prop in sesh.data)))
                      updateObj.data[prop] = this.users[sesh.source][prop];
                  } else if (this.users[sesh.source][prop] && (sesh.data[prop] !== this.users[sesh.source][prop] || !(prop in sesh.data)))
                    updateObj.data[prop] = this.users[sesh.source][prop];
                } else
                  updateObj.data[prop] = this.users[sesh.source][prop];
              } else if (this.sessions.private[session]?.data?.[prop])
                delete this.sessions.private[session].data[prop];
            }
          }
          if (Object.keys(updateObj.data).length > 0) {
            this.recursivelyAssign(this.sessions.private[session].data, updateObj.data);
            updates.private[sesh._id] = updateObj;
          }
        }
        for (const session in this.sessions.shared) {
          const sesh = this.sessions.shared[session];
          const updateObj = {
            _id: sesh._id,
            settings: {
              name: sesh.name
            },
            data: {}
          };
          if (sesh.settings?.host) {
            const privateData = {};
            const sharedData = {};
            for (const user in sesh.settings.users) {
              if (!this.users[user]) {
                delete sesh.settings.users[user];
                if (sesh.data?.shared[user])
                  delete sesh.data.shared[user];
                if (sesh.data?.private?.[user])
                  delete sesh.data.shared[user];
                if (sesh.settings.host === user)
                  this.swapHost(sesh);
                updateObj.settings.users = sesh.settings.users;
                updateObj.settings.host = sesh.settings.host;
                continue;
              }
              if (user !== sesh.settings.host) {
                privateData[user] = {};
                for (const prop in sesh.settings.propnames) {
                  if (this.users[user][prop]) {
                    if (sesh.data?.private && !(user in sesh.data.private)) {
                      if (this.users[user][prop] instanceof Object)
                        privateData[user][prop] = this.recursivelyAssign({}, this.users[user][prop]);
                      else
                        privateData[user][prop] = this.users[user][prop];
                    } else if (privateData[user][prop] instanceof Object && sesh.data) {
                      if (this.users[user][prop] && (stringifyFast(sesh.data?.shared[user][prop]) !== stringifyFast(this.users[user][prop]) || !(prop in sesh.data)))
                        privateData[user][prop] = this.users[user][prop];
                    } else if (this.users[user][prop] && sesh.data?.private?.[prop] !== this.users[user][prop])
                      privateData[user][prop] = this.users[user][prop];
                  } else if (sesh.data?.private?.[user]?.[prop])
                    delete sesh.data.private[user][prop];
                }
                if (Object.keys(privateData[user]).length === 0)
                  delete privateData[user];
              } else {
                sharedData[user] = {};
                for (const prop in sesh.settings.hostprops) {
                  if (this.users[user][prop]) {
                    if (sesh.data && !(user in sesh.data.shared)) {
                      if (this.users[user][prop] instanceof Object)
                        sharedData[user][prop] = this.recursivelyAssign({}, this.users[user][prop]);
                      else
                        sharedData[user][prop] = this.users[user][prop];
                    } else if (sharedData[user][prop] instanceof Object && sesh.data) {
                      if (this.users[user][prop] && (stringifyFast(sesh.data?.shared[user][prop]) !== stringifyFast(this.users[user][prop]) || !(prop in sesh.data.shared[user])))
                        sharedData[user][prop] = this.users[user][prop];
                    } else if (this.users[user][prop] && sesh.data?.shared[user][prop] !== this.users[user][prop])
                      sharedData[user][prop] = this.users[user][prop];
                  } else if (sesh.data?.shared[user]?.[prop])
                    delete sesh.data.shared[user][prop];
                }
              }
            }
            if (Object.keys(privateData).length > 0) {
              updateObj.data.private = privateData;
            }
            if (Object.keys(sharedData).length > 0) {
              updateObj.data.shared = sharedData;
            }
          } else {
            const sharedData = {};
            if (sesh.settings?.users) {
              for (const user in sesh.settings.users) {
                if (!this.users[user]) {
                  delete sesh.settings.users[user];
                  if (sesh.data?.shared[user])
                    delete sesh.data.shared[user];
                  if (sesh.data?.private?.[user])
                    delete sesh.data.shared[user];
                  if (sesh.settings.host === user)
                    this.swapHost(sesh);
                  updateObj.settings.users = sesh.settings.users;
                  updateObj.settings.host = sesh.settings.host;
                  continue;
                }
                sharedData[user] = {};
                for (const prop in sesh.settings.propnames) {
                  if (this.users[user][prop]) {
                    if (sesh.data && !(user in sesh.data.shared)) {
                      if (this.users[user][prop] instanceof Object)
                        sharedData[user][prop] = this.recursivelyAssign({}, this.users[user][prop]);
                      else
                        sharedData[user][prop] = this.users[user][prop];
                    } else if (sesh.data?.shared[user][prop] instanceof Object) {
                      if (stringifyFast(sesh.data.shared[user][prop]) !== stringifyFast(this.users[user][prop]) || !(prop in sesh.data.shared[user])) {
                        sharedData[user][prop] = this.users[user][prop];
                      }
                    } else if (sesh.data?.shared[user][prop] !== this.users[user][prop])
                      sharedData[user][prop] = this.users[user][prop];
                  } else if (sesh.data?.shared[user]?.[prop])
                    delete sesh.data.shared[user][prop];
                }
                if (Object.keys(sharedData[user]).length === 0)
                  delete sharedData[user];
              }
              if (Object.keys(sharedData).length > 0) {
                updateObj.data.shared = sharedData;
              }
            }
          }
          if (updateObj.data.shared || updateObj.data.private)
            updates.shared[sesh._id] = updateObj;
          if (updateObj.data.shared) {
            this.recursivelyAssign(this.sessions.shared[session].data?.shared, updateObj.data.shared);
          }
          if (updateObj.data.private) {
            this.recursivelyAssign(this.sessions.shared[session].data?.private, updateObj.data.private);
          }
        }
        if (Object.keys(updates.private).length === 0)
          delete updates.private;
        if (Object.keys(updates.shared).length === 0)
          delete updates.shared;
        if (Object.keys(updates).length === 0)
          return void 0;
        if (sendAll)
          this.transmitSessionUpdates(updates);
        return updates;
      };
      this.transmitSessionUpdates = (updates) => {
        let users = {};
        if (updates.private) {
          for (const s in updates.private) {
            let session = this.sessions.private[s];
            if (session?.settings) {
              let u = session.settings.listener;
              if (!users[u])
                users[u] = { private: {} };
              if (!users[u].private)
                users[u].private = {};
              users[u].private[s] = updates.private[s];
            }
          }
        }
        if (updates.shared) {
          for (const s in updates.shared) {
            let session = this.sessions.shared[s];
            if (session?.settings) {
              let copy;
              if (session.settings.host) {
                copy = Object.assign({}, updates.shared[s]);
                delete copy.data.private;
              }
              for (const u in session.settings.users) {
                if (!users[u])
                  users[u] = { shared: {} };
                if (!users[u].shared)
                  users[u].shared = {};
                if (session.settings.host) {
                  if (u !== session.settings.host) {
                    users[u].shared[s] = copy;
                  } else
                    users[u].shared[s] = updates.shared[s];
                } else
                  users[u].shared[s] = updates.shared[s];
              }
            }
          }
        }
        let message = { route: "receiveSessionUpdates", args: null, origin: null };
        for (const u in users) {
          message.args = users[u];
          message.origin = u;
          if (this.users[u].send)
            this.users[u].send(JSON.stringify(message));
        }
        return users;
      };
      this.receiveSessionUpdates = (self = this, origin, update) => {
        if (update) {
          if (Object.getPrototypeOf(update) === String.prototype)
            update = JSON.parse(update);
        }
        if (update instanceof Object) {
          if (typeof origin === "object")
            origin = origin._id;
          let user = this.users[origin];
          if (!user)
            return void 0;
          if (!user.sessions)
            user.sessions = {};
          if (update.private) {
            for (const key in update.private) {
              if (!user.sessions[key])
                continue;
              this.recursivelyAssign(user.sessions[key].data, update.private[key].data);
              if (user.sessions[key].onmessage)
                user.sessions[key].onmessage(user.sessions[key], user._id);
            }
          }
          if (update.shared) {
            for (const key in update.shared) {
              if (!user.sessions[key])
                continue;
              if (update.shared[key].settings.users)
                user.sessions[key].settings.users = update.shared[key].settings.users;
              if (update.shared[key].settings.host)
                user.sessions[key].settings.host = update.shared[key].settings.host;
              if (update.shared[key].data.private)
                this.recursivelyAssign(user.sessions[key].data.private, update.shared[key].data.private);
              if (update.shared[key].data.shared)
                this.recursivelyAssign(user.sessions[key].data.shared, update.shared[key].data.shared);
              if (user.sessions[key].onmessage)
                user.sessions[key].onmessage(user.sessions[key], user._id);
            }
          }
          return user;
        }
      };
      this.userUpdateLoop = (user) => {
        if (user.sessions) {
          const updateObj = {};
          for (const key in user.sessions) {
            let s = user.sessions[key];
            if (s.settings.users[user._id] || s.settings.source === user._id) {
              if (!s.settings.spectators?.[user._id]) {
                if (s.settings.host === user._id) {
                  for (const prop in s.settings.hostprops) {
                    if (!updateObj[prop] && user[prop] && user[prop] !== void 0) {
                      if (s.data.shared?.[user._id]?.[prop]) {
                        if (user[prop] instanceof Object) {
                          if (stringifyFast(s.data.shared[user._id][prop]) !== stringifyFast(user[prop]))
                            updateObj[prop] = user[prop];
                        } else if (s.data.shared[user._id][prop] !== user[prop])
                          updateObj[prop] = user[prop];
                      } else
                        updateObj[prop] = user[prop];
                    }
                  }
                } else {
                  for (const prop in s.settings.propnames) {
                    if (!updateObj[prop] && user[prop] !== void 0) {
                      if (s.settings.source) {
                        if (user[prop] instanceof Object && s.data[prop] !== void 0) {
                          if (stringifyFast(s.data[prop]) !== stringifyFast(user[prop]))
                            updateObj[prop] = user[prop];
                        } else if (s.data[prop] !== user[prop])
                          updateObj[prop] = user[prop];
                      } else {
                        if (s.data.shared?.[user._id]?.[prop]) {
                          if (user[prop] instanceof Object) {
                            let split = stringifyFast(user[prop]).split("");
                            if (stringifyFast(s.data.shared[user._id][prop]) !== stringifyFast(user[prop]))
                              updateObj[prop] = user[prop];
                          } else if (s.data.shared[user._id][prop] !== user[prop])
                            updateObj[prop] = user[prop];
                        } else
                          updateObj[prop] = user[prop];
                      }
                    }
                  }
                }
              }
            }
          }
          if (Object.keys(updateObj).length > 0) {
            if (user.send)
              user.send({ route: "setUser", args: updateObj, origin: user._id });
            return updateObj;
          }
        }
        return void 0;
      };
      this.routes = {
        runAs: this.runAs,
        pipeAs: this.pipeAs,
        addUser: this.addUser,
        setUser: (self, origin, update) => {
          return this.setUser(origin, update);
        },
        removeUser: this.removeUser,
        updateUser: this.updateUser,
        getConnectionInfo: this.getConnectionInfo,
        getSessionInfo: this.getSessionInfo,
        openPrivateSession: this.openPrivateSession,
        openSharedSession: this.openSharedSession,
        joinSession: this.joinSession,
        leaveSession: this.leaveSession,
        subscribeToSession: this.subscribeToSession,
        transmitSessionUpdates: this.transmitSessionUpdates,
        receiveSessionUpdates: this.receiveSessionUpdates,
        swapHost: this.swapHost,
        userUpdateLoop: {
          operator: this.userUpdateLoop,
          loop: 10
        },
        sessionLoop: {
          operator: this.sessionLoop,
          loop: 10
        }
      };
      this.load(this.routes);
    }
    getFirstMatch(obj1, obj2) {
      for (const i in obj1) {
        for (const j in obj2) {
          if (i === j)
            return i;
        }
      }
      return false;
    }
  };

  // ../../services/http/HTTP.browser.ts
  var HTTPfrontend = class extends Service {
    constructor() {
      super(...arguments);
      this.name = "http";
      this.fetchProxied = false;
      this.listening = {};
      this.request = (options) => {
        const xhr = new XMLHttpRequest();
        if (options.responseType)
          xhr.responseType = options.responseType;
        else
          options.responseType = "json";
        if (options.mimeType) {
          xhr.overrideMimeType(options.mimeType);
        }
        if (options.onload)
          xhr.addEventListener("load", options.onload, false);
        if (options.onprogress)
          xhr.addEventListener("progress", options.onprogress, false);
        if (options.onabort)
          xhr.addEventListener("abort", options.onabort, false);
        if (options.onloadend)
          xhr.addEventListener("loadend", options.onloadend, false);
        if (options.onerror)
          xhr.addEventListener("error", options.onerror, false);
        xhr.open(options.method, options.url, true, options.user, options.pass);
        if (!options.onerror)
          xhr.onerror = function() {
            xhr.abort();
          };
        xhr.send(options.data);
        return xhr;
      };
      this.get = (url = "http://localhost:8080/ping", type = "", mimeType) => {
        if (type === "json")
          mimeType = "application/json";
        return new Promise((resolve, reject) => {
          let xhr = this.request({
            method: "GET",
            url,
            responseType: type,
            mimeType,
            onload: (ev) => {
              let data;
              if (xhr.responseType === "" || xhr.responseType === "text")
                data = xhr.responseText;
              else
                data = xhr.response;
              if (url instanceof URL)
                url = url.toString();
              this.setState({ [url]: data });
              resolve(data);
            },
            onabort: (er) => {
              reject(er);
            }
          });
        }).catch(console.error);
      };
      this.post = (message, url = "http://localhost:8080/echo", type = "", mimeType) => {
        if (typeof message === "object") {
          message = JSON.stringify(message);
        }
        if (type === "json")
          mimeType = "application/json";
        return new Promise((resolve, reject) => {
          let xhr = this.request({
            method: "POST",
            url,
            data: message,
            responseType: type,
            mimeType,
            onload: (ev) => {
              let data;
              if (xhr.responseType === "" || xhr.responseType === "text")
                data = xhr.responseText;
              else
                data = xhr.response;
              if (url instanceof URL)
                url = url.toString();
              this.setState({ [url]: data });
              resolve(data);
            },
            onabort: (er) => {
              reject(er);
            }
          });
        }).catch(console.error);
      };
      this.transmit = (message, url) => {
        let obj = message;
        if (typeof obj === "object") {
          message = JSON.stringify(obj);
        }
        if (obj?.method?.toLowerCase() == "get" || message?.toLowerCase() === "get")
          return this.get(url);
        return this.post(message, url);
      };
      this.transponder = (url, message, type = "", mimeType) => {
        if (typeof message === "object")
          message = JSON.stringify(message);
        let method = "GET";
        if (message) {
          method = "POST";
        }
        if (type === "json")
          mimeType = "application/json";
        else
          return new Promise((resolve, reject) => {
            let xhr = this.request({
              method,
              url,
              data: message,
              responseType: type,
              onload: (ev) => {
                let body = xhr.response;
                if (typeof body === "string") {
                  let substr = body.substring(0, 8);
                  if (substr.includes("{") || substr.includes("[")) {
                    if (substr.includes("\\"))
                      body = body.replace(/\\/g, "");
                    if (body[0] === '"') {
                      body = body.substring(1, body.length - 1);
                    }
                    ;
                    body = JSON.parse(body);
                  }
                }
                if (typeof body?.method === "string") {
                  return resolve(this.handleMethod(body.route, body.method, body.args, body.origin));
                } else if (typeof body?.route === "string") {
                  return resolve(this.handleServiceMessage(body));
                } else if (typeof body?.node === "string" || body.node instanceof GraphNode) {
                  return resolve(this.handleGraphNodeCall(body.node, body.args, body.origin));
                } else
                  return resolve(body);
              },
              onabort: (er) => {
                reject(er);
              }
            });
          }).catch(console.error);
      };
      this.listen = (path = 0, fetched = async (clone, args, response) => {
        const result = await clone.text();
        console.log("http listener:", result, clone);
        const returned = this.receive(result);
        this.setState({ [response.url]: returned });
      }) => {
        this.listening[path] = true;
        if (!this.fetchProxied) {
          window.fetch = new Proxy(window.fetch, {
            apply(fetch, that, args) {
              const result = fetch.apply(that, args);
              result.then((response) => {
                if (!response.ok)
                  return;
                if (this.listening[0]) {
                  const clone = response.clone();
                  fetched(clone, args, response);
                } else {
                  for (const key in this.listening) {
                    if (response.url.includes(key)) {
                      const clone = response.clone();
                      fetched(clone, args, response);
                      break;
                    }
                  }
                }
              }).catch((er) => {
                console.error(er);
              });
              return result;
            }
          });
        }
      };
      this.stopListening = (path) => {
        if (!path && path !== 0) {
          for (const key in this.listening)
            delete this.listening[key];
        } else
          delete this.listening[path];
      };
      this.routes = {
        request: this.request,
        GET: this.get,
        POST: this.post,
        transponder: this.transponder,
        listen: this.listen,
        stopListening: this.stopListening
      };
    }
  };

  // ../../services/sse/SSE.browser.ts
  var SSEfrontend = class extends Service {
    constructor(routes, name) {
      super(routes, name);
      this.name = "sse";
      this.eventsources = {};
      this.openSSE = (options) => {
        let source = new EventSource(options.url);
        let sse = {
          source,
          type: "eventsource",
          ...options
        };
        if (!("keepState" in options))
          options.keepState = true;
        if (!options.events)
          options.events = {};
        if (!options.events.message) {
          options.events.message = (ev, sse2) => {
            let data = ev.data;
            if (data) {
              if (Object.getPrototypeOf(data) === String.prototype) {
                let substr = data.substring(0, 8);
                if (substr.includes("{") || substr.includes("[")) {
                  if (substr.includes("\\"))
                    data = data.replace(/\\/g, "");
                  if (data[0] === '"') {
                    data = data.substring(1, data.length - 1);
                  }
                  ;
                  data = JSON.parse(data);
                  if (data.route === "setId" && sse2) {
                    sse2._id = data.args;
                    options.events.message = (ev2, sse3) => {
                      const result2 = this.receive(ev2.data, sse3);
                      if (options.keepState)
                        this.setState({ [options.url]: result2 });
                    };
                  }
                }
              }
            }
            const result = this.receive(ev.data, sse2);
            if (options.keepState)
              this.setState({ [options.url]: result });
          };
        }
        if (!options.events.error)
          options.events.error = (ev, sse2) => {
            this.terminate(sse2);
            delete this.eventsources[options.url];
          };
        if (options.events) {
          if (!options.evoptions)
            options.evoptions = false;
          for (const key in options.events) {
            if (typeof options.events[key] !== "function") {
              options.events[key] = (ev) => {
                const result = this.receive(ev.data, sse);
                if (options.keepState)
                  this.setState({ [options.url]: result });
              };
            } else {
              let l = options.events[key];
              options.events[key] = (ev) => {
                l(ev, sse);
              };
            }
            source.addEventListener(key, options.events[key], options.evoptions);
          }
        }
        this.eventsources[options.url] = sse;
        return sse;
      };
      this.terminate = (sse) => {
        if (typeof sse === "string") {
          let str = sse;
          sse = this.eventsources[sse];
          delete this.eventsources[str];
        }
        if (!sse)
          return;
        if (typeof sse === "object") {
          if (sse.source) {
            sse = sse.source;
          }
          if (sse instanceof EventSource) {
            if (sse.readyState !== 2)
              sse.close();
          }
        }
      };
      this.routes = {
        openSSE: this.openSSE,
        terminate: this.terminate
      };
    }
  };

  // ../../services/wss/WSS.browser.ts
  var WSSfrontend = class extends Service {
    constructor(routes, name) {
      super(routes, name);
      this.name = "wss";
      this.sockets = {};
      this.openWS = (options = {
        host: "localhost",
        port: 7e3,
        path: void 0,
        protocol: "ws",
        onclose: (ev, socket, wsinfo) => {
          if (ev.target.url)
            delete this.sockets[ev.target.url];
        }
      }) => {
        let protocol = options.protocol;
        if (!protocol)
          protocol = "ws";
        let address = `${protocol}://${options.host}`;
        if (!("keepState" in options))
          options.keepState = true;
        if (options.port)
          address += ":" + options.port;
        if (options.path && !options.path?.startsWith("/"))
          address += "/";
        if (options.path)
          address += options.path;
        if (this.sockets[address]?.socket) {
          if (this.sockets[address].socket.readyState === this.sockets[address].socket.OPEN)
            this.sockets[address].socket.close();
        }
        const socket = new WebSocket(address);
        if (!options.onmessage) {
          options.onmessage = (data, ws, wsinfo) => {
            if (data) {
              if (Object.getPrototypeOf(data) === String.prototype) {
                let substr = data.substring(0, 8);
                if (substr.includes("{") || substr.includes("[")) {
                  if (substr.includes("\\"))
                    data = data.replace(/\\/g, "");
                  if (data[0] === '"') {
                    data = data.substring(1, data.length - 1);
                  }
                  ;
                  data = JSON.parse(data);
                  if (data.route === "setId") {
                    this.sockets[address]._id = data.args;
                    options.onmessage = (data2, ws2, wsinfo2) => {
                      let res2 = this.receive(data2);
                      if (options.keepState)
                        this.setState({ [address]: res2 });
                    };
                  }
                }
              }
            }
            let res = this.receive(data);
            if (options.keepState)
              this.setState({ [address]: res });
          };
        }
        if (options.onmessage) {
          socket.addEventListener("message", (ev) => {
            options.onmessage(ev.data, socket, this.sockets[address]);
          });
        }
        if (options.onopen)
          socket.addEventListener("open", (ev) => {
            options.onopen(ev, socket, this.sockets[address]);
          });
        if (options.onclose)
          socket.addEventListener("close", (ev) => {
            options.onclose(ev, socket, this.sockets[address]);
          });
        if (options.onerror)
          socket.addEventListener("error", (ev) => {
            options.onerror(ev, socket, this.sockets[address]);
          });
        this.sockets[address] = {
          socket,
          address,
          type: "socket",
          ...options
        };
        return this.sockets[address];
      };
      this.transmit = (data, ws) => {
        if (typeof data === "object")
          data = JSON.stringify(data);
        if (!ws) {
          let s = this.sockets[Object.keys(this.sockets)[0]];
          if (s)
            ws = s.socket;
        }
        if (ws instanceof WebSocket && ws?.readyState === 1)
          ws.send(data);
        return true;
      };
      this.terminate = (ws) => {
        if (!ws) {
          let key = Object.keys(this.sockets)[0];
          if (key)
            ws = this.sockets[key].socket;
        } else if (typeof ws === "string") {
          for (const k in this.sockets) {
            if (k.includes(ws)) {
              ws = this.sockets[k].socket;
              break;
            }
          }
        }
        if (ws instanceof WebSocket) {
          if (ws.readyState === ws.OPEN)
            ws.close();
        }
        return true;
      };
      this.request = (message, ws, _id, origin, method) => {
        let callbackId = `${Math.random()}`;
        let req = { route: "wss/runRequest", args: [message, _id, callbackId] };
        if (method)
          req.method = method;
        if (origin)
          req.origin = origin;
        return new Promise((res, rej) => {
          let onmessage = (ev) => {
            let data = ev.data;
            if (typeof data === "string") {
              if (data.includes("callbackId"))
                data = JSON.parse(data);
            }
            if (data instanceof Object) {
              if (data.callbackId === callbackId) {
                ws.removeEventListener("message", onmessage);
                res(data.args);
              }
            }
          };
          ws.addEventListener("message", onmessage);
          ws.send(JSON.stringify(req));
        });
      };
      this.runRequest = (message, ws, callbackId) => {
        let res = this.receive(message);
        if (Object.getPrototypeOf(ws) === String.prototype) {
          for (const s in this.sockets) {
            if (s === ws) {
              ws = this.sockets[s].socket;
              break;
            }
          }
        }
        if (ws) {
          if (res instanceof Promise) {
            res.then((v) => {
              res = { args: res, callbackId };
              if (ws instanceof WebSocket)
                ws.send(JSON.stringify(res));
            });
          } else {
            res = { args: res, callbackId };
            if (ws instanceof WebSocket)
              ws.send(JSON.stringify(res));
          }
        }
        return res;
      };
      this.routes = {
        openWS: this.openWS,
        request: this.request,
        runRequest: this.runRequest,
        terminate: this.terminate
      };
    }
  };

  // ../../services/webrtc/WebRTC.browser.ts
  var WebRTCfrontend = class extends Service {
    constructor(routes, name, iceServers) {
      super(routes, name);
      this.name = "webrtc";
      this.rtc = {};
      this.iceServers = [
        { urls: ["stun:stun.l.google.com:19302"] },
        { urls: ["stun:stun1.l.google.com:19302"] },
        { urls: ["stun:stun2.l.google.com:19302"] },
        { urls: ["stun:stun3.l.google.com:19302"] },
        { urls: ["stun:stun4.l.google.com:19302"] }
      ];
      this.createStream = (options) => {
        let stream = new MediaStream();
        for (const key in options) {
          let track = options[key].track;
          if (!(track instanceof MediaStreamTrack) && typeof track === "object") {
            track = new MediaStreamTrack();
            track.applyConstraints(options[key].track);
            stream.addTrack(track);
          }
          if (track instanceof MediaStreamTrack) {
            stream.addTrack(track);
            track.onmute = options[key].onmute;
            track.onunmute = options[key].onunmute;
            track.onended = options[key].onended;
          }
        }
        return stream;
      };
      this.openRTC = async (options) => {
        if (!options)
          options = {};
        if (!options._id)
          options._id = `rtc${Math.floor(Math.random() * 1e15)}`;
        if (!options.config)
          options.config = { iceServers: this.iceServers };
        let rtcTransmit = new RTCPeerConnection(options.config);
        let rtcReceive = new RTCPeerConnection(options.config);
        if (!options.channels)
          options.channels = { "data": true };
        if (options.channels) {
          for (const channel in options.channels) {
            if (options.channels[channel] instanceof RTCDataChannel) {
            } else if (typeof options.channels[channel] === "object") {
              options.channels[channel] = this.addDataChannel(rtcTransmit, channel, options.channels[channel]);
            } else
              options.channels[channel] = this.addDataChannel(rtcTransmit, channel);
          }
        }
        if (!this.rtc[options._id]) {
          this.rtc[options._id] = {
            rtcTransmit,
            rtcReceive,
            _id: options._id,
            ...options
          };
        } else {
          Object.assign(this.rtc[options._id], options);
        }
        if (!options.ondatachannel)
          options.ondatachannel = (ev) => {
            this.rtc[options._id].channels[ev.channel.label] = ev.channel;
            if (!options.ondata)
              ev.channel.onmessage = (mev) => {
                this.receive(mev.data, ev.channel, this.rtc[options._id]);
              };
            else
              ev.channel.onmessage = (mev) => {
                options.ondata(mev.data, ev.channel, this.rtc[options._id]);
              };
          };
        rtcTransmit.ontrack = options.ontrack;
        rtcTransmit.onicecandidate = options.onicecandidate;
        rtcTransmit.onicecandidateerror = options.onicecandidateerror;
        rtcTransmit.ondatachannel = options.ondatachannel;
        rtcTransmit.onnegotiationneeded = options.onnegotiationneeded;
        rtcTransmit.oniceconnectionstatechange = options.oniceconnectionstatechange;
        rtcTransmit.onconnectionstatechange = options.onconnectionstatechange;
        rtcReceive.ontrack = options.ontrack;
        rtcReceive.onicecandidate = options.onicecandidate;
        rtcReceive.onicecandidateerror = options.onicecandidateerror;
        rtcReceive.ondatachannel = options.ondatachannel;
        rtcReceive.onnegotiationneeded = options.onnegotiationneeded;
        rtcReceive.oniceconnectionstatechange = options.oniceconnectionstatechange;
        rtcReceive.onconnectionstatechange = options.onconnectionstatechange;
        if (options.hostdescription && !options.peerdescription) {
          if (!options.onicecandidate)
            options.onicecandidate = (ev) => {
              if (ev.candidate) {
                let icecandidate = ev.candidate;
                if (!this.rtc[options._id].peercandidates)
                  this.rtc[options._id].peercandidates = {};
                this.rtc[options._id].peercandidates[`peercandidate${Math.floor(Math.random() * 1e15)}`] = icecandidate;
              }
            };
          return await new Promise((res, rej) => {
            options.hostdescription.sdp = options.hostdescription.sdp.replaceAll("rn", `\r
`);
            rtcReceive.setRemoteDescription(options.hostdescription).then((desc) => {
              if (options.hostcandidates) {
                for (const prop in options.hostcandidates) {
                  rtcReceive.addIceCandidate(options.hostcandidates[prop]);
                }
              }
              rtcReceive.createAnswer(options.answer).then((answer) => {
                rtcReceive.setLocalDescription(answer).then(() => {
                  this.rtc[options._id].peerdescription = { type: rtcReceive.localDescription.type, sdp: rtcReceive.localDescription.sdp };
                  res(this.rtc[options._id]);
                });
              });
            });
          });
        }
        if (options.peerdescription) {
          return await new Promise((res, rej) => {
            options.peerdescription.sdp = options.peerdescription.sdp.replaceAll("rn", `\r
`);
            rtcReceive.setRemoteDescription(options.peerdescription).then(() => {
              if (options.peercandidates) {
                for (const prop in options.peercandidates) {
                  rtcReceive.addIceCandidate(options.peercandidates[prop]);
                }
              }
              res(this.rtc[options._id]);
            });
          });
        }
        if (!options.onicecandidate && !this.rtc[options._id]?.onicecandidate)
          options.onicecandidate = (ev) => {
            if (ev.candidate) {
              let icecandidate = ev.candidate;
              if (!this.rtc[options._id].hostcandidates)
                this.rtc[options._id].hostcandidates = {};
              this.rtc[options._id].hostcandidates[`hostcandidate${Math.floor(Math.random() * 1e15)}`] = icecandidate;
            }
          };
        return await new Promise((res, rej) => {
          rtcTransmit.createOffer(options.offer).then((offer) => {
            rtcTransmit.setLocalDescription(offer).then(() => {
              this.rtc[options._id].hostdescription = { type: offer.type, sdp: offer.sdp };
              res(this.rtc[options._id]);
            });
          });
        });
      };
      this.addUserMedia = (rtc, options = {
        audio: false,
        video: {
          optional: [
            { minWidth: 320 },
            { minWidth: 640 },
            { minWidth: 1024 },
            { minWidth: 1280 },
            { minWidth: 1920 },
            { minWidth: 2560 }
          ]
        }
      }) => {
        let senders = [];
        navigator.mediaDevices.getUserMedia(options).then((stream) => {
          let tracks = stream.getTracks();
          tracks.forEach((track) => {
            senders.push(rtc.addTrack(track, stream));
          });
        });
        return senders;
      };
      this.addTrack = (rtc, track, stream) => {
        rtc.addTrack(track, stream);
        return true;
      };
      this.removeTrack = (rtc, sender) => {
        rtc.removeTrack(sender);
        return true;
      };
      this.addDataChannel = (rtc, name, options) => {
        return rtc.createDataChannel(name, options);
      };
      this.transmit = (data, channel, id) => {
        if (typeof data === "object" || typeof data === "number")
          data = JSON.stringify(data);
        if (!channel && id) {
          let keys = Object.keys(this.rtc[id].channels)[0];
          if (keys[0])
            channel = this.rtc[id].channels[keys[0]];
        }
        if (typeof channel === "string") {
          if (id) {
            channel = this.rtc[id].channels[channel];
          } else {
            for (const id2 in this.rtc) {
              if (this.rtc[id2].channels[channel] instanceof RTCDataChannel)
                this.rtc[id2].channels[channel].send(data);
            }
          }
        }
        if (channel instanceof RTCDataChannel)
          channel.send(data);
        return true;
      };
      this.terminate = (rtc) => {
        let rx, tx;
        if (typeof rtc === "string") {
          let room = this.rtc[rtc];
          delete this.rtc[rtc];
          if (room) {
            tx = room.rtcTransmit;
            rx = room.rtcReceive;
          }
        } else if (typeof rtc === "object") {
          tx = rtc.rtcTransmit;
          rx = rtc.rtcReceive;
        }
        if (rtc instanceof RTCPeerConnection) {
          rtc.close();
        } else if (rx || tx) {
          if (rx)
            rx.close();
          if (tx)
            tx.close();
        }
        return true;
      };
      this.request = (message, channel, _id, origin, method) => {
        let callbackId = `${Math.random()}`;
        let req = { route: "webrtc/runRequest", args: [message, _id, callbackId] };
        if (method)
          req.method = method;
        if (origin)
          req.origin = origin;
        return new Promise((res, rej) => {
          let onmessage = (ev) => {
            let data = ev.data;
            if (typeof data === "string") {
              if (data.includes("callbackId"))
                data = JSON.parse(data);
            }
            if (data instanceof Object) {
              if (data.callbackId === callbackId) {
                channel.removeEventListener("message", onmessage);
                res(data.args);
              }
            }
          };
          channel.addEventListener("message", onmessage);
          channel.send(JSON.stringify(req));
        });
      };
      this.runRequest = (message, channel, callbackId) => {
        let res = this.receive(message);
        if (channel) {
          if (Object.getPrototypeOf(channel) === String.prototype) {
            for (const key in this.rtc) {
              if (key === channel) {
                channel = this.rtc[key].channels.data;
                break;
              }
            }
          }
          if (res instanceof Promise)
            res.then((v) => {
              res = { args: v, callbackId };
              if (channel instanceof RTCDataChannel)
                channel.send(JSON.stringify(res));
              return res;
            });
          else {
            res = { args: res, callbackId };
            if (channel instanceof RTCDataChannel)
              channel.send(JSON.stringify(res));
          }
        }
        return res;
      };
      this.routes = {
        openRTC: this.openRTC,
        request: this.request,
        runRequest: this.runRequest,
        createStream: this.createStream,
        addUserMedia: this.addUserMedia,
        addTrack: this.addTrack,
        removeTrack: this.removeTrack,
        addDataChannel: this.addDataChannel
      };
      if (iceServers)
        this.iceServers = iceServers;
    }
  };

  // app.ts
  console.log("Hello World!");
  if (typeof window !== "undefined")
    document.body.innerHTML += "Hello World!";
  document.body.insertAdjacentHTML("beforeend", `<div id='webrtc'></div>`);
  var router = new UserRouter({
    HTTPfrontend,
    WSSfrontend,
    SSEfrontend,
    WebRTCfrontend,
    Math
  });
  var socketinfo = router.run("wss/openWS", {
    host: "localhost",
    port: 8080,
    path: "wss"
  });
  var sseinfo = router.run("sse/openSSE", {
    url: "http://localhost:8080/sse",
    events: {
      "test": (ev) => {
        console.log("test", ev.data);
      }
    }
  });
  router.run("http/GET", "http://localhost:8080/ping").then((res) => console.log("http GET", res));
  var button = document.createElement("button");
  button.innerHTML = "ping!";
  button.onclick = () => {
    router.run("http/GET", "http://localhost:8080/ping").then((res) => console.log("http GET", res));
  };
  document.body.appendChild(button);
  console.log("Router:", router);
  console.log("adding user");
  var p = router.addUser({
    sockets: {
      [socketinfo.address]: socketinfo
    },
    eventsources: {
      [sseinfo.url]: sseinfo
    }
  }).then((user) => {
    console.log("Added user:", user);
    let info = router.getConnectionInfo(user);
    router.subscribe("joinSession", (res) => {
      console.log("joinSessions fired", res);
      if (res?.settings.name === "webrtcrooms") {
        router.services.webrtc.openRTC({ origin: user._id }).then((room) => {
          room.rtcTransmit.addEventListener("icecandidate", (ev) => {
            if (room._id) {
              if (ev.candidate) {
                if (!user.rooms)
                  user.rooms = {};
                if (!user.rooms[room._id]) {
                  if (!room.hostcandidates)
                    room.hostcandidates = {};
                  user.rooms[room._id] = {
                    _id: room._id,
                    hostdescription: room.hostdescription,
                    hostcandidates: room.hostcandidates
                  };
                } else {
                  user.rooms[room._id].hostdescription = room.hostdescription;
                  user.rooms[room._id].hostcandidates[`hostcandidate${Math.floor(Math.random() * 1e15)}`] = ev.candidate;
                }
              }
            }
          });
        });
        let us = {};
        router.subscribeToSession("webrtcrooms", user._id, (res2) => {
          if (Object.keys(res2.data.shared).length > 0) {
            for (const key in res2.data.shared) {
              let u = res2.data.shared[key];
              if (u.rooms) {
                for (const r in u.rooms) {
                  if (us[key]) {
                    if (!us[key][r]?.peerdescription && u.rooms[r].peerdescription) {
                      console.log(u.rooms[r], us[key][r]);
                      router.services.webrtc.openRTC(u.rooms[r]).then((room) => {
                        console.log("got peer description, connection is live");
                      });
                    }
                  }
                }
              }
              if (u.rooms && !us[key]) {
                document.getElementById("webrtc").insertAdjacentHTML("beforeend", `<div><span>User: ${key}</span><span>Rooms: <table>${Object.keys(u.rooms).map((room) => {
                  return `<tr><td>ID: ${u.rooms[room]._id}</td><td>Ice Candidates: ${u.rooms[room].hostcandidates ? Object.keys(u.rooms[room].hostcandidates).length : 0}</td>${user._id !== key ? `<td><button id='${u.rooms[room]._id}'>Connect</button></td>` : ``}</tr>`;
                })}</table></span></div>`);
                us[key] = true;
                if (user._id !== key)
                  Object.keys(u.rooms).map((roomid) => {
                    document.getElementById(u.rooms[roomid]._id).onclick = () => {
                      router.services.webrtc.openRTC(u.rooms[roomid]).then((room) => {
                        room.rtcReceive.addEventListener("icecandidate", (ev) => {
                          if (ev.candidate && room._id) {
                            if (!user.rooms)
                              user.rooms = {};
                            if (!user.rooms[room._id]) {
                              if (!room.peercandidates)
                                room.peercandidates = {};
                              user.rooms[room._id] = {
                                _id: room._id,
                                peerdescription: room.peerdescription,
                                peercandidates: room.peercandidates
                              };
                            } else {
                              user.rooms[room._id].peerdescription = room.peerdescription;
                              user.rooms[room._id].peercandidates[`peercandidate${Math.floor(Math.random() * 1e15)}`] = ev.candidate;
                            }
                          }
                        });
                        document.getElementById(u.rooms[roomid]._id).innerHTML = "Ping!";
                        document.getElementById(u.rooms[roomid]._id).onclick = () => {
                          router.services.webrtc.request({ route: "ping", origin: user._id }, room.channels.data, room._id);
                        };
                      });
                    };
                  });
              }
            }
          }
        });
      }
    });
    user.send(JSON.stringify({ route: "addUser", args: info }));
    router.run("userUpdateLoop", user);
    user.request({ route: "openSharedSession", args: { settings: { name: "testsession", propnames: { x: true, test: true } } } }).then((session) => {
      let res;
      if (session?._id)
        res = router.run("joinSession", session._id, user, session);
    });
  });
  console.log(p);
})();
