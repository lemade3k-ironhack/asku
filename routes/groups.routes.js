const router = require("express").Router();

const Group = require("../models/Group.model");
const User = require("../models/User.model");

// require middlewares
const { authorize, authMember } = require("../middlewares/authorization");
const validate = require("../middlewares/validations/groups")
const uploader = require("../middlewares/cloudinary.config");

// require helpers
const updateMembers = require("../helpers/groups.helpers")

/* GET /groups/new  */
router.get("/groups/new", authorize, (req, res) => {
  res.render("groups/new.hbs");
});

/* POST /groups/create */
router.post("/groups/create", authorize, uploader.single("image"), validate, async (req, res, next) => {
  const user = req.session.currentUser;
  const { groupName, image, description } = req.body;
  const newImg = (req.file != undefined) ? req.file.path : image;
  // wait for helper functions promises to finish before returning something
  const groupMembers = await updateMembers(members, user)

  Group.findOne({ groupName }).then((group) => {
    // if groupname already exists render form with message 
    if (group) {
      res.render("groups/new.hbs", {
        groupName, description,
        msg: "Group Name already taken",
      });
      return;
    }
  
    Group.create({ groupName, image: newImg, description, users: groupMembers })
      .then((group) => {
        const groupId = group._id
        User.findOneAndUpdate({ username: user.username }, { $push: { groups: groupId } })
        .then(() => res.redirect("/groups/" + groupId));
      })
      .catch((err) => next(err));
  });
});

/* GET /groups/:groupId/edit  */
router.get("/groups/:groupId/edit", authorize, authMember, (req, res, next) => {
  const groupId = req.params.groupId;
  const currentUser = req.session.currentUser

  Group.findById( groupId )
    .populate("users")
    .then((group) => {
      let withoutSelf = group.users.filter(user => {
        return user._id != currentUser._id
      })
      // display all group members except current user
      group.members = withoutSelf.map(user => user.username).join(', ')
      
      res.render("groups/edit.hbs", { group })
    })
    .catch((err) => next(err));
});

/* POST /groups/:groupId/update  */
router.post(
  "/groups/:groupId/update", authorize, authMember, 
  uploader.single("image"), validate, async (req, res, next) => {
  const user = req.session.currentUser
  const groupId = req.params.groupId
  const { groupName, image, description } = req.body;
  const newImg = (req.file != undefined) ? req.file.path : image;
  // wait for helper functions promises to finish before returning something
  const groupMembers = await updateMembers(members, user)

  Group.findByIdAndUpdate(groupId, { groupName, image: newImg, description })
    .then(() => { res.redirect("/groups/" + groupId)})
    .catch((err) => next(err));
});

/* GET /groups/:groupId  */
router.get("/groups/:groupId", authorize, authMember, (req, res, next) => {
  const groupId = req.params.groupId;

  Group.findById(groupId)
    .populate("movies")
    .populate("users")
    .then((group) => {
      const movies = group.movies.slice(0, 5)
      console.log(group.users)
      res.render("groups/show.hbs", { group, movies, members: group.users })
    })
    .catch((err) => next(err));
});

module.exports = router;
