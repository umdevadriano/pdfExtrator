const express = require('express');
const multer = require('multer');
const app = express();
const fs = require('fs');
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
  const fileBuffer = req.file.buffer;
  const pdfData = pdf(fileBuffer);
  const palavras = transformStringsToArray(req.body.texto.split(','))

    pdfData.then((data) => {
      try {
        const texto = data.text;
        console.log('Texto extraído do PDF:');
        res.json(
                    { paginas :data.numpages,
                      info: data.info,
                      texto: data.text,
    
                  }) 
        console.log(texto);
      } catch (error) {
        console.error('Erro ao extrair texto do PDF:', error);
      }
    });

});


app.post('/process',  upload.any (), (req, res) => {
  var caminho = ''
  if (!req.files ) {
    return res.status(400).send('Nenhum arquivo foi enviado.');
  }
  if (!req.body.texto ) {
    return res.status(400).send('Nenhum texto a procurar');
  }
    for(let i = 0 ; i < req.files.length; i++){
    
      
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
