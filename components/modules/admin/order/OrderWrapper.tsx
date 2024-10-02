"use client";
import React, { useEffect, useState } from "react";
import OrderHeader from "./OrderHeader";
import OrderProducts from "./OrderProducts";
import OrderSummary from "./OrderSummary";
import ShippingBillingAddress from "./ShippingBillingAddress";
import Container from "../../custom/Container";
import { Order } from "@/types";
import axios from "axios";
import { ClipLoader } from "react-spinners";

export default function OrderWrapper({ id }: { id: string }) {
  const [order, setOrder] = useState<Order>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getOrder = () => {
      setLoading(true);
      axios
        .get(process.env.NEXT_PUBLIC_SERVER_URL + "/api/order", {
          params: { id: id },
        })
        .then((response) => {
          setOrder(response.data.data);
        })
        .catch((error) => {
          console.log(error.message);
        })
        .finally(() => {
          setLoading(false);
        });
    };
    getOrder();
  }, [id]);

  return (
    <section className="relative pb-10">
      {loading ? (
        <ClipLoader className="absolute inset-0 m-auto text-primary-900" />
      ) : (
        ""
      )}

      <Container>
        <div className="">
          <h2 className="font-manrope font-bold text-2xl leading-10 text-black text-center">
            Your order details
          </h2>
          <p className="mt-4 font-normal text-lg leading-8 text-gray-500 mb-11 text-center">
            Thanks for placing your order you can check your order summary from
            below
          </p>

          <div className="flex gap-8 flex-wrap lg:flex-nowrap my-10">
            <div className="flex-1">
              <OrderHeader order={order} />
              <OrderProducts order={order} />
              <OrderSummary order={order} />
            </div>
            <ShippingBillingAddress order={order} />
          </div>
        </div>
      </Container>
    </section>
  );
}
