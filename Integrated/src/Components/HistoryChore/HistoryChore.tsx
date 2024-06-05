import React, { useState, useEffect, useRef } from 'react';
import '../ChoreListContent/Content.css';
import APIRequest from '../APIRequest/APIRequest';
import { fetchImage } from '../../pexelsApi';

export type ChoresList = {
  name : string | null;
  description: string;
  duration: string;
}

export type ChoreProps = {
  choresList : ChoresList[];
}

interface ChoreDeclareProps {
	addChore: (name: string, description: string, duration: string, addToHistoryCheck: number) => void;
	handleClearHistoryChore: (name: string) => void;
}

const HistoryChore: React.FC<ChoresList & ChoreDeclareProps> = ({
	name, 
	description, 
	duration, 
	addChore, 
	handleClearHistoryChore
}) => {

	const handleAddToHistory = (name: string, desc: string, duration: string) => {
			addChore(name, desc, duration, 0);
	}

	const [confirm, setConfirm] = useState(false);
	const [imageSrc, setImageSrc] = useState('');

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
	  }, [name]);

	const handleConfirm = () => {
			setConfirm(!confirm);
	}

	return (
		<>
			{imageSrc!== null && (
				<>
					<img src={imageSrc} alt="" />
					{confirm &&
						<div className="hbottom">
							<div className="htextStyle">
									<h3>Are you sure you want to delete this chore from history?</h3>
							</div>
							<div className="buttonContainerConfirm">
								<button className="removeFromHistory" onClick={() => {if(name) handleClearHistoryChore(name); handleConfirm();}}>Yes</button>
								<button className="removeFromHistory" onClick={handleConfirm}>No</button>
							</div>
						</div>
					}
					{!confirm &&
						<div className="hbottom">
							<div className="htextStyle">
								<h3>{name}</h3>
								<div className="hdetails">
										<h3>Details: </h3>
										<p>{description}</p>
								</div>
								<div className ="hduration">
									<h3>Deadline: </h3>
									<p>{duration}</p>
								</div>
							</div>
							<div className="buttonContainerChores">
								<button className="addFromHistory" onClick={() => {if(name) handleAddToHistory(name, description, duration)}}>Add Chore</button>
								<button className="removeFromHistory" onClick={handleConfirm}>Clear Chore</button>
							</div>
						</div>
					}
				</>
			)}
		</>
  )
}

export default HistoryChore;