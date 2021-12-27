import {Button, MenuItem, Select} from "@material-ui/core";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import {Grid} from "@mui/material";
import {useContext, useEffect, useReducer, useState} from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Carousel from "react-material-ui-carousel";

import {AppContext} from "../../App/App";
import banner from "../../assets/banner.svg";
import info from "../../assets/info.png";
import axios from "../../core/axios";
import environment from "../../Environment/environment";
import {DashboardReducer, IDashboardState} from "../../reducers";
import {Overlay} from "../../shared/components";
import {SortTypes} from "../../shared/enums";
import {APP_ACTIONS, DASHBOARD_ACTIONS} from "../../shared/immutables";
import {Book} from "../../shared/models";
import {BookCard} from "../BookCard/BookCard";
import FilterDrawer from "../FilterDrawer/FilterDrawer";
import {CAROUSEL_IMAGES} from "./carousel-images";
import styles from "./Dashboard.module.scss";

const emptyBooksList: Book[] = [];

const initialDashboardState: IDashboardState = {
  books: emptyBooksList,
  searchFilteredBooks: emptyBooksList,
  filteredBooks: emptyBooksList,
  dashboardFilteredBooks: emptyBooksList,
  isLoading: true,
  sortFilter: SortTypes.RELEVANCE,
  appliedFilters: {},
  hasMore: true,
};

export const Dashboard = () => {
  const {
    appState: {searchText, books},
    dispatchAppAction,
  } = useContext(AppContext);
  const [state, dispatch] = useReducer(DashboardReducer, initialDashboardState);

  const [filterState, setFilterState] = useState(false);

  const fetchMoreData = () => {
    setTimeout(() => {
      dispatch({type: DASHBOARD_ACTIONS.UPDATE_DASHBOARD_SCROLL});
    }, environment.LOADING_DELAY);
  };

  const handleChange = (event) => {
    dispatch({
      type: DASHBOARD_ACTIONS.SORT_ACTION,
      data: event.target.value,
    });
  };

  function getAllBooks() {
    dispatch({
      type: DASHBOARD_ACTIONS.GET_ALL_BOOKS,
    });
    if (books.length) {
      setBooks(books);
    } else {
      axios
        .get(`${environment.API_URL}/books`)
        .then(({data}) => {
          setBooks(data.books);
          dispatchAppAction({type: APP_ACTIONS.SET_BOOKS, data: data.books});
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  const setBooks = (bookList) => {
    dispatch({type: DASHBOARD_ACTIONS.SET_ALL_BOOKS, data: bookList});
  };

  useEffect(() => {
    if (!state.books.length) {
      getAllBooks();
    }
    dispatch({
      type: DASHBOARD_ACTIONS.SEARCH_BOOKS,
      searchOn: searchText,
    });
  }, [searchText]);

  const {
    isLoading,
    sortFilter,
    searchFilteredBooks,
    hasMore,
    dashboardFilteredBooks,
  } = state;

  const gridLoader = <div className={styles.booksGridLoader}>Loading...</div>;

  const booksGrid = (
    <InfiniteScroll
      dataLength={dashboardFilteredBooks.length}
      next={fetchMoreData}
      hasMore={hasMore}
      loader={gridLoader}
    >
      <Grid container className={styles.booksGrid} spacing={2}>
        {dashboardFilteredBooks.map((book) => (
          <Grid item key={book._id.toString()} xs={3}>
            <BookCard book={book} />
          </Grid>
        ))}
      </Grid>
    </InfiniteScroll>
  );

  return (
    <>
      {isLoading ? (
        <>
          <img src={banner} className={styles.banner} alt="banner" />
          <Overlay showBackdrop={true} />
        </>
      ) : (
        <>
          <Carousel stopAutoPlayOnHover={true}>
            {CAROUSEL_IMAGES.map((item, i) => (
              <img src={item} className={styles.banner} alt="banner" key={i} />
            ))}
          </Carousel>
          <div className={styles.toolbar}>
            <Button
              onClick={() => setFilterState(!filterState)}
              className={styles.filterBtn}
              startIcon={<FilterAltOutlinedIcon />}
            />
            <Select
              variant="standard"
              labelId="sort-by-select-label"
              id="sort-by"
              value={sortFilter}
              label="Sort by"
              onChange={handleChange}
            >
              <MenuItem value={SortTypes.RELEVANCE}>Relevance</MenuItem>
              <MenuItem value={SortTypes.PRICE_LOW_TO_HIGH}>
                Price - Low to High
              </MenuItem>
              <MenuItem value={SortTypes.PRICE_HIGH_TO_LOW}>
                Price - High to Low
              </MenuItem>
            </Select>
          </div>
          <FilterDrawer
            open={filterState}
            handleClose={setFilterState}
            dispatchFilterAction={dispatch}
          />
          {searchFilteredBooks.length ? (
            booksGrid
          ) : (
            <div className={styles.notFound}>
              <img src={info} alt="Info" />
              <div className={styles.msg}>
                "Sorry! No results found. Please check the spelling or try
                searching for something else"
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};
