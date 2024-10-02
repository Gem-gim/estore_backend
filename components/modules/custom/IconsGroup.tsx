"use client";
import React, { useState } from "react";
import { CiShoppingBasket } from "react-icons/ci";
import CurrencyFormat from "./CurrencyFormat";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import axios from "axios";
import { CartItem } from "@/types";
import { IRootState } from "@/store";
import { IoCloseOutline } from "react-icons/io5";
import { updateToCart } from "@/store/cartSlice";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { ShoppingBasket } from "lucide-react";
import { Button } from "@/components/ui/button";
import QuantityCart from "./QuantityCart";
import { memoize } from "proxy-memoize";
import CustomToast from "./CustomToast";
import { createOrder } from "@/store/orderSlice";

export type Order = {
  _id: string;
};

export default function IconsGroup() {
  const [sheetOpen, setSheetOpen] = useState(false);

  const { cart, order } = useSelector(
    memoize((state: IRootState) => ({ ...state }))
  );

  const dispatch = useDispatch();

  const handleRemoveItem = (item: CartItem) => {
    const newCart = cart.cartItems.filter(
      (p: CartItem) => p._uid !== item._uid
    );

    dispatch(updateToCart(newCart));
    toast.custom(
      <CustomToast message="Product deleted from cart" status="success" />
    );
  };

  const subtotal = cart.cartItems.reduce(
    (accumulator: number, currentValue: CartItem) =>
      accumulator + currentValue.price * currentValue.qty,
    0
  );

  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const addToCartHandler = async () => {
    if (order.orderDetails.length > 0) {
      toast.custom(
        <CustomToast
          message="An order has already been placing! Wait a second....."
          status="success"
        />
      );
      router.push("/checkout");
      return;
    }

    if (cart.cartItems.length == 0) {
      toast(
        <div className="w-[300px]">
          Your cart is empty
          <Link
            href="/products"
            className=" inline-flex items-center justify-between gap-4 font-bold text-primary"
          >
            &nbsp; Go to shop
          </Link>
        </div>
      );
      return;
    }
    if (status === "authenticated") {
      setLoading(true);

      const data = {
        cart: cart.cartItems,
        user_id: session?.user?.email,
      };

      axios
        .post(process.env.NEXT_PUBLIC_SERVER_URL + "/api/cart", data)
        .then(response => {
          const data = response.data;
          const order = data.addCart;
          if (data) {
            dispatch(createOrder({order}));
          }
          toast.custom(<CustomToast message={data.message} status="success" />);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
          const element: HTMLElement = document?.querySelector(
            "#openCart"
          ) as HTMLElement;
          element.click();
          router.push("/checkout");
        });
    } else {
      // e.preventDefault();
      signIn();
    }
  };

  return (
    <div className="hidden lg:flex items-center gap-8 justify-end ms-auto text-right">
      {/* TODO: Add WishList and Compare list */}
      {/* <button className="relative">
        <span className="absolute grid grid-place-content-center inset-y-1  left-3  bg-red-600 text-white rounded-full text-sm w-4 h-4">
          0
        </span>
        <CiShuffle className="text-slate-700 h-10 w-6 hover:text-primary-900 hover:font-bold" />
      </button>

      <button className="relative">
        <span className="absolute grid grid-place-content-center inset-y-1  left-3  bg-red-600 text-white rounded-full text-sm w-4 h-4 ">
          0
        </span>
        <CiHeart className="text-slate-700 h-10 w-6 hover:text-primary-900 hover:font-bold" />
      </button> */}

      {/* Cart  */}
      <div className="hidden w-auto ms-auto lg:flex">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger>
            <span className="relative" id="openCart">
              <span className="absolute grid grid-place-content-center top-0 left-0 bg-red-600 text-white rounded-full text-sm w-4">
                {cart.cartItems.length}
              </span>
              <CiShoppingBasket className="text-slate-700 h-10 w-6 hover:text-primary-900 hover:font-bold" />
            </span>
          </SheetTrigger>
          <SheetContent className="px-4 w-full md:w-[400px] p-0">
            <SheetHeader className="flex justify-between bg-primary-200 px-4">
              <SheetTitle className="text-slate-700 text-sm">
                Shopping cart
              </SheetTitle>
              <SheetDescription>your cart detail goes here</SheetDescription>
            </SheetHeader>

            <div className="flex flex-col h-full">
              <div className="flex flex-col gap-2 max-h-4/5 overflow-y-auto  flex-1">
                {cart.cartItems.length > 0 ? (
                  cart.cartItems.map((item: CartItem, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center gap-8 border-b border-slate-100 p-4"
                    >
                      <Image
                        src={item.images[0]}
                        alt=""
                        width="100"
                        height="100"
                      />
                      <div className="flex flex-col gap-4 w-full">
                        <div className="flex justify-between w-full">
                          <h1 className="text-black font-medium">
                            {item.name.substring(0, 40)}
                          </h1>
                          <IoCloseOutline
                            onClick={() => handleRemoveItem(item)}
                            size={32}
                            className="text-slate-700 hover:text-primary"
                          />
                        </div>
                        <div className="flex justify-between">
                          <QuantityCart item={item} />
                          <div className="text-primary text-base font-bold">
                            x ${item.price}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="grid place-content-center h-full  justify-items-center content-center gap-4">
                    <ShoppingBasket
                      className="text-slate-700 font-bold"
                      size={100}
                    />
                    <h1 className="flex font-medium text-2xl text-slate-700">
                      Your cart is empty
                    </h1>

                    <Button className="bg-primary-700 text-white border capitalize border-slate-200">
                      <Link href="/products">shop now</Link>
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid grid-rows-2 grid-cols-1 mb-12">
                <div className="flex items-center justify-between border-t border-b border-slate-100 p-4">
                  <span className="capitalize">sub total</span>
                  <span className="text-xl text-primary font-bold">
                    <CurrencyFormat value={subtotal} className="text-right" />
                  </span>
                </div>
                <div className="w-full p-4  bg-neutral-50 flex items-center justify-between gap-2">
                  <Button
                    onClick={() => setSheetOpen(false)}
                    className="bg-transparent border capitalize border-slate-400 text-black grow"
                  >
                    <Link href="/cart" className="hover:text-white">
                      view cart
                    </Link>
                  </Button>
                  <Button
                    onClick={() => {
                      loading === false ? addToCartHandler() : "";
                    }}
                    className="bg-primary-700 border-0 capitalize  grow text-white"
                  >
                    checkout
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <CurrencyFormat value={subtotal} className="max-w-[110px] text-right" />
    </div>
  );
}
