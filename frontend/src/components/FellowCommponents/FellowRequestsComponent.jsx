import { useState } from 'react';
import { User, GraduationCap, Book } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function FellowRequestsComponent({fellowRequest}) {


    const navigate = useNavigate();
    const [isRequestAccepted , setIsRequestAccepted] = useState();

    const getId = () =>{
      console.log("Id" , fellowRequest._id)
      // navigate(`/user/${fellowRequest._id}`)
  }


  const acceptRequest = async () =>{


    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:8000/api/v1/friend/acceptRequest/${fellowRequest._id}`,
        {}, // This is required because Axios expects a body for a POST request
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Request ", response);
      setIsRequestAccepted(true);
    } catch (err) {
      console.log("Error while sending friend request", err);
    }

  }
  const rejectRequest = async () =>{


    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:8000/api/v1/friend/acceptRequest/${fellowRequest._id}`,
        {}, // This is required because Axios expects a body for a POST request
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Request ", response);
      setIsRequestAccepted(true);
    } catch (err) {
      console.log("Error while sending friend request", err);
    }

  }






  return (
    <div>


    <div>
    <div className="m-4 ">
      <div className="">
        <div  className="shadow-lg  hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col items-center bg-gray-200 rounded-lg">
          <div className="relative">
            <img 
                onClick={getId}
              className="w-40 h-40 ml-3 object-cover rounded-full border-4 border-blue-500 shadow-md" 
              src={fellowRequest.userImage} 
              alt={`${fellowRequest.firstName} ${fellowRequest.lastName}`}
            />
          </div>
          
          <div className="text-center mt-4 ml-4">
            <h2 onClick={getId} className="text-2xl font-bold text-gray-800 flex">
          <User className='mt-2 mr-2 ml-4' size={20} />
              {fellowRequest.firstName} {fellowRequest.lastName}
            </h2>
            
            <div className="mt-4 space-y-2 text-gray-600">
              <div className="flex items-center justify-center space-x-2">
                <GraduationCap className="w-5 h-5 text-blue-500" />
                <p className="text-sm">{fellowRequest.studMajor}</p>
              </div>
              
              <div className="flex items-center justify-center space-x-2">
                <Book className="w-5 h-5 text-green-500" />
                <p className="text-sm">
                <span className='mr-2'> Reading Experience  </span>
                { fellowRequest.readingExperience} years
                </p>
              </div>
               <div className='pt-4 flex flex-col lg:flex-row '>
               <button onClick={acceptRequest} className='bg-green-600 w-28 h-12 rounded font-semibold text-white  lg:mt-2'>
               {isRequestAccepted ? "Fellow" : "Accept"}
                </button>
                <button className={` ${isRequestAccepted ? "hidden" : "block"} bg-red-600 w-28 h-12 rounded font-semibold text-white  lg:ml-2 mt-2`}>
                  Reject
                </button>
               </div>
            </div>
          </div>
        </div>

        </div>
        </div>
    </div>
      
    </div>
  )
}
