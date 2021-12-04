import {UserEntryState} from "../components/UserEntry";
import {APP_ACTIONS} from "../shared/immutables";

export interface IAppContext {
  searchText: string;
  isUserLoggedIn: boolean;
  userEntry: UserEntryState | null;
  open: boolean;
}

export const RootReducer = (
  state: IAppContext,
  action: {type: string; data?: any}
) => {
  const newState = {...state};
  switch (action.type) {
    case APP_ACTIONS.UPDATE_SEARCH_TEXT:
      newState.searchText = action.data;
      break;
    case APP_ACTIONS.USER_ENTRY_MENU_CLICKED:
      newState.userEntry = action.data;
      newState.open = true;
      break;
    case APP_ACTIONS.USER_ENTRY_COMPLETED:
      newState.userEntry = null;
      newState.open = false;
      break;
    case APP_ACTIONS.LOGOUT:
      newState.isUserLoggedIn = false;
      break;
    case APP_ACTIONS.LOGIN:
      newState.isUserLoggedIn = true;
      break;
    default:
    // do nothing
  }
  return newState;
};
