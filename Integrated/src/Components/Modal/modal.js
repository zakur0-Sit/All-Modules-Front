import React, {useEffect, useState} from "react";
import "./modal.css";
import {fetchImage} from '../../pexelsApi.tsx';

export default function Modal({ recipe, toggleModal, img, AI }) {
    console.log('Modal rendered with recipe:', recipe);
    const [imageSrc, setImageSrc] = useState(null);
    useEffect(() => {
        if(recipe)
            if(img) setImageSrc(img);
            else if (recipe && recipe.imageList && recipe.imageList.length > 0) {
            setImageSrc(recipe.imageList[0]);
            } else {
            fetchImage(recipe.recipeTitle.includes("recipe") ? recipe.recipeTitle : recipe.recipeTitle + ' recipe')
                .then((url) => {
                setImageSrc(url);
                });
            }
      }, []);

    //console.log(recipe.imageList);//its ok
    //const imageSrc = (recipe.imageList && recipe.imageList.length > 0) ? recipe.imageList[0] : titleImage;
    console.log(recipe.instructionsList);

    const handleSaveRecipe = async () => {
        try{
            const response = await fetch('http://localhost:9091/api/v1/recipes/addRecipe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(recipe),
            });

            const data = await response.json();
            if(response.ok){
                console.log('Recipe saved successfully:', data);
            }
            else{
                console.log('An error occurred while saving the recipe.');
            }
        } catch(error){
            console.error('Error:', error);
            console.log('An error occurred while saving the recipe.');
        }
    }
    
    return (
        <div className="modal">
            <div onClick={toggleModal} className="overlay"></div>
            <div className="modal-content">
                <h2>{recipe.recipeTitle}</h2>
                
                <div className=".modal-title-image-container"><img src={imageSrc} alt="Title Image" className="modal-title-image" /> </div>
                <div className="text-box-container">
                    <div className="text-box-left">
                    <h3>INGREDIENTS</h3>
                    <ul>
                        { recipe && recipe.printableIngredients && recipe.printableIngredients.map( ingredient => <li>{ingredient.replace(/"/g, '')}</li>) }
                        {
                            recipe && (!recipe.printableIngredients || recipe.printableIngredients.length === 0) && recipe.ingredients && recipe.ingredients.map((ingredient, index) => 
                                <li key={index}>{ingredient['quantity']['value'] >= 1 ? String(ingredient['quantity']['value']) : ''} {String(ingredient['name'])}</li>)
                        }
                    </ul>
                    </div>
                    
                     {/* Add your left text box here */}
                    <div className="text-box-right">
                    <h3>PREPARATION METHOD</h3>
                    <div className="text-box-right-inside">
                        {recipe.instructionsList && Object.keys(recipe.instructionsList).length > 0 ? (
                            <ol>
                            {Object.values(recipe.instructionsList).map(instruction => <li key={instruction}>{instruction}</li>)}
                            </ol>
                        ) : (
                            <p>
                            {
                                recipe.description.split(/(\d+\.\s?)/g).map((text, index) => 
                                text.match(/(\d+\.\s?)/g) ? <><br />{text}</> : text
                                )
                            }
                            </p>
                        )}
                    </div>
                </div>
                <button className="close-modal" onClick={toggleModal}>
                    
                </button>

                {   AI && AI === true && <button className="save-recipe" onClick={handleSaveRecipe} > Save Recipe </button>}
            </div>
        </div>
    </div>
    );
}
