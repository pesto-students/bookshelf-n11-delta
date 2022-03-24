import {APP_ACTIONS} from '../shared/immutables';

export interface IAppContext {
  searchText: string;
}

export const RootReducer = (
  state: IAppContext,
  action: {type: string; data?: any},
) => {
  const newState = {...state};
  const {type, data} = action;
  switch (type) {
    case APP_ACTIONS.UPDATE_SEARCH_TEXT:
      newState.searchText = data;
      break;
    default:
    // do nothing
  }
  return newState;
};
