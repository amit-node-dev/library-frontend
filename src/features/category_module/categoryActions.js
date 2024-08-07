import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import apiClient from "../../utils/apiClient";

// GET ALL CATEGORY LIST
export const getAllCategoryList = createAsyncThunk(
  "categories/getAllCategoryList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/categories`);
      if (response.status === 200) {
        return response.data.data;
      }
    } catch (error) {
      if (error.response) {
        const errorMsg = error.response.data.message;
        toast.error(`${errorMsg}`);
        return error.response.data;
      } else {
        toast.error("Failed to fetch categories");
        return rejectWithValue(error.message);
      }
    }
  }
);
