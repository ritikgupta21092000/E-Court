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
const UserAppointment = require("./models/registerCase");

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

app.get("/getRunningCases", function (req, res) {
  var username = sess.username;
  var ongoingCases = [];
  Case.find({ status: "Ongoing" })
    .populate("appelant")
    .populate("defendant")
    .then((foundCase) => {
      foundCase.forEach(element => {
        if (element.appelant.username === username) {
          ongoingCases.push(element);
        } else if (element.defendant.username === username) {
          ongoingCases.push(element);
        } else {
          console.log("User Not Found");
        }
      });
      res.send({ ongoingCases: ongoingCases.length });
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/getClosedCases", function (req, res) {
  var username = sess.username;
  var closedCases = [];
  Case.find({ status: "Closed" })
    .populate("appelant")
    .populate("defendant")
    .then((foundCase) => {
      foundCase.forEach(element => {
        if (element.appelant.username === username) {
          closedCases.push(element);
        } else if (element.defendant.username === username) {
          closedCases.push(element);
        } else {
          console.log("User Not Found");
        }
      });
      res.send({ closedCases: closedCases.length });
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/noOfLawyers", function (req, res) {
  Lawyers.find({ status: true }, function (err, foundLawyer) {
    if (err) {
      console.log(err);
    } else {
      res.send({ foundLawyer: foundLawyer.length });
    }
  });
});

app.get("/totalNumberOfCases", function (req, res) {
  Case.find({ status: "Ongoing" }, function (foundOngoingCasesErr, foundOngoingCases) {
    if (foundOngoingCasesErr) {
      console.log(err);
    } else {
      Case.find({ status: "Closed" }, function (foundClosedCasesErr, foundClosedCases) {
        if (foundClosedCasesErr) {
          console.log(err);
        } else {
          User.find({}, function (error, foundUser) {
            if (error) {
              console.log(error);
            } else {
              res.send({ ongoingCases: foundOngoingCases.length, closedCases: foundClosedCases.length, user: foundUser.length });
            }
          });
        }
      });
    }
  });
});

app.get("/registeredCases", function (req, res) {
  Case.find({})
    .populate("appelant")
    .populate("defendant")
    .then(foundCase => {
      res.render("totalCases", { cases: foundCase });
    })
    .catch(error => {
      console.log(error);
    });
});

app.get("/pendingCases", function (req, res) {
  Case.find({ status: "Ongoing" })
    .populate("appelant")
    .populate("defendant")
    .then(foundCase => {
      res.render("totalCases", { cases: foundCase });
    })
    .catch(error => {
      console.log(error);
    });
});

app.get("/solvedCases", function (req, res) {
  Case.find({ status: "Closed" })
    .populate("appelant")
    .populate("defendant")
    .then(foundCase => {
      res.render("totalCases", { cases: foundCase });
    })
    .catch(error => {
      console.log(error);
    });
});

app.get("/lawyerCaseRequests", (req, res) => {
  UserAppointment.find({lawyerId: sess.lawyerId, isLawyerApproved: false})
  .populate("userId")
  .then(foundAppointment => {
    res.render("lawyerViewAppointment", {foundAppointment});
  })
  .catch(error => {
    console.log(error);
  });
});

app.get("/lawyerApprovedCases", (req, res) => {
  UserAppointment.find({isLawyerApproved: true})
  .populate("lawyerId")
  .populate("userId")
  .then(foundLawyerApprovedCases => {
    res.render("adminLawyerApprovedCases", {foundLawyerApprovedCases: foundLawyerApprovedCases});
  })
  .catch(error => {
    console.log(error);
  });
});

app.get("/approvedByLawyer", (req, res) => {
  UserAppointment.find({userId: sess.passport.user, isLawyerApproved: true, isUserApproved: false})
  .populate("lawyerId")
  .populate("userId")
  .then(foundCases => {
    res.render("userLawyerApprovedCases", {foundCases: foundCases});
  })
  .catch(error => {
    console.log(error);
  });
});

app.get("/allApprovedCasesByLawyerAndUser", (req, res) => {
  UserAppointment.find({userId: sess.passport.user, isUserApproved: true, isLawyerApproved: true})
  .populate("lawyerId")
  .populate("userId")
  .then(foundAllApprovedCases => {
    res.render("userAllApprovedCases", {foundAllApprovedCases, userType: ""});
  })
  .catch(error => {
    console.log(error);
  });
});

app.get("/caseApprovedByUsers", (req, res) => {
  UserAppointment.find({lawyerId: sess.lawyerId, isLawyerApproved: true, isUserApproved: true})
  .populate("lawyerId")
  .populate("userId")
  .then(foundAllApprovedCases => {
    res.render("userAllApprovedCases", {foundAllApprovedCases, userType: "lawyer"});
  })
  .catch(error => {
    console.log(error);
  });
});

app.post("/signup", function (req, res) {
  const newUser = new User({
    fullName: req.body.fullName,
    dob: req.body.dob,
    gender: req.body.gender,
    username: req.body.username,
    phoneNo: req.body.phoneNo,
    city: req.body.city
  });
  User.register(newUser, req.body.password, function (err, user) {
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

app.post("/userAppointment", function (req, res) {
  var lawyerId = new ObjectId(req.body.lawyerId);
  var data = {
    caseInfo: req.body.caseInfo,
    typeOfUser: req.body.typeOfUser,
    phoneNo: req.body.phoneNo,
    emailId: req.body.emailId,
    lawyerId: lawyerId
  };
  User.findOne({ username: req.body.username }, function (error, foundUser) {
    if (error) {
      console.log(error);
    } else {
      data.userId = foundUser._id;
      UserAppointment.create(data, function (error, createData) {
        if (error) {
          console.log(error);
        } else {
          res.send({ posted: "successfully" });
        }
      });
    }
  });
});

app.post("/lawyerLogin", (req, res) => {
  var data = {
    username: req.body.lawyerUsername,
    password: req.body.lawyerPassword
  };
  sess = req.session;
  Lawyers.findOne(data, (error, foundLawyer) => {
    if (error) {
      console.log(error);
    } else {
      if (foundLawyer) {
        sess.lawyerId = foundLawyer._id;
        res.send({foundLawyer});
      } else {
        res.send({foundLawyer});
      }
      
    }
  });
});

app.post("/lawyerApprovedUserCases", (req, res) => {
  var fees = parseInt(req.body.fees);
  var id = ObjectId(req.body.id);
  var revisedFees = fees + (fees * 0.1);
  UserAppointment.updateOne({_id: id}, {$set: {fees: fees, revisedFees: revisedFees, isLawyerApproved: true}}, function (error, updatedDocument) {
    if (error) {
      console.log(error);
    } else {
      res.send({updatedData: "success"});
    }
  });
});

app.post("/lawyerRejectUserCases", (req, res) => {
  var id = ObjectId(req.body.id);
  var message = req.body.message;
  UserAppointment.findByIdAndRemove(id)
  .populate("lawyerId")
  .populate("userId")
  .then(removedUserAppointment => {
    var mailOptions = {
      from: process.env.EMAIL_ID,
      to: removedUserAppointment.userId.username,
      subject: "Rejection of Appointment by Lawyer",
      html: "Dear " + removedUserAppointment.userId.fullName + " your appointment is rejected by lawyer " + removedUserAppointment.lawyerId.fullname
      + "<br>" + "Reason for rejection is:<br>" + message 
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log(info.response);
      }
    });
    res.json({removedUserAppointment: true});
  })
  .catch(error => {
    console.log(error);
  });
});

app.post("/userApprovedCase", (req, res) => {
  var id = ObjectId(req.body.id);
  UserAppointment.updateOne({_id: id}, {$set: {isUserApproved: true}}, function (error, updatedDocument) {
    if (error) {
      console.log(error);
    } else {
      res.json({caseApproved: true});
    }
  });
});

app.post("/userRejectCase", (req, res) => {
  var id = ObjectId(req.body.id);
  UserAppointment.findByIdAndRemove(id, (error, removedDocument) => {
    if (error) {
      console.log(error);
    } else {
      res.json({removedDocument});
    }
  });
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
