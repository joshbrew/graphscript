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

  // ../../Graph.ts
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
              this.add({ tag: node, operator: (self2, origin, ...args) => {
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

  // ../../services/Service.ts
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

  // ../../services/ecs/ECS.systems.ts
  var Systems = {
    collision: {
      setupEntities: (self2, entities) => {
        for (const key in entities) {
          const entity = entities[key];
          if (entity.components) {
            if (!entity.components[self2.tag])
              continue;
          }
          Systems.collision.setEntity(entity);
        }
      },
      setEntity: (entity) => {
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
      },
      operator: (self2, origin, entities) => {
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
      },
      collisionCheck: (body1, body2) => {
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
      },
      sphereCollisionCheck: (body1, body2, dist) => {
        if (dist === void 0)
          dist = Systems.collision.distance(body1.position, body2.position);
        return dist < body1.collisionRadius + body2.collisionRadius;
      },
      boxCollisionCheck: (body1, body2) => {
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
      },
      sphereBoxCollisionCheck: (sphere, box, dist) => {
        let boxMinX = (box.position.x - box.collisionRadius) * box.collisionBoundsScale.x;
        let boxMaxX = (box.position.x + box.collisionRadius) * box.collisionBoundsScale.x;
        let boxMinY = (box.position.y - box.collisionRadius) * box.collisionBoundsScale.y;
        let boxMaxY = (box.position.y + box.collisionRadius) * box.collisionBoundsScale.y;
        let boxMinZ = (box.position.z - box.collisionRadius) * box.collisionBoundsScale.z;
        let boxMaxZ = (box.position.z + box.collisionRadius) * box.collisionBoundsScale.z;
        let clamp = {
          x: Math.max(boxMinX, Math.min(sphere.position.x, boxMaxX)),
          y: Math.max(boxMinY, Math.min(sphere.position.y, boxMaxY)),
          z: Math.max(boxMinZ, Math.min(sphere.position.z, boxMaxZ))
        };
        if (dist === void 0)
          dist = Systems.collision.distance(sphere.position, clamp);
        return dist > sphere.collisionRadius;
      },
      isPointInsideSphere: (point, sphere, dist) => {
        if (dist === void 0)
          dist = Systems.collision.distance(point, sphere.position);
        return dist < sphere.collisionRadius;
      },
      isPointInsideBox: (point, box) => {
        let boxminX = (box.position.x - box.collisionRadius) * box.collisionBoundsScale.x;
        let boxmaxX = (box.position.x + box.collisionRadius) * box.collisionBoundsScale.x;
        let boxminY = (box.position.y - box.collisionRadius) * box.collisionBoundsScale.x;
        let boxmaxY = (box.position.y + box.collisionRadius) * box.collisionBoundsScale.x;
        let boxminZ = (box.position.z - box.collisionRadius) * box.collisionBoundsScale.x;
        let boxmaxZ = (box.position.z + box.collisionRadius) * box.collisionBoundsScale.x;
        return point.x >= boxminX && point.x <= boxmaxX && (point.y >= boxminY && point.y <= boxmaxY) && (point.z >= boxminZ && point.z <= boxmaxZ);
      },
      closestPointOnLine: (point, lineStart, lineEnd) => {
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
        return {
          x: lineStart.x + (lineEnd.x - lineStart.x) * bdota * _bdotapluscdota,
          y: lineStart.y + (lineEnd.y - lineStart.y) * bdota * _bdotapluscdota,
          z: lineStart.z + (lineEnd.z - lineStart.z) * bdota * _bdotapluscdota
        };
      },
      closestPointOnPolygon: (point, t0, t1, t2) => {
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
      },
      calcNormal: (t0, t1, t2, positive = true) => {
        var QR = Systems.collision.makeVec(t0, t1);
        var QS = Systems.collision.makeVec(t0, t2);
        if (positive === true) {
          return Systems.collision.normalize(Systems.collision.cross3D(QR, QS));
        } else {
          return Systems.collision.normalize(Systems.collision.cross3D(QS, QR));
        }
      },
      dot: (v1, v2) => {
        let dot = 0;
        for (const key in v1) {
          dot += v1[key] * v2[key];
        }
        return dot;
      },
      makeVec(p1, p2) {
        return {
          x: p2.x - p1.x,
          y: p2.y - p1.y,
          z: p2.z - p1.z
        };
      },
      vecadd: (v1, v2) => {
        let result = Object.assign({}, v1);
        for (const key in result) {
          result[key] += v2[key];
        }
        return result;
      },
      vecsub: (v1, v2) => {
        let result = Object.assign({}, v1);
        for (const key in result) {
          result[key] -= v2[key];
        }
        return result;
      },
      vecmul: (v1, v2) => {
        let result = Object.assign({}, v1);
        for (const key in result) {
          result[key] *= v2[key];
        }
        return result;
      },
      vecdiv: (v1, v2) => {
        let result = Object.assign({}, v1);
        for (const key in result) {
          result[key] /= v2[key];
        }
        return result;
      },
      vecscale: (v1, scalar) => {
        let result = Object.assign({}, v1);
        for (const key in result) {
          result[key] *= scalar;
        }
        return result;
      },
      distance: (v1, v2) => {
        let distance = 0;
        for (const key in v1) {
          distance += Math.pow(v1[key] - v2[key], 2);
        }
        return Math.sqrt(distance);
      },
      magnitude: (v) => {
        let magnitude = 0;
        for (const key in v) {
          magnitude += v[key] * v[key];
        }
        return Math.sqrt(magnitude);
      },
      normalize: (v) => {
        let magnitude = Systems.collision.magnitude(v);
        let _mag = 1 / magnitude;
        let vn = {};
        for (const key in v) {
          vn[key] = v[key] * _mag;
        }
        return vn;
      },
      cross3D(v1, v2) {
        return {
          x: v1.y * v2.z - v1.z * v2.y,
          y: v1.z * v2.x - v1.x * v2.z,
          z: v1.x * v2.y - v1.y * v2.x
        };
      },
      nearestNeighborSearch(entities, isWithinRadius = 1e15) {
        var tree = {};
        ;
        for (const key in entities) {
          let newnode = {
            tag: key,
            position: void 0,
            neighbors: []
          };
          newnode.position = entities[key].position;
          tree[key] = newnode;
        }
        for (const i in tree) {
          for (const j in tree) {
            var dist = Systems.collision.distance(tree[i].position, tree[j].position);
            if (dist < isWithinRadius) {
              var newNeighbori = {
                tag: j,
                position: entities[j].position,
                dist
              };
              tree[i].neighbors.push(newNeighbori);
              var newNeighborj = {
                tag: j,
                position: entities[i].position,
                dist
              };
              tree[j].neighbors.push(newNeighborj);
            }
          }
          tree[i].neighbors.sort(function(a, b) {
            return a.dist - b.dist;
          });
        }
        return tree;
      },
      generateBoundingVolumeTree(entities, mode = "octree", withinRadius = 1e15, minEntities = 3) {
        let dynamicBoundingVolumeTree = {
          proto: {
            parent: void 0,
            children: {},
            entities: {},
            collisionType: "box",
            collisionRadius: 1,
            collisionBoundsScale: { x: 1, y: 1, z: 1 },
            position: { x: 0, y: 0, z: 0 }
          },
          tree: {}
        };
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
            let halfbounds = {
              x: head2.collisionBoundsScale.x * 0.5,
              y: head2.collisionBoundsScale.y * 0.5,
              z: head2.collisionBoundsScale.z * 0.5
            };
            let octPos = genOct(head2.position, halfbounds);
            let check = Object.assign({}, head2.bodies);
            for (let i = 0; i < 8; i++) {
              let octquadrant = Object.assign(
                JSON.parse(JSON.stringify(dynamicBoundingVolumeTree.proto)),
                { position: octPos[i], collisionBoundsScale: halfbounds }
              );
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
      }
    },
    collider: {
      lastTime: performance.now(),
      useBoundingBox: true,
      collisionBounds: { bot: 0, top: 100, left: 0, right: 100, front: 0, back: 100 },
      setupEntities: (self2, entities) => {
        for (const key in entities) {
          const entity = entities[key];
          if (entity.components) {
            if (!entity.components[self2.tag])
              continue;
          }
          self2.setEntity(entity);
        }
      },
      setEntity: (entity) => {
        Systems.collision.setEntity(entity);
        Systems.movement.setEntity(entity);
        if (!("restitution" in entity))
          entity.restitution = 1;
      },
      operator: (self2, origin, entities) => {
        for (const key in entities) {
          const entity1 = entities[key];
          if (entity1.components) {
            if (!entity1.components[self2.tag] || !entity1.collisionEnabled)
              continue;
          }
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
          if (self2.useBoundingBox)
            self2.checkBoundingBox(self2, entity1);
        }
        return entities;
      },
      checkBoundingBox: (self2, entity) => {
        const ysize = entity.collisionRadius * entity.collisionBoundsScale.y;
        const xsize = entity.collisionRadius * entity.collisionBoundsScale.x;
        const zsize = entity.collisionRadius * entity.collisionBoundsScale.z;
        if (entity.position.y - ysize <= self2.collisionBounds.top) {
          entity.velocity.y *= entity.restitution;
          entity.position.y = self2.collisionBounds.top + ysize;
        }
        if (entity.position.y + ysize >= self2.collisionBounds.bot) {
          entity.velocity.y *= entity.restitution;
          entity.position.y = self2.collisionBounds.bot - ysize;
        }
        if (entity.position.x - xsize <= self2.collisionBounds.left) {
          entity.velocity.x *= entity.restitution;
          entity.position.x = self2.collisionBounds.left + xsize;
        }
        if (entity.position.x + xsize >= self2.collisionBounds.right) {
          entity.velocity.x *= entity.restitution;
          entity.position.x = self2.collisionBounds.right - xsize;
        }
        if (entity.position.z - zsize <= self2.collisionBounds.front) {
          entity.velocity.z *= entity.restitution;
          entity.position.z = self2.collisionBounds.front + zsize;
        }
        if (entity.position.z + zsize >= self2.collisionBounds.back) {
          entity.velocity.z *= entity.restitution;
          entity.position.z = self2.collisionBounds.back - zsize;
        }
      },
      resolveBoxCollision: (body1, box, negate) => {
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
      },
      resolveSphereCollisions: (entity1, entity2, dist) => {
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
        let vrel = {
          x: entity1.velocity.x - entity2.velocity.x,
          y: entity1.velocity.y - entity2.velocity.y,
          z: entity1.velocity.z - entity2.velocity.z
        };
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
      }
    },
    nbody: {
      lastTime: performance.now(),
      G: 6674e-14,
      setupEntities: (self2, entities) => {
        for (const key in entities) {
          const entity = entities[key];
          if (entity.components) {
            if (!entity.components[self2.tag])
              continue;
          }
          Systems.nbody.setEntity(entity);
        }
      },
      setEntity: (entity) => {
        Systems.collision.setEntity(entity);
        Systems.movement.setEntity(entity);
        entity.isAttractor = true;
      },
      operator: (self2, origin, entities) => {
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
      },
      attract: (body1, body2, dist, vecn) => {
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
      }
    },
    boid: {
      lastTime: performance.now(),
      setupEntities: (entities) => {
        for (const key in entities) {
          const entity = entities[key];
          Systems.collision.setEntity(entity);
          Systems.movement.setEntity(entity);
          if (!entity.boid) {
            entity.boid = {
              cohesion: 1e-5,
              separation: 1e-4,
              alignment: 6e-3,
              swirl: { x: 0.5, y: 0.5, z: 0.5, mul: 6e-3 },
              attractor: { x: 0.5, y: 0.5, z: 0.5, mul: 2e-3 },
              useCohesion: true,
              useSeparation: true,
              useAlignment: true,
              useSwirl: true,
              useAttractor: true,
              useAttraction: false,
              groupRadius: 200,
              groupSize: 10,
              searchLimit: 10
            };
          }
        }
      },
      operator: (self2, origin, entities) => {
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
            const boidVelocities = [
              p0.position.x,
              p0.position.y,
              p0.position.z,
              0,
              0,
              0,
              p0.velocity.x,
              p0.velocity.y,
              p0.velocity.z,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0
            ];
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
              if (p0.position.x > p0.boid.boundingBox.left || p0.position.x < p0.boid.boundingBox.right) {
                boidVelocities[12] *= 3;
              }
              boidVelocities[13] = (p0.boid.attractor.y - p0.position.y) * p0.boid.attractor.mul;
              if (p0.position.y > p0.boid.boundingBox.top || p0.position.y < p0.boid.boundingBox.bottom) {
                boidVelocities[13] *= 3;
              }
              boidVelocities[14] = (p0.boid.attractor.z - p0.position.z) * p0.boid.attractor.mul;
              if (p0.position.z > p0.boid.boundingBox.front || p0.position.z < p0.boid.boundingBox.back) {
                boidVelocities[14] *= 3;
              }
            }
            entities[i].velocity.x = p0.velocity.x * p0.drag + boidVelocities[0] + boidVelocities[3] + boidVelocities[6] + boidVelocities[9] + boidVelocities[12] + boidVelocities[15], entities[i].velocity.y = p0.velocity.y * p0.drag + boidVelocities[1] + boidVelocities[4] + boidVelocities[7] + boidVelocities[10] + boidVelocities[13] + boidVelocities[16], entities[i].velocity.z = p0.velocity.z * p0.drag + boidVelocities[2] + boidVelocities[5] + boidVelocities[8] + boidVelocities[11] + boidVelocities[14] + boidVelocities[17];
            if (isNaN(entities[i].velocity.x))
              console.error(p0, i, groupCount, p0.position, p0.velocity, swirlVec, attractorVec);
          }
        return entities;
      }
    },
    movement: {
      lastTime: performance.now(),
      setupEntities: (self2, entities) => {
        for (const key in entities) {
          const entity = entities[key];
          if (entity.components) {
            if (!entity.components[self2.tag])
              continue;
          }
          Systems.movement.setEntity(entity);
        }
      },
      setEntity: (entity) => {
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
        if (!entity.position)
          entity.position = { x: 0, y: 0, z: 0 };
      },
      operator: (self2, origin, entities) => {
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
              entity.accleration.x += entity.force.x / entity.mass;
              entity.force.x = 0;
            }
            if (entity.force.y) {
              entity.accleration.y += entity.force.y / entity.mass;
              entity.force.y = 0;
            }
            if (entity.force.z) {
              entity.accleration.z += entity.force.z / entity.mass + entity.gravity;
              entity.force.z = 0;
            }
          }
          if (typeof entity.acceleration === "object") {
            if (entity.drag) {
              if (entity.accleration.x)
                entity.acceleration.x -= entity.acceleration.x * entity.drag * timeStep;
              if (entity.accleration.y)
                entity.acceleration.y -= entity.acceleration.y * entity.drag * timeStep;
              if (entity.accleration.z)
                entity.acceleration.z -= entity.acceleration.z * entity.drag * timeStep;
            }
            if (entity.accleration.x)
              entity.velocity.x += entity.accleration.x * timeStep;
            if (entity.accleration.y)
              entity.velocity.y += entity.accleration.y * timeStep;
            if (entity.accleration.z)
              entity.velocity.z += entity.accleration.z * timeStep;
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
      }
    }
  };

  // ../../services/dom/DOMElement.js
  var DOMElement = class extends HTMLElement {
    constructor() {
      super();
      __publicField(this, "template", (self2 = this, props) => {
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
            this.shadowRoot.removeChild(this.FRAGMENT);
          } else
            this.removeChild(this.FRAGMENT);
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
          this.shadowRoot.prepend(fragment);
          this.FRAGMENT = this.shadowRoot.childNodes[0];
        } else {
          this.prepend(fragment);
          this.FRAGMENT = this.childNodes[0];
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

  // ../../services/dom/DOM.service.ts
  var DOMService = class extends Service {
    constructor(options, parentNode, interpreters) {
      super({ props: options?.props, name: options?.name ? options.name : `dom${Math.floor(Math.random() * 1e15)}` });
      this.loadDefaultRoutes = false;
      this.keepState = true;
      this.parentNode = document.body;
      this.interpreters = {
        md: (template, options) => {
          if (typeof markdownit === "undefined") {
            document.head.insertAdjacentHTML(
              "beforeend",
              `
                    <script src='https://unpkg.com/markdown-it@latest/dist/markdown-it.min.js'><\/script>`
            );
          }
          let md = globalThis.markdownit();
          let html = md.render(template);
          options.template = html;
        },
        jsx: (template, options) => {
          if (!options.parentNode)
            options.parentNode = this.parentNode;
          if (typeof options.parentNode === "string")
            options.parentNode = document.getElementById(options.parentNode);
          if (typeof ReactDOM === "undefined") {
            document.head.insertAdjacentHTML(
              "beforeend",
              `
                    <script src='https://unpkg.com/react@latest/umd/react.production.min.js'><\/script>
                    <script src='https://unpkg.com/react-dom@latest/umd/react-dom.production.min.js'><\/script>`
            );
          }
          options.template = "";
          let onrender = options.onrender;
          options.onrender = (self2, info) => {
            const modal = ReactDOM.createPortal(template, options.id);
            onrender(self2, info);
          };
        }
      };
      this.customRoutes = {
        "dom": (r, route, routes) => {
          if (r.template) {
            if (!r.tag)
              r.tag = route;
            this.addComponent(r, r.generateChildElementNodes);
          } else if (r.context) {
            if (!r.tag)
              r.tag = route;
            this.addCanvasComponent(r);
          } else if (r.tagName || r.element) {
            if (!r.tag)
              r.tag = route;
            this.addElement(r, r.generateChildElementNodes);
          }
          return r;
        }
      };
      this.customChildren = {
        "dom": (rt, routeKey, route, routes, checked) => {
          if ((route.tag || route.id) && (route.template || route.context || route.tagName || route.element) && (rt.template || rt.context || rt.tagName || rt.element) && !rt.parentNode) {
            if (route.tag)
              rt.parentNode = route.tag;
            if (route.id)
              rt.parentNode = route.id;
          }
          return rt;
        }
      };
      this.elements = {};
      this.components = {};
      this.templates = {};
      this.addElement = (options, generateChildElementNodes = false) => {
        let elm = this.createElement(options);
        let oncreate = options.onrender;
        if (!options.element)
          options.element = elm;
        if (!options.operator)
          options.operator = (node2, origin, props) => {
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
          };
        let node;
        if (this.nodes.get(options.id)?.element?.parentNode?.id === options.parentNode || this.nodes.get(options.id)?.parentNode === options.parentNode) {
          node = this.nodes.get(options.id);
          node.element = elm;
        } else {
          node = new GraphNode(
            options,
            options.parentNode ? this.nodes.get(options.parentNode) : this.parentNode,
            this
          );
        }
        elm.node = node;
        let divs = Array.from(elm.querySelectorAll("*"));
        if (generateChildElementNodes) {
          divs = divs.map((d, i) => this.addElement({ element: d }));
        }
        this.elements[options.id] = { element: elm, node, parentNode: options.parentNode, divs };
        if (!node.ondelete)
          node.ondelete = (node2) => {
            elm.remove();
            if (options.onremove)
              options.onremove(elm, this.elements[options.id]);
          };
        if (options.onresize) {
          let onresize = options.onresize;
          options.onresize = (ev) => {
            onresize(ev, elm, this.elements[options.id]);
          };
          window.addEventListener("resize", options.onresize);
        }
        if (!elm.parentNode) {
          setTimeout(() => {
            if (typeof options.parentNode === "string")
              options.parentNode = document.getElementById(options.parentNode);
            if (typeof options.parentNode === "object") {
              options.parentNode.appendChild(elm);
            }
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
        if (!options.id && options.tag)
          options.id = options.tag;
        if (!options.tag && options.id)
          options.tag = options.id;
        if (!options.id)
          options.id = `${options.tagName ?? "element"}${Math.floor(Math.random() * 1e15)}`;
        if (typeof options.parentNode === "string" && document.getElementById(options.parentNode))
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
        if (options.onrender) {
          let oncreate = options.onrender;
          options.onrender = (self2) => {
            oncreate(self2, options);
          };
        }
        if (options.onresize) {
          let onresize = options.onresize;
          options.onresize = (self2) => {
            onresize(self2, options);
          };
        }
        if (options.onremove) {
          let ondelete = options.onremove;
          options.onremove = (self2) => {
            ondelete(self2, options);
          };
        }
        if (typeof options.renderonchanged === "function") {
          let renderonchanged = options.renderonchanged;
          options.renderonchanged = (self2) => {
            renderonchanged(self2, options);
          };
        }
        if (options.interpreter && options.interpreter !== "wc") {
          this.interpreters[options.interpreter](options.template, options);
        }
        class CustomElement extends DOMElement {
          constructor() {
            super(...arguments);
            this.props = options.props;
            this.styles = options.styles;
            this.useShadow = options.useShadow;
            this.template = options.template;
            this.oncreate = options.onrender;
            this.onresize = options.onresize;
            this.ondelete = options.onremove;
            this.renderonchanged = options.renderonchanged;
          }
        }
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
        if (!options.element)
          options.element = elm;
        if (!options.operator)
          options.operator = (node2, origin, props) => {
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
          };
        let node;
        if (this.nodes.get(options.id)?.element?.parentNode?.id === options.parentNode || this.nodes.get(options.id)?.parentNode === options.parentNode) {
          node = this.nodes.get(options.id);
          node.element = elm;
        } else {
          node = new GraphNode(
            options,
            options.parentNode ? this.nodes.get(options.parentNode) : this.parentNode,
            this
          );
        }
        if (!node.ondelete)
          node.ondelete = (node2) => {
            elm.delete();
          };
        elm.node = node;
        this.components[completeOptions.id] = {
          element: elm,
          class: CustomElement,
          node,
          divs,
          ...completeOptions
        };
        if (!elm.parentNode) {
          setTimeout(() => {
            if (typeof options.parentNode === "string")
              options.parentNode = document.getElementById(options.parentNode);
            if (typeof options.parentNode === "object") {
              options.parentNode.appendChild(elm);
            }
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
        if (options.onrender) {
          let oncreate = options.onrender;
          options.onrender = (self2) => {
            oncreate(self2, options);
          };
        }
        if (options.onresize) {
          let onresize = options.onresize;
          options.onresize = (self2) => {
            onresize(self2, options);
          };
        }
        if (options.ondelete) {
          let ondelete = options.onremove;
          options.onremove = (self2) => {
            ondelete(self2, options);
          };
        }
        if (typeof options.renderonchanged === "function") {
          let renderonchanged = options.renderonchanged;
          options.renderonchanged = (self2) => {
            renderonchanged(self2, options);
          };
        }
        class CustomElement extends DOMElement {
          constructor() {
            super(...arguments);
            this.props = options.props;
            this.styles = options.styles;
            this.template = options.template;
            this.oncreate = options.onrender;
            this.onresize = options.onresize;
            this.ondelete = options.onremove;
            this.renderonchanged = options.renderonchanged;
          }
        }
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
        if (!options.element)
          options.element = elm;
        if (!options.operator)
          options.operator = (node2, origin, props) => {
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
          };
        let node;
        if (this.nodes.get(options.id)?.element?.parentNode?.id === options.parentNode || this.nodes.get(options.id)?.parentNode === options.parentNode) {
          node = this.nodes.get(options.id);
          node.element = elm;
        } else {
          node = new GraphNode(
            options,
            options.parentNode ? this.nodes.get(options.parentNode) : this.parentNode,
            this
          );
        }
        elm.node = node;
        if (!node.ondelete)
          node.ondelete = (node2) => {
            elm.delete();
          };
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
            if (typeof options.parentNode === "string")
              options.parentNode = document.getElementById(options.parentNode);
            if (typeof options.parentNode === "object") {
              options.parentNode.appendChild(elm);
            }
          }, 0.01);
        }
        node.runAnimation(animation);
        return this.components[completeOptions.id];
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
      this.defaultRoutes = {
        addElement: this.addElement,
        addComponent: this.addComponent,
        addCanvasComponent: this.addCanvasComponent,
        terminate: this.terminate
      };
      if (options?.parentNode)
        parentNode = options.parentNode;
      if (typeof parentNode === "string")
        parentNode = document.getElementById(parentNode);
      if (parentNode instanceof HTMLElement)
        this.parentNode = parentNode;
      if (interpreters) {
        Object.assign(this.interpreters, interpreters);
      }
      this.init(options);
    }
  };

  // ../../services/e2ee/E2EE.service.ts
  var import_sjcl = __toESM(require_sjcl());

  // ../../services/worker/Worker.service.ts
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
        let post = (route, args, transfer, origin, method) => {
          let message = {
            route,
            args
          };
          if (origin)
            message.origin = origin;
          if (method)
            message.method = method;
          return this.transmit(message, worker, transfer);
        };
        let run = (route, args, transfer, origin, method) => {
          return new Promise((res, rej) => {
            let callbackId = Math.random();
            let req = { route: "runRequest", args: [{ route, args }, options._id, callbackId] };
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
            let req = { route: "runRequest", args: [message, options._id, callbackId] };
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
            this.setState({ [ev.data.origin ? ev.data.origin : "worker"]: result });
        };
      }
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
        type: "size",
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
        if (data.type === "size") {
          this.left = data.left;
          this.top = data.top;
          this.width = data.width;
          this.height = data.height;
          if (typeof this.proxied === "object") {
            this.proxied.width = this.width;
            this.proxied.height = this.height;
          }
          return;
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
      this.makeProxy = (id, addTo) => {
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
          addTo.addEventListener = proxy.addEventListener.bind(proxy);
          addTo.removeEventListener = proxy.removeEventListener.bind(proxy);
          addTo.handleEvent = proxy.handleEvent.bind(proxy);
          addTo.dispatchEvent = proxy.dispatchEvent.bind(proxy);
        }
      };
      this.getProxy = (id) => {
        return this.targets[id];
      };
      this.handleEvent = (data, id) => {
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
    makeProxy: (self2, origin, id, elm) => {
      if (!self2.graph.ProxyManager)
        self2.graph.ProxyManager = new ProxyManager();
      self2.graph.ProxyManager.makeProxy(id, elm);
      return id;
    },
    handleProxyEvent: (self2, origin, data, id) => {
      if (!self2.graph.ProxyManager)
        self2.graph.ProxyManager = new ProxyManager();
      if (self2.graph.ProxyManager.handleEvent(data, id))
        return data;
    }
  };

  // ../../services/worker/WorkerCanvas.ts
  var workerCanvasRoutes = {
    ...proxyElementWorkerRoutes,
    transferCanvas: (self2, origin, worker, options) => {
      if (!options)
        return void 0;
      if (!options._id)
        options._id = `canvas${Math.floor(Math.random() * 1e15)}`;
      let offscreen = options.canvas.transferControlToOffscreen();
      let message = { route: "receiveCanvas", args: { canvas: offscreen, context: options.context, _id: options._id } };
      self2.graph.run("initProxyElement", options.canvas, worker, options._id);
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
      return options._id;
    },
    receiveCanvas: (self2, origin, options) => {
      if (!self2.graph.CANVASES)
        self2.graph.CANVASES = {};
      let canvasOptions = {
        _id: options._id ? options._id : `canvas${Math.floor(Math.random() * 1e15)}`,
        canvas: options.canvas,
        context: options.context ? options.canvas.getContext(options.context) : void 0,
        init: options.init,
        update: options.update,
        clear: options.clear,
        draw: options.draw,
        animating: "animating" in options ? options.animating : true
      };
      if (self2.graph.CANVASES[canvasOptions._id]) {
        self2.graph.run("setDraw", canvasOptions);
      } else {
        self2.graph.CANVASES[canvasOptions._id] = canvasOptions;
        self2.graph.run("makeProxy", canvasOptions._id, canvasOptions.canvas);
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
        if (typeof canvasOptions.draw === "function") {
          let draw = (s, canvas, context) => {
            if (s.animating) {
              s.draw(s, canvas, context);
              requestAnimationFrame(() => {
                draw(s, canvas, context);
              });
            }
          };
          if (typeof canvasOptions.init === "function")
            canvasOptions.init(canvasOptions, canvasOptions.canvas, canvasOptions.context);
          draw(canvasOptions, canvasOptions.canvas, canvasOptions.context);
        }
      }
      return canvasOptions._id;
    },
    setDraw: (self2, origin, settings) => {
      let canvasopts;
      if (settings._id)
        canvasopts = self2.graph.CANVASES?.[settings._id];
      else
        canvasopts = self2.graph.CANVASES?.[Object.keys(self2.graph.CANVASES)[0]];
      if (canvasopts) {
        if (settings.canvas) {
          canvasopts.canvas = settings.canvas;
          self2.graph.run("makeProxy", canvasopts._id, canvasopts.canvas);
        }
        if (settings.context)
          canvasopts.context = canvasopts.canvas.getContext(settings.context);
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
    drawFrame: (self2, origin, _id, props) => {
      let canvasopts;
      if (!_id)
        canvasopts = self2.graph.CANVASES?.[Object.keys(self2.graph.CANVASES)[0]];
      else
        canvasopts = self2.graph.CANVASES?.[_id];
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
    clearFrame: (self2, origin, _id, input) => {
      let canvasopts;
      if (!_id)
        canvasopts = self2.graph.CANVASES?.[Object.keys(self2.graph.CANVASES)[0]];
      else
        canvasopts = self2.graph.CANVASES?.[_id];
      if (canvasopts?.clear) {
        canvasopts.clear(canvasopts, canvasopts.canvas, canvasopts.context, input);
        return _id;
      }
      return void 0;
    },
    runUpdate: (self2, origin, _id, input) => {
      let canvasopts;
      if (!_id)
        canvasopts = self2.graph.CANVASES?.[Object.keys(self2.graph.CANVASES)[0]];
      else
        canvasopts = self2.graph.CANVASES?.[_id];
      if (canvasopts?.update) {
        canvasopts.update(canvasopts, canvasopts.canvas, canvasopts.context, input);
        return _id;
      }
      return void 0;
    },
    setProps: (self2, origin, _id, props) => {
      let canvasopts;
      if (!_id)
        canvasopts = self2.graph.CANVASES?.[Object.keys(self2.graph.CANVASES)[0]];
      else
        canvasopts = self2.graph.CANVASES?.[_id];
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
    startAnim: (self2, origin, _id, draw) => {
      let canvasopts;
      if (!_id)
        canvasopts = self2.graph.CANVASES?.[Object.keys(self2.graph.CANVASES)[0]];
      else
        canvasopts = self2.graph.CANVASES?.[_id];
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
    stopAnim: (self2, origin, _id) => {
      let canvasopts;
      if (!_id)
        canvasopts = self2.graph.CANVASES?.[Object.keys(self2.graph.CANVASES)[0]];
      else
        canvasopts = self2.graph.CANVASES?.[_id];
      if (canvasopts) {
        canvasopts.animating = false;
        if (typeof canvasopts.clear === "function")
          canvasopts.clear(canvasopts, canvasopts.canvas, canvasopts.context);
        return _id;
      }
      return void 0;
    }
  };

  // ../../routers/Router.ts
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

  // worker.ts
  var url = URL.createObjectURL(new Blob([String('(()=>{var __create=Object.create;var __defProp=Object.defineProperty;var __getOwnPropDesc=Object.getOwnPropertyDescriptor;var __getOwnPropNames=Object.getOwnPropertyNames;var __getProtoOf=Object.getPrototypeOf;var __hasOwnProp=Object.prototype.hasOwnProperty;var __require=(x=>typeof require!=="undefined"?require:typeof Proxy!=="undefined"?new Proxy(x,{get:(a,b)=>(typeof require!=="undefined"?require:a)[b]}):x)(function(x){if(typeof require!=="undefined")return require.apply(this,arguments);throw new Error(\'Dynamic require of "\'+x+\'" is not supported\')});var __commonJS=(cb,mod)=>function __require2(){return mod||(0,cb[__getOwnPropNames(cb)[0]])((mod={exports:{}}).exports,mod),mod.exports};var __copyProps=(to,from,except,desc)=>{if(from&&typeof from==="object"||typeof from==="function"){for(let key of __getOwnPropNames(from))if(!__hasOwnProp.call(to,key)&&key!==except)__defProp(to,key,{get:()=>from[key],enumerable:!(desc=__getOwnPropDesc(from,key))||desc.enumerable})}return to};var __toESM=(mod,isNodeMode,target)=>(target=mod!=null?__create(__getProtoOf(mod)):{},__copyProps(isNodeMode||!mod||!mod.__esModule?__defProp(target,"default",{value:mod,enumerable:true}):target,mod));var require_sjcl=__commonJS({"../../services/e2ee/sjcl.js"(exports,module){"use strict";var sjcl2={cipher:{},hash:{},keyexchange:{},mode:{},misc:{},codec:{},exception:{corrupt:function(a){this.toString=function(){return"CORRUPT: "+this.message};this.message=a},invalid:function(a){this.toString=function(){return"INVALID: "+this.message};this.message=a},bug:function(a){this.toString=function(){return"BUG: "+this.message};this.message=a},notReady:function(a){this.toString=function(){return"NOT READY: "+this.message};this.message=a}}};sjcl2.cipher.aes=function(a){this.s[0][0][0]||this.O();var b,c,d,e,f=this.s[0][4],g=this.s[1];b=a.length;var h=1;if(4!==b&&6!==b&&8!==b)throw new sjcl2.exception.invalid("invalid aes key size");this.b=[d=a.slice(0),e=[]];for(a=b;a<4*b+28;a++){c=d[a-1];if(0===a%b||8===b&&4===a%b)c=f[c>>>24]<<24^f[c>>16&255]<<16^f[c>>8&255]<<8^f[c&255],0===a%b&&(c=c<<8^c>>>24^h<<24,h=h<<1^283*(h>>7));d[a]=d[a-b]^c}for(b=0;a;b++,a--)c=d[b&3?a:a-4],e[b]=4>=a||4>b?c:g[0][f[c>>>24]]^g[1][f[c>>16&255]]^g[2][f[c>>8&255]]^g[3][f[c&255]]};sjcl2.cipher.aes.prototype={encrypt:function(a){return t(this,a,0)},decrypt:function(a){return t(this,a,1)},s:[[[],[],[],[],[]],[[],[],[],[],[]]],O:function(){var a=this.s[0],b=this.s[1],c=a[4],d=b[4],e,f,g,h=[],k=[],l,n,m,p;for(e=0;256>e;e++)k[(h[e]=e<<1^283*(e>>7))^e]=e;for(f=g=0;!c[f];f^=l||1,g=k[g]||1)for(m=g^g<<1^g<<2^g<<3^g<<4,m=m>>8^m&255^99,c[f]=m,d[m]=f,n=h[e=h[l=h[f]]],p=16843009*n^65537*e^257*l^16843008*f,n=257*h[m]^16843008*m,e=0;4>e;e++)a[e][f]=n=n<<24^n>>>8,b[e][m]=p=p<<24^p>>>8;for(e=0;5>e;e++)a[e]=a[e].slice(0),b[e]=b[e].slice(0)}};function t(a,b,c){if(4!==b.length)throw new sjcl2.exception.invalid("invalid aes block size");var d=a.b[c],e=b[0]^d[0],f=b[c?3:1]^d[1],g=b[2]^d[2];b=b[c?1:3]^d[3];var h,k,l,n=d.length/4-2,m,p=4,r=[0,0,0,0];h=a.s[c];a=h[0];var q=h[1],v=h[2],w=h[3],x=h[4];for(m=0;m<n;m++)h=a[e>>>24]^q[f>>16&255]^v[g>>8&255]^w[b&255]^d[p],k=a[f>>>24]^q[g>>16&255]^v[b>>8&255]^w[e&255]^d[p+1],l=a[g>>>24]^q[b>>16&255]^v[e>>8&255]^w[f&255]^d[p+2],b=a[b>>>24]^q[e>>16&255]^v[f>>8&255]^w[g&255]^d[p+3],p+=4,e=h,f=k,g=l;for(m=0;4>m;m++)r[c?3&-m:m]=x[e>>>24]<<24^x[f>>16&255]<<16^x[g>>8&255]<<8^x[b&255]^d[p++],h=e,e=f,f=g,g=b,b=h;return r}sjcl2.bitArray={bitSlice:function(a,b,c){a=sjcl2.bitArray.$(a.slice(b/32),32-(b&31)).slice(1);return void 0===c?a:sjcl2.bitArray.clamp(a,c-b)},extract:function(a,b,c){var d=Math.floor(-b-c&31);return((b+c-1^b)&-32?a[b/32|0]<<32-d^a[b/32+1|0]>>>d:a[b/32|0]>>>d)&(1<<c)-1},concat:function(a,b){if(0===a.length||0===b.length)return a.concat(b);var c=a[a.length-1],d=sjcl2.bitArray.getPartial(c);return 32===d?a.concat(b):sjcl2.bitArray.$(b,d,c|0,a.slice(0,a.length-1))},bitLength:function(a){var b=a.length;return 0===b?0:32*(b-1)+sjcl2.bitArray.getPartial(a[b-1])},clamp:function(a,b){if(32*a.length<b)return a;a=a.slice(0,Math.ceil(b/32));var c=a.length;b=b&31;0<c&&b&&(a[c-1]=sjcl2.bitArray.partial(b,a[c-1]&2147483648>>b-1,1));return a},partial:function(a,b,c){return 32===a?b:(c?b|0:b<<32-a)+1099511627776*a},getPartial:function(a){return Math.round(a/1099511627776)||32},equal:function(a,b){if(sjcl2.bitArray.bitLength(a)!==sjcl2.bitArray.bitLength(b))return false;var c=0,d;for(d=0;d<a.length;d++)c|=a[d]^b[d];return 0===c},$:function(a,b,c,d){var e;e=0;for(void 0===d&&(d=[]);32<=b;b-=32)d.push(c),c=0;if(0===b)return d.concat(a);for(e=0;e<a.length;e++)d.push(c|a[e]>>>b),c=a[e]<<32-b;e=a.length?a[a.length-1]:0;a=sjcl2.bitArray.getPartial(e);d.push(sjcl2.bitArray.partial(b+a&31,32<b+a?c:d.pop(),1));return d},i:function(a,b){return[a[0]^b[0],a[1]^b[1],a[2]^b[2],a[3]^b[3]]},byteswapM:function(a){var b,c;for(b=0;b<a.length;++b)c=a[b],a[b]=c>>>24|c>>>8&65280|(c&65280)<<8|c<<24;return a}};sjcl2.codec.utf8String={fromBits:function(a){var b="",c=sjcl2.bitArray.bitLength(a),d,e;for(d=0;d<c/8;d++)0===(d&3)&&(e=a[d/4]),b+=String.fromCharCode(e>>>8>>>8>>>8),e<<=8;return decodeURIComponent(escape(b))},toBits:function(a){a=unescape(encodeURIComponent(a));var b=[],c,d=0;for(c=0;c<a.length;c++)d=d<<8|a.charCodeAt(c),3===(c&3)&&(b.push(d),d=0);c&3&&b.push(sjcl2.bitArray.partial(8*(c&3),d));return b}};sjcl2.codec.hex={fromBits:function(a){var b="",c;for(c=0;c<a.length;c++)b+=((a[c]|0)+0xf00000000000).toString(16).substr(4);return b.substr(0,sjcl2.bitArray.bitLength(a)/4)},toBits:function(a){var b,c=[],d;a=a.replace(/\\s|0x/g,"");d=a.length;a=a+"00000000";for(b=0;b<a.length;b+=8)c.push(parseInt(a.substr(b,8),16)^0);return sjcl2.bitArray.clamp(c,4*d)}};sjcl2.codec.base32={B:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",X:"0123456789ABCDEFGHIJKLMNOPQRSTUV",BITS:32,BASE:5,REMAINING:27,fromBits:function(a,b,c){var d=sjcl2.codec.base32.BASE,e=sjcl2.codec.base32.REMAINING,f="",g=0,h=sjcl2.codec.base32.B,k=0,l=sjcl2.bitArray.bitLength(a);c&&(h=sjcl2.codec.base32.X);for(c=0;f.length*d<l;)f+=h.charAt((k^a[c]>>>g)>>>e),g<d?(k=a[c]<<d-g,g+=e,c++):(k<<=d,g-=d);for(;f.length&7&&!b;)f+="=";return f},toBits:function(a,b){a=a.replace(/\\s|=/g,"").toUpperCase();var c=sjcl2.codec.base32.BITS,d=sjcl2.codec.base32.BASE,e=sjcl2.codec.base32.REMAINING,f=[],g,h=0,k=sjcl2.codec.base32.B,l=0,n,m="base32";b&&(k=sjcl2.codec.base32.X,m="base32hex");for(g=0;g<a.length;g++){n=k.indexOf(a.charAt(g));if(0>n){if(!b)try{return sjcl2.codec.base32hex.toBits(a)}catch(p){}throw new sjcl2.exception.invalid("this isn\'t "+m+"!")}h>e?(h-=e,f.push(l^n>>>h),l=n<<c-h):(h+=d,l^=n<<c-h)}h&56&&f.push(sjcl2.bitArray.partial(h&56,l,1));return f}};sjcl2.codec.base32hex={fromBits:function(a,b){return sjcl2.codec.base32.fromBits(a,b,1)},toBits:function(a){return sjcl2.codec.base32.toBits(a,1)}};sjcl2.codec.base64={B:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",fromBits:function(a,b,c){var d="",e=0,f=sjcl2.codec.base64.B,g=0,h=sjcl2.bitArray.bitLength(a);c&&(f=f.substr(0,62)+"-_");for(c=0;6*d.length<h;)d+=f.charAt((g^a[c]>>>e)>>>26),6>e?(g=a[c]<<6-e,e+=26,c++):(g<<=6,e-=6);for(;d.length&3&&!b;)d+="=";return d},toBits:function(a,b){a=a.replace(/\\s|=/g,"");var c=[],d,e=0,f=sjcl2.codec.base64.B,g=0,h;b&&(f=f.substr(0,62)+"-_");for(d=0;d<a.length;d++){h=f.indexOf(a.charAt(d));if(0>h)throw new sjcl2.exception.invalid("this isn\'t base64!");26<e?(e-=26,c.push(g^h>>>e),g=h<<32-e):(e+=6,g^=h<<32-e)}e&56&&c.push(sjcl2.bitArray.partial(e&56,g,1));return c}};sjcl2.codec.base64url={fromBits:function(a){return sjcl2.codec.base64.fromBits(a,1,1)},toBits:function(a){return sjcl2.codec.base64.toBits(a,1)}};sjcl2.hash.sha256=function(a){this.b[0]||this.O();a?(this.F=a.F.slice(0),this.A=a.A.slice(0),this.l=a.l):this.reset()};sjcl2.hash.sha256.hash=function(a){return new sjcl2.hash.sha256().update(a).finalize()};sjcl2.hash.sha256.prototype={blockSize:512,reset:function(){this.F=this.Y.slice(0);this.A=[];this.l=0;return this},update:function(a){"string"===typeof a&&(a=sjcl2.codec.utf8String.toBits(a));var b,c=this.A=sjcl2.bitArray.concat(this.A,a);b=this.l;a=this.l=b+sjcl2.bitArray.bitLength(a);if(9007199254740991<a)throw new sjcl2.exception.invalid("Cannot hash more than 2^53 - 1 bits");if("undefined"!==typeof Uint32Array){var d=new Uint32Array(c),e=0;for(b=512+b-(512+b&511);b<=a;b+=512)u(this,d.subarray(16*e,16*(e+1))),e+=1;c.splice(0,16*e)}else for(b=512+b-(512+b&511);b<=a;b+=512)u(this,c.splice(0,16));return this},finalize:function(){var a,b=this.A,c=this.F,b=sjcl2.bitArray.concat(b,[sjcl2.bitArray.partial(1,1)]);for(a=b.length+2;a&15;a++)b.push(0);b.push(Math.floor(this.l/4294967296));for(b.push(this.l|0);b.length;)u(this,b.splice(0,16));this.reset();return c},Y:[],b:[],O:function(){function a(a2){return 4294967296*(a2-Math.floor(a2))|0}for(var b=0,c=2,d,e;64>b;c++){e=true;for(d=2;d*d<=c;d++)if(0===c%d){e=false;break}e&&(8>b&&(this.Y[b]=a(Math.pow(c,.5))),this.b[b]=a(Math.pow(c,1/3)),b++)}}};function u(a,b){var c,d,e,f=a.F,g=a.b,h=f[0],k=f[1],l=f[2],n=f[3],m=f[4],p=f[5],r=f[6],q=f[7];for(c=0;64>c;c++)16>c?d=b[c]:(d=b[c+1&15],e=b[c+14&15],d=b[c&15]=(d>>>7^d>>>18^d>>>3^d<<25^d<<14)+(e>>>17^e>>>19^e>>>10^e<<15^e<<13)+b[c&15]+b[c+9&15]|0),d=d+q+(m>>>6^m>>>11^m>>>25^m<<26^m<<21^m<<7)+(r^m&(p^r))+g[c],q=r,r=p,p=m,m=n+d|0,n=l,l=k,k=h,h=d+(k&l^n&(k^l))+(k>>>2^k>>>13^k>>>22^k<<30^k<<19^k<<10)|0;f[0]=f[0]+h|0;f[1]=f[1]+k|0;f[2]=f[2]+l|0;f[3]=f[3]+n|0;f[4]=f[4]+m|0;f[5]=f[5]+p|0;f[6]=f[6]+r|0;f[7]=f[7]+q|0}sjcl2.mode.ccm={name:"ccm",G:[],listenProgress:function(a){sjcl2.mode.ccm.G.push(a)},unListenProgress:function(a){a=sjcl2.mode.ccm.G.indexOf(a);-1<a&&sjcl2.mode.ccm.G.splice(a,1)},fa:function(a){var b=sjcl2.mode.ccm.G.slice(),c;for(c=0;c<b.length;c+=1)b[c](a)},encrypt:function(a,b,c,d,e){var f,g=b.slice(0),h=sjcl2.bitArray,k=h.bitLength(c)/8,l=h.bitLength(g)/8;e=e||64;d=d||[];if(7>k)throw new sjcl2.exception.invalid("ccm: iv must be at least 7 bytes");for(f=2;4>f&&l>>>8*f;f++);f<15-k&&(f=15-k);c=h.clamp(c,8*(15-f));b=sjcl2.mode.ccm.V(a,b,c,d,e,f);g=sjcl2.mode.ccm.C(a,g,c,b,e,f);return h.concat(g.data,g.tag)},decrypt:function(a,b,c,d,e){e=e||64;d=d||[];var f=sjcl2.bitArray,g=f.bitLength(c)/8,h=f.bitLength(b),k=f.clamp(b,h-e),l=f.bitSlice(b,h-e),h=(h-e)/8;if(7>g)throw new sjcl2.exception.invalid("ccm: iv must be at least 7 bytes");for(b=2;4>b&&h>>>8*b;b++);b<15-g&&(b=15-g);c=f.clamp(c,8*(15-b));k=sjcl2.mode.ccm.C(a,k,c,l,e,b);a=sjcl2.mode.ccm.V(a,k.data,c,d,e,b);if(!f.equal(k.tag,a))throw new sjcl2.exception.corrupt("ccm: tag doesn\'t match");return k.data},na:function(a,b,c,d,e,f){var g=[],h=sjcl2.bitArray,k=h.i;d=[h.partial(8,(b.length?64:0)|d-2<<2|f-1)];d=h.concat(d,c);d[3]|=e;d=a.encrypt(d);if(b.length)for(c=h.bitLength(b)/8,65279>=c?g=[h.partial(16,c)]:4294967295>=c&&(g=h.concat([h.partial(16,65534)],[c])),g=h.concat(g,b),b=0;b<g.length;b+=4)d=a.encrypt(k(d,g.slice(b,b+4).concat([0,0,0])));return d},V:function(a,b,c,d,e,f){var g=sjcl2.bitArray,h=g.i;e/=8;if(e%2||4>e||16<e)throw new sjcl2.exception.invalid("ccm: invalid tag length");if(4294967295<d.length||4294967295<b.length)throw new sjcl2.exception.bug("ccm: can\'t deal with 4GiB or more data");c=sjcl2.mode.ccm.na(a,d,c,e,g.bitLength(b)/8,f);for(d=0;d<b.length;d+=4)c=a.encrypt(h(c,b.slice(d,d+4).concat([0,0,0])));return g.clamp(c,8*e)},C:function(a,b,c,d,e,f){var g,h=sjcl2.bitArray;g=h.i;var k=b.length,l=h.bitLength(b),n=k/50,m=n;c=h.concat([h.partial(8,f-1)],c).concat([0,0,0]).slice(0,4);d=h.bitSlice(g(d,a.encrypt(c)),0,e);if(!k)return{tag:d,data:[]};for(g=0;g<k;g+=4)g>n&&(sjcl2.mode.ccm.fa(g/k),n+=m),c[3]++,e=a.encrypt(c),b[g]^=e[0],b[g+1]^=e[1],b[g+2]^=e[2],b[g+3]^=e[3];return{tag:d,data:h.clamp(b,l)}}};sjcl2.mode.ocb2={name:"ocb2",encrypt:function(a,b,c,d,e,f){if(128!==sjcl2.bitArray.bitLength(c))throw new sjcl2.exception.invalid("ocb iv must be 128 bits");var g,h=sjcl2.mode.ocb2.S,k=sjcl2.bitArray,l=k.i,n=[0,0,0,0];c=h(a.encrypt(c));var m,p=[];d=d||[];e=e||64;for(g=0;g+4<b.length;g+=4)m=b.slice(g,g+4),n=l(n,m),p=p.concat(l(c,a.encrypt(l(c,m)))),c=h(c);m=b.slice(g);b=k.bitLength(m);g=a.encrypt(l(c,[0,0,0,b]));m=k.clamp(l(m.concat([0,0,0]),g),b);n=l(n,l(m.concat([0,0,0]),g));n=a.encrypt(l(n,l(c,h(c))));d.length&&(n=l(n,f?d:sjcl2.mode.ocb2.pmac(a,d)));return p.concat(k.concat(m,k.clamp(n,e)))},decrypt:function(a,b,c,d,e,f){if(128!==sjcl2.bitArray.bitLength(c))throw new sjcl2.exception.invalid("ocb iv must be 128 bits");e=e||64;var g=sjcl2.mode.ocb2.S,h=sjcl2.bitArray,k=h.i,l=[0,0,0,0],n=g(a.encrypt(c)),m,p,r=sjcl2.bitArray.bitLength(b)-e,q=[];d=d||[];for(c=0;c+4<r/32;c+=4)m=k(n,a.decrypt(k(n,b.slice(c,c+4)))),l=k(l,m),q=q.concat(m),n=g(n);p=r-32*c;m=a.encrypt(k(n,[0,0,0,p]));m=k(m,h.clamp(b.slice(c),p).concat([0,0,0]));l=k(l,m);l=a.encrypt(k(l,k(n,g(n))));d.length&&(l=k(l,f?d:sjcl2.mode.ocb2.pmac(a,d)));if(!h.equal(h.clamp(l,e),h.bitSlice(b,r)))throw new sjcl2.exception.corrupt("ocb: tag doesn\'t match");return q.concat(h.clamp(m,p))},pmac:function(a,b){var c,d=sjcl2.mode.ocb2.S,e=sjcl2.bitArray,f=e.i,g=[0,0,0,0],h=a.encrypt([0,0,0,0]),h=f(h,d(d(h)));for(c=0;c+4<b.length;c+=4)h=d(h),g=f(g,a.encrypt(f(h,b.slice(c,c+4))));c=b.slice(c);128>e.bitLength(c)&&(h=f(h,d(h)),c=e.concat(c,[-2147483648,0,0,0]));g=f(g,c);return a.encrypt(f(d(f(h,d(h))),g))},S:function(a){return[a[0]<<1^a[1]>>>31,a[1]<<1^a[2]>>>31,a[2]<<1^a[3]>>>31,a[3]<<1^135*(a[0]>>>31)]}};sjcl2.mode.gcm={name:"gcm",encrypt:function(a,b,c,d,e){var f=b.slice(0);b=sjcl2.bitArray;d=d||[];a=sjcl2.mode.gcm.C(true,a,f,d,c,e||128);return b.concat(a.data,a.tag)},decrypt:function(a,b,c,d,e){var f=b.slice(0),g=sjcl2.bitArray,h=g.bitLength(f);e=e||128;d=d||[];e<=h?(b=g.bitSlice(f,h-e),f=g.bitSlice(f,0,h-e)):(b=f,f=[]);a=sjcl2.mode.gcm.C(false,a,f,d,c,e);if(!g.equal(a.tag,b))throw new sjcl2.exception.corrupt("gcm: tag doesn\'t match");return a.data},ka:function(a,b){var c,d,e,f,g,h=sjcl2.bitArray.i;e=[0,0,0,0];f=b.slice(0);for(c=0;128>c;c++){(d=0!==(a[Math.floor(c/32)]&1<<31-c%32))&&(e=h(e,f));g=0!==(f[3]&1);for(d=3;0<d;d--)f[d]=f[d]>>>1|(f[d-1]&1)<<31;f[0]>>>=1;g&&(f[0]^=-520093696)}return e},j:function(a,b,c){var d,e=c.length;b=b.slice(0);for(d=0;d<e;d+=4)b[0]^=4294967295&c[d],b[1]^=4294967295&c[d+1],b[2]^=4294967295&c[d+2],b[3]^=4294967295&c[d+3],b=sjcl2.mode.gcm.ka(b,a);return b},C:function(a,b,c,d,e,f){var g,h,k,l,n,m,p,r,q=sjcl2.bitArray;m=c.length;p=q.bitLength(c);r=q.bitLength(d);h=q.bitLength(e);g=b.encrypt([0,0,0,0]);96===h?(e=e.slice(0),e=q.concat(e,[1])):(e=sjcl2.mode.gcm.j(g,[0,0,0,0],e),e=sjcl2.mode.gcm.j(g,e,[0,0,Math.floor(h/4294967296),h&4294967295]));h=sjcl2.mode.gcm.j(g,[0,0,0,0],d);n=e.slice(0);d=h.slice(0);a||(d=sjcl2.mode.gcm.j(g,h,c));for(l=0;l<m;l+=4)n[3]++,k=b.encrypt(n),c[l]^=k[0],c[l+1]^=k[1],c[l+2]^=k[2],c[l+3]^=k[3];c=q.clamp(c,p);a&&(d=sjcl2.mode.gcm.j(g,h,c));a=[Math.floor(r/4294967296),r&4294967295,Math.floor(p/4294967296),p&4294967295];d=sjcl2.mode.gcm.j(g,d,a);k=b.encrypt(e);d[0]^=k[0];d[1]^=k[1];d[2]^=k[2];d[3]^=k[3];return{tag:q.bitSlice(d,0,f),data:c}}};sjcl2.misc.hmac=function(a,b){this.W=b=b||sjcl2.hash.sha256;var c=[[],[]],d,e=b.prototype.blockSize/32;this.w=[new b,new b];a.length>e&&(a=b.hash(a));for(d=0;d<e;d++)c[0][d]=a[d]^909522486,c[1][d]=a[d]^1549556828;this.w[0].update(c[0]);this.w[1].update(c[1]);this.R=new b(this.w[0])};sjcl2.misc.hmac.prototype.encrypt=sjcl2.misc.hmac.prototype.mac=function(a){if(this.aa)throw new sjcl2.exception.invalid("encrypt on already updated hmac called!");this.update(a);return this.digest(a)};sjcl2.misc.hmac.prototype.reset=function(){this.R=new this.W(this.w[0]);this.aa=false};sjcl2.misc.hmac.prototype.update=function(a){this.aa=true;this.R.update(a)};sjcl2.misc.hmac.prototype.digest=function(){var a=this.R.finalize(),a=new this.W(this.w[1]).update(a).finalize();this.reset();return a};sjcl2.misc.pbkdf2=function(a,b,c,d,e){c=c||1e4;if(0>d||0>c)throw new sjcl2.exception.invalid("invalid params to pbkdf2");"string"===typeof a&&(a=sjcl2.codec.utf8String.toBits(a));"string"===typeof b&&(b=sjcl2.codec.utf8String.toBits(b));e=e||sjcl2.misc.hmac;a=new e(a);var f,g,h,k,l=[],n=sjcl2.bitArray;for(k=1;32*l.length<(d||1);k++){e=f=a.encrypt(n.concat(b,[k]));for(g=1;g<c;g++)for(f=a.encrypt(f),h=0;h<f.length;h++)e[h]^=f[h];l=l.concat(e)}d&&(l=n.clamp(l,d));return l};sjcl2.prng=function(a){this.c=[new sjcl2.hash.sha256];this.m=[0];this.P=0;this.H={};this.N=0;this.U={};this.Z=this.f=this.o=this.ha=0;this.b=[0,0,0,0,0,0,0,0];this.h=[0,0,0,0];this.L=void 0;this.M=a;this.D=false;this.K={progress:{},seeded:{}};this.u=this.ga=0;this.I=1;this.J=2;this.ca=65536;this.T=[0,48,64,96,128,192,256,384,512,768,1024];this.da=3e4;this.ba=80};sjcl2.prng.prototype={randomWords:function(a,b){var c=[],d;d=this.isReady(b);var e;if(d===this.u)throw new sjcl2.exception.notReady("generator isn\'t seeded");if(d&this.J){d=!(d&this.I);e=[];var f=0,g;this.Z=e[0]=new Date().valueOf()+this.da;for(g=0;16>g;g++)e.push(4294967296*Math.random()|0);for(g=0;g<this.c.length&&(e=e.concat(this.c[g].finalize()),f+=this.m[g],this.m[g]=0,d||!(this.P&1<<g));g++);this.P>=1<<this.c.length&&(this.c.push(new sjcl2.hash.sha256),this.m.push(0));this.f-=f;f>this.o&&(this.o=f);this.P++;this.b=sjcl2.hash.sha256.hash(this.b.concat(e));this.L=new sjcl2.cipher.aes(this.b);for(d=0;4>d&&(this.h[d]=this.h[d]+1|0,!this.h[d]);d++);}for(d=0;d<a;d+=4)0===(d+1)%this.ca&&y(this),e=z(this),c.push(e[0],e[1],e[2],e[3]);y(this);return c.slice(0,a)},setDefaultParanoia:function(a,b){if(0===a&&"Setting paranoia=0 will ruin your security; use it only for testing"!==b)throw new sjcl2.exception.invalid("Setting paranoia=0 will ruin your security; use it only for testing");this.M=a},addEntropy:function(a,b,c){c=c||"user";var d,e,f=new Date().valueOf(),g=this.H[c],h=this.isReady(),k=0;d=this.U[c];void 0===d&&(d=this.U[c]=this.ha++);void 0===g&&(g=this.H[c]=0);this.H[c]=(this.H[c]+1)%this.c.length;switch(typeof a){case"number":void 0===b&&(b=1);this.c[g].update([d,this.N++,1,b,f,1,a|0]);break;case"object":c=Object.prototype.toString.call(a);if("[object Uint32Array]"===c){e=[];for(c=0;c<a.length;c++)e.push(a[c]);a=e}else for("[object Array]"!==c&&(k=1),c=0;c<a.length&&!k;c++)"number"!==typeof a[c]&&(k=1);if(!k){if(void 0===b)for(c=b=0;c<a.length;c++)for(e=a[c];0<e;)b++,e=e>>>1;this.c[g].update([d,this.N++,2,b,f,a.length].concat(a))}break;case"string":void 0===b&&(b=a.length);this.c[g].update([d,this.N++,3,b,f,a.length]);this.c[g].update(a);break;default:k=1}if(k)throw new sjcl2.exception.bug("random: addEntropy only supports number, array of numbers or string");this.m[g]+=b;this.f+=b;h===this.u&&(this.isReady()!==this.u&&A("seeded",Math.max(this.o,this.f)),A("progress",this.getProgress()))},isReady:function(a){a=this.T[void 0!==a?a:this.M];return this.o&&this.o>=a?this.m[0]>this.ba&&new Date().valueOf()>this.Z?this.J|this.I:this.I:this.f>=a?this.J|this.u:this.u},getProgress:function(a){a=this.T[a?a:this.M];return this.o>=a?1:this.f>a?1:this.f/a},startCollectors:function(){if(!this.D){this.a={loadTimeCollector:B(this,this.ma),mouseCollector:B(this,this.oa),keyboardCollector:B(this,this.la),accelerometerCollector:B(this,this.ea),touchCollector:B(this,this.qa)};if(window.addEventListener)window.addEventListener("load",this.a.loadTimeCollector,false),window.addEventListener("mousemove",this.a.mouseCollector,false),window.addEventListener("keypress",this.a.keyboardCollector,false),window.addEventListener("devicemotion",this.a.accelerometerCollector,false),window.addEventListener("touchmove",this.a.touchCollector,false);else if(document.attachEvent)document.attachEvent("onload",this.a.loadTimeCollector),document.attachEvent("onmousemove",this.a.mouseCollector),document.attachEvent("keypress",this.a.keyboardCollector);else throw new sjcl2.exception.bug("can\'t attach event");this.D=true}},stopCollectors:function(){this.D&&(window.removeEventListener?(window.removeEventListener("load",this.a.loadTimeCollector,false),window.removeEventListener("mousemove",this.a.mouseCollector,false),window.removeEventListener("keypress",this.a.keyboardCollector,false),window.removeEventListener("devicemotion",this.a.accelerometerCollector,false),window.removeEventListener("touchmove",this.a.touchCollector,false)):document.detachEvent&&(document.detachEvent("onload",this.a.loadTimeCollector),document.detachEvent("onmousemove",this.a.mouseCollector),document.detachEvent("keypress",this.a.keyboardCollector)),this.D=false)},addEventListener:function(a,b){this.K[a][this.ga++]=b},removeEventListener:function(a,b){var c,d,e=this.K[a],f=[];for(d in e)e.hasOwnProperty(d)&&e[d]===b&&f.push(d);for(c=0;c<f.length;c++)d=f[c],delete e[d]},la:function(){C(this,1)},oa:function(a){var b,c;try{b=a.x||a.clientX||a.offsetX||0,c=a.y||a.clientY||a.offsetY||0}catch(d){c=b=0}0!=b&&0!=c&&this.addEntropy([b,c],2,"mouse");C(this,0)},qa:function(a){a=a.touches[0]||a.changedTouches[0];this.addEntropy([a.pageX||a.clientX,a.pageY||a.clientY],1,"touch");C(this,0)},ma:function(){C(this,2)},ea:function(a){a=a.accelerationIncludingGravity.x||a.accelerationIncludingGravity.y||a.accelerationIncludingGravity.z;if(window.orientation){var b=window.orientation;"number"===typeof b&&this.addEntropy(b,1,"accelerometer")}a&&this.addEntropy(a,2,"accelerometer");C(this,0)}};function A(a,b){var c,d=sjcl2.random.K[a],e=[];for(c in d)d.hasOwnProperty(c)&&e.push(d[c]);for(c=0;c<e.length;c++)e[c](b)}function C(a,b){"undefined"!==typeof window&&window.performance&&"function"===typeof window.performance.now?a.addEntropy(window.performance.now(),b,"loadtime"):a.addEntropy(new Date().valueOf(),b,"loadtime")}function y(a){a.b=z(a).concat(z(a));a.L=new sjcl2.cipher.aes(a.b)}function z(a){for(var b=0;4>b&&(a.h[b]=a.h[b]+1|0,!a.h[b]);b++);return a.L.encrypt(a.h)}function B(a,b){return function(){b.apply(a,arguments)}}sjcl2.random=new sjcl2.prng(6);a:try{if(G="undefined"!==typeof module&&module.exports){try{H=__require("crypto")}catch(a){H=null}G=E=H}if(G&&E.randomBytes)D=E.randomBytes(128),D=new Uint32Array(new Uint8Array(D).buffer),sjcl2.random.addEntropy(D,1024,"crypto[\'randomBytes\']");else if("undefined"!==typeof window&&"undefined"!==typeof Uint32Array){F=new Uint32Array(32);if(window.crypto&&window.crypto.getRandomValues)window.crypto.getRandomValues(F);else if(window.msCrypto&&window.msCrypto.getRandomValues)window.msCrypto.getRandomValues(F);else break a;sjcl2.random.addEntropy(F,1024,"crypto[\'getRandomValues\']")}}catch(a){"undefined"!==typeof window&&window.console&&(console.log("There was an error collecting entropy from the browser:"),console.log(a))}var D;var E;var F;var G;var H;sjcl2.json={defaults:{v:1,iter:1e4,ks:128,ts:64,mode:"ccm",adata:"",cipher:"aes"},ja:function(a,b,c,d){c=c||{};d=d||{};var e=sjcl2.json,f=e.g({iv:sjcl2.random.randomWords(4,0)},e.defaults),g;e.g(f,c);c=f.adata;"string"===typeof f.salt&&(f.salt=sjcl2.codec.base64.toBits(f.salt));"string"===typeof f.iv&&(f.iv=sjcl2.codec.base64.toBits(f.iv));if(!sjcl2.mode[f.mode]||!sjcl2.cipher[f.cipher]||"string"===typeof a&&100>=f.iter||64!==f.ts&&96!==f.ts&&128!==f.ts||128!==f.ks&&192!==f.ks&&256!==f.ks||2>f.iv.length||4<f.iv.length)throw new sjcl2.exception.invalid("json encrypt: invalid parameters");"string"===typeof a?(g=sjcl2.misc.cachedPbkdf2(a,f),a=g.key.slice(0,f.ks/32),f.salt=g.salt):sjcl2.ecc&&a instanceof sjcl2.ecc.elGamal.publicKey&&(g=a.kem(),f.kemtag=g.tag,a=g.key.slice(0,f.ks/32));"string"===typeof b&&(b=sjcl2.codec.utf8String.toBits(b));"string"===typeof c&&(f.adata=c=sjcl2.codec.utf8String.toBits(c));g=new sjcl2.cipher[f.cipher](a);e.g(d,f);d.key=a;f.ct="ccm"===f.mode&&sjcl2.arrayBuffer&&sjcl2.arrayBuffer.ccm&&b instanceof ArrayBuffer?sjcl2.arrayBuffer.ccm.encrypt(g,b,f.iv,c,f.ts):sjcl2.mode[f.mode].encrypt(g,b,f.iv,c,f.ts);return f},encrypt:function(a,b,c,d){var e=sjcl2.json,f=e.ja.apply(e,arguments);return e.encode(f)},ia:function(a,b,c,d){c=c||{};d=d||{};var e=sjcl2.json;b=e.g(e.g(e.g({},e.defaults),b),c,true);var f,g;f=b.adata;"string"===typeof b.salt&&(b.salt=sjcl2.codec.base64.toBits(b.salt));"string"===typeof b.iv&&(b.iv=sjcl2.codec.base64.toBits(b.iv));if(!sjcl2.mode[b.mode]||!sjcl2.cipher[b.cipher]||"string"===typeof a&&100>=b.iter||64!==b.ts&&96!==b.ts&&128!==b.ts||128!==b.ks&&192!==b.ks&&256!==b.ks||!b.iv||2>b.iv.length||4<b.iv.length)throw new sjcl2.exception.invalid("json decrypt: invalid parameters");"string"===typeof a?(g=sjcl2.misc.cachedPbkdf2(a,b),a=g.key.slice(0,b.ks/32),b.salt=g.salt):sjcl2.ecc&&a instanceof sjcl2.ecc.elGamal.secretKey&&(a=a.unkem(sjcl2.codec.base64.toBits(b.kemtag)).slice(0,b.ks/32));"string"===typeof f&&(f=sjcl2.codec.utf8String.toBits(f));g=new sjcl2.cipher[b.cipher](a);f="ccm"===b.mode&&sjcl2.arrayBuffer&&sjcl2.arrayBuffer.ccm&&b.ct instanceof ArrayBuffer?sjcl2.arrayBuffer.ccm.decrypt(g,b.ct,b.iv,b.tag,f,b.ts):sjcl2.mode[b.mode].decrypt(g,b.ct,b.iv,f,b.ts);e.g(d,b);d.key=a;return 1===c.raw?f:sjcl2.codec.utf8String.fromBits(f)},decrypt:function(a,b,c,d){var e=sjcl2.json;return e.ia(a,e.decode(b),c,d)},encode:function(a){var b,c="{",d="";for(b in a)if(a.hasOwnProperty(b)){if(!b.match(/^[a-z0-9]+$/i))throw new sjcl2.exception.invalid("json encode: invalid property name");c+=d+\'"\'+b+\'":\';d=",";switch(typeof a[b]){case"number":case"boolean":c+=a[b];break;case"string":c+=\'"\'+escape(a[b])+\'"\';break;case"object":c+=\'"\'+sjcl2.codec.base64.fromBits(a[b],0)+\'"\';break;default:throw new sjcl2.exception.bug("json encode: unsupported type")}}return c+"}"},decode:function(a){a=a.replace(/\\s/g,"");if(!a.match(/^\\{.*\\}$/))throw new sjcl2.exception.invalid("json decode: this isn\'t json!");a=a.replace(/^\\{|\\}$/g,"").split(/,/);var b={},c,d;for(c=0;c<a.length;c++){if(!(d=a[c].match(/^\\s*(?:(["\']?)([a-z][a-z0-9]*)\\1)\\s*:\\s*(?:(-?\\d+)|"([a-z0-9+\\/%*_.@=\\-]*)"|(true|false))$/i)))throw new sjcl2.exception.invalid("json decode: this isn\'t json!");null!=d[3]?b[d[2]]=parseInt(d[3],10):null!=d[4]?b[d[2]]=d[2].match(/^(ct|adata|salt|iv)$/)?sjcl2.codec.base64.toBits(d[4]):unescape(d[4]):null!=d[5]&&(b[d[2]]="true"===d[5])}return b},g:function(a,b,c){void 0===a&&(a={});if(void 0===b)return a;for(var d in b)if(b.hasOwnProperty(d)){if(c&&void 0!==a[d]&&a[d]!==b[d])throw new sjcl2.exception.invalid("required parameter overridden");a[d]=b[d]}return a},sa:function(a,b){var c={},d;for(d in a)a.hasOwnProperty(d)&&a[d]!==b[d]&&(c[d]=a[d]);return c},ra:function(a,b){var c={},d;for(d=0;d<b.length;d++)void 0!==a[b[d]]&&(c[b[d]]=a[b[d]]);return c}};sjcl2.encrypt=sjcl2.json.encrypt;sjcl2.decrypt=sjcl2.json.decrypt;sjcl2.misc.pa={};sjcl2.misc.cachedPbkdf2=function(a,b){var c=sjcl2.misc.pa,d;b=b||{};d=b.iter||1e3;c=c[a]=c[a]||{};d=c[d]=c[d]||{firstSalt:b.salt&&b.salt.length?b.salt.slice(0):sjcl2.random.randomWords(2,0)};c=void 0===b.salt?d.firstSalt:b.salt;d[c]=d[c]||sjcl2.misc.pbkdf2(a,c,b.iter);return{key:d[c].slice(0),salt:c.slice(0)}};"undefined"!==typeof module&&module.exports&&(module.exports=sjcl2);"function"===typeof define&&define([],function(){return sjcl2})}});var require_browser=__commonJS({"../../node_modules/web-worker/cjs/browser.js"(exports,module){module.exports=Worker}});var ARGUMENT_NAMES=/([^,]*)/g;function getFnParamInfo(fn){var fstr=fn.toString();const openPar=fstr.indexOf("(");const closePar=fstr.indexOf(")");const getFirstBracket=(str,offset=0)=>{const fb=offset+str.indexOf("{");if(fb<closePar&&fb>openPar){return getFirstBracket(str.slice(fb),offset+fb)}else return fb};const firstBracket=getFirstBracket(fstr);let innerMatch;if(firstBracket===-1||closePar<firstBracket)innerMatch=fstr.slice(fstr.indexOf("(")+1,fstr.indexOf(")"));else innerMatch=fstr.match(/([a-zA-Z]\\w*|\\([a-zA-Z]\\w*(,\\s*[a-zA-Z]\\w*)*\\)) =>/)?.[1];if(!innerMatch)return void 0;const matches=innerMatch.match(ARGUMENT_NAMES).filter(e=>!!e);const info=new Map;matches.forEach(v=>{let[name,value]=v.split("=");name=name.trim();name=name.replace(/\\d+$/,"");const spread=name.includes("...");name=name.replace("...","");try{if(name)info.set(name,{state:(0,eval)(`(${value})`),spread})}catch(e){info.set(name,{})}});return info}function parseFunctionFromText(method=""){let getFunctionBody=methodString=>{return methodString.replace(/^\\W*(function[^{]+\\{([\\s\\S]*)\\}|[^=]+=>[^{]*\\{([\\s\\S]*)\\}|[^=]+=>(.+))/i,"$2$3$4")};let getFunctionHead=methodString=>{let startindex=methodString.indexOf("=>")+1;if(startindex<=0){startindex=methodString.indexOf("){")}if(startindex<=0){startindex=methodString.indexOf(") {")}return methodString.slice(0,methodString.indexOf("{",startindex)+1)};let newFuncHead=getFunctionHead(method);let newFuncBody=getFunctionBody(method);let newFunc;if(newFuncHead.includes("function")){let varName=newFuncHead.split("(")[1].split(")")[0];newFunc=new Function(varName,newFuncBody)}else{if(newFuncHead.substring(0,6)===newFuncBody.substring(0,6)){let varName=newFuncHead.split("(")[1].split(")")[0];newFunc=new Function(varName,newFuncBody.substring(newFuncBody.indexOf("{")+1,newFuncBody.length-1))}else{try{newFunc=(0,eval)(newFuncHead+newFuncBody+"}")}catch{}}}return newFunc}var state={pushToState:{},data:{},triggers:{},setState(updateObj){Object.assign(state.data,updateObj);for(const prop of Object.getOwnPropertyNames(updateObj)){if(state.triggers[prop])state.triggers[prop].forEach(obj=>obj.onchange(state.data[prop]))}return state.data},subscribeTrigger(key,onchange){if(key){if(!state.triggers[key]){state.triggers[key]=[]}let l=state.triggers[key].length;state.triggers[key].push({idx:l,onchange});return state.triggers[key].length-1}else return void 0},unsubscribeTrigger(key,sub){let idx=void 0;let triggers=state.triggers[key];if(triggers){if(!sub)delete state.triggers[key];else{let obj=triggers.find(o=>{if(o.idx===sub){return true}});if(obj)triggers.splice(idx,1);return true}}},subscribeTriggerOnce(key,onchange){let sub;let changed=value=>{onchange(value);state.unsubscribeTrigger(key,sub)};sub=state.subscribeTrigger(key,changed)}};var GraphNode=class{constructor(properties={},parentNode,graph){this.nodes=new Map;this._initial={};this.state=state;this.isLooping=false;this.isAnimating=false;this.looper=void 0;this.animation=void 0;this.forward=true;this.backward=false;this.runSync=false;this.firstRun=true;this.DEBUGNODE=false;this.operator=(self2=this,origin,...args)=>{return args};this.runOp=(node=this,origin=this,...args)=>{if(node.DEBUGNODE)console.time(node.tag);let result=node.operator(node,origin,...args);if(result instanceof Promise){result.then(res=>{if(res!==void 0)this.setState({[node.tag]:res});if(node.DEBUGNODE){console.timeEnd(node.tag);if(result!==void 0)console.log(`${node.tag} result:`,result)};return res})}else{if(result!==void 0)this.setState({[node.tag]:result});if(node.DEBUGNODE){console.timeEnd(node.tag);if(result!==void 0)console.log(`${node.tag} result:`,result)};}return result};this.setOperator=operator=>{if(typeof operator!=="function")return operator;let params=getFnParamInfo(operator);let pass=false;if(params){const keys=params.keys();const paramOne=keys.next().value;const paramTwo=keys.next().value;const restrictedOne=["self","node"];const restrictedTwo=["origin","parent","graph","router"];if(paramOne)restrictedOne.forEach(a=>{if(paramOne.includes(a))pass=true});if(paramTwo)restrictedTwo.forEach(a=>{if(paramTwo.includes(a))pass=true})}if(!pass){let fn=operator;operator=(self2,origin,...args)=>{return fn(...args)}}this.operator=operator;return operator};this.run=(...args)=>{return this._run(this,void 0,...args)};this.runAsync=(...args)=>{return new Promise((res,rej)=>{res(this._run(this,void 0,...args))})};this.transformArgs=(args=[])=>args;this._run=(node=this,origin,...args)=>{if(typeof this.transformArgs==="function")args=this.transformArgs(args,node);if(!(typeof node==="object")){if(typeof node==="string"){let fnd=void 0;if(this.graph)fnd=this.graph.nodes.get(node);if(!fnd)fnd=this.nodes.get(node);node=fnd}if(!node)return void 0}if(node.firstRun){node.firstRun=false;if(!(node.children&&node.forward||node.parent&&node.backward||node.repeat||node.delay||node.frame||node.recursive||node.branch))node.runSync=true;if(node.animate&&!node.isAnimating){node.runAnimation(node.animation,args,node,origin)}if(node.loop&&typeof node.loop==="number"&&!node.isLooping){node.runLoop(node.looper,args,node,origin)}if(node.loop||node.animate)return}if(node.runSync){let res=node.runOp(node,origin,...args);return res}return new Promise(async resolve=>{if(node){let run=(node2,tick=0,...input)=>{return new Promise(async r=>{tick++;let res=await node2.runOp(node2,origin,...input);if(node2.repeat){while(tick<node2.repeat){if(node2.delay){setTimeout(async()=>{r(await run(node2,tick,...input))},node2.delay);break}else if(node2.frame&&window?.requestAnimationFrame){requestAnimationFrame(async()=>{r(await run(node2,tick,...input))});break}else res=await node2.runOp(node2,origin,...input);tick++}if(tick===node2.repeat){r(res);return}}else if(node2.recursive){while(tick<node2.recursive){if(node2.delay){setTimeout(async()=>{r(await run(node2,tick,...res))},node2.delay);break}else if(node2.frame&&window?.requestAnimationFrame){requestAnimationFrame(async()=>{r(await run(node2,tick,...res))});break}else res=await node2.runOp(node2,origin,...res);tick++}if(tick===node2.recursive){r(res);return}}else{r(res);return}})};let runnode=async()=>{let res=await run(node,void 0,...args);if(res!==void 0){if(node.backward&&node.parent instanceof GraphNode){if(Array.isArray(res))await this.runParent(node,...res);else await this.runParent(node,res)}if(node.children&&node.forward){if(Array.isArray(res))await this.runChildren(node,...res);else await this.runChildren(node,res)}if(node.branch){this.runBranch(node,res)}}return res};if(node.delay){setTimeout(async()=>{resolve(await runnode())},node.delay)}else if(node.frame&&window?.requestAnimationFrame){requestAnimationFrame(async()=>{resolve(await runnode())})}else{resolve(await runnode())}}else resolve(void 0)})};this.runParent=async(node,...args)=>{if(node.backward&&node.parent){if(typeof node.parent==="string"){if(node.graph&&node.graph?.get(node.parent)){node.parent=node.graph;if(node.parent)this.nodes.set(node.parent.tag,node.parent)}else node.parent=this.nodes.get(node.parent)}if(node.parent instanceof GraphNode)await node.parent._run(node.parent,this,...args)}};this.runChildren=async(node,...args)=>{if(typeof node.children==="object"){for(const key in node.children){if(typeof node.children[key]==="string"){if(node.graph&&node.graph?.get(node.children[key])){node.children[key]=node.graph.get(node.children[key]);if(!node.nodes.get(node.children[key].tag))node.nodes.set(node.children[key].tag,node.children[key])}if(!node.children[key]&&node.nodes.get(node.children[key]))node.children[key]=node.nodes.get(node.children[key])}else if(typeof node.children[key]==="undefined"||node.children[key]===true){if(node.graph&&node.graph?.get(key)){node.children[key]=node.graph.get(key);if(!node.nodes.get(node.children[key].tag))node.nodes.set(node.children[key].tag,node.children[key])}if(!node.children[key]&&node.nodes.get(key))node.children[key]=node.nodes.get(key)}if(node.children[key]?.runOp)await node.children[key]._run(node.children[key],node,...args)}}};this.runBranch=async(node,output)=>{if(node.branch){let keys=Object.keys(node.branch);await Promise.all(keys.map(async k=>{if(typeof node.branch[k].if==="object")node.branch[k].if=stringifyFast(node.branch[k].if);let pass=false;if(typeof node.branch[k].if==="function"){pass=node.branch[k].if(output)}else{if(typeof output==="object"){if(stringifyFast(output)===node.branch[k].if)pass=true}else if(output===node.branch[k].if)pass=true}if(pass){if(node.branch[k].then instanceof GraphNode){if(Array.isArray(output))await node.branch[k].then._run(node.branch[k].then,node,...output);else await node.branch[k].then._run(node.branch[k].then,node,...output)}else if(typeof node.branch[k].then==="function"){if(Array.isArray(output))await node.branch[k].then(...output);else await node.branch[k].then(output)}else if(typeof node.branch[k].then==="string"){if(node.graph)node.branch[k].then=node.graph.nodes.get(node.branch[k].then);else node.branch[k].then=node.nodes.get(node.branch[k].then);if(node.branch[k].then instanceof GraphNode){if(Array.isArray(output))await node.branch[k].then._run(node.branch[k].then,node,...output);else await node.branch[k].then._run(node.branch[k].then,node,...output)}}}return pass}))}};this.runAnimation=(animation=this.animation,args=[],node=this,origin)=>{this.animation=animation;if(!animation)this.animation=this.operator;if(node.animate&&!node.isAnimating&&"requestAnimationFrame"in window){node.isAnimating=true;let anim=async()=>{if(node.isAnimating){if(node.DEBUGNODE)console.time(node.tag);let result=this.animation(node,origin,...args);if(result instanceof Promise){result=await result}if(node.DEBUGNODE){console.timeEnd(node.tag);if(result!==void 0)console.log(`${node.tag} result:`,result)};if(result!==void 0){if(this.tag)this.setState({[this.tag]:result});if(node.backward&&node.parent?._run){if(Array.isArray(result))await this.runParent(node,...result);else await this.runParent(node,result)}if(node.children&&node.forward){if(Array.isArray(result))await this.runChildren(node,...result);else await this.runChildren(node,result)}if(node.branch){this.runBranch(node,result)}this.setState({[node.tag]:result})}requestAnimationFrame(anim)}};requestAnimationFrame(anim)}};this.runLoop=(loop=this.looper,args=[],node=this,origin,timeout=node.loop)=>{node.looper=loop;if(!loop)node.looper=node.operator;if(typeof timeout==="number"&&!node.isLooping){node.isLooping=true;let looping=async()=>{if(node.isLooping){if(node.DEBUGNODE)console.time(node.tag);let result=node.looper(node,origin,...args);if(result instanceof Promise){result=await result}if(node.DEBUGNODE){console.timeEnd(node.tag);if(result!==void 0)console.log(`${node.tag} result:`,result)};if(result!==void 0){if(node.tag)node.setState({[node.tag]:result});if(node.backward&&node.parent?._run){if(Array.isArray(result))await this.runParent(node,...result);else await this.runParent(node,result)}if(node.children&&node.forward){if(Array.isArray(result))await this.runChildren(node,...result);else await this.runChildren(node,result)}if(node.branch){this.runBranch(node,result)}node.setState({[node.tag]:result})}setTimeout(async()=>{await looping()},timeout)}};looping()}};this.setParent=parent=>{this.parent=parent;if(this.backward)this.runSync=false};this.setChildren=children=>{this.children=children;if(this.forward)this.runSync=false};this.add=(node={})=>{if(typeof node==="function")node={operator:node};if(!(node instanceof GraphNode))node=new GraphNode(node,this,this.graph);this.nodes.set(node.tag,node);if(this.graph){this.graph.nodes.set(node.tag,node);this.graph.nNodes=this.graph.nodes.size}return node};this.remove=node=>{if(typeof node==="string")node=this.nodes.get(node);if(node instanceof GraphNode){this.nodes.delete(node.tag);if(this.children[node.tag])delete this.children[node.tag];if(this.graph){this.graph.nodes.delete(node.tag);this.graph.nNodes=this.graph.nodes.size}this.nodes.forEach(n=>{if(n.nodes.get(node.tag)){n.nodes.delete(node.tag);if(n.children[node.tag])delete n.children[node.tag];if(n.parent?.tag===node.tag)delete n.parent}});if(node.ondelete)node.ondelete(node)}};this.append=(node,parentNode=this)=>{if(typeof node==="string")node=this.nodes.get(node);if(node instanceof GraphNode){parentNode.addChildren(node);if(node.forward)node.runSync=false}};this.subscribe=(callback,tag=this.tag)=>{if(callback instanceof GraphNode){return this.subscribeNode(callback)}else return this.state.subscribeTrigger(tag,callback)};this.unsubscribe=(sub,tag=this.tag)=>{this.state.unsubscribeTrigger(tag,sub)};this.addChildren=children=>{if(!this.children)this.children={};if(typeof children==="object"){Object.assign(this.children,children)}this.convertChildrenToNodes();if(this.forward)this.runSync=false};this.callParent=(...args)=>{const origin=this;if(typeof this.parent==="string"){if(this.graph&&this.graph?.get(this.parent)){this.parent=this.graph;if(this.parent)this.nodes.set(this.parent.tag,this.parent)}else this.parent=this.nodes.get(this.parent)}if(typeof this.parent?.operator==="function")return this.parent.runOp(this.parent,origin,...args)};this.callChildren=(idx,...args)=>{const origin=this;let result;if(typeof this.children==="object"){for(const key in this.children){if(this.children[key]?.runOp)this.children[key].runOp(this.children[key],origin,...args)}}return result};this.getProps=(node=this)=>{return{tag:node.tag,operator:node.operator,graph:node.graph,children:node.children,parent:node.parent,forward:node.forward,backward:node.bacward,loop:node.loop,animate:node.animate,frame:node.frame,delay:node.delay,recursive:node.recursive,repeat:node.repeat,branch:node.branch,oncreate:node.oncreate,DEBUGNODE:node.DEBUGNODE,...this._initial}};this.setProps=(props={})=>{let tmp=Object.assign({},props);if(tmp.children){this.addChildren(props.children);delete tmp.children}if(tmp.operator){this.setOperator(props.operator);delete tmp.operator}Object.assign(tmp,props);if(!(this.children&&this.forward||this.parent&&this.backward||this.repeat||this.delay||this.frame||this.recursive))this.runSync=true};this.removeTree=node=>{if(node){if(typeof node==="string")node=this.nodes.get(node)}if(node instanceof GraphNode){let checked={};const recursivelyRemove=node2=>{if(typeof node2.children==="object"&&!checked[node2.tag]){checked[node2.tag]=true;for(const key in node2.children){if(node2.children[key].stopNode)node2.children[key].stopNode();if(node2.children[key].tag){if(this.nodes.get(node2.children[key].tag))this.nodes.delete(node2.children[key].tag);this.nodes.forEach(n=>{if(n.nodes.get(node2.children[key].tag))n.nodes.delete(node2.children[key].tag);if(n.children[key]instanceof GraphNode)delete n.children[key]});recursivelyRemove(node2.children[key])}}}};if(node.stopNode)node.stopNode();if(node.tag){this.nodes.delete(node.tag);if(this.children[node.tag])delete this.children[node.tag];if(this.parent?.tag===node.tag)delete this.parent;if(this[node.tag]instanceof GraphNode)delete this[node.tag];this.nodes.forEach(n=>{if(node?.tag){if(n.nodes.get(node.tag))n.nodes.delete(node.tag);if(n.children[node.tag]instanceof GraphNode)delete n.children[node.tag]}});recursivelyRemove(node);if(this.graph)this.graph.removeTree(node,checked);else if(node.ondelete)node.ondelete(node)}}};this.checkNodesHaveChildMapped=(node,child,checked={})=>{let tag=node.tag;if(!tag)tag=node.name;if(!checked[tag]){checked[tag]=true;if(node.children){if(child.tag in node.children){if(node.children[child.tag]instanceof GraphNode){if(!node.nodes.get(child.tag))node.nodes.set(child.tag,child);node.children[child.tag]=child;if(!node.firstRun)node.firstRun=true}}}if(node.parent instanceof GraphNode){if(node.nodes.get(child.tag)&&!node.parent.nodes.get(child.tag))node.parent.nodes.set(child.tag,child);if(node.parent.children){this.checkNodesHaveChildMapped(node.parent,child,checked)}else if(node.nodes){node.nodes.forEach(n=>{if(!checked[n.tag]){this.checkNodesHaveChildMapped(n,child,checked)}})}}if(node.graph){if(node.parent&&node.parent.name!==node.graph.name){node.graph.nodes.forEach(n=>{if(!checked[n.tag]){this.checkNodesHaveChildMapped(n,child,checked)}})}}}};this.convertChildrenToNodes=(n=this)=>{if(n?.children){for(const key in n.children){if(!(n.children[key]instanceof GraphNode)){if(typeof n.children[key]==="object"){if(!n.children[key].tag)n.children[key].tag=key;if(!n.nodes.get(n.children[key].tag)){n.children[key]=new GraphNode(n.children[key],n,n.graph);this.checkNodesHaveChildMapped(n,n.children[key])}}else{if(typeof n.children[key]==="undefined"||n.children[key]==true){n.children[key]=n.graph.get(key);if(!n.children[key])n.children[key]=n.nodes.get(key)}else if(typeof n.children[key]==="string"){let k=n.children[key];n.children[key]=n.graph.get(k);if(!n.children[key])n.children[key]=n.nodes.get(key)}if(n.children[key]instanceof GraphNode){if(n.graph){let props=n.children[key].getProps();delete props.parent;delete props.graph;if(n.source instanceof Graph){n.children[key]=new GraphNode(props,n,n.source)}else{n.children[key]=new GraphNode(props,n,n.graph)}}n.nodes.set(n.children[key].tag,n.children[key]);this.checkNodesHaveChildMapped(n,n.children[key]);if(!(n.children[key].tag in n))n[n.children[key].tag]=n.children[key]}}}}}return n.children};this.stopLooping=(node=this)=>{node.isLooping=false};this.stopAnimating=(node=this)=>{node.isAnimating=false};this.stopNode=(node=this)=>{node.stopAnimating(node);node.stopLooping(node)};this.subscribeNode=node=>{if(node.tag)this.nodes.set(node.tag,node);return this.state.subscribeTrigger(this.tag,res=>{node._run(node,this,res)})};this.print=(node=this,printChildren=true,nodesPrinted=[])=>{let dummyNode=new GraphNode;if(typeof node==="string")node=this.nodes.get(node);if(node instanceof GraphNode){nodesPrinted.push(node.tag);let jsonToPrint={tag:node.tag,operator:node.operator.toString()};if(node.parent)jsonToPrint.parent=node.parent.tag;if(typeof node.children==="object"){for(const key in node.children){if(typeof node.children[key]==="string")return node.children[key];if(nodesPrinted.includes(node.children[key].tag))return node.children[key].tag;else if(!printChildren){return node.children[key].tag}else return node.children[key].print(node.children[key],printChildren,nodesPrinted)}}for(const prop in node){if(prop==="parent"||prop==="children")continue;if(typeof dummyNode[prop]==="undefined"){if(typeof node[prop]==="function"){jsonToPrint[prop]=node[prop].toString()}else if(typeof node[prop]==="object"){jsonToPrint[prop]=JSON.stringifyWithCircularRefs(node[prop])}else{jsonToPrint[prop]=node[prop]}}}return JSON.stringify(jsonToPrint)}};this.reconstruct=json=>{let parsed=reconstructObject(json);if(parsed)return this.add(parsed)};this.setState=this.state.setState;this.DEBUGNODES=(debugging=true)=>{this.DEBUGNODE=debugging;this.nodes.forEach(n=>{if(debugging)n.DEBUGNODE=true;else n.DEBUGNODE=false})};if(typeof properties==="function"){properties={operator:properties}}if(typeof properties==="object"){if(properties instanceof GraphNode&&properties._initial)Object.assign(properties,properties._initial);if(properties instanceof Graph){let source=properties;properties={source,operator:input=>{if(typeof input==="object"){let result={};for(const key in input){if(typeof source[key]==="function"){if(Array.isArray(input[key]))result[key]=source[key](...input[key]);else result[key]=source[key](input[key])}else{source[key]=input[key];result[key]=source[key]}}return result}return source}};if(source.operator)properties.operator=source.operator;if(source.children)properties.children=source.children;if(source.forward)properties.forward=source.forward;if(source.backward)properties.backward=source.backward;if(source.repeat)properties.repeat=source.repeat;if(source.recursive)properties.recursive=source.recursive;if(source.loop)properties.loop=source.loop;if(source.animate)properties.animate=source.animate;if(source.looper)properties.looper=source.looper;if(source.animation)properties.animation=source.animation;if(source.delay)properties.delay=source.delay;if(source.tag)properties.tag=source.tag;if(source.oncreate)properties.oncreate=source.oncreate;if(source.node){if(source.node._initial)Object.assign(properties,source.node._initial)}if(source._initial)Object.assign(properties,source._initial);this.nodes=source.nodes;source.node=this;if(graph){source.nodes.forEach(n=>{if(!graph.nodes.get(n.tag)){graph.nodes.set(n.tag,n);graph.nNodes++}})}}if(properties.tag&&(graph||parentNode)){let hasnode;if(graph?.nodes){hasnode=graph.nodes.get(properties.tag)}if(!hasnode&&parentNode?.nodes){hasnode=parentNode.nodes.get(properties.tag)}if(hasnode){Object.assign(this,hasnode);if(!this.source)this.source=hasnode;let props=hasnode.getProps();delete props.graph;delete props.parent;Object.assign(properties,props)}}if(properties?.operator){properties.operator=this.setOperator(properties.operator)}if(!properties.tag&&graph){properties.tag=`node${graph.nNodes}`}else if(!properties.tag){properties.tag=`node${Math.floor(Math.random()*1e10)}`}let keys=Object.getOwnPropertyNames(this);for(const key in properties){if(!keys.includes(key))this._initial[key]=properties[key]}if(properties.children)this._initial.children=Object.assign({},properties.children);Object.assign(this,properties);if(!this.tag){if(graph){this.tag=`node${graph.nNodes}`}else{this.tag=`node${Math.floor(Math.random()*1e10)}`}}if(graph){this.graph=graph;if(graph.nodes.get(this.tag)){this.tag=`${this.tag}${graph.nNodes+1}`}graph.nodes.set(this.tag,this);graph.nNodes++}if(parentNode){this.parent=parentNode;if(parentNode instanceof GraphNode||parentNode instanceof Graph)parentNode.nodes.set(this.tag,this)}if(typeof properties.tree==="object"){for(const key in properties.tree){if(typeof properties.tree[key]==="object"){if((!properties.tree[key]).tag){properties.tree[key].tag=key}}let node=new GraphNode(properties.tree[key],this,graph);this.nodes.set(node.tag,node)}}if(this.children)this.convertChildrenToNodes(this);if(this.parent instanceof GraphNode||this.parent instanceof Graph)this.checkNodesHaveChildMapped(this.parent,this);if(typeof this.oncreate==="function")this.oncreate(this);if(!this.firstRun)this.firstRun=true}else return properties}};var Graph=class{constructor(tree,tag,props){this.nNodes=0;this.nodes=new Map;this.state=state;this.tree={};this.add=(node={})=>{let props=node;if(!(node instanceof GraphNode))node=new GraphNode(props,this,this);else{this.nNodes=this.nodes.size;if(node.tag){this.tree[node.tag]=props;this.nodes.set(node.tag,node)}}return node};this.setTree=(tree=this.tree)=>{if(!tree)return;for(const node in tree){if(!this.nodes.get(node)){if(typeof tree[node]==="function"){this.add({tag:node,operator:tree[node]})}else if(typeof tree[node]==="object"&&!Array.isArray(tree[node])){if(!tree[node].tag)tree[node].tag=node;let newNode=this.add(tree[node]);if(tree[node].aliases){tree[node].aliases.forEach(a=>{this.nodes.set(a,newNode)})}}else{this.add({tag:node,operator:(self2,origin,...args)=>{return tree[node]}})}}else{let n=this.nodes.get(node);if(typeof tree[node]==="function"){n.setOperator(tree[node])}else if(typeof tree[node]==="object"){if(tree[node]instanceof GraphNode){this.add(tree[node])}else if(tree[node]instanceof Graph){let source=tree[node];let properties={};if(source.operator)properties.operator=source.operator;if(source.children)properties.children=source.children;if(source.forward)properties.forward=source.forward;if(source.backward)properties.backward=source.backward;if(source.repeat)properties.repeat=source.repeat;if(source.recursive)properties.recursive=source.recursive;if(source.loop)properties.loop=source.loop;if(source.animate)properties.animate=source.animate;if(source.looper)properties.looper=source.looper;if(source.animation)properties.animation=source.animation;if(source.delay)properties.delay=source.delay;if(source.tag)properties.tag=source.tag;if(source.oncreate)properties.oncreate=source.oncreate;if(source.node?._initial)Object.assign(properties,source.node._initial);properties.nodes=source.nodes;properties.source=source;n.setProps(properties)}else{n.setProps(tree[node])}}}}this.nodes.forEach(node=>{if(typeof node.children==="object"){for(const key in node.children){if(typeof node.children[key]==="string"){if(this.nodes.get(node.children[key])){node.children[key]=this.nodes.get(node.children[key])}}else if(node.children[key]===true||typeof node.children[key]==="undefined"){if(this.nodes.get(key)){node.children[key]=this.nodes.get(key)}}if(node.children[key]instanceof GraphNode){node.checkNodesHaveChildMapped(node,node.children[key])}}}if(typeof node.parent==="string"){if(this.nodes.get(node.parent)){node.parent=this.nodes.get(node.parent);node.nodes.set(node.parent.tag,node.parent)}}})};this.get=tag=>{return this.nodes.get(tag)};this.set=node=>{return this.nodes.set(node.tag,node)};this.run=(node,...args)=>{if(typeof node==="string")node=this.nodes.get(node);if(node instanceof GraphNode)return node._run(node,this,...args);else return void 0};this.runAsync=(node,...args)=>{if(typeof node==="string")node=this.nodes.get(node);if(node instanceof GraphNode)return new Promise((res,rej)=>{res(node._run(node,this,...args))});else return new Promise((res,rej)=>{res(void 0)})};this._run=(node,origin=this,...args)=>{if(typeof node==="string")node=this.nodes.get(node);if(node instanceof GraphNode)return node._run(node,origin,...args);else return void 0};this.removeTree=(node,checked)=>{if(typeof node==="string")node=this.nodes.get(node);if(node instanceof GraphNode){if(!checked)checked={};const recursivelyRemove=node2=>{if(node2.children&&!checked[node2.tag]){checked[node2.tag]=true;if(Array.isArray(node2.children)){node2.children.forEach(c=>{if(c.stopNode)c.stopNode();if(c.tag){if(this.nodes.get(c.tag))this.nodes.delete(c.tag)}this.nodes.forEach(n=>{if(n.nodes.get(c.tag))n.nodes.delete(c.tag)});recursivelyRemove(c)})}else if(typeof node2.children==="object"){if(node2.stopNode)node2.stopNode();if(node2.tag){if(this.nodes.get(node2.tag))this.nodes.delete(node2.tag)}this.nodes.forEach(n=>{if(n.nodes.get(node2.tag))n.nodes.delete(node2.tag)});recursivelyRemove(node2)}}};if(node.stopNode)node.stopNode();if(node.tag){this.nodes.delete(node.tag);this.nodes.forEach(n=>{if(n.nodes.get(node.tag))n.nodes.delete(node.tag)});this.nNodes=this.nodes.size;recursivelyRemove(node)}if(node.ondelete)node.ondelete(node)}return node};this.remove=node=>{if(typeof node==="string")node=this.nodes.get(node);if(node instanceof GraphNode){node.stopNode();if(node?.tag){if(this.nodes.get(node.tag)){this.nodes.delete(node.tag);this.nodes.forEach(n=>{if(n.nodes.get(node.tag))n.nodes.delete(node.tag)})}}if(node.ondelete)node.ondelete(node)}return node};this.append=(node,parentNode)=>{parentNode.addChildren(node)};this.callParent=async(node,origin=node,...args)=>{if(node?.parent){return await node.callParent(node,origin,...args)}};this.callChildren=async(node,idx,...args)=>{if(node?.children){return await node.callChildren(idx,...args)}};this.subscribe=(node,callback)=>{if(!callback)return;if(node instanceof GraphNode){return node.subscribe(callback)}else if(typeof node=="string")return this.state.subscribeTrigger(node,callback)};this.unsubscribe=(tag,sub)=>{this.state.unsubscribeTrigger(tag,sub)};this.subscribeNode=(inputNode,outputNode)=>{let tag;if(inputNode?.tag)tag=inputNode.tag;else if(typeof inputNode==="string")tag=inputNode;return this.state.subscribeTrigger(tag,res=>{this.run(outputNode,inputNode,...res)})};this.stopNode=node=>{if(typeof node==="string"){node=this.nodes.get(node)}if(node instanceof GraphNode){node.stopNode()}};this.print=(node=void 0,printChildren=true)=>{if(node instanceof GraphNode)return node.print(node,printChildren);else{let printed=`{`;this.nodes.forEach(n=>{printed+=`\n"${n.tag}:${n.print(n,printChildren)}"`});return printed}};this.reconstruct=json=>{let parsed=reconstructObject(json);if(parsed)return this.add(parsed)};this.create=(operator,parentNode,props)=>{return createNode(operator,parentNode,props,this)};this.setState=this.state.setState;this.DEBUGNODES=(debugging=true)=>{this.nodes.forEach(n=>{if(debugging)n.DEBUGNODE=true;else n.DEBUGNODE=false})};this.tag=tag?tag:`graph${Math.floor(Math.random()*1e11)}`;if(props){Object.assign(this,props);this._initial=props}if(tree||Object.keys(this.tree).length>0)this.setTree(tree)}};function reconstructObject(json="{}"){try{let parsed=typeof json==="string"?JSON.parse(json):json;const parseObj=obj=>{for(const prop in obj){if(typeof obj[prop]==="string"){let funcParsed=parseFunctionFromText(obj[prop]);if(typeof funcParsed==="function"){obj[prop]=funcParsed}}else if(typeof obj[prop]==="object"){parseObj(obj[prop])}}return obj};return parseObj(parsed)}catch(err){console.error(err);return void 0}}var stringifyWithCircularRefs=function(){const refs=new Map;const parents=[];const path=["this"];function clear(){refs.clear();parents.length=0;path.length=1}function updateParents(key,value){var idx=parents.length-1;var prev=parents[idx];if(typeof prev==="object"){if(prev[key]===value||idx===0){path.push(key);parents.push(value.pushed)}else{while(idx-->=0){prev=parents[idx];if(typeof prev==="object"){if(prev[key]===value){idx+=2;parents.length=idx;path.length=idx;--idx;parents[idx]=value;path[idx]=key;break}}idx--}}}}function checkCircular(key,value){if(value!=null){if(typeof value==="object"){if(key){updateParents(key,value)}let other=refs.get(value);if(other){return"[Circular Reference]"+other}else{refs.set(value,path.join("."))}}}return value}return function stringifyWithCircularRefs2(obj,space){try{parents.push(obj);return JSON.stringify(obj,checkCircular,space)}finally{clear()}}}();if(JSON.stringifyWithCircularRefs===void 0){JSON.stringifyWithCircularRefs=stringifyWithCircularRefs}var stringifyFast=function(){const refs=new Map;const parents=[];const path=["this"];function clear(){refs.clear();parents.length=0;path.length=1}function updateParents(key,value){var idx=parents.length-1;if(parents[idx]){var prev=parents[idx];if(typeof prev==="object"){if(prev[key]===value||idx===0){path.push(key);parents.push(value.pushed)}else{while(idx-->=0){prev=parents[idx];if(typeof prev==="object"){if(prev[key]===value){idx+=2;parents.length=idx;path.length=idx;--idx;parents[idx]=value;path[idx]=key;break}}idx++}}}}}function checkValues(key,value){let val;if(value!=null){if(typeof value==="object"){let c=value.constructor.name;if(key&&c==="Object"){updateParents(key,value)}let other=refs.get(value);if(other){return"[Circular Reference]"+other}else{refs.set(value,path.join("."))}if(c==="Array"){if(value.length>20){val=value.slice(value.length-20)}else val=value}else if(c.includes("Set")){val=Array.from(value)}else if(c!=="Object"&&c!=="Number"&&c!=="String"&&c!=="Boolean"){val="instanceof_"+c}else if(c==="Object"){let obj={};for(const prop in value){if(value[prop]==null){obj[prop]=value[prop]}else if(Array.isArray(value[prop])){if(value[prop].length>20)obj[prop]=value[prop].slice(value[prop].length-20);else obj[prop]=value[prop]}else if(value[prop].constructor.name==="Object"){obj[prop]={};for(const p in value[prop]){if(Array.isArray(value[prop][p])){if(value[prop][p].length>20)obj[prop][p]=value[prop][p].slice(value[prop][p].length-20);else obj[prop][p]=value[prop][p]}else{if(value[prop][p]!=null){let con=value[prop][p].constructor.name;if(con.includes("Set")){obj[prop][p]=Array.from(value[prop][p])}else if(con!=="Number"&&con!=="String"&&con!=="Boolean"){obj[prop][p]="instanceof_"+con}else{obj[prop][p]=value[prop][p]}}else{obj[prop][p]=value[prop][p]}}}}else{let con=value[prop].constructor.name;if(con.includes("Set")){obj[prop]=Array.from(value[prop])}else if(con!=="Number"&&con!=="String"&&con!=="Boolean"){obj[prop]="instanceof_"+con}else{obj[prop]=value[prop]}}}val=obj}else{val=value}}else{val=value}}return val}return function stringifyFast2(obj,space){parents.push(obj);let res=JSON.stringify(obj,checkValues,space);clear();return res}}();if(JSON.stringifyFast===void 0){JSON.stringifyFast=stringifyFast}function createNode(operator,parentNode,props,graph){if(typeof props==="object"){props.operator=operator;return new GraphNode(props,parentNode,graph)}return new GraphNode({operator},parentNode,graph)}var Service=class extends Graph{constructor(options={}){super(void 0,options.name?options.name:`service${Math.floor(Math.random()*1e14)}`,options.props);this.routes={};this.loadDefaultRoutes=false;this.keepState=true;this.firstLoad=true;this.init=options=>{if(options)options=Object.assign({},options);else options={};if(options.customRoutes)Object.assign(options.customRoutes,this.customRoutes);else options.customRoutes=this.customRoutes;if(options.customChildren)Object.assign(options.customChildren,this.customChildren);else options.customChildren=this.customChildren;if(Array.isArray(options.routes)){options.routes.forEach(r=>{this.load(r,options.includeClassName,options.routeFormat,options.customRoutes,options.customChildren)})}else if(options.routes||(Object.keys(this.routes).length>0||this.loadDefaultRoutes)&&this.firstLoad)this.load(options.routes,options.includeClassName,options.routeFormat,options.customRoutes,options.customChildren)};this.load=(routes,includeClassName=true,routeFormat=".",customRoutes,customChildren)=>{if(!routes&&!this.loadDefaultRoutes&&(Object.keys(this.routes).length>0||this.firstLoad))return;if(this.firstLoad)this.firstLoad=false;if(customRoutes)customRoutes=Object.assign(this.customRoutes,customRoutes);else customRoutes=this.customRoutes;if(customChildren)customChildren=Object.assign(this.customChildren,customChildren);let service;let allRoutes={};if(routes){if(!(routes instanceof Graph)&&routes?.name){if(routes.module){let mod=routes;routes={};Object.getOwnPropertyNames(routes.module).forEach(prop=>{if(includeClassName)routes[mod.name+routeFormat+prop]=routes.module[prop];else routes[prop]=routes.module[prop]})}else if(typeof routes==="function"){service=new routes({loadDefaultRoutes:this.loadDefaultRoutes});service.load();routes=service.routes}}else if(routes instanceof Graph||routes.source instanceof Graph){service=routes;routes={};let name;if(includeClassName){name=service.name;if(!name){name=service.tag;service.name=name}if(!name){name=`graph${Math.floor(Math.random()*1e15)}`;service.name=name;service.tag=name}}if(service.customRoutes&&!this.customRoutes)this.customRoutes=service.customRoutes;else if(service.customRoutes&&this.customRoutes)Object.assign(this.customRoutes,service.customRoutes);if(service.customChildren&&!this.customChildren)this.customChildren=service.customChildren;else if(service.customChildren&&this.customChildren)Object.assign(this.customChildren,service.customChildren);service.nodes.forEach(node=>{routes[node.tag]=node;let checked={};let checkChildGraphNodes=(nd,par)=>{if(!checked[nd.tag]||par&&includeClassName&&!checked[par?.tag+routeFormat+nd.tag]){if(!par)checked[nd.tag]=true;else checked[par.tag+routeFormat+nd.tag]=true;if(nd instanceof Graph||nd.source instanceof Graph){if(includeClassName){let nm=nd.name;if(!nm){nm=nd.tag;nd.name=nm}if(!nm){nm=`graph${Math.floor(Math.random()*1e15)}`;nd.name=nm;nd.tag=nm}}nd.nodes.forEach(n=>{if(includeClassName&&!routes[nd.tag+routeFormat+n.tag])routes[nd.tag+routeFormat+n.tag]=n;else if(!routes[n.tag])routes[n.tag]=n;checkChildGraphNodes(n,nd)})}}};checkChildGraphNodes(node)})}else if(typeof routes==="object"){let name=routes.constructor.name;if(name==="Object"){name=Object.prototype.toString.call(routes);if(name)name=name.split(" ")[1];if(name)name=name.split("]")[0]}if(name&&name!=="Object"){let module=routes;routes={};Object.getOwnPropertyNames(module).forEach(route=>{if(includeClassName)routes[name+routeFormat+route]=module[route];else routes[route]=module[route]})}}if(service instanceof Graph&&service.name&&includeClassName){routes=Object.assign({},routes);for(const prop in routes){let route=routes[prop];delete routes[prop];routes[service.name+routeFormat+prop]=route}}}if(this.loadDefaultRoutes){let rts=Object.assign({},this.defaultRoutes);if(routes){Object.assign(rts,this.routes);routes=Object.assign(rts,routes)}else routes=Object.assign(rts,this.routes);this.loadDefaultRoutes=false}if(!routes)routes=this.routes;let incr=0;for(const tag in routes){incr++;let childrenIter=(route,routeKey)=>{if(typeof route==="object"){if(!route.tag)route.tag=routeKey;if(typeof route?.children==="object"){nested:for(const key in route.children){incr++;if(typeof route.children[key]==="object"){let rt=route.children[key];if(rt.tag&&allRoutes[rt.tag])continue;if(customChildren){for(const k2 in customChildren){rt=customChildren[k2](rt,key,route,routes,allRoutes);if(!rt)continue nested}}if(rt.id&&!rt.tag){rt.tag=rt.id}let k;if(rt.tag){if(allRoutes[rt.tag]){let randkey=`${rt.tag}${incr}`;allRoutes[randkey]=rt;rt.tag=randkey;childrenIter(allRoutes[randkey],key);k=randkey}else{allRoutes[rt.tag]=rt;childrenIter(allRoutes[rt.tag],key);k=rt.tag}}else{if(allRoutes[key]){let randkey=`${key}${incr}`;allRoutes[randkey]=rt;rt.tag=randkey;childrenIter(allRoutes[randkey],key);k=randkey}else{allRoutes[key]=rt;childrenIter(allRoutes[key],key);k=key}}if(service?.name&&includeClassName){allRoutes[service.name+routeFormat+k]=rt;delete allRoutes[k]}else allRoutes[k]=rt}}}}};allRoutes[tag]=routes[tag];childrenIter(routes[tag],tag)}top:for(const route in allRoutes){if(typeof allRoutes[route]==="object"){let r=allRoutes[route];if(typeof r==="object"){if(customRoutes){for(const key in customRoutes){r=customRoutes[key](r,route,allRoutes);if(!r)continue top}}if(r.get){if(typeof r.get=="object"){}}if(r.post){}if(r.delete){}if(r.put){}if(r.head){}if(r.patch){}if(r.options){}if(r.connect){}if(r.trace){}if(r.post&&!r.operator){allRoutes[route].operator=r.post}else if(!r.operator&&typeof r.get=="function"){allRoutes[route].operator=r.get}}}}for(const route in routes){if(typeof routes[route]==="object"){if(this.routes[route]){if(typeof this.routes[route]==="object")Object.assign(this.routes[route],routes[route]);else this.routes[route]=routes[route]}else this.routes[route]=routes[route]}else if(this.routes[route]){if(typeof this.routes[route]==="object")Object.assign(this.routes[route],routes[route]);else this.routes[route]=routes[route]}else this.routes[route]=routes[route]}if(service){for(const key in this.routes){if(this.routes[key]instanceof GraphNode){this.nodes.set(key,this.routes[key]);this.nNodes=this.nodes.size}}}else this.setTree(this.routes);for(const prop in this.routes){if(this.routes[prop]?.aliases){let aliases=this.routes[prop].aliases;aliases.forEach(a=>{if(service?.name&&includeClassName)routes[service.name+routeFormat+a]=this.routes[prop];else routes[a]=this.routes[prop]})}}return this.routes};this.unload=(routes=this.routes)=>{if(!routes)return;let service;if(!(routes instanceof Service)&&typeof routes==="function"){service=new Service;routes=service.routes}else if(routes instanceof Service){routes=routes.routes}for(const r in routes){delete this.routes[r];if(this.nodes.get(r))this.remove(r)}return this.routes};this.handleMethod=(route,method,args,origin)=>{let m=method.toLowerCase();if(m==="get"&&this.routes[route]?.get?.transform instanceof Function){if(Array.isArray(args))return this.routes[route].get.transform(...args);else return this.routes[route].get.transform(args)}if(this.routes[route]?.[m]){if(!(this.routes[route][m]instanceof Function)){if(args)this.routes[route][m]=args;return this.routes[route][m]}else return this.routes[route][m](args)}else return this.handleServiceMessage({route,args,method,origin})};this.transmit=(...args)=>{if(typeof args[0]==="object"){if(args[0].method){return this.handleMethod(args[0].route,args[0].method,args[0].args)}else if(args[0].route){return this.handleServiceMessage(args[0])}else if(args[0].node){return this.handleGraphNodeCall(args[0].node,args[0].args,args[0].origin)}else if(this.keepState){if(args[0].route)this.setState({[args[0].route]:args[0].args});if(args[0].node)this.setState({[args[0].node]:args[0].args})}return args}else return args};this.receive=(...args)=>{if(args[0]){if(typeof args[0]==="string"){let substr=args[0].substring(0,8);if(substr.includes("{")||substr.includes("[")){if(substr.includes("\\\\"))args[0]=args[0].replace(/\\\\/g,"");if(args[0][0]===\'"\'){args[0]=args[0].substring(1,args[0].length-1)};args[0]=JSON.parse(args[0])}}}if(typeof args[0]==="object"){if(args[0].method){return this.handleMethod(args[0].route,args[0].method,args[0].args)}else if(args[0].route){return this.handleServiceMessage(args[0])}else if(args[0].node){return this.handleGraphNodeCall(args[0].node,args[0].args,args[0].origin)}else if(this.keepState){if(args[0].route)this.setState({[args[0].route]:args[0].args});if(args[0].node)this.setState({[args[0].node]:args[0].args})}return args}else return args};this.pipe=(source,destination,endpoint,origin,method,callback)=>{if(source instanceof GraphNode){if(callback)return source.subscribe(res=>{let mod=callback(res);if(mod!==void 0)this.transmit({route:destination,args:mod,origin,method});else this.transmit({route:destination,args:res,origin,method},endpoint)});else return this.subscribe(source,res=>{this.transmit({route:destination,args:res,origin,method},endpoint)})}else if(typeof source==="string")return this.subscribe(source,res=>{this.transmit({route:destination,args:res,origin,method},endpoint)})};this.pipeOnce=(source,destination,endpoint,origin,method,callback)=>{if(source instanceof GraphNode){if(callback)return source.state.subscribeTriggerOnce(source.tag,res=>{let mod=callback(res);if(mod!==void 0)this.transmit({route:destination,args:mod,origin,method});else this.transmit({route:destination,args:res,origin,method},endpoint)});else return this.state.subscribeTriggerOnce(source.tag,res=>{this.transmit({route:destination,args:res,origin,method},endpoint)})}else if(typeof source==="string")return this.state.subscribeTriggerOnce(source,res=>{this.transmit({route:destination,args:res,origin,method},endpoint)})};this.terminate=(...args)=>{this.nodes.forEach(n=>{n.stopNode()})};this.recursivelyAssign=(target,obj)=>{for(const key in obj){if(typeof obj[key]==="object"){if(typeof target[key]==="object")this.recursivelyAssign(target[key],obj[key]);else target[key]=this.recursivelyAssign({},obj[key])}else target[key]=obj[key]}return target};this.defaultRoutes={"/":{get:()=>{return this.print()},aliases:[""]},ping:()=>{console.log("ping");return"pong"},echo:(...args)=>{this.transmit(...args);return args},assign:source=>{if(typeof source==="object"){Object.assign(this,source);return true}return false},recursivelyAssign:source=>{if(typeof source==="object"){this.recursivelyAssign(this,source);return true}return false},log:{post:(...args)=>{console.log("Log: ",...args)},aliases:["info"]},error:message=>{let er=new Error(message);console.error(message);return er},state:key=>{if(key){return this.state.data[key]}else return this.state.data},printState:key=>{if(key){return stringifyWithCircularRefs(this.state.data[key])}else return stringifyWithCircularRefs(this.state.data)},transmit:this.transmit,receive:this.receive,load:this.load,unload:this.unload,pipe:this.pipe,terminate:this.terminate,run:this.run,_run:this._run,subscribe:this.subscribe,unsubscribe:this.unsubscribe,stopNode:this.stopNode,get:this.get,add:this.add,remove:this.remove,setTree:this.setTree,setState:this.setState,print:this.print,reconstruct:this.reconstruct,handleMethod:this.handleMethod,handleServiceMessage:this.handleServiceMessage,handleGraphNodeCall:this.handleGraphNodeCall};if(options.name)this.name=options.name;else options.name=this.tag;if("loadDefaultRoutes"in options){this.loadDefaultRoutes=options.loadDefaultRoutes;this.routes=Object.assign(this.defaultRoutes,this.routes)}if(options||Object.keys(this.routes).length>0)this.init(options)}handleServiceMessage(message){let call;if(typeof message==="object"){if(message.route)call=message.route;else if(message.node)call=message.node}if(call){if(message.origin){if(Array.isArray(message.args))return this._run(call,message.origin,...message.args);else return this._run(call,message.origin,message.args)}else{if(Array.isArray(message.args))return this.run(call,...message.args);else return this.run(call,message.args)}}else return message}handleGraphNodeCall(route,args,origin){if(!route)return args;if(args?.args){this.handleServiceMessage(args)}else if(origin){if(Array.isArray(args))return this._run(route,origin,...args);else return this._run(route,origin,args)}else if(Array.isArray(args))return this.run(route,...args);else return this.run(route,args)}isTypedArray(x){return ArrayBuffer.isView(x)&&Object.prototype.toString.call(x)!=="[object DataView]"}};var unsafeRoutes={setRoute:(self2,origin,fn,fnName)=>{if(typeof fn==="string")fn=parseFunctionFromText(fn);if(typeof fn==="function"){if(!fnName)fnName=fn.name;if(self2.graph.get(fnName)){self2.graph.get(fnName).setOperator(fn)}else self2.graph.load({[fnName]:{operator:fn}});return true}return false},setNode:(self2,origin,fn,fnName)=>{if(typeof fn==="string")fn=parseFunctionFromText(fn);if(typeof fn==="function"){if(!fnName)fnName=fn.name;if(self2.graph.get(fnName)){self2.graph.get(fnName).setOperator(fn)}else self2.graph.add({tag:fnName,operator:fn});return true}return false},setMethod:(self2,origin,route,fn,fnName)=>{if(typeof fn==="string")fn=parseFunctionFromText(fn);if(typeof fn==="function"){if(!fnName)fnName=fn.name;if(self2.graph.get(route)){self2.graph.get(route)[fnName]=fn}else self2.graph.add({tag:fnName,[fnName]:fn});return true}return false},assignRoute:(self2,origin,route,source)=>{if(self2.graph.get(route)&&typeof source==="object"){Object.assign(self2.graph.get(route),source)}},transferClass:(classObj,className)=>{if(typeof classObj==="object"){let str=classObj.toString();let message={route:"receiveClass",args:[str,className]};return message}return false},receiveClass:(self2,origin,stringified,className)=>{if(typeof stringified==="string"){if(stringified.indexOf("class")===0){let cls=(0,eval)("("+stringified+")");let name=className;if(!name)name=cls.name;self2.graph[name]=cls;return true}}return false},setValue:(self2,origin,key,value)=>{globalThis[key]=value;return true},assignObject:(self2,origin,target,source)=>{if(!globalThis[target])return false;if(typeof source==="object")Object.assign(globalThis[target],source);return true},setFunction:(self2,origin,fn,fnName)=>{if(typeof fn==="string")fn=parseFunctionFromText(fn);if(typeof fn==="function"){if(!fnName)fnName=fn.name;globalThis[fnName]=fn;return true}return false},assignFunctionToObject:(self2,origin,globalObjectName,fn,fnName)=>{if(!globalThis[globalObjectName])return false;if(typeof fn==="string")fn=parseFunctionFromText(fn);if(typeof fn==="function"){if(!fnName)fnName=fn.name;globalThis[globalObjectName][fnName]=fn;return true}return false}};var Systems={collision:{setupEntities:(self2,entities)=>{for(const key in entities){const entity=entities[key];if(entity.components){if(!entity.components[self2.tag])continue}Systems.collision.setEntity(entity)}},setEntity:entity=>{if(!("collisionEnabled"in entity))entity.collisionEnabled=true;if(!entity.collisionType)entity.collisionType="sphere";if(!entity.collisionRadius)entity.collisionRadius=1;if(!entity.collisionBoundsScale)entity.collisionBoundsScale={x:1,y:1,z:1};if(!entity.colliding)entity.colliding={};if(!entity.position)entity.position={x:0,y:0,z:0}},operator:(self2,origin,entities)=>{for(const key in entities){const entity1=entities[key];if(entity1.components){if(!entity1.components[self2.tag]||!entity1.collisionEnabled)continue}if(!entity1.collisionEnabled)continue;for(const key2 in entities){const entity2=entities[key2];if(entity2.components){if(!entity2.components[self2.tag])continue}if(!entity2.collisionEnabled)continue;let colliding=Systems.collision.collisionCheck(entity1,entity2);if(colliding!==false){entity1.colliding[entity2.tag]=colliding;entity2.colliding[entity1.tag]=colliding}}}return entities},collisionCheck:(body1,body2)=>{if(body1.collisionEnabled===false||body2.collisionEnabled===false)return false;const dist=Systems.collision.distance(body1.position,body2.position);if(dist<Math.max(...Object.values(body1.collisionBoundsScale))*body1.collisionRadius+Math.max(...Object.values(body2.collisionBoundsScale))*body2.collisionRadius){let isColliding=false;if(body1.collisionType==="sphere"){if(body2.collisionType==="sphere"){isColliding=Systems.collision.sphereCollisionCheck(body1,body2,dist)}else if(body2.collisionType==="box"){isColliding=Systems.collision.sphereBoxCollisionCheck(body1,body2,dist)}else if(body2.collisionType==="point"){isColliding=Systems.collision.isPointInsideSphere(body2.position,body1,dist)}}else if(body1.collisionType==="box"){if(body2.collisionType==="sphere"){isColliding=Systems.collision.sphereBoxCollisionCheck(body2,body1,dist)}else if(body2.collisionType==="box"){isColliding=Systems.collision.boxCollisionCheck(body1,body2)}else if(body2.collisionType==="point"){isColliding=Systems.collision.isPointInsideBox(body1.position,body1)}}else if(body1.collisionType==="point"){if(body2.collisionType==="sphere"){isColliding=Systems.collision.isPointInsideSphere(body1.position,body2,dist)}else if(body2.collisionType==="box"){isColliding=Systems.collision.isPointInsideBox(body1.position,body2)}}if(isColliding)return dist}return false},sphereCollisionCheck:(body1,body2,dist)=>{if(dist===void 0)dist=Systems.collision.distance(body1.position,body2.position);return dist<body1.collisionRadius+body2.collisionRadius},boxCollisionCheck:(body1,body2)=>{let body1minX=(body1.position.x-body1.collisionRadius)*body1.collisionBoundsScale.x;let body1maxX=(body1.position.x+body1.collisionRadius)*body1.collisionBoundsScale.x;let body1minY=(body1.position.y-body1.collisionRadius)*body1.collisionBoundsScale.y;let body1maxY=(body1.position.y+body1.collisionRadius)*body1.collisionBoundsScale.y;let body1minZ=(body1.position.z-body1.collisionRadius)*body1.collisionBoundsScale.z;let body1maxZ=(body1.position.z+body1.collisionRadius)*body1.collisionBoundsScale.z;let body2minX=(body2.position.x-body2.collisionRadius)*body1.collisionBoundsScale.x;let body2maxX=(body2.position.x+body2.collisionRadius)*body1.collisionBoundsScale.x;let body2minY=(body2.position.y-body2.collisionRadius)*body1.collisionBoundsScale.y;let body2maxY=(body2.position.y+body2.collisionRadius)*body1.collisionBoundsScale.y;let body2minZ=(body2.position.z-body2.collisionRadius)*body1.collisionBoundsScale.z;let body2maxZ=(body2.position.z+body2.collisionRadius)*body1.collisionBoundsScale.z;return(body1maxX<=body2maxX&&body1maxX>=body2minX||body1minX<=body2maxX&&body1minX>=body2minX)&&(body1maxY<=body2maxY&&body1maxY>=body2minY||body1minY<=body2maxY&&body1minY>=body2minY)&&(body1maxZ<=body2maxZ&&body1maxZ>=body2minZ||body1minZ<=body2maxZ&&body1minZ>=body2minZ)},sphereBoxCollisionCheck:(sphere,box,dist)=>{let boxMinX=(box.position.x-box.collisionRadius)*box.collisionBoundsScale.x;let boxMaxX=(box.position.x+box.collisionRadius)*box.collisionBoundsScale.x;let boxMinY=(box.position.y-box.collisionRadius)*box.collisionBoundsScale.y;let boxMaxY=(box.position.y+box.collisionRadius)*box.collisionBoundsScale.y;let boxMinZ=(box.position.z-box.collisionRadius)*box.collisionBoundsScale.z;let boxMaxZ=(box.position.z+box.collisionRadius)*box.collisionBoundsScale.z;let clamp={x:Math.max(boxMinX,Math.min(sphere.position.x,boxMaxX)),y:Math.max(boxMinY,Math.min(sphere.position.y,boxMaxY)),z:Math.max(boxMinZ,Math.min(sphere.position.z,boxMaxZ))};if(dist===void 0)dist=Systems.collision.distance(sphere.position,clamp);return dist>sphere.collisionRadius},isPointInsideSphere:(point,sphere,dist)=>{if(dist===void 0)dist=Systems.collision.distance(point,sphere.position);return dist<sphere.collisionRadius},isPointInsideBox:(point,box)=>{let boxminX=(box.position.x-box.collisionRadius)*box.collisionBoundsScale.x;let boxmaxX=(box.position.x+box.collisionRadius)*box.collisionBoundsScale.x;let boxminY=(box.position.y-box.collisionRadius)*box.collisionBoundsScale.x;let boxmaxY=(box.position.y+box.collisionRadius)*box.collisionBoundsScale.x;let boxminZ=(box.position.z-box.collisionRadius)*box.collisionBoundsScale.x;let boxmaxZ=(box.position.z+box.collisionRadius)*box.collisionBoundsScale.x;return point.x>=boxminX&&point.x<=boxmaxX&&(point.y>=boxminY&&point.y<=boxmaxY)&&(point.z>=boxminZ&&point.z<=boxmaxZ)},closestPointOnLine:(point,lineStart,lineEnd)=>{let a={x:lineEnd.x-lineStart.x,y:lineEnd.y-lineStart.y,z:lineEnd.z-lineStart.z};let b={x:lineStart.x-point.x,y:lineStart.y-point.y,z:lineStart.z-point.z};let c={x:lineEnd.x-point.x,y:lineEnd.y-point.y,z:lineEnd.z-point.z};let bdota=Systems.collision.dot(b,a);if(bdota<=0)return lineStart;let cdota=Systems.collision.dot(c,a);if(cdota<=0)return lineEnd;let _bdotapluscdota=1/(bdota+cdota);return{x:lineStart.x+(lineEnd.x-lineStart.x)*bdota*_bdotapluscdota,y:lineStart.y+(lineEnd.y-lineStart.y)*bdota*_bdotapluscdota,z:lineStart.z+(lineEnd.z-lineStart.z)*bdota*_bdotapluscdota}},closestPointOnPolygon:(point,t0,t1,t2)=>{let n=Systems.collision.calcNormal(t0,t1,t2);let dist=Systems.collision.dot(point,n)-Systems.collision.dot(t0,n);let projection=Systems.collision.vecadd(point,Systems.collision.vecscale(n,-dist));let v0x=t2[0]-t0[0];let v0y=t2[1]-t0[1];let v0z=t2[2]-t0[2];let v1x=t1[0]-t0[0];let v1y=t1[1]-t0[1];let v1z=t1[2]-t0[2];let v2x=projection[0]-t0[0];let v2y=projection[1]-t0[1];let v2z=projection[2]-t0[2];let dot00=v0x*v0x+v0y*v0y+v0z*v0z;let dot01=v0x*v1x+v0y*v1y+v0z*v1z;let dot02=v0x*v2x+v0y*v2y+v0z*v2z;let dot11=v1x*v1x+v1y*v1y+v1z*v1z;let dot12=v1x*v2x+v1y*v2y+v1z*v2z;let denom=dot00*dot11-dot01*dot01;if(Math.abs(denom)<1e-30){return void 0}let _denom=1/denom;let u=(dot11*dot02-dot01*dot12)*_denom;let v=(dot00*dot12-dot01*dot02)*_denom;if(u>=0&&v>=0&&u+v<1){return projection}else return void 0},calcNormal:(t0,t1,t2,positive=true)=>{var QR=Systems.collision.makeVec(t0,t1);var QS=Systems.collision.makeVec(t0,t2);if(positive===true){return Systems.collision.normalize(Systems.collision.cross3D(QR,QS))}else{return Systems.collision.normalize(Systems.collision.cross3D(QS,QR))}},dot:(v1,v2)=>{let dot=0;for(const key in v1){dot+=v1[key]*v2[key]}return dot},makeVec(p1,p2){return{x:p2.x-p1.x,y:p2.y-p1.y,z:p2.z-p1.z}},vecadd:(v1,v2)=>{let result=Object.assign({},v1);for(const key in result){result[key]+=v2[key]}return result},vecsub:(v1,v2)=>{let result=Object.assign({},v1);for(const key in result){result[key]-=v2[key]}return result},vecmul:(v1,v2)=>{let result=Object.assign({},v1);for(const key in result){result[key]*=v2[key]}return result},vecdiv:(v1,v2)=>{let result=Object.assign({},v1);for(const key in result){result[key]/=v2[key]}return result},vecscale:(v1,scalar)=>{let result=Object.assign({},v1);for(const key in result){result[key]*=scalar}return result},distance:(v1,v2)=>{let distance=0;for(const key in v1){distance+=Math.pow(v1[key]-v2[key],2)}return Math.sqrt(distance)},magnitude:v=>{let magnitude=0;for(const key in v){magnitude+=v[key]*v[key]}return Math.sqrt(magnitude)},normalize:v=>{let magnitude=Systems.collision.magnitude(v);let _mag=1/magnitude;let vn={};for(const key in v){vn[key]=v[key]*_mag}return vn},cross3D(v1,v2){return{x:v1.y*v2.z-v1.z*v2.y,y:v1.z*v2.x-v1.x*v2.z,z:v1.x*v2.y-v1.y*v2.x}},nearestNeighborSearch(entities,isWithinRadius=1e15){var tree={};;for(const key in entities){let newnode={tag:key,position:void 0,neighbors:[]};newnode.position=entities[key].position;tree[key]=newnode}for(const i in tree){for(const j in tree){var dist=Systems.collision.distance(tree[i].position,tree[j].position);if(dist<isWithinRadius){var newNeighbori={tag:j,position:entities[j].position,dist};tree[i].neighbors.push(newNeighbori);var newNeighborj={tag:j,position:entities[i].position,dist};tree[j].neighbors.push(newNeighborj)}}tree[i].neighbors.sort(function(a,b){return a.dist-b.dist})}return tree},generateBoundingVolumeTree(entities,mode="octree",withinRadius=1e15,minEntities=3){let dynamicBoundingVolumeTree={proto:{parent:void 0,children:{},entities:{},collisionType:"box",collisionRadius:1,collisionBoundsScale:{x:1,y:1,z:1},position:{x:0,y:0,z:0}},tree:{}};let maxX,maxY,maxZ;let minX=0,minY=0,minZ=0;let positions={};let minRadius=withinRadius;for(const key in entities){const body=entities[key];let xx=body.position.x+body.collisionRadius*body.collisionBoundsScale.x;let yy=body.position.y+body.collisionRadius*body.collisionBoundsScale.y;let zz=body.position.z+body.collisionRadius*body.collisionBoundsScale.z;if(maxX<xx)maxX=xx;if(minX>xx)minX=xx;if(maxY<yy)maxY=yy;if(minY>yy)minY=yy;if(maxZ<zz)maxZ=zz;if(minZ>zz)minZ=zz;if(minRadius>body.collisionRadius)minRadius=body.collisionRadius;positions[key]=body.position};let head=JSON.parse(JSON.stringify(dynamicBoundingVolumeTree.proto));let boxpos={x:(maxX+minX)*.5,y:(maxY+minY)*.5,z:(maxZ+minZ)*.5};let boxbounds={x:maxX-boxpos.x,y:maxY-boxpos.y,z:maxZ-boxpos.z};head.position=boxpos;head.collisionBoundsScale=boxbounds;head.entities=entities;dynamicBoundingVolumeTree.tree=head;minRadius*=2;if(mode==="octree"){let genOct=function(parentPos,halfbounds){let oct1={x:parentPos.x+halfbounds.x,y:parentPos.y+halfbounds.y,z:parentPos.z+halfbounds.z};let oct2={x:parentPos.x-halfbounds.x,y:parentPos.y+halfbounds.y,z:parentPos.z+halfbounds.z};let oct3={x:parentPos.x+halfbounds.x,y:parentPos.y-halfbounds.y,z:parentPos.z+halfbounds.z};let oct4={x:parentPos.x+halfbounds.x,y:parentPos.y+halfbounds.y,z:parentPos.z-halfbounds.z};let oct5={x:parentPos.x-halfbounds.x,y:parentPos.y-halfbounds.y,z:parentPos.z+halfbounds.z};let oct6={x:parentPos.x-halfbounds.x,y:parentPos.y+halfbounds.y,z:parentPos.z-halfbounds.z};let oct7={x:parentPos.x+halfbounds.x,y:parentPos.y-halfbounds.y,z:parentPos.z-halfbounds.z};let oct8={x:parentPos.x-halfbounds.x,y:parentPos.y-halfbounds.y,z:parentPos.z-halfbounds.z};return[oct1,oct2,oct3,oct4,oct5,oct6,oct7,oct8]},genOctTree=function(head2){let halfbounds={x:head2.collisionBoundsScale.x*.5,y:head2.collisionBoundsScale.y*.5,z:head2.collisionBoundsScale.z*.5};let octPos=genOct(head2.position,halfbounds);let check=Object.assign({},head2.bodies);for(let i=0;i<8;i++){let octquadrant=Object.assign(JSON.parse(JSON.stringify(dynamicBoundingVolumeTree.proto)),{position:octPos[i],collisionBoundsScale:halfbounds});octquadrant.parent=head2;for(const j in check){let collided=Systems.collision.collisionCheck(check[j],octquadrant);if(collided){octquadrant.entities[j]=check[j];delete check[j]}}if(Object.keys(octquadrant.entities).length>minEntities-1){head2.children[i]=octquadrant;octquadrant.parent=head2;if(Object.keys(octquadrant.entities).length>minEntities&&octquadrant.collisionRadius*.5>minRadius){genOctTree(octquadrant)}}}};genOctTree(head);return head}else{let tree=Systems.collision.nearestNeighborSearch(positions,withinRadius);let keys=Object.keys(tree);let tag=keys[Math.floor(Math.random()*keys.length)];let searching=true;let count=0;let genBoundingBoxLevel=(tree2,volumes)=>{let newVolumes={};let foundidxs={};let treekeys=Object.keys(tree2);while(searching&&count<treekeys.length){let node=tree2[tag];let i=0;let j=0;let ux=positions[node.tag].x-volumes[node.tag].collisionBoundsScale.x,uy=positions[node.tag].y-volumes[node.tag].collisionBoundsScale.y,uz=positions[node.tag].z-volumes[node.tag].collisionBoundsScale.z,mx=positions[node.tag].x+volumes[node.tag].collisionBoundsScale.x,my=positions[node.tag].y+volumes[node.tag].collisionBoundsScale.y,mz=positions[node.tag].z+volumes[node.tag].collisionBoundsScale.z;let newvolume=JSON.parse(JSON.stringify(dynamicBoundingVolumeTree.proto));newvolume.tag=`bound${Math.floor(Math.random()*1e15)}`;newvolume.children[node.tag]=volumes[node.tag];newvolume.bodies[node.tag]=entities[node.tag];volumes[node.tag].parent=newvolume;foundidxs[node.tag]=true;i++;j++;let nkeys=Object.keys(node.neighbors);while(i<nkeys.length&&j<3){if(foundidxs[node.neighbors[i].tag]){i++;continue}let uxn=positions[node.neighbors[i].tag].x-volumes[node.neighbors[i].tag].collisionBoundsScale.x,uyn=positions[node.neighbors[i].tag].y-volumes[node.neighbors[i].tag].collisionBoundsScale.y,uzn=positions[node.neighbors[i].tag].z-volumes[node.neighbors[i].tag].collisionBoundsScale.z,mxn=positions[node.neighbors[i].tag].x+volumes[node.neighbors[i].tag].collisionBoundsScale.x,myn=positions[node.neighbors[i].tag].y+volumes[node.neighbors[i].tag].collisionBoundsScale.y,mzn=positions[node.neighbors[i].tag].z+volumes[node.neighbors[i].tag].collisionBoundsScale.z;if(ux>uxn)ux=uxn;if(mx<mxn)mx=mxn;if(uy>uyn)uy=uyn;if(my<myn)my=myn;if(uz>uzn)uz=uzn;if(mz<mzn)mz=mzn;newvolume.children[node.neighbors[i].tag]=volumes[node.neighbors[i].tag];newvolume.entities[node.neighbors[i].tag]=entities[node.neighbors[i].tag];volumes[node.neighbors[i].tag].parent=newvolume;foundidxs[node.neighbors[i].tag]=true;i++;j++}let pos={x:(mx+ux)*.5,y:(my+uy)*.5,z:(mz+uz)*.5};let bounds={x:mx-pos.x,y:my-pos.y,z:mz-pos.z};newvolume.position=pos;newvolume.collisionBoundsScale=bounds;if(newvolume.bodies.length===1)newvolume=node;newVolumes[newvolume.tag]=newvolume;while(i<node.neighbors.length){if(!foundidxs[node.neighbors[i].tag])break;i++}if(i<node.neighbors.length){tag=node.neighbors[i].tag}else if(Object.keys(foundidxs).length<Object.keys(tree2).length){tag=keys[0]}else searching=false;count++}return newVolumes};let result=genBoundingBoxLevel(tree,entities);while(Object.keys(result).length>2){let nextTree=Systems.collision.nearestNeighborSearch(result,withinRadius);result=genBoundingBoxLevel(nextTree,result)}head.children=result;head.children.forEach(n=>{n.parent=head});return head}}},collider:{lastTime:performance.now(),useBoundingBox:true,collisionBounds:{bot:0,top:100,left:0,right:100,front:0,back:100},setupEntities:(self2,entities)=>{for(const key in entities){const entity=entities[key];if(entity.components){if(!entity.components[self2.tag])continue}self2.setEntity(entity)}},setEntity:entity=>{Systems.collision.setEntity(entity);Systems.movement.setEntity(entity);if(!("restitution"in entity))entity.restitution=1},operator:(self2,origin,entities)=>{for(const key in entities){const entity1=entities[key];if(entity1.components){if(!entity1.components[self2.tag]||!entity1.collisionEnabled)continue}if(!entity1.collisionEnabled)continue;for(const key2 in entity1.colliding){const entity2=entities[key2];if(entity1.colliding[key2]===false){delete entity1.colliding[key2];delete entity2.colliding[entity1.tag];continue}if(!entity2.collisionEnabled)continue;if(entity2.collisionType==="box"){self2.resolveBoxCollision(entity1,entity2,entity1.colliding[key2])}else{if(entity1.collisionType==="box"){entity1.fixed=true;self2.resolveSphereCollisions(entity1,entity2,entity1.colliding[key2]);entity1.fixed=false}else{self2.resolveSphereCollisions(entity1,entity2,entity1.colliding[key2]);delete entity2.colliding[entity1.tag]}}delete entity1.colliding[entity2.tag]}if(self2.useBoundingBox)self2.checkBoundingBox(self2,entity1)}return entities},checkBoundingBox:(self2,entity)=>{const ysize=entity.collisionRadius*entity.collisionBoundsScale.y;const xsize=entity.collisionRadius*entity.collisionBoundsScale.x;const zsize=entity.collisionRadius*entity.collisionBoundsScale.z;if(entity.position.y-ysize<=self2.collisionBounds.top){entity.velocity.y*=entity.restitution;entity.position.y=self2.collisionBounds.top+ysize}if(entity.position.y+ysize>=self2.collisionBounds.bot){entity.velocity.y*=entity.restitution;entity.position.y=self2.collisionBounds.bot-ysize}if(entity.position.x-xsize<=self2.collisionBounds.left){entity.velocity.x*=entity.restitution;entity.position.x=self2.collisionBounds.left+xsize}if(entity.position.x+xsize>=self2.collisionBounds.right){entity.velocity.x*=entity.restitution;entity.position.x=self2.collisionBounds.right-xsize}if(entity.position.z-zsize<=self2.collisionBounds.front){entity.velocity.z*=entity.restitution;entity.position.z=self2.collisionBounds.front+zsize}if(entity.position.z+zsize>=self2.collisionBounds.back){entity.velocity.z*=entity.restitution;entity.position.z=self2.collisionBounds.back-zsize}},resolveBoxCollision:(body1,box,negate)=>{let positionVec=Systems.collision.makeVec(body1.position,box.position);var directionVec=Object.values(positionVec);let closestSide;let closestDist=Infinity;let mul=-1;if(directionVec[idx]<0)mul=1;if(negate)mul=-mul;for(const key in body1.position){let dist=Math.abs(box.position[key]-body1.position[key]);if(dist<closestDist&&Math.abs(box.position[key]-body1.position[key]+body1.velocity[key]*1e-17)<dist){closestSide=key;closestDist=dist}}var idx=directionVec.indexOf(closestSide);if(idx===0)idx="x";if(idx===1)idx="y";if(idx===2)idx="z";if(idx===3)idx="w";let boxEdgeAxisPosition=box.position[idx]+box.collisionRadius*box.collisionBoundsScale[idx]*mul;if(negate){let body1Offset=boxEdgeAxisPosition-body1.collisionRadius*body1.collisionBoundsScale[idx]*mul;body1.position[idx]=body1Offset}else{let body1Offset=boxEdgeAxisPosition+body1.collisionRadius*body1.collisionBoundsScale[idx]*mul;body1.position[idx]=body1Offset}body1.velocity[idx]=-body1.velocity[idx]*body1.restitution;if(negate)body1.force[idx]=-body1.velocity[idx];var body2AccelMag=Systems.collision.magnitude(box.acceleration);var body2AccelNormal=Systems.collision.normalize(box.acceleration);body1.force[idx]=-body2AccelNormal[idx]*body2AccelMag*box.mass;if(negate)body1.force[idx]=-body1.force[idx]},resolveSphereCollisions:(entity1,entity2,dist)=>{if(dist===void 0)dist=Systems.collision.distance(entity1.position,entity2.position);let vecn=Systems.collision.normalize(Systems.collision.makeVec(entity1.position,entity2.position));let sumMass=entity1.mass+entity2.mass;let ratio=entity1.mass/sumMass;let rmin=1-ratio;if(entity1.fixed===false){entity1.position.x+=vecn.x*rmin*1.01;entity1.position.y+=vecn.y*rmin*1.01;entity1.position.z+=vecn.z*rmin*1.001}else{entity2.position.x-=vecn.x*1.01;entity2.position.y-=vecn.y*1.01;entity2.position.z-=vecn.z*1.01}if(entity2.fixed===false){entity2.position.x+=vecn.x*ratio*1.01;entity2.position.y+=vecn.y*ratio*1.01;entity2.position.z+=vecn.z*ratio*1.01}else{entity1.position.x+=vecn.x*1.01;entity1.position.y+=vecn.y*1.01;entity1.position.z+=vecn.z*1.01}dist=Systems.collision.distance(entity1.position,entity2.position);let vrel={x:entity1.velocity.x-entity2.velocity.x,y:entity1.velocity.y-entity2.velocity.y,z:entity1.velocity.z-entity2.velocity.z};let speed=vrel.x*vecn.x+vrel.y*vecn.y+vrel.z*vecn.z;if(speed>0){let impulse=2*speed/sumMass;if(entity1.fixed===false){entity1.velocity.x-=impulse*vecn.x*entity2.mass*entity1.restitution;entity1.velocity.y-=impulse*vecn.y*entity2.mass*entity1.restitution;entity1.velocity.z-=impulse*vecn.z*entity2.mass*entity1.restitution}if(entity2.fixed===false){entity2.velocity.x+=impulse*vecn.x*entity2.mass*entity2.restitution/entity2.mass;entity2.velocity.y+=impulse*vecn.y*entity2.mass*entity2.restitution/entity2.mass;entity2.velocity.z+=impulse*vecn.z*entity2.mass*entity2.restitution/entity2.mass}}}},nbody:{lastTime:performance.now(),G:6674e-14,setupEntities:(self2,entities)=>{for(const key in entities){const entity=entities[key];if(entity.components){if(!entity.components[self2.tag])continue}Systems.nbody.setEntity(entity)}},setEntity:entity=>{Systems.collision.setEntity(entity);Systems.movement.setEntity(entity);entity.isAttractor=true},operator:(self2,origin,entities)=>{for(const key in entities){const entity=entities[key];if(entity.components){if(!entity.components[self2.tag])continue}if(!entity.mass)continue;for(const key2 in entities){const entity2=entities[key2];if(entity2.components){if(!entity2.components[self2.tag])continue}if(!entity2.mass||!entity2.isAttractor)continue;Systems.nbody.attract(entity,entity2)}}return entities},attract:(body1,body2,dist,vecn)=>{if(dist===void 0)dist=Systems.collision.distance(body1.position,body2.position);if(vecn===void 0)vecn=Systems.collision.normalize(Systems.collision.makeVec(body1.position,body2.position));let Fg=6674e-14*body1.mass*body2.mass/(dist*dist);body1.force.x+=vecn.x*Fg;body1.force.y+=vecn.y*Fg;body1.force.z+=vecn.z*Fg;body2.force.x-=vecn.x*Fg;body2.force.y-=vecn.y*Fg;body2.force.z-=vecn.z*Fg}},boid:{lastTime:performance.now(),setupEntities:entities=>{for(const key in entities){const entity=entities[key];Systems.collision.setEntity(entity);Systems.movement.setEntity(entity);if(!entity.boid){entity.boid={cohesion:1e-5,separation:1e-4,alignment:.006,swirl:{x:.5,y:.5,z:.5,mul:.006},attractor:{x:.5,y:.5,z:.5,mul:.002},useCohesion:true,useSeparation:true,useAlignment:true,useSwirl:true,useAttractor:true,useAttraction:false,groupRadius:200,groupSize:10,searchLimit:10}}}},operator:(self2,origin,entities)=>{let now=performance.now();let timeStep=now-self2.lastTime;self2.lastTime=now;let keys=Object.keys(entities);let length=Object.keys(entities).length;let _timeStep=1/timeStep;outer:for(const i in entities){let p0=entities[i];const inRange=[];const distances=[];const boidVelocities=[p0.position.x,p0.position.y,p0.position.z,0,0,0,p0.velocity.x,p0.velocity.y,p0.velocity.z,0,0,0,0,0,0,0,0,0];let groupCount=1;nested:for(const j in entities){let p=entities[j];if(distances.length>p0.boid.groupSize||j>=p0.boid.searchLimit){break nested}let randj=keys[Math.floor(Math.random()*length)];if(j===i||entities[randj].tag===entities[i].tag||inRange.indexOf(randj)>-1){}else{let pr=entities[randj];let disttemp=Systems.collision.distance(p0.position,pr.position);if(disttemp>p0.boid.groupRadius){}else{distances.push(disttemp);inRange.push(randj);let distInv;if(p0.boid.useSeparation||p0.boid.useAlignment){distInv=p0.boid.groupRadius/(disttemp*disttemp);if(distInv==Infinity)distInv=p.maxSpeed;else if(distInv==-Infinity)distInv=-p.maxSpeed}if(p0.boid.useCohesion){boidVelocities[0]+=(pr.position.x-p0.position.x)*.5*disttemp*_timeStep;boidVelocities[1]+=(pr.position.y-p0.position.y)*.5*disttemp*_timeStep;boidVelocities[2]+=(pr.position.z-p0.position.z)*.5*disttemp*_timeStep}if(isNaN(disttemp)||isNaN(boidVelocities[0])||isNaN(pr.position.x)){console.log(disttemp,i,randj,p0.position,pr.position,boidVelocities);p0.position.x=NaN;return}if(p0.boid.useSeparation){boidVelocities[3]=boidVelocities[3]+(p0.position.x-pr.position.x)*distInv;boidVelocities[4]=boidVelocities[4]+(p0.position.y-pr.position.y)*distInv;boidVelocities[5]=boidVelocities[5]+(p0.position.z-pr.position.z)*distInv}if(p0.boid.useAttraction&&pr.boid.useAttraction){Systems.nbody.attract(p0,pr,disttemp)}if(p0.boid.useAlignment){boidVelocities[6]=boidVelocities[6]+pr.velocity.x*distInv;boidVelocities[7]=boidVelocities[7]+pr.velocity.y*distInv;boidVelocities[8]=boidVelocities[8]+pr.velocity.z*distInv}groupCount++}}}let _groupCount=1/groupCount;if(p0.boid.useCohesion){boidVelocities[0]=p0.boid.cohesion*(boidVelocities[0]*_groupCount);boidVelocities[1]=p0.boid.cohesion*(boidVelocities[1]*_groupCount);boidVelocities[2]=p0.boid.cohesion*(boidVelocities[2]*_groupCount)}else{boidVelocities[0]=0;boidVelocities[1]=0;boidVelocities[2]=0}if(p0.boid.useSeparation){boidVelocities[3]=p0.boid.separation*boidVelocities[3];boidVelocities[4]=p0.boid.separation*boidVelocities[4];boidVelocities[5]=p0.boid.separation*boidVelocities[5]}else{boidVelocities[3]=0;boidVelocities[4]=0;boidVelocities[5]=0}if(p0.boid.useAlignment){boidVelocities[6]=-(p0.boid.alignment*boidVelocities[6]*_groupCount);boidVelocities[7]=p0.boid.alignment*boidVelocities[7]*_groupCount;boidVelocities[8]=p0.boid.alignment*boidVelocities[8]*_groupCount}else{boidVelocities[6]=0;boidVelocities[7]=0;boidVelocities[8]=0}const swirlVec=[0,0,0];if(p0.boid.useSwirl==true){boidVelocities[9]=-(p0.position.y-p0.boid.swirl.y)*p0.boid.swirl.mul;boidVelocities[10]=(p0.position.z-p0.boid.swirl.z)*p0.boid.swirl.mul;boidVelocities[11]=(p0.position.x-p0.boid.swirl.x)*p0.boid.swirl.mul}const attractorVec=[0,0,0];if(p0.boid.useAttractor==true){boidVelocities[12]=(p0.boid.attractor.x-p0.position.x)*p0.boid.attractor.mul;if(p0.position.x>p0.boid.boundingBox.left||p0.position.x<p0.boid.boundingBox.right){boidVelocities[12]*=3}boidVelocities[13]=(p0.boid.attractor.y-p0.position.y)*p0.boid.attractor.mul;if(p0.position.y>p0.boid.boundingBox.top||p0.position.y<p0.boid.boundingBox.bottom){boidVelocities[13]*=3}boidVelocities[14]=(p0.boid.attractor.z-p0.position.z)*p0.boid.attractor.mul;if(p0.position.z>p0.boid.boundingBox.front||p0.position.z<p0.boid.boundingBox.back){boidVelocities[14]*=3}}entities[i].velocity.x=p0.velocity.x*p0.drag+boidVelocities[0]+boidVelocities[3]+boidVelocities[6]+boidVelocities[9]+boidVelocities[12]+boidVelocities[15],entities[i].velocity.y=p0.velocity.y*p0.drag+boidVelocities[1]+boidVelocities[4]+boidVelocities[7]+boidVelocities[10]+boidVelocities[13]+boidVelocities[16],entities[i].velocity.z=p0.velocity.z*p0.drag+boidVelocities[2]+boidVelocities[5]+boidVelocities[8]+boidVelocities[11]+boidVelocities[14]+boidVelocities[17];if(isNaN(entities[i].velocity.x))console.error(p0,i,groupCount,p0.position,p0.velocity,swirlVec,attractorVec)}return entities}},movement:{lastTime:performance.now(),setupEntities:(self2,entities)=>{for(const key in entities){const entity=entities[key];if(entity.components){if(!entity.components[self2.tag])continue}Systems.movement.setEntity(entity)}},setEntity:entity=>{if(!("mass"in entity))entity.mass=1;if(!("fixed"in entity))entity.fixed=false;if(!entity.force)entity.force={x:0,y:0,z:0};if(!("mass"in entity))entity.mass=1;if(!("gravity"in entity))entity.gravity=-9.81;if(!entity.acceleration)entity.acceleration={x:0,y:0,z:0};if(!entity.velocity)entity.velocity={x:0,y:0,z:0};if(!entity.position)entity.position={x:0,y:0,z:0}},operator:(self2,origin,entities)=>{let now=performance.now();let timeStep=(now-self2.lastTime)*.001;self2.lastTime=now;for(const key in entities){const entity=entities[key];if(entity.components){if(!entity.components[self2.tag])continue}if(entity.fixed)continue;if(typeof entity.force==="object"&&entity.mass){if(entity.force.x){entity.accleration.x+=entity.force.x/entity.mass;entity.force.x=0}if(entity.force.y){entity.accleration.y+=entity.force.y/entity.mass;entity.force.y=0}if(entity.force.z){entity.accleration.z+=entity.force.z/entity.mass+entity.gravity;entity.force.z=0}}if(typeof entity.acceleration==="object"){if(entity.drag){if(entity.accleration.x)entity.acceleration.x-=entity.acceleration.x*entity.drag*timeStep;if(entity.accleration.y)entity.acceleration.y-=entity.acceleration.y*entity.drag*timeStep;if(entity.accleration.z)entity.acceleration.z-=entity.acceleration.z*entity.drag*timeStep}if(entity.accleration.x)entity.velocity.x+=entity.accleration.x*timeStep;if(entity.accleration.y)entity.velocity.y+=entity.accleration.y*timeStep;if(entity.accleration.z)entity.velocity.z+=entity.accleration.z*timeStep}if(typeof entity.velocity==="object"){if(entity.velocity.x)entity.position.x+=entity.velocity.x*timeStep;if(entity.velocity.y)entity.position.y+=entity.velocity.y*timeStep;if(entity.velocity.z)entity.position.z+=entity.velocity.z*timeStep}}return entities}}};var import_sjcl=__toESM(require_sjcl());var import_web_worker=__toESM(require_browser());var WorkerService=class extends Service{constructor(options){super(options);this.name="worker";this.workers={};this.threadRot=0;this.customRoutes={"worker":(route,routeKey,routes)=>{let rt=route;if(rt?.worker||rt?.workerId){if(rt.workerUrl)rt.url=rt.workerUrl;if(rt.workerId)rt.tag=rt.workerId;if(!rt.tag)rt.tag=routeKey;rt._id=rt.tag;let worker;if(this.workers[rt._id])worker=this.workers[rt._id];if(!worker)worker=this.addWorker(rt);rt.worker=worker;if(rt.transferFunctions){for(const prop in rt.transferFunctions){this.transferFunction(worker,rt.transferFunctions[prop],prop)}}if(rt.transferClasses){for(const prop in rt.transferClasses){this.transferClass(worker,rt.transferClasses[prop],prop)}}if(worker){if(!rt.operator){rt.operator=(...args)=>{if(rt.callback){if(!this.nodes.get(rt.tag)?.children)worker.post(rt.callback,args);else return worker.run(rt.callback,args)}else{if(!this.nodes.get(rt.tag)?.children)worker.send(args);else return worker.request(args)}}}}}return rt}};this.customChildren={"worker":(child,childRouteKey,parent,routes,checked)=>{let worker;if(child?.worker||child?.workerId){if(child.workerUrl)child.url=child.workerUrl;if(child.workerId)child.tag=child.workerId;if(!child.tag)child.tag=childRouteKey;child._id=child.tag;if(this.workers[child._id])worker=this.workers[child._id];if(!worker)worker=this.addWorker(child);child.worker=worker;if(child.transferFunctions){for(const prop in child.transferFunctions){this.transferFunction(worker,child.transferFunctions[prop],prop)}}if(child.transferClasses){for(const prop in child.transferClasses){this.transferClass(worker,child.transferClasses[prop],prop)}}if(worker){if(!child.operator){child.operator=(...args)=>{if(child.callback){if(!this.nodes.get(child.tag)?.children)worker.post(child.callback,args);else return worker.run(child.callback,args)}else{if(!this.nodes.get(child.tag)?.children)worker.send(args);else return worker.request(args)}}}}}if(child.parentRoute&&(parent?.worker||parent?.workerId)){if(worker){let portId=this.establishMessageChannel(worker,parent.worker.worker);worker.post("subscribeToWorker",child.parentRoute,portId,child.callback)}else{parent.worker.subscribe(child.parentRoute,result=>{this.nodes.get(child.tag?child.tag:childRouteKey).run(result)})}}}};this.addWorker=options=>{let worker;if(!options._id)options._id=`worker${Math.floor(Math.random()*1e15)}`;if(options.url)worker=new import_web_worker.default(options.url);else if(options.port){worker=options.port}else if(this.workers[options._id]){if(this.workers[options._id].port)worker=this.workers[options._id].port;else worker=this.workers[options._id].worker}if(!worker)return;let send=(message,transfer)=>{return this.transmit(message,worker,transfer)};let post=(route,args,transfer,origin,method)=>{let message={route,args};if(origin)message.origin=origin;if(method)message.method=method;return this.transmit(message,worker,transfer)};let run=(route,args,transfer,origin,method)=>{return new Promise((res,rej)=>{let callbackId=Math.random();let req={route:"runRequest",args:[{route,args},options._id,callbackId]};if(origin)req.args[0].origin=origin;if(method)req.args[0].method=method;let onmessage=ev=>{if(typeof ev.data==="object"){if(ev.data.callbackId===callbackId){worker.removeEventListener("message",onmessage);res(ev.data.args)}}};worker.addEventListener("message",onmessage);this.transmit(req,worker,transfer)})};let request=(message,transfer,origin,method)=>{return new Promise((res,rej)=>{let callbackId=Math.random();let req={route:"runRequest",args:[message,options._id,callbackId]};if(origin)req.origin=origin;if(method)req.method=method;let onmessage=ev=>{if(typeof ev.data==="object"){if(ev.data.callbackId===callbackId){worker.removeEventListener("message",onmessage);res(ev.data.args)}}};worker.addEventListener("message",onmessage);this.transmit(req,worker,transfer)})};let subscribe=(route,callback)=>{return this.subscribeToWorker(route,options._id,callback)};let unsubscribe=(route,sub)=>{return run("unsubscribe",[route,sub])};if(!options.onmessage)options.onmessage=ev=>{this.receive(ev.data);this.setState({[options._id]:ev.data})};if(!options.onerror){options.onerror=ev=>{console.error(ev.data)}}worker.onmessage=options.onmessage;worker.onerror=options.onerror;this.workers[options._id]={worker,send,post,run,request,subscribe,unsubscribe,...options};return this.workers[options._id]};this.toObjectURL=scriptTemplate=>{let blob=new Blob([scriptTemplate],{type:"text/javascript"});return URL.createObjectURL(blob)};this.transmit=(message,worker,transfer)=>{if(worker instanceof import_web_worker.default||worker instanceof MessagePort){worker.postMessage(message,transfer)}else if(typeof worker==="string"){if(this.workers[worker]){if(this.workers[worker].port)this.workers[worker].port.postMessage(message,transfer);else if(this.workers[worker].worker)this.workers[worker].worker.postMessage(message,transfer)}}else{let keys=Object.keys(this.workers);this.workers[keys[this.threadRot]].worker.postMessage(message,transfer);this.threadRot++;if(this.threadRot===keys.length)this.threadRot=0}return message};this.terminate=worker=>{if(typeof worker==="string"){let obj=this.workers[worker];if(obj)delete this.workers[worker];worker=obj.worker}if(worker instanceof import_web_worker.default){worker.terminate();return true}if(worker instanceof MessagePort){worker.close();return true}return false};this.establishMessageChannel=(worker,worker2)=>{let workerId;if(typeof worker==="string"){workerId=worker;if(this.workers[worker]){if(this.workers[worker].port)worker=this.workers[worker].port;else worker2=this.workers[worker].worker}}if(typeof worker2==="string"){if(this.workers[worker2]){if(this.workers[worker2].port)worker2=this.workers[worker2].port;else worker2=this.workers[worker2].worker}}if(worker instanceof import_web_worker.default||worker instanceof MessagePort){let channel=new MessageChannel;let portId=`port${Math.floor(Math.random()*1e15)}`;worker.postMessage({route:"addWorker",args:{port:channel.port1,_id:portId}},[channel.port1]);if(worker2 instanceof import_web_worker.default||worker2 instanceof MessagePort){worker2.postMessage({route:"addWorker",args:{port:channel.port2,_id:portId}},[channel.port2])}else if(workerId&&this.workers[workerId])this.workers[workerId].port=channel.port2;return portId}return false};this.request=(message,workerId,transfer,origin,method)=>{let worker=this.workers[workerId].worker;return new Promise((res,rej)=>{let callbackId=Math.random();let req={route:"runRequest",args:[message,callbackId]};if(origin)req.origin=origin;if(method)req.method=method;let onmessage=ev=>{if(typeof ev.data==="object"){if(ev.data.callbackId===callbackId){worker.removeEventListener("message",onmessage);res(ev.data.args)}}};worker.addEventListener("message",onmessage);this.transmit(req,worker,transfer)})};this.runRequest=(message,worker,callbackId)=>{let res=this.receive(message);if(typeof worker==="string"&&this.workers[worker]){if(this.workers[worker].port)worker=this.workers[worker].port;else worker=this.workers[worker].worker}if(res instanceof Promise){res.then(r=>{if(worker instanceof import_web_worker.default||worker instanceof MessagePort)worker.postMessage({args:r,callbackId});else if(typeof WorkerGlobalScope!=="undefined"&&self instanceof WorkerGlobalScope)globalThis.postMessage({args:r,callbackId})})}else{if(worker instanceof import_web_worker.default||worker instanceof MessagePort)worker.postMessage({args:res,callbackId});else if(typeof WorkerGlobalScope!=="undefined"&&self instanceof WorkerGlobalScope)globalThis.postMessage({args:res,callbackId})}return res};this.subscribeWorker=(route,worker)=>{if(typeof worker==="string"&&this.workers[worker]){if(this.workers[worker].port)worker=this.workers[worker].port;else worker=this.workers[worker].worker}return this.subscribe(route,res=>{if(res instanceof Promise){res.then(r=>{if(worker?.postMessage)worker.postMessage({args:r,route});else if(globalThis.postMessage)globalThis.postMessage({args:r,callbackId:route})})}else{if(worker?.postMessage)worker.postMessage({args:res,route});else if(globalThis.postMessage)globalThis.postMessage({args:res,callbackId:route})}})};this.subscribeToWorker=(route,workerId,callback)=>{if(typeof workerId==="string"&&this.workers[workerId]){this.subscribe(workerId,res=>{if(res?.callbackId===route){if(!callback)this.setState({[workerId]:res.args});else if(typeof callback==="string"){this.run(callback,res.args)}else callback(res.args)}});return this.workers[workerId].run("subscribeWorker",[route,workerId])}};this.routes={addWorker:this.addWorker,toObjectURL:this.toObjectURL,request:this.request,runRequest:this.runRequest,establishMessageChannel:this.establishMessageChannel,subscribeWorker:this.subscribeWorker,subscribeToWorker:this.subscribeToWorker,unsubscribe:this.unsubscribe};this.load(this.routes);if(typeof WorkerGlobalScope!=="undefined"&&globalThis instanceof WorkerGlobalScope){globalThis.onmessage=ev=>{let result=this.receive(ev.data);if(this.keepState)this.setState({[ev.data.origin?ev.data.origin:"worker"]:result})}}}transferFunction(worker,fn,fnName){if(!fnName)fnName=fn.name;return worker.request({route:"setRoute",args:[fn.toString(),fnName]})}transferClass(worker,cls,className){if(!className)className=cls.name;return worker.request({route:"receiveClass",args:[cls.toString(),className]})}};var mouseEventHandler=makeSendPropertiesHandler(["ctrlKey","metaKey","shiftKey","button","pointerType","clientX","clientY","pageX","pageY"]);var wheelEventHandlerImpl=makeSendPropertiesHandler(["deltaX","deltaY"]);var keydownEventHandler=makeSendPropertiesHandler(["ctrlKey","metaKey","shiftKey","keyCode"]);function wheelEventHandler(event,sendFn){event.preventDefault();wheelEventHandlerImpl(event,sendFn)}function preventDefaultHandler(event){event.preventDefault()}function copyProperties(src,properties,dst){for(const name of properties){dst[name]=src[name]}}function makeSendPropertiesHandler(properties){return function sendProperties(event,sendFn){const data={type:event.type};copyProperties(event,properties,data);sendFn(data)}}function touchEventHandler(event,sendFn){const touches=[];const data={type:event.type,touches};for(let i=0;i<event.touches.length;++i){const touch=event.touches[i];touches.push({pageX:touch.pageX,pageY:touch.pageY})}sendFn(data)}var orbitKeys={"37":true,"38":true,"39":true,"40":true};function filteredKeydownEventHandler(event,sendFn){const{keyCode}=event;if(orbitKeys[keyCode]){event.preventDefault();keydownEventHandler(event,sendFn)}}var eventHandlers={contextmenu:preventDefaultHandler,mousedown:mouseEventHandler,mousemove:mouseEventHandler,mouseup:mouseEventHandler,pointerdown:mouseEventHandler,pointermove:mouseEventHandler,pointerup:mouseEventHandler,touchstart:touchEventHandler,touchmove:touchEventHandler,touchend:touchEventHandler,wheel:wheelEventHandler,keydown:filteredKeydownEventHandler};function initProxyElement(element,worker,id){if(!id)id="proxy"+Math.floor(Math.random()*1e15);const sendEvent=data=>{worker.postMessage({route:"handleProxyEvent",args:[data,id]})};let entries=Object.entries(eventHandlers);for(const[eventName,handler]of entries){element.addEventListener(eventName,function(event){handler(event,sendEvent)})}const sendSize=()=>{const rect=element.getBoundingClientRect();sendEvent({type:"size",left:rect.left,top:rect.top,width:element.clientWidth,height:element.clientHeight})};sendSize();globalThis.addEventListener("resize",sendSize);return id}var EventDispatcher=class{addEventListener(type,listener){if(this._listeners===void 0)this._listeners={};const listeners=this._listeners;if(listeners[type]===void 0){listeners[type]=[]}if(listeners[type].indexOf(listener)===-1){listeners[type].push(listener)}}hasEventListener(type,listener){if(this._listeners===void 0)return false;const listeners=this._listeners;return listeners[type]!==void 0&&listeners[type].indexOf(listener)!==-1}removeEventListener(type,listener){if(this._listeners===void 0)return;const listeners=this._listeners;const listenerArray=listeners[type];if(listenerArray!==void 0){const index=listenerArray.indexOf(listener);if(index!==-1){listenerArray.splice(index,1)}}}dispatchEvent(event,target){if(this._listeners===void 0)return;const listeners=this._listeners;const listenerArray=listeners[event.type];if(listenerArray!==void 0){if(!target)event.target=this;else event.target=target;const array=listenerArray.slice(0);for(let i=0,l=array.length;i<l;i++){array[i].call(this,event)}event.target=null}}};function noop(){}var ElementProxyReceiver=class extends EventDispatcher{constructor(){super();this._listeners={};this.style={};this.setPointerCapture=()=>{};this.releasePointerCapture=()=>{};this.getBoundingClientRect=()=>{return{left:this.left,top:this.top,width:this.width,height:this.height,right:this.left+this.width,bottom:this.top+this.height}};this.handleEvent=data=>{if(data.type==="size"){this.left=data.left;this.top=data.top;this.width=data.width;this.height=data.height;if(typeof this.proxied==="object"){this.proxied.width=this.width;this.proxied.height=this.height}return}data.preventDefault=noop;data.stopPropagation=noop;this.dispatchEvent(data,this.proxied)};this.style={}}get clientWidth(){return this.width}get clientHeight(){return this.height}focus(){}};var ProxyManager=class{constructor(){this.targets={};this.makeProxy=(id,addTo)=>{if(!id)id=`proxyReceiver${Math.floor(Math.random()*1e15)}`;let proxy;if(this.targets[id])proxy=this.targets[id];else{proxy=new ElementProxyReceiver;this.targets[id]=proxy}if(typeof addTo==="object"){addTo.proxy=proxy;proxy.proxied=addTo;addTo.addEventListener=proxy.addEventListener.bind(proxy);addTo.removeEventListener=proxy.removeEventListener.bind(proxy);addTo.handleEvent=proxy.handleEvent.bind(proxy);addTo.dispatchEvent=proxy.dispatchEvent.bind(proxy)}};this.getProxy=id=>{return this.targets[id]};this.handleEvent=(data,id)=>{if(this.targets[id]){this.targets[id].handleEvent(data);return true}return void 0};if(!globalThis.document)globalThis.document={}}};var proxyElementWorkerRoutes={initProxyElement,makeProxy:(self2,origin,id,elm)=>{if(!self2.graph.ProxyManager)self2.graph.ProxyManager=new ProxyManager;self2.graph.ProxyManager.makeProxy(id,elm);return id},handleProxyEvent:(self2,origin,data,id)=>{if(!self2.graph.ProxyManager)self2.graph.ProxyManager=new ProxyManager;if(self2.graph.ProxyManager.handleEvent(data,id))return data}};var workerCanvasRoutes={...proxyElementWorkerRoutes,transferCanvas:(self2,origin,worker,options)=>{if(!options)return void 0;if(!options._id)options._id=`canvas${Math.floor(Math.random()*1e15)}`;let offscreen=options.canvas.transferControlToOffscreen();let message={route:"receiveCanvas",args:{canvas:offscreen,context:options.context,_id:options._id}};self2.graph.run("initProxyElement",options.canvas,worker,options._id);if(options.draw){if(typeof options.draw==="function")message.args.draw=options.draw.toString();else message.args.draw=options.draw}if(options.update){if(typeof options.update==="function")message.args.update=options.update.toString();else message.args.update=options.update}if(options.init){if(typeof options.init==="function")message.args.init=options.init.toString();else message.args.init=options.init}if(options.clear){if(typeof options.clear==="function")message.args.clear=options.clear.toString();else message.args.clear=options.clear}worker.postMessage(message,[offscreen]);return options._id},receiveCanvas:(self2,origin,options)=>{if(!self2.graph.CANVASES)self2.graph.CANVASES={};let canvasOptions={_id:options._id?options._id:`canvas${Math.floor(Math.random()*1e15)}`,canvas:options.canvas,context:options.context?options.canvas.getContext(options.context):void 0,init:options.init,update:options.update,clear:options.clear,draw:options.draw,animating:"animating"in options?options.animating:true};if(self2.graph.CANVASES[canvasOptions._id]){self2.graph.run("setDraw",canvasOptions)}else{self2.graph.CANVASES[canvasOptions._id]=canvasOptions;self2.graph.run("makeProxy",canvasOptions._id,canvasOptions.canvas);if(options.width)canvasOptions.canvas.width=options.width;if(options.height)canvasOptions.canvas.height=options.height;if(typeof canvasOptions.draw==="string"){canvasOptions.draw=parseFunctionFromText(canvasOptions.draw)}if(typeof canvasOptions.update==="string"){canvasOptions.update=parseFunctionFromText(canvasOptions.update)}if(typeof canvasOptions.init==="string"){canvasOptions.init=parseFunctionFromText(canvasOptions.init)}if(typeof canvasOptions.clear==="string"){canvasOptions.clear=parseFunctionFromText(canvasOptions.clear)}if(typeof canvasOptions.draw==="function"){let draw=(s,canvas,context)=>{if(s.animating){s.draw(s,canvas,context);requestAnimationFrame(()=>{draw(s,canvas,context)})}};if(typeof canvasOptions.init==="function")canvasOptions.init(canvasOptions,canvasOptions.canvas,canvasOptions.context);draw(canvasOptions,canvasOptions.canvas,canvasOptions.context)}}return canvasOptions._id},setDraw:(self2,origin,settings)=>{let canvasopts;if(settings._id)canvasopts=self2.graph.CANVASES?.[settings._id];else canvasopts=self2.graph.CANVASES?.[Object.keys(self2.graph.CANVASES)[0]];if(canvasopts){if(settings.canvas){canvasopts.canvas=settings.canvas;self2.graph.run("makeProxy",canvasopts._id,canvasopts.canvas)}if(settings.context)canvasopts.context=canvasopts.canvas.getContext(settings.context);if(settings.width)canvasopts.canvas.width=settings.width;if(settings.height)canvasopts.canvas.height=settings.height;if(typeof settings.draw==="string")settings.draw=parseFunctionFromText(settings.draw);if(typeof settings.draw==="function"){canvasopts.draw=settings.draw}if(typeof settings.update==="string")settings.update=parseFunctionFromText(settings.update);if(typeof settings.update==="function"){canvasopts.update=settings.update}if(typeof settings.init==="string")settings.init=parseFunctionFromText(settings.init);if(typeof settings.init==="function"){canvasopts.init=settings.init}if(typeof settings.clear==="string")settings.clear=parseFunctionFromText(settings.clear);if(typeof settings.clear==="function"){canvasopts.clear=settings.clear}return settings._id}return void 0},drawFrame:(self2,origin,_id,props)=>{let canvasopts;if(!_id)canvasopts=self2.graph.CANVASES?.[Object.keys(self2.graph.CANVASES)[0]];else canvasopts=self2.graph.CANVASES?.[_id];if(canvasopts){if(props)Object.assign(canvasopts,props);if(canvasopts.draw){canvasopts.draw(canvasopts,canvasopts.canvas,canvasopts.context);return _id}}return void 0},clearFrame:(self2,origin,_id,input)=>{let canvasopts;if(!_id)canvasopts=self2.graph.CANVASES?.[Object.keys(self2.graph.CANVASES)[0]];else canvasopts=self2.graph.CANVASES?.[_id];if(canvasopts?.clear){canvasopts.clear(canvasopts,canvasopts.canvas,canvasopts.context,input);return _id}return void 0},runUpdate:(self2,origin,_id,input)=>{let canvasopts;if(!_id)canvasopts=self2.graph.CANVASES?.[Object.keys(self2.graph.CANVASES)[0]];else canvasopts=self2.graph.CANVASES?.[_id];if(canvasopts?.update){canvasopts.update(canvasopts,canvasopts.canvas,canvasopts.context,input);return _id}return void 0},setProps:(self2,origin,_id,props)=>{let canvasopts;if(!_id)canvasopts=self2.graph.CANVASES?.[Object.keys(self2.graph.CANVASES)[0]];else canvasopts=self2.graph.CANVASES?.[_id];if(canvasopts){Object.assign(canvasopts,props);if(props.width)canvasopts.canvas.width=props.width;if(props.height)canvasopts.canvas.height=props.height;return _id}return void 0},startAnim:(self2,origin,_id,draw)=>{let canvasopts;if(!_id)canvasopts=self2.graph.CANVASES?.[Object.keys(self2.graph.CANVASES)[0]];else canvasopts=self2.graph.CANVASES?.[_id];canvasopts.animating=true;if(canvasopts&&draw){if(typeof draw==="string")draw=parseFunctionFromText(draw);if(typeof draw==="function"){canvasopts.draw=draw}return _id}if(typeof canvasopts?.draw==="function"){let draw2=(s,canvas,context)=>{if(s.animating){s.draw(s,canvas,context);requestAnimationFrame(()=>{draw2(s,canvas,context)})}};if(typeof canvasopts.clear==="function")canvasopts.clear(canvasopts,canvasopts.canvas,canvasopts.context);if(typeof canvasopts.init==="function")canvasopts.init(canvasopts,canvasopts.canvas,canvasopts.context);draw2(canvasopts,canvasopts.canvas,canvasopts.context);return _id}return void 0},stopAnim:(self2,origin,_id)=>{let canvasopts;if(!_id)canvasopts=self2.graph.CANVASES?.[Object.keys(self2.graph.CANVASES)[0]];else canvasopts=self2.graph.CANVASES?.[_id];if(canvasopts){canvasopts.animating=false;if(typeof canvasopts.clear==="function")canvasopts.clear(canvasopts,canvasopts.canvas,canvasopts.context);return _id}return void 0}};if(typeof WorkerGlobalScope!=="undefined"&&self instanceof WorkerGlobalScope){const worker=new WorkerService({routes:[workerCanvasRoutes,unsafeRoutes],includeClassName:false});console.log(worker)}var worker_default=self;})();\n')], { type: "text/javascript" }));
  var worker_default = url;

  // index.ts
  var workers = new WorkerService();
  var router = new Router([
    DOMService,
    workers,
    workerCanvasRoutes
  ]);
  console.log(router);
  var ret = router.load({
    "main": {
      tagName: "div",
      children: {
        "div": {
          tagName: "div",
          innerText: "Multithreaded canvases!"
        },
        "canvas": {
          tagName: "canvas",
          style: { width: "100%", height: "100%" },
          onrender: (elm, info) => {
            const renderer = workers.addWorker({ url: worker_default });
            info.worker = renderer;
            if (renderer)
              router.run(
                "transferCanvas",
                renderer.worker,
                {
                  canvas: elm,
                  context: "2d",
                  _id: elm.id,
                  draw: (self2, canvas, context) => {
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    context.fillStyle = `rgb(0,${Math.sin(Date.now() * 1e-3) * 255},${Math.cos(Date.now() * 1e-3) * 255})`;
                    context.fillRect(0, 0, canvas.width, canvas.height);
                  }
                }
              );
          },
          onremove: (elm, info) => {
            workers.terminate(info.worker._id);
          }
        }
      }
    }
  });
})();
