/* validate user input on group create */
const validate = (req, res, next) => {
  const group = req.body;
  group.image = (req.file != undefined) ? req.file.path : req.body.oldImg;
  const path = req.route.path.match("create") ? "groups/new.hbs" : "groups/edit.hbs";

  if (!group.groupName) {
    res.render(path, { group, msg: "Please add a name for your group!" });
  } else {
    next();
  }
};

module.exports = validate;