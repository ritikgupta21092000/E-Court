const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");
const mongoose = require("mongoose");
const fileupload = require("express-fileupload");
const cors = require("cors");

const app = express();

var lawyerUsername = "";

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../client/index.html")));
app.use(fileupload());
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
      res.render("lawyer", { foundLawyers: foundLawyers });
    }
  });
});

app.get("/viewLawyers", function (req, res) {
  Lawyers.find({}, function (err, foundResult) {
    if (err) {
      console.log(err);
    } else {
      res.render("viewLawyers", { lawyers: foundResult });
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
  lawyerUsername = req.body.username;
  const lawyerProfessionalInfo = {
    degreeCollege: req.body.degreeCollege,
    stateOfCollege: req.body.stateOfCollege,
    yearOfPassing: req.body.yearOfPassing,
    startPracticeDate: req.body.startPracticeDate,
    speciality: req.body.speciality
  };
  Lawyers.updateOne({ username: lawyerUsername }, { $set: lawyerProfessionalInfo }, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      res.send({ success: true })
    }
  });
});

app.post('/saveImage', (req, res) => {
  var image = req.files.imageFile;
  var certificate = req.files.certificateFile;
  var fileName = req.files.imageFile.name;
  var certificateFileName = req.files.certificateFile.name;
  var folderPath = path.join(__dirname, "../client/images/lawyerPhoto/" + fileName);
  var certificateFolderPath = path.join(__dirname, "../client/images/lawyerCertificate/" + certificateFileName);
  var photoUrl = "./images/lawyerPhoto/" + fileName;
  var certificateUrl = "./images/lawyerCertificate/" + certificateFileName;
  image.mv(folderPath, function (err) {
    if (err) {
      console.log(err);
    } else {
      certificate.mv(certificateFolderPath, function (err) {
        if (err) {
          console.log(err);
        } else {
          Lawyers.updateOne({ username: lawyerUsername }, { $set: { photoUrl: photoUrl, degreePhotoUrl: certificateUrl } }, function (err, result) {
            if (err) {
              console.log(err);
            } else {
              res.send({ success: true })
            }
          });
        }
      });
    }
  });
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
