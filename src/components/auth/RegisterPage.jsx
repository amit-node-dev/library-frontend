import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import zxcvbn from "zxcvbn";
import bcrypt from "bcryptjs";
import {
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Divider,
  Box,
  Paper,
  LinearProgress,
  Fade,
  Slide,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { motion } from "framer-motion";
import registerPage from "../../images/regsiterPage.jpg";
import { registerUser } from "../../features/user_module/userActions";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    age: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobileNumber: "",
  });

  const [errors, setErrors] = useState({
    firstname: "",
    lastname: "",
    age: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobileNumber: "",
  });

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: "",
    color: "#f5f5f5",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasMobileNumber, setHasMobileNumber] = useState(false);
  const [touched, setTouched] = useState({
    firstname: false,
    lastname: false,
    age: false,
    email: false,
    password: false,
    confirmPassword: false,
    mobileNumber: false,
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const storedMobileNumber = localStorage.getItem("mobileNumber");
    if (storedMobileNumber) {
      setHasMobileNumber(true);
      setFormData((prev) => ({ ...prev, mobileNumber: storedMobileNumber }));
    } else {
      setHasMobileNumber(false);
    }

    const img = new Image();
    img.src = registerPage;
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") {
      evaluatePasswordStrength(value);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));
    validateField(name, formData[name]);
  };

  const evaluatePasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength({
        score: 0,
        message: "",
        color: "#f5f5f5",
      });
      return;
    }

    const strength = zxcvbn(password);
    let message = "";
    let color = "";

    switch (strength.score) {
      case 0:
      case 1:
        message = "Weak";
        color = "#ff5252";
        break;
      case 2:
        message = "Fair";
        color = "#ffb74d";
        break;
      case 3:
        message = "Good";
        color = "#ffd54f";
        break;
      case 4:
        message = "Strong";
        color = "#4caf50";
        break;
      default:
        message = "";
        color = "#f5f5f5";
    }

    setPasswordStrength({
      score: strength.score,
      message,
      color,
    });
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "firstname":
        error = value.trim() === "" ? "First name is required" : "";
        break;
      case "lastname":
        error = value.trim() === "" ? "Last name is required" : "";
        break;
      case "age":
        error =
          value.trim() === ""
            ? "Age is required"
            : isNaN(value) || value < 1
            ? "Please enter a valid age"
            : "";
        break;
      case "email":
        error =
          value.trim() === ""
            ? "Email is required"
            : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            ? "Invalid email format"
            : "";
        break;
      case "password":
        error =
          value.trim() === ""
            ? "Password is required"
            : value.length < 8
            ? "Password must be at least 8 characters"
            : "";
        break;
      case "confirmPassword":
        error =
          value.trim() === ""
            ? "Please confirm your password"
            : value !== formData.password
            ? "Passwords do not match"
            : "";
        break;
      case "mobileNumber":
        if (!hasMobileNumber) {
          error =
            value.trim() === ""
              ? "Mobile number is required"
              : !/^[0-9]{10}$/.test(value)
              ? "Invalid mobile number format"
              : "";
        }
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
    // Mark all fields as touched
    const newTouched = {};
    Object.keys(touched).forEach(field => {
      newTouched[field] = true;
    });
    setTouched(newTouched);

    // Validate all fields
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach(field => {
      if (field === "mobileNumber" && hasMobileNumber) return;
      
      let error = "";
      const value = formData[field];

      switch (field) {
        case "firstname":
          error = value.trim() === "" ? "First name is required" : "";
          break;
        case "lastname":
          error = value.trim() === "" ? "Last name is required" : "";
          break;
        case "age":
          error = value.trim() === "" 
            ? "Age is required" 
            : isNaN(value) || value < 1 
            ? "Please enter a valid age" 
            : "";
          break;
        case "email":
          error = value.trim() === "" 
            ? "Email is required" 
            : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) 
            ? "Invalid email format" 
            : "";
          break;
        case "password":
          error = value.trim() === "" 
            ? "Password is required" 
            : value.length < 8 
            ? "Password must be at least 8 characters" 
            : "";
          break;
        case "confirmPassword":
          error = value.trim() === "" 
            ? "Please confirm your password" 
            : value !== formData.password 
            ? "Passwords do not match" 
            : "";
          break;
        case "mobileNumber":
          if (!hasMobileNumber) {
            error = value.trim() === "" 
              ? "Mobile number is required" 
              : !/^[0-9]{10}$/.test(value) 
              ? "Invalid mobile number format" 
              : "";
          }
          break;
        default:
          break;
      }

      if (error) {
        isValid = false;
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(formData.password, saltRounds);

      const userData = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        age: formData.age,
        email: formData.email,
        password: hashedPassword,
        mobileNumber: hasMobileNumber 
          ? localStorage.getItem("mobileNumber") 
          : formData.mobileNumber,
      };

      const response = await dispatch(registerUser(userData)).unwrap();
      if (response.statusType === true) {
        navigate("/login");
        localStorage.clear();
      }
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      firstname: "",
      lastname: "",
      age: "",
      email: "",
      password: "",
      confirmPassword: "",
      mobileNumber: "",
    });
    setErrors({
      firstname: "",
      lastname: "",
      age: "",
      email: "",
      password: "",
      confirmPassword: "",
      mobileNumber: "",
    });
    setPasswordStrength({
      score: 0,
      message: "",
      color: "#f5f5f5",
    });
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
          backgroundImage: `url(${registerPage})`,
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
            Join Us Today
          </Typography>
          <Typography variant="h6">
            Start your journey with our community
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
              maxWidth: 500,
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
                    mb: 2,
                  }}
                >
                  Create Account
                </Typography>

                <Typography
                  variant="body1"
                  color="textSecondary"
                  align="center"
                  mb={4}
                  sx={{ fontStyle: "inherit" }}
                >
                  Fill in your details to get started
                </Typography>

                <form onSubmit={handleSubmit}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      style={{ flex: 1 }}
                    >
                      <TextField
                        fullWidth
                        label="First Name"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!errors.firstname}
                        helperText={errors.firstname}
                        variant="outlined"
                        margin="normal"
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      style={{ flex: 1 }}
                    >
                      <TextField
                        fullWidth
                        label="Last Name"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!errors.lastname}
                        helperText={errors.lastname}
                        variant="outlined"
                        margin="normal"
                      />
                    </motion.div>
                  </Box>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <TextField
                      fullWidth
                      label="Age"
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!errors.age}
                      helperText={errors.age}
                      variant="outlined"
                      margin="normal"
                      inputProps={{ min: 1 }}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!errors.email}
                      helperText={errors.email}
                      variant="outlined"
                      margin="normal"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <TextField
                      fullWidth
                      label="Password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!errors.password}
                      helperText={errors.password}
                      variant="outlined"
                      margin="normal"
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
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    {formData.password && (
                      <Box sx={{ mt: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={(passwordStrength.score + 1) * 25}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: "#e0e0e0",
                            "& .MuiLinearProgress-bar": {
                              backgroundColor: passwordStrength.color,
                            },
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            display: "block",
                            textAlign: "right",
                            color: passwordStrength.color,
                            fontWeight: "bold",
                          }}
                        >
                          {passwordStrength.message}
                        </Typography>
                      </Box>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <TextField
                      fullWidth
                      label="Confirm Password"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword}
                      variant="outlined"
                      margin="normal"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              edge="end"
                              sx={{
                                color: showConfirmPassword
                                  ? "#1976d2"
                                  : "inherit",
                                transition: "color 0.3s",
                              }}
                            >
                              {showConfirmPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </motion.div>

                  {!hasMobileNumber && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <TextField
                        fullWidth
                        label="Mobile Number"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={!!errors.mobileNumber}
                        helperText={errors.mobileNumber}
                        variant="outlined"
                        margin="normal"
                        inputProps={{
                          maxLength: 10,
                          inputMode: "numeric",
                          pattern: "[0-9]*",
                        }}
                      />
                    </motion.div>
                  )}

                  <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      style={{ flex: 1 }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={loading}
                        size="large"
                        sx={{
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
                          "Register"
                        )}
                      </Button>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                      style={{ flex: 1 }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        onClick={handleReset}
                        size="large"
                        sx={{
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
                        Reset
                      </Button>
                    </motion.div>
                  </Box>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    <Divider sx={{ my: 3 }}>
                      <Typography variant="body2" color="textSecondary">
                        Already have an account?
                      </Typography>
                    </Divider>
                    <Box sx={{ textAlign: "center" }}>
                      <Link to="/login" style={{ textDecoration: "none" }}>
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
                          Login here
                        </Typography>
                      </Link>
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

export default RegisterPage;
