import {AnyObject} from 'yup/lib/types';
import {Book} from './book.model';
export class CartItem {
  _id?: string;
  book: Book;
  price: number;
  quantity: number;

  constructor(data: AnyObject) {
    // because API send book ref in `bookId` key
    const refBook = data.book ?? data.bookId;

    this.book = new Book(refBook);
    this._id = this.book._id;
    this.price = data.price;
    this.quantity = data.quantity ?? 1;
  }
}
