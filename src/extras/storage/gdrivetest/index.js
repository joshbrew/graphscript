/* 
    esbuild + nodejs development server. 
    Begin your javascript application here. This file serves as a simplified entry point to your app, 
    all other scripts you want to build can stem from here if you don't want to define more entryPoints 
    and an outdir in the bundler settings.

    Just ctrl-A + delete all this to get started on your app.

*/

import { GDrive } from '../BFS_GDrive';

const apiKey = 'YOUR_GOOGLE_API_KEY';
const clientId = 'YOUR_GOOGLE_CLIENT_ID';

const gdrive = new GDrive(apiKey, clientId);

const authButton = document.getElementById('auth-button');
authButton.addEventListener('click', async () => {
  try {
    await gdrive.handleUserSignIn();
    authButton.style.display = 'none';
    gdrive.createFileBrowser('file-browser-container');
  } catch (error) {
    console.error('Error signing in:', error);
  }
});

