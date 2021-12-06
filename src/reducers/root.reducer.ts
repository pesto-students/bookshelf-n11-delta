import {UserEntryState} from "../components/UserEntry";
import {APP_ACTIONS} from "../shared/immutables";

export interface IAppContext {
  searchText: string;
  isUserLoggedIn: boolean;
  userEntry: UserEntryState | null;
  open: boolean;
  token: {
    accessToken?: string;
    refreshToken?: string;
  };
}

const ACCESS_TOKEN = "accessToken";
const REFRESH_TOKEN = "refreshToken";

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
      newState.token = {};
      localStorage.clear();
      break;
    case APP_ACTIONS.LOGIN:
      newState.isUserLoggedIn = true;
      newState.open = false;
      newState.token = {
        accessToken: data.token,
        refreshToken: data.refreshToken,
      };
      localStorage.setItem(ACCESS_TOKEN, newState.token.accessToken);
      break;
    default:
    // do nothing
  }
  return newState;
};
