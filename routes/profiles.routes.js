const router = require("express").Router();
const User = require("../models/User.model");
const Group = require("../models/Group.model")

// require middlewares
const authorize = require("../middlewares/authorization").authorize;
const validate = require("../middlewares/validations/profiles");
const uploader = require("../middlewares/cloudinary.config");

/* GET/ edit route  */
router.get("/profile/edit", authorize, (req, res, next) => {
  const { _id, username, quote, avatar } = req.session.currentUser;

  User.findById( _id )
    .then(() => res.render("profiles/edit.hbs", { username, quote, avatar }))
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
    .then((resUser) => {
      // get all users from groups the currentUser is a member of
      const allUsers = resUser.groups.map(group => group.users).flat();
      const uniqueUsers = allUsers.filter((user, i) => allUsers.indexOf(user) === i);

      // we don't want ourself in the friendslist
      let withoutSelf = uniqueUsers.filter(user => {
        return user != resUser.id
      })

      // query users for each id on the list (get only username and avatar)
      const friends = withoutSelf.map(user => {
        return User.findById(user).select('username avatar')
      })

      // get all friends and render page
      Promise.all(friends)
        .then(result => {
          res.render("profiles/show.hbs", { user: resUser, friends: result })
        })
    })
    .catch((err) => next(err));
});

module.exports = router;
