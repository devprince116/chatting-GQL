import { useMemo } from "react";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { User } from "../../types/chat.types";

interface UserListItemProps {
  user: User;
  isSelected: boolean;
  onSelect: () => void;
}

export default function UserListItem({
  user,
  isSelected,
  onSelect,
}: UserListItemProps) {
  // Using useMemo to create the avatar component
  const avatarComponent = useMemo(
    () => <Avatar sx={{ bgcolor: user.color }}>{user.avatar}</Avatar>,
    [user.avatar, user.color]
  );

  // Using useMemo for the status indicator
  const statusIndicator = useMemo(
    () => (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <FiberManualRecordIcon
          sx={{
            fontSize: 10,
            color: user.status === "online" ? "success.main" : "text.disabled",
            mr: 0.5,
          }}
        />
        <Typography variant="body2" color="text.secondary">
          {user.status}
        </Typography>
      </Box>
    ),
    [user.status]
  );

  return (
    <ListItem disablePadding divider>
      <ListItemButton
        selected={isSelected}
        onClick={onSelect}
        sx={{
          "&.Mui-selected": {
            backgroundColor: "action.selected",
          },
        }}
      >
        <ListItemAvatar>{avatarComponent}</ListItemAvatar>
        <ListItemText
          primary={user.name}
          secondary={statusIndicator}
          primaryTypographyProps={{
            variant: "body1",
            fontWeight: "medium",
          }}
          secondaryTypographyProps={{
            component: "div",
          }}
        />
      </ListItemButton>
    </ListItem>
  );
}
