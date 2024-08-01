import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";

import userReducer from "../features/user_module/userSlice";
import bookReducer from "../features/book_module/bookSlice";
import authorReducer from "../features/author_module/authorSlice";

// Combine reducers
const rootReducer = combineReducers({
  users: userReducer,
  books: bookReducer,
  authors: authorReducer,
});

// Create and export the store
export const store = configureStore({
  reducer: rootReducer,
});
