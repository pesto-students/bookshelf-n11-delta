import {createContext, useEffect, useReducer} from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

import {
  AddBook,
  BookDetail,
  Dashboard,
  Footer,
  Header,
  UserEntry,
  AdminHome,
  UserList,
  BookList,
} from "../components";
import {UserProfile} from "../components/UserProfile/UserProfile";
import {IAppContext, RootReducer} from "../reducers";
import styles from "./App.module.scss";
import environment from "../Environment/environment";
import {APP_ACTIONS} from "../shared/immutables";
import axios from "../core/axios";

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

  useEffect(() => {
    if (appState.isUserLoggedIn) {
      axios
        .get(`${environment.API_URL}/me`)
        .then(({data}) =>
          dispatchAppAction({type: APP_ACTIONS.REGISTER_USER_INFO, data})
        )
        .catch((err) => console.log(err));
    }
  }, [appState.isUserLoggedIn]);

  return (
    <Router>
      <div className={styles.pageContainer}>
        <AppContext.Provider value={{appState, dispatchAppAction}}>
          <Header />
          <div className={styles.wrapper}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/books/new" element={<AddBook />} />
              <Route path="/books/:id" element={<BookDetail />} />
              <Route path="/admin/home" element={<AdminHome />} />
              <Route path="/admin/users" element={<UserList />} />
              <Route path="/admin/books" element={<BookList />} />
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
