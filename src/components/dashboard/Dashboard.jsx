import React, { useState } from "react";
import { Box } from "@mui/material";
import { styled, keyframes } from "@mui/system";
import Carousel from "react-material-ui-carousel";

// IMAGES
import pic1 from "../../images/pic1.jpg";
import pic2 from "../../images/pic2.jpg";
import pic3 from "../../images/pic3.jpg";
import pic4 from "../../images/pic4.jpg";
import pic5 from "../../images/pic5.jpg";

const placeholderImage =
  "https://via.placeholder.com/1200x800?text=Image+Not+Available";

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

// ANIMATIONS
const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

const slideInText = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

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
    animation: `${fadeIn} 1.5s ease-in-out`,
  },
}));

const TextOverlay = styled("div")(() => ({
  position: "absolute",
  bottom: "20px",
  left: "20px",
  color: "#fff",
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  padding: "12px 24px",
  borderRadius: "8px",
  fontSize: "1.3rem",
  fontWeight: "bold",
  animation: `${slideInText} 1.2s ease-in-out`,
}));

const Dashboard = () => {
  const [images, setImages] = useState(slides.map((slide) => slide.image));

  const handleImageError = (index) => {
    setImages((prevImages) => {
      const newImages = [...prevImages];
      newImages[index] = placeholderImage;
      return newImages;
    });
  };

  return (
    <Box sx={{ textAlign: "center" }}>
      <Carousel
        animation="slide"
        interval={5000}
        autoPlay={true}
        indicators={false}
        navButtonsAlwaysVisible={true}
        navButtonsProps={{
          style: {
            backgroundColor: "cornflowerblue",
            color: "white",
            borderRadius: "50%",
          },
        }}
      >
        {slides.map((slide, index) => (
          <StyledCarouselItem key={index}>
            <img
              src={images[index]}
              alt={`slide-${index}`}
              onError={() => handleImageError(index)}
            />
            <TextOverlay>{slide.text}</TextOverlay>
          </StyledCarouselItem>
        ))}
      </Carousel>
    </Box>
  );
};

export default Dashboard;
