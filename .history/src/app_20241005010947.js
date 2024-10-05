const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const app = express();
const fs = require('fs');
const  { extractTextFromPDF, findLinesWithWords ,transformStringsToArray}  = require('./controllers/textoExtrator');
var nomeArquivo = ''
var folderName = 'uploads'

// if (!fs.existsSync(folderName)) {
//   fs.mkdirSync(folderName);
//   console.log(`Pasta "${folderName}" criada com sucesso!`);
// } else {
//   console.log(`A pasta "${folderName}" já existe.`);
// }
// // Configuração do Multer para armazenamento de arquivos
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/') // Pasta onde os PDFs serão salvos
//   },

//   filename: (req, file, cb) => {
//     // Manter o nome original do arquivo
//     cb(null, file.originalname); 
//     nomeArquivo = file.originalname
//   }
// });
// const upload = multer({ storage: storage });

// Rota para upload e processamento do PDF
app.post('/process',  upload.any (), (req, res) => {
  var caminho = ''
  if (!req.files ) {
    return res.status(400).send('Nenhum arquivo foi enviado.');
  }
  if (!req.body.texto ) {
    return res.status(400).send('Nenhum texto a procurar');
  }
    for(let i = 0 ; i < req.files.length; i++){
        caminho = `./uploads/${nomeArquivo}`
        const palavras = transformStringsToArray(req.body.texto.split(','))
        console.log(palavras)
        
        const texto =extractTextFromPDF(caminho).then((resultado)=>{
        const encontrado = findLinesWithWords(resultado.texto,palavras)
  
        res.json(
          { paginas :resultado.data.numpages,
            info: resultado.data.info,
            texto: resultado.texto,
            linhas: encontrado,
        }) 

        setTimeout(() => {
          fs.unlink(caminho, (err) => {});
        },  60000); // 60000 ms = 1 minutos

        }).catch(err => {
          res.status(500).send('Arquivo inválido');
          fs.unlink(caminho, (err) => {});
        }); 

    }
});

app.post('/test', (req, res) => {
  const fs = require('fs');
const pdf = require('pdf-parse');

const pdfPath = req.files // Substitua pelo caminho real do seu arquivo

async function extractTextFromPDF() {
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdf(dataBuffer);
    const texto = pdfData.text;
    console.log('Texto extraído do PDF:');
    console.log(texto);
  } catch (error) {
    console.error('Erro ao extrair texto do PDF:', error);
  }
}

extractTextFromPDF();

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
