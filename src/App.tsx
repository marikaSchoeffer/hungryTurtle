import { useState } from "react";

import { Avatar, Box, Button, Input, Paper, TextField, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';

export function App() {
  const [userMail, setUserMail] = useState("");
  const [userPassword, setUserPassword] = useState(""); 

  const theme = createTheme({
    palette: {
      primary: {
      
        main: "#ec4c0c",
      }
    },
  });

  return (
    <Box
      display="flex"
      width="100%"
      justifyContent="center"
      alignItems="center"
    >
      <Paper>
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
            color="#ec4c0c"
            variant="h5"
          >
            Hungry Turtle
          </Typography>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
         >
          <TextField
            type="email"
            variant="outlined"
            size="small"
            style={{
              padding: "10px",
            }}
          >
            <Input 
              value={userMail}
              onChange={x => setUserMail(x.target.value)}
            />
          </TextField>

          <TextField
            type="password"
            variant="outlined"
            size="small"
            style={{
              padding: "10px"
            }}
          >
            <Input 
              value={userPassword}
              onChange={x => setUserPassword(x.target.value)}
            />
          </TextField>
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          pb="10px"
        >
          <ThemeProvider theme={theme}>
            <Button 
              color="primary"
              variant="outlined"
              style={{ borderColor: "#ec4c0c"}}
            >
              Login
            </Button>
          </ThemeProvider>
        </Box>
      </Paper>
    </Box>
  )
}

