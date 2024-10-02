import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getOrder } from "@/actions/order";

import Link from "next/link";
import Container from "@/components/modules/custom/Container";
import OrderHeader from "@/components/modules/admin/order/OrderHeader";
import OrderProducts from "@/components/modules/admin/order/OrderProducts";
import OrderSummary from "@/components/modules/admin/order/OrderSummary";
import ShippingBillingAddress from "@/components/modules/admin/order/ShippingBillingAddress";

export default async function page({ params }: { params: { id: string } }) {
  const order = await getOrder(params.id);
  return (
    <>
      <section className="px-10 py-8">
        <Container className="">
          <Breadcrumb>
            <BreadcrumbList className="capitalize flex flex-wrap justify-start">
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Pages</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <Link href="/admin/orders">Orders</Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Table</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </Container>
      </section>
      <section className="relative px-10">
        <Container>
          <div className="flex gap-8 flex-wrap lg:flex-nowrap my-10">
            <div className="flex-1">
              <OrderHeader order={order} />
              <OrderProducts order={order} />
              <OrderSummary order={order} />
            </div>
            <ShippingBillingAddress order={order} />
          </div>
        </Container>
      </section>
    </>
  );
}
