import React, { useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";

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
  Dialog as MuiDialog,
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
const StyledDialog = styled(Dialog)({
  "& .MuiDialog-paper": {
    padding: 0,
    width: "90%",
    maxWidth: "1200px",
    maxHeight: "90vh",
    overflow: "hidden",
    background: "#fff",
  },
});

const HeaderSection = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "5px",
  background: "linear-gradient(135deg, #212121 10%, #757575 100%)",
  color: "#fff",
});

const BookInfoSection = styled(Box)(({ theme }) => ({
  display: "flex",
  padding: theme.spacing(3),
  gap: theme.spacing(4),
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
  },
}));

const ContentSection = styled(Box)({
  padding: "24px",
  background: "#f5f5f5",
});

const FooterSection = styled(Box)({
  padding: "10px",
});

const MetaDataGrid = styled(Grid)(({ theme }) => ({
  marginTop: theme.spacing(2),
  "& .MuiGrid-item": {
    padding: theme.spacing(1),
  },
}));

const ActionButton = styled(Button)({
  padding: "12px 24px",
  borderRadius: "8px",
  fontWeight: "bold",
  textTransform: "none",
  letterSpacing: 0.5,
  boxShadow: "0px 1px 3px rgba(0,0,0,0.2)",
  "&:hover": {
    boxShadow: "0px 4px 8px rgba(0,0,0,0.3)",
  },
});

// Helper function to split text into word-based pages
const splitTextByWords = (text, wordsPerPage) => {
  if (!text) return [""];
  const words = text.split(/\s+/);
  const pages = [];
  for (let i = 0; i < words.length; i += wordsPerPage) {
    pages.push(words.slice(i, i + wordsPerPage).join(" "));
  }
  return pages.length ? pages : [""];
};

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
  const [isReadMoreOpen, setIsReadMoreOpen] = useState(false);
  const [page, setPage] = useState(1);

  // Split content into pages (200 words per page for modal)
  const WORDS_PER_MODAL_PAGE = 200;
  const WORDS_PREVIEW = 70;
  const fullText = useMemo(() => {
    let text = book.description || "";
    if (bookStatus === "borrowed" && book.conclusion) {
      text += "\n\nConclusion:\n" + book.conclusion;
    }
    return text;
  }, [book.description, book.conclusion, bookStatus]);

  // For modal: split by 200 words
  const pages = useMemo(() => splitTextByWords(fullText, WORDS_PER_MODAL_PAGE), [fullText]);

  // For preview: first 70 words
  const previewWords = useMemo(() => {
    if (!book.description) return "";
    const words = book.description.split(/\s+/);
    return words.slice(0, WORDS_PREVIEW).join(" ");
  }, [book.description]);
  const hasMorePreview = useMemo(() => {
    if (!book.description) return false;
    return book.description.split(/\s+/).length > WORDS_PREVIEW;
  }, [book.description]);

  const handleNextPage = () => setPage((p) => Math.min(pages.length, p + 1));
  const handlePrevPage = () => setPage((p) => Math.max(1, p - 1));
  const handleOpenReadMore = () => { setIsReadMoreOpen(true); setPage(1); };
  const handleCloseReadMore = () => setIsReadMoreOpen(false);

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

            <Divider sx={{ mx: 1, my: 1 }} />

            <PerfectScrollbar style={{ maxHeight: 350, minHeight: 200 }}>
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
                      {previewWords}
                      {hasMorePreview ? "..." : ""}
                    </Typography>
                    {hasMorePreview && (
                      <Button size="small" onClick={handleOpenReadMore} sx={{ mb: 2 }}>
                        Read More
                      </Button>
                    )}
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
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      paragraph
                    >
                      To read the full story, please borrow this book. If you're
                      interested, consider purchasing it for a more in-depth
                      experience.
                    </Typography>
                  </Paper>
                )}
              </ContentSection>
            </PerfectScrollbar>

            <FooterSection>
              <MetaDataGrid container spacing={1}>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper elevation={0} sx={{ p: 1, height: "50%" }}>
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
            </FooterSection>

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

            {/* Read More Modal */}
            <MuiDialog open={isReadMoreOpen} onClose={handleCloseReadMore} maxWidth="xl" fullWidth>
              <Box
                sx={{
                  p: 0,
                  background: 'linear-gradient(135deg, #f5f7fa 0%,rgb(214, 211, 211) 100%)',
                  borderRadius: 3,
                  boxShadow: 6,
                  minHeight: 650,
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  height: '80vh', 
                }}
              >
                <Box
                  sx={{
                    px: 3,
                    py: 2,
                    borderBottom: '1px solid #e0e0e0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: "linear-gradient(135deg, #212121 10%, #757575 100%)",
                    color: '#fff',
                  }}
                >
                  <Typography variant="h5" fontWeight="bold">
                    Book Content
                  </Typography>
                  <Button onClick={handleCloseReadMore} color="inherit" variant="outlined" sx={{ borderColor: '#fff' }}>
                    Close
                  </Button>
                </Box>
                <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                  <PerfectScrollbar style={{ flex: 1, minHeight: 0, maxHeight: '100%' }}>
                    <Box sx={{ px: 4, py: 3 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          lineHeight: 1.8,
                          fontSize: '1.15rem',
                          whiteSpace: 'pre-line',
                          color: '#222',
                          minHeight: 300,
                        }}
                      >
                        {pages[page - 1]}
                      </Typography>
                    </Box>
                  </PerfectScrollbar>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 3,
                    py: 1,
                    borderTop: '1px solid #e0e0e0',
                    background: '#f5f7fa',
                    borderBottomLeftRadius: 12,
                    borderBottomRightRadius: 12,
                  }}
                >
                  <Button
                    onClick={handlePrevPage}
                    disabled={page === 1}
                    variant="contained"
                    color="primary"
                    sx={{ minWidth: 120, borderRadius: 2 }}
                  >
                    Previous
                  </Button>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    Page {page} of {pages.length}
                  </Typography>
                  <Button
                    onClick={handleNextPage}
                    disabled={page === pages.length}
                    variant="contained"
                    color="primary"
                    sx={{ minWidth: 120, borderRadius: 2 }}
                  >
                    Next
                  </Button>
                </Box>
              </Box>
            </MuiDialog>
          </motion.div>
        )}
      </AnimatePresence>
    </StyledDialog>
  );
};

export default BookDetailsPage;
