"use client"

import type React from "react"

import { useState, useMemo, useCallback } from "react"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import { styled } from "@mui/material/styles"
import SendIcon from "@mui/icons-material/Send"

interface MessageInputProps {
  onSendMessage: (text: string) => void
  disabled?: boolean
}

const InputContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  padding: theme.spacing(2),
  gap: theme.spacing(1),
}))

export default function MessageInput({ onSendMessage, disabled = false }: MessageInputProps) {
  const [message, setMessage] = useState("")

  const handleSend = useCallback(() => {
    if (message.trim()) {
      onSendMessage(message)
      setMessage("")
    }
  }, [message, onSendMessage])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Using useMemo for the send button
  const sendButton = useMemo(
    () => (
      <Button
        variant="contained"
        color="primary"
        endIcon={<SendIcon />}
        onClick={handleSend}
        disabled={disabled || !message.trim()}
      >
        Send
      </Button>
    ),
    [disabled, message, handleSend],
  )

  return (
    <InputContainer>
      <TextField
        fullWidth
        placeholder="Type your message"
        variant="outlined"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={disabled}
        multiline
        maxRows={4}
      />
      {sendButton}
    </InputContainer>
  )
}

