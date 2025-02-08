import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  addNewAuthors,
  getAuthorsById,
  updateAuthors,
} from "../../features/author_module/authorActions";
import {
  TextField,
  Button,
  Typography,
  Box,
  Container,
  Fab,
  Grid,
  Tooltip,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

const AddEditAuthors = () => {
  const { authorId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentAuthor } = useSelector((state) => state.authors);

  const [authorData, setAuthorData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    biography: "",
  });

  const [firstnameError, setFirstnameError] = useState("");
  const [lastnameError, setLastnameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [biographyError, setBiographyError] = useState("");

  useEffect(() => {
    if (authorId) {
      dispatch(getAuthorsById(authorId));
    }
  }, [dispatch, authorId]);

  useEffect(() => {
    if (authorId && currentAuthor) {
      setAuthorData({
        firstname: currentAuthor.firstname,
        lastname: currentAuthor.lastname,
        email: currentAuthor.email,
        biography: currentAuthor.biography,
      });
    }
  }, [currentAuthor, authorId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAuthorData({
      ...authorData,
      [name]: value,
    });
  };

  const handleFirstNameBlur = () => {
    setFirstnameError(
      authorData.firstname === "" ? "Firstname is required" : ""
    );
  };

  const handleLastNameBlur = () => {
    setLastnameError(authorData.lastname === "" ? "Lastname is required" : "");
  };

  const handleEmailBlur = () => {
    setEmailError(authorData.email === "" ? "Email Id is required" : "");
  };

  const handleBiographyBlur = () => {
    setBiographyError(
      authorData.biography === "" ? "Biography is required" : ""
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    handleFirstNameBlur();
    handleLastNameBlur();
    handleEmailBlur();

    if (authorData.firstname && authorData.lastname && authorData.email) {
      if (authorId) {
        await dispatch(updateAuthors({ authorId, authorData })).unwrap();
      } else {
        await dispatch(addNewAuthors(authorData)).unwrap();
      }
      navigate("/authors");
    }
  };

  const handleReset = () => {
    setAuthorData({
      firstname: "",
      lastname: "",
      email: "",
      biography: "",
    });
    setFirstnameError("");
    setLastnameError("");
    setEmailError("");
    setBiographyError("");
  };

  const handleBack = () => {
    navigate("/authors");
  };

  return (
    <div className="author-add-edit-container">
      <Container maxWidth="lg">
        <Box
          className="add-edit-author-container"
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
            <Typography
              variant="h4"
              gutterBottom
              sx={{ fontFamily: "sans-serif" }}
            >
              {authorId ? "Edit Author" : "Add Author"}
            </Typography>
            <Tooltip title="Back">
              <Fab
                size="small"
                color="warning"
                aria-label="add"
                sx={{ marginRight: "2rem" }}
              >
                <ArrowBack onClick={handleBack} />
              </Fab>
            </Tooltip>
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
                  fullWidth
                  size="small"
                  margin="normal"
                  label="First Name"
                  name="firstname"
                  value={authorData.firstname}
                  onChange={handleChange}
                  onBlur={handleFirstNameBlur}
                  error={!!firstnameError}
                  helperText={firstnameError}
                  sx={{
                    animation: "fadeIn 1s ease-in-out",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  margin="normal"
                  label="Last Name"
                  name="lastname"
                  value={authorData.lastname}
                  onChange={handleChange}
                  onBlur={handleLastNameBlur}
                  error={!!lastnameError}
                  helperText={lastnameError}
                  sx={{
                    animation: "fadeIn 1s ease-in-out",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  margin="normal"
                  label="Email ID"
                  name="email"
                  value={authorData.email}
                  onChange={handleChange}
                  onBlur={handleEmailBlur}
                  error={!!emailError}
                  helperText={emailError}
                  sx={{
                    animation: "fadeIn 1s ease-in-out",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  fullWidth
                  size="small"
                  margin="normal"
                  label="Biography"
                  name="biography"
                  value={authorData.biography}
                  onChange={handleChange}
                  onBlur={handleBiographyBlur}
                  error={!!biographyError}
                  helperText={biographyError}
                  multiline
                  rows={4}
                  sx={{
                    animation: "fadeIn 1s ease-in-out",
                  }}
                />
              </Grid>
            </Grid>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mt: 2,
                animation: "slideInUp 0.5s ease-out",
              }}
            >
              <Button
                variant="contained"
                type="submit"
                color="primary"
                sx={{
                  backgroundColor: "#28a745",
                  "&:hover": {
                    backgroundColor: "#218838",
                    transform: "scale(1.05)",
                  },
                  transition: "background-color 0.3s ease, transform 0.3s ease",
                }}
              >
                {authorId ? "Update" : "Submit"}
              </Button>
              <Button
                variant="outlined"
                onClick={handleReset}
                color="secondary"
                className="reset-button"
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

export default AddEditAuthors;
