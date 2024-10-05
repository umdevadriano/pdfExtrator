const express = require('express');
const multer = require('multer');
const app = express();
const  { extractTextFromPDF, findLinesWithWords ,transformStringsToArray}  = require('./controllers/textoExtrator');
var nomeArquivo = ''

// Configuração do multer para armazenamento de arquivos
const storage = multer.memoryStorage(); // Armazena o arquivo em memória
const upload = multer({ storage: storage });
const pdf = require('pdf-parse');
var caminho = ''

// Rota para receber o arquivo
app.post('/upload', upload.single('file'), (req, res) => {

  if (!req.file ) {
    return res.status(400).send('Nenhum arquivo foi enviado.');
  }
  if (!req.body.texto ) {
    return res.status(400).send('Nenhum texto a procurar');
  }
  const nomeArquivo = req.file.originalname
  const fileBuffer = req.file.buffer;
  const pdfData = pdf(fileBuffer);
  const palavras = transformStringsToArray(req.body.texto.split(','))
  //pega o pdf armazenado em memoria e faaz tratativa de encontrar o texto e devolver
  pdfData.then((data) => {
    try {
      const texto = data.text;
      const encontrado = findLinesWithWords(texto,palavras)

      res.json(
                  { paginas :data.numpages,
                    info: data.info,
                    texto: data.text,
                    palavras: encontrado,
                    arquivo: nomeArquivo,
  
                }) 
    } catch (error) {
      console.error('Erro ao extrair texto do PDF:', error);
    }
  });
});
    
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
