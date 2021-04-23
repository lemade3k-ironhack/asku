require("../db");
const faker = require('faker')

const usersSeeds = [
  { 
    username: 'Tina Tester',
    password: 'secret123',
    avatar: faker.image.avatar(),
    quote: faker.lorem.sentence()
  },
  { 
    username: 'Ada Lovelace',
    password: 'secret123',
    avatar: faker.image.avatar(),
    quote: faker.lorem.sentence()
  },
  { 
    username: faker.name.findName(),
    password: 'secret123',
    avatar: faker.image.avatar(),
    quote: faker.lorem.sentence()
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
