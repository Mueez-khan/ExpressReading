import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import {setToken  , setUser} from "../redux/slices/authSlice"; 
import {  useNavigate } from 'react-router-dom';
import sideImage from "../assets/register.jpg"

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [loading , setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
   
  };

  const redirectToRegister = (e) =>{
    e.preventDefault();
    navigate("/register")
  }

  const redirectToResetPassword = (e) =>{
    e.preventDefault();
    navigate("/forgotPassword")
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        setLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_URL}/login`, formData);
      const { token } = response.data;


    
      console.log("Response" , response);
      
      console.log(response.data.user);
      dispatch(setToken(token));
      dispatch(setUser(response.data.user));
      console.log("Response" , response.data.user);
      navigate("/");

      // Redirect or show success message
    } catch (error) {
      setLoading(false)
      console.log(error);
      setError(error.response.data.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 text-white ">
      <form
       
        className="w-full max-w-lg  p-8 rounded shadow-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Login</h2>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <div className="mb-4">
          <label className="block text-gray-600 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none"
          />
        </div>

        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          {loading ? "Wait ..." : "Login"}
        </button>
      <div className="mt-2">
        <span className="text-black">Do you not have a account ? </span>
        <button className="text-blue-800" onClick={redirectToRegister}>
           Register
        </button>
      </div>
      <div className="mt-2">
        <span className="text-black">Do you forgot password ?  </span>
        <button className="text-blue-800" onClick={redirectToResetPassword}>
           Reset Password
        </button>
      </div>
      </form>
      <div>
      <img className='w-[650px] mt-6 h-[500px] hidden lg:block rounded-md ml-4' src={sideImage}></img>
            </div>
    </div>
  );
};

export default Login;
