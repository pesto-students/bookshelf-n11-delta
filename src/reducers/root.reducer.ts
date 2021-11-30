import {UPDATE_SEARCH_TEXT} from "../shared/immutables/action-types";

export interface IAppContext {
  searchText: string;
}

export const RootReducer = (state, action) => {
  const newState = {...state};
  switch (action.type) {
    case UPDATE_SEARCH_TEXT:
      newState.searchText = action.data;
      break;
    default:
    // do anything
  }
  return newState;
};

