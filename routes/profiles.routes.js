const router = require("express").Router();
const User = require("../models/User.model");

// require middlewares
const { authorize } = require("../middlewares/authorization");
const { uploadImg } = require("../middlewares/imageUploads");

/* GET/ edit route  */
router.get("/profile/edit", authorize, (req, res, next) => {
  const user = req.session.currentUser;
  
  User.findOne({ username: user.username })
    .then((user) => res.render("profiles/edit.hbs", { user }))
    .catch((err) => next(err));
});

/* middleware user input validation function */
const validateInput = (req, res, next) => {
  const { username, quote } = req.body;

  if (!username) {
    res.render("profiles/edit.hbs", { username, quote, msg: "Please add an username!" });
  } else {
    next();
  }
};
/* POST/ update  */
router.post("/profile/update", upload.single("avatar"), validateInput, (req, res, next) => {
  const user = req.session.currentUser
  const { username, quote } = req.body
  const avatar = (req.file != undefined) ? req.file.path.split("public/")[1] : user.avatar

  User.findOneAndUpdate({ username: user.username }, { username, quote, avatar }, { new: true })
    .then((user) => {
      req.session.currentUser = user
      res.redirect("/profile")
    })
    .catch((err) => next(err));
});

/* GET /profile */
router.get("/profile", authorize, (req, res, next) => {
  const user = req.session.currentUser;

  User.findOne({ username: user.username })
    .populate("groups")
    .then((user) => res.render("profiles/show.hbs", { user }))
    .catch((err) => next(err));
});

module.exports = router;
