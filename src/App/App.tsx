import axios from 'axios';
import {
  createContext,
  lazy,
  Suspense,
  useEffect,
  useReducer,
  useState,
} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import {
  AdminHome,
  Dashboard,
  Footer,
  Header,
  UserEntry,
  NotFound,
} from '../components';
import appAxios from '../core/axios';
import environment from '../Environment/environment';
import {IAppContext, RootReducer} from '../reducers';
import {Overlay} from '../shared/components';
import {APP_ACTIONS, REFRESH_TOKEN} from '../shared/immutables';
import styles from './App.module.scss';

const initialAppState: IAppContext = {
  searchText: '',
  isUserLoggedIn: true,
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
    initialAppState,
  );

  const [isAdmin, setIsAdmin] = useState(appState.isSuperAdmin);

  useEffect(() => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    if (refreshToken) {
      axios
        .post(`${environment.API_URL}/refresh`, {refreshToken})
        .then(({data}) => dispatchAppAction({type: APP_ACTIONS.LOGIN, data}))
        .catch(() => dispatchAppAction({type: APP_ACTIONS.LOGOUT}));
    } else {
      dispatchAppAction({type: APP_ACTIONS.LOGOUT});
    }
  }, []);

  useEffect(() => {
    if (appState.isUserLoggedIn) {
      appAxios
        .get(`${environment.API_URL}/me`)
        .then(({data}) => {
          dispatchAppAction({type: APP_ACTIONS.REGISTER_USER_INFO, data});
        })
        .catch(err => console.log(err));

      appAxios.get(`${environment.API_URL}/cart`).then(({data}) => {
        dispatchAppAction({type: APP_ACTIONS.SET_CART, data});
      });
    }
  }, [appState.isUserLoggedIn]);

  useEffect(() => {
    setIsAdmin(appState.isSuperAdmin);
  }, [appState.isSuperAdmin]);

  // admin routes
  const UserList = lazy(() => import('../components/Admin/UserList'));
  const BookList = lazy(() => import('../components/Admin/BookList'));
  const AddBook = lazy(() => import('../components/AddBook/AddBook'));

  // user routes
  const UserProfile = lazy(
    () => import('../components/UserProfile/UserProfile'),
  );
  const BookDetail = lazy(() => import('../components/BookDetail/BookDetail'));
  const CartList = lazy(() => import('../components/CartList/CartList'));
  const Cart = lazy(() => import('../components/Cart/Cart'));
  const StripeContainer = lazy(
    () => import('../components/Payment/StripeContainer/StripeContainer'),
  );

  // common routes
  const Orders = lazy(() => import('../components/Orders/Orders'));
  const AboutUs = lazy(
    () => import('../components/FooterLinks/AboutUs/AboutUs'),
  );
  const TermsAndConditions = lazy(
    () =>
      import('../components/FooterLinks/TermsAndConditions/TermsAndConditions'),
  );
  const Payments = lazy(
    () => import('../components/FooterLinks/Payments/Payments'),
  );

  return (
    <Router>
      <div className={styles.pageContainer}>
        <AppContext.Provider value={{appState, dispatchAppAction}}>
          <Header />
          <div className={styles.wrapper}>
            <Suspense fallback={<Overlay showBackdrop={true} />}>
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
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/terms" element={<TermsAndConditions />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
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
