import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getCategories } from "@/actions/category";
import Container from "@/components/modules/custom/Container";
import { DataTableCategories } from "@/components/modules/admin/category/TableCategories";

export default async function Page() {
  const categories = await getCategories();

  console.log(categories);
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
                <BreadcrumbLink href="#">Categories</BreadcrumbLink>
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
          <DataTableCategories data={categories} />
        </Container>
      </section>
    </>
  );
}

export const metadata = {
  title: "Category - Carrefour",
  description: "Online Ecommerce for selling anything in usa",
  icons: {
    icon: "/assets/images/logo.svg",
  },
};
