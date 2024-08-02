import { createSlice } from "@reduxjs/toolkit";

// ACTIONS IMPORT
import {
  addRole,
  getAllRolesList,
  getRoleById,
  updateRole,
  deleteRole,
} from "./roleActions";

// INITAILS STATE
const initialState = {
  roles: [],
  currentRole: null,
  loading: false,
  error: null,
  total: 0,
  page: 1,
  pageSize: 5,
};

// USER SLICE
const roleSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
    setPageSize(state, action) {
      state.pageSize = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle addRole actions
      .addCase(addRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(addRole.fulfilled, (state, action) => {
        state.loading = false;
        state.roles.push(action.payload);
      })
      .addCase(addRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle getAllRolesList actions
      .addCase(getAllRolesList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllRolesList.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload.roles;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(getAllRolesList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle getRoleById actions
      .addCase(getRoleById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRole = action.payload.data;
      })
      .addCase(getRoleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle updateRole actions
      .addCase(updateRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRole = action.payload;
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle deleteRole actions
      .addCase(deleteRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = state.roles.filter((role) => role.id !== action.payload);
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, setPageSize } = roleSlice.actions;

export default roleSlice.reducer;
