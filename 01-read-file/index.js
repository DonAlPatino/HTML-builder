const fs = require('fs');
const path = require('path');
const { stdout } = process;
const getFilePath = (filename) => path.join(__dirname, filename);
const readableStream = fs.createReadStream(getFilePath('text.txt'), 'utf8');
readableStream.on('data', data => stdout.write(data));