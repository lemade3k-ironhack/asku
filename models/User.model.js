const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
      minLength: 8,
    },
    passwordConfirmation: {
      type: String,
      require: true,
      minLength: 8,
    },
    avatar: {
      type: String,
      default: "/images/avatarDummy.png",
    },
    quote: String,
    groups: [
      {
        type: Schema.Types.ObjectId,
        ref: "Group",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);
module.exports = User;
