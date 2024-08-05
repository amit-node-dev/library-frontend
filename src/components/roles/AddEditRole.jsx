import React, { useState, useEffect } from "react";

// THIRD PARTY COMPONENTS
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

// MUI IMPORTS
import {
  TextField,
  Button,
  Typography,
  Box,
  Container,
  Fab,
} from "@mui/material";

// ACTIONS & STORES
import {
  addRole,
  getRoleById,
  updateRole,
} from "../../features/role_module/roleActions";
import { ArrowBack } from "@mui/icons-material";

const AddEditRole = () => {
  const { roleId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentRole } = useSelector((state) => state.roles);

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
  };

  const handleFirstNameBlur = () => {
    setNameError(roleData.name === "" ? "Rolename is required" : "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    handleFirstNameBlur();

    if (roleData.name) {
      if (roleId) {
        await dispatch(updateRole({ roleId, roleData })).unwrap();
      } else {
        await dispatch(addRole(roleData)).unwrap();
      }
      navigate("/roles");
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
    <div className="role-add-edit-container">
      <Container maxWidth="md">
        <Box
          sx={{
            mt: 10,
            border: "1px solid #ddd",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            padding: "50px",
            backgroundColor: "#fff",
            animation: "fadeIn 1s ease-in-out",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h4" gutterBottom>
              {roleId ? "Edit Role" : "Add Role"}
            </Typography>
            <Fab
              size="small"
              color="warning"
              aria-label="add"
              sx={{ marginRight: "2rem" }}
            >
              <ArrowBack onClick={handleBack} />
            </Fab>
          </Box>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              animation: "slideIn 0.5s ease-out",
            }}
          >
            <TextField
              fullWidth
              size="small"
              margin="normal"
              label="Role Name"
              name="name"
              value={roleData.name}
              onChange={handleChange}
              onBlur={handleFirstNameBlur}
              error={!!nameError}
              helperText={nameError}
              sx={{
                animation: "fadeIn 1s ease-in-out",
              }}
            />

            <Box
              sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}
            >
              <Button
                variant="contained"
                type="submit"
                color="primary"
                sx={{
                  backgroundColor: "#007bff",
                  "&:hover": {
                    backgroundColor: "#0056b3",
                    transform: "scale(1.05)",
                  },
                  transition: "background-color 0.3s ease, transform 0.3s ease",
                }}
              >
                {roleId ? "Update" : "Add"}
              </Button>
              <Button
                variant="outlined"
                onClick={handleReset}
                color="secondary"
                className="reset-button"
                sx={{
                  borderColor: "#f50057",
                  color: "#f50057",
                  "&:hover": {
                    borderColor: "#c51162",
                    color: "#c51162",
                  },
                  transition: "border-color 0.3s ease, color 0.3s ease",
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

export default AddEditRole;
