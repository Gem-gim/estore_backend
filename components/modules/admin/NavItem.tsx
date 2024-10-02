import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { IconType } from "react-icons";

interface NavItemProps {
  route: string;
  icon: IconType;
  label: string;
}

const NavItem = ({ route, icon: Icon, label }: NavItemProps) => {
  const pathname = usePathname();

  return (
    <li className="mb-2">
      <Link
        href={route}
        className={clsx(
          "group text-[18px]  group relative  flex items-center gap-3 rounded-sm py-3 px-4 font-medium text-dark duration-300 ease-in-out hover:bg-neutral-50 hover:text-primary hover:font-bold capitalize",
          pathname === route
            ? [
                " bg-primary-50 text-indigo-500 font-bold",
                "dark:bg-slate-600 dark:border-l-white dark:text-slate-100",
              ]
            : ["border-l border-l-transparent"],
          "dark:text-slate-300 dark:hover:bg-graydark"
        )}
      >
        <Icon
          className={clsx(
            "ms-2 font-bold text-slate-900 group-hover:text-primary group-hover:font-bold",
            "dark:text-slate-300",
            pathname === route ? "dark:text-slate-100 text-indigo-500" : ""
          )}
        />
        <span>{label}</span>
      </Link>
    </li>
  );
};

export default NavItem;
