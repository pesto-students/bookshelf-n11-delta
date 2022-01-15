import {Button, MenuItem, Paper, Select} from '@mui/material';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import {Grid} from '@mui/material';
import {useContext, useEffect, useReducer, useState} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import {Carousel} from 'react-responsive-carousel';

import {AppContext} from '../../App/App';
import banner from '../../assets/banner.svg';
import searching from '../../assets/search.svg';
import axios from '../../core/axios';
import environment from '../../Environment/environment';
import {DashboardReducer, IDashboardState} from '../../reducers';
import {Overlay} from '../../shared/components';
import {SortTypes} from '../../shared/enums';
import {APP_ACTIONS, DASHBOARD_ACTIONS} from '../../shared/immutables';
import {Book} from '../../shared/models';
import {BookCard} from '../BookCard/BookCard';
import FilterDrawer from '../FilterDrawer/FilterDrawer';
import {CAROUSEL_IMAGES} from './carousel-images';
import styles from './Dashboard.module.scss';

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

  const handleChange = event => {
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
        .catch(error => {
          console.log(error);
        });
    }
  }

  const setBooks = bookList => {
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
        {dashboardFilteredBooks.map(book => (
          <Grid item key={book._id.toString()}>
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
          <Carousel
            showThumbs={false}
            showStatus={false}
            autoPlay={true}
            infiniteLoop={true}
          >
            {CAROUSEL_IMAGES.map((item, i) => (
              <img key={i} src={item} className={styles.banner} alt="banner" />
            ))}
          </Carousel>
          <div className={styles.toolbar}>
            <Button
              onClick={() => setFilterState(!filterState)}
              className={styles.filterBtn}
              startIcon={<FilterAltOutlinedIcon />}
            />
            <Select
              variant="outlined"
              displayEmpty
              value={sortFilter}
              size="small"
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
            <Paper className={styles.notFound} elevation={2}>
              <img src={searching} alt="no search results" />
              <div className={styles.msg}>
                "Sorry! No results found. Please check the spelling/filter or
                try searching for something else"
              </div>
            </Paper>
          )}
        </>
      )}
    </>
  );
};
