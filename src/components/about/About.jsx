import React from "react";
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { styled } from "@mui/system";
import BackgroundImage from "../../images/background1.jpg";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { motion } from "framer-motion";

// Styled components for enhanced UI
const BackgroundContainer = styled(Box)({
  backgroundImage: `url(${BackgroundImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  minHeight: "90vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const GlassmorphicContainer = styled(Container)({
  background: "rgba(255, 255, 255, 0.2)",
  borderRadius: "15px",
  padding: "3rem",
  maxWidth: "900px",
  backdropFilter: "blur(10px)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
  color: "#1c1c1b",
  textAlign: "center",
});

const AboutHeader = styled(Typography)({
  fontWeight: "bold",
  color: "#1c1c1b",
  textAlign: "center",
  marginBottom: "1rem",
});

const DescriptionText = styled(Typography)({
  textAlign: "justify",
  lineHeight: "1.6",
  color: "#1c1c1b",
});

// Accordion Styling
const StyledAccordion = styled(Accordion)({
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
});

const projects = [
  {
    name: "Book Catalog Management",
    description: "Track books, authors, and availability.",
  },
  {
    name: "User & Membership Management",
    description: "Manage student, teacher, and public memberships.",
  },
  {
    name: "Issue & Return System",
    description: "Automate book lending with due dates and penalties.",
  },
];

const About = () => {
  return (
    <BackgroundContainer>
      <GlassmorphicContainer
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <>
          <AboutHeader
            variant="h3"
            component={motion.div}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            About Us
          </AboutHeader>
          <Typography
            variant="h6"
            sx={{ color: "#1c1c1b", fontStyle: "italic", marginBottom: "1rem" }}
          >
            "Empowering Libraries with Technology."
          </Typography>

          <hr />

          <DescriptionText
            component={motion.p}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
          >
            A <strong>Library Management System (LMS)</strong> is a digital
            solution designed to organize and manage library resources
            efficiently. It streamlines book tracking, user management, lending,
            and reporting for educational institutions, public libraries, and
            corporate archives.
          </DescriptionText>

          {/* LMS Benefits */}
          <Grid container spacing={3} sx={{ marginTop: "20px" }}>
            {[
              {
                title: "Centralized Book Database",
                description:
                  "Keep all records organized and easily accessible.",
              },
              {
                title: "Automated Transactions",
                description:
                  "Efficient book issuing, returns, and fine calculation.",
              },
              {
                title: "User-Friendly Access",
                description:
                  "Allow students and teachers to search books online.",
              },
            ].map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    textAlign: "center",
                    padding: "1rem",
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Projects & Features Accordion */}
          <Box sx={{ marginTop: "20px" }}>
            {projects.map((project, index) => (
              <StyledAccordion
                key={index}
                component={motion.div}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.3 }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">{project.name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2">{project.description}</Typography>
                </AccordionDetails>
              </StyledAccordion>
            ))}
          </Box>
        </>
      </GlassmorphicContainer>
    </BackgroundContainer>
  );
};

export default About;
