import {CART_ACTIONS} from "../shared/immutables";
import {CartItem} from "../shared/models";

export interface ICartContext {
  products: Partial<CartItem>[];
}

export const CartReducer = (
  state: ICartContext,
  action: {type: string; data?: any}
) => {
  const newState = {...state};
  const {type, data} = action;
  switch (type) {
    case CART_ACTIONS.UPDATE_QTY:
      const pdt = newState.products.find((pdt) => pdt._id === data.id);
      pdt.qtyOrdered = data.value;
      break;
    default:
    // do nothing
  }
  return newState;
};
