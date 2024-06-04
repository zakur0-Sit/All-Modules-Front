import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './Pages/Home';
import { SignIn } from './Pages/SignIn';
import { SignUp } from './Pages/SignUp';
import { Account } from './Pages/Account';
import { AddHousehold } from './Pages/AddHousehold';
import { HouseholdProvider } from './HouseholdContext';
import { CodeEmailPage } from './Pages/CodeEmail';
import { PreferencesAndAllergens } from './Pages/PreferencesAndAllergens';
import { Household } from './Pages/Household';
import { HouseholdManage } from './Pages/HouseholdManage';
import ChoreListPage from './Pages/ChoreList';
import InvetoryListPage from './Pages/InventoryList';
import ShoppingListPage from './Pages/ShoppingList';

export function App() {
  return (
    <HouseholdProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/account" element={<Account />} />
          <Route path="/addhousehold" element={<AddHousehold />} />
          <Route path="/codeemail" element={<CodeEmailPage />} />
          <Route path="/preferences" element={<PreferencesAndAllergens />} />
          <Route path="/household" element={<Household />} />
          <Route path="/household-manage" element={<HouseholdManage />} />
          <Route path="/chores" element={<ChoreListPage />} />
          <Route path="/inventory" element={<InvetoryListPage />} />
          <Route path="/shopping" element={<ShoppingListPage />} />
        </Routes>  
      </Router>    
    </HouseholdProvider>
  );
}
