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
  Divider,
  Chip,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/system";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import PeopleIcon from "@mui/icons-material/People";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { motion } from "framer-motion";

// Enhanced Styled Components
const BackgroundContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(5),
}));

const GlassmorphicCard = styled(Card)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.85)",
  backdropFilter: "blur(12px)",
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(5),
  maxWidth: "1200px",
  width: "100%",
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: "100%",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    cursor: "pointer"
  },
}));

const IconContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  marginBottom: theme.spacing(2),
  "& svg": {
    fontSize: "3rem",
  },
}));

// Data for consistent content management
const features = [
  {
    icon: <LibraryBooksIcon />,
    title: "Centralized Book Database",
    description: "Comprehensive catalog with advanced search and filtering capabilities.",
  },
  {
    icon: <PeopleIcon />,
    title: "User Management",
    description: "Manage memberships, track borrowing history, and set privileges.",
  },
  {
    icon: <EventAvailableIcon />,
    title: "Automated Transactions",
    description: "Streamlined check-in/check-out with automatic notifications.",
  },
];

const systemFeatures = [
  {
    name: "Advanced Catalog System",
    description: "Track books with ISBN, authors, categories, and multiple copies. Includes digital resource management.",
    technologies: ["MERN Stack", "Elasticsearch", "JWT Auth"],
  },
  {
    name: "Member Portal",
    description: "Self-service portal for members to view loans, place holds, and renew items. Integrated with email/SMS notifications.",
    technologies: ["React", "Redux", "Node.js"],
  },
  {
    name: "Reporting Dashboard",
    description: "Real-time analytics on circulation, popular titles, and member activity with export capabilities.",
    technologies: ["Chart.js", "MongoDB Aggregation"],
  },
];

const stats = [
  { value: "10,000+", label: "Books Managed" },
  { value: "5,000+", label: "Active Users" },
  { value: "99.9%", label: "Uptime" },
  { value: "24/7", label: "Support" },
];

const About = () => {
  return (
    <BackgroundContainer>
      <GlassmorphicCard
        component={motion.div}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Container maxWidth="lg">
          {/* Header Section */}
          <Box textAlign="center" mb={4}>
            <Typography
              variant="h2"
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              sx={{
                fontWeight: 700,
                color: "primary.main",
                mb: 2,
              }}
            >
              LibraTech - A Library Management System
            </Typography>
            <Typography
              variant="h5"
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              sx={{
                fontStyle: "italic",
                color: "text.secondary",
                mb: 3,
              }}
            >
              "Transforming libraries with digital innovation"
            </Typography>
            
            {/* Stats Chip Display */}
            <Box display="flex" justifyContent="center" flexWrap="wrap" gap={2} mb={4}>
              {stats.map((stat, index) => (
                <Chip
                  size="medium"
                  key={index}
                  avatar={<Avatar>{stat.value}</Avatar>}
                  label={stat.label}
                  variant="outlined"
                  component={motion.div}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                />
              ))}
            </Box>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Introduction */}
          <Box mb={6}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              About Our System
            </Typography>
            <Typography variant="body1" paragraph>
              Our <strong>Library Management System</strong> is a comprehensive digital platform designed to 
              revolutionize how libraries operate in the modern age. Built with cutting-edge technology, 
              it provides librarians and patrons with powerful tools to manage, discover, and interact 
              with library resources.
            </Typography>
            <Typography variant="body1" paragraph>
              The system has been adopted by academic institutions, public libraries, and corporate 
              knowledge centers worldwide, helping them transition from traditional card catalogs to 
              fully digital, cloud-based solutions.
            </Typography>
          </Box>

          {/* Key Features Grid */}
          <Box mb={6}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Key Features
            </Typography>
            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <FeatureCard
                    component={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <CardContent sx={{ textAlign: "center", height: "100%" }}>
                      <IconContainer>{feature.icon}</IconContainer>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </FeatureCard>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* System Features Accordion */}
          <Box mb={4}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              System Modules
            </Typography>
            {systemFeatures.map((feature, index) => (
              <Accordion
                key={index}
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.15 }}
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  overflow: "hidden",
                  "&:before": { display: "none" },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ backgroundColor: "rgba(25, 118, 210, 0.08)" }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {feature.name}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" paragraph>
                    {feature.description}
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1} mt={2}>
                    {feature.technologies.map((tech, techIndex) => (
                      <Chip
                        key={techIndex}
                        label={tech}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>

          {/* Closing Section */}
          <Box mt={6} mb={6} textAlign="center">
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Ready to transform your library?
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Contact us today to schedule a demo or learn more about our implementation process.
            </Typography>
          </Box>
        </Container>
      </GlassmorphicCard>
    </BackgroundContainer>
  );
};

export default About;