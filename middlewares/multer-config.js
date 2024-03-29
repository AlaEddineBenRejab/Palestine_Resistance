const { diskStorage } = require("multer");
const { join } = require("path");
const multer = require("multer");

const storage = diskStorage({
  destination: (req, file, callback) => {
    callback(null, join(__dirname, ".." + process.env.IMGURL));
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(png|jpg|jpeg|JPG|PNG|JPEG)$/)) {
    return cb(new Error("Please upload an image"));
  }
  cb(null, true);
};

const multerMiddleware = multer({ storage, fileFilter }).single("ProfilePhoto");

module.exports = { multerMiddleware };
