import { Recipe } from "../../types/Recipe";

type RecipePageProps = {
    currentRecipe: Recipe; 
}

export function RecipePage(props: RecipePageProps) {
    return(
        <>
            <h1>{props.currentRecipe.title}</h1>
            <br/>
            <h2>{props.currentRecipe.ingredients}</h2>
            <br/>
            <h2>{props.currentRecipe.description}</h2>
        </>
    )
}