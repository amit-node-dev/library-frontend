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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/system";
import dayjs from "dayjs";

// ACTIONS & STORES
import { getBorrowRecordById } from "../../features/borrowRecord_module/borrorRecordAction";

// Styled components for modal
const ReturnModalContainer = styled(Paper)(() => ({
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
      <ReturnModalContainer>
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
            Are you sure you want to return this book?
          </Typography>
        </Box>

        {isFine && (
          <>
            <Box>
              <Typography variant="body2" sx={{ marginBottom: "20px" }}>
                <Checkbox
                  {...label}
                  color="secondary"
                  onChange={(e) => setIsCheck(e.target.checked)}
                />
                Fine Amount: 30% of the books points will be fined.
              </Typography>
            </Box>
          </>
        )}

        <Box mt={4} display="flex" justifyContent="space-between">
          <Button variant="contained" color="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Yes
          </Button>
        </Box>
      </ReturnModalContainer>
    </Modal>
  );
};

export default ReturnModal;
