"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import clsx from "clsx";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const UserDropdown = () => {
  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";

  const { data: session } = useSession();
 const router = useRouter()
  return (
    <DropdownMenu className="flex gap-4 items-center cursor-pointer">
      <DropdownMenuTrigger>
        <div className="h-auto gap-4 flex bg-transparent hover:bg-transparent text-black">
          <div className="flex flex-col items-center gap-2 lg:flex">
            <h1 className="text-slate-900 text-sm font-bold leading-none dark:text-slate-100">
              {session?.user?.name}
            </h1>
            <span className="text-slate-600 text-xs font-normal leading-none dark:text-slate-400">
              {session?.user?.role}
            </span>
          </div>
          <Image
            className="rounded-full"
            src={session?.user?.image ? session.user.image : "https://cdn-icons-png.flaticon.com/128/149/149071.png"}
            alt="image"
            width={50}
            height={50}
          />

          <ChevronDown
            className="text-slate-700 dark:text-slate-300 hidden lg:block"
            size={20}
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[1040px] shadow-sm [&>ul]:w-80 bg-white absolute lg:right-60 z-40 top-0 text-slate-700 dark:bg-dark dark:text-slate-300 [&>ul>li]:border-b  [&>ul>li]:border-b-slate-100 dark:[&>ul>li]:border-b-slate-700 last:[&>ul>li]:border-b-0 right-4"
       
        aria-label="Dropdown menu with description space-y-10"
      >
        <DropdownMenuItem
          className={clsx(
            "w-[300px] flex gap-4 text-slate-700 hover:text-primary-700 font-medium py-4 px-2 text-sm",
            "dark:text-slate-300 dark:hover:bg-darkgray  dark:hover:text-slate-100"
          )}
    
          
        > <User size={26} className={iconClasses} />My profil</DropdownMenuItem>
        <DropdownMenuItem
          className={clsx(
            "flex gap-4 text-slate-700 hover:text-primary-700 font-medium py-4 px-2 text-sm",
            "dark:text-slate-300 dark:hover:bg-darkgray  dark:hover:fonttext-slate-100"
          )}
          
        > <Settings size={26} className={iconClasses} />Account setting</DropdownMenuItem>

        <DropdownMenuItem  onClick={() => {
                  signOut();
                  router.push("/");
                }}
          className={clsx(
            "flex gap-4 text-slate-700 hover:text-primary-700 font-medium py-4 px-2 text-sm",
            "dark:text-slate-300 dark:hover:bg-darkgray  dark:hover:text-slate-100"
          )}
        
        ><LogOut size={26} className={iconClasses} />Log Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
