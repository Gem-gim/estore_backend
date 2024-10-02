"use client";
import { cn } from "@/lib/utils";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Loader, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";
import axios from "axios";
import { Brand, Category, Product, SubCategory } from "@/types";
import { Badge } from "@/components/ui/badge";

export type initialValuesProps = {
  id: string | undefined;
  step: string;
  name: string;
  brand: string | undefined;
  description: string;
  category: string | undefined;
  subCategories: string[];
};
export default function ProductDescription({
  product,
  brands,
  categories,
  loading,
  setLoading,
}: {
  product: Product;
  brands: Brand[];
  categories: Category[];
  loading: boolean;
  setLoading: (value: boolean) => void;
}) {
  const validate = Yup.object({
    subCategories: Yup.mixed().required("required"),
    name: Yup.string()
      .required("required")
      .min(4, "at least 4")
      .max(255, "255 max characters"),
    description: Yup.string()
      .required("required")
      .min(4, "at least 4")
      .max(255, "255 max characters"),
    brand: Yup.string().required("required"),
  });

  const initialValues = {
    id: product._id,
    step: "basicinfo",
    name: product.name,
    brand: product.brand._id,
    description: product.description,
    category: product.category._id,
    subCategories: JSON.parse(JSON.stringify(product.subCategories)),
  };

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState(
    JSON.parse(JSON.stringify(product.subCategories))
  );
  const [subs, setSubs] = useState([]);
  const [subCategorySelect, setSubCategorySelect] = useState("");

  const router = useRouter();

  const updateProduct = (values: initialValuesProps) => {
    values.subCategories = selectedSubCategory;
    values.category = selectedCategory;

    setLoading(true);
    const myPromise = axios
      .put(process.env.NEXT_PUBLIC_SERVER_URL + "/api/admin/products", values)
      .then((response) => {
        const data = response.data;
        router.push(`/admin/products/${data.data.slug}`);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
    toast.promise(myPromise, {
      loading: "Please wait...",
      success: "Done.",
      error: "Error when fetching",
    });
  };

  const loadSubcategories = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLoading(true);

    setSelectedCategory(e.target.value);
    const data = {
      params: {
        categoryId: e.target.value,
      },
    };
    await axios
      .get(process.env.NEXT_PUBLIC_SERVER_URL + "/api/admin/subcategories", data)
      .then((response) => {
        const data = response.data;
        setSubs(data.data);
        setLoading(false);
      });
  };

  const addSubcategory = async (item: React.ChangeEvent<HTMLSelectElement>) => {
    const innerText = item.target.selectedOptions[0].text;
    const value = item.target.value;
    setSubCategorySelect(value);

    const data = { _id: value, name: innerText };

    const check = selectedSubCategory.find(
      (sub: SubCategory) => sub._id === value
    );

    if (!check) {
      setSelectedSubCategory([...selectedSubCategory, data]);
    }
  };

  const removeSubCategory = (item: SubCategory) => {
    const newArray = selectedSubCategory.filter(
      (sub: SubCategory) => sub._id != item._id
    );
    setSelectedSubCategory(newArray);
  };

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validate}
      onSubmit={async (values) => {
        updateProduct(values);
      }}
    >
      {({ values, errors, touched }) => (
        <Form className="bg-white p-6">
          <div className="bg-white p-4 ">
            <h2 className="mb-10 font-bold ">Product Information</h2>

            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <label htmlFor="name">Name*</label>
                <Field
                  type="text"
                  className={cn(
                    "block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500",
                    errors?.name && touched?.name && "border border-red-900"
                  )}
                  name="name"
                />
              </div>

              <Field type="hidden" name="step" value="basicinfo" />
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="message"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Description*
                </label>
                <Field
                  component="textarea"
                  name="description"
                  id="message"
                  rows={4}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Write your description..."
                ></Field>
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
                    errors?.brand && touched?.brand && "border border-red-900"
                  )}
                  placeholder="select a brand"
                  value={values.brand}
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
                  htmlFor="category"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  category*
                </label>
                <Field
                  value={selectedCategory}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
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
                  placeholder="select a brand"
                >
                  <option value="">Select a category</option>
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
                  name="category"
                  component="div"
                  className="py-2 font-bold text-red-900"
                />
              </div>

              <div className="w-full">
                <label
                  htmlFor="SubCategories"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Sub Categories*
                </label>
                <Field
                  disabled={loading}
                  value={subCategorySelect}
                  multiple
                  component="select"
                  name="subCategories"
                  type="text"
                  id="subCategories"
                  className={cn(
                    "block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500",
                    errors?.subCategories &&
                      touched?.subCategories &&
                      "border border-red-900"
                  )}
                  placeholder="select a SubCategories"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    addSubcategory(e)
                  }
                >
                  <option value="">Select a category</option>
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
                  name="category"
                  component="div"
                  className="py-2 font-bold text-red-900"
                />
              </div>

              <div className="p-2 w-full flex flex-wrap gap-4">
                {selectedSubCategory.map((value: SubCategory, key: number) => {
                  return (
                    <Badge key={key} className="gap-4">
                      <span>{value.name}</span>{" "}
                      <X
                        className="text-white h-6 w-6 cursor-pointer"
                        onClick={() => removeSubCategory(value)}
                      />{" "}
                    </Badge>
                  );
                })}
              </div>

              <div className="sm:col-span-2 flex gap-4">
                {loading ? (
                  <div className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-gray-100 px-5 py-2.5 text-sm font-medium text-white hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700">
                    <Loader className="animate-spin text-slate-400 h-6 w-6" />
                  </div>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full text-black items-center justify-center gap-2 rounded-lg border border-gray-200 bg-primary px-5 py-2.5 text-sm font-medium hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-black dark:hover:text-white dark:focus:ring-gray-700"
                  >
                    <Plus className="text-black" />
                    <span>Save</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
