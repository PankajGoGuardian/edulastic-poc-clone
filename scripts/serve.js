const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.relative(__dirname, '../build')));

app.get('*', (req, res) => {
  let filePath = path.relative(__dirname, '../build/index.html');
  console.log('filepath', filePath);
  res.sendFile(filePath);
});

app.listen(3000);
