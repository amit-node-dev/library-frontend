import React, { useEffect, useState } from "react";

// THIRD PARTY IMPORTS
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";

// MUI CONTENT
import {
  Modal,
  Paper,
  Typography,
  Box,
  IconButton,
  Divider,
  Button,
  Checkbox,
  Alert,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/system";
import dayjs from "dayjs";

// ACTIONS & STORES
import { getBorrowRecordById } from "../../features/borrowRecord_module/borrorRecordAction";

// Styled components for modal
const ModalContainer = styled(Paper)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "500px",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
  padding: "32px",
  outline: "none",
  maxHeight: "90vh",
  overflowY: "auto",
}));

const ModalHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "16px",
}));

const ActionButton = styled(Button)(({ theme }) => ({
  padding: "12px 24px",
  borderRadius: "8px",
  fontWeight: "bold",
  textTransform: "none",
  letterSpacing: 0.5,
  marginTop: "24px",
}));

const ReturnModal = ({ type, open, onClose, onSubmit, book, recordId }) => {
  const dispatch = useDispatch();

  const { currentBorrowRecord } = useSelector((state) => state.borrowRecords);

  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const [isFine, setIsFine] = useState(false);
  const [isCheck, setIsCheck] = useState(false);

  useEffect(() => {
    if (type === "return-modal") {
      dispatch(getBorrowRecordById(recordId));
    }
  }, [dispatch, book, type, recordId]);

  const handleSubmit = () => {
    const dueDate = dayjs(currentBorrowRecord.due_date).format("YYYY-MM-DD");
    const returnDate = dayjs(new Date()).format("YYYY-MM-DD");

    if (returnDate > dueDate) {
      setIsFine(true);

      if (isCheck) {
        onSubmit({
          returnDate: returnDate,
          status: "returned",
        });
        onClose();
      } else {
        toast.warning("Fine! You have passed the due date. ");
      }
    } else {
      onSubmit({
        returnDate: returnDate,
        status: "returned",
      });
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalContainer>
        <ModalHeader>
          <Typography variant="h5" fontWeight="bold">
            Return Book
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </ModalHeader>
        <Divider />
        <Box mt={3}>
          <Typography variant="subtitle1" color="text.secondary">
            Book Details
          </Typography>
          <Typography variant="h6" fontWeight="medium">
            {book.bookName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ISBN: {book.isbn}
          </Typography>
        </Box>
        <Box mt={3}>
          <Typography variant="body2" sx={{ marginBottom: "20px" }}>
            Are you sure you want to return this book?
          </Typography>
        </Box>
        {isFine && (
          <Alert severity="warning" sx={{ mt: 2, mb: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Checkbox
                {...label}
                color="secondary"
                onChange={(e) => setIsCheck(e.target.checked)}
              />
              <Typography variant="body2">
                Fine Amount: 30% of the book's points will be fined.
              </Typography>
            </Stack>
          </Alert>
        )}
        <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
          <ActionButton variant="contained" color="secondary" onClick={onClose}>
            Cancel
          </ActionButton>
          <ActionButton variant="contained" color="primary" onClick={handleSubmit}>
            Confirm Return
          </ActionButton>
        </Box>
      </ModalContainer>
    </Modal>
  );
};

export default ReturnModal;
