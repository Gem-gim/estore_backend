import { IProduct } from "@/types";
import { Schema, model, Model } from "mongoose";
import mongoose from "mongoose";

//2. type model
type ProductModel = Model<IProduct>;

// 3. Create schema
const productSchema = new Schema<IProduct, ProductModel>(
  {
    featured: {
      type: Boolean,
      default: false,
    },
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
    description: {
      type: String,
      required: true,
      maxLength: [255, "must have 255 letters max"],
      unique: true,
      lowercase: true,
    },

    category: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },

    subCategories: [
      {
        type: Schema.Types.ObjectId,
        ref: "subCategory",
      },
    ],
    brand: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Brand",
    },

    details: [
      {
        name: String,
        value: String,
      },
    ],

    content: {
      type: String,
    },

    questions: [
      {
        question: String,
        answer: String,
      },
    ],

    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],

    subProducts: [
      {
        sku: {
          type: String,
        },
        style: {
          color: {
            type: String,
            // required: true,
          },
          image: {
            type: String,
            // required: true,
          },
          name: {
            type: String,
            // required: true,
          },
        },

        options: [
          {
            qty: Number,
            price: Number,
            sold: Number,
            option: String,
            images: Array,
            discount: {
              type: Number,
              default: 0,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

// 4. create the model
const Product: ProductModel =
  mongoose.models.Product ||
  model<IProduct, ProductModel>("Product", productSchema);

export default Product;
