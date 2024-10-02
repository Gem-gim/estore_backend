import { dbConnect } from "@/lib/dbConnect";
import axios from "axios";

export const getColors = async () => {
  await dbConnect();

  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_SERVER_URL + "/api/admin/colors"
    );
    return JSON.parse(JSON.stringify(response.data.data));
  } catch (error) {
    return error;
  }
};
