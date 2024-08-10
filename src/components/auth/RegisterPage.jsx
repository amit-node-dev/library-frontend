// REACT IMPORTS
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// THIRD PARTY IMPORTS
import { useDispatch } from "react-redux";
import zxcvbn from "zxcvbn";
import bcrypt from "bcryptjs";

// MATERIAL-UI IMPORTS
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// ACTIONS & STORE
import { registerUser } from "../../features/user_module/userActions";

// CSS
import "./auth.css";
import registerPage from "../../images/regsiterPage.jpg";
import { Divider } from "@mui/material";

const RegisterPage = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [firstnameError, setFirstnameError] = useState("");
  const [lastnameError, setLastnameError] = useState("");
  const [ageError, setAgeError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const mobileNumber = localStorage.getItem("mobileNumber");

  const handleFirstNameBlur = () => {
    setFirstnameError(firstname === "" ? "First name is required" : "");
  };

  const handleLastNameBlur = () => {
    setLastnameError(lastname === "" ? "Last name is required" : "");
  };

  const handleAgeBlur = () => {
    setAgeError(lastname === "" ? "Age is required" : "");
  };

  const handleEmailBlur = () => {
    setEmailError(email === "" ? "Email Id is required" : "");
  };

  const handlePasswordBlur = () => {
    setPasswordError(password === "" ? "Password is required" : "");
  };

  const handleConfirmPasswordBlur = () => {
    setConfirmPasswordError(
      confirmPassword === "" ? "Confirm password is required" : ""
    );
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    // Check password strength
    const strength = zxcvbn(newPassword);
    let strengthMessage = "";
    switch (strength.score) {
      case 0:
      case 1:
        strengthMessage = "Weak";
        break;
      case 2:
        strengthMessage = "Fair";
        break;
      case 3:
        strengthMessage = "Good";
        break;
      case 4:
        strengthMessage = "Strong";
        break;
      default:
        strengthMessage = "";
    }
    setPasswordStrength(strengthMessage);
  };

  const handleSubmitRegisterForm = async (e) => {
    e.preventDefault();

    handleFirstNameBlur();
    handleLastNameBlur();
    handleAgeBlur();
    handleEmailBlur();
    handlePasswordBlur();
    handleConfirmPasswordBlur();

    if (firstname && lastname && age && email && password && confirmPassword) {
      if (password !== confirmPassword) {
        setConfirmPasswordError("Passwords do not match");
      } else {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const userData = {
          firstname,
          lastname,
          age,
          email,
          password: hashedPassword,
          mobileNumber,
        };
        const response = await dispatch(registerUser(userData)).unwrap();
        if (response.statusType === "SUCCESS") {
          navigate("/login");
        }
      }
    }
  };

  const handleReset = () => {
    setFirstname("");
    setLastname("");
    setEmail("");
    setAge("");
    setPassword("");
    setConfirmPassword("");

    setFirstnameError("");
    setLastnameError("");
    setEmailError("");
    setAgeError("");
    setPasswordError("");
    setConfirmPasswordError("");
  };

  return (
    <div className="main-container">
      <div className="image-container">
        <img
          src={registerPage}
          alt="Register Page"
          className="register-image"
        />
      </div>
      <div className="form-wrapper">
        <form className="form-container" onSubmit={handleSubmitRegisterForm}>
          <div className="form-group">
            <TextField
              id="firstname"
              label="First Name"
              variant="standard"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              onBlur={handleFirstNameBlur}
              error={!!firstnameError}
              helperText={firstnameError}
              fullWidth
              margin="normal"
            />
          </div>
          <div className="form-group">
            <TextField
              id="lastname"
              label="Last Name"
              variant="standard"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              onBlur={handleLastNameBlur}
              error={!!lastnameError}
              helperText={lastnameError}
              fullWidth
              margin="normal"
            />
          </div>
          <div className="form-group">
            <TextField
              id="age"
              label="Age"
              type="age"
              variant="standard"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              onBlur={handleAgeBlur}
              error={!!ageError}
              helperText={ageError}
              fullWidth
              margin="normal"
            />
          </div>
          <div className="form-group">
            <TextField
              id="email"
              label="Email Address"
              type="email"
              variant="standard"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={handleEmailBlur}
              error={!!emailError}
              helperText={emailError}
              fullWidth
              margin="normal"
            />
          </div>
          <div className="form-group">
            <TextField
              id="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="standard"
              value={password}
              onChange={handlePasswordChange}
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
            />
            {password.length > 0 && (
              <div className="password-strength">{passwordStrength}</div>
            )}
          </div>
          <div className="form-group">
            <TextField
              id="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              variant="standard"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            />
          </div>
          <div className="form-button">
            <Button
              type="submit"
              variant="contained"
              color="success"
              fullWidth
              style={{
                marginTop: "1rem",
                marginBottom: "2rem",
                marginRight: "5px",
              }}
            >
              Register
            </Button>
            <Button
              type="reset"
              size="small"
              variant="contained"
              color="error"
              fullWidth
              style={{
                marginTop: "1rem",
                marginBottom: "2rem",
                marginLeft: "5px",
              }}
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>

          <Divider />
          <div className="center-text">
            <Typography align="center" variant="caption" component="h4">
              Already have an account?
            </Typography>
            <Link to="/login" className="login-link">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
