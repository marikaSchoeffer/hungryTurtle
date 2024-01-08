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
  List,
  ListItem,
  Checkbox,
  ListItemText,
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
import { categories } from "../../types/Categories";
import { Canvas } from "../canvasPage/Canvas";

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
  const [thumbnail, setThumbnail] = useState<Blob | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [checked, setChecked] = useState<boolean[]>(
    new Array(categories.length).fill(false)
  );

  useEffect(() => {
    if (props.currentRecipe) {
      setRecipeTitle(props.currentRecipe.title);
      setRecipeDuration(props.currentRecipe.duration.toString());
      setRecipeIngredients(props.currentRecipe.ingredients);
      setRecipeDescription(props.currentRecipe.description);
      setCheckedState();
    }
  }, [props.currentRecipe]);

  const navigate = useNavigate();
  let areCategoriesSelected: boolean | undefined = checked.find(
    (element) => element === true
  );

  async function handleClickEditRecipe() {
    let urlLink = "";
    let urlLinkThumbnail = "";
    let recipeCategories: string[] = [];

    setIsLoading(true);

    if (imageUpload !== null && thumbnail !== null) {
      const imageRefName = createGuid();
      const imageRef = ref(storage, imageRefName);

      const thumbnailRefName = createGuid();
      const thumbnailRef = ref(storage, thumbnailRefName);

      try {
        await uploadBytes(imageRef, imageUpload);
        urlLink = await getDownloadURL(ref(storage, imageRefName));

        await uploadBytes(thumbnailRef, thumbnail);
        urlLinkThumbnail = await getDownloadURL(ref(storage, thumbnailRefName));
      } catch (error) {
        console.log(error);
      }
    }

    for (let i = 0; i < checked.length; i++) {
      if (checked[i] === true) {
        recipeCategories.push(categories[i]);
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
      thumbnailURL:
        thumbnail !== null
          ? urlLinkThumbnail
          : props.currentRecipe.thumbnailURL,
      userId: props.currentRecipe.userId,
      categories: recipeCategories,
      favorite: props.currentRecipe.favorite,
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

  function handleSelectCategories(position: number) {
    const updatedChecked = checked.map((element, index) =>
      index === position ? !element : element
    );
    setChecked(updatedChecked);
  }

  function setCheckedState() {
    let updatedChecked = new Array(categories.length).fill(false);

    /*for (let i = 0; i < props.currentRecipe.categories.length; i++) {
      for (let j = 0; j < categories.length; j++) {
        if (props.currentRecipe.categories[i] === categories[j]) {
          updatedChecked[j] = true;
        }
      }
    }*/
    for (let i = 0; i < categories.length; i++) {
      if (props.currentRecipe.categories.includes(categories[i])) {
        updatedChecked[i] = true;
      }
    }
    setChecked(updatedChecked);
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

          {imageUpload !== null ? (
            <Canvas
              width={300}
              height={400}
              imageUpload={imageUpload}
              setThumbnail={setThumbnail}
            />
          ) : null}

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
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>Kategorien</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {categories.map((value, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <Checkbox
                        edge="end"
                        onChange={() => handleSelectCategories(index)}
                        checked={checked[index]}
                      />
                    }
                    disablePadding
                  >
                    <ListItemText>{value}</ListItemText>
                  </ListItem>
                ))}
              </List>
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
              areCategoriesSelected === undefined ||
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
