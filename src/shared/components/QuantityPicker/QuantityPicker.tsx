import {makeStyles} from "@material-ui/core";
import {Button, TextField, InputProps} from "@mui/material";
import {useEffect, useState} from "react";

import styles from "./QuantityPicker.module.scss";

const useStyles = makeStyles((theme) => ({
  input: {
    height: 40,
    margin: "0px 16px",

  },
  button: {
    height: 30,
    fontWeight: "bold",
  },
}));

const MIN_QTY = 1;

export const QuantityPicker = ({qty, max, setQty}) => {
  const classes = useStyles();

  const [value, setValue] = useState(qty);

  const handleInputChange = (newValue) => {
    if (newValue >= MIN_QTY && newValue <= max) {
      _setQtyValue(newValue);
    }
  }

  const _setQtyValue = (newValue) => {
    setValue(newValue);
    setQty(newValue);
  }

  return (
    <div className={styles.quantityInput}>
      <Button
        variant="outlined"
        className={classes.button}
        onClick={() => _setQtyValue(Math.max(MIN_QTY, value - 1))}
        disabled={value === MIN_QTY}
        size="small"
      >
        -
      </Button>
      <TextField
        className={classes.input}
        type="number"
        variant="outlined"
        size="small"
        value={value}
        InputProps={{
          inputProps: {min: MIN_QTY, max},
        }}
        onChange={(event) => {
          handleInputChange(event.target.value);
        }}
      />
      <Button
        variant="outlined"
        className={classes.button}
        disabled={value === max}
        onClick={() => _setQtyValue(Math.min(max, value + 1))}
        size="small"
      >
        +
      </Button>
    </div>
  );
};
