import { useState } from "react";
import axios from "axios";


const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
  });


  const [error, setError] = useState(null);
  const [loading , setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
   
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
        setLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_URL}/forgotPassword`, formData);
    
      console.log("Response" , response);
      

      setLoading(false)

      // Redirect or show success message
    } catch (error) {
      setLoading(false)
      console.log(error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 ">
      <form
       
        className="w-full max-w-lg  p-8 rounded shadow-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-700">FORGOT PASSWORD</h2>
        {error && <p className="text-red-500">{error}</p>}

        <div className="mb-4 mt-3">
          <label className="block text-gray-600 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="ENTER YOUR EMAIL"
            className="w-full px-3 py-2 text-black border border-gray-300 rounded-md focus:outline-none"
          />
        </div>

        

        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          {loading ? "Sending..." : "Send Reset Password link"}
        </button>
    
      </form>
     
    </div>
  );
};

export default ForgotPassword;
