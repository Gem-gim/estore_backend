"use server";
import Sidebar from "@/components/modules/admin/Sidebar";
import Header from "@/components/modules/admin/Header";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserById } from "@/actions/user";
import * as React from "react";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = await getUserById(session?.user?.id!);
  if (!session || user?.role === "user") {
    redirect("/");
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 bg-neutral-200 overflow-y-auto overflow-x-hidden">
        <Header />
        <main className=" h-screen">{children}</main>
      </div>
    </div>
  );
}
