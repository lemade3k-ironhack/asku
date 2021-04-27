const router = require("express").Router();
const Group = require("../models/Group.model");
const Movie = require("../models/Movie.model");

const authorize = require("../middlewares/authorization");
const validate = require("../middlewares/validations/movies")
const uploader = require("../middlewares/cloudinary.config");

/* GET groups/:groupId/movies */
router.get("/groups/:groupId/movies", authorize, (req, res, next) => {
  const groupId = req.params.groupId;

  Group.findById(groupId)
    .populate("movies")
    .then((group) =>
      res.render("movies/index.hbs", { group, movies: group.movies })
    )
    .catch((err) => next(err));
});

/* GET groups/:groupId/movies/new */
router.get("/groups/:groupId/movies/new", authorize, (req, res) => {
  const groupId = req.params.groupId;

  res.render("movies/new.hbs", { groupId });
});

/* POST groups/:groupId/movies/create */
router.post("/groups/:groupId/movies/create", authorize, uploader.single("image"), validate, (req, res) => {
  const groupId = req.params.groupId;
  const { title, plot, genre, director, image, trailer } = req.body;
  const newImg = (req.file != undefined) ? req.file.path : image;

  Movie.create({ 
    title, plot, genre, director, image: newImg, trailer, _group: groupId,
  })
    .then((movie) => {
      Group.findByIdAndUpdate(groupId, {
        $push: { movies: movie._id },
      }).then(() => res.redirect(`/groups/${groupId}/movies`));
    })
    .catch((err) => next(err));
  }
);

/* GET groups/:groupId/movies/:movieId/edit */
router.get("/groups/:groupId/movies/:movieId/edit", authorize, (req, res, next) => {
    const movieId = req.params.movieId;
    const groupId = req.params.groupId;

    Movie.findById(movieId)
      .then((movie) => res.render("movies/edit.hbs", { movie, groupId }))
      .catch((err) => next(err));
  }
);

/* POST /groups/:groupId/movies/:movieId/update */
router.post("/groups/:groupId/movies/:movieId/update", authorize, uploader.single("image"), validate, (req, res, next) => {
    const movieId = req.params.movieId;
    const groupId = req.params.groupId;
    const { title, plot, genre, director, image, trailer } = req.body;
    const newImg = (req.file != undefined) ? req.file.path : image;

    Movie.findByIdAndUpdate(movieId, {
      title, plot, genre, director, image: newImg, trailer,
    })
      .then(() => res.redirect(`/groups/${groupId}/movies/${movieId}`))
      .catch((err) => next(err));
  }
);

/* GET groups/:groupId/movies/:movieId */
router.get("/groups/:groupId/movies/:movieId", authorize, (req, res, next) => {
  const movieId = req.params.movieId;
  const groupId = req.params.groupId;

  Movie.findById(movieId)
    .populate("group")
    .then((movie) => res.render("movies/show.hbs", { movie, groupId }))
    .catch((err) => next(err));
});

module.exports = router;
