import { useEffect, useState } from "react";
import { UserRecipeCard } from "../UserRecipeCard/UserRecipeCard";
import "./UserRecipes.css";
import { Pagination } from "../Pagination/Pagination";
import Spinner from "../Spinner/Spinner";
import { AddRecipeButton } from "../AddReciepeButton/AddRecipeButton";
import { DISPLAY_ITEMS_PER_PAGE, USER_ID } from "../../utils/utils";
import { getRecipes } from "../services/recipe";

export const UserRecipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState();
    

    let startIndex = (currentPage - 1) * DISPLAY_ITEMS_PER_PAGE;
    let endIndex = startIndex + DISPLAY_ITEMS_PER_PAGE;

    const recipesToShow = recipes.slice(startIndex, endIndex);

    useEffect(() => {

        const fetchRecipes = async () => {
            const recipes = await getRecipes(USER_ID);
            setRecipes(recipes);
            setTotalPages(Math.ceil(recipes.length / DISPLAY_ITEMS_PER_PAGE));
        }   
        fetchRecipes();
    }, []);

          
    return (
        <div className="user-recipes-container">
            <h2 className="user-recipes-title" style={{marginLeft: '0px'}}>List of recipes</h2>
            <div className="flex-space">
            <p>Click on delete button to delete a recipe.</p>
            <AddRecipeButton setRecipes={setRecipes} setTotalPages={setTotalPages}/>
            </div>
            <div className="user-recipes-list">
                {recipesToShow.length ? recipesToShow.map((recipe, index) => (
                    <UserRecipeCard key={index} recipe={recipe} setRecipes={setRecipes} setTotalPages={setTotalPages} />
                )) : <Spinner />}
            </div>
            <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </div>
    )
}