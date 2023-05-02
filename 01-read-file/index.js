const fs = require('fs');
const path = require('path');
const getFilePath = (filename) => path.join(__dirname, filename);
const readableStream = fs.createReadStream(getFilePath('text.txt'), 'utf8');
readableStream.on('data', (chunk) => {
  console.log(chunk);
});