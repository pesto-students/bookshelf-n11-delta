export class BookDetails {
  _id: string;
  title: string;
}

export class BookOrder {
  _id: string;
  bookId: BookDetails;
  price: number;
  quantity: number;
}

export class OrderModel {
  _id: string;
  deliveredOn: Date;
  createdOn: Date;
  paymentMethod: string;
  value: number;
  orderDetails: BookOrder[];
}
