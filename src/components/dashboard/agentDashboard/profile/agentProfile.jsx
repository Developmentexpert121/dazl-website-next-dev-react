import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import {
  getAgentProfiledata,
  updateAgentProfile,
} from "../../../../store/dashboard/dashboardSlice";
import { useNavigate } from "react-router";
import "./agentprofile.css";
import PhoneInput from "react-phone-input-2";

import "react-phone-input-2/lib/bootstrap.css";

const defaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  companyName: "",
  city: "",
  state: "",
  zipCode: "",
  number: "",
};

const schema = yup.object().shape({
  firstName: yup
    .string()
    .required("First Name is required")
    .min(3, "First Name must be atleast 3 charachters"),
  lastName: yup
    .string()
    .required("Last Name is required")
    .min(3, "First Name must be atleast 3 charachters"),
  email: yup
    .string()
    .email("Please enter valid email address")
    .required("Email is required")
    .trim(),
  companyName: yup
    .string()
    .required("companyName is required")
    .trim()
    .min(3, "First Name must be atleast 3 charachters"),
  city: yup.string().trim().min(3, "First Name must be atleast 3 charachters"),
  state: yup.string().trim().min(3, "First Name must be atleast 3 charachters"),
  zipCode: yup.string().trim(),
  number: yup
    .string()
    .matches(/^[0-9]+$/, "Phone number is required")
    .required("Number is required")
    .trim(),
});

const AgentProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const Selector = useSelector((state) => state.dashboardSlice);
  const agentData = Selector.data.agentData;
  const [phone, setPhone] = React.useState("");
  const [disable, setDisable] = React.useState(false);
  const {
    control,
    reset,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });
  const onSubmit = (data) => {
    if (disable) {
      dispatch(updateAgentProfile(data));
      reset();
      setDisable(false);
    } else {
      setDisable(true);
    }
  };
  useEffect(() => {
    setValue("firstName", agentData.first_name);
    setValue("lastName", agentData.last_name);
    setValue("email", agentData.email);
    setValue("companyName", agentData.real_state_agency_name ?? "");
    setValue("city", agentData.city_of_real_state_agency ?? "");
    setValue("state", agentData.state ?? "");
    setValue("zipCode", agentData.zip_code ?? "");
    setValue("number", agentData.phone_number);
    setPhone(agentData.phone_number);
    if (agentData.length === 0) {
      dispatch(getAgentProfiledata(userId));
    }
  }, [agentData]);
  //
  return (
    <div className="py-0">
      <div className="">
        <h2 className="h3 text-uppercase text-start mb-4 pb-4 border-bottom">
          PHD Project
        </h2>
        <div className="">
          <div className="row">
            <h4 className="mb-4">EDIT PROFILE</h4>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row">
                <div className={`form-row mb-3 col-md-6`}>
                  First Name:
                  <Controller
                    name="firstName"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        disabled={disable ? false : true}
                        className={`form-control ${
                          errors.firstName ? "error" : ""
                        }`}
                        placeholder="First Name"
                      />
                    )}
                  />
                </div>
                <div className={`form-row mb-3 col-md-6`}>
                  Last Name:
                  <Controller
                    name="lastName"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        disabled={disable ? false : true}
                        className={`form-control ${
                          errors.lastName ? "error" : ""
                        }`}
                        placeholder="Last Name"
                      />
                    )}
                  />
                </div>
                <div className={`form-row mb-3 col-md-6`}>
                  Email:
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        disabled={disable ? false : true}
                        className={`form-control width-input ${
                          errors.email ? "error" : ""
                        }`}
                        placeholder="Email address"
                      />
                    )}
                  />
                </div>
                <div className={`form-row mb-3 col-md-6`}>
                  Agency Name:
                  <Controller
                    name="companyName"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        disabled={disable ? false : true}
                        className={`form-control width-input  ${
                          errors.companyName ? "error" : ""
                        }`}
                        placeholder="Real Estate company"
                      />
                    )}
                  />
                </div>
                <div className={`form-row mb-3 col-md-6`}>
                  City:
                  <Controller
                    name="city"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        disabled={disable ? false : true}
                        className={`form-control width-input ${
                          errors.city ? "error" : ""
                        }`}
                        placeholder="City"
                      />
                    )}
                  />
                </div>
                <div className={`form-row mb-3 col-md-6`}>
                  State:
                  <Controller
                    name="state"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        disabled={disable ? false : true}
                        className={`form-control width-input ${
                          errors.state ? "error" : ""
                        }`}
                        placeholder="State"
                      />
                    )}
                  />
                </div>
                <div className={`form-row mb-3 col-md-6`}>
                  Zip Code:
                  <Controller
                    name="zipCode"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        disabled={disable ? false : true}
                        onKeyPress={(e) => {
                          const isValidKey = /^[0-9]$/i.test(e.key);
                          if (!isValidKey) {
                            e.preventDefault();
                          }
                        }}
                        className={`form-control width-input ${
                          errors.zipCode ? "error" : ""
                        }`}
                        placeholder="ZipCode"
                      />
                    )}
                  />
                </div>
                <div className={`form-row mb-3 col-md-6`}>
                  Number:
                  <PhoneInput
                    disabled={disable ? false : true}
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
                      background: disable ? "#fff" : "#e9ecef",
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
              </div>
              <div className="d-flex justify-content-center align-items-center flex-column">
                <button
                  type="submit"
                  className="btn btn-primary mw-230px w-100 mt-2"
                >
                  {disable ? "Update" : "Edit"}
                </button>
                <h5 className="fw-bold text-uppercase my-2">OR</h5>
                <button
                  onClick={() => navigate("/agent/changePassword")}
                  className="btn btn-success mw-230px w-100"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentProfile;
