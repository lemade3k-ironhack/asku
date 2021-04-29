/* validate user input on group create */
const validate = (req, res, next) => {
  const group = req.body;
  group._id = req.params.groupId
  group.image = (req.file != undefined) ? req.file.path : req.body.oldImg;
  const path = req.route.path.match("create") ? "groups/new.hbs" : "groups/edit.hbs";

  if (!group.groupName) {
    res.render(path, { groupId: group._id, group, msg: "Please add a name for your group!" });
  } else {
    next();
  }
};

module.exports = validate;