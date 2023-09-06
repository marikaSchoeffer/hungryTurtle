import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Avatar,
  Box,
  Button,
  IconButton,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { sendPasswordResetEmail } from "firebase/auth";

import { StyledAlert, primaryColor } from "../../style";
import { auth } from "../../firebase";
import { loginRoute } from "../routes";

export function ForgotPasswordPage() {
  const [userMail, setUserMail] = useState("");
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  function handleClickCloseForgotPassword() {
    navigate(loginRoute);
  }

  function handleClose() {
    setOpen(false);
  }

  async function handleClickRestPassword() {
    try {
      await sendPasswordResetEmail(auth, userMail);
      //setOpen(true);
      navigate(loginRoute);
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
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          rowGap="30px"
        >
          <Box display="flex" width="100%" justifyContent="right">
            <IconButton
              color="primary"
              onClick={handleClickCloseForgotPassword}
            >
              <Close />
            </IconButton>
          </Box>

          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Avatar
              alt="A turtle with a baseball cap"
              src="./image/hungryTurtle.png"
              style={{
                width: "100px",
                height: "100px",
              }}
            />
            <Typography color={primaryColor} variant="h5">
              Hungry Turtle
            </Typography>
          </Box>

          <Box display="flex" flexDirection="column" width="100%">
            <TextField
              //error={isFormInvalid}
              type="email"
              label="E-Mail"
              variant="outlined"
              color="primary"
              value={userMail}
              onChange={(x) => setUserMail(x.target.value)}
            />
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            pb="10px"
          >
            <Button
              color="primary"
              variant="outlined"
              style={{ borderColor: primaryColor }}
              onClick={handleClickRestPassword}
            >
              Passwort zurücksetzen
            </Button>
            <Snackbar
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              key={"bottom" + "center"}
              open={open}
              autoHideDuration={2500}
              onClose={handleClose}
            >
              <StyledAlert
                severity="success"
                variant="outlined"
                icon={<TaskAltIcon color="primary" />}
              >
                Mail wurde versand
              </StyledAlert>
            </Snackbar>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
