import React, { useState, useRef, useEffect } from 'react';
import {ProductProps , ItemList} from '../InventoryListProduct/Product';
import ItemLists from '../InventoryListItemLists/ItemLists';
import APIRequest from '../APIRequest/APIRequest';


interface ContentProps{
  products: ProductProps;
  newId: number;
  newProduct: string;
  newQuantity: number;
  setProducts: React.Dispatch<React.SetStateAction<ProductProps>>;
  setNewId: React.Dispatch<React.SetStateAction<number>>;
  setNewProduct: React.Dispatch<React.SetStateAction<string>>;
  setNewQuantity: React.Dispatch<React.SetStateAction<number>>;
  setFetchError: React.Dispatch<any>;
  handleSort: (filter: number) => void;
}

const Content: React.FC<ContentProps> = ({
  handleSort, 
  products, 
  setProducts,
  newId,
  setNewId, 
  newProduct, 
  setNewProduct, 
  newQuantity, 
  setNewQuantity,  
  setFetchError}) => {
 
  const [isTag, setTag] = useState(false);
  const [isSort, setSort] = useState(false);
  const [updatedQuantity, setUpdatedQuantity] = useState(0);

  const API_URL = 'http://localhost:9091/inventory';

  const saveProducts = (newProducts : ItemList[]) => {
    setProducts(prevProducts => {
      return {...prevProducts, itemList: newProducts};  
    });
  }

  const handleIncreaseQuantity = async (name : string) =>{
    if(products.itemList!==undefined){
      const listItems = products.itemList.map((item) => item.item.name === name && item.quantity.value >= 0? {...item, item: {...item.item}, quantity: {...item.quantity, value: item.quantity.value + 1}, averageConsumption: item.averageConsumption} : item); 
      saveProducts(listItems);

      const targetProduct = listItems.filter((item) => item.item.name === name);
      const index = products.itemList.findIndex(item => item.item.name === name);
      const options = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          item: {
            name: targetProduct[0].item.name,
            eatable: targetProduct[0].item.eatable
          },
          quantity: {
            value: targetProduct[0].quantity.value,
            type: targetProduct[0].quantity.type 
          },
          averageConsumption: targetProduct[0].averageConsumption
        })
      }
      const response = await APIRequest(`${API_URL}/changeQuantity?id=${index}&quantity=${targetProduct[0].quantity.value}`, options);
      if(response)
        setFetchError(response);
    }
  }

  const handleDecreaseQuantity = async (name : string) =>{
    if(products.itemList !== undefined){
      const listItems = products.itemList.map((item) => item.item.name === name && item.quantity.value > 0? {...item, item: {...item.item}, quantity: {...item.quantity, value: item.quantity.value - 1}, averageConsumption: item.averageConsumption} : item); 
      saveProducts(listItems);

      const targetProduct = listItems.filter((item) => item.item.name === name);
      const index = products.itemList.findIndex(item => item.item.name === name);
      const options = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          item: {
            name: targetProduct[0].item.name,
            eatable: targetProduct[0].item.eatable
          },
          quantity: {
            value: targetProduct[0].quantity.value,
            type: targetProduct[0].quantity.type 
          },
          averageConsumption: targetProduct[0].averageConsumption
        })
      }
      const response = await APIRequest(`${API_URL}/changeQuantity?id=${index}&quantity=${targetProduct[0].quantity.value}`, options);    
      if(response)
        setFetchError(response);
    }
  }

  const handleChangeQuantity = async (name: string, updatedQuantity: number) =>{
    if(products.itemList !== undefined){
      const listItems = products.itemList.map((item) => item.item.name === name && item.quantity.value >= 0? {...item, item: {...item.item}, quantity: {...item.quantity, value: updatedQuantity}, averageConsumption: item.averageConsumption} : item); 
      saveProducts(listItems);

      const targetProduct = listItems.filter((item) => item.item.name === name);
      const index = products.itemList.findIndex(item => item.item.name === name);
      const options = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          item: {
            name: targetProduct[0].item.name,
            eatable: targetProduct[0].item.eatable
          },
          quantity: {
            value: targetProduct[0].quantity.value,
            type: targetProduct[0].quantity.type 
          },
          averageConsumption: targetProduct[0].averageConsumption
        })
      }
      const response = await APIRequest(`${API_URL}/changeQuantity?id=${index}&quantity=${targetProduct[0].quantity.value}`, options);    
      if(response)
        setFetchError(response);
    }
  }

  const handleSubmitUpdate = (e : React.FormEvent<HTMLFormElement>, name: string) => {
    e.preventDefault();
    handleChangeQuantity(name, updatedQuantity);
    setUpdatedQuantity(0);
  }

  const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!newProduct) return;
    addProduct(newId, newProduct, newQuantity);
    setNewProduct('');
    setNewQuantity(0);
    setNewId(0);
  }

  const handleDelete = async (name : string) => {
    if(products.itemList !== undefined){
      const listItems = products.itemList.filter((item) => item.item.name !== name);
      const index = products.itemList.findIndex(item => item.item.name === name); 
      saveProducts(listItems);

      const options = {method: 'DELETE'};
      const response = await APIRequest(`${API_URL}/removeItem?id=${index}`, options);
      if(response)
        setFetchError(response);
    }
  }

  const addProduct = async (id: number, name : string, value : number) => {
    const newProductItem = {id, item: {name, eatable: false}, quantity: {value, type: 'Amount'}, averageConsumption: 0, imageSrc: '' };
    if (!products.itemList) {
      const listProducts = [products.itemList, newProductItem];
      saveProducts(listProducts);
    }
    else{
      const listProducts = [...products.itemList, newProductItem];
      saveProducts(listProducts);
    }
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newProductItem)
    }
    const response = await APIRequest(`${API_URL}/addItem?name=${id}&quantity=${value}`, options);
    if(response)
      setFetchError(response);
  }

  const toggleTagDropdown = () => {
    setTag(!isTag);
  };      

  const toggleSortDropdown = () => {
    setSort(!isSort);
  };


  /*pt buton de restock suggestion -- modul 4*/
    const [loading, setLoading] = useState(false);
    const prevDataRef = useRef(null);
    function isEqual(objA: { [x: string]: any; } | null, objB: { [x: string]: any; } | null) {
      if (objA === objB) return true;
      if (objA == null || objB == null) return false;
      if (typeof objA !== 'object' || typeof objB !== 'object') return false;
      const keysA = Object.keys(objA);
      const keysB = Object.keys(objB);
      if (keysA.length !== keysB.length) return false;

      for (let key of keysA) {
          if (!isEqual(objA[key], objB[key])) return false;
      }
      return true;
    }
    const restockbtn = async () => {
      try {
          const response = await fetch('http://localhost:8080/inventory/infoItemRestock', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(58)
          });

          if (!response.ok) {
              throw new Error('Network response was not ok');
          }

          const responseData = await response.json();
          console.log(responseData);
          console.log('prevData:');
          console.log(prevDataRef.current);
          if (!isEqual(responseData, prevDataRef.current)) {
              prevDataRef.current = responseData;
              console.log('Data changed!');
              console.log(prevDataRef.current);
              const productId = Object.keys(responseData)[0];
              const productName = responseData[productId];
              console.log(productName);
              console.log(productId);
              Notification.requestPermission().then(perm => {
                  if (perm === 'granted') {
                      const notification = new Notification('Sugestie de restock!', {
                          body: `Produsul ${productName} trebuie cumparat in urmatoarele zile!`
                      })
                      notification.onclick = (event) => {
                          event.preventDefault(); 
                          
                          const targetUrl = `http://localhost:3000/ShoppingList?fromNotification=true&productId=${productId}&productName=${encodeURIComponent(productName)}`;
                          if (!window.location || window.location.href === 'http://localhost:3000/') {
                              window.location.href = targetUrl;
                          } else {
                              window.open(targetUrl, '_blank');
                          }
                      };
                  }
              });
          }

      } catch (error) {
          console.error('There has been a problem with your fetch operation:', error);
      } finally {
          setLoading(false);
      }
  };

  

  return (
    <>
      <div className="topContainerInventory">
        <img className="appImageInventory" src="img/ico/inventory.png" alt="Imagine 1" />
        <div className="inventoryList">Inventory List</div>
      </div>
      <div className="buttonContainerInventory">
        <div className="sort">
          <button className="sortButton" onClick={toggleSortDropdown}>Sort</button>
          {isSort &&
            <div className="sortDropdown">
              <button onClick={() => {handleSort(0)}}>A-Z</button>
              <button onClick={() => {handleSort(1)}}>Z-A</button>
              <button onClick={() => {handleSort(2)}}>Quantity ↑</button>
              <button onClick={() => {handleSort(3)}}>Quantity ↓</button>
            </div>
          }
        </div>
        <div className="restock">
          <button onClick={restockbtn}>Restock suggestions</button>            
        </div>
      </div>
      <ItemLists
        products={products}
        setUpdatedQuantity={setUpdatedQuantity}
        handleIncreaseQuantity={handleIncreaseQuantity}
        handleDecreaseQuantity={handleDecreaseQuantity}
        handleChangeQuantity={handleChangeQuantity}
        handleSubmit={handleSubmit}
        handleSubmitUpdate={handleSubmitUpdate}
        handleDelete={handleDelete}
        setNewId={setNewId}
        setNewProduct={setNewProduct}
        setNewQuantity={setNewQuantity}
      />
    </>
  );
}

export default Content;