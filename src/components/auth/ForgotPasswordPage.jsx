import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  InputAdornment,
  Box,
  Paper,
  CircularProgress,
  Fade,
  Slide,
  Alert,
  IconButton,
} from "@mui/material";
import { motion } from "framer-motion";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { validateEmail, validateMobile } from "../../utils/validations";
import {
  verifyUserDetails,
  sendOTP,
  verifyOTP,
  resetPassword,
} from "../../features/user_module/userActions";

const ForgotPasswordPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    mobile: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState({ text: "", severity: "" });
  const [touched, setTouched] = useState({
    email: false,
    mobile: false,
    otp: false,
    password: false,
    confirmPassword: false,
  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      case "mobile":
        error = validateMobile(value);
        break;
      case "password":
        error =
          value.length < 6 ? "Password must be at least 6 characters" : "";
        break;
      case "confirmPassword":
        error = value !== formData.password ? "Passwords do not match" : "";
        break;
      case "otp":
        error = value.length !== 6 ? "OTP must be 6 digits" : "";
        break;
      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const validateStep = (currentStep) => {
    let isValid = true;
    const newErrors = { ...errors };

    if (currentStep === 1) {
      if (!formData.email && !formData.mobile) {
        newErrors.email = "Email or mobile is required";
        newErrors.mobile = "Email or mobile is required";
        isValid = false;
      } else {
        if (formData.email) {
          newErrors.email = validateEmail(formData.email);
          if (newErrors.email) isValid = false;
        }
        if (formData.mobile) {
          newErrors.mobile = validateMobile(formData.mobile);
          if (newErrors.mobile) isValid = false;
        }
      }
    } else if (currentStep === 2) {
      newErrors.otp = formData.otp.length !== 6 ? "OTP must be 6 digits" : "";
      if (newErrors.otp) isValid = false;
    } else if (currentStep === 3) {
      newErrors.password =
        formData.password.length < 6
          ? "Password must be at least 6 characters"
          : "";
      newErrors.confirmPassword =
        formData.confirmPassword !== formData.password
          ? "Passwords do not match"
          : "";

      if (newErrors.password || newErrors.confirmPassword) isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleVerifyAndSendOTP = async () => {
    if (validateStep(1)) {
      setLoading(true);
      try {
        const verifyResponse = await dispatch(
          verifyUserDetails({
            emailId: formData.email,
            mobileNumber: formData.mobile,
          })
        ).unwrap();

        if (verifyResponse.statusType === true) {
          const otpResponse = await dispatch(
            sendOTP({
              mobileNumber: formData.mobile,
              mode: "reset",
            })
          ).unwrap();

          if (otpResponse.statusType === true) {
            setStep(2);
            setMessage({
              text: "OTP sent successfully",
              severity: "success",
            });
          } else {
            setMessage({
              text: otpResponse.message || "Failed to send OTP",
              severity: "error",
            });
          }
        } else {
          setMessage({
            text: verifyResponse.message || "Verification failed",
            severity: "error",
          });
        }
      } catch (error) {
        setMessage({
          text: error.message || "Verification and OTP sending failed",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmitOTP = async () => {
    if (validateStep(2)) {
      setLoading(true);
      try {
        const response = await dispatch(
          verifyOTP({
            mobileNumber: formData.mobile,
            otp: formData.otp,
          })
        ).unwrap();

        if (response.statusType === true) {
          setStep(3);
          setMessage({
            text: "OTP verified. Please set new password",
            severity: "success",
          });
        } else {
          setMessage({
            text: response.message || "OTP verification failed",
            severity: "error",
          });
        }
      } catch (error) {
        setMessage({
          text: error.message || "OTP verification failed",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleResetPassword = async () => {
    if (validateStep(3)) {
      setLoading(true);
      try {
        const response = await dispatch(
          resetPassword({
            emailId: formData.email,
            mobileNumber: formData.mobile,
            password: formData.password,
          })
        ).unwrap();

        if (response.statusType === true) {
          setMessage({
            text: "Password reset successfully. Redirecting to login...",
            severity: "success",
          });
          setTimeout(() => navigate("/login"), 2000);
        } else {
          setMessage({
            text: response.message || "Password reset failed",
            severity: "error",
          });
        }
      } catch (error) {
        setMessage({
          text: error.message || "Password reset failed",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const renderButton = () => {
    switch (step) {
      case 1:
        return (
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleVerifyAndSendOTP}
            disabled={loading}
            sx={{
              mt: 2,
              mb: 2,
              height: 48,
              fontSize: "1rem",
              fontWeight: 600,
              borderRadius: 2,
              textTransform: "none",
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Verify & Send OTP"
            )}
          </Button>
        );
      case 2:
        return (
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSubmitOTP}
            disabled={loading}
            sx={{
              mt: 2,
              mb: 2,
              height: 48,
              fontSize: "1rem",
              fontWeight: 600,
              borderRadius: 2,
              textTransform: "none",
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Submit OTP"
            )}
          </Button>
        );
      case 3:
        return (
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleResetPassword}
            disabled={loading}
            sx={{
              mt: 2,
              mb: 2,
              height: 48,
              fontSize: "1rem",
              fontWeight: 600,
              borderRadius: 2,
              textTransform: "none",
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Update Password"
            )}
          </Button>
        );
      default:
        return null;
    }
  };

  const toggleShowPassword = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
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
                  Reset Your Password
                </Typography>

                <Typography
                  variant="body1"
                  color="textSecondary"
                  align="center"
                  mb={4}
                >
                  {step === 1
                    ? "Enter your email or mobile number to verify your account"
                    : step === 2
                    ? "Enter the OTP sent to your email/mobile"
                    : "Set your new password"}
                </Typography>

                {message.text && (
                  <Alert severity={message.severity} sx={{ mb: 3 }}>
                    {message.text}
                  </Alert>
                )}

                <form>
                  {step === 1 && (
                    <>
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
                          variant="outlined"
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
                          label="Mobile Number"
                          name="mobile"
                          type="tel"
                          value={formData.mobile}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.mobile && !!errors.mobile}
                          helperText={touched.mobile && errors.mobile}
                          variant="outlined"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                +91
                              </InputAdornment>
                            ),
                          }}
                        />
                      </motion.div>
                    </>
                  )}

                  {step === 2 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <TextField
                        fullWidth
                        margin="normal"
                        label="OTP"
                        name="otp"
                        type="text"
                        value={formData.otp}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.otp && !!errors.otp}
                        helperText={touched.otp && errors.otp}
                        variant="outlined"
                        inputProps={{ maxLength: 6 }}
                      />
                    </motion.div>
                  )}

                  {step === 3 && (
                    <>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <TextField
                          fullWidth
                          margin="normal"
                          label="New Password"
                          name="password"
                          type={showPassword.password ? "text" : "password"}
                          value={formData.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.password && !!errors.password}
                          helperText={touched.password && errors.password}
                          variant="outlined"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => toggleShowPassword("password")}
                                  edge="end"
                                >
                                  {showPassword.password ? (
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

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <TextField
                          fullWidth
                          margin="normal"
                          label="Confirm Password"
                          name="confirmPassword"
                          type={
                            showPassword.confirmPassword ? "text" : "password"
                          }
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={
                            touched.confirmPassword && !!errors.confirmPassword
                          }
                          helperText={
                            touched.confirmPassword && errors.confirmPassword
                          }
                          variant="outlined"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() =>
                                    toggleShowPassword("confirmPassword")
                                  }
                                  edge="end"
                                >
                                  {showPassword.confirmPassword ? (
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
                    </>
                  )}

                  {renderButton()}

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Box sx={{ textAlign: "center", mt: 3 }}>
                      <Typography variant="body2">
                        Remember your password?{" "}
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
                            Sign In
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

export default ForgotPasswordPage;
