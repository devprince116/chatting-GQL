# Chat App

A real-time one-to-one chat application built using React, GraphQL, Apollo Client, TypeORM, and PostgreSQL.

## Features
- User Authentication (Login & Logout)
- Fetch all registered users
- One-to-one messaging
- Real-time message updates
- Message history persistence
- User-friendly UI with Material UI
- Secure JWT authentication

## Tech Stack
### Frontend:
- React
- TypeScript
- Vite
- Material UI
- Apollo Client
- React Router

### Backend:
- Node.js
- TypeScript
- GraphQL (Apollo Server)
- TypeORM
- PostgreSQL
- JWT Authentication

## Installation

### Prerequisites
- Node.js installed
- PostgreSQL database set up

### Backend Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/https://github.com/devprince116/chatting-GQL.git
   ```
2. Navigate to the backend folder:
   ```sh
   cd chat-app/backend
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Configure environment variables:
   - Create a `.env` file in the root directory
   - Add the following variables:
     ```env
     PORT = 4000
     JWT_SECRET=your_secret_key
     ```

5. Start the backend server:
   ```sh
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend folder:
   ```sh
   cd chat-app/frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend server:
   ```sh
   npm run dev
   ```

## Usage
1. Open the frontend in your browser (`http://localhost:5173` by default).
2. Log in or sign up.
3. Select a user from the list to start chatting.
4. Send and receive messages in real time.
