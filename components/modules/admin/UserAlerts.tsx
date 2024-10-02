import clsx from "clsx";
import React from "react";
import { MdNotifications } from "react-icons/md";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
const notifications = [
  {
    title: "Lorems ipsm dale",
    description: "Lorems ipsum dali capitiva danius golem sa leh ",
    date: "12 May 2024",
  },
  {
    title: "Lorems ipsm dale",
    description: "Lorems ipsum dali capitiva danius golem sa leh ",
    date: "12 May 2024",
  },
  {
    title: "Lorems ipsm dale",
    description: "Lorems ipsum dali capitiva danius golem sa leh ",
    date: "12 May 2024",
  },
  {
    title: "Lorems ipsm dale",
    description: "Lorems ipsum dali capitiva danius golem sa leh ",
    date: "12 May 2024",
  },
];
const UserAlerts = () => {
  return (
    <div className={clsx("relative hidden items-center gap-4", "lg:flex ")}>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            className="relative border rounded-full dark:border-slate-600 bg-transparent"
          
            color="warning"
            
            aria-label="Take a photo"
          >
            <MdNotifications
              className="text-slate-500 dark:text-white"
              size={15}
            />
            <span className="h-3 w-3 rounded-full animate-ping bg-sky-500 absolute top-0 right-10"></span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="bg-white text-slate-500 dark:bg-dark dark:text-slate-400 overflow-y-auto overflow-x-hidden max-h-[300px] min-w-[300px] z-10 absolute top-[12px] right-4 lg:right-[80px] [&>ul>li]:border-b  [&>ul>li]:border-b-slate-100 dark:[&>ul>li]:border-b-slate-700 last:[&>ul>li]:border-b-0"
          aria-label="Dropdown menu with description"
        >
          {notifications &&
            notifications.map((item, idx) => (
              <DropdownMenuItem
                key={idx}
                className={clsx(
                  "hover:bg-neutral-50 p-2 text-sm",
                  "dark:hover:bg-darkgray dark:hover:bg-neutral-50 dark:hover:text-slate-900 "
                )}
              >
                <span className="text-balance font-bold dark:text-slate-300 dark:group-hover:text-slate-900">
                  {item.title}
                </span>
                <p className="text-pretty mb-4">{item.description}</p>
                <span className="">{item.date}</span>
              </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserAlerts;
