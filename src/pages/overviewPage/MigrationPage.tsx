import { Box, Button } from "@mui/material";

import { collection, doc, getDocs, query, updateDoc } from "firebase/firestore";

import { db } from "../../firebase";
import { Recipe } from "../../types/Recipe";

export function MigrationPage() {
  async function handleClickMigration() {
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
        favorite: doc.data().favorite,
      };
      recipes.push(recipe);
    });

    for (let i = 0; i < recipes.length; i++) {
      await updateDoc(doc(db, "recipes", recipes[i].id), {
        favorite: [],
      });
    }
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Button variant="contained" onClick={handleClickMigration}>
        Migration
      </Button>
    </Box>
  );
}
