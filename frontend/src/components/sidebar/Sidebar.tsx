import { useMemo } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import { styled } from "@mui/material/styles";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { User } from "../../types/chat.types";
import UserListItem from "./UserListItem";

interface SidebarProps {
  users: User[];
  selectedUser: User | null;
  onUserSelect: (user: User) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
}

const SidebarContainer = styled(Box)(({ theme }) => ({
  width: 280,
  borderRight: `1px solid ${theme.palette.divider}`,
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.background.paper,
}));

const SearchContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export default function Sidebar({
  users,
  selectedUser,
  onUserSelect,
  onSearch,
  searchQuery,
}: SidebarProps) {
  // Using useMemo to optimize the search field
  const searchField = useMemo(
    () => (
      <TextField
        fullWidth
        placeholder="Search"
        variant="outlined"
        size="small"
        value={searchQuery}
        onChange={(e) => onSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    ),
    [searchQuery, onSearch]
  );

  return (
    <SidebarContainer>
      <SearchContainer>{searchField}</SearchContainer>
      <List sx={{ overflow: "auto", flexGrow: 1 }}>
        {users.map((user) => (
          <UserListItem
            key={user.id}
            user={user}
            isSelected={selectedUser?.id === user.id}
            onSelect={() => onUserSelect(user)}
          />
        ))}
      </List>
    </SidebarContainer>
  );
}
