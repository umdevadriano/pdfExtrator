const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const app = express();
const fs = require('fs');
const  { extractTextFromPDF, findLinesWithWords ,transformStringsToArray}  = require('./controllers/textoExtrator');
var nomeArquivo = ''
// Configuração do Multer para armazenamento de arquivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Pasta onde os PDFs serão salvos
  },
  // filename: function (req, file, cb) {
  //   cb(null, 'uploads' + '-' + Date.now() + '.pdf')
  // }
  filename: (req, file, cb) => {
    // Manter o nome original do arquivo
    cb(null, file.originalname); 
    nomeArquivo = file.originalname
  }
});
const upload = multer({ storage: storage });

// Rota para upload e processamento do PDF
app.post('/process',  upload.any (), (req, res) => {
  var caminho = ''
  if (!req.files ) {
    return res.status(400).send('Nenhum arquivo foi enviado.');
  }
    for(let i = 0 ; i < req.files.length; i++){
        caminho = `./uploads/${nomeArquivo}`
        const palavras = transformStringsToArray(req.body.texto.split(','))
        
        const texto =extractTextFromPDF(caminho).then((resultado)=>{
          const encontrado = findLinesWithWords(resultado.texto,palavras)
          res.json(
            { paginas :resultado.numpages,
              info: resultado.info,
              texto: resultado.texto,
              linhas: encontrado,
            }) 
        })
       
        

        // pdfParse(caminho).then(data => {
        //   const texto = data.text;
        //   const palavraProcurada = req.body.texto
  

        //  const textoExtraido = findLinesWithWords()
         
      
        //   // const posicao = texto.indexOf(palavraProcurada);
        //   // if(posicao >= 0){
        //   //   console.log(`A palavra "${palavraProcurada}" começa na posição ${posicao}.`);
        //   //   const textoAtePontoFinal = texto.substring(0, texto.indexOf('\n', posicao) + 1)
        //   //   console.log(textoAtePontoFinal)

        //   //   const info = {
        //   //     autor: data.info.Author,
        //   //     titulo: data.info.Title,
        //   //     numeroDePaginas: data.numpages,
        //   //     palavra:"Essa foi a palavra procurada "+palavraProcurada,
        //   //     texto : textoAtePontoFinal,
        //   //     arquivo : nomeArquivo
        //   //   }

        //   //   res.json({texto: info,}) 

        //   // }else{
        //   //   console.error('Erro não foi encontrado o texto no arquivo:');
        //   //   res.json({texto: "Erro não foi encontrado o texto no arquivo",}) 
        //   // }
         
        //   setTimeout(() => {
        //     fs.unlink(caminho, (err) => {
        //       if (err) {
        //         console.error('Erro ao deletar o arquivo:', err);
        //       } else {
        //         console.log('Arquivo deletado com sucesso!quando encontar o arquivo');
        //       }
        //     });
        //   },  60000); // 100000 ms = 1 minutos
           
        // }).catch(err => {
        //   res.status(500).send('Arquivo inválido');
        //     fs.unlink(caminho, (err) => {
        //       if (err) {
        //         console.error('Erro ao deletar o arquivo:', err);
        //       } else {
        //         console.log('Arquivo deletado com sucesso!');
        //       }
        //     });
        // }); 
       
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
