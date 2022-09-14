import { appendFile, deleteFile, exists, getCSVHeader, listFiles, readCSVChunkFromDB, writeFile, writeToCSVFromDB } from './BFSUtils.js';
import { CSV, parseCSVData, toISOLocal } from './csv.js';
//We have object formats coming in like {x,y,z}, tied to devices with USB data or BLE data with specifiers 

//so we should ned up with a CSV that has one header for device info, one header for the actual column tops,
//  then it should dynamically append whatever data/devices we feed it and handle general timestamping for us
//temp
function lerp(v0, v1, t) {
    return ((1 - t) * v0) + (t * v1);
}

function interpolerp(v0,v1,fit, floor=true) {
    if(fit <= 2) return [v0, v1];
    let a = 1/fit;
    let result = new Array(fit);
    result[0] = v0;
    for(let i = 1; i <= fit; i++) {
        result[i] = lerp(v0,v1,a*i);
        if(floor) result[i] = Math.floor(result[i]);
    }
    return result;
}


//in our case we are receiving data in a uniform format 
export const appendCSV = (
    newData, //assume uniformly sized data is passed in, so pass separate timestamp intervals separately
    filename,
    header
) => {

    //console.log('append',filename);

    let csv = CSV_REFERENCE[filename];
    if(!csv) {
        let keys = Array.from(Object.keys(newData)); if (keys.indexOf('timestamp') > -1) keys.splice(keys.indexOf('timestamp'), 1);
        CSV_REFERENCE[filename] = {
            header:header ? header : ['timestamp','localized',...keys] ,
            lastX:undefined
        };
        csv = CSV_REFERENCE[filename];
        header = csv.header;
    }
    if(header) csv.header = header; //set a new header? File needs to be rewritten if so, but this works if you make a new file (just change the input file name)

    
    let maxLen = 1; //max length of new arrays being appended, if any
    for(const key in newData) {
        if(csv.header.indexOf(key) > -1 && (newData[key])?.length > maxLen) {
            maxLen = (newData[key])?.length;
        } 
    }
    

    let x = newData[csv.header[0]]; //first csv value treated as x for reference for growing the csv, mainly to generate timestamps if being used but not defined
    if(csv.lastX === undefined) csv.lastX = Array.isArray(x) ? x[0] : x;
    if(!x) {
        if(csv.header[0].includes('time')) {
            let now = Date.now();
            if(maxLen === 1) x = Date.now();
            else {
                x = interpolerp(csv.lastX,now,maxLen); //we are gonna upsample x to the maximum size array that's been passed in
                x.shift();
            }
        } else {
            let newX = csv.lastX+1; //just an assumption to spit something into the x column
            if(maxLen > 1) {
                x = new Array(maxLen).fill('');
                x[maxLen-1] = newX;
            }
            else x = newX;
        }
    } else if (maxLen > 1 && (x)?.length !== maxLen) {
        if(!Array.isArray(x) || x.length === 1) {
            x = interpolerp(csv.lastX,x,maxLen); //we are gonna upsample x to the maximum size array that's been passed in
            x.shift();
        } else {
            x = interpolerp(x[0],x[x.length-1],maxLen); //upsample using new timestamps 
            x.shift();
        }
    }

    let toAppend = [];

    if(Array.isArray(x)) {
        let curIdcs = {};
        for(let i = 0; i < x.length; i++) {
            toAppend.push([]);
            for(let j = 0; j < csv.header.length; j++) {
                let d = newData[csv.header[j]];
                if(j === 0) {
                    toAppend[i][0] = x[i];
                    continue;
                }
                
                if (csv.header[j] === 'localized') { toAppend[i][j] = toISOLocal(x[i]); }
                else if(d === undefined) {
                    toAppend[i][j] = '';
                } else if (Array.isArray(d)) {
                    if(d.length === x.length) toAppend[i][j] = d[i];
                    else {
                        if(!(csv.header[j] in curIdcs)) {
                            curIdcs[csv.header[j]] = i;
                            if(d.length !== 1) toAppend[i][j] = d[i]; //0
                        } else {
                            if(d.length === 1 && i === x.length-1) {
                                toAppend[i][j] = d[curIdcs[csv.header[j]]];
                            } else if(Math.floor(d.length * i/x.length) > curIdcs[csv.header[j]]) {
                                curIdcs[csv.header[j]]++;
                                toAppend[i][j] = d[curIdcs[csv.header[j]]];
                            } else {
                                toAppend[i][j] = ''; //include a blank to preserve the header order
                            }
                        } 
                    }   
                } else {
                    if(i === x.length-1) {
                        toAppend[i][j] = d;
                    } else {
                        toAppend[i][j] = '';
                    }
                }
            }
        }
    } else {
        toAppend.push([]);
        for(let j = 0; j < csv.header.length; j++) {
            if((csv.header[j] in newData)) toAppend[0][j] = newData[csv.header[j]];
            else if (csv.header[j] === 'localized') { toAppend[0][j] === toISOLocal(x); }
            else toAppend[0][j] = '';
        }
    }


    let csvProcessed = '';

    if(header) csvProcessed += header.join(',') + '\n'; //append new headers when they show up
    toAppend.forEach((arr) => {
        csvProcessed += arr.join(',') + '\n';    
    });

    csv.lastX = toAppend[toAppend.length-1][0]; //reference the last array written as the latest data for if we don't pass timestamps

    //okay we are ready to append arrays to the file
    return new Promise((res,rej) => {
        exists(filename).then((fileExists) => {
            if(!fileExists) {
                writeFile(
                    filename,
                    csvProcessed,
                    (written) => {
                        res(written);
                    }
                );
            } else {
                appendFile(
                    filename, 
                    csvProcessed, 
                    (written) => {
                        res(written);
                    }
                );
            }
        });
    })
}

//todo: rewrite saved file with the new header (which requires fully rewriting a file chunk to shift the bytes in IndexedDB)
export const updateCSVHeader = (header,filename) => {
    if(CSV_REFERENCE[filename]) {
        CSV_REFERENCE[filename].header = header;
    }
}

export const createCSV = (
    filename,
    header
) => {
    if(header[0].toLowerCase().includes('time') || header[0].toLowerCase().includes('unix')) {
        header.splice(1,0,'localized') //toISOLocal
    }

    CSV_REFERENCE[filename] = {
        header,
        lastX:header[1] === 'localized' ? Date.now() : 0
    };

    //overwrite existing files
    return new Promise((res,rej) => {
        writeFile(
            filename,
            CSV_REFERENCE[filename].header.join(',')+'\n',
            (written) => {
                res(written);
            }
        ).catch(rej);
    });

}


//returns a basic html needed to visualize directory contents 
export const visualizeDirectory = (dir, parentNode=document.body) => {
   return new Promise(async (res,rej) => {
        if(parentNode.querySelector('#bfs' + dir))  parentNode.removeChild(parentNode.querySelector('#bfs' + dir));
        parentNode.insertAdjacentHTML('beforeend',`<div id='bfs${dir}' class='bfs${dir}'></div>`);
        let div = parentNode.querySelector('#bfs'+dir);
        await listFiles(dir).then((directory) => {
            //returns an array of directory listings
            if(directory.length === 0) div.innerHTML = 'No Files!';
            else directory.forEach((listing) => {
                div?.insertAdjacentHTML(
                    'beforeend',
                    `<div id='${listing}' class='bfsfilediv'>
                        <span class='bfsfiletitle'>Data: </span>
                        <span>${listing}</span>
                        ${listing.toLowerCase().endsWith('csv') ? `<button class='bfsdownloadbtn' id='download${listing}'>Download CSV</button>` : ``}
                        ${listing.indexOf('.') > -1 ? `<button class='bfsdeletebtn' id='delete${listing}'>Delete</button>` : ''}
                    </div>`
                );

                if(document.getElementById(`delete${listing}`)) {
                    (document.getElementById(`delete${listing}`)).onclick = () => {
                        deleteFile(dir+'/'+listing, ()=>{
                            visualizeDirectory(dir,parentNode); //reload 
                        });
                    }
                }

                if(document.getElementById(`download${listing}`)) {
                    (document.getElementById(`download${listing}`)).onclick = () => {
                        writeToCSVFromDB(dir+'/'+listing,10); //will save data in chunks if exceeding maximum limit (for speed, else the screen locks)
                    }
                }
            })
            res(directory);
        }).catch(rej)

   });
}

export const csvRoutes = {
    appendCSV,
    updateCSVHeader,
    createCSV,
    visualizeDirectory,
    openCSV:CSV.openCSV,
    saveCSV:CSV.saveCSV,
    openCSVRaw:CSV.openCSVRaw,
    parseCSVData,
    getCSVHeader,
    writeToCSVFromDB,
    readCSVChunkFromDB,
    toISOLocal
}