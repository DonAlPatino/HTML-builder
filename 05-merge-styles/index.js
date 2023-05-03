const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;

const pathFiles = path.resolve(__dirname, 'styles');
const pathFilesCopy = path.resolve(__dirname, 'project-dist\\bundle.css');
const getFilePath = (filename) => path.join(pathFiles, filename);

(async function() {
  try {
    await fsPromises.access(pathFilesCopy);
    fs.rm(pathFilesCopy, { force: true }, (err) => {
      if (err) throw err;
      buildBundle();
    });
  } catch (error) {
    buildBundle();
  }
})();

function buildBundle() {
  const output = fs.createWriteStream(pathFilesCopy);
  fs.readdir(pathFiles, (err, files) => {
    files.forEach((file) => {
      if (path.extname(file).substring(1) === 'css') {
        fs.createReadStream(getFilePath(file)).pipe(output);
      }
    });
  });
}