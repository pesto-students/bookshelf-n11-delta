import {createContext, useReducer} from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import Dashboard from "../Dashboard/Dashboard";

import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import {UPDATE_SEARCH_TEXT} from "../shared/immutables/action-types";
import styles from "./App.module.scss";

const initialSearchFieldState = {
  searchField: "",
};

export const AppContext = createContext(null);

const reducer = (state, action) => {
  const newState = {...state};
  switch (action.type) {
    case UPDATE_SEARCH_TEXT:
      newState.searchField = action.data;
      break;
    default:
    // do anything
  }
  return newState;
};

function App() {
  const [searchText, dispatchSearchAction] = useReducer(reducer, initialSearchFieldState);

  return (
    <Router>
      <div className={styles.App}>
        <AppContext.Provider value={{searchText, dispatchSearchAction}}>
          <Header />
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </AppContext.Provider>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
