import * as yup from "yup";

export const SignupSchema = yup.object().shape({
  name: yup
    .string()
    .min(5, "name must be at least 5 characters")
    .required("Required"),
  phoneNumber: yup
    .string()
    .required("Required")
    .matches(/^[567]\d{8}$/, "Please enter a valid phone number"),
  password: yup
    .string()
    .required("Required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: yup
    .string()
    .required("Please retype your password.")
    .oneOf([yup.ref("password")], "Your passwords do not match."),
});

export const LoginSchema = yup.object().shape({
  phoneNumber: yup
    .string()
    .required("Required")
    .matches(/^[567]\d{8}$/, "Please enter a valid phone number"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Required"),
});
