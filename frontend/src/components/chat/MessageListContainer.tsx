import type React from "react";
import { useMemo } from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { Message } from "../../types/chat.types";
import MessageBubble from "./MessageBubble";

interface MessageListProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const MessageListContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflow: "auto",
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

export default function MessageList({
  messages,
  messagesEndRef,
}: MessageListProps) {
  // Using useMemo to optimize the message list rendering
  const messageItems = useMemo(() => {
    return messages.map((message) => (
      <MessageBubble key={message.id} message={message} />
    ));
  }, [messages]);

  return (
    <MessageListContainer>
      {messageItems}
      <div ref={messagesEndRef} />
    </MessageListContainer>
  );
}
