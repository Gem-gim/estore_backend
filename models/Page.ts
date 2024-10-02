import { IPage } from "@/types";
import { Schema, model, Model } from "mongoose";
import mongoose from "mongoose";

//2. type model
type PageModel = Model<IPage>;

// 3. Create schema
const pageSchema = new Schema<IPage, PageModel>(
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
    subpage: [
      {
        type: Schema.Types.ObjectId,
        ref: "SubPage",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

// 4. create the model
const Page: PageModel =
  mongoose.models.Page || model<IPage, PageModel>("Page", pageSchema);

export default Page;
