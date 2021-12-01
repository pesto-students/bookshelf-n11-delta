import {makeStyles} from "@material-ui/core";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import {MemoizedRatingBox} from "../shared/components";

const useStyles = makeStyles((theme) => ({
  media: {
    width: "50%",
    objectFit: "cover",
  },
}));

function BookCard({book}) {
  const classes = useStyles();
  const {name, price, desc, imageUri, rating} = book;
  return (
    <div>
      <Card variant="elevation" sx={{maxWidth: 345, height: 300}}>
        <CardMedia
          className={classes.media}
          component="img"
          height="140"
          image={imageUri}
          alt={name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {desc}
          </Typography>
          {rating && <MemoizedRatingBox rating={rating} />}
          <Typography sx={{fontWeight: "bold"}}>&#x20b9; {price}</Typography>
        </CardContent>
      </Card>
    </div>
  );
}

export default BookCard;
