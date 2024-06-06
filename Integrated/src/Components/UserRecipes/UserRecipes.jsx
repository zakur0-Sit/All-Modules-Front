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
    const [loading, setLoading] = useState(true);
    

    let startIndex = (currentPage - 1) * DISPLAY_ITEMS_PER_PAGE;
    let endIndex = startIndex + DISPLAY_ITEMS_PER_PAGE;


    useEffect(() => {

        const fetchRecipes = async () => {
            const recipes = await getRecipes(USER_ID);
            setRecipes(recipes);
            setTotalPages(Math.ceil(recipes.length / DISPLAY_ITEMS_PER_PAGE));
            setLoading(false);
        }   

        fetchRecipes();
    }, []);


    
    const recipesToShow = recipes.slice(startIndex, endIndex);

          
    return (
        <div className="user-recipes-container">
            <h2 className="user-recipes-title" style={{marginLeft: '0px'}}>List of recipes</h2>
                <div className="flex-space">
                <p className="my-recipes-info">Click on delete button to delete a recipe.</p>
                <AddRecipeButton setRecipes={setRecipes} setTotalPages={setTotalPages}/>
                </div>
                <div className="user-recipes-list">
                    {!loading ? (
                        recipesToShow.length > 0 ? (
                            recipesToShow.map((recipe, index) => (
                                <UserRecipeCard key={index} recipe={recipe} setRecipes={setRecipes} setTotalPages={setTotalPages} />
                            ))
                        ) : (
                            <p className="no-recipes-info">You do not have any recipes</p>
                        )
                    ) : (
                        <Spinner />
                    )}
                </div>
            <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </div>
    )
}