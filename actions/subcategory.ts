import axios from "axios";

export const getCategory = async (subCategory: string) => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_SERVER_URL + "/api/admin/subcategories",
      {
        params: { subCategory: subCategory },
      }
    );
    return response.data.data;
  } catch (error) {
    return error;
  }
};

export const getSubCategories = async () => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_SERVER_URL + "/api/admin/subcategories"
    );
    return JSON.parse(JSON.stringify(response.data.data));
  } catch (error) {
    return error;
  }
};
