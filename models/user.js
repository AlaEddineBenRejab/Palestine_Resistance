const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    FirstName: {
      type: String,
      required: true,
    },
    LastName: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      required: true,
    },
    Password: {
      type: String,
      required: true,
    },
    ProfilePhoto: {
      type: String,
    },
    OTPReset: {
      type: String,
    },
    OTP: {
      type: String,
    },
    Verified: {
      type: Boolean,
      default: false,
    },
    Token: {
      type: String,
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", userSchema, "users", {
  strict: false,
});
