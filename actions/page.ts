import { dbConnect } from "@/lib/dbConnect";
import axios from "axios";

export const getSlideBySlug = async (slug: string) => {
  await dbConnect();

  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_SERVER_URL + "/api/pages",
      {
        params: { slug: slug },
      }
    );
    return response.data.data;
  } catch (error) {
    return error;
  }
};

export const getPages = async () => {
  await dbConnect();

  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_SERVER_URL + "/api/admin/pages"
    );
    return response.data.data;
  } catch (error) {
    return error;
  }
};
