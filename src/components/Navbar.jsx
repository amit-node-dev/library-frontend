// REACT IMPORTS
import React from "react";

// THIRD PARTY IMPORTS
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../utils/apiClient";

// MUI IMPORTS
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { deepOrange } from "@mui/material/colors";

// LOGO
import BrandLogo from "../images/brandLogo.gif";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await apiClient.post(`http://localhost:8080/api/v1/auth/logout`);
    localStorage.clear();
    toast.success("Thank You! For Visiting Us.");
    navigate("/login");
  };

  const firstName = localStorage.getItem("firstname") || "";
  const lastName = localStorage.getItem("lastname") || "";
  const avatarChar = firstName.charAt(0).toUpperCase() || "-";

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "#343a40",
        padding: "0.01rem 0.5rem",
        borderBottom: "2px solid #495057",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
        transition: "background-color 0.3s ease",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box display="flex" alignItems="center">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="brand-logo"
            component={Link}
            to="/dashboard"
          >
            <img src={BrandLogo} alt="brand-logo" style={{ height: 50 }} />
          </IconButton>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: "2rem",
          }}
        >
          <Typography
            component={Link}
            to="/books"
            sx={{
              color: "#ffffff",
              fontSize: "1rem",
              fontWeight: 500,
              textDecoration: "none",
              position: "relative",
              "&:hover": {
                color: "#adb5bd",
                transform: "scale(1.1)",
                "&::after": {
                  width: "100%",
                },
              },
              "&::after": {
                content: '""',
                display: "block",
                width: 0,
                height: "2px",
                background: "#007bff",
                transition: "width 0.3s",
                position: "absolute",
                bottom: "-2px",
                left: 0,
              },
            }}
          >
            Books
          </Typography>
          <Typography
            component={Link}
            to="/authors"
            sx={{
              color: "#ffffff",
              fontSize: "1rem",
              fontWeight: 500,
              textDecoration: "none",
              position: "relative",
              "&:hover": {
                color: "#adb5bd",
                transform: "scale(1.1)",
                "&::after": {
                  width: "100%",
                },
              },
              "&::after": {
                content: '""',
                display: "block",
                width: 0,
                height: "2px",
                background: "#007bff",
                transition: "width 0.3s",
                position: "absolute",
                bottom: "-2px",
                left: 0,
              },
            }}
          >
            Authors
          </Typography>
          <Typography
            component={Link}
            to="/users"
            sx={{
              color: "#ffffff",
              fontSize: "1rem",
              fontWeight: 500,
              textDecoration: "none",
              position: "relative",
              "&:hover": {
                color: "#adb5bd",
                transform: "scale(1.1)",
                "&::after": {
                  width: "100%",
                },
              },
              "&::after": {
                content: '""',
                display: "block",
                width: 0,
                height: "2px",
                background: "#007bff",
                transition: "width 0.3s",
                position: "absolute",
                bottom: "-2px",
                left: 0,
              },
            }}
          >
            Users
          </Typography>
          <Typography
            component={Link}
            to="/roles"
            sx={{
              color: "#ffffff",
              fontSize: "1rem",
              fontWeight: 500,
              textDecoration: "none",
              position: "relative",
              "&:hover": {
                color: "#adb5bd",
                transform: "scale(1.1)",
                "&::after": {
                  width: "100%",
                },
              },
              "&::after": {
                content: '""',
                display: "block",
                width: 0,
                height: "2px",
                background: "#007bff",
                transition: "width 0.3s",
                position: "absolute",
                bottom: "-2px",
                left: 0,
              },
            }}
          >
            Roles
          </Typography>
          <Typography
            component={Link}
            to="/about"
            sx={{
              color: "#ffffff",
              fontSize: "1rem",
              fontWeight: 500,
              textDecoration: "none",
              position: "relative",
              "&:hover": {
                color: "#adb5bd",
                transform: "scale(1.1)",
                "&::after": {
                  width: "100%",
                },
              },
              "&::after": {
                content: '""',
                display: "block",
                width: 0,
                height: "2px",
                background: "#007bff",
                transition: "width 0.3s",
                position: "absolute",
                bottom: "-2px",
                left: 0,
              },
            }}
          >
            About
          </Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <Avatar
            sx={{
              bgcolor: deepOrange[300],
              width: 30,
              height: 30,
              marginRight: "10px",
            }}
          >
            {avatarChar}
          </Avatar>
          <Typography
            variant="body1"
            sx={{ color: "#ffffff", marginRight: "1rem" }}
          >
            {firstName} {lastName}
          </Typography>
          <Button
            sx={{
              backgroundColor: "#dc3545",
              color: "#ffffff",
              borderRadius: 4,
              padding: "0.5rem 1rem",
              fontSize: "0.7rem",
              transition: "background-color 0.3s, transform 0.3s",
              "&:hover": {
                backgroundColor: "#c82333",
                transform: "scale(1.1)",
              },
            }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
