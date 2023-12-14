gapi.load('client', initGoogleSheets);

function initGoogleSheets() {

  gapi.client.init({
    apiKey: 'a03106f7fee5d162f5404dd5a8988ca00c0b632a', 
    discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
  }).then(() => {
    console.log('Google Sheets API initialized');
  });
}
