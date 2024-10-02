import { ISubCategory } from '@/types';
import mongoose, { Schema, model, Model  } from "mongoose";
const { ObjectId } = mongoose.Schema;



//2. type model
type SubCategoryModel = Model<ISubCategory>;

// 3. Create schema
const categorySchema = new Schema<ISubCategory, SubCategoryModel>(
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
    parent: {
      type: ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

// 4. create the model
const SubCategory: SubCategoryModel =
  mongoose.models.SubCategory ||
  model<ISubCategory, SubCategoryModel>("SubCategory", categorySchema);

export default SubCategory;
