
const config = {
    bundler: { //esbuild settings, set false to skip build step or add bundle:true to config object to only bundle (alt methods)
        entryPoints: [ //entry point file(s). These can include .js, .mjs, .ts, .jsx, .tsx, or other javascript files. Make sure your entry point is a ts file if you want to generate types
            "index"
        ],
        outfile: "dist/index", //exit point file, will append .js as well as indicators like .esm.js, .node.js for other build flags
        //outdir:[]               //exit point files, define for multiple bundle files
        bundleBrowser: true, //create plain js build? Can include globals and init scripts
        bundleESM: true, //create esm module js files
        bundleTypes: true, //create .d.ts files, the entry point must be a typescript file! (ts, tsx, etc)
        bundleNode: false, //create node platform plain js build, specify platform:'node' to do the rest of the files 
        bundleHTML: false, //wrap the first entry point file as a plain js script in a boilerplate html file, frontend scripts can be run standalone like a .exe! Server serves this as start page if set to true.
        minify: true,
        sourcemap: false,
        globalThis: 'graphscript'  
     },
    server: false
}

export default config; 