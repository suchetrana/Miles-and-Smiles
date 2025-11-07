import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },

    // Friends (bidirectional)
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],

    // Pending friend requests
    incomingRequests: [{ type: Schema.Types.ObjectId, ref: "User" }],
    outgoingRequests: [{ type: Schema.Types.ObjectId, ref: "User" }],

    // Favourite games
    favouriteGames: {
      type: [String], // array of game titles
      default: [],    // empty by default
    },
  },
  { timestamps: true }
);

const User = model("User", userSchema);

export default User;
