require("../db");
const faker = require("faker");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(12);
const hash = bcrypt.hashSync("secret123", salt);

const usersSeeds = [
  {
    username: "Ada Lovelace",
    password: hash,
    passwordConfirmation: hash,
    avatar: faker.image.avatar(),
    quote: faker.lorem.sentence(),
  },
  {
    username: faker.name.findName(),
    password: hash,
    passwordConfirmation: hash,
    avatar: faker.image.avatar(),
    quote: faker.lorem.sentence(),
  },
  {
    username: faker.name.findName(),
    password: hash,
    passwordConfirmation: hash,
    avatar: faker.image.avatar(),
    quote: faker.lorem.sentence(),
  },
];

const mongoose = require("mongoose");
const User = require("../models/User.model");

User.create(usersSeeds)
  .then(() => {
    console.log(`Seeded database with 3 users. Password is: 'secret123'`);
    mongoose.connection.close();
  })
  .catch(() => console.log("Error while seeding database"));
