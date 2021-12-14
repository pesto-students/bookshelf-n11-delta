import Box from "@mui/material/Box";
import React from "react";

import {HTML_SPECIAL_CHARS} from "../../immutables";
import styles from "./RatingBox.module.scss";

const GREEN_COLOR = "#008000";
const LIME_COLOR = "#adff2f";
const GREY_COLOR = "#808080";

function RatingBox(props) {
  const rating = props.rating;
  const roundOffDigit = props.roundOff ?? 1;
  const ratingStr = rating ? ` ${rating.toFixed(roundOffDigit)}` : "-";

  const bgColor = rating ? (rating >= 3 ? GREEN_COLOR : LIME_COLOR) : GREY_COLOR;
  return (
    <Box
      style={{backgroundColor: bgColor}}
      className={props.small ? styles.smallRating : styles.rating}
    >
      {ratingStr} {rating && HTML_SPECIAL_CHARS.STAR}
    </Box>
  );
}

export const MemoizedRatingBox = React.memo(RatingBox);
