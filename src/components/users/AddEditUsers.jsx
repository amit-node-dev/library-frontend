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
  Paper,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";

// ACTIONS & STORES
import {
  addUser,
  getUserById,
  updateUsers,
} from "../../features/user_module/userActions";
import { getAllRolesList } from "../../features/role_module/roleActions";
import { ArrowBack, Visibility, VisibilityOff } from "@mui/icons-material";

// Styled components (copied and adapted from AddEditRole.jsx)
const MainContainer = styled("div")(({ theme }) => ({
  position: "relative",
  padding: theme.spacing(2),
  backgroundColor: "darkgray",
  minHeight: "calc(100vh - 100px)",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
}));
const MainWrapper = styled("div")(() => ({
  margin: "0 auto",
  width: "100%",
  maxWidth: "1200px",
  animation: "slideIn 0.5s ease-out",
}));
const FormContainer = styled(Container)(({ theme }) => ({
  flex: 2,
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(0),
}));
const FormPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  animation: "fadeIn 0.5s ease-in-out",
  display: "flex",
  flexDirection: "column",
  height: "100%",
}));
const FormHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(3),
}));
const FormTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.primary.main,
}));
const FormGrid = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));
const ActionButtons = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  gap: theme.spacing(2),
  marginTop: theme.spacing(3),
  paddingTop: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
}));
const SubmitButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1, 4),
  fontWeight: 600,
  transition: "all 0.3s ease",
}));
const ResetButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1, 4),
  fontWeight: 600,
  transition: "all 0.3s ease",
}));
const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.shape.borderRadius,
  },
  animation: "fadeIn 0.5s ease-in-out",
}));
const ScrollableFormContent = styled(Box)({
  flex: 1,
  overflow: "hidden",
});

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
    <MainContainer>
      <MainWrapper>
        <FormContainer maxWidth="lg">
          <FormPaper elevation={4}>
            <FormHeader>
              <FormTitle variant="h4">
                {userId ? "Edit User" : "Add User"}
              </FormTitle>
              <Tooltip title="Back to Users">
                <Fab
                  size="medium"
                  color="primary"
                  aria-label="back"
                  onClick={handleBack}
                  sx={{ boxShadow: 2 }}
                >
                  <ArrowBack />
                </Fab>
              </Tooltip>
            </FormHeader>
            <Divider sx={{ my: 2 }} />
            {/* Error handling can be added here if needed */}
            <ScrollableFormContent>
              <PerfectScrollbar>
                <Box mt={1} component="form" onSubmit={handleSubmit}>
                  <FormGrid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
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
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
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
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
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
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        size="small"
                        margin="normal"
                        label="Age"
                        name="age"
                        value={userData.age}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        fullWidth
                        size="small"
                        margin="normal"
                        label="Mobile Number"
                        name="mobileNumber"
                        value={userData.mobileNumber}
                        onChange={handleChange}
                      />
                    </Grid>
                    {userId && (
                      <Grid item xs={12} sm={6}>
                        <StyledTextField
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
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    )}
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
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
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
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
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                edge="end"
                              >
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        select
                        fullWidth
                        size="small"
                        margin="normal"
                        label="Country"
                        name="country"
                        value={userData.country}
                        onChange={handleCountryChange}
                      >
                        {countries.map((country) => (
                          <MenuItem key={country.isoCode} value={country.isoCode}>
                            {country.name}
                          </MenuItem>
                        ))}
                      </StyledTextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        select
                        fullWidth
                        size="small"
                        margin="normal"
                        label="State"
                        name="state"
                        value={userData.state}
                        onChange={handleStateChange}
                      >
                        {states.map((state) => (
                          <MenuItem key={state.isoCode} value={state.isoCode}>
                            {state.name}
                          </MenuItem>
                        ))}
                      </StyledTextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
                        select
                        fullWidth
                        size="small"
                        margin="normal"
                        label="City"
                        name="city"
                        value={userData.city}
                        onChange={handleCityChange}
                      >
                        {cities.map((city) => (
                          <MenuItem key={city.name} value={city.name}>
                            {city.name}
                          </MenuItem>
                        ))}
                      </StyledTextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StyledTextField
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
                      </StyledTextField>
                    </Grid>
                  </FormGrid>
                  <ActionButtons>
                    <ResetButton
                      variant="outlined"
                      color="error"
                      onClick={handleReset}
                    >
                      Reset
                    </ResetButton>
                    <SubmitButton
                      type="submit"
                      variant="contained"
                      color="primary"
                    >
                      {userId ? "Update" : "Submit"}
                    </SubmitButton>
                  </ActionButtons>
                </Box>
              </PerfectScrollbar>
            </ScrollableFormContent>
          </FormPaper>
        </FormContainer>
      </MainWrapper>
    </MainContainer>
  );
};

export default AddEditUsers;
