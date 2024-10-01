const express = require("express");
const router = express.Router();
const csvjson = require('csvjson');
const fs = require('fs');
const path = require("path");

let array = [
  {
    "sensorId": "ID742",
    "data": [
      {
        "ts": "1503495302",
        "value": 82.03
      }
    ]
  },
  {
    "sensorId": "ID735",
    "data": [
      {
        "ts": "1503495303",
        "value": 1129336.0
      }
    ]
  }
]

router.get("/export", (req, res) => {
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
})

module.exports = router;