import { dbConnect } from "@/lib/dbConnect";
import axios from "axios";

export const getBrandBySlug = async (slug: string) => {
  await dbConnect();

  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_SERVER_URL + "/api/brands",
      {
        params: { slug: slug },
      }
    );
    return response.data.data;
  } catch (error) {
    return error;
  }
};

export const getBrands = async () => {
  await dbConnect();

  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_SERVER_URL + "/api/admin/brands"
    );
    return response.data.data;
  } catch (error) {
    return error;
  }
};
