import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import apiClient from "../../utils/apiClient";

// ADD NEW BORROW RECORD OF BOOKS
export const addNewBorroRecord = createAsyncThunk(
  "borrowRecords/addNewBorroRecord",
  async (borrowRecordData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        `/borrowing_records/add_borrow_records`,
        borrowRecordData
      );
      if (response.status === 201) {
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

// GET BORROW RECORD STATUS
export const getBorrowBookRecordStatus = createAsyncThunk(
  "borrowRecords/getBorrowBookRecordStatus",
  async (borrowData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        `/borrowing_records/get_borrow_status`,
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
export const getBorroRecordById = createAsyncThunk(
  "borrowRecords/getBorroRecordById",
  async (bookId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/borrowing_records/${bookId}`);
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
        `/borrowing_records/return_borrow_records`,
        returnRecordData
      );
      if (response.status === 201) {
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

// GET ALL BOOKS LIST
export const getAllBorroRecordList = createAsyncThunk(
  "borrowRecords/getAllBorroRecordList",
  async ({ page = 1, pageSize = 5 }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/books`, {
        params: { page, pageSize },
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
