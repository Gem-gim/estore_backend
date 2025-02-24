import { ICategory } from "@/types";
import { Schema, model, Model } from "mongoose";
import mongoose from "mongoose";

//2. type model
type CategoryModel = Model<ICategory>;

// 3. Create schema
const categorySchema = new Schema<ICategory, CategoryModel>(
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
    submenu: [
      {
        type: Schema.Types.ObjectId,
        ref: "SubCategory",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

// 4. create the model
const Category: CategoryModel =
  mongoose.models.Category ||
  model<ICategory, CategoryModel>("Category", categorySchema);

export default Category;
