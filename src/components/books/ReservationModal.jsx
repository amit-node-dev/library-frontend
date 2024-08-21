import React from "react";

// THIRD PARTY IMPORTS
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// MUI CONTENT
import {
  Modal,
  Paper,
  Typography,
  Box,
  IconButton,
  Divider,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/system";
import dayjs from "dayjs";

// Styled components for modal
const ReservationModalContainer = styled(Paper)(() => ({
  padding: "20px",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "20%",
  backgroundColor: "#eeeeee",
  borderRadius: "14px",
  boxShadow: "2px 3px 20px 1px",
  p: 2,
  height: "auto",
  maxHeight: "80vh",
  overflowY: "auto",
}));

const ReservationModal = ({ type, open, onClose, onConfirm, book }) => {
  const handleReservation = () => {
    if (book.available_copies > 0) {
      toast.info("The book is available, no need to reserve it.");
      onConfirm({
        reservationDate: dayjs(new Date()).format("YYYY-MM-DD"),
        status: "waiting",
      });
      onClose();
    } else {
      toast.error("The book is currently borrowed. Reserving it now.");
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ReservationModalContainer>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Typography variant="h6">
            #{book.id} {book.bookname}
          </Typography>
          <IconButton onClick={onClose} size="normal">
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />

        <Box mt={2}>
          <Typography variant="body2" sx={{ marginBottom: "20px" }}>
            {book.available_copies <= 0
              ? "This book is currently borrowed. Would you like to reserve it?"
              : "This book is available. No need to reserve it."}
          </Typography>
        </Box>

        <Box mt={4} display="flex" justifyContent="space-between">
          <Button variant="contained" color="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleReservation}
          >
            Yes
          </Button>
        </Box>
      </ReservationModalContainer>
    </Modal>
  );
};

export default ReservationModal;
