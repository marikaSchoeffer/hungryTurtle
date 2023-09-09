import { useNavigate } from "react-router-dom";

import {
  Box,
  Card,
  Typography,
  TextField,
  IconButton,
  Divider,
} from "@mui/material";
import AppsIcon from "@mui/icons-material/Apps";
import EditIcon from "@mui/icons-material/Edit";
import { User } from "firebase/auth";

import { primaryColor } from "../../style";
import { Recipe } from "../../types/Recipe";
import { editRecipeRoute, overviewRoute } from "../routes";

type RecipePageProps = {
  currentRecipe: Recipe;
  user: User | null;
};

export function RecipePage(props: RecipePageProps) {
  const navigate = useNavigate();

  function handleClickEditRecipe() {
    navigate(editRecipeRoute);
  }

  function handleClickBackToOverview() {
    navigate(overviewRoute);
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      paddingTop="20px"
      rowGap="20px"
    >
      <Card
        style={{
          width: "300px",
          paddingTop: "10px",
          paddingLeft: "10px",
          paddingRight: "10px",
        }}
      >
        <Box display="flex" flexDirection="column" rowGap="20px">
          <Typography
            variant="h6"
            style={{
              wordWrap: "break-word",
              fontWeight: "bold",
            }}
          >
            {props.currentRecipe.title}
          </Typography>

          <img
            src={
              props.currentRecipe.imageURL === ""
                ? "../image/hungryTurtle.png"
                : props.currentRecipe.imageURL
            }
            alt={props.currentRecipe.title}
          />

          <Typography variant="h6">
            Dauer: {props.currentRecipe.duration} Minuten
          </Typography>

          <Box display="flex" flexDirection="column">
            <Typography variant="h6">Zutaten:</Typography>

            <TextField
              multiline
              InputProps={{
                readOnly: true,
                style: {
                  paddingTop: "0px",
                  paddingBottom: "5px",
                },
              }}
              sx={{
                border: "none",
                "& fieldset": { border: "none" },
              }}
              value={props.currentRecipe.ingredients}
            />
          </Box>

          <Box display="flex" flexDirection="column">
            <Typography variant="h6">Beschreibung:</Typography>
            <TextField
              multiline
              InputProps={{
                readOnly: true,
                style: {
                  paddingTop: "0px",
                  paddingBottom: "5px",
                },
              }}
              sx={{
                border: "none",
                "& fieldset": { border: "none" },
              }}
              value={props.currentRecipe.description}
            />
            <Divider color={primaryColor} />
          </Box>
        </Box>
        <Box display="flex" justifyContent="center">
          <IconButton
            disabled={props.currentRecipe.userId !== props.user?.uid}
            color="primary"
            onClick={handleClickEditRecipe}
          >
            <EditIcon />
          </IconButton>

          <IconButton color="primary" onClick={handleClickBackToOverview}>
            <AppsIcon />
          </IconButton>
        </Box>
      </Card>
    </Box>
  );
}
