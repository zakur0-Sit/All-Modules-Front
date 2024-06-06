// src/components/TaskForm.jsx
import React, { useState, useEffect, useRef } from "react";
import "./TaskForm.css";
import Tag from "../Tag/Tag";

const TaskForm = ({ setTasks, setParentLoading }) => {
  const [taskData, setTaskData] = useState({
    task: "",
    status: "luni",
    tags: [],
    meal: "other", // Initialize 'meal' with a default value
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [allRecipes, setAllRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchResultsRef = useRef(null);
  

  useEffect(() => {
    const fetchAllRecipes = async () => {
      try {
        setIsLoading(true);
        setParentLoading(true); // Notify parent that loading has started
        let allRecipesData = [];
        let pageNo = 0;
        const totalPages = 114; // Adjust according to your actual total pages

        while (pageNo <= totalPages) {
          const response = await fetch(`http://localhost:9091/api/v1/recipes/recipePage?pageNo=${pageNo}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const json = await response.json();
          allRecipesData = [...allRecipesData, ...json.content];
          pageNo += 1;
        }
        setAllRecipes(allRecipesData);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
        setParentLoading(false); // Notify parent that loading has finished
      }
    };

    fetchAllRecipes();
  }, [setParentLoading]);

  const handleSearch = (term) => {
    // If the search term is empty, clear the search results and return
    if (term.trim() === "") {
      setSearchResults([]);
      return;
    }
  
    // Filter the list of all recipes based on the search term
    const filteredResults = allRecipes.filter(recipe =>
      recipe.recipeTitle.toLowerCase().includes(term.toLowerCase() && recipe.category !== 'Ai generated')
    );
  
    // Sort the filtered results based on the position of the search term in the title
    filteredResults.sort((a, b) => {
      const aIndex = a.recipeTitle.toLowerCase().indexOf(term.toLowerCase());
      const bIndex = b.recipeTitle.toLowerCase().indexOf(term.toLowerCase());
      return aIndex - bIndex;
    });
  
    // Update the search results
    setSearchResults(filteredResults);
  };

  const handleSelectRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setTaskData((prev) => ({ ...prev, task: recipe.recipeTitle }));
    setSearchTerm("");
    setSearchResults([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedRecipe) {
      setErrorMessage("Recipe not found.");
      return;
    }

    const newTask = {
      id: selectedRecipe.recipeId,
      task: selectedRecipe.recipeTitle,
      status: taskData.status,
      tags: taskData.tags,
      image: selectedRecipe.imageList ? selectedRecipe.imageList[0] : null,
      meal: taskData.meal || 'other', // Ensure 'meal' is set, defaulting to 'other' if undefined
    };

    setTasks((prev) => [...prev, newTask]);
    setTaskData({
      task: "",
      status: "luni",
      tags: [],
      meal: "dinner", // Reset 'meal' to default value
    });
    setSelectedRecipe(null);
    setErrorMessage("");
  };

  const handleClickOutside = (event) => {
    if (searchResultsRef.current && !searchResultsRef.current.contains(event.target)) {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="app_header">
      <form className='task_form' onSubmit={handleSubmit}>
      <input
        type="text"
        name="task"
        value={taskData.task}
        className="task_input"
        placeholder="Enter your meal"
        autoComplete="off"
        style={{ color: '#000', backgroundColor: '#fff' }}
        onChange={(e) => {
          setTaskData({ ...taskData, task: e.target.value }); // Update the taskData.task state
          handleSearch(e.target.value); // Then call handleSearch
        }}
      />
        {isLoading && <div className="loading_message">Loading recipes...</div>}
        {searchResults.length > 0 && (
          <div className="search_results_container" ref={searchResultsRef}>
            <button className="close_button" onClick={() => setSearchResults([])}>x</button>
            <ul className="search_results">
              {searchResults.map(recipe => (
                <li key={recipe.recipeId} onClick={() => handleSelectRecipe(recipe)}>
                  {recipe.recipeTitle}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="task_form_bottom_line">
          <div>
            <select
              name="status"
              value={taskData.status}
              className="task_status"
              onChange={handleChange}
            >
              <option value="luni">monday</option>
              <option value="marti">tuesday</option>
              <option value="miercuri">wednesday</option>
              <option value="joi"> thursday </option>
              <option value="vineri">friday </option>
              <option value="sambata">saturday</option>
              <option value="duminica">sunday</option>
            </select>
            <button type="submit" className="task_submit">
              + Add Meal
            </button>
          </div>
        </div>
        {errorMessage && <div className="error_message">{errorMessage}</div>}
      </form>
    </header>
  );
};

export default TaskForm;