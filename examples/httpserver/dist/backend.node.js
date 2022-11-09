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
    }(global, () => (() => {
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
      e.r(t), e.d(t, { Channel: () => f, Session: () => u, createChannel: () => v, createSession: () => p });
      const s = require("http"), i = require("events");
      var r = e.n(i);
      class n extends r() {
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
      const o = (e2) => JSON.stringify(e2), a = /(\r\n|\r|\n)/g, h = /\n+$/g, l = (e2) => {
        let t2 = e2;
        return t2 = t2.replace(a, "\n"), t2 = t2.replace(h, ""), t2;
      }, d = require("crypto");
      let c;
      c = d.randomUUID ? () => (0, d.randomUUID)() : () => (0, d.randomBytes)(4).toString("hex");
      class u extends n {
        constructor(e2, t2, i2 = {}) {
          var r2, n2, a2, h2, d2, u2, p2;
          super(), this.lastId = "", this.isConnected = false, this.state = {}, this.buffer = "", this.initialize = () => {
            var e3, t3, i3;
            const r3 = `http://${this.req.headers.host}${this.req.url}`, n3 = new URL(r3).searchParams;
            if (this.trustClientEventId) {
              const s2 = null !== (i3 = null !== (t3 = null !== (e3 = this.req.headers["last-event-id"]) && void 0 !== e3 ? e3 : n3.get("lastEventId")) && void 0 !== t3 ? t3 : n3.get("evs_last_event_id")) && void 0 !== i3 ? i3 : "";
              this.lastId = s2;
            }
            const o2 = {};
            this.res instanceof s.ServerResponse ? (o2["Content-Type"] = "text/event-stream", o2["Cache-Control"] = "private, no-cache, no-store, no-transform, must-revalidate, max-age=0", o2.Connection = "keep-alive", o2.Pragma = "no-cache", o2["X-Accel-Buffering"] = "no") : (o2["content-type"] = "text/event-stream", o2["cache-control"] = "private, no-cache, no-store, no-transform, must-revalidate, max-age=0", o2.pragma = "no-cache", o2["x-accel-buffering"] = "no");
            for (const [e4, t4] of Object.entries(this.headers))
              o2[e4] = null != t4 ? t4 : "";
            this.res.writeHead(this.statusCode, o2), n3.has("padding") && this.comment(" ".repeat(2049)).dispatch(), n3.has("evs_preamble") && this.comment(" ".repeat(2056)).dispatch(), null !== this.initialRetry && this.retry(this.initialRetry).dispatch(), this.flush(), null !== this.keepAliveInterval && (this.keepAliveTimer = setInterval(this.keepAlive, this.keepAliveInterval)), this.isConnected = true, this.emit("connected");
          }, this.onDisconnected = () => {
            this.keepAliveTimer && clearInterval(this.keepAliveTimer), this.isConnected = false, this.emit("disconnected");
          }, this.writeField = (e3, t3) => {
            const s2 = this.sanitize(t3);
            return this.buffer += e3 + ":" + s2 + "\n", this;
          }, this.keepAlive = () => {
            this.comment().dispatch().flush();
          }, this.data = (e3) => {
            const t3 = this.serialize(e3);
            return this.writeField("data", t3), this;
          }, this.id = (e3 = "") => (this.writeField("id", e3), this.lastId = e3, this), this.retry = (e3) => {
            const t3 = e3.toString();
            return this.writeField("retry", t3), this;
          }, this.comment = (e3 = "") => (this.writeField("", e3), this), this.dispatch = () => (this.buffer += "\n", this), this.flush = () => (this.res.write(this.buffer), this.buffer = "", this), this.push = (e3, t3 = "message", s2 = c()) => (this.event(t3).id(s2).data(e3).dispatch().flush(), this.emit("push", e3, t3, s2), this), this.stream = async (e3, t3 = {}) => {
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
          }, this.req = e2, this.res = t2, this.serialize = null !== (r2 = i2.serializer) && void 0 !== r2 ? r2 : o, this.sanitize = null !== (n2 = i2.sanitizer) && void 0 !== n2 ? n2 : l, this.trustClientEventId = null === (a2 = i2.trustClientEventId) || void 0 === a2 || a2, this.initialRetry = null === i2.retry ? null : null !== (h2 = i2.retry) && void 0 !== h2 ? h2 : 2e3, this.keepAliveInterval = null === i2.keepAlive ? null : null !== (d2 = i2.keepAlive) && void 0 !== d2 ? d2 : 1e4, this.statusCode = null !== (u2 = i2.statusCode) && void 0 !== u2 ? u2 : 200, this.headers = null !== (p2 = i2.headers) && void 0 !== p2 ? p2 : {}, this.req.once("close", this.onDisconnected), setImmediate(this.initialize);
        }
        event(e2) {
          return this.writeField("event", e2), this;
        }
      }
      const p = (...e2) => new Promise((t2) => {
        const s2 = new u(...e2);
        s2.once("connected", () => {
          t2(s2);
        });
      });
      class f extends n {
        constructor() {
          super(), this.state = {}, this.sessions = /* @__PURE__ */ new Set(), this.broadcast = (e2, t2 = "message", s2 = {}) => {
            const i2 = c();
            let r2;
            r2 = s2.filter ? Array.from(this.sessions).filter(s2.filter) : this.sessions;
            for (const s3 of r2)
              s3.push(e2, t2, i2);
            return this.emit("broadcast", e2, t2, i2), this;
          };
        }
        get activeSessions() {
          return Array.from(this.sessions);
        }
        get sessionCount() {
          return this.sessions.size;
        }
        register(e2) {
          if (this.sessions.has(e2))
            return this;
          if (!e2.isConnected)
            throw new Error("Cannot register a non-active session.");
          return e2.once("disconnected", () => {
            this.emit("session-disconnected", e2), this.deregister(e2);
          }), this.sessions.add(e2), this.emit("session-registered", e2), this;
        }
        deregister(e2) {
          return this.sessions.has(e2) ? (this.sessions.delete(e2), this.emit("session-deregistered", e2), this) : this;
        }
      }
      const v = (...e2) => new f(...e2);
      return t;
    })());
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
    module2.exports = {
      concat,
      mask: _mask,
      toArrayBuffer,
      toBuffer,
      unmask: _unmask
    };
    if (!process.env.WS_NO_BUFFER_UTIL) {
      try {
        const bufferUtil = require("bufferutil");
        module2.exports.mask = function(source, mask, output, offset, length) {
          if (length < 48)
            _mask(source, mask, output, offset, length);
          else
            bufferUtil.mask(source, mask, output, offset, length);
        };
        module2.exports.unmask = function(buffer, mask) {
          if (buffer.length < 32)
            _unmask(buffer, mask);
          else
            bufferUtil.unmask(buffer, mask);
        };
      } catch (e) {
      }
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
    module2.exports = {
      isValidStatusCode,
      isValidUTF8: _isValidUTF8,
      tokenChars
    };
    if (!process.env.WS_NO_UTF_8_VALIDATE) {
      try {
        const isValidUTF8 = require("utf-8-validate");
        module2.exports.isValidUTF8 = function(buf) {
          return buf.length < 150 ? _isValidUTF8(buf) : isValidUTF8(buf);
        };
      } catch (e) {
      }
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
      const isIpcUrl = parsedUrl.protocol === "ws+unix:";
      let invalidUrlMessage;
      if (parsedUrl.protocol !== "ws:" && !isSecure && !isIpcUrl) {
        invalidUrlMessage = `The URL's protocol must be one of "ws:", "wss:", or "ws+unix:"`;
      } else if (isIpcUrl && !parsedUrl.pathname) {
        invalidUrlMessage = "The URL's pathname is empty";
      } else if (parsedUrl.hash) {
        invalidUrlMessage = "The URL contains a fragment identifier";
      }
      if (invalidUrlMessage) {
        const err = new SyntaxError(invalidUrlMessage);
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
        ...opts.headers,
        "Sec-WebSocket-Version": opts.protocolVersion,
        "Sec-WebSocket-Key": key,
        Connection: "Upgrade",
        Upgrade: "websocket"
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
      if (isIpcUrl) {
        const parts = opts.path.split(":");
        opts.socketPath = parts[0];
        opts.path = parts[1];
      }
      let req;
      if (opts.followRedirects) {
        if (websocket._redirects === 0) {
          websocket._originalIpc = isIpcUrl;
          websocket._originalSecure = isSecure;
          websocket._originalHostOrSocketPath = isIpcUrl ? opts.socketPath : parsedUrl.host;
          const headers = options && options.headers;
          options = { ...options, headers: {} };
          if (headers) {
            for (const [key2, value] of Object.entries(headers)) {
              options.headers[key2.toLowerCase()] = value;
            }
          }
        } else if (websocket.listenerCount("redirect") === 0) {
          const isSameHost = isIpcUrl ? websocket._originalIpc ? opts.socketPath === websocket._originalHostOrSocketPath : false : websocket._originalIpc ? false : parsedUrl.host === websocket._originalHostOrSocketPath;
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
          const server2 = this._server;
          this._removeListeners();
          this._removeListeners = this._server = null;
          server2.close(() => {
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
    function addListeners(server2, map) {
      for (const event of Object.keys(map))
        server2.on(event, map[event]);
      return function removeListeners() {
        for (const event of Object.keys(map)) {
          server2.removeListener(event, map[event]);
        }
      };
    }
    function emitClose(server2) {
      server2._state = CLOSED;
      server2.emit("close");
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
    function abortHandshakeOrEmitwsClientError(server2, req, socket, code, message) {
      if (server2.listenerCount("wsClientError")) {
        const err = new Error(message);
        Error.captureStackTrace(err, abortHandshakeOrEmitwsClientError);
        server2.emit("wsClientError", err, socket, req);
      } else {
        abortHandshake(socket, code, message);
      }
    }
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
        this.triggers[key].push({ idx: l, onchange });
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
    };
    this.subscribeTriggerOnce = (key, onchange) => {
      let sub;
      let changed = (value) => {
        onchange(value);
        this.unsubscribeTrigger(key, sub);
      };
      sub = this.subscribeTrigger(key, changed);
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
    this.__subscribe = (callback, key, subInput) => {
      if (key) {
        if (!this.__node.localState) {
          this.__addLocalState(this);
        }
        if (typeof callback === "string") {
          if (this.__node.graph)
            callback = this.__node.graph.get(callback);
          else
            callback = this.__node.graph.nodes.get(callback);
        }
        if (typeof callback === "function") {
          return this.__node.events.subscribeTrigger(subInput ? key + "input" : key, callback);
        } else if (callback?.__node)
          return this.__node.events.subscribeTrigger(subInput ? key + "input" : key, (state2) => {
            if (callback.__operator)
              callback.__operator(state2);
          });
      } else {
        if (typeof callback === "string") {
          if (this.__node.graph)
            callback = this.__node.graph.get(callback);
          else
            callback = this.__node.graph.nodes.get(callback);
        }
        if (typeof callback === "function") {
          return this.__node.state.subscribeTrigger(subInput ? this.__node.tag + "input" : this.__node.tag, callback);
        } else if (callback?.__node)
          return this.__node.state.subscribeTrigger(subInput ? this.__node.tag + "input" : this.__node.tag, (res) => {
            if (callback.__operator)
              callback.__operator(res);
          });
      }
    };
    this.__subscribeState = (callback) => {
      if (typeof callback === "string") {
        if (this.__node.graph)
          callback = this.__node.graph.get(callback);
        else
          callback = this.__node.graph.nodes.get(callback);
      }
      if (typeof callback === "function") {
        return this.__node.state.subscribeTrigger(this.__node.unique, callback);
      } else if (callback?.__node)
        return this.__node.state.subscribeTrigger(this.__node.unique, (state2) => {
          if (callback?.__operator)
            callback.__operator(state2);
        });
    };
    this.__unsubscribe = (sub, key, subInput) => {
      if (key && this.__node.events)
        return this.__node.events.unsubscribeTrigger(subInput ? key + "input" : key, sub);
      else
        return this.__node.state.unsubscribeTrigger(subInput ? this.__node.tag + "input" : this.__node.tag, sub);
    };
    this.__setOperator = (fn) => {
      fn = fn.bind(this);
      this.__operator = (...args) => {
        if (this.__node.inputState)
          this.__node.events.setValue(this.__node.tag + "input", args);
        let result = fn(...args);
        if (typeof result?.then === "function") {
          result.then((res) => {
            if (res !== void 0)
              this.__node.state.setValue(this.__node.tag, res);
          }).catch(console.error);
        } else if (result !== void 0)
          this.__node.state.setValue(this.__node.tag, result);
        return result;
      };
      this.default = this.__operator;
      if (typeof this.__node.initial === "object")
        this.__node.initial.default = this.__operator;
      return this.__operator;
    };
    if (typeof properties === "function") {
      properties = {
        __operator: properties,
        __node: {
          tag: properties.name
        }
      };
    } else if (typeof properties === "string") {
      if (graph?.get(properties)) {
        properties = graph.get(properties);
      }
    }
    if (typeof properties === "object") {
      if (typeof properties.__node === "string") {
        if (graph?.get(properties.__node.tag)) {
          properties = graph.get(properties.__node.tag);
        } else
          properties.__node = {};
      } else if (!properties.__node)
        properties.__node = {};
      if (!properties.__parent && parent)
        properties.__parent = parent;
      if (graph)
        properties.__node.graph = graph;
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
            parent.__node.nodes.set(properties.__node.tag + "." + n.__node.tag, n);
          });
          let ondelete = () => {
            properties.__node.nodes.forEach((n) => {
              parent.__node.nodes.delete(properties.__node.tag + "." + n.__node.tag);
            });
          };
          this.__addDisconnected(ondelete);
        }
      }
      properties.__node.initial = properties;
      properties.__node = Object.assign(this.__node, properties.__node);
      Object.assign(this, properties);
      if (properties.__operator && parent instanceof GraphNode && parent.__operator) {
        let sub = parent.__subscribe(this);
        let ondelete = () => {
          parent?.__unsubscribe(sub);
        };
        this.__addDisconnected(ondelete);
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
    if (!this.__node.events) {
      this.__node.events = new EventHandler(this.__node.localState);
    }
    let localState = this.__node.localState;
    for (let k in props) {
      if (typeof props[k] === "function") {
        if (!k.startsWith("_")) {
          let fn = props[k].bind(this);
          props[k] = (...args) => {
            if (this.__node.inputState)
              this.__node.events.setValue(k + "input", args);
            let result = fn(...args);
            if (typeof result?.then === "function") {
              result.then((res) => {
                this.__node.events.setValue(k, res);
              }).catch(console.error);
            } else
              this.__node.events.setValue(k, result);
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
            if (this.__node.state.triggers[this.__node.unique]) {
              this.__node.state.setValue(this.__node.unique, this);
            }
            this.__node.events.setValue(k, v);
          },
          enumerable: true,
          configurable: true
        };
        Object.defineProperty(this, k, definition);
        const ogProps = this.__node.initial;
        let dec = Object.getOwnPropertyDescriptor(ogProps, k);
        if (dec === void 0 || dec?.configurable)
          Object.defineProperty(ogProps, k, definition);
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
  __addDisconnected(callback) {
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
      delete cpy.__node;
      let listeners = this.recursiveSet(cpy, this);
      if (tree.__node) {
        if (!tree.__node.tag)
          tree.__node._tag = `tree${Math.floor(Math.random() * 1e15)}`;
        else if (!this.get(tree.__node.tag)) {
          let node = new GraphNode(tree, this, this);
          for (const l in this.__node.loaders) {
            this.__node.loaders[l](node, this, this, tree, tree);
          }
          this.__node.nodes.set(node.__node.tag, node);
          if (node.__listeners) {
            listeners[node.__node.tag] = node.__listeners;
          }
        }
      }
      this.setListeners(listeners);
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
      let props = Object.assign({}, properties);
      if (properties.__node)
        props.__node = Object.assign({}, properties.__node);
      if (!props.__node?.tag || !this.get(props.__node.tag)) {
        let node = new GraphNode(props, parent, this);
        for (const l in this.__node.loaders) {
          this.__node.loaders[l](node, parent, this, this.__node.tree, properties);
        }
        this.__node.nodes.set(node.__node.tag, node);
        this.__node.tree[node.__node.tag] = properties;
        if (node.__listeners) {
          listeners[node.__node.tag] = node.__listeners;
        }
        if (node.__children) {
          node.__children = Object.assign({}, node.__children);
          this.recursiveSet(node.__children, node, listeners);
        }
        this.setListeners(listeners);
        node.__callConnected();
        return node;
      }
      return;
    };
    this.recursiveSet = (t, parent, listeners = {}) => {
      for (const key in t) {
        let p = t[key];
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
          if (this.get(p.__node.tag) || parent?.__node && this.get(parent.__node.tag + "." + p.__node.tag))
            continue;
          let props = Object.assign({}, p);
          props.__node = Object.assign({}, p.__node);
          let node = new GraphNode(props, parent, this);
          for (const l in this.__node.loaders) {
            this.__node.loaders[l](node, parent, this, t, p);
          }
          t[key] = node;
          this.__node.tree[node.__node.tag] = p;
          this.set(node.__node.tag, node);
          if (node.__listeners) {
            listeners[node.__node.tag] = node.__listeners;
          } else if (node.__children) {
            node.__children = Object.assign({}, node.__children);
            this.recursiveSet(node.__children, node, listeners);
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
        this.__node.nodes.delete(node.__node.tag);
        delete this.__node.tree[node.__node.tag];
        if (clearListeners) {
          this.clearListeners(node);
        }
        node.__callDisconnected();
        const recursiveRemove = (t) => {
          for (const key in t) {
            this.unsubscribe(t[key]);
            this.__node.nodes.delete(t[key].__node.tag);
            delete this.__node.tree[t[key].__node.tag];
            this.__node.nodes.delete(key);
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
    this.removeTree = (tree) => {
    };
    this.run = (node, ...args) => {
      if (typeof node === "string")
        node = this.get(node);
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
            if (typeof listeners[key][k] === "function")
              listeners[key][k] = { callback: listeners[key][k] };
            listeners[key][k].callback = listeners[key][k].callback.bind(node);
            if (typeof node.__listeners !== "object")
              node.__listeners = {};
            if (!n) {
              let tag = k.substring(0, k.lastIndexOf("."));
              n = this.get(tag);
              if (n) {
                sub = this.subscribe(n, listeners[key][k].callback, k.substring(k.lastIndexOf(".") + 1), listeners[key][k].inputState);
                if (typeof node.__listeners[k] !== "object")
                  node.__listeners[k] = { callback: listeners[key][k].callback, inputState: listeners[key][k]?.inputState };
                node.__listeners[k].sub = sub;
              }
            } else {
              sub = this.subscribe(n, listeners[key][k].callback, void 0, listeners[key][k].inputState);
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
    this.subscribe = (node, callback, key, subInput) => {
      let nd = node;
      if (!(node instanceof GraphNode))
        nd = this.get(node);
      let sub;
      if (nd instanceof GraphNode) {
        sub = nd.__subscribe(callback, key, subInput);
        let ondelete = () => {
          nd.__unsubscribe(sub, key, subInput);
        };
        nd.__addDisconnected(ondelete);
      } else if (typeof node === "string") {
        if (typeof callback === "string")
          callback = this.get(callback);
        if (callback instanceof GraphNode && callback.__operator) {
          sub = this.__node.state.subscribeTrigger(node, callback.__operator);
          let ondelete = () => {
            this.__node.state.unsubscribeTrigger(node, sub);
          };
          callback.__addDisconnected(ondelete);
        } else if (typeof callback === "function")
          sub = this.__node.state.subscribeTrigger(node, callback);
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
      if (!("looping" in node.__node))
        node.__node.looping = true;
      node.__node.looper = () => {
        if (node.__node.looping) {
          node.__operator();
          setTimeout(node.__node.looper, node.__node.loop);
        }
      };
      if (node.__node.looping)
        node.__node.looper();
      let ondelete = (node2) => {
        if (node2.__node.looping)
          node2.__node.looping = false;
      };
      node.__addDisconnected(ondelete);
    }
  }
};
var animate = (node, parent, graph) => {
  if (node.__node.animate === true || node.__node.animation) {
    if (typeof node.__node.animate === "function")
      node.__node.animate = node.__node.animate.bind(node);
    let anim = (node2) => {
      if (!("animating" in node2.__node))
        node2.__node.animating = true;
      node2.__node.animate = () => {
        if (node2.__node.animating) {
          if (typeof node2.__node.animate === "function")
            node2.__node.animation();
          else
            node2.__operator();
          requestAnimationFrame(node2.__node.animation);
        }
      };
      requestAnimationFrame(node2.__node.animation);
      if (node2.__node.animating)
        node2.__node.animation();
    };
    requestAnimationFrame(anim);
    let ondelete = (node2) => {
      if (node2.__node.animating)
        node2.__node.animating = false;
    };
    node.__addDisconnected(ondelete);
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
          node.__listeners.callback = (ret) => {
            let triggered = () => {
              if (typeof node.__listeners[key].branch.then === "function") {
                ret = node.__listeners[key].branch.then(ret);
              } else if (node.__listeners[key].branch.then instanceof GraphNode && node.__listeners[key].branch.then.__operator) {
                ret = node.__listeners[key].branch.then.__operator(ret);
              } else
                ret = node.__listeners[key].branch.then;
            };
            if (typeof node.__listeners[key].branch.if === "function") {
              if (node.__listeners[key].branch.if(ret)) {
                triggered();
              }
            } else if (node.__listeners[key].branch.if === ret) {
              triggered();
            }
            return fn(ret);
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
          node.__listeners.callback = (ret) => {
            ret = node.__listeners[key].transform(ret);
            return fn(ret);
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
  if (node.aliases) {
    node.aliases.forEach((a) => {
      graph.__node.nodes.set(a, node);
      let ondelete = (node2) => {
        graph.__node.nodes.delete(a);
      };
      node.__addDisconnected(ondelete);
    });
  }
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
          return source.__node.state.subscribeTriggerOnce(source.__node.tag, (res) => {
            let mod = callback(res);
            if (mod !== void 0)
              this.transmit({ route: destination, args: mod, method });
            else
              this.transmit({ route: destination, args: res, method }, endpoint);
          });
        else
          return this.__node.state.subscribeTriggerOnce(source.__node.tag, (res) => {
            this.transmit({ route: destination, args: res, method }, endpoint);
          });
      } else if (typeof source === "string")
        return this.__node.state.subscribeTriggerOnce(source, (res) => {
          this.transmit({ route: destination, args: res, method }, endpoint);
        });
    };
    this.terminate = (...args) => {
    };
    this.isTypedArray = isTypedArray;
    this.recursivelyAssign = recursivelyAssign2;
    this.spliceTypedArray = spliceTypedArray;
    this.ping = () => {
      console.log("pinged");
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
  addServices(services) {
    for (const s in services) {
      if (typeof services[s] === "function")
        services[s] = new services[s]();
      if (services[s]?.__node?.loaders)
        Object.assign(this.__node.loaders, services[s].__node.loaders);
      if (services[s] instanceof Service) {
        services[s].__node.nodes.forEach((n, tag) => {
          if (!this.__node.nodes.get(tag)) {
            this.__node.nodes.set(tag, n);
          } else
            this.__node.nodes.set(s + "." + tag, n);
        });
      } else if (typeof services[s] === "object")
        this.setTree(services[s]);
    }
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

// ../../services/e2ee/E2EE.service.ts
var import_sjcl = __toESM(require_sjcl());

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
      console.log(options);
      if (options.pages) {
        for (const key in options.pages) {
          if (typeof options.pages[key] === "string") {
            this.addPage(`${options.port}/${key}`, options.pages[key]);
          } else if (typeof options.pages[key] === "object") {
            if (options.pages[key].template) {
              options.pages[key].get = options.pages[key].template;
            }
            if (key !== "_all")
              this.setTree({ [`${options.port}/${key}`]: options.pages[key] });
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
          console.log(options);
          if (options.pages) {
            if (typeof options.pages[url] === "object") {
              if (options.pages[url].onrequest) {
                if (typeof options.pages[url].onrequest === "string") {
                  options.pages[url].onrequest = this.__node.nodes.get(options.pages[url].onrequest);
                }
                if (typeof options.pages[url].onrequest === "object") {
                  if (options.pages[url].onrequest.__operator) {
                    options.pages[url].onrequest.__operator(options.pages[url], request, response);
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
      const server2 = http.createServer(
        requestListener
      );
      served.server = server2;
      served.terminate = () => {
        this.terminate(served);
      };
      served.service = this;
      this.servers[address] = served;
      served._id = options._id ? options._id : address;
      return new Promise((resolve, reject) => {
        server2.on("error", (err) => {
          console.error("Server error:", err.toString());
          reject(err);
        });
        server2.listen(
          port,
          host,
          () => {
            onStarted();
            if (served.onopen)
              served.onopen(served);
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
      const address = `${host}:${port}`;
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
                  options.pages[url].onrequest = this.__node.nodes.get(options.pages[url].onrequest);
                }
                if (typeof options.pages[url].onrequest === "object") {
                  if (options.pages[url].onrequest.__operator) {
                    options.pages[url].onrequest.__operator(options.pages[url], request, response);
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
      const server2 = https.createServer(
        opts,
        requestListener
      );
      served.server = server2;
      served.terminate = () => {
        this.terminate(served);
      };
      served.service = this;
      this.servers[address] = served;
      served._id = options._id ? options._id : address;
      return new Promise((resolve, reject) => {
        server2.on("error", (err) => {
          console.error("Server error:", err.toString());
          reject(err);
        });
        server2.listen(
          port,
          host,
          () => {
            onStarted();
            if (served.onopen)
              served.onopen(served);
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
        return this.POST(options, message);
      else if (typeof options === "string")
        return this.GET(options);
      if (!options) {
        let server2 = this.servers[Object.keys(this.servers)[0]];
        options = {
          protocol: server2.protocol,
          host: server2.host,
          port: server2.port,
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
              if (this.__node.nodes.get(rt))
                route = rt;
            }
            if (!route && this.__node.nodes.get(message.route))
              route = message.route;
            if (route) {
              let res;
              if (message.method) {
                res = this.handleMethod(route, message.method, void 0);
              } else if (message.node) {
                res = this.handleGraphNodeCall(message.node, void 0);
              } else
                res = this.handleServiceMessage({ route, args: void 0, method: message.method });
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
            let route, method2, args;
            if (body?.route) {
              route = this.__node.tree[body.route];
              method2 = body.method;
              args = body.args;
              if (!route) {
                if (typeof body.route === "string") {
                  if (body.route.includes("/") && body.route.length > 1)
                    body.route = body.route.split("/").pop();
                }
                route = this.__node.tree[body.route];
              }
            }
            if (!route) {
              if (message?.route) {
                let route2 = this.__node.tree[message.route];
                method2 = message.method;
                args = message.args;
                if (!route2) {
                  if (typeof message.route === "string") {
                    if (message.route.includes("/") && message.route.length > 1)
                      message.route = message.route.split("/").pop();
                  }
                  route2 = this.__node.tree[message.route];
                }
              }
            }
            let res = body;
            if (route) {
              if (body.method) {
                res = this.handleMethod(route, method2, args);
              } else if (body.node) {
                res = this.handleGraphNodeCall(body.node, body.args);
              } else
                res = this.handleServiceMessage({ route, args, method: method2 });
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
    this.POST = (url, data, headers) => {
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
    this.GET = (url) => {
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
        if (served.onclose)
          served.onclose(served);
      }
    };
    this.addPage = (path2, template) => {
      if (typeof template === "string") {
        if (!template.includes("<html"))
          template = "<!DOCTYPE html><html>" + template + "</html>";
      }
      if (typeof this.__node.tree[path2] === "object") {
        this.__node.tree[path2].get = template;
        this.__node.nodes.get(path2).get = template;
      } else
        this.setTree({
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
      if (typeof this.__node.tree[path2] === "object") {
        this.__node.tree[path2].get = template;
        this.__node.nodes.get(path2).get = template;
      } else
        this.setTree({
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
        } else if (this.__node.tree[r]?.get) {
          let toAdd = this.__node.tree[r]?.get;
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
        } else if (typeof this.__node.tree[r] === "function") {
          let routeresult = this.__node.tree[r](obj[r]);
          if (typeof routeresult === "string") {
            let lastDiv = res.lastIndexOf("<");
            if (lastDiv > 0) {
              let end = res.substring(lastDiv);
              res = res.substring(0, lastDiv) + routeresult + end;
            } else
              res += routeresult;
          }
        } else if (typeof this.__node.tree[r] === "string")
          res += this.__node.tree[r];
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
    this.hotreload = (socketURL = `http://localhost:8080/wss`) => {
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
    };
    this.setTree(this);
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
    this.connections = {
      servers: this.servers,
      eventsources: this.eventsources
    };
    this.setupSSE = (options) => {
      const server2 = options.server;
      let path2 = options.path;
      if (this.servers[path2]) {
        return false;
      }
      const channel = (0, import_better_sse.createChannel)();
      let sse = {
        type: "sse",
        channel,
        sessions: {},
        requests: {},
        ...options
      };
      this.servers[path2] = sse;
      sse._id = options._id ? options._id : path2;
      if (!sse.onconnectionclose)
        sse.onconnectionclose = (session, sse2, id, req, res) => {
          delete sse2.sessions[id];
        };
      const send = (message, eventName, sessionId) => {
        return this.transmit(message, path2, eventName, sessionId);
      };
      const terminate = () => {
        return this.terminate(path2);
      };
      let request = (message, method, sessionId, eventName) => {
        if (!sessionId) {
          let promises = [];
          for (const key in sse.sessions) {
            promises.push(this.request(message, path2, key, eventName));
          }
          return promises;
        }
        return this.request(message, path2, method, sessionId, eventName);
      };
      let post = (route, args, method, sessionId, eventName) => {
        let message = {
          route,
          args
        };
        if (method)
          message.method = method;
        return this.transmit(message, path2, eventName, sessionId);
      };
      let run = (route, args, method, sessionId, eventName) => {
        let r = { route, args };
        if (!sessionId) {
          let promises = [];
          for (const key in sse.sessions) {
            promises.push(this.request(r, path2, key, eventName));
          }
          return promises;
        }
        return this.request(r, path2, method, sessionId, eventName);
      };
      let subscribe = (route, callback, sessionId) => {
        return this.subscribeToSSE(route, options.url, callback, sessionId);
      };
      let unsubscribe = (route, sub, sessionId, eventName) => {
        return run("unsubscribe", [route, sub], void 0, sessionId, eventName);
      };
      sse.send = send;
      sse.request = request;
      sse.post = post;
      sse.run = run;
      sse.subscribe = subscribe;
      sse.unsubscribe = unsubscribe;
      sse.terminate = terminate;
      sse.graph = this;
      let onRequest = (req, response) => {
        if (req.url?.includes(path2)) {
          if (req.method === "GET") {
            if (this.debug)
              console.log("SSE Request", path2);
            (0, import_better_sse.createSession)(req, response).then((session) => {
              channel.register(session);
              let _id = `sse${Math.floor(Math.random() * 1e15)}`;
              sse.sessions[_id] = session;
              this.eventsources[_id] = {
                _id,
                session,
                served: sse,
                send: (message, eventName) => {
                  return send(message, eventName, _id);
                },
                request: (message, method, eventName) => {
                  return request(message, method, _id, eventName);
                },
                post: (route, args, method, eventName) => {
                  return post(route, args, method, _id, eventName);
                },
                run: (route, args, method, eventName) => {
                  return run(route, args, method, _id, eventName);
                },
                subscribe: (route, callback) => {
                  return subscribe(route, callback, _id);
                },
                unsubscribe: (route, sub, eventName) => {
                  return unsubscribe(route, sub, _id, eventName);
                },
                terminate: () => {
                  delete this.eventsources[_id];
                  delete sse.sessions[_id];
                  return true;
                },
                onclose: () => options.onconnectionclose,
                graph: this
              };
              session.push(JSON.stringify({ route: "setId", args: _id }));
              session.on("close", () => {
                if (this.eventsources[_id].onclose)
                  this.eventsources[_id].onclose(session, sse, _id, req, response);
              });
              if (sse.onconnection) {
                sse.onconnection(session, sse, _id, req, response);
              }
            });
          } else {
            let body = [];
            req.on("data", (chunk) => {
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
              let route, method, args, callbackId;
              if (body?.route || body?.callbackId) {
                method = body.method;
                args = body.args;
                callbackId = body.callbackId;
                if (typeof body.route === "string") {
                  if (body.route.includes("/") && body.route.length > 1)
                    body.route = body.route.split("/").pop();
                  route = this.__node.tree[body.route];
                }
              }
              if (route) {
                let res = this.receive({ route, args, method });
              } else if (callbackId && sse.requests[callbackId]) {
                sse.requests[callbackId](args);
              }
              if (this.__node.keepState)
                this.setState({ [path2]: body });
            });
          }
        }
      };
      let requestListeners = server2.listeners("request");
      server2.removeAllListeners("request");
      const otherListeners = (req, res) => {
        requestListeners.forEach((l) => {
          l(req, res);
        });
      };
      const sseListener = (req, res) => {
        if (req.url)
          if (req.url.indexOf(path2) > -1) {
            if (!this.servers[path2]) {
              server2.removeListener("request", sseListener);
              server2.addListener("request", otherListeners);
            }
            onRequest(req, res);
          } else
            otherListeners(req, res);
      };
      server2.addListener("request", sseListener);
      server2.addListener("close", () => {
        if (sse.onclose)
          sse.onclose(sse);
      });
      return sse;
    };
    this.streamIterable = (path2, iterable, sessionId, eventName = "message") => {
      let server2 = this.servers[path2];
      if (server2) {
        if (sessionId) {
          if (server2.sessions[sessionId]) {
            return server2.sessions[sessionId].iterate(iterable, { eventName });
          }
        } else {
          let promises = [];
          for (const key in server2.sessions) {
            promises.push(server2.sessions[key].iterate(iterable));
          }
          return promises;
        }
      }
    };
    this.streamReadable = (path2, readable, sessionId, eventName = "message") => {
      let server2 = this.servers[path2];
      if (server2) {
        if (sessionId) {
          if (server2.sessions[sessionId]) {
            return server2.sessions[sessionId].stream(readable, { eventName });
          }
        } else {
          let promises = [];
          for (const key in server2.sessions) {
            promises.push(server2.sessions[key].stream(readable));
          }
          return promises;
        }
      }
    };
    this.transmit = (data, path2, eventName, sessionId) => {
      if (!path2 && typeof data === "object") {
        if (data.route) {
          let keys = Object.keys(this.servers);
          if (keys.length > 0) {
            let evs = this.servers[keys[0]];
            if (evs.channels?.includes(data.route)) {
              path2 = evs.path;
              eventName = data.route;
            }
          }
          if (!path2 && data.route) {
            if (this.servers[data.route])
              path2 = data.route;
          }
        }
        data = JSON.stringify(data);
      }
      if (!path2)
        path2 = Object.keys(this.servers)[0];
      if (path2 && this.servers[path2]) {
        if (sessionId) {
          if (this.servers[path2].sessions[sessionId]?.isConnected) {
            this.servers[path2].sessions[sessionId].push(data, eventName);
          } else if (this.servers[path2].sessions[sessionId]) {
            delete this.servers[path2].sessions[sessionId];
            return false;
          }
        } else
          this.servers[path2].channel.broadcast(data, eventName);
        return true;
      }
      return false;
    };
    this.request = (message, path2, method, sessionId, eventName) => {
      return new Promise((res, rej) => {
        let callbackId = `${Math.random()}`;
        let req = { route: "runRequest", args: [message, path2, callbackId, sessionId] };
        if (method)
          req.method = method;
        let sse = this.servers[path2];
        let callback = (result) => {
          res(result);
        };
        sse.requests[callbackId] = callback;
        if (sse) {
          if (sessionId) {
            if (sse.sessions[sessionId])
              sse.sessions[sessionId].push(JSON.stringify(req), eventName);
          } else
            sse.channel.broadcast(JSON.stringify(req), eventName);
        }
      });
    };
    this.runRequest = (message, path2, callbackId, sessionId) => {
      let res = this.receive(message);
      if (path2) {
        let sse = this.servers[path2];
        if (sse) {
          if (res instanceof Promise) {
            res.then((r) => {
              if (sessionId) {
                if (sse.sessions[sessionId]) {
                  sse.sessions[sessionId].push(JSON.stringify({ args: r, callbackId }));
                }
              } else {
                sse.channel.broadcast(JSON.stringify({ args: r, callbackId }));
              }
            });
          } else {
            if (sessionId) {
              if (sse.sessions[sessionId]) {
                sse.sessions[sessionId].push(JSON.stringify({ args: res, callbackId }));
              }
            } else
              sse.channel.broadcast(JSON.stringify({ args: res, callbackId }));
          }
        }
      }
      return res;
    };
    this.subscribeSSE = (route, path2, sessionId, eventName) => {
      if (this.servers[path2]) {
        return this.subscribe(route, (res) => {
          this.servers[path2].send({ args: res, callbackId: route }, eventName, sessionId);
        });
      }
    };
    this.subscribeToSSE = (route, path2, callback, sessionId, eventName) => {
      if (this.servers[path2]) {
        this.subscribe(path2, (res) => {
          if (res?.callbackId === route) {
            if (!callback)
              this.setState({ [path2]: res.args });
            else if (typeof callback === "string") {
              this.run(callback, res.args);
            } else
              callback(res.args);
          }
        });
        if (sessionId) {
          if (this.servers[path2].sessions[sessionId]) {
            return this.eventsources[sessionId].run(
              "subscribeSSE",
              { route: "subscribeSSE", args: [route, path2] },
              void 0,
              eventName
            );
          }
        } else {
          let promises = [];
          for (const k in this.servers[path2].sessions) {
            promises.push(
              this.eventsources[k].run(
                "subscribeSSE",
                { route: "subscribeSSE", args: [route, path2] },
                void 0,
                eventName
              )
            );
          }
          return promises;
        }
      }
    };
    this.terminate = (sse) => {
      if (typeof sse === "object")
        delete this.servers[sse.path];
      else if (typeof sse === "string") {
        delete this.servers[sse];
        delete this.eventsources[sse];
      }
      return true;
    };
    this.setTree(this);
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
    this.connections = {
      servers: this.servers,
      sockets: this.sockets
    };
    this.setupWSS = (options) => {
      const host = options.host;
      const port = options.port;
      let path2 = options.path;
      const server2 = options.server;
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
      if (!options.onmessage)
        options.onmessage = (data) => {
          if (data instanceof Buffer)
            data = data.toString();
          const result = this.receive(data, wss, this.servers[address]);
          if (options.keepState)
            this.setState({ [address]: result });
        };
      wss.on("connection", (ws, request2) => {
        if (this.debug)
          console.log(`New socket connection on ${address}`);
        let clientId = `socket${Math.floor(Math.random() * 1e12)}`;
        this.servers[address].clients[clientId] = ws;
        ws.send(JSON.stringify({ route: "setId", args: clientId }));
        let info = this.openWS({
          socket: ws,
          address: clientId,
          _id: clientId
        });
        if (this.servers[address].onconnection)
          this.servers[address].onconnection(ws, request2, this.servers[address], clientId);
        if (this.servers[address].onconnectionclosed)
          ws.on("close", (code, reason) => {
            if (this.servers[address].onconnectionclosed)
              this.servers[address].onconnectionclosed(code, reason, ws, this.servers[address], clientId);
          });
      });
      wss.on("error", (err) => {
        if (this.debug)
          console.log("Socket Error:", err);
        if (this.servers[address].onerror)
          this.servers[address].onerror(err, wss, this.servers[address]);
        else
          console.error(err);
      });
      let onUpgrade = (request2, socket, head) => {
        if (request2.headers && request2.url) {
          if (this.debug)
            console.log("Upgrade request at: ", request2.url);
          let addr = request2.headers.host.split(":")[0];
          addr += ":" + port;
          addr += request2.url.split("?")[0];
          if (addr === address && this.servers[addr]) {
            this.servers[addr].wss.handleUpgrade(request2, socket, head, (ws) => {
              if (this.servers[address].onupgrade)
                this.servers[address].onupgrade(ws, this.servers[address], request2, socket, head);
              this.servers[addr].wss.emit("connection", ws, request2);
            });
          }
        }
      };
      server2.addListener("upgrade", onUpgrade);
      wss.on("close", () => {
        server2.removeListener("upgrade", onUpgrade);
        if (this.servers[address].onclose)
          this.servers[address].onclose(wss, this.servers[address]);
        else
          console.log(`wss closed: ${address}`);
      });
      let send = (message, socketId) => {
        if (!socketId) {
          for (const key in this.servers[address].clients) {
            this.sockets[key].send(message);
          }
        } else
          return this.sockets[socketId].send(message);
      };
      let request = (message, method, socketId) => {
        if (!socketId) {
          let promises = [];
          for (const key in this.servers[address].clients) {
            promises.push(this.sockets[key].request(message, method));
          }
          return promises;
        } else
          return this.sockets[socketId].request(message, method);
      };
      let post = (route, args, method, socketId) => {
        if (!socketId) {
          for (const key in this.servers[address].clients) {
            this.sockets[key].post(route, args, method);
          }
        } else
          return this.sockets[socketId].post(route, args, method);
      };
      let run = (route, args, method, socketId) => {
        if (!socketId) {
          let promises = [];
          for (const key in this.servers[address].clients) {
            promises.push(this.sockets[key].run(route, args, method));
          }
          return promises;
        } else
          return this.sockets[socketId].run(route, args, method);
      };
      let subscribe = (route, callback, socketId) => {
        if (!socketId) {
          let promises = [];
          for (const key in this.servers[address].clients) {
            promises.push(this.sockets[key].subscribe(route, callback));
          }
          return promises;
        } else
          this.sockets[socketId].subscribe(route, callback);
      };
      let unsubscribe = (route, sub, socketId) => {
        if (!socketId) {
          let promises = [];
          for (const key in this.servers[address].clients) {
            promises.push(this.sockets[key].unsubscribe(route, sub));
          }
          return promises;
        } else
          this.sockets[socketId].unsubscribe(route, sub);
      };
      let terminate = (socketId) => {
        if (socketId)
          return this.terminate(socketId);
        else
          return this.terminate(address);
      };
      this.servers[address].send = send;
      this.servers[address].request = request;
      this.servers[address].post = post;
      this.servers[address].run = run;
      this.servers[address].subscribe = subscribe;
      this.servers[address].unsubscribe = unsubscribe;
      this.servers[address].terminate = terminate;
      this.servers[address].graph = this;
      this.servers[address]._id = options._id ? options._id : address;
      return this.servers[address];
    };
    this.openWS = (options) => {
      if (!options.address) {
        let protocol = options.protocol;
        if (!protocol)
          protocol = "wss";
        options.address = `${protocol}://${options.host}`;
        if (options.port)
          options.address += ":" + options.port;
        if (!options.path || options.path?.startsWith("/"))
          options.address += "/";
        if (options.path)
          options.address += options.path;
      }
      const address = options.address;
      let socket;
      if (options.socket)
        socket = options.socket;
      else
        socket = new wrapper_default(address);
      if (!("keepState" in options))
        options.keepState = true;
      if (options.onmessage)
        socket.on("message", (data) => {
          this.sockets[address].onmessage(data, socket, this.sockets[address]);
        });
      else if (options._id) {
        socket.on("message", (data) => {
          if (ArrayBuffer.isView(data))
            data = data.toString();
          this.receive(data, socket, this.sockets[address]);
          if (options.keepState) {
            this.setState({ [address]: data });
          }
        });
      } else {
        let socketonmessage = (data) => {
          if (ArrayBuffer.isView(data))
            data = data.toString();
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
                    if (ArrayBuffer.isView(data2))
                      data2 = data2.toString();
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
      socket.on("open", () => {
        if (this.sockets[address].onopen)
          this.sockets[address].onopen(socket, this.sockets[address]);
      });
      socket.on("close", (code, reason) => {
        if (this.sockets[address].onclose)
          this.sockets[address].onclose(code, reason, socket, this.sockets[address]);
      });
      socket.on("error", (er) => {
        if (this.sockets[address].onerror)
          this.sockets[address].onerror(er, socket, this.sockets[address]);
      });
      let send = (message) => {
        return this.transmit(message, socket);
      };
      let post = (route, args, method) => {
        let message = {
          route,
          args
        };
        if (method)
          message.method = method;
        return this.transmit(message, socket);
      };
      let run = (route, args, method) => {
        return new Promise((res, rej) => {
          let callbackId = Math.random();
          let req = { route: "runRequest", args: [{ route, args }, address, callbackId] };
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
      let request = (message, method) => {
        return this.request(message, socket, address, method);
      };
      let subscribe = (route, callback) => {
        return this.subscribeToSocket(route, address, callback);
      };
      let unsubscribe = (route, sub) => {
        return run("unsubscribe", [route, sub]);
      };
      let terminate = () => {
        this.terminate(address);
      };
      this.sockets[address] = {
        type: "socket",
        socket,
        send,
        post,
        request,
        run,
        subscribe,
        unsubscribe,
        terminate,
        graph: this,
        ...options
      };
      return this.sockets[address];
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
            delete this.sockets[k];
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
            for (const key in this.servers[k].clients) {
              this.closeWS(this.servers[k].clients[key]);
            }
            delete this.servers[k];
            break;
          }
        }
        if (!ws) {
          for (const k in this.sockets) {
            if (k.includes(ws)) {
              ws = this.sockets[k].socket;
              delete this.sockets[k];
              break;
            }
          }
        }
      }
      if (ws instanceof import_websocket_server.default) {
        ws.close((er) => {
          if (er)
            console.error(er);
        });
      } else if (ws instanceof wrapper_default) {
        if (ws.readyState === ws.OPEN)
          ws.close();
      }
      return true;
    };
    this.request = (message, ws, _id, method) => {
      let callbackId = `${Math.random()}`;
      let req = { route: "runRequest", args: [message, _id, callbackId] };
      if (method)
        req.method = method;
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
    this.subscribeSocket = (route, socket, key, subInput) => {
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
        }, key, subInput);
    };
    this.subscribeToSocket = (route, socketId, callback, key, subInput) => {
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
        return this.sockets[socketId].request({ route: "subscribeSocket", args: [route, socketId, key, subInput] });
      }
    };
    this.open = (options) => {
      if (options.server)
        return this.setupWSS(options);
      else
        return this.openWS(options);
    };
    this.setTree(this);
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
        settings.subscribe = async (route, callback) => {
          return node.__subscribe(callback, route);
        };
        settings.unsubscribe = async (route, sub) => {
          return node.__unsubscribe(sub, void 0, route);
        };
        settings.terminate = () => {
          node.__node.graph.remove(node);
          return true;
        };
        settings.onclose = options.onclose;
        if (settings.onclose) {
          node.__addDisconnected((n) => {
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
          if (route && graph.GET(route)) {
            let n = graph.GET(route);
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
    this.addService = (service, connections, source, order) => {
      this.services[service.name] = service;
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
      if (service instanceof Service) {
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
            this.subscribe(endpoint, (res2) => {
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
      if (options.services) {
        for (const key in options.services) {
          let opt = options.services[key];
          if (opt instanceof Service) {
            opt.name = key;
            opt.__node.tag = key;
            this.addService(opt, opt.connections);
          } else if (typeof opt === "function") {
            let service = new opt();
            service.name = key;
            service.__node.tag = key;
            if (service instanceof Service)
              this.addService(
                service,
                service.connections
              );
          } else {
            if (typeof opt?.service === "function") {
              let service = new opt.service({ name: key });
              service.name = key;
              service.__node.tag = key;
              if (service)
                this.addService(
                  service
                );
              opt.service = service;
            } else if (opt?.service instanceof Service) {
              opt.service.name = key;
              opt.service.tag = key;
              this.addService(
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

// backend.ts
function exitHandler(options, exitCode) {
  if (exitCode || exitCode === 0)
    console.log("SERVER EXITED WITH CODE: ", exitCode);
  if (options.exit)
    process.exit();
}
process.on("exit", exitHandler.bind(null, { cleanup: true }));
process.on("SIGINT", exitHandler.bind(null, { exit: true }));
var router = new Router({
  services: {
    "http": HTTPbackend,
    "wss": WSSbackend,
    "sse": SSEbackend
  }
});
var server = router.run(
  "setupServer",
  {
    protocol: "http",
    host: "localhost",
    port: 8080,
    pages: {
      "/": {
        template: `<div>Nice...</div>`,
        onrequest: (self, node, req, res) => {
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
);
if (server instanceof Promise)
  server.then((served) => {
    console.log(router.__node.nodes.keys());
    const socketserver = router.run(
      "setupWSS",
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
      "setupWSS",
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
      "setupSSE",
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
