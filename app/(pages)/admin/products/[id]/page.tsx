import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { getProductBasics } from "@/actions/product";
import { getCategories } from "@/actions/category";
import { getBrands } from "@/actions/brand";
import Container from "@/components/modules/custom/Container";
import ProductEdit from "@/components/modules/admin/product/ProductEdit";

export default async function Page({ params }: { params: { id: string } }) {
  const product = await getProductBasics(params.id);
  const categories = await getCategories();
  const brands = await getBrands();

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
                <BreadcrumbLink href="#">{params.id}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Edit</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </Container>
      </section>
      <ProductEdit product={product} brands={brands} categories={categories} />
    </>
  );
}

export const metadata = {
  title: "Product - Carrefour",
  description: "Online Ecommerce for selling anything in usa",
  icons: {
    icon: "/assets/images/logo.svg",
  },
};
