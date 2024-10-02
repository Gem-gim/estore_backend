"use client";
import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { m } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function UserMenu({ openMenuUser }: { openMenuUser: boolean }) {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    openMenuUser && (
      <m.div
        className={cn(
          "w-[320px] rounded-md bg-white px-4 py-8 absolute  shadow-2xl right-0 top-10 flex flex-col justify-center items-center gap-4 z-20"
        )}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 15 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <h4> Welcome to Carrefour </h4>
        {session ? (
          <div className={cn("flex items-center gap-4 ")}>
            <Image
              className="rounded-full w-auto h-auto"
              src={
                session?.user?.image
                  ? session.user.image
                  : "https://cdn-icons-png.flaticon.com/128/236/236831.png"
              }
              width="80"
              height="80"
              alt="product"
            />
            <div
              className={cn("flex flex-col justify-center items-center gap-1 ")}
            >
              <span>Welcome back</span>
              <h4 className="font-bold text-primary text-xl capitalize">
                {session.user?.name}
              </h4>
              <Button
                className="underline hover:bg-primary bg-transparent text-black font-bold hover:text-primary-900"
                onClick={() => {
                  signOut({ callbackUrl: "/" });
                }}
              >
                Sign out
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Button
              className="w-fit bg-primary hover:bg-white hover:border hover:text-black text-white"
              onClick={() => router.push("/signin")}
            >
              Register
            </Button>
            <Button
              className="w-fit bg-white hover:bg-black hover:border hover:text-white text-black border"
              onClick={() => router.push("/signin")}
            >
              Login
            </Button>
          </div>
        )}
        {session ? (
          <ul className="flex flex-col gap-1 w-full items-start">
            <li>
              <hr />
            </li>
            <li className="hover:bg-neutral-50 w-full py-2 ps-2">
              <Link
                href={
                  session?.user?.role === "admin"
                    ? "/admin/dashboard"
                    : "/account/dashboard"
                }
              >
                Dashboard
              </Link>
            </li>
            <li className="hover:bg-neutral-50 w-full py-2 ps-2">
              <Link href="/account/profil">Account</Link>
            </li>
            <li className="hover:bg-neutral-50 w-full py-2 ps-2">
              <Link href="/account/orders">My orders</Link>
            </li>
            {/* <li className="hover:bg-neutral-50 w-full py-2 ps-2">
              <Link href="/profile/messages">Message center</Link>
            </li> */}
            <li className="hover:bg-neutral-50 w-full py-2 ps-2">
              <Link href="/account/address">Address</Link>
            </li>
            {/* <li className="hover:bg-neutral-50 w-full py-2 ps-2">
              <Link href="/profile/wishlist">Wishlist</Link>
            </li> */}
          </ul>
        ) : (
          ""
        )}
      </m.div>
    )
  );
}
