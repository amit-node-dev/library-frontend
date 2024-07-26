import { createSlice } from "@reduxjs/toolkit";

// ACTIONS IMPORT
import {
  addNewBooks,
  getAllBooksList,
  getBooksById,
  updateBooks,
  deleteBooks,
} from "./bookActions";

// INITAILS STATE
const initialState = {
  books: [],
  currentBook: null,
  loading: false,
  error: null,
};

// BOOK SLICE
const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle addNewBooks actions
      .addCase(addNewBooks.pending, (state) => {
        state.loading = true;
      })
      .addCase(addNewBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books.push(action.payload);
      })
      .addCase(addNewBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle getAllBooksList actions
      .addCase(getAllBooksList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllBooksList.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(getAllBooksList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle getBooksById actions
      .addCase(getBooksById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBook = action.payload.data;
      })
      .addCase(getBooksById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle updateBooks actions
      .addCase(updateBooks.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBook = action.payload;
      })
      .addCase(updateBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle deleteBooks actions
      .addCase(deleteBooks.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = state.books.filter((book) => book.id !== action.payload);
      })
      .addCase(deleteBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default bookSlice.reducer;
