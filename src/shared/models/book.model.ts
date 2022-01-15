export class Book {
  _id: string;
  title: string;
  description: string;
  language: string;
  category: string;
  author: string;
  quantity: number;
  price: number;
  imageUri: string;
  highlights: string[];
  pages: number;
  avgRating?: number;

  constructor(data: Partial<Book> = {}) {
    this._id = data._id;
    this.title = data.title ?? '';
    this.description = data.description ?? '';
    this.language = data.language ?? '';
    this.category = data.category ?? '';
    this.author = data.author ?? '';
    this.quantity = data.quantity ?? 1;
    this.price = data.price ?? 0;
    this.imageUri = data.imageUri ?? '';
    this.highlights = data.highlights ?? [];
    this.pages = data.pages ?? 0;
    this.avgRating = data.avgRating;
  }
}
