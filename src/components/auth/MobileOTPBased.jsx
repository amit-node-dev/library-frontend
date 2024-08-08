// REACT IMPORTS
import React, { useEffect, useState } from "react";

// THIRD PARTY IMPORTS
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

// ACTIONS & STORES
import { sendOTP, verifyOTP } from "../../features/user_module/userActions";

// MATERIAL-UI IMPORTS
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { ButtonBase, Divider } from "@mui/material";

// CSS
import "./auth.css";
import loginPage from "../../images/loginPage.jpg";

const MobileOTPBased = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOTP] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [mobileNumberError, setMobileNumberError] = useState("");
  const [otpError, setOTPError] = useState("");
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [timer, setTimer] = useState(60);
  const [otpExpired, setOtpExpired] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      return "Mobile Number must be 10 digits long and contain only numbers";
    }
    return "";
  };

  const handleMobileNumberChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setMobileNumber(value);
      setMobileNumberError(validateMobileNumber(value));
    }
  };

  const handleMobileNumberBlur = () => {
    setMobileNumberError(validateMobileNumber(mobileNumber));
  };

  const handleOTPBlur = () => {
    setOTPError(otp === "" ? "OTP is required" : "");
  };

  const handleClickShowOTP = () => {
    setShowOTP((prevShowOTP) => !prevShowOTP);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSendOTP = async () => {
    handleMobileNumberBlur();
    if (mobileNumber && !mobileNumberError) {
      const response = await dispatch(sendOTP(mobileNumber)).unwrap();
      if (response.statusType === "SUCCESS") {
        setIsOTPSent(true);
        setOtpExpired(false);
        setTimer(60);
      }
    }
  };

  const handleSubmitLoginForm = async (e) => {
    e.preventDefault();
    try {
      setMobileNumberError("");
      setOTPError("");

      handleMobileNumberBlur();
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
        if (response.statusType === "SUCCESS") {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("mobileNumber", response.data.mobileNumber);
          navigate("/dashboard");
        } else {
          setOTPError("Invalid OTP");
        }
      }
    } catch (error) {
      console.log("ERROR IN HANDLE SUBMIT ::: ", error);
    }
  };

  return (
    <div className="main-container">
      <div className="image-container">
        <img src={loginPage} alt="Login Page" className="login-image" />
      </div>
      <div className="form-wrapper">
        <form className="form-container" onSubmit={handleSubmitLoginForm}>
          <div className="form-group">
            <TextField
              id="mobile_number"
              label="Mobile Number"
              placeholder="Enter Mobile Number"
              variant="standard"
              value={mobileNumber}
              onChange={handleMobileNumberChange}
              onBlur={handleMobileNumberBlur}
              error={!!mobileNumberError}
              helperText={mobileNumberError}
              fullWidth
              margin="normal"
              inputProps={{ maxLength: 10 }}
            />
            <div className="otp-text">
              <Typography variant="body2" color="secondary">
                <ButtonBase onClick={handleSendOTP} disabled={isOTPSent}>
                  {isOTPSent ? `Resend OTP (${timer}s)` : "Send OTP"}
                </ButtonBase>
              </Typography>
            </div>
          </div>
          <div className="form-group">
            <TextField
              id="otp"
              label="OTP"
              type={showOTP ? "text" : "password"}
              variant="standard"
              value={otp}
              onChange={(e) => setOTP(e.target.value)}
              onBlur={handleOTPBlur}
              error={!!otpError}
              helperText={otpError}
              fullWidth
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowOTP}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showOTP ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: "1rem", marginBottom: "2rem" }}
          >
            Verify
          </Button>

          <Divider />

          <div className="center-text">
            <Link to="/register" className="register-link">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MobileOTPBased;
