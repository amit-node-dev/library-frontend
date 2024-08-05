import { createSlice } from "@reduxjs/toolkit";
import { getAllCategoryList } from "./categoryActions";

const initialState = {
  categories: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCategoryList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllCategoryList.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(getAllCategoryList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default categorySlice.reducer;
