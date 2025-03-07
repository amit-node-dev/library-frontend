import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// THRID PARTY CONTENTS
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

// MUI CONTENTS
import {
  Box,
  IconButton,
  Typography,
  Pagination,
  Fab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid } from "@mui/x-data-grid";

// CSS
import "./users.css";

// ACTIONS & STORES
import {
  getAllUsersList,
  deleteUsers,
} from "../../features/user_module/userActions";
import { getAllRolesList } from "../../features/role_module/roleActions";
import { setPage, setPageSize } from "../../features/user_module/userSlice";

const UsersTable = () => {
  const { users, loading, error, total, page, pageSize } = useSelector(
    (state) => state.users
  );
  const { roles } = useSelector((state) => state.roles);

  const userId = localStorage.getItem("userId") || "";

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortModel, setSortModel] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");

  const startEntry = (page - 1) * pageSize + 1;
  const endEntry = Math.min(page * pageSize, total);

  const roleId = localStorage.getItem("roleId");

  useEffect(() => {
    dispatch(
      getAllUsersList({
        page,
        pageSize,
        searchQuery,
        selectedRole,
      })
    );
    dispatch(getAllRolesList());
  }, [dispatch, page, pageSize, searchQuery, selectedRole]);

  // Function to export data as PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Users List", 14, 15);

    const tableColumn = [
      "Id",
      "Full Name",
      "Role",
      "Email Id",
      "Mobile No",
      "Created Date",
      "Updated Date",
    ];

    const tableRows = users.map((user) => [
      user.id,
      user.firstname + " " + user.lastname,
      user.role?.name,
      user.email,
      user.mobileNumber,
      user.createdAt,
      user.updatedAt,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("users_list.pdf");
  };

  // Function to export data as Excel
  const handleExportExcel = () => {
    const data = users.map((user) => ({
      Id: user.id,
      "Full Name": user.firstname + " " + user.lastname,
      Role: user.role?.name,
      "Email Id": user.email,
      "Mobile No": user.mobileNumber,
      "Created At": user.createdAt,
      "Updated At": user.updatedAt,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const excelData = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(excelData, "users_list.xlsx");
  };

  // Handle export selection
  const handleExport = (format) => {
    if (format === "pdf") {
      handleExportPDF();
    } else if (format === "excel") {
      handleExportExcel();
    }
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

  const handleDelete = async (userId) => {
    try {
      await dispatch(deleteUsers(userId)).unwrap();
      await dispatch(getAllUsersList({ page, pageSize })).unwrap();
    } catch (error) {
      console.log("ERROR IN DELETE USER ::: ", error);
    }
  };

  const ActionRenderer = (params) => {
    const isCurrentUser = params.row.id.toString() === userId;
    return (
      <div className="actions-container">
        <Tooltip title="Edit">
          <IconButton
            color="primary"
            onClick={() => handleEdit(params.row.id)}
            disabled={roleId !== "1"}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip
          title={isCurrentUser ? "You cannot delete yourself" : "Delete"}
        >
          <IconButton
            color="error"
            onClick={() => handleDelete(params.row.id)}
            style={{ marginLeft: 10 }}
            disabled={roleId !== "1" || isCurrentUser}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </div>
    );
  };

  // Define columns with custom renderers
  const columns = [
    { field: "id", headerName: "Id", width: 150 },
    {
      field: "fullname",
      headerName: "Fullname",
      width: 250,
      renderCell: (params) => params.row.firstname + " " + params.row.lastname,
    },
    { field: "email", headerName: "Email Id", width: 250 },
    { field: "mobileNumber", headerName: "Mobile No", width: 200 },
    {
      field: "role",
      headerName: "Role",
      width: 150,
      renderCell: (params) => {
        let chipColor;
        let chipLabel;
        switch (params.row.role?.name) {
          case "super_admin":
            chipColor = "success";
            chipLabel = "Super Admin";
            break;
          case "admin":
            chipColor = "secondary";
            chipLabel = "Admin";
            break;
          case "customer":
            chipColor = "warning";
            chipLabel = "Customer";
            break;
          default:
            chipColor = "default";
            chipLabel = "Unknown";
            break;
        }

        return (
          <Chip
            size="small"
            label={chipLabel}
            color={chipColor}
            variant="contained"
          />
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 200,
      renderCell: (params) =>
        params.row.createdAt
          ? dayjs(params.row.createdAt).format("YYYY-MM-DD")
          : "N/A",
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      width: 200,
      renderCell: (params) =>
        params.row.updatedAt
          ? dayjs(params.row.updatedAt).format("YYYY-MM-DD")
          : "N/A",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      renderCell: ActionRenderer,
    },
  ];

  const handleAddUsers = () => {
    navigate("/users/add-user");
  };

  return (
    <div className="users-table-container">
      <div className="user-header">
        <Typography variant="h4" sx={{ fontFamily: "sans-serif" }}>
          Users
        </Typography>
        <div className="user-util">
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

          <FormControl variant="filled" sx={{ mx: 3, minWidth: 150 }}>
            <InputLabel id="role-select-label">By Role</InputLabel>
            <Select
              labelId="role-select-label"
              id="role-select"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <MenuItem value="">Select Role</MenuItem>
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {roleId === "1" && (
            <Tooltip title="Add">
              <Fab
                size="small"
                color="warning"
                aria-label="add"
                sx={{ marginRight: "2rem" }}
              >
                <AddIcon onClick={handleAddUsers} />
              </Fab>
            </Tooltip>
          )}
          <input
            type="text"
            className="user-search-input"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      {loading ? (
        <div className="spinner-container">
          <ClipLoader size={50} color={"#007bff"} loading={loading} />
        </div>
      ) : error ? (
        <p className="error-message">Error: {error}</p>
      ) : (
        <>
          <Box
            sx={{
              height: "auto",
              width: "100%",
              margin: "30px auto",
              animation: "fadeIn 1s ease-in-out",
            }}
          >
            <DataGrid
              density="compact"
              rows={users}
              disableRowSelectionOnClick={true}
              hideFooter={true}
              getRowId={(row) =>
                row ? row.id + row.firstname + row.lastname : ""
              }
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

export default UsersTable;
