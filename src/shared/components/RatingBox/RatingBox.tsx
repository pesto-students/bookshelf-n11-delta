import Box from "@mui/material/Box";
import React from "react";

import {HTML_SPECIAL_CHARS} from "../../immutables";
import styles from "./RatingBox.module.scss";

function RatingBox(props) {
  const rating = props.rating;
  const ratingStr = rating ? ` ${rating.toFixed(1)}` : "-";

  return (
    <Box
      className={
        rating
          ? rating >= 3
            ? styles.midRating
            : styles.lowRating
          : styles.noRating
      }
    >
      {ratingStr} {rating && HTML_SPECIAL_CHARS.STAR}
    </Box>
  );
}

export const MemoizedRatingBox = React.memo(RatingBox);
