const { Schema, model } = require("mongoose");

const groupSchema = new Schema(
  {
    groupName: {
      type: String,
      require: true,
      unique: true,
    },
    image: {
      type: String,
      default: "/images/logoDummy.png",
    },
    description: String,
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    movies: [
      {
        type: Schema.Types.ObjectId,
        ref: "Movie",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Group = model("Group", groupSchema);
module.exports = Group;
