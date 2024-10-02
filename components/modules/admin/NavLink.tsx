import clsx from "clsx";
import Link from "next/link";
import React from "react";

const Navlink = () => {
  return (
    <Link href="/" className="flex items-center gap-4">
      <span
        className={clsx(
          "text-primary-900 font-bold text-[25px]",
          "dark:text-slate-100"
        )}
      >
        ADMIN
      </span>
    </Link>
  );
};

export default Navlink;
