const router = require("express").Router();

const User = require("../models/User.model");
require("../models/Group.model");

// middleware for authorization
const authorize = (req, res, next) => {
  req.session.currentUser ? next() : res.redirect("/", { msg: "You are not logged in" });
};

/* GET /profile */
router.get("/profile", authorize, (req, res, next) => {
  const user = req.session.currentUser;

  User.findOne({ username: user.username })
    .populate("groups")
    .then((user) => res.render("profiles/show.hbs", { user }))
    .catch((err) => next(err));
});

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
router.post("/profile/update", validateInput, (req, res, next) => {
  const user = req.body;

  User.findOneAndUpdate({ username: user.username }, user)
    .then(() => res.redirect("/profile"))
    .catch((err) => next(err));
});

module.exports = router;
