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
    await buildBundle();
  }
})();
async function buildBundle() {
  const output = fs.createWriteStream(pathFilesCopy);
  const files = await fsPromises.readdir(pathFiles, {withFileTypes: true});
  for (const file of files) {
    if (path.extname(file.name).substring(1) === 'css' && file.isFile()) {
      const data = await fsPromises.readFile(getFilePath(file.name));
      output.write(data.toString());
    }
  }
}