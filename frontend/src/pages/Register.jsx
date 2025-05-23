import  { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Phone, User, Calendar, GraduationCap, Briefcase } from 'lucide-react';
import image from "../assets/register.jpg"

const Register = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    readingExperience: '',
    studMajor: '',
    dateOfBirth: '',
    profession: '',
    password: '',
    confirmPassword: '',
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const redirectToLogin = () => {
    navigate("/login");
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {

      if(userData.firstName == '' || userData.lastName == ''){
        alert("Please fill all fields")
      }

      const response = await axios.post(`${import.meta.env.VITE_URL}/otp`, { email: userData.email });
      console.log("Otp response", response);
      setOtpSent(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_URL}/register`, { ...userData, otp });
      console.log(response);
      console.log("User registered: ", response.data);
      console.log(response.data.message);
      alert(response.data.message);
      navigate("/login");
    } catch (error) {
      console.log(error);
      alert(`Error occur ${error.response.data.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Form Section */}
        <div className="w-full md:w-1/2 p-6 md:p-10">
          <h2 className="text-[28px] font-bold mb-6 text-center text-gray-800">Connect Through Stories✨</h2>
          
          {!otpSent ? (
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={userData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={userData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={userData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="tel"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={userData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="relative">
                <div className="flex items-center mb-2">
                  <span className="text-sm text-red-500 mr-2">*</span>
                  <span className="text-gray-600">Reading Experience (Years)</span>
                </div>
                <input
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="number"
                  name="readingExperience"
                  placeholder="How much reading experience do you have?"
                  value={userData.readingExperience}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    name="studMajor"
                    placeholder="University/College Subject"
                    value={userData.studMajor}
                    onChange={handleChange}
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="date"
                    name="dateOfBirth"
                    placeholder="Date of Birth"
                    value={userData.dateOfBirth}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  name="profession"
                  placeholder="Student or Working Professional?"
                  value={userData.profession}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={userData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={userData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <button
                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300"
                onClick={handleRegister}
              >
                Send OTP
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-center text-gray-800">Enter OTP</h2>
              <input
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button
                className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition duration-300"
                onClick={handleVerifyOtp}
              >
                Verify OTP & Register
              </button>
            </div>
          )}

          <div className="text-center mt-4">
            <span className="text-gray-600">Already have an account? </span>
            <button 
              className="text-blue-600 hover:underline"
              onClick={redirectToLogin}
            >
              Login
            </button>
          </div>
        </div>

        {/* Image Section */}
        <div 
          className="hidden md:block w-1/2 bg-cover bg-center relative overflow-hidden">
            <img className='h-full' src={image} />
          </div>
      </div>
    </div>
  );
};

export default Register;