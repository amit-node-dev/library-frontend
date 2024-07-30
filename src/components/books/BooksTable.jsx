import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getAllBooksList,
  deleteBooks,
} from "../../features/book_module/bookActions";
import { DataGrid } from "@mui/x-data-grid";
import { Box, IconButton, Typography, Pagination } from "@mui/material";
import { ClipLoader } from "react-spinners";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { setPage, setPageSize } from "../../features/book_module/bookSlice";
import BookDetailsModal from "./BookDetailsModal";
import "./books.css";

const BooksTable = () => {
  const { books, loading, error, total, page, pageSize } = useSelector(
    (state) => state.books
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [sortModel, setSortModel] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getAllBooksList({ page, pageSize }));
  }, [dispatch, page, pageSize]);

  useEffect(() => {
    let filtered = books;
    if (searchQuery) {
      filtered = books.filter((book) =>
        `${book.bookname} ${book.description} ${book.authorId}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }
    setFilteredBooks(filtered);
  }, [searchQuery, books]);

  const handlePageChange = (event, newPage) => {
    dispatch(setPage(newPage));
    dispatch(getAllBooksList({ page: newPage, pageSize }));
  };

  const handlePageSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    dispatch(setPageSize(newSize));
    dispatch(setPage(1));
    dispatch(getAllBooksList({ page: 1, pageSize: newSize }));
  };

  const handleEdit = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  const handleDelete = async (bookId) => {
    try {
      await dispatch(deleteBooks(bookId)).unwrap();
      await dispatch(getAllBooksList({ page, pageSize })).unwrap();
    } catch (error) {
      console.log("ERROR IN DELETE USER ::: ", error);
    }
  };

  const handleView = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  // Custom date formatting function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Custom renderer for actions
  const ActionRenderer = (params) => (
    <div className="actions-container">
      <IconButton color="primary" onClick={() => handleView(params.row)}>
        <VisibilityIcon />
      </IconButton>
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
  );

  // Define columns with custom renderers
  const columns = [
    { field: "id", headerName: "Book Id", width: 110 },
    {
      field: "bookname",
      headerName: "Book Name",
      width: 150,
      editable: false,
    },
    {
      field: "description",
      headerName: "Description",
      width: 500,
      editable: false,
    },
    {
      field: "authorId",
      headerName: "Author",
      width: 100,
      editable: false,
    },
    {
      field: "createdAt",
      headerName: "Created Date",
      width: 150,
      renderCell: (params) => formatDate(params.row.createdAt),
    },
    {
      field: "updatedAt",
      headerName: "Updated Date",
      width: 150,
      renderCell: (params) => formatDate(params.row.updatedAt),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: ActionRenderer,
    },
  ];

  return (
    <div className="books-container">
      <div className="header">
        <Typography variant="h4" className="table-title">
          Books
        </Typography>
        <input
          type="text"
          className="search-input"
          placeholder="Search books..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      {loading ? (
        <div className="spinner-container">
          <ClipLoader size={50} color={"#123abc"} loading={loading} />
        </div>
      ) : error ? (
        <p>Error: {error}</p>
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
              rows={filteredBooks}
              density="standard"
              disableRowSelectionOnClick={true}
              hideFooter={true}
              getRowId={(row) => row.id + row.bookname}
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
              animation: "fadeIn 1s ease-in-out",
            }}
          />
        </>
      )}
      <BookDetailsModal
        open={isModalOpen}
        onClose={handleCloseModal}
        book={selectedBook}
        sx={{
          animation: "fadeIn 0.5s ease-in-out",
        }}
      />
    </div>
  );
};

export default BooksTable;
