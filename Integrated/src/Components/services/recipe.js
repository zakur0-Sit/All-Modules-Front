export const getRecipes = async (userId) => {
    const response = await fetch('http://localhost:5000/api/v1/recipes/getAllRecipesByUserId/' + userId);
    const recipes = await response.json();
    return recipes;
}

export const deleteRecipe = async (recipeId) => {
    const URL = 'http://localhost:5000/api/v1/recipes/deleteRecipe/' + recipeId;
    try {
        const response = await fetch(URL, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (response.ok) {
            return { success: true, message: `Recipe with ID ${recipeId} has been deleted.` };

        } else {
            return { success: false, message: `Failed to delete recipe with ID ${recipeId}. Status: ${response.status}` };
        }
    } catch (error) {
        return { success: false, message: `Error occurred while deleting recipe with ID ${recipeId}: ${error.message}` };
    }
}