import { ICart } from "@/types";
import { Schema, model, Model } from "mongoose";
import mongoose from "mongoose";

//2. type model
type CartModel = Model<ICart>;

// 3. Create schema
const cartSchema = new Schema<ICart, CartModel>(
  {
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
        name: {
          type: String,
        },
        images: {
          type: String,
        },
        option: {
          type: String,
        },
        style: {
          name: String,
          color: String,
          image: String,
        },
        qty: {
          type: Number,
        },
        price: Number,
      },
    ],
    cartTotal: Number,
    totalAfterDiscount: {
      type: Number,
      default: 0,
    },
    // user: {
    //   type: Schema.Types.ObjectId,
    //   ref: "User",
    // },
    user: {
      type: String,
    },
  },
  { timestamps: true }
);

// 4. create the model
const Cart: CartModel =
  mongoose.models.Cart || model<ICart, CartModel>("Cart", cartSchema);

export default Cart;
