import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";

import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";

const AddAClass = () => {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const img_hosting_token = "baae3e6b39110191c29e2e5fb79352d6";

  const img_hosting_url = `https://api.imgbb.com/1/upload?key=${img_hosting_token}`;

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("image", data.image[0]);
    console.log(data.image[0]);

    console.log(data);
    const {
      availableSeats,
      className,
      instructorEmail,
      instructorName,
      price,
    } = data;
    fetch(img_hosting_url, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((imgResponse) => {
        if (imgResponse.success) {
          const imgURL = imgResponse.data.display_url;
          const { name, email, password } = data;
          console.log(imgURL);
        }
      });
  };

  return (
    <>
      <Helmet>
        <title>Name | Add A Class</title>
      </Helmet>

      <div className="mx-auto lg:w-11/12 shadow-2xl p-20 mb-20  bg-slate-50 justify-center  items-center">
        <h1 className="text-center text-3xl">--Add A Class--</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto">
          <div className="mb-4">
            <label htmlFor="className" className="block mb-2">
              Class Name:
            </label>
            <input
              type="text"
              id="className"
              name="className"
              className="w-full p-2 border border-gray-300 rounded"
              required
              {...register("className")}
            />
          </div>
          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text">Class image*</span>
            </label>
            <input
              type="file"
              {...register("image", { required: true })}
              className="file-input file-input-bordered w-full "
            />
          </div>
          <div className="mb-4">
            <label htmlFor="instructorName" className="block mb-2">
              Instructor Name:
            </label>
            <input
              type="text"
              id="instructorName"
              name="instructorName"
              className="w-full p-2 border border-gray-300 rounded"
              readOnly
              value={user?.displayName}
              {...register("instructorName")}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="instructorEmail" className="block mb-2">
              Instructor Email:
            </label>
            <input
              type="email"
              id="instructorEmail"
              name="instructorEmail"
              className="w-full p-2 border border-gray-300 rounded"
              readOnly
              value={user?.email}
              {...register("instructorEmail")}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="availableSeats" className="block mb-2">
              Available Seats:
            </label>
            <input
              type="number"
              id="availableSeats"
              name="availableSeats"
              className="w-full p-2 border border-gray-300 rounded"
              required
              {...register("availableSeats")}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="price" className="block mb-2">
              Price:
            </label>
            <input
              type="number"
              id="price"
              name="price"
              className="w-full p-2 border border-gray-300 rounded"
              required
              {...register("price")}
            />
          </div>

          <div>
            <button
              type="submit"
              className="px-4 w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddAClass;
