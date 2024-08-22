import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom"
import axios from 'axios';
import LoadingSpinner from "../LoadingSpinner";
import { toast } from "react-toastify";
// import BookingForm from "./BookingForm";

const HallsAdmin = () => {
    let token=localStorage.getItem('jwttoken')
  const navigate = useNavigate();
  const [hallData, setHallData] = useState({});
    const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  // const [authStatus, setAuthStatus] = useState("");
  const [showModal,setShowModal]=useState(false);
  const [selectedHallId, setSelectedHallId] = useState("");
  const [selectedHallName, setSelectedHallName] = useState("");

  const callAboutPage = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/about`, {
       // withCredentials: true, 
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Authorization":`Bearer ${token}`
        }
      });
      console.log("CallAbout",response)
      const data = response.data;
    console.log(data.email)
      setUserData(data);
      // console.log(data);
      setIsLoading(false);
      if (response.status !== 200) {
        throw new Error(response.error);
      }
    } catch (error) {
      if (error.response.status === 401) {
        toast.warn("Unauthrized Access! Please Login!", {
          toastId: 'Unauthrized'
      })
        navigate("/login");
      }
    }
  };
  // useEffect(() => {
  //   callAboutPage()
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])


  const getHallsData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/gethalls`, {
        //withCredentials: true, // include credentials in the request
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      console.log(response)
      const data = response.data;
       console.log(data.halls);
      setHallData(data.halls);
      setIsLoading(false);

      if (response.status !== 200) {
        throw new Error(response.error);
      }
    } catch (error) {
       console.log(error);
      // navigate("/login");
    }
  };



  useEffect(() => {
  callAboutPage()
    getHallsData();

  }, [])


  
  const handleDeleteClick = async (hallId) => {
    // e.preventDefault();


    try {
      const response = await axios.delete (
        `${process.env.REACT_APP_SERVER_URL}/halls/${hallId}`,

        {
         // withCredentials: true, // To include credentials in the request
          headers: {
            "Content-Type": "application/json",
            "Authorization":`Bearer ${token}`
          },
        }
      );

      const data = response.data;

      if (!data) {
        toast.error("Request not send!")
        // console.log("Message not send");
      } else {
        getHallsData();
        toast.success("Hall Deleted Successfull!")
        // alert("Message send");
        setShowModal(false);
        setSelectedHallId("");
        setSelectedHallName("");
        navigate("/halls")
        // setBookingData({ ...bookingData });
      }
    } catch (error) {
      if (error.response.status === 422 && error.response) {
        const data = error.response.data;
        // setAuthStatus(data.error);
        // console.log(data.error);
        // window.alert(data.error);
      } else {
        console.error(error);
      }
      // console.log(error);
    }
  };


  const handleBookingClick = (hallId, hallName) => {
   // navigate(`/bookingForm/${hallId}/${hallName}`)
    navigate(`/halls/bookhalls/${hallId}/${hallName}`)
  };

  const handleEditClick = (hallId, hallName) => {
    console.log("handleEdit")
    console.log(hallId,hallName)
    navigate(`/halledit/${hallId}/${hallName}`)
  };


  // const hallId =hallData.hallId
  // const hallName = hallData.hallName

  // const handleBookingClick = (hallId,hallName) => {
  //   navigate('/bookingForm', { state: { hallId, hallName } });

  // };


  // const handleBookingClick = () => {
  //   sendData(data);
  // };
  const handleDeleteModal = (hallId, hallName) => {
    setSelectedHallId(hallId);
    setSelectedHallName(hallName);
    setShowModal(true);
  };

  return (
<>{isLoading ? (
          <LoadingSpinner />
        ) : 
    <div className="mt-6 min-h-screen"> 
    
   <div className="py-5 md:py-0 flex container mx-auto px-6 justify-between  items-center">
   <div className="mx-auto ">
    <h1 className="text-xl  sm:text-3xl md:text-4xl lg:text-3xl xl:text-3xl text-center text-gray-800 font-black leading-7 ml-3 md:leading-10">
   Available <span className="text-rose-900"> Halls</span>  </h1>

   </div>
   <Link to="/hallForm">
            <button className="flex self-end focus:outline-none lg:text-lg lg:font-bold focus:ring-2 focus:ring-offset-2 focus:ring-rose-700 md:block bg-transparent transition duration-150 ease-in-out hover:bg-rose-900 hover:text-white rounded border border-rose-900 text-rose-900 sm:px-8 py-1 sm:py-3 text-sm">
              Create Hall</button>
          </Link>
   </div>

      {Array.isArray(hallData) && hallData.length > 0 ? (
        hallData.map((hall) => (
          <div key={hall._id} className="my-2 ">
            <div className="flex w-full items-center justify-center">
              <div className="w-full rounded-xl p-12 shadow-2xl shadow-blue-200 md:w-8/12 lg:w-8/12 bg-white">

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                
                  <div className="col-span-1 lg:col-span-9">
                    <div className="text-center lg:text-left">
                      <h2 className="text-2xl font-bold text-zinc-700">{hall.name}</h2>
                     
                    </div>

                 

                    <div className="mt-6 grid grid-cols-2 gap-6 text-center lg:text-left">
                      <div>
                        <p className="font-bold text-zinc-700">Location</p>
                      </div>

                      <div>
                        <p className="text-m font-semibold text-zinc-700">{hall.location}</p>
                      </div>
                    </div>



                    <div className="mt-6 grid grid-cols-2 gap-6 text-center lg:text-left">
                      <div>
                        <p className="font-bold text-zinc-700">Capacity</p>
                      </div>

                      <div>
                        <p className="text-m font-semibold text-zinc-700">{hall.capacity}</p>
                      </div>
                    </div>


                    <div className="mt-6 grid grid-cols-2 gap-6 text-center lg:text-left">
                      <div>
                        <p className="font-bold text-zinc-700">Amenities</p>
                      </div>

                      <div>
                        <p className="text-m font-semibold text-zinc-700">{hall.amenities}</p>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-6 text-center lg:text-left">
                      <div>
                        <p className="font-bold text-zinc-700">Description</p>
                      </div>

                      <div>
                        <p className="text-m font-semibold text-zinc-700">{hall.description}</p>
                      </div>
                    </div>









                    <div className="mt-6 grid grid-cols-3 gap-4">
                   
                      <button className="w-full rounded-xl border-2 border-rose-700 bg-rose-700 px-3 py-2 font-semibold text-white hover:bg-rose-800"
                        onClick={() => handleBookingClick(hall._id, hall.name)}
                      >
                        Book Now
                      </button>
                {userData.email === process.env.REACT_APP_MASTER_ADMIN_EMAIL || userData.email === hall.hallcreater  ? 
                <>
                      <button className="w-full rounded-xl border-2 border-blue-500 bg-white px-3 py-2 font-semibold text-blue-500 hover:bg-blue-500 hover:text-white"
                        onClick={() => handleEditClick(hall._id, hall.name)}
                      >
                        Edit Hall
                      </button>

                      <button className="w-full rounded-xl border-2 border-red-500 bg-white px-3 py-2 font-semibold text-red-500 hover:bg-red-500 hover:text-white"
                        // onClick={() => handleDeleteClick(hall._id, hall.name)}
                        // onClick={() => setShowModal(true)} 
                        onClick={() =>
                          handleDeleteModal(hall._id, hall.name)
                        }
                        >
                        Delete Hall
                      </button>
                        </>

                    : <></>}
                      {/* </Link> */}
                      {/* <button className="w-full rounded-xl border-2 border-blue-500 bg-white px-3 py-2 font-semibold text-blue-500 hover:bg-blue-500 hover:text-white">
                  View Profile
                </button> */}
                    </div>


                  </div>
                </div>
              </div>
            </div>
          </div>
        

      
        

        ))
      ) : (
        <h2 className="text-2xl font-bold text-zinc-700  text-center mt-10">No halls found.</h2>

      )}

      </div>
}

  
{/* 
      {
        showModal &&
              
        <div class="bg-slate-800 bg-opacity-50 flex justify-center items-center absolute top-0 right-0 bottom-0 left-0">
            <div class="bg-white px-16 py-14 rounded-md text-center">
              <h1 class="text-xl mb-4 font-bold text-slate-500">Do you Want Delete</h1>
              <button onClick={() => handleDeleteClick(hall._id, hall.name)} class="bg-indigo-500 px-7 py-2 ml-2 rounded-md text-md text-white font-semibold">Ok</button>
              <button onClick={() => setShowModal(false)} class="bg-red-500 px-4 py-2 rounded-md text-md text-white">Cancel</button>
            </div>
          </div>
        
      } */}

{showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg px-8 py-6">
            <h2 className="text-lg font-bold mb-4">
              Are you sure you want to delete {selectedHallName}?
            </h2>
            <div className="flex justify-end">
              <button
                className="mr-2 px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg focus:outline-none"
                onClick={() =>
                  handleDeleteClick(selectedHallId)
                }
              >
                Delete
              </button>
              <button
                className="px-4 py-2 text-white bg-gray-500 hover:bg-gray-600 rounded-lg focus:outline-none"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
        </>
  );
  
};

export default HallsAdmin;
