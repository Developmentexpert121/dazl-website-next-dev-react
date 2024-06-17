import React, { useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./contact.css";
import { useDispatch } from "react-redux";
import { contactUsAuth, uploadImageAuth } from "../../store/auth/authSlice";
import {
  contactUsDash,
  uploadImage,
} from "../../store/dashboard/dashboardSlice";

const photosSchema = yup.array().of(
  yup.object().shape({
    file: yup
      .mixed()
      .test(
        "isImageFile",
        "Invalid file type. Only image files (png, jpg) are allowed.",
        (value) => {
          if (!value) return true; // Allow undefined or null values (not required)

          const supportedFormats = [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/avif",
          ];
          return supportedFormats.includes(value[0]?.type);
        }
      ),
    description: yup.string(),
  })
);

const schema = yup.object().shape({
  memberName: yup.string().required("memberName is required"),
  propertyAddress: yup.string().required("propertyAddress is required"),
  companyName: yup.string().required("companyName is required"),
  contactName: yup.string().required("contactName is required"),
  describeIssue: yup.string().required("describeIssue is required"),
  stepsToResolve: yup.string().required("stepsToResolve is required"),
  howIssueResolved: yup.string().required("howIssueResolved is required"),
  photos: photosSchema,
});

const ContactUs = () => {
  const defaultValues = {
    memberName: "",
    propertyAddress: "",
    companyName: "",
    contactName: "",
    describeIssue: "",
    stepsToResolve: "",
    howIssueResolved: "",
    photos: [{ description: "", file: null }],
  };

  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    reset,
    setError,
    clearErrors,
  } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "photos",
  });

  const [textValues, setTextValues] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  const onSubmit = (data) => {
    const item = {
      member_name: data.memberName,
      property_address: data.propertyAddress,
      company_name: data.companyName,
      contact_name: data.contactName,
      issue_description: data.describeIssue,
      steps_resolve_issue: data.stepsToResolve,
      issue_solution: data.howIssueResolved,
      images: selectedImages,
      images_description: textValues,
    };

    if (token) {
      dispatch(contactUsDash(item));
    } else {
      dispatch(contactUsAuth(item));
    }
    reset();
    setTextValues([]);
    setSelectedImages([]);
  };

  const handleChange = (index, value) => {
    const updatedTextValues = [...textValues];
    updatedTextValues[index] = value;
    setTextValues(updatedTextValues);
  };

  const handleImage = (phd, index, e) => {
    const file = e.target.files[0];
    const isImage = file && file.type.startsWith("image/");

    clearErrors(`photos[${index}].file`);
    if (!isImage) {
      setError(`photos[${index}].file`, {
        type: "manual",
        message: "Invalid file type. Please select a valid image.",
      });
    } else {
      const formData = new FormData();
      formData.append("image", file);
      dispatch(uploadImageAuth(formData))
        .unwrap()
        .then((res) => {
          const responseImage = res.image;
          setSelectedImages((prevData) => {
            const newArray = [...prevData];
            newArray[index] = responseImage;
            return newArray;
          });
        });
    }
  };

  const isLastFieldComplete = () => {
    if (fields.length === 0) return true;
    const lastIndex = fields.length - 1;
    const lastImageField = selectedImages[lastIndex];
    const lastTextValue = textValues[lastIndex] || "";
    return lastImageField && lastTextValue.trim() !== "";
  };

  return (
    <div className="py-0">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-6">
            <div className="col-inner px-lg-5 py-5 form-contact-left h-100 d-flex flex-column justify-content-center">
              <form onSubmit={handleSubmit(onSubmit)}>
                <h1 className="contact-us-text h2 text-uppercase mb-3">
                  Contact Us
                </h1>
                <label className="fs-3">
                  Record of workmanship or service issue:
                </label>
                <div className="form-row mt-1">
                  <Controller
                    name="memberName"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        id="memberName"
                        placeholder="member name (autofills)"
                        className={`form-control ${
                          errors.memberName ? "error" : ""
                        }`}
                      />
                    )}
                  />
                </div>

                <div className="form-row">
                  <Controller
                    name="propertyAddress"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        id="propertyAddress"
                        placeholder="property address (autofills with dropdown if multiple)"
                        className={`form-control ${
                          errors.propertyAddress ? "error" : ""
                        }`}
                      />
                    )}
                  />
                </div>

                <div className="form-row">
                  <Controller
                    name="companyName"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        id="companyName"
                        placeholder="services professional's company name"
                        className={`form-control ${
                          errors.companyName ? "error" : ""
                        }`}
                      />
                    )}
                  />
                </div>

                <div className="form-row">
                  <Controller
                    name="contactName"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        id="contactName"
                        placeholder="services professional's contact name"
                        className={`form-control ${
                          errors.contactName ? "error" : ""
                        }`}
                      />
                    )}
                  />
                </div>

                <div className="form-row">
                  <Controller
                    name="describeIssue"
                    control={control}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        type="text"
                        id="describeIssue"
                        placeholder="describe the issue"
                        className={`form-control ${
                          errors.describeIssue ? "error" : ""
                        }`}
                      />
                    )}
                  />
                </div>

                <div className="form-row">
                  <Controller
                    name="stepsToResolve"
                    control={control}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        type="text"
                        id="stepsToResolve"
                        placeholder="What steps have been taken to resolve issue?"
                        className={`form-control ${
                          errors.stepsToResolve ? "error" : ""
                        }`}
                      />
                    )}
                  />
                </div>

                <div className="form-row">
                  <Controller
                    name="howIssueResolved"
                    control={control}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        type="text"
                        id="howIssueResolved"
                        placeholder="describe how you would like to see the issue resolved"
                        className={`form-control ${
                          errors.howIssueResolved ? "error" : ""
                        }`}
                      />
                    )}
                  />
                </div>

                <div className="border border-1 form-row-outer p-3 rounded-2 mb-3">
                  <div className="form-row">
                    <p>UPLOAD PHOTOS that demonstrate the issues or concerns</p>
                  </div>

                  {fields.map((item, index) => (
                    <div
                      key={item.id}
                      className="form-row bg-light p-3 rounded-2"
                    >
                      <div className="column">
                        <input
                          type="file"
                          {...register(`photos[${index}].file`)}
                          className={`form-control mb-3 ${
                            errors.photos && errors?.photos[index]?.file
                              ? "error"
                              : ""
                          }`}
                          onChange={(e) => handleImage(item.id, index, e)}
                        />
                      </div>
                      <div className="column">
                        <Controller
                          name={`photos[${index}].description`}
                          control={control}
                          render={({ field }) => (
                            <input
                              {...field}
                              placeholder="Enter photo description"
                              className={`form-control ${
                                errors.photos &&
                                errors?.photos[index]?.description
                                  ? "error"
                                  : ""
                              }`}
                              value={textValues[index] || ""}
                              onChange={(e) =>
                                handleChange(index, e.target.value)
                              }
                            />
                          )}
                        />
                        {fields.length !== 0 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="btn btn-danger ms-2 mt-2"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="form-row text-end mb-0">
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => {
                        if (isLastFieldComplete()) {
                          append({ description: "", file: null });
                        }
                      }}
                      disabled={!isLastFieldComplete()}
                    >
                      Upload more
                    </button>
                  </div>
                </div>

                <button
                  className="sub-button btn bg-dark text-white text-uppercase fw-bold"
                  type="submit"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
          <div className="col-md-6 position-relative form-contact-right">
            <img
              src="/images/contactImages/contact-img-1.jpg"
              alt=""
              className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
