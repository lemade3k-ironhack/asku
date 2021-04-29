const router = require("express").Router();
const Group = require("../models/Group.model");
const Movie = require("../models/Movie.model");

const { authorize, authMember, authGroup } = require("../middlewares/authorization");
const validate = require("../middlewares/validations/movies");
const uploader = require("../middlewares/cloudinary.config");

/* GET groups/:groupId/movies/new */
router.get("/groups/:groupId/movies/new", authorize, authMember, (req, res) => {
  res.render("movies/new.hbs", { groupId: req.params.groupId });
});

/* POST groups/:groupId/movies/create */
router.post(
  "/groups/:groupId/movies/create",
  authorize, authMember,
  uploader.single("image"),
  validate,
  (req, res, next) => {
    const groupId = req.params.groupId;
    const { title, year, plot, genre, director, cast, trailer } = req.body;
    const image = (req.file != undefined) ? req.file.path : "/images/movieDummy.png";

    Movie.create({
      title, year, plot, genre, director, cast, image, trailer, _group: groupId,
    })
      .then((movie) => {
        Group.findByIdAndUpdate(groupId, {
          $push: { movies: movie._id },
        }).then(() => res.redirect(`/groups/${groupId}`));
      })
      .catch((err) => next(err));
  }
);

/* GET groups/:groupId/movies/:movieId/edit */
router.get(
  "/groups/:groupId/movies/:movieId/edit", 
  authorize, authMember, authGroup, 
  (req, res, next) => {
    const movieId = req.params.movieId;
    const groupId = req.params.groupId;

    Movie.findById(movieId)
      .then((movie) => res.render("movies/edit.hbs", { movie, groupId }))
      .catch((err) => next(err));
  }
);

/* POST /groups/:groupId/movies/:movieId/update */
router.post(
  "/groups/:groupId/movies/:movieId/update",
  authorize, authMember, authGroup,
  uploader.single("image"),
  validate,
  (req, res, next) => {
    const movieId = req.params.movieId;
    const groupId = req.params.groupId;
    const { title, year, plot, genre, director, cast, trailer } = req.body;
    const image = (req.file != undefined) ? req.file.path : req.body.oldImg;

    Movie.findByIdAndUpdate(movieId, {
      title, year, plot, genre, director, cast, image, trailer,
    })
      .then(() => res.redirect(`/groups/${groupId}/movies/${movieId}`))
      .catch((err) => next(err));
  }
);

/* GET groups/:groupId/movies/:movieId */
router.get(
  "/groups/:groupId/movies/:movieId", 
  authorize, authMember, authGroup, 
  (req, res, next) => {
    const movieId = req.params.movieId;
    const groupId = req.params.groupId;

    Movie.findById(movieId)
      .populate("group")
      .then((movie) => res.render("movies/show.hbs", { movie, groupId }))
      .catch((err) => next(err));
  }
);

module.exports = router;
