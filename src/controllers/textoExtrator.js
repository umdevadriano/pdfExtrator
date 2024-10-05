const pdf = require('pdf-parse');

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

//transforma string enviada em uma array com caixa alta e caixa baixa  caixa auta no inicio e caixa baisxa no inicio
const transformStringsToArray = (inputArray) => {
  return inputArray.reduce((acc, str) => {
    const trimmedStr = str.trim(); // Remove espaços em branco no início e no fim
    const upperCase = trimmedStr.toUpperCase();
    const lowerCase = trimmedStr.toLowerCase();
    const capitalized = trimmedStr.charAt(0).toUpperCase() + trimmedStr.slice(1); // Inicial maiúscula

    return acc.concat([upperCase, lowerCase, capitalized]);
  }, []);
};
// Exportando as funções
module.exports = { findLinesWithWords ,transformStringsToArray};