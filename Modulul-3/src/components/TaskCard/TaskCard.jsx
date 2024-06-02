import React from "react";
import "./TaskCard.css";
import Tag from "../Tag/Tag";

const TaskCard = ({ title, tags, handleDelete, index, setActiveCard, image }) => {
    return (
        <article className='task_card'
         draggable="true" 
         onDragStart={() => setActiveCard(index)}
         onDragEnd={() => setActiveCard(null)}
         >
            <img src="img/Lasagna.jpg" alt={title} className='task_image' />
            <div className='task_content'>
                <p className='task_text'>{title}</p>

                <div className='task_card_bottom_line'>
                    <div className='task_card_tags'>
                        {tags.map((tag, index) => (
                            <Tag key={index} tagName={tag} selected />
                        ))}
                    </div>
                    <div
                        className='task_delete'
                        onClick={() => handleDelete(index)}>
                        <img src="img/ico/delete.png" className='delete_icon' alt='' />
                    </div>
                </div>
            </div>
        </article>
    );
};

export default TaskCard;