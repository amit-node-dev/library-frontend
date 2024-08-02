import React, { useEffect, useState } from "react";

// THRID PARTY CONTENTS
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

// MUI CONTENTS
import { Box, IconButton, Typography, Pagination } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid } from "@mui/x-data-grid";

// CSS
import "./roles.css";

// ACTIONS & STORES
import {
  getAllRolesList,
  deleteRole,
} from "../../features/role_module/roleActions";
import { setPage, setPageSize } from "../../features/role_module/roleSlice";

const RoleTable = () => {
  const { roles, loading, error, total, page, pageSize } = useSelector(
    (state) => state.roles
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [sortModel, setSortModel] = useState([]);

  useEffect(() => {
    dispatch(getAllRolesList({ page, pageSize }));
  }, [dispatch, page, pageSize]);

  useEffect(() => {
    let filtered = roles;
    if (searchQuery) {
      filtered = roles.filter((user) =>
        `${user.role.name}`.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredRoles(filtered);
  }, [searchQuery, roles]);

  const handlePageChange = (event, newPage) => {
    dispatch(setPage(newPage));
  };

  const handlePageSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    dispatch(setPageSize(newSize));
    dispatch(setPage(1));
  };

  const handleEdit = (roleId) => {
    navigate(`/roles/${roleId}`);
  };

  const handleDelete = async (roleId) => {
    try {
      await dispatch(deleteRole(roleId)).unwrap();
      await dispatch(getAllRolesList({ page, pageSize })).unwrap();
    } catch (error) {
      console.log("ERROR IN DELETE ROLE ::: ", error);
    }
  };

  // Custom date formatting function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Define columns with custom renderers
  const columns = [
    { field: "id", headerName: "Id", width: 150 },
    {
      field: "name",
      headerName: "Role Name",
      width: 250,
      renderCell: (params) => params.row.name,
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
      width: 250,
      renderCell: (params) => (
        <div className="actions-container">
          <IconButton color="primary" onClick={() => handleEdit(params.row.id)}>
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDelete(params.row.id)}
            style={{ marginLeft: 10 }}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const handleAddRoles = () => {
    navigate("/roles/add_roles");
  };

  return (
    <div className="role-table-container">
      <div className="role-header">
        <Typography variant="h4" className="table-title">
          Roles
        </Typography>
        <div className="role-util">
          <button onClick={handleAddRoles} className="role-add-button">
            Add Roles
          </button>
          <input
            type="text"
            className="role-search-input"
            placeholder="Search roles..."
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
              border: "1px solid #ddd",
              borderRadius: "4px",
              margin: "30px auto",
              animation: "fadeIn 1s ease-in-out",
            }}
          >
            <DataGrid
              rows={filteredRoles}
              density="standard"
              disableRowSelectionOnClick={true}
              hideFooter={true}
              getRowId={(row) => row.id + row.name}
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
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                },
                "& .MuiDataGrid-footerContainer": {
                  borderTop: "1px solid #ddd",
                },
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "#e0f7fa",
                },
              }}
            />
          </Box>
          <Pagination
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

export default RoleTable;
