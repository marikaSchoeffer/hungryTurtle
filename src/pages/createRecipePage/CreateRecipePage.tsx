import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { TextField, Box, Paper, IconButton} from "@mui/material"
import CheckIcon from '@mui/icons-material/Check';
import { Recipe } from "../../types/Recipe";
import { overviewRoute } from "../routes";

type CreateRecipePageProps = {
    recipes: Recipe[]; 
    setRecipes: (recipe: Recipe[]) => void; 
}


export function CreateRecipePage(props: CreateRecipePageProps) {
    const [recipeTitle, setRecipeTitle] = useState(""); 
    const [recipeDuration, setRecipeDuration] = useState(""); 
    const [recipeIngredients, setRecipeIngredients] = useState("");
    const [recipeDescription, setRecipeDescription] = useState(""); 

    const navigate = useNavigate();

    function handleClickCreateRecipe() {
        let title = structuredClone(recipeTitle);
        let duration = structuredClone(recipeDuration);
        let ingredients = structuredClone(recipeIngredients)
        let description = structuredClone(recipeDescription)
        let array = structuredClone(props.recipes);

        let recipeObj: Recipe = {
            title: title,
            duration: duration,
            ingredients: ingredients,
            description: description,
        }

        array.push(recipeObj); 
        props.setRecipes(array); 

        setRecipeTitle("");
        setRecipeDuration("");
        setRecipeIngredients("");
        setRecipeDescription("");

        navigate(overviewRoute); 
    }

    return(
    <Box
        display="flex"
        width="100%"
        height="100%"
        justifyContent="center"
        alignItems="center"
    >
        <Paper 
            style={{
            width: "500px", 
            padding: "10px",
            margin: "10px"
            }}
            elevation={4}
        >
            <Box
                display="flex"
                flexDirection="column"
                width="100%"
                rowGap="20px"
            >
                <TextField
                    variant="outlined"
                    label="Rezepttitel"
                    value={recipeTitle}
                    onChange={x => setRecipeTitle(x.target.value)}
                />

                <TextField
                    type="text"
                    variant="outlined"
                    label="Dauer"
                    placeholder="Minuten"
                    value={recipeDuration}
                    onChange={x => setRecipeDuration(x.target.value.replace(/\D/g, ""))}
                />

                <TextField
                    multiline
                    label="Zutaten"
                    value={recipeIngredients}
                    onChange={x => setRecipeIngredients(x.target.value)}
                />

                <TextField
                    multiline
                    label="Rezeptbschreibung"
                    value={recipeDescription}
                    onChange={x => setRecipeDescription(x.target.value)}
                />
            </Box>

            <Box
                display="flex"
                justifyContent="end"
            >
                
                <IconButton 
                    color="primary"
                    onClick={handleClickCreateRecipe}
                    disabled={recipeTitle === "" || recipeDuration === "" || recipeIngredients === "" || recipeDescription === ""}
                >
                    <CheckIcon />
                </IconButton>

                    
            </Box>
        </Paper>
    </Box>
    )
}