import React from "react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import Container from "@/components/modules/custom/Container";
import ProductContent from "@/components/modules/admin/product/ProductContent";
import { getCategories } from "@/actions/category";
import { getBrands } from "@/actions/brand";

export default async function Page() {
  const categories = await getCategories();
  const brands = await getBrands();

  return (
    <>
      <section className="px-10 py-8">
        <Container className="mx-auto">
          <Breadcrumb>
            <BreadcrumbList className="capitalize flex flex-wrap justify-start">
              <li>
                <Link href="#">Pages</Link>
              </li>
              <BreadcrumbSeparator />
              <li>
                  <Link href="/admin/products">Products</Link>
               
              </li>
              <BreadcrumbSeparator />
              <li>
                <Link href="#">Create</Link>
              </li>
            </BreadcrumbList>
          </Breadcrumb>
        </Container>
      </section>
      <ProductContent categories={categories} brands={brands} />
    </>
  );
}

export const metadata = {
  title: "Create Product - Carrefour",
  description: "Online Ecommerce for selling anything in usa",
  icons: {
    icon: "/assets/images/logo.svg",
  },
};
