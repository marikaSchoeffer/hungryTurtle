import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useState } from "react";

import { LoginPage } from "./pages/loginPage/LoginPage";
import { OverviewPage } from "./pages/overviewPage/OverviewPage";
import { CreateRecipePage } from "./pages/createRecipePage/CreateRecipePage";
import { RecipePage } from "./pages/recipePage/RecipePage";
import { Recipe } from "./types/Recipe";
import { createRecipeRoute, loginRoute, overviewRoute, recipeRoute } from "./pages/routes";

let emptyRecipe: Recipe = {
  title: "",
  duration: "",
  ingredients: "",
  description: ""
}

export function App() {
  const [currentRecipe, setCurrentRecipe] = useState<Recipe>(emptyRecipe); 
  const [recipes, setRecipes] = useState<Recipe[]>([]);
 
  return (
    <BrowserRouter>
      <Routes>
        <Route path={loginRoute} element={<LoginPage/>}/>
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
        <Route path={recipeRoute} element={<RecipePage currentRecipe={currentRecipe}/>}/>
        <Route 
          path={createRecipeRoute}
          element={
            <CreateRecipePage
              recipes={recipes}
              setRecipes={setRecipes}
            />
          }
        />
        <Route path="*" element={<Navigate to={loginRoute}/>}/>
      </Routes>
    </BrowserRouter>
  )
}

