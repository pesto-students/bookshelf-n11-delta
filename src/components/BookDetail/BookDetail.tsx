import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Button,
  ButtonProps,
  Divider,
  Grid,
  Paper,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import {Fragment, useContext, useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {toast} from 'react-toastify';

import {AppContext} from '../../App/App';
import noReviews from '../../assets/no-reviews.svg';
import axios from '../../core/axios';
import environment from '../../Environment/environment';
import {
  bookReviewSelectors,
  BookReviewThunks,
  bookSelectors,
  BookThunks,
  cartSelectors,
  CartThunks,
  useAppDispatch,
  useAppSelector,
} from '../../redux';
import {
  MemoizedRatingBox,
  Overlay,
  RatingChart,
  ReadMore,
  ReviewDetails,
} from '../../shared/components';
import {OrderTypes} from '../../shared/enums';
import {
  ADD_ITEM_TO_CART,
  APP_ACTIONS,
  HTML_SPECIAL_CHARS,
} from '../../shared/immutables';
import {CartItem, ChartRating, Review} from '../../shared/models';
import RatingPopup from '../RatingPopup/RatingPopup';
import styles from './BookDetail.module.scss';

const BookDetail = () => {
  const {id} = useParams();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const book = useAppSelector(state =>
    bookSelectors.selectById(state.book, id),
  );
  const bookReviews = useAppSelector(state =>
    bookReviewSelectors.selectById(state.bookReview, id),
  );

  const isLoaded = useAppSelector(state => state.book.isLoaded);
  const isReviewsLoading = useAppSelector(state => state.bookReview.isLoading);

  const [details, setDetails] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [inCart, setInCart] = useState(false);

  const currentUser = useAppSelector(state => state.auth.user);
  const isCartLoaded = useAppSelector(state => state.cart.isLoaded);
  const cartItems = useAppSelector(state =>
    cartSelectors.selectAll(state.cart),
  );

  const initialChartRating = new ChartRating();
  const [chartRating, setChartRating] = useState(initialChartRating);

  const AddToCartButton = styled(LoadingButton)<ButtonProps>(() => ({
    backgroundColor: '#f44336',
    marginRight: '16px',
    '&:hover': {
      backgroundColor: '#d2190b',
    },
  }));

  useEffect(() => {
    if (isLoaded && !book) {
      toast.error('Invalid book id refrenced');
    } else {
      if (!book) {
        dispatch(BookThunks.getBookById(id));
      }
      if (!bookReviews) {
        dispatch(BookReviewThunks.getBookReviewsById(id));
      }
    }
  }, [id]);

  useEffect(() => {
    if (bookReviews?.reviews?.length) {
      setReviews(bookReviews.reviews);
      createChartRating(bookReviews.reviews);
    }
  }, [bookReviews]);

  useEffect(() => {
    if (currentUser) {
      if (isCartLoaded) {
        const isPresent = cartItems.some(item => item.book._id === book._id);
        setInCart(isPresent);
      } else {
        dispatch(CartThunks.getCartItems());
      }
    }
  }, [currentUser, cartItems]);

  useEffect(() => {
    if (book) {
      createBookDetails(book);
    }
  }, [book]);

  function createChartRating(reviewData: Review[]) {
    const data = {...chartRating};
    [1, 2, 3, 4, 5].forEach(element => {
      const length = reviewData.filter(
        review => review.rating === element,
      ).length;
      data[`star${element}`] = length;
    });
    setChartRating(data);
  }

  function createBookDetails({language, author, category}) {
    setDetails([
      {
        key: 'language',
        value: language,
      },
      {
        key: 'author',
        value: author,
      },
      {
        key: 'category',
        value: category,
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
    const cartItem = new CartItem({
      book: {...book},
      quantity: 1,
      price: book.price,
    });
    navigate('/buy', {
      state: {
        cartItems: [cartItem],
        orderType: OrderTypes.BUY_NOW,
      },
    });
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  const navigateToCart = () => {
    navigate('/cart');
  };

  const addToCartHandler = () => {
    if (inCart) {
      navigateToCart();
      return;
    }

    const orderDetails = [];
    setCartLoading(true);

    orderDetails.push({
      bookId: book._id,
      price: book.price,
      quantity: 1,
    });
    cartItems.forEach(item => {
      if (item._id !== id) {
        orderDetails.push({
          bookId: item._id,
          price: item.price,
          quantity: item.quantity,
        });
      }
    });

    dispatch(
      CartThunks.updateCartItem({
        type: ADD_ITEM_TO_CART,
        id: book._id,
        book: book,
        orderDetails,
      }),
    )
      .unwrap()
      .then(() => {
        navigateToCart();
      })
      .catch(err => console.log(err))
      .finally(() => setCartLoading(false));
  };

  const [open, setOpen] = useState(false);

  const openRatingDialog = () => {
    setOpen(true);
  };

  return (
    <div className={styles.layout}>
      {!!book ? (
        <Paper className={styles.paper}>
          <div className={styles.imageLayout}>
            <div className={styles.imageBox}>
              <img src={book.imageUri} alt={book.title} />
            </div>
            <div className={styles.buttons}>
              <AddToCartButton
                disabled={!currentUser || !book.quantity}
                variant="contained"
                startIcon={<AddShoppingCartIcon />}
                loading={cartLoading}
                loadingPosition="start"
                aria-label="cart"
                onClick={addToCartHandler}
              >
                {inCart ? 'GO TO CART' : 'ADD TO CART'}
              </AddToCartButton>
              <Button
                disabled={!currentUser || !book.quantity}
                variant="contained"
                startIcon={<ShoppingBasketOutlinedIcon />}
                onClick={buyBook}
                aria-label="buy now"
              >
                BUY NOW
              </Button>
            </div>
          </div>
          <Stack spacing={1} className={styles.description}>
            <div className={styles.title}>{book.title}</div>
            <MemoizedRatingBox rating={book.avgRating} />
            <Typography sx={{fontWeight: 'bold', fontSize: '24px'}}>
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
                  'highlights',
                  !!book.highlights.length ? (
                    <ul className={styles.bookHighlights}>
                      {book.highlights.map((highlight, index) => (
                        <li key={index}>{highlight}</li>
                      ))}
                    </ul>
                  ) : (
                    <span>-</span>
                  ),
                )}
              {gridRow('description', <ReadMore>{book.description}</ReadMore>)}
            </div>
            {!book.quantity && (
              <div className={styles.notAvailableMsg}>
                Sorry, currently item is out of stock
              </div>
            )}
            <div className={styles.ratingHeading}>
              <div className={styles.title}>
                Rating {HTML_SPECIAL_CHARS.AND} Reviews
              </div>
              {!isReviewsLoading && (
                <div className={styles.rateBtn} onClick={openRatingDialog}>
                  +
                </div>
              )}
            </div>
            <Divider />
            {isReviewsLoading ? (
              <div className={styles.loadingReviewContainer}>
                <Overlay showBackdrop={false} showCircularSpinner={true} />
              </div>
            ) : !!reviews.length ? (
              <>
                <RatingChart rating={chartRating} />
                {reviews.map(rating => (
                  <ReviewDetails key={rating._id} review={rating} />
                ))}
              </>
            ) : (
              <div className={styles.noReviews}>
                <img src={noReviews} className={styles.image} alt="" />
                <div className={styles.noRatingMsg}>No reviews available</div>
              </div>
            )}
          </Stack>
          <RatingPopup
            open={open}
            handleDialogClose={handleDialogClose}
            bookId={id}
          />
        </Paper>
      ) : (
        <Overlay />
      )}
    </div>
  );
};

export default BookDetail;
