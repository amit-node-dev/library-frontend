import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
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
  Button,
  Paper,
  TextField,
  IconButton,
  Tooltip,
} from "@mui/material";
import { 
  PictureAsPdf, 
  GridOn, 
  Search, 
  Clear,
  Refresh 
} from "@mui/icons-material";
import { styled } from "@mui/system";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import dayjs from "dayjs";

// Actions & Stores
import { 
  getAllBorrowRecordList 
} from "../../features/borrowRecord_module/borrorRecordAction";
import { 
  setPage, 
  setPageSize 
} from "../../features/book_module/bookSlice";

// Styled Components
const Container = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  // backgroundColor: theme.palette.background.paper,
}));

const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(3),
  flexWrap: "wrap",
  gap: theme.spacing(2),
}));

const FilterSection = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  flexWrap: "wrap",
}));

const SearchField = styled(TextField)(({ theme }) => ({
  minWidth: "250px",
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  fontWeight: 600,
  ...(status === "returned" && {
    backgroundColor: "#4caf50",
    color: "#fff",
  }),
  ...(status === "borrowed" && {
    backgroundColor: "#ff9800",
    color: "#fff",
  }),
  ...(status === "overdue" && {
    backgroundColor: "#f44336",
    color: "#fff",
  }),
}));

const BorrowRecordsTable = () => {
  const { 
    borrowRecords, 
    loading, 
    error, 
    total, 
    page, 
    pageSize 
  } = useSelector((state) => state.borrowRecords);

  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Calculate pagination entries
  const startEntry = (page - 1) * pageSize + 1;
  const endEntry = Math.min(page * pageSize, total);

  // Fetch borrow records when filters change
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await dispatch(
          getAllBorrowRecordList({ 
            page, 
            pageSize, 
            status: selectedStatus,
            search: searchQuery 
          })
        ).unwrap();
      } catch (error) {
        toast.error("Failed to load borrow records");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [dispatch, page, pageSize, selectedStatus, searchQuery]);

  // Enhanced PDF export
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Borrow Records Report", 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${dayjs().format("YYYY-MM-DD HH:mm")}`, 14, 22);

    const tableColumn = [
      "ID",
      "Book Name",
      "Borrower",
      "Status",
      "Borrow Date",
      "Due Date",
      "Return Date",
    ];

    const tableRows = borrowRecords.map((record) => [
      record.id,
      record.books?.bookname || "N/A",
      record.users 
        ? `${record.users.firstname} ${record.users.lastname}`
        : "N/A",
      record.status,
      dayjs(record.borrow_date).format("YYYY-MM-DD"),
      dayjs(record.due_date).format("YYYY-MM-DD"),
      record.return_date 
        ? dayjs(record.return_date).format("YYYY-MM-DD")
        : "-",
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: {
        cellPadding: 3,
        fontSize: 9,
        valign: "middle",
        halign: "center",
      },
      headStyles: {
        fillColor: "#3f51b5",
        textColor: "#fff",
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 20 },
        3: { cellWidth: 30 },
      },
    });

    doc.save(`borrow_records_${dayjs().format("YYYYMMDD")}.pdf`);
    toast.success("PDF exported successfully");
  };

  // Enhanced Excel export
  const handleExportExcel = () => {
    const data = borrowRecords.map((record) => ({
      ID: record.id,
      "Book Name": record.books?.bookname || "N/A",
      Borrower: record.users 
        ? `${record.users.firstname} ${record.users.lastname}`
        : "N/A",
      Status: record.status,
      "Borrow Date": dayjs(record.borrow_date).format("YYYY-MM-DD"),
      "Due Date": dayjs(record.due_date).format("YYYY-MM-DD"),
      "Return Date": record.return_date 
        ? dayjs(record.return_date).format("YYYY-MM-DD")
        : "-",
      "Days Overdue": record.status === "overdue" 
        ? dayjs().diff(dayjs(record.due_date), "day")
        : 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Borrow Records");

    // Auto-size columns
    const wscols = [
      { wch: 10 }, // ID
      { wch: 30 }, // Book Name
      { wch: 25 }, // Borrower
      { wch: 15 }, // Status
      { wch: 15 }, // Borrow Date
      { wch: 15 }, // Due Date
      { wch: 15 }, // Return Date
      { wch: 15 }, // Days Overdue
    ];
    worksheet["!cols"] = wscols;

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const excelData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(excelData, `borrow_records_${dayjs().format("YYYYMMDD")}.xlsx`);
    toast.success("Excel exported successfully");
  };

  const handlePageChange = (event, newPage) => {
    dispatch(setPage(newPage));
  };

  const handlePageSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    dispatch(setPageSize(newSize));
    dispatch(setPage(1));
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
    dispatch(setPage(1));
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedStatus("");
    dispatch(setPage(1));
  };

  const handleRefresh = () => {
    dispatch(getAllBorrowRecordList({ page, pageSize, status: selectedStatus }));
  };

  // Determine status with overdue check
  const getRecordStatus = (record) => {
    if (record.status === "returned") return "returned";
    if (dayjs().isAfter(dayjs(record.due_date))) return "overdue";
    return "borrowed";
  };

  // Columns configuration
  const columns = [
    { 
      field: "id", 
      headerName: "ID", 
      width: 80,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "bookname",
      headerName: "Book Name",
      width: 220,
      valueGetter: (params) => params.row.books?.bookname || "N/A",
    },
    {
      field: "user",
      headerName: "Borrower",
      width: 200,
      valueGetter: (params) =>
        params.row.users
          ? `${params.row.users.firstname} ${params.row.users.lastname}`
          : "N/A",
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => {
        const status = getRecordStatus(params.row);
        return (
          <StatusChip
            size="small"
            label={status.charAt(0).toUpperCase() + status.slice(1)}
            status={status}
          />
        );
      },
    },
    {
      field: "borrow_date",
      headerName: "Borrow Date",
      width: 120,
      valueFormatter: (params) =>
        params.value ? dayjs(params.value).format("MMM D, YYYY") : "-",
    },
    {
      field: "due_date",
      headerName: "Due Date",
      width: 120,
      valueFormatter: (params) =>
        params.value ? dayjs(params.value).format("MMM D, YYYY") : "-",
    },
    {
      field: "return_date",
      headerName: "Return Date",
      width: 120,
      valueFormatter: (params) =>
        params.value ? dayjs(params.value).format("MMM D, YYYY") : "-",
    },
    {
      field: "days_overdue",
      headerName: "Days Overdue",
      width: 120,
      valueGetter: (params) => {
        if (params.row.status === "returned") return 0;
        if (dayjs().isAfter(dayjs(params.row.due_date))) {
          return dayjs().diff(dayjs(params.row.due_date), "day");
        }
        return 0;
      },
      renderCell: (params) => {
        if (params.value > 0) {
          return <span style={{ color: "#f44336" }}>{params.value} days</span>;
        }
        return "-";
      },
    },
  ];

  return (
    <Container elevation={3}>
      <Header>
        <Typography variant="h5" fontWeight="bold" color="textPrimary">
          Borrow Records
        </Typography>
        
        <FilterSection>
          <SearchField
            variant="outlined"
            placeholder="Search books or users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <Search color="action" sx={{ mr: 1 }} />,
              endAdornment: searchQuery && (
                <IconButton
                  size="small"
                  onClick={() => setSearchQuery("")}
                >
                  <Clear fontSize="small" />
                </IconButton>
              ),
            }}
            size="small"
          />

          <FormControl variant="outlined" size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={selectedStatus}
              onChange={handleStatusChange}
              label="Status"
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="borrowed">Borrowed</MenuItem>
              <MenuItem value="returned">Returned</MenuItem>
              <MenuItem value="overdue">Overdue</MenuItem>
            </Select>
          </FormControl>

          <Box display="flex" gap={1}>
            <Tooltip title="Clear filters">
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleClearFilters}
                startIcon={<Clear />}
                size="small"
              >
                Clear
              </Button>
            </Tooltip>

            <Tooltip title="Refresh data">
              <Button
                variant="outlined"
                onClick={handleRefresh}
                startIcon={<Refresh />}
                size="small"
              >
                Refresh
              </Button>
            </Tooltip>

            <Tooltip title="Export as PDF">
              <Button
                variant="contained"
                color="error"
                onClick={handleExportPDF}
                startIcon={<PictureAsPdf />}
                size="small"
              >
                PDF
              </Button>
            </Tooltip>

            <Tooltip title="Export as Excel">
              <Button
                variant="contained"
                color="success"
                onClick={handleExportExcel}
                startIcon={<GridOn />}
                size="small"
              >
                Excel
              </Button>
            </Tooltip>
          </Box>
        </FilterSection>
      </Header>

      {loading || isLoading ? (
        <Box display="flex" justifyContent="center" py={10}>
          <ClipLoader size={50} color="#3f51b5" />
        </Box>
      ) : error ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="200px"
        >
          <Typography color="error">Error: {error}</Typography>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              height: "calc(100vh - 300px)",
              width: "100%",
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f5f5f5",
                fontWeight: "bold",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "rgba(63, 81, 181, 0.04)",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid rgba(224, 224, 224, 0.5)",
              },
            }}
          >
            <DataGrid
              rows={borrowRecords}
              columns={columns}
              pageSize={pageSize}
              rowsPerPageOptions={[5, 10, 20, 50]}
              paginationMode="server"
              rowCount={total}
              disableSelectionOnClick
              density="comfortable"
              getRowId={(row) => row.id + (row.books?.id || "") + (row.users?.id || "")}
              hideFooter
              loading={loading || isLoading}
              sx={{
                border: "none",
                "& .MuiDataGrid-cell": {
                  py: 1,
                },
              }}
            />
          </Box>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={2}
          >
            <Typography variant="body2" color="textSecondary">
              Showing {startEntry} to {endEntry} of {total} records
            </Typography>

            <Box display="flex" alignItems="center" gap={2}>
              <FormControl variant="outlined" size="small">
                <InputLabel>Rows per page</InputLabel>
                <Select
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  label="Rows per page"
                >
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                </Select>
              </FormControl>

              <Pagination
                count={Math.ceil(total / pageSize)}
                page={page}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
                showFirstButton
                showLastButton
              />
            </Box>
          </Box>
        </>
      )}
    </Container>
  );
};

export default BorrowRecordsTable;