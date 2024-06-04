import React, {useEffect, useState} from "react";
import "./modal.css";
import {fetchImage} from '../../pexelsApi.tsx';

export default function Modal({ recipe, toggleModal, img }) {
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
                        { recipe.printableIngredients.map( ingredient => <li>{ingredient.replace(/"/g, '')}</li>) }
                    </ul>
                    </div>
                    
                     {/* Add your left text box here */}
                    <div className="text-box-right">
                    <h3>PREPARATION METHOD</h3>
                    <div className="text-box-right">
                        {recipe.instructionsList && Object.keys(recipe.instructionsList).length > 0 ? (
                            <ol>
                            {Object.values(recipe.instructionsList).map(instruction => <li key={instruction}>{instruction}</li>)}
                            </ol>
                        ) : (
                            <p>{recipe.description}</p>
                        )}
                    </div>
                </div>
                <button className="close-modal" onClick={toggleModal}>
                    
                </button>
            </div>
        </div>
    </div>
    );
}
