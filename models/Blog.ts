import { IBlog } from "@/types";
import { Schema, model, Model } from "mongoose";
import mongoose from "mongoose";

//2. type model
type BlogModel = Model<IBlog>;

// 3. Create schema
const blogSchema = new Schema<IBlog, BlogModel>(
  {
    name: {
      type: String,
      required: true,
      maxLength: [255, "must have 255 letters max"],
      unique: true,
      lowercase: true,
    },
    slug: {
      type: String,
      required: true,
      maxLength: [255, "must have 255 letters max"],
      unique: true,
      lowercase: true,
    },
    link: {
      type: String,
      required: true,
      maxLength: [255, "must have 255 letters max"],
      unique: true,
      lowercase: true,
    },
    image: {
      type: String,
      required: true,
    },

    postBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    category: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "BlogCategory",
    },
  },
  { timestamps: true }
);

// 4. create the model
const Blog: BlogModel =
  mongoose.models.Blog || model<IBlog, BlogModel>("Blog", blogSchema);

export default Blog;
