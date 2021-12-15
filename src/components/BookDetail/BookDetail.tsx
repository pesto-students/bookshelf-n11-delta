import {
  Button,
  ButtonProps,
  Divider,
  Grid,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import {Fragment, useEffect, useState} from "react";
import {useLocation, useParams} from "react-router-dom";
import {AnyObject} from "yup/lib/object";

import axios from "../../core/axios";
import environment from "../../Environment/environment";
import {
  MemoizedRatingBox,
  Overlay,
  RatingChart,
  ReadMore,
  ReviewDetails,
} from "../../shared/components";
import {HTML_SPECIAL_CHARS} from "../../shared/immutables";
import {Book, Review} from "../../shared/models";
import RatingPopup from "../RatingPopup/RatingPopup";
import styles from "./BookDetail.module.scss";

export const BookDetail = (props) => {
  const {id} = useParams();
  const location = useLocation();
  let book: Book = location.state.book;
  const [details, setDetails] = useState([]);

  const ratings: Partial<Review>[] = [
    {
      _id: "1",
      title: "Best Buy",
      rating: 4,
      message: "Content explained very well",
      userName: "Alisha Mahajan",
    },
    {
      _id: "2",
      title: "Best Buy",
      rating: 4,
      message: "Content explained very well",
      userName: "Alisha Mahajan",
    },
    {
      _id: "3",
      title: "Best Buy",
      rating: 4,
      message: "Content explained very well",
      userName: "Alisha Mahajan",
    },
  ];

  const buttonWidth = "140px";

  const AddToCartButton = styled(Button)<ButtonProps>(() => ({
    backgroundColor: "#f44336",
    marginRight: "16px",
    width: buttonWidth,
  }));

  useEffect(() => {
    getBookDetails();
  }, [id]);

  function getBookDetails() {
    if (!book) {
      axios
        .get(`${environment.API_URL}/book/${id}`)
        .then(({data}) => {
          console.log(data);
          book = data;
          createBookDetails();
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      createBookDetails();
    }
  }

  function createBookDetails() {
    setDetails([
      {
        key: "language",
        value: book.language,
      },
      {
        key: "author",
        value: book.author,
      },
      {
        key: "category",
        value: book.category,
      },
    ]);
  }

  const gridRow = (key, value) => {
    return (
      <Grid container direction="row" spacing={4} className={styles.detailRow}>
        <Grid item xs={4}>
          <span className={styles.key}>{key}</span>
        </Grid>
        <Grid item xs={8}>
          {value}
        </Grid>
      </Grid>
    );
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  const [open, setOpen] = useState(false);

  const openRatingDialog = () => {
    setOpen(true);
  };

  return (
    <div className={styles.layout}>
      {!!book ? (
        <>
          <div className={styles.imageLayout}>
            <div className={styles.imageBox}>
              <img src={book.imageUri} alt={book.title} />
            </div>
            <div className={styles.buttons}>
              <AddToCartButton variant="contained" color="secondary">
                ADD TO CART
              </AddToCartButton>
              <Button style={{width: buttonWidth}} variant="contained">
                BUY NOW
              </Button>
            </div>
          </div>
          <Stack spacing={1} className={styles.description}>
            <div className={styles.title}>{book.title}</div>
            <MemoizedRatingBox rating={book.rating} />
            <Typography sx={{fontWeight: "bold", fontSize: "24px"}}>
              {HTML_SPECIAL_CHARS.RUPEE} {book.price}
            </Typography>
            <div className={styles.tabularDetails}>
              {details.map((detail, index) => (
                <Fragment key={index}>
                  {gridRow(detail.key, <span>{detail.value}</span>)}
                </Fragment>
              ))}
              {book.highlights &&
                gridRow(
                  "highlights",
                  <ul className={styles.bookHighlights}>
                    {book.highlights.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                )}
              {gridRow("description", <ReadMore>{book.description}</ReadMore>)}
            </div>
            {ratings && (
              <>
                <div className={styles.ratingHeading}>
                  <div className={styles.title}>
                    Rating {HTML_SPECIAL_CHARS.AND} Reviews
                  </div>
                  <div className={styles.rateBtn} onClick={openRatingDialog}>
                    +
                  </div>
                </div>
                <Divider />
                <RatingChart height="200px" />
                {ratings.map((rating) => (
                  <ReviewDetails key={rating._id} review={rating} />
                ))}
              </>
            )}
          </Stack>
          <RatingPopup open={open} handleDialogClose={handleDialogClose} />
        </>
      ) : (
        <Overlay showBackdrop={true} />
      )}
    </div>
  );
};
