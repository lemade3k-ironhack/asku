const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");

/* GET / */
router.get("/", (req, res, next) => {
  res.render("users/signin.hbs");
});

/* GET /signup */
router.get("/signup", (req, res) => {
  res.render("users/signup.hbs")
})

/* POST /signup */
router.post("/signup", (req, res) => {
  const { username, password } = req.body;
  const salt = bcrypt.genSaltSync(12);
  const hash = bcrypt.hashSync(password, salt);

  User.findOne({ username }).then((user) => {
    if (user) {
      res.render("users/signup.hbs", { msg: "Username already taken" });
      return;
    }

    User.create({ username, password: hash })
      .then((user) => res.redirect(`/users/${user._id}/profile`))
      .catch((err) => next(err));
  });
})

module.exports = router;
