import {UserEntryState} from '../components/UserEntry';
import {
  APP_ACTIONS,
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  ADD_ITEM_TO_CART,
} from '../shared/immutables';
import {Book, CartItem} from '../shared/models';

export interface IAppContext {
  searchText: string;
  isUserLoggedIn: boolean;
  isSuperAdmin: boolean;
  userEntry: UserEntryState | null;
  open: boolean;
  user: any;
  books: Book[];
  cartItems: Partial<CartItem>[];
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
      newState.cartItems = [];
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
      newState.isSuperAdmin = data.isSuperAdmin;
      break;
    case APP_ACTIONS.UPDATE_USER_INFO:
      newState.user = {...newState.user, ...data};
      break;
    case APP_ACTIONS.SET_BOOKS:
      newState.books = [...data];
      break;
    case APP_ACTIONS.UPDATE_ADDRESS:
      if (!!newState.user) {
        const address = {...data};
        newState.user.addresses = [address];
      }
      break;
    case APP_ACTIONS.SET_CART:
      const items = [];
      data?.orderDetails.forEach(order => {
        const cartItem: Partial<CartItem> = {
          ...order.bookId,
          id: order._id,
          qtyOrdered: order.quantity,
        };
        items.push(cartItem);
      });
      newState.cartItems = [...items];
      break;
    case APP_ACTIONS.UPDATE_CART:
      if (data.action === ADD_ITEM_TO_CART) {
        newState.cartItems = [...newState.cartItems, data.item];
      } else {
        // find appropriate book, _id depicts bookId
        if (data.value) {
          const item = newState.cartItems.find(item => item._id === data.id);
          item.qtyOrdered = data.value;
        } else {
          newState.cartItems = newState.cartItems.filter(
            item => item._id != data.id,
          );
        }
      }
      break;
    default:
    // do nothing
  }
  return newState;
};
