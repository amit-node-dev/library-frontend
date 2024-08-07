import React, { useEffect, useState } from "react";

// THIRD PARTY COMPONENTS
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

// MUI CONTENTS
import { Box, IconButton, Typography, Pagination, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid } from "@mui/x-data-grid";

// CSS
import "./authors.css";

// ACTIONS & STORES
import {
  getAllAuthorsList,
  deleteAuthors,
} from "../../features/author_module/authorActions";
import { setPage, setPageSize } from "../../features/author_module/authorSlice";

const AuthorsTable = () => {
  const { authors, loading, error, total, page, pageSize } = useSelector(
    (state) => state.authors
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAuthors, setFilteredAuthors] = useState([]);
  const [sortModel, setSortModel] = useState([]);

  const roleId = localStorage.getItem("roleId");

  useEffect(() => {
    dispatch(getAllAuthorsList({ page, pageSize }));
  }, [dispatch, page, pageSize]);

  useEffect(() => {
    let filtered = authors;
    if (searchQuery) {
      filtered = authors.filter((author) =>
        `${author.firstname} ${author.lastname} ${author.email}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }
    setFilteredAuthors(filtered);
  }, [searchQuery, authors]);

  const handlePageChange = (event, newPage) => {
    dispatch(setPage(newPage));
  };

  const handlePageSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    dispatch(setPageSize(newSize));
    dispatch(setPage(1));
  };

  const handleEdit = (authorId) => {
    navigate(`/authors/${authorId}`);
  };

  const handleDelete = async (authorId) => {
    try {
      await dispatch(deleteAuthors(authorId)).unwrap();
      await dispatch(getAllAuthorsList({ page, pageSize })).unwrap();
    } catch (error) {
      console.log("ERROR IN DELETE AUTHOR ::: ", error);
    }
  };

  // Custom date formatting function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Define columns with custom renderers
  const columns = [
    { field: "id", headerName: "Id", width: 200 },
    {
      field: "fullname",
      headerName: "Fullname",
      width: 300,
      renderCell: (params) => params.row.firstname + " " + params.row.lastname,
    },
    { field: "email", headerName: "Email Id", width: 300 },
    {
      field: "createdAt",
      headerName: "Created at",
      width: 250,
      renderCell: (params) => formatDate(params.row.createdAt),
    },
    {
      field: "updatedAt",
      headerName: "Updated at",
      width: 250,
      renderCell: (params) => formatDate(params.row.updatedAt),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      renderCell: (params) => (
        <div className="actions-container">
          <IconButton
            color="primary"
            disabled={roleId !== "1"}
            onClick={() => handleEdit(params.row.id)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            disabled={roleId !== "1"}
            onClick={() => handleDelete(params.row.id)}
            style={{ marginLeft: 10 }}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const handleAddAuthors = () => {
    navigate("/authors/add_authors");
  };

  return (
    <div className="authors-table-container">
      <div className="author-header">
        <Typography variant="h4" className="table-title">
          Authors
        </Typography>
        <div className="author-util">
          {roleId === "1" && (
            <Fab
              size="small"
              color="warning"
              aria-label="add"
              sx={{ marginRight: "2rem" }}
            >
              <AddIcon onClick={handleAddAuthors} />
            </Fab>
          )}
          <input
            type="text"
            className="author-search-input"
            placeholder="Search authors..."
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
              rows={filteredAuthors}
              density="standard"
              disableRowSelectionOnClick={true}
              hideFooter={true}
              getRowId={(row) => row.id + row.firstname + row.lastname}
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

export default AuthorsTable;
