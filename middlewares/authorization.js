const User = require("../models/User.model");
const Group = require("../models/Group.model")

// middleware for user authorization
const authorize = (req, res, next) => {
  if (req.session.currentUser) {
    const user = req.session.currentUser;

    User.findById(user._id)
      .then((user) => {
        req.app.locals.userAvatar = user.avatar;
        req.app.locals.isCurrentUser = true;
        next();
      })
      .catch((err) => next(err));
  } else {
    req.flash("warning", "You are not logged in.")
    res.redirect("/");
  }
};

const authMember = (req, res, next) => {
  const user = req.session.currentUser;
  const groupId = req.params.groupId;

  User.findById(user._id)
    .then((user) => {
      if (!!user.groups.find((group) => group == groupId)) {
        next();
      } else {
        req.flash("warning", "You don't have access to this group.")
        res.redirect("/profile");
      }
    })
    .catch((err) => next(err));
};

const authGroup = (req, res, next) => {
  const groupId = req.params.groupId;
  const movieId = req.params.movieId;

  Group.findById(groupId)
  .then(group => {
    if (!!group.movies.find((movie) => movie == movieId)) {
      next();
    } else {
      req.flash("warning", "You don't have access to this movie.")
      res.redirect("/groups/" + groupId);
    }
  })
  .catch((err) => next(err));
};

module.exports = { authorize, authMember, authGroup };
