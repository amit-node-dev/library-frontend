import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

// MUI IMPORTS
import {
  Typography,
  Box,
  IconButton,
  Divider,
  Button,
  Stack,
  Chip,
  Dialog,
  Fade,
  Paper,
  Grid,
  Tooltip,
  LinearProgress,
  Badge,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/system";

import {
  Bookmark,
  BookOnline,
  ImportContacts,
  AutoStories,
  LocalLibrary,
} from "@mui/icons-material";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";

// ACTIONS & STORES
import {
  addNewBorrowRecord,
  getBorrowBookRecordStatus,
  returnBorrowRecord,
} from "../../features/borrowRecord_module/borrorRecordAction";
import { getAllBooksList } from "../../features/book_module/bookActions";

// CUSTOM MODAL
import BorrowModal from "./BorrowModal";
import ReturnModal from "./ReturnModal";

// Styled components
const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    padding: 0,
    width: "90%",
    maxWidth: "1200px",
    maxHeight: "90vh",
    borderRadius: theme.shape.borderRadius,
    overflow: "hidden",
    // background: theme.palette.background.paper,
  },
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(3),
  // background: theme.palette.primary.main,
  // color: theme.palette.primary.contrastText,
}));

const BookInfoSection = styled(Box)(({ theme }) => ({
  display: "flex",
  padding: theme.spacing(3),
  gap: theme.spacing(4),
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
  },
}));

const ContentSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  // background: theme.palette.background.default,
}));

const MetaDataGrid = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(2),
  "& .MuiGrid-item": {
    padding: theme.spacing(1),
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 3),
  borderRadius: theme.shape.borderRadius,
  fontWeight: "bold",
  textTransform: "none",
  letterSpacing: 0.5,
  // boxShadow: theme.shadows[2],
  "&:hover": {
    // boxShadow: theme.shadows[4],
  },
}));

const BookDetailsPage = ({ open, onClose, book }) => {
  const userData = localStorage.getItem("userData");
  const userInfo = JSON.parse(userData) || {};

  const dispatch = useDispatch();

  const [bookStatus, setBookStatus] = useState(null);
  const [recordId, setRecordId] = useState(null);
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setBookStatus(null);
    setRecordId(null);
    setLoading(true);
    handleCheckBorrowStatus().finally(() => setLoading(false));
  }, [book]);

  const handleCheckBorrowStatus = async () => {
    try {
      const borrowData = {
        userId: parseInt(userInfo.id),
        bookId: parseInt(book?.id),
      };
      const response = await dispatch(
        getBorrowBookRecordStatus(borrowData)
      ).unwrap();

      if (response.statusType === true) {
        const data = response.data;
        setBookStatus(data?.status);
        setRecordId(data?.recordId);
      }
    } catch (error) {
      console.log("ERROR IN CHECK BORROW BOOK STATUS ::: ", error);
    }
  };

  const openBorrowModal = () => {
    setModalType("borrow-modal");
    setIsBorrowModalOpen(true);
  };

  const closeBorrowModal = () => {
    setModalType("");
    setIsBorrowModalOpen(false);
  };

  const handleBorrowBookRecord = async (borrowRecordData) => {
    try {
      const borrowData = {
        userId: parseInt(userInfo.id),
        bookId: parseInt(book?.id),
        borrowDate: borrowRecordData.borrowDate,
        dueDate: borrowRecordData.dueDate,
        status: borrowRecordData.status,
      };
      const response = await dispatch(addNewBorrowRecord(borrowData)).unwrap();
      if (response.statusType === true) {
        setBookStatus(response.data.status);
        handleCheckBorrowStatus();
        dispatch(getAllBooksList({ page: 1, pageSize: 10 }));
        closeBorrowModal();
      }
    } catch (error) {
      console.log("ERROR IN BORROW BOOK RECORD ::: ", error);
    }
  };

  const openReturnModal = () => {
    setModalType("return-modal");
    setIsReturnModalOpen(true);
  };

  const closeReturnModal = () => {
    setModalType("");
    setIsReturnModalOpen(false);
  };

  const handleReturnBorrowBook = async (returnRecordData) => {
    try {
      const returnData = {
        userId: parseInt(userInfo.id),
        bookId: parseInt(book?.id),
        recordId: recordId,
        returnDate: returnRecordData.returnDate,
        status: returnRecordData.status,
      };
      const response = await dispatch(returnBorrowRecord(returnData)).unwrap();
      if (response.statusType === true) {
        setBookStatus(response.data.record.status);
        handleCheckBorrowStatus();
        dispatch(getAllBooksList({ page: 1, pageSize: 5 }));
        closeReturnModal();
      }
    } catch (error) {
      console.log("ERROR IN RETURN BOOK RECORD ::: ", error);
    }
  };

  const renderActionButton = () => {
    if (loading) {
      return <LinearProgress sx={{ width: "100%" }} />;
    }

    if (bookStatus) {
      switch (bookStatus) {
        case "borrowed":
          return (
            <Tooltip title="Return this book">
              <ActionButton
                color="primary"
                variant="contained"
                onClick={openReturnModal}
                startIcon={<ArrowCircleUpIcon />}
                size="large"
              >
                Return Book
              </ActionButton>
            </Tooltip>
          );
        case "returned":
          return (
            <Tooltip title="Borrow this book again">
              <ActionButton
                color="success"
                variant="contained"
                onClick={openBorrowModal}
                startIcon={<ArrowCircleDownIcon />}
                size="large"
              >
                Borrow Again
              </ActionButton>
            </Tooltip>
          );
        default:
          return null;
      }
    } else if (book.availableCopies > 0) {
      return (
        <Tooltip title="Borrow this book">
          <ActionButton
            color="success"
            variant="contained"
            onClick={openBorrowModal}
            startIcon={<ArrowCircleDownIcon />}
            size="large"
          >
            Borrow Book
          </ActionButton>
        </Tooltip>
      );
    } else {
      return (
        <Tooltip title="This book is currently unavailable">
          <ActionButton
            color="error"
            variant="contained"
            disabled
            startIcon={<Bookmark />}
            size="large"
          >
            Out Of Stock
          </ActionButton>
        </Tooltip>
      );
    }
  };

  if (!book) return null;

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      TransitionComponent={Fade}
      transitionDuration={300}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {loading && <LinearProgress color="secondary" />}

            <HeaderSection>
              <Typography variant="h4" component="h1">
                <BookOnline sx={{ verticalAlign: "middle", mr: 1 }} />
                Book Details
              </Typography>
              <IconButton onClick={onClose} size="large" color="inherit">
                <CloseIcon fontSize="medium" />
              </IconButton>
            </HeaderSection>

            <BookInfoSection>
              <Box flex={2}>
                <Stack spacing={2}>
                  <Box>
                    <Typography
                      variant="h4"
                      component="h2"
                      fontWeight="bold"
                      gutterBottom
                    >
                      {book.bookName}
                    </Typography>
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                      sx={{ fontStyle: "inherit" }}
                    >
                      By {book.author?.firstName + " " + book.author?.lastName}
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={2} alignItems="center">
                    <Badge
                      badgeContent={book.availableCopies}
                      color={book.availableCopies > 0 ? "success" : "error"}
                      max={99}
                    >
                      <Chip
                        icon={<LocalLibrary />}
                        label={
                          book.availableCopies > 0
                            ? "Available"
                            : "Out of stock"
                        }
                        color={book.availableCopies > 0 ? "success" : "error"}
                        variant="outlined"
                        size="medium"
                      />
                    </Badge>

                    <Chip
                      icon={<ImportContacts />}
                      label={book.category?.name || "Uncategorized"}
                      color="primary"
                      variant="outlined"
                      size="medium"
                    />

                    <Chip
                      icon={<AutoStories />}
                      label={`ISBN: ${book.isbn}`}
                      variant="outlined"
                      size="medium"
                    />
                  </Stack>

                  <Box sx={{ mt: 2 }}>
                    <Typography
                      variant="body1"
                      paragraph
                      sx={{ lineHeight: 1.8 }}
                    >
                      {book.title}
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 3 }}>{renderActionButton()}</Box>
                </Stack>
              </Box>
            </BookInfoSection>

            <Divider sx={{ mx: 3 }} />

            <ContentSection>
              <Typography
                variant="h5"
                gutterBottom
                fontWeight="bold"
                sx={{ mb: 3 }}
              >
                About This Book
              </Typography>

              {bookStatus === "borrowed" ? (
                <>
                  <Typography
                    variant="body1"
                    paragraph
                    sx={{ lineHeight: 1.8, fontSize: "1.1rem" }}
                  >
                    {book.description}
                  </Typography>
                  <Typography
                    variant="h6"
                    gutterBottom
                    fontWeight="bold"
                    sx={{ mt: 4 }}
                  >
                    Conclusion
                  </Typography>
                  <Typography
                    variant="body1"
                    paragraph
                    sx={{ lineHeight: 1.8, fontSize: "1.1rem" }}
                  >
                    {book.conclusion}
                  </Typography>
                </>
              ) : (
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    backgroundColor: "background.paper",
                    borderRadius: 2,
                    borderLeft: "4px solid",
                    borderColor: "secondary.main",
                    backgroundImage:
                      "linear-gradient(to right, rgba(0,0,0,0.02), rgba(0,0,0,0.05))",
                  }}
                >
                  <Typography variant="body1" color="text.secondary" paragraph>
                    To read the full story, please borrow this book. If you're
                    interested, consider purchasing it for a more in-depth
                    experience.
                  </Typography>
                </Paper>
              )}
            </ContentSection>

            <ContentSection>
              <MetaDataGrid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper elevation={0} sx={{ p: 2, height: "100%" }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Published Year
                    </Typography>
                    <Typography variant="h6" fontWeight="medium">
                      {book.publicationYear}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Paper elevation={0} sx={{ p: 2, height: "100%" }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Publisher
                    </Typography>
                    <Typography variant="h6" fontWeight="medium">
                      {book.publisher || "Unknown"}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Paper elevation={0} sx={{ p: 2, height: "100%" }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Location
                    </Typography>
                    <Typography variant="h6" fontWeight="medium">
                      {book.location || "Not specified"}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Paper elevation={0} sx={{ p: 2, height: "100%" }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Current Status
                    </Typography>
                    <Typography variant="h6" fontWeight="medium">
                      {bookStatus === "borrowed"
                        ? "Currently Borrowed"
                        : book.availableCopies > 0
                        ? "Available"
                        : "Out of Stock"}
                    </Typography>
                  </Paper>
                </Grid>
              </MetaDataGrid>
            </ContentSection>

            {/* Borrow Confirmation Modal */}
            <BorrowModal
              type={modalType}
              open={isBorrowModalOpen}
              onClose={closeBorrowModal}
              onSubmit={handleBorrowBookRecord}
              book={book}
            />

            {/* Render the Return Modal */}
            <ReturnModal
              type={modalType}
              open={isReturnModalOpen}
              onClose={closeReturnModal}
              onSubmit={handleReturnBorrowBook}
              book={book}
              recordId={recordId}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </StyledDialog>
  );
};

export default BookDetailsPage;
