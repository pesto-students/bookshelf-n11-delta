import {Reviews} from "@mui/icons-material";
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
import {useLocation, useNavigate, useParams} from "react-router-dom";

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
import {Book, CartItem, ChartRating, Review} from "../../shared/models";
import RatingPopup from "../RatingPopup/RatingPopup";
import styles from "./BookDetail.module.scss";

export const BookDetail = (props) => {
  const {id} = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  let book: Book = location.state?.book;
  const [details, setDetails] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [showLoader, setShowLoader] = useState(false);

  const initialChartRating = new ChartRating();
  const [chartRating, setChartRating] = useState(initialChartRating);

  const buttonWidth = "140px";

  const AddToCartButton = styled(Button)<ButtonProps>(() => ({
    backgroundColor: "#f44336",
    marginRight: "16px",
    width: buttonWidth,
  }));

  useEffect(() => {
    getBookDetails();
    getBookReviews();
  }, [id]);

  useEffect(() => {
    if (reviews.length) {
      createChartRating();
    }
  }, [reviews]);

  function getBookDetails() {
    if (!book) {
      axios
        .get(`${environment.API_URL}/book/${id}`)
        .then(({data}) => {
          book = data;
          createBookDetails();
        })
        .catch((error) => {
          console.log(error);
          navigate("/");
        });
    } else {
      createBookDetails();
    }
  }

  function getBookReviews() {
    setShowLoader(true);
    axios
      .get(`${environment.API_URL}/reviews?bookId=${id}`)
      .then(({data}) => {
        const bookReviews = [];
        data.reviews.forEach((review) => {
          bookReviews.push(new Review(review));
        });
        setReviews(bookReviews);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setShowLoader(false));
  }

  function createChartRating() {
    const data = {...chartRating};
    [1, 2, 3, 4, 5].forEach((element) => {
      const length = reviews.filter(
        (review) => review.rating === element
      ).length;
      data[`star${element}`] = length;
    });
    setChartRating(data);
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

  const buyBook = () => {
    const date = new Date();
    const cartItem = new CartItem({
      ...book,
      qtyOrdered: 1,
      createdOn: date,
      modifiedOn: date,
    });
    navigate(`/buy`, {
      state: {
        cartItems: [cartItem],
      },
    });
  };

  const handleDialogClose = (fetchReviews = false) => {
    setOpen(false);
    if (fetchReviews) {
      getBookReviews();
    }
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
              <Button
                style={{width: buttonWidth}}
                variant="contained"
                onClick={buyBook}
              >
                BUY NOW
              </Button>
            </div>
          </div>
          <Stack spacing={1} className={styles.description}>
            <div className={styles.title}>{book.title}</div>
            <MemoizedRatingBox rating={book.avgRating} />
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
                  !!book.highlights.length ? (
                    <ul className={styles.bookHighlights}>
                      {book.highlights.map((highlight, index) => (
                        <li key={index}>{highlight}</li>
                      ))}
                    </ul>
                  ) : (
                    <span>-</span>
                  )
                )}
              {gridRow("description", <ReadMore>{book.description}</ReadMore>)}
            </div>
            <div className={styles.ratingHeading}>
              <div className={styles.title}>
                Rating {HTML_SPECIAL_CHARS.AND} Reviews
              </div>
              {!showLoader && (
                <div className={styles.rateBtn} onClick={openRatingDialog}>
                  +
                </div>
              )}
            </div>
            <Divider />
            {!showLoader ? (
              !!reviews.length ? (
                <>
                  <RatingChart rating={chartRating} height="200px" />
                  {reviews.map((rating) => (
                    <ReviewDetails key={rating._id} review={rating} />
                  ))}
                </>
              ) : (
                <div className={styles.noRatingMsg}>No reviews available</div>
              )
            ) : (
              <Overlay showBackdrop={false} />
            )}
          </Stack>
          <RatingPopup
            open={open}
            handleDialogClose={handleDialogClose}
            bookId={id}
          />
        </>
      ) : (
        <Overlay showBackdrop={false} />
      )}
    </div>
  );
};
