import mongoose, { Schema, model, Model, Types } from "mongoose";

//1. types
type ISubPage = {
  name: string;
  slug: string;
  link: string;
  parent: Types.ObjectId;
};

//2. type model
type SubPageModel = Model<ISubPage>;

// 3. Create schema
const pageSchema = new Schema<ISubPage, SubPageModel>(
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
      type: Schema.Types.ObjectId,
      ref: "Page",
      required: true,
    },
  },
  { timestamps: true }
);

// 4. create the model
const SubPage: SubPageModel =
  mongoose.models.SubPage ||
  model<ISubPage, SubPageModel>("SubPage", pageSchema);

export default SubPage;
