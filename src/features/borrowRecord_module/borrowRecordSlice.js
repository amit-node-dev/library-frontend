import { createSlice } from "@reduxjs/toolkit";
import {
  addNewBorroRecord,
  getAllBorroRecordList,
  getBorroRecordById,
  updateBorroRecord,
  deleteBorroRecord,
} from "./borrorRecordAction";

const initialState = {
  borrowRecords: [],
  currentBorrowRecord: null,
  loading: false,
  error: null,
  total: 0,
  page: 1,
  pageSize: 5,
};

const borrowRecordSlice = createSlice({
  name: "borrowRecords",
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
      .addCase(addNewBorroRecord.pending, (state) => {
        state.loading = true;
      })
      .addCase(addNewBorroRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.borrowRecords.push(action.payload);
      })
      .addCase(addNewBorroRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getAllBorroRecordList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllBorroRecordList.fulfilled, (state, action) => {
        state.loading = false;
        state.borrowRecords = action.payload.borrowRecords;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(getAllBorroRecordList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getBorroRecordById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBorrowRecord = action.payload.data;
      })
      .addCase(getBorroRecordById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateBorroRecord.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBorroRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBorrowRecord = action.payload;
      })
      .addCase(updateBorroRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteBorroRecord.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBorroRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.borrowRecords = state.borrowRecords.filter(
          (book) => book.id !== action.payload
        );
      })
      .addCase(deleteBorroRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, setPageSize } = borrowRecordSlice.actions;

export default borrowRecordSlice.reducer;
