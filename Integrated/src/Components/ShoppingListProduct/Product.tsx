import React, { useEffect, useState } from 'react';
import './Product.css';
import { useRef } from 'react';
import SearchBar from '../ShoppingListSearchBar/SearchBar';
import { fetchImage } from '../../pexelsApi';

type Quantity = {
  value: number;
  type: string;
}

export type Item = {
  name: string;
}

export type ShoppingItem = {
  item: Item;
  quantity: Quantity;
  price: number;
  id: any;
}

export type ShoppingList = {
  shoppingList: ShoppingItem[];
  listName: string;
};

export type ProductProps = {
  shoppingLists: ShoppingList[];
}

interface ProductDeclareProps {
  buyItem?: (name: string) => void;
  handleIncreaseQuantity: (name : string) => void;
  handleDecreaseQuantity: (name : string) => void;
  handleSubmit?: (e: React.FormEvent<HTMLFormElement>) => void ;
  handleDelete: (name : string) => void;
  newId?: number;
  setNewId?: React.Dispatch<React.SetStateAction<number>>;
  newProduct ?: string;
  setNewProduct ?: React.Dispatch<React.SetStateAction<string>>;
  newQuantity ?: number;
  setNewQuantity?: React.Dispatch<React.SetStateAction<number>>;
}


const Product: React.FC<ShoppingItem & ProductDeclareProps> = ({
  item,
  price, 
  quantity, 
  buyItem, 
  handleIncreaseQuantity, 
  handleDecreaseQuantity, 
  handleSubmit, 
  handleDelete, 
  newId,
  setNewId,
  newProduct, 
  setNewProduct, 
  newQuantity, 
  setNewQuantity}) => {

  const inputRef = useRef<HTMLInputElement>(null);
  const inputRef2 = useRef<HTMLInputElement>(null);
  const [confirmShop, setConfirmShop] = useState(false);
  const [imageSrc, setImageSrc] = useState("img/ico/questionmark.png");

  useEffect(() => {
    const fetchImageData = async () =>{
      const imageUrl = await fetchImage(item.name);
      if(imageUrl)
        setImageSrc(imageUrl);
    }
    if(item.name != '')
      fetchImageData();
  }, [item.name])

  const handleConfirmShop = () => {
      setConfirmShop(!confirmShop);
  }

  const handleButton = () => {
    setTimeout(() => {
      if(inputRef.current) {inputRef.current.value = '';}
      if(inputRef2.current) {inputRef2.current.value = '';}
    }, 30);
  };

  return (
    <div className="productShopping">
      {!confirmShop &&
        <img style={{margin: '10px'}} src={imageSrc} alt={item.name} className="productImageShopping" />
      }
      <div className="productInfoShopping">
        {imageSrc !== "img/ico/questionmark.png" && !confirmShop && (
          <>
        <div className="quantityControlsShopping">
          <button className="markStyle" onClick={() => {if(buyItem) buyItem(item.name)}}>Mark as bought</button>
          <button className="quantityButtonShopping" onClick={() => handleDecreaseQuantity(item.name)}>-</button>
          <span className="currentQuantityShopping">{quantity.value}</span>
          <button className="quantityButtonShopping" onClick={() => handleIncreaseQuantity(item.name)}>+</button>
          <button className="removeButtonShopping" onClick={handleConfirmShop}>X</button>
        </div>
        <h2 className="productNameShopping">{item.name}</h2>
        </>
        )}
        {imageSrc !== "img/ico/questionmark.png" && confirmShop && (
        <div className="confirmShop">
          <h3>Are you sure you want to delete this item from your shopping list?</h3>
          <div className="confirmButtonContainerShop" >
            <button onClick={() => {handleConfirmShop(); handleDelete(item.name)}}>Yes</button>
            <button onClick={handleConfirmShop}>No</button>
        </div>
        </div>
        )}
        <form className="productInfoShopping" onSubmit={handleSubmit}>
          {imageSrc === "img/ico/questionmark.png" && (
            <div className="productInfoShopping">
              <SearchBar 
              inputRef={inputRef}
              inputRef2={inputRef2}
              newId={newId}
              newProduct={newProduct}
              newQuantity={newQuantity}
              setNewId={setNewId}
              setNewProduct={setNewProduct}
              setNewQuantity={setNewQuantity}
            />
            </div>
          )}
          {imageSrc === "img/ico/questionmark.png" && (
            <button className="buyButtonShopping" type='submit' aria-label='Add Item' onClick={handleButton}>Add</button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Product;
