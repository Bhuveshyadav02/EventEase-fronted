import React, { useState } from "react";
import {
  DepartmentList,
  institutions,
  InstitutionList,
} from "../../Institutions";
import LoadingSpinner from "../LoadingSpinner";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [isLoading, setLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState("");
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    institution: "",
    department: "",
    phone: "",
    userType: "",
    password: "",
    cpassword: "",
    adminkey: "",
  });

  const handleInput = (e) => {
          e.preventDefault()
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const PostData = async (e) => {
    e.preventDefault();
    setLoading(true);

    const {
      name,
      email,
      institution,
      department,
      phone,
      userType,
      password,
      cpassword,
      adminkey,
    } = user;
    
    try {
      console.log(
        name,
        email,
        institution,
        department,
        phone,
        userType,
        password,
        cpassword,
        adminkey
      );

      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/register`,
        {
          name,
          email,
          institution,
          department,
          phone,
          userType,
          password,
          cpassword,
          adminkey,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setLoading(false);
      toast.success("Sign Up Successful");
      navigate("/login");
      
    } catch (error) {
      console.log(error.response?.data?.error);
      if (error.response) {
        setLoading(false);
        const data = error.response.data;
        setAuthStatus(data.error);
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <section className="text-gray-600 body-font my-10 min-h-screen flex items-center justify-center bg-white">
          <div className="lg:w-2/6 md:w-1/2 my-10 bg-white shadow-2xl shadow-blue-200 rounded-lg p-8 flex flex-col md:ml-auto md:mr-auto mt-10 md:mt-0">
            <form onSubmit={PostData}>
              <h3 className="text-rose-700 font-sans font-extrabold text-4xl mb-8">
                Sign <span className="text-gray-400">Up</span>
              </h3>
              <div className="flex flex-col">
                <label
                  htmlFor="name"
                  className="text-gray-600 font-bold text-sm mb-1"
                >
                  FULL NAME
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={user.name}
                  onChange={handleInput}
                  placeholder="Full Name"
                  className="mb-4 max-w-screen-lg h-10 bg-white border rounded focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
              <div className="flex flex-col mb-4">
                <label
                  htmlFor="email"
                  className="text-gray-600 font-bold text-sm mb-2"
                >
                  EMAIL
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={user.email}
                  onChange={handleInput}
                  placeholder="Email"
                  className="max-w-screen-lg h-10 bg-white border rounded focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
              <div className="flex flex-col mb-4">
                <label
                  htmlFor="phone"
                  className="text-gray-600 font-bold text-sm mb-2"
                >
                  PHONE
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  pattern="[0-9]{10}"
                  required
                  value={user.phone}
                  onChange={handleInput}
                  placeholder="Phone"
                  className="max-w-screen-lg h-10 bg-white border rounded focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
              <div className="relative mb-4">
                <label
                  htmlFor="userType"
                  className="leading-7 block uppercase tracking-wide text-gray-700 text-xs font-bold"
                >
                  Your Role
                </label>
                <select
                  className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  id="userType"
                  name="userType"
                  value={user.userType}
                  onChange={handleInput}
                >
                  <option value="select">Select</option>
                  <option value="faculty">Faculty</option>
                  {process.env.REACT_APP_HOD_FEATURE === "true" && (
                    <option value="hod">HOD</option>
                  )}
                  {process.env.REACT_APP_ADMIN_SIGN_UP === "true" && (
                    <option value="admin">Admin</option>
                  )}
                </select>
              </div>
              {user.userType === "admin" ? (
                <div className="relative mb-4">
                  <label
                    htmlFor="adminkey"
                    className="leading-7 block uppercase tracking-wide text-gray-700 text-xs font-bold"
                  >
                    Admin Key
                  </label>
                  <input
                    type="text"
                    required
                    value={user.adminkey}
                    onChange={handleInput}
                    id="adminkey"
                    name="adminkey"
                    placeholder="Admin Key"
                    className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              ) : (
                <div className="relative mb-4">
                  <label
                    htmlFor="institution"
                    className="leading-7 block uppercase tracking-wide text-gray-700 text-xs font-bold"
                  >
                    Institution
                  </label>
                  <select
                    value={user.institution}
                    onChange={handleInput}
                    id="institution"
                    name="institution"
                    className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  >
                    <option value="">Select</option>
                    {Object.keys(InstitutionList).map((key) => (
                      <option key={key} value={key}>
                        {InstitutionList[key]}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {user.institution && user.userType !== "admin" && (
                <div className="relative mb-4">
                  <label
                    htmlFor="department"
                    className="leading-7 block uppercase tracking-wide text-gray-700 text-xs font-bold"
                  >
                    Department
                  </label>
                  <select
                    value={user.department}
                    onChange={handleInput}
                    id="department"
                    name="department"
                    className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  >
                    <option value="">Select</option>
                    {institutions
                      .find(
                        (inst) => inst.name === InstitutionList[user.institution]
                      )
                      ?.departments.map((dept, index) => (
                        <option
                          key={index}
                          value={Object.keys(DepartmentList).find(
                            (key) => DepartmentList[key] === dept
                          )}
                        >
                          {dept}
                        </option>
                      ))}
                  </select>
                </div>
              )}
              <div className="relative mb-4">
                <label
                  htmlFor="password"
                  className="leading-7 block uppercase tracking-wide text-gray-700 text-xs font-bold"
                >
                  Password
                </label>
                <input
                  required
                  value={user.password}
                  onChange={handleInput}
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
              <div className="relative mb-4">
                <label
                  htmlFor="cpassword"
                  className="leading-7 block uppercase tracking-wide text-gray-700 text-xs font-bold"
                >
                  Confirm Password
                </label>
                <input
                  required
                  value={user.cpassword}
                  onChange={handleInput}
                  type="password"
                  id="cpassword"
                  name="cpassword"
                  placeholder="Confirm Password"
                  className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
              <div className="my-4">
                <p className="text-s text-red-600 font-bold">{authStatus}</p>
              </div>
              <div className="mx-auto w-fit">
                <button
                  type="submit"
                  className="text-white bg-indigo-600 shadow focus:shadow-outline focus:outline-none border-0 py-2 px-10 font-bold  hover:bg-indigo-800 rounded text-lg"
                >
                  Sign Up
                </button>
              </div>
              <div className="mt-4 text-center">
                <p className="text-m">
                  Already have an account?
                  <Link to="/" className="text-blue-600 hover:underline">
                    {" "}
                    Login
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </section>
      )}
    </>
  );
};

export default Signup;
