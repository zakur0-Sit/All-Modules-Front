import React, { useState, useEffect } from 'react';
import {Header} from '../Components/Header/Header';
import {ProductProps} from '../Components/InventoryListProduct/Product';
import './InventoryList.css';
import Content from '../Components/InventoryListContent/Content';
import Notifications from '../Components/Notifications/Notifications';
import { Footer } from '../Components/Footer/Footer';

const InventoryListPage: React.FC = () => {

  const API_URL = 'http://localhost:9091/inventory';
  const API_URL_NOTIFICATIONS = 'http://localhost:9091/notifications';

  const [products, setProducts] = useState<ProductProps>({itemList: []});
  const [newId, setNewId] = useState(0);
  const [newProduct, setNewProduct] = useState('');
  const [newQuantity, setNewQuantity] = useState(0);
  const [fetchError, setFetchError] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try{
        const response = await fetch(API_URL);
        //if(!response.ok) throw Error('Data was not received');
        const listItems = await response.json();

        const notifications = await fetch(API_URL_NOTIFICATIONS);
        //if (!notifications.ok) throw Error('Notifications were not received');
        const listNotifications = await notifications.json();

        setProducts(prevProducts => {
          return {...prevProducts, itemList: listItems.itemList};
        });
        setFetchError(null);
      } catch(err : unknown){
          /*if (err instanceof Error) {
            setFetchError(err.message);
          } else {
            setFetchError('An unknown error occurred');
          }*/
      } finally{
        setLoading(false);
      }
    }
    setTimeout(() => {
      (async () => await fetchItems())();
    }, 2000);
  }, [])

  const handleSort = async (filter: number) => {
      try{
        const response = await fetch(`${API_URL}/sortItems?sortFilter=${filter}`);
        //if(!response.ok) throw Error('Data was not received');
        const listItems = await response.json();

        setProducts(prevProducts => {
          return {...prevProducts, itemList: listItems.itemList};
        });
        setFetchError(null);
      } catch(err : unknown){
          /*if (err instanceof Error) {
            setFetchError(err.message);
          }else {
            setFetchError('An unknown error occurred');
          }*/
      }
  }
  return (
    <div className="appContainerInventory">
      <Header />
      <main className='mainInventory'>
        {loading && <p className='paragraphInventory'>Inventory is loading...</p>}
        {fetchError && <p className='paragraphInventory' style={{color: "red"}}>{`Error: ${fetchError}`}</p>}
        {!fetchError && !loading && 
          <Content 
            products = {products}
            setProducts = {setProducts}
            newId = {newId}
            setNewId={setNewId}
            newProduct = {newProduct}
            setNewProduct = {setNewProduct}
            newQuantity = {newQuantity}
            setNewQuantity = {setNewQuantity}
            setFetchError = {setFetchError}
            handleSort={handleSort}
          />
        }
        <Notifications />
      </main>
      <Footer />
    </div>
  );
};

export default InventoryListPage;
