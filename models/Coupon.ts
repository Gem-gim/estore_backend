import { ICoupon } from "@/types";
import { Schema, model, Model } from "mongoose";
import mongoose from "mongoose";

//2. type model
type CouponModel = Model<ICoupon>;

// 3. Create schema
const couponSchema = new Schema<ICoupon, CouponModel>(
  {
    coupon: {
      type: String,
      trim: true,
      unique: true,
      uppercase: true,
      required: true,
      minLength: 4,
      maxLength: 10,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    discount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["available", "used"],
      default: "available",
    },
  },
  { timestamps: true }
);

// 4. create the model
const Coupon: CouponModel =
  mongoose.models.Coupon || model<ICoupon, CouponModel>("Coupon", couponSchema);

export default Coupon;
