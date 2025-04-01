import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  Tooltip,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
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
import { getAllUsersList, deleteUsers } from "../../features/user_module/userActions";
import { getAllRolesList } from "../../features/role_module/roleActions";
import { setPage, setPageSize } from "../../features/user_module/userSlice";

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

const RoleChip = styled(Chip)(({ theme, role }) => ({
  fontWeight: 600,
  ...(role === "super_admin" && {
    backgroundColor: "#4caf50",
    color: "#fff",
  }),
  ...(role === "admin" && {
    backgroundColor: "#2196f3",
    color: "#fff",
  }),
  ...(role === "customer" && {
    backgroundColor: "#ff9800",
    color: "#fff",
  }),
}));

const UsersTable = () => {
  const theme = useTheme();
  const { users, loading, error, total, page, pageSize } = useSelector(
    (state) => state.users
  );
  const { roles } = useSelector((state) => state.roles);

  const userId = localStorage.getItem("userId") || "";
  const roleId = localStorage.getItem("roleId");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Calculate pagination entries
  const startEntry = (page - 1) * pageSize + 1;
  const endEntry = Math.min(page * pageSize, total);

  // Fetch users when filters change
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await dispatch(
          getAllUsersList({ 
            page, 
            pageSize, 
            searchQuery, 
            selectedRole 
          })
        ).unwrap();
        await dispatch(getAllRolesList()).unwrap();
      } catch (error) {
        toast.error("Failed to load users");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [dispatch, page, pageSize, searchQuery, selectedRole]);

  // Enhanced PDF export
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Users Report", 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${dayjs().format("YYYY-MM-DD HH:mm")}`, 14, 22);

    const tableColumn = [
      "ID",
      "Full Name",
      "Role",
      "Email",
      "Mobile",
      "Created At",
      "Updated At"
    ];

    const tableRows = users.map((user) => [
      user.id,
      `${user.firstname} ${user.lastname}`,
      user.role?.name || "N/A",
      user.email,
      user.mobileNumber,
      dayjs(user.createdAt).format("YYYY-MM-DD"),
      dayjs(user.updatedAt).format("YYYY-MM-DD"),
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
    });

    doc.save(`users_report_${dayjs().format("YYYYMMDD")}.pdf`);
    toast.success("PDF exported successfully");
  };

  // Enhanced Excel export
  const handleExportExcel = () => {
    const data = users.map((user) => ({
      ID: user.id,
      "Full Name": `${user.firstname} ${user.lastname}`,
      Role: user.role?.name || "N/A",
      Email: user.email,
      "Mobile Number": user.mobileNumber,
      "Created At": dayjs(user.createdAt).format("YYYY-MM-DD"),
      "Updated At": dayjs(user.updatedAt).format("YYYY-MM-DD"),
      Status: user.status || "Active",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    // Auto-size columns
    const wscols = [
      { wch: 10 }, // ID
      { wch: 25 }, // Full Name
      { wch: 15 }, // Role
      { wch: 30 }, // Email
      { wch: 15 }, // Mobile Number
      { wch: 15 }, // Created At
      { wch: 15 }, // Updated At
      { wch: 15 }, // Status
    ];
    worksheet["!cols"] = wscols;

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const excelData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(excelData, `users_report_${dayjs().format("YYYYMMDD")}.xlsx`);
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

  const handleEdit = (userId) => {
    navigate(`/users/${userId}`);
  };

  const handleDeleteClick = (userId) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deleteUsers(userToDelete)).unwrap();
      toast.success("User deleted successfully");
      dispatch(getAllUsersList({ page, pageSize }));
    } catch (error) {
      toast.error("Failed to delete user");
      console.error("Error deleting user:", error);
    } finally {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleAddUser = () => {
    navigate("/users/add-user");
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedRole("");
    dispatch(setPage(1));
  };

  const handleRefresh = () => {
    dispatch(getAllUsersList({ page, pageSize, searchQuery, selectedRole }));
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
      field: "fullname",
      headerName: "Full Name",
      width: 220,
      valueGetter: (params) => `${params.row.firstname} ${params.row.lastname}`,
    },
    {
      field: "email",
      headerName: "Email",
      width: 250,
    },
    {
      field: "mobileNumber",
      headerName: "Mobile",
      width: 150,
    },
    {
      field: "role",
      headerName: "Role",
      width: 150,
      renderCell: (params) => {
        const roleName = params.row.role?.name || "unknown";
        const displayName = {
          super_admin: "Super Admin",
          admin: "Admin",
          customer: "Customer",
        }[roleName] || "Unknown";
        
        return (
          <RoleChip
            size="small"
            label={displayName}
            role={roleName}
          />
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Created",
      width: 120,
      valueFormatter: (params) =>
        params.value ? dayjs(params.value).format("MMM D, YYYY") : "-",
    },
    {
      field: "updatedAt",
      headerName: "Updated",
      width: 120,
      valueFormatter: (params) =>
        params.value ? dayjs(params.value).format("MMM D, YYYY") : "-",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params) => {
        const isCurrentUser = params.row.id.toString() === userId;
        return (
          <Box display="flex" gap={1}>
            <Tooltip title="Edit user">
              <IconButton
                color="primary"
                size="small"
                onClick={() => handleEdit(params.row.id)}
                disabled={roleId !== "1"}
              >
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={isCurrentUser ? "Cannot delete yourself" : "Delete user"}>
              <IconButton
                color="error"
                size="small"
                onClick={() => handleDeleteClick(params.row.id)}
                disabled={roleId !== "1" || isCurrentUser}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  return (
    <Container elevation={3}>
      <Header>
        <Typography variant="h5" fontWeight="bold" color="textPrimary">
          User Management
        </Typography>
        
        <FilterSection>
          <SearchField
            variant="outlined"
            placeholder="Search users..."
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
            <InputLabel>Role</InputLabel>
            <Select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              label="Role"
            >
              <MenuItem value="">All Roles</MenuItem>
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
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

            {roleId === "1" && (
              <Tooltip title="Add new user">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddUser}
                  startIcon={<Add />}
                  size="small"
                >
                  Add User
                </Button>
              </Tooltip>
            )}
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
              rows={users}
              columns={columns}
              pageSize={pageSize}
              rowsPerPageOptions={[5, 10, 20, 50]}
              paginationMode="server"
              rowCount={total}
              disableSelectionOnClick
              density="comfortable"
              getRowId={(row) => row.id}
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
              Showing {startEntry} to {endEntry} of {total} users
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm User Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this user? This action cannot be undone.
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

export default UsersTable;