const multer = require("multer");
const path = require("path");

/* define storage */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(
      null,
      path.join(__dirname, "../", "public", "uploads", "users", "avatars")
    );
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

/* set storage and validate size of image */
const uploadImg = multer({
  storage: storage,
  limits: {
    fileSize: 1000000,
  },
});

module.exports = { uploadImg }