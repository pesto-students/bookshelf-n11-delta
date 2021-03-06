import {OrderTypes} from '../shared/enums';
import {CART_ACTIONS} from '../shared/immutables';
import {CartItem, UserAddress} from '../shared/models';

export interface ICartContext {
  products: Partial<CartItem>[];
  totalPrice: number;
  orderType: OrderTypes;
  address?: Partial<UserAddress>;
}

export const CartReducer = (
  state: ICartContext,
  action: {type: string; data?: any},
) => {
  const newState = {...state};
  const {type, data} = action;
  switch (type) {
    case CART_ACTIONS.UPDATE_QTY:
      const pdt = newState.products.find(pdt => pdt._id === data.id);
      pdt.quantity = data.value;
      break;
    case CART_ACTIONS.SET_PAYABLE_AMOUNT:
      newState.totalPrice = data.value;
      break;
    case CART_ACTIONS.SET_DELIVERY_ADDRESS:
      newState.address = data;
      break;
    default:
    // do nothing
  }
  return newState;
};
