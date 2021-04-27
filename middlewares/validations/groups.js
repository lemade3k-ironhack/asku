/* validate user input on group create */
const validate = (req, res, next) => {
  const group = req.body;
  const path = req.route.path
  console.log(group)
  if (!group.groupName) {
    if (path.match("create")) {
      res.render(`groups/new.hbs`, { 
        group, 
        msg: "Please add a name for your group!" 
      });
    } else if (path.match("update")) {
      res.render(`groups/edit.hbs`, { 
        group, 
        msg: "Please add a name for your group!" 
      });
    }
  } else {
    next();
  }
};

module.exports = { validate }