import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  likes : 0,
  comments : 0,

}

export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setLikes: (state , action) => {
      
        state.likes = action.payload;

      
    },
    incrementLike : (state ) =>  {

        state.likes = state.likes + 1;

    }, 
    setDislike :  (state ) =>{
      state.likes = state.likes - 1;
    },
    setComments :  (state , action) =>{
      state.comments = action.payload;
    },
    setDeleteComments :  (state , action) =>{
      state.comments = action.payload;
    },
    
  },
})

// Action creators are generated for each case reducer function
export const { setLikes , setDislike , setComments , setDeleteComments } = postSlice.actions

export default postSlice.reducer