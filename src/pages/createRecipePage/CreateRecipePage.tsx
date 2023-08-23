import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { TextField, Box, Paper, IconButton } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { doc, setDoc } from "firebase/firestore";

import { Recipe } from "../../types/Recipe";
import { overviewRoute } from "../routes";
import { createGuid } from "../../lib/createGuid";
import { db } from "../../firebase";
import { Close } from "@mui/icons-material";

export function CreateRecipePage() {
  const [recipeTitle, setRecipeTitle] = useState("");
  const [recipeDuration, setRecipeDuration] = useState("");
  const [recipeIngredients, setRecipeIngredients] = useState("");
  const [recipeDescription, setRecipeDescription] = useState("");

  const navigate = useNavigate();

  async function handleClickCreateRecipe() {
    let id = createGuid();

    let recipeObj: Recipe = {
      id: id,
      title: recipeTitle,
      duration: parseInt(recipeDuration),
      ingredients: recipeIngredients,
      description: recipeDescription,
      deleted: false,
    };

    await setDoc(doc(db, "recipes", id), recipeObj); //Write recipe to database

    setRecipeTitle("");
    setRecipeDuration("");
    setRecipeIngredients("");
    setRecipeDescription("");

    navigate(overviewRoute);
  }

  function handleClickCloseCreateRecipe() {
    navigate(overviewRoute);
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
        <Box display="flex" flexDirection="column" width="100%" rowGap="20px">
          <Box display="flex" width="100%" justifyContent="right">
            <IconButton color="primary" onClick={handleClickCloseCreateRecipe}>
              <Close />
            </IconButton>
          </Box>
          <TextField
            variant="outlined"
            label="Rezepttitel"
            value={recipeTitle}
            onChange={(x) => setRecipeTitle(x.target.value)}
          />

          <TextField
            type="text"
            variant="outlined"
            label="Dauer"
            placeholder="Minuten"
            value={recipeDuration}
            onChange={(x) =>
              setRecipeDuration(x.target.value.replace(/\D/g, ""))
            }
          />

          <TextField
            multiline
            label="Zutaten"
            value={recipeIngredients}
            onChange={(x) => setRecipeIngredients(x.target.value)}
          />

          <TextField
            multiline
            label="Rezeptbschreibung"
            value={recipeDescription}
            onChange={(x) => setRecipeDescription(x.target.value)}
          />
        </Box>

        <Box display="flex" justifyContent="end">
          <IconButton
            color="primary"
            onClick={handleClickCreateRecipe}
            disabled={
              recipeTitle === "" ||
              recipeDuration === "" ||
              recipeIngredients === "" ||
              recipeDescription === ""
            }
          >
            <CheckIcon />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
}
