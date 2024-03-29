const express = require("express");

const {
  register,
  login,
  emailVerification,
  logout,
} = require("../controllers/authcontroller");
const {
  deleteOnce,
  getAll,
  getById,
  resetPassword,
  sendOTPResetEmail,
  updateOnce,
  updatePassword,
  updatePhoto,
} = require("../controllers/userController.js");
const multer = require("../middlewares/multer-config.js");
const { checkCurrentUser } = require("../middlewares/verifyToken.js");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/emailVerification", emailVerification);

router.get("/", getAll);
router.delete("/:id", deleteOnce);
router.post("/OTPReset", sendOTPResetEmail);
router.post("/ResetPassword", resetPassword);

// Routes with jwt
router.get("/showProfile", checkCurrentUser, getById);
router.put("/update", checkCurrentUser, updateOnce);
router.put(
  "/updatePhoto",
  checkCurrentUser,
  multer.multerMiddleware,
  updatePhoto
);
router.put("/updatePassword", checkCurrentUser, updatePassword);
router.post("/logout", checkCurrentUser, logout);

module.exports = router;
