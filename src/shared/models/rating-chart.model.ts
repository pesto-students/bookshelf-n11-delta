const ZERO_RATING = 0;

export class ChartRating {
  star1: number;
  star2: number;
  star3: number;
  star4: number;
  star5: number;

  constructor(rateChart: Partial<ChartRating> = {}) {
    this.star1 = rateChart.star1 ?? ZERO_RATING;
    this.star2 = rateChart.star2 ?? ZERO_RATING;
    this.star3 = rateChart.star3 ?? ZERO_RATING;
    this.star4 = rateChart.star4 ?? ZERO_RATING;
    this.star5 = rateChart.star5 ?? ZERO_RATING;
  }
}
