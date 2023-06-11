import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import SectionTitle from "../Shared/SectionTitle/SectionTitle";

import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import useAuth from "../../hooks/useAuth";
import useUserData from "../../hooks/useUserData";

const UserProfile = () => {
  const [userData, refetchUser] = useUserData();
  const { user, updateUserProfile } = useAuth();
  const [name, setName] = useState(userData?.name || "");
  const [photoURL, setPhotoURL] = useState(userData?.photoURL || "");
  const [phoneNumber, setPhoneNumber] = useState(userData?.phoneNumber || "");
  const [address, setAddress] = useState(userData?.address || "");
  const [gender, setGender] = useState(userData?.gender || "");

  const handlePhoneChange = (value) => {
    setPhoneNumber(value);
  };

  const handleCountryChange = (selectedOption) => {
    const countryCode = selectedOption?.value || "";
    setPhoneNumber(countryCode + phoneNumber);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:5000/profile/update/${user.email}`,
        {
          name,
          photoURL,
          phoneNumber,
          address,
          email: user?.email,
          gender,
        }
      );

      if (response.data.acknowledged) {
        updateUserProfile(name, photoURL);
        refetchUser();

        Swal.fire({
          icon: "success",
          title: "Profile Updated",
          text: "Your profile has been successfully updated.",
        });
      }

      // Clear form fields
      setName("");
      setPhotoURL("");
      setPhoneNumber("");
      setAddress("");
      setGender("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-11/12 mx-auto">
      <div className="bg-white rounded shadow p-4">
        <div className="flex items-center mb-4">
          <img
            className="w-12 h-12 rounded-full mr-4"
            src={userData?.photoURL}
            alt="Profile"
          />
          <h2 className="text-xl font-semibold">{userData?.name}</h2>
        </div>
        <div>
          <p className="text-gray-600 mb-2">
            <span className="font-semibold">Email:</span> {userData?.email}
          </p>
          <p className="text-gray-600 mb-2">
            <span className="font-semibold">Address:</span> {userData?.address}
          </p>
          <p className="text-gray-600 mb-2">
            <span className="font-semibold">Gender:</span> {userData?.gender}
          </p>
          <p className="text-gray-600 mb-2">
            <span className="font-semibold">Phone Number:</span>{" "}
            {userData?.phoneNumber}
          </p>
        </div>
      </div>
      <SectionTitle subTitle="Your Profile" title="Update" />
      <form onSubmit={handleSubmit} className="">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-semibold">
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input p-2 mt-1 block w-full border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 hover:border-blue-500 hover:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="photoURL"
              className="block text-gray-700 font-semibold"
            >
              Image:
            </label>
            <input
              type="text"
              id="photoURL"
              name="photoURL"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              className="form-input p-2 mt-1 block w-full border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 hover:border-blue-500 hover:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="address"
              className="block text-gray-700 font-semibold"
            >
              Address:
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="form-input p-2 mt-1 block w-full border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 hover:border-blue-500 hover:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-semibold"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={user?.email}
              readOnly
              className="form-input p-2 mt-1 block w-full border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 hover:border-blue-500 hover:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="gender"
              className="block text-gray-700 font-semibold"
            >
              Gender:
            </label>
            <select
              id="gender"
              name="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="form-select p-2 mt-1 block w-full border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 hover:border-blue-500 hover:ring-blue-500"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <div className="mb-4">
          <PhoneInput
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder="Phone Number"
            className=" p-2 mt-1 block w-full border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 hover:border-blue-500 hover:ring-blue-500"
          />
        </div>
        <div className="flex grow items-center justify-center">
          <button
            type="submit"
            className="px-4 py-2 mx-auto block text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md focus:outline-none"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;