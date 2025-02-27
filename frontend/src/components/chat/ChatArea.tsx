import { useMemo, useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";
import { Message, User } from "../../types/chat.types";
import MessageList from "./MessageListContainer";
import MessageInput from "./MessageInput";


interface ChatAreaProps {
  selectedUser: User | null;
  messages: Message[];
  onSendMessage: (text: string) => void;
}

const ChatContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  height: "100%",
  overflow: "hidden",
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export default function ChatArea({
  selectedUser,
  messages,
  onSendMessage,
}: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Using useMemo for the header component
  const chatHeader = useMemo(() => {
    if (!selectedUser) return null;

    return (
      <ChatHeader>
        <Avatar sx={{ bgcolor: selectedUser.color, mr: 2 }}>
          {selectedUser.avatar}
        </Avatar>
        <Typography variant="h6">Chat with {selectedUser.name}</Typography>
      </ChatHeader>
    );
  }, [selectedUser]);

  return (
    <ChatContainer>
      {chatHeader}
      <MessageList messages={messages} messagesEndRef={messagesEndRef} />
      <Divider />
      <MessageInput onSendMessage={onSendMessage} disabled={!selectedUser} />
    </ChatContainer>
  );
}
