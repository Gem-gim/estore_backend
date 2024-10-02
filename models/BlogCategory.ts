import { IBlogCategory } from "@/types";
import { Schema, model, Model } from "mongoose";
import mongoose from "mongoose";

//2. type model
type BlogCategoryModel = Model<IBlogCategory>;

// 3. Create schema
const categorySchema = new Schema<IBlogCategory, BlogCategoryModel>(
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
      unique: false,
      lowercase: true,
    },
    image: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

// 4. create the model
const BlogCategory: BlogCategoryModel =
  mongoose.models.BlogCategory ||
  model<IBlogCategory, BlogCategoryModel>("BlogCategory", categorySchema);

export default BlogCategory;
