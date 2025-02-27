import { gql } from "@apollo/client";

export const SIGNUP_MUTATION = gql`
  mutation Signup($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      success
      message
      accessToken
      refreshToken
      user {
        id
        email
        name
      }
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      success
      message
      accessToken
      refreshToken
      user {
        id
        email
        name
      }
    }
  }
`;

export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($token: String!) {
    refreshToken(token: $token) {
      success
      message
      accessToken
    }
  }
`;

export const SEND_MESSAGE_MUTATION = gql`
  mutation SendMessage($receiverId: String!, $content: String!) {
    sendMessage(receiverId: $receiverId, content: $content) {
      id
      content
      sender {
        id
        email
      }
      receiver {
        id
        email
      }
      createdAt
    }
  }
`;
