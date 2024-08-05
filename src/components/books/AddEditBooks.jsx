import React, { useState, useEffect } from "react";

// THIRD PARTY COMPONENTS
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

// MUI IMPORTS
import {
  TextField,
  Button,
  Typography,
  Box,
  Container,
  FormControl,
  Fab,
  Grid,
  Autocomplete,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

// ACTIONS & STORES
import {
  addNewBooks,
  getBooksById,
  updateBooks,
} from "../../features/book_module/bookActions";
import { getAllAuthorsList } from "../../features/author_module/authorActions";
import { getAllCategoryList } from "../../features/category_module/categoryActions";

// CSS
import "./books.css";

const AddEditBooks = () => {
  const { bookId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentBook } = useSelector((state) => state.books);
  console.log("CURR ", currentBook);

  const [authorList, setAuthorList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  const [bookData, setBookData] = useState({
    bookname: "",
    title: "",
    authorId: "",
    categoryId: "",
    description: "",
    conclusion: "",
  });

  const [booknameError, setBooknameError] = useState("");
  const [titleError, setTilteError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [authorIdError, setAuthorIdError] = useState("");
  const [categoryIdError, setCategoryIdError] = useState("");
  const [conclusionError, setConclusionError] = useState("");

  useEffect(() => {
    dispatch(getAllCategoryList()).then((response) => {
      setCategoryList(response.payload);
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllAuthorsList({ page: 1, pageSize: 5 })).then((response) => {
      setAuthorList(response.payload.authors);
    });
  }, [dispatch]);

  useEffect(() => {
    if (bookId) {
      dispatch(getBooksById(bookId));
    }
  }, [dispatch, bookId]);

  useEffect(() => {
    if (bookId && currentBook) {
      setBookData({
        bookname: currentBook.bookname,
        title: currentBook.title,
        authorId: currentBook.authorId,
        categoryId: currentBook.categoryId,
        description: currentBook.description,
        conclusion: currentBook.conclusion,
      });
    }
  }, [currentBook, bookId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData({
      ...bookData,
      [name]: value,
    });
  };

  const handleBookNameBlur = () => {
    setBooknameError(bookData.bookname === "" ? "Name is required" : "");
  };

  const handleTitleBlur = () => {
    setTilteError(bookData.title === "" ? "Title is required" : "");
  };

  const handleAuthorIdBlur = () => {
    setAuthorIdError(bookData.authorId === "" ? "Author Name is required" : "");
  };

  const handleCategoryIdBlur = () => {
    setCategoryIdError(
      bookData.categoryId === "" ? "Category is required" : ""
    );
  };

  const handleDescriptionBlur = () => {
    setDescriptionError(
      bookData.description === "" ? "Description is required" : ""
    );
  };

  const handleConclusionBlur = () => {
    setConclusionError(
      bookData.conclusion === "" ? "Conclusion is required" : ""
    );
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    handleBookNameBlur();
    handleTitleBlur();
    handleAuthorIdBlur();
    handleCategoryIdBlur();
    handleDescriptionBlur();
    handleConclusionBlur();

    if (
      bookData.bookname &&
      bookData.title &&
      bookData.authorId &&
      bookData.categoryId &&
      bookData.description &&
      bookData.conclusion
    ) {
      try {
        if (bookId) {
          await dispatch(updateBooks({ bookId, bookData })).unwrap();
        } else {
          await dispatch(addNewBooks(bookData)).unwrap();
        }
        navigate("/books");
      } catch (error) {
        console.log("Error in handleSubmit:", error);
      }
    }
  };

  const handleReset = () => {
    setBookData({
      bookname: "",
      title: "",
      authorId: "",
      categoryId: "",
      description: "",
      conclusion: "",
    });
    setBooknameError("");
    setTilteError("");
    setAuthorIdError("");
    setCategoryIdError("");
    setDescriptionError("");
    setConclusionError("");
  };

  const handleBack = () => {
    navigate("/books");
  };

  return (
    <div className="book-add-edit-container">
      <Container maxWidth="lg">
        <Box
          sx={{
            mt: 5,
            border: "1px solid #ddd",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            padding: "50px",
            backgroundColor: "#fff",
            animation: "fadeIn 1s ease-in-out",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h4" gutterBottom>
              {bookId ? "Edit Book" : "Add New Book"}
            </Typography>
            <Fab
              size="small"
              color="warning"
              aria-label="add"
              sx={{ marginRight: "2rem" }}
            >
              <ArrowBack onClick={handleBack} />
            </Fab>
          </Box>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              animation: "slideIn 0.5s ease-out",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  size="small"
                  fullWidth
                  margin="normal"
                  label="Name"
                  name="bookname"
                  value={bookData.bookname}
                  onChange={handleChange}
                  onBlur={handleBookNameBlur}
                  error={!!booknameError}
                  helperText={booknameError}
                  sx={{
                    animation: "fadeIn 1s ease-in-out",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  size="small"
                  fullWidth
                  margin="normal"
                  label="Title"
                  name="title"
                  value={bookData.title}
                  onChange={handleChange}
                  onBlur={handleTitleBlur}
                  error={!!titleError}
                  helperText={titleError}
                  sx={{
                    animation: "fadeIn 1s ease-in-out",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal" error={!!authorIdError}>
                  <Autocomplete
                    options={authorList}
                    getOptionLabel={(option) =>
                      `${option.firstname} ${option.lastname}`
                    }
                    onChange={(event, value) => {
                      setBookData({
                        ...bookData,
                        authorId: value ? value.id : "",
                      });
                    }}
                    onBlur={handleAuthorIdBlur}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Author"
                        error={!!authorIdError}
                        helperText={authorIdError}
                        sx={{
                          animation: "fadeIn 1s ease-in-out",
                        }}
                      />
                    )}
                    value={
                      authorList?.find(
                        (author) => author.id === bookData.authorId
                      ) || null
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl
                  fullWidth
                  margin="normal"
                  error={!!categoryIdError}
                >
                  <Autocomplete
                    options={categoryList}
                    getOptionLabel={(option) => `${option.name}`}
                    onChange={(event, value) => {
                      setBookData({
                        ...bookData,
                        categoryId: value ? value.id : "",
                      });
                    }}
                    onBlur={handleCategoryIdBlur}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Category"
                        error={!!categoryIdError}
                        helperText={categoryIdError}
                        sx={{
                          animation: "fadeIn 1s ease-in-out",
                        }}
                      />
                    )}
                    value={
                      categoryList?.find(
                        (category) => category.id === bookData.categoryId
                      ) || null
                    }
                  />
                </FormControl>
              </Grid>
            </Grid>

            <TextField
              size="small"
              fullWidth
              margin="normal"
              label="Description"
              name="description"
              value={bookData.description}
              onChange={handleChange}
              onBlur={handleDescriptionBlur}
              error={!!descriptionError}
              helperText={descriptionError}
              multiline
              rows={5}
              sx={{
                animation: "fadeIn 1s ease-in-out",
              }}
            />
            <TextField
              size="small"
              fullWidth
              margin="normal"
              label="Conclusion"
              name="conclusion"
              value={bookData.conclusion}
              onChange={handleChange}
              onBlur={handleConclusionBlur}
              error={!!conclusionError}
              helperText={conclusionError}
              multiline
              rows={3}
              sx={{
                animation: "fadeIn 1s ease-in-out",
              }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mt: 2,
                animation: "slideInUp 0.5s ease-out",
              }}
            >
              <Button
                type="submit"
                variant="contained"
                className="submit-button"
                sx={{
                  backgroundColor: "#28a745",
                  "&:hover": {
                    backgroundColor: "#218838",
                    transform: "scale(1.05)",
                  },
                  transition: "background-color 0.3s ease, transform 0.3s ease",
                }}
              >
                {bookId ? "Update" : "Submit"}
              </Button>

              <Button
                type="reset"
                variant="outlined"
                className="reset-button"
                onClick={handleReset}
                sx={{
                  ml: 2,
                  color: "#dc3545",
                  borderColor: "#dc3545",
                  "&:hover": {
                    backgroundColor: "#f8d7da",
                    transform: "scale(1.05)",
                  },
                  transition: "background-color 0.3s ease, transform 0.3s ease",
                }}
              >
                Reset
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default AddEditBooks;
