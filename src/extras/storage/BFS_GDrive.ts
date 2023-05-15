
import { fs, fsInited, initFS } from "./BFSUtils";

declare var window;



export class GDrive {
    //------------------------
    //-GOOGLE DRIVE FUNCTIONS-
    //------------------------
    
    google = (window as any).google;
    gapi = (window as any).gapi;
    tokenClient = (window as any).tokenClient;
    gapiInited = this.gapi !== undefined;
    gsiInited = this.google !== undefined;
    isLoggedIn = false;

    directory = "Graphscript"
    fs = fs;

    constructor(apiKey?, googleClientId?) {
        if(apiKey && googleClientId)
            this.initGapi(apiKey, googleClientId);
    }

    //this is deprecated now?: https://developers.google.com/identity/gsi/web/guides/overview
    initGapi = async (
        apiKey:string, 
        googleClientID:string
    ) => {
        
        return new Promise(async (resolve,rej) => {
        
            //console.log('initializing gapi');

            const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
            const SCOPES = 'https://www.googleapis.com/auth/drive';
            this.gapiInited = false;
            this.gsiInited = false;
    
    
            await Promise.all(
                [new Promise((res) => {
                    const initializeGapiClient = async () => {
                        await this.gapi.client.init({
                            apiKey: apiKey,
                            discoveryDocs: [DISCOVERY_DOC],
                        });
                        this.gapiInited = true;
                        //console.log('gapi', window.gapi);
                    }
                
                    const gapiLoaded = () => {
                        this.gapi = window.gapi;
                        this.gapi.load('client', initializeGapiClient);
                    }

                    const script1 = document.createElement('script');
                    script1.type = "text/javascript";
                    script1.src = "https://apis.google.com/js/api.js";
                    script1.async = true;
                    script1.defer = true;
                    script1.onload = gapiLoaded;
                    document.head.appendChild(script1);

                }),
                new Promise((res) => {
            
                    const gsiLoaded =() => {
                        this.google = window.google;
                        this.tokenClient = this.google.accounts.oauth2.initTokenClient({
                          client_id: googleClientID,
                          scope: SCOPES,
                          callback: '', // defined later
                        });
                        this.gsiInited = true;
                        //console.log('google', window.google)
                        res(true);
                    }
            
                    const script2 = document.createElement('script');
                    script2.type = "text/javascript";
                    script2.src = "https://accounts.google.com/gsi/client";
                    script2.async = true;
                    script2.defer = true;
                    script2.onload = gsiLoaded;
                    document.head.appendChild(script2);
        
                })
            ]);

            resolve(true);

            // function updateSigninStatus(isSignedIn) {
            //     if (isSignedIn) {
            //         console.log("Signed in with Google.")
            //     } else {
            //         console.log("Signed out of Google")
            //     }
            // }
    
        })
        
    }

    handleUserSignIn = () => {
        return new Promise(async (res,rej) => {
            if(!this.tokenClient) {
                console.error('Google API not found');
                return;
            }
            
            this.tokenClient.callback = async (resp) => {
                if (resp.error !== undefined) {
                    rej(resp);
                }
                this.isLoggedIn = true;
                res(resp);
            };
    
            if (this.gapi.client.getToken() === null) {
                // Prompt the user to select a Google Account and ask for consent to share their data
                // when establishing a new session.
                this.tokenClient.requestAccessToken({prompt: 'consent'});
            } else {
                // Skip display of account chooser and consent dialog for an existing session.
                this.tokenClient.requestAccessToken({prompt: ''});
            }
        });
    }

    checkFolder = (
        name=this.directory,
        onResponse=(result)=>{}
    ) => {
        return new Promise((res,rej) => {

            this.gapi.client.drive.files.list({
                q:"name='"+name+"' and mimeType='application/vnd.google-apps.folder'",
            }).then((response) => {
                if(response.result.files.length === 0) {
                    this.createDriveFolder();
                    if(onResponse) onResponse(response.result);
                    res(response.result as any);
                }
                else if(onResponse) onResponse(response.result);
                res(response.result as any);
            });
        })
    }

    createDriveFolder = (
        name=this.directory
    ) => {
        return new Promise((res,rej) => {
            if(this.isLoggedIn) {
                let data = new Object() as any;
                data.name = name;
                data.mimeType = "application/vnd.google-apps.folder";
                this.gapi.client.drive.files.create({'resource': data}).then((response)=>{
                    console.log("Created Folder:",response.result);
                    res(response.result as any);
                });
            } else {
                console.error("Sign in with Google first!");
                this.handleUserSignIn().then(async () => {
                    if(this.isLoggedIn) {
                        res(await this.createDriveFolder(name)); //rerun
                    }
                });
            }
        });
    }

    //backup file to drive by name (requires gapi authorization)
    backupToDrive = (
        bfsPath:string,
        bfsDir='data',
        mimeType='application/vnd.google-apps.spreadsheet'
    ) => {
        return new Promise(async (res,rej) => {
            if(!fsInited) await initFS(['data']);
            if(this.isLoggedIn){
                fs.readFile(bfsDir+'/'+bfsPath, (e,output)=>{
                    if(e) throw e; if(!output) return;
                    let file = new Blob([output.toString()],{type:'text/csv'});
                    this.checkFolder(this.directory, (result)=>{
                        console.log(result);
                        let metadata = {
                            'name':bfsPath,
                            'mimeType':mimeType,
                            'parents':[result.files[0].id]
                        }
                        let token = this.gapi.auth.getToken().access_token;
                        var form = new FormData();
                        form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
                        form.append('file', file);
    
                        var xhr = new XMLHttpRequest();
                        xhr.open('post', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id');
                        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                        xhr.responseType = 'json';
                        xhr.onload = () => {
                            console.log("Uploaded file id: ",xhr.response.id); // Retrieve uploaded file ID.
                            //this.listDriveFiles();
                            res(true);
                        };
                        xhr.send(form);
                    });   
                });
            } else {
                console.error("Sign in with Google first!");
                this.handleUserSignIn().then(async () => {
                    if(this.isLoggedIn) {
                        res(await this.backupToDrive(bfsPath)); //rerun
                    }
                });
                
            }
        });
        
    }

    listDriveFiles = (
        driveDirectory=this.directory,
        pageSize=100,
        onload?:(files)=>{}
    ) => {
        return new Promise((res,rej) => {
            if(this.isLoggedIn) {
                this.checkFolder(driveDirectory, (result)=> {
                    this.gapi.client.drive.files.list({
                        q: `'${result.files[0].id}' in parents`,
                        'pageSize': pageSize,
                        'fields': "nextPageToken, files(id, name)"
                    }).then((response) => {
                        //document.getElementById(this.props.id+'drivefiles').innerHTML = ``;
                        //this.appendContent('Drive Files (Brainsatplay_Data folder):','drivefiles');
                        var files = response.result.files;
                        if (files && files.length > 0) {
                            if(onload) onload(files);
                            res(files);
                            // for (var i = 0; i < files.length; i++) {
                            //     var file = files[i];
                            //     document.getElementById(listDivId).insertAdjacentHTML('beforeend',`<div id=${file.id} style='border: 1px solid white;'>${file.name}<button id='${file.id}dload'>Download</button></div>`);
                            //     document.getElementById(file.id+'dload').onclick = () => {
                                    
                            //         //Get CSV data from drive
                            //         var request = this.gapi.client.drive.files.export({'fileId': file.id, 'mimeType':'text/csv'});
                            //         request.then((resp) => {
                            //             let filename = file.name;
                            //             fs.appendFile('/data/'+filename,resp.body,(e)=>{
                            //                 if(e) throw e;
                            //                 ondownload(resp.body);
                            //             });
                            //         });
                            //     }
                            // }
                        } else {
                            res(undefined);//this.appendContent('<p>No files found.</p>','drivefiles');
                        }
                    });
                });
            } else {
                console.error("Sign in with Google first!");
                this.handleUserSignIn().then(async () => {
                    if(this.isLoggedIn) {
                        res(await this.listDriveFiles(
                            driveDirectory,
                            pageSize,
                            onload //rerun
                        ))
                    }
                });
            } 
        });
    }

    //pass a queried drive folder (i.e. from listDriveFiles)
    driveToBFS = (
        file:{id:string, name:string, [key:string]:any}, //you need the file id from gdrive
        bfsDir='data',
        ondownload=(body)=>{},
        mimeType='text/csv'
    ) => {
        return new Promise((res,rej) => {
            if(this.isLoggedIn) {
                var request = this.gapi.client.drive.files.export({'fileId': file.id, 'mimeType':mimeType});
                request.then(async (resp) => {
                    let filename = file.name;
                    if(!fsInited) await initFS(['data']);
                    fs.appendFile(
                        '/'+bfsDir+'/'+filename,
                        resp.body,
                        (e)=>{
                        if(e) throw e;
                        ondownload(resp.body);
                        res(resp.body);
                    });
                });
            } else {
                console.error("Sign in with Google first!");
                this.handleUserSignIn().then(async () => {
                    if(this.isLoggedIn) {
                        res(await this.driveToBFS(
                            file,
                            bfsDir, //rerun
                            ondownload
                        ))
                    }
                });
            }
            
        });
    }
}


export const GDriveRoutes = new GDrive(); //need to call init(apiKey,clientId);