import { IUser } from "@/types";
import { Schema, model, Model } from "mongoose";
import mongoose from "mongoose";

//2. type model
type UserModel = Model<IUser>;

// 3. Create schema
const userSchema = new Schema<IUser, UserModel>(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    resetCode: {
      data: String,
      expireAt: {
        type: Date,
        default: new Date(Date.now() + 10 * 60 * 1000),
      },
    },
    image: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/128/236/236831.png",
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },
    defaultPaymentMethod: {
      type: String,
      default: "",
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
const User: UserModel =
  mongoose.models.User || model<IUser, UserModel>("User", userSchema);

export default User;
