import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiClient from "../utils/apiClient";
import { currentUserPoints } from "../features/user_module/userActions";

// MUI Components
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
  Popover,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  Chip,
  CircularProgress,
  styled,
} from "@mui/material";
import { deepPurple, amber } from "@mui/material/colors";

// MUI Icons
import {
  Book as BookIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Settings as SettingsIcon,
  Article as ArticleIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon,
  CurrencyExchange,
  Refresh as RefreshIcon,
  ExpandMore,
  ExpandLess,
  AccountCircle,
  Menu as MenuIcon,
} from "@mui/icons-material";

// Assets
import BrandLogo from "../images/brand-logo.png";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));

const GradientAppBar = styled(AppBar)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.grey[900]} 0%, ${theme.palette.grey[500]} 100%)`,
  color: theme.palette.common.white,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
  borderBottom: `1px solid ${theme.palette.grey[700]}`,
}));

const Navbar = ({ onMenuToggle }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get points from Redux store
  const points = useSelector((state) => state.users.points);
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      message: "Your book request is approved",
      read: false,
      timestamp: "2 hours ago",
      icon: <BookIcon color="success" />
    },
    { 
      id: 2, 
      message: "Reminder: Return book by tomorrow",
      read: false,
      timestamp: "1 day ago",
      icon: <ArticleIcon color="warning" />
    },
    { 
      id: 3, 
      message: "New book added: JavaScript Essentials",
      read: true,
      timestamp: "3 days ago",
      icon: <BookIcon color="info" />
    },
  ]);

  const [anchorEl, setAnchorEl] = useState({
    catalog: null,
    profile: null,
    notifications: null,
    user: null,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const userData = localStorage.getItem("userData");
  const userInfo = JSON.parse(userData) || {};

  const firstName = userInfo.firstName || "";
  const lastName = userInfo.lastName || "";
  const email = userInfo.emailId || "";
  const userId = userInfo.id || "";
  const roleName = userInfo.roleName || "Guest";
  const avatarChar = firstName?.charAt(0).toUpperCase() || "N/A";

  const unreadNotifications = notifications.filter(n => !n.read).length;

  useEffect(() => {
    dispatch(currentUserPoints({ email, userId }));
  }, [dispatch, email, userId]);

  const handleRefreshPoints = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    try {
      await dispatch(currentUserPoints({ email, userId })).unwrap();
      toast.success("Points refreshed successfully");
    } catch (error) {
      toast.error("Failed to refresh points");
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await apiClient.post(`/auth/logout`);
      localStorage.clear();
      toast.success(response.data.message);
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  const handleMenuOpen = (menu, event) => {
    setAnchorEl(prev => ({ ...prev, [menu]: event.currentTarget }));
  };

  const handleMenuClose = (menu) => {
    setAnchorEl(prev => ({ ...prev, [menu]: null }));
  };

  const handleNotificationClick = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    handleMenuClose('notifications');
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <GradientAppBar position="sticky">
      <Toolbar sx={{ justifyContent: "space-between", px: 2 }}>
        {/* Left Section - Brand and Mobile Menu */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={onMenuToggle}
            sx={{ display: { xs: "flex", md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box 
            component={Link} 
            to="/dashboard" 
            sx={{ display: "flex", alignItems: "center", textDecoration: "none" }}
          >
            <img 
              src={BrandLogo} 
              alt="brand-logo" 
              style={{ height: 40, marginRight: 8 }} 
            />
          </Box>
        </Box>

        {/* Middle Section - Navigation Links (Desktop) */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
          {/* Catalog Menu */}
          <Button
            color="inherit"
            endIcon={anchorEl.catalog ? <ExpandLess /> : <ExpandMore />}
            onClick={(e) => handleMenuOpen('catalog', e)}
            sx={{
              fontWeight: 500,
              textTransform: 'capitalize',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Catalog
          </Button>
          
          <Menu
            anchorEl={anchorEl.catalog}
            open={Boolean(anchorEl.catalog)}
            onClose={() => handleMenuClose('catalog')}
            MenuListProps={{ sx: { py: 0 } }}
            PaperProps={{
              elevation: 3,
              sx: {
                mt: 1.5,
                minWidth: 200,
                overflow: 'visible',
                background: 'linear-gradient(135deg, #424242 0%, #303030 100%)',
                color: 'common.white',
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: '#424242',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem 
              component={Link} 
              to="/books"
              onClick={() => handleMenuClose('catalog')}
              sx={{ py: 1.5, '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
            >
              <ListItemIcon>
                <BookIcon fontSize="small" sx={{ color: 'common.white' }} />
              </ListItemIcon>
              <ListItemText>Books</ListItemText>
            </MenuItem>
            
            <MenuItem 
              component={Link} 
              to="/borrowing_records"
              onClick={() => handleMenuClose('catalog')}
              sx={{ py: 1.5, '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
            >
              <ListItemIcon>
                <ArticleIcon fontSize="small" sx={{ color: 'common.white' }} />
              </ListItemIcon>
              <ListItemText>Borrow Records</ListItemText>
            </MenuItem>
            
            <MenuItem 
              component={Link} 
              to="/penalties"
              onClick={() => handleMenuClose('catalog')}
              sx={{ py: 1.5, '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
            >
              <ListItemIcon>
                <CurrencyExchange fontSize="small" sx={{ color: 'common.white' }} />
              </ListItemIcon>
              <ListItemText>Penalties</ListItemText>
            </MenuItem>
          </Menu>

          <Divider orientation="vertical" flexItem sx={{ mx: 1, bgcolor: 'rgba(255, 255, 255, 0.2)' }} />

          {/* Profile Menu */}
          <Button
            color="inherit"
            endIcon={anchorEl.profile ? <ExpandLess /> : <ExpandMore />}
            onClick={(e) => handleMenuOpen('profile', e)}
            sx={{
              fontWeight: 500,
              textTransform: 'capitalize',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Management
          </Button>
          
          <Menu
            anchorEl={anchorEl.profile}
            open={Boolean(anchorEl.profile)}
            onClose={() => handleMenuClose('profile')}
            MenuListProps={{ sx: { py: 0 } }}
            PaperProps={{
              elevation: 3,
              sx: {
                mt: 1.5,
                minWidth: 200,
                overflow: 'visible',
                background: 'linear-gradient(135deg, #424242 0%, #303030 100%)',
                color: 'common.white',
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: '#424242',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem 
              component={Link} 
              to="/users"
              onClick={() => handleMenuClose('profile')}
              sx={{ py: 1.5, '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
            >
              <ListItemIcon>
                <GroupIcon fontSize="small" sx={{ color: 'common.white' }} />
              </ListItemIcon>
              <ListItemText>Users</ListItemText>
            </MenuItem>
            
            <MenuItem 
              component={Link} 
              to="/roles"
              onClick={() => handleMenuClose('profile')}
              sx={{ py: 1.5, '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
            >
              <ListItemIcon>
                <SettingsIcon fontSize="small" sx={{ color: 'common.white' }} />
              </ListItemIcon>
              <ListItemText>Roles</ListItemText>
            </MenuItem>
            
            <MenuItem 
              component={Link} 
              to="/authors"
              onClick={() => handleMenuClose('profile')}
              sx={{ py: 1.5, '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
            >
              <ListItemIcon>
                <PersonIcon fontSize="small" sx={{ color: 'common.white' }} />
              </ListItemIcon>
              <ListItemText>Authors</ListItemText>
            </MenuItem>
          </Menu>

          <Divider orientation="vertical" flexItem sx={{ mx: 1, bgcolor: 'rgba(255, 255, 255, 0.2)' }} />

          {/* Simple Link */}
          <Button
            color="inherit"
            component={Link}
            to="/about"
            sx={{
              fontWeight: 500,
              textTransform: 'capitalize',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            About
          </Button>
        </Box>

        {/* Right Section - User Controls */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Points Display */}
          <Chip
            icon={
              isRefreshing ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <RefreshIcon 
                  fontSize="small" 
                  onClick={handleRefreshPoints}
                  sx={{ cursor: "pointer" }}
                />
              )
            }
            label={`${points === null ? 0 : points} Points`}
            sx={{
              backgroundColor: amber[600],
              color: "common.white",
              fontWeight: 600,
              "& .MuiChip-icon": {
                ml: 0.5,
                mr: -0.5,
              },
            }}
          />
          
          <Popover
            open={Boolean(anchorEl.notifications)}
            anchorEl={anchorEl.notifications}
            onClose={() => handleMenuClose('notifications')}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{
              sx: {
                width: 350,
                maxHeight: 400,
                mt: 1.5,
                overflow: "hidden",
                background: 'linear-gradient(135deg, #424242 0%, #303030 100%)',
                color: 'common.white',
              },
            }}
          >
            <Box sx={{ p: 1.5, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Notifications
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  cursor: "pointer",
                  color: amber[300],
                  "&:hover": { textDecoration: "underline" }
                }}
                onClick={markAllAsRead}
              >
                Mark all as read
              </Typography>
            </Box>
            
            <List sx={{ p: 0, overflow: "auto" }}>
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <ListItem 
                    key={notification.id} 
                    disablePadding
                    secondaryAction={
                      <Typography variant="caption" color="text.secondary">
                        {notification.timestamp}
                      </Typography>
                    }
                  >
                    <ListItemButton
                      onClick={() => handleNotificationClick(notification.id)}
                      sx={{
                        backgroundColor: notification.read ? 'inherit' : 'rgba(255, 255, 255, 0.05)',
                        py: 1.5,
                        px: 2,
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)'
                        }
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ 
                          bgcolor: "transparent", 
                          color: "inherit",
                          width: 32,
                          height: 32
                        }}>
                          {notification.icon}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={notification.message}
                        primaryTypographyProps={{
                          fontWeight: notification.read ? "normal" : "bold",
                          color: 'common.white'
                        }}
                        secondaryTypographyProps={{
                          color: 'text.secondary'
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText 
                    primary="No notifications" 
                    primaryTypographyProps={{ color: 'text.secondary' }}
                    sx={{ textAlign: "center", py: 2 }} 
                  />
                </ListItem>
              )}
            </List>
          </Popover>

          {/* User Menu */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              onClick={(e) => handleMenuOpen('user', e)}
              sx={{ p: 0 }}
            >
              <Avatar 
                sx={{ 
                  bgcolor: deepPurple[400],
                  width: 36,
                  height: 36,
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                {avatarChar}
              </Avatar>
            </IconButton>
            
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography variant="subtitle2" lineHeight={1} color="common.white">
                {firstName} {lastName}
              </Typography>
              <Typography variant="caption" color="rgba(255, 255, 255, 0.7)">
                {roleName}
              </Typography>
            </Box>
          </Box>
          
          <Menu
            anchorEl={anchorEl.user}
            open={Boolean(anchorEl.user)}
            onClose={() => handleMenuClose('user')}
            PaperProps={{
              elevation: 3,
              sx: {
                width: 240,
                mt: 1.5,
                overflow: "visible",
                background: 'linear-gradient(135deg, #424242 0%, #303030 100%)',
                color: 'common.white',
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "#424242",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography fontWeight="bold" color="common.white">{firstName} {lastName}</Typography>
              <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                {email}
              </Typography>
            </Box>
            
            <Divider sx={{ my: 0.5, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
            
            <MenuItem 
              component={Link} 
              to="/profile"
              onClick={() => handleMenuClose('user')}
              sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
            >
              <ListItemIcon>
                <AccountCircle fontSize="small" sx={{ color: 'common.white' }} />
              </ListItemIcon>
              <ListItemText>My Profile</ListItemText>
            </MenuItem>
            
            <Divider sx={{ my: 0.5, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
            
            <MenuItem 
              onClick={handleLogout}
              sx={{ '&:hover': { backgroundColor: 'rgba(255, 0, 0, 0.1)' } }}
            >
              <ListItemIcon>
                <LogoutIcon fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText primaryTypographyProps={{ color: "error" }}>
                Logout
              </ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </GradientAppBar>
  );
};

export default Navbar;