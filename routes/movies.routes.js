const router = require("express").Router();
const Group = require("../models/Group.model");
const Movie = require("../models/Movie.model");

// middleware for authorization
const authorize = (req, res, next) => {
  if (req.session.currentUser) {
    req.app.locals.isCurrentUser = true;
    next()
  } else { 
    res.redirect("/")
  }
};

/* GET groups/:groupId/movies/new */
router.get("/groups/:groupId/movies/new", authorize, (req, res) => {
  const groupId = req.params.groupId;

  res.render("movies/new.hbs", { groupId });
});

/* Custom Middleware: Validate user input */
const validateEmpty = (req, res, next) => {
  const movie = req.body;

  if (!movie.title) {
    res.render("movies/new.hbs", { movie, msg: "Title must be filled out!" });
  } else {
    next();
  }
};

/* POST groups/:groupId/movies/create */
router.post("/groups/:groupId/movies/create", authorize, validateEmpty, (req, res) => {
    const { title, plot, genre, director, image, trailer } = req.body;
    const groupId = req.params.groupId;

    Movie.create({ 
      title, plot, genre, director, image, trailer, _group: groupId,
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

/* Custom Middleware: Validate user input */
const validateEmptyUpdate = (req, res, next) => {
  const movie = req.body;

  if (!movie.title) {
    res.render("movies/edit.hbs", { movie, msg: "Title must be filled out" });
  } else {
    next();
  }
};

/* POST /groups/:groupId/movies/:movieId/update */
router.post("/groups/:groupId/movies/:movieId/update", authorize, validateEmptyUpdate, (req, res, next) => {
    const movieId = req.params.movieId;
    const groupId = req.params.groupId;
    const { title, plot, genre, director, image, trailer } = req.body;

    Movie.findByIdAndUpdate(movieId, {
      title, plot, genre, director, image, trailer,
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

module.exports = router;
