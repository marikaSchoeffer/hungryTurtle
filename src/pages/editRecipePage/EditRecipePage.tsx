import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";

import { db, storage } from "../../firebase";
import { Recipe } from "../../types/Recipe";
import { overviewRoute, recipeRoute } from "../routes";
import { createGuid } from "../../lib/createGuid";

type EditRecipeProps = {
  currentRecipe: Recipe;
  setCurrentRecipe: (recipe: Recipe) => void;
  imageUpload: File | null;
  setImageUpload: (imageUpload: File | null) => void;
};

export function EditRecipePage(props: EditRecipeProps) {
  const [recipeTitle, setRecipeTitle] = useState(props.currentRecipe.title);
  const [recipeDuration, setRecipeDuration] = useState(
    props.currentRecipe.duration.toString()
  );
  const [recipeIngredients, setRecipeIngredients] = useState(
    props.currentRecipe.ingredients
  );
  const [recipeDescription, setRecipeDescription] = useState(
    props.currentRecipe.description
  );
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const navigate = useNavigate();

  async function handleClickEditRecipe() {
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

    let recipeObj: Recipe = {
      id: props.currentRecipe.id,
      title: recipeTitle,
      duration: parseInt(recipeDuration),
      ingredients: recipeIngredients,
      description: recipeDescription,
      deleted: false,
      imageURL:
        props.imageUpload !== null ? urlLink : props.currentRecipe.imageURL,
      userId: props.currentRecipe.userId,
    };

    const updateTarget = doc(db, "recipes", props.currentRecipe.id);
    await updateDoc(updateTarget, recipeObj);

    props.setCurrentRecipe(recipeObj);
    props.setImageUpload(null);
    navigate(recipeRoute);
  }

  async function handleClickDelete() {
    const updateTarget = doc(db, "recipes", props.currentRecipe.id);
    await updateDoc(updateTarget, {
      deleted: true,
    });
    navigate(overviewRoute);
  }

  function handelClickOpenDeleteDialog() {
    setOpenDeleteDialog(true);
  }

  function handleClickCloseDeleteDialog() {
    setOpenDeleteDialog(false);
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
          <IconButton color="primary" onClick={handelClickOpenDeleteDialog}>
            <DeleteIcon />
          </IconButton>

          <IconButton
            color="primary"
            onClick={handleClickEditRecipe}
            disabled={
              recipeTitle === "" ||
              recipeDuration === "" ||
              recipeIngredients === "" ||
              recipeDescription === ""
            }
          >
            <CheckIcon />
          </IconButton>

          <Dialog
            open={openDeleteDialog}
            onClose={handleClickCloseDeleteDialog}
          >
            <DialogContent>
              <Typography>Dieses Rezept endgültig löschen?</Typography>
            </DialogContent>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="center"
              gap="10px"
              paddingBottom="10px"
            >
              <Button onClick={handleClickDelete} variant="outlined">
                Ja
              </Button>
              <Button onClick={handleClickCloseDeleteDialog} variant="outlined">
                Nein
              </Button>
            </Box>
          </Dialog>
        </Box>
      </Paper>
    </Box>
  );
}
