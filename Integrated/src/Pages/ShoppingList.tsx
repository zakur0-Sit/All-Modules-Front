import React, { useState, useEffect } from 'react';
import { Header } from '../Components/Header/Header';
import { ProductProps } from '../Components/ShoppingListProduct/Product';
import './ShoppingList.css';
import Content from '../Components/ShoppingListContent/Content';
import Notifications from '../Components/Notifications/Notifications';
import { Footer } from '../Components/Footer/Footer';
import { useLocation, useNavigate } from 'react-router-dom';

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
    const [showPopup, setShowPopup] = useState(false);
    const [popupProduct, setPopupProduct] = useState<{ id: number, name: string } | null>(null);

    const location = useLocation();
    const navigate = useNavigate();

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

        // Check for URL parameters to display the popup
        const params = new URLSearchParams(location.search);
        const fromNotification = params.get('fromNotification');
        const productId = params.get('productId');
        const productName = params.get('productName');
        
        if (fromNotification === 'true' && productId && productName) {
            setPopupProduct({ id: Number(productId), name: productName });
            setShowPopup(true);
        }
    }, [location.search]);

    const handleNotificationClick = (id: number, name: string) => {
        setPopupProduct({ id, name });
        setShowPopup(true);
    };

    const removeQueryParam = () => {
        const params = new URLSearchParams(location.search);
        params.delete('fromNotification');
        params.delete('productId');
        params.delete('productName');
        navigate({ search: params.toString() });
    };

  
    const handleYesClick = async () => {
      try {
          if (popupProduct) {
              const requestBody = {
                  index: popupProduct.id || "-1",
                  name: popupProduct.name || "",
                  quantity: "1",
                  price: "0"
              };
  
              const response = await fetch('http://localhost:9091/shopping/addItem', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(requestBody)
              });
  
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
  
              const responseData = await response.json();
              console.log(responseData);
          }
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
                body: JSON.stringify({ name: popupProduct?.name }) 
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

    return (
        <div className="appContainerShopping">
            <Header />
            <main className="mainShopping">
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