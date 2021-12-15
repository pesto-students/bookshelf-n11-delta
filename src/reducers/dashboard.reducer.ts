import {Filter} from "../shared/enums";
import {DASHBOARD_ACTIONS} from "../shared/immutables";
import { Book } from "../shared/models";

export interface IDashboardState {
  books: Book[];
  searchFilteredBooks: Book[];
  isLoading: boolean;
  sortFilter: Filter;
};

export const DashboardReducer = (state: IDashboardState, action) => {
  const newState = {...state};
  switch (action.type) {
    case DASHBOARD_ACTIONS.GET_ALL_BOOKS:
      newState.books = [];
      newState.searchFilteredBooks = [];
      newState.isLoading = true;
      break;
    case DASHBOARD_ACTIONS.SET_ALL_BOOKS:
      newState.books = [...action.data];
      newState.searchFilteredBooks = [...action.data];
      newState.isLoading = false;
      break;
    case DASHBOARD_ACTIONS.FILTER_BOOKS:
      if (!!action.searchOn) {
        newState.searchFilteredBooks = newState.books.filter((book) =>
          book.title.toLowerCase().includes(action.searchOn.toLowerCase())
        );
      } else {
        newState.searchFilteredBooks = newState.books;
      }
      break;
    case DASHBOARD_ACTIONS.SORT_FILTER:
      newState.sortFilter = action.data;
      if (newState.sortFilter === Filter.PRICE_LOW_TO_HIGH) {
        newState.searchFilteredBooks.sort(
          (bookA, bookB) => bookA.price - bookB.price
        );
      } else if (newState.sortFilter === Filter.PRICE_HIGH_TO_LOW) {
        newState.searchFilteredBooks.sort(
          (bookA, bookB) => bookB.price - bookA.price
        );
      } else {
        newState.searchFilteredBooks = newState.books;
      }
      break;
    default:
  }
  return newState;
};
