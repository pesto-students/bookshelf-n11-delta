import SendIcon from "@mui/icons-material/Send";
import {Button, Rating, TextField} from "@mui/material";
import {useState, useEffect, useContext, forwardRef} from "react";
import {AppContext} from "../../App/App";
import info from "../../assets/info.png";
import axios from "../../core/axios";
import environment from "../../Environment/environment";
import MuiAlert, {AlertProps} from "@mui/material/Alert";
import {GenericDialog} from "../../shared/components";
import styles from "./RatingPopup.module.scss";
import Snackbar from "@mui/material/Snackbar";

function RatingPopup({open, handleDialogClose, bookId}) {
  const [value, setValue] = useState(null);
  const [title, setTitle] = useState(null);
  const [msg, setMsg] = useState(null);
  const [isSubmitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(true);

  const [snackBarOpen, setSnackBarOpen] = useState(false);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarOpen(false);
  };

  const {appState} = useContext(AppContext);
  const {isUserLoggedIn} = appState;
  let canReview = false;

  const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  useEffect(() => {
    if (isUserLoggedIn) {
    }
    setSnackBarOpen(true);
  }, [isUserLoggedIn]);

  const handleSubmit = () => {
    setSubmitting(true);
    axios
      .post(`${environment.API_URL}/${bookId}/review`, {
        rating: value,
        title: title,
        message: msg,
      })
      .then((success) => {})
      .catch(() => {
        setSuccess(false);
      })
      .finally(() => {
        setSnackBarOpen(true);
        setSubmitting(false);
        handleDialogClose();
      });
  };

  return (
    <GenericDialog
      open={open}
      onDialogClose={handleDialogClose}
      title="Add Review"
    >
      {canReview ? (
        <div className={styles.ratingDialog}>
          <Rating
            size="large"
            value={value}
            onChange={(newValue) => {
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
            onChange={(event) => setTitle(event.target.value)}
          />
          <TextField
            className={styles.textField}
            label="Review"
            placeholder="Review description"
            multiline
            value={msg}
            onChange={(event) => setMsg(event.target.value)}
          />
          <Button
            type="submit"
            color="primary"
            size="medium"
            variant="contained"
            endIcon={<SendIcon />}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            Submit
          </Button>
        </div>
      ) : (
        <div className={styles.ratingDialog}>
          <img src={info} alt="Info" />
          <div className={styles.msg}>
            {isUserLoggedIn
              ? "Sorry! You are not allowed to review this product since you haven't bought it on Bookshelf"
              : "Please login to give review!!"}
          </div>
        </div>
      )}
      <Snackbar
        anchorOrigin={{vertical: "bottom", horizontal: "center"}}
        open={snackBarOpen}
        autoHideDuration={5000}
        onClose={handleClose}
      >
        {success ? (
          <Alert onClose={handleClose} severity="success" sx={{width: "100%"}}>
            Review added successfully!
          </Alert>
        ) : (
          <Alert onClose={handleClose} severity="error" sx={{width: "100%"}}>
            Failed to post review!
          </Alert>
        )}
      </Snackbar>
    </GenericDialog>
  );
}

export default RatingPopup;
