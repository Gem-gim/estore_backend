"use client";
import { IRootState } from "@/store";
import { FolderKanban, Home, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { memoize } from "proxy-memoize";
import React from "react";
import { useSelector } from "react-redux";

export default function MobileBottom() {
  const { cart } = useSelector(memoize((state: IRootState) => ({ ...state })));
  return (
    <div className="bg-white z-40 w-full flex border-t border-t-gray-300 h-20 px-10 fixed shadow-slate-600 shadow-md bottom-0 left-0 lg:hidden">
      <div className="flex items-center justify-center gap-8 w-full">
        <Link
          href="/products"
          className="flex flex-col gap-1 items-center justify-center"
        >
          <FolderKanban className="text-slate-600 h-5 w-5" />
          <span className="font-normal text-sm text-slate-600 text">
            Categories
          </span>
        </Link>

        {/* <Link
          href="/compare"
          className="flex flex-col gap-1 items-center justify-center relative"
        >
          <Shuffle className="text-slate-600 h-5 w-5" />
          <span className="absolute grid grid-place-content-center -top-1 right-2   bg-red-600 text-white rounded-full text-sm w-4 h-4  text-center">
            0
          </span>
          <span className="font-normal text-sm text-slate-600 text">
            Compare
          </span>
        </Link> */}
        <Link
          href="/"
          className="flex flex-col gap-1 items-center justify-center"
        >
          <Home className="text-slate-600 h-5 w-5" />
          <span className="font-normal text-sm text-slate-600 text">Home</span>
        </Link>
        <Link
          href="/cart"
          className="flex flex-col gap-1 items-center justify-center relative"
        >
          <ShoppingCart className="text-slate-600 h-5 w-5" />
          <span className="absolute grid grid-place-content-center -top-1 -right-1  bg-red-600 text-white rounded-full text-sm w-4 h-4 text-center">
            {cart.cartItems.length}
          </span>
          <span className="font-normal text-sm text-slate-600 text">Cart</span>
        </Link>
        <Link
          href="/signin"
          className="flex flex-col gap-1 items-center justify-center"
        >
          <User className="text-slate-600 h-5 w-5" />
          <span className="font-normal text-sm text-slate-600 text">
            Account
          </span>
        </Link>
      </div>
    </div>
  );
}
