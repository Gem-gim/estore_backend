import { Order, Product, User } from "@/types";
import { Folder, ShoppingBag, User2 } from "lucide-react";
import React from "react";
import { CiMoneyBill } from "react-icons/ci";
import Container from "../../custom/Container";

export default function DataCard({
  products,
  orders,
  users,
}: {
  products: Product[];
  orders: Order[];
  users: User[];
}) {
  return (
    <section className="my-10 px-10 w-full">
      <Container>
        <div className="flex justify-between gap-4">
          <div className="flex grow p-6 items-center justify-between bg-white rounded-lg">
            <div>
              <User2 className="h-10 w-10 text-indigo-300" />
            </div>

            <div className="flex flex-col grow  items-end">
              <span className="text-3xl font-bold">+{users.length}</span>
              <span className="text-sm font-normal">users</span>
            </div>
          </div>

          <div className="flex grow p-6 items-center justify-between bg-white rounded-lg">
            <div>
              <ShoppingBag className="h-10 w-10 text-indigo-300" />
            </div>

            <div className="flex flex-col grow  items-end">
              <span className="text-3xl font-bold">+{products.length}</span>
              <span className="text-sm font-normal">Products</span>
            </div>
          </div>

          <div className="flex grow p-6 items-center justify-between bg-white rounded-lg">
            <div>
              <Folder className="h-10 w-10 text-indigo-300" />
            </div>

            <div className="flex flex-col grow  items-end">
              <span className="text-3xl font-bold">+{orders.length}</span>
              <span className="text-sm font-normal">Orders</span>
            </div>
          </div>

          <div className="flex grow p-6 items-center justify-between bg-white rounded-lg">
            <div>
              <CiMoneyBill className="h-10 w-10 text-indigo-300" />
            </div>

            <div className="flex flex-col grow  items-end">
              <span className="text-3xl font-bold">
                {orders.reduce(
                  (total: number, valeur: Order) => total + valeur.total,
                  0
                )}{" "}
                $
                <h3 className="text-indigo-400 text-sm">
                  {orders.length > 0 &&
                    orders
                      .filter((item: Order) => !item.isPaid)
                      .reduce(
                        (total: number, valeur: Order) => total + valeur.total,
                        0
                      ) + "$ ( unpaid yet )"}
                </h3>
              </span>
              <span className="text-sm font-normal">Total earnings</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
