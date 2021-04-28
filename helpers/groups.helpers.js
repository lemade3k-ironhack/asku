const User = require("../models/User.model");

// helper for getting an array of user ids from given string
const updateMembers = (newMembers, currentUser) => {
  // always put currentUser into members list
  let groupMembers = [currentUser._id]

  // try to find a User for every given name
  let members = newMembers.split(', ').map(member => {
    return User.findOne({username: member}) 
  })

  // return an array of members ids
  return Promise.all(members)
  .then(result => {
    result.forEach(member => groupMembers.push(member._id))
    return groupMembers
  })
  .catch(() => {
    // do nothing if User was not found
    console.log("User not found")
    return groupMembers;
  })
}

module.exports = updateMembers