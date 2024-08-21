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
    { field: "id", headerName: "RECORD-ID", width: 120 },
    {
      field: "bookname",
      headerName: "BOOKNAME",
      width: 200,
      renderCell: (params) =>
        params.row.books ? params.row.books.bookname : "N/A",
    },
    {
      field: "user",
      headerName: "USER",
      width: 200,
      renderCell: (params) =>
        params.row.users
          ? `${params.row.users.firstname} ${params.row.users.lastname}`
          : "N/A",
    },
    {
      field: "status",
      headerName: "STATUS",
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
      field: "fine_amount",
      headerName: "FINE AMOUNT",
      width: 200,
    },
    {
      field: "borrow_date",
      headerName: "BORROW DATE",
      width: 250,
    },
    {
      field: "due_date",
      headerName: "DUE DATE",
      width: 250,
    },
    {
      field: "return_date",
      headerName: "RETURN DATE",
      width: 250,
    },
  ];

  return (
    <div className="borrow-container">
      <div className="borrow-header">
        <Typography variant="h4">Borrow Records</Typography>
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
          <Pagination
            showFirstButton
            showLastButton
            shape="rounded"
            variant="outlined"
            count={Math.ceil(total / pageSize)}
            page={page}
            onChange={handlePageChange}
            color="primary"
            sx={{
              margin: "20px auto",
              display: "flex",
              justifyContent: "center",
              animation: "fadeIn 1s ease-in-out",
            }}
          />
        </>
      )}
    </div>
  );
};

export default BorrowRecordsTable;
