import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";

import userReducer from "../features/user_module/userSlice";
import roleReducer from "../features/role_module/roleSlice";
import bookReducer from "../features/book_module/bookSlice";
import authorReducer from "../features/author_module/authorSlice";
import categoryReducer from "../features/category_module/categorySlice";
import borrowRecordReducer from "../features/borrowRecord_module/borrowRecordSlice";
import reservationReducer from "../features/reservation_module/reservationSlice";
import penaltiesReducer from "../features/penalties_module/penaltiesSlice";

// Combine reducers
const rootReducer = combineReducers({
  users: userReducer,
  roles: roleReducer,
  books: bookReducer,
  authors: authorReducer,
  categories: categoryReducer,
  borrowRecords: borrowRecordReducer,
  reservations: reservationReducer,
  penalties: penaltiesReducer,
});

// Create and export the store
export const store = configureStore({
  reducer: rootReducer,
});
