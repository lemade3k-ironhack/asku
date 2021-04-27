const User = require("../models/User.model")

// middleware for user authorization
const authorize = (req, res, next) => {
  if (req.session.currentUser) {
    const user = req.session.currentUser;
    
    User.findById( user._id)
    .then((user) => { 
      req.app.locals.userAvatar = user.avatar
      req.app.locals.isCurrentUser = true; 
      next()
    })
    .catch((err) => next(err));
  } else { 
    res.redirect("/")
  }
};

module.exports = authorize