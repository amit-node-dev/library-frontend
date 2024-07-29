// src/components/BookDetailsModal.js

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

const BookDetailsModal = ({ open, onClose, book }) => {
  if (!book) return null;

  // Custom date formatting function
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
      <Paper
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 600 },
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 3,
          height: 600,
          outline: "none",
          overflowY: "auto",
        }}
      >
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
        <Box>
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
        </Box>
      </Paper>
    </Modal>
  );
};

export default BookDetailsModal;
