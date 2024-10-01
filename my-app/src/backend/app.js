const express = require("express");
const app = express();
const port = "4000";
const exporter = require("./export")
const upload = require("./upload")

app.use("/", exporter);
app.use("/", upload);


app.listen(port, (res) => {
  console.log(port)
})
