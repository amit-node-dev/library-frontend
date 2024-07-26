import React from "react";
import { useNavigate } from "react-router-dom";
import AuthorsTable from "./AuthorsTable";
import "./authors.css";

const MainPage = () => {
  const navigate = useNavigate();

  const handleAddAuthors = () => {
    navigate("/authors/add_authors");
  };

  return (
    <div className="main-page-container">
      <button onClick={handleAddAuthors} className="add-button">
        Add Authors
      </button>
      <AuthorsTable />
    </div>
  );
};

export default MainPage;
