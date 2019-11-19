"use strict";

const http = require("http");
const fs = require("fs");

const express = require("express");
const multer = require("multer");
const csv = require("fast-csv");
const csvtojson = require("csvtojson");

const Router = express.Router;
const upload = multer({ dest: "tmp/csv/" });
const app = express();
const router = new Router();
const server = http.createServer(app);
const port = 9000;

// ROUTES
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

router.post("/", upload.single("file"), function(req, res) {
  // Read the CSV file
  const fileRows = [];

  // open uploaded file
  csvtojson()
    .fromFile(req.file.path)
    .on("data", function(data) {
      let jsonStr = data.toString("utf8");
      fileRows.push(JSON.parse(jsonStr)); // push each row
    })
    .on("done", function() {
      res.status(200).json(fileRows);
      fs.unlinkSync(req.file.path); // remove temp file
      //process "fileRows" and respond
    });
});

app.use("/upload-csv", router);

// Start server
function startServer() {
  server.listen(port, function() {
    console.log("Express server listening on ", port);
  });
}

setImmediate(startServer);
