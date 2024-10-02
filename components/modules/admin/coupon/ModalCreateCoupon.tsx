"use client";
import { cn } from "@/lib/utils";
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { ChevronLeft, Loader, Plus, PlusCircle } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";

import { Button } from "@/components/ui/button";
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
import { Coupon } from "@/types";

export default function ModalCreateCoupon({
  openModal,
  setOpenModal,
}: {
  setOpenModal: (value: boolean) => void;
  openModal: boolean;
}) {
  const [loading, setLoading] = useState(false);

  const validate = Yup.object({
    coupon: Yup.string()
      .required("required")
      .min(6, "6 letters at least")
      .max(20, "20 letters max"),

    discount: Yup.number()
      .integer("only numeric value")
      .positive("only positive value")
      .required("required")
      .min(1, "1 least")
      .max(100, "100 max rate"),

    startDate: Yup.date().default(() => new Date()),

    endDate: Yup.date().when(
      "startDate",
      (startDate, schema) =>
        startDate &&
        schema.min(
          startDate,
          "the end date should be equal to or greater than the start date"
        )
    ),
  });

  const initialValues = {
    coupon: "",
    discount: 0,
    startDate: new Date(),
    endDate: new Date(),
  };

  const router = useRouter();

  const handleSave = (values: Coupon) => {
    if (loading) {
      return;
    }

    const data = {
      coupon: values.coupon,
      discount: values.discount,
      startDate: values.startDate,
      endDate: values.endDate,
    };

    setLoading(true);
    const myPromise = axios
      .post(process.env.NEXT_PUBLIC_SERVER_URL + "/api/admin/coupons", data)
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
        setOpenModal(false);
      });
    toast.promise(myPromise, {
      loading: "Please wait...",
      success: "Done.",
      error: "Error when fetching",
    });
  };

  // const [value, setValue] = useState<string>("");

  // function handleSlugChange(e: any) {
  //   const slug = productSlug(e.target.value);
  //   setValue(slug);
  // }

  return (
    <Dialog open={openModal}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setOpenModal(!openModal)}
          variant="outline"
          className="inline-flex gap-4 items-center ms-10 text-xl text-white bg-indigo-400"
        >
          Add <PlusCircle />{" "}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add new coupon </DialogTitle>
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
              handleSave(values);
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
                        htmlFor="coupon"
                        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                      >
                        {" "}
                        Coupon*
                      </label>
                      <Field
                        name="coupon"
                        type="text"
                        id="coupon"
                        className={cn(
                          "block uppercase w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500",
                          errors?.coupon &&
                            touched?.coupon &&
                            "border border-red-900"
                        )}
                        placeholder="M5TG67"
                      />
                      <ErrorMessage
                        name="coupon"
                        component="div"
                        className="py-2 font-bold text-red-900"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="discount"
                        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Discount*
                      </label>
                      <Field
                        name="discount"
                        type="number"
                        id="discount"
                        className={cn(
                          "block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500",
                          errors?.discount &&
                            touched?.discount &&
                            "border border-red-900"
                        )}
                        placeholder="10"
                      />
                      <ErrorMessage
                        name="discount"
                        component="div"
                        className="py-2 font-bold text-red-900"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="startDate"
                        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Start Date*
                      </label>
                      <Field
                        required
                        name="startDate"
                        type="date"
                        id="startDate"
                        className={cn(
                          "block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500",
                          errors?.startDate &&
                            touched?.startDate &&
                            "border border-red-900"
                        )}
                        placeholder=""
                      />
                      <ErrorMessage
                        name="startDate"
                        component="div"
                        className="py-2 font-bold text-red-900"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="endDate"
                        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                      >
                        End Date*
                      </label>
                      <Field
                        required
                        name="endDate"
                        type="date"
                        id="endDate"
                        className={cn(
                          "block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500",
                          errors?.endDate &&
                            touched?.endDate &&
                            "border border-red-900"
                        )}
                        placeholder="slug-example-here"
                      />
                      <ErrorMessage
                        name="endDate"
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
                          <span className="text-primary-600">Save</span>
                        </button>
                      )}

                      <div
                        onClick={() => setOpenModal(false)}
                        className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-neutral-100 px-5 py-2.5 text-sm font-medium text-black hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                      >
                        <ChevronLeft />
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
