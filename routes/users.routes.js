const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const { validateSignin, validateSignup } = require("../middlewares/validations/users")

/* GET / */
router.get("/", (req, res) => {
  req.session.currentUser ? res.redirect("/profile") : res.render("users/signin.hbs")
});

/* POST/ singin */
router.post("/signin", validateSignin, (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render("users/signin.hbs", {
          username, password,
          msg:
            "Please check again if your username or password are correct!",
        });
      } else {
        bcrypt.compare(password, user.password).then((isMatching) => {
          if (isMatching) {
            req.app.locals.isCurrentUser = true;
            req.session.currentUser = user;
            
            res.redirect(`/profile`);
          } else {
            res.render("users/signin.hbs", {
              username, password, 
              msg: "Please check if username or password are correct.",
            });
          }
        });
      }
    })
    .catch((err) => next(err));
});

/* GET /signup */
router.get("/signup", (req, res) => {
  res.render("users/signup.hbs");
});

/* POST /signup */
router.post("/signup", validateSignup, (req, res, next) => {
  const { username, password, passwordConfirmation } = req.body;
  const salt = bcrypt.genSaltSync(12);
  const hash = bcrypt.hashSync(password, salt);

  User.findOne({ username }).then((user) => {
    if (user) {
      res.render("users/signup.hbs", {
        username, password, passwordConfirmation,
        msg: "Username already taken",
      });
      return;
    }

    User.create({ username, password: hash })
      .then((user) => {
        req.app.locals.isCurrentUser = true;
        req.session.currentUser = user;
        res.redirect("/profile");
      })
      .catch((err) => next(err));
  });
});

/* GET /logout */
router.get("/logout", (req, res) => {
  req.app.locals.isCurrentUser = false;
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
