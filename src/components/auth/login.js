import axios from 'axios';
import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingSpinner from '../LoadingSpinner';
import { UserContext } from '../../App';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authStatus, setAuthStatus] = useState('');
  const [isLoading, setLoading] = useState(false);
  const { dispatch } = useContext(UserContext);

  useEffect(() => {
    toast.info(
      `Use test credentials:\n\n` +
      `- **Faculty**\nLogin ID: bhuvesh357@gmail.com\nPassword: 1234566789\n\n` +
      `- **HOD**\nLogin ID: kaushal@gmail.com\nPassword: 123456789\n\n` +
      `- **Admin**\nLogin ID: adminuser\nPassword: adminpassword`, {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      }
    );
  }, []);
  
  const login = async (e) => {
  
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/login`, { email, password }, {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
      });

      const data = response.data;
      localStorage.setItem('jwttoken', response.data.token);
      dispatch({ type: "USER", payload: true });

      const userType = response.data.user.userType;
      dispatch({ type: "USERTYPE", payload: userType });
      
      localStorage.setItem("userId", response.data.user._id);

      toast.success("Login Successful");
      setLoading(false);
      navigate("/halls");

    } catch (error) {
      setLoading(false);
      if (error.response) {
        setAuthStatus(error.response.data.error);
      } else {
        setAuthStatus("Something Went Wrong");
      }
    }
  };

  return (
    <>
      {isLoading ? <LoadingSpinner /> : (
        <section className="text-gray-600 body-font my-10 min-h-screen flex items-center justify-center bg-white">
          <div className="lg:w-2/6 md:w-1/2 my-10 bg-white shadow-2xl shadow-blue-200 rounded-lg p-8 flex flex-col md:ml-auto md:mr-auto mt-10 md:mt-0">
            <form onSubmit={login}>
              <h3 className="text-amber-900 font-sans font-extrabold text-4xl mb-8">
                Sign <span className="text-gray-400">In</span>
              </h3>
              <div className="flex flex-col mb-4">
                <label htmlFor="email" className="text-gray-600 font-bold text-sm mb-2">EMAIL</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="max-w-screen-lg h-10 bg-white border rounded focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
              <div className="relative mb-4">
                <label htmlFor="password" className="leading-7 block uppercase tracking-wide text-gray-700 text-xs font-bold">Password</label>
                <input
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
              <div className="my-4">
                <p className="text-s text-red-600 font-bold">{authStatus}</p>
              </div>
              <div className="mx-auto w-fit">
                <button
                  type="submit"
                  className="text-white bg-indigo-600 shadow focus:shadow-outline focus:outline-none border-0 py-2 px-10 font-bold hover:bg-indigo-800 rounded text-lg"
                >
                  Sign In
                </button>
              </div>
              <div className="mt-4 text-center">
                <p className="text-m">
                  Don't have an account?
                  <Link to="/signup" className="text-blue-600 hover:underline"> Create</Link>
                </p>
              </div>
            </form>
          </div>
        </section>
      )}
    </>
  );
}

export default Login;
