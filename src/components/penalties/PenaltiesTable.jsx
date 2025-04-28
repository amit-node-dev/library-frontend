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
  Button,
  Paper,
  TextField,
  IconButton,
  Chip,
  useTheme,
  Tooltip,
} from "@mui/material";
import {
  PictureAsPdf,
  GridOn,
  Search,
  Clear,
  Refresh,
  AttachMoney,
} from "@mui/icons-material";
import { styled } from "@mui/system";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import dayjs from "dayjs";

// Actions & Stores
import { getAllPenaltiesList } from "../../features/penalties_module/penaltiesAction";
import {
  setPage,
  setPageSize,
} from "../../features/penalties_module/penaltiesSlice";

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
  "@keyframes slideIn": {
    from: { opacity: 0, transform: "translateY(-20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
}));

const SearchField = styled(TextField)(({ theme }) => ({
  minWidth: "250px",
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
  },
}));

const FineChip = styled(Chip)(({ theme }) => ({
  fontWeight: 600,
  backgroundColor: theme.palette.error.light,
  color: theme.palette.error.contrastText,
}));

const PenaltiesTable = () => {
  const theme = useTheme();
  const { penalties, loading, error, total, page, pageSize } = useSelector(
    (state) => state.penalties
  );

  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Calculate pagination entries
  const startEntry = (page - 1) * pageSize + 1;
  const endEntry = Math.min(page * pageSize, total);

  // Fetch penalties when filters change
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await dispatch(
          getAllPenaltiesList({
            page,
            pageSize,
            search: searchQuery,
          })
        ).unwrap();
      } catch (error) {
        toast.error("Failed to load penalty records");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dispatch, page, pageSize, searchQuery]);

  // Enhanced PDF export
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Penalty Records Report", 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${dayjs().format("YYYY-MM-DD HH:mm")}`, 14, 22);

    const tableColumn = [
      "ID",
      "Book Name",
      "User",
      "Fine Amount",
      "Date",
      "Status",
    ];

    const tableRows = penalties.map((penalty) => [
      penalty.id,
      penalty.bookname || "N/A",
      penalty.fullname || "N/A",
      `$${penalty.fine.toFixed(2)}`,
      dayjs(penalty.createdAt).format("YYYY-MM-DD"),
      penalty.paid ? "Paid" : "Unpaid",
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
        fillColor: theme.palette.primary.main,
        textColor: "#fff",
        fontStyle: "bold",
      },
      columnStyles: {
        3: { halign: "right" },
      },
    });

    doc.save(`penalty_records_${dayjs().format("YYYYMMDD")}.pdf`);
    toast.success("PDF exported successfully");
  };

  // Enhanced Excel export
  const handleExportExcel = () => {
    const data = penalties.map((penalty) => ({
      ID: penalty.id,
      "Book Name": penalty.bookname || "N/A",
      "User Name": penalty.fullname || "N/A",
      "Fine Amount": `$${penalty.fine.toFixed(2)}`,
      Date: dayjs(penalty.createdAt).format("YYYY-MM-DD"),
      Status: penalty.paid ? "Paid" : "Unpaid",
      "Payment Date": penalty.paidAt
        ? dayjs(penalty.paidAt).format("YYYY-MM-DD")
        : "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Penalty Records");

    // Auto-size columns
    const wscols = [
      { wch: 10 },
      { wch: 30 },
      { wch: 25 },
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

    saveAs(excelData, `penalty_records_${dayjs().format("YYYYMMDD")}.xlsx`);
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

  const handleClearFilters = () => {
    setSearchQuery("");
    dispatch(setPage(1));
  };

  const handleRefresh = () => {
    dispatch(getAllPenaltiesList({ page, pageSize, search: searchQuery }));
  };

  // Columns configuration
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "bookname",
      headerName: "Book Name",
      width: 250,
      valueGetter: (params) => params.row.bookName || "N/A",
    },
    {
      field: "fullname",
      headerName: "Fullname",
      width: 200,
      valueGetter: (params) => params.row.fullname || "N/A",
    },
    {
      field: "fine",
      headerName: "Fine Amount",
      width: 200,
      renderCell: (params) => (
        <FineChip
          icon={<AttachMoney fontSize="small" />}
          label={`$${params.value.toFixed(2)}`}
        />
      ),
    },
    {
      field: "createdAt",
      headerName: "Date",
      width: 250,
      valueFormatter: (params) =>
        params.value ? dayjs(params.value).format("MMM D, YYYY") : "-",
    },
    {
      field: "paid",
      headerName: "Status",
      width: 250,
      renderCell: (params) => (
        <Chip
          label={params.value ? "Paid" : "Unpaid"}
          color={params.value ? "success" : "warning"}
          variant="outlined"
        />
      ),
    },
  ];

  return (
    <Container elevation={3}>
      <Header>
        <Typography variant="h5" fontWeight="bold" color="textPrimary">
          Penalty Records
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
          <ClipLoader size={50} color={theme.palette.primary.main} />
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
              rows={penalties}
              columns={columns}
              pageSize={pageSize}
              rowsPerPageOptions={[5, 10, 20, 50]}
              paginationMode="server"
              rowCount={total}
              disableSelectionOnClick
              density="comfortable"
              getRowId={(row) =>
                row.id + (row.user_id || "") + (row.book_id || "")
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

export default PenaltiesTable;
