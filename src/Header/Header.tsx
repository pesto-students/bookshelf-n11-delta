import {Avatar, Badge, Divider, Stack} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {makeStyles} from "@material-ui/core/styles";
import styles from "./Header.module.scss";
import SearchBar from "material-ui-search-bar";
import {AppContext} from "../App/App";
import {useContext} from "react";
import {UPDATE_SEARCH_TEXT} from "../shared/immutables/action-types";

const useStyles = makeStyles((theme) => ({
  badge: {
    fontSize: "10px",
  },
}));

function Header(): JSX.Element {
  const classes = useStyles();
  const {dispatchSearchAction} = useContext(AppContext);

  const changeInputValue = (newValue) => {
    dispatchSearchAction({type: UPDATE_SEARCH_TEXT, data: newValue});
  };

  const clearSearchBar = () => {
    dispatchSearchAction({type: UPDATE_SEARCH_TEXT, data: ""});
  };

  return (
    <div className={styles.headerGroup}>
      <div className={styles.header}>
        <h3 className={styles.appName}>BOOKSHELF</h3>
        <SearchBar
          style={{
            width: "50%",
            height: "36px",
          }}
          onChange={changeInputValue}
          onCancelSearch={clearSearchBar}
        />
        <div className={styles.topRightBanner}>
          <Stack direction="row" spacing={2}>
            <Avatar sx={{width: 28, height: 28}} src="/broken-image.jpg" />
            <Badge
              classes={{badge: classes.badge}}
              badgeContent={1}
              color="error"
            >
              <ShoppingCartIcon style={{color: "white"}} />
            </Badge>
          </Stack>
        </div>
      </div>
      <Divider className={styles.divider} />
    </div>
  );
}

export default Header;
