
require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const path = require('path');



const app = express();
const PORT = process.env.PORT || 4000;

// Use body-parser middleware to parse JSON
app.use(bodyParser.json());

// HTML content as a template literal
const htmlContent = `
<!DOCTYPE HTML>
<html lang="en">

<head>
  <title>Add Data</title>
</head>

<body>
<h1>Add Data to Google Sheets</h1>

<form id="addDataForm">
  <label for="nameInput">Namess:</label>
  <input type="text" id="nameInput" name="name" required>

  <label for="deptInput">Department Number:</label>
  <input type="text" id="deptInput" name="department" required>

  <label for="complaintInput">Complaint:</label>
  <input type="text" id="complaintInput" name="complaint" required>

  <label for="treatment1Input">Treatment 1:</label>
  <input type="text" id="treatment1Input" name="treatment1" required>

  <label for="treatment2Input">Treatment 2:</label>
  <input type="text" id="treatment2Input" name="treatment2" required>

  <button type="submit">Add Data</button>
</form>

<script>
    document.getElementById('addDataForm').addEventListener('submit', function (event) {
      event.preventDefault();

      const formData = new FormData(this);

      fetch('/addData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(formData)),
      })
        .then(response => response.json())
        .then(data => {
          alert(data.message);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    });
</script>
</body>

</html>
`;

// Serve HTML content
app.get('/', (req, res) => {
  res.send(htmlContent);
});

// Handle form submission and add data to Google Sheets
app.post('/addData', async (req, res) => {
  try {
    const credentials = require(path.join(__dirname, 'yashwanth535-0d58c1966500.json'));
    const spreadsheetId = '11Bcscc6m5TXX2awoX_iBuT4DRuGTKwryKliojYtqHyY';

    const { name, department, complaint, treatment1, treatment2 } = req.body;

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
        values: [[name, department, complaint, treatment1, treatment2]],
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
