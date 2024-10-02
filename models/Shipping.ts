import { IShipping } from "@/types";
import { Schema, model, Model } from "mongoose";
import mongoose from "mongoose";

//2. type model
type ShippingModel = Model<IShipping>;

// 3. Create schema
const shippingSchema = new Schema<IShipping, ShippingModel>(
  {
    user: {
      type: String,
    },

    address: [
      {
        firstName: {
          type: String,
        },
        lastName: {
          type: String,
        },
        phoneNumber: {
          type: String,
        },
        address: {
          type: String,
        },
        city: {
          type: String,
        },
        zipCode: {
          type: String,
        },
        state: {
          type: String,
        },
        country: {
          type: String,
        },
        active: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

// 4. create the model
const Shipping: ShippingModel =
  mongoose.models.Shipping ||
  model<IShipping, ShippingModel>("Shipping", shippingSchema);

export default Shipping;
