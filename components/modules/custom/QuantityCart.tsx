"use client";
import { updateToCart } from "@/store/cartSlice";
import { CartItem } from "@/types";
import { MinusIcon, PlusIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { IRootState } from "@/store";

export default function QuantityCart({ item }: { item: CartItem }) {
  const { cart } = useSelector((state: IRootState) => ({ ...state }));

  const dispatch = useDispatch();
  const [qty, setQty] = useState<number>(1);

  const updateQty = (value: string) => {
    if (value === "dec") {
      if (qty === 1) {
        toast.error("your reached the limit");
        return;
      }
    }
    if (value === "inc") {
      if (qty === 9) {
        toast.error("your reached the limit");
        return;
      }
    }

    // Cart operation
    if (value === "dec") {
      setQty(qty === 1 ? qty : qty - 1);
    }
    if (value === "inc") {
      setQty(qty === 9 ? qty : qty + 1);
    }

    // Update cart
    const newCart = cart.cartItems.map((p: CartItem) => {
      if (p._uid === item._uid) {
        return {
          ...p,
          qty: value === "dec" ? qty - 1 : qty + 1,
        };
      }
      return p;
    });

    dispatch(updateToCart(newCart));
  };

  useEffect(() => {
    setQty(item.qty);
  }, [item]);

  return (
    <div className="inline-flex gap-4"> 
      <div
        onClick={() => updateQty("dec")}
        className="group bg-neutral-100 p-1 rounded-md grid place-content-center hover:bg-primary-700"
      >
        <MinusIcon className="text-slate-700 h-4 w-4 group-hover:text-white" />
      </div>
      <span>{qty}</span>
      <div
        onClick={() => updateQty("inc")}
        className="group bg-neutral-100 p-1 rounded-md grid place-content-center hover:bg-primary-700"
      >
        <PlusIcon className="text-slate-700 h-4 w-4 group-hover:text-white" />
      </div>
    </div>
  );
}
