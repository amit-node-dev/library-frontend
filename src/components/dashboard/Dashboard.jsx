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
  { 
    image: pic2, 
    text: "Check out the latest updates",
    textPosition: "center" 
  },
  { 
    image: pic3, 
    text: "Discover new features",
    textPosition: "right" 
  },
  { 
    image: pic4, 
    text: "Stay informed",
    textPosition: "center" 
  },
  {
    image: pic5,
    text: "RBAC is an approach to restricting system access to authorized users, and to implementing mandatory access control or discretionary access control.",
  },
];

// ANIMATIONS
const zoomIn = keyframes`
  from { transform: scale(1.1); }
  to { transform: scale(1); }
`;

const slideInFromLeft = keyframes`
  from { opacity: 0; transform: translateX(-50px); }
  to { opacity: 1; transform: translateX(0); }
`;

const slideInFromRight = keyframes`
  from { opacity: 0; transform: translateX(50px); }
  to { opacity: 1; transform: translateX(0); }
`;

const slideInFromBottom = keyframes`
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
`;

const StyledCarouselItem = styled("div")({
  position: "relative",
  height: "calc(100vh - 70px)",
  minHeight: "600px",
  maxHeight: "900px",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#1a1a1a",
});

const ImageWrapper = styled("div")({
  position: "absolute",
  width: "100%",
  height: "100%",
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    animation: `${zoomIn} 20s ease-in-out infinite alternate`,
  },
});

const GradientOverlay = styled("div")({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)",
});

const TextOverlay = styled("div")(({ textposition }) => ({
  position: "absolute",
  color: "#ffffff",
  padding: "32px",
  maxWidth: "800px",
  textAlign: textposition === "center" ? "center" : textposition === "right" ? "right" : "left",
  left: textposition === "left" || textposition === "center" ? "50%" : "auto",
  right: textposition === "right" ? "10%" : "auto",
  bottom: "15%",
  transform: textposition === "center" ? "translateX(-50%)" : "none",
  animation: `
    ${textposition === "right" ? slideInFromRight : 
      textposition === "center" ? slideInFromBottom : slideInFromLeft} 
    1s ease-out forwards`,
  "& p": {
    fontSize: "1.5rem",
    fontWeight: 400,
    lineHeight: 1.6,
    textShadow: "0 2px 4px rgba(0,0,0,0.5)",
    marginBottom: "16px",
    "@media (max-width: 960px)": {
      fontSize: "1.2rem",
    },
  },
}));

const Dashboard = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [images, setImages] = useState(slides.map((slide) => slide.image));

  const handleImageError = (index) => {
    setImages((prevImages) => {
      const newImages = [...prevImages];
      newImages[index] = placeholderImage;
      return newImages;
    });
  };

  const handleChange = (index) => {
    setActiveIndex(index);
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Carousel
        animation="fade"
        interval={6000}
        duration={1000}
        autoPlay={true}
        indicators={false}
        navButtonsAlwaysVisible={true}
        onChange={handleChange}
        navButtonsProps={{
          style: {
            backgroundColor: "rgba(255,255,255,0.3)",
            color: "#ffffff",
            borderRadius: 0,
            height: "100px",
            marginTop: "-50px",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.5)",
            },
          },
        }}
        fullHeightHover={false}
      >
        {slides.map((slide, index) => (
          <StyledCarouselItem key={index}>
            <ImageWrapper>
              <img
                src={images[index]}
                alt={`slide-${index}`}
                onError={() => handleImageError(index)}
              />
            </ImageWrapper>
            <GradientOverlay />
            <TextOverlay textposition={slide.textPosition || "left"}>
              <p>{slide.text}</p>
            </TextOverlay>
          </StyledCarouselItem>
        ))}
      </Carousel>
    </Box>
  );
};

export default Dashboard;