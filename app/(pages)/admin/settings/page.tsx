import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import Link from "next/link";
import Container from "@/components/modules/custom/Container";
import { Button } from "@/components/ui/button";
import { AlertCircle, CircleDollarSign, Notebook, StoreIcon, TruckIcon } from "lucide-react";

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
                  <Link href="#">Settings</Link>
                </span>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </Container>
      </section>
      <section className="">
        <Container className="mx-auto px-10">
          <h4 className="text-red-500 flex  gap-4"> <AlertCircle color="red" /> Features in development{" "}</h4>
          <div className="grid grid- lg:grid-cols-3 xl:grid-cols-4 h-full p-12 bg-white grid-rows-auto space-y-4">
            <Link
              href="settings/busness-info"
              className="flex gap-4 items-center hover:bg-neutral-100 p-6 max-w-md cursor-pointer "
            >
              <Button variant="outline" size="icon" className="p-2 border-0">
                <Notebook />
              </Button>
              <div className="flex flex-col gap-4">
                <h1 className="font-bold text-xl">Company informations</h1>
                <h2 className="font-normal text-sm">
                  define the name, logo, location and contact details of your
                  business
                </h2>
              </div>
            </Link>

            <Link
              href="settings/shipping-info"
              className="flex gap-4 items-center hover:bg-neutral-100 p-6 max-w-md cursor-pointer "
            >
              <Button variant="outline" size="icon" className="p-2 border-0">
                <TruckIcon />
              </Button>
              <div className="flex flex-col gap-4">
                <h1 className="font-bold text-xl">Delivery and processing</h1>
                <h2 className="font-normal text-sm">
                  Define your store&apos;s delivery zones and rates.
                </h2>
              </div>
            </Link>

            <div className="flex gap-4 items-center hover:bg-neutral-100 p-6 max-w-md cursor-pointer ">
              <Button variant="outline" size="icon" className="p-2 border-0">
                <StoreIcon />
              </Button>
              <div className="flex flex-col gap-4">
                <h1 className="font-bold text-xl">Shop Items and Inventory</h1>
                <h2 className="font-normal text-sm">
                  Manage store display and inventory settings.
                </h2>
              </div>
            </div>

            <div className="flex gap-4 items-center hover:bg-neutral-100 p-6 max-w-md cursor-pointer ">
              <Button variant="outline" size="icon" className="p-2 border-0">
                <CircleDollarSign />
              </Button>
              <div className="flex flex-col gap-4">
                <h1 className="font-bold text-xl">Accept payments</h1>
                <h2 className="font-normal text-sm">
                  Choose how customers can pay you.{" "}
                </h2>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

export const metadata = {
  title: "Settings - Carrefour",
  description: "Online Ecommerce for selling anything in usa",
  icons: {
    icon: "/assets/images/logo.svg",
  },
};
