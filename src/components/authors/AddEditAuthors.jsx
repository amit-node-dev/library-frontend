import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  addNewAuthors,
  getAuthorsById,
  updateAuthors,
} from "../../features/author_module/authorActions";
import { TextField, Button, Typography, Box, Container } from "@mui/material";

const AddEditAuthors = () => {
  const { authorId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentAuthor } = useSelector((state) => state.authors);

  const [authorData, setAuthorData] = useState({
    firstname: "",
    lastname: "",
    email: "",
  });

  const [firstnameError, setFirstnameError] = useState("");
  const [lastnameError, setLastnameError] = useState("");
  const [emailError, setEmailError] = useState("");

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
    });
    setFirstnameError("");
    setLastnameError("");
    setEmailError("");
  };

  const handleBack = () => {
    navigate("/authors");
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          mt: 10,
          border: "1px solid #ddd",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          padding: "50px",
          backgroundColor: "#fff",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h4" gutterBottom>
            {authorId ? "Edit Author" : "Add Author"}
          </Typography>
          <Button variant="contained" onClick={handleBack}>
            &larr; Back
          </Button>
        </Box>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="First Name"
            name="firstname"
            value={authorData.firstname}
            onChange={handleChange}
            onBlur={handleFirstNameBlur}
            error={!!firstnameError}
            helperText={firstnameError}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Last Name"
            name="lastname"
            value={authorData.lastname}
            onChange={handleChange}
            onBlur={handleLastNameBlur}
            error={!!lastnameError}
            helperText={lastnameError}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email ID"
            name="email"
            value={authorData.email}
            onChange={handleChange}
            onBlur={handleEmailBlur}
            error={!!emailError}
            helperText={emailError}
          />
          <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="contained"
              type="submit"
              color="primary"
              sx={{
                backgroundColor: "#007bff",
                "&:hover": { backgroundColor: "#0056b3" },
              }}
            >
              {authorId ? "Update" : "Add"}
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
              }}
            >
              Reset
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default AddEditAuthors;
