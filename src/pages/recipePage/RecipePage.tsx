import { Box, Card, Typography, TextField} from "@mui/material";
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
                    
                    <TextField
                        multiline
                        InputProps={{
                            readOnly: true,
                        }}
                        value={props.currentRecipe.ingredients}
                    />
                </Box>
                
                <Box
                    display="flex"
                    flexDirection="column"
                >
                    <Typography variant="h6">Beschreibung:</Typography>
                    <TextField
                        multiline
                        InputProps={{
                            readOnly: true,
                        }}
                        value={props.currentRecipe.description}
                    />
                    
                </Box>
            </Card>
        </Box>
    )
}