import Image from "next/image";
import Link from "next/link";
import React from "react";
import { CiMenuBurger } from "react-icons/ci";

interface MobileButtonOpenProps {
  openSidebar: boolean;
  setOpenSidebar: (arg: boolean) => void;
}

const MobileButtonOpen = ({
  setOpenSidebar,
  openSidebar,
}: MobileButtonOpenProps) => {
  return (
    <div className="lg:hidden flex items-center gap-1">
      <button
        className=""
        onClick={(e) => {
          e.stopPropagation();
          setOpenSidebar(!openSidebar);
        }}
      >
        <CiMenuBurger className="text-slate-700 dark:text-white" size={100} />
      </button>
      <Link href="/" className="hidden lg:block">
        <Image
          className="w-10 h-10"
          src="/assets/images/logo.svg"
          alt="logo"
          width="30"
          height="30"
        />
      </Link>
    </div>
  );
};

export default MobileButtonOpen;
