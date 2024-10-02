"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Check, File, Plus, Send, Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";
import ProductImages from "./ProductImages";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Product, Options, SubProduct } from "@/types";
import { ClipLoader } from "react-spinners";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Zoom from "react-medium-image-zoom";

export type initialValuesProps = {
  id?: string;
  step: string;
  style: {
    color: string;
    image: string;
    name: string;
  };
  option: string;
  sku: string;
  discount: number;
  images: string[];
  sold: number;
  qty: number;
  price: number;
  options: [
    {
      option: "";
      price: 0;
      qty: 0;
      sold: 0;
      images: [];
      discount: 0;
    }
  ];
};

export default function ProductStyleModal({
  product,
  loading,
  setLoading,
}: {
  product: Product;
  loading: boolean;
  setLoading: (value: boolean) => void;
}) {
  const initialValuesVariation = {
    id: product._id,
    step: "variation",
    style: {
      color: "",
      image: "",
      name: "",
    },
    sku: "",
    discount: 0,
    images: [],
    sold: 0,
    option: "",
    qty: 0,
    price: 0,
    options: [
      {
        option: "",
        price: 0,
        qty: 0,
        discount: 0,
        images: [],
        sold: 0,
      },
    ],
  };
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [file, setFile] = useState("");
  const [color, setColor] = useState("");
  const [styleName, setStyleName] = useState("");
  const [options, setOptions] = useState<Options[]>([]);

  const handleSaveSize = (
    e: React.MouseEvent<HTMLButtonElement>,
    values: Options
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    if (
      values.option == undefined ||
      values.option === "" ||
      values.qty === 0 ||
      values.price === 0 ||
      values.discount === undefined ||
      uploadImages.length < 2
    ) {
      toast("data is empty");
      setLoading(false);
      return;
    }

    const findName = options.find(
      (item: Options) =>
        item?.option?.toLowerCase() === values.option.toLowerCase()
    );
    if (findName) {
      const newArray = options.filter(
        (item2: Options) =>
          item2?.option?.toLowerCase() !== values.option.toLowerCase()
      );

      newArray.push({
        option: values?.option?.toLowerCase(),
        qty: values.qty,
        price: values.price,
        sold: 0,
        discount: values.discount,
        images: uploadImages,
      });

      setOptions(newArray);

      toast("updated");
      console.log(options);
      return;
    }

    setOptions([
      ...options,
      {
        option: values.option?.toLowerCase(),
        qty: values.qty,
        price: values.price,
        sold: 0,
        images: uploadImages,
        discount: values.discount,
      },
    ]);

    console.log(options);
    setLoading(false);
    toast("saved");
  };

  const handleDeleteRow = (item: Options) => {
    const newArray = options.filter(
      (row: Options) => row.option !== item.option
    );
    setOptions(newArray);
    toast("deleted");
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const files = target.files as FileList;

    if (!files[0]) return;
    console.log("log______________", files[0]);
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
        setFile(data.imgUrl);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const [uploadImages, setUploadImages] = useState<Array<string>>([]);

  const imageRef = useRef<HTMLInputElement>(null);

  const validateVariation = Yup.object({
    sku: Yup.string()
      .required("required")
      .min(4, "at least 4")
      .max(60, "60 max characters"),
    discount: Yup.number()
      .required("required")
      .min(0, "at least 0")
      .max(100, "100 max"),

    option: Yup.string()
      .required("required")
      .min(0, "at least 0")
      .max(100, "100 max"),
    qty: Yup.number()
      .required("required")
      .min(0, "at least 0")
      .max(100, "100 max"),
    price: Yup.number()
      .required("required")
      .min(0, "at least 0")
      .max(10000, "100 max"),
  });

  const updateProductVariation = (values: SubProduct) => {
    values.style = {
      color: color,
      image: file,
      name: styleName,
    };
    // values.images = uploadImages;

    values.options = options;

    if (!color || !file || !uploadImages || !styleName || !values.options) {
      toast.error("please fill data");
      return;
    }

    console.log(values);
    // return;

    setLoading(true);
    const myPromise = axios
      .put(process.env.NEXT_PUBLIC_SERVER_URL + "/api/admin/products", values)
      .then((response) => {
        const data = response.data;
        toast(data.message);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
        router.refresh();
      });
    toast.promise(myPromise, {
      loading: "Please wait...",
      success: "Done.",
      error: "Error when fetching",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          disabled={loading}
          onClick={() => setOpenModal(!openModal)}
          variant="outline"
          className="inline-flex gap-4 items-center text-xl text-black bg-neutral-200 border-0 mt-4 "
        >
          <span className="text-sm font-medium">Add new</span>
          <Plus className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-screen-xl overflow-auto h-screen">
        <Formik
          enableReinitialize
          initialValues={initialValuesVariation}
          validationSchema={validateVariation}
          onSubmit={async (values) => {
            updateProductVariation(values);
          }}
        >
          {({ values, errors, touched }) => (
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
              <div>
                <div className="flex flex-col gap-8 group mt-4">
                  <div className={cn("")}>
                    <h2 className="font-bold ">Style: </h2>
                    <div className="flex gap-10 p-2">
                      <label htmlFor="image">Image:</label>

                      <div
                        role="button"
                        onClick={() => imageRef?.current?.click()}
                        className="cursor-pointer inline-flex gap-4 items-center"
                      >
                        <span>click to select</span>
                        <File />
                      </div>
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
                          "w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                          // errors?.image &&
                          //   touched?.image &&
                          //   "border border-red-900"
                        )}
                        placeholder="slug-example-here"
                      />

                      {file && (
                        <Image
                          src={file}
                          alt="image"
                          width="20"
                          height="20"
                          className="rounded-full"
                        />
                      )}
                    </div>

                    <div className="flex gap-10 p-2 items-center">
                      <label htmlFor="color">Code color:</label>
                      <Field
                        className=""
                        type="color"
                        name="color"
                        value={color}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setColor(e.target.value)
                        }
                      />
                      {color && (
                        <div
                          style={{
                            background: `${color}`,
                          }}
                          className="rounded-full w-10 h-10"
                        />
                      )}
                    </div>
                    <ErrorMessage
                      name="color"
                      component="div"
                      className="font-bold text-red-900"
                    />

                    <div className="flex gap-10 p-2 items-center">
                      <label htmlFor="color">Name:</label>
                      <Field
                        className="border border-gray-300"
                        type="text"
                        name="name"
                        onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setStyleName(e.target.value)
                        }
                      />
                    </div>
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="font-bold text-red-900"
                    />
                  </div>

                  <div className="full">
                    <label htmlFor="sku" className="font-bold">
                      Sku:
                    </label>
                    <Field
                      type="text"
                      name="sku"
                      placeholder="sku(*)"
                      className={cn(
                        "block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500",
                        errors?.sku && touched?.sku && "border border-red-900"
                      )}
                    />
                    <ErrorMessage
                      name="sku"
                      component="div"
                      className="py-2 font-bold text-red-900"
                    />
                  </div>

                  <div className="full">
                    <Field
                      type="hidden"
                      name="sold"
                      placeholder="sku"
                      value="0"
                    />
                  </div>

                  <div className="flex flex-col gap-4 mt-10">
                    <h3 className="font-bold text-base">Options:</h3>

                    <div className="flex gap-4 w-full justify-between items-flex-start">
                      <div className="w-full">
                        <label htmlFor="option">Options*</label>
                        <Field
                          type="text"
                          name="option"
                          placeholder=""
                          className={cn(
                            "lowercase block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500",
                            errors?.option &&
                              touched?.option &&
                              "border border-red-900"
                          )}
                        />
                        <ErrorMessage
                          name="option"
                          component="div"
                          className="py-2 font-bold text-red-900"
                        />
                      </div>

                      <div className="w-full">
                        <label htmlFor="qty">Qty*</label>
                        <Field
                          type="number"
                          name="qty"
                          placeholder="12"
                          className={cn(
                            "block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500",
                            errors?.qty &&
                              touched?.qty &&
                              "border border-red-900"
                          )}
                        />
                        <ErrorMessage
                          name="qty"
                          component="div"
                          className="py-2 font-bold text-red-900"
                        />
                      </div>

                      <div className="w-full">
                        <label htmlFor="price">Price*</label>
                        <Field
                          type="number"
                          name="price"
                          placeholder="64gb"
                          className={cn(
                            "block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500",
                            errors?.price &&
                              touched?.price &&
                              "border border-red-900"
                          )}
                        />
                        <ErrorMessage
                          name="price"
                          component="div"
                          className="py-2 font-bold text-red-900"
                        />
                      </div>

                      <div className="w-full">
                        <label htmlFor="price">Discount*</label>
                        <Field
                          type="number"
                          name="discount"
                          placeholder="64gb"
                          className={cn(
                            "block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500",
                            errors?.discount &&
                              touched?.discount &&
                              "border border-red-900"
                          )}
                        />
                        <ErrorMessage
                          name="discount"
                          component="div"
                          className="py-2 font-bold text-red-900"
                        />
                      </div>

                      <Button
                        disabled={loading}
                        className="mt-6 bg-primary-700  text-white"
                        type="submit"
                        onClick={(e) => handleSaveSize(e, values)}
                      >
                        <Check className="text-white" />
                      </Button>
                    </div>

                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg my-10">
                      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                          <tr>
                            <th scope="col" className="px-6 py-3">
                              Options
                            </th>
                            <th scope="col" className="px-6 py-3">
                              Qty{" "}
                            </th>{" "}
                            <th scope="col" className="px-6 py-3">
                              Price{" "}
                            </th>
                            <th scope="col" className="px-6 py-3">
                              Discount
                            </th>
                            <th scope="col" className="px-6 py-3">
                              Images
                            </th>
                            <th scope="col" className="px-6 py-3">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {options.map((item: Options, idx: number) => {
                            return (
                              <tr
                                key={idx}
                                className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                              >
                                <th scope="row" className="px-6 py-3">
                                  {item.option}
                                </th>
                                <th scope="row" className="px-6 py-3">
                                  {item.qty}
                                </th>

                                <th scope="row" className="px-6 py-3">
                                  {item.price}
                                </th>

                                <th scope="row" className="px-6 py-3">
                                  {item.discount}
                                </th>
                                <th scope="row" className="px-6 py-3">
                                  <div className="flex gap-4 items-center">
                                    {item.images.map(
                                      (img: string, idx: number) => {
                                        return (
                                          <Avatar key={idx} className="">
                                            <Zoom>
                                              <AvatarImage
                                                src={img}
                                                alt="image"
                                              />
                                            </Zoom>
                                            <AvatarFallback>...</AvatarFallback>
                                          </Avatar>
                                        );
                                      }
                                    )}
                                  </div>
                                </th>
                                <td
                                  onClick={() => handleDeleteRow(item)}
                                  scope="row"
                                  className="cursor-pointer group inline-flex items-center gap-3 px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                >
                                  <Trash className="group-hover:text-red-500" />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <ProductImages
                    loading={loading}
                    setLoading={setLoading}
                    uploadImages={uploadImages}
                    setUploadImages={setUploadImages}
                  />

                  <Button
                    type="submit"
                    className="bg-primary-700"
                    disabled={loading}
                  >
                    <span>Save</span>
                    <Send className="text-white font-normal  h-6 w-6 ms-4" />
                  </Button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
