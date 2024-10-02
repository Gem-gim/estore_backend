import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import clsx from "clsx";
import {SunDim } from "lucide-react";
import { RiMoonFill } from "react-icons/ri";

const DarkModeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <label className="relative h-[35px] min-w-[75px] flex items-center rounded-full bg-slate-300">
      <input
        type="checkbox"
        className="absolute top-0 z-50 m-0 h-full w-full cursor-pointer opacity-0"
        onChange={() => setTheme(theme === "light" ? "dark" : "light")}
      />
      <span
        className={clsx(
          "flex items-center justify-center h-[28px] w-[28px] bg-white rounded-full ms-1 translate-x-0 duration-700 ease-linear",
          theme === "dark" && "!translate-x-full !rotate-180 !ms-4"
        )}
      >
        {theme === "dark" ? (
          <RiMoonFill size={20} className="text-slate-800" />
        ) : (
          <SunDim size={20} className="text-slate-800" />
        )}
      </span>
    </label>
  );
};

export default DarkModeSwitcher;
