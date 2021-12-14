export class Review{
    _id: string;
    title: string;
    rating: number;
    message: string;
    userId: string;
    userName: string;
  
    constructor(data: Partial<Review> = {}) {
      this._id = data._id;
      this.title = data.title;
      this.rating = data.rating;
      this.message = data.message;
      this.userId = data.userId;
      this.userName = data.userName;
    }
  }
  