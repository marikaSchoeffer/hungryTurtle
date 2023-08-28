import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { Box, Chip, Pagination, Paper } from "@mui/material";
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
  const pageSize = 9; //Variable auslagern?

  const [pagination, setPagination] = useState({
    count: 0,
    from: 0,
    to: pageSize,
  });

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
    setPagination({ ...pagination, count: props.recipes.length });
  }, [pagination.from, pagination.to]);

  const navigate = useNavigate();

  function handleClickRecipeChip() {
    navigate(createRecipeRoute);
  }

  function handleClickProfileChip() {
    navigate(profileRoute);
  }

  function handleChangePage(event: any, page: any) {
    const from = (page - 1) * pageSize;
    const to = (page - 1) * pageSize + pageSize;

    setPagination({ ...pagination, from: from, to: to });
    console.log(pagination);
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      rowGap="10px"
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
        style={{
          overflow: "hidden",
          overflowY: "scroll",
        }}
      >
        <Paper
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
            padding: "10px",
            margin: "10px",
            borderRadius: "lg",
            boxShadow: "lg",
          }}
          elevation={4}
        >
          <Box
            display="flex"
            gap="25px"
            flexDirection="row"
            flexWrap="wrap"
            justifyContent="center"
          >
            {props.recipes
              .slice(pagination.from, pagination.to)
              .map((recipe, i) => {
                return (
                  <RecipePreview
                    key={i}
                    recipe={recipe}
                    setCurrentRecipe={props.setCurrentRecipe}
                  />
                );
              })}
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ padding: "5px" }}
          >
            <Pagination
              count={Math.ceil(pagination.count / pageSize)}
              variant="outlined"
              color="primary"
              onChange={handleChangePage}
            />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
