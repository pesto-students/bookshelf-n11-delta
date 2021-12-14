import {ReadMore} from "..";
import {Review} from "../../models";
import {MemoizedRatingBox} from "../RatingBox/RatingBox";
import styles from "./ReviewDetails.module.scss";

export const ReviewDetails = ({review}: {review: Partial<Review>}) => {
  return (
    <div className={styles.reviewLayout}>
      <div className={styles.heading}>
        <MemoizedRatingBox small="true" roundOff="0" rating={review.rating} />
        <div className={styles.title}>{review.title}</div>
      </div>
      <div className={styles.msg}>
        <ReadMore limit="100">{review.message}</ReadMore>
      </div>
      <div className={styles.userInfo}>{review.userName}</div>
    </div>
  );
};
