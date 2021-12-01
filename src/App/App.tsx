import {createContext, useReducer} from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

import Dashboard from "../Dashboard/Dashboard";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import {IAppContext, RootReducer} from "../reducers";

const initialSearchTextState: IAppContext = {
  searchText: "",
};

export const AppContext = createContext(null);

function App() {
  const [searchState, dispatchSearchAction] = useReducer(
    RootReducer,
    initialSearchTextState
  );

  return (
    <Router>
      <>
        <AppContext.Provider value={{searchState, dispatchSearchAction}}>
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </AppContext.Provider>
        <Footer />
      </>
    </Router>
  );
}

export default App;
