const { Schema, model } = require("mongoose");

const movieSchema = new Schema(
  {
    title: {
      type: String,
      require: true
    },
    plot: {
      type: String,
    },
    genre: {
      type: String,
    },
    year: {
      type: String,
    },
    director: {
      type: String,
    },
    cast: {
      type: String,
    },
    trailer: {
      type: String,
    },
    rating: {
      type: String,
    },
    picture: {
      type: String,
    },
    group: [
      {
        type: Schema.Types.ObjectId,
        ref: "Group"
      }
    ]
  },
  {
    timestamps: true
  }
);

const Movie = model("Movie", userSchema);

module.exports = Movie;