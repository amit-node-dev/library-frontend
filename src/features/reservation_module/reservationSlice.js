import { createSlice } from "@reduxjs/toolkit";
import { createReservation, getAllReservationList } from "./reservationAction";

const initialState = {
  reservations: [],
  currentReservation: null,
  loading: false,
  error: null,
  total: 0,
  page: 1,
  pageSize: 5,
};

const reservationSlice = createSlice({
  name: "reservations",
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
      // ADD RESERVATION
      .addCase(createReservation.pending, (state) => {
        state.loading = true;
      })
      .addCase(createReservation.fulfilled, (state, action) => {
        state.loading = false;
        state.reservations.push(action.payload);
      })
      .addCase(createReservation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET ALL LIST OF RESERVATIONS
      .addCase(getAllReservationList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllReservationList.fulfilled, (state, action) => {
        state.loading = false;
        state.reservations = action.payload.reservations;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pageSize = action.payload.pageSize;
      })
      .addCase(getAllReservationList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, setPageSize } = reservationSlice.actions;

export default reservationSlice.reducer;
