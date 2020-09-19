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

const lawyersSchema = new mongoose.Schema({
  username: {
    type: String
  },
  fullname: {
    type: String
  },
  dob: {
    type: String
  },
  gender: {
    type: String
  },
  mobile: {
    type: Number
  },
  state: {
    type: String
  },
  city: {
    type: String
  },
  degreeCollege: {
    type: String
  },
  stateOfCollege: {
    type: String
  },
  yearOfPassing: {
    type: Number
  },
  startPracticeDate: {
    type: String
  },
  speciality: {
    type: Array
  },
  photoUrl: {
    type: String
  },
  degreePhotoUrl: {
    type: String
  }
});

const User = new mongoose.model("user", userSchema);
const Lawyers = new mongoose.model("Lawyer", lawyersSchema);

app.get("/lawyers", function (req, res) {
  Lawyers.find({}, function (err, foundLawyers) {
    if (err) {
      console.log(err);
    } else {
      res.render("lawyer", {foundLawyers: foundLawyers});
    }
  });
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

app.post("/addLayerPersonal", function (req, res) {
  const newLawyer = {
    username: req.body.username,
    fullname: req.body.fullname,
    dob: req.body.dob,
    gender: req.body.gender,
    mobile: req.body.mobile,
    state: req.body.state,
    city: req.body.city
  };
  Lawyers.create(newLawyer, function (err, createdLawyer) {
    if (err) {
      console.log(err);
    } else {
      res.send({ lawyer: createdLawyer });
    }
  });
});

app.post("/addLayerProfessional", function (req, res) {
  const username = req.body.username;
  const lawyerProfessionalInfo = {
    degreeCollege: req.body.degreeCollege,
    stateOfCollege: req.body.stateOfCollege,
    yearOfPassing: req.body.yearOfPassing,
    startPracticeDate: req.body.startPracticeDate,
    speciality: req.body.speciality
  };
  Lawyers.updateOne({username: username}, {$set: lawyerProfessionalInfo}, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      res.send({ success: true })
    }
  })
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
