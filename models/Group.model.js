const { Schema, model } = require("mongoose");

const groupSchema = new Schema(
  {
    groupName: {
      type: String,
      require: true,
      unique: true
    },
    image: String,
    description: {
      type: String,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      },
    ],
    movies: [
      {
        type: Schema.Types.ObjectId.apply,
        ref: "Movie"
      }
    ]
  },
  {
    timestamps: true
  }
);

const Group = model("Group", userSchema);

module.exports = Group;
