import { createSlice } from "@reduxjs/toolkit";
import {
  addNewBorrowRecord,
  getAllBorrowRecordList,
  getBorrowRecordById,
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
  pageSize: 10,
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
      // ADD NEW BORROW BOOK
      .addCase(addNewBorrowRecord.pending, (state) => {
        state.loading = true;
      })
      .addCase(addNewBorrowRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.borrowRecords.push(action.payload);
      })
      .addCase(addNewBorrowRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET ALL LIST OF BORROW BOOK RECORD
      .addCase(getAllBorrowRecordList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllBorrowRecordList.fulfilled, (state, action) => {
        state.loading = false;
        state.borrowRecords = action.payload.items;
        state.total = action.payload.totalCount;
        state.page = action.payload.page;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(getAllBorrowRecordList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET BORROW BOOK RECORD BY ID
      .addCase(getBorrowRecordById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBorrowRecord = action.payload.data;
      })
      .addCase(getBorrowRecordById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE BORROW BOOK RECORD
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

      // DELETE BORROW BOOK RECORD
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
