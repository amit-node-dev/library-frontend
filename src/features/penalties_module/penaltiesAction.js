import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import apiClient from "../../utils/apiClient";

// GET ALL PENALTIES LIST
export const getAllPenaltiesList = createAsyncThunk(
  "penalties/getAllPenaltiesList",
  async (
    { page = 1, pageSize = 10, searchQuery = "" },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.get(`/penalties`, {
        params: {
          page,
          pageSize,
          search: searchQuery,
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
