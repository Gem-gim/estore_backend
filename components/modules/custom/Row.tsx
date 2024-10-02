import { cn } from "@/lib/utils";
import React from "react";

export default function Row({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("w-full h-full flex items-center", className)}>{children}</div>
  );
}
