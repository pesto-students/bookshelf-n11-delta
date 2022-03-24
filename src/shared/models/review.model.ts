export class Review {
  _id: string;
  title: string;
  rating: number;
  comment: string;
  createdOn: Date;
  userId: string;
  userName: string;

  constructor(data: Partial<Review> = {}) {
    this._id = data._id;
    this.title = data.title;
    this.rating = data.rating;
    this.comment = data.comment;
    this.createdOn = data.createdOn ?? new Date();
    this.userId = data.userId;
    this.userName = data.userName;
  }
}

export class BookReviewStoreModel {
  bookId: string;
  reviews: Review[];
  canPostReview?: boolean;
}
