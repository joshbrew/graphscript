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

// ../../../node_modules/better-sse/build/index.js
var require_build = __commonJS({
  "../../../node_modules/better-sse/build/index.js"(exports, module2) {
    !function(e, t) {
      if ("object" == typeof exports && "object" == typeof module2)
        module2.exports = t();
      else if ("function" == typeof define && define.amd)
        define([], t);
      else {
        var s = t();
        for (var i in s)
          ("object" == typeof exports ? exports : e)[i] = s[i];
      }
    }(global, function() {
      return (() => {
        "use strict";
        var e = { n: (t2) => {
          var s2 = t2 && t2.__esModule ? () => t2.default : () => t2;
          return e.d(s2, { a: s2 }), s2;
        }, d: (t2, s2) => {
          for (var i2 in s2)
            e.o(s2, i2) && !e.o(t2, i2) && Object.defineProperty(t2, i2, { enumerable: true, get: s2[i2] });
        }, o: (e2, t2) => Object.prototype.hasOwnProperty.call(e2, t2), r: (e2) => {
          "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e2, "__esModule", { value: true });
        } }, t = {};
        e.r(t), e.d(t, { Channel: () => d, Session: () => a, createChannel: () => c, createSession: () => l });
        const s = require("crypto"), i = require("events");
        var n = e.n(i);
        class r extends n() {
          addListener(e2, t2) {
            return super.addListener(e2, t2);
          }
          prependListener(e2, t2) {
            return super.prependListener(e2, t2);
          }
          prependOnceListener(e2, t2) {
            return super.prependOnceListener(e2, t2);
          }
          on(e2, t2) {
            return super.on(e2, t2);
          }
          once(e2, t2) {
            return super.once(e2, t2);
          }
          emit(e2, ...t2) {
            return super.emit(e2, ...t2);
          }
          off(e2, t2) {
            return super.off(e2, t2);
          }
          removeListener(e2, t2) {
            return super.removeListener(e2, t2);
          }
        }
        const o = (e2) => JSON.stringify(e2), h = (e2) => {
          let t2 = e2;
          return t2 = t2.replace(/(\r\n|\r|\n)/g, "\n"), t2 = t2.replace(/\n+$/g, ""), t2;
        };
        class a extends r {
          constructor(e2, t2, i2 = {}) {
            var n2, r2, a2, l2, d2, c2, u;
            super(), this.lastId = "", this.isConnected = false, this.state = {}, this.onConnected = () => {
              var e3, t3, s2;
              const i3 = `http://${this.req.headers.host}${this.req.url}`, n3 = new URL(i3).searchParams;
              if (this.trustClientEventId) {
                const i4 = null !== (s2 = null !== (t3 = null !== (e3 = this.req.headers["last-event-id"]) && void 0 !== e3 ? e3 : n3.get("lastEventId")) && void 0 !== t3 ? t3 : n3.get("evs_last_event_id")) && void 0 !== s2 ? s2 : "";
                this.lastId = i4;
              }
              Object.entries(this.headers).forEach(([e4, t4]) => {
                this.res.setHeader(e4, null != t4 ? t4 : "");
              }), this.res.statusCode = this.statusCode, this.res.setHeader("Content-Type", "text/event-stream"), this.res.setHeader("Cache-Control", "no-cache, no-transform"), this.res.setHeader("Connection", "keep-alive"), this.res.flushHeaders(), n3.has("padding") && this.comment(" ".repeat(2049)).dispatch(), n3.has("evs_preamble") && this.comment(" ".repeat(2056)).dispatch(), null !== this.initialRetry && this.retry(this.initialRetry).dispatch(), null !== this.keepAliveInterval && (this.keepAliveTimer = setInterval(this.keepAlive, this.keepAliveInterval)), this.isConnected = true, this.emit("connected");
            }, this.onDisconnected = () => {
              this.keepAliveTimer && clearInterval(this.keepAliveTimer), this.isConnected = false, this.emit("disconnected");
            }, this.writeField = (e3, t3) => {
              const s2 = `${e3}:${this.sanitize(t3)}
`;
              return this.res.write(s2), this;
            }, this.keepAlive = () => {
              this.comment().dispatch();
            }, this.dispatch = () => (this.res.write("\n"), this), this.data = (e3) => {
              const t3 = this.serialize(e3);
              return this.writeField("data", t3), this;
            }, this.id = (e3) => {
              const t3 = e3 || "";
              return this.writeField("id", t3), this.lastId = t3, this;
            }, this.retry = (e3) => {
              const t3 = e3.toString();
              return this.writeField("retry", t3), this;
            }, this.comment = (e3) => (this.writeField("", null != e3 ? e3 : ""), this), this.push = (e3, t3, i3) => (t3 || (t3 = "message"), i3 || (i3 = (0, s.randomBytes)(4).toString("hex")), this.event(t3).id(i3).data(e3).dispatch(), this.emit("push", e3, t3, i3), this), this.stream = async (e3, t3 = {}) => {
              const { eventName: s2 = "stream" } = t3;
              return new Promise((t4, i3) => {
                e3.on("data", (e4) => {
                  let t5;
                  t5 = Buffer.isBuffer(e4) ? e4.toString() : e4, this.push(t5, s2);
                }), e3.once("end", () => t4(true)), e3.once("close", () => t4(true)), e3.once("error", (e4) => i3(e4));
              });
            }, this.iterate = async (e3, t3 = {}) => {
              const { eventName: s2 = "iteration" } = t3;
              for await (const t4 of e3)
                this.push(t4, s2);
            }, this.req = e2, this.res = t2, this.serialize = null !== (n2 = i2.serializer) && void 0 !== n2 ? n2 : o, this.sanitize = null !== (r2 = i2.sanitizer) && void 0 !== r2 ? r2 : h, this.trustClientEventId = null === (a2 = i2.trustClientEventId) || void 0 === a2 || a2, this.initialRetry = null === i2.retry ? null : null !== (l2 = i2.retry) && void 0 !== l2 ? l2 : 2e3, this.keepAliveInterval = null === i2.keepAlive ? null : null !== (d2 = i2.keepAlive) && void 0 !== d2 ? d2 : 1e4, this.statusCode = null !== (c2 = i2.statusCode) && void 0 !== c2 ? c2 : 200, this.headers = null !== (u = i2.headers) && void 0 !== u ? u : {}, this.req.on("close", this.onDisconnected), setImmediate(this.onConnected);
          }
          event(e2) {
            return this.writeField("event", e2), this;
          }
        }
        const l = (...e2) => new Promise((t2) => {
          const s2 = new a(...e2);
          s2.once("connected", () => {
            t2(s2);
          });
        });
        class d extends r {
          constructor() {
            super(), this.state = {}, this.sessions = [], this.broadcast = (e2, t2, s2 = {}) => {
              t2 || (t2 = "message");
              const i2 = s2.filter ? this.sessions.filter(s2.filter) : this.sessions;
              for (const s3 of i2)
                s3.push(e2, t2);
              return this.emit("broadcast", e2, t2), this;
            };
          }
          get activeSessions() {
            return this.sessions;
          }
          get sessionCount() {
            return this.sessions.length;
          }
          register(e2) {
            if (!e2.isConnected)
              throw new Error("Cannot register a non-active session.");
            return e2.once("disconnected", () => {
              this.deregister(e2), this.emit("session-disconnected", e2);
            }), this.sessions.push(e2), this.emit("session-registered", e2), this;
          }
          deregister(e2) {
            return this.sessions = this.sessions.filter((t2) => t2 !== e2), this.emit("session-deregistered", e2), this;
          }
        }
        const c = (...e2) => new d(...e2);
        return t;
      })();
    });
  }
});

// ../../../node_modules/ws/lib/stream.js
var require_stream = __commonJS({
  "../../../node_modules/ws/lib/stream.js"(exports, module2) {
    "use strict";
    var { Duplex } = require("stream");
    function emitClose(stream) {
      stream.emit("close");
    }
    function duplexOnEnd() {
      if (!this.destroyed && this._writableState.finished) {
        this.destroy();
      }
    }
    function duplexOnError(err) {
      this.removeListener("error", duplexOnError);
      this.destroy();
      if (this.listenerCount("error") === 0) {
        this.emit("error", err);
      }
    }
    function createWebSocketStream2(ws, options) {
      let terminateOnDestroy = true;
      const duplex = new Duplex({
        ...options,
        autoDestroy: false,
        emitClose: false,
        objectMode: false,
        writableObjectMode: false
      });
      ws.on("message", function message(msg, isBinary) {
        const data = !isBinary && duplex._readableState.objectMode ? msg.toString() : msg;
        if (!duplex.push(data))
          ws.pause();
      });
      ws.once("error", function error(err) {
        if (duplex.destroyed)
          return;
        terminateOnDestroy = false;
        duplex.destroy(err);
      });
      ws.once("close", function close() {
        if (duplex.destroyed)
          return;
        duplex.push(null);
      });
      duplex._destroy = function(err, callback) {
        if (ws.readyState === ws.CLOSED) {
          callback(err);
          process.nextTick(emitClose, duplex);
          return;
        }
        let called = false;
        ws.once("error", function error(err2) {
          called = true;
          callback(err2);
        });
        ws.once("close", function close() {
          if (!called)
            callback(err);
          process.nextTick(emitClose, duplex);
        });
        if (terminateOnDestroy)
          ws.terminate();
      };
      duplex._final = function(callback) {
        if (ws.readyState === ws.CONNECTING) {
          ws.once("open", function open() {
            duplex._final(callback);
          });
          return;
        }
        if (ws._socket === null)
          return;
        if (ws._socket._writableState.finished) {
          callback();
          if (duplex._readableState.endEmitted)
            duplex.destroy();
        } else {
          ws._socket.once("finish", function finish() {
            callback();
          });
          ws.close();
        }
      };
      duplex._read = function() {
        if (ws.isPaused)
          ws.resume();
      };
      duplex._write = function(chunk, encoding, callback) {
        if (ws.readyState === ws.CONNECTING) {
          ws.once("open", function open() {
            duplex._write(chunk, encoding, callback);
          });
          return;
        }
        ws.send(chunk, callback);
      };
      duplex.on("end", duplexOnEnd);
      duplex.on("error", duplexOnError);
      return duplex;
    }
    module2.exports = createWebSocketStream2;
  }
});

// ../../../node_modules/ws/lib/constants.js
var require_constants = __commonJS({
  "../../../node_modules/ws/lib/constants.js"(exports, module2) {
    "use strict";
    module2.exports = {
      BINARY_TYPES: ["nodebuffer", "arraybuffer", "fragments"],
      EMPTY_BUFFER: Buffer.alloc(0),
      GUID: "258EAFA5-E914-47DA-95CA-C5AB0DC85B11",
      kForOnEventAttribute: Symbol("kIsForOnEventAttribute"),
      kListener: Symbol("kListener"),
      kStatusCode: Symbol("status-code"),
      kWebSocket: Symbol("websocket"),
      NOOP: () => {
      }
    };
  }
});

// ../../../node_modules/ws/lib/buffer-util.js
var require_buffer_util = __commonJS({
  "../../../node_modules/ws/lib/buffer-util.js"(exports, module2) {
    "use strict";
    var { EMPTY_BUFFER } = require_constants();
    function concat(list, totalLength) {
      if (list.length === 0)
        return EMPTY_BUFFER;
      if (list.length === 1)
        return list[0];
      const target = Buffer.allocUnsafe(totalLength);
      let offset = 0;
      for (let i = 0; i < list.length; i++) {
        const buf = list[i];
        target.set(buf, offset);
        offset += buf.length;
      }
      if (offset < totalLength)
        return target.slice(0, offset);
      return target;
    }
    function _mask(source, mask, output, offset, length) {
      for (let i = 0; i < length; i++) {
        output[offset + i] = source[i] ^ mask[i & 3];
      }
    }
    function _unmask(buffer, mask) {
      for (let i = 0; i < buffer.length; i++) {
        buffer[i] ^= mask[i & 3];
      }
    }
    function toArrayBuffer(buf) {
      if (buf.byteLength === buf.buffer.byteLength) {
        return buf.buffer;
      }
      return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    }
    function toBuffer(data) {
      toBuffer.readOnly = true;
      if (Buffer.isBuffer(data))
        return data;
      let buf;
      if (data instanceof ArrayBuffer) {
        buf = Buffer.from(data);
      } else if (ArrayBuffer.isView(data)) {
        buf = Buffer.from(data.buffer, data.byteOffset, data.byteLength);
      } else {
        buf = Buffer.from(data);
        toBuffer.readOnly = false;
      }
      return buf;
    }
    try {
      const bufferUtil = require("bufferutil");
      module2.exports = {
        concat,
        mask(source, mask, output, offset, length) {
          if (length < 48)
            _mask(source, mask, output, offset, length);
          else
            bufferUtil.mask(source, mask, output, offset, length);
        },
        toArrayBuffer,
        toBuffer,
        unmask(buffer, mask) {
          if (buffer.length < 32)
            _unmask(buffer, mask);
          else
            bufferUtil.unmask(buffer, mask);
        }
      };
    } catch (e) {
      module2.exports = {
        concat,
        mask: _mask,
        toArrayBuffer,
        toBuffer,
        unmask: _unmask
      };
    }
  }
});

// ../../../node_modules/ws/lib/limiter.js
var require_limiter = __commonJS({
  "../../../node_modules/ws/lib/limiter.js"(exports, module2) {
    "use strict";
    var kDone = Symbol("kDone");
    var kRun = Symbol("kRun");
    var Limiter = class {
      constructor(concurrency) {
        this[kDone] = () => {
          this.pending--;
          this[kRun]();
        };
        this.concurrency = concurrency || Infinity;
        this.jobs = [];
        this.pending = 0;
      }
      add(job) {
        this.jobs.push(job);
        this[kRun]();
      }
      [kRun]() {
        if (this.pending === this.concurrency)
          return;
        if (this.jobs.length) {
          const job = this.jobs.shift();
          this.pending++;
          job(this[kDone]);
        }
      }
    };
    module2.exports = Limiter;
  }
});

// ../../../node_modules/ws/lib/permessage-deflate.js
var require_permessage_deflate = __commonJS({
  "../../../node_modules/ws/lib/permessage-deflate.js"(exports, module2) {
    "use strict";
    var zlib = require("zlib");
    var bufferUtil = require_buffer_util();
    var Limiter = require_limiter();
    var { kStatusCode } = require_constants();
    var TRAILER = Buffer.from([0, 0, 255, 255]);
    var kPerMessageDeflate = Symbol("permessage-deflate");
    var kTotalLength = Symbol("total-length");
    var kCallback = Symbol("callback");
    var kBuffers = Symbol("buffers");
    var kError = Symbol("error");
    var zlibLimiter;
    var PerMessageDeflate = class {
      constructor(options, isServer, maxPayload) {
        this._maxPayload = maxPayload | 0;
        this._options = options || {};
        this._threshold = this._options.threshold !== void 0 ? this._options.threshold : 1024;
        this._isServer = !!isServer;
        this._deflate = null;
        this._inflate = null;
        this.params = null;
        if (!zlibLimiter) {
          const concurrency = this._options.concurrencyLimit !== void 0 ? this._options.concurrencyLimit : 10;
          zlibLimiter = new Limiter(concurrency);
        }
      }
      static get extensionName() {
        return "permessage-deflate";
      }
      offer() {
        const params = {};
        if (this._options.serverNoContextTakeover) {
          params.server_no_context_takeover = true;
        }
        if (this._options.clientNoContextTakeover) {
          params.client_no_context_takeover = true;
        }
        if (this._options.serverMaxWindowBits) {
          params.server_max_window_bits = this._options.serverMaxWindowBits;
        }
        if (this._options.clientMaxWindowBits) {
          params.client_max_window_bits = this._options.clientMaxWindowBits;
        } else if (this._options.clientMaxWindowBits == null) {
          params.client_max_window_bits = true;
        }
        return params;
      }
      accept(configurations) {
        configurations = this.normalizeParams(configurations);
        this.params = this._isServer ? this.acceptAsServer(configurations) : this.acceptAsClient(configurations);
        return this.params;
      }
      cleanup() {
        if (this._inflate) {
          this._inflate.close();
          this._inflate = null;
        }
        if (this._deflate) {
          const callback = this._deflate[kCallback];
          this._deflate.close();
          this._deflate = null;
          if (callback) {
            callback(
              new Error(
                "The deflate stream was closed while data was being processed"
              )
            );
          }
        }
      }
      acceptAsServer(offers) {
        const opts = this._options;
        const accepted = offers.find((params) => {
          if (opts.serverNoContextTakeover === false && params.server_no_context_takeover || params.server_max_window_bits && (opts.serverMaxWindowBits === false || typeof opts.serverMaxWindowBits === "number" && opts.serverMaxWindowBits > params.server_max_window_bits) || typeof opts.clientMaxWindowBits === "number" && !params.client_max_window_bits) {
            return false;
          }
          return true;
        });
        if (!accepted) {
          throw new Error("None of the extension offers can be accepted");
        }
        if (opts.serverNoContextTakeover) {
          accepted.server_no_context_takeover = true;
        }
        if (opts.clientNoContextTakeover) {
          accepted.client_no_context_takeover = true;
        }
        if (typeof opts.serverMaxWindowBits === "number") {
          accepted.server_max_window_bits = opts.serverMaxWindowBits;
        }
        if (typeof opts.clientMaxWindowBits === "number") {
          accepted.client_max_window_bits = opts.clientMaxWindowBits;
        } else if (accepted.client_max_window_bits === true || opts.clientMaxWindowBits === false) {
          delete accepted.client_max_window_bits;
        }
        return accepted;
      }
      acceptAsClient(response) {
        const params = response[0];
        if (this._options.clientNoContextTakeover === false && params.client_no_context_takeover) {
          throw new Error('Unexpected parameter "client_no_context_takeover"');
        }
        if (!params.client_max_window_bits) {
          if (typeof this._options.clientMaxWindowBits === "number") {
            params.client_max_window_bits = this._options.clientMaxWindowBits;
          }
        } else if (this._options.clientMaxWindowBits === false || typeof this._options.clientMaxWindowBits === "number" && params.client_max_window_bits > this._options.clientMaxWindowBits) {
          throw new Error(
            'Unexpected or invalid parameter "client_max_window_bits"'
          );
        }
        return params;
      }
      normalizeParams(configurations) {
        configurations.forEach((params) => {
          Object.keys(params).forEach((key) => {
            let value = params[key];
            if (value.length > 1) {
              throw new Error(`Parameter "${key}" must have only a single value`);
            }
            value = value[0];
            if (key === "client_max_window_bits") {
              if (value !== true) {
                const num = +value;
                if (!Number.isInteger(num) || num < 8 || num > 15) {
                  throw new TypeError(
                    `Invalid value for parameter "${key}": ${value}`
                  );
                }
                value = num;
              } else if (!this._isServer) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
            } else if (key === "server_max_window_bits") {
              const num = +value;
              if (!Number.isInteger(num) || num < 8 || num > 15) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
              value = num;
            } else if (key === "client_no_context_takeover" || key === "server_no_context_takeover") {
              if (value !== true) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value}`
                );
              }
            } else {
              throw new Error(`Unknown parameter "${key}"`);
            }
            params[key] = value;
          });
        });
        return configurations;
      }
      decompress(data, fin, callback) {
        zlibLimiter.add((done) => {
          this._decompress(data, fin, (err, result) => {
            done();
            callback(err, result);
          });
        });
      }
      compress(data, fin, callback) {
        zlibLimiter.add((done) => {
          this._compress(data, fin, (err, result) => {
            done();
            callback(err, result);
          });
        });
      }
      _decompress(data, fin, callback) {
        const endpoint = this._isServer ? "client" : "server";
        if (!this._inflate) {
          const key = `${endpoint}_max_window_bits`;
          const windowBits = typeof this.params[key] !== "number" ? zlib.Z_DEFAULT_WINDOWBITS : this.params[key];
          this._inflate = zlib.createInflateRaw({
            ...this._options.zlibInflateOptions,
            windowBits
          });
          this._inflate[kPerMessageDeflate] = this;
          this._inflate[kTotalLength] = 0;
          this._inflate[kBuffers] = [];
          this._inflate.on("error", inflateOnError);
          this._inflate.on("data", inflateOnData);
        }
        this._inflate[kCallback] = callback;
        this._inflate.write(data);
        if (fin)
          this._inflate.write(TRAILER);
        this._inflate.flush(() => {
          const err = this._inflate[kError];
          if (err) {
            this._inflate.close();
            this._inflate = null;
            callback(err);
            return;
          }
          const data2 = bufferUtil.concat(
            this._inflate[kBuffers],
            this._inflate[kTotalLength]
          );
          if (this._inflate._readableState.endEmitted) {
            this._inflate.close();
            this._inflate = null;
          } else {
            this._inflate[kTotalLength] = 0;
            this._inflate[kBuffers] = [];
            if (fin && this.params[`${endpoint}_no_context_takeover`]) {
              this._inflate.reset();
            }
          }
          callback(null, data2);
        });
      }
      _compress(data, fin, callback) {
        const endpoint = this._isServer ? "server" : "client";
        if (!this._deflate) {
          const key = `${endpoint}_max_window_bits`;
          const windowBits = typeof this.params[key] !== "number" ? zlib.Z_DEFAULT_WINDOWBITS : this.params[key];
          this._deflate = zlib.createDeflateRaw({
            ...this._options.zlibDeflateOptions,
            windowBits
          });
          this._deflate[kTotalLength] = 0;
          this._deflate[kBuffers] = [];
          this._deflate.on("data", deflateOnData);
        }
        this._deflate[kCallback] = callback;
        this._deflate.write(data);
        this._deflate.flush(zlib.Z_SYNC_FLUSH, () => {
          if (!this._deflate) {
            return;
          }
          let data2 = bufferUtil.concat(
            this._deflate[kBuffers],
            this._deflate[kTotalLength]
          );
          if (fin)
            data2 = data2.slice(0, data2.length - 4);
          this._deflate[kCallback] = null;
          this._deflate[kTotalLength] = 0;
          this._deflate[kBuffers] = [];
          if (fin && this.params[`${endpoint}_no_context_takeover`]) {
            this._deflate.reset();
          }
          callback(null, data2);
        });
      }
    };
    module2.exports = PerMessageDeflate;
    function deflateOnData(chunk) {
      this[kBuffers].push(chunk);
      this[kTotalLength] += chunk.length;
    }
    function inflateOnData(chunk) {
      this[kTotalLength] += chunk.length;
      if (this[kPerMessageDeflate]._maxPayload < 1 || this[kTotalLength] <= this[kPerMessageDeflate]._maxPayload) {
        this[kBuffers].push(chunk);
        return;
      }
      this[kError] = new RangeError("Max payload size exceeded");
      this[kError].code = "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH";
      this[kError][kStatusCode] = 1009;
      this.removeListener("data", inflateOnData);
      this.reset();
    }
    function inflateOnError(err) {
      this[kPerMessageDeflate]._inflate = null;
      err[kStatusCode] = 1007;
      this[kCallback](err);
    }
  }
});

// ../../../node_modules/ws/lib/validation.js
var require_validation = __commonJS({
  "../../../node_modules/ws/lib/validation.js"(exports, module2) {
    "use strict";
    var tokenChars = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      1,
      1,
      0,
      1,
      1,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      0,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      0,
      1,
      0,
      1,
      0
    ];
    function isValidStatusCode(code) {
      return code >= 1e3 && code <= 1014 && code !== 1004 && code !== 1005 && code !== 1006 || code >= 3e3 && code <= 4999;
    }
    function _isValidUTF8(buf) {
      const len = buf.length;
      let i = 0;
      while (i < len) {
        if ((buf[i] & 128) === 0) {
          i++;
        } else if ((buf[i] & 224) === 192) {
          if (i + 1 === len || (buf[i + 1] & 192) !== 128 || (buf[i] & 254) === 192) {
            return false;
          }
          i += 2;
        } else if ((buf[i] & 240) === 224) {
          if (i + 2 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || buf[i] === 224 && (buf[i + 1] & 224) === 128 || buf[i] === 237 && (buf[i + 1] & 224) === 160) {
            return false;
          }
          i += 3;
        } else if ((buf[i] & 248) === 240) {
          if (i + 3 >= len || (buf[i + 1] & 192) !== 128 || (buf[i + 2] & 192) !== 128 || (buf[i + 3] & 192) !== 128 || buf[i] === 240 && (buf[i + 1] & 240) === 128 || buf[i] === 244 && buf[i + 1] > 143 || buf[i] > 244) {
            return false;
          }
          i += 4;
        } else {
          return false;
        }
      }
      return true;
    }
    try {
      const isValidUTF8 = require("utf-8-validate");
      module2.exports = {
        isValidStatusCode,
        isValidUTF8(buf) {
          return buf.length < 150 ? _isValidUTF8(buf) : isValidUTF8(buf);
        },
        tokenChars
      };
    } catch (e) {
      module2.exports = {
        isValidStatusCode,
        isValidUTF8: _isValidUTF8,
        tokenChars
      };
    }
  }
});

// ../../../node_modules/ws/lib/receiver.js
var require_receiver = __commonJS({
  "../../../node_modules/ws/lib/receiver.js"(exports, module2) {
    "use strict";
    var { Writable } = require("stream");
    var PerMessageDeflate = require_permessage_deflate();
    var {
      BINARY_TYPES,
      EMPTY_BUFFER,
      kStatusCode,
      kWebSocket
    } = require_constants();
    var { concat, toArrayBuffer, unmask } = require_buffer_util();
    var { isValidStatusCode, isValidUTF8 } = require_validation();
    var GET_INFO = 0;
    var GET_PAYLOAD_LENGTH_16 = 1;
    var GET_PAYLOAD_LENGTH_64 = 2;
    var GET_MASK = 3;
    var GET_DATA = 4;
    var INFLATING = 5;
    var Receiver2 = class extends Writable {
      constructor(options = {}) {
        super();
        this._binaryType = options.binaryType || BINARY_TYPES[0];
        this._extensions = options.extensions || {};
        this._isServer = !!options.isServer;
        this._maxPayload = options.maxPayload | 0;
        this._skipUTF8Validation = !!options.skipUTF8Validation;
        this[kWebSocket] = void 0;
        this._bufferedBytes = 0;
        this._buffers = [];
        this._compressed = false;
        this._payloadLength = 0;
        this._mask = void 0;
        this._fragmented = 0;
        this._masked = false;
        this._fin = false;
        this._opcode = 0;
        this._totalPayloadLength = 0;
        this._messageLength = 0;
        this._fragments = [];
        this._state = GET_INFO;
        this._loop = false;
      }
      _write(chunk, encoding, cb) {
        if (this._opcode === 8 && this._state == GET_INFO)
          return cb();
        this._bufferedBytes += chunk.length;
        this._buffers.push(chunk);
        this.startLoop(cb);
      }
      consume(n) {
        this._bufferedBytes -= n;
        if (n === this._buffers[0].length)
          return this._buffers.shift();
        if (n < this._buffers[0].length) {
          const buf = this._buffers[0];
          this._buffers[0] = buf.slice(n);
          return buf.slice(0, n);
        }
        const dst = Buffer.allocUnsafe(n);
        do {
          const buf = this._buffers[0];
          const offset = dst.length - n;
          if (n >= buf.length) {
            dst.set(this._buffers.shift(), offset);
          } else {
            dst.set(new Uint8Array(buf.buffer, buf.byteOffset, n), offset);
            this._buffers[0] = buf.slice(n);
          }
          n -= buf.length;
        } while (n > 0);
        return dst;
      }
      startLoop(cb) {
        let err;
        this._loop = true;
        do {
          switch (this._state) {
            case GET_INFO:
              err = this.getInfo();
              break;
            case GET_PAYLOAD_LENGTH_16:
              err = this.getPayloadLength16();
              break;
            case GET_PAYLOAD_LENGTH_64:
              err = this.getPayloadLength64();
              break;
            case GET_MASK:
              this.getMask();
              break;
            case GET_DATA:
              err = this.getData(cb);
              break;
            default:
              this._loop = false;
              return;
          }
        } while (this._loop);
        cb(err);
      }
      getInfo() {
        if (this._bufferedBytes < 2) {
          this._loop = false;
          return;
        }
        const buf = this.consume(2);
        if ((buf[0] & 48) !== 0) {
          this._loop = false;
          return error(
            RangeError,
            "RSV2 and RSV3 must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_RSV_2_3"
          );
        }
        const compressed = (buf[0] & 64) === 64;
        if (compressed && !this._extensions[PerMessageDeflate.extensionName]) {
          this._loop = false;
          return error(
            RangeError,
            "RSV1 must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_RSV_1"
          );
        }
        this._fin = (buf[0] & 128) === 128;
        this._opcode = buf[0] & 15;
        this._payloadLength = buf[1] & 127;
        if (this._opcode === 0) {
          if (compressed) {
            this._loop = false;
            return error(
              RangeError,
              "RSV1 must be clear",
              true,
              1002,
              "WS_ERR_UNEXPECTED_RSV_1"
            );
          }
          if (!this._fragmented) {
            this._loop = false;
            return error(
              RangeError,
              "invalid opcode 0",
              true,
              1002,
              "WS_ERR_INVALID_OPCODE"
            );
          }
          this._opcode = this._fragmented;
        } else if (this._opcode === 1 || this._opcode === 2) {
          if (this._fragmented) {
            this._loop = false;
            return error(
              RangeError,
              `invalid opcode ${this._opcode}`,
              true,
              1002,
              "WS_ERR_INVALID_OPCODE"
            );
          }
          this._compressed = compressed;
        } else if (this._opcode > 7 && this._opcode < 11) {
          if (!this._fin) {
            this._loop = false;
            return error(
              RangeError,
              "FIN must be set",
              true,
              1002,
              "WS_ERR_EXPECTED_FIN"
            );
          }
          if (compressed) {
            this._loop = false;
            return error(
              RangeError,
              "RSV1 must be clear",
              true,
              1002,
              "WS_ERR_UNEXPECTED_RSV_1"
            );
          }
          if (this._payloadLength > 125) {
            this._loop = false;
            return error(
              RangeError,
              `invalid payload length ${this._payloadLength}`,
              true,
              1002,
              "WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH"
            );
          }
        } else {
          this._loop = false;
          return error(
            RangeError,
            `invalid opcode ${this._opcode}`,
            true,
            1002,
            "WS_ERR_INVALID_OPCODE"
          );
        }
        if (!this._fin && !this._fragmented)
          this._fragmented = this._opcode;
        this._masked = (buf[1] & 128) === 128;
        if (this._isServer) {
          if (!this._masked) {
            this._loop = false;
            return error(
              RangeError,
              "MASK must be set",
              true,
              1002,
              "WS_ERR_EXPECTED_MASK"
            );
          }
        } else if (this._masked) {
          this._loop = false;
          return error(
            RangeError,
            "MASK must be clear",
            true,
            1002,
            "WS_ERR_UNEXPECTED_MASK"
          );
        }
        if (this._payloadLength === 126)
          this._state = GET_PAYLOAD_LENGTH_16;
        else if (this._payloadLength === 127)
          this._state = GET_PAYLOAD_LENGTH_64;
        else
          return this.haveLength();
      }
      getPayloadLength16() {
        if (this._bufferedBytes < 2) {
          this._loop = false;
          return;
        }
        this._payloadLength = this.consume(2).readUInt16BE(0);
        return this.haveLength();
      }
      getPayloadLength64() {
        if (this._bufferedBytes < 8) {
          this._loop = false;
          return;
        }
        const buf = this.consume(8);
        const num = buf.readUInt32BE(0);
        if (num > Math.pow(2, 53 - 32) - 1) {
          this._loop = false;
          return error(
            RangeError,
            "Unsupported WebSocket frame: payload length > 2^53 - 1",
            false,
            1009,
            "WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH"
          );
        }
        this._payloadLength = num * Math.pow(2, 32) + buf.readUInt32BE(4);
        return this.haveLength();
      }
      haveLength() {
        if (this._payloadLength && this._opcode < 8) {
          this._totalPayloadLength += this._payloadLength;
          if (this._totalPayloadLength > this._maxPayload && this._maxPayload > 0) {
            this._loop = false;
            return error(
              RangeError,
              "Max payload size exceeded",
              false,
              1009,
              "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"
            );
          }
        }
        if (this._masked)
          this._state = GET_MASK;
        else
          this._state = GET_DATA;
      }
      getMask() {
        if (this._bufferedBytes < 4) {
          this._loop = false;
          return;
        }
        this._mask = this.consume(4);
        this._state = GET_DATA;
      }
      getData(cb) {
        let data = EMPTY_BUFFER;
        if (this._payloadLength) {
          if (this._bufferedBytes < this._payloadLength) {
            this._loop = false;
            return;
          }
          data = this.consume(this._payloadLength);
          if (this._masked && (this._mask[0] | this._mask[1] | this._mask[2] | this._mask[3]) !== 0) {
            unmask(data, this._mask);
          }
        }
        if (this._opcode > 7)
          return this.controlMessage(data);
        if (this._compressed) {
          this._state = INFLATING;
          this.decompress(data, cb);
          return;
        }
        if (data.length) {
          this._messageLength = this._totalPayloadLength;
          this._fragments.push(data);
        }
        return this.dataMessage();
      }
      decompress(data, cb) {
        const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
        perMessageDeflate.decompress(data, this._fin, (err, buf) => {
          if (err)
            return cb(err);
          if (buf.length) {
            this._messageLength += buf.length;
            if (this._messageLength > this._maxPayload && this._maxPayload > 0) {
              return cb(
                error(
                  RangeError,
                  "Max payload size exceeded",
                  false,
                  1009,
                  "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"
                )
              );
            }
            this._fragments.push(buf);
          }
          const er = this.dataMessage();
          if (er)
            return cb(er);
          this.startLoop(cb);
        });
      }
      dataMessage() {
        if (this._fin) {
          const messageLength = this._messageLength;
          const fragments = this._fragments;
          this._totalPayloadLength = 0;
          this._messageLength = 0;
          this._fragmented = 0;
          this._fragments = [];
          if (this._opcode === 2) {
            let data;
            if (this._binaryType === "nodebuffer") {
              data = concat(fragments, messageLength);
            } else if (this._binaryType === "arraybuffer") {
              data = toArrayBuffer(concat(fragments, messageLength));
            } else {
              data = fragments;
            }
            this.emit("message", data, true);
          } else {
            const buf = concat(fragments, messageLength);
            if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
              this._loop = false;
              return error(
                Error,
                "invalid UTF-8 sequence",
                true,
                1007,
                "WS_ERR_INVALID_UTF8"
              );
            }
            this.emit("message", buf, false);
          }
        }
        this._state = GET_INFO;
      }
      controlMessage(data) {
        if (this._opcode === 8) {
          this._loop = false;
          if (data.length === 0) {
            this.emit("conclude", 1005, EMPTY_BUFFER);
            this.end();
          } else if (data.length === 1) {
            return error(
              RangeError,
              "invalid payload length 1",
              true,
              1002,
              "WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH"
            );
          } else {
            const code = data.readUInt16BE(0);
            if (!isValidStatusCode(code)) {
              return error(
                RangeError,
                `invalid status code ${code}`,
                true,
                1002,
                "WS_ERR_INVALID_CLOSE_CODE"
              );
            }
            const buf = data.slice(2);
            if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
              return error(
                Error,
                "invalid UTF-8 sequence",
                true,
                1007,
                "WS_ERR_INVALID_UTF8"
              );
            }
            this.emit("conclude", code, buf);
            this.end();
          }
        } else if (this._opcode === 9) {
          this.emit("ping", data);
        } else {
          this.emit("pong", data);
        }
        this._state = GET_INFO;
      }
    };
    module2.exports = Receiver2;
    function error(ErrorCtor, message, prefix, statusCode, errorCode) {
      const err = new ErrorCtor(
        prefix ? `Invalid WebSocket frame: ${message}` : message
      );
      Error.captureStackTrace(err, error);
      err.code = errorCode;
      err[kStatusCode] = statusCode;
      return err;
    }
  }
});

// ../../../node_modules/ws/lib/sender.js
var require_sender = __commonJS({
  "../../../node_modules/ws/lib/sender.js"(exports, module2) {
    "use strict";
    var net = require("net");
    var tls = require("tls");
    var { randomFillSync } = require("crypto");
    var PerMessageDeflate = require_permessage_deflate();
    var { EMPTY_BUFFER } = require_constants();
    var { isValidStatusCode } = require_validation();
    var { mask: applyMask, toBuffer } = require_buffer_util();
    var kByteLength = Symbol("kByteLength");
    var maskBuffer = Buffer.alloc(4);
    var Sender2 = class {
      constructor(socket, extensions, generateMask) {
        this._extensions = extensions || {};
        if (generateMask) {
          this._generateMask = generateMask;
          this._maskBuffer = Buffer.alloc(4);
        }
        this._socket = socket;
        this._firstFragment = true;
        this._compress = false;
        this._bufferedBytes = 0;
        this._deflating = false;
        this._queue = [];
      }
      static frame(data, options) {
        let mask;
        let merge = false;
        let offset = 2;
        let skipMasking = false;
        if (options.mask) {
          mask = options.maskBuffer || maskBuffer;
          if (options.generateMask) {
            options.generateMask(mask);
          } else {
            randomFillSync(mask, 0, 4);
          }
          skipMasking = (mask[0] | mask[1] | mask[2] | mask[3]) === 0;
          offset = 6;
        }
        let dataLength;
        if (typeof data === "string") {
          if ((!options.mask || skipMasking) && options[kByteLength] !== void 0) {
            dataLength = options[kByteLength];
          } else {
            data = Buffer.from(data);
            dataLength = data.length;
          }
        } else {
          dataLength = data.length;
          merge = options.mask && options.readOnly && !skipMasking;
        }
        let payloadLength = dataLength;
        if (dataLength >= 65536) {
          offset += 8;
          payloadLength = 127;
        } else if (dataLength > 125) {
          offset += 2;
          payloadLength = 126;
        }
        const target = Buffer.allocUnsafe(merge ? dataLength + offset : offset);
        target[0] = options.fin ? options.opcode | 128 : options.opcode;
        if (options.rsv1)
          target[0] |= 64;
        target[1] = payloadLength;
        if (payloadLength === 126) {
          target.writeUInt16BE(dataLength, 2);
        } else if (payloadLength === 127) {
          target[2] = target[3] = 0;
          target.writeUIntBE(dataLength, 4, 6);
        }
        if (!options.mask)
          return [target, data];
        target[1] |= 128;
        target[offset - 4] = mask[0];
        target[offset - 3] = mask[1];
        target[offset - 2] = mask[2];
        target[offset - 1] = mask[3];
        if (skipMasking)
          return [target, data];
        if (merge) {
          applyMask(data, mask, target, offset, dataLength);
          return [target];
        }
        applyMask(data, mask, data, 0, dataLength);
        return [target, data];
      }
      close(code, data, mask, cb) {
        let buf;
        if (code === void 0) {
          buf = EMPTY_BUFFER;
        } else if (typeof code !== "number" || !isValidStatusCode(code)) {
          throw new TypeError("First argument must be a valid error code number");
        } else if (data === void 0 || !data.length) {
          buf = Buffer.allocUnsafe(2);
          buf.writeUInt16BE(code, 0);
        } else {
          const length = Buffer.byteLength(data);
          if (length > 123) {
            throw new RangeError("The message must not be greater than 123 bytes");
          }
          buf = Buffer.allocUnsafe(2 + length);
          buf.writeUInt16BE(code, 0);
          if (typeof data === "string") {
            buf.write(data, 2);
          } else {
            buf.set(data, 2);
          }
        }
        const options = {
          [kByteLength]: buf.length,
          fin: true,
          generateMask: this._generateMask,
          mask,
          maskBuffer: this._maskBuffer,
          opcode: 8,
          readOnly: false,
          rsv1: false
        };
        if (this._deflating) {
          this.enqueue([this.dispatch, buf, false, options, cb]);
        } else {
          this.sendFrame(Sender2.frame(buf, options), cb);
        }
      }
      ping(data, mask, cb) {
        let byteLength;
        let readOnly;
        if (typeof data === "string") {
          byteLength = Buffer.byteLength(data);
          readOnly = false;
        } else {
          data = toBuffer(data);
          byteLength = data.length;
          readOnly = toBuffer.readOnly;
        }
        if (byteLength > 125) {
          throw new RangeError("The data size must not be greater than 125 bytes");
        }
        const options = {
          [kByteLength]: byteLength,
          fin: true,
          generateMask: this._generateMask,
          mask,
          maskBuffer: this._maskBuffer,
          opcode: 9,
          readOnly,
          rsv1: false
        };
        if (this._deflating) {
          this.enqueue([this.dispatch, data, false, options, cb]);
        } else {
          this.sendFrame(Sender2.frame(data, options), cb);
        }
      }
      pong(data, mask, cb) {
        let byteLength;
        let readOnly;
        if (typeof data === "string") {
          byteLength = Buffer.byteLength(data);
          readOnly = false;
        } else {
          data = toBuffer(data);
          byteLength = data.length;
          readOnly = toBuffer.readOnly;
        }
        if (byteLength > 125) {
          throw new RangeError("The data size must not be greater than 125 bytes");
        }
        const options = {
          [kByteLength]: byteLength,
          fin: true,
          generateMask: this._generateMask,
          mask,
          maskBuffer: this._maskBuffer,
          opcode: 10,
          readOnly,
          rsv1: false
        };
        if (this._deflating) {
          this.enqueue([this.dispatch, data, false, options, cb]);
        } else {
          this.sendFrame(Sender2.frame(data, options), cb);
        }
      }
      send(data, options, cb) {
        const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
        let opcode = options.binary ? 2 : 1;
        let rsv1 = options.compress;
        let byteLength;
        let readOnly;
        if (typeof data === "string") {
          byteLength = Buffer.byteLength(data);
          readOnly = false;
        } else {
          data = toBuffer(data);
          byteLength = data.length;
          readOnly = toBuffer.readOnly;
        }
        if (this._firstFragment) {
          this._firstFragment = false;
          if (rsv1 && perMessageDeflate && perMessageDeflate.params[perMessageDeflate._isServer ? "server_no_context_takeover" : "client_no_context_takeover"]) {
            rsv1 = byteLength >= perMessageDeflate._threshold;
          }
          this._compress = rsv1;
        } else {
          rsv1 = false;
          opcode = 0;
        }
        if (options.fin)
          this._firstFragment = true;
        if (perMessageDeflate) {
          const opts = {
            [kByteLength]: byteLength,
            fin: options.fin,
            generateMask: this._generateMask,
            mask: options.mask,
            maskBuffer: this._maskBuffer,
            opcode,
            readOnly,
            rsv1
          };
          if (this._deflating) {
            this.enqueue([this.dispatch, data, this._compress, opts, cb]);
          } else {
            this.dispatch(data, this._compress, opts, cb);
          }
        } else {
          this.sendFrame(
            Sender2.frame(data, {
              [kByteLength]: byteLength,
              fin: options.fin,
              generateMask: this._generateMask,
              mask: options.mask,
              maskBuffer: this._maskBuffer,
              opcode,
              readOnly,
              rsv1: false
            }),
            cb
          );
        }
      }
      dispatch(data, compress, options, cb) {
        if (!compress) {
          this.sendFrame(Sender2.frame(data, options), cb);
          return;
        }
        const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
        this._bufferedBytes += options[kByteLength];
        this._deflating = true;
        perMessageDeflate.compress(data, options.fin, (_, buf) => {
          if (this._socket.destroyed) {
            const err = new Error(
              "The socket was closed while data was being compressed"
            );
            if (typeof cb === "function")
              cb(err);
            for (let i = 0; i < this._queue.length; i++) {
              const params = this._queue[i];
              const callback = params[params.length - 1];
              if (typeof callback === "function")
                callback(err);
            }
            return;
          }
          this._bufferedBytes -= options[kByteLength];
          this._deflating = false;
          options.readOnly = false;
          this.sendFrame(Sender2.frame(buf, options), cb);
          this.dequeue();
        });
      }
      dequeue() {
        while (!this._deflating && this._queue.length) {
          const params = this._queue.shift();
          this._bufferedBytes -= params[3][kByteLength];
          Reflect.apply(params[0], this, params.slice(1));
        }
      }
      enqueue(params) {
        this._bufferedBytes += params[3][kByteLength];
        this._queue.push(params);
      }
      sendFrame(list, cb) {
        if (list.length === 2) {
          this._socket.cork();
          this._socket.write(list[0]);
          this._socket.write(list[1], cb);
          this._socket.uncork();
        } else {
          this._socket.write(list[0], cb);
        }
      }
    };
    module2.exports = Sender2;
  }
});

// ../../../node_modules/ws/lib/event-target.js
var require_event_target = __commonJS({
  "../../../node_modules/ws/lib/event-target.js"(exports, module2) {
    "use strict";
    var { kForOnEventAttribute, kListener } = require_constants();
    var kCode = Symbol("kCode");
    var kData = Symbol("kData");
    var kError = Symbol("kError");
    var kMessage = Symbol("kMessage");
    var kReason = Symbol("kReason");
    var kTarget = Symbol("kTarget");
    var kType = Symbol("kType");
    var kWasClean = Symbol("kWasClean");
    var Event = class {
      constructor(type) {
        this[kTarget] = null;
        this[kType] = type;
      }
      get target() {
        return this[kTarget];
      }
      get type() {
        return this[kType];
      }
    };
    Object.defineProperty(Event.prototype, "target", { enumerable: true });
    Object.defineProperty(Event.prototype, "type", { enumerable: true });
    var CloseEvent = class extends Event {
      constructor(type, options = {}) {
        super(type);
        this[kCode] = options.code === void 0 ? 0 : options.code;
        this[kReason] = options.reason === void 0 ? "" : options.reason;
        this[kWasClean] = options.wasClean === void 0 ? false : options.wasClean;
      }
      get code() {
        return this[kCode];
      }
      get reason() {
        return this[kReason];
      }
      get wasClean() {
        return this[kWasClean];
      }
    };
    Object.defineProperty(CloseEvent.prototype, "code", { enumerable: true });
    Object.defineProperty(CloseEvent.prototype, "reason", { enumerable: true });
    Object.defineProperty(CloseEvent.prototype, "wasClean", { enumerable: true });
    var ErrorEvent = class extends Event {
      constructor(type, options = {}) {
        super(type);
        this[kError] = options.error === void 0 ? null : options.error;
        this[kMessage] = options.message === void 0 ? "" : options.message;
      }
      get error() {
        return this[kError];
      }
      get message() {
        return this[kMessage];
      }
    };
    Object.defineProperty(ErrorEvent.prototype, "error", { enumerable: true });
    Object.defineProperty(ErrorEvent.prototype, "message", { enumerable: true });
    var MessageEvent = class extends Event {
      constructor(type, options = {}) {
        super(type);
        this[kData] = options.data === void 0 ? null : options.data;
      }
      get data() {
        return this[kData];
      }
    };
    Object.defineProperty(MessageEvent.prototype, "data", { enumerable: true });
    var EventTarget = {
      addEventListener(type, listener, options = {}) {
        let wrapper;
        if (type === "message") {
          wrapper = function onMessage(data, isBinary) {
            const event = new MessageEvent("message", {
              data: isBinary ? data : data.toString()
            });
            event[kTarget] = this;
            listener.call(this, event);
          };
        } else if (type === "close") {
          wrapper = function onClose(code, message) {
            const event = new CloseEvent("close", {
              code,
              reason: message.toString(),
              wasClean: this._closeFrameReceived && this._closeFrameSent
            });
            event[kTarget] = this;
            listener.call(this, event);
          };
        } else if (type === "error") {
          wrapper = function onError(error) {
            const event = new ErrorEvent("error", {
              error,
              message: error.message
            });
            event[kTarget] = this;
            listener.call(this, event);
          };
        } else if (type === "open") {
          wrapper = function onOpen() {
            const event = new Event("open");
            event[kTarget] = this;
            listener.call(this, event);
          };
        } else {
          return;
        }
        wrapper[kForOnEventAttribute] = !!options[kForOnEventAttribute];
        wrapper[kListener] = listener;
        if (options.once) {
          this.once(type, wrapper);
        } else {
          this.on(type, wrapper);
        }
      },
      removeEventListener(type, handler) {
        for (const listener of this.listeners(type)) {
          if (listener[kListener] === handler && !listener[kForOnEventAttribute]) {
            this.removeListener(type, listener);
            break;
          }
        }
      }
    };
    module2.exports = {
      CloseEvent,
      ErrorEvent,
      Event,
      EventTarget,
      MessageEvent
    };
  }
});

// ../../../node_modules/ws/lib/extension.js
var require_extension = __commonJS({
  "../../../node_modules/ws/lib/extension.js"(exports, module2) {
    "use strict";
    var { tokenChars } = require_validation();
    function push(dest, name, elem) {
      if (dest[name] === void 0)
        dest[name] = [elem];
      else
        dest[name].push(elem);
    }
    function parse(header) {
      const offers = /* @__PURE__ */ Object.create(null);
      let params = /* @__PURE__ */ Object.create(null);
      let mustUnescape = false;
      let isEscaping = false;
      let inQuotes = false;
      let extensionName;
      let paramName;
      let start = -1;
      let code = -1;
      let end = -1;
      let i = 0;
      for (; i < header.length; i++) {
        code = header.charCodeAt(i);
        if (extensionName === void 0) {
          if (end === -1 && tokenChars[code] === 1) {
            if (start === -1)
              start = i;
          } else if (i !== 0 && (code === 32 || code === 9)) {
            if (end === -1 && start !== -1)
              end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1)
              end = i;
            const name = header.slice(start, end);
            if (code === 44) {
              push(offers, name, params);
              params = /* @__PURE__ */ Object.create(null);
            } else {
              extensionName = name;
            }
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        } else if (paramName === void 0) {
          if (end === -1 && tokenChars[code] === 1) {
            if (start === -1)
              start = i;
          } else if (code === 32 || code === 9) {
            if (end === -1 && start !== -1)
              end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1)
              end = i;
            push(params, header.slice(start, end), true);
            if (code === 44) {
              push(offers, extensionName, params);
              params = /* @__PURE__ */ Object.create(null);
              extensionName = void 0;
            }
            start = end = -1;
          } else if (code === 61 && start !== -1 && end === -1) {
            paramName = header.slice(start, i);
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        } else {
          if (isEscaping) {
            if (tokenChars[code] !== 1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (start === -1)
              start = i;
            else if (!mustUnescape)
              mustUnescape = true;
            isEscaping = false;
          } else if (inQuotes) {
            if (tokenChars[code] === 1) {
              if (start === -1)
                start = i;
            } else if (code === 34 && start !== -1) {
              inQuotes = false;
              end = i;
            } else if (code === 92) {
              isEscaping = true;
            } else {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
          } else if (code === 34 && header.charCodeAt(i - 1) === 61) {
            inQuotes = true;
          } else if (end === -1 && tokenChars[code] === 1) {
            if (start === -1)
              start = i;
          } else if (start !== -1 && (code === 32 || code === 9)) {
            if (end === -1)
              end = i;
          } else if (code === 59 || code === 44) {
            if (start === -1) {
              throw new SyntaxError(`Unexpected character at index ${i}`);
            }
            if (end === -1)
              end = i;
            let value = header.slice(start, end);
            if (mustUnescape) {
              value = value.replace(/\\/g, "");
              mustUnescape = false;
            }
            push(params, paramName, value);
            if (code === 44) {
              push(offers, extensionName, params);
              params = /* @__PURE__ */ Object.create(null);
              extensionName = void 0;
            }
            paramName = void 0;
            start = end = -1;
          } else {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
        }
      }
      if (start === -1 || inQuotes || code === 32 || code === 9) {
        throw new SyntaxError("Unexpected end of input");
      }
      if (end === -1)
        end = i;
      const token = header.slice(start, end);
      if (extensionName === void 0) {
        push(offers, token, params);
      } else {
        if (paramName === void 0) {
          push(params, token, true);
        } else if (mustUnescape) {
          push(params, paramName, token.replace(/\\/g, ""));
        } else {
          push(params, paramName, token);
        }
        push(offers, extensionName, params);
      }
      return offers;
    }
    function format(extensions) {
      return Object.keys(extensions).map((extension) => {
        let configurations = extensions[extension];
        if (!Array.isArray(configurations))
          configurations = [configurations];
        return configurations.map((params) => {
          return [extension].concat(
            Object.keys(params).map((k) => {
              let values = params[k];
              if (!Array.isArray(values))
                values = [values];
              return values.map((v) => v === true ? k : `${k}=${v}`).join("; ");
            })
          ).join("; ");
        }).join(", ");
      }).join(", ");
    }
    module2.exports = { format, parse };
  }
});

// ../../../node_modules/ws/lib/websocket.js
var require_websocket = __commonJS({
  "../../../node_modules/ws/lib/websocket.js"(exports, module2) {
    "use strict";
    var EventEmitter = require("events");
    var https2 = require("https");
    var http2 = require("http");
    var net = require("net");
    var tls = require("tls");
    var { randomBytes, createHash } = require("crypto");
    var { Readable } = require("stream");
    var { URL: URL2 } = require("url");
    var PerMessageDeflate = require_permessage_deflate();
    var Receiver2 = require_receiver();
    var Sender2 = require_sender();
    var {
      BINARY_TYPES,
      EMPTY_BUFFER,
      GUID,
      kForOnEventAttribute,
      kListener,
      kStatusCode,
      kWebSocket,
      NOOP
    } = require_constants();
    var {
      EventTarget: { addEventListener, removeEventListener }
    } = require_event_target();
    var { format, parse } = require_extension();
    var { toBuffer } = require_buffer_util();
    var closeTimeout = 30 * 1e3;
    var kAborted = Symbol("kAborted");
    var protocolVersions = [8, 13];
    var readyStates = ["CONNECTING", "OPEN", "CLOSING", "CLOSED"];
    var subprotocolRegex = /^[!#$%&'*+\-.0-9A-Z^_`|a-z~]+$/;
    var WebSocket3 = class extends EventEmitter {
      constructor(address, protocols, options) {
        super();
        this._binaryType = BINARY_TYPES[0];
        this._closeCode = 1006;
        this._closeFrameReceived = false;
        this._closeFrameSent = false;
        this._closeMessage = EMPTY_BUFFER;
        this._closeTimer = null;
        this._extensions = {};
        this._paused = false;
        this._protocol = "";
        this._readyState = WebSocket3.CONNECTING;
        this._receiver = null;
        this._sender = null;
        this._socket = null;
        if (address !== null) {
          this._bufferedAmount = 0;
          this._isServer = false;
          this._redirects = 0;
          if (protocols === void 0) {
            protocols = [];
          } else if (!Array.isArray(protocols)) {
            if (typeof protocols === "object" && protocols !== null) {
              options = protocols;
              protocols = [];
            } else {
              protocols = [protocols];
            }
          }
          initAsClient(this, address, protocols, options);
        } else {
          this._isServer = true;
        }
      }
      get binaryType() {
        return this._binaryType;
      }
      set binaryType(type) {
        if (!BINARY_TYPES.includes(type))
          return;
        this._binaryType = type;
        if (this._receiver)
          this._receiver._binaryType = type;
      }
      get bufferedAmount() {
        if (!this._socket)
          return this._bufferedAmount;
        return this._socket._writableState.length + this._sender._bufferedBytes;
      }
      get extensions() {
        return Object.keys(this._extensions).join();
      }
      get isPaused() {
        return this._paused;
      }
      get onclose() {
        return null;
      }
      get onerror() {
        return null;
      }
      get onopen() {
        return null;
      }
      get onmessage() {
        return null;
      }
      get protocol() {
        return this._protocol;
      }
      get readyState() {
        return this._readyState;
      }
      get url() {
        return this._url;
      }
      setSocket(socket, head, options) {
        const receiver = new Receiver2({
          binaryType: this.binaryType,
          extensions: this._extensions,
          isServer: this._isServer,
          maxPayload: options.maxPayload,
          skipUTF8Validation: options.skipUTF8Validation
        });
        this._sender = new Sender2(socket, this._extensions, options.generateMask);
        this._receiver = receiver;
        this._socket = socket;
        receiver[kWebSocket] = this;
        socket[kWebSocket] = this;
        receiver.on("conclude", receiverOnConclude);
        receiver.on("drain", receiverOnDrain);
        receiver.on("error", receiverOnError);
        receiver.on("message", receiverOnMessage);
        receiver.on("ping", receiverOnPing);
        receiver.on("pong", receiverOnPong);
        socket.setTimeout(0);
        socket.setNoDelay();
        if (head.length > 0)
          socket.unshift(head);
        socket.on("close", socketOnClose);
        socket.on("data", socketOnData);
        socket.on("end", socketOnEnd);
        socket.on("error", socketOnError);
        this._readyState = WebSocket3.OPEN;
        this.emit("open");
      }
      emitClose() {
        if (!this._socket) {
          this._readyState = WebSocket3.CLOSED;
          this.emit("close", this._closeCode, this._closeMessage);
          return;
        }
        if (this._extensions[PerMessageDeflate.extensionName]) {
          this._extensions[PerMessageDeflate.extensionName].cleanup();
        }
        this._receiver.removeAllListeners();
        this._readyState = WebSocket3.CLOSED;
        this.emit("close", this._closeCode, this._closeMessage);
      }
      close(code, data) {
        if (this.readyState === WebSocket3.CLOSED)
          return;
        if (this.readyState === WebSocket3.CONNECTING) {
          const msg = "WebSocket was closed before the connection was established";
          return abortHandshake(this, this._req, msg);
        }
        if (this.readyState === WebSocket3.CLOSING) {
          if (this._closeFrameSent && (this._closeFrameReceived || this._receiver._writableState.errorEmitted)) {
            this._socket.end();
          }
          return;
        }
        this._readyState = WebSocket3.CLOSING;
        this._sender.close(code, data, !this._isServer, (err) => {
          if (err)
            return;
          this._closeFrameSent = true;
          if (this._closeFrameReceived || this._receiver._writableState.errorEmitted) {
            this._socket.end();
          }
        });
        this._closeTimer = setTimeout(
          this._socket.destroy.bind(this._socket),
          closeTimeout
        );
      }
      pause() {
        if (this.readyState === WebSocket3.CONNECTING || this.readyState === WebSocket3.CLOSED) {
          return;
        }
        this._paused = true;
        this._socket.pause();
      }
      ping(data, mask, cb) {
        if (this.readyState === WebSocket3.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof data === "function") {
          cb = data;
          data = mask = void 0;
        } else if (typeof mask === "function") {
          cb = mask;
          mask = void 0;
        }
        if (typeof data === "number")
          data = data.toString();
        if (this.readyState !== WebSocket3.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        if (mask === void 0)
          mask = !this._isServer;
        this._sender.ping(data || EMPTY_BUFFER, mask, cb);
      }
      pong(data, mask, cb) {
        if (this.readyState === WebSocket3.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof data === "function") {
          cb = data;
          data = mask = void 0;
        } else if (typeof mask === "function") {
          cb = mask;
          mask = void 0;
        }
        if (typeof data === "number")
          data = data.toString();
        if (this.readyState !== WebSocket3.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        if (mask === void 0)
          mask = !this._isServer;
        this._sender.pong(data || EMPTY_BUFFER, mask, cb);
      }
      resume() {
        if (this.readyState === WebSocket3.CONNECTING || this.readyState === WebSocket3.CLOSED) {
          return;
        }
        this._paused = false;
        if (!this._receiver._writableState.needDrain)
          this._socket.resume();
      }
      send(data, options, cb) {
        if (this.readyState === WebSocket3.CONNECTING) {
          throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
        }
        if (typeof options === "function") {
          cb = options;
          options = {};
        }
        if (typeof data === "number")
          data = data.toString();
        if (this.readyState !== WebSocket3.OPEN) {
          sendAfterClose(this, data, cb);
          return;
        }
        const opts = {
          binary: typeof data !== "string",
          mask: !this._isServer,
          compress: true,
          fin: true,
          ...options
        };
        if (!this._extensions[PerMessageDeflate.extensionName]) {
          opts.compress = false;
        }
        this._sender.send(data || EMPTY_BUFFER, opts, cb);
      }
      terminate() {
        if (this.readyState === WebSocket3.CLOSED)
          return;
        if (this.readyState === WebSocket3.CONNECTING) {
          const msg = "WebSocket was closed before the connection was established";
          return abortHandshake(this, this._req, msg);
        }
        if (this._socket) {
          this._readyState = WebSocket3.CLOSING;
          this._socket.destroy();
        }
      }
    };
    Object.defineProperty(WebSocket3, "CONNECTING", {
      enumerable: true,
      value: readyStates.indexOf("CONNECTING")
    });
    Object.defineProperty(WebSocket3.prototype, "CONNECTING", {
      enumerable: true,
      value: readyStates.indexOf("CONNECTING")
    });
    Object.defineProperty(WebSocket3, "OPEN", {
      enumerable: true,
      value: readyStates.indexOf("OPEN")
    });
    Object.defineProperty(WebSocket3.prototype, "OPEN", {
      enumerable: true,
      value: readyStates.indexOf("OPEN")
    });
    Object.defineProperty(WebSocket3, "CLOSING", {
      enumerable: true,
      value: readyStates.indexOf("CLOSING")
    });
    Object.defineProperty(WebSocket3.prototype, "CLOSING", {
      enumerable: true,
      value: readyStates.indexOf("CLOSING")
    });
    Object.defineProperty(WebSocket3, "CLOSED", {
      enumerable: true,
      value: readyStates.indexOf("CLOSED")
    });
    Object.defineProperty(WebSocket3.prototype, "CLOSED", {
      enumerable: true,
      value: readyStates.indexOf("CLOSED")
    });
    [
      "binaryType",
      "bufferedAmount",
      "extensions",
      "isPaused",
      "protocol",
      "readyState",
      "url"
    ].forEach((property) => {
      Object.defineProperty(WebSocket3.prototype, property, { enumerable: true });
    });
    ["open", "error", "close", "message"].forEach((method) => {
      Object.defineProperty(WebSocket3.prototype, `on${method}`, {
        enumerable: true,
        get() {
          for (const listener of this.listeners(method)) {
            if (listener[kForOnEventAttribute])
              return listener[kListener];
          }
          return null;
        },
        set(handler) {
          for (const listener of this.listeners(method)) {
            if (listener[kForOnEventAttribute]) {
              this.removeListener(method, listener);
              break;
            }
          }
          if (typeof handler !== "function")
            return;
          this.addEventListener(method, handler, {
            [kForOnEventAttribute]: true
          });
        }
      });
    });
    WebSocket3.prototype.addEventListener = addEventListener;
    WebSocket3.prototype.removeEventListener = removeEventListener;
    module2.exports = WebSocket3;
    function initAsClient(websocket, address, protocols, options) {
      const opts = {
        protocolVersion: protocolVersions[1],
        maxPayload: 100 * 1024 * 1024,
        skipUTF8Validation: false,
        perMessageDeflate: true,
        followRedirects: false,
        maxRedirects: 10,
        ...options,
        createConnection: void 0,
        socketPath: void 0,
        hostname: void 0,
        protocol: void 0,
        timeout: void 0,
        method: "GET",
        host: void 0,
        path: void 0,
        port: void 0
      };
      if (!protocolVersions.includes(opts.protocolVersion)) {
        throw new RangeError(
          `Unsupported protocol version: ${opts.protocolVersion} (supported versions: ${protocolVersions.join(", ")})`
        );
      }
      let parsedUrl;
      if (address instanceof URL2) {
        parsedUrl = address;
        websocket._url = address.href;
      } else {
        try {
          parsedUrl = new URL2(address);
        } catch (e) {
          throw new SyntaxError(`Invalid URL: ${address}`);
        }
        websocket._url = address;
      }
      const isSecure = parsedUrl.protocol === "wss:";
      const isUnixSocket = parsedUrl.protocol === "ws+unix:";
      let invalidURLMessage;
      if (parsedUrl.protocol !== "ws:" && !isSecure && !isUnixSocket) {
        invalidURLMessage = `The URL's protocol must be one of "ws:", "wss:", or "ws+unix:"`;
      } else if (isUnixSocket && !parsedUrl.pathname) {
        invalidURLMessage = "The URL's pathname is empty";
      } else if (parsedUrl.hash) {
        invalidURLMessage = "The URL contains a fragment identifier";
      }
      if (invalidURLMessage) {
        const err = new SyntaxError(invalidURLMessage);
        if (websocket._redirects === 0) {
          throw err;
        } else {
          emitErrorAndClose(websocket, err);
          return;
        }
      }
      const defaultPort = isSecure ? 443 : 80;
      const key = randomBytes(16).toString("base64");
      const request = isSecure ? https2.request : http2.request;
      const protocolSet = /* @__PURE__ */ new Set();
      let perMessageDeflate;
      opts.createConnection = isSecure ? tlsConnect : netConnect;
      opts.defaultPort = opts.defaultPort || defaultPort;
      opts.port = parsedUrl.port || defaultPort;
      opts.host = parsedUrl.hostname.startsWith("[") ? parsedUrl.hostname.slice(1, -1) : parsedUrl.hostname;
      opts.headers = {
        "Sec-WebSocket-Version": opts.protocolVersion,
        "Sec-WebSocket-Key": key,
        Connection: "Upgrade",
        Upgrade: "websocket",
        ...opts.headers
      };
      opts.path = parsedUrl.pathname + parsedUrl.search;
      opts.timeout = opts.handshakeTimeout;
      if (opts.perMessageDeflate) {
        perMessageDeflate = new PerMessageDeflate(
          opts.perMessageDeflate !== true ? opts.perMessageDeflate : {},
          false,
          opts.maxPayload
        );
        opts.headers["Sec-WebSocket-Extensions"] = format({
          [PerMessageDeflate.extensionName]: perMessageDeflate.offer()
        });
      }
      if (protocols.length) {
        for (const protocol of protocols) {
          if (typeof protocol !== "string" || !subprotocolRegex.test(protocol) || protocolSet.has(protocol)) {
            throw new SyntaxError(
              "An invalid or duplicated subprotocol was specified"
            );
          }
          protocolSet.add(protocol);
        }
        opts.headers["Sec-WebSocket-Protocol"] = protocols.join(",");
      }
      if (opts.origin) {
        if (opts.protocolVersion < 13) {
          opts.headers["Sec-WebSocket-Origin"] = opts.origin;
        } else {
          opts.headers.Origin = opts.origin;
        }
      }
      if (parsedUrl.username || parsedUrl.password) {
        opts.auth = `${parsedUrl.username}:${parsedUrl.password}`;
      }
      if (isUnixSocket) {
        const parts = opts.path.split(":");
        opts.socketPath = parts[0];
        opts.path = parts[1];
      }
      let req;
      if (opts.followRedirects) {
        if (websocket._redirects === 0) {
          websocket._originalSecure = isSecure;
          websocket._originalHost = parsedUrl.host;
          const headers = options && options.headers;
          options = { ...options, headers: {} };
          if (headers) {
            for (const [key2, value] of Object.entries(headers)) {
              options.headers[key2.toLowerCase()] = value;
            }
          }
        } else if (websocket.listenerCount("redirect") === 0) {
          const isSameHost = parsedUrl.host === websocket._originalHost;
          if (!isSameHost || websocket._originalSecure && !isSecure) {
            delete opts.headers.authorization;
            delete opts.headers.cookie;
            if (!isSameHost)
              delete opts.headers.host;
            opts.auth = void 0;
          }
        }
        if (opts.auth && !options.headers.authorization) {
          options.headers.authorization = "Basic " + Buffer.from(opts.auth).toString("base64");
        }
        req = websocket._req = request(opts);
        if (websocket._redirects) {
          websocket.emit("redirect", websocket.url, req);
        }
      } else {
        req = websocket._req = request(opts);
      }
      if (opts.timeout) {
        req.on("timeout", () => {
          abortHandshake(websocket, req, "Opening handshake has timed out");
        });
      }
      req.on("error", (err) => {
        if (req === null || req[kAborted])
          return;
        req = websocket._req = null;
        emitErrorAndClose(websocket, err);
      });
      req.on("response", (res) => {
        const location2 = res.headers.location;
        const statusCode = res.statusCode;
        if (location2 && opts.followRedirects && statusCode >= 300 && statusCode < 400) {
          if (++websocket._redirects > opts.maxRedirects) {
            abortHandshake(websocket, req, "Maximum redirects exceeded");
            return;
          }
          req.abort();
          let addr;
          try {
            addr = new URL2(location2, address);
          } catch (e) {
            const err = new SyntaxError(`Invalid URL: ${location2}`);
            emitErrorAndClose(websocket, err);
            return;
          }
          initAsClient(websocket, addr, protocols, options);
        } else if (!websocket.emit("unexpected-response", req, res)) {
          abortHandshake(
            websocket,
            req,
            `Unexpected server response: ${res.statusCode}`
          );
        }
      });
      req.on("upgrade", (res, socket, head) => {
        websocket.emit("upgrade", res);
        if (websocket.readyState !== WebSocket3.CONNECTING)
          return;
        req = websocket._req = null;
        if (res.headers.upgrade.toLowerCase() !== "websocket") {
          abortHandshake(websocket, socket, "Invalid Upgrade header");
          return;
        }
        const digest = createHash("sha1").update(key + GUID).digest("base64");
        if (res.headers["sec-websocket-accept"] !== digest) {
          abortHandshake(websocket, socket, "Invalid Sec-WebSocket-Accept header");
          return;
        }
        const serverProt = res.headers["sec-websocket-protocol"];
        let protError;
        if (serverProt !== void 0) {
          if (!protocolSet.size) {
            protError = "Server sent a subprotocol but none was requested";
          } else if (!protocolSet.has(serverProt)) {
            protError = "Server sent an invalid subprotocol";
          }
        } else if (protocolSet.size) {
          protError = "Server sent no subprotocol";
        }
        if (protError) {
          abortHandshake(websocket, socket, protError);
          return;
        }
        if (serverProt)
          websocket._protocol = serverProt;
        const secWebSocketExtensions = res.headers["sec-websocket-extensions"];
        if (secWebSocketExtensions !== void 0) {
          if (!perMessageDeflate) {
            const message = "Server sent a Sec-WebSocket-Extensions header but no extension was requested";
            abortHandshake(websocket, socket, message);
            return;
          }
          let extensions;
          try {
            extensions = parse(secWebSocketExtensions);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Extensions header";
            abortHandshake(websocket, socket, message);
            return;
          }
          const extensionNames = Object.keys(extensions);
          if (extensionNames.length !== 1 || extensionNames[0] !== PerMessageDeflate.extensionName) {
            const message = "Server indicated an extension that was not requested";
            abortHandshake(websocket, socket, message);
            return;
          }
          try {
            perMessageDeflate.accept(extensions[PerMessageDeflate.extensionName]);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Extensions header";
            abortHandshake(websocket, socket, message);
            return;
          }
          websocket._extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
        }
        websocket.setSocket(socket, head, {
          generateMask: opts.generateMask,
          maxPayload: opts.maxPayload,
          skipUTF8Validation: opts.skipUTF8Validation
        });
      });
      req.end();
    }
    function emitErrorAndClose(websocket, err) {
      websocket._readyState = WebSocket3.CLOSING;
      websocket.emit("error", err);
      websocket.emitClose();
    }
    function netConnect(options) {
      options.path = options.socketPath;
      return net.connect(options);
    }
    function tlsConnect(options) {
      options.path = void 0;
      if (!options.servername && options.servername !== "") {
        options.servername = net.isIP(options.host) ? "" : options.host;
      }
      return tls.connect(options);
    }
    function abortHandshake(websocket, stream, message) {
      websocket._readyState = WebSocket3.CLOSING;
      const err = new Error(message);
      Error.captureStackTrace(err, abortHandshake);
      if (stream.setHeader) {
        stream[kAborted] = true;
        stream.abort();
        if (stream.socket && !stream.socket.destroyed) {
          stream.socket.destroy();
        }
        process.nextTick(emitErrorAndClose, websocket, err);
      } else {
        stream.destroy(err);
        stream.once("error", websocket.emit.bind(websocket, "error"));
        stream.once("close", websocket.emitClose.bind(websocket));
      }
    }
    function sendAfterClose(websocket, data, cb) {
      if (data) {
        const length = toBuffer(data).length;
        if (websocket._socket)
          websocket._sender._bufferedBytes += length;
        else
          websocket._bufferedAmount += length;
      }
      if (cb) {
        const err = new Error(
          `WebSocket is not open: readyState ${websocket.readyState} (${readyStates[websocket.readyState]})`
        );
        cb(err);
      }
    }
    function receiverOnConclude(code, reason) {
      const websocket = this[kWebSocket];
      websocket._closeFrameReceived = true;
      websocket._closeMessage = reason;
      websocket._closeCode = code;
      if (websocket._socket[kWebSocket] === void 0)
        return;
      websocket._socket.removeListener("data", socketOnData);
      process.nextTick(resume, websocket._socket);
      if (code === 1005)
        websocket.close();
      else
        websocket.close(code, reason);
    }
    function receiverOnDrain() {
      const websocket = this[kWebSocket];
      if (!websocket.isPaused)
        websocket._socket.resume();
    }
    function receiverOnError(err) {
      const websocket = this[kWebSocket];
      if (websocket._socket[kWebSocket] !== void 0) {
        websocket._socket.removeListener("data", socketOnData);
        process.nextTick(resume, websocket._socket);
        websocket.close(err[kStatusCode]);
      }
      websocket.emit("error", err);
    }
    function receiverOnFinish() {
      this[kWebSocket].emitClose();
    }
    function receiverOnMessage(data, isBinary) {
      this[kWebSocket].emit("message", data, isBinary);
    }
    function receiverOnPing(data) {
      const websocket = this[kWebSocket];
      websocket.pong(data, !websocket._isServer, NOOP);
      websocket.emit("ping", data);
    }
    function receiverOnPong(data) {
      this[kWebSocket].emit("pong", data);
    }
    function resume(stream) {
      stream.resume();
    }
    function socketOnClose() {
      const websocket = this[kWebSocket];
      this.removeListener("close", socketOnClose);
      this.removeListener("data", socketOnData);
      this.removeListener("end", socketOnEnd);
      websocket._readyState = WebSocket3.CLOSING;
      let chunk;
      if (!this._readableState.endEmitted && !websocket._closeFrameReceived && !websocket._receiver._writableState.errorEmitted && (chunk = websocket._socket.read()) !== null) {
        websocket._receiver.write(chunk);
      }
      websocket._receiver.end();
      this[kWebSocket] = void 0;
      clearTimeout(websocket._closeTimer);
      if (websocket._receiver._writableState.finished || websocket._receiver._writableState.errorEmitted) {
        websocket.emitClose();
      } else {
        websocket._receiver.on("error", receiverOnFinish);
        websocket._receiver.on("finish", receiverOnFinish);
      }
    }
    function socketOnData(chunk) {
      if (!this[kWebSocket]._receiver.write(chunk)) {
        this.pause();
      }
    }
    function socketOnEnd() {
      const websocket = this[kWebSocket];
      websocket._readyState = WebSocket3.CLOSING;
      websocket._receiver.end();
      this.end();
    }
    function socketOnError() {
      const websocket = this[kWebSocket];
      this.removeListener("error", socketOnError);
      this.on("error", NOOP);
      if (websocket) {
        websocket._readyState = WebSocket3.CLOSING;
        this.destroy();
      }
    }
  }
});

// ../../../node_modules/ws/lib/subprotocol.js
var require_subprotocol = __commonJS({
  "../../../node_modules/ws/lib/subprotocol.js"(exports, module2) {
    "use strict";
    var { tokenChars } = require_validation();
    function parse(header) {
      const protocols = /* @__PURE__ */ new Set();
      let start = -1;
      let end = -1;
      let i = 0;
      for (i; i < header.length; i++) {
        const code = header.charCodeAt(i);
        if (end === -1 && tokenChars[code] === 1) {
          if (start === -1)
            start = i;
        } else if (i !== 0 && (code === 32 || code === 9)) {
          if (end === -1 && start !== -1)
            end = i;
        } else if (code === 44) {
          if (start === -1) {
            throw new SyntaxError(`Unexpected character at index ${i}`);
          }
          if (end === -1)
            end = i;
          const protocol2 = header.slice(start, end);
          if (protocols.has(protocol2)) {
            throw new SyntaxError(`The "${protocol2}" subprotocol is duplicated`);
          }
          protocols.add(protocol2);
          start = end = -1;
        } else {
          throw new SyntaxError(`Unexpected character at index ${i}`);
        }
      }
      if (start === -1 || end !== -1) {
        throw new SyntaxError("Unexpected end of input");
      }
      const protocol = header.slice(start, i);
      if (protocols.has(protocol)) {
        throw new SyntaxError(`The "${protocol}" subprotocol is duplicated`);
      }
      protocols.add(protocol);
      return protocols;
    }
    module2.exports = { parse };
  }
});

// ../../../node_modules/ws/lib/websocket-server.js
var require_websocket_server = __commonJS({
  "../../../node_modules/ws/lib/websocket-server.js"(exports, module2) {
    "use strict";
    var EventEmitter = require("events");
    var http2 = require("http");
    var https2 = require("https");
    var net = require("net");
    var tls = require("tls");
    var { createHash } = require("crypto");
    var extension = require_extension();
    var PerMessageDeflate = require_permessage_deflate();
    var subprotocol = require_subprotocol();
    var WebSocket3 = require_websocket();
    var { GUID, kWebSocket } = require_constants();
    var keyRegex = /^[+/0-9A-Za-z]{22}==$/;
    var RUNNING = 0;
    var CLOSING = 1;
    var CLOSED = 2;
    var WebSocketServer2 = class extends EventEmitter {
      constructor(options, callback) {
        super();
        options = {
          maxPayload: 100 * 1024 * 1024,
          skipUTF8Validation: false,
          perMessageDeflate: false,
          handleProtocols: null,
          clientTracking: true,
          verifyClient: null,
          noServer: false,
          backlog: null,
          server: null,
          host: null,
          path: null,
          port: null,
          WebSocket: WebSocket3,
          ...options
        };
        if (options.port == null && !options.server && !options.noServer || options.port != null && (options.server || options.noServer) || options.server && options.noServer) {
          throw new TypeError(
            'One and only one of the "port", "server", or "noServer" options must be specified'
          );
        }
        if (options.port != null) {
          this._server = http2.createServer((req, res) => {
            const body = http2.STATUS_CODES[426];
            res.writeHead(426, {
              "Content-Length": body.length,
              "Content-Type": "text/plain"
            });
            res.end(body);
          });
          this._server.listen(
            options.port,
            options.host,
            options.backlog,
            callback
          );
        } else if (options.server) {
          this._server = options.server;
        }
        if (this._server) {
          const emitConnection = this.emit.bind(this, "connection");
          this._removeListeners = addListeners(this._server, {
            listening: this.emit.bind(this, "listening"),
            error: this.emit.bind(this, "error"),
            upgrade: (req, socket, head) => {
              this.handleUpgrade(req, socket, head, emitConnection);
            }
          });
        }
        if (options.perMessageDeflate === true)
          options.perMessageDeflate = {};
        if (options.clientTracking) {
          this.clients = /* @__PURE__ */ new Set();
          this._shouldEmitClose = false;
        }
        this.options = options;
        this._state = RUNNING;
      }
      address() {
        if (this.options.noServer) {
          throw new Error('The server is operating in "noServer" mode');
        }
        if (!this._server)
          return null;
        return this._server.address();
      }
      close(cb) {
        if (this._state === CLOSED) {
          if (cb) {
            this.once("close", () => {
              cb(new Error("The server is not running"));
            });
          }
          process.nextTick(emitClose, this);
          return;
        }
        if (cb)
          this.once("close", cb);
        if (this._state === CLOSING)
          return;
        this._state = CLOSING;
        if (this.options.noServer || this.options.server) {
          if (this._server) {
            this._removeListeners();
            this._removeListeners = this._server = null;
          }
          if (this.clients) {
            if (!this.clients.size) {
              process.nextTick(emitClose, this);
            } else {
              this._shouldEmitClose = true;
            }
          } else {
            process.nextTick(emitClose, this);
          }
        } else {
          const server = this._server;
          this._removeListeners();
          this._removeListeners = this._server = null;
          server.close(() => {
            emitClose(this);
          });
        }
      }
      shouldHandle(req) {
        if (this.options.path) {
          const index = req.url.indexOf("?");
          const pathname = index !== -1 ? req.url.slice(0, index) : req.url;
          if (pathname !== this.options.path)
            return false;
        }
        return true;
      }
      handleUpgrade(req, socket, head, cb) {
        socket.on("error", socketOnError);
        const key = req.headers["sec-websocket-key"];
        const version = +req.headers["sec-websocket-version"];
        if (req.method !== "GET") {
          const message = "Invalid HTTP method";
          abortHandshakeOrEmitwsClientError(this, req, socket, 405, message);
          return;
        }
        if (req.headers.upgrade.toLowerCase() !== "websocket") {
          const message = "Invalid Upgrade header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
          return;
        }
        if (!key || !keyRegex.test(key)) {
          const message = "Missing or invalid Sec-WebSocket-Key header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
          return;
        }
        if (version !== 8 && version !== 13) {
          const message = "Missing or invalid Sec-WebSocket-Version header";
          abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
          return;
        }
        if (!this.shouldHandle(req)) {
          abortHandshake(socket, 400);
          return;
        }
        const secWebSocketProtocol = req.headers["sec-websocket-protocol"];
        let protocols = /* @__PURE__ */ new Set();
        if (secWebSocketProtocol !== void 0) {
          try {
            protocols = subprotocol.parse(secWebSocketProtocol);
          } catch (err) {
            const message = "Invalid Sec-WebSocket-Protocol header";
            abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
            return;
          }
        }
        const secWebSocketExtensions = req.headers["sec-websocket-extensions"];
        const extensions = {};
        if (this.options.perMessageDeflate && secWebSocketExtensions !== void 0) {
          const perMessageDeflate = new PerMessageDeflate(
            this.options.perMessageDeflate,
            true,
            this.options.maxPayload
          );
          try {
            const offers = extension.parse(secWebSocketExtensions);
            if (offers[PerMessageDeflate.extensionName]) {
              perMessageDeflate.accept(offers[PerMessageDeflate.extensionName]);
              extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
            }
          } catch (err) {
            const message = "Invalid or unacceptable Sec-WebSocket-Extensions header";
            abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
            return;
          }
        }
        if (this.options.verifyClient) {
          const info = {
            origin: req.headers[`${version === 8 ? "sec-websocket-origin" : "origin"}`],
            secure: !!(req.socket.authorized || req.socket.encrypted),
            req
          };
          if (this.options.verifyClient.length === 2) {
            this.options.verifyClient(info, (verified, code, message, headers) => {
              if (!verified) {
                return abortHandshake(socket, code || 401, message, headers);
              }
              this.completeUpgrade(
                extensions,
                key,
                protocols,
                req,
                socket,
                head,
                cb
              );
            });
            return;
          }
          if (!this.options.verifyClient(info))
            return abortHandshake(socket, 401);
        }
        this.completeUpgrade(extensions, key, protocols, req, socket, head, cb);
      }
      completeUpgrade(extensions, key, protocols, req, socket, head, cb) {
        if (!socket.readable || !socket.writable)
          return socket.destroy();
        if (socket[kWebSocket]) {
          throw new Error(
            "server.handleUpgrade() was called more than once with the same socket, possibly due to a misconfiguration"
          );
        }
        if (this._state > RUNNING)
          return abortHandshake(socket, 503);
        const digest = createHash("sha1").update(key + GUID).digest("base64");
        const headers = [
          "HTTP/1.1 101 Switching Protocols",
          "Upgrade: websocket",
          "Connection: Upgrade",
          `Sec-WebSocket-Accept: ${digest}`
        ];
        const ws = new this.options.WebSocket(null);
        if (protocols.size) {
          const protocol = this.options.handleProtocols ? this.options.handleProtocols(protocols, req) : protocols.values().next().value;
          if (protocol) {
            headers.push(`Sec-WebSocket-Protocol: ${protocol}`);
            ws._protocol = protocol;
          }
        }
        if (extensions[PerMessageDeflate.extensionName]) {
          const params = extensions[PerMessageDeflate.extensionName].params;
          const value = extension.format({
            [PerMessageDeflate.extensionName]: [params]
          });
          headers.push(`Sec-WebSocket-Extensions: ${value}`);
          ws._extensions = extensions;
        }
        this.emit("headers", headers, req);
        socket.write(headers.concat("\r\n").join("\r\n"));
        socket.removeListener("error", socketOnError);
        ws.setSocket(socket, head, {
          maxPayload: this.options.maxPayload,
          skipUTF8Validation: this.options.skipUTF8Validation
        });
        if (this.clients) {
          this.clients.add(ws);
          ws.on("close", () => {
            this.clients.delete(ws);
            if (this._shouldEmitClose && !this.clients.size) {
              process.nextTick(emitClose, this);
            }
          });
        }
        cb(ws, req);
      }
    };
    module2.exports = WebSocketServer2;
    function addListeners(server, map) {
      for (const event of Object.keys(map))
        server.on(event, map[event]);
      return function removeListeners() {
        for (const event of Object.keys(map)) {
          server.removeListener(event, map[event]);
        }
      };
    }
    function emitClose(server) {
      server._state = CLOSED;
      server.emit("close");
    }
    function socketOnError() {
      this.destroy();
    }
    function abortHandshake(socket, code, message, headers) {
      message = message || http2.STATUS_CODES[code];
      headers = {
        Connection: "close",
        "Content-Type": "text/html",
        "Content-Length": Buffer.byteLength(message),
        ...headers
      };
      socket.once("finish", socket.destroy);
      socket.end(
        `HTTP/1.1 ${code} ${http2.STATUS_CODES[code]}\r
` + Object.keys(headers).map((h) => `${h}: ${headers[h]}`).join("\r\n") + "\r\n\r\n" + message
      );
    }
    function abortHandshakeOrEmitwsClientError(server, req, socket, code, message) {
      if (server.listenerCount("wsClientError")) {
        const err = new Error(message);
        Error.captureStackTrace(err, abortHandshakeOrEmitwsClientError);
        server.emit("wsClientError", err, socket, req);
      } else {
        abortHandshake(socket, code, message);
      }
    }
  }
});

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
  if (!innerMatch)
    return void 0;
  const matches = innerMatch.match(ARGUMENT_NAMES).filter((e) => !!e);
  const info = /* @__PURE__ */ new Map();
  matches.forEach((v) => {
    let [name, value] = v.split("=");
    name = name.trim();
    name = name.replace(/\d+$/, "");
    const spread = name.includes("...");
    name = name.replace("...", "");
    try {
      if (name)
        info.set(name, {
          state: (0, eval)(`(${value})`),
          spread
        });
    } catch (e) {
      info.set(name, {});
    }
  });
  return info;
}
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
    this.arguments = /* @__PURE__ */ new Map();
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
    this.operator = (self = this, origin, ...args) => {
      return args;
    };
    this.runOp = (node = this, origin = this, ...args) => {
      if (node.DEBUGNODE)
        console.time(node.tag);
      let result = node.operator(node, origin, ...args);
      if (result instanceof Promise) {
        result.then((res) => {
          if (res !== void 0)
            this.setState({ [node.tag]: res });
          if (node.DEBUGNODE) {
            console.timeEnd(node.tag);
            if (result !== void 0)
              console.log(`${node.tag} result:`, result);
          }
          ;
          return res;
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
      let pass = false;
      if (params) {
        const keys = params.keys();
        const paramOne = keys.next().value;
        const paramTwo = keys.next().value;
        const restrictedOne = ["self", "node"];
        const restrictedTwo = ["origin", "parent", "graph", "router"];
        if (paramOne)
          restrictedOne.forEach((a) => {
            if (paramOne.includes(a))
              pass = true;
          });
        if (paramTwo)
          restrictedTwo.forEach((a) => {
            if (paramTwo.includes(a))
              pass = true;
          });
        if (this.arguments) {
          params.forEach((o, k) => {
            if (!this.arguments.has(k))
              this.arguments.set(k, o.state);
          });
        }
      }
      if (!pass) {
        let fn = operator;
        operator = (self, origin, ...args) => {
          return fn(...args);
        };
      }
      this.operator = operator;
      return operator;
    };
    this.run = (...args) => {
      return this._run(this, void 0, ...args);
    };
    this.runAsync = (...args) => {
      return new Promise((res, rej) => {
        res(this._run(this, void 0, ...args));
      });
    };
    this.transformArgs = (args = []) => args;
    this._run = (node = this, origin, ...args) => {
      if (typeof this.transformArgs === "function")
        args = this.transformArgs(args, node);
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
              if (node.backward && node.parent instanceof GraphNode) {
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
          } else if (typeof node.children[key] === "undefined" || node.children[key] === true) {
            if (node.graph && node.graph?.get(key)) {
              node.children[key] = node.graph.get(key);
              if (!node.nodes.get(node.children[key].tag))
                node.nodes.set(node.children[key].tag, node.children[key]);
            }
            if (!node.children[key] && node.nodes.get(key))
              node.children[key] = node.nodes.get(key);
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
          if (typeof node.branch[k].if === "object")
            node.branch[k].if = stringifyFast(node.branch[k].if);
          let pass = false;
          if (typeof node.branch[k].if === "function") {
            pass = node.branch[k].if(output);
          } else {
            if (typeof output === "object") {
              if (stringifyFast(output) === node.branch[k].if)
                pass = true;
            } else if (output === node.branch[k].if)
              pass = true;
          }
          if (pass) {
            if (node.branch[k].then instanceof GraphNode) {
              if (Array.isArray(output))
                await node.branch[k].then._run(node.branch[k].then, node, ...output);
              else
                await node.branch[k].then._run(node.branch[k].then, node, ...output);
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
                  await node.branch[k].then._run(node.branch[k].then, node, ...output);
                else
                  await node.branch[k].then._run(node.branch[k].then, node, ...output);
              }
            }
          }
          return pass;
        }));
      }
    };
    this.runAnimation = (animation = this.animation, args = [], node = this, origin) => {
      this.animation = animation;
      if (!animation)
        this.animation = this.operator;
      if (node.animate && !node.isAnimating && "requestAnimationFrame" in window) {
        node.isAnimating = true;
        let anim = async () => {
          if (node.isAnimating) {
            if (node.DEBUGNODE)
              console.time(node.tag);
            let result = this.animation(
              node,
              origin,
              ...args
            );
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
            let result = node.looper(
              node,
              origin,
              ...args
            );
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
        this.graph.nNodes = this.graph.nodes.size;
      }
      return node;
    };
    this.remove = (node) => {
      if (typeof node === "string")
        node = this.nodes.get(node);
      if (node instanceof GraphNode) {
        this.nodes.delete(node.tag);
        if (this.children[node.tag])
          delete this.children[node.tag];
        if (this.graph) {
          this.graph.nodes.delete(node.tag);
          this.graph.nNodes = this.graph.nodes.size;
        }
        this.nodes.forEach((n) => {
          if (n.nodes.get(node.tag)) {
            n.nodes.delete(node.tag);
            if (n.children[node.tag])
              delete n.children[node.tag];
            if (n.parent?.tag === node.tag)
              delete n.parent;
          }
        });
        if (node.ondelete)
          node.ondelete(node);
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
      if (typeof children === "object") {
        Object.assign(this.children, children);
      }
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
    this.getProps = (node = this) => {
      return {
        tag: node.tag,
        operator: node.operator,
        graph: node.graph,
        children: node.children,
        parent: node.parent,
        forward: node.forward,
        backward: node.bacward,
        loop: node.loop,
        animate: node.animate,
        frame: node.frame,
        delay: node.delay,
        recursive: node.recursive,
        repeat: node.repeat,
        branch: node.branch,
        oncreate: node.oncreate,
        DEBUGNODE: node.DEBUGNODE,
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
    this.removeTree = (node) => {
      if (node) {
        if (typeof node === "string")
          node = this.nodes.get(node);
      }
      if (node instanceof GraphNode) {
        let checked = {};
        const recursivelyRemove = (node2) => {
          if (typeof node2.children === "object" && !checked[node2.tag]) {
            checked[node2.tag] = true;
            for (const key in node2.children) {
              if (node2.children[key].stopNode)
                node2.children[key].stopNode();
              if (node2.children[key].tag) {
                if (this.nodes.get(node2.children[key].tag))
                  this.nodes.delete(node2.children[key].tag);
                this.nodes.forEach((n) => {
                  if (n.nodes.get(node2.children[key].tag))
                    n.nodes.delete(node2.children[key].tag);
                  if (n.children[key] instanceof GraphNode)
                    delete n.children[key];
                });
                recursivelyRemove(node2.children[key]);
              }
            }
          }
        };
        if (node.stopNode)
          node.stopNode();
        if (node.tag) {
          this.nodes.delete(node.tag);
          if (this.children[node.tag])
            delete this.children[node.tag];
          if (this.parent?.tag === node.tag)
            delete this.parent;
          if (this[node.tag] instanceof GraphNode)
            delete this[node.tag];
          this.nodes.forEach((n) => {
            if (node?.tag) {
              if (n.nodes.get(node.tag))
                n.nodes.delete(node.tag);
              if (n.children[node.tag] instanceof GraphNode)
                delete n.children[node.tag];
            }
          });
          recursivelyRemove(node);
          if (this.graph)
            this.graph.removeTree(node, checked);
          else if (node.ondelete)
            node.ondelete(node);
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
            if (node.children[child.tag] instanceof GraphNode) {
              if (!node.nodes.get(child.tag))
                node.nodes.set(child.tag, child);
              node.children[child.tag] = child;
              if (!node.firstRun)
                node.firstRun = true;
            }
          }
        }
        if (node.parent instanceof GraphNode) {
          if (node.nodes.get(child.tag) && !node.parent.nodes.get(child.tag))
            node.parent.nodes.set(child.tag, child);
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
          Object.assign(this, hasnode);
          if (!this.source)
            this.source = hasnode;
          let props = hasnode.getProps();
          delete props.graph;
          delete props.parent;
          Object.assign(properties, props);
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
      if ("arguments" in properties) {
        if (properties.arguments) {
          for (let key in properties.arguments) {
            this.arguments.set(key, properties.arguments[key]);
          }
        }
        properties.arguments = this.arguments;
      }
      let keys = Object.getOwnPropertyNames(this);
      for (const key in properties) {
        if (!keys.includes(key))
          this._initial[key] = properties[key];
      }
      if (properties.children)
        this._initial.children = Object.assign({}, properties.children);
      Object.assign(this, properties);
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
    this.add = (node = {}) => {
      let props = node;
      if (!(node instanceof GraphNode))
        node = new GraphNode(props, this, this);
      else {
        this.nNodes = this.nodes.size;
        if (node.tag) {
          this.tree[node.tag] = props;
          this.nodes.set(node.tag, node);
        }
      }
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
        } else {
          let n = this.nodes.get(node);
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
    this.removeTree = (node, checked) => {
      if (typeof node === "string")
        node = this.nodes.get(node);
      if (node instanceof GraphNode) {
        if (!checked)
          checked = {};
        const recursivelyRemove = (node2) => {
          if (node2.children && !checked[node2.tag]) {
            checked[node2.tag] = true;
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
          this.nNodes = this.nodes.size;
          recursivelyRemove(node);
        }
        if (node.ondelete)
          node.ondelete(node);
      }
      return node;
    };
    this.remove = (node) => {
      if (typeof node === "string")
        node = this.nodes.get(node);
      if (node instanceof GraphNode) {
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
        if (node.ondelete)
          node.ondelete(node);
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
      Object.assign(this, props);
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
  const path2 = ["this"];
  function clear() {
    refs.clear();
    parents.length = 0;
    path2.length = 1;
  }
  function updateParents(key, value) {
    var idx = parents.length - 1;
    var prev = parents[idx];
    if (typeof prev === "object") {
      if (prev[key] === value || idx === 0) {
        path2.push(key);
        parents.push(value.pushed);
      } else {
        while (idx-- >= 0) {
          prev = parents[idx];
          if (typeof prev === "object") {
            if (prev[key] === value) {
              idx += 2;
              parents.length = idx;
              path2.length = idx;
              --idx;
              parents[idx] = value;
              path2[idx] = key;
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
          refs.set(value, path2.join("."));
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
  const path2 = ["this"];
  function clear() {
    refs.clear();
    parents.length = 0;
    path2.length = 1;
  }
  function updateParents(key, value) {
    var idx = parents.length - 1;
    if (parents[idx]) {
      var prev = parents[idx];
      if (typeof prev === "object") {
        if (prev[key] === value || idx === 0) {
          path2.push(key);
          parents.push(value.pushed);
        } else {
          while (idx-- >= 0) {
            prev = parents[idx];
            if (typeof prev === "object") {
              if (prev[key] === value) {
                idx += 2;
                parents.length = idx;
                path2.length = idx;
                --idx;
                parents[idx] = value;
                path2[idx] = key;
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
          refs.set(value, path2.join("."));
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

// ../../../services/Service.ts
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
            let module2 = routes;
            routes = {};
            Object.getOwnPropertyNames(module2).forEach((route) => {
              if (includeClassName)
                routes[name + routeFormat + route] = module2[route];
              else
                routes[route] = module2[route];
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
          return this.handleGraphNodeCall(args[0].node, args[0].args, args[0].origin);
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
    this.nodes = this.service.nodes;
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
    this.routes = this.service.routes;
    this.services = {};
    this.loadDefaultRoutes = false;
    this.load = (service, linkServices = true, includeClassName = true, routeFormat = ".", customRoutes, customChildren) => {
      if (!(service instanceof Graph) && typeof service === "function") {
        service = new service({ loadDefaultRoutes: this.loadDefaultRoutes, name: service.name });
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
      this.service.load(service, includeClassName, routeFormat, customRoutes, customChildren);
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
              radio.transmit(
                { route: destination, args: res, origin, method }
              );
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
              radio.transmit(
                { route: destination, args: res, origin, method }
              );
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
    this.getEndpointInfo = (path2, service) => {
      if (!path2)
        return void 0;
      let testpath = (path3, service2) => {
        if (this.services[service2]) {
          if (this.services[service2].rtc?.[path3]) {
            return this.services[service2].rtc[path3];
          } else if (this.services[service2].servers?.[path3]) {
            return this.services[service2].servers[path3];
          } else if (this.services[service2].sockets?.[path3]) {
            return this.services[service2].sockets[path3];
          } else if (this.services[service2].eventsources?.[path3]) {
            return this.services[service2].eventsources[path3];
          } else if (this.services[service2].workers?.[path3]) {
            return this.services[service2].workers[path3];
          }
        }
        return void 0;
      };
      if (service) {
        let found = testpath(path2, service);
        if (found)
          return {
            endpoint: found,
            service
          };
      }
      for (const s in this.services) {
        let found = testpath(path2, s);
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
            let data = this.streamSettings[prop].settings[key].callback(
              this.streamSettings[prop].object[key],
              this.streamSettings[prop].settings[key]
            );
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
    if (options && "loadDefaultRoutes" in options) {
      this.loadDefaultRoutes = options.loadDefaultRoutes;
    }
    if (this.loadDefaultRoutes)
      this.load(this.defaultRoutes, options?.linkServices, options?.includeClassName, options?.routeFormat, options?.customRoutes, options?.customChildren);
    if (Array.isArray(services)) {
      services.forEach((s) => this.load(s, options?.linkServices, options?.includeClassName, options?.routeFormat, options?.customRoutes, options?.customChildren));
    } else if (typeof services === "object") {
      Object.keys(services).forEach((s) => this.load(services[s], options?.linkServices, options?.includeClassName, options?.routeFormat, options?.customRoutes, options?.customChildren));
    }
  }
};

// ../../../routers/users/User.router.ts
var UserRouter = class extends Router {
  constructor(services, options) {
    super(services, options);
    this.users = {};
    this.sessions = {
      private: {},
      shared: {}
    };
    this.runAs = (node, userId, ...args) => {
      if (typeof userId === "object")
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
        for (const path2 in connections.eventsources) {
          if (connections.eventsources[path2]._id) {
            for (const s in this.services.sse.eventsources) {
              if (this.services.sse.eventsources[s]._id === connections.eventsources[path2]._id) {
                connections.eventsources[path2] = this.services.sse.eventsources[s];
                break;
              } else if (this.services.sse.eventsources[s].sessions?.[connections.eventsources[path2]._id]) {
                connections.eventsources[path2] = { session: this.services.sse.eventsources[s].sessions[connections.eventsources[path2]._id], _id: path2 };
                break;
              } else if (this.services.sse.eventsources[s].session?.[connections.eventsources[path2]._id]) {
                connections.eventsources[path2] = this.services.sse.eventsources[s];
                break;
              }
            }
          }
          if (!connections.eventsources[path2].source && !connections.eventsources[path2].sessions && !connections.eventsources[path2].session) {
            connections.eventsources[path2] = this.run("sse/openSSE", connections.eventsources[path2]);
          }
          if (connections.eventsources[path2].source) {
            if (connections.onmessage)
              connections.eventsources[path2].source.addEventListener("message", connections.onmessage);
            if (connections.onclose)
              connections.eventsources[path2].source.addEventListener("close", connections.onclose);
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
            if (typeof this.users[user._id].sendAll === "object") {
              if (message.route && !message.origin)
                message.origin = user._id;
              if (typeof message === "object")
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
                if (typeof this.users[user._id].sendAll === "string") {
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
                if (typeof data === "object") {
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
        for (const path2 in user.eventsources) {
          if (user.eventsources[path2].source || user.eventsources[path2].sessions) {
            this.run("sse/terminate", path2);
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
        if (typeof user === "string") {
          user = this.users[user];
          if (!user)
            return false;
        }
      }
      if (props) {
        if (typeof props === "string") {
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
      if (typeof userId === "object")
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
      let session2;
      if (options._id && typeof userId === "string") {
        session2 = this.sessions.private[options._id];
        if (!session2)
          session2 = this.sessions.shared[options._id];
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
      let session2 = this.sessions.private[sessionId];
      if (!session2)
        session2 = this.sessions.shared[sessionId];
      if (session2) {
        if (this.sessions.private[sessionId]) {
          if (userId === session2.settings.source || userId === session2.settings.listener || session2.settings.admins?.[userId] || session2.settings.moderators?.[userId]) {
            delete this.sessions.private[sessionId];
            delete this.users[userId].sessions[sessionId];
            if (clear) {
              if (session2.settings.admins?.[userId])
                delete (this.sessions.shared[sessionId].settings?.admins)[userId];
              if (session2.settings.moderators?.[userId])
                delete (this.sessions.shared[sessionId].settings?.moderators)[userId];
            }
          }
        } else if (this.sessions.shared[sessionId]) {
          delete this.sessions.shared.settings.users[userId];
          delete this.users[userId].sessions[sessionId];
          if (clear) {
            if (session2.settings.admins?.[userId])
              delete (this.sessions.shared[sessionId].settings?.admins)[userId];
            if (session2.settings.moderators?.[userId])
              delete (this.sessions.shared[sessionId].settings?.moderators)[userId];
            if (session2.data.shared[userId])
              delete this.sessions.shared[sessionId].data?.shared[userId];
            if (session2.settings.host === userId) {
              delete session2.settings.host;
              delete session2.data.shared;
              session2.data.shared = {};
              this.swapHost(session2);
            }
          }
        }
        return true;
      }
      return false;
    };
    this.swapHost = (session2, newHostId) => {
      if (typeof session2 === "string") {
        if (this.sessions.private[session2])
          session2 = this.sessions.private[session2];
        else if (this.sessions.shared[session2])
          session2 = this.sessions.shared[session2];
      }
      if (typeof session2 === "object" && session2.settings) {
        delete session2.settings.host;
        if (newHostId) {
          if (session2.settings.users[newHostId])
            session2.settings.host = newHostId;
        }
        if (session2.settings.ownerId && !session2.settings.host) {
          if (session2.settings.users[session2.settings.ownerId])
            session2.settings.host = session2.settings.ownerId;
        }
        if (session2.settings.admins && !session2.settings.host) {
          let match = this.getFirstMatch(session2.settings.users, session2.settings.admins);
          if (match)
            session2.settings.host = match;
        }
        if (session2.settings.moderators && !session2.settings.host) {
          let match = this.getFirstMatch(session2.settings.users, session2.settings.moderators);
          if (match)
            session2.settings.host = match;
        }
        if (!session2.settings.host)
          session2.settings.host = Object.keys(session2.settings.users)[0];
        return true;
      }
      return false;
    };
    this.deleteSession = (sessionId, userId) => {
      if (typeof userId === "object")
        userId = userId._id;
      let session2 = this.sessions.private[sessionId];
      if (!session2)
        session2 = this.sessions.shared[sessionId];
      if (session2) {
        if (session2.source === userId || session2.listener === userId || session2.admins?.[userId] || session2.ownerId === userId) {
          for (const user in session2.settings.users) {
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
    this.subscribeToSession = (session2, userId, onmessage, onopen, onclose) => {
      if (typeof userId === "object")
        userId = userId._id;
      if (typeof session2 === "string") {
        let s = this.sessions.private[session2];
        if (!s)
          s = this.sessions.shared[session2];
        if (!s)
          return void 0;
        session2 = s;
      }
      if (typeof session2.onopen === "function") {
        let sub = this.subscribe("joinSession", (res) => {
          if (res._id === session2._id)
            session2.onopen(session2, userId);
          this.unsubscribe("joinSession", sub);
        });
      }
      if (typeof session2 === "object") {
        if (onmessage)
          session2.onmessage = onmessage;
        if (onopen)
          session2.onclose = onopen;
        if (onclose)
          session2.onclose = onclose;
      }
      return session2;
    };
    this.sessionLoop = (sendAll = true) => {
      let updates = {
        private: {},
        shared: {}
      };
      for (const session2 in this.sessions.private) {
        const sesh = this.sessions.private[session2];
        const updateObj = {
          _id: sesh._id,
          settings: {
            listener: sesh.listener,
            source: sesh.source
          },
          data: {}
        };
        if (!this.users[sesh.source]) {
          delete this.sessions.private[session2];
          break;
        }
        if (sesh.settings && sesh.data) {
          for (const prop in sesh.settings.propnames) {
            if (this.users[sesh.source][prop]) {
              if (this.sessions.private[session2].data) {
                if (typeof sesh.data[prop] === "object") {
                  if (this.users[sesh.source][prop] && (stringifyFast(sesh.data[prop]) !== stringifyFast(this.users[sesh.source][prop]) || !(prop in sesh.data)))
                    updateObj.data[prop] = this.users[sesh.source][prop];
                } else if (this.users[sesh.source][prop] && (sesh.data[prop] !== this.users[sesh.source][prop] || !(prop in sesh.data)))
                  updateObj.data[prop] = this.users[sesh.source][prop];
              } else
                updateObj.data[prop] = this.users[sesh.source][prop];
            } else if (this.sessions.private[session2]?.data?.[prop])
              delete this.sessions.private[session2].data[prop];
          }
        }
        if (Object.keys(updateObj.data).length > 0) {
          this.recursivelyAssign(this.sessions.private[session2].data, updateObj.data);
          updates.private[sesh._id] = updateObj;
        }
      }
      for (const session2 in this.sessions.shared) {
        const sesh = this.sessions.shared[session2];
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
                    if (typeof this.users[user][prop] === "object")
                      privateData[user][prop] = this.recursivelyAssign({}, this.users[user][prop]);
                    else
                      privateData[user][prop] = this.users[user][prop];
                  } else if (typeof privateData[user][prop] === "object" && sesh.data) {
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
                    if (typeof this.users[user][prop] === "object")
                      sharedData[user][prop] = this.recursivelyAssign({}, this.users[user][prop]);
                    else
                      sharedData[user][prop] = this.users[user][prop];
                  } else if (typeof sharedData[user][prop] === "object" && sesh.data) {
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
                    if (typeof this.users[user][prop] === "object")
                      sharedData[user][prop] = this.recursivelyAssign({}, this.users[user][prop]);
                    else
                      sharedData[user][prop] = this.users[user][prop];
                  } else if (typeof sesh.data?.shared[user][prop] === "object") {
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
          this.recursivelyAssign(this.sessions.shared[session2].data?.shared, updateObj.data.shared);
        }
        if (updateObj.data.private) {
          this.recursivelyAssign(this.sessions.shared[session2].data?.private, updateObj.data.private);
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
          let session2 = this.sessions.private[s];
          if (session2?.settings) {
            let u = session2.settings.listener;
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
          let session2 = this.sessions.shared[s];
          if (session2?.settings) {
            let copy;
            if (session2.settings.host) {
              copy = Object.assign({}, updates.shared[s]);
              delete copy.data.private;
            }
            for (const u in session2.settings.users) {
              if (!users[u])
                users[u] = { shared: {} };
              if (!users[u].shared)
                users[u].shared = {};
              if (session2.settings.host) {
                if (u !== session2.settings.host) {
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
        if (typeof update === "string")
          update = JSON.parse(update);
      }
      if (typeof update === "object") {
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
                      if (typeof user[prop] === "object") {
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
                      if (typeof user[prop] === "object" && s.data[prop] !== void 0) {
                        if (stringifyFast(s.data[prop]) !== stringifyFast(user[prop]))
                          updateObj[prop] = user[prop];
                      } else if (s.data[prop] !== user[prop])
                        updateObj[prop] = user[prop];
                    } else {
                      if (s.data.shared?.[user._id]?.[prop]) {
                        if (typeof user[prop] === "object") {
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
    this.load(this.routes, options?.linkServices, options?.includeClassName, options?.routeFormat, options?.customRoutes, options?.customChildren);
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

// ../../../services/http/HTTP.node.ts
var http = __toESM(require("http"));
var https = __toESM(require("https"));
var fs = __toESM(require("fs"));
var path = __toESM(require("path"));
var HTTPbackend = class extends Service {
  constructor(options, settings) {
    super(options);
    this.name = "http";
    this.debug = false;
    this.servers = {};
    this.mimeTypes = {
      ".html": "text/html",
      ".htm": "text/html",
      ".js": "text/javascript",
      ".css": "text/css",
      ".json": "application/json",
      ".txt": "text/plain",
      ".png": "image/png",
      ".jpg": "image/jpg",
      ".jpeg": "image/jpg",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
      ".xhtml": "application/xhtml+xml",
      ".bmp": "image/bmp",
      ".wav": "audio/wav",
      ".mp3": "audio/mpeg",
      ".mp4": "video/mp4",
      ".xml": "application/xml",
      ".webm": "video/webm",
      ".webp": "image/webp",
      ".weba": "audio/webm",
      ".woff": "font/woff",
      "woff2": "font/woff2",
      ".ttf": "application/font-ttf",
      ".eot": "application/vnd.ms-fontobject",
      ".otf": "application/font-otf",
      ".wasm": "application/wasm",
      ".zip": "application/zip",
      ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ".tif": "image/tiff",
      ".sh": "application/x-sh",
      ".csh": "application/x-csh",
      ".rar": "application/vnd.rar",
      ".ppt": "application/vnd.ms-powerpoint",
      ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ".odt": "application/vnd.oasis.opendocument.text",
      ".ods": "application/vnd.oasis.opendocument.spreadsheet",
      ".odp": "application/vnd.oasis.opendocument.presentation",
      ".mpeg": "video/mpeg",
      ".mjs": "text/javascript",
      ".cjs": "text/javascript",
      ".jsonld": "application/ld+json",
      ".jar": "application/java-archive",
      ".ico": "image/vnd.microsoft.icon",
      ".gz": "application/gzip",
      "epub": "application/epub+zip",
      ".doc": "application/msword",
      ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ".csv": "text/csv",
      ".avi": "video/x-msvideo",
      ".aac": "audio/aac",
      ".mpkg": "application/vnd.apple.installer+xml",
      ".oga": "audio/ogg",
      ".ogv": "video/ogg",
      "ogx": "application/ogg",
      ".php": "application/x-httpd-php",
      ".rtf": "application/rtf",
      ".swf": "application/x-shockwave-flash",
      ".7z": "application/x-7z-compressed",
      ".3gp": "video/3gpp"
    };
    this.onStarted = (protocol, host, port) => {
      console.log(
        `\u{1F431} Node server running at 
            ${protocol}://${host}:${port}/`
      );
    };
    this.setupServer = (options = {
      protocol: "http",
      host: "localhost",
      port: 8080,
      startpage: "index.html"
    }, requestListener, onStarted) => {
      if (options.pages) {
        for (const key in options.pages) {
          if (typeof options.pages[key] === "string") {
            this.addPage(key, options.pages[key]);
          } else if (typeof options.pages[key] === "object") {
            if (options.pages[key].template) {
              options.pages[key].get = options.pages[key].template;
            }
            if (key !== "all")
              this.load({ [key]: options.pages[key] });
          }
        }
      }
      if (options.protocol === "https") {
        return this.setupHTTPSserver(options, requestListener, onStarted);
      } else
        return this.setupHTTPserver(options, requestListener, onStarted);
    };
    this.setupHTTPserver = (options = {
      host: "localhost",
      port: 8080,
      startpage: "index.html",
      errpage: void 0
    }, requestListener, onStarted = () => {
      this.onStarted("http", options.host, options.port);
    }) => {
      const host = options.host;
      const port = options.port;
      options.protocol = "http";
      if (!host || !port)
        return;
      const address = `${host}:${port}`;
      if (this.servers[address])
        this.terminate(this.servers[address]);
      if (!("keepState" in options))
        options.keepState = true;
      const served = {
        server: void 0,
        type: "httpserver",
        address,
        ...options
      };
      if (!requestListener)
        requestListener = (request, response) => {
          let received = {
            args: { request, response },
            method: request.method,
            served
          };
          let url = request.url.slice(1);
          if (!url)
            url = "/";
          if (options.pages) {
            if (typeof options.pages[url] === "object") {
              if (options.pages[url].redirect) {
                url = options.pages[url].redirect;
                received.redirect = url;
              }
              if (options.pages[url].onrequest) {
                if (typeof options.pages[url].onrequest === "string") {
                  options.pages[url].onrequest = this.nodes.get(options.pages[url].onrequest);
                }
                if (typeof options.pages[url].onrequest === "object") {
                  if (options.pages[url].onrequest.run) {
                    options.pages[url].onrequest.run(options.pages[url], request, response);
                  }
                } else if (typeof options.pages[url].onrequest === "function") {
                  options.pages[url].onrequest(this, options.pages[url], request, response);
                }
              }
            }
          }
          received.route = url;
          this.receive(received);
        };
      const server = http.createServer(
        requestListener
      );
      served.server = server;
      this.servers[address] = served;
      return new Promise((resolve, reject) => {
        server.on("error", (err) => {
          console.error("Server error:", err.toString());
          reject(err);
        });
        server.listen(
          port,
          host,
          () => {
            onStarted();
            resolve(served);
          }
        );
      });
    };
    this.setupHTTPSserver = (options = {
      host: "localhost",
      port: 8080,
      startpage: "index.html",
      certpath: "cert.pem",
      keypath: "key.pem",
      passphrase: "encryption",
      errpage: void 0
    }, requestListener, onStarted = () => {
      this.onStarted("https", options.host, options.port);
    }) => {
      const host = options.host;
      const port = options.port;
      options.protocol = "https";
      if (!host || !port || !options.certpath || !options.keypath)
        return;
      if (this.servers[`${host}:${port}`])
        this.terminate(this.servers[`${host}:${port}`]);
      var opts = {
        key: fs.readFileSync(options.keypath),
        cert: fs.readFileSync(options.certpath),
        passphrase: options.passphrase
      };
      if (!("keepState" in options))
        options.keepState = true;
      const served = {
        server: void 0,
        type: "httpserver",
        address: `${host}:${port}`,
        ...options
      };
      if (!requestListener)
        requestListener = (request, response) => {
          let received = {
            args: { request, response },
            method: request.method,
            served
          };
          let url = request.url.slice(1);
          if (!url)
            url = "/";
          if (options.pages) {
            if (typeof options.pages[url] === "object") {
              if (options.pages[url].redirect) {
                url = options.pages[url].redirect;
                received.redirect = url;
              }
              if (options.pages[url].onrequest) {
                if (typeof options.pages[url].onrequest === "string") {
                  options.pages[url].onrequest = this.nodes.get(options.pages[url].onrequest);
                }
                if (typeof options.pages[url].onrequest === "object") {
                  if (options.pages[url].onrequest.run) {
                    options.pages[url].onrequest.run(options.pages[url], request, response);
                  }
                } else if (typeof options.pages[url].onrequest === "function") {
                  options.pages[url].onrequest(this, options.pages[url], request, response);
                }
              }
            }
          }
          received.route = url;
          this.receive(received);
        };
      const server = https.createServer(
        opts,
        requestListener
      );
      served.server = server;
      this.servers[`${host}:${port}`] = served;
      return new Promise((resolve, reject) => {
        server.on("error", (err) => {
          console.error("Server error:", err.toString());
          reject(err);
        });
        server.listen(
          port,
          host,
          () => {
            onStarted();
            resolve(served);
          }
        );
      });
    };
    this.transmit = (message, options, ondata, onend) => {
      let input = message;
      if (typeof input === "object")
        input = JSON.stringify(input);
      if (typeof options === "string" && message)
        return this.post(options, message);
      else if (typeof options === "string")
        return this.get(options);
      if (!options) {
        let server = this.servers[Object.keys(this.servers)[0]];
        options = {
          protocol: server.protocol,
          host: server.host,
          port: server.port,
          method: "POST",
          path: message.route,
          headers: {
            "Content-Type": "application/json",
            "Content-Length": input.length
          }
        };
      } else if (!options.headers) {
        options.headers = {
          "Content-Type": "application/json",
          "Content-Length": input.length
        };
      }
      return this.request(options, input, ondata, onend);
    };
    this.withResult = (response, result, message) => {
      if (result && !response.writableEnded && !response.destroyed) {
        if (typeof result === "string") {
          if (result.includes("<") && result.includes(">") && result.indexOf("<") < result.indexOf(">")) {
            if (message?.served?.pages?._all || message?.served?.pages?.[message.route]) {
              result = this.injectPageCode(result, message.route, message.served);
            }
            response.writeHead(200, { "Content-Type": "text/html" });
            response.end(result, "utf-8");
            return;
          }
        }
        let mimeType = "text/plain";
        if (typeof result === "object") {
          result = stringifyWithCircularRefs(result);
          mimeType = "application/json";
        }
        response.writeHead(200, { "Content-Type": mimeType });
        response.end(result, "utf-8");
      }
    };
    this.injectPageCode = (templateString, url, served) => {
      if (served?.pages?.[url]?.inject) {
        if (typeof served.pages[url].inject === "object")
          templateString = this.buildPage(served.pages[url].inject, templateString);
        else if (typeof served.pages[url].inject === "function")
          templateString += served.pages[url].inject();
        else if (typeof served.pages[url].inject === "string" || typeof served.pages[url].inject === "number")
          templateString += served.pages[url].inject;
      }
      if (served?.pages?._all?.inject) {
        if (typeof served.pages._all.inject === "object")
          templateString = this.buildPage(served.pages._all.inject, templateString);
        else if (typeof served.pages._all.inject === "function")
          templateString += served.pages._all.inject();
        else if (typeof served.pages._all.inject === "string" || typeof served.pages._all.inject === "number")
          templateString += served.pages._all.inject;
      }
      return templateString;
    };
    this.receive = (message) => {
      const request = message.args.request;
      const response = message.args.response;
      const method = message.method;
      const served = message.served;
      if (this.debug)
        console.log(request.method, request.url);
      let result = new Promise((resolve, reject) => {
        response.on("error", (err) => {
          if (!response.writableEnded || !response.destroyed) {
            response.statusCode = 400;
            response.end(void 0, void 0, () => {
              reject(err);
            });
          }
        });
        let getFailed = () => {
          if (response.writableEnded || response.destroyed)
            reject(requestURL);
          if (requestURL == "./" || requestURL == served?.startpage) {
            let template = `<!DOCTYPE html><html><head></head><body style='background-color:#101010 color:white;'><h1>Brains@Play Server</h1></body></html>`;
            if (served?.pages?._all || served?.pages?.error) {
              template = this.injectPageCode(template, message.route, served);
            }
            response.writeHead(200, { "Content-Type": "text/html" });
            response.end(template, "utf-8", () => {
              resolve(template);
            });
            if (served?.keepState)
              this.setState({ [served.address]: template });
          } else if (this.debug)
            console.log(`File ${requestURL} does not exist on path!`);
          response.writeHead(500);
          response.end(void 0, void 0, () => {
            reject(requestURL);
          });
        };
        if (method === "GET" || method === "get") {
          var requestURL = "." + request.url;
          if (requestURL == "./" && served?.startpage) {
            requestURL = served.startpage;
          }
          if ((request.url !== "/" || served?.startpage) && fs.existsSync(path.join(process.cwd(), requestURL))) {
            if (response.writableEnded || response.destroyed)
              reject(requestURL);
            fs.readFile(path.join(process.cwd(), requestURL), (error, content) => {
              if (error) {
                if (error.code == "ENOENT") {
                  if (served?.errpage) {
                    fs.readFile(served.errpage, (er, content2) => {
                      response.writeHead(404, { "Content-Type": "text/html" });
                      if (served.pages?._all || served.pages?.error) {
                        content2 = this.injectPageCode(content2.toString(), message.route, served);
                      }
                      response.end(content2, "utf-8");
                      reject(content2);
                    });
                  } else {
                    response.writeHead(404, { "Content-Type": "text/html" });
                    let content2 = `<!DOCTYPE html><html><head></head><body style='background-color:#101010 color:white;'><h1>Error: ${error.code}</h1></body></html>`;
                    if (served?.pages?._all || served?.pages?.[message.route]) {
                      content2 = this.injectPageCode(content2.toString(), message.route, served);
                    }
                    response.end(content2, "utf-8", () => {
                      reject(error.code);
                    });
                  }
                } else {
                  response.writeHead(500);
                  response.end("Something went wrong: " + error.code + " ..\n", "utf-8", () => {
                    reject(error.code);
                  });
                }
              } else {
                var extname2 = String(path.extname(requestURL)).toLowerCase();
                var contentType = this.mimeTypes[extname2] || "application/octet-stream";
                if (contentType === "text/html" && (served?.pages?._all || served?.pages?.[message.route])) {
                  content = this.injectPageCode(content.toString(), message.route, served);
                }
                response.writeHead(200, { "Content-Type": contentType });
                response.end(content, "utf-8", () => {
                  resolve(content);
                });
              }
            });
          } else if (message.route) {
            let route = this.nodes.get(message.route);
            if (!route) {
              route = this.routes[request.url];
            }
            if (route) {
              let res;
              if (message.method) {
                res = this.handleMethod(message.route, message.method, void 0, message.origin);
              } else if (message.node) {
                res = this.handleGraphNodeCall(message.node, void 0);
              } else
                res = this.handleServiceMessage({ route: message.route, args: void 0, method: message.method, origin: message.origin });
              if (res instanceof Promise)
                res.then((r) => {
                  if (served?.keepState)
                    this.setState({ [served.address]: res });
                  this.withResult(response, r, message);
                  resolve(res);
                });
              else if (res) {
                if (served?.keepState)
                  this.setState({ [served.address]: res });
                this.withResult(response, res, message);
                resolve(res);
              }
            } else if (message.redirect) {
              response.writeHead(301, { "Location": message.redirect });
              response.end();
              resolve(true);
            } else
              getFailed();
          } else
            getFailed();
        } else {
          let body = [];
          request.on("data", (chunk) => {
            body.push(chunk);
          }).on("end", () => {
            body = Buffer.concat(body).toString();
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
            let route, method2, args, origin;
            if (body?.route) {
              route = this.routes[body.route];
              method2 = body.method;
              args = body.args;
              origin = body.origin;
              if (!route) {
                if (typeof body.route === "string") {
                  if (body.route.includes("/") && body.route.length > 1)
                    body.route = body.route.split("/").pop();
                }
                route = this.routes[body.route];
              }
            }
            if (!route) {
              if (message?.route) {
                let route2 = this.routes[message.route];
                method2 = message.method;
                args = message.args;
                origin = message.origin;
                if (!route2) {
                  if (typeof message.route === "string") {
                    if (message.route.includes("/") && message.route.length > 1)
                      message.route = message.route.split("/").pop();
                  }
                  route2 = this.routes[message.route];
                }
              }
            }
            let res = body;
            if (route) {
              if (body.method) {
                res = this.handleMethod(route, method2, args, origin);
              } else if (body.node) {
                res = this.handleGraphNodeCall(body.node, body.args, body.origin);
              } else
                res = this.handleServiceMessage({ route, args, method: method2, origin });
              if (res instanceof Promise) {
                res.then((r) => {
                  this.withResult(response, r, message);
                  if (served?.keepState)
                    this.setState({ [served.address]: res });
                  resolve(res);
                });
              } else {
                this.withResult(response, res, message);
                if (served?.keepState)
                  this.setState({ [served.address]: res });
                resolve(res);
              }
            } else if (!response.writableEnded || !response.destroyed) {
              response.statusCode = 200;
              response.end(void 0, void 0, () => {
                resolve(res);
              });
            } else
              resolve(res);
          });
        }
      }).catch((er) => {
        console.error("Request Error:", er);
      });
      return result;
    };
    this.request = (options, send, ondata, onend) => {
      let client = http;
      if (options.protocol?.includes("https")) {
        client = https;
      }
      delete options.protocol;
      const req = client.request(options, (res) => {
        if (ondata)
          res.on("data", ondata);
        if (onend)
          res.on("end", onend);
      });
      if (options.headers) {
        for (const head in options.headers) {
          req.setHeader(head, options.headers[head]);
        }
      }
      if (send)
        req.write(send);
      req.end();
      return req;
    };
    this.post = (url, data, headers) => {
      let urlstring = url;
      if (urlstring instanceof URL)
        urlstring = url.toString();
      let protocol = urlstring.startsWith("https") ? "https" : "http";
      let host, port, path2;
      let split = urlstring.split("/");
      split.forEach((s) => {
        if (s.includes(":")) {
          let ss = s.split(":");
          host = ss[0];
          port = ss[1];
        }
      });
      if (split.length > 3) {
        path2 = split.slice(3).join("/");
      }
      let req = this.request(
        {
          protocol,
          host,
          port,
          path: path2,
          method: "POST",
          headers
        },
        data
      );
      return req;
    };
    this.get = (url) => {
      return new Promise((resolve, reject) => {
        let client = http;
        let urlstring = url;
        if (url instanceof URL)
          urlstring = url.toString();
        if (urlstring.includes("https")) {
          client = https;
        }
        client.get(url, (resp) => {
          let chunks = [];
          resp.on("data", (chunk) => {
            chunks.push(chunk);
          });
          resp.on("end", () => {
            resolve(Buffer.concat(chunks));
          });
        }).on("error", (err) => {
          reject(err);
        });
      });
    };
    this.terminate = (served) => {
      if (typeof served === "string")
        served = this.servers[served];
      if (typeof served === "object") {
        served.server.close();
      }
    };
    this.addPage = (path2, template) => {
      if (typeof template === "string") {
        if (!template.includes("<html"))
          template = "<!DOCTYPE html><html>" + template + "</html>";
      }
      if (typeof this.routes[path2] === "object") {
        this.routes[path2].get = template;
        this.nodes.get(path2).get = template;
      } else
        this.load({
          [path2]: {
            get: template
          }
        });
    };
    this.addHTML = (path2, template) => {
      if (typeof template === "string") {
        if (!template.includes("<") || !template.includes(">"))
          template = "<div>" + template + "</div>";
      }
      if (typeof this.routes[path2] === "object") {
        this.routes[path2].get = template;
        this.nodes.get(path2).get = template;
      } else
        this.load({
          [path2]: {
            get: template
          }
        });
    };
    this.buildPage = (pageStructure, baseTemplate) => {
      let result = ``;
      if (baseTemplate)
        result += baseTemplate;
      let appendTemplate = (obj, r, res) => {
        if (typeof obj[r] === "object") {
          for (const key in obj) {
            appendTemplate(obj, key, res);
          }
        } else if (this.routes[r]?.get) {
          let toAdd = this.routes[r].get;
          if (typeof toAdd === "function")
            toAdd = toAdd(obj[r]);
          if (typeof toAdd === "string") {
            let lastDiv = res.lastIndexOf("<");
            if (lastDiv > 0) {
              let end = res.substring(lastDiv);
              res = res.substring(0, lastDiv) + toAdd + end;
            }
            res += toAdd;
          }
        } else if (typeof this.routes[r] === "function") {
          let routeresult = this.routes[r](obj[r]);
          if (typeof routeresult === "string") {
            let lastDiv = res.lastIndexOf("<");
            if (lastDiv > 0) {
              let end = res.substring(lastDiv);
              res = res.substring(0, lastDiv) + routeresult + end;
            } else
              res += routeresult;
          }
        } else if (typeof this.routes[r] === "string")
          res += this.routes[r];
        return res;
      };
      if (Array.isArray(pageStructure)) {
        pageStructure.forEach((r) => {
          result = appendTemplate(pageStructure, r, result);
        });
      } else if (typeof pageStructure === "object") {
        for (const r in pageStructure) {
          result = appendTemplate(pageStructure, r, result);
        }
      } else if (typeof pageStructure === "string")
        result += pageStructure;
      else if (typeof pageStructure === "function")
        result += pageStructure();
      return result;
    };
    this.routes = {
      setupServer: this.setupServer,
      terminate: (path2) => {
        if (path2)
          for (const address in this.servers) {
            if (address.includes(`${path2}`)) {
              this.terminate(this.servers[address]);
              delete this.servers[address];
            }
          }
      },
      GET: this.get,
      POST: this.post,
      addPage: this.addPage,
      addHTML: this.addHTML,
      buildPage: this.buildPage,
      getRequestBody: this.getRequestBody,
      hotreload: (socketURL = `http://localhost:8080/wss`) => {
        if (socketURL instanceof URL)
          socketURL = socketURL.toString();
        const HotReloadClient = (url = `http://localhost:8080/wss`) => {
          let socket = new WebSocket(url);
          socket.addEventListener("close", () => {
            const interAttemptTimeoutMilliseconds = 100;
            const maxDisconnectedTimeMilliseconds = 3e3;
            const maxAttempts = Math.round(maxDisconnectedTimeMilliseconds / interAttemptTimeoutMilliseconds);
            let attempts = 0;
            const reloadIfCanConnect = () => {
              attempts++;
              if (attempts > maxAttempts) {
                console.error("Could not reconnect to dev server.");
                return;
              }
              socket = new WebSocket(url);
              socket.onerror = (er) => {
                console.error(`Hot reload port disconnected, will reload on reconnected. Attempt ${attempts} of ${maxAttempts}`);
              };
              socket.addEventListener("error", () => {
                setTimeout(reloadIfCanConnect, interAttemptTimeoutMilliseconds);
              });
              socket.addEventListener("open", () => {
                location.reload();
              });
            };
            reloadIfCanConnect();
          });
        };
        return `
                <script>
                    console.log('Hot Reload port available at ${socketURL}');  
                    (` + HotReloadClient.toString() + `)('${socketURL}') 
                <\/script>
            `;
      },
      pwa: (serviceWorkerPath, manifestPath) => {
      }
    };
    this.load(this.routes);
    if (settings) {
      if (settings.protocol === "https") {
        this.setupHTTPSserver(settings);
      } else
        this.setupHTTPserver(settings);
    }
  }
  getRequestBody(req) {
    let chunks = [];
    return new Promise((resolve, reject) => {
      req.on("data", (chunk) => {
        chunks.push(chunk);
      }).on("end", () => {
        resolve(Buffer.concat(chunks));
      }).on("error", (er) => {
        reject(er);
      });
    });
  }
};

// ../../../services/sse/SSE.node.ts
var import_better_sse = __toESM(require_build());
var SSEbackend = class extends Service {
  constructor(options) {
    super(options);
    this.name = "sse";
    this.debug = false;
    this.servers = {};
    this.eventsources = {};
    this.setupSSE = (options) => {
      const server = options.server;
      let path2 = options.path;
      if (this.servers[path2]) {
        return false;
      }
      const channel = (0, import_better_sse.createChannel)();
      let sse = {
        type: "sse",
        channel,
        sessions: {},
        ...options
      };
      this.servers[path2] = sse;
      if (!sse.onconnectionclose)
        sse.onconnectionclose = (session2, sse2, id, req, res) => {
          delete sse2.sessions[id];
        };
      let onRequest = (req, res) => {
        if (req.method === "GET" && req.url?.includes(path2)) {
          if (this.debug)
            console.log("SSE Request", path2);
          (0, import_better_sse.createSession)(req, res).then((session2) => {
            channel.register(session2);
            let _id = `sse${Math.floor(Math.random() * 1e15)}`;
            sse.sessions[_id] = session2;
            this.eventsources[_id] = {
              _id,
              session: session2,
              served: sse
            };
            session2.push(JSON.stringify({ route: "setId", args: _id }));
            if (options.onconnectionclose)
              session2.on("close", () => {
                options.onconnectionclose(session2, sse, _id, req, res);
              });
            if (sse.onconnection) {
              sse.onconnection(session2, sse, _id, req, res);
            }
          });
        }
      };
      let requestListeners = server.listeners("request");
      server.removeAllListeners("request");
      const otherListeners = (req, res) => {
        requestListeners.forEach((l) => {
          l(req, res);
        });
      };
      const sseListener = (req, res) => {
        if (req.url)
          if (req.url.indexOf(path2) > -1) {
            if (!this.servers[path2]) {
              server.removeListener("request", sseListener);
              server.addListener("request", otherListeners);
            }
            onRequest(req, res);
          } else
            otherListeners(req, res);
      };
      server.addListener("request", sseListener);
      server.addListener("close", () => {
        if (sse.onclose)
          sse.onclose(sse);
      });
      return sse;
    };
    this.transmit = (data, path2, channel) => {
      if (typeof data === "object") {
        if (data.route) {
          if (!path2) {
            let keys = Object.keys(this.servers);
            if (keys.length > 0) {
              let evs = this.servers[keys[0]];
              if (evs.channels?.includes(data.route)) {
                path2 = evs.path;
                channel = data.route;
              } else if (evs.channels?.includes(data.origin)) {
                path2 = evs.path;
                channel = data.origin;
              }
            }
            if (!path2 && data.route) {
              if (this.servers[data.route])
                path2 = data.route;
            }
            if (!path2 && typeof data.origin === "string") {
              if (this.servers[data.origin])
                path2 = data.origin;
            }
          }
        }
        data = JSON.stringify(data);
      }
      if (!path2)
        path2 = Object.keys(this.servers)[0];
      if (path2 && channel) {
        this.servers[path2].channel.broadcast(data, channel);
      } else if (path2) {
        let sessions = this.servers[path2].sessions;
        for (const s in sessions) {
          if (sessions[s].isConnected)
            sessions[s].push(data);
          else {
            delete sessions[s];
          }
        }
      }
    };
    this.terminate = (path2) => {
      if (typeof path2 === "object")
        delete this.servers[path2.path];
      else if (typeof path2 === "string")
        delete this.servers[path2];
    };
    this.routes = {
      setupSSE: this.setupSSE,
      terminate: this.terminate
    };
    this.load(this.routes);
  }
};

// ../../../node_modules/ws/wrapper.mjs
var import_stream = __toESM(require_stream(), 1);
var import_receiver = __toESM(require_receiver(), 1);
var import_sender = __toESM(require_sender(), 1);
var import_websocket = __toESM(require_websocket(), 1);
var import_websocket_server = __toESM(require_websocket_server(), 1);
var wrapper_default = import_websocket.default;

// ../../../services/wss/WSS.node.ts
var WSSbackend = class extends Service {
  constructor(options) {
    super(options);
    this.name = "wss";
    this.debug = false;
    this.servers = {};
    this.sockets = {};
    this.setupWSS = (options) => {
      const host = options.host;
      const port = options.port;
      let path2 = options.path;
      const server = options.server;
      delete options.server;
      if (!("keepState" in options))
        options.keepState = true;
      let opts = {
        host,
        port
      };
      if (typeof options.serverOptions)
        Object.assign(opts, options.serverOptions);
      const wss = new import_websocket_server.default(opts);
      let address = `${host}:${port}/`;
      if (path2) {
        if (path2.startsWith("/"))
          path2 = path2.substring(1);
        address += path2;
      }
      this.servers[address] = {
        type: "wss",
        wss,
        clients: {},
        address,
        ...options
      };
      wss.on("connection", (ws, request) => {
        if (this.debug)
          console.log(`New socket connection on ${address}`);
        let clientId = `socket${Math.floor(Math.random() * 1e12)}`;
        this.servers[address].clients[clientId] = ws;
        ws.send(JSON.stringify({ route: "setId", args: clientId }));
        if (options.onconnection)
          options.onconnection(ws, request, this.servers[address], clientId);
        if (!options.onmessage)
          options.onmessage = (data) => {
            if (data instanceof Buffer)
              data = data.toString();
            const result = this.receive(data, wss, this.servers[address]);
            if (options.keepState)
              this.setState({ [address]: result });
          };
        if (options.onmessage)
          ws.on("message", (data) => {
            options.onmessage(data, ws, this.servers[address]);
          });
        if (options.onconnectionclosed)
          ws.on("close", (code, reason) => {
            if (options.onconnectionclosed)
              options.onconnectionclosed(code, reason, ws, this.servers[address], clientId);
          });
      });
      wss.on("error", (err) => {
        if (this.debug)
          console.log("Socket Error:", err);
        if (options.onerror)
          options.onerror(err, wss, this.servers[address]);
        else
          console.error(err);
      });
      let onUpgrade = (request, socket, head) => {
        if (request.headers && request.url) {
          if (this.debug)
            console.log("Upgrade request at: ", request.url);
          let addr = request.headers.host.split(":")[0];
          addr += ":" + port;
          addr += request.url.split("?")[0];
          if (addr === address && this.servers[addr]) {
            this.servers[addr].wss.handleUpgrade(request, socket, head, (ws) => {
              if (options.onupgrade)
                options.onupgrade(ws, this.servers[address], request, socket, head);
              this.servers[addr].wss.emit("connection", ws, request);
            });
          }
        }
      };
      server.addListener("upgrade", onUpgrade);
      wss.on("close", () => {
        server.removeListener("upgrade", onUpgrade);
        if (options.onclose)
          options.onclose(wss, this.servers[address]);
        else
          console.log(`wss closed: ${address}`);
      });
      return this.servers[address];
    };
    this.openWS = (options) => {
      let protocol = options.protocol;
      if (!protocol)
        protocol = "wss";
      let address = `${protocol}://${options.host}`;
      if (options.port)
        address += ":" + options.port;
      if (!options.path || options.path?.startsWith("/"))
        address += "/";
      if (options.path)
        address += options.path;
      const socket = new wrapper_default(address);
      if (!("keepState" in options))
        options.keepState = true;
      if (options.onmessage)
        socket.on("message", (data) => {
          options.onmessage(data, socket, this.sockets[address]);
        });
      else {
        let socketonmessage = (data) => {
          if (data) {
            if (typeof data === "string") {
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
                  socket.removeEventListener("message", socketonmessage);
                  socket.on("message", (data2) => {
                    this.receive(data2, socket, this.sockets[address]);
                    if (options.keepState) {
                      this.setState({ [address]: data2 });
                    }
                  });
                }
              }
            }
          }
          this.receive(data, socket, this.sockets[address]);
          if (options.keepState)
            this.setState({ [address]: data });
        };
        socket.on("message", socketonmessage);
        options.onmessage = socketonmessage;
      }
      if (options.onopen)
        socket.on("open", () => {
          options.onopen(socket, this.sockets[address]);
        });
      if (options.onclose)
        socket.on("close", (code, reason) => {
          options.onclose(code, reason, socket, this.sockets[address]);
        });
      if (options.onerror)
        socket.on("error", (er) => {
          options.onerror(er, socket, this.sockets[address]);
        });
      let send = (message) => {
        return this.transmit(message, socket);
      };
      let post = (route, args, origin, method) => {
        let message = {
          route,
          args
        };
        if (origin)
          message.origin = origin;
        if (method)
          message.method = method;
        return this.transmit(message, socket);
      };
      let run = (route, args, origin, method) => {
        return new Promise((res, rej) => {
          let callbackId = Math.random();
          let req = { route: "runRequest", args: [{ route, args }, options._id, callbackId] };
          if (origin)
            req.args[0].origin = origin;
          if (method)
            req.args[0].method = method;
          let onmessage = (ev) => {
            if (typeof ev.data === "string" && ev.data.indexOf("{") > -1)
              ev.data = JSON.parse(ev.data);
            if (typeof ev.data === "object") {
              if (ev.data.callbackId === callbackId) {
                socket.removeEventListener("message", onmessage);
                res(ev.data.args);
              }
            }
          };
          socket.addEventListener("message", onmessage);
          this.transmit(req, socket);
        });
      };
      let request = (message, origin, method) => {
        return new Promise((res, rej) => {
          let callbackId = Math.random();
          let req = { route: "runRequest", args: [message, options._id, callbackId] };
          if (origin)
            req.origin = origin;
          if (method)
            req.method = method;
          let onmessage = (ev) => {
            if (typeof ev.data === "string" && ev.data.indexOf("{") > -1)
              ev.data = JSON.parse(ev.data);
            if (typeof ev.data === "object") {
              if (ev.data.callbackId === callbackId) {
                socket.removeEventListener("message", onmessage);
                res(ev.data.args);
              }
            }
          };
          socket.addEventListener("message", onmessage);
          this.transmit(req, socket);
        });
      };
      let subscribe = (route, callback) => {
        return this.subscribeToSocket(route, address, callback);
      };
      let unsubscribe = (route, sub) => {
        return run("unsubscribe", [route, sub]);
      };
      this.sockets[address] = {
        type: "socket",
        socket,
        address,
        send,
        post,
        request,
        run,
        subscribe,
        unsubscribe,
        ...options
      };
      return socket;
    };
    this.transmit = (message, ws) => {
      if (typeof message === "object")
        message = JSON.stringify(message);
      if (!ws) {
        let served = this.servers[Object.keys(this.servers)[0]];
        if (served)
          ws = served.wss;
        else {
          let s = this.sockets[Object.keys(this.sockets)[0]];
          if (s)
            ws = s.socket;
        }
        ;
      }
      if (ws instanceof import_websocket_server.default) {
        ws.clients.forEach((c) => {
          c.send(message);
        });
      } else if (ws instanceof wrapper_default)
        ws.send(message);
    };
    this.closeWS = (ws) => {
      if (!ws) {
        let s = this.sockets[Object.keys(this.sockets)[0]];
        if (s)
          ws = s.socket;
      } else if (typeof ws === "string") {
        for (const k in this.sockets) {
          if (k.includes(ws)) {
            ws = this.sockets[k].socket;
            break;
          }
        }
      }
      if (ws instanceof wrapper_default) {
        if (ws.readyState === ws.OPEN)
          ws.close();
      }
      return true;
    };
    this.terminate = (ws) => {
      if (!ws) {
        let served = this.servers[Object.keys(this.servers)[0]];
        if (served)
          ws = served.wss;
      } else if (typeof ws === "string") {
        for (const k in this.servers) {
          if (k.includes(ws)) {
            ws = this.servers[k].wss;
            break;
          }
        }
        if (!ws) {
          for (const k in this.sockets) {
            if (k.includes(ws)) {
              ws = this.sockets[k].socket;
              break;
            }
          }
        }
      }
      if (ws instanceof import_websocket_server.default)
        ws.close((er) => {
          if (er)
            console.error(er);
        });
      else if (ws instanceof wrapper_default) {
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
          if (typeof data === "object") {
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
      if (ws) {
        if (typeof ws === "string") {
          for (const key in this.servers) {
            for (const c in this.servers[key].clients) {
              if (c === ws) {
                ws = this.servers[key].clients[c];
                break;
              }
            }
          }
          if (!(ws instanceof wrapper_default)) {
            for (const s in this.sockets) {
              if (s === ws) {
                ws = this.sockets[s].socket;
                break;
              }
            }
          }
        }
        if (res instanceof Promise) {
          res.then((v) => {
            res = { args: v, callbackId };
            if (ws instanceof wrapper_default)
              ws.send(JSON.stringify(res));
          });
        } else {
          res = { args: res, callbackId };
          if (ws instanceof wrapper_default)
            ws.send(JSON.stringify(res));
        }
      }
      return res;
    };
    this.routes = {
      setupWSS: this.setupWSS,
      openWS: this.openWS,
      closeWS: this.closeWS,
      request: this.request,
      runRequest: this.runRequest,
      terminate: this.terminate,
      subscribeSocket: this.subscribeSocket,
      subscribeToSocket: this.subscribeToSocket,
      unsubscribe: this.unsubscribe
    };
    this.load(this.routes);
  }
  subscribeSocket(route, socket) {
    if (typeof socket === "string" && this.sockets[socket]) {
      socket = this.sockets[socket].socket;
    }
    return this.subscribe(route, (res) => {
      if (res instanceof Promise) {
        res.then((r) => {
          socket.send(JSON.stringify({ args: r, callbackId: route }));
        });
      } else {
        socket.send(JSON.stringify({ args: res, callbackId: route }));
      }
    });
  }
  subscribeToSocket(route, socketId, callback) {
    if (typeof socketId === "string" && this.sockets[socketId]) {
      this.subscribe(socketId, (res) => {
        if (res?.callbackId === route) {
          if (!callback)
            this.setState({ [socketId]: res.args });
          else if (typeof callback === "string") {
            this.setState({ [callback]: res.args });
          } else
            callback(res.args);
        }
      });
      return this.sockets[socketId].request(JSON.stringify({ route: "subscribeSocket", args: [route, socketId] }));
    }
  }
};

// server.ts
var import_fs = __toESM(require("fs"));
function exitHandler(options, exitCode) {
  if (exitCode || exitCode === 0)
    console.log("SERVER EXITED WITH CODE: ", exitCode);
  if (options.exit)
    process.exit();
}
process.on("exit", exitHandler.bind(null, { cleanup: true }));
process.on("SIGINT", exitHandler.bind(null, { exit: true }));
import_fs.default.readdirSync("./");
var router = new UserRouter([
  HTTPbackend,
  WSSbackend,
  SSEbackend
], { loadDefaultRoutes: true });
router.run(
  "http.setupServer",
  {
    protocol: "http",
    host: "localhost",
    port: 8080,
    startpage: "index.html",
    pages: {
      _all: {
        inject: {
          hotreload: "ws://localhost:8080/hotreload"
        }
      }
    }
  }
).then((served) => {
  const socketserver = router.run(
    "wss.setupWSS",
    {
      server: served.server,
      host: served.host,
      port: 8081,
      path: "wss",
      onconnection: (ws, req, serverinfo, id) => {
        ws.send("Hello from WSS!");
      }
    }
  );
  const hotreload = router.run(
    "wss.setupWSS",
    {
      server: served.server,
      host: served.host,
      port: 7e3,
      path: "hotreload",
      onconnection: (ws) => {
        ws.send("Hot reload port opened!");
      }
    }
  );
  const sseinfo = router.run(
    "sse.setupSSE",
    {
      server: served.server,
      path: "sse",
      channels: ["test"],
      onconnection: (session2, sseinfo2, id, req, res) => {
        console.log("pushing sse!");
        session2.push("Hello from SSE!");
        sseinfo2.channels.forEach(
          (c) => sseinfo2.channel.broadcast(
            "SSE connection at " + req.headers.host + "/" + req.url,
            c
          )
        );
      }
    }
  );
});
console.log("main service routes", router.service.routes);
console.log("http service routes", router.services.http.routes);
var sub1 = router.pipe("ping", "log", "wss");
var sub2 = router.pipe("ping", "log", "sse");
router.addUser({
  _id: "admin"
});
router.run("sessionLoop");
var session = router.openSharedSession({
  _id: "webrtcrooms",
  settings: {
    name: "webrtcrooms",
    propnames: {
      rooms: true
    }
  }
}, "admin");
router.subscribe("addUser", (res) => {
  if (typeof res === "object") {
    let user = res;
    let joined = router.joinSession("webrtcrooms", user);
    if (joined) {
      user.send(
        JSON.stringify({ route: "joinSession", args: [joined._id, user._id, joined] })
      );
    }
  }
});
