const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const app = express();
const cors = require('cors');
const {findLinesWithWords, transformStringsToArray } = require('./controllers/textoExtrator');

// Configuração do multer para armazenamento de arquivos
const storage = multer.memoryStorage(); // Armazena o arquivo em memória
const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB
});
const pdf = require('pdf-parse');

app.use(cors()); // Permite todas as origens
app.use(express.json({ limit: '100mb' })); // tamanho do arquivo máximo
app.use(express.urlencoded({ limit: '100mb', extended: true }));
// requisição palavras em pdf
app.post('/upload', upload.array('file', 10), async (req, res) => {
  const uploadedFiles = req.files;

  if (!uploadedFiles || uploadedFiles.length === 0) {
    return res.status(400).send('Nenhum arquivo foi enviado.');
  }
  if (!req.body.texto) {
    return res.status(400).send('Nenhum texto a procurar.');
  }

  const palavras = transformStringsToArray(req.body.texto.split(','));
  const arrayInformacoes = [];

  for (const file of uploadedFiles) {
    try {
      const nomeArquivo = file.originalname;
      const fileBuffer = file.buffer; // Use 'buffer' em vez de 'file' para obter o conteúdo do arquivo
      const pdfData = await pdf(fileBuffer);
      const texto = pdfData.text;
      const encontrado = findLinesWithWords(texto, palavras);

      const info = {
        paginas: pdfData.numpages,
        info: pdfData.info,
        texto: pdfData.text,
        palavras: encontrado,
        arquivo: nomeArquivo,
      };

      arrayInformacoes.push(info);
    } catch (error) {
      res.status(400).send('Erro ao extrair texto do PDF:'+error);
    }
  }

  res.json(arrayInformacoes);
});

// requisição excel json
app.post('/upload-tabela', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('Nenhum arquivo foi enviado.');
  }

  const filePath = path.resolve(req.file.path);
  const workbook = new ExcelJS.Workbook();
  const jsonResult = [];

  try {
    // Lê o arquivo usando stream
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.worksheets[0];

    let headers = [];

    worksheet.eachRow((row, rowNumber) => {
      const rowValues = row.values;

      // Remove o valor undefined do índice 0
      rowValues.shift();

      if (rowNumber === 1) {
        // Cabeçalhos (primeira linha)
        headers = rowValues;
      } else {
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = rowValues[index] !== undefined ? rowValues[index] : null;
        });
        jsonResult.push(obj);
      }
    });

    // Remove o arquivo temporário
    fs.unlinkSync(filePath);

    // Retorna todos os dados do Excel como JSON
    res.json(jsonResult);
  } catch (err) {
    console.error('Erro ao processar o arquivo:', err);
    res.status(500).send('Erro ao processar o arquivo.');
  }
});
// 
app.get('/upload', (req, res) => {
  try {
    res.status(200).send("tudo certo por aqui");

  } catch (error) {
    res.status(500).send('Erro ao processar o arquivo: ');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
