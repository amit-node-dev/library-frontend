import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getAllAuthorsList,
  deleteAuthors,
} from "../../features/author_module/authorActions";
import { Box, IconButton, Typography, Pagination } from "@mui/material";
import { ClipLoader } from "react-spinners";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { setPage, setPageSize } from "../../features/author_module/authorSlice";
import { DataGrid } from "@mui/x-data-grid";
import "./authors.css";

const AuthorsTable = () => {
  const { authors, loading, error, total, page, pageSize } = useSelector(
    (state) => state.authors
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAuthors, setFilteredAuthors] = useState([]);
  const [sortModel, setSortModel] = useState([]);

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
    dispatch(getAllAuthorsList({ page: newPage, pageSize }));
  };

  const handlePageSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    dispatch(setPageSize(newSize));
    dispatch(setPage(1));
    dispatch(getAllAuthorsList({ page: 1, pageSize: newSize }));
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

  // Define columns with custom renderers
  const columns = [
    { field: "id", headerName: "ID", width: 110 },
    { field: "firstname", headerName: "First Name", width: 150 },
    { field: "lastname", headerName: "Last Name", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "createdAt", headerName: "Created at", width: 200 },
    { field: "updatedAt", headerName: "Updated at", width: 200 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
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

  return (
    <div className="authors-table-container">
      <div className="header">
        <Typography variant="h4" className="table-title">
          Authors
        </Typography>
        <input
          type="text"
          className="search-input"
          placeholder="Search authors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
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

export default AuthorsTable;
