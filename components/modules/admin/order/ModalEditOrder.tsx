"use client";
import { cn } from "@/lib/utils";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Edit, Loader, Plus } from "lucide-react";
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

export type initialValuesProps = {
  // id: string;
  name: string;
  slug: string;
  image: string;
};
export default function ModalEditUser({
  item,
  openModal,
  setOpenModal,
}: {
  item: initialValuesProps;
  setOpenModal: (value: boolean) => void;
  openModal: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(item.image);

  const validate = Yup.object({
    name: Yup.string()
      .required("required")
      .min(3, "6 letters at least")
      .max(60, "60 letters max"),
    slug: Yup.string()
      .required("required")
      .min(3, "6 letters at least")
      .max(60, "60 letters max"),
  });

  const initialValues = {
    // id: item._id,
    name: item.name,
    slug: item.slug,
    image: file ? file : item.image,
  };

  const router = useRouter();

  const handleEdit = (values: initialValuesProps) => {
    if (loading) {
      return;
    }
    const data = {
      image: file,
      name: values.name,
      slug: values.slug,
      // id: values._id,
    };
    setLoading(true);
    const myPromise = axios
      .put(process.env.NEXT_PUBLIC_SERVER_URL + "/api/admin/users", data)
      .then((response) => {
        const data = response.data;
        toast(data.message);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
        setOpenModal(false);
        router.refresh();
      });

    toast.promise(myPromise, {
      loading: "Please wait...",
      success: "Done.",
      error: "Error when fetching",
    });
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const files = target.files as FileList;

    if (files[0]) return;
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

  const imageRef = useRef<HTMLInputElement>(null);

  return (
    <Dialog open={openModal}>
      <DialogTrigger asChild>
        <Edit onClick={() => setOpenModal(!openModal)} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Update user</DialogTitle>
          <DialogDescription>
            Complete the forms. Click save when you &pos; re done.
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
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-gray-100 px-5 py-2.5 text-sm font-medium text-black hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                      >
                        {initialValues.image
                          ? "change the file"
                          : "select a file"}
                        <span className="text-indigo-400 font-bold">
                          {initialValues.image ? "File downloaded" : ""}
                        </span>
                      </div>
                      <ErrorMessage
                        name="slug"
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
                          <span>Update</span>
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
