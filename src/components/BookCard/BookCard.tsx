import {makeStyles} from "@material-ui/core";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import styles from "./BookCard.module.scss";
import {MemoizedRatingBox} from "../../shared/components";
import {HTML_SPECIAL_CHARS} from "../../shared/immutables";
import Tooltip from "@mui/material/Tooltip";

const useStyles = makeStyles(() => ({
  media: {
    width: "50%",
    objectFit: "cover",
  },
}));

export const BookCard = (props) => {
  const classes = useStyles();
  const {title, price, author, language, imageUri, rating} = props.book;
  const desc = [language, author].join(",");
  return (
    <div>
      <Card variant="elevation" sx={{maxWidth: 345, height: 300}}>
        <CardMedia
          className={classes.media}
          component="img"
          height="140"
          image={imageUri}
          alt={title}
        />
        <CardContent>
          <Tooltip title={title}>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              className={styles.truncate}
            >
              {title}
            </Typography>
          </Tooltip>
          <Typography variant="body2" color="text.secondary">
            {desc}
          </Typography>
          {<MemoizedRatingBox rating={rating} />}
          <Typography sx={{fontWeight: "bold"}}>
            {HTML_SPECIAL_CHARS.RUPEE} {price}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};
