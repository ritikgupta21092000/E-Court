const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../client/index.html")));
app.use(cors());

mongoose.connect("mongodb://localhost:27017/ecourtDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  admin: {
    type: Boolean,
    default: false,
  },
});

const User = new mongoose.model("user", userSchema);

app.get("/lawyers", function (req, res) {
  res.render("lawyer");
});

app.post("/signup", function (req, res) {
  const newUser = {
    username: req.body.username,
    password: req.body.password,
  };
  User.create(newUser, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      res.send({ success: true });
    }
  });
});

app.post("/login", function (req, res) {
  const newUser = {
    username: req.body.username,
    password: req.body.password,
  };
  User.findOne(newUser, function (error, foundUser) {
    if (error) {
      console.log(error);
    } else {
      res.send({ success: true, user: foundUser });
    }
  });
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
