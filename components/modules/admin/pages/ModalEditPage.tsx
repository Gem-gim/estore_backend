"use client";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { ChevronRight, Loader } from "lucide-react";
import React, { useState } from "react";
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
import { Page } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ModalEditPage({
  item,
  openModal,
  setOpenModal,
}: {
  item: Page;
  setOpenModal: (value: boolean) => void;
  openModal: boolean;
}) {
  const [loading, setLoading] = useState(false);

  const validate = Yup.object({
    name: Yup.string()
      .required()
      .min(2, "2 letters at least")
      .max(60, "60 letters max"),
    slug: Yup.string().min(3, "3 letters at least").max(60, "60 letters max"),
    link: Yup.string()
      .required()
      .min(3, "3 letters at least")
      .max(60, "60 letters max"),
  });

  const initialValues = {
    _id: item._id,
    name: item.name,
    slug: item.slug,
    link: item.link,
    subpage: item.subpage,
  };

  const router = useRouter();

  const handleEdit = (values: Page) => {
    if (loading) {
      return;
    }
    const data = {
      _id: item._id,
      name: values.name,
      slug: values.slug,
      link: values.link,
      subpage: values.subpage,
    };

    setLoading(true);
    const myPromise = axios
      .put(process.env.NEXT_PUBLIC_SERVER_URL + "/api/admin/pages", data)
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

  return (
    <Dialog open={openModal}>
      <DialogTrigger asChild>
        {/* <Edit onClick={() => setOpenModal(!openModal)} />  */}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Update slide</DialogTitle>
          <DialogDescription>
            Complete the forms. Click update when you &apos; re done.
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
            {({ errors, touched }) => (
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Forms
                </h2>

                <Form className="px-4 2xl:px-0" encType="multipart/form-data">
                  <div className="flex flex-col gap-2">
                    <div>
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
                        Slug
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
                        placeholder="slug-example-here"
                      />
                      <ErrorMessage
                        name="slug"
                        component="div"
                        className="py-2 font-bold text-red-900"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="link"
                        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Link
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
                        placeholder="subtitle-example-here"
                      />
                      <ErrorMessage
                        name="link"
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
                        <Button
                          variant="primary"
                          type="submit"
                          className="w-full"
                        >
                          <span>Update</span>
                        </Button>
                      )}

                      <Button
                        onClick={() => setOpenModal(false)}
                        variant="default"
                        type="submit"
                        className="w-full"
                      >
                        <span>Cancel</span>
                        <ChevronRight />
                      </Button>
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
