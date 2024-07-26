import React from "react";
import { useNavigate } from "react-router-dom";
import BooksTable from "./BooksTable";
import "./books.css";

const MainPage = () => {
  const navigate = useNavigate();

  const handleAddBook = () => {
    navigate("/books/add_books");
  };

  return (
    <div className="main-page-container">
      <button onClick={handleAddBook} className="add-button">
        Add Book
      </button>
      <BooksTable />
    </div>
  );
};

export default MainPage;
