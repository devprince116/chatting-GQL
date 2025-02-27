import { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import { Message, User } from "../../types/chat.types";
import Header from "../Header";
import Sidebar from "../sidebar/Sidebar";
import ChatArea from "./ChatArea";

// Mock data - in a real app, this would come from GraphQL
const mockUsers: User[] = [
  { id: "1", name: "user1", avatar: "U", status: "offline", color: "#673ab7" },
  { id: "2", name: "fiwe", avatar: "F", status: "offline", color: "#4caf50" },
  { id: "3", name: "cip", avatar: "C", status: "offline", color: "#2196f3" },
  { id: "4", name: "cip", avatar: "C", status: "offline", color: "#2196f3" },
  {
    id: "5",
    name: "testusr",
    avatar: "T",
    status: "offline",
    color: "#673ab7",
  },
  { id: "6", name: "test", avatar: "T", status: "offline", color: "#9c27b0" },
  { id: "7", name: "tester", avatar: "T", status: "offline", color: "#4caf50" },
];

const mockMessages: Message[] = [
  {
    id: "1",
    senderId: "1",
    text: "Hello BinBytes",
    timestamp: "04/19/2018 11:24",
    isMine: false,
  },
  {
    id: "2",
    senderId: "1",
    text: "How are you?",
    timestamp: "04/19/2018 11:24",
    isMine: false,
  },
  {
    id: "3",
    senderId: "me",
    text: "I am doing good",
    timestamp: "04/19/2018 01:16",
    isMine: true,
  },
  {
    id: "4",
    senderId: "me",
    text: "thanks for asking",
    timestamp: "04/19/2018 01:16",
    isMine: true,
  },
];

export default function ChatLayout() {
  const [selectedUser, setSelectedUser] = useState<User | null>(mockUsers[0]);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter users based on search query using useMemo for performance
  const filteredUsers = useMemo(() => {
    return mockUsers.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleSendMessage = (text: string) => {
    if (!text.trim() || !selectedUser) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: "me",
      text,
      timestamp: new Date()
        .toLocaleString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
        .replace(",", ""),
      isMine: true,
    };

    setMessages([...messages, newMessage]);
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    // In a real app, you would fetch messages for this user from GraphQL here
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <Header username="binbytes" />
      <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
        <Sidebar
          users={filteredUsers}
          selectedUser={selectedUser}
          onUserSelect={handleUserSelect}
          onSearch={handleSearch}
          searchQuery={searchQuery}
        />
        <ChatArea
          messages={messages}
          selectedUser={selectedUser}
          onSendMessage={handleSendMessage}
        />
      </Box>
    </Box>
  );
}
