import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

// CUSTOM COMPONENTS
import Layout from "./components/LayoutPage";
import PrivateRoute from "./PrivateRoutes";

// AUTH
import RegisterPage from "./components/auth/RegisterPage";
import LoginPage from "./components/auth/LoginPage";
import MobileOTPBased from "./components/auth/MobileOTPBased";

// DASHBOARD
import Dashboard from "./components/dashboard/Dashboard";

// BOOKS
import BookMainPage from "./components/books/MainPage";
import AddEditBooks from "./components/books/AddEditBooks";

// BORROW RECORDS
import BorrowRecordMainPage from "./components/borrowrecords/MainPage";

// RESERVATION RECORDS
import ReservationMainPage from "./components/reservationrecords/MainPage";

// AUTHORS
import AuthorMainPage from "./components/authors/MainPage";
import AddEditAuthors from "./components/authors/AddEditAuthors";

// USERS
import UserMainPage from "./components/users/MainPage";
import AddEditUsers from "./components/users/AddEditUsers";

// ROLES
import RoleMainPage from "./components/roles/MainPage";
import AddEditRole from "./components/roles/AddEditRole";

// ABOUT
import About from "./components/about/About";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/mobile_otp_based" element={<MobileOTPBased />} />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          }
        />

        {/* BOOKS */}
        <Route
          path="/books"
          element={
            <PrivateRoute>
              <Layout>
                <BookMainPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/books/add_books"
          element={
            <PrivateRoute>
              <Layout>
                <AddEditBooks />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/books/:bookId"
          element={
            <PrivateRoute>
              <Layout>
                <AddEditBooks />
              </Layout>
            </PrivateRoute>
          }
        />

        {/* BORROW RECORDS */}
        <Route
          path="/borrowing_records"
          element={
            <PrivateRoute>
              <Layout>
                <BorrowRecordMainPage />
              </Layout>
            </PrivateRoute>
          }
        />

        {/* RESERVATION RECORDS */}
        <Route
          path="/reservations"
          element={
            <PrivateRoute>
              <Layout>
                <ReservationMainPage />
              </Layout>
            </PrivateRoute>
          }
        />

        {/* USERS */}
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <Layout>
                <UserMainPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/users/add-user"
          element={
            <PrivateRoute>
              <Layout>
                <AddEditUsers />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/users/:userId"
          element={
            <PrivateRoute>
              <Layout>
                <AddEditUsers />
              </Layout>
            </PrivateRoute>
          }
        />

        {/* ROLES */}
        <Route
          path="/roles"
          element={
            <PrivateRoute>
              <Layout>
                <RoleMainPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/roles/add_roles"
          element={
            <PrivateRoute>
              <Layout>
                <AddEditRole />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/roles/:roleId"
          element={
            <PrivateRoute>
              <Layout>
                <AddEditRole />
              </Layout>
            </PrivateRoute>
          }
        />

        {/* AUTHORS */}
        <Route
          path="/authors"
          element={
            <PrivateRoute>
              <Layout>
                <AuthorMainPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/authors/add_authors"
          element={
            <PrivateRoute>
              <Layout>
                <AddEditAuthors />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/authors/:authorId"
          element={
            <PrivateRoute>
              <Layout>
                <AddEditAuthors />
              </Layout>
            </PrivateRoute>
          }
        />

        {/* ABOUT */}
        <Route
          path="/about"
          element={
            <PrivateRoute>
              <Layout>
                <About />
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
};

export default AppRoutes;
