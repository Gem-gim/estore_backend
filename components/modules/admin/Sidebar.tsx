"use client";
import clsx from "clsx";
import React, { useRef, useState } from "react";
import { MdOutlineSettings } from "react-icons/md";
import Navlink from "./NavLink";
import MobileButtonClose from "./MobileButtonClose";
import NavItem from "./NavItem";

const routes = [
  {
    route: "/admin/dashboard",
    label: "dashboard",
    icon: MdOutlineSettings,
  },
  // {
  //   route: "/admin/sales",
  //   label: "sales",
  //   icon: MdOutlineSettings,
  // },
  {
    route: "/admin/orders",
    label: "orders",
    icon: MdOutlineSettings,
  },
  {
    route: "/admin/users",
    label: "users",
    icon: MdOutlineSettings,
  },
  {
    route: "/admin/products",
    label: "products",
    icon: MdOutlineSettings,
  },
  {
    route: "/admin/categories",
    label: "categories",
    icon: MdOutlineSettings,
  },
  {
    route: "/admin/brands",
    label: "brands",
    icon: MdOutlineSettings,
  },
  {
    route: "/admin/sub-categories",
    label: "sub categories",
    icon: MdOutlineSettings,
  },
  {
    route: "/admin/coupons",
    label: "coupons",
    icon: MdOutlineSettings,
  },
  {
    route: "/admin/settings",
    label: "settings",
    icon: MdOutlineSettings,
  },
  {
    route: "/admin/slides",
    label: "Slides",
    icon: MdOutlineSettings,
  },
  {
    route: "/admin/pages",
    label: "Pages",
    icon: MdOutlineSettings,
  },
  // {
  //   route: "/admin/sizes",
  //   label: "sizes",
  //   icon: MdOutlineSettings,
  // },
  // {
  //   route: "/admin/settings",
  //   label: "settings",
  //   icon: MdOutlineSettings,
  //   subs: [
  //     {
  //       route: "/admin/banners",
  //       label: "banners",
  //       icon: MdOutlineSettings,
  //     },
  //     {
  //       route: "/admin/pages",
  //       label: "pages",
  //       icon: MdOutlineSettings,
  //     },
  //     {
  //       route: "/admin/logo",
  //       label: "logo",
  //       icon: MdOutlineSettings,
  //     },
  //   ],
  // },
];

const SidebarOne = () => {
  const sidebar = useRef<HTMLDivElement>(null);

  const [openSidebar, setOpenSidebar] = useState(false);

  // close sidebar when click outside
  // useEffect(() => {
  //   const clickHandler = ({ target }: { target: Node }) => {
  //     if (sidebar?.current?.contains(target) || !openSidebar) {
  //       return;
  //     }
  //     setOpenSidebar(false);
  //   };
  //   document.addEventListener("click", clickHandler);
  //   return () => {
  //     document.removeEventListener("click", clickHandler);
  //   };
  // });

  return (
    <aside
      ref={sidebar}
      className={clsx(
        "absolute left-0 top-0 max-w-[360px] lg:min-w-[300px] h-screen bg-white duration-300 ease-linear",
        "lg:translate-x-0 lg:static shadow-neutral-300",
        openSidebar ? "translate-x-0" : "-translate-x-full",
        "dark:bg-dark"
      )}
    >
      {/* header  */}
      <div className="flex items-center gap-2 justify-between w-full p-6">
        <Navlink />
        <MobileButtonClose
          openSidebar={openSidebar}
          setSidebarOpen={setOpenSidebar}
        />
      </div>

      {/* body */}
      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav>
          <div className="p-4">
            <h1 className="text-slate-700 text-md uppercase mb-4 ">
              Main Menu
            </h1>
            <ul className={clsx("flex flex-col gap-2 justify-center")}>
              {routes &&
                routes.map((item, idx) => (
                  <NavItem
                    key={idx}
                    route={item.route}
                    icon={item.icon}
                    label={item.label}
                  />
                ))}
            </ul>
          </div>
        </nav>

        {/* <div className="mt-4 w-full flex justify-center">
          <Link href="/">
            <Image
              src="/images/banners/banner_1.svg"
              alt="banner"
              height={100}
              width="200"
            />
          </Link>
        </div> */}
      </div>
    </aside>
  );
};

export default SidebarOne;
