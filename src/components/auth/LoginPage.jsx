import React, { useState, useEffect } from "react";
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
  Fade,
  Slide,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { motion } from "framer-motion";
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
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const img = new Image();
    img.src = loginImage;
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setLoading(true);
      try {
        const response = await dispatch(loginUser(formData)).unwrap();
        navigate("/dashboard")

        localStorage.setItem("accessToken", response.data?.tokens?.accessToken)
        localStorage.setItem("userData", response.data?.user)
      } finally {
        setLoading(false);
      }
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
        overflow: "hidden",
      }}
    >
      {/* Image Section with Animation */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          justifyContent: "center",
          alignItems: "center",
          backgroundImage: `url(${loginImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.5, duration: 1 }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          }}
        />
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.5, duration: 1.5 }}
          style={{
            zIndex: 1,
            textAlign: "center",
            padding: "2rem",
            color: "white",
          }}
        >
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
            Welcome Back
          </Typography>
          <Typography variant="h6">
            Your journey starts here
          </Typography>
        </motion.div>
      </motion.div>

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
        <Slide direction="up" in={true} mountOnEnter unmountOnExit>
          <Paper
            elevation={6}
            sx={{
              p: 4,
              width: "100%",
              maxWidth: 450,
              borderRadius: 4,
              boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.15)",
              },
            }}
          >
            <Fade in={true} timeout={800}>
              <div>
                <Typography 
                  variant="h4" 
                  component="h1" 
                  gutterBottom 
                  align="center"
                  sx={{ 
                    fontWeight: 700,
                    background: "linear-gradient(45deg, #1976d2, #00bcd4)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mb: 2
                  }}
                >
                  Welcome Back
                </Typography>
                
                <Typography 
                  variant="body1" 
                  color="textSecondary" 
                  align="center" 
                  mb={4}
                  sx={{ fontStyle: "inherit" }}
                >
                  Please sign in to continue your journey
                </Typography>

                <form onSubmit={handleSubmit}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
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
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "#e0e0e0",
                          },
                          "&:hover fieldset": {
                            borderColor: "#1976d2",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#1976d2",
                            borderWidth: 2,
                          },
                        },
                      }}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
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
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "#e0e0e0",
                          },
                          "&:hover fieldset": {
                            borderColor: "#1976d2",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#1976d2",
                            borderWidth: 2,
                          },
                        },
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              sx={{
                                color: showPassword ? "#1976d2" : "inherit",
                                transition: "color 0.3s",
                              }}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                      <Link to="/forgot-password" style={{ textDecoration: "none" }}>
                        <Typography 
                          variant="body2" 
                          color="primary"
                          sx={{
                            "&:hover": {
                              textDecoration: "underline",
                            },
                          }}
                        >
                          Forgot Password?
                        </Typography>
                      </Link>
                    </Box>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={loading}
                      sx={{ 
                        mt: 2, 
                        mb: 2, 
                        height: 48,
                        fontSize: "1rem",
                        fontWeight: 600,
                        borderRadius: 2,
                        textTransform: "none",
                        boxShadow: "0px 4px 10px rgba(25, 118, 210, 0.3)",
                        "&:hover": {
                          boxShadow: "0px 6px 15px rgba(25, 118, 210, 0.4)",
                        },
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Divider sx={{ my: 3 }}>
                      <Typography variant="body2" color="textSecondary">
                        OR
                      </Typography>
                    </Divider>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Button
                      fullWidth
                      variant="outlined"
                      color="primary"
                      onClick={handleOTPLogin}
                      sx={{ 
                        mb: 2, 
                        height: 48,
                        fontSize: "1rem",
                        fontWeight: 600,
                        borderRadius: 2,
                        textTransform: "none",
                        borderWidth: 2,
                        "&:hover": {
                          borderWidth: 2,
                        },
                      }}
                    >
                      Login with Mobile OTP
                    </Button>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <Box sx={{ textAlign: "center", mt: 3 }}>
                      <Typography variant="body2">
                        Don't have an account?{" "}
                        <Link to="/register" style={{ textDecoration: "none" }}>
                          <Typography
                            variant="body2"
                            component="span"
                            color="primary"
                            sx={{
                              fontWeight: 600,
                              "&:hover": {
                                textDecoration: "underline",
                              },
                            }}
                          >
                            Sign Up
                          </Typography>
                        </Link>
                      </Typography>
                    </Box>
                  </motion.div>
                </form>
              </div>
            </Fade>
          </Paper>
        </Slide>
      </Box>
    </Box>
  );
};

export default LoginPage;