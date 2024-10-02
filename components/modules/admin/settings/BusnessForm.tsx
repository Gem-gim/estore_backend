"use client";
import React, { useEffect, useRef, useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { cn } from "@/lib/utils";
import axios from "axios";
import toast from "react-hot-toast";
import CustomToast from "../../custom/CustomToast";
import { ICompanyInfo } from "@/types";
import { Button } from "@/components/ui/button";
import Loading from "../../custom/Loading";

export default function BusnessForm() {
  const validate = Yup.object({
    name: Yup.string()
      .required("required")
      .min(2, "2 letters at least")
      .max(60, "60 letters max"),
    description: Yup.string()
      .required("required")
      .min(2, "2 letters at least")
      .max(150, "150 letters max"),
    category: Yup.string()
      .required("required")
      .min(2, "2 letters at least")
      .max(60, "60 letters max"),
  });

  const [info, setInfo] = useState<ICompanyInfo>();
  const initialValues = {
    _id: info?._id,
    name: info?.name,
    category: info?.category,
    logo: info?.logo,
    description: info?.description,
  };

  const [loading, setLoading] = useState(false);
  const [logo, setLogo] = useState(
    "https://cdn-icons-png.flaticon.com/128/3688/3688596.png"
  );

  const imageRef = useRef<HTMLInputElement>(null);

  const handleSave = async (values: ICompanyInfo) => {
    if (loading) {
      return;
    }
    setLoading(true);
    const data = {
      id: values._id,
      name: values.name,
      category: values.category,
      logo: logo,
      description: values.description,
    };

    if (info) {
      await axios
        .put(process.env.NEXT_PUBLIC_SERVER_URL + "/api/admin/settings", data)
        .then((response) => {
          const data = response.data;
          toast(data.message);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      await axios
        .post(process.env.NEXT_PUBLIC_SERVER_URL + "/api/admin/settings", data)
        .then((response) => {
          const data = response.data;
          toast(data.message);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const files = target.files as FileList;

    if (!files[0]) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", files[0]);

    axios
      .post(process.env.NEXT_PUBLIC_SERVER_URL + "/api/cloudinary", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        const data = response.data;
        setLogo(data.imgUrl);
        toast.custom(<CustomToast message={data.message} status="success" />);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    setLoading(true);
    const getData = async () => {
      await axios
        .get(process.env.NEXT_PUBLIC_SERVER_URL + "/api/admin/settings")
        .then((response) => {
          const data = response.data;
          setInfo(data.data[0]);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    getData();
  }, []);

  return (
    <div className="flex flex-col bg-white w-full rounded-md">
      {loading && <Loading loading={loading} />}

      <div className="flex flex-col gap-2 px-8 py-4 border-b border-b-gray-200">
        <h1 className="font-bold text-xl">Profil</h1>
        <h2 className="text-base font-medium">
          Your profile is what people will see in search results, on invoices,
          in Chat and more.
        </h2>
      </div>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validate}
        onSubmit={async (values) => {
          handleSave(values);
        }}
      >
        {({
          errors,
          touched,
          /* and other goodies */
        }) => (
          <div className="px-8 py-4">
            <Form>
              <div className="grid grid-cols-2 grid-rows-1 gap-8">
                <div className="">
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {" "}
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
                    placeholder="Name of your busness"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="py-2 font-bold text-red-900"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <label
                      htmlFor=""
                      className="block text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Which category best fits your business?
                    </label>
                  </div>
                  <Field
                    as="select"
                    name="category"
                    id="category"
                    className={cn(
                      "py-10 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500",
                      errors?.category &&
                        touched?.category &&
                        "border border-red-900"
                    )}
                  >
                    <option value="">Select a category</option>
                    <option value="ecommerce">Ecommerce</option>
                    <option value="potfolio">Portfolio</option>
                    <option value="blog">blog</option>
                  </Field>
                  <ErrorMessage
                    name="category"
                    component="div"
                    className="py-2 font-bold text-red-900"
                  />
                </div>

                <div>
                  <label
                    htmlFor="image"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Logo
                  </label>
                  <input
                    ref={imageRef}
                    name="image"
                    type="file"
                    hidden
                    id="image"
                    disabled={loading}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleImage(e)
                    }
                    className={cn(
                      "w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500",
                      errors?.logo && touched?.logo && "border border-red-900"
                    )}
                    placeholder="slug-example-here"
                  />
                  <div className="flex gap-10 w-full ">
                    <div
                      className="h-40 w-40 p-4 rounded-sm border border-dashed outline outline-1 outline-gray-100 outline-offset-4 border-gray-100"
                      style={{
                        backgroundImage: `url(${info?.logo ? info?.logo : logo })`,
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                      }}
                    ></div>

                    <div className="flex w-40 h-40">
                      <Button
                        type="button"
                        disabled={loading}
                        variant="outline"
                        size="lg"
                        onClick={(e) => {
                          imageRef?.current?.click();
                          e.stopPropagation();
                        }}
                      >
                        Upload an image
                      </Button>
                    </div>
                  </div>
                  <ErrorMessage
                    name="slug"
                    component="div"
                    className="py-2 font-bold text-red-900"
                  />
                </div>

                <div>
                  <label
                    htmlFor="image"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Short description (150 characters)
                  </label>

                  <Field
                    component="textarea"
                    name="description"
                    type="text"
                    id="description"
                    className={cn(
                      "block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500",
                      errors?.name && touched?.name && "border border-red-900"
                    )}
                    placeholder="describe your business here"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="py-2 font-bold text-red-900"
                  />
                </div>

                <div className="sm:col-span-2 flex gap-4 ms-auto">
                  <Button
                    className=""
                    variant="default"
                    size="lg"
                    type="submit"
                    disabled={loading}
                  >
                    Save the changes
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        )}
      </Formik>
    </div>
  );
}
