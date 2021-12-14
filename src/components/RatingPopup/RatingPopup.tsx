import SendIcon from "@mui/icons-material/Send";
import {Button, Rating, TextField} from "@mui/material";
import {useState} from "react";

import {GenericDialog} from "../../shared/components";
import styles from "./RatingPopup.module.scss";

function RatingPopup({open, handleDialogClose}) {
  const [value, setValue] = useState(null);
  const [title, setTitle] = useState(null);
  const [msg, setMsg] = useState(null);

  const handleSubmit = () => {
    handleDialogClose();
  };

  return (
    <GenericDialog
      open={open}
      onDialogClose={handleDialogClose}
      title="Add Review"
    >
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
        >
          Submit
        </Button>
      </div>
    </GenericDialog>
  );
}

export default RatingPopup;
