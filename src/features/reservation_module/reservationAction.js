import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import apiClient from "../../utils/apiClient";

// ADD NEW BORROW RECORD OF BOOKS
export const createReservation = createAsyncThunk(
  "reservations/createReservation",
  async (reservationData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        `/reservations/add_reservations`,
        reservationData
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

// GET ALL LIST OF RESERVATIONS
export const getAllReservationList = createAsyncThunk(
  "reservations/getAllReservationList",
  async ({ page = 1, pageSize = 5, status = "" }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/reservations`, {
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
