import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InstitutionList, DepartmentList } from './Institutions';
import LoadingSpinner from './components/LoadingSpinner';
import { toast } from 'react-toastify';

function About() {
    const navigate = useNavigate();
    const [userData, setUser] = useState({});
    const [isLoading, setLoading] = useState(true);

    const token = localStorage.getItem('jwttoken');
    const userId = localStorage.getItem('userId'); // Ensure userId is also stored in local storage

    const About = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/about`, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            console.log(response);
            setUser(response.data);
            setLoading(false);
            if (response.status !== 200) {
                throw new Error(response.error);
            }
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 401) {
                toast.warn("Unauthorized Access! Please Login!", { toastId: "Unauthorized" });
                navigate("/");
            }
        }
    };

    useEffect(() => {
        About();
    }, []);

    const sendEmailVerificationLink = async (e) => {
        setLoading(true);
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:5000/verifyemail",
                { email: userData.email },
                {
                    withCredentials: true,
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
            const data = response.data;
            if (data) {
                setLoading(false);
                toast.success("Email Sent To Admin Successfully");
            }
        } catch (error) {
            setLoading(false);
            if (error.response && error.response.status === 400) {
                const data = error.response.data;
                console.error(data.error);
            } else {
                console.error(error);
            }
        }
    };

    const VerifyButton = () => {
        if (!userData.email) return null; // Add this check
        if (userData.emailVerified) {
            return (
                <button className="text-white bg-green-600 shadow focus:shadow-outline ml-6 focus:outline-none border-0 py-2 px-5 font-bold disable rounded text-sm">
                    Verified
                </button>
            );
        } else {
            return (
                <button
                    type="submit"
                    onClick={sendEmailVerificationLink}
                    className="text-white bg-rose-900 shadow focus:shadow-outline ml-6 focus:outline-none border-0 py-2 px-5 font-bold hover:bg-rose-800 rounded text-sm"
                >
                    Verify Email
                </button>
            );
        }
    };

    const institutionName = InstitutionList[userData.institution] || userData.institution;
    const departmentName = DepartmentList[userData.department] || userData.department;

    return (
        <>
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <div className="flex min-h-screen w-full items-center justify-center ">
                    <div className="w-full rounded-xl p-12 shadow-2xl shadow-blue-200 md:w-8/12 lg:w-6/12 bg-white">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            <div className="col-span-1 lg:col-span-9">
                                <div className="text-center lg:text-left">
                                    <h2 className="text-2xl font-bold text-zinc-700">
                                        {userData.name}
                                    </h2>
                                    <p className="mt-2 text-l font-semibold text-zinc-700">
                                        {userData.userType === "hod"
                                            ? `Head of ${userData.department} Department`
                                            : userData.userType === "faculty"
                                            ? `Faculty of ${userData.department} Department`
                                            : userData.userType === "admin"
                                            ? "Admin"
                                            : ""}
                                    </p>
                                </div>
                                <div className="mt-6 grid grid-cols-3 gap-8 text-center items-center lg:text-left">
                                    <div>
                                        <p className="font-bold text-zinc-700">Email</p>
                                    </div>
                                    <div>
                                        <p className="text-m font-semibold text-zinc-700">
                                            {userData.email}
                                        </p>
                                    </div>
                                    <div>
                                        <VerifyButton />
                                    </div>
                                </div>

                                {userData.userType !== "admin" && (
                                    <>
                                        <div className="mt-6 grid grid-cols-3 gap-8 text-center items-center lg:text-left">
                                            <div>
                                                <p className="font-bold text-zinc-700">Institution</p>
                                            </div>
                                            <div>
                                                <p className="text-m font-semibold text-zinc-700">
                                                    {userData.institution} - {institutionName}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-6 grid grid-cols-3 gap-8 text-center items-center lg:text-left">
                                            <div>
                                                <p className="font-bold text-zinc-700">Department</p>
                                            </div>
                                            <div>
                                                <p className="text-m font-semibold text-zinc-700">
                                                    {userData.department} - {departmentName}
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="mt-6 grid grid-cols-3 gap-8 text-center items-center lg:text-left">
                                    <div>
                                        <p className="font-bold text-zinc-700">Phone</p>
                                    </div>
                                    <div>
                                        <p className="text-m font-semibold text-zinc-700">
                                            {userData.phone}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default About;
