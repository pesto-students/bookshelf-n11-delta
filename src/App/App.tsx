import {createContext, useEffect, useReducer, useState} from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";

import {
  AddBook,
  AdminHome,
  BookDetail,
  BookList,
  Cart,
  CartList,
  Dashboard,
  Footer,
  Header,
  NotFound,
  Orders,
  Payments,
  StripeContainer,
  TermsAndConditions,
  UserEntry,
  UserList,
} from "../components";
import {UserProfile} from "../components/UserProfile/UserProfile";
import axios from "../core/axios";
import environment from "../Environment/environment";
import {IAppContext, RootReducer} from "../reducers";
import {APP_ACTIONS, REFRESH_TOKEN} from "../shared/immutables";
import {CartItem} from "../shared/models";
import styles from "./App.module.scss";

const initialAppState: IAppContext = {
  searchText: "",
  isUserLoggedIn: false,
  isSuperAdmin: false,
  userEntry: null,
  open: false,
  user: null,
  books: [],
  cartItems: [],
};

export const AppContext = createContext(null);

function App() {
  const [appState, dispatchAppAction] = useReducer(
    RootReducer,
    initialAppState
  );

  const [isAdmin, setIsAdmin] = useState(appState.isSuperAdmin);

  useEffect(() => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    if (refreshToken) {
      axios
        .post(`${environment.API_URL}/refresh`, {refreshToken})
        .then(({data}) => dispatchAppAction({type: APP_ACTIONS.LOGIN, data}))
        .catch((err) => console.log(err));
    }
  }, []);

  useEffect(() => {
    if (appState.isUserLoggedIn) {
      axios
        .get(`${environment.API_URL}/me`)
        .then(({data}) => {
          dispatchAppAction({type: APP_ACTIONS.REGISTER_USER_INFO, data});
        })
        .catch((err) => console.log(err));

      axios
        .get(`${environment.API_URL}/cart`)
        .then(({data}) => {
          const {orderDetails} = data;
          const items = [];
          orderDetails.forEach((order) => {
            const cartItem: Partial<CartItem> = {
              ...order.bookId,
              id: order._id,
              qtyOrdered: order.quantity,
            };
            items.push(cartItem);
          });
          dispatchAppAction({type: APP_ACTIONS.SET_CART, data: items});
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
              {isAdmin ? (
                <>
                  <Route path="/users" element={<UserList />} />
                  <Route path="/books" element={<BookList />} />
                  <Route path="/books/new" element={<AddBook />} />
                </>
              ) : (
                <>
                  <Route path="/profile" element={<UserProfile />} />
                  <Route path="/books/:id" element={<BookDetail />} />
                  <Route path="/cart" element={<CartList />} />
                  <Route path="/buy" element={<Cart />} />
                  <Route path="/payment" element={<StripeContainer />} />
                </>
              )}
              <Route path="/orders" element={<Orders />} />
              <Route path="/terms" element={<TermsAndConditions />} />
              <Route path="/payments" element={<Payments />} />
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
