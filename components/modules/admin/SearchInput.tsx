import React from "react";

import { Computer, Headset, SearchIcon } from "lucide-react";
import clsx from "clsx";
import { FaSlidersH } from "react-icons/fa";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const categories = [
  {
    label: "headset",
    icon: Headset,
  },
  {
    label: "computer",
    icon: Computer,
  },
];
const SearchInput = () => {

  return (
    <div className={clsx("hidden  max-w-[400px]", "lg:block")}>
      <form>
        <div className="flex justify-start max-w-[350px]">
          <Button className="relative rounded-full dark:border-slate-600 bg-transparent">
            <SearchIcon className="text-slate-500" />
          </Button>
          <input
            type="text"
            className={clsx(
              "w-full bg-transparent  focus:outline-none text-black dark:text-white "
            )}
            placeholder="Type to search..."
          />
          <span></span>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button className="relative rounded-full dark:border-slate-600 bg-transparent">
                <FaSlidersH
                  className="text-slate-500 dark:text-slate-300"
                  size={20}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="bg-white text-slate-700 dark:bg-dark dark:text-slate-300 [&>ul>li]:border-b  [&>ul>li]:border-b-slate-100 dark:[&>ul>li]:border-b-slate-700 last:[&>ul>li]:border-b-0"
              aria-label="Dropdown menu with description"
            >
              {categories &&
                categories.map((item, idx) => (
                  <DropdownMenuItem
                    key={idx}
                    className={clsx(
                      "hover:bg-neutral-50 p-2 text-sm",
                      "dark:hover:bg-darkgray dark:hover:bg-neutral-50 dark:hover:text-slate-900"
                    )}
                  ></DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </form>
    </div>
  );
};

export default SearchInput;
