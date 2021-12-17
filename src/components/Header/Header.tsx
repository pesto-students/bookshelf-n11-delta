import { makeStyles } from "@material-ui/core";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Badge, Divider, Stack } from "@mui/material";
import SearchBar from "material-ui-search-bar";
import { useContext } from "react";

import { AppContext } from "../../App/App";
import { APP_ACTIONS } from "../../shared/immutables";
import styles from "./Header.module.scss";
import { UserAccount } from "./UserAccount";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  badge: {
    fontSize: "10px",
  },
}));

export const Header = () => {
  const classes = useStyles();
  const { dispatchAppAction } = useContext(AppContext);
  const navigate = useNavigate();

  const changeInputValue = (newValue) => {
    dispatchAppAction({ type: APP_ACTIONS.UPDATE_SEARCH_TEXT, data: newValue });
  };

  const clearSearchBar = () => {
    changeInputValue("");
  };

  return (
    <div className={styles.headerGroup}>
      <div className={styles.header}>
        <h3
          className={styles.appName}
          onClick={() => {
            navigate("/");
          }}
        >
          BOOKSHELF
        </h3>
        <SearchBar
          style={{
            width: "50%",
            height: "36px",
          }}
          onChange={changeInputValue}
          onCancelSearch={clearSearchBar}
        />
        <div className={styles.topRightBanner}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <UserAccount />
            <Badge
              classes={{ badge: classes.badge }}
              badgeContent={1}
              color="error"
            >
              <ShoppingCartIcon style={{ color: "white" }} />
            </Badge>
          </Stack>
        </div>
      </div>
      <Divider />
    </div>
  );
};
