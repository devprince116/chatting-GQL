import React, { createContext, useContext, useState, useEffect } from "react";
import { useApolloClient, useMutation } from "@apollo/client";
import { gql } from "graphql-tag";
import { useNavigate } from "react-router-dom";

// GraphQL mutation for refreshing tokens
const REFRESH_TOKEN = gql`
  mutation RefreshToken($token: String!) {
    refreshToken(token: $token) {
      success
      message
      accessToken
    }
  }
`;

const AuthContext = createContext({
  isLoggedIn: false,
  isLoading: true,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const client = useApolloClient();
  const navigate = useNavigate();

  const [refreshToken] = useMutation(REFRESH_TOKEN);

  // Function to handle logout
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    client.clearStore();
    setIsLoggedIn(false);
    navigate("/login");
  };

  // Check authentication status and refresh token if needed
  useEffect(() => {
    const checkAuth = async () => {
      const storedAccessToken = localStorage.getItem("accessToken");
      const storedRefreshToken = localStorage.getItem("refreshToken");

      if (!storedAccessToken || !storedRefreshToken) {
        setIsLoggedIn(false);
        setIsLoading(false);
        return;
      }

      try {
        // Try to refresh the token
        const { data } = await refreshToken({
          variables: { token: storedRefreshToken },
        });

        if (data?.refreshToken?.success) {
          localStorage.setItem("accessToken", data.refreshToken.accessToken);
          setIsLoggedIn(true);
        } else {
          // If refresh fails, log out
          logout();
        }
      } catch (error) {
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Set up token refresh interval
  useEffect(() => {
    if (!isLoggedIn) return;

    // Refresh token every 14 minutes (just before the 15-minute expiration)
    const intervalId = setInterval(async () => {
      const storedRefreshToken = localStorage.getItem("refreshToken");
      if (!storedRefreshToken) {
        logout();
        return;
      }

      try {
        const { data } = await refreshToken({
          variables: { token: storedRefreshToken },
        });

        if (data?.refreshToken?.success) {
          localStorage.setItem("accessToken", data.refreshToken.accessToken);
        } else {
          logout();
        }
      } catch (error) {
        logout();
      }
    }, 14 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [isLoggedIn]);

  const value = {
    isLoggedIn,
    isLoading,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
