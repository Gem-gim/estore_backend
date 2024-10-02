import { dbConnect } from "@/lib/dbConnect";
import axios from "axios";

export const getCategoryBySlug = async (slug: string) => {
  await dbConnect();

  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_SERVER_URL + "/api/categories",
      {
        params: { slug: slug },
      }
    );
    return response.data.data;
  } catch (error) {
    return error;
  }
};

export const getCategories = async () => {
  await dbConnect();

  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_SERVER_URL + "/api/admin/categories"
    );
    return JSON.parse(JSON.stringify(response.data.data));
  } catch (error) {
    return error;
  }
};


export const getCategoryById = async (id: string) => {
  await dbConnect();

  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_SERVER_URL + "/api/categories", { params: { id: id } }
    );
    return JSON.parse(JSON.stringify(response.data.data));
  } catch (error) {
    return error;
  }
};
