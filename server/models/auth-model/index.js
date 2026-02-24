import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    clerkID: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true },
);

const Users = mongoose.model("Users", UserSchema);
export default Users;
