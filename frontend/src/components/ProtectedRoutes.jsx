import { Navigate, Outlet } from "react-router-dom"
import { useSelector } from "react-redux";

export default function ProtectedRoutes() {


    const isAuthorized = useSelector(state => state.auth.token);
    const isUserPresent = useSelector(state => state.auth.user);
    // return isAuthorized ? <Outlet/> : <Navigate to="/login"/>
    if(isAuthorized && isUserPresent){
        return <Outlet/>
    }
    else{
        return <Navigate to="/login"/>
    }

}