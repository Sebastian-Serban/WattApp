const express = require("express");
const router = express.Router();

router.post("/upload", (req, res) => {
  console.log(req)
})

router.get("/upload", (req, res) => {
  res.send([[1,2,3,4], [1,2,3,45,6]])
})

module.exports = router;