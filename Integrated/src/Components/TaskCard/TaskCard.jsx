import React, { useState, useEffect } from "react";
import "./TaskCard.css";
import { fetchImage } from '../../pexelsApi.tsx';

const TaskCard = ({ title, tags, handleDelete, id, setActiveCard, image, meal = 'dinner', handleLike, handleDislike }) => {
  const userId = 1;
  const Image = "/img/ico/delete.png";
  const [liked, setLiked] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    if (image) {
      setImageSrc(image);
    } else {
      fetchImage(title.includes("recipe") ? title : title + ' recipe')
        .then((url) => {
          setImageSrc(url);
        });
    }
  }, [image, title]);

  const handleLikeClick = () => {
    if (liked) {
      handleDislike(id);
    } else {
      handleLike(id);
    }
    setLiked(!liked);
  };

  const displayMeal = meal === 'other' ? 'Dinner' : meal.charAt(0).toUpperCase() + meal.slice(1);

  return (
    <div
      className="task_card"
      draggable
      onDragStart={() => setActiveCard(id)}
    >
      {imageSrc && <img src={imageSrc} alt="task" className="task_image" />}
      <div className="task_content">
        <div className="task_text">{title}</div>
        {meal && <div className="task_category">{displayMeal}</div>}
        <div className="task_card_bottom_line">
          <button
            className="task_delete"
            onClick={() => handleDelete(id)}
          >
            <img src={process.env.PUBLIC_URL + Image}
              alt="delete"
              className="delete_icon"
            />
          </button>
          <button className={`like-button ${liked ? 'liked' : ''}`} onClick={handleLikeClick}>
            {liked ? 'Liked' : 'Like'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
