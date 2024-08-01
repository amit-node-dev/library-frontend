import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import apiClient from "../../utils/apiClient";

// ADD NEW AUTHORS
export const addNewAuthors = createAsyncThunk(
  "authors/addNewAuthors",
  async (authorsData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        `/authors/add_authors`,
        authorsData
      );
      console.log("ADD NEW AUTHORS RESPONSE ::: ", response.data);
      if (response.status === 201) {
        toast.success(response.data.message);
        return response.data;
      }
    } catch (error) {
      if (error.response) {
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
        toast.error("Failed to add authors");
        return rejectWithValue(error.message);
      }
    }
  }
);

// GET ALL AUTHORS LIST
export const getAllAuthorsList = createAsyncThunk(
  "authors/getAllAuthorsList",
  async ({ page, pageSize }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/authors`, {
        params: { page, pageSize },
      });
      if (response.status === 200) {
        return response.data.data;
      }
    } catch (error) {
      toast.error("Failed to fetch authors list");
      return rejectWithValue(error.message);
    }
  }
);

// GET AUTHOR BY ID
export const getAuthorsById = createAsyncThunk(
  "authors/getAuthorsById",
  async (authorId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/authors/${authorId}`);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      if (error.response) {
        const errorMsg = error.response.data.message;
        toast.error(errorMsg);
        return error.response.data;
      } else {
        toast.error("Failed to fetch author by ID");
        return rejectWithValue(error.message);
      }
    }
  }
);

// UPDATE AUTHORS
export const updateAuthors = createAsyncThunk(
  "authors/updateAuthors",
  async ({ authorId, authorsData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/authors/${authorId}`, authorsData);
      if (response.status === 200) {
        toast.success(response.data.message);
        return response.data;
      }
    } catch (error) {
      if (error.response) {
        const errorMsg = error.response.data.message;
        toast.error(errorMsg);
        return error.response.data;
      } else {
        toast.error("Failed to update author");
        return rejectWithValue(error.message);
      }
    }
  }
);

// DELETE AUTHORS
export const deleteAuthors = createAsyncThunk(
  "authors/deleteAuthors",
  async (authorId, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/authors/${authorId}`);
      if (response.status === 200) {
        toast.success(response.data.message);
        return response.data;
      }
    } catch (error) {
      if (error.response) {
        const errorMsg = error.response.data.message;
        toast.error(errorMsg);
        return error.response.data;
      } else {
        toast.error("Failed to delete author");
        return rejectWithValue(error.message);
      }
    }
  }
);
