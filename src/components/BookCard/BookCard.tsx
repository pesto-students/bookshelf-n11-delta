import {makeStyles} from "@material-ui/core";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import {motion} from "framer-motion";
import {useNavigate} from "react-router-dom";

import {MemoizedRatingBox} from "../../shared/components";
import {HTML_SPECIAL_CHARS} from "../../shared/immutables";
import styles from "./BookCard.module.scss";

const useStyles = makeStyles(() => ({
  media: {
    width: "50%",
    objectFit: "cover",
  },
}));

export const BookCard = (props) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const {_id, title, price, author, language, imageUri, rating} = props.book;
  const desc = [language, author].join(",");
  return (
    <Paper elevation={3}>
      <motion.div
        className={styles.card}
        whileHover={{}}
        onClick={() => {
          navigate(`/books/${_id}`, {
            state: {
              book: props.book,
            },
          });
        }}
      >
        <Card sx={{maxWidth: 345, height: 300}}>
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
            <MemoizedRatingBox rating={rating} />
            <Typography sx={{fontWeight: "bold"}}>
              {HTML_SPECIAL_CHARS.RUPEE} {price}
            </Typography>
          </CardContent>
        </Card>
      </motion.div>
    </Paper>
  );
};
