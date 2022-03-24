import {OrderTypes} from '../enums';
import {CartItem} from './cart-item.model';

export class CartModel {
  _id: string;
  products: Partial<CartItem>[];
  totalPrice: number;
  orderType: OrderTypes;
}
