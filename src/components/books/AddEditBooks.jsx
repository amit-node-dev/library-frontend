import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  addNewBooks,
  getBooksById,
  updateBooks,
} from "../../features/book_module/bookActions";
import "./books.css";

const AddEditBooks = () => {
  const { bookId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentBook } = useSelector((state) => state.books);

  const [bookData, setBookData] = useState({
    bookname: "",
    description: "",
    authorId: "",
  });

  const [booknameError, setBooknameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [authorIdError, setAuthorIdError] = useState("");

  useEffect(() => {
    if (bookId) {
      dispatch(getBooksById(bookId));
    }
  }, [dispatch, bookId]);

  useEffect(() => {
    if (bookId && currentBook) {
      setBookData({
        bookname: currentBook.bookname,
        description: currentBook.description,
        authorId: currentBook.authorId,
      });
    }
  }, [currentBook, bookId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData({
      ...bookData,
      [name]: value,
    });
  };

  const handleBookNameBlur = () => {
    setBooknameError(bookData.bookname === "" ? "Book name is required" : "");
  };

  const handleDescriptionBlur = () => {
    setDescriptionError(
      bookData.description === "" ? "Description is required" : ""
    );
  };

  const handleAuthorIdBlur = () => {
    setAuthorIdError(bookData.authorId === "" ? "Author Id is required" : "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    handleBookNameBlur();
    handleDescriptionBlur();
    handleAuthorIdBlur();

    if (bookData.bookname && bookData.description && bookData.authorId) {
      if (bookId) {
        await dispatch(updateBooks({ bookId, bookData })).unwrap();
      } else {
        await dispatch(addNewBooks(bookData)).unwrap();
      }
      navigate("/books");
    }
  };

  const handleReset = () => {
    setBookData({
      bookname: "",
      description: "",
      authorId: "",
    });
    setBooknameError("");
    setDescriptionError("");
    setAuthorIdError("");
  };

  const handleBack = () => {
    navigate("/books");
  };

  return (
    <div className="add-edit-book-container">
      <button className="back-button" onClick={handleBack}>
        &larr; Back
      </button>
      <h2>{bookId ? "Edit Book" : "Add New Book"}</h2>
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Book Name <span className="mandatory">*</span>
          </label>
          <input
            type="text"
            name="bookname"
            value={bookData.bookname}
            onChange={handleChange}
            onBlur={handleBookNameBlur}
            className="form-control"
          />
          {booknameError && (
            <div className="error-message">{booknameError}</div>
          )}
        </div>
        <div className="form-group">
          <label>
            Description <span className="mandatory">*</span>
          </label>
          <textarea
            name="description"
            value={bookData.description}
            onChange={handleChange}
            onBlur={handleDescriptionBlur}
            className="form-control"
          />
          {descriptionError && (
            <div className="error-message">{descriptionError}</div>
          )}
        </div>
        <div className="form-group">
          <label>
            Author ID <span className="mandatory">*</span>
          </label>
          <input
            type="text"
            name="authorId"
            value={bookData.authorId}
            onChange={handleChange}
            onBlur={handleAuthorIdBlur}
            className="form-control"
          />
          {authorIdError && (
            <div className="error-message">{authorIdError}</div>
          )}
        </div>
        <div className="button-container">
          <button type="submit" className="add-edit-button">
            {bookId ? "Update Book" : "Add Book"}
          </button>
          <button type="reset" className="reset-button" onClick={handleReset}>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditBooks;
