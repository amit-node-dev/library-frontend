import React from "react";
import BooksTable from "./BooksTable";
import "./books.css";

const MainPage = () => {
  return (
    <div className="book-main-page-container">
      <div className="book-table-wrapper">
        <BooksTable />
      </div>
    </div>
  );
};

export default MainPage;
