import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getAllAuthorsList,
  deleteAuthors,
} from "../../features/author_module/authorActions";
import "./authors.css";

const AuthorsTable = () => {
  const { authors, loading, error } = useSelector((state) => state.authors);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAuthors, setFilteredAuthors] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  useEffect(() => {
    const fetchAuthorsList = async () => {
      try {
        await dispatch(getAllAuthorsList()).unwrap();
      } catch (error) {
        console.log("ERROR IN GET ALL AUTHORS LIST ::: ", error);
      }
    };

    fetchAuthorsList();
  }, [dispatch]);

  useEffect(() => {
    let filtered = authors;
    if (searchQuery) {
      filtered = authors.filter((author) =>
        `${author.firstname} ${author.lastname} ${author.email}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }
    if (sortConfig.key) {
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
    setFilteredAuthors(filtered);
  }, [searchQuery, authors, sortConfig]);

  const handleEdit = (authorId) => {
    navigate(`/authors/${authorId}`);
  };

  const handleDelete = async (authorId) => {
    try {
      await dispatch(deleteAuthors(authorId)).unwrap();
      await dispatch(getAllAuthorsList()).unwrap();
    } catch (error) {
      console.log("ERROR IN DELETE AUTHORS ::: ", error);
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
    <div className="authors-container">
      <div className="header">
        <h2 className="table-title">Authors List</h2>
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
                  style={{ width: "20%" }}
                  onClick={() => requestSort("index")}
                >
                  Sr No.
                  <span className={getClassNamesFor("index")} />
                </th>
                <th
                  scope="col"
                  style={{ width: "20%" }}
                  onClick={() => requestSort("firstname")}
                >
                  Firstname
                  <span className={getClassNamesFor("firstname")} />
                </th>
                <th
                  scope="col"
                  style={{ width: "20%" }}
                  onClick={() => requestSort("lastname")}
                >
                  Lastname
                  <span className={getClassNamesFor("lastname")} />
                </th>
                <th
                  scope="col"
                  style={{ width: "20%" }}
                  onClick={() => requestSort("email")}
                >
                  Email-Id
                  <span className={getClassNamesFor("email")} />
                </th>
                <th scope="col" style={{ width: "20%" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAuthors?.length > 0 ? (
                filteredAuthors.map((author, index) => (
                  <tr key={author._id}>
                    <th scope="row">{index + 1}</th>
                    <td>{author.firstname}</td>
                    <td>{author.lastname}</td>
                    <td>{author.email}</td>
                    <td>
                      <button
                        className="btn edit-button"
                        onClick={() => handleEdit(author.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn delete-button"
                        onClick={() => handleDelete(author.id)}
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

export default AuthorsTable;
