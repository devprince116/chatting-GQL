import { gql } from "@apollo/client";

export const GET_MESSAGES = gql`
  query GetMessages($receiverId: ID!) {
    messages(receiverId: $receiverId) {
      id
      content
      sender {
        id
        name
        email
      }
      receiver {
        id
        name
        email
      }
      createdAt
    }
  }
`;

export const GET_ME = gql`
  query GetMe {
    me {
      id
      name
      email
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    users {
      success
      message
      users {
        id
        name
        email
      }
    }
  }
`;
