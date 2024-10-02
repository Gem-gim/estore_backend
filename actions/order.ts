import { dbConnect } from "@/lib/dbConnect";
import axios from "axios";

export const getOrder = async (id: string) => {
  await dbConnect();

  try {
    if (id) {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_SERVER_URL + "/api/order",
        {
          params: { id: id },
        }
      );
      return response.data.data;
    }
  } catch (error) {
    return error;
  }
};

export const getOrders = async () => {
  await dbConnect();

  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_SERVER_URL + "/api/admin/orders"
    );
    return response.data.data;
  } catch (error) {
    return error;
  }
};

export const getOrderByUserId = async (user: string | undefined) => {
  await dbConnect();

  try {
    if (user) {
      const response = await axios.get(
        process.env.NEXT_PUBLIC_SERVER_URL + "/api/order",
        {
          params: { user: user },
        }
      );
      console.log("log_________________________________", response.data.data);
      return response.data.data;
    }

    return;
  } catch (error) {
    return error;
  }
};
