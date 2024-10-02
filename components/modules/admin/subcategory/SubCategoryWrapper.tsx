"use client";
import React, { useEffect, useState } from "react";
import { DataTableSubCategories } from "./TableSubCategories";
import Container from "../../custom/Container";
import { Category, SubCategory } from "@/types";
import axios from "axios";
import { ClipLoader } from "react-spinners";

export default function SubCategoryWrapper() {
  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  useEffect(() => {
    const getCategories = () => {
      setLoading(true);
      axios
        .get(process.env.NEXT_PUBLIC_SERVER_URL + "/api/admin/categories")
        .then((response) => {
          setCategories(response.data.data);
        })
        .catch((error) => {
          console.log(error.message);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    const getSubCategories = () => {
      setLoading(true);
      axios
        .get(process.env.NEXT_PUBLIC_SERVER_URL + "/api/admin/subcategories")
        .then((response) => {
          setSubCategories(response.data.data);
        })
        .catch((error) => {
          console.log(error.message);
        })
        .finally(() => {
          setLoading(false);
        });
    };
    getCategories();
    getSubCategories();
  }, []);

  return (
    <section className="">
      <Container className="mx-auto px-10">
        {loading ? (
          <ClipLoader
            className="fixed inset-0 m-auto z-20"
            size={100}
            color="#3c38ca"
          />
        ) : (
          ""
        )}
        <DataTableSubCategories data={subCategories} categories={categories} />
      </Container>
    </section>
  );
}
