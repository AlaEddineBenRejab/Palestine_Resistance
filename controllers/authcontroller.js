const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

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
      res.status(201).json(docs);
      //verificationEmail(docs.Email, "Email verification", otp);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
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

module.exports = { register, login };
