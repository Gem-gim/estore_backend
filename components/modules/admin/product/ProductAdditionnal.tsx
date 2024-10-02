"use client";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Check, Send, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Detail, Product } from "@/types";

export type initialValuesProps = {
  id?: string;
  step: string;
  featured: boolean | undefined;
  content: string;
  name: string;
  value: string;
  details: Detail[];
};

export default function ProductAdditionnal({
  product,
  loading,
  setLoading,
}: {
  product: Product;
  loading: boolean;
  setLoading: (value: boolean) => void;
}) {
  setLoading(false);
  const router = useRouter();
  const validateVariation = Yup.object({
    content: Yup.string()
      .required("required")
      .min(4, "at least 4")
      .max(5050, "5050 max characters"),
    name: Yup.string()
      .required("required")
      .min(0, "at least 0")
      .max(60, "60 max"),

    value: Yup.string()
      .required("required")
      .min(0, "at least 0")
      .max(300, "300 max"),
  });

  const initialValues = {
    id: product._id,
    featured: product.featured,
    step: "additional",
    content: product.content,
    name: "",
    value: "",
    details: product.details,
  };

  const numRows: [] = [];
  const [details, setDetails] = useState<Detail[]>(product.details);

  // const handleAddInput = (e: any, values: any) => {
  //   setNumRows([...details, { id: uid() }]);
  // };

  const handleDeleteRow = (item: Detail) => {
    const newArray = details.filter(
      (row: Detail) => row.name.replace(" ", "") !== item.name.replace(" ", "")
    );
    setDetails(newArray);
    toast("deleted");
  };

  const handleSaveDetails = (values: initialValuesProps) => {
    setLoading(true);
    if (
      values.name == undefined ||
      values.name === "" ||
      values.value === "" ||
      values.value === undefined
    ) {
      toast("data is empty");
      setLoading(false);
      return;
    }

    const findName = details.find((item: Detail) => item.name === values.name);
    if (findName) {
      const newArray = details.filter(
        (item2: Detail) => item2.name !== values.name
      );

      newArray.push({
        name: values.name,
        value: values.value,
      });

      setDetails(newArray);

      toast("updated");
      console.log(details);
      return;
    }

    setDetails([
      ...details,
      {
        name: values.name,
        value: values.value,
      },
    ]);

    console.log(details);
    setLoading(false);
    toast("saved");
  };

  const saveProductDetail = (values: initialValuesProps) => {
    values.details = details;
    values.step = "additionnal";

    const data = {
      featured: values.featured ,
      content: values.content,
      details: details,
      step: "additionnal",
      id: values.id,
    };


    setLoading(true);
    axios
      .put(process.env.NEXT_PUBLIC_SERVER_URL + "/api/admin/products", data)
      .then((response) => {
        const data = response.data;

        toast(data.message);
        router.refresh();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validateVariation}
      onSubmit={async (values) => {
        saveProductDetail(values);
      }}
    >
      {({ errors, touched, values }) => (
        <Form className="bg-white p-6">
          <div className="bg-white p-4 ">
            <h2 className="font-bold ">Additional informations</h2>

            <div className="relative overflow-x-auto sm:rounded-lg space-y-10 my-10">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="featured"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Featured*
                </label>
                <Field
                  component="select"
                  as="select"
                  name="featured"
                  id="featured"
                  rows={4}
                  className={cn(
                    "block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
                    errors?.featured &&
                      touched?.featured &&
                      "border border-red-900"
                  )}
                  placeholder="Write your content here..."
                >
                  <option value={product.featured ? "yes" : "no"}>
                    {product.featured ? "YES" : "NO"}
                  </option>
                  <option value="yes">Yes</option>
                  <option value="no" selected>
                    No
                  </option>
                </Field>

                <ErrorMessage
                  name="featured"
                  component="div"
                  className="py-2 font-bold text-red-900"
                />
              </div>

              <Field type="hidden" name="step" value="additional" />
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="content"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Content*
                </label>
                <Field
                  component="textarea"
                  name="content"
                  id="content"
                  rows={4}
                  className={cn(
                    "block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
                    errors?.content &&
                      touched?.content &&
                      "border border-red-900"
                  )}
                  placeholder="Write your content here..."
                ></Field>

                <ErrorMessage
                  name="content"
                  component="div"
                  className="py-2 font-bold text-red-900"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="content"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Specifications*
                </label>

                <div className="flex gap-8 w-full">
                  <div className="w-full">
                    <Field
                      component="input"
                      name="name"
                      id="name"
                      className={cn(
                        "lowercase block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
                        errors?.name && touched?.name && "border border-red-900"
                      )}
                      placeholder="any detail name here."
                    ></Field>
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="py-2 font-bold text-red-900"
                    />
                  </div>

                  <div className="w-full">
                    <Field
                      component="input"
                      name="value"
                      id="value"
                      className={cn(
                        "block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
                        errors?.value &&
                          touched?.value &&
                          "border border-red-900"
                      )}
                      placeholder="any detail value here."
                    ></Field>
                    <ErrorMessage
                      name="value"
                      component="div"
                      className="py-2 font-bold text-red-900"
                    />
                  </div>

                  <button
                    className="p-2 bg-primary-700 rounded-md text-white"
                    onClick={() => handleSaveDetails(values)}
                  >
                    <Check className="text-white" />
                  </button>
                </div>

                {numRows.map((item: number, idx: number) => (
                  <div className="flex gap-8 w-full" key={idx}>
                    <Field
                      component="input"
                      name="name"
                      id="name"
                      className="lowercase block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="any detail name here."
                    ></Field>

                    <Field
                      component="input"
                      name="value"
                      id="value"
                      className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="any detail value here."
                    ></Field>

                    <Button
                      type="submit"
                      onClick={() => handleSaveDetails(values)}
                    >
                      <Check />
                    </Button>
                  </div>
                ))}

                <div className="relative overflow-x-auto shadow-md sm:rounded-lg my-10">
                  <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Value{" "}
                        </th>

                        <th scope="col" className="px-6 py-3">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {details.map((item: Detail, idx: number) => {
                        return (
                          <tr
                            key={idx}
                            className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                          >
                            <th scope="row" className="px-6 py-3">
                              {item.name}
                            </th>
                            <th scope="row" className="px-6 py-3">
                              {item.value}
                            </th>

                            <td
                              onClick={() => handleDeleteRow(item)}
                              scope="row"
                              className="inline-flex items-center gap-3 px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                            >
                              <Trash />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <Button
                  type="submit"
                  className="bg-primary-700 mt-10"
                  disabled={loading}
                >
                  <span>Save</span>
                  <Send className="text-white font-normal  h-6 w-6 ms-4" />
                </Button>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
