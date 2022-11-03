const express = require("express");
const router = express.Router();
const user = require("../Model/SingupModel");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await user.findOne({ email: email });
    if (userData.password === password) {
      const token = jwt.sign(
        {
          email: userData.email,
          name: userData.name,
          userId: userData._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
      res.status(200).json({
        data: userData,
        access_token: token,
        success: " Login Successful !",
      });
    } else {
      res.status(500).json({
        passwordError: "Password not match",
      });
    }
  } catch (error) {
    res.status(400).json({
      error: "invalid Email address",
    });
  }
});

// forget password // reset password

router.post("/forget-password", async (req, res) => {
  const { email } = req.body;
  try {
    const oldUser = await user.findOne({ email: email });
    if (!oldUser) {
      return res.status(500).json({
        error: "user not exists !!",
      });
    }
    const secret = process.env.JWT_SECRET + oldUser.password;
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "30m",
    });
    const link = `http://localhost:5000/user/reset-password/${oldUser._id}/${token}`;

    // nodemailer--------------------

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "mehediboss1971@gmail.com",
        pass: "gzksxkjfqbconrgw",
      },
    });

    const mailOptions = {
      from: "mehediboss1971@gmail.com",
      to: `${oldUser.email}`,
      subject: "Password Reset",
      text: ` Click this Link and reset your password: ${link}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        // console.log(error);
        res.status(500).json({
          mailError: "something worng",
        });
      } else {
        // console.log("Email sent: " + info.response);
        res.status(200).json({
          mailMessage: "Check Your Email",
        });
      }
    });
    // nodemailer--------------------
  } catch (error) {
    res.status(500).json({
      err: "there was a server side error",
    });
  }
});

router.get("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  try {
    const oldUser = await user.findOne({ _id: id });
    if (!oldUser) {
      return res.status(500).json({
        error: "user not exists !!",
      });
    }
    const secret = process.env.JWT_SECRET + oldUser.password;
    const verify = jwt.verify(token, secret);
    const { email } = verify;
    res.render("index", { email: email,status:"not verfied" });
  } catch (error) {
    res.send("not verifed");
  }
});

// update password
router.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  try {
    const oldUser = await user.findOne({ _id: id });
    if (!oldUser) {
      return res.status(500).json({
        error: "user not exists !!",
      });
    }
    const secret = process.env.JWT_SECRET + oldUser.password;
    const verify = jwt.verify(token, secret);
    await user.updateOne(
      { _id: id },
      {
        $set: {
          password: password,
        },
      }
    );

    res.json({
      message: "update successful",
    });

  } catch (error) {
    res.send("not verifed");
  }
});

module.exports = router;
