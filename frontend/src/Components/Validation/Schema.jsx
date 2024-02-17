import * as yup from "yup";

export const basicSchema = yup.object().shape({
    email: yup.string().email("Please enter a valid email").required(""),
    fullname: yup.string().required(""),
    password: yup
    .string()
    .min(5)
    .required(""),
    dob: yup.string()
})