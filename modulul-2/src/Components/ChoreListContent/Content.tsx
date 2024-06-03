import React, { useState, useEffect, useRef } from 'react';
import './Content.css'
import placeholder from './pictures/sweep.jpg'
import APIRequest from '../APIRequest/APIRequest';
import ChoreLists from '../ChoreLists/ChoreLists';
import { ChoresList, ChoreProps } from '../Chore/Chore';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


interface ContentProps {
  chores: ChoreProps;
  choresHistory: ChoreProps;
  newChore: string;
  newDesc: string;
  newDuration: string;
  updatedChore: string;
  updatedDesc: string;
  updatedDuration: string;
  setChores: React.Dispatch<React.SetStateAction<ChoreProps>>;
  setChoresHistory: React.Dispatch<React.SetStateAction<ChoreProps>>;
  setNewChore: React.Dispatch<React.SetStateAction<string>>;
  setNewDesc: React.Dispatch<React.SetStateAction<string>>;
  setNewDuration: React.Dispatch<React.SetStateAction<string>>;
  setUpdatedChore: React.Dispatch<React.SetStateAction<string>>;
  setUpdatedDesc: React.Dispatch<React.SetStateAction<string>>;
  setUpdatedDuration: React.Dispatch<React.SetStateAction<string>>;
  setFetchError: React.Dispatch<any>; 
}

const Content: React.FC<ContentProps> = ({ 
  choresHistory, 
  chores, 
  newChore, 
  newDesc, 
  newDuration, 
  updatedChore, 
  updatedDesc, 
  updatedDuration,  
  setChores, 
  setChoresHistory, 
  setNewChore, 
  setNewDesc, 
  setNewDuration, 
  setUpdatedChore, 
  setUpdatedDesc, 
  setUpdatedDuration, 
  setFetchError
}) =>{

  const API_URL = 'http://localhost:8081/chores';

  const saveChores = (newChores : ChoresList[]) => {
    setChores(prevChores => {
      return {...prevChores, choresList: newChores};  
    });
  }
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!newChore) {
      setNewDesc('No details');
      setNewDuration('No deadline');
      return;}
    addChore(newChore, newDesc, newDuration, 1);
    setNewChore('');
    setNewDesc("No details");
    setNewDuration("No deadline");
  }

  const handleSubmitUpdate = (e : React.FormEvent<HTMLFormElement>, oldChore: string) => {
    e.preventDefault();
    handleUpdate(oldChore ,updatedChore, updatedDesc, updatedDuration);
    setUpdatedChore(oldChore);
    setUpdatedDesc('No details');
    setUpdatedDuration('No deadline');
  }

  const handleUpdate = async (oldName: string, updatedName: string, description: string, duration: string) => {
    if(chores.choresList !== undefined){
      const listChores = chores.choresList.map((chore) => chore.name === oldName ? {...chore, name: updatedName, description, personID: -1, duration} : chore);
      saveChores(listChores);

      const targetChore = listChores.filter((chore) => chore.name === updatedName);
      const index = chores.choresList.findIndex(chore => chore.name === oldName);
      const options = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: targetChore[0].name,
          description: targetChore[0].description,
          personID: -1,
          duration: targetChore[0].duration
        })
      }
      const response = await APIRequest(`${API_URL}/changeItemDetails?id=${index}&name=${targetChore[0].name}&description=${targetChore[0].description}&personID="-1"&duration=${targetChore[0].duration}`, options);   
      if(response)
        setFetchError(response);
    }
  }

  const addChore = async (name: string, description: string, duration: string, addToHistoryCheck: number) => {
    if(name.trim() === ''){
      alert('Please enter a title for the chore');
    } else {
      const newChoreItem = {id: undefined, name, description, personID: -1, duration, imageSrc: '' };
      if (!chores) {
        const listChores = [chores, newChoreItem];
        saveChores(listChores);
      }
      else{
        const listChores = [...chores.choresList, newChoreItem];
        saveChores(listChores);
      }
      if(addToHistoryCheck === 1){
        if(!choresHistory){
          const listChoresHistory = [choresHistory, newChoreItem];
          setChoresHistory(prevChoresHistory => {
            return {...prevChoresHistory, choresList: listChoresHistory};  
          });
        }
        else{
          const listChoresHistory = [...choresHistory.choresList, newChoreItem];
          setChoresHistory(prevChoresHistory => {
            return {...prevChoresHistory, choresList: listChoresHistory};  
          });
        }
      }
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newChoreItem)
      }
      const response = await APIRequest(`${API_URL}/addChore?name=${name}&description=${description}&duration=${duration}&addToHistory=${addToHistoryCheck}`, options);
      if(response)
        setFetchError(response);
    }
  }
  const handleDelete = async (name : string) => {
    if(chores.choresList !== undefined){
      const indexChore = chores.choresList.findIndex(item => item.name === name);
      const listChores = chores.choresList.filter((item, index) => index !== indexChore);
      saveChores(listChores);

      const options = {method: 'DELETE'};
      const response = await APIRequest(`${API_URL}/removeChore?id=${indexChore}`, options);
      if(response)
        setFetchError(response);
    }
  }

  const handleDone = async (name : string) => {
    if(chores.choresList !== undefined){
      toast.success("Chore Completed, Great Job!👍");
      const indexChore = chores.choresList.findIndex(item => item.name === name);
      const listChores = chores.choresList.filter((item, index) => index !== indexChore);
      saveChores(listChores);

      const options = {method: 'DELETE'};
      const response = await APIRequest(`${API_URL}/removeChore?id=${indexChore}`, options);
      if(response)
        setFetchError(response);
    }
  }

  const handleClearHistory = async () => {
    console.log('stergemhistory');
    setChoresHistory({choresList: []});
    const options = {method: 'DELETE'};
    const response = await APIRequest(`${API_URL}/clearHistory`, options);
    if(response)
      setFetchError(response);
  }

  const handleClearHistoryChore = async (name: string) => {
    console.log('stergem');
    if(choresHistory.choresList !== undefined){
      const indexChore = choresHistory.choresList.findIndex(item => item.name === name);
      const listChores = choresHistory.choresList.filter((item, index) => index !== indexChore);
      
      setChoresHistory(prevChoresHistory => {
        return {...prevChoresHistory, choresList: listChores};  
      });

      const options = {method: 'DELETE'};
      const response = await APIRequest(`${API_URL}/removeHistoryChore?id=${indexChore}`, options);
      if(response)
        setFetchError(response);
    }
  }

  return(
    <ChoreLists
      chores={chores}
      choresHistory={choresHistory}
      addChore={addChore}
      handleDelete={handleDelete}
      handleDone={handleDone}
      handleClearHistory={handleClearHistory}
      handleClearHistoryChore={handleClearHistoryChore}
      handleSubmit={handleSubmit}
      handleSubmitUpdate={handleSubmitUpdate}
      handleUpdate={handleUpdate}
      setNewChore={setNewChore}
      setNewDesc={setNewDesc}
      setNewDuration={setNewDuration}
      setUpdatedChore={setUpdatedChore}
      setUpdatedDesc={setUpdatedDesc}
      setUpdatedDuration={setUpdatedDuration}
    />
  );
};

export default Content;
