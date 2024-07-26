import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// CUSTOM COMPONENTS
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
import Dashboard from "./components/dashboard/Dashboard";
import MainPage from "./components/books/MainPage";
import AddEditBooks from "./components/books/AddEditBooks";
import PrivateRoute from "./PrivateRoutes";
import Layout from "./components/LayoutPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
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
        <Route
          path="/books"
          element={
            <PrivateRoute>
              <Layout>
                <MainPage />
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
      </Routes>
    </Router>
  );
}

export default App;
