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
import {
  getAllUsersList,
  deleteUsers,
} from "../../features/user_module/userActions";
import { getAllRolesList } from "../../features/role_module/roleActions";
import { setPage, setPageSize } from "../../features/user_module/userSlice";

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

const UsersTable = () => {
  const theme = useTheme();
  const { users, loading, error, total, page, pageSize } = useSelector(
    (state) => state.users
  );
  const { roles } = useSelector((state) => state.roles);

  const userData = localStorage.getItem("userData");
  const userInfo = JSON.parse(userData) || {};

  const userId = userInfo.id;
  const roleId = userInfo.roleId;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

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
            selectedRole,
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
      "Updated At",
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
      { wch: 10 },
      { wch: 25 },
      { wch: 15 },
      { wch: 30 },
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
      width: 70,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "firstName",
      headerName: "Firstname",
      width: 140,
    },
    {
      field: "lastName",
      headerName: "Lastname",
      width: 140,
    },
    {
      field: "emailId",
      headerName: "Email",
      width: 250,
    },
    {
      field: "mobileNumber",
      headerName: "Mobile",
      width: 150,
    },
    {
      field: "age",
      headerName: "Age",
      width: 120,
    },
    {
      field: "role",
      headerName: "Role",
      width: 170,
      renderCell: (params) => {
        const roleName = params.row.role?.name || "unknown";
        const roleId = params.row.role?.id?.toString();

        // Mapping for display names
        const displayName =
          {
            super_admin: "Super Admin",
            admin: "Admin",
            librarian: "Librarian",
            customer: "Customer",
            guest: "Guest",
          }[roleName] || "Unknown";

        // Color mapping based on role
        const colorMap = {
          "1": "primary",
          "2": "secondary",
          "3": "info",
          "4": "success",
          "5": "warning",
        };

        return (
          <Chip
            size="small"
            label={displayName}
            color={colorMap[roleId] || "default"}
            sx={{
              fontWeight: ["1", "2"].includes(roleId) ? "bold" : "normal",
              textTransform: "capitalize",
            }}
          />
        );
      },
    },
    {
      field: "points",
      headerName: "Points",
      width: 100,
    },
    {
      field: "createdAt",
      headerName: "Created",
      width: 200,
      renderCell: (params) => {
        if (!params.value) return null;
        return (
          <span>{new Date(params.value).toISOString().split("T")[0]}</span>
        );
      },
    },
    {
      field: "updatedAt",
      headerName: "Updated",
      width: 200,
      renderCell: (params) => {
        if (!params.value) return null;
        return (
          <span>{new Date(params.value).toISOString().split("T")[0]}</span>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params) => {
        const isCurrentUser = params.row?.id === userId;
        const currentUserRole = roleId;

        const isAuthorizedUser = [1, 2].includes(currentUserRole);
        const shouldDisableButtons = !isAuthorizedUser || isCurrentUser;

        return (
          <Box display="flex" gap={1}>
            <Tooltip
              title={
                !isAuthorizedUser
                  ? "Requires admin privileges"
                  : isCurrentUser
                  ? "Cannot edit yourself"
                  : "Edit user"
              }
            >
              <span>
                <IconButton
                  color="primary"
                  size="small"
                  onClick={() => handleEdit(params.row.id)}
                  disabled={shouldDisableButtons}
                >
                  <Edit fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip
              title={
                !isAuthorizedUser
                  ? "Requires admin privileges"
                  : isCurrentUser
                  ? "Cannot delete yourself"
                  : "Delete user"
              }
            >
              <span>
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => handleDeleteClick(params.row.id)}
                  disabled={shouldDisableButtons}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  // Calculate pagination entries
  const startEntry = (page - 1) * pageSize + 1;
  const endEntry = Math.min(page * pageSize, total);

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
                <IconButton size="small" onClick={() => setSearchQuery("")}>
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

            {roleId === 1 && (
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
              rows={users}
              columns={columns}
              pageSize={pageSize}
              rowsPerPageOptions={[5, 10, 20, 50]}
              paginationMode="server"
              rowCount={total}
              disableSelectionOnClick
              density="standard"
              getRowId={(row) => row.id + row.firstName + row.emailId}
              hideFooter
              loading={loading || isLoading}
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

            <Box display="flex" alignItems="center" gap={2}>
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm User Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this user? This action cannot be
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

export default UsersTable;
