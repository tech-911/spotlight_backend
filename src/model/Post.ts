import mongoose from "mongoose";
const { Schema, model } = mongoose;

const postSchema = new Schema({
  caption: String,
  picture: String,
  user_id: String,
  email: String,
  createdAt: { type: Date, default: Date.now() },
});

const Post = model("Post", postSchema);
export default Post;
