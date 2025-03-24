const { Schema, models, model } = require("mongoose");

const blogSchema = new Schema(
  {
    title: { type: "string", required: true, unique: true },
    description: { type: "string" },
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Blog = models.Blog || model("Blog", blogSchema);
export default Blog;
