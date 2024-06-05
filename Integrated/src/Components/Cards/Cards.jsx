import React, { useState, useEffect } from 'react';
import './Cards.css';
import Modal from '../Modal/modal';
import { fetchImage } from "../../pexelsApiFetch";

function Cards({ recipe, handleLike, handleDislike }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [liked, setLiked] = useState(false);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleLikeClick = () => {
    if (liked) {
      handleDislike(recipe.recipeId);
      localStorage.removeItem(`liked-${recipe.recipeId}`);
    } else {
      handleLike(recipe.recipeId);
      localStorage.setItem(`liked-${recipe.recipeId}`, 'true');
    }
    setLiked(!liked);
  };

  useEffect(() => {
    const likedStatus = localStorage.getItem(`liked-${recipe.recipeId}`);
    if (likedStatus === 'true') {
      setLiked(true);
    }
  }, [recipe.recipeId]);

  useEffect(() => {
    if (recipe.imageList && recipe.imageList.length > 0) {
      setImageSrc(recipe.imageList[0]);
    } else {
      fetchImage(recipe.recipeTitle.includes("recipe") ? recipe.recipeTitle : recipe.recipeTitle + ' recipe')
        .then((url) => {
          setImageSrc(url);
        });
    }
  }, [recipe]);

  useEffect(() => {
    if (modalOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }, [modalOpen]);

  return (
    <div className="card">
      <img src={imageSrc} alt={recipe.recipeTitle} className="card-img" />
      <div className="card-body">
        <h5 className="card-title">{recipe.recipeTitle}</h5>
        <button className="btn btn-primary" onClick={toggleModal}>Details</button>
        <button className={`like-button ${liked ? 'liked' : ''}`} onClick={handleLikeClick}>
          {liked ? 'Liked' : 'Like'}
        </button>
      </div>
      {modalOpen && <Modal recipe={recipe} toggleModal={toggleModal} img={imageSrc} />}
    </div>
  );
}

export default Cards;