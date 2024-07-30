import React from "react";
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
} from "@mui/material";
import { styled, keyframes } from "@mui/system";
import BackgroundImage from "../../images/background1.jpg";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Keyframes for animations
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideIn = keyframes`
  from {
    transform: translateY(-100px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const zoomIn = keyframes`
  from {
    transform: scale(0.5);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;

const bounceIn = keyframes`
  from, 20%, 40%, 60%, 80%, to {
    transform: translateY(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateY(-10px);
  }
`;

// Container with background image
const BackgroundContainer = styled(Box)({
  backgroundImage: `url(${BackgroundImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  height: "90vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  animation: `${fadeIn} 2s ease-in-out`,
});

const AboutContainer = styled(Container)({
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  borderRadius: "8px",
  padding: "3rem",
  maxWidth: "800px",
  animation: `${zoomIn} 1.5s ease-in-out`,
});

const AboutHeader = styled(Typography)({
  marginBottom: "1rem",
  fontWeight: "bold",
  color: "#333",
  textAlign: "center",
  animation: `${slideIn} 1.5s ease-in-out`,
});

const DescriptionText = styled(Typography)({
  marginBottom: "1rem",
  textAlign: "justify",
  lineHeight: "1.6",
  color: "#555",
  animation: `${fadeIn} 3s ease-in-out`,
});

// Styled accordion components
const StyledAccordion = styled(Accordion)({
  marginBottom: "1rem",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  animation: `${bounceIn} 2s ease-in-out`,
});

const StyledAccordionSummary = styled(AccordionSummary)({
  backgroundColor: "#f5f5f5",
  borderRadius: "4px",
});

const StyledAccordionDetails = styled(AccordionDetails)({
  backgroundColor: "#ffffff",
});

const projects = [
  { name: "Project One", description: "Description for project one." },
  { name: "Project Two", description: "Description for project two." },
  { name: "Project Three", description: "Description for project three." },
];

const About = () => {
  return (
    <BackgroundContainer>
      <AboutContainer>
        <AboutHeader variant="h4">About Us</AboutHeader>
        <hr />
        <DescriptionText variant="h6" gutterBottom>
          Hello! I'm Amit V, a passionate MERN Stack developer.
        </DescriptionText>
        <DescriptionText variant="body1" gutterBottom>
          A library management system is software designed to manage all the
          functions of a library. It helps librarians maintain the database of
          new books and the books borrowed by members along with their due
          dates. This system completely automates all your library’s activities.
          The best way to maintain, organize, and handle countless books
          systematically is to implement a library management system software. A
          library management system is used to maintain library records. It
          tracks the records of the number of books in the library, how many
          books are issued, or how many books have been returned or renewed or
          late fine charges, etc. You can find books in an instant,
          issue/reissue books quickly, and manage all the data efficiently and
          orderly using this system. The purpose of a library management system
          is to provide instant and accurate data regarding any type of book,
          thereby saving a lot of time and effort.
        </DescriptionText>
        <Box sx={{ marginTop: "20px" }}>
          {projects.map((project, index) => (
            <StyledAccordion key={index}>
              <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{project.name}</Typography>
              </StyledAccordionSummary>
              <StyledAccordionDetails>
                <Typography variant="body2">{project.description}</Typography>
              </StyledAccordionDetails>
            </StyledAccordion>
          ))}
        </Box>
      </AboutContainer>
    </BackgroundContainer>
  );
};

export default About;
