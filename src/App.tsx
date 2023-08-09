import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import { User } from "firebase/auth";

import { LoginPage } from "./pages/loginPage/LoginPage";
import { OverviewPage } from "./pages/overviewPage/OverviewPage";
import { CreateRecipePage } from "./pages/createRecipePage/CreateRecipePage";
import { RecipePage } from "./pages/recipePage/RecipePage";
import { Recipe } from "./types/Recipe";
import {
  createRecipeRoute,
  editRecipeRoute,
  loginRoute,
  overviewRoute,
  recipeRoute,
} from "./pages/routes";
import { EditRecipePage } from "./pages/editRecipePage/EditRecipePage";
import { PrivateRoutes } from "./PrivateRoutes";

let emptyRecipe: Recipe = {
  id: "",
  title: "",
  duration: 0,
  ingredients: "",
  description: "",
  deleted: false,
};

export function App() {
  const [currentRecipe, setCurrentRecipe] = useState<Recipe>(emptyRecipe);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [user, setUser] = useState<User | null>(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={loginRoute}
          element={<LoginPage /*user={user}*/ setUser={setUser} />}
        />
        <Route element={<PrivateRoutes user={user} />}>
          <Route
            path={overviewRoute}
            element={
              <OverviewPage
                recipes={recipes}
                setRecipes={setRecipes}
                currentRecipe={currentRecipe}
                setCurrentRecipe={setCurrentRecipe}
              />
            }
          />
          <Route
            path={recipeRoute}
            element={<RecipePage currentRecipe={currentRecipe} />}
          />
          <Route path={createRecipeRoute} element={<CreateRecipePage />} />
          <Route
            path={editRecipeRoute}
            element={
              <EditRecipePage
                currentRecipe={currentRecipe}
                setCurrentRecipe={setCurrentRecipe}
              />
            }
          />
        </Route>
        <Route path="*" element={<Navigate to={loginRoute} />} />
      </Routes>
    </BrowserRouter>
  );
}
