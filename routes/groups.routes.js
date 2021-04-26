const router = require("express").Router();
const bcrypt = require("bcryptjs");
const Group = require("../models/Group.model");
const User = require("../models/User.model");

/* GET /create group  */
router.get("/profile/groups/new", (req, res, next) => {
  res.render("groups/new.hbs");
});


/* POST /new group */
router.post("/profile/groups/create", (req, res, next) => {
  const user = req.session.currentUser;
  const {groupName, image, description, members, movies} = req.body

  Group.findOne({groupName})
  .then((group) => {
    console.log(group);

    if (group) {
      res.render("groups/new.hbs", { msg: "Group Name already taken" });
      return;
    }

  Group.create({ groupName, image, description})
    .then((group) => res.redirect("/profile"))
    .catch((err) => next(err));
  });
});

module.exports = router;