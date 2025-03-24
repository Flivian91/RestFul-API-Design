import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: "string", unique: true, required: true },
    username: { type: "string", unique: true, required: true },
    password: { type: "string", required: true },
  },
  {
    timestamps: true,
  }
);

const User = models.User || model("User", UserSchema);
export default User;
