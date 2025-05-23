import React from 'react';
import { User, GraduationCap, Book } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const Fellow = ({ fellows }) => {


    const navigate = useNavigate();
    const getId = () =>{
        console.log("Id" , fellows._id)
        navigate(`/user/${fellows._id}`)
    }

  return (
    <div className="m-4 ">
      <div className="">
        <div  className="shadow-lg  hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col items-center bg-gray-200 rounded-lg">
          <div className="relative">
            <img 
                onClick={getId}
              className="w-40 h-40 object-cover rounded-full border-4 border-blue-500 shadow-md" 
              src={fellows.userImage} 
              alt={`${fellows.firstName} ${fellows.lastName}`}
            />
          </div>
          
          <div className="text-center mt-4">
            <h2 onClick={getId} className="text-2xl font-bold text-gray-800 flex">
          <User className='mt-2 mr-2' size={20} />
              {fellows.firstName} {fellows.lastName}
            </h2>
            
            <div className="mt-4 space-y-2 text-gray-600">
              <div className="flex items-center justify-center space-x-2">
                <GraduationCap className="w-5 h-5 text-blue-500" />
                <p className="text-sm">{fellows.studMajor}</p>
              </div>
              
              <div className="flex items-center justify-center space-x-2">
                <Book className="w-5 h-5 text-green-500" />
                <p className="text-sm">
                <span className='mr-2'> Reading Experience  </span>
                { fellows.readingExperience} years
                </p>
              </div>
            </div>
          </div>
        </div>

        </div>
        </div>
  );
};

export default Fellow;
