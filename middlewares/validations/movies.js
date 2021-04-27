/* validate user input on movie create or update */
const validate = (req, res, next) => {
  const movie = req.body;
  const path = req.route.path.match("create") ? "movies/new.hbs" : "movies/edit.hbs";

  if (!movie.title) {
    res.render(path, { movie, msg: "Title must be filled out!" });
  } else {
    next();
  }
};

module.exports = { validate };
