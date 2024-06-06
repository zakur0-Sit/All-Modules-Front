import React, { useEffect, useRef, useState } from 'react';
import Product, { ProductProps , ShoppingList, ShoppingItem} from '../ShoppingListProduct/Product';
import ItemLists from '../ShoppingListItemLists/ItemLists';
import APIRequest from '../APIRequest/APIRequest';

interface ContentProps{
  products: ProductProps;
  newId: number;
  newProduct: string;
  newQuantity: number;
  fetchError: any;
  setNewId: React.Dispatch<React.SetStateAction<number>>;
  setProducts: React.Dispatch<React.SetStateAction<ProductProps>>;
  setNewProduct: React.Dispatch<React.SetStateAction<string>>;
  setNewQuantity: React.Dispatch<React.SetStateAction<number>>;
  setFetchError: React.Dispatch<any>;
}

const Content: React.FC<ContentProps> = ({
  products, 
  setProducts,
  newId,
  setNewId, 
  newProduct, 
  setNewProduct, 
  newQuantity, 
  setNewQuantity, 
  fetchError, 
  setFetchError
}) => {
 
  const API_URL = 'http://localhost:9091/shopping';

  const [slist, setSlist] = useState(false);
  const [nlist, setNlist] = useState(false);
  const [listIndex, setListIndex] = useState(0);
  const [newList, setNewList] = useState('');
  const [confirmShopList, setConfirmShopList] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleConfirmShopList = (index: number) =>{
    setConfirmShopList(index);
  }

  const handleSlistDropdown = () =>{
    console.log(products.shoppingLists);
    setSlist(!slist);
  };

  const handleNlistDropdown = () =>{
    setNlist(!nlist);
  };

  useEffect(() => {
      console.log('Products have been updated:', products);
  }, [products]);

  const saveProducts = (newProducts : ShoppingItem[], name: string, listIndex: number) => {
    setProducts(prevProducts => {
      const updatedProducts = { ...prevProducts };

      if (updatedProducts.shoppingLists.length >= 1) {
        updatedProducts.shoppingLists[listIndex] = {
          ...updatedProducts.shoppingLists[listIndex],
          shoppingList: newProducts, listName: name
        };
      } else {
        console.error('There are not enough shoppingLists to update.');
      }

      return updatedProducts;  
    });
  }

  const handleIncreaseQuantity = async (name : string) =>{
    console.log('inc')
    if(products.shoppingLists[listIndex].shoppingList !== undefined){
      const listItems = products.shoppingLists[listIndex].shoppingList.map((item) => item.item.name === name && item.quantity.value >= 0? {...item, item: {...item.item}, quantity: {...item.quantity, value: item.quantity.value + 1}, price:item.price} : item); 
      saveProducts(listItems, products.shoppingLists[listIndex].listName, listIndex);

      const targetProduct = listItems.filter((item) => item.item.name === name);
      const index = products.shoppingLists[listIndex].shoppingList.findIndex(item => item.item.name === name);
      const options = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          item: {
            name: targetProduct[0].item.name
          },
          quantity: {
            value: targetProduct[0].quantity.value,
            type: targetProduct[0].quantity.type 
          },
          price: targetProduct[0].price
        })
      }
      const response = await APIRequest(`${API_URL}/changeQuantity?index=${listIndex}&id=${index}&quantity=${targetProduct[0].quantity.value}`, options);
      if(response)
        setFetchError(response);
    }
  }

  const handleDecreaseQuantity = async (name : string) =>{
    console.log('dec');
    if(products.shoppingLists[listIndex].shoppingList !== undefined){
      const listItems = products.shoppingLists[listIndex].shoppingList.map((item) => item.item.name === name && item.quantity.value > 0? {...item, item: {...item.item}, quantity: {...item.quantity, value: item.quantity.value - 1}, price:item.price} : item); 
      saveProducts(listItems, products.shoppingLists[listIndex].listName, listIndex);

      const targetProduct = listItems.filter((item) => item.item.name === name);
      const index = products.shoppingLists[listIndex].shoppingList.findIndex(item => item.item.name === name);
      const options = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          item: {
            name: targetProduct[0].item.name
          },
          quantity: {
            value: targetProduct[0].quantity.value,
            type: targetProduct[0].quantity.type 
          },
          price: targetProduct[0].price
        })
        
      }
      const response = await APIRequest(`${API_URL}/changeQuantity?index=${listIndex}&id=${index}&quantity=${targetProduct[0].quantity.value}`, options);    
      if(response)
        setFetchError(response);
    }
  }

  const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!newProduct) return;
    addProduct(newId, newProduct, newQuantity);
    setNewId(0);
    setNewProduct('');
    setNewQuantity(0);
  }

  const handleDelete = async (name : string) => {
    if(products.shoppingLists !== undefined){
      const listItems = products.shoppingLists[listIndex].shoppingList.filter((item) => item.item.name !== name);
      const index = products.shoppingLists[listIndex].shoppingList.findIndex(item => item.item.name === name); 
      saveProducts(listItems, products.shoppingLists[listIndex].listName, listIndex);

      const options = {method: 'DELETE'};
      const response = await APIRequest(`${API_URL}/removeItem?index=${listIndex}&id=${index}`, options);
      if(response)
        setFetchError(response);
    }
  }

  const handleListSelect = async (index: number) => {
    if(products.shoppingLists !== undefined){
      setListIndex(index);
    }
    handleSlistDropdown();
  }

  const handleListDelete = async (name: string) => {
    if(products.shoppingLists !== undefined){
      const index = products.shoppingLists.findIndex(list => list.listName === name);
      console.log(index); 
      products.shoppingLists.splice(index, 1);
      setProducts(products);

      const options = {method: 'DELETE'};
      const response = await APIRequest(`${API_URL}/removeList?index=${index}`, options);
      if(response)
        setFetchError(response);
    }
  }

  const addProduct = async (id: number, name: string, value: number) => {
    const newProductItem = {id, item: {name}, quantity: {value, type: 'Amount'}, price: 0, imageSrc: '' };
    const listCopy = products.shoppingLists[listIndex]
    if (!listCopy.shoppingList) {
      const listProducts = [listCopy.shoppingList, newProductItem];
      saveProducts(listProducts, products.shoppingLists[listIndex].listName, listIndex);
    }
    else{
      const listProducts = [...products.shoppingLists[listIndex].shoppingList, newProductItem];
      saveProducts(listProducts, products.shoppingLists[listIndex].listName, listIndex);
    }
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newProductItem)
    }
    const response = await APIRequest(`${API_URL}/addItem?index=${listIndex}&name=${id}&quantity=${value}`, options);
    if(response)
      setFetchError(response);
  }

  const buyItem = async (name : string) => {
    const listItems = products.shoppingLists[listIndex].shoppingList.filter((item) => item.item.name !== name);
    const index = products.shoppingLists[listIndex].shoppingList.findIndex(item => item.item.name === name); 
    saveProducts(listItems, products.shoppingLists[listIndex].listName, listIndex);

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const response = await APIRequest(`${API_URL}/buyItem?index=${listIndex}&id=${index}`, options);
    if(response)
      setFetchError(response);
  }

  const addList = async (name : string) => {
    const newList: ShoppingList = {shoppingList: [], listName: name};
    if (products.shoppingLists) {
      products.shoppingLists.push(newList);
      setProducts(products);
    }
    else{
      products.shoppingLists = [newList];
      setProducts(products);
    }
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newList)
    }
    const response = await APIRequest(`${API_URL}/addList?name=${name}`, options);
    if(response)
      setFetchError(response);
  }

  const handleSubmitList = (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleNlistDropdown();
    if(!newList) return;
    addList(newList);
    setNewList('');
    setListIndex(products.shoppingLists.length - 1);
  }

  const handleButton = () => {
    setTimeout(() => {
      if(inputRef.current) {inputRef.current.value = '';}
    }, 30);
  };

  /*pt popup la notificare -- modul 4*/
  const [showPopup, setShowPopup] = useState(false);
    const [productId, setProductId] = useState<string | null>('');
    const [productName, setProductName] = useState<string | null>('');

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('fromNotification') === 'true') {
            setShowPopup(true);
            setProductId(urlParams.get('productId'));
            setProductName(urlParams.get('productName'));
        }
    }, []);

    const removeQueryParam = () => {
        const url = new URL(window.location.href);
        url.searchParams.delete('fromNotification');
        url.searchParams.delete('productId');
        url.searchParams.delete('productName');
        window.history.replaceState({}, '', url.toString());
    };

    const handleYesClick = async () => {
        try {
            const response = await fetch('http://localhost:9091/shopping/addItemWithBody', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ index: 0, name: productId, quantity: 1 }) 
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const responseData = await response.json();
            console.log(responseData);
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        } finally {
            setShowPopup(false);
            removeQueryParam();
        }
    };

    const handleNoClick = async () => {
        try {
            const response = await fetch('http://localhost:9091/inventory/notAcceptSuggestion', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productId)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const responseData = await response.json();
            console.log(responseData);
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        } finally {
            setShowPopup(false);
            removeQueryParam();
        }
    };

    /*am pus pop-up --modul 4 */
  return (
    <>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>Do you want to add {productName} to the shopping list?</p>
            <div className="button-container">
              <button onClick={handleYesClick}>Yes</button>
              <button onClick={handleNoClick}>No</button>
            </div>
          </div>
        </div>
      )}
      <div className="topContainerShopping">
        <img className="appImageShopping" src="img/ico/shoppingcart.png" alt="Imagine 1" />
        <div className="shoppingList">Shopping Lists</div>
      </div>
      <div className="itemListButtons">
        <div className="newList">
          <button className="bigButtons" onClick={handleNlistDropdown}>New list</button>
          {nlist &&
            <div className="newListPrompt">
              <img src="img/ico/product.png"></img>
              <form className="formStyleShopping" onSubmit={(e) => handleSubmitList(e)}>
                <input
                  autoFocus
                  type="text"
                  required
                  placeholder="Name"
                  value={newList}
                  ref={inputRef}
                  onChange={(e) => {if(setNewList) setNewList(e.target.value)}}
                />
                <button className="addNewList" type='submit' onClick={handleButton}>Add list</button>
              </form>
            </div>
          }
        </div>
        <div className="existingList">
          <button className="bigButtons" onClick={handleSlistDropdown}>Select list</button>
          {slist &&
            <div className="existingListDropdown">
              {products.shoppingLists?.map((object, index) => {
                    return (
                      <div className="dropContainer" key={index}>
                      {confirmShopList === -1 && (
                        <div className="confirmListButtons">
                        <button className="listName" onClick={() => handleListSelect(index)} key={index}>{object.listName}</button>
                        <button className="deleteList" onClick={() => handleConfirmShopList(index)}>X</button>
                        </div>
                      )}
                      {confirmShopList === index &&
                      <div className="confListPrompt">
                      <h3>Are you sure you want to delete this shopping list?</h3>
                      <div className="listConfButton">
                      <button onClick={() => {handleConfirmShopList(-1); handleListDelete(object.listName)}}>Yes</button>
                      <button onClick={() => handleConfirmShopList(-1)}>No</button>
                      </div>
                      </div>
                      }
                      
                      </div>
                    )
                  }
                )
              }
          </div>
          }
        </div>
        <div className="efficientroute">
        <a href="/#/efficient-route"><button className="bigButtons">Get Efficient Routes</button></a>
        </div>
      </div>
      <h1 className="listTitle">{products.shoppingLists[listIndex]?.listName}</h1>
      {products.shoppingLists.length > 0 && <ItemLists
        products={products}
        listIndex={listIndex}
        buyItem={buyItem}
        handleIncreaseQuantity={handleIncreaseQuantity}
        handleDecreaseQuantity={handleDecreaseQuantity}
        handleSubmit={handleSubmit}
        handleDelete={handleDelete}
        setNewId={setNewId}
        setNewProduct={setNewProduct}
        setNewQuantity={setNewQuantity}
      />}
      {products.shoppingLists.length <= 0 && (
        <h1 style={{textAlign: 'center'}}>Create a list!</h1>
      )}
    </>
  );
}

export default Content;