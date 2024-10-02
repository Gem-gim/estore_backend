import { getOrders } from "@/actions/order";
import { getProducts } from "@/actions/product";
import { getUsers } from "@/actions/user";
import DataCard from "@/components/modules/admin/dashboard/DataCard";
import { RecentOrders } from "@/components/modules/admin/dashboard/RecentOrders";
import React from "react";

export default async function Page() {
  const products = await getProducts();
  const orders = await getOrders();
  const users = await getUsers();

  return (
    <div className="flex flex-col space-y-10">
      <DataCard products={products} orders={orders} users={users} />
      <RecentOrders data={orders} />
    </div>
  );
}

export const metadata = {
  title: "Admin - Carrefour",
  description: "Online Ecommerce for selling anything in usa",
  icons: {
    icon: "/assets/images/logo.svg",
  },
};
