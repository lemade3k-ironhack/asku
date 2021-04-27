// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// ℹ️ This function is getting exported from the config folder.
// It runs most middlewares
require("./config")(app);

// default value for title local
const projectName = "vider";
app.locals.title = projectName;

// set up session handling
const session = require("express-session");
const MongoStore = require("connect-mongo");

app.use(
  session({
    secret: process.env.SESSION_KEY,
    saveUninitialized: false, // don't create session until something stored
    resave: false, //don't save session if unmodified
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // in milliseconds
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI || "mongodb://localhost/basic-auth",
      ttl: 24 * 60 * 60, // 1 day => in seconds
    }),
  })
);

// 👇 Start handling routes here
const index = require("./routes/users.routes");
app.use("/", index);

const profiles = require("./routes/profiles.routes");
app.use("/", profiles);

const groups = require("./routes/groups.routes");
app.use("/", groups);

const movies = require("./routes/movies.routes");
app.use("/", movies);

// ❗ To handle errors. Routes that don't exist or errors that you handle in
// specific routes
require("./error-handling")(app);

module.exports = app;
