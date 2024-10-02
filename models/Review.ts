import { IReview } from "@/types";
import { Schema, model, Model } from "mongoose";
import mongoose from "mongoose";

//2. type model
type ReviewModel = Model<IReview>;

// 3. Create schema
const reviewSchema = new Schema<IReview, ReviewModel>(
  {
    rating: {
      type: Number,
      required: true,
      default: 0,
    },

    review: {
      type: String,
      required: true,
    },

    likes: [
      {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
    ],
    // reviewBy: {
    //   type: Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    // },

    reviewBy: {
      id: {
        type: String,
      },
      imageUrl: {
        type: String,
      },
      fullName: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

// 4. create the model
const Review: ReviewModel =
  mongoose.models.Review || model<IReview, ReviewModel>("Review", reviewSchema);

export default Review;
