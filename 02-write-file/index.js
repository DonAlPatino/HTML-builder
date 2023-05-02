const { stdin, stdout } = process;
const fs = require('fs');
const path = require('path');
process.on('exit', () => stdout.write('Удачи в изучении Node.js!'));
process.on('SIGINT', () => {
  process.exit(0);
});
const getFilePath = (filename) => path.join(__dirname, filename);
const output = fs.createWriteStream(getFilePath('destination.txt'));
stdout.write('Введите текст или exit для выхода?\n');
stdin.on('data', data => {
  const txt = data.toString();
  if (txt.trim() ==='exit') process.exit();
  output.write(data);
});