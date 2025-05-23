import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  token : localStorage.getItem("token") ||  null,
  user:localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")):null,

}

export const userAuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state , action) => {
      

      
        state.token = action.payload;
        localStorage.setItem("token", action.payload);
      
    },
    setUser :  (state , action) =>{
      state.user = action.payload;
      localStorage.setItem("user" , JSON.stringify(action.payload));
    },
    logOut: (state ) => {
      state.token = null; // Clear the token
      state.user = null; // Clear the user
      localStorage.removeItem("token"); // Remove token from local storage
      localStorage.removeItem("user"); // Remove user from local storage
    },
    
  },
})

// Action creators are generated for each case reducer function
export const { setToken , setUser , logOut } = userAuthSlice.actions

export default userAuthSlice.reducer