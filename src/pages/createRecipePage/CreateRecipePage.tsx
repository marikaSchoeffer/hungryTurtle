import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { TextField, Box, Paper, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import CheckIcon from "@mui/icons-material/Check";
import { doc, setDoc } from "firebase/firestore";
import { User } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { Recipe } from "../../types/Recipe";
import { overviewRoute } from "../routes";
import { createGuid } from "../../lib/createGuid";
import { db, storage } from "../../firebase";

type CreateRecipePageProps = {
  user: User | null;
  imageUpload: File | null;
  setImageUpload: (imageUpload: File | null) => void;
};

export function CreateRecipePage(props: CreateRecipePageProps) {
  const [recipeTitle, setRecipeTitle] = useState("");
  const [recipeDuration, setRecipeDuration] = useState("");
  const [recipeIngredients, setRecipeIngredients] = useState("");
  const [recipeDescription, setRecipeDescription] = useState("");

  const navigate = useNavigate();

  async function handleClickCreateRecipe() {
    let urlLink = "";

    if (props.imageUpload !== null) {
      const imageRefName = createGuid();
      const imageRef = ref(storage, imageRefName);

      try {
        await uploadBytes(imageRef, props.imageUpload);
        urlLink = await getDownloadURL(ref(storage, imageRefName));
      } catch (error) {
        console.log(error);
      }
    }

    let id = createGuid();

    let recipeObj: Recipe = {
      id: id,
      title: recipeTitle,
      duration: parseInt(recipeDuration),
      ingredients: recipeIngredients,
      description: recipeDescription,
      deleted: false,
      imageURL: urlLink,
      userId: props.user?.uid,
    };

    await setDoc(doc(db, "recipes", id), recipeObj); //Write recipe to database

    setRecipeTitle("");
    setRecipeDuration("");
    setRecipeIngredients("");
    setRecipeDescription("");
    props.setImageUpload(null);

    navigate(overviewRoute);
  }

  function handleClickCloseCreateRecipe() {
    props.setImageUpload(null);
    navigate(overviewRoute);
  }

  function handleOnChangeFile(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files !== null) {
      let file = event.target.files[0];
      props.setImageUpload(file);
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
        <Box display="flex" flexDirection="column" width="100%" rowGap="20px">
          <Box display="flex" width="100%" justifyContent="right">
            <IconButton color="primary" onClick={handleClickCloseCreateRecipe}>
              <Close />
            </IconButton>
          </Box>
          <input type="file" accept="image/*" onChange={handleOnChangeFile} />
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
