import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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
import loginPage from "../../images/loginPage.jpg";
import { sendOTP, verifyOTP } from "../../features/user_module/userActions";

const MobileOTPBased = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOTP] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [mobileNumberError, setMobileNumberError] = useState("");
  const [otpError, setOTPError] = useState("");
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [timer, setTimer] = useState(60);
  const [otpExpired, setOtpExpired] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const img = new Image();
    img.src = loginPage;
  }, []);

  useEffect(() => {
    let interval;
    if (isOTPSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsOTPSent(false);
      setOtpExpired(true);
      setTimer(60);
    }
    return () => clearInterval(interval);
  }, [isOTPSent, timer]);

  const validateMobileNumber = (number) => {
    const regex = /^[0-9]{10}$/;
    if (!number) {
      return "Mobile Number is required";
    } else if (!regex.test(number)) {
      return "Mobile Number must be 10 digits";
    }
    return "";
  };

  const validateOTP = (otpValue) => {
    const regex = /^[0-9]{6}$/;
    if (!otpValue) return "OTP is required";
    if (!regex.test(otpValue)) return "OTP must be 6 digits";
    return "";
  };

  const handleMobileNumberChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 10) {
      setMobileNumber(value);
      setMobileNumberError(validateMobileNumber(value));
    }
  };

  const handleOTPChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 6) {
      setOTP(value);
      setOTPError(validateOTP(value));
    }
  };

  const handleMobileNumberBlur = () => {
    setMobileNumberError(validateMobileNumber(mobileNumber));
  };

  const handleOTPBlur = () => {
    setOTPError(otp === "" ? "OTP is required" : "");
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();

    handleMobileNumberBlur();
    if (mobileNumber && !mobileNumberError) {
      setLoading(true);
      try {
        const response = await dispatch(sendOTP(mobileNumber)).unwrap();
        if (response.statusType === true) {
          setIsOTPSent(true);
          setOtpExpired(false);
          setTimer(60);
        }
      } catch (error) {
        toast.error("Failed to send OTP. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      setOTPError("");
      handleOTPBlur();

      if (mobileNumber && otp && !mobileNumberError && !otpError) {
        if (otpExpired) {
          setOTPError("OTP has expired. Please request a new one.");
          return;
        }

        const userData = {
          mobileNumber,
          otp,
        };
        const response = await dispatch(verifyOTP(userData)).unwrap();
        if (response.statusType === true) {
          localStorage.setItem("mobileNumber", response.data?.mobileNumber);

          navigate("/register");
          setTimeout(() => {
            toast.info("Please complete your registration");
          }, 1000);
        } else {
          setOTPError("Invalid OTP. Please try again.");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
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
          backgroundImage: `url(${loginPage})`,
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
            Mobile Login
          </Typography>
          <Typography variant="h6">
            Secure login with OTP verification
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
                    mb: 2,
                  }}
                >
                  OTP Verification
                </Typography>

                <Typography
                  variant="body1"
                  color="textSecondary"
                  align="center"
                  mb={4}
                  sx={{ fontStyle: "inherit" }}
                >
                  {isOTPSent
                    ? "Enter the OTP sent to your mobile"
                    : "Enter your mobile number to receive OTP"}
                </Typography>

                <form onSubmit={isOTPSent ? handleVerifyOTP : handleSendOTP}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <TextField
                      fullWidth
                      label="Mobile Number"
                      placeholder="Enter 10-digit mobile number"
                      variant="outlined"
                      value={mobileNumber}
                      onChange={handleMobileNumberChange}
                      onBlur={handleMobileNumberBlur}
                      error={!!mobileNumberError}
                      helperText={mobileNumberError}
                      margin="normal"
                      inputProps={{
                        maxLength: 10,
                        inputMode: "numeric",
                        pattern: "[0-9]*",
                      }}
                    />
                  </motion.div>

                  {isOTPSent && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <TextField
                        fullWidth
                        label="OTP"
                        type={showOTP ? "text" : "password"}
                        variant="outlined"
                        value={otp}
                        onChange={handleOTPChange}
                        error={!!otpError}
                        helperText={otpError}
                        margin="normal"
                        inputProps={{
                          maxLength: 6,
                          inputMode: "numeric",
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowOTP(!showOTP)}>
                                {showOTP ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Button
                      type="submit"
                      fullWidth
                      variant="outlined"
                      color="primary"
                      sx={{
                        mb: 3,
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
                      {loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : isOTPSent ? (
                        "Verify OTP"
                      ) : (
                        "Send OTP"
                      )}
                    </Button>
                  </motion.div>

                  {isOTPSent && timer > 0 && (
                    <Typography variant="body2" align="center" mt={2}>
                      Resend OTP in {timer}s
                    </Typography>
                  )}

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
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Box sx={{ textAlign: "center", mt: 2 }}>
                      <Typography align="center">
                        {isOTPSent ? (
                          <Button
                            onClick={() => setIsOTPSent(false)}
                            sx={{ textTransform: "none" }}
                          >
                            Change Mobile Number
                          </Button>
                        ) : (
                          <Typography variant="body2">
                            Already have an account?{" "}
                            <Link
                              to="/login"
                              style={{ textDecoration: "none" }}
                            >
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
                                Login
                              </Typography>
                            </Link>
                          </Typography>
                        )}
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

export default MobileOTPBased;
