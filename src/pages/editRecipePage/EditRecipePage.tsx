import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { ExpandMore } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";

import { db, storage } from "../../firebase";
import { Recipe } from "../../types/Recipe";
import { overviewRoute, recipeRoute } from "../routes";
import { createGuid } from "../../lib/createGuid";

type EditRecipeProps = {
  currentRecipe: Recipe;
  setCurrentRecipe: (recipe: Recipe) => void;
};

export function EditRecipePage(props: EditRecipeProps) {
  const [recipeTitle, setRecipeTitle] = useState("");
  const [recipeDuration, setRecipeDuration] = useState("");
  const [recipeIngredients, setRecipeIngredients] = useState("");
  const [recipeDescription, setRecipeDescription] = useState("");
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [recipeCategories, setRecipeCategories] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (props.currentRecipe) {
      setRecipeTitle(props.currentRecipe.title);
      setRecipeDuration(props.currentRecipe.duration.toString());
      setRecipeIngredients(props.currentRecipe.ingredients);
      setRecipeDescription(props.currentRecipe.description);
      //setRecipeFilterCategories(props.currentRecipe.filterCategories);
    }
  }, [props.currentRecipe]);

  const navigate = useNavigate();

  async function handleClickEditRecipe() {
    let urlLink = "";
    setIsLoading(true);

    if (imageUpload !== null) {
      const imageRefName = createGuid();
      const imageRef = ref(storage, imageRefName);

      try {
        await uploadBytes(imageRef, imageUpload);
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
      imageURL: imageUpload !== null ? urlLink : props.currentRecipe.imageURL,
      userId: props.currentRecipe.userId,
      categories: recipeCategories,
    };

    const updateTarget = doc(db, "recipes", props.currentRecipe.id);
    await updateDoc(updateTarget, recipeObj);

    props.setCurrentRecipe(recipeObj);
    setImageUpload(null);
    setIsLoading(false);
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
      setImageUpload(file);
    }
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
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
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>Zutaten</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                multiline
                fullWidth
                value={recipeIngredients}
                onChange={(x) => setRecipeIngredients(x.target.value)}
              />
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>Beschreibung</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                multiline
                fullWidth
                value={recipeDescription}
                onChange={(x) => setRecipeDescription(x.target.value)}
              />
            </AccordionDetails>
          </Accordion>
        </Box>

        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          marginTop="10px"
        >
          {isLoading ? <CircularProgress color="primary" /> : null}
        </Box>

        <Box display="flex" justifyContent="end">
          <IconButton
            color="primary"
            onClick={handelClickOpenDeleteDialog}
            disabled={isLoading}
          >
            <DeleteIcon />
          </IconButton>

          <IconButton
            color="primary"
            onClick={handleClickEditRecipe}
            disabled={
              recipeTitle === "" ||
              recipeDuration === "" ||
              recipeIngredients === "" ||
              recipeDescription === "" ||
              isLoading
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
      </Card>
    </Box>
  );
}
