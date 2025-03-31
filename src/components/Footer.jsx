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

const SocialIcon = styled(IconButton)(({ theme }) => ({
  color: theme.palette.grey[300],
  transition: "all 0.3s ease",
  "&:hover": {
    color: theme.palette.primary.main,
    transform: "translateY(-3px)",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  "& .MuiSvgIcon-root": {
    fontSize: "1.2rem",
  },
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.grey[400],
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  textDecoration: "none",
  transition: "all 0.3s ease",
  fontSize: "0.8rem",
  "&:hover": {
    color: theme.palette.primary.main,
    textDecoration: "underline",
  },
}));

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <Facebook />, label: "Facebook", url: "#" },
    { icon: <Twitter />, label: "Twitter", url: "#" },
    { icon: <Instagram />, label: "Instagram", url: "#" },
    { icon: <LinkedIn />, label: "LinkedIn", url: "#" },
    { icon: <GitHub />, label: "GitHub", url: "#" },
    { icon: <Email />, label: "Email", url: "mailto:contact@library.com" },
  ];

  const quickLinks = [
    { icon: <Help />, label: "Help", url: "/help" },
    { icon: <PrivacyTip />, label: "Privacy", url: "/privacy" },
    { icon: <ContactMail />, label: "Contact", url: "/contact" },
  ];

  return (
    <GradientFooter>
      {/* Left Section - Copyright */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography variant="body2" sx={{ 
          color: "rgba(255,255,255,0.8)",
          fontSize: { xs: "0.75rem", sm: "0.85rem" }
        }}>
          &copy; {currentYear} Library Management System. All rights reserved.
        </Typography>
      </Box>

      {/* Middle Section - Quick Links */}
      <Stack 
        direction="row" 
        spacing={2}
        sx={{ 
          display: { xs: "none", sm: "flex" },
          alignItems: "center",
        }}
      >
        {quickLinks.map((link) => (
          <Tooltip key={link.label} title={link.label} arrow>
            <FooterLink href={link.url}>
              {link.icon}
              <span>{link.label}</span>
            </FooterLink>
          </Tooltip>
        ))}
      </Stack>

      {/* Right Section - Social Links */}
      <Box sx={{ display: "flex", gap: 0.1 }}>
        {socialLinks.map((social) => (
          <Tooltip key={social.label} title={social.label} arrow>
            <SocialIcon 
              aria-label={social.label}
              href={social.url}
              component="a"
              target="_blank"
              rel="noopener noreferrer"
            >
              {social.icon}
            </SocialIcon>
          </Tooltip>
        ))}
      </Box>
    </GradientFooter>
  );
};

export default Footer;