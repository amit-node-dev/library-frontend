import { createSlice } from "@reduxjs/toolkit";
import {
  addNewAuthors,
  getAllAuthorsList,
  getAllAuthorsListPagination,
  getAuthorsById,
  updateAuthors,
  deleteAuthors,
} from "./authorActions";

const initialState = {
  authors: [],
  currentAuthor: null,
  loading: false,
  error: null,
  total: 0,
  page: 1,
  pageSize: 5,
};

const authorSlice = createSlice({
  name: "authors",
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

      .addCase(getAllAuthorsListPagination.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllAuthorsListPagination.fulfilled, (state, action) => {
        state.loading = false;
        state.authors = action.payload.items;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(getAllAuthorsListPagination.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getAllAuthorsList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllAuthorsList.fulfilled, (state, action) => {
        state.loading = false;
        state.authors = action.payload.items;
      })
      .addCase(getAllAuthorsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getAuthorsById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAuthor = action.payload.data;
      })
      .addCase(getAuthorsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

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

export const { setPage, setPageSize } = authorSlice.actions;

export default authorSlice.reducer;
