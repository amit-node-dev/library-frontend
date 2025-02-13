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
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  List,
  ListItem,
  keyframes,
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
  Notifications as NotificationsIcon,
  ArrowBack as ArrowBackIcon,
  CurrencyExchange,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

// LOGO
import BrandLogo from "../images/brand-logo.png";
import { useDispatch, useSelector } from "react-redux";
import { currentUserPoints } from "../features/user_module/userActions";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get points from Redux store
  const points = useSelector((state) => state.users.points);

  const [notifications, setNotifications] = useState([
    { id: 1, message: "Your book request is approved" },
    { id: 2, message: "Reminder: Return book by tomorrow" },
    { id: 3, message: "New book added: JavaScript Essentials" },
  ]);
  const [openNotif, setOpenNotif] = useState(false);
  const anchorRef = React.useRef(null);

  const [catalogMenuAnchorEl, setCatalogMenuAnchorEl] = useState(null);
  const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState(null);
  const [roleName, setRoleName] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const firstName = localStorage.getItem("firstname") || "";
  const lastName = localStorage.getItem("lastname") || "";
  const roleId = parseInt(localStorage.getItem("roleId"), 10) || "";
  const avatarChar = firstName.charAt(0).toUpperCase() || "-";
  const email = localStorage.getItem("email") || "";
  const userId = localStorage.getItem("userId") || "";

  useEffect(() => {
    dispatch(currentUserPoints({ email, userId }));
  }, [dispatch, email, userId]);

  const handleRefreshPoints = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    try {
      await dispatch(currentUserPoints({ email, userId })).unwrap();
    } catch (error) {
      toast.error("Failed to refresh points");
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  useEffect(() => {
    const roles = { 1: "Super Admin", 2: "Admin" };
    setRoleName(roles[roleId] || "Customer");
  }, [roleId]);

  const rotateAnimation = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  `;

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

  const toggleNotifications = () => {
    setOpenNotif((prevOpen) => !prevOpen);
  };

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

              {/* PENALTIES */}
              <MenuItem
                component={Link}
                to="/penalties"
                onClick={() => handleMenuClose(setCatalogMenuAnchorEl)}
                sx={{
                  "&:hover": {
                    backgroundColor: "#dedede",
                    color: "#343a40",
                  },
                }}
              >
                <ListItemIcon>
                  <CurrencyExchange fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Penalties" />
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
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#ffc107",
              color: "#343a40",
              borderRadius: "5px",
              fontWeight: "bold",
              marginRight: "20px",
            }}
          >
            Points: {points}
            <IconButton
              size="small"
              onClick={handleRefreshPoints}
              sx={{
                color: "#343a40",
                animation: isRefreshing
                  ? `${rotateAnimation} 0.5s linear`
                  : "none",
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Button>

          {/* NOTIFICATIONS DROPDOWN */}
          <Box sx={{ position: "relative", marginRight: "20px" }}>
            <IconButton ref={anchorRef} onClick={toggleNotifications}>
              <Badge badgeContent={notifications.length} color="secondary">
                <NotificationsIcon color="action" />
              </Badge>
            </IconButton>
            <Popper
              open={openNotif}
              anchorEl={anchorRef.current}
              role={undefined}
              placement="bottom-end"
              transition
              disablePortal
            >
              {({ TransitionProps }) => (
                <Grow {...TransitionProps}>
                  <Paper
                    sx={{
                      width: 250,
                      boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                      borderRadius: "8px",
                    }}
                  >
                    <ClickAwayListener onClickAway={() => setOpenNotif(false)}>
                      <List>
                        {notifications.length > 0 ? (
                          notifications.map((notif) => (
                            <ListItem key={notif.id} divider>
                              <ListItemText primary={notif.message} />
                            </ListItem>
                          ))
                        ) : (
                          <ListItem>
                            <ListItemText primary="No new notifications" />
                          </ListItem>
                        )}
                      </List>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
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
