import React, { useState } from "react";
import {
  Modal,
  Paper,
  Typography,
  Box,
  IconButton,
  Divider,
  Button,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/system";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

// Styled components for modal
const BorrowModalContainer = styled(Paper)(() => ({
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

const BorrowBookModal = ({ open, onClose, onSubmit, book }) => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [totalDays, setTotalDays] = useState(0);

  const handleDateChange = (newValue) => {
    setDateRange(newValue);
    const [startDate, endDate] = newValue;
    if (startDate && endDate) {
      const days = dayjs(endDate).diff(dayjs(startDate), "day");
      setTotalDays(days);
    } else {
      setTotalDays(0);
    }
  };

  const handleSubmit = () => {
    const [startDate, endDate] = dateRange;
    if (startDate && endDate) {
      const formattedStartDate = dayjs(startDate).format("YYYY-MM-DD");
      const formattedEndDate = dayjs(endDate).format("YYYY-MM-DD");

      onSubmit({
        borrowDate: formattedStartDate,
        dueDate: formattedEndDate,
      });
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <BorrowModalContainer>
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

        <Box mt={1}>
          <Typography variant="body2" sx={{ marginBottom: "10px" }}>
            Set Due Date
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateRangePicker
              startText="Borrow Date"
              endText="Due Date"
              value={dateRange}
              onChange={handleDateChange}
              renderInput={(startProps, endProps) => (
                <>
                  <Box sx={{ mb: 2 }}>
                    <TextField {...startProps} fullWidth />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <TextField {...endProps} fullWidth />
                  </Box>
                </>
              )}
            />
          </LocalizationProvider>
          <Typography variant="body2" sx={{ marginTop: "10px" }}>
            Total Days: {totalDays}
          </Typography>
        </Box>

        <Box mt={4} display="flex" justifyContent="flex-end">
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            <ArrowCircleDownIcon />
            <Typography sx={{ marginLeft: "5px" }}>Borrow</Typography>
          </Button>
        </Box>
      </BorrowModalContainer>
    </Modal>
  );
};

export default BorrowBookModal;
