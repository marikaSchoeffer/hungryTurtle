import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import {
  Avatar,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { User, signInWithEmailAndPassword } from "firebase/auth";

import { primaryColor } from "../../style";
import { forgotPasswordRoute, overviewRoute } from "../routes";
import { auth } from "../../firebase";

type LoginPageProps = {
  setUser: (user: User | null) => void;
};

export function LoginPage(props: LoginPageProps) {
  const [userMail, setUserMail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isFormInvalid, setIsFormInvalid] = useState(false);

  const navigate = useNavigate();

  async function loginEmailPassword() {
    try {
      await signInWithEmailAndPassword(auth, userMail, userPassword);
      const user = auth.currentUser;
      props.setUser(user);
      return true;
    } catch (error) {
      return false;
    }
  }

  async function handleClickLogin() {
    let loginSuccessful = await loginEmailPassword();

    if (loginSuccessful) {
      navigate(overviewRoute);
    } else {
      setIsFormInvalid(true);
    }
  }

  function handleClickVisibility() {
    if (showPassword === true) {
      setShowPassword(false);
    } else {
      setShowPassword(true);
    }
  }

  function handleClickLinkForgotPassword() {
    navigate(forgotPasswordRoute);
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

          <Box display="flex" flexDirection="column" rowGap="20px" width="100%">
            <TextField
              error={isFormInvalid}
              type="email"
              label="E-Mail"
              variant="outlined"
              color="primary"
              value={userMail}
              onChange={(x) => setUserMail(x.target.value)}
            />

            <TextField
              error={isFormInvalid}
              label="Passwort"
              variant="outlined"
              color="primary"
              value={userPassword}
              onChange={(x) => setUserPassword(x.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleClickVisibility}>
                    {showPassword === false ? (
                      <Visibility />
                    ) : (
                      <VisibilityOff />
                    )}
                  </IconButton>
                ),
              }}
              type={showPassword === false ? "password" : "text"}
            />
            <Link
              to={forgotPasswordRoute}
              onClick={handleClickLinkForgotPassword}
              style={{
                color: "grey",
                textDecoration: "inherit",
              }}
            >
              <Typography variant="caption">Passwort vergessen?</Typography>
            </Link>
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            pb="10px"
          >
            {isFormInvalid === false ? (
              <Button
                color="primary"
                variant="outlined"
                style={{ borderColor: primaryColor }}
                onClick={handleClickLogin}
              >
                Login
              </Button>
            ) : (
              <Button
                color="error"
                variant="outlined"
                onClick={handleClickLogin}
              >
                Login
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
