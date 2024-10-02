import { IOrder } from "@/types";
import { Schema, model, Model } from "mongoose";
import mongoose from "mongoose";

//2. type model
type OrderModel = Model<IOrder>;

// 3. Create schema
const cartSchema = new Schema<IOrder, OrderModel>(
  {
    user: {
      type: String,
      required: true,
    },

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
        qty: {
          type: Number,
        },
        style: {
          color: String,
          image: String,
          name: String,
        },
        price: {
          type: Number,
        },
      },
    ],

    shippingAddress: {
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
      state: {
        type: String,
      },
      zipCode: {
        type: String,
      },
      country: {
        type: String,
      },
    },

    paymentMethod: {
      type: String,
    },

    total: {
      type: Number,
      required: true,
    },

    shippingPrice: {
      type: Number,
      required: true,
      default: 0,
    },

    shippingTimes: {
      type: String,
      required: true,
      default: "2 Days",
    },

    taxPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
      default: null,
    },
    deliveredAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["not processed", "dispactched", "cancelled", "completed"],
      default: "not processed",
    },
    shippingStatus: {
      type: String,
      enum: ["pending", "ready for delivery", "cancelled", "completed"],
      default: "pending",
    },

    paymentResult: {
      id: String,
      status: String,
      email: String,
    },

    totalBeforeDiscount: {
      type: Number,
    },
    couponApplied: {
      type: String,
    },
  },
  { timestamps: true }
);

// 4. create the model
const Order: OrderModel =
  mongoose.models.Order || model<IOrder, OrderModel>("Order", cartSchema);

export default Order;
