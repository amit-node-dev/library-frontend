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
  Refresh,
} from "@mui/icons-material";
import { styled } from "@mui/system";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import dayjs from "dayjs";

// Actions & Stores
import { getAllBorrowRecordList } from "../../features/borrowRecord_module/borrorRecordAction";
import { setPage, setPageSize } from "../../features/book_module/bookSlice";

// Styled Components
const Container = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  borderRadius: "16px",
  boxShadow: "0 4px 24px rgba(63,81,181,0.10)",
  backgroundColor: "#f5f7fa",
  position: "relative",
  transition: "box-shadow 0.3s",
  "&:hover": {
    boxShadow: "0 8px 32px rgba(63,81,181,0.18)",
  },
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
  animation: "slideIn 0.7s",
  '@keyframes slideIn': {
    from: { opacity: 0, transform: 'translateY(-20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
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
  const { borrowRecords, loading, error, total, page, pageSize } = useSelector(
    (state) => state.borrowRecords
  );

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
            search: searchQuery,
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
      record.return_date ? dayjs(record.return_date).format("YYYY-MM-DD") : "-",
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
      "Days Overdue":
        record.status === "overdue"
          ? dayjs().diff(dayjs(record.due_date), "day")
          : 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Borrow Records");

    // Auto-size columns
    const wscols = [
      { wch: 10 },
      { wch: 30 },
      { wch: 25 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
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
    dispatch(
      getAllBorrowRecordList({ page, pageSize, status: selectedStatus })
    );
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
      renderCell: (params) => (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="100%"
          height="100%"
        >
          <Typography variant="body2">{params.row.id}</Typography>
        </Box>
      ),
    },
    {
      field: "bookName",
      headerName: "Book Name",
      width: 300,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="100%"
          height="100%"
        >
          <Typography variant="body2" textAlign="center">
            {params.row.book?.bookName || "N/A"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "user",
      headerName: "Borrower",
      width: 200,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="100%"
          height="100%"
        >
          <Typography variant="body2" textAlign="center">
            {params.row.user
              ? `${params.row.user.firstName} ${params.row.user.lastName}`
              : "N/A"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 200,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="100%"
          height="100%"
        >
          <StatusChip
            size="small"
            label={
              getRecordStatus(params.row).charAt(0).toUpperCase() +
              getRecordStatus(params.row).slice(1)
            }
            status={getRecordStatus(params.row)}
          />
        </Box>
      ),
    },
    {
      field: "borrowDate",
      headerName: "Borrow Date",
      width: 200,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="100%"
          height="100%"
        >
          <Typography variant="body2" textAlign="center">
            {params.row.borrowDate
              ? dayjs(params.row.borrowDate).format("MMM D, YYYY")
              : "-"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "dueDate",
      headerName: "Due Date",
      width: 200,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="100%"
          height="100%"
        >
          <Typography variant="body2" textAlign="center">
            {params.row.dueDate
              ? dayjs(params.row.dueDate).format("MMM D, YYYY")
              : "-"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "returnDate",
      headerName: "Return Date",
      width: 200,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="100%"
          height="100%"
        >
          <Typography variant="body2" textAlign="center">
            {params.row.returnDate
              ? dayjs(params.row.returnDate).format("MMM D, YYYY")
              : "-"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "daysOverdue",
      headerName: "Days Overdue",
      width: 200,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="100%"
          height="100%"
        >
          {params.row.status === "returned" ? (
            <Typography variant="body2" textAlign="center">
              -
            </Typography>
          ) : dayjs().isAfter(dayjs(params.row.dueDate)) ? (
            <Typography
              variant="body2"
              textAlign="center"
              sx={{ color: "#f44336", fontWeight: 500 }}
            >
              {dayjs().diff(dayjs(params.row.dueDate), "day")} days
            </Typography>
          ) : (
            <Typography variant="body2" textAlign="center">
              -
            </Typography>
          )}
        </Box>
      ),
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
                <IconButton size="small" onClick={() => setSearchQuery("")}>
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
              animation: "fadeIn 0.7s",
              "@keyframes fadeIn": {
                from: { opacity: 0, transform: "translateY(20px)" },
                to: { opacity: 1, transform: "translateY(0)" },
              },
              height: "calc(100vh - 450px)",
              width: "100%",
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f5f5f5",
                fontWeight: "bold",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "rgba(63, 81, 181, 0.04)",
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
              density="standard"
              getRowId={(row) =>
                row.id + (row.books?.id || "") + (row.users?.id || "")
              }
              hideFooter
              sx={{
                border: "none",
                "& .MuiDataGrid-cell": {
                  borderBottom: "1px solid rgba(224, 224, 224, 0.5)",
                },
              }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              mt: 3,
              gap: 2,
              p: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Showing{" "}
              <strong>
                {startEntry}-{endEntry}
              </strong>{" "}
              of <strong>{total}</strong> users
            </Typography>

            <Box display="flex" alignItems="center" gap={5}>
              {/* Rows per Page Select */}
              <FormControl
                variant="outlined"
                size="small"
                sx={{ minWidth: 120 }}
              >
                <InputLabel>Rows per page</InputLabel>
                <Select
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  label="Rows per page"
                >
                  {[5, 10, 20, 50].map((size) => (
                    <MenuItem key={size} value={size}>
                      {size}
                    </MenuItem>
                  ))}
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
                siblingCount={1}
                boundaryCount={1}
                sx={{
                  "& .MuiPaginationItem-root": {
                    fontSize: "0.875rem",
                  },
                }}
              />
            </Box>
          </Box>
        </>
      )}
    </Container>
  );
};

export default BorrowRecordsTable;
