const router = require("express").Router();
const User = require("../models/User.model");
require("../models/Group.model");


/* GET /profiles/:userId */
router.get("/profiles/:userId", (req, res, next) => {
  User.findById(req.params.userId)
    .populate("groups")
    .then((user) => res.render("profiles/show.hbs", { user }))
    .catch((err) => next(err));
});


/* GET/ edit route  */
router.get("/profiles/:userId/edit", (req, res, next) => {
  const {userId} = req.params

  User.findById(userId)
    .then((user) => {
      res.render("profiles/edit.hbs", { user })
    })
    .catch((err) => console.log(err))
})

/* middleware user input validation function */

const validateInput = (req, res, next) => {
  const { username, avatar, quote } = req.body;
  const { userId } = req.params

  if (!username) {
    res.render("profiles/edit.hbs", { user: { _id: userId, username: username, avatar: avatar, quote: quote }, msg: "Please add an username!" });
  } else {
    next();
  }
};

/* POST/ update  */
router.post("/profiles/:userId/edit", validateInput, (req, res, next) => {
  const { userId } = req.params
  const { username, avatar, quote } = req.body

  User.findByIdAndUpdate(userId, { username, avatar, quote })
    .then((user) => {
      res.redirect(`/profiles/${user._id}`)
    })
    .catch((err) => console.log(err))
})

module.exports = router;
