"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { CiGlobe } from "react-icons/ci";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import LanguagesCurrency from "./LanguagesCurrency";

export default function LanguagesCurrencyModal({
  className,
}: {
  className?: string;
}) {
  return (
    <>
      <Sheet key="bottom">
        <SheetTrigger>
          {" "}
          <div className="lg:hidden">
            <span>
              <CiGlobe className={cn("text-slate-700 h-8 w-8", className)} />
            </span>
          </div>
        </SheetTrigger>
        <SheetContent
          className="w-full rounded-t-3xl px-4"
          side="bottom"
        >
          <SheetHeader className="flex items-center">
            <SheetTitle>Language / Currency</SheetTitle>
            <SheetDescription>Select a option.</SheetDescription>
          </SheetHeader>

          <div className="mt-10">
            <LanguagesCurrency className="px-8 flex justify-between items-center gap-4" />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
