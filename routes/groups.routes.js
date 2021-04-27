const router = require("express").Router();
const Group = require("../models/Group.model");

/* GET /groups/new  */
router.get("/groups/new", (req, res) => {
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

/* POST /groups/create */
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

/* GET /groups/:groupId  */
router.get("/groups/:groupId", (req, res) => {
  res.render("groups/show.hbs");
});

module.exports = router;