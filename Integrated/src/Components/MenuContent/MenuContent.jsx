import React, { useState, useEffect } from 'react';
import TaskForm from "../TaskForm/TaskForm";
import TaskColumn from "../TaskColumn/TaskColumn";
import "./MenuContent.css";
import { v4 as uuidv4 } from 'uuid';
import {fetchImage} from '../../pexelsApiFetch.js';
import { count } from 'console';

export const MenuContent = () => {
  const userId = 1;
  const householdId = 2;
  const backgroundMenu = "/img/menu_background.jpeg";
  const [tasks, setTasks] = useState([]);
  const [activeCard, setActiveCard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isTasksEmpty = (tasks) => {
    return tasks.length === 0;
  }

  const fetchRecipeDetails = async (id) => {
    try {
      const response = await fetch(`http://localhost:9091/api/v1/recipes/recipe/${id}`);
      
      if (!response.ok) {
        //console.error(`HTTP error! status: ${response.status}`);
        return null;  // or throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      //console.log('FETCH RECIPE DETAILS Response:', data);
      return data;
    } catch (error) {
      console.error('Error fetching recipe details:', error);
      return null;  // or throw error
    }
  };
  

  const toJavaObjs = (tasks) => {
    //console.log('Tasks:', tasks);

    


    return {
      householdId: householdId,
      monday: tasks.filter(task => task.status === 'luni').map(task => task.recipeId),
      tuesday: tasks.filter(task => task.status === 'marti').map(task => task.recipeId),
      wednesday: tasks.filter(task => task.status === 'miercuri').map(task => task.recipeId),
      thursday: tasks.filter(task => task.status === 'joi').map(task => task.recipeId),
      friday: tasks.filter(task => task.status === 'vineri').map(task => task.recipeId),
      saturday: tasks.filter(task => task.status === 'sambata').map(task => task.recipeId),
      sunday: tasks.filter(task => task.status === 'duminica').map(task => task.recipeId),
      breakfastList: tasks.filter(task => task.meal === 'breakfast').map(task => task.recipeId),
      lunchList: tasks.filter(task => task.meal === 'lunch').map(task => task.recipeId),
      dinnerList: tasks.filter(task => task.meal === 'other').map(task => task.recipeId),
      createdAt: (new Date()).toISOString().slice(0, 10)
    };
  }
  const fromJavaObjs = async (mealPlanObj) => {
    //console.log('Meal plan object:', mealPlanObj);
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const meals = ['breakfast', 'lunch', 'dinner'];
  
    let newTasks = [];
    let usedIds = { breakfast: new Set(), lunch: new Set(), dinner: new Set() };
  
    for(const day of days){
      let roDay = day === 'monday' ? 'luni' : day === 'tuesday' ? 'marti' : day === 'wednesday' ? 'miercuri' : day === 'thursday' ? 'joi' : day === 'friday' ? 'vineri' : day === 'saturday' ? 'sambata' : 'duminica';
        for(const recipes of mealPlanObj[day]){
          const recipeDetails = await fetchRecipeDetails(recipes);
          let imageSrc =  recipeDetails.imageList ? recipeDetails.imageList[0] : null;
          if(imageSrc === null){
            imageSrc = await fetchImage(recipeDetails.recipeTitle.includes("recipe") ? recipeDetails.recipeTitle : recipeDetails.recipeTitle + ' recipe');
            //console.log('Image:', imageSrc);
          }

          newTasks.push({
            id: uuidv4(),
            task: recipeDetails.recipeTitle,
            tags: [],
            status: roDay,
            recipeId: recipes,
            meal: mealPlanObj.breakfastList.includes(recipes) ? 'breakfast' : mealPlanObj.lunchList.includes(recipes) ? 'lunch' : mealPlanObj.dinnerList.includes(recipes) ? 'other' : 'other',
            image: imageSrc,
            nutrients: recipeDetails.printableIngredients || {
              calories: 0,
              fatContent: 0,
              cholesterolContent: 0,
              carbohydrateContent: 0,
              proteinContent: 0
            }
          });

        }
    }


    //console.log('New tasks:', newTasks);
    return newTasks;
  };


  useEffect(() => {
    const saveMealPlan = async () => {
      if (isTasksEmpty(tasks)) {
        //console.log('No tasks to save.');
        return;
      }
  
      const mealPlanObj = toJavaObjs(tasks);
      //console.log('Tasks:', tasks);
      //console.log('Sending meals to Spring like:', mealPlanObj);
  
      try {
        const response = await fetch(`http://localhost:9091/api/v1/recipes/saveMealPlan`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mealPlanObj),
        });
  
        if (response.ok) {
          const data = await response.json();
          //console.log('SAVE MEAL PLAN Response:', data);
          if (data === true) {
            //console.log('Meal plan saved successfully!');
          }
        } else {
          //console.error('Failed to save meal plan. Status:', response.status);
        }
      } catch (error) {
        //console.error('Error:', error);
      }
    };
  
    saveMealPlan();
  }, [tasks]);

  useEffect(() => {
    const fetchData = async () => {
      let data = null;
      try {
        var count = 0;
        let response = {ok: false};

        while(count < 5 && response.ok === false){//try 5 times
          console.log('Fetching meal plan...');
          response = await fetch(`http://localhost:9091/api/v1/recipes/getMealPlan?householdId=${householdId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }); 
        }
  
        if (response.ok) {
          data = await response.json();
          console.log('GET MEAL PLAN json:', data);
          if (data.mealPlanId !== -1) {
            const newTasks = await fromJavaObjs(data);
            setTasks(newTasks);
          } else {
            data = null;
            console.log('No meal plan found for the given household.');
          }
        } else {
          data = null;
          console.log('Failed to fetch meal plan. Status:', response.status);
        }

        if(data === null) {
          try{
            console.log('Fetching recommendations...');
            setIsLoading(true);
            const fetchRecipeIds = async (id) => {
              const response = await fetch(`http://localhost:9091/api/v1/recipes/getRecommendations/${id}/categorized`);
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              //console.log('GET RECOMMENDATIONS Response:', response);
              return await response.json();
            };
  
            let allIds = { breakfast: [], lunch: [], other: [] };
            for (let i = 1; i <= 1; i++) {//DE 6 OIR??
              const ids = await fetchRecipeIds(i);
              allIds.breakfast.push(...ids.breakfast);
              allIds.lunch.push(...ids.lunch);
              allIds.other.push(...ids.other);
            }
            const days = ['luni', 'marti', 'miercuri', 'joi', 'vineri', 'sambata', 'duminica'];
            const meals = ['breakfast', 'lunch', 'other'];
            let newTasks = [];
            let usedIds = { breakfast: new Set(), lunch: new Set(), other: new Set() };
            for (const day of days) {
              for (const meal of meals) {
                let availableIds = allIds[meal].filter(id => !usedIds[meal].has(id));
                if (availableIds.length === 0) {
                  availableIds = allIds[meal];
                }
                const selectedId = availableIds.shift();
                const recipeDetails = await fetchRecipeDetails(selectedId);
                newTasks.push({
                  id: uuidv4(),
                  task: recipeDetails.recipeTitle,
                  tags: [],
                  status: day,
                  recipeId: selectedId,
                  meal: meal,
                  image: recipeDetails.imageList ? recipeDetails.imageList[0] : null,
                  nutrients: recipeDetails.printableIngredients || {
                    calories: 0,
                    fatContent: 0,
                    cholesterolContent: 0,
                    carbohydrateContent: 0,
                    proteinContent: 0
                  }
                });
                usedIds[meal].add(selectedId);
              }
            }
            setTasks(newTasks);
          } catch (error) {
            //console.error('Error:', error);
          } finally {
            setIsLoading(false);
          }
        }
      } catch (error) {
        //console.error('Error fetching meal plan:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

  

  const handleDelete = (taskId) => {
    const newTasks = tasks.filter(task => task.id !== taskId);
    setTasks(newTasks);
  };

  const handleLike = async (recipeId) => {
    try {
      const userId = 1;
      const response = await fetch(`http://localhost:9091/api/v1/recipes/addLike?recipeId=${recipeId}&userId=${userId}`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      //console.log('Recipe liked:', data);
    } catch (error) {
      //console.error('Error liking recipe:', error);
    }
  };

  const handleDislike = async (recipeId) => {
    try {
      const response = await fetch(`http://localhost:9091/api/v1/recipes/removeLike?recipeId=${recipeId}&userId=${userId}`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      //console.log('Recipe disliked:', data);
    } catch (error) {
      //console.error('Error:', error);
    }
  };

  const onDrop = (status, index) => {
    if (activeCard == null) return;

    const taskToMove = tasks.find(task => task.id === activeCard);
    const updatedTasks = tasks.filter(task => task.id !== activeCard);
    updatedTasks.splice(index, 0, {
      ...taskToMove,
      status: status
    });

    setTasks(updatedTasks);
    setActiveCard(null);
  };

  const handleSaveMealPlan = async () => {
    setIsLoading(true);

    console.log('Saving meal plan in shopping list...');
    let recipeIngredients = [];
    let productMap = new Map();
    try {
      for(const task of tasks){
        const recipeDetails = await fetchRecipeDetails(task.recipeId);
        for(const ing of recipeDetails.ingredients){
          if(!ing.productId || !ing.quantity || !ing.quantity.value || !ing.productId.id)
            continue;


          
          let quantityToAdd = 0;
          if(ing.quantity.value > 100) quantityToAdd = ing.quantity.value / 100;
          else if(ing.quantity.value > 10) quantityToAdd = ing.quantity.value / 10;
          else if(ing.quantity.value <= 0) quantityToAdd = 0.5;
          else quantityToAdd = ing.quantity.value;
            
          if(productMap.has(ing.productId.id)){
            productMap.set(ing.productId.id, productMap.get(ing.productId.id) + quantityToAdd);
          } else {
            productMap.set(ing.productId.id, quantityToAdd);
          }
        }

      }

      console.log('Product map for shopping list:', productMap);
      //TODO: CREATE SHOPPING LIST FOR CERTAI  HOUSEHOLD
      const response = await fetch(`http://localhost:9091/shopping/addList`, 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response create shopping list:', response);
      for(const [key, value] of productMap){
        try{
          //TODO ADD INGREDIENT TO SHOPPING LIST FOR CERTAIN HOUSEHOLD
          const response = await fetch(`http://localhost:9091/shopping/addIngredient?idProduct=${key}&quantity=${value}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });
        } catch (error) {
          console.error('Error in saving product:' + key + ' with quantity:' + value);
        }
      }


    } catch (error) {
      console.error('Error in saving all ing of meal plan:', error);
    
    } finally { setIsLoading(false) };
  };

  return (
    <div className="menu-layout">
      {isLoading && (
        <div className="loading-overlay">
          <div className="animation-container">
            <div style={{ width: '100%', height: '0', paddingBottom: '100%', position: 'relative' }}>
              <iframe
                src="https://lottie.host/embed/216886ff-2537-4ea5-a71d-1d06a0a0af80/WWXkc4IuZh.json"
                style={{ border: 'none', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                title="Loading Animation"
              ></iframe>
            </div>
          </div>
        </div>
      )}
      <div className={`app ${isLoading ? 'blur-background' : ''}`}>
        <TaskForm setTasks={setTasks} setParentLoading={setIsLoading} />
        <main className="app_main">
          {['luni', 'marti', 'miercuri', 'joi', 'vineri', 'sambata', 'duminica'].map(day => (
            <TaskColumn
              key={day}
              title={day.charAt(0).toUpperCase() + day.slice(1)}
              tasks={tasks.filter(task => task.status === day)}
              status={day}
              handleDelete={handleDelete}
              setActiveCard={setActiveCard}
              onDrop={onDrop}
              handleLike={handleLike}
              handleDislike={handleDislike}
            />
          ))}
        </main>
        <div className="save-button-container">
          <button className="save-button" onClick={handleSaveMealPlan}>
            Save this meal plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuContent;