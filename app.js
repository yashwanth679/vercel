require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const path = require('path');



const app = express();
const PORT = process.env.PORT || 4000;

// Use body-parser middleware to parse JSON
app.use(bodyParser.json());

// Serve the HTML file on the root path
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});


// Handle form submission and add data to Google Sheets
app.post('/addData', async (req, res) => {
  try {
    const credentials = require(path.join(__dirname, 'yashwanth535-0d58c1966500.json'));
    const spreadsheetId = '11Bcscc6m5TXX2awoX_iBuT4DRuGTKwryKliojYtqHyY';

    const { name, department, complaint, treatment, prescribed_by,date,time } = req.body;

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1', // Update with your sheet name
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[name, department, complaint, treatment, prescribed_by,date,time]],
      },
    });

    res.json({ message: 'Data added successfully!' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error adding data to Google Sheets' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
