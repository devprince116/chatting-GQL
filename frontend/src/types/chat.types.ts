export interface User {
    id: string
    name: string
    avatar: string
    status: "online" | "offline"
    color: string
  }
  
  export interface Message {
    id: string
    senderId: string
    text: string
    timestamp: string
    isMine: boolean
  }
  
  