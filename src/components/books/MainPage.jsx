import React from "react";
import BooksTable from "./BooksTable";
import { styled } from "@mui/material/styles";

// Styled components
const BookMainPageContainer = styled("div")(({ theme }) => ({
  position: "relative",
  padding: theme.spacing(10), 
  textAlign: "center",
  backgroundColor: "darkgray",
  minHeight: "90vh",
  boxSizing: "border-box",
}));

const BookTableWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(1.25), 
  boxShadow: theme.shadows[4],
  borderRadius: 8,
  backgroundColor: theme.palette.background.paper,
  width: "100%",
  margin: "0 auto",
  animation: "slideIn 0.5s ease-out",
}));

const MainPage = () => {
  return (
    <BookMainPageContainer>
      <BookTableWrapper>
        <BooksTable />
      </BookTableWrapper>
    </BookMainPageContainer>
  );
};

export default MainPage;
