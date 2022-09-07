import { Math2 } from 'brainsatplay-math';
import { appendFile, deleteFile, exists, getCSVHeader, listFiles, readCSVChunkFromDB, writeFile, writeToCSVFromDB } from './BFSUtils';
import { CSV, parseCSVData, toISOLocal } from './csv';
//We have object formats coming in like {x,y,z}, tied to devices with USB data or BLE data with specifiers 

//so we should ned up with a CSV that has one header for device info, one header for the actual column tops,
//  then it should dynamically append whatever data/devices we feed it and handle general timestamping for us
//temp
const CSV_REFERENCE:{
    [filename:string]:{ //key is filename
        header:string[],
        latest:any[], //latest line, unjoined
    }
} = {}

//in our case we are receiving data in a uniform format 
export const appendCSV = (
    newData:{[key:string]:number|number[]}, //assume uniformly sized data is passed in, so pass separate timestamp intervals separately
    filename:string
) => {

    //console.log('append',filename);

    let csv = CSV_REFERENCE[filename];
    if(!csv) {
        CSV_REFERENCE[filename] = {
            header:['timestamp','localized',...Array.from(Object.keys(newData))] as string[],
            latest:[] as any[]
        };
        csv = CSV_REFERENCE[filename];
    }

    
    let toAppend = [] as any;
    let x = newData[csv.header[0]]; //
    let keys = Object.keys(newData);
    if(!x) {
        x = newData[keys[0]];
        let lastTime;
        if(
            csv.header[0]?.toLowerCase().includes('time') || 
            csv.header[0]?.toLowerCase().includes('unix')
        ) {
            if(Array.isArray(x)) {
                toAppend = x.map((v) => toAppend.push([]));
                lastTime = csv.latest[0];
                if(!lastTime) {
                    lastTime = Date.now();            
                    toAppend[toAppend.length-1][0] = lastTime;
                    toAppend[toAppend.length-1][1] = toISOLocal(lastTime);
                } else {
                    let nextTime = Date.now();
                    let interp = Math2.upsample([lastTime,nextTime],x.length);
                    let iso = interp.map((v) => toISOLocal(v));
                    toAppend.map((a,i) => { a[0] = interp[i]; a[1] = iso[i];  });
                }
            } else {
                let now = Date.now();
                toAppend.push([now,toISOLocal(now)])
            }
        }
        else {
            if(Array.isArray(x)) {
                toAppend = x.map((v) => toAppend.push([v]));
            } else {
                toAppend.push([x]);
            }
        }
    } else {
        if(Array.isArray(x)) {
            if(
                csv.header[0]?.toLowerCase().includes('time') || 
                csv.header[0]?.toLowerCase().includes('unix')
            ) {
                if(Array.isArray(x)) {
                    toAppend = x.map((v) => toAppend.push([]));
                    toAppend.map((a,i) => { a[0] = x[i]; a[1] = toISOLocal(x[i]);  });
                } else {
                    toAppend.push([x,toISOLocal(x)])
                }
            }
        } else {
            if(
                csv.header[0]?.toLowerCase().includes('time') || 
                csv.header[0]?.toLowerCase().includes('unix')
            ) {
                toAppend.push([x,toISOLocal(x)]);
            } else {
                toAppend.push([x]);
            }
        }
    }

    //we've assembled the new arrays to append and included the first index
    for(let i = 1; i < csv.header.length; i++) {
        if(csv.header[i] === 'localized') continue;
        if(newData[csv.header[i]]) {
            if(Array.isArray(newData[csv.header[i]])) {
                toAppend.map((arr,j) => arr[i] = newData[csv.header[i]][j]);
            }
        } else {
            toAppend[0][i] = newData[csv.header[i]];
        }
    } 

    let csvProcessed = '';
    toAppend.forEach((arr) => {
        csvProcessed += arr.join(',') + '\n';    
    })

    csv.latest = toAppend[toAppend.length-1]; //reference the last array written as the latest data for if we don't pass timestamps

    //okay we are ready to append arrays to the file
    return new Promise((res,rej) => {
        exists(filename).then((fileExists) => {
            if(!fileExists) {
                writeFile(
                    filename,
                    csv.header.join(',')+'\n' + csvProcessed,
                    (written:boolean) => {
                        res(written);
                    }
                );
            } else {
                appendFile(
                    filename, 
                    csvProcessed, 
                    (written:boolean) => {
                        res(written);
                    }
                );
            }
        });
    }) as Promise<boolean>
}

export const updateCSVHeader = (header:any[],filename:string) => {
    if(CSV_REFERENCE[filename]) {
        CSV_REFERENCE[filename].header = header;
    }
}

export const createCSV = (
    filename:string,
    header:string[]
) => {
    if(header[0].toLowerCase().includes('time') || header[0].toLowerCase().includes('unix')) {
        header.splice(1,0,'localized') //toISOLocal
    }

    CSV_REFERENCE[filename] = {
        header,
        latest:[] as any
    };

    //overwrite existing files
    return new Promise((res,rej) => {
        writeFile(
            filename,
            CSV_REFERENCE[filename].header.join(',')+'\n',
            (written:boolean) => {
                res(written);
            }
        ).catch(rej);
    });

}


//returns a basic html needed to visualize directory contents 
export const visualizeDirectory = (dir:string, parentNode=document.body) => {
   return new Promise(async (res,rej) => {
        if(parentNode.querySelector('#bfs' + dir))  parentNode.removeChild(parentNode.querySelector('#bfs' + dir) as Element);
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
                    (document.getElementById(`delete${listing}`) as HTMLButtonElement).onclick = () => {
                        deleteFile(dir+'/'+listing, ()=>{
                            visualizeDirectory(dir,parentNode); //reload 
                        });
                    }
                }

                if(document.getElementById(`download${listing}`)) {
                    (document.getElementById(`download${listing}`) as HTMLButtonElement).onclick = () => {
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