import React from "react";
import UsersTable from "./UsersTable";
import "./users.css";

const MainPage = () => {
  return (
    <div className="user-main-page-container">
      <div className="user-table-wrapper">
        <UsersTable />
      </div>
    </div>
  );
};

export default MainPage;
