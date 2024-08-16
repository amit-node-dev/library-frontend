import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

// MUI IMPORTS
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
import { styled, keyframes } from "@mui/system";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";

// CSS
import "./books.css";

// ACTIONS & STORES
import {
  addNewBorroRecord,
  getBorrowBookRecordStatus,
} from "../../features/borrowRecord_module/borrorRecordAction";

// CUSTOM MODAL
import BorrowModal from "./BorrowModal";

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
  const [isReserved, setIsReserved] = useState(false);
  const [borrowModalOpen, setBorrowModalOpen] = useState(false);
  const [checkReturn, setCheckReturn] = useState(false);
  const [borrowStatus, setBorrowStatus] = useState(null);

  const dispatch = useDispatch();

  const userId = localStorage.getItem("userId");

  // OPEN BORROW MODEL
  const openBorrowModal = () => {
    setBorrowModalOpen(true);
  };

  // CLOSE BORROW MODEL
  const closeBorrowModal = () => {
    setBorrowModalOpen(false);
  };

  const handleBorrowBookRecord = async (borrowDates) => {
    try {
      const borrowData = {
        userId: userId,
        bookId: book.id,
        borrowDate: borrowDates.borrowDate,
        dueDate: borrowDates.dueDate,
      };
      const response = await dispatch(addNewBorroRecord(borrowData));
      if (response.payload.statusType === "SUCCESS") {
        handlecheckReturn();
      }
    } catch (error) {
      console.log("ERROR IN BORROW BOOK RECORD ::: ", error);
    }
  };

  const handlecheckReturn = async () => {
    try {
      const borrowData = {
        userId: userId,
        bookId: book.id,
      };
      const response = await dispatch(getBorrowBookRecordStatus(borrowData));

      const resultResponse = response.payload;
      if (resultResponse.message === "NOT FOUND") {
        setCheckReturn(false);
      } else {
        setBorrowStatus(resultResponse.data.status);
        setCheckReturn(true);
      }
    } catch (error) {
      console.log("ERROR IN CHECK BORROW BOOK STATUS ::: ", error);
    }
  };

  useEffect(() => {
    if (open) {
      setCheckReturn(false);
      handlecheckReturn();
    }
  }, [open]);

  const handleReturnBook = () => {};

  const handleReserveBook = () => {
    setIsReserved(!isReserved);
  };

  if (!book) return null;

  return (
    <>
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
            {checkReturn && borrowStatus === "borrowed" ? (
              <Button
                color="primary"
                variant="outlined"
                onClick={handleReturnBook}
              >
                <ArrowCircleUpIcon />
                &nbsp;<Typography>Return</Typography>
              </Button>
            ) : !checkReturn && book.available_copies > 0 ? (
              <Button
                color="success"
                variant="outlined"
                onClick={openBorrowModal}
              >
                <ArrowCircleDownIcon />
                <Typography>Borrow</Typography>
              </Button>
            ) : (
              <Button
                color="secondary"
                variant="outlined"
                onClick={handleReserveBook}
              >
                {isReserved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                <Typography sx={{ marginLeft: "5px" }}>
                  {isReserved ? "Reserved" : "Reserve"}
                </Typography>
              </Button>
            )}
            <Typography id="book-details-title" variant="h7" component="h3">
              ISBN: {book.isbn}
            </Typography>
            <IconButton onClick={onClose} size="normal">
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
              <div>
                <Typography variant="h7" sx={{ fontWeight: "700" }}>
                  {book.category.name}
                </Typography>
              </div>
              <div className="book-authorname-container">
                <Typography variant="caption">
                  <strong>Author:- </strong>
                </Typography>
                <Typography variant="caption" sx={{ marginLeft: "2px" }}>
                  {book.author?.firstname + " " + book.author?.lastname}
                </Typography>
              </div>
            </Box>

            <div className="book-title-container">
              <Typography variant="h6" sx={{ mb: 1 }}>
                <strong>Title:</strong>
              </Typography>
              <Typography
                className="book-title"
                variant="body2"
                sx={{ lineHeight: "25px" }}
              >
                {book.title}
              </Typography>
            </div>

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

            <div className="book-conclusion-container">
              <Typography variant="h6" sx={{ mb: 1 }}>
                <strong>Conclusion:</strong>
              </Typography>
              <Typography
                className="book-conclusion"
                variant="body2"
                sx={{ lineHeight: "25px" }}
              >
                {book.conclusion}
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
                  <strong>Published Year:</strong>
                </Typography>
                <Typography variant="body2">{book.publication_year}</Typography>
              </div>

              <div>
                <Typography variant="caption">
                  <strong>Location:</strong>
                </Typography>
                <Typography variant="body2">{book.location}</Typography>
              </div>

              <div>
                <Typography variant="caption">
                  <strong>Publisher:</strong>
                </Typography>
                <Typography variant="body2">{book.publisher}</Typography>
              </div>
            </Box>
          </ContentBox>
        </ModalContainer>
      </Modal>

      {/* Borrow Confirmation Modal */}
      <BorrowModal
        open={borrowModalOpen}
        onClose={closeBorrowModal}
        book={book}
        onSubmit={handleBorrowBookRecord}
      />
    </>
  );
};

export default BookDetailsModal;
