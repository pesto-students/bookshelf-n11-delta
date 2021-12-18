import {createContext, useEffect, useReducer, useState} from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

import {
  AddBook,
  AdminHome,
  BookDetail,
  BookList,
  Dashboard,
  Footer,
  Header,
  NotFound,
  UserEntry,
  UserList,
} from "../components";
import {UserProfile} from "../components/UserProfile/UserProfile";
import axios from "../core/axios";
import environment from "../Environment/environment";
import {IAppContext, RootReducer} from "../reducers";
import {APP_ACTIONS} from "../shared/immutables";
import styles from "./App.module.scss";

const initialAppState: IAppContext = {
  searchText: "",
  isUserLoggedIn: false,
  isSuperAdmin: false,
  userEntry: null,
  open: false,
  user: null,
  books: [],
};

export const AppContext = createContext(null);

function App() {
  const [appState, dispatchAppAction] = useReducer(
    RootReducer,
    initialAppState
  );

  const [isAdmin, setIsAdmin] = useState(appState.isSuperAdmin);

  useEffect(() => {
    if (appState.isUserLoggedIn) {
      axios
        .get(`${environment.API_URL}/me`)
        .then(({data}) => {
          dispatchAppAction({type: APP_ACTIONS.REGISTER_USER_INFO, data});
        })
        .catch((err) => console.log(err));
    }
  }, [appState.isUserLoggedIn]);

  useEffect(() => {
    setIsAdmin(appState.isSuperAdmin);
  }, [appState.isSuperAdmin]);

  return (
    <Router>
      <div className={styles.pageContainer}>
        <AppContext.Provider value={{appState, dispatchAppAction}}>
          <Header />
          <div className={styles.wrapper}>
            <Routes>
              <Route
                path="/"
                element={isAdmin ? <AdminHome /> : <Dashboard />}
              />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/books/new" element={<AddBook />} />
              <Route path="/books/:id" element={<BookDetail />} />
              {isAdmin && (
                <>
                  <Route path="/users" element={<UserList />} />
                  <Route path="/books" element={<BookList />} />
                </>
              )}
              <Route path="*" element={<NotFound />} />
            </Routes>
            {!!appState.userEntry && (
              <UserEntry showForm={appState.userEntry} />
            )}
          </div>
        </AppContext.Provider>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
