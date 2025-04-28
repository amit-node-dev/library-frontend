import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Country, State, City } from "country-state-city";
import { motion } from "framer-motion";

import {
  Box,
  Container,
  Typography,
  Paper,
  Divider,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Grid,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { updateUsers } from "../features/user_module/userActions";
import { toast } from "react-toastify";

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
  marginBottom: theme.spacing(3),
}));
const SubmitButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1, 4),
  fontWeight: 600,
  transition: "all 0.3s ease",
  marginTop: theme.spacing(3),
}));
const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.shape.borderRadius,
  },
  animation: "fadeIn 0.5s ease-in-out",
}));

const Profile = () => {
  const dispatch = useDispatch();

  const userData = localStorage.getItem("userData");
  const userInfo = userData ? JSON.parse(userData) : {};

  const [form, setForm] = useState({
    firstname: userInfo.firstName || "",
    lastname: userInfo.lastName || "",
    email: userInfo.emailId || "",
    age: userInfo.age || "",
    mobileNumber: userInfo.mobileNumber || "",
    oldpassword: "",
    password: "",
    confirmPassword: "",
    country: userInfo.country || "",
    state: userInfo.state || "",
    city: userInfo.city || "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const countries = Country.getAllCountries();
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    setForm({
      firstname: userInfo.firstName || "",
      lastname: userInfo.lastName || "",
      email: userInfo.emailId || "",
      age: userInfo.age || "",
      mobileNumber: userInfo.mobileNumber || "",
      oldpassword: "",
      password: "",
      confirmPassword: "",
      country: userInfo.country || "",
      state: userInfo.state || "",
      city: userInfo.city || "",
    });
  }, [userInfo]);

  useEffect(() => {
    if (form.country) {
      setStates(State.getStatesOfCountry(form.country));
    }
    if (form.country && form.state) {
      setCities(City.getCitiesOfState(form.country, form.state));
    }
  }, [form.country, form.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    let temp = {};
    if (!form.firstname) temp.firstname = "First name is required";
    if (!form.lastname) temp.lastname = "Last name is required";
    if (!form.email) temp.email = "Email is required";
    if (form.password || form.confirmPassword || form.oldpassword) {
      if (!form.oldpassword || form.oldpassword.length < 8)
        temp.oldpassword = "Old password must be at least 8 characters";
      if (!form.password || form.password.length < 8)
        temp.password = "New password must be at least 8 characters";
      if (form.password !== form.confirmPassword)
        temp.confirmPassword = "Passwords do not match";
    }
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleCountryChange = (e) => {
    const country = e.target.value;
    setForm((prev) => ({
      ...prev,
      country,
      state: "",
      city: "",
    }));
    setStates(State.getStatesOfCountry(country));
    setCities([]);
  };

  const handleStateChange = (e) => {
    const state = e.target.value;
    setForm((prev) => ({
      ...prev,
      state,
      city: "",
    }));
    setCities(City.getCitiesOfState(form.country, state));
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    setForm((prev) => ({
      ...prev,
      city,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const updateData = {
      firstname: form.firstname,
      lastname: form.lastname,
      email: form.email,
      age: form.age,
      mobileNumber: form.mobileNumber,
      country: form.country,
      state: form.state,
      city: form.city,
    };
    if (form.password) {
      updateData.oldpassword = form.oldpassword;
      updateData.password = form.password;
    }
    try {
      await dispatch(
        updateUsers({ userId: userInfo.id, userData: updateData })
      ).unwrap();
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <MainContainer>
      <MainWrapper>
        <FormContainer maxWidth="xl">
          <FormPaper elevation={4}>
            <FormHeader>
              <FormTitle variant="h4">My Profile</FormTitle>
            </FormHeader>
            <Divider sx={{ my: 2 }} />
            <Box mt={1} component="form" onSubmit={handleSubmit}>
              <FormGrid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * 0 }}
                  >
                    <StyledTextField
                      fullWidth
                      size="small"
                      margin="normal"
                      label="First Name"
                      name="firstname"
                      value={form.firstname}
                      onChange={handleChange}
                      error={!!errors.firstname}
                      helperText={errors.firstname}
                    />
                  </motion.div>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * 1 }}
                  >
                    <StyledTextField
                      fullWidth
                      size="small"
                      margin="normal"
                      label="Last Name"
                      name="lastname"
                      value={form.lastname}
                      onChange={handleChange}
                      error={!!errors.lastname}
                      helperText={errors.lastname}
                    />
                  </motion.div>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * 2 }}
                  >
                    <StyledTextField
                      fullWidth
                      size="small"
                      margin="normal"
                      label="Email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      error={!!errors.email}
                      helperText={errors.email}
                    />
                  </motion.div>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * 3 }}
                  >
                    <StyledTextField
                      fullWidth
                      size="small"
                      margin="normal"
                      label="Age"
                      name="age"
                      value={form.age}
                      onChange={handleChange}
                    />
                  </motion.div>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * 4 }}
                  >
                    <StyledTextField
                      fullWidth
                      size="small"
                      margin="normal"
                      label="Mobile Number"
                      name="mobileNumber"
                      value={form.mobileNumber}
                      onChange={handleChange}
                    />
                  </motion.div>
                </Grid>
                {/* Password Change Section */}
                <Grid item xs={12} sm={6}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * 5 }}
                  >
                    <StyledTextField
                      fullWidth
                      size="small"
                      margin="normal"
                      label="Old Password"
                      name="oldpassword"
                      type={showPassword ? "text" : "password"}
                      value={form.oldpassword}
                      onChange={handleChange}
                      error={!!errors.oldpassword}
                      helperText={errors.oldpassword}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword((s) => !s)}
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
                    />
                  </motion.div>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * 6 }}
                  >
                    <StyledTextField
                      fullWidth
                      size="small"
                      margin="normal"
                      label="New Password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      error={!!errors.password}
                      helperText={errors.password}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword((s) => !s)}
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
                    />
                  </motion.div>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * 7 }}
                  >
                    <StyledTextField
                      fullWidth
                      size="small"
                      margin="normal"
                      label="Confirm Password"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={handleChange}
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowConfirmPassword((s) => !s)}
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
                    />
                  </motion.div>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * 8 }}
                  >
                    <StyledTextField
                      select
                      fullWidth
                      size="small"
                      margin="normal"
                      label="Country"
                      name="country"
                      value={form.country}
                      onChange={handleCountryChange}
                    >
                      {countries.map((country) => (
                        <MenuItem key={country.isoCode} value={country.isoCode}>
                          {country.name}
                        </MenuItem>
                      ))}
                    </StyledTextField>
                  </motion.div>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * 9 }}
                  >
                    <StyledTextField
                      select
                      fullWidth
                      size="small"
                      margin="normal"
                      label="State"
                      name="state"
                      value={form.state}
                      onChange={handleStateChange}
                      disabled={!form.country}
                    >
                      {states.map((state) => (
                        <MenuItem key={state.isoCode} value={state.isoCode}>
                          {state.name}
                        </MenuItem>
                      ))}
                    </StyledTextField>
                  </motion.div>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * 10 }}
                  >
                    <StyledTextField
                      select
                      fullWidth
                      size="small"
                      margin="normal"
                      label="City"
                      name="city"
                      value={form.city}
                      onChange={handleCityChange}
                      disabled={!form.state}
                    >
                      {cities.map((city) => (
                        <MenuItem key={city.name} value={city.name}>
                          {city.name}
                        </MenuItem>
                      ))}
                    </StyledTextField>
                  </motion.div>
                </Grid>
              </FormGrid>
              <SubmitButton type="submit" variant="contained" color="primary">
                Save
              </SubmitButton>
            </Box>
          </FormPaper>
        </FormContainer>
      </MainWrapper>
    </MainContainer>
  );
};

export default Profile;
