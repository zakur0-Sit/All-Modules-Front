import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ChoreApp from './Pages/ChoreList';
import InventoryApp from './Pages/InventoryList';
import ShoppingApp from './Pages/ShoppingList';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/chores" element={<ChoreApp />} />
        <Route path="/inventory" element={<InventoryApp />} />
        <Route path="/shopping" element={<ShoppingApp />} />
        <Route
          path="/"
          element={
            <div>
              <h1>Home Page</h1>
              <p>Welcome to the main project. Choose a project:</p>
              <ul>
                <li><Link to="/chores">Chore List</Link></li>
                <li><Link to="/inventory">Inventory List</Link></li>
                <li><Link to="/shopping">Shopping List</Link></li>
              </ul>
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
