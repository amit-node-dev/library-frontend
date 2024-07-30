import React from "react";
import { Typography, Box } from "@mui/material";
import { styled } from "@mui/system";

const FooterContainer = styled(Box)({
  backgroundColor: "#333",
  color: "#fff",
  padding: "1rem 0",
  textAlign: "center",
  position: "absolute",
  width: "100%",
  bottom: 0,
});

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <FooterContainer>
      <Typography variant="body2">
        &copy; {currentYear} All rights reserved.
      </Typography>
    </FooterContainer>
  );
};

export default Footer;
