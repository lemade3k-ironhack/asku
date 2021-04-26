const router = require("express").Router();

/* GET groups/:groupId/movies/new */
router.get("/groups/:groupId/movies/new", (req, res) => {
  const groupId = req.params.groupId;
  res.render("movies/new.hbs", { groupId });
});

module.exports = router;
