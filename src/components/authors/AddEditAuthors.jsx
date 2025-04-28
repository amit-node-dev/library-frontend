import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { styled } from "@mui/material/styles";
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
  Paper,
  Divider,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

// Styled components
const MainContainer = styled("div")(({ theme }) => ({
  position: "relative",
  padding: theme.spacing(2),
  backgroundColor: "lightgray",
  minHeight: "calc(100vh - 100px)",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
}));

const FormContainer = styled(Container)(({ theme }) => ({
  flex: 2,
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(5),
  marginTop: theme.spacing(5),
}));

const FormPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
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

const ActionButtons = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  gap: theme.spacing(2),
  marginTop: theme.spacing(3),
  paddingTop: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

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
    <MainContainer>
      <FormContainer maxWidth="lg">
        <FormPaper elevation={4}>
          <FormHeader>
            <FormTitle variant="h4">
              {authorId ? "Edit Author" : "Add Author"}
            </FormTitle>
            <Tooltip title="Back">
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

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstname"
                  value={authorData.firstname}
                  onChange={handleChange}
                  onBlur={handleFirstNameBlur}
                  error={!!firstnameError}
                  helperText={firstnameError}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastname"
                  value={authorData.lastname}
                  onChange={handleChange}
                  onBlur={handleLastNameBlur}
                  error={!!lastnameError}
                  helperText={lastnameError}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email ID"
                  name="email"
                  value={authorData.email}
                  onChange={handleChange}
                  onBlur={handleEmailBlur}
                  error={!!emailError}
                  helperText={emailError}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Biography"
                  name="biography"
                  value={authorData.biography}
                  onChange={handleChange}
                  onBlur={handleBiographyBlur}
                  error={!!biographyError}
                  helperText={biographyError}
                  size="small"
                  multiline
                  rows={5}
                />
              </Grid>
            </Grid>

            <ActionButtons>
              <Button
                variant="outlined"
                onClick={handleReset}
                color="secondary"
              >
                Reset
              </Button>
              <Button
                variant="contained"
                type="submit"
                color="primary"
              >
                {authorId ? "Update" : "Submit"}
              </Button>
            </ActionButtons>
          </Box>
        </FormPaper>
      </FormContainer>
    </MainContainer>
  );
};

export default AddEditAuthors;
