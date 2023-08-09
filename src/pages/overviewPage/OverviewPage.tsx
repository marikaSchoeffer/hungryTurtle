import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { Box, Chip } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { collection, getDocs, query, where } from "firebase/firestore";

import { RecipePreview } from "./RecipePreview";
import { Recipe } from "../../types/Recipe";
import { createRecipeRoute, profileRoute } from "../routes";
import { db } from "../../firebase";

type OverviewPageProps = {
  recipes: Recipe[];
  setRecipes: (recipe: Recipe[]) => void;
  currentRecipe: Recipe | null;
  setCurrentRecipe: (currentRecipe: Recipe) => void;
};

export function OverviewPage(props: OverviewPageProps) {
  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, "recipes"), where("deleted", "==", false));
      const result = await getDocs(q);
      let recipes: Recipe[] = [];

      result.forEach((doc) => {
        let recipe: Recipe = {
          id: doc.data().id,
          title: doc.data().title,
          duration: doc.data().duration,
          ingredients: doc.data().ingredients,
          description: doc.data().description,
          deleted: doc.data().deleted,
        };
        recipes.push(recipe);
      });
      props.setRecipes(recipes);
    };
    fetchData();
  }, []);

  const navigate = useNavigate();

  function handleClickRecipeChip() {
    navigate(createRecipeRoute);
  }

  function handleClickProfileChip() {
    navigate(profileRoute);
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      rowGap="20px"
      paddingTop="20px"
    >
      <Box display="flex" justifyContent="space-evenly" gap="10px">
        <Chip
          icon={<AddCircleIcon />}
          label="Rezept"
          color="primary"
          variant="outlined"
          onClick={handleClickRecipeChip}
        />
        <Chip
          icon={<AccountCircleIcon />}
          label="Profil"
          color="primary"
          variant="outlined"
          onClick={handleClickProfileChip}
        />
      </Box>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="row"
        flexWrap="wrap"
        gap="20px"
      >
        {props.recipes.map((recipe, i) => {
          return (
            <RecipePreview
              key={i}
              recipe={recipe}
              setCurrentRecipe={props.setCurrentRecipe}
            />
          );
        })}
      </Box>
    </Box>
  );
}
