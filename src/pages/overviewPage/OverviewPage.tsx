import { useNavigate } from "react-router-dom";

import { Box, Chip } from "@mui/material"
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { RecipePreview } from "./RecipePreview";
import { Recipe } from "../../types/Recipe";
import { createRecipeRoute } from "../routes";

type OverviewPageProps = {
    recipes: Recipe[]; 
    setRecipes: (recipe: Recipe[]) => void; 
    currentRecipe: Recipe | null; 
    setCurrentRecipe: (currentRecipe: Recipe) => void; 
}

export function OverviewPage(props: OverviewPageProps) {
    const navigate = useNavigate();

    function handleClickRecipeChip() {
        navigate(createRecipeRoute); 
    }

    return(
        <Box
            display="flex"
            flexDirection="column"
            width="100%"
            height="100%"
            justifyContent="center"
            alignItems="center"
            rowGap="20px"
        >
            <Chip icon={<AddCircleIcon/>} label="Rezept" color="primary" variant="outlined" onClick={handleClickRecipeChip}/>

            {
                props.recipes.map((recipe,i) => {
                    return(
                        <RecipePreview
                            key={i}
                            recipe={recipe}
                            setCurrentRecipe={props.setCurrentRecipe}
                        />
                    )
                })
            }
        </Box>
    )
}