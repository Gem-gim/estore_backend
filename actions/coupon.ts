import axios from "axios";

export const getCoupon = async () => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_SERVER_URL + "/api/admin/coupons"
    );
    return response.data.data;
  } catch (error) {
    return error;
  }
};
