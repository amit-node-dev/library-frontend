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
        error.response.data.data.forEach((err) => {
          toast.error(`${err.msg}`);
        });
        return error.response;
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
      toast.error("Failed to fetch roles list");
      return rejectWithValue(error.message);
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
      toast.error("Failed to fetch role data");
      return rejectWithValue(error.message);
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
      toast.error("Failed to update role");
      return rejectWithValue(error.message);
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
      toast.error("Failed to delete user");
      return rejectWithValue(error.message);
    }
  }
);
