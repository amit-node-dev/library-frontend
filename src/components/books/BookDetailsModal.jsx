import React from "react";

// MUI IMPORTS
import {
  Modal,
  Paper,
  Typography,
  Box,
  IconButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { styled, keyframes } from "@mui/system";

// CSS
import "./books.css";

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
    transform: translateY(-30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

// Styled components for modal
const ModalContainer = styled(Paper)(() => ({
  padding: "20px",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  backgroundColor: "#eeeeee",
  borderRadius: "14px",
  boxShadow: "2px 3px 20px 1px",
  p: 2,
  height: "auto",
  maxHeight: "80vh",
  overflowY: "auto",
  animation: `${fadeIn} 0.5s ease-in-out`,
}));

const ContentBox = styled(Box)(() => ({
  animation: `${slideIn} 0.5s ease-in-out`,
}));

const BookDetailsModal = ({ open, onClose, book }) => {
  if (!book) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="book-details-title"
      aria-describedby="book-details-description"
    >
      <ModalContainer>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Typography id="book-details-title" variant="h5" component="h2">
            Book-Id #{book.id}
          </Typography>
          <IconButton onClick={onClose} size="large">
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <ContentBox>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              <Typography variant="h7" sx={{ fontWeight: "700" }}>
                {book.bookname}
              </Typography>
            </div>
            <div className="book-authorname-container">
              <Typography variant="caption">
                <strong>Author:- </strong>
              </Typography>
              <Typography variant="caption" sx={{ marginLeft: "2px" }}>
                {book.author.firstname + " " + book.author.lastname}
              </Typography>
            </div>
          </Box>

          <div className="book-story-container">
            <Typography variant="h6" sx={{ mb: 1 }}>
              <strong>Story:</strong>
            </Typography>
            <Typography
              className="book-description"
              variant="body2"
              sx={{ mb: 2, lineHeight: "25px" }}
            >
              {book.description}
            </Typography>
          </div>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: "20px",
            }}
          >
            <div>
              <Typography variant="caption">
                <strong>Published Date:</strong>
              </Typography>
              <Typography variant="body2">
                {formatDate(book.createdAt)}
              </Typography>
            </div>

            <div>
              <Typography variant="caption">
                <strong>Last Updated At:</strong>
              </Typography>
              <Typography variant="body2">
                {formatDate(book.updatedAt)}
              </Typography>
            </div>
          </Box>
        </ContentBox>
      </ModalContainer>
    </Modal>
  );
};

export default BookDetailsModal;
