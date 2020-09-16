const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");
const cors = require("cors");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.post("/signup", function (req, res) {
  var filePath = path.join(__dirname, "../client/index.html");
  // res.sendFile(filePath);
  res.redirect("http://localhost:3000/index.html");
});

app.listen(3001, () => {
  console.log("Server is running on port 3000");
});

