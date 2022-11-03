const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs-extra");
const user = require("../Model/SingupModel"); // const user = new mongoose.model("user", SingupSchema);
const checkLogin = require("../middleware/checkLogin");
// router
// upload path folder
const UPLOAD_FOLDER = `${__dirname}../../Upload/UserPhoto`;
// file uplaod
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_FOLDER);
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);
    const fileName =
      file.originalname
        .replace(fileExt, "")
        .toLowerCase()
        .split(" ")
        .join("-") +
      "-" +
      Date.now();
    const finalFile = fileName + fileExt;
    cb(null, finalFile);
  },
});

const uplaod = multer({
  storage: storage,
  limits: {
    fileSize: 2000000, // 2MB
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only jpg, png ,jpg formate allowed!"));
    }
  },
});
router.post("/singUp", uplaod.single("file"), async (req, res) => {
  // save images bufer to database
  const pathfile = `${__dirname}../../Upload/UserPhoto/${req.file.filename}`;
  const newFile = fs.readFileSync(pathfile);
  const encImg = newFile.toString("base64");
  const image = {
    contentType: req.file.mimetype,
    size: req.file.size,
    img: Buffer(encImg, "base64"),
  };

  const newUser = new user({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    img: image,
  });
  newUser.save((err) => {
    if (err) {
      res.status(500).json({
        error: "thare was a server side error",
      });
    } else {
      fs.remove(pathfile, (err) => {
        if (err) {
          res.status(500).json({
            error: "images remove faild",
          });
        }
      });
      res.status(500).json({
        message: "Submit Successful",
      });
    }
  });
});
// all user load
router.get("/allUser", checkLogin, (req, res) => {
  user.find({}, (err, data) => {
    if (err) {
      res.status(500).json({
        error: "thare was a server side error",
      });
    } else {
      res.status(200).json(data);
    }
  });
});
module.exports = router;
