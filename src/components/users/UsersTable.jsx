import React, { useEffect, useState } from "react";

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

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [sortModel, setSortModel] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");

  const roleId = localStorage.getItem("roleId");

  useEffect(() => {
    dispatch(getAllUsersList({ page, pageSize }));
    dispatch(getAllRolesList());
  }, [dispatch, page, pageSize]);

  useEffect(() => {
    let filtered = users;
    if (searchQuery) {
      filtered = users.filter((user) =>
        `${user.firstname} ${user.lastname} ${user.email} ${user.role.name}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }
    if (selectedRole) {
      filtered = filtered.filter((user) => user.roleId === selectedRole);
    }
    setFilteredUsers(filtered);
  }, [searchQuery, selectedRole, users]);

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

  // Custom date formatting function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const ActionRenderer = (params) => {
    return (
      <div className="actions-container">
        <IconButton
          color="primary"
          onClick={() => handleEdit(params.row.id)}
          disabled={roleId !== "1"}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          color="error"
          onClick={() => handleDelete(params.row.id)}
          style={{ marginLeft: 10 }}
          disabled={roleId !== "1"}
        >
          <DeleteIcon />
        </IconButton>
      </div>
    );
  };

  // Define columns with custom renderers
  const columns = [
    { field: "id", headerName: "Id", width: 200 },
    {
      field: "fullname",
      headerName: "Fullname",
      width: 250,
      renderCell: (params) => params.row.firstname + " " + params.row.lastname,
    },
    { field: "email", headerName: "Email Id", width: 250 },
    {
      field: "role",
      headerName: "Role",
      width: 250,
      renderCell: (params) => (params.row.role ? params.row.role.name : "N/A"),
    },
    {
      field: "createdAt",
      headerName: "Created Date",
      width: 250,
      renderCell: (params) => formatDate(params.row.createdAt),
    },
    {
      field: "updatedAt",
      headerName: "Updated Date",
      width: 250,
      renderCell: (params) => formatDate(params.row.updatedAt),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: ActionRenderer,
    },
  ];

  const handleAddUsers = () => {
    navigate("/users/add_users");
  };

  return (
    <div className="users-table-container">
      <div className="user-header">
        <Typography variant="h4" className="table-title">
          Users
        </Typography>
        <div className="user-util">
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
            <Fab
              size="small"
              color="warning"
              aria-label="add"
              sx={{ marginRight: "2rem" }}
            >
              <AddIcon onClick={handleAddUsers} />
            </Fab>
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
              rows={filteredUsers}
              density="standard"
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
            }}
          />
        </>
      )}
    </div>
  );
};

export default UsersTable;
