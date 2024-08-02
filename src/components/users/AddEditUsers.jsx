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
  InputAdornment,
  IconButton,
} from "@mui/material";

// ACTIONS & STORES
import {
  addUser,
  getUserById,
  updateUsers,
} from "../../features/user_module/userActions";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const AddEditUsers = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.users);

  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [firstnameError, setFirstnameError] = useState("");
  const [lastnameError, setLastnameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (userId) {
      dispatch(getUserById(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (userId && currentUser) {
      setUserData({
        firstname: currentUser.firstname,
        lastname: currentUser.lastname,
        email: currentUser.email,
        password: "",
        confirmPassword: "",
      });
    }
  }, [currentUser, userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleFirstNameBlur = () => {
    setFirstnameError(userData.firstname === "" ? "Firstname is required" : "");
  };

  const handleLastNameBlur = () => {
    setLastnameError(userData.lastname === "" ? "Lastname is required" : "");
  };

  const handleEmailBlur = () => {
    setEmailError(userData.email === "" ? "Email Id is required" : "");
  };

  const handlePasswordBlur = () => {
    if (userData.password.length > 0 && userData.password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
    } else {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordBlur = () => {
    if (userData.confirmPassword !== userData.password) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    handleFirstNameBlur();
    handleLastNameBlur();
    handleEmailBlur();
    handlePasswordBlur();
    handleConfirmPasswordBlur();

    if (
      userData.firstname &&
      userData.lastname &&
      userData.email &&
      userData.password.length >= 8 &&
      userData.password === userData.confirmPassword
    ) {
      if (userId) {
        await dispatch(updateUsers({ userId, userData })).unwrap();
      } else {
        await dispatch(addUser(userData)).unwrap();
      }
      navigate("/users");
    }
  };

  const handleReset = () => {
    setUserData({
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setFirstnameError("");
    setLastnameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
  };

  const handleBack = () => {
    navigate("/users");
  };

  return (
    <div className="user-add-edit-container">
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
              {userId ? "Edit User" : "Add User"}
            </Typography>
            <Button
              variant="contained"
              className="back-button"
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
              fullWidth
              margin="normal"
              label="First Name"
              name="firstname"
              value={userData.firstname}
              onChange={handleChange}
              onBlur={handleFirstNameBlur}
              error={!!firstnameError}
              helperText={firstnameError}
              sx={{
                animation: "fadeIn 1s ease-in-out",
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Last Name"
              name="lastname"
              value={userData.lastname}
              onChange={handleChange}
              onBlur={handleLastNameBlur}
              error={!!lastnameError}
              helperText={lastnameError}
              sx={{
                animation: "fadeIn 1s ease-in-out",
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Email ID"
              name="email"
              value={userData.email}
              onChange={handleChange}
              onBlur={handleEmailBlur}
              error={!!emailError}
              helperText={emailError}
              sx={{
                animation: "fadeIn 1s ease-in-out",
              }}
            />

            <TextField
              id="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={userData.password}
              onChange={handleChange}
              onBlur={handlePasswordBlur}
              error={!!passwordError}
              helperText={passwordError}
              fullWidth
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                animation: "fadeIn 1s ease-in-out",
              }}
            />
            <TextField
              id="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={userData.confirmPassword}
              onChange={handleChange}
              onBlur={handleConfirmPasswordBlur}
              error={!!confirmPasswordError}
              helperText={confirmPasswordError}
              fullWidth
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                animation: "fadeIn 1s ease-in-out",
              }}
            />
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
                {userId ? "Update" : "Add"}
              </Button>
              <Button
                variant="outlined"
                onClick={handleReset}
                color="secondary"
                className="reset-button"
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

export default AddEditUsers;
