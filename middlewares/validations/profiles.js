/* validate user input on profile/update */
const validate = (req, res, next) => {
  const { username, quote } = req.body;
  const avatar = (req.file != undefined) ? req.file.path : req.body.oldImg;

  if (!username) {
    res.render("profiles/edit.hbs", { username, quote, avatar, msg: "Please add an username!" });
  } else {
    next();
  }
};

module.exports = validate