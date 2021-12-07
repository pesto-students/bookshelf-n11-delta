import {Filter} from "../shared/enums";
import {DASHBOARD_ACTIONS} from "../shared/immutables";

export const DashboardReducer = (state, action) => {
  const newState = {...state};
  switch (action.type) {
    case DASHBOARD_ACTIONS.GET_ALL_BOOKS:
      newState.books = [];
      newState.filteredBooks = [];
      newState.isLoading = true;
      break;
    case DASHBOARD_ACTIONS.SET_ALL_BOOKS:
      newState.books = [...action.data];
      newState.filteredBooks = [...action.data];
      newState.isLoading = false;
      break;
    case DASHBOARD_ACTIONS.FILTER_BOOKS:
      if (!!action.searchOn) {
        newState.filteredBooks = newState.books.filter((book) =>
          book.title.toLowerCase().includes(action.searchOn.toLowerCase())
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
        newState.filteredBooks = newState.books;
      }
      break;
    default:
  }
  return newState;
};
