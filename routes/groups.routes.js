const router = require("express").Router();
const Group = require("../models/Group.model");
const User = require("../models/User.model");

// middleware for authorization
const authorize = (req, res, next) => {
  req.session.currentUser ? next() : res.redirect("/");
};

/* GET /groups/new  */
router.get("/groups/new", authorize, (req, res) => {
  res.render("groups/new.hbs");
});

/* middleware to validate user input */
const validateInput = (req, res, next) => {
  const { groupName, image, description } = req.body;

  if (!groupName) {
    res.render("groups/new.hbs", { 
      groupName, image, description, 
      msg: "Please add a name for your group!" 
    });
  } else {
    next();
  }
};

/* POST /groups/create */
router.post("/groups/create", validateInput, (req, res, next) => {
  const { groupName, image, description } = req.body;
  const user = req.session.currentUser;

  Group.findOne({ groupName }).then((group) => {
    if (group) {
      res.render("groups/new.hbs", {
        groupName, image, description,
        msg: "Group Name already taken",
      });
      return;
    }

    Group.create({ groupName, image, description, members: [user._id] })
      .then((group) => {
        User.findOneAndUpdate(
          { username: user.username },
          { $push: { groups: group._id } }
        ).then(() => res.redirect("/profile"));
      })
      .catch((err) => next(err));
  });
});

/* GET /groups/:groupId/edit  */
router.get("/groups/:groupId/edit", authorize, (req, res, next) => {
  const groupId = req.params.groupId;

  Group.findById( groupId )
    .then((group) => res.render("groups/edit.hbs", { group }))
    .catch((err) => next(err));
});

/* middleware to validate user input */
const validateEdit = (req, res, next) => {
  const { groupName, image, description } = req.body;

  if (!groupName) {
    res.render("groups/edit.hbs", {
      groupName, image, description, 
      msg: "Please add a name for your group!",
    });
  } else {
    next();
  }
};

/* POST /groups/:groupId/update  */
router.post("/groups/:groupId/update", authorize, validateEdit, (req, res, next) => {
  const { groupName, image, description } = req.body;
  const groupId = req.params.groupId

  Group.findByIdAndUpdate(groupId, { groupName, image, description })
    .then(() => { res.redirect("/groups/" + groupId)})
    .catch((err) => next(err));
});

/* GET /groups/:groupId  */
router.get("/groups/:groupId", authorize, (req, res, next) => {
  const groupId = req.params.groupId;

  Group.findById(groupId)
    .then((group) => res.render("groups/show.hbs", { group }))
    .catch((err) => next(err));
});

module.exports = router;
