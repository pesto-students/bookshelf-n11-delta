import { NameId } from "./nameId";

export class Book extends NameId {
  desc: string;
  price: number;
  imageUri: string;
  rating?: number;

  constructor(data: Partial<Book> = {}) {
    super(data);
    this.desc = data.desc;
    this.price = data.price;
    this.imageUri = data.imageUri;
    this.rating = data.rating;
  }
}
