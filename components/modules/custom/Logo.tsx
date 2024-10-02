import Link from "next/link";
import Image from "next/image";
import React from "react";

export default function Logo() {
  return (
    <Link href="/" className="flex gap-4 items-center justify-center">
      <Image
        priority
        src="/assets/images/logo.svg"
        width={60}
        height={60}
        alt="logo"
      />
      <span className="hidden lg:flex text-[40px] font-bold tracking-tigh mt-1 text-primary-900 antialiased ">
        Carrefour
      </span>
    </Link>
  );
}
