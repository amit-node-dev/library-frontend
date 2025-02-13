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

import { Blind } from "@mui/icons-material";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";

// CSS
import "./books.css";

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
  const userId = localStorage.getItem("userId");
  const dispatch = useDispatch();

  const [bookStatus, setBookStatus] = useState(null);
  const [recordId, setRecordId] = useState(null);

  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");

  useEffect(() => {
    if (open) {
      setBookStatus(null);
      setRecordId(null);

      handleCheckBorrowStatus();
    }
  }, [open, book]);

  // CHECK THE STATUS OF BOOK (BORROW, RETURN, OUT OF STOCK)
  const handleCheckBorrowStatus = async () => {
    try {
      const borrowData = {
        userId: parseInt(userId),
        bookId: book.id,
      };
      const response = await dispatch(
        getBorrowBookRecordStatus(borrowData)
      ).unwrap();

      if (response.statusType === true) {
        const data = response.data;
        setBookStatus(data.status);
        setRecordId(data.recordId);
      } else {
        console.warn("Unexpected status type:", response.statusType);
      }
    } catch (error) {
      console.log("ERROR IN CHECK BORROW BOOK STATUS ::: ", error);
    }
  };

  // OPEN BORROW MODEL
  const openBorrowModal = () => {
    setModalType("borrow-modal");
    setIsBorrowModalOpen(true);
  };

  // CLOSE BORROW MODEL
  const closeBorrowModal = () => {
    setModalType("");
    setIsBorrowModalOpen(false);
  };

  // FUNCTION TO BORROW A BOOKS
  const handleBorrowBookRecord = async (borrowRecordData) => {
    try {
      const borrowData = {
        userId: userId,
        bookId: book.id,
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

  // OPEN RETURN MODEL
  const openReturnModal = () => {
    setModalType("return-modal");
    setIsReturnModalOpen(true);
  };

  // CLOSE RETURN MODEL
  const closeReturnModal = () => {
    setModalType("");
    setIsReturnModalOpen(false);
  };

  // FUNCTION TO RETURN THE BORROW BOOKS
  const handleReturnBorrowBook = async (returnRecordData) => {
    try {
      const returnData = {
        recordId: recordId,
        userId: userId,
        bookId: book.id,
        returnDate: returnRecordData.returnDate,
        status: returnRecordData.status,
      };
      const response = await dispatch(returnBorrowRecord(returnData)).unwrap();
      console.log("RESPONSE ::: ", response);
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
    if (bookStatus) {
      switch (bookStatus) {
        case "borrowed":
          return (
            <Button
              color="primary"
              variant="outlined"
              onClick={openReturnModal}
            >
              <ArrowCircleUpIcon />
              &nbsp;<Typography>Return</Typography>
            </Button>
          );
        case "returned":
          return (
            <Button
              color="success"
              variant="outlined"
              onClick={openBorrowModal}
            >
              <ArrowCircleDownIcon />
              &nbsp;<Typography>Borrow</Typography>
            </Button>
          );
        default:
          return null;
      }
    } else if (book.available_copies > 0) {
      return (
        <Button color="success" variant="outlined" onClick={openBorrowModal}>
          <ArrowCircleDownIcon />
          &nbsp;<Typography>Borrow</Typography>
        </Button>
      );
    } else {
      return (
        <Button color="error" variant="outlined">
          <Blind />
          &nbsp;<Typography>Out Of Stock</Typography>
        </Button>
      );
    }
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
            {renderActionButton()}
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
              {bookStatus === "borrowed" ? (
                <Typography
                  className="book-description"
                  variant="body2"
                  sx={{ mb: 2, lineHeight: "25px" }}
                >
                  {book.description}
                </Typography>
              ) : (
                <Typography
                  className="book-professional-message"
                  variant="body2"
                  sx={{ mb: 2, lineHeight: "25px", color: "grey" }}
                >
                  To read the full story, please borrow this book. If you're
                  interested, consider purchasing it for a more in-depth
                  experience.
                </Typography>
              )}
            </div>

            {bookStatus === "borrowed" && (
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
            )}

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
    </>
  );
};

export default BookDetailsModal;
