import React from "react";

// CUSTOM COMPONENTS
import RoleTable from "./RoleTable";
import "./roles.css";

const MainPage = () => {
  return (
    <div className="role-main-page-container">
      <div className="role-table-wrapper">
        <RoleTable />
      </div>
    </div>
  );
};

export default MainPage;
