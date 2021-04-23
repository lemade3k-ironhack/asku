const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      require: true,
      unique: true
    },
    password: {
      type: String,
      require: true
    },
    avatar: {
      type: String,
    },
    quote: {
      type: String,
    },
    groups: [
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

const User = model("User", userSchema);

module.exports = User;
