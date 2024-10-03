const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 4000;

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

const upload = multer({ storage });

app.post('/upload', upload.array('files'), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).send('No files uploaded.');
    }
    console.log('Uploaded files:', req.files);
    res.status(201).send('Files uploaded successfully');
});

app.get("/export", (req, res) => {
    res.send('Export functionality coming soon.');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
