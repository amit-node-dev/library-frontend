import React, { useEffect, useState } from "react";
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
  Tooltip,
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
import "./roles.css";

// ACTIONS & STORES
import {
  deleteRole,
  getAllRolesListPagination,
} from "../../features/role_module/roleActions";
import { setPage, setPageSize } from "../../features/role_module/roleSlice";
import dayjs from "dayjs";

const RoleTable = () => {
  const { roles, loading, error, total, page, pageSize } = useSelector(
    (state) => state.roles
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [sortModel, setSortModel] = useState([]);

  const startEntry = (page - 1) * pageSize + 1;
  const endEntry = Math.min(page * pageSize, total);

  const roleId = localStorage.getItem("roleId");

  useEffect(() => {
    dispatch(getAllRolesListPagination({ page, pageSize }));
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

  // Function to export data as PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Roles List", 14, 15);

    const tableColumn = ["Id", "Role Name", "Created Date", "Updated Date"];

    const tableRows = roles.map((role) => [
      role.id,
      role.name,
      role.createdAt,
      role.updatedAt,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("roles_list.pdf");
  };

  // Function to export data as Excel
  const handleExportExcel = () => {
    const data = roles.map((role) => ({
      Id: role.id,
      "Role Name": role.name,
      "Created At": role.createdAt,
      "Updated At": role.updatedAt,
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

  const handleEdit = (roleId) => {
    navigate(`/roles/${roleId}`);
  };

  const handleDelete = async (roleId) => {
    try {
      await dispatch(deleteRole(roleId)).unwrap();
      await dispatch(getAllRolesListPagination({ page, pageSize })).unwrap();
    } catch (error) {
      console.log("ERROR IN DELETE ROLE ::: ", error);
    }
  };

  // Define columns with custom renderers
  const columns = [
    { field: "id", headerName: "Id", width: 250 },
    {
      field: "name",
      headerName: "Role name",
      width: 350,
      renderCell: (params) => params.row.name,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 350,
      renderCell: (params) =>
        params.row.createdAt
          ? dayjs(params.row.createdAt).format("YYYY-MM-DD")
          : "N/A",
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      width: 350,
      renderCell: (params) =>
        params.row.updatedAt
          ? dayjs(params.row.updatedAt).format("YYYY-MM-DD")
          : "N/A",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 400,
      renderCell: (params) => (
        <div className="actions-container">
          <Tooltip title="Edit">
            <IconButton
              color="primary"
              disabled={roleId !== "1"}
              onClick={() => handleEdit(params.row.id)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              color="error"
              disabled={roleId !== "1"}
              onClick={() => handleDelete(params.row.id)}
              style={{ marginLeft: 10 }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
  ];

  const handleAddRoles = () => {
    navigate("/roles/add-role");
  };

  return (
    <div className="role-table-container">
      <div className="role-header">
        <Typography variant="h4" sx={{ fontFamily: "sans-serif" }}>
          Roles
        </Typography>
        <div className="role-util">
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

          {roleId === "1" && (
            <Tooltip title="Add">
              <Fab
                size="small"
                color="warning"
                aria-label="add"
                sx={{ marginRight: "2rem" }}
              >
                <AddIcon onClick={handleAddRoles} />
              </Fab>
            </Tooltip>
          )}
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
              margin: "30px auto",
              animation: "fadeIn 1s ease-in-out",
            }}
          >
            <DataGrid
              rows={filteredRoles}
              density="compact"
              disableRowSelectionOnClick={true}
              hideFooter={true}
              getRowId={(row) => (row ? row.id + row.name : "")}
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

export default RoleTable;
