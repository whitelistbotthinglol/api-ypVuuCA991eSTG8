const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

const checkHeader = (req, res, next) => {
  const customHeader = req.headers['client'];
  if (customHeader === 'roadblocks') {
    next();
  } else {
    res.status(403).send('Forbidden');
  }
};

const checkAuth = (req, res, next) => {
  const keysFilePath = path.join(__dirname, 'keys.json');
  const jsonData = JSON.parse(fs.readFileSync(keysFilePath, 'utf8'));
  const keys = jsonData.keys;
  const providedKey = req.query.key;
  const version = req.query.version;

  if (providedKey && keys.includes(providedKey)) {
    req.authType = 'key';
    next();
  } else if (version === 'free') {
    req.authType = 'free';
    next();
  } else {
    res.status(403).send('Forbidden');
  }
};

app.get('/api/auth', checkAuth, checkHeader, (req, res) => {
  const responseFilePath = req.authType === 'free' ? 'special-response.txt' : 'response.txt';

  fs.readFile(path.join(__dirname, responseFilePath), 'utf8', (err, responseData) => {
    if (err) {
      res.status(500).send('Error reading response file');
      return;
    }
    res.send(responseData);
  });
});

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
