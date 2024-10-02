import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import Link from "next/link";
import Container from "@/components/modules/custom/Container";
import { getProducts } from "@/actions/product";
import { DataTableProducts } from "@/components/modules/admin/product/TableProducts";

export default async function Page() {
  const products = await getProducts();

  return (
    <>
      <section className="px-10 py-8">
        <Container className="mx-auto">
          <Breadcrumb>
            <BreadcrumbList className="capitalize flex flex-wrap justify-start">
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Pages</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <span>
                  <Link href="/admin/products">Products</Link>
                </span>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Table</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </Container>
      </section>
      <section className="">
        <Container className="mx-auto px-10">
          <DataTableProducts data={products} />
        </Container>
      </section>
    </>
  );
}

export const metadata = {
  title: "Products - Carrefour",
  description: "Online Ecommerce for selling anything in usa",
  icons: {
    icon: "/assets/images/logo.svg",
  },
};
