import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Card,
  Typography,
  TextField,
  IconButton,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from "@mui/material";
import AppsIcon from "@mui/icons-material/Apps";
import EditIcon from "@mui/icons-material/Edit";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { ExpandMore } from "@mui/icons-material";

import { User } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";

import { db } from "../../firebase";
import { primaryColor } from "../../style";
import { Recipe } from "../../types/Recipe";
import { editRecipeRoute, overviewRoute } from "../routes";

type RecipePageProps = {
  currentRecipe: Recipe;
  setCurrentRecipe: (currentRecipe: Recipe) => void;
  user: User | null;
};

export function RecipePage(props: RecipePageProps) {
  const [recipeTitle, setRecipeTitle] = useState("");
  const [recipeDuration, setRecipeDuration] = useState("");
  const [recipeIngredients, setRecipeIngredients] = useState("");
  const [recipeDescription, setRecipeDescription] = useState("");

  useEffect(() => {
    if (props.currentRecipe) {
      setRecipeTitle(props.currentRecipe.title);
      setRecipeDuration(props.currentRecipe.duration.toString());
      setRecipeIngredients(props.currentRecipe.ingredients);
      setRecipeDescription(props.currentRecipe.description);
    }
  }, [props.currentRecipe]);

  const navigate = useNavigate();

  function handleClickEditRecipe() {
    navigate(editRecipeRoute);
  }

  function handleClickBackToOverview() {
    navigate(overviewRoute);
  }

  async function handleClickFav() {
    if (props.user === null || props.user.uid === undefined) {
      return;
    }

    let updateRecipe = structuredClone(props.currentRecipe);
    let updateArray = structuredClone(props.currentRecipe.favorite);

    if (updateArray.includes(props.user.uid)) {
      const index = updateArray.indexOf(props.user.uid);
      updateArray.splice(index, 1);
    } else {
      updateArray.push(props.user.uid);
    }

    const updateTarget = doc(db, "recipes", props.currentRecipe.id);
    await updateDoc(updateTarget, { favorite: updateArray });

    updateRecipe.favorite = updateArray;

    props.setCurrentRecipe(updateRecipe);
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      rowGap="20px"
    >
      <Card
        style={{
          width: "300px",
          paddingTop: "10px",
          paddingLeft: "10px",
          paddingRight: "10px",
          marginTop: "10px",
          marginBottom: "10px",
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
            {recipeTitle}
          </Typography>

          <img
            src={
              props.currentRecipe.imageURL === ""
                ? "../image/hungryTurtle.png"
                : props.currentRecipe.imageURL
            }
            alt={props.currentRecipe.title}
          />

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Dauer</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{recipeDuration} Minuten</Typography>
            </AccordionDetails>
          </Accordion>

          <Box display="flex" flexDirection="column">
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6">Zutaten</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  multiline
                  fullWidth
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
                  value={recipeIngredients}
                />
              </AccordionDetails>
            </Accordion>
          </Box>

          <Box display="flex" flexDirection="column">
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6">Beschreibung</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  multiline
                  fullWidth
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
                  value={recipeDescription}
                />
              </AccordionDetails>
            </Accordion>
          </Box>

          <Box display="flex" flexDirection="column">
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6">Kategorien</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  flexDirection="row"
                  columnGap="5px"
                  rowGap="5px"
                  flexWrap="wrap"
                >
                  {props.currentRecipe.categories.map((value, index) => (
                    <Chip
                      key={index}
                      label={value}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>

          <Divider color={primaryColor} />
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
          <IconButton color="primary" onClick={handleClickFav}>
            {!props.currentRecipe.favorite.includes(props.user!.uid!) ? (
              <FavoriteBorderIcon />
            ) : (
              <FavoriteIcon />
            )}
          </IconButton>
        </Box>
      </Card>
    </Box>
  );
}
