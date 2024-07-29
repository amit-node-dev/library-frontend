// REACT IMPORTS
import React, { useState } from "react";

// THIRD PARTY IMPORTS
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

// ACTIONS & STORES
import { loginUser } from "../../features/user_module/userActions";

// MATERIAL-UI IMPORTS
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// CSS
import "./auth.css";
import loginPage from "../../images/loginPage.jpg";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleEmailBlur = () => {
    setEmailError(email === "" ? "Email Id is required" : "");
  };

  const handlePasswordBlur = () => {
    setPasswordError(password === "" ? "Password is required" : "");
  };

  const handleSubmitLoginForm = async (e) => {
    e.preventDefault();
    localStorage.setItem("email", email);
    try {
      setEmailError("");
      setPasswordError("");

      if (email === "") {
        setEmailError("Email Id is required");
      }

      if (password === "") {
        setPasswordError("Password is required");
      }

      if (email && password) {
        const userData = {
          email,
          password,
        };
        const response = await dispatch(loginUser(userData)).unwrap();
        if (response.statusType === "SUCCESS") {
          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.log("ERROR IN HANDLE SUBMIT ::: ", error);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
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
              id="email"
              label="Email Id"
              placeholder="Enter Email Id"
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
              onChange={(e) => setPassword(e.target.value)}
              onBlur={handlePasswordBlur}
              error={!!passwordError}
              helperText={passwordError}
              fullWidth
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
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
            style={{ marginTop: "1rem" }}
          >
            Login
          </Button>
          <hr />
          <div className="center-text">
            <Typography align="center" variant="caption" component="h4">
              If you don't have an account
            </Typography>
            <Link to="/register" className="register-link">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
