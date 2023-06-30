import { useState } from "react";

import { Avatar, Box, Button, Paper, TextField, Typography } from "@mui/material";
import { primaryColor } from "./style";

export function App() {
  const [userMail, setUserMail] = useState("");
  const [userPassword, setUserPassword] = useState(""); 

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
              type="email"
              label="E-Mail"
              variant="outlined"
              color="primary"
              value={userMail}
              onChange={x => setUserMail(x.target.value)}
            />

            <TextField
              type="password"
              label="Passwort"
              variant="outlined"
              color="primary"
              value={userPassword}
              onChange={x => setUserPassword(x.target.value)}
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
              style={{ borderColor: primaryColor}}
            >
              Login
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}

