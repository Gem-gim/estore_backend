"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function Heading({ name }: { name: string }) {
  const router = useRouter();
  return (
    <div className="flex gap-4 items-center">
      <Button
        onClick={(e) => {e.preventDefault(); router.back()}}
        className="border-0"
        variant="outline"
        size="icon"
      >
        <ChevronLeft />
      </Button>
      <h1 className="text-3xl font-bold tracking-tighter">{name} </h1>
    </div>
  );
}
