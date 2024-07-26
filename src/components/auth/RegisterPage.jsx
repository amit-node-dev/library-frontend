// eslint-disable-next-line

// REACT IMPORTS
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// THIRD PARTY IMPORTS
import { useDispatch } from "react-redux";
import zxcvbn from "zxcvbn";
import bcrypt from "bcryptjs";

// ACTIONS & STORE
import { registerNewUser } from "../../features/user_module/userActions";

// CSS
import "./auth.css";

const RegisterPage = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [firstnameError, setFirstnameError] = useState("");
  const [lastnameError, setLastnameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleFirstNameBlur = () => {
    setFirstnameError(firstname === "" ? "First name is required" : "");
  };

  const handleLastNameBlur = () => {
    setLastnameError(lastname === "" ? "Last name is required" : "");
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
    handleEmailBlur();
    handlePasswordBlur();
    handleConfirmPasswordBlur();

    if (firstname && lastname && email && password && confirmPassword) {
      if (password !== confirmPassword) {
        setConfirmPasswordError("Passwords do not match");
      } else {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const userData = {
          firstname,
          lastname,
          email,
          password: hashedPassword,
        };
        const response = await dispatch(registerNewUser(userData)).unwrap();
        if (response.statusType === "SUCCESS") {
          navigate("/login");
        }
      }
    }
  };

  return (
    <div className="container">
      <form className="form-container" onSubmit={handleSubmitRegisterForm}>
        <div className="form-group">
          <label htmlFor="firstname" className="form-label">
            First Name
          </label>
          <input
            type="text"
            id="firstname"
            placeholder="Enter your first name"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            onBlur={handleFirstNameBlur}
            className="form-input"
          />
          {firstnameError && (
            <div className="error-message">{firstnameError}</div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="lastname" className="form-label">
            Last Name
          </label>
          <input
            type="text"
            id="lastname"
            placeholder="Enter your last name"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            onBlur={handleLastNameBlur}
            className="form-input"
          />
          {lastnameError && (
            <div className="error-message">{lastnameError}</div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address
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
            onChange={handlePasswordChange}
            onBlur={handlePasswordBlur}
            className="form-input"
          />
          {passwordError && (
            <div className="error-message">{passwordError}</div>
          )}
          {password.length > 0 && (
            <div className="password-strength">{passwordStrength}</div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={handleConfirmPasswordBlur}
            className="form-input"
          />
          {confirmPasswordError && (
            <div className="error-message">{confirmPasswordError}</div>
          )}
        </div>
        <button type="submit" className="submit-btn">
          Register
        </button>
        <hr />
        <div className="center-text">
          <h4>Already have an account?</h4>
          <Link to="/login" className="register-link">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
