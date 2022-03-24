import {makeStyles} from '@material-ui/core';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {Badge, Box, Divider, Stack} from '@mui/material';
import SearchBar from 'material-ui-search-bar';
import {useContext} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';

import {AppContext} from '../../App/App';
import logo from '../../assets/bookshelf.svg';
import {useAppSelector} from '../../redux';
import {cartSelectors} from '../../redux/slices';
import {APP_ACTIONS, DASHBOARD_ROUTE} from '../../shared/immutables';
import styles from './Header.module.scss';
import {UserAccount} from './UserAccount';

const useStyles = makeStyles(() => ({
  badge: {
    fontSize: '10px',
  },
}));

export const Header = () => {
  const classes = useStyles();
  const {dispatchAppAction} = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useAppSelector(state => state.auth.user);
  const cartCount = useAppSelector(state =>
    cartSelectors.selectTotal(state.cart),
  );
  const cartItems = useAppSelector(state =>
    cartSelectors.selectAll(state.cart),
  );

  const changeInputValue = newValue => {
    dispatchAppAction({type: APP_ACTIONS.UPDATE_SEARCH_TEXT, data: newValue});
    if (location.pathname != DASHBOARD_ROUTE) {
      navigate(DASHBOARD_ROUTE);
    }
  };

  const clearSearchBar = () => {
    changeInputValue('');
  };

  const cartProcessing = () => {
    if (!!currentUser) {
      navigate(`/cart`, {
        state: {
          cartItems: cartItems,
        },
      });
    } else {
      toast.error('Please login to view cart items');
    }
  };

  return (
    <div className={styles.headerGroup}>
      <div className={styles.header}>
        <img
          className={styles.appName}
          src={logo}
          alt="bookshelf"
          onClick={() => {
            navigate(DASHBOARD_ROUTE);
          }}
        />
        {!currentUser?.isSuperAdmin && (
          <Box className={styles.searchBar}>
            <SearchBar
              style={{
                height: '100%',
              }}
              onChange={changeInputValue}
              onCancelSearch={clearSearchBar}
            />
          </Box>
        )}
        <div className={styles.topRightBanner}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <UserAccount />
            {!currentUser?.isSuperAdmin && (
              <Badge
                classes={{badge: classes.badge}}
                badgeContent={cartCount}
                color="error"
              >
                <ShoppingCartIcon
                  style={{color: 'white'}}
                  onClick={cartProcessing}
                />
              </Badge>
            )}
          </Stack>
        </div>
      </div>
      <Divider />
    </div>
  );
};
