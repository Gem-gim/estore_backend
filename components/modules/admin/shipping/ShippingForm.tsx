"use client";
import React from "react";
import { Button } from "@/components/ui/button";

export default function ShippingForm() {
  return (
    <div className="flex flex-col bg-white w-full rounded-md">
      <div className="flex flex-col gap-2 px-8 py-4 border-b border-b-gray-200">
        <h1 className="font-bold text-xl">Shipping address</h1>
        <h2 className="text-base font-medium">
          Manage shipping, delivery or pickup zones and rates.
        </h2>
      </div>

      <div className="flex">
        <Button variant="outline" size="lg">
          Add a shipping
        </Button>

        <div className="flex w-full"></div>
      </div>
    </div>
  );
}
