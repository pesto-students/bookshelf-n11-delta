import {Button, MenuItem, Select} from "@material-ui/core";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import {Grid} from "@mui/material";
import axios from "axios";
import {useContext, useEffect, useReducer, useState} from "react";

import {AppContext} from "../App/App";
import banner from "../assets/banner.svg";
import BookCard from "../BookCard/BookCard";
import {DUMMY_BOOKS_DATA} from "../dummy-data";
import {Overlay} from "../shared/components";
import {Filter} from "../shared/enums";
import {DASHBOARD_ACTIONS} from "../shared/immutables/action-types";
import {Book} from "../shared/models";
import styles from "./Dashboard.module.scss";

const emptyBooksList: Book[] = [];

const initialDashboardState = {
  books: emptyBooksList,
  filteredBooks: emptyBooksList,
  isLoading: true,
  sortFilter: Filter.RELEVANCE,
};

function Dashboard() {
  const {searchText} = useContext(AppContext);

  function reducer(state, action) {
    const newState = {...state, isLoading: true};
    switch (action.type) {
      case DASHBOARD_ACTIONS.SET_ALL_BOOKS:
        newState.books = action.data;
        newState.filteredBooks = action.data;
        break;
      case DASHBOARD_ACTIONS.FILTER_BOOKS:
        if (!!searchText.searchField) {
          newState.filteredBooks = newState.books.filter((book) =>
            book.name
              .toLowerCase()
              .includes(searchText.searchField.toLowerCase())
          );
        } else {
          newState.filteredBooks = newState.books;
        }
        break;
      case DASHBOARD_ACTIONS.SORT_FILTER:
        newState.sortFilter = action.data;
        if (newState.sortFilter === Filter.PRICE_LOW_TO_HIGH) {
          newState.filteredBooks.sort(
            (bookA, bookB) => bookA.price - bookB.price
          );
        } else if (newState.sortFilter === Filter.PRICE_HIGH_TO_LOW) {
          newState.filteredBooks.sort(
            (bookA, bookB) => bookB.price - bookA.price
          );
        } else {
          newState.filteredBooks.sort((bookA, bookB) => bookA.id - bookB.id);
        }
        break;
      default:
      // do nothing
    }
    newState.isLoading = false;
    return newState;
  }

  const [state, dispatch] = useReducer(reducer, initialDashboardState);

  const handleChange = (event) => {
    dispatch({type: DASHBOARD_ACTIONS.SORT_FILTER, data: event.target.value});
  };

  function setDummyDataToBooks() {
    dispatch({type: DASHBOARD_ACTIONS.SET_ALL_BOOKS, data: DUMMY_BOOKS_DATA});
  }

  function getAllBooks() {
    axios
      .get("")
      .then((success) => {
        setDummyDataToBooks();
      })
      .catch(() => {
        setDummyDataToBooks();
      });
  }

  useEffect(() => {
    if (!state.books.length) {
      getAllBooks();
    }
    dispatch({type: DASHBOARD_ACTIONS.FILTER_BOOKS});
  }, [searchText.searchField]);

  const {isLoading, sortFilter, filteredBooks} = state;

  const booksGrid = (
    <Grid container className={styles.booksGrid} spacing={2}>
      {filteredBooks.map((book) => (
        <Grid key={book.id.toString()} item xs={3}>
          <BookCard book={book} />
        </Grid>
      ))}
    </Grid>
  );

  return (
    <>
      <img src={banner} alt="banner" className={styles.banner} />
      {isLoading ? (
        <div style={{minHeight: "256px"}}>
          <Overlay showBackdrop={true} />
        </div>
      ) : (
        <>
          <div className={styles.toolbar}>
            <Button disabled className={styles.filterBtn} startIcon={<FilterAltOutlinedIcon />} />
            <Select
              variant="standard"
              labelId="sort-by-select-label"
              id="sort-by"
              value={sortFilter}
              label="Sort by"
              onChange={handleChange}
            >
              <MenuItem value={Filter.RELEVANCE}>Relevance</MenuItem>
              <MenuItem value={Filter.PRICE_LOW_TO_HIGH}>
                Price - Low to High
              </MenuItem>
              <MenuItem value={Filter.PRICE_HIGH_TO_LOW}>
                Price - High to Low
              </MenuItem>
            </Select>
          </div>
          {filteredBooks && booksGrid}
        </>
      )}
    </>
  );
}

export default Dashboard;
