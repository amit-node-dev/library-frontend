import { createSlice } from "@reduxjs/toolkit";

// ACTIONS IMPORT
import {
  addNewAuthors,
  getAllAuthorsList,
  getAuthorsById,
  updateAuthors,
  deleteAuthors,
} from "./authorActions";

// INITAILS STATE
const initialState = {
  authors: [],
  currentAuthor: null,
  loading: false,
  error: null,
};

// AUTHORS SLICE
const authorSlice = createSlice({
  name: "authors",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle addNewAuthors actions
      .addCase(addNewAuthors.pending, (state) => {
        state.loading = true;
      })
      .addCase(addNewAuthors.fulfilled, (state, action) => {
        state.loading = false;
        state.authors.push(action.payload);
      })
      .addCase(addNewAuthors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle getAllAuthorsList actions
      .addCase(getAllAuthorsList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllAuthorsList.fulfilled, (state, action) => {
        state.loading = false;
        state.authors = action.payload;
      })
      .addCase(getAllAuthorsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle getAuthorsById actions
      .addCase(getAuthorsById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAuthor = action.payload.data;
      })
      .addCase(getAuthorsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle updateAuthors actions
      .addCase(updateAuthors.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAuthors.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAuthor = action.payload;
      })
      .addCase(updateAuthors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle deleteAuthors actions
      .addCase(deleteAuthors.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAuthors.fulfilled, (state, action) => {
        state.loading = false;
        state.authors = state.authors.filter(
          (author) => author.id !== action.payload
        );
      })
      .addCase(deleteAuthors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default authorSlice.reducer;
