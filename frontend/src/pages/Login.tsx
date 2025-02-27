import React, { useState, useMemo } from "react";
import { useMutation } from "@apollo/client";
import { gql } from "graphql-tag";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
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
import { motion } from "framer-motion";

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
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

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const [login, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      if (data.login.success) {
        localStorage.setItem("accessToken", data.login.accessToken);
        localStorage.setItem("refreshToken", data.login.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.login.user));
        navigate("/chat");
      } else {
        setErrorMessage(data.login.message);
      }
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });

  const onSubmit = (data) => {
    login({ variables: data });
  };

  const styles = useMemo(
    () => ({
      container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      },
      paper: {
        padding: 4,
        maxWidth: 400,
        textAlign: "center",
      },
    }),
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={styles.container}
    >
      <Container maxWidth="xs">
        <Paper elevation={6} sx={styles.paper}>
          <Typography variant="h4" gutterBottom>
            Log In
          </Typography>

          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

          <form onSubmit={handleSubmit(onSubmit)}>
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
                  label="Password"
                  fullWidth
                  type={showPassword ? "text" : "password"}
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

            <Box mt={3}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Log In"}
              </Button>
            </Box>

            <Box mt={2} textAlign="center">
              <Typography variant="body2">
                Don't have an account?{" "}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Container>
    </motion.div>
  );
};

export default Login;
