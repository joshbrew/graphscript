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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));

// node_modules/node-gyp-build/index.js
var require_node_gyp_build = __commonJS({
  "node_modules/node-gyp-build/index.js"(exports, module2) {
    var fs = require("fs");
    var path = require("path");
    var os = require("os");
    var runtimeRequire = typeof __webpack_require__ === "function" ? __non_webpack_require__ : require;
    var vars = process.config && process.config.variables || {};
    var prebuildsOnly = !!process.env.PREBUILDS_ONLY;
    var abi = process.versions.modules;
    var runtime = isElectron() ? "electron" : isNwjs() ? "node-webkit" : "node";
    var arch = process.env.npm_config_arch || os.arch();
    var platform = process.env.npm_config_platform || os.platform();
    var libc = process.env.LIBC || (isAlpine(platform) ? "musl" : "glibc");
    var armv = process.env.ARM_VERSION || (arch === "arm64" ? "8" : vars.arm_version) || "";
    var uv = (process.versions.uv || "").split(".")[0];
    module2.exports = load;
    function load(dir) {
      return runtimeRequire(load.path(dir));
    }
    load.path = function(dir) {
      dir = path.resolve(dir || ".");
      try {
        var name = runtimeRequire(path.join(dir, "package.json")).name.toUpperCase().replace(/-/g, "_");
        if (process.env[name + "_PREBUILD"])
          dir = process.env[name + "_PREBUILD"];
      } catch (err) {
      }
      if (!prebuildsOnly) {
        var release = getFirst(path.join(dir, "build/Release"), matchBuild);
        if (release)
          return release;
        var debug = getFirst(path.join(dir, "build/Debug"), matchBuild);
        if (debug)
          return debug;
      }
      var prebuild = resolve(dir);
      if (prebuild)
        return prebuild;
      var nearby = resolve(path.dirname(process.execPath));
      if (nearby)
        return nearby;
      var target = [
        "platform=" + platform,
        "arch=" + arch,
        "runtime=" + runtime,
        "abi=" + abi,
        "uv=" + uv,
        armv ? "armv=" + armv : "",
        "libc=" + libc,
        "node=" + process.versions.node,
        process.versions.electron ? "electron=" + process.versions.electron : "",
        typeof __webpack_require__ === "function" ? "webpack=true" : ""
      ].filter(Boolean).join(" ");
      throw new Error("No native build was found for " + target + "\n    loaded from: " + dir + "\n");
      function resolve(dir2) {
        var tuples = readdirSync(path.join(dir2, "prebuilds")).map(parseTuple);
        var tuple = tuples.filter(matchTuple(platform, arch)).sort(compareTuples)[0];
        if (!tuple)
          return;
        var prebuilds = path.join(dir2, "prebuilds", tuple.name);
        var parsed = readdirSync(prebuilds).map(parseTags);
        var candidates = parsed.filter(matchTags(runtime, abi));
        var winner = candidates.sort(compareTags(runtime))[0];
        if (winner)
          return path.join(prebuilds, winner.file);
      }
    };
    function readdirSync(dir) {
      try {
        return fs.readdirSync(dir);
      } catch (err) {
        return [];
      }
    }
    function getFirst(dir, filter) {
      var files = readdirSync(dir).filter(filter);
      return files[0] && path.join(dir, files[0]);
    }
    function matchBuild(name) {
      return /\.node$/.test(name);
    }
    function parseTuple(name) {
      var arr = name.split("-");
      if (arr.length !== 2)
        return;
      var platform2 = arr[0];
      var architectures = arr[1].split("+");
      if (!platform2)
        return;
      if (!architectures.length)
        return;
      if (!architectures.every(Boolean))
        return;
      return { name, platform: platform2, architectures };
    }
    function matchTuple(platform2, arch2) {
      return function(tuple) {
        if (tuple == null)
          return false;
        if (tuple.platform !== platform2)
          return false;
        return tuple.architectures.includes(arch2);
      };
    }
    function compareTuples(a, b) {
      return a.architectures.length - b.architectures.length;
    }
    function parseTags(file) {
      var arr = file.split(".");
      var extension = arr.pop();
      var tags = { file, specificity: 0 };
      if (extension !== "node")
        return;
      for (var i = 0; i < arr.length; i++) {
        var tag = arr[i];
        if (tag === "node" || tag === "electron" || tag === "node-webkit") {
          tags.runtime = tag;
        } else if (tag === "napi") {
          tags.napi = true;
        } else if (tag.slice(0, 3) === "abi") {
          tags.abi = tag.slice(3);
        } else if (tag.slice(0, 2) === "uv") {
          tags.uv = tag.slice(2);
        } else if (tag.slice(0, 4) === "armv") {
          tags.armv = tag.slice(4);
        } else if (tag === "glibc" || tag === "musl") {
          tags.libc = tag;
        } else {
          continue;
        }
        tags.specificity++;
      }
      return tags;
    }
    function matchTags(runtime2, abi2) {
      return function(tags) {
        if (tags == null)
          return false;
        if (tags.runtime !== runtime2 && !runtimeAgnostic(tags))
          return false;
        if (tags.abi !== abi2 && !tags.napi)
          return false;
        if (tags.uv && tags.uv !== uv)
          return false;
        if (tags.armv && tags.armv !== armv)
          return false;
        if (tags.libc && tags.libc !== libc)
          return false;
        return true;
      };
    }
    function runtimeAgnostic(tags) {
      return tags.runtime === "node" && tags.napi;
    }
    function compareTags(runtime2) {
      return function(a, b) {
        if (a.runtime !== b.runtime) {
          return a.runtime === runtime2 ? -1 : 1;
        } else if (a.abi !== b.abi) {
          return a.abi ? -1 : 1;
        } else if (a.specificity !== b.specificity) {
          return a.specificity > b.specificity ? -1 : 1;
        } else {
          return 0;
        }
      };
    }
    function isNwjs() {
      return !!(process.versions && process.versions.nw);
    }
    function isElectron() {
      if (process.versions && process.versions.electron)
        return true;
      if (process.env.ELECTRON_RUN_AS_NODE)
        return true;
      return typeof window !== "undefined" && window.process && window.process.type === "renderer";
    }
    function isAlpine(platform2) {
      return platform2 === "linux" && fs.existsSync("/etc/alpine-release");
    }
    load.parseTags = parseTags;
    load.matchTags = matchTags;
    load.compareTags = compareTags;
    load.parseTuple = parseTuple;
    load.matchTuple = matchTuple;
    load.compareTuples = compareTuples;
  }
});

// node_modules/bufferutil/fallback.js
var require_fallback = __commonJS({
  "node_modules/bufferutil/fallback.js"(exports, module2) {
    "use strict";
    var mask = (source, mask2, output, offset, length) => {
      for (var i = 0; i < length; i++) {
        output[offset + i] = source[i] ^ mask2[i & 3];
      }
    };
    var unmask = (buffer, mask2) => {
      const length = buffer.length;
      for (var i = 0; i < length; i++) {
        buffer[i] ^= mask2[i & 3];
      }
    };
    module2.exports = { mask, unmask };
  }
});

// node_modules/bufferutil/index.js
var require_bufferutil = __commonJS({
  "node_modules/bufferutil/index.js"(exports, module2) {
    "use strict";
    try {
      module2.exports = require_node_gyp_build()(__dirname);
    } catch (e) {
      module2.exports = require_fallback();
    }
  }
});

// node_modules/utf-8-validate/fallback.js
var require_fallback2 = __commonJS({
  "node_modules/utf-8-validate/fallback.js"(exports, module2) {
    "use strict";
    function isValidUTF8(buf) {
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
    module2.exports = isValidUTF8;
  }
});

// node_modules/utf-8-validate/index.js
var require_utf_8_validate = __commonJS({
  "node_modules/utf-8-validate/index.js"(exports, module2) {
    "use strict";
    try {
      module2.exports = require_node_gyp_build()(__dirname);
    } catch (e) {
      module2.exports = require_fallback2();
    }
  }
});

// node_modules/graphscript-node/dist/index.node.js
var require_index_node = __commonJS({
  "node_modules/graphscript-node/dist/index.node.js"(exports, module2) {
    var __create2 = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __getProtoOf2 = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __commonJS2 = (cb, mod) => function __require() {
      return mod || (0, cb[__getOwnPropNames2(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    };
    var __export = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toESM2 = (mod, isNodeMode, target) => (target = mod != null ? __create2(__getProtoOf2(mod)) : {}, __copyProps2(isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", { value: mod, enumerable: true }) : target, mod));
    var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var require_sjcl = __commonJS2({ "services/e2ee/sjcl.js"(exports2, module22) {
      "use strict";
      var sjcl2 = { cipher: {}, hash: {}, keyexchange: {}, mode: {}, misc: {}, codec: {}, exception: { corrupt: function(a) {
        this.toString = function() {
          return "CORRUPT: " + this.message;
        };
        this.message = a;
      }, invalid: function(a) {
        this.toString = function() {
          return "INVALID: " + this.message;
        };
        this.message = a;
      }, bug: function(a) {
        this.toString = function() {
          return "BUG: " + this.message;
        };
        this.message = a;
      }, notReady: function(a) {
        this.toString = function() {
          return "NOT READY: " + this.message;
        };
        this.message = a;
      } } };
      sjcl2.cipher.aes = function(a) {
        this.s[0][0][0] || this.O();
        var b, c, d, e, f = this.s[0][4], g = this.s[1];
        b = a.length;
        var h = 1;
        if (4 !== b && 6 !== b && 8 !== b)
          throw new sjcl2.exception.invalid("invalid aes key size");
        this.b = [d = a.slice(0), e = []];
        for (a = b; a < 4 * b + 28; a++) {
          c = d[a - 1];
          if (0 === a % b || 8 === b && 4 === a % b)
            c = f[c >>> 24] << 24 ^ f[c >> 16 & 255] << 16 ^ f[c >> 8 & 255] << 8 ^ f[c & 255], 0 === a % b && (c = c << 8 ^ c >>> 24 ^ h << 24, h = h << 1 ^ 283 * (h >> 7));
          d[a] = d[a - b] ^ c;
        }
        for (b = 0; a; b++, a--)
          c = d[b & 3 ? a : a - 4], e[b] = 4 >= a || 4 > b ? c : g[0][f[c >>> 24]] ^ g[1][f[c >> 16 & 255]] ^ g[2][f[c >> 8 & 255]] ^ g[3][f[c & 255]];
      };
      sjcl2.cipher.aes.prototype = { encrypt: function(a) {
        return t(this, a, 0);
      }, decrypt: function(a) {
        return t(this, a, 1);
      }, s: [[[], [], [], [], []], [[], [], [], [], []]], O: function() {
        var a = this.s[0], b = this.s[1], c = a[4], d = b[4], e, f, g, h = [], k = [], l, n, m, p;
        for (e = 0; 256 > e; e++)
          k[(h[e] = e << 1 ^ 283 * (e >> 7)) ^ e] = e;
        for (f = g = 0; !c[f]; f ^= l || 1, g = k[g] || 1)
          for (m = g ^ g << 1 ^ g << 2 ^ g << 3 ^ g << 4, m = m >> 8 ^ m & 255 ^ 99, c[f] = m, d[m] = f, n = h[e = h[l = h[f]]], p = 16843009 * n ^ 65537 * e ^ 257 * l ^ 16843008 * f, n = 257 * h[m] ^ 16843008 * m, e = 0; 4 > e; e++)
            a[e][f] = n = n << 24 ^ n >>> 8, b[e][m] = p = p << 24 ^ p >>> 8;
        for (e = 0; 5 > e; e++)
          a[e] = a[e].slice(0), b[e] = b[e].slice(0);
      } };
      function t(a, b, c) {
        if (4 !== b.length)
          throw new sjcl2.exception.invalid("invalid aes block size");
        var d = a.b[c], e = b[0] ^ d[0], f = b[c ? 3 : 1] ^ d[1], g = b[2] ^ d[2];
        b = b[c ? 1 : 3] ^ d[3];
        var h, k, l, n = d.length / 4 - 2, m, p = 4, r = [0, 0, 0, 0];
        h = a.s[c];
        a = h[0];
        var q = h[1], v = h[2], w = h[3], x = h[4];
        for (m = 0; m < n; m++)
          h = a[e >>> 24] ^ q[f >> 16 & 255] ^ v[g >> 8 & 255] ^ w[b & 255] ^ d[p], k = a[f >>> 24] ^ q[g >> 16 & 255] ^ v[b >> 8 & 255] ^ w[e & 255] ^ d[p + 1], l = a[g >>> 24] ^ q[b >> 16 & 255] ^ v[e >> 8 & 255] ^ w[f & 255] ^ d[p + 2], b = a[b >>> 24] ^ q[e >> 16 & 255] ^ v[f >> 8 & 255] ^ w[g & 255] ^ d[p + 3], p += 4, e = h, f = k, g = l;
        for (m = 0; 4 > m; m++)
          r[c ? 3 & -m : m] = x[e >>> 24] << 24 ^ x[f >> 16 & 255] << 16 ^ x[g >> 8 & 255] << 8 ^ x[b & 255] ^ d[p++], h = e, e = f, f = g, g = b, b = h;
        return r;
      }
      sjcl2.bitArray = { bitSlice: function(a, b, c) {
        a = sjcl2.bitArray.$(a.slice(b / 32), 32 - (b & 31)).slice(1);
        return void 0 === c ? a : sjcl2.bitArray.clamp(a, c - b);
      }, extract: function(a, b, c) {
        var d = Math.floor(-b - c & 31);
        return ((b + c - 1 ^ b) & -32 ? a[b / 32 | 0] << 32 - d ^ a[b / 32 + 1 | 0] >>> d : a[b / 32 | 0] >>> d) & (1 << c) - 1;
      }, concat: function(a, b) {
        if (0 === a.length || 0 === b.length)
          return a.concat(b);
        var c = a[a.length - 1], d = sjcl2.bitArray.getPartial(c);
        return 32 === d ? a.concat(b) : sjcl2.bitArray.$(b, d, c | 0, a.slice(0, a.length - 1));
      }, bitLength: function(a) {
        var b = a.length;
        return 0 === b ? 0 : 32 * (b - 1) + sjcl2.bitArray.getPartial(a[b - 1]);
      }, clamp: function(a, b) {
        if (32 * a.length < b)
          return a;
        a = a.slice(0, Math.ceil(b / 32));
        var c = a.length;
        b = b & 31;
        0 < c && b && (a[c - 1] = sjcl2.bitArray.partial(b, a[c - 1] & 2147483648 >> b - 1, 1));
        return a;
      }, partial: function(a, b, c) {
        return 32 === a ? b : (c ? b | 0 : b << 32 - a) + 1099511627776 * a;
      }, getPartial: function(a) {
        return Math.round(a / 1099511627776) || 32;
      }, equal: function(a, b) {
        if (sjcl2.bitArray.bitLength(a) !== sjcl2.bitArray.bitLength(b))
          return false;
        var c = 0, d;
        for (d = 0; d < a.length; d++)
          c |= a[d] ^ b[d];
        return 0 === c;
      }, $: function(a, b, c, d) {
        var e;
        e = 0;
        for (void 0 === d && (d = []); 32 <= b; b -= 32)
          d.push(c), c = 0;
        if (0 === b)
          return d.concat(a);
        for (e = 0; e < a.length; e++)
          d.push(c | a[e] >>> b), c = a[e] << 32 - b;
        e = a.length ? a[a.length - 1] : 0;
        a = sjcl2.bitArray.getPartial(e);
        d.push(sjcl2.bitArray.partial(b + a & 31, 32 < b + a ? c : d.pop(), 1));
        return d;
      }, i: function(a, b) {
        return [a[0] ^ b[0], a[1] ^ b[1], a[2] ^ b[2], a[3] ^ b[3]];
      }, byteswapM: function(a) {
        var b, c;
        for (b = 0; b < a.length; ++b)
          c = a[b], a[b] = c >>> 24 | c >>> 8 & 65280 | (c & 65280) << 8 | c << 24;
        return a;
      } };
      sjcl2.codec.utf8String = { fromBits: function(a) {
        var b = "", c = sjcl2.bitArray.bitLength(a), d, e;
        for (d = 0; d < c / 8; d++)
          0 === (d & 3) && (e = a[d / 4]), b += String.fromCharCode(e >>> 8 >>> 8 >>> 8), e <<= 8;
        return decodeURIComponent(escape(b));
      }, toBits: function(a) {
        a = unescape(encodeURIComponent(a));
        var b = [], c, d = 0;
        for (c = 0; c < a.length; c++)
          d = d << 8 | a.charCodeAt(c), 3 === (c & 3) && (b.push(d), d = 0);
        c & 3 && b.push(sjcl2.bitArray.partial(8 * (c & 3), d));
        return b;
      } };
      sjcl2.codec.hex = { fromBits: function(a) {
        var b = "", c;
        for (c = 0; c < a.length; c++)
          b += ((a[c] | 0) + 263882790666240).toString(16).substr(4);
        return b.substr(0, sjcl2.bitArray.bitLength(a) / 4);
      }, toBits: function(a) {
        var b, c = [], d;
        a = a.replace(/\s|0x/g, "");
        d = a.length;
        a = a + "00000000";
        for (b = 0; b < a.length; b += 8)
          c.push(parseInt(a.substr(b, 8), 16) ^ 0);
        return sjcl2.bitArray.clamp(c, 4 * d);
      } };
      sjcl2.codec.base32 = { B: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567", X: "0123456789ABCDEFGHIJKLMNOPQRSTUV", BITS: 32, BASE: 5, REMAINING: 27, fromBits: function(a, b, c) {
        var d = sjcl2.codec.base32.BASE, e = sjcl2.codec.base32.REMAINING, f = "", g = 0, h = sjcl2.codec.base32.B, k = 0, l = sjcl2.bitArray.bitLength(a);
        c && (h = sjcl2.codec.base32.X);
        for (c = 0; f.length * d < l; )
          f += h.charAt((k ^ a[c] >>> g) >>> e), g < d ? (k = a[c] << d - g, g += e, c++) : (k <<= d, g -= d);
        for (; f.length & 7 && !b; )
          f += "=";
        return f;
      }, toBits: function(a, b) {
        a = a.replace(/\s|=/g, "").toUpperCase();
        var c = sjcl2.codec.base32.BITS, d = sjcl2.codec.base32.BASE, e = sjcl2.codec.base32.REMAINING, f = [], g, h = 0, k = sjcl2.codec.base32.B, l = 0, n, m = "base32";
        b && (k = sjcl2.codec.base32.X, m = "base32hex");
        for (g = 0; g < a.length; g++) {
          n = k.indexOf(a.charAt(g));
          if (0 > n) {
            if (!b)
              try {
                return sjcl2.codec.base32hex.toBits(a);
              } catch (p) {
              }
            throw new sjcl2.exception.invalid("this isn't " + m + "!");
          }
          h > e ? (h -= e, f.push(l ^ n >>> h), l = n << c - h) : (h += d, l ^= n << c - h);
        }
        h & 56 && f.push(sjcl2.bitArray.partial(h & 56, l, 1));
        return f;
      } };
      sjcl2.codec.base32hex = { fromBits: function(a, b) {
        return sjcl2.codec.base32.fromBits(a, b, 1);
      }, toBits: function(a) {
        return sjcl2.codec.base32.toBits(a, 1);
      } };
      sjcl2.codec.base64 = { B: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", fromBits: function(a, b, c) {
        var d = "", e = 0, f = sjcl2.codec.base64.B, g = 0, h = sjcl2.bitArray.bitLength(a);
        c && (f = f.substr(0, 62) + "-_");
        for (c = 0; 6 * d.length < h; )
          d += f.charAt((g ^ a[c] >>> e) >>> 26), 6 > e ? (g = a[c] << 6 - e, e += 26, c++) : (g <<= 6, e -= 6);
        for (; d.length & 3 && !b; )
          d += "=";
        return d;
      }, toBits: function(a, b) {
        a = a.replace(/\s|=/g, "");
        var c = [], d, e = 0, f = sjcl2.codec.base64.B, g = 0, h;
        b && (f = f.substr(0, 62) + "-_");
        for (d = 0; d < a.length; d++) {
          h = f.indexOf(a.charAt(d));
          if (0 > h)
            throw new sjcl2.exception.invalid("this isn't base64!");
          26 < e ? (e -= 26, c.push(g ^ h >>> e), g = h << 32 - e) : (e += 6, g ^= h << 32 - e);
        }
        e & 56 && c.push(sjcl2.bitArray.partial(e & 56, g, 1));
        return c;
      } };
      sjcl2.codec.base64url = { fromBits: function(a) {
        return sjcl2.codec.base64.fromBits(a, 1, 1);
      }, toBits: function(a) {
        return sjcl2.codec.base64.toBits(a, 1);
      } };
      sjcl2.hash.sha256 = function(a) {
        this.b[0] || this.O();
        a ? (this.F = a.F.slice(0), this.A = a.A.slice(0), this.l = a.l) : this.reset();
      };
      sjcl2.hash.sha256.hash = function(a) {
        return new sjcl2.hash.sha256().update(a).finalize();
      };
      sjcl2.hash.sha256.prototype = { blockSize: 512, reset: function() {
        this.F = this.Y.slice(0);
        this.A = [];
        this.l = 0;
        return this;
      }, update: function(a) {
        "string" === typeof a && (a = sjcl2.codec.utf8String.toBits(a));
        var b, c = this.A = sjcl2.bitArray.concat(this.A, a);
        b = this.l;
        a = this.l = b + sjcl2.bitArray.bitLength(a);
        if (9007199254740991 < a)
          throw new sjcl2.exception.invalid("Cannot hash more than 2^53 - 1 bits");
        if ("undefined" !== typeof Uint32Array) {
          var d = new Uint32Array(c), e = 0;
          for (b = 512 + b - (512 + b & 511); b <= a; b += 512)
            u(this, d.subarray(16 * e, 16 * (e + 1))), e += 1;
          c.splice(0, 16 * e);
        } else
          for (b = 512 + b - (512 + b & 511); b <= a; b += 512)
            u(this, c.splice(0, 16));
        return this;
      }, finalize: function() {
        var a, b = this.A, c = this.F, b = sjcl2.bitArray.concat(b, [sjcl2.bitArray.partial(1, 1)]);
        for (a = b.length + 2; a & 15; a++)
          b.push(0);
        b.push(Math.floor(this.l / 4294967296));
        for (b.push(this.l | 0); b.length; )
          u(this, b.splice(0, 16));
        this.reset();
        return c;
      }, Y: [], b: [], O: function() {
        function a(a2) {
          return 4294967296 * (a2 - Math.floor(a2)) | 0;
        }
        for (var b = 0, c = 2, d, e; 64 > b; c++) {
          e = true;
          for (d = 2; d * d <= c; d++)
            if (0 === c % d) {
              e = false;
              break;
            }
          e && (8 > b && (this.Y[b] = a(Math.pow(c, 0.5))), this.b[b] = a(Math.pow(c, 1 / 3)), b++);
        }
      } };
      function u(a, b) {
        var c, d, e, f = a.F, g = a.b, h = f[0], k = f[1], l = f[2], n = f[3], m = f[4], p = f[5], r = f[6], q = f[7];
        for (c = 0; 64 > c; c++)
          16 > c ? d = b[c] : (d = b[c + 1 & 15], e = b[c + 14 & 15], d = b[c & 15] = (d >>> 7 ^ d >>> 18 ^ d >>> 3 ^ d << 25 ^ d << 14) + (e >>> 17 ^ e >>> 19 ^ e >>> 10 ^ e << 15 ^ e << 13) + b[c & 15] + b[c + 9 & 15] | 0), d = d + q + (m >>> 6 ^ m >>> 11 ^ m >>> 25 ^ m << 26 ^ m << 21 ^ m << 7) + (r ^ m & (p ^ r)) + g[c], q = r, r = p, p = m, m = n + d | 0, n = l, l = k, k = h, h = d + (k & l ^ n & (k ^ l)) + (k >>> 2 ^ k >>> 13 ^ k >>> 22 ^ k << 30 ^ k << 19 ^ k << 10) | 0;
        f[0] = f[0] + h | 0;
        f[1] = f[1] + k | 0;
        f[2] = f[2] + l | 0;
        f[3] = f[3] + n | 0;
        f[4] = f[4] + m | 0;
        f[5] = f[5] + p | 0;
        f[6] = f[6] + r | 0;
        f[7] = f[7] + q | 0;
      }
      sjcl2.mode.ccm = { name: "ccm", G: [], listenProgress: function(a) {
        sjcl2.mode.ccm.G.push(a);
      }, unListenProgress: function(a) {
        a = sjcl2.mode.ccm.G.indexOf(a);
        -1 < a && sjcl2.mode.ccm.G.splice(a, 1);
      }, fa: function(a) {
        var b = sjcl2.mode.ccm.G.slice(), c;
        for (c = 0; c < b.length; c += 1)
          b[c](a);
      }, encrypt: function(a, b, c, d, e) {
        var f, g = b.slice(0), h = sjcl2.bitArray, k = h.bitLength(c) / 8, l = h.bitLength(g) / 8;
        e = e || 64;
        d = d || [];
        if (7 > k)
          throw new sjcl2.exception.invalid("ccm: iv must be at least 7 bytes");
        for (f = 2; 4 > f && l >>> 8 * f; f++)
          ;
        f < 15 - k && (f = 15 - k);
        c = h.clamp(c, 8 * (15 - f));
        b = sjcl2.mode.ccm.V(a, b, c, d, e, f);
        g = sjcl2.mode.ccm.C(a, g, c, b, e, f);
        return h.concat(g.data, g.tag);
      }, decrypt: function(a, b, c, d, e) {
        e = e || 64;
        d = d || [];
        var f = sjcl2.bitArray, g = f.bitLength(c) / 8, h = f.bitLength(b), k = f.clamp(b, h - e), l = f.bitSlice(b, h - e), h = (h - e) / 8;
        if (7 > g)
          throw new sjcl2.exception.invalid("ccm: iv must be at least 7 bytes");
        for (b = 2; 4 > b && h >>> 8 * b; b++)
          ;
        b < 15 - g && (b = 15 - g);
        c = f.clamp(c, 8 * (15 - b));
        k = sjcl2.mode.ccm.C(a, k, c, l, e, b);
        a = sjcl2.mode.ccm.V(a, k.data, c, d, e, b);
        if (!f.equal(k.tag, a))
          throw new sjcl2.exception.corrupt("ccm: tag doesn't match");
        return k.data;
      }, na: function(a, b, c, d, e, f) {
        var g = [], h = sjcl2.bitArray, k = h.i;
        d = [h.partial(8, (b.length ? 64 : 0) | d - 2 << 2 | f - 1)];
        d = h.concat(d, c);
        d[3] |= e;
        d = a.encrypt(d);
        if (b.length)
          for (c = h.bitLength(b) / 8, 65279 >= c ? g = [h.partial(16, c)] : 4294967295 >= c && (g = h.concat([h.partial(16, 65534)], [c])), g = h.concat(g, b), b = 0; b < g.length; b += 4)
            d = a.encrypt(k(d, g.slice(b, b + 4).concat([0, 0, 0])));
        return d;
      }, V: function(a, b, c, d, e, f) {
        var g = sjcl2.bitArray, h = g.i;
        e /= 8;
        if (e % 2 || 4 > e || 16 < e)
          throw new sjcl2.exception.invalid("ccm: invalid tag length");
        if (4294967295 < d.length || 4294967295 < b.length)
          throw new sjcl2.exception.bug("ccm: can't deal with 4GiB or more data");
        c = sjcl2.mode.ccm.na(a, d, c, e, g.bitLength(b) / 8, f);
        for (d = 0; d < b.length; d += 4)
          c = a.encrypt(h(c, b.slice(d, d + 4).concat([0, 0, 0])));
        return g.clamp(c, 8 * e);
      }, C: function(a, b, c, d, e, f) {
        var g, h = sjcl2.bitArray;
        g = h.i;
        var k = b.length, l = h.bitLength(b), n = k / 50, m = n;
        c = h.concat([h.partial(8, f - 1)], c).concat([0, 0, 0]).slice(0, 4);
        d = h.bitSlice(g(d, a.encrypt(c)), 0, e);
        if (!k)
          return { tag: d, data: [] };
        for (g = 0; g < k; g += 4)
          g > n && (sjcl2.mode.ccm.fa(g / k), n += m), c[3]++, e = a.encrypt(c), b[g] ^= e[0], b[g + 1] ^= e[1], b[g + 2] ^= e[2], b[g + 3] ^= e[3];
        return { tag: d, data: h.clamp(b, l) };
      } };
      sjcl2.mode.ocb2 = { name: "ocb2", encrypt: function(a, b, c, d, e, f) {
        if (128 !== sjcl2.bitArray.bitLength(c))
          throw new sjcl2.exception.invalid("ocb iv must be 128 bits");
        var g, h = sjcl2.mode.ocb2.S, k = sjcl2.bitArray, l = k.i, n = [0, 0, 0, 0];
        c = h(a.encrypt(c));
        var m, p = [];
        d = d || [];
        e = e || 64;
        for (g = 0; g + 4 < b.length; g += 4)
          m = b.slice(g, g + 4), n = l(n, m), p = p.concat(l(c, a.encrypt(l(c, m)))), c = h(c);
        m = b.slice(g);
        b = k.bitLength(m);
        g = a.encrypt(l(c, [0, 0, 0, b]));
        m = k.clamp(l(m.concat([0, 0, 0]), g), b);
        n = l(n, l(m.concat([0, 0, 0]), g));
        n = a.encrypt(l(n, l(c, h(c))));
        d.length && (n = l(n, f ? d : sjcl2.mode.ocb2.pmac(a, d)));
        return p.concat(k.concat(m, k.clamp(n, e)));
      }, decrypt: function(a, b, c, d, e, f) {
        if (128 !== sjcl2.bitArray.bitLength(c))
          throw new sjcl2.exception.invalid("ocb iv must be 128 bits");
        e = e || 64;
        var g = sjcl2.mode.ocb2.S, h = sjcl2.bitArray, k = h.i, l = [0, 0, 0, 0], n = g(a.encrypt(c)), m, p, r = sjcl2.bitArray.bitLength(b) - e, q = [];
        d = d || [];
        for (c = 0; c + 4 < r / 32; c += 4)
          m = k(n, a.decrypt(k(n, b.slice(c, c + 4)))), l = k(l, m), q = q.concat(m), n = g(n);
        p = r - 32 * c;
        m = a.encrypt(k(n, [0, 0, 0, p]));
        m = k(m, h.clamp(b.slice(c), p).concat([0, 0, 0]));
        l = k(l, m);
        l = a.encrypt(k(l, k(n, g(n))));
        d.length && (l = k(l, f ? d : sjcl2.mode.ocb2.pmac(a, d)));
        if (!h.equal(h.clamp(l, e), h.bitSlice(b, r)))
          throw new sjcl2.exception.corrupt("ocb: tag doesn't match");
        return q.concat(h.clamp(m, p));
      }, pmac: function(a, b) {
        var c, d = sjcl2.mode.ocb2.S, e = sjcl2.bitArray, f = e.i, g = [0, 0, 0, 0], h = a.encrypt([0, 0, 0, 0]), h = f(h, d(d(h)));
        for (c = 0; c + 4 < b.length; c += 4)
          h = d(h), g = f(g, a.encrypt(f(h, b.slice(c, c + 4))));
        c = b.slice(c);
        128 > e.bitLength(c) && (h = f(h, d(h)), c = e.concat(c, [-2147483648, 0, 0, 0]));
        g = f(g, c);
        return a.encrypt(f(d(f(h, d(h))), g));
      }, S: function(a) {
        return [a[0] << 1 ^ a[1] >>> 31, a[1] << 1 ^ a[2] >>> 31, a[2] << 1 ^ a[3] >>> 31, a[3] << 1 ^ 135 * (a[0] >>> 31)];
      } };
      sjcl2.mode.gcm = { name: "gcm", encrypt: function(a, b, c, d, e) {
        var f = b.slice(0);
        b = sjcl2.bitArray;
        d = d || [];
        a = sjcl2.mode.gcm.C(true, a, f, d, c, e || 128);
        return b.concat(a.data, a.tag);
      }, decrypt: function(a, b, c, d, e) {
        var f = b.slice(0), g = sjcl2.bitArray, h = g.bitLength(f);
        e = e || 128;
        d = d || [];
        e <= h ? (b = g.bitSlice(f, h - e), f = g.bitSlice(f, 0, h - e)) : (b = f, f = []);
        a = sjcl2.mode.gcm.C(false, a, f, d, c, e);
        if (!g.equal(a.tag, b))
          throw new sjcl2.exception.corrupt("gcm: tag doesn't match");
        return a.data;
      }, ka: function(a, b) {
        var c, d, e, f, g, h = sjcl2.bitArray.i;
        e = [0, 0, 0, 0];
        f = b.slice(0);
        for (c = 0; 128 > c; c++) {
          (d = 0 !== (a[Math.floor(c / 32)] & 1 << 31 - c % 32)) && (e = h(e, f));
          g = 0 !== (f[3] & 1);
          for (d = 3; 0 < d; d--)
            f[d] = f[d] >>> 1 | (f[d - 1] & 1) << 31;
          f[0] >>>= 1;
          g && (f[0] ^= -520093696);
        }
        return e;
      }, j: function(a, b, c) {
        var d, e = c.length;
        b = b.slice(0);
        for (d = 0; d < e; d += 4)
          b[0] ^= 4294967295 & c[d], b[1] ^= 4294967295 & c[d + 1], b[2] ^= 4294967295 & c[d + 2], b[3] ^= 4294967295 & c[d + 3], b = sjcl2.mode.gcm.ka(b, a);
        return b;
      }, C: function(a, b, c, d, e, f) {
        var g, h, k, l, n, m, p, r, q = sjcl2.bitArray;
        m = c.length;
        p = q.bitLength(c);
        r = q.bitLength(d);
        h = q.bitLength(e);
        g = b.encrypt([0, 0, 0, 0]);
        96 === h ? (e = e.slice(0), e = q.concat(e, [1])) : (e = sjcl2.mode.gcm.j(g, [0, 0, 0, 0], e), e = sjcl2.mode.gcm.j(g, e, [0, 0, Math.floor(h / 4294967296), h & 4294967295]));
        h = sjcl2.mode.gcm.j(g, [0, 0, 0, 0], d);
        n = e.slice(0);
        d = h.slice(0);
        a || (d = sjcl2.mode.gcm.j(g, h, c));
        for (l = 0; l < m; l += 4)
          n[3]++, k = b.encrypt(n), c[l] ^= k[0], c[l + 1] ^= k[1], c[l + 2] ^= k[2], c[l + 3] ^= k[3];
        c = q.clamp(c, p);
        a && (d = sjcl2.mode.gcm.j(g, h, c));
        a = [Math.floor(r / 4294967296), r & 4294967295, Math.floor(p / 4294967296), p & 4294967295];
        d = sjcl2.mode.gcm.j(g, d, a);
        k = b.encrypt(e);
        d[0] ^= k[0];
        d[1] ^= k[1];
        d[2] ^= k[2];
        d[3] ^= k[3];
        return { tag: q.bitSlice(d, 0, f), data: c };
      } };
      sjcl2.misc.hmac = function(a, b) {
        this.W = b = b || sjcl2.hash.sha256;
        var c = [[], []], d, e = b.prototype.blockSize / 32;
        this.w = [new b(), new b()];
        a.length > e && (a = b.hash(a));
        for (d = 0; d < e; d++)
          c[0][d] = a[d] ^ 909522486, c[1][d] = a[d] ^ 1549556828;
        this.w[0].update(c[0]);
        this.w[1].update(c[1]);
        this.R = new b(this.w[0]);
      };
      sjcl2.misc.hmac.prototype.encrypt = sjcl2.misc.hmac.prototype.mac = function(a) {
        if (this.aa)
          throw new sjcl2.exception.invalid("encrypt on already updated hmac called!");
        this.update(a);
        return this.digest(a);
      };
      sjcl2.misc.hmac.prototype.reset = function() {
        this.R = new this.W(this.w[0]);
        this.aa = false;
      };
      sjcl2.misc.hmac.prototype.update = function(a) {
        this.aa = true;
        this.R.update(a);
      };
      sjcl2.misc.hmac.prototype.digest = function() {
        var a = this.R.finalize(), a = new this.W(this.w[1]).update(a).finalize();
        this.reset();
        return a;
      };
      sjcl2.misc.pbkdf2 = function(a, b, c, d, e) {
        c = c || 1e4;
        if (0 > d || 0 > c)
          throw new sjcl2.exception.invalid("invalid params to pbkdf2");
        "string" === typeof a && (a = sjcl2.codec.utf8String.toBits(a));
        "string" === typeof b && (b = sjcl2.codec.utf8String.toBits(b));
        e = e || sjcl2.misc.hmac;
        a = new e(a);
        var f, g, h, k, l = [], n = sjcl2.bitArray;
        for (k = 1; 32 * l.length < (d || 1); k++) {
          e = f = a.encrypt(n.concat(b, [k]));
          for (g = 1; g < c; g++)
            for (f = a.encrypt(f), h = 0; h < f.length; h++)
              e[h] ^= f[h];
          l = l.concat(e);
        }
        d && (l = n.clamp(l, d));
        return l;
      };
      sjcl2.prng = function(a) {
        this.c = [new sjcl2.hash.sha256()];
        this.m = [0];
        this.P = 0;
        this.H = {};
        this.N = 0;
        this.U = {};
        this.Z = this.f = this.o = this.ha = 0;
        this.b = [0, 0, 0, 0, 0, 0, 0, 0];
        this.h = [0, 0, 0, 0];
        this.L = void 0;
        this.M = a;
        this.D = false;
        this.K = { progress: {}, seeded: {} };
        this.u = this.ga = 0;
        this.I = 1;
        this.J = 2;
        this.ca = 65536;
        this.T = [0, 48, 64, 96, 128, 192, 256, 384, 512, 768, 1024];
        this.da = 3e4;
        this.ba = 80;
      };
      sjcl2.prng.prototype = { randomWords: function(a, b) {
        var c = [], d;
        d = this.isReady(b);
        var e;
        if (d === this.u)
          throw new sjcl2.exception.notReady("generator isn't seeded");
        if (d & this.J) {
          d = !(d & this.I);
          e = [];
          var f = 0, g;
          this.Z = e[0] = new Date().valueOf() + this.da;
          for (g = 0; 16 > g; g++)
            e.push(4294967296 * Math.random() | 0);
          for (g = 0; g < this.c.length && (e = e.concat(this.c[g].finalize()), f += this.m[g], this.m[g] = 0, d || !(this.P & 1 << g)); g++)
            ;
          this.P >= 1 << this.c.length && (this.c.push(new sjcl2.hash.sha256()), this.m.push(0));
          this.f -= f;
          f > this.o && (this.o = f);
          this.P++;
          this.b = sjcl2.hash.sha256.hash(this.b.concat(e));
          this.L = new sjcl2.cipher.aes(this.b);
          for (d = 0; 4 > d && (this.h[d] = this.h[d] + 1 | 0, !this.h[d]); d++)
            ;
        }
        for (d = 0; d < a; d += 4)
          0 === (d + 1) % this.ca && y(this), e = z(this), c.push(e[0], e[1], e[2], e[3]);
        y(this);
        return c.slice(0, a);
      }, setDefaultParanoia: function(a, b) {
        if (0 === a && "Setting paranoia=0 will ruin your security; use it only for testing" !== b)
          throw new sjcl2.exception.invalid("Setting paranoia=0 will ruin your security; use it only for testing");
        this.M = a;
      }, addEntropy: function(a, b, c) {
        c = c || "user";
        var d, e, f = new Date().valueOf(), g = this.H[c], h = this.isReady(), k = 0;
        d = this.U[c];
        void 0 === d && (d = this.U[c] = this.ha++);
        void 0 === g && (g = this.H[c] = 0);
        this.H[c] = (this.H[c] + 1) % this.c.length;
        switch (typeof a) {
          case "number":
            void 0 === b && (b = 1);
            this.c[g].update([d, this.N++, 1, b, f, 1, a | 0]);
            break;
          case "object":
            c = Object.prototype.toString.call(a);
            if ("[object Uint32Array]" === c) {
              e = [];
              for (c = 0; c < a.length; c++)
                e.push(a[c]);
              a = e;
            } else
              for ("[object Array]" !== c && (k = 1), c = 0; c < a.length && !k; c++)
                "number" !== typeof a[c] && (k = 1);
            if (!k) {
              if (void 0 === b)
                for (c = b = 0; c < a.length; c++)
                  for (e = a[c]; 0 < e; )
                    b++, e = e >>> 1;
              this.c[g].update([d, this.N++, 2, b, f, a.length].concat(a));
            }
            break;
          case "string":
            void 0 === b && (b = a.length);
            this.c[g].update([d, this.N++, 3, b, f, a.length]);
            this.c[g].update(a);
            break;
          default:
            k = 1;
        }
        if (k)
          throw new sjcl2.exception.bug("random: addEntropy only supports number, array of numbers or string");
        this.m[g] += b;
        this.f += b;
        h === this.u && (this.isReady() !== this.u && A("seeded", Math.max(this.o, this.f)), A("progress", this.getProgress()));
      }, isReady: function(a) {
        a = this.T[void 0 !== a ? a : this.M];
        return this.o && this.o >= a ? this.m[0] > this.ba && new Date().valueOf() > this.Z ? this.J | this.I : this.I : this.f >= a ? this.J | this.u : this.u;
      }, getProgress: function(a) {
        a = this.T[a ? a : this.M];
        return this.o >= a ? 1 : this.f > a ? 1 : this.f / a;
      }, startCollectors: function() {
        if (!this.D) {
          this.a = { loadTimeCollector: B(this, this.ma), mouseCollector: B(this, this.oa), keyboardCollector: B(this, this.la), accelerometerCollector: B(this, this.ea), touchCollector: B(this, this.qa) };
          if (window.addEventListener)
            window.addEventListener("load", this.a.loadTimeCollector, false), window.addEventListener("mousemove", this.a.mouseCollector, false), window.addEventListener("keypress", this.a.keyboardCollector, false), window.addEventListener("devicemotion", this.a.accelerometerCollector, false), window.addEventListener("touchmove", this.a.touchCollector, false);
          else if (document.attachEvent)
            document.attachEvent("onload", this.a.loadTimeCollector), document.attachEvent("onmousemove", this.a.mouseCollector), document.attachEvent("keypress", this.a.keyboardCollector);
          else
            throw new sjcl2.exception.bug("can't attach event");
          this.D = true;
        }
      }, stopCollectors: function() {
        this.D && (window.removeEventListener ? (window.removeEventListener("load", this.a.loadTimeCollector, false), window.removeEventListener("mousemove", this.a.mouseCollector, false), window.removeEventListener("keypress", this.a.keyboardCollector, false), window.removeEventListener("devicemotion", this.a.accelerometerCollector, false), window.removeEventListener("touchmove", this.a.touchCollector, false)) : document.detachEvent && (document.detachEvent("onload", this.a.loadTimeCollector), document.detachEvent("onmousemove", this.a.mouseCollector), document.detachEvent("keypress", this.a.keyboardCollector)), this.D = false);
      }, addEventListener: function(a, b) {
        this.K[a][this.ga++] = b;
      }, removeEventListener: function(a, b) {
        var c, d, e = this.K[a], f = [];
        for (d in e)
          e.hasOwnProperty(d) && e[d] === b && f.push(d);
        for (c = 0; c < f.length; c++)
          d = f[c], delete e[d];
      }, la: function() {
        C(this, 1);
      }, oa: function(a) {
        var b, c;
        try {
          b = a.x || a.clientX || a.offsetX || 0, c = a.y || a.clientY || a.offsetY || 0;
        } catch (d) {
          c = b = 0;
        }
        0 != b && 0 != c && this.addEntropy([b, c], 2, "mouse");
        C(this, 0);
      }, qa: function(a) {
        a = a.touches[0] || a.changedTouches[0];
        this.addEntropy([a.pageX || a.clientX, a.pageY || a.clientY], 1, "touch");
        C(this, 0);
      }, ma: function() {
        C(this, 2);
      }, ea: function(a) {
        a = a.accelerationIncludingGravity.x || a.accelerationIncludingGravity.y || a.accelerationIncludingGravity.z;
        if (window.orientation) {
          var b = window.orientation;
          "number" === typeof b && this.addEntropy(b, 1, "accelerometer");
        }
        a && this.addEntropy(a, 2, "accelerometer");
        C(this, 0);
      } };
      function A(a, b) {
        var c, d = sjcl2.random.K[a], e = [];
        for (c in d)
          d.hasOwnProperty(c) && e.push(d[c]);
        for (c = 0; c < e.length; c++)
          e[c](b);
      }
      function C(a, b) {
        "undefined" !== typeof window && window.performance && "function" === typeof window.performance.now ? a.addEntropy(window.performance.now(), b, "loadtime") : a.addEntropy(new Date().valueOf(), b, "loadtime");
      }
      function y(a) {
        a.b = z(a).concat(z(a));
        a.L = new sjcl2.cipher.aes(a.b);
      }
      function z(a) {
        for (var b = 0; 4 > b && (a.h[b] = a.h[b] + 1 | 0, !a.h[b]); b++)
          ;
        return a.L.encrypt(a.h);
      }
      function B(a, b) {
        return function() {
          b.apply(a, arguments);
        };
      }
      sjcl2.random = new sjcl2.prng(6);
      a:
        try {
          if (G = "undefined" !== typeof module22 && module22.exports) {
            try {
              H = require("crypto");
            } catch (a) {
              H = null;
            }
            G = E = H;
          }
          if (G && E.randomBytes)
            D = E.randomBytes(128), D = new Uint32Array(new Uint8Array(D).buffer), sjcl2.random.addEntropy(D, 1024, "crypto['randomBytes']");
          else if ("undefined" !== typeof window && "undefined" !== typeof Uint32Array) {
            F = new Uint32Array(32);
            if (window.crypto && window.crypto.getRandomValues)
              window.crypto.getRandomValues(F);
            else if (window.msCrypto && window.msCrypto.getRandomValues)
              window.msCrypto.getRandomValues(F);
            else
              break a;
            sjcl2.random.addEntropy(F, 1024, "crypto['getRandomValues']");
          }
        } catch (a) {
          "undefined" !== typeof window && window.console && (console.log("There was an error collecting entropy from the browser:"), console.log(a));
        }
      var D;
      var E;
      var F;
      var G;
      var H;
      sjcl2.json = { defaults: { v: 1, iter: 1e4, ks: 128, ts: 64, mode: "ccm", adata: "", cipher: "aes" }, ja: function(a, b, c, d) {
        c = c || {};
        d = d || {};
        var e = sjcl2.json, f = e.g({ iv: sjcl2.random.randomWords(4, 0) }, e.defaults), g;
        e.g(f, c);
        c = f.adata;
        "string" === typeof f.salt && (f.salt = sjcl2.codec.base64.toBits(f.salt));
        "string" === typeof f.iv && (f.iv = sjcl2.codec.base64.toBits(f.iv));
        if (!sjcl2.mode[f.mode] || !sjcl2.cipher[f.cipher] || "string" === typeof a && 100 >= f.iter || 64 !== f.ts && 96 !== f.ts && 128 !== f.ts || 128 !== f.ks && 192 !== f.ks && 256 !== f.ks || 2 > f.iv.length || 4 < f.iv.length)
          throw new sjcl2.exception.invalid("json encrypt: invalid parameters");
        "string" === typeof a ? (g = sjcl2.misc.cachedPbkdf2(a, f), a = g.key.slice(0, f.ks / 32), f.salt = g.salt) : sjcl2.ecc && a instanceof sjcl2.ecc.elGamal.publicKey && (g = a.kem(), f.kemtag = g.tag, a = g.key.slice(0, f.ks / 32));
        "string" === typeof b && (b = sjcl2.codec.utf8String.toBits(b));
        "string" === typeof c && (f.adata = c = sjcl2.codec.utf8String.toBits(c));
        g = new sjcl2.cipher[f.cipher](a);
        e.g(d, f);
        d.key = a;
        f.ct = "ccm" === f.mode && sjcl2.arrayBuffer && sjcl2.arrayBuffer.ccm && b instanceof ArrayBuffer ? sjcl2.arrayBuffer.ccm.encrypt(g, b, f.iv, c, f.ts) : sjcl2.mode[f.mode].encrypt(g, b, f.iv, c, f.ts);
        return f;
      }, encrypt: function(a, b, c, d) {
        var e = sjcl2.json, f = e.ja.apply(e, arguments);
        return e.encode(f);
      }, ia: function(a, b, c, d) {
        c = c || {};
        d = d || {};
        var e = sjcl2.json;
        b = e.g(e.g(e.g({}, e.defaults), b), c, true);
        var f, g;
        f = b.adata;
        "string" === typeof b.salt && (b.salt = sjcl2.codec.base64.toBits(b.salt));
        "string" === typeof b.iv && (b.iv = sjcl2.codec.base64.toBits(b.iv));
        if (!sjcl2.mode[b.mode] || !sjcl2.cipher[b.cipher] || "string" === typeof a && 100 >= b.iter || 64 !== b.ts && 96 !== b.ts && 128 !== b.ts || 128 !== b.ks && 192 !== b.ks && 256 !== b.ks || !b.iv || 2 > b.iv.length || 4 < b.iv.length)
          throw new sjcl2.exception.invalid("json decrypt: invalid parameters");
        "string" === typeof a ? (g = sjcl2.misc.cachedPbkdf2(a, b), a = g.key.slice(0, b.ks / 32), b.salt = g.salt) : sjcl2.ecc && a instanceof sjcl2.ecc.elGamal.secretKey && (a = a.unkem(sjcl2.codec.base64.toBits(b.kemtag)).slice(0, b.ks / 32));
        "string" === typeof f && (f = sjcl2.codec.utf8String.toBits(f));
        g = new sjcl2.cipher[b.cipher](a);
        f = "ccm" === b.mode && sjcl2.arrayBuffer && sjcl2.arrayBuffer.ccm && b.ct instanceof ArrayBuffer ? sjcl2.arrayBuffer.ccm.decrypt(g, b.ct, b.iv, b.tag, f, b.ts) : sjcl2.mode[b.mode].decrypt(g, b.ct, b.iv, f, b.ts);
        e.g(d, b);
        d.key = a;
        return 1 === c.raw ? f : sjcl2.codec.utf8String.fromBits(f);
      }, decrypt: function(a, b, c, d) {
        var e = sjcl2.json;
        return e.ia(a, e.decode(b), c, d);
      }, encode: function(a) {
        var b, c = "{", d = "";
        for (b in a)
          if (a.hasOwnProperty(b)) {
            if (!b.match(/^[a-z0-9]+$/i))
              throw new sjcl2.exception.invalid("json encode: invalid property name");
            c += d + '"' + b + '":';
            d = ",";
            switch (typeof a[b]) {
              case "number":
              case "boolean":
                c += a[b];
                break;
              case "string":
                c += '"' + escape(a[b]) + '"';
                break;
              case "object":
                c += '"' + sjcl2.codec.base64.fromBits(a[b], 0) + '"';
                break;
              default:
                throw new sjcl2.exception.bug("json encode: unsupported type");
            }
          }
        return c + "}";
      }, decode: function(a) {
        a = a.replace(/\s/g, "");
        if (!a.match(/^\{.*\}$/))
          throw new sjcl2.exception.invalid("json decode: this isn't json!");
        a = a.replace(/^\{|\}$/g, "").split(/,/);
        var b = {}, c, d;
        for (c = 0; c < a.length; c++) {
          if (!(d = a[c].match(/^\s*(?:(["']?)([a-z][a-z0-9]*)\1)\s*:\s*(?:(-?\d+)|"([a-z0-9+\/%*_.@=\-]*)"|(true|false))$/i)))
            throw new sjcl2.exception.invalid("json decode: this isn't json!");
          null != d[3] ? b[d[2]] = parseInt(d[3], 10) : null != d[4] ? b[d[2]] = d[2].match(/^(ct|adata|salt|iv)$/) ? sjcl2.codec.base64.toBits(d[4]) : unescape(d[4]) : null != d[5] && (b[d[2]] = "true" === d[5]);
        }
        return b;
      }, g: function(a, b, c) {
        void 0 === a && (a = {});
        if (void 0 === b)
          return a;
        for (var d in b)
          if (b.hasOwnProperty(d)) {
            if (c && void 0 !== a[d] && a[d] !== b[d])
              throw new sjcl2.exception.invalid("required parameter overridden");
            a[d] = b[d];
          }
        return a;
      }, sa: function(a, b) {
        var c = {}, d;
        for (d in a)
          a.hasOwnProperty(d) && a[d] !== b[d] && (c[d] = a[d]);
        return c;
      }, ra: function(a, b) {
        var c = {}, d;
        for (d = 0; d < b.length; d++)
          void 0 !== a[b[d]] && (c[b[d]] = a[b[d]]);
        return c;
      } };
      sjcl2.encrypt = sjcl2.json.encrypt;
      sjcl2.decrypt = sjcl2.json.decrypt;
      sjcl2.misc.pa = {};
      sjcl2.misc.cachedPbkdf2 = function(a, b) {
        var c = sjcl2.misc.pa, d;
        b = b || {};
        d = b.iter || 1e3;
        c = c[a] = c[a] || {};
        d = c[d] = c[d] || { firstSalt: b.salt && b.salt.length ? b.salt.slice(0) : sjcl2.random.randomWords(2, 0) };
        c = void 0 === b.salt ? d.firstSalt : b.salt;
        d[c] = d[c] || sjcl2.misc.pbkdf2(a, c, b.iter);
        return { key: d[c].slice(0), salt: c.slice(0) };
      };
      "undefined" !== typeof module22 && module22.exports && (module22.exports = sjcl2);
      "function" === typeof define && define([], function() {
        return sjcl2;
      });
    } });
    var require_build = __commonJS2({ "node_modules/better-sse/build/index.js"(exports2, module22) {
      !function(e, t) {
        if ("object" == typeof exports2 && "object" == typeof module22)
          module22.exports = t();
        else if ("function" == typeof define && define.amd)
          define([], t);
        else {
          var s = t();
          for (var i in s)
            ("object" == typeof exports2 ? exports2 : e)[i] = s[i];
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
    } });
    var require_stream = __commonJS2({ "node_modules/ws/lib/stream.js"(exports2, module22) {
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
        const duplex = new Duplex({ ...options, autoDestroy: false, emitClose: false, objectMode: false, writableObjectMode: false });
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
      module22.exports = createWebSocketStream2;
    } });
    var require_constants = __commonJS2({ "node_modules/ws/lib/constants.js"(exports2, module22) {
      "use strict";
      module22.exports = { BINARY_TYPES: ["nodebuffer", "arraybuffer", "fragments"], EMPTY_BUFFER: Buffer.alloc(0), GUID: "258EAFA5-E914-47DA-95CA-C5AB0DC85B11", kForOnEventAttribute: Symbol("kIsForOnEventAttribute"), kListener: Symbol("kListener"), kStatusCode: Symbol("status-code"), kWebSocket: Symbol("websocket"), NOOP: () => {
      } };
    } });
    var require_buffer_util = __commonJS2({ "node_modules/ws/lib/buffer-util.js"(exports2, module22) {
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
        const bufferUtil = require_bufferutil();
        module22.exports = { concat, mask(source, mask, output, offset, length) {
          if (length < 48)
            _mask(source, mask, output, offset, length);
          else
            bufferUtil.mask(source, mask, output, offset, length);
        }, toArrayBuffer, toBuffer, unmask(buffer, mask) {
          if (buffer.length < 32)
            _unmask(buffer, mask);
          else
            bufferUtil.unmask(buffer, mask);
        } };
      } catch (e) {
        module22.exports = { concat, mask: _mask, toArrayBuffer, toBuffer, unmask: _unmask };
      }
    } });
    var require_limiter = __commonJS2({ "node_modules/ws/lib/limiter.js"(exports2, module22) {
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
      module22.exports = Limiter;
    } });
    var require_permessage_deflate = __commonJS2({ "node_modules/ws/lib/permessage-deflate.js"(exports2, module22) {
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
              callback(new Error("The deflate stream was closed while data was being processed"));
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
            throw new Error('Unexpected or invalid parameter "client_max_window_bits"');
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
                    throw new TypeError(`Invalid value for parameter "${key}": ${value}`);
                  }
                  value = num;
                } else if (!this._isServer) {
                  throw new TypeError(`Invalid value for parameter "${key}": ${value}`);
                }
              } else if (key === "server_max_window_bits") {
                const num = +value;
                if (!Number.isInteger(num) || num < 8 || num > 15) {
                  throw new TypeError(`Invalid value for parameter "${key}": ${value}`);
                }
                value = num;
              } else if (key === "client_no_context_takeover" || key === "server_no_context_takeover") {
                if (value !== true) {
                  throw new TypeError(`Invalid value for parameter "${key}": ${value}`);
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
            this._inflate = zlib.createInflateRaw({ ...this._options.zlibInflateOptions, windowBits });
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
            const data2 = bufferUtil.concat(this._inflate[kBuffers], this._inflate[kTotalLength]);
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
            this._deflate = zlib.createDeflateRaw({ ...this._options.zlibDeflateOptions, windowBits });
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
            let data2 = bufferUtil.concat(this._deflate[kBuffers], this._deflate[kTotalLength]);
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
      module22.exports = PerMessageDeflate;
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
    } });
    var require_validation = __commonJS2({ "node_modules/ws/lib/validation.js"(exports2, module22) {
      "use strict";
      var tokenChars = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0];
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
        const isValidUTF8 = require_utf_8_validate();
        module22.exports = { isValidStatusCode, isValidUTF8(buf) {
          return buf.length < 150 ? _isValidUTF8(buf) : isValidUTF8(buf);
        }, tokenChars };
      } catch (e) {
        module22.exports = { isValidStatusCode, isValidUTF8: _isValidUTF8, tokenChars };
      }
    } });
    var require_receiver = __commonJS2({ "node_modules/ws/lib/receiver.js"(exports2, module22) {
      "use strict";
      var { Writable } = require("stream");
      var PerMessageDeflate = require_permessage_deflate();
      var { BINARY_TYPES, EMPTY_BUFFER, kStatusCode, kWebSocket } = require_constants();
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
            return error(RangeError, "RSV2 and RSV3 must be clear", true, 1002, "WS_ERR_UNEXPECTED_RSV_2_3");
          }
          const compressed = (buf[0] & 64) === 64;
          if (compressed && !this._extensions[PerMessageDeflate.extensionName]) {
            this._loop = false;
            return error(RangeError, "RSV1 must be clear", true, 1002, "WS_ERR_UNEXPECTED_RSV_1");
          }
          this._fin = (buf[0] & 128) === 128;
          this._opcode = buf[0] & 15;
          this._payloadLength = buf[1] & 127;
          if (this._opcode === 0) {
            if (compressed) {
              this._loop = false;
              return error(RangeError, "RSV1 must be clear", true, 1002, "WS_ERR_UNEXPECTED_RSV_1");
            }
            if (!this._fragmented) {
              this._loop = false;
              return error(RangeError, "invalid opcode 0", true, 1002, "WS_ERR_INVALID_OPCODE");
            }
            this._opcode = this._fragmented;
          } else if (this._opcode === 1 || this._opcode === 2) {
            if (this._fragmented) {
              this._loop = false;
              return error(RangeError, `invalid opcode ${this._opcode}`, true, 1002, "WS_ERR_INVALID_OPCODE");
            }
            this._compressed = compressed;
          } else if (this._opcode > 7 && this._opcode < 11) {
            if (!this._fin) {
              this._loop = false;
              return error(RangeError, "FIN must be set", true, 1002, "WS_ERR_EXPECTED_FIN");
            }
            if (compressed) {
              this._loop = false;
              return error(RangeError, "RSV1 must be clear", true, 1002, "WS_ERR_UNEXPECTED_RSV_1");
            }
            if (this._payloadLength > 125) {
              this._loop = false;
              return error(RangeError, `invalid payload length ${this._payloadLength}`, true, 1002, "WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH");
            }
          } else {
            this._loop = false;
            return error(RangeError, `invalid opcode ${this._opcode}`, true, 1002, "WS_ERR_INVALID_OPCODE");
          }
          if (!this._fin && !this._fragmented)
            this._fragmented = this._opcode;
          this._masked = (buf[1] & 128) === 128;
          if (this._isServer) {
            if (!this._masked) {
              this._loop = false;
              return error(RangeError, "MASK must be set", true, 1002, "WS_ERR_EXPECTED_MASK");
            }
          } else if (this._masked) {
            this._loop = false;
            return error(RangeError, "MASK must be clear", true, 1002, "WS_ERR_UNEXPECTED_MASK");
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
            return error(RangeError, "Unsupported WebSocket frame: payload length > 2^53 - 1", false, 1009, "WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH");
          }
          this._payloadLength = num * Math.pow(2, 32) + buf.readUInt32BE(4);
          return this.haveLength();
        }
        haveLength() {
          if (this._payloadLength && this._opcode < 8) {
            this._totalPayloadLength += this._payloadLength;
            if (this._totalPayloadLength > this._maxPayload && this._maxPayload > 0) {
              this._loop = false;
              return error(RangeError, "Max payload size exceeded", false, 1009, "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH");
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
                return cb(error(RangeError, "Max payload size exceeded", false, 1009, "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"));
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
                return error(Error, "invalid UTF-8 sequence", true, 1007, "WS_ERR_INVALID_UTF8");
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
              return error(RangeError, "invalid payload length 1", true, 1002, "WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH");
            } else {
              const code = data.readUInt16BE(0);
              if (!isValidStatusCode(code)) {
                return error(RangeError, `invalid status code ${code}`, true, 1002, "WS_ERR_INVALID_CLOSE_CODE");
              }
              const buf = data.slice(2);
              if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
                return error(Error, "invalid UTF-8 sequence", true, 1007, "WS_ERR_INVALID_UTF8");
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
      module22.exports = Receiver2;
      function error(ErrorCtor, message, prefix, statusCode, errorCode) {
        const err = new ErrorCtor(prefix ? `Invalid WebSocket frame: ${message}` : message);
        Error.captureStackTrace(err, error);
        err.code = errorCode;
        err[kStatusCode] = statusCode;
        return err;
      }
    } });
    var require_sender = __commonJS2({ "node_modules/ws/lib/sender.js"(exports2, module22) {
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
          const options = { [kByteLength]: buf.length, fin: true, generateMask: this._generateMask, mask, maskBuffer: this._maskBuffer, opcode: 8, readOnly: false, rsv1: false };
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
          const options = { [kByteLength]: byteLength, fin: true, generateMask: this._generateMask, mask, maskBuffer: this._maskBuffer, opcode: 9, readOnly, rsv1: false };
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
          const options = { [kByteLength]: byteLength, fin: true, generateMask: this._generateMask, mask, maskBuffer: this._maskBuffer, opcode: 10, readOnly, rsv1: false };
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
            const opts = { [kByteLength]: byteLength, fin: options.fin, generateMask: this._generateMask, mask: options.mask, maskBuffer: this._maskBuffer, opcode, readOnly, rsv1 };
            if (this._deflating) {
              this.enqueue([this.dispatch, data, this._compress, opts, cb]);
            } else {
              this.dispatch(data, this._compress, opts, cb);
            }
          } else {
            this.sendFrame(Sender2.frame(data, { [kByteLength]: byteLength, fin: options.fin, generateMask: this._generateMask, mask: options.mask, maskBuffer: this._maskBuffer, opcode, readOnly, rsv1: false }), cb);
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
              const err = new Error("The socket was closed while data was being compressed");
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
      module22.exports = Sender2;
    } });
    var require_event_target = __commonJS2({ "node_modules/ws/lib/event-target.js"(exports2, module22) {
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
      var EventTarget = { addEventListener(type, listener, options = {}) {
        let wrapper;
        if (type === "message") {
          wrapper = function onMessage(data, isBinary) {
            const event = new MessageEvent("message", { data: isBinary ? data : data.toString() });
            event[kTarget] = this;
            listener.call(this, event);
          };
        } else if (type === "close") {
          wrapper = function onClose(code, message) {
            const event = new CloseEvent("close", { code, reason: message.toString(), wasClean: this._closeFrameReceived && this._closeFrameSent });
            event[kTarget] = this;
            listener.call(this, event);
          };
        } else if (type === "error") {
          wrapper = function onError(error) {
            const event = new ErrorEvent("error", { error, message: error.message });
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
      }, removeEventListener(type, handler) {
        for (const listener of this.listeners(type)) {
          if (listener[kListener] === handler && !listener[kForOnEventAttribute]) {
            this.removeListener(type, listener);
            break;
          }
        }
      } };
      module22.exports = { CloseEvent, ErrorEvent, Event, EventTarget, MessageEvent };
    } });
    var require_extension = __commonJS2({ "node_modules/ws/lib/extension.js"(exports2, module22) {
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
            return [extension].concat(Object.keys(params).map((k) => {
              let values = params[k];
              if (!Array.isArray(values))
                values = [values];
              return values.map((v) => v === true ? k : `${k}=${v}`).join("; ");
            })).join("; ");
          }).join(", ");
        }).join(", ");
      }
      module22.exports = { format, parse };
    } });
    var require_websocket = __commonJS2({ "node_modules/ws/lib/websocket.js"(exports2, module22) {
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
      var { BINARY_TYPES, EMPTY_BUFFER, GUID, kForOnEventAttribute, kListener, kStatusCode, kWebSocket, NOOP } = require_constants();
      var { EventTarget: { addEventListener, removeEventListener } } = require_event_target();
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
          const receiver = new Receiver2({ binaryType: this.binaryType, extensions: this._extensions, isServer: this._isServer, maxPayload: options.maxPayload, skipUTF8Validation: options.skipUTF8Validation });
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
          this._closeTimer = setTimeout(this._socket.destroy.bind(this._socket), closeTimeout);
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
          const opts = { binary: typeof data !== "string", mask: !this._isServer, compress: true, fin: true, ...options };
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
      Object.defineProperty(WebSocket3, "CONNECTING", { enumerable: true, value: readyStates.indexOf("CONNECTING") });
      Object.defineProperty(WebSocket3.prototype, "CONNECTING", { enumerable: true, value: readyStates.indexOf("CONNECTING") });
      Object.defineProperty(WebSocket3, "OPEN", { enumerable: true, value: readyStates.indexOf("OPEN") });
      Object.defineProperty(WebSocket3.prototype, "OPEN", { enumerable: true, value: readyStates.indexOf("OPEN") });
      Object.defineProperty(WebSocket3, "CLOSING", { enumerable: true, value: readyStates.indexOf("CLOSING") });
      Object.defineProperty(WebSocket3.prototype, "CLOSING", { enumerable: true, value: readyStates.indexOf("CLOSING") });
      Object.defineProperty(WebSocket3, "CLOSED", { enumerable: true, value: readyStates.indexOf("CLOSED") });
      Object.defineProperty(WebSocket3.prototype, "CLOSED", { enumerable: true, value: readyStates.indexOf("CLOSED") });
      ["binaryType", "bufferedAmount", "extensions", "isPaused", "protocol", "readyState", "url"].forEach((property) => {
        Object.defineProperty(WebSocket3.prototype, property, { enumerable: true });
      });
      ["open", "error", "close", "message"].forEach((method) => {
        Object.defineProperty(WebSocket3.prototype, `on${method}`, { enumerable: true, get() {
          for (const listener of this.listeners(method)) {
            if (listener[kForOnEventAttribute])
              return listener[kListener];
          }
          return null;
        }, set(handler) {
          for (const listener of this.listeners(method)) {
            if (listener[kForOnEventAttribute]) {
              this.removeListener(method, listener);
              break;
            }
          }
          if (typeof handler !== "function")
            return;
          this.addEventListener(method, handler, { [kForOnEventAttribute]: true });
        } });
      });
      WebSocket3.prototype.addEventListener = addEventListener;
      WebSocket3.prototype.removeEventListener = removeEventListener;
      module22.exports = WebSocket3;
      function initAsClient(websocket, address, protocols, options) {
        const opts = { protocolVersion: protocolVersions[1], maxPayload: 100 * 1024 * 1024, skipUTF8Validation: false, perMessageDeflate: true, followRedirects: false, maxRedirects: 10, ...options, createConnection: void 0, socketPath: void 0, hostname: void 0, protocol: void 0, timeout: void 0, method: "GET", host: void 0, path: void 0, port: void 0 };
        if (!protocolVersions.includes(opts.protocolVersion)) {
          throw new RangeError(`Unsupported protocol version: ${opts.protocolVersion} (supported versions: ${protocolVersions.join(", ")})`);
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
        opts.headers = { "Sec-WebSocket-Version": opts.protocolVersion, "Sec-WebSocket-Key": key, Connection: "Upgrade", Upgrade: "websocket", ...opts.headers };
        opts.path = parsedUrl.pathname + parsedUrl.search;
        opts.timeout = opts.handshakeTimeout;
        if (opts.perMessageDeflate) {
          perMessageDeflate = new PerMessageDeflate(opts.perMessageDeflate !== true ? opts.perMessageDeflate : {}, false, opts.maxPayload);
          opts.headers["Sec-WebSocket-Extensions"] = format({ [PerMessageDeflate.extensionName]: perMessageDeflate.offer() });
        }
        if (protocols.length) {
          for (const protocol of protocols) {
            if (typeof protocol !== "string" || !subprotocolRegex.test(protocol) || protocolSet.has(protocol)) {
              throw new SyntaxError("An invalid or duplicated subprotocol was specified");
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
            abortHandshake(websocket, req, `Unexpected server response: ${res.statusCode}`);
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
          websocket.setSocket(socket, head, { generateMask: opts.generateMask, maxPayload: opts.maxPayload, skipUTF8Validation: opts.skipUTF8Validation });
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
          const err = new Error(`WebSocket is not open: readyState ${websocket.readyState} (${readyStates[websocket.readyState]})`);
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
    } });
    var require_subprotocol = __commonJS2({ "node_modules/ws/lib/subprotocol.js"(exports2, module22) {
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
      module22.exports = { parse };
    } });
    var require_websocket_server = __commonJS2({ "node_modules/ws/lib/websocket-server.js"(exports2, module22) {
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
          options = { maxPayload: 100 * 1024 * 1024, skipUTF8Validation: false, perMessageDeflate: false, handleProtocols: null, clientTracking: true, verifyClient: null, noServer: false, backlog: null, server: null, host: null, path: null, port: null, WebSocket: WebSocket3, ...options };
          if (options.port == null && !options.server && !options.noServer || options.port != null && (options.server || options.noServer) || options.server && options.noServer) {
            throw new TypeError('One and only one of the "port", "server", or "noServer" options must be specified');
          }
          if (options.port != null) {
            this._server = http2.createServer((req, res) => {
              const body = http2.STATUS_CODES[426];
              res.writeHead(426, { "Content-Length": body.length, "Content-Type": "text/plain" });
              res.end(body);
            });
            this._server.listen(options.port, options.host, options.backlog, callback);
          } else if (options.server) {
            this._server = options.server;
          }
          if (this._server) {
            const emitConnection = this.emit.bind(this, "connection");
            this._removeListeners = addListeners(this._server, { listening: this.emit.bind(this, "listening"), error: this.emit.bind(this, "error"), upgrade: (req, socket, head) => {
              this.handleUpgrade(req, socket, head, emitConnection);
            } });
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
            const perMessageDeflate = new PerMessageDeflate(this.options.perMessageDeflate, true, this.options.maxPayload);
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
            const info = { origin: req.headers[`${version === 8 ? "sec-websocket-origin" : "origin"}`], secure: !!(req.socket.authorized || req.socket.encrypted), req };
            if (this.options.verifyClient.length === 2) {
              this.options.verifyClient(info, (verified, code, message, headers) => {
                if (!verified) {
                  return abortHandshake(socket, code || 401, message, headers);
                }
                this.completeUpgrade(extensions, key, protocols, req, socket, head, cb);
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
            throw new Error("server.handleUpgrade() was called more than once with the same socket, possibly due to a misconfiguration");
          }
          if (this._state > RUNNING)
            return abortHandshake(socket, 503);
          const digest = createHash("sha1").update(key + GUID).digest("base64");
          const headers = ["HTTP/1.1 101 Switching Protocols", "Upgrade: websocket", "Connection: Upgrade", `Sec-WebSocket-Accept: ${digest}`];
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
            const value = extension.format({ [PerMessageDeflate.extensionName]: [params] });
            headers.push(`Sec-WebSocket-Extensions: ${value}`);
            ws._extensions = extensions;
          }
          this.emit("headers", headers, req);
          socket.write(headers.concat("\r\n").join("\r\n"));
          socket.removeListener("error", socketOnError);
          ws.setSocket(socket, head, { maxPayload: this.options.maxPayload, skipUTF8Validation: this.options.skipUTF8Validation });
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
      module22.exports = WebSocketServer2;
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
        headers = { Connection: "close", "Content-Type": "text/html", "Content-Length": Buffer.byteLength(message), ...headers };
        socket.once("finish", socket.destroy);
        socket.end(`HTTP/1.1 ${code} ${http2.STATUS_CODES[code]}\r
` + Object.keys(headers).map((h) => `${h}: ${headers[h]}`).join("\r\n") + "\r\n\r\n" + message);
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
    } });
    var require_node = __commonJS2({ "node_modules/web-worker/cjs/node.js"(exports2, module22) {
      var URL2 = require("url");
      var VM = require("vm");
      var threads = require("worker_threads");
      var WORKER = Symbol.for("worker");
      var EVENTS = Symbol.for("events");
      var EventTarget = class {
        constructor() {
          Object.defineProperty(this, EVENTS, { value: /* @__PURE__ */ new Map() });
        }
        dispatchEvent(event) {
          event.target = event.currentTarget = this;
          if (this["on" + event.type]) {
            try {
              this["on" + event.type](event);
            } catch (err) {
              console.error(err);
            }
          }
          const list = this[EVENTS].get(event.type);
          if (list == null)
            return;
          list.forEach((handler) => {
            try {
              handler.call(this, event);
            } catch (err) {
              console.error(err);
            }
          });
        }
        addEventListener(type, fn) {
          let events = this[EVENTS].get(type);
          if (!events)
            this[EVENTS].set(type, events = []);
          events.push(fn);
        }
        removeEventListener(type, fn) {
          let events = this[EVENTS].get(type);
          if (events) {
            const index = events.indexOf(fn);
            if (index !== -1)
              events.splice(index, 1);
          }
        }
      };
      function Event(type, target) {
        this.type = type;
        this.timeStamp = Date.now();
        this.target = this.currentTarget = this.data = null;
      }
      module22.exports = threads.isMainThread ? mainThread() : workerThread();
      var baseUrl = URL2.pathToFileURL(process.cwd() + "/");
      function mainThread() {
        class Worker2 extends EventTarget {
          constructor(url, options) {
            super();
            const { name, type } = options || {};
            url += "";
            let mod;
            if (/^data:/.test(url)) {
              mod = url;
            } else {
              mod = URL2.fileURLToPath(new URL2.URL(url, baseUrl));
            }
            const worker = new threads.Worker(__filename, { workerData: { mod, name, type } });
            Object.defineProperty(this, WORKER, { value: worker });
            worker.on("message", (data) => {
              const event = new Event("message");
              event.data = data;
              this.dispatchEvent(event);
            });
            worker.on("error", (error) => {
              error.type = "error";
              this.dispatchEvent(error);
            });
            worker.on("exit", () => {
              this.dispatchEvent(new Event("close"));
            });
          }
          postMessage(data, transferList) {
            this[WORKER].postMessage(data, transferList);
          }
          terminate() {
            this[WORKER].terminate();
          }
        }
        Worker2.prototype.onmessage = Worker2.prototype.onerror = Worker2.prototype.onclose = null;
        return Worker2;
      }
      function workerThread() {
        let { mod, name, type } = threads.workerData;
        const self2 = global.self = global;
        let q = [];
        function flush() {
          const buffered = q;
          q = null;
          buffered.forEach((event) => {
            self2.dispatchEvent(event);
          });
        }
        threads.parentPort.on("message", (data) => {
          const event = new Event("message");
          event.data = data;
          if (q == null)
            self2.dispatchEvent(event);
          else
            q.push(event);
        });
        threads.parentPort.on("error", (err) => {
          err.type = "Error";
          self2.dispatchEvent(err);
        });
        class WorkerGlobalScope2 extends EventTarget {
          postMessage(data, transferList) {
            threads.parentPort.postMessage(data, transferList);
          }
          close() {
            process.exit();
          }
        }
        let proto = Object.getPrototypeOf(global);
        delete proto.constructor;
        Object.defineProperties(WorkerGlobalScope2.prototype, proto);
        proto = Object.setPrototypeOf(global, new WorkerGlobalScope2());
        ["postMessage", "addEventListener", "removeEventListener", "dispatchEvent"].forEach((fn) => {
          proto[fn] = proto[fn].bind(global);
        });
        global.name = name;
        const isDataUrl = /^data:/.test(mod);
        if (type === "module") {
          import(mod).catch((err) => {
            if (isDataUrl && err.message === "Not supported") {
              console.warn("Worker(): Importing data: URLs requires Node 12.10+. Falling back to classic worker.");
              return evaluateDataUrl(mod, name);
            }
            console.error(err);
          }).then(flush);
        } else {
          try {
            if (/^data:/.test(mod)) {
              evaluateDataUrl(mod, name);
            } else {
              require(mod);
            }
          } catch (err) {
            console.error(err);
          }
          Promise.resolve().then(flush);
        }
      }
      function evaluateDataUrl(url, name) {
        const { data } = parseDataUrl(url);
        return VM.runInThisContext(data, { filename: "worker.<" + (name || "data:") + ">" });
      }
      function parseDataUrl(url) {
        let [m, type, encoding, data] = url.match(/^data: *([^;,]*)(?: *; *([^,]*))? *,(.*)$/) || [];
        if (!m)
          throw Error("Invalid Data URL.");
        if (encoding)
          switch (encoding.toLowerCase()) {
            case "base64":
              data = Buffer.from(data, "base64").toString();
              break;
            default:
              throw Error('Unknown Data URL encoding "' + encoding + '"');
          }
        return { type, data };
      }
    } });
    var index_node_exports = {};
    __export(index_node_exports, { CMDService: () => CMDService, E2EEService: () => E2EEService, ECSService: () => ECSService, Graph: () => Graph, GraphNode: () => GraphNode, HTTPbackend: () => HTTPbackend2, Router: () => Router, SSEbackend: () => SSEbackend2, Service: () => Service, Systems: () => Systems, UserRouter: () => UserRouter2, WSSbackend: () => WSSbackend2, WorkerService: () => WorkerService, createNode: () => createNode, getFnParamInfo: () => getFnParamInfo, getFnParamNames: () => getFnParamNames, parseFunctionFromText: () => parseFunctionFromText, reconstructNode: () => reconstructNode, reconstructObject: () => reconstructObject, state: () => state, stringifyFast: () => stringifyFast, stringifyWithCircularRefs: () => stringifyWithCircularRefs, unsafeRoutes: () => unsafeRoutes });
    module2.exports = __toCommonJS(index_node_exports);
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
            info.set(name, { state: (0, eval)(`(${value})`), spread });
        } catch (e) {
          info.set(name, {});
        }
      });
      return info;
    }
    function getFnParamNames(fn) {
      var fstr = fn.toString();
      return fstr.match(/\(.*?\)/)[0].replace(/[()]/gi, "").replace(/\s/gi, "").split(",");
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
    var state = { pushToState: {}, data: {}, triggers: {}, setState(updateObj) {
      Object.assign(state.data, updateObj);
      for (const prop of Object.getOwnPropertyNames(updateObj)) {
        if (state.triggers[prop])
          state.triggers[prop].forEach((obj) => obj.onchange(state.data[prop]));
      }
      return state.data;
    }, subscribeTrigger(key, onchange) {
      if (key) {
        if (!state.triggers[key]) {
          state.triggers[key] = [];
        }
        let l = state.triggers[key].length;
        state.triggers[key].push({ idx: l, onchange });
        return state.triggers[key].length - 1;
      } else
        return void 0;
    }, unsubscribeTrigger(key, sub) {
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
    }, subscribeTriggerOnce(key, onchange) {
      let sub;
      let changed = (value) => {
        onchange(value);
        state.unsubscribeTrigger(key, sub);
      };
      sub = state.subscribeTrigger(key, changed);
    } };
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
        this.operator = (self2 = this, origin, ...args) => {
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
          }
          if (!pass) {
            let fn = operator;
            operator = (self2, origin, ...args) => {
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
              await n.parent._run(n.parent, this, ...args);
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
                await n.children[key]._run(n.children[key], n, ...args);
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
                    await n.branch[k].then._run(n.branch[k].then, n, ...output);
                  else
                    await n.branch[k].then._run(n.branch[k].then, n, ...output);
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
                      await n.branch[k].then._run(n.branch[k].then, n, ...output);
                    else
                      await n.branch[k].then._run(n.branch[k].then, n, ...output);
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
        this.append = (n, parentNode2 = this) => {
          if (typeof n === "string")
            n = this.nodes.get(n);
          if (n instanceof GraphNode) {
            parentNode2.addChildren(n);
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
        this.getProps = (n = this) => {
          return { tag: n.tag, operator: n.operator, graph: n.graph, children: n.children, parent: n.parent, forward: n.forward, backward: n.bacward, loop: n.loop, animate: n.animate, frame: n.frame, delay: n.delay, recursive: n.recursive, repeat: n.repeat, branch: n.branch, oncreate: n.oncreate, DEBUGNODE: n.DEBUGNODE, ...this._initial };
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
            return this.state.subscribeTrigger(this.tag, (res) => {
              if (Array.isArray(res))
                n._run(n, this, ...res);
              else
                n._run(n, this, res);
            });
        };
        this.print = (n = this, printChildren = true, nodesPrinted = []) => {
          let dummyNode = new GraphNode();
          if (typeof n === "string")
            n = this.nodes.get(n);
          if (n instanceof GraphNode) {
            nodesPrinted.push(n.tag);
            let jsonToPrint = { tag: n.tag, operator: n.operator.toString() };
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
            properties = { source, operator: (input) => {
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
            } };
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
        this.add = (n = {}) => {
          let props2 = n;
          if (!(n instanceof GraphNode))
            n = new GraphNode(props2, this, this);
          else {
            this.nNodes = this.nodes.size;
            if (n.tag) {
              this.tree[n.tag] = props2;
              this.nodes.set(n.tag, n);
            }
          }
          return n;
        };
        this.setTree = (tree2 = this.tree) => {
          if (!tree2)
            return;
          for (const node in tree2) {
            if (!this.nodes.get(node)) {
              if (typeof tree2[node] === "function") {
                this.add({ tag: node, operator: tree2[node] });
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
                this.add({ tag: node, operator: (self2, origin, ...args) => {
                  return tree2[node];
                } });
              }
            } else {
              let n = this.nodes.get(node);
              if (typeof tree2[node] === "function") {
                n.setOperator(tree2[node]);
              } else if (typeof tree2[node] === "object") {
                if (tree2[node] instanceof GraphNode) {
                  this.add(tree2[node]);
                } else if (tree2[node] instanceof Graph) {
                  let source = tree2[node];
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
                  n.setProps(tree2[node]);
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
        this.get = (tag2) => {
          return this.nodes.get(tag2);
        };
        this.set = (n) => {
          return this.nodes.set(n.tag, n);
        };
        this.run = (n, ...args) => {
          if (typeof n === "string")
            n = this.nodes.get(n);
          if (n instanceof GraphNode)
            return n._run(n, this, ...args);
          else
            return void 0;
        };
        this.runAsync = (n, ...args) => {
          if (typeof n === "string")
            n = this.nodes.get(n);
          if (n instanceof GraphNode)
            return new Promise((res, rej) => {
              res(n._run(n, this, ...args));
            });
          else
            return new Promise((res, rej) => {
              res(void 0);
            });
        };
        this._run = (n, origin = this, ...args) => {
          if (typeof n === "string")
            n = this.nodes.get(n);
          if (n instanceof GraphNode)
            return n._run(n, origin, ...args);
          else
            return void 0;
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
        this.callParent = async (n, origin = n, ...args) => {
          if (n?.parent) {
            return await n.callParent(n, origin, ...args);
          }
        };
        this.callChildren = async (n, idx, ...args) => {
          if (n?.children) {
            return await n.callChildren(idx, ...args);
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
        this.unsubscribe = (tag2, sub) => {
          this.state.unsubscribeTrigger(tag2, sub);
        };
        this.subscribeNode = (inputNode, outputNode) => {
          let tag2;
          if (inputNode?.tag)
            tag2 = inputNode.tag;
          else if (typeof inputNode === "string")
            tag2 = inputNode;
          if (typeof outputNode === "string")
            outputNode = this.nodes.get(outputNode);
          if (inputNode && outputNode) {
            let sub = this.state.subscribeTrigger(tag2, (res) => {
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
        this.create = (operator, parentNode, props2) => {
          return createNode(operator, parentNode, props2, this);
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
    function reconstructNode(json, parentNode, graph) {
      let reconstructed = reconstructObject(json);
      if (reconstructed)
        return new GraphNode(reconstructed, parentNode, graph);
      else
        return void 0;
    }
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
      const path3 = ["this"];
      function clear() {
        refs.clear();
        parents.length = 0;
        path3.length = 1;
      }
      function updateParents(key, value) {
        var idx = parents.length - 1;
        var prev = parents[idx];
        if (typeof prev === "object") {
          if (prev[key] === value || idx === 0) {
            path3.push(key);
            parents.push(value.pushed);
          } else {
            while (idx-- >= 0) {
              prev = parents[idx];
              if (typeof prev === "object") {
                if (prev[key] === value) {
                  idx += 2;
                  parents.length = idx;
                  path3.length = idx;
                  --idx;
                  parents[idx] = value;
                  path3[idx] = key;
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
              refs.set(value, path3.join("."));
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
      const path3 = ["this"];
      function clear() {
        refs.clear();
        parents.length = 0;
        path3.length = 1;
      }
      function updateParents(key, value) {
        var idx = parents.length - 1;
        if (parents[idx]) {
          var prev = parents[idx];
          if (typeof prev === "object") {
            if (prev[key] === value || idx === 0) {
              path3.push(key);
              parents.push(value.pushed);
            } else {
              while (idx-- >= 0) {
                prev = parents[idx];
                if (typeof prev === "object") {
                  if (prev[key] === value) {
                    idx += 2;
                    parents.length = idx;
                    path3.length = idx;
                    --idx;
                    parents[idx] = value;
                    path3[idx] = key;
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
              refs.set(value, path3.join("."));
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
    var Service = class extends Graph {
      constructor(options = {}) {
        super(void 0, options.name ? options.name : `service${Math.floor(Math.random() * 1e14)}`, options.props);
        this.routes = {};
        this.loadDefaultRoutes = false;
        this.keepState = true;
        this.firstLoad = true;
        this.init = (options2) => {
          if (options2)
            options2 = Object.assign({}, options2);
          else
            options2 = {};
          if (options2.customRoutes)
            Object.assign(options2.customRoutes, this.customRoutes);
          else
            options2.customRoutes = this.customRoutes;
          if (options2.customChildren)
            Object.assign(options2.customChildren, this.customChildren);
          else
            options2.customChildren = this.customChildren;
          if (Array.isArray(options2.routes)) {
            options2.routes.forEach((r) => {
              this.load(r, options2.includeClassName, options2.routeFormat, options2.customRoutes, options2.customChildren);
            });
          } else if (options2.routes || (Object.keys(this.routes).length > 0 || this.loadDefaultRoutes) && this.firstLoad)
            this.load(options2.routes, options2.includeClassName, options2.routeFormat, options2.customRoutes, options2.customChildren);
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
                let module22 = routes;
                routes = {};
                Object.getOwnPropertyNames(module22).forEach((route) => {
                  if (includeClassName)
                    routes[name + routeFormat + route] = module22[route];
                  else
                    routes[route] = module22[route];
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
        this.defaultRoutes = { "/": { get: () => {
          return this.print();
        }, aliases: [""] }, ping: () => {
          console.log("ping");
          return "pong";
        }, echo: (...args) => {
          this.transmit(...args);
          return args;
        }, assign: (source) => {
          if (typeof source === "object") {
            Object.assign(this, source);
            return true;
          }
          return false;
        }, recursivelyAssign: (source) => {
          if (typeof source === "object") {
            this.recursivelyAssign(this, source);
            return true;
          }
          return false;
        }, log: { post: (...args) => {
          console.log("Log: ", ...args);
        }, aliases: ["info"] }, error: (message) => {
          let er = new Error(message);
          console.error(message);
          return er;
        }, state: (key) => {
          if (key) {
            return this.state.data[key];
          } else
            return this.state.data;
        }, printState: (key) => {
          if (key) {
            return stringifyWithCircularRefs(this.state.data[key]);
          } else
            return stringifyWithCircularRefs(this.state.data);
        }, spliceTypedArray: this.spliceTypedArray, transmit: this.transmit, receive: this.receive, load: this.load, unload: this.unload, pipe: this.pipe, terminate: this.terminate, run: this.run, _run: this._run, subscribe: this.subscribe, subscribeNode: this.subscribeNode, unsubscribe: this.unsubscribe, stopNode: this.stopNode, get: this.get, add: this.add, remove: this.remove, setTree: this.setTree, setState: this.setState, print: this.print, reconstruct: this.reconstruct, handleMethod: this.handleMethod, handleServiceMessage: this.handleServiceMessage, handleGraphNodeCall: this.handleGraphNodeCall };
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
    var unsafeRoutes = { setRoute: (self2, origin, fn, fnName) => {
      if (typeof fn === "string")
        fn = parseFunctionFromText(fn);
      if (typeof fn === "function") {
        if (!fnName)
          fnName = fn.name;
        if (self2.graph.get(fnName)) {
          self2.graph.get(fnName).setOperator(fn);
        } else
          self2.graph.load({ [fnName]: { operator: fn } });
        return true;
      }
      return false;
    }, setNode: (self2, origin, fn, fnName) => {
      if (typeof fn === "string")
        fn = parseFunctionFromText(fn);
      if (typeof fn === "function") {
        if (!fnName)
          fnName = fn.name;
        if (self2.graph.get(fnName)) {
          self2.graph.get(fnName).setOperator(fn);
        } else
          self2.graph.add({ tag: fnName, operator: fn });
        return true;
      }
      return false;
    }, setMethod: (self2, origin, route, fn, fnName) => {
      if (typeof fn === "string")
        fn = parseFunctionFromText(fn);
      if (typeof fn === "function") {
        if (!fnName)
          fnName = fn.name;
        if (self2.graph.get(route)) {
          self2.graph.get(route)[fnName] = fn;
        } else
          self2.graph.add({ tag: fnName, [fnName]: fn });
        return true;
      }
      return false;
    }, assignRoute: (self2, origin, route, source) => {
      if (self2.graph.get(route) && typeof source === "object") {
        Object.assign(self2.graph.get(route), source);
      }
    }, transferClass: (classObj, className) => {
      if (typeof classObj === "object") {
        let str = classObj.toString();
        let message = { route: "receiveClass", args: [str, className] };
        return message;
      }
      return false;
    }, receiveClass: (self2, origin, stringified, className) => {
      if (typeof stringified === "string") {
        if (stringified.indexOf("class") === 0) {
          let cls = (0, eval)("(" + stringified + ")");
          let name = className;
          if (!name)
            name = cls.name;
          self2.graph[name] = cls;
          return true;
        }
      }
      return false;
    }, setGlobal: (self2, origin, key, value) => {
      globalThis[key] = value;
      return true;
    }, assignGlobalObject: (self2, origin, target, source) => {
      if (!globalThis[target])
        return false;
      if (typeof source === "object")
        Object.assign(globalThis[target], source);
      return true;
    }, setValue: (self2, origin, key, value) => {
      self2.graph[key] = value;
      return true;
    }, assignObject: (self2, origin, target, source) => {
      if (!self2.graph[target])
        return false;
      if (typeof source === "object")
        Object.assign(self2.graph[target], source);
      return true;
    }, setGlobalFunction: (self2, origin, fn, fnName) => {
      if (typeof fn === "string")
        fn = parseFunctionFromText(fn);
      if (typeof fn === "function") {
        if (!fnName)
          fnName = fn.name;
        globalThis[fnName] = fn;
        return true;
      }
      return false;
    }, assignFunctionToGlobalObject: (self2, origin, globalObjectName, fn, fnName) => {
      if (!globalThis[globalObjectName])
        return false;
      if (typeof fn === "string")
        fn = parseFunctionFromText(fn);
      if (typeof fn === "function") {
        if (!fnName)
          fnName = fn.name;
        self2.graph[globalObjectName][fnName] = fn;
        return true;
      }
      return false;
    }, setFunction: (self2, origin, fn, fnName) => {
      if (typeof fn === "string")
        fn = parseFunctionFromText(fn);
      if (typeof fn === "function") {
        if (!fnName)
          fnName = fn.name;
        self2.graph[fnName] = fn;
        return true;
      }
      return false;
    }, assignFunctionToObject: (self2, origin, objectName, fn, fnName) => {
      if (!self2.graph[objectName])
        return false;
      if (typeof fn === "string")
        fn = parseFunctionFromText(fn);
      if (typeof fn === "function") {
        if (!fnName)
          fnName = fn.name;
        self2.graph[objectName][fnName] = fn;
        return true;
      }
      return false;
    } };
    var ECSService = class extends Service {
      constructor(options) {
        super(options);
        this.entities = {};
        this.systems = {};
        this.map = /* @__PURE__ */ new Map();
        this.order = [];
        this.animating = true;
        this.updateEntities = (order = this.order, filter) => {
          order.forEach((k) => {
            if (this.systems[k]) {
              if (filter) {
                this.systems[k]._run(this.systems[k], this, this.map.get(k));
              } else
                this.systems[k]._run(this.systems[k], this, this.entities);
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
            let entity = this.addEntity(prototype, components);
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
        this.routes = { animateEntities: this.animate, startEntityAnimation: this.start, stopEntityAnimation: this.stop, addEntity: this.addEntity, addSystem: this.addSystem, addSystems: this.addSystems, removeEntity: this.removeEntity, removeSystem: this.removeSystem, setupEntity: this.setupEntity, addEntities: this.addEntities, filterObject: this.filterObject, bufferValues: this.bufferValues };
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
        return Object.fromEntries(Object.entries(o).filter(([key, value]) => {
          filter(key, value);
        }));
      }
    };
    var Systems = { collision: { tag: "collision", setupEntities: (self2, entities) => {
      for (const key in entities) {
        const entity = entities[key];
        if (entity.components) {
          if (!entity.components[self2.tag])
            continue;
        }
        Systems.collision.setupEntity(self2, entity);
      }
      return entities;
    }, setupEntity: (self2, entity) => {
      if (!("collisionEnabled" in entity))
        entity.collisionEnabled = true;
      if (!entity.collisionType)
        entity.collisionType = "sphere";
      if (!entity.collisionRadius)
        entity.collisionRadius = 1;
      if (!entity.collisionBoundsScale)
        entity.collisionBoundsScale = { x: 1, y: 1, z: 1 };
      if (!entity.colliding)
        entity.colliding = {};
      if (!entity.position)
        entity.position = { x: 0, y: 0, z: 0 };
      return entity;
    }, operator: (self2, origin, entities) => {
      for (const key in entities) {
        const entity1 = entities[key];
        if (entity1.components) {
          if (!entity1.components[self2.tag] || !entity1.collisionEnabled)
            continue;
        }
        if (!entity1.collisionEnabled)
          continue;
        for (const key2 in entities) {
          const entity2 = entities[key2];
          if (entity2.components) {
            if (!entity2.components[self2.tag])
              continue;
          }
          if (!entity2.collisionEnabled)
            continue;
          let colliding = Systems.collision.collisionCheck(entity1, entity2);
          if (colliding !== false) {
            entity1.colliding[entity2.tag] = colliding;
            entity2.colliding[entity1.tag] = colliding;
          }
        }
      }
      return entities;
    }, collisionCheck: (body1, body2) => {
      if (body1.collisionEnabled === false || body2.collisionEnabled === false)
        return false;
      const dist = Systems.collision.distance(body1.position, body2.position);
      if (dist < Math.max(...Object.values(body1.collisionBoundsScale)) * body1.collisionRadius + Math.max(...Object.values(body2.collisionBoundsScale)) * body2.collisionRadius) {
        let isColliding = false;
        if (body1.collisionType === "sphere") {
          if (body2.collisionType === "sphere") {
            isColliding = Systems.collision.sphereCollisionCheck(body1, body2, dist);
          } else if (body2.collisionType === "box") {
            isColliding = Systems.collision.sphereBoxCollisionCheck(body1, body2, dist);
          } else if (body2.collisionType === "point") {
            isColliding = Systems.collision.isPointInsideSphere(body2.position, body1, dist);
          }
        } else if (body1.collisionType === "box") {
          if (body2.collisionType === "sphere") {
            isColliding = Systems.collision.sphereBoxCollisionCheck(body2, body1, dist);
          } else if (body2.collisionType === "box") {
            isColliding = Systems.collision.boxCollisionCheck(body1, body2);
          } else if (body2.collisionType === "point") {
            isColliding = Systems.collision.isPointInsideBox(body1.position, body1);
          }
        } else if (body1.collisionType === "point") {
          if (body2.collisionType === "sphere") {
            isColliding = Systems.collision.isPointInsideSphere(body1.position, body2, dist);
          } else if (body2.collisionType === "box") {
            isColliding = Systems.collision.isPointInsideBox(body1.position, body2);
          }
        }
        if (isColliding)
          return dist;
      }
      return false;
    }, sphereCollisionCheck: (body1, body2, dist) => {
      if (dist === void 0)
        dist = Systems.collision.distance(body1.position, body2.position);
      return dist < body1.collisionRadius + body2.collisionRadius;
    }, boxCollisionCheck: (body1, body2) => {
      let body1minX = (body1.position.x - body1.collisionRadius) * body1.collisionBoundsScale.x;
      let body1maxX = (body1.position.x + body1.collisionRadius) * body1.collisionBoundsScale.x;
      let body1minY = (body1.position.y - body1.collisionRadius) * body1.collisionBoundsScale.y;
      let body1maxY = (body1.position.y + body1.collisionRadius) * body1.collisionBoundsScale.y;
      let body1minZ = (body1.position.z - body1.collisionRadius) * body1.collisionBoundsScale.z;
      let body1maxZ = (body1.position.z + body1.collisionRadius) * body1.collisionBoundsScale.z;
      let body2minX = (body2.position.x - body2.collisionRadius) * body1.collisionBoundsScale.x;
      let body2maxX = (body2.position.x + body2.collisionRadius) * body1.collisionBoundsScale.x;
      let body2minY = (body2.position.y - body2.collisionRadius) * body1.collisionBoundsScale.y;
      let body2maxY = (body2.position.y + body2.collisionRadius) * body1.collisionBoundsScale.y;
      let body2minZ = (body2.position.z - body2.collisionRadius) * body1.collisionBoundsScale.z;
      let body2maxZ = (body2.position.z + body2.collisionRadius) * body1.collisionBoundsScale.z;
      return (body1maxX <= body2maxX && body1maxX >= body2minX || body1minX <= body2maxX && body1minX >= body2minX) && (body1maxY <= body2maxY && body1maxY >= body2minY || body1minY <= body2maxY && body1minY >= body2minY) && (body1maxZ <= body2maxZ && body1maxZ >= body2minZ || body1minZ <= body2maxZ && body1minZ >= body2minZ);
    }, sphereBoxCollisionCheck: (sphere, box, dist) => {
      let boxMinX = (box.position.x - box.collisionRadius) * box.collisionBoundsScale.x;
      let boxMaxX = (box.position.x + box.collisionRadius) * box.collisionBoundsScale.x;
      let boxMinY = (box.position.y - box.collisionRadius) * box.collisionBoundsScale.y;
      let boxMaxY = (box.position.y + box.collisionRadius) * box.collisionBoundsScale.y;
      let boxMinZ = (box.position.z - box.collisionRadius) * box.collisionBoundsScale.z;
      let boxMaxZ = (box.position.z + box.collisionRadius) * box.collisionBoundsScale.z;
      let clamp = { x: Math.max(boxMinX, Math.min(sphere.position.x, boxMaxX)), y: Math.max(boxMinY, Math.min(sphere.position.y, boxMaxY)), z: Math.max(boxMinZ, Math.min(sphere.position.z, boxMaxZ)) };
      if (dist === void 0)
        dist = Systems.collision.distance(sphere.position, clamp);
      return dist > sphere.collisionRadius;
    }, isPointInsideSphere: (point, sphere, dist) => {
      if (dist === void 0)
        dist = Systems.collision.distance(point, sphere.position);
      return dist < sphere.collisionRadius;
    }, isPointInsideBox: (point, box) => {
      let boxminX = (box.position.x - box.collisionRadius) * box.collisionBoundsScale.x;
      let boxmaxX = (box.position.x + box.collisionRadius) * box.collisionBoundsScale.x;
      let boxminY = (box.position.y - box.collisionRadius) * box.collisionBoundsScale.x;
      let boxmaxY = (box.position.y + box.collisionRadius) * box.collisionBoundsScale.x;
      let boxminZ = (box.position.z - box.collisionRadius) * box.collisionBoundsScale.x;
      let boxmaxZ = (box.position.z + box.collisionRadius) * box.collisionBoundsScale.x;
      return point.x >= boxminX && point.x <= boxmaxX && (point.y >= boxminY && point.y <= boxmaxY) && (point.z >= boxminZ && point.z <= boxmaxZ);
    }, closestPointOnLine: (point, lineStart, lineEnd) => {
      let a = { x: lineEnd.x - lineStart.x, y: lineEnd.y - lineStart.y, z: lineEnd.z - lineStart.z };
      let b = { x: lineStart.x - point.x, y: lineStart.y - point.y, z: lineStart.z - point.z };
      let c = { x: lineEnd.x - point.x, y: lineEnd.y - point.y, z: lineEnd.z - point.z };
      let bdota = Systems.collision.dot(b, a);
      if (bdota <= 0)
        return lineStart;
      let cdota = Systems.collision.dot(c, a);
      if (cdota <= 0)
        return lineEnd;
      let _bdotapluscdota = 1 / (bdota + cdota);
      return { x: lineStart.x + (lineEnd.x - lineStart.x) * bdota * _bdotapluscdota, y: lineStart.y + (lineEnd.y - lineStart.y) * bdota * _bdotapluscdota, z: lineStart.z + (lineEnd.z - lineStart.z) * bdota * _bdotapluscdota };
    }, closestPointOnPolygon: (point, t0, t1, t2) => {
      let n = Systems.collision.calcNormal(t0, t1, t2);
      let dist = Systems.collision.dot(point, n) - Systems.collision.dot(t0, n);
      let projection = Systems.collision.vecadd(point, Systems.collision.vecscale(n, -dist));
      let v0x = t2[0] - t0[0];
      let v0y = t2[1] - t0[1];
      let v0z = t2[2] - t0[2];
      let v1x = t1[0] - t0[0];
      let v1y = t1[1] - t0[1];
      let v1z = t1[2] - t0[2];
      let v2x = projection[0] - t0[0];
      let v2y = projection[1] - t0[1];
      let v2z = projection[2] - t0[2];
      let dot00 = v0x * v0x + v0y * v0y + v0z * v0z;
      let dot01 = v0x * v1x + v0y * v1y + v0z * v1z;
      let dot02 = v0x * v2x + v0y * v2y + v0z * v2z;
      let dot11 = v1x * v1x + v1y * v1y + v1z * v1z;
      let dot12 = v1x * v2x + v1y * v2y + v1z * v2z;
      let denom = dot00 * dot11 - dot01 * dot01;
      if (Math.abs(denom) < 1e-30) {
        return void 0;
      }
      let _denom = 1 / denom;
      let u = (dot11 * dot02 - dot01 * dot12) * _denom;
      let v = (dot00 * dot12 - dot01 * dot02) * _denom;
      if (u >= 0 && v >= 0 && u + v < 1) {
        return projection;
      } else
        return void 0;
    }, calcNormal: (t0, t1, t2, positive = true) => {
      var QR = Systems.collision.makeVec(t0, t1);
      var QS = Systems.collision.makeVec(t0, t2);
      if (positive === true) {
        return Systems.collision.normalize(Systems.collision.cross3D(QR, QS));
      } else {
        return Systems.collision.normalize(Systems.collision.cross3D(QS, QR));
      }
    }, dot: (v1, v2) => {
      let dot = 0;
      for (const key in v1) {
        dot += v1[key] * v2[key];
      }
      return dot;
    }, makeVec(p1, p2) {
      return { x: p2.x - p1.x, y: p2.y - p1.y, z: p2.z - p1.z };
    }, vecadd: (v1, v2) => {
      let result = Object.assign({}, v1);
      for (const key in result) {
        result[key] += v2[key];
      }
      return result;
    }, vecsub: (v1, v2) => {
      let result = Object.assign({}, v1);
      for (const key in result) {
        result[key] -= v2[key];
      }
      return result;
    }, vecmul: (v1, v2) => {
      let result = Object.assign({}, v1);
      for (const key in result) {
        result[key] *= v2[key];
      }
      return result;
    }, vecdiv: (v1, v2) => {
      let result = Object.assign({}, v1);
      for (const key in result) {
        result[key] /= v2[key];
      }
      return result;
    }, vecscale: (v1, scalar) => {
      let result = Object.assign({}, v1);
      for (const key in result) {
        result[key] *= scalar;
      }
      return result;
    }, distance: (v1, v2) => {
      let distance = 0;
      for (const key in v1) {
        distance += Math.pow(v1[key] - v2[key], 2);
      }
      return Math.sqrt(distance);
    }, magnitude: (v) => {
      let magnitude = 0;
      for (const key in v) {
        magnitude += v[key] * v[key];
      }
      return Math.sqrt(magnitude);
    }, normalize: (v) => {
      let magnitude = Systems.collision.magnitude(v);
      let _mag = 1 / magnitude;
      let vn = {};
      for (const key in v) {
        vn[key] = v[key] * _mag;
      }
      return vn;
    }, cross3D(v1, v2) {
      return { x: v1.y * v2.z - v1.z * v2.y, y: v1.z * v2.x - v1.x * v2.z, z: v1.x * v2.y - v1.y * v2.x };
    }, nearestNeighborSearch(entities, isWithinRadius = 1e15) {
      var tree = {};
      ;
      for (const key in entities) {
        let newnode = { tag: key, position: void 0, neighbors: [] };
        newnode.position = entities[key].position;
        tree[key] = newnode;
      }
      for (const i in tree) {
        for (const j in tree) {
          var dist = Systems.collision.distance(tree[i].position, tree[j].position);
          if (dist < isWithinRadius) {
            var newNeighbori = { tag: j, position: entities[j].position, dist };
            tree[i].neighbors.push(newNeighbori);
            var newNeighborj = { tag: j, position: entities[i].position, dist };
            tree[j].neighbors.push(newNeighborj);
          }
        }
        tree[i].neighbors.sort(function(a, b) {
          return a.dist - b.dist;
        });
      }
      return tree;
    }, generateBoundingVolumeTree(entities, mode = "octree", withinRadius = 1e15, minEntities = 3) {
      let dynamicBoundingVolumeTree = { proto: { parent: void 0, children: {}, entities: {}, collisionType: "box", collisionRadius: 1, collisionBoundsScale: { x: 1, y: 1, z: 1 }, position: { x: 0, y: 0, z: 0 } }, tree: {} };
      let maxX, maxY, maxZ;
      let minX = 0, minY = 0, minZ = 0;
      let positions = {};
      let minRadius = withinRadius;
      for (const key in entities) {
        const body = entities[key];
        let xx = body.position.x + body.collisionRadius * body.collisionBoundsScale.x;
        let yy = body.position.y + body.collisionRadius * body.collisionBoundsScale.y;
        let zz = body.position.z + body.collisionRadius * body.collisionBoundsScale.z;
        if (maxX < xx)
          maxX = xx;
        if (minX > xx)
          minX = xx;
        if (maxY < yy)
          maxY = yy;
        if (minY > yy)
          minY = yy;
        if (maxZ < zz)
          maxZ = zz;
        if (minZ > zz)
          minZ = zz;
        if (minRadius > body.collisionRadius)
          minRadius = body.collisionRadius;
        positions[key] = body.position;
      }
      ;
      let head = JSON.parse(JSON.stringify(dynamicBoundingVolumeTree.proto));
      let boxpos = { x: (maxX + minX) * 0.5, y: (maxY + minY) * 0.5, z: (maxZ + minZ) * 0.5 };
      let boxbounds = { x: maxX - boxpos.x, y: maxY - boxpos.y, z: maxZ - boxpos.z };
      head.position = boxpos;
      head.collisionBoundsScale = boxbounds;
      head.entities = entities;
      dynamicBoundingVolumeTree.tree = head;
      minRadius *= 2;
      if (mode === "octree") {
        let genOct = function(parentPos, halfbounds) {
          let oct1 = { x: parentPos.x + halfbounds.x, y: parentPos.y + halfbounds.y, z: parentPos.z + halfbounds.z };
          let oct2 = { x: parentPos.x - halfbounds.x, y: parentPos.y + halfbounds.y, z: parentPos.z + halfbounds.z };
          let oct3 = { x: parentPos.x + halfbounds.x, y: parentPos.y - halfbounds.y, z: parentPos.z + halfbounds.z };
          let oct4 = { x: parentPos.x + halfbounds.x, y: parentPos.y + halfbounds.y, z: parentPos.z - halfbounds.z };
          let oct5 = { x: parentPos.x - halfbounds.x, y: parentPos.y - halfbounds.y, z: parentPos.z + halfbounds.z };
          let oct6 = { x: parentPos.x - halfbounds.x, y: parentPos.y + halfbounds.y, z: parentPos.z - halfbounds.z };
          let oct7 = { x: parentPos.x + halfbounds.x, y: parentPos.y - halfbounds.y, z: parentPos.z - halfbounds.z };
          let oct8 = { x: parentPos.x - halfbounds.x, y: parentPos.y - halfbounds.y, z: parentPos.z - halfbounds.z };
          return [oct1, oct2, oct3, oct4, oct5, oct6, oct7, oct8];
        }, genOctTree = function(head2) {
          let halfbounds = { x: head2.collisionBoundsScale.x * 0.5, y: head2.collisionBoundsScale.y * 0.5, z: head2.collisionBoundsScale.z * 0.5 };
          let octPos = genOct(head2.position, halfbounds);
          let check = Object.assign({}, head2.bodies);
          for (let i = 0; i < 8; i++) {
            let octquadrant = Object.assign(JSON.parse(JSON.stringify(dynamicBoundingVolumeTree.proto)), { position: octPos[i], collisionBoundsScale: halfbounds });
            octquadrant.parent = head2;
            for (const j in check) {
              let collided = Systems.collision.collisionCheck(check[j], octquadrant);
              if (collided) {
                octquadrant.entities[j] = check[j];
                delete check[j];
              }
            }
            if (Object.keys(octquadrant.entities).length > minEntities - 1) {
              head2.children[i] = octquadrant;
              octquadrant.parent = head2;
              if (Object.keys(octquadrant.entities).length > minEntities && octquadrant.collisionRadius * 0.5 > minRadius) {
                genOctTree(octquadrant);
              }
            }
          }
        };
        genOctTree(head);
        return head;
      } else {
        let tree = Systems.collision.nearestNeighborSearch(positions, withinRadius);
        let keys = Object.keys(tree);
        let tag = keys[Math.floor(Math.random() * keys.length)];
        let searching = true;
        let count = 0;
        let genBoundingBoxLevel = (tree2, volumes) => {
          let newVolumes = {};
          let foundidxs = {};
          let treekeys = Object.keys(tree2);
          while (searching && count < treekeys.length) {
            let node = tree2[tag];
            let i = 0;
            let j = 0;
            let ux = positions[node.tag].x - volumes[node.tag].collisionBoundsScale.x, uy = positions[node.tag].y - volumes[node.tag].collisionBoundsScale.y, uz = positions[node.tag].z - volumes[node.tag].collisionBoundsScale.z, mx = positions[node.tag].x + volumes[node.tag].collisionBoundsScale.x, my = positions[node.tag].y + volumes[node.tag].collisionBoundsScale.y, mz = positions[node.tag].z + volumes[node.tag].collisionBoundsScale.z;
            let newvolume = JSON.parse(JSON.stringify(dynamicBoundingVolumeTree.proto));
            newvolume.tag = `bound${Math.floor(Math.random() * 1e15)}`;
            newvolume.children[node.tag] = volumes[node.tag];
            newvolume.bodies[node.tag] = entities[node.tag];
            volumes[node.tag].parent = newvolume;
            foundidxs[node.tag] = true;
            i++;
            j++;
            let nkeys = Object.keys(node.neighbors);
            while (i < nkeys.length && j < 3) {
              if (foundidxs[node.neighbors[i].tag]) {
                i++;
                continue;
              }
              let uxn = positions[node.neighbors[i].tag].x - volumes[node.neighbors[i].tag].collisionBoundsScale.x, uyn = positions[node.neighbors[i].tag].y - volumes[node.neighbors[i].tag].collisionBoundsScale.y, uzn = positions[node.neighbors[i].tag].z - volumes[node.neighbors[i].tag].collisionBoundsScale.z, mxn = positions[node.neighbors[i].tag].x + volumes[node.neighbors[i].tag].collisionBoundsScale.x, myn = positions[node.neighbors[i].tag].y + volumes[node.neighbors[i].tag].collisionBoundsScale.y, mzn = positions[node.neighbors[i].tag].z + volumes[node.neighbors[i].tag].collisionBoundsScale.z;
              if (ux > uxn)
                ux = uxn;
              if (mx < mxn)
                mx = mxn;
              if (uy > uyn)
                uy = uyn;
              if (my < myn)
                my = myn;
              if (uz > uzn)
                uz = uzn;
              if (mz < mzn)
                mz = mzn;
              newvolume.children[node.neighbors[i].tag] = volumes[node.neighbors[i].tag];
              newvolume.entities[node.neighbors[i].tag] = entities[node.neighbors[i].tag];
              volumes[node.neighbors[i].tag].parent = newvolume;
              foundidxs[node.neighbors[i].tag] = true;
              i++;
              j++;
            }
            let pos = { x: (mx + ux) * 0.5, y: (my + uy) * 0.5, z: (mz + uz) * 0.5 };
            let bounds = { x: mx - pos.x, y: my - pos.y, z: mz - pos.z };
            newvolume.position = pos;
            newvolume.collisionBoundsScale = bounds;
            if (newvolume.bodies.length === 1)
              newvolume = node;
            newVolumes[newvolume.tag] = newvolume;
            while (i < node.neighbors.length) {
              if (!foundidxs[node.neighbors[i].tag])
                break;
              i++;
            }
            if (i < node.neighbors.length) {
              tag = node.neighbors[i].tag;
            } else if (Object.keys(foundidxs).length < Object.keys(tree2).length) {
              tag = keys[0];
            } else
              searching = false;
            count++;
          }
          return newVolumes;
        };
        let result = genBoundingBoxLevel(tree, entities);
        while (Object.keys(result).length > 2) {
          let nextTree = Systems.collision.nearestNeighborSearch(result, withinRadius);
          result = genBoundingBoxLevel(nextTree, result);
        }
        head.children = result;
        head.children.forEach((n) => {
          n.parent = head;
        });
        return head;
      }
    } }, collider: { tag: "collider", lastTime: performance.now(), setupEntities: (self2, entities) => {
      for (const key in entities) {
        const entity = entities[key];
        if (entity.components) {
          if (!entity.components[self2.tag])
            continue;
        }
        self2.setupEntity(self2, entity);
      }
      return entities;
    }, setupEntity: (self2, entity) => {
      if (!("collisionEnabled" in entity))
        Systems.collision.setupEntity(Systems.collision, entity);
      if (!("position" in entity))
        Systems.movement.setupEntity(Systems.movement, entity);
      if (!("restitution" in entity))
        entity.restitution = 1;
      if (!("useBoundingBox" in entity))
        entity.useBoundingBox = true;
      if (!("boundingBox" in entity))
        entity.boundingBox = { bot: 0, top: 100, left: 0, right: 100, front: 0, back: 100 };
      return entity;
    }, operator: (self2, origin, entities) => {
      for (const key in entities) {
        const entity1 = entities[key];
        if (entity1.components) {
          if (!entity1.components[self2.tag] || !entity1.collisionEnabled)
            continue;
        }
        if (entity1.useBoundingBox)
          self2.checkBoundingBox(self2, entity1);
        if (!entity1.collisionEnabled)
          continue;
        for (const key2 in entity1.colliding) {
          const entity2 = entities[key2];
          if (entity1.colliding[key2] === false) {
            delete entity1.colliding[key2];
            delete entity2.colliding[entity1.tag];
            continue;
          }
          if (!entity2.collisionEnabled)
            continue;
          if (entity2.collisionType === "box") {
            self2.resolveBoxCollision(entity1, entity2, entity1.colliding[key2]);
          } else {
            if (entity1.collisionType === "box") {
              entity1.fixed = true;
              self2.resolveSphereCollisions(entity1, entity2, entity1.colliding[key2]);
              entity1.fixed = false;
            } else {
              self2.resolveSphereCollisions(entity1, entity2, entity1.colliding[key2]);
              delete entity2.colliding[entity1.tag];
            }
          }
          delete entity1.colliding[entity2.tag];
        }
      }
      return entities;
    }, checkBoundingBox: (self2, entity) => {
      const ysize = entity.collisionRadius * entity.collisionBoundsScale.y;
      const xsize = entity.collisionRadius * entity.collisionBoundsScale.x;
      const zsize = entity.collisionRadius * entity.collisionBoundsScale.z;
      if (entity.position.y - ysize <= entity.boundingBox.top) {
        entity.velocity.y *= entity.restitution;
        entity.position.y = entity.boundingBox.top + ysize;
      }
      if (entity.position.y + ysize >= entity.boundingBox.bot) {
        entity.velocity.y *= entity.restitution;
        entity.position.y = entity.boundingBox.bot - ysize;
      }
      if (entity.position.x - xsize <= entity.boundingBox.left) {
        entity.velocity.x *= entity.restitution;
        entity.position.x = entity.boundingBox.left + xsize;
      }
      if (entity.position.x + xsize >= entity.boundingBox.right) {
        entity.velocity.x *= entity.restitution;
        entity.position.x = entity.boundingBox.right - xsize;
      }
      if (entity.position.z - zsize <= entity.boundingBox.front) {
        entity.velocity.z *= entity.restitution;
        entity.position.z = entity.boundingBox.front + zsize;
      }
      if (entity.position.z + zsize >= entity.boundingBox.back) {
        entity.velocity.z *= entity.restitution;
        entity.position.z = entity.boundingBox.back - zsize;
      }
    }, resolveBoxCollision: (body1, box, negate) => {
      let positionVec = Systems.collision.makeVec(body1.position, box.position);
      var directionVec = Object.values(positionVec);
      let closestSide;
      let closestDist = Infinity;
      let mul = -1;
      if (directionVec[idx] < 0)
        mul = 1;
      if (negate)
        mul = -mul;
      for (const key in body1.position) {
        let dist = Math.abs(box.position[key] - body1.position[key]);
        if (dist < closestDist && Math.abs(box.position[key] - body1.position[key] + body1.velocity[key] * 1e-17) < dist) {
          closestSide = key;
          closestDist = dist;
        }
      }
      var idx = directionVec.indexOf(closestSide);
      if (idx === 0)
        idx = "x";
      if (idx === 1)
        idx = "y";
      if (idx === 2)
        idx = "z";
      if (idx === 3)
        idx = "w";
      let boxEdgeAxisPosition = box.position[idx] + box.collisionRadius * box.collisionBoundsScale[idx] * mul;
      if (negate) {
        let body1Offset = boxEdgeAxisPosition - body1.collisionRadius * body1.collisionBoundsScale[idx] * mul;
        body1.position[idx] = body1Offset;
      } else {
        let body1Offset = boxEdgeAxisPosition + body1.collisionRadius * body1.collisionBoundsScale[idx] * mul;
        body1.position[idx] = body1Offset;
      }
      body1.velocity[idx] = -body1.velocity[idx] * body1.restitution;
      if (negate)
        body1.force[idx] = -body1.velocity[idx];
      var body2AccelMag = Systems.collision.magnitude(box.acceleration);
      var body2AccelNormal = Systems.collision.normalize(box.acceleration);
      body1.force[idx] = -body2AccelNormal[idx] * body2AccelMag * box.mass;
      if (negate)
        body1.force[idx] = -body1.force[idx];
    }, resolveSphereCollisions: (entity1, entity2, dist) => {
      if (dist === void 0)
        dist = Systems.collision.distance(entity1.position, entity2.position);
      let vecn = Systems.collision.normalize(Systems.collision.makeVec(entity1.position, entity2.position));
      let sumMass = entity1.mass + entity2.mass;
      let ratio = entity1.mass / sumMass;
      let rmin = 1 - ratio;
      if (entity1.fixed === false) {
        entity1.position.x += vecn.x * rmin * 1.01;
        entity1.position.y += vecn.y * rmin * 1.01;
        entity1.position.z += vecn.z * rmin * 1.001;
      } else {
        entity2.position.x -= vecn.x * 1.01;
        entity2.position.y -= vecn.y * 1.01;
        entity2.position.z -= vecn.z * 1.01;
      }
      if (entity2.fixed === false) {
        entity2.position.x += vecn.x * ratio * 1.01;
        entity2.position.y += vecn.y * ratio * 1.01;
        entity2.position.z += vecn.z * ratio * 1.01;
      } else {
        entity1.position.x += vecn.x * 1.01;
        entity1.position.y += vecn.y * 1.01;
        entity1.position.z += vecn.z * 1.01;
      }
      dist = Systems.collision.distance(entity1.position, entity2.position);
      let vrel = { x: entity1.velocity.x - entity2.velocity.x, y: entity1.velocity.y - entity2.velocity.y, z: entity1.velocity.z - entity2.velocity.z };
      let speed = vrel.x * vecn.x + vrel.y * vecn.y + vrel.z * vecn.z;
      if (speed > 0) {
        let impulse = 2 * speed / sumMass;
        if (entity1.fixed === false) {
          entity1.velocity.x -= impulse * vecn.x * entity2.mass * entity1.restitution;
          entity1.velocity.y -= impulse * vecn.y * entity2.mass * entity1.restitution;
          entity1.velocity.z -= impulse * vecn.z * entity2.mass * entity1.restitution;
        }
        if (entity2.fixed === false) {
          entity2.velocity.x += impulse * vecn.x * entity2.mass * entity2.restitution / entity2.mass;
          entity2.velocity.y += impulse * vecn.y * entity2.mass * entity2.restitution / entity2.mass;
          entity2.velocity.z += impulse * vecn.z * entity2.mass * entity2.restitution / entity2.mass;
        }
      }
    } }, nbody: { tag: "nbody", lastTime: performance.now(), G: 6674e-14, setupEntities: (self2, entities) => {
      for (const key in entities) {
        const entity = entities[key];
        if (entity.components) {
          if (!entity.components[self2.tag])
            continue;
        }
        self2.setupEntity(self2, entity);
      }
      return entities;
    }, setupEntity: (self2, entity) => {
      Systems.collider.setupEntity(Systems.collider, entity);
      entity.isAttractor = true;
      return entity;
    }, operator: (self2, origin, entities) => {
      for (const key in entities) {
        const entity = entities[key];
        if (entity.components) {
          if (!entity.components[self2.tag])
            continue;
        }
        if (!entity.mass)
          continue;
        for (const key2 in entities) {
          const entity2 = entities[key2];
          if (entity2.components) {
            if (!entity2.components[self2.tag])
              continue;
          }
          if (!entity2.mass || !entity2.isAttractor)
            continue;
          Systems.nbody.attract(entity, entity2);
        }
      }
      return entities;
    }, attract: (body1, body2, dist, vecn) => {
      if (dist === void 0)
        dist = Systems.collision.distance(body1.position, body2.position);
      if (vecn === void 0)
        vecn = Systems.collision.normalize(Systems.collision.makeVec(body1.position, body2.position));
      let Fg = 6674e-14 * body1.mass * body2.mass / (dist * dist);
      body1.force.x += vecn.x * Fg;
      body1.force.y += vecn.y * Fg;
      body1.force.z += vecn.z * Fg;
      body2.force.x -= vecn.x * Fg;
      body2.force.y -= vecn.y * Fg;
      body2.force.z -= vecn.z * Fg;
    } }, boid: { tag: "boid", lastTime: performance.now(), setupEntities: (self2, entities) => {
      for (const key in entities) {
        const entity = entities[key];
        self2.setupEntity(self2, entity);
      }
      return entities;
    }, setupEntity: (self2, entity) => {
      if (!entity.position) {
        Systems.collider.setupEntity(Systems.collider, entity);
      }
      entity.collisionEnabled = false;
      if (!entity.position.x && !entity.position.y && !entity.position.z) {
        entity.position.x = Math.random() * entity.boundingBox.right;
        entity.position.y = Math.random() * entity.boundingBox.back;
        entity.position.z = Math.random() * entity.boundingBox.top;
      }
      if (!entity.boid) {
        entity.boid = { cohesion: 1e-5, separation: 1e-4, alignment: 6e-3, swirl: { x: 0.5, y: 0.5, z: 0.5, mul: 6e-3 }, attractor: { x: 0.5, y: 0.5, z: 0.5, mul: 2e-3 }, useCohesion: true, useSeparation: true, useAlignment: true, useSwirl: true, useAttractor: true, useAttraction: false, groupRadius: 200, groupSize: 1, searchLimit: 3 };
      }
      return entity;
    }, operator: (self2, origin, entities) => {
      let now = performance.now();
      let timeStep = now - self2.lastTime;
      self2.lastTime = now;
      let keys = Object.keys(entities);
      let length = Object.keys(entities).length;
      let _timeStep = 1 / timeStep;
      outer:
        for (const i in entities) {
          let p0 = entities[i];
          const inRange = [];
          const distances = [];
          const boidVelocities = [p0.position.x, p0.position.y, p0.position.z, 0, 0, 0, p0.velocity.x, p0.velocity.y, p0.velocity.z, 0, 0, 0, 0, 0, 0, 0, 0, 0];
          let groupCount = 1;
          nested:
            for (const j in entities) {
              let p = entities[j];
              if (distances.length > p0.boid.groupSize || j >= p0.boid.searchLimit) {
                break nested;
              }
              let randj = keys[Math.floor(Math.random() * length)];
              if (j === i || entities[randj].tag === entities[i].tag || inRange.indexOf(randj) > -1) {
              } else {
                let pr = entities[randj];
                let disttemp = Systems.collision.distance(p0.position, pr.position);
                if (disttemp > p0.boid.groupRadius) {
                } else {
                  distances.push(disttemp);
                  inRange.push(randj);
                  let distInv;
                  if (p0.boid.useSeparation || p0.boid.useAlignment) {
                    distInv = p0.boid.groupRadius / (disttemp * disttemp);
                    if (distInv == Infinity)
                      distInv = p.maxSpeed;
                    else if (distInv == -Infinity)
                      distInv = -p.maxSpeed;
                  }
                  if (p0.boid.useCohesion) {
                    boidVelocities[0] += (pr.position.x - p0.position.x) * 0.5 * disttemp * _timeStep;
                    boidVelocities[1] += (pr.position.y - p0.position.y) * 0.5 * disttemp * _timeStep;
                    boidVelocities[2] += (pr.position.z - p0.position.z) * 0.5 * disttemp * _timeStep;
                  }
                  if (isNaN(disttemp) || isNaN(boidVelocities[0]) || isNaN(pr.position.x)) {
                    console.log(disttemp, i, randj, p0.position, pr.position, boidVelocities);
                    p0.position.x = NaN;
                    return;
                  }
                  if (p0.boid.useSeparation) {
                    boidVelocities[3] = boidVelocities[3] + (p0.position.x - pr.position.x) * distInv;
                    boidVelocities[4] = boidVelocities[4] + (p0.position.y - pr.position.y) * distInv;
                    boidVelocities[5] = boidVelocities[5] + (p0.position.z - pr.position.z) * distInv;
                  }
                  if (p0.boid.useAttraction && pr.boid.useAttraction) {
                    Systems.nbody.attract(p0, pr, disttemp);
                  }
                  if (p0.boid.useAlignment) {
                    boidVelocities[6] = boidVelocities[6] + pr.velocity.x * distInv;
                    boidVelocities[7] = boidVelocities[7] + pr.velocity.y * distInv;
                    boidVelocities[8] = boidVelocities[8] + pr.velocity.z * distInv;
                  }
                  groupCount++;
                }
              }
            }
          let _groupCount = 1 / groupCount;
          if (p0.boid.useCohesion) {
            boidVelocities[0] = p0.boid.cohesion * (boidVelocities[0] * _groupCount);
            boidVelocities[1] = p0.boid.cohesion * (boidVelocities[1] * _groupCount);
            boidVelocities[2] = p0.boid.cohesion * (boidVelocities[2] * _groupCount);
          } else {
            boidVelocities[0] = 0;
            boidVelocities[1] = 0;
            boidVelocities[2] = 0;
          }
          if (p0.boid.useSeparation) {
            boidVelocities[3] = p0.boid.separation * boidVelocities[3];
            boidVelocities[4] = p0.boid.separation * boidVelocities[4];
            boidVelocities[5] = p0.boid.separation * boidVelocities[5];
          } else {
            boidVelocities[3] = 0;
            boidVelocities[4] = 0;
            boidVelocities[5] = 0;
          }
          if (p0.boid.useAlignment) {
            boidVelocities[6] = -(p0.boid.alignment * boidVelocities[6] * _groupCount);
            boidVelocities[7] = p0.boid.alignment * boidVelocities[7] * _groupCount;
            boidVelocities[8] = p0.boid.alignment * boidVelocities[8] * _groupCount;
          } else {
            boidVelocities[6] = 0;
            boidVelocities[7] = 0;
            boidVelocities[8] = 0;
          }
          const swirlVec = [0, 0, 0];
          if (p0.boid.useSwirl == true) {
            boidVelocities[9] = -(p0.position.y - p0.boid.swirl.y) * p0.boid.swirl.mul;
            boidVelocities[10] = (p0.position.z - p0.boid.swirl.z) * p0.boid.swirl.mul;
            boidVelocities[11] = (p0.position.x - p0.boid.swirl.x) * p0.boid.swirl.mul;
          }
          const attractorVec = [0, 0, 0];
          if (p0.boid.useAttractor == true) {
            boidVelocities[12] = (p0.boid.attractor.x - p0.position.x) * p0.boid.attractor.mul;
            if (p0.position.x > p0.boundingBox.left || p0.position.x < p0.boundingBox.right) {
              boidVelocities[12] *= 3;
            }
            boidVelocities[13] = (p0.boid.attractor.y - p0.position.y) * p0.boid.attractor.mul;
            if (p0.position.y > p0.boundingBox.top || p0.position.y < p0.boundingBox.bottom) {
              boidVelocities[13] *= 3;
            }
            boidVelocities[14] = (p0.boid.attractor.z - p0.position.z) * p0.boid.attractor.mul;
            if (p0.position.z > p0.boundingBox.front || p0.position.z < p0.boundingBox.back) {
              boidVelocities[14] *= 3;
            }
          }
          entities[i].velocity.x = p0.velocity.x + boidVelocities[0] + boidVelocities[3] + boidVelocities[6] + boidVelocities[9] + boidVelocities[12] + boidVelocities[15], entities[i].velocity.y = p0.velocity.y + boidVelocities[1] + boidVelocities[4] + boidVelocities[7] + boidVelocities[10] + boidVelocities[13] + boidVelocities[16], entities[i].velocity.z = p0.velocity.z + boidVelocities[2] + boidVelocities[5] + boidVelocities[8] + boidVelocities[11] + boidVelocities[14] + boidVelocities[17];
          if (isNaN(entities[i].velocity.x))
            console.error(p0, i, groupCount, p0.position, p0.velocity, swirlVec, attractorVec);
        }
      return entities;
    } }, movement: { tag: "movement", lastTime: performance.now(), setupEntities: (self2, entities) => {
      for (const key in entities) {
        const entity = entities[key];
        if (entity.components) {
          if (!entity.components[self2.tag])
            continue;
        }
        self2.setupEntity(self2, entity);
      }
    }, setupEntity: (self2, entity) => {
      if (!("mass" in entity))
        entity.mass = 1;
      if (!("fixed" in entity))
        entity.fixed = false;
      if (!entity.force)
        entity.force = { x: 0, y: 0, z: 0 };
      if (!("mass" in entity))
        entity.mass = 1;
      if (!("gravity" in entity))
        entity.gravity = -9.81;
      if (!entity.acceleration)
        entity.acceleration = { x: 0, y: 0, z: 0 };
      if (!entity.velocity)
        entity.velocity = { x: 0, y: 0, z: 0 };
      if (!("maxSpeed" in entity))
        entity.maxSpeed = 3;
      if (!entity.position)
        entity.position = { x: 0, y: 0, z: 0 };
      return entity;
    }, operator: (self2, origin, entities) => {
      let now = performance.now();
      let timeStep = (now - self2.lastTime) * 1e-3;
      self2.lastTime = now;
      for (const key in entities) {
        const entity = entities[key];
        if (entity.components) {
          if (!entity.components[self2.tag])
            continue;
        }
        if (entity.fixed)
          continue;
        if (typeof entity.force === "object" && entity.mass) {
          if (entity.force.x) {
            entity.acceleration.x += entity.force.x / entity.mass;
            entity.force.x = 0;
          }
          if (entity.force.y) {
            entity.acceleration.y += entity.force.y / entity.mass;
            entity.force.y = 0;
          }
          if (entity.force.z) {
            entity.acceleration.z += entity.force.z / entity.mass + entity.gravity;
            entity.force.z = 0;
          }
        }
        if (typeof entity.acceleration === "object") {
          if (entity.drag) {
            if (entity.acceleration.x)
              entity.acceleration.x -= entity.acceleration.x * entity.drag * timeStep;
            if (entity.acceleration.y)
              entity.acceleration.y -= entity.acceleration.y * entity.drag * timeStep;
            if (entity.acceleration.z)
              entity.acceleration.z -= entity.acceleration.z * entity.drag * timeStep;
          }
          if (entity.acceleration.x)
            entity.velocity.x += entity.acceleration.x * timeStep;
          if (entity.acceleration.y)
            entity.velocity.y += entity.acceleration.y * timeStep;
          if (entity.acceleration.z)
            entity.velocity.z += entity.acceleration.z * timeStep;
          if (entity.maxSpeed > 0) {
            let magnitude = Systems.collision.magnitude(entity.velocity);
            if (magnitude > entity.maxSpeed) {
              let scalar = entity.maxSpeed / magnitude;
              entity.velocity.x *= scalar;
              entity.velocity.y *= scalar;
              entity.velocity.z *= scalar;
            }
          }
        }
        if (typeof entity.velocity === "object") {
          if (entity.velocity.x)
            entity.position.x += entity.velocity.x * timeStep;
          if (entity.velocity.y)
            entity.position.y += entity.velocity.y * timeStep;
          if (entity.velocity.z)
            entity.position.z += entity.velocity.z * timeStep;
        }
      }
      return entities;
    } } };
    var import_sjcl = __toESM2(require_sjcl());
    var E2EEService = class extends Service {
      constructor(options, keys, secureKeys, secret) {
        super(options);
        this.name = "e2ee";
        this.securedKeys = false;
        this.addKey = (key, _id) => {
          if (!_id)
            _id = `key${Math.floor(Math.random() * 1e15)}`;
          if (this.securedKeys && this.secret && this.encryptedkeys) {
            let decrypted = JSON.parse(import_sjcl.default.decrypt(this.secret, this.encryptedkeys));
            decrypted[_id] = { key, _id };
            this.encryptedkeys = import_sjcl.default.encrypt(this.secret, decrypted).cipher;
            return this.encryptedkeys;
          } else
            this.keys[_id] = { key, _id };
          return this.keys[_id];
        };
        this.encryptRoute = (message, keyId) => {
          if (typeof message === "object")
            message = JSON.stringify(message);
          let key;
          if (this.securedKeys && this.secret && this.encryptedkeys) {
            let decrypted = JSON.parse(import_sjcl.default.decrypt(this.secret, this.encryptedkeys));
            if (decrypted[keyId]?.key) {
              message = import_sjcl.default.encrypt(this.secret, decrypted[keyId].key).cipher;
            }
          } else {
            if (this.keys[keyId]) {
              if (!key)
                key = keyId;
              message = this.encrypt(message, key);
            }
          }
          message = { route: "decryptRoute", args: [message, keyId] };
          return message;
        };
        this.decryptRoute = (message, keyId) => {
          let decryptedMessage = message;
          if (typeof message === "object") {
            if (!keyId) {
              if (typeof message.origin === "string")
                keyId = message.origin;
              else if (typeof message.keyId === "string")
                keyId = message.keyId;
            }
            if (keyId) {
              let key;
              if (this.securedKeys && this.secret && this.encryptedkeys) {
                let decrypted = JSON.parse(import_sjcl.default.decrypt(this.secret, this.encryptedkeys));
                if (decrypted[keyId]?.key) {
                  decryptedMessage = import_sjcl.default.decrypt(this.secret, decrypted[keyId].key);
                  return decryptedMessage;
                }
              } else {
                if (this.keys[keyId])
                  key = this.keys[keyId].key;
                if (key)
                  decryptedMessage = this.decrypt(message.args, key);
              }
            }
          } else {
            let key;
            if (this.securedKeys && this.secret && this.encryptedkeys) {
              let decrypted = JSON.parse(import_sjcl.default.decrypt(this.secret, this.encryptedkeys));
              if (decrypted[keyId]?.key) {
                decryptedMessage = import_sjcl.default.decrypt(this.secret, decrypted[keyId].key);
                return decryptedMessage;
              }
            } else {
              if (this.keys[keyId])
                key = this.keys[keyId].key;
              if (key)
                decryptedMessage = this.decrypt(message, key);
            }
          }
          return decryptedMessage;
        };
        this.transmit = (message, keyId) => {
          if (!keyId) {
            keyId = Object.keys(this.keys)[0];
          }
          message = this.encryptRoute(message, keyId);
          return this.handleServiceMessage(message);
        };
        this.receive = (message, keyId) => {
          if (!keyId) {
            keyId = Object.keys(this.keys)[0];
          }
          message = this.decryptRoute(message, keyId);
          if (typeof message === "string") {
            let substr = message.substring(0, 8);
            if (substr.includes("{") || substr.includes("[")) {
              if (substr.includes("\\"))
                message = message.replace(/\\/g, "");
              if (message[0] === '"') {
                message = message.substring(1, message.length - 1);
              }
              ;
              message = JSON.parse(message);
            }
          }
          if (typeof message === "object") {
            if (typeof message.method === "string") {
              return this.handleMethod(message.route, message.method, message.args);
            } else if (typeof message.route === "string") {
              return this.handleServiceMessage(message);
            } else if (typeof message.node === "string" || message.node instanceof GraphNode) {
              return this.handleGraphNodeCall(message.node, message.args, message.origin);
            } else if (this.keepState) {
              if (message.route)
                this.setState({ [message.route]: message.args });
              if (message.node)
                this.setState({ [message.node]: message.args });
            }
          } else
            return message;
        };
        this.routes = { encryptRoute: this.encryptRoute, decryptRoute: this.decryptRoute, encrypt: this.encrypt, decrypt: this.decrypt, generateSecret: E2EEService.generateSecret, addKey: this.addKey };
        if (keys) {
          if (secureKeys && secret) {
            this.securedKeys = true;
            this.encryptedkeys = import_sjcl.default.encrypt(secret, JSON.stringify(keys)).cipher;
            this.secret = secret;
          } else
            Object.assign(this.keys, keys);
        }
      }
      static generateSecret() {
        return import_sjcl.default.codec.base64.fromBits(import_sjcl.default.random.randomWords(8, 10));
      }
      encrypt(message, key) {
        message = import_sjcl.default.encrypt(key, message).cipher;
        return message;
      }
      decrypt(message, key) {
        message = import_sjcl.default.decrypt(key, message);
        return message;
      }
    };
    var http = __toESM2(require("http"));
    var https = __toESM2(require("https"));
    var fs = __toESM2(require("fs"));
    var path = __toESM2(require("path"));
    var HTTPbackend2 = class extends Service {
      constructor(options, settings) {
        super(options);
        this.name = "http";
        this.debug = false;
        this.servers = {};
        this.mimeTypes = { ".html": "text/html", ".htm": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".txt": "text/plain", ".png": "image/png", ".jpg": "image/jpg", ".jpeg": "image/jpg", ".gif": "image/gif", ".svg": "image/svg+xml", ".xhtml": "application/xhtml+xml", ".bmp": "image/bmp", ".wav": "audio/wav", ".mp3": "audio/mpeg", ".mp4": "video/mp4", ".xml": "application/xml", ".webm": "video/webm", ".webp": "image/webp", ".weba": "audio/webm", ".woff": "font/woff", "woff2": "font/woff2", ".ttf": "application/font-ttf", ".eot": "application/vnd.ms-fontobject", ".otf": "application/font-otf", ".wasm": "application/wasm", ".zip": "application/zip", ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", ".tif": "image/tiff", ".sh": "application/x-sh", ".csh": "application/x-csh", ".rar": "application/vnd.rar", ".ppt": "application/vnd.ms-powerpoint", ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation", ".odt": "application/vnd.oasis.opendocument.text", ".ods": "application/vnd.oasis.opendocument.spreadsheet", ".odp": "application/vnd.oasis.opendocument.presentation", ".mpeg": "video/mpeg", ".mjs": "text/javascript", ".cjs": "text/javascript", ".jsonld": "application/ld+json", ".jar": "application/java-archive", ".ico": "image/vnd.microsoft.icon", ".gz": "application/gzip", "epub": "application/epub+zip", ".doc": "application/msword", ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document", ".csv": "text/csv", ".avi": "video/x-msvideo", ".aac": "audio/aac", ".mpkg": "application/vnd.apple.installer+xml", ".oga": "audio/ogg", ".ogv": "video/ogg", "ogx": "application/ogg", ".php": "application/x-httpd-php", ".rtf": "application/rtf", ".swf": "application/x-shockwave-flash", ".7z": "application/x-7z-compressed", ".3gp": "video/3gpp" };
        this.onStarted = (protocol, host, port) => {
          console.log(`\u{1F431} Node server running at 
            ${protocol}://${host}:${port}/`);
        };
        this.setupServer = (options2 = { protocol: "http", host: "localhost", port: 8080, startpage: "index.html" }, requestListener, onStarted) => {
          if (options2.pages) {
            for (const key in options2.pages) {
              if (typeof options2.pages[key] === "string") {
                this.addPage(`${options2.port}/${key}`, options2.pages[key]);
              } else if (typeof options2.pages[key] === "object") {
                if (options2.pages[key].template) {
                  options2.pages[key].get = options2.pages[key].template;
                }
                if (key !== "_all")
                  this.load({ [`${options2.port}/${key}`]: options2.pages[key] });
              }
            }
          }
          if (options2.protocol === "https") {
            return this.setupHTTPSserver(options2, requestListener, onStarted);
          } else
            return this.setupHTTPserver(options2, requestListener, onStarted);
        };
        this.setupHTTPserver = (options2 = { host: "localhost", port: 8080, startpage: "index.html", errpage: void 0 }, requestListener, onStarted = () => {
          this.onStarted("http", options2.host, options2.port);
        }) => {
          const host = options2.host;
          const port = options2.port;
          options2.protocol = "http";
          if (!host || !port)
            return;
          const address = `${host}:${port}`;
          if (this.servers[address])
            this.terminate(this.servers[address]);
          if (!("keepState" in options2))
            options2.keepState = true;
          const served = { server: void 0, type: "httpserver", address, ...options2 };
          if (!requestListener)
            requestListener = (request, response) => {
              let received = { args: { request, response }, method: request.method, served };
              let url = request.url.slice(1);
              if (!url)
                url = "/";
              if (options2.pages) {
                if (typeof options2.pages[url] === "object") {
                  if (options2.pages[url].onrequest) {
                    if (typeof options2.pages[url].onrequest === "string") {
                      options2.pages[url].onrequest = this.nodes.get(options2.pages[url].onrequest);
                    }
                    if (typeof options2.pages[url].onrequest === "object") {
                      if (options2.pages[url].onrequest.run) {
                        options2.pages[url].onrequest.run(options2.pages[url], request, response);
                      }
                    } else if (typeof options2.pages[url].onrequest === "function") {
                      options2.pages[url].onrequest(this, options2.pages[url], request, response);
                    }
                  }
                  if (options2.pages[url].redirect) {
                    url = options2.pages[url].redirect;
                    received.redirect = url;
                  }
                }
              }
              received.route = url;
              this.receive(received);
            };
          const server = http.createServer(requestListener);
          served.server = server;
          this.servers[address] = served;
          return new Promise((resolve, reject) => {
            server.on("error", (err) => {
              console.error("Server error:", err.toString());
              reject(err);
            });
            server.listen(port, host, () => {
              onStarted();
              resolve(served);
            });
          });
        };
        this.setupHTTPSserver = (options2 = { host: "localhost", port: 8080, startpage: "index.html", certpath: "cert.pem", keypath: "key.pem", passphrase: "encryption", errpage: void 0 }, requestListener, onStarted = () => {
          this.onStarted("https", options2.host, options2.port);
        }) => {
          const host = options2.host;
          const port = options2.port;
          options2.protocol = "https";
          if (!host || !port || !options2.certpath || !options2.keypath)
            return;
          if (this.servers[`${host}:${port}`])
            this.terminate(this.servers[`${host}:${port}`]);
          var opts = { key: fs.readFileSync(options2.keypath), cert: fs.readFileSync(options2.certpath), passphrase: options2.passphrase };
          if (!("keepState" in options2))
            options2.keepState = true;
          const served = { server: void 0, type: "httpserver", address: `${host}:${port}`, ...options2 };
          if (!requestListener)
            requestListener = (request, response) => {
              let received = { args: { request, response }, method: request.method, served };
              let url = request.url.slice(1);
              if (!url)
                url = "/";
              if (options2.pages) {
                if (typeof options2.pages[url] === "object") {
                  if (options2.pages[url].redirect) {
                    url = options2.pages[url].redirect;
                    received.redirect = url;
                  }
                  if (options2.pages[url].onrequest) {
                    if (typeof options2.pages[url].onrequest === "string") {
                      options2.pages[url].onrequest = this.nodes.get(options2.pages[url].onrequest);
                    }
                    if (typeof options2.pages[url].onrequest === "object") {
                      if (options2.pages[url].onrequest.run) {
                        options2.pages[url].onrequest.run(options2.pages[url], request, response);
                      }
                    } else if (typeof options2.pages[url].onrequest === "function") {
                      options2.pages[url].onrequest(this, options2.pages[url], request, response);
                    }
                  }
                }
              }
              received.route = url;
              this.receive(received);
            };
          const server = https.createServer(opts, requestListener);
          served.server = server;
          this.servers[`${host}:${port}`] = served;
          return new Promise((resolve, reject) => {
            server.on("error", (err) => {
              console.error("Server error:", err.toString());
              reject(err);
            });
            server.listen(port, host, () => {
              onStarted();
              resolve(served);
            });
          });
        };
        this.transmit = (message, options2, ondata, onend) => {
          let input = message;
          if (typeof input === "object")
            input = JSON.stringify(input);
          if (typeof options2 === "string" && message)
            return this.post(options2, message);
          else if (typeof options2 === "string")
            return this.get(options2);
          if (!options2) {
            let server = this.servers[Object.keys(this.servers)[0]];
            options2 = { protocol: server.protocol, host: server.host, port: server.port, method: "POST", path: message.route, headers: { "Content-Type": "application/json", "Content-Length": input.length } };
          } else if (!options2.headers) {
            options2.headers = { "Content-Type": "application/json", "Content-Length": input.length };
          }
          return this.request(options2, input, ondata, onend);
        };
        this.withResult = (response, result, message) => {
          if (result && !response.writableEnded && !response.destroyed) {
            let mimeType = "text/plain";
            if (typeof result === "string") {
              let extname2 = path.extname(result);
              if (extname2 && fs.existsSync(path.join(process.cwd(), result))) {
                mimeType = this.mimeTypes[extname2] || "application/octet-stream";
                result = fs.readFileSync(path.join(process.cwd(), result));
                if (mimeType === "text/html" && (message.served?.pages?._all || message.served?.pages?.[message.route])) {
                  result = this.injectPageCode(result.toString(), message.route, message.served);
                }
              }
              if (typeof result === "string" && result.includes("<") && result.includes(">") && result.indexOf("<") < result.indexOf(">")) {
                if (message?.served?.pages?._all || message?.served?.pages?.[message.route]) {
                  result = this.injectPageCode(result, message.route, message.served);
                }
                response.writeHead(200, { "Content-Type": "text/html" });
                response.end(result, "utf-8");
                return;
              }
            } else if (typeof result === "object") {
              result = JSON.stringify(result);
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
                let route;
                if (served) {
                  let rt = `${served.port}/${message.route}`;
                  if (this.nodes.get(rt))
                    route = rt;
                }
                if (!route && this.nodes.get(message.route))
                  route = message.route;
                if (route) {
                  let res;
                  if (message.method) {
                    res = this.handleMethod(route, message.method, void 0, message.origin);
                  } else if (message.node) {
                    res = this.handleGraphNodeCall(message.node, void 0);
                  } else
                    res = this.handleServiceMessage({ route, args: void 0, method: message.method, origin: message.origin });
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
        this.request = (options2, send, ondata, onend) => {
          let client = http;
          if (options2.protocol?.includes("https")) {
            client = https;
          }
          delete options2.protocol;
          const req = client.request(options2, (res) => {
            if (ondata)
              res.on("data", ondata);
            if (onend)
              res.on("end", onend);
          });
          if (options2.headers) {
            for (const head in options2.headers) {
              req.setHeader(head, options2.headers[head]);
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
          let host, port, path3;
          let split = urlstring.split("/");
          split.forEach((s) => {
            if (s.includes(":")) {
              let ss = s.split(":");
              host = ss[0];
              port = ss[1];
            }
          });
          if (split.length > 3) {
            path3 = split.slice(3).join("/");
          }
          let req = this.request({ protocol, host, port, path: path3, method: "POST", headers }, data);
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
        this.addPage = (path3, template) => {
          if (typeof template === "string") {
            if (!template.includes("<html"))
              template = "<!DOCTYPE html><html>" + template + "</html>";
          }
          if (typeof this.routes[path3] === "object") {
            this.routes[path3].get = template;
            this.nodes.get(path3).get = template;
          } else
            this.load({ [path3]: { get: template } });
        };
        this.addHTML = (path3, template) => {
          if (typeof template === "string") {
            if (!template.includes("<") || !template.includes(">"))
              template = "<div>" + template + "</div>";
          }
          if (typeof this.routes[path3] === "object") {
            this.routes[path3].get = template;
            this.nodes.get(path3).get = template;
          } else
            this.load({ [path3]: { get: template } });
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
        this.routes = { setupServer: this.setupServer, terminate: (path3) => {
          if (path3)
            for (const address in this.servers) {
              if (address.includes(`${path3}`)) {
                this.terminate(this.servers[address]);
                delete this.servers[address];
              }
            }
        }, GET: this.get, POST: this.post, addPage: this.addPage, addHTML: this.addHTML, buildPage: this.buildPage, getRequestBody: this.getRequestBody, hotreload: (socketURL = `http://localhost:8080/wss`) => {
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
        }, pwa: (serviceWorkerPath, manifestPath) => {
        } };
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
    var import_better_sse = __toESM2(require_build());
    var SSEbackend2 = class extends Service {
      constructor(options) {
        super(options);
        this.name = "sse";
        this.debug = false;
        this.servers = {};
        this.eventsources = {};
        this.setupSSE = (options2) => {
          const server = options2.server;
          let path3 = options2.path;
          if (this.servers[path3]) {
            return false;
          }
          const channel = (0, import_better_sse.createChannel)();
          let sse = { type: "sse", channel, sessions: {}, ...options2 };
          this.servers[path3] = sse;
          if (!sse.onconnectionclose)
            sse.onconnectionclose = (session, sse2, id, req, res) => {
              delete sse2.sessions[id];
            };
          let onRequest = (req, res) => {
            if (req.method === "GET" && req.url?.includes(path3)) {
              if (this.debug)
                console.log("SSE Request", path3);
              (0, import_better_sse.createSession)(req, res).then((session) => {
                channel.register(session);
                let _id = `sse${Math.floor(Math.random() * 1e15)}`;
                sse.sessions[_id] = session;
                this.eventsources[_id] = { _id, session, served: sse };
                session.push(JSON.stringify({ route: "setId", args: _id }));
                if (options2.onconnectionclose)
                  session.on("close", () => {
                    options2.onconnectionclose(session, sse, _id, req, res);
                  });
                if (sse.onconnection) {
                  sse.onconnection(session, sse, _id, req, res);
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
              if (req.url.indexOf(path3) > -1) {
                if (!this.servers[path3]) {
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
        this.transmit = (data, path3, channel) => {
          if (typeof data === "object") {
            if (data.route) {
              if (!path3) {
                let keys = Object.keys(this.servers);
                if (keys.length > 0) {
                  let evs = this.servers[keys[0]];
                  if (evs.channels?.includes(data.route)) {
                    path3 = evs.path;
                    channel = data.route;
                  } else if (evs.channels?.includes(data.origin)) {
                    path3 = evs.path;
                    channel = data.origin;
                  }
                }
                if (!path3 && data.route) {
                  if (this.servers[data.route])
                    path3 = data.route;
                }
                if (!path3 && typeof data.origin === "string") {
                  if (this.servers[data.origin])
                    path3 = data.origin;
                }
              }
            }
            data = JSON.stringify(data);
          }
          if (!path3)
            path3 = Object.keys(this.servers)[0];
          if (path3 && channel) {
            this.servers[path3].channel.broadcast(data, channel);
          } else if (path3) {
            let sessions = this.servers[path3].sessions;
            for (const s in sessions) {
              if (sessions[s].isConnected)
                sessions[s].push(data);
              else {
                delete sessions[s];
              }
            }
          }
        };
        this.terminate = (path3) => {
          if (typeof path3 === "object")
            delete this.servers[path3.path];
          else if (typeof path3 === "string")
            delete this.servers[path3];
        };
        this.routes = { setupSSE: this.setupSSE, terminate: this.terminate };
        this.load(this.routes);
      }
    };
    var import_stream = __toESM2(require_stream(), 1);
    var import_receiver = __toESM2(require_receiver(), 1);
    var import_sender = __toESM2(require_sender(), 1);
    var import_websocket = __toESM2(require_websocket(), 1);
    var import_websocket_server = __toESM2(require_websocket_server(), 1);
    var wrapper_default = import_websocket.default;
    var WSSbackend2 = class extends Service {
      constructor(options) {
        super(options);
        this.name = "wss";
        this.debug = false;
        this.servers = {};
        this.sockets = {};
        this.setupWSS = (options2) => {
          const host = options2.host;
          const port = options2.port;
          let path3 = options2.path;
          const server = options2.server;
          delete options2.server;
          if (!("keepState" in options2))
            options2.keepState = true;
          let opts = { host, port };
          if (typeof options2.serverOptions)
            Object.assign(opts, options2.serverOptions);
          const wss = new import_websocket_server.default(opts);
          let address = `${host}:${port}/`;
          if (path3) {
            if (path3.startsWith("/"))
              path3 = path3.substring(1);
            address += path3;
          }
          this.servers[address] = { type: "wss", wss, clients: {}, address, ...options2 };
          wss.on("connection", (ws, request) => {
            if (this.debug)
              console.log(`New socket connection on ${address}`);
            let clientId = `socket${Math.floor(Math.random() * 1e12)}`;
            this.servers[address].clients[clientId] = ws;
            ws.send(JSON.stringify({ route: "setId", args: clientId }));
            if (options2.onconnection)
              options2.onconnection(ws, request, this.servers[address], clientId);
            if (!options2.onmessage)
              options2.onmessage = (data) => {
                if (data instanceof Buffer)
                  data = data.toString();
                const result = this.receive(data, wss, this.servers[address]);
                if (options2.keepState)
                  this.setState({ [address]: result });
              };
            if (options2.onmessage)
              ws.on("message", (data) => {
                options2.onmessage(data, ws, this.servers[address]);
              });
            if (options2.onconnectionclosed)
              ws.on("close", (code, reason) => {
                if (options2.onconnectionclosed)
                  options2.onconnectionclosed(code, reason, ws, this.servers[address], clientId);
              });
          });
          wss.on("error", (err) => {
            if (this.debug)
              console.log("Socket Error:", err);
            if (options2.onerror)
              options2.onerror(err, wss, this.servers[address]);
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
                  if (options2.onupgrade)
                    options2.onupgrade(ws, this.servers[address], request, socket, head);
                  this.servers[addr].wss.emit("connection", ws, request);
                });
              }
            }
          };
          server.addListener("upgrade", onUpgrade);
          wss.on("close", () => {
            server.removeListener("upgrade", onUpgrade);
            if (options2.onclose)
              options2.onclose(wss, this.servers[address]);
            else
              console.log(`wss closed: ${address}`);
          });
          return this.servers[address];
        };
        this.openWS = (options2) => {
          let protocol = options2.protocol;
          if (!protocol)
            protocol = "wss";
          let address = `${protocol}://${options2.host}`;
          if (options2.port)
            address += ":" + options2.port;
          if (!options2.path || options2.path?.startsWith("/"))
            address += "/";
          if (options2.path)
            address += options2.path;
          const socket = new wrapper_default(address);
          if (!("keepState" in options2))
            options2.keepState = true;
          if (options2.onmessage)
            socket.on("message", (data) => {
              options2.onmessage(data, socket, this.sockets[address]);
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
                        if (options2.keepState) {
                          this.setState({ [address]: data2 });
                        }
                      });
                    }
                  }
                }
              }
              this.receive(data, socket, this.sockets[address]);
              if (options2.keepState)
                this.setState({ [address]: data });
            };
            socket.on("message", socketonmessage);
            options2.onmessage = socketonmessage;
          }
          if (options2.onopen)
            socket.on("open", () => {
              options2.onopen(socket, this.sockets[address]);
            });
          if (options2.onclose)
            socket.on("close", (code, reason) => {
              options2.onclose(code, reason, socket, this.sockets[address]);
            });
          if (options2.onerror)
            socket.on("error", (er) => {
              options2.onerror(er, socket, this.sockets[address]);
            });
          let send = (message) => {
            return this.transmit(message, socket);
          };
          let post = (route, args, origin, method) => {
            let message = { route, args };
            if (origin)
              message.origin = origin;
            if (method)
              message.method = method;
            return this.transmit(message, socket);
          };
          let run = (route, args, origin, method) => {
            return new Promise((res, rej) => {
              let callbackId = Math.random();
              let req = { route: "runRequest", args: [{ route, args }, options2._id, callbackId] };
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
              let req = { route: "runRequest", args: [message, options2._id, callbackId] };
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
          this.sockets[address] = { type: "socket", socket, address, send, post, request, run, subscribe, unsubscribe, ...options2 };
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
        this.routes = { setupWSS: this.setupWSS, openWS: this.openWS, closeWS: this.closeWS, request: this.request, runRequest: this.runRequest, terminate: this.terminate, subscribeSocket: this.subscribeSocket, subscribeToSocket: this.subscribeToSocket, unsubscribe: this.unsubscribe };
        this.load(this.routes);
      }
      subscribeSocket(route, socket) {
        if (typeof socket === "string") {
          if (this.sockets[socket])
            socket = this.sockets[socket].socket;
          else {
            for (const prop in this.servers) {
              if (this.servers[prop].clients[socket])
                socket = this.servers[prop].clients[socket];
            }
          }
        }
        if (typeof socket === "object")
          return this.subscribe(route, (res) => {
            if (socket.readyState === socket.OPEN) {
              if (res instanceof Promise) {
                res.then((r) => {
                  socket.send(JSON.stringify({ args: r, callbackId: route }));
                });
              } else {
                socket.send(JSON.stringify({ args: res, callbackId: route }));
              }
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
    var import_child_process = require("child_process");
    var import_path = __toESM2(require("path"));
    var CMDService = class extends Service {
      constructor(options) {
        super(options);
        this.customRoutes = { "process": (route, routeKey, routes) => {
          if (route.command) {
            this.createProcess(route);
          }
          return route;
        } };
        this.createProcess = (properties) => {
          let newprocess = properties;
          if (!newprocess.command)
            newprocess.command = "node";
          if (!newprocess.args)
            newprocess.args = [import_path.default.join(process.cwd(), "node_modules", "graphscript-node", "services", "cmd", "childprocess.js")];
          if (newprocess.command) {
            let p;
            if (!newprocess.options) {
              newprocess.options = { shell: true, stdio: "inherit" };
            }
            newprocess.controller = new AbortController();
            newprocess.options = Object.assign({ signal: newprocess.controller.signal, env: process.env, cwd: process.cwd() }, newprocess.options);
            if (newprocess.tag)
              newprocess._id = newprocess.tag;
            else {
              newprocess._id = `process${Math.floor(Math.random() * 1e15)}`;
              newprocess.tag = newprocess._id;
            }
            if (typeof newprocess.command === "string") {
              if (newprocess.command.includes(".js")) {
                p = (0, import_child_process.fork)(newprocess.command, newprocess.args, newprocess.options);
              } else
                p = (0, import_child_process.spawn)(newprocess.command, newprocess.args ? newprocess.args : [], newprocess.options);
              if (p instanceof import_child_process.ChildProcess) {
                if (p.stderr) {
                  if (newprocess.onerror) {
                    p.stderr.on("data", newprocess.onerror);
                  } else
                    p.stderr.on("data", console.error);
                }
                if (p.stdout) {
                  if (newprocess.stdout) {
                    p.stdout.on("data", newprocess.stdout);
                  } else
                    p.stdout.on("data", (data) => {
                      let str = data.toString();
                      this.receive(str);
                      this.setState({ [newprocess._id]: str });
                    });
                }
                if (newprocess.onclose) {
                  p.on("close", newprocess.onclose);
                }
                newprocess.process = p;
                newprocess.controller = new AbortController();
                newprocess.send = (data) => {
                  return p.send(data);
                };
                newprocess.request = (message, origin, method) => {
                  return this.request(message, newprocess._id, origin, method);
                };
                newprocess.post = (route, args, origin, method) => {
                  let message = { route, args };
                  if (origin)
                    message.origin = origin;
                  if (method)
                    message.method = method;
                  return p.send(JSON.stringify(message));
                };
                newprocess.run = (route, args, origin, method) => {
                  let message = { route, args };
                  if (origin)
                    message.origin = origin;
                  if (method)
                    message.method = method;
                  return this.request(message, newprocess._id);
                };
                newprocess.subscribe = (route, callback) => {
                  return this.subscribeToProcess(route, newprocess._id, callback);
                };
                newprocess.unsubscribe = (route, sub) => {
                  return newprocess.run("unsubscribe", [route, sub]);
                };
                this.processes[newprocess._id] = newprocess;
              }
            }
          }
          return newprocess;
        };
        this.abort = (childprocess) => {
          if (childprocess.controller)
            childprocess.controller.abort();
          else
            childprocess.kill();
          return true;
        };
        this.send = (childprocess, data) => {
          return childprocess.send(data);
        };
        this.request = (message, processId, origin, method) => {
          let childprocess = this.processes[processId].process;
          return new Promise((res, rej) => {
            let callbackId = Math.random();
            let req = { route: "runRequest", args: [message, callbackId] };
            if (origin)
              req.origin = origin;
            if (method)
              req.method = method;
            let ondata = (data) => {
              let str = data.toString();
              if (str.includes("{")) {
                let parsed = JSON.parse(str);
                if (parsed.callbackId === callbackId) {
                  childprocess.removeListener("data", ondata);
                  res(parsed.args);
                }
              }
            };
            childprocess.addListener("data", ondata);
            childprocess.send(req);
          });
        };
        this.runRequest = (message, callbackId, childprocess) => {
          let res = this.receive(message);
          if (typeof childprocess === "string")
            childprocess = this.processes[childprocess].process;
          if (res instanceof Promise) {
            res.then((v) => {
              res = { args: v, callbackId };
              if (childprocess instanceof import_child_process.ChildProcess)
                childprocess.send(JSON.stringify(res));
              else
                process.stdout.write(JSON.stringify(res));
            });
          } else {
            res = { args: res, callbackId };
            if (childprocess instanceof import_child_process.ChildProcess)
              childprocess.send(JSON.stringify(res));
            else
              process.stdout.write(JSON.stringify(res));
          }
          return res;
        };
        this.routes = { createProcess: this.createProcess, abort: this.abort, send: this.send, request: this.request, runRequest: this.runRequest, subscribeProcess: this.subscribeProcess, subscribeToProcess: this.subscribeToProcess, unsubscribe: this.unsubscribe };
        this.load(this.routes);
        if (process.stdin) {
          process.stdin.on("data", (data) => {
            let str = data.toString();
            this.receive(str);
          });
        }
      }
      subscribeProcess(route, childprocess) {
        if (typeof childprocess === "string" && this.processes[childprocess]) {
          childprocess = this.processes[childprocess].process;
        }
        return this.subscribe(route, (res) => {
          if (res instanceof Promise) {
            res.then((r) => {
              childprocess.send(JSON.stringify({ args: r, callbackId: route }));
            });
          } else {
            childprocess.send(JSON.stringify({ args: res, callbackId: route }));
          }
        });
      }
      subscribeToProcess(route, processId, callback) {
        if (typeof processId === "string" && this.processes[processId]) {
          this.subscribe(processId, (res) => {
            if (res?.callbackId === route) {
              if (!callback)
                this.setState({ [processId]: res.args });
              else if (typeof callback === "string") {
                this.run(callback, res.args);
              } else
                callback(res.args);
            }
          });
          return this.processes[processId].request(JSON.stringify({ route: "subscribeSocket", args: [route, processId] }));
        }
      }
    };
    var import_web_worker = __toESM2(require_node());
    var WorkerService = class extends Service {
      constructor(options) {
        super(options);
        this.name = "worker";
        this.workers = {};
        this.threadRot = 0;
        this.customRoutes = { "worker": (route, routeKey, routes) => {
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
        } };
        this.customChildren = { "worker": (child, childRouteKey, parent, routes, checked) => {
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
        } };
        this.addWorker = (options2) => {
          let worker;
          if (!options2._id)
            options2._id = `worker${Math.floor(Math.random() * 1e15)}`;
          if (options2.url)
            worker = new import_web_worker.default(options2.url);
          else if (options2.port) {
            worker = options2.port;
          } else if (this.workers[options2._id]) {
            if (this.workers[options2._id].port)
              worker = this.workers[options2._id].port;
            else
              worker = this.workers[options2._id].worker;
          }
          if (!worker)
            return;
          let send = (message, transfer) => {
            return this.transmit(message, worker, transfer);
          };
          let post = (route, args, transfer, origin, method) => {
            let message = { route, args };
            if (origin)
              message.origin = origin;
            if (method)
              message.method = method;
            return this.transmit(message, worker, transfer);
          };
          let run = (route, args, transfer, origin, method) => {
            return new Promise((res, rej) => {
              let callbackId = Math.random();
              let req = { route: "runRequest", args: [{ route, args }, options2._id, callbackId] };
              if (origin)
                req.args[0].origin = origin;
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
          let request = (message, transfer, origin, method) => {
            return new Promise((res, rej) => {
              let callbackId = Math.random();
              let req = { route: "runRequest", args: [message, options2._id, callbackId] };
              if (origin)
                req.origin = origin;
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
            return this.subscribeToWorker(route, options2._id, callback);
          };
          let unsubscribe = (route, sub) => {
            return run("unsubscribe", [route, sub]);
          };
          if (!options2.onmessage)
            options2.onmessage = (ev) => {
              this.receive(ev.data);
              this.setState({ [options2._id]: ev.data });
            };
          if (!options2.onerror) {
            options2.onerror = (ev) => {
              console.error(ev.data);
            };
          }
          worker.onmessage = options2.onmessage;
          worker.onerror = options2.onerror;
          this.workers[options2._id] = { worker, send, post, run, request, subscribe, unsubscribe, ...options2 };
          return this.workers[options2._id];
        };
        this.toObjectURL = (scriptTemplate) => {
          const { Blob } = require("buffer");
          let blob = new Blob([scriptTemplate], { type: "text/javascript" });
          return URL.createObjectURL(blob);
        };
        this.transmit = (message, worker, transfer) => {
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
        this.request = (message, workerId, transfer, origin, method) => {
          let worker = this.workers[workerId].worker;
          return new Promise((res, rej) => {
            let callbackId = Math.random();
            let req = { route: "runRequest", args: [message, callbackId] };
            if (origin)
              req.origin = origin;
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
                  worker.postMessage({ args: r, route });
                else if (globalThis.postMessage)
                  globalThis.postMessage({ args: r, callbackId: route });
              });
            } else {
              if (worker?.postMessage)
                worker.postMessage({ args: res, route });
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
        this.routes = { addWorker: this.addWorker, toObjectURL: this.toObjectURL, request: this.request, runRequest: this.runRequest, establishMessageChannel: this.establishMessageChannel, subscribeWorker: this.subscribeWorker, subscribeToWorker: this.subscribeToWorker, unsubscribe: this.unsubscribe };
        this.load(this.routes);
        if (typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope) {
          globalThis.onmessage = (ev) => {
            let result = this.receive(ev.data);
            if (this.keepState)
              this.setState({ [ev.data.origin ? ev.data.origin : "worker"]: result });
          };
        }
      }
      transferFunction(worker, fn, fnName) {
        if (!fnName)
          fnName = fn.name;
        return worker.request({ route: "setRoute", args: [fn.toString(), fnName] });
      }
      transferClass(worker, cls, className) {
        if (!className)
          className = cls.name;
        return worker.request({ route: "receiveClass", args: [cls.toString(), className] });
      }
    };
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
          let loaded = this.service.load(service, includeClassName, routeFormat, customRoutes, customChildren);
          if (linkServices) {
            this.syncServices();
          }
          return loaded;
        };
        this.syncServices = () => {
          for (const name in this.services) {
            this.service.nodes.forEach((n) => {
              if (this.services[name]?.nodes) {
                if (!this.services[name].nodes.get(n.tag)) {
                  this.services[name].nodes.set(n.tag, n);
                }
              }
            });
          }
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
        this.getEndpointInfo = (path3, service) => {
          if (!path3)
            return void 0;
          let testpath = (path4, service2) => {
            if (this.services[service2]) {
              if (this.services[service2].rtc?.[path4]) {
                return this.services[service2].rtc[path4];
              } else if (this.services[service2].servers?.[path4]) {
                return this.services[service2].servers[path4];
              } else if (this.services[service2].sockets?.[path4]) {
                return this.services[service2].sockets[path4];
              } else if (this.services[service2].eventsources?.[path4]) {
                return this.services[service2].eventsources[path4];
              } else if (this.services[service2].workers?.[path4]) {
                return this.services[service2].workers[path4];
              }
            }
            return void 0;
          };
          if (service) {
            let found = testpath(path3, service);
            if (found)
              return { endpoint: found, service };
          }
          for (const s in this.services) {
            let found = testpath(path3, s);
            if (found)
              return { endpoint: found, service: s };
          }
          return void 0;
        };
        this.pipeFastest = (source, destination, origin, method, callback, services2 = this.services) => {
          for (const service in services2) {
            if (services2[service].rtc) {
              return this.pipe(source, destination, "webrtc", origin, method, callback);
            }
            if (services2[service].eventsources) {
              let keys = Object.keys(services2[service].eventsources);
              if (keys[0]) {
                if (this.services[service].eventsources[keys[0]].sessions)
                  return this.pipe(source, destination, "sse", origin, method, callback);
              }
            }
            if (services2[service].sockets) {
              return this.pipe(source, destination, "wss", origin, method, callback);
            }
            if (services2[service].servers) {
              return this.pipe(source, destination, "http", origin, method, callback);
            }
            if (services2[service].workers) {
              return this.pipe(source, destination, "worker", origin, method, callback);
            }
          }
          return false;
        };
        this.getFirstRemoteEndpoint = (services2 = this.services) => {
          let serviceInfo;
          for (const service in services2) {
            if (services2[service].rtc) {
              serviceInfo = services2[service].rtc;
            }
            if (services2[service].eventsources && !serviceInfo) {
              let keys2 = Object.keys(services2[service].eventsources);
              if (keys2[0]) {
                if (this.services[service].eventsources[keys2[0]]?.sessions)
                  serviceInfo = services2[service].eventsources;
              }
            }
            if (services2[service].sockets && !serviceInfo) {
              serviceInfo = services2[service].sockets;
            }
            if (services2[service].servers && !serviceInfo) {
              serviceInfo = services2[service].servers;
            }
            if (services2[service].workers && !serviceInfo) {
              serviceInfo = services2[service].workers;
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
        this.streamFunctions = { allLatestValues: (prop, setting) => {
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
        }, latestValue: (prop, setting) => {
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
        } };
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
          this.streamSettings[streamName] = { object, settings };
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
        this.defaultRoutes = { getEndpointInfo: this.getEndpointInfo, pipeOnce: this.pipeOnce, pipeFastest: this.pipeFastest, setStream: this.setStream, removeStream: this.removeStream, updateStreamData: this.updateStreamData, addStreamFunc: this.addStreamFunc, setStreamFunc: this.setStreamFunc, sendAll: this.sendAll, streamLoop: { operator: this.streamLoop, loop: 10 } };
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
    var UserRouter2 = class extends Router {
      constructor(services, options) {
        super(services, options);
        this.users = {};
        this.sessions = { private: {}, shared: {} };
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
            for (const path3 in connections.eventsources) {
              if (connections.eventsources[path3]._id) {
                for (const s in this.services.sse.eventsources) {
                  if (this.services.sse.eventsources[s]._id === connections.eventsources[path3]._id) {
                    connections.eventsources[path3] = this.services.sse.eventsources[s];
                    break;
                  } else if (this.services.sse.eventsources[s].sessions?.[connections.eventsources[path3]._id]) {
                    connections.eventsources[path3] = { session: this.services.sse.eventsources[s].sessions[connections.eventsources[path3]._id], _id: path3 };
                    break;
                  } else if (this.services.sse.eventsources[s].session?.[connections.eventsources[path3]._id]) {
                    connections.eventsources[path3] = this.services.sse.eventsources[s];
                    break;
                  }
                }
              }
              if (!connections.eventsources[path3].source && !connections.eventsources[path3].sessions && !connections.eventsources[path3].session) {
                connections.eventsources[path3] = this.run("sse/openSSE", connections.eventsources[path3]);
              }
              if (connections.eventsources[path3].source) {
                if (connections.onmessage)
                  connections.eventsources[path3].source.addEventListener("message", connections.onmessage);
                if (connections.onclose)
                  connections.eventsources[path3].source.addEventListener("close", connections.onclose);
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
            for (const path3 in user.eventsources) {
              if (user.eventsources[path3].source || user.eventsources[path3].sessions) {
                this.run("sse/terminate", path3);
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
        this.updateUser = (user, options2) => {
          if (typeof user === "string")
            user = this.users[user];
          if (!user)
            return false;
          this._initConnections(options2);
          if (options2._id !== user._id) {
            delete this.users[user._id];
            user._id = options2._id;
            this.users[user._id] = user;
          }
          this.recursivelyAssign(this.users[user._id], options2);
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
          let connectionInfo = { _id: user._id };
          if (user.sockets) {
            connectionInfo.sockets = {};
            for (const prop in user.sockets) {
              if (user.sockets[prop]._id)
                connectionInfo.sockets[prop] = { _id: user.sockets[prop]._id, host: user.sockets[prop].host, port: user.sockets[prop].port, path: user.sockets[prop].path, address: user.sockets[prop].address };
            }
          }
          if (user.eventsources) {
            connectionInfo.eventsources = {};
            for (const prop in user.eventsources) {
              if (user.eventsources[prop]._id)
                connectionInfo.eventsources[prop] = { _id: user.eventsources[prop]._id, url: user.eventsources[prop].url };
            }
          }
          if (user.webrtc) {
            connectionInfo.webrtc = {};
            for (const prop in user.webrtc) {
              if (user.webrtc[prop]._id)
                connectionInfo.webrtc[prop] = { _id: user.webrtc[prop]._id, icecandidate: user.webrtc[prop].icecandidate };
            }
          }
          if (user.servers) {
            connectionInfo.servers = {};
            for (const prop in user.servers) {
              if (user.servers[prop].server)
                connectionInfo.servers[prop] = { host: user.servers[prop].host, port: user.servers[prop].port, protocol: user.servers[prop].protocol, address: user.servers[prop].address };
            }
          }
          if (user.wss) {
            connectionInfo.wss = {};
            for (const prop in user.wss) {
              if (user.wss[prop]._id)
                connectionInfo.wss[prop] = { host: user.wss[prop].host, port: user.wss[prop].port, path: user.wss[prop].path, address: user.wss[prop].address };
            }
          }
          if (user.sessions) {
            connectionInfo.sessions = {};
            for (const prop in user.sessions) {
              if (user.sessions[prop]._id)
                connectionInfo.sessions[prop] = { _id: user.sessions[prop]._id, type: user.sessions[prop].type, users: user.sessions[prop].users };
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
        this.openPrivateSession = (options2 = {}, userId) => {
          if (typeof userId === "object")
            userId = userId._id;
          if (!options2._id) {
            options2._id = `private${Math.floor(Math.random() * 1e15)}`;
            if (this.sessions.private[options2._id]) {
              delete options2._id;
              this.openPrivateSession(options2, userId);
            }
          }
          if (options2._id) {
            if (userId) {
              if (!options2.settings)
                options2.settings = { listener: userId, source: userId, propnames: { latency: true }, admins: { [userId]: true }, ownerId: userId };
              if (!options2.settings.listener)
                options2.settings.listener = userId;
              if (!options2.settings.source)
                options2.settings.source = userId;
              if (!this.users[userId].sessions)
                this.users[userId].sessions = {};
              this.users[userId].sessions[options2._id] = options2;
            }
            if (!options2.data)
              options2.data = {};
            if (this.sessions.private[options2._id]) {
              return this.updateSession(options2, userId);
            } else if (options2.settings?.listener && options2.settings.source)
              this.sessions.private[options2._id] = options2;
          }
          return options2;
        };
        this.openSharedSession = (options2, userId) => {
          if (typeof userId === "object")
            userId = userId._id;
          if (!options2._id) {
            options2._id = `shared${Math.floor(Math.random() * 1e15)}`;
            if (this.sessions.shared[options2._id]) {
              delete options2._id;
              this.openSharedSession(options2, userId);
            }
          }
          if (options2._id) {
            if (typeof userId === "string") {
              if (!options2.settings)
                options2.settings = { name: "shared", propnames: { latency: true }, users: { [userId]: true }, admins: { [userId]: true }, ownerId: userId };
              if (!options2.settings.users)
                options2.settings.users = { [userId]: true };
              if (!options2.settings.admins)
                options2.settings.admins = { [userId]: true };
              if (!options2.settings.ownerId)
                options2.settings.ownerId = userId;
              if (!this.users[userId].sessions)
                this.users[userId].sessions = {};
              this.users[userId].sessions[options2._id] = options2;
            } else if (!options2.settings)
              options2.settings = { name: "shared", propnames: { latency: true }, users: {} };
            if (!options2.data)
              options2.data = { private: {}, shared: {} };
            if (!options2.settings.name)
              options2.name = options2.id;
            if (this.sessions.shared[options2._id]) {
              return this.updateSession(options2, userId);
            } else
              this.sessions.shared[options2._id] = options2;
          }
          return options2;
        };
        this.updateSession = (options2, userId) => {
          if (typeof userId === "object")
            userId = userId._id;
          let session;
          if (options2._id && typeof userId === "string") {
            session = this.sessions.private[options2._id];
            if (!session)
              session = this.sessions.shared[options2._id];
            if (this.sesh.private[options2._id]) {
              let sesh = this.sessions.shared[options2._id];
              if (sesh.settings && (sesh?.settings.source === userId || sesh.settings.admins?.[userId] || sesh.settings.moderators?.[userId] || sesh.settings.ownerId === userId)) {
                return Object.assign(this.session.shared[options2._id], options2);
              }
            } else if (options2.settings?.source) {
              return this.openPrivateSession(options2, userId);
            } else
              return this.openSharedSession(options2, userId);
          }
          return false;
        };
        this.joinSession = (sessionId, userId, options2) => {
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
              if (!options2?.settings?.password)
                return false;
              if (options2.settings.password !== sesh.settings.password)
                return false;
            }
            sesh.settings.users[userId] = true;
            if (!this.users[userId].sessions)
              this.users[userId].sessions = {};
            this.users[userId].sessions[sessionId] = sesh;
            if (options2) {
              return this.updateSession(options2, userId);
            }
            ;
            return sesh;
          } else if (options2?.source || options2?.listener)
            return this.openPrivateSession(options2, userId);
          else if (options2)
            return this.openSharedSession(options2, userId);
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
          if (typeof userId === "object")
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
          if (typeof session === "object") {
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
          let updates = { private: {}, shared: {} };
          for (const session in this.sessions.private) {
            const sesh = this.sessions.private[session];
            const updateObj = { _id: sesh._id, settings: { listener: sesh.listener, source: sesh.source }, data: {} };
            if (!this.users[sesh.source]) {
              delete this.sessions.private[session];
              break;
            }
            if (sesh.settings && sesh.data) {
              for (const prop in sesh.settings.propnames) {
                if (this.users[sesh.source][prop]) {
                  if (this.sessions.private[session].data) {
                    if (typeof sesh.data[prop] === "object") {
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
            const updateObj = { _id: sesh._id, settings: { name: sesh.name }, data: {} };
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
                else if (!users[u].private)
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
                  else if (!users[u].shared)
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
        this.receiveSessionUpdates = (self2 = this, origin, update) => {
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
        this.getUpdatedUserData = (user) => {
          const updateObj = {};
          for (const key in user.sessions) {
            let s = user.sessions[key];
            if (s.settings.users[user._id] || s.settings.source === user._id) {
              if (!s.settings.spectators?.[user._id]) {
                if (s.settings.host === user._id) {
                  for (const prop in s.settings.hostprops) {
                    if (!updateObj[prop] && prop in user) {
                      if (s.data.shared?.[user._id] && prop in s.data.shared?.[user._id]) {
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
                        if (typeof user[prop] === "object" && prop in s.data) {
                          if (stringifyFast(s.data[prop]) !== stringifyFast(user[prop]))
                            updateObj[prop] = user[prop];
                        } else if (s.data[prop] !== user[prop])
                          updateObj[prop] = user[prop];
                      } else {
                        if (s.data.shared?.[user._id] && prop in s.data.shared?.[user._id]) {
                          if (typeof user[prop] === "object") {
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
          return updateObj;
        };
        this.userUpdateCheck = (user) => {
          if (user.sessions) {
            const updateObj = this.getUpdatedUserData(user);
            if (Object.keys(updateObj).length > 0) {
              if (user.send)
                user.send({ route: "setUser", args: updateObj, origin: user._id });
              return updateObj;
            }
          }
          return void 0;
        };
        this.routes = { runAs: this.runAs, pipeAs: this.pipeAs, addUser: this.addUser, setUser: (self2, origin, update) => {
          return this.setUser(origin, update);
        }, removeUser: this.removeUser, updateUser: this.updateUser, getConnectionInfo: this.getConnectionInfo, getSessionInfo: this.getSessionInfo, openPrivateSession: this.openPrivateSession, openSharedSession: this.openSharedSession, joinSession: this.joinSession, leaveSession: this.leaveSession, subscribeToSession: this.subscribeToSession, transmitSessionUpdates: this.transmitSessionUpdates, receiveSessionUpdates: this.receiveSessionUpdates, swapHost: this.swapHost, getupdateUserData: this.getUpdatedUserData, userUpdateCheck: this.userUpdateCheck, userUpdateLoop: { operator: this.userUpdateCheck, loop: 10 }, sessionLoop: { operator: this.sessionLoop, loop: 10 } };
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
  }
});

// backend.ts
var import_graphscript_node = __toESM(require_index_node());
function exitHandler(options, exitCode) {
  if (exitCode || exitCode === 0)
    console.log("SERVER EXITED WITH CODE: ", exitCode);
  if (options.exit)
    process.exit();
}
process.on("exit", exitHandler.bind(null, { cleanup: true }));
process.on("SIGINT", exitHandler.bind(null, { exit: true }));
var router = new import_graphscript_node.UserRouter([
  import_graphscript_node.HTTPbackend,
  import_graphscript_node.WSSbackend,
  import_graphscript_node.SSEbackend
]);
console.log(router);
router.run("http.setupServer", {
  protocol: "http",
  host: "localhost",
  port: 8080,
  pages: {
    "/": {
      template: `<div>Nice...</div>`,
      onrequest: (self2, node, req, res) => {
        node.get = `<h3>Hello World!! The Time: ${new Date(Date.now()).toISOString()}</h3>`;
      }
    },
    "config": {
      template: "tinybuild.config.js"
    },
    "home": {
      redirect: "/"
    },
    "redir": {
      redirect: "https://google.com"
    },
    "test": "<div>TEST</div>",
    _all: {
      inject: {
        hotreload: "ws://localhost:8080/hotreload"
      }
    }
  }
}).then((served) => {
  console.log(router.services.http.nodes.keys());
  const socketserver = router.run("wss.setupWSS", {
    server: served.server,
    host: served.host,
    port: 8081,
    path: "wss",
    onconnection: (ws, req, serverinfo, id) => {
      ws.send("Hello from WSS!");
    }
  });
  const hotreload = router.run("wss.setupWSS", {
    server: served.server,
    host: served.host,
    port: 7e3,
    path: "hotreload",
    onconnection: (ws) => {
      ws.send("Hot reload port opened!");
    }
  });
  const sseinfo = router.run("sse.setupSSE", {
    server: served.server,
    path: "sse",
    channels: ["test"],
    onconnection: (session, sseinfo2, id, req, res) => {
      console.log("pushing sse!");
      session.push("Hello from SSE!");
      sseinfo2.channels.forEach((c) => sseinfo2.channel.broadcast("SSE connection at " + req.headers.host + "/" + req.url, c));
    }
  });
});
