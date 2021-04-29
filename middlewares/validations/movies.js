/* validate user input on movie create or update */
const validate = (req, res, next) => {
  const groupId = req.params.groupId;
  const movie = req.body;
  movie._id = req.params.movieId;
  movie.image = (req.file != undefined) ? req.file.path : req.body.oldImg;
  const path = req.route.path.match("create") ? "movies/new.hbs" : "movies/edit.hbs";

  if (!movie.title) {
    res.render(path, { groupId, movie, msg: "Title must be filled out!" });
  } else {
    next();
  }
};

module.exports = validate;
