import { dbConnect } from "@/lib/dbConnect";
import axios from "axios";

export const getUserById = async (id: string | undefined) => {
  await dbConnect();

  try {
    if (id) {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_SERVER_URL + "/api/user",
        {
          params: { user_id: id },
        }
      );
      return response.data.data;
    }
  } catch (error) {
    return error;
  }
};

export const getUsers = async () => {
  await dbConnect();

  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_SERVER_URL + "/api/admin/users"
    );
    return response.data.data;
  } catch (error) {
    return error;
  }
};
