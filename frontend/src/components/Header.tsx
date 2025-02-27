import { useMemo } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

interface HeaderProps {
  username: string;
}

// Using styled API for custom styling
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  boxShadow: "none",
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export default function Header({ username }: HeaderProps) {
  // Using useMemo to memoize the welcome text
  const welcomeText = useMemo(() => `Welcome ${username}`, [username]);

  return (
    <StyledAppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {welcomeText}
        </Typography>
        <Button variant="contained" color="primary" sx={{ borderRadius: 1 }}>
          Logout
        </Button>
      </Toolbar>
    </StyledAppBar>
  );
}
