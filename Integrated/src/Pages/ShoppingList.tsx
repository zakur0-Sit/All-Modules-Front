import React, { useState, useEffect } from 'react';
import { Header } from '../Components/Header/Header';
import { ProductProps } from '../Components/ShoppingListProduct/Product';
import './ShoppingList.css';
import Content from '../Components/ShoppingListContent/Content';
import Notifications from '../Components/Notifications/Notifications';
import { Footer } from '../Components/Footer/Footer';

const ShoppingListPage: React.FC = () => {
  console.log('React version:', React.version, 'from', require.resolve('react'));

  const API_URL = 'http://localhost:9091/shopping';

  const [products, setProducts] = useState<ProductProps>({
    shoppingLists: [{ shoppingList: [], listName: '' }]
  });
  const [newId, setNewId] = useState(0);
  const [newProduct, setNewProduct] = useState('');
  const [newQuantity, setNewQuantity] = useState(0);
  const [fetchError, setFetchError] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Data was not received');
        
        const listItems = await response.json();

        setProducts({
          shoppingLists: listItems.shoppingLists.map((shoppingList: any) => ({
            shoppingList: shoppingList.shoppingList,
            listName: shoppingList.name
          }))
        });

        setFetchError(null);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setFetchError(err.message);
        } else {
          setFetchError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  return (
    <div className="appContainerShopping">
      <Header />
      <main>
        {loading && <p className='paragraphShopping'>Shopping lists are loading...</p>}
        {fetchError && <p className='paragraphShopping' style={{ color: 'red' }}>{`Error: ${fetchError}`}</p>}
        {!loading && !fetchError && 
          <Content 
            products={products}
            newId={newId}
            setNewId={setNewId}
            setProducts={setProducts}
            newProduct={newProduct}
            setNewProduct={setNewProduct}
            newQuantity={newQuantity}
            setNewQuantity={setNewQuantity}
            fetchError={fetchError}
            setFetchError={setFetchError}
          />
        }
        <Notifications />
      </main>
      <Footer />
    </div>
  );
};

export default ShoppingListPage;
