"use client";
import { Toaster } from "react-hot-toast";
import * as React from "react";

const ToasterProvider = () => {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        position: "top-center",
        duration: 6000,
      }}
    />
  );
};

export default ToasterProvider;
