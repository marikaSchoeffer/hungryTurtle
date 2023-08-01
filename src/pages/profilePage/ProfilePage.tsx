import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import CheckIcon from "@mui/icons-material/Check";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import AppsIcon from "@mui/icons-material/Apps";
import { User, signOut, updatePassword } from "firebase/auth";

import { auth } from "../../firebase";
import { primaryColor } from "../../style";
import { overviewRoute } from "../routes";

type ProfilePageProps = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export function ProfilePage(props: ProfilePageProps) {
  const [newPassword, setNewPassword] = useState("");
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [openPasswordInfoDialog, setOpenPasswordInfoDialog] = useState(false);

  const navigate = useNavigate();

  async function handleClickSignOut() {
    try {
      signOut(auth);
      props.setUser(null);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleClickSubmitNewPassword() {
    try {
      if (props.user !== null) {
        await updatePassword(props.user, newPassword);
        setNewPassword("");
        setOpenPasswordDialog(true);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function handleClickPasswordInformation() {
    setOpenPasswordInfoDialog(true);
  }

  function handleClickBackToOverview() {
    navigate(overviewRoute);
  }

  function handleClickClosePasswordDialog() {
    setOpenPasswordDialog(false);
  }

  function handleClickClosePasswordInfoDialog() {
    setOpenPasswordInfoDialog(false);
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
        <Box display="flex" flexDirection="column">
          <Box display="flex" justifyContent="space-between">
            <Typography variant="subtitle1">{props.user?.email}</Typography>
            <IconButton color="primary" onClick={handleClickSignOut}>
              <LogoutIcon />
            </IconButton>
          </Box>

          <Divider color={primaryColor} />

          <Box
            display="flex"
            justifyContent="space-between"
            paddingTop="10px"
            paddingBottom="10px"
          >
            <TextField
              variant="outlined"
              label="Passwort ändern"
              value={newPassword}
              onChange={(x) => setNewPassword(x.target.value)}
              InputProps={{
                endAdornment: (
                  <HelpOutlineIcon
                    fontSize="medium"
                    style={{ color: "grey" }}
                    onClick={handleClickPasswordInformation}
                  />
                ),
              }}
            />
            <IconButton
              color="primary"
              onClick={handleClickSubmitNewPassword}
              disabled={
                newPassword.search(
                  /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/
                ) === -1 //String.prototype.search() returns -1 no match was found.
              }
            >
              <CheckIcon />
            </IconButton>
          </Box>

          <Divider color={primaryColor} />
          <IconButton color="primary" onClick={handleClickBackToOverview}>
            <AppsIcon />
          </IconButton>
        </Box>

        <Dialog
          open={openPasswordDialog}
          onClose={handleClickClosePasswordDialog}
        >
          <DialogContent>
            <Typography>Passwort erfolgreich geändert.</Typography>
          </DialogContent>
          <IconButton onClick={handleClickClosePasswordDialog}>
            <CheckIcon />
          </IconButton>
        </Dialog>

        <Dialog
          open={openPasswordInfoDialog}
          onClose={handleClickClosePasswordInfoDialog}
        >
          <DialogContent>
            <Typography>
              Das Password muss mind. 8 Zeichen lang sein. Das Password darf
              max. 16 Zeichen lang sein. Das Password muss mind. einen
              Großbuchstaben, einen Kleinbuchstaben, eine Ziffer und ein
              Sonderzeichen beinhalten. Das Password darf keine Leerzeichen
              beinhalten.
            </Typography>
          </DialogContent>
          <IconButton onClick={handleClickClosePasswordInfoDialog}>
            <CheckIcon />
          </IconButton>
        </Dialog>
      </Paper>
    </Box>
  );
}
