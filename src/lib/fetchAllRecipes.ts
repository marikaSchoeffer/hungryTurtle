import { collection, getDocs, query, where } from "firebase/firestore";

import { db } from "../firebase";
import { Recipe } from "../types/Recipe";

export async function fetchAllRecipes(
  pagination: {
    count: number;
    from: number;
    to: number;
  },
  setPagination: (pagination: {
    count: number;
    from: number;
    to: number;
  }) => void,
  setRecipes: (recipes: Recipe[]) => void
) {
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
      imageURL: doc.data().imageURL,
      userId: doc.data().userId,
      categories: doc.data().categories,
    };
    recipes.push(recipe);
    setPagination({ ...pagination, count: recipes.length });
  });
  setRecipes(recipes);
}
