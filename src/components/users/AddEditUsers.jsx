import React, { useState, useEffect } from "react";

// THIRD PARTY COMPONENTS
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Country, State, City } from "country-state-city";
import bcrypt from "bcryptjs";

// MUI IMPORTS
import {
  TextField,
  Button,
  Typography,
  Box,
  Container,
  InputAdornment,
  IconButton,
  MenuItem,
  Grid,
  Fab,
  Tooltip,
} from "@mui/material";

// ACTIONS & STORES
import {
  addUser,
  getUserById,
  updateUsers,
} from "../../features/user_module/userActions";
import { getAllRolesList } from "../../features/role_module/roleActions";
import { ArrowBack, Visibility, VisibilityOff } from "@mui/icons-material";

const AddEditUsers = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.users);

  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    oldpassword: "",
    password: "",
    confirmPassword: "",
    age: "",
    mobileNumber: "",
    country: "",
    state: "",
    city: "",
    role: "",
  });

  const [firstnameError, setFirstnameError] = useState("");
  const [lastnameError, setLastnameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [oldPasswordError, setOldPasswordError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [roleError, setRoleError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const countries = Country.getAllCountries();
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [roleList, setRoleList] = useState([]);

  useEffect(() => {
    dispatch(getAllRolesList({ page: 1, pageSize: 5 })).then((response) => {
      setRoleList(response.payload.roles);
    });
  }, [dispatch]);

  useEffect(() => {
    if (userId) {
      dispatch(getUserById(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (userId && currentUser) {
      setUserData({
        firstname: currentUser.firstname,
        lastname: currentUser.lastname,
        email: currentUser.email,
        age: currentUser.age,
        mobileNumber: currentUser.mobileNumber,
        oldpassword: "",
        password: "",
        confirmPassword: "",
        country: currentUser.country || "",
        state: currentUser.state || "",
        city: currentUser.city || "",
        role: currentUser.role_id || "",
      });
      if (currentUser.country) {
        setStates(State.getStatesOfCountry(currentUser.country));
      }
      if (currentUser.state) {
        setCities(
          City.getCitiesOfState(currentUser.country, currentUser.state)
        );
      }
    }
  }, [currentUser, userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleCountryChange = (e) => {
    const country = e.target.value;
    setUserData({
      ...userData,
      country,
      state: "",
      city: "",
    });
    setStates(State.getStatesOfCountry(country));
    setCities([]);
  };

  const handleStateChange = (e) => {
    const state = e.target.value;
    setUserData({
      ...userData,
      state,
      city: "",
    });
    setCities(City.getCitiesOfState(userData.country, state));
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    setUserData({
      ...userData,
      city,
    });
  };

  const handleFirstNameBlur = () => {
    setFirstnameError(userData.firstname === "" ? "Firstname is required" : "");
  };

  const handleLastNameBlur = () => {
    setLastnameError(userData.lastname === "" ? "Lastname is required" : "");
  };

  const handleEmailBlur = () => {
    setEmailError(userData.email === "" ? "Email Id is required" : "");
  };

  const handleOldPasswordBlur = () => {
    if (userData.oldpassword.length < 8) {
      setOldPasswordError("Old Password must be at least 8 characters long");
    } else {
      setOldPasswordError("");
    }
  };

  const handlePasswordBlur = () => {
    if (userData.password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
    } else {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordBlur = () => {
    if (userData.confirmPassword !== userData.password) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleRoleBlur = () => {
    setRoleError(userData.role === "" ? "Role is required" : "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    handleFirstNameBlur();
    handleLastNameBlur();
    handleEmailBlur();
    handleOldPasswordBlur();
    handlePasswordBlur();
    handleConfirmPasswordBlur();
    handleRoleBlur();

    const { firstname, lastname, email, password, confirmPassword, role } =
      userData;

    const isValidForm =
      firstname &&
      lastname &&
      email &&
      password.length >= 8 &&
      password === confirmPassword &&
      role;

    if (!isValidForm) {
      return;
    }

    try {
      const saltRounds = 10;

      if (userId) {
        let hashedNewPassword = await bcrypt.hash(password, saltRounds);
        let updatedUserData = {
          ...userData,
          password: hashedNewPassword,
        };

        await dispatch(
          updateUsers({ userId, userData: updatedUserData })
        ).unwrap();
      } else {
        let hashedNewPassword = await bcrypt.hash(password, saltRounds);

        let newUserData = {
          ...userData,
          password: hashedNewPassword,
        };

        await dispatch(addUser(newUserData)).unwrap();
      }

      navigate("/users");
    } catch (error) {
      console.error("Error during user submission:", error);
    }
  };

  const handleReset = () => {
    setUserData({
      firstname: "",
      lastname: "",
      email: "",
      oldpassword: "",
      password: "",
      confirmPassword: "",
      age: "",
      mobileNumber: "",
      country: "",
      state: "",
      city: "",
      role: "",
    });
    setFirstnameError("");
    setLastnameError("");
    setEmailError("");
    setOldPasswordError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setRoleError("");
  };

  const handleBack = () => {
    navigate("/users");
  };

  return (
    <div className="user-add-edit-container">
      <Container maxWidth="lg">
        <Box
          sx={{
            mt: 5,
            border: "1px solid #ddd",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            padding: "50px",
            backgroundColor: "#fff",
            animation: "fadeIn 1s ease-in-out",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ fontFamily: "sans-serif" }}
            >
              {userId ? "Edit User" : "Add User"}
            </Typography>
            <Tooltip title="Back">
              <Fab
                size="small"
                color="warning"
                aria-label="add"
                sx={{ marginRight: "2rem" }}
              >
                <ArrowBack onClick={handleBack} />
              </Fab>
            </Tooltip>
          </Box>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              animation: "slideIn 0.5s ease-out",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  margin="normal"
                  label="First Name"
                  name="firstname"
                  value={userData.firstname}
                  onChange={handleChange}
                  onBlur={handleFirstNameBlur}
                  error={!!firstnameError}
                  helperText={firstnameError}
                  sx={{
                    animation: "fadeIn 1s ease-in-out",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  margin="normal"
                  label="Last Name"
                  name="lastname"
                  value={userData.lastname}
                  onChange={handleChange}
                  onBlur={handleLastNameBlur}
                  error={!!lastnameError}
                  helperText={lastnameError}
                  sx={{
                    animation: "fadeIn 1s ease-in-out",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  margin="normal"
                  label="Email ID"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  onBlur={handleEmailBlur}
                  error={!!emailError}
                  helperText={emailError}
                  sx={{
                    animation: "fadeIn 1s ease-in-out",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  margin="normal"
                  label="Age"
                  name="age"
                  value={userData.age}
                  onChange={handleChange}
                  sx={{
                    animation: "fadeIn 1s ease-in-out",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  margin="normal"
                  label="Mobile Number"
                  name="mobileNumber"
                  value={userData.mobileNumber}
                  onChange={handleChange}
                  sx={{
                    animation: "fadeIn 1s ease-in-out",
                  }}
                />
              </Grid>
              {userId && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      margin="normal"
                      label="Old Password"
                      name="oldpassword"
                      type={showPassword ? "text" : "password"}
                      value={userData.oldpassword}
                      onChange={handleChange}
                      onBlur={handleOldPasswordBlur}
                      error={!!oldPasswordError}
                      helperText={oldPasswordError}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        animation: "fadeIn 1s ease-in-out",
                      }}
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  margin="normal"
                  label={userId ? "New Password" : "Password"}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={userData.password}
                  onChange={handleChange}
                  onBlur={handlePasswordBlur}
                  error={!!passwordError}
                  helperText={passwordError}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    animation: "fadeIn 1s ease-in-out",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  margin="normal"
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={userData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleConfirmPasswordBlur}
                  error={!!confirmPasswordError}
                  helperText={confirmPasswordError}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    animation: "fadeIn 1s ease-in-out",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  margin="normal"
                  label="Country"
                  name="country"
                  value={userData.country}
                  onChange={handleCountryChange}
                  sx={{
                    animation: "fadeIn 1s ease-in-out",
                  }}
                >
                  {countries.map((country) => (
                    <MenuItem key={country.isoCode} value={country.isoCode}>
                      {country.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  margin="normal"
                  label="State"
                  name="state"
                  value={userData.state}
                  onChange={handleStateChange}
                  sx={{
                    animation: "fadeIn 1s ease-in-out",
                  }}
                >
                  {states.map((state) => (
                    <MenuItem key={state.isoCode} value={state.isoCode}>
                      {state.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  margin="normal"
                  label="City"
                  name="city"
                  value={userData.city}
                  onChange={handleCityChange}
                  sx={{
                    animation: "fadeIn 1s ease-in-out",
                  }}
                >
                  {cities.map((city) => (
                    <MenuItem key={city.name} value={city.name}>
                      {city.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  margin="normal"
                  label="Role"
                  name="role"
                  select
                  value={userData.role}
                  onChange={handleChange}
                  onBlur={handleRoleBlur}
                  error={!!roleError}
                  helperText={roleError}
                >
                  {roleList?.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mt: 2,
                animation: "slideInUp 0.5s ease-out",
              }}
            >
              <Button
                type="submit"
                variant="contained"
                className="submit-button"
                sx={{
                  backgroundColor: "#28a745",
                  "&:hover": {
                    backgroundColor: "#218838",
                    transform: "scale(1.05)",
                  },
                  transition: "background-color 0.3s ease, transform 0.3s ease",
                }}
              >
                {userId ? "Update" : "Submit"}
              </Button>
              <Button
                type="reset"
                variant="outlined"
                className="reset-button"
                onClick={handleReset}
                sx={{
                  ml: 2,
                  color: "#dc3545",
                  borderColor: "#dc3545",
                  "&:hover": {
                    backgroundColor: "#f8d7da",
                    transform: "scale(1.05)",
                  },
                  transition: "background-color 0.3s ease, transform 0.3s ease",
                }}
              >
                Reset
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default AddEditUsers;
