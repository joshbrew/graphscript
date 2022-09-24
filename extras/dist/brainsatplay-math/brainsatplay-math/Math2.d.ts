/**
 * Math2 Contains All Static Methods, these get assigned without conflict to the Math object as well when you import this script
 * We'll add more useful static things like filter kernels etc. as we get to making them.
 *
 * //Just type these and the variable inputs that pop up should be easy to follow. Everything is commented otherwise till we document it
 * genSineWave() //generate a sine wave
 * getSineAmplitude() //get amplitude of a sine at time t
 * mean() //array mean
 * mode() //array mode
 * std() //standard dev
 * relError() //relative error
 * informationEntropy() //trying to build a maxent distribution off of this stuff
 * zscore() //array z score
 * variance() //variance
 * dot() //dot product
 * cross3D() //3d cross product
 * magnitude() //vector magnitude
 * distance() //distance function p1-p2
 * normalize() //vector normalization
 * normalizeSeries() //clamp array values between 0 or -1 and 1 using max and min
 * newtonsMethod() //root approximation
 * integral() //1d integral
 * dintegral() //2d integral
 * tintegral() //3d integral
 * pintegral() //2d path integral
 * makeVec([1,2,3],[3,4,5]) //subtract two points to make a vector
 * getBufferedValueByCoordinates() //provide a buffered 1D matrix/vertex buffer, any dimensions, and the coordinates and optionally the cardinal you want to extract. Can get the whole vector by coordinate or single value.
 * mapBufferedMat(buffer=[0,1,2,3...],dimensions=[x,y,...],asIndex:(v,i,x,y..)=>{}|[(v,i,x,y..)=>{},(v,i,x,y...)=>{}]) //iterate an array buffer with the matrix coordinates of each buffer, use the asIndex function to run operations on that coordinate, or an array of functions e.g. to specify rgb color or xyz axis specific operators, returns a new array buffer.
 * combinations(choices,vecsize); //create array of vectors of set size containing every combination from a given array of choices
 * generateCoordinateSpace(upperBounds=[10,10,10],lowerBounds=[-10,-10,-10],stepSizes=[1,1,1]) //generate a coordinate space between the upper and lower bounds, with each dimension having its own step size specifiable as a number or function, e.g. one function could be a time increment on its own interval and the rest are cartesian coordinates
 * meshgrid(upperBounds=[10,10,10],lowerBounds=[-10,-10,-10],stepSizes=[1,1,1]) //same as generateCoordinateSpace but named after the common python/matlab function
 * calcVectorField(generateCoordinateSpace(),formula=(...vec)=>{return vec.map(d => d*0.5)}) //pass a genenerated coordinate space and a formula that returns results for each vector in the coordinate space, e.g. navier stokes
 * transpose(mat) //2d mat transpose
 * matmul(a,b) //2d mat mul
 * matscale(mat,scalar) //2d mat scalar
 * matadd(a,b) //2d mat add
 * matsub(a,b)  //2d mat subtract
 * normalDistribution(samples=[], normalize=true) //create a normal (gaussian) distribution
 * expectedValue(samples=[],probabilities=this.normalDistribution(samples)) //get expected value of an array
 * originMoment(samples=[],probabilities=this.normalDistribution(samples),order=1) //statistical moment about origin
 * centralMoment(samples=[],probabilities=this.normalDistribution(samples),order=1) //statistical moment about mean
 * linearDiscriminantAnalysis(samples=[], classifier=[]) //LDA
 * conv1D(arr=[],kern=[],pad=0) //1d convolution //1d convolution
 * conv2D(mat=[[],[],[]],kern=[[],[],[]],pad=0) //2d convolution
 * cov2d(mat) //2d covariance
 * cov1d(arr1=[],arr2=[]) //1d covariance
 * cov3d(x=[],y=[],z=[]) //3d covariance
 * covNd(dimensionalData=[]) //nd covariance
 * eigens2x2(mat=[[1,2],[3,4]]) //fast 2x2 eigenvalue
 * eigenvectors2x2(mat=[[1,2],[3,4]], eigens=[1,2]) //fast 2x2 eigenvector
 * fastpca2d(xarr,yarr) //fast 2d pca
 * crosscorrelation(arr1,arr2) //crosscor
 * autocorrelation(arr1) //autocor
 * autocorrelation2d(mat2d=[[],[],...]) //2d autocorrelation
 * autocorrelation2dNormalized(mat2d=[[],[],...]) //normalized 2d autocorrelation
 * dft(arr=[]) //discrete fourier transform (slow)
 * correlograms(dat=[[],[]]) //return cross correlations of many signals
 * sma(arr=[], window) //simple moving average
 * sum(arr=[]) //array sum
 * reduceArrByFactor(arr,factor=2) //reduce array sizes
 * makeArr(startValue, stopValue, nSteps) //linspace
 * HSLtoRGB(h,s,l,scalar=255) //convert hsl to rgb, returns array
 * autoscale(array,stackedLines=1,stackPosition=0,centerZero=false)//autoscale array between -1 and 1, can be used for stacking lines e.g. in webgl
 * absmax(array) //returns the absolute value maximum of an array
 * downsample(data, fitCount, scalar=1)  //downsample array, different formula than interpolateArray
 * interpolateArray(data, fitCount, scalar=1) //or upsample(data, fitCount, scalar=1), upsampling array with spring factor
 * lerp(v0,v1,fit,floor?) //linearly interpolate (linspace) between two values with a specified fit count, can make sure all values are rounded down too.
 * isExtrema(arr,critical='peak') //peak or valley
 * isCriticalPoint(arr,critical='peak') //peak, valley
 * peakDetect = (smoothedArray,type='peak',window=49) //wider window to find less peaks
 * getPeakThreshold(arr, peakIndices, thresholdVar)
 * eigens(M=[[],[]], tolerance=0.0001, max_iterations=1000)
 * pca(mat=[[],[]],tolerance = 0.00001) //power iteration method PCA
 * eigenvalue_of_vector(mat, eigenvector)
 * power_iteration(mat, tolerance=0.00001, max_iterations=1000)
 * squared_difference(v1, v2)
 * flatten_vector(v) //column to row
 * column(mat, x) //row to column
 * circularBuffer(arr:any[],newData:any|any[]) //push new entries to end of array and roll over starting entries with a set array length
 *
 */
export class Math2 {
    static TWO_PI: number;
    static C: number;
    static G: number;
    static h: number;
    static R: number;
    static Ra: number;
    static H: number;
    static kbar: number;
    static kB: number;
    static ke: number;
    static me: number;
    static mp: number;
    static mn: number;
    static P0: number;
    static T0: number;
    static p0: number;
    static Na: number;
    static y: number;
    static M0: number;
    static g0: number;
    static Re: number;
    static B: number;
    static S: number;
    static Sigma: number;
    static imgkernels: {
        edgeDetection: number[][];
        boxBlur: number[][];
        sobelLeft: number[][];
        sobelRight: number[][];
        sobelTop: number[][];
        sobelBottom: number[][];
        identity: number[][];
        gaussian3x3: number[][];
        guassian7x7: number[][];
        emboss: number[][];
        sharpen: number[][];
    };
    static genSineWave(freq?: number, peakAmp?: number, nSec?: number, fs?: number, freq2?: number, peakAmp2?: number): number[][];
    static getSineAmplitude(frequency?: number, peakAmplitude?: number, ti?: number, tOffset?: number): number;
    static mean(arr: any): number;
    static mode(arr: any): any;
    static std(arr: any, mean?: any): number;
    static relError(actual?: any[], forecast?: any[], abs?: boolean): any[];
    static informationEntropy(probabilities?: any[]): any[];
    static zscore(arr: any): any;
    static variance(arr: any): number;
    static dot(vec1: any, vec2: any): number;
    static cross3D(vec1: any, vec2: any): number[];
    static magnitude(vec: any): number;
    static distance(point1: any, point2: any): number;
    static midpoint(point1?: number[], point2?: number[]): number[];
    static normalize(vec: any): any[];
    static normalizeSeries(arr?: any[], fromZero?: boolean): number[];
    static quadraticFormula(a: any, b: any, c: any): string[] | number[];
    static newtonsMethod(foo?: (x: any) => number, start?: number, end?: number, precision?: number, attempts?: number): any[];
    static integral: (func?: (x: any) => any, range?: any[], stepx?: number) => number;
    static dintegral: (func?: (x: any, y: any) => any, range?: any[][], stepx?: number, stepy?: number) => number;
    static tintegral: (func?: (x: any, y: any, z: any) => any, range?: any[][], stepx?: number, stepy?: number, stepz?: number) => number;
    static pintegral: (func?: (x: any) => any, range?: any[], stepx?: number) => number;
    static makeVec(point1: any, point2: any): any[];
    static getBufferedValueByCoordinates(vb?: any[], dims?: number[], coordinate?: number[], cardinal?: any): any;
    static forBufferedMat(vb?: any[], dims?: number[], asIndex?: (v: any, i: any, x: any, y: any) => any): any[];
    static mapBufferedMat(buffer?: any[], dimensions?: number[], asIndex?: (v: any, idx: any, i: any, j: any) => any): any[];
    static combinations(choices?: string[], vecsize?: number): any[][];
    static generateCoordinateSpace(upperBounds?: number[], lowerBounds?: number[], steps?: number[], mutater?: any): any[];
    static meshgrid: typeof Math2.generateCoordinateSpace;
    static calcVectorField(coordinates?: number[][], formula?: (x: any, y: any) => number[]): number[][];
    static transpose(mat: any): any;
    static matmul(a: any, b: any): any[];
    static matscale(mat: any, scalar: any): any[][];
    static matadd(a: any, b: any): any[][];
    static matsub(a: any, b: any): any[][];
    static histogram(arr?: any[], binSize?: number, nBins?: any): number[][];
    static normalDistribution(samples?: any[], normalize?: boolean, cutoff?: number): number[];
    static expectedValue(samples?: any[], probabilities?: number[]): any;
    static originMoment(samples?: any[], probabilities?: number[], order?: number): any;
    static centralMoment(samples?: any[], probabilities?: number[], order?: number): any;
    static linearDiscriminantAnalysis(samples?: any[], classifier?: any[]): number[];
    static conv1D(arr?: any[], kern?: number[], pad?: number): number[];
    static conv2D(mat?: any[][], kern?: any[][], pad?: number): any[];
    static cov2d(mat: any): any[];
    static cov1d(arr1?: any[], arr2?: any[]): any[];
    static cov3d(x?: any[], y?: any[], z?: any[]): any[][][];
    static covNd(dimensionalData?: any[]): void;
    static eigens2x2(mat?: number[][]): number[];
    static eigenvectors2x2(mat?: number[][], eigens?: number[]): number[][];
    static fastpca2d(xarr: any, yarr: any): (number[] | number[][])[];
    static crosscorrelation(arr1: any, arr2: any): any[];
    static autocorrelation(arr1: any): any[];
    static autocorrelation2d: (mat2d: any) => any[][];
    static autocorrelation2dNormalized(mat2d: any): any[][];
    static crosscorrelation2d(mat2d1: any, mat2d2: any): any[][];
    static crosscorrelation2dNormalized(mat2d1: any, mat2d2: any): any[][];
    static correlograms(dat?: any[][]): any[];
    static dft(sineWave?: any[]): {
        real: number[];
        imag: number[];
        freqs: number[];
        mags: any[];
    };
    static sma(arr: any[], window: any): any[];
    static sum(arr?: any[]): any;
    static reduceArrByFactor(arr: any, factor?: number): any;
    static makeArr(startValue: any, stopValue: any, nSteps: any): any[];
    static lerp: typeof Math2.makeArr;
    static autoscale(array: any, stackedLines?: number, stackPosition?: number, centerZero?: boolean): any;
    static absmax(array: any): number;
    static downsample(array: any, fitCount: any, scalar?: number): any;
    static interpolateArray(data: any, fitCount: any, scalar?: number): any[];
    static upsample: typeof Math2.interpolateArray;
    static isExtrema(arr: any, critical?: string): boolean;
    static isCriticalPoint(arr: any, critical?: string): boolean;
    static peakDetect: (smoothedArray: any, type?: string, window?: number) => number[];
    static getPeakThreshold(arr: any, peakIndices: any, thresholdVar: any): number;
    static column(mat: any, x: any): any[][];
    static flatten_vector(v: any): any[];
    static squared_difference(v1: any, v2: any): number;
    static shift_deflate(mat: any, eigenvalue: any, eigenvector: any): any[][];
    static eigenvalue_of_vector(mat: any, eigenvector: any): any;
    static power_iteration(mat: any, tolerance?: number, max_iterations?: number): any[];
    static eigens(mat: any, tolerance?: number, max_iterations?: number): any[][];
    static pca(mat: any, tolerance?: number): any[];
    static circularBuffer(arr: any, newEntries: any): any;
    static HSLToRGB(h: any, s: any, l: any, scalar?: number): number[];
    static p300(event_timestamps?: any[], raw_signal?: any[], signal_timestamps?: any[], sps?: number): any[];
}
