import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "../slices/authSlice";
import postSlice from "../slices/postSlice";

const rootReducer = combineReducers({

    auth : authSlice ,
    // post : postSlice

})


export default rootReducer;