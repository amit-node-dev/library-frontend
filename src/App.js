import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// CUSTOM COMPONENTS
import Layout from "./components/LayoutPage";
import PrivateRoute from "./PrivateRoutes";
import RegisterPage from "./components/auth/RegisterPage";
import LoginPage from "./components/auth/LoginPage";
import Dashboard from "./components/dashboard/Dashboard";
import MainPage from "./components/books/MainPage";
import AddEditBooks from "./components/books/AddEditBooks";
import AuthorMainPage from "./components/authors/MainPage";
import AddEditAuthors from "./components/authors/AddEditAuthors";
import About from "./components/about/About";

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
    </Router>
  );
}

export default App;
