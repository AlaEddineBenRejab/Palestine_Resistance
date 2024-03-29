const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { verificationEmail } = require("../utils/verificationEmail.js");

const register = async function (req, res) {
  const { FirstName, LastName, Email, Password } = req.body;

  if (!(Email && Password && FirstName && LastName)) {
    res.status(400).send("All fields are required");
  }

  const oldUser = await User.findOne({ Email });
  if (oldUser) {
    return res.status(409).send("User already exists");
  }
  // Generate an OTP for email verification
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  let NewUser = new User({
    FirstName,
    LastName,
    Email: Email.toLowerCase(),
    Password: await bcrypt.hash(Password, 10),
    ProfilePhoto: `${req.protocol}://${req.get("host")}${
      process.env.IMGURL
    }/default.png`,
    OTP: otp,
  });

  User.create(NewUser)
    .then((docs) => {
      verificationEmail(docs.Email, "Email verification", otp)
        .then(() => {
          res.status(201).json(docs);
        })
        .catch((emailErr) => {
          // Handle email sending error
          console.log(emailErr);
          res.status(500).json({ error: "Error sending verification email" });
        });
    })
    .catch((err) => {
      console.error(err); // Log the error for debugging
      res.status(500).json({ error: "Internal server error" });
    });
};

const login = async function (req, res) {
  const { Email, Password } = req.body;

  if (!(Email && Password)) {
    res.status(400).send("All fields are required");
  }

  const user = await User.findOne({ Email: req.body.Email.toLowerCase() });

  if (user) {
    if (await bcrypt.compare(Password, user.Password)) {
      const newToken = await jwt.sign({ id: user._id }, process.env.TOKENKEY, {
        expiresIn: "4d",
      });
      user.Token = newToken;
      user
        .updateOne({ _id: user._id, Token: newToken })
        .then(async (docs) => {
          res.status(200).json({
            Token: newToken,
            FirstName: user.FirstName,
            LastName: user.LastName,
            Email: user.Email,
            ProfilePhoto: user.ProfilePhoto,
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ error: err });
        });
    } else {
      res.status(401).send("Invalid credentials");
    }
  } else {
    res.status(404).send("Unexistant user");
  }
};

const emailVerification = async function (req, res) {
  const { Email, OTP } = req.body;

  const user = await User.findOne({ Email: Email });

  if (!user) {
    return res.status(400).send("User not found");
  }

  if (user.OTP !== OTP) {
    return res.status(400).send("Invalid OTP");
  }

  // Mark user email as verified
  user.Verified = true;
  user.OTP = undefined;
  await user.save();

  res.status(200).send("Your email has been verified");
};

const logout = async function (req, res) {
  const user = await User.findById(req.id);
  if (user.Token == null) {
    res.status(500).json({ error: "User already logged out" });
  } else {
    await User.findOneAndUpdate(
      { _id: req.id },
      {
        Token: null,
      }
    )
      .then((docs) => {
        res.status(200).json({ message: "Logout successful" });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }
};

module.exports = { register, login, emailVerification, logout };
