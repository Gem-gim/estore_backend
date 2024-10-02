"use client";
import React, { useState } from "react";
import Language from "./Language";
import Currency from "./Currency";
import { cn } from "@/lib/utils";

export default function LanguagesCurrency({
  className,
}: {
  className?: string;
}) {
  const [languages, setLanguages] = useState("English");
  const [currency, setcurrency] = useState("Usd");

  const handleLanguage = (value: string) => {
    setLanguages(value);
  };
  const handleCurrency = (value: string) => {
    setcurrency(value);
  };

  return (
    <div className={cn("", className)}>
      <Language languages={languages} handleLanguage={handleLanguage} />
      <Currency currency={currency} handleCurrency={handleCurrency} />
    </div>
  );
}
