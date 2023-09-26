import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { TextField, Box, IconButton, Card } from "@mui/material";
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
};

export function CreateRecipePage(props: CreateRecipePageProps) {
  const [recipeTitle, setRecipeTitle] = useState("");
  const [recipeDuration, setRecipeDuration] = useState("");
  const [recipeIngredients, setRecipeIngredients] = useState("");
  const [recipeDescription, setRecipeDescription] = useState("");
  const [imageUpload, setImageUpload] = useState<File | null>(null);

  const navigate = useNavigate();

  async function handleClickCreateRecipe() {
    let urlLink = "";

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
    };

    await setDoc(doc(db, "recipes", id), recipeObj); //Write recipe to database

    setRecipeTitle("");
    setRecipeDuration("");
    setRecipeIngredients("");
    setRecipeDescription("");
    setImageUpload(null);

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
      </Card>
    </Box>
  );
}
