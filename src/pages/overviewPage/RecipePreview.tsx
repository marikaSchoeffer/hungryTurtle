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
    <Box>
      <Card style={{ width: "300px" }}>
        <CardMedia
          component="img"
          image="./image/hungryTurtle.png"
          height="100px"
        />

        <Typography variant="body1">
          <Link
            to={`${props.recipe.title.toLowerCase()}`}
            onClick={handleClickLink}
            style={{
              color: "grey",
              textDecoration: "inherit",
            }}
          >
            {props.recipe.title}
          </Link>
        </Typography>
      </Card>
    </Box>
  );
}
