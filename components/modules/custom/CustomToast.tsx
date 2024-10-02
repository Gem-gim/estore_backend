"use client";
import { AlertCircle, CheckCheck, X } from "lucide-react";
import Link from "next/link";
import React from "react";
import { m } from "framer-motion";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

export default function CustomToast({
  status = "success",
  message,
  link,
  toastId,
}: {
  status?: string;
  message: string;
  link?: string;
  toastId?: string;
}) {
  return (
    <m.div
      initial={{ opacity: 0, y: -15 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "flex items-center p-4 mb-4 text-primary-800 border-t-4 border-primary-300 bg-primary-50 dark:text-primary-400 dark:bg-gray-800 dark:border-blue-800 w-80 justify-between shadow-md",
        status === "error" && "text-red-800 border-t-4 border-red-300"
      )}
      role="alert"
    >
      {status === "success" ? (
        <CheckCheck className="w-8 h-8 text-primary-700" />
      ) : (
        <AlertCircle className="w-8 h-8 text-red-700" />
      )}{" "}
      <div className="ms-3 text-sm font-medium">
        {message}
        {link && (
          <Link href="#" className="font-semibold underline hover:no-underline">
            {link}
          </Link>
        )}
      </div>
      <button
        onClick={() => toast.remove(toastId)}
        type="button"
        className={cn(
          "ms-auto -mx-1.5 -my-1.5 bg-blue-50 text-primary-500 rounded-lg focus:ring-2 focus:ring-blue-400 p-1.5 hover:bg-blue-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700"
        )}
        data-dismiss-target="#alert-border-1"
        aria-label="Close"
      >
        <X
          className={cn(
            "text-primary-700 h-6 w-6",
            status === "error" && "text-red-800 border-t-4 border-red-300"
          )}
        />
      </button>
    </m.div>
  );
}
