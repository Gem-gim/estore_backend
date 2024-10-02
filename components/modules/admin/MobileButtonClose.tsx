import React from "react";
import { LucideChevronLeft } from "lucide-react";
import clsx from "clsx";

interface MobileButtonCloseProps {
  openSidebar: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const MobileButtonClose = ({
  setSidebarOpen,
  openSidebar,
}: MobileButtonCloseProps) => {
  return (
    <button
      aria-expanded={openSidebar}
      onClick={() => setSidebarOpen(!openSidebar)}
      className={clsx(
        "focus:outline-none focus-visible:none block ms-20",
        "lg:hidden"
      )}
    >
      <LucideChevronLeft
        className="text-slate-600 dark:text-slate-100"
        size="40"
      />
    </button>
  );
};

export default MobileButtonClose;
