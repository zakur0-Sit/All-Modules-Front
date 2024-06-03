import React, { useState } from 'react';
import './App.css';
import DetailsModel from './DetailsModel';

interface StoreCardProps {
  name: string;
  address: string;
  shoppingList: string[];
  price: string;
  showDetails: () => void;
}

const StoreCard: React.FC<StoreCardProps> = ({ name, address, shoppingList, price, showDetails }) => {
  const [showDetailsModel, setShowDetailsModel] = useState(false);

  const handleShowDetails = () => {
    console.log("showing details");
    setShowDetailsModel(true);
    showDetails();
  };

  return (
    <div className="store-card">
      <img src={`./images/${name.toLowerCase()}.jpg`} alt={`${name} Store`} />
      <h2>{name}</h2>
      <p>{address}</p>
      <p>Shopping list for this store:</p>
      <ul>
        {shoppingList.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <p>Price: {price} RON</p>
      <button className="details-button" onClick={handleShowDetails}>
        Details
      </button>
      {showDetailsModel && (
        <DetailsModel
          title={name}
          images={['eggs.jpg', 'milk.jpg', 'tomatoes.jpg', 'syrup.jpg']}
          texts={shoppingList}
          altTableContent={['4.20', '10.99', '34.70', '30.10']}
          prices="79.99"
          onClose={() => setShowDetailsModel(false)}
        />
      )}
    </div>
  );
}

export default StoreCard;
