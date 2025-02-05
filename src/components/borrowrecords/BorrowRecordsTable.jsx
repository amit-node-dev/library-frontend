import React, { useEffect, useState } from "react";

// THIRD PARTY IMPORTS
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import dayjs from "dayjs";

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
import { getAllBorroRecordList } from "../../features/borrowRecord_module/borrorRecordAction";
import { setPage, setPageSize } from "../../features/book_module/bookSlice";

// CSS IMPORTS
import "./borrowrecords.css";

const BorrowRecordsTable = () => {
  const { borrowRecords, loading, error, total, page, pageSize } = useSelector(
    (state) => state.borrowRecords
  );

  const dispatch = useDispatch();

  const [sortModel, setSortModel] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");

  const startEntry = (page - 1) * pageSize + 1;
  const endEntry = Math.min(page * pageSize, total);

  useEffect(() => {
    dispatch(getAllBorroRecordList({ page, pageSize, status: selectedStatus }));
  }, [dispatch, page, pageSize, selectedStatus]);

  const handlePageChange = (event, newPage) => {
    dispatch(setPage(newPage));
    dispatch(
      getAllBorroRecordList({ page: newPage, pageSize, status: selectedStatus })
    );
  };

  const handlePageSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    dispatch(setPageSize(newSize));
    dispatch(setPage(1));
    dispatch(
      getAllBorroRecordList({
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
    { field: "id", headerName: "Id", width: 120 },
    {
      field: "bookname",
      headerName: "Book Name",
      width: 200,
      renderCell: (params) =>
        params.row.books ? params.row.books.bookname : "N/A",
    },
    {
      field: "user",
      headerName: "Borrowed User",
      width: 200,
      renderCell: (params) =>
        params.row.users
          ? `${params.row.users?.firstname} ${params.row.users?.lastname}`
          : "N/A",
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => (
        <Chip
          size="small"
          label={params.value === "returned" ? "Returned" : "Borrowed"}
          color={params.value === "returned" ? "success" : "warning"}
          variant="contained"
        />
      ),
    },
    {
      field: "borrow_date",
      headerName: "Borrow At",
      width: 250,
      renderCell: (params) =>
        params.row.borrow_date
          ? dayjs(params.row.borrow_date).format("YYYY-MM-DD")
          : "N/A",
    },
    {
      field: "due_date",
      headerName: "Due Date At",
      width: 250,
      renderCell: (params) =>
        params.row.due_date
          ? dayjs(params.row.due_date).format("YYYY-MM-DD")
          : "N/A",
    },
    {
      field: "return_date",
      headerName: "Return At",
      width: 250,
      renderCell: (params) =>
        params.row.return_date
          ? dayjs(params.row.return_date).format("YYYY-MM-DD")
          : "N/A",
    },
  ];

  return (
    <div className="borrow-container">
      <div className="borrow-header">
        <Typography variant="h4" sx={{ fontFamily: "sans-serif" }}>
          Borrow Records
        </Typography>
        <div className="borrow-util">
          <FormControl variant="filled" sx={{ mx: 3, minWidth: 150 }}>
            <InputLabel id="status-select-label">By Status</InputLabel>
            <Select
              labelId="status-select-label"
              id="status-select"
              value={selectedStatus}
              onChange={handleStatusChange}
            >
              <MenuItem value="">Select Status</MenuItem>
              <MenuItem value="borrowed">Borrowed</MenuItem>
              <MenuItem value="returned">Returned</MenuItem>
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
              rows={borrowRecords}
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
              rowHeight={65}
              columnHeaderHeight={50}
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
                "& .MuiDataGrid-cell": {
                  padding: "4px",
                },
                "& .MuiDataGrid-row": {
                  minHeight: "35px !important",
                },
              }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "40px",
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

export default BorrowRecordsTable;
