import SendIcon from '@mui/icons-material/Send';
import {Button, Rating, TextField} from '@mui/material';
import MuiAlert, {AlertProps} from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import {forwardRef, useEffect, useState} from 'react';

import info from '../../assets/info.png';
import {
  bookReviewSelectors,
  BookReviewThunks,
  useAppDispatch,
  useAppSelector,
} from '../../redux';
import {GenericDialog} from '../../shared/components';
import styles from './RatingPopup.module.scss';

function RatingPopup({open, handleDialogClose, bookId}) {
  const [value, setValue] = useState(null);
  const [title, setTitle] = useState('');
  const [msg, setMsg] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  const handleClose = (_event?: React.SyntheticEvent | Event) => {
    setValue(null);
    setMsg('');
    setTitle('');
    setSnackBarOpen(false);
    handleDialogClose(true);
  };

  const currentUser = useAppSelector(state => state.auth.user);
  const reviews = useAppSelector(state =>
    bookReviewSelectors.selectById(state.bookReview, bookId),
  );

  const dispatch = useAppDispatch();

  const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  useEffect(() => {
    // reviews not exist or canPost not exists
    if (reviews?.canPostReview === undefined) {
      setSnackBarOpen(false);
      // currentUser and reviews must exist but canPost not
      if (!!currentUser && reviews && reviews.canPostReview === undefined) {
        dispatch(BookReviewThunks.canPostReview(bookId));
      }
    }
  }, [currentUser, reviews]);

  const handleSubmit = () => {
    setSubmitting(true);
    dispatch(
      BookReviewThunks.addBookReview({
        bookId,
        rating: value,
        title: title,
        comment: msg,
      }),
    )
      .unwrap()
      .then(() => {
        setSnackBarOpen(true);
      })
      .catch(err => console.error(err))
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <GenericDialog
      open={open}
      onDialogClose={handleDialogClose}
      title="Add Review"
    >
      {reviews?.canPostReview ? (
        <div className={styles.ratingDialog}>
          <Rating
            size="large"
            value={value}
            onChange={(_event, newValue) => {
              setValue(newValue);
            }}
          />
          <TextField
            className={styles.textField}
            name="title"
            label="Title"
            size="small"
            variant="outlined"
            value={title}
            onChange={event => {
              setTitle(event.target.value);
            }}
          />
          <TextField
            className={styles.textField}
            label="Review"
            placeholder="Review description"
            multiline
            value={msg}
            onChange={event => {
              setMsg(event.target.value);
            }}
          />
          <Button
            type="submit"
            color="primary"
            size="medium"
            variant="contained"
            aria-label="submit"
            endIcon={<SendIcon />}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            SUBMIT
          </Button>
        </div>
      ) : (
        <div className={styles.ratingDialog}>
          <img className={styles.noReview} src={info} alt="Info" />
          <div className={styles.msg}>
            {!!currentUser
              ? "Sorry! You are not allowed to review this product since you haven't bought it on Bookshelf"
              : 'Please login to give review!!'}
          </div>
        </div>
      )}
      <Snackbar
        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
        open={snackBarOpen}
        autoHideDuration={1000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success" sx={{width: '100%'}}>
          Review added successfully!
        </Alert>
      </Snackbar>
    </GenericDialog>
  );
}

export default RatingPopup;
