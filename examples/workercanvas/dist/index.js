(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined")
      return require.apply(this, arguments);
    throw new Error('Dynamic require of "' + x + '" is not supported');
  });
  var __commonJS = (cb, mod) => function __require2() {
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
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };

  // ../../services/e2ee/sjcl.js
  var require_sjcl = __commonJS({
    "../../services/e2ee/sjcl.js"(exports, module) {
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
            u(this, d.subarray(
              16 * e,
              16 * (e + 1)
            )), e += 1;
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
        c = h.clamp(
          c,
          8 * (15 - f)
        );
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
        m = k(m, h.clamp(b.slice(c), p).concat([
          0,
          0,
          0
        ]));
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
        e = [
          0,
          0,
          0,
          0
        ];
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
      sjcl2.prng.prototype = {
        randomWords: function(a, b) {
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
        },
        setDefaultParanoia: function(a, b) {
          if (0 === a && "Setting paranoia=0 will ruin your security; use it only for testing" !== b)
            throw new sjcl2.exception.invalid("Setting paranoia=0 will ruin your security; use it only for testing");
          this.M = a;
        },
        addEntropy: function(a, b, c) {
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
        },
        isReady: function(a) {
          a = this.T[void 0 !== a ? a : this.M];
          return this.o && this.o >= a ? this.m[0] > this.ba && new Date().valueOf() > this.Z ? this.J | this.I : this.I : this.f >= a ? this.J | this.u : this.u;
        },
        getProgress: function(a) {
          a = this.T[a ? a : this.M];
          return this.o >= a ? 1 : this.f > a ? 1 : this.f / a;
        },
        startCollectors: function() {
          if (!this.D) {
            this.a = { loadTimeCollector: B(this, this.ma), mouseCollector: B(this, this.oa), keyboardCollector: B(this, this.la), accelerometerCollector: B(this, this.ea), touchCollector: B(this, this.qa) };
            if (window.addEventListener)
              window.addEventListener(
                "load",
                this.a.loadTimeCollector,
                false
              ), window.addEventListener("mousemove", this.a.mouseCollector, false), window.addEventListener("keypress", this.a.keyboardCollector, false), window.addEventListener("devicemotion", this.a.accelerometerCollector, false), window.addEventListener("touchmove", this.a.touchCollector, false);
            else if (document.attachEvent)
              document.attachEvent("onload", this.a.loadTimeCollector), document.attachEvent("onmousemove", this.a.mouseCollector), document.attachEvent("keypress", this.a.keyboardCollector);
            else
              throw new sjcl2.exception.bug("can't attach event");
            this.D = true;
          }
        },
        stopCollectors: function() {
          this.D && (window.removeEventListener ? (window.removeEventListener("load", this.a.loadTimeCollector, false), window.removeEventListener("mousemove", this.a.mouseCollector, false), window.removeEventListener("keypress", this.a.keyboardCollector, false), window.removeEventListener("devicemotion", this.a.accelerometerCollector, false), window.removeEventListener("touchmove", this.a.touchCollector, false)) : document.detachEvent && (document.detachEvent("onload", this.a.loadTimeCollector), document.detachEvent(
            "onmousemove",
            this.a.mouseCollector
          ), document.detachEvent("keypress", this.a.keyboardCollector)), this.D = false);
        },
        addEventListener: function(a, b) {
          this.K[a][this.ga++] = b;
        },
        removeEventListener: function(a, b) {
          var c, d, e = this.K[a], f = [];
          for (d in e)
            e.hasOwnProperty(d) && e[d] === b && f.push(d);
          for (c = 0; c < f.length; c++)
            d = f[c], delete e[d];
        },
        la: function() {
          C(this, 1);
        },
        oa: function(a) {
          var b, c;
          try {
            b = a.x || a.clientX || a.offsetX || 0, c = a.y || a.clientY || a.offsetY || 0;
          } catch (d) {
            c = b = 0;
          }
          0 != b && 0 != c && this.addEntropy([b, c], 2, "mouse");
          C(this, 0);
        },
        qa: function(a) {
          a = a.touches[0] || a.changedTouches[0];
          this.addEntropy([a.pageX || a.clientX, a.pageY || a.clientY], 1, "touch");
          C(this, 0);
        },
        ma: function() {
          C(this, 2);
        },
        ea: function(a) {
          a = a.accelerationIncludingGravity.x || a.accelerationIncludingGravity.y || a.accelerationIncludingGravity.z;
          if (window.orientation) {
            var b = window.orientation;
            "number" === typeof b && this.addEntropy(b, 1, "accelerometer");
          }
          a && this.addEntropy(a, 2, "accelerometer");
          C(this, 0);
        }
      };
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
          if (G = "undefined" !== typeof module && module.exports) {
            try {
              H = __require("crypto");
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
      "undefined" !== typeof module && module.exports && (module.exports = sjcl2);
      "function" === typeof define && define([], function() {
        return sjcl2;
      });
    }
  });

  // ../../node_modules/web-worker/cjs/browser.js
  var require_browser = __commonJS({
    "../../node_modules/web-worker/cjs/browser.js"(exports, module) {
      module.exports = Worker;
    }
  });

  // ../../services/EventHandler.ts
  var EventHandler = class {
    constructor(data) {
      this.pushToState = {};
      this.data = {};
      this.triggers = {};
      this.setState = (updateObj) => {
        Object.assign(this.data, updateObj);
        for (const prop of Object.getOwnPropertyNames(updateObj)) {
          if (this.triggers[prop])
            this.triggers[prop].forEach((obj) => obj.onchange(this.data[prop]));
        }
        return this.data;
      };
      this.setValue = (key, value) => {
        this.data[key] = value;
        if (this.triggers[key])
          this.triggers[key].forEach((obj) => obj.onchange(this.data[key]));
      };
      this.subscribeTrigger = (key, onchange) => {
        if (key) {
          if (!this.triggers[key]) {
            this.triggers[key] = [];
          }
          let l = this.triggers[key].length;
          this.triggers[key].push({ sub: l, onchange });
          return this.triggers[key].length - 1;
        } else
          return void 0;
      };
      this.unsubscribeTrigger = (key, sub) => {
        let triggers = this.triggers[key];
        if (triggers) {
          if (!sub)
            delete this.triggers[key];
          else {
            let sub2 = void 0;
            let obj = triggers.find((o, i) => {
              if (o.sub === sub2) {
                sub2 = i;
                return true;
              }
            });
            if (obj)
              triggers.splice(sub2, 1);
            if (this.onRemoved)
              this.onRemoved(obj);
            return true;
          }
        }
      };
      this.subscribeTriggerOnce = (key, onchange) => {
        let sub;
        let changed = (value) => {
          onchange(value);
          this.unsubscribeTrigger(key, sub);
        };
        sub = this.subscribeTrigger(key, changed);
      };
      this.getTrigger = (key, sub) => {
        for (const s in this.triggers[key]) {
          if (this.triggers[key][s].sub === sub)
            return this.triggers[key][s];
        }
      };
      if (typeof data === "object")
        this.data = data;
    }
  };

  // ../../Graph.ts
  var state = new EventHandler();
  var GraphNode = class {
    constructor(properties, parent, graph) {
      this.__node = {
        tag: `node${Math.floor(Math.random() * 1e15)}`,
        unique: `${Math.random()}`,
        state
      };
      this.__subscribe = (callback, key, subInput, bound, target) => {
        const subscribeToFunction = (k, setTarget = (callback2, target2) => callback2, triggerCallback = callback) => {
          let sub = this.__node.state.subscribeTrigger(k, triggerCallback);
          let trigger = this.__node.state.getTrigger(k, sub);
          trigger.source = this.__node.tag;
          if (key)
            trigger.key = key;
          trigger.target = setTarget(callback);
          if (bound)
            trigger.bound = bound;
          return sub;
        };
        const subscribeToGraph = (callback2) => {
          let fn = this.__node.graph.get(callback2);
          if (!fn && callback2.includes(".")) {
            let n = this.__node.graph.get(callback2.substring(0, callback2.lastIndexOf(".")));
            let key2 = callback2.substring(callback2.lastIndexOf(".") + 1);
            if (n && typeof n[key2] === "function")
              callback2 = (...args) => {
                return n[key2](...args);
              };
          }
        };
        if (key) {
          if (!this.__node.localState) {
            this.__addLocalState(this);
          }
          if (typeof callback === "string") {
            if (typeof this[callback] === "function")
              callback = this[callback];
            else if (this.__node.graph)
              subscribeToGraph(callback);
          }
          let sub;
          let k = subInput ? this.__node.unique + "." + key + "input" : this.__node.unique + "." + key;
          if (typeof callback === "function")
            sub = subscribeToFunction(k);
          else if (callback?.__node)
            sub = subscribeToFunction(
              k,
              (callback2, target2) => target2 ? target2 : callback2.__node.unique,
              (state2) => {
                if (callback.__operator)
                  callback.__operator(state2);
              }
            );
          return sub;
        } else {
          if (typeof callback === "string") {
            if (this.__node.graph)
              callback = this.__node.graph.get(callback);
            else
              callback = this.__node.graph.nodes.get(callback);
          }
          let sub;
          let k = subInput ? this.__node.unique + "input" : this.__node.unique;
          if (typeof callback === "function")
            sub = subscribeToFunction(k);
          else if (callback?.__node)
            sub = subscribeToFunction(
              k,
              (callback2, target2) => target2 ? target2 : callback2.__node.unique,
              (state2) => {
                if (callback.__operator)
                  callback.__operator(state2);
              }
            );
          return sub;
        }
      };
      this.__unsubscribe = (sub, key, subInput) => {
        if (key) {
          return this.__node.state.unsubscribeTrigger(subInput ? this.__node.unique + "." + key + "input" : this.__node.unique + "." + key, sub);
        } else
          return this.__node.state.unsubscribeTrigger(subInput ? this.__node.unique + "input" : this.__node.unique, sub);
      };
      this.__setOperator = (fn) => {
        fn = fn.bind(this);
        this.__operator = (...args) => {
          if (this.__node.inputState)
            this.__node.state.setValue(this.__node.unique + "input", args);
          let result = fn(...args);
          if (this.__node.state.triggers[this.__node.unique]) {
            if (typeof result?.then === "function") {
              result.then((res) => {
                if (res !== void 0)
                  this.__node.state.setValue(this.__node.unique, res);
              }).catch(console.error);
            } else if (result !== void 0)
              this.__node.state.setValue(this.__node.unique, result);
          }
          return result;
        };
        return this.__operator;
      };
      this.__proxyObject = (obj) => {
        let allProps = getAllProperties(obj);
        for (const k of allProps) {
          if (typeof this[k] === "undefined") {
            if (typeof obj[k] === "function") {
              this[k] = (...args) => {
                if (this.__node.inputState)
                  this.__node.state.setValue(this.__node.unique + "." + k + "input", args);
                let result = obj[k](...args);
                if (this.__node.state.triggers[this.__node.unique + "." + k]) {
                  if (typeof result?.then === "function") {
                    result.then((res) => {
                      this.__node.state.setValue(this.__node.unique + "." + k, res);
                    }).catch(console.error);
                  } else
                    this.__node.state.setValue(this.__node.unique + "." + k, result);
                }
                return result;
              };
            } else {
              let definition = {
                get: () => {
                  return obj[k];
                },
                set: (value) => {
                  obj[k] = value;
                  if (this.__node.state.triggers[this.__node.unique + "." + k])
                    this.__node.state.setValue(this.__node.unique + "." + k, value);
                },
                enumerable: true,
                configurable: true
              };
              Object.defineProperty(this, k, definition);
            }
          }
        }
      };
      let orig = properties;
      if (typeof properties === "function") {
        properties = {
          __operator: properties,
          __node: {
            forward: true,
            tag: properties.name
          }
        };
      } else if (typeof properties === "string") {
        if (graph?.get(properties)) {
          properties = graph.get(properties);
        }
      }
      if (!properties.__node.initial)
        properties.__node.initial = orig;
      if (typeof properties === "object") {
        if (properties.__props) {
          if (typeof properties.__props === "function")
            properties.__props = new properties.__props();
          if (typeof properties.__props === "object") {
            this.__proxyObject(properties.__props);
          }
        }
        if (typeof properties.__node === "string") {
          if (graph?.get(properties.__node.tag)) {
            properties = graph.get(properties.__node.tag);
          } else
            properties.__node = {};
        } else if (!properties.__node)
          properties.__node = {};
        if (!properties.__parent && parent)
          properties.__parent = parent;
        if (graph) {
          properties.__node.graph = graph;
        }
        if (properties.__operator) {
          if (typeof properties.__operator === "string") {
            if (graph) {
              let n = graph.get(properties.__operator);
              if (n)
                properties.__operator = n.__operator;
              if (!properties.__node.tag && properties.__operator.name)
                properties.__node.tag = properties.__operator.name;
            }
          }
          if (typeof properties.__operator === "function")
            properties.__operator = this.__setOperator(properties.__operator);
        }
        if (!properties.__node.tag) {
          if (properties.__operator?.name)
            properties.__node.tag = properties.__operator.name;
          else
            properties.__node.tag = `node${Math.floor(Math.random() * 1e15)}`;
        }
        if (parent?.__node && !(parent instanceof Graph || properties instanceof Graph))
          properties.__node.tag = parent.__node.tag + "." + properties.__node.tag;
        if (parent instanceof Graph && properties instanceof Graph) {
          if (properties.__node.loaders)
            Object.assign(parent.__node.loaders ? parent.__node.loaders : {}, properties.__node.loaders);
          if (parent.__node.mapGraphs) {
            properties.__node.nodes.forEach((n) => {
              parent.set(properties.__node.tag + "." + n.__node.tag, n);
            });
            let ondelete = () => {
              properties.__node.nodes.forEach((n) => {
                parent.__node.nodes.delete(properties.__node.tag + "." + n.__node.tag);
              });
            };
            this.__addOndisconnected(ondelete);
          }
        }
        properties.__node = Object.assign(this.__node, properties.__node);
        let keys = Object.getOwnPropertyNames(properties);
        for (const key of keys) {
          this[key] = properties[key];
        }
        if (properties.__operator && parent instanceof GraphNode && parent.__operator) {
          let sub = parent.__subscribe(this);
          let ondelete = () => {
            parent?.__unsubscribe(sub);
          };
          this.__addOndisconnected(ondelete);
        } else if (typeof properties.default === "function" && !properties.__operator) {
          let fn = properties.default.bind(this);
          this.default = (...args) => {
            if (this.__node.inputState)
              this.__node.state.setValue(this.__node.unique + "input", args);
            let result = fn(...args);
            if (typeof result?.then === "function") {
              result.then((res) => {
                if (res !== void 0)
                  this.__node.state.setValue(this.__node.unique, res);
              }).catch(console.error);
            } else if (result !== void 0)
              this.__node.state.setValue(this.__node.unique, result);
            return result;
          };
          properties.default = this.default;
        }
        if (properties instanceof Graph)
          this.__node.source = properties;
      }
    }
    __addLocalState(props) {
      if (!props)
        return;
      if (!this.__node.localState) {
        this.__node.localState = {};
      }
      let localState = this.__node.localState;
      for (let k in props) {
        if (this.__props && this.__props[k])
          continue;
        if (typeof props[k] === "function") {
          if (!k.startsWith("_")) {
            let fn = props[k].bind(this);
            props[k] = (...args) => {
              if (this.__node.inputState)
                this.__node.state.setValue(this.__node.unique + "." + k + "input", args);
              let result = fn(...args);
              if (typeof result?.then === "function") {
                if (this.__node.state.triggers[this.__node.unique + "." + k])
                  result.then((res) => {
                    this.__node.state.setValue(this.__node.unique + "." + k, res);
                  }).catch(console.error);
              } else if (this.__node.state.triggers[this.__node.unique + "." + k])
                this.__node.state.setValue(this.__node.unique + "." + k, result);
              return result;
            };
            this[k] = props[k];
          }
        } else {
          localState[k] = props[k];
          let definition = {
            get: () => {
              return localState[k];
            },
            set: (v) => {
              localState[k] = v;
              if (this.__node.state.triggers[this.__node.unique + "." + k])
                this.__node.state.setValue(this.__node.unique + "." + k, v);
            },
            enumerable: true,
            configurable: true
          };
          Object.defineProperty(this, k, definition);
          if (typeof this.__node.initial === "object") {
            let dec = Object.getOwnPropertyDescriptor(this.__node.initial, k);
            if (dec === void 0 || dec?.configurable) {
              Object.defineProperty(this.__node.initial, k, definition);
            }
          }
        }
      }
    }
    __addOnconnected(callback) {
      if (Array.isArray(this.__ondisconnected)) {
        this.__onconnected.push(callback);
      } else if (typeof this.__onconnected === "function") {
        this.__onconnected = [callback, this.__onconnected];
      } else
        this.__onconnected = callback;
    }
    __addOndisconnected(callback) {
      if (Array.isArray(this.__ondisconnected)) {
        this.__ondisconnected.push(callback);
      } else if (typeof this.__ondisconnected === "function") {
        this.__ondisconnected = [callback, this.__ondisconnected];
      } else
        this.__ondisconnected = callback;
    }
    __callConnected(node = this) {
      if (typeof this.__onconnected === "function") {
        this.__onconnected(this);
      } else if (Array.isArray(this.__onconnected)) {
        this.__onconnected.forEach((o) => {
          o(this);
        });
      }
    }
    __callDisconnected(node = this) {
      if (typeof this.__ondisconnected === "function")
        this.__ondisconnected(this);
      else if (Array.isArray(this.__ondisconnected)) {
        this.__ondisconnected.forEach((o) => {
          o(this);
        });
      }
    }
  };
  var Graph = class {
    constructor(options) {
      this.__node = {
        tag: `graph${Math.floor(Math.random() * 1e15)}`,
        nodes: /* @__PURE__ */ new Map(),
        state
      };
      this.init = (options) => {
        if (options) {
          recursivelyAssign(this.__node, options);
          if (options.tree)
            this.setTree(options.tree);
        }
      };
      this.setTree = (tree) => {
        this.__node.tree = Object.assign(this.__node.tree ? this.__node.tree : {}, tree);
        let cpy = Object.assign({}, tree);
        if (cpy.__node)
          delete cpy.__node;
        let listeners = this.recursiveSet(cpy, this, void 0, tree);
        if (tree.__node) {
          if (!tree.__node.tag)
            tree.__node._tag = `tree${Math.floor(Math.random() * 1e15)}`;
          else if (!this.get(tree.__node.tag)) {
            let node = new GraphNode(tree, this, this);
            for (const l in this.__node.loaders) {
              this.__node.loaders[l](node, this, this, tree, tree, tree.__node.tag);
            }
            this.set(node.__node.tag, node);
            if (node.__listeners) {
              listeners[node.__node.tag] = node.__listeners;
            }
          }
        }
        this.setListeners(listeners);
        return cpy;
      };
      this.setLoaders = (loaders2, replace) => {
        if (replace)
          this.__node.loaders = loaders2;
        else
          Object.assign(this.__node.loaders, loaders2);
        return this.__node.loaders;
      };
      this.add = (properties, parent) => {
        let listeners = {};
        if (typeof parent === "string")
          parent = this.get(parent);
        if (typeof properties === "function")
          properties = { __operator: properties };
        else if (typeof properties === "string")
          properties = this.__node.tree[properties];
        let p = Object.assign({}, properties);
        if (!p.__node)
          p.__node = {};
        p.__node.initial = properties;
        if (typeof properties === "object" && (!p?.__node?.tag || !this.get(p.__node.tag))) {
          let node = new GraphNode(p, parent, this);
          for (const l in this.__node.loaders) {
            this.__node.loaders[l](node, parent, this, this.__node.tree, properties);
          }
          this.set(node.__node.tag, node);
          this.__node.tree[node.__node.tag] = properties;
          if (node.__listeners) {
            listeners[node.__node.tag] = node.__listeners;
          }
          if (node.__children) {
            node.__children = Object.assign({}, node.__children);
            this.recursiveSet(node.__children, node, listeners, node.__children);
          }
          this.setListeners(listeners);
          node.__callConnected();
          return node;
        }
        return;
      };
      this.recursiveSet = (t, parent, listeners = {}, origin) => {
        let keys = Object.getOwnPropertyNames(origin);
        for (const key of keys) {
          if (key.includes("__"))
            continue;
          let p = origin[key];
          if (Array.isArray(p))
            continue;
          if (typeof p === "function")
            p = { __operator: p };
          else if (typeof p === "string")
            p = this.__node.tree[p];
          else if (typeof p === "boolean")
            p = this.__node.tree[key];
          if (typeof p === "object") {
            p = Object.assign({}, p);
            if (!p.__node)
              p.__node = {};
            if (!p.__node.tag)
              p.__node.tag = key;
            p.__node.initial = t[key];
            if (this.get(p.__node.tag) && !(parent?.__node && this.get(parent.__node.tag + "." + p.__node.tag)) || parent?.__node && this.get(parent.__node.tag + "." + p.__node.tag))
              continue;
            let node = new GraphNode(p, parent, this);
            for (const l in this.__node.loaders) {
              this.__node.loaders[l](node, parent, this, t, t[key], key);
            }
            t[key] = node;
            this.__node.tree[node.__node.tag] = p;
            this.set(node.__node.tag, node);
            if (node.__listeners) {
              listeners[node.__node.tag] = node.__listeners;
            } else if (node.__children) {
              node.__children = Object.assign({}, node.__children);
              this.recursiveSet(node.__children, node, listeners, node.__children);
            }
            node.__callConnected();
          }
        }
        return listeners;
      };
      this.remove = (node, clearListeners = true) => {
        this.unsubscribe(node);
        if (typeof node === "string")
          node = this.get(node);
        if (node instanceof GraphNode) {
          this.delete(node.__node.tag);
          delete this.__node.tree[node.__node.tag];
          if (clearListeners) {
            this.clearListeners(node);
          }
          node.__callDisconnected();
          const recursiveRemove = (t) => {
            for (const key in t) {
              this.unsubscribe(t[key]);
              this.delete(t[key].__node.tag);
              delete this.__node.tree[t[key].__node.tag];
              this.delete(key);
              delete this.__node.tree[key];
              t[key].__node.tag = t[key].__node.tag.substring(t[key].__node.tag.lastIndexOf(".") + 1);
              if (clearListeners) {
                this.clearListeners(t[key]);
              }
              t[key].__callDisconnected();
              if (t[key].__children) {
                recursiveRemove(t[key].__children);
              }
            }
          };
          if (node.__children) {
            recursiveRemove(node.__children);
          }
        }
        if (node?.__node.tag && node?.__parent) {
          delete node?.__parent;
          node.__node.tag = node.__node.tag.substring(node.__node.tag.indexOf(".") + 1);
        }
        return node;
      };
      this.run = (node, ...args) => {
        if (typeof node === "string") {
          let nd = this.get(node);
          if (!nd && node.includes(".")) {
            nd = this.get(node.substring(0, node.lastIndexOf(".")));
            if (typeof nd?.[node.substring(node.lastIndexOf(".") + 1)] === "function")
              return nd[node.substring(node.lastIndexOf(".") + 1)](...args);
          } else if (nd?.__operator)
            return nd.__operator(...args);
        }
        if (node?.__operator) {
          return node?.__operator(...args);
        }
      };
      this.setListeners = (listeners) => {
        for (const key in listeners) {
          let node = this.get(key);
          if (typeof listeners[key] === "object") {
            for (const k in listeners[key]) {
              let n = this.get(k);
              let sub;
              if (typeof listeners[key][k] !== "object")
                listeners[key][k] = { callback: listeners[key][k] };
              if (typeof listeners[key][k].callback === "function")
                listeners[key][k].callback = listeners[key][k].callback.bind(node);
              if (typeof node.__listeners !== "object")
                node.__listeners = {};
              if (!n) {
                let tag = k.substring(0, k.lastIndexOf("."));
                n = this.get(tag);
                if (n) {
                  sub = this.subscribe(n, listeners[key][k].callback, k.substring(k.lastIndexOf(".") + 1), listeners[key][k].inputState, key, k);
                  if (typeof node.__listeners[k] !== "object")
                    node.__listeners[k] = { callback: listeners[key][k].callback, inputState: listeners[key][k]?.inputState };
                  node.__listeners[k].sub = sub;
                }
              } else {
                sub = this.subscribe(n, listeners[key][k].callback, void 0, listeners[key][k].inputState, key, k);
                if (typeof node.__listeners[k] !== "object")
                  node.__listeners[k] = { callback: listeners[key][k].callback, inputState: listeners[key][k]?.inputState };
                node.__listeners[k].sub = sub;
              }
            }
          }
        }
      };
      this.clearListeners = (node, listener) => {
        if (typeof node === "string")
          node = this.get(node);
        if (node?.__listeners) {
          for (const key in node.__listeners) {
            if (listener && key !== listener)
              continue;
            if (typeof node.__listeners[key].sub !== "number")
              continue;
            let n = this.get(key);
            if (!n) {
              n = this.get(key.substring(0, key.lastIndexOf(".")));
              if (n)
                this.unsubscribe(n, node.__listeners[key].sub, key.substring(key.lastIndexOf(".") + 1), node.__listeners[key].inputState);
            } else {
              this.unsubscribe(n, node.__listeners[key].sub, void 0, node.__listeners[key].inputState);
            }
            delete node.__listeners[key];
          }
        }
      };
      this.get = (tag) => {
        return this.__node.nodes.get(tag);
      };
      this.set = (tag, node) => {
        return this.__node.nodes.set(tag, node);
      };
      this.delete = (tag) => {
        return this.__node.nodes.delete(tag);
      };
      this.getProps = (node, getInitial) => {
        if (typeof node === "string")
          node = this.get(node);
        if (node instanceof GraphNode) {
          let cpy;
          if (getInitial)
            cpy = Object.assign({}, this.__node.tree[node.__node.tag]);
          else {
            cpy = Object.assign({}, node);
            delete cpy.__unsubscribe;
            delete cpy.__setOperator;
            delete cpy.__node;
            delete cpy.__subscribeState;
            delete cpy.__subscribe;
          }
        }
      };
      this.subscribe = (node, callback, key, subInput, target, bound) => {
        let nd = node;
        if (!(node instanceof GraphNode))
          nd = this.get(node);
        let sub;
        if (typeof callback === "string") {
          if (target) {
            let method = this.get(target)?.[callback];
            if (typeof method === "function")
              callback = method;
          } else
            callback = this.get(callback)?.__operator;
        }
        if (nd instanceof GraphNode) {
          sub = nd.__subscribe(callback, key, subInput, target, bound);
          let ondelete = () => {
            nd.__unsubscribe(sub, key, subInput);
          };
          nd.__addOndisconnected(ondelete);
        } else if (typeof node === "string") {
          if (this.get(node)) {
            if (callback instanceof GraphNode && callback.__operator) {
              sub = this.get(node).__subscribe(callback.__operator, key, subInput, target, bound);
              let ondelete = () => {
                this.get(node).__unsubscribe(sub);
              };
              callback.__addOndisconnected(ondelete);
            } else if (typeof callback === "function" || typeof callback === "string") {
              sub = this.get(node).__subscribe(callback, key, subInput, target, bound);
              this.__node.state.getTrigger(this.get(node).__node.unique, sub).source = node;
            }
          } else {
            if (typeof callback === "string")
              callback = this.__node.nodes.get(callback).__operator;
            if (typeof callback === "function")
              sub = this.__node.state.subscribeTrigger(node, callback);
          }
        }
        return sub;
      };
      this.unsubscribe = (node, sub, key, subInput) => {
        if (node instanceof GraphNode) {
          return node.__unsubscribe(sub, key, subInput);
        } else
          return this.get(node)?.__unsubscribe(sub, key, subInput);
      };
      this.setState = (update) => {
        this.__node.state.setState(update);
      };
      this.init(options);
    }
  };
  function recursivelyAssign(target, obj) {
    for (const key in obj) {
      if (obj[key]?.constructor.name === "Object" && !Array.isArray(obj[key])) {
        if (target[key]?.constructor.name === "Object" && !Array.isArray(target[key]))
          recursivelyAssign(target[key], obj[key]);
        else
          target[key] = recursivelyAssign({}, obj[key]);
      } else {
        target[key] = obj[key];
      }
    }
    return target;
  }
  function getAllProperties(obj) {
    var allProps = [], curr = obj;
    do {
      var props = Object.getOwnPropertyNames(curr);
      props.forEach(function(prop) {
        if (allProps.indexOf(prop) === -1)
          allProps.push(prop);
      });
    } while (curr = Object.getPrototypeOf(curr));
    return allProps;
  }

  // ../../Loaders.ts
  var backprop = (node, parent, graph) => {
    if (node.__node.backward && parent instanceof GraphNode) {
      graph.setListeners({
        [parent.__node.tag]: {
          [node.__node.tag]: parent
        }
      });
    }
  };
  var loop = (node, parent, graph) => {
    if (node.__operator && !node.__node.looperSet) {
      node.__node.looperSet = true;
      if (typeof node.__node.delay === "number") {
        let fn = node.__operator;
        node.__operator = (...args) => {
          return new Promise((res, rej) => {
            setTimeout(async () => {
              res(await fn(...args));
            }, node.__node.delay);
          });
        };
      } else if (node.__node.frame === true) {
        let fn = node.__operator;
        node.__operator = (...args) => {
          return new Promise((res, rej) => {
            requestAnimationFrame(async () => {
              res(await fn(...args));
            });
          });
        };
      }
      if (typeof node.__node.repeat === "number" || typeof node.__node.recursive === "number") {
        let fn = node.__operator;
        node.__operator = async (...args) => {
          let i = node.__node.repeat ? node.__node.repeat : node.__node.recursive;
          let result;
          let repeater = async (tick, ...inp) => {
            while (tick > 0) {
              if (node.__node.delay || node.__node.frame) {
                fn(...inp).then(async (res) => {
                  if (node.__node.recursive) {
                    await repeater(tick, res);
                  } else
                    await repeater(tick, ...inp);
                });
                break;
              } else
                result = await fn(...args);
              tick--;
            }
          };
          await repeater(i, ...args);
          return result;
        };
      }
      if (node.__node.loop && typeof node.__node.loop === "number") {
        let fn = node.__operator;
        node.__operator = (...args) => {
          if (!("looping" in node.__node))
            node.__node.looping = true;
          if (node.__node.looping) {
            fn(...args);
            setTimeout(() => {
              node.__operator(...args);
            }, node.__node.loop);
          }
        };
        if (node.__node.looping)
          node.__operator();
        let ondelete = (node2) => {
          if (node2.__node.looping)
            node2.__node.looping = false;
        };
        node.__addOndisconnected(ondelete);
      }
    }
  };
  var animate = (node, parent, graph) => {
    if (node.__node.animate === true || node.__animation) {
      let fn = node.__operator;
      node.__operator = (...args) => {
        if (!("animating" in node.__node))
          node.__node.animating = true;
        if (node.__node.animating) {
          if (typeof node.__animation === "function")
            node.__animation(...args);
          else
            fn(...args);
          requestAnimationFrame(() => {
            node.__operator(...args);
          });
        }
      };
      if (node.__node.animating || (!("animating" in node.__node) || node.__node.animating) && node.__animation)
        setTimeout(() => {
          requestAnimationFrame(node.__operator());
        }, 10);
      let ondelete = (node2) => {
        if (node2.__node.animating)
          node2.__node.animating = false;
      };
      node.__addOndisconnected(ondelete);
    }
  };
  var branching = (node, parent, graph) => {
    if (typeof node.__node.branch === "object" && node.__operator && !node.__node.branchApplied) {
      let fn = node.__operator;
      node.__node.branchApplied = true;
      node.__operator = (...args) => {
        let result = fn(...args);
        for (const key in node.__node.branch) {
          let triggered = () => {
            if (typeof node.__node.branch[key].then === "function") {
              node.__node.branch[key].then(result);
            } else if (node.__node.branch[key].then instanceof GraphNode && node.__node.branch[key].then.__operator) {
              node.__node.branch[key].then.__operator(result);
            } else
              result = node.__node.branch[key].then;
          };
          if (typeof node.__node.branch[key].if === "function") {
            if (node.__node.branch[key].if(result)) {
              triggered();
            }
          } else if (node.__node.branch[key].if === result) {
            triggered();
          }
        }
        return result;
      };
    }
    if (node.__listeners) {
      for (const key in node.__listeners) {
        if (typeof node.__listeners[key] === "object") {
          if (node.__listeners[key].branch && !node.__listeners[key].branchApplied) {
            let fn = node.__listeners[key].callback;
            node.__listeners[key].branchApplied = true;
            node.__listeners.callback = (ret2) => {
              let triggered = () => {
                if (typeof node.__listeners[key].branch.then === "function") {
                  ret2 = node.__listeners[key].branch.then(ret2);
                } else if (node.__listeners[key].branch.then instanceof GraphNode && node.__listeners[key].branch.then.__operator) {
                  ret2 = node.__listeners[key].branch.then.__operator(ret2);
                } else
                  ret2 = node.__listeners[key].branch.then;
              };
              if (typeof node.__listeners[key].branch.if === "function") {
                if (node.__listeners[key].branch.if(ret2)) {
                  triggered();
                }
              } else if (node.__listeners[key].branch.if === ret2) {
                triggered();
              }
              return fn(ret2);
            };
          }
        }
      }
    }
  };
  var triggerListenerOncreate = (node, parent, graph) => {
    if (node.__listeners) {
      for (const key in node.__listeners) {
        if (typeof node.__listeners[key] === "object") {
          if (node.__listeners[key].oncreate) {
            node.__listeners[key].callback(node.__listeners[key].oncreate);
          }
        }
      }
    }
  };
  var bindListener = (node, parent, graph) => {
    if (node.__listeners) {
      for (const key in node.__listeners) {
        if (typeof node.__listeners[key] === "object") {
          if (typeof node.__listeners[key].binding === "object") {
            node.__listeners.callback = node.__listeners.callback.bind(node.__listeners[key].binding);
          }
        }
      }
    }
  };
  var transformListenerResult = (node, parent, graph) => {
    if (node.__listeners) {
      for (const key in node.__listeners) {
        if (typeof node.__listeners[key] === "object") {
          if (typeof node.__listeners[key].transform === "function" && !node.__listeners[key].transformApplied) {
            let fn = node.__listeners[key].callback;
            node.__listeners[key].transformApplied = true;
            node.__listeners.callback = (ret2) => {
              ret2 = node.__listeners[key].transform(ret2);
              return fn(ret2);
            };
          }
        }
      }
    }
  };
  var substitute__operator = (node, parent, graph) => {
    if (node.post && !node.__operator) {
      node.__setOperator(node.post);
    } else if (!node.__operator && typeof node.get == "function") {
      node.__setOperator(node.get);
    }
    if (!node.get && node.__operator) {
      node.get = node.__operator;
    }
    if (node.aliases) {
      node.aliases.forEach((a) => {
        graph.set(a, node);
        let ondelete = (node2) => {
          graph.__node.nodes.delete(a);
        };
        node.__addOndisconnected(ondelete);
      });
    }
    if (typeof graph.__node.tree[node.__node.tag] === "object" && node.get)
      graph.__node.tree[node.__node.tag].get = node.get;
  };
  var loaders = {
    backprop,
    loop,
    animate,
    branching,
    triggerListenerOncreate,
    bindListener,
    transformListenerResult,
    substitute__operator
  };

  // ../../services/Service.ts
  var Service = class extends Graph {
    constructor(options) {
      super({
        ...options,
        loaders: options?.loaders ? Object.assign({ ...loaders }, options.loaders) : { ...loaders }
      });
      this.name = `service${Math.floor(Math.random() * 1e15)}`;
      this.addServices = (services) => {
        for (const s in services) {
          if (typeof services[s] === "function")
            services[s] = new services[s]();
          if (services[s]?.__node?.loaders)
            Object.assign(this.__node.loaders, services[s].__node.loaders);
          if (services[s]?.__node?.nodes) {
            services[s].__node.nodes.forEach((n, tag) => {
              if (!this.get(tag)) {
                this.set(tag, n);
              } else
                this.set(s + "." + tag, n);
            });
            this.__node.nodes.forEach((n, k) => {
              if (!services[s].__node.nodes.get(k))
                services[s].__node.nodes.set(k, n);
            });
            let set = this.set;
            this.set = (tag, node) => {
              services[s].set(tag, node);
              return set(tag, node);
            };
            let del = this.delete;
            this.delete = (tag) => {
              services[s].delete(tag);
              return del(tag);
            };
          } else if (typeof services[s] === "object") {
            this.setTree(services[s]);
          }
        }
      };
      this.handleMethod = (route, method, args) => {
        let m = method.toLowerCase();
        let src = this.__node.nodes.get(route);
        if (!src) {
          src = this.__node.tree[route];
        }
        if (src?.[m]) {
          if (!(src[m] instanceof Function)) {
            if (args)
              src[m] = args;
            return src[m];
          } else
            return src[m](args);
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
          } else if (this.__node.keepState) {
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
          } else if (this.__node.keepState) {
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
            return this.subscribe(source, (res) => {
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
            return source.__node.state.subscribeTriggerOnce(source.__node.unique, (res) => {
              let mod = callback(res);
              if (mod !== void 0)
                this.transmit({ route: destination, args: mod, method });
              else
                this.transmit({ route: destination, args: res, method }, endpoint);
            });
          else
            return this.__node.state.subscribeTriggerOnce(source.__node.unique, (res) => {
              this.transmit({ route: destination, args: res, method }, endpoint);
            });
        } else if (typeof source === "string")
          return this.__node.state.subscribeTriggerOnce(this.__node.nodes.get(source).__node.unique, (res) => {
            this.transmit({ route: destination, args: res, method }, endpoint);
          });
      };
      this.terminate = (...args) => {
      };
      this.isTypedArray = isTypedArray;
      this.recursivelyAssign = recursivelyAssign2;
      this.spliceTypedArray = spliceTypedArray;
      this.ping = () => {
        console.log("pinged!");
        return "pong";
      };
      this.echo = (...args) => {
        this.transmit(...args);
        return args;
      };
      if (options?.services)
        this.addServices(options.services);
      this.setTree(this);
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
  };
  function isTypedArray(x) {
    return ArrayBuffer.isView(x) && Object.prototype.toString.call(x) !== "[object DataView]";
  }
  var recursivelyAssign2 = (target, obj) => {
    for (const key in obj) {
      if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
        if (typeof target[key] === "object" && !Array.isArray(target[key]))
          recursivelyAssign2(target[key], obj[key]);
        else
          target[key] = recursivelyAssign2({}, obj[key]);
      } else
        target[key] = obj[key];
    }
    return target;
  };
  function spliceTypedArray(arr, start, end) {
    let s = arr.subarray(0, start);
    let e;
    if (end) {
      e = arr.subarray(end + 1);
    }
    let ta;
    if (s.length > 0 || e?.length > 0)
      ta = new arr.constructor(s.length + e.length);
    if (ta) {
      if (s.length > 0)
        ta.set(s);
      if (e && e.length > 0)
        ta.set(e, s.length);
    }
    return ta;
  }

  // ../../services/utils.ts
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

  // ../../services/unsafe/Unsafe.service.ts
  var unsafeRoutes = {
    setRoute: function(fn, fnName) {
      if (typeof fn === "string")
        fn = parseFunctionFromText(fn);
      if (typeof fn === "function") {
        if (!fnName)
          fnName = fn.name;
        if (this.__node.graph.get(fnName)) {
          this.__node.graph.get(fnName).__setOperator(fn);
        } else {
          let node = this.__node.graph.add({ __node: { tag: fnName }, __operator: fn });
        }
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
        if (this.__node.graph.get(fnName)) {
          this.__node.graph.get(fnName).__setOperator(fn);
        } else
          this.__node.graph.add({ __node: { tag: fnName }, __operator: fn });
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
        if (this.__node.graph.get(route)) {
          this.__node.graph.get(route)[fnName] = fn;
        } else
          this.__node.graph.add({ __node: { tag: fnName, [fnName]: fn } });
        return true;
      }
      return false;
    },
    assignRoute: function(route, source) {
      if (this.__node.graph.get(route) && typeof source === "object") {
        Object.assign(this.__node.graph.get(route), source);
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
          this.__node.graph[name] = cls;
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
      this.__node.graph[key] = value;
      return true;
    },
    assignObject: function(target, source) {
      if (!this.__node.graph[target])
        return false;
      if (typeof source === "object")
        Object.assign(this.__node.graph[target], source);
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
        this.__node.graph[globalObjectName][fnName] = fn;
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
        this.__node.graph[fnName] = fn;
        return true;
      }
      return false;
    },
    assignFunctionToObject: function(objectName, fn, fnName) {
      if (!this.__node.graph[objectName])
        return false;
      if (typeof fn === "string")
        fn = parseFunctionFromText(fn);
      if (typeof fn === "function") {
        if (!fnName)
          fnName = fn.name;
        this.__node.graph[objectName][fnName] = fn;
        return true;
      }
      return false;
    }
  };

  // ../../services/dom/DOMElement.js
  var DOMElement = class extends HTMLElement {
    constructor() {
      super();
      __publicField(this, "template", function(self2 = this, props) {
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
      __publicField(this, "STYLE");
      __publicField(this, "attachedShadow", false);
      __publicField(this, "obsAttributes", ["props", "options", "onchanged", "onresize", "ondelete", "oncreate", "template"]);
      __publicField(this, "attributeChangedCallback", (name, old, val) => {
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
          if (name !== "props" && this.props)
            this.props[name] = parsed;
        }
      });
      __publicField(this, "delete", () => {
        this.remove();
        if (typeof this.ondelete === "function")
          this.ondelete(this.props);
      });
      __publicField(this, "render", (props = this.props) => {
        if (typeof this.template === "function")
          this.templateResult = this.template(this, props);
        else
          this.templateResult = this.template;
        if (this.styles)
          this.templateResult = `<style>${this.styles}</style>${this.templateResult}`;
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
            if (this.STYLE)
              this.shadowRoot.removeChild(this.STYLE);
            this.FRAGMENT.forEach((c) => {
              this.shadowRoot.removeChild(c);
            });
          } else
            this.FRAGMENT.forEach((c) => {
              this.removeChild(c);
            });
        }
        if (this.useShadow) {
          if (!this.attachedShadow) {
            this.attachShadow({ mode: "open" }).innerHTML = "<slot></slot>";
            this.attachedShadow = true;
          }
          if (this.styles) {
            let style = document.createElement("style");
            style.textContent = this.styles;
            this.shadowRoot.prepend(style);
            this.STYLE = style;
          }
          let len = fragment.childNodes.length;
          this.shadowRoot.prepend(fragment);
          this.FRAGMENT = Array.from(this.shadowRoot.childNodes).slice(0, len);
        } else {
          let len = fragment.childNodes.length;
          this.prepend(fragment);
          this.FRAGMENT = Array.from(this.childNodes).slice(0, len);
        }
        let rendered = new CustomEvent("rendered", { detail: { props: this.props, self: this } });
        this.dispatchEvent(rendered);
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
        subscribeTrigger(key, onchanged = (res) => {
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
          let triggers = this.triggers[key];
          if (triggers) {
            if (!sub)
              delete this.triggers[key];
            else {
              let idx = void 0;
              let obj = triggers.find((o, i) => {
                if (o.idx === sub) {
                  idx = i;
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
    connectedCallback() {
      if (!this.props)
        this.props = {};
      let newProps = this.getAttribute("props");
      if (typeof newProps === "string")
        newProps = JSON.parse(newProps);
      Object.assign(this.props, newProps);
      this.state.setState({ props: this.props });
      Array.from(this.attributes).forEach((att) => {
        let name = att.name;
        let parsed = att.value;
        if (name.includes("eval_") || name.includes("()")) {
          if (name.includes("eval_"))
            name = name.split("_");
          else if (name.includes("()"))
            name = name.substring(0, name.indexOf("("));
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
          Object.defineProperties(
            this,
            att,
            {
              value: parsed,
              writable: true,
              get() {
                return this[name];
              },
              set(val) {
                this.setAttribute(name, val);
              }
            }
          );
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
    set styles(templateStr) {
      this.styles = templateStr;
      if (this.querySelector("style")) {
        this.querySelector("style").innerHTML = templateStr;
      } else {
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
          } catch (err) {
            newFunc = (0, eval)(method);
          }
        }
      }
    } catch (err) {
    }
    return newFunc;
  }

  // ../../services/dom/html.loader.ts
  var htmlloader = (node, parent, graph, tree, properties, key) => {
    if (node.__onresize) {
      let onresize = node.__onresize;
      node.__onresize = (ev) => {
        onresize.call(node, ev, node.__props);
      };
    }
    if (node.__onremove) {
      let ondelete = node.__onremove;
      node.__onremove = (element) => {
        ondelete.call(node, element);
      };
    }
    if (node.__onrender) {
      let onrender = node.__onrender;
      node.__onrender = (element) => {
        onrender.call(node, element);
      };
    }
    if (node.tagName && !node.__props && !node.__template) {
      node.__props = document.createElement(node.tagName);
      node.__proxyObject(node.__props);
      let keys = Object.getOwnPropertyNames(properties);
      for (const k of keys) {
        if (k === "style" && typeof properties[k] === "object") {
          Object.assign(node.__props.style, properties[k]);
        } else
          node.__props[k] = properties[k];
      }
    } else if (node.__element && !node.__template) {
      if (typeof node.__element === "string")
        node.__element = document.createElement(node.__element);
      if (!(node.__element instanceof HTMLElement))
        return;
      node.__props = node.__element;
      node.__proxyObject(node.__props);
      let keys = Object.getOwnPropertyNames(properties);
      for (const k of keys) {
        if (k === "style" && typeof properties[k] === "object") {
          Object.assign(node.__props.style, properties[k]);
        } else
          node.__props[k] = properties[k];
      }
    } else if (typeof node.__css === "string") {
      node.__template = `<style> ${node.__css} </style>`;
      delete node.__css;
    }
    if (node.__template) {
      if (typeof node.__renderonchanged === "function") {
        let renderonchanged = node.__renderonchanged;
        node.__renderonchanged = (element) => {
          renderonchanged.call(element.node, element);
        };
      }
      class CustomElement extends DOMElement {
        constructor() {
          super(...arguments);
          this.props = node.props;
          this.styles = node.__css;
          this.useShadow = node.useShadow;
          this.template = node.__template;
          this.oncreate = node.__onrender;
          this.onresize = node.__onresize;
          this.ondelete = node.__onremove;
          this.renderonchanged = node.__renderonchanged;
        }
      }
      if (node.__element)
        node.tagName = node.__element;
      if (!node.tagName)
        node.tagName = `element${Math.floor(Math.random() * 1e15)}-`;
      CustomElement.addElement(node.tagName);
      node.__props = document.createElement(node.tagName);
      node.__proxyObject(node.__props);
      let keys = Object.getOwnPropertyNames(properties);
      for (const k of keys) {
        if (k === "style" && typeof properties[k] === "object") {
          Object.assign(node.__props.style, properties[k]);
        } else
          node.__props[k] = properties[k];
      }
    } else if (node.__props instanceof HTMLElement) {
      if (node.__onresize)
        window.addEventListener("resize", node.__onresize);
    }
    if (node.__attributes && node.__props instanceof HTMLElement) {
      for (const k in node.__attributes) {
        if (k === "style" && typeof node.__attribute[k] === "object") {
          Object.assign(node.__props.style, node.__attribute[k]);
        }
        node.__props[k] = node.__attributes[k];
      }
    }
    if (node.__props instanceof HTMLElement) {
      node.__props.id = key;
      node.__addOnconnected((n) => {
        if (n.__props.parentNode)
          n.__props.remove();
        if (parent.__props instanceof HTMLElement) {
          parent.__props.appendChild(node.__props);
        } else if (graph.parentNode instanceof HTMLElement) {
          graph.parentNode.appendChild(node.__props);
        } else if (!(node.__props instanceof HTMLBodyElement || node.__props instanceof HTMLHeadElement))
          document.body.appendChild(node.__props);
        if (node.__onrender && !node.__template)
          setTimeout(() => {
            node.__onrender(node.__props);
          }, 0.01);
      });
      node.__addOndisconnected((n) => {
        n.__props.remove();
        if (typeof n.__onremove === "function") {
          n.__onremove(n.__props);
        }
        if (n.__onresize) {
          window.removeEventListener("resize", n.__onresize);
        }
      });
    }
  };

  // ../../services/e2ee/E2EE.service.ts
  var import_sjcl = __toESM(require_sjcl());

  // ../../services/http/HTTP.browser.ts
  var _HTTPfrontend = class extends Service {
    constructor(options, path, fetched) {
      super(options);
      this.name = "http";
      this.fetchProxied = false;
      this.listening = {};
      this.GET = (url2 = "http://localhost:8080/ping", type = "", mimeType) => {
        if (type === "json")
          mimeType = "application/json";
        return new Promise((resolve, reject) => {
          let xhr = _HTTPfrontend.request({
            method: "GET",
            url: url2,
            responseType: type,
            mimeType,
            onload: (ev) => {
              let data;
              if (xhr.responseType === "" || xhr.responseType === "text")
                data = xhr.responseText;
              else
                data = xhr.response;
              if (url2 instanceof URL)
                url2 = url2.toString();
              this.setState({ [url2]: data });
              resolve(data);
            },
            onabort: (er) => {
              reject(er);
            }
          });
        }).catch(console.error);
      };
      this.POST = (message, url2 = "http://localhost:8080/echo", type = "", mimeType) => {
        if (typeof message === "object" && (type === "json" || type === "text" || !type)) {
          message = JSON.stringify(message);
        }
        if (type === "json")
          mimeType = "application/json";
        return new Promise((resolve, reject) => {
          let xhr = _HTTPfrontend.request({
            method: "POST",
            url: url2,
            data: message,
            responseType: type,
            mimeType,
            onload: (ev) => {
              let data;
              if (xhr.responseType === "" || xhr.responseType === "text")
                data = xhr.responseText;
              else
                data = xhr.response;
              if (url2 instanceof URL)
                url2 = url2.toString();
              this.setState({ [url2]: data });
              resolve(data);
            },
            onabort: (er) => {
              reject(er);
            }
          });
        }).catch(console.error);
      };
      this.transmit = (message, url2) => {
        let obj = message;
        if (typeof obj === "object") {
          message = JSON.stringify(obj);
        }
        if (obj?.method?.toLowerCase() == "get" || message?.toLowerCase() === "get")
          return this.GET(url2);
        return this.POST(message, url2);
      };
      this.transponder = (url2, message, type = "", mimeType) => {
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
            let xhr = _HTTPfrontend.request({
              method,
              url: url2,
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
                  return resolve(this.handleMethod(body.route, body.method, body.args));
                } else if (typeof body?.route === "string") {
                  return resolve(this.handleServiceMessage(body));
                } else if (typeof body?.node === "string" || body.node instanceof GraphNode) {
                  return resolve(this.handleGraphNodeCall(body.node, body.args));
                } else
                  return resolve(body);
              },
              onabort: (er) => {
                reject(er);
              }
            });
          }).catch(console.error);
      };
      this.listen = (path = "0", fetched = async (clone, args, response) => {
        const result = await clone.text();
        const returned = this.receive(result);
        this.setState({ [response.url]: returned });
      }) => {
        this.listening[path] = {};
        let listenerId = `${path}${Math.floor(Math.random() * 1e15)}`;
        this.listening[path][listenerId] = fetched;
        if (!this.fetchProxied) {
          globalThis.fetch = new Proxy(
            globalThis.fetch,
            {
              apply(fetch, that, args) {
                const result = fetch.apply(that, args);
                result.then((response) => {
                  if (!response.ok)
                    return;
                  if (this.listening["0"]) {
                    for (const key in this.listeners) {
                      const clone = response.clone();
                      this.listening["0"][key](clone, args, response);
                    }
                  } else {
                    for (const key in this.listening) {
                      if (response.url.includes(key)) {
                        for (const key2 in this.listening[path]) {
                          const clone = response.clone();
                          this.listening[path][key2](clone, args, response);
                        }
                        break;
                      }
                    }
                  }
                }).catch((er) => {
                  console.error(er);
                });
                return result;
              }
            }
          );
          this.fetchProxied = true;
        }
        return listenerId;
      };
      this.stopListening = (path, listener) => {
        if (!path && path !== 0) {
          for (const key in this.listening)
            delete this.listening[key];
        } else {
          if (!listener)
            delete this.listening[path];
          else
            delete this.listening[listener];
        }
      };
      this.setTree(this);
      this.listen(path, fetched);
    }
  };
  var HTTPfrontend = _HTTPfrontend;
  HTTPfrontend.request = (options) => {
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

  // ../../services/worker/Worker.service.ts
  var import_web_worker = __toESM(require_browser());
  var WorkerService = class extends Service {
    constructor(options) {
      super();
      this.name = "worker";
      this.workers = {};
      this.threadRot = 0;
      this.loadWorkerRoute = (rt, routeKey) => {
        if (rt.workerUrl)
          rt.url = rt.workerUrl;
        if (rt.workerId)
          rt.__node.tag = rt.workerId;
        if (!rt.__node.tag)
          rt.__node.tag = routeKey;
        rt._id = rt.__node.tag;
        let worker;
        if (this.workers[rt._id])
          worker = this.workers[rt._id];
        else if (rt.worker)
          worker = rt.worker;
        if (!worker) {
          worker = this.addWorker(rt);
          let ondelete = (rt2) => {
            rt2.worker?.terminate();
          };
          rt.__addOndisconnected(ondelete);
        }
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
          if (!rt.__operator) {
            rt.__operator = (...args) => {
              if (rt.callback) {
                if (!this.__node.nodes.get(rt.__node.tag)?.__children)
                  worker.post(rt.callback, args);
                else
                  return worker.run(rt.callback, args);
              } else {
                if (!this.__node.nodes.get(rt.__node.tag)?.__children)
                  worker.send(args);
                else
                  return worker.request(args);
              }
            };
          }
          if (rt.init) {
            worker.run(rt.init, rt.initArgs, rt.initTransfer);
          }
          return worker;
        }
      };
      this.workerloader = {
        "workers": (node, parent, graph, tree) => {
          let rt = node;
          if (!node.parentRoute && (parent?.callback && parent?.worker))
            node.parentRoute = parent?.callback;
          if (rt?.worker || rt?.workerId || rt?.workerUrl) {
            let worker = this.loadWorkerRoute(rt, rt.__node.tag);
            if (worker) {
              if (!rt.parentRoute && rt.__parent?.callback)
                rt.parentRoute = rt.__parent.callback;
              if (rt.__parent && !rt.portId) {
                if (typeof rt.__parent === "string") {
                  if (rt.__node.tag !== rt.__parent && worker._id !== rt.__parent)
                    rt.portId = this.establishMessageChannel(worker, rt.__parent);
                } else if (rt.__node.tag !== rt.__parent?.__node?.tag && worker._id !== rt.__parent.tag) {
                  rt.portId = this.establishMessageChannel(worker, rt.__parent.worker);
                }
              }
              ;
              if (rt.parentRoute) {
                if (!rt.stopped) {
                  if (typeof rt.__parent === "string" && rt.__parent === worker._id) {
                    worker.run("subscribe", [rt.parentRoute, void 0, rt.callback]);
                  } else if (rt.__node.tag === rt.__parent?.__node?.tag || worker._id === rt.__parent?.__node?.tag) {
                    worker.run("subscribe", [rt.parentRoute, void 0, rt.callback]);
                  } else
                    worker.run("subscribeToWorker", [rt.parentRoute, rt.portId, rt.callback, rt.blocking]).then((sub) => {
                      worker.workerSubs[rt.parentRoute + rt.portId].sub = sub;
                    });
                }
                if (!(typeof rt.__parent === "string" && rt.__parent === worker._id) && !(rt.__node.tag === rt.__parent?.__node?.tag || worker._id === rt.__parent?.__node?.tag))
                  worker.workerSubs[rt.parentRoute + rt.portId] = { sub: null, route: rt.parentRoute, portId: rt.portId, callback: rt.callback, blocking: rt.blocking };
              } else if (rt.__parent) {
                if (typeof rt.__parent === "string") {
                  if (!rt.stopped) {
                    if (rt.__parent === worker._id) {
                      worker.run("subscribe", [rt.__parent, void 0, rt.callback]);
                    } else
                      worker.run("subscribeToWorker", [rt.__parent, rt.portId, rt.callback, rt.blocking]).then((sub) => {
                        worker.workerSubs[rt.__parent + rt.portId].sub = sub;
                      });
                  }
                  if (!(typeof rt.__parent === "string" && rt.__parent === worker._id))
                    worker.workerSubs[rt + rt.portId] = { sub: null, route: worker._id, portId: rt.portId, callback: rt.callback, blocking: rt.blocking };
                } else if (rt.__parent?.__node?.tag && rt.__parent?.worker) {
                  if (!rt.stopped) {
                    if (rt.__node.tag === rt.__parent.__node.tag || worker._id === rt.__parent.__node.tag) {
                      worker.run("subscribe", [rt.__parent.__node.tag, void 0, rt.callback]);
                    } else
                      worker.run("subscribeToWorker", [rt.__parent.__node.tag, rt.portId, rt.callback, rt.blocking]).then((sub) => {
                        worker.workerSubs[rt.__parent.__node.tag + rt.portId].sub = sub;
                      });
                  }
                  if (!(rt.__node.tag === rt.__parent?.__node?.tag || worker._id === rt.__parent?.__node?.tag))
                    worker.workerSubs[rt.__parent.__node.tag + rt.portId] = { sub: null, route: rt.__parent.__node.tag, portId: rt.portId, callback: rt.callback, blocking: rt.blocking };
                }
              }
            }
          } else if (rt.__parent && rt.parentRoute) {
            console.log(rt);
            if (typeof rt.__parent === "string" && tree[rt.__parent]?.worker) {
              tree[rt.__parent].worker.subscribe(rt.parentRoute, rt.__operator, rt.blocking);
            } else if (rt.__parent?.worker) {
              rt.__parent.worker.subscribe(rt.parentRoute, rt.__operator, rt.blocking);
            }
          }
          return rt;
        }
      };
      this.addDefaultMessageListener = () => {
        globalThis.onmessage = (ev) => {
          let result = this.receive(ev.data);
          if (this.__node.keepState)
            this.setState({ [this.name]: result });
        };
      };
      this.postMessage = (message, target, transfer) => {
        if (this.workers[target]) {
          this.workers[target].send(message, transfer);
        } else {
          globalThis.postMessage(message, target, transfer);
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
        let workerSubs = {};
        let subscribe = (route, callback, blocking) => {
          return this.subscribeToWorker(route, options._id, callback, blocking);
        };
        let unsubscribe = (route, sub) => {
          return run("unsubscribe", [route, sub]);
        };
        let start = async (route, portId, callback, blocking) => {
          if (route)
            await run("subscribeToWorker", [route, portId, callback, blocking]).then((sub) => {
              if (sub)
                workerSubs[route + portId] = { sub, route, portId, callback, blocking };
            });
          else
            for (const key in workerSubs) {
              if (typeof workerSubs[key].sub !== "number")
                await run("subscribeToWorker", [workerSubs[key].route, workerSubs[key].portId, workerSubs[key].callback, workerSubs[key].blocking]).then((sub) => {
                  workerSubs[key].sub = sub;
                });
            }
          return true;
        };
        let stop = async (route, portId) => {
          if (route && portId && workerSubs[route + portId]) {
            await run("unsubscribe", [route, workerSubs[route + portId].sub]);
            workerSubs[route + portId].sub = false;
          } else {
            for (const key in workerSubs) {
              if (typeof workerSubs[key].sub === "number") {
                await run("unpipeWorkers", [workerSubs[key].route, workerSubs[key].portId, workerSubs[key].sub]);
              }
              workerSubs[key].sub = false;
            }
          }
          return true;
        };
        let terminate = () => {
          for (const key in workerSubs) {
            if (typeof workerSubs[key].sub === "number") {
              run("unpipeWorkers", [workerSubs[key].route, workerSubs[key].portId, workerSubs[key].sub]);
            }
            workerSubs[key].sub = false;
          }
          return this.terminate(options._id);
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
          terminate,
          start,
          stop,
          postMessage: worker.postMessage,
          workerSubs,
          graph: this,
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
        let onclose;
        if (typeof worker === "string") {
          let obj = this.workers[worker];
          if (obj) {
            delete this.workers[worker];
            worker = obj.worker;
            if (obj.onclose)
              onclose = obj.onclose;
          }
        }
        if (worker instanceof import_web_worker.default) {
          worker.terminate();
          if (onclose)
            onclose(worker);
          return true;
        }
        if (worker instanceof MessagePort) {
          worker.close();
          if (onclose)
            onclose(worker);
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
        } else if (worker?.worker) {
          worker = worker.worker;
        }
        if (typeof worker2 === "string") {
          if (this.workers[worker2]) {
            if (this.workers[worker2].port)
              worker2 = this.workers[worker2].port;
            else
              worker2 = this.workers[worker2].worker;
          }
        } else if (worker2?.worker) {
          worker2 = worker2.worker;
        }
        if (worker instanceof import_web_worker.default || worker instanceof MessagePort) {
          let channel = new MessageChannel();
          let portId = `port${Math.floor(Math.random() * 1e15)}`;
          worker.postMessage({ route: "addWorker", args: { port: channel.port1, _id: portId } }, [channel.port1]);
          if (worker2 instanceof import_web_worker.default || worker2 instanceof MessagePort) {
            worker2.postMessage({ route: "addWorker", args: { port: channel.port2, _id: portId } }, [channel.port2]);
          } else if (workerId && this.workers[workerId]) {
            channel.port2.onmessage = this.workers[workerId].onmessage;
            this.workers[workerId].port = channel.port2;
          }
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
      this.subscribeWorker = (route, worker, blocking, key, subInput) => {
        let callback;
        if (blocking) {
          let blocked = false;
          callback = (res) => {
            if (!blocked) {
              blocked = true;
              if (res instanceof Promise) {
                res.then((r) => {
                  if (worker?.run)
                    worker.run("triggerSubscription", [route, worker._id, r]).then((ret2) => {
                      blocked = false;
                    });
                });
              } else {
                if (worker?.run)
                  worker.run("triggerSubscription", [route, worker._id, res]).then((ret2) => {
                    blocked = false;
                  });
              }
            }
          };
        } else {
          callback = (res) => {
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
          };
        }
        if (!blocking && worker?.port) {
          worker = worker.port;
        } else if (!blocking && worker?.worker) {
          worker = worker.worker;
        } else if (typeof worker === "string" && this.workers[worker]) {
          if (blocking)
            worker = this.workers[worker];
          else if (this.workers[worker].port)
            worker = this.workers[worker].port;
          else
            worker = this.workers[worker].worker;
        }
        return this.subscribe(route, callback, key, subInput);
      };
      this.subscribeToWorker = (route, workerId, callback, blocking, key, subInput) => {
        if (typeof workerId === "string" && this.workers[workerId]) {
          this.__node.state.subscribeTrigger(workerId, (res) => {
            if (res?.callbackId === route) {
              if (!callback)
                this.setState({ [workerId]: res.args });
              else if (typeof callback === "string") {
                this.run(callback, res.args);
              } else
                callback(res.args);
            }
          });
          return this.workers[workerId].run("subscribeWorker", [route, workerId, blocking, key, subInput]);
        }
      };
      this.triggerSubscription = async (route, workerId, result) => {
        if (this.__node.state.triggers[workerId])
          for (let i = 0; i < this.__node.state.triggers[workerId].length; i++) {
            await this.__node.state.triggers[workerId][i].onchange({ args: result, callbackId: route });
          }
        return true;
      };
      this.pipeWorkers = (sourceWorker, listenerWorker, sourceRoute, listenerRoute, portId, blocking) => {
        if (typeof sourceWorker === "string")
          sourceWorker = this.workers[sourceWorker];
        if (typeof listenerWorker === "string")
          listenerWorker = this.workers[listenerWorker];
        if (!portId) {
          portId = this.establishMessageChannel(sourceWorker.worker, listenerWorker.worker);
        }
        return listenerWorker.run("subscribeToWorker", [sourceRoute, portId, listenerRoute, blocking]);
      };
      this.unpipeWorkers = (sourceRoute, sourceWorker, sub) => {
        if (typeof sourceWorker === "string")
          sourceWorker = this.workers[sourceWorker];
        if (sourceWorker)
          return sourceWorker.run("unsubscribe", [sourceRoute, sub]);
      };
      this.connections = {
        workers: this.workers
      };
      if (options?.services)
        this.addServices(options.services);
      this.setTree(this);
      this.setLoaders(this.workerloader);
      if (options)
        this.init(options);
      if (typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope) {
        this.addDefaultMessageListener();
      }
    }
    getTransferable(message) {
      let transfer;
      if (typeof message === "object") {
        if (message.args) {
          if (message.args?.constructor?.name === "Object") {
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
              } else if (arg?.constructor?.name === "ArrayBuffer")
                transfer = [arg];
            });
          } else if (ArrayBuffer.isView(message.args)) {
            transfer = [message.args.buffer];
          } else if (message.args?.constructor?.name === "ArrayBuffer") {
            transfer = [message];
          }
        } else if (message?.constructor?.name === "Object") {
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

  // ../../services/worker/ProxyListener.ts
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
      if (!worker) {
        handleProxyEvent(data, id);
      } else
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
      if (this.__listeners === void 0)
        this.__listeners = {};
      const listeners = this.__listeners;
      if (listeners[type] === void 0) {
        listeners[type] = [];
      }
      if (listeners[type].indexOf(listener) === -1) {
        listeners[type].push(listener);
      }
    }
    hasEventListener(type, listener) {
      if (this.__listeners === void 0)
        return false;
      const listeners = this.__listeners;
      return listeners[type] !== void 0 && listeners[type].indexOf(listener) !== -1;
    }
    removeEventListener(type, listener) {
      if (this.__listeners === void 0)
        return;
      const listeners = this.__listeners;
      const listenerArray = listeners[type];
      if (listenerArray !== void 0) {
        const index = listenerArray.indexOf(listener);
        if (index !== -1) {
          listenerArray.splice(index, 1);
        }
      }
    }
    dispatchEvent(event, target) {
      if (this.__listeners === void 0)
        return;
      const listeners = this.__listeners;
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
      this.__listeners = {};
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
            this.proxied.style.width = this.width + "px";
            this.proxied.style.height = this.height + "px";
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
          if (typeof WorkerGlobalScope !== "undefined")
            addTo.style = proxy.style;
          if (proxy.width) {
            addTo.style.width = proxy.width + "px";
            addTo.clientWidth = proxy.width;
          }
          if (proxy.height) {
            addTo.style.height = proxy.height + "px";
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
  function makeProxy(id, elm) {
    if (this?.__node?.graph) {
      if (!this.__node.graph.ProxyManager)
        this.__node.graph.ProxyManager = new ProxyManager();
      this.__node.graph.ProxyManager.makeProxy(id, elm);
    } else {
      if (!globalThis.ProxyManager)
        globalThis.ProxyManager = new ProxyManager();
      globalThis.ProxyManager.makeProxy(id, elm);
    }
    return id;
  }
  function handleProxyEvent(data, id) {
    if (this?.__node?.graph) {
      if (!this.__node.graph.ProxyManager)
        this.__node.graph.ProxyManager = new ProxyManager();
      if (this.__node.graph.ProxyManager.handleEvent(data, id))
        return data;
    } else {
      if (!globalThis.ProxyManager)
        globalThis.ProxyManager = new ProxyManager();
      if (globalThis.ProxyManager.handleEvent(data, id))
        return data;
    }
  }
  var proxyElementWorkerRoutes = {
    initProxyElement,
    makeProxy,
    handleProxyEvent
  };

  // ../../services/worker/WorkerCanvas.ts
  function Renderer(options) {
    if (options.worker) {
      let worker = options.worker;
      let route = options.route;
      if (worker instanceof Blob || typeof worker === "string") {
        worker = new Worker(worker);
      }
      delete options.worker;
      delete options.route;
      return transferCanvas(worker, options, route);
    } else {
      initProxyElement(options.canvas, void 0, options._id);
      return setupCanvas(options);
    }
  }
  function transferCanvas(worker, options, route) {
    if (!options)
      return void 0;
    if (!options._id)
      options._id = `canvas${Math.floor(Math.random() * 1e15)}`;
    let offscreen = options.canvas.transferControlToOffscreen();
    if (!options.width)
      options.width = options.canvas.clientWidth;
    if (!options.height)
      options.height = options.canvas.clientHeight;
    let message = { route: route ? route : "setupCanvas", args: {
      ...options,
      canvas: offscreen
    } };
    if (this?.__node?.graph)
      this.__node.graph.run("initProxyElement", options.canvas, worker, options._id);
    else
      initProxyElement(options.canvas, worker, options._id);
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
    let transfer = [offscreen];
    if (options.transfer) {
      transfer.push(...options.transfer);
      delete options.transfer;
    }
    worker.postMessage(message, transfer);
    const canvascontrols = {
      _id: options._id,
      width: options.width,
      height: options.height,
      worker,
      draw: (props) => {
        worker.postMessage({ route: "drawFrame", args: [props, options._id] });
      },
      update: (props) => {
        worker.postMessage({ route: "updateCanvas", args: [props, options._id] });
      },
      clear: () => {
        worker.postMessage({ route: "clearCanvas", args: options._id });
      },
      init: () => {
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
      },
      terminate: () => {
        worker.terminate();
      }
    };
    return canvascontrols;
  }
  function setDraw(settings, _id) {
    let canvasopts;
    if (this?.__node?.graph) {
      if (_id)
        canvasopts = this.__node.graph.CANVASES?.[settings._id];
      else if (settings._id)
        canvasopts = this.__node.graph.CANVASES?.[settings._id];
      else
        canvasopts = this.__node.graph.CANVASES?.[Object.keys(this.__node.graph.CANVASES)[0]];
    } else {
      if (_id)
        canvasopts = globalThis.CANVASES?.[settings._id];
      else if (settings._id)
        canvasopts = globalThis.CANVASES?.[settings._id];
      else
        canvasopts = globalThis.CANVASES?.[Object.keys(globalThis.CANVASES)[0]];
    }
    if (canvasopts) {
      if (settings.canvas) {
        canvasopts.canvas = settings.canvas;
        if (this?.__node?.graph)
          this.__node.graph.run("makeProxy", canvasopts._id, canvasopts.canvas);
        else
          proxyElementWorkerRoutes.makeProxy(canvasopts._id, canvasopts.canvas);
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
        settings.draw = parseFunctionFromText3(settings.draw);
      if (typeof settings.draw === "function") {
        canvasopts.draw = settings.draw;
      }
      if (typeof settings.update === "string")
        settings.update = parseFunctionFromText3(settings.update);
      if (typeof settings.update === "function") {
        canvasopts.update = settings.update;
      }
      if (typeof settings.init === "string")
        settings.init = parseFunctionFromText3(settings.init);
      if (typeof settings.init === "function") {
        canvasopts.init = settings.init;
      }
      if (typeof settings.clear === "string")
        settings.clear = parseFunctionFromText3(settings.clear);
      if (typeof settings.clear === "function") {
        canvasopts.clear = settings.clear;
      }
      return settings._id;
    }
    return void 0;
  }
  function setupCanvas(options) {
    if (this?.__node?.graph) {
      if (!this.__node.graph.CANVASES)
        this.__node.graph.CANVASES = {};
    } else if (!globalThis.CANVASES)
      globalThis.CANVASES = {};
    let canvasOptions = options;
    options._id ? canvasOptions._id = options._id : canvasOptions._id = `canvas${Math.floor(Math.random() * 1e15)}`;
    typeof options.context === "string" ? canvasOptions.context = options.canvas.getContext(options.context) : canvasOptions.context = options.context;
    "animating" in options ? canvasOptions.animating = options.animating : canvasOptions.animating = true;
    if (this?.__node?.graph?.CANVASES[canvasOptions._id]) {
      this.__node.graph.run("setDraw", canvasOptions);
    } else if (globalThis.CANVASES?.[canvasOptions._id]) {
      setDraw(canvasOptions);
    } else {
      if (this?.__node?.graph)
        canvasOptions.graph = this.__node.graph;
      if (this?.__node?.graph)
        this.__node.graph.CANVASES[canvasOptions._id] = canvasOptions;
      else
        globalThis.CANVASES[canvasOptions._id] = canvasOptions;
      if (this?.__node.graph)
        this.__node.graph.run("makeProxy", canvasOptions._id, canvasOptions.canvas);
      else
        proxyElementWorkerRoutes.makeProxy(canvasOptions._id, canvasOptions.canvas);
      if (options.width)
        canvasOptions.canvas.width = options.width;
      if (options.height)
        canvasOptions.canvas.height = options.height;
      if (typeof canvasOptions.draw === "string") {
        canvasOptions.draw = parseFunctionFromText3(canvasOptions.draw);
      } else if (typeof canvasOptions.draw === "function") {
        canvasOptions.draw = canvasOptions.draw;
      }
      if (typeof canvasOptions.update === "string") {
        canvasOptions.update = parseFunctionFromText3(canvasOptions.update);
      } else if (typeof canvasOptions.update === "function") {
        canvasOptions.update = canvasOptions.update;
      }
      if (typeof canvasOptions.init === "string") {
        canvasOptions.init = parseFunctionFromText3(canvasOptions.init);
      } else if (typeof canvasOptions.init === "function") {
        canvasOptions.init = canvasOptions.init;
      }
      if (typeof canvasOptions.clear === "string") {
        canvasOptions.clear = parseFunctionFromText3(canvasOptions.clear);
      } else if (typeof canvasOptions.clear === "function") {
        canvasOptions.clear = canvasOptions.clear;
      }
      if (typeof canvasOptions.init === "function")
        canvasOptions.init(canvasOptions, canvasOptions.canvas, canvasOptions.context);
      canvasOptions.stop = () => {
        stopAnim(canvasOptions._id);
      };
      canvasOptions.start = (draw) => {
        startAnim(canvasOptions._id, draw);
      };
      canvasOptions.set = (settings) => {
        setDraw(settings, canvasOptions._id);
      };
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
    if (typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope)
      return canvasOptions._id;
    else {
      const canvascontrols = {
        _id: options._id,
        width: options.width,
        height: options.height,
        draw: (props) => {
          drawFrame(props, options._id);
        },
        update: (props) => {
          updateCanvas(props, options._id);
        },
        clear: () => {
          clearCanvas(options._id);
        },
        init: () => {
          initCanvas(options._id);
        },
        stop: () => {
          stopAnim(options._id);
        },
        start: () => {
          startAnim(options._id);
        },
        set: (newDrawProps) => {
          setDraw(newDrawProps, options._id);
        },
        terminate: () => {
          stopAnim(options._id);
        }
      };
      return canvascontrols;
    }
  }
  function drawFrame(props, _id) {
    let canvasopts;
    if (this?.__node?.graph) {
      if (!_id)
        canvasopts = this.__node.graph.CANVASES?.[Object.keys(this.__node.graph.CANVASES)[0]];
      else
        canvasopts = this.__node.graph.CANVASES?.[_id];
    } else {
      if (!_id)
        canvasopts = globalThis.CANVASES?.[Object.keys(globalThis.CANVASES)[0]];
      else
        canvasopts = globalThis.CANVASES?.[_id];
    }
    if (canvasopts) {
      if (props)
        Object.assign(canvasopts, props);
      if (canvasopts.draw) {
        canvasopts.draw(canvasopts, canvasopts.canvas, canvasopts.context);
        return _id;
      }
    }
    return void 0;
  }
  function clearCanvas(_id) {
    let canvasopts;
    if (this?.__node?.graph) {
      if (!_id)
        canvasopts = this.__node.graph.CANVASES?.[Object.keys(this.__node.graph.CANVASES)[0]];
      else
        canvasopts = this.__node.graph.CANVASES?.[_id];
    } else {
      if (!_id)
        canvasopts = globalThis.CANVASES?.[Object.keys(globalThis.CANVASES)[0]];
      else
        canvasopts = globalThis.CANVASES?.[_id];
    }
    if (canvasopts?.clear) {
      canvasopts.clear(canvasopts, canvasopts.canvas, canvasopts.context);
      return _id;
    }
    return void 0;
  }
  function initCanvas(_id) {
    let canvasopts;
    if (this?.__node?.graph) {
      if (!_id)
        canvasopts = this.__node.graph.CANVASES?.[Object.keys(this.__node.graph.CANVASES)[0]];
      else
        canvasopts = this.__node.graph.CANVASES?.[_id];
    } else {
      if (!_id)
        canvasopts = globalThis.CANVASES?.[Object.keys(globalThis.CANVASES)[0]];
      else
        canvasopts = globalThis.CANVASES?.[_id];
    }
    if (canvasopts?.init) {
      canvasopts.init(canvasopts, canvasopts.canvas, canvasopts.context);
      return _id;
    }
    return void 0;
  }
  function updateCanvas(input, _id) {
    let canvasopts;
    if (this?.__node?.graph) {
      if (!_id)
        canvasopts = this.__node.graph.CANVASES?.[Object.keys(this.__node.graph.CANVASES)[0]];
      else
        canvasopts = this.__node.graph.CANVASES?.[_id];
    } else {
      if (!_id)
        canvasopts = globalThis.CANVASES?.[Object.keys(globalThis.CANVASES)[0]];
      else
        canvasopts = globalThis.CANVASES?.[_id];
    }
    if (canvasopts?.update) {
      canvasopts.update(canvasopts, canvasopts.canvas, canvasopts.context, input);
      return _id;
    }
    return void 0;
  }
  function setProps(props, _id) {
    let canvasopts;
    if (this?.__node?.graph) {
      if (!_id)
        canvasopts = this.__node.graph.CANVASES?.[Object.keys(this.__node.graph.CANVASES)[0]];
      else
        canvasopts = this.__node.graph.CANVASES?.[_id];
    } else {
      if (!_id)
        canvasopts = globalThis.CANVASES?.[Object.keys(globalThis.CANVASES)[0]];
      else
        canvasopts = globalThis.CANVASES?.[_id];
    }
    if (canvasopts) {
      Object.assign(canvasopts, props);
      if (props.width)
        canvasopts.canvas.width = props.width;
      if (props.height)
        canvasopts.canvas.height = props.height;
      return _id;
    }
    return void 0;
  }
  function startAnim(_id, draw) {
    let canvasopts;
    if (this?.__node?.graph) {
      if (!_id)
        canvasopts = this.__node.graph.CANVASES?.[Object.keys(this.__node.graph.CANVASES)[0]];
      else
        canvasopts = this.__node.graph.CANVASES?.[_id];
    } else {
      if (!_id)
        canvasopts = globalThis.CANVASES?.[Object.keys(globalThis.CANVASES)[0]];
      else
        canvasopts = globalThis.CANVASES?.[_id];
    }
    canvasopts.animating = true;
    if (canvasopts && draw) {
      if (typeof draw === "string")
        draw = parseFunctionFromText3(draw);
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
  }
  function stopAnim(_id) {
    let canvasopts;
    if (this?.__node?.graph) {
      if (!_id)
        canvasopts = this.__node.graph.CANVASES?.[Object.keys(this.__node.graph.CANVASES)[0]];
      else
        canvasopts = this.__node.graph.CANVASES?.[_id];
    } else {
      if (!_id)
        canvasopts = globalThis.CANVASES?.[Object.keys(globalThis.CANVASES)[0]];
      else
        canvasopts = globalThis.CANVASES?.[_id];
    }
    if (canvasopts) {
      canvasopts.animating = false;
      if (typeof canvasopts.clear === "function")
        canvasopts.clear(canvasopts, canvasopts.canvas, canvasopts.context);
      return _id;
    }
    return void 0;
  }
  var workerCanvasRoutes = {
    ...proxyElementWorkerRoutes,
    Renderer,
    transferCanvas,
    setupCanvas,
    setDraw,
    drawFrame,
    clearCanvas,
    initCanvas,
    updateCanvas,
    setProps,
    startAnim,
    stopAnim
  };
  function parseFunctionFromText3(method = "") {
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

  // ../../services/worker/Subprocess.ts
  var algorithms = {};
  var loadAlgorithms = (settings) => {
    return Object.assign(algorithms, settings);
  };
  function createSubprocess(options, inputs) {
    let ctx = {
      _id: options._id ? options._id : `algorithm${Math.floor(Math.random() * 1e15)}`,
      ondata: options.ondata,
      run: (data) => {
        return ctx.ondata(ctx, data);
      }
    };
    if (options.structs)
      recursivelyAssign3(ctx, JSON.parse(JSON.stringify(options.structs)));
    if (inputs)
      recursivelyAssign3(ctx, JSON.parse(JSON.stringify(inputs)));
    if (options.oncreate) {
      ctx.oncreate = options.oncreate;
    }
    if (ctx.oncreate) {
      ctx.oncreate(ctx);
    }
    return ctx;
  }
  var recursivelyAssign3 = (target, obj) => {
    for (const key in obj) {
      if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
        if (typeof target[key] === "object" && !Array.isArray(target[key]))
          recursivelyAssign3(target[key], obj[key]);
        else
          target[key] = recursivelyAssign3({}, obj[key]);
      } else
        target[key] = obj[key];
    }
    return target;
  };
  var subprocessRoutes = {
    ...unsafeRoutes,
    loadAlgorithms,
    "initSubprocesses": async function initSubprocesses(subprocesses, service) {
      if (!service)
        service = this.__node.graph;
      if (!service)
        return void 0;
      for (const p in subprocesses) {
        let s = subprocesses[p];
        if (!s.worker && s.url)
          s.worker = service.addWorker({ url: s.url });
        if (!s.worker)
          continue;
        let w = s.worker;
        let wpId;
        wpId = service.establishMessageChannel(w.worker, s.source?.worker);
        if (!s.source)
          s.source = service;
        if (typeof s.subprocess === "object") {
          const p2 = s.subprocess;
          if (!p2.name)
            continue;
          if (typeof p2.oncreate === "function") {
            p2.oncreate = p2.oncreate.toString();
          }
          if (typeof p2.ondata === "function") {
            p2.ondata = p2.ondata.toString();
          }
          s.worker.post(
            "addSubprocessTemplate",
            [
              p2.name,
              p2.structs,
              p2.oncreate,
              p2.ondata,
              p2.props
            ]
          );
          s.subprocess = p2.name;
        }
        if (s.init) {
          let r = await w.run(s.init, s.initArgs);
          s.otherArgs = r;
        }
        if (s.otherArgs) {
          w.run("setValue", ["otherArgsProxy", Array.isArray(s.otherArgs) ? s.otherArgs : [s.otherArgs]]);
        }
        if (s.pipeTo) {
          w.run("setValue", ["routeProxy", s.route]);
          w.run("setValue", ["pipeRoute", s.pipeTo.route]);
          if (s.url && !s.pipeTo.worker) {
            let w2 = service.addWorker({ url: s.url });
            s.pipeTo.portId = service.establishMessageChannel(w.worker, w2.worker);
            s.pipeTo.worker = w2;
          }
          if (s.pipeTo.init) {
            s.pipeTo.otherArgs = await s.pipeTo.worker.run(s.pipeTo.init, s.pipeTo.initArgs);
          }
          w.run("setValue", ["pipePort", s.pipeTo.portId]);
          if (s.pipeTo.otherArgs)
            w.run("setValue", ["otherPipeArgs", s.pipeTo.otherArgs]);
          service.transferFunction(
            w,
            function pipeResults(data) {
              let inp = data;
              if (this.__node.graph.otherArgsProxy)
                inp = [data, ...this.__node.graph.otherArgsProxy];
              let r = this.__node.graph.run(this.__node.graph.routeProxy, inp);
              if (!s.blocking)
                return new Promise((res) => {
                  if (r instanceof Promise) {
                    r.then((rr) => {
                      if (rr !== void 0) {
                        let args = rr;
                        if (this.__node.graph.otherPipeArgs)
                          args = [rr, ...this.__node.graph.otherPipeArgs];
                        if (this.workers[this.__node.graph.pipePort]) {
                          s.blocking = true;
                          this.workers[this.__node.graph.pipePort].run(this.__node.graph.pipeRoute, args).then((result) => {
                            s.blocking = false;
                            res(result);
                          });
                        }
                      }
                    });
                  } else if (r !== void 0) {
                    let args = r;
                    if (this.__node.graph.otherPipeArgs)
                      args = [r, ...this.__node.graph.otherPipeArgs];
                    if (this.workers[this.__node.graph.pipePort]) {
                      s.blocking = true;
                      this.workers[this.__node.graph.pipePort].run(this.__node.graph.pipeRoute, args).then((result) => {
                        s.blocking = false;
                        res(result);
                      });
                    }
                  }
                });
              return void 0;
            },
            s.route + "_pipeResults"
          );
          s.route = s.route + "_pipeResults";
        } else {
          w.run("setValue", ["routeProxy", s.route]);
          service.transferFunction(
            w,
            function routeProxy(data) {
              let r;
              if (this.__node.graph.otherArgsProxy)
                r = this.__node.graph.nodes.get(this.__node.graph.routeProxy).__operator(data, ...this.__node.graph.otherArgsProxy);
              else
                r = this.__node.graph.nodes.get(this.__node.graph.routeProxy).__operator(data);
              if (this.__node.graph.state.triggers[this.__node.graph.routeProxy]) {
                if (r instanceof Promise) {
                  r.then((rr) => {
                    this.setState({ [this.__node.graph.routeProxy]: rr });
                  });
                } else
                  this.setState({ [this.__node.graph.routeProxy]: r });
              }
              return r;
            },
            s.route + "_routeProxy"
          );
          s.route = s.route + "_routeProxy";
          if (!s.stopped)
            w.run("subscribeToWorker", [s.subscribeRoute, wpId, s.route]).then((sub) => {
              s.sub = sub;
            });
        }
        s.stop = async () => {
          if (s.source && typeof s.sub === "number") {
            s.source.unsubscribe(s.subscribeRoute, s.sub);
            return true;
          }
          return void 0;
        };
        s.start = async () => {
          if (typeof s.sub !== "number")
            return w.run("subscribeToWorker", [s.subscribeRoute, wpId, s.route, s.blocking]).then((sub) => {
              s.sub = sub;
            });
        };
        s.setArgs = async (args) => {
          if (Array.isArray(args))
            await w.run("setValue", ["otherArgsProxy", args]);
          else if (typeof args === "object") {
            for (const key in args) {
              await w.run("setValue", [key, args[key]]);
            }
          }
          return true;
        };
        s.terminate = () => {
          w.terminate();
          if (s.source?.worker && typeof s.sub === "number") {
            s.source.post("unsubscribe", s.sub);
          }
          if (s.pipeTo?.worker) {
            s.pipeTo.worker.terminate();
          }
        };
        if (s.callback)
          w.subscribe(s.route, (res) => {
            if (typeof s.callback === "string")
              this.__node.graph.run(s.callback, res);
            else
              s.callback(res);
          });
      }
      return subprocesses;
    },
    "addSubprocessTemplate": function subprocesstempalte(name, structs, oncreate, ondata, props) {
      if (typeof oncreate === "string")
        oncreate = parseFunctionFromText(oncreate);
      if (typeof ondata === "string")
        ondata = parseFunctionFromText(ondata);
      if (typeof ondata === "function") {
        algorithms[name] = {
          ondata,
          oncreate: typeof oncreate === "function" ? oncreate : null,
          structs
        };
        if (typeof props === "object")
          Object.assign(algorithms[name], props);
        return true;
      }
    },
    "updateSubprocess": function updatesubprocess(structs, _id) {
      if (!this.__node.graph.ALGORITHMS)
        this.__node.graph.ALGORITHMS = {};
      if (!_id)
        _id = Object.keys(this.__node.graph.ALGORITHMS)[0];
      if (!_id)
        return;
      Object.assign(this.__node.graph.ALGORITHMS[_id], structs);
    },
    "createSubprocess": function creatsubprocess(options, inputs) {
      if (!this.__node.graph.ALGORITHMS)
        this.__node.graph.ALGORITHMS = {};
      if (typeof options === "string") {
        options = algorithms[options];
      }
      if (typeof options === "object") {
        if (typeof options.ondata === "string")
          options.ondata = parseFunctionFromText(options.ondata);
        let ctx;
        if (typeof options?.ondata === "function")
          ctx = createSubprocess(options, inputs);
        if (ctx)
          this.__node.graph.ALGORITHMS[ctx._id] = ctx;
        console.log(ctx, options);
        if (ctx)
          return ctx._id;
      }
      return false;
    },
    "runSubprocess": function runsubprocess(data, _id) {
      if (!this.__node.graph.ALGORITHMS)
        this.__node.graph.ALGORITHMS = {};
      if (!_id)
        _id = Object.keys(this.__node.graph.ALGORITHMS)[0];
      if (!_id)
        return;
      let res = this.__node.graph.ALGORITHMS[_id].run(data);
      if (res !== void 0) {
        if (Array.isArray(res)) {
          let pass = [];
          res.forEach((r) => {
            if (r !== void 0) {
              pass.push(r);
              this.__node.graph.setState({ [_id]: r });
            }
          });
          if (pass.length > 0) {
            return pass;
          }
        } else {
          this.__node.graph.setState({ [_id]: res });
          return res;
        }
      }
    }
  };

  // ../../services/router/Router.ts
  var Router = class extends Service {
    constructor(options) {
      super(options);
      this.name = "router";
      this.connections = {};
      this.sources = {};
      this.services = {};
      this.serviceConnections = {};
      this.users = {};
      this.addUser = async (info, connections, config, receiving) => {
        if (!info._id) {
          info._id = `user${Math.floor(Math.random() * 1e15)}`;
        }
        let user = Object.assign({}, info);
        if (connections) {
          for (const key in connections) {
            if (typeof connections[key] === "object") {
              if (!connections[key].connection._id) {
                await new Promise((res, rej) => {
                  let start = performance.now();
                  let checker = () => {
                    if (!connections[key].connection._id) {
                      if (performance.now() - start > 3e3) {
                        delete connections[key];
                        rej(false);
                      } else {
                        setTimeout(() => {
                          checker();
                        }, 100);
                      }
                    } else {
                      res(true);
                    }
                  };
                  checker();
                }).catch((er) => {
                  console.error("Connections timed out:", er);
                });
              }
            }
          }
          for (const key in connections) {
            connections[key] = this.addConnection(connections[key], user._id);
          }
        }
        if (config) {
          for (const c in config) {
            this.openConnection(
              config[c].service,
              config[c],
              user._id,
              config[c].args
            );
          }
        }
        let send = (message, ...a) => {
          let connection = this.getConnection(user._id, "send");
          if (connection?.send)
            return connection.send(message, ...a);
        };
        let request = (message, method, ...a) => {
          let connection = this.getConnection(user._id, "request");
          if (connection?.request)
            return connection.request(message, method, ...a);
        };
        let post = (route, args, method, ...a) => {
          let connection = this.getConnection(user._id, "post");
          if (connection?.post)
            return connection.post(route, args, method, ...a);
        };
        let run = (route, args, method, ...a) => {
          let connection = this.getConnection(user._id, "run");
          if (connection?.run)
            return connection.run(route, args, method, ...a);
        };
        let subscribe = (route, callback, ...a) => {
          let connection = this.getConnection(user._id, "subscribe");
          if (connection?.subscribe)
            return connection.subscribe(route, callback, ...a);
        };
        let unsubscribe = (route, sub, ...a) => {
          let connection = this.getConnection(user._id, "unsubscribe");
          if (connection?.unsubscribe)
            return connection.unsubscribe(route, sub, ...a);
        };
        let terminate = () => {
          return this.removeUser(user);
        };
        user.send = send;
        user.request = request;
        user.post = post;
        user.run = run;
        user.subscribe = subscribe;
        user.unsubscribe = unsubscribe;
        user.terminate = terminate;
        this.users[user._id] = user;
        if (connections && !receiving) {
          let connectionIds = {};
          let pass = false;
          Object.keys(connections).map((k, i) => {
            if (connections[k]?._id) {
              connectionIds[`${i}`] = connections[k]?._id;
              pass = true;
            }
          });
          if (pass) {
            user.send({
              route: "addUser",
              args: [
                { _id: user._id },
                connectionIds,
                void 0,
                true
              ]
            });
          }
        }
        return user;
      };
      this.getConnection = (sourceId, hasMethod) => {
        if (this.sources[sourceId]) {
          if (this.order) {
            for (let i = 0; i < this.order.length; i++) {
              let k = this.order[i];
              for (const key in this.sources[sourceId]) {
                if (this.sources[sourceId][key].service) {
                  if (typeof this.sources[sourceId][key].service === "object") {
                    if (this.sources[sourceId][key].service.__node.tag === k) {
                      if (this.sources[sourceId][key].connectionType && this.sources[sourceId][key].service?.name) {
                        if (!this.serviceConnections[this.sources[sourceId][key].service.name]) {
                          this.removeConnection(this.sources[sourceId][key]);
                          continue;
                        }
                      }
                      return this.sources[sourceId][key];
                    }
                  } else if (this.sources[sourceId][key].service === k) {
                    if (this.sources[sourceId][key].connectionType && this.sources[sourceId][key].service?.name) {
                      if (!this.serviceConnections[this.sources[sourceId][key].service.name])
                        this.removeConnection(this.sources[sourceId][key]);
                      continue;
                    }
                    return this.sources[sourceId][key];
                  }
                }
              }
            }
          } else {
            for (const k in this.sources[sourceId]) {
              if (this.sources[sourceId][k].connectionType && this.sources[sourceId][k].service?.name) {
                if (!this.serviceConnections[this.sources[sourceId][k].service.name]) {
                  this.removeConnection(this.sources[sourceId][k]);
                  continue;
                }
              }
              if (hasMethod && this.sources[sourceId][k][hasMethod]) {
                return this.sources[sourceId][k];
              } else {
                return this.sources[sourceId][k];
              }
            }
          }
        } else if (this.order) {
          for (let i = 0; i < this.order.length; i++) {
            let k = this.order[i];
            if (this.sources[k]?.[sourceId]) {
              if (this.sources[k][sourceId].connectionType && this.sources[k][sourceId].service?.name) {
                if (!this.serviceConnections[this.sources[k][sourceId].service.service.name]) {
                  this.removeConnection(this.sources[k][sourceId].service);
                  continue;
                }
              }
              if (hasMethod && this.sources[k][sourceId]?.[hasMethod]) {
                return this.sources[k][sourceId];
              } else {
                return this.sources[k][sourceId];
              }
            }
          }
        }
        if (typeof sourceId === "string" && this.connections[sourceId] && this.connections[sourceId].send) {
          return this.connections[sourceId];
        }
      };
      this.getConnections = (sourceId, hasMethod, props) => {
        if (this.sources[sourceId]) {
          if (!props && !hasMethod)
            return this.sources[sourceId];
          let found = {};
          for (const key in this.sources[sourceId]) {
            if (typeof this.sources[sourceId][key] === "object") {
              if (!this.sources[sourceId][key]._id) {
                for (const k in this.sources[sourceId][key]) {
                  if (typeof this.sources[sourceId][key][k] === "object") {
                    let pass = true;
                    if (hasMethod && !this.sources[sourceId][key][k][hasMethod])
                      pass = false;
                    for (const p in props) {
                      if (typeof this.sources[sourceId][key][k][p] === "object" && typeof props[p] === "object") {
                        for (const pp in props[p]) {
                          if (props[p][pp] !== this.sources[sourceId][key][k][p][pp]) {
                            pass = false;
                            break;
                          }
                        }
                      } else if (this.sources[sourceId][key][k][p] !== props[p]) {
                        pass = false;
                      } else {
                        pass = false;
                        break;
                      }
                    }
                    if (pass) {
                      found[this.sources[sourceId][key][k]._id] = this.sources[sourceId][key][k];
                    }
                  }
                }
              } else {
                let pass = true;
                if (hasMethod && !this.sources[sourceId][key][hasMethod])
                  pass = false;
                for (const p in props) {
                  if (typeof this.sources[sourceId][key][p] === "object" && typeof props[p] === "object") {
                    for (const pp in props[p]) {
                      if (props[p][pp] !== this.sources[sourceId][key][p][pp]) {
                        pass = false;
                        break;
                      }
                    }
                  } else if (this.sources[sourceId][key][p] !== props[p]) {
                    pass = false;
                  } else {
                    pass = false;
                    break;
                  }
                }
                if (pass) {
                  if (this.getConnection(this.sources[sourceId][key], hasMethod))
                    found[this.sources[sourceId][key]._id] = this.sources[sourceId][key];
                }
              }
            }
          }
        }
      };
      this.addConnection = (options, source) => {
        let settings = {};
        if (typeof options === "string") {
          if (this.connections[options]) {
            options = this.connections[options];
          } else {
            for (const j in this.serviceConnections) {
              for (const k in this.serviceConnections[j]) {
                if (this.serviceConnections[j][k][options]) {
                  options = { connection: this.serviceConnections[j][k][options] };
                  options.service = j;
                  settings.connectionType = j;
                  settings.connectionsKey = k;
                  break;
                }
              }
            }
          }
          if (typeof options === "string" && this.__node.nodes.get(options))
            options = { connection: this.__node.nodes.get(options) };
        }
        if (!options || typeof options === "string")
          return void 0;
        if (source)
          settings.source = source;
        if (options.connection instanceof GraphNode) {
          settings.connection = options.connection;
          let node = settings.connection;
          settings.send = async (message) => {
            if (message.method) {
              if (Array.isArray(message.args)) {
                return node[message.method]?.(...message.args);
              } else
                return node[message.method]?.(message.args);
            } else {
              if (!node.__operator)
                return;
              if (Array.isArray(message.args)) {
                return node.__operator(...message.args);
              } else
                return node.__operator(message.args);
            }
          };
          settings.request = async (message, method) => {
            if (method) {
              if (Array.isArray(message.args)) {
                return node[method]?.(...message.args);
              } else
                return node[method]?.(message.args);
            } else {
              if (!node.__operator)
                return;
              if (Array.isArray(message.args)) {
                return node.__operator(...message.args);
              } else
                return node.__operator(message.args);
            }
          };
          settings.post = async (route, args, method) => {
            if (route && node.__node.graph.get(route)) {
              let n = node.__node.graph.get(route);
              if (method) {
                if (Array.isArray(args)) {
                  return n[method]?.(...args);
                } else
                  return n[method]?.(args);
              } else {
                if (Array.isArray(args)) {
                  return n.__operator(...args);
                } else
                  return n.__operator(args);
              }
            } else {
              if (method) {
                if (Array.isArray(args)) {
                  return node[method]?.(...args);
                } else
                  return node[method]?.(args);
              } else {
                if (Array.isArray(args)) {
                  return node.__operator(...args);
                } else
                  return node.__operator(args);
              }
            }
          };
          settings.run = settings.post;
          settings.subscribe = async (callback) => {
            return node.__subscribe(callback);
          };
          settings.unsubscribe = async (sub) => {
            return node.__unsubscribe(sub);
          };
          settings.terminate = () => {
            node.__node.graph.remove(node);
            return true;
          };
          settings.onclose = options.onclose;
          if (settings.onclose) {
            node.__addOndisconnected((n) => {
              if (settings.onclose)
                settings.onclose(settings, n);
            });
          }
        } else if (options.connection instanceof Graph) {
          if (options.connection.__node.nodes.get("open"))
            settings.service = options.connection;
          let graph = settings.connection;
          settings.send = async (message) => {
            if (Array.isArray(message.args))
              graph.run(message.route, ...message.args);
            else
              graph.run(message.route, message.args);
          };
          settings.request = async (message, method) => {
            if (!message.route)
              return void 0;
            if (method) {
              if (Array.isArray(message.args)) {
                return graph.__node.nodes.get(message.route)[method]?.(...message.args);
              } else
                return graph.__node.nodes.get(message.route)[method]?.(message.args);
            } else {
              if (Array.isArray(message.args)) {
                return graph.run(message.route, ...message.args);
              } else
                return graph.run(message.route, message.args);
            }
          };
          settings.post = async (route, args, method) => {
            if (route && graph.get(route)) {
              let n = graph.get(route);
              if (method) {
                if (Array.isArray(args)) {
                  return n[method]?.(...args);
                } else
                  return n[method]?.(args);
              } else {
                if (Array.isArray(args)) {
                  return n.run(...args);
                } else
                  return n.run(args);
              }
            }
          };
          settings.run = settings.post;
          settings.subscribe = async (route, callback) => {
            return graph.subscribe(route, callback);
          };
          settings.unsubscribe = async (route, sub) => {
            return graph.unsubscribe(route, sub);
          };
          settings.terminate = (n) => {
            graph.remove(n);
            return true;
          };
        } else if (!(options._id && this.connections[options._id])) {
          let c = options.connection;
          if (typeof c === "string") {
            if (this.connections[c])
              c = this.connections[c];
            else if (options.service) {
              if (typeof options.service === "string") {
                options.service = this.services[options.service];
              }
              if (typeof options.service === "object") {
                if (options.service.connections) {
                  for (const key in options.service.connections) {
                    if (options.service.connections[key][c]) {
                      c = options.service.connections[key][c];
                      settings.connectionType = key;
                      settings.connectionsKey = c;
                      break;
                    }
                  }
                }
              }
            } else {
              for (const j in this.serviceConnections) {
                for (const k in this.serviceConnections[j]) {
                  if (this.serviceConnections[j][k][c]) {
                    c = this.serviceConnections[j][k][c];
                    options.service = j;
                    settings.connectionType = j;
                    settings.connectionsKey = k;
                    break;
                  }
                }
              }
            }
          }
          if (typeof c !== "object")
            return void 0;
          settings._id = c._id;
          settings.send = c.send;
          settings.request = c.request;
          settings.run = c.run;
          settings.post = c.post;
          settings.subscribe = c.subscribe;
          settings.unsubscribe = c.unsubscribe;
          settings.terminate = c.terminate;
          settings.onclose = options.onclose;
          if (settings.onclose) {
            if (!(c.onclose && settings.onclose.toString() === c.onclose.toString())) {
              let oldonclose = c.onclose;
              c.onclose = (...args) => {
                if (settings.onclose)
                  settings.onclose(settings, ...args);
                if (this.users[settings.source] && Object.keys(this.sources[settings.source]).length === 0) {
                  this.removeUser(settings.source, false);
                }
                if (oldonclose)
                  oldonclose(...args);
              };
            }
          } else {
            let oldonclose = c.onclose;
            c.onclose = (...args) => {
              this.removeConnection(settings);
              if (this.users[settings.source] && Object.keys(this.sources[settings.source]).length === 0) {
                this.removeUser(settings.source, false);
              }
              if (oldonclose)
                oldonclose(...args);
            };
          }
          if (options.service) {
            if (typeof options.service === "string")
              options.service = this.services[options.service];
            settings.service = options.service;
          } else if (c.graph)
            settings.service = c.graph;
        }
        if (!settings.source && options.source) {
          settings.source = options.source;
        } else if (!settings.source && options.service) {
          settings.source = typeof options.service === "object" ? options.service?.name : void 0;
        } else if (!settings.source && (settings.connection instanceof GraphNode || settings.connection instanceof Graph)) {
          settings.source = "local";
          if (!this.order.indexOf("local"))
            this.order.unshift("local");
        }
        if (!settings._id)
          settings._id = `connection${Math.floor(Math.random() * 1e15)}`;
        if (settings.source) {
          if (!this.sources[settings.source])
            this.sources[settings.source] = {};
          this.sources[settings.source][settings._id] = settings;
        }
        if (!this.connections[settings._id])
          this.connections[settings._id] = settings;
        return settings;
      };
      this.removeConnection = (connection, terminate = false) => {
        if (typeof connection === "object" && connection._id)
          connection = connection._id;
        if (typeof connection === "string") {
          if (this.connections[connection]) {
            if (terminate && this.connections[connection])
              this.connections[connection].terminate();
            delete this.connections[connection];
            for (const key in this.sources) {
              if (this.sources[key][connection])
                delete this.sources[key][connection];
              else {
                for (const k in this.sources[key]) {
                  if (this.sources[key][k]?.[connection]) {
                    delete this.sources[key][connection];
                  }
                }
              }
            }
            return true;
          } else if (this.sources[connection]) {
            for (const key in this.sources[connection]) {
              this.removeConnection(this.sources[connection][key], terminate);
            }
            return true;
          }
        }
      };
      this.routeService = (service, connections, source, order) => {
        this.services[service.name] = service;
        if (service.__node?.nodes)
          this.__node.nodes.forEach((n, k) => {
            if (!service.__node?.nodes.get(k)) {
              service.__node?.nodes.set(k, n);
            } else
              service.__node?.nodes.set(this.name + "." + k, n);
          });
        if (service.users)
          service.users = this.users;
        if (connections) {
          if (typeof connections === "string")
            this.addServiceConnections(service, connections, source);
          else {
            for (const c in connections) {
              this.addServiceConnections(service, c, source);
            }
          }
        }
        if (order)
          this.order = order;
        else {
          if (!this.order)
            this.order = [];
          this.order.push(service.name);
        }
      };
      this.addServiceConnections = (service, connectionsKey, source) => {
        if (typeof service === "string") {
          service = this.services[service];
        }
        if (connectionsKey && service[connectionsKey]) {
          let newConnections = {};
          if (!this.serviceConnections[service.name])
            this.serviceConnections[service.name] = {};
          this.serviceConnections[service.name][connectionsKey] = service[connectionsKey];
          for (const key in service[connectionsKey]) {
            if (!this.connections[key]) {
              newConnections[key] = this.addConnection({ connection: service[connectionsKey][key], service }, source);
              newConnections[key].connectionType = connectionsKey;
            }
          }
          return newConnections;
        }
      };
      this.openConnection = async (service, options, source, ...args) => {
        if (typeof service === "string") {
          service = this.services[service];
        }
        if (service?.__node.nodes) {
          let connection = service.run("open", options, ...args);
          if (connection instanceof Promise) {
            return connection.then(async (info) => {
              if (!info._id) {
                await new Promise((res, rej) => {
                  let start = performance.now();
                  let checker = () => {
                    if (!info._id) {
                      if (performance.now() - start > 3e3) {
                        rej(false);
                      } else {
                        setTimeout(() => {
                          checker();
                        }, 100);
                      }
                    } else {
                      res(true);
                    }
                  };
                  checker();
                }).catch((er) => {
                  console.error("Connections timed out:", er);
                });
              }
              if (info._id)
                this.addConnection({ connection: info, service }, source);
            });
          } else if (connection) {
            if (!connection._id) {
              await new Promise((res, rej) => {
                let start = performance.now();
                let checker = () => {
                  if (!connection._id) {
                    if (performance.now() - start > 3e3) {
                      rej(false);
                    } else {
                      setTimeout(() => {
                        checker();
                      }, 100);
                    }
                  } else {
                    res(true);
                  }
                };
                checker();
              }).catch((er) => {
                console.error("Connections timed out:", er);
              });
            }
            if (connection._id)
              return this.addConnection({ connection, service }, source);
          }
        }
      };
      this.terminate = (connection) => {
        if (typeof connection === "string")
          connection = this.connections[connection];
        return connection.terminate();
      };
      this.subscribeThroughConnection = (route, relay, endpoint, callback, ...args) => {
        if (typeof relay === "string") {
          relay = this.getConnection(relay, "run");
        }
        if (typeof relay === "object")
          return new Promise((res, rej) => {
            relay.run("routeConnections", [route, endpoint, relay._id, ...args]).then((sub) => {
              this.__node.state.subscribeTrigger(endpoint, (res2) => {
                if (res2?.callbackId === route) {
                  if (!callback)
                    this.setState({ [endpoint]: res2.args });
                  else if (typeof callback === "string") {
                    this.setState({ [callback]: res2.args });
                  } else
                    callback(res2.args);
                }
              });
              res(sub);
            }).catch(rej);
          });
      };
      this.routeConnections = (route, transmitter, receiver, ...args) => {
        let rxsrc;
        if (typeof receiver === "string") {
          if (this.sources[receiver]) {
            rxsrc = receiver;
          }
          receiver = this.getConnection(receiver, "send");
        }
        if (typeof transmitter === "string") {
          transmitter = this.getConnection(transmitter, "subscribe");
        }
        if (transmitter?.subscribe && receiver?.send) {
          let res = new Promise((res2, rej) => {
            transmitter.subscribe(
              route,
              transmitter._id,
              (res3) => {
                if (!this.connections[receiver._id] && rxsrc) {
                  if (this.sources[rxsrc]) {
                    rxsrc = receiver;
                    Object.keys(this.sources[rxsrc]).forEach((k) => {
                      if (this.sources[receiver][k].send) {
                        receiver = this.sources[receiver][k];
                      }
                    });
                  }
                }
                if (this.connections[receiver._id])
                  receiver.send({ callbackId: route, args: res3 });
              },
              ...args
            ).then((sub) => {
              res2(sub);
            });
          });
          return res;
        }
      };
      this.setUserData = (user, data) => {
        if (user) {
          if (typeof user === "string") {
            user = this.users[user];
            if (!user)
              return false;
          }
        }
        if (data) {
          if (typeof data === "string") {
            data = JSON.parse(data);
          }
        }
        if (typeof data === "object") {
          this.recursivelyAssign(user, data);
          return true;
        }
      };
      this.setTree(this);
      if (options) {
        if (options.order)
          this.order = options.order;
        if (options.graph) {
          for (const key in options.graph) {
            let opt = options.graph[key];
            if (typeof opt === "function")
              opt = new opt();
            if (opt?.__node?.nodes) {
              opt.name = key;
              opt.__node.tag = key;
              this.addServices({ [opt.name]: opt });
              this.routeService(opt, opt.connections);
            } else {
              if (typeof opt?.service === "function")
                opt.service = new opt.service();
              if (opt?.service?.__node?.nodes) {
                opt.service.name = key;
                opt.service.__node.tag = key;
                this.addServices({ [opt.service.name]: opt.service });
                this.routeService(
                  opt.service
                );
              }
              if (typeof opt?.service === "object") {
                if (opt.connections) {
                  if (Array.isArray(opt.connections)) {
                    opt.connections.forEach((k) => {
                      this.addServiceConnections(opt[key].service, k);
                    });
                  } else
                    this.addServiceConnections(opt.service, opt.connections);
                }
                if (opt.config) {
                  for (const c in opt.config) {
                    this.openConnection(
                      opt.service,
                      opt.config[c],
                      opt.config[c].source,
                      opt.config[c].args
                    );
                  }
                }
              }
            }
          }
        }
      }
    }
    removeUser(profile, terminate) {
      if (terminate)
        this.removeConnection(profile, terminate);
      if (typeof profile === "string")
        profile = this.users[profile];
      if (typeof profile === "object" && profile._id) {
        delete this.users[profile._id];
        if (profile.onclose)
          profile.onclose(profile);
      }
      return true;
    }
  };

  // worker.ts
  var url = URL.createObjectURL(new Blob([String('(()=>{var __create=Object.create;var __defProp=Object.defineProperty;var __getOwnPropDesc=Object.getOwnPropertyDescriptor;var __getOwnPropNames=Object.getOwnPropertyNames;var __getProtoOf=Object.getPrototypeOf;var __hasOwnProp=Object.prototype.hasOwnProperty;var __require=(x2=>typeof require!=="undefined"?require:typeof Proxy!=="undefined"?new Proxy(x2,{get:(a,b)=>(typeof require!=="undefined"?require:a)[b]}):x2)(function(x2){if(typeof require!=="undefined")return require.apply(this,arguments);throw new Error(\'Dynamic require of "\'+x2+\'" is not supported\')});var __commonJS=(cb,mod)=>function __require2(){return mod||(0,cb[__getOwnPropNames(cb)[0]])((mod={exports:{}}).exports,mod),mod.exports};var __copyProps=(to,from,except,desc)=>{if(from&&typeof from==="object"||typeof from==="function"){for(let key of __getOwnPropNames(from))if(!__hasOwnProp.call(to,key)&&key!==except)__defProp(to,key,{get:()=>from[key],enumerable:!(desc=__getOwnPropDesc(from,key))||desc.enumerable})}return to};var __toESM=(mod,isNodeMode,target)=>(target=mod!=null?__create(__getProtoOf(mod)):{},__copyProps(isNodeMode||!mod||!mod.__esModule?__defProp(target,"default",{value:mod,enumerable:true}):target,mod));var require_sjcl=__commonJS({"../../services/e2ee/sjcl.js"(exports,module){"use strict";var sjcl2={cipher:{},hash:{},keyexchange:{},mode:{},misc:{},codec:{},exception:{corrupt:function(a){this.toString=function(){return"CORRUPT: "+this.message};this.message=a},invalid:function(a){this.toString=function(){return"INVALID: "+this.message};this.message=a},bug:function(a){this.toString=function(){return"BUG: "+this.message};this.message=a},notReady:function(a){this.toString=function(){return"NOT READY: "+this.message};this.message=a}}};sjcl2.cipher.aes=function(a){this.s[0][0][0]||this.O();var b,c,d,e,f=this.s[0][4],g=this.s[1];b=a.length;var h=1;if(4!==b&&6!==b&&8!==b)throw new sjcl2.exception.invalid("invalid aes key size");this.b=[d=a.slice(0),e=[]];for(a=b;a<4*b+28;a++){c=d[a-1];if(0===a%b||8===b&&4===a%b)c=f[c>>>24]<<24^f[c>>16&255]<<16^f[c>>8&255]<<8^f[c&255],0===a%b&&(c=c<<8^c>>>24^h<<24,h=h<<1^283*(h>>7));d[a]=d[a-b]^c}for(b=0;a;b++,a--)c=d[b&3?a:a-4],e[b]=4>=a||4>b?c:g[0][f[c>>>24]]^g[1][f[c>>16&255]]^g[2][f[c>>8&255]]^g[3][f[c&255]]};sjcl2.cipher.aes.prototype={encrypt:function(a){return t(this,a,0)},decrypt:function(a){return t(this,a,1)},s:[[[],[],[],[],[]],[[],[],[],[],[]]],O:function(){var a=this.s[0],b=this.s[1],c=a[4],d=b[4],e,f,g,h=[],k=[],l,n,m,p;for(e=0;256>e;e++)k[(h[e]=e<<1^283*(e>>7))^e]=e;for(f=g=0;!c[f];f^=l||1,g=k[g]||1)for(m=g^g<<1^g<<2^g<<3^g<<4,m=m>>8^m&255^99,c[f]=m,d[m]=f,n=h[e=h[l=h[f]]],p=16843009*n^65537*e^257*l^16843008*f,n=257*h[m]^16843008*m,e=0;4>e;e++)a[e][f]=n=n<<24^n>>>8,b[e][m]=p=p<<24^p>>>8;for(e=0;5>e;e++)a[e]=a[e].slice(0),b[e]=b[e].slice(0)}};function t(a,b,c){if(4!==b.length)throw new sjcl2.exception.invalid("invalid aes block size");var d=a.b[c],e=b[0]^d[0],f=b[c?3:1]^d[1],g=b[2]^d[2];b=b[c?1:3]^d[3];var h,k,l,n=d.length/4-2,m,p=4,r=[0,0,0,0];h=a.s[c];a=h[0];var q=h[1],v=h[2],w=h[3],x2=h[4];for(m=0;m<n;m++)h=a[e>>>24]^q[f>>16&255]^v[g>>8&255]^w[b&255]^d[p],k=a[f>>>24]^q[g>>16&255]^v[b>>8&255]^w[e&255]^d[p+1],l=a[g>>>24]^q[b>>16&255]^v[e>>8&255]^w[f&255]^d[p+2],b=a[b>>>24]^q[e>>16&255]^v[f>>8&255]^w[g&255]^d[p+3],p+=4,e=h,f=k,g=l;for(m=0;4>m;m++)r[c?3&-m:m]=x2[e>>>24]<<24^x2[f>>16&255]<<16^x2[g>>8&255]<<8^x2[b&255]^d[p++],h=e,e=f,f=g,g=b,b=h;return r}sjcl2.bitArray={bitSlice:function(a,b,c){a=sjcl2.bitArray.$(a.slice(b/32),32-(b&31)).slice(1);return void 0===c?a:sjcl2.bitArray.clamp(a,c-b)},extract:function(a,b,c){var d=Math.floor(-b-c&31);return((b+c-1^b)&-32?a[b/32|0]<<32-d^a[b/32+1|0]>>>d:a[b/32|0]>>>d)&(1<<c)-1},concat:function(a,b){if(0===a.length||0===b.length)return a.concat(b);var c=a[a.length-1],d=sjcl2.bitArray.getPartial(c);return 32===d?a.concat(b):sjcl2.bitArray.$(b,d,c|0,a.slice(0,a.length-1))},bitLength:function(a){var b=a.length;return 0===b?0:32*(b-1)+sjcl2.bitArray.getPartial(a[b-1])},clamp:function(a,b){if(32*a.length<b)return a;a=a.slice(0,Math.ceil(b/32));var c=a.length;b=b&31;0<c&&b&&(a[c-1]=sjcl2.bitArray.partial(b,a[c-1]&2147483648>>b-1,1));return a},partial:function(a,b,c){return 32===a?b:(c?b|0:b<<32-a)+1099511627776*a},getPartial:function(a){return Math.round(a/1099511627776)||32},equal:function(a,b){if(sjcl2.bitArray.bitLength(a)!==sjcl2.bitArray.bitLength(b))return false;var c=0,d;for(d=0;d<a.length;d++)c|=a[d]^b[d];return 0===c},$:function(a,b,c,d){var e;e=0;for(void 0===d&&(d=[]);32<=b;b-=32)d.push(c),c=0;if(0===b)return d.concat(a);for(e=0;e<a.length;e++)d.push(c|a[e]>>>b),c=a[e]<<32-b;e=a.length?a[a.length-1]:0;a=sjcl2.bitArray.getPartial(e);d.push(sjcl2.bitArray.partial(b+a&31,32<b+a?c:d.pop(),1));return d},i:function(a,b){return[a[0]^b[0],a[1]^b[1],a[2]^b[2],a[3]^b[3]]},byteswapM:function(a){var b,c;for(b=0;b<a.length;++b)c=a[b],a[b]=c>>>24|c>>>8&65280|(c&65280)<<8|c<<24;return a}};sjcl2.codec.utf8String={fromBits:function(a){var b="",c=sjcl2.bitArray.bitLength(a),d,e;for(d=0;d<c/8;d++)0===(d&3)&&(e=a[d/4]),b+=String.fromCharCode(e>>>8>>>8>>>8),e<<=8;return decodeURIComponent(escape(b))},toBits:function(a){a=unescape(encodeURIComponent(a));var b=[],c,d=0;for(c=0;c<a.length;c++)d=d<<8|a.charCodeAt(c),3===(c&3)&&(b.push(d),d=0);c&3&&b.push(sjcl2.bitArray.partial(8*(c&3),d));return b}};sjcl2.codec.hex={fromBits:function(a){var b="",c;for(c=0;c<a.length;c++)b+=((a[c]|0)+0xf00000000000).toString(16).substr(4);return b.substr(0,sjcl2.bitArray.bitLength(a)/4)},toBits:function(a){var b,c=[],d;a=a.replace(/\\s|0x/g,"");d=a.length;a=a+"00000000";for(b=0;b<a.length;b+=8)c.push(parseInt(a.substr(b,8),16)^0);return sjcl2.bitArray.clamp(c,4*d)}};sjcl2.codec.base32={B:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",X:"0123456789ABCDEFGHIJKLMNOPQRSTUV",BITS:32,BASE:5,REMAINING:27,fromBits:function(a,b,c){var d=sjcl2.codec.base32.BASE,e=sjcl2.codec.base32.REMAINING,f="",g=0,h=sjcl2.codec.base32.B,k=0,l=sjcl2.bitArray.bitLength(a);c&&(h=sjcl2.codec.base32.X);for(c=0;f.length*d<l;)f+=h.charAt((k^a[c]>>>g)>>>e),g<d?(k=a[c]<<d-g,g+=e,c++):(k<<=d,g-=d);for(;f.length&7&&!b;)f+="=";return f},toBits:function(a,b){a=a.replace(/\\s|=/g,"").toUpperCase();var c=sjcl2.codec.base32.BITS,d=sjcl2.codec.base32.BASE,e=sjcl2.codec.base32.REMAINING,f=[],g,h=0,k=sjcl2.codec.base32.B,l=0,n,m="base32";b&&(k=sjcl2.codec.base32.X,m="base32hex");for(g=0;g<a.length;g++){n=k.indexOf(a.charAt(g));if(0>n){if(!b)try{return sjcl2.codec.base32hex.toBits(a)}catch(p){}throw new sjcl2.exception.invalid("this isn\'t "+m+"!")}h>e?(h-=e,f.push(l^n>>>h),l=n<<c-h):(h+=d,l^=n<<c-h)}h&56&&f.push(sjcl2.bitArray.partial(h&56,l,1));return f}};sjcl2.codec.base32hex={fromBits:function(a,b){return sjcl2.codec.base32.fromBits(a,b,1)},toBits:function(a){return sjcl2.codec.base32.toBits(a,1)}};sjcl2.codec.base64={B:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",fromBits:function(a,b,c){var d="",e=0,f=sjcl2.codec.base64.B,g=0,h=sjcl2.bitArray.bitLength(a);c&&(f=f.substr(0,62)+"-_");for(c=0;6*d.length<h;)d+=f.charAt((g^a[c]>>>e)>>>26),6>e?(g=a[c]<<6-e,e+=26,c++):(g<<=6,e-=6);for(;d.length&3&&!b;)d+="=";return d},toBits:function(a,b){a=a.replace(/\\s|=/g,"");var c=[],d,e=0,f=sjcl2.codec.base64.B,g=0,h;b&&(f=f.substr(0,62)+"-_");for(d=0;d<a.length;d++){h=f.indexOf(a.charAt(d));if(0>h)throw new sjcl2.exception.invalid("this isn\'t base64!");26<e?(e-=26,c.push(g^h>>>e),g=h<<32-e):(e+=6,g^=h<<32-e)}e&56&&c.push(sjcl2.bitArray.partial(e&56,g,1));return c}};sjcl2.codec.base64url={fromBits:function(a){return sjcl2.codec.base64.fromBits(a,1,1)},toBits:function(a){return sjcl2.codec.base64.toBits(a,1)}};sjcl2.hash.sha256=function(a){this.b[0]||this.O();a?(this.F=a.F.slice(0),this.A=a.A.slice(0),this.l=a.l):this.reset()};sjcl2.hash.sha256.hash=function(a){return new sjcl2.hash.sha256().update(a).finalize()};sjcl2.hash.sha256.prototype={blockSize:512,reset:function(){this.F=this.Y.slice(0);this.A=[];this.l=0;return this},update:function(a){"string"===typeof a&&(a=sjcl2.codec.utf8String.toBits(a));var b,c=this.A=sjcl2.bitArray.concat(this.A,a);b=this.l;a=this.l=b+sjcl2.bitArray.bitLength(a);if(9007199254740991<a)throw new sjcl2.exception.invalid("Cannot hash more than 2^53 - 1 bits");if("undefined"!==typeof Uint32Array){var d=new Uint32Array(c),e=0;for(b=512+b-(512+b&511);b<=a;b+=512)u(this,d.subarray(16*e,16*(e+1))),e+=1;c.splice(0,16*e)}else for(b=512+b-(512+b&511);b<=a;b+=512)u(this,c.splice(0,16));return this},finalize:function(){var a,b=this.A,c=this.F,b=sjcl2.bitArray.concat(b,[sjcl2.bitArray.partial(1,1)]);for(a=b.length+2;a&15;a++)b.push(0);b.push(Math.floor(this.l/4294967296));for(b.push(this.l|0);b.length;)u(this,b.splice(0,16));this.reset();return c},Y:[],b:[],O:function(){function a(a2){return 4294967296*(a2-Math.floor(a2))|0}for(var b=0,c=2,d,e;64>b;c++){e=true;for(d=2;d*d<=c;d++)if(0===c%d){e=false;break}e&&(8>b&&(this.Y[b]=a(Math.pow(c,.5))),this.b[b]=a(Math.pow(c,1/3)),b++)}}};function u(a,b){var c,d,e,f=a.F,g=a.b,h=f[0],k=f[1],l=f[2],n=f[3],m=f[4],p=f[5],r=f[6],q=f[7];for(c=0;64>c;c++)16>c?d=b[c]:(d=b[c+1&15],e=b[c+14&15],d=b[c&15]=(d>>>7^d>>>18^d>>>3^d<<25^d<<14)+(e>>>17^e>>>19^e>>>10^e<<15^e<<13)+b[c&15]+b[c+9&15]|0),d=d+q+(m>>>6^m>>>11^m>>>25^m<<26^m<<21^m<<7)+(r^m&(p^r))+g[c],q=r,r=p,p=m,m=n+d|0,n=l,l=k,k=h,h=d+(k&l^n&(k^l))+(k>>>2^k>>>13^k>>>22^k<<30^k<<19^k<<10)|0;f[0]=f[0]+h|0;f[1]=f[1]+k|0;f[2]=f[2]+l|0;f[3]=f[3]+n|0;f[4]=f[4]+m|0;f[5]=f[5]+p|0;f[6]=f[6]+r|0;f[7]=f[7]+q|0}sjcl2.mode.ccm={name:"ccm",G:[],listenProgress:function(a){sjcl2.mode.ccm.G.push(a)},unListenProgress:function(a){a=sjcl2.mode.ccm.G.indexOf(a);-1<a&&sjcl2.mode.ccm.G.splice(a,1)},fa:function(a){var b=sjcl2.mode.ccm.G.slice(),c;for(c=0;c<b.length;c+=1)b[c](a)},encrypt:function(a,b,c,d,e){var f,g=b.slice(0),h=sjcl2.bitArray,k=h.bitLength(c)/8,l=h.bitLength(g)/8;e=e||64;d=d||[];if(7>k)throw new sjcl2.exception.invalid("ccm: iv must be at least 7 bytes");for(f=2;4>f&&l>>>8*f;f++);f<15-k&&(f=15-k);c=h.clamp(c,8*(15-f));b=sjcl2.mode.ccm.V(a,b,c,d,e,f);g=sjcl2.mode.ccm.C(a,g,c,b,e,f);return h.concat(g.data,g.tag)},decrypt:function(a,b,c,d,e){e=e||64;d=d||[];var f=sjcl2.bitArray,g=f.bitLength(c)/8,h=f.bitLength(b),k=f.clamp(b,h-e),l=f.bitSlice(b,h-e),h=(h-e)/8;if(7>g)throw new sjcl2.exception.invalid("ccm: iv must be at least 7 bytes");for(b=2;4>b&&h>>>8*b;b++);b<15-g&&(b=15-g);c=f.clamp(c,8*(15-b));k=sjcl2.mode.ccm.C(a,k,c,l,e,b);a=sjcl2.mode.ccm.V(a,k.data,c,d,e,b);if(!f.equal(k.tag,a))throw new sjcl2.exception.corrupt("ccm: tag doesn\'t match");return k.data},na:function(a,b,c,d,e,f){var g=[],h=sjcl2.bitArray,k=h.i;d=[h.partial(8,(b.length?64:0)|d-2<<2|f-1)];d=h.concat(d,c);d[3]|=e;d=a.encrypt(d);if(b.length)for(c=h.bitLength(b)/8,65279>=c?g=[h.partial(16,c)]:4294967295>=c&&(g=h.concat([h.partial(16,65534)],[c])),g=h.concat(g,b),b=0;b<g.length;b+=4)d=a.encrypt(k(d,g.slice(b,b+4).concat([0,0,0])));return d},V:function(a,b,c,d,e,f){var g=sjcl2.bitArray,h=g.i;e/=8;if(e%2||4>e||16<e)throw new sjcl2.exception.invalid("ccm: invalid tag length");if(4294967295<d.length||4294967295<b.length)throw new sjcl2.exception.bug("ccm: can\'t deal with 4GiB or more data");c=sjcl2.mode.ccm.na(a,d,c,e,g.bitLength(b)/8,f);for(d=0;d<b.length;d+=4)c=a.encrypt(h(c,b.slice(d,d+4).concat([0,0,0])));return g.clamp(c,8*e)},C:function(a,b,c,d,e,f){var g,h=sjcl2.bitArray;g=h.i;var k=b.length,l=h.bitLength(b),n=k/50,m=n;c=h.concat([h.partial(8,f-1)],c).concat([0,0,0]).slice(0,4);d=h.bitSlice(g(d,a.encrypt(c)),0,e);if(!k)return{tag:d,data:[]};for(g=0;g<k;g+=4)g>n&&(sjcl2.mode.ccm.fa(g/k),n+=m),c[3]++,e=a.encrypt(c),b[g]^=e[0],b[g+1]^=e[1],b[g+2]^=e[2],b[g+3]^=e[3];return{tag:d,data:h.clamp(b,l)}}};sjcl2.mode.ocb2={name:"ocb2",encrypt:function(a,b,c,d,e,f){if(128!==sjcl2.bitArray.bitLength(c))throw new sjcl2.exception.invalid("ocb iv must be 128 bits");var g,h=sjcl2.mode.ocb2.S,k=sjcl2.bitArray,l=k.i,n=[0,0,0,0];c=h(a.encrypt(c));var m,p=[];d=d||[];e=e||64;for(g=0;g+4<b.length;g+=4)m=b.slice(g,g+4),n=l(n,m),p=p.concat(l(c,a.encrypt(l(c,m)))),c=h(c);m=b.slice(g);b=k.bitLength(m);g=a.encrypt(l(c,[0,0,0,b]));m=k.clamp(l(m.concat([0,0,0]),g),b);n=l(n,l(m.concat([0,0,0]),g));n=a.encrypt(l(n,l(c,h(c))));d.length&&(n=l(n,f?d:sjcl2.mode.ocb2.pmac(a,d)));return p.concat(k.concat(m,k.clamp(n,e)))},decrypt:function(a,b,c,d,e,f){if(128!==sjcl2.bitArray.bitLength(c))throw new sjcl2.exception.invalid("ocb iv must be 128 bits");e=e||64;var g=sjcl2.mode.ocb2.S,h=sjcl2.bitArray,k=h.i,l=[0,0,0,0],n=g(a.encrypt(c)),m,p,r=sjcl2.bitArray.bitLength(b)-e,q=[];d=d||[];for(c=0;c+4<r/32;c+=4)m=k(n,a.decrypt(k(n,b.slice(c,c+4)))),l=k(l,m),q=q.concat(m),n=g(n);p=r-32*c;m=a.encrypt(k(n,[0,0,0,p]));m=k(m,h.clamp(b.slice(c),p).concat([0,0,0]));l=k(l,m);l=a.encrypt(k(l,k(n,g(n))));d.length&&(l=k(l,f?d:sjcl2.mode.ocb2.pmac(a,d)));if(!h.equal(h.clamp(l,e),h.bitSlice(b,r)))throw new sjcl2.exception.corrupt("ocb: tag doesn\'t match");return q.concat(h.clamp(m,p))},pmac:function(a,b){var c,d=sjcl2.mode.ocb2.S,e=sjcl2.bitArray,f=e.i,g=[0,0,0,0],h=a.encrypt([0,0,0,0]),h=f(h,d(d(h)));for(c=0;c+4<b.length;c+=4)h=d(h),g=f(g,a.encrypt(f(h,b.slice(c,c+4))));c=b.slice(c);128>e.bitLength(c)&&(h=f(h,d(h)),c=e.concat(c,[-2147483648,0,0,0]));g=f(g,c);return a.encrypt(f(d(f(h,d(h))),g))},S:function(a){return[a[0]<<1^a[1]>>>31,a[1]<<1^a[2]>>>31,a[2]<<1^a[3]>>>31,a[3]<<1^135*(a[0]>>>31)]}};sjcl2.mode.gcm={name:"gcm",encrypt:function(a,b,c,d,e){var f=b.slice(0);b=sjcl2.bitArray;d=d||[];a=sjcl2.mode.gcm.C(true,a,f,d,c,e||128);return b.concat(a.data,a.tag)},decrypt:function(a,b,c,d,e){var f=b.slice(0),g=sjcl2.bitArray,h=g.bitLength(f);e=e||128;d=d||[];e<=h?(b=g.bitSlice(f,h-e),f=g.bitSlice(f,0,h-e)):(b=f,f=[]);a=sjcl2.mode.gcm.C(false,a,f,d,c,e);if(!g.equal(a.tag,b))throw new sjcl2.exception.corrupt("gcm: tag doesn\'t match");return a.data},ka:function(a,b){var c,d,e,f,g,h=sjcl2.bitArray.i;e=[0,0,0,0];f=b.slice(0);for(c=0;128>c;c++){(d=0!==(a[Math.floor(c/32)]&1<<31-c%32))&&(e=h(e,f));g=0!==(f[3]&1);for(d=3;0<d;d--)f[d]=f[d]>>>1|(f[d-1]&1)<<31;f[0]>>>=1;g&&(f[0]^=-520093696)}return e},j:function(a,b,c){var d,e=c.length;b=b.slice(0);for(d=0;d<e;d+=4)b[0]^=4294967295&c[d],b[1]^=4294967295&c[d+1],b[2]^=4294967295&c[d+2],b[3]^=4294967295&c[d+3],b=sjcl2.mode.gcm.ka(b,a);return b},C:function(a,b,c,d,e,f){var g,h,k,l,n,m,p,r,q=sjcl2.bitArray;m=c.length;p=q.bitLength(c);r=q.bitLength(d);h=q.bitLength(e);g=b.encrypt([0,0,0,0]);96===h?(e=e.slice(0),e=q.concat(e,[1])):(e=sjcl2.mode.gcm.j(g,[0,0,0,0],e),e=sjcl2.mode.gcm.j(g,e,[0,0,Math.floor(h/4294967296),h&4294967295]));h=sjcl2.mode.gcm.j(g,[0,0,0,0],d);n=e.slice(0);d=h.slice(0);a||(d=sjcl2.mode.gcm.j(g,h,c));for(l=0;l<m;l+=4)n[3]++,k=b.encrypt(n),c[l]^=k[0],c[l+1]^=k[1],c[l+2]^=k[2],c[l+3]^=k[3];c=q.clamp(c,p);a&&(d=sjcl2.mode.gcm.j(g,h,c));a=[Math.floor(r/4294967296),r&4294967295,Math.floor(p/4294967296),p&4294967295];d=sjcl2.mode.gcm.j(g,d,a);k=b.encrypt(e);d[0]^=k[0];d[1]^=k[1];d[2]^=k[2];d[3]^=k[3];return{tag:q.bitSlice(d,0,f),data:c}}};sjcl2.misc.hmac=function(a,b){this.W=b=b||sjcl2.hash.sha256;var c=[[],[]],d,e=b.prototype.blockSize/32;this.w=[new b,new b];a.length>e&&(a=b.hash(a));for(d=0;d<e;d++)c[0][d]=a[d]^909522486,c[1][d]=a[d]^1549556828;this.w[0].update(c[0]);this.w[1].update(c[1]);this.R=new b(this.w[0])};sjcl2.misc.hmac.prototype.encrypt=sjcl2.misc.hmac.prototype.mac=function(a){if(this.aa)throw new sjcl2.exception.invalid("encrypt on already updated hmac called!");this.update(a);return this.digest(a)};sjcl2.misc.hmac.prototype.reset=function(){this.R=new this.W(this.w[0]);this.aa=false};sjcl2.misc.hmac.prototype.update=function(a){this.aa=true;this.R.update(a)};sjcl2.misc.hmac.prototype.digest=function(){var a=this.R.finalize(),a=new this.W(this.w[1]).update(a).finalize();this.reset();return a};sjcl2.misc.pbkdf2=function(a,b,c,d,e){c=c||1e4;if(0>d||0>c)throw new sjcl2.exception.invalid("invalid params to pbkdf2");"string"===typeof a&&(a=sjcl2.codec.utf8String.toBits(a));"string"===typeof b&&(b=sjcl2.codec.utf8String.toBits(b));e=e||sjcl2.misc.hmac;a=new e(a);var f,g,h,k,l=[],n=sjcl2.bitArray;for(k=1;32*l.length<(d||1);k++){e=f=a.encrypt(n.concat(b,[k]));for(g=1;g<c;g++)for(f=a.encrypt(f),h=0;h<f.length;h++)e[h]^=f[h];l=l.concat(e)}d&&(l=n.clamp(l,d));return l};sjcl2.prng=function(a){this.c=[new sjcl2.hash.sha256];this.m=[0];this.P=0;this.H={};this.N=0;this.U={};this.Z=this.f=this.o=this.ha=0;this.b=[0,0,0,0,0,0,0,0];this.h=[0,0,0,0];this.L=void 0;this.M=a;this.D=false;this.K={progress:{},seeded:{}};this.u=this.ga=0;this.I=1;this.J=2;this.ca=65536;this.T=[0,48,64,96,128,192,256,384,512,768,1024];this.da=3e4;this.ba=80};sjcl2.prng.prototype={randomWords:function(a,b){var c=[],d;d=this.isReady(b);var e;if(d===this.u)throw new sjcl2.exception.notReady("generator isn\'t seeded");if(d&this.J){d=!(d&this.I);e=[];var f=0,g;this.Z=e[0]=new Date().valueOf()+this.da;for(g=0;16>g;g++)e.push(4294967296*Math.random()|0);for(g=0;g<this.c.length&&(e=e.concat(this.c[g].finalize()),f+=this.m[g],this.m[g]=0,d||!(this.P&1<<g));g++);this.P>=1<<this.c.length&&(this.c.push(new sjcl2.hash.sha256),this.m.push(0));this.f-=f;f>this.o&&(this.o=f);this.P++;this.b=sjcl2.hash.sha256.hash(this.b.concat(e));this.L=new sjcl2.cipher.aes(this.b);for(d=0;4>d&&(this.h[d]=this.h[d]+1|0,!this.h[d]);d++);}for(d=0;d<a;d+=4)0===(d+1)%this.ca&&y(this),e=z(this),c.push(e[0],e[1],e[2],e[3]);y(this);return c.slice(0,a)},setDefaultParanoia:function(a,b){if(0===a&&"Setting paranoia=0 will ruin your security; use it only for testing"!==b)throw new sjcl2.exception.invalid("Setting paranoia=0 will ruin your security; use it only for testing");this.M=a},addEntropy:function(a,b,c){c=c||"user";var d,e,f=new Date().valueOf(),g=this.H[c],h=this.isReady(),k=0;d=this.U[c];void 0===d&&(d=this.U[c]=this.ha++);void 0===g&&(g=this.H[c]=0);this.H[c]=(this.H[c]+1)%this.c.length;switch(typeof a){case"number":void 0===b&&(b=1);this.c[g].update([d,this.N++,1,b,f,1,a|0]);break;case"object":c=Object.prototype.toString.call(a);if("[object Uint32Array]"===c){e=[];for(c=0;c<a.length;c++)e.push(a[c]);a=e}else for("[object Array]"!==c&&(k=1),c=0;c<a.length&&!k;c++)"number"!==typeof a[c]&&(k=1);if(!k){if(void 0===b)for(c=b=0;c<a.length;c++)for(e=a[c];0<e;)b++,e=e>>>1;this.c[g].update([d,this.N++,2,b,f,a.length].concat(a))}break;case"string":void 0===b&&(b=a.length);this.c[g].update([d,this.N++,3,b,f,a.length]);this.c[g].update(a);break;default:k=1}if(k)throw new sjcl2.exception.bug("random: addEntropy only supports number, array of numbers or string");this.m[g]+=b;this.f+=b;h===this.u&&(this.isReady()!==this.u&&A("seeded",Math.max(this.o,this.f)),A("progress",this.getProgress()))},isReady:function(a){a=this.T[void 0!==a?a:this.M];return this.o&&this.o>=a?this.m[0]>this.ba&&new Date().valueOf()>this.Z?this.J|this.I:this.I:this.f>=a?this.J|this.u:this.u},getProgress:function(a){a=this.T[a?a:this.M];return this.o>=a?1:this.f>a?1:this.f/a},startCollectors:function(){if(!this.D){this.a={loadTimeCollector:B(this,this.ma),mouseCollector:B(this,this.oa),keyboardCollector:B(this,this.la),accelerometerCollector:B(this,this.ea),touchCollector:B(this,this.qa)};if(window.addEventListener)window.addEventListener("load",this.a.loadTimeCollector,false),window.addEventListener("mousemove",this.a.mouseCollector,false),window.addEventListener("keypress",this.a.keyboardCollector,false),window.addEventListener("devicemotion",this.a.accelerometerCollector,false),window.addEventListener("touchmove",this.a.touchCollector,false);else if(document.attachEvent)document.attachEvent("onload",this.a.loadTimeCollector),document.attachEvent("onmousemove",this.a.mouseCollector),document.attachEvent("keypress",this.a.keyboardCollector);else throw new sjcl2.exception.bug("can\'t attach event");this.D=true}},stopCollectors:function(){this.D&&(window.removeEventListener?(window.removeEventListener("load",this.a.loadTimeCollector,false),window.removeEventListener("mousemove",this.a.mouseCollector,false),window.removeEventListener("keypress",this.a.keyboardCollector,false),window.removeEventListener("devicemotion",this.a.accelerometerCollector,false),window.removeEventListener("touchmove",this.a.touchCollector,false)):document.detachEvent&&(document.detachEvent("onload",this.a.loadTimeCollector),document.detachEvent("onmousemove",this.a.mouseCollector),document.detachEvent("keypress",this.a.keyboardCollector)),this.D=false)},addEventListener:function(a,b){this.K[a][this.ga++]=b},removeEventListener:function(a,b){var c,d,e=this.K[a],f=[];for(d in e)e.hasOwnProperty(d)&&e[d]===b&&f.push(d);for(c=0;c<f.length;c++)d=f[c],delete e[d]},la:function(){C(this,1)},oa:function(a){var b,c;try{b=a.x||a.clientX||a.offsetX||0,c=a.y||a.clientY||a.offsetY||0}catch(d){c=b=0}0!=b&&0!=c&&this.addEntropy([b,c],2,"mouse");C(this,0)},qa:function(a){a=a.touches[0]||a.changedTouches[0];this.addEntropy([a.pageX||a.clientX,a.pageY||a.clientY],1,"touch");C(this,0)},ma:function(){C(this,2)},ea:function(a){a=a.accelerationIncludingGravity.x||a.accelerationIncludingGravity.y||a.accelerationIncludingGravity.z;if(window.orientation){var b=window.orientation;"number"===typeof b&&this.addEntropy(b,1,"accelerometer")}a&&this.addEntropy(a,2,"accelerometer");C(this,0)}};function A(a,b){var c,d=sjcl2.random.K[a],e=[];for(c in d)d.hasOwnProperty(c)&&e.push(d[c]);for(c=0;c<e.length;c++)e[c](b)}function C(a,b){"undefined"!==typeof window&&window.performance&&"function"===typeof window.performance.now?a.addEntropy(window.performance.now(),b,"loadtime"):a.addEntropy(new Date().valueOf(),b,"loadtime")}function y(a){a.b=z(a).concat(z(a));a.L=new sjcl2.cipher.aes(a.b)}function z(a){for(var b=0;4>b&&(a.h[b]=a.h[b]+1|0,!a.h[b]);b++);return a.L.encrypt(a.h)}function B(a,b){return function(){b.apply(a,arguments)}}sjcl2.random=new sjcl2.prng(6);a:try{if(G="undefined"!==typeof module&&module.exports){try{H=__require("crypto")}catch(a){H=null}G=E=H}if(G&&E.randomBytes)D=E.randomBytes(128),D=new Uint32Array(new Uint8Array(D).buffer),sjcl2.random.addEntropy(D,1024,"crypto[\'randomBytes\']");else if("undefined"!==typeof window&&"undefined"!==typeof Uint32Array){F=new Uint32Array(32);if(window.crypto&&window.crypto.getRandomValues)window.crypto.getRandomValues(F);else if(window.msCrypto&&window.msCrypto.getRandomValues)window.msCrypto.getRandomValues(F);else break a;sjcl2.random.addEntropy(F,1024,"crypto[\'getRandomValues\']")}}catch(a){"undefined"!==typeof window&&window.console&&(console.log("There was an error collecting entropy from the browser:"),console.log(a))}var D;var E;var F;var G;var H;sjcl2.json={defaults:{v:1,iter:1e4,ks:128,ts:64,mode:"ccm",adata:"",cipher:"aes"},ja:function(a,b,c,d){c=c||{};d=d||{};var e=sjcl2.json,f=e.g({iv:sjcl2.random.randomWords(4,0)},e.defaults),g;e.g(f,c);c=f.adata;"string"===typeof f.salt&&(f.salt=sjcl2.codec.base64.toBits(f.salt));"string"===typeof f.iv&&(f.iv=sjcl2.codec.base64.toBits(f.iv));if(!sjcl2.mode[f.mode]||!sjcl2.cipher[f.cipher]||"string"===typeof a&&100>=f.iter||64!==f.ts&&96!==f.ts&&128!==f.ts||128!==f.ks&&192!==f.ks&&256!==f.ks||2>f.iv.length||4<f.iv.length)throw new sjcl2.exception.invalid("json encrypt: invalid parameters");"string"===typeof a?(g=sjcl2.misc.cachedPbkdf2(a,f),a=g.key.slice(0,f.ks/32),f.salt=g.salt):sjcl2.ecc&&a instanceof sjcl2.ecc.elGamal.publicKey&&(g=a.kem(),f.kemtag=g.tag,a=g.key.slice(0,f.ks/32));"string"===typeof b&&(b=sjcl2.codec.utf8String.toBits(b));"string"===typeof c&&(f.adata=c=sjcl2.codec.utf8String.toBits(c));g=new sjcl2.cipher[f.cipher](a);e.g(d,f);d.key=a;f.ct="ccm"===f.mode&&sjcl2.arrayBuffer&&sjcl2.arrayBuffer.ccm&&b instanceof ArrayBuffer?sjcl2.arrayBuffer.ccm.encrypt(g,b,f.iv,c,f.ts):sjcl2.mode[f.mode].encrypt(g,b,f.iv,c,f.ts);return f},encrypt:function(a,b,c,d){var e=sjcl2.json,f=e.ja.apply(e,arguments);return e.encode(f)},ia:function(a,b,c,d){c=c||{};d=d||{};var e=sjcl2.json;b=e.g(e.g(e.g({},e.defaults),b),c,true);var f,g;f=b.adata;"string"===typeof b.salt&&(b.salt=sjcl2.codec.base64.toBits(b.salt));"string"===typeof b.iv&&(b.iv=sjcl2.codec.base64.toBits(b.iv));if(!sjcl2.mode[b.mode]||!sjcl2.cipher[b.cipher]||"string"===typeof a&&100>=b.iter||64!==b.ts&&96!==b.ts&&128!==b.ts||128!==b.ks&&192!==b.ks&&256!==b.ks||!b.iv||2>b.iv.length||4<b.iv.length)throw new sjcl2.exception.invalid("json decrypt: invalid parameters");"string"===typeof a?(g=sjcl2.misc.cachedPbkdf2(a,b),a=g.key.slice(0,b.ks/32),b.salt=g.salt):sjcl2.ecc&&a instanceof sjcl2.ecc.elGamal.secretKey&&(a=a.unkem(sjcl2.codec.base64.toBits(b.kemtag)).slice(0,b.ks/32));"string"===typeof f&&(f=sjcl2.codec.utf8String.toBits(f));g=new sjcl2.cipher[b.cipher](a);f="ccm"===b.mode&&sjcl2.arrayBuffer&&sjcl2.arrayBuffer.ccm&&b.ct instanceof ArrayBuffer?sjcl2.arrayBuffer.ccm.decrypt(g,b.ct,b.iv,b.tag,f,b.ts):sjcl2.mode[b.mode].decrypt(g,b.ct,b.iv,f,b.ts);e.g(d,b);d.key=a;return 1===c.raw?f:sjcl2.codec.utf8String.fromBits(f)},decrypt:function(a,b,c,d){var e=sjcl2.json;return e.ia(a,e.decode(b),c,d)},encode:function(a){var b,c="{",d="";for(b in a)if(a.hasOwnProperty(b)){if(!b.match(/^[a-z0-9]+$/i))throw new sjcl2.exception.invalid("json encode: invalid property name");c+=d+\'"\'+b+\'":\';d=",";switch(typeof a[b]){case"number":case"boolean":c+=a[b];break;case"string":c+=\'"\'+escape(a[b])+\'"\';break;case"object":c+=\'"\'+sjcl2.codec.base64.fromBits(a[b],0)+\'"\';break;default:throw new sjcl2.exception.bug("json encode: unsupported type")}}return c+"}"},decode:function(a){a=a.replace(/\\s/g,"");if(!a.match(/^\\{.*\\}$/))throw new sjcl2.exception.invalid("json decode: this isn\'t json!");a=a.replace(/^\\{|\\}$/g,"").split(/,/);var b={},c,d;for(c=0;c<a.length;c++){if(!(d=a[c].match(/^\\s*(?:(["\']?)([a-z][a-z0-9]*)\\1)\\s*:\\s*(?:(-?\\d+)|"([a-z0-9+\\/%*_.@=\\-]*)"|(true|false))$/i)))throw new sjcl2.exception.invalid("json decode: this isn\'t json!");null!=d[3]?b[d[2]]=parseInt(d[3],10):null!=d[4]?b[d[2]]=d[2].match(/^(ct|adata|salt|iv)$/)?sjcl2.codec.base64.toBits(d[4]):unescape(d[4]):null!=d[5]&&(b[d[2]]="true"===d[5])}return b},g:function(a,b,c){void 0===a&&(a={});if(void 0===b)return a;for(var d in b)if(b.hasOwnProperty(d)){if(c&&void 0!==a[d]&&a[d]!==b[d])throw new sjcl2.exception.invalid("required parameter overridden");a[d]=b[d]}return a},sa:function(a,b){var c={},d;for(d in a)a.hasOwnProperty(d)&&a[d]!==b[d]&&(c[d]=a[d]);return c},ra:function(a,b){var c={},d;for(d=0;d<b.length;d++)void 0!==a[b[d]]&&(c[b[d]]=a[b[d]]);return c}};sjcl2.encrypt=sjcl2.json.encrypt;sjcl2.decrypt=sjcl2.json.decrypt;sjcl2.misc.pa={};sjcl2.misc.cachedPbkdf2=function(a,b){var c=sjcl2.misc.pa,d;b=b||{};d=b.iter||1e3;c=c[a]=c[a]||{};d=c[d]=c[d]||{firstSalt:b.salt&&b.salt.length?b.salt.slice(0):sjcl2.random.randomWords(2,0)};c=void 0===b.salt?d.firstSalt:b.salt;d[c]=d[c]||sjcl2.misc.pbkdf2(a,c,b.iter);return{key:d[c].slice(0),salt:c.slice(0)}};"undefined"!==typeof module&&module.exports&&(module.exports=sjcl2);"function"===typeof define&&define([],function(){return sjcl2})}});var require_browser=__commonJS({"../../node_modules/web-worker/cjs/browser.js"(exports,module){module.exports=Worker}});var __defProp2=Object.defineProperty;var __defNormalProp=(obj,key,value)=>key in obj?__defProp2(obj,key,{enumerable:true,configurable:true,writable:true,value}):obj[key]=value;var __publicField=(obj,key,value)=>{__defNormalProp(obj,typeof key!=="symbol"?key+"":key,value);return value};var _Math2=class{constructor(){}static genSineWave(freq=20,peakAmp=1,nSec=1,fs=512,freq2=0,peakAmp2=1){var sineWave=[];var t=[];var increment=1/fs;for(var ti=0;ti<nSec;ti+=increment){var amplitude=Math.sin(2*Math.PI*freq*ti)*peakAmp;amplitude+=Math.sin(2*Math.PI*freq2*ti)*peakAmp2;sineWave.push(amplitude);t.push(ti)}return[t,sineWave]}static getSineAmplitude(frequency=20,peakAmplitude=1,ti=0,tOffset=0){return Math.sin(this.TWO_PI*frequency*ti+tOffset)*peakAmplitude}static mean(arr){var sum=arr.reduce((prev,curr)=>curr+=prev);return sum/arr.length}static mode(arr){return arr.sort((a,b)=>arr.filter(v=>v===a).length-arr.filter(v=>v===b).length).pop()}static std(arr,mean=void 0){let avg=mean;if(!mean)avg=this.mean(arr);let summed=0;for(let i=0;i<arr.length;i++){let subbed=arr[i]-avg;summed+=subbed*subbed}return Math.sqrt(summed/arr.length)}static relError(actual=[],forecast=[],abs=true){if(actual.length!==forecast.length)throw new Error("Input arrays of same length!");let i=actual.length;let d=new Array(actual.length);for(let j=0;j<i;j++){let dd=(actual[j]-forecast[j])/actual[j];if(abs)dd=Math.abs(dd);d[j]=dd}return d}static informationEntropy(probabilities=[]){let len=probabilities.length;let entropy=new Array(len);for(let i=0;i<len;i++){let ent=probabilities[i]*Math.log(probabilities[i]);if(isNaN(ent))ent=0;entropy[i]=ent}return entropy}static zscore(arr){let mean=this.mean(arr);let std=this.std(arr,mean);let z=new Array().length(arr.length);for(let i=0;i<arr.length;i++){z[i]=(arr[i]-mean)/std}return z}static variance(arr){var mean=this.mean(arr);return arr.reduce((a,b)=>a+(b-mean)**2,0)/arr.length}static dot(vec1,vec2){var dot=0;for(var i=0;i<vec1.length;i++){dot+=vec1[i]*vec2[i]}return dot}static cross3D(vec1,vec2){return[vec1[1]*vec2[2]-vec1[2]*vec2[1],vec1[2]*vec2[0]-vec1[0]*vec2[2],vec1[0]*vec2[1]-vec1[1]*vec2[0]]}static magnitude(vec){var sqrd=0;vec.forEach(c=>{sqrd+=c*c});return Math.sqrt(sqrd)}static distance(point1,point2){var dsqrd=0;point1.forEach((c,i)=>{dsqrd+=(point2[i]-c)*(point2[i]-c)});return Math.sqrt(dsqrd)}static midpoint(point1=[1,2,3],point2=[3,4,5]){return point1.map((c,i)=>{return(c+point2[i])*.5})}static normalize(vec){var norm=0;norm=this.magnitude(vec);var vecn=new Array(vec.length);vec.forEach((c,i)=>{vecn[i]=c*norm});return vecn}static normalizeSeries(arr=[],fromZero=true){let max=Math.max(...arr);let min=Math.min(...arr);if(fromZero==false){max=Math.max(max,Math.abs(min));min=0}if(max-min===0){min=0;if(max===0)max=1e-13}return arr.map(v=>(v-min)/(max-min))}static quadraticFormula(a,b,c){let bbmac4=Math.sqrt(b*b-4*a*c);if(!isNaN(bbmac4))return["complex","complex"];let _a2=1/(2*a);if(bbmac4===0)return[b*_a2];let nb=-b;return[(nb+bbmac4)*_a2,(nb-bbmac4)*_a2]}static newtonsMethod(foo=x2=>{return Math.pow(x2,5)+x2*x2-x2-.2},start=0,end=1,precision=.01,attempts=10){let roots=[];for(let i=0;i<attempts;i++){let seedx=Math.random()*(end-start);let guess=foo(seedx);let guess2=foo(seedx+precision);let slope=(guess2-guess)/precision;let xn=seedx+precision;while(Math.abs(slope)>precision){let step=-guess/slope2;let xn12=xn+step;guess=guess2;guess2=foo(xn12);let slope2=(guess2-guess)/(xn12-xn)}let idx;let f=roots.find((root,i2)=>{if(Math.abs(xn1-root)<precision){idx=i2;return true}});if(f)roots[idx]=(xn1+f)*.5;else roots.push(xn1)}return roots}static makeVec(point1,point2){var vec=[];point1.forEach((c,i)=>{vec.push(point2[i]-c)});return vec}static getBufferedValueByCoordinates(vb=new Array(300).fill(1),dims=[10,10,2],coordinate=[1,2,1],cardinal=void 0){let getIdx=(foundIdx=0,dimIdx=0)=>{if(dimIdx===dims.length)return foundIdx;if(dimIdx==0)foundIdx+=coordinate[dimIdx];else if(dims[dimIdx]==0)dimsAt0++;else{let reMul=(val=coordinate[dimIdx],di=dimIdx-1)=>{val*=dims[di];di--;if(di==0)return val;else return reMul(val,di)};foundIdx+=reMul(coordinate[dimIdx]+1,dimIdx-1)}dimIdx++;return getIdx(foundIdx,dimIdx)};let found=getIdx();if(cardinal){if(coordinate[coordinate.length-1]===0){let lastnonzero=0;let idx=0;while(idx!==coordinate.length-1){if(coordinate[idx]!==0)lastnonzero=idx;idx++}return vb[found-lastnonzero+cardinal]}return vb[found-dims.length+cardinal]}else{if(coordinate[coordinate.length-1]===0){let lastnonzero=0;let idx=0;while(idx!==coordinate.length-1){if(coordinate[idx]!==0)lastnonzero=idx;idx++}return vb.slice(found-lastnonzero,found+1)}return vb.slice(found-dims.length,found+1)}}static forBufferedMat(vb=new Array(100).fill(1),dims=[10,10],asIndex=(v,i,x2,y)=>{return v+x2+y}){let coordinate=[];let idx=0;let recurseFor=(depth=0,nextDepth=depth+1)=>{let result=new Array(vb.length);for(let di=0;di<dims[depth];di++){coordinate[depth]=di;if(dims[nextDepth])recurseFor(nextDepth);else{result[idx]=asIndex(vb[idx],idx,...coordinate);idx++}}return result};let recurseForArrFuncs=(depth,nextDepth=depth+1)=>{let result=new Array(vb.length);for(let di=0;di<dims[depth];di++){coordinate[depth]=di;if(dims[nextDepth])recurseFor(nextDepth);else{for(let dj=0;dj<dims.length;dj++){result[idx]=asIndex[dj](vb[idx],idx,...coordinate);idx++}}}return result};if(typeof asIndex==="function"){return recurseFor()}else if(Array.isArray(asIndex)){return recurseForArrFuncs()}}static mapBufferedMat(buffer=new Array(100).fill(1),dimensions=[10,10],asIndex=(v,idx,i,j)=>{console.log(`value:${v}, idx:${idx}, x:${i},y:${j}`);return v+i+j}){let coordinate=new Array(dimensions.length).fill(0);const iterateCoordinate=(coord,idx=0)=>{if(coord[idx]>=dimensions[idx]){coord[idx]=0;idx++;if(idx===dimensions.length)return;iterateCoordinate(coord,idx)}else coord[idx]++};let result=new Array(buffer.length);let i=0;if(typeof asIndex==="function"){while(i<buffer.length){result[i]=asIndex(buffer[i],i,...coordinate);i+=dimensions.length;iterateCoordinate(coordinate)}}else if(Array.isArray(asIndex)){while(i<buffer.length){asIndex.forEach(func=>{result[i]=func(buffer[i],i,...coordinate);i++;iterateCoordinate(coordinate)})}}return result}static combinations(choices=["a","b","c"],vecsize=3){var result=[];if(vecsize<=0){result.push([])}else{_Math2.combinations(choices,vecsize-1).forEach(function(previousComb){choices.forEach(function(element){result.push([element].concat(previousComb))})})}return result}static generateCoordinateSpace(upperBounds=[10,10,10],lowerBounds=[-10,-10,-10],steps=[1,1,1],mutater=void 0){for(let i=0;i<upperBounds.length;i++){if(lowerBounds[i]>upperBounds[i]){let temp=upperBounds[i];upperBounds[i]=lowerBounds[i];lowerBounds[i]=temp}}let result=[];let copy=[...upperBounds];let lastindex=copy.length-1;result.push([...copy]);while(copy[0]>=lowerBounds[0]){let checkNextIndex=decrIdx2=>{if(copy[decrIdx2]<=lowerBounds[decrIdx2]){if(decrIdx2===0)return;copy[decrIdx2]=upperBounds[decrIdx2];decrIdx2--;if(decrIdx2<0)return;if(typeof steps[decrIdx2]=="function")copy[decrIdx2]-=steps[decrIdx2](copy[decrIdx2]);else copy[decrIdx2]-=steps[decrIdx2];checkNextIndex(decrIdx2)}};let decrIdx=lastindex;if(typeof steps[decrIdx]=="function")copy[decrIdx]-=steps[decrIdx](copy[decrIdx]);else copy[decrIdx]-=steps[decrIdx];result.push([...copy]);checkNextIndex(decrIdx);if(mutater)result[result.length-1]=mutater(result[result.length-1])}return result}static calcVectorField(coordinates=[[0,0],[0,1],[1,0],[1,1]],formula=(x2,y)=>{return[x2*10,y*10]}){return coordinates.map(vec=>formula(...vec))}static transpose(mat){return mat[0].map((_,colIndex)=>mat.map(row=>row[colIndex]))}static matmul(a,b){var aNumRows=a.length,aNumCols=a[0].length,bNumRows=b.length,bNumCols=b[0].length,m=new Array(aNumRows);for(var r=0;r<aNumRows;++r){m[r]=new Array(bNumCols);for(var c=0;c<bNumCols;++c){m[r][c]=0;for(var i=0;i<aNumCols;++i){m[r][c]+=a[r][i]*b[i][c]}}}return m}static matscale(mat,scalar){let m=[];for(var i=0;i<mat.length;i++){m[i]=[];for(let j=0;j<mat[0].length;j++){m[i][j]=mat[i][j]*scalar}}return m}static matadd(a,b){let m=[];for(let i=0;i<a.length;i++){m[i]=[];for(var j=0;j<a[0].length;j++){m[i][j]=a[i][j]+b[i][j]}}return m}static matsub(a,b){let m=[];for(let i=0;i<a.length;i++){m[i]=[];for(var j=0;j<a[0].length;j++){m[i][j]=a[i][j]-b[i][j]}}return m}static histogram(arr=[],binSize=1,nBins=void 0){let copy=[...arr];copy.sort(function(a,b){return a-b});let binStart=Math.min(...copy);if(typeof nBins==="number"){let binEnd=Math.max(...copy);binSize=Math.abs((binEnd-binStart)/(nBins-1))}let j=binStart;let binx=[];let biny=[];for(let i=0;i<copy.length;i++){let binidx=binSize*j;if(copy[i]>binStart+binidx){j++;binidx+=binSize;let binmin=binStart+binidx;let binmid=binmin+binidx*.5;binx.push(binmid);biny.push(0)}biny[biny.length-1]++}return[binx,biny]}static normalDistribution(samples=[],normalize=true,cutoff=1e-4){let m=this.mean(samples);let vari=this.variance(samples);let nSamples=samples.length;let probabilities=[];let denom=1/(this.TWO_PI*vari);let _variance=1/vari;let sum=0;for(let i=0;i<nSamples;i++){let px=Math.exp(-.5*Math.pow((samples[i]-m)*_variance,2))*denom;if(px<cutoff)px=0;probabilities.push(px);sum+=px}if(normalize){let _sum=1/sum;probabilities=probabilities.map(x2=>x2*_sum)}return probabilities}static expectedValue(samples=[],probabilities=this.normalDistribution(samples)){return samples.reduce((sum,item,idx)=>sum+item*probabilities[idx])}static originMoment(samples=[],probabilities=this.normalDistribution(samples),order=1){return samples.reduce((sum,item,idx)=>sum+Math.pow(item,order)*probabilities[idx])}static centralMoment(samples=[],probabilities=this.normalDistribution(samples),order=1){let m=this.mean(samples);return samples.reduce((sum,item,idx)=>sum+Math.pow(item-m,order)*probabilities[idx]/samples.length)}static linearDiscriminantAnalysis(samples=[],classifier=[]){let mean=this.mean(samples);let meank=this.mean(classifier);let covariance=this.cov1d(samples,classifier);let probs=this.normalDistribution(samples);let dk=[];for(let i=0;i<samples.length;i++){dk.push(x[i]*covariance*meank-.5*mean*covariance*meank+Math.log10(probs[i]))}return dk}static conv1D(arr=[],kern=[1/3,1/3,1/3],pad=Math.floor(kern.length*.5)){let result=[];let _n=1/kern.length;if(pad>0){let pads=new Array(pad).fill(0);arr=[...pads,...arr,...pads]}let start=Math.floor(kern.length*.5);let end=arr.length-kern.length+start;for(let i=start;i<end;i++){let acc=0;for(let j=0;j<kern.length;j++){acc+=arr[i-start]*kern[j]}result.push(acc*_n)}return result}static conv2D(mat=[[],[],[]],kern=[[],[],[]],pad=0){let result=new Array(mat.length-Math.ceil(kern.length*.5)).fill([]);let mat_t;let kern_t=_Math2.transpose(kern_t);if(pad>0){let pads=new Array(pad).fill(0);mat_t=_Math2.transpose(mat);for(let i2=0;i2<mat_t.length;i2++){mat_t[i2]=[...pads,...mat_t[i2],...pads]}mat=_Math2.transpose(mat_t);for(let j=0;j<mat.length;j++){mat[j]=[...pads,...mat[j],...pads]}}let startr=Math.floor(kern[0].length*.5);let startl=Math.floor(kern_t[0].length*.5);let endr=mat[0].length-kern[0].length+startr;let endl=mat_t[0].length-kern_t[0].length+startl;let _n=1/(kern[0].length*kern_t[0].length);let iters=endr*endl;let i=startr;let x2;let y=startl;while(i<iters){let acc=0;x2=i%mat[0].length;if(x2===0){y++}for(let j=0;j<kern[0].length;j++){for(let k=0;k<kern_t[0].length;j++){acc+=mat[y-startl+k][x2-startr+j]*kern[k][j]}result[y].push(acc*_n)}i++}return result}static cov2d(mat){var mattransposed=this.transpose(mat);var matproducts=[];var rowmeans=[];var colmeans=[];mat.forEach((row,idx)=>{rowmeans.push(this.mean(row))});mattransposed.forEach((col,idx)=>{colmeans.push(this.mean(col))});mat.forEach((row,idx)=>{matproducts.push([]);for(var col=0;col<row.length;col++){matproducts[idx].push((mat[idx][col]-rowmeans[idx])*(mat[idx][col]-colmeans[col])/(row.length-1))}});var matproductstransposed=this.transpose(matproducts);var aNumRows=matproducts.length,aNumCols=matproducts[0].length,bNumRows=matproductstransposed.length,bNumCols=matproductstransposed[0].length,m=new Array(aNumRows);for(var r=0;r<aNumRows;++r){m[r]=new Array(bNumCols);for(var c=0;c<bNumCols;++c){m[r][c]=0;for(var i=0;i<aNumCols;++i){m[r][c]+=matproducts[r][i]*matproductstransposed[i][c]/(mat[0].length-1)}}}return m}static cov1d(arr1=[],arr2=[]){return this.cov2d([arr1,arr2])}static cov3d(x2=[],y=[],z=[]){return[[this.cov1d(x2,x2),this.cov1d(x2,y),this.cov1d(x2,z)],[this.cov1d(y,x2),this.cov1d(y,y),this.cov1d(y,z)],[this.cov1d(z,x2),this.cov1d(z,y),this.cov1d(z,z)]]}static covNd(dimensionalData=[]){let covariance=[];dimensionalData.forEach((arr,i)=>{covariance.push([]);dimensionalData.forEach((arr2,j)=>{covariance[i].push(this.cov1d(arr,arr2))})})}static eigens2x2(mat=[[1,2],[3,4]]){let det=mat[0][0]*mat[1][1]-mat[0][1]*mat[1][0];let mean=(mat[0][0]+mat[1][1])*.5;let sqrt=Math.sqrt(mean*mean-det);let eig1=mean+sqrt;let eig2=mean-sqrt;return[eig1,eig2]}static eigenvectors2x2(mat=[[1,2],[3,4]],eigens=[1,2]){let v1=[-mat[0][1],mat[0][0]-eigens[0]];if(v1[0]===0&&v1[1]===0){v1[0]=mat[1][1]-eigens[0];v1[1]=-mat[1][0]}let v2=[-mat[0][1],mat[0][0]-eigens[1]];if(v2[0]===0&&v2[1]===0){v2[0]=mat[1][1]-eigens[1];v2[1]=-mat[1][0]}return[v1,v2]}static fastpca2d(xarr,yarr){let cov1d=this.cov1d(xarr,yarr);let eigs=this.eigens2x2(cov1d);if(eigs[1]>eigs[0])eigs.reverse();let evs=this.eigenvectors2x2(cov1d,eigs);console.log(eigs,evs);return[eigs,evs]}static crosscorrelation(arr1,arr2){var arr2buf=[...arr2,...Array(arr2.length).fill(0)];var mean1=this.mean(arr1);var mean2=this.mean(arr2);var arr1Est=arr1.reduce((sum,item)=>sum+=Math.pow(item-mean1,2));arr1Est=Math.sqrt(Math.abs(arr1Est));var arr2Est2=arr2.reduce((sum,item)=>sum+=Math.pow(item-mean1,2));arr2Est2=Math.sqrt(Math.abs(arr2Est2));let denom=arr1Est*arr2Est2;if(denom===0)denom=1e-26;var _arrEstsMul=1/denom;var correlations=new Array(arr1.length).fill(0);for(var delay=0;delay<arr1.length;delay++){var r=arr1.reduce((sum,item,i)=>sum+=(item-mean1)*(arr2buf[delay+i]-mean2));correlations[delay]=r*_arrEstsMul}return correlations}static autocorrelation(arr1){var delaybuf=[...arr1,...Array(arr1.length).fill(0)];var mean1=this.mean(arr1);var arr1Est=arr1.reduce((sum,item)=>sum+=Math.pow(item-mean1,2));arr1Est=Math.sqrt(Math.abs(arr1Est));let denom=arr1Est*arr2Est;if(denom===0)denom=1e-26;var _arr1estsqrd=1/denom;var correlations=new Array(arr1.length).fill(0);for(var delay=0;delay<arr1.length;delay++){var r=arr1.reduce((sum,item,i)=>sum+=(item-mean1)*(delaybuf[delay+i]-mean1));correlations[delay]=r*_arr1estsqrd}return correlations}static autocorrelation2dNormalized(mat2d2){let result=[];for(let y=0;y<mat2d2.length;y++){result.push([]);for(let x2=0;x2<mat2d2[y].length;x2++){let G=0;let _G=0;for(let b=0;b<mat2d2.length;b++){for(let a=0;a<mat2d2[b].length;a++){G+=mat2d2[y][x2]*mat2d2[mat2d2.length-1-b][mat2d2[y].length-1-a];_G+=mat2d2[y][x2]*mat2d2[mat2d2.length-1][mat2d2[y].length-1]}}result[y][x2]=G/_G-1}}return result}static crosscorrelation2d(mat2d1,mat2d2){let result=[];for(let y=0;y<mat2d1.length;y++){result.push([]);for(let x2=0;x2<mat2d1[y].length;x2++){let G=0;for(let b=0;b<mat2d2.length;b++){for(let a=0;a<mat2d2[b].length;a++){G+=mat2d1[y][x2]*mat2d2[mat2d2.length-1-b][mat2d2[y].length-1-a]}}result[y][x2]=G}}return result}static crosscorrelation2dNormalized(mat2d1,mat2d2){let result=[];for(let y=0;y<mat2d1.length;y++){result.push([]);for(let x2=0;x2<mat2d1[y].length;x2++){let G=0;let _G=0;for(let b=0;b<mat2d2.length;b++){for(let a=0;a<mat2d2[b].length;a++){G+=mat2d1[y][x2]*mat2d2[mat2d.length-1-b][mat2d2[y].length-1-a];_G+=mat2d1[y][x2]*mat2d2[mat2d2.length-1][mat2d2[y].length-1]}}result[y][x2]=G/_G-1}}return result}static correlograms(dat=[[],[]]){var correlograms=[];dat.forEach((row1,i)=>{dat.forEach((row2,j)=>{if(j>=i){correlograms.push(_Math2.crosscorrelation(row1,row2))}})});return correlograms}static dft(sineWave=[]){var TWOPI=2*3.141592653589793;var real=[];var imag=[];var mags=[];for(var k=0;k<sineWave.length;k++){real.push(0);imag.push(0);for(var j=0;j<sineWave.length;j++){var shared=TWOPI*k*j/sineWave.length;real[k]=real[k]+sineWave[j]*Math.cos(shared);imag[k]=imag[k]-sineWave[j]*Math.sin(shared)}mags.push(Math.sqrt(real[k]*real[k]+imag[k]*imag[k]))}function orderMagnitudes(unorderedMags){return[...unorderedMags.slice(Math.ceil(unorderedMags.length*.5),unorderedMags.length),...unorderedMags.slice(0,Math.ceil(unorderedMags.length*.5))]}mags=orderMagnitudes(mags);let halflen=mags.length*.5;let freqs=mags.map((m,i)=>{return i-halflen});return{real,imag,freqs,mags}}static sma(arr=[],window2){var smaArr=[];for(var i=0;i<arr.length;i++){if(i==0){smaArr.push(arr[0])}else if(i<window2){var arrslice=arr.slice(0,i+1);smaArr.push(arrslice.reduce((previous,current)=>current+=previous)/(i+1))}else{var arrslice=arr.slice(i-window2,i);smaArr.push(arrslice.reduce((previous,current)=>current+=previous)/window2)}}return smaArr}static sum(arr=[]){if(arr.length>0){var sum=arr.reduce((prev,curr)=>curr+=prev);return sum}else{return 0}}static reduceArrByFactor(arr,factor=2){let x2=arr.filter((element,index)=>{return index%factor===0});return x2}static makeArr(startValue,stopValue,nSteps){var arr=[];var step=(stopValue-startValue)/(nSteps-1);for(var i=0;i<nSteps;i++){arr.push(startValue+step*i)}return arr}static autoscale(array,stackedLines=1,stackPosition=0,centerZero=false){if(array?.length===0)return array;let max=Math.max(...array);let min=Math.min(...array);let _lines=1/stackedLines;let scalar;if(centerZero){let absmax=Math.max(Math.abs(min),Math.abs(max));scalar=_lines/absmax;return array.map(y=>y*scalar+(_lines*(stackPosition+1)*2-1-_lines))}else{scalar=_lines/(max-min);return array.map(y=>2*((y-min)*scalar-1/(2*stackedLines))+(_lines*(stackPosition+1)*2-1-_lines))}}static absmax(array){return Math.max(Math.abs(Math.min(...array)),Math.max(...array))}static downsample(array,fitCount,scalar=1){if(array.length>fitCount){let output=new Array(fitCount);let incr=array.length/fitCount;let lastIdx=array.length-1;let last=0;let counter=0;for(let i=incr;i<array.length;i+=incr){let rounded=Math.round(i);if(rounded>lastIdx)rounded=lastIdx;for(let j=last;j<rounded;j++){output[counter]+=array[j]}output[counter]/=(rounded-last)*scalar;counter++;last=rounded}return output}else return array}static interpolateArray(data,fitCount,scalar=1){var linearInterpolate=function(before2,after2,atPoint2){return(before2+(after2-before2)*atPoint2)*scalar};var newData=new Array;var springFactor=(data.length-1)/(fitCount-1);newData[0]=data[0];for(var i=1;i<fitCount-1;i++){var tmp=i*springFactor;var before=Math.floor(tmp);var after=Math.ceil(tmp);var atPoint=tmp-before;newData[i]=linearInterpolate(data[before],data[after],atPoint)}newData[fitCount-1]=data[data.length-1];return newData}static isExtrema(arr,critical="peak"){let ref=[...arr];if(ref.length%2===0)ref.pop();if(arr.length>1){let pass=true;for(let i=0;i<ref.length;i++){let val=ref[i];if(critical==="peak"){if(i<Math.floor(ref.length*.5)&&val>=ref[Math.floor(ref.length*.5)]){pass=false;break}else if(i>Math.floor(ref.length*.5)&&val>=ref[Math.floor(ref.length*.5)]){pass=false;break}}else if(critical==="valley"){if(i<Math.floor(ref.length*.5)&&val<=ref[Math.floor(ref.length*.5)]){pass=false;break}else if(i>Math.floor(ref.length*.5)&&val<=ref[Math.floor(ref.length*.5)]){pass=false;break}}else{if(i<Math.floor(ref.length*.5)&&val<=ref[Math.floor(ref.length*.5)]){pass=false;break}else if(i>Math.floor(ref.length*.5)&&val<=ref[Math.floor(ref.length*.5)]){pass=false;break}}}if(critical!=="peak"&&critical!=="valley"&&pass===false){pass=true;for(let i=0;i<ref.length;i++){let val=ref[i];if(i<Math.floor(ref.length*.5)&&val>=ref[Math.floor(ref.length*.5)]){pass=false;break}else if(i>Math.floor(ref.length*.5)&&val>=ref[Math.floor(ref.length*.5)]){pass=false;break}}}return pass}else return void 0}static isCriticalPoint(arr,critical="peak"){let ref=[...arr];if(ref.length%2===0)ref.pop();if(arr.length>1){let pass=true;for(let i=0;i<ref.length;i++){let val=ref[i];if(critical==="peak"){if(i<ref.length*.5&&val<=0){pass=false;break}else if(i>ref.length*.5&&val>0){pass=false;break}}else if(critical==="valley"){if(i<ref.length*.5&&val>=0){pass=false;break}else if(i>ref.length*.5&&val<0){pass=false;break}}else{if(i<ref.length*.5&&val>=0){pass=false;break}else if(i>ref.length*.5&&val<0){pass=false;break}}}if(critical!=="peak"&&critical!=="valley"&&pass===false){pass=true;for(let i=0;i<ref.length;i++){let val=ref[i];if(i<ref.length*.5&&val<=0){pass=false;break}else if(i>ref.length*.5&&val>0){pass=false;break}}}return pass}else return void 0}static getPeakThreshold(arr,peakIndices,thresholdVar){let threshold;let filtered=arr.filter((o,i)=>{if(peakIndices.indexOf(i)>-1)return true});if(thresholdVar===0){threshold=this.mean(filtered)}else threshold=(thresholdVar+this.mean(filtered))*.5;return threshold}static column(mat,x2){let col=new Array(mat.length).fill(0).map(()=>new Array(1).fill(0));for(let i=0;i<mat.length;i++){col[i][0]=mat[i][x2]}return col}static flatten_vector(v){let v_new=[];for(let i=0;i<v.length;i++){v_new[i]=v[i][0]}return v_new}static squared_difference(v1,v2){let sum=0;for(let i=0;i<v1.length;i++){sum=sum+Math.pow(v1[i]-v2[i],2)}return sum}static shift_deflate(mat,eigenvalue,eigenvector){let len=Math.sqrt(this.matmul(this.transpose(eigenvector),eigenvector));let U=this.matscale(eigenvector,1/len);let delta=this.matscale(this.matmul(U,this.transpose(U)),eigenvalue);let M_new=this.matsub(mat,delta);return M_new}static eigenvalue_of_vector(mat,eigenvector){ev=this.matmul(this.matmul(this.transpose(eigenvector),mat),eigenvector);return ev}static power_iteration(mat,tolerance=1e-5,max_iterations=1e3){let rank=mat.length;let eigenvector=new Array(rank).fill(0).map(()=>new Array(1).fill(Math.sqrt(rank)));let eigenvalue=this.eigenvalue_of_vector(mat,eigenvector);let epsilon=1;let iter=0;while(epsilon>tolerance&&iter<max_iterations){let old_eigenvalue=JSON.parse(JSON.stringify(eigenvalue));let Mv=this.matmul(mat,eigenvector);eigenvector=this.normalize(Mv);eigenvalue=this.eigenvalue_of_vector(mat,eigenvector);epsilon=Math.abs(eigenvalue-old_eigenvalue);iter++};return[eigenvalue,eigenvector]}static eigens(mat,tolerance=1e-4,max_iterations=1e3){let eigenvalues=[];let eigenvectors=[];for(let i=0;i<mat.length;i++){let result=this.power_iteration(mat,tolerance,max_iterations);let eigenvalue=result[0];let eigenvector=result[1];eigenvalues[i]=eigenvalue;eigenvectors[i]=this.flatten_vector(eigenvector);mat=this.shift_deflate(mat,eigenvalue,eigenvector)}return[eigenvalues,eigenvectors]}static pca(mat,tolerance=1e-5){let dims=mat.length;let t=new Array(dims);let p=new Array(dims);let mat_t=this.transpose(mat);t[0]=this.column(mat,0);let epsilon=1;let iter=0;while(espilon>tolerance){iter++;p[0]=this.matmul(mat_t,t[0]);let tp=this.matmul(this.transpose(t[0]),t[0]);p[0]=this.matscale(p[0],1/tp);let p_length=Math.sqrt(this.matmul(this.transpose(p[0]),p[0]));p[0]=this.matscale(p[0],1/p_length);let t_new=this.matmul(mat,p[0]);let pp=this.matmul(this.transpose(p[0]),p[0]);t_new=this.matscale(t_new,1/pp);epsilon=this.squared_difference(t[0],t_new);t[0]=JSON.parse(JSON.stringify(t_new))}let components=this.matmul(this.transpose(t[0]),t[0]);return components}static circularBuffer(arr,newEntries){if(Array.isArray(newEntries)){if(newEntries.length<arr.length){let slice=arr.slice(newEntries.length);let len=arr.length;arr.splice(0,len,...slice,...newEntries)}else if(newEntries.length>arr.length){let len=arr.length;arr.splice(0,len,newEntries.slice(len-newEntries.length))}else{arr.splice(0,arr.length,...newEntries)}}else{arr.push(newEntries);arr.shift()}return arr}static HSLToRGB(h,s,l,scalar=255){s/=100;l/=100;let c=(1-Math.abs(2*l-1))*s,x2=c*(1-Math.abs(h/60%2-1)),m=l-c/2,r=0,g=0,b=0;if(0<=h&&h<60){r=c;g=x2;b=0}else if(60<=h&&h<120){r=x2;g=c;b=0}else if(120<=h&&h<180){r=0;g=c;b=x2}else if(180<=h&&h<240){r=0;g=x2;b=c}else if(240<=h&&h<300){r=x2;g=0;b=c}else if(300<=h&&h<360){r=c;g=0;b=x2}r=(r+m)*scalar;g=(g+m)*scalar;b=(b+m)*scalar;return[r,g,b]}static p300(event_timestamps=[],raw_signal=[],signal_timestamps=[],sps=256){let smoothingstep=Math.floor(sps/10);let smoothed=this.sma(raw_signal,smoothingstep);let peaks=this.peakDetect(smoothed,"peak",smoothingstep);let mean=this.mean(smoothed);let std=this.std(smoothed,mean);let p_idx=0;let candidates=[];if(peaks.length>0){event_timestamps.forEach((t,j)=>{while(signal_timestamps[peaks[p_idx]]<t+200){p_idx++;if(!peaks[p_idx])break}let tempi=0;let tempcandidates=[];while(signal_timestamps[peaks[p_idx+tempi]]<t+600){tempcandidates.push(p_idx+tempi);tempi++;if(!peaks[p_idx+tempi])break}if(tempcandidates.length>1){let peakvals=[];tempcandidates.forEach(tc=>{peakvals.push(smoothed[peaks[tc]])});let max=Math.max(...peakvals);let maxi=tempcandidates[peakvals.indexOf(max)];candidates.push({event_timestamp:t,event_index:j,peak_timestamp:signal_timestamps[[peaks[maxi]]],signal_index:[peaks[maxi]],signal_amplitude:raw_signal[[peaks[maxi]]],zscore:(smoothed[peaks[maxi]]-mean)/std})}else if(tempcandidates.length===1)candidates.push({event_timestamp:t,event_index:j,peak_timestamp:signal_timestamps[peaks[tempcandidates[0]]],signal_index:peaks[tempcandidates[0]],signal_amplitude:raw_signal[[peaks[tempcandidates[0]]]],zscore:(smoothed[peaks[tempcandidates[0]]]-mean)/std})})}return candidates}};var Math2=_Math2;__publicField(Math2,"TWO_PI",Math.PI*2);__publicField(Math2,"C",299792458);__publicField(Math2,"G",66743e-15);__publicField(Math2,"h",662607015e-42);__publicField(Math2,"R",8314.32);__publicField(Math2,"Ra",287);__publicField(Math2,"H",69.3);__publicField(Math2,"kbar",1054571817e-43);__publicField(Math2,"kB",1380649e-29);__publicField(Math2,"ke",89875517923e-1);__publicField(Math2,"me",91093837015e-41);__publicField(Math2,"mp",167262192369e-38);__publicField(Math2,"mn",167492749804e-38);__publicField(Math2,"P0",101325);__publicField(Math2,"T0",288.15);__publicField(Math2,"p0",1.225);__publicField(Math2,"Na",60220978e16);__publicField(Math2,"y",1.405);__publicField(Math2,"M0",28.96643);__publicField(Math2,"g0",9.80665);__publicField(Math2,"Re",6378100);__publicField(Math2,"B",1458e-9);__publicField(Math2,"S",110.4);__publicField(Math2,"Sigma",365e-12);__publicField(Math2,"imgkernels",{edgeDetection:[[-1,-1,-1],[-1,8,-1],[-1,-1,-1]],boxBlur:[[1/9,1/9,1/9],[1/9,1/9,1/9],[1/9,1/9,1/9]],sobelLeft:[[1,0,-1],[2,0,-2],[1,0,-1]],sobelRight:[[-1,0,1],[-2,0,2],[-1,0,1]],sobelTop:[[1,2,1],[0,0,0],[-1,-2,-1]],sobelBottom:[[-1,2,1],[0,0,0],[1,2,1]],identity:[[0,0,0],[0,1,0],[0,0,0]],gaussian3x3:[[1,2,1],[2,4,2],[1,2,1]],guassian7x7:[[0,0,0,5,0,0,0],[0,5,18,32,18,5,0],[0,18,64,100,64,18,0],[5,32,100,100,100,32,5],[0,18,64,100,64,18,0],[0,5,18,32,18,5,0],[0,0,0,5,0,0,0]],emboss:[[-2,-1,0],[-1,1,1],[0,1,2]],sharpen:[[0,-1,0],[-1,5,-1],[0,-1,0]]});__publicField(Math2,"integral",(func=x2=>{let y=x2;return y},range=[],stepx=.01)=>{let area=0;for(let i=range[0];i<range[1];i+=stepx){let y=func(i);area+=y*stepx}return area});__publicField(Math2,"dintegral",(func=(x2,y)=>{let z=x2+y;return z},range=[[],[]],stepx=.01,stepy=stepx)=>{let volume=0;for(let i=range[0][0]+stepx;i<range[0][1];i+=stepx){for(let j=range[1][0]+stepy;j<range[1][1];j+=stepy){let z=func(i,j);volume+=z*stepx*stepy}}return volume});__publicField(Math2,"tintegral",(func=(x2,y,z)=>{let w=x2+y+z;return w},range=[[],[],[]],stepx=.01,stepy=stepx,stepz=stepx)=>{let volume=0;for(let i=range[0][0]+stepx;i<range[0][1];i+=stepx){for(let j=range[1][0]+stepy;j<range[1][1];j+=stepy){for(let k=range[2][0]+stepz;k<range[2][1];k+=stepz){let w=func(i,j,k);volume+=w*stepx*stepy*stepz}}}return volume});__publicField(Math2,"pintegral",(func=x2=>{let y=x2;return y},range=[],stepx=.01)=>{let length=0;let y0=void 0;let yi=void 0;for(let i=range[0];i<range[1];i+=stepx){y0=yi;yi=func(i);if(y0)length+=_Math2.distance([0,y0],[stepx,yi])}return length});__publicField(Math2,"meshgrid",_Math2.generateCoordinateSpace);__publicField(Math2,"autocorrelation2d",mat2d2=>{let result=[];for(let y=0;y<mat2d2.length;y++){result.push([]);for(let x2=0;x2<mat2d2[y].length;x2++){let G=0;for(let b=0;b<mat2d2.length;b++){for(let a=0;a<mat2d2[b].length;a++){G+=mat2d2[y][x2]*mat2d2[mat2d2.length-1-b][mat2d2[y].length-1-a]}}result[y][x2]=G}}return result});__publicField(Math2,"lerp",_Math2.makeArr);__publicField(Math2,"upsample",_Math2.interpolateArray);__publicField(Math2,"lerp",(v0,v1,fit,floor=true)=>{function lerp(v02,v12,t){return(1-t)*v02+t*v12}function interpolerp(v02,v12,fit2,floor2=true){if(fit2<=2)return[v02,v12];let a=1/fit2;let result=new Array(fit2);result[0]=v02;for(let i=1;i<=fit2;i++){result[i]=lerp(v02,v12,a*i);if(floor2)result[i]=Math.floor(result[i])}return result}});__publicField(Math2,"peakDetect",(smoothedArray,type="peak",window2=49)=>{let mid=Math.floor(window2*.5);let peaks=[];for(let i=0;i<smoothedArray.length-window2;i++){let isPeak=_Math2.isExtrema(smoothedArray.slice(i,i+window2),type);if(isPeak){peaks.push(i+mid-1)}}return peaks});Object.assign(Math,Math2);var EventHandler=class{constructor(data){this.pushToState={};this.data={};this.triggers={};this.setState=updateObj=>{Object.assign(this.data,updateObj);for(const prop of Object.getOwnPropertyNames(updateObj)){if(this.triggers[prop])this.triggers[prop].forEach(obj=>obj.onchange(this.data[prop]))}return this.data};this.setValue=(key,value)=>{this.data[key]=value;if(this.triggers[key])this.triggers[key].forEach(obj=>obj.onchange(this.data[key]))};this.subscribeTrigger=(key,onchange)=>{if(key){if(!this.triggers[key]){this.triggers[key]=[]}let l=this.triggers[key].length;this.triggers[key].push({sub:l,onchange});return this.triggers[key].length-1}else return void 0};this.unsubscribeTrigger=(key,sub)=>{let triggers=this.triggers[key];if(triggers){if(!sub)delete this.triggers[key];else{let sub2=void 0;let obj=triggers.find((o,i)=>{if(o.sub===sub2){sub2=i;return true}});if(obj)triggers.splice(sub2,1);if(this.onRemoved)this.onRemoved(obj);return true}}};this.subscribeTriggerOnce=(key,onchange)=>{let sub;let changed=value=>{onchange(value);this.unsubscribeTrigger(key,sub)};sub=this.subscribeTrigger(key,changed)};this.getTrigger=(key,sub)=>{for(const s in this.triggers[key]){if(this.triggers[key][s].sub===sub)return this.triggers[key][s]}};if(typeof data==="object")this.data=data}};var state=new EventHandler;var GraphNode=class{constructor(properties,parent,graph){this.__node={tag:`node${Math.floor(Math.random()*1e15)}`,unique:`${Math.random()}`,state};this.__subscribe=(callback,key,subInput,bound,target)=>{const subscribeToFunction=(k,setTarget=(callback2,target2)=>callback2,triggerCallback=callback)=>{let sub=this.__node.state.subscribeTrigger(k,triggerCallback);let trigger=this.__node.state.getTrigger(k,sub);trigger.source=this.__node.tag;if(key)trigger.key=key;trigger.target=setTarget(callback);if(bound)trigger.bound=bound;return sub};const subscribeToGraph=callback2=>{let fn=this.__node.graph.get(callback2);if(!fn&&callback2.includes(".")){let n=this.__node.graph.get(callback2.substring(0,callback2.lastIndexOf(".")));let key2=callback2.substring(callback2.lastIndexOf(".")+1);if(n&&typeof n[key2]==="function")callback2=(...args)=>{return n[key2](...args)}}};if(key){if(!this.__node.localState){this.__addLocalState(this)}if(typeof callback==="string"){if(typeof this[callback]==="function")callback=this[callback];else if(this.__node.graph)subscribeToGraph(callback)}let sub;let k=subInput?this.__node.unique+"."+key+"input":this.__node.unique+"."+key;if(typeof callback==="function")sub=subscribeToFunction(k);else if(callback?.__node)sub=subscribeToFunction(k,(callback2,target2)=>target2?target2:callback2.__node.unique,state2=>{if(callback.__operator)callback.__operator(state2)});return sub}else{if(typeof callback==="string"){if(this.__node.graph)callback=this.__node.graph.get(callback);else callback=this.__node.graph.nodes.get(callback)}let sub;let k=subInput?this.__node.unique+"input":this.__node.unique;if(typeof callback==="function")sub=subscribeToFunction(k);else if(callback?.__node)sub=subscribeToFunction(k,(callback2,target2)=>target2?target2:callback2.__node.unique,state2=>{if(callback.__operator)callback.__operator(state2)});return sub}};this.__unsubscribe=(sub,key,subInput)=>{if(key){return this.__node.state.unsubscribeTrigger(subInput?this.__node.unique+"."+key+"input":this.__node.unique+"."+key,sub)}else return this.__node.state.unsubscribeTrigger(subInput?this.__node.unique+"input":this.__node.unique,sub)};this.__setOperator=fn=>{fn=fn.bind(this);this.__operator=(...args)=>{if(this.__node.inputState)this.__node.state.setValue(this.__node.unique+"input",args);let result=fn(...args);if(this.__node.state.triggers[this.__node.unique]){if(typeof result?.then==="function"){result.then(res=>{if(res!==void 0)this.__node.state.setValue(this.__node.unique,res)}).catch(console.error)}else if(result!==void 0)this.__node.state.setValue(this.__node.unique,result)}return result};return this.__operator};this.__proxyObject=obj=>{let allProps=getAllProperties(obj);for(const k of allProps){if(typeof this[k]==="undefined"){if(typeof obj[k]==="function"){this[k]=(...args)=>{if(this.__node.inputState)this.__node.state.setValue(this.__node.unique+"."+k+"input",args);let result=obj[k](...args);if(this.__node.state.triggers[this.__node.unique+"."+k]){if(typeof result?.then==="function"){result.then(res=>{this.__node.state.setValue(this.__node.unique+"."+k,res)}).catch(console.error)}else this.__node.state.setValue(this.__node.unique+"."+k,result)}return result}}else{let definition={get:()=>{return obj[k]},set:value=>{obj[k]=value;if(this.__node.state.triggers[this.__node.unique+"."+k])this.__node.state.setValue(this.__node.unique+"."+k,value)},enumerable:true,configurable:true};Object.defineProperty(this,k,definition)}}}};let orig=properties;if(typeof properties==="function"){properties={__operator:properties,__node:{forward:true,tag:properties.name}}}else if(typeof properties==="string"){if(graph?.get(properties)){properties=graph.get(properties)}}if(!properties.__node.initial)properties.__node.initial=orig;if(typeof properties==="object"){if(properties.__props){if(typeof properties.__props==="function")properties.__props=new properties.__props;if(typeof properties.__props==="object"){this.__proxyObject(properties.__props)}}if(typeof properties.__node==="string"){if(graph?.get(properties.__node.tag)){properties=graph.get(properties.__node.tag)}else properties.__node={}}else if(!properties.__node)properties.__node={};if(!properties.__parent&&parent)properties.__parent=parent;if(graph){properties.__node.graph=graph}if(properties.__operator){if(typeof properties.__operator==="string"){if(graph){let n=graph.get(properties.__operator);if(n)properties.__operator=n.__operator;if(!properties.__node.tag&&properties.__operator.name)properties.__node.tag=properties.__operator.name}}if(typeof properties.__operator==="function")properties.__operator=this.__setOperator(properties.__operator)}if(!properties.__node.tag){if(properties.__operator?.name)properties.__node.tag=properties.__operator.name;else properties.__node.tag=`node${Math.floor(Math.random()*1e15)}`}if(parent?.__node&&!(parent instanceof Graph||properties instanceof Graph))properties.__node.tag=parent.__node.tag+"."+properties.__node.tag;if(parent instanceof Graph&&properties instanceof Graph){if(properties.__node.loaders)Object.assign(parent.__node.loaders?parent.__node.loaders:{},properties.__node.loaders);if(parent.__node.mapGraphs){properties.__node.nodes.forEach(n=>{parent.set(properties.__node.tag+"."+n.__node.tag,n)});let ondelete=()=>{properties.__node.nodes.forEach(n=>{parent.__node.nodes.delete(properties.__node.tag+"."+n.__node.tag)})};this.__addOndisconnected(ondelete)}}properties.__node=Object.assign(this.__node,properties.__node);let keys=Object.getOwnPropertyNames(properties);for(const key of keys){this[key]=properties[key]}if(properties.__operator&&parent instanceof GraphNode&&parent.__operator){let sub=parent.__subscribe(this);let ondelete=()=>{parent?.__unsubscribe(sub)};this.__addOndisconnected(ondelete)}else if(typeof properties.default==="function"&&!properties.__operator){let fn=properties.default.bind(this);this.default=(...args)=>{if(this.__node.inputState)this.__node.state.setValue(this.__node.unique+"input",args);let result=fn(...args);if(typeof result?.then==="function"){result.then(res=>{if(res!==void 0)this.__node.state.setValue(this.__node.unique,res)}).catch(console.error)}else if(result!==void 0)this.__node.state.setValue(this.__node.unique,result);return result};properties.default=this.default}if(properties instanceof Graph)this.__node.source=properties}}__addLocalState(props){if(!props)return;if(!this.__node.localState){this.__node.localState={}}let localState=this.__node.localState;for(let k in props){if(this.__props&&this.__props[k])continue;if(typeof props[k]==="function"){if(!k.startsWith("_")){let fn=props[k].bind(this);props[k]=(...args)=>{if(this.__node.inputState)this.__node.state.setValue(this.__node.unique+"."+k+"input",args);let result=fn(...args);if(typeof result?.then==="function"){if(this.__node.state.triggers[this.__node.unique+"."+k])result.then(res=>{this.__node.state.setValue(this.__node.unique+"."+k,res)}).catch(console.error)}else if(this.__node.state.triggers[this.__node.unique+"."+k])this.__node.state.setValue(this.__node.unique+"."+k,result);return result};this[k]=props[k]}}else{localState[k]=props[k];let definition={get:()=>{return localState[k]},set:v=>{localState[k]=v;if(this.__node.state.triggers[this.__node.unique+"."+k])this.__node.state.setValue(this.__node.unique+"."+k,v)},enumerable:true,configurable:true};Object.defineProperty(this,k,definition);if(typeof this.__node.initial==="object"){let dec=Object.getOwnPropertyDescriptor(this.__node.initial,k);if(dec===void 0||dec?.configurable){Object.defineProperty(this.__node.initial,k,definition)}}}}}__addOnconnected(callback){if(Array.isArray(this.__ondisconnected)){this.__onconnected.push(callback)}else if(typeof this.__onconnected==="function"){this.__onconnected=[callback,this.__onconnected]}else this.__onconnected=callback}__addOndisconnected(callback){if(Array.isArray(this.__ondisconnected)){this.__ondisconnected.push(callback)}else if(typeof this.__ondisconnected==="function"){this.__ondisconnected=[callback,this.__ondisconnected]}else this.__ondisconnected=callback}__callConnected(node=this){if(typeof this.__onconnected==="function"){this.__onconnected(this)}else if(Array.isArray(this.__onconnected)){this.__onconnected.forEach(o=>{o(this)})}}__callDisconnected(node=this){if(typeof this.__ondisconnected==="function")this.__ondisconnected(this);else if(Array.isArray(this.__ondisconnected)){this.__ondisconnected.forEach(o=>{o(this)})}}};var Graph=class{constructor(options){this.__node={tag:`graph${Math.floor(Math.random()*1e15)}`,nodes:new Map,state};this.init=options=>{if(options){recursivelyAssign(this.__node,options);if(options.tree)this.setTree(options.tree)}};this.setTree=tree=>{this.__node.tree=Object.assign(this.__node.tree?this.__node.tree:{},tree);let cpy=Object.assign({},tree);if(cpy.__node)delete cpy.__node;let listeners=this.recursiveSet(cpy,this,void 0,tree);if(tree.__node){if(!tree.__node.tag)tree.__node._tag=`tree${Math.floor(Math.random()*1e15)}`;else if(!this.get(tree.__node.tag)){let node=new GraphNode(tree,this,this);for(const l in this.__node.loaders){this.__node.loaders[l](node,this,this,tree,tree,tree.__node.tag)}this.set(node.__node.tag,node);if(node.__listeners){listeners[node.__node.tag]=node.__listeners}}}this.setListeners(listeners);return cpy};this.setLoaders=(loaders2,replace)=>{if(replace)this.__node.loaders=loaders2;else Object.assign(this.__node.loaders,loaders2);return this.__node.loaders};this.add=(properties,parent)=>{let listeners={};if(typeof parent==="string")parent=this.get(parent);if(typeof properties==="function")properties={__operator:properties};else if(typeof properties==="string")properties=this.__node.tree[properties];let p=Object.assign({},properties);if(!p.__node)p.__node={};p.__node.initial=properties;if(typeof properties==="object"&&(!p?.__node?.tag||!this.get(p.__node.tag))){let node=new GraphNode(p,parent,this);for(const l in this.__node.loaders){this.__node.loaders[l](node,parent,this,this.__node.tree,properties)}this.set(node.__node.tag,node);this.__node.tree[node.__node.tag]=properties;if(node.__listeners){listeners[node.__node.tag]=node.__listeners}if(node.__children){node.__children=Object.assign({},node.__children);this.recursiveSet(node.__children,node,listeners,node.__children)}this.setListeners(listeners);node.__callConnected();return node}return};this.recursiveSet=(t,parent,listeners={},origin)=>{let keys=Object.getOwnPropertyNames(origin);for(const key of keys){if(key.includes("__"))continue;let p=origin[key];if(Array.isArray(p))continue;if(typeof p==="function")p={__operator:p};else if(typeof p==="string")p=this.__node.tree[p];else if(typeof p==="boolean")p=this.__node.tree[key];if(typeof p==="object"){p=Object.assign({},p);if(!p.__node)p.__node={};if(!p.__node.tag)p.__node.tag=key;p.__node.initial=t[key];if(this.get(p.__node.tag)&&!(parent?.__node&&this.get(parent.__node.tag+"."+p.__node.tag))||parent?.__node&&this.get(parent.__node.tag+"."+p.__node.tag))continue;let node=new GraphNode(p,parent,this);for(const l in this.__node.loaders){this.__node.loaders[l](node,parent,this,t,t[key],key)}t[key]=node;this.__node.tree[node.__node.tag]=p;this.set(node.__node.tag,node);if(node.__listeners){listeners[node.__node.tag]=node.__listeners}else if(node.__children){node.__children=Object.assign({},node.__children);this.recursiveSet(node.__children,node,listeners,node.__children)}node.__callConnected()}}return listeners};this.remove=(node,clearListeners=true)=>{this.unsubscribe(node);if(typeof node==="string")node=this.get(node);if(node instanceof GraphNode){this.delete(node.__node.tag);delete this.__node.tree[node.__node.tag];if(clearListeners){this.clearListeners(node)}node.__callDisconnected();const recursiveRemove=t=>{for(const key in t){this.unsubscribe(t[key]);this.delete(t[key].__node.tag);delete this.__node.tree[t[key].__node.tag];this.delete(key);delete this.__node.tree[key];t[key].__node.tag=t[key].__node.tag.substring(t[key].__node.tag.lastIndexOf(".")+1);if(clearListeners){this.clearListeners(t[key])}t[key].__callDisconnected();if(t[key].__children){recursiveRemove(t[key].__children)}}};if(node.__children){recursiveRemove(node.__children)}}if(node?.__node.tag&&node?.__parent){delete node?.__parent;node.__node.tag=node.__node.tag.substring(node.__node.tag.indexOf(".")+1)}return node};this.run=(node,...args)=>{if(typeof node==="string"){let nd=this.get(node);if(!nd&&node.includes(".")){nd=this.get(node.substring(0,node.lastIndexOf(".")));if(typeof nd?.[node.substring(node.lastIndexOf(".")+1)]==="function")return nd[node.substring(node.lastIndexOf(".")+1)](...args)}else if(nd?.__operator)return nd.__operator(...args)}if(node?.__operator){return node?.__operator(...args)}};this.setListeners=listeners=>{for(const key in listeners){let node=this.get(key);if(typeof listeners[key]==="object"){for(const k in listeners[key]){let n=this.get(k);let sub;if(typeof listeners[key][k]!=="object")listeners[key][k]={callback:listeners[key][k]};if(typeof listeners[key][k].callback==="function")listeners[key][k].callback=listeners[key][k].callback.bind(node);if(typeof node.__listeners!=="object")node.__listeners={};if(!n){let tag=k.substring(0,k.lastIndexOf("."));n=this.get(tag);if(n){sub=this.subscribe(n,listeners[key][k].callback,k.substring(k.lastIndexOf(".")+1),listeners[key][k].inputState,key,k);if(typeof node.__listeners[k]!=="object")node.__listeners[k]={callback:listeners[key][k].callback,inputState:listeners[key][k]?.inputState};node.__listeners[k].sub=sub}}else{sub=this.subscribe(n,listeners[key][k].callback,void 0,listeners[key][k].inputState,key,k);if(typeof node.__listeners[k]!=="object")node.__listeners[k]={callback:listeners[key][k].callback,inputState:listeners[key][k]?.inputState};node.__listeners[k].sub=sub}}}}};this.clearListeners=(node,listener)=>{if(typeof node==="string")node=this.get(node);if(node?.__listeners){for(const key in node.__listeners){if(listener&&key!==listener)continue;if(typeof node.__listeners[key].sub!=="number")continue;let n=this.get(key);if(!n){n=this.get(key.substring(0,key.lastIndexOf(".")));if(n)this.unsubscribe(n,node.__listeners[key].sub,key.substring(key.lastIndexOf(".")+1),node.__listeners[key].inputState)}else{this.unsubscribe(n,node.__listeners[key].sub,void 0,node.__listeners[key].inputState)}delete node.__listeners[key]}}};this.get=tag=>{return this.__node.nodes.get(tag)};this.set=(tag,node)=>{return this.__node.nodes.set(tag,node)};this.delete=tag=>{return this.__node.nodes.delete(tag)};this.getProps=(node,getInitial)=>{if(typeof node==="string")node=this.get(node);if(node instanceof GraphNode){let cpy;if(getInitial)cpy=Object.assign({},this.__node.tree[node.__node.tag]);else{cpy=Object.assign({},node);delete cpy.__unsubscribe;delete cpy.__setOperator;delete cpy.__node;delete cpy.__subscribeState;delete cpy.__subscribe}}};this.subscribe=(node,callback,key,subInput,target,bound)=>{let nd=node;if(!(node instanceof GraphNode))nd=this.get(node);let sub;if(typeof callback==="string"){if(target){let method=this.get(target)?.[callback];if(typeof method==="function")callback=method}else callback=this.get(callback)?.__operator}if(nd instanceof GraphNode){sub=nd.__subscribe(callback,key,subInput,target,bound);let ondelete=()=>{nd.__unsubscribe(sub,key,subInput)};nd.__addOndisconnected(ondelete)}else if(typeof node==="string"){if(this.get(node)){if(callback instanceof GraphNode&&callback.__operator){sub=this.get(node).__subscribe(callback.__operator,key,subInput,target,bound);let ondelete=()=>{this.get(node).__unsubscribe(sub)};callback.__addOndisconnected(ondelete)}else if(typeof callback==="function"||typeof callback==="string"){sub=this.get(node).__subscribe(callback,key,subInput,target,bound);this.__node.state.getTrigger(this.get(node).__node.unique,sub).source=node}}else{if(typeof callback==="string")callback=this.__node.nodes.get(callback).__operator;if(typeof callback==="function")sub=this.__node.state.subscribeTrigger(node,callback)}}return sub};this.unsubscribe=(node,sub,key,subInput)=>{if(node instanceof GraphNode){return node.__unsubscribe(sub,key,subInput)}else return this.get(node)?.__unsubscribe(sub,key,subInput)};this.setState=update=>{this.__node.state.setState(update)};this.init(options)}};function recursivelyAssign(target,obj){for(const key in obj){if(obj[key]?.constructor.name==="Object"&&!Array.isArray(obj[key])){if(target[key]?.constructor.name==="Object"&&!Array.isArray(target[key]))recursivelyAssign(target[key],obj[key]);else target[key]=recursivelyAssign({},obj[key])}else{target[key]=obj[key]}}return target}function getAllProperties(obj){var allProps=[],curr=obj;do{var props=Object.getOwnPropertyNames(curr);props.forEach(function(prop){if(allProps.indexOf(prop)===-1)allProps.push(prop)})}while(curr=Object.getPrototypeOf(curr));return allProps}var backprop=(node,parent,graph)=>{if(node.__node.backward&&parent instanceof GraphNode){graph.setListeners({[parent.__node.tag]:{[node.__node.tag]:parent}})}};var loop=(node,parent,graph)=>{if(node.__operator&&!node.__node.looperSet){node.__node.looperSet=true;if(typeof node.__node.delay==="number"){let fn=node.__operator;node.__operator=(...args)=>{return new Promise((res,rej)=>{setTimeout(async()=>{res(await fn(...args))},node.__node.delay)})}}else if(node.__node.frame===true){let fn=node.__operator;node.__operator=(...args)=>{return new Promise((res,rej)=>{requestAnimationFrame(async()=>{res(await fn(...args))})})}}if(typeof node.__node.repeat==="number"||typeof node.__node.recursive==="number"){let fn=node.__operator;node.__operator=async(...args)=>{let i=node.__node.repeat?node.__node.repeat:node.__node.recursive;let result;let repeater=async(tick,...inp)=>{while(tick>0){if(node.__node.delay||node.__node.frame){fn(...inp).then(async res=>{if(node.__node.recursive){await repeater(tick,res)}else await repeater(tick,...inp)});break}else result=await fn(...args);tick--}};await repeater(i,...args);return result}}if(node.__node.loop&&typeof node.__node.loop==="number"){let fn=node.__operator;node.__operator=(...args)=>{if(!("looping"in node.__node))node.__node.looping=true;if(node.__node.looping){fn(...args);setTimeout(()=>{node.__operator(...args)},node.__node.loop)}};if(node.__node.looping)node.__operator();let ondelete=node2=>{if(node2.__node.looping)node2.__node.looping=false};node.__addOndisconnected(ondelete)}}};var animate=(node,parent,graph)=>{if(node.__node.animate===true||node.__animation){let fn=node.__operator;node.__operator=(...args)=>{if(!("animating"in node.__node))node.__node.animating=true;if(node.__node.animating){if(typeof node.__animation==="function")node.__animation(...args);else fn(...args);requestAnimationFrame(()=>{node.__operator(...args)})}};if(node.__node.animating||(!("animating"in node.__node)||node.__node.animating)&&node.__animation)setTimeout(()=>{requestAnimationFrame(node.__operator())},10);let ondelete=node2=>{if(node2.__node.animating)node2.__node.animating=false};node.__addOndisconnected(ondelete)}};var branching=(node,parent,graph)=>{if(typeof node.__node.branch==="object"&&node.__operator&&!node.__node.branchApplied){let fn=node.__operator;node.__node.branchApplied=true;node.__operator=(...args)=>{let result=fn(...args);for(const key in node.__node.branch){let triggered=()=>{if(typeof node.__node.branch[key].then==="function"){node.__node.branch[key].then(result)}else if(node.__node.branch[key].then instanceof GraphNode&&node.__node.branch[key].then.__operator){node.__node.branch[key].then.__operator(result)}else result=node.__node.branch[key].then};if(typeof node.__node.branch[key].if==="function"){if(node.__node.branch[key].if(result)){triggered()}}else if(node.__node.branch[key].if===result){triggered()}}return result}}if(node.__listeners){for(const key in node.__listeners){if(typeof node.__listeners[key]==="object"){if(node.__listeners[key].branch&&!node.__listeners[key].branchApplied){let fn=node.__listeners[key].callback;node.__listeners[key].branchApplied=true;node.__listeners.callback=ret=>{let triggered=()=>{if(typeof node.__listeners[key].branch.then==="function"){ret=node.__listeners[key].branch.then(ret)}else if(node.__listeners[key].branch.then instanceof GraphNode&&node.__listeners[key].branch.then.__operator){ret=node.__listeners[key].branch.then.__operator(ret)}else ret=node.__listeners[key].branch.then};if(typeof node.__listeners[key].branch.if==="function"){if(node.__listeners[key].branch.if(ret)){triggered()}}else if(node.__listeners[key].branch.if===ret){triggered()}return fn(ret)}}}}}};var triggerListenerOncreate=(node,parent,graph)=>{if(node.__listeners){for(const key in node.__listeners){if(typeof node.__listeners[key]==="object"){if(node.__listeners[key].oncreate){node.__listeners[key].callback(node.__listeners[key].oncreate)}}}}};var bindListener=(node,parent,graph)=>{if(node.__listeners){for(const key in node.__listeners){if(typeof node.__listeners[key]==="object"){if(typeof node.__listeners[key].binding==="object"){node.__listeners.callback=node.__listeners.callback.bind(node.__listeners[key].binding)}}}}};var transformListenerResult=(node,parent,graph)=>{if(node.__listeners){for(const key in node.__listeners){if(typeof node.__listeners[key]==="object"){if(typeof node.__listeners[key].transform==="function"&&!node.__listeners[key].transformApplied){let fn=node.__listeners[key].callback;node.__listeners[key].transformApplied=true;node.__listeners.callback=ret=>{ret=node.__listeners[key].transform(ret);return fn(ret)}}}}}};var substitute__operator=(node,parent,graph)=>{if(node.post&&!node.__operator){node.__setOperator(node.post)}else if(!node.__operator&&typeof node.get=="function"){node.__setOperator(node.get)}if(!node.get&&node.__operator){node.get=node.__operator}if(node.aliases){node.aliases.forEach(a=>{graph.set(a,node);let ondelete=node2=>{graph.__node.nodes.delete(a)};node.__addOndisconnected(ondelete)})}if(typeof graph.__node.tree[node.__node.tag]==="object"&&node.get)graph.__node.tree[node.__node.tag].get=node.get};var loaders={backprop,loop,animate,branching,triggerListenerOncreate,bindListener,transformListenerResult,substitute__operator};var Service=class extends Graph{constructor(options){super({...options,loaders:options?.loaders?Object.assign({...loaders},options.loaders):{...loaders}});this.name=`service${Math.floor(Math.random()*1e15)}`;this.addServices=services=>{for(const s in services){if(typeof services[s]==="function")services[s]=new services[s];if(services[s]?.__node?.loaders)Object.assign(this.__node.loaders,services[s].__node.loaders);if(services[s]?.__node?.nodes){services[s].__node.nodes.forEach((n,tag)=>{if(!this.get(tag)){this.set(tag,n)}else this.set(s+"."+tag,n)});this.__node.nodes.forEach((n,k)=>{if(!services[s].__node.nodes.get(k))services[s].__node.nodes.set(k,n)});let set=this.set;this.set=(tag,node)=>{services[s].set(tag,node);return set(tag,node)};let del=this.delete;this.delete=tag=>{services[s].delete(tag);return del(tag)}}else if(typeof services[s]==="object"){this.setTree(services[s])}}};this.handleMethod=(route,method,args)=>{let m=method.toLowerCase();let src=this.__node.nodes.get(route);if(!src){src=this.__node.tree[route]}if(src?.[m]){if(!(src[m]instanceof Function)){if(args)src[m]=args;return src[m]}else return src[m](args)}else return this.handleServiceMessage({route,args,method})};this.transmit=(...args)=>{if(typeof args[0]==="object"){if(args[0].method){return this.handleMethod(args[0].route,args[0].method,args[0].args)}else if(args[0].route){return this.handleServiceMessage(args[0])}else if(args[0].node){return this.handleGraphNodeCall(args[0].node,args[0].args)}else if(this.__node.keepState){if(args[0].route)this.setState({[args[0].route]:args[0].args});if(args[0].node)this.setState({[args[0].node]:args[0].args})}return args}else return args};this.receive=(...args)=>{if(args[0]){if(typeof args[0]==="string"){let substr=args[0].substring(0,8);if(substr.includes("{")||substr.includes("[")){if(substr.includes("\\\\"))args[0]=args[0].replace(/\\\\/g,"");if(args[0][0]===\'"\'){args[0]=args[0].substring(1,args[0].length-1)};args[0]=JSON.parse(args[0])}}}if(typeof args[0]==="object"){if(args[0].method){return this.handleMethod(args[0].route,args[0].method,args[0].args)}else if(args[0].route){return this.handleServiceMessage(args[0])}else if(args[0].node){return this.handleGraphNodeCall(args[0].node,args[0].args)}else if(this.__node.keepState){if(args[0].route)this.setState({[args[0].route]:args[0].args});if(args[0].node)this.setState({[args[0].node]:args[0].args})}return args}else return args};this.pipe=(source,destination,endpoint,method,callback)=>{if(source instanceof GraphNode){if(callback)return this.subscribe(source,res=>{let mod=callback(res);if(mod!==void 0)this.transmit({route:destination,args:mod,method});else this.transmit({route:destination,args:res,method},endpoint)});else return this.subscribe(source,res=>{this.transmit({route:destination,args:res,method},endpoint)})}else if(typeof source==="string")return this.subscribe(source,res=>{this.transmit({route:destination,args:res,method},endpoint)})};this.pipeOnce=(source,destination,endpoint,method,callback)=>{if(source instanceof GraphNode){if(callback)return source.__node.state.subscribeTriggerOnce(source.__node.unique,res=>{let mod=callback(res);if(mod!==void 0)this.transmit({route:destination,args:mod,method});else this.transmit({route:destination,args:res,method},endpoint)});else return this.__node.state.subscribeTriggerOnce(source.__node.unique,res=>{this.transmit({route:destination,args:res,method},endpoint)})}else if(typeof source==="string")return this.__node.state.subscribeTriggerOnce(this.__node.nodes.get(source).__node.unique,res=>{this.transmit({route:destination,args:res,method},endpoint)})};this.terminate=(...args)=>{};this.isTypedArray=isTypedArray;this.recursivelyAssign=recursivelyAssign2;this.spliceTypedArray=spliceTypedArray;this.ping=()=>{console.log("pinged!");return"pong"};this.echo=(...args)=>{this.transmit(...args);return args};if(options?.services)this.addServices(options.services);this.setTree(this)}handleServiceMessage(message){let call;if(typeof message==="object"){if(message.route)call=message.route;else if(message.node)call=message.node}if(call){if(Array.isArray(message.args))return this.run(call,...message.args);else return this.run(call,message.args)}else return message}handleGraphNodeCall(route,args){if(!route)return args;if(args?.args){this.handleServiceMessage(args)}else if(Array.isArray(args))return this.run(route,...args);else return this.run(route,args)}};function isTypedArray(x2){return ArrayBuffer.isView(x2)&&Object.prototype.toString.call(x2)!=="[object DataView]"}var recursivelyAssign2=(target,obj)=>{for(const key in obj){if(typeof obj[key]==="object"&&!Array.isArray(obj[key])){if(typeof target[key]==="object"&&!Array.isArray(target[key]))recursivelyAssign2(target[key],obj[key]);else target[key]=recursivelyAssign2({},obj[key])}else target[key]=obj[key]}return target};function spliceTypedArray(arr,start,end){let s=arr.subarray(0,start);let e;if(end){e=arr.subarray(end+1)}let ta;if(s.length>0||e?.length>0)ta=new arr.constructor(s.length+e.length);if(ta){if(s.length>0)ta.set(s);if(e&&e.length>0)ta.set(e,s.length)}return ta}function parseFunctionFromText(method=""){let getFunctionBody=methodString=>{return methodString.replace(/^\\W*(function[^{]+\\{([\\s\\S]*)\\}|[^=]+=>[^{]*\\{([\\s\\S]*)\\}|[^=]+=>(.+))/i,"$2$3$4")};let getFunctionHead=methodString=>{let startindex=methodString.indexOf("=>")+1;if(startindex<=0){startindex=methodString.indexOf("){")}if(startindex<=0){startindex=methodString.indexOf(") {")}return methodString.slice(0,methodString.indexOf("{",startindex)+1)};let newFuncHead=getFunctionHead(method);let newFuncBody=getFunctionBody(method);let newFunc;if(newFuncHead.includes("function")){let varName=newFuncHead.split("(")[1].split(")")[0];newFunc=new Function(varName,newFuncBody)}else{if(newFuncHead.substring(0,6)===newFuncBody.substring(0,6)){let varName=newFuncHead.split("(")[1].split(")")[0];newFunc=new Function(varName,newFuncBody.substring(newFuncBody.indexOf("{")+1,newFuncBody.length-1))}else{try{newFunc=(0,eval)(newFuncHead+newFuncBody+"}")}catch{}}}return newFunc}var stringifyWithCircularRefs=function(){const refs=new Map;const parents=[];const path=["this"];function clear(){refs.clear();parents.length=0;path.length=1}function updateParents(key,value){var idx=parents.length-1;var prev=parents[idx];if(typeof prev==="object"){if(prev[key]===value||idx===0){path.push(key);parents.push(value.pushed)}else{while(idx-->=0){prev=parents[idx];if(typeof prev==="object"){if(prev[key]===value){idx+=2;parents.length=idx;path.length=idx;--idx;parents[idx]=value;path[idx]=key;break}}idx--}}}}function checkCircular(key,value){if(value!=null){if(typeof value==="object"){if(key){updateParents(key,value)}let other=refs.get(value);if(other){return"[Circular Reference]"+other}else{refs.set(value,path.join("."))}}}return value}return function stringifyWithCircularRefs2(obj,space){try{parents.push(obj);return JSON.stringify(obj,checkCircular,space)}finally{clear()}}}();if(JSON.stringifyWithCircularRefs===void 0){JSON.stringifyWithCircularRefs=stringifyWithCircularRefs}var stringifyFast=function(){const refs=new Map;const parents=[];const path=["this"];function clear(){refs.clear();parents.length=0;path.length=1}function updateParents(key,value){var idx=parents.length-1;if(parents[idx]){var prev=parents[idx];if(typeof prev==="object"){if(prev[key]===value||idx===0){path.push(key);parents.push(value.pushed)}else{while(idx-->=0){prev=parents[idx];if(typeof prev==="object"){if(prev[key]===value){idx+=2;parents.length=idx;path.length=idx;--idx;parents[idx]=value;path[idx]=key;break}}idx++}}}}}function checkValues(key,value){let val;if(value!=null){if(typeof value==="object"){let c=value.constructor.name;if(key&&c==="Object"){updateParents(key,value)}let other=refs.get(value);if(other){return"[Circular Reference]"+other}else{refs.set(value,path.join("."))}if(c==="Array"){if(value.length>20){val=value.slice(value.length-20)}else val=value}else if(c.includes("Set")){val=Array.from(value)}else if(c!=="Object"&&c!=="Number"&&c!=="String"&&c!=="Boolean"){val="instanceof_"+c}else if(c==="Object"){let obj={};for(const prop in value){if(value[prop]==null){obj[prop]=value[prop]}else if(Array.isArray(value[prop])){if(value[prop].length>20)obj[prop]=value[prop].slice(value[prop].length-20);else obj[prop]=value[prop]}else if(value[prop].constructor.name==="Object"){obj[prop]={};for(const p in value[prop]){if(Array.isArray(value[prop][p])){if(value[prop][p].length>20)obj[prop][p]=value[prop][p].slice(value[prop][p].length-20);else obj[prop][p]=value[prop][p]}else{if(value[prop][p]!=null){let con=value[prop][p].constructor.name;if(con.includes("Set")){obj[prop][p]=Array.from(value[prop][p])}else if(con!=="Number"&&con!=="String"&&con!=="Boolean"){obj[prop][p]="instanceof_"+con}else{obj[prop][p]=value[prop][p]}}else{obj[prop][p]=value[prop][p]}}}}else{let con=value[prop].constructor.name;if(con.includes("Set")){obj[prop]=Array.from(value[prop])}else if(con!=="Number"&&con!=="String"&&con!=="Boolean"){obj[prop]="instanceof_"+con}else{obj[prop]=value[prop]}}}val=obj}else{val=value}}else{val=value}}return val}return function stringifyFast2(obj,space){parents.push(obj);let res=JSON.stringify(obj,checkValues,space);clear();return res}}();if(JSON.stringifyFast===void 0){JSON.stringifyFast=stringifyFast}var unsafeRoutes={setRoute:function(fn,fnName){if(typeof fn==="string")fn=parseFunctionFromText(fn);if(typeof fn==="function"){if(!fnName)fnName=fn.name;if(this.__node.graph.get(fnName)){this.__node.graph.get(fnName).__setOperator(fn)}else{let node=this.__node.graph.add({__node:{tag:fnName},__operator:fn})}return true}return false},setNode:function(fn,fnName){if(typeof fn==="string")fn=parseFunctionFromText(fn);if(typeof fn==="function"){if(!fnName)fnName=fn.name;if(this.__node.graph.get(fnName)){this.__node.graph.get(fnName).__setOperator(fn)}else this.__node.graph.add({__node:{tag:fnName},__operator:fn});return true}return false},setMethod:function(route,fn,fnName){if(typeof fn==="string")fn=parseFunctionFromText(fn);if(typeof fn==="function"){if(!fnName)fnName=fn.name;if(this.__node.graph.get(route)){this.__node.graph.get(route)[fnName]=fn}else this.__node.graph.add({__node:{tag:fnName,[fnName]:fn}});return true}return false},assignRoute:function(route,source){if(this.__node.graph.get(route)&&typeof source==="object"){Object.assign(this.__node.graph.get(route),source)}},transferClass:(classObj,className)=>{if(typeof classObj==="object"){let str=classObj.toString();let message={route:"receiveClass",args:[str,className]};return message}return false},receiveClass:function(stringified,className){if(typeof stringified==="string"){if(stringified.indexOf("class")===0){let cls=(0,eval)("("+stringified+")");let name=className;if(!name)name=cls.name;this.__node.graph[name]=cls;return true}}return false},setGlobal:(key,value)=>{globalThis[key]=value;return true},assignGlobalObject:(target,source)=>{if(!globalThis[target])return false;if(typeof source==="object")Object.assign(globalThis[target],source);return true},setValue:function(key,value){this.__node.graph[key]=value;return true},assignObject:function(target,source){if(!this.__node.graph[target])return false;if(typeof source==="object")Object.assign(this.__node.graph[target],source);return true},setGlobalFunction:(fn,fnName)=>{if(typeof fn==="string")fn=parseFunctionFromText(fn);if(typeof fn==="function"){if(!fnName)fnName=fn.name;globalThis[fnName]=fn;return true}return false},assignFunctionToGlobalObject:function(globalObjectName,fn,fnName){if(!globalThis[globalObjectName])return false;if(typeof fn==="string")fn=parseFunctionFromText(fn);if(typeof fn==="function"){if(!fnName)fnName=fn.name;this.__node.graph[globalObjectName][fnName]=fn;return true}return false},setFunction:function(fn,fnName){if(typeof fn==="string")fn=parseFunctionFromText(fn);if(typeof fn==="function"){if(!fnName)fnName=fn.name;this.__node.graph[fnName]=fn;return true}return false},assignFunctionToObject:function(objectName,fn,fnName){if(!this.__node.graph[objectName])return false;if(typeof fn==="string")fn=parseFunctionFromText(fn);if(typeof fn==="function"){if(!fnName)fnName=fn.name;this.__node.graph[objectName][fnName]=fn;return true}return false}};var import_sjcl=__toESM(require_sjcl());var _HTTPfrontend=class extends Service{constructor(options,path,fetched){super(options);this.name="http";this.fetchProxied=false;this.listening={};this.GET=(url="http://localhost:8080/ping",type="",mimeType)=>{if(type==="json")mimeType="application/json";return new Promise((resolve,reject)=>{let xhr=_HTTPfrontend.request({method:"GET",url,responseType:type,mimeType,onload:ev2=>{let data;if(xhr.responseType===""||xhr.responseType==="text")data=xhr.responseText;else data=xhr.response;if(url instanceof URL)url=url.toString();this.setState({[url]:data});resolve(data)},onabort:er=>{reject(er)}})}).catch(console.error)};this.POST=(message,url="http://localhost:8080/echo",type="",mimeType)=>{if(typeof message==="object"&&(type==="json"||type==="text"||!type)){message=JSON.stringify(message)}if(type==="json")mimeType="application/json";return new Promise((resolve,reject)=>{let xhr=_HTTPfrontend.request({method:"POST",url,data:message,responseType:type,mimeType,onload:ev2=>{let data;if(xhr.responseType===""||xhr.responseType==="text")data=xhr.responseText;else data=xhr.response;if(url instanceof URL)url=url.toString();this.setState({[url]:data});resolve(data)},onabort:er=>{reject(er)}})}).catch(console.error)};this.transmit=(message,url)=>{let obj=message;if(typeof obj==="object"){message=JSON.stringify(obj)}if(obj?.method?.toLowerCase()=="get"||message?.toLowerCase()==="get")return this.GET(url);return this.POST(message,url)};this.transponder=(url,message,type="",mimeType)=>{if(typeof message==="object")message=JSON.stringify(message);let method="GET";if(message){method="POST"}if(type==="json")mimeType="application/json";else return new Promise((resolve,reject)=>{let xhr=_HTTPfrontend.request({method,url,data:message,responseType:type,onload:ev2=>{let body=xhr.response;if(typeof body==="string"){let substr=body.substring(0,8);if(substr.includes("{")||substr.includes("[")){if(substr.includes("\\\\"))body=body.replace(/\\\\/g,"");if(body[0]===\'"\'){body=body.substring(1,body.length-1)};body=JSON.parse(body)}}if(typeof body?.method==="string"){return resolve(this.handleMethod(body.route,body.method,body.args))}else if(typeof body?.route==="string"){return resolve(this.handleServiceMessage(body))}else if(typeof body?.node==="string"||body.node instanceof GraphNode){return resolve(this.handleGraphNodeCall(body.node,body.args))}else return resolve(body)},onabort:er=>{reject(er)}})}).catch(console.error)};this.listen=(path="0",fetched=async(clone,args,response)=>{const result=await clone.text();const returned=this.receive(result);this.setState({[response.url]:returned})})=>{this.listening[path]={};let listenerId=`${path}${Math.floor(Math.random()*1e15)}`;this.listening[path][listenerId]=fetched;if(!this.fetchProxied){globalThis.fetch=new Proxy(globalThis.fetch,{apply(fetch,that,args){const result=fetch.apply(that,args);result.then(response=>{if(!response.ok)return;if(this.listening["0"]){for(const key in this.listeners){const clone=response.clone();this.listening["0"][key](clone,args,response)}}else{for(const key in this.listening){if(response.url.includes(key)){for(const key2 in this.listening[path]){const clone=response.clone();this.listening[path][key2](clone,args,response)}break}}}}).catch(er=>{console.error(er)});return result}});this.fetchProxied=true}return listenerId};this.stopListening=(path,listener)=>{if(!path&&path!==0){for(const key in this.listening)delete this.listening[key]}else{if(!listener)delete this.listening[path];else delete this.listening[listener]}};this.setTree(this);this.listen(path,fetched)}};var HTTPfrontend=_HTTPfrontend;HTTPfrontend.request=options=>{const xhr=new XMLHttpRequest;if(options.responseType)xhr.responseType=options.responseType;else options.responseType="json";if(options.mimeType){xhr.overrideMimeType(options.mimeType)}if(options.onload)xhr.addEventListener("load",options.onload,false);if(options.onprogress)xhr.addEventListener("progress",options.onprogress,false);if(options.onabort)xhr.addEventListener("abort",options.onabort,false);if(options.onloadend)xhr.addEventListener("loadend",options.onloadend,false);if(options.onerror)xhr.addEventListener("error",options.onerror,false);xhr.open(options.method,options.url,true,options.user,options.pass);if(!options.onerror)xhr.onerror=function(){xhr.abort()};xhr.send(options.data);return xhr};var import_web_worker=__toESM(require_browser());var WorkerService=class extends Service{constructor(options){super();this.name="worker";this.workers={};this.threadRot=0;this.loadWorkerRoute=(rt,routeKey)=>{if(rt.workerUrl)rt.url=rt.workerUrl;if(rt.workerId)rt.__node.tag=rt.workerId;if(!rt.__node.tag)rt.__node.tag=routeKey;rt._id=rt.__node.tag;let worker;if(this.workers[rt._id])worker=this.workers[rt._id];else if(rt.worker)worker=rt.worker;if(!worker){worker=this.addWorker(rt);let ondelete=rt2=>{rt2.worker?.terminate()};rt.__addOndisconnected(ondelete)}rt.worker=worker;if(rt.transferFunctions){for(const prop in rt.transferFunctions){this.transferFunction(worker,rt.transferFunctions[prop],prop)}}if(rt.transferClasses){for(const prop in rt.transferClasses){this.transferClass(worker,rt.transferClasses[prop],prop)}}if(worker){if(!rt.__operator){rt.__operator=(...args)=>{if(rt.callback){if(!this.__node.nodes.get(rt.__node.tag)?.__children)worker.post(rt.callback,args);else return worker.run(rt.callback,args)}else{if(!this.__node.nodes.get(rt.__node.tag)?.__children)worker.send(args);else return worker.request(args)}}}if(rt.init){worker.run(rt.init,rt.initArgs,rt.initTransfer)}return worker}};this.workerloader={"workers":(node,parent,graph,tree)=>{let rt=node;if(!node.parentRoute&&(parent?.callback&&parent?.worker))node.parentRoute=parent?.callback;if(rt?.worker||rt?.workerId||rt?.workerUrl){let worker=this.loadWorkerRoute(rt,rt.__node.tag);if(worker){if(!rt.parentRoute&&rt.__parent?.callback)rt.parentRoute=rt.__parent.callback;if(rt.__parent&&!rt.portId){if(typeof rt.__parent==="string"){if(rt.__node.tag!==rt.__parent&&worker._id!==rt.__parent)rt.portId=this.establishMessageChannel(worker,rt.__parent)}else if(rt.__node.tag!==rt.__parent?.__node?.tag&&worker._id!==rt.__parent.tag){rt.portId=this.establishMessageChannel(worker,rt.__parent.worker)}};if(rt.parentRoute){if(!rt.stopped){if(typeof rt.__parent==="string"&&rt.__parent===worker._id){worker.run("subscribe",[rt.parentRoute,void 0,rt.callback])}else if(rt.__node.tag===rt.__parent?.__node?.tag||worker._id===rt.__parent?.__node?.tag){worker.run("subscribe",[rt.parentRoute,void 0,rt.callback])}else worker.run("subscribeToWorker",[rt.parentRoute,rt.portId,rt.callback,rt.blocking]).then(sub=>{worker.workerSubs[rt.parentRoute+rt.portId].sub=sub})}if(!(typeof rt.__parent==="string"&&rt.__parent===worker._id)&&!(rt.__node.tag===rt.__parent?.__node?.tag||worker._id===rt.__parent?.__node?.tag))worker.workerSubs[rt.parentRoute+rt.portId]={sub:null,route:rt.parentRoute,portId:rt.portId,callback:rt.callback,blocking:rt.blocking}}else if(rt.__parent){if(typeof rt.__parent==="string"){if(!rt.stopped){if(rt.__parent===worker._id){worker.run("subscribe",[rt.__parent,void 0,rt.callback])}else worker.run("subscribeToWorker",[rt.__parent,rt.portId,rt.callback,rt.blocking]).then(sub=>{worker.workerSubs[rt.__parent+rt.portId].sub=sub})}if(!(typeof rt.__parent==="string"&&rt.__parent===worker._id))worker.workerSubs[rt+rt.portId]={sub:null,route:worker._id,portId:rt.portId,callback:rt.callback,blocking:rt.blocking}}else if(rt.__parent?.__node?.tag&&rt.__parent?.worker){if(!rt.stopped){if(rt.__node.tag===rt.__parent.__node.tag||worker._id===rt.__parent.__node.tag){worker.run("subscribe",[rt.__parent.__node.tag,void 0,rt.callback])}else worker.run("subscribeToWorker",[rt.__parent.__node.tag,rt.portId,rt.callback,rt.blocking]).then(sub=>{worker.workerSubs[rt.__parent.__node.tag+rt.portId].sub=sub})}if(!(rt.__node.tag===rt.__parent?.__node?.tag||worker._id===rt.__parent?.__node?.tag))worker.workerSubs[rt.__parent.__node.tag+rt.portId]={sub:null,route:rt.__parent.__node.tag,portId:rt.portId,callback:rt.callback,blocking:rt.blocking}}}}}else if(rt.__parent&&rt.parentRoute){console.log(rt);if(typeof rt.__parent==="string"&&tree[rt.__parent]?.worker){tree[rt.__parent].worker.subscribe(rt.parentRoute,rt.__operator,rt.blocking)}else if(rt.__parent?.worker){rt.__parent.worker.subscribe(rt.parentRoute,rt.__operator,rt.blocking)}}return rt}};this.addDefaultMessageListener=()=>{globalThis.onmessage=ev2=>{let result=this.receive(ev2.data);if(this.__node.keepState)this.setState({[this.name]:result})}};this.postMessage=(message,target,transfer)=>{if(this.workers[target]){this.workers[target].send(message,transfer)}else{globalThis.postMessage(message,target,transfer)}};this.addWorker=options=>{let worker;if(!options._id)options._id=`worker${Math.floor(Math.random()*1e15)}`;if(options.url)worker=new import_web_worker.default(options.url);else if(options.port){worker=options.port}else if(this.workers[options._id]){if(this.workers[options._id].port)worker=this.workers[options._id].port;else worker=this.workers[options._id].worker}if(!worker)return;let send=(message,transfer)=>{return this.transmit(message,worker,transfer)};let post=(route,args,transfer,method)=>{let message={route,args};if(method)message.method=method;return this.transmit(message,worker,transfer)};let run=(route,args,transfer,method)=>{return new Promise((res,rej)=>{let callbackId=Math.random();let req={route:"runRequest",args:[{route,args},options._id,callbackId]};if(method)req.args[0].method=method;let onmessage=ev2=>{if(typeof ev2.data==="object"){if(ev2.data.callbackId===callbackId){worker.removeEventListener("message",onmessage);res(ev2.data.args)}}};worker.addEventListener("message",onmessage);this.transmit(req,worker,transfer)})};let request=(message,transfer,method)=>{return new Promise((res,rej)=>{let callbackId=Math.random();let req={route:"runRequest",args:[message,options._id,callbackId]};if(method)req.method=method;let onmessage=ev2=>{if(typeof ev2.data==="object"){if(ev2.data.callbackId===callbackId){worker.removeEventListener("message",onmessage);res(ev2.data.args)}}};worker.addEventListener("message",onmessage);this.transmit(req,worker,transfer)})};let workerSubs={};let subscribe=(route,callback,blocking)=>{return this.subscribeToWorker(route,options._id,callback,blocking)};let unsubscribe=(route,sub)=>{return run("unsubscribe",[route,sub])};let start=async(route,portId,callback,blocking)=>{if(route)await run("subscribeToWorker",[route,portId,callback,blocking]).then(sub=>{if(sub)workerSubs[route+portId]={sub,route,portId,callback,blocking}});else for(const key in workerSubs){if(typeof workerSubs[key].sub!=="number")await run("subscribeToWorker",[workerSubs[key].route,workerSubs[key].portId,workerSubs[key].callback,workerSubs[key].blocking]).then(sub=>{workerSubs[key].sub=sub})}return true};let stop=async(route,portId)=>{if(route&&portId&&workerSubs[route+portId]){await run("unsubscribe",[route,workerSubs[route+portId].sub]);workerSubs[route+portId].sub=false}else{for(const key in workerSubs){if(typeof workerSubs[key].sub==="number"){await run("unpipeWorkers",[workerSubs[key].route,workerSubs[key].portId,workerSubs[key].sub])}workerSubs[key].sub=false}}return true};let terminate=()=>{for(const key in workerSubs){if(typeof workerSubs[key].sub==="number"){run("unpipeWorkers",[workerSubs[key].route,workerSubs[key].portId,workerSubs[key].sub])}workerSubs[key].sub=false}return this.terminate(options._id)};if(!options.onmessage)options.onmessage=ev2=>{this.receive(ev2.data);this.setState({[options._id]:ev2.data})};if(!options.onerror){options.onerror=ev2=>{console.error(ev2.data)}}worker.onmessage=options.onmessage;worker.onerror=options.onerror;this.workers[options._id]={worker,send,post,run,request,subscribe,unsubscribe,terminate,start,stop,postMessage:worker.postMessage,workerSubs,graph:this,...options};return this.workers[options._id]};this.toObjectURL=scriptTemplate=>{let blob=new Blob([scriptTemplate],{type:"text/javascript"});return URL.createObjectURL(blob)};this.transmit=(message,worker,transfer)=>{if(!transfer){transfer=this.getTransferable(message)}if(worker instanceof import_web_worker.default||worker instanceof MessagePort){worker.postMessage(message,transfer)}else if(typeof worker==="string"){if(this.workers[worker]){if(this.workers[worker].port)this.workers[worker].port.postMessage(message,transfer);else if(this.workers[worker].worker)this.workers[worker].worker.postMessage(message,transfer)}}else{let keys=Object.keys(this.workers);this.workers[keys[this.threadRot]].worker.postMessage(message,transfer);this.threadRot++;if(this.threadRot===keys.length)this.threadRot=0}return message};this.terminate=worker=>{let onclose;if(typeof worker==="string"){let obj=this.workers[worker];if(obj){delete this.workers[worker];worker=obj.worker;if(obj.onclose)onclose=obj.onclose}}if(worker instanceof import_web_worker.default){worker.terminate();if(onclose)onclose(worker);return true}if(worker instanceof MessagePort){worker.close();if(onclose)onclose(worker);return true}return false};this.establishMessageChannel=(worker,worker2)=>{let workerId;if(typeof worker==="string"){workerId=worker;if(this.workers[worker]){if(this.workers[worker].port)worker=this.workers[worker].port;else worker2=this.workers[worker].worker}}else if(worker?.worker){worker=worker.worker}if(typeof worker2==="string"){if(this.workers[worker2]){if(this.workers[worker2].port)worker2=this.workers[worker2].port;else worker2=this.workers[worker2].worker}}else if(worker2?.worker){worker2=worker2.worker}if(worker instanceof import_web_worker.default||worker instanceof MessagePort){let channel=new MessageChannel;let portId=`port${Math.floor(Math.random()*1e15)}`;worker.postMessage({route:"addWorker",args:{port:channel.port1,_id:portId}},[channel.port1]);if(worker2 instanceof import_web_worker.default||worker2 instanceof MessagePort){worker2.postMessage({route:"addWorker",args:{port:channel.port2,_id:portId}},[channel.port2])}else if(workerId&&this.workers[workerId]){channel.port2.onmessage=this.workers[workerId].onmessage;this.workers[workerId].port=channel.port2}return portId}return false};this.request=(message,workerId,transfer,method)=>{let worker=this.workers[workerId].worker;return new Promise((res,rej)=>{let callbackId=Math.random();let req={route:"runRequest",args:[message,callbackId]};if(method)req.method=method;let onmessage=ev2=>{if(typeof ev2.data==="object"){if(ev2.data.callbackId===callbackId){worker.removeEventListener("message",onmessage);res(ev2.data.args)}}};worker.addEventListener("message",onmessage);this.transmit(req,worker,transfer)})};this.runRequest=(message,worker,callbackId)=>{let res=this.receive(message);if(typeof worker==="string"&&this.workers[worker]){if(this.workers[worker].port)worker=this.workers[worker].port;else worker=this.workers[worker].worker}if(res instanceof Promise){res.then(r=>{if(worker instanceof import_web_worker.default||worker instanceof MessagePort)worker.postMessage({args:r,callbackId});else if(typeof WorkerGlobalScope!=="undefined"&&self instanceof WorkerGlobalScope)globalThis.postMessage({args:r,callbackId})})}else{if(worker instanceof import_web_worker.default||worker instanceof MessagePort)worker.postMessage({args:res,callbackId});else if(typeof WorkerGlobalScope!=="undefined"&&self instanceof WorkerGlobalScope)globalThis.postMessage({args:res,callbackId})}return res};this.subscribeWorker=(route,worker,blocking,key,subInput)=>{let callback;if(blocking){let blocked=false;callback=res=>{if(!blocked){blocked=true;if(res instanceof Promise){res.then(r=>{if(worker?.run)worker.run("triggerSubscription",[route,worker._id,r]).then(ret=>{blocked=false})})}else{if(worker?.run)worker.run("triggerSubscription",[route,worker._id,res]).then(ret=>{blocked=false})}}}}else{callback=res=>{if(res instanceof Promise){res.then(r=>{if(worker?.postMessage)worker.postMessage({args:r,callbackId:route});else if(globalThis.postMessage)globalThis.postMessage({args:r,callbackId:route})})}else{if(worker?.postMessage)worker.postMessage({args:res,callbackId:route});else if(globalThis.postMessage)globalThis.postMessage({args:res,callbackId:route})}}}if(!blocking&&worker?.port){worker=worker.port}else if(!blocking&&worker?.worker){worker=worker.worker}else if(typeof worker==="string"&&this.workers[worker]){if(blocking)worker=this.workers[worker];else if(this.workers[worker].port)worker=this.workers[worker].port;else worker=this.workers[worker].worker}return this.subscribe(route,callback,key,subInput)};this.subscribeToWorker=(route,workerId,callback,blocking,key,subInput)=>{if(typeof workerId==="string"&&this.workers[workerId]){this.__node.state.subscribeTrigger(workerId,res=>{if(res?.callbackId===route){if(!callback)this.setState({[workerId]:res.args});else if(typeof callback==="string"){this.run(callback,res.args)}else callback(res.args)}});return this.workers[workerId].run("subscribeWorker",[route,workerId,blocking,key,subInput])}};this.triggerSubscription=async(route,workerId,result)=>{if(this.__node.state.triggers[workerId])for(let i=0;i<this.__node.state.triggers[workerId].length;i++){await this.__node.state.triggers[workerId][i].onchange({args:result,callbackId:route})}return true};this.pipeWorkers=(sourceWorker,listenerWorker,sourceRoute,listenerRoute,portId,blocking)=>{if(typeof sourceWorker==="string")sourceWorker=this.workers[sourceWorker];if(typeof listenerWorker==="string")listenerWorker=this.workers[listenerWorker];if(!portId){portId=this.establishMessageChannel(sourceWorker.worker,listenerWorker.worker)}return listenerWorker.run("subscribeToWorker",[sourceRoute,portId,listenerRoute,blocking])};this.unpipeWorkers=(sourceRoute,sourceWorker,sub)=>{if(typeof sourceWorker==="string")sourceWorker=this.workers[sourceWorker];if(sourceWorker)return sourceWorker.run("unsubscribe",[sourceRoute,sub])};this.connections={workers:this.workers};if(options?.services)this.addServices(options.services);this.setTree(this);this.setLoaders(this.workerloader);if(options)this.init(options);if(typeof WorkerGlobalScope!=="undefined"&&globalThis instanceof WorkerGlobalScope){this.addDefaultMessageListener()}}getTransferable(message){let transfer;if(typeof message==="object"){if(message.args){if(message.args?.constructor?.name==="Object"){for(const key in message.args){if(ArrayBuffer.isView(message.args[key])){if(!transfer)transfer=[message.args[key].buffer];else transfer.push(message.args[key].buffer)}else if(message.args[key]?.constructor?.name==="ArrayBuffer"){if(!transfer)transfer=[message.args[key]];else transfer.push(message.args[key])}}}else if(Array.isArray(message.args)&&message.args.length<11){message.args.forEach(arg=>{if(ArrayBuffer.isView(arg)){transfer=[arg.buffer]}else if(arg?.constructor?.name==="ArrayBuffer")transfer=[arg]})}else if(ArrayBuffer.isView(message.args)){transfer=[message.args.buffer]}else if(message.args?.constructor?.name==="ArrayBuffer"){transfer=[message]}}else if(message?.constructor?.name==="Object"){for(const key in message){if(ArrayBuffer.isView(message[key])){if(!transfer)transfer=[message[key].buffer];else transfer.push(message[key].buffer)}else if(message[key]?.constructor?.name==="ArrayBuffer"){if(!transfer)transfer=[message[key]];else transfer.push(message[key])}}}else if(Array.isArray(message)&&message.length<11){message.forEach(arg=>{if(ArrayBuffer.isView(arg)){transfer=[arg.buffer]}else if(arg.constructor?.name==="ArrayBuffer")transfer=[arg]})}else if(ArrayBuffer.isView(message)){transfer=[message.buffer]}else if(message.constructor?.name==="ArrayBuffer"){transfer=[message]}}return transfer}transferFunction(worker,fn,fnName){if(!fnName)fnName=fn.name;return worker.request({route:"setRoute",args:[fn.toString(),fnName]})}transferClass(worker,cls,className){if(!className)className=cls.name;return worker.request({route:"receiveClass",args:[cls.toString(),className]})}};var mouseEventHandler=makeSendPropertiesHandler(["ctrlKey","metaKey","shiftKey","button","pointerType","clientX","clientY","pageX","pageY"]);var wheelEventHandlerImpl=makeSendPropertiesHandler(["deltaX","deltaY"]);var keydownEventHandler=makeSendPropertiesHandler(["ctrlKey","metaKey","shiftKey","keyCode"]);function wheelEventHandler(event,sendFn){event.preventDefault();wheelEventHandlerImpl(event,sendFn)}function preventDefaultHandler(event){event.preventDefault()}function copyProperties(src,properties,dst){for(const name of properties){dst[name]=src[name]}}function makeSendPropertiesHandler(properties){return function sendProperties(event,sendFn){const data={type:event.type};copyProperties(event,properties,data);sendFn(data)}}function touchEventHandler(event,sendFn){const touches=[];const data={type:event.type,touches};for(let i=0;i<event.touches.length;++i){const touch=event.touches[i];touches.push({pageX:touch.pageX,pageY:touch.pageY})}sendFn(data)}var orbitKeys={"37":true,"38":true,"39":true,"40":true};function filteredKeydownEventHandler(event,sendFn){const{keyCode}=event;if(orbitKeys[keyCode]){event.preventDefault();keydownEventHandler(event,sendFn)}}var eventHandlers={contextmenu:preventDefaultHandler,mousedown:mouseEventHandler,mousemove:mouseEventHandler,mouseup:mouseEventHandler,pointerdown:mouseEventHandler,pointermove:mouseEventHandler,pointerup:mouseEventHandler,touchstart:touchEventHandler,touchmove:touchEventHandler,touchend:touchEventHandler,wheel:wheelEventHandler,keydown:filteredKeydownEventHandler};function initProxyElement(element,worker,id){if(!id)id="proxy"+Math.floor(Math.random()*1e15);const sendEvent=data=>{if(!worker){handleProxyEvent(data,id)}else worker.postMessage({route:"handleProxyEvent",args:[data,id]})};let entries=Object.entries(eventHandlers);for(const[eventName,handler]of entries){element.addEventListener(eventName,function(event){handler(event,sendEvent)})}const sendSize=()=>{const rect=element.getBoundingClientRect();sendEvent({type:"resize",left:rect.left,top:rect.top,width:element.clientWidth,height:element.clientHeight})};sendSize();globalThis.addEventListener("resize",sendSize);return id}var EventDispatcher=class{addEventListener(type,listener){if(this.__listeners===void 0)this.__listeners={};const listeners=this.__listeners;if(listeners[type]===void 0){listeners[type]=[]}if(listeners[type].indexOf(listener)===-1){listeners[type].push(listener)}}hasEventListener(type,listener){if(this.__listeners===void 0)return false;const listeners=this.__listeners;return listeners[type]!==void 0&&listeners[type].indexOf(listener)!==-1}removeEventListener(type,listener){if(this.__listeners===void 0)return;const listeners=this.__listeners;const listenerArray=listeners[type];if(listenerArray!==void 0){const index=listenerArray.indexOf(listener);if(index!==-1){listenerArray.splice(index,1)}}}dispatchEvent(event,target){if(this.__listeners===void 0)return;const listeners=this.__listeners;const listenerArray=listeners[event.type];if(listenerArray!==void 0){if(!target)event.target=this;else event.target=target;const array=listenerArray.slice(0);for(let i=0,l=array.length;i<l;i++){array[i].call(this,event)}event.target=null}}};function noop(){}var ElementProxyReceiver=class extends EventDispatcher{constructor(){super();this.__listeners={};this.style={};this.setPointerCapture=()=>{};this.releasePointerCapture=()=>{};this.getBoundingClientRect=()=>{return{left:this.left,top:this.top,width:this.width,height:this.height,right:this.left+this.width,bottom:this.top+this.height}};this.handleEvent=data=>{if(data.type==="resize"){this.left=data.left;this.top=data.top;this.width=data.width;this.height=data.height;if(typeof this.proxied==="object"){this.proxied.style.width=this.width+"px";this.proxied.style.height=this.height+"px";this.proxied.clientWidth=this.width;this.proxied.clientHeight=this.height}}data.preventDefault=noop;data.stopPropagation=noop;this.dispatchEvent(data,this.proxied)};this.style={}}get clientWidth(){return this.width}get clientHeight(){return this.height}focus(){}};var ProxyManager=class{constructor(){this.targets={};this.makeProxy=(id,addTo=void 0)=>{if(!id)id=`proxyReceiver${Math.floor(Math.random()*1e15)}`;let proxy;if(this.targets[id])proxy=this.targets[id];else{proxy=new ElementProxyReceiver;this.targets[id]=proxy}if(typeof addTo==="object"){addTo.proxy=proxy;proxy.proxied=addTo;if(typeof WorkerGlobalScope!=="undefined")addTo.style=proxy.style;if(proxy.width){addTo.style.width=proxy.width+"px";addTo.clientWidth=proxy.width}if(proxy.height){addTo.style.height=proxy.height+"px";addTo.clientHeight=proxy.height}addTo.setPointerCapture=proxy.setPointerCapture.bind(proxy);addTo.releasePointerCapture=proxy.releasePointerCapture.bind(proxy);addTo.getBoundingClientRect=proxy.getBoundingClientRect.bind(proxy);addTo.addEventListener=proxy.addEventListener.bind(proxy);addTo.removeEventListener=proxy.removeEventListener.bind(proxy);addTo.handleEvent=proxy.handleEvent.bind(proxy);addTo.dispatchEvent=proxy.dispatchEvent.bind(proxy);addTo.focus=proxy.focus.bind(proxy)}};this.getProxy=id=>{return this.targets[id]};this.handleEvent=(data,id)=>{if(!this.targets[id])this.makeProxy(id);if(this.targets[id]){this.targets[id].handleEvent(data);return true}return void 0};if(!globalThis.document)globalThis.document={}}};function makeProxy(id,elm){if(this?.__node?.graph){if(!this.__node.graph.ProxyManager)this.__node.graph.ProxyManager=new ProxyManager;this.__node.graph.ProxyManager.makeProxy(id,elm)}else{if(!globalThis.ProxyManager)globalThis.ProxyManager=new ProxyManager;globalThis.ProxyManager.makeProxy(id,elm)}return id}function handleProxyEvent(data,id){if(this?.__node?.graph){if(!this.__node.graph.ProxyManager)this.__node.graph.ProxyManager=new ProxyManager;if(this.__node.graph.ProxyManager.handleEvent(data,id))return data}else{if(!globalThis.ProxyManager)globalThis.ProxyManager=new ProxyManager;if(globalThis.ProxyManager.handleEvent(data,id))return data}}var proxyElementWorkerRoutes={initProxyElement,makeProxy,handleProxyEvent};function Renderer(options){if(options.worker){let worker=options.worker;let route=options.route;if(worker instanceof Blob||typeof worker==="string"){worker=new Worker(worker)}delete options.worker;delete options.route;return transferCanvas(worker,options,route)}else{initProxyElement(options.canvas,void 0,options._id);return setupCanvas(options)}}function transferCanvas(worker,options,route){if(!options)return void 0;if(!options._id)options._id=`canvas${Math.floor(Math.random()*1e15)}`;let offscreen=options.canvas.transferControlToOffscreen();if(!options.width)options.width=options.canvas.clientWidth;if(!options.height)options.height=options.canvas.clientHeight;let message={route:route?route:"setupCanvas",args:{...options,canvas:offscreen}};if(this?.__node?.graph)this.__node.graph.run("initProxyElement",options.canvas,worker,options._id);else initProxyElement(options.canvas,worker,options._id);if(options.draw){if(typeof options.draw==="function")message.args.draw=options.draw.toString();else message.args.draw=options.draw}if(options.update){if(typeof options.update==="function")message.args.update=options.update.toString();else message.args.update=options.update}if(options.init){if(typeof options.init==="function")message.args.init=options.init.toString();else message.args.init=options.init}if(options.clear){if(typeof options.clear==="function")message.args.clear=options.clear.toString();else message.args.clear=options.clear}let transfer=[offscreen];if(options.transfer){transfer.push(...options.transfer);delete options.transfer}worker.postMessage(message,transfer);const canvascontrols={_id:options._id,width:options.width,height:options.height,worker,draw:props=>{worker.postMessage({route:"drawFrame",args:[props,options._id]})},update:props=>{worker.postMessage({route:"updateCanvas",args:[props,options._id]})},clear:()=>{worker.postMessage({route:"clearCanvas",args:options._id})},init:()=>{worker.postMessage({route:"initCanvas",args:options._id})},stop:()=>{worker.postMessage({route:"stopAnim",args:options._id})},start:()=>{worker.postMessage({route:"startAnim",args:options._id})},set:newDrawProps=>{worker.postMessage({route:"setDraw",args:[newDrawProps,options._id]})},terminate:()=>{worker.terminate()}};return canvascontrols}function setDraw(settings,_id){let canvasopts;if(this?.__node?.graph){if(_id)canvasopts=this.__node.graph.CANVASES?.[settings._id];else if(settings._id)canvasopts=this.__node.graph.CANVASES?.[settings._id];else canvasopts=this.__node.graph.CANVASES?.[Object.keys(this.__node.graph.CANVASES)[0]]}else{if(_id)canvasopts=globalThis.CANVASES?.[settings._id];else if(settings._id)canvasopts=globalThis.CANVASES?.[settings._id];else canvasopts=globalThis.CANVASES?.[Object.keys(globalThis.CANVASES)[0]]}if(canvasopts){if(settings.canvas){canvasopts.canvas=settings.canvas;if(this?.__node?.graph)this.__node.graph.run("makeProxy",canvasopts._id,canvasopts.canvas);else proxyElementWorkerRoutes.makeProxy(canvasopts._id,canvasopts.canvas)}if(typeof settings.context==="string")canvasopts.context=canvasopts.canvas.getContext(settings.context);else if(settings.context)canvasopts.context=settings.context;if(settings.width)canvasopts.canvas.width=settings.width;if(settings.height)canvasopts.canvas.height=settings.height;if(typeof settings.draw==="string")settings.draw=parseFunctionFromText2(settings.draw);if(typeof settings.draw==="function"){canvasopts.draw=settings.draw}if(typeof settings.update==="string")settings.update=parseFunctionFromText2(settings.update);if(typeof settings.update==="function"){canvasopts.update=settings.update}if(typeof settings.init==="string")settings.init=parseFunctionFromText2(settings.init);if(typeof settings.init==="function"){canvasopts.init=settings.init}if(typeof settings.clear==="string")settings.clear=parseFunctionFromText2(settings.clear);if(typeof settings.clear==="function"){canvasopts.clear=settings.clear}return settings._id}return void 0}function setupCanvas(options){if(this?.__node?.graph){if(!this.__node.graph.CANVASES)this.__node.graph.CANVASES={}}else if(!globalThis.CANVASES)globalThis.CANVASES={};let canvasOptions=options;options._id?canvasOptions._id=options._id:canvasOptions._id=`canvas${Math.floor(Math.random()*1e15)}`;typeof options.context==="string"?canvasOptions.context=options.canvas.getContext(options.context):canvasOptions.context=options.context;"animating"in options?canvasOptions.animating=options.animating:canvasOptions.animating=true;if(this?.__node?.graph?.CANVASES[canvasOptions._id]){this.__node.graph.run("setDraw",canvasOptions)}else if(globalThis.CANVASES?.[canvasOptions._id]){setDraw(canvasOptions)}else{if(this?.__node?.graph)canvasOptions.graph=this.__node.graph;if(this?.__node?.graph)this.__node.graph.CANVASES[canvasOptions._id]=canvasOptions;else globalThis.CANVASES[canvasOptions._id]=canvasOptions;if(this?.__node.graph)this.__node.graph.run("makeProxy",canvasOptions._id,canvasOptions.canvas);else proxyElementWorkerRoutes.makeProxy(canvasOptions._id,canvasOptions.canvas);if(options.width)canvasOptions.canvas.width=options.width;if(options.height)canvasOptions.canvas.height=options.height;if(typeof canvasOptions.draw==="string"){canvasOptions.draw=parseFunctionFromText2(canvasOptions.draw)}else if(typeof canvasOptions.draw==="function"){canvasOptions.draw=canvasOptions.draw}if(typeof canvasOptions.update==="string"){canvasOptions.update=parseFunctionFromText2(canvasOptions.update)}else if(typeof canvasOptions.update==="function"){canvasOptions.update=canvasOptions.update}if(typeof canvasOptions.init==="string"){canvasOptions.init=parseFunctionFromText2(canvasOptions.init)}else if(typeof canvasOptions.init==="function"){canvasOptions.init=canvasOptions.init}if(typeof canvasOptions.clear==="string"){canvasOptions.clear=parseFunctionFromText2(canvasOptions.clear)}else if(typeof canvasOptions.clear==="function"){canvasOptions.clear=canvasOptions.clear}if(typeof canvasOptions.init==="function")canvasOptions.init(canvasOptions,canvasOptions.canvas,canvasOptions.context);canvasOptions.stop=()=>{stopAnim(canvasOptions._id)};canvasOptions.start=draw=>{startAnim(canvasOptions._id,draw)};canvasOptions.set=settings=>{setDraw(settings,canvasOptions._id)};if(typeof canvasOptions.draw==="function"&&canvasOptions.animating){let draw=(s,canvas,context)=>{if(s.animating){s.draw(s,canvas,context);requestAnimationFrame(()=>{draw(s,canvas,context)})}};draw(canvasOptions,canvasOptions.canvas,canvasOptions.context)}}if(typeof WorkerGlobalScope!=="undefined"&&self instanceof WorkerGlobalScope)return canvasOptions._id;else{const canvascontrols={_id:options._id,width:options.width,height:options.height,draw:props=>{drawFrame(props,options._id)},update:props=>{updateCanvas(props,options._id)},clear:()=>{clearCanvas(options._id)},init:()=>{initCanvas(options._id)},stop:()=>{stopAnim(options._id)},start:()=>{startAnim(options._id)},set:newDrawProps=>{setDraw(newDrawProps,options._id)},terminate:()=>{stopAnim(options._id)}};return canvascontrols}}function drawFrame(props,_id){let canvasopts;if(this?.__node?.graph){if(!_id)canvasopts=this.__node.graph.CANVASES?.[Object.keys(this.__node.graph.CANVASES)[0]];else canvasopts=this.__node.graph.CANVASES?.[_id]}else{if(!_id)canvasopts=globalThis.CANVASES?.[Object.keys(globalThis.CANVASES)[0]];else canvasopts=globalThis.CANVASES?.[_id]}if(canvasopts){if(props)Object.assign(canvasopts,props);if(canvasopts.draw){canvasopts.draw(canvasopts,canvasopts.canvas,canvasopts.context);return _id}}return void 0}function clearCanvas(_id){let canvasopts;if(this?.__node?.graph){if(!_id)canvasopts=this.__node.graph.CANVASES?.[Object.keys(this.__node.graph.CANVASES)[0]];else canvasopts=this.__node.graph.CANVASES?.[_id]}else{if(!_id)canvasopts=globalThis.CANVASES?.[Object.keys(globalThis.CANVASES)[0]];else canvasopts=globalThis.CANVASES?.[_id]}if(canvasopts?.clear){canvasopts.clear(canvasopts,canvasopts.canvas,canvasopts.context);return _id}return void 0}function initCanvas(_id){let canvasopts;if(this?.__node?.graph){if(!_id)canvasopts=this.__node.graph.CANVASES?.[Object.keys(this.__node.graph.CANVASES)[0]];else canvasopts=this.__node.graph.CANVASES?.[_id]}else{if(!_id)canvasopts=globalThis.CANVASES?.[Object.keys(globalThis.CANVASES)[0]];else canvasopts=globalThis.CANVASES?.[_id]}if(canvasopts?.init){canvasopts.init(canvasopts,canvasopts.canvas,canvasopts.context);return _id}return void 0}function updateCanvas(input,_id){let canvasopts;if(this?.__node?.graph){if(!_id)canvasopts=this.__node.graph.CANVASES?.[Object.keys(this.__node.graph.CANVASES)[0]];else canvasopts=this.__node.graph.CANVASES?.[_id]}else{if(!_id)canvasopts=globalThis.CANVASES?.[Object.keys(globalThis.CANVASES)[0]];else canvasopts=globalThis.CANVASES?.[_id]}if(canvasopts?.update){canvasopts.update(canvasopts,canvasopts.canvas,canvasopts.context,input);return _id}return void 0}function setProps(props,_id){let canvasopts;if(this?.__node?.graph){if(!_id)canvasopts=this.__node.graph.CANVASES?.[Object.keys(this.__node.graph.CANVASES)[0]];else canvasopts=this.__node.graph.CANVASES?.[_id]}else{if(!_id)canvasopts=globalThis.CANVASES?.[Object.keys(globalThis.CANVASES)[0]];else canvasopts=globalThis.CANVASES?.[_id]}if(canvasopts){Object.assign(canvasopts,props);if(props.width)canvasopts.canvas.width=props.width;if(props.height)canvasopts.canvas.height=props.height;return _id}return void 0}function startAnim(_id,draw){let canvasopts;if(this?.__node?.graph){if(!_id)canvasopts=this.__node.graph.CANVASES?.[Object.keys(this.__node.graph.CANVASES)[0]];else canvasopts=this.__node.graph.CANVASES?.[_id]}else{if(!_id)canvasopts=globalThis.CANVASES?.[Object.keys(globalThis.CANVASES)[0]];else canvasopts=globalThis.CANVASES?.[_id]}canvasopts.animating=true;if(canvasopts&&draw){if(typeof draw==="string")draw=parseFunctionFromText2(draw);if(typeof draw==="function"){canvasopts.draw=draw}return _id}if(typeof canvasopts?.draw==="function"){let draw2=(s,canvas,context)=>{if(s.animating){s.draw(s,canvas,context);requestAnimationFrame(()=>{draw2(s,canvas,context)})}};if(typeof canvasopts.clear==="function")canvasopts.clear(canvasopts,canvasopts.canvas,canvasopts.context);if(typeof canvasopts.init==="function")canvasopts.init(canvasopts,canvasopts.canvas,canvasopts.context);draw2(canvasopts,canvasopts.canvas,canvasopts.context);return _id}return void 0}function stopAnim(_id){let canvasopts;if(this?.__node?.graph){if(!_id)canvasopts=this.__node.graph.CANVASES?.[Object.keys(this.__node.graph.CANVASES)[0]];else canvasopts=this.__node.graph.CANVASES?.[_id]}else{if(!_id)canvasopts=globalThis.CANVASES?.[Object.keys(globalThis.CANVASES)[0]];else canvasopts=globalThis.CANVASES?.[_id]}if(canvasopts){canvasopts.animating=false;if(typeof canvasopts.clear==="function")canvasopts.clear(canvasopts,canvasopts.canvas,canvasopts.context);return _id}return void 0}var workerCanvasRoutes={...proxyElementWorkerRoutes,Renderer,transferCanvas,setupCanvas,setDraw,drawFrame,clearCanvas,initCanvas,updateCanvas,setProps,startAnim,stopAnim};function parseFunctionFromText2(method=""){let getFunctionBody=methodString=>{return methodString.replace(/^\\W*(function[^{]+\\{([\\s\\S]*)\\}|[^=]+=>[^{]*\\{([\\s\\S]*)\\}|[^=]+=>(.+))/i,"$2$3$4")};let getFunctionHead=methodString=>{let startindex=methodString.indexOf("=>")+1;if(startindex<=0){startindex=methodString.indexOf("){")}if(startindex<=0){startindex=methodString.indexOf(") {")}return methodString.slice(0,methodString.indexOf("{",startindex)+1)};let newFuncHead=getFunctionHead(method);let newFuncBody=getFunctionBody(method);let newFunc;if(newFuncHead.includes("function")){let varName=newFuncHead.split("(")[1].split(")")[0];newFunc=new Function(varName,newFuncBody)}else{if(newFuncHead.substring(0,6)===newFuncBody.substring(0,6)){let varName=newFuncHead.split("(")[1].split(")")[0];newFunc=new Function(varName,newFuncBody.substring(newFuncBody.indexOf("{")+1,newFuncBody.length-1))}else{try{newFunc=(0,eval)(newFuncHead+newFuncBody+"}")}catch{}}}return newFunc}var algorithms={};var loadAlgorithms=settings=>{return Object.assign(algorithms,settings)};function createSubprocess(options,inputs){let ctx={_id:options._id?options._id:`algorithm${Math.floor(Math.random()*1e15)}`,ondata:options.ondata,run:data=>{return ctx.ondata(ctx,data)}};if(options.structs)recursivelyAssign3(ctx,JSON.parse(JSON.stringify(options.structs)));if(inputs)recursivelyAssign3(ctx,JSON.parse(JSON.stringify(inputs)));if(options.oncreate){ctx.oncreate=options.oncreate}if(ctx.oncreate){ctx.oncreate(ctx)}return ctx}var recursivelyAssign3=(target,obj)=>{for(const key in obj){if(typeof obj[key]==="object"&&!Array.isArray(obj[key])){if(typeof target[key]==="object"&&!Array.isArray(target[key]))recursivelyAssign3(target[key],obj[key]);else target[key]=recursivelyAssign3({},obj[key])}else target[key]=obj[key]}return target};var subprocessRoutes={...unsafeRoutes,loadAlgorithms,"initSubprocesses":async function initSubprocesses(subprocesses,service){if(!service)service=this.__node.graph;if(!service)return void 0;for(const p in subprocesses){let s=subprocesses[p];if(!s.worker&&s.url)s.worker=service.addWorker({url:s.url});if(!s.worker)continue;let w=s.worker;let wpId;wpId=service.establishMessageChannel(w.worker,s.source?.worker);if(!s.source)s.source=service;if(typeof s.subprocess==="object"){const p2=s.subprocess;if(!p2.name)continue;if(typeof p2.oncreate==="function"){p2.oncreate=p2.oncreate.toString()}if(typeof p2.ondata==="function"){p2.ondata=p2.ondata.toString()}s.worker.post("addSubprocessTemplate",[p2.name,p2.structs,p2.oncreate,p2.ondata,p2.props]);s.subprocess=p2.name}if(s.init){let r=await w.run(s.init,s.initArgs);s.otherArgs=r}if(s.otherArgs){w.run("setValue",["otherArgsProxy",Array.isArray(s.otherArgs)?s.otherArgs:[s.otherArgs]])}if(s.pipeTo){w.run("setValue",["routeProxy",s.route]);w.run("setValue",["pipeRoute",s.pipeTo.route]);if(s.url&&!s.pipeTo.worker){let w2=service.addWorker({url:s.url});s.pipeTo.portId=service.establishMessageChannel(w.worker,w2.worker);s.pipeTo.worker=w2}if(s.pipeTo.init){s.pipeTo.otherArgs=await s.pipeTo.worker.run(s.pipeTo.init,s.pipeTo.initArgs)}w.run("setValue",["pipePort",s.pipeTo.portId]);if(s.pipeTo.otherArgs)w.run("setValue",["otherPipeArgs",s.pipeTo.otherArgs]);service.transferFunction(w,function pipeResults(data){let inp=data;if(this.__node.graph.otherArgsProxy)inp=[data,...this.__node.graph.otherArgsProxy];let r=this.__node.graph.run(this.__node.graph.routeProxy,inp);if(!s.blocking)return new Promise(res=>{if(r instanceof Promise){r.then(rr=>{if(rr!==void 0){let args=rr;if(this.__node.graph.otherPipeArgs)args=[rr,...this.__node.graph.otherPipeArgs];if(this.workers[this.__node.graph.pipePort]){s.blocking=true;this.workers[this.__node.graph.pipePort].run(this.__node.graph.pipeRoute,args).then(result=>{s.blocking=false;res(result)})}}})}else if(r!==void 0){let args=r;if(this.__node.graph.otherPipeArgs)args=[r,...this.__node.graph.otherPipeArgs];if(this.workers[this.__node.graph.pipePort]){s.blocking=true;this.workers[this.__node.graph.pipePort].run(this.__node.graph.pipeRoute,args).then(result=>{s.blocking=false;res(result)})}}});return void 0},s.route+"_pipeResults");s.route=s.route+"_pipeResults"}else{w.run("setValue",["routeProxy",s.route]);service.transferFunction(w,function routeProxy(data){let r;if(this.__node.graph.otherArgsProxy)r=this.__node.graph.nodes.get(this.__node.graph.routeProxy).__operator(data,...this.__node.graph.otherArgsProxy);else r=this.__node.graph.nodes.get(this.__node.graph.routeProxy).__operator(data);if(this.__node.graph.state.triggers[this.__node.graph.routeProxy]){if(r instanceof Promise){r.then(rr=>{this.setState({[this.__node.graph.routeProxy]:rr})})}else this.setState({[this.__node.graph.routeProxy]:r})}return r},s.route+"_routeProxy");s.route=s.route+"_routeProxy";if(!s.stopped)w.run("subscribeToWorker",[s.subscribeRoute,wpId,s.route]).then(sub=>{s.sub=sub})}s.stop=async()=>{if(s.source&&typeof s.sub==="number"){s.source.unsubscribe(s.subscribeRoute,s.sub);return true}return void 0};s.start=async()=>{if(typeof s.sub!=="number")return w.run("subscribeToWorker",[s.subscribeRoute,wpId,s.route,s.blocking]).then(sub=>{s.sub=sub})};s.setArgs=async args=>{if(Array.isArray(args))await w.run("setValue",["otherArgsProxy",args]);else if(typeof args==="object"){for(const key in args){await w.run("setValue",[key,args[key]])}}return true};s.terminate=()=>{w.terminate();if(s.source?.worker&&typeof s.sub==="number"){s.source.post("unsubscribe",s.sub)}if(s.pipeTo?.worker){s.pipeTo.worker.terminate()}};if(s.callback)w.subscribe(s.route,res=>{if(typeof s.callback==="string")this.__node.graph.run(s.callback,res);else s.callback(res)})}return subprocesses},"addSubprocessTemplate":function subprocesstempalte(name,structs,oncreate,ondata,props){if(typeof oncreate==="string")oncreate=parseFunctionFromText(oncreate);if(typeof ondata==="string")ondata=parseFunctionFromText(ondata);if(typeof ondata==="function"){algorithms[name]={ondata,oncreate:typeof oncreate==="function"?oncreate:null,structs};if(typeof props==="object")Object.assign(algorithms[name],props);return true}},"updateSubprocess":function updatesubprocess(structs,_id){if(!this.__node.graph.ALGORITHMS)this.__node.graph.ALGORITHMS={};if(!_id)_id=Object.keys(this.__node.graph.ALGORITHMS)[0];if(!_id)return;Object.assign(this.__node.graph.ALGORITHMS[_id],structs)},"createSubprocess":function creatsubprocess(options,inputs){if(!this.__node.graph.ALGORITHMS)this.__node.graph.ALGORITHMS={};if(typeof options==="string"){options=algorithms[options]}if(typeof options==="object"){if(typeof options.ondata==="string")options.ondata=parseFunctionFromText(options.ondata);let ctx;if(typeof options?.ondata==="function")ctx=createSubprocess(options,inputs);if(ctx)this.__node.graph.ALGORITHMS[ctx._id]=ctx;console.log(ctx,options);if(ctx)return ctx._id}return false},"runSubprocess":function runsubprocess(data,_id){if(!this.__node.graph.ALGORITHMS)this.__node.graph.ALGORITHMS={};if(!_id)_id=Object.keys(this.__node.graph.ALGORITHMS)[0];if(!_id)return;let res=this.__node.graph.ALGORITHMS[_id].run(data);if(res!==void 0){if(Array.isArray(res)){let pass=[];res.forEach(r=>{if(r!==void 0){pass.push(r);this.__node.graph.setState({[_id]:r})}});if(pass.length>0){return pass}}else{this.__node.graph.setState({[_id]:res});return res}}}};if(typeof WorkerGlobalScope!=="undefined"&&self instanceof WorkerGlobalScope){const worker=new WorkerService({services:{workerCanvasRoutes,unsafeRoutes,Math,Math2}});console.log(worker)}var worker_default=self;})();\n')], { type: "text/javascript" }));
  var worker_default = url;

  // index.ts
  var workers = new WorkerService();
  var router = new Router({
    services: {
      workers,
      workerCanvasRoutes
    },
    loaders: {
      htmlloader
    }
  });
  console.log(router);
  var ret = router.setTree({
    "main": {
      tagName: "div",
      __children: {
        "div": {
          tagName: "div",
          innerText: "Multithreaded canvases!"
        },
        "canvas": {
          tagName: "canvas",
          style: { width: "100%", height: "100%" },
          __onrender: function(elm) {
            const renderer = workers.addWorker({ url: worker_default });
            this.worker = renderer;
            if (renderer) {
              console.log("renderer", renderer);
              const controls = router.run(
                "transferCanvas",
                renderer.worker,
                {
                  canvas: elm,
                  context: "2d",
                  _id: elm.id,
                  init: (self2, canvas, context) => {
                    console.log("canvas", canvas);
                    canvas.addEventListener("mousedown", (ev) => {
                      console.log("clicked!", ev, canvas);
                    });
                  },
                  draw: (self2, canvas, context) => {
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    context.fillStyle = `rgb(0,${Math.sin(Date.now() * 1e-3) * 255},${Math.cos(Date.now() * 1e-3) * 255})`;
                    context.fillRect(0, 0, canvas.width, canvas.height);
                  }
                }
              );
            }
          },
          __onremove: function(elm) {
            workers.terminate(this.worker._id);
          }
        }
      }
    }
  });
})();
