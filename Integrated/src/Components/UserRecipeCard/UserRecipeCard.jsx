import React, { useState, useEffect } from 'react';
import './UserRecipeCard.css';
import { FaTrash } from 'react-icons/fa';
import { ConfirmationModal } from '../ConfirmationModal/ConfirmationModal';
import { deleteRecipe, getRecipes } from '../services/recipe';
import { DISPLAY_ITEMS_PER_PAGE, USER_ID } from '../../utils/utils';
import { fetchImage } from '../../pexelsApi';

export const UserRecipeCard = ({ recipe, setTotalPages, setRecipes }) => {
    const [imageSrc, setImageSrc] = useState(null);
    const {recipeId, recipeTitle} = recipe;
    const [loadingDeleteButton, setLoadingDeleteButton] = useState(false);
    const [deleteError, setDeleteError] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [isDeleteModalOpen, setIsDeleteOpenModal] = useState(false);



    useEffect(() => {
        if(recipe)
            if (recipe && recipe.imageList && recipe.imageList.length > 0) {
            setImageSrc(recipe.imageList[0]);
            } else {
            fetchImage(recipe.recipeTitle.includes("recipe") ? recipe.recipeTitle : recipe.recipeTitle + ' recipe')
                .then((url) => {
                setImageSrc(url);
                });
            }
      }, []);





    const deleteFunction = async (recipeId) => {
        setLoadingDeleteButton(true);
        const response = await deleteRecipe(recipeId);
        if(response.success){
            const recipes = await getRecipes(USER_ID);
            setRecipes(recipes);
            setTotalPages(Math.ceil(recipes.length / DISPLAY_ITEMS_PER_PAGE));
            setSuccessMessage(response.message);
            setTimeout(() => {
                setIsDeleteOpenModal(false);
            })
            
        }
        else{
            setDeleteError(true);
        }
    }

    return (
        <div className="recipe-card">
            <div className="recipe-image">
                <img src={imageSrc} alt="Poza retetei" />
            </div>
            <div className="recipe-details">
                <h2>{recipe.recipeTitle.length > 30 ? `${recipe.recipeTitle.substring(0, 50)}...` : recipe.recipeTitle}</h2>
                <p className="recipe-description">
                    {recipe.description.length > 80 ? `${recipe.description.substring(0, 100)}...` : recipe.description}
                </p>
                <div className="recipe-actions">
                    <button className="delete-button" onClick={() => setIsDeleteOpenModal(true)}>
                        <FaTrash />
                    </button>
                </div>
            </div>
            {
                isDeleteModalOpen ? <ConfirmationModal successMessage={successMessage} error={deleteError} loadingButton={loadingDeleteButton} setIsLoadingButton={setLoadingDeleteButton} isOpen={isDeleteModalOpen} saveActionElementId={recipeId} setIsModalOpen={setIsDeleteOpenModal} actionFunction={deleteFunction} elementDisplayed={recipeTitle} cancelFunction={() => setIsDeleteOpenModal(false)} /> : <></>
            }
        </div>
    );
};

export default UserRecipeCard;
