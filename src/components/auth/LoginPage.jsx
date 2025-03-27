import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Divider,
  Box,
  Paper,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import loginImage from "../../images/loginPage.jpg";

import { loginUser } from "../../features/user_module/userActions";
import { validateEmail, validatePassword } from "../../utils/validations";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate on change if field was touched
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    validateField(name, formData[name]);
  };

  const validateField = (name, value) => {
    let error = "";
    
    switch (name) {
      case "email":
        error = validateEmail(value);
        break;
      case "password":
        error = validatePassword(value);
        break;
      default:
        break;
    }
    
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const validateForm = () => {
    const newErrors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
    };
    
    setErrors(newErrors);
    setTouched({
      email: true,
      password: true,
    });

    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = (e) => {
    setLoading(false)
    e.preventDefault();
    
    if (validateForm()) {
      dispatch(loginUser(formData));
    }
  };

  const handleOTPLogin = () => {
    navigate("/mobile-login");
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      {/* Image Section */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          justifyContent: "center",
          alignItems: "center",
          backgroundImage: `url(${loginImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Form Section */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: "100%",
            maxWidth: 450,
            borderRadius: 2,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Welcome Back
          </Typography>
          
          <Typography variant="body2" color="textSecondary" align="center" mb={4}>
            Please sign in to continue
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && !!errors.email}
              helperText={touched.email && errors.email}
              autoComplete="email"
            />

            <TextField
              fullWidth
              margin="normal"
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password && !!errors.password}
              helperText={touched.password && errors.password}
              autoComplete="current-password"
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
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
              <Link to="/forgot-password" style={{ textDecoration: "none" }}>
                <Typography variant="body2" color="primary">
                  Forgot Password?
                </Typography>
              </Link>
            </Box>

            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              sx={{ mt: 2, mb: 2, height: 48 }}
            >
              {loading ? <CircularProgress size={24} /> : "Sign In"}
            </Button>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="textSecondary">
                OR
              </Typography>
            </Divider>

            <Button
              fullWidth
              variant="outlined"
              color="primary"
              onClick={handleOTPLogin}
              sx={{ mb: 2, height: 48 }}
            >
              Login with Mobile OTP
            </Button>

            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Typography variant="body2">
                Don't have an account?{" "}
                <Link to="/register" style={{ textDecoration: "none" }}>
                  <Typography
                    variant="body2"
                    component="span"
                    color="primary"
                  >
                    Sign Up
                  </Typography>
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default LoginPage;