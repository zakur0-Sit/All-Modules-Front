import { useState } from 'react';
import './AddRecipeForm.css';
import { FaPlus } from 'react-icons/fa';
import { DISPLAY_ITEMS_PER_PAGE, USER_ID } from '../../utils/utils';
import { getRecipes } from '../services/recipe';

export const AddRecipeForm = ({ closeModal, setRecipes, setTotalPages }) => {
  const [recipeData, setRecipeData] = useState({
    recipeTitle: '',
    description: '',
    authorName: "John Doe",
    cookTime: '',
    prepTime: '',
    totalTime: '',
    imageList: [],
    category: '',
    calories: '',
    datePublished: "2021-09-01",
    fatContent: '',
    saturatedFatContent: '',
    cholesterolContent: '',
    sodiumContent: '',
    carbohydrateContent: '',
    fiberContent: '',
    sugarContent: '',
    proteinContent: '',
    recipeServings: '',
    ingredients: [],
    instructionsList: [],
    ingredientsMap: {},
    keywords: [],
    reviewCount: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRecipeData({
      ...recipeData,
      [name]: value
    });
  };

  const handleImageUpload = (e) => {
    setRecipeData({
      ...recipeData,
      imageList: [...recipeData.imageList, ""]
    });
  };

  const handleAddIngredient = () => {
    const newIngredient = {
      name: '',
      quantity: {
        value: 0,
        type: 'Grams'
      }
    };
    setRecipeData({
      ...recipeData,
      ingredients: [...recipeData.ingredients, newIngredient]
    });
  };

  const handleIngredientChange = (e, index) => {
    const { name, value } = e.target;

    const updatedIngredients = [...recipeData.ingredients];
    if (name === "name") {
      updatedIngredients[index].name = value;
    } else if (name === "value") {
      updatedIngredients[index].quantity.value = value;
    }
    updatedIngredients[index].quantity.type = "Grams";
    setRecipeData({
      ...recipeData,
      ingredients: updatedIngredients
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const printableIngredients = recipeData.ingredients.map((ingredient, index) => {
      const { name, quantity } = ingredient;
      return `${quantity.value} ${name}`;
    })
    let formData = { ...recipeData };

    const instructionsList = formData.instructionsList.reduce((acc, instruction, index) => {
      acc[index] = instruction;
      return acc;
    }, {});

    formData.printableIngredients = printableIngredients;
    formData.recipeYield = formData.recipeServings + "servings";
    formData.cookTime = "PT" + formData.cookTime + "M";
    formData.prepTime = "PT" + formData.prepTime + "M";
    formData.totalTime = "PT" + formData.totalTime + "M";
    formData.instructionsList = instructionsList

    try {
      const response = await fetch('http://localhost:9091/api/v1/recipes/addRecipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {

        try{
        const fetchRecipes = async () => {
          
          const recipes = await getRecipes(USER_ID);
          setRecipes(recipes);
          setTotalPages(Math.ceil(recipes.length / DISPLAY_ITEMS_PER_PAGE));
        }
        await fetchRecipes();
        console.log(response + "successafter fetch");
        closeModal();
        setIsLoading(false);
        setError(false);
      } catch (error) {
        console.log(error , "error3");
        setError(true);
        setIsLoading(false);
      }
      }else {
        console.log(response , "error1");
        setError(true);
        setIsLoading(false)
      }
    } catch (error) {
      console.log(error , "error2");
      setError(true);
      setIsLoading(false)
    }
  };

  return (
    <div className="recipe-form">
      <h2>Add new recipe</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3 style={{ margin: '0px' }}>General description</h3>
          <div className="padding-section">
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="recipeTitle"
                required
                value={recipeData.recipeTitle}
                onChange={handleInputChange}
                className={recipeData.recipeTitle === 'Pizza' ? 'pizza-style' : ''}
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <input
                type="text"
                name="description"
                required
                value={recipeData.description}
                onChange={handleInputChange}
              ></input>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              <div className="form-group">
                <label>Category:</label>
                <input
                  type="text"
                  name="category"
                  required
                  value={recipeData.category}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Portions:</label>
                <input
                  type="number"
                  name="recipeServings"
                  required
                  value={recipeData.recipeServings}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group form-group-images">
                <div className='flex'></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <label>Images:</label>
                  <button type="button" className='button-recipe' onClick={handleImageUpload}><FaPlus /></button>
                </div>
                {recipeData.imageList && recipeData.imageList.length ? recipeData.imageList.map((item, index) => {
                  return (
                    <input
                      type="text"
                      required
                      onChange={(e) => {
                        const updatedImages = [...recipeData.imageList];
                        updatedImages[index] = e.target.value;
                        setRecipeData({
                          ...recipeData,
                          imageList: updatedImages
                        });
                      }}
                      value={item}
                    />
                  )
                }) : ""}
                <div className="recipe-images-container">
                  {recipeData.imageList.map((imageUrl, index) => (
                    <img key={index} src={imageUrl} alt={`Image ${index}`} />
                  ))}
                </div>
              </div>

            </div>
          </div>



        </div>
        <div className='form-section border-section'>
          <h3 style={{ margin: '16px 0px 0px 0px' }}>Timp</h3>
          <div className="grid-3 padding-section">
            <div className="form-group">
              <label>"Preparation Time (minutes)"</label>
              <input
                type="number"
                name="prepTime"
                required
                value={recipeData.prepTime}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Cooking Time (minutes):</label>
              <input
                type="number"
                required
                name="cookTime"
                value={recipeData.cookTime}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Total time (minutes)</label>
              <input
                type="number"
                required
                name="totalTime"
                value={recipeData.totalTime}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className="form-section border-section ">
          <h3 style={{ margin: '0px' }}>Properties</h3>
          <div className="grid-3 padding-section">
            <div className="form-group">
              <label>Calorii:</label>
              <input
                type="number"
                required
                name="calories"
                value={recipeData.calories}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Fat Content (g):</label>
              <input
                type="number"
                required
                name="fatContent"
                value={recipeData.fatContent}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Saturated Fat Content (g):</label>
              <input
                type="number"
                name="saturatedFatContent"
                required
                value={recipeData.saturatedFatContent}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Cholesterol Content (mg):</label>
              <input
                type="number"
                name="cholesterolContent"
                required
                value={recipeData.cholesterolContent}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Sodium Content (mg):</label>
              <input
                type="number"
                name="sodiumContent"
                required
                value={recipeData.sodiumContent}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Carbohydrate Content (g):</label>
              <input
                type="number"
                name="carbohydrateContent"
                required
                value={recipeData.carbohydrateContent}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Fiber Content (g):</label>
              <input
                type="number"
                required
                name="fiberContent"
                value={recipeData.fiberContent}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Sugar Content (g):</label>
              <input
                type="number"
                name="sugarContent"
                required
                value={recipeData.sugarContent}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Protein Content (g):</label>
              <input
                type="number"
                name="proteinContent"
                required
                value={recipeData.proteinContent}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', padding: '16px' }}>
            <div className="form-section">
              <div className="form-group">
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <label>Ingredients:</label>
                  <button type="button" className='button-recipe' onClick={handleAddIngredient}><FaPlus /></button>
                </div>
                <ul>
                  {recipeData.ingredients.map((ingredient, index) => (
                    <li key={index}>
                      <input
                        type="text"
                        placeholder="Ingredient name"
                        required
                        name="name"
                        value={ingredient.name}
                        onChange={(e) => handleIngredientChange(e, index)}
                      />
                      <input
                        type="number"
                        placeholder="Quantity"
                        required
                        name="value"
                        value={ingredient.quantity.value}
                        onChange={(e) => handleIngredientChange(e, index)}
                      />
                      <input
                        type="text"
                        placeholder="Unit type"
                        readOnly
                        required
                        name="type"
                        value={"Grams"}
                        onChange={(e) => handleIngredientChange(e, index)}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* Secțiunea pentru instrucțiuni */}
            <div className="form-section">
              <div className="form-group">
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <label>Instructions:</label>
                  <button type="button" className='button-recipe' onClick={() => setRecipeData({
                    ...recipeData,
                    instructionsList: [...recipeData.instructionsList, ""]
                  })}><FaPlus /></button>
                </div>
                <ul>
                  {recipeData.instructionsList.map((instruction, index) => (
                    <li key={index}>
                      <textarea
                        placeholder={`Instruction ${index + 1}`}
                        value={instruction}
                        required
                        onChange={(e) => {
                          const updatedInstructions = [...recipeData.instructionsList];
                          updatedInstructions[index] = e.target.value;
                          setRecipeData({
                            ...recipeData,
                            instructionsList: updatedInstructions
                          });
                        }}
                      ></textarea>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className='add-recipe-button' style={{ marginLeft: '16px' }}>{error ? 'Server error' : isLoading ? 'Loading...' : 'Add recipe'}</button>
      </form>
    </div>
  );
};

export default AddRecipeForm;

