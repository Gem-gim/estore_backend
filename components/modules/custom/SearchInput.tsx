"use client";
import React, { useRef, useState } from "react";
import { m } from "framer-motion";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import {
  getBestPriceWithDiscountFromProduct,
  getBestPriceWithoutDiscountFromProduct,
  getDiscountRate,
} from "@/lib/utils";
import { ClipLoader } from "react-spinners";

export default function SearchInput() {
  // Declaration
  const animation = {
    hide: { y: 82, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
    },
  };
  const [loading, setLoading] = useState(false);
  const inputSearch = useRef<HTMLInputElement>(null);
  const [dataProducts, setDataProducts] = useState([]);

  // Acting
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const search = e.currentTarget.value;
    if (search.length > 3) {
      await axios
        .get(process.env.NEXT_PUBLIC_SERVER_URL + "/api/products", {
          params: { search: search },
        })
        .then((response) => {
          const data = response.data;
          setDataProducts(data.products);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  const handleFocusOn = () => {
    inputSearch.current?.focus();
  };
  const handleFocusOff = () => {
    inputSearch.current?.blur();
  };

  return (
    <div className="hidden relative w-full group  xl:block">
      <div className="rounded-lg bg-neutral-200 flex-1 hidden lg:flex  border h-14 border-b border-b-white group-hover:border-bg-neutral-200 group-hover:border-white group-hover:shadow-xl">
        <input
          onMouseEnter={handleFocusOn}
          onMouseLeave={handleFocusOff}
          ref={inputSearch}
          className="w-full outline-none px-10 bg-neutral-100 group-hover:bg-white group-hover:border-white"
          placeholder="Search a product"
          name="search"
          id="search"
          onInput={handleSearch}
        />
      </div>

      <m.div
        initial={animation.hide}
        whileInView={animation.show}
        transition={{ delay: 0.3 }}
        className="hidden absolute group-hover:flex top-[50px] z-[1000] rounded-t-xl w-full h-[600px] border-neutral-100 border bg-white shadow-xl"
      >
        {loading ? (
          <ClipLoader className="absolute inset-0 m-auto text-primary-900" />
        ) : (
          ""
        )}

        <div className="grid grid-cols-3 gap-10 p-8 overflow-auto">
          {dataProducts.length > 0 ? (
            dataProducts.map((item: Product, idx: number) => (
              <div
                className="flex flex-col gap-4 hover:shadow-md h-fit border border-gray-200"
                key={idx}
              >
                <Link
                  href={`/products/` + item.slug}
                  className="flex justify-center items-center relative py-4"
                >
                  <Image
                    src={item.subProducts[0].options[0].images[0]}
                    className="w-auto h-auto object-fill object-center"
                    width="120"
                    height="120"
                    alt="product"
                  />

                  {getBestPriceWithoutDiscountFromProduct(item) ===
                  getBestPriceWithDiscountFromProduct(item) ? (
                    ""
                  ) : (
                    <div className="absolute top-10 left-0">
                      <span className="text-white text-base bg-primary-600 px-2 py-1 rounded-r-md font-bold">
                        -{" "}
                        {getDiscountRate(
                          getBestPriceWithoutDiscountFromProduct(item),
                          getBestPriceWithDiscountFromProduct(item)
                        )}{" "}
                        %
                      </span>
                    </div>
                  )}
                </Link>
                <div className="flex  flex-col gap-4 justify-center items-center w-full p-2">
                  <h1 className="text-slate-600 font-normal text-center capitalize">
                    {item.name.substring(0, 40)}
                  </h1>
                  <div className="text-primary text-xl font-bold flex justify-between gap-4 items-center">
                    <span className="font-bold text-primary-950 text-2xl">
                      $ {getBestPriceWithDiscountFromProduct(item)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div></div>
          )}
        </div>
      </m.div>
    </div>
  );
}
