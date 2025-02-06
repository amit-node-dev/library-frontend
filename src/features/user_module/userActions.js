import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import apiClient from "../../utils/apiClient";

// REGISTER USER
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/auth/register-user`, userData);
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
        toast.error("Failed to register user");
        return rejectWithValue(error.message);
      }
    }
  }
);

// LOGIN USER
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/auth/login`, {
        email,
        password,
      });
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
        toast.error("Failed to login user");
        return rejectWithValue(error.message);
      }
    }
  }
);

// SEND OTP
export const sendOTP = createAsyncThunk(
  "auth/sendOTP",
  async (mobileNumber, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/auth/send-otp`, {
        mobileNumber: mobileNumber,
      });
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
        toast.error("Failed to send otp");
        return rejectWithValue(error.message);
      }
    }
  }
);

// VERIFY OTP
export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/auth/verify-otp`, userData);
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
        toast.error("Failed to send otp");
        return rejectWithValue(error.message);
      }
    }
  }
);

// ADD USERS
export const addUser = createAsyncThunk(
  "users/addUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/users/add_users`, userData);
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

// GET ALL LIST OF USERS
export const getAllUsersList = createAsyncThunk(
  "users/getAllUsersList",
  async (
    { page = 1, pageSize = 10, searchQuery = "", selectedRole = "" },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.get(`/users`, {
        params: {
          page,
          pageSize,
          search: searchQuery,
          role: selectedRole,
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
        toast.error("Failed to fetch user list");
        return rejectWithValue(error.message);
      }
    }
  }
);

// GET USER BY ID
export const getUserById = createAsyncThunk(
  "users/getUserById",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/users/${userId}`);
      if (response.status === 200) {
        return response.data;
      } else {
        toast.error(response.data.message);
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        const errorMsg = error.response.data.message;
        toast.error(`${errorMsg}`);
        return error.response.data;
      } else {
        toast.error("Failed to fetch user data");
        return rejectWithValue(error.message);
      }
    }
  }
);

// UPDATE USER
export const updateUsers = createAsyncThunk(
  "users/updateUsers",
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/users/${userId}`, userData);
      if (response.status === 200) {
        toast.success(response.data.message);
        return response.data;
      } else {
        toast.error(response.data.message);
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        const errorMsg = error.response.data.message;
        toast.error(`${errorMsg}`);
        return error.response.data;
      } else {
        toast.error("Failed to update user");
        return rejectWithValue(error.message);
      }
    }
  }
);

// DELETE USER
export const deleteUsers = createAsyncThunk(
  "users/deleteUsers",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/users/${userId}`);
      if (response.status === 200) {
        toast.success(response.data.message);
        return userId;
      } else {
        toast.error(response.data.message);
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        const errorMsg = error.response.data.message;
        toast.error(`${errorMsg}`);
        return error.response.data;
      } else {
        toast.error("Failed to delete user");
        return rejectWithValue(error.message);
      }
    }
  }
);

// CURRENT USER POINTS
export const currentUserPoints = createAsyncThunk(
  "users/currentUserPoints",
  async ({ email, userId }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/users/get-points`, {
        email,
        userId,
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      if (error.response) {
        const errorMsg = error.response.data.message;
        toast.error(`${errorMsg}`);
        return error.response;
      } else {
        toast.error("Failed to login user");
        return rejectWithValue(error.message);
      }
    }
  }
);
