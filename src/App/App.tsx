import {createContext, useReducer} from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

import {Dashboard, Header, Footer, UserEntry} from "../components";
import {IAppContext, RootReducer} from "../reducers";

const initialAppState: IAppContext = {
  searchText: "",
  isUserLoggedIn: false,
  userEntry: null,
  open: false,
  token: {},
};

export const AppContext = createContext(null);

function App() {
  const [appState, dispatchAppAction] = useReducer(
    RootReducer,
    initialAppState
  );

  return (
    <Router>
      <>
        <AppContext.Provider value={{appState, dispatchAppAction}}>
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
          {!!appState.userEntry && <UserEntry showForm={appState.userEntry} />}
        </AppContext.Provider>
        <Footer />
      </>
    </Router>
  );
}

export default App;
