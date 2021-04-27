const router = require("express").Router();
const User = require("../models/User.model");

// require middlewares
const { authorize } = require("../middlewares/authorization");
const { validate } = require("../middlewares/validations/profiles");
const uploader = require("../middlewares/cloudinary.config");

/* GET/ edit route  */
router.get("/profile/edit", authorize, (req, res, next) => {
  const user = req.session.currentUser;

  User.findById( user._id )
    .then((user) => res.render("profiles/edit.hbs", { user }))
    .catch((err) => next(err));
});

/* POST/ update  */
router.post("/profile/update", authorize, uploader.single("avatar"), validate,
  (req, res, next) => {
    const user = req.session.currentUser;
    const { username, quote } = req.body;
    const avatar = (req.file != undefined) ? req.file.path : user.avatar;

    User.findByIdAndUpdate(user._id, { username, quote, avatar }, { new: true })
      .then((user) => {
        req.session.currentUser = user;
        res.redirect("/profile");
      })
      .catch((err) => next(err));
  }
);

/* GET /profile */
router.get("/profile", authorize, (req, res, next) => {
  const user = req.session.currentUser;

  User.findById( user._id )
    .populate("groups")
    .then((user) => res.render("profiles/show.hbs", { user }))
    .catch((err) => next(err));
});

module.exports = router;
