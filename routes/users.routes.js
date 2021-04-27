const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");

/* GET / */
router.get("/", (req, res, next) => {
  req.session.currentUser ? res.redirect("/profile") : res.render("users/signin.hbs")
});

/* Custom Middleware: Validate user input */
const validateEmpty = (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render("users/signup.hbs", { msg: "Please fill all the fields!" });
  }
  next();
};

/* POST/ singin */
router.post("/signin", validateEmpty, (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render("users/signin.hbs", {
          msg:
            "Oh no, something went wrong! Please check again if your username or password are correct!",
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

/* Custom Middleware: Validate user input */
const validateNewEmpty = (req, res, next) => {
  const { username, password, passwordConfirmation } = req.body;

  if (!username || !password || !passwordConfirmation) {
    res.render("users/signup.hbs", { msg: "Please fill all the fields!" });
  }
  next();
};

const validPwd = (req, res, next) => {
  const { username, password, passwordConfirmation } = req.body;
  const pwReg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;
  const renderFormWithError = (err) => {
    res.render("users/signup.hbs", {
      username,
      password,
      passwordConfirmation,
      msg: err,
    });
  };

  if (!pwReg.test(String(password))) {
    renderFormWithError(
      "Password must have at least 8 characters, contain a number, upper and lower letters"
    );
  } else if (!(password === passwordConfirmation)) {
    renderFormWithError(
      "Password and Password Confirmation do not match. Please try again"
    );
  } else {
    next();
  }
};

/* POST /signup */
router.post("/signup", validateNewEmpty, validPwd, (req, res, next) => {
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
