import React from "react";
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
const ModalContainer = styled(Paper)(({ theme }) => ({
  padding: "20px",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 600 },
  backgroundColor: "#eeeeee",
  borderRadius: "14px",
  boxShadow: "2px 3px 20px 1px",
  p: 3,
  height: "auto",
  maxHeight: "80vh",
  overflowY: "auto",
  animation: `${fadeIn} 0.5s ease-in-out`,
}));

const ContentBox = styled(Box)(({ theme }) => ({
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
            Book Details
          </Typography>
          <IconButton onClick={onClose} size="large">
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <ContentBox>
          <Typography variant="h6" sx={{ mb: 1 }}>
            <strong>Book Name:</strong>
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {book.bookname}
          </Typography>

          <Typography variant="h6" sx={{ mb: 1 }}>
            <strong>Description:</strong>
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {book.description}
          </Typography>

          <Typography variant="h6" sx={{ mb: 1 }}>
            <strong>Author Id:</strong>
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {book.authorId}
          </Typography>

          <Typography variant="h6" sx={{ mb: 1 }}>
            <strong>Created At:</strong>
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {formatDate(book.createdAt)}
          </Typography>

          <Typography variant="h6" sx={{ mb: 1 }}>
            <strong>Updated At:</strong>
          </Typography>
          <Typography variant="body1">{formatDate(book.updatedAt)}</Typography>
        </ContentBox>
      </ModalContainer>
    </Modal>
  );
};

export default BookDetailsModal;
