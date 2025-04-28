import React from "react";
import { 
  Typography, 
  Box, 
  IconButton, 
  Link,
  Stack,
  Tooltip,
  styled 
} from "@mui/material";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  LinkedIn,
  Email,
  GitHub,
  Help,
  PrivacyTip,
  ContactMail
} from "@mui/icons-material";

const GradientFooter = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: { xs: "column", sm: "row" },
  alignItems: "center",
  justifyContent: "space-between",
  background: `linear-gradient(135deg, ${theme.palette.grey[900]} 0%, ${theme.palette.grey[500]} 100%)`,
  color: theme.palette.common.white,
  padding: theme.spacing(2),
  position: "fixed",
  width: "100%",
  bottom: 0,
  left: 0,
  zIndex: theme.zIndex.drawer - 1,
  boxShadow: "0 -4px 12px rgba(0,0,0,0.3)",
  borderTop: `1px solid ${theme.palette.grey[700]}`,
  gap: theme.spacing(2),
}));

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <GradientFooter>
      {/* Left Section - Copyright */}
      <Box sx={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        flexDirection: "row",
        width: "100%",
      }}>
        <Typography variant="body2" sx={{ 
          color: "rgba(255,255,255,0.8)",
          fontSize: { xs: "0.75rem", sm: "0.85rem" }
        }}>
          &copy; {currentYear} Library Management System. All rights reserved.
        </Typography>
      </Box>
    </GradientFooter>
  );
};

export default Footer;