import React, { useContext } from 'react';
import logo from '../images/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../App';

function Navbar() {
  const navigate = useNavigate();
  const {state}=useContext(UserContext)

 const RenderUser=()=>{
  if (state.userType==="admin"){
    return(
      <Link to='/bookings'>Booking</Link>
    )
  }
  else if(state.userType==='faculty'){
    return (
      <Link to='/bookings'>Bookings</Link>
    )
  }
  else{
    return (
      <Link to='/bookings'>Bookings</Link>
    )
  }
 }
 const RenderMenu = () => {

  if (state.user) {
      
    return (
      <>

        {/* <Link to="/logout" className="mr-5 hover:text-gray-900">Logout</Link> */}
        <Link to="/logout">
          <button  className="w-full rounded-xl border-2 border-rose-500 bg-white px-3 py-2 font-semibold text-rose-500 hover:bg-rose-500 hover:text-white">Logout</button>
        </Link>
      </>
    )
  } else {

    return (

      <>
      
        <Link to="/login">
          <button className="w-full rounded-xl border-2 border-rose-700 bg-white px-3 py-2 font-semibold text-rose-700 hover:bg-rose-700 hover:text-white">Sign In / Sign Up</button>
        </Link>
      
      </>
    )
  }
}

  return (
    <div>
      <nav className="flex items-center justify-between p-4 bg-white">
        <div>
          {/* Logo Div */}
          <img className="w-auto h-14" src={logo} alt="logo" />
        </div>
        <div>
          {/* Links Div */}
          <ul className="flex space-x-4 text-gray-700">
            <li className="hover:text-gray-600 px-4 hover:underline cursor-pointer text-lg">
              <Link to="/">Home</Link>
            </li>
           
            <li className="hover:text-gray-600 px-4 cursor-pointer text-lg">
              <Link to="/events">Event</Link>
            </li>
            <li className="hover:text-gray-600 px-4 cursor-pointer text-lg">
              <Link to="/contacts">Contact</Link>
            </li>
            <li className="hover:text-gray-600 px-4 cursor-pointer text-lg">
              <Link to="/calendar">Calendar</Link>
            </li>
            <li>
              <RenderUser/>
            </li>
            <li className="hover:text-gray-600 px-4 cursor-pointer text-lg">
              <Link to="/profile">Profile</Link>
            </li>
          </ul>
        </div>
        <div>
          {/* Sign In/Sign Up */}
        <RenderMenu/>
        </div>
      </nav>
      <hr className="border-t-2 gray-700 mt-4" />
    </div>
  );
}

export default Navbar;
