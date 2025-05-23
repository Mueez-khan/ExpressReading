import { configureStore } from '@reduxjs/toolkit'
import rootReducer from '../reducer/reducers'

export const store = configureStore({
  reducer: rootReducer
})