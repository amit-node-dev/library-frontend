import { createSlice } from "@reduxjs/toolkit";
import {
  addNewBooks,
  getAllBooksList,
  getBooksById,
  updateBooks,
  deleteBooks,
} from "./bookActions";

const initialState = {
  books: [],
  currentBook: null,
  loading: false,
  error: null,
  total: 0,
  page: 1,
  pageSize: 10,
};

const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
    setPageSize(state, action) {
      state.pageSize = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
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

      .addCase(getAllBooksList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllBooksList.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload.items;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(getAllBooksList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getBooksById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBook = action.payload.data;
      })
      .addCase(getBooksById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

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

export const { setPage, setPageSize } = bookSlice.actions;

export default bookSlice.reducer;
