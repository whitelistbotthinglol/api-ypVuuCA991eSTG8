const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Middleware to check for custom header
const checkHeader = (req, res, next) => {
  const customHeader = req.headers['client']; // Change header name here
  if (customHeader === 'roadblocks') { // Change expected value here
    next();
  } else {
    res.status(403).send('Forbidden');
  }
};

// Route to return content of response.txt if valid key is provided
app.get('/api/auth', checkHeader, (req, res) => {
  const keysFilePath = path.join(__dirname, 'keys.json');
  const responseFilePath = path.join(__dirname, 'response.txt');

  fs.readFile(keysFilePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading keys file');
      return;
    }
    
    const jsonData = JSON.parse(data);
    const keys = jsonData.keys;
    const providedKey = req.query.key;

    if (providedKey && keys.includes(providedKey)) {
      fs.readFile(responseFilePath, 'utf8', (err, responseData) => {
        if (err) {
          res.status(500).send('Error reading response file');
          return;
        }
        res.send(responseData);
      });
    } else {
      res.status(403).send('Invalid key');
    }
  });
});

// Route to return keys
app.get('/api/keys-1ynmluP5V5xqBZMBRsE6vhsrTobzyNGi', checkHeader, (req, res) => {
  const keysFilePath = path.join(__dirname, 'keys.json');

  fs.readFile(keysFilePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading keys file');
      return;
    }
    
    const jsonData = JSON.parse(data);
    const keys = jsonData.keys;
    res.json(keys);
  });
});

app.listen(port, () => {
  //console.log(`Server running at http://localhost:${port}`);
});
