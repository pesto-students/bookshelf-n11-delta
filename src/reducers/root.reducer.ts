import {UserEntryState} from "../components/UserEntry";
import {APP_ACTIONS, ACCESS_TOKEN, REFRESH_TOKEN} from "../shared/immutables";

export interface IAppContext {
  searchText: string;
  isUserLoggedIn: boolean;
  userEntry: UserEntryState | null;
  open: boolean;
  user: any;
}

export const RootReducer = (
  state: IAppContext,
  action: {type: string; data?: any}
) => {
  const newState = {...state};
  const {type, data} = action;
  switch (type) {
    case APP_ACTIONS.UPDATE_SEARCH_TEXT:
      newState.searchText = data;
      break;
    case APP_ACTIONS.USER_ENTRY_MENU_CLICKED:
      newState.userEntry = data;
      newState.open = true;
      break;
    case APP_ACTIONS.USER_ENTRY_COMPLETED:
      newState.userEntry = null;
      newState.open = false;
      break;
    case APP_ACTIONS.LOGOUT:
      newState.isUserLoggedIn = false;
      localStorage.clear();
      break;
    case APP_ACTIONS.LOGIN:
      newState.isUserLoggedIn = true;
      newState.open = false;
      localStorage.setItem(ACCESS_TOKEN, data.token);
      localStorage.setItem(REFRESH_TOKEN, data.refreshToken);
      break;
    case APP_ACTIONS.REGISTER_USER_INFO:
      newState.isUserLoggedIn = true;
      newState.user = data;
      break;
    default:
    // do nothing
  }
  return newState;
};
