import { Box, IconButton, Paper } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { User, signOut } from "firebase/auth";

import { auth } from "../../firebase";

type ProfilePageProps = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export function ProfilePage(props: ProfilePageProps) {
  async function handleClickSignOut() {
    try {
      signOut(auth);
      props.setUser(null);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Box
      display="flex"
      width="100%"
      height="100%"
      justifyContent="center"
      alignItems="center"
    >
      <Paper
        style={{
          width: "500px",
          padding: "10px",
          margin: "10px",
        }}
        elevation={4}
      >
        <IconButton color="primary" onClick={handleClickSignOut}>
          <LogoutIcon />
        </IconButton>
      </Paper>
    </Box>
  );
}
