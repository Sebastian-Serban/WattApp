const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const csvjson = require("csvjson");
const app = express();
const PORT = process.env.PORT || 4000;
const { exec } = require('child_process');
const zip = require('express-zip');

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

const upload = multer({storage})
app.post('/upload', upload.array('files'), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).send('No files uploaded.');
    }
    console.log('Uploaded files:', req.files);
    res.status(201).send('Files uploaded successfully');
});

app.get("/data", (req, res) => {
    const filePath = './output.json'

    if (fs.existsSync(filePath)) {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).send({ error: "Error reading the file" })
            }

            const jsonData = JSON.parse(data)
            res.send(jsonData)
        })
    } else {
        exec(`python main.py`, (error, stdout, stderr) => {
            if (error) {
                console.error("Error executing Python script:", error)
                return res.status(500).send({ error: "Error executing Python script" })
            }

            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    console.error("Error reading the file:", err)
                    return res.status(500).send({ error: "Error reading the file after script execution" })
                }

                const jsonData = JSON.parse(data)
                res.send(jsonData)
            });
        });
    }
});

app.get("/export", (req, res) => {
    const filePath = './output.json';
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading JSON file.');
        }

        let jsonData;
        try {
            jsonData = JSON.parse(data);
        } catch (e) {
            return res.status(400).send("Invalid JSON format.");
        }

        if (!jsonData.ID742 || !jsonData.ID735) {
            return res.status(400).send("Invalid data. Missing ID742 or ID735.");
        }

        const id742Data = jsonData.ID742.data;
        const id735Data = jsonData.ID735.data;

        const csvDataID742 = csvjson.toCSV(id742Data.map(item => ({
            timestamp: item.ts,
            value: item.value
        })), {
            headers: 'key',
            delimiter: ';'
        });

        const csvDataID735 = csvjson.toCSV(id735Data.map(item => ({
            timestamp: item.ts,
            value: item.value
        })), {
            headers: 'key',
            delimiter: ';'
        });

        fs.writeFileSync('ID742.csv', csvDataID742, 'utf-8');
        fs.writeFileSync('ID735.csv', csvDataID735, 'utf-8');

        res.zip([
            { path: './ID742.csv', name: 'ID742.csv' },
            { path: './ID735.csv', name: 'ID735.csv' }
        ]);
    });
});



app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
