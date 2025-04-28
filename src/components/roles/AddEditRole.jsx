import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";

// MUI IMPORTS
import {
  TextField,
  Button,
  Typography,
  Box,
  Container,
  Fab,
  Tooltip,
  Paper,
  Divider,
  Alert,
  Grid,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

// ACTIONS & STORES
import {
  addRole,
  getRoleById,
  updateRole,
} from "../../features/role_module/roleActions";

// Styled components
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
  padding: theme.spacing(5),
  marginTop: theme.spacing(5),
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

const AddEditRole = () => {
  const { roleId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentRole, loading, error } = useSelector((state) => state.roles);

  const [roleData, setRoleData] = useState({
    name: "",
  });

  const [nameError, setNameError] = useState("");

  useEffect(() => {
    if (roleId) {
      dispatch(getRoleById(roleId));
    }
  }, [dispatch, roleId]);

  useEffect(() => {
    if (roleId && currentRole) {
      setRoleData({
        name: currentRole.name,
      });
    }
  }, [currentRole, roleId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoleData({
      ...roleData,
      [name]: value,
    });
    setNameError("");
  };

  const handleNameBlur = () => {
    setNameError(roleData.name === "" ? "Role name is required" : "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleNameBlur();

    if (roleData.name) {
      try {
        if (roleId) {
          await dispatch(updateRole({ roleId, roleData })).unwrap();
        } else {
          await dispatch(addRole(roleData)).unwrap();
        }
        navigate("/roles");
      } catch (error) {
        console.error("Error in handleSubmit:", error);
      }
    }
  };

  const handleReset = () => {
    setRoleData({
      name: "",
    });
    setNameError("");
  };

  const handleBack = () => {
    navigate("/roles");
  };

  return (
    <MainContainer>
      <MainWrapper>
        <FormContainer maxWidth="sm">
          <FormPaper elevation={4}>
            <FormHeader>
              <FormTitle variant="h4">
                {roleId ? "Edit Role" : "Add New Role"}
              </FormTitle>
              <Tooltip title="Back to Roles">
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

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <ScrollableFormContent>
              <PerfectScrollbar>
                <Box mt={1} component="form" onSubmit={handleSubmit}>
                  <FormGrid container spacing={3}>
                    <Grid item xs={12}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * 0 }}
                      >
                        <StyledTextField
                          fullWidth
                          label="Role Name"
                          name="name"
                          value={roleData.name}
                          onChange={handleChange}
                          onBlur={handleNameBlur}
                          error={!!nameError}
                          helperText={nameError}
                          size="small"
                        />
                      </motion.div>
                    </Grid>
                  </FormGrid>

                  <ActionButtons>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * 1 }}
                      style={{ display: "inline-block" }}
                    >
                      <ResetButton
                        variant="outlined"
                        color="error"
                        onClick={handleReset}
                        disabled={loading}
                      >
                        Reset
                      </ResetButton>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * 2 }}
                      style={{ display: "inline-block" }}
                    >
                      <SubmitButton
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={loading}
                      >
                        {loading
                          ? "Processing..."
                          : roleId
                          ? "Update Role"
                          : "Add Role"}
                      </SubmitButton>
                    </motion.div>
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

export default AddEditRole;
