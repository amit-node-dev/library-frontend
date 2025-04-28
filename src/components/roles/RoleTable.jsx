import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  IconButton,
  Typography,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  TextField,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PictureAsPdf,
  GridOn,
  Clear,
  Search,
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
  deleteRole,
  getAllRolesListPagination,
} from "../../features/role_module/roleActions";
import { setPage, setPageSize } from "../../features/role_module/roleSlice";

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

const ActionButton = styled(IconButton)(({ theme }) => ({
  transition: "all 0.2s cubic-bezier(.4,2,.6,1)",
  "&:hover": {
    transform: "scale(1.2) rotate(-5deg)",
    boxShadow: "0 2px 8px rgba(63,81,181,0.15)",
    backgroundColor: "#e3e8fd",
  },
}));
const RoleTable = () => {
  const { roles, loading, error, total, page, pageSize } = useSelector(
    (state) => state.roles
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);

  const userData = localStorage.getItem("userData");
  const userInfo = JSON.parse(userData) || {};
  const roleId = userInfo?.roleId || 0;

  useEffect(() => {
    dispatch(getAllRolesListPagination({ page, pageSize }));
  }, [dispatch, page, pageSize]);

  useEffect(() => {
    let filtered = roles;
    if (searchQuery) {
      filtered = roles.filter((role) =>
        role.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredRoles(filtered);
  }, [searchQuery, roles]);

  // Export functions
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Roles List", 14, 15);

    const tableColumn = ["Id", "Role Name", "Created Date", "Updated Date"];
    const tableRows = roles.map((role) => [
      role.id,
      role.name,
      dayjs(role.createdAt).format("YYYY-MM-DD"),
      dayjs(role.updatedAt).format("YYYY-MM-DD"),
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: {
        cellPadding: 3,
        fontSize: 10,
        valign: "middle",
        halign: "center",
      },
      headStyles: {
        fillColor: [63, 81, 181],
        textColor: 255,
        fontStyle: "bold",
      },
    });

    doc.save("roles_list.pdf");
    toast.success("PDF exported successfully");
  };

  const handleExportExcel = () => {
    const data = roles.map((role) => ({
      Id: role.id,
      "Role Name": role.name,
      "Created At": dayjs(role.createdAt).format("YYYY-MM-DD"),
      "Updated At": dayjs(role.updatedAt).format("YYYY-MM-DD"),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Roles List");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const excelData = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(excelData, "roles_list.xlsx");
    toast.success("Excel exported successfully");
  };

  // Pagination handlers
  const handlePageChange = (event, newPage) => {
    dispatch(setPage(newPage));
  };

  const handlePageSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    dispatch(setPageSize(newSize));
    dispatch(setPage(1));
  };

  // CRUD handlers
  const handleEdit = (roleId) => {
    navigate(`/roles/${roleId}`);
  };

  const handleDeleteClick = (roleId) => {
    setRoleToDelete(roleId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deleteRole(roleToDelete)).unwrap();
      toast.success("Role deleted successfully");
      dispatch(getAllRolesListPagination({ page, pageSize }));
    } catch (error) {
      toast.error("Failed to delete role");
      console.error("Error deleting role:", error);
    } finally {
      setDeleteDialogOpen(false);
      setRoleToDelete(null);
    }
  };

  const handleAddRoles = () => {
    navigate("/roles/add-role");
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    dispatch(setPage(1));
  };

  // Columns configuration
  const columns = [
    { field: "id", headerName: "ID", width: 150, sortable: false },
    { field: "name", headerName: "Role Name", width: 400, sortable: false },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 400,
      sortable: false,
      renderCell: (params) =>
        dayjs(params.row.createdAt).format("YYYY-MM-DD"),
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      width: 400,
      sortable: false,
      renderCell: (params) =>
        dayjs(params.row.updatedAt).format("YYYY-MM-DD"),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 350,
      sortable: false,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <Tooltip title="Edit role">
            <ActionButton
              color="primary"
              disabled={roleId !== 1}
              onClick={() => handleEdit(params.row.id)}
            >
              <EditIcon fontSize="small" />
            </ActionButton>
          </Tooltip>
          <Tooltip title="Delete role">
            <ActionButton
              color="error"
              disabled={roleId !== 1}
              onClick={() => handleDeleteClick(params.row.id)}
            >
              <DeleteIcon fontSize="small" />
            </ActionButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const startEntry = (page - 1) * pageSize + 1;
  const endEntry = Math.min(page * pageSize, total);

  return (
    <Container elevation={3}>
      <Header>
        <Typography variant="h5" fontWeight="bold" color="textPrimary">
          Roles Management
        </Typography>

        <FilterSection>
          <SearchField
            variant="outlined"
            placeholder="Search roles..."
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

            {roleId === 1 && (
              <Tooltip title="Add new role">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddRoles}
                  startIcon={<AddIcon />}
                  size="small"
                >
                  Add Role
                </Button>
              </Tooltip>
            )}
          </Box>
        </FilterSection>
      </Header>

      {loading ? (
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
              rows={filteredRoles}
              columns={columns}
              pageSize={pageSize}
              rowsPerPageOptions={[5, 10, 20, 50]}
              paginationMode="server"
              rowCount={total}
              disableSelectionOnClick
              density="standard"
              getRowId={(row) => row.id}
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
              of <strong>{total}</strong> roles
            </Typography>

            <Box display="flex" alignItems="center" gap={5}>
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this role? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RoleTable;
