"use strict";

const http = require("http");
const fs = require("fs");

const express = require("express");
const multer = require("multer");
const csv = require("fast-csv");

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
  csv
    .fromPath(req.file.path)
    .on("data", function(data) {
      fileRows.push(data); // push each row
    })
    .on("end", function() {
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
