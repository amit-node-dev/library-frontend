import { createSlice } from "@reduxjs/toolkit";

// ACTIONS IMPORT
import {
  registerUser,
  loginUser,
  addUser,
  getAllUsersList,
  getUserById,
  updateUsers,
  deleteUsers,
} from "./userActions";

// INITAILS STATE
const initialState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
  total: 0,
  page: 1,
  pageSize: 5,
};

// USER SLICE
const userSlice = createSlice({
  name: "users",
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
      // Handle registerUser actions
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle loginUser actions
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle addUser actions
      .addCase(addUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle getAllUsersList actions
      .addCase(getAllUsersList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllUsersList.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(getAllUsersList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle getUserById actions
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload.data;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle updateUsers actions
      .addCase(updateUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(updateUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle deleteUsers actions
      .addCase(deleteUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      .addCase(deleteUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, setPageSize } = userSlice.actions;

export default userSlice.reducer;
