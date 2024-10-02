import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import Link from "next/link";
import Container from "@/components/modules/custom/Container";
import Heading from "@/components/modules/custom/Heading";
import BusnessForm from "@/components/modules/admin/settings/BusnessForm";

export default async function Page() {
  return (
    <>
      <section className="px-10 py-8">
        <Container className="mx-auto">
          <Breadcrumb>
            <BreadcrumbList className="capitalize flex flex-wrap justify-start">
              <BreadcrumbItem>
                <Link href="#">Pages</Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <span>
                  <Link href="/settings">Settings</Link>
                </span>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <span>
                  <Link href="#">Busness info</Link>
                </span>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </Container>
      </section>
      <section className="">
        <Container className="mx-auto px-10">
          <div className="flex flex-col gap-10">
            <Heading name="Busness info" />
            <BusnessForm/>
           
          </div>
        </Container>
      </section>
    </>
  );
}

export const metadata = {
  title: "Busness info - Carrefour",
  description: "Online Ecommerce for selling anything in usa",
  icons: {
    icon: "/assets/images/logo.svg",
  },
};
