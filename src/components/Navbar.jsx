// REACT IMPORTS
import React from "react";

// THIRD PARTY IMPORTS
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../utils/apiClient";

// CSS IMPORTS
import "./dashboard/dashboard.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await apiClient.post(`http://localhost:8080/api/v1/auth/logout`);
    localStorage.clear();
    toast.success("Thank You! For Visting Us.");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <div className="navbar-brand-container">
          <Link className="navbar-brand" to="/dashboard">
            ❁LMS❁
          </Link>
        </div>
        <div className="navbar-nav-container">
          <div className="navbar-nav">
            <Link className="nav-link" to="/books">
              Books
            </Link>
            <Link className="nav-link" to="/authors">
              Author
            </Link>
            <Link className="nav-link" to="/users">
              Users
            </Link>
            <Link className="nav-link" to="/roles">
              Roles
            </Link>
            <Link className="nav-link" to="/about">
              About
            </Link>
          </div>
        </div>
        <div className="navbar-user-info">
          <span className="user-email">{localStorage.getItem("email")}</span>
          <button className="btn btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
