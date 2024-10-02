"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Check, File, Send, Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { Fragment, useRef, useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";
import ProductImages from "./ProductImages";
import ProductVariationModal from "./ProductVariationModal";
import ProductStyleModal from "./ProductStyleModal";
import { Options, Product, SubProduct } from "@/types";

export type InputsProps = { id: string };

export default function ProductVariation({
  product,
  loading,
  setLoading,
}: {
  product: Product;
  loading: boolean;
  setLoading: (value: boolean) => void;
}) {



  const [openModal, setOpenModal] = useState(false);
  const [file, setFile] = useState("");
  const [color, setColor] = useState<string>("");
  const [options, setOptions] = useState<Options[]>([]);
  const colorOpen = false;

  const router = useRouter();
  const [inputs, setInputs] = useState<InputsProps[]>([]);

  const handleSaveSize = (values: Options) => {
    setLoading(true);
    if (
      values.option === undefined ||
      values.option === "" ||
      values.qty === 0 ||
      values.price === undefined
    ) {
      toast("data is empty");
      return;
    }

    const findName = options.find(
      (item: Options) =>
        item?.option?.toLowerCase() === values?.option?.toLowerCase()
    );
    if (findName) {
      const newArray = options.filter(
        (item2: Options) =>
          item2.option?.toLowerCase() !== values?.option?.toLowerCase()
      );

      newArray.push({
        option: values?.option?.toLowerCase(),
        qty: values.qty,
        price: values.price,
        sold: 0,
        images: [],
        discount: 0,
      });

      setOptions(newArray);

      toast("updated");
      setLoading(false);

      return;
    }

    setOptions([
      ...options,
      {
        option: values.option?.toLowerCase(),
        qty: values.qty,
        price: values.price,
        sold: 0,
        images: [],
        discount: 0,
      },
    ]);

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
    setLoading(true);

    const formData = new FormData();
    formData.append("file", files[0]);

    const myPromise = axios
      .post(process.env.NEXT_PUBLIC_SERVER_URL + "/api/cloudinary", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        const data = response.data;
        setFile(data.imgUrl);
        toast(data.message);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
    toast.promise(myPromise, {
      loading: "Uploading...",
      success: "Done.",
      error: "Error when fetching",
    });
  };

  const handleRemoveInput = (e: InputsProps) => {
    setInputs(inputs.filter((i: InputsProps) => i.id !== e.id));
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

  const initialValuesVariation = {
    id: product._id,
    step: "variation",
    style: {
      color: "",
      image: "",
      name: "",
    },
    sku: "",
    option: "",
    price: 0,
    qty: 0,
    sold: 0,
    images: [],
    discount: 0,
    options: [
      {
        option: "",
        price: 0,
        qty: 0,
        sold: 0,
        images: [],
        discount: 0,
      },
    ],
  };

  const updateProductVariation = (values: SubProduct) => {
    values.style = {
      color: color,
      image: file,
      name: "",
    };
    // values.images = uploadImages;

    values.options = options;

    if (!color || !file || !uploadImages) {
      toast.error("please fill data");
      return;
    }

    setLoading(true);
    const myPromise = axios
      .put(process.env.NEXT_PUBLIC_SERVER_URL + "/api/admin/products", values)
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
    toast.promise(myPromise, {
      loading: "Please wait...",
      success: "Done.",
      error: "Error when fetching",
    });
  };

  return (
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
          <div className="bg-white p-4 ">
            <h2 className="font-bold">
              Product Variation ( {product.subProducts.length} )
            </h2>

            <ProductStyleModal
              product={product}
              loading={loading}
              setLoading={setLoading}
            />

            <div className="flex flex-col gap-8 group mt-10">
              {colorOpen && (
                <>
                  <div className={cn("")}>
                    <h2>Color/Style: </h2>
                    <div className="flex gap-10 p-2">
                      <label htmlFor="image">Image:</label>
                      <File onClick={() => imageRef?.current?.click()} />
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
                      <label htmlFor="color">Code:</label>
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
                  </div>

                  {/* <div className="full">
                    <label htmlFor="discount">Discount*</label>
                    <Field
                      type="number"
                      name="discount"
                      placeholder="discount"
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
                  </div> */}

                  <div className="full">
                    <label htmlFor="color">Sku:</label>
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

                  <ProductImages
                    loading={loading}
                    setLoading={setLoading}
                    uploadImages={uploadImages}
                    setUploadImages={setUploadImages}
                  />

                  <div className="flex flex-col gap-4 mt-10">
                    <h3 className="font-bold text-base">Sizes:</h3>

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

                      <Button
                        className="mt-6 bg-primary-800 "
                        type="submit"
                        onClick={() => handleSaveSize(values)}
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

                    {inputs.map((item: InputsProps, idx: number) => (
                      <Fragment key={idx}>
                        <hr className="my-4" />
                        <div className="full">
                          <label htmlFor="option">Options*</label>
                          <Field
                            type="text"
                            name={`option${idx}`}
                            placeholder=""
                            className={cn(
                              "sizePrice block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500",
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

                        <div className="full">
                          <label htmlFor="qty">qty*</label>
                          <Field
                            type="number"
                            name={`qty${idx}`}
                            placeholder="12"
                            className={cn(
                              "qtySize block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500",
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

                        <div className="full">
                          <label htmlFor="price">price*</label>
                          <Field
                            type="number"
                            name={`price${idx}`}
                            placeholder="64gb"
                            className={cn(
                              "priceSize block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500",
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

                        <Button onClick={() => handleRemoveInput(item)}>
                          Delete option
                        </Button>
                      </Fragment>
                    ))}
                  </div>

                  <Button type="submit" className="bg-primary">
                    <span>Save</span>
                    <Send className="text-white font-normal  h-6 w-6 ms-4" />
                  </Button>
                </>
              )}
            </div>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg my-10">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Styles
                    </th>

                    <th scope="col" className="px-6 py-3">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {product.subProducts.map((item: SubProduct, idx: number) => {
                    const style = Object.values(item.style);

                    return (
                      <tr
                        key={idx}
                        className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                      >
                        <th
                          scope="row"
                          className="inline-flex items-center gap-3 px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          <div
                            style={{
                              background: `${style[0]}`,
                            }}
                            className="rounded-full w-10 h-10"
                          />

                          <div
                            style={{
                              backgroundImage: `url(${style[1]})`,
                              height: "100px",
                              width: "100px",
                              background: "cover",
                            }}
                            className="flex"
                          ></div>
                        </th>

                        <td className="px-6 py-4">
                          <ProductVariationModal
                            product={item}
                            openModal={openModal}
                            setOpenModal={setOpenModal}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
