require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");
const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;
const fileupload = require("express-fileupload");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const nodemailer = require("nodemailer");
var generator = require("generate-password");
const cors = require("cors");
const laws = require("./laws.json");

const app = express();

const User = require("./models/users");
const Lawyers = require("./models/lawyers");
const Appelant = require("./models/appelant");
const Defendant = require("./models/defendant");
const Case = require("./models/case");

var lawyerUsername = "";
var appelantId = "";
var defendantId = "";

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../client/index.html")));
app.use(fileupload());
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/ecourtDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});



passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.PASSWORD
  }
});

app.get("/lawyers", function (req, res) {
  Lawyers.find({ status: true }, function (err, foundLawyers) {
    if (err) {
      console.log(err);
    } else {
      res.render("lawyer", { foundLawyers: foundLawyers });
    }
  });
});

app.get("/viewLawyers", function (req, res) {
  Lawyers.find({ status: true }, function (err, foundResult) {
    if (err) {
      console.log(err);
    } else {
      res.render("viewLawyers", { lawyers: foundResult });
    }
  });
});

app.get("/laws", function (req, res) {
  res.render("laws", { laws: laws });
});

app.get("/verifyLawyer", function (req, res) {
  Lawyers.find({ status: false }, function (err, foundLawyer) {
    if (err) {
      console.log(err);
    } else {
      res.render("verifyLawyer", { lawyers: foundLawyer });
    }
  });
});

app.get("/logout", function (req, res) {
  req.logOut();
  res.json({ logout: true });
});

app.get("/viewAllCases", function (req, res) {
  var username = sess.username;
  var cases = [];
  Case.find({})
    .populate("appelant")
    .populate("defendant")
    .then((foundCase) => {
      foundCase.forEach(element => {
        if (element.appelant.username === username) {
          cases.push(element);
        } else if (element.defendant.username === username) {
          cases.push(element);
        } else {
          console.log("User Not Found");
        }
      });
      res.render("viewCases", { cases: cases });
    })
    .catch((error) => {
      console.log(error);
    });
});

app.post("/signup", function (req, res) {
  const newUser = {
    username: req.body.username,
    password: req.body.password,
  };
  User.register({ username: req.body.username }, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function () {
        res.send({ success: true });
      });
    }
  });
});

app.post("/login", function (req, res) {
  const newUser = new User({
    username: req.body.username,
    password: req.body.password,
  });
  req.login(newUser, function (err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function () {
        sess = req.session;
        sess.username = req.user.username;
        res.send({ success: true, user: req.user });
      });
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

app.post("/acceptApplication", function (req, res) {
  var password = generator.generate({
    length: 10,
    numbers: true
  });
  Lawyers.findByIdAndUpdate(req.body.id, { status: true, password: password }, function (err, foundLawyer) {
    if (err) {
      console.log(err);
    } else {
      var mailOptions = {
        from: "ecourt834@gmail.com",
        to: foundLawyer.username,
        subject: "Approval of Application on E-Court",
        html: "<b>Congrats! " + foundLawyer.fullname + " Your Application is approved by E-Court</b><br>You can Access your account by using:<br>Username: " + foundLawyer.username + "<br>Password: " + password
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log(info.response);
        }
      });
      res.json({ success: true });
    }
  });
});

app.post("/rejectApplication", function (req, res) {
  Lawyers.findByIdAndRemove(req.body.id, function (err, removedLawyer) {
    if (err) {
      console.log(err);
    } else {
      var mailOptions = {
        from: "ecourt834@gmail.com",
        to: removedLawyer.username,
        subject: "Rejection of Application on E-Court",
        html: "<b>Oops! Your Application is rejected due to</b> " + req.body.message
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log(info.response);
        }
      });
      res.json({ remove: true });
    }
  });
});

app.post("/addAppelantCase", function (req, res) {
  const { fullname, username, address, lawyerId } = req.body;
  Appelant.create({ fullname, username, address, lawyerId }, function (err, insertedData) {
    if (err) {
      console.log(err);
    } else {
      appelantId = insertedData._id;
      res.send({ success: true });
    }
  });
});

app.post("/addDefendantCase", function (req, res) {
  const { fullname, username, address, lawyerId } = req.body;
  Defendant.create({ fullname, username, address, lawyerId }, function (err, insertedData) {
    if (err) {
      console.log(err);
    } else {
      defendantId = insertedData._id;
      res.send({ success: true });
    }
  });
});

app.post("/getLawyerId", function (req, res) {
  Lawyers.findOne({ username: req.body.lawyerUsername }, function (err, foundLawyer) {
    if (err) {
      console.log(err);
    } else {
      if (foundLawyer) {
        res.send({ lawyerId: foundLawyer._id });
      } else {
        res.send({ lawyerId: "" });
      }
    }
  });
});

app.post("/registerCase", function (req, res) {
  var data = {
    complaint: req.body.complaint,
    dateOfComplaint: req.body.dateOfComplaint,
    codes: req.body.codes,
    status: req.body.status,
    lastCourtOfHearing: req.body.lastCourtOfHearing,
    nextCourtOfHearing: req.body.nextCourtOfHearing,
    lastDateOfHearing: req.body.lastDateOfHearing,
    nextDateOfHearing: req.body.nextDateOfHearing,
    appelant: appelantId,
    defendant: defendantId
  };
  Case.create(data, function (err, insertedData) {
    if (err) {
      console.log(err);
    } else {
      res.send({ insertedData });
    }
  });
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
