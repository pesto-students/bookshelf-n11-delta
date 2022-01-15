import {Book} from './book.model';

export class CartItem extends Book {
  id?: string;
  qtyOrdered: number;
  createdOn: Date;
  modifiedOn?: Date;

  constructor(data: Partial<CartItem>) {
    super(data);
    this.id = data.id;
    this.qtyOrdered = data.qtyOrdered;
    this.createdOn = data.createdOn;
    this.modifiedOn = data.modifiedOn;
  }
}
