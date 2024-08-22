import React, { createContext, useReducer } from 'react';
import './App.css';
import Navbar from './components/navbar';
import Signup from './components/auth/signup';
import Login from './components/auth/login';
import Halls from './components/halls/Halls';
import Bookingforms from './components/bookings/bookingforms';
import VerifySuccess from './components/auth/verifySucess';
import BookingFaculty from './components/bookings/bookingFaulty.js';
import BookingsView from './components/bookings/bookingview.js';
import HallsAdmin from './components/halls/Hallsadmin.js';
import HallsEdit from './components/halls/halledit.js';
import { CalendarView } from './components/Calendar.js';
import Events from './components/bookings/events.js';
import About from './About';
import Footer from './components/Footer.js';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {  reducers } from './reducers/authreducers';
import axios from 'axios';
import Logout from './components/auth/logout';
import { initialState } from './reducers/authreducers';
import BookingUpdateForm from './components/bookings/bookingUpdateform.js';
import HallForm from './components/halls/hallForm.js';
import AdminDashboard from './components/dashboard/AdminDashBoard.js';
import FacultyDashboard from './components/dashboard/FacultyDashboard.js';
import HodDashboard from './components/dashboard/HodDashboard.js';
import Contact from './components/Contact.js';
import Unauthorized from './components/Unauthorized.js';
import BookingsAdmin from './components/bookings/bookingsAdmin.js';
import BookingsHod from './components/bookings/bookingshod.js';
 export const UserContext=createContext()
function App() {
  const token = (localStorage.getItem("jwtoken"));
 // axios.defaults.headers.common['authorization'] = `Bearer ${token}`;
  //axios.defaults.withCredentials = true;

  const [state,dispatch]=useReducer(reducers,initialState)

  return (
    <>
     <UserContext.Provider value={{state,dispatch}}>
      <Navbar />
      <Routes>
      <Route path='/' element={state.userType==='admin'?<AdminDashboard/>:state.userType==='faculty' ?<FacultyDashboard/>:state.userType=='hod' ?<HodDashboard/>:<Login/>} />
      <Route path='/profile' element={<About/>}/>
      <Route path='/contact' element={<Contact/>}/>
      <Route path='/calendar' element={<CalendarView/>} />
         <Route path='/signup' element={<Signup />} />
         <Route path="/login" element={<Login />} />
         <Route path='/logout'  element={<Logout/>}/>
         <Route path='/events' element={<Events/>} />
         <Route path='/verifyemail/:id/:token' element={<VerifySuccess/>} />
         <Route path="/halls" element={state.userType === "admin" ? <HallsAdmin/> : <Halls />}/>
         <Route  exact path='/halledit/:hallId/:name' element={state.userType==="admin"?<HallsEdit/>:<Unauthorized/>}/>
  
  
  <Route  exact path='/bookingsEdit/:bookingId' element={state.userType==='admin'?<BookingUpdateForm/>:state.userType==='hod'?<BookingUpdateForm/>:<Unauthorized/>}/>
  <Route path='hallForm' element={state.userType==='admin'?<HallForm/>:<Unauthorized/>} />
        <Route path='/bookings' element={state.userType==='admin'?<BookingsAdmin/>:state.userType==='hod'?<BookingsHod/> :state.userType==='faculty' ?<BookingFaculty/> :<Unauthorized/>}/>
        <Route exact path='/halls/bookhalls/:hallid/:hallname' element={<Bookingforms/>} />
        <Route path='/bookingsView/:id' element={<BookingsView/>}/>
        
       
       
        
        
        
      </Routes>
        <Footer/>
      </UserContext.Provider>
      <ToastContainer
        position="bottom-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
