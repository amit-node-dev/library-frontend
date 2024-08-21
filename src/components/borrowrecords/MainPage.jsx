import React from "react";
import BorrowRecordsTable from "./BorrowRecordsTable";
import "./borrowrecords.css";

const MainPage = () => {
  return (
    <div className="borrow-main-page-container">
      <div className="borrow-table-wrapper">
        <BorrowRecordsTable />
      </div>
    </div>
  );
};

export default MainPage;
