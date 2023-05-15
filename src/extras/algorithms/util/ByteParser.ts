//byte manipulation math utils

import { ArrayManip } from "./ArrayManip"


//struct packing/unpacking by https://github.com/lyngklip/structjs (MIT License)
/*eslint-env es6*/
const rechk = /^([<>])?(([1-9]\d*)?([xcbB?hHiIfdsp]))*$/
const refmt = /([1-9]\d*)?([xcbB?hHiIfdsp])/g
const str = (v,o,c) => String.fromCharCode(
    ...new Uint8Array(v.buffer, v.byteOffset + o, c))
const rts = (v,o,c,s) => new Uint8Array(v.buffer, v.byteOffset + o, c)
    .set(s.split('').map(str => str.charCodeAt(0)))
const pst = (v,o,c) => str(v, o + 1, Math.min(v.getUint8(o), c - 1))
const tsp = (v,o,c,s) => { v.setUint8(o, s.length); rts(v, o + 1, c - 1, s) }
const lut = le => ({
    x: c=>[1,c,0],
    c: c=>[c,1,o=>({u:v=>str(v, o, 1)      , p:(v,c)=>rts(v, o, 1, c)     })],
    '?': c=>[c,1,o=>({u:v=>Boolean(v.getUint8(o)),p:(v,B)=>v.setUint8(o,B)})],
    b: c=>[c,1,o=>({u:v=>v.getInt8(   o   ), p:(v,b)=>v.setInt8(   o,b   )})],
    B: c=>[c,1,o=>({u:v=>v.getUint8(  o   ), p:(v,B)=>v.setUint8(  o,B   )})],
    h: c=>[c,2,o=>({u:v=>v.getInt16(  o,le), p:(v,h)=>v.setInt16(  o,h,le)})],
    H: c=>[c,2,o=>({u:v=>v.getUint16( o,le), p:(v,H)=>v.setUint16( o,H,le)})],
    i: c=>[c,4,o=>({u:v=>v.getInt32(  o,le), p:(v,i)=>v.setInt32(  o,i,le)})],
    I: c=>[c,4,o=>({u:v=>v.getUint32( o,le), p:(v,I)=>v.setUint32( o,I,le)})],
    f: c=>[c,4,o=>({u:v=>v.getFloat32(o,le), p:(v,f)=>v.setFloat32(o,f,le)})],
    d: c=>[c,8,o=>({u:v=>v.getFloat64(o,le), p:(v,d)=>v.setFloat64(o,d,le)})],
    s: c=>[1,c,o=>({u:v=>str(v,o,c), p:(v,s)=>rts(v,o,c,s.slice(0,c    ) )})],
    p: c=>[1,c,o=>({u:v=>pst(v,o,c), p:(v,s)=>tsp(v,o,c,s.slice(0,c - 1) )})]
})
const errbuf = new RangeError("Structure larger than remaining buffer")
const errval = new RangeError("Not enough values for structure")
/*
const pack = (format, ...values) => struct(format).pack(...values)
const unpack = (format, buffer) => struct(format).unpack(buffer)
const pack_into = (format, arrb, offs, ...values) =>
    struct(format).pack_into(arrb, offs, ...values)
const unpack_from = (format, arrb, offset) =>
    struct(format).unpack_from(arrb, offset)
const iter_unpack = (format, arrb) => struct(format).iter_unpack(arrb)
const calcsize = format => struct(format).size
module.exports = {
    struct, pack, unpack, pack_into, unpack_from, iter_unpack, calcsize }
*/


export class ByteParser extends ArrayManip {
    
    static codes = { //common codes
        '\\n':0x0A, //newline
        '\\r':0x0D, //carriage return
        '\\t':0x09, //tab
        '\\s':0x20, //space
        '\\b':0x08, //backspace
        '\\f':0x0C, //form feed
        '\\':0x5C  // backslash
    }

    // convert values to data views if not, with some basic encoding formats
    static toDataView(value:string|number|ArrayBufferLike|DataView|number[]) {
        if(!(value instanceof DataView)) { //dataviews just wrap arraybuffers for sending packets  
            if(typeof value === 'string' && parseInt(value)) value = parseInt(value);
            if(typeof value === 'string') {
                let enc = new TextEncoder();
                let hascodes = {};
                for(const code in ByteParser.codes) {
                    while(value.indexOf(code) > -1) {
                        let idx = value.indexOf(code);
                        value = value.replace(code,'');
                        hascodes[idx] = code;
                    }
                }
                let encoded = Array.from(enc.encode(value));
                for(const key in hascodes) {
                    encoded.splice(parseInt(key),0,ByteParser.codes[hascodes[key]]);
                }
                value = new DataView(new Uint8Array(encoded).buffer);
            } else if (typeof value === 'number') {
                let tmp = value;
                if(value < 256) { //it's a single byte being written most likely, this is just a 'dumb' attempt
                    value = new DataView(new ArrayBuffer(1));
                    value.setUint8(0,tmp);

                } else if(value < 65536) { //it's a single byte being written most likely, this is just a 'dumb' attempt
                    value = new DataView(new ArrayBuffer(2));
                    value.setInt16(0,tmp);
                } else {
                    value = new DataView(new ArrayBuffer(4));
                    value.setUint32(0,tmp);
                }
            } else if (value instanceof ArrayBuffer || (typeof SharedArrayBuffer !== 'undefined' && value instanceof SharedArrayBuffer)) {
                value = new DataView(value); 
            } else if(Array.isArray(value)) { //assume it's an array-defined uint8 byte buffer that we need to convert
                value = new DataView(Uint8Array.from(value).buffer);
            } else if (typeof value === 'object') {
                value = new TextEncoder().encode(JSON.stringify(value)); //try to force it
            }
        }
        return value as DataView;
    }

    //search a buffer for matching indices. Can limit the number of indices to find if the buffer is giant but this allows asynchronous number crunching between buffers and outputs to build buffers and then parse through them from the stream
    static searchBuffer(buffer:number[]|ArrayBuffer, searchString:Uint8Array, limit?:number) {
        
		var needle = searchString
		var haystack = buffer;
		var search = ByteParser.boyerMoore(needle);
		var skip = search.byteLength;

        var indices:any[] = [];

		for (var i = search(haystack); i !== -1; i = search(haystack, i + skip)) {
			indices.push(i);
            if(limit) if(indices.length >= limit) break;
		}

        return indices;
    }


    //signed int conversions
    static bytesToInt16(x0:number,x1:number){
		let int16 = ((0xFF & x0) << 8) | (0xFF & x1);
		if((int16 & 0x8000) > 0) {
			int16 |= 0xFFFF0000; //js ints are 32 bit
		} else {
			int16 &= 0x0000FFFF;
		}
		return int16;
    }

    //turn 2 byte sequence (little endian input order) into a uint16 value
    static bytesToUInt16(x0:number,x1:number){
		return x0 * 256 + x1;
    }

    static Uint16ToBytes(y:number){ //Turns a 16 bit unsigned int into a 3 byte sequence
        return [y & 0xFF , (y >> 8) & 0xFF];
    }

	//signed int conversions
    static bytesToInt24(x0:number,x1:number,x2:number){ //Turns a 3 byte sequence into a 24 bit signed int value
        let int24 = ((0xFF & x0) << 16) | ((0xFF & x1) << 8) | (0xFF & x2);
		if((int24 & 0x800000) > 0) {
			int24 |= 0xFF000000; //js ints are 32 bit
		} else {
			int24 &= 0x00FFFFFF;
		}
		return int24;
    }

    static bytesToUInt24(x0:number,x1:number,x2:number){ //Turns a 3 byte sequence into a 24 bit uint
        return x0 * 65536 + x1 * 256 + x2;
    }

    static Uint24ToBytes(y:number){ //Turns a 24 bit unsigned int into a 3 byte sequence
        return [y & 0xFF , (y >> 8) & 0xFF , (y >> 16) & 0xFF];
    }
    
	//signed int conversion
    static bytesToInt32(x0:number,x1:number,x2:number,x3:number){ //Turns a 4 byte sequence into a 32 bit signed int value
        let int32 = ((0xFF & x0) << 24) | ((0xFF & x1) << 16) | ((0xFF & x2) << 8) | (0xFF & x3);
		if((int32 & 0x80000000) > 0) {
			int32 |= 0x00000000; //js ints are 32 bit
		} else {
			int32 &= 0xFFFFFFFF;
		}
		return int32;
    }

    static bytesToUInt32(x0:number,x1:number,x2:number,x3:number){ //Turns a 4 byte sequence into a 32 bit uint
        return x0 * 16777216 + x1 * 65536 + x2 * 256 + x3;
    }

    static Uint32ToBytes(y:number){ //Turns a 32 bit unsigned int into a 4 byte sequence
        return [y & 0xFF , (y >> 8) & 0xFF , (y >> 16) & 0xFF , (y >> 24) & 0xFF];
    }

    //converts a signed int into its two's compliment value for up to 32 bit numbers
    static get2sCompliment(
        val:number,
        nbits:number //e.g. 24 bit, 32 bit.
    ) {
        if(val > 4294967296) return null; //only up to 32 bit ints using js's built in int32 format
        return val << (32 - nbits) >> (32 - nbits); //bit-wise shift to get the two's compliment format of a value
    }

    //get any-sized signed int from an arbitrary byte array (little endian)
    static getSignedInt(...args:number[]) {

        let pos = 0;
        function getInt(size) {
            var value = 0;
            var first = true;
            while (size--) {
                if (first) {
                    let byte = args[pos++];
                    value += byte & 0x7f;
                    if (byte & 0x80) {
                        value -= 0x80;
                        // Treat most-significant bit as -2^i instead of 2^i
                    }
                    first = false;
                }
                else {
                    value *= 256;
                    value += args[pos++];
                }
            }
            return value;
        }

        return getInt(args.length)
    }

	//Boyer Moore fast byte search method copied from https://codereview.stackexchange.com/questions/20136/uint8array-indexof-method-that-allows-to-search-for-byte-sequences
	static asUint8Array(input) {
		if (input instanceof Uint8Array) {
			return input;
		} else if (typeof(input) === 'string') {
			// This naive transform only supports ASCII patterns. UTF-8 support
			// not necessary for the intended use case here.
			var arr = new Uint8Array(input.length);
			for (var i = 0; i < input.length; i++) {
			var c = input.charCodeAt(i);
			if (c > 127) {
				throw new TypeError("Only ASCII patterns are supported");
			}
			arr[i] = c;
			}
			return arr;
		} else {
			// Assume that it's already something that can be coerced.
			return new Uint8Array(input);
		}
	}

	static boyerMoore(patternBuffer):any {
		// Implementation of Boyer-Moore substring search ported from page 772 of
		// Algorithms Fourth Edition (Sedgewick, Wayne)
		// http://algs4.cs.princeton.edu/53substring/BoyerMoore.java.html
		/*
		USAGE:
			// needle should be ASCII string, ArrayBuffer, or Uint8Array
			// haystack should be an ArrayBuffer or Uint8Array
			var search = boyerMoore(needle);
			var skip = search.byteLength;
			var indices = [];
			for (var i = search(haystack); i !== -1; i = search(haystack, i + skip)) {
				indices.push(i);
			}
		*/
		var pattern = ByteParser.asUint8Array(patternBuffer);
		var M = pattern.length;
		if (M === 0) {
			throw new TypeError("patternBuffer must be at least 1 byte long");
		}
		// radix
		var R = 256;
		var rightmost_positions = new Int32Array(R);
		// position of the rightmost occurrence of the byte c in the pattern
		for (var c = 0; c < R; c++) {
			// -1 for bytes not in pattern
			rightmost_positions[c] = -1;
		}
		for (var j = 0; j < M; j++) {
			// rightmost position for bytes in pattern
			rightmost_positions[pattern[j]] = j;
		}
		var boyerMooreSearch = (txtBuffer, start?, end?) => {
			// Return offset of first match, -1 if no match.
			var txt = ByteParser.asUint8Array(txtBuffer);
			if (start === undefined) start = 0;
			if (end === undefined) end = txt.length;
			var pat = pattern;
			var right = rightmost_positions;
			var lastIndex = end - pat.length;
			var lastPatIndex = pat.length - 1;
			var skip;
			for (var i = start; i <= lastIndex; i += skip) {
				skip = 0;
				for (var j = lastPatIndex; j >= 0; j--) {
				var c = txt[i + j];
				if (pat[j] !== c) {
					skip = Math.max(1, j - right[c]);
					break;
				}
				}
				if (skip === 0) {
				    return i;
				}
			}
			return -1;
		};

        (boyerMooreSearch as any).byteLength = pattern.byteLength
		return boyerMooreSearch;
	}
	//---------------------end copy/pasted solution------------------------


    //eg struct(format).unpack(Uint8Array[]) //to parse a struct with a specified format into an unpacked array
    static struct(format:string) { //struct packing/unpacking
        let fns:any[] = [], size = 0, m = rechk.exec(format)
        if (!m) { throw new RangeError("Invalid format string") }
        const t = lut('<' === m[1]), lu = (n:any, c:any) => t[c](n ? parseInt(n, 10) : 1)
        while ((m = refmt.exec(format))) { 
            
            ((r:any, s:any, f:any) => {
                for (let i = 0; i < r; ++i, size += s) { 
                    if (f) {fns.push(f(size))} }
            })(
                // @ts-ignore
                ...lu(...m.slice(1))
            )
        } 
        const unpack_from = (arrb, offs) => {
            if (arrb.byteLength < (offs|0) + size) { throw errbuf }
            let v = new DataView(arrb, offs|0)
            return fns.map(f => f.u(v))
        }
        const pack_into = (arrb, offs, ...values) => {
            if (values.length < fns.length) { throw errval }
            if (arrb.byteLength < offs + size) { throw errbuf }
            const v = new DataView(arrb, offs)
            new Uint8Array(arrb, offs, size).fill(0)
            fns.forEach((f, i) => f.p(v, values[i]))
        }
        const pack = (...values) => {
            let b = new ArrayBuffer(size)
            pack_into(b, 0, ...values)
            return b
        }
        const unpack = arrb => unpack_from(arrb, 0)
        function* iter_unpack(arrb) { 
            for (let offs = 0; offs + size <= arrb.byteLength; offs += size) {
                yield unpack_from(arrb, offs);
            }
        }
        return Object.freeze({
            unpack, pack, unpack_from, pack_into, iter_unpack, format, size})
    }

}