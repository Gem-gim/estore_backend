"use client";
import { cn } from "@/lib/utils";
import axios from "axios";
import React, { useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import {  Plus } from "lucide-react";

import toast from "react-hot-toast";
import { Brand, Category, SubCategory } from "@/types";
import Container from "../../custom/Container";
import CustomToast from "../../custom/CustomToast";
import { ClipLoader } from "react-spinners";

export type initialValuesProps = {
  name: string;
  brand: string;
  description: string;
  category: string;
  subCategories: string;
};
export default function ProductContent({
  categories,
  brands,
}: {
  categories: Category[];
  brands: Brand[];
}) {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [selectedCategory, setSelectedCategory] = useState("");

  const validate = Yup.object({
    subCategories: Yup.mixed().required("required"),
    name: Yup.string()
      .required("required")
      .min(4, "at least 4")
      .max(100, "100 max characters"),
    description: Yup.string()
      .required("required")
      .min(4, "at least 4")
      .max(255, "255 max characters"),
    brand: Yup.string().required("requirEdited"),
  });

  const initialValues = {
    name: "",
    brand: "",
    description: "",
    category: "",
    subCategories: "",
  };

  const router = useRouter();

  const createProduct = (values: initialValuesProps) => {
    setLoading(true);

    axios
      .post(process.env.NEXT_PUBLIC_SERVER_URL + "/api/admin/products", values)
      .then((response) => {
        const data = response.data;

        toast.custom(<CustomToast message={data.message} status="success" />);
        router.push(`/admin/products/${data.data._id}`);
      })
      .catch((err) => {
        toast.custom(<CustomToast message={err.message} status="error" />);
      })
      .finally(() => {
        // setLoading(false);
      });
  };

  const loadSubcategories = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);

    const data = {
      params: {
        categoryId: e.target.value,
      },
    };
    await axios
      .get(
        process.env.NEXT_PUBLIC_SERVER_URL + "/api/admin/subcategories",
        data
      )
      .then((response) => {
        const data = response.data;
        setSubs(data.data);

        setLoading(false);
      });
  };

  return (
    <section className={cn("px-10 py-8", loading && "pointer-events-none")}>
      <Container>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validate}
          onSubmit={async (values) => {
            createProduct(values);
          }}
        >
          {({ errors, touched, handleSubmit }) => (
            <Form className="bg-white p-6">
              {loading ? (
                <ClipLoader
                  className="fixed inset-0 m-auto z-20"
                  size={100}
                  color="#3c38ca"
                />
              ) : (
                ""
              )}

              <div className="flex flex-col gap-20">
                {/* <ProductImages
                  loading={loading}
                  setLoading={setLoading}
                  uploadImages={uploadImages}
                  setUploadImages={setUploadImages}
                /> */}

                <div className="flex flex-col gap-4">
                  <h2 className="font-bold text-xl">Basics info</h2>

                  <div className="w-full">
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Name*
                    </label>
                    <Field
                      name="name"
                      type="text"
                      id="name"
                      className={cn(
                        "block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500",
                        errors?.name && touched?.name && "border border-red-900"
                      )}
                      placeholder="name"
                    ></Field>
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="py-2 font-bold text-red-900"
                    />
                  </div>

                  <div className="w-full">
                    <label
                      htmlFor="description"
                      className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Description*
                    </label>
                    <Field
                      component="textarea"
                      name="description"
                      type="text"
                      id="description"
                      className={cn(
                        "block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500",
                        errors?.description &&
                          touched?.description &&
                          "border border-red-900"
                      )}
                      placeholder="description"
                    ></Field>
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="py-2 font-bold text-red-900"
                    />
                  </div>

                  <div className="w-full">
                    <label
                      htmlFor="brand"
                      className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      brand*
                    </label>
                    <Field
                      component="select"
                      name="brand"
                      type="text"
                      id="brand"
                      className={cn(
                        "block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500",
                        errors?.brand &&
                          touched?.brand &&
                          "border border-red-900"
                      )}
                      placeholder="select a brand"
                    >
                      <option value="">Select a brand</option>
                      {brands &&
                        brands.map((item: Brand, idx: number) => (
                          <option
                            key={idx}
                            className="text-slate-700 captitalize text-sm/8"
                            value={item._id}
                          >
                            {item.name}
                          </option>
                        ))}
                    </Field>
                    <ErrorMessage
                      name="brand"
                      component="div"
                      className="py-2 font-bold text-red-900"
                    />
                  </div>

                  <div className="w-full">
                    <label
                      htmlFor="categorySelect"
                      className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Select category *
                    </label>
                    <Field
                      disabled={loading}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        loadSubcategories(e)
                      }
                      component="select"
                      name="category"
                      type="text"
                      id="category"
                      className={cn(
                        "block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500",
                        errors?.category &&
                          touched?.category &&
                          "border border-red-900"
                      )}
                      placeholder="select category"
                    >
                      <option value="">select a category</option>
                      {categories &&
                        categories.map((item: Category, idx: number) => (
                          <option
                            key={idx}
                            className="text-slate-700 captitalize text-sm/8"
                            value={item._id}
                          >
                            {item.name}
                          </option>
                        ))}
                    </Field>
                    <ErrorMessage
                      name="subCategories"
                      component="div"
                      className="py-2 font-bold text-red-900"
                    />
                  </div>

                  <div className="w-full">
                    <label
                      htmlFor="subCategories[]"
                      className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Select sub-categories*
                    </label>
                    <Field
                      disabled={loading}
                      multiple
                      component="select"
                      name="subCategories"
                      type="text"
                      id="subCategories[]"
                      className={cn(
                        "block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500",
                        errors?.subCategories &&
                          touched?.subCategories &&
                          "border border-red-900"
                      )}
                      placeholder="select categories"
                    >
                      {subs &&
                        subs.map((item: SubCategory, idx: number) => (
                          <option
                            key={idx}
                            className="text-slate-700 captitalize text-sm/8"
                            value={item._id}
                          >
                            {item.name}
                          </option>
                        ))}
                    </Field>
                    <ErrorMessage
                      name="subCategories"
                      component="div"
                      className="py-2 font-bold text-red-900"
                    />
                  </div>
                </div>

                {/* <div className="flex flex-col gap-4">
                  <h2 className="font-bold text-xl">Colors & Sizes Info</h2>

                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Color*
                    </label>

                    <Field
                      disabled={loading}
                      component="select"
                      name="color"
                      type="text"
                      id="color"
                      className={cn(
                        "block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500",
                        errors?.color &&
                          touched?.color &&
                          "border border-red-900"
                      )}
                      placeholder="select color"
                    >
                      <option value="">select a color</option>
                      {colors &&
                        colors.map((color: any, idx: any) => (
                          <option
                            value={color._id}
                            style={{ background: `${color.color}` }}
                          >
                            {color.name}
                          </option>
                        ))}
                    </Field>

                    <ErrorMessage
                      name="parent"
                      component="div"
                      className="py-2 font-bold text-red-900"
                    />
                  </div>

                  <div className="w-full">
                    <label
                      htmlFor="subCategories[]"
                      className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Select sizes*
                    </label>
                    <Field
                      disabled={loading}
                      multiple
                      component="select"
                      name="size"
                      type="text"
                      id="size[]"
                      className={cn(
                        "block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500",
                        errors?.sizes &&
                          touched?.sizes &&
                          "border border-red-900"
                      )}
                      placeholder="select size"
                    >
                      {sizes &&
                        sizes.map((item: any, idx: any) => (
                          <option
                            key={idx}
                            className="text-slate-700 captitalize text-sm/8"
                            value={item._id}
                          >
                            {item.size}
                          </option>
                        ))}
                    </Field>
                    <ErrorMessage
                      name="size"
                      component="div"
                      className="py-2 font-bold text-red-900"
                    />
                  </div>
                </div> */}

                <div className="sm:col-span-2 flex gap-4">
                  <button
                    disabled={loading}
                    onClick={() => handleSubmit()}
                    type="submit"
                    className="flex w-full bg-primary-400 text-white items-center justify-center gap-2 rounded-lg border border-gray-200 bg-primary px-5 py-2.5 text-sm font-medium  hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-black dark:hover:text-white dark:focus:ring-gray-700"
                  >
                    <Plus className="text-white hover:text-primary-700" />
                    <span>Save</span>
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </Container>
    </section>
  );
}
