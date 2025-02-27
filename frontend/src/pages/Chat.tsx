import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useApolloClient } from "@apollo/client";
import gql from "graphql-tag";
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItemButton,
  Divider,
  Box,
  Avatar,
  IconButton,
  AppBar,
  Toolbar,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";

const GET_USERS = gql`
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

const GET_MESSAGES = gql`
  query GetMessages($receiverId: ID!) {
    messages(receiverId: $receiverId) {
      id
      content
      createdAt
      sender {
        id
        name
      }
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation SendMessage($receiverId: ID!, $content: String!) {
    sendMessage(receiverId: $receiverId, content: $content) {
      id
      content
      createdAt
      sender {
        id
        name
      }
    }
  }
`;

const GET_ME = gql`
  query GetMe {
    me {
      id
      name
      email
    }
  }
`;

const Chat = () => {
  const navigate = useNavigate();
  const client = useApolloClient();
  const messagesEndRef = useRef(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageInput, setMessageInput] = useState("");

  const { data: meData } = useQuery(GET_ME, {
    onError: () => navigate("/login"),
  });

  const { data: usersData } = useQuery(GET_USERS);

  const { data: messagesData, refetch: refetchMessages } = useQuery(
    GET_MESSAGES,
    {
      variables: { receiverId: selectedUser?.id || "" },
      skip: !selectedUser,
      fetchPolicy: "network-only",
    }
  );

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onCompleted: () => {
      refetchMessages();
      setMessageInput("");
    },
  });

  useEffect(() => {
    if (meData?.me) {
      setCurrentUser(meData.me);
    }
  }, [meData]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesData]);

  const handleUserSelect = (user) => setSelectedUser(user);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim() && selectedUser) {
      sendMessage({
        variables: {
          receiverId: selectedUser.id,
          content: messageInput,
        },
      });
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    client.clearStore();
    navigate("/login");
  };

  const formatTime = (dateString) =>
    new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const sortedMessages = messagesData?.messages
    ? [...messagesData.messages].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      )
    : [];

  return (
    <Box
      sx={{
        flexGrow: 1,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Chat App
          </Typography>
          {currentUser && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="body1" sx={{ mr: 2 }}>
                {currentUser.name}
              </Typography>
              <IconButton color="inherit" onClick={handleLogout}>
                <LogoutIcon />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Container
        maxWidth="xl"
        sx={{ flexGrow: 1, display: "flex", pt: 2, pb: 2 }}
      >
        <Grid container spacing={2} sx={{ height: "100%" }}>
          <Grid item xs={3}>
            <Paper elevation={3} sx={{ height: "100%", overflow: "auto" }}>
              <Typography
                variant="h6"
                sx={{ p: 2, bgcolor: "primary.main", color: "white" }}
              >
                Users
              </Typography>
              <List>
                {usersData?.users?.users
                  ?.filter((user) => user.id !== currentUser?.id)
                  .map((user) => (
                    <React.Fragment key={user.id}>
                      <ListItemButton
                        selected={selectedUser?.id === user.id}
                        onClick={() => handleUserSelect(user)}
                      >
                        <Avatar sx={{ mr: 2 }}>
                          {user.name[0].toUpperCase()}
                        </Avatar>
                        <Typography>{user.name}</Typography>
                      </ListItemButton>
                      <Divider />
                    </React.Fragment>
                  ))}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={9}>
            <Paper
              elevation={3}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                bgcolor: "#f5f5f5",
              }}
            >
              {selectedUser ? (
                <>
                  <Box
                    sx={{
                      flexGrow: 1,
                      overflow: "auto",
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {sortedMessages.map((message) => (
                      <Box
                        key={message.id}
                        sx={{
                          alignSelf:
                            message.sender.id === currentUser?.id
                              ? "flex-end"
                              : "flex-start",
                          maxWidth: "70%",
                          mb: 1,
                        }}
                      >
                        <Paper
                          elevation={1}
                          sx={{
                            p: 2,
                            bgcolor:
                              message.sender.id === currentUser?.id
                                ? "primary.light"
                                : "white",
                            borderRadius: 2,
                          }}
                        >
                          <Typography variant="body1">
                            {message.content}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ display: "block", mt: 0.5 }}
                          >
                            {formatTime(message.createdAt)}
                          </Typography>
                        </Paper>
                      </Box>
                    ))}
                    <div ref={messagesEndRef} />
                  </Box>
                  <Box sx={{ p: 2, bgcolor: "background.paper" }}>
                    <form onSubmit={handleSendMessage}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        endIcon={<SendIcon />}
                        disabled={!messageInput.trim()}
                      >
                        Send
                      </Button>
                    </form>
                  </Box>
                </>
              ) : (
                <Typography variant="h5" color="textSecondary">
                  Select a user to start chatting
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
export default Chat;
