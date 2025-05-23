import { useNavigate } from "react-router-dom";



export default function UserInfo() {

    const navigate = useNavigate();



    const redirectToEditProfile = () =>{
    
        navigate("/user/profile"); 
      }


  return (
    <div>

    <div className="w-full lg-w-40 bg-gray-300 rounded-md p-4   ">
  
        <div>

            <div>
                <p><span className="font-bold">BIO</span> : AN Programmer </p>
            </div>
            <div>
                <p><span className="font-bold">Gender</span> : Male</p>
            </div>
            <div>
                <p><span className="font-bold">Last Book</span>: Personal history </p>
            </div>
            <div>
                <p><span className="font-bold">Favorite Writer</span> : Javeed chuadhary </p>
            </div>
            
        <button
        onClick={redirectToEditProfile}
        className=" right-4 mt-2 px-4 py-2 text-white bg-blue-600 rounded-full shadow-md hover:bg-blue-700 transition"
      >
       Edit Profile
      </button>
        </div>


    </div>
      
    </div>
  )
}
