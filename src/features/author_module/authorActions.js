import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// REGISTER NEW USER
export const addNewAuthors = createAsyncThunk(
  "authors/addNewAuthors",
  async (authorsData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/v1/authors/add_authors`,
        authorsData
      );
      console.log("ADD NEW AUTHORS RESPONSE ::: ", response.data);
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
        toast.error("Failed to add authors");
        return rejectWithValue(error.message);
      }
    }
  }
);

export const getAllAuthorsList = createAsyncThunk(
  "authors/getAllAuthorsList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/authors`);
      if (response.status === 200) {
        return response.data.data;
      }
    } catch (error) {
      if (error.response) {
        const errorMsg = error.response.data.message;
        toast.error(`${errorMsg}`);
        return error.response;
      } else {
        toast.error("Failed to get authors list");
        return rejectWithValue(error.message);
      }
    }
  }
);

export const getAuthorsById = createAsyncThunk(
  "authors/getAuthorsById",
  async (authorId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/authors/${authorId}`
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
        toast.error("Failed to get authors by id");
        return rejectWithValue(error.message);
      }
    }
  }
);

export const updateAuthors = createAsyncThunk(
  "authors/updateAuthors",
  async ({ authorId, authorsData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/v1/authors/${authorId}`,
        authorsData
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
        toast.error("Failed to update authors");
        return rejectWithValue(error.message);
      }
    }
  }
);

export const deleteAuthors = createAsyncThunk(
  "authors/deleteAuthors",
  async (authorId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/v1/authors/${authorId}`
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
        toast.error("Failed to delete authors");
        return rejectWithValue(error.message);
      }
    }
  }
);
