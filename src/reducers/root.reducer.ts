import {UserEntryState} from "../components/UserEntry";
import {APP_ACTIONS, ACCESS_TOKEN, REFRESH_TOKEN} from "../shared/immutables";
import {Book} from "../shared/models";

export interface IAppContext {
  searchText: string;
  isUserLoggedIn: boolean;
  isSuperAdmin: boolean;
  userEntry: UserEntryState | null;
  open: boolean;
  user: any;
  books: Book[];
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
      newState.isSuperAdmin = false;
      localStorage.clear();
      break;
    case APP_ACTIONS.LOGIN:
      newState.isUserLoggedIn = true;
      newState.isSuperAdmin = data.user?.isSuperAdmin;
      newState.open = false;
      localStorage.setItem(ACCESS_TOKEN, data.token);
      localStorage.setItem(REFRESH_TOKEN, data.refreshToken);
      break;
    case APP_ACTIONS.REGISTER_USER_INFO:
      newState.isUserLoggedIn = true;
      newState.user = data;
      break;
    case APP_ACTIONS.SET_BOOKS:
      newState.books = [...data];
      break;
    case APP_ACTIONS.UPDATE_ADDRESS:
      if (!!newState.user) {
        newState.user.addressLine1 = data.addressLine1;
        newState.user.addressLine2 = data.addressLine2;
        newState.user.city = data.city;
        newState.user.state = data.state;
        newState.user.pincode = data.pincode;
      }
      break;
    default:
    // do nothing
  }
  return newState;
};
