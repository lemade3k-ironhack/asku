/* validate user input on profile/update */
const validate = (req, res, next) => {
  const { username, quote } = req.body;

  if (!username) {
    res.render("profiles/edit.hbs", { username, quote, msg: "Please add an username!" });
  } else {
    next();
  }
};

module.exports = validate