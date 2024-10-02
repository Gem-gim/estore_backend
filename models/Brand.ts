import { IBrand } from "@/types";
import { Schema, model, Model } from "mongoose";
import mongoose from "mongoose";

//2. type model
type BrandModel = Model<IBrand>;

// 3. Create schema
const brandSchema = new Schema<IBrand, BrandModel>(
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
  },
  { timestamps: true }
);

// 4. create the model
const Brand: BrandModel =
  mongoose.models.Brand || model<IBrand, BrandModel>("Brand", brandSchema);

export default Brand;
