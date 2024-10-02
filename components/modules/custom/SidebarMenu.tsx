"use client";
import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CiMenuBurger } from "react-icons/ci";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Category, Page, SubCategory, SubPage } from "@/types";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation";

export default function SidebarMenu() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const router = useRouter();

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

    const getPages = () => {
      setLoading(true);
      axios
        .get(process.env.NEXT_PUBLIC_SERVER_URL + "/api/pages")
        .then((response) => {
          setPages(response.data.data);
        })
        .catch((error) => {
          console.log(error.message);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    getCategories();
    getPages();
  }, []);

  return (
    <Sheet>
      <SheetTrigger>
        {" "}
        <div className="lg:hidden">
          <span className="flex cursor-pointer lg:hidden">
            <CiMenuBurger className="text-slate-700 h-8 w-8 font-thin text-[20px]" />
          </span>
        </div>
      </SheetTrigger>
      <SheetContent className="px-4 w-full md:w-[400px]">
        <SheetHeader>
          <SheetTitle>Main Menu</SheetTitle>
          <SheetDescription>Select a option tab.</SheetDescription>
        </SheetHeader>

        <div className="mt-10">
          <Tabs defaultValue="account" className="w-[400px]">
            <TabsList className="grid w-fit grid-cols-2">
              <TabsTrigger value="category">Categories</TabsTrigger>
              <TabsTrigger value="menu">Pages</TabsTrigger>
            </TabsList>

            <TabsContent value="category">
              <div>
                {loading ? (
                  <ClipLoader className="absolute inset-0 m-auto text-primary-900" />
                ) : (
                  ""
                )}

                {categories &&
                  categories.slice(0, 11).map((item: Category, idx: number) => (
                    <div
                      onClick={() =>
                        router.push(`/categories/${item.link}/products`)
                      }
                      key={idx}
                      className="group inline-flex items-center px-4 py-2 gap-4 text-slate-700 
                w-full hover:text-primary capitalize hover:text-primary-900 cursor-pointer"
                    >
                      <div className="flex items-center gap-4 w-full">
                        <span>{item.name}</span>
                        {item?.submenu && item.submenu.length > 0 && (
                          <ChevronRight
                            className="text-slate-600 ms-auto"
                            size={14}
                          />
                        )}
                      </div>

                      {item?.submenu && item.submenu.length > 0 ? (
                        <div className="hidden absolute group-hover:grid grid-cols-3 gap-4 shadow-md left-0 bg-white text-black p-4 w-[600px] z-[1000] duration-300 ease-linear mt-[100px]">
                          {item?.submenu?.map(
                            (item2: SubCategory, idx2: number) => (
                              <Link
                                key={idx2}
                                href={`/categories/${item2.link}/products`}
                                className="text-slate-700 hover:text-primary min-w-40 hover:text-primary-900 cursor-pointer"
                              >
                                {item2.name}
                              </Link>
                            )
                          )}
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="menu">
              <div>
                {loading ? (
                  <ClipLoader className="absolute inset-0 m-auto text-primary-900" />
                ) : (
                  ""
                )}
                {pages &&
                  pages.slice(0, 11).map((item: Page, idx: number) => (
                    <div
                      onClick={() => router.push(`${item.link}`)}
                      key={idx}
                      className="group inline-flex items-center px-4 py-2 gap-4 text-slate-700 
                        w-full hover:text-primary capitalize"
                    >
                      <div className="flex items-center gap-4 w-full">
                        <span>{item.name}</span>
                        {item?.subpage && item.subpage.length > 0 && (
                          <ChevronRight
                            className="text-slate-600 ms-auto"
                            size={14}
                          />
                        )}
                      </div>

                      {item?.subpage && item.subpage.length > 0 ? (
                        <div className="hidden absolute group-hover:grid grid-cols-3 gap-4 shadow-md left-0 bg-white text-black p-4 w-[600px] z-[1000] duration-300 ease-linear mt-[100px]">
                          {item?.subpage?.map(
                            (item2: SubPage, idx2: number) => (
                              <Link
                                key={idx2}
                                href={`${item2.link}`}
                                className="text-slate-700 hover:text-primary min-w-40 hover:text-primary-900"
                              >
                                {item2.name}
                              </Link>
                            )
                          )}
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
