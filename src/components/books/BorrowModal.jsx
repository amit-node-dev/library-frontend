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
  Stack,
  Chip,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/system";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import EventIcon from "@mui/icons-material/Event";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import InfoIcon from "@mui/icons-material/Info";

// Styled components
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

const DateRangeContainer = styled(Box)(({ theme }) => ({
  marginTop: "24px",
  "& .MuiTextField-root": {
    bbackgroundColor: "#f5f5f5",
    borderRadius: "8px",
  },
}));

const DaysCounter = styled(Chip)(({ theme }) => ({
  marginTop: "16px",
  padding: "8px",
  backgroundColor: "#1976d2",
  color: "#ffffff",
  fontWeight: "bold",
  "& .MuiChip-icon": {
    color: "#ffffff",
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  padding: "12px 24px",
  borderRadius: "8px",
  fontWeight: "bold",
  textTransform: "none",
  letterSpacing: 0.5,
  marginTop: "24px",
}));

const BorrowBookModal = ({ type, open, onClose, onSubmit, book }) => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [totalDays, setTotalDays] = useState(0);
  const [error, setError] = useState("");

  const handleDateChange = (newValue) => {
    setDateRange(newValue);
    setError("");
    const [startDate, endDate] = newValue;

    if (startDate && endDate) {
      const days = dayjs(endDate).diff(dayjs(startDate), "day");
      setTotalDays(days);

      // Validate date range
      if (days < 1) {
        setError("Due date must be after borrow date");
      } else if (days > 30) {
        setError("Maximum borrowing period is 30 days");
      }
    } else {
      setTotalDays(0);
    }
  };

  const handleSubmit = () => {
    const [startDate, endDate] = dateRange;

    if (!startDate || !endDate) {
      setError("Please select both dates");
      return;
    }

    if (error) return;

    if (type === "borrow-modal") {
      const formattedStartDate = dayjs(startDate).format("YYYY-MM-DD");
      const formattedEndDate = dayjs(endDate).format("YYYY-MM-DD");

      onSubmit({
        borrowDate: formattedStartDate,
        dueDate: formattedEndDate,
        status: "borrowed",
      });
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalContainer>
        <ModalHeader>
          <Typography variant="h5" fontWeight="bold">
            Borrow Book
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

        <DateRangeContainer>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateRangePicker
              startText={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <EventIcon fontSize="small" />
                  <span>Borrow Date</span>
                </Stack>
              }
              endText={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <EventAvailableIcon fontSize="small" />
                  <span>Due Date</span>
                </Stack>
              }
              value={dateRange}
              minDate={dayjs()}
              maxDate={dayjs().add(30, "day")}
              onChange={handleDateChange}
              renderInput={(startProps, endProps) => (
                <Stack spacing={3}>
                  <TextField
                    {...startProps}
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                  <TextField
                    {...endProps}
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                </Stack>
              )}
            />
          </LocalizationProvider>

          {totalDays > 0 && (
            <DaysCounter
              icon={<InfoIcon />}
              label={`Total Borrowing Days: ${totalDays}`}
            />
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <Alert severity="info" sx={{ mt: 2 }}>
            Maximum borrowing period is 30 days
          </Alert>
        </DateRangeContainer>

        <Box display="flex" justifyContent="flex-end">
          <ActionButton
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={!!error || totalDays === 0}
            startIcon={<ArrowCircleDownIcon />}
          >
            Confirm Borrow
          </ActionButton>
        </Box>
      </ModalContainer>
    </Modal>
  );
};

export default BorrowBookModal;
