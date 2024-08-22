import React from "react";
import ReservationRecordTable from "./ReservationRecordTable";
import "./reservations.css";

const MainPage = () => {
  return (
    <div className="reservation-main-page-container">
      <div className="reservation-table-wrapper">
        <ReservationRecordTable />
      </div>
    </div>
  );
};

export default MainPage;
