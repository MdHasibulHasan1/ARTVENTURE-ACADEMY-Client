import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Reveal from "react-awesome-reveal";
import axios from "axios";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useSelectedClasses from "../../hooks/useSelectedClasses";
import { useUpdateEnrolled } from "../../hooks/useUpdateEnrolled";
import useUsers from "../../hooks/useUsers";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedClasses, refetch] = useSelectedClasses();
  const [users, isUserLoading] = useUsers();
  console.log(users);
  const currentUser = users.find((us) => us?.email === user?.email);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/approvedClasses");
      setClasses(response.data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const handleSelect = (classItem) => {
    const {
      _id,
      availableSeats,
      totalEnrolled,
      imgURL,
      className,
      instructorName,
      price,
    } = classItem;
    if (!user) {
      Swal.fire({
        title: "Please login to select the course",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Login now!",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login", { state: { from: location } });
        }
      });
      return;
    }

    const selectedItem = {
      classId: _id,
      email: user?.email,
      availableSeats,
      imgURL,
      className,
      instructorName,
      price,
      status: true,
    };
    fetch("http://localhost:5000/selectedClasses", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(selectedItem),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.insertedId) {
          useUpdateEnrolled(_id, totalEnrolled);
          refetch();
        }
      });
  };

  return (
    <div className="group grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {classes.map((classItem, index) => (
        <Reveal
          key={classItem._id}
          cascade
          damping={0.1}
          direction="down"
          duration={500}
          delay={index * 100}
        >
          <div
            key={classItem._id}
            className={` p-4 ${
              classItem.availableSeats === "0" ? "" : ""
            } transform transition-transform duration-300 group-hover:scale-105`}
          >
            <div className="relative">
              <img
                src={classItem.imgURL}
                alt={classItem.className}
                className="w-full h-48 object-cover  rounded-t-md"
              />
              {classItem.availableSeats === "0" && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-500 bg-opacity-80 rounded-t-md">
                  <p className="text-white font-semibold">Sold Out</p>
                </div>
              )}
            </div>
            <div className="">
              <h3 className="text-xl font-bold mb-2">{classItem.className}</h3>
              <p className="text-sm text-gray-600 mb-2">
                Instructor: {classItem.instructorName}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Available Seats: {classItem.availableSeats}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Price: {classItem.price}
              </p>

              <button
                disabled={
                  classItem.availableSeats === "0" ||
                  currentUser?.role === "admin" ||
                  currentUser?.role === "instructor" ||
                  selectedClasses.find(
                    (selected) => selected.classId === classItem._id
                  )
                }
                onClick={() => handleSelect(classItem)}
                className="px-4 py-2 w-full bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300"
              >
                Select
              </button>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
};

export default Classes;