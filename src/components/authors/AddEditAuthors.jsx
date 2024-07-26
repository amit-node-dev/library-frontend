import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  addNewAuthors,
  getAuthorsById,
  updateAuthors,
} from "../../features/author_module/authorActions";
import "./authors.css";

const AddEditAuthors = () => {
  const { authorId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentAuthor } = useSelector((state) => state.authors);

  const [authorData, setAuthorData] = useState({
    firstname: "",
    lastname: "",
    email: "",
  });

  const [firstnameError, setFirstnameError] = useState("");
  const [lastnameError, setLastnameError] = useState("");
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    if (authorId) {
      dispatch(getAuthorsById(authorId));
    }
  }, [dispatch, authorId]);

  useEffect(() => {
    if (authorId && currentAuthor) {
      setAuthorData({
        firstname: currentAuthor.firstname,
        lastname: currentAuthor.lastname,
        email: currentAuthor.email,
      });
    }
  }, [currentAuthor, authorId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAuthorData({
      ...authorData,
      [name]: value,
    });
  };

  const handleFirstNameBlur = () => {
    setFirstnameError(
      authorData.firstname === "" ? "Firstname is required" : ""
    );
  };

  const handleLastNameBlur = () => {
    setLastnameError(authorData.lastname === "" ? "Lastname is required" : "");
  };

  const handleEmailBlur = () => {
    setEmailError(authorData.email === "" ? "Email Id is required" : "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    handleFirstNameBlur();
    handleLastNameBlur();
    handleEmailBlur();

    if (authorData.firstname && authorData.lastname && authorData.email) {
      if (authorId) {
        await dispatch(updateAuthors({ authorId, authorData })).unwrap();
      } else {
        await dispatch(addNewAuthors(authorData)).unwrap();
      }
      navigate("/authors");
    }
  };

  const handleReset = () => {
    setAuthorData({
      firstname: "",
      lastname: "",
      email: "",
    });
    setFirstnameError("");
    setLastnameError("");
    setEmailError("");
  };

  const handleBack = () => {
    navigate("/authors");
  };

  return (
    <div className="add-edit-author-container">
      <button className="back-button" onClick={handleBack}>
        &larr; Back
      </button>
      <h2>{authorId ? "Edit Author" : "Add Author"}</h2>
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Firstname <span className="mandatory">*</span>
          </label>
          <input
            type="text"
            name="firstname"
            value={authorData.firstname}
            onChange={handleChange}
            onBlur={handleFirstNameBlur}
            className="form-control"
          />
          {firstnameError && (
            <div className="error-message">{firstnameError}</div>
          )}
        </div>
        <div className="form-group">
          <label>
            Lastname <span className="mandatory">*</span>
          </label>
          <input
            type="text"
            name="lastname"
            value={authorData.lastname}
            onChange={handleChange}
            onBlur={handleLastNameBlur}
            className="form-control"
          />
          {lastnameError && (
            <div className="error-message">{lastnameError}</div>
          )}
        </div>
        <div className="form-group">
          <label>
            Email ID <span className="mandatory">*</span>
          </label>
          <input
            type="text"
            name="email"
            value={authorData.email}
            onChange={handleChange}
            onBlur={handleEmailBlur}
            className="form-control"
          />
          {emailError && <div className="error-message">{emailError}</div>}
        </div>
        <div className="button-container">
          <button type="submit" className="add-edit-button">
            {authorId ? "Update" : "Add"}
          </button>
          <button type="reset" className="reset-button" onClick={handleReset}>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditAuthors;
