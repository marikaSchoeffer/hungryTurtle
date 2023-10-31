import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  TextField,
  Box,
  IconButton,
  Card,
  CircularProgress,
  List,
  ListItem,
  Checkbox,
  ListItemText,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
} from "@mui/material";
import { Close, ExpandMore } from "@mui/icons-material";
import CheckIcon from "@mui/icons-material/Check";
import { doc, setDoc } from "firebase/firestore";
import { User } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { Recipe } from "../../types/Recipe";
import { overviewRoute } from "../routes";
import { createGuid } from "../../lib/createGuid";
import { db, storage } from "../../firebase";
import { categories } from "../../types/Categories";

type CreateRecipePageProps = {
  user: User | null;
};

export function CreateRecipePage(props: CreateRecipePageProps) {
  const [recipeTitle, setRecipeTitle] = useState("");
  const [recipeDuration, setRecipeDuration] = useState("");
  const [recipeIngredients, setRecipeIngredients] = useState("");
  const [recipeDescription, setRecipeDescription] = useState("");
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [recipeCategories, setRecipeCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [checked, setChecked] = useState<boolean[]>(
    new Array(categories.length).fill(false)
  );

  const navigate = useNavigate();

  async function handleClickCreateRecipe() {
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

    let id = createGuid();

    let recipeObj: Recipe = {
      id: id,
      title: recipeTitle,
      duration: parseInt(recipeDuration),
      ingredients: recipeIngredients,
      description: recipeDescription,
      deleted: false,
      imageURL: urlLink,
      userId: props.user !== null ? props.user.uid : "",
      categories: recipeCategories,
    };

    await setDoc(doc(db, "recipes", id), recipeObj); //Write recipe to database

    setRecipeTitle("");
    setRecipeDuration("");
    setRecipeIngredients("");
    setRecipeDescription("");
    setImageUpload(null);
    setRecipeCategories([]);
    setIsLoading(false);

    navigate(overviewRoute);
  }

  function handleClickCloseCreateRecipe() {
    setImageUpload(null);
    navigate(overviewRoute);
  }

  function handleOnChangeFile(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files !== null) {
      let file = event.target.files[0];
      setImageUpload(file);
    }
  }

  function handleToggle(value: string, position: number) {
    //let cloneFilterCategories: string[] = structuredClone(recipeCategories);
    //cloneFilterCategories.push(value);
    //setRecipeCategories(cloneFilterCategories);

    const updatedChecked = checked.map((element, index) =>
      index === position ? !element : element
    );
    setChecked(updatedChecked);

    let cloneFilterCategories: string[] = structuredClone(recipeCategories);

    if (updatedChecked[position] === true) {
      cloneFilterCategories.push(value);
    } else {
      cloneFilterCategories = cloneFilterCategories.filter(
        (word) => word !== value
      );
    }
    setRecipeCategories(cloneFilterCategories);
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
        <Box display="flex" flexDirection="column" width="100%" rowGap="10px">
          <Box display="flex" width="100%" justifyContent="right">
            <IconButton
              color="primary"
              onClick={handleClickCloseCreateRecipe}
              disabled={isLoading}
            >
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
                        onChange={() => handleToggle(value, index)}
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
            onClick={handleClickCreateRecipe}
            disabled={
              recipeTitle === "" ||
              recipeDuration === "" ||
              recipeIngredients === "" ||
              recipeDescription === "" ||
              recipeCategories.length === 0 ||
              isLoading
            }
          >
            <CheckIcon />
          </IconButton>
        </Box>
      </Card>
    </Box>
  );
}
