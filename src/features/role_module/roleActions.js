import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// CUSTOM API COMPONENTS
import apiClient from "../../utils/apiClient";

// ADD ROLES
export const addRole = createAsyncThunk(
  "roles/addRole",
  async (roleData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/roles/add_roles`, roleData);
      if (response.status === 201) {
        toast.success(response.data.message);
        return response.data;
      }
    } catch (error) {
      if (error.response) {
        const errorResponse = error.response.data;

        if (errorResponse.statusType && errorResponse.message) {
          toast.error(`${errorResponse.message}`);
        }

        if (errorResponse.data && Array.isArray(errorResponse.data)) {
          errorResponse.data.forEach((err) => {
            toast.error(`${err.msg}`);
          });
        } else if (errorResponse.message) {
          toast.error(`${errorResponse.message}`);
        } else {
          toast.error("An error occurred while adding the role");
        }

        return errorResponse;
      } else {
        toast.error("Failed to add role");
        return rejectWithValue(error.message);
      }
    }
  }
);

// GET ALL LIST OF ROLES
export const getAllRolesList = createAsyncThunk(
  "roles/getAllRolesList",
  async ({ page = 1, pageSize = 5 }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/roles`, {
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
        toast.error("Failed to fetch roles list");
        return rejectWithValue(error.message);
      }
    }
  }
);

export const getRoleById = createAsyncThunk(
  "roles/getRoleById",
  async (roleId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/roles/${roleId}`);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      if (error.response) {
        const errorMsg = error.response.data.message;
        toast.error(`${errorMsg}`);
        return error.response.data;
      } else {
        toast.error("Failed to fetch role data");
        return rejectWithValue(error.message);
      }
    }
  }
);

export const updateRole = createAsyncThunk(
  "roles/updateRole",
  async ({ roleId, roleData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/roles/${roleId}`, roleData);
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
        toast.error("Failed to update role");
        return rejectWithValue(error.message);
      }
    }
  }
);

export const deleteRole = createAsyncThunk(
  "roles/deleteRole",
  async (roleId, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/roles/${roleId}`);
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
        toast.error("Failed to delete user");
        return rejectWithValue(error.message);
      }
    }
  }
);
