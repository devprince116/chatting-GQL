import { useMemo } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { Message } from "../../types/chat.types";

interface MessageBubbleProps {
  message: Message;
}

const MessageContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isMine",
})<{ isMine: boolean }>(({ theme, isMine }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: isMine ? "flex-end" : "flex-start",
  alignSelf: isMine ? "flex-end" : "flex-start",
  maxWidth: "70%",
}));

const MessagePaper = styled(Paper, {
  shouldForwardProp: (prop) => prop !== "isMine",
})<{ isMine: boolean }>(({ theme, isMine }) => ({
  padding: theme.spacing(1.5),
  backgroundColor: isMine ? "#e3f2fd" : "#f5f5f5",
  borderRadius: 12,
}));

const TimeStamp = styled(Typography)(({ theme }) => ({
  fontSize: "0.75rem",
  color: theme.palette.text.secondary,
  marginTop: 4,
}));

export default function MessageBubble({ message }: MessageBubbleProps) {
  // Using useMemo to optimize the message bubble rendering
  const messageContent = useMemo(
    () => (
      <MessageContainer isMine={message.isMine}>
        <MessagePaper isMine={message.isMine} elevation={0}>
          <Typography variant="body1">{message.text}</Typography>
        </MessagePaper>
        <TimeStamp variant="caption">{message.timestamp}</TimeStamp>
      </MessageContainer>
    ),
    [message]
  );

  return messageContent;
}
