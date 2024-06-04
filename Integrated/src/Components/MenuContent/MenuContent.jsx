import React, { useState, useEffect } from 'react';
import TaskForm from "../TaskForm/TaskForm";
import TaskColumn from "../TaskColumn/TaskColumn";
import "./MenuContent.css"

export const MenuContent = () => {
  const oldTasks = localStorage.getItem("tasks");
  const [tasks, setTasks] = useState(JSON.parse(oldTasks) || []);
  const [activeCard, setActiveCard] = useState(null);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleDelete = (taskIndex) => {
    const newTasks = tasks.filter((task, index) => index !== taskIndex);
    setTasks(newTasks);
  };

  const onDrop = (status, index) => {
    if (activeCard == null || activeCard === undefined) return;

    const taskToMove = tasks[activeCard];
    const updatedTasks = tasks.filter((task, index) => index !== activeCard)
    updatedTasks.splice(index, 0, {
      ...taskToMove,
      status: status
    })

    setTasks(updatedTasks); 
  };

  return (       
      <div className="app">
        <TaskForm setTasks={setTasks} />
        <main className="app_main">
          <TaskColumn
            title="Luni"
            tasks={tasks}
            status="luni"
            handleDelete={handleDelete}
            setActiveCard={setActiveCard}
            onDrop={onDrop}
          />
           <TaskColumn
            title="Marti"
            tasks={tasks}
            status="marti"
            handleDelete={handleDelete}
            setActiveCard={setActiveCard}
            onDrop={onDrop}
          />
          <TaskColumn
            title="Miercuri"
            tasks={tasks}
            status="miercuri"
            handleDelete={handleDelete}
            setActiveCard={setActiveCard}
            onDrop={onDrop}
          />
           <TaskColumn
            title="Joi"
            tasks={tasks}
            status="joi"
            handleDelete={handleDelete}
            setActiveCard={setActiveCard}
            onDrop={onDrop}
          />
           <TaskColumn
            title="Vineri"
            tasks={tasks}
            status="vineri"
            handleDelete={handleDelete}
            setActiveCard={setActiveCard}
            onDrop={onDrop}
          />
           <TaskColumn
            title="Sambata"
            tasks={tasks}
            status="sambata"
            handleDelete={handleDelete}
            setActiveCard={setActiveCard}
            onDrop={onDrop}
          />
           <TaskColumn
            title="Duminica"
            tasks={tasks}
            status="duminica"
            handleDelete={handleDelete}
            setActiveCard={setActiveCard}
            onDrop={onDrop}
          />
        </main>
      </div>
  );
};
