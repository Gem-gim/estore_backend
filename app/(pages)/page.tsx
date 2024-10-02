import Login from "@/components/modules/admin/auth/Login";
import { Metadata } from "next";
import React from "react";

export default function page() {
  return <Login />;
}

export const metadata: Metadata = {
  title: "Login - Carrefour",
  description: "Online Ecommerce for selling electronics",
  icons: {
    icon: "/assets/images/logo.svg",
  },
};
