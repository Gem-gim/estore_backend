import { ISlide } from "@/types";
import { Schema, model, Model } from "mongoose";
import mongoose from "mongoose";

//2. type model
type SlideModel = Model<ISlide>;

// 3. Create schema
const slideSchema = new Schema<ISlide, SlideModel>(
  {
    name: {
      type: String,
      required: true,
      maxLength: [255, "must have 255 letters max"],
    },
    slug: {
      type: String,
      required: true,
      maxLength: [255, "must have 250 letters max"],
    },
    link: { type: String, required: true },
    title: {
      type: String,
      required: false,
      maxLength: [255, "must have 255 letters max"],
    },
    subtitle: {
      type: String,
      required: false,
      maxLength: [255, "must have 255 letters max"],
    },
     description: {
      type: String,
      required: false,
      maxLength: [255, "must have 255 letters max"],
    },
    btn: { type: String, required: true },
    image: { type: String, required: true },
    textColor: {
      type: String,
      required: false,
      default: "#000000",
      min: 6,
      max: 10,
    },
  },
  { timestamps: true }
);

// 4. create the model
const Slide: SlideModel =
  mongoose.models.Slide || model<ISlide, SlideModel>("Slide", slideSchema);

export default Slide;
