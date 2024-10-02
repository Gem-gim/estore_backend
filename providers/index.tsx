"use client";
import * as React from "react";
import FramerMotionProvider from "./FramerMotionProvider";
import ToasterProvider from "./ToastProvider";
import AuthProvider from "./AuthProvider";
import store from "@/store/index";
import { Provider } from "react-redux";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <Provider store={store}>
        <FramerMotionProvider>
          <Provider store={store}>
            <ToasterProvider />
            {children}
          </Provider>
        </FramerMotionProvider>
      </Provider>
    </AuthProvider>
  );
};

export default Providers;
