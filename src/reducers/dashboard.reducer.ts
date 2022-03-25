import {SortTypes} from '../shared/enums';
import {DASHBOARD_ACTIONS} from '../shared/immutables';
import {Book, Filter} from '../shared/models';

export interface IDashboardState {
  books: Book[];
  searchFilteredBooks: Book[];
  dashboardFilteredBooks: Book[];
  sortFilter: SortTypes;
  filteredBooks: Book[];
  appliedFilters: Filter;
  hasMore: boolean;
}

// 2 rows by default
const SCROLL_LIMIT = 8;

export const DashboardReducer = (state: IDashboardState, action) => {
  const newState = {...state};
  const {type, data} = action;
  switch (type) {
    case DASHBOARD_ACTIONS.GET_ALL_BOOKS:
      newState.books = [];
      newState.searchFilteredBooks = [];
      newState.filteredBooks = [];
      newState.appliedFilters = {};
      newState.dashboardFilteredBooks = [];
      newState.hasMore = true;
      break;
    case DASHBOARD_ACTIONS.SET_ALL_BOOKS:
      newState.books = [...data];
      newState.searchFilteredBooks = [...data];
      newState.filteredBooks = [...data];
      newState.hasMore = data.length > SCROLL_LIMIT;
      updateDashboardFilteredBooks(newState);
      break;
    case DASHBOARD_ACTIONS.SEARCH_BOOKS:
      if (!!action.searchOn) {
        newState.searchFilteredBooks = newState.filteredBooks.filter(book =>
          book.title.toLowerCase().includes(action.searchOn.toLowerCase()),
        );
      } else {
        newState.searchFilteredBooks = newState.filteredBooks;
      }
      updateDashboardFilteredBooks(newState);
      break;
    case DASHBOARD_ACTIONS.SORT_ACTION:
      newState.sortFilter = data;
      applySort(newState);
      break;
    case DASHBOARD_ACTIONS.APPLY_FILTER:
      newState.appliedFilters = data;
      applyFilter(newState);
      break;
    case DASHBOARD_ACTIONS.CLEAR_FILTER:
      newState.filteredBooks = [...newState.books];
      newState.searchFilteredBooks = [...newState.books];
      newState.appliedFilters = {};
      updateDashboardFilteredBooks(newState);
      break;
    case DASHBOARD_ACTIONS.UPDATE_DASHBOARD_SCROLL:
      handleDashboardScroll(newState);
      break;
    default:
      // do nothing
      break;
  }
  return newState;
};

const applyFilter = (state: IDashboardState) => {
  const {appliedFilters: filter} = state;

  if (filter.price) {
    state.filteredBooks = state.books.filter(
      book => book.price >= filter.price.min && book.price <= filter.price.max,
    );
  } else {
    state.filteredBooks = [...state.books];
  }

  if (filter.language?.length) {
    state.filteredBooks = state.filteredBooks.filter(book =>
      filter.language.includes(book.language),
    );
  }
  if (filter.category?.length) {
    state.filteredBooks = state.filteredBooks.filter(book =>
      filter.category.includes(book.category),
    );
  }
  state.searchFilteredBooks = [...state.filteredBooks];
  applySort(state);
};

const applySort = (state: IDashboardState) => {
  const data = state.sortFilter;
  if (data === SortTypes.PRICE_LOW_TO_HIGH) {
    state.searchFilteredBooks.sort((bookA, bookB) => bookA.price - bookB.price);
  } else if (data === SortTypes.PRICE_HIGH_TO_LOW) {
    state.searchFilteredBooks.sort((bookA, bookB) => bookB.price - bookA.price);
  } else {
    state.searchFilteredBooks = [...state.filteredBooks];
  }
  updateDashboardFilteredBooks(state);
};

const updateDashboardFilteredBooks = (state: IDashboardState) => {
  let length = state.dashboardFilteredBooks.length;
  if (!length) {
    length = Math.min(SCROLL_LIMIT, state.searchFilteredBooks.length);
  }
  state.hasMore =
    state.searchFilteredBooks.length > state.dashboardFilteredBooks.length;
  state.dashboardFilteredBooks = state.searchFilteredBooks.slice(0, length);
};

const handleDashboardScroll = state => {
  if (state.dashboardFilteredBooks.length >= state.searchFilteredBooks.length) {
    state.hasMore = false;
    return;
  }
  const length = state.dashboardFilteredBooks.length;
  state.dashboardFilteredBooks = state.searchFilteredBooks.slice(
    0,
    length + SCROLL_LIMIT,
  );
};
