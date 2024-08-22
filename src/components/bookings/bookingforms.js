import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from "../LoadingSpinner";
import EmailVerification from '../auth/emailVerification';
import { InstitutionList, DepartmentList } from '../../Institutions'; // Check correct import path
import { parseISO } from "date-fns";
import { toast } from 'react-toastify';

function Bookingforms() {
  const { hallid, hallname } = useParams();
  const navigate=useNavigate()
  const [emailVerified, setEmailVerified] = useState(false); // Corrected
  const [isLoading, setLoading] = useState(false); // Corrected
  const [authStatus,setAuthStatus]=useState('')
  console.log(hallid, hallname);

  const [bookingData, setBookingData] = useState({
    userId: "",
    eventManager: "",
    department: "",
    institution: "",
    eventName: "",
    eventDateType: "",
    eventDate: "",
    eventStartDate: "",
    eventEndDate: "",
    startTime: "",
    endTime: "",
    email: "",
    userType: "",
    bookedHallId: hallid,
    bookedHallName: hallname,
    organizingClub: "",
    phoneNumber: "",
    altNumber: "",
    isApproved: "",
  });

  const userContact = async () => {
    try {
      setLoading(true); // Set loading to true when starting the request
      const token = localStorage.getItem('jwttoken');
      if(!token){
        toast.error("Unauthorized User");
        navigate('/login');
      }
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/getdata`,
        {
          withCredentials: true, // include credentials in the request
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        }
      );
      console.log(response.data.emailVerified);
      const data = response.data;
      if (data.emailVerified) {
        setEmailVerified(true);
      }
      let status;
      setBookingData({
        ...bookingData,
        userId: data._id,
        eventManager: data.name,
        email: data.email,
        department: data.department,
        institution: data.institution,
        userType: data.userType,
        isApproved: status,
      });
      setLoading(false); // Set loading to false when request is completed
    } catch (error) {
      console.log(error);
      setLoading(false); // Set loading to false in case of an error
    }
  };

  useEffect(() => {
    userContact();
  }, []);

  const handleInputs = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setBookingData({ ...bookingData, [name]: value });
    console.log(bookingData);
  };

  const bookingForm = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when submitting form

    const {
      eventManager,
      userId,
      department,
      institution,
      eventName,
      eventDateType,
      eventDate,
      eventStartDate,
      eventEndDate,
      startTime,
      endTime,
      email,
      userType,
      bookedHallId,
      bookedHallName,
      organizingClub,
      phoneNumber,
      altNumber,
      isApproved,
    } = bookingData;
 const token=localStorage.getItem('jwttoken')
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/bookings`,
        {
          userId,
          department,
          institution,
          eventManager,
          eventName,
          eventDate,
          eventDateType,
          eventStartDate,
          eventEndDate,
          startTime: parseISO(`2000-01-01T${startTime}:00.000Z`),
          endTime: parseISO(`2000-01-01T${endTime}:00.000Z`),
          email,
          userType,
          bookedHallId,
          bookedHallName,
          organizingClub,
          phoneNumber,
          altNumber,
          isApproved,
        },
        {
         // withCredentials: true, // To include credentials in the request
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        }
      );

      const data = response.data;
  console.log(response)
      if (response.status===200) {
        toast.success("Booking created successfully!");
        navigate("/bookings");
      } else {
        toast.error("Request not sent!");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 422) {
          const data = error.response.data;
          // Handle validation errors
          // You can set specific error messages for different fields if needed
          if (data && data.error) {
            const errorMessage = data.error;
            setAuthStatus(errorMessage);
            toast.error(errorMessage);
          }
        } else if (error.response.status === 403) {
          toast.error("Unauthorized request!");
        } else {
          console.error(error);
          toast.error("An error occurred while creating the booking.");
        }
      } else {
        console.error(error);
        toast.error("An error occurred while creating the booking.");
      }
    } finally {
      setLoading(false); // Set loading to false when request is completed
    }
  };

  const institutionName =
    InstitutionList[bookingData.institution] || bookingData.institution;
  const departmentName =
    DepartmentList[bookingData.department] || bookingData.department;

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : !emailVerified ? (
        <EmailVerification />
      ) : (
        <div className="max-w-screen-md mx-auto p-5 my-10 bg-white shadow-2xl shadow-blue-200">
          <div className="text-center mb-16">
            <p className="mt-4 text-sm leading-7 text-gray-500 font-regular uppercase">
              Book Hall
            </p>
            <h3 className="text-3xl sm:text-4xl leading-normal font-extrabold tracking-tight text-gray-900">
              Book Your <span className="text-rose-600">Hall </span>Now
            </h3>
          </div>

          <form method="POST" className="w-full">
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 "
                  htmlFor="grid-event-manager">
                  Event Coordinator Name
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-event-manager"
                  type="text"
                  value={bookingData.eventManager}
                  name="eventManager"
                  onChange={handleInputs}
                  placeholder="Event Coordinator Name"
                />
              </div>

              <div className="w-full md:w-1/2 px-3">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-event-name">
                  Event Name
                </label>
                <input
                  value={bookingData.eventName}
                  name="eventName"
                  onChange={handleInputs}
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-event-name"
                  type="text"
                  placeholder="Event Name"
                />
              </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-organizing-club">
                  Organizing Club
                </label>
                <input
                  value={bookingData.organizingClub}
                  name="organizingClub"
                  onChange={handleInputs}
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-organizing-club"
                  type="text"
                  placeholder="Organizing Club"
                />
              </div>

              <div className="w-full md:w-1/2 px-3">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-event-date-type">
                  Event Date Type
                </label>

                <select
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="eventDateType"
                  name="eventDateType"
                  value={bookingData.eventDateType}
                  onChange={handleInputs}>
                  <option value="">Select</option>
                  <option value="half">Half Day</option>
                  <option value="full">Full Day</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-event-date">
                  Event Date
                </label>
                <input
                  value={bookingData.eventDate}
                  name="eventDate"
                  onChange={handleInputs}
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-event-date"
                  type="date"
                  placeholder="Event Date"
                />
              </div>

              <div className="w-full md:w-1/2 px-3">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-event-start-time">
                  Start Time
                </label>
                <input
                  value={bookingData.startTime}
                  name="startTime"
                  onChange={handleInputs}
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-event-start-time"
                  type="time"
                  placeholder="Start Time"
                />
              </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-event-end-time">
                  End Time
                </label>
                <input
                  value={bookingData.endTime}
                  name="endTime"
                  onChange={handleInputs}
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-event-end-time"
                  type="time"
                  placeholder="End Time"
                />
              </div>

              <div className="w-full md:w-1/2 px-3">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-organizing-club">
                  Phone Number
                </label>
                <input
                  value={bookingData.phoneNumber}
                  name="phoneNumber"
                  onChange={handleInputs}
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-organizing-club"
                  type="tel"
                  placeholder="Phone Number"
                />
              </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-alt-number">
                  Alternate Number
                </label>
                <input
                  value={bookingData.altNumber}
                  name="altNumber"
                  onChange={handleInputs}
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-alt-number"
                  type="tel"
                  placeholder="Alternate Number"
                />
              </div>
              <div className="my-4">
                <p className="text-s text-red-600	 font-bold">{authStatus}</p>
              </div>


              <div className="w-full md:w-1/2 px-3">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-institution">
                  Institution
                </label>
                <select
                  value={bookingData.institution}
                  name="institution"
                  onChange={handleInputs}
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-institution">
                  <option value="">Select Institution</option>
                  {Object.keys(InstitutionList).map((key) => (
                    <option key={key} value={key}>
                      {InstitutionList[key]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-department">
                  Department
                </label>
                <select
                  value={bookingData.department}
                  name="department"
                  onChange={handleInputs}
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-department">
                  <option value="">Select Department</option>
                  {Object.keys(DepartmentList).map((key) => (
                    <option key={key} value={key}>
                      {DepartmentList[key]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full md:w-1/2 px-3">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-user-type">
                  User Type
                </label>
                <input
                  value={bookingData.userType}
                  name="userType"
                  onChange={handleInputs}
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-user-type"
                  type="text"
                  placeholder="User Type"
                />
              </div>
            </div>

            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-booked-hall-name">
                  Hall Name
                </label>
                <input
                  value={bookingData.bookedHallName}
                  name="bookedHallName"
                  onChange={handleInputs}
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-booked-hall-name"
                  type="text"
                  placeholder="Hall Name"
                  disabled
                />
              </div>

              <div className="w-full md:w-1/2 px-3">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-booked-hall-id">
                  Hall Id
                </label>
                <input
                  value={bookingData.bookedHallId}
                  name="bookedHallId"
                  onChange={handleInputs}
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-booked-hall-id"
                  type="text"
                  placeholder="Hall Id"
                  disabled
                />
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={bookingForm}
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline">
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default Bookingforms;
