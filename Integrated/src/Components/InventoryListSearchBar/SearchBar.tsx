import React, { useEffect, useState } from "react";
import './SearchBar.css';

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

	const API_URL = 'http://localhost:8081/inventory';

	const [filteredOptions, setFilteredOptions] = useState<Product[]>([]);
	const [showDropdown, setShowDropdown] = useState(false);

	const options = ['apple', 'banana', 'cherry', 'date', 'pineapple'];

	/*useEffect(() => {
		console.log("in search");
		if (newProduct) {
			const filtered = options.filter(option =>
				option.toLowerCase().includes(newProduct.toLowerCase())
			);
			setFilteredOptions(filtered);
			setShowDropdown(true);
		}
		else {
			setFilteredOptions([]);
			setShowDropdown(false);
		}
	}, [newProduct]);*/

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
			if(!response.ok) throw Error('Searched data was not received');
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
				if (err instanceof Error) {
					throw err.message;
				} else {
					throw 'An unknown error occurred';
				}
		}
	};

	return (
		<div className="searchContainer">
			<input
				autoFocus
				ref={inputRef}
				type='text'
				placeholder='Add Product'
				required
				className="productNameInventory"
				value={newProduct}
				onChange={(e) => { handleSearch(e) }}
			/>
			{showDropdown && (
				<div className="contentSearch">
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
				className="productNameInventory"
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