import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import apiClient from "../../utils/apiClient";

// ADD NEW BOOKS
export const addNewBooks = createAsyncThunk(
  "books/addNewBooks",
  async (bookData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/books/add-book`, bookData);
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
export const getAllBooksList = createAsyncThunk(
  "books/getAllBooksList",
  async (
    {
      page = 1,
      pageSize = 10,
      searchQuery = "",
      selectedCategory = "",
      selectedAuthor = "",
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.get(`/books`, {
        params: {
          page,
          pageSize,
          search: searchQuery,
          category: selectedCategory,
          author: selectedAuthor,
        },
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

// GET BOOKS BY ID
export const getBooksById = createAsyncThunk(
  "books/getBooksById",
  async (bookId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/books/${bookId}`);
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

// UPDATE BOOKS
export const updateBooks = createAsyncThunk(
  "books/updateBooks",
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
export const deleteBooks = createAsyncThunk(
  "books/deleteBooks",
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
