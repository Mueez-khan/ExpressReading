import axios from "axios";
import Fellow from "../../components/FellowCommponents/Fellow";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";


export default function FellowsPage() {




  const navigate = useNavigate();
  const [myFellow, setMyFellow] = useState();

  const getFellows = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8000/api/v1/friend/myFriends`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log("Request ", response);
      setMyFellow(response.data.data || []);
    } catch (err) {
      console.log("Error while accepting friend request", err);
    }
  };
  useEffect(() => {
    getFellows();
  }, []);

  const navigateToFellowRequests = () =>{
    navigate("/fellowRequests")
  }
  const navigateToFellows = () =>{
    navigate("/fellows")
  }

 

  return (
    <>
      <div className="bg-gray-600 h-screen">
        <div className="flex ml-2">
          <button onClick={navigateToFellows} className="w-20 h-10 bg-blue-600 rounded m-3 font-semibold text-white">
            Fellows
          </button>
          <button onClick={navigateToFellowRequests} className="w-36 h-10 bg-blue-600 rounded m-3 font-semibold text-white">
            Fellows Requests
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 space-x-3 bg-gray-600 ">
          {myFellow?.friends?.map((friend) => (
            <Fellow key={friend._id} fellows={friend} />
          ))}
        </div>
      </div>
    </>
  );
}
