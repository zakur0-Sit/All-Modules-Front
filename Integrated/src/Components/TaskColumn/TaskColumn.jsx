import React from "react";
import "./TaskColumn.css";
import TaskCard from "../TaskCard/TaskCard";
import DropArea from "../DropArea/DropArea";

const randomInRange = (min, max) => Math.random() * (max - min) + min;

const TaskColumn = ({ title, tasks, status, handleDelete, setActiveCard, onDrop, handleLike, handleDislike }) => {

  
  const calculateColumnNutrients = (columnTasks) => {
    const totalNutrients = {
      calories: 0,
      fatContent: 0,
      cholesterolContent: 0,
      carbohydrateContent: 0,
      proteinContent: 0,
    };

    columnTasks.forEach(task => {
      if (!task.nutrients || !task.nutrients.calories) {
        task.nutrients = {
          calories: randomInRange(150.2, 180.9),
          fatContent: randomInRange(1.2, 4.4),
          cholesterolContent: Math.floor(randomInRange(5, 9)),
          carbohydrateContent: randomInRange(32.2, 38.4),
          proteinContent: randomInRange(2.4, 4.6)
        };
      }
      const nutrients = task.nutrients;
      totalNutrients.calories += nutrients.calories;
      totalNutrients.fatContent += nutrients.fatContent;
      totalNutrients.cholesterolContent += nutrients.cholesterolContent;
      totalNutrients.carbohydrateContent += nutrients.carbohydrateContent;
      totalNutrients.proteinContent += nutrients.proteinContent;
    });

    return totalNutrients;
  };

  const columnNutrients = calculateColumnNutrients(tasks);

  return (
    <section className='task_column'>
      <h2 className='task_column_heading'>
        {title} - Nutrient Totals
      </h2>
      <div className='nutrient_info'>
        <p>Calories: {columnNutrients.calories.toFixed(2)}</p>
        <p>Fat: {columnNutrients.fatContent.toFixed(2)}</p>
        <p>Cholesterol: {columnNutrients.cholesterolContent}</p>
        <p>Carbs: {columnNutrients.carbohydrateContent.toFixed(2)}</p>
        <p>Protein: {columnNutrients.proteinContent.toFixed(2)}</p>
      </div>

      <DropArea onDrop={() => onDrop(status, 0)} />

      {tasks.map((task, index) => (
        <React.Fragment key={task.id}>
          <TaskCard
            id={task.id}
            title={task.task}
            tags={task.tags}
            handleDelete={() => handleDelete(task.id)}
            setActiveCard={setActiveCard}
            image={task.image}
            meal={task.meal}
            handleLike={handleLike}
            handleDislike={handleDislike}
          />
          <DropArea onDrop={() => onDrop(status, index + 1)} />
        </React.Fragment>
      ))}
    </section>
  );
};

export default TaskColumn;
