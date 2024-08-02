import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  addNewBooks,
  getBooksById,
  updateBooks,
} from "../../features/book_module/bookActions";
import { getAllAuthorsList } from "../../features/author_module/authorActions";
import {
  TextField,
  Button,
  Typography,
  Box,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import "./books.css";

const AddEditBooks = () => {
  const { bookId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentBook } = useSelector((state) => state.books);
  const { authors } = useSelector((state) => state.authors);

  const [bookData, setBookData] = useState({
    bookname: "",
    title: "",
    description: "",
    authorId: "",
  });

  const [booknameError, setBooknameError] = useState("");
  const [titleError, setTilteError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [authorIdError, setAuthorIdError] = useState("");

  useEffect(() => {
    if (bookId) {
      dispatch(getBooksById(bookId));
    }
  }, [dispatch, bookId]);

  useEffect(() => {
    dispatch(getAllAuthorsList());
  }, [dispatch]);

  useEffect(() => {
    if (bookId && currentBook) {
      setBookData({
        bookname: currentBook.bookname,
        title: currentBook.title,
        description: currentBook.description,
        authorId: currentBook.authorId,
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

  const handleDescriptionBlur = () => {
    setDescriptionError(
      bookData.description === "" ? "Description is required" : ""
    );
  };

  const handleAuthorIdBlur = () => {
    setAuthorIdError(bookData.authorId === "" ? "Author Name is required" : "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    handleBookNameBlur();
    handleTitleBlur();
    handleDescriptionBlur();
    handleAuthorIdBlur();

    if (
      bookData.bookname &&
      bookData.title &&
      bookData.description &&
      bookData.authorId
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
      description: "",
      authorId: "",
    });
    setBooknameError("");
    setTilteError("");
    setDescriptionError("");
    setAuthorIdError("");
  };

  const handleBack = () => {
    navigate("/books");
  };

  return (
    <div className="book-add-edit-container">
      <Container maxWidth="md">
        <Box
          sx={{
            mt: 10,
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
            <Button
              variant="contained"
              onClick={handleBack}
              sx={{
                backgroundColor: "#007bff",
                "&:hover": {
                  backgroundColor: "#0056b3",
                  transform: "scale(1.05)",
                },
                transition: "background-color 0.3s ease, transform 0.3s ease",
              }}
            >
              &larr; Back
            </Button>
          </Box>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              animation: "slideIn 0.5s ease-out",
            }}
          >
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
              rows={4}
              sx={{
                animation: "fadeIn 1s ease-in-out",
              }}
            />
            <FormControl fullWidth margin="normal" error={!!authorIdError}>
              <InputLabel>Author</InputLabel>
              <Select
                name="authorId"
                value={bookData.authorId}
                onChange={handleChange}
                onBlur={handleAuthorIdBlur}
                label="Author"
                sx={{
                  animation: "fadeIn 1s ease-in-out",
                }}
              >
                {authors.map((author) => (
                  <MenuItem key={author.id} value={author.id}>
                    {author.firstname + " " + author.lastname}
                  </MenuItem>
                ))}
              </Select>
              {authorIdError && (
                <FormHelperText>{authorIdError}</FormHelperText>
              )}
            </FormControl>
            <Box
              sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}
            >
              <Button
                variant="contained"
                type="submit"
                color="primary"
                sx={{
                  backgroundColor: "#007bff",
                  "&:hover": {
                    backgroundColor: "#0056b3",
                    transform: "scale(1.05)",
                  },
                  transition: "background-color 0.3s ease, transform 0.3s ease",
                }}
              >
                {bookId ? "Update Book" : "Add Book"}
              </Button>
              <Button
                variant="outlined"
                onClick={handleReset}
                color="secondary"
                sx={{
                  borderColor: "#f50057",
                  color: "#f50057",
                  "&:hover": {
                    borderColor: "#c51162",
                    color: "#c51162",
                  },
                  transition: "border-color 0.3s ease, color 0.3s ease",
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
