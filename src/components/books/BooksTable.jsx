import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
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
  TextField,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Visibility,
  PictureAsPdf,
  GridOn,
  Clear,
  Search,
} from "@mui/icons-material";
import { styled } from "@mui/system";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// Actions & Stores
import {
  getAllBooksList,
  deleteBooks,
} from "../../features/book_module/bookActions";
import { setPage, setPageSize } from "../../features/book_module/bookSlice";
import { getAllAuthorsList } from "../../features/author_module/authorActions";
import { getAllCategoryList } from "../../features/category_module/categoryActions";
import BookDetailsModal from "./BookDetailsModal";

// Styled Components
const Container = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  borderRadius: "10px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  backgroundColor: "#f5f7fa",
  position: "relative", 
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

const ActionButton = styled(IconButton)(({ theme }) => ({
  transition: "all 0.2s ease",
  "&:hover": {
    transform: "scale(1.1)",
  },
}));

const BooksTable = () => {
  const { books, loading, error, total, page, pageSize } = useSelector(
    (state) => state.books
  );
  const { authors } = useSelector((state) => state.authors);
  const { categories } = useSelector((state) => state.categories);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  const userData = localStorage.getItem("userData");
  const userInfo = JSON.parse(userData) || {};
  const roleId = userInfo?.roleId || 0;

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

  // Export functions
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
      book.bookName,
      book.publisher,
      book.publicationYear,
      book.pointsRequired,
      book.category?.name || "N/A",
      book.totalCopies,
      book.availableCopies,
      book.location,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: {
        cellPadding: 3,
        fontSize: 10,
        valign: "middle",
        halign: "center",
      },
      headStyles: {
        fillColor: [63, 81, 181],
        textColor: 255,
        fontStyle: "bold",
      },
    });

    doc.save("books_list.pdf");
    toast.success("PDF exported successfully");
  };

  const handleExportExcel = () => {
    const data = books.map((book) => ({
      Id: book.id,
      ISBN: book.isbn,
      "Book Name": book.bookName,
      Publisher: book.publisher,
      "Publication Year": book.publicationYear,
      "Points Required": book.pointsRequired,
      Category: book.category?.name || "N/A",
      "Total Copies": book.totalCopies,
      "Available Copies": book.availableCopies,
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
    toast.success("Excel exported successfully");
  };

  // Pagination handlers
  const handlePageChange = (event, newPage) => {
    dispatch(setPage(newPage));
  };

  const handlePageSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    dispatch(setPageSize(newSize));
    dispatch(setPage(1));
  };

  // CRUD handlers
  const handleEdit = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  const handleDeleteClick = (bookId) => {
    setBookToDelete(bookId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deleteBooks(bookToDelete)).unwrap();
      toast.success("Book deleted successfully");
      dispatch(getAllBooksList({ page, pageSize }));
    } catch (error) {
      toast.error("Failed to delete book");
      console.error("Error deleting book:", error);
    } finally {
      setDeleteDialogOpen(false);
      setBookToDelete(null);
    }
  };

  const handleView = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleAddBook = () => {
    navigate("/books/add-book");
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedAuthor("");
    setSelectedCategory("");
    dispatch(setPage(1));
  };

  // Columns configuration
  const columns = [
    { field: "id", headerName: "ID", width: 100, sortable: false },
    { field: "isbn", headerName: "ISBN", width: 150, sortable: false },
    { field: "bookName", headerName: "Book Name", width: 250, sortable: false },
    {
      field: "publisher",
      headerName: "Publisher",
      width: 150,
      sortable: false,
    },
    {
      field: "publicationYear",
      headerName: "Pub. Year",
      width: 150,
      sortable: false,
    },
    {
      field: "pointsRequired",
      headerName: "Points",
      width: 100,
      sortable: false,
    },
    {
      field: "category",
      headerName: "Category",
      width: 200,
      sortable: false,
      renderCell: (params) => params.row.category?.name || "N/A",
    },
    {
      field: "totalCopies",
      headerName: "Total",
      width: 100,
      sortable: false,
    },
    {
      field: "availableCopies",
      headerName: "Available",
      width: 100,
      sortable: false,
    },
    { field: "location", headerName: "Location", width: 250, sortable: false },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <Tooltip title="View details">
            <ActionButton color="info" onClick={() => handleView(params.row)}>
              <Visibility fontSize="small" />
            </ActionButton>
          </Tooltip>
          <Tooltip title="Edit book">
            <ActionButton
              color="primary"
              disabled={roleId !== "1"}
              onClick={() => handleEdit(params.row.id)}
            >
              <Edit fontSize="small" />
            </ActionButton>
          </Tooltip>
          <Tooltip title="Delete book">
            <ActionButton
              color="error"
              disabled={roleId !== "1"}
              onClick={() => handleDeleteClick(params.row.id)}
            >
              <Delete fontSize="small" />
            </ActionButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const startEntry = (page - 1) * pageSize + 1;
  const endEntry = Math.min(page * pageSize, total);

  return (
    <Container elevation={3}>
      <Header>
        <Typography variant="h5" fontWeight="bold" color="textPrimary">
          Book Inventory
        </Typography>

        <FilterSection>
          <SearchField
            variant="outlined"
            placeholder="Search books..."
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
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              label="Category"
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories?.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl variant="outlined" size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Author</InputLabel>
            <Select
              value={selectedAuthor}
              onChange={(e) => setSelectedAuthor(e.target.value)}
              label="Author"
            >
              <MenuItem value="">All Authors</MenuItem>
              {authors?.map((author) => (
                <MenuItem key={author.id} value={author.id}>
                  {author.firstName} {author.lastName}
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
              <Tooltip title="Add new book">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddBook}
                  startIcon={<Add />}
                  size="small"
                >
                  Add Book
                </Button>
              </Tooltip>
            )}
          </Box>
        </FilterSection>
      </Header>

      {loading ? (
        <Box display="flex" justifyContent="center" py={10}>
          <ClipLoader size={50} color="#3f51b5" />
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
              rows={books}
              columns={columns}
              pageSize={pageSize}
              rowsPerPageOptions={[5, 10, 20, 50]}
              paginationMode="server"
              rowCount={total}
              disableSelectionOnClick
              density="standard"
              getRowId={(row) => row.id + row.bookName}
              hideFooter
              sx={{
                border: "none",
                "& .MuiDataGrid-cell": {
                  borderBottom: "1px solid rgba(224, 224, 224, 0.5)",
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
              Showing {startEntry} to {endEntry} of {total} books
            </Typography>

            <Box display="flex" alignItems="center" gap={5}>
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

      {isModalOpen && (
        <BookDetailsModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          book={selectedBook}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this book? This action cannot be
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

export default BooksTable;
