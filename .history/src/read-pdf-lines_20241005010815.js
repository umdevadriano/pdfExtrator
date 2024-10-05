const lineReader = require('line-reader');

const pdfPath = 'caminho/para/seu/arquivo.pdf'; // Substitua pelo caminho real do seu arquivo

lineReader.eachLine(pdfPath, (line) => {
  console.log(line); // Aqui você pode processar cada linha do PDF
});
