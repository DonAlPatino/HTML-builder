const fs = require('fs');
const path = require('path');


const getFilePath = (filename) => path.join(__dirname, filename);
const dir = getFilePath('secret-folder');

fs.promises.readdir(dir, {withFileTypes: true})
  .then(async filenames => {
    for (let filename of filenames) {
      if (filename.isFile()) {
        const name = path.parse(filename.name).name;
        const ext = path.extname(filename.name).substring(1);
        const stats = await fs.promises.stat(dir + '\\' + filename.name);
        const size = stats.size;
        console.log(name + ' - ' + ext + ' - ' + size + ' bytes ');
      }
    }
  })
  .catch(err => {
    console.log(err);
  });


