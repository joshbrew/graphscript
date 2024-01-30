declare var bson: Readonly<{
    __proto__: any;
    Code: typeof Code;
    BSONSymbol: typeof BSONSymbol;
    DBRef: typeof DBRef;
    Binary: typeof Binary;
    ObjectId: typeof ObjectId;
    UUID: typeof UUID;
    Long: typeof Long;
    Timestamp: typeof Timestamp;
    Double: typeof Double;
    Int32: typeof Int32;
    MinKey: typeof MinKey;
    MaxKey: typeof MaxKey;
    BSONRegExp: typeof BSONRegExp;
    Decimal128: typeof Decimal128;
    setInternalBufferSize: typeof setInternalBufferSize;
    serialize: typeof serialize;
    serializeWithBufferAndIndex: typeof serializeWithBufferAndIndex;
    deserialize: typeof deserialize;
    calculateObjectSize: typeof calculateObjectSize;
    deserializeStream: typeof deserializeStream;
    BSONValue: typeof BSONValue;
    BSONError: typeof BSONError;
    BSONVersionError: typeof BSONVersionError;
    BSONRuntimeError: typeof BSONRuntimeError;
    BSONType: Readonly<{
        double: 1;
        string: 2;
        object: 3;
        array: 4;
        binData: 5;
        undefined: 6;
        objectId: 7;
        bool: 8;
        date: 9;
        null: 10;
        regex: 11;
        dbPointer: 12;
        javascript: 13;
        symbol: 14;
        javascriptWithScope: 15;
        int: 16;
        timestamp: 17;
        long: 18;
        decimal: 19;
        minKey: -1;
        maxKey: 127;
    }>;
    EJSON: any;
}>;
export class BSONError extends Error {
    static isBSONError(value: any): boolean;
    constructor(message: any);
    get bsonError(): boolean;
    get name(): string;
}
export class BSONRegExp extends BSONValue {
    static parseOptions(options: any): any;
    static fromExtendedJSON(doc: any): any;
    constructor(pattern: any, options: any);
    get _bsontype(): string;
    pattern: any;
    options: any;
    toExtendedJSON(options: any): {
        $regex: any;
        $options: any;
        $regularExpression?: undefined;
    } | {
        $regularExpression: {
            pattern: any;
            options: any;
        };
        $regex?: undefined;
        $options?: undefined;
    };
    inspect(): string;
}
export class BSONRuntimeError extends BSONError {
}
export class BSONSymbol extends BSONValue {
    static fromExtendedJSON(doc: any): BSONSymbol;
    constructor(value: any);
    get _bsontype(): string;
    value: any;
    valueOf(): any;
    toString(): any;
    inspect(): string;
    toJSON(): any;
    toExtendedJSON(): {
        $symbol: any;
    };
}
export const BSONType: Readonly<{
    double: 1;
    string: 2;
    object: 3;
    array: 4;
    binData: 5;
    undefined: 6;
    objectId: 7;
    bool: 8;
    date: 9;
    null: 10;
    regex: 11;
    dbPointer: 12;
    javascript: 13;
    symbol: 14;
    javascriptWithScope: 15;
    int: 16;
    timestamp: 17;
    long: 18;
    decimal: 19;
    minKey: -1;
    maxKey: 127;
}>;
export class BSONValue {
}
export class BSONVersionError extends BSONError {
    constructor();
}
export class Binary extends BSONValue {
    static fromExtendedJSON(doc: any, options: any): Binary;
    constructor(buffer: any, subType: any);
    get _bsontype(): string;
    sub_type: any;
    buffer: any;
    position: any;
    put(byteValue: any): void;
    write(sequence: any, offset: any): void;
    read(position: any, length: any): any;
    value(asRaw: any): any;
    length(): any;
    toJSON(): any;
    toString(encoding: any): any;
    toExtendedJSON(options: any): {
        $binary: any;
        $type: string;
    } | {
        $binary: {
            base64: any;
            subType: string;
        };
        $type?: undefined;
    };
    toUUID(): UUID;
    inspect(): string;
}
export namespace Binary {
    let BSON_BINARY_SUBTYPE_DEFAULT: number;
    let BUFFER_SIZE: number;
    let SUBTYPE_DEFAULT: number;
    let SUBTYPE_FUNCTION: number;
    let SUBTYPE_BYTE_ARRAY: number;
    let SUBTYPE_UUID_OLD: number;
    let SUBTYPE_UUID: number;
    let SUBTYPE_MD5: number;
    let SUBTYPE_ENCRYPTED: number;
    let SUBTYPE_COLUMN: number;
    let SUBTYPE_USER_DEFINED: number;
}
export class Code extends BSONValue {
    static fromExtendedJSON(doc: any): Code;
    constructor(code: any, scope: any);
    get _bsontype(): string;
    code: any;
    scope: any;
    toJSON(): {
        code: any;
        scope: any;
    } | {
        code: any;
        scope?: undefined;
    };
    toExtendedJSON(): {
        $code: any;
        $scope: any;
    } | {
        $code: any;
        $scope?: undefined;
    };
    inspect(): string;
}
export class DBRef extends BSONValue {
    static fromExtendedJSON(doc: any): DBRef;
    constructor(collection: any, oid: any, db: any, fields: any);
    get _bsontype(): string;
    collection: any;
    oid: any;
    db: any;
    fields: any;
    set namespace(value: any);
    get namespace(): any;
    toJSON(): any;
    toExtendedJSON(options: any): {
        $ref: any;
        $id: any;
    };
    inspect(): string;
}
export class Decimal128 extends BSONValue {
    static fromString(representation: any): Decimal128;
    static fromExtendedJSON(doc: any): Decimal128;
    constructor(bytes: any);
    get _bsontype(): string;
    bytes: any;
    toJSON(): {
        $numberDecimal: string;
    };
    toExtendedJSON(): {
        $numberDecimal: string;
    };
    inspect(): string;
}
export class Double extends BSONValue {
    static fromExtendedJSON(doc: any, options: any): number | Double;
    constructor(value: any);
    get _bsontype(): string;
    value: number;
    valueOf(): number;
    toJSON(): number;
    toString(radix: any): string;
    toExtendedJSON(options: any): number | {
        $numberDouble: string;
    };
    inspect(): string;
}
export const EJSON: any;
export class Int32 extends BSONValue {
    static fromExtendedJSON(doc: any, options: any): number | Int32;
    constructor(value: any);
    get _bsontype(): string;
    value: number;
    valueOf(): number;
    toString(radix: any): string;
    toJSON(): number;
    toExtendedJSON(options: any): number | {
        $numberInt: string;
    };
    inspect(): string;
}
export class Long extends BSONValue {
    static fromBits(lowBits: any, highBits: any, unsigned: any): Long;
    static fromInt(value: any, unsigned: any): any;
    static fromNumber(value: any, unsigned: any): any;
    static fromBigInt(value: any, unsigned: any): any;
    static fromString(str: any, unsigned: any, radix: any): any;
    static fromBytes(bytes: any, unsigned: any, le: any): Long;
    static fromBytesLE(bytes: any, unsigned: any): Long;
    static fromBytesBE(bytes: any, unsigned: any): Long;
    static isLong(value: any): boolean;
    static fromValue(val: any, unsigned: any): any;
    static fromExtendedJSON(doc: any, options: any): any;
    constructor(low: number, high: any, unsigned: any);
    get _bsontype(): string;
    get __isLong__(): boolean;
    low: number;
    high: number;
    unsigned: boolean;
    add(addend: any): Long;
    and(other: any): Long;
    compare(other: any): 0 | 1 | -1;
    comp(other: any): 0 | 1 | -1;
    divide(divisor: any): any;
    div(divisor: any): any;
    equals(other: any): boolean;
    eq(other: any): boolean;
    getHighBits(): number;
    getHighBitsUnsigned(): number;
    getLowBits(): number;
    getLowBitsUnsigned(): number;
    getNumBitsAbs(): any;
    greaterThan(other: any): boolean;
    gt(other: any): boolean;
    greaterThanOrEqual(other: any): boolean;
    gte(other: any): boolean;
    ge(other: any): boolean;
    isEven(): boolean;
    isNegative(): boolean;
    isOdd(): boolean;
    isPositive(): boolean;
    isZero(): boolean;
    lessThan(other: any): boolean;
    lt(other: any): boolean;
    lessThanOrEqual(other: any): boolean;
    lte(other: any): boolean;
    modulo(divisor: any): Long;
    mod(divisor: any): Long;
    rem(divisor: any): Long;
    multiply(multiplier: any): any;
    mul(multiplier: any): any;
    negate(): Long;
    neg(): Long;
    not(): Long;
    notEquals(other: any): boolean;
    neq(other: any): boolean;
    ne(other: any): boolean;
    or(other: any): Long;
    shiftLeft(numBits: any): Long;
    shl(numBits: any): Long;
    shiftRight(numBits: any): Long;
    shr(numBits: any): Long;
    shiftRightUnsigned(numBits: any): Long;
    shr_u(numBits: any): Long;
    shru(numBits: any): Long;
    subtract(subtrahend: any): Long;
    sub(subtrahend: any): Long;
    toInt(): number;
    toNumber(): number;
    toBigInt(): bigint;
    toBytes(le: any): number[];
    toBytesLE(): number[];
    toBytesBE(): number[];
    toSigned(): Long;
    toString(radix: any): any;
    toUnsigned(): Long;
    xor(other: any): Long;
    eqz(): boolean;
    le(other: any): boolean;
    toExtendedJSON(options: any): number | {
        $numberLong: any;
    };
    inspect(): string;
}
export namespace Long {
    let TWO_PWR_24: any;
    let MAX_UNSIGNED_VALUE: Long;
    let ZERO: any;
    let UZERO: any;
    let ONE: any;
    let UONE: any;
    let NEG_ONE: any;
    let MAX_VALUE: Long;
    let MIN_VALUE: Long;
}
export class MaxKey extends BSONValue {
    static fromExtendedJSON(): MaxKey;
    get _bsontype(): string;
    toExtendedJSON(): {
        $maxKey: number;
    };
    inspect(): string;
}
export class MinKey extends BSONValue {
    static fromExtendedJSON(): MinKey;
    get _bsontype(): string;
    toExtendedJSON(): {
        $minKey: number;
    };
    inspect(): string;
}
export class ObjectId extends BSONValue {
    static getInc(): number;
    static generate(time: any): any;
    static createPk(): ObjectId;
    static createFromTime(time: any): ObjectId;
    static createFromHexString(hexString: any): ObjectId;
    static isValid(id: any): boolean;
    static fromExtendedJSON(doc: any): ObjectId;
    constructor(inputId: any);
    get _bsontype(): string;
    __id: any;
    set id(value: any);
    get id(): any;
    toHexString(): any;
    toString(encoding: any): any;
    toJSON(): any;
    equals(otherId: any): any;
    getTimestamp(): Date;
    toExtendedJSON(): {
        $oid: any;
    };
    inspect(): string;
    [kId]: any;
}
export namespace ObjectId {
    let index: number;
}
export class Timestamp extends Long {
    static fromInt(value: any): Timestamp;
    static fromNumber(value: any): Timestamp;
    static fromBits(lowBits: any, highBits: any): Timestamp;
    static fromString(str: any, optRadix: any): Timestamp;
    static fromExtendedJSON(doc: any): Timestamp;
    constructor(low: any);
    toJSON(): {
        $timestamp: any;
    };
    toExtendedJSON(): {
        $timestamp: {
            t: number;
            i: number;
        };
    };
}
export namespace Timestamp {
    import MAX_VALUE_1 = Long.MAX_UNSIGNED_VALUE;
    export { MAX_VALUE_1 as MAX_VALUE };
}
export class UUID extends Binary {
    static generate(): any;
    static isValid(input: any): boolean;
    static createFromHexString(hexString: any): UUID;
    constructor(input: any);
    __id: any;
    set id(value: any);
    get id(): any;
    toHexString(includeDashes?: boolean): any;
    equals(otherId: any): any;
    toBinary(): Binary;
}
export function calculateObjectSize(object: any, options?: {}): number;
export function deserialize(buffer: any, options?: {}): {};
export function deserializeStream(data: any, startIndex: any, numberOfDocuments: any, documents: any, docStartIndex: any, options: any): any;
export function serialize(object: any, options?: {}): any;
export function serializeWithBufferAndIndex(object: any, finalBuffer: any, options?: {}): number;
export function setInternalBufferSize(size: any): void;
declare const kId: unique symbol;
export { bson as BSON };
