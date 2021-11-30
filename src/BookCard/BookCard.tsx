import {makeStyles} from "@material-ui/core";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

const useStyles = makeStyles((theme) => ({
  media: {
    width: "50%",
    objectFit: "cover",
  },
}));

function BookCard({book}) {
  const classes = useStyles();

  return (
    <div>
      <Card variant="outlined" sx={{maxWidth: 345}}>
        <CardMedia
          className={classes.media}
          component="img"
          height="140"
          image={book.imageUri}
          alt={book.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {book.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {book.desc}
          </Typography>
          <Typography>&#x20b9;{book.price}</Typography>
        </CardContent>
      </Card>
    </div>
  );
}

export default BookCard;
