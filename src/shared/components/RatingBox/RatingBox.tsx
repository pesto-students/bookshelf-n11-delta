import Box from "@mui/material/Box";
import React from "react";

import { HTML_CODES } from "../../immutables";
import styles from "./RatingBox.module.scss";

function RatingBox({ rating }) {
  const ratingStr = ` ${rating.toFixed(1)}`;

  return (
    <Box className={rating >= 3 ? styles.midRating : styles.lowRating}>
      {ratingStr} &#9733;
    </Box>
  );
}

export const MemoizedRatingBox = React.memo(RatingBox);
