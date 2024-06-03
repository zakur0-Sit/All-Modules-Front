import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import Shopping from './Components/Shopping/Shopping';
import { EfficientRoute } from './Pages/EfficientRoute.jsx';

const App: React.FC = () => {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path='/efficient-route' element={<EfficientRoute />} />
                    <Route path='/shopping-list' element={<Shopping />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
