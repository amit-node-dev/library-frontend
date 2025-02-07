import React from "react";
import "./penalties.css";
import PenaltiesTable from "./PenaltiesTable";

const MainPage = () => {
  return (
    <div className="penalties-main-page-container">
      <div className="penalties-table-wrapper">
        <PenaltiesTable />
      </div>
    </div>
  );
};

export default MainPage;
