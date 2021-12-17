export class Filter {
  price?: {
    min: number;
    max: number;
  };
  language?: string[];
  category?: string[];

  constructor(data: Partial<Filter> = {}) {
  //   this.price = {};
  //   this.language = data.language;
  //   this.category = data.category;
  }
}
