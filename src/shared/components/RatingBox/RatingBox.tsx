import Box from "@mui/material/Box";
import React from "react";

import {HTML_SPECIAL_CHARS} from "../../immutables";
import styles from "./RatingBox.module.scss";

const GREY_COLOR = "#808080";
const RATING_MAP = ["red", "red", "orange", "green", "green"];

function RatingBox(props) {
  const rating = props.rating;
  const roundOffDigit = props.roundOff ?? 1;
  const ratingStr = rating ? ` ${rating.toFixed(roundOffDigit)}` : "-";

  const bgColor = getRatingColor(rating);

  function getRatingColor(rating) {
    let color = GREY_COLOR;

    if (rating) {
      color = RATING_MAP[rating - 1];
    }
    return color;
  }
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
