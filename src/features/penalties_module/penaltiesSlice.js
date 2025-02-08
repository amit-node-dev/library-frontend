import { createSlice } from "@reduxjs/toolkit";
import { getAllPenaltiesList } from "./penaltiesAction";

const initialState = {
  penalties: [],
  loading: false,
  error: null,
  total: 0,
  page: 1,
  pageSize: 10,
};

const penaltiesSlice = createSlice({
  name: "penalties",
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

      .addCase(getAllPenaltiesList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllPenaltiesList.fulfilled, (state, action) => {
        state.loading = false;
        state.penalties = action.payload.items;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(getAllPenaltiesList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, setPageSize } = penaltiesSlice.actions;

export default penaltiesSlice.reducer;
