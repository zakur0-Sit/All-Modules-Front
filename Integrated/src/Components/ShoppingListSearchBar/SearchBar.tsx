import React, { useEffect, useState } from "react";
import './SearchBar.css';
import { useSearchParams } from 'react-router-dom';

type Product = {
    id: number;
    name: string;
    category: number;
    eatable: boolean;
}

interface SearchProps {
    inputRef: React.RefObject<HTMLInputElement>;
    inputRef2: React.RefObject<HTMLInputElement>;
    newId?: number;
    newProduct?: string;
    newQuantity?: number;
    setNewId?: React.Dispatch<React.SetStateAction<number>>;
    setNewProduct?: React.Dispatch<React.SetStateAction<string>>;
    setNewQuantity?: React.Dispatch<React.SetStateAction<number>>;
}

const SearchBar: React.FC<SearchProps> = ({
    inputRef, 
    inputRef2, 
    newId,
    newProduct, 
    newQuantity, 
    setNewId,
    setNewProduct, 
    setNewQuantity 
}) => {

    const API_URL = 'http://localhost:9091/shopping';

    const [filteredOptions, setFilteredOptions] = useState<Product[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [preFilledProductName, setPreFilledProductName] = useState<string | null>(null);
	const [searchParams] = useSearchParams();
    const searchObject = Object.fromEntries(searchParams.entries());

    useEffect(() => {
        const fromNotification = searchObject['fromNotification'];
        const productName = searchObject['productName'];
      
        if (fromNotification === 'true' && productName) {
            setPreFilledProductName(productName);
            if (setNewProduct) {
                setNewProduct(productName);
            }
        }
    }, [searchObject, setNewProduct]);

    const handleOptionClick = (id: number, option: string) => {
        console.log(option)
        if(inputRef.current)
            inputRef.current.value = option;
        if (setNewProduct)
            setNewProduct(option);
        if(setNewId)
            setNewId(id);
        setShowDropdown(false);
    };

    const handleSearch = async (e: any) => {
        let listItems;
        try{
            const response = await fetch(`${API_URL}/search?name=${e.target.value}`);
            //if(!response.ok) throw Error('Searched data was not received');
            listItems = await response.json();
            if (e.target.value) {
                setFilteredOptions(listItems);
                setShowDropdown(true);
            }
            else {
                setFilteredOptions([]);
                setShowDropdown(false);
            }
        } catch(err : unknown){
                /*if (err instanceof Error) {
                    throw err.message;
                } else {
                    throw 'An unknown error occurred';
                }*/
                console.log('Fetch Error');
        }
    };

    return (
        <div className="searchContainerShopping">
            <input
                autoFocus
                ref={inputRef}
                type='text'
                placeholder='Add Product'
                required
                className="productNameShopping"
                value={preFilledProductName || newProduct}
                onChange={(e) => { handleSearch(e) }}
            />
            {showDropdown && (
                <div className="contentSearchShopping">
                    <ul>
                        {filteredOptions.length > 0 ? ( filteredOptions.map((option, index) => (
                            <li
                                key={index}
                                onClick={() => handleOptionClick(option.id, option.name)}
                                style={{ cursor: 'pointer' }}
                                onMouseDown={(e) => e.preventDefault()}
                            >
                                {option.name}
                            </li>
                        ))) : (
                            <p style={{color: 'red', cursor: 'default'}}>No options match your search</p>
                        )}
                    </ul>
                </div>
            )}
            <input
                autoFocus
                ref={inputRef2}
                type='string'
                placeholder='Add Quantity'
                required
                className="productNameShopping"
                value={newQuantity}
                onChange={(e) => {
                    if (setNewQuantity) {
                        const value = parseInt(e.target.value, 10);
                        setNewQuantity(value);
                    }
                }}
            />
        </div>
    );
};
export default SearchBar;
