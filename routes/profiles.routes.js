const router = require("express").Router();
const User = require("../models/User.model");
require("../models/Group.model");

/* GET /profile/:userId */
router.get("/profiles/:userId", (req, res, next) => {
  User.findById(req.params.userId)
    .populate("groups")
    .then((user) => res.render("profiles/show.hbs", { user }))
    .catch((err) => next(err));
});

module.exports = router;
