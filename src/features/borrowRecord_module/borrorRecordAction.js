import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import apiClient from "../../utils/apiClient";

// ADD NEW BORROW RECORD OF BOOKS
export const addNewBorrowRecord = createAsyncThunk(
  "borrowRecords/addNewBorrowRecord ",
  async (borrowRecordData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        `/borrow-records/add-borrow-record`,
        borrowRecordData
      );
      if (response.status === 201) {
        toast.success(response.data.message);
        return response.data;
      } else {
        toast.warning(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response);
        const errorMessage = error.response.data.message;

        if (errorMessage === "Access denied") {
          toast.error("You do not have permission to perform this action.");
        } else {
          if (error.response.data.data) {
            error.response.data.data.forEach((err) => {
              toast.error(`${err.msg}`);
            });
          } else {
            toast.error(errorMessage);
          }
        }

        return error.response.data;
      } else {
        toast.error("Failed to add book");
        return rejectWithValue(error.message);
      }
    }
  }
);

// GET BORROW RECORD STATUS
export const getBorrowBookRecordStatus = createAsyncThunk(
  "borrowRecords/getBorrowBookRecordStatus",
  async (borrowData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        `/borrow-records/get-borrow-status`,
        borrowData
      );

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      if (error.response) {
        const errorMsg = error.response.data.message;
        console.log("ERROR MSG ", errorMsg);
        toast.error(`${errorMsg}`);
        return error.response.data;
      } else {
        toast.error("Failed to fetch book details");
        return rejectWithValue(error.message);
      }
    }
  }
);

// GET BOOKS BY ID
export const getBorrowRecordById = createAsyncThunk(
  "borrowRecords/getBorrowRecordById",
  async (recordId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/borrow-records/${recordId}`);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      if (error.response) {
        const errorMsg = error.response.data.message;
        toast.error(`${errorMsg}`);
        return error.response.data;
      } else {
        toast.error("Failed to fetch book details");
        return rejectWithValue(error.message);
      }
    }
  }
);

// RETURN BORROW RECORD OF BOOKS
export const returnBorrowRecord = createAsyncThunk(
  "borrowRecords/returnBorrowRecord",
  async (returnRecordData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        `/borrow-records/return-borrow-record`,
        returnRecordData
      );
      console.log("RRR ::: ", response);
      if (response.status === 200) {
        toast.success(response.data.message);
        return response.data;
      }
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response);
        const errorMessage = error.response.data.message;

        if (errorMessage === "Access denied") {
          toast.error("You do not have permission to perform this action.");
        } else {
          if (error.response.data.data) {
            error.response.data.data.forEach((err) => {
              toast.error(`${err.msg}`);
            });
          } else {
            toast.error(errorMessage);
          }
        }

        return error.response.data;
      } else {
        toast.error("Failed to add book");
        return rejectWithValue(error.message);
      }
    }
  }
);

// GET ALL BORROWED BOOK LIST
export const getAllBorrowRecordList = createAsyncThunk(
  "borrowRecords/getAllBorrowRecordList",
  async ({ page = 1, pageSize = 10, status = "" }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/borrow-records`, {
        params: { page, pageSize, status },
      });

      if (response.status === 200) {
        return response.data.data;
      }
    } catch (error) {
      if (error.response) {
        const errorMsg = error.response.data.message;
        toast.error(`${errorMsg}`);
        return error.response.data;
      } else {
        toast.error("Failed to fetch books");
        return rejectWithValue(error.message);
      }
    }
  }
);

// UPDATE BOOKS
export const updateBorroRecord = createAsyncThunk(
  "borrowRecords/updateBorroRecord",
  async ({ bookId, bookData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/books/${bookId}`, bookData);
      if (response.status === 200) {
        toast.success(response.data.message);
        return response.data;
      }
    } catch (error) {
      if (error.response) {
        const errorMsg = error.response.data.message;
        toast.error(`${errorMsg}`);
        return error.response.data;
      } else {
        toast.error("Failed to update book");
        return rejectWithValue(error.message);
      }
    }
  }
);

// DELETE BOOKS
export const deleteBorroRecord = createAsyncThunk(
  "borrowRecords/deleteBorroRecord",
  async (bookId, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/books/${bookId}`);
      if (response.status === 200) {
        toast.success(response.data.message);
        return response.data;
      }
    } catch (error) {
      if (error.response) {
        const errorMsg = error.response.data.message;
        toast.error(`${errorMsg}`);
        return error.response.data;
      } else {
        toast.error("Failed to delete book");
        return rejectWithValue(error.message);
      }
    }
  }
);
