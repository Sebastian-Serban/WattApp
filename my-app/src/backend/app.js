const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const csvjson = require("csvjson");
const app = express();
const PORT = process.env.PORT || 4000;
const { exec } = require('child_process');

app.use(cors());

const uploadsDir = 'uploads';
const sdatDir = path.join(uploadsDir, 'Sdat');
const eslDir = path.join(uploadsDir, 'Esl');


if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(sdatDir)) {
    fs.mkdirSync(sdatDir, { recursive: true });
}
if (!fs.existsSync(eslDir)) {
    fs.mkdirSync(eslDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {

        const type = req.query.type;
        if (type === 'sdat') {
            cb(null, sdatDir);
        } else if (type === 'esl') {
            cb(null, eslDir);
        } else {
            cb(new Error("Invalid type. Use 'sdat' or 'esl'."));
        }
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});


app.post('/upload', upload.array('files'), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).send('No files uploaded.');
    }
    console.log('Uploaded files:', req.files);
    res.send('Files uploaded successfully');
});

app.get("/data", (req, res) => {
  exec(`python main.py`, (error, stdout, stderr) => {
    fs.readFile('./output.json', 'utf8', (err, data) => {
      if (err) {
        console.error("Error reading the file:", err);
        return;
      }

      const jsonData = JSON.parse(data);
      res.send(jsonData);
    });
  });
})

app.get("/export", (req, res) => {
  const options = {
    root: path.join(__dirname)
  };

  const csvData = csvjson.toCSV(array, {
    headers: 'key'
  });

  fs.writeFile('output.csv', csvData, 'utf-8', (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('Conversion successful. CSV file created.');
    res.sendFile("./output.csv", options,(err, result) => {
      if (err) {
        res.status(500)
      }
    })
  });
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
