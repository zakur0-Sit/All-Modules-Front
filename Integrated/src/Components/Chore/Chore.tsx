import React, { useState, useEffect, useRef } from 'react';
import '../ChoreListContent/Content.css';
import APIRequest from '../APIRequest/APIRequest';
import { fetchImage } from '../../pexelsApi';
import ChoreList from '../ChoreLists/ChoreLists';

export type ChoresList = {
  name : string | null;
  description: string;
  personID: number;
  duration: string;
}

export type ChoreProps = {
  choresList : ChoresList[];
}

interface ChoreDeclareProps {
	handleDelete: (name : string) => void;
	handleDone: (name : string) => void;
	handleSubmit?: (e: React.FormEvent<HTMLFormElement>) => void ;
	handleSubmitUpdate?: (e: React.FormEvent<HTMLFormElement>, oldName: string) => void ;
	newChore?: string;
	setNewChore?: React.Dispatch<React.SetStateAction<string>>;
	newDesc?: string;
	setNewDesc?: React.Dispatch<React.SetStateAction<string>>;
	newDuration?: string;
	setNewDuration?: React.Dispatch<React.SetStateAction<string>>;
	updatedChore?: string;
	setUpdatedChore: React.Dispatch<React.SetStateAction<string>>;
	updatedDesc?: string;
	setUpdatedDesc: React.Dispatch<React.SetStateAction<string>>;
	updatedDuration?: string;
	setUpdatedDuration: React.Dispatch<React.SetStateAction<string>>;
}

const Chore: React.FC<ChoresList & ChoreDeclareProps> = ({
	name, 
	description, 
	duration, 
	personID, 
	handleDone, 
	handleSubmit, 
	handleSubmitUpdate, 
	handleDelete,
	newChore, 
	setNewChore, 
	newDesc, 
	setNewDesc, 
	newDuration, 
	setNewDuration, 
	updatedChore, 
	setUpdatedChore, 
	updatedDesc, 
	setUpdatedDesc, 
	updatedDuration, 
	setUpdatedDuration
}) => {

	const inputRef = useRef<HTMLInputElement>(null);
	const inputRef2 = useRef<HTMLInputElement>(null);
	const inputRef3 = useRef<HTMLInputElement>(null);
	const [edit, setEdit] = useState(true);
	const [confirm, setConfirm] = useState(false);
	const [imageSrc, setImageSrc] = useState('img/ico/broom.png');

	useEffect (() => {
		const fetchImageData = async () =>{
			if(name){
		  		const imageUrl = await fetchImage(name);
		 		if(imageUrl)
		  			setImageSrc(imageUrl);
			}
		}
		if(name != '')
		  fetchImageData();
		else
			setImageSrc('img/ico/broom.png');
	  }, [name]);

	let valoare;

	const handleConfirm = () => {
		setConfirm(!confirm);
	}

	const handleButton = () => {
		setTimeout(() => {
			if(inputRef.current) {inputRef.current.value = '';}
			if(inputRef2.current) {inputRef2.current.value = '';}
			if(inputRef3.current) {inputRef3.current.value = '';}
		}, 30);
	};

	const handleEdit = () => {
		valoare = name;
		console.log(valoare);
			if(name !== null)
			setUpdatedChore(name);
			setEdit(!edit);
			if(name !== null && setNewChore){
					setNewChore(name);
			}
	}

	const handleSubmitEdit = (e : React.FormEvent<HTMLFormElement>, oldName: string) => {
			e.preventDefault();
			if(handleSubmitUpdate){
					handleSubmitUpdate(e, oldName);}
			handleEdit();
	}

	return (
		<>
			{imageSrc === 'img/ico/broom.png' && (
				<form className="formStyleChores" onSubmit={handleSubmit}>
					<input
						autoFocus
						ref={inputRef}
						type="text"
						placeholder="Title"
						required
						value={newChore}
						onChange={(e) => {if(setNewChore) setNewChore(e.target.value)}}
					/>
					<input
						autoFocus
						ref={inputRef2}
						type="text"
						placeholder="Details"
						value={newDesc}
						onChange={(e) => {if(setNewDesc) setNewDesc(e.target.value)}}
					/>
					<input
						autoFocus
						ref={inputRef3}
						type="text"
						placeholder="Deadline"
						value={newDuration}
						onChange={(e) => {if(setNewDuration) setNewDuration(e.target.value)}}
					/>
					<button type="submit" onClick={handleButton}>Add chore</button>
				</form>
			)}
			{imageSrc!== 'img/ico/broom.png' && (
				<>
					<img src={imageSrc} alt="" />
					{edit && !confirm &&
						<div className="bottom">
							<div className="textStyleChores">
								<h1>{name}</h1>
								<div className="details">
										<h2>Details: </h2>
										<p>{description}</p>
								</div>
								<div className ="details">
										<h2>Deadline: </h2>
										<p>{duration}</p>
								</div>
							</div>
							<div className="buttonContainerChores">
								<button className="buttonStyle" onClick={handleConfirm}>Remove</button>
								<button className="button2Style" onClick={handleEdit}>Edit</button>
								<button className="button3Style" onClick={() => {if(name) handleDone(name)}}>Done</button>
							</div>
						</div>
					}
					{edit && confirm &&
						<div className="bottomConfirm">
							<div className="textStyleConfirm">
								<h1>Are you sure you want to delete this chore?</h1>
							</div>
							<div className="buttonContainerConfirm">
								<button className="button3Style" onClick={() => {if(name) handleDelete(name); handleConfirm();}}>Yes</button>
								<button className="buttonStyle" onClick={handleConfirm}>No</button>
							</div>
						</div>
					}
					{!edit && 
						<>
							<form className="editStyles" onSubmit={(e) => {if(name) handleSubmitEdit(e,name)}}>
								<div className="bottom">
									<div className="textStyleChores">
										<input
											type="text"
											placeholder="Name"
											value={updatedChore}
											ref={inputRef}
											onChange={(e) => {console.log(e.target.value); if(setUpdatedChore) setUpdatedChore(e.target.value)}}
										/>
										<div className="details">
											<h2>Details: </h2>
											<input
												type="text"
												placeholder="Details"
												value={updatedDesc}
												ref={inputRef2}
												onChange={(e) => {if(setUpdatedDesc) setUpdatedDesc(e.target.value)}}
											/>
										</div>
										<div className ="duration">
											<h2>Deadline: </h2>
											<input
												type="text"
												placeholder="Deadline"
												value={updatedDuration}
												ref={inputRef3}
												onChange={(e) => {if(setUpdatedDuration) setUpdatedDuration(e.target.value)}}
											/>
										</div>
									</div>
									<div className="buttonContainerChores">
										<button className="buttonStyle" onClick={() => {if(name) handleDelete(name)}}>Remove</button>
										<button className="button2Style" onClick={handleEdit}>Return</button>
										<button className="button4Style" type="submit">Confirm</button>
									</div>
								</div>
							</form>
						</>
					}
				</>
			)}
		</>
  )
}

export default Chore;