import { INewsletter } from "@/types";
import { Schema, model, Model } from "mongoose";
import mongoose from "mongoose";

//2. type model
type NewsletterModel = Model<INewsletter>;

// 3. Create schema
const newsletterSchema = new Schema<INewsletter, NewsletterModel>(
  {
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

// 4. create the model
const Newsletter: NewsletterModel =
  mongoose.models.Newsletter ||
  model<INewsletter, NewsletterModel>("Newsletter", newsletterSchema);

export default Newsletter;
