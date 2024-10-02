import React, { useEffect, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { m } from "framer-motion";
import { IoIosArrowRoundBack } from "react-icons/io";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { FormValues, Product } from "@/types";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

export default function SearchMobile({
  openSearchMobile,
  setSearchMobile,
}: {
  openSearchMobile: boolean;
  setSearchMobile: (value: boolean) => void;
}) {
  const { register, setFocus } = useForm<FormValues>({
    progressive: true,
  });
  const [loading, setLoading] = useState(false);
  const inputSearch = useRef<HTMLInputElement>(null);
  const [dataProducts, setDataProducts] = useState([]);

  useEffect(() => {
    setFocus("search");
  }, [setFocus]);

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
    <>
      <button
        type="button"
        onClick={() => setSearchMobile(!openSearchMobile)}
        className={cn("", openSearchMobile && "hidden")}
      >
        <CiSearch className="text-slate-700 h-8 w-8" />
      </button>
      <m.div
        initial={{ opacity: 0, y: -15 }}
        whileInView={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={cn(
          "hidden hover:shadow-xl rounded-md bg-white items-center justify-between py-4 px-3 w-full",
          openSearchMobile && "flex lg:hidden"
        )}
      >
        <form className="flex items-center gap-4 w-full">
          <button type="button">
            <IoIosArrowRoundBack
              size={30}
              className="text-slate-500"
              onClick={() => setSearchMobile(false)}
            />
          </button>

          <input
            {...register("search", { required: true })}
            type="text"
            onMouseEnter={handleFocusOn}
            onMouseLeave={handleFocusOff}
            className="focus:outline-none bg-transparent flex-1"
            placeholder="ps5, psn, psplus,  iphone14.."
            onInput={handleSearch}
            ref={inputSearch}
          />

          <div className="grid grid-cols-2 gap-10 p-8 overflow-auto w-full absolute left-0 top-20 bg-white z-20 shadow-lg max-w-100">
            {loading ? (
              <ClipLoader className="absolute inset-0 m-auto text-primary-900 z-30" />
            ) : (
              ""
            )}
            {dataProducts.length > 0 ? (
              dataProducts.map((item: Product, idx: number) => (
                <div
                  className="flex flex-col gap-4 hover:shadow-xl p-4 h-fit border border-gray-300"
                  key={idx}
                >
                  <Link
                    href={`/products/` + item.slug}
                    className="flex justify-center items-center"
                  >
                    <Image
                      src={item.subProducts[0].options[0].images[0]}
                      className="w-auto h-40 object-contain object-center"
                      width="150"
                      height="150"
                      alt="product"
                    />
                  </Link>
                  <div className="flex  flex-col gap-4 justify-center items-center w-full">
                    <h1 className="text-black font-medium text-center capitalize h-24">
                      {item.name.substring(0, 40)}
                    </h1>
                    <div className="text-primary text-xl font-bold">
                      $ {item.subProducts[0].options[0].price}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div></div>
            )}
          </div>
        </form>
      </m.div>
    </>
  );
}
