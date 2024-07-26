import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getAllBooksList,
  deleteBooks,
} from "../../features/book_module/bookActions";
import "./books.css";

const BooksTable = () => {
  const { books, loading, error } = useSelector((state) => state.books);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  useEffect(() => {
    const fetchBookList = async () => {
      try {
        await dispatch(getAllBooksList()).unwrap();
      } catch (error) {
        console.log("ERROR IN GET ALL BOOKS LIST ::: ", error);
      }
    };

    fetchBookList();
  }, [dispatch]);

  useEffect(() => {
    let filtered = books;
    if (searchQuery) {
      filtered = books.filter((book) =>
        `${book.bookname} ${book.description} ${book.authorId}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }
    if (sortConfig.key) {
      console.log("FILTERED ", filtered);
      console.log("KEY ", sortConfig.kry);

      filtered?.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    setFilteredBooks(filtered);
  }, [searchQuery, books, sortConfig]);

  const handleEdit = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  const handleDelete = async (bookId) => {
    try {
      await dispatch(deleteBooks(bookId)).unwrap();
      await dispatch(getAllBooksList()).unwrap();
    } catch (error) {
      console.log("ERROR IN DELETE USER ::: ", error);
    }
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getClassNamesFor = (name) => {
    if (!sortConfig) return;
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  return (
    <div className="books-container">
      <div className="header">
        <h2 className="table-title">Book List</h2>
        <input
          type="text"
          className="search-input"
          placeholder="Search books..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th
                  scope="col"
                  style={{ width: "10%" }}
                  onClick={() => requestSort("index")}
                >
                  Sr No.
                  <span className={getClassNamesFor("index")} />
                </th>
                <th
                  scope="col"
                  style={{ width: "15%" }}
                  onClick={() => requestSort("bookname")}
                >
                  Book Name
                  <span className={getClassNamesFor("bookname")} />
                </th>
                <th scope="col" style={{ width: "55%" }}>
                  Description
                </th>
                <th
                  scope="col"
                  style={{ width: "10%" }}
                  onClick={() => requestSort("authorId")}
                >
                  Author
                  <span className={getClassNamesFor("authorId")} />
                </th>
                <th scope="col" style={{ width: "10%" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks?.length > 0 ? (
                filteredBooks.map((book, index) => (
                  <tr key={book._id}>
                    <th scope="row">{index + 1}</th>
                    <td>{book.bookname}</td>
                    <td>{book.description}</td>
                    <td>{book.authorId}</td>
                    <td>
                      <button
                        className="btn edit-button"
                        onClick={() => handleEdit(book.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn delete-button"
                        onClick={() => handleDelete(book.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No Data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BooksTable;
