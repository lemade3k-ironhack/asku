const router = require("express").Router();
const User = require("../models/User.model");
require("../models/Group.model");

/* GET /profile/:userId */
router.get("/profile/:userId", (req, res) => {
  User.findById(req.params.userId)
    .populate("groups")
    .then((user) => {
      res.render("profiles/show.hbs", { user });
    })
    .catch((err) => console.log(err));
});

module.exports = router;
