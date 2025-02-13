import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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
} from "@mui/material";

// ACTIONS & STORES
import { getAllPenaltiesList } from "../../features/penalties_module/penaltiesAction";
import {
  setPage,
  setPageSize,
} from "../../features/penalties_module/penaltiesSlice";

// CSS IMPORTS
import "./penalties.css";

const PenaltiesTable = () => {
  const { penalties, loading, error, total, page, pageSize } = useSelector(
    (state) => state.penalties
  );

  const dispatch = useDispatch();

  const [sortModel, setSortModel] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const startEntry = (page - 1) * pageSize + 1;
  const endEntry = Math.min(page * pageSize, total);

  useEffect(() => {
    dispatch(getAllPenaltiesList({ page, pageSize, searchQuery }));
  }, [dispatch, page, pageSize, searchQuery]);

  const handlePageChange = (event, newPage) => {
    dispatch(setPage(newPage));
    dispatch(getAllPenaltiesList({ page: newPage, pageSize }));
  };

  // Function to export data as PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Borrow Records List", 14, 15);

    const tableColumn = ["Id", "Book Name", "Full Name", "Fine Amount", "Date"];

    const tableRows = penalties.map((penality) => [
      penality.id,
      penality.bookname,
      penality.fullname,
      penality.fine,
      penality.createdAt,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("penalties_list.pdf");
  };

  // Function to export data as Excel
  const handleExportExcel = () => {
    const data = penalties.map((penality) => ({
      Id: penality.id,
      "Book Name": penality.bookname,
      "Full Name": penality.fullname,
      "Fine Amount": penality.fine,
      Date: penality.createdAt,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Penalties List");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const excelData = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(excelData, "penalties_list.xlsx");
  };

  // Handle export selection
  const handleExport = (format) => {
    if (format === "pdf") {
      handleExportPDF();
    } else if (format === "excel") {
      handleExportExcel();
    }
  };

  const handlePageSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    dispatch(setPageSize(newSize));
    dispatch(setPage(1));
    dispatch(
      getAllPenaltiesList({
        page: 1,
        pageSize: newSize,
      })
    );
  };

  // Define columns with custom renderers
  const columns = [
    { field: "id", headerName: "Id", width: 200 },
    {
      field: "bookname",
      headerName: "Book Name",
      width: 350,
      renderCell: (params) =>
        params.row.bookname ? params.row.bookname : "N/A",
    },
    {
      field: "fullname",
      headerName: "Booked User",
      width: 350,
      renderCell: (params) =>
        params.row.fullname ? params.row.fullname : "N/A",
    },
    {
      field: "fine",
      headerName: "Fine Amount",
      width: 350,
      renderCell: (params) => (params.row.fine ? params.row.fine : "N/A"),
    },
    {
      field: "createdAt",
      headerName: "Date",
      width: 450,
      renderCell: (params) =>
        params.row.createdAt
          ? dayjs(params.row.createdAt).format("YYYY-MM-DD")
          : "N/A",
    },
  ];

  return (
    <div className="penalties-container">
      <div className="penalties-header">
        <Typography variant="h4" sx={{ fontFamily: "sans-serif" }}>
          Penalty Records
        </Typography>
        <div className="penalties-util">
          {/* Export Button */}
          <FormControl variant="filled" sx={{ mx: 3, minWidth: 150 }}>
            <InputLabel id="export-select-label">Export</InputLabel>
            <Select
              labelId="export-select-label"
              id="export-select"
              onChange={(e) => handleExport(e.target.value)}
              defaultValue=""
            >
              <MenuItem value="">Select Format</MenuItem>
              <MenuItem value="pdf">Export as PDF</MenuItem>
              <MenuItem value="excel">Export as Excel</MenuItem>
            </Select>
          </FormControl>

          <input
            type="text"
            className="book-search-input"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
              rows={penalties}
              density="compact"
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
                "& .MuiDataGrid-columnHeader": {
                  backgroundColor: "#a9a9a9",
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

export default PenaltiesTable;
