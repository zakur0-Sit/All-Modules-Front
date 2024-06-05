import React, { useEffect, useState } from 'react';
import './Product.css';
import { useRef } from 'react';
import SearchBar from '../InventoryListSearchBar/SearchBar';
import { fetchImage } from '../../pexelsApi';

type Quantity = {
  value: number;
  type: string;
}

export type Item = {
  name: string;
  eatable: boolean;
}

export type ItemList = {
  item: Item;
  quantity: Quantity;
  averageConsumption: number;
  id : any;
}

export type ProductProps = {
  itemList: ItemList[];
};

interface ProductDeclareProps {
  handleIncreaseQuantity: (name : string) => void;
  handleDecreaseQuantity: (name : string) => void;
  handleChangeQuantity: (name: string, quantity: number) => void;
  handleSubmit?: (e: React.FormEvent<HTMLFormElement>) => void ;
  handleSubmitUpdate?: (e: React.FormEvent<HTMLFormElement>, name: string) => void ;
  handleDelete: (name : string) => void;
  newId ?: number;
  setNewId?: React.Dispatch<React.SetStateAction<number>>;
  newProduct ?: string;
  setNewProduct ?: React.Dispatch<React.SetStateAction<string>>;
  newQuantity ?: number;
  setNewQuantity?: React.Dispatch<React.SetStateAction<number>>;
  updatedQuantity ?: number;
  setUpdatedQuantity: React.Dispatch<React.SetStateAction<number>>;
}


const Product: React.FC<ItemList & ProductDeclareProps> = ({
  item, 
  quantity, 
  updatedQuantity, 
  setUpdatedQuantity,
  handleChangeQuantity, 
  handleIncreaseQuantity, 
  handleDecreaseQuantity, 
  handleSubmit, 
  handleSubmitUpdate, 
  handleDelete, 
  newId,
  setNewId,
  newProduct, 
  setNewProduct, 
  newQuantity, 
  setNewQuantity
}) => {

  const inputRef = useRef<HTMLInputElement>(null);
  const inputRef2 = useRef<HTMLInputElement>(null);
  const[edit, setEdit] = useState(true);
  const[confirmInv, setConfirmInv]= useState(false);
  const[imageSrc, setImageSrc] = useState("img/ico/questionmark.png");

  useEffect(() => {
    const fetchImageData = async () =>{
      const imageUrl = await fetchImage(item.name);
      if(imageUrl)
        setImageSrc(imageUrl);
    }
    if(item.name != '')
      fetchImageData();
  }, [item.name])

  const handleConfirmInv = () => {
    setConfirmInv(!confirmInv);
  }

  const handleEdit = () => {
    setEdit(!edit);
  }

  const handleButton = () => {
    setTimeout(() => {
      if(inputRef.current) {inputRef.current.value = '';}
      if(inputRef2.current) {inputRef2.current.value = '';}
    }, 30);
  };

  const handleSubmitEdit = (e : React.FormEvent<HTMLFormElement>, name: string) => {
    e.preventDefault();
    if(handleSubmitUpdate){
        handleSubmitUpdate(e, name);}
    handleEdit();
}

  return (
    <div className="productInventory">
      {!confirmInv && 
        <img style={{margin: '10px'}} src={imageSrc} alt={item.name} className="productImageInventory" />
      }
      <div className="productInfoInventory">
        {imageSrc !== "img/ico/questionmark.png" && edit && !confirmInv && (
          <>
        <div className="quantityControlsInventory "> 
        <button className="editButton" onClick={handleEdit}>Edit</button>
          <button className="quantityButtonInventory"
              onClick={() => handleDecreaseQuantity(item.name)}
          >-
          </button>
          <span className="currentQuantityInventory">
              {quantity.value}
          </span>
          <button className="quantityButtonInventory" 
              onClick={() => handleIncreaseQuantity(item.name)}
          >+
          </button>
          <button className="removeButtonInventory" 
              onClick={handleConfirmInv}
          >X
          </button>
        </div>
        <h2 className="productNameInventory">{item.name}</h2>
        </>
        )}
        {!edit &&
        <>
        <div className="quantityControlsInventory "> 
        <form onSubmit={(e) => {if(item.name) handleSubmitEdit(e, item.name)}}>
        <button className="editButton" type='submit'>Confirm</button>
          <button className="quantityButtonInventory"
              onClick={() => handleDecreaseQuantity(item.name)}
          >-
          </button>
            <input className="inputStyle"
              autoFocus
              type="text"
              placeholder="Quantity"
              value={updatedQuantity}
              ref={inputRef}
              onChange={(e) => {if(setUpdatedQuantity) setUpdatedQuantity(parseInt(e.target.value))}}
            />
          
          <button className="quantityButtonInventory" 
              onClick={() => handleIncreaseQuantity(item.name)}
          >+
          </button>
          <button className="removeButtonInventory" 
              onClick={handleConfirmInv}
          >X
          </button>
          </form>
          </div>
          <h2 className="productNameInventory">{item.name}</h2>
          </>
        }
        {confirmInv &&
        <div className="confirmInv">
          <h3>Are you sure you want to delete this item from your inventory?</h3>
          <div className="confirmButtonContainer">
            <button onClick={() => {handleConfirmInv(); handleDelete(item.name)}}>Yes</button>
            <button onClick={handleConfirmInv}>No</button>
            </div>
        </div>
        }
        <form className="productInfoInventory" onSubmit={handleSubmit}>
        {imageSrc === "img/ico/questionmark.png" && (
          <div className="productInfoInventory">
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
          <button 
              className="buyButtonInventory"
              type='submit'
              aria-label='Add Item'
              onClick={handleButton}
          >
                Add
          </button>
        )}
        </form>
      </div>
    </div>
  );
};

export default Product;
