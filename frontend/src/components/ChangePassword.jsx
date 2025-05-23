import { useState } from "react";
import axios from "axios";
import {  useNavigate , useParams  } from 'react-router-dom';


const ChangePassword = () => {

  const { token } = useParams(); 

  console.log("TOken" , token)   

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword : ""
  });

  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [loading , setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
   
  };

  const requestData = {

    ...formData,
    token

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
        setLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_URL}/resetPassword`, requestData);
    
      console.log("Response" , response);
      
        navigate("/login")
      // Redirect or show success message
    } catch (error) {
      setLoading(false)
      console.log(error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 text-white ">
      <form
       
        className="w-full max-w-lg  p-8 rounded shadow-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-700">RESET YOUR PASSWORD</h2>

        {error && <p className="text-red-500">{error}</p>}

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
        <div className="mb-4">
          <label className="block text-gray-600 mb-1">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none"
          />
        </div>

        

        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          {loading ? "Updating Password..." : "Reset Password"}
        </button>
    
      </form>
     
    </div>
  );
};

export default ChangePassword;
