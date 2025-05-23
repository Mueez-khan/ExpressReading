import { useState , useEffect } from "react"
import axios from "axios"
import FellowRequestsComponent from "../../components/FellowCommponents/FellowRequestsComponent";



export default function FellowRequests() {


    const [fellow , setFellowRequests ] = useState();



    const getFellowRequests = async  () =>{

        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
              `http://localhost:8000/api/v1/friend/fellowRequests`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
      
            console.log("Request ", response);
            setFellowRequests(response.data || []);
          } catch (err) {
            console.log("Error while accepting friend request", err);
          }

    }

    useEffect(() =>{

        getFellowRequests();

    } , [])

    console.log("FellowRequest" , fellow)


  return (
    <div className="bg-gray-600 h-screen">
      
    {
        fellow  == [] ? "No Request" :
         <div className="grid grid-cols-1 md:grid-cols-3 space-x-3 bg-gray-600 ">
         {fellow?.data?.map((request) => (

            <FellowRequestsComponent key={request._id} fellowRequest = {request.senderId} />

        ))}
        </div>
    }

    </div>
  )
}
