"use client";
import { cn } from "@/lib/utils";
import { Category, SubCategory } from "@/types";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoriesAccordion({
  className,
}: {
  className?: string;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<[]>([]);

  useEffect(() => {
    const getCategories = () => {
      setLoading(true);
      axios
        .get(process.env.NEXT_PUBLIC_SERVER_URL + "/api/categories")
        .then((response) => {
          setCategories(response.data.data);
        })
        .catch((error) => {
          console.log(error.message);
        })
        .finally(() => {
          setLoading(false);
        });
    };
    getCategories();
  }, []);

  return (
    <Accordion type="single" collapsible className={className}>
      {!loading ? (
        categories &&
        categories.slice(0, 11).map((item: Category, idx: number) => (
          <AccordionItem value={`item-${idx}`} key={idx}>
            <AccordionTrigger
              className={cn(
                "capitalize",
                item?.submenu && item.submenu.length === 0 && "[&>svg]:hidden"
              )}
            >
              <Link
                href={`/categories/${item.link}/products`}
                className="text-slate-500 text-sm hover:text-primary-900"
              >
                {item.name}
              </Link>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-4 ms-10">
                {item?.submenu?.map((item2: SubCategory, idx2: number) => (
                  <Link
                    key={idx2}
                    href={`/categories/${item2.link}/products`}
                    className="text-slate-500 hover:text-primary min-w-40 hover:text-primary-900 capitalize"
                  >
                    {item2.name}
                  </Link>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))
      ) : (
        <div className="flex flex-col gap-4">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map(
            (item: number, idx: number) => (
              <Skeleton key={`${item} ${idx}`} className="h-4 w-full" />
            )
          )}
        </div>
      )}
    </Accordion>
  );
}
