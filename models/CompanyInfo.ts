import { ICompanyInfo } from "@/types";
import { Schema, model, Model } from "mongoose";
import mongoose from "mongoose";

//2. type model
type CompanyInfoModel = Model<ICompanyInfo>;

// 3. Create schema
const companyInfoSchema = new Schema<ICompanyInfo, CompanyInfoModel>(
  {
    name: {
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
      lowercase: true,
    },
    category: {
      type: String,
      required: true,
      maxLength: [255, "must have 255 letters max"],
      lowercase: true,
    },
    logo: {
      type: String,
      required: true,
    },


  },
  { timestamps: true }
);

// 4. create the model
const CompanyInfo: CompanyInfoModel =
  mongoose.models.CompanyInfo || model<ICompanyInfo, CompanyInfoModel>("CompanyInfo", companyInfoSchema);

export default CompanyInfo;
