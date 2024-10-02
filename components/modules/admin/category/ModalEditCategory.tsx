"use client";
import { cn, fileTypeArray, MAX_FILE_SIZE } from "@/lib/utils";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Loader, Plus } from "lucide-react";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Category } from "@/types";

export default function ModalEditCategory({
  item,
  openModal,
  setOpenModal,
}: {
  item: Category;
  setOpenModal: (value: boolean) => void;
  openModal: boolean;
}) {
  const [file, setFile] = useState<string>(
    item.image
      ? item.image
      : "https://cdn-icons-png.flaticon.com/128/3688/3688596.png"
  );

  const [loading, setLoading] = useState(false);
  const validate = Yup.object({
    name: Yup.string()
      .required("required")
      .min(3, "6 letters at least")
      .max(60, "60 letters max"),
    link: Yup.string()
      .required("required")
      //.matches(/^[/].*$/, "start with this /")
      .min(3, "6 letters at least")
      .max(60, "60 letters max")
      .matches(/^(\S+$)/g, "* This field cannot contain blankspaces"),
    slug: Yup.string()
      .required("required")
      .min(3, "6 letters at least")
      .max(60, "60 letters max")
      .matches(/^(\S+$)/g, "* This field cannot contain blankspaces"),
  });

  const initialValues = {
    name: item.name,
    slug: item.slug,
    link: item.link,
    image: item.image,
  };

  const router = useRouter();

  const handleEdit = async (values: Category) => {
    if (loading) {
      return;
    }
    const data = {
      name: values.name,
      slug: values.slug,
      link: values.link,
      _id: item._id,
      image: file,
    };
    setLoading(true);
    await axios
      .put(process.env.NEXT_PUBLIC_SERVER_URL + "/api/admin/categories", data)
      .then((response) => {
        const data = response.data;
        toast(data.message);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
        setOpenModal(false);
        router.refresh();
      });
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const files = target.files as FileList;

    setLoading(true);
    if (!files[0]) {
      toast("file does not exist");
      setLoading(false);
      return;
    }
    const extension = files[0].type;
    const size = files[0].size;

    if (!fileTypeArray.includes(extension)) {
      toast("this ext " + extension + " not allowed!");
      setLoading(false);
      return;
    }

    if (size > MAX_FILE_SIZE) {
      toast("Max allowed size is " + MAX_FILE_SIZE + "kb");
      setLoading(false);
      return;
    }

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
        toast(data.imgUrl);
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
  const imageRef = useRef<HTMLInputElement>(null);

  return (
    <Dialog open={openModal}>
      <DialogTrigger asChild>
        {/* <Edit onClick={() => setOpenModal(!openModal)} /> */}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Update category</DialogTitle>
          <DialogDescription>
            Complete the forms. Click save when you &apos; re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validate}
            onSubmit={async (values) => {
              handleEdit(values);
            }}
          >
            {({
              errors,
              touched,

              /* and other goodies */
            }) => (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Forms
                </h2>

                <Form className="px-4 2xl:px-0">
                  <div className="flex flex-col gap-8">
                    <div>
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
                          errors?.name &&
                            touched?.name &&
                            "border border-red-900"
                        )}
                        placeholder="Bonnie"
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="py-2 font-bold text-red-900"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="link"
                        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                      >
                        link*
                      </label>
                      <Field
                        name="link"
                        type="text"
                        id="link"
                        className={cn(
                          "block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500",
                          errors?.link &&
                            touched?.link &&
                            "border border-red-900"
                        )}
                        placeholder="Bonnie"
                      />
                      <ErrorMessage
                        name="link"
                        component="div"
                        className="py-2 font-bold text-red-900"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="slug"
                        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                      >
                        {" "}
                        Slug*
                      </label>
                      <Field
                        name="slug"
                        type="text"
                        id="slug"
                        className={cn(
                          "block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500",
                          errors?.slug &&
                            touched?.slug &&
                            "border border-red-900"
                        )}
                        placeholder="Bonnie"
                      />
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
                        Image
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
                          errors?.image &&
                            touched?.image &&
                            "border border-red-900"
                        )}
                        placeholder="slug-example-here"
                      />
                      <div
                        onClick={() => imageRef?.current?.click()}
                        className="flex flex-wrap w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-gray-100 px-5 py-2.5 text-sm font-medium text-black hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                      >
                        {file ? "change the file" : "select a file"}
                        <span className="text-indigo-400 font-bold">
                          {file ? " File Downloaded" : ""}
                        </span>

                        <div
                          className="h-40 w-40 p-4 rounded-sm border border-dashed outline outline-1 outline-gray-100 outline-offset-4 border-gray-100"
                          style={{
                            backgroundImage: `url(${file ? file : file})`,
                            backgroundSize: "contain",
                            backgroundRepeat: "no-repeat",
                          }}
                        ></div>
                      </div>
                      <ErrorMessage
                        name="image"
                        component="div"
                        className="py-2 font-bold text-red-900"
                      />
                    </div>

                    <div className="sm:col-span-2 flex gap-4">
                      {loading ? (
                        <div className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bggray-100 px-5 py-2.5 text-sm font-medium text-white hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700">
                          <Loader className="animate-spin text-slate-400 h-6 w-6" />
                        </div>
                      ) : (
                        <button
                          type="submit"
                          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                        >
                          <Plus />
                          <span className="text-primary-600">Update</span>
                        </button>
                      )}

                      <div
                        onClick={() => setOpenModal(false)}
                        className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-neutral-100 px-5 py-2.5 text-sm font-medium text-black hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                      >
                        <Plus />
                        <span>Cancel</span>
                      </div>
                    </div>
                  </div>
                </Form>
              </div>
            )}
          </Formik>
        </div>
        <DialogFooter>
          <h1 className="flex gap-4 items-center">
            <span className="text-slate-700 font-bold">(*)</span>
            <span className="text-slate-400">Required</span>
          </h1>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
