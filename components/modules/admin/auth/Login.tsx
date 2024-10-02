"use client";
import React, { useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import Container from "../../custom/Container";
import { ClipLoader } from "react-spinners";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import CustomToast from "../../custom/CustomToast";
import Image from "next/image";

export type initialValuesProps = {
  email: string;
  password: string;
};

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const validate = Yup.object({
    email: Yup.string().email("format is not valid").required("required"),
    password: Yup.string().required("required a value"),
  });

  const initialValues = {
    email: "",
    password: "",
  };

  const handleSave = async (values: initialValuesProps) => {
    if (loading) {
      return;
    }

    setLoading(true);

    signIn("credentials", {
      ...values,
      redirect: false,
    })
      .then((callback) => {
        if (callback?.error) {
          toast.custom(
            <CustomToast
              message="A error occured please retry!"
              status="error"
            />
          );
          setLoading(false);
        }
        if (callback?.ok && !callback?.error) {
          toast.custom(
            <CustomToast message="Logged In Redirecting...!" status="success" />
          );

          router.push("/admin/dashboard");
        }
      })
      .catch((err) => {
        console.log("error", err);
      })
      .finally(() => {
        // setLoading(false);
      });
  };

  return (
    <section className="bg-white dark:bg-gray-900 h-screen py-10">
      {loading ? (
        <ClipLoader
          className="fixed inset-0 m-auto z-20"
          size={100}
          color="#3c38ca"
        />
      ) : (
        ""
      )}

      <Container>
        <div className="py-0 lg:py-16 px-4 mx-auto max-w-screen-md flex  w-full flex-col gap-8">
        <div className="w-full  text-center flex justify-center items-center">

          <Image
            src="https://cdn-icons-png.flaticon.com/128/11423/11423716.png"
            width={100}
            height={100}
            alt="logo"
            />
            </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl text-center" data-cy="loginPageTitle">
              Login to your account
            </h1>
            <p className="font-light text-center text-gray-500 dark:text-gray-400 sm:text-xl">
              Fill the forms and click on Login to submit..
            </p>
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
              <Form className="flex flex-col items-center gap-4">
                <div className="w-full">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Your email
                  </label>
                  <Field
                    data-cy="emailLogin"
                    data-testid="email"
                    name="email"
                    type="text"
                    id="email"
                    className={cn(
                      "shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light",
                      errors?.email && touched?.email && "border border-red-900"
                    )}
                    placeholder="yournemail@gmail.com"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="py-2 font-bold text-red-900 emailErrorMessage"
                  />
                </div>
                <div className="w-full">
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Password
                  </label>
                  <Field
                    data-cy="passwordLogin"
                    data-testid="password"
                    name="password"
                    type="password"
                    id="password"
                    className={cn(
                      "block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500dark:focus:border-primary-500 dark:shadow-sm-light",
                      errors?.password &&
                        touched?.password &&
                        "border border-red-900"
                    )}
                    placeholder="Set your password"
                  />{" "}
                  <ErrorMessage
                    name="password"
                    component="div"
                    data-cy="passwordErrorMessage"
                    className="py-2 font-bold text-red-900"
                  />
                </div>
                <button
                  id="submitLoginForm"
                  data-testid="submitLoginForm"
                  data-cy="submitLoginForm"
                  disabled={loading}
                  type="submit"
                  className="py-3 px-5 min-w-40 text-sm font-medium text-center text-white rounded-lg bg-primary-700 sm:w-fit hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Login
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </Container>
    </section>
  );
}
