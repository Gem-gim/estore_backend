import { sendEmailTypes } from "@/types";
import axios from "axios";

export const sendEmail = (values: sendEmailTypes) => {
  axios
    .post(process.env.NEXT_PUBLIC_SERVER_URL + "/api/sendemail", values)
    .then((response) => {
      const data = response.data;
      Response.json({ message: "Email sent !", data });
    })
    .catch((err) => {
      Response.json({ message: err.message });
    });
};
