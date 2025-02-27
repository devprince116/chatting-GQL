import { gql } from "apollo-server";

export const typeDefs = gql`
    type User {
        id: ID!
        name: String!
        email: String!
    }

    type Message {
        id: ID!
        content: String!
        sender: User!
        receiver: User!
        createdAt: String!
    }

    type AuthPayload {
        success: Boolean!
        message: String
        accessToken: String!
        refreshToken: String!
        user: User!
    }

    type RefreshTokenResponse {
        success: Boolean!
        message: String!
        accessToken: String!
    }

   type UsersResponse {
        success: Boolean!
        message: String!
        users: [User!]!
    }

    type Query {
        me: User
        messages(receiverId: ID!): [Message!]!
        users: UsersResponse!  
    }
    type Mutation {
        signup(email: String!, password: String! , name:String!): AuthPayload!
        login(email: String!, password: String!): AuthPayload!
        refreshToken(token: String!): RefreshTokenResponse!
        sendMessage(receiverId: ID!, content: String!): Message!
    }
`;
