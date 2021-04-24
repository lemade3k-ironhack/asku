const router = require("express").Router();
const bcrypt = require("bcryptjs");
const Group = require("../models/Group.model");

/* GET /create group  */
router.get("/profiles/:userId/groups/new", (req, res, next) => {
  res.render("groups/new.hbs");
});


/* POST /new group */
router.post("/profiles/:userId/groups/create", (req, res, next) => {
  const { groupName, image, description } = req.body;

  Group.findOne({ groupName }).then((group) => {
    if (group) {
      res.render("groups/new.hbs", { msg: "Group Name already taken" });
      return;
    }

  Group.create({ groupName, image, description })
    .then((group) => {
      res.redirect(`/groups/${group._id}`)
    })
    .catch((err) => next(err));
  });
});




module.exports = router;