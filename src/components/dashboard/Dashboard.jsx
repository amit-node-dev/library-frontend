import React from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/system";
import Carousel from "react-material-ui-carousel";

// IMAGES
import pic1 from "../../images/pic1.jpg";
import pic2 from "../../images/pic2.jpg";
import pic3 from "../../images/pic3.jpg";
import pic4 from "../../images/pic4.jpg";
import pic5 from "../../images/pic5.jpg";

const slides = [
  {
    image: pic1,
    text: "Purpose of a library management system is to manage & track the daily work of the library such as issuing books, return books, due calculations, etc",
  },
  { image: pic2, text: "Check out the latest updates" },
  { image: pic3, text: "Discover new features" },
  { image: pic4, text: "Stay informed" },
  {
    image: pic5,
    text: "RBAC is an approach to restricting system access to authorized users, and to implementing mandatory access control or discretionary access control.",
  },
];

const StyledCarouselItem = styled("div")(() => ({
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "835px",
  backgroundColor: "#dedede",
  overflow: "hidden",
  "& img": {
    width: "100%",
    height: "auto",
    animation: "fadeIn 2s ease-in-out",
  },
  "@keyframes fadeIn": {
    "0%": { opacity: 0 },
    "100%": { opacity: 1 },
  },
  "@keyframes fadeSlideIn": {
    "0%": { opacity: 0, transform: "translateX(-100%)" },
    "100%": { opacity: 1, transform: "translateX(0)" },
  },
}));

const TextOverlay = styled("div")(() => ({
  position: "absolute",
  bottom: "20px",
  left: "20px",
  color: "#fff",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  padding: "10px 20px",
  borderRadius: "5px",
  fontSize: "1.2rem",
  animation: "textFadeIn 2s ease-in-out",
  "@keyframes textFadeIn": {
    "0%": { opacity: 0, transform: "translateY(20px)" },
    "100%": { opacity: 1, transform: "translateY(0)" },
  },
}));

const Dashboard = () => {
  return (
    <Box sx={{ textAlign: "center" }}>
      <Carousel
        animation="slide"
        interval={3000}
        autoPlay={true}
        indicators={false}
        navButtonsAlwaysVisible={true}
        navButtonsProps={{
          style: {
            backgroundColor: "cornflowerblue",
            color: "white",
          },
        }}
      >
        {slides.map((slide, index) => (
          <StyledCarouselItem key={index}>
            <img
              src={slide.image}
              alt={`slide-${index}`}
              onLoad={(e) => (e.target.style.opacity = 1)}
            />
            <TextOverlay>{slide.text}</TextOverlay>
          </StyledCarouselItem>
        ))}
      </Carousel>
    </Box>
  );
};

export default Dashboard;
