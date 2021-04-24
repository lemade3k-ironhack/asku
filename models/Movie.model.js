const { Schema, model } = require("mongoose");

const movieSchema = new Schema(
  {
    title: {
      type: String,
      require: true
    },
    plot: String,
    genre: String,
    year: Date,
    director: String,
    cast: [String],
    trailer: String,
    rating: Schema.Types.Decimal128,
    picture: String,
    _group: Schema.Types.ObjectId,
  },
  {
    timestamps: true
  }
);

const Movie = model("Movie", movieSchema);

module.exports = Movie;