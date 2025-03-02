import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// THIRD PARTY IMPORTS
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

// MUI IMPORTS
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
} from "@mui/material";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

// CUSTOM COMPONENTS
import BookDetailsModal from "./BookDetailsModal";

// ACTIONS & STORES
import {
  getAllBooksList,
  deleteBooks,
} from "../../features/book_module/bookActions";
import { getAllAuthorsList } from "../../features/author_module/authorActions";
import { getAllCategoryList } from "../../features/category_module/categoryActions";
import { setPage, setPageSize } from "../../features/book_module/bookSlice";

// CSS IMPORTS
import "./books.css";

const BooksTable = () => {
  const { books, loading, error, total, page, pageSize } = useSelector(
    (state) => state.books
  );
  const { authors } = useSelector((state) => state.authors);
  const { categories } = useSelector((state) => state.categories);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortModel, setSortModel] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const startEntry = (page - 1) * pageSize + 1;
  const endEntry = Math.min(page * pageSize, total);

  const roleId = localStorage.getItem("roleId");

  useEffect(() => {
    dispatch(
      getAllBooksList({
        page,
        pageSize,
        searchQuery,
        selectedCategory,
        selectedAuthor,
      })
    );
    dispatch(getAllCategoryList());
    dispatch(getAllAuthorsList());
  }, [dispatch, page, pageSize, searchQuery, selectedCategory, selectedAuthor]);

  // Function to export data as PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Books List", 14, 15);

    const tableColumn = [
      "Id",
      "ISBN",
      "Book Name",
      "Publisher",
      "Publication Year",
      "Points Required",
      "Category",
      "Total Copies",
      "Available Copies",
      "Location",
    ];

    const tableRows = books.map((book) => [
      book.id,
      book.isbn,
      book.bookname,
      book.publisher,
      book.publication_year,
      book.points_required,
      book.category?.name || "N/A",
      book.total_copies,
      book.available_copies,
      book.location,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("books_list.pdf");
  };

  // Function to export data as Excel
  const handleExportExcel = () => {
    const data = books.map((book) => ({
      Id: book.id,
      ISBN: book.isbn,
      "Book Name": book.bookname,
      Publisher: book.publisher,
      "Publication Year": book.publication_year,
      "Points Required": book.points_required,
      Category: book.category?.name || "N/A",
      "Total Copies": book.total_copies,
      "Available Copies": book.available_copies,
      Location: book.location,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Books");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const excelData = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(excelData, "books_list.xlsx");
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

  // Custom renderer for actions
  const ActionRenderer = (params) => (
    <div className="actions-container">
      <Tooltip title="View">
        <IconButton color="secondary" onClick={() => handleView(params.row)}>
          <VisibilityIcon />
        </IconButton>
      </Tooltip>
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
  );

  // Define columns with custom renderers
  const columns = [
    { field: "id", headerName: "Id", width: 70, sortable: false },
    {
      field: "isbn",
      headerName: "ISBN",
      width: 150,
      sortable: false,
    },
    {
      field: "bookname",
      headerName: "Book Name",
      width: 250,
      sortable: false,
    },
    {
      field: "publisher",
      headerName: "Publisher",
      width: 200,
      sortable: false,
    },
    {
      field: "publication_year",
      headerName: "Publication Year",
      width: 150,
      sortable: false,
    },
    {
      field: "points_required",
      headerName: "Points Required",
      width: 150,
      sortable: false,
    },
    {
      field: "category",
      headerName: "Category",
      width: 150,
      sortable: false,
      renderCell: (params) => params.row.category?.name,
    },
    {
      field: "total_copies",
      headerName: "Total Copies",
      width: 120,
      sortable: false,
    },
    {
      field: "available_copies",
      headerName: "Available Copies",
      width: 150,
      sortable: false,
    },
    {
      field: "location",
      headerName: "Location",
      width: 150,
      sortable: false,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: ActionRenderer,
    },
  ];

  const handleAddBook = () => {
    navigate("/books/add-book");
  };

  return (
    <div className="book-container">
      <div className="book-header">
        <Typography variant="h4" sx={{ fontFamily: "sans-serif" }}>
          List of Books
        </Typography>
        <div className="book-util">
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

          {/* Category Filters */}
          <FormControl variant="filled" sx={{ mx: 3, minWidth: 150 }}>
            <InputLabel id="category-select-label">By Category</InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <MenuItem value="">Select Category</MenuItem>
              {categories?.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Author Filters */}
          <FormControl variant="filled" sx={{ mx: 3, minWidth: 150 }}>
            <InputLabel id="author-select-label">By Author</InputLabel>
            <Select
              labelId="author-select-label"
              id="author-select"
              value={selectedAuthor}
              onChange={(e) => setSelectedAuthor(e.target.value)}
            >
              <MenuItem value="">Select Author</MenuItem>
              {authors?.map((author) => (
                <MenuItem key={author.id} value={author.id}>
                  {author.firstname} {author.lastname}
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
                <AddIcon onClick={handleAddBook} />
              </Fab>
            </Tooltip>
          )}

          <input
            type="text"
            className="book-search-input"
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
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
              margin: "0px auto",
              animation: "fadeIn 1s ease-in-out",
            }}
          >
            <DataGrid
              rows={books}
              density="compact"
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
