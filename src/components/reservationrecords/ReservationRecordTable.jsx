import React, { useEffect, useState } from "react";

// THIRD PARTY IMPORTS
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";

// MUI IMPORTS
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Typography,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";

// ACTIONS & STORES
import { getAllReservationList } from "../../features/reservation_module/reservationAction";
import {
  setPage,
  setPageSize,
} from "../../features/reservation_module/reservationSlice";

// CSS IMPORTS
import "./reservations.css";
import dayjs from "dayjs";

const ReservationRecordTable = () => {
  const { reservations, loading, error, total, page, pageSize } = useSelector(
    (state) => state.reservations
  );

  const dispatch = useDispatch();

  const [sortModel, setSortModel] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");

  const startEntry = (page - 1) * pageSize + 1;
  const endEntry = Math.min(page * pageSize, total);

  useEffect(() => {
    dispatch(getAllReservationList({ page, pageSize, status: selectedStatus }));
  }, [dispatch, page, pageSize, selectedStatus]);

  const handlePageChange = (event, newPage) => {
    dispatch(setPage(newPage));
    dispatch(
      getAllReservationList({ page: newPage, pageSize, status: selectedStatus })
    );
  };

  const handlePageSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    dispatch(setPageSize(newSize));
    dispatch(setPage(1));
    dispatch(
      getAllReservationList({
        page: 1,
        pageSize: newSize,
        status: selectedStatus,
      })
    );
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  // Define columns with custom renderers
  const columns = [
    { field: "id", headerName: "RESERVATION-ID", width: 250 },
    {
      field: "bookname",
      headerName: "BOOKNAME",
      width: 350,
      renderCell: (params) =>
        params.row.books ? params.row.books.bookname : "N/A",
    },
    {
      field: "user",
      headerName: "USER",
      width: 350,
      renderCell: (params) =>
        params.row.users
          ? `${params.row.users.firstname} ${params.row.users.lastname}`
          : "N/A",
    },
    {
      field: "status",
      headerName: "STATUS",
      width: 350,
      renderCell: (params) => (
        <Chip
          size="small"
          label={params.value === "reserved" ? "Reserved" : "Unreserved"}
          color={params.value === "reserved" ? "success" : "error"}
          variant="contained"
        />
      ),
    },
    {
      field: "reservation_date",
      headerName: "RESERVATION DATE",
      width: 350,
      renderCell: (params) =>
        params.row.reservation_date
          ? dayjs(params.row.reservation_date).format("YYYY-MM-DD")
          : "N/A",
    },
  ];

  return (
    <div className="reservation-container">
      <div className="reservation-header">
        <Typography variant="h4" sx={{ fontFamily: "cursive" }}>
          Reservation Records
        </Typography>
        <div className="reservation-util">
          <FormControl variant="filled" sx={{ mx: 3, minWidth: 150 }}>
            <InputLabel id="status-select-label">By Status</InputLabel>
            <Select
              labelId="status-select-label"
              id="status-select"
              value={selectedStatus}
              onChange={handleStatusChange}
            >
              <MenuItem value="">Select Status</MenuItem>
              <MenuItem value="reserved">Reserved</MenuItem>
              <MenuItem value="unreserved">Unreserved</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
      {loading ? (
        <div className="spinner-container">
          <ClipLoader size={50} color={"#123abc"} loading={loading} />
        </div>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          <Box
            sx={{
              height: "auto",
              width: "100%",
              margin: "0px auto",
              animation: "fadeIn 1s ease-in-out",
            }}
          >
            <DataGrid
              rows={reservations}
              density="standard"
              disableRowSelectionOnClick={true}
              hideFooter={true}
              getRowId={(row) => row.id + row.user_id + row.book_id}
              columns={columns}
              pageSize={pageSize}
              rowsPerPageOptions={[5, 10, 20]}
              pagination
              paginationMode="server"
              rowCount={total}
              onPageSizeChange={handlePageSizeChange}
              sortingMode="server"
              sortModel={sortModel}
              onSortModelChange={(model) => setSortModel(model)}
              autoHeight
              sx={{
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f5f5f5",
                },
                "& .MuiDataGrid-footerContainer": {
                  borderTop: "1px solid #ddd",
                },
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "#e0f7fa",
                },
                "& .actions-container > *": {
                  transition: "color 0.3s ease",
                },
                "& .actions-container > *:hover": {
                  color: "#007bff",
                },
              }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <Typography
              variant="caption"
              gutterBottom
              sx={{ display: "flex", alignItems: "center" }}
            >
              Showing {startEntry} - {endEntry} from {total} entries
            </Typography>
            <Pagination
              showFirstButton
              showLastButton
              shape="rounded"
              variant="outlined"
              count={Math.ceil(total / pageSize)}
              page={page}
              onChange={handlePageChange}
              color="warning"
              sx={{
                margin: "0",
                display: "flex",
                justifyContent: "right",
                animation: "fadeIn 1s ease-in-out",
              }}
            />
          </Box>
        </>
      )}
    </div>
  );
};

export default ReservationRecordTable;
