import React, { useState, useEffect } from 'react';
import './Shopping.css';
const Shopping: React.FC = () => {
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

    return (
        <div>
            <h1>Shopping List</h1>
            {showPopup && (
                <div className="popup">
                    <p>Add item into database?</p>
                    <button onClick={handleYesClick}>Yes</button>
                    <button onClick={handleNoClick}>No</button>
                </div>
            )}
        </div>
    );
}

export default Shopping;
