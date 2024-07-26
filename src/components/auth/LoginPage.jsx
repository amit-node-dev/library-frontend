// REACT IMPORTS
import React, { useState } from "react";

// THIRD PARTY IMPORTS
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

// ACTIONS & STORES
import { loginUser } from "../../features/user_module/userActions";

// CSS
import "./auth.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  return (
    <div className="container">
      <form className="form-container" onSubmit={handleSubmitLoginForm}>
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={handleEmailBlur}
            className="form-input"
          />
          {emailError && <div className="error-message">{emailError}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={handlePasswordBlur}
            className="form-input"
          />
          {passwordError && (
            <div className="error-message">{passwordError}</div>
          )}
        </div>
        <button type="submit" className="submit-btn">
          Login
        </button>
        <hr />
        <div className="center-text">
          <h4>If you don't have an account </h4>
          <Link to="/register" className="register-link">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
