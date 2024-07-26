import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import userReducer from "../features/user_module/userSlice";
import bookReducer from "../features/book_module/bookSlice";

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  books: bookReducer,
});

// Create and export the store
export const store = configureStore({
  reducer: rootReducer,
});
