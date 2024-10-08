import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormControlLabel, FormGroup } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { customerSignUp } from "../../../store/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { Toastify } from "../../../services/toastify/toastContainer";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import "./signUp.css";
import PhoneInput from "react-phone-input-2";

import "react-phone-input-2/lib/bootstrap.css";

const schema = yup.object().shape({
  firstName: yup
    .string()
    .required("First Name is required")
    .trim()
    .min(1, "First Name have atleast 1 characters"),
  lastName: yup
    .string()
    .required("Last Name is required")
    .trim()
    .min(2, "Last Name have atleast 2 characters"),
  email: yup
    .string()
    .email("Please enter valid email address")
    .required("Email is required")
    .trim(),
  password: yup
    .string()
    .required("Password is required")
    // .matches(
    //   /^(?=.*[A-Z])/,
    //   "Password must contain at least one uppercase letter"
    // )
    // .matches(/^(?=.*[0-9])/, "Password must contain at least one number")
    .min(6, "Password have atleast 6 characters long")
    .max(15, "Password  have atmost 8 characters long")
    .required("Password is required")
    .trim(),
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password")], "Passwords do not match")
    .trim(),
  zipCode: yup.string().required("Zip Code is required").trim(),
  number: yup
    .string()
    .matches(/^[0-9]+$/, "Phone number is required")
    .required("Number is required")
    .trim(),
  // agreeToTerms: yup.string().required("Please agree to the terms"),

  // other fields...
  agreeToTerms: yup
    .bool()
    .oneOf([true], "Please accept the terms and conditions"),
});

const defaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  number: "",
  agreeToTerms: false,
  zipCode: "",
};

const SignupCostumer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [key, setKey] = React.useState(0);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [checkbox, setcheckBox] = React.useState(false);
  const [phone, setPhone] = React.useState("");
  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };
  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword((show) => !show);
  };
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    dispatch(customerSignUp(data))
      .unwrap()
      .then((data) => {
        // if (data === undefined) {
        if (data === undefined) {
        } else {
          localStorage.setItem("token", data.data.token);
          localStorage.setItem("userType", "customer");
          Toastify({ data: "success", msg: `Welcome ${data.data.first_name}` });
          navigate("/homeOwner/dashboard");
        }
      });
    reset();
    setKey((prevKey) => prevKey + 1);
    setcheckBox(false);
    // Add your form submission logic here
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div className="py-5 sign-up-bg bg-light-red">
      <div className="container">
        <div className="shadow-lg p-4 p-xl-5 rounded-4 bg-white">
          <h6 className="text-center underline-red">
            <span>DAZL IS FOR</span>
          </h6>
          <h2 className="text-uppercase mb-4">Homeowners</h2>
          <div className="">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row">
                <div className={`form-row mb-3 col-md-6`}>
                  <Controller
                    name="firstName"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        className={`form-control ${
                          errors.firstName ? "error" : ""
                        }`}
                        placeholder="First Name*"
                      />
                    )}
                  />
                  {errors.firstName && (
                    <p className="text-danger mt-2">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className={`form-row mb-3 col-md-6 `}>
                  <Controller
                    name="lastName"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        className={`form-control ${
                          errors.lastName ? "error" : ""
                        }`}
                        placeholder="Last Name*"
                      />
                    )}
                  />
                  {errors.lastName && (
                    <p className="text-danger mt-2">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
                <div className={`form-row mb-3 col-md-12`}>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        className={` width-input form-control ${
                          errors.email ? "error" : ""
                        }`}
                        placeholder="Email address*"
                      />
                    )}
                  />
                  {errors.email && (
                    <p className="text-danger mt-2">{errors.email.message}</p>
                  )}
                </div>
                <div className={`form-row mb-3 col-md-6`}>
                  <PhoneInput
                    country={"us"}
                    enableSearch={true}
                    value={phone}
                    onChange={(phone) => {
                      setPhone(phone);
                      setValue("number", phone, { shouldValidate: true });
                    }}
                    placeholder="+1 (545) 674-3543"
                    inputStyle={{
                      paddingTop: 8,
                      paddingBottom: 8,
                      width: "100%",
                      border: 0,

                      color: "black",
                      background: "#fff",
                      borderRadius: "6px",
                      height: "40px",
                    }}
                    buttonStyle={{
                      borderTopLeftRadius: "10px",
                      borderBottomLeftRadius: "10px",
                    }}
                    containerStyle={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "6px",
                    }}
                    inputProps={{
                      id: "mobile",
                      name: "mobile",
                      required: true,
                    }}
                  />
                  {errors?.number && (
                    <p className="text-danger">{errors?.number?.message}</p>
                  )}
                </div>
                <div className={`form-row mb-3 col-md-6`}>
                  <Controller
                    name="zipCode"
                    control={control}
                    render={({ field }) => (
                      <>
                        <input
                          pattern="[0-9]*"
                          {...field}
                          className={` width-input form-control ${
                            errors.zipCode ? "error" : ""
                          }`}
                          placeholder="Zip code*"
                          maxLength={6}
                          onKeyPress={(e) => {
                            const isValidKey = /^[0-9]$/i.test(e.key);
                            if (!isValidKey) {
                              e.preventDefault();
                            }
                          }}
                        />
                        {errors.zipCode && (
                          <p className="text-danger mt-2">
                            {errors.zipCode.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                </div>
                <div className={`form-row mb-3 col-md-6 position-relative`}>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <>
                        <input
                          {...field}
                          className={` width-input form-control ${
                            errors.password ? "error" : ""
                          }`}
                          placeholder="Create Password*"
                          type={showPassword ? "text" : "password"}
                        />
                        {errors.password && (
                          <p className="text-danger mt-2">
                            {errors.password.message}
                          </p>
                        )}
                      </>
                    )}
                  />
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    className="position-absolute top-0 end-0 mx-0 bg-transparent border-0"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </div>
                <div className={`form-row mb-3 col-md-6 position-relative`}>
                  <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field }) => (
                      <>
                        <input
                          {...field}
                          className={` width-input form-control ${
                            errors.confirmPassword &&
                            watch("password") !== watch("confirmPassword")
                              ? "error"
                              : ""
                          }`}
                          placeholder="Confirm Password*"
                          type={showConfirmPassword ? "text" : "password"}
                        />
                        {errors.confirmPassword &&
                          watch("password") !== watch("confirmPassword") && (
                            <p className="text-danger mt-2">
                              {errors.confirmPassword.message}
                            </p>
                          )}
                      </>
                    )}
                  />
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowConfirmPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    className="position-absolute top-0 end-0 mx-0 bg-transparent border-0"
                  >
                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </div>
              </div>
              <div className="form-row mb-3 mt-1 d-flex justify-content-between">
                <FormGroup className="d-flex flex-wrap flex-row align-items-center">
                  <Controller
                    name="agreeToTerms"
                    control={control}
                    // defaultValue={false}
                    key={key}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            {...field}
                            value={checkbox}
                            className={`p-0 me-2 ${
                              errors.agreeToTerms ? "errorTerm" : ""
                            } `}
                          />
                        }
                        label="Click here to accept"
                        className={`mx-0 `}
                      />
                    )}
                  />
                  <p
                    className="mb-1 ms-2"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      window.open("https://dev.dazlpro.com/termsandConditions")
                    }
                  >
                    DAZl'S TERMS AND CONDITIONS.
                    <span className="text-danger">*</span>
                  </p>
                  {/* {errors.agreeToTerms && (
                    <p className="text-danger mb-0 w-100">{errors.agreeToTerms.message}</p>
                  )} */}
                </FormGroup>
                <p className="text-danger">*Required field</p>
              </div>
              <div className="d-flex justify-content-center align-items-center">
                <button type="submit" className="btn btn-primary w-100">
                  Submit
                </button>
              </div>
              <p className="d-flex justify-content-center align-items-center m-3">
                Do not have an account?{" "}
                <a href="/login/customer" className="text-primary">
                  Sign-In
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupCostumer;
