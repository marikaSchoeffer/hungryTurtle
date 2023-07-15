import { Box, Card, Typography, List, ListItem} from "@mui/material";
import { Recipe } from "../../types/Recipe";

type RecipePageProps = {
    currentRecipe: Recipe; 
}

export function RecipePage(props: RecipePageProps) {
    return(
        <Box
            display="flex"
            flexDirection="column"
            padding="20px"
            rowGap="20px"
        >
            <Card style={{maxWidth: "500px"}}>
                
                <Typography variant="h3">
                    {props.currentRecipe.title}
                </Typography>
                
                <Typography variant="h6">
                    Dauer: {props.currentRecipe.duration} Minuten
                </Typography>
                
                <Box 
                    display="flex"
                    flexDirection="column"

                >
                    <Typography variant="h6">Zutaten:</Typography>
                    
                    {props.currentRecipe.ingredients.split("\n").map((string, i) => {
                        return(
                            <List key={i} style={{ margin: 0, padding: 0 }}>
                                <ListItem>
                                    <Typography variant="body1">
                                        {string}
                                    </Typography>
                                </ListItem>
                            </List>
                        )})
                    }
                </Box>
                
                <Box
                    display="flex"
                    flexDirection="column"
                >
                    <Typography variant="h6">Beschreibung:</Typography>

                    {props.currentRecipe.description.split("\n").map((string,i) => {
                        return(
                            <List key={i} style={{ margin: 0, padding: 0 }}>
                                    <ListItem>
                                        <Typography variant="body1">
                                            {string}
                                        </Typography>
                                    </ListItem>
                                </List>
                        )})
                    }
                </Box>
            </Card>
        </Box>
    )
}