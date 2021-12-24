import {makeStyles} from "@material-ui/core";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {Badge, Divider, Stack} from "@mui/material";
import SearchBar from "material-ui-search-bar";
import {useContext} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

import {AppContext} from "../../App/App";
import {APP_ACTIONS, DASHBOARD_ROUTE} from "../../shared/immutables";
import styles from "./Header.module.scss";
import {UserAccount} from "./UserAccount";

const useStyles = makeStyles(() => ({
  badge: {
    fontSize: "10px",
  },
}));

toast.configure();
export const Header = () => {
  const classes = useStyles();
  const {appState, dispatchAppAction} = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  const changeInputValue = (newValue) => {
    dispatchAppAction({type: APP_ACTIONS.UPDATE_SEARCH_TEXT, data: newValue});
    if (location.pathname != DASHBOARD_ROUTE) {
      navigate(DASHBOARD_ROUTE);
    }
  };

  const clearSearchBar = () => {
    changeInputValue("");
  };

  const cartProcessing = () => {
    if (appState.isUserLoggedIn) {
      navigate(`/cart`, {
        state: {
          cartItems: appState.cartItems,
        },
      });
    } else {
      toast.error("Please login to view cart items");
    }
  };

  return (
    <div className={styles.headerGroup}>
      <div className={styles.header}>
        <h3
          className={styles.appName}
          onClick={() => {
            navigate(DASHBOARD_ROUTE);
          }}
        >
          BOOKSHELF
        </h3>
        {!appState.isSuperAdmin && (
          <SearchBar
            style={{
              width: "50%",
              height: "36px",
            }}
            onChange={changeInputValue}
            onCancelSearch={clearSearchBar}
          />
        )}
        <div className={styles.topRightBanner}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <UserAccount />
            {!appState.isSuperAdmin && (
              <Badge
                classes={{badge: classes.badge}}
                badgeContent={appState.cartItems.length}
                color="error"
              >
                <ShoppingCartIcon
                  style={{color: "white"}}
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
