// REACT IMPORTS
import React, { useEffect, useState } from "react";

// THIRD PARTY IMPORTS
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../utils/apiClient";

// MUI INPUT & DISPLAY IMPORTS
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Avatar,
  Button,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";

// MUI COLORS
import { deepOrange } from "@mui/material/colors";

// MUI ICONS IMPORTS
import {
  Book as BookIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Settings as SettingsIcon,
  Article as ArticleIcon,
  BookmarkAdded as BookmarkAddedIcon,
  Notifications as NotificationsIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";

// LOGO
import BrandLogo from "../images/brand-logo.png";

const Navbar = () => {
  const navigate = useNavigate();

  const [catalogMenuAnchorEl, setCatalogMenuAnchorEl] = useState(null);
  const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState(null);
  const [roleName, setRoleName] = useState("");

  const handleLogout = async () => {
    await apiClient.post(`/auth/logout`);
    localStorage.clear();
    toast.success("Thank You! For Visiting Us.");
    navigate("/login");
  };

  const handleMenuOpen = (event, setAnchorEl) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (setAnchorEl) => {
    setAnchorEl(null);
  };

  const firstName = localStorage.getItem("firstname") || "";
  const lastName = localStorage.getItem("lastname") || "";
  const roleId = parseInt(localStorage.getItem("roleId"), 10) || "";
  const avatarChar = firstName.charAt(0).toUpperCase() || "-";

  const getRole = () => {
    try {
      switch (roleId) {
        case 1:
          setRoleName("Super Admin");
          break;
        case 2:
          setRoleName("Admin");
          break;
        default:
          setRoleName("Customer");
          break;
      }
    } catch (error) {
      console.log("ERROR IN GET ROLE ::: ", error);
    }
  };

  useEffect(() => {
    getRole();
  }, [roleId]);

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
          <Box>
            <Typography
              onClick={(event) => handleMenuOpen(event, setCatalogMenuAnchorEl)}
              sx={{
                cursor: "pointer",
                color: "#ffffff",
                fontSize: "0.9rem",
                fontWeight: 500,
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
              Catalog
            </Typography>
            <Menu
              anchorEl={catalogMenuAnchorEl}
              open={Boolean(catalogMenuAnchorEl)}
              onClose={() => handleMenuClose(setCatalogMenuAnchorEl)}
              sx={{
                "& .MuiPaper-root": {
                  borderRadius: 2,
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                  mt: 2,
                  minWidth: 180,
                  color: "#495057",
                },
              }}
            >
              {/* BOOKS */}
              <MenuItem
                component={Link}
                to="/books"
                onClick={() => handleMenuClose(setCatalogMenuAnchorEl)}
                sx={{
                  "&:hover": {
                    backgroundColor: "#dedede",
                    color: "#343a40",
                  },
                }}
              >
                <ListItemIcon>
                  <BookIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Books" />
              </MenuItem>

              {/* BORROW RECORDS */}
              <MenuItem
                component={Link}
                to="/borrowing_records"
                onClick={() => handleMenuClose(setCatalogMenuAnchorEl)}
                sx={{
                  "&:hover": {
                    backgroundColor: "#dedede",
                    color: "#343a40",
                  },
                }}
              >
                <ListItemIcon>
                  <ArticleIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Borrow" />
              </MenuItem>

              {/* RESERAVATIONS */}
              <MenuItem
                component={Link}
                to="/reservations"
                onClick={() => handleMenuClose(setCatalogMenuAnchorEl)}
                sx={{
                  "&:hover": {
                    backgroundColor: "#dedede",
                    color: "#343a40",
                  },
                }}
              >
                <ListItemIcon>
                  <BookmarkAddedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Reservation" />
              </MenuItem>
            </Menu>
          </Box>

          <Divider
            orientation="vertical"
            flexItem
            sx={{
              borderColor: "#dedede",
            }}
          />

          <Box>
            <Typography
              onClick={(event) => handleMenuOpen(event, setProfileMenuAnchorEl)}
              sx={{
                cursor: "pointer",
                color: "#ffffff",
                fontSize: "0.9rem",
                fontWeight: 500,
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
              Manage Profile
            </Typography>
            <Menu
              anchorEl={profileMenuAnchorEl}
              open={Boolean(profileMenuAnchorEl)}
              onClose={() => handleMenuClose(setProfileMenuAnchorEl)}
              sx={{
                "& .MuiPaper-root": {
                  borderRadius: 2,
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                  mt: 2,
                  minWidth: 180,
                  color: "#495057",
                },
              }}
            >
              <MenuItem
                component={Link}
                to="/users"
                onClick={() => handleMenuClose(setProfileMenuAnchorEl)}
                sx={{
                  "&:hover": {
                    backgroundColor: "#f8f9fa",
                    color: "#343a40",
                  },
                }}
              >
                <ListItemIcon>
                  <GroupIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Users" />
              </MenuItem>
              <MenuItem
                component={Link}
                to="/roles"
                onClick={() => handleMenuClose(setProfileMenuAnchorEl)}
                sx={{
                  "&:hover": {
                    backgroundColor: "#f8f9fa",
                    color: "#343a40",
                  },
                }}
              >
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Roles" />
              </MenuItem>
              <MenuItem
                component={Link}
                to="/authors"
                onClick={() => handleMenuClose(setProfileMenuAnchorEl)}
                sx={{
                  "&:hover": {
                    backgroundColor: "#dedede",
                    color: "#343a40",
                  },
                }}
              >
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Authors" />
              </MenuItem>
            </Menu>
          </Box>

          <Divider
            orientation="vertical"
            flexItem
            sx={{
              borderColor: "#dedede",
            }}
          />

          <Typography
            component={Link}
            to="/about"
            sx={{
              color: "#ffffff",
              fontSize: "0.9rem",
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
          <Box sx={{ marginRight: "20px", cursor: "pointer" }}>
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon color="action" />
            </Badge>
          </Box>

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
          <Box>
            <Typography
              variant="body2"
              sx={{ color: "#ffffff", marginRight: "1rem" }}
            >
              {firstName} {lastName}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "#dedede",
                marginRight: "1rem",
                fontSize: "10px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {roleName}
            </Typography>
          </Box>

          <Button
            sx={{
              backgroundColor: "#dc3545",
              color: "#ffffff",
              borderRadius: 5,
              padding: "0.4rem 0.9rem",
              fontSize: "0.6rem",
              transition:
                "background-color 0.3s, transform 0.3s, box-shadow 0.3s",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              border: "1px solid transparent",
              "&:hover": {
                backgroundColor: "#c82333",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 12px rgba(0, 0, 0, 0.2)",
                border: "1px solid #dc3545",
              },
              "&:active": {
                backgroundColor: "#bd2130",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                transform: "translateY(0)",
              },
              "&:focus": {
                outline: "none",
                boxShadow: "0 0 0 3px rgba(220, 53, 69, 0.5)",
              },
            }}
            onClick={handleLogout}
          >
            <ArrowBackIcon fontSize="small" />
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
