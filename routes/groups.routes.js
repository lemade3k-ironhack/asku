const router = require("express").Router();
const Group = require("../models/Group.model");

// middleware for authorization
const authorize = (req, res, next) => {
  req.session.currentUser ? next() : res.redirect("/", { msg: "You are not logged in" });
};

/* GET /create group  */
router.get("/groups/new", (req, res, next) => {
  res.render("groups/new.hbs");
});

/* middleware user input validation function */
const validateInput = (req, res, next) => {
const { groupName, image, description } = req.body;

  if (!groupName) {
    res.render("groups/new.hbs", { groupName, image, description, msg: "Please add a name for your group!" });
  } else {
    next();
  }
};

/* POST /new group */
router.post("/groups/create", validateInput, (req, res, next) => {
  const { groupName, image, description } = req.body

  Group.findOne({ groupName })
    .then((group) => {

      if (group) {
        res.render("groups/new.hbs", { groupName, image, description, msg: "Group Name already taken" });

        return;
      }
      Group.create({ groupName, image, description })
        .then((group) => res.redirect("/profile"))
        .catch((err) => next(err));
    });
});






/* GET/ edit group  */
router.get("/groups/:groupName/edit", authorize, (req, res, next) => {
  const groupName = req.params.groupName;
  
  Group.findOne({ groupName })
    .then((group) => { 
      res.render("groups/edit.hbs", { group })
    })
    .catch((err) => next(err));
});

/* middleware user input validation function */
const validateEdit = (req, res, next) => {
  const { groupName, image, description, members, movies } = req.body;

  if (!groupName) {
    res.render(`groups/${{ groupName }}/edit.hbs`, { groupName, image, description, members: [user._id], msg: "Please add a name for your group!" });
  } else {
    next();
  }
};

/* POST/ update  */
router.post("/groups/:groupName/update", validateEdit, (req, res, next) => {
  const user = req.session.currentUser
  const { groupName, image, description, members, movies } = req.body

  Group.findOneAndUpdate(groupName, { groupName, image, description })
    .then((group) => {
      req.session.currentUser = user
      res.redirect("/groups/" + groupName)
    })
    .catch((err) => next(err));
});




module.exports = router;