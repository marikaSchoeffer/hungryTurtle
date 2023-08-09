import { Link } from "react-router-dom";
import { Box, Card, CardMedia, Typography } from "@mui/material";
import { Recipe } from "../../types/Recipe";

type RecipePreviewProps = {
  recipe: Recipe;
  setCurrentRecipe: (recipe: Recipe) => void;
};

export function RecipePreview(props: RecipePreviewProps) {
  function handleClickLink() {
    let currentRecipe = props.recipe;
    props.setCurrentRecipe(currentRecipe);
  }

  return (
    <Box style={{ padding: "5px" }}>
      <Link
        to={`${props.recipe.id}`}
        onClick={handleClickLink}
        style={{
          color: "grey",
          textDecoration: "inherit",
        }}
      >
        <Card style={{ width: "300px" }}>
          <CardMedia
            component="img"
            image="./image/hungryTurtle.png"
            height="100px"
          />
          <Typography variant="body1">{props.recipe.title}</Typography>
        </Card>
      </Link>
    </Box>
  );
}
