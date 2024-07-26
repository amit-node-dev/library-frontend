import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// REGISTER NEW USER
export const addNewBooks = createAsyncThunk(
  "books/addNewBooks",
  async (bookData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/v1/books/add_books`,
        bookData
      );
      console.log("ADD NEW BOOKS RESPONSE ::: ", response.data);
      if (response.status === 201) {
        toast.success(response.data.message);
        return response.data;
      }
    } catch (error) {
      if (error.response) {
        error.response.data.data.forEach((err) => {
          toast.error(`${err.msg}`);
        });
        return error.response;
      } else {
        toast.error("Failed to add user");
        return rejectWithValue(error.message);
      }
    }
  }
);

export const getAllBooksList = createAsyncThunk(
  "books/getAllBooksList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/books`);
      if (response.status === 200) {
        return response.data.data;
      }
    } catch (error) {
      if (error.response) {
        const errorMsg = error.response.data.message;
        toast.error(`${errorMsg}`);
        return error.response;
      } else {
        toast.error("Failed to add user");
        return rejectWithValue(error.message);
      }
    }
  }
);

export const getBooksById = createAsyncThunk(
  "books/getBooksById",
  async (bookId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/books/${bookId}`
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      if (error.response) {
        const errorMsg = error.response.data.message;
        toast.error(`${errorMsg}`);
        return error.response;
      } else {
        toast.error("Failed to add user");
        return rejectWithValue(error.message);
      }
    }
  }
);

export const updateBooks = createAsyncThunk(
  "books/updateBooks",
  async ({ bookId, bookData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/v1/books/${bookId}`,
        bookData
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        return response.data;
      }
    } catch (error) {
      if (error.response) {
        const errorMsg = error.response.data.message;
        toast.error(`${errorMsg}`);
        return error.response;
      } else {
        toast.error("Failed to add user");
        return rejectWithValue(error.message);
      }
    }
  }
);

export const deleteBooks = createAsyncThunk(
  "users/deleteBooks",
  async (bookId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/v1/books/${bookId}`
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        return response.data;
      }
    } catch (error) {
      if (error.response) {
        const errorMsg = error.response.data.message;
        toast.error(`${errorMsg}`);
        return error.response;
      } else {
        toast.error("Failed to add user");
        return rejectWithValue(error.message);
      }
    }
  }
);
