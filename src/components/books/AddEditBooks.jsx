import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import dayjs from "dayjs";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";

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
  Tooltip,
  Paper,
  Divider,
  Alert,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

// ACTIONS & STORES
import {
  addNewBooks,
  getBooksById,
  updateBooks,
} from "../../features/book_module/bookActions";
import { getAllAuthorsList } from "../../features/author_module/authorActions";
import { getAllCategoryList } from "../../features/category_module/categoryActions";

// Styled components
const MainContainer = styled("div")(({ theme }) => ({
  position: "relative",
  padding: theme.spacing(2),
  backgroundColor: "darkgray",
  minHeight: "calc(100vh - 100px)",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
}));

const MainWrapper = styled("div")(() => ({
  margin: "0 auto",
  width: "100%",
  maxWidth: "1200px",
  animation: "slideIn 0.5s ease-out",
}));

// Styled Components
const FormContainer = styled(Container)(({ theme }) => ({
  flex: 2,
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(0),
}));

const FormPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  animation: "fadeIn 0.5s ease-in-out",
  display: "flex",
  flexDirection: "column",
  height: "100%",
}));

const FormHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(3),
}));

const FormTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.primary.main,
}));

const FormGrid = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const ActionButtons = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  gap: theme.spacing(2),
  marginTop: theme.spacing(3),
  paddingTop: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1, 4),
  fontWeight: 600,
  transition: "all 0.3s ease",
}));

const ResetButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1, 4),
  fontWeight: 600,
  transition: "all 0.3s ease",
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.shape.borderRadius,
  },
  animation: "fadeIn 0.5s ease-in-out",
}));

const ScrollableFormContent = styled(Box)({
  flex: 1,
  overflow: "hidden",
});

const AddEditBooks = () => {
  const { bookId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentBook, loading, error } = useSelector((state) => state.books);

  const [authorList, setAuthorList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  const [bookData, setBookData] = useState({
    bookName: "",
    title: "",
    authorId: "",
    categoryId: "",
    description: "",
    conclusion: "",
    isbn: "",
    publisher: "",
    publicationYear: "",
    totalCopies: "",
    pointsRequired: "",
  });

  const [errors, setErrors] = useState({
    bookName: "",
    title: "",
    authorId: "",
    categoryId: "",
    description: "",
    conclusion: "",
    isbn: "",
    publisher: "",
    totalCopies: "",
    pointsRequired: "",
  });

  useEffect(() => {
    dispatch(getAllCategoryList()).then((response) => {
      setCategoryList(response.payload);
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllAuthorsList()).then((response) => {
      setAuthorList(response.payload.items);
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
        bookName: currentBook.bookName,
        title: currentBook.title,
        authorId: currentBook.authorId,
        categoryId: currentBook.categoryId,
        description: currentBook.description,
        conclusion: currentBook.conclusion,
        isbn: currentBook.isbn,
        publisher: currentBook.publisher,
        publicationYear: currentBook.publicationYear,
        totalCopies: currentBook.totalCopies,
        pointsRequired: currentBook.pointsRequired,
      });
    }
  }, [currentBook, bookId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData({
      ...bookData,
      [name]: value,
    });
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateField = (name, value) => {
    let error = "";
    if (!value) {
      error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }
    return error;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors({
      ...errors,
      [name]: error,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(bookData).forEach((key) => {
      if (key !== "publicationYear") {
        const error = validateField(key, bookData[key]);
        if (error) {
          newErrors[key] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const submissionData = {
          ...bookData,
          publicationYear: bookData.publicationYear
            ? dayjs(bookData.publicationYear).format("YYYY-MM-DD")
            : "",
        };

        if (bookId) {
          await dispatch(
            updateBooks({ bookId, bookData: submissionData })
          ).unwrap();
        } else {
          await dispatch(addNewBooks(submissionData)).unwrap();
        }
        navigate("/books");
      } catch (error) {
        console.error("Error in handleSubmit:", error);
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
      isbn: "",
      publisher: "",
      publicationYear: "",
      totalCopies: "",
      pointsRequired: "",
    });
    setErrors({
      bookname: "",
      title: "",
      authorId: "",
      categoryId: "",
      description: "",
      conclusion: "",
      isbn: "",
      publisher: "",
      totalCopies: "",
      pointsRequired: "",
    });
  };

  const handleBack = () => {
    navigate("/books");
  };

  return (
    <MainContainer>
      <MainWrapper>
        <FormContainer maxWidth="lg">
          <FormPaper elevation={4}>
            <FormHeader>
              <FormTitle variant="h4">
                {bookId ? "Edit Book" : "Add New Book"}
              </FormTitle>
              <Tooltip title="Back to Books">
                <Fab
                  size="medium"
                  color="primary"
                  aria-label="back"
                  onClick={handleBack}
                  sx={{ boxShadow: 2 }}
                >
                  <ArrowBack />
                </Fab>
              </Tooltip>
            </FormHeader>

            <Divider sx={{ my: 2 }} />

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <ScrollableFormContent>
              <PerfectScrollbar>
                <Box mt={1} component="form" onSubmit={handleSubmit}>
                  <FormGrid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * 0 }}
                      >
                        <StyledTextField
                          fullWidth
                          label="Book Name"
                          name="bookName"
                          value={bookData.bookName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={!!errors.bookName}
                          helperText={errors.bookName}
                          size="small"
                        />
                      </motion.div>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * 1 }}
                      >
                        <StyledTextField
                          fullWidth
                          label="Title"
                          name="title"
                          value={bookData.title}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={!!errors.title}
                          helperText={errors.title}
                          size="small"
                        />
                      </motion.div>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * 2 }}
                      >
                        <StyledTextField
                          fullWidth
                          label="ISBN"
                          name="isbn"
                          value={bookData.isbn}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={!!errors.isbn}
                          helperText={errors.isbn}
                          size="small"
                        />
                      </motion.div>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * 3 }}
                      >
                        <StyledTextField
                          fullWidth
                          label="Publisher"
                          name="publisher"
                          value={bookData.publisher}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={!!errors.publisher}
                          helperText={errors.publisher}
                          size="small"
                        />
                      </motion.div>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * 5 }}
                      >
                        <StyledTextField
                          fullWidth
                          label="Total Copies"
                          name="totalCopies"
                          type="number"
                          value={bookData.totalCopies}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={!!errors.totalCopies}
                          helperText={errors.totalCopies}
                          size="small"
                        />
                      </motion.div>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * 6 }}
                      >
                        <FormControl fullWidth error={!!errors.authorId}>
                          <Autocomplete
                            options={authorList}
                            getOptionLabel={(option) =>
                              `${option.firstName} ${option.lastName}`
                            }
                            onChange={(event, value) => {
                              setBookData({
                                ...bookData,
                                authorId: value ? value.id : "",
                              });
                              if (errors.authorId) {
                                setErrors({
                                  ...errors,
                                  authorId: "",
                                });
                              }
                            }}
                            onBlur={() => {
                              if (!bookData.authorId) {
                                setErrors({
                                  ...errors,
                                  authorId: "Author is required",
                                });
                              }
                            }}
                            renderInput={(params) => (
                              <StyledTextField
                                {...params}
                                label="Author"
                                error={!!errors.authorId}
                                helperText={errors.authorId}
                                size="small"
                              />
                            )}
                            value={
                              authorList?.find(
                                (author) => author.id === bookData.authorId
                              ) || null
                            }
                          />
                        </FormControl>
                      </motion.div>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * 7 }}
                      >
                        <FormControl fullWidth error={!!errors.categoryId}>
                          <Autocomplete
                            options={categoryList}
                            getOptionLabel={(option) => `${option.name}`}
                            onChange={(event, value) => {
                              setBookData({
                                ...bookData,
                                categoryId: value ? value.id : "",
                              });
                              if (errors.categoryId) {
                                setErrors({
                                  ...errors,
                                  categoryId: "",
                                });
                              }
                            }}
                            onBlur={() => {
                              if (!bookData.categoryId) {
                                setErrors({
                                  ...errors,
                                  categoryId: "Category is required",
                                });
                              }
                            }}
                            renderInput={(params) => (
                              <StyledTextField
                                {...params}
                                label="Category"
                                error={!!errors.categoryId}
                                helperText={errors.categoryId}
                                size="small"
                              />
                            )}
                            value={
                              categoryList?.find(
                                (category) => category.id === bookData.categoryId
                              ) || null
                            }
                          />
                        </FormControl>
                      </motion.div>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * 8 }}
                      >
                        <StyledTextField
                          fullWidth
                          label="Points Required"
                          name="pointsRequired"
                          type="number"
                          value={bookData.pointsRequired}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={!!errors.pointsRequired}
                          helperText={errors.pointsRequired}
                          size="small"
                        />
                      </motion.div>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * 9 }}
                      >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label="Publication Year"
                            inputFormat="YYYY-MM-DD"
                            value={
                              bookData.publicationYear
                                ? dayjs(bookData.publicationYear)
                                : null
                            }
                            onChange={(newValue) => {
                              setBookData({
                                ...bookData,
                                publicationYear: newValue ? newValue : "",
                              });
                            }}
                            renderInput={(params) => (
                              <StyledTextField
                                {...params}
                                fullWidth
                                size="small"
                              />
                            )}
                          />
                        </LocalizationProvider>
                      </motion.div>
                    </Grid>
                    <Grid item xs={12}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * 10 }}
                      >
                        <StyledTextField
                          fullWidth
                          label="Description"
                          name="description"
                          value={bookData.description}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={!!errors.description}
                          helperText={errors.description}
                          multiline
                          rows={3}
                        />
                      </motion.div>
                    </Grid>
                    <Grid item xs={12}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * 11 }}
                      >
                        <StyledTextField
                          fullWidth
                          label="Conclusion"
                          name="conclusion"
                          value={bookData.conclusion}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={!!errors.conclusion}
                          helperText={errors.conclusion}
                          multiline
                          rows={2}
                        />
                      </motion.div>
                    </Grid>
                  </FormGrid>

                  <ActionButtons>
                    <ResetButton
                      variant="outlined"
                      color="error"
                      onClick={handleReset}
                      disabled={loading}
                    >
                      Reset
                    </ResetButton>
                    <SubmitButton
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={loading}
                    >
                      {loading
                        ? "Processing..."
                        : bookId
                        ? "Update Book"
                        : "Add Book"}
                    </SubmitButton>
                  </ActionButtons>
                </Box>
              </PerfectScrollbar>
            </ScrollableFormContent>
          </FormPaper>
        </FormContainer>
      </MainWrapper>
    </MainContainer>
  );
};

export default AddEditBooks;
