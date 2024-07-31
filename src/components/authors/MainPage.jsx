import React from "react";
import AuthorsTable from "./AuthorsTable";
import "./authors.css";

const MainPage = () => {
  return (
    <div className="author-main-page-container">
      <div className="author-table-wrapper">
        <AuthorsTable />
      </div>
    </div>
  );
};

export default MainPage;
