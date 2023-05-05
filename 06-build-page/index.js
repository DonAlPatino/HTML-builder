const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;

const pathStyleFiles = path.resolve(__dirname, 'styles');
const pathAssetsFiles = path.resolve(__dirname, 'assets');
const pathBuild = path.resolve(__dirname, 'project-dist');
const pathNewAssetsFiles = path.resolve(pathBuild, 'assets');

const getFilePath = (dir, filename) => path.join(dir, filename);

(async function() {
  await fsPromises.access(pathBuild).then(() => {
    fs.rm(pathBuild, { recursive: true, force: true }, (err) => {
      if (err) throw err;
      fs.mkdir(pathBuild, (err) => {
        if (err) throw err;
      });
      buildHtml();
      buildCss();
      copyAssets();
    });
  })
    .catch(() => {
      fs.mkdir(pathBuild, (err) => {
        if (err) throw err;
      });
      buildHtml();
      buildCss();
      copyAssets();
    });
})();

function buildCss() {
  const output = fs.createWriteStream(getFilePath(pathBuild, 'style.css'));
  fs.readdir(pathStyleFiles, (err, files) => {
    files.forEach((file) => {
      if (path.extname(file).substring(1) === 'css') {
        fs.createReadStream(getFilePath(pathStyleFiles, file)).pipe(output);
      }
    });
  });
}
async function copyAssets() {
  await copyDir(pathAssetsFiles, pathNewAssetsFiles);
}
async function copyDir(src,dest) {
  const entries = await fsPromises.readdir(src, {withFileTypes: true});
  await fsPromises.mkdir(dest);
  for(let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if(entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fsPromises.copyFile(srcPath, destPath);
    }
  }
}

async function buildHtml() {
  const pathComponents = path.resolve(__dirname, 'components');
  const output = fs.createWriteStream(path.join(pathBuild, 'index.html'));
  const data = await fsPromises.readFile(path.resolve(__dirname, 'template.html'));
  let template = data.toString();
  const files = await fsPromises.readdir(pathComponents, {withFileTypes: true});
  for (const file of files) {
    if (path.extname(file.name) === '.html' && file.isFile()) {
      const data = await fsPromises.readFile(path.join(pathComponents, file.name));
      template = template.replace(`{{${file.name.split('.')[0]}}}`, data.toString());
    }
  }
  output.write(template);
}