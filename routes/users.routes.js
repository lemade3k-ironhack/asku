const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");

/* GET / */
router.get("/", (req, res, next) => {
  res.render("users/signin.hbs");
});

/* GET /signup */
router.get("/signup", (req, res) => {
  res.render("users/signup.hbs");
});


/* Custom Middleware: Validate user input 
   ToDo: refactor - move validation to another file 
   or maybe start using express-validation package
*/
const validateEmpty = (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render("users/signup.hbs", { msg: "Please fill all the fields!" });
  }
  next();
};

const validPwd = (req, res, next) => {
  const { username, password } = req.body;
  const pwReg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;

  if (!pwReg.test(String(password))) {
    res.render("users/signup.hbs", {
      username,
      password,
      msg:
        "Password must have at least 8 characters, contain a number, upper and lower letters",
    });
  }
  next();
};

/* POST /signup */
router.post("/signup", validateEmpty, validPwd, (req, res) => {
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
});


/* GET/ signin */
router.get("/signin", (req, res, next) => {
  res.render("users/signin.hbs");
});

/* POST/ singin */
router.post("/signin", (req, res, next) => {
  const { username, password } = req.body
  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render("users/signin.hbs", { msg: 'Oh no, something went wrong! Please check again if your username or password are correct!' })
      }
      else {
        bcrypt.compare(password, user.password)
          .then((isMatching) => {
            if (isMatching) {
              //req.session.userInfo = user
              //req.app.locals.isUserLoggedIn = true

              res.redirect(`/profile/${user._id}`)
            }
            else {
              res.render("users/signin.hbs", { msg: "Please check if username or password are correct." })
            }
          })
      }
    })
    .catch((err) => {
      next(err)
    })
})


module.exports = router;
