
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
    previousPageTokens = [] as any[];
    nextPageToken: any; previousPageToken:any; currentFolderId;
    container:any;

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

    async listFolders(directory = this.directory, parent='parents') {
        try {
          const response = await this.gapi.client.drive.files.list({
            q: `'${directory}' in ${parent} and mimeType='application/vnd.google-apps.folder'`,
            fields: 'nextPageToken, files(id, name, mimeType)'
          });
          return response.result.files || [];
        } catch (error) {
          console.error('Error listing folders:', error);
          throw error;
        }
    }
      

    async getFileMetadata(fileId) {
        try {
          const response = await this.gapi.client.drive.files.get({
            fileId,
            fields: 'id, name, mimeType, parents',
          });
          return response.result;
        } catch (error) {
          console.error('Error getting file metadata:', error);
          throw error;
        }
    }

    async getFolderId(folderName, parentFolder = 'root') {
        try {
          const query = `mimeType='application/vnd.google-apps.folder' and name='${folderName}' ${parentFolder ? `and '${parentFolder}' ` : ``}in parents and trashed=false`;
          const response = await this.gapi.client.drive.files.list({
            q: query,
            fields: 'files(id, name)',
            pageSize: 1
          });
      
          const folder = response.result.files && response.result.files[0];
          if (folder) {
            return folder.id;
          } else {
            console.error('Folder not found');
            return null;
          }
        } catch (error) {
          console.error('Error getting folder ID:', error);
          throw error;
        }
      }

    async downloadFile(fileId, mimeType) {
        try {
          const response = await this.gapi.client.drive.files.get({
            fileId,
            alt: 'media'
          }, { responseType: 'blob' });
      
          const blob = new Blob([response.body], { type: mimeType });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'downloaded_file';
          //document.body.appendChild(link);
          link.click();
          //document.body.removeChild(link);
        } catch (error) {
          console.error('Error downloading file:', error);
          throw error;
        }
    }

    async uploadFileToGoogleDrive(
        data:Blob|string='a,b,c,1,2,3\nd,e,f,4,5,6\n', 
        fileName=`${new Date().toISOString()}.csv`, 
        mimeType='application/vnd.google-apps.spreadsheet', 
        directory=this.directory, 
        onProgress:((this: XMLHttpRequest, ev: ProgressEvent<EventTarget>) => any) | null
    ) {

        if (typeof data === 'string') {
            const type = fileName.endsWith('.csv') ? 'text/csv' : 'text/plain';
            data = new Blob([data], { type });
        }

        const metadata = {
          'name': fileName,
          'mimeType': mimeType,
          'parents': [directory], // upload to the current directory
        };
    
        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        form.append('file', data);
    
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');
    
        const token = this.gapi.auth.getToken().access_token;
        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
    
        xhr.upload.onprogress = onProgress;
    
        return new Promise((resolve, reject) => {
          xhr.onload = () => {
            if (xhr.status === 200) {
              resolve(JSON.parse(xhr.responseText));
            } else {
              reject(xhr.responseText);
            }
          };
          xhr.onerror = () => reject(xhr.statusText);
          xhr.send(form);
        });
    }
      
    // Add this method to your GDrive class
    async uploadFiles(
        files:{name:string,mimeType:string,data:Blob|string}[], 
        directory=this.directory,
        uploadProgress:HTMLProgressElement|string,
        defaultBrowser=false
    ) {
        if(typeof uploadProgress === 'string') uploadProgress = document.getElementById('upload-progress') as HTMLProgressElement;
        if(uploadProgress) uploadProgress.style.display = 'block';
      
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          try {
            await this.uploadFileToGoogleDrive(
                file.data, 
                file.name, 
                file.mimeType, 
                directory, 
                (progressEvent) => {
                    const progress = (progressEvent.loaded / progressEvent.total) * 100;
                    (uploadProgress as HTMLProgressElement).value = progress;
                }
            );
            if(uploadProgress) uploadProgress.value = 0; // Reset the progress bar after each file is uploaded
          } catch (error) {
            console.error('Error uploading file:', (file as any).name, error);
          }
        }
      
        if(uploadProgress) uploadProgress.style.display = 'none'; // Hide the progress bar after all files are uploaded
        if(defaultBrowser) this.updateFileList(directory, this.nextPageToken, undefined, this.container); // Refresh the file list to show the newly uploaded files
    }

    
    async listDriveFiles(
        folderId = this.directory, 
        pageSize = 100, 
        onload?:(files)=>{}, 
        pageToken = null, 
        parentFolder?:string
    ) {
        
        if(this.isLoggedIn) {
            try {
                const response = await this.gapi.client.drive.files.list({
                    q: `'${folderId}' ${parentFolder ? `and '${parentFolder}' ` : ``}in parents and trashed=false`,
                    pageSize,
                    fields: 'nextPageToken, files(id, name, mimeType)',
                    pageToken,
                });
                
                if (response.result?.files && response.result.files.length > 0) {
                    if(onload) onload(response.result.files);
                }

                return {
                    files: response.result.files,
                    nextPageToken: response.result.nextPageToken,
                };

            } catch (error) {
                console.error('Error listing Drive files:', error);
                throw error;
            }
        
        } else {
            console.error("Sign in with Google first!");
            this.handleUserSignIn().then(async () => {
                if(this.isLoggedIn) {
                    return await this.listDriveFiles(
                        folderId,
                        pageSize,
                        onload, //rerun
                        pageToken,
                        parentFolder
                    )
                }
            });
        } 
    }

    createFileBrowser(
        container, 
        folderId=this.directory, 
        nextPageToken=this.nextPageToken, 
        parentFolder
    ) {
        if (typeof container === 'string') {
          container = document.getElementById(container);
        }
    
        if (!container) {
          console.error('Container element not found');
          return;
        }
        this.container = container;
        container.innerHTML = `<div id="file-browser">
            <div id="file-upload">
                <button id="upload-button">Upload Files</button>
                <input type="file" id="file-input" multiple style="display:none"/>
            </div>
            <div id="drop-zone">Drop files here to upload</div>
            <progress id="upload-progress" max="100" value="0" style="width:100%; display:none;"></progress>
            <div id="folder-path"></div>
            <div id="file-list"></div>
            <button id="previous-page" style="display:none">Previous</button>
            <button id="next-page" style="display:none">Next</button>
        </div>`;
    
        this.updateFileList(folderId, nextPageToken, parentFolder, container); // Initially load the root directory
        this.setupDragAndDrop(folderId, nextPageToken, parentFolder, container);
        this.setupUploadButton(folderId, nextPageToken, parentFolder, container);
        this.setupPaginationButtons(folderId, parentFolder, container);
    }

    setupUploadButton(folderId, nextPageToken, parentFolder, container) {
        const uploadButton = container.querySelector('#upload-button') as HTMLButtonElement;
        const fileInput = container.querySelector('#file-input') as HTMLInputElement;
      
        if (!uploadButton || !fileInput) {
          console.error('Upload button or file input not found');
          return;
        }
      
        uploadButton.addEventListener('click', () => {
          fileInput.click();
        });
      
        fileInput.addEventListener('change', async () => {
          const files = fileInput.files as any;
          if (files.length > 0) {
            const uploadFiles = Array.from(files).map((file:any) => ({
              name: file.name,
              mimeType: file.type,
              data: file,
            }));
      
            const uploadProgress = container.querySelector('#upload-progress') as HTMLProgressElement;
            await this.uploadFiles(uploadFiles, this.directory, uploadProgress);
            this.updateFileList(folderId, nextPageToken, parentFolder, container);
            fileInput.value = ''; // Clear the file input
          }
        });
    }

    setupDragAndDrop(currentFolderId:string, nextPageToken, parentFolder, container:HTMLElement) {
        const dropZone = container.querySelector('#drop-zone');
        if (!dropZone) {
          console.error('Drop zone element not found');
          return;
        }
      
        dropZone.addEventListener('dragover', (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropZone.classList.add('highlight');
        });
      
        dropZone.addEventListener('dragleave', (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropZone.classList.remove('highlight');
        });
      
        dropZone.addEventListener('drop', async (e:any) => {
          e.preventDefault();
          e.stopPropagation();
          dropZone.classList.remove('highlight');
      
          const files = e.dataTransfer.files;
          if (files.length > 0) {
            const uploadFiles = Array.from(files).map((file:any) => ({
              name: file.name,
              mimeType: file.type,
              data: file,
            }));
      
            const uploadProgress = container.querySelector('#upload-progress') as HTMLProgressElement;
            await this.uploadFiles(uploadFiles, this.directory, uploadProgress);
            this.updateFileList(currentFolderId, nextPageToken, parentFolder, container);
          }
        });
    }
      
    async updateFileList(currentFolderId = this.directory, pageToken = null, parentFolder, container:HTMLElement) {
        try {
            const { files, nextPageToken } = await this.listDriveFiles(currentFolderId, 100, undefined, pageToken, parentFolder) as any;
            this.renderFileList(files, currentFolderId, parentFolder, container);
            
            // Update the previous page token when navigating forward.
            if (pageToken !== null) {
            this.previousPageToken = pageToken;
            }
            // Update the next page token.
            this.nextPageToken = nextPageToken;
            // Update the visibility of the pagination buttons.
            (container.querySelector('#previous-page') as any).style.display = this.previousPageToken ? 'block' : 'none';
            (container.querySelector('#next-page') as any).style.display = this.nextPageToken ? 'block' : 'none';
        } catch (error) {
            console.error('Error updating file list:', error);
        }
    }


    renderFileList(files, currentFolderId = this.directory, parentFolder, container:HTMLElement) {
        const fileListContainer = container.querySelector('#file-list');
        const folderPathContainer = container.querySelector('#folder-path');
    
        if (!fileListContainer || !folderPathContainer) {
          console.error('File browser elements not found');
          return;
        }
    
        let html = '';
        files.forEach(file => {
          html += `<div class="file-item" data-id="${file.id}" data-mime-type="${file.mimeType}" data-name="${file.name}">
            ${file.name}
          </div>`;
        });
        fileListContainer.innerHTML = html;
    
        this.setupFileItemClick(parentFolder, container);
    
        if (currentFolderId !== this.directory) {
          folderPathContainer.innerHTML = `<button id="parent-folder">Go to Parent Folder</button>`;
          (container.querySelector('#parent-folder') as any).addEventListener('click', () => {
            this.goBackToParentFolder(container);
          });
        } else {
          folderPathContainer.innerHTML = '';
        }
      }
    
      async goBackToParentFolder(container) {
        try {
          const currentFolderMetadata = await this.getFileMetadata(this.currentFolderId);
          if (currentFolderMetadata && currentFolderMetadata.parents && currentFolderMetadata.parents.length > 0) {
            const parentFolderId = currentFolderMetadata.parents[0];
            this.updateFileList(parentFolderId, null, 'parents', container);
            this.currentFolderId = parentFolderId; // Update currentFolderId
          } else {
            console.error('This folder does not have a parent.');
          }
        } catch (error) {
          console.error('Error going back to parent folder:', error);
        }
      }
    
      setupFileItemClick(parentFolder, container) {
        const fileItems = container.querySelectorAll('.file-item');
        fileItems.forEach(item => {
          item.addEventListener('click', async () => {
            const fileId = item.getAttribute('data-id');
            const mimeType = item.getAttribute('data-mime-type');
            const fileName = item.getAttribute('data-name');
      
            if (mimeType === 'application/vnd.google-apps.folder') {
              this.updateFileList(fileId, null, parentFolder, container); // Updated to navigate into the folder
              this.currentFolderId = fileId; // Update currentFolderId
            } else {
              const downloadedFile = await this.downloadFile(fileId, mimeType);
              console.log('Downloaded file:', fileName, downloadedFile);
            }
          });
        });
      }

      
    setupPaginationButtons(folderId, parentFolder, container) {
        (container.querySelector('#previous-page') as any).addEventListener('click', () => {
            if (this.previousPageToken !== null) {
                this.updateFileList(folderId, this.previousPageToken, parentFolder, container);
                // Clear the previous page token since we've navigated back.
                this.previousPageToken = null;
            }
        });

        (container.querySelector('#next-page') as any).addEventListener('click', () => {
            if (this.nextPageToken) {
                this.updateFileList(folderId, this.nextPageToken, parentFolder, container);
            }
        });
    }
    
      
    //backup BFS file to drive by name (requires gapi authorization)
    backupBFSToDrive = (
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
                        res(await this.backupBFSToDrive(bfsPath)); //rerun
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