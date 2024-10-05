const fs = require('fs');
const pdf = require('pdf-parse');

// Função para extrair texto de um PDF
const extractTextFromPDF = (pdfPath) => {
  return new Promise((resolve, reject) => {
    let dataBuffer = fs.readFileSync(pdfPath);
    
    pdf(dataBuffer).then(function(data) {
      resolve(
        {
            texto:data.text,
            autor: data.info.Author,
            titulo: data.info,
            data: data,
            numeroDePaginas: data.numpages
        });
    }).catch(reject);
  });
};

// Função para encontrar linhas que contêm palavras específicas
const findLinesWithWords = (text, words) => {
  const lines = text.split('\n');
  const result = [];

  lines.forEach((line, index) => {
    words.forEach(word => {
      if (line.includes(word)) {
        result.push({ lineNumber: index + 1, lineContent: line });
      }
    });
  });

  return result;
};


const transformStringsToArray = (inputArray) => {
    return inputArray.reduce((acc, str) => {
      return acc.concat([str.replace(/\s+/g, '').toUpperCase(), str.toLowerCase()]);
    }, []);
  };
// Exportando as funções
module.exports = { extractTextFromPDF, findLinesWithWords ,transformStringsToArray};