var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value2) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value: value2 }) : obj[key] = value2;
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
var __publicField = (obj, key, value2) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value2);
  return value2;
};

// ../../services/e2ee/sjcl.js
var require_sjcl = __commonJS({
  "../../services/e2ee/sjcl.js"(exports, module2) {
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
      var q = h[1], v = h[2], w = h[3], x2 = h[4];
      for (m = 0; m < n; m++)
        h = a[e >>> 24] ^ q[f >> 16 & 255] ^ v[g >> 8 & 255] ^ w[b & 255] ^ d[p], k = a[f >>> 24] ^ q[g >> 16 & 255] ^ v[b >> 8 & 255] ^ w[e & 255] ^ d[p + 1], l = a[g >>> 24] ^ q[b >> 16 & 255] ^ v[e >> 8 & 255] ^ w[f & 255] ^ d[p + 2], b = a[b >>> 24] ^ q[e >> 16 & 255] ^ v[f >> 8 & 255] ^ w[g & 255] ^ d[p + 3], p += 4, e = h, f = k, g = l;
      for (m = 0; 4 > m; m++)
        r[c ? 3 & -m : m] = x2[e >>> 24] << 24 ^ x2[f >> 16 & 255] << 16 ^ x2[g >> 8 & 255] << 8 ^ x2[b & 255] ^ d[p++], h = e, e = f, f = g, g = b, b = h;
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
        if (G = "undefined" !== typeof module2 && module2.exports) {
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
    "undefined" !== typeof module2 && module2.exports && (module2.exports = sjcl2);
    "function" === typeof define && define([], function() {
      return sjcl2;
    });
  }
});

// ../../node_modules/better-sse/build/index.js
var require_build = __commonJS({
  "../../node_modules/better-sse/build/index.js"(exports, module2) {
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

// ../../node_modules/ws/lib/stream.js
var require_stream = __commonJS({
  "../../node_modules/ws/lib/stream.js"(exports, module2) {
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

// ../../node_modules/ws/lib/constants.js
var require_constants = __commonJS({
  "../../node_modules/ws/lib/constants.js"(exports, module2) {
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

// ../../node_modules/ws/lib/buffer-util.js
var require_buffer_util = __commonJS({
  "../../node_modules/ws/lib/buffer-util.js"(exports, module2) {
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

// ../../node_modules/ws/lib/limiter.js
var require_limiter = __commonJS({
  "../../node_modules/ws/lib/limiter.js"(exports, module2) {
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

// ../../node_modules/ws/lib/permessage-deflate.js
var require_permessage_deflate = __commonJS({
  "../../node_modules/ws/lib/permessage-deflate.js"(exports, module2) {
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
            let value2 = params[key];
            if (value2.length > 1) {
              throw new Error(`Parameter "${key}" must have only a single value`);
            }
            value2 = value2[0];
            if (key === "client_max_window_bits") {
              if (value2 !== true) {
                const num = +value2;
                if (!Number.isInteger(num) || num < 8 || num > 15) {
                  throw new TypeError(
                    `Invalid value for parameter "${key}": ${value2}`
                  );
                }
                value2 = num;
              } else if (!this._isServer) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value2}`
                );
              }
            } else if (key === "server_max_window_bits") {
              const num = +value2;
              if (!Number.isInteger(num) || num < 8 || num > 15) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value2}`
                );
              }
              value2 = num;
            } else if (key === "client_no_context_takeover" || key === "server_no_context_takeover") {
              if (value2 !== true) {
                throw new TypeError(
                  `Invalid value for parameter "${key}": ${value2}`
                );
              }
            } else {
              throw new Error(`Unknown parameter "${key}"`);
            }
            params[key] = value2;
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

// ../../node_modules/ws/lib/validation.js
var require_validation = __commonJS({
  "../../node_modules/ws/lib/validation.js"(exports, module2) {
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

// ../../node_modules/ws/lib/receiver.js
var require_receiver = __commonJS({
  "../../node_modules/ws/lib/receiver.js"(exports, module2) {
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

// ../../node_modules/ws/lib/sender.js
var require_sender = __commonJS({
  "../../node_modules/ws/lib/sender.js"(exports, module2) {
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

// ../../node_modules/ws/lib/event-target.js
var require_event_target = __commonJS({
  "../../node_modules/ws/lib/event-target.js"(exports, module2) {
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

// ../../node_modules/ws/lib/extension.js
var require_extension = __commonJS({
  "../../node_modules/ws/lib/extension.js"(exports, module2) {
    "use strict";
    var { tokenChars } = require_validation();
    function push(dest, name2, elem) {
      if (dest[name2] === void 0)
        dest[name2] = [elem];
      else
        dest[name2].push(elem);
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
            const name2 = header.slice(start, end);
            if (code === 44) {
              push(offers, name2, params);
              params = /* @__PURE__ */ Object.create(null);
            } else {
              extensionName = name2;
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
            let value2 = header.slice(start, end);
            if (mustUnescape) {
              value2 = value2.replace(/\\/g, "");
              mustUnescape = false;
            }
            push(params, paramName, value2);
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

// ../../node_modules/ws/lib/websocket.js
var require_websocket = __commonJS({
  "../../node_modules/ws/lib/websocket.js"(exports, module2) {
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
            for (const [key2, value2] of Object.entries(headers)) {
              options.headers[key2.toLowerCase()] = value2;
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

// ../../node_modules/ws/lib/subprotocol.js
var require_subprotocol = __commonJS({
  "../../node_modules/ws/lib/subprotocol.js"(exports, module2) {
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

// ../../node_modules/ws/lib/websocket-server.js
var require_websocket_server = __commonJS({
  "../../node_modules/ws/lib/websocket-server.js"(exports, module2) {
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
          const value2 = extension.format({
            [PerMessageDeflate.extensionName]: [params]
          });
          headers.push(`Sec-WebSocket-Extensions: ${value2}`);
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

// ../../node_modules/web-worker/cjs/node.js
var require_node = __commonJS({
  "../../node_modules/web-worker/cjs/node.js"(exports, module2) {
    var URL2 = require("url");
    var VM = require("vm");
    var threads = require("worker_threads");
    var WORKER = Symbol.for("worker");
    var EVENTS = Symbol.for("events");
    var EventTarget = class {
      constructor() {
        Object.defineProperty(this, EVENTS, {
          value: /* @__PURE__ */ new Map()
        });
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
    module2.exports = threads.isMainThread ? mainThread() : workerThread();
    var baseUrl = URL2.pathToFileURL(process.cwd() + "/");
    function mainThread() {
      class Worker3 extends EventTarget {
        constructor(url, options) {
          super();
          const {
            name: name2,
            type
          } = options || {};
          url += "";
          let mod;
          if (/^data:/.test(url)) {
            mod = url;
          } else {
            mod = URL2.fileURLToPath(new URL2.URL(url, baseUrl));
          }
          const worker = new threads.Worker(__filename, {
            workerData: {
              mod,
              name: name2,
              type
            }
          });
          Object.defineProperty(this, WORKER, {
            value: worker
          });
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
      Worker3.prototype.onmessage = Worker3.prototype.onerror = Worker3.prototype.onclose = null;
      return Worker3;
    }
    function workerThread() {
      let {
        mod,
        name: name2,
        type
      } = threads.workerData;
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
      global.name = name2;
      const isDataUrl = /^data:/.test(mod);
      if (type === "module") {
        import(mod).catch((err) => {
          if (isDataUrl && err.message === "Not supported") {
            console.warn("Worker(): Importing data: URLs requires Node 12.10+. Falling back to classic worker.");
            return evaluateDataUrl(mod, name2);
          }
          console.error(err);
        }).then(flush);
      } else {
        try {
          if (/^data:/.test(mod)) {
            evaluateDataUrl(mod, name2);
          } else {
            require(mod);
          }
        } catch (err) {
          console.error(err);
        }
        Promise.resolve().then(flush);
      }
    }
    function evaluateDataUrl(url, name2) {
      const {
        data
      } = parseDataUrl(url);
      return VM.runInThisContext(data, {
        filename: "worker.<" + (name2 || "data:") + ">"
      });
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
      return {
        type,
        data
      };
    }
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
    let [name2, value2] = v.split("=");
    name2 = name2.trim();
    name2 = name2.replace(/\d+$/, "");
    const spread = name2.includes("...");
    name2 = name2.replace("...", "");
    try {
      if (name2)
        info.set(name2, {
          state: (0, eval)(`(${value2})`),
          spread
        });
    } catch (e) {
      info.set(name2, {});
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
    let changed = (value2) => {
      onchange(value2);
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
        if (this.arguments) {
          params.forEach((o, k) => {
            if (!this.arguments.has(k))
              this.arguments.set(k, o.state);
          });
        }
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
  const path2 = ["this"];
  function clear() {
    refs.clear();
    parents.length = 0;
    path2.length = 1;
  }
  function updateParents(key, value2) {
    var idx = parents.length - 1;
    var prev = parents[idx];
    if (typeof prev === "object") {
      if (prev[key] === value2 || idx === 0) {
        path2.push(key);
        parents.push(value2.pushed);
      } else {
        while (idx-- >= 0) {
          prev = parents[idx];
          if (typeof prev === "object") {
            if (prev[key] === value2) {
              idx += 2;
              parents.length = idx;
              path2.length = idx;
              --idx;
              parents[idx] = value2;
              path2[idx] = key;
              break;
            }
          }
          idx--;
        }
      }
    }
  }
  function checkCircular(key, value2) {
    if (value2 != null) {
      if (typeof value2 === "object") {
        if (key) {
          updateParents(key, value2);
        }
        let other = refs.get(value2);
        if (other) {
          return "[Circular Reference]" + other;
        } else {
          refs.set(value2, path2.join("."));
        }
      }
    }
    return value2;
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
  function updateParents(key, value2) {
    var idx = parents.length - 1;
    if (parents[idx]) {
      var prev = parents[idx];
      if (typeof prev === "object") {
        if (prev[key] === value2 || idx === 0) {
          path2.push(key);
          parents.push(value2.pushed);
        } else {
          while (idx-- >= 0) {
            prev = parents[idx];
            if (typeof prev === "object") {
              if (prev[key] === value2) {
                idx += 2;
                parents.length = idx;
                path2.length = idx;
                --idx;
                parents[idx] = value2;
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
  function checkValues(key, value2) {
    let val;
    if (value2 != null) {
      if (typeof value2 === "object") {
        let c = value2.constructor.name;
        if (key && c === "Object") {
          updateParents(key, value2);
        }
        let other = refs.get(value2);
        if (other) {
          return "[Circular Reference]" + other;
        } else {
          refs.set(value2, path2.join("."));
        }
        if (c === "Array") {
          if (value2.length > 20) {
            val = value2.slice(value2.length - 20);
          } else
            val = value2;
        } else if (c.includes("Set")) {
          val = Array.from(value2);
        } else if (c !== "Object" && c !== "Number" && c !== "String" && c !== "Boolean") {
          val = "instanceof_" + c;
        } else if (c === "Object") {
          let obj = {};
          for (const prop in value2) {
            if (value2[prop] == null) {
              obj[prop] = value2[prop];
            } else if (Array.isArray(value2[prop])) {
              if (value2[prop].length > 20)
                obj[prop] = value2[prop].slice(value2[prop].length - 20);
              else
                obj[prop] = value2[prop];
            } else if (value2[prop].constructor.name === "Object") {
              obj[prop] = {};
              for (const p in value2[prop]) {
                if (Array.isArray(value2[prop][p])) {
                  if (value2[prop][p].length > 20)
                    obj[prop][p] = value2[prop][p].slice(value2[prop][p].length - 20);
                  else
                    obj[prop][p] = value2[prop][p];
                } else {
                  if (value2[prop][p] != null) {
                    let con = value2[prop][p].constructor.name;
                    if (con.includes("Set")) {
                      obj[prop][p] = Array.from(value2[prop][p]);
                    } else if (con !== "Number" && con !== "String" && con !== "Boolean") {
                      obj[prop][p] = "instanceof_" + con;
                    } else {
                      obj[prop][p] = value2[prop][p];
                    }
                  } else {
                    obj[prop][p] = value2[prop][p];
                  }
                }
              }
            } else {
              let con = value2[prop].constructor.name;
              if (con.includes("Set")) {
                obj[prop] = Array.from(value2[prop]);
              } else if (con !== "Number" && con !== "String" && con !== "Boolean") {
                obj[prop] = "instanceof_" + con;
              } else {
                obj[prop] = value2[prop];
              }
            }
          }
          val = obj;
        } else {
          val = value2;
        }
      } else {
        val = value2;
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
          let name2;
          if (includeClassName) {
            name2 = service.name;
            if (!name2) {
              name2 = service.tag;
              service.name = name2;
            }
            if (!name2) {
              name2 = `graph${Math.floor(Math.random() * 1e15)}`;
              service.name = name2;
              service.tag = name2;
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
          let name2 = routes.constructor.name;
          if (name2 === "Object") {
            name2 = Object.prototype.toString.call(routes);
            if (name2)
              name2 = name2.split(" ")[1];
            if (name2)
              name2 = name2.split("]")[0];
          }
          if (name2 && name2 !== "Object") {
            let module2 = routes;
            routes = {};
            Object.getOwnPropertyNames(module2).forEach((route) => {
              if (includeClassName)
                routes[name2 + routeFormat + route] = module2[route];
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
  isTypedArray(x2) {
    return ArrayBuffer.isView(x2) && Object.prototype.toString.call(x2) !== "[object DataView]";
  }
};

// ../../services/e2ee/E2EE.service.ts
var import_sjcl = __toESM(require_sjcl());

// ../../node_modules/gpujsutils/dist/index.js
(() => {
  var Zt = Object.create;
  var Je = Object.defineProperty;
  var Jt = Object.getOwnPropertyDescriptor;
  var Qt = Object.getOwnPropertyNames;
  var qt = Object.getPrototypeOf, ei = Object.prototype.hasOwnProperty;
  var Re = ((L) => typeof require != "undefined" ? require : typeof Proxy != "undefined" ? new Proxy(L, { get: (I, $) => (typeof require != "undefined" ? require : I)[$] }) : L)(function(L) {
    if (typeof require != "undefined")
      return require.apply(this, arguments);
    throw new Error('Dynamic require of "' + L + '" is not supported');
  });
  var ti = (L, I) => () => (I || L((I = { exports: {} }).exports, I), I.exports), ii = (L, I) => {
    for (var $ in I)
      Je(L, $, { get: I[$], enumerable: true });
  }, ni = (L, I, $, o) => {
    if (I && typeof I == "object" || typeof I == "function")
      for (let y of Qt(I))
        !ei.call(L, y) && y !== $ && Je(L, y, { get: () => I[y], enumerable: !(o = Jt(I, y)) || o.enumerable });
    return L;
  };
  var si = (L, I, $) => ($ = L != null ? Zt(qt(L)) : {}, ni(I || !L || !L.__esModule ? Je($, "default", { value: L, enumerable: true }) : $, L));
  var Et = ti((wt, Qe) => {
    (function(L) {
      if (typeof wt == "object" && typeof Qe < "u")
        Qe.exports = L();
      else if (typeof define == "function" && define.amd)
        define([], L);
      else {
        var I;
        typeof window < "u" ? I = window : typeof global < "u" ? I = global : typeof self < "u" ? I = self : I = this, L();
      }
    })(function() {
      var L, I, $;
      return function() {
        function o(y, E, p) {
          function g(n, s) {
            if (!E[n]) {
              if (!y[n]) {
                var t = typeof Re == "function" && Re;
                if (!s && t)
                  return t(n, true);
                if (f)
                  return f(n, true);
                var i = new Error("Cannot find module '" + n + "'");
                throw i.code = "MODULE_NOT_FOUND", i;
              }
              var u = E[n] = { exports: {} };
              y[n][0].call(u.exports, function(x2) {
                var w = y[n][1][x2];
                return g(w || x2);
              }, u, u.exports, o, y, E, p);
            }
            return E[n].exports;
          }
          for (var f = typeof Re == "function" && Re, l = 0; l < p.length; l++)
            g(p[l]);
          return g;
        }
        return o;
      }()({ 1: [function(o, y, E) {
        (function(p, g) {
          typeof E == "object" && typeof y < "u" ? g(E) : typeof L == "function" && L.amd ? L(["exports"], g) : (p = p || self, g(p.acorn = {}));
        })(this, function(p) {
          "use strict";
          var g = { 3: "abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile", 5: "class enum extends super const export import", 6: "enum", strict: "implements interface let package private protected public static yield", strictBind: "eval arguments" }, f = "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this", l = { 5: f, "5module": f + " export import", 6: f + " const class extends export import super" }, n = /^in(stanceof)?$/, s = "\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEF\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7BF\uA7C2-\uA7C6\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB67\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC", t = "\u200C\u200D\xB7\u0300-\u036F\u0387\u0483-\u0487\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u0669\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u06F0-\u06F9\u0711\u0730-\u074A\u07A6-\u07B0\u07C0-\u07C9\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08D3-\u08E1\u08E3-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0966-\u096F\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u09E6-\u09EF\u09FE\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A66-\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0AE6-\u0AEF\u0AFA-\u0AFF\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B62\u0B63\u0B66-\u0B6F\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0BE6-\u0BEF\u0C00-\u0C04\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0CE6-\u0CEF\u0D00-\u0D03\u0D3B\u0D3C\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D66-\u0D6F\u0D82\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0E50-\u0E59\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECD\u0ED0-\u0ED9\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1040-\u1049\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F-\u109D\u135D-\u135F\u1369-\u1371\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u18A9\u1920-\u192B\u1930-\u193B\u1946-\u194F\u19D0-\u19DA\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AB0-\u1ABD\u1B00-\u1B04\u1B34-\u1B44\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BB0-\u1BB9\u1BE6-\u1BF3\u1C24-\u1C37\u1C40-\u1C49\u1C50-\u1C59\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF4\u1CF7-\u1CF9\u1DC0-\u1DF9\u1DFB-\u1DFF\u203F\u2040\u2054\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA620-\uA629\uA66F\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA880\uA881\uA8B4-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F1\uA8FF-\uA909\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9D0-\uA9D9\uA9E5\uA9F0-\uA9F9\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA50-\uAA59\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uABF0-\uABF9\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFF10-\uFF19\uFF3F", i = new RegExp("[" + s + "]"), u = new RegExp("[" + s + t + "]");
          s = t = null;
          var x2 = [0, 11, 2, 25, 2, 18, 2, 1, 2, 14, 3, 13, 35, 122, 70, 52, 268, 28, 4, 48, 48, 31, 14, 29, 6, 37, 11, 29, 3, 35, 5, 7, 2, 4, 43, 157, 19, 35, 5, 35, 5, 39, 9, 51, 157, 310, 10, 21, 11, 7, 153, 5, 3, 0, 2, 43, 2, 1, 4, 0, 3, 22, 11, 22, 10, 30, 66, 18, 2, 1, 11, 21, 11, 25, 71, 55, 7, 1, 65, 0, 16, 3, 2, 2, 2, 28, 43, 28, 4, 28, 36, 7, 2, 27, 28, 53, 11, 21, 11, 18, 14, 17, 111, 72, 56, 50, 14, 50, 14, 35, 477, 28, 11, 0, 9, 21, 155, 22, 13, 52, 76, 44, 33, 24, 27, 35, 30, 0, 12, 34, 4, 0, 13, 47, 15, 3, 22, 0, 2, 0, 36, 17, 2, 24, 85, 6, 2, 0, 2, 3, 2, 14, 2, 9, 8, 46, 39, 7, 3, 1, 3, 21, 2, 6, 2, 1, 2, 4, 4, 0, 19, 0, 13, 4, 159, 52, 19, 3, 21, 0, 33, 47, 21, 1, 2, 0, 185, 46, 42, 3, 37, 47, 21, 0, 60, 42, 14, 0, 72, 26, 230, 43, 117, 63, 32, 0, 161, 7, 3, 38, 17, 0, 2, 0, 29, 0, 11, 39, 8, 0, 22, 0, 12, 45, 20, 0, 35, 56, 264, 8, 2, 36, 18, 0, 50, 29, 113, 6, 2, 1, 2, 37, 22, 0, 26, 5, 2, 1, 2, 31, 15, 0, 328, 18, 270, 921, 103, 110, 18, 195, 2749, 1070, 4050, 582, 8634, 568, 8, 30, 114, 29, 19, 47, 17, 3, 32, 20, 6, 18, 689, 63, 129, 74, 6, 0, 67, 12, 65, 1, 2, 0, 29, 6135, 9, 754, 9486, 286, 50, 2, 18, 3, 9, 395, 2309, 106, 6, 12, 4, 8, 8, 9, 5991, 84, 2, 70, 2, 1, 3, 0, 3, 1, 3, 3, 2, 11, 2, 0, 2, 6, 2, 64, 2, 3, 3, 7, 2, 6, 2, 27, 2, 3, 2, 4, 2, 0, 4, 6, 2, 339, 3, 24, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 7, 2357, 44, 11, 6, 17, 0, 370, 43, 1301, 196, 60, 67, 8, 0, 1205, 3, 2, 26, 2, 1, 2, 0, 3, 0, 2, 9, 2, 3, 2, 0, 2, 0, 7, 0, 5, 0, 2, 0, 2, 0, 2, 2, 2, 1, 2, 0, 3, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 1, 2, 0, 3, 3, 2, 6, 2, 3, 2, 3, 2, 0, 2, 9, 2, 16, 6, 2, 2, 4, 2, 16, 4421, 42710, 42, 4148, 12, 221, 3, 5761, 15, 7472, 3104, 541], w = [509, 0, 227, 0, 150, 4, 294, 9, 1368, 2, 2, 1, 6, 3, 41, 2, 5, 0, 166, 1, 574, 3, 9, 9, 525, 10, 176, 2, 54, 14, 32, 9, 16, 3, 46, 10, 54, 9, 7, 2, 37, 13, 2, 9, 6, 1, 45, 0, 13, 2, 49, 13, 9, 3, 4, 9, 83, 11, 7, 0, 161, 11, 6, 9, 7, 3, 56, 1, 2, 6, 3, 1, 3, 2, 10, 0, 11, 1, 3, 6, 4, 4, 193, 17, 10, 9, 5, 0, 82, 19, 13, 9, 214, 6, 3, 8, 28, 1, 83, 16, 16, 9, 82, 12, 9, 9, 84, 14, 5, 9, 243, 14, 166, 9, 232, 6, 3, 6, 4, 0, 29, 9, 41, 6, 2, 3, 9, 0, 10, 10, 47, 15, 406, 7, 2, 7, 17, 9, 57, 21, 2, 13, 123, 5, 4, 0, 2, 1, 2, 6, 2, 0, 9, 9, 49, 4, 2, 1, 2, 4, 9, 9, 330, 3, 19306, 9, 135, 4, 60, 6, 26, 9, 1014, 0, 2, 54, 8, 3, 19723, 1, 5319, 4, 4, 5, 9, 7, 3, 6, 31, 3, 149, 2, 1418, 49, 513, 54, 5, 49, 9, 0, 15, 0, 23, 4, 2, 14, 1361, 6, 2, 16, 3, 6, 2, 1, 2, 4, 262, 6, 10, 9, 419, 13, 1495, 6, 110, 6, 6, 9, 792487, 239];
          function m(e, r) {
            for (var d = 65536, _ = 0; _ < r.length; _ += 2) {
              if (d += r[_], d > e)
                return false;
              if (d += r[_ + 1], d >= e)
                return true;
            }
          }
          function S(e, r) {
            return e < 65 ? e === 36 : e < 91 ? true : e < 97 ? e === 95 : e < 123 ? true : e <= 65535 ? e >= 170 && i.test(String.fromCharCode(e)) : r === false ? false : m(e, x2);
          }
          function v(e, r) {
            return e < 48 ? e === 36 : e < 58 ? true : e < 65 ? false : e < 91 ? true : e < 97 ? e === 95 : e < 123 ? true : e <= 65535 ? e >= 170 && u.test(String.fromCharCode(e)) : r === false ? false : m(e, x2) || m(e, w);
          }
          var h = function(r, d) {
            d === void 0 && (d = {}), this.label = r, this.keyword = d.keyword, this.beforeExpr = !!d.beforeExpr, this.startsExpr = !!d.startsExpr, this.isLoop = !!d.isLoop, this.isAssign = !!d.isAssign, this.prefix = !!d.prefix, this.postfix = !!d.postfix, this.binop = d.binop || null, this.updateContext = null;
          };
          function b(e, r) {
            return new h(e, { beforeExpr: true, binop: r });
          }
          var T = { beforeExpr: true }, C = { startsExpr: true }, V = {};
          function c(e, r) {
            return r === void 0 && (r = {}), r.keyword = e, V[e] = new h(e, r);
          }
          var a = { num: new h("num", C), regexp: new h("regexp", C), string: new h("string", C), name: new h("name", C), eof: new h("eof"), bracketL: new h("[", { beforeExpr: true, startsExpr: true }), bracketR: new h("]"), braceL: new h("{", { beforeExpr: true, startsExpr: true }), braceR: new h("}"), parenL: new h("(", { beforeExpr: true, startsExpr: true }), parenR: new h(")"), comma: new h(",", T), semi: new h(";", T), colon: new h(":", T), dot: new h("."), question: new h("?", T), arrow: new h("=>", T), template: new h("template"), invalidTemplate: new h("invalidTemplate"), ellipsis: new h("...", T), backQuote: new h("`", C), dollarBraceL: new h("${", { beforeExpr: true, startsExpr: true }), eq: new h("=", { beforeExpr: true, isAssign: true }), assign: new h("_=", { beforeExpr: true, isAssign: true }), incDec: new h("++/--", { prefix: true, postfix: true, startsExpr: true }), prefix: new h("!/~", { beforeExpr: true, prefix: true, startsExpr: true }), logicalOR: b("||", 1), logicalAND: b("&&", 2), bitwiseOR: b("|", 3), bitwiseXOR: b("^", 4), bitwiseAND: b("&", 5), equality: b("==/!=/===/!==", 6), relational: b("</>/<=/>=", 7), bitShift: b("<</>>/>>>", 8), plusMin: new h("+/-", { beforeExpr: true, binop: 9, prefix: true, startsExpr: true }), modulo: b("%", 10), star: b("*", 10), slash: b("/", 10), starstar: new h("**", { beforeExpr: true }), _break: c("break"), _case: c("case", T), _catch: c("catch"), _continue: c("continue"), _debugger: c("debugger"), _default: c("default", T), _do: c("do", { isLoop: true, beforeExpr: true }), _else: c("else", T), _finally: c("finally"), _for: c("for", { isLoop: true }), _function: c("function", C), _if: c("if"), _return: c("return", T), _switch: c("switch"), _throw: c("throw", T), _try: c("try"), _var: c("var"), _const: c("const"), _while: c("while", { isLoop: true }), _with: c("with"), _new: c("new", { beforeExpr: true, startsExpr: true }), _this: c("this", C), _super: c("super", C), _class: c("class", C), _extends: c("extends", T), _export: c("export"), _import: c("import", C), _null: c("null", C), _true: c("true", C), _false: c("false", C), _in: c("in", { beforeExpr: true, binop: 7 }), _instanceof: c("instanceof", { beforeExpr: true, binop: 7 }), _typeof: c("typeof", { beforeExpr: true, prefix: true, startsExpr: true }), _void: c("void", { beforeExpr: true, prefix: true, startsExpr: true }), _delete: c("delete", { beforeExpr: true, prefix: true, startsExpr: true }) }, k = /\r\n?|\n|\u2028|\u2029/, A = new RegExp(k.source, "g");
          function N(e, r) {
            return e === 10 || e === 13 || !r && (e === 8232 || e === 8233);
          }
          var F = /[\u1680\u2000-\u200a\u202f\u205f\u3000\ufeff]/, R = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g, K = Object.prototype, O = K.hasOwnProperty, X = K.toString;
          function B(e, r) {
            return O.call(e, r);
          }
          var P = Array.isArray || function(e) {
            return X.call(e) === "[object Array]";
          };
          function Y(e) {
            return new RegExp("^(?:" + e.replace(/ /g, "|") + ")$");
          }
          var J = function(r, d) {
            this.line = r, this.column = d;
          };
          J.prototype.offset = function(r) {
            return new J(this.line, this.column + r);
          };
          var q = function(r, d, _) {
            this.start = d, this.end = _, r.sourceFile !== null && (this.source = r.sourceFile);
          };
          function j(e, r) {
            for (var d = 1, _ = 0; ; ) {
              A.lastIndex = _;
              var D = A.exec(e);
              if (D && D.index < r)
                ++d, _ = D.index + D[0].length;
              else
                return new J(d, r - _);
            }
          }
          var U = { ecmaVersion: 10, sourceType: "script", onInsertedSemicolon: null, onTrailingComma: null, allowReserved: null, allowReturnOutsideFunction: false, allowImportExportEverywhere: false, allowAwaitOutsideFunction: false, allowHashBang: false, locations: false, onToken: null, onComment: null, ranges: false, program: null, sourceFile: null, directSourceFile: null, preserveParens: false };
          function oe(e) {
            var r = {};
            for (var d in U)
              r[d] = e && B(e, d) ? e[d] : U[d];
            if (r.ecmaVersion >= 2015 && (r.ecmaVersion -= 2009), r.allowReserved == null && (r.allowReserved = r.ecmaVersion < 5), P(r.onToken)) {
              var _ = r.onToken;
              r.onToken = function(D) {
                return _.push(D);
              };
            }
            return P(r.onComment) && (r.onComment = Z(r, r.onComment)), r;
          }
          function Z(e, r) {
            return function(d, _, D, M, z, G) {
              var H = { type: d ? "Block" : "Line", value: _, start: D, end: M };
              e.locations && (H.loc = new q(this, z, G)), e.ranges && (H.range = [D, M]), r.push(H);
            };
          }
          var ee = 1, be = 2, Q = ee | be, ue = 4, he = 8, pe = 16, te = 32, re = 64, de = 128;
          function Te(e, r) {
            return be | (e ? ue : 0) | (r ? he : 0);
          }
          var Se = 0, Ce = 1, _e = 2, st = 3, rt = 4, at = 5, le = function(r, d, _) {
            this.options = r = oe(r), this.sourceFile = r.sourceFile, this.keywords = Y(l[r.ecmaVersion >= 6 ? 6 : r.sourceType === "module" ? "5module" : 5]);
            var D = "";
            if (r.allowReserved !== true) {
              for (var M = r.ecmaVersion; !(D = g[M]); M--)
                ;
              r.sourceType === "module" && (D += " await");
            }
            this.reservedWords = Y(D);
            var z = (D ? D + " " : "") + g.strict;
            this.reservedWordsStrict = Y(z), this.reservedWordsStrictBind = Y(z + " " + g.strictBind), this.input = String(d), this.containsEsc = false, _ ? (this.pos = _, this.lineStart = this.input.lastIndexOf(`
`, _ - 1) + 1, this.curLine = this.input.slice(0, this.lineStart).split(k).length) : (this.pos = this.lineStart = 0, this.curLine = 1), this.type = a.eof, this.value = null, this.start = this.end = this.pos, this.startLoc = this.endLoc = this.curPosition(), this.lastTokEndLoc = this.lastTokStartLoc = null, this.lastTokStart = this.lastTokEnd = this.pos, this.context = this.initialContext(), this.exprAllowed = true, this.inModule = r.sourceType === "module", this.strict = this.inModule || this.strictDirective(this.pos), this.potentialArrowAt = -1, this.yieldPos = this.awaitPos = this.awaitIdentPos = 0, this.labels = [], this.undefinedExports = {}, this.pos === 0 && r.allowHashBang && this.input.slice(0, 2) === "#!" && this.skipLineComment(2), this.scopeStack = [], this.enterScope(ee), this.regexpState = null;
          }, Ae = { inFunction: { configurable: true }, inGenerator: { configurable: true }, inAsync: { configurable: true }, allowSuper: { configurable: true }, allowDirectSuper: { configurable: true }, treatFunctionsAsVar: { configurable: true } };
          le.prototype.parse = function() {
            var r = this.options.program || this.startNode();
            return this.nextToken(), this.parseTopLevel(r);
          }, Ae.inFunction.get = function() {
            return (this.currentVarScope().flags & be) > 0;
          }, Ae.inGenerator.get = function() {
            return (this.currentVarScope().flags & he) > 0;
          }, Ae.inAsync.get = function() {
            return (this.currentVarScope().flags & ue) > 0;
          }, Ae.allowSuper.get = function() {
            return (this.currentThisScope().flags & re) > 0;
          }, Ae.allowDirectSuper.get = function() {
            return (this.currentThisScope().flags & de) > 0;
          }, Ae.treatFunctionsAsVar.get = function() {
            return this.treatFunctionsAsVarInScope(this.currentScope());
          }, le.prototype.inNonArrowFunction = function() {
            return (this.currentThisScope().flags & be) > 0;
          }, le.extend = function() {
            for (var r = [], d = arguments.length; d--; )
              r[d] = arguments[d];
            for (var _ = this, D = 0; D < r.length; D++)
              _ = r[D](_);
            return _;
          }, le.parse = function(r, d) {
            return new this(d, r).parse();
          }, le.parseExpressionAt = function(r, d, _) {
            var D = new this(_, r, d);
            return D.nextToken(), D.parseExpression();
          }, le.tokenizer = function(r, d) {
            return new this(d, r);
          }, Object.defineProperties(le.prototype, Ae);
          var ge = le.prototype, Ft = /^(?:'((?:\\.|[^'])*?)'|"((?:\\.|[^"])*?)")/;
          ge.strictDirective = function(e) {
            for (; ; ) {
              R.lastIndex = e, e += R.exec(this.input)[0].length;
              var r = Ft.exec(this.input.slice(e));
              if (!r)
                return false;
              if ((r[1] || r[2]) === "use strict")
                return true;
              e += r[0].length, R.lastIndex = e, e += R.exec(this.input)[0].length, this.input[e] === ";" && e++;
            }
          }, ge.eat = function(e) {
            return this.type === e ? (this.next(), true) : false;
          }, ge.isContextual = function(e) {
            return this.type === a.name && this.value === e && !this.containsEsc;
          }, ge.eatContextual = function(e) {
            return this.isContextual(e) ? (this.next(), true) : false;
          }, ge.expectContextual = function(e) {
            this.eatContextual(e) || this.unexpected();
          }, ge.canInsertSemicolon = function() {
            return this.type === a.eof || this.type === a.braceR || k.test(this.input.slice(this.lastTokEnd, this.start));
          }, ge.insertSemicolon = function() {
            if (this.canInsertSemicolon())
              return this.options.onInsertedSemicolon && this.options.onInsertedSemicolon(this.lastTokEnd, this.lastTokEndLoc), true;
          }, ge.semicolon = function() {
            !this.eat(a.semi) && !this.insertSemicolon() && this.unexpected();
          }, ge.afterTrailingComma = function(e, r) {
            if (this.type === e)
              return this.options.onTrailingComma && this.options.onTrailingComma(this.lastTokStart, this.lastTokStartLoc), r || this.next(), true;
          }, ge.expect = function(e) {
            this.eat(e) || this.unexpected();
          }, ge.unexpected = function(e) {
            this.raise(e ?? this.start, "Unexpected token");
          };
          function Ve() {
            this.shorthandAssign = this.trailingComma = this.parenthesizedAssign = this.parenthesizedBind = this.doubleProto = -1;
          }
          ge.checkPatternErrors = function(e, r) {
            if (!!e) {
              e.trailingComma > -1 && this.raiseRecoverable(e.trailingComma, "Comma is not permitted after the rest element");
              var d = r ? e.parenthesizedAssign : e.parenthesizedBind;
              d > -1 && this.raiseRecoverable(d, "Parenthesized pattern");
            }
          }, ge.checkExpressionErrors = function(e, r) {
            if (!e)
              return false;
            var d = e.shorthandAssign, _ = e.doubleProto;
            if (!r)
              return d >= 0 || _ >= 0;
            d >= 0 && this.raise(d, "Shorthand property assignments are valid only in destructuring patterns"), _ >= 0 && this.raiseRecoverable(_, "Redefinition of __proto__ property");
          }, ge.checkYieldAwaitInDefaultParams = function() {
            this.yieldPos && (!this.awaitPos || this.yieldPos < this.awaitPos) && this.raise(this.yieldPos, "Yield expression cannot be a default value"), this.awaitPos && this.raise(this.awaitPos, "Await expression cannot be a default value");
          }, ge.isSimpleAssignTarget = function(e) {
            return e.type === "ParenthesizedExpression" ? this.isSimpleAssignTarget(e.expression) : e.type === "Identifier" || e.type === "MemberExpression";
          };
          var ie = le.prototype;
          ie.parseTopLevel = function(e) {
            var r = {};
            for (e.body || (e.body = []); this.type !== a.eof; ) {
              var d = this.parseStatement(null, true, r);
              e.body.push(d);
            }
            if (this.inModule)
              for (var _ = 0, D = Object.keys(this.undefinedExports); _ < D.length; _ += 1) {
                var M = D[_];
                this.raiseRecoverable(this.undefinedExports[M].start, "Export '" + M + "' is not defined");
              }
            return this.adaptDirectivePrologue(e.body), this.next(), e.sourceType = this.options.sourceType, this.finishNode(e, "Program");
          };
          var He = { kind: "loop" }, $t = { kind: "switch" };
          ie.isLet = function(e) {
            if (this.options.ecmaVersion < 6 || !this.isContextual("let"))
              return false;
            R.lastIndex = this.pos;
            var r = R.exec(this.input), d = this.pos + r[0].length, _ = this.input.charCodeAt(d);
            if (_ === 91)
              return true;
            if (e)
              return false;
            if (_ === 123)
              return true;
            if (S(_, true)) {
              for (var D = d + 1; v(this.input.charCodeAt(D), true); )
                ++D;
              var M = this.input.slice(d, D);
              if (!n.test(M))
                return true;
            }
            return false;
          }, ie.isAsyncFunction = function() {
            if (this.options.ecmaVersion < 8 || !this.isContextual("async"))
              return false;
            R.lastIndex = this.pos;
            var e = R.exec(this.input), r = this.pos + e[0].length;
            return !k.test(this.input.slice(this.pos, r)) && this.input.slice(r, r + 8) === "function" && (r + 8 === this.input.length || !v(this.input.charAt(r + 8)));
          }, ie.parseStatement = function(e, r, d) {
            var _ = this.type, D = this.startNode(), M;
            switch (this.isLet(e) && (_ = a._var, M = "let"), _) {
              case a._break:
              case a._continue:
                return this.parseBreakContinueStatement(D, _.keyword);
              case a._debugger:
                return this.parseDebuggerStatement(D);
              case a._do:
                return this.parseDoStatement(D);
              case a._for:
                return this.parseForStatement(D);
              case a._function:
                return e && (this.strict || e !== "if" && e !== "label") && this.options.ecmaVersion >= 6 && this.unexpected(), this.parseFunctionStatement(D, false, !e);
              case a._class:
                return e && this.unexpected(), this.parseClass(D, true);
              case a._if:
                return this.parseIfStatement(D);
              case a._return:
                return this.parseReturnStatement(D);
              case a._switch:
                return this.parseSwitchStatement(D);
              case a._throw:
                return this.parseThrowStatement(D);
              case a._try:
                return this.parseTryStatement(D);
              case a._const:
              case a._var:
                return M = M || this.value, e && M !== "var" && this.unexpected(), this.parseVarStatement(D, M);
              case a._while:
                return this.parseWhileStatement(D);
              case a._with:
                return this.parseWithStatement(D);
              case a.braceL:
                return this.parseBlock(true, D);
              case a.semi:
                return this.parseEmptyStatement(D);
              case a._export:
              case a._import:
                if (this.options.ecmaVersion > 10 && _ === a._import) {
                  R.lastIndex = this.pos;
                  var z = R.exec(this.input), G = this.pos + z[0].length, H = this.input.charCodeAt(G);
                  if (H === 40)
                    return this.parseExpressionStatement(D, this.parseExpression());
                }
                return this.options.allowImportExportEverywhere || (r || this.raise(this.start, "'import' and 'export' may only appear at the top level"), this.inModule || this.raise(this.start, "'import' and 'export' may appear only with 'sourceType: module'")), _ === a._import ? this.parseImport(D) : this.parseExport(D, d);
              default:
                if (this.isAsyncFunction())
                  return e && this.unexpected(), this.next(), this.parseFunctionStatement(D, true, !e);
                var ae = this.value, ye = this.parseExpression();
                return _ === a.name && ye.type === "Identifier" && this.eat(a.colon) ? this.parseLabeledStatement(D, ae, ye, e) : this.parseExpressionStatement(D, ye);
            }
          }, ie.parseBreakContinueStatement = function(e, r) {
            var d = r === "break";
            this.next(), this.eat(a.semi) || this.insertSemicolon() ? e.label = null : this.type !== a.name ? this.unexpected() : (e.label = this.parseIdent(), this.semicolon());
            for (var _ = 0; _ < this.labels.length; ++_) {
              var D = this.labels[_];
              if ((e.label == null || D.name === e.label.name) && (D.kind != null && (d || D.kind === "loop") || e.label && d))
                break;
            }
            return _ === this.labels.length && this.raise(e.start, "Unsyntactic " + r), this.finishNode(e, d ? "BreakStatement" : "ContinueStatement");
          }, ie.parseDebuggerStatement = function(e) {
            return this.next(), this.semicolon(), this.finishNode(e, "DebuggerStatement");
          }, ie.parseDoStatement = function(e) {
            return this.next(), this.labels.push(He), e.body = this.parseStatement("do"), this.labels.pop(), this.expect(a._while), e.test = this.parseParenExpression(), this.options.ecmaVersion >= 6 ? this.eat(a.semi) : this.semicolon(), this.finishNode(e, "DoWhileStatement");
          }, ie.parseForStatement = function(e) {
            this.next();
            var r = this.options.ecmaVersion >= 9 && (this.inAsync || !this.inFunction && this.options.allowAwaitOutsideFunction) && this.eatContextual("await") ? this.lastTokStart : -1;
            if (this.labels.push(He), this.enterScope(0), this.expect(a.parenL), this.type === a.semi)
              return r > -1 && this.unexpected(r), this.parseFor(e, null);
            var d = this.isLet();
            if (this.type === a._var || this.type === a._const || d) {
              var _ = this.startNode(), D = d ? "let" : this.value;
              return this.next(), this.parseVar(_, true, D), this.finishNode(_, "VariableDeclaration"), (this.type === a._in || this.options.ecmaVersion >= 6 && this.isContextual("of")) && _.declarations.length === 1 ? (this.options.ecmaVersion >= 9 && (this.type === a._in ? r > -1 && this.unexpected(r) : e.await = r > -1), this.parseForIn(e, _)) : (r > -1 && this.unexpected(r), this.parseFor(e, _));
            }
            var M = new Ve(), z = this.parseExpression(true, M);
            return this.type === a._in || this.options.ecmaVersion >= 6 && this.isContextual("of") ? (this.options.ecmaVersion >= 9 && (this.type === a._in ? r > -1 && this.unexpected(r) : e.await = r > -1), this.toAssignable(z, false, M), this.checkLVal(z), this.parseForIn(e, z)) : (this.checkExpressionErrors(M, true), r > -1 && this.unexpected(r), this.parseFor(e, z));
          }, ie.parseFunctionStatement = function(e, r, d) {
            return this.next(), this.parseFunction(e, Le | (d ? 0 : Xe), false, r);
          }, ie.parseIfStatement = function(e) {
            return this.next(), e.test = this.parseParenExpression(), e.consequent = this.parseStatement("if"), e.alternate = this.eat(a._else) ? this.parseStatement("if") : null, this.finishNode(e, "IfStatement");
          }, ie.parseReturnStatement = function(e) {
            return !this.inFunction && !this.options.allowReturnOutsideFunction && this.raise(this.start, "'return' outside of function"), this.next(), this.eat(a.semi) || this.insertSemicolon() ? e.argument = null : (e.argument = this.parseExpression(), this.semicolon()), this.finishNode(e, "ReturnStatement");
          }, ie.parseSwitchStatement = function(e) {
            this.next(), e.discriminant = this.parseParenExpression(), e.cases = [], this.expect(a.braceL), this.labels.push($t), this.enterScope(0);
            for (var r, d = false; this.type !== a.braceR; )
              if (this.type === a._case || this.type === a._default) {
                var _ = this.type === a._case;
                r && this.finishNode(r, "SwitchCase"), e.cases.push(r = this.startNode()), r.consequent = [], this.next(), _ ? r.test = this.parseExpression() : (d && this.raiseRecoverable(this.lastTokStart, "Multiple default clauses"), d = true, r.test = null), this.expect(a.colon);
              } else
                r || this.unexpected(), r.consequent.push(this.parseStatement(null));
            return this.exitScope(), r && this.finishNode(r, "SwitchCase"), this.next(), this.labels.pop(), this.finishNode(e, "SwitchStatement");
          }, ie.parseThrowStatement = function(e) {
            return this.next(), k.test(this.input.slice(this.lastTokEnd, this.start)) && this.raise(this.lastTokEnd, "Illegal newline after throw"), e.argument = this.parseExpression(), this.semicolon(), this.finishNode(e, "ThrowStatement");
          };
          var Lt = [];
          ie.parseTryStatement = function(e) {
            if (this.next(), e.block = this.parseBlock(), e.handler = null, this.type === a._catch) {
              var r = this.startNode();
              if (this.next(), this.eat(a.parenL)) {
                r.param = this.parseBindingAtom();
                var d = r.param.type === "Identifier";
                this.enterScope(d ? te : 0), this.checkLVal(r.param, d ? rt : _e), this.expect(a.parenR);
              } else
                this.options.ecmaVersion < 10 && this.unexpected(), r.param = null, this.enterScope(0);
              r.body = this.parseBlock(false), this.exitScope(), e.handler = this.finishNode(r, "CatchClause");
            }
            return e.finalizer = this.eat(a._finally) ? this.parseBlock() : null, !e.handler && !e.finalizer && this.raise(e.start, "Missing catch or finally clause"), this.finishNode(e, "TryStatement");
          }, ie.parseVarStatement = function(e, r) {
            return this.next(), this.parseVar(e, false, r), this.semicolon(), this.finishNode(e, "VariableDeclaration");
          }, ie.parseWhileStatement = function(e) {
            return this.next(), e.test = this.parseParenExpression(), this.labels.push(He), e.body = this.parseStatement("while"), this.labels.pop(), this.finishNode(e, "WhileStatement");
          }, ie.parseWithStatement = function(e) {
            return this.strict && this.raise(this.start, "'with' in strict mode"), this.next(), e.object = this.parseParenExpression(), e.body = this.parseStatement("with"), this.finishNode(e, "WithStatement");
          }, ie.parseEmptyStatement = function(e) {
            return this.next(), this.finishNode(e, "EmptyStatement");
          }, ie.parseLabeledStatement = function(e, r, d, _) {
            for (var D = 0, M = this.labels; D < M.length; D += 1) {
              var z = M[D];
              z.name === r && this.raise(d.start, "Label '" + r + "' is already declared");
            }
            for (var G = this.type.isLoop ? "loop" : this.type === a._switch ? "switch" : null, H = this.labels.length - 1; H >= 0; H--) {
              var ae = this.labels[H];
              if (ae.statementStart === e.start)
                ae.statementStart = this.start, ae.kind = G;
              else
                break;
            }
            return this.labels.push({ name: r, kind: G, statementStart: this.start }), e.body = this.parseStatement(_ ? _.indexOf("label") === -1 ? _ + "label" : _ : "label"), this.labels.pop(), e.label = d, this.finishNode(e, "LabeledStatement");
          }, ie.parseExpressionStatement = function(e, r) {
            return e.expression = r, this.semicolon(), this.finishNode(e, "ExpressionStatement");
          }, ie.parseBlock = function(e, r) {
            for (e === void 0 && (e = true), r === void 0 && (r = this.startNode()), r.body = [], this.expect(a.braceL), e && this.enterScope(0); !this.eat(a.braceR); ) {
              var d = this.parseStatement(null);
              r.body.push(d);
            }
            return e && this.exitScope(), this.finishNode(r, "BlockStatement");
          }, ie.parseFor = function(e, r) {
            return e.init = r, this.expect(a.semi), e.test = this.type === a.semi ? null : this.parseExpression(), this.expect(a.semi), e.update = this.type === a.parenR ? null : this.parseExpression(), this.expect(a.parenR), e.body = this.parseStatement("for"), this.exitScope(), this.labels.pop(), this.finishNode(e, "ForStatement");
          }, ie.parseForIn = function(e, r) {
            var d = this.type === a._in;
            return this.next(), r.type === "VariableDeclaration" && r.declarations[0].init != null && (!d || this.options.ecmaVersion < 8 || this.strict || r.kind !== "var" || r.declarations[0].id.type !== "Identifier") ? this.raise(r.start, (d ? "for-in" : "for-of") + " loop variable declaration may not have an initializer") : r.type === "AssignmentPattern" && this.raise(r.start, "Invalid left-hand side in for-loop"), e.left = r, e.right = d ? this.parseExpression() : this.parseMaybeAssign(), this.expect(a.parenR), e.body = this.parseStatement("for"), this.exitScope(), this.labels.pop(), this.finishNode(e, d ? "ForInStatement" : "ForOfStatement");
          }, ie.parseVar = function(e, r, d) {
            for (e.declarations = [], e.kind = d; ; ) {
              var _ = this.startNode();
              if (this.parseVarId(_, d), this.eat(a.eq) ? _.init = this.parseMaybeAssign(r) : d === "const" && !(this.type === a._in || this.options.ecmaVersion >= 6 && this.isContextual("of")) ? this.unexpected() : _.id.type !== "Identifier" && !(r && (this.type === a._in || this.isContextual("of"))) ? this.raise(this.lastTokEnd, "Complex binding patterns require an initialization value") : _.init = null, e.declarations.push(this.finishNode(_, "VariableDeclarator")), !this.eat(a.comma))
                break;
            }
            return e;
          }, ie.parseVarId = function(e, r) {
            e.id = this.parseBindingAtom(), this.checkLVal(e.id, r === "var" ? Ce : _e, false);
          };
          var Le = 1, Xe = 2, ot = 4;
          ie.parseFunction = function(e, r, d, _) {
            this.initFunction(e), (this.options.ecmaVersion >= 9 || this.options.ecmaVersion >= 6 && !_) && (this.type === a.star && r & Xe && this.unexpected(), e.generator = this.eat(a.star)), this.options.ecmaVersion >= 8 && (e.async = !!_), r & Le && (e.id = r & ot && this.type !== a.name ? null : this.parseIdent(), e.id && !(r & Xe) && this.checkLVal(e.id, this.strict || e.generator || e.async ? this.treatFunctionsAsVar ? Ce : _e : st));
            var D = this.yieldPos, M = this.awaitPos, z = this.awaitIdentPos;
            return this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0, this.enterScope(Te(e.async, e.generator)), r & Le || (e.id = this.type === a.name ? this.parseIdent() : null), this.parseFunctionParams(e), this.parseFunctionBody(e, d, false), this.yieldPos = D, this.awaitPos = M, this.awaitIdentPos = z, this.finishNode(e, r & Le ? "FunctionDeclaration" : "FunctionExpression");
          }, ie.parseFunctionParams = function(e) {
            this.expect(a.parenL), e.params = this.parseBindingList(a.parenR, false, this.options.ecmaVersion >= 8), this.checkYieldAwaitInDefaultParams();
          }, ie.parseClass = function(e, r) {
            this.next();
            var d = this.strict;
            this.strict = true, this.parseClassId(e, r), this.parseClassSuper(e);
            var _ = this.startNode(), D = false;
            for (_.body = [], this.expect(a.braceL); !this.eat(a.braceR); ) {
              var M = this.parseClassElement(e.superClass !== null);
              M && (_.body.push(M), M.type === "MethodDefinition" && M.kind === "constructor" && (D && this.raise(M.start, "Duplicate constructor in the same class"), D = true));
            }
            return e.body = this.finishNode(_, "ClassBody"), this.strict = d, this.finishNode(e, r ? "ClassDeclaration" : "ClassExpression");
          }, ie.parseClassElement = function(e) {
            var r = this;
            if (this.eat(a.semi))
              return null;
            var d = this.startNode(), _ = function(H, ae) {
              ae === void 0 && (ae = false);
              var ye = r.start, Ie = r.startLoc;
              return r.eatContextual(H) ? r.type !== a.parenL && (!ae || !r.canInsertSemicolon()) ? true : (d.key && r.unexpected(), d.computed = false, d.key = r.startNodeAt(ye, Ie), d.key.name = H, r.finishNode(d.key, "Identifier"), false) : false;
            };
            d.kind = "method", d.static = _("static");
            var D = this.eat(a.star), M = false;
            D || (this.options.ecmaVersion >= 8 && _("async", true) ? (M = true, D = this.options.ecmaVersion >= 9 && this.eat(a.star)) : _("get") ? d.kind = "get" : _("set") && (d.kind = "set")), d.key || this.parsePropertyName(d);
            var z = d.key, G = false;
            return !d.computed && !d.static && (z.type === "Identifier" && z.name === "constructor" || z.type === "Literal" && z.value === "constructor") ? (d.kind !== "method" && this.raise(z.start, "Constructor can't have get/set modifier"), D && this.raise(z.start, "Constructor can't be a generator"), M && this.raise(z.start, "Constructor can't be an async method"), d.kind = "constructor", G = e) : d.static && z.type === "Identifier" && z.name === "prototype" && this.raise(z.start, "Classes may not have a static property named prototype"), this.parseClassMethod(d, D, M, G), d.kind === "get" && d.value.params.length !== 0 && this.raiseRecoverable(d.value.start, "getter should have no params"), d.kind === "set" && d.value.params.length !== 1 && this.raiseRecoverable(d.value.start, "setter should have exactly one param"), d.kind === "set" && d.value.params[0].type === "RestElement" && this.raiseRecoverable(d.value.params[0].start, "Setter cannot use rest params"), d;
          }, ie.parseClassMethod = function(e, r, d, _) {
            return e.value = this.parseMethod(r, d, _), this.finishNode(e, "MethodDefinition");
          }, ie.parseClassId = function(e, r) {
            this.type === a.name ? (e.id = this.parseIdent(), r && this.checkLVal(e.id, _e, false)) : (r === true && this.unexpected(), e.id = null);
          }, ie.parseClassSuper = function(e) {
            e.superClass = this.eat(a._extends) ? this.parseExprSubscripts() : null;
          }, ie.parseExport = function(e, r) {
            if (this.next(), this.eat(a.star))
              return this.expectContextual("from"), this.type !== a.string && this.unexpected(), e.source = this.parseExprAtom(), this.semicolon(), this.finishNode(e, "ExportAllDeclaration");
            if (this.eat(a._default)) {
              this.checkExport(r, "default", this.lastTokStart);
              var d;
              if (this.type === a._function || (d = this.isAsyncFunction())) {
                var _ = this.startNode();
                this.next(), d && this.next(), e.declaration = this.parseFunction(_, Le | ot, false, d);
              } else if (this.type === a._class) {
                var D = this.startNode();
                e.declaration = this.parseClass(D, "nullableID");
              } else
                e.declaration = this.parseMaybeAssign(), this.semicolon();
              return this.finishNode(e, "ExportDefaultDeclaration");
            }
            if (this.shouldParseExportStatement())
              e.declaration = this.parseStatement(null), e.declaration.type === "VariableDeclaration" ? this.checkVariableExport(r, e.declaration.declarations) : this.checkExport(r, e.declaration.id.name, e.declaration.id.start), e.specifiers = [], e.source = null;
            else {
              if (e.declaration = null, e.specifiers = this.parseExportSpecifiers(r), this.eatContextual("from"))
                this.type !== a.string && this.unexpected(), e.source = this.parseExprAtom();
              else {
                for (var M = 0, z = e.specifiers; M < z.length; M += 1) {
                  var G = z[M];
                  this.checkUnreserved(G.local), this.checkLocalExport(G.local);
                }
                e.source = null;
              }
              this.semicolon();
            }
            return this.finishNode(e, "ExportNamedDeclaration");
          }, ie.checkExport = function(e, r, d) {
            !e || (B(e, r) && this.raiseRecoverable(d, "Duplicate export '" + r + "'"), e[r] = true);
          }, ie.checkPatternExport = function(e, r) {
            var d = r.type;
            if (d === "Identifier")
              this.checkExport(e, r.name, r.start);
            else if (d === "ObjectPattern")
              for (var _ = 0, D = r.properties; _ < D.length; _ += 1) {
                var M = D[_];
                this.checkPatternExport(e, M);
              }
            else if (d === "ArrayPattern")
              for (var z = 0, G = r.elements; z < G.length; z += 1) {
                var H = G[z];
                H && this.checkPatternExport(e, H);
              }
            else
              d === "Property" ? this.checkPatternExport(e, r.value) : d === "AssignmentPattern" ? this.checkPatternExport(e, r.left) : d === "RestElement" ? this.checkPatternExport(e, r.argument) : d === "ParenthesizedExpression" && this.checkPatternExport(e, r.expression);
          }, ie.checkVariableExport = function(e, r) {
            if (!!e)
              for (var d = 0, _ = r; d < _.length; d += 1) {
                var D = _[d];
                this.checkPatternExport(e, D.id);
              }
          }, ie.shouldParseExportStatement = function() {
            return this.type.keyword === "var" || this.type.keyword === "const" || this.type.keyword === "class" || this.type.keyword === "function" || this.isLet() || this.isAsyncFunction();
          }, ie.parseExportSpecifiers = function(e) {
            var r = [], d = true;
            for (this.expect(a.braceL); !this.eat(a.braceR); ) {
              if (d)
                d = false;
              else if (this.expect(a.comma), this.afterTrailingComma(a.braceR))
                break;
              var _ = this.startNode();
              _.local = this.parseIdent(true), _.exported = this.eatContextual("as") ? this.parseIdent(true) : _.local, this.checkExport(e, _.exported.name, _.exported.start), r.push(this.finishNode(_, "ExportSpecifier"));
            }
            return r;
          }, ie.parseImport = function(e) {
            return this.next(), this.type === a.string ? (e.specifiers = Lt, e.source = this.parseExprAtom()) : (e.specifiers = this.parseImportSpecifiers(), this.expectContextual("from"), e.source = this.type === a.string ? this.parseExprAtom() : this.unexpected()), this.semicolon(), this.finishNode(e, "ImportDeclaration");
          }, ie.parseImportSpecifiers = function() {
            var e = [], r = true;
            if (this.type === a.name) {
              var d = this.startNode();
              if (d.local = this.parseIdent(), this.checkLVal(d.local, _e), e.push(this.finishNode(d, "ImportDefaultSpecifier")), !this.eat(a.comma))
                return e;
            }
            if (this.type === a.star) {
              var _ = this.startNode();
              return this.next(), this.expectContextual("as"), _.local = this.parseIdent(), this.checkLVal(_.local, _e), e.push(this.finishNode(_, "ImportNamespaceSpecifier")), e;
            }
            for (this.expect(a.braceL); !this.eat(a.braceR); ) {
              if (r)
                r = false;
              else if (this.expect(a.comma), this.afterTrailingComma(a.braceR))
                break;
              var D = this.startNode();
              D.imported = this.parseIdent(true), this.eatContextual("as") ? D.local = this.parseIdent() : (this.checkUnreserved(D.imported), D.local = D.imported), this.checkLVal(D.local, _e), e.push(this.finishNode(D, "ImportSpecifier"));
            }
            return e;
          }, ie.adaptDirectivePrologue = function(e) {
            for (var r = 0; r < e.length && this.isDirectiveCandidate(e[r]); ++r)
              e[r].directive = e[r].expression.raw.slice(1, -1);
          }, ie.isDirectiveCandidate = function(e) {
            return e.type === "ExpressionStatement" && e.expression.type === "Literal" && typeof e.expression.value == "string" && (this.input[e.start] === '"' || this.input[e.start] === "'");
          };
          var we = le.prototype;
          we.toAssignable = function(e, r, d) {
            if (this.options.ecmaVersion >= 6 && e)
              switch (e.type) {
                case "Identifier":
                  this.inAsync && e.name === "await" && this.raise(e.start, "Cannot use 'await' as identifier inside an async function");
                  break;
                case "ObjectPattern":
                case "ArrayPattern":
                case "RestElement":
                  break;
                case "ObjectExpression":
                  e.type = "ObjectPattern", d && this.checkPatternErrors(d, true);
                  for (var _ = 0, D = e.properties; _ < D.length; _ += 1) {
                    var M = D[_];
                    this.toAssignable(M, r), M.type === "RestElement" && (M.argument.type === "ArrayPattern" || M.argument.type === "ObjectPattern") && this.raise(M.argument.start, "Unexpected token");
                  }
                  break;
                case "Property":
                  e.kind !== "init" && this.raise(e.key.start, "Object pattern can't contain getter or setter"), this.toAssignable(e.value, r);
                  break;
                case "ArrayExpression":
                  e.type = "ArrayPattern", d && this.checkPatternErrors(d, true), this.toAssignableList(e.elements, r);
                  break;
                case "SpreadElement":
                  e.type = "RestElement", this.toAssignable(e.argument, r), e.argument.type === "AssignmentPattern" && this.raise(e.argument.start, "Rest elements cannot have a default value");
                  break;
                case "AssignmentExpression":
                  e.operator !== "=" && this.raise(e.left.end, "Only '=' operator can be used for specifying default value."), e.type = "AssignmentPattern", delete e.operator, this.toAssignable(e.left, r);
                case "AssignmentPattern":
                  break;
                case "ParenthesizedExpression":
                  this.toAssignable(e.expression, r, d);
                  break;
                case "MemberExpression":
                  if (!r)
                    break;
                default:
                  this.raise(e.start, "Assigning to rvalue");
              }
            else
              d && this.checkPatternErrors(d, true);
            return e;
          }, we.toAssignableList = function(e, r) {
            for (var d = e.length, _ = 0; _ < d; _++) {
              var D = e[_];
              D && this.toAssignable(D, r);
            }
            if (d) {
              var M = e[d - 1];
              this.options.ecmaVersion === 6 && r && M && M.type === "RestElement" && M.argument.type !== "Identifier" && this.unexpected(M.argument.start);
            }
            return e;
          }, we.parseSpread = function(e) {
            var r = this.startNode();
            return this.next(), r.argument = this.parseMaybeAssign(false, e), this.finishNode(r, "SpreadElement");
          }, we.parseRestBinding = function() {
            var e = this.startNode();
            return this.next(), this.options.ecmaVersion === 6 && this.type !== a.name && this.unexpected(), e.argument = this.parseBindingAtom(), this.finishNode(e, "RestElement");
          }, we.parseBindingAtom = function() {
            if (this.options.ecmaVersion >= 6)
              switch (this.type) {
                case a.bracketL:
                  var e = this.startNode();
                  return this.next(), e.elements = this.parseBindingList(a.bracketR, true, true), this.finishNode(e, "ArrayPattern");
                case a.braceL:
                  return this.parseObj(true);
              }
            return this.parseIdent();
          }, we.parseBindingList = function(e, r, d) {
            for (var _ = [], D = true; !this.eat(e); )
              if (D ? D = false : this.expect(a.comma), r && this.type === a.comma)
                _.push(null);
              else {
                if (d && this.afterTrailingComma(e))
                  break;
                if (this.type === a.ellipsis) {
                  var M = this.parseRestBinding();
                  this.parseBindingListItem(M), _.push(M), this.type === a.comma && this.raise(this.start, "Comma is not permitted after the rest element"), this.expect(e);
                  break;
                } else {
                  var z = this.parseMaybeDefault(this.start, this.startLoc);
                  this.parseBindingListItem(z), _.push(z);
                }
              }
            return _;
          }, we.parseBindingListItem = function(e) {
            return e;
          }, we.parseMaybeDefault = function(e, r, d) {
            if (d = d || this.parseBindingAtom(), this.options.ecmaVersion < 6 || !this.eat(a.eq))
              return d;
            var _ = this.startNodeAt(e, r);
            return _.left = d, _.right = this.parseMaybeAssign(), this.finishNode(_, "AssignmentPattern");
          }, we.checkLVal = function(e, r, d) {
            switch (r === void 0 && (r = Se), e.type) {
              case "Identifier":
                r === _e && e.name === "let" && this.raiseRecoverable(e.start, "let is disallowed as a lexically bound name"), this.strict && this.reservedWordsStrictBind.test(e.name) && this.raiseRecoverable(e.start, (r ? "Binding " : "Assigning to ") + e.name + " in strict mode"), d && (B(d, e.name) && this.raiseRecoverable(e.start, "Argument name clash"), d[e.name] = true), r !== Se && r !== at && this.declareName(e.name, r, e.start);
                break;
              case "MemberExpression":
                r && this.raiseRecoverable(e.start, "Binding member expression");
                break;
              case "ObjectPattern":
                for (var _ = 0, D = e.properties; _ < D.length; _ += 1) {
                  var M = D[_];
                  this.checkLVal(M, r, d);
                }
                break;
              case "Property":
                this.checkLVal(e.value, r, d);
                break;
              case "ArrayPattern":
                for (var z = 0, G = e.elements; z < G.length; z += 1) {
                  var H = G[z];
                  H && this.checkLVal(H, r, d);
                }
                break;
              case "AssignmentPattern":
                this.checkLVal(e.left, r, d);
                break;
              case "RestElement":
                this.checkLVal(e.argument, r, d);
                break;
              case "ParenthesizedExpression":
                this.checkLVal(e.expression, r, d);
                break;
              default:
                this.raise(e.start, (r ? "Binding" : "Assigning to") + " rvalue");
            }
          };
          var ne = le.prototype;
          ne.checkPropClash = function(e, r, d) {
            if (!(this.options.ecmaVersion >= 9 && e.type === "SpreadElement") && !(this.options.ecmaVersion >= 6 && (e.computed || e.method || e.shorthand))) {
              var _ = e.key, D;
              switch (_.type) {
                case "Identifier":
                  D = _.name;
                  break;
                case "Literal":
                  D = String(_.value);
                  break;
                default:
                  return;
              }
              var M = e.kind;
              if (this.options.ecmaVersion >= 6) {
                D === "__proto__" && M === "init" && (r.proto && (d ? d.doubleProto < 0 && (d.doubleProto = _.start) : this.raiseRecoverable(_.start, "Redefinition of __proto__ property")), r.proto = true);
                return;
              }
              D = "$" + D;
              var z = r[D];
              if (z) {
                var G;
                M === "init" ? G = this.strict && z.init || z.get || z.set : G = z.init || z[M], G && this.raiseRecoverable(_.start, "Redefinition of property");
              } else
                z = r[D] = { init: false, get: false, set: false };
              z[M] = true;
            }
          }, ne.parseExpression = function(e, r) {
            var d = this.start, _ = this.startLoc, D = this.parseMaybeAssign(e, r);
            if (this.type === a.comma) {
              var M = this.startNodeAt(d, _);
              for (M.expressions = [D]; this.eat(a.comma); )
                M.expressions.push(this.parseMaybeAssign(e, r));
              return this.finishNode(M, "SequenceExpression");
            }
            return D;
          }, ne.parseMaybeAssign = function(e, r, d) {
            if (this.isContextual("yield")) {
              if (this.inGenerator)
                return this.parseYield(e);
              this.exprAllowed = false;
            }
            var _ = false, D = -1, M = -1;
            r ? (D = r.parenthesizedAssign, M = r.trailingComma, r.parenthesizedAssign = r.trailingComma = -1) : (r = new Ve(), _ = true);
            var z = this.start, G = this.startLoc;
            (this.type === a.parenL || this.type === a.name) && (this.potentialArrowAt = this.start);
            var H = this.parseMaybeConditional(e, r);
            if (d && (H = d.call(this, H, z, G)), this.type.isAssign) {
              var ae = this.startNodeAt(z, G);
              return ae.operator = this.value, ae.left = this.type === a.eq ? this.toAssignable(H, false, r) : H, _ || (r.parenthesizedAssign = r.trailingComma = r.doubleProto = -1), r.shorthandAssign >= ae.left.start && (r.shorthandAssign = -1), this.checkLVal(H), this.next(), ae.right = this.parseMaybeAssign(e), this.finishNode(ae, "AssignmentExpression");
            } else
              _ && this.checkExpressionErrors(r, true);
            return D > -1 && (r.parenthesizedAssign = D), M > -1 && (r.trailingComma = M), H;
          }, ne.parseMaybeConditional = function(e, r) {
            var d = this.start, _ = this.startLoc, D = this.parseExprOps(e, r);
            if (this.checkExpressionErrors(r))
              return D;
            if (this.eat(a.question)) {
              var M = this.startNodeAt(d, _);
              return M.test = D, M.consequent = this.parseMaybeAssign(), this.expect(a.colon), M.alternate = this.parseMaybeAssign(e), this.finishNode(M, "ConditionalExpression");
            }
            return D;
          }, ne.parseExprOps = function(e, r) {
            var d = this.start, _ = this.startLoc, D = this.parseMaybeUnary(r, false);
            return this.checkExpressionErrors(r) || D.start === d && D.type === "ArrowFunctionExpression" ? D : this.parseExprOp(D, d, _, -1, e);
          }, ne.parseExprOp = function(e, r, d, _, D) {
            var M = this.type.binop;
            if (M != null && (!D || this.type !== a._in) && M > _) {
              var z = this.type === a.logicalOR || this.type === a.logicalAND, G = this.value;
              this.next();
              var H = this.start, ae = this.startLoc, ye = this.parseExprOp(this.parseMaybeUnary(null, false), H, ae, M, D), Ie = this.buildBinary(r, d, e, ye, G, z);
              return this.parseExprOp(Ie, r, d, _, D);
            }
            return e;
          }, ne.buildBinary = function(e, r, d, _, D, M) {
            var z = this.startNodeAt(e, r);
            return z.left = d, z.operator = D, z.right = _, this.finishNode(z, M ? "LogicalExpression" : "BinaryExpression");
          }, ne.parseMaybeUnary = function(e, r) {
            var d = this.start, _ = this.startLoc, D;
            if (this.isContextual("await") && (this.inAsync || !this.inFunction && this.options.allowAwaitOutsideFunction))
              D = this.parseAwait(), r = true;
            else if (this.type.prefix) {
              var M = this.startNode(), z = this.type === a.incDec;
              M.operator = this.value, M.prefix = true, this.next(), M.argument = this.parseMaybeUnary(null, true), this.checkExpressionErrors(e, true), z ? this.checkLVal(M.argument) : this.strict && M.operator === "delete" && M.argument.type === "Identifier" ? this.raiseRecoverable(M.start, "Deleting local variable in strict mode") : r = true, D = this.finishNode(M, z ? "UpdateExpression" : "UnaryExpression");
            } else {
              if (D = this.parseExprSubscripts(e), this.checkExpressionErrors(e))
                return D;
              for (; this.type.postfix && !this.canInsertSemicolon(); ) {
                var G = this.startNodeAt(d, _);
                G.operator = this.value, G.prefix = false, G.argument = D, this.checkLVal(D), this.next(), D = this.finishNode(G, "UpdateExpression");
              }
            }
            return !r && this.eat(a.starstar) ? this.buildBinary(d, _, D, this.parseMaybeUnary(null, false), "**", false) : D;
          }, ne.parseExprSubscripts = function(e) {
            var r = this.start, d = this.startLoc, _ = this.parseExprAtom(e);
            if (_.type === "ArrowFunctionExpression" && this.input.slice(this.lastTokStart, this.lastTokEnd) !== ")")
              return _;
            var D = this.parseSubscripts(_, r, d);
            return e && D.type === "MemberExpression" && (e.parenthesizedAssign >= D.start && (e.parenthesizedAssign = -1), e.parenthesizedBind >= D.start && (e.parenthesizedBind = -1)), D;
          }, ne.parseSubscripts = function(e, r, d, _) {
            for (var D = this.options.ecmaVersion >= 8 && e.type === "Identifier" && e.name === "async" && this.lastTokEnd === e.end && !this.canInsertSemicolon() && this.input.slice(e.start, e.end) === "async"; ; ) {
              var M = this.parseSubscript(e, r, d, _, D);
              if (M === e || M.type === "ArrowFunctionExpression")
                return M;
              e = M;
            }
          }, ne.parseSubscript = function(e, r, d, _, D) {
            var M = this.eat(a.bracketL);
            if (M || this.eat(a.dot)) {
              var z = this.startNodeAt(r, d);
              z.object = e, z.property = M ? this.parseExpression() : this.parseIdent(this.options.allowReserved !== "never"), z.computed = !!M, M && this.expect(a.bracketR), e = this.finishNode(z, "MemberExpression");
            } else if (!_ && this.eat(a.parenL)) {
              var G = new Ve(), H = this.yieldPos, ae = this.awaitPos, ye = this.awaitIdentPos;
              this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0;
              var Ie = this.parseExprList(a.parenR, this.options.ecmaVersion >= 8, false, G);
              if (D && !this.canInsertSemicolon() && this.eat(a.arrow))
                return this.checkPatternErrors(G, false), this.checkYieldAwaitInDefaultParams(), this.awaitIdentPos > 0 && this.raise(this.awaitIdentPos, "Cannot use 'await' as identifier inside an async function"), this.yieldPos = H, this.awaitPos = ae, this.awaitIdentPos = ye, this.parseArrowExpression(this.startNodeAt(r, d), Ie, true);
              this.checkExpressionErrors(G, true), this.yieldPos = H || this.yieldPos, this.awaitPos = ae || this.awaitPos, this.awaitIdentPos = ye || this.awaitIdentPos;
              var Fe = this.startNodeAt(r, d);
              Fe.callee = e, Fe.arguments = Ie, e = this.finishNode(Fe, "CallExpression");
            } else if (this.type === a.backQuote) {
              var De = this.startNodeAt(r, d);
              De.tag = e, De.quasi = this.parseTemplate({ isTagged: true }), e = this.finishNode(De, "TaggedTemplateExpression");
            }
            return e;
          }, ne.parseExprAtom = function(e) {
            this.type === a.slash && this.readRegexp();
            var r, d = this.potentialArrowAt === this.start;
            switch (this.type) {
              case a._super:
                return this.allowSuper || this.raise(this.start, "'super' keyword outside a method"), r = this.startNode(), this.next(), this.type === a.parenL && !this.allowDirectSuper && this.raise(r.start, "super() call outside constructor of a subclass"), this.type !== a.dot && this.type !== a.bracketL && this.type !== a.parenL && this.unexpected(), this.finishNode(r, "Super");
              case a._this:
                return r = this.startNode(), this.next(), this.finishNode(r, "ThisExpression");
              case a.name:
                var _ = this.start, D = this.startLoc, M = this.containsEsc, z = this.parseIdent(false);
                if (this.options.ecmaVersion >= 8 && !M && z.name === "async" && !this.canInsertSemicolon() && this.eat(a._function))
                  return this.parseFunction(this.startNodeAt(_, D), 0, false, true);
                if (d && !this.canInsertSemicolon()) {
                  if (this.eat(a.arrow))
                    return this.parseArrowExpression(this.startNodeAt(_, D), [z], false);
                  if (this.options.ecmaVersion >= 8 && z.name === "async" && this.type === a.name && !M)
                    return z = this.parseIdent(false), (this.canInsertSemicolon() || !this.eat(a.arrow)) && this.unexpected(), this.parseArrowExpression(this.startNodeAt(_, D), [z], true);
                }
                return z;
              case a.regexp:
                var G = this.value;
                return r = this.parseLiteral(G.value), r.regex = { pattern: G.pattern, flags: G.flags }, r;
              case a.num:
              case a.string:
                return this.parseLiteral(this.value);
              case a._null:
              case a._true:
              case a._false:
                return r = this.startNode(), r.value = this.type === a._null ? null : this.type === a._true, r.raw = this.type.keyword, this.next(), this.finishNode(r, "Literal");
              case a.parenL:
                var H = this.start, ae = this.parseParenAndDistinguishExpression(d);
                return e && (e.parenthesizedAssign < 0 && !this.isSimpleAssignTarget(ae) && (e.parenthesizedAssign = H), e.parenthesizedBind < 0 && (e.parenthesizedBind = H)), ae;
              case a.bracketL:
                return r = this.startNode(), this.next(), r.elements = this.parseExprList(a.bracketR, true, true, e), this.finishNode(r, "ArrayExpression");
              case a.braceL:
                return this.parseObj(false, e);
              case a._function:
                return r = this.startNode(), this.next(), this.parseFunction(r, 0);
              case a._class:
                return this.parseClass(this.startNode(), false);
              case a._new:
                return this.parseNew();
              case a.backQuote:
                return this.parseTemplate();
              case a._import:
                return this.options.ecmaVersion >= 11 ? this.parseExprImport() : this.unexpected();
              default:
                this.unexpected();
            }
          }, ne.parseExprImport = function() {
            var e = this.startNode();
            switch (this.next(), this.type) {
              case a.parenL:
                return this.parseDynamicImport(e);
              default:
                this.unexpected();
            }
          }, ne.parseDynamicImport = function(e) {
            if (this.next(), e.source = this.parseMaybeAssign(), !this.eat(a.parenR)) {
              var r = this.start;
              this.eat(a.comma) && this.eat(a.parenR) ? this.raiseRecoverable(r, "Trailing comma is not allowed in import()") : this.unexpected(r);
            }
            return this.finishNode(e, "ImportExpression");
          }, ne.parseLiteral = function(e) {
            var r = this.startNode();
            return r.value = e, r.raw = this.input.slice(this.start, this.end), r.raw.charCodeAt(r.raw.length - 1) === 110 && (r.bigint = r.raw.slice(0, -1)), this.next(), this.finishNode(r, "Literal");
          }, ne.parseParenExpression = function() {
            this.expect(a.parenL);
            var e = this.parseExpression();
            return this.expect(a.parenR), e;
          }, ne.parseParenAndDistinguishExpression = function(e) {
            var r = this.start, d = this.startLoc, _, D = this.options.ecmaVersion >= 8;
            if (this.options.ecmaVersion >= 6) {
              this.next();
              var M = this.start, z = this.startLoc, G = [], H = true, ae = false, ye = new Ve(), Ie = this.yieldPos, Fe = this.awaitPos, De;
              for (this.yieldPos = 0, this.awaitPos = 0; this.type !== a.parenR; )
                if (H ? H = false : this.expect(a.comma), D && this.afterTrailingComma(a.parenR, true)) {
                  ae = true;
                  break;
                } else if (this.type === a.ellipsis) {
                  De = this.start, G.push(this.parseParenItem(this.parseRestBinding())), this.type === a.comma && this.raise(this.start, "Comma is not permitted after the rest element");
                  break;
                } else
                  G.push(this.parseMaybeAssign(false, ye, this.parseParenItem));
              var Xt = this.start, Yt = this.startLoc;
              if (this.expect(a.parenR), e && !this.canInsertSemicolon() && this.eat(a.arrow))
                return this.checkPatternErrors(ye, false), this.checkYieldAwaitInDefaultParams(), this.yieldPos = Ie, this.awaitPos = Fe, this.parseParenArrowList(r, d, G);
              (!G.length || ae) && this.unexpected(this.lastTokStart), De && this.unexpected(De), this.checkExpressionErrors(ye, true), this.yieldPos = Ie || this.yieldPos, this.awaitPos = Fe || this.awaitPos, G.length > 1 ? (_ = this.startNodeAt(M, z), _.expressions = G, this.finishNodeAt(_, "SequenceExpression", Xt, Yt)) : _ = G[0];
            } else
              _ = this.parseParenExpression();
            if (this.options.preserveParens) {
              var _t = this.startNodeAt(r, d);
              return _t.expression = _, this.finishNode(_t, "ParenthesizedExpression");
            } else
              return _;
          }, ne.parseParenItem = function(e) {
            return e;
          }, ne.parseParenArrowList = function(e, r, d) {
            return this.parseArrowExpression(this.startNodeAt(e, r), d);
          };
          var Rt = [];
          ne.parseNew = function() {
            this.containsEsc && this.raiseRecoverable(this.start, "Escape sequence in keyword new");
            var e = this.startNode(), r = this.parseIdent(true);
            if (this.options.ecmaVersion >= 6 && this.eat(a.dot)) {
              e.meta = r;
              var d = this.containsEsc;
              return e.property = this.parseIdent(true), (e.property.name !== "target" || d) && this.raiseRecoverable(e.property.start, "The only valid meta property for new is new.target"), this.inNonArrowFunction() || this.raiseRecoverable(e.start, "new.target can only be used in functions"), this.finishNode(e, "MetaProperty");
            }
            var _ = this.start, D = this.startLoc, M = this.type === a._import;
            return e.callee = this.parseSubscripts(this.parseExprAtom(), _, D, true), M && e.callee.type === "ImportExpression" && this.raise(_, "Cannot use new with import()"), this.eat(a.parenL) ? e.arguments = this.parseExprList(a.parenR, this.options.ecmaVersion >= 8, false) : e.arguments = Rt, this.finishNode(e, "NewExpression");
          }, ne.parseTemplateElement = function(e) {
            var r = e.isTagged, d = this.startNode();
            return this.type === a.invalidTemplate ? (r || this.raiseRecoverable(this.start, "Bad escape sequence in untagged template literal"), d.value = { raw: this.value, cooked: null }) : d.value = { raw: this.input.slice(this.start, this.end).replace(/\r\n?/g, `
`), cooked: this.value }, this.next(), d.tail = this.type === a.backQuote, this.finishNode(d, "TemplateElement");
          }, ne.parseTemplate = function(e) {
            e === void 0 && (e = {});
            var r = e.isTagged;
            r === void 0 && (r = false);
            var d = this.startNode();
            this.next(), d.expressions = [];
            var _ = this.parseTemplateElement({ isTagged: r });
            for (d.quasis = [_]; !_.tail; )
              this.type === a.eof && this.raise(this.pos, "Unterminated template literal"), this.expect(a.dollarBraceL), d.expressions.push(this.parseExpression()), this.expect(a.braceR), d.quasis.push(_ = this.parseTemplateElement({ isTagged: r }));
            return this.next(), this.finishNode(d, "TemplateLiteral");
          }, ne.isAsyncProp = function(e) {
            return !e.computed && e.key.type === "Identifier" && e.key.name === "async" && (this.type === a.name || this.type === a.num || this.type === a.string || this.type === a.bracketL || this.type.keyword || this.options.ecmaVersion >= 9 && this.type === a.star) && !k.test(this.input.slice(this.lastTokEnd, this.start));
          }, ne.parseObj = function(e, r) {
            var d = this.startNode(), _ = true, D = {};
            for (d.properties = [], this.next(); !this.eat(a.braceR); ) {
              if (_)
                _ = false;
              else if (this.expect(a.comma), this.options.ecmaVersion >= 5 && this.afterTrailingComma(a.braceR))
                break;
              var M = this.parseProperty(e, r);
              e || this.checkPropClash(M, D, r), d.properties.push(M);
            }
            return this.finishNode(d, e ? "ObjectPattern" : "ObjectExpression");
          }, ne.parseProperty = function(e, r) {
            var d = this.startNode(), _, D, M, z;
            if (this.options.ecmaVersion >= 9 && this.eat(a.ellipsis))
              return e ? (d.argument = this.parseIdent(false), this.type === a.comma && this.raise(this.start, "Comma is not permitted after the rest element"), this.finishNode(d, "RestElement")) : (this.type === a.parenL && r && (r.parenthesizedAssign < 0 && (r.parenthesizedAssign = this.start), r.parenthesizedBind < 0 && (r.parenthesizedBind = this.start)), d.argument = this.parseMaybeAssign(false, r), this.type === a.comma && r && r.trailingComma < 0 && (r.trailingComma = this.start), this.finishNode(d, "SpreadElement"));
            this.options.ecmaVersion >= 6 && (d.method = false, d.shorthand = false, (e || r) && (M = this.start, z = this.startLoc), e || (_ = this.eat(a.star)));
            var G = this.containsEsc;
            return this.parsePropertyName(d), !e && !G && this.options.ecmaVersion >= 8 && !_ && this.isAsyncProp(d) ? (D = true, _ = this.options.ecmaVersion >= 9 && this.eat(a.star), this.parsePropertyName(d, r)) : D = false, this.parsePropertyValue(d, e, _, D, M, z, r, G), this.finishNode(d, "Property");
          }, ne.parsePropertyValue = function(e, r, d, _, D, M, z, G) {
            if ((d || _) && this.type === a.colon && this.unexpected(), this.eat(a.colon))
              e.value = r ? this.parseMaybeDefault(this.start, this.startLoc) : this.parseMaybeAssign(false, z), e.kind = "init";
            else if (this.options.ecmaVersion >= 6 && this.type === a.parenL)
              r && this.unexpected(), e.kind = "init", e.method = true, e.value = this.parseMethod(d, _);
            else if (!r && !G && this.options.ecmaVersion >= 5 && !e.computed && e.key.type === "Identifier" && (e.key.name === "get" || e.key.name === "set") && this.type !== a.comma && this.type !== a.braceR) {
              (d || _) && this.unexpected(), e.kind = e.key.name, this.parsePropertyName(e), e.value = this.parseMethod(false);
              var H = e.kind === "get" ? 0 : 1;
              if (e.value.params.length !== H) {
                var ae = e.value.start;
                e.kind === "get" ? this.raiseRecoverable(ae, "getter should have no params") : this.raiseRecoverable(ae, "setter should have exactly one param");
              } else
                e.kind === "set" && e.value.params[0].type === "RestElement" && this.raiseRecoverable(e.value.params[0].start, "Setter cannot use rest params");
            } else
              this.options.ecmaVersion >= 6 && !e.computed && e.key.type === "Identifier" ? ((d || _) && this.unexpected(), this.checkUnreserved(e.key), e.key.name === "await" && !this.awaitIdentPos && (this.awaitIdentPos = D), e.kind = "init", r ? e.value = this.parseMaybeDefault(D, M, e.key) : this.type === a.eq && z ? (z.shorthandAssign < 0 && (z.shorthandAssign = this.start), e.value = this.parseMaybeDefault(D, M, e.key)) : e.value = e.key, e.shorthand = true) : this.unexpected();
          }, ne.parsePropertyName = function(e) {
            if (this.options.ecmaVersion >= 6) {
              if (this.eat(a.bracketL))
                return e.computed = true, e.key = this.parseMaybeAssign(), this.expect(a.bracketR), e.key;
              e.computed = false;
            }
            return e.key = this.type === a.num || this.type === a.string ? this.parseExprAtom() : this.parseIdent(this.options.allowReserved !== "never");
          }, ne.initFunction = function(e) {
            e.id = null, this.options.ecmaVersion >= 6 && (e.generator = e.expression = false), this.options.ecmaVersion >= 8 && (e.async = false);
          }, ne.parseMethod = function(e, r, d) {
            var _ = this.startNode(), D = this.yieldPos, M = this.awaitPos, z = this.awaitIdentPos;
            return this.initFunction(_), this.options.ecmaVersion >= 6 && (_.generator = e), this.options.ecmaVersion >= 8 && (_.async = !!r), this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0, this.enterScope(Te(r, _.generator) | re | (d ? de : 0)), this.expect(a.parenL), _.params = this.parseBindingList(a.parenR, false, this.options.ecmaVersion >= 8), this.checkYieldAwaitInDefaultParams(), this.parseFunctionBody(_, false, true), this.yieldPos = D, this.awaitPos = M, this.awaitIdentPos = z, this.finishNode(_, "FunctionExpression");
          }, ne.parseArrowExpression = function(e, r, d) {
            var _ = this.yieldPos, D = this.awaitPos, M = this.awaitIdentPos;
            return this.enterScope(Te(d, false) | pe), this.initFunction(e), this.options.ecmaVersion >= 8 && (e.async = !!d), this.yieldPos = 0, this.awaitPos = 0, this.awaitIdentPos = 0, e.params = this.toAssignableList(r, true), this.parseFunctionBody(e, true, false), this.yieldPos = _, this.awaitPos = D, this.awaitIdentPos = M, this.finishNode(e, "ArrowFunctionExpression");
          }, ne.parseFunctionBody = function(e, r, d) {
            var _ = r && this.type !== a.braceL, D = this.strict, M = false;
            if (_)
              e.body = this.parseMaybeAssign(), e.expression = true, this.checkParams(e, false);
            else {
              var z = this.options.ecmaVersion >= 7 && !this.isSimpleParamList(e.params);
              (!D || z) && (M = this.strictDirective(this.end), M && z && this.raiseRecoverable(e.start, "Illegal 'use strict' directive in function with non-simple parameter list"));
              var G = this.labels;
              this.labels = [], M && (this.strict = true), this.checkParams(e, !D && !M && !r && !d && this.isSimpleParamList(e.params)), e.body = this.parseBlock(false), e.expression = false, this.adaptDirectivePrologue(e.body.body), this.labels = G;
            }
            this.exitScope(), this.strict && e.id && this.checkLVal(e.id, at), this.strict = D;
          }, ne.isSimpleParamList = function(e) {
            for (var r = 0, d = e; r < d.length; r += 1) {
              var _ = d[r];
              if (_.type !== "Identifier")
                return false;
            }
            return true;
          }, ne.checkParams = function(e, r) {
            for (var d = {}, _ = 0, D = e.params; _ < D.length; _ += 1) {
              var M = D[_];
              this.checkLVal(M, Ce, r ? null : d);
            }
          }, ne.parseExprList = function(e, r, d, _) {
            for (var D = [], M = true; !this.eat(e); ) {
              if (M)
                M = false;
              else if (this.expect(a.comma), r && this.afterTrailingComma(e))
                break;
              var z = void 0;
              d && this.type === a.comma ? z = null : this.type === a.ellipsis ? (z = this.parseSpread(_), _ && this.type === a.comma && _.trailingComma < 0 && (_.trailingComma = this.start)) : z = this.parseMaybeAssign(false, _), D.push(z);
            }
            return D;
          }, ne.checkUnreserved = function(e) {
            var r = e.start, d = e.end, _ = e.name;
            if (this.inGenerator && _ === "yield" && this.raiseRecoverable(r, "Cannot use 'yield' as identifier inside a generator"), this.inAsync && _ === "await" && this.raiseRecoverable(r, "Cannot use 'await' as identifier inside an async function"), this.keywords.test(_) && this.raise(r, "Unexpected keyword '" + _ + "'"), !(this.options.ecmaVersion < 6 && this.input.slice(r, d).indexOf("\\") !== -1)) {
              var D = this.strict ? this.reservedWordsStrict : this.reservedWords;
              D.test(_) && (!this.inAsync && _ === "await" && this.raiseRecoverable(r, "Cannot use keyword 'await' outside an async function"), this.raiseRecoverable(r, "The keyword '" + _ + "' is reserved"));
            }
          }, ne.parseIdent = function(e, r) {
            var d = this.startNode();
            return this.type === a.name ? d.name = this.value : this.type.keyword ? (d.name = this.type.keyword, (d.name === "class" || d.name === "function") && (this.lastTokEnd !== this.lastTokStart + 1 || this.input.charCodeAt(this.lastTokStart) !== 46) && this.context.pop()) : this.unexpected(), this.next(!!e), this.finishNode(d, "Identifier"), e || (this.checkUnreserved(d), d.name === "await" && !this.awaitIdentPos && (this.awaitIdentPos = d.start)), d;
          }, ne.parseYield = function(e) {
            this.yieldPos || (this.yieldPos = this.start);
            var r = this.startNode();
            return this.next(), this.type === a.semi || this.canInsertSemicolon() || this.type !== a.star && !this.type.startsExpr ? (r.delegate = false, r.argument = null) : (r.delegate = this.eat(a.star), r.argument = this.parseMaybeAssign(e)), this.finishNode(r, "YieldExpression");
          }, ne.parseAwait = function() {
            this.awaitPos || (this.awaitPos = this.start);
            var e = this.startNode();
            return this.next(), e.argument = this.parseMaybeUnary(null, false), this.finishNode(e, "AwaitExpression");
          };
          var Oe = le.prototype;
          Oe.raise = function(e, r) {
            var d = j(this.input, e);
            r += " (" + d.line + ":" + d.column + ")";
            var _ = new SyntaxError(r);
            throw _.pos = e, _.loc = d, _.raisedAt = this.pos, _;
          }, Oe.raiseRecoverable = Oe.raise, Oe.curPosition = function() {
            if (this.options.locations)
              return new J(this.curLine, this.pos - this.lineStart);
          };
          var ke = le.prototype, Mt = function(r) {
            this.flags = r, this.var = [], this.lexical = [], this.functions = [];
          };
          ke.enterScope = function(e) {
            this.scopeStack.push(new Mt(e));
          }, ke.exitScope = function() {
            this.scopeStack.pop();
          }, ke.treatFunctionsAsVarInScope = function(e) {
            return e.flags & be || !this.inModule && e.flags & ee;
          }, ke.declareName = function(e, r, d) {
            var _ = false;
            if (r === _e) {
              var D = this.currentScope();
              _ = D.lexical.indexOf(e) > -1 || D.functions.indexOf(e) > -1 || D.var.indexOf(e) > -1, D.lexical.push(e), this.inModule && D.flags & ee && delete this.undefinedExports[e];
            } else if (r === rt) {
              var M = this.currentScope();
              M.lexical.push(e);
            } else if (r === st) {
              var z = this.currentScope();
              this.treatFunctionsAsVar ? _ = z.lexical.indexOf(e) > -1 : _ = z.lexical.indexOf(e) > -1 || z.var.indexOf(e) > -1, z.functions.push(e);
            } else
              for (var G = this.scopeStack.length - 1; G >= 0; --G) {
                var H = this.scopeStack[G];
                if (H.lexical.indexOf(e) > -1 && !(H.flags & te && H.lexical[0] === e) || !this.treatFunctionsAsVarInScope(H) && H.functions.indexOf(e) > -1) {
                  _ = true;
                  break;
                }
                if (H.var.push(e), this.inModule && H.flags & ee && delete this.undefinedExports[e], H.flags & Q)
                  break;
              }
            _ && this.raiseRecoverable(d, "Identifier '" + e + "' has already been declared");
          }, ke.checkLocalExport = function(e) {
            this.scopeStack[0].lexical.indexOf(e.name) === -1 && this.scopeStack[0].var.indexOf(e.name) === -1 && (this.undefinedExports[e.name] = e);
          }, ke.currentScope = function() {
            return this.scopeStack[this.scopeStack.length - 1];
          }, ke.currentVarScope = function() {
            for (var e = this.scopeStack.length - 1; ; e--) {
              var r = this.scopeStack[e];
              if (r.flags & Q)
                return r;
            }
          }, ke.currentThisScope = function() {
            for (var e = this.scopeStack.length - 1; ; e--) {
              var r = this.scopeStack[e];
              if (r.flags & Q && !(r.flags & pe))
                return r;
            }
          };
          var ze = function(r, d, _) {
            this.type = "", this.start = d, this.end = 0, r.options.locations && (this.loc = new q(r, _)), r.options.directSourceFile && (this.sourceFile = r.options.directSourceFile), r.options.ranges && (this.range = [d, 0]);
          }, Ne = le.prototype;
          Ne.startNode = function() {
            return new ze(this, this.start, this.startLoc);
          }, Ne.startNodeAt = function(e, r) {
            return new ze(this, e, r);
          };
          function ut(e, r, d, _) {
            return e.type = r, e.end = d, this.options.locations && (e.loc.end = _), this.options.ranges && (e.range[1] = d), e;
          }
          Ne.finishNode = function(e, r) {
            return ut.call(this, e, r, this.lastTokEnd, this.lastTokEndLoc);
          }, Ne.finishNodeAt = function(e, r, d, _) {
            return ut.call(this, e, r, d, _);
          };
          var ve = function(r, d, _, D, M) {
            this.token = r, this.isExpr = !!d, this.preserveSpace = !!_, this.override = D, this.generator = !!M;
          }, ce = { b_stat: new ve("{", false), b_expr: new ve("{", true), b_tmpl: new ve("${", false), p_stat: new ve("(", false), p_expr: new ve("(", true), q_tmpl: new ve("`", true, true, function(e) {
            return e.tryReadTemplateToken();
          }), f_stat: new ve("function", false), f_expr: new ve("function", true), f_expr_gen: new ve("function", true, false, null, true), f_gen: new ve("function", false, false, null, true) }, Pe = le.prototype;
          Pe.initialContext = function() {
            return [ce.b_stat];
          }, Pe.braceIsBlock = function(e) {
            var r = this.curContext();
            return r === ce.f_expr || r === ce.f_stat ? true : e === a.colon && (r === ce.b_stat || r === ce.b_expr) ? !r.isExpr : e === a._return || e === a.name && this.exprAllowed ? k.test(this.input.slice(this.lastTokEnd, this.start)) : e === a._else || e === a.semi || e === a.eof || e === a.parenR || e === a.arrow ? true : e === a.braceL ? r === ce.b_stat : e === a._var || e === a._const || e === a.name ? false : !this.exprAllowed;
          }, Pe.inGeneratorContext = function() {
            for (var e = this.context.length - 1; e >= 1; e--) {
              var r = this.context[e];
              if (r.token === "function")
                return r.generator;
            }
            return false;
          }, Pe.updateContext = function(e) {
            var r, d = this.type;
            d.keyword && e === a.dot ? this.exprAllowed = false : (r = d.updateContext) ? r.call(this, e) : this.exprAllowed = d.beforeExpr;
          }, a.parenR.updateContext = a.braceR.updateContext = function() {
            if (this.context.length === 1) {
              this.exprAllowed = true;
              return;
            }
            var e = this.context.pop();
            e === ce.b_stat && this.curContext().token === "function" && (e = this.context.pop()), this.exprAllowed = !e.isExpr;
          }, a.braceL.updateContext = function(e) {
            this.context.push(this.braceIsBlock(e) ? ce.b_stat : ce.b_expr), this.exprAllowed = true;
          }, a.dollarBraceL.updateContext = function() {
            this.context.push(ce.b_tmpl), this.exprAllowed = true;
          }, a.parenL.updateContext = function(e) {
            var r = e === a._if || e === a._for || e === a._with || e === a._while;
            this.context.push(r ? ce.p_stat : ce.p_expr), this.exprAllowed = true;
          }, a.incDec.updateContext = function() {
          }, a._function.updateContext = a._class.updateContext = function(e) {
            e.beforeExpr && e !== a.semi && e !== a._else && !(e === a._return && k.test(this.input.slice(this.lastTokEnd, this.start))) && !((e === a.colon || e === a.braceL) && this.curContext() === ce.b_stat) ? this.context.push(ce.f_expr) : this.context.push(ce.f_stat), this.exprAllowed = false;
          }, a.backQuote.updateContext = function() {
            this.curContext() === ce.q_tmpl ? this.context.pop() : this.context.push(ce.q_tmpl), this.exprAllowed = false;
          }, a.star.updateContext = function(e) {
            if (e === a._function) {
              var r = this.context.length - 1;
              this.context[r] === ce.f_expr ? this.context[r] = ce.f_expr_gen : this.context[r] = ce.f_gen;
            }
            this.exprAllowed = true;
          }, a.name.updateContext = function(e) {
            var r = false;
            this.options.ecmaVersion >= 6 && e !== a.dot && (this.value === "of" && !this.exprAllowed || this.value === "yield" && this.inGeneratorContext()) && (r = true), this.exprAllowed = r;
          };
          var lt = "ASCII ASCII_Hex_Digit AHex Alphabetic Alpha Any Assigned Bidi_Control Bidi_C Bidi_Mirrored Bidi_M Case_Ignorable CI Cased Changes_When_Casefolded CWCF Changes_When_Casemapped CWCM Changes_When_Lowercased CWL Changes_When_NFKC_Casefolded CWKCF Changes_When_Titlecased CWT Changes_When_Uppercased CWU Dash Default_Ignorable_Code_Point DI Deprecated Dep Diacritic Dia Emoji Emoji_Component Emoji_Modifier Emoji_Modifier_Base Emoji_Presentation Extender Ext Grapheme_Base Gr_Base Grapheme_Extend Gr_Ext Hex_Digit Hex IDS_Binary_Operator IDSB IDS_Trinary_Operator IDST ID_Continue IDC ID_Start IDS Ideographic Ideo Join_Control Join_C Logical_Order_Exception LOE Lowercase Lower Math Noncharacter_Code_Point NChar Pattern_Syntax Pat_Syn Pattern_White_Space Pat_WS Quotation_Mark QMark Radical Regional_Indicator RI Sentence_Terminal STerm Soft_Dotted SD Terminal_Punctuation Term Unified_Ideograph UIdeo Uppercase Upper Variation_Selector VS White_Space space XID_Continue XIDC XID_Start XIDS", ht = lt + " Extended_Pictographic", Vt = ht, Ot = { 9: lt, 10: ht, 11: Vt }, ct = "Cased_Letter LC Close_Punctuation Pe Connector_Punctuation Pc Control Cc cntrl Currency_Symbol Sc Dash_Punctuation Pd Decimal_Number Nd digit Enclosing_Mark Me Final_Punctuation Pf Format Cf Initial_Punctuation Pi Letter L Letter_Number Nl Line_Separator Zl Lowercase_Letter Ll Mark M Combining_Mark Math_Symbol Sm Modifier_Letter Lm Modifier_Symbol Sk Nonspacing_Mark Mn Number N Open_Punctuation Ps Other C Other_Letter Lo Other_Number No Other_Punctuation Po Other_Symbol So Paragraph_Separator Zp Private_Use Co Punctuation P punct Separator Z Space_Separator Zs Spacing_Mark Mc Surrogate Cs Symbol S Titlecase_Letter Lt Unassigned Cn Uppercase_Letter Lu", pt = "Adlam Adlm Ahom Ahom Anatolian_Hieroglyphs Hluw Arabic Arab Armenian Armn Avestan Avst Balinese Bali Bamum Bamu Bassa_Vah Bass Batak Batk Bengali Beng Bhaiksuki Bhks Bopomofo Bopo Brahmi Brah Braille Brai Buginese Bugi Buhid Buhd Canadian_Aboriginal Cans Carian Cari Caucasian_Albanian Aghb Chakma Cakm Cham Cham Cherokee Cher Common Zyyy Coptic Copt Qaac Cuneiform Xsux Cypriot Cprt Cyrillic Cyrl Deseret Dsrt Devanagari Deva Duployan Dupl Egyptian_Hieroglyphs Egyp Elbasan Elba Ethiopic Ethi Georgian Geor Glagolitic Glag Gothic Goth Grantha Gran Greek Grek Gujarati Gujr Gurmukhi Guru Han Hani Hangul Hang Hanunoo Hano Hatran Hatr Hebrew Hebr Hiragana Hira Imperial_Aramaic Armi Inherited Zinh Qaai Inscriptional_Pahlavi Phli Inscriptional_Parthian Prti Javanese Java Kaithi Kthi Kannada Knda Katakana Kana Kayah_Li Kali Kharoshthi Khar Khmer Khmr Khojki Khoj Khudawadi Sind Lao Laoo Latin Latn Lepcha Lepc Limbu Limb Linear_A Lina Linear_B Linb Lisu Lisu Lycian Lyci Lydian Lydi Mahajani Mahj Malayalam Mlym Mandaic Mand Manichaean Mani Marchen Marc Masaram_Gondi Gonm Meetei_Mayek Mtei Mende_Kikakui Mend Meroitic_Cursive Merc Meroitic_Hieroglyphs Mero Miao Plrd Modi Modi Mongolian Mong Mro Mroo Multani Mult Myanmar Mymr Nabataean Nbat New_Tai_Lue Talu Newa Newa Nko Nkoo Nushu Nshu Ogham Ogam Ol_Chiki Olck Old_Hungarian Hung Old_Italic Ital Old_North_Arabian Narb Old_Permic Perm Old_Persian Xpeo Old_South_Arabian Sarb Old_Turkic Orkh Oriya Orya Osage Osge Osmanya Osma Pahawh_Hmong Hmng Palmyrene Palm Pau_Cin_Hau Pauc Phags_Pa Phag Phoenician Phnx Psalter_Pahlavi Phlp Rejang Rjng Runic Runr Samaritan Samr Saurashtra Saur Sharada Shrd Shavian Shaw Siddham Sidd SignWriting Sgnw Sinhala Sinh Sora_Sompeng Sora Soyombo Soyo Sundanese Sund Syloti_Nagri Sylo Syriac Syrc Tagalog Tglg Tagbanwa Tagb Tai_Le Tale Tai_Tham Lana Tai_Viet Tavt Takri Takr Tamil Taml Tangut Tang Telugu Telu Thaana Thaa Thai Thai Tibetan Tibt Tifinagh Tfng Tirhuta Tirh Ugaritic Ugar Vai Vaii Warang_Citi Wara Yi Yiii Zanabazar_Square Zanb", ft = pt + " Dogra Dogr Gunjala_Gondi Gong Hanifi_Rohingya Rohg Makasar Maka Medefaidrin Medf Old_Sogdian Sogo Sogdian Sogd", zt = ft + " Elymaic Elym Nandinagari Nand Nyiakeng_Puachue_Hmong Hmnp Wancho Wcho", Nt = { 9: pt, 10: ft, 11: zt }, dt = {};
          function Ye(e) {
            var r = dt[e] = { binary: Y(Ot[e] + " " + ct), nonBinary: { General_Category: Y(ct), Script: Y(Nt[e]) } };
            r.nonBinary.Script_Extensions = r.nonBinary.Script, r.nonBinary.gc = r.nonBinary.General_Category, r.nonBinary.sc = r.nonBinary.Script, r.nonBinary.scx = r.nonBinary.Script_Extensions;
          }
          Ye(9), Ye(10), Ye(11);
          var W = le.prototype, Ee = function(r) {
            this.parser = r, this.validFlags = "gim" + (r.options.ecmaVersion >= 6 ? "uy" : "") + (r.options.ecmaVersion >= 9 ? "s" : ""), this.unicodeProperties = dt[r.options.ecmaVersion >= 11 ? 11 : r.options.ecmaVersion], this.source = "", this.flags = "", this.start = 0, this.switchU = false, this.switchN = false, this.pos = 0, this.lastIntValue = 0, this.lastStringValue = "", this.lastAssertionIsQuantifiable = false, this.numCapturingParens = 0, this.maxBackReference = 0, this.groupNames = [], this.backReferenceNames = [];
          };
          Ee.prototype.reset = function(r, d, _) {
            var D = _.indexOf("u") !== -1;
            this.start = r | 0, this.source = d + "", this.flags = _, this.switchU = D && this.parser.options.ecmaVersion >= 6, this.switchN = D && this.parser.options.ecmaVersion >= 9;
          }, Ee.prototype.raise = function(r) {
            this.parser.raiseRecoverable(this.start, "Invalid regular expression: /" + this.source + "/: " + r);
          }, Ee.prototype.at = function(r) {
            var d = this.source, _ = d.length;
            if (r >= _)
              return -1;
            var D = d.charCodeAt(r);
            if (!this.switchU || D <= 55295 || D >= 57344 || r + 1 >= _)
              return D;
            var M = d.charCodeAt(r + 1);
            return M >= 56320 && M <= 57343 ? (D << 10) + M - 56613888 : D;
          }, Ee.prototype.nextIndex = function(r) {
            var d = this.source, _ = d.length;
            if (r >= _)
              return _;
            var D = d.charCodeAt(r), M;
            return !this.switchU || D <= 55295 || D >= 57344 || r + 1 >= _ || (M = d.charCodeAt(r + 1)) < 56320 || M > 57343 ? r + 1 : r + 2;
          }, Ee.prototype.current = function() {
            return this.at(this.pos);
          }, Ee.prototype.lookahead = function() {
            return this.at(this.nextIndex(this.pos));
          }, Ee.prototype.advance = function() {
            this.pos = this.nextIndex(this.pos);
          }, Ee.prototype.eat = function(r) {
            return this.current() === r ? (this.advance(), true) : false;
          };
          function Ke(e) {
            return e <= 65535 ? String.fromCharCode(e) : (e -= 65536, String.fromCharCode((e >> 10) + 55296, (e & 1023) + 56320));
          }
          W.validateRegExpFlags = function(e) {
            for (var r = e.validFlags, d = e.flags, _ = 0; _ < d.length; _++) {
              var D = d.charAt(_);
              r.indexOf(D) === -1 && this.raise(e.start, "Invalid regular expression flag"), d.indexOf(D, _ + 1) > -1 && this.raise(e.start, "Duplicate regular expression flag");
            }
          }, W.validateRegExpPattern = function(e) {
            this.regexp_pattern(e), !e.switchN && this.options.ecmaVersion >= 9 && e.groupNames.length > 0 && (e.switchN = true, this.regexp_pattern(e));
          }, W.regexp_pattern = function(e) {
            e.pos = 0, e.lastIntValue = 0, e.lastStringValue = "", e.lastAssertionIsQuantifiable = false, e.numCapturingParens = 0, e.maxBackReference = 0, e.groupNames.length = 0, e.backReferenceNames.length = 0, this.regexp_disjunction(e), e.pos !== e.source.length && (e.eat(41) && e.raise("Unmatched ')'"), (e.eat(93) || e.eat(125)) && e.raise("Lone quantifier brackets")), e.maxBackReference > e.numCapturingParens && e.raise("Invalid escape");
            for (var r = 0, d = e.backReferenceNames; r < d.length; r += 1) {
              var _ = d[r];
              e.groupNames.indexOf(_) === -1 && e.raise("Invalid named capture referenced");
            }
          }, W.regexp_disjunction = function(e) {
            for (this.regexp_alternative(e); e.eat(124); )
              this.regexp_alternative(e);
            this.regexp_eatQuantifier(e, true) && e.raise("Nothing to repeat"), e.eat(123) && e.raise("Lone quantifier brackets");
          }, W.regexp_alternative = function(e) {
            for (; e.pos < e.source.length && this.regexp_eatTerm(e); )
              ;
          }, W.regexp_eatTerm = function(e) {
            return this.regexp_eatAssertion(e) ? (e.lastAssertionIsQuantifiable && this.regexp_eatQuantifier(e) && e.switchU && e.raise("Invalid quantifier"), true) : (e.switchU ? this.regexp_eatAtom(e) : this.regexp_eatExtendedAtom(e)) ? (this.regexp_eatQuantifier(e), true) : false;
          }, W.regexp_eatAssertion = function(e) {
            var r = e.pos;
            if (e.lastAssertionIsQuantifiable = false, e.eat(94) || e.eat(36))
              return true;
            if (e.eat(92)) {
              if (e.eat(66) || e.eat(98))
                return true;
              e.pos = r;
            }
            if (e.eat(40) && e.eat(63)) {
              var d = false;
              if (this.options.ecmaVersion >= 9 && (d = e.eat(60)), e.eat(61) || e.eat(33))
                return this.regexp_disjunction(e), e.eat(41) || e.raise("Unterminated group"), e.lastAssertionIsQuantifiable = !d, true;
            }
            return e.pos = r, false;
          }, W.regexp_eatQuantifier = function(e, r) {
            return r === void 0 && (r = false), this.regexp_eatQuantifierPrefix(e, r) ? (e.eat(63), true) : false;
          }, W.regexp_eatQuantifierPrefix = function(e, r) {
            return e.eat(42) || e.eat(43) || e.eat(63) || this.regexp_eatBracedQuantifier(e, r);
          }, W.regexp_eatBracedQuantifier = function(e, r) {
            var d = e.pos;
            if (e.eat(123)) {
              var _ = 0, D = -1;
              if (this.regexp_eatDecimalDigits(e) && (_ = e.lastIntValue, e.eat(44) && this.regexp_eatDecimalDigits(e) && (D = e.lastIntValue), e.eat(125)))
                return D !== -1 && D < _ && !r && e.raise("numbers out of order in {} quantifier"), true;
              e.switchU && !r && e.raise("Incomplete quantifier"), e.pos = d;
            }
            return false;
          }, W.regexp_eatAtom = function(e) {
            return this.regexp_eatPatternCharacters(e) || e.eat(46) || this.regexp_eatReverseSolidusAtomEscape(e) || this.regexp_eatCharacterClass(e) || this.regexp_eatUncapturingGroup(e) || this.regexp_eatCapturingGroup(e);
          }, W.regexp_eatReverseSolidusAtomEscape = function(e) {
            var r = e.pos;
            if (e.eat(92)) {
              if (this.regexp_eatAtomEscape(e))
                return true;
              e.pos = r;
            }
            return false;
          }, W.regexp_eatUncapturingGroup = function(e) {
            var r = e.pos;
            if (e.eat(40)) {
              if (e.eat(63) && e.eat(58)) {
                if (this.regexp_disjunction(e), e.eat(41))
                  return true;
                e.raise("Unterminated group");
              }
              e.pos = r;
            }
            return false;
          }, W.regexp_eatCapturingGroup = function(e) {
            if (e.eat(40)) {
              if (this.options.ecmaVersion >= 9 ? this.regexp_groupSpecifier(e) : e.current() === 63 && e.raise("Invalid group"), this.regexp_disjunction(e), e.eat(41))
                return e.numCapturingParens += 1, true;
              e.raise("Unterminated group");
            }
            return false;
          }, W.regexp_eatExtendedAtom = function(e) {
            return e.eat(46) || this.regexp_eatReverseSolidusAtomEscape(e) || this.regexp_eatCharacterClass(e) || this.regexp_eatUncapturingGroup(e) || this.regexp_eatCapturingGroup(e) || this.regexp_eatInvalidBracedQuantifier(e) || this.regexp_eatExtendedPatternCharacter(e);
          }, W.regexp_eatInvalidBracedQuantifier = function(e) {
            return this.regexp_eatBracedQuantifier(e, true) && e.raise("Nothing to repeat"), false;
          }, W.regexp_eatSyntaxCharacter = function(e) {
            var r = e.current();
            return mt(r) ? (e.lastIntValue = r, e.advance(), true) : false;
          };
          function mt(e) {
            return e === 36 || e >= 40 && e <= 43 || e === 46 || e === 63 || e >= 91 && e <= 94 || e >= 123 && e <= 125;
          }
          W.regexp_eatPatternCharacters = function(e) {
            for (var r = e.pos, d = 0; (d = e.current()) !== -1 && !mt(d); )
              e.advance();
            return e.pos !== r;
          }, W.regexp_eatExtendedPatternCharacter = function(e) {
            var r = e.current();
            return r !== -1 && r !== 36 && !(r >= 40 && r <= 43) && r !== 46 && r !== 63 && r !== 91 && r !== 94 && r !== 124 ? (e.advance(), true) : false;
          }, W.regexp_groupSpecifier = function(e) {
            if (e.eat(63)) {
              if (this.regexp_eatGroupName(e)) {
                e.groupNames.indexOf(e.lastStringValue) !== -1 && e.raise("Duplicate capture group name"), e.groupNames.push(e.lastStringValue);
                return;
              }
              e.raise("Invalid group");
            }
          }, W.regexp_eatGroupName = function(e) {
            if (e.lastStringValue = "", e.eat(60)) {
              if (this.regexp_eatRegExpIdentifierName(e) && e.eat(62))
                return true;
              e.raise("Invalid capture group name");
            }
            return false;
          }, W.regexp_eatRegExpIdentifierName = function(e) {
            if (e.lastStringValue = "", this.regexp_eatRegExpIdentifierStart(e)) {
              for (e.lastStringValue += Ke(e.lastIntValue); this.regexp_eatRegExpIdentifierPart(e); )
                e.lastStringValue += Ke(e.lastIntValue);
              return true;
            }
            return false;
          }, W.regexp_eatRegExpIdentifierStart = function(e) {
            var r = e.pos, d = e.current();
            return e.advance(), d === 92 && this.regexp_eatRegExpUnicodeEscapeSequence(e) && (d = e.lastIntValue), Pt(d) ? (e.lastIntValue = d, true) : (e.pos = r, false);
          };
          function Pt(e) {
            return S(e, true) || e === 36 || e === 95;
          }
          W.regexp_eatRegExpIdentifierPart = function(e) {
            var r = e.pos, d = e.current();
            return e.advance(), d === 92 && this.regexp_eatRegExpUnicodeEscapeSequence(e) && (d = e.lastIntValue), Kt(d) ? (e.lastIntValue = d, true) : (e.pos = r, false);
          };
          function Kt(e) {
            return v(e, true) || e === 36 || e === 95 || e === 8204 || e === 8205;
          }
          W.regexp_eatAtomEscape = function(e) {
            return this.regexp_eatBackReference(e) || this.regexp_eatCharacterClassEscape(e) || this.regexp_eatCharacterEscape(e) || e.switchN && this.regexp_eatKGroupName(e) ? true : (e.switchU && (e.current() === 99 && e.raise("Invalid unicode escape"), e.raise("Invalid escape")), false);
          }, W.regexp_eatBackReference = function(e) {
            var r = e.pos;
            if (this.regexp_eatDecimalEscape(e)) {
              var d = e.lastIntValue;
              if (e.switchU)
                return d > e.maxBackReference && (e.maxBackReference = d), true;
              if (d <= e.numCapturingParens)
                return true;
              e.pos = r;
            }
            return false;
          }, W.regexp_eatKGroupName = function(e) {
            if (e.eat(107)) {
              if (this.regexp_eatGroupName(e))
                return e.backReferenceNames.push(e.lastStringValue), true;
              e.raise("Invalid named reference");
            }
            return false;
          }, W.regexp_eatCharacterEscape = function(e) {
            return this.regexp_eatControlEscape(e) || this.regexp_eatCControlLetter(e) || this.regexp_eatZero(e) || this.regexp_eatHexEscapeSequence(e) || this.regexp_eatRegExpUnicodeEscapeSequence(e) || !e.switchU && this.regexp_eatLegacyOctalEscapeSequence(e) || this.regexp_eatIdentityEscape(e);
          }, W.regexp_eatCControlLetter = function(e) {
            var r = e.pos;
            if (e.eat(99)) {
              if (this.regexp_eatControlLetter(e))
                return true;
              e.pos = r;
            }
            return false;
          }, W.regexp_eatZero = function(e) {
            return e.current() === 48 && !Ge(e.lookahead()) ? (e.lastIntValue = 0, e.advance(), true) : false;
          }, W.regexp_eatControlEscape = function(e) {
            var r = e.current();
            return r === 116 ? (e.lastIntValue = 9, e.advance(), true) : r === 110 ? (e.lastIntValue = 10, e.advance(), true) : r === 118 ? (e.lastIntValue = 11, e.advance(), true) : r === 102 ? (e.lastIntValue = 12, e.advance(), true) : r === 114 ? (e.lastIntValue = 13, e.advance(), true) : false;
          }, W.regexp_eatControlLetter = function(e) {
            var r = e.current();
            return xt(r) ? (e.lastIntValue = r % 32, e.advance(), true) : false;
          };
          function xt(e) {
            return e >= 65 && e <= 90 || e >= 97 && e <= 122;
          }
          W.regexp_eatRegExpUnicodeEscapeSequence = function(e) {
            var r = e.pos;
            if (e.eat(117)) {
              if (this.regexp_eatFixedHexDigits(e, 4)) {
                var d = e.lastIntValue;
                if (e.switchU && d >= 55296 && d <= 56319) {
                  var _ = e.pos;
                  if (e.eat(92) && e.eat(117) && this.regexp_eatFixedHexDigits(e, 4)) {
                    var D = e.lastIntValue;
                    if (D >= 56320 && D <= 57343)
                      return e.lastIntValue = (d - 55296) * 1024 + (D - 56320) + 65536, true;
                  }
                  e.pos = _, e.lastIntValue = d;
                }
                return true;
              }
              if (e.switchU && e.eat(123) && this.regexp_eatHexDigits(e) && e.eat(125) && Gt(e.lastIntValue))
                return true;
              e.switchU && e.raise("Invalid unicode escape"), e.pos = r;
            }
            return false;
          };
          function Gt(e) {
            return e >= 0 && e <= 1114111;
          }
          W.regexp_eatIdentityEscape = function(e) {
            if (e.switchU)
              return this.regexp_eatSyntaxCharacter(e) ? true : e.eat(47) ? (e.lastIntValue = 47, true) : false;
            var r = e.current();
            return r !== 99 && (!e.switchN || r !== 107) ? (e.lastIntValue = r, e.advance(), true) : false;
          }, W.regexp_eatDecimalEscape = function(e) {
            e.lastIntValue = 0;
            var r = e.current();
            if (r >= 49 && r <= 57) {
              do
                e.lastIntValue = 10 * e.lastIntValue + (r - 48), e.advance();
              while ((r = e.current()) >= 48 && r <= 57);
              return true;
            }
            return false;
          }, W.regexp_eatCharacterClassEscape = function(e) {
            var r = e.current();
            if (Ut(r))
              return e.lastIntValue = -1, e.advance(), true;
            if (e.switchU && this.options.ecmaVersion >= 9 && (r === 80 || r === 112)) {
              if (e.lastIntValue = -1, e.advance(), e.eat(123) && this.regexp_eatUnicodePropertyValueExpression(e) && e.eat(125))
                return true;
              e.raise("Invalid property name");
            }
            return false;
          };
          function Ut(e) {
            return e === 100 || e === 68 || e === 115 || e === 83 || e === 119 || e === 87;
          }
          W.regexp_eatUnicodePropertyValueExpression = function(e) {
            var r = e.pos;
            if (this.regexp_eatUnicodePropertyName(e) && e.eat(61)) {
              var d = e.lastStringValue;
              if (this.regexp_eatUnicodePropertyValue(e)) {
                var _ = e.lastStringValue;
                return this.regexp_validateUnicodePropertyNameAndValue(e, d, _), true;
              }
            }
            if (e.pos = r, this.regexp_eatLoneUnicodePropertyNameOrValue(e)) {
              var D = e.lastStringValue;
              return this.regexp_validateUnicodePropertyNameOrValue(e, D), true;
            }
            return false;
          }, W.regexp_validateUnicodePropertyNameAndValue = function(e, r, d) {
            B(e.unicodeProperties.nonBinary, r) || e.raise("Invalid property name"), e.unicodeProperties.nonBinary[r].test(d) || e.raise("Invalid property value");
          }, W.regexp_validateUnicodePropertyNameOrValue = function(e, r) {
            e.unicodeProperties.binary.test(r) || e.raise("Invalid property name");
          }, W.regexp_eatUnicodePropertyName = function(e) {
            var r = 0;
            for (e.lastStringValue = ""; gt(r = e.current()); )
              e.lastStringValue += Ke(r), e.advance();
            return e.lastStringValue !== "";
          };
          function gt(e) {
            return xt(e) || e === 95;
          }
          W.regexp_eatUnicodePropertyValue = function(e) {
            var r = 0;
            for (e.lastStringValue = ""; Bt(r = e.current()); )
              e.lastStringValue += Ke(r), e.advance();
            return e.lastStringValue !== "";
          };
          function Bt(e) {
            return gt(e) || Ge(e);
          }
          W.regexp_eatLoneUnicodePropertyNameOrValue = function(e) {
            return this.regexp_eatUnicodePropertyValue(e);
          }, W.regexp_eatCharacterClass = function(e) {
            if (e.eat(91)) {
              if (e.eat(94), this.regexp_classRanges(e), e.eat(93))
                return true;
              e.raise("Unterminated character class");
            }
            return false;
          }, W.regexp_classRanges = function(e) {
            for (; this.regexp_eatClassAtom(e); ) {
              var r = e.lastIntValue;
              if (e.eat(45) && this.regexp_eatClassAtom(e)) {
                var d = e.lastIntValue;
                e.switchU && (r === -1 || d === -1) && e.raise("Invalid character class"), r !== -1 && d !== -1 && r > d && e.raise("Range out of order in character class");
              }
            }
          }, W.regexp_eatClassAtom = function(e) {
            var r = e.pos;
            if (e.eat(92)) {
              if (this.regexp_eatClassEscape(e))
                return true;
              if (e.switchU) {
                var d = e.current();
                (d === 99 || Tt(d)) && e.raise("Invalid class escape"), e.raise("Invalid escape");
              }
              e.pos = r;
            }
            var _ = e.current();
            return _ !== 93 ? (e.lastIntValue = _, e.advance(), true) : false;
          }, W.regexp_eatClassEscape = function(e) {
            var r = e.pos;
            if (e.eat(98))
              return e.lastIntValue = 8, true;
            if (e.switchU && e.eat(45))
              return e.lastIntValue = 45, true;
            if (!e.switchU && e.eat(99)) {
              if (this.regexp_eatClassControlLetter(e))
                return true;
              e.pos = r;
            }
            return this.regexp_eatCharacterClassEscape(e) || this.regexp_eatCharacterEscape(e);
          }, W.regexp_eatClassControlLetter = function(e) {
            var r = e.current();
            return Ge(r) || r === 95 ? (e.lastIntValue = r % 32, e.advance(), true) : false;
          }, W.regexp_eatHexEscapeSequence = function(e) {
            var r = e.pos;
            if (e.eat(120)) {
              if (this.regexp_eatFixedHexDigits(e, 2))
                return true;
              e.switchU && e.raise("Invalid escape"), e.pos = r;
            }
            return false;
          }, W.regexp_eatDecimalDigits = function(e) {
            var r = e.pos, d = 0;
            for (e.lastIntValue = 0; Ge(d = e.current()); )
              e.lastIntValue = 10 * e.lastIntValue + (d - 48), e.advance();
            return e.pos !== r;
          };
          function Ge(e) {
            return e >= 48 && e <= 57;
          }
          W.regexp_eatHexDigits = function(e) {
            var r = e.pos, d = 0;
            for (e.lastIntValue = 0; yt(d = e.current()); )
              e.lastIntValue = 16 * e.lastIntValue + bt(d), e.advance();
            return e.pos !== r;
          };
          function yt(e) {
            return e >= 48 && e <= 57 || e >= 65 && e <= 70 || e >= 97 && e <= 102;
          }
          function bt(e) {
            return e >= 65 && e <= 70 ? 10 + (e - 65) : e >= 97 && e <= 102 ? 10 + (e - 97) : e - 48;
          }
          W.regexp_eatLegacyOctalEscapeSequence = function(e) {
            if (this.regexp_eatOctalDigit(e)) {
              var r = e.lastIntValue;
              if (this.regexp_eatOctalDigit(e)) {
                var d = e.lastIntValue;
                r <= 3 && this.regexp_eatOctalDigit(e) ? e.lastIntValue = r * 64 + d * 8 + e.lastIntValue : e.lastIntValue = r * 8 + d;
              } else
                e.lastIntValue = r;
              return true;
            }
            return false;
          }, W.regexp_eatOctalDigit = function(e) {
            var r = e.current();
            return Tt(r) ? (e.lastIntValue = r - 48, e.advance(), true) : (e.lastIntValue = 0, false);
          };
          function Tt(e) {
            return e >= 48 && e <= 55;
          }
          W.regexp_eatFixedHexDigits = function(e, r) {
            var d = e.pos;
            e.lastIntValue = 0;
            for (var _ = 0; _ < r; ++_) {
              var D = e.current();
              if (!yt(D))
                return e.pos = d, false;
              e.lastIntValue = 16 * e.lastIntValue + bt(D), e.advance();
            }
            return true;
          };
          var Ue = function(r) {
            this.type = r.type, this.value = r.value, this.start = r.start, this.end = r.end, r.options.locations && (this.loc = new q(r, r.startLoc, r.endLoc)), r.options.ranges && (this.range = [r.start, r.end]);
          }, se = le.prototype;
          se.next = function(e) {
            !e && this.type.keyword && this.containsEsc && this.raiseRecoverable(this.start, "Escape sequence in keyword " + this.type.keyword), this.options.onToken && this.options.onToken(new Ue(this)), this.lastTokEnd = this.end, this.lastTokStart = this.start, this.lastTokEndLoc = this.endLoc, this.lastTokStartLoc = this.startLoc, this.nextToken();
          }, se.getToken = function() {
            return this.next(), new Ue(this);
          }, typeof Symbol < "u" && (se[Symbol.iterator] = function() {
            var e = this;
            return { next: function() {
              var r = e.getToken();
              return { done: r.type === a.eof, value: r };
            } };
          }), se.curContext = function() {
            return this.context[this.context.length - 1];
          }, se.nextToken = function() {
            var e = this.curContext();
            if ((!e || !e.preserveSpace) && this.skipSpace(), this.start = this.pos, this.options.locations && (this.startLoc = this.curPosition()), this.pos >= this.input.length)
              return this.finishToken(a.eof);
            if (e.override)
              return e.override(this);
            this.readToken(this.fullCharCodeAtPos());
          }, se.readToken = function(e) {
            return S(e, this.options.ecmaVersion >= 6) || e === 92 ? this.readWord() : this.getTokenFromCode(e);
          }, se.fullCharCodeAtPos = function() {
            var e = this.input.charCodeAt(this.pos);
            if (e <= 55295 || e >= 57344)
              return e;
            var r = this.input.charCodeAt(this.pos + 1);
            return (e << 10) + r - 56613888;
          }, se.skipBlockComment = function() {
            var e = this.options.onComment && this.curPosition(), r = this.pos, d = this.input.indexOf("*/", this.pos += 2);
            if (d === -1 && this.raise(this.pos - 2, "Unterminated comment"), this.pos = d + 2, this.options.locations) {
              A.lastIndex = r;
              for (var _; (_ = A.exec(this.input)) && _.index < this.pos; )
                ++this.curLine, this.lineStart = _.index + _[0].length;
            }
            this.options.onComment && this.options.onComment(true, this.input.slice(r + 2, d), r, this.pos, e, this.curPosition());
          }, se.skipLineComment = function(e) {
            for (var r = this.pos, d = this.options.onComment && this.curPosition(), _ = this.input.charCodeAt(this.pos += e); this.pos < this.input.length && !N(_); )
              _ = this.input.charCodeAt(++this.pos);
            this.options.onComment && this.options.onComment(false, this.input.slice(r + e, this.pos), r, this.pos, d, this.curPosition());
          }, se.skipSpace = function() {
            e:
              for (; this.pos < this.input.length; ) {
                var e = this.input.charCodeAt(this.pos);
                switch (e) {
                  case 32:
                  case 160:
                    ++this.pos;
                    break;
                  case 13:
                    this.input.charCodeAt(this.pos + 1) === 10 && ++this.pos;
                  case 10:
                  case 8232:
                  case 8233:
                    ++this.pos, this.options.locations && (++this.curLine, this.lineStart = this.pos);
                    break;
                  case 47:
                    switch (this.input.charCodeAt(this.pos + 1)) {
                      case 42:
                        this.skipBlockComment();
                        break;
                      case 47:
                        this.skipLineComment(2);
                        break;
                      default:
                        break e;
                    }
                    break;
                  default:
                    if (e > 8 && e < 14 || e >= 5760 && F.test(String.fromCharCode(e)))
                      ++this.pos;
                    else
                      break e;
                }
              }
          }, se.finishToken = function(e, r) {
            this.end = this.pos, this.options.locations && (this.endLoc = this.curPosition());
            var d = this.type;
            this.type = e, this.value = r, this.updateContext(d);
          }, se.readToken_dot = function() {
            var e = this.input.charCodeAt(this.pos + 1);
            if (e >= 48 && e <= 57)
              return this.readNumber(true);
            var r = this.input.charCodeAt(this.pos + 2);
            return this.options.ecmaVersion >= 6 && e === 46 && r === 46 ? (this.pos += 3, this.finishToken(a.ellipsis)) : (++this.pos, this.finishToken(a.dot));
          }, se.readToken_slash = function() {
            var e = this.input.charCodeAt(this.pos + 1);
            return this.exprAllowed ? (++this.pos, this.readRegexp()) : e === 61 ? this.finishOp(a.assign, 2) : this.finishOp(a.slash, 1);
          }, se.readToken_mult_modulo_exp = function(e) {
            var r = this.input.charCodeAt(this.pos + 1), d = 1, _ = e === 42 ? a.star : a.modulo;
            return this.options.ecmaVersion >= 7 && e === 42 && r === 42 && (++d, _ = a.starstar, r = this.input.charCodeAt(this.pos + 2)), r === 61 ? this.finishOp(a.assign, d + 1) : this.finishOp(_, d);
          }, se.readToken_pipe_amp = function(e) {
            var r = this.input.charCodeAt(this.pos + 1);
            return r === e ? this.finishOp(e === 124 ? a.logicalOR : a.logicalAND, 2) : r === 61 ? this.finishOp(a.assign, 2) : this.finishOp(e === 124 ? a.bitwiseOR : a.bitwiseAND, 1);
          }, se.readToken_caret = function() {
            var e = this.input.charCodeAt(this.pos + 1);
            return e === 61 ? this.finishOp(a.assign, 2) : this.finishOp(a.bitwiseXOR, 1);
          }, se.readToken_plus_min = function(e) {
            var r = this.input.charCodeAt(this.pos + 1);
            return r === e ? r === 45 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 62 && (this.lastTokEnd === 0 || k.test(this.input.slice(this.lastTokEnd, this.pos))) ? (this.skipLineComment(3), this.skipSpace(), this.nextToken()) : this.finishOp(a.incDec, 2) : r === 61 ? this.finishOp(a.assign, 2) : this.finishOp(a.plusMin, 1);
          }, se.readToken_lt_gt = function(e) {
            var r = this.input.charCodeAt(this.pos + 1), d = 1;
            return r === e ? (d = e === 62 && this.input.charCodeAt(this.pos + 2) === 62 ? 3 : 2, this.input.charCodeAt(this.pos + d) === 61 ? this.finishOp(a.assign, d + 1) : this.finishOp(a.bitShift, d)) : r === 33 && e === 60 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 45 && this.input.charCodeAt(this.pos + 3) === 45 ? (this.skipLineComment(4), this.skipSpace(), this.nextToken()) : (r === 61 && (d = 2), this.finishOp(a.relational, d));
          }, se.readToken_eq_excl = function(e) {
            var r = this.input.charCodeAt(this.pos + 1);
            return r === 61 ? this.finishOp(a.equality, this.input.charCodeAt(this.pos + 2) === 61 ? 3 : 2) : e === 61 && r === 62 && this.options.ecmaVersion >= 6 ? (this.pos += 2, this.finishToken(a.arrow)) : this.finishOp(e === 61 ? a.eq : a.prefix, 1);
          }, se.getTokenFromCode = function(e) {
            switch (e) {
              case 46:
                return this.readToken_dot();
              case 40:
                return ++this.pos, this.finishToken(a.parenL);
              case 41:
                return ++this.pos, this.finishToken(a.parenR);
              case 59:
                return ++this.pos, this.finishToken(a.semi);
              case 44:
                return ++this.pos, this.finishToken(a.comma);
              case 91:
                return ++this.pos, this.finishToken(a.bracketL);
              case 93:
                return ++this.pos, this.finishToken(a.bracketR);
              case 123:
                return ++this.pos, this.finishToken(a.braceL);
              case 125:
                return ++this.pos, this.finishToken(a.braceR);
              case 58:
                return ++this.pos, this.finishToken(a.colon);
              case 63:
                return ++this.pos, this.finishToken(a.question);
              case 96:
                if (this.options.ecmaVersion < 6)
                  break;
                return ++this.pos, this.finishToken(a.backQuote);
              case 48:
                var r = this.input.charCodeAt(this.pos + 1);
                if (r === 120 || r === 88)
                  return this.readRadixNumber(16);
                if (this.options.ecmaVersion >= 6) {
                  if (r === 111 || r === 79)
                    return this.readRadixNumber(8);
                  if (r === 98 || r === 66)
                    return this.readRadixNumber(2);
                }
              case 49:
              case 50:
              case 51:
              case 52:
              case 53:
              case 54:
              case 55:
              case 56:
              case 57:
                return this.readNumber(false);
              case 34:
              case 39:
                return this.readString(e);
              case 47:
                return this.readToken_slash();
              case 37:
              case 42:
                return this.readToken_mult_modulo_exp(e);
              case 124:
              case 38:
                return this.readToken_pipe_amp(e);
              case 94:
                return this.readToken_caret();
              case 43:
              case 45:
                return this.readToken_plus_min(e);
              case 60:
              case 62:
                return this.readToken_lt_gt(e);
              case 61:
              case 33:
                return this.readToken_eq_excl(e);
              case 126:
                return this.finishOp(a.prefix, 1);
            }
            this.raise(this.pos, "Unexpected character '" + Ze(e) + "'");
          }, se.finishOp = function(e, r) {
            var d = this.input.slice(this.pos, this.pos + r);
            return this.pos += r, this.finishToken(e, d);
          }, se.readRegexp = function() {
            for (var e, r, d = this.pos; ; ) {
              this.pos >= this.input.length && this.raise(d, "Unterminated regular expression");
              var _ = this.input.charAt(this.pos);
              if (k.test(_) && this.raise(d, "Unterminated regular expression"), e)
                e = false;
              else {
                if (_ === "[")
                  r = true;
                else if (_ === "]" && r)
                  r = false;
                else if (_ === "/" && !r)
                  break;
                e = _ === "\\";
              }
              ++this.pos;
            }
            var D = this.input.slice(d, this.pos);
            ++this.pos;
            var M = this.pos, z = this.readWord1();
            this.containsEsc && this.unexpected(M);
            var G = this.regexpState || (this.regexpState = new Ee(this));
            G.reset(d, D, z), this.validateRegExpFlags(G), this.validateRegExpPattern(G);
            var H = null;
            try {
              H = new RegExp(D, z);
            } catch {
            }
            return this.finishToken(a.regexp, { pattern: D, flags: z, value: H });
          }, se.readInt = function(e, r) {
            for (var d = this.pos, _ = 0, D = 0, M = r ?? 1 / 0; D < M; ++D) {
              var z = this.input.charCodeAt(this.pos), G = void 0;
              if (z >= 97 ? G = z - 97 + 10 : z >= 65 ? G = z - 65 + 10 : z >= 48 && z <= 57 ? G = z - 48 : G = 1 / 0, G >= e)
                break;
              ++this.pos, _ = _ * e + G;
            }
            return this.pos === d || r != null && this.pos - d !== r ? null : _;
          }, se.readRadixNumber = function(e) {
            var r = this.pos;
            this.pos += 2;
            var d = this.readInt(e);
            return d == null && this.raise(this.start + 2, "Expected number in radix " + e), this.options.ecmaVersion >= 11 && this.input.charCodeAt(this.pos) === 110 ? (d = typeof BigInt < "u" ? BigInt(this.input.slice(r, this.pos)) : null, ++this.pos) : S(this.fullCharCodeAtPos()) && this.raise(this.pos, "Identifier directly after number"), this.finishToken(a.num, d);
          }, se.readNumber = function(e) {
            var r = this.pos;
            !e && this.readInt(10) === null && this.raise(r, "Invalid number");
            var d = this.pos - r >= 2 && this.input.charCodeAt(r) === 48;
            d && this.strict && this.raise(r, "Invalid number");
            var _ = this.input.charCodeAt(this.pos);
            if (!d && !e && this.options.ecmaVersion >= 11 && _ === 110) {
              var D = this.input.slice(r, this.pos), M = typeof BigInt < "u" ? BigInt(D) : null;
              return ++this.pos, S(this.fullCharCodeAtPos()) && this.raise(this.pos, "Identifier directly after number"), this.finishToken(a.num, M);
            }
            d && /[89]/.test(this.input.slice(r, this.pos)) && (d = false), _ === 46 && !d && (++this.pos, this.readInt(10), _ = this.input.charCodeAt(this.pos)), (_ === 69 || _ === 101) && !d && (_ = this.input.charCodeAt(++this.pos), (_ === 43 || _ === 45) && ++this.pos, this.readInt(10) === null && this.raise(r, "Invalid number")), S(this.fullCharCodeAtPos()) && this.raise(this.pos, "Identifier directly after number");
            var z = this.input.slice(r, this.pos), G = d ? parseInt(z, 8) : parseFloat(z);
            return this.finishToken(a.num, G);
          }, se.readCodePoint = function() {
            var e = this.input.charCodeAt(this.pos), r;
            if (e === 123) {
              this.options.ecmaVersion < 6 && this.unexpected();
              var d = ++this.pos;
              r = this.readHexChar(this.input.indexOf("}", this.pos) - this.pos), ++this.pos, r > 1114111 && this.invalidStringToken(d, "Code point out of bounds");
            } else
              r = this.readHexChar(4);
            return r;
          };
          function Ze(e) {
            return e <= 65535 ? String.fromCharCode(e) : (e -= 65536, String.fromCharCode((e >> 10) + 55296, (e & 1023) + 56320));
          }
          se.readString = function(e) {
            for (var r = "", d = ++this.pos; ; ) {
              this.pos >= this.input.length && this.raise(this.start, "Unterminated string constant");
              var _ = this.input.charCodeAt(this.pos);
              if (_ === e)
                break;
              _ === 92 ? (r += this.input.slice(d, this.pos), r += this.readEscapedChar(false), d = this.pos) : (N(_, this.options.ecmaVersion >= 10) && this.raise(this.start, "Unterminated string constant"), ++this.pos);
            }
            return r += this.input.slice(d, this.pos++), this.finishToken(a.string, r);
          };
          var vt = {};
          se.tryReadTemplateToken = function() {
            this.inTemplateElement = true;
            try {
              this.readTmplToken();
            } catch (e) {
              if (e === vt)
                this.readInvalidTemplateToken();
              else
                throw e;
            }
            this.inTemplateElement = false;
          }, se.invalidStringToken = function(e, r) {
            if (this.inTemplateElement && this.options.ecmaVersion >= 9)
              throw vt;
            this.raise(e, r);
          }, se.readTmplToken = function() {
            for (var e = "", r = this.pos; ; ) {
              this.pos >= this.input.length && this.raise(this.start, "Unterminated template");
              var d = this.input.charCodeAt(this.pos);
              if (d === 96 || d === 36 && this.input.charCodeAt(this.pos + 1) === 123)
                return this.pos === this.start && (this.type === a.template || this.type === a.invalidTemplate) ? d === 36 ? (this.pos += 2, this.finishToken(a.dollarBraceL)) : (++this.pos, this.finishToken(a.backQuote)) : (e += this.input.slice(r, this.pos), this.finishToken(a.template, e));
              if (d === 92)
                e += this.input.slice(r, this.pos), e += this.readEscapedChar(true), r = this.pos;
              else if (N(d)) {
                switch (e += this.input.slice(r, this.pos), ++this.pos, d) {
                  case 13:
                    this.input.charCodeAt(this.pos) === 10 && ++this.pos;
                  case 10:
                    e += `
`;
                    break;
                  default:
                    e += String.fromCharCode(d);
                    break;
                }
                this.options.locations && (++this.curLine, this.lineStart = this.pos), r = this.pos;
              } else
                ++this.pos;
            }
          }, se.readInvalidTemplateToken = function() {
            for (; this.pos < this.input.length; this.pos++)
              switch (this.input[this.pos]) {
                case "\\":
                  ++this.pos;
                  break;
                case "$":
                  if (this.input[this.pos + 1] !== "{")
                    break;
                case "`":
                  return this.finishToken(a.invalidTemplate, this.input.slice(this.start, this.pos));
              }
            this.raise(this.start, "Unterminated template");
          }, se.readEscapedChar = function(e) {
            var r = this.input.charCodeAt(++this.pos);
            switch (++this.pos, r) {
              case 110:
                return `
`;
              case 114:
                return "\r";
              case 120:
                return String.fromCharCode(this.readHexChar(2));
              case 117:
                return Ze(this.readCodePoint());
              case 116:
                return "	";
              case 98:
                return "\b";
              case 118:
                return "\v";
              case 102:
                return "\f";
              case 13:
                this.input.charCodeAt(this.pos) === 10 && ++this.pos;
              case 10:
                return this.options.locations && (this.lineStart = this.pos, ++this.curLine), "";
              case 56:
              case 57:
                if (e) {
                  var d = this.pos - 1;
                  return this.invalidStringToken(d, "Invalid escape sequence in template string"), null;
                }
              default:
                if (r >= 48 && r <= 55) {
                  var _ = this.input.substr(this.pos - 1, 3).match(/^[0-7]+/)[0], D = parseInt(_, 8);
                  return D > 255 && (_ = _.slice(0, -1), D = parseInt(_, 8)), this.pos += _.length - 1, r = this.input.charCodeAt(this.pos), (_ !== "0" || r === 56 || r === 57) && (this.strict || e) && this.invalidStringToken(this.pos - 1 - _.length, e ? "Octal literal in template string" : "Octal literal in strict mode"), String.fromCharCode(D);
                }
                return N(r) ? "" : String.fromCharCode(r);
            }
          }, se.readHexChar = function(e) {
            var r = this.pos, d = this.readInt(16, e);
            return d === null && this.invalidStringToken(r, "Bad character escape sequence"), d;
          }, se.readWord1 = function() {
            this.containsEsc = false;
            for (var e = "", r = true, d = this.pos, _ = this.options.ecmaVersion >= 6; this.pos < this.input.length; ) {
              var D = this.fullCharCodeAtPos();
              if (v(D, _))
                this.pos += D <= 65535 ? 1 : 2;
              else if (D === 92) {
                this.containsEsc = true, e += this.input.slice(d, this.pos);
                var M = this.pos;
                this.input.charCodeAt(++this.pos) !== 117 && this.invalidStringToken(this.pos, "Expecting Unicode escape sequence \\uXXXX"), ++this.pos;
                var z = this.readCodePoint();
                (r ? S : v)(z, _) || this.invalidStringToken(M, "Invalid Unicode escape"), e += Ze(z), d = this.pos;
              } else
                break;
              r = false;
            }
            return e + this.input.slice(d, this.pos);
          }, se.readWord = function() {
            var e = this.readWord1(), r = a.name;
            return this.keywords.test(e) && (r = V[e]), this.finishToken(r, e);
          };
          var St = "7.1.0";
          le.acorn = { Parser: le, version: St, defaultOptions: U, Position: J, SourceLocation: q, getLineInfo: j, Node: ze, TokenType: h, tokTypes: a, keywordTypes: V, TokContext: ve, tokContexts: ce, isIdentifierChar: v, isIdentifierStart: S, Token: Ue, isNewLine: N, lineBreak: k, lineBreakG: A, nonASCIIwhitespace: F };
          function Wt(e, r) {
            return le.parse(e, r);
          }
          function jt(e, r, d) {
            return le.parseExpressionAt(e, r, d);
          }
          function Ht(e, r) {
            return le.tokenizer(e, r);
          }
          p.Node = ze, p.Parser = le, p.Position = J, p.SourceLocation = q, p.TokContext = ve, p.Token = Ue, p.TokenType = h, p.defaultOptions = U, p.getLineInfo = j, p.isIdentifierChar = v, p.isIdentifierStart = S, p.isNewLine = N, p.keywordTypes = V, p.lineBreak = k, p.lineBreakG = A, p.nonASCIIwhitespace = F, p.parse = Wt, p.parseExpressionAt = jt, p.tokContexts = ce, p.tokTypes = a, p.tokenizer = Ht, p.version = St, Object.defineProperty(p, "__esModule", { value: true });
        });
      }, {}], 2: [function(o, y, E) {
      }, {}], 3: [function(o, y, E) {
        function p(s, t = {}) {
          let { contextName: i = "gl", throwGetError: u, useTrackablePrimitives: x2, readPixelsFile: w, recording: m = [], variables: S = {}, onReadPixels: v, onUnrecognizedArgumentLookup: h } = t, b = new Proxy(s, { get: k }), T = [], C = {}, V = 0, c = "", a;
          return b;
          function k(j, U) {
            switch (U) {
              case "addComment":
                return B;
              case "checkThrowError":
                return P;
              case "getReadPixelsVariableName":
                return a;
              case "insertVariable":
                return F;
              case "reset":
                return N;
              case "setIndent":
                return K;
              case "toString":
                return A;
              case "getContextVariableName":
                return q;
            }
            return typeof s[U] == "function" ? function() {
              switch (U) {
                case "getError":
                  return u ? m.push(`${c}if (${i}.getError() !== ${i}.NONE) throw new Error('error');`) : m.push(`${c}${i}.getError();`), s.getError();
                case "getExtension": {
                  let Q = `${i}Variables${T.length}`;
                  m.push(`${c}const ${Q} = ${i}.getExtension('${arguments[0]}');`);
                  let ue = s.getExtension(arguments[0]);
                  if (ue && typeof ue == "object") {
                    let he = g(ue, { getEntity: R, useTrackablePrimitives: x2, recording: m, contextName: Q, contextVariables: T, variables: S, indent: c, onUnrecognizedArgumentLookup: h });
                    return T.push(he), he;
                  } else
                    T.push(null);
                  return ue;
                }
                case "readPixels":
                  let Z = T.indexOf(arguments[6]), ee;
                  if (Z === -1) {
                    let Q = J(arguments[6]);
                    Q ? (ee = Q, m.push(`${c}${Q}`)) : (ee = `${i}Variable${T.length}`, T.push(arguments[6]), m.push(`${c}const ${ee} = new ${arguments[6].constructor.name}(${arguments[6].length});`));
                  } else
                    ee = `${i}Variable${Z}`;
                  a = ee;
                  let be = [arguments[0], arguments[1], arguments[2], arguments[3], R(arguments[4]), R(arguments[5]), ee];
                  return m.push(`${c}${i}.readPixels(${be.join(", ")});`), w && X(arguments[2], arguments[3]), v && v(ee, be), s.readPixels.apply(s, arguments);
                case "drawBuffers":
                  return m.push(`${c}${i}.drawBuffers([${f(arguments[0], { contextName: i, contextVariables: T, getEntity: R, addVariable: O, variables: S, onUnrecognizedArgumentLookup: h })}]);`), s.drawBuffers(arguments[0]);
              }
              let oe = s[U].apply(s, arguments);
              switch (typeof oe) {
                case "undefined":
                  m.push(`${c}${Y(U, arguments)};`);
                  return;
                case "number":
                case "boolean":
                  if (x2 && T.indexOf(n(oe)) === -1) {
                    m.push(`${c}const ${i}Variable${T.length} = ${Y(U, arguments)};`), T.push(oe = n(oe));
                    break;
                  }
                default:
                  oe === null ? m.push(`${Y(U, arguments)};`) : m.push(`${c}const ${i}Variable${T.length} = ${Y(U, arguments)};`), T.push(oe);
              }
              return oe;
            } : (C[s[U]] = U, s[U]);
          }
          function A() {
            return m.join(`
`);
          }
          function N() {
            for (; m.length > 0; )
              m.pop();
          }
          function F(j, U) {
            S[j] = U;
          }
          function R(j) {
            let U = C[j];
            return U ? i + "." + U : j;
          }
          function K(j) {
            c = " ".repeat(j);
          }
          function O(j, U) {
            let oe = `${i}Variable${T.length}`;
            return m.push(`${c}const ${oe} = ${U};`), T.push(j), oe;
          }
          function X(j, U) {
            let oe = `${i}Variable${T.length}`, Z = `imageDatum${V}`;
            m.push(`${c}let ${Z} = ["P3\\n# ${w}.ppm\\n", ${j}, ' ', ${U}, "\\n255\\n"].join("");`), m.push(`${c}for (let i = 0; i < ${Z}.length; i += 4) {`), m.push(`${c}  ${Z} += ${oe}[i] + ' ' + ${oe}[i + 1] + ' ' + ${oe}[i + 2] + ' ';`), m.push(`${c}}`), m.push(`${c}if (typeof require !== "undefined") {`), m.push(`${c}  require('fs').writeFileSync('./${w}.ppm', ${Z});`), m.push(`${c}}`), V++;
          }
          function B(j) {
            m.push(`${c}// ${j}`);
          }
          function P() {
            m.push(`${c}(() => {
      ${c}const error = ${i}.getError();
      ${c}if (error !== ${i}.NONE) {
      ${c}  const names = Object.getOwnPropertyNames(gl);
      ${c}  for (let i = 0; i < names.length; i++) {
      ${c}    const name = names[i];
      ${c}    if (${i}[name] === error) {
      ${c}      throw new Error('${i} threw ' + name);
      ${c}    }
      ${c}  }
      ${c}}
      ${c}})();`);
          }
          function Y(j, U) {
            return `${i}.${j}(${f(U, { contextName: i, contextVariables: T, getEntity: R, addVariable: O, variables: S, onUnrecognizedArgumentLookup: h })})`;
          }
          function J(j) {
            if (S) {
              for (let U in S)
                if (S[U] === j)
                  return U;
            }
            return null;
          }
          function q(j) {
            let U = T.indexOf(j);
            return U !== -1 ? `${i}Variable${U}` : null;
          }
        }
        function g(s, t) {
          let i = new Proxy(s, { get: C }), u = {}, { contextName: x2, contextVariables: w, getEntity: m, useTrackablePrimitives: S, recording: v, variables: h, indent: b, onUnrecognizedArgumentLookup: T } = t;
          return i;
          function C(k, A) {
            return typeof k[A] == "function" ? function() {
              switch (A) {
                case "drawBuffersWEBGL":
                  return v.push(`${b}${x2}.drawBuffersWEBGL([${f(arguments[0], { contextName: x2, contextVariables: w, getEntity: V, addVariable: a, variables: h, onUnrecognizedArgumentLookup: T })}]);`), s.drawBuffersWEBGL(arguments[0]);
              }
              let N = s[A].apply(s, arguments);
              switch (typeof N) {
                case "undefined":
                  v.push(`${b}${c(A, arguments)};`);
                  return;
                case "number":
                case "boolean":
                  S && w.indexOf(n(N)) === -1 ? (v.push(`${b}const ${x2}Variable${w.length} = ${c(A, arguments)};`), w.push(N = n(N))) : (v.push(`${b}const ${x2}Variable${w.length} = ${c(A, arguments)};`), w.push(N));
                  break;
                default:
                  N === null ? v.push(`${c(A, arguments)};`) : v.push(`${b}const ${x2}Variable${w.length} = ${c(A, arguments)};`), w.push(N);
              }
              return N;
            } : (u[s[A]] = A, s[A]);
          }
          function V(k) {
            return u.hasOwnProperty(k) ? `${x2}.${u[k]}` : m(k);
          }
          function c(k, A) {
            return `${x2}.${k}(${f(A, { contextName: x2, contextVariables: w, getEntity: V, addVariable: a, variables: h, onUnrecognizedArgumentLookup: T })})`;
          }
          function a(k, A) {
            let N = `${x2}Variable${w.length}`;
            return w.push(k), v.push(`${b}const ${N} = ${A};`), N;
          }
        }
        function f(s, t) {
          let { variables: i, onUnrecognizedArgumentLookup: u } = t;
          return Array.from(s).map((w) => {
            let m = x2(w);
            return m || l(w, t);
          }).join(", ");
          function x2(w) {
            if (i) {
              for (let m in i)
                if (!!i.hasOwnProperty(m) && i[m] === w)
                  return m;
            }
            return u ? u(w) : null;
          }
        }
        function l(s, t) {
          let { contextName: i, contextVariables: u, getEntity: x2, addVariable: w, onUnrecognizedArgumentLookup: m } = t;
          if (typeof s > "u")
            return "undefined";
          if (s === null)
            return "null";
          let S = u.indexOf(s);
          if (S > -1)
            return `${i}Variable${S}`;
          switch (s.constructor.name) {
            case "String":
              let v = /\n/.test(s), h = /'/.test(s), b = /"/.test(s);
              return v ? "`" + s + "`" : h && !b ? '"' + s + '"' : "'" + s + "'";
            case "Number":
              return x2(s);
            case "Boolean":
              return x2(s);
            case "Array":
              return w(s, `new ${s.constructor.name}([${Array.from(s).join(",")}])`);
            case "Float32Array":
            case "Uint8Array":
            case "Uint16Array":
            case "Int32Array":
              return w(s, `new ${s.constructor.name}(${JSON.stringify(Array.from(s))})`);
            default:
              if (m) {
                let T = m(s);
                if (T)
                  return T;
              }
              throw new Error(`unrecognized argument type ${s.constructor.name}`);
          }
        }
        function n(s) {
          return new s.constructor(s);
        }
        typeof y < "u" && (y.exports = { glWiretap: p, glExtensionWiretap: g }), typeof window < "u" && (p.glExtensionWiretap = g, window.glWiretap = p);
      }, {}], 4: [function(o, y, E) {
        function p(w) {
          let m = new Array(w.length);
          for (let S = 0; S < w.length; S++) {
            let v = w[S];
            v.toArray ? m[S] = v.toArray() : m[S] = v;
          }
          return m;
        }
        function g() {
          let w = p(arguments), m = new Float32Array(this.output.x);
          for (let S = 0; S < this.output.x; S++)
            this.thread.x = S, this.thread.y = 0, this.thread.z = 0, m[S] = this._fn.apply(this, w);
          return m;
        }
        function f() {
          let w = p(arguments), m = new Array(this.output.y);
          for (let S = 0; S < this.output.y; S++) {
            let v = new Float32Array(this.output.x);
            for (let h = 0; h < this.output.x; h++)
              this.thread.x = h, this.thread.y = S, this.thread.z = 0, v[h] = this._fn.apply(this, w);
            m[S] = v;
          }
          return m;
        }
        function l() {
          let w = p(arguments);
          for (let m = 0; m < this.output.y; m++)
            for (let S = 0; S < this.output.x; S++)
              this.thread.x = S, this.thread.y = m, this.thread.z = 0, this._fn.apply(this, w);
        }
        function n() {
          let w = p(arguments), m = new Array(this.output.z);
          for (let S = 0; S < this.output.z; S++) {
            let v = new Array(this.output.y);
            for (let h = 0; h < this.output.y; h++) {
              let b = new Float32Array(this.output.x);
              for (let T = 0; T < this.output.x; T++)
                this.thread.x = T, this.thread.y = h, this.thread.z = S, b[T] = this._fn.apply(this, w);
              v[h] = b;
            }
            m[S] = v;
          }
          return m;
        }
        function s(w) {
          w.setOutput = (v) => {
            w.output = i(v), w.graphical && t(w);
          }, w.toJSON = () => {
            throw new Error("Not usable with gpuMock");
          }, w.setConstants = (v) => (w.constants = v, w), w.setGraphical = (v) => (w.graphical = v, w), w.setCanvas = (v) => (w.canvas = v, w), w.setContext = (v) => (w.context = v, w), w.destroy = () => {
          }, w.validateSettings = () => {
          }, w.graphical && w.output && t(w), w.exec = function() {
            return new Promise((v, h) => {
              try {
                v(w.apply(w, arguments));
              } catch (b) {
                h(b);
              }
            });
          }, w.getPixels = (v) => {
            let { x: h, y: b } = w.output;
            return v ? x2(w._imageData.data, h, b) : w._imageData.data.slice(0);
          }, w.color = function(v, h, b, T) {
            typeof T > "u" && (T = 1), v = Math.floor(v * 255), h = Math.floor(h * 255), b = Math.floor(b * 255), T = Math.floor(T * 255);
            let C = w.output.x, V = w.output.y, c = w.thread.x, a = V - w.thread.y - 1, k = c + a * C;
            w._colorData[k * 4 + 0] = v, w._colorData[k * 4 + 1] = h, w._colorData[k * 4 + 2] = b, w._colorData[k * 4 + 3] = T;
          };
          let m = () => w, S = ["setWarnVarUsage", "setArgumentTypes", "setTactic", "setOptimizeFloatMemory", "setDebug", "setLoopMaxIterations", "setConstantTypes", "setFunctions", "setNativeFunctions", "setInjectedNative", "setPipeline", "setPrecision", "setOutputToTexture", "setImmutable", "setStrictIntegers", "setDynamicOutput", "setHardcodeConstants", "setDynamicArguments", "setUseLegacyEncoder", "setWarnVarUsage", "addSubKernel"];
          for (let v = 0; v < S.length; v++)
            w[S[v]] = m;
          return w;
        }
        function t(w) {
          let { x: m, y: S } = w.output;
          if (w.context && w.context.createImageData) {
            let v = new Uint8ClampedArray(m * S * 4);
            w._imageData = w.context.createImageData(m, S), w._colorData = v;
          } else {
            let v = new Uint8ClampedArray(m * S * 4);
            w._imageData = { data: v }, w._colorData = v;
          }
        }
        function i(w) {
          let m = null;
          if (w.length)
            if (w.length === 3) {
              let [S, v, h] = w;
              m = { x: S, y: v, z: h };
            } else if (w.length === 2) {
              let [S, v] = w;
              m = { x: S, y: v };
            } else {
              let [S] = w;
              m = { x: S };
            }
          else
            m = w;
          return m;
        }
        function u(w, m = {}) {
          let S = m.output ? i(m.output) : null;
          function v() {
            return v.output.z ? n.apply(v, arguments) : v.output.y ? v.graphical ? l.apply(v, arguments) : f.apply(v, arguments) : g.apply(v, arguments);
          }
          return v._fn = w, v.constants = m.constants || null, v.context = m.context || null, v.canvas = m.canvas || null, v.graphical = m.graphical || false, v._imageData = null, v._colorData = null, v.output = S, v.thread = { x: 0, y: 0, z: 0 }, s(v);
        }
        function x2(w, m, S) {
          let v = S / 2 | 0, h = m * 4, b = new Uint8ClampedArray(m * 4), T = w.slice(0);
          for (let C = 0; C < v; ++C) {
            let V = C * h, c = (S - C - 1) * h;
            b.set(T.subarray(V, V + h)), T.copyWithin(V, c, c + h), T.set(b, c);
          }
          return T;
        }
        y.exports = { gpuMock: u };
      }, {}], 5: [function(o, y, E) {
        let { utils: p } = o("./utils");
        function g(f, l) {
          let n = l.toString();
          return new Function(`return function ${f} (${p.getArgumentNamesFromString(n).join(", ")}) {
        ${p.getFunctionBodyFromString(n)}
      }`)();
        }
        y.exports = { alias: g };
      }, { "./utils": 114 }], 6: [function(o, y, E) {
        let { FunctionNode: p } = o("../function-node");
        class g extends p {
          astFunction(l, n) {
            if (!this.isRootKernel) {
              n.push("function"), n.push(" "), n.push(this.name), n.push("(");
              for (let s = 0; s < this.argumentNames.length; ++s) {
                let t = this.argumentNames[s];
                s > 0 && n.push(", "), n.push("user_"), n.push(t);
              }
              n.push(`) {
`);
            }
            for (let s = 0; s < l.body.body.length; ++s)
              this.astGeneric(l.body.body[s], n), n.push(`
`);
            return this.isRootKernel || n.push(`}
`), n;
          }
          astReturnStatement(l, n) {
            let s = this.returnType || this.getType(l.argument);
            return this.returnType || (this.returnType = s), this.isRootKernel ? (n.push(this.leadingReturnStatement), this.astGeneric(l.argument, n), n.push(`;
`), n.push(this.followingReturnStatement), n.push(`continue;
`)) : this.isSubKernel ? (n.push(`subKernelResult_${this.name} = `), this.astGeneric(l.argument, n), n.push(";"), n.push(`return subKernelResult_${this.name};`)) : (n.push("return "), this.astGeneric(l.argument, n), n.push(";")), n;
          }
          astLiteral(l, n) {
            if (isNaN(l.value))
              throw this.astErrorOutput("Non-numeric literal not supported : " + l.value, l);
            return n.push(l.value), n;
          }
          astBinaryExpression(l, n) {
            return n.push("("), this.astGeneric(l.left, n), n.push(l.operator), this.astGeneric(l.right, n), n.push(")"), n;
          }
          astIdentifierExpression(l, n) {
            if (l.type !== "Identifier")
              throw this.astErrorOutput("IdentifierExpression - not an Identifier", l);
            switch (l.name) {
              case "Infinity":
                n.push("Infinity");
                break;
              default:
                this.constants && this.constants.hasOwnProperty(l.name) ? n.push("constants_" + l.name) : n.push("user_" + l.name);
            }
            return n;
          }
          astForStatement(l, n) {
            if (l.type !== "ForStatement")
              throw this.astErrorOutput("Invalid for statement", l);
            let s = [], t = [], i = [], u = [], x2 = null;
            if (l.init) {
              this.pushState("in-for-loop-init"), this.astGeneric(l.init, s);
              for (let w = 0; w < s.length; w++)
                s[w].includes && s[w].includes(",") && (x2 = false);
              this.popState("in-for-loop-init");
            } else
              x2 = false;
            if (l.test ? this.astGeneric(l.test, t) : x2 = false, l.update ? this.astGeneric(l.update, i) : x2 = false, l.body && (this.pushState("loop-body"), this.astGeneric(l.body, u), this.popState("loop-body")), x2 === null && (x2 = this.isSafe(l.init) && this.isSafe(l.test)), x2)
              n.push(`for (${s.join("")};${t.join("")};${i.join("")}){
`), n.push(u.join("")), n.push(`}
`);
            else {
              let w = this.getInternalVariableName("safeI");
              s.length > 0 && n.push(s.join(""), `;
`), n.push(`for (let ${w}=0;${w}<LOOP_MAX;${w}++){
`), t.length > 0 && n.push(`if (!${t.join("")}) break;
`), n.push(u.join("")), n.push(`
${i.join("")};`), n.push(`}
`);
            }
            return n;
          }
          astWhileStatement(l, n) {
            if (l.type !== "WhileStatement")
              throw this.astErrorOutput("Invalid while statement", l);
            return n.push("for (let i = 0; i < LOOP_MAX; i++) {"), n.push("if ("), this.astGeneric(l.test, n), n.push(`) {
`), this.astGeneric(l.body, n), n.push(`} else {
`), n.push(`break;
`), n.push(`}
`), n.push(`}
`), n;
          }
          astDoWhileStatement(l, n) {
            if (l.type !== "DoWhileStatement")
              throw this.astErrorOutput("Invalid while statement", l);
            return n.push("for (let i = 0; i < LOOP_MAX; i++) {"), this.astGeneric(l.body, n), n.push("if (!"), this.astGeneric(l.test, n), n.push(`) {
`), n.push(`break;
`), n.push(`}
`), n.push(`}
`), n;
          }
          astAssignmentExpression(l, n) {
            let s = this.getDeclaration(l.left);
            if (s && !s.assignable)
              throw this.astErrorOutput(`Variable ${l.left.name} is not assignable here`, l);
            return this.astGeneric(l.left, n), n.push(l.operator), this.astGeneric(l.right, n), n;
          }
          astBlockStatement(l, n) {
            if (this.isState("loop-body")) {
              this.pushState("block-body");
              for (let s = 0; s < l.body.length; s++)
                this.astGeneric(l.body[s], n);
              this.popState("block-body");
            } else {
              n.push(`{
`);
              for (let s = 0; s < l.body.length; s++)
                this.astGeneric(l.body[s], n);
              n.push(`}
`);
            }
            return n;
          }
          astVariableDeclaration(l, n) {
            n.push(`${l.kind} `);
            let { declarations: s } = l;
            for (let t = 0; t < s.length; t++) {
              t > 0 && n.push(",");
              let i = s[t], u = this.getDeclaration(i.id);
              u.valueType || (u.valueType = this.getType(i.init)), this.astGeneric(i, n);
            }
            return this.isState("in-for-loop-init") || n.push(";"), n;
          }
          astIfStatement(l, n) {
            return n.push("if ("), this.astGeneric(l.test, n), n.push(")"), l.consequent.type === "BlockStatement" ? this.astGeneric(l.consequent, n) : (n.push(` {
`), this.astGeneric(l.consequent, n), n.push(`
}
`)), l.alternate && (n.push("else "), l.alternate.type === "BlockStatement" || l.alternate.type === "IfStatement" ? this.astGeneric(l.alternate, n) : (n.push(` {
`), this.astGeneric(l.alternate, n), n.push(`
}
`))), n;
          }
          astSwitchStatement(l, n) {
            let { discriminant: s, cases: t } = l;
            n.push("switch ("), this.astGeneric(s, n), n.push(`) {
`);
            for (let i = 0; i < t.length; i++) {
              if (t[i].test === null) {
                n.push(`default:
`), this.astGeneric(t[i].consequent, n), t[i].consequent && t[i].consequent.length > 0 && n.push(`break;
`);
                continue;
              }
              n.push("case "), this.astGeneric(t[i].test, n), n.push(`:
`), t[i].consequent && t[i].consequent.length > 0 && (this.astGeneric(t[i].consequent, n), n.push(`break;
`));
            }
            n.push(`
}`);
          }
          astThisExpression(l, n) {
            return n.push("_this"), n;
          }
          astMemberExpression(l, n) {
            let { signature: s, type: t, property: i, xProperty: u, yProperty: x2, zProperty: w, name: m, origin: S } = this.getMemberExpressionDetails(l);
            switch (s) {
              case "this.thread.value":
                return n.push(`_this.thread.${m}`), n;
              case "this.output.value":
                switch (m) {
                  case "x":
                    n.push("outputX");
                    break;
                  case "y":
                    n.push("outputY");
                    break;
                  case "z":
                    n.push("outputZ");
                    break;
                  default:
                    throw this.astErrorOutput("Unexpected expression", l);
                }
                return n;
              case "value":
                throw this.astErrorOutput("Unexpected expression", l);
              case "value[]":
              case "value[][]":
              case "value[][][]":
              case "value.value":
                if (S === "Math")
                  return n.push(Math[m]), n;
                switch (i) {
                  case "r":
                    return n.push(`user_${m}[0]`), n;
                  case "g":
                    return n.push(`user_${m}[1]`), n;
                  case "b":
                    return n.push(`user_${m}[2]`), n;
                  case "a":
                    return n.push(`user_${m}[3]`), n;
                }
                break;
              case "this.constants.value":
              case "this.constants.value[]":
              case "this.constants.value[][]":
              case "this.constants.value[][][]":
                break;
              case "fn()[]":
                return this.astGeneric(l.object, n), n.push("["), this.astGeneric(l.property, n), n.push("]"), n;
              case "fn()[][]":
                return this.astGeneric(l.object.object, n), n.push("["), this.astGeneric(l.object.property, n), n.push("]"), n.push("["), this.astGeneric(l.property, n), n.push("]"), n;
              default:
                throw this.astErrorOutput("Unexpected expression", l);
            }
            if (!l.computed)
              switch (t) {
                case "Number":
                case "Integer":
                case "Float":
                case "Boolean":
                  return n.push(`${S}_${m}`), n;
              }
            let v = `${S}_${m}`;
            switch (t) {
              case "Array(2)":
              case "Array(3)":
              case "Array(4)":
              case "Matrix(2)":
              case "Matrix(3)":
              case "Matrix(4)":
              case "HTMLImageArray":
              case "ArrayTexture(1)":
              case "ArrayTexture(2)":
              case "ArrayTexture(3)":
              case "ArrayTexture(4)":
              case "HTMLImage":
              default:
                let h, b;
                if (S === "constants") {
                  let T = this.constants[m];
                  b = this.constantTypes[m] === "Input", h = b ? T.size : null;
                } else
                  b = this.isInput(m), h = b ? this.argumentSizes[this.argumentNames.indexOf(m)] : null;
                n.push(`${v}`), w && x2 ? b ? (n.push("[("), this.astGeneric(w, n), n.push(`*${this.dynamicArguments ? "(outputY * outputX)" : h[1] * h[0]})+(`), this.astGeneric(x2, n), n.push(`*${this.dynamicArguments ? "outputX" : h[0]})+`), this.astGeneric(u, n), n.push("]")) : (n.push("["), this.astGeneric(w, n), n.push("]"), n.push("["), this.astGeneric(x2, n), n.push("]"), n.push("["), this.astGeneric(u, n), n.push("]")) : x2 ? b ? (n.push("[("), this.astGeneric(x2, n), n.push(`*${this.dynamicArguments ? "outputX" : h[0]})+`), this.astGeneric(u, n), n.push("]")) : (n.push("["), this.astGeneric(x2, n), n.push("]"), n.push("["), this.astGeneric(u, n), n.push("]")) : typeof u < "u" && (n.push("["), this.astGeneric(u, n), n.push("]"));
            }
            return n;
          }
          astCallExpression(l, n) {
            if (l.type !== "CallExpression")
              throw this.astErrorOutput("Unknown CallExpression", l);
            let s = this.astMemberExpressionUnroll(l.callee);
            this.calledFunctions.indexOf(s) < 0 && this.calledFunctions.push(s);
            let t = this.isAstMathFunction(l);
            this.onFunctionCall && this.onFunctionCall(this.name, s, l.arguments), n.push(s), n.push("(");
            let i = this.lookupFunctionArgumentTypes(s) || [];
            for (let u = 0; u < l.arguments.length; ++u) {
              let x2 = l.arguments[u], w = this.getType(x2);
              i[u] || this.triggerImplyArgumentType(s, u, w, this), u > 0 && n.push(", "), this.astGeneric(x2, n);
            }
            return n.push(")"), n;
          }
          astArrayExpression(l, n) {
            let s = this.getType(l), t = l.elements.length, i = [];
            for (let u = 0; u < t; ++u) {
              let x2 = [];
              this.astGeneric(l.elements[u], x2), i.push(x2.join(""));
            }
            switch (s) {
              case "Matrix(2)":
              case "Matrix(3)":
              case "Matrix(4)":
                n.push(`[${i.join(", ")}]`);
                break;
              default:
                n.push(`new Float32Array([${i.join(", ")}])`);
            }
            return n;
          }
          astDebuggerStatement(l, n) {
            return n.push("debugger;"), n;
          }
        }
        y.exports = { CPUFunctionNode: g };
      }, { "../function-node": 10 }], 7: [function(o, y, E) {
        let { utils: p } = o("../../utils");
        function g(l, n) {
          let s = [];
          for (let t in n) {
            if (!n.hasOwnProperty(t))
              continue;
            let i = n[t], u = l[t];
            switch (i) {
              case "Number":
              case "Integer":
              case "Float":
              case "Boolean":
                s.push(`${t}:${u}`);
                break;
              case "Array(2)":
              case "Array(3)":
              case "Array(4)":
              case "Matrix(2)":
              case "Matrix(3)":
              case "Matrix(4)":
                s.push(`${t}:new ${u.constructor.name}(${JSON.stringify(Array.from(u))})`);
                break;
            }
          }
          return `{ ${s.join()} }`;
        }
        function f(l, n) {
          let s = [], t = [], i = [], u = !/^function/.test(l.color.toString());
          if (s.push("  const { context, canvas, constants: incomingConstants } = settings;", `  const output = new Int32Array(${JSON.stringify(Array.from(l.output))});`, `  const _constantTypes = ${JSON.stringify(l.constantTypes)};`, `  const _constants = ${g(l.constants, l.constantTypes)};`), t.push("    constants: _constants,", "    context,", "    output,", "    thread: {x: 0, y: 0, z: 0},"), l.graphical) {
            s.push(`  const _imageData = context.createImageData(${l.output[0]}, ${l.output[1]});`), s.push(`  const _colorData = new Uint8ClampedArray(${l.output[0]} * ${l.output[1]} * 4);`);
            let m = p.flattenFunctionToString((u ? "function " : "") + l.color.toString(), { thisLookup: (v) => {
              switch (v) {
                case "_colorData":
                  return "_colorData";
                case "_imageData":
                  return "_imageData";
                case "output":
                  return "output";
                case "thread":
                  return "this.thread";
              }
              return JSON.stringify(l[v]);
            }, findDependency: (v, h) => null }), S = p.flattenFunctionToString((u ? "function " : "") + l.getPixels.toString(), { thisLookup: (v) => {
              switch (v) {
                case "_colorData":
                  return "_colorData";
                case "_imageData":
                  return "_imageData";
                case "output":
                  return "output";
                case "thread":
                  return "this.thread";
              }
              return JSON.stringify(l[v]);
            }, findDependency: () => null });
            t.push("    _imageData,", "    _colorData,", `    color: ${m},`), i.push(`  kernel.getPixels = ${S};`);
          }
          let x2 = [], w = Object.keys(l.constantTypes);
          for (let m = 0; m < w.length; m++)
            x2.push(l.constantTypes[w]);
          if (l.argumentTypes.indexOf("HTMLImageArray") !== -1 || x2.indexOf("HTMLImageArray") !== -1) {
            let m = p.flattenFunctionToString((u ? "function " : "") + l._imageTo3DArray.toString(), { doNotDefine: ["canvas"], findDependency: (S, v) => S === "this" ? (u ? "function " : "") + l[v].toString() : null, thisLookup: (S) => {
              switch (S) {
                case "canvas":
                  return;
                case "context":
                  return "context";
              }
            } });
            i.push(m), t.push("    _mediaTo2DArray,"), t.push("    _imageTo3DArray,");
          } else if (l.argumentTypes.indexOf("HTMLImage") !== -1 || x2.indexOf("HTMLImage") !== -1) {
            let m = p.flattenFunctionToString((u ? "function " : "") + l._mediaTo2DArray.toString(), { findDependency: (S, v) => null, thisLookup: (S) => {
              switch (S) {
                case "canvas":
                  return "settings.canvas";
                case "context":
                  return "settings.context";
              }
              throw new Error("unhandled thisLookup");
            } });
            i.push(m), t.push("    _mediaTo2DArray,");
          }
          return `function(settings) {
      ${s.join(`
`)}
        for (const p in _constantTypes) {
          if (!_constantTypes.hasOwnProperty(p)) continue;
          const type = _constantTypes[p];
          switch (type) {
            case 'Number':
            case 'Integer':
            case 'Float':
            case 'Boolean':
            case 'Array(2)':
            case 'Array(3)':
            case 'Array(4)':
            case 'Matrix(2)':
            case 'Matrix(3)':
            case 'Matrix(4)':
              if (incomingConstants.hasOwnProperty(p)) {
                console.warn('constant ' + p + ' of type ' + type + ' cannot be resigned');
              }
              continue;
          }
          if (!incomingConstants.hasOwnProperty(p)) {
            throw new Error('constant ' + p + ' not found');
          }
          _constants[p] = incomingConstants[p];
        }
        const kernel = (function() {
      ${l._kernelString}
        })
          .apply({ ${t.join(`
`)} });
        ${i.join(`
`)}
        return kernel;
      }`;
        }
        y.exports = { cpuKernelString: f };
      }, { "../../utils": 114 }], 8: [function(o, y, E) {
        let { Kernel: p } = o("../kernel"), { FunctionBuilder: g } = o("../function-builder"), { CPUFunctionNode: f } = o("./function-node"), { utils: l } = o("../../utils"), { cpuKernelString: n } = o("./kernel-string");
        class s extends p {
          static getFeatures() {
            return this.features;
          }
          static get features() {
            return Object.freeze({ kernelMap: true, isIntegerDivisionAccurate: true });
          }
          static get isSupported() {
            return true;
          }
          static isContextMatch(i) {
            return false;
          }
          static get mode() {
            return "cpu";
          }
          static nativeFunctionArguments() {
            return null;
          }
          static nativeFunctionReturnType() {
            throw new Error(`Looking up native function return type not supported on ${this.name}`);
          }
          static combineKernels(i) {
            return i;
          }
          static getSignature(i, u) {
            return "cpu" + (u.length > 0 ? ":" + u.join(",") : "");
          }
          constructor(i, u) {
            super(i, u), this.mergeSettings(i.settings || u), this._imageData = null, this._colorData = null, this._kernelString = null, this._prependedString = [], this.thread = { x: 0, y: 0, z: 0 }, this.translatedSources = null;
          }
          initCanvas() {
            if (typeof document < "u")
              return document.createElement("canvas");
            if (typeof OffscreenCanvas < "u")
              return new OffscreenCanvas(0, 0);
          }
          initContext() {
            return this.canvas ? this.canvas.getContext("2d") : null;
          }
          initPlugins(i) {
            return [];
          }
          validateSettings(i) {
            if (!this.output || this.output.length === 0) {
              if (i.length !== 1)
                throw new Error("Auto output only supported for kernels with only one input");
              let u = l.getVariableType(i[0], this.strictIntegers);
              if (u === "Array")
                this.output = l.getDimensions(u);
              else if (u === "NumberTexture" || u === "ArrayTexture(4)")
                this.output = i[0].output;
              else
                throw new Error("Auto output not supported for input type: " + u);
            }
            if (this.graphical && this.output.length !== 2)
              throw new Error("Output must have 2 dimensions on graphical mode");
            this.checkOutput();
          }
          translateSource() {
            if (this.leadingReturnStatement = this.output.length > 1 ? "resultX[x] = " : "result[x] = ", this.subKernels) {
              let u = [];
              for (let x2 = 0; x2 < this.subKernels.length; x2++) {
                let { name: w } = this.subKernels[x2];
                u.push(this.output.length > 1 ? `resultX_${w}[x] = subKernelResult_${w};
` : `result_${w}[x] = subKernelResult_${w};
`);
              }
              this.followingReturnStatement = u.join("");
            }
            let i = g.fromKernel(this, f);
            this.translatedSources = i.getPrototypes("kernel"), !this.graphical && !this.returnType && (this.returnType = i.getKernelResultType());
          }
          build() {
            if (this.built)
              return;
            if (this.setupConstants(), this.setupArguments(arguments), this.validateSettings(arguments), this.translateSource(), this.graphical) {
              let { canvas: u, output: x2 } = this;
              if (!u)
                throw new Error("no canvas available for using graphical output");
              let w = x2[0], m = x2[1] || 1;
              u.width = w, u.height = m, this._imageData = this.context.createImageData(w, m), this._colorData = new Uint8ClampedArray(w * m * 4);
            }
            let i = this.getKernelString();
            this.kernelString = i, this.debug && (console.log("Function output:"), console.log(i));
            try {
              this.run = new Function([], i).bind(this)();
            } catch (u) {
              console.error("An error occurred compiling the javascript: ", u);
            }
            this.buildSignature(arguments), this.built = true;
          }
          color(i, u, x2, w) {
            typeof w > "u" && (w = 1), i = Math.floor(i * 255), u = Math.floor(u * 255), x2 = Math.floor(x2 * 255), w = Math.floor(w * 255);
            let m = this.output[0], S = this.output[1], v = this.thread.x, h = S - this.thread.y - 1, b = v + h * m;
            this._colorData[b * 4 + 0] = i, this._colorData[b * 4 + 1] = u, this._colorData[b * 4 + 2] = x2, this._colorData[b * 4 + 3] = w;
          }
          getKernelString() {
            if (this._kernelString !== null)
              return this._kernelString;
            let i = null, { translatedSources: u } = this;
            return u.length > 1 ? u = u.filter((x2) => /^function/.test(x2) ? x2 : (i = x2, false)) : i = u.shift(), this._kernelString = `  const LOOP_MAX = ${this._getLoopMaxString()};
        ${this.injectedNative || ""}
        const _this = this;
        ${this._resultKernelHeader()}
        ${this._processConstants()}
        return (${this.argumentNames.map((x2) => "user_" + x2).join(", ")}) => {
          ${this._prependedString.join("")}
          ${this._earlyThrows()}
          ${this._processArguments()}
          ${this.graphical ? this._graphicalKernelBody(i) : this._resultKernelBody(i)}
          ${u.length > 0 ? u.join(`
`) : ""}
        };`;
          }
          toString() {
            return n(this);
          }
          _getLoopMaxString() {
            return this.loopMaxIterations ? ` ${parseInt(this.loopMaxIterations)};` : " 1000;";
          }
          _processConstants() {
            if (!this.constants)
              return "";
            let i = [];
            for (let u in this.constants)
              switch (this.constantTypes[u]) {
                case "HTMLCanvas":
                case "HTMLImage":
                case "HTMLVideo":
                  i.push(`    const constants_${u} = this._mediaTo2DArray(this.constants.${u});
`);
                  break;
                case "HTMLImageArray":
                  i.push(`    const constants_${u} = this._imageTo3DArray(this.constants.${u});
`);
                  break;
                case "Input":
                  i.push(`    const constants_${u} = this.constants.${u}.value;
`);
                  break;
                default:
                  i.push(`    const constants_${u} = this.constants.${u};
`);
              }
            return i.join("");
          }
          _earlyThrows() {
            if (this.graphical || this.immutable || !this.pipeline)
              return "";
            let i = [];
            for (let x2 = 0; x2 < this.argumentTypes.length; x2++)
              this.argumentTypes[x2] === "Array" && i.push(this.argumentNames[x2]);
            if (i.length === 0)
              return "";
            let u = [];
            for (let x2 = 0; x2 < i.length; x2++) {
              let w = i[x2], m = this._mapSubKernels((S) => `user_${w} === result_${S.name}`).join(" || ");
              u.push(`user_${w} === result${m ? ` || ${m}` : ""}`);
            }
            return `if (${u.join(" || ")}) throw new Error('Source and destination arrays are the same.  Use immutable = true');`;
          }
          _processArguments() {
            let i = [];
            for (let u = 0; u < this.argumentTypes.length; u++) {
              let x2 = `user_${this.argumentNames[u]}`;
              switch (this.argumentTypes[u]) {
                case "HTMLCanvas":
                case "HTMLImage":
                case "HTMLVideo":
                  i.push(`    ${x2} = this._mediaTo2DArray(${x2});
`);
                  break;
                case "HTMLImageArray":
                  i.push(`    ${x2} = this._imageTo3DArray(${x2});
`);
                  break;
                case "Input":
                  i.push(`    ${x2} = ${x2}.value;
`);
                  break;
                case "ArrayTexture(1)":
                case "ArrayTexture(2)":
                case "ArrayTexture(3)":
                case "ArrayTexture(4)":
                case "NumberTexture":
                case "MemoryOptimizedNumberTexture":
                  i.push(`
          if (${x2}.toArray) {
            if (!_this.textureCache) {
              _this.textureCache = [];
              _this.arrayCache = [];
            }
            const textureIndex = _this.textureCache.indexOf(${x2});
            if (textureIndex !== -1) {
              ${x2} = _this.arrayCache[textureIndex];
            } else {
              _this.textureCache.push(${x2});
              ${x2} = ${x2}.toArray();
              _this.arrayCache.push(${x2});
            }
          }`);
                  break;
              }
            }
            return i.join("");
          }
          _mediaTo2DArray(i) {
            let u = this.canvas, x2 = i.width > 0 ? i.width : i.videoWidth, w = i.height > 0 ? i.height : i.videoHeight;
            u.width < x2 && (u.width = x2), u.height < w && (u.height = w);
            let m = this.context;
            m.drawImage(i, 0, 0, x2, w);
            let S = m.getImageData(0, 0, x2, w).data, v = new Array(w), h = 0;
            for (let b = w - 1; b >= 0; b--) {
              let T = v[b] = new Array(x2);
              for (let C = 0; C < x2; C++) {
                let V = new Float32Array(4);
                V[0] = S[h++] / 255, V[1] = S[h++] / 255, V[2] = S[h++] / 255, V[3] = S[h++] / 255, T[C] = V;
              }
            }
            return v;
          }
          getPixels(i) {
            let [u, x2] = this.output;
            return i ? l.flipPixels(this._imageData.data, u, x2) : this._imageData.data.slice(0);
          }
          _imageTo3DArray(i) {
            let u = new Array(i.length);
            for (let x2 = 0; x2 < i.length; x2++)
              u[x2] = this._mediaTo2DArray(i[x2]);
            return u;
          }
          _resultKernelHeader() {
            if (this.graphical || this.immutable || !this.pipeline)
              return "";
            switch (this.output.length) {
              case 1:
                return this._mutableKernel1DResults();
              case 2:
                return this._mutableKernel2DResults();
              case 3:
                return this._mutableKernel3DResults();
            }
          }
          _resultKernelBody(i) {
            switch (this.output.length) {
              case 1:
                return (!this.immutable && this.pipeline ? this._resultMutableKernel1DLoop(i) : this._resultImmutableKernel1DLoop(i)) + this._kernelOutput();
              case 2:
                return (!this.immutable && this.pipeline ? this._resultMutableKernel2DLoop(i) : this._resultImmutableKernel2DLoop(i)) + this._kernelOutput();
              case 3:
                return (!this.immutable && this.pipeline ? this._resultMutableKernel3DLoop(i) : this._resultImmutableKernel3DLoop(i)) + this._kernelOutput();
              default:
                throw new Error("unsupported size kernel");
            }
          }
          _graphicalKernelBody(i) {
            switch (this.output.length) {
              case 2:
                return this._graphicalKernel2DLoop(i) + this._graphicalOutput();
              default:
                throw new Error("unsupported size kernel");
            }
          }
          _graphicalOutput() {
            return `
          this._imageData.data.set(this._colorData);
          this.context.putImageData(this._imageData, 0, 0);
          return;`;
          }
          _getKernelResultTypeConstructorString() {
            switch (this.returnType) {
              case "LiteralInteger":
              case "Number":
              case "Integer":
              case "Float":
                return "Float32Array";
              case "Array(2)":
              case "Array(3)":
              case "Array(4)":
                return "Array";
              default:
                if (this.graphical)
                  return "Float32Array";
                throw new Error(`unhandled returnType ${this.returnType}`);
            }
          }
          _resultImmutableKernel1DLoop(i) {
            let u = this._getKernelResultTypeConstructorString();
            return `  const outputX = _this.output[0];
          const result = new ${u}(outputX);
          ${this._mapSubKernels((x2) => `const result_${x2.name} = new ${u}(outputX);
`).join("    ")}
          ${this._mapSubKernels((x2) => `let subKernelResult_${x2.name};
`).join("    ")}
          for (let x = 0; x < outputX; x++) {
            this.thread.x = x;
            this.thread.y = 0;
            this.thread.z = 0;
            ${i}
          }`;
          }
          _mutableKernel1DResults() {
            let i = this._getKernelResultTypeConstructorString();
            return `  const outputX = _this.output[0];
          const result = new ${i}(outputX);
          ${this._mapSubKernels((u) => `const result_${u.name} = new ${i}(outputX);
`).join("    ")}
          ${this._mapSubKernels((u) => `let subKernelResult_${u.name};
`).join("    ")}`;
          }
          _resultMutableKernel1DLoop(i) {
            return `  const outputX = _this.output[0];
          for (let x = 0; x < outputX; x++) {
            this.thread.x = x;
            this.thread.y = 0;
            this.thread.z = 0;
            ${i}
          }`;
          }
          _resultImmutableKernel2DLoop(i) {
            let u = this._getKernelResultTypeConstructorString();
            return `  const outputX = _this.output[0];
          const outputY = _this.output[1];
          const result = new Array(outputY);
          ${this._mapSubKernels((x2) => `const result_${x2.name} = new Array(outputY);
`).join("    ")}
          ${this._mapSubKernels((x2) => `let subKernelResult_${x2.name};
`).join("    ")}
          for (let y = 0; y < outputY; y++) {
            this.thread.z = 0;
            this.thread.y = y;
            const resultX = result[y] = new ${u}(outputX);
            ${this._mapSubKernels((x2) => `const resultX_${x2.name} = result_${x2.name}[y] = new ${u}(outputX);
`).join("")}
            for (let x = 0; x < outputX; x++) {
              this.thread.x = x;
              ${i}
            }
          }`;
          }
          _mutableKernel2DResults() {
            let i = this._getKernelResultTypeConstructorString();
            return `  const outputX = _this.output[0];
          const outputY = _this.output[1];
          const result = new Array(outputY);
          ${this._mapSubKernels((u) => `const result_${u.name} = new Array(outputY);
`).join("    ")}
          ${this._mapSubKernels((u) => `let subKernelResult_${u.name};
`).join("    ")}
          for (let y = 0; y < outputY; y++) {
            const resultX = result[y] = new ${i}(outputX);
            ${this._mapSubKernels((u) => `const resultX_${u.name} = result_${u.name}[y] = new ${i}(outputX);
`).join("")}
          }`;
          }
          _resultMutableKernel2DLoop(i) {
            let u = this._getKernelResultTypeConstructorString();
            return `  const outputX = _this.output[0];
          const outputY = _this.output[1];
          for (let y = 0; y < outputY; y++) {
            this.thread.z = 0;
            this.thread.y = y;
            const resultX = result[y];
            ${this._mapSubKernels((x2) => `const resultX_${x2.name} = result_${x2.name}[y] = new ${u}(outputX);
`).join("")}
            for (let x = 0; x < outputX; x++) {
              this.thread.x = x;
              ${i}
            }
          }`;
          }
          _graphicalKernel2DLoop(i) {
            return `  const outputX = _this.output[0];
          const outputY = _this.output[1];
          for (let y = 0; y < outputY; y++) {
            this.thread.z = 0;
            this.thread.y = y;
            for (let x = 0; x < outputX; x++) {
              this.thread.x = x;
              ${i}
            }
          }`;
          }
          _resultImmutableKernel3DLoop(i) {
            let u = this._getKernelResultTypeConstructorString();
            return `  const outputX = _this.output[0];
          const outputY = _this.output[1];
          const outputZ = _this.output[2];
          const result = new Array(outputZ);
          ${this._mapSubKernels((x2) => `const result_${x2.name} = new Array(outputZ);
`).join("    ")}
          ${this._mapSubKernels((x2) => `let subKernelResult_${x2.name};
`).join("    ")}
          for (let z = 0; z < outputZ; z++) {
            this.thread.z = z;
            const resultY = result[z] = new Array(outputY);
            ${this._mapSubKernels((x2) => `const resultY_${x2.name} = result_${x2.name}[z] = new Array(outputY);
`).join("      ")}
            for (let y = 0; y < outputY; y++) {
              this.thread.y = y;
              const resultX = resultY[y] = new ${u}(outputX);
              ${this._mapSubKernels((x2) => `const resultX_${x2.name} = resultY_${x2.name}[y] = new ${u}(outputX);
`).join("        ")}
              for (let x = 0; x < outputX; x++) {
                this.thread.x = x;
                ${i}
              }
            }
          }`;
          }
          _mutableKernel3DResults() {
            let i = this._getKernelResultTypeConstructorString();
            return `  const outputX = _this.output[0];
          const outputY = _this.output[1];
          const outputZ = _this.output[2];
          const result = new Array(outputZ);
          ${this._mapSubKernels((u) => `const result_${u.name} = new Array(outputZ);
`).join("    ")}
          ${this._mapSubKernels((u) => `let subKernelResult_${u.name};
`).join("    ")}
          for (let z = 0; z < outputZ; z++) {
            const resultY = result[z] = new Array(outputY);
            ${this._mapSubKernels((u) => `const resultY_${u.name} = result_${u.name}[z] = new Array(outputY);
`).join("      ")}
            for (let y = 0; y < outputY; y++) {
              const resultX = resultY[y] = new ${i}(outputX);
              ${this._mapSubKernels((u) => `const resultX_${u.name} = resultY_${u.name}[y] = new ${i}(outputX);
`).join("        ")}
            }
          }`;
          }
          _resultMutableKernel3DLoop(i) {
            return `  const outputX = _this.output[0];
          const outputY = _this.output[1];
          const outputZ = _this.output[2];
          for (let z = 0; z < outputZ; z++) {
            this.thread.z = z;
            const resultY = result[z];
            for (let y = 0; y < outputY; y++) {
              this.thread.y = y;
              const resultX = resultY[y];
              for (let x = 0; x < outputX; x++) {
                this.thread.x = x;
                ${i}
              }
            }
          }`;
          }
          _kernelOutput() {
            return this.subKernels ? `
    return {
            result: result,
            ${this.subKernels.map((i) => `${i.property}: result_${i.name}`).join(`,
      `)}
          };` : `
    return result;`;
          }
          _mapSubKernels(i) {
            return this.subKernels === null ? [""] : this.subKernels.map(i);
          }
          destroy(i) {
            i && delete this.canvas;
          }
          static destroyContext(i) {
          }
          toJSON() {
            let i = super.toJSON();
            return i.functionNodes = g.fromKernel(this, f).toJSON(), i;
          }
          setOutput(i) {
            super.setOutput(i);
            let [u, x2] = this.output;
            this.graphical && (this._imageData = this.context.createImageData(u, x2), this._colorData = new Uint8ClampedArray(u * x2 * 4));
          }
          prependString(i) {
            if (this._kernelString)
              throw new Error("Kernel already built");
            this._prependedString.push(i);
          }
          hasPrependString(i) {
            return this._prependedString.indexOf(i) > -1;
          }
        }
        y.exports = { CPUKernel: s };
      }, { "../../utils": 114, "../function-builder": 9, "../kernel": 36, "./function-node": 6, "./kernel-string": 7 }], 9: [function(o, y, E) {
        class p {
          static fromKernel(f, l, n) {
            let { kernelArguments: s, kernelConstants: t, argumentNames: i, argumentSizes: u, argumentBitRatios: x2, constants: w, constantBitRatios: m, debug: S, loopMaxIterations: v, nativeFunctions: h, output: b, optimizeFloatMemory: T, precision: C, plugins: V, source: c, subKernels: a, functions: k, leadingReturnStatement: A, followingReturnStatement: N, dynamicArguments: F, dynamicOutput: R } = f, K = new Array(s.length), O = {};
            for (let te = 0; te < s.length; te++)
              K[te] = s[te].type;
            for (let te = 0; te < t.length; te++) {
              let re = t[te];
              O[re.name] = re.type;
            }
            let X = (te, re) => pe.needsArgumentType(te, re), B = (te, re, de) => {
              pe.assignArgumentType(te, re, de);
            }, P = (te, re, de) => pe.lookupReturnType(te, re, de), Y = (te) => pe.lookupFunctionArgumentTypes(te), J = (te, re) => pe.lookupFunctionArgumentName(te, re), q = (te, re) => pe.lookupFunctionArgumentBitRatio(te, re), j = (te, re, de, Te) => {
              pe.assignArgumentType(te, re, de, Te);
            }, U = (te, re, de, Te) => {
              pe.assignArgumentBitRatio(te, re, de, Te);
            }, oe = (te, re, de) => {
              pe.trackFunctionCall(te, re, de);
            }, Z = (te, re) => {
              let de = [];
              for (let Se = 0; Se < te.params.length; Se++)
                de.push(te.params[Se].name);
              let Te = new l(re, Object.assign({}, ee, { returnType: null, ast: te, name: te.id.name, argumentNames: de, lookupReturnType: P, lookupFunctionArgumentTypes: Y, lookupFunctionArgumentName: J, lookupFunctionArgumentBitRatio: q, needsArgumentType: X, assignArgumentType: B, triggerImplyArgumentType: j, triggerImplyArgumentBitRatio: U, onFunctionCall: oe }));
              Te.traceFunctionAST(te), pe.addFunctionNode(Te);
            }, ee = Object.assign({ isRootKernel: false, onNestedFunction: Z, lookupReturnType: P, lookupFunctionArgumentTypes: Y, lookupFunctionArgumentName: J, lookupFunctionArgumentBitRatio: q, needsArgumentType: X, assignArgumentType: B, triggerImplyArgumentType: j, triggerImplyArgumentBitRatio: U, onFunctionCall: oe, optimizeFloatMemory: T, precision: C, constants: w, constantTypes: O, constantBitRatios: m, debug: S, loopMaxIterations: v, output: b, plugins: V, dynamicArguments: F, dynamicOutput: R }, n || {}), be = Object.assign({}, ee, { isRootKernel: true, name: "kernel", argumentNames: i, argumentTypes: K, argumentSizes: u, argumentBitRatios: x2, leadingReturnStatement: A, followingReturnStatement: N });
            if (typeof c == "object" && c.functionNodes)
              return new p().fromJSON(c.functionNodes, l);
            let Q = new l(c, be), ue = null;
            k && (ue = k.map((te) => new l(te.source, { returnType: te.returnType, argumentTypes: te.argumentTypes, output: b, plugins: V, constants: w, constantTypes: O, constantBitRatios: m, optimizeFloatMemory: T, precision: C, lookupReturnType: P, lookupFunctionArgumentTypes: Y, lookupFunctionArgumentName: J, lookupFunctionArgumentBitRatio: q, needsArgumentType: X, assignArgumentType: B, triggerImplyArgumentType: j, triggerImplyArgumentBitRatio: U, onFunctionCall: oe, onNestedFunction: Z })));
            let he = null;
            a && (he = a.map((te) => {
              let { name: re, source: de } = te;
              return new l(de, Object.assign({}, ee, { name: re, isSubKernel: true, isRootKernel: false }));
            }));
            let pe = new p({ kernel: f, rootNode: Q, functionNodes: ue, nativeFunctions: h, subKernelNodes: he });
            return pe;
          }
          constructor(f) {
            if (f = f || {}, this.kernel = f.kernel, this.rootNode = f.rootNode, this.functionNodes = f.functionNodes || [], this.subKernelNodes = f.subKernelNodes || [], this.nativeFunctions = f.nativeFunctions || [], this.functionMap = {}, this.nativeFunctionNames = [], this.lookupChain = [], this.functionNodeDependencies = {}, this.functionCalls = {}, this.rootNode && (this.functionMap.kernel = this.rootNode), this.functionNodes)
              for (let l = 0; l < this.functionNodes.length; l++)
                this.functionMap[this.functionNodes[l].name] = this.functionNodes[l];
            if (this.subKernelNodes)
              for (let l = 0; l < this.subKernelNodes.length; l++)
                this.functionMap[this.subKernelNodes[l].name] = this.subKernelNodes[l];
            if (this.nativeFunctions)
              for (let l = 0; l < this.nativeFunctions.length; l++) {
                let n = this.nativeFunctions[l];
                this.nativeFunctionNames.push(n.name);
              }
          }
          addFunctionNode(f) {
            if (!f.name)
              throw new Error("functionNode.name needs set");
            this.functionMap[f.name] = f, f.isRootKernel && (this.rootNode = f);
          }
          traceFunctionCalls(f, l) {
            if (f = f || "kernel", l = l || [], this.nativeFunctionNames.indexOf(f) > -1) {
              let s = l.indexOf(f);
              if (s === -1)
                l.push(f);
              else {
                let t = l.splice(s, 1)[0];
                l.push(t);
              }
              return l;
            }
            let n = this.functionMap[f];
            if (n) {
              let s = l.indexOf(f);
              if (s === -1) {
                l.push(f), n.toString();
                for (let t = 0; t < n.calledFunctions.length; ++t)
                  this.traceFunctionCalls(n.calledFunctions[t], l);
              } else {
                let t = l.splice(s, 1)[0];
                l.push(t);
              }
            }
            return l;
          }
          getPrototypeString(f) {
            return this.getPrototypes(f).join(`
`);
          }
          getPrototypes(f) {
            return this.rootNode && this.rootNode.toString(), f ? this.getPrototypesFromFunctionNames(this.traceFunctionCalls(f, []).reverse()) : this.getPrototypesFromFunctionNames(Object.keys(this.functionMap));
          }
          getStringFromFunctionNames(f) {
            let l = [];
            for (let n = 0; n < f.length; ++n)
              this.functionMap[f[n]] && l.push(this.functionMap[f[n]].toString());
            return l.join(`
`);
          }
          getPrototypesFromFunctionNames(f) {
            let l = [];
            for (let n = 0; n < f.length; ++n) {
              let s = f[n], t = this.nativeFunctionNames.indexOf(s);
              if (t > -1) {
                l.push(this.nativeFunctions[t].source);
                continue;
              }
              let i = this.functionMap[s];
              i && l.push(i.toString());
            }
            return l;
          }
          toJSON() {
            return this.traceFunctionCalls(this.rootNode.name).reverse().map((f) => {
              let l = this.nativeFunctions.indexOf(f);
              if (l > -1)
                return { name: f, source: this.nativeFunctions[l].source };
              if (this.functionMap[f])
                return this.functionMap[f].toJSON();
              throw new Error(`function ${f} not found`);
            });
          }
          fromJSON(f, l) {
            this.functionMap = {};
            for (let n = 0; n < f.length; n++) {
              let s = f[n];
              this.functionMap[s.settings.name] = new l(s.ast, s.settings);
            }
            return this;
          }
          getString(f) {
            return f ? this.getStringFromFunctionNames(this.traceFunctionCalls(f).reverse()) : this.getStringFromFunctionNames(Object.keys(this.functionMap));
          }
          lookupReturnType(f, l, n) {
            if (l.type !== "CallExpression")
              throw new Error(`expected ast type of "CallExpression", but is ${l.type}`);
            if (this._isNativeFunction(f))
              return this._lookupNativeFunctionReturnType(f);
            if (this._isFunction(f)) {
              let s = this._getFunction(f);
              if (s.returnType)
                return s.returnType;
              {
                for (let i = 0; i < this.lookupChain.length; i++)
                  if (this.lookupChain[i].ast === l) {
                    if (s.argumentTypes.length === 0 && l.arguments.length > 0) {
                      let u = l.arguments;
                      for (let x2 = 0; x2 < u.length; x2++)
                        this.lookupChain.push({ name: n.name, ast: u[i], requestingNode: n }), s.argumentTypes[x2] = n.getType(u[x2]), this.lookupChain.pop();
                      return s.returnType = s.getType(s.getJsAST());
                    }
                    throw new Error("circlical logic detected!");
                  }
                this.lookupChain.push({ name: n.name, ast: l, requestingNode: n });
                let t = s.getType(s.getJsAST());
                return this.lookupChain.pop(), s.returnType = t;
              }
            }
            return null;
          }
          _getFunction(f) {
            return this._isFunction(f) || new Error(`Function ${f} not found`), this.functionMap[f];
          }
          _isFunction(f) {
            return Boolean(this.functionMap[f]);
          }
          _getNativeFunction(f) {
            for (let l = 0; l < this.nativeFunctions.length; l++)
              if (this.nativeFunctions[l].name === f)
                return this.nativeFunctions[l];
            return null;
          }
          _isNativeFunction(f) {
            return Boolean(this._getNativeFunction(f));
          }
          _lookupNativeFunctionReturnType(f) {
            let l = this._getNativeFunction(f);
            if (l)
              return l.returnType;
            throw new Error(`Native function ${f} not found`);
          }
          lookupFunctionArgumentTypes(f) {
            return this._isNativeFunction(f) ? this._getNativeFunction(f).argumentTypes : this._isFunction(f) ? this._getFunction(f).argumentTypes : null;
          }
          lookupFunctionArgumentName(f, l) {
            return this._getFunction(f).argumentNames[l];
          }
          lookupFunctionArgumentBitRatio(f, l) {
            if (!this._isFunction(f))
              throw new Error("function not found");
            if (this.rootNode.name === f) {
              let i = this.rootNode.argumentNames.indexOf(l);
              if (i !== -1)
                return this.rootNode.argumentBitRatios[i];
            }
            let n = this._getFunction(f), s = n.argumentNames.indexOf(l);
            if (s === -1)
              throw new Error("argument not found");
            let t = n.argumentBitRatios[s];
            if (typeof t != "number")
              throw new Error("argument bit ratio not found");
            return t;
          }
          needsArgumentType(f, l) {
            return this._isFunction(f) ? !this._getFunction(f).argumentTypes[l] : false;
          }
          assignArgumentType(f, l, n, s) {
            if (!this._isFunction(f))
              return;
            let t = this._getFunction(f);
            t.argumentTypes[l] || (t.argumentTypes[l] = n);
          }
          assignArgumentBitRatio(f, l, n, s) {
            let t = this._getFunction(f);
            if (this._isNativeFunction(n))
              return null;
            let i = this._getFunction(n), u = t.argumentNames.indexOf(l);
            if (u === -1)
              throw new Error(`Argument ${l} not found in arguments from function ${f}`);
            let x2 = t.argumentBitRatios[u];
            if (typeof x2 != "number")
              throw new Error(`Bit ratio for argument ${l} not found in function ${f}`);
            i.argumentBitRatios || (i.argumentBitRatios = new Array(i.argumentNames.length));
            let w = i.argumentBitRatios[u];
            if (typeof w == "number") {
              if (w !== x2)
                throw new Error(`Incompatible bit ratio found at function ${f} at argument ${l}`);
              return w;
            }
            return i.argumentBitRatios[u] = x2, x2;
          }
          trackFunctionCall(f, l, n) {
            this.functionNodeDependencies[f] || (this.functionNodeDependencies[f] = /* @__PURE__ */ new Set(), this.functionCalls[f] = []), this.functionNodeDependencies[f].add(l), this.functionCalls[f].push(n);
          }
          getKernelResultType() {
            return this.rootNode.returnType || this.rootNode.getType(this.rootNode.ast);
          }
          getSubKernelResultType(f) {
            let l = this.subKernelNodes[f], n = false;
            for (let s = 0; s < this.rootNode.functionCalls.length; s++)
              this.rootNode.functionCalls[s].ast.callee.name === l.name && (n = true);
            if (!n)
              throw new Error(`SubKernel ${l.name} never called by kernel`);
            return l.returnType || l.getType(l.getJsAST());
          }
          getReturnTypes() {
            let f = { [this.rootNode.name]: this.rootNode.getType(this.rootNode.ast) }, l = this.traceFunctionCalls(this.rootNode.name);
            for (let n = 0; n < l.length; n++) {
              let s = l[n], t = this.functionMap[s];
              f[s] = t.getType(t.ast);
            }
            return f;
          }
        }
        y.exports = { FunctionBuilder: p };
      }, {}], 10: [function(o, y, E) {
        let p = o("acorn"), { utils: g } = o("../utils"), { FunctionTracer: f } = o("./function-tracer");
        class l {
          constructor(t, i) {
            if (!t && !i.ast)
              throw new Error("source parameter is missing");
            if (i = i || {}, this.source = t, this.ast = null, this.name = typeof t == "string" ? i.isRootKernel ? "kernel" : i.name || g.getFunctionNameFromString(t) : null, this.calledFunctions = [], this.constants = {}, this.constantTypes = {}, this.constantBitRatios = {}, this.isRootKernel = false, this.isSubKernel = false, this.debug = null, this.functions = null, this.identifiers = null, this.contexts = null, this.functionCalls = null, this.states = [], this.needsArgumentType = null, this.assignArgumentType = null, this.lookupReturnType = null, this.lookupFunctionArgumentTypes = null, this.lookupFunctionArgumentBitRatio = null, this.triggerImplyArgumentType = null, this.triggerImplyArgumentBitRatio = null, this.onNestedFunction = null, this.onFunctionCall = null, this.optimizeFloatMemory = null, this.precision = null, this.loopMaxIterations = null, this.argumentNames = typeof this.source == "string" ? g.getArgumentNamesFromString(this.source) : null, this.argumentTypes = [], this.argumentSizes = [], this.argumentBitRatios = null, this.returnType = null, this.output = [], this.plugins = null, this.leadingReturnStatement = null, this.followingReturnStatement = null, this.dynamicOutput = null, this.dynamicArguments = null, this.strictTypingChecking = false, this.fixIntegerDivisionAccuracy = null, i)
              for (let u in i)
                !i.hasOwnProperty(u) || !this.hasOwnProperty(u) || (this[u] = i[u]);
            this.literalTypes = {}, this.validate(), this._string = null, this._internalVariableNames = {};
          }
          validate() {
            if (typeof this.source != "string" && !this.ast)
              throw new Error("this.source not a string");
            if (!this.ast && !g.isFunctionString(this.source))
              throw new Error("this.source not a function string");
            if (!this.name)
              throw new Error("this.name could not be set");
            if (this.argumentTypes.length > 0 && this.argumentTypes.length !== this.argumentNames.length)
              throw new Error(`argumentTypes count of ${this.argumentTypes.length} exceeds ${this.argumentNames.length}`);
            if (this.output.length < 1)
              throw new Error("this.output is not big enough");
          }
          isIdentifierConstant(t) {
            return this.constants ? this.constants.hasOwnProperty(t) : false;
          }
          isInput(t) {
            return this.argumentTypes[this.argumentNames.indexOf(t)] === "Input";
          }
          pushState(t) {
            this.states.push(t);
          }
          popState(t) {
            if (this.state !== t)
              throw new Error(`Cannot popState ${t} when in ${this.state}`);
            this.states.pop();
          }
          isState(t) {
            return this.state === t;
          }
          get state() {
            return this.states[this.states.length - 1];
          }
          astMemberExpressionUnroll(t) {
            if (t.type === "Identifier")
              return t.name;
            if (t.type === "ThisExpression")
              return "this";
            if (t.type === "MemberExpression" && t.object && t.property)
              return t.object.hasOwnProperty("name") && t.object.name !== "Math" ? this.astMemberExpressionUnroll(t.property) : this.astMemberExpressionUnroll(t.object) + "." + this.astMemberExpressionUnroll(t.property);
            if (t.hasOwnProperty("expressions")) {
              let i = t.expressions[0];
              if (i.type === "Literal" && i.value === 0 && t.expressions.length === 2)
                return this.astMemberExpressionUnroll(t.expressions[1]);
            }
            throw this.astErrorOutput("Unknown astMemberExpressionUnroll", t);
          }
          getJsAST(t) {
            if (this.ast)
              return this.ast;
            if (typeof this.source == "object")
              return this.traceFunctionAST(this.source), this.ast = this.source;
            if (t = t || p, t === null)
              throw new Error("Missing JS to AST parser");
            let i = Object.freeze(t.parse(`const parser_${this.name} = ${this.source};`, { locations: true })), u = i.body[0].declarations[0].init;
            if (this.traceFunctionAST(u), !i)
              throw new Error("Failed to parse JS code");
            return this.ast = u;
          }
          traceFunctionAST(t) {
            let { contexts: i, declarations: u, functions: x2, identifiers: w, functionCalls: m } = new f(t);
            this.contexts = i, this.identifiers = w, this.functionCalls = m, this.functions = x2;
            for (let S = 0; S < u.length; S++) {
              let v = u[S], { ast: h, inForLoopInit: b, inForLoopTest: T } = v, { init: C } = h, V = this.getDependencies(C), c = null;
              if (b && T)
                c = "Integer";
              else if (C) {
                let a = this.getType(C);
                switch (a) {
                  case "Integer":
                  case "Float":
                  case "Number":
                    C.type === "MemberExpression" ? c = a : c = "Number";
                    break;
                  case "LiteralInteger":
                    c = "Number";
                    break;
                  default:
                    c = a;
                }
              }
              v.valueType = c, v.dependencies = V, v.isSafe = this.isSafeDependencies(V);
            }
            for (let S = 0; S < x2.length; S++)
              this.onNestedFunction(x2[S], this.source);
          }
          getDeclaration(t) {
            for (let i = 0; i < this.identifiers.length; i++) {
              let u = this.identifiers[i];
              if (t === u.ast)
                return u.declaration;
            }
            return null;
          }
          getVariableType(t) {
            if (t.type !== "Identifier")
              throw new Error(`ast of ${t.type} not "Identifier"`);
            let i = null, u = this.argumentNames.indexOf(t.name);
            if (u === -1) {
              let x2 = this.getDeclaration(t);
              if (x2)
                return x2.valueType;
            } else {
              let x2 = this.argumentTypes[u];
              x2 && (i = x2);
            }
            if (!i && this.strictTypingChecking)
              throw new Error(`Declaration of ${name} not found`);
            return i;
          }
          getLookupType(t) {
            if (!n.hasOwnProperty(t))
              throw new Error(`unknown typeLookupMap ${t}`);
            return n[t];
          }
          getConstantType(t) {
            if (this.constantTypes[t]) {
              let i = this.constantTypes[t];
              return i === "Float" ? "Number" : i;
            }
            throw new Error(`Type for constant "${t}" not declared`);
          }
          toString() {
            return this._string ? this._string : this._string = this.astGeneric(this.getJsAST(), []).join("").trim();
          }
          toJSON() {
            let t = { source: this.source, name: this.name, constants: this.constants, constantTypes: this.constantTypes, isRootKernel: this.isRootKernel, isSubKernel: this.isSubKernel, debug: this.debug, output: this.output, loopMaxIterations: this.loopMaxIterations, argumentNames: this.argumentNames, argumentTypes: this.argumentTypes, argumentSizes: this.argumentSizes, returnType: this.returnType, leadingReturnStatement: this.leadingReturnStatement, followingReturnStatement: this.followingReturnStatement };
            return { ast: this.ast, settings: t };
          }
          getType(t) {
            if (Array.isArray(t))
              return this.getType(t[t.length - 1]);
            switch (t.type) {
              case "BlockStatement":
                return this.getType(t.body);
              case "ArrayExpression":
                switch (this.getType(t.elements[0])) {
                  case "Array(2)":
                  case "Array(3)":
                  case "Array(4)":
                    return `Matrix(${t.elements.length})`;
                }
                return `Array(${t.elements.length})`;
              case "Literal":
                let u = this.astKey(t);
                return this.literalTypes[u] ? this.literalTypes[u] : Number.isInteger(t.value) ? "LiteralInteger" : t.value === true || t.value === false ? "Boolean" : "Number";
              case "AssignmentExpression":
                return this.getType(t.left);
              case "CallExpression":
                if (this.isAstMathFunction(t))
                  return "Number";
                if (!t.callee || !t.callee.name) {
                  if (t.callee.type === "SequenceExpression" && t.callee.expressions[t.callee.expressions.length - 1].property.name) {
                    let v = t.callee.expressions[t.callee.expressions.length - 1].property.name;
                    return this.inferArgumentTypesIfNeeded(v, t.arguments), this.lookupReturnType(v, t, this);
                  }
                  if (this.getVariableSignature(t.callee, true) === "this.color")
                    return null;
                  if (t.callee.type === "MemberExpression" && t.callee.object && t.callee.property && t.callee.property.name && t.arguments) {
                    let v = t.callee.property.name;
                    return this.inferArgumentTypesIfNeeded(v, t.arguments), this.lookupReturnType(v, t, this);
                  }
                  throw this.astErrorOutput("Unknown call expression", t);
                }
                if (t.callee && t.callee.name) {
                  let v = t.callee.name;
                  return this.inferArgumentTypesIfNeeded(v, t.arguments), this.lookupReturnType(v, t, this);
                }
                throw this.astErrorOutput(`Unhandled getType Type "${t.type}"`, t);
              case "LogicalExpression":
                return "Boolean";
              case "BinaryExpression":
                switch (t.operator) {
                  case "%":
                  case "/":
                    if (this.fixIntegerDivisionAccuracy)
                      return "Number";
                    break;
                  case ">":
                  case "<":
                    return "Boolean";
                  case "&":
                  case "|":
                  case "^":
                  case "<<":
                  case ">>":
                  case ">>>":
                    return "Integer";
                }
                let x2 = this.getType(t.left);
                if (this.isState("skip-literal-correction"))
                  return x2;
                if (x2 === "LiteralInteger") {
                  let v = this.getType(t.right);
                  return v === "LiteralInteger" ? t.left.value % 1 === 0 ? "Integer" : "Float" : v;
                }
                return n[x2] || x2;
              case "UpdateExpression":
                return this.getType(t.argument);
              case "UnaryExpression":
                return t.operator === "~" ? "Integer" : this.getType(t.argument);
              case "VariableDeclaration": {
                let v = t.declarations, h;
                for (let b = 0; b < v.length; b++) {
                  let T = v[b];
                  h = this.getType(T);
                }
                if (!h)
                  throw this.astErrorOutput("Unable to find type for declaration", t);
                return h;
              }
              case "VariableDeclarator":
                let w = this.getDeclaration(t.id);
                if (!w)
                  throw this.astErrorOutput("Unable to find declarator", t);
                if (!w.valueType)
                  throw this.astErrorOutput("Unable to find declarator valueType", t);
                return w.valueType;
              case "Identifier":
                if (t.name === "Infinity")
                  return "Number";
                if (this.isAstVariable(t) && this.getVariableSignature(t) === "value")
                  return this.getCheckVariableType(t);
                let m = this.findIdentifierOrigin(t);
                return m && m.init ? this.getType(m.init) : null;
              case "ReturnStatement":
                return this.getType(t.argument);
              case "MemberExpression":
                if (this.isAstMathFunction(t)) {
                  switch (t.property.name) {
                    case "ceil":
                      return "Integer";
                    case "floor":
                      return "Integer";
                    case "round":
                      return "Integer";
                  }
                  return "Number";
                }
                if (this.isAstVariable(t)) {
                  switch (this.getVariableSignature(t)) {
                    case "value[]":
                      return this.getLookupType(this.getCheckVariableType(t.object));
                    case "value[][]":
                      return this.getLookupType(this.getCheckVariableType(t.object.object));
                    case "value[][][]":
                      return this.getLookupType(this.getCheckVariableType(t.object.object.object));
                    case "value[][][][]":
                      return this.getLookupType(this.getCheckVariableType(t.object.object.object.object));
                    case "value.thread.value":
                    case "this.thread.value":
                      return "Integer";
                    case "this.output.value":
                      return this.dynamicOutput ? "Integer" : "LiteralInteger";
                    case "this.constants.value":
                      return this.getConstantType(t.property.name);
                    case "this.constants.value[]":
                      return this.getLookupType(this.getConstantType(t.object.property.name));
                    case "this.constants.value[][]":
                      return this.getLookupType(this.getConstantType(t.object.object.property.name));
                    case "this.constants.value[][][]":
                      return this.getLookupType(this.getConstantType(t.object.object.object.property.name));
                    case "this.constants.value[][][][]":
                      return this.getLookupType(this.getConstantType(t.object.object.object.object.property.name));
                    case "fn()[]":
                    case "fn()[][]":
                    case "fn()[][][]":
                      return this.getLookupType(this.getType(t.object));
                    case "value.value":
                      if (this.isAstMathVariable(t))
                        return "Number";
                      switch (t.property.name) {
                        case "r":
                        case "g":
                        case "b":
                        case "a":
                          return this.getLookupType(this.getCheckVariableType(t.object));
                      }
                    case "[][]":
                      return "Number";
                  }
                  throw this.astErrorOutput("Unhandled getType MemberExpression", t);
                }
                throw this.astErrorOutput("Unhandled getType MemberExpression", t);
              case "ConditionalExpression":
                return this.getType(t.consequent);
              case "FunctionDeclaration":
              case "FunctionExpression":
                let S = this.findLastReturn(t.body);
                return S ? this.getType(S) : null;
              case "IfStatement":
                return this.getType(t.consequent);
              case "SequenceExpression":
                return this.getType(t.expressions[t.expressions.length - 1]);
              default:
                throw this.astErrorOutput(`Unhandled getType Type "${t.type}"`, t);
            }
          }
          getCheckVariableType(t) {
            let i = this.getVariableType(t);
            if (!i)
              throw this.astErrorOutput(`${t.type} is not defined`, t);
            return i;
          }
          inferArgumentTypesIfNeeded(t, i) {
            for (let u = 0; u < i.length; u++) {
              if (!this.needsArgumentType(t, u))
                continue;
              let x2 = this.getType(i[u]);
              if (!x2)
                throw this.astErrorOutput(`Unable to infer argument ${u}`, i[u]);
              this.assignArgumentType(t, u, x2);
            }
          }
          isAstMathVariable(t) {
            let i = ["E", "PI", "SQRT2", "SQRT1_2", "LN2", "LN10", "LOG2E", "LOG10E"];
            return t.type === "MemberExpression" && t.object && t.object.type === "Identifier" && t.object.name === "Math" && t.property && t.property.type === "Identifier" && i.indexOf(t.property.name) > -1;
          }
          isAstMathFunction(t) {
            let i = ["abs", "acos", "acosh", "asin", "asinh", "atan", "atan2", "atanh", "cbrt", "ceil", "clz32", "cos", "cosh", "expm1", "exp", "floor", "fround", "imul", "log", "log2", "log10", "log1p", "max", "min", "pow", "random", "round", "sign", "sin", "sinh", "sqrt", "tan", "tanh", "trunc"];
            return t.type === "CallExpression" && t.callee && t.callee.type === "MemberExpression" && t.callee.object && t.callee.object.type === "Identifier" && t.callee.object.name === "Math" && t.callee.property && t.callee.property.type === "Identifier" && i.indexOf(t.callee.property.name) > -1;
          }
          isAstVariable(t) {
            return t.type === "Identifier" || t.type === "MemberExpression";
          }
          isSafe(t) {
            return this.isSafeDependencies(this.getDependencies(t));
          }
          isSafeDependencies(t) {
            return t && t.every ? t.every((i) => i.isSafe) : true;
          }
          getDependencies(t, i, u) {
            if (i || (i = []), !t)
              return null;
            if (Array.isArray(t)) {
              for (let x2 = 0; x2 < t.length; x2++)
                this.getDependencies(t[x2], i, u);
              return i;
            }
            switch (t.type) {
              case "AssignmentExpression":
                return this.getDependencies(t.left, i, u), this.getDependencies(t.right, i, u), i;
              case "ConditionalExpression":
                return this.getDependencies(t.test, i, u), this.getDependencies(t.alternate, i, u), this.getDependencies(t.consequent, i, u), i;
              case "Literal":
                i.push({ origin: "literal", value: t.value, isSafe: u === true ? false : t.value > -1 / 0 && t.value < 1 / 0 && !isNaN(t.value) });
                break;
              case "VariableDeclarator":
                return this.getDependencies(t.init, i, u);
              case "Identifier":
                let x2 = this.getDeclaration(t);
                if (x2)
                  i.push({ name: t.name, origin: "declaration", isSafe: u ? false : this.isSafeDependencies(x2.dependencies) });
                else if (this.argumentNames.indexOf(t.name) > -1)
                  i.push({ name: t.name, origin: "argument", isSafe: false });
                else if (this.strictTypingChecking)
                  throw new Error(`Cannot find identifier origin "${t.name}"`);
                break;
              case "FunctionDeclaration":
                return this.getDependencies(t.body.body[t.body.body.length - 1], i, u);
              case "ReturnStatement":
                return this.getDependencies(t.argument, i);
              case "BinaryExpression":
              case "LogicalExpression":
                return u = t.operator === "/" || t.operator === "*", this.getDependencies(t.left, i, u), this.getDependencies(t.right, i, u), i;
              case "UnaryExpression":
              case "UpdateExpression":
                return this.getDependencies(t.argument, i, u);
              case "VariableDeclaration":
                return this.getDependencies(t.declarations, i, u);
              case "ArrayExpression":
                return i.push({ origin: "declaration", isSafe: true }), i;
              case "CallExpression":
                return i.push({ origin: "function", isSafe: true }), i;
              case "MemberExpression":
                let w = this.getMemberExpressionDetails(t);
                switch (w.signature) {
                  case "value[]":
                    this.getDependencies(t.object, i, u);
                    break;
                  case "value[][]":
                    this.getDependencies(t.object.object, i, u);
                    break;
                  case "value[][][]":
                    this.getDependencies(t.object.object.object, i, u);
                    break;
                  case "this.output.value":
                    this.dynamicOutput && i.push({ name: w.name, origin: "output", isSafe: false });
                    break;
                }
                if (w)
                  return w.property && this.getDependencies(w.property, i, u), w.xProperty && this.getDependencies(w.xProperty, i, u), w.yProperty && this.getDependencies(w.yProperty, i, u), w.zProperty && this.getDependencies(w.zProperty, i, u), i;
              case "SequenceExpression":
                return this.getDependencies(t.expressions, i, u);
              default:
                throw this.astErrorOutput(`Unhandled type ${t.type} in getDependencies`, t);
            }
            return i;
          }
          getVariableSignature(t, i) {
            if (!this.isAstVariable(t))
              throw new Error(`ast of type "${t.type}" is not a variable signature`);
            if (t.type === "Identifier")
              return "value";
            let u = [];
            for (; t; )
              t.computed ? u.push("[]") : t.type === "ThisExpression" ? u.unshift("this") : t.property && t.property.name ? t.property.name === "x" || t.property.name === "y" || t.property.name === "z" ? u.unshift(i ? "." + t.property.name : ".value") : t.property.name === "constants" || t.property.name === "thread" || t.property.name === "output" ? u.unshift("." + t.property.name) : u.unshift(i ? "." + t.property.name : ".value") : t.name ? u.unshift(i ? t.name : "value") : t.callee && t.callee.name ? u.unshift(i ? t.callee.name + "()" : "fn()") : t.elements ? u.unshift("[]") : u.unshift("unknown"), t = t.object;
            let x2 = u.join("");
            return i || ["value", "value[]", "value[][]", "value[][][]", "value[][][][]", "value.value", "value.thread.value", "this.thread.value", "this.output.value", "this.constants.value", "this.constants.value[]", "this.constants.value[][]", "this.constants.value[][][]", "this.constants.value[][][][]", "fn()[]", "fn()[][]", "fn()[][][]", "[][]"].indexOf(x2) > -1 ? x2 : null;
          }
          build() {
            return this.toString().length > 0;
          }
          astGeneric(t, i) {
            if (t === null)
              throw this.astErrorOutput("NULL ast", t);
            if (Array.isArray(t)) {
              for (let u = 0; u < t.length; u++)
                this.astGeneric(t[u], i);
              return i;
            }
            switch (t.type) {
              case "FunctionDeclaration":
                return this.astFunctionDeclaration(t, i);
              case "FunctionExpression":
                return this.astFunctionExpression(t, i);
              case "ReturnStatement":
                return this.astReturnStatement(t, i);
              case "Literal":
                return this.astLiteral(t, i);
              case "BinaryExpression":
                return this.astBinaryExpression(t, i);
              case "Identifier":
                return this.astIdentifierExpression(t, i);
              case "AssignmentExpression":
                return this.astAssignmentExpression(t, i);
              case "ExpressionStatement":
                return this.astExpressionStatement(t, i);
              case "EmptyStatement":
                return this.astEmptyStatement(t, i);
              case "BlockStatement":
                return this.astBlockStatement(t, i);
              case "IfStatement":
                return this.astIfStatement(t, i);
              case "SwitchStatement":
                return this.astSwitchStatement(t, i);
              case "BreakStatement":
                return this.astBreakStatement(t, i);
              case "ContinueStatement":
                return this.astContinueStatement(t, i);
              case "ForStatement":
                return this.astForStatement(t, i);
              case "WhileStatement":
                return this.astWhileStatement(t, i);
              case "DoWhileStatement":
                return this.astDoWhileStatement(t, i);
              case "VariableDeclaration":
                return this.astVariableDeclaration(t, i);
              case "VariableDeclarator":
                return this.astVariableDeclarator(t, i);
              case "ThisExpression":
                return this.astThisExpression(t, i);
              case "SequenceExpression":
                return this.astSequenceExpression(t, i);
              case "UnaryExpression":
                return this.astUnaryExpression(t, i);
              case "UpdateExpression":
                return this.astUpdateExpression(t, i);
              case "LogicalExpression":
                return this.astLogicalExpression(t, i);
              case "MemberExpression":
                return this.astMemberExpression(t, i);
              case "CallExpression":
                return this.astCallExpression(t, i);
              case "ArrayExpression":
                return this.astArrayExpression(t, i);
              case "DebuggerStatement":
                return this.astDebuggerStatement(t, i);
              case "ConditionalExpression":
                return this.astConditionalExpression(t, i);
            }
            throw this.astErrorOutput("Unknown ast type : " + t.type, t);
          }
          astErrorOutput(t, i) {
            if (typeof this.source != "string")
              return new Error(t);
            let u = g.getAstString(this.source, i), w = this.source.substr(i.start).split(/\n/), m = w.length > 0 ? w[w.length - 1] : 0;
            return new Error(`${t} on line ${w.length}, position ${m.length}:
 ${u}`);
          }
          astDebuggerStatement(t, i) {
            return i;
          }
          astConditionalExpression(t, i) {
            if (t.type !== "ConditionalExpression")
              throw this.astErrorOutput("Not a conditional expression", t);
            return i.push("("), this.astGeneric(t.test, i), i.push("?"), this.astGeneric(t.consequent, i), i.push(":"), this.astGeneric(t.alternate, i), i.push(")"), i;
          }
          astFunction(t, i) {
            throw new Error(`"astFunction" not defined on ${this.constructor.name}`);
          }
          astFunctionDeclaration(t, i) {
            return this.isChildFunction(t) ? i : this.astFunction(t, i);
          }
          astFunctionExpression(t, i) {
            return this.isChildFunction(t) ? i : this.astFunction(t, i);
          }
          isChildFunction(t) {
            for (let i = 0; i < this.functions.length; i++)
              if (this.functions[i] === t)
                return true;
            return false;
          }
          astReturnStatement(t, i) {
            return i;
          }
          astLiteral(t, i) {
            return this.literalTypes[this.astKey(t)] = "Number", i;
          }
          astBinaryExpression(t, i) {
            return i;
          }
          astIdentifierExpression(t, i) {
            return i;
          }
          astAssignmentExpression(t, i) {
            return i;
          }
          astExpressionStatement(t, i) {
            return this.astGeneric(t.expression, i), i.push(";"), i;
          }
          astEmptyStatement(t, i) {
            return i;
          }
          astBlockStatement(t, i) {
            return i;
          }
          astIfStatement(t, i) {
            return i;
          }
          astSwitchStatement(t, i) {
            return i;
          }
          astBreakStatement(t, i) {
            return i.push("break;"), i;
          }
          astContinueStatement(t, i) {
            return i.push(`continue;
`), i;
          }
          astForStatement(t, i) {
            return i;
          }
          astWhileStatement(t, i) {
            return i;
          }
          astDoWhileStatement(t, i) {
            return i;
          }
          astVariableDeclarator(t, i) {
            return this.astGeneric(t.id, i), t.init !== null && (i.push("="), this.astGeneric(t.init, i)), i;
          }
          astThisExpression(t, i) {
            return i;
          }
          astSequenceExpression(t, i) {
            let { expressions: u } = t, x2 = [];
            for (let w = 0; w < u.length; w++) {
              let m = u[w], S = [];
              this.astGeneric(m, S), x2.push(S.join(""));
            }
            return x2.length > 1 ? i.push("(", x2.join(","), ")") : i.push(x2[0]), i;
          }
          astUnaryExpression(t, i) {
            return this.checkAndUpconvertBitwiseUnary(t, i) || (t.prefix ? (i.push(t.operator), this.astGeneric(t.argument, i)) : (this.astGeneric(t.argument, i), i.push(t.operator))), i;
          }
          checkAndUpconvertBitwiseUnary(t, i) {
          }
          astUpdateExpression(t, i) {
            return t.prefix ? (i.push(t.operator), this.astGeneric(t.argument, i)) : (this.astGeneric(t.argument, i), i.push(t.operator)), i;
          }
          astLogicalExpression(t, i) {
            return i.push("("), this.astGeneric(t.left, i), i.push(t.operator), this.astGeneric(t.right, i), i.push(")"), i;
          }
          astMemberExpression(t, i) {
            return i;
          }
          astCallExpression(t, i) {
            return i;
          }
          astArrayExpression(t, i) {
            return i;
          }
          getMemberExpressionDetails(t) {
            if (t.type !== "MemberExpression")
              throw this.astErrorOutput(`Expression ${t.type} not a MemberExpression`, t);
            let i = null, u = null, x2 = this.getVariableSignature(t);
            switch (x2) {
              case "value":
                return null;
              case "value.thread.value":
              case "this.thread.value":
              case "this.output.value":
                return { signature: x2, type: "Integer", name: t.property.name };
              case "value[]":
                if (typeof t.object.name != "string")
                  throw this.astErrorOutput("Unexpected expression", t);
                return i = t.object.name, { name: i, origin: "user", signature: x2, type: this.getVariableType(t.object), xProperty: t.property };
              case "value[][]":
                if (typeof t.object.object.name != "string")
                  throw this.astErrorOutput("Unexpected expression", t);
                return i = t.object.object.name, { name: i, origin: "user", signature: x2, type: this.getVariableType(t.object.object), yProperty: t.object.property, xProperty: t.property };
              case "value[][][]":
                if (typeof t.object.object.object.name != "string")
                  throw this.astErrorOutput("Unexpected expression", t);
                return i = t.object.object.object.name, { name: i, origin: "user", signature: x2, type: this.getVariableType(t.object.object.object), zProperty: t.object.object.property, yProperty: t.object.property, xProperty: t.property };
              case "value[][][][]":
                if (typeof t.object.object.object.object.name != "string")
                  throw this.astErrorOutput("Unexpected expression", t);
                return i = t.object.object.object.object.name, { name: i, origin: "user", signature: x2, type: this.getVariableType(t.object.object.object.object), zProperty: t.object.object.property, yProperty: t.object.property, xProperty: t.property };
              case "value.value":
                if (typeof t.property.name != "string")
                  throw this.astErrorOutput("Unexpected expression", t);
                if (this.isAstMathVariable(t))
                  return i = t.property.name, { name: i, origin: "Math", type: "Number", signature: x2 };
                switch (t.property.name) {
                  case "r":
                  case "g":
                  case "b":
                  case "a":
                    return i = t.object.name, { name: i, property: t.property.name, origin: "user", signature: x2, type: "Number" };
                  default:
                    throw this.astErrorOutput("Unexpected expression", t);
                }
              case "this.constants.value":
                if (typeof t.property.name != "string")
                  throw this.astErrorOutput("Unexpected expression", t);
                if (i = t.property.name, u = this.getConstantType(i), !u)
                  throw this.astErrorOutput("Constant has no type", t);
                return { name: i, type: u, origin: "constants", signature: x2 };
              case "this.constants.value[]":
                if (typeof t.object.property.name != "string")
                  throw this.astErrorOutput("Unexpected expression", t);
                if (i = t.object.property.name, u = this.getConstantType(i), !u)
                  throw this.astErrorOutput("Constant has no type", t);
                return { name: i, type: u, origin: "constants", signature: x2, xProperty: t.property };
              case "this.constants.value[][]": {
                if (typeof t.object.object.property.name != "string")
                  throw this.astErrorOutput("Unexpected expression", t);
                if (i = t.object.object.property.name, u = this.getConstantType(i), !u)
                  throw this.astErrorOutput("Constant has no type", t);
                return { name: i, type: u, origin: "constants", signature: x2, yProperty: t.object.property, xProperty: t.property };
              }
              case "this.constants.value[][][]": {
                if (typeof t.object.object.object.property.name != "string")
                  throw this.astErrorOutput("Unexpected expression", t);
                if (i = t.object.object.object.property.name, u = this.getConstantType(i), !u)
                  throw this.astErrorOutput("Constant has no type", t);
                return { name: i, type: u, origin: "constants", signature: x2, zProperty: t.object.object.property, yProperty: t.object.property, xProperty: t.property };
              }
              case "fn()[]":
              case "fn()[][]":
              case "[][]":
                return { signature: x2, property: t.property };
              default:
                throw this.astErrorOutput("Unexpected expression", t);
            }
          }
          findIdentifierOrigin(t) {
            let i = [this.ast];
            for (; i.length > 0; ) {
              let u = i[0];
              if (u.type === "VariableDeclarator" && u.id && u.id.name && u.id.name === t.name)
                return u;
              if (i.shift(), u.argument)
                i.push(u.argument);
              else if (u.body)
                i.push(u.body);
              else if (u.declarations)
                i.push(u.declarations);
              else if (Array.isArray(u))
                for (let x2 = 0; x2 < u.length; x2++)
                  i.push(u[x2]);
            }
            return null;
          }
          findLastReturn(t) {
            let i = [t || this.ast];
            for (; i.length > 0; ) {
              let u = i.pop();
              if (u.type === "ReturnStatement")
                return u;
              if (u.type !== "FunctionDeclaration")
                if (u.argument)
                  i.push(u.argument);
                else if (u.body)
                  i.push(u.body);
                else if (u.declarations)
                  i.push(u.declarations);
                else if (Array.isArray(u))
                  for (let x2 = 0; x2 < u.length; x2++)
                    i.push(u[x2]);
                else
                  u.consequent ? i.push(u.consequent) : u.cases && i.push(u.cases);
            }
            return null;
          }
          getInternalVariableName(t) {
            return this._internalVariableNames.hasOwnProperty(t) || (this._internalVariableNames[t] = 0), this._internalVariableNames[t]++, this._internalVariableNames[t] === 1 ? t : t + this._internalVariableNames[t];
          }
          astKey(t, i = ",") {
            if (!t.start || !t.end)
              throw new Error("AST start and end needed");
            return `${t.start}${i}${t.end}`;
          }
        }
        let n = { Number: "Number", Float: "Float", Integer: "Integer", Array: "Number", "Array(2)": "Number", "Array(3)": "Number", "Array(4)": "Number", "Matrix(2)": "Number", "Matrix(3)": "Number", "Matrix(4)": "Number", Array2D: "Number", Array3D: "Number", Input: "Number", HTMLCanvas: "Array(4)", HTMLImage: "Array(4)", HTMLVideo: "Array(4)", HTMLImageArray: "Array(4)", NumberTexture: "Number", MemoryOptimizedNumberTexture: "Number", "Array1D(2)": "Array(2)", "Array1D(3)": "Array(3)", "Array1D(4)": "Array(4)", "Array2D(2)": "Array(2)", "Array2D(3)": "Array(3)", "Array2D(4)": "Array(4)", "Array3D(2)": "Array(2)", "Array3D(3)": "Array(3)", "Array3D(4)": "Array(4)", "ArrayTexture(1)": "Number", "ArrayTexture(2)": "Array(2)", "ArrayTexture(3)": "Array(3)", "ArrayTexture(4)": "Array(4)" };
        y.exports = { FunctionNode: l };
      }, { "../utils": 114, "./function-tracer": 11, acorn: 1 }], 11: [function(o, y, E) {
        let { utils: p } = o("../utils");
        function g(n) {
          return n.length > 0 ? n[n.length - 1] : null;
        }
        let f = { trackIdentifiers: "trackIdentifiers", memberExpression: "memberExpression", inForLoopInit: "inForLoopInit" };
        class l {
          constructor(s) {
            this.runningContexts = [], this.functionContexts = [], this.contexts = [], this.functionCalls = [], this.declarations = [], this.identifiers = [], this.functions = [], this.returnStatements = [], this.trackedIdentifiers = null, this.states = [], this.newFunctionContext(), this.scan(s);
          }
          isState(s) {
            return this.states[this.states.length - 1] === s;
          }
          hasState(s) {
            return this.states.indexOf(s) > -1;
          }
          pushState(s) {
            this.states.push(s);
          }
          popState(s) {
            if (this.isState(s))
              this.states.pop();
            else
              throw new Error(`Cannot pop the non-active state "${s}"`);
          }
          get currentFunctionContext() {
            return g(this.functionContexts);
          }
          get currentContext() {
            return g(this.runningContexts);
          }
          newFunctionContext() {
            let s = { "@contextType": "function" };
            this.contexts.push(s), this.functionContexts.push(s);
          }
          newContext(s) {
            let t = Object.assign({ "@contextType": "const/let" }, this.currentContext);
            this.contexts.push(t), this.runningContexts.push(t), s();
            let { currentFunctionContext: i } = this;
            for (let u in i)
              !i.hasOwnProperty(u) || t.hasOwnProperty(u) || (t[u] = i[u]);
            return this.runningContexts.pop(), t;
          }
          useFunctionContext(s) {
            let t = g(this.functionContexts);
            this.runningContexts.push(t), s(), this.runningContexts.pop();
          }
          getIdentifiers(s) {
            let t = this.trackedIdentifiers = [];
            return this.pushState(f.trackIdentifiers), s(), this.trackedIdentifiers = null, this.popState(f.trackIdentifiers), t;
          }
          getDeclaration(s) {
            let { currentContext: t, currentFunctionContext: i, runningContexts: u } = this, x2 = t[s] || i[s] || null;
            if (!x2 && t === i && u.length > 0) {
              let w = u[u.length - 2];
              if (w[s])
                return w[s];
            }
            return x2;
          }
          scan(s) {
            if (!!s) {
              if (Array.isArray(s)) {
                for (let t = 0; t < s.length; t++)
                  this.scan(s[t]);
                return;
              }
              switch (s.type) {
                case "Program":
                  this.useFunctionContext(() => {
                    this.scan(s.body);
                  });
                  break;
                case "BlockStatement":
                  this.newContext(() => {
                    this.scan(s.body);
                  });
                  break;
                case "AssignmentExpression":
                case "LogicalExpression":
                  this.scan(s.left), this.scan(s.right);
                  break;
                case "BinaryExpression":
                  this.scan(s.left), this.scan(s.right);
                  break;
                case "UpdateExpression":
                  if (s.operator === "++") {
                    let t = this.getDeclaration(s.argument.name);
                    t && (t.suggestedType = "Integer");
                  }
                  this.scan(s.argument);
                  break;
                case "UnaryExpression":
                  this.scan(s.argument);
                  break;
                case "VariableDeclaration":
                  s.kind === "var" ? this.useFunctionContext(() => {
                    s.declarations = p.normalizeDeclarations(s), this.scan(s.declarations);
                  }) : (s.declarations = p.normalizeDeclarations(s), this.scan(s.declarations));
                  break;
                case "VariableDeclarator": {
                  let { currentContext: t } = this, i = this.hasState(f.inForLoopInit), u = { ast: s, context: t, name: s.id.name, origin: "declaration", inForLoopInit: i, inForLoopTest: null, assignable: t === this.currentFunctionContext || !i && !t.hasOwnProperty(s.id.name), suggestedType: null, valueType: null, dependencies: null, isSafe: null };
                  t[s.id.name] || (t[s.id.name] = u), this.declarations.push(u), this.scan(s.id), this.scan(s.init);
                  break;
                }
                case "FunctionExpression":
                case "FunctionDeclaration":
                  this.runningContexts.length === 0 ? this.scan(s.body) : this.functions.push(s);
                  break;
                case "IfStatement":
                  this.scan(s.test), this.scan(s.consequent), s.alternate && this.scan(s.alternate);
                  break;
                case "ForStatement": {
                  let t, i = this.newContext(() => {
                    this.pushState(f.inForLoopInit), this.scan(s.init), this.popState(f.inForLoopInit), t = this.getIdentifiers(() => {
                      this.scan(s.test);
                    }), this.scan(s.update), this.newContext(() => {
                      this.scan(s.body);
                    });
                  });
                  if (t)
                    for (let u in i)
                      u !== "@contextType" && t.indexOf(u) > -1 && (i[u].inForLoopTest = true);
                  break;
                }
                case "DoWhileStatement":
                case "WhileStatement":
                  this.newContext(() => {
                    this.scan(s.body), this.scan(s.test);
                  });
                  break;
                case "Identifier": {
                  this.isState(f.trackIdentifiers) && this.trackedIdentifiers.push(s.name), this.identifiers.push({ context: this.currentContext, declaration: this.getDeclaration(s.name), ast: s });
                  break;
                }
                case "ReturnStatement":
                  this.returnStatements.push(s), this.scan(s.argument);
                  break;
                case "MemberExpression":
                  this.pushState(f.memberExpression), this.scan(s.object), this.scan(s.property), this.popState(f.memberExpression);
                  break;
                case "ExpressionStatement":
                  this.scan(s.expression);
                  break;
                case "SequenceExpression":
                  this.scan(s.expressions);
                  break;
                case "CallExpression":
                  this.functionCalls.push({ context: this.currentContext, ast: s }), this.scan(s.arguments);
                  break;
                case "ArrayExpression":
                  this.scan(s.elements);
                  break;
                case "ConditionalExpression":
                  this.scan(s.test), this.scan(s.alternate), this.scan(s.consequent);
                  break;
                case "SwitchStatement":
                  this.scan(s.discriminant), this.scan(s.cases);
                  break;
                case "SwitchCase":
                  this.scan(s.test), this.scan(s.consequent);
                  break;
                case "ThisExpression":
                case "Literal":
                case "DebuggerStatement":
                case "EmptyStatement":
                case "BreakStatement":
                case "ContinueStatement":
                  break;
                default:
                  throw new Error(`unhandled type "${s.type}"`);
              }
            }
          }
        }
        y.exports = { FunctionTracer: l };
      }, { "../utils": 114 }], 12: [function(o, y, E) {
        let { glWiretap: p } = o("gl-wiretap"), { utils: g } = o("../../utils");
        function f(u) {
          return u.toString().replace("=>", "").replace(/^function /, "").replace(/utils[.]/g, "/*utils.*/");
        }
        function l(u, x2, w, m, S) {
          w.built || w.build.apply(w, x2), x2 = x2 ? Array.from(x2).map((Q) => {
            switch (typeof Q) {
              case "boolean":
                return new Boolean(Q);
              case "number":
                return new Number(Q);
              default:
                return Q;
            }
          }) : null;
          let v = [], h = [], b = p(w.context, { useTrackablePrimitives: true, onReadPixels: (Q) => {
            if (Z.subKernels) {
              if (!T)
                h.push(`    const result = { result: ${n(Q, Z)} };`), T = true;
              else {
                let ue = Z.subKernels[C++].property;
                h.push(`    result${isNaN(ue) ? "." + ue : `[${ue}]`} = ${n(Q, Z)};`);
              }
              C === Z.subKernels.length && h.push("    return result;");
              return;
            }
            Q ? h.push(`    return ${n(Q, Z)};`) : h.push("    return null;");
          }, onUnrecognizedArgumentLookup: (Q) => {
            let ue = i(Q, Z.kernelArguments, [], b, v);
            if (ue)
              return ue;
            let he = i(Q, Z.kernelConstants, F ? Object.keys(F).map((pe) => F[pe]) : [], b, v);
            return he || null;
          } }), T = false, C = 0, { source: V, canvas: c, output: a, pipeline: k, graphical: A, loopMaxIterations: N, constants: F, optimizeFloatMemory: R, precision: K, fixIntegerDivisionAccuracy: O, functions: X, nativeFunctions: B, subKernels: P, immutable: Y, argumentTypes: J, constantTypes: q, kernelArguments: j, kernelConstants: U, tactic: oe } = w, Z = new u(V, { canvas: c, context: b, checkContext: false, output: a, pipeline: k, graphical: A, loopMaxIterations: N, constants: F, optimizeFloatMemory: R, precision: K, fixIntegerDivisionAccuracy: O, functions: X, nativeFunctions: B, subKernels: P, immutable: Y, argumentTypes: J, constantTypes: q, tactic: oe }), ee = [];
          if (b.setIndent(2), Z.build.apply(Z, x2), ee.push(b.toString()), b.reset(), Z.kernelArguments.forEach((Q, ue) => {
            switch (Q.type) {
              case "Integer":
              case "Boolean":
              case "Number":
              case "Float":
              case "Array":
              case "Array(2)":
              case "Array(3)":
              case "Array(4)":
              case "HTMLCanvas":
              case "HTMLImage":
              case "HTMLVideo":
                b.insertVariable(`uploadValue_${Q.name}`, Q.uploadValue);
                break;
              case "HTMLImageArray":
                for (let he = 0; he < x2[ue].length; he++) {
                  let pe = x2[ue];
                  b.insertVariable(`uploadValue_${Q.name}[${he}]`, pe[he]);
                }
                break;
              case "Input":
                b.insertVariable(`uploadValue_${Q.name}`, Q.uploadValue);
                break;
              case "MemoryOptimizedNumberTexture":
              case "NumberTexture":
              case "Array1D(2)":
              case "Array1D(3)":
              case "Array1D(4)":
              case "Array2D(2)":
              case "Array2D(3)":
              case "Array2D(4)":
              case "Array3D(2)":
              case "Array3D(3)":
              case "Array3D(4)":
              case "ArrayTexture(1)":
              case "ArrayTexture(2)":
              case "ArrayTexture(3)":
              case "ArrayTexture(4)":
                b.insertVariable(`uploadValue_${Q.name}`, x2[ue].texture);
                break;
              default:
                throw new Error(`unhandled kernelArgumentType insertion for glWiretap of type ${Q.type}`);
            }
          }), ee.push("/** start of injected functions **/"), ee.push(`function ${f(g.flattenTo)}`), ee.push(`function ${f(g.flatten2dArrayTo)}`), ee.push(`function ${f(g.flatten3dArrayTo)}`), ee.push(`function ${f(g.flatten4dArrayTo)}`), ee.push(`function ${f(g.isArray)}`), Z.renderOutput !== Z.renderTexture && Z.formatValues && ee.push(`  const renderOutput = function ${f(Z.formatValues)};`), ee.push("/** end of injected functions **/"), ee.push(`  const innerKernel = function (${Z.kernelArguments.map((Q) => Q.varName).join(", ")}) {`), b.setIndent(4), Z.run.apply(Z, x2), Z.renderKernels ? Z.renderKernels() : Z.renderOutput && Z.renderOutput(), ee.push("    /** start setup uploads for kernel values **/"), Z.kernelArguments.forEach((Q) => {
            ee.push("    " + Q.getStringValueHandler().split(`
`).join(`
    `));
          }), ee.push("    /** end setup uploads for kernel values **/"), ee.push(b.toString()), Z.renderOutput === Z.renderTexture) {
            b.reset();
            let Q = b.getContextVariableName(Z.framebuffer);
            if (Z.renderKernels) {
              let ue = Z.renderKernels(), he = b.getContextVariableName(Z.texture.texture);
              ee.push(`    return {
            result: {
              texture: ${he},
              type: '${ue.result.type}',
              toArray: ${t(ue.result, he, Q)}
            },`);
              let { subKernels: pe, mappedTextures: te } = Z;
              for (let re = 0; re < pe.length; re++) {
                let de = te[re], Te = pe[re], Se = ue[Te.property], Ce = b.getContextVariableName(de.texture);
                ee.push(`
            ${Te.property}: {
              texture: ${Ce},
              type: '${Se.type}',
              toArray: ${t(Se, Ce, Q)}
            },`);
              }
              ee.push("    };");
            } else {
              let ue = Z.renderOutput(), he = b.getContextVariableName(Z.texture.texture);
              ee.push(`    return {
              texture: ${he},
              type: '${ue.type}',
              toArray: ${t(ue, he, Q)}
            };`);
            }
          }
          ee.push(`    ${S ? `
` + S + "    " : ""}`), ee.push(h.join(`
`)), ee.push("  };"), Z.graphical && (ee.push(s(Z)), ee.push("  innerKernel.getPixels = getPixels;")), ee.push("  return innerKernel;");
          let be = [];
          return U.forEach((Q) => {
            be.push(`${Q.getStringValueHandler()}`);
          }), `function kernel(settings) {
        const { context, constants } = settings;
        ${be.join("")}
        ${m || ""}
      ${ee.join(`
`)}
      }`;
        }
        function n(u, x2) {
          let w = x2.precision === "single" ? u : `new Float32Array(${u}.buffer)`;
          return x2.output[2] ? `renderOutput(${w}, ${x2.output[0]}, ${x2.output[1]}, ${x2.output[2]})` : x2.output[1] ? `renderOutput(${w}, ${x2.output[0]}, ${x2.output[1]})` : `renderOutput(${w}, ${x2.output[0]})`;
        }
        function s(u) {
          let x2 = u.getPixels.toString(), w = !/^function/.test(x2);
          return g.flattenFunctionToString(`${w ? "function " : ""}${x2}`, { findDependency: (m, S) => m === "utils" ? `const ${S} = ${g[S].toString()};` : null, thisLookup: (m) => {
            if (m === "context")
              return null;
            if (u.hasOwnProperty(m))
              return JSON.stringify(u[m]);
            throw new Error(`unhandled thisLookup ${m}`);
          } });
        }
        function t(u, x2, w) {
          let m = u.toArray.toString(), S = !/^function/.test(m), v = g.flattenFunctionToString(`${S ? "function " : ""}${m}`, { findDependency: (h, b) => {
            if (h === "utils")
              return `const ${b} = ${g[b].toString()};`;
            if (h === "this")
              return b === "framebuffer" ? "" : `${S ? "function " : ""}${u[b].toString()}`;
            throw new Error("unhandled fromObject");
          }, thisLookup: (h, b) => {
            if (h === "texture")
              return x2;
            if (h === "context")
              return b ? null : "gl";
            if (u.hasOwnProperty(h))
              return JSON.stringify(u[h]);
            throw new Error(`unhandled thisLookup ${h}`);
          } });
          return `() => {
        function framebuffer() { return ${w}; };
        ${v}
        return toArray();
        }`;
        }
        function i(u, x2, w, m, S) {
          if (u === null || x2 === null)
            return null;
          switch (typeof u) {
            case "boolean":
            case "number":
              return null;
          }
          if (typeof HTMLImageElement < "u" && u instanceof HTMLImageElement)
            for (let v = 0; v < x2.length; v++) {
              let h = x2[v];
              if (h.type !== "HTMLImageArray" && h || h.uploadValue !== u)
                continue;
              let b = w[v].indexOf(u);
              if (b === -1)
                continue;
              let T = `uploadValue_${h.name}[${b}]`;
              return m.insertVariable(T, u), T;
            }
          for (let v = 0; v < x2.length; v++) {
            let h = x2[v];
            if (u !== h.uploadValue)
              continue;
            let b = `uploadValue_${h.name}`;
            return m.insertVariable(b, h), b;
          }
          return null;
        }
        y.exports = { glKernelString: l };
      }, { "../../utils": 114, "gl-wiretap": 3 }], 13: [function(o, y, E) {
        let { Kernel: p } = o("../kernel"), { utils: g } = o("../../utils"), { GLTextureArray2Float: f } = o("./texture/array-2-float"), { GLTextureArray2Float2D: l } = o("./texture/array-2-float-2d"), { GLTextureArray2Float3D: n } = o("./texture/array-2-float-3d"), { GLTextureArray3Float: s } = o("./texture/array-3-float"), { GLTextureArray3Float2D: t } = o("./texture/array-3-float-2d"), { GLTextureArray3Float3D: i } = o("./texture/array-3-float-3d"), { GLTextureArray4Float: u } = o("./texture/array-4-float"), { GLTextureArray4Float2D: x2 } = o("./texture/array-4-float-2d"), { GLTextureArray4Float3D: w } = o("./texture/array-4-float-3d"), { GLTextureFloat: m } = o("./texture/float"), { GLTextureFloat2D: S } = o("./texture/float-2d"), { GLTextureFloat3D: v } = o("./texture/float-3d"), { GLTextureMemoryOptimized: h } = o("./texture/memory-optimized"), { GLTextureMemoryOptimized2D: b } = o("./texture/memory-optimized-2d"), { GLTextureMemoryOptimized3D: T } = o("./texture/memory-optimized-3d"), { GLTextureUnsigned: C } = o("./texture/unsigned"), { GLTextureUnsigned2D: V } = o("./texture/unsigned-2d"), { GLTextureUnsigned3D: c } = o("./texture/unsigned-3d"), { GLTextureGraphical: a } = o("./texture/graphical");
        class k extends p {
          static get mode() {
            return "gpu";
          }
          static getIsFloatRead() {
            let F = `function kernelFunction() {
            return 1;
          }`, R = new this(F, { context: this.testContext, canvas: this.testCanvas, validate: false, output: [1], precision: "single", returnType: "Number", tactic: "speed" });
            R.build(), R.run();
            let K = R.renderOutput();
            return R.destroy(true), K[0] === 1;
          }
          static getIsIntegerDivisionAccurate() {
            function F(X, B) {
              return X[this.thread.x] / B[this.thread.x];
            }
            let R = new this(F.toString(), { context: this.testContext, canvas: this.testCanvas, validate: false, output: [2], returnType: "Number", precision: "unsigned", tactic: "speed" }), K = [[6, 6030401], [3, 3991]];
            R.build.apply(R, K), R.run.apply(R, K);
            let O = R.renderOutput();
            return R.destroy(true), O[0] === 2 && O[1] === 1511;
          }
          static getIsSpeedTacticSupported() {
            function F(X) {
              return X[this.thread.x];
            }
            let R = new this(F.toString(), { context: this.testContext, canvas: this.testCanvas, validate: false, output: [4], returnType: "Number", precision: "unsigned", tactic: "speed" }), K = [[0, 1, 2, 3]];
            R.build.apply(R, K), R.run.apply(R, K);
            let O = R.renderOutput();
            return R.destroy(true), Math.round(O[0]) === 0 && Math.round(O[1]) === 1 && Math.round(O[2]) === 2 && Math.round(O[3]) === 3;
          }
          static get testCanvas() {
            throw new Error(`"testCanvas" not defined on ${this.name}`);
          }
          static get testContext() {
            throw new Error(`"testContext" not defined on ${this.name}`);
          }
          static getFeatures() {
            let F = this.testContext, R = this.getIsDrawBuffers();
            return Object.freeze({ isFloatRead: this.getIsFloatRead(), isIntegerDivisionAccurate: this.getIsIntegerDivisionAccurate(), isSpeedTacticSupported: this.getIsSpeedTacticSupported(), isTextureFloat: this.getIsTextureFloat(), isDrawBuffers: R, kernelMap: R, channelCount: this.getChannelCount(), maxTextureSize: this.getMaxTextureSize(), lowIntPrecision: F.getShaderPrecisionFormat(F.FRAGMENT_SHADER, F.LOW_INT), lowFloatPrecision: F.getShaderPrecisionFormat(F.FRAGMENT_SHADER, F.LOW_FLOAT), mediumIntPrecision: F.getShaderPrecisionFormat(F.FRAGMENT_SHADER, F.MEDIUM_INT), mediumFloatPrecision: F.getShaderPrecisionFormat(F.FRAGMENT_SHADER, F.MEDIUM_FLOAT), highIntPrecision: F.getShaderPrecisionFormat(F.FRAGMENT_SHADER, F.HIGH_INT), highFloatPrecision: F.getShaderPrecisionFormat(F.FRAGMENT_SHADER, F.HIGH_FLOAT) });
          }
          static setupFeatureChecks() {
            throw new Error(`"setupFeatureChecks" not defined on ${this.name}`);
          }
          static getSignature(F, R) {
            return F.getVariablePrecisionString() + (R.length > 0 ? ":" + R.join(",") : "");
          }
          setFixIntegerDivisionAccuracy(F) {
            return this.fixIntegerDivisionAccuracy = F, this;
          }
          setPrecision(F) {
            return this.precision = F, this;
          }
          setFloatTextures(F) {
            return g.warnDeprecated("method", "setFloatTextures", "setOptimizeFloatMemory"), this.floatTextures = F, this;
          }
          static nativeFunctionArguments(F) {
            let R = [], K = [], O = [], X = /^[a-zA-Z_]/, B = /[a-zA-Z_0-9]/, P = 0, Y = null, J = null;
            for (; P < F.length; ) {
              let q = F[P], j = F[P + 1], U = O.length > 0 ? O[O.length - 1] : null;
              if (U === "FUNCTION_ARGUMENTS" && q === "/" && j === "*") {
                O.push("MULTI_LINE_COMMENT"), P += 2;
                continue;
              } else if (U === "MULTI_LINE_COMMENT" && q === "*" && j === "/") {
                O.pop(), P += 2;
                continue;
              } else if (U === "FUNCTION_ARGUMENTS" && q === "/" && j === "/") {
                O.push("COMMENT"), P += 2;
                continue;
              } else if (U === "COMMENT" && q === `
`) {
                O.pop(), P++;
                continue;
              } else if (U === null && q === "(") {
                O.push("FUNCTION_ARGUMENTS"), P++;
                continue;
              } else if (U === "FUNCTION_ARGUMENTS") {
                if (q === ")") {
                  O.pop();
                  break;
                }
                if (q === "f" && j === "l" && F[P + 2] === "o" && F[P + 3] === "a" && F[P + 4] === "t" && F[P + 5] === " ") {
                  O.push("DECLARE_VARIABLE"), J = "float", Y = "", P += 6;
                  continue;
                } else if (q === "i" && j === "n" && F[P + 2] === "t" && F[P + 3] === " ") {
                  O.push("DECLARE_VARIABLE"), J = "int", Y = "", P += 4;
                  continue;
                } else if (q === "v" && j === "e" && F[P + 2] === "c" && F[P + 3] === "2" && F[P + 4] === " ") {
                  O.push("DECLARE_VARIABLE"), J = "vec2", Y = "", P += 5;
                  continue;
                } else if (q === "v" && j === "e" && F[P + 2] === "c" && F[P + 3] === "3" && F[P + 4] === " ") {
                  O.push("DECLARE_VARIABLE"), J = "vec3", Y = "", P += 5;
                  continue;
                } else if (q === "v" && j === "e" && F[P + 2] === "c" && F[P + 3] === "4" && F[P + 4] === " ") {
                  O.push("DECLARE_VARIABLE"), J = "vec4", Y = "", P += 5;
                  continue;
                }
              } else if (U === "DECLARE_VARIABLE") {
                if (Y === "") {
                  if (q === " ") {
                    P++;
                    continue;
                  }
                  if (!X.test(q))
                    throw new Error("variable name is not expected string");
                }
                Y += q, B.test(j) || (O.pop(), K.push(Y), R.push(A[J]));
              }
              P++;
            }
            if (O.length > 0)
              throw new Error("GLSL function was not parsable");
            return { argumentNames: K, argumentTypes: R };
          }
          static nativeFunctionReturnType(F) {
            return A[F.match(/int|float|vec[2-4]/)[0]];
          }
          static combineKernels(F, R) {
            F.apply(null, arguments);
            let { texSize: K, context: O, threadDim: X } = R.texSize, B;
            if (R.precision === "single") {
              let P = K[0], Y = Math.ceil(K[1] / 4);
              B = new Float32Array(P * Y * 4 * 4), O.readPixels(0, 0, P, Y * 4, O.RGBA, O.FLOAT, B);
            } else {
              let P = new Uint8Array(K[0] * K[1] * 4);
              O.readPixels(0, 0, K[0], K[1], O.RGBA, O.UNSIGNED_BYTE, P), B = new Float32Array(P.buffer);
            }
            if (B = B.subarray(0, X[0] * X[1] * X[2]), R.output.length === 1)
              return B;
            if (R.output.length === 2)
              return g.splitArray(B, R.output[0]);
            if (R.output.length === 3)
              return g.splitArray(B, R.output[0] * R.output[1]).map(function(Y) {
                return g.splitArray(Y, R.output[0]);
              });
          }
          constructor(F, R) {
            super(F, R), this.transferValues = null, this.formatValues = null, this.TextureConstructor = null, this.renderOutput = null, this.renderRawOutput = null, this.texSize = null, this.translatedSource = null, this.compiledFragmentShader = null, this.compiledVertexShader = null, this.switchingKernels = null, this._textureSwitched = null, this._mappedTextureSwitched = null;
          }
          checkTextureSize() {
            let { features: F } = this.constructor;
            if (this.texSize[0] > F.maxTextureSize || this.texSize[1] > F.maxTextureSize)
              throw new Error(`Texture size [${this.texSize[0]},${this.texSize[1]}] generated by kernel is larger than supported size [${F.maxTextureSize},${F.maxTextureSize}]`);
          }
          translateSource() {
            throw new Error(`"translateSource" not defined on ${this.constructor.name}`);
          }
          pickRenderStrategy(F) {
            if (this.graphical)
              return this.renderRawOutput = this.readPackedPixelsToUint8Array, this.transferValues = (R) => R, this.TextureConstructor = a, null;
            if (this.precision === "unsigned")
              if (this.renderRawOutput = this.readPackedPixelsToUint8Array, this.transferValues = this.readPackedPixelsToFloat32Array, this.pipeline)
                switch (this.renderOutput = this.renderTexture, this.subKernels !== null && (this.renderKernels = this.renderKernelsToTextures), this.returnType) {
                  case "LiteralInteger":
                  case "Float":
                  case "Number":
                  case "Integer":
                    return this.output[2] > 0 ? (this.TextureConstructor = c, null) : this.output[1] > 0 ? (this.TextureConstructor = V, null) : (this.TextureConstructor = C, null);
                  case "Array(2)":
                  case "Array(3)":
                  case "Array(4)":
                    return this.requestFallback(F);
                }
              else
                switch (this.subKernels !== null && (this.renderKernels = this.renderKernelsToArrays), this.returnType) {
                  case "LiteralInteger":
                  case "Float":
                  case "Number":
                  case "Integer":
                    return this.renderOutput = this.renderValues, this.output[2] > 0 ? (this.TextureConstructor = c, this.formatValues = g.erect3DPackedFloat, null) : this.output[1] > 0 ? (this.TextureConstructor = V, this.formatValues = g.erect2DPackedFloat, null) : (this.TextureConstructor = C, this.formatValues = g.erectPackedFloat, null);
                  case "Array(2)":
                  case "Array(3)":
                  case "Array(4)":
                    return this.requestFallback(F);
                }
            else if (this.precision === "single") {
              if (this.renderRawOutput = this.readFloatPixelsToFloat32Array, this.transferValues = this.readFloatPixelsToFloat32Array, this.pipeline)
                switch (this.renderOutput = this.renderTexture, this.subKernels !== null && (this.renderKernels = this.renderKernelsToTextures), this.returnType) {
                  case "LiteralInteger":
                  case "Float":
                  case "Number":
                  case "Integer":
                    return this.optimizeFloatMemory ? this.output[2] > 0 ? (this.TextureConstructor = T, null) : this.output[1] > 0 ? (this.TextureConstructor = b, null) : (this.TextureConstructor = h, null) : this.output[2] > 0 ? (this.TextureConstructor = v, null) : this.output[1] > 0 ? (this.TextureConstructor = S, null) : (this.TextureConstructor = m, null);
                  case "Array(2)":
                    return this.output[2] > 0 ? (this.TextureConstructor = n, null) : this.output[1] > 0 ? (this.TextureConstructor = l, null) : (this.TextureConstructor = f, null);
                  case "Array(3)":
                    return this.output[2] > 0 ? (this.TextureConstructor = i, null) : this.output[1] > 0 ? (this.TextureConstructor = t, null) : (this.TextureConstructor = s, null);
                  case "Array(4)":
                    return this.output[2] > 0 ? (this.TextureConstructor = w, null) : this.output[1] > 0 ? (this.TextureConstructor = x2, null) : (this.TextureConstructor = u, null);
                }
              if (this.renderOutput = this.renderValues, this.subKernels !== null && (this.renderKernels = this.renderKernelsToArrays), this.optimizeFloatMemory)
                switch (this.returnType) {
                  case "LiteralInteger":
                  case "Float":
                  case "Number":
                  case "Integer":
                    return this.output[2] > 0 ? (this.TextureConstructor = T, this.formatValues = g.erectMemoryOptimized3DFloat, null) : this.output[1] > 0 ? (this.TextureConstructor = b, this.formatValues = g.erectMemoryOptimized2DFloat, null) : (this.TextureConstructor = h, this.formatValues = g.erectMemoryOptimizedFloat, null);
                  case "Array(2)":
                    return this.output[2] > 0 ? (this.TextureConstructor = n, this.formatValues = g.erect3DArray2, null) : this.output[1] > 0 ? (this.TextureConstructor = l, this.formatValues = g.erect2DArray2, null) : (this.TextureConstructor = f, this.formatValues = g.erectArray2, null);
                  case "Array(3)":
                    return this.output[2] > 0 ? (this.TextureConstructor = i, this.formatValues = g.erect3DArray3, null) : this.output[1] > 0 ? (this.TextureConstructor = t, this.formatValues = g.erect2DArray3, null) : (this.TextureConstructor = s, this.formatValues = g.erectArray3, null);
                  case "Array(4)":
                    return this.output[2] > 0 ? (this.TextureConstructor = w, this.formatValues = g.erect3DArray4, null) : this.output[1] > 0 ? (this.TextureConstructor = x2, this.formatValues = g.erect2DArray4, null) : (this.TextureConstructor = u, this.formatValues = g.erectArray4, null);
                }
              else
                switch (this.returnType) {
                  case "LiteralInteger":
                  case "Float":
                  case "Number":
                  case "Integer":
                    return this.output[2] > 0 ? (this.TextureConstructor = v, this.formatValues = g.erect3DFloat, null) : this.output[1] > 0 ? (this.TextureConstructor = S, this.formatValues = g.erect2DFloat, null) : (this.TextureConstructor = m, this.formatValues = g.erectFloat, null);
                  case "Array(2)":
                    return this.output[2] > 0 ? (this.TextureConstructor = n, this.formatValues = g.erect3DArray2, null) : this.output[1] > 0 ? (this.TextureConstructor = l, this.formatValues = g.erect2DArray2, null) : (this.TextureConstructor = f, this.formatValues = g.erectArray2, null);
                  case "Array(3)":
                    return this.output[2] > 0 ? (this.TextureConstructor = i, this.formatValues = g.erect3DArray3, null) : this.output[1] > 0 ? (this.TextureConstructor = t, this.formatValues = g.erect2DArray3, null) : (this.TextureConstructor = s, this.formatValues = g.erectArray3, null);
                  case "Array(4)":
                    return this.output[2] > 0 ? (this.TextureConstructor = w, this.formatValues = g.erect3DArray4, null) : this.output[1] > 0 ? (this.TextureConstructor = x2, this.formatValues = g.erect2DArray4, null) : (this.TextureConstructor = u, this.formatValues = g.erectArray4, null);
                }
            } else
              throw new Error(`unhandled precision of "${this.precision}"`);
            throw new Error(`unhandled return type "${this.returnType}"`);
          }
          getKernelString() {
            throw new Error("abstract method call");
          }
          getMainResultTexture() {
            switch (this.returnType) {
              case "LiteralInteger":
              case "Float":
              case "Integer":
              case "Number":
                return this.getMainResultNumberTexture();
              case "Array(2)":
                return this.getMainResultArray2Texture();
              case "Array(3)":
                return this.getMainResultArray3Texture();
              case "Array(4)":
                return this.getMainResultArray4Texture();
              default:
                throw new Error(`unhandled returnType type ${this.returnType}`);
            }
          }
          getMainResultKernelNumberTexture() {
            throw new Error("abstract method call");
          }
          getMainResultSubKernelNumberTexture() {
            throw new Error("abstract method call");
          }
          getMainResultKernelArray2Texture() {
            throw new Error("abstract method call");
          }
          getMainResultSubKernelArray2Texture() {
            throw new Error("abstract method call");
          }
          getMainResultKernelArray3Texture() {
            throw new Error("abstract method call");
          }
          getMainResultSubKernelArray3Texture() {
            throw new Error("abstract method call");
          }
          getMainResultKernelArray4Texture() {
            throw new Error("abstract method call");
          }
          getMainResultSubKernelArray4Texture() {
            throw new Error("abstract method call");
          }
          getMainResultGraphical() {
            throw new Error("abstract method call");
          }
          getMainResultMemoryOptimizedFloats() {
            throw new Error("abstract method call");
          }
          getMainResultPackedPixels() {
            throw new Error("abstract method call");
          }
          getMainResultString() {
            return this.graphical ? this.getMainResultGraphical() : this.precision === "single" ? this.optimizeFloatMemory ? this.getMainResultMemoryOptimizedFloats() : this.getMainResultTexture() : this.getMainResultPackedPixels();
          }
          getMainResultNumberTexture() {
            return g.linesToString(this.getMainResultKernelNumberTexture()) + g.linesToString(this.getMainResultSubKernelNumberTexture());
          }
          getMainResultArray2Texture() {
            return g.linesToString(this.getMainResultKernelArray2Texture()) + g.linesToString(this.getMainResultSubKernelArray2Texture());
          }
          getMainResultArray3Texture() {
            return g.linesToString(this.getMainResultKernelArray3Texture()) + g.linesToString(this.getMainResultSubKernelArray3Texture());
          }
          getMainResultArray4Texture() {
            return g.linesToString(this.getMainResultKernelArray4Texture()) + g.linesToString(this.getMainResultSubKernelArray4Texture());
          }
          getFloatTacticDeclaration() {
            return `precision ${this.getVariablePrecisionString(this.texSize, this.tactic)} float;
`;
          }
          getIntTacticDeclaration() {
            return `precision ${this.getVariablePrecisionString(this.texSize, this.tactic, true)} int;
`;
          }
          getSampler2DTacticDeclaration() {
            return `precision ${this.getVariablePrecisionString(this.texSize, this.tactic)} sampler2D;
`;
          }
          getSampler2DArrayTacticDeclaration() {
            return `precision ${this.getVariablePrecisionString(this.texSize, this.tactic)} sampler2DArray;
`;
          }
          renderTexture() {
            return this.immutable ? this.texture.clone() : this.texture;
          }
          readPackedPixelsToUint8Array() {
            if (this.precision !== "unsigned")
              throw new Error('Requires this.precision to be "unsigned"');
            let { texSize: F, context: R } = this, K = new Uint8Array(F[0] * F[1] * 4);
            return R.readPixels(0, 0, F[0], F[1], R.RGBA, R.UNSIGNED_BYTE, K), K;
          }
          readPackedPixelsToFloat32Array() {
            return new Float32Array(this.readPackedPixelsToUint8Array().buffer);
          }
          readFloatPixelsToFloat32Array() {
            if (this.precision !== "single")
              throw new Error('Requires this.precision to be "single"');
            let { texSize: F, context: R } = this, K = F[0], O = F[1], X = new Float32Array(K * O * 4);
            return R.readPixels(0, 0, K, O, R.RGBA, R.FLOAT, X), X;
          }
          getPixels(F) {
            let { context: R, output: K } = this, [O, X] = K, B = new Uint8Array(O * X * 4);
            return R.readPixels(0, 0, O, X, R.RGBA, R.UNSIGNED_BYTE, B), new Uint8ClampedArray((F ? B : g.flipPixels(B, O, X)).buffer);
          }
          renderKernelsToArrays() {
            let F = { result: this.renderOutput() };
            for (let R = 0; R < this.subKernels.length; R++)
              F[this.subKernels[R].property] = this.mappedTextures[R].toArray();
            return F;
          }
          renderKernelsToTextures() {
            let F = { result: this.renderOutput() };
            if (this.immutable)
              for (let R = 0; R < this.subKernels.length; R++)
                F[this.subKernels[R].property] = this.mappedTextures[R].clone();
            else
              for (let R = 0; R < this.subKernels.length; R++)
                F[this.subKernels[R].property] = this.mappedTextures[R];
            return F;
          }
          resetSwitchingKernels() {
            let F = this.switchingKernels;
            return this.switchingKernels = null, F;
          }
          setOutput(F) {
            let R = this.toKernelOutput(F);
            if (this.program) {
              if (!this.dynamicOutput)
                throw new Error("Resizing a kernel with dynamicOutput: false is not possible");
              let K = [R[0], R[1] || 1, R[2] || 1], O = g.getKernelTextureSize({ optimizeFloatMemory: this.optimizeFloatMemory, precision: this.precision }, K), X = this.texSize;
              if (X) {
                let P = this.getVariablePrecisionString(X, this.tactic), Y = this.getVariablePrecisionString(O, this.tactic);
                if (P !== Y) {
                  this.debug && console.warn("Precision requirement changed, asking GPU instance to recompile"), this.switchKernels({ type: "outputPrecisionMismatch", precision: Y, needed: F });
                  return;
                }
              }
              this.output = R, this.threadDim = K, this.texSize = O;
              let { context: B } = this;
              if (B.bindFramebuffer(B.FRAMEBUFFER, this.framebuffer), this.updateMaxTexSize(), this.framebuffer.width = this.texSize[0], this.framebuffer.height = this.texSize[1], B.viewport(0, 0, this.maxTexSize[0], this.maxTexSize[1]), this.canvas.width = this.maxTexSize[0], this.canvas.height = this.maxTexSize[1], this.texture && this.texture.delete(), this.texture = null, this._setupOutputTexture(), this.mappedTextures && this.mappedTextures.length > 0) {
                for (let P = 0; P < this.mappedTextures.length; P++)
                  this.mappedTextures[P].delete();
                this.mappedTextures = null, this._setupSubOutputTextures();
              }
            } else
              this.output = R;
            return this;
          }
          renderValues() {
            return this.formatValues(this.transferValues(), this.output[0], this.output[1], this.output[2]);
          }
          switchKernels(F) {
            this.switchingKernels ? this.switchingKernels.push(F) : this.switchingKernels = [F];
          }
          getVariablePrecisionString(F = this.texSize, R = this.tactic, K = false) {
            if (!R) {
              if (!this.constructor.features.isSpeedTacticSupported)
                return "highp";
              let O = this.constructor.features[K ? "lowIntPrecision" : "lowFloatPrecision"], X = this.constructor.features[K ? "mediumIntPrecision" : "mediumFloatPrecision"], B = this.constructor.features[K ? "highIntPrecision" : "highFloatPrecision"], P = Math.log2(F[0] * F[1]);
              if (P <= O.rangeMax)
                return "lowp";
              if (P <= X.rangeMax)
                return "mediump";
              if (P <= B.rangeMax)
                return "highp";
              throw new Error("The required size exceeds that of the ability of your system");
            }
            switch (R) {
              case "speed":
                return "lowp";
              case "balanced":
                return "mediump";
              case "precision":
                return "highp";
              default:
                throw new Error(`Unknown tactic "${R}" use "speed", "balanced", "precision", or empty for auto`);
            }
          }
          updateTextureArgumentRefs(F, R) {
            if (!!this.immutable) {
              if (this.texture.texture === R.texture) {
                let { prevArg: K } = F;
                K && (K.texture._refs === 1 && (this.texture.delete(), this.texture = K.clone(), this._textureSwitched = true), K.delete()), F.prevArg = R.clone();
              } else if (this.mappedTextures && this.mappedTextures.length > 0) {
                let { mappedTextures: K } = this;
                for (let O = 0; O < K.length; O++) {
                  let X = K[O];
                  if (X.texture === R.texture) {
                    let { prevArg: B } = F;
                    B && (B.texture._refs === 1 && (X.delete(), K[O] = B.clone(), this._mappedTextureSwitched[O] = true), B.delete()), F.prevArg = R.clone();
                    return;
                  }
                }
              }
            }
          }
          onActivate(F) {
            if (this._textureSwitched = true, this.texture = F.texture, this.mappedTextures) {
              for (let R = 0; R < this.mappedTextures.length; R++)
                this._mappedTextureSwitched[R] = true;
              this.mappedTextures = F.mappedTextures;
            }
          }
          initCanvas() {
          }
        }
        let A = { int: "Integer", float: "Number", vec2: "Array(2)", vec3: "Array(3)", vec4: "Array(4)" };
        y.exports = { GLKernel: k };
      }, { "../../utils": 114, "../kernel": 36, "./texture/array-2-float": 16, "./texture/array-2-float-2d": 14, "./texture/array-2-float-3d": 15, "./texture/array-3-float": 19, "./texture/array-3-float-2d": 17, "./texture/array-3-float-3d": 18, "./texture/array-4-float": 22, "./texture/array-4-float-2d": 20, "./texture/array-4-float-3d": 21, "./texture/float": 25, "./texture/float-2d": 23, "./texture/float-3d": 24, "./texture/graphical": 26, "./texture/memory-optimized": 30, "./texture/memory-optimized-2d": 28, "./texture/memory-optimized-3d": 29, "./texture/unsigned": 33, "./texture/unsigned-2d": 31, "./texture/unsigned-3d": 32 }], 14: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { GLTextureFloat: g } = o("./float");
        class f extends g {
          constructor(n) {
            super(n), this.type = "ArrayTexture(2)";
          }
          toArray() {
            return p.erect2DArray2(this.renderValues(), this.output[0], this.output[1]);
          }
        }
        y.exports = { GLTextureArray2Float2D: f };
      }, { "../../../utils": 114, "./float": 25 }], 15: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { GLTextureFloat: g } = o("./float");
        class f extends g {
          constructor(n) {
            super(n), this.type = "ArrayTexture(2)";
          }
          toArray() {
            return p.erect3DArray2(this.renderValues(), this.output[0], this.output[1], this.output[2]);
          }
        }
        y.exports = { GLTextureArray2Float3D: f };
      }, { "../../../utils": 114, "./float": 25 }], 16: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { GLTextureFloat: g } = o("./float");
        class f extends g {
          constructor(n) {
            super(n), this.type = "ArrayTexture(2)";
          }
          toArray() {
            return p.erectArray2(this.renderValues(), this.output[0], this.output[1]);
          }
        }
        y.exports = { GLTextureArray2Float: f };
      }, { "../../../utils": 114, "./float": 25 }], 17: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { GLTextureFloat: g } = o("./float");
        class f extends g {
          constructor(n) {
            super(n), this.type = "ArrayTexture(3)";
          }
          toArray() {
            return p.erect2DArray3(this.renderValues(), this.output[0], this.output[1]);
          }
        }
        y.exports = { GLTextureArray3Float2D: f };
      }, { "../../../utils": 114, "./float": 25 }], 18: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { GLTextureFloat: g } = o("./float");
        class f extends g {
          constructor(n) {
            super(n), this.type = "ArrayTexture(3)";
          }
          toArray() {
            return p.erect3DArray3(this.renderValues(), this.output[0], this.output[1], this.output[2]);
          }
        }
        y.exports = { GLTextureArray3Float3D: f };
      }, { "../../../utils": 114, "./float": 25 }], 19: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { GLTextureFloat: g } = o("./float");
        class f extends g {
          constructor(n) {
            super(n), this.type = "ArrayTexture(3)";
          }
          toArray() {
            return p.erectArray3(this.renderValues(), this.output[0]);
          }
        }
        y.exports = { GLTextureArray3Float: f };
      }, { "../../../utils": 114, "./float": 25 }], 20: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { GLTextureFloat: g } = o("./float");
        class f extends g {
          constructor(n) {
            super(n), this.type = "ArrayTexture(4)";
          }
          toArray() {
            return p.erect2DArray4(this.renderValues(), this.output[0], this.output[1]);
          }
        }
        y.exports = { GLTextureArray4Float2D: f };
      }, { "../../../utils": 114, "./float": 25 }], 21: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { GLTextureFloat: g } = o("./float");
        class f extends g {
          constructor(n) {
            super(n), this.type = "ArrayTexture(4)";
          }
          toArray() {
            return p.erect3DArray4(this.renderValues(), this.output[0], this.output[1], this.output[2]);
          }
        }
        y.exports = { GLTextureArray4Float3D: f };
      }, { "../../../utils": 114, "./float": 25 }], 22: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { GLTextureFloat: g } = o("./float");
        class f extends g {
          constructor(n) {
            super(n), this.type = "ArrayTexture(4)";
          }
          toArray() {
            return p.erectArray4(this.renderValues(), this.output[0]);
          }
        }
        y.exports = { GLTextureArray4Float: f };
      }, { "../../../utils": 114, "./float": 25 }], 23: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { GLTextureFloat: g } = o("./float");
        class f extends g {
          constructor(n) {
            super(n), this.type = "ArrayTexture(1)";
          }
          toArray() {
            return p.erect2DFloat(this.renderValues(), this.output[0], this.output[1]);
          }
        }
        y.exports = { GLTextureFloat2D: f };
      }, { "../../../utils": 114, "./float": 25 }], 24: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { GLTextureFloat: g } = o("./float");
        class f extends g {
          constructor(n) {
            super(n), this.type = "ArrayTexture(1)";
          }
          toArray() {
            return p.erect3DFloat(this.renderValues(), this.output[0], this.output[1], this.output[2]);
          }
        }
        y.exports = { GLTextureFloat3D: f };
      }, { "../../../utils": 114, "./float": 25 }], 25: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { GLTexture: g } = o("./index");
        class f extends g {
          get textureType() {
            return this.context.FLOAT;
          }
          constructor(n) {
            super(n), this.type = "ArrayTexture(1)";
          }
          renderRawOutput() {
            let n = this.context, s = this.size;
            n.bindFramebuffer(n.FRAMEBUFFER, this.framebuffer()), n.framebufferTexture2D(n.FRAMEBUFFER, n.COLOR_ATTACHMENT0, n.TEXTURE_2D, this.texture, 0);
            let t = new Float32Array(s[0] * s[1] * 4);
            return n.readPixels(0, 0, s[0], s[1], n.RGBA, n.FLOAT, t), t;
          }
          renderValues() {
            return this._deleted ? null : this.renderRawOutput();
          }
          toArray() {
            return p.erectFloat(this.renderValues(), this.output[0]);
          }
        }
        y.exports = { GLTextureFloat: f };
      }, { "../../../utils": 114, "./index": 27 }], 26: [function(o, y, E) {
        let { GLTextureUnsigned: p } = o("./unsigned");
        class g extends p {
          constructor(l) {
            super(l), this.type = "ArrayTexture(4)";
          }
          toArray() {
            return this.renderValues();
          }
        }
        y.exports = { GLTextureGraphical: g };
      }, { "./unsigned": 33 }], 27: [function(o, y, E) {
        let { Texture: p } = o("../../../texture");
        class g extends p {
          get textureType() {
            throw new Error(`"textureType" not implemented on ${this.name}`);
          }
          clone() {
            return new this.constructor(this);
          }
          beforeMutate() {
            return this.texture._refs > 1 ? (this.newTexture(), true) : false;
          }
          cloneTexture() {
            this.texture._refs--;
            let { context: n, size: s, texture: t, kernel: i } = this;
            i.debug && console.warn("cloning internal texture"), n.bindFramebuffer(n.FRAMEBUFFER, this.framebuffer()), f(n, t), n.framebufferTexture2D(n.FRAMEBUFFER, n.COLOR_ATTACHMENT0, n.TEXTURE_2D, t, 0);
            let u = n.createTexture();
            f(n, u), n.texImage2D(n.TEXTURE_2D, 0, this.internalFormat, s[0], s[1], 0, this.textureFormat, this.textureType, null), n.copyTexSubImage2D(n.TEXTURE_2D, 0, 0, 0, 0, 0, s[0], s[1]), u._refs = 1, this.texture = u;
          }
          newTexture() {
            this.texture._refs--;
            let n = this.context, s = this.size;
            this.kernel.debug && console.warn("new internal texture");
            let i = n.createTexture();
            f(n, i), n.texImage2D(n.TEXTURE_2D, 0, this.internalFormat, s[0], s[1], 0, this.textureFormat, this.textureType, null), i._refs = 1, this.texture = i;
          }
          clear() {
            if (this.texture._refs) {
              this.texture._refs--;
              let t = this.context, i = this.texture = t.createTexture();
              f(t, i);
              let u = this.size;
              i._refs = 1, t.texImage2D(t.TEXTURE_2D, 0, this.internalFormat, u[0], u[1], 0, this.textureFormat, this.textureType, null);
            }
            let { context: n, texture: s } = this;
            n.bindFramebuffer(n.FRAMEBUFFER, this.framebuffer()), n.bindTexture(n.TEXTURE_2D, s), f(n, s), n.framebufferTexture2D(n.FRAMEBUFFER, n.COLOR_ATTACHMENT0, n.TEXTURE_2D, s, 0), n.clearColor(0, 0, 0, 0), n.clear(n.COLOR_BUFFER_BIT | n.DEPTH_BUFFER_BIT);
          }
          delete() {
            this._deleted || (this._deleted = true, !(this.texture._refs && (this.texture._refs--, this.texture._refs)) && this.context.deleteTexture(this.texture));
          }
          framebuffer() {
            return this._framebuffer || (this._framebuffer = this.kernel.getRawValueFramebuffer(this.size[0], this.size[1])), this._framebuffer;
          }
        }
        function f(l, n) {
          l.activeTexture(l.TEXTURE15), l.bindTexture(l.TEXTURE_2D, n), l.texParameteri(l.TEXTURE_2D, l.TEXTURE_WRAP_S, l.CLAMP_TO_EDGE), l.texParameteri(l.TEXTURE_2D, l.TEXTURE_WRAP_T, l.CLAMP_TO_EDGE), l.texParameteri(l.TEXTURE_2D, l.TEXTURE_MIN_FILTER, l.NEAREST), l.texParameteri(l.TEXTURE_2D, l.TEXTURE_MAG_FILTER, l.NEAREST);
        }
        y.exports = { GLTexture: g };
      }, { "../../../texture": 113 }], 28: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { GLTextureFloat: g } = o("./float");
        class f extends g {
          constructor(n) {
            super(n), this.type = "MemoryOptimizedNumberTexture";
          }
          toArray() {
            return p.erectMemoryOptimized2DFloat(this.renderValues(), this.output[0], this.output[1]);
          }
        }
        y.exports = { GLTextureMemoryOptimized2D: f };
      }, { "../../../utils": 114, "./float": 25 }], 29: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { GLTextureFloat: g } = o("./float");
        class f extends g {
          constructor(n) {
            super(n), this.type = "MemoryOptimizedNumberTexture";
          }
          toArray() {
            return p.erectMemoryOptimized3DFloat(this.renderValues(), this.output[0], this.output[1], this.output[2]);
          }
        }
        y.exports = { GLTextureMemoryOptimized3D: f };
      }, { "../../../utils": 114, "./float": 25 }], 30: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { GLTextureFloat: g } = o("./float");
        class f extends g {
          constructor(n) {
            super(n), this.type = "MemoryOptimizedNumberTexture";
          }
          toArray() {
            return p.erectMemoryOptimizedFloat(this.renderValues(), this.output[0]);
          }
        }
        y.exports = { GLTextureMemoryOptimized: f };
      }, { "../../../utils": 114, "./float": 25 }], 31: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { GLTextureUnsigned: g } = o("./unsigned");
        class f extends g {
          constructor(n) {
            super(n), this.type = "NumberTexture";
          }
          toArray() {
            return p.erect2DPackedFloat(this.renderValues(), this.output[0], this.output[1]);
          }
        }
        y.exports = { GLTextureUnsigned2D: f };
      }, { "../../../utils": 114, "./unsigned": 33 }], 32: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { GLTextureUnsigned: g } = o("./unsigned");
        class f extends g {
          constructor(n) {
            super(n), this.type = "NumberTexture";
          }
          toArray() {
            return p.erect3DPackedFloat(this.renderValues(), this.output[0], this.output[1], this.output[2]);
          }
        }
        y.exports = { GLTextureUnsigned3D: f };
      }, { "../../../utils": 114, "./unsigned": 33 }], 33: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { GLTexture: g } = o("./index");
        class f extends g {
          get textureType() {
            return this.context.UNSIGNED_BYTE;
          }
          constructor(n) {
            super(n), this.type = "NumberTexture";
          }
          renderRawOutput() {
            let { context: n } = this;
            n.bindFramebuffer(n.FRAMEBUFFER, this.framebuffer()), n.framebufferTexture2D(n.FRAMEBUFFER, n.COLOR_ATTACHMENT0, n.TEXTURE_2D, this.texture, 0);
            let s = new Uint8Array(this.size[0] * this.size[1] * 4);
            return n.readPixels(0, 0, this.size[0], this.size[1], n.RGBA, n.UNSIGNED_BYTE, s), s;
          }
          renderValues() {
            return this._deleted ? null : new Float32Array(this.renderRawOutput().buffer);
          }
          toArray() {
            return p.erectPackedFloat(this.renderValues(), this.output[0]);
          }
        }
        y.exports = { GLTextureUnsigned: f };
      }, { "../../../utils": 114, "./index": 27 }], 34: [function(o, y, E) {
        let p = o("gl"), { WebGLKernel: g } = o("../web-gl/kernel"), { glKernelString: f } = o("../gl/kernel-string"), l = null, n = null, s = null, t = null, i = null;
        class u extends g {
          static get isSupported() {
            return l !== null || (this.setupFeatureChecks(), l = s !== null), l;
          }
          static setupFeatureChecks() {
            if (n = null, t = null, typeof p == "function")
              try {
                if (s = p(2, 2, { preserveDrawingBuffer: true }), !s || !s.getExtension)
                  return;
                t = { STACKGL_resize_drawingbuffer: s.getExtension("STACKGL_resize_drawingbuffer"), STACKGL_destroy_context: s.getExtension("STACKGL_destroy_context"), OES_texture_float: s.getExtension("OES_texture_float"), OES_texture_float_linear: s.getExtension("OES_texture_float_linear"), OES_element_index_uint: s.getExtension("OES_element_index_uint"), WEBGL_draw_buffers: s.getExtension("WEBGL_draw_buffers"), WEBGL_color_buffer_float: s.getExtension("WEBGL_color_buffer_float") }, i = this.getFeatures();
              } catch (w) {
                console.warn(w);
              }
          }
          static isContextMatch(w) {
            try {
              return w.getParameter(w.RENDERER) === "ANGLE";
            } catch {
              return false;
            }
          }
          static getIsTextureFloat() {
            return Boolean(t.OES_texture_float);
          }
          static getIsDrawBuffers() {
            return Boolean(t.WEBGL_draw_buffers);
          }
          static getChannelCount() {
            return t.WEBGL_draw_buffers ? s.getParameter(t.WEBGL_draw_buffers.MAX_DRAW_BUFFERS_WEBGL) : 1;
          }
          static getMaxTextureSize() {
            return s.getParameter(s.MAX_TEXTURE_SIZE);
          }
          static get testCanvas() {
            return n;
          }
          static get testContext() {
            return s;
          }
          static get features() {
            return i;
          }
          initCanvas() {
            return {};
          }
          initContext() {
            return p(2, 2, { preserveDrawingBuffer: true });
          }
          initExtensions() {
            this.extensions = { STACKGL_resize_drawingbuffer: this.context.getExtension("STACKGL_resize_drawingbuffer"), STACKGL_destroy_context: this.context.getExtension("STACKGL_destroy_context"), OES_texture_float: this.context.getExtension("OES_texture_float"), OES_texture_float_linear: this.context.getExtension("OES_texture_float_linear"), OES_element_index_uint: this.context.getExtension("OES_element_index_uint"), WEBGL_draw_buffers: this.context.getExtension("WEBGL_draw_buffers") };
          }
          build() {
            super.build.apply(this, arguments), this.fallbackRequested || this.extensions.STACKGL_resize_drawingbuffer.resize(this.maxTexSize[0], this.maxTexSize[1]);
          }
          destroyExtensions() {
            this.extensions.STACKGL_resize_drawingbuffer = null, this.extensions.STACKGL_destroy_context = null, this.extensions.OES_texture_float = null, this.extensions.OES_texture_float_linear = null, this.extensions.OES_element_index_uint = null, this.extensions.WEBGL_draw_buffers = null;
          }
          static destroyContext(w) {
            let m = w.getExtension("STACKGL_destroy_context");
            m && m.destroy && m.destroy();
          }
          toString() {
            let w = `const gl = context || require('gl')(1, 1);
`, m = `    if (!context) { gl.getExtension('STACKGL_destroy_context').destroy(); }
`;
            return f(this.constructor, arguments, this, w, m);
          }
          setOutput(w) {
            return super.setOutput(w), this.graphical && this.extensions.STACKGL_resize_drawingbuffer && this.extensions.STACKGL_resize_drawingbuffer.resize(this.maxTexSize[0], this.maxTexSize[1]), this;
          }
        }
        y.exports = { HeadlessGLKernel: u };
      }, { "../gl/kernel-string": 12, "../web-gl/kernel": 70, gl: 2 }], 35: [function(o, y, E) {
        class p {
          constructor(f, l) {
            let { name: n, kernel: s, context: t, checkContext: i, onRequestContextHandle: u, onUpdateValueMismatch: x2, origin: w, strictIntegers: m, type: S, tactic: v } = l;
            if (!n)
              throw new Error("name not set");
            if (!S)
              throw new Error("type not set");
            if (!w)
              throw new Error("origin not set");
            if (w !== "user" && w !== "constants")
              throw new Error(`origin must be "user" or "constants" value is "${w}"`);
            if (!u)
              throw new Error("onRequestContextHandle is not set");
            this.name = n, this.origin = w, this.tactic = v, this.varName = w === "constants" ? `constants.${n}` : n, this.kernel = s, this.strictIntegers = m, this.type = f.type || S, this.size = f.size || null, this.index = null, this.context = t, this.checkContext = i ?? true, this.contextHandle = null, this.onRequestContextHandle = u, this.onUpdateValueMismatch = x2, this.forceUploadEachRun = null;
          }
          get id() {
            return `${this.origin}_${name}`;
          }
          getSource() {
            throw new Error(`"getSource" not defined on ${this.constructor.name}`);
          }
          updateValue(f) {
            throw new Error(`"updateValue" not defined on ${this.constructor.name}`);
          }
        }
        y.exports = { KernelValue: p };
      }, {}], 36: [function(o, y, E) {
        let { utils: p } = o("../utils"), { Input: g } = o("../input");
        class f {
          static get isSupported() {
            throw new Error(`"isSupported" not implemented on ${this.name}`);
          }
          static isContextMatch(s) {
            throw new Error(`"isContextMatch" not implemented on ${this.name}`);
          }
          static getFeatures() {
            throw new Error(`"getFeatures" not implemented on ${this.name}`);
          }
          static destroyContext(s) {
            throw new Error(`"destroyContext" called on ${this.name}`);
          }
          static nativeFunctionArguments() {
            throw new Error(`"nativeFunctionArguments" called on ${this.name}`);
          }
          static nativeFunctionReturnType() {
            throw new Error(`"nativeFunctionReturnType" called on ${this.name}`);
          }
          static combineKernels() {
            throw new Error(`"combineKernels" called on ${this.name}`);
          }
          constructor(s, t) {
            if (typeof s != "object") {
              if (typeof s != "string")
                throw new Error("source not a string");
              if (!p.isFunctionString(s))
                throw new Error("source not a function string");
            }
            this.useLegacyEncoder = false, this.fallbackRequested = false, this.onRequestFallback = null, this.argumentNames = typeof s == "string" ? p.getArgumentNamesFromString(s) : null, this.argumentTypes = null, this.argumentSizes = null, this.argumentBitRatios = null, this.kernelArguments = null, this.kernelConstants = null, this.forceUploadKernelConstants = null, this.source = s, this.output = null, this.debug = false, this.graphical = false, this.loopMaxIterations = 0, this.constants = null, this.constantTypes = null, this.constantBitRatios = null, this.dynamicArguments = false, this.dynamicOutput = false, this.canvas = null, this.context = null, this.checkContext = null, this.gpu = null, this.functions = null, this.nativeFunctions = null, this.injectedNative = null, this.subKernels = null, this.validate = true, this.immutable = false, this.pipeline = false, this.precision = null, this.tactic = null, this.plugins = null, this.returnType = null, this.leadingReturnStatement = null, this.followingReturnStatement = null, this.optimizeFloatMemory = null, this.strictIntegers = false, this.fixIntegerDivisionAccuracy = null, this.built = false, this.signature = null;
          }
          mergeSettings(s) {
            for (let t in s)
              if (!(!s.hasOwnProperty(t) || !this.hasOwnProperty(t))) {
                switch (t) {
                  case "output":
                    if (!Array.isArray(s.output)) {
                      this.setOutput(s.output);
                      continue;
                    }
                    break;
                  case "functions":
                    this.functions = [];
                    for (let i = 0; i < s.functions.length; i++)
                      this.addFunction(s.functions[i]);
                    continue;
                  case "graphical":
                    s[t] && !s.hasOwnProperty("precision") && (this.precision = "unsigned"), this[t] = s[t];
                    continue;
                  case "nativeFunctions":
                    if (!s.nativeFunctions)
                      continue;
                    this.nativeFunctions = [];
                    for (let i = 0; i < s.nativeFunctions.length; i++) {
                      let u = s.nativeFunctions[i], { name: x2, source: w } = u;
                      this.addNativeFunction(x2, w, u);
                    }
                    continue;
                }
                this[t] = s[t];
              }
            this.canvas || (this.canvas = this.initCanvas()), this.context || (this.context = this.initContext()), this.plugins || (this.plugins = this.initPlugins(s));
          }
          build() {
            throw new Error(`"build" not defined on ${this.constructor.name}`);
          }
          run() {
            throw new Error(`"run" not defined on ${this.constructor.name}`);
          }
          initCanvas() {
            throw new Error(`"initCanvas" not defined on ${this.constructor.name}`);
          }
          initContext() {
            throw new Error(`"initContext" not defined on ${this.constructor.name}`);
          }
          initPlugins(s) {
            throw new Error(`"initPlugins" not defined on ${this.constructor.name}`);
          }
          addFunction(s, t = {}) {
            if (s.name && s.source && s.argumentTypes && "returnType" in s)
              this.functions.push(s);
            else if ("settings" in s && "source" in s)
              this.functions.push(this.functionToIGPUFunction(s.source, s.settings));
            else if (typeof s == "string" || typeof s == "function")
              this.functions.push(this.functionToIGPUFunction(s, t));
            else
              throw new Error("function not properly defined");
            return this;
          }
          addNativeFunction(s, t, i = {}) {
            let { argumentTypes: u, argumentNames: x2 } = i.argumentTypes ? l(i.argumentTypes) : this.constructor.nativeFunctionArguments(t) || {};
            return this.nativeFunctions.push({ name: s, source: t, settings: i, argumentTypes: u, argumentNames: x2, returnType: i.returnType || this.constructor.nativeFunctionReturnType(t) }), this;
          }
          setupArguments(s) {
            if (this.kernelArguments = [], this.argumentTypes)
              for (let t = 0; t < this.argumentTypes.length; t++)
                this.kernelArguments.push({ type: this.argumentTypes[t] });
            else if (!this.argumentTypes) {
              this.argumentTypes = [];
              for (let t = 0; t < s.length; t++) {
                let i = p.getVariableType(s[t], this.strictIntegers), u = i === "Integer" ? "Number" : i;
                this.argumentTypes.push(u), this.kernelArguments.push({ type: u });
              }
            }
            this.argumentSizes = new Array(s.length), this.argumentBitRatios = new Int32Array(s.length);
            for (let t = 0; t < s.length; t++) {
              let i = s[t];
              this.argumentSizes[t] = i.constructor === g ? i.size : null, this.argumentBitRatios[t] = this.getBitRatio(i);
            }
            if (this.argumentNames.length !== s.length)
              throw new Error("arguments are miss-aligned");
          }
          setupConstants() {
            this.kernelConstants = [];
            let s = this.constantTypes === null;
            if (s && (this.constantTypes = {}), this.constantBitRatios = {}, this.constants)
              for (let t in this.constants) {
                if (s) {
                  let i = p.getVariableType(this.constants[t], this.strictIntegers);
                  this.constantTypes[t] = i, this.kernelConstants.push({ name: t, type: i });
                } else
                  this.kernelConstants.push({ name: t, type: this.constantTypes[t] });
                this.constantBitRatios[t] = this.getBitRatio(this.constants[t]);
              }
          }
          setOptimizeFloatMemory(s) {
            return this.optimizeFloatMemory = s, this;
          }
          toKernelOutput(s) {
            return s.hasOwnProperty("x") ? s.hasOwnProperty("y") ? s.hasOwnProperty("z") ? [s.x, s.y, s.z] : [s.x, s.y] : [s.x] : s;
          }
          setOutput(s) {
            return this.output = this.toKernelOutput(s), this;
          }
          setDebug(s) {
            return this.debug = s, this;
          }
          setGraphical(s) {
            return this.graphical = s, this.precision = "unsigned", this;
          }
          setLoopMaxIterations(s) {
            return this.loopMaxIterations = s, this;
          }
          setConstants(s) {
            return this.constants = s, this;
          }
          setConstantTypes(s) {
            return this.constantTypes = s, this;
          }
          setFunctions(s) {
            for (let t = 0; t < s.length; t++)
              this.addFunction(s[t]);
            return this;
          }
          setNativeFunctions(s) {
            for (let t = 0; t < s.length; t++) {
              let i = s[t], { name: u, source: x2 } = i;
              this.addNativeFunction(u, x2, i);
            }
            return this;
          }
          setInjectedNative(s) {
            return this.injectedNative = s, this;
          }
          setPipeline(s) {
            return this.pipeline = s, this;
          }
          setPrecision(s) {
            return this.precision = s, this;
          }
          setDimensions(s) {
            return p.warnDeprecated("method", "setDimensions", "setOutput"), this.output = s, this;
          }
          setOutputToTexture(s) {
            return p.warnDeprecated("method", "setOutputToTexture", "setPipeline"), this.pipeline = s, this;
          }
          setImmutable(s) {
            return this.immutable = s, this;
          }
          setCanvas(s) {
            return this.canvas = s, this;
          }
          setStrictIntegers(s) {
            return this.strictIntegers = s, this;
          }
          setDynamicOutput(s) {
            return this.dynamicOutput = s, this;
          }
          setHardcodeConstants(s) {
            return p.warnDeprecated("method", "setHardcodeConstants"), this.setDynamicOutput(s), this.setDynamicArguments(s), this;
          }
          setDynamicArguments(s) {
            return this.dynamicArguments = s, this;
          }
          setUseLegacyEncoder(s) {
            return this.useLegacyEncoder = s, this;
          }
          setWarnVarUsage(s) {
            return p.warnDeprecated("method", "setWarnVarUsage"), this;
          }
          getCanvas() {
            return p.warnDeprecated("method", "getCanvas"), this.canvas;
          }
          getWebGl() {
            return p.warnDeprecated("method", "getWebGl"), this.context;
          }
          setContext(s) {
            return this.context = s, this;
          }
          setArgumentTypes(s) {
            if (Array.isArray(s))
              this.argumentTypes = s;
            else {
              this.argumentTypes = [];
              for (let t in s) {
                if (!s.hasOwnProperty(t))
                  continue;
                let i = this.argumentNames.indexOf(t);
                if (i === -1)
                  throw new Error(`unable to find argument ${t}`);
                this.argumentTypes[i] = s[t];
              }
            }
            return this;
          }
          setTactic(s) {
            return this.tactic = s, this;
          }
          requestFallback(s) {
            if (!this.onRequestFallback)
              throw new Error(`"onRequestFallback" not defined on ${this.constructor.name}`);
            return this.fallbackRequested = true, this.onRequestFallback(s);
          }
          validateSettings() {
            throw new Error(`"validateSettings" not defined on ${this.constructor.name}`);
          }
          addSubKernel(s) {
            if (this.subKernels === null && (this.subKernels = []), !s.source)
              throw new Error('subKernel missing "source" property');
            if (!s.property && isNaN(s.property))
              throw new Error('subKernel missing "property" property');
            if (!s.name)
              throw new Error('subKernel missing "name" property');
            return this.subKernels.push(s), this;
          }
          destroy(s) {
            throw new Error(`"destroy" called on ${this.constructor.name}`);
          }
          getBitRatio(s) {
            if (this.precision === "single")
              return 4;
            if (Array.isArray(s[0]))
              return this.getBitRatio(s[0]);
            if (s.constructor === g)
              return this.getBitRatio(s.value);
            switch (s.constructor) {
              case Uint8ClampedArray:
              case Uint8Array:
              case Int8Array:
                return 1;
              case Uint16Array:
              case Int16Array:
                return 2;
              case Float32Array:
              case Int32Array:
              default:
                return 4;
            }
          }
          getPixels(s) {
            throw new Error(`"getPixels" called on ${this.constructor.name}`);
          }
          checkOutput() {
            if (!this.output || !p.isArray(this.output))
              throw new Error("kernel.output not an array");
            if (this.output.length < 1)
              throw new Error("kernel.output is empty, needs at least 1 value");
            for (let s = 0; s < this.output.length; s++)
              if (isNaN(this.output[s]) || this.output[s] < 1)
                throw new Error(`${this.constructor.name}.output[${s}] incorrectly defined as \`${this.output[s]}\`, needs to be numeric, and greater than 0`);
          }
          prependString(s) {
            throw new Error(`"prependString" called on ${this.constructor.name}`);
          }
          hasPrependString(s) {
            throw new Error(`"hasPrependString" called on ${this.constructor.name}`);
          }
          toJSON() {
            return { settings: { output: this.output, pipeline: this.pipeline, argumentNames: this.argumentNames, argumentsTypes: this.argumentTypes, constants: this.constants, pluginNames: this.plugins ? this.plugins.map((s) => s.name) : null, returnType: this.returnType } };
          }
          buildSignature(s) {
            let t = this.constructor;
            this.signature = t.getSignature(this, t.getArgumentTypes(this, s));
          }
          static getArgumentTypes(s, t) {
            let i = new Array(t.length);
            for (let u = 0; u < t.length; u++) {
              let x2 = t[u], w = s.argumentTypes[u];
              if (x2.type)
                i[u] = x2.type;
              else
                switch (w) {
                  case "Number":
                  case "Integer":
                  case "Float":
                  case "ArrayTexture(1)":
                    i[u] = p.getVariableType(x2);
                    break;
                  default:
                    i[u] = w;
                }
            }
            return i;
          }
          static getSignature(s, t) {
            throw new Error(`"getSignature" not implemented on ${this.name}`);
          }
          functionToIGPUFunction(s, t = {}) {
            if (typeof s != "string" && typeof s != "function")
              throw new Error("source not a string or function");
            let i = typeof s == "string" ? s : s.toString(), u = [];
            return Array.isArray(t.argumentTypes) ? u = t.argumentTypes : typeof t.argumentTypes == "object" ? u = p.getArgumentNamesFromString(i).map((x2) => t.argumentTypes[x2]) || [] : u = t.argumentTypes || [], { name: p.getFunctionNameFromString(i) || null, source: i, argumentTypes: u, returnType: t.returnType || null };
          }
          onActivate(s) {
          }
        }
        function l(n) {
          let s = Object.keys(n), t = [];
          for (let i = 0; i < s.length; i++) {
            let u = s[i];
            t.push(n[u]);
          }
          return { argumentTypes: t, argumentNames: s };
        }
        y.exports = { Kernel: f };
      }, { "../input": 110, "../utils": 114 }], 37: [function(o, y, E) {
        let p = `__HEADER__;
      __FLOAT_TACTIC_DECLARATION__;
      __INT_TACTIC_DECLARATION__;
      __SAMPLER_2D_TACTIC_DECLARATION__;
      
      const int LOOP_MAX = __LOOP_MAX__;
      
      __PLUGINS__;
      __CONSTANTS__;
      
      varying vec2 vTexCoord;
      
      float acosh(float x) {
        return log(x + sqrt(x * x - 1.0));
      }
      
      float sinh(float x) {
        return (pow(${Math.E}, x) - pow(${Math.E}, -x)) / 2.0;
      }
      
      float asinh(float x) {
        return log(x + sqrt(x * x + 1.0));
      }
      
      float atan2(float v1, float v2) {
        if (v1 == 0.0 || v2 == 0.0) return 0.0;
        return atan(v1 / v2);
      }
      
      float atanh(float x) {
        x = (x + 1.0) / (x - 1.0);
        if (x < 0.0) {
          return 0.5 * log(-x);
        }
        return 0.5 * log(x);
      }
      
      float cbrt(float x) {
        if (x >= 0.0) {
          return pow(x, 1.0 / 3.0);
        } else {
          return -pow(x, 1.0 / 3.0);
        }
      }
      
      float cosh(float x) {
        return (pow(${Math.E}, x) + pow(${Math.E}, -x)) / 2.0; 
      }
      
      float expm1(float x) {
        return pow(${Math.E}, x) - 1.0; 
      }
      
      float fround(highp float x) {
        return x;
      }
      
      float imul(float v1, float v2) {
        return float(int(v1) * int(v2));
      }
      
      float log10(float x) {
        return log2(x) * (1.0 / log2(10.0));
      }
      
      float log1p(float x) {
        return log(1.0 + x);
      }
      
      float _pow(float v1, float v2) {
        if (v2 == 0.0) return 1.0;
        return pow(v1, v2);
      }
      
      float tanh(float x) {
        float e = exp(2.0 * x);
        return (e - 1.0) / (e + 1.0);
      }
      
      float trunc(float x) {
        if (x >= 0.0) {
          return floor(x); 
        } else {
          return ceil(x);
        }
      }
      
      vec4 _round(vec4 x) {
        return floor(x + 0.5);
      }
      
      float _round(float x) {
        return floor(x + 0.5);
      }
      
      const int BIT_COUNT = 32;
      int modi(int x, int y) {
        return x - y * (x / y);
      }
      
      int bitwiseOr(int a, int b) {
        int result = 0;
        int n = 1;
        
        for (int i = 0; i < BIT_COUNT; i++) {
          if ((modi(a, 2) == 1) || (modi(b, 2) == 1)) {
            result += n;
          }
          a = a / 2;
          b = b / 2;
          n = n * 2;
          if(!(a > 0 || b > 0)) {
            break;
          }
        }
        return result;
      }
      int bitwiseXOR(int a, int b) {
        int result = 0;
        int n = 1;
        
        for (int i = 0; i < BIT_COUNT; i++) {
          if ((modi(a, 2) == 1) != (modi(b, 2) == 1)) {
            result += n;
          }
          a = a / 2;
          b = b / 2;
          n = n * 2;
          if(!(a > 0 || b > 0)) {
            break;
          }
        }
        return result;
      }
      int bitwiseAnd(int a, int b) {
        int result = 0;
        int n = 1;
        for (int i = 0; i < BIT_COUNT; i++) {
          if ((modi(a, 2) == 1) && (modi(b, 2) == 1)) {
            result += n;
          }
          a = a / 2;
          b = b / 2;
          n = n * 2;
          if(!(a > 0 && b > 0)) {
            break;
          }
        }
        return result;
      }
      int bitwiseNot(int a) {
        int result = 0;
        int n = 1;
        
        for (int i = 0; i < BIT_COUNT; i++) {
          if (modi(a, 2) == 0) {
            result += n;    
          }
          a = a / 2;
          n = n * 2;
        }
        return result;
      }
      int bitwiseZeroFillLeftShift(int n, int shift) {
        int maxBytes = BIT_COUNT;
        for (int i = 0; i < BIT_COUNT; i++) {
          if (maxBytes >= n) {
            break;
          }
          maxBytes *= 2;
        }
        for (int i = 0; i < BIT_COUNT; i++) {
          if (i >= shift) {
            break;
          }
          n *= 2;
        }
      
        int result = 0;
        int byteVal = 1;
        for (int i = 0; i < BIT_COUNT; i++) {
          if (i >= maxBytes) break;
          if (modi(n, 2) > 0) { result += byteVal; }
          n = int(n / 2);
          byteVal *= 2;
        }
        return result;
      }
      
      int bitwiseSignedRightShift(int num, int shifts) {
        return int(floor(float(num) / pow(2.0, float(shifts))));
      }
      
      int bitwiseZeroFillRightShift(int n, int shift) {
        int maxBytes = BIT_COUNT;
        for (int i = 0; i < BIT_COUNT; i++) {
          if (maxBytes >= n) {
            break;
          }
          maxBytes *= 2;
        }
        for (int i = 0; i < BIT_COUNT; i++) {
          if (i >= shift) {
            break;
          }
          n /= 2;
        }
        int result = 0;
        int byteVal = 1;
        for (int i = 0; i < BIT_COUNT; i++) {
          if (i >= maxBytes) break;
          if (modi(n, 2) > 0) { result += byteVal; }
          n = int(n / 2);
          byteVal *= 2;
        }
        return result;
      }
      
      vec2 integerMod(vec2 x, float y) {
        vec2 res = floor(mod(x, y));
        return res * step(1.0 - floor(y), -res);
      }
      
      vec3 integerMod(vec3 x, float y) {
        vec3 res = floor(mod(x, y));
        return res * step(1.0 - floor(y), -res);
      }
      
      vec4 integerMod(vec4 x, vec4 y) {
        vec4 res = floor(mod(x, y));
        return res * step(1.0 - floor(y), -res);
      }
      
      float integerMod(float x, float y) {
        float res = floor(mod(x, y));
        return res * (res > floor(y) - 1.0 ? 0.0 : 1.0);
      }
      
      int integerMod(int x, int y) {
        return x - (y * int(x / y));
      }
      
      __DIVIDE_WITH_INTEGER_CHECK__;
      
      // Here be dragons!
      // DO NOT OPTIMIZE THIS CODE
      // YOU WILL BREAK SOMETHING ON SOMEBODY'S MACHINE
      // LEAVE IT AS IT IS, LEST YOU WASTE YOUR OWN TIME
      const vec2 MAGIC_VEC = vec2(1.0, -256.0);
      const vec4 SCALE_FACTOR = vec4(1.0, 256.0, 65536.0, 0.0);
      const vec4 SCALE_FACTOR_INV = vec4(1.0, 0.00390625, 0.0000152587890625, 0.0); // 1, 1/256, 1/65536
      float decode32(vec4 texel) {
        __DECODE32_ENDIANNESS__;
        texel *= 255.0;
        vec2 gte128;
        gte128.x = texel.b >= 128.0 ? 1.0 : 0.0;
        gte128.y = texel.a >= 128.0 ? 1.0 : 0.0;
        float exponent = 2.0 * texel.a - 127.0 + dot(gte128, MAGIC_VEC);
        float res = exp2(_round(exponent));
        texel.b = texel.b - 128.0 * gte128.x;
        res = dot(texel, SCALE_FACTOR) * exp2(_round(exponent-23.0)) + res;
        res *= gte128.y * -2.0 + 1.0;
        return res;
      }
      
      float decode16(vec4 texel, int index) {
        int channel = integerMod(index, 2);
        if (channel == 0) return texel.r * 255.0 + texel.g * 65280.0;
        if (channel == 1) return texel.b * 255.0 + texel.a * 65280.0;
        return 0.0;
      }
      
      float decode8(vec4 texel, int index) {
        int channel = integerMod(index, 4);
        if (channel == 0) return texel.r * 255.0;
        if (channel == 1) return texel.g * 255.0;
        if (channel == 2) return texel.b * 255.0;
        if (channel == 3) return texel.a * 255.0;
        return 0.0;
      }
      
      vec4 legacyEncode32(float f) {
        float F = abs(f);
        float sign = f < 0.0 ? 1.0 : 0.0;
        float exponent = floor(log2(F));
        float mantissa = (exp2(-exponent) * F);
        // exponent += floor(log2(mantissa));
        vec4 texel = vec4(F * exp2(23.0-exponent)) * SCALE_FACTOR_INV;
        texel.rg = integerMod(texel.rg, 256.0);
        texel.b = integerMod(texel.b, 128.0);
        texel.a = exponent*0.5 + 63.5;
        texel.ba += vec2(integerMod(exponent+127.0, 2.0), sign) * 128.0;
        texel = floor(texel);
        texel *= 0.003921569; // 1/255
        __ENCODE32_ENDIANNESS__;
        return texel;
      }
      
      // https://github.com/gpujs/gpu.js/wiki/Encoder-details
      vec4 encode32(float value) {
        if (value == 0.0) return vec4(0, 0, 0, 0);
      
        float exponent;
        float mantissa;
        vec4  result;
        float sgn;
      
        sgn = step(0.0, -value);
        value = abs(value);
      
        exponent = floor(log2(value));
      
        mantissa = value*pow(2.0, -exponent)-1.0;
        exponent = exponent+127.0;
        result   = vec4(0,0,0,0);
      
        result.a = floor(exponent/2.0);
        exponent = exponent - result.a*2.0;
        result.a = result.a + 128.0*sgn;
      
        result.b = floor(mantissa * 128.0);
        mantissa = mantissa - result.b / 128.0;
        result.b = result.b + exponent*128.0;
      
        result.g = floor(mantissa*32768.0);
        mantissa = mantissa - result.g/32768.0;
      
        result.r = floor(mantissa*8388608.0);
        return result/255.0;
      }
      // Dragons end here
      
      int index;
      ivec3 threadId;
      
      ivec3 indexTo3D(int idx, ivec3 texDim) {
        int z = int(idx / (texDim.x * texDim.y));
        idx -= z * int(texDim.x * texDim.y);
        int y = int(idx / texDim.x);
        int x = int(integerMod(idx, texDim.x));
        return ivec3(x, y, z);
      }
      
      float get32(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
        int index = x + texDim.x * (y + texDim.y * z);
        int w = texSize.x;
        vec2 st = vec2(float(integerMod(index, w)), float(index / w)) + 0.5;
        vec4 texel = texture2D(tex, st / vec2(texSize));
        return decode32(texel);
      }
      
      float get16(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
        int index = x + texDim.x * (y + texDim.y * z);
        int w = texSize.x * 2;
        vec2 st = vec2(float(integerMod(index, w)), float(index / w)) + 0.5;
        vec4 texel = texture2D(tex, st / vec2(texSize.x * 2, texSize.y));
        return decode16(texel, index);
      }
      
      float get8(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
        int index = x + texDim.x * (y + texDim.y * z);
        int w = texSize.x * 4;
        vec2 st = vec2(float(integerMod(index, w)), float(index / w)) + 0.5;
        vec4 texel = texture2D(tex, st / vec2(texSize.x * 4, texSize.y));
        return decode8(texel, index);
      }
      
      float getMemoryOptimized32(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
        int index = x + texDim.x * (y + texDim.y * z);
        int channel = integerMod(index, 4);
        index = index / 4;
        int w = texSize.x;
        vec2 st = vec2(float(integerMod(index, w)), float(index / w)) + 0.5;
        vec4 texel = texture2D(tex, st / vec2(texSize));
        if (channel == 0) return texel.r;
        if (channel == 1) return texel.g;
        if (channel == 2) return texel.b;
        if (channel == 3) return texel.a;
        return 0.0;
      }
      
      vec4 getImage2D(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
        int index = x + texDim.x * (y + texDim.y * z);
        int w = texSize.x;
        vec2 st = vec2(float(integerMod(index, w)), float(index / w)) + 0.5;
        return texture2D(tex, st / vec2(texSize));
      }
      
      float getFloatFromSampler2D(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
        vec4 result = getImage2D(tex, texSize, texDim, z, y, x);
        return result[0];
      }
      
      vec2 getVec2FromSampler2D(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
        vec4 result = getImage2D(tex, texSize, texDim, z, y, x);
        return vec2(result[0], result[1]);
      }
      
      vec2 getMemoryOptimizedVec2(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
        int index = x + (texDim.x * (y + (texDim.y * z)));
        int channel = integerMod(index, 2);
        index = index / 2;
        int w = texSize.x;
        vec2 st = vec2(float(integerMod(index, w)), float(index / w)) + 0.5;
        vec4 texel = texture2D(tex, st / vec2(texSize));
        if (channel == 0) return vec2(texel.r, texel.g);
        if (channel == 1) return vec2(texel.b, texel.a);
        return vec2(0.0, 0.0);
      }
      
      vec3 getVec3FromSampler2D(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
        vec4 result = getImage2D(tex, texSize, texDim, z, y, x);
        return vec3(result[0], result[1], result[2]);
      }
      
      vec3 getMemoryOptimizedVec3(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
        int fieldIndex = 3 * (x + texDim.x * (y + texDim.y * z));
        int vectorIndex = fieldIndex / 4;
        int vectorOffset = fieldIndex - vectorIndex * 4;
        int readY = vectorIndex / texSize.x;
        int readX = vectorIndex - readY * texSize.x;
        vec4 tex1 = texture2D(tex, (vec2(readX, readY) + 0.5) / vec2(texSize));
        
        if (vectorOffset == 0) {
          return tex1.xyz;
        } else if (vectorOffset == 1) {
          return tex1.yzw;
        } else {
          readX++;
          if (readX >= texSize.x) {
            readX = 0;
            readY++;
          }
          vec4 tex2 = texture2D(tex, vec2(readX, readY) / vec2(texSize));
          if (vectorOffset == 2) {
            return vec3(tex1.z, tex1.w, tex2.x);
          } else {
            return vec3(tex1.w, tex2.x, tex2.y);
          }
        }
      }
      
      vec4 getVec4FromSampler2D(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
        return getImage2D(tex, texSize, texDim, z, y, x);
      }
      
      vec4 getMemoryOptimizedVec4(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
        int index = x + texDim.x * (y + texDim.y * z);
        int channel = integerMod(index, 2);
        int w = texSize.x;
        vec2 st = vec2(float(integerMod(index, w)), float(index / w)) + 0.5;
        vec4 texel = texture2D(tex, st / vec2(texSize));
        return vec4(texel.r, texel.g, texel.b, texel.a);
      }
      
      vec4 actualColor;
      void color(float r, float g, float b, float a) {
        actualColor = vec4(r,g,b,a);
      }
      
      void color(float r, float g, float b) {
        color(r,g,b,1.0);
      }
      
      void color(sampler2D image) {
        actualColor = texture2D(image, vTexCoord);
      }
      
      float modulo(float number, float divisor) {
        if (number < 0.0) {
          number = abs(number);
          if (divisor < 0.0) {
            divisor = abs(divisor);
          }
          return -mod(number, divisor);
        }
        if (divisor < 0.0) {
          divisor = abs(divisor);
        }
        return mod(number, divisor);
      }
      
      __INJECTED_NATIVE__;
      __MAIN_CONSTANTS__;
      __MAIN_ARGUMENTS__;
      __KERNEL__;
      
      void main(void) {
        index = int(vTexCoord.s * float(uTexSize.x)) + int(vTexCoord.t * float(uTexSize.y)) * uTexSize.x;
        __MAIN_RESULT__;
      }`;
        y.exports = { fragmentShader: p };
      }, {}], 38: [function(o, y, E) {
        let { utils: p } = o("../../utils"), { FunctionNode: g } = o("../function-node");
        class f extends g {
          constructor(t, i) {
            super(t, i), i && i.hasOwnProperty("fixIntegerDivisionAccuracy") && (this.fixIntegerDivisionAccuracy = i.fixIntegerDivisionAccuracy);
          }
          astConditionalExpression(t, i) {
            if (t.type !== "ConditionalExpression")
              throw this.astErrorOutput("Not a conditional expression", t);
            let u = this.getType(t.consequent), x2 = this.getType(t.alternate);
            return u === null && x2 === null ? (i.push("if ("), this.astGeneric(t.test, i), i.push(") {"), this.astGeneric(t.consequent, i), i.push(";"), i.push("} else {"), this.astGeneric(t.alternate, i), i.push(";"), i.push("}"), i) : (i.push("("), this.astGeneric(t.test, i), i.push("?"), this.astGeneric(t.consequent, i), i.push(":"), this.astGeneric(t.alternate, i), i.push(")"), i);
          }
          astFunction(t, i) {
            if (this.isRootKernel)
              i.push("void");
            else {
              this.returnType || this.findLastReturn() && (this.returnType = this.getType(t.body), this.returnType === "LiteralInteger" && (this.returnType = "Number"));
              let { returnType: u } = this;
              if (!u)
                i.push("void");
              else {
                let x2 = l[u];
                if (!x2)
                  throw new Error(`unknown type ${u}`);
                i.push(x2);
              }
            }
            if (i.push(" "), i.push(this.name), i.push("("), !this.isRootKernel)
              for (let u = 0; u < this.argumentNames.length; ++u) {
                let x2 = this.argumentNames[u];
                u > 0 && i.push(", ");
                let w = this.argumentTypes[this.argumentNames.indexOf(x2)];
                if (!w)
                  throw this.astErrorOutput(`Unknown argument ${x2} type`, t);
                w === "LiteralInteger" && (this.argumentTypes[u] = w = "Number");
                let m = l[w];
                if (!m)
                  throw this.astErrorOutput("Unexpected expression", t);
                let S = p.sanitizeName(x2);
                m === "sampler2D" || m === "sampler2DArray" ? i.push(`${m} user_${S},ivec2 user_${S}Size,ivec3 user_${S}Dim`) : i.push(`${m} user_${S}`);
              }
            i.push(`) {
`);
            for (let u = 0; u < t.body.body.length; ++u)
              this.astGeneric(t.body.body[u], i), i.push(`
`);
            return i.push(`}
`), i;
          }
          astReturnStatement(t, i) {
            if (!t.argument)
              throw this.astErrorOutput("Unexpected return statement", t);
            this.pushState("skip-literal-correction");
            let u = this.getType(t.argument);
            this.popState("skip-literal-correction");
            let x2 = [];
            switch (this.returnType || (u === "LiteralInteger" || u === "Integer" ? this.returnType = "Number" : this.returnType = u), this.returnType) {
              case "LiteralInteger":
              case "Number":
              case "Float":
                switch (u) {
                  case "Integer":
                    x2.push("float("), this.astGeneric(t.argument, x2), x2.push(")");
                    break;
                  case "LiteralInteger":
                    this.castLiteralToFloat(t.argument, x2), this.getType(t) === "Integer" && (x2.unshift("float("), x2.push(")"));
                    break;
                  default:
                    this.astGeneric(t.argument, x2);
                }
                break;
              case "Integer":
                switch (u) {
                  case "Float":
                  case "Number":
                    this.castValueToInteger(t.argument, x2);
                    break;
                  case "LiteralInteger":
                    this.castLiteralToInteger(t.argument, x2);
                    break;
                  default:
                    this.astGeneric(t.argument, x2);
                }
                break;
              case "Array(4)":
              case "Array(3)":
              case "Array(2)":
              case "Matrix(2)":
              case "Matrix(3)":
              case "Matrix(4)":
              case "Input":
                this.astGeneric(t.argument, x2);
                break;
              default:
                throw this.astErrorOutput(`unhandled return type ${this.returnType}`, t);
            }
            return this.isRootKernel ? (i.push(`kernelResult = ${x2.join("")};`), i.push("return;")) : this.isSubKernel ? (i.push(`subKernelResult_${this.name} = ${x2.join("")};`), i.push(`return subKernelResult_${this.name};`)) : i.push(`return ${x2.join("")};`), i;
          }
          astLiteral(t, i) {
            if (isNaN(t.value))
              throw this.astErrorOutput("Non-numeric literal not supported : " + t.value, t);
            let u = this.astKey(t);
            return Number.isInteger(t.value) ? this.isState("casting-to-integer") || this.isState("building-integer") ? (this.literalTypes[u] = "Integer", i.push(`${t.value}`)) : this.isState("casting-to-float") || this.isState("building-float") ? (this.literalTypes[u] = "Number", i.push(`${t.value}.0`)) : (this.literalTypes[u] = "Number", i.push(`${t.value}.0`)) : this.isState("casting-to-integer") || this.isState("building-integer") ? (this.literalTypes[u] = "Integer", i.push(Math.round(t.value))) : (this.literalTypes[u] = "Number", i.push(`${t.value}`)), i;
          }
          astBinaryExpression(t, i) {
            if (this.checkAndUpconvertOperator(t, i))
              return i;
            if (this.fixIntegerDivisionAccuracy && t.operator === "/") {
              switch (i.push("divWithIntCheck("), this.pushState("building-float"), this.getType(t.left)) {
                case "Integer":
                  this.castValueToFloat(t.left, i);
                  break;
                case "LiteralInteger":
                  this.castLiteralToFloat(t.left, i);
                  break;
                default:
                  this.astGeneric(t.left, i);
              }
              switch (i.push(", "), this.getType(t.right)) {
                case "Integer":
                  this.castValueToFloat(t.right, i);
                  break;
                case "LiteralInteger":
                  this.castLiteralToFloat(t.right, i);
                  break;
                default:
                  this.astGeneric(t.right, i);
              }
              return this.popState("building-float"), i.push(")"), i;
            }
            i.push("(");
            let u = this.getType(t.left) || "Number", x2 = this.getType(t.right) || "Number";
            if (!u || !x2)
              throw this.astErrorOutput("Unhandled binary expression", t);
            let w = u + " & " + x2;
            switch (w) {
              case "Integer & Integer":
                this.pushState("building-integer"), this.astGeneric(t.left, i), i.push(n[t.operator] || t.operator), this.astGeneric(t.right, i), this.popState("building-integer");
                break;
              case "Number & Float":
              case "Float & Number":
              case "Float & Float":
              case "Number & Number":
                this.pushState("building-float"), this.astGeneric(t.left, i), i.push(n[t.operator] || t.operator), this.astGeneric(t.right, i), this.popState("building-float");
                break;
              case "LiteralInteger & LiteralInteger":
                this.isState("casting-to-integer") || this.isState("building-integer") ? (this.pushState("building-integer"), this.astGeneric(t.left, i), i.push(n[t.operator] || t.operator), this.astGeneric(t.right, i), this.popState("building-integer")) : (this.pushState("building-float"), this.castLiteralToFloat(t.left, i), i.push(n[t.operator] || t.operator), this.castLiteralToFloat(t.right, i), this.popState("building-float"));
                break;
              case "Integer & Float":
              case "Integer & Number":
                if ((t.operator === ">" || t.operator === "<" && t.right.type === "Literal") && !Number.isInteger(t.right.value)) {
                  this.pushState("building-float"), this.castValueToFloat(t.left, i), i.push(n[t.operator] || t.operator), this.astGeneric(t.right, i), this.popState("building-float");
                  break;
                }
                if (this.pushState("building-integer"), this.astGeneric(t.left, i), i.push(n[t.operator] || t.operator), this.pushState("casting-to-integer"), t.right.type === "Literal") {
                  let m = [];
                  if (this.astGeneric(t.right, m), this.getType(t.right) === "Integer")
                    i.push(m.join(""));
                  else
                    throw this.astErrorOutput("Unhandled binary expression with literal", t);
                } else
                  i.push("int("), this.astGeneric(t.right, i), i.push(")");
                this.popState("casting-to-integer"), this.popState("building-integer");
                break;
              case "Integer & LiteralInteger":
                this.pushState("building-integer"), this.astGeneric(t.left, i), i.push(n[t.operator] || t.operator), this.castLiteralToInteger(t.right, i), this.popState("building-integer");
                break;
              case "Number & Integer":
                this.pushState("building-float"), this.astGeneric(t.left, i), i.push(n[t.operator] || t.operator), this.castValueToFloat(t.right, i), this.popState("building-float");
                break;
              case "Float & LiteralInteger":
              case "Number & LiteralInteger":
                this.pushState("building-float"), this.astGeneric(t.left, i), i.push(n[t.operator] || t.operator), this.castLiteralToFloat(t.right, i), this.popState("building-float");
                break;
              case "LiteralInteger & Float":
              case "LiteralInteger & Number":
                this.isState("casting-to-integer") ? (this.pushState("building-integer"), this.castLiteralToInteger(t.left, i), i.push(n[t.operator] || t.operator), this.castValueToInteger(t.right, i), this.popState("building-integer")) : (this.pushState("building-float"), this.astGeneric(t.left, i), i.push(n[t.operator] || t.operator), this.pushState("casting-to-float"), this.astGeneric(t.right, i), this.popState("casting-to-float"), this.popState("building-float"));
                break;
              case "LiteralInteger & Integer":
                this.pushState("building-integer"), this.castLiteralToInteger(t.left, i), i.push(n[t.operator] || t.operator), this.astGeneric(t.right, i), this.popState("building-integer");
                break;
              case "Boolean & Boolean":
                this.pushState("building-boolean"), this.astGeneric(t.left, i), i.push(n[t.operator] || t.operator), this.astGeneric(t.right, i), this.popState("building-boolean");
                break;
              case "Float & Integer":
                this.pushState("building-float"), this.astGeneric(t.left, i), i.push(n[t.operator] || t.operator), this.castValueToFloat(t.right, i), this.popState("building-float");
                break;
              default:
                throw this.astErrorOutput(`Unhandled binary expression between ${w}`, t);
            }
            return i.push(")"), i;
          }
          checkAndUpconvertOperator(t, i) {
            let u = this.checkAndUpconvertBitwiseOperators(t, i);
            if (u)
              return u;
            let w = { "%": this.fixIntegerDivisionAccuracy ? "integerCorrectionModulo" : "modulo", "**": "pow" }[t.operator];
            if (!w)
              return null;
            switch (i.push(w), i.push("("), this.getType(t.left)) {
              case "Integer":
                this.castValueToFloat(t.left, i);
                break;
              case "LiteralInteger":
                this.castLiteralToFloat(t.left, i);
                break;
              default:
                this.astGeneric(t.left, i);
            }
            switch (i.push(","), this.getType(t.right)) {
              case "Integer":
                this.castValueToFloat(t.right, i);
                break;
              case "LiteralInteger":
                this.castLiteralToFloat(t.right, i);
                break;
              default:
                this.astGeneric(t.right, i);
            }
            return i.push(")"), i;
          }
          checkAndUpconvertBitwiseOperators(t, i) {
            let x2 = { "&": "bitwiseAnd", "|": "bitwiseOr", "^": "bitwiseXOR", "<<": "bitwiseZeroFillLeftShift", ">>": "bitwiseSignedRightShift", ">>>": "bitwiseZeroFillRightShift" }[t.operator];
            if (!x2)
              return null;
            switch (i.push(x2), i.push("("), this.getType(t.left)) {
              case "Number":
              case "Float":
                this.castValueToInteger(t.left, i);
                break;
              case "LiteralInteger":
                this.castLiteralToInteger(t.left, i);
                break;
              default:
                this.astGeneric(t.left, i);
            }
            switch (i.push(","), this.getType(t.right)) {
              case "Number":
              case "Float":
                this.castValueToInteger(t.right, i);
                break;
              case "LiteralInteger":
                this.castLiteralToInteger(t.right, i);
                break;
              default:
                this.astGeneric(t.right, i);
            }
            return i.push(")"), i;
          }
          checkAndUpconvertBitwiseUnary(t, i) {
            let x2 = { "~": "bitwiseNot" }[t.operator];
            if (!x2)
              return null;
            switch (i.push(x2), i.push("("), this.getType(t.argument)) {
              case "Number":
              case "Float":
                this.castValueToInteger(t.argument, i);
                break;
              case "LiteralInteger":
                this.castLiteralToInteger(t.argument, i);
                break;
              default:
                this.astGeneric(t.argument, i);
            }
            return i.push(")"), i;
          }
          castLiteralToInteger(t, i) {
            return this.pushState("casting-to-integer"), this.astGeneric(t, i), this.popState("casting-to-integer"), i;
          }
          castLiteralToFloat(t, i) {
            return this.pushState("casting-to-float"), this.astGeneric(t, i), this.popState("casting-to-float"), i;
          }
          castValueToInteger(t, i) {
            return this.pushState("casting-to-integer"), i.push("int("), this.astGeneric(t, i), i.push(")"), this.popState("casting-to-integer"), i;
          }
          castValueToFloat(t, i) {
            return this.pushState("casting-to-float"), i.push("float("), this.astGeneric(t, i), i.push(")"), this.popState("casting-to-float"), i;
          }
          astIdentifierExpression(t, i) {
            if (t.type !== "Identifier")
              throw this.astErrorOutput("IdentifierExpression - not an Identifier", t);
            let u = this.getType(t), x2 = p.sanitizeName(t.name);
            return t.name === "Infinity" ? i.push("3.402823466e+38") : u === "Boolean" ? this.argumentNames.indexOf(x2) > -1 ? i.push(`bool(user_${x2})`) : i.push(`user_${x2}`) : i.push(`user_${x2}`), i;
          }
          astForStatement(t, i) {
            if (t.type !== "ForStatement")
              throw this.astErrorOutput("Invalid for statement", t);
            let u = [], x2 = [], w = [], m = [], S = null;
            if (t.init) {
              let { declarations: v } = t.init;
              v.length > 1 && (S = false), this.astGeneric(t.init, u);
              for (let h = 0; h < v.length; h++)
                v[h].init && v[h].init.type !== "Literal" && (S = false);
            } else
              S = false;
            if (t.test ? this.astGeneric(t.test, x2) : S = false, t.update ? this.astGeneric(t.update, w) : S = false, t.body && (this.pushState("loop-body"), this.astGeneric(t.body, m), this.popState("loop-body")), S === null && (S = this.isSafe(t.init) && this.isSafe(t.test)), S) {
              let v = u.join(""), h = v[v.length - 1] !== ";";
              i.push(`for (${v}${h ? ";" : ""}${x2.join("")};${w.join("")}){
`), i.push(m.join("")), i.push(`}
`);
            } else {
              let v = this.getInternalVariableName("safeI");
              u.length > 0 && i.push(u.join(""), `
`), i.push(`for (int ${v}=0;${v}<LOOP_MAX;${v}++){
`), x2.length > 0 && i.push(`if (!${x2.join("")}) break;
`), i.push(m.join("")), i.push(`
${w.join("")};`), i.push(`}
`);
            }
            return i;
          }
          astWhileStatement(t, i) {
            if (t.type !== "WhileStatement")
              throw this.astErrorOutput("Invalid while statement", t);
            let u = this.getInternalVariableName("safeI");
            return i.push(`for (int ${u}=0;${u}<LOOP_MAX;${u}++){
`), i.push("if (!"), this.astGeneric(t.test, i), i.push(`) break;
`), this.astGeneric(t.body, i), i.push(`}
`), i;
          }
          astDoWhileStatement(t, i) {
            if (t.type !== "DoWhileStatement")
              throw this.astErrorOutput("Invalid while statement", t);
            let u = this.getInternalVariableName("safeI");
            return i.push(`for (int ${u}=0;${u}<LOOP_MAX;${u}++){
`), this.astGeneric(t.body, i), i.push("if (!"), this.astGeneric(t.test, i), i.push(`) break;
`), i.push(`}
`), i;
          }
          astAssignmentExpression(t, i) {
            if (t.operator === "%=")
              this.astGeneric(t.left, i), i.push("="), i.push("mod("), this.astGeneric(t.left, i), i.push(","), this.astGeneric(t.right, i), i.push(")");
            else if (t.operator === "**=")
              this.astGeneric(t.left, i), i.push("="), i.push("pow("), this.astGeneric(t.left, i), i.push(","), this.astGeneric(t.right, i), i.push(")");
            else {
              let u = this.getType(t.left), x2 = this.getType(t.right);
              return this.astGeneric(t.left, i), i.push(t.operator), u !== "Integer" && x2 === "Integer" ? (i.push("float("), this.astGeneric(t.right, i), i.push(")")) : this.astGeneric(t.right, i), i;
            }
          }
          astBlockStatement(t, i) {
            if (this.isState("loop-body")) {
              this.pushState("block-body");
              for (let u = 0; u < t.body.length; u++)
                this.astGeneric(t.body[u], i);
              this.popState("block-body");
            } else {
              i.push(`{
`);
              for (let u = 0; u < t.body.length; u++)
                this.astGeneric(t.body[u], i);
              i.push(`}
`);
            }
            return i;
          }
          astVariableDeclaration(t, i) {
            let u = t.declarations;
            if (!u || !u[0] || !u[0].init)
              throw this.astErrorOutput("Unexpected expression", t);
            let x2 = [], w = null, m = [], S = [];
            for (let v = 0; v < u.length; v++) {
              let h = u[v], b = h.init, T = this.getDeclaration(h.id), C = this.getType(h.init), V = C;
              V === "LiteralInteger" && (T.suggestedType === "Integer" ? V = "Integer" : V = "Number");
              let c = l[V];
              if (!c)
                throw this.astErrorOutput(`Markup type ${V} not handled`, t);
              let a = [];
              if (C === "Integer" && V === "Integer") {
                if (T.valueType = "Number", v === 0 || w === null)
                  a.push("float ");
                else if (V !== w)
                  throw new Error("Unhandled declaration");
                w = V, a.push(`user_${p.sanitizeName(h.id.name)}=`), a.push("float("), this.astGeneric(b, a), a.push(")");
              } else
                T.valueType = V, v === 0 || w === null ? a.push(`${c} `) : V !== w && (m.push(S.join(",")), S = [], a.push(`${c} `)), w = V, a.push(`user_${p.sanitizeName(h.id.name)}=`), C === "Number" && V === "Integer" ? b.left && b.left.type === "Literal" ? this.astGeneric(b, a) : (a.push("int("), this.astGeneric(b, a), a.push(")")) : C === "LiteralInteger" && V === "Integer" ? this.castLiteralToInteger(b, a) : this.astGeneric(b, a);
              S.push(a.join(""));
            }
            return S.length > 0 && m.push(S.join(",")), x2.push(m.join(";")), i.push(x2.join("")), i.push(";"), i;
          }
          astIfStatement(t, i) {
            return i.push("if ("), this.astGeneric(t.test, i), i.push(")"), t.consequent.type === "BlockStatement" ? this.astGeneric(t.consequent, i) : (i.push(` {
`), this.astGeneric(t.consequent, i), i.push(`
}
`)), t.alternate && (i.push("else "), t.alternate.type === "BlockStatement" || t.alternate.type === "IfStatement" ? this.astGeneric(t.alternate, i) : (i.push(` {
`), this.astGeneric(t.alternate, i), i.push(`
}
`))), i;
          }
          astSwitchStatement(t, i) {
            if (t.type !== "SwitchStatement")
              throw this.astErrorOutput("Invalid switch statement", t);
            let { discriminant: u, cases: x2 } = t, w = this.getType(u), m = `switchDiscriminant${this.astKey(t, "_")}`;
            switch (w) {
              case "Float":
              case "Number":
                i.push(`float ${m} = `), this.astGeneric(u, i), i.push(`;
`);
                break;
              case "Integer":
                i.push(`int ${m} = `), this.astGeneric(u, i), i.push(`;
`);
                break;
            }
            if (x2.length === 1 && !x2[0].test)
              return this.astGeneric(x2[0].consequent, i), i;
            let S = false, v = [], h = false, b = false;
            for (let T = 0; T < x2.length; T++) {
              if (x2[T].test) {
                if (T === 0 || !b ? (b = true, i.push(`if (${m} == `)) : S ? (i.push(`${m} == `), S = false) : i.push(` else if (${m} == `), w === "Integer")
                  switch (this.getType(x2[T].test)) {
                    case "Number":
                    case "Float":
                      this.castValueToInteger(x2[T].test, i);
                      break;
                    case "LiteralInteger":
                      this.castLiteralToInteger(x2[T].test, i);
                      break;
                  }
                else if (w === "Float")
                  switch (this.getType(x2[T].test)) {
                    case "LiteralInteger":
                      this.castLiteralToFloat(x2[T].test, i);
                      break;
                    case "Integer":
                      this.castValueToFloat(x2[T].test, i);
                      break;
                  }
                else
                  throw new Error("unhanlded");
                if (!x2[T].consequent || x2[T].consequent.length === 0) {
                  S = true, i.push(" || ");
                  continue;
                }
                i.push(`) {
`);
              } else if (x2.length > T + 1) {
                h = true, this.astGeneric(x2[T].consequent, v);
                continue;
              } else
                i.push(` else {
`);
              this.astGeneric(x2[T].consequent, i), i.push(`
}`);
            }
            return h && (i.push(" else {"), i.push(v.join("")), i.push("}")), i;
          }
          astThisExpression(t, i) {
            return i.push("this"), i;
          }
          astMemberExpression(t, i) {
            let { property: u, name: x2, signature: w, origin: m, type: S, xProperty: v, yProperty: h, zProperty: b } = this.getMemberExpressionDetails(t);
            switch (w) {
              case "value.thread.value":
              case "this.thread.value":
                if (x2 !== "x" && x2 !== "y" && x2 !== "z")
                  throw this.astErrorOutput("Unexpected expression, expected `this.thread.x`, `this.thread.y`, or `this.thread.z`", t);
                return i.push(`threadId.${x2}`), i;
              case "this.output.value":
                if (this.dynamicOutput)
                  switch (x2) {
                    case "x":
                      this.isState("casting-to-float") ? i.push("float(uOutputDim.x)") : i.push("uOutputDim.x");
                      break;
                    case "y":
                      this.isState("casting-to-float") ? i.push("float(uOutputDim.y)") : i.push("uOutputDim.y");
                      break;
                    case "z":
                      this.isState("casting-to-float") ? i.push("float(uOutputDim.z)") : i.push("uOutputDim.z");
                      break;
                    default:
                      throw this.astErrorOutput("Unexpected expression", t);
                  }
                else
                  switch (x2) {
                    case "x":
                      this.isState("casting-to-integer") ? i.push(this.output[0]) : i.push(this.output[0], ".0");
                      break;
                    case "y":
                      this.isState("casting-to-integer") ? i.push(this.output[1]) : i.push(this.output[1], ".0");
                      break;
                    case "z":
                      this.isState("casting-to-integer") ? i.push(this.output[2]) : i.push(this.output[2], ".0");
                      break;
                    default:
                      throw this.astErrorOutput("Unexpected expression", t);
                  }
                return i;
              case "value":
                throw this.astErrorOutput("Unexpected expression", t);
              case "value[]":
              case "value[][]":
              case "value[][][]":
              case "value[][][][]":
              case "value.value":
                if (m === "Math")
                  return i.push(Math[x2]), i;
                let C = p.sanitizeName(x2);
                switch (u) {
                  case "r":
                    return i.push(`user_${C}.r`), i;
                  case "g":
                    return i.push(`user_${C}.g`), i;
                  case "b":
                    return i.push(`user_${C}.b`), i;
                  case "a":
                    return i.push(`user_${C}.a`), i;
                }
                break;
              case "this.constants.value":
                if (typeof v > "u")
                  switch (S) {
                    case "Array(2)":
                    case "Array(3)":
                    case "Array(4)":
                      return i.push(`constants_${p.sanitizeName(x2)}`), i;
                  }
              case "this.constants.value[]":
              case "this.constants.value[][]":
              case "this.constants.value[][][]":
              case "this.constants.value[][][][]":
                break;
              case "fn()[]":
                return this.astCallExpression(t.object, i), i.push("["), i.push(this.memberExpressionPropertyMarkup(u)), i.push("]"), i;
              case "fn()[][]":
                return this.astCallExpression(t.object.object, i), i.push("["), i.push(this.memberExpressionPropertyMarkup(t.object.property)), i.push("]"), i.push("["), i.push(this.memberExpressionPropertyMarkup(t.property)), i.push("]"), i;
              case "[][]":
                return this.astArrayExpression(t.object, i), i.push("["), i.push(this.memberExpressionPropertyMarkup(u)), i.push("]"), i;
              default:
                throw this.astErrorOutput("Unexpected expression", t);
            }
            if (t.computed === false)
              switch (S) {
                case "Number":
                case "Integer":
                case "Float":
                case "Boolean":
                  return i.push(`${m}_${p.sanitizeName(x2)}`), i;
              }
            let T = `${m}_${p.sanitizeName(x2)}`;
            switch (S) {
              case "Array(2)":
              case "Array(3)":
              case "Array(4)":
                this.astGeneric(t.object, i), i.push("["), i.push(this.memberExpressionPropertyMarkup(v)), i.push("]");
                break;
              case "HTMLImageArray":
                i.push(`getImage3D(${T}, ${T}Size, ${T}Dim, `), this.memberExpressionXYZ(v, h, b, i), i.push(")");
                break;
              case "ArrayTexture(1)":
                i.push(`getFloatFromSampler2D(${T}, ${T}Size, ${T}Dim, `), this.memberExpressionXYZ(v, h, b, i), i.push(")");
                break;
              case "Array1D(2)":
              case "Array2D(2)":
              case "Array3D(2)":
                i.push(`getMemoryOptimizedVec2(${T}, ${T}Size, ${T}Dim, `), this.memberExpressionXYZ(v, h, b, i), i.push(")");
                break;
              case "ArrayTexture(2)":
                i.push(`getVec2FromSampler2D(${T}, ${T}Size, ${T}Dim, `), this.memberExpressionXYZ(v, h, b, i), i.push(")");
                break;
              case "Array1D(3)":
              case "Array2D(3)":
              case "Array3D(3)":
                i.push(`getMemoryOptimizedVec3(${T}, ${T}Size, ${T}Dim, `), this.memberExpressionXYZ(v, h, b, i), i.push(")");
                break;
              case "ArrayTexture(3)":
                i.push(`getVec3FromSampler2D(${T}, ${T}Size, ${T}Dim, `), this.memberExpressionXYZ(v, h, b, i), i.push(")");
                break;
              case "Array1D(4)":
              case "Array2D(4)":
              case "Array3D(4)":
                i.push(`getMemoryOptimizedVec4(${T}, ${T}Size, ${T}Dim, `), this.memberExpressionXYZ(v, h, b, i), i.push(")");
                break;
              case "ArrayTexture(4)":
              case "HTMLCanvas":
              case "HTMLImage":
              case "HTMLVideo":
                i.push(`getVec4FromSampler2D(${T}, ${T}Size, ${T}Dim, `), this.memberExpressionXYZ(v, h, b, i), i.push(")");
                break;
              case "NumberTexture":
              case "Array":
              case "Array2D":
              case "Array3D":
              case "Array4D":
              case "Input":
              case "Number":
              case "Float":
              case "Integer":
                if (this.precision === "single")
                  i.push(`getMemoryOptimized32(${T}, ${T}Size, ${T}Dim, `), this.memberExpressionXYZ(v, h, b, i), i.push(")");
                else {
                  let C = m === "user" ? this.lookupFunctionArgumentBitRatio(this.name, x2) : this.constantBitRatios[x2];
                  switch (C) {
                    case 1:
                      i.push(`get8(${T}, ${T}Size, ${T}Dim, `);
                      break;
                    case 2:
                      i.push(`get16(${T}, ${T}Size, ${T}Dim, `);
                      break;
                    case 4:
                    case 0:
                      i.push(`get32(${T}, ${T}Size, ${T}Dim, `);
                      break;
                    default:
                      throw new Error(`unhandled bit ratio of ${C}`);
                  }
                  this.memberExpressionXYZ(v, h, b, i), i.push(")");
                }
                break;
              case "MemoryOptimizedNumberTexture":
                i.push(`getMemoryOptimized32(${T}, ${T}Size, ${T}Dim, `), this.memberExpressionXYZ(v, h, b, i), i.push(")");
                break;
              case "Matrix(2)":
              case "Matrix(3)":
              case "Matrix(4)":
                i.push(`${T}[${this.memberExpressionPropertyMarkup(h)}]`), h && i.push(`[${this.memberExpressionPropertyMarkup(v)}]`);
                break;
              default:
                throw new Error(`unhandled member expression "${S}"`);
            }
            return i;
          }
          astCallExpression(t, i) {
            if (!t.callee)
              throw this.astErrorOutput("Unknown CallExpression", t);
            let u = null, x2 = this.isAstMathFunction(t);
            if (x2 || t.callee.object && t.callee.object.type === "ThisExpression" ? u = t.callee.property.name : t.callee.type === "SequenceExpression" && t.callee.expressions[0].type === "Literal" && !isNaN(t.callee.expressions[0].raw) ? u = t.callee.expressions[1].property.name : u = t.callee.name, !u)
              throw this.astErrorOutput("Unhandled function, couldn't find name", t);
            switch (u) {
              case "pow":
                u = "_pow";
                break;
              case "round":
                u = "_round";
                break;
            }
            if (this.calledFunctions.indexOf(u) < 0 && this.calledFunctions.push(u), u === "random" && this.plugins && this.plugins.length > 0)
              for (let w = 0; w < this.plugins.length; w++) {
                let m = this.plugins[w];
                if (m.functionMatch === "Math.random()" && m.functionReplace)
                  return i.push(m.functionReplace), i;
              }
            if (this.onFunctionCall && this.onFunctionCall(this.name, u, t.arguments), i.push(u), i.push("("), x2)
              for (let w = 0; w < t.arguments.length; ++w) {
                let m = t.arguments[w], S = this.getType(m);
                switch (w > 0 && i.push(", "), S) {
                  case "Integer":
                    this.castValueToFloat(m, i);
                    break;
                  default:
                    this.astGeneric(m, i);
                    break;
                }
              }
            else {
              let w = this.lookupFunctionArgumentTypes(u) || [];
              for (let m = 0; m < t.arguments.length; ++m) {
                let S = t.arguments[m], v = w[m];
                m > 0 && i.push(", ");
                let h = this.getType(S);
                switch (v || (this.triggerImplyArgumentType(u, m, h, this), v = h), h) {
                  case "Boolean":
                    this.astGeneric(S, i);
                    continue;
                  case "Number":
                  case "Float":
                    if (v === "Integer") {
                      i.push("int("), this.astGeneric(S, i), i.push(")");
                      continue;
                    } else if (v === "Number" || v === "Float") {
                      this.astGeneric(S, i);
                      continue;
                    } else if (v === "LiteralInteger") {
                      this.castLiteralToFloat(S, i);
                      continue;
                    }
                    break;
                  case "Integer":
                    if (v === "Number" || v === "Float") {
                      i.push("float("), this.astGeneric(S, i), i.push(")");
                      continue;
                    } else if (v === "Integer") {
                      this.astGeneric(S, i);
                      continue;
                    }
                    break;
                  case "LiteralInteger":
                    if (v === "Integer") {
                      this.castLiteralToInteger(S, i);
                      continue;
                    } else if (v === "Number" || v === "Float") {
                      this.castLiteralToFloat(S, i);
                      continue;
                    } else if (v === "LiteralInteger") {
                      this.astGeneric(S, i);
                      continue;
                    }
                    break;
                  case "Array(2)":
                  case "Array(3)":
                  case "Array(4)":
                    if (v === h) {
                      if (S.type === "Identifier")
                        i.push(`user_${p.sanitizeName(S.name)}`);
                      else if (S.type === "ArrayExpression" || S.type === "MemberExpression" || S.type === "CallExpression")
                        this.astGeneric(S, i);
                      else
                        throw this.astErrorOutput(`Unhandled argument type ${S.type}`, t);
                      continue;
                    }
                    break;
                  case "HTMLCanvas":
                  case "HTMLImage":
                  case "HTMLImageArray":
                  case "HTMLVideo":
                  case "ArrayTexture(1)":
                  case "ArrayTexture(2)":
                  case "ArrayTexture(3)":
                  case "ArrayTexture(4)":
                  case "Array":
                  case "Input":
                    if (v === h) {
                      if (S.type !== "Identifier")
                        throw this.astErrorOutput(`Unhandled argument type ${S.type}`, t);
                      this.triggerImplyArgumentBitRatio(this.name, S.name, u, m);
                      let b = p.sanitizeName(S.name);
                      i.push(`user_${b},user_${b}Size,user_${b}Dim`);
                      continue;
                    }
                    break;
                }
                throw this.astErrorOutput(`Unhandled argument combination of ${h} and ${v} for argument named "${S.name}"`, t);
              }
            }
            return i.push(")"), i;
          }
          astArrayExpression(t, i) {
            let u = this.getType(t), x2 = t.elements.length;
            switch (u) {
              case "Matrix(2)":
              case "Matrix(3)":
              case "Matrix(4)":
                i.push(`mat${x2}(`);
                break;
              default:
                i.push(`vec${x2}(`);
            }
            for (let w = 0; w < x2; ++w) {
              w > 0 && i.push(", ");
              let m = t.elements[w];
              this.astGeneric(m, i);
            }
            return i.push(")"), i;
          }
          memberExpressionXYZ(t, i, u, x2) {
            return u ? x2.push(this.memberExpressionPropertyMarkup(u), ", ") : x2.push("0, "), i ? x2.push(this.memberExpressionPropertyMarkup(i), ", ") : x2.push("0, "), x2.push(this.memberExpressionPropertyMarkup(t)), x2;
          }
          memberExpressionPropertyMarkup(t) {
            if (!t)
              throw new Error("Property not set");
            let i = this.getType(t), u = [];
            switch (i) {
              case "Number":
              case "Float":
                this.castValueToInteger(t, u);
                break;
              case "LiteralInteger":
                this.castLiteralToInteger(t, u);
                break;
              default:
                this.astGeneric(t, u);
            }
            return u.join("");
          }
        }
        let l = { Array: "sampler2D", "Array(2)": "vec2", "Array(3)": "vec3", "Array(4)": "vec4", "Matrix(2)": "mat2", "Matrix(3)": "mat3", "Matrix(4)": "mat4", Array2D: "sampler2D", Array3D: "sampler2D", Boolean: "bool", Float: "float", Input: "sampler2D", Integer: "int", Number: "float", LiteralInteger: "float", NumberTexture: "sampler2D", MemoryOptimizedNumberTexture: "sampler2D", "ArrayTexture(1)": "sampler2D", "ArrayTexture(2)": "sampler2D", "ArrayTexture(3)": "sampler2D", "ArrayTexture(4)": "sampler2D", HTMLVideo: "sampler2D", HTMLCanvas: "sampler2D", HTMLImage: "sampler2D", HTMLImageArray: "sampler2DArray" }, n = { "===": "==", "!==": "!=" };
        y.exports = { WebGLFunctionNode: f };
      }, { "../../utils": 114, "../function-node": 10 }], 39: [function(o, y, E) {
        let { WebGLKernelValueBoolean: p } = o("./kernel-value/boolean"), { WebGLKernelValueFloat: g } = o("./kernel-value/float"), { WebGLKernelValueInteger: f } = o("./kernel-value/integer"), { WebGLKernelValueHTMLImage: l } = o("./kernel-value/html-image"), { WebGLKernelValueDynamicHTMLImage: n } = o("./kernel-value/dynamic-html-image"), { WebGLKernelValueHTMLVideo: s } = o("./kernel-value/html-video"), { WebGLKernelValueDynamicHTMLVideo: t } = o("./kernel-value/dynamic-html-video"), { WebGLKernelValueSingleInput: i } = o("./kernel-value/single-input"), { WebGLKernelValueDynamicSingleInput: u } = o("./kernel-value/dynamic-single-input"), { WebGLKernelValueUnsignedInput: x2 } = o("./kernel-value/unsigned-input"), { WebGLKernelValueDynamicUnsignedInput: w } = o("./kernel-value/dynamic-unsigned-input"), { WebGLKernelValueMemoryOptimizedNumberTexture: m } = o("./kernel-value/memory-optimized-number-texture"), { WebGLKernelValueDynamicMemoryOptimizedNumberTexture: S } = o("./kernel-value/dynamic-memory-optimized-number-texture"), { WebGLKernelValueNumberTexture: v } = o("./kernel-value/number-texture"), { WebGLKernelValueDynamicNumberTexture: h } = o("./kernel-value/dynamic-number-texture"), { WebGLKernelValueSingleArray: b } = o("./kernel-value/single-array"), { WebGLKernelValueDynamicSingleArray: T } = o("./kernel-value/dynamic-single-array"), { WebGLKernelValueSingleArray1DI: C } = o("./kernel-value/single-array1d-i"), { WebGLKernelValueDynamicSingleArray1DI: V } = o("./kernel-value/dynamic-single-array1d-i"), { WebGLKernelValueSingleArray2DI: c } = o("./kernel-value/single-array2d-i"), { WebGLKernelValueDynamicSingleArray2DI: a } = o("./kernel-value/dynamic-single-array2d-i"), { WebGLKernelValueSingleArray3DI: k } = o("./kernel-value/single-array3d-i"), { WebGLKernelValueDynamicSingleArray3DI: A } = o("./kernel-value/dynamic-single-array3d-i"), { WebGLKernelValueSingleArray2: N } = o("./kernel-value/single-array2"), { WebGLKernelValueSingleArray3: F } = o("./kernel-value/single-array3"), { WebGLKernelValueSingleArray4: R } = o("./kernel-value/single-array4"), { WebGLKernelValueUnsignedArray: K } = o("./kernel-value/unsigned-array"), { WebGLKernelValueDynamicUnsignedArray: O } = o("./kernel-value/dynamic-unsigned-array"), X = { unsigned: { dynamic: { Boolean: p, Integer: f, Float: g, Array: O, "Array(2)": false, "Array(3)": false, "Array(4)": false, "Array1D(2)": false, "Array1D(3)": false, "Array1D(4)": false, "Array2D(2)": false, "Array2D(3)": false, "Array2D(4)": false, "Array3D(2)": false, "Array3D(3)": false, "Array3D(4)": false, Input: w, NumberTexture: h, "ArrayTexture(1)": h, "ArrayTexture(2)": h, "ArrayTexture(3)": h, "ArrayTexture(4)": h, MemoryOptimizedNumberTexture: S, HTMLCanvas: n, HTMLImage: n, HTMLImageArray: false, HTMLVideo: t }, static: { Boolean: p, Float: g, Integer: f, Array: K, "Array(2)": false, "Array(3)": false, "Array(4)": false, "Array1D(2)": false, "Array1D(3)": false, "Array1D(4)": false, "Array2D(2)": false, "Array2D(3)": false, "Array2D(4)": false, "Array3D(2)": false, "Array3D(3)": false, "Array3D(4)": false, Input: x2, NumberTexture: v, "ArrayTexture(1)": v, "ArrayTexture(2)": v, "ArrayTexture(3)": v, "ArrayTexture(4)": v, MemoryOptimizedNumberTexture: m, HTMLCanvas: l, HTMLImage: l, HTMLImageArray: false, HTMLVideo: s } }, single: { dynamic: { Boolean: p, Integer: f, Float: g, Array: T, "Array(2)": N, "Array(3)": F, "Array(4)": R, "Array1D(2)": V, "Array1D(3)": V, "Array1D(4)": V, "Array2D(2)": a, "Array2D(3)": a, "Array2D(4)": a, "Array3D(2)": A, "Array3D(3)": A, "Array3D(4)": A, Input: u, NumberTexture: h, "ArrayTexture(1)": h, "ArrayTexture(2)": h, "ArrayTexture(3)": h, "ArrayTexture(4)": h, MemoryOptimizedNumberTexture: S, HTMLCanvas: n, HTMLImage: n, HTMLImageArray: false, HTMLVideo: t }, static: { Boolean: p, Float: g, Integer: f, Array: b, "Array(2)": N, "Array(3)": F, "Array(4)": R, "Array1D(2)": C, "Array1D(3)": C, "Array1D(4)": C, "Array2D(2)": c, "Array2D(3)": c, "Array2D(4)": c, "Array3D(2)": k, "Array3D(3)": k, "Array3D(4)": k, Input: i, NumberTexture: v, "ArrayTexture(1)": v, "ArrayTexture(2)": v, "ArrayTexture(3)": v, "ArrayTexture(4)": v, MemoryOptimizedNumberTexture: m, HTMLCanvas: l, HTMLImage: l, HTMLImageArray: false, HTMLVideo: s } } };
        function B(P, Y, J, q) {
          if (!P)
            throw new Error("type missing");
          if (!Y)
            throw new Error("dynamic missing");
          if (!J)
            throw new Error("precision missing");
          q.type && (P = q.type);
          let j = X[J][Y];
          if (j[P] === false)
            return null;
          if (j[P] === void 0)
            throw new Error(`Could not find a KernelValue for ${P}`);
          return j[P];
        }
        y.exports = { lookupKernelValueType: B, kernelValueMaps: X };
      }, { "./kernel-value/boolean": 41, "./kernel-value/dynamic-html-image": 42, "./kernel-value/dynamic-html-video": 43, "./kernel-value/dynamic-memory-optimized-number-texture": 44, "./kernel-value/dynamic-number-texture": 45, "./kernel-value/dynamic-single-array": 46, "./kernel-value/dynamic-single-array1d-i": 47, "./kernel-value/dynamic-single-array2d-i": 48, "./kernel-value/dynamic-single-array3d-i": 49, "./kernel-value/dynamic-single-input": 50, "./kernel-value/dynamic-unsigned-array": 51, "./kernel-value/dynamic-unsigned-input": 52, "./kernel-value/float": 53, "./kernel-value/html-image": 54, "./kernel-value/html-video": 55, "./kernel-value/integer": 57, "./kernel-value/memory-optimized-number-texture": 58, "./kernel-value/number-texture": 59, "./kernel-value/single-array": 60, "./kernel-value/single-array1d-i": 61, "./kernel-value/single-array2": 62, "./kernel-value/single-array2d-i": 63, "./kernel-value/single-array3": 64, "./kernel-value/single-array3d-i": 65, "./kernel-value/single-array4": 66, "./kernel-value/single-input": 67, "./kernel-value/unsigned-array": 68, "./kernel-value/unsigned-input": 69 }], 40: [function(o, y, E) {
        let { WebGLKernelValue: p } = o("./index"), { Input: g } = o("../../../input");
        class f extends p {
          checkSize(n, s) {
            if (!this.kernel.validate)
              return;
            let { maxTextureSize: t } = this.kernel.constructor.features;
            if (n > t || s > t)
              throw n > s ? new Error(`Argument texture width of ${n} larger than maximum size of ${t} for your GPU`) : n < s ? new Error(`Argument texture height of ${s} larger than maximum size of ${t} for your GPU`) : new Error(`Argument texture height and width of ${s} larger than maximum size of ${t} for your GPU`);
          }
          setup() {
            this.requestTexture(), this.setupTexture(), this.defineTexture();
          }
          requestTexture() {
            this.texture = this.onRequestTexture();
          }
          defineTexture() {
            let { context: n } = this;
            n.activeTexture(this.contextHandle), n.bindTexture(n.TEXTURE_2D, this.texture), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_WRAP_S, n.CLAMP_TO_EDGE), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_WRAP_T, n.CLAMP_TO_EDGE), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_MIN_FILTER, n.NEAREST), n.texParameteri(n.TEXTURE_2D, n.TEXTURE_MAG_FILTER, n.NEAREST);
          }
          setupTexture() {
            this.contextHandle = this.onRequestContextHandle(), this.index = this.onRequestIndex(), this.dimensionsId = this.id + "Dim", this.sizeId = this.id + "Size";
          }
          getBitRatio(n) {
            if (Array.isArray(n[0]))
              return this.getBitRatio(n[0]);
            if (n.constructor === g)
              return this.getBitRatio(n.value);
            switch (n.constructor) {
              case Uint8ClampedArray:
              case Uint8Array:
              case Int8Array:
                return 1;
              case Uint16Array:
              case Int16Array:
                return 2;
              case Float32Array:
              case Int32Array:
              default:
                return 4;
            }
          }
          destroy() {
            this.prevArg && this.prevArg.delete(), this.context.deleteTexture(this.texture);
          }
        }
        y.exports = { WebGLKernelArray: f };
      }, { "../../../input": 110, "./index": 56 }], 41: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { WebGLKernelValue: g } = o("./index");
        class f extends g {
          constructor(n, s) {
            super(n, s), this.uploadValue = n;
          }
          getSource(n) {
            return this.origin === "constants" ? `const bool ${this.id} = ${n};
` : `uniform bool ${this.id};
`;
          }
          getStringValueHandler() {
            return `const uploadValue_${this.name} = ${this.varName};
`;
          }
          updateValue(n) {
            this.origin !== "constants" && this.kernel.setUniform1i(this.id, this.uploadValue = n);
          }
        }
        y.exports = { WebGLKernelValueBoolean: f };
      }, { "../../../utils": 114, "./index": 56 }], 42: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { WebGLKernelValueHTMLImage: g } = o("./html-image");
        class f extends g {
          getSource() {
            return p.linesToString([`uniform sampler2D ${this.id}`, `uniform ivec2 ${this.sizeId}`, `uniform ivec3 ${this.dimensionsId}`]);
          }
          updateValue(n) {
            let { width: s, height: t } = n;
            this.checkSize(s, t), this.dimensions = [s, t, 1], this.textureSize = [s, t], this.kernel.setUniform3iv(this.dimensionsId, this.dimensions), this.kernel.setUniform2iv(this.sizeId, this.textureSize), super.updateValue(n);
          }
        }
        y.exports = { WebGLKernelValueDynamicHTMLImage: f };
      }, { "../../../utils": 114, "./html-image": 54 }], 43: [function(o, y, E) {
        let { WebGLKernelValueDynamicHTMLImage: p } = o("./dynamic-html-image");
        class g extends p {
        }
        y.exports = { WebGLKernelValueDynamicHTMLVideo: g };
      }, { "./dynamic-html-image": 42 }], 44: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { WebGLKernelValueMemoryOptimizedNumberTexture: g } = o("./memory-optimized-number-texture");
        class f extends g {
          getSource() {
            return p.linesToString([`uniform sampler2D ${this.id}`, `uniform ivec2 ${this.sizeId}`, `uniform ivec3 ${this.dimensionsId}`]);
          }
          updateValue(n) {
            this.dimensions = n.dimensions, this.checkSize(n.size[0], n.size[1]), this.textureSize = n.size, this.kernel.setUniform3iv(this.dimensionsId, this.dimensions), this.kernel.setUniform2iv(this.sizeId, this.textureSize), super.updateValue(n);
          }
        }
        y.exports = { WebGLKernelValueDynamicMemoryOptimizedNumberTexture: f };
      }, { "../../../utils": 114, "./memory-optimized-number-texture": 58 }], 45: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { WebGLKernelValueNumberTexture: g } = o("./number-texture");
        class f extends g {
          getSource() {
            return p.linesToString([`uniform sampler2D ${this.id}`, `uniform ivec2 ${this.sizeId}`, `uniform ivec3 ${this.dimensionsId}`]);
          }
          updateValue(n) {
            this.dimensions = n.dimensions, this.checkSize(n.size[0], n.size[1]), this.textureSize = n.size, this.kernel.setUniform3iv(this.dimensionsId, this.dimensions), this.kernel.setUniform2iv(this.sizeId, this.textureSize), super.updateValue(n);
          }
        }
        y.exports = { WebGLKernelValueDynamicNumberTexture: f };
      }, { "../../../utils": 114, "./number-texture": 59 }], 46: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { WebGLKernelValueSingleArray: g } = o("./single-array");
        class f extends g {
          getSource() {
            return p.linesToString([`uniform sampler2D ${this.id}`, `uniform ivec2 ${this.sizeId}`, `uniform ivec3 ${this.dimensionsId}`]);
          }
          updateValue(n) {
            this.dimensions = p.getDimensions(n, true), this.textureSize = p.getMemoryOptimizedFloatTextureSize(this.dimensions, this.bitRatio), this.uploadArrayLength = this.textureSize[0] * this.textureSize[1] * this.bitRatio, this.checkSize(this.textureSize[0], this.textureSize[1]), this.uploadValue = new Float32Array(this.uploadArrayLength), this.kernel.setUniform3iv(this.dimensionsId, this.dimensions), this.kernel.setUniform2iv(this.sizeId, this.textureSize), super.updateValue(n);
          }
        }
        y.exports = { WebGLKernelValueDynamicSingleArray: f };
      }, { "../../../utils": 114, "./single-array": 60 }], 47: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { WebGLKernelValueSingleArray1DI: g } = o("./single-array1d-i");
        class f extends g {
          getSource() {
            return p.linesToString([`uniform sampler2D ${this.id}`, `uniform ivec2 ${this.sizeId}`, `uniform ivec3 ${this.dimensionsId}`]);
          }
          updateValue(n) {
            this.setShape(n), this.kernel.setUniform3iv(this.dimensionsId, this.dimensions), this.kernel.setUniform2iv(this.sizeId, this.textureSize), super.updateValue(n);
          }
        }
        y.exports = { WebGLKernelValueDynamicSingleArray1DI: f };
      }, { "../../../utils": 114, "./single-array1d-i": 61 }], 48: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { WebGLKernelValueSingleArray2DI: g } = o("./single-array2d-i");
        class f extends g {
          getSource() {
            return p.linesToString([`uniform sampler2D ${this.id}`, `uniform ivec2 ${this.sizeId}`, `uniform ivec3 ${this.dimensionsId}`]);
          }
          updateValue(n) {
            this.setShape(n), this.kernel.setUniform3iv(this.dimensionsId, this.dimensions), this.kernel.setUniform2iv(this.sizeId, this.textureSize), super.updateValue(n);
          }
        }
        y.exports = { WebGLKernelValueDynamicSingleArray2DI: f };
      }, { "../../../utils": 114, "./single-array2d-i": 63 }], 49: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { WebGLKernelValueSingleArray3DI: g } = o("./single-array3d-i");
        class f extends g {
          getSource() {
            return p.linesToString([`uniform sampler2D ${this.id}`, `uniform ivec2 ${this.sizeId}`, `uniform ivec3 ${this.dimensionsId}`]);
          }
          updateValue(n) {
            this.setShape(n), this.kernel.setUniform3iv(this.dimensionsId, this.dimensions), this.kernel.setUniform2iv(this.sizeId, this.textureSize), super.updateValue(n);
          }
        }
        y.exports = { WebGLKernelValueDynamicSingleArray3DI: f };
      }, { "../../../utils": 114, "./single-array3d-i": 65 }], 50: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { WebGLKernelValueSingleInput: g } = o("./single-input");
        class f extends g {
          getSource() {
            return p.linesToString([`uniform sampler2D ${this.id}`, `uniform ivec2 ${this.sizeId}`, `uniform ivec3 ${this.dimensionsId}`]);
          }
          updateValue(n) {
            let [s, t, i] = n.size;
            this.dimensions = new Int32Array([s || 1, t || 1, i || 1]), this.textureSize = p.getMemoryOptimizedFloatTextureSize(this.dimensions, this.bitRatio), this.uploadArrayLength = this.textureSize[0] * this.textureSize[1] * this.bitRatio, this.checkSize(this.textureSize[0], this.textureSize[1]), this.uploadValue = new Float32Array(this.uploadArrayLength), this.kernel.setUniform3iv(this.dimensionsId, this.dimensions), this.kernel.setUniform2iv(this.sizeId, this.textureSize), super.updateValue(n);
          }
        }
        y.exports = { WebGLKernelValueDynamicSingleInput: f };
      }, { "../../../utils": 114, "./single-input": 67 }], 51: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { WebGLKernelValueUnsignedArray: g } = o("./unsigned-array");
        class f extends g {
          getSource() {
            return p.linesToString([`uniform sampler2D ${this.id}`, `uniform ivec2 ${this.sizeId}`, `uniform ivec3 ${this.dimensionsId}`]);
          }
          updateValue(n) {
            this.dimensions = p.getDimensions(n, true), this.textureSize = p.getMemoryOptimizedPackedTextureSize(this.dimensions, this.bitRatio), this.uploadArrayLength = this.textureSize[0] * this.textureSize[1] * (4 / this.bitRatio), this.checkSize(this.textureSize[0], this.textureSize[1]);
            let s = this.getTransferArrayType(n);
            this.preUploadValue = new s(this.uploadArrayLength), this.uploadValue = new Uint8Array(this.preUploadValue.buffer), this.kernel.setUniform3iv(this.dimensionsId, this.dimensions), this.kernel.setUniform2iv(this.sizeId, this.textureSize), super.updateValue(n);
          }
        }
        y.exports = { WebGLKernelValueDynamicUnsignedArray: f };
      }, { "../../../utils": 114, "./unsigned-array": 68 }], 52: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { WebGLKernelValueUnsignedInput: g } = o("./unsigned-input");
        class f extends g {
          getSource() {
            return p.linesToString([`uniform sampler2D ${this.id}`, `uniform ivec2 ${this.sizeId}`, `uniform ivec3 ${this.dimensionsId}`]);
          }
          updateValue(n) {
            let [s, t, i] = n.size;
            this.dimensions = new Int32Array([s || 1, t || 1, i || 1]), this.textureSize = p.getMemoryOptimizedPackedTextureSize(this.dimensions, this.bitRatio), this.uploadArrayLength = this.textureSize[0] * this.textureSize[1] * (4 / this.bitRatio), this.checkSize(this.textureSize[0], this.textureSize[1]);
            let u = this.getTransferArrayType(n.value);
            this.preUploadValue = new u(this.uploadArrayLength), this.uploadValue = new Uint8Array(this.preUploadValue.buffer), this.kernel.setUniform3iv(this.dimensionsId, this.dimensions), this.kernel.setUniform2iv(this.sizeId, this.textureSize), super.updateValue(n);
          }
        }
        y.exports = { WebGLKernelValueDynamicUnsignedInput: f };
      }, { "../../../utils": 114, "./unsigned-input": 69 }], 53: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { WebGLKernelValue: g } = o("./index");
        class f extends g {
          constructor(n, s) {
            super(n, s), this.uploadValue = n;
          }
          getStringValueHandler() {
            return `const uploadValue_${this.name} = ${this.varName};
`;
          }
          getSource(n) {
            return this.origin === "constants" ? Number.isInteger(n) ? `const float ${this.id} = ${n}.0;
` : `const float ${this.id} = ${n};
` : `uniform float ${this.id};
`;
          }
          updateValue(n) {
            this.origin !== "constants" && this.kernel.setUniform1f(this.id, this.uploadValue = n);
          }
        }
        y.exports = { WebGLKernelValueFloat: f };
      }, { "../../../utils": 114, "./index": 56 }], 54: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { WebGLKernelArray: g } = o("./array");
        class f extends g {
          constructor(n, s) {
            super(n, s);
            let { width: t, height: i } = n;
            this.checkSize(t, i), this.dimensions = [t, i, 1], this.textureSize = [t, i], this.uploadValue = n;
          }
          getStringValueHandler() {
            return `const uploadValue_${this.name} = ${this.varName};
`;
          }
          getSource() {
            return p.linesToString([`uniform sampler2D ${this.id}`, `ivec2 ${this.sizeId} = ivec2(${this.textureSize[0]}, ${this.textureSize[1]})`, `ivec3 ${this.dimensionsId} = ivec3(${this.dimensions[0]}, ${this.dimensions[1]}, ${this.dimensions[2]})`]);
          }
          updateValue(n) {
            if (n.constructor !== this.initialValueConstructor) {
              this.onUpdateValueMismatch(n.constructor);
              return;
            }
            let { context: s } = this;
            s.activeTexture(this.contextHandle), s.bindTexture(s.TEXTURE_2D, this.texture), s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL, true), s.texImage2D(s.TEXTURE_2D, 0, s.RGBA, s.RGBA, s.UNSIGNED_BYTE, this.uploadValue = n), this.kernel.setUniform1i(this.id, this.index);
          }
        }
        y.exports = { WebGLKernelValueHTMLImage: f };
      }, { "../../../utils": 114, "./array": 40 }], 55: [function(o, y, E) {
        let { WebGLKernelValueHTMLImage: p } = o("./html-image");
        class g extends p {
        }
        y.exports = { WebGLKernelValueHTMLVideo: g };
      }, { "./html-image": 54 }], 56: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { KernelValue: g } = o("../../kernel-value");
        class f extends g {
          constructor(n, s) {
            super(n, s), this.dimensionsId = null, this.sizeId = null, this.initialValueConstructor = n.constructor, this.onRequestTexture = s.onRequestTexture, this.onRequestIndex = s.onRequestIndex, this.uploadValue = null, this.textureSize = null, this.bitRatio = null, this.prevArg = null;
          }
          get id() {
            return `${this.origin}_${p.sanitizeName(this.name)}`;
          }
          setup() {
          }
          getTransferArrayType(n) {
            if (Array.isArray(n[0]))
              return this.getTransferArrayType(n[0]);
            switch (n.constructor) {
              case Array:
              case Int32Array:
              case Int16Array:
              case Int8Array:
                return Float32Array;
              case Uint8ClampedArray:
              case Uint8Array:
              case Uint16Array:
              case Uint32Array:
              case Float32Array:
              case Float64Array:
                return n.constructor;
            }
            return console.warn("Unfamiliar constructor type.  Will go ahead and use, but likley this may result in a transfer of zeros"), n.constructor;
          }
          getStringValueHandler() {
            throw new Error(`"getStringValueHandler" not implemented on ${this.constructor.name}`);
          }
          getVariablePrecisionString() {
            return this.kernel.getVariablePrecisionString(this.textureSize || void 0, this.tactic || void 0);
          }
          destroy() {
          }
        }
        y.exports = { WebGLKernelValue: f };
      }, { "../../../utils": 114, "../../kernel-value": 35 }], 57: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { WebGLKernelValue: g } = o("./index");
        class f extends g {
          constructor(n, s) {
            super(n, s), this.uploadValue = n;
          }
          getStringValueHandler() {
            return `const uploadValue_${this.name} = ${this.varName};
`;
          }
          getSource(n) {
            return this.origin === "constants" ? `const int ${this.id} = ${parseInt(n)};
` : `uniform int ${this.id};
`;
          }
          updateValue(n) {
            this.origin !== "constants" && this.kernel.setUniform1i(this.id, this.uploadValue = n);
          }
        }
        y.exports = { WebGLKernelValueInteger: f };
      }, { "../../../utils": 114, "./index": 56 }], 58: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { WebGLKernelArray: g } = o("./array"), f = "Source and destination textures are the same.  Use immutable = true and manually cleanup kernel output texture memory with texture.delete()";
        class l extends g {
          constructor(s, t) {
            super(s, t);
            let [i, u] = s.size;
            this.checkSize(i, u), this.dimensions = s.dimensions, this.textureSize = s.size, this.uploadValue = s.texture, this.forceUploadEachRun = true;
          }
          setup() {
            this.setupTexture();
          }
          getStringValueHandler() {
            return `const uploadValue_${this.name} = ${this.varName}.texture;
`;
          }
          getSource() {
            return p.linesToString([`uniform sampler2D ${this.id}`, `ivec2 ${this.sizeId} = ivec2(${this.textureSize[0]}, ${this.textureSize[1]})`, `ivec3 ${this.dimensionsId} = ivec3(${this.dimensions[0]}, ${this.dimensions[1]}, ${this.dimensions[2]})`]);
          }
          updateValue(s) {
            if (s.constructor !== this.initialValueConstructor) {
              this.onUpdateValueMismatch(s.constructor);
              return;
            }
            if (this.checkContext && s.context !== this.context)
              throw new Error(`Value ${this.name} (${this.type}) must be from same context`);
            let { kernel: t, context: i } = this;
            if (t.pipeline)
              if (t.immutable)
                t.updateTextureArgumentRefs(this, s);
              else {
                if (t.texture.texture === s.texture)
                  throw new Error(f);
                if (t.mappedTextures) {
                  let { mappedTextures: u } = t;
                  for (let x2 = 0; x2 < u.length; x2++)
                    if (u[x2].texture === s.texture)
                      throw new Error(f);
                }
              }
            i.activeTexture(this.contextHandle), i.bindTexture(i.TEXTURE_2D, this.uploadValue = s.texture), this.kernel.setUniform1i(this.id, this.index);
          }
        }
        y.exports = { WebGLKernelValueMemoryOptimizedNumberTexture: l, sameError: f };
      }, { "../../../utils": 114, "./array": 40 }], 59: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { WebGLKernelArray: g } = o("./array"), { sameError: f } = o("./memory-optimized-number-texture");
        class l extends g {
          constructor(s, t) {
            super(s, t);
            let [i, u] = s.size;
            this.checkSize(i, u);
            let { size: x2, dimensions: w } = s;
            this.bitRatio = this.getBitRatio(s), this.dimensions = w, this.textureSize = x2, this.uploadValue = s.texture, this.forceUploadEachRun = true;
          }
          setup() {
            this.setupTexture();
          }
          getStringValueHandler() {
            return `const uploadValue_${this.name} = ${this.varName}.texture;
`;
          }
          getSource() {
            return p.linesToString([`uniform sampler2D ${this.id}`, `ivec2 ${this.sizeId} = ivec2(${this.textureSize[0]}, ${this.textureSize[1]})`, `ivec3 ${this.dimensionsId} = ivec3(${this.dimensions[0]}, ${this.dimensions[1]}, ${this.dimensions[2]})`]);
          }
          updateValue(s) {
            if (s.constructor !== this.initialValueConstructor) {
              this.onUpdateValueMismatch(s.constructor);
              return;
            }
            if (this.checkContext && s.context !== this.context)
              throw new Error(`Value ${this.name} (${this.type}) must be from same context`);
            let { kernel: t, context: i } = this;
            if (t.pipeline)
              if (t.immutable)
                t.updateTextureArgumentRefs(this, s);
              else {
                if (t.texture.texture === s.texture)
                  throw new Error(f);
                if (t.mappedTextures) {
                  let { mappedTextures: u } = t;
                  for (let x2 = 0; x2 < u.length; x2++)
                    if (u[x2].texture === s.texture)
                      throw new Error(f);
                }
              }
            i.activeTexture(this.contextHandle), i.bindTexture(i.TEXTURE_2D, this.uploadValue = s.texture), this.kernel.setUniform1i(this.id, this.index);
          }
        }
        y.exports = { WebGLKernelValueNumberTexture: l };
      }, { "../../../utils": 114, "./array": 40, "./memory-optimized-number-texture": 58 }], 60: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { WebGLKernelArray: g } = o("./array");
        class f extends g {
          constructor(n, s) {
            super(n, s), this.bitRatio = 4, this.dimensions = p.getDimensions(n, true), this.textureSize = p.getMemoryOptimizedFloatTextureSize(this.dimensions, this.bitRatio), this.uploadArrayLength = this.textureSize[0] * this.textureSize[1] * this.bitRatio, this.checkSize(this.textureSize[0], this.textureSize[1]), this.uploadValue = new Float32Array(this.uploadArrayLength);
          }
          getStringValueHandler() {
            return p.linesToString([`const uploadValue_${this.name} = new Float32Array(${this.uploadArrayLength})`, `flattenTo(${this.varName}, uploadValue_${this.name})`]);
          }
          getSource() {
            return p.linesToString([`uniform sampler2D ${this.id}`, `ivec2 ${this.sizeId} = ivec2(${this.textureSize[0]}, ${this.textureSize[1]})`, `ivec3 ${this.dimensionsId} = ivec3(${this.dimensions[0]}, ${this.dimensions[1]}, ${this.dimensions[2]})`]);
          }
          updateValue(n) {
            if (n.constructor !== this.initialValueConstructor) {
              this.onUpdateValueMismatch(n.constructor);
              return;
            }
            let { context: s } = this;
            p.flattenTo(n, this.uploadValue), s.activeTexture(this.contextHandle), s.bindTexture(s.TEXTURE_2D, this.texture), s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL, false), s.texImage2D(s.TEXTURE_2D, 0, s.RGBA, this.textureSize[0], this.textureSize[1], 0, s.RGBA, s.FLOAT, this.uploadValue), this.kernel.setUniform1i(this.id, this.index);
          }
        }
        y.exports = { WebGLKernelValueSingleArray: f };
      }, { "../../../utils": 114, "./array": 40 }], 61: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { WebGLKernelArray: g } = o("./array");
        class f extends g {
          constructor(n, s) {
            super(n, s), this.bitRatio = 4, this.setShape(n);
          }
          setShape(n) {
            let s = p.getDimensions(n, true);
            this.textureSize = p.getMemoryOptimizedFloatTextureSize(s, this.bitRatio), this.dimensions = new Int32Array([s[1], 1, 1]), this.uploadArrayLength = this.textureSize[0] * this.textureSize[1] * this.bitRatio, this.checkSize(this.textureSize[0], this.textureSize[1]), this.uploadValue = new Float32Array(this.uploadArrayLength);
          }
          getStringValueHandler() {
            return p.linesToString([`const uploadValue_${this.name} = new Float32Array(${this.uploadArrayLength})`, `flattenTo(${this.varName}, uploadValue_${this.name})`]);
          }
          getSource() {
            return p.linesToString([`uniform sampler2D ${this.id}`, `ivec2 ${this.sizeId} = ivec2(${this.textureSize[0]}, ${this.textureSize[1]})`, `ivec3 ${this.dimensionsId} = ivec3(${this.dimensions[0]}, ${this.dimensions[1]}, ${this.dimensions[2]})`]);
          }
          updateValue(n) {
            if (n.constructor !== this.initialValueConstructor) {
              this.onUpdateValueMismatch(n.constructor);
              return;
            }
            let { context: s } = this;
            p.flatten2dArrayTo(n, this.uploadValue), s.activeTexture(this.contextHandle), s.bindTexture(s.TEXTURE_2D, this.texture), s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL, false), s.texImage2D(s.TEXTURE_2D, 0, s.RGBA, this.textureSize[0], this.textureSize[1], 0, s.RGBA, s.FLOAT, this.uploadValue), this.kernel.setUniform1i(this.id, this.index);
          }
        }
        y.exports = { WebGLKernelValueSingleArray1DI: f };
      }, { "../../../utils": 114, "./array": 40 }], 62: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { WebGLKernelValue: g } = o("./index");
        class f extends g {
          constructor(n, s) {
            super(n, s), this.uploadValue = n;
          }
          getSource(n) {
            return this.origin === "constants" ? `const vec2 ${this.id} = vec2(${n[0]},${n[1]});
` : `uniform vec2 ${this.id};
`;
          }
          getStringValueHandler() {
            return this.origin === "constants" ? "" : `const uploadValue_${this.name} = ${this.varName};
`;
          }
          updateValue(n) {
            this.origin !== "constants" && this.kernel.setUniform2fv(this.id, this.uploadValue = n);
          }
        }
        y.exports = { WebGLKernelValueSingleArray2: f };
      }, { "../../../utils": 114, "./index": 56 }], 63: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { WebGLKernelArray: g } = o("./array");
        class f extends g {
          constructor(n, s) {
            super(n, s), this.bitRatio = 4, this.setShape(n);
          }
          setShape(n) {
            let s = p.getDimensions(n, true);
            this.textureSize = p.getMemoryOptimizedFloatTextureSize(s, this.bitRatio), this.dimensions = new Int32Array([s[1], s[2], 1]), this.uploadArrayLength = this.textureSize[0] * this.textureSize[1] * this.bitRatio, this.checkSize(this.textureSize[0], this.textureSize[1]), this.uploadValue = new Float32Array(this.uploadArrayLength);
          }
          getStringValueHandler() {
            return p.linesToString([`const uploadValue_${this.name} = new Float32Array(${this.uploadArrayLength})`, `flattenTo(${this.varName}, uploadValue_${this.name})`]);
          }
          getSource() {
            return p.linesToString([`uniform sampler2D ${this.id}`, `ivec2 ${this.sizeId} = ivec2(${this.textureSize[0]}, ${this.textureSize[1]})`, `ivec3 ${this.dimensionsId} = ivec3(${this.dimensions[0]}, ${this.dimensions[1]}, ${this.dimensions[2]})`]);
          }
          updateValue(n) {
            if (n.constructor !== this.initialValueConstructor) {
              this.onUpdateValueMismatch(n.constructor);
              return;
            }
            let { context: s } = this;
            p.flatten3dArrayTo(n, this.uploadValue), s.activeTexture(this.contextHandle), s.bindTexture(s.TEXTURE_2D, this.texture), s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL, false), s.texImage2D(s.TEXTURE_2D, 0, s.RGBA, this.textureSize[0], this.textureSize[1], 0, s.RGBA, s.FLOAT, this.uploadValue), this.kernel.setUniform1i(this.id, this.index);
          }
        }
        y.exports = { WebGLKernelValueSingleArray2DI: f };
      }, { "../../../utils": 114, "./array": 40 }], 64: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { WebGLKernelValue: g } = o("./index");
        class f extends g {
          constructor(n, s) {
            super(n, s), this.uploadValue = n;
          }
          getSource(n) {
            return this.origin === "constants" ? `const vec3 ${this.id} = vec3(${n[0]},${n[1]},${n[2]});
` : `uniform vec3 ${this.id};
`;
          }
          getStringValueHandler() {
            return this.origin === "constants" ? "" : `const uploadValue_${this.name} = ${this.varName};
`;
          }
          updateValue(n) {
            this.origin !== "constants" && this.kernel.setUniform3fv(this.id, this.uploadValue = n);
          }
        }
        y.exports = { WebGLKernelValueSingleArray3: f };
      }, { "../../../utils": 114, "./index": 56 }], 65: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { WebGLKernelArray: g } = o("./array");
        class f extends g {
          constructor(n, s) {
            super(n, s), this.bitRatio = 4, this.setShape(n);
          }
          setShape(n) {
            let s = p.getDimensions(n, true);
            this.textureSize = p.getMemoryOptimizedFloatTextureSize(s, this.bitRatio), this.dimensions = new Int32Array([s[1], s[2], s[3]]), this.uploadArrayLength = this.textureSize[0] * this.textureSize[1] * this.bitRatio, this.checkSize(this.textureSize[0], this.textureSize[1]), this.uploadValue = new Float32Array(this.uploadArrayLength);
          }
          getStringValueHandler() {
            return p.linesToString([`const uploadValue_${this.name} = new Float32Array(${this.uploadArrayLength})`, `flattenTo(${this.varName}, uploadValue_${this.name})`]);
          }
          getSource() {
            return p.linesToString([`uniform sampler2D ${this.id}`, `ivec2 ${this.sizeId} = ivec2(${this.textureSize[0]}, ${this.textureSize[1]})`, `ivec3 ${this.dimensionsId} = ivec3(${this.dimensions[0]}, ${this.dimensions[1]}, ${this.dimensions[2]})`]);
          }
          updateValue(n) {
            if (n.constructor !== this.initialValueConstructor) {
              this.onUpdateValueMismatch(n.constructor);
              return;
            }
            let { context: s } = this;
            p.flatten4dArrayTo(n, this.uploadValue), s.activeTexture(this.contextHandle), s.bindTexture(s.TEXTURE_2D, this.texture), s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL, false), s.texImage2D(s.TEXTURE_2D, 0, s.RGBA, this.textureSize[0], this.textureSize[1], 0, s.RGBA, s.FLOAT, this.uploadValue), this.kernel.setUniform1i(this.id, this.index);
          }
        }
        y.exports = { WebGLKernelValueSingleArray3DI: f };
      }, { "../../../utils": 114, "./array": 40 }], 66: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { WebGLKernelValue: g } = o("./index");
        class f extends g {
          constructor(n, s) {
            super(n, s), this.uploadValue = n;
          }
          getSource(n) {
            return this.origin === "constants" ? `const vec4 ${this.id} = vec4(${n[0]},${n[1]},${n[2]},${n[3]});
` : `uniform vec4 ${this.id};
`;
          }
          getStringValueHandler() {
            return this.origin === "constants" ? "" : `const uploadValue_${this.name} = ${this.varName};
`;
          }
          updateValue(n) {
            this.origin !== "constants" && this.kernel.setUniform4fv(this.id, this.uploadValue = n);
          }
        }
        y.exports = { WebGLKernelValueSingleArray4: f };
      }, { "../../../utils": 114, "./index": 56 }], 67: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { WebGLKernelArray: g } = o("./array");
        class f extends g {
          constructor(n, s) {
            super(n, s), this.bitRatio = 4;
            let [t, i, u] = n.size;
            this.dimensions = new Int32Array([t || 1, i || 1, u || 1]), this.textureSize = p.getMemoryOptimizedFloatTextureSize(this.dimensions, this.bitRatio), this.uploadArrayLength = this.textureSize[0] * this.textureSize[1] * this.bitRatio, this.checkSize(this.textureSize[0], this.textureSize[1]), this.uploadValue = new Float32Array(this.uploadArrayLength);
          }
          getStringValueHandler() {
            return p.linesToString([`const uploadValue_${this.name} = new Float32Array(${this.uploadArrayLength})`, `flattenTo(${this.varName}.value, uploadValue_${this.name})`]);
          }
          getSource() {
            return p.linesToString([`uniform sampler2D ${this.id}`, `ivec2 ${this.sizeId} = ivec2(${this.textureSize[0]}, ${this.textureSize[1]})`, `ivec3 ${this.dimensionsId} = ivec3(${this.dimensions[0]}, ${this.dimensions[1]}, ${this.dimensions[2]})`]);
          }
          updateValue(n) {
            if (n.constructor !== this.initialValueConstructor) {
              this.onUpdateValueMismatch(n.constructor);
              return;
            }
            let { context: s } = this;
            p.flattenTo(n.value, this.uploadValue), s.activeTexture(this.contextHandle), s.bindTexture(s.TEXTURE_2D, this.texture), s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL, false), s.texImage2D(s.TEXTURE_2D, 0, s.RGBA, this.textureSize[0], this.textureSize[1], 0, s.RGBA, s.FLOAT, this.uploadValue), this.kernel.setUniform1i(this.id, this.index);
          }
        }
        y.exports = { WebGLKernelValueSingleInput: f };
      }, { "../../../utils": 114, "./array": 40 }], 68: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { WebGLKernelArray: g } = o("./array");
        class f extends g {
          constructor(n, s) {
            super(n, s), this.bitRatio = this.getBitRatio(n), this.dimensions = p.getDimensions(n, true), this.textureSize = p.getMemoryOptimizedPackedTextureSize(this.dimensions, this.bitRatio), this.uploadArrayLength = this.textureSize[0] * this.textureSize[1] * (4 / this.bitRatio), this.checkSize(this.textureSize[0], this.textureSize[1]), this.TranserArrayType = this.getTransferArrayType(n), this.preUploadValue = new this.TranserArrayType(this.uploadArrayLength), this.uploadValue = new Uint8Array(this.preUploadValue.buffer);
          }
          getStringValueHandler() {
            return p.linesToString([`const preUploadValue_${this.name} = new ${this.TranserArrayType.name}(${this.uploadArrayLength})`, `const uploadValue_${this.name} = new Uint8Array(preUploadValue_${this.name}.buffer)`, `flattenTo(${this.varName}, preUploadValue_${this.name})`]);
          }
          getSource() {
            return p.linesToString([`uniform sampler2D ${this.id}`, `ivec2 ${this.sizeId} = ivec2(${this.textureSize[0]}, ${this.textureSize[1]})`, `ivec3 ${this.dimensionsId} = ivec3(${this.dimensions[0]}, ${this.dimensions[1]}, ${this.dimensions[2]})`]);
          }
          updateValue(n) {
            if (n.constructor !== this.initialValueConstructor) {
              this.onUpdateValueMismatch(n.constructor);
              return;
            }
            let { context: s } = this;
            p.flattenTo(n, this.preUploadValue), s.activeTexture(this.contextHandle), s.bindTexture(s.TEXTURE_2D, this.texture), s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL, false), s.texImage2D(s.TEXTURE_2D, 0, s.RGBA, this.textureSize[0], this.textureSize[1], 0, s.RGBA, s.UNSIGNED_BYTE, this.uploadValue), this.kernel.setUniform1i(this.id, this.index);
          }
        }
        y.exports = { WebGLKernelValueUnsignedArray: f };
      }, { "../../../utils": 114, "./array": 40 }], 69: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { WebGLKernelArray: g } = o("./array");
        class f extends g {
          constructor(n, s) {
            super(n, s), this.bitRatio = this.getBitRatio(n);
            let [t, i, u] = n.size;
            this.dimensions = new Int32Array([t || 1, i || 1, u || 1]), this.textureSize = p.getMemoryOptimizedPackedTextureSize(this.dimensions, this.bitRatio), this.uploadArrayLength = this.textureSize[0] * this.textureSize[1] * (4 / this.bitRatio), this.checkSize(this.textureSize[0], this.textureSize[1]), this.TranserArrayType = this.getTransferArrayType(n.value), this.preUploadValue = new this.TranserArrayType(this.uploadArrayLength), this.uploadValue = new Uint8Array(this.preUploadValue.buffer);
          }
          getStringValueHandler() {
            return p.linesToString([`const preUploadValue_${this.name} = new ${this.TranserArrayType.name}(${this.uploadArrayLength})`, `const uploadValue_${this.name} = new Uint8Array(preUploadValue_${this.name}.buffer)`, `flattenTo(${this.varName}.value, preUploadValue_${this.name})`]);
          }
          getSource() {
            return p.linesToString([`uniform sampler2D ${this.id}`, `ivec2 ${this.sizeId} = ivec2(${this.textureSize[0]}, ${this.textureSize[1]})`, `ivec3 ${this.dimensionsId} = ivec3(${this.dimensions[0]}, ${this.dimensions[1]}, ${this.dimensions[2]})`]);
          }
          updateValue(n) {
            if (n.constructor !== this.initialValueConstructor) {
              this.onUpdateValueMismatch(value.constructor);
              return;
            }
            let { context: s } = this;
            p.flattenTo(n.value, this.preUploadValue), s.activeTexture(this.contextHandle), s.bindTexture(s.TEXTURE_2D, this.texture), s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL, false), s.texImage2D(s.TEXTURE_2D, 0, s.RGBA, this.textureSize[0], this.textureSize[1], 0, s.RGBA, s.UNSIGNED_BYTE, this.uploadValue), this.kernel.setUniform1i(this.id, this.index);
          }
        }
        y.exports = { WebGLKernelValueUnsignedInput: f };
      }, { "../../../utils": 114, "./array": 40 }], 70: [function(o, y, E) {
        let { GLKernel: p } = o("../gl/kernel"), { FunctionBuilder: g } = o("../function-builder"), { WebGLFunctionNode: f } = o("./function-node"), { utils: l } = o("../../utils"), n = o("../../plugins/math-random-uniformly-distributed"), { fragmentShader: s } = o("./fragment-shader"), { vertexShader: t } = o("./vertex-shader"), { glKernelString: i } = o("../gl/kernel-string"), { lookupKernelValueType: u } = o("./kernel-value-maps"), x2 = null, w = null, m = null, S = null, v = null, h = [n], b = [], T = {};
        class C extends p {
          static get isSupported() {
            return x2 !== null || (this.setupFeatureChecks(), x2 = this.isContextMatch(m)), x2;
          }
          static setupFeatureChecks() {
            typeof document < "u" ? w = document.createElement("canvas") : typeof OffscreenCanvas < "u" && (w = new OffscreenCanvas(0, 0)), w && (m = w.getContext("webgl") || w.getContext("experimental-webgl"), !(!m || !m.getExtension) && (S = { OES_texture_float: m.getExtension("OES_texture_float"), OES_texture_float_linear: m.getExtension("OES_texture_float_linear"), OES_element_index_uint: m.getExtension("OES_element_index_uint"), WEBGL_draw_buffers: m.getExtension("WEBGL_draw_buffers") }, v = this.getFeatures()));
          }
          static isContextMatch(c) {
            return typeof WebGLRenderingContext < "u" ? c instanceof WebGLRenderingContext : false;
          }
          static getIsTextureFloat() {
            return Boolean(S.OES_texture_float);
          }
          static getIsDrawBuffers() {
            return Boolean(S.WEBGL_draw_buffers);
          }
          static getChannelCount() {
            return S.WEBGL_draw_buffers ? m.getParameter(S.WEBGL_draw_buffers.MAX_DRAW_BUFFERS_WEBGL) : 1;
          }
          static getMaxTextureSize() {
            return m.getParameter(m.MAX_TEXTURE_SIZE);
          }
          static lookupKernelValueType(c, a, k, A) {
            return u(c, a, k, A);
          }
          static get testCanvas() {
            return w;
          }
          static get testContext() {
            return m;
          }
          static get features() {
            return v;
          }
          static get fragmentShader() {
            return s;
          }
          static get vertexShader() {
            return t;
          }
          constructor(c, a) {
            super(c, a), this.program = null, this.pipeline = a.pipeline, this.endianness = l.systemEndianness(), this.extensions = {}, this.argumentTextureCount = 0, this.constantTextureCount = 0, this.fragShader = null, this.vertShader = null, this.drawBuffersMap = null, this.maxTexSize = null, this.onRequestSwitchKernel = null, this.texture = null, this.mappedTextures = null, this.mergeSettings(c.settings || a), this.threadDim = null, this.framebuffer = null, this.buffer = null, this.textureCache = [], this.programUniformLocationCache = {}, this.uniform1fCache = {}, this.uniform1iCache = {}, this.uniform2fCache = {}, this.uniform2fvCache = {}, this.uniform2ivCache = {}, this.uniform3fvCache = {}, this.uniform3ivCache = {}, this.uniform4fvCache = {}, this.uniform4ivCache = {};
          }
          initCanvas() {
            if (typeof document < "u") {
              let c = document.createElement("canvas");
              return c.width = 2, c.height = 2, c;
            } else if (typeof OffscreenCanvas < "u")
              return new OffscreenCanvas(0, 0);
          }
          initContext() {
            let c = { alpha: false, depth: false, antialias: false };
            return this.canvas.getContext("webgl", c) || this.canvas.getContext("experimental-webgl", c);
          }
          initPlugins(c) {
            let a = [], { source: k } = this;
            if (typeof k == "string")
              for (let A = 0; A < h.length; A++) {
                let N = h[A];
                k.match(N.functionMatch) && a.push(N);
              }
            else if (typeof k == "object" && c.pluginNames)
              for (let A = 0; A < h.length; A++) {
                let N = h[A];
                c.pluginNames.some((R) => R === N.name) && a.push(N);
              }
            return a;
          }
          initExtensions() {
            this.extensions = { OES_texture_float: this.context.getExtension("OES_texture_float"), OES_texture_float_linear: this.context.getExtension("OES_texture_float_linear"), OES_element_index_uint: this.context.getExtension("OES_element_index_uint"), WEBGL_draw_buffers: this.context.getExtension("WEBGL_draw_buffers"), WEBGL_color_buffer_float: this.context.getExtension("WEBGL_color_buffer_float") };
          }
          validateSettings(c) {
            if (!this.validate) {
              this.texSize = l.getKernelTextureSize({ optimizeFloatMemory: this.optimizeFloatMemory, precision: this.precision }, this.output);
              return;
            }
            let { features: a } = this.constructor;
            if (this.optimizeFloatMemory === true && !a.isTextureFloat)
              throw new Error("Float textures are not supported");
            if (this.precision === "single" && !a.isFloatRead)
              throw new Error("Single precision not supported");
            if (!this.graphical && this.precision === null && a.isTextureFloat && (this.precision = a.isFloatRead ? "single" : "unsigned"), this.subKernels && this.subKernels.length > 0 && !this.extensions.WEBGL_draw_buffers)
              throw new Error("could not instantiate draw buffers extension");
            if (this.fixIntegerDivisionAccuracy === null ? this.fixIntegerDivisionAccuracy = !a.isIntegerDivisionAccurate : this.fixIntegerDivisionAccuracy && a.isIntegerDivisionAccurate && (this.fixIntegerDivisionAccuracy = false), this.checkOutput(), !this.output || this.output.length === 0) {
              if (c.length !== 1)
                throw new Error("Auto output only supported for kernels with only one input");
              let k = l.getVariableType(c[0], this.strictIntegers);
              switch (k) {
                case "Array":
                  this.output = l.getDimensions(k);
                  break;
                case "NumberTexture":
                case "MemoryOptimizedNumberTexture":
                case "ArrayTexture(1)":
                case "ArrayTexture(2)":
                case "ArrayTexture(3)":
                case "ArrayTexture(4)":
                  this.output = c[0].output;
                  break;
                default:
                  throw new Error("Auto output not supported for input type: " + k);
              }
            }
            if (this.graphical) {
              if (this.output.length !== 2)
                throw new Error("Output must have 2 dimensions on graphical mode");
              this.precision === "precision" && (this.precision = "unsigned", console.warn("Cannot use graphical mode and single precision at the same time")), this.texSize = l.clone(this.output);
              return;
            } else
              this.precision === null && a.isTextureFloat && (this.precision = "single");
            this.texSize = l.getKernelTextureSize({ optimizeFloatMemory: this.optimizeFloatMemory, precision: this.precision }, this.output), this.checkTextureSize();
          }
          updateMaxTexSize() {
            let { texSize: c, canvas: a } = this;
            if (this.maxTexSize === null) {
              let k = b.indexOf(a);
              k === -1 && (k = b.length, b.push(a), T[k] = [c[0], c[1]]), this.maxTexSize = T[k];
            }
            this.maxTexSize[0] < c[0] && (this.maxTexSize[0] = c[0]), this.maxTexSize[1] < c[1] && (this.maxTexSize[1] = c[1]);
          }
          setupArguments(c) {
            this.kernelArguments = [], this.argumentTextureCount = 0;
            let a = this.argumentTypes === null;
            if (a && (this.argumentTypes = []), this.argumentSizes = [], this.argumentBitRatios = [], c.length < this.argumentNames.length)
              throw new Error("not enough arguments for kernel");
            if (c.length > this.argumentNames.length)
              throw new Error("too many arguments for kernel");
            let { context: k } = this, A = 0, N = () => this.createTexture(), F = () => this.constantTextureCount + A++, R = (O) => {
              this.switchKernels({ type: "argumentMismatch", needed: O });
            }, K = () => k.TEXTURE0 + this.constantTextureCount + this.argumentTextureCount++;
            for (let O = 0; O < c.length; O++) {
              let X = c[O], B = this.argumentNames[O], P;
              a ? (P = l.getVariableType(X, this.strictIntegers), this.argumentTypes.push(P)) : P = this.argumentTypes[O];
              let Y = this.constructor.lookupKernelValueType(P, this.dynamicArguments ? "dynamic" : "static", this.precision, c[O]);
              if (Y === null)
                return this.requestFallback(c);
              let J = new Y(X, { name: B, type: P, tactic: this.tactic, origin: "user", context: k, checkContext: this.checkContext, kernel: this, strictIntegers: this.strictIntegers, onRequestTexture: N, onRequestIndex: F, onUpdateValueMismatch: R, onRequestContextHandle: K });
              this.kernelArguments.push(J), J.setup(), this.argumentSizes.push(J.textureSize), this.argumentBitRatios[O] = J.bitRatio;
            }
          }
          createTexture() {
            let c = this.context.createTexture();
            return this.textureCache.push(c), c;
          }
          setupConstants(c) {
            let { context: a } = this;
            this.kernelConstants = [], this.forceUploadKernelConstants = [];
            let k = this.constantTypes === null;
            k && (this.constantTypes = {}), this.constantBitRatios = {};
            let A = 0;
            for (let N in this.constants) {
              let F = this.constants[N], R;
              k ? (R = l.getVariableType(F, this.strictIntegers), this.constantTypes[N] = R) : R = this.constantTypes[N];
              let K = this.constructor.lookupKernelValueType(R, "static", this.precision, F);
              if (K === null)
                return this.requestFallback(c);
              let O = new K(F, { name: N, type: R, tactic: this.tactic, origin: "constants", context: this.context, checkContext: this.checkContext, kernel: this, strictIntegers: this.strictIntegers, onRequestTexture: () => this.createTexture(), onRequestIndex: () => A++, onRequestContextHandle: () => a.TEXTURE0 + this.constantTextureCount++ });
              this.constantBitRatios[N] = O.bitRatio, this.kernelConstants.push(O), O.setup(), O.forceUploadEachRun && this.forceUploadKernelConstants.push(O);
            }
          }
          build() {
            if (this.built || (this.initExtensions(), this.validateSettings(arguments), this.setupConstants(arguments), this.fallbackRequested) || (this.setupArguments(arguments), this.fallbackRequested))
              return;
            this.updateMaxTexSize(), this.translateSource();
            let c = this.pickRenderStrategy(arguments);
            if (c)
              return c;
            let { texSize: a, context: k, canvas: A } = this;
            k.enable(k.SCISSOR_TEST), this.pipeline && this.precision === "single" ? (k.viewport(0, 0, this.maxTexSize[0], this.maxTexSize[1]), A.width = this.maxTexSize[0], A.height = this.maxTexSize[1]) : (k.viewport(0, 0, this.maxTexSize[0], this.maxTexSize[1]), A.width = this.maxTexSize[0], A.height = this.maxTexSize[1]);
            let N = this.threadDim = Array.from(this.output);
            for (; N.length < 3; )
              N.push(1);
            let F = this.getVertexShader(arguments), R = k.createShader(k.VERTEX_SHADER);
            k.shaderSource(R, F), k.compileShader(R), this.vertShader = R;
            let K = this.getFragmentShader(arguments), O = k.createShader(k.FRAGMENT_SHADER);
            if (k.shaderSource(O, K), k.compileShader(O), this.fragShader = O, this.debug && (console.log("GLSL Shader Output:"), console.log(K)), !k.getShaderParameter(R, k.COMPILE_STATUS))
              throw new Error("Error compiling vertex shader: " + k.getShaderInfoLog(R));
            if (!k.getShaderParameter(O, k.COMPILE_STATUS))
              throw new Error("Error compiling fragment shader: " + k.getShaderInfoLog(O));
            let X = this.program = k.createProgram();
            k.attachShader(X, R), k.attachShader(X, O), k.linkProgram(X), this.framebuffer = k.createFramebuffer(), this.framebuffer.width = a[0], this.framebuffer.height = a[1], this.rawValueFramebuffers = {};
            let B = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), P = new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), Y = B.byteLength, J = this.buffer;
            J ? k.bindBuffer(k.ARRAY_BUFFER, J) : (J = this.buffer = k.createBuffer(), k.bindBuffer(k.ARRAY_BUFFER, J), k.bufferData(k.ARRAY_BUFFER, B.byteLength + P.byteLength, k.STATIC_DRAW)), k.bufferSubData(k.ARRAY_BUFFER, 0, B), k.bufferSubData(k.ARRAY_BUFFER, Y, P);
            let q = k.getAttribLocation(this.program, "aPos");
            k.enableVertexAttribArray(q), k.vertexAttribPointer(q, 2, k.FLOAT, false, 0, 0);
            let j = k.getAttribLocation(this.program, "aTexCoord");
            k.enableVertexAttribArray(j), k.vertexAttribPointer(j, 2, k.FLOAT, false, 0, Y), k.bindFramebuffer(k.FRAMEBUFFER, this.framebuffer);
            let U = 0;
            k.useProgram(this.program);
            for (let oe in this.constants)
              this.kernelConstants[U++].updateValue(this.constants[oe]);
            this._setupOutputTexture(), this.subKernels !== null && this.subKernels.length > 0 && (this._mappedTextureSwitched = {}, this._setupSubOutputTextures()), this.buildSignature(arguments), this.built = true;
          }
          translateSource() {
            let c = g.fromKernel(this, f, { fixIntegerDivisionAccuracy: this.fixIntegerDivisionAccuracy });
            this.translatedSource = c.getPrototypeString("kernel"), this.setupReturnTypes(c);
          }
          setupReturnTypes(c) {
            if (!this.graphical && !this.returnType && (this.returnType = c.getKernelResultType()), this.subKernels && this.subKernels.length > 0)
              for (let a = 0; a < this.subKernels.length; a++) {
                let k = this.subKernels[a];
                k.returnType || (k.returnType = c.getSubKernelResultType(a));
              }
          }
          run() {
            let { kernelArguments: c, texSize: a, forceUploadKernelConstants: k, context: A } = this;
            A.useProgram(this.program), A.scissor(0, 0, a[0], a[1]), this.dynamicOutput && (this.setUniform3iv("uOutputDim", new Int32Array(this.threadDim)), this.setUniform2iv("uTexSize", a)), this.setUniform2f("ratio", a[0] / this.maxTexSize[0], a[1] / this.maxTexSize[1]);
            for (let N = 0; N < k.length; N++) {
              let F = k[N];
              if (F.updateValue(this.constants[F.name]), this.switchingKernels)
                return;
            }
            for (let N = 0; N < c.length; N++)
              if (c[N].updateValue(arguments[N]), this.switchingKernels)
                return;
            if (this.plugins)
              for (let N = 0; N < this.plugins.length; N++) {
                let F = this.plugins[N];
                F.onBeforeRun && F.onBeforeRun(this);
              }
            if (this.graphical) {
              if (this.pipeline)
                return A.bindRenderbuffer(A.RENDERBUFFER, null), A.bindFramebuffer(A.FRAMEBUFFER, this.framebuffer), this.immutable && this._replaceOutputTexture(), A.drawArrays(A.TRIANGLE_STRIP, 0, 4), this.immutable ? this.texture.clone() : this.texture;
              A.bindRenderbuffer(A.RENDERBUFFER, null), A.bindFramebuffer(A.FRAMEBUFFER, null), A.drawArrays(A.TRIANGLE_STRIP, 0, 4);
              return;
            }
            A.bindFramebuffer(A.FRAMEBUFFER, this.framebuffer), this.immutable && this._replaceOutputTexture(), this.subKernels !== null && (this.immutable && this._replaceSubOutputTextures(), this.drawBuffers()), A.drawArrays(A.TRIANGLE_STRIP, 0, 4);
          }
          drawBuffers() {
            this.extensions.WEBGL_draw_buffers.drawBuffersWEBGL(this.drawBuffersMap);
          }
          getInternalFormat() {
            return this.context.RGBA;
          }
          getTextureFormat() {
            let { context: c } = this;
            switch (this.getInternalFormat()) {
              case c.RGBA:
                return c.RGBA;
              default:
                throw new Error("Unknown internal format");
            }
          }
          _replaceOutputTexture() {
            if (this.texture.beforeMutate() || this._textureSwitched) {
              let c = this.context;
              c.framebufferTexture2D(c.FRAMEBUFFER, c.COLOR_ATTACHMENT0, c.TEXTURE_2D, this.texture.texture, 0), this._textureSwitched = false;
            }
          }
          _setupOutputTexture() {
            let c = this.context, a = this.texSize;
            if (this.texture) {
              c.framebufferTexture2D(c.FRAMEBUFFER, c.COLOR_ATTACHMENT0, c.TEXTURE_2D, this.texture.texture, 0);
              return;
            }
            let k = this.createTexture();
            c.activeTexture(c.TEXTURE0 + this.constantTextureCount + this.argumentTextureCount), c.bindTexture(c.TEXTURE_2D, k), c.texParameteri(c.TEXTURE_2D, c.TEXTURE_WRAP_S, c.CLAMP_TO_EDGE), c.texParameteri(c.TEXTURE_2D, c.TEXTURE_WRAP_T, c.CLAMP_TO_EDGE), c.texParameteri(c.TEXTURE_2D, c.TEXTURE_MIN_FILTER, c.NEAREST), c.texParameteri(c.TEXTURE_2D, c.TEXTURE_MAG_FILTER, c.NEAREST);
            let A = this.getInternalFormat();
            this.precision === "single" ? c.texImage2D(c.TEXTURE_2D, 0, A, a[0], a[1], 0, c.RGBA, c.FLOAT, null) : c.texImage2D(c.TEXTURE_2D, 0, A, a[0], a[1], 0, A, c.UNSIGNED_BYTE, null), c.framebufferTexture2D(c.FRAMEBUFFER, c.COLOR_ATTACHMENT0, c.TEXTURE_2D, k, 0), this.texture = new this.TextureConstructor({ texture: k, size: a, dimensions: this.threadDim, output: this.output, context: this.context, internalFormat: this.getInternalFormat(), textureFormat: this.getTextureFormat(), kernel: this });
          }
          _replaceSubOutputTextures() {
            let c = this.context;
            for (let a = 0; a < this.mappedTextures.length; a++) {
              let k = this.mappedTextures[a];
              (k.beforeMutate() || this._mappedTextureSwitched[a]) && (c.framebufferTexture2D(c.FRAMEBUFFER, c.COLOR_ATTACHMENT0 + a + 1, c.TEXTURE_2D, k.texture, 0), this._mappedTextureSwitched[a] = false);
            }
          }
          _setupSubOutputTextures() {
            let c = this.context;
            if (this.mappedTextures) {
              for (let k = 0; k < this.subKernels.length; k++)
                c.framebufferTexture2D(c.FRAMEBUFFER, c.COLOR_ATTACHMENT0 + k + 1, c.TEXTURE_2D, this.mappedTextures[k].texture, 0);
              return;
            }
            let a = this.texSize;
            this.drawBuffersMap = [c.COLOR_ATTACHMENT0], this.mappedTextures = [];
            for (let k = 0; k < this.subKernels.length; k++) {
              let A = this.createTexture();
              this.drawBuffersMap.push(c.COLOR_ATTACHMENT0 + k + 1), c.activeTexture(c.TEXTURE0 + this.constantTextureCount + this.argumentTextureCount + k), c.bindTexture(c.TEXTURE_2D, A), c.texParameteri(c.TEXTURE_2D, c.TEXTURE_WRAP_S, c.CLAMP_TO_EDGE), c.texParameteri(c.TEXTURE_2D, c.TEXTURE_WRAP_T, c.CLAMP_TO_EDGE), c.texParameteri(c.TEXTURE_2D, c.TEXTURE_MIN_FILTER, c.NEAREST), c.texParameteri(c.TEXTURE_2D, c.TEXTURE_MAG_FILTER, c.NEAREST), this.precision === "single" ? c.texImage2D(c.TEXTURE_2D, 0, c.RGBA, a[0], a[1], 0, c.RGBA, c.FLOAT, null) : c.texImage2D(c.TEXTURE_2D, 0, c.RGBA, a[0], a[1], 0, c.RGBA, c.UNSIGNED_BYTE, null), c.framebufferTexture2D(c.FRAMEBUFFER, c.COLOR_ATTACHMENT0 + k + 1, c.TEXTURE_2D, A, 0), this.mappedTextures.push(new this.TextureConstructor({ texture: A, size: a, dimensions: this.threadDim, output: this.output, context: this.context, internalFormat: this.getInternalFormat(), textureFormat: this.getTextureFormat(), kernel: this }));
            }
          }
          setUniform1f(c, a) {
            if (this.uniform1fCache.hasOwnProperty(c)) {
              let A = this.uniform1fCache[c];
              if (a === A)
                return;
            }
            this.uniform1fCache[c] = a;
            let k = this.getUniformLocation(c);
            this.context.uniform1f(k, a);
          }
          setUniform1i(c, a) {
            if (this.uniform1iCache.hasOwnProperty(c)) {
              let A = this.uniform1iCache[c];
              if (a === A)
                return;
            }
            this.uniform1iCache[c] = a;
            let k = this.getUniformLocation(c);
            this.context.uniform1i(k, a);
          }
          setUniform2f(c, a, k) {
            if (this.uniform2fCache.hasOwnProperty(c)) {
              let N = this.uniform2fCache[c];
              if (a === N[0] && k === N[1])
                return;
            }
            this.uniform2fCache[c] = [a, k];
            let A = this.getUniformLocation(c);
            this.context.uniform2f(A, a, k);
          }
          setUniform2fv(c, a) {
            if (this.uniform2fvCache.hasOwnProperty(c)) {
              let A = this.uniform2fvCache[c];
              if (a[0] === A[0] && a[1] === A[1])
                return;
            }
            this.uniform2fvCache[c] = a;
            let k = this.getUniformLocation(c);
            this.context.uniform2fv(k, a);
          }
          setUniform2iv(c, a) {
            if (this.uniform2ivCache.hasOwnProperty(c)) {
              let A = this.uniform2ivCache[c];
              if (a[0] === A[0] && a[1] === A[1])
                return;
            }
            this.uniform2ivCache[c] = a;
            let k = this.getUniformLocation(c);
            this.context.uniform2iv(k, a);
          }
          setUniform3fv(c, a) {
            if (this.uniform3fvCache.hasOwnProperty(c)) {
              let A = this.uniform3fvCache[c];
              if (a[0] === A[0] && a[1] === A[1] && a[2] === A[2])
                return;
            }
            this.uniform3fvCache[c] = a;
            let k = this.getUniformLocation(c);
            this.context.uniform3fv(k, a);
          }
          setUniform3iv(c, a) {
            if (this.uniform3ivCache.hasOwnProperty(c)) {
              let A = this.uniform3ivCache[c];
              if (a[0] === A[0] && a[1] === A[1] && a[2] === A[2])
                return;
            }
            this.uniform3ivCache[c] = a;
            let k = this.getUniformLocation(c);
            this.context.uniform3iv(k, a);
          }
          setUniform4fv(c, a) {
            if (this.uniform4fvCache.hasOwnProperty(c)) {
              let A = this.uniform4fvCache[c];
              if (a[0] === A[0] && a[1] === A[1] && a[2] === A[2] && a[3] === A[3])
                return;
            }
            this.uniform4fvCache[c] = a;
            let k = this.getUniformLocation(c);
            this.context.uniform4fv(k, a);
          }
          setUniform4iv(c, a) {
            if (this.uniform4ivCache.hasOwnProperty(c)) {
              let A = this.uniform4ivCache[c];
              if (a[0] === A[0] && a[1] === A[1] && a[2] === A[2] && a[3] === A[3])
                return;
            }
            this.uniform4ivCache[c] = a;
            let k = this.getUniformLocation(c);
            this.context.uniform4iv(k, a);
          }
          getUniformLocation(c) {
            return this.programUniformLocationCache.hasOwnProperty(c) ? this.programUniformLocationCache[c] : this.programUniformLocationCache[c] = this.context.getUniformLocation(this.program, c);
          }
          _getFragShaderArtifactMap(c) {
            return { HEADER: this._getHeaderString(), LOOP_MAX: this._getLoopMaxString(), PLUGINS: this._getPluginsString(), CONSTANTS: this._getConstantsString(), DECODE32_ENDIANNESS: this._getDecode32EndiannessString(), ENCODE32_ENDIANNESS: this._getEncode32EndiannessString(), DIVIDE_WITH_INTEGER_CHECK: this._getDivideWithIntegerCheckString(), INJECTED_NATIVE: this._getInjectedNative(), MAIN_CONSTANTS: this._getMainConstantsString(), MAIN_ARGUMENTS: this._getMainArgumentsString(c), KERNEL: this.getKernelString(), MAIN_RESULT: this.getMainResultString(), FLOAT_TACTIC_DECLARATION: this.getFloatTacticDeclaration(), INT_TACTIC_DECLARATION: this.getIntTacticDeclaration(), SAMPLER_2D_TACTIC_DECLARATION: this.getSampler2DTacticDeclaration(), SAMPLER_2D_ARRAY_TACTIC_DECLARATION: this.getSampler2DArrayTacticDeclaration() };
          }
          _getVertShaderArtifactMap(c) {
            return { FLOAT_TACTIC_DECLARATION: this.getFloatTacticDeclaration(), INT_TACTIC_DECLARATION: this.getIntTacticDeclaration(), SAMPLER_2D_TACTIC_DECLARATION: this.getSampler2DTacticDeclaration(), SAMPLER_2D_ARRAY_TACTIC_DECLARATION: this.getSampler2DArrayTacticDeclaration() };
          }
          _getHeaderString() {
            return this.subKernels !== null ? `#extension GL_EXT_draw_buffers : require
` : "";
          }
          _getLoopMaxString() {
            return this.loopMaxIterations ? ` ${parseInt(this.loopMaxIterations)};
` : ` 1000;
`;
          }
          _getPluginsString() {
            return this.plugins ? this.plugins.map((c) => c.source && this.source.match(c.functionMatch) ? c.source : "").join(`
`) : `
`;
          }
          _getConstantsString() {
            let c = [], { threadDim: a, texSize: k } = this;
            return this.dynamicOutput ? c.push("uniform ivec3 uOutputDim", "uniform ivec2 uTexSize") : c.push(`ivec3 uOutputDim = ivec3(${a[0]}, ${a[1]}, ${a[2]})`, `ivec2 uTexSize = ivec2(${k[0]}, ${k[1]})`), l.linesToString(c);
          }
          _getTextureCoordinate() {
            let c = this.subKernels;
            return c === null || c.length < 1 ? `varying vec2 vTexCoord;
` : `out vec2 vTexCoord;
`;
          }
          _getDecode32EndiannessString() {
            return this.endianness === "LE" ? "" : `  texel.rgba = texel.abgr;
`;
          }
          _getEncode32EndiannessString() {
            return this.endianness === "LE" ? "" : `  texel.rgba = texel.abgr;
`;
          }
          _getDivideWithIntegerCheckString() {
            return this.fixIntegerDivisionAccuracy ? `float divWithIntCheck(float x, float y) {
        if (floor(x) == x && floor(y) == y && integerMod(x, y) == 0.0) {
          return float(int(x) / int(y));
        }
        return x / y;
      }
      
      float integerCorrectionModulo(float number, float divisor) {
        if (number < 0.0) {
          number = abs(number);
          if (divisor < 0.0) {
            divisor = abs(divisor);
          }
          return -(number - (divisor * floor(divWithIntCheck(number, divisor))));
        }
        if (divisor < 0.0) {
          divisor = abs(divisor);
        }
        return number - (divisor * floor(divWithIntCheck(number, divisor)));
      }` : "";
          }
          _getMainArgumentsString(c) {
            let a = [], { argumentNames: k } = this;
            for (let A = 0; A < k.length; A++)
              a.push(this.kernelArguments[A].getSource(c[A]));
            return a.join("");
          }
          _getInjectedNative() {
            return this.injectedNative || "";
          }
          _getMainConstantsString() {
            let c = [], { constants: a } = this;
            if (a) {
              let k = 0;
              for (let A in a)
                !this.constants.hasOwnProperty(A) || c.push(this.kernelConstants[k++].getSource(this.constants[A]));
            }
            return c.join("");
          }
          getRawValueFramebuffer(c, a) {
            if (this.rawValueFramebuffers[c] || (this.rawValueFramebuffers[c] = {}), !this.rawValueFramebuffers[c][a]) {
              let k = this.context.createFramebuffer();
              k.width = c, k.height = a, this.rawValueFramebuffers[c][a] = k;
            }
            return this.rawValueFramebuffers[c][a];
          }
          getKernelResultDeclaration() {
            switch (this.returnType) {
              case "Array(2)":
                return "vec2 kernelResult";
              case "Array(3)":
                return "vec3 kernelResult";
              case "Array(4)":
                return "vec4 kernelResult";
              case "LiteralInteger":
              case "Float":
              case "Number":
              case "Integer":
                return "float kernelResult";
              default:
                if (this.graphical)
                  return "float kernelResult";
                throw new Error(`unrecognized output type "${this.returnType}"`);
            }
          }
          getKernelString() {
            let c = [this.getKernelResultDeclaration()], { subKernels: a } = this;
            if (a !== null)
              switch (this.returnType) {
                case "Number":
                case "Float":
                case "Integer":
                  for (let k = 0; k < a.length; k++) {
                    let A = a[k];
                    c.push(A.returnType === "Integer" ? `int subKernelResult_${A.name} = 0` : `float subKernelResult_${A.name} = 0.0`);
                  }
                  break;
                case "Array(2)":
                  for (let k = 0; k < a.length; k++)
                    c.push(`vec2 subKernelResult_${a[k].name}`);
                  break;
                case "Array(3)":
                  for (let k = 0; k < a.length; k++)
                    c.push(`vec3 subKernelResult_${a[k].name}`);
                  break;
                case "Array(4)":
                  for (let k = 0; k < a.length; k++)
                    c.push(`vec4 subKernelResult_${a[k].name}`);
                  break;
              }
            return l.linesToString(c) + this.translatedSource;
          }
          getMainResultGraphical() {
            return l.linesToString(["  threadId = indexTo3D(index, uOutputDim)", "  kernel()", "  gl_FragColor = actualColor"]);
          }
          getMainResultPackedPixels() {
            switch (this.returnType) {
              case "LiteralInteger":
              case "Number":
              case "Integer":
              case "Float":
                return this.getMainResultKernelPackedPixels() + this.getMainResultSubKernelPackedPixels();
              default:
                throw new Error(`packed output only usable with Numbers, "${this.returnType}" specified`);
            }
          }
          getMainResultKernelPackedPixels() {
            return l.linesToString(["  threadId = indexTo3D(index, uOutputDim)", "  kernel()", `  gl_FragData[0] = ${this.useLegacyEncoder ? "legacyEncode32" : "encode32"}(kernelResult)`]);
          }
          getMainResultSubKernelPackedPixels() {
            let c = [];
            if (!this.subKernels)
              return "";
            for (let a = 0; a < this.subKernels.length; a++)
              this.subKernels[a].returnType === "Integer" ? c.push(`  gl_FragData[${a + 1}] = ${this.useLegacyEncoder ? "legacyEncode32" : "encode32"}(float(subKernelResult_${this.subKernels[a].name}))`) : c.push(`  gl_FragData[${a + 1}] = ${this.useLegacyEncoder ? "legacyEncode32" : "encode32"}(subKernelResult_${this.subKernels[a].name})`);
            return l.linesToString(c);
          }
          getMainResultMemoryOptimizedFloats() {
            let c = ["  index *= 4"];
            switch (this.returnType) {
              case "Number":
              case "Integer":
              case "Float":
                let a = ["r", "g", "b", "a"];
                for (let k = 0; k < a.length; k++) {
                  let A = a[k];
                  this.getMainResultKernelMemoryOptimizedFloats(c, A), this.getMainResultSubKernelMemoryOptimizedFloats(c, A), k + 1 < a.length && c.push("  index += 1");
                }
                break;
              default:
                throw new Error(`optimized output only usable with Numbers, ${this.returnType} specified`);
            }
            return l.linesToString(c);
          }
          getMainResultKernelMemoryOptimizedFloats(c, a) {
            c.push("  threadId = indexTo3D(index, uOutputDim)", "  kernel()", `  gl_FragData[0].${a} = kernelResult`);
          }
          getMainResultSubKernelMemoryOptimizedFloats(c, a) {
            if (!this.subKernels)
              return c;
            for (let k = 0; k < this.subKernels.length; k++)
              this.subKernels[k].returnType === "Integer" ? c.push(`  gl_FragData[${k + 1}].${a} = float(subKernelResult_${this.subKernels[k].name})`) : c.push(`  gl_FragData[${k + 1}].${a} = subKernelResult_${this.subKernels[k].name}`);
          }
          getMainResultKernelNumberTexture() {
            return ["  threadId = indexTo3D(index, uOutputDim)", "  kernel()", "  gl_FragData[0][0] = kernelResult"];
          }
          getMainResultSubKernelNumberTexture() {
            let c = [];
            if (!this.subKernels)
              return c;
            for (let a = 0; a < this.subKernels.length; ++a) {
              let k = this.subKernels[a];
              k.returnType === "Integer" ? c.push(`  gl_FragData[${a + 1}][0] = float(subKernelResult_${k.name})`) : c.push(`  gl_FragData[${a + 1}][0] = subKernelResult_${k.name}`);
            }
            return c;
          }
          getMainResultKernelArray2Texture() {
            return ["  threadId = indexTo3D(index, uOutputDim)", "  kernel()", "  gl_FragData[0][0] = kernelResult[0]", "  gl_FragData[0][1] = kernelResult[1]"];
          }
          getMainResultSubKernelArray2Texture() {
            let c = [];
            if (!this.subKernels)
              return c;
            for (let a = 0; a < this.subKernels.length; ++a)
              c.push(`  gl_FragData[${a + 1}][0] = subKernelResult_${this.subKernels[a].name}[0]`, `  gl_FragData[${a + 1}][1] = subKernelResult_${this.subKernels[a].name}[1]`);
            return c;
          }
          getMainResultKernelArray3Texture() {
            return ["  threadId = indexTo3D(index, uOutputDim)", "  kernel()", "  gl_FragData[0][0] = kernelResult[0]", "  gl_FragData[0][1] = kernelResult[1]", "  gl_FragData[0][2] = kernelResult[2]"];
          }
          getMainResultSubKernelArray3Texture() {
            let c = [];
            if (!this.subKernels)
              return c;
            for (let a = 0; a < this.subKernels.length; ++a)
              c.push(`  gl_FragData[${a + 1}][0] = subKernelResult_${this.subKernels[a].name}[0]`, `  gl_FragData[${a + 1}][1] = subKernelResult_${this.subKernels[a].name}[1]`, `  gl_FragData[${a + 1}][2] = subKernelResult_${this.subKernels[a].name}[2]`);
            return c;
          }
          getMainResultKernelArray4Texture() {
            return ["  threadId = indexTo3D(index, uOutputDim)", "  kernel()", "  gl_FragData[0] = kernelResult"];
          }
          getMainResultSubKernelArray4Texture() {
            let c = [];
            if (!this.subKernels)
              return c;
            switch (this.returnType) {
              case "Number":
              case "Float":
              case "Integer":
                for (let a = 0; a < this.subKernels.length; ++a)
                  this.subKernels[a].returnType === "Integer" ? c.push(`  gl_FragData[${a + 1}] = float(subKernelResult_${this.subKernels[a].name})`) : c.push(`  gl_FragData[${a + 1}] = subKernelResult_${this.subKernels[a].name}`);
                break;
              case "Array(2)":
                for (let a = 0; a < this.subKernels.length; ++a)
                  c.push(`  gl_FragData[${a + 1}][0] = subKernelResult_${this.subKernels[a].name}[0]`, `  gl_FragData[${a + 1}][1] = subKernelResult_${this.subKernels[a].name}[1]`);
                break;
              case "Array(3)":
                for (let a = 0; a < this.subKernels.length; ++a)
                  c.push(`  gl_FragData[${a + 1}][0] = subKernelResult_${this.subKernels[a].name}[0]`, `  gl_FragData[${a + 1}][1] = subKernelResult_${this.subKernels[a].name}[1]`, `  gl_FragData[${a + 1}][2] = subKernelResult_${this.subKernels[a].name}[2]`);
                break;
              case "Array(4)":
                for (let a = 0; a < this.subKernels.length; ++a)
                  c.push(`  gl_FragData[${a + 1}][0] = subKernelResult_${this.subKernels[a].name}[0]`, `  gl_FragData[${a + 1}][1] = subKernelResult_${this.subKernels[a].name}[1]`, `  gl_FragData[${a + 1}][2] = subKernelResult_${this.subKernels[a].name}[2]`, `  gl_FragData[${a + 1}][3] = subKernelResult_${this.subKernels[a].name}[3]`);
                break;
            }
            return c;
          }
          replaceArtifacts(c, a) {
            return c.replace(/[ ]*__([A-Z]+[0-9]*([_]?[A-Z]*[0-9]?)*)__;\n/g, (k, A) => {
              if (a.hasOwnProperty(A))
                return a[A];
              throw `unhandled artifact ${A}`;
            });
          }
          getFragmentShader(c) {
            return this.compiledFragmentShader !== null ? this.compiledFragmentShader : this.compiledFragmentShader = this.replaceArtifacts(this.constructor.fragmentShader, this._getFragShaderArtifactMap(c));
          }
          getVertexShader(c) {
            return this.compiledVertexShader !== null ? this.compiledVertexShader : this.compiledVertexShader = this.replaceArtifacts(this.constructor.vertexShader, this._getVertShaderArtifactMap(c));
          }
          toString() {
            let c = l.linesToString(["const gl = context"]);
            return i(this.constructor, arguments, this, c);
          }
          destroy(c) {
            if (!this.context)
              return;
            this.buffer && this.context.deleteBuffer(this.buffer), this.framebuffer && this.context.deleteFramebuffer(this.framebuffer);
            for (let k in this.rawValueFramebuffers) {
              for (let A in this.rawValueFramebuffers[k])
                this.context.deleteFramebuffer(this.rawValueFramebuffers[k][A]), delete this.rawValueFramebuffers[k][A];
              delete this.rawValueFramebuffers[k];
            }
            if (this.vertShader && this.context.deleteShader(this.vertShader), this.fragShader && this.context.deleteShader(this.fragShader), this.program && this.context.deleteProgram(this.program), this.texture) {
              this.texture.delete();
              let k = this.textureCache.indexOf(this.texture.texture);
              k > -1 && this.textureCache.splice(k, 1), this.texture = null;
            }
            if (this.mappedTextures && this.mappedTextures.length) {
              for (let k = 0; k < this.mappedTextures.length; k++) {
                let A = this.mappedTextures[k];
                A.delete();
                let N = this.textureCache.indexOf(A.texture);
                N > -1 && this.textureCache.splice(N, 1);
              }
              this.mappedTextures = null;
            }
            if (this.kernelArguments)
              for (let k = 0; k < this.kernelArguments.length; k++)
                this.kernelArguments[k].destroy();
            if (this.kernelConstants)
              for (let k = 0; k < this.kernelConstants.length; k++)
                this.kernelConstants[k].destroy();
            for (; this.textureCache.length > 0; ) {
              let k = this.textureCache.pop();
              this.context.deleteTexture(k);
            }
            if (c) {
              let k = b.indexOf(this.canvas);
              k >= 0 && (b[k] = null, T[k] = null);
            }
            if (this.destroyExtensions(), delete this.context, delete this.canvas, !this.gpu)
              return;
            let a = this.gpu.kernels.indexOf(this);
            a !== -1 && this.gpu.kernels.splice(a, 1);
          }
          destroyExtensions() {
            this.extensions.OES_texture_float = null, this.extensions.OES_texture_float_linear = null, this.extensions.OES_element_index_uint = null, this.extensions.WEBGL_draw_buffers = null;
          }
          static destroyContext(c) {
            let a = c.getExtension("WEBGL_lose_context");
            a && a.loseContext();
          }
          toJSON() {
            let c = super.toJSON();
            return c.functionNodes = g.fromKernel(this, f).toJSON(), c.settings.threadDim = this.threadDim, c;
          }
        }
        y.exports = { WebGLKernel: C };
      }, { "../../plugins/math-random-uniformly-distributed": 112, "../../utils": 114, "../function-builder": 9, "../gl/kernel": 13, "../gl/kernel-string": 12, "./fragment-shader": 37, "./function-node": 38, "./kernel-value-maps": 39, "./vertex-shader": 71 }], 71: [function(o, y, E) {
        let p = `__FLOAT_TACTIC_DECLARATION__;
      __INT_TACTIC_DECLARATION__;
      __SAMPLER_2D_TACTIC_DECLARATION__;
      
      attribute vec2 aPos;
      attribute vec2 aTexCoord;
      
      varying vec2 vTexCoord;
      uniform vec2 ratio;
      
      void main(void) {
        gl_Position = vec4((aPos + vec2(1)) * ratio + vec2(-1), 0, 1);
        vTexCoord = aTexCoord;
      }`;
        y.exports = { vertexShader: p };
      }, {}], 72: [function(o, y, E) {
        let p = `#version 300 es
      __HEADER__;
      __FLOAT_TACTIC_DECLARATION__;
      __INT_TACTIC_DECLARATION__;
      __SAMPLER_2D_TACTIC_DECLARATION__;
      __SAMPLER_2D_ARRAY_TACTIC_DECLARATION__;
      
      const int LOOP_MAX = __LOOP_MAX__;
      
      __PLUGINS__;
      __CONSTANTS__;
      
      in vec2 vTexCoord;
      
      float atan2(float v1, float v2) {
        if (v1 == 0.0 || v2 == 0.0) return 0.0;
        return atan(v1 / v2);
      }
      
      float cbrt(float x) {
        if (x >= 0.0) {
          return pow(x, 1.0 / 3.0);
        } else {
          return -pow(x, 1.0 / 3.0);
        }
      }
      
      float expm1(float x) {
        return pow(${Math.E}, x) - 1.0; 
      }
      
      float fround(highp float x) {
        return x;
      }
      
      float imul(float v1, float v2) {
        return float(int(v1) * int(v2));
      }
      
      float log10(float x) {
        return log2(x) * (1.0 / log2(10.0));
      }
      
      float log1p(float x) {
        return log(1.0 + x);
      }
      
      float _pow(float v1, float v2) {
        if (v2 == 0.0) return 1.0;
        return pow(v1, v2);
      }
      
      float _round(float x) {
        return floor(x + 0.5);
      }
      
      
      const int BIT_COUNT = 32;
      int modi(int x, int y) {
        return x - y * (x / y);
      }
      
      int bitwiseOr(int a, int b) {
        int result = 0;
        int n = 1;
        
        for (int i = 0; i < BIT_COUNT; i++) {
          if ((modi(a, 2) == 1) || (modi(b, 2) == 1)) {
            result += n;
          }
          a = a / 2;
          b = b / 2;
          n = n * 2;
          if(!(a > 0 || b > 0)) {
            break;
          }
        }
        return result;
      }
      int bitwiseXOR(int a, int b) {
        int result = 0;
        int n = 1;
        
        for (int i = 0; i < BIT_COUNT; i++) {
          if ((modi(a, 2) == 1) != (modi(b, 2) == 1)) {
            result += n;
          }
          a = a / 2;
          b = b / 2;
          n = n * 2;
          if(!(a > 0 || b > 0)) {
            break;
          }
        }
        return result;
      }
      int bitwiseAnd(int a, int b) {
        int result = 0;
        int n = 1;
        for (int i = 0; i < BIT_COUNT; i++) {
          if ((modi(a, 2) == 1) && (modi(b, 2) == 1)) {
            result += n;
          }
          a = a / 2;
          b = b / 2;
          n = n * 2;
          if(!(a > 0 && b > 0)) {
            break;
          }
        }
        return result;
      }
      int bitwiseNot(int a) {
        int result = 0;
        int n = 1;
        
        for (int i = 0; i < BIT_COUNT; i++) {
          if (modi(a, 2) == 0) {
            result += n;    
          }
          a = a / 2;
          n = n * 2;
        }
        return result;
      }
      int bitwiseZeroFillLeftShift(int n, int shift) {
        int maxBytes = BIT_COUNT;
        for (int i = 0; i < BIT_COUNT; i++) {
          if (maxBytes >= n) {
            break;
          }
          maxBytes *= 2;
        }
        for (int i = 0; i < BIT_COUNT; i++) {
          if (i >= shift) {
            break;
          }
          n *= 2;
        }
      
        int result = 0;
        int byteVal = 1;
        for (int i = 0; i < BIT_COUNT; i++) {
          if (i >= maxBytes) break;
          if (modi(n, 2) > 0) { result += byteVal; }
          n = int(n / 2);
          byteVal *= 2;
        }
        return result;
      }
      
      int bitwiseSignedRightShift(int num, int shifts) {
        return int(floor(float(num) / pow(2.0, float(shifts))));
      }
      
      int bitwiseZeroFillRightShift(int n, int shift) {
        int maxBytes = BIT_COUNT;
        for (int i = 0; i < BIT_COUNT; i++) {
          if (maxBytes >= n) {
            break;
          }
          maxBytes *= 2;
        }
        for (int i = 0; i < BIT_COUNT; i++) {
          if (i >= shift) {
            break;
          }
          n /= 2;
        }
        int result = 0;
        int byteVal = 1;
        for (int i = 0; i < BIT_COUNT; i++) {
          if (i >= maxBytes) break;
          if (modi(n, 2) > 0) { result += byteVal; }
          n = int(n / 2);
          byteVal *= 2;
        }
        return result;
      }
      
      vec2 integerMod(vec2 x, float y) {
        vec2 res = floor(mod(x, y));
        return res * step(1.0 - floor(y), -res);
      }
      
      vec3 integerMod(vec3 x, float y) {
        vec3 res = floor(mod(x, y));
        return res * step(1.0 - floor(y), -res);
      }
      
      vec4 integerMod(vec4 x, vec4 y) {
        vec4 res = floor(mod(x, y));
        return res * step(1.0 - floor(y), -res);
      }
      
      float integerMod(float x, float y) {
        float res = floor(mod(x, y));
        return res * (res > floor(y) - 1.0 ? 0.0 : 1.0);
      }
      
      int integerMod(int x, int y) {
        return x - (y * int(x/y));
      }
      
      __DIVIDE_WITH_INTEGER_CHECK__;
      
      // Here be dragons!
      // DO NOT OPTIMIZE THIS CODE
      // YOU WILL BREAK SOMETHING ON SOMEBODY'S MACHINE
      // LEAVE IT AS IT IS, LEST YOU WASTE YOUR OWN TIME
      const vec2 MAGIC_VEC = vec2(1.0, -256.0);
      const vec4 SCALE_FACTOR = vec4(1.0, 256.0, 65536.0, 0.0);
      const vec4 SCALE_FACTOR_INV = vec4(1.0, 0.00390625, 0.0000152587890625, 0.0); // 1, 1/256, 1/65536
      float decode32(vec4 texel) {
        __DECODE32_ENDIANNESS__;
        texel *= 255.0;
        vec2 gte128;
        gte128.x = texel.b >= 128.0 ? 1.0 : 0.0;
        gte128.y = texel.a >= 128.0 ? 1.0 : 0.0;
        float exponent = 2.0 * texel.a - 127.0 + dot(gte128, MAGIC_VEC);
        float res = exp2(round(exponent));
        texel.b = texel.b - 128.0 * gte128.x;
        res = dot(texel, SCALE_FACTOR) * exp2(round(exponent-23.0)) + res;
        res *= gte128.y * -2.0 + 1.0;
        return res;
      }
      
      float decode16(vec4 texel, int index) {
        int channel = integerMod(index, 2);
        return texel[channel*2] * 255.0 + texel[channel*2 + 1] * 65280.0;
      }
      
      float decode8(vec4 texel, int index) {
        int channel = integerMod(index, 4);
        return texel[channel] * 255.0;
      }
      
      vec4 legacyEncode32(float f) {
        float F = abs(f);
        float sign = f < 0.0 ? 1.0 : 0.0;
        float exponent = floor(log2(F));
        float mantissa = (exp2(-exponent) * F);
        // exponent += floor(log2(mantissa));
        vec4 texel = vec4(F * exp2(23.0-exponent)) * SCALE_FACTOR_INV;
        texel.rg = integerMod(texel.rg, 256.0);
        texel.b = integerMod(texel.b, 128.0);
        texel.a = exponent*0.5 + 63.5;
        texel.ba += vec2(integerMod(exponent+127.0, 2.0), sign) * 128.0;
        texel = floor(texel);
        texel *= 0.003921569; // 1/255
        __ENCODE32_ENDIANNESS__;
        return texel;
      }
      
      // https://github.com/gpujs/gpu.js/wiki/Encoder-details
      vec4 encode32(float value) {
        if (value == 0.0) return vec4(0, 0, 0, 0);
      
        float exponent;
        float mantissa;
        vec4  result;
        float sgn;
      
        sgn = step(0.0, -value);
        value = abs(value);
      
        exponent = floor(log2(value));
      
        mantissa = value*pow(2.0, -exponent)-1.0;
        exponent = exponent+127.0;
        result   = vec4(0,0,0,0);
      
        result.a = floor(exponent/2.0);
        exponent = exponent - result.a*2.0;
        result.a = result.a + 128.0*sgn;
      
        result.b = floor(mantissa * 128.0);
        mantissa = mantissa - result.b / 128.0;
        result.b = result.b + exponent*128.0;
      
        result.g = floor(mantissa*32768.0);
        mantissa = mantissa - result.g/32768.0;
      
        result.r = floor(mantissa*8388608.0);
        return result/255.0;
      }
      // Dragons end here
      
      int index;
      ivec3 threadId;
      
      ivec3 indexTo3D(int idx, ivec3 texDim) {
        int z = int(idx / (texDim.x * texDim.y));
        idx -= z * int(texDim.x * texDim.y);
        int y = int(idx / texDim.x);
        int x = int(integerMod(idx, texDim.x));
        return ivec3(x, y, z);
      }
      
      float get32(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
        int index = x + texDim.x * (y + texDim.y * z);
        int w = texSize.x;
        vec2 st = vec2(float(integerMod(index, w)), float(index / w)) + 0.5;
        vec4 texel = texture(tex, st / vec2(texSize));
        return decode32(texel);
      }
      
      float get16(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
        int index = x + (texDim.x * (y + (texDim.y * z)));
        int w = texSize.x * 2;
        vec2 st = vec2(float(integerMod(index, w)), float(index / w)) + 0.5;
        vec4 texel = texture(tex, st / vec2(texSize.x * 2, texSize.y));
        return decode16(texel, index);
      }
      
      float get8(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
        int index = x + (texDim.x * (y + (texDim.y * z)));
        int w = texSize.x * 4;
        vec2 st = vec2(float(integerMod(index, w)), float(index / w)) + 0.5;
        vec4 texel = texture(tex, st / vec2(texSize.x * 4, texSize.y));
        return decode8(texel, index);
      }
      
      float getMemoryOptimized32(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
        int index = x + (texDim.x * (y + (texDim.y * z)));
        int channel = integerMod(index, 4);
        index = index / 4;
        int w = texSize.x;
        vec2 st = vec2(float(integerMod(index, w)), float(index / w)) + 0.5;
        index = index / 4;
        vec4 texel = texture(tex, st / vec2(texSize));
        return texel[channel];
      }
      
      vec4 getImage2D(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
        int index = x + texDim.x * (y + texDim.y * z);
        int w = texSize.x;
        vec2 st = vec2(float(integerMod(index, w)), float(index / w)) + 0.5;
        return texture(tex, st / vec2(texSize));
      }
      
      vec4 getImage3D(sampler2DArray tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
        int index = x + texDim.x * (y + texDim.y * z);
        int w = texSize.x;
        vec2 st = vec2(float(integerMod(index, w)), float(index / w)) + 0.5;
        return texture(tex, vec3(st / vec2(texSize), z));
      }
      
      float getFloatFromSampler2D(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
        vec4 result = getImage2D(tex, texSize, texDim, z, y, x);
        return result[0];
      }
      
      vec2 getVec2FromSampler2D(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
        vec4 result = getImage2D(tex, texSize, texDim, z, y, x);
        return vec2(result[0], result[1]);
      }
      
      vec2 getMemoryOptimizedVec2(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
        int index = x + texDim.x * (y + texDim.y * z);
        int channel = integerMod(index, 2);
        index = index / 2;
        int w = texSize.x;
        vec2 st = vec2(float(integerMod(index, w)), float(index / w)) + 0.5;
        vec4 texel = texture(tex, st / vec2(texSize));
        if (channel == 0) return vec2(texel.r, texel.g);
        if (channel == 1) return vec2(texel.b, texel.a);
        return vec2(0.0, 0.0);
      }
      
      vec3 getVec3FromSampler2D(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
        vec4 result = getImage2D(tex, texSize, texDim, z, y, x);
        return vec3(result[0], result[1], result[2]);
      }
      
      vec3 getMemoryOptimizedVec3(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
        int fieldIndex = 3 * (x + texDim.x * (y + texDim.y * z));
        int vectorIndex = fieldIndex / 4;
        int vectorOffset = fieldIndex - vectorIndex * 4;
        int readY = vectorIndex / texSize.x;
        int readX = vectorIndex - readY * texSize.x;
        vec4 tex1 = texture(tex, (vec2(readX, readY) + 0.5) / vec2(texSize));
      
        if (vectorOffset == 0) {
          return tex1.xyz;
        } else if (vectorOffset == 1) {
          return tex1.yzw;
        } else {
          readX++;
          if (readX >= texSize.x) {
            readX = 0;
            readY++;
          }
          vec4 tex2 = texture(tex, vec2(readX, readY) / vec2(texSize));
          if (vectorOffset == 2) {
            return vec3(tex1.z, tex1.w, tex2.x);
          } else {
            return vec3(tex1.w, tex2.x, tex2.y);
          }
        }
      }
      
      vec4 getVec4FromSampler2D(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
        return getImage2D(tex, texSize, texDim, z, y, x);
      }
      
      vec4 getMemoryOptimizedVec4(sampler2D tex, ivec2 texSize, ivec3 texDim, int z, int y, int x) {
        int index = x + texDim.x * (y + texDim.y * z);
        int channel = integerMod(index, 2);
        int w = texSize.x;
        vec2 st = vec2(float(integerMod(index, w)), float(index / w)) + 0.5;
        vec4 texel = texture(tex, st / vec2(texSize));
        return vec4(texel.r, texel.g, texel.b, texel.a);
      }
      
      vec4 actualColor;
      void color(float r, float g, float b, float a) {
        actualColor = vec4(r,g,b,a);
      }
      
      void color(float r, float g, float b) {
        color(r,g,b,1.0);
      }
      
      float modulo(float number, float divisor) {
        if (number < 0.0) {
          number = abs(number);
          if (divisor < 0.0) {
            divisor = abs(divisor);
          }
          return -mod(number, divisor);
        }
        if (divisor < 0.0) {
          divisor = abs(divisor);
        }
        return mod(number, divisor);
      }
      
      __INJECTED_NATIVE__;
      __MAIN_CONSTANTS__;
      __MAIN_ARGUMENTS__;
      __KERNEL__;
      
      void main(void) {
        index = int(vTexCoord.s * float(uTexSize.x)) + int(vTexCoord.t * float(uTexSize.y)) * uTexSize.x;
        __MAIN_RESULT__;
      }`;
        y.exports = { fragmentShader: p };
      }, {}], 73: [function(o, y, E) {
        let { utils: p } = o("../../utils"), { WebGLFunctionNode: g } = o("../web-gl/function-node");
        class f extends g {
          astIdentifierExpression(n, s) {
            if (n.type !== "Identifier")
              throw this.astErrorOutput("IdentifierExpression - not an Identifier", n);
            let t = this.getType(n), i = p.sanitizeName(n.name);
            return n.name === "Infinity" ? s.push("intBitsToFloat(2139095039)") : t === "Boolean" ? this.argumentNames.indexOf(i) > -1 ? s.push(`bool(user_${i})`) : s.push(`user_${i}`) : s.push(`user_${i}`), s;
          }
        }
        y.exports = { WebGL2FunctionNode: f };
      }, { "../../utils": 114, "../web-gl/function-node": 38 }], 74: [function(o, y, E) {
        let { WebGL2KernelValueBoolean: p } = o("./kernel-value/boolean"), { WebGL2KernelValueFloat: g } = o("./kernel-value/float"), { WebGL2KernelValueInteger: f } = o("./kernel-value/integer"), { WebGL2KernelValueHTMLImage: l } = o("./kernel-value/html-image"), { WebGL2KernelValueDynamicHTMLImage: n } = o("./kernel-value/dynamic-html-image"), { WebGL2KernelValueHTMLImageArray: s } = o("./kernel-value/html-image-array"), { WebGL2KernelValueDynamicHTMLImageArray: t } = o("./kernel-value/dynamic-html-image-array"), { WebGL2KernelValueHTMLVideo: i } = o("./kernel-value/html-video"), { WebGL2KernelValueDynamicHTMLVideo: u } = o("./kernel-value/dynamic-html-video"), { WebGL2KernelValueSingleInput: x2 } = o("./kernel-value/single-input"), { WebGL2KernelValueDynamicSingleInput: w } = o("./kernel-value/dynamic-single-input"), { WebGL2KernelValueUnsignedInput: m } = o("./kernel-value/unsigned-input"), { WebGL2KernelValueDynamicUnsignedInput: S } = o("./kernel-value/dynamic-unsigned-input"), { WebGL2KernelValueMemoryOptimizedNumberTexture: v } = o("./kernel-value/memory-optimized-number-texture"), { WebGL2KernelValueDynamicMemoryOptimizedNumberTexture: h } = o("./kernel-value/dynamic-memory-optimized-number-texture"), { WebGL2KernelValueNumberTexture: b } = o("./kernel-value/number-texture"), { WebGL2KernelValueDynamicNumberTexture: T } = o("./kernel-value/dynamic-number-texture"), { WebGL2KernelValueSingleArray: C } = o("./kernel-value/single-array"), { WebGL2KernelValueDynamicSingleArray: V } = o("./kernel-value/dynamic-single-array"), { WebGL2KernelValueSingleArray1DI: c } = o("./kernel-value/single-array1d-i"), { WebGL2KernelValueDynamicSingleArray1DI: a } = o("./kernel-value/dynamic-single-array1d-i"), { WebGL2KernelValueSingleArray2DI: k } = o("./kernel-value/single-array2d-i"), { WebGL2KernelValueDynamicSingleArray2DI: A } = o("./kernel-value/dynamic-single-array2d-i"), { WebGL2KernelValueSingleArray3DI: N } = o("./kernel-value/single-array3d-i"), { WebGL2KernelValueDynamicSingleArray3DI: F } = o("./kernel-value/dynamic-single-array3d-i"), { WebGL2KernelValueSingleArray2: R } = o("./kernel-value/single-array2"), { WebGL2KernelValueSingleArray3: K } = o("./kernel-value/single-array3"), { WebGL2KernelValueSingleArray4: O } = o("./kernel-value/single-array4"), { WebGL2KernelValueUnsignedArray: X } = o("./kernel-value/unsigned-array"), { WebGL2KernelValueDynamicUnsignedArray: B } = o("./kernel-value/dynamic-unsigned-array"), P = { unsigned: { dynamic: { Boolean: p, Integer: f, Float: g, Array: B, "Array(2)": false, "Array(3)": false, "Array(4)": false, "Array1D(2)": false, "Array1D(3)": false, "Array1D(4)": false, "Array2D(2)": false, "Array2D(3)": false, "Array2D(4)": false, "Array3D(2)": false, "Array3D(3)": false, "Array3D(4)": false, Input: S, NumberTexture: T, "ArrayTexture(1)": T, "ArrayTexture(2)": T, "ArrayTexture(3)": T, "ArrayTexture(4)": T, MemoryOptimizedNumberTexture: h, HTMLCanvas: n, HTMLImage: n, HTMLImageArray: t, HTMLVideo: u }, static: { Boolean: p, Float: g, Integer: f, Array: X, "Array(2)": false, "Array(3)": false, "Array(4)": false, "Array1D(2)": false, "Array1D(3)": false, "Array1D(4)": false, "Array2D(2)": false, "Array2D(3)": false, "Array2D(4)": false, "Array3D(2)": false, "Array3D(3)": false, "Array3D(4)": false, Input: m, NumberTexture: b, "ArrayTexture(1)": b, "ArrayTexture(2)": b, "ArrayTexture(3)": b, "ArrayTexture(4)": b, MemoryOptimizedNumberTexture: h, HTMLCanvas: l, HTMLImage: l, HTMLImageArray: s, HTMLVideo: i } }, single: { dynamic: { Boolean: p, Integer: f, Float: g, Array: V, "Array(2)": R, "Array(3)": K, "Array(4)": O, "Array1D(2)": a, "Array1D(3)": a, "Array1D(4)": a, "Array2D(2)": A, "Array2D(3)": A, "Array2D(4)": A, "Array3D(2)": F, "Array3D(3)": F, "Array3D(4)": F, Input: w, NumberTexture: T, "ArrayTexture(1)": T, "ArrayTexture(2)": T, "ArrayTexture(3)": T, "ArrayTexture(4)": T, MemoryOptimizedNumberTexture: h, HTMLCanvas: n, HTMLImage: n, HTMLImageArray: t, HTMLVideo: u }, static: { Boolean: p, Float: g, Integer: f, Array: C, "Array(2)": R, "Array(3)": K, "Array(4)": O, "Array1D(2)": c, "Array1D(3)": c, "Array1D(4)": c, "Array2D(2)": k, "Array2D(3)": k, "Array2D(4)": k, "Array3D(2)": N, "Array3D(3)": N, "Array3D(4)": N, Input: x2, NumberTexture: b, "ArrayTexture(1)": b, "ArrayTexture(2)": b, "ArrayTexture(3)": b, "ArrayTexture(4)": b, MemoryOptimizedNumberTexture: v, HTMLCanvas: l, HTMLImage: l, HTMLImageArray: s, HTMLVideo: i } } };
        function Y(J, q, j, U) {
          if (!J)
            throw new Error("type missing");
          if (!q)
            throw new Error("dynamic missing");
          if (!j)
            throw new Error("precision missing");
          U.type && (J = U.type);
          let oe = P[j][q];
          if (oe[J] === false)
            return null;
          if (oe[J] === void 0)
            throw new Error(`Could not find a KernelValue for ${J}`);
          return oe[J];
        }
        y.exports = { kernelValueMaps: P, lookupKernelValueType: Y };
      }, { "./kernel-value/boolean": 75, "./kernel-value/dynamic-html-image": 77, "./kernel-value/dynamic-html-image-array": 76, "./kernel-value/dynamic-html-video": 78, "./kernel-value/dynamic-memory-optimized-number-texture": 79, "./kernel-value/dynamic-number-texture": 80, "./kernel-value/dynamic-single-array": 81, "./kernel-value/dynamic-single-array1d-i": 82, "./kernel-value/dynamic-single-array2d-i": 83, "./kernel-value/dynamic-single-array3d-i": 84, "./kernel-value/dynamic-single-input": 85, "./kernel-value/dynamic-unsigned-array": 86, "./kernel-value/dynamic-unsigned-input": 87, "./kernel-value/float": 88, "./kernel-value/html-image": 90, "./kernel-value/html-image-array": 89, "./kernel-value/html-video": 91, "./kernel-value/integer": 92, "./kernel-value/memory-optimized-number-texture": 93, "./kernel-value/number-texture": 94, "./kernel-value/single-array": 95, "./kernel-value/single-array1d-i": 96, "./kernel-value/single-array2": 97, "./kernel-value/single-array2d-i": 98, "./kernel-value/single-array3": 99, "./kernel-value/single-array3d-i": 100, "./kernel-value/single-array4": 101, "./kernel-value/single-input": 102, "./kernel-value/unsigned-array": 103, "./kernel-value/unsigned-input": 104 }], 75: [function(o, y, E) {
        let { WebGLKernelValueBoolean: p } = o("../../web-gl/kernel-value/boolean");
        class g extends p {
        }
        y.exports = { WebGL2KernelValueBoolean: g };
      }, { "../../web-gl/kernel-value/boolean": 41 }], 76: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { WebGL2KernelValueHTMLImageArray: g } = o("./html-image-array");
        class f extends g {
          getSource() {
            let n = this.getVariablePrecisionString();
            return p.linesToString([`uniform ${n} sampler2DArray ${this.id}`, `uniform ${n} ivec2 ${this.sizeId}`, `uniform ${n} ivec3 ${this.dimensionsId}`]);
          }
          updateValue(n) {
            let { width: s, height: t } = n[0];
            this.checkSize(s, t), this.dimensions = [s, t, n.length], this.textureSize = [s, t], this.kernel.setUniform3iv(this.dimensionsId, this.dimensions), this.kernel.setUniform2iv(this.sizeId, this.textureSize), super.updateValue(n);
          }
        }
        y.exports = { WebGL2KernelValueDynamicHTMLImageArray: f };
      }, { "../../../utils": 114, "./html-image-array": 89 }], 77: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { WebGLKernelValueDynamicHTMLImage: g } = o("../../web-gl/kernel-value/dynamic-html-image");
        class f extends g {
          getSource() {
            let n = this.getVariablePrecisionString();
            return p.linesToString([`uniform ${n} sampler2D ${this.id}`, `uniform ${n} ivec2 ${this.sizeId}`, `uniform ${n} ivec3 ${this.dimensionsId}`]);
          }
        }
        y.exports = { WebGL2KernelValueDynamicHTMLImage: f };
      }, { "../../../utils": 114, "../../web-gl/kernel-value/dynamic-html-image": 42 }], 78: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { WebGL2KernelValueDynamicHTMLImage: g } = o("./dynamic-html-image");
        class f extends g {
        }
        y.exports = { WebGL2KernelValueDynamicHTMLVideo: f };
      }, { "../../../utils": 114, "./dynamic-html-image": 77 }], 79: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { WebGLKernelValueDynamicMemoryOptimizedNumberTexture: g } = o("../../web-gl/kernel-value/dynamic-memory-optimized-number-texture");
        class f extends g {
          getSource() {
            return p.linesToString([`uniform sampler2D ${this.id}`, `uniform ivec2 ${this.sizeId}`, `uniform ivec3 ${this.dimensionsId}`]);
          }
        }
        y.exports = { WebGL2KernelValueDynamicMemoryOptimizedNumberTexture: f };
      }, { "../../../utils": 114, "../../web-gl/kernel-value/dynamic-memory-optimized-number-texture": 44 }], 80: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { WebGLKernelValueDynamicNumberTexture: g } = o("../../web-gl/kernel-value/dynamic-number-texture");
        class f extends g {
          getSource() {
            let n = this.getVariablePrecisionString();
            return p.linesToString([`uniform ${n} sampler2D ${this.id}`, `uniform ${n} ivec2 ${this.sizeId}`, `uniform ${n} ivec3 ${this.dimensionsId}`]);
          }
        }
        y.exports = { WebGL2KernelValueDynamicNumberTexture: f };
      }, { "../../../utils": 114, "../../web-gl/kernel-value/dynamic-number-texture": 45 }], 81: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { WebGL2KernelValueSingleArray: g } = o("../../web-gl2/kernel-value/single-array");
        class f extends g {
          getSource() {
            let n = this.getVariablePrecisionString();
            return p.linesToString([`uniform ${n} sampler2D ${this.id}`, `uniform ${n} ivec2 ${this.sizeId}`, `uniform ${n} ivec3 ${this.dimensionsId}`]);
          }
          updateValue(n) {
            this.dimensions = p.getDimensions(n, true), this.textureSize = p.getMemoryOptimizedFloatTextureSize(this.dimensions, this.bitRatio), this.uploadArrayLength = this.textureSize[0] * this.textureSize[1] * this.bitRatio, this.checkSize(this.textureSize[0], this.textureSize[1]), this.uploadValue = new Float32Array(this.uploadArrayLength), this.kernel.setUniform3iv(this.dimensionsId, this.dimensions), this.kernel.setUniform2iv(this.sizeId, this.textureSize), super.updateValue(n);
          }
        }
        y.exports = { WebGL2KernelValueDynamicSingleArray: f };
      }, { "../../../utils": 114, "../../web-gl2/kernel-value/single-array": 95 }], 82: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { WebGL2KernelValueSingleArray1DI: g } = o("../../web-gl2/kernel-value/single-array1d-i");
        class f extends g {
          getSource() {
            let n = this.getVariablePrecisionString();
            return p.linesToString([`uniform ${n} sampler2D ${this.id}`, `uniform ${n} ivec2 ${this.sizeId}`, `uniform ${n} ivec3 ${this.dimensionsId}`]);
          }
          updateValue(n) {
            this.setShape(n), this.kernel.setUniform3iv(this.dimensionsId, this.dimensions), this.kernel.setUniform2iv(this.sizeId, this.textureSize), super.updateValue(n);
          }
        }
        y.exports = { WebGL2KernelValueDynamicSingleArray1DI: f };
      }, { "../../../utils": 114, "../../web-gl2/kernel-value/single-array1d-i": 96 }], 83: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { WebGL2KernelValueSingleArray2DI: g } = o("../../web-gl2/kernel-value/single-array2d-i");
        class f extends g {
          getSource() {
            let n = this.getVariablePrecisionString();
            return p.linesToString([`uniform ${n} sampler2D ${this.id}`, `uniform ${n} ivec2 ${this.sizeId}`, `uniform ${n} ivec3 ${this.dimensionsId}`]);
          }
          updateValue(n) {
            this.setShape(n), this.kernel.setUniform3iv(this.dimensionsId, this.dimensions), this.kernel.setUniform2iv(this.sizeId, this.textureSize), super.updateValue(n);
          }
        }
        y.exports = { WebGL2KernelValueDynamicSingleArray2DI: f };
      }, { "../../../utils": 114, "../../web-gl2/kernel-value/single-array2d-i": 98 }], 84: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { WebGL2KernelValueSingleArray3DI: g } = o("../../web-gl2/kernel-value/single-array3d-i");
        class f extends g {
          getSource() {
            let n = this.getVariablePrecisionString();
            return p.linesToString([`uniform ${n} sampler2D ${this.id}`, `uniform ${n} ivec2 ${this.sizeId}`, `uniform ${n} ivec3 ${this.dimensionsId}`]);
          }
          updateValue(n) {
            this.setShape(n), this.kernel.setUniform3iv(this.dimensionsId, this.dimensions), this.kernel.setUniform2iv(this.sizeId, this.textureSize), super.updateValue(n);
          }
        }
        y.exports = { WebGL2KernelValueDynamicSingleArray3DI: f };
      }, { "../../../utils": 114, "../../web-gl2/kernel-value/single-array3d-i": 100 }], 85: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { WebGL2KernelValueSingleInput: g } = o("../../web-gl2/kernel-value/single-input");
        class f extends g {
          getSource() {
            let n = this.getVariablePrecisionString();
            return p.linesToString([`uniform ${n} sampler2D ${this.id}`, `uniform ${n} ivec2 ${this.sizeId}`, `uniform ${n} ivec3 ${this.dimensionsId}`]);
          }
          updateValue(n) {
            let [s, t, i] = n.size;
            this.dimensions = new Int32Array([s || 1, t || 1, i || 1]), this.textureSize = p.getMemoryOptimizedFloatTextureSize(this.dimensions, this.bitRatio), this.uploadArrayLength = this.textureSize[0] * this.textureSize[1] * this.bitRatio, this.checkSize(this.textureSize[0], this.textureSize[1]), this.uploadValue = new Float32Array(this.uploadArrayLength), this.kernel.setUniform3iv(this.dimensionsId, this.dimensions), this.kernel.setUniform2iv(this.sizeId, this.textureSize), super.updateValue(n);
          }
        }
        y.exports = { WebGL2KernelValueDynamicSingleInput: f };
      }, { "../../../utils": 114, "../../web-gl2/kernel-value/single-input": 102 }], 86: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { WebGLKernelValueDynamicUnsignedArray: g } = o("../../web-gl/kernel-value/dynamic-unsigned-array");
        class f extends g {
          getSource() {
            let n = this.getVariablePrecisionString();
            return p.linesToString([`uniform ${n} sampler2D ${this.id}`, `uniform ${n} ivec2 ${this.sizeId}`, `uniform ${n} ivec3 ${this.dimensionsId}`]);
          }
        }
        y.exports = { WebGL2KernelValueDynamicUnsignedArray: f };
      }, { "../../../utils": 114, "../../web-gl/kernel-value/dynamic-unsigned-array": 51 }], 87: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { WebGLKernelValueDynamicUnsignedInput: g } = o("../../web-gl/kernel-value/dynamic-unsigned-input");
        class f extends g {
          getSource() {
            let n = this.getVariablePrecisionString();
            return p.linesToString([`uniform ${n} sampler2D ${this.id}`, `uniform ${n} ivec2 ${this.sizeId}`, `uniform ${n} ivec3 ${this.dimensionsId}`]);
          }
        }
        y.exports = { WebGL2KernelValueDynamicUnsignedInput: f };
      }, { "../../../utils": 114, "../../web-gl/kernel-value/dynamic-unsigned-input": 52 }], 88: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { WebGLKernelValueFloat: g } = o("../../web-gl/kernel-value/float");
        class f extends g {
        }
        y.exports = { WebGL2KernelValueFloat: f };
      }, { "../../../utils": 114, "../../web-gl/kernel-value/float": 53 }], 89: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { WebGLKernelArray: g } = o("../../web-gl/kernel-value/array");
        class f extends g {
          constructor(n, s) {
            super(n, s), this.checkSize(n[0].width, n[0].height), this.dimensions = [n[0].width, n[0].height, n.length], this.textureSize = [n[0].width, n[0].height];
          }
          defineTexture() {
            let { context: n } = this;
            n.activeTexture(this.contextHandle), n.bindTexture(n.TEXTURE_2D_ARRAY, this.texture), n.texParameteri(n.TEXTURE_2D_ARRAY, n.TEXTURE_MAG_FILTER, n.NEAREST), n.texParameteri(n.TEXTURE_2D_ARRAY, n.TEXTURE_MIN_FILTER, n.NEAREST);
          }
          getStringValueHandler() {
            return `const uploadValue_${this.name} = ${this.varName};
`;
          }
          getSource() {
            let n = this.getVariablePrecisionString();
            return p.linesToString([`uniform ${n} sampler2DArray ${this.id}`, `${n} ivec2 ${this.sizeId} = ivec2(${this.textureSize[0]}, ${this.textureSize[1]})`, `${n} ivec3 ${this.dimensionsId} = ivec3(${this.dimensions[0]}, ${this.dimensions[1]}, ${this.dimensions[2]})`]);
          }
          updateValue(n) {
            let { context: s } = this;
            s.activeTexture(this.contextHandle), s.bindTexture(s.TEXTURE_2D_ARRAY, this.texture), s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL, true), s.texImage3D(s.TEXTURE_2D_ARRAY, 0, s.RGBA, n[0].width, n[0].height, n.length, 0, s.RGBA, s.UNSIGNED_BYTE, null);
            for (let t = 0; t < n.length; t++)
              s.texSubImage3D(s.TEXTURE_2D_ARRAY, 0, 0, 0, t, n[t].width, n[t].height, 1, s.RGBA, s.UNSIGNED_BYTE, this.uploadValue = n[t]);
            this.kernel.setUniform1i(this.id, this.index);
          }
        }
        y.exports = { WebGL2KernelValueHTMLImageArray: f };
      }, { "../../../utils": 114, "../../web-gl/kernel-value/array": 40 }], 90: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { WebGLKernelValueHTMLImage: g } = o("../../web-gl/kernel-value/html-image");
        class f extends g {
          getSource() {
            let n = this.getVariablePrecisionString();
            return p.linesToString([`uniform ${n} sampler2D ${this.id}`, `${n} ivec2 ${this.sizeId} = ivec2(${this.textureSize[0]}, ${this.textureSize[1]})`, `${n} ivec3 ${this.dimensionsId} = ivec3(${this.dimensions[0]}, ${this.dimensions[1]}, ${this.dimensions[2]})`]);
          }
        }
        y.exports = { WebGL2KernelValueHTMLImage: f };
      }, { "../../../utils": 114, "../../web-gl/kernel-value/html-image": 54 }], 91: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { WebGL2KernelValueHTMLImage: g } = o("./html-image");
        class f extends g {
        }
        y.exports = { WebGL2KernelValueHTMLVideo: f };
      }, { "../../../utils": 114, "./html-image": 90 }], 92: [function(o, y, E) {
        let { WebGLKernelValueInteger: p } = o("../../web-gl/kernel-value/integer");
        class g extends p {
          getSource(l) {
            let n = this.getVariablePrecisionString();
            return this.origin === "constants" ? `const ${n} int ${this.id} = ${parseInt(l)};
` : `uniform ${n} int ${this.id};
`;
          }
          updateValue(l) {
            this.origin !== "constants" && this.kernel.setUniform1i(this.id, this.uploadValue = l);
          }
        }
        y.exports = { WebGL2KernelValueInteger: g };
      }, { "../../web-gl/kernel-value/integer": 57 }], 93: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { WebGLKernelValueMemoryOptimizedNumberTexture: g } = o("../../web-gl/kernel-value/memory-optimized-number-texture");
        class f extends g {
          getSource() {
            let { id: n, sizeId: s, textureSize: t, dimensionsId: i, dimensions: u } = this, x2 = this.getVariablePrecisionString();
            return p.linesToString([`uniform sampler2D ${n}`, `${x2} ivec2 ${s} = ivec2(${t[0]}, ${t[1]})`, `${x2} ivec3 ${i} = ivec3(${u[0]}, ${u[1]}, ${u[2]})`]);
          }
        }
        y.exports = { WebGL2KernelValueMemoryOptimizedNumberTexture: f };
      }, { "../../../utils": 114, "../../web-gl/kernel-value/memory-optimized-number-texture": 58 }], 94: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { WebGLKernelValueNumberTexture: g } = o("../../web-gl/kernel-value/number-texture");
        class f extends g {
          getSource() {
            let { id: n, sizeId: s, textureSize: t, dimensionsId: i, dimensions: u } = this, x2 = this.getVariablePrecisionString();
            return p.linesToString([`uniform ${x2} sampler2D ${n}`, `${x2} ivec2 ${s} = ivec2(${t[0]}, ${t[1]})`, `${x2} ivec3 ${i} = ivec3(${u[0]}, ${u[1]}, ${u[2]})`]);
          }
        }
        y.exports = { WebGL2KernelValueNumberTexture: f };
      }, { "../../../utils": 114, "../../web-gl/kernel-value/number-texture": 59 }], 95: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { WebGLKernelValueSingleArray: g } = o("../../web-gl/kernel-value/single-array");
        class f extends g {
          getSource() {
            let n = this.getVariablePrecisionString();
            return p.linesToString([`uniform ${n} sampler2D ${this.id}`, `${n} ivec2 ${this.sizeId} = ivec2(${this.textureSize[0]}, ${this.textureSize[1]})`, `${n} ivec3 ${this.dimensionsId} = ivec3(${this.dimensions[0]}, ${this.dimensions[1]}, ${this.dimensions[2]})`]);
          }
          updateValue(n) {
            if (n.constructor !== this.initialValueConstructor) {
              this.onUpdateValueMismatch(n.constructor);
              return;
            }
            let { context: s } = this;
            p.flattenTo(n, this.uploadValue), s.activeTexture(this.contextHandle), s.bindTexture(s.TEXTURE_2D, this.texture), s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL, false), s.texImage2D(s.TEXTURE_2D, 0, s.RGBA32F, this.textureSize[0], this.textureSize[1], 0, s.RGBA, s.FLOAT, this.uploadValue), this.kernel.setUniform1i(this.id, this.index);
          }
        }
        y.exports = { WebGL2KernelValueSingleArray: f };
      }, { "../../../utils": 114, "../../web-gl/kernel-value/single-array": 60 }], 96: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { WebGLKernelValueSingleArray1DI: g } = o("../../web-gl/kernel-value/single-array1d-i");
        class f extends g {
          updateValue(n) {
            if (n.constructor !== this.initialValueConstructor) {
              this.onUpdateValueMismatch(n.constructor);
              return;
            }
            let { context: s } = this;
            p.flattenTo(n, this.uploadValue), s.activeTexture(this.contextHandle), s.bindTexture(s.TEXTURE_2D, this.texture), s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL, false), s.texImage2D(s.TEXTURE_2D, 0, s.RGBA32F, this.textureSize[0], this.textureSize[1], 0, s.RGBA, s.FLOAT, this.uploadValue), this.kernel.setUniform1i(this.id, this.index);
          }
        }
        y.exports = { WebGL2KernelValueSingleArray1DI: f };
      }, { "../../../utils": 114, "../../web-gl/kernel-value/single-array1d-i": 61 }], 97: [function(o, y, E) {
        let { WebGLKernelValueSingleArray2: p } = o("../../web-gl/kernel-value/single-array2");
        class g extends p {
        }
        y.exports = { WebGL2KernelValueSingleArray2: g };
      }, { "../../web-gl/kernel-value/single-array2": 62 }], 98: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { WebGLKernelValueSingleArray2DI: g } = o("../../web-gl/kernel-value/single-array2d-i");
        class f extends g {
          updateValue(n) {
            if (n.constructor !== this.initialValueConstructor) {
              this.onUpdateValueMismatch(n.constructor);
              return;
            }
            let { context: s } = this;
            p.flattenTo(n, this.uploadValue), s.activeTexture(this.contextHandle), s.bindTexture(s.TEXTURE_2D, this.texture), s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL, false), s.texImage2D(s.TEXTURE_2D, 0, s.RGBA32F, this.textureSize[0], this.textureSize[1], 0, s.RGBA, s.FLOAT, this.uploadValue), this.kernel.setUniform1i(this.id, this.index);
          }
        }
        y.exports = { WebGL2KernelValueSingleArray2DI: f };
      }, { "../../../utils": 114, "../../web-gl/kernel-value/single-array2d-i": 63 }], 99: [function(o, y, E) {
        let { WebGLKernelValueSingleArray3: p } = o("../../web-gl/kernel-value/single-array3");
        class g extends p {
        }
        y.exports = { WebGL2KernelValueSingleArray3: g };
      }, { "../../web-gl/kernel-value/single-array3": 64 }], 100: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { WebGLKernelValueSingleArray3DI: g } = o("../../web-gl/kernel-value/single-array3d-i");
        class f extends g {
          updateValue(n) {
            if (n.constructor !== this.initialValueConstructor) {
              this.onUpdateValueMismatch(n.constructor);
              return;
            }
            let { context: s } = this;
            p.flattenTo(n, this.uploadValue), s.activeTexture(this.contextHandle), s.bindTexture(s.TEXTURE_2D, this.texture), s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL, false), s.texImage2D(s.TEXTURE_2D, 0, s.RGBA32F, this.textureSize[0], this.textureSize[1], 0, s.RGBA, s.FLOAT, this.uploadValue), this.kernel.setUniform1i(this.id, this.index);
          }
        }
        y.exports = { WebGL2KernelValueSingleArray3DI: f };
      }, { "../../../utils": 114, "../../web-gl/kernel-value/single-array3d-i": 65 }], 101: [function(o, y, E) {
        let { WebGLKernelValueSingleArray4: p } = o("../../web-gl/kernel-value/single-array4");
        class g extends p {
        }
        y.exports = { WebGL2KernelValueSingleArray4: g };
      }, { "../../web-gl/kernel-value/single-array4": 66 }], 102: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { WebGLKernelValueSingleInput: g } = o("../../web-gl/kernel-value/single-input");
        class f extends g {
          getSource() {
            let n = this.getVariablePrecisionString();
            return p.linesToString([`uniform ${n} sampler2D ${this.id}`, `${n} ivec2 ${this.sizeId} = ivec2(${this.textureSize[0]}, ${this.textureSize[1]})`, `${n} ivec3 ${this.dimensionsId} = ivec3(${this.dimensions[0]}, ${this.dimensions[1]}, ${this.dimensions[2]})`]);
          }
          updateValue(n) {
            let { context: s } = this;
            p.flattenTo(n.value, this.uploadValue), s.activeTexture(this.contextHandle), s.bindTexture(s.TEXTURE_2D, this.texture), s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL, false), s.texImage2D(s.TEXTURE_2D, 0, s.RGBA32F, this.textureSize[0], this.textureSize[1], 0, s.RGBA, s.FLOAT, this.uploadValue), this.kernel.setUniform1i(this.id, this.index);
          }
        }
        y.exports = { WebGL2KernelValueSingleInput: f };
      }, { "../../../utils": 114, "../../web-gl/kernel-value/single-input": 67 }], 103: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { WebGLKernelValueUnsignedArray: g } = o("../../web-gl/kernel-value/unsigned-array");
        class f extends g {
          getSource() {
            let n = this.getVariablePrecisionString();
            return p.linesToString([`uniform ${n} sampler2D ${this.id}`, `${n} ivec2 ${this.sizeId} = ivec2(${this.textureSize[0]}, ${this.textureSize[1]})`, `${n} ivec3 ${this.dimensionsId} = ivec3(${this.dimensions[0]}, ${this.dimensions[1]}, ${this.dimensions[2]})`]);
          }
        }
        y.exports = { WebGL2KernelValueUnsignedArray: f };
      }, { "../../../utils": 114, "../../web-gl/kernel-value/unsigned-array": 68 }], 104: [function(o, y, E) {
        let { utils: p } = o("../../../utils"), { WebGLKernelValueUnsignedInput: g } = o("../../web-gl/kernel-value/unsigned-input");
        class f extends g {
          getSource() {
            let n = this.getVariablePrecisionString();
            return p.linesToString([`uniform ${n} sampler2D ${this.id}`, `${n} ivec2 ${this.sizeId} = ivec2(${this.textureSize[0]}, ${this.textureSize[1]})`, `${n} ivec3 ${this.dimensionsId} = ivec3(${this.dimensions[0]}, ${this.dimensions[1]}, ${this.dimensions[2]})`]);
          }
        }
        y.exports = { WebGL2KernelValueUnsignedInput: f };
      }, { "../../../utils": 114, "../../web-gl/kernel-value/unsigned-input": 69 }], 105: [function(o, y, E) {
        let { WebGLKernel: p } = o("../web-gl/kernel"), { WebGL2FunctionNode: g } = o("./function-node"), { FunctionBuilder: f } = o("../function-builder"), { utils: l } = o("../../utils"), { fragmentShader: n } = o("./fragment-shader"), { vertexShader: s } = o("./vertex-shader"), { lookupKernelValueType: t } = o("./kernel-value-maps"), i = null, u = null, x2 = null, w = null, m = null;
        class S extends p {
          static get isSupported() {
            return i !== null || (this.setupFeatureChecks(), i = this.isContextMatch(x2)), i;
          }
          static setupFeatureChecks() {
            typeof document < "u" ? u = document.createElement("canvas") : typeof OffscreenCanvas < "u" && (u = new OffscreenCanvas(0, 0)), u && (x2 = u.getContext("webgl2"), !(!x2 || !x2.getExtension) && (w = { EXT_color_buffer_float: x2.getExtension("EXT_color_buffer_float"), OES_texture_float_linear: x2.getExtension("OES_texture_float_linear") }, m = this.getFeatures()));
          }
          static isContextMatch(h) {
            return typeof WebGL2RenderingContext < "u" ? h instanceof WebGL2RenderingContext : false;
          }
          static getFeatures() {
            let h = this.testContext;
            return Object.freeze({ isFloatRead: this.getIsFloatRead(), isIntegerDivisionAccurate: this.getIsIntegerDivisionAccurate(), isSpeedTacticSupported: this.getIsSpeedTacticSupported(), kernelMap: true, isTextureFloat: true, isDrawBuffers: true, channelCount: this.getChannelCount(), maxTextureSize: this.getMaxTextureSize(), lowIntPrecision: h.getShaderPrecisionFormat(h.FRAGMENT_SHADER, h.LOW_INT), lowFloatPrecision: h.getShaderPrecisionFormat(h.FRAGMENT_SHADER, h.LOW_FLOAT), mediumIntPrecision: h.getShaderPrecisionFormat(h.FRAGMENT_SHADER, h.MEDIUM_INT), mediumFloatPrecision: h.getShaderPrecisionFormat(h.FRAGMENT_SHADER, h.MEDIUM_FLOAT), highIntPrecision: h.getShaderPrecisionFormat(h.FRAGMENT_SHADER, h.HIGH_INT), highFloatPrecision: h.getShaderPrecisionFormat(h.FRAGMENT_SHADER, h.HIGH_FLOAT) });
          }
          static getIsTextureFloat() {
            return true;
          }
          static getChannelCount() {
            return x2.getParameter(x2.MAX_DRAW_BUFFERS);
          }
          static getMaxTextureSize() {
            return x2.getParameter(x2.MAX_TEXTURE_SIZE);
          }
          static lookupKernelValueType(h, b, T, C) {
            return t(h, b, T, C);
          }
          static get testCanvas() {
            return u;
          }
          static get testContext() {
            return x2;
          }
          static get features() {
            return m;
          }
          static get fragmentShader() {
            return n;
          }
          static get vertexShader() {
            return s;
          }
          initContext() {
            let h = { alpha: false, depth: false, antialias: false };
            return this.canvas.getContext("webgl2", h);
          }
          initExtensions() {
            this.extensions = { EXT_color_buffer_float: this.context.getExtension("EXT_color_buffer_float"), OES_texture_float_linear: this.context.getExtension("OES_texture_float_linear") };
          }
          validateSettings(h) {
            if (!this.validate) {
              this.texSize = l.getKernelTextureSize({ optimizeFloatMemory: this.optimizeFloatMemory, precision: this.precision }, this.output);
              return;
            }
            let { features: b } = this.constructor;
            if (this.precision === "single" && !b.isFloatRead)
              throw new Error("Float texture outputs are not supported");
            if (!this.graphical && this.precision === null && (this.precision = b.isFloatRead ? "single" : "unsigned"), this.fixIntegerDivisionAccuracy === null ? this.fixIntegerDivisionAccuracy = !b.isIntegerDivisionAccurate : this.fixIntegerDivisionAccuracy && b.isIntegerDivisionAccurate && (this.fixIntegerDivisionAccuracy = false), this.checkOutput(), !this.output || this.output.length === 0) {
              if (h.length !== 1)
                throw new Error("Auto output only supported for kernels with only one input");
              let T = l.getVariableType(h[0], this.strictIntegers);
              switch (T) {
                case "Array":
                  this.output = l.getDimensions(T);
                  break;
                case "NumberTexture":
                case "MemoryOptimizedNumberTexture":
                case "ArrayTexture(1)":
                case "ArrayTexture(2)":
                case "ArrayTexture(3)":
                case "ArrayTexture(4)":
                  this.output = h[0].output;
                  break;
                default:
                  throw new Error("Auto output not supported for input type: " + T);
              }
            }
            if (this.graphical) {
              if (this.output.length !== 2)
                throw new Error("Output must have 2 dimensions on graphical mode");
              this.precision === "single" && (console.warn("Cannot use graphical mode and single precision at the same time"), this.precision = "unsigned"), this.texSize = l.clone(this.output);
              return;
            } else
              !this.graphical && this.precision === null && b.isTextureFloat && (this.precision = "single");
            this.texSize = l.getKernelTextureSize({ optimizeFloatMemory: this.optimizeFloatMemory, precision: this.precision }, this.output), this.checkTextureSize();
          }
          translateSource() {
            let h = f.fromKernel(this, g, { fixIntegerDivisionAccuracy: this.fixIntegerDivisionAccuracy });
            this.translatedSource = h.getPrototypeString("kernel"), this.setupReturnTypes(h);
          }
          drawBuffers() {
            this.context.drawBuffers(this.drawBuffersMap);
          }
          getTextureFormat() {
            let { context: h } = this;
            switch (this.getInternalFormat()) {
              case h.R32F:
                return h.RED;
              case h.RG32F:
                return h.RG;
              case h.RGBA32F:
                return h.RGBA;
              case h.RGBA:
                return h.RGBA;
              default:
                throw new Error("Unknown internal format");
            }
          }
          getInternalFormat() {
            let { context: h } = this;
            if (this.precision === "single") {
              if (this.pipeline)
                switch (this.returnType) {
                  case "Number":
                  case "Float":
                  case "Integer":
                    return this.optimizeFloatMemory ? h.RGBA32F : h.R32F;
                  case "Array(2)":
                    return h.RG32F;
                  case "Array(3)":
                  case "Array(4)":
                    return h.RGBA32F;
                  default:
                    throw new Error("Unhandled return type");
                }
              return h.RGBA32F;
            }
            return h.RGBA;
          }
          _setupOutputTexture() {
            let h = this.context;
            if (this.texture) {
              h.framebufferTexture2D(h.FRAMEBUFFER, h.COLOR_ATTACHMENT0, h.TEXTURE_2D, this.texture.texture, 0);
              return;
            }
            h.bindFramebuffer(h.FRAMEBUFFER, this.framebuffer);
            let b = h.createTexture(), T = this.texSize;
            h.activeTexture(h.TEXTURE0 + this.constantTextureCount + this.argumentTextureCount), h.bindTexture(h.TEXTURE_2D, b), h.texParameteri(h.TEXTURE_2D, h.TEXTURE_WRAP_S, h.REPEAT), h.texParameteri(h.TEXTURE_2D, h.TEXTURE_WRAP_T, h.REPEAT), h.texParameteri(h.TEXTURE_2D, h.TEXTURE_MIN_FILTER, h.NEAREST), h.texParameteri(h.TEXTURE_2D, h.TEXTURE_MAG_FILTER, h.NEAREST);
            let C = this.getInternalFormat();
            this.precision === "single" ? h.texStorage2D(h.TEXTURE_2D, 1, C, T[0], T[1]) : h.texImage2D(h.TEXTURE_2D, 0, C, T[0], T[1], 0, C, h.UNSIGNED_BYTE, null), h.framebufferTexture2D(h.FRAMEBUFFER, h.COLOR_ATTACHMENT0, h.TEXTURE_2D, b, 0), this.texture = new this.TextureConstructor({ texture: b, size: T, dimensions: this.threadDim, output: this.output, context: this.context, internalFormat: this.getInternalFormat(), textureFormat: this.getTextureFormat(), kernel: this });
          }
          _setupSubOutputTextures() {
            let h = this.context;
            if (this.mappedTextures) {
              for (let T = 0; T < this.subKernels.length; T++)
                h.framebufferTexture2D(h.FRAMEBUFFER, h.COLOR_ATTACHMENT0 + T + 1, h.TEXTURE_2D, this.mappedTextures[T].texture, 0);
              return;
            }
            let b = this.texSize;
            this.drawBuffersMap = [h.COLOR_ATTACHMENT0], this.mappedTextures = [];
            for (let T = 0; T < this.subKernels.length; T++) {
              let C = this.createTexture();
              this.drawBuffersMap.push(h.COLOR_ATTACHMENT0 + T + 1), h.activeTexture(h.TEXTURE0 + this.constantTextureCount + this.argumentTextureCount + T), h.bindTexture(h.TEXTURE_2D, C), h.texParameteri(h.TEXTURE_2D, h.TEXTURE_WRAP_S, h.CLAMP_TO_EDGE), h.texParameteri(h.TEXTURE_2D, h.TEXTURE_WRAP_T, h.CLAMP_TO_EDGE), h.texParameteri(h.TEXTURE_2D, h.TEXTURE_MIN_FILTER, h.NEAREST), h.texParameteri(h.TEXTURE_2D, h.TEXTURE_MAG_FILTER, h.NEAREST);
              let V = this.getInternalFormat();
              this.precision === "single" ? h.texStorage2D(h.TEXTURE_2D, 1, V, b[0], b[1]) : h.texImage2D(h.TEXTURE_2D, 0, h.RGBA, b[0], b[1], 0, h.RGBA, h.UNSIGNED_BYTE, null), h.framebufferTexture2D(h.FRAMEBUFFER, h.COLOR_ATTACHMENT0 + T + 1, h.TEXTURE_2D, C, 0), this.mappedTextures.push(new this.TextureConstructor({ texture: C, size: b, dimensions: this.threadDim, output: this.output, context: this.context, internalFormat: this.getInternalFormat(), textureFormat: this.getTextureFormat(), kernel: this }));
            }
          }
          _getHeaderString() {
            return "";
          }
          _getTextureCoordinate() {
            let h = this.subKernels, b = this.getVariablePrecisionString(this.texSize, this.tactic);
            return h === null || h.length < 1 ? `in ${b} vec2 vTexCoord;
` : `out ${b} vec2 vTexCoord;
`;
          }
          _getMainArgumentsString(h) {
            let b = [], T = this.argumentNames;
            for (let C = 0; C < T.length; C++)
              b.push(this.kernelArguments[C].getSource(h[C]));
            return b.join("");
          }
          getKernelString() {
            let h = [this.getKernelResultDeclaration()], b = this.subKernels;
            if (b !== null)
              switch (h.push("layout(location = 0) out vec4 data0"), this.returnType) {
                case "Number":
                case "Float":
                case "Integer":
                  for (let T = 0; T < b.length; T++) {
                    let C = b[T];
                    h.push(C.returnType === "Integer" ? `int subKernelResult_${C.name} = 0` : `float subKernelResult_${C.name} = 0.0`, `layout(location = ${T + 1}) out vec4 data${T + 1}`);
                  }
                  break;
                case "Array(2)":
                  for (let T = 0; T < b.length; T++)
                    h.push(`vec2 subKernelResult_${b[T].name}`, `layout(location = ${T + 1}) out vec4 data${T + 1}`);
                  break;
                case "Array(3)":
                  for (let T = 0; T < b.length; T++)
                    h.push(`vec3 subKernelResult_${b[T].name}`, `layout(location = ${T + 1}) out vec4 data${T + 1}`);
                  break;
                case "Array(4)":
                  for (let T = 0; T < b.length; T++)
                    h.push(`vec4 subKernelResult_${b[T].name}`, `layout(location = ${T + 1}) out vec4 data${T + 1}`);
                  break;
              }
            else
              h.push("out vec4 data0");
            return l.linesToString(h) + this.translatedSource;
          }
          getMainResultGraphical() {
            return l.linesToString(["  threadId = indexTo3D(index, uOutputDim)", "  kernel()", "  data0 = actualColor"]);
          }
          getMainResultPackedPixels() {
            switch (this.returnType) {
              case "LiteralInteger":
              case "Number":
              case "Integer":
              case "Float":
                return this.getMainResultKernelPackedPixels() + this.getMainResultSubKernelPackedPixels();
              default:
                throw new Error(`packed output only usable with Numbers, "${this.returnType}" specified`);
            }
          }
          getMainResultKernelPackedPixels() {
            return l.linesToString(["  threadId = indexTo3D(index, uOutputDim)", "  kernel()", `  data0 = ${this.useLegacyEncoder ? "legacyEncode32" : "encode32"}(kernelResult)`]);
          }
          getMainResultSubKernelPackedPixels() {
            let h = [];
            if (!this.subKernels)
              return "";
            for (let b = 0; b < this.subKernels.length; b++)
              this.subKernels[b].returnType === "Integer" ? h.push(`  data${b + 1} = ${this.useLegacyEncoder ? "legacyEncode32" : "encode32"}(float(subKernelResult_${this.subKernels[b].name}))`) : h.push(`  data${b + 1} = ${this.useLegacyEncoder ? "legacyEncode32" : "encode32"}(subKernelResult_${this.subKernels[b].name})`);
            return l.linesToString(h);
          }
          getMainResultKernelMemoryOptimizedFloats(h, b) {
            h.push("  threadId = indexTo3D(index, uOutputDim)", "  kernel()", `  data0.${b} = kernelResult`);
          }
          getMainResultSubKernelMemoryOptimizedFloats(h, b) {
            if (!this.subKernels)
              return h;
            for (let T = 0; T < this.subKernels.length; T++) {
              let C = this.subKernels[T];
              C.returnType === "Integer" ? h.push(`  data${T + 1}.${b} = float(subKernelResult_${C.name})`) : h.push(`  data${T + 1}.${b} = subKernelResult_${C.name}`);
            }
          }
          getMainResultKernelNumberTexture() {
            return ["  threadId = indexTo3D(index, uOutputDim)", "  kernel()", "  data0[0] = kernelResult"];
          }
          getMainResultSubKernelNumberTexture() {
            let h = [];
            if (!this.subKernels)
              return h;
            for (let b = 0; b < this.subKernels.length; ++b) {
              let T = this.subKernels[b];
              T.returnType === "Integer" ? h.push(`  data${b + 1}[0] = float(subKernelResult_${T.name})`) : h.push(`  data${b + 1}[0] = subKernelResult_${T.name}`);
            }
            return h;
          }
          getMainResultKernelArray2Texture() {
            return ["  threadId = indexTo3D(index, uOutputDim)", "  kernel()", "  data0[0] = kernelResult[0]", "  data0[1] = kernelResult[1]"];
          }
          getMainResultSubKernelArray2Texture() {
            let h = [];
            if (!this.subKernels)
              return h;
            for (let b = 0; b < this.subKernels.length; ++b) {
              let T = this.subKernels[b];
              h.push(`  data${b + 1}[0] = subKernelResult_${T.name}[0]`, `  data${b + 1}[1] = subKernelResult_${T.name}[1]`);
            }
            return h;
          }
          getMainResultKernelArray3Texture() {
            return ["  threadId = indexTo3D(index, uOutputDim)", "  kernel()", "  data0[0] = kernelResult[0]", "  data0[1] = kernelResult[1]", "  data0[2] = kernelResult[2]"];
          }
          getMainResultSubKernelArray3Texture() {
            let h = [];
            if (!this.subKernels)
              return h;
            for (let b = 0; b < this.subKernels.length; ++b) {
              let T = this.subKernels[b];
              h.push(`  data${b + 1}[0] = subKernelResult_${T.name}[0]`, `  data${b + 1}[1] = subKernelResult_${T.name}[1]`, `  data${b + 1}[2] = subKernelResult_${T.name}[2]`);
            }
            return h;
          }
          getMainResultKernelArray4Texture() {
            return ["  threadId = indexTo3D(index, uOutputDim)", "  kernel()", "  data0 = kernelResult"];
          }
          getMainResultSubKernelArray4Texture() {
            let h = [];
            if (!this.subKernels)
              return h;
            for (let b = 0; b < this.subKernels.length; ++b)
              h.push(`  data${b + 1} = subKernelResult_${this.subKernels[b].name}`);
            return h;
          }
          destroyExtensions() {
            this.extensions.EXT_color_buffer_float = null, this.extensions.OES_texture_float_linear = null;
          }
          toJSON() {
            let h = super.toJSON();
            return h.functionNodes = f.fromKernel(this, g).toJSON(), h.settings.threadDim = this.threadDim, h;
          }
        }
        y.exports = { WebGL2Kernel: S };
      }, { "../../utils": 114, "../function-builder": 9, "../web-gl/kernel": 70, "./fragment-shader": 72, "./function-node": 73, "./kernel-value-maps": 74, "./vertex-shader": 106 }], 106: [function(o, y, E) {
        let p = `#version 300 es
      __FLOAT_TACTIC_DECLARATION__;
      __INT_TACTIC_DECLARATION__;
      __SAMPLER_2D_TACTIC_DECLARATION__;
      
      in vec2 aPos;
      in vec2 aTexCoord;
      
      out vec2 vTexCoord;
      uniform vec2 ratio;
      
      void main(void) {
        gl_Position = vec4((aPos + vec2(1)) * ratio + vec2(-1), 0, 1);
        vTexCoord = aTexCoord;
      }`;
        y.exports = { vertexShader: p };
      }, {}], 107: [function(o, y, E) {
        let p = o("./index"), g = p.GPU;
        for (let l in p)
          !p.hasOwnProperty(l) || l !== "GPU" && (g[l] = p[l]);
        typeof window < "u" && f(window), typeof self < "u" && f(self);
        function f(l) {
          l.GPU || Object.defineProperty(l, "GPU", { get() {
            return g;
          } });
        }
        y.exports = p;
      }, { "./index": 109 }], 108: [function(o, y, E) {
        let { gpuMock: p } = o("gpu-mock.js"), { utils: g } = o("./utils"), { Kernel: f } = o("./backend/kernel"), { CPUKernel: l } = o("./backend/cpu/kernel"), { HeadlessGLKernel: n } = o("./backend/headless-gl/kernel"), { WebGL2Kernel: s } = o("./backend/web-gl2/kernel"), { WebGLKernel: t } = o("./backend/web-gl/kernel"), { kernelRunShortcut: i } = o("./kernel-run-shortcut"), u = [n, s, t], x2 = ["gpu", "cpu"], w = { headlessgl: n, webgl2: s, webgl: t }, m = true;
        class S {
          static disableValidation() {
            m = false;
          }
          static enableValidation() {
            m = true;
          }
          static get isGPUSupported() {
            return u.some((b) => b.isSupported);
          }
          static get isKernelMapSupported() {
            return u.some((b) => b.isSupported && b.features.kernelMap);
          }
          static get isOffscreenCanvasSupported() {
            return typeof Worker < "u" && typeof OffscreenCanvas < "u" || typeof importScripts < "u";
          }
          static get isWebGLSupported() {
            return t.isSupported;
          }
          static get isWebGL2Supported() {
            return s.isSupported;
          }
          static get isHeadlessGLSupported() {
            return n.isSupported;
          }
          static get isCanvasSupported() {
            return typeof HTMLCanvasElement < "u";
          }
          static get isGPUHTMLImageArraySupported() {
            return s.isSupported;
          }
          static get isSinglePrecisionSupported() {
            return u.some((b) => b.isSupported && b.features.isFloatRead && b.features.isTextureFloat);
          }
          constructor(b) {
            if (b = b || {}, this.canvas = b.canvas || null, this.context = b.context || null, this.mode = b.mode, this.Kernel = null, this.kernels = [], this.functions = [], this.nativeFunctions = [], this.injectedNative = null, this.mode !== "dev") {
              if (this.chooseKernel(), b.functions)
                for (let T = 0; T < b.functions.length; T++)
                  this.addFunction(b.functions[T]);
              if (b.nativeFunctions)
                for (let T in b.nativeFunctions) {
                  if (!b.nativeFunctions.hasOwnProperty(T))
                    continue;
                  let C = b.nativeFunctions[T], { name: V, source: c } = C;
                  this.addNativeFunction(V, c, C);
                }
            }
          }
          chooseKernel() {
            if (this.Kernel)
              return;
            let b = null;
            if (this.context) {
              for (let T = 0; T < u.length; T++) {
                let C = u[T];
                if (C.isContextMatch(this.context)) {
                  if (!C.isSupported)
                    throw new Error(`Kernel type ${C.name} not supported`);
                  b = C;
                  break;
                }
              }
              if (b === null)
                throw new Error("unknown Context");
            } else if (this.mode) {
              if (this.mode in w)
                (!m || w[this.mode].isSupported) && (b = w[this.mode]);
              else if (this.mode === "gpu") {
                for (let T = 0; T < u.length; T++)
                  if (u[T].isSupported) {
                    b = u[T];
                    break;
                  }
              } else
                this.mode === "cpu" && (b = l);
              if (!b)
                throw new Error(`A requested mode of "${this.mode}" and is not supported`);
            } else {
              for (let T = 0; T < u.length; T++)
                if (u[T].isSupported) {
                  b = u[T];
                  break;
                }
              b || (b = l);
            }
            this.mode || (this.mode = b.mode), this.Kernel = b;
          }
          createKernel(b, T) {
            if (typeof b > "u")
              throw new Error("Missing source parameter");
            if (typeof b != "object" && !g.isFunction(b) && typeof b != "string")
              throw new Error("source parameter not a function");
            let C = this.kernels;
            if (this.mode === "dev") {
              let R = p(b, v(T));
              return C.push(R), R;
            }
            b = typeof b == "function" ? b.toString() : b;
            let V = {}, c = v(T) || {};
            T && typeof T.argumentTypes == "object" && (c.argumentTypes = Object.keys(T.argumentTypes).map((R) => T.argumentTypes[R]));
            function a(R) {
              console.warn("Falling back to CPU");
              let K = new l(b, { argumentTypes: F.argumentTypes, constantTypes: F.constantTypes, graphical: F.graphical, loopMaxIterations: F.loopMaxIterations, constants: F.constants, dynamicOutput: F.dynamicOutput, dynamicArgument: F.dynamicArguments, output: F.output, precision: F.precision, pipeline: F.pipeline, immutable: F.immutable, optimizeFloatMemory: F.optimizeFloatMemory, fixIntegerDivisionAccuracy: F.fixIntegerDivisionAccuracy, functions: F.functions, nativeFunctions: F.nativeFunctions, injectedNative: F.injectedNative, subKernels: F.subKernels, strictIntegers: F.strictIntegers, debug: F.debug });
              K.build.apply(K, R);
              let O = K.run.apply(K, R);
              return F.replaceKernel(K), O;
            }
            function k(R, K, O) {
              O.debug && console.warn("Switching kernels");
              let X = null;
              if (O.signature && !V[O.signature] && (V[O.signature] = O), O.dynamicOutput)
                for (let j = R.length - 1; j >= 0; j--) {
                  let U = R[j];
                  U.type === "outputPrecisionMismatch" && (X = U.needed);
                }
              let B = O.constructor, P = B.getArgumentTypes(O, K), Y = B.getSignature(O, P), J = V[Y];
              if (J)
                return J.onActivate(O), J;
              let q = V[Y] = new B(b, { argumentTypes: P, constantTypes: O.constantTypes, graphical: O.graphical, loopMaxIterations: O.loopMaxIterations, constants: O.constants, dynamicOutput: O.dynamicOutput, dynamicArgument: O.dynamicArguments, context: O.context, canvas: O.canvas, output: X || O.output, precision: O.precision, pipeline: O.pipeline, immutable: O.immutable, optimizeFloatMemory: O.optimizeFloatMemory, fixIntegerDivisionAccuracy: O.fixIntegerDivisionAccuracy, functions: O.functions, nativeFunctions: O.nativeFunctions, injectedNative: O.injectedNative, subKernels: O.subKernels, strictIntegers: O.strictIntegers, debug: O.debug, gpu: O.gpu, validate: m, returnType: O.returnType, tactic: O.tactic, onRequestFallback: a, onRequestSwitchKernel: k, texture: O.texture, mappedTextures: O.mappedTextures, drawBuffersMap: O.drawBuffersMap });
              return q.build.apply(q, K), F.replaceKernel(q), C.push(q), q;
            }
            let A = Object.assign({ context: this.context, canvas: this.canvas, functions: this.functions, nativeFunctions: this.nativeFunctions, injectedNative: this.injectedNative, gpu: this, validate: m, onRequestFallback: a, onRequestSwitchKernel: k }, c), N = new this.Kernel(b, A), F = i(N);
            return this.canvas || (this.canvas = N.canvas), this.context || (this.context = N.context), C.push(N), F;
          }
          createKernelMap() {
            let b, T, C = typeof arguments[arguments.length - 2];
            if (C === "function" || C === "string" ? (b = arguments[arguments.length - 2], T = arguments[arguments.length - 1]) : b = arguments[arguments.length - 1], this.mode !== "dev" && (!this.Kernel.isSupported || !this.Kernel.features.kernelMap) && this.mode && x2.indexOf(this.mode) < 0)
              throw new Error(`kernelMap not supported on ${this.Kernel.name}`);
            let V = v(T);
            if (T && typeof T.argumentTypes == "object" && (V.argumentTypes = Object.keys(T.argumentTypes).map((c) => T.argumentTypes[c])), Array.isArray(arguments[0])) {
              V.subKernels = [];
              let c = arguments[0];
              for (let a = 0; a < c.length; a++) {
                let k = c[a].toString(), A = g.getFunctionNameFromString(k);
                V.subKernels.push({ name: A, source: k, property: a });
              }
            } else {
              V.subKernels = [];
              let c = arguments[0];
              for (let a in c) {
                if (!c.hasOwnProperty(a))
                  continue;
                let k = c[a].toString(), A = g.getFunctionNameFromString(k);
                V.subKernels.push({ name: A || a, source: k, property: a });
              }
            }
            return this.createKernel(b, V);
          }
          combineKernels() {
            let b = arguments[0], T = arguments[arguments.length - 1];
            if (b.kernel.constructor.mode === "cpu")
              return T;
            let C = arguments[0].canvas, V = arguments[0].context, c = arguments.length - 1;
            for (let a = 0; a < c; a++)
              arguments[a].setCanvas(C).setContext(V).setPipeline(true);
            return function() {
              let a = T.apply(this, arguments);
              return a.toArray ? a.toArray() : a;
            };
          }
          setFunctions(b) {
            return this.functions = b, this;
          }
          setNativeFunctions(b) {
            return this.nativeFunctions = b, this;
          }
          addFunction(b, T) {
            return this.functions.push({ source: b, settings: T }), this;
          }
          addNativeFunction(b, T, C) {
            if (this.kernels.length > 0)
              throw new Error('Cannot call "addNativeFunction" after "createKernels" has been called.');
            return this.nativeFunctions.push(Object.assign({ name: b, source: T }, C)), this;
          }
          injectNative(b) {
            return this.injectedNative = b, this;
          }
          destroy() {
            return new Promise((b, T) => {
              this.kernels || b(), setTimeout(() => {
                try {
                  for (let V = 0; V < this.kernels.length; V++)
                    this.kernels[V].destroy(true);
                  let C = this.kernels[0];
                  C && (C.kernel && (C = C.kernel), C.constructor.destroyContext && C.constructor.destroyContext(this.context));
                } catch (C) {
                  T(C);
                }
                b();
              }, 0);
            });
          }
        }
        function v(h) {
          if (!h)
            return {};
          let b = Object.assign({}, h);
          return h.hasOwnProperty("floatOutput") && (g.warnDeprecated("setting", "floatOutput", "precision"), b.precision = h.floatOutput ? "single" : "unsigned"), h.hasOwnProperty("outputToTexture") && (g.warnDeprecated("setting", "outputToTexture", "pipeline"), b.pipeline = Boolean(h.outputToTexture)), h.hasOwnProperty("outputImmutable") && (g.warnDeprecated("setting", "outputImmutable", "immutable"), b.immutable = Boolean(h.outputImmutable)), h.hasOwnProperty("floatTextures") && (g.warnDeprecated("setting", "floatTextures", "optimizeFloatMemory"), b.optimizeFloatMemory = Boolean(h.floatTextures)), b;
        }
        y.exports = { GPU: S, kernelOrder: u, kernelTypes: x2 };
      }, { "./backend/cpu/kernel": 8, "./backend/headless-gl/kernel": 34, "./backend/kernel": 36, "./backend/web-gl/kernel": 70, "./backend/web-gl2/kernel": 105, "./kernel-run-shortcut": 111, "./utils": 114, "gpu-mock.js": 4 }], 109: [function(o, y, E) {
        let { GPU: p } = o("./gpu"), { alias: g } = o("./alias"), { utils: f } = o("./utils"), { Input: l, input: n } = o("./input"), { Texture: s } = o("./texture"), { FunctionBuilder: t } = o("./backend/function-builder"), { FunctionNode: i } = o("./backend/function-node"), { CPUFunctionNode: u } = o("./backend/cpu/function-node"), { CPUKernel: x2 } = o("./backend/cpu/kernel"), { HeadlessGLKernel: w } = o("./backend/headless-gl/kernel"), { WebGLFunctionNode: m } = o("./backend/web-gl/function-node"), { WebGLKernel: S } = o("./backend/web-gl/kernel"), { kernelValueMaps: v } = o("./backend/web-gl/kernel-value-maps"), { WebGL2FunctionNode: h } = o("./backend/web-gl2/function-node"), { WebGL2Kernel: b } = o("./backend/web-gl2/kernel"), { kernelValueMaps: T } = o("./backend/web-gl2/kernel-value-maps"), { GLKernel: C } = o("./backend/gl/kernel"), { Kernel: V } = o("./backend/kernel"), { FunctionTracer: c } = o("./backend/function-tracer"), a = o("./plugins/math-random-uniformly-distributed");
        y.exports = { alias: g, CPUFunctionNode: u, CPUKernel: x2, GPU: p, FunctionBuilder: t, FunctionNode: i, HeadlessGLKernel: w, Input: l, input: n, Texture: s, utils: f, WebGL2FunctionNode: h, WebGL2Kernel: b, webGL2KernelValueMaps: T, WebGLFunctionNode: m, WebGLKernel: S, webGLKernelValueMaps: v, GLKernel: C, Kernel: V, FunctionTracer: c, plugins: { mathRandom: a } };
      }, { "./alias": 5, "./backend/cpu/function-node": 6, "./backend/cpu/kernel": 8, "./backend/function-builder": 9, "./backend/function-node": 10, "./backend/function-tracer": 11, "./backend/gl/kernel": 13, "./backend/headless-gl/kernel": 34, "./backend/kernel": 36, "./backend/web-gl/function-node": 38, "./backend/web-gl/kernel": 70, "./backend/web-gl/kernel-value-maps": 39, "./backend/web-gl2/function-node": 73, "./backend/web-gl2/kernel": 105, "./backend/web-gl2/kernel-value-maps": 74, "./gpu": 108, "./input": 110, "./plugins/math-random-uniformly-distributed": 112, "./texture": 113, "./utils": 114 }], 110: [function(o, y, E) {
        class p {
          constructor(l, n) {
            this.value = l, Array.isArray(n) ? this.size = n : (this.size = new Int32Array(3), n.z ? this.size = new Int32Array([n.x, n.y, n.z]) : n.y ? this.size = new Int32Array([n.x, n.y]) : this.size = new Int32Array([n.x]));
            let [s, t, i] = this.size;
            if (i) {
              if (this.value.length !== s * t * i)
                throw new Error(`Input size ${this.value.length} does not match ${s} * ${t} * ${i} = ${t * s * i}`);
            } else if (t) {
              if (this.value.length !== s * t)
                throw new Error(`Input size ${this.value.length} does not match ${s} * ${t} = ${t * s}`);
            } else if (this.value.length !== s)
              throw new Error(`Input size ${this.value.length} does not match ${s}`);
          }
          toArray() {
            let { utils: l } = o("./utils"), [n, s, t] = this.size;
            return t ? l.erectMemoryOptimized3DFloat(this.value.subarray ? this.value : new Float32Array(this.value), n, s, t) : s ? l.erectMemoryOptimized2DFloat(this.value.subarray ? this.value : new Float32Array(this.value), n, s) : this.value;
          }
        }
        function g(f, l) {
          return new p(f, l);
        }
        y.exports = { Input: p, input: g };
      }, { "./utils": 114 }], 111: [function(o, y, E) {
        let { utils: p } = o("./utils");
        function g(l) {
          let n = function() {
            return l.build.apply(l, arguments), n = function() {
              let t = l.run.apply(l, arguments);
              if (l.switchingKernels) {
                let i = l.resetSwitchingKernels(), u = l.onRequestSwitchKernel(i, arguments, l);
                s.kernel = l = u, t = u.run.apply(u, arguments);
              }
              return l.renderKernels ? l.renderKernels() : l.renderOutput ? l.renderOutput() : t;
            }, n.apply(l, arguments);
          }, s = function() {
            return n.apply(l, arguments);
          };
          return s.exec = function() {
            return new Promise((t, i) => {
              try {
                t(n.apply(this, arguments));
              } catch (u) {
                i(u);
              }
            });
          }, s.replaceKernel = function(t) {
            l = t, f(l, s);
          }, f(l, s), s;
        }
        function f(l, n) {
          if (n.kernel) {
            n.kernel = l;
            return;
          }
          let s = p.allPropertiesOf(l);
          for (let t = 0; t < s.length; t++) {
            let i = s[t];
            i[0] === "_" && i[1] === "_" || (typeof l[i] == "function" ? i.substring(0, 3) === "add" || i.substring(0, 3) === "set" ? n[i] = function() {
              return n.kernel[i].apply(n.kernel, arguments), n;
            } : n[i] = function() {
              return n.kernel[i].apply(n.kernel, arguments);
            } : (n.__defineGetter__(i, () => n.kernel[i]), n.__defineSetter__(i, (u) => {
              n.kernel[i] = u;
            })));
          }
          n.kernel = l;
        }
        y.exports = { kernelRunShortcut: g };
      }, { "./utils": 114 }], 112: [function(o, y, E) {
        let t = { name: "math-random-uniformly-distributed", onBeforeRun: (i) => {
          i.setUniform1f("randomSeed1", Math.random()), i.setUniform1f("randomSeed2", Math.random());
        }, functionMatch: "Math.random()", functionReplace: "nrand(vTexCoord)", functionReturnType: "Number", source: `// https://www.shadertoy.com/view/4t2SDh
      //note: uniformly distributed, normalized rand, [0,1]
      highp float randomSeedShift = 1.0;
      highp float slide = 1.0;
      uniform highp float randomSeed1;
      uniform highp float randomSeed2;
      
      highp float nrand(highp vec2 n) {
        highp float result = fract(sin(dot((n.xy + 1.0) * vec2(randomSeed1 * slide, randomSeed2 * randomSeedShift), vec2(12.9898, 78.233))) * 43758.5453);
        randomSeedShift = result;
        if (randomSeedShift > 0.5) {
          slide += 0.00009; 
        } else {
          slide += 0.0009;
        }
        return result;
      }` };
        y.exports = t;
      }, {}], 113: [function(o, y, E) {
        class p {
          constructor(f) {
            let { texture: l, size: n, dimensions: s, output: t, context: i, type: u = "NumberTexture", kernel: x2, internalFormat: w, textureFormat: m } = f;
            if (!t)
              throw new Error('settings property "output" required.');
            if (!i)
              throw new Error('settings property "context" required.');
            if (!l)
              throw new Error('settings property "texture" required.');
            if (!x2)
              throw new Error('settings property "kernel" required.');
            this.texture = l, l._refs ? l._refs++ : l._refs = 1, this.size = n, this.dimensions = s, this.output = t, this.context = i, this.kernel = x2, this.type = u, this._deleted = false, this.internalFormat = w, this.textureFormat = m;
          }
          toArray() {
            throw new Error(`Not implemented on ${this.constructor.name}`);
          }
          clone() {
            throw new Error(`Not implemented on ${this.constructor.name}`);
          }
          delete() {
            throw new Error(`Not implemented on ${this.constructor.name}`);
          }
          clear() {
            throw new Error(`Not implemented on ${this.constructor.name}`);
          }
        }
        y.exports = { Texture: p };
      }, {}], 114: [function(o, y, E) {
        let p = o("acorn"), { Input: g } = o("./input"), { Texture: f } = o("./texture"), l = /function ([^(]*)/, n = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg, s = /([^\s,]+)/g, t = { systemEndianness() {
          return w;
        }, getSystemEndianness() {
          let m = new ArrayBuffer(4), S = new Uint32Array(m), v = new Uint8Array(m);
          if (S[0] = 3735928559, v[0] === 239)
            return "LE";
          if (v[0] === 222)
            return "BE";
          throw new Error("unknown endianness");
        }, isFunction(m) {
          return typeof m == "function";
        }, isFunctionString(m) {
          return typeof m == "string" ? m.slice(0, 8).toLowerCase() === "function" : false;
        }, getFunctionNameFromString(m) {
          let S = l.exec(m);
          return !S || S.length === 0 ? null : S[1].trim();
        }, getFunctionBodyFromString(m) {
          return m.substring(m.indexOf("{") + 1, m.lastIndexOf("}"));
        }, getArgumentNamesFromString(m) {
          let S = m.replace(n, ""), v = S.slice(S.indexOf("(") + 1, S.indexOf(")")).match(s);
          return v === null && (v = []), v;
        }, clone(m) {
          if (m === null || typeof m != "object" || m.hasOwnProperty("isActiveClone"))
            return m;
          let S = m.constructor();
          for (let v in m)
            Object.prototype.hasOwnProperty.call(m, v) && (m.isActiveClone = null, S[v] = t.clone(m[v]), delete m.isActiveClone);
          return S;
        }, isArray(m) {
          return !isNaN(m.length);
        }, getVariableType(m, S) {
          if (t.isArray(m))
            return m.length > 0 && m[0].nodeName === "IMG" ? "HTMLImageArray" : "Array";
          switch (m.constructor) {
            case Boolean:
              return "Boolean";
            case Number:
              return S && Number.isInteger(m) ? "Integer" : "Float";
            case f:
              return m.type;
            case g:
              return "Input";
          }
          switch (m.nodeName) {
            case "IMG":
              return "HTMLImage";
            case "CANVAS":
              return "HTMLImage";
            case "VIDEO":
              return "HTMLVideo";
          }
          return m.hasOwnProperty("type") ? m.type : "Unknown";
        }, getKernelTextureSize(m, S) {
          let [v, h, b] = S, T = (v || 1) * (h || 1) * (b || 1);
          return m.optimizeFloatMemory && m.precision === "single" && (v = T = Math.ceil(T / 4)), h > 1 && v * h === T ? new Int32Array([v, h]) : t.closestSquareDimensions(T);
        }, closestSquareDimensions(m) {
          let S = Math.sqrt(m), v = Math.ceil(S), h = Math.floor(S);
          for (; v * h < m; )
            v--, h = Math.ceil(m / v);
          return new Int32Array([h, Math.ceil(m / h)]);
        }, getMemoryOptimizedFloatTextureSize(m, S) {
          let h = t.roundTo((m[0] || 1) * (m[1] || 1) * (m[2] || 1) * (m[3] || 1), 4) / S;
          return t.closestSquareDimensions(h);
        }, getMemoryOptimizedPackedTextureSize(m, S) {
          let [v, h, b] = m, C = t.roundTo((v || 1) * (h || 1) * (b || 1), 4) / (4 / S);
          return t.closestSquareDimensions(C);
        }, roundTo(m, S) {
          return Math.floor((m + S - 1) / S) * S;
        }, getDimensions(m, S) {
          let v;
          if (t.isArray(m)) {
            let h = [], b = m;
            for (; t.isArray(b); )
              h.push(b.length), b = b[0];
            v = h.reverse();
          } else if (m instanceof f)
            v = m.output;
          else if (m instanceof g)
            v = m.size;
          else
            throw new Error(`Unknown dimensions of ${m}`);
          if (S)
            for (v = Array.from(v); v.length < 3; )
              v.push(1);
          return new Int32Array(v);
        }, flatten2dArrayTo(m, S) {
          let v = 0;
          for (let h = 0; h < m.length; h++)
            S.set(m[h], v), v += m[h].length;
        }, flatten3dArrayTo(m, S) {
          let v = 0;
          for (let h = 0; h < m.length; h++)
            for (let b = 0; b < m[h].length; b++)
              S.set(m[h][b], v), v += m[h][b].length;
        }, flatten4dArrayTo(m, S) {
          let v = 0;
          for (let h = 0; h < m.length; h++)
            for (let b = 0; b < m[h].length; b++)
              for (let T = 0; T < m[h][b].length; T++)
                S.set(m[h][b][T], v), v += m[h][b][T].length;
        }, flattenTo(m, S) {
          t.isArray(m[0]) ? t.isArray(m[0][0]) ? t.isArray(m[0][0][0]) ? t.flatten4dArrayTo(m, S) : t.flatten3dArrayTo(m, S) : t.flatten2dArrayTo(m, S) : S.set(m);
        }, splitArray(m, S) {
          let v = [];
          for (let h = 0; h < m.length; h += S)
            v.push(new m.constructor(m.buffer, h * 4 + m.byteOffset, S));
          return v;
        }, getAstString(m, S) {
          let v = Array.isArray(m) ? m : m.split(/\r?\n/g), h = S.loc.start, b = S.loc.end, T = [];
          if (h.line === b.line)
            T.push(v[h.line - 1].substring(h.column, b.column));
          else {
            T.push(v[h.line - 1].slice(h.column));
            for (let C = h.line; C < b.line; C++)
              T.push(v[C]);
            T.push(v[b.line - 1].slice(0, b.column));
          }
          return T.join(`
`);
        }, allPropertiesOf(m) {
          let S = [];
          do
            S.push.apply(S, Object.getOwnPropertyNames(m));
          while (m = Object.getPrototypeOf(m));
          return S;
        }, linesToString(m) {
          return m.length > 0 ? m.join(`;
`) + `;
` : `
`;
        }, warnDeprecated(m, S, v) {
          console.warn(v ? `You are using a deprecated ${m} "${S}". It has been replaced with "${v}". Fixing, but please upgrade as it will soon be removed.` : `You are using a deprecated ${m} "${S}". It has been removed. Fixing, but please upgrade as it will soon be removed.`);
        }, flipPixels: (m, S, v) => {
          let h = v / 2 | 0, b = S * 4, T = new Uint8ClampedArray(S * 4), C = m.slice(0);
          for (let V = 0; V < h; ++V) {
            let c = V * b, a = (v - V - 1) * b;
            T.set(C.subarray(c, c + b)), C.copyWithin(c, a, a + b), C.set(T, a);
          }
          return C;
        }, erectPackedFloat: (m, S) => m.subarray(0, S), erect2DPackedFloat: (m, S, v) => {
          let h = new Array(v);
          for (let b = 0; b < v; b++) {
            let T = b * S, C = T + S;
            h[b] = m.subarray(T, C);
          }
          return h;
        }, erect3DPackedFloat: (m, S, v, h) => {
          let b = new Array(h);
          for (let T = 0; T < h; T++) {
            let C = new Array(v);
            for (let V = 0; V < v; V++) {
              let c = T * v * S + V * S, a = c + S;
              C[V] = m.subarray(c, a);
            }
            b[T] = C;
          }
          return b;
        }, erectMemoryOptimizedFloat: (m, S) => m.subarray(0, S), erectMemoryOptimized2DFloat: (m, S, v) => {
          let h = new Array(v);
          for (let b = 0; b < v; b++) {
            let T = b * S;
            h[b] = m.subarray(T, T + S);
          }
          return h;
        }, erectMemoryOptimized3DFloat: (m, S, v, h) => {
          let b = new Array(h);
          for (let T = 0; T < h; T++) {
            let C = new Array(v);
            for (let V = 0; V < v; V++) {
              let c = T * v * S + V * S;
              C[V] = m.subarray(c, c + S);
            }
            b[T] = C;
          }
          return b;
        }, erectFloat: (m, S) => {
          let v = new Float32Array(S), h = 0;
          for (let b = 0; b < S; b++)
            v[b] = m[h], h += 4;
          return v;
        }, erect2DFloat: (m, S, v) => {
          let h = new Array(v), b = 0;
          for (let T = 0; T < v; T++) {
            let C = new Float32Array(S);
            for (let V = 0; V < S; V++)
              C[V] = m[b], b += 4;
            h[T] = C;
          }
          return h;
        }, erect3DFloat: (m, S, v, h) => {
          let b = new Array(h), T = 0;
          for (let C = 0; C < h; C++) {
            let V = new Array(v);
            for (let c = 0; c < v; c++) {
              let a = new Float32Array(S);
              for (let k = 0; k < S; k++)
                a[k] = m[T], T += 4;
              V[c] = a;
            }
            b[C] = V;
          }
          return b;
        }, erectArray2: (m, S) => {
          let v = new Array(S), h = S * 4, b = 0;
          for (let T = 0; T < h; T += 4)
            v[b++] = m.subarray(T, T + 2);
          return v;
        }, erect2DArray2: (m, S, v) => {
          let h = new Array(v), b = S * 4;
          for (let T = 0; T < v; T++) {
            let C = new Array(S), V = T * b, c = 0;
            for (let a = 0; a < b; a += 4)
              C[c++] = m.subarray(a + V, a + V + 2);
            h[T] = C;
          }
          return h;
        }, erect3DArray2: (m, S, v, h) => {
          let b = S * 4, T = new Array(h);
          for (let C = 0; C < h; C++) {
            let V = new Array(v);
            for (let c = 0; c < v; c++) {
              let a = new Array(S), k = C * b * v + c * b, A = 0;
              for (let N = 0; N < b; N += 4)
                a[A++] = m.subarray(N + k, N + k + 2);
              V[c] = a;
            }
            T[C] = V;
          }
          return T;
        }, erectArray3: (m, S) => {
          let v = new Array(S), h = S * 4, b = 0;
          for (let T = 0; T < h; T += 4)
            v[b++] = m.subarray(T, T + 3);
          return v;
        }, erect2DArray3: (m, S, v) => {
          let h = S * 4, b = new Array(v);
          for (let T = 0; T < v; T++) {
            let C = new Array(S), V = T * h, c = 0;
            for (let a = 0; a < h; a += 4)
              C[c++] = m.subarray(a + V, a + V + 3);
            b[T] = C;
          }
          return b;
        }, erect3DArray3: (m, S, v, h) => {
          let b = S * 4, T = new Array(h);
          for (let C = 0; C < h; C++) {
            let V = new Array(v);
            for (let c = 0; c < v; c++) {
              let a = new Array(S), k = C * b * v + c * b, A = 0;
              for (let N = 0; N < b; N += 4)
                a[A++] = m.subarray(N + k, N + k + 3);
              V[c] = a;
            }
            T[C] = V;
          }
          return T;
        }, erectArray4: (m, S) => {
          let v = new Array(m), h = S * 4, b = 0;
          for (let T = 0; T < h; T += 4)
            v[b++] = m.subarray(T, T + 4);
          return v;
        }, erect2DArray4: (m, S, v) => {
          let h = S * 4, b = new Array(v);
          for (let T = 0; T < v; T++) {
            let C = new Array(S), V = T * h, c = 0;
            for (let a = 0; a < h; a += 4)
              C[c++] = m.subarray(a + V, a + V + 4);
            b[T] = C;
          }
          return b;
        }, erect3DArray4: (m, S, v, h) => {
          let b = S * 4, T = new Array(h);
          for (let C = 0; C < h; C++) {
            let V = new Array(v);
            for (let c = 0; c < v; c++) {
              let a = new Array(S), k = C * b * v + c * b, A = 0;
              for (let N = 0; N < b; N += 4)
                a[A++] = m.subarray(N + k, N + k + 4);
              V[c] = a;
            }
            T[C] = V;
          }
          return T;
        }, flattenFunctionToString: (m, S) => {
          let { findDependency: v, thisLookup: h, doNotDefine: b } = S, T = S.flattened;
          T || (T = S.flattened = {});
          let C = p.parse(m), V = [], c = 0;
          function a(A) {
            if (Array.isArray(A)) {
              let N = [];
              for (let F = 0; F < A.length; F++)
                N.push(a(A[F]));
              return N.join("");
            }
            switch (A.type) {
              case "Program":
                return a(A.body) + (A.body[0].type === "VariableDeclaration" ? ";" : "");
              case "FunctionDeclaration":
                return `function ${A.id.name}(${A.params.map(a).join(", ")}) ${a(A.body)}`;
              case "BlockStatement": {
                let F = [];
                c += 2;
                for (let R = 0; R < A.body.length; R++) {
                  let K = a(A.body[R]);
                  K && F.push(" ".repeat(c) + K, `;
`);
                }
                return c -= 2, `{
${F.join("")}}`;
              }
              case "VariableDeclaration":
                let N = t.normalizeDeclarations(A).map(a).filter((F) => F !== null);
                return N.length < 1 ? "" : `${A.kind} ${N.join(",")}`;
              case "VariableDeclarator":
                return A.init.object && A.init.object.type === "ThisExpression" ? h(A.init.property.name, true) ? `${A.id.name} = ${a(A.init)}` : null : `${A.id.name} = ${a(A.init)}`;
              case "CallExpression": {
                if (A.callee.property.name === "subarray")
                  return `${a(A.callee.object)}.${a(A.callee.property)}(${A.arguments.map((F) => a(F)).join(", ")})`;
                if (A.callee.object.name === "gl" || A.callee.object.name === "context")
                  return `${a(A.callee.object)}.${a(A.callee.property)}(${A.arguments.map((F) => a(F)).join(", ")})`;
                if (A.callee.object.type === "ThisExpression")
                  return V.push(v("this", A.callee.property.name)), `${A.callee.property.name}(${A.arguments.map((F) => a(F)).join(", ")})`;
                if (A.callee.object.name) {
                  let F = v(A.callee.object.name, A.callee.property.name);
                  return F === null ? `${A.callee.object.name}.${A.callee.property.name}(${A.arguments.map((R) => a(R)).join(", ")})` : (V.push(F), `${A.callee.property.name}(${A.arguments.map((R) => a(R)).join(", ")})`);
                } else {
                  if (A.callee.object.type === "MemberExpression")
                    return `${a(A.callee.object)}.${A.callee.property.name}(${A.arguments.map((F) => a(F)).join(", ")})`;
                  throw new Error("unknown ast.callee");
                }
              }
              case "ReturnStatement":
                return `return ${a(A.argument)}`;
              case "BinaryExpression":
                return `(${a(A.left)}${A.operator}${a(A.right)})`;
              case "UnaryExpression":
                return A.prefix ? `${A.operator} ${a(A.argument)}` : `${a(A.argument)} ${A.operator}`;
              case "ExpressionStatement":
                return `${a(A.expression)}`;
              case "SequenceExpression":
                return `(${a(A.expressions)})`;
              case "ArrowFunctionExpression":
                return `(${A.params.map(a).join(", ")}) => ${a(A.body)}`;
              case "Literal":
                return A.raw;
              case "Identifier":
                return A.name;
              case "MemberExpression":
                return A.object.type === "ThisExpression" ? h(A.property.name) : A.computed ? `${a(A.object)}[${a(A.property)}]` : a(A.object) + "." + a(A.property);
              case "ThisExpression":
                return "this";
              case "NewExpression":
                return `new ${a(A.callee)}(${A.arguments.map((F) => a(F)).join(", ")})`;
              case "ForStatement":
                return `for (${a(A.init)};${a(A.test)};${a(A.update)}) ${a(A.body)}`;
              case "AssignmentExpression":
                return `${a(A.left)}${A.operator}${a(A.right)}`;
              case "UpdateExpression":
                return `${a(A.argument)}${A.operator}`;
              case "IfStatement":
                return `if (${a(A.test)}) ${a(A.consequent)}`;
              case "ThrowStatement":
                return `throw ${a(A.argument)}`;
              case "ObjectPattern":
                return A.properties.map(a).join(", ");
              case "ArrayPattern":
                return A.elements.map(a).join(", ");
              case "DebuggerStatement":
                return "debugger;";
              case "ConditionalExpression":
                return `${a(A.test)}?${a(A.consequent)}:${a(A.alternate)}`;
              case "Property":
                if (A.kind === "init")
                  return a(A.key);
            }
            throw new Error(`unhandled ast.type of ${A.type}`);
          }
          let k = a(C);
          if (V.length > 0) {
            let A = [];
            for (let N = 0; N < V.length; N++) {
              let F = V[N];
              T[F] || (T[F] = true), F && A.push(t.flattenFunctionToString(F, S) + `
`);
            }
            return A.join("") + k;
          }
          return k;
        }, normalizeDeclarations: (m) => {
          if (m.type !== "VariableDeclaration")
            throw new Error('Ast is not of type "VariableDeclaration"');
          let S = [];
          for (let v = 0; v < m.declarations.length; v++) {
            let h = m.declarations[v];
            if (h.id && h.id.type === "ObjectPattern" && h.id.properties) {
              let { properties: b } = h.id;
              for (let T = 0; T < b.length; T++) {
                let C = b[T];
                if (C.value.type === "ObjectPattern" && C.value.properties)
                  for (let V = 0; V < C.value.properties.length; V++) {
                    let c = C.value.properties[V];
                    if (c.type === "Property")
                      S.push({ type: "VariableDeclarator", id: { type: "Identifier", name: c.key.name }, init: { type: "MemberExpression", object: { type: "MemberExpression", object: h.init, property: { type: "Identifier", name: C.key.name }, computed: false }, property: { type: "Identifier", name: c.key.name }, computed: false } });
                    else
                      throw new Error("unexpected state");
                  }
                else if (C.value.type === "Identifier")
                  S.push({ type: "VariableDeclarator", id: { type: "Identifier", name: C.value && C.value.name ? C.value.name : C.key.name }, init: { type: "MemberExpression", object: h.init, property: { type: "Identifier", name: C.key.name }, computed: false } });
                else
                  throw new Error("unexpected state");
              }
            } else if (h.id && h.id.type === "ArrayPattern" && h.id.elements) {
              let { elements: b } = h.id;
              for (let T = 0; T < b.length; T++) {
                let C = b[T];
                if (C.type === "Identifier")
                  S.push({ type: "VariableDeclarator", id: { type: "Identifier", name: C.name }, init: { type: "MemberExpression", object: h.init, property: { type: "Literal", value: T, raw: T.toString(), start: C.start, end: C.end }, computed: true } });
                else
                  throw new Error("unexpected state");
              }
            } else
              S.push(h);
          }
          return S;
        }, splitHTMLImageToRGB: (m, S) => {
          let v = m.createKernel(function(V) {
            return V[this.thread.y][this.thread.x].r * 255;
          }, { output: [S.width, S.height], precision: "unsigned", argumentTypes: { a: "HTMLImage" } }), h = m.createKernel(function(V) {
            return V[this.thread.y][this.thread.x].g * 255;
          }, { output: [S.width, S.height], precision: "unsigned", argumentTypes: { a: "HTMLImage" } }), b = m.createKernel(function(V) {
            return V[this.thread.y][this.thread.x].b * 255;
          }, { output: [S.width, S.height], precision: "unsigned", argumentTypes: { a: "HTMLImage" } }), T = m.createKernel(function(V) {
            return V[this.thread.y][this.thread.x].a * 255;
          }, { output: [S.width, S.height], precision: "unsigned", argumentTypes: { a: "HTMLImage" } }), C = [v(S), h(S), b(S), T(S)];
          return C.rKernel = v, C.gKernel = h, C.bKernel = b, C.aKernel = T, C.gpu = m, C;
        }, splitRGBAToCanvases: (m, S, v, h) => {
          let b = m.createKernel(function(c) {
            let a = c[this.thread.y][this.thread.x];
            this.color(a.r / 255, 0, 0, 255);
          }, { output: [v, h], graphical: true, argumentTypes: { v: "Array2D(4)" } });
          b(S);
          let T = m.createKernel(function(c) {
            let a = c[this.thread.y][this.thread.x];
            this.color(0, a.g / 255, 0, 255);
          }, { output: [v, h], graphical: true, argumentTypes: { v: "Array2D(4)" } });
          T(S);
          let C = m.createKernel(function(c) {
            let a = c[this.thread.y][this.thread.x];
            this.color(0, 0, a.b / 255, 255);
          }, { output: [v, h], graphical: true, argumentTypes: { v: "Array2D(4)" } });
          C(S);
          let V = m.createKernel(function(c) {
            let a = c[this.thread.y][this.thread.x];
            this.color(255, 255, 255, a.a / 255);
          }, { output: [v, h], graphical: true, argumentTypes: { v: "Array2D(4)" } });
          return V(S), [b.canvas, T.canvas, C.canvas, V.canvas];
        }, getMinifySafeName: (m) => {
          try {
            let S = p.parse(`const value = ${m.toString()}`), { init: v } = S.body[0].declarations[0];
            return v.body.name || v.body.body[0].argument.name;
          } catch {
            throw new Error("Unrecognized function type.  Please use `() => yourFunctionVariableHere` or function() { return yourFunctionVariableHere; }");
          }
        }, sanitizeName: function(m) {
          return i.test(m) && (m = m.replace(i, "S_S")), u.test(m) ? m = m.replace(u, "U_U") : x2.test(m) && (m = m.replace(x2, "u_u")), m;
        } }, i = /\$/, u = /__/, x2 = /_/, w = t.getSystemEndianness();
        y.exports = { utils: t };
      }, { "./input": 110, "./texture": 113, acorn: 1 }] }, {}, [107])(107);
    });
  });
  var je = {};
  ii(je, { gpuUtils: () => nt, makeCanvasKrnl: () => Ct, makeKrnl: () => fe });
  var Ki = si(Et());
  function ri(L, I) {
    return L + I;
  }
  function ai(L, I) {
    return L - I;
  }
  function oi(L, I) {
    return L * I;
  }
  function ui(L, I) {
    return L / I;
  }
  function li(L, I, $, o) {
    return [L + $, I + o];
  }
  function hi(L, I, $, o) {
    return [L - $, I - o];
  }
  function ci(L, I, $, o) {
    return [L * $ - I * o, L * o + I * $];
  }
  function pi(L, I) {
    let $ = Math.exp(L);
    return [$ * Math.cos(I), $ * Math.sin(I)];
  }
  function xe(L, I) {
    return Math.sqrt(L * L + I * I);
  }
  function fi(L) {
    return 0 - L;
  }
  function di(L) {
    let I = Math.sqrt(L);
    for (var $ = 3; $ <= I; ) {
      if (L % $ === 0)
        return $;
      $ += 2;
    }
  }
  function qe(L, I) {
    for (var $ = 0, o = 0; o < I; o++)
      $ += L[o];
    return $ / I;
  }
  function et(L, I, $) {
    for (var o = 0, y = 0; y < $; y++)
      o += (L[y] - I) * (L[y] - I);
    return Math.sqrt(o);
  }
  function mi(L, I, $) {
    for (var o = 0, y = 0, E = 0; E < $; E++)
      y = L[E] - I, o += y * y;
    return o / $;
  }
  function xi(L, I, $) {
    for (var o = 0, y = 0, E = 0; E < $; E++)
      y = L[E] - I, o += y * y;
    return Math.sqrt(o / $);
  }
  function tt(L, I, $, o, y, E, p, g) {
    for (var f = 0, l = 0; l < p; l++) {
      var n = l + g, s = 0;
      n < p && (s = o[n]), f += (L[l] - I) * (s - y);
    }
    return f / ($ * E);
  }
  function gi(L, I, $) {
    for (var o = 0, y = 0; y < I; y++)
      o += Math.exp(L[y]);
    return Math.exp(L[$]) / o;
  }
  function $e(L, I, $) {
    for (var o = 0, y = 0, E = 1 / I, p = 6.28318530718 * $ * E, g = 0; g < I; g++) {
      var f = p * g;
      o = o + L[g] * Math.cos(f), y = y - L[g] * Math.sin(f);
    }
    return [o * E, y * E];
  }
  function it(L, I, $, o) {
    for (var y = 0, E = 0, p = 1 / I, g = 6.28318530718 * $ * p, f = 0; f < I; f++) {
      var l = g * f;
      y = y + L[f + (I - 1) * o] * Math.cos(l), E = E - L[f + (I - 1) * o] * Math.sin(l);
    }
    return [y * p, E * p];
  }
  function Me(L, I, $, o) {
    var y = 0, E = 0, p = 1 / I, g = 6.28318530718 * $ * p, f = 1, l = 0, n = o * 0.25;
    if ($ <= n)
      for (; $ <= n; )
        n = n * 0.5, f += 1;
    for (var s = 0; s < I; s += f) {
      var t = s;
      t > I && (t = I);
      var i = g * t;
      y = y + L[t] * Math.cos(i), E = E - L[t] * Math.sin(i), l += 1;
    }
    return [y / l, E / l];
  }
  function It(L, I, $, o, y) {
    var E = 0, p = 0, g = 1 / I, f = 6.28318530718 * $ * g, l = 1, n = 0, s = y * 0.25;
    if ($ <= s)
      for (; $ <= s; )
        s = s * 0.5, l += 1;
    for (var t = 0; t < I; t += l) {
      var i = t;
      i > I && (i = I);
      var u = f * i;
      E = E + L[i + (I - 1) * o] * Math.cos(u), p = p - L[i + (I - 1) * o] * Math.sin(u), n += 1;
    }
    return [E / n, p / n];
  }
  function Be(L, I, $) {
    for (var o = 0, y = 0, E = 1 / I, p = 6.28318530718 * $ * E, g = 0; g < I; g++) {
      var f = p * g;
      o = o + L[g] * Math.cos(f), y = L[g] * Math.sin(f) - y;
    }
    return [o * E, y * E];
  }
  function kt(L, I, $, o) {
    for (var y = 0, E = 0, p = 1 / I, g = 6.28318530718 * $ * p, f = 0; f < I; f++) {
      var l = g * f;
      y = y + L[f + (I - 1) * o] * Math.cos(l), E = L[f + (I - 1) * o] * Math.sin(l) - E;
    }
    return [y * p, E * p];
  }
  function We(L, I, $, o) {
    var y = 0, E = 0, p = 1 / I, g = 6.28318530718 * $ * p, f = 1, l = 0, n = o * 0.25;
    if ($ <= n)
      for (; $ <= n; )
        n = n * 0.5, f += 1;
    for (var s = 0; s < I; s += f) {
      var t = s;
      t > I && (t = I);
      var i = g * t;
      y = y + L[t] * Math.cos(i), E = L[t] * Math.sin(i) - E, l += 1;
    }
    return [y / l, E / l];
  }
  function At(L, I, $, o, y) {
    var E = 0, p = 0, g = 1 / I, f = 6.28318530718 * $ * g, l = 1, n = 0, s = y * 0.25;
    if ($ <= s)
      for (; $ <= s; )
        s = s * 0.5, l += 1;
    for (var t = 0; t < I; t += l) {
      var i = t;
      i > I && (i = I);
      var u = f * i;
      E = E + L[i + (I - 1) * o] * Math.cos(u), p = L[i + (I - 1) * o] * Math.sin(u) - p, n += 1;
    }
    return [E / n, p / n];
  }
  function yi(L, I) {
    var $ = Math.floor(this.thread.x / I) * 2, o = this.thread.x - Math.floor(this.thread.x / I) * I, y = qe(L[$], I), E = qe(L[$ + 1], I), p = et(L[$], y, I), g = et(L[$ + 1], E, I), f = tt(L[$], y, p, L[$ + 1], E, g, I, o);
    return f;
  }
  function bi(L, I, $, o) {
    var y = Math.floor(this.thread.x / I) * 2, E = this.thread.x - Math.floor(this.thread.x / I) * I, p = $[y], g = $[y + 1], f = o[y], l = o[y + 1], n = tt(L[y], p, f, L[y + 1], g, l, I, E);
    return n;
  }
  function Ti(L, I, $) {
    var o = $e(L, I, this.thread.x);
    return xe(o[0], o[1]) * $;
  }
  function vi(L, I, $) {
    var o = Be(L, I, this.thread.x);
    return xe(o[0], o[1]) * $;
  }
  function Si(L, I, $, o) {
    var y = Me(L, I, this.thread.x, o);
    return xe(y[0], y[1]) * $;
  }
  function _i(L, I, $, o) {
    var y = We(L, I, this.thread.x, o);
    return xe(y[0], y[1]) * $;
  }
  function wi(L, I) {
    var $ = this.output.x, o = $e(L[this.thread.y], $, this.thread.x);
    return xe(o[0], o[1]) * I;
  }
  function Ei(L, I, $) {
    var o = [0, 0];
    if (this.thread.x <= I)
      o = $e(L, I, this.thread.x);
    else {
      var y = Math.floor(this.thread.x / I);
      o = it(L, I, this.thread.x - y * I, y);
    }
    return xe(o[0], o[1]) * $;
  }
  function Ii(L, I, $, o) {
    var y = [0, 0];
    if (this.thread.x <= I)
      y = Me(L, I, this.thread.x, o);
    else {
      var E = Math.floor(this.thread.x / I);
      y = It(L, I, this.thread.x - E * I, E, o);
    }
    return xe(y[0], y[1]) * $;
  }
  function ki(L, I, $, o, y) {
    var E = [0, 0], p = this.thread.x / I * (o - $) + $;
    return E = $e(L, I, p), xe(E[0], E[1]) * y;
  }
  function Ai(L, I, $, o, y) {
    var E = [0, 0], p = this.thread.x / I * (o - $) + $;
    return E = Me(L, I, p), xe(E[0], E[1]) * y;
  }
  function Di(L, I, $, o, y) {
    var E = [0, 0], p = this.thread.x / I * (o - $) + $;
    return E = Be(L, I, p), xe(E[0], E[1]) * y;
  }
  function Ci(L, I, $, o, y) {
    var E = [0, 0], p = this.thread.x / I * (o - $) + $;
    return E = We(L, I, p), xe(E[0], E[1]) * y;
  }
  function Fi(L, I, $, o, y) {
    var E = [0, 0];
    if (this.thread.x < I) {
      var p = this.thread.x / I * (o - $) + $;
      E = $e(L, I, p);
    } else {
      var g = Math.floor(this.thread.x / I), p = (this.thread.x - g * I) / I * (o - $) + $;
      E = it(L, I, p - g * I, g);
    }
    return xe(E[0], E[1]) * y;
  }
  function $i(L, I, $, o, y) {
    var E = [0, 0];
    if (this.thread.x < I) {
      var p = this.thread.x / I * (o - $) + $;
      E = Me(L, I, p, I);
    } else {
      var g = Math.floor(this.thread.x / I), p = (this.thread.x - g * I) / I * (o - $) + $;
      E = It(L, I, p - g * I, g, I);
    }
    return xe(E[0], E[1]) * y;
  }
  function Li(L, I, $, o, y) {
    var E = [0, 0];
    if (this.thread.x < I) {
      var p = this.thread.x / I * (o - $) + $;
      E = Be(L, I, p);
    } else {
      var g = Math.floor(this.thread.x / I), p = (this.thread.x - g * I) / I * (o - $) + $;
      E = kt(L, I, p - g * I, g);
    }
    return xe(E[0] * 2, E[1] * 2) * y;
  }
  function Ri(L, I, $, o, y) {
    var E = [0, 0];
    if (this.thread.x < I) {
      var p = this.thread.x / I * (o - $) + $;
      E = We(L, I, p);
    } else {
      var g = Math.floor(this.thread.x / I), p = (this.thread.x - g * I) / I * (o - $) + $;
      E = At(L, I, p - g * I, g);
    }
    return xe(E[0] * 2, E[1] * 2) * y;
  }
  function Mi(L, I, $, o) {
    for (var y = $ * Math.floor(this.thread.x / I), E = L[y][this.thread.x], p = 0; p < $; p++)
      E *= L[p][this.thread.x];
    return E * o;
  }
  function Vi(L, I, $, o, y) {
    let E = (Math.sqrt(y) - 1) / 2, p = 2 * E + 1, g = 0, f = 0, l = 0, n = -E, s = 0;
    for (; n <= E; ) {
      if (this.thread.x + n < 0 || this.thread.x + n >= I) {
        n++;
        continue;
      }
      let t = -E;
      for (; t <= E; ) {
        if (this.thread.y + t < 0 || this.thread.y + t >= $) {
          t++;
          continue;
        }
        s = (t + E) * p + n + E;
        let i = o[s], u = L[this.thread.y + n][this.thread.x + t];
        g += u.r * i, f += u.g * i, l += u.b * i, t++;
      }
      n++;
    }
    this.color(g, f, l);
  }
  function Oi(L, I, $, o, y, E) {
    let p = 0, g = 0, f = 0;
    for (var l = 0; l < E; l++) {
      let n = y[l], s = (Math.sqrt(n) - 1) / 2, t = 2 * s + 1, i = -s, u = 0;
      for (; i <= s; ) {
        if (this.thread.x + i < 0 || this.thread.x + i >= I) {
          i++;
          continue;
        }
        let x2 = -s;
        for (; x2 <= s; ) {
          if (this.thread.y + x2 < 0 || this.thread.y + x2 >= $) {
            x2++;
            continue;
          }
          u = (x2 + s) * t + i + s;
          let w = o[l][u], m = L[this.thread.y + i][this.thread.x + x2];
          p += m.r * w, g += m.g * w, f += m.b * w, x2++;
        }
        i++;
      }
    }
    this.color(p, g, f);
  }
  function zi(L) {
    return L[this.thread.y][this.thread.x];
  }
  var me = { correlogramsKern: yi, correlogramsPCKern: bi, dftKern: Ti, idftKern: vi, fftKern: Si, ifftKern: _i, dft_windowedKern: ki, idft_windowedKern: Di, fft_windowedKern: Ai, ifft_windowedKern: Ci, listdft2DKern: wi, listdft1DKern: Ei, listfft1DKern: Ii, listfft1D_windowedKern: $i, listdft1D_windowedKern: Fi, listidft1D_windowedKern: Li, listifft1D_windowedKern: Ri, bulkArrayMulKern: Mi, multiImgConv2DKern: Oi, ImgConv2DKern: Vi, transpose2DKern: zi }, Dt = [ri, ai, oi, ui, li, hi, ci, pi, xe, fi, di, qe, et, mi, xi, tt, gi, $e, it, Be, kt, Me, We, At];
  function fe(L, I, $ = { setDynamicOutput: true, setDynamicArguments: true, setPipeline: true, setImmutable: true, setGraphical: false }) {
    let o = L.createKernel(I);
    return $.setDynamicOutput && o.setDynamicOutput(true), $.output && o.setOutput($.output), $.setDynamicArguments && o.setDynamicArguments(true), $.setPipeline && o.setPipeline(true), $.setImmutable && o.setImmutable(true), $.setGraphical && o.setGraphical(true), o;
  }
  function Ct(L, I, $ = { output: [300, 300], setDynamicArguments: true, setDynamicOutput: true, setPipeline: false, setImmutable: true, setGraphical: true }, o) {
    let y = fe(L, I, $), E = y.canvas;
    return typeof o == "string" ? document.getElementById(toAppend).appendChild(E) : o ? toAppend.appendChild(E) : document.body.appendChild(E), y;
  }
  var nt = class {
    constructor(I = new GPU()) {
      this.gpu = I, this.kernels = /* @__PURE__ */ new Map(), this.kernel, this.PI = 3.141592653589793, this.SQRT1_2 = 0.7071067811865476, this.addFunctions(), this.imgkernels = { edgeDetection: [-1, -1, -1, -1, 8, -1, -1, -1, -1], boxBlur: [1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9], sobelLeft: [1, 0, -1, 2, 0, -2, 1, 0, -1], sobelRight: [-1, 0, 1, -2, 0, 2, -1, 0, 1], sobelTop: [1, 2, 1, 0, 0, 0, -1, -2, -1], sobelBottom: [-1, 2, 1, 0, 0, 0, 1, 2, 1], identity: [0, 0, 0, 0, 1, 0, 0, 0, 0], gaussian3x3: [1, 2, 1, 2, 4, 2, 1, 2, 1], guassian7x7: [0, 0, 0, 5, 0, 0, 0, 0, 5, 18, 32, 18, 5, 0, 0, 18, 64, 100, 64, 18, 0, 5, 32, 100, 100, 100, 32, 5, 0, 18, 64, 100, 64, 18, 0, 0, 5, 18, 32, 18, 5, 0, 0, 0, 0, 5, 0, 0, 0], emboss: [-2, -1, 0, -1, 1, 1, 0, 1, 2], sharpen: [0, -1, 0, -1, 5, -1, 0, -1, 0] };
    }
    addFunction(I = function() {
    }) {
      this.gpu.addFunction(I);
    }
    addKernel(I = "", $ = function() {
    }, o) {
      return this.kernels.get(I) ? (console.error("Kernel already exists"), false) : (this.kernels.set(I, fe(this.gpu, $, o)), true);
    }
    addCanvasKernel(I, $, o, y) {
      if (this.kernels.get(I))
        return console.error("Kernel already exists"), false;
      {
        let p = Ct(this.gpu, $, o, y);
        return this.kernels.set(I, p), p;
      }
    }
    combineKernels(I, $ = [], o = function() {
    }) {
      if (this.kernels.get(I))
        return console.error("Kernel already exists"), false;
      {
        $.forEach((p, g) => {
          if (typeof p == "string") {
            let f = this.kernels.get(p);
            if (f)
              $[g] = f;
            else
              return false;
          } else
            typeof p == "function" && (this.kernels.get(p.name) || this.addKernel(p.name, p));
        });
        let E = this.gpu.combineKernels(...$, o);
        return this.kernels.set(I, E), E;
      }
    }
    callKernel(I = "", $ = []) {
      let o, y = this.kernels.get(I);
      return y ? (o = y(...$), o) : (console.error("Kernel not found"), false);
    }
    callCanvasKernel(I = "", $ = [], o = []) {
      let y, E = this.kernels.get(I);
      return E ? (o.length === 2 && E.setOutput(o), y = E(...$), y) : (console.error("Kernel not found"), false);
    }
    hasKernel(I = "") {
      return !!this.kernels.get(I);
    }
    addFunctions() {
      Dt.forEach((y) => this.gpu.addFunction(y)), this.correlograms = fe(this.gpu, me.correlogramsKern), this.correlogramsPC = fe(this.gpu, me.correlogramsPCKern), this.dft = fe(this.gpu, me.dftKern), this.idft = fe(this.gpu, me.idftKern), this.dft_windowed = fe(this.gpu, me.dft_windowedKern), this.idft_windowed = fe(this.gpu, me.idft_windowedKern), this.fft = fe(this.gpu, me.fftKern), this.ifft = fe(this.gpu, me.ifftKern), this.fft_windowed = fe(this.gpu, me.fft_windowedKern), this.ifft_windowed = fe(this.gpu, me.ifft_windowedKern), this.listdft2D = fe(this.gpu, me.listdft2DKern), this.listdft1D = fe(this.gpu, me.listdft1DKern), this.listdft1D_windowed = fe(this.gpu, me.listdft1D_windowedKern), this.listfft1D = fe(this.gpu, me.listfft1DKern), this.listfft1D_windowed = fe(this.gpu, me.listfft1D_windowedKern), this.listidft1D_windowed = fe(this.gpu, me.listidft1D_windowedKern), this.listifft1D_windowed = fe(this.gpu, me.listifft1D_windowedKern), this.bulkArrayMul = fe(this.gpu, me.bulkArrayMulKern), [{ name: "correlograms", krnl: this.correlograms }, { name: "correlogramsPC", krnl: this.correlogramsPC }, { name: "dft", krnl: this.dft }, { name: "idft", krnl: this.idft }, { name: "dft_windowed", krnl: this.idft_windowed }, { name: "fft", krnl: this.fft }, { name: "ifft", krnl: this.ifft }, { name: "fft_windowed", krnl: this.fft_windowed }, { name: "ifft_windowed", krnl: this.ifft_windowed }, { name: "listdft2D", krnl: this.listdft2D }, { name: "listdft1D", krnl: this.listdft1D }, { name: "listdft1D_windowed", krnl: this.listdft1D_windowed }, { name: "listfft1D", krnl: this.listfft1D }, { name: "listfft1D_windowed", krnl: this.listfft1D_windowed }, { name: "listidft1D_windowed", krnl: this.listidft1D_windowed }, { name: "listifft1D_windowed", krnl: this.listifft1D_windowed }, { name: "bulkArrayMul", krnl: this.bulkArrayMul }].forEach((y) => {
        this.kernels.set(y.name, y);
      });
      let $ = (y, E, p, g, f) => {
        var l = this.fft_windowed(y, E, p, g, f, 0), n = this.ifft_windowed(l, E, p, g, f);
        return n;
      }, o = (y, E, p, g, f) => {
        var l = this.listdft1D_windowed(y, E, p, g, f, new Array(Math.ceil(y / E)).fill(0)), n = this.listifft1D_windowed(l, E, p, g, f);
        return n;
      };
      this.gpuCoherence = (y, E, p, g, f) => {
        var l = this.correlograms(y), n = this.listfft1D_windowed(l, E, p, g, f, new Array(Math.ceil(y / E)).fill(0)), s = this.bulkArrayMul(n, E, 5, 1);
        return s;
      };
    }
    gpuXCors(I, $ = false, o = false) {
      var y;
      if ($ === true) {
        var E = [], p = [];
        I.forEach((u, x2) => {
          E.push(u.reduce((w, m) => m += w) / u.length), p.push(Math.sqrt(E[x2].reduce((w, m) => w += Math.pow(m - mean1, 2))));
        });
        for (var g = [], f = [], l = [], n = 0; n < I.length; n++)
          for (var s = n; s < I.length; s++)
            l.push(...I[n], ...I[s]), g.push(E[n], E[s]), f.push(p[n], p[s]);
        this.correlogramsPC.setOutput([l.length]), this.correlogramsPC.setLoopMaxIterations(I[0].length * 2), y = this.correlogramsPC(l, I[0].length, g, f);
      } else {
        for (var l = [], n = 0; n < I.length; n++)
          for (var s = n; s < I.length; s++)
            l.push(...I[n], ...I[s]);
        this.correlograms.setOutput([l.length]), this.correlograms.setLoopMaxIterations(I[0].length * 2), y = this.correlograms(l, I[0].length);
      }
      if (o === true)
        return y;
      var t = y.toArray();
      y.delete();
      for (var i = [], n = 0; n < I.length; n++)
        i.push(t.splice(0, I[0].length));
      return i;
    }
    gpuDFT(I, $, o = 1, y = false) {
      var E = I.length, p = E / $;
      this.dft.setOutput([I.length]), this.dft.setLoopMaxIterations(E);
      var g = this.dft(I, E, o), f = null;
      if (y === false) {
        var l = this.makeFrequencyDistribution(E, p), n = g.toArray();
        return g.delete(), [l, this.orderMagnitudes(n)];
      } else {
        var s = g;
        return g.delete(), s;
      }
    }
    MultiChannelDFT(I, $, o = 1, y = false) {
      var E = [];
      I.forEach((i) => {
        E.push(...i);
      });
      var p = I[0].length, g = p / $;
      this.listdft1D.setOutput([E.length]), this.listdft1D.setLoopMaxIterations(p);
      var f = this.listdft1D(E, p, o);
      if (y === false) {
        var l = [], n = this.makeFrequencyDistribution(p, g);
        E = f.toArray();
        for (var s = 0; s < E.length; s += p)
          l.push(this.orderMagnitudes([...E.slice(s, s + p)]));
        return f.delete(), [n, l];
      } else {
        var t = f;
        return f.delete(), t;
      }
    }
    MultiChannelDFT_Bandpass(I = [], $, o, y, E = 1, p = false) {
      var g = [];
      I.forEach((i) => {
        g.push(...i);
      });
      var f = y * 2, l = I[0].length, n = l / $;
      this.listdft1D_windowed.setOutput([g.length]), this.listdft1D_windowed.setLoopMaxIterations(l);
      var s = this.listdft1D_windowed(g, n, o, f, E);
      if (p === true)
        return s;
      g = s.toArray(), s.delete();
      var t = this.bandPassWindow(o, y, n);
      return [t, this.orderBPMagnitudes(g, $, n, l)];
    }
    gpuFFT(I, $, o = 1, g, E = false) {
      var p = I.length, g = p / $;
      this.fft.setOutput([I.length]), this.fft.setLoopMaxIterations(p);
      var f = this.fft(I, p, o, g), l = null;
      if (E === false) {
        var n = this.makeFrequencyDistribution(p, g), s = f.toArray();
        return f.delete(), [n, this.orderMagnitudes(s)];
      } else {
        var t = f;
        return f.delete(), t;
      }
    }
    MultiChannelFFT(I, $, o = 1, y = false) {
      var E = [];
      I.forEach((i) => {
        E.push(...i);
      });
      var p = I[0].length, g = p / $;
      this.listfft1D.setOutput([E.length]), this.listfft1D.setLoopMaxIterations(p);
      var f = this.listfft1D(E, p, o, g);
      if (y === false) {
        var l = [], n = this.makeFrequencyDistribution(p, g);
        E = f.toArray();
        for (var s = 0; s < E.length; s += p)
          l.push(this.orderMagnitudes([...E.slice(s, s + p)]));
        return f.delete(), [n, l];
      } else {
        var t = f;
        return f.delete(), t;
      }
    }
    MultiChannelFFT_Bandpass(I = [], $, o, y, E = 1, p = false) {
      var g = [];
      I.forEach((i) => {
        g.push(...i);
      });
      var f = y * 2, l = I[0].length, n = l / $;
      this.listfft1D_windowed.setOutput([g.length]), this.listfft1D_windowed.setLoopMaxIterations(l);
      var s = this.listfft1D_windowed(g, n, o, f, E);
      if (p === true)
        return s;
      g = s.toArray(), s.delete();
      var t = this.bandPassWindow(o, y, n);
      return [t, this.orderBPMagnitudes(g, $, n, l)];
    }
    orderMagnitudes(I) {
      return [...I.slice(Math.ceil(I.length * 0.5), I.length), ...I.slice(0, Math.ceil(I.length * 0.5))];
    }
    makeFrequencyDistribution(I, $) {
      for (var o = I, y = $ / o, E = [], p = -o / 2; p < o / 2; p++) {
        var g = p * y;
        E.push(g);
      }
      return E;
    }
    orderBPMagnitudes(I, $, o, y) {
      for (var E = [], p = 0; p < I.length; p += y)
        E.push([...I.slice(p, Math.ceil(y * 0.5 + p))]);
      var g = [], f = 1 / o;
      return $ > 1 ? (E.forEach((l, n) => {
        g.push([]);
        for (var s = 1 / Math.max(...l), t = 0; t < l.length; t++)
          if (t == 0)
            g[n] = l.slice(t, Math.floor(o)), t = Math.floor(o);
          else {
            var i = t - Math.floor(Math.floor(t * f) * o) - 1;
            g[n][i] = g[n][i] * l[t - 1] * s;
          }
        g[n] = [...g[n].slice(0, Math.ceil(g[n].length * 0.5))];
      }), g) : E;
    }
    bandPassWindow(I, $, o, y = true) {
      var E = $ * 2;
      let p = (E - I) / o;
      var g = [];
      if (y === true)
        for (var f = 0; f < Math.ceil(0.5 * o); f += p)
          g.push(I + (E - I) * f / o);
      else
        for (var f = -Math.ceil(0.5 * o); f < Math.ceil(0.5 * o); f += p)
          g.push(I + (E - I) * f / o);
      return g;
    }
  };
  typeof globalThis.gpujsUtils < "u" ? Object.assign(globalThis.gpujsUtils, je) : globalThis.gpujsUtils = je;
})();

// ../../node_modules/brainsatplay-math/Math2.js
var _Math2 = class {
  constructor() {
  }
  static genSineWave(freq = 20, peakAmp = 1, nSec = 1, fs2 = 512, freq2 = 0, peakAmp2 = 1) {
    var sineWave = [];
    var t = [];
    var increment = 1 / fs2;
    for (var ti = 0; ti < nSec; ti += increment) {
      var amplitude = Math.sin(2 * Math.PI * freq * ti) * peakAmp;
      amplitude += Math.sin(2 * Math.PI * freq2 * ti) * peakAmp2;
      sineWave.push(amplitude);
      t.push(ti);
    }
    return [t, sineWave];
  }
  static getSineAmplitude(frequency = 20, peakAmplitude = 1, ti = 0, tOffset = 0) {
    return Math.sin(this.TWO_PI * frequency * ti + tOffset) * peakAmplitude;
  }
  static mean(arr) {
    var sum = arr.reduce((prev, curr) => curr += prev);
    return sum / arr.length;
  }
  static mode(arr) {
    return arr.sort(
      (a, b) => arr.filter((v) => v === a).length - arr.filter((v) => v === b).length
    ).pop();
  }
  static std(arr, mean = void 0) {
    let avg = mean;
    if (!mean)
      avg = this.mean(arr);
    let summed = 0;
    for (let i = 0; i < arr.length; i++) {
      let subbed = arr[i] - avg;
      summed += subbed * subbed;
    }
    return Math.sqrt(summed / arr.length);
  }
  static relError(actual = [], forecast = [], abs = true) {
    if (actual.length !== forecast.length)
      throw new Error("Input arrays of same length!");
    let i = actual.length;
    let d = new Array(actual.length);
    for (let j = 0; j < i; j++) {
      let dd = (actual[j] - forecast[j]) / actual[j];
      if (abs)
        dd = Math.abs(dd);
      d[j] = dd;
    }
    return d;
  }
  static informationEntropy(probabilities = []) {
    let len = probabilities.length;
    let entropy = new Array(len);
    for (let i = 0; i < len; i++) {
      let ent = probabilities[i] * Math.log(probabilities[i]);
      if (isNaN(ent))
        ent = 0;
      entropy[i] = ent;
    }
    return entropy;
  }
  static zscore(arr) {
    let mean = this.mean(arr);
    let std = this.std(arr, mean);
    let z = new Array().length(arr.length);
    for (let i = 0; i < arr.length; i++) {
      z[i] = (arr[i] - mean) / std;
    }
    return z;
  }
  static variance(arr) {
    var mean = this.mean(arr);
    return arr.reduce((a, b) => a + (b - mean) ** 2, 0) / arr.length;
  }
  static dot(vec1, vec2) {
    var dot = 0;
    for (var i = 0; i < vec1.length; i++) {
      dot += vec1[i] * vec2[i];
    }
    return dot;
  }
  static cross3D(vec1, vec2) {
    return [
      vec1[1] * vec2[2] - vec1[2] * vec2[1],
      vec1[2] * vec2[0] - vec1[0] * vec2[2],
      vec1[0] * vec2[1] - vec1[1] * vec2[0]
    ];
  }
  static magnitude(vec) {
    var sqrd = 0;
    vec.forEach((c) => {
      sqrd += c * c;
    });
    return Math.sqrt(sqrd);
  }
  static distance(point1, point2) {
    var dsqrd = 0;
    point1.forEach((c, i) => {
      dsqrd += (point2[i] - c) * (point2[i] - c);
    });
    return Math.sqrt(dsqrd);
  }
  static midpoint(point1 = [1, 2, 3], point2 = [3, 4, 5]) {
    return point1.map((c, i) => {
      return (c + point2[i]) * 0.5;
    });
  }
  static normalize(vec) {
    var norm = 0;
    norm = this.magnitude(vec);
    var vecn = new Array(vec.length);
    vec.forEach((c, i) => {
      vecn[i] = c * norm;
    });
    return vecn;
  }
  static normalizeSeries(arr = [], fromZero = true) {
    let max = Math.max(...arr);
    let min = Math.min(...arr);
    if (fromZero == false) {
      max = Math.max(max, Math.abs(min));
      min = 0;
    }
    if (max - min === 0) {
      min = 0;
      if (max === 0)
        max = 1e-13;
    }
    return arr.map((v) => (v - min) / (max - min));
  }
  static quadraticFormula(a, b, c) {
    let bbmac4 = Math.sqrt(b * b - 4 * a * c);
    if (!isNaN(bbmac4))
      return ["complex", "complex"];
    let _a2 = 1 / (2 * a);
    if (bbmac4 === 0)
      return [b * _a2];
    let nb = -b;
    return [(nb + bbmac4) * _a2, (nb - bbmac4) * _a2];
  }
  static newtonsMethod(foo = (x2) => {
    return Math.pow(x2, 5) + x2 * x2 - x2 - 0.2;
  }, start = 0, end = 1, precision = 0.01, attempts = 10) {
    let roots = [];
    for (let i = 0; i < attempts; i++) {
      let seedx = Math.random() * (end - start);
      let guess = foo(seedx);
      let guess2 = foo(seedx + precision);
      let slope = (guess2 - guess) / precision;
      let xn = seedx + precision;
      while (Math.abs(slope) > precision) {
        let step = -guess / slope2;
        let xn12 = xn + step;
        guess = guess2;
        guess2 = foo(xn12);
        let slope2 = (guess2 - guess) / (xn12 - xn);
      }
      let idx;
      let f = roots.find((root, i2) => {
        if (Math.abs(xn1 - root) < precision) {
          idx = i2;
          return true;
        }
      });
      if (f)
        roots[idx] = (xn1 + f) * 0.5;
      else
        roots.push(xn1);
    }
    return roots;
  }
  static makeVec(point1, point2) {
    var vec = [];
    point1.forEach((c, i) => {
      vec.push(point2[i] - c);
    });
    return vec;
  }
  static getBufferedValueByCoordinates(vb = new Array(300).fill(1), dims = [10, 10, 2], coordinate = [1, 2, 1], cardinal = void 0) {
    let getIdx = (foundIdx = 0, dimIdx = 0) => {
      if (dimIdx === dims.length)
        return foundIdx;
      if (dimIdx == 0)
        foundIdx += coordinate[dimIdx];
      else if (dims[dimIdx] == 0)
        dimsAt0++;
      else {
        let reMul = (val = coordinate[dimIdx], di = dimIdx - 1) => {
          val *= dims[di];
          di--;
          if (di == 0)
            return val;
          else
            return reMul(val, di);
        };
        foundIdx += reMul(coordinate[dimIdx] + 1, dimIdx - 1);
      }
      dimIdx++;
      return getIdx(foundIdx, dimIdx);
    };
    let found = getIdx();
    if (cardinal) {
      if (coordinate[coordinate.length - 1] === 0) {
        let lastnonzero = 0;
        let idx = 0;
        while (idx !== coordinate.length - 1) {
          if (coordinate[idx] !== 0)
            lastnonzero = idx;
          idx++;
        }
        return vb[found - lastnonzero + cardinal];
      }
      return vb[found - dims.length + cardinal];
    } else {
      if (coordinate[coordinate.length - 1] === 0) {
        let lastnonzero = 0;
        let idx = 0;
        while (idx !== coordinate.length - 1) {
          if (coordinate[idx] !== 0)
            lastnonzero = idx;
          idx++;
        }
        return vb.slice(found - lastnonzero, found + 1);
      }
      return vb.slice(found - dims.length, found + 1);
    }
  }
  static forBufferedMat(vb = new Array(100).fill(1), dims = [10, 10], asIndex = (v, i, x2, y) => {
    return v + x2 + y;
  }) {
    let coordinate = [];
    let idx = 0;
    let recurseFor = (depth = 0, nextDepth = depth + 1) => {
      let result = new Array(vb.length);
      for (let di = 0; di < dims[depth]; di++) {
        coordinate[depth] = di;
        if (dims[nextDepth])
          recurseFor(nextDepth);
        else {
          result[idx] = asIndex(vb[idx], idx, ...coordinate);
          idx++;
        }
      }
      return result;
    };
    let recurseForArrFuncs = (depth, nextDepth = depth + 1) => {
      let result = new Array(vb.length);
      for (let di = 0; di < dims[depth]; di++) {
        coordinate[depth] = di;
        if (dims[nextDepth])
          recurseFor(nextDepth);
        else {
          for (let dj = 0; dj < dims.length; dj++) {
            result[idx] = asIndex[dj](vb[idx], idx, ...coordinate);
            idx++;
          }
        }
      }
      return result;
    };
    if (typeof asIndex === "function") {
      return recurseFor();
    } else if (Array.isArray(asIndex)) {
      return recurseForArrFuncs();
    }
  }
  static mapBufferedMat(buffer = new Array(100).fill(1), dimensions = [10, 10], asIndex = (v, idx, i, j) => {
    console.log(`value:${v}, idx:${idx}, x:${i},y:${j}`);
    return v + i + j;
  }) {
    let coordinate = new Array(dimensions.length).fill(0);
    const iterateCoordinate = (coord, idx = 0) => {
      if (coord[idx] >= dimensions[idx]) {
        coord[idx] = 0;
        idx++;
        if (idx === dimensions.length)
          return;
        iterateCoordinate(coord, idx);
      } else
        coord[idx]++;
    };
    let result = new Array(buffer.length);
    let i = 0;
    if (typeof asIndex === "function") {
      while (i < buffer.length) {
        result[i] = asIndex(buffer[i], i, ...coordinate);
        i += dimensions.length;
        iterateCoordinate(coordinate);
      }
    } else if (Array.isArray(asIndex)) {
      while (i < buffer.length) {
        asIndex.forEach((func) => {
          result[i] = func(buffer[i], i, ...coordinate);
          i++;
          iterateCoordinate(coordinate);
        });
      }
    }
    return result;
  }
  static combinations(choices = ["a", "b", "c"], vecsize = 3) {
    var result = [];
    if (vecsize <= 0) {
      result.push([]);
    } else {
      _Math2.combinations(choices, vecsize - 1).forEach(function(previousComb) {
        choices.forEach(function(element) {
          result.push([element].concat(previousComb));
        });
      });
    }
    return result;
  }
  static generateCoordinateSpace(upperBounds = [10, 10, 10], lowerBounds = [-10, -10, -10], steps = [1, 1, 1], mutater = void 0) {
    for (let i = 0; i < upperBounds.length; i++) {
      if (lowerBounds[i] > upperBounds[i]) {
        let temp = upperBounds[i];
        upperBounds[i] = lowerBounds[i];
        lowerBounds[i] = temp;
      }
    }
    let result = [];
    let copy = [...upperBounds];
    let lastindex = copy.length - 1;
    result.push([...copy]);
    while (copy[0] >= lowerBounds[0]) {
      let checkNextIndex = (decrIdx2) => {
        if (copy[decrIdx2] <= lowerBounds[decrIdx2]) {
          if (decrIdx2 === 0)
            return;
          copy[decrIdx2] = upperBounds[decrIdx2];
          decrIdx2--;
          if (decrIdx2 < 0)
            return;
          if (typeof steps[decrIdx2] == "function")
            copy[decrIdx2] -= steps[decrIdx2](copy[decrIdx2]);
          else
            copy[decrIdx2] -= steps[decrIdx2];
          checkNextIndex(decrIdx2);
        }
      };
      let decrIdx = lastindex;
      if (typeof steps[decrIdx] == "function")
        copy[decrIdx] -= steps[decrIdx](copy[decrIdx]);
      else
        copy[decrIdx] -= steps[decrIdx];
      result.push([...copy]);
      checkNextIndex(decrIdx);
      if (mutater)
        result[result.length - 1] = mutater(result[result.length - 1]);
    }
    return result;
  }
  static calcVectorField(coordinates = [[0, 0], [0, 1], [1, 0], [1, 1]], formula = (x2, y) => {
    return [x2 * 10, y * 10];
  }) {
    return coordinates.map((vec) => formula(...vec));
  }
  static transpose(mat) {
    return mat[0].map((_, colIndex) => mat.map((row) => row[colIndex]));
  }
  static matmul(a, b) {
    var aNumRows = a.length, aNumCols = a[0].length, bNumRows = b.length, bNumCols = b[0].length, m = new Array(aNumRows);
    for (var r = 0; r < aNumRows; ++r) {
      m[r] = new Array(bNumCols);
      for (var c = 0; c < bNumCols; ++c) {
        m[r][c] = 0;
        for (var i = 0; i < aNumCols; ++i) {
          m[r][c] += a[r][i] * b[i][c];
        }
      }
    }
    return m;
  }
  static matscale(mat, scalar) {
    let m = [];
    for (var i = 0; i < mat.length; i++) {
      m[i] = [];
      for (let j = 0; j < mat[0].length; j++) {
        m[i][j] = mat[i][j] * scalar;
      }
    }
    return m;
  }
  static matadd(a, b) {
    let m = [];
    for (let i = 0; i < a.length; i++) {
      m[i] = [];
      for (var j = 0; j < a[0].length; j++) {
        m[i][j] = a[i][j] + b[i][j];
      }
    }
    return m;
  }
  static matsub(a, b) {
    let m = [];
    for (let i = 0; i < a.length; i++) {
      m[i] = [];
      for (var j = 0; j < a[0].length; j++) {
        m[i][j] = a[i][j] - b[i][j];
      }
    }
    return m;
  }
  static histogram(arr = [], binSize = 1, nBins = void 0) {
    let copy = [...arr];
    copy.sort(function(a, b) {
      return a - b;
    });
    let binStart = Math.min(...copy);
    if (typeof nBins === "number") {
      let binEnd = Math.max(...copy);
      binSize = Math.abs((binEnd - binStart) / (nBins - 1));
    }
    let j = binStart;
    let binx = [];
    let biny = [];
    for (let i = 0; i < copy.length; i++) {
      let binidx = binSize * j;
      if (copy[i] > binStart + binidx) {
        j++;
        binidx += binSize;
        let binmin = binStart + binidx;
        let binmid = binmin + binidx * 0.5;
        binx.push(binmid);
        biny.push(0);
      }
      biny[biny.length - 1]++;
    }
    return [binx, biny];
  }
  static normalDistribution(samples = [], normalize = true, cutoff = 1e-4) {
    let m = this.mean(samples);
    let vari = this.variance(samples);
    let nSamples = samples.length;
    let probabilities = [];
    let denom = 1 / (this.TWO_PI * vari);
    let _variance = 1 / vari;
    let sum = 0;
    for (let i = 0; i < nSamples; i++) {
      let px = Math.exp(-0.5 * Math.pow((samples[i] - m) * _variance, 2)) * denom;
      if (px < cutoff)
        px = 0;
      probabilities.push(px);
      sum += px;
    }
    if (normalize) {
      let _sum = 1 / sum;
      probabilities = probabilities.map((x2) => x2 * _sum);
    }
    return probabilities;
  }
  static expectedValue(samples = [], probabilities = this.normalDistribution(samples)) {
    return samples.reduce((sum, item, idx) => sum + item * probabilities[idx]);
  }
  static originMoment(samples = [], probabilities = this.normalDistribution(samples), order = 1) {
    return samples.reduce((sum, item, idx) => sum + Math.pow(item, order) * probabilities[idx]);
  }
  static centralMoment(samples = [], probabilities = this.normalDistribution(samples), order = 1) {
    let m = this.mean(samples);
    return samples.reduce((sum, item, idx) => sum + Math.pow(item - m, order) * probabilities[idx] / samples.length);
  }
  static linearDiscriminantAnalysis(samples = [], classifier = []) {
    let mean = this.mean(samples);
    let meank = this.mean(classifier);
    let covariance = this.cov1d(samples, classifier);
    let probs = this.normalDistribution(samples);
    let dk = [];
    for (let i = 0; i < samples.length; i++) {
      dk.push(x[i] * covariance * meank - 0.5 * mean * covariance * meank + Math.log10(probs[i]));
    }
    return dk;
  }
  static conv1D(arr = [], kern = [1 / 3, 1 / 3, 1 / 3], pad = Math.floor(kern.length * 0.5)) {
    let result = [];
    let _n = 1 / kern.length;
    if (pad > 0) {
      let pads = new Array(pad).fill(0);
      arr = [...pads, ...arr, ...pads];
    }
    let start = Math.floor(kern.length * 0.5);
    let end = arr.length - kern.length + start;
    for (let i = start; i < end; i++) {
      let acc = 0;
      for (let j = 0; j < kern.length; j++) {
        acc += arr[i - start] * kern[j];
      }
      result.push(acc * _n);
    }
    return result;
  }
  static conv2D(mat = [[], [], []], kern = [[], [], []], pad = 0) {
    let result = new Array(mat.length - Math.ceil(kern.length * 0.5)).fill([]);
    let mat_t;
    let kern_t = _Math2.transpose(kern_t);
    if (pad > 0) {
      let pads = new Array(pad).fill(0);
      mat_t = _Math2.transpose(mat);
      for (let i2 = 0; i2 < mat_t.length; i2++) {
        mat_t[i2] = [...pads, ...mat_t[i2], ...pads];
      }
      mat = _Math2.transpose(mat_t);
      for (let j = 0; j < mat.length; j++) {
        mat[j] = [...pads, ...mat[j], ...pads];
      }
    }
    let startr = Math.floor(kern[0].length * 0.5);
    let startl = Math.floor(kern_t[0].length * 0.5);
    let endr = mat[0].length - kern[0].length + startr;
    let endl = mat_t[0].length - kern_t[0].length + startl;
    let _n = 1 / (kern[0].length * kern_t[0].length);
    let iters = endr * endl;
    let i = startr;
    let x2;
    let y = startl;
    while (i < iters) {
      let acc = 0;
      x2 = i % mat[0].length;
      if (x2 === 0) {
        y++;
      }
      for (let j = 0; j < kern[0].length; j++) {
        for (let k = 0; k < kern_t[0].length; j++) {
          acc += mat[y - startl + k][x2 - startr + j] * kern[k][j];
        }
        result[y].push(acc * _n);
      }
      i++;
    }
    return result;
  }
  static cov2d(mat) {
    var mattransposed = this.transpose(mat);
    var matproducts = [];
    var rowmeans = [];
    var colmeans = [];
    mat.forEach((row, idx) => {
      rowmeans.push(this.mean(row));
    });
    mattransposed.forEach((col, idx) => {
      colmeans.push(this.mean(col));
    });
    mat.forEach((row, idx) => {
      matproducts.push([]);
      for (var col = 0; col < row.length; col++) {
        matproducts[idx].push((mat[idx][col] - rowmeans[idx]) * (mat[idx][col] - colmeans[col]) / (row.length - 1));
      }
    });
    var matproductstransposed = this.transpose(matproducts);
    var aNumRows = matproducts.length, aNumCols = matproducts[0].length, bNumRows = matproductstransposed.length, bNumCols = matproductstransposed[0].length, m = new Array(aNumRows);
    for (var r = 0; r < aNumRows; ++r) {
      m[r] = new Array(bNumCols);
      for (var c = 0; c < bNumCols; ++c) {
        m[r][c] = 0;
        for (var i = 0; i < aNumCols; ++i) {
          m[r][c] += matproducts[r][i] * matproductstransposed[i][c] / (mat[0].length - 1);
        }
      }
    }
    return m;
  }
  static cov1d(arr1 = [], arr2 = []) {
    return this.cov2d([arr1, arr2]);
  }
  static cov3d(x2 = [], y = [], z = []) {
    return [
      [this.cov1d(x2, x2), this.cov1d(x2, y), this.cov1d(x2, z)],
      [this.cov1d(y, x2), this.cov1d(y, y), this.cov1d(y, z)],
      [this.cov1d(z, x2), this.cov1d(z, y), this.cov1d(z, z)]
    ];
  }
  static covNd(dimensionalData = []) {
    let covariance = [];
    dimensionalData.forEach((arr, i) => {
      covariance.push([]);
      dimensionalData.forEach((arr2, j) => {
        covariance[i].push(this.cov1d(arr, arr2));
      });
    });
  }
  static eigens2x2(mat = [[1, 2], [3, 4]]) {
    let det = mat[0][0] * mat[1][1] - mat[0][1] * mat[1][0];
    let mean = (mat[0][0] + mat[1][1]) * 0.5;
    let sqrt = Math.sqrt(mean * mean - det);
    let eig1 = mean + sqrt;
    let eig2 = mean - sqrt;
    return [eig1, eig2];
  }
  static eigenvectors2x2(mat = [[1, 2], [3, 4]], eigens = [1, 2]) {
    let v1 = [-mat[0][1], mat[0][0] - eigens[0]];
    if (v1[0] === 0 && v1[1] === 0) {
      v1[0] = mat[1][1] - eigens[0];
      v1[1] = -mat[1][0];
    }
    let v2 = [-mat[0][1], mat[0][0] - eigens[1]];
    if (v2[0] === 0 && v2[1] === 0) {
      v2[0] = mat[1][1] - eigens[1];
      v2[1] = -mat[1][0];
    }
    return [v1, v2];
  }
  static fastpca2d(xarr, yarr) {
    let cov1d = this.cov1d(xarr, yarr);
    let eigs = this.eigens2x2(cov1d);
    if (eigs[1] > eigs[0])
      eigs.reverse();
    let evs = this.eigenvectors2x2(cov1d, eigs);
    console.log(eigs, evs);
    return [eigs, evs];
  }
  static crosscorrelation(arr1, arr2) {
    var arr2buf = [...arr2, ...Array(arr2.length).fill(0)];
    var mean12 = this.mean(arr1);
    var mean2 = this.mean(arr2);
    var arr1Est = arr1.reduce((sum, item) => sum += Math.pow(item - mean12, 2));
    arr1Est = Math.sqrt(arr1Est);
    var arr2Est = arr2.reduce((sum, item) => sum += Math.pow(item - mean12, 2));
    arr2Est = Math.sqrt(arr2Est);
    var _arrEstsMul = 1 / (arr1Est * arr2Est);
    var correlations = new Array(arr1.length).fill(0);
    for (var delay = 0; delay < arr1.length; delay++) {
      var r = arr1.reduce((sum, item, i) => sum += (item - mean12) * (arr2buf[delay + i] - mean2));
      correlations[delay] = r * _arrEstsMul;
    }
    return correlations;
  }
  static autocorrelation(arr1) {
    var delaybuf = [...arr1, ...Array(arr1.length).fill(0)];
    var mean12 = this.mean(arr1);
    var arr1Est = arr1.reduce((sum, item) => sum += Math.pow(item - mean12, 2));
    arr1Est = Math.sqrt(arr1Est);
    var _arr1estsqrd = 1 / (arr1Est * arr1Est);
    var correlations = new Array(arr1.length).fill(0);
    for (var delay = 0; delay < arr1.length; delay++) {
      var r = arr1.reduce((sum, item, i) => sum += (item - mean12) * (delaybuf[delay + i] - mean12));
      correlations[delay] = r * _arr1estsqrd;
    }
    return correlations;
  }
  static autocorrelation2dNormalized(mat2d2) {
    let result = [];
    for (let y = 0; y < mat2d2.length; y++) {
      result.push([]);
      for (let x2 = 0; x2 < mat2d2[y].length; x2++) {
        let G = 0;
        let _G = 0;
        for (let b = 0; b < mat2d2.length; b++) {
          for (let a = 0; a < mat2d2[b].length; a++) {
            G += mat2d2[y][x2] * mat2d2[mat2d2.length - 1 - b][mat2d2[y].length - 1 - a];
            _G += mat2d2[y][x2] * mat2d2[mat2d2.length - 1][mat2d2[y].length - 1];
          }
        }
        result[y][x2] = G / _G - 1;
      }
    }
    return result;
  }
  static crosscorrelation2d(mat2d1, mat2d2) {
    let result = [];
    for (let y = 0; y < mat2d1.length; y++) {
      result.push([]);
      for (let x2 = 0; x2 < mat2d1[y].length; x2++) {
        let G = 0;
        for (let b = 0; b < mat2d2.length; b++) {
          for (let a = 0; a < mat2d2[b].length; a++) {
            G += mat2d1[y][x2] * mat2d2[mat2d2.length - 1 - b][mat2d2[y].length - 1 - a];
          }
        }
        result[y][x2] = G;
      }
    }
    return result;
  }
  static crosscorrelation2dNormalized(mat2d1, mat2d2) {
    let result = [];
    for (let y = 0; y < mat2d1.length; y++) {
      result.push([]);
      for (let x2 = 0; x2 < mat2d1[y].length; x2++) {
        let G = 0;
        let _G = 0;
        for (let b = 0; b < mat2d2.length; b++) {
          for (let a = 0; a < mat2d2[b].length; a++) {
            G += mat2d1[y][x2] * mat2d2[mat2d.length - 1 - b][mat2d2[y].length - 1 - a];
            _G += mat2d1[y][x2] * mat2d2[mat2d2.length - 1][mat2d2[y].length - 1];
          }
        }
        result[y][x2] = G / _G - 1;
      }
    }
    return result;
  }
  static correlograms(dat = [[], []]) {
    var correlograms = [];
    dat.forEach((row1, i) => {
      dat.forEach((row2, j) => {
        if (j >= i) {
          correlograms.push(_Math2.crosscorrelation(row1, row2));
        }
      });
    });
    return correlograms;
  }
  static dft(sineWave = []) {
    var TWOPI = 2 * 3.141592653589793;
    var real = [];
    var imag = [];
    var mags = [];
    for (var k = 0; k < sineWave.length; k++) {
      real.push(0);
      imag.push(0);
      for (var j = 0; j < sineWave.length; j++) {
        var shared = TWOPI * k * j / sineWave.length;
        real[k] = real[k] + sineWave[j] * Math.cos(shared);
        imag[k] = imag[k] - sineWave[j] * Math.sin(shared);
      }
      mags.push(Math.sqrt(real[k] * real[k] + imag[k] * imag[k]));
    }
    function orderMagnitudes(unorderedMags) {
      return [...unorderedMags.slice(Math.ceil(unorderedMags.length * 0.5), unorderedMags.length), ...unorderedMags.slice(0, Math.ceil(unorderedMags.length * 0.5))];
    }
    mags = orderMagnitudes(mags);
    let halflen = mags.length * 0.5;
    let freqs = mags.map((m, i) => {
      return i - halflen;
    });
    return {
      real,
      imag,
      freqs,
      mags
    };
  }
  static sma(arr = [], window2) {
    var smaArr = [];
    for (var i = 0; i < arr.length; i++) {
      if (i == 0) {
        smaArr.push(arr[0]);
      } else if (i < window2) {
        var arrslice = arr.slice(0, i + 1);
        smaArr.push(arrslice.reduce((previous, current) => current += previous) / (i + 1));
      } else {
        var arrslice = arr.slice(i - window2, i);
        smaArr.push(arrslice.reduce((previous, current) => current += previous) / window2);
      }
    }
    return smaArr;
  }
  static sum(arr = []) {
    if (arr.length > 0) {
      var sum = arr.reduce((prev, curr) => curr += prev);
      return sum;
    } else {
      return 0;
    }
  }
  static reduceArrByFactor(arr, factor = 2) {
    let x2 = arr.filter((element, index) => {
      return index % factor === 0;
    });
    return x2;
  }
  static makeArr(startValue, stopValue, nSteps) {
    var arr = [];
    var step = (stopValue - startValue) / (nSteps - 1);
    for (var i = 0; i < nSteps; i++) {
      arr.push(startValue + step * i);
    }
    return arr;
  }
  static autoscale(array, stackedLines = 1, stackPosition = 0, centerZero = false) {
    if (array?.length === 0)
      return array;
    let max = Math.max(...array);
    let min = Math.min(...array);
    let _lines = 1 / stackedLines;
    let scalar;
    if (centerZero) {
      let absmax = Math.max(Math.abs(min), Math.abs(max));
      scalar = _lines / absmax;
      return array.map((y) => y * scalar + (_lines * (stackPosition + 1) * 2 - 1 - _lines));
    } else {
      scalar = _lines / (max - min);
      return array.map((y) => 2 * ((y - min) * scalar - 1 / (2 * stackedLines)) + (_lines * (stackPosition + 1) * 2 - 1 - _lines));
    }
  }
  static absmax(array) {
    return Math.max(Math.abs(Math.min(...array)), Math.max(...array));
  }
  static downsample(array, fitCount, scalar = 1) {
    if (array.length > fitCount) {
      let output = new Array(fitCount);
      let incr = array.length / fitCount;
      let lastIdx = array.length - 1;
      let last = 0;
      let counter = 0;
      for (let i = incr; i < array.length; i += incr) {
        let rounded = Math.round(i);
        if (rounded > lastIdx)
          rounded = lastIdx;
        for (let j = last; j < rounded; j++) {
          output[counter] += array[j];
        }
        output[counter] /= (rounded - last) * scalar;
        counter++;
        last = rounded;
      }
      return output;
    } else
      return array;
  }
  static interpolateArray(data, fitCount, scalar = 1) {
    var linearInterpolate = function(before2, after2, atPoint2) {
      return (before2 + (after2 - before2) * atPoint2) * scalar;
    };
    var newData = new Array();
    var springFactor = new Number((data.length - 1) / (fitCount - 1));
    newData[0] = data[0];
    for (var i = 1; i < fitCount - 1; i++) {
      var tmp = i * springFactor;
      var before = new Number(Math.floor(tmp)).toFixed();
      var after = new Number(Math.ceil(tmp)).toFixed();
      var atPoint = tmp - before;
      newData[i] = linearInterpolate(data[before], data[after], atPoint);
    }
    newData[fitCount - 1] = data[data.length - 1];
    return newData;
  }
  static isExtrema(arr, critical = "peak") {
    let ref = [...arr];
    if (ref.length % 2 === 0)
      ref.pop();
    if (arr.length > 1) {
      let pass = true;
      for (let i = 0; i < ref.length; i++) {
        let val = ref[i];
        if (critical === "peak") {
          if (i < Math.floor(ref.length * 0.5) && val >= ref[Math.floor(ref.length * 0.5)]) {
            pass = false;
            break;
          } else if (i > Math.floor(ref.length * 0.5) && val >= ref[Math.floor(ref.length * 0.5)]) {
            pass = false;
            break;
          }
        } else if (critical === "valley") {
          if (i < Math.floor(ref.length * 0.5) && val <= ref[Math.floor(ref.length * 0.5)]) {
            pass = false;
            break;
          } else if (i > Math.floor(ref.length * 0.5) && val <= ref[Math.floor(ref.length * 0.5)]) {
            pass = false;
            break;
          }
        } else {
          if (i < Math.floor(ref.length * 0.5) && val <= ref[Math.floor(ref.length * 0.5)]) {
            pass = false;
            break;
          } else if (i > Math.floor(ref.length * 0.5) && val <= ref[Math.floor(ref.length * 0.5)]) {
            pass = false;
            break;
          }
        }
      }
      if (critical !== "peak" && critical !== "valley" && pass === false) {
        pass = true;
        for (let i = 0; i < ref.length; i++) {
          let val = ref[i];
          if (i < Math.floor(ref.length * 0.5) && val >= ref[Math.floor(ref.length * 0.5)]) {
            pass = false;
            break;
          } else if (i > Math.floor(ref.length * 0.5) && val >= ref[Math.floor(ref.length * 0.5)]) {
            pass = false;
            break;
          }
        }
      }
      return pass;
    } else
      return void 0;
  }
  static isCriticalPoint(arr, critical = "peak") {
    let ref = [...arr];
    if (ref.length % 2 === 0)
      ref.pop();
    if (arr.length > 1) {
      let pass = true;
      for (let i = 0; i < ref.length; i++) {
        let val = ref[i];
        if (critical === "peak") {
          if (i < ref.length * 0.5 && val <= 0) {
            pass = false;
            break;
          } else if (i > ref.length * 0.5 && val > 0) {
            pass = false;
            break;
          }
        } else if (critical === "valley") {
          if (i < ref.length * 0.5 && val >= 0) {
            pass = false;
            break;
          } else if (i > ref.length * 0.5 && val < 0) {
            pass = false;
            break;
          }
        } else {
          if (i < ref.length * 0.5 && val >= 0) {
            pass = false;
            break;
          } else if (i > ref.length * 0.5 && val < 0) {
            pass = false;
            break;
          }
        }
      }
      if (critical !== "peak" && critical !== "valley" && pass === false) {
        pass = true;
        for (let i = 0; i < ref.length; i++) {
          let val = ref[i];
          if (i < ref.length * 0.5 && val <= 0) {
            pass = false;
            break;
          } else if (i > ref.length * 0.5 && val > 0) {
            pass = false;
            break;
          }
        }
      }
      return pass;
    } else
      return void 0;
  }
  static getPeakThreshold(arr, peakIndices, thresholdVar) {
    let threshold;
    let filtered = arr.filter((o, i) => {
      if (peakIndices.indexOf(i) > -1)
        return true;
    });
    if (thresholdVar === 0) {
      threshold = this.mean(filtered);
    } else
      threshold = (thresholdVar + this.mean(filtered)) * 0.5;
    return threshold;
  }
  static column(mat, x2) {
    let col = new Array(mat.length).fill(0).map(() => new Array(1).fill(0));
    for (let i = 0; i < mat.length; i++) {
      col[i][0] = mat[i][x2];
    }
    return col;
  }
  static flatten_vector(v) {
    let v_new = [];
    for (let i = 0; i < v.length; i++) {
      v_new[i] = v[i][0];
    }
    return v_new;
  }
  static squared_difference(v1, v2) {
    let sum = 0;
    for (let i = 0; i < v1.length; i++) {
      sum = sum + Math.pow(v1[i] - v2[i], 2);
    }
    return sum;
  }
  static shift_deflate(mat, eigenvalue, eigenvector) {
    let len = Math.sqrt(this.matmul(this.transpose(eigenvector), eigenvector));
    let U = this.matscale(eigenvector, 1 / len);
    let delta = this.matscale(this.matmul(U, this.transpose(U)), eigenvalue);
    let M_new = this.matsub(mat, delta);
    return M_new;
  }
  static eigenvalue_of_vector(mat, eigenvector) {
    ev = this.matmul(this.matmul(this.transpose(eigenvector), mat), eigenvector);
    return ev;
  }
  static power_iteration(mat, tolerance = 1e-5, max_iterations = 1e3) {
    let rank = mat.length;
    let eigenvector = new Array(rank).fill(0).map(() => new Array(1).fill(Math.sqrt(rank)));
    let eigenvalue = this.eigenvalue_of_vector(mat, eigenvector);
    let epsilon = 1;
    let iter = 0;
    while (epsilon > tolerance && iter < max_iterations) {
      let old_eigenvalue = JSON.parse(JSON.stringify(eigenvalue));
      let Mv = this.matmul(mat, eigenvector);
      eigenvector = this.normalize(Mv);
      eigenvalue = this.eigenvalue_of_vector(mat, eigenvector);
      epsilon = Math.abs(eigenvalue - old_eigenvalue);
      iter++;
    }
    ;
    return [eigenvalue, eigenvector];
  }
  static eigens(mat, tolerance = 1e-4, max_iterations = 1e3) {
    let eigenvalues = [];
    let eigenvectors = [];
    for (let i = 0; i < mat.length; i++) {
      let result = this.power_iteration(mat, tolerance, max_iterations);
      let eigenvalue = result[0];
      let eigenvector = result[1];
      eigenvalues[i] = eigenvalue;
      eigenvectors[i] = this.flatten_vector(eigenvector);
      mat = this.shift_deflate(mat, eigenvalue, eigenvector);
    }
    return [eigenvalues, eigenvectors];
  }
  static pca(mat, tolerance = 1e-5) {
    let dims = mat.length;
    let t = new Array(dims);
    let p = new Array(dims);
    let mat_t = this.transpose(mat);
    t[0] = this.column(mat, 0);
    let epsilon = 1;
    let iter = 0;
    while (espilon > tolerance) {
      iter++;
      p[0] = this.matmul(mat_t, t[0]);
      let tp = this.matmul(this.transpose(t[0]), t[0]);
      p[0] = this.matscale(p[0], 1 / tp);
      let p_length = Math.sqrt(this.matmul(this.transpose(p[0]), p[0]));
      p[0] = this.matscale(p[0], 1 / p_length);
      let t_new = this.matmul(mat, p[0]);
      let pp = this.matmul(this.transpose(p[0]), p[0]);
      t_new = this.matscale(t_new, 1 / pp);
      epsilon = this.squared_difference(t[0], t_new);
      t[0] = JSON.parse(JSON.stringify(t_new));
    }
    let components = this.matmul(this.transpose(t[0]), t[0]);
    return components;
  }
  static p300(event_timestamps = [], raw_signal = [], signal_timestamps = [], sps = 256) {
    let smoothingstep = Math.floor(sps / 10);
    let smoothed = this.sma(raw_signal, smoothingstep);
    let peaks = this.peakDetect(smoothed, "peak", smoothingstep);
    let mean = this.mean(smoothed);
    let std = this.std(smoothed, mean);
    let p_idx = 0;
    let candidates = [];
    if (peaks.length > 0) {
      event_timestamps.forEach((t, j) => {
        while (signal_timestamps[peaks[p_idx]] < t + 200) {
          p_idx++;
          if (!peaks[p_idx])
            break;
        }
        let tempi = 0;
        let tempcandidates = [];
        while (signal_timestamps[peaks[p_idx + tempi]] < t + 600) {
          tempcandidates.push(p_idx + tempi);
          tempi++;
          if (!peaks[p_idx + tempi])
            break;
        }
        if (tempcandidates.length > 1) {
          let peakvals = [];
          tempcandidates.forEach((tc) => {
            peakvals.push(smoothed[peaks[tc]]);
          });
          let max = Math.max(...peakvals);
          let maxi = tempcandidates[peakvals.indexOf(max)];
          candidates.push({
            event_timestamp: t,
            event_index: j,
            peak_timestamp: signal_timestamps[[peaks[maxi]]],
            signal_index: [peaks[maxi]],
            signal_amplitude: raw_signal[[peaks[maxi]]],
            zscore: (smoothed[peaks[maxi]] - mean) / std
          });
        } else if (tempcandidates.length === 1)
          candidates.push({
            event_timestamp: t,
            event_index: j,
            peak_timestamp: signal_timestamps[peaks[tempcandidates[0]]],
            signal_index: peaks[tempcandidates[0]],
            signal_amplitude: raw_signal[[peaks[tempcandidates[0]]]],
            zscore: (smoothed[peaks[tempcandidates[0]]] - mean) / std
          });
      });
    }
    return candidates;
  }
};
var Math2 = _Math2;
__publicField(Math2, "TWO_PI", Math.PI * 2);
__publicField(Math2, "C", 299792458);
__publicField(Math2, "G", 66743e-15);
__publicField(Math2, "h", 662607015e-42);
__publicField(Math2, "R", 8314.32);
__publicField(Math2, "Ra", 287);
__publicField(Math2, "H", 69.3);
__publicField(Math2, "kbar", 1054571817e-43);
__publicField(Math2, "kB", 1380649e-29);
__publicField(Math2, "ke", 89875517923e-1);
__publicField(Math2, "me", 91093837015e-41);
__publicField(Math2, "mp", 167262192369e-38);
__publicField(Math2, "mn", 167492749804e-38);
__publicField(Math2, "P0", 101325);
__publicField(Math2, "T0", 288.15);
__publicField(Math2, "p0", 1.225);
__publicField(Math2, "Na", 60220978e16);
__publicField(Math2, "y", 1.405);
__publicField(Math2, "M0", 28.96643);
__publicField(Math2, "g0", 9.80665);
__publicField(Math2, "Re", 6378100);
__publicField(Math2, "B", 1458e-9);
__publicField(Math2, "S", 110.4);
__publicField(Math2, "Sigma", 365e-12);
__publicField(Math2, "imgkernels", {
  edgeDetection: [
    [-1, -1, -1],
    [-1, 8, -1],
    [-1, -1, -1]
  ],
  boxBlur: [
    [1 / 9, 1 / 9, 1 / 9],
    [1 / 9, 1 / 9, 1 / 9],
    [1 / 9, 1 / 9, 1 / 9]
  ],
  sobelLeft: [
    [1, 0, -1],
    [2, 0, -2],
    [1, 0, -1]
  ],
  sobelRight: [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1]
  ],
  sobelTop: [
    [1, 2, 1],
    [0, 0, 0],
    [-1, -2, -1]
  ],
  sobelBottom: [
    [-1, 2, 1],
    [0, 0, 0],
    [1, 2, 1]
  ],
  identity: [
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0]
  ],
  gaussian3x3: [
    [1, 2, 1],
    [2, 4, 2],
    [1, 2, 1]
  ],
  guassian7x7: [
    [0, 0, 0, 5, 0, 0, 0],
    [0, 5, 18, 32, 18, 5, 0],
    [0, 18, 64, 100, 64, 18, 0],
    [5, 32, 100, 100, 100, 32, 5],
    [0, 18, 64, 100, 64, 18, 0],
    [0, 5, 18, 32, 18, 5, 0],
    [0, 0, 0, 5, 0, 0, 0]
  ],
  emboss: [
    [-2, -1, 0],
    [-1, 1, 1],
    [0, 1, 2]
  ],
  sharpen: [
    [0, -1, 0],
    [-1, 5, -1],
    [0, -1, 0]
  ]
});
__publicField(Math2, "integral", (func = (x2) => {
  let y = x2;
  return y;
}, range = [], stepx = 0.01) => {
  let area = 0;
  for (let i = range[0]; i < range[1]; i += stepx) {
    let y = func(i);
    area += y * stepx;
  }
  return area;
});
__publicField(Math2, "dintegral", (func = (x2, y) => {
  let z = x2 + y;
  return z;
}, range = [[], []], stepx = 0.01, stepy = stepx) => {
  let volume = 0;
  for (let i = range[0][0] + stepx; i < range[0][1]; i += stepx) {
    for (let j = range[1][0] + stepy; j < range[1][1]; j += stepy) {
      let z = func(i, j);
      volume += z * stepx * stepy;
    }
  }
  return volume;
});
__publicField(Math2, "tintegral", (func = (x2, y, z) => {
  let w = x2 + y + z;
  return w;
}, range = [[], [], []], stepx = 0.01, stepy = stepx, stepz = stepx) => {
  let volume = 0;
  for (let i = range[0][0] + stepx; i < range[0][1]; i += stepx) {
    for (let j = range[1][0] + stepy; j < range[1][1]; j += stepy) {
      for (let k = range[2][0] + stepz; k < range[2][1]; k += stepz) {
        let w = func(i, j, k);
        volume += w * stepx * stepy * stepz;
      }
    }
  }
  return volume;
});
__publicField(Math2, "pintegral", (func = (x2) => {
  let y = x2;
  return y;
}, range = [], stepx = 0.01) => {
  let length = 0;
  let y0 = void 0;
  let yi = void 0;
  for (let i = range[0]; i < range[1]; i += stepx) {
    y0 = yi;
    yi = func(i);
    if (y0)
      length += _Math2.distance([0, y0], [stepx, yi]);
  }
  return length;
});
__publicField(Math2, "meshgrid", _Math2.generateCoordinateSpace);
__publicField(Math2, "autocorrelation2d", (mat2d2) => {
  let result = [];
  for (let y = 0; y < mat2d2.length; y++) {
    result.push([]);
    for (let x2 = 0; x2 < mat2d2[y].length; x2++) {
      let G = 0;
      for (let b = 0; b < mat2d2.length; b++) {
        for (let a = 0; a < mat2d2[b].length; a++) {
          G += mat2d2[y][x2] * mat2d2[mat2d2.length - 1 - b][mat2d2[y].length - 1 - a];
        }
      }
      result[y][x2] = G;
    }
  }
  return result;
});
__publicField(Math2, "upsample", _Math2.interpolateArray);
__publicField(Math2, "peakDetect", (smoothedArray, type = "peak", window2 = 49) => {
  let mid = Math.floor(window2 * 0.5);
  let peaks = [];
  for (let i = 0; i < smoothedArray.length - window2; i++) {
    let isPeak = _Math2.isExtrema(smoothedArray.slice(i, i + window2), type);
    if (isPeak) {
      peaks.push(i + mid - 1);
    }
  }
  return peaks;
});
Object.assign(Math, Math2);

// ../../services/http/HTTP.node.ts
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
            this.addPage(`${options.port}/${key}`, options.pages[key]);
          } else if (typeof options.pages[key] === "object") {
            if (options.pages[key].template) {
              options.pages[key].get = options.pages[key].template;
            }
            if (key !== "_all")
              this.load({ [`${options.port}/${key}`]: options.pages[key] });
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
              if (options.pages[url].redirect) {
                url = options.pages[url].redirect;
                received.redirect = url;
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

// ../../services/sse/SSE.node.ts
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
        sse.onconnectionclose = (session, sse2, id, req, res) => {
          delete sse2.sessions[id];
        };
      let onRequest = (req, res) => {
        if (req.method === "GET" && req.url?.includes(path2)) {
          if (this.debug)
            console.log("SSE Request", path2);
          (0, import_better_sse.createSession)(req, res).then((session) => {
            channel.register(session);
            let _id = `sse${Math.floor(Math.random() * 1e15)}`;
            sse.sessions[_id] = session;
            this.eventsources[_id] = {
              _id,
              session,
              served: sse
            };
            session.push(JSON.stringify({ route: "setId", args: _id }));
            if (options.onconnectionclose)
              session.on("close", () => {
                options.onconnectionclose(session, sse, _id, req, res);
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

// ../../node_modules/ws/wrapper.mjs
var import_stream = __toESM(require_stream(), 1);
var import_receiver = __toESM(require_receiver(), 1);
var import_sender = __toESM(require_sender(), 1);
var import_websocket = __toESM(require_websocket(), 1);
var import_websocket_server = __toESM(require_websocket_server(), 1);
var wrapper_default = import_websocket.default;

// ../../services/wss/WSS.node.ts
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
          let onmessage = (ev2) => {
            if (typeof ev2.data === "string" && ev2.data.indexOf("{") > -1)
              ev2.data = JSON.parse(ev2.data);
            if (typeof ev2.data === "object") {
              if (ev2.data.callbackId === callbackId) {
                socket.removeEventListener("message", onmessage);
                res(ev2.data.args);
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
          let onmessage = (ev2) => {
            if (typeof ev2.data === "string" && ev2.data.indexOf("{") > -1)
              ev2.data = JSON.parse(ev2.data);
            if (typeof ev2.data === "object") {
              if (ev2.data.callbackId === callbackId) {
                socket.removeEventListener("message", onmessage);
                res(ev2.data.args);
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
        let onmessage = (ev2) => {
          let data = ev2.data;
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

// ../../services/worker/Worker.node.service.ts
var import_web_worker = __toESM(require_node());

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
          let name2 = Object.prototype.toString.call(service);
          if (name2)
            name2 = name2.split(" ")[1];
          if (name2)
            name2 = name2.split("]")[0];
          if (name2 && name2 !== "Object" && name2 !== "Function") {
            this.services[name2] = service;
          }
        } else
          this.services[service.constructor.name] = service;
      }
      this.service.load(service, includeClassName, routeFormat, customRoutes, customChildren);
      if (linkServices) {
        this.syncServices();
      }
      return this.services[service.name];
    };
    this.syncServices = () => {
      for (const name2 in this.services) {
        this.service.nodes.forEach((n) => {
          if (this.services[name2]?.nodes) {
            if (!this.services[name2].nodes.get(n.tag)) {
              this.services[name2].nodes.set(n.tag, n);
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
    this.setStreamFunc = (name2, key, callback = this.streamFunctions.allLatestValues) => {
      if (!this.streamSettings[name2].settings[key])
        this.streamSettings[name2].settings[key] = { lastRead: 0 };
      if (callback === this.STREAMLATEST)
        this.streamSettings[name2].settings[key].callback = this.streamFunctions.latestValue;
      else if (callback === this.STREAMALLLATEST)
        this.streamSettings[name2].settings[key].callback = this.streamFunctions.allLatestValues;
      else if (typeof callback === "string")
        this.streamSettings[name2].settings[key].callback = this.streamFunctions[callback];
      else if (typeof callback === "function")
        this.streamSettings[name2].settings[key].callback = callback;
      if (!this.streamSettings[name2].settings[key].callback)
        this.streamSettings[name2].settings[key].callback = this.streamFunctions.allLatestValues;
      return true;
    };
    this.addStreamFunc = (name2, callback = (data) => {
    }) => {
      this.streamFunctions[name2] = callback;
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

// ../../routers/users/User.router.ts
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
              let onmessage = (ev2) => {
                let data = ev2.data;
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
      setUser: (self2, origin, update) => {
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

// backend.ts
function exitHandler(options, exitCode) {
  if (exitCode || exitCode === 0)
    console.log("SERVER EXITED WITH CODE: ", exitCode);
  if (options.exit)
    process.exit();
}
process.on("exit", exitHandler.bind(null, { cleanup: true }));
process.on("SIGINT", exitHandler.bind(null, { exit: true }));
var router = new UserRouter([
  HTTPbackend,
  WSSbackend,
  SSEbackend
]);
console.log(router);
router.run(
  "http.setupServer",
  {
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
  }
).then((served) => {
  console.log(router.services.http.nodes.keys());
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
      onconnection: (session, sseinfo2, id, req, res) => {
        console.log("pushing sse!");
        session.push("Hello from SSE!");
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
/**
 * gpu.js
 * http://gpu.rocks/
 *
 * GPU Accelerated JavaScript
 *
 * @version 2.11.0
 * @date Tue Jan 05 2021 15:55:59 GMT-0500 (Eastern Standard Time)
 *
 * @license MIT
 * The MIT License
 *
 * Copyright (c) 2021 gpu.js Team
 */
