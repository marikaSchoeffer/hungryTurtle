import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { Box, /*Button,*/ Chip, Pagination, Paper } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Category } from "@mui/icons-material";

import {
  collection,
  //doc,
  getDocs,
  query,
  //updateDoc,
  where,
} from "firebase/firestore";

import { RecipePreview } from "./RecipePreview";
import { Recipe } from "../../types/Recipe";
import { createRecipeRoute, profileRoute } from "../routes";
import { db } from "../../firebase";
import { pageSize } from "../../style";
import { categories } from "../../types/Categories";
import { fetchAllRecipes } from "../../lib/fetchAllRecipes";

type OverviewPageProps = {
  recipes: Recipe[];
  setRecipes: (recipe: Recipe[]) => void;
  currentRecipe: Recipe | null;
  setCurrentRecipe: (currentRecipe: Recipe) => void;
};

export function OverviewPage(props: OverviewPageProps) {
  const [pagination, setPagination] = useState({
    count: 0,
    from: 0,
    to: pageSize,
  });
  const [filterActive, setFilterActive] = useState<boolean[]>(
    new Array(categories.length).fill(false)
  );
  const [areCategoriesVisible, setAreCategoriesVisible] = useState(false);

  useEffect(() => {
    fetchAllRecipes(pagination, setPagination, props.setRecipes);
  }, []);

  const navigate = useNavigate();

  function handleClickRecipeChip() {
    navigate(createRecipeRoute);
  }

  function handleClickProfileChip() {
    navigate(profileRoute);
  }

  function handleChangePage(page: number) {
    const from = (page - 1) * pageSize;
    const to = (page - 1) * pageSize + pageSize;

    setPagination({ ...pagination, from: from, to: to });
  }

  function showFilterOptions() {
    setAreCategoriesVisible(areCategoriesVisible ? false : true);
  }

  async function handleClickFilter(filter: string, index: number) {
    if (filterActive[index] === false) {
      setFilterActive(
        filterActive.map((value, _index) => (_index === index ? !value : false))
      );

      const q = query(
        collection(db, "recipes"),
        where("categories", "array-contains", filter)
      );
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
          imageURL: doc.data().imageURL,
          userId: doc.data().userId,
          categories: doc.data().categories,
        };
        recipes.push(recipe);
        setPagination({ ...pagination, count: recipes.length });
      });
      props.setRecipes(recipes);
    } else {
      setFilterActive(
        filterActive.map((value, _index) => (_index === index ? !value : value))
      );

      fetchAllRecipes(pagination, setPagination, props.setRecipes);
    }
  }

  /*async function handleClickMigration() {
    const q = query(collection(db, "recipes"));
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
        imageURL: doc.data().imageURL,
        userId: doc.data().userId,
        categories: doc.data().categories,
      };
      recipes.push(recipe);
    });

    for(let i = 0; i < recipes.length; i++) {
      await updateDoc(doc(db, "recipes", recipes[i].id), {
        categories: [],
      });
    }
  }*/

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      rowGap="10px"
      paddingTop="20px"
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="row"
        flexWrap="wrap"
        width="100%"
      >
        <Paper
          style={{
            display: "flex",
            flexDirection: "column",
            width: "1020px",
            minHeight: "500px",
            gap: 2,
            padding: "10px",
            margin: "10px",
            borderRadius: "lg",
            boxShadow: "lg",
          }}
          elevation={4}
        >
          <Box
            display="flex"
            flexWrap="wrap"
            rowGap="5px"
            columnGap="5px"
            marginLeft="25px"
            marginRight="25px"
          >
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

            <Chip
              icon={<Category />}
              label="Kategorien"
              color="primary"
              variant="outlined"
              onClick={showFilterOptions}
            />

            {areCategoriesVisible
              ? categories.map((value, index) => (
                  <Chip
                    key={index}
                    label={value}
                    color="primary"
                    variant={filterActive[index] ? "filled" : "outlined"}
                    onClick={() => handleClickFilter(value, index)}
                  />
                ))
              : null}
          </Box>

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
          {/*
          <Box display="flex" justifyContent="center" alignItems="center">
            <Button variant="contained" onClick={handleClickMigration}>
              Migration
            </Button>
          </Box>
            */}
          <Box
            display="flex"
            justifyContent="center"
            marginTop="auto"
            sx={{ padding: "5px" }}
          >
            <Pagination
              count={Math.ceil(pagination.count / pageSize)}
              variant="outlined"
              color="primary"
              onChange={(_, page) => handleChangePage(page)}
            />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
