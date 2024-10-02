"use client";

import React, { useState } from "react";
import ProductVariation from "./ProductVariation";
import ProductDescription from "./ProductDescription";
import ProductAdditionnal from "./ProductAdditionnal";
import { Brand, Category, Product } from "@/types";
import Container from "../../custom/Container";

export default function ProductEdit({
  product,
  brands,
  categories,
}: {
  product: Product;
  brands: Brand[];
  categories: Category[];
}) {
  const [loading, setLoading] = useState(false);

  return (
    <section className="p-10 ">
      <Container>
        <div className="flex flex-col gap-10">
          <ProductDescription
            product={product}
            brands={brands}
            categories={categories}
            loading={loading}
            setLoading={setLoading}
          />
          <ProductVariation
            product={product}
            loading={loading}
            setLoading={setLoading}
          />

          <ProductAdditionnal
            product={product}
            loading={loading}
            setLoading={setLoading}
          />
        </div>
      </Container>
    </section>
  );
}
