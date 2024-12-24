"use client";
import { FaGoogle } from "react-icons/fa";
import { useFormik } from "formik";
import { SignupSchema } from "@Schemas/UerSchema";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MoonLoader } from "react-spinners";
import { signIn } from "next-auth/react";

function Signup() {
  const { replace } = useRouter();

  const {
    errors,
    getFieldProps,
    touched,
    handleSubmit,
    setErrors,
    isSubmitting,
    setSubmitting,
    isValid,
  } = useFormik({
    initialValues: {
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      name: "",
    },
    validationSchema: SignupSchema,
    onSubmit: async (values) => {
      setSubmitting(true);
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitting(false);
        setErrors({ phoneNumber: data.err });
        return;
      }
      setSubmitting(false);
      return replace("/login");
    },
  });

  return (
    <main className="max-w-[30rem] mx-auto bg-white p-4 md:p-10 rounded-lg">
      <form onSubmit={handleSubmit}>
        <h2 className="text-xl text-center font-bold">Create an Account</h2>
        <h3 className="text-gray-400 text-center font-semibold ">
          Please enter your details
        </h3>
        <h4 className="pl-1 text-sm mt-4 text-gray-700">Say your name</h4>
        <input
          className={`p-3 border duration-200  bg-gray-100 rounded-md text-black w-full focus:outline-none text-sm ${
            touched.name && errors.name ? "border-red-400" : "border-[#979aa8]"
          }`}
          id="name"
          {...getFieldProps("name")}
        />
        <p
          className={`text-xs text-red-400 ${
            touched.name && errors.name ? "visible" : "invisible"
          }`}
        >
          {errors.name} !
        </p>
        <h4 className="pl-1 text-sm text-gray-700">Phone Number</h4>
        <div
          className={`p-3 border duration-200 bg-gray-100 rounded-md text-black w-full text-sm flex items-center ${
            touched.phoneNumber && errors.phoneNumber
              ? "border-red-400"
              : "border-[#979aa8]"
          }`}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/7/77/Flag_of_Algeria.svg"
            alt="Algeria Flag"
            className="w-6 h-4 mr-2"
          />
          <p>0</p>
          <input
            id="phoneNumber"
            {...getFieldProps("phoneNumber")}
            type="number"
            className="focus:outline-none bg-gray-100 flex-1"
          />
        </div>

        <p
          className={`text-xs text-red-400 ${
            touched.phoneNumber && errors.phoneNumber ? "visible" : "invisible"
          }`}
        >
          {errors.phoneNumber} !
        </p>
        <h4 className="pl-1 text-sm text-gray-700">Password</h4>
        <input
          className={`p-3 border duration-200  bg-gray-100 rounded-md text-black w-full focus:outline-none text-sm ${
            touched.password && errors.password
              ? "border-red-400"
              : "border-[#979aa8]"
          }`}
          type="password"
          id="password"
          {...getFieldProps("password")}
        />
        <p
          className={`text-xs text-red-400  ${
            touched.password && errors.password ? "visible" : "invisible"
          }`}
        >
          Required
          {errors.password} !
        </p>

        <h4 className="pl-1 text-sm text-gray-700">Re-type Password</h4>

        <input
          className={`p-3 border duration-200  bg-gray-100 rounded-md text-black w-full focus:outline-none text-sm ${
            touched.confirmPassword && errors.confirmPassword
              ? "border-red-400"
              : "border-[#979aa8]"
          }`}
          type="password"
          id="confirmPassword"
          {...getFieldProps("confirmPassword")}
        />
        <p
          className={`text-xs text-red-400  ${
            touched.confirmPassword && errors.confirmPassword
              ? "visible"
              : "invisible"
          }`}
        >
          Required
          {errors.confirmPassword} !
        </p>

        <button
          type="submit"
          disabled={
            isSubmitting || !(Object.keys(touched).length === 4 && isValid)
          }
          className={`p-3 flex items-center justify-center hover:bg-[#324585] duration-150  gap-2 rounded-md w-full mt-2 text-white ${
            isSubmitting || !(Object.keys(touched).length === 4 && isValid)
              ? "bg-gray-400"
              : "bg-[#1c274c]"
          }`}
        >
          {isSubmitting ? <MoonLoader size={15} color="#fff" /> : "Sign up"}
        </button>
      </form>

      <div className="relative flex justify-center">
        <p className="bg-primary-1 px-1 absolute top-1/2 -translate-y-1/2 pb-1">
          or
        </p>
        <div className="w-full bg-gray-400 h-0.5 my-4" />
      </div>
      <button
        className="p-3 rounded-md w-full bg-gray-300 text-gray-700 border border-gray-200 flex items-center justify-center gap-2 text-sm cursor-not-allowed"
        onClick={() => signIn("google", { callbackUrl: "/" })}
        disabled={true}
      >
        <FaGoogle />
        Sign up with google
      </button>
      <div className="text-sm text-gray-700">
        already have an account?!{" "}
        <Link href="/login" className="font-semibold underline">
          Log in
        </Link>
      </div>
    </main>
  );
}

export default Signup;
