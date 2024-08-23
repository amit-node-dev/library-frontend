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
  Tooltip,
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
            <Typography
              variant="h4"
              gutterBottom
              sx={{ fontFamily: "cursive" }}
            >
              {roleId ? "Edit Role" : "Add Role"}
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
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mt: 2,
                animation: "slideInUp 0.5s ease-out",
              }}
            >
              <Button
                variant="contained"
                type="submit"
                color="primary"
                sx={{
                  backgroundColor: "#28a745",
                  "&:hover": {
                    backgroundColor: "#218838",
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

export default AddEditRole;
