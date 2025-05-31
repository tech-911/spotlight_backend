import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: String,
  picture: String,
  user_id: String,
  email: String,
  email_verified: Boolean,
});

const User = model("User", userSchema);
export default User;
export type UserType = {
  name: string;
  picture: string;
  user_id: string;
  email: string;
  email_verified: boolean;
};
 



