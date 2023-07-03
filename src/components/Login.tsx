import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Avatar, Box, Button, Paper, TextField, Typography } from "@mui/material";
import { IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { primaryColor } from "../style";

export function Login() {

  const [userMail, setUserMail] = useState("");
  const [userPassword, setUserPassword] = useState(""); 
  const [showPassword, setShowPassword] = useState(false);
  const [isFormInvalid, setIsFormInvalid] = useState(false);

  const navigate = useNavigate(); 

  function handleClickLogin() {
    if(userMail === "anton.winschel@gmx.de" || userMail === "schoeffer.marika@yahoo.de") {
      if(userPassword === "schildi123") {
        navigate("/overview"); 
      }
      else{
        setIsFormInvalid(true);
      }
    }
    else{
      setIsFormInvalid(true);
    }
  }

  function handleClickVisibility() {
    if(showPassword === true) {
      setShowPassword(false);
    }
    else{
      setShowPassword(true);
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
          margin: "10px"
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
                width:"100px",
                height:"100px"
              }}
            />
            <Typography
              color = {primaryColor}
              variant="h5"
            >
              Hungry Turtle
            </Typography>
          </Box>

          <Box
            display="flex"
            flexDirection="column"
            rowGap="20px"
            width="100%"
          >
          
            <TextField
              error={isFormInvalid}
              type="email"
              label="E-Mail"
              variant="outlined"
              color="primary"
              value={userMail}
              onChange={x => setUserMail(x.target.value)}
            />

            <TextField
              error={isFormInvalid}
              label="Passwort"
              variant="outlined"
              color="primary"
              value={userPassword}
              onChange={x => setUserPassword(x.target.value)}
              InputProps={{
                endAdornment: 
                  <IconButton
                    onClick={handleClickVisibility}
                  >
                    { showPassword === false ? <Visibility/> : <VisibilityOff/>}
                  </IconButton>
              }}
              type={ showPassword === false ? "password" : "text"}
            /> 
          
          </Box>

          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            pb="10px"
          >
            { isFormInvalid === false ? 
              <Button 
                color="primary"
                variant="outlined"
                style={{ borderColor: primaryColor}}
                onClick={handleClickLogin}
              >
                Login
              </Button>
            : 
              <Button 
                color="error"
                variant="outlined"
                onClick={handleClickLogin}
              >
                Login
              </Button>
            }
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}
