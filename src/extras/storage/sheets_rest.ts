
function getOrCreateSheet(spreadsheetOptions) {
    let { spreadsheetId, sheetName, accessToken } = spreadsheetOptions;
  
    return fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    .then(response => {
        const body = typeof response.body === 'string' ? JSON.parse(response.body) : response.body;
        const sheets = body.sheets || [];
        const sheet = sheets.find(s => s.properties.title === sheetName);
      
        if (sheet) {
          return sheet.properties;
        } else {
          return createSheet({ spreadsheetId, sheetName, accessToken });
        }
    });
}

function createSheet(spreadsheetOptions: {
    spreadsheetId?: string;
    sheetName: string;
    accessToken: string;
}) {
  
    let { spreadsheetId, sheetName, accessToken } = spreadsheetOptions;

    const data = {
    requests: [{
      addSheet: {
        properties: {
          title: sheetName
        }
      }
    }]
  };

  return fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    const body = typeof response.body === 'string' ? JSON.parse(response.body) : response.body;
    const sheet = body.replies[0].addSheet.properties;
    return sheet;
  });

}

async function init(spreadsheetOptions: {
    accessToken: string;
    spreadsheetName?: string; //either
    spreadsheetId?: string;   //or
    sheetName?: string;
}) {
    if (!spreadsheetOptions.spreadsheetId) {
        if (!spreadsheetOptions.spreadsheetName) {
            throw new Error('Either spreadsheetId or spreadsheetName must be provided');
        }
  
        // Query Google Drive API to get the spreadsheet ID by name
        const driveApiUrl = `https://www.googleapis.com/drive/v3/files?q=name='${spreadsheetOptions.spreadsheetName}'&mimeType='application/vnd.google-apps.spreadsheet'&fields=files(id,name)`;
        const driveResponse = await fetch(driveApiUrl, {
            headers: {
                'Authorization': `Bearer ${spreadsheetOptions.accessToken}`
            }
        });
        const driveResponseBody = typeof driveResponse.body === 'string' ? JSON.parse(driveResponse.body) : driveResponse.body;
        const file = driveResponseBody.files[0];
      
        if (file) {
            spreadsheetOptions.spreadsheetId = file.id;
        } else {
            // If spreadsheet not found, create a new one
            const createResponse = await fetch('https://www.googleapis.com/drive/v3/files', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${spreadsheetOptions.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    mimeType: 'application/vnd.google-apps.spreadsheet',
                    name: spreadsheetOptions.spreadsheetName,
                })
            });
            let createData = await createResponse.json();
            createData = typeof createData === 'string' ? JSON.parse(createData) : createData;
            spreadsheetOptions.spreadsheetId = createData.id;
        }
    }
  
    // Fetch spreadsheet to get sheets info
    const sheetsResponse = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetOptions.spreadsheetId}?fields=sheets.properties`, {
        headers: {
            'Authorization': `Bearer ${spreadsheetOptions.accessToken}`
        }
    });
    let sheetsData = await sheetsResponse.json();
    sheetsData = typeof sheetsData === 'string' ? JSON.parse(sheetsData) : sheetsData;

    if (!spreadsheetOptions.sheetName) {
        if (sheetsData.sheets && sheetsData.sheets.length > 0) {
            spreadsheetOptions.sheetName = sheetsData.sheets[0].properties.title;
        } else {
            throw new Error('No sheets found in the spreadsheet');
        }
    }
  
    const sheetProperties = await getOrCreateSheet({ spreadsheetId: spreadsheetOptions.spreadsheetId, sheetName: spreadsheetOptions.sheetName, accessToken: spreadsheetOptions.accessToken });
    const sheetIndex = sheetProperties.sheetId;
    console.log('Sheet exists or was created:', sheetProperties.title, 'with Sheet Index:', sheetIndex);
}

async function readRange(spreadsheetOptions: {
    spreadsheetId: string;
    sheetName: string;
    range?: string;
    accessToken: string;
  }): Promise<any[][]> {
    const { spreadsheetId, sheetName, range, accessToken } = spreadsheetOptions;
  
    // If range is provided, use it; otherwise, default to the entire sheet
    const fullRange = range ? `${sheetName}!${range}` : sheetName;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${fullRange}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
  
    if (!response.ok) {
      throw new Error('Network response was not ok: ' + response.statusText);
    }

    const responseBody = typeof response.body === 'string' ? JSON.parse(response.body) : response.body;
    return responseBody.values || [];
}
  
async function writeRange(spreadsheetOptions: {
    spreadsheetId: string;
    range: string;
    values: any[][];
    accessToken: string;
}): Promise<void> {
    const { spreadsheetId, range, values, accessToken } = spreadsheetOptions;
  
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:batchUpdate`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        valueInputOption: 'USER_ENTERED',
        data: [
          {
            range: range,
            values: values
          }
        ]
      })
    });
  
    const responseBody = typeof response.body === 'string' ? JSON.parse(response.body) : response.body;
    if (!response.ok) {
        throw new Error('Network response was not ok ' + (responseBody.error?.message || response.statusText));
    }
    return responseBody;
}


async function demo(
    accessToken='YOUR_ACCESS_TOKEN', 
    spreadsheetName='MySpreadsheet',
    sheetName='Sheet1'
) {
    const spreadsheetOptions = {
      accessToken,
      spreadsheetName, // Either provide this...
      //spreadsheetId: 'your-spreadsheet-id', // Or provide this
      sheetName
    } as any;
  
    // Initialize the spreadsheet
    await init(spreadsheetOptions);
    console.log('Spreadsheet initialized.');
  
    // Read data from the spreadsheet
    const readOptions = { ...spreadsheetOptions, range: 'A1:B2' };
    const data = await readRange(readOptions);
    console.log('Data read from the spreadsheet:', data, readOptions);
  
    // Write data to the spreadsheet
    const writeOptions = { ...spreadsheetOptions, range: 'A3', values: [['Hello', 'World'], ['How', 'are you?']] };
    await writeRange(writeOptions);
    console.log('Data written to the spreadsheet.', writeOptions);
}
  
//   // Run the demo
//   demo()
//     .then(() => console.log('Demo completed successfully'))
//     .catch(error => console.error('Demo failed with error:', error));