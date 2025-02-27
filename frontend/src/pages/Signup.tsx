import React, { useState, useMemo } from "react";
import { useMutation } from "@apollo/client";
import { gql } from "graphql-tag";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion } from "framer-motion";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  Link,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// GraphQL mutation
const SIGNUP_MUTATION = gql`
  mutation Signup($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      success
      message
      accessToken
      refreshToken
      user {
        id
        name
        email
      }
    }
  }
`;

// Validation schema
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Min 6 characters")
    .required("Password required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

const Signup = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const [signup, { loading }] = useMutation(SIGNUP_MUTATION, {
    onCompleted: (data) => {
      if (data.signup.success) {
        localStorage.setItem("accessToken", data.signup.accessToken);
        localStorage.setItem("refreshToken", data.signup.refreshToken);
        navigate("/login");
      } else {
        setErrorMessage(data.signup.message);
      }
    },
    onError: (error) => setErrorMessage(error.message),
  });

  const onSubmit = (data) => {
    signup({
      variables: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });
  };

  // Styles using useMemo
  const styles = useMemo(
    () => ({
      container: {
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      paper: { padding: 4, width: "100%", maxWidth: 400, textAlign: "center" },
    }),
    []
  );

  return (
    <Container maxWidth="xs" sx={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={4} sx={styles.paper}>
          <Typography variant="h4" gutterBottom>
            Sign Up
          </Typography>

          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Name"
                  fullWidth
                  margin="normal"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  fullWidth
                  margin="normal"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  fullWidth
                  margin="normal"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type={showConfirmPassword ? "text" : "password"}
                  label="Confirm Password"
                  fullWidth
                  margin="normal"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
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
              )}
            />

            <Box mt={3}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Sign Up"}
              </Button>
            </Box>

            <Box mt={2} textAlign="center">
              <Typography variant="body2">
                Already have an account?{" "}
                <Link component="button" onClick={() => navigate("/login")}>
                  Log in
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default Signup;
