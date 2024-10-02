import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import Container from "@/components/modules/custom/Container";
import Link from "next/link";
import { getPages } from "@/actions/page";
import { DataTablePage } from "@/components/modules/admin/pages/DataTablePage";

export default async function Page() {
  const pages = await getPages();
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
                <Link href="#">Pages</Link>
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
          <DataTablePage data={pages} />
        </Container>
      </section>
    </>
  );
}

export const metadata = {
  title: "Slides - Carrefour",
  description: "Online Ecommerce for selling anything in usa",
  icons: {
    icon: "/assets/images/logo.svg",
  },
};
