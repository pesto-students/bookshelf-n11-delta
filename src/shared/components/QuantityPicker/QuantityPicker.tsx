import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import {IconButton, TextField} from "@mui/material";
import {useState} from "react";

import styles from "./QuantityPicker.module.scss";

const MIN_QTY = 1;

export const QuantityPicker = ({qty, max, setQty}) => {
  const [value, setValue] = useState(qty);

  const handleInputChange = (newValue) => {
    if (newValue >= MIN_QTY && newValue <= max) {
      _setQtyValue(newValue);
    }
  };

  const _setQtyValue = (newValue) => {
    setValue(newValue);
    setQty(newValue);
  };

  return (
    <div className={styles.quantityInput}>
      <IconButton
        color="primary"
        size="large"
        onClick={() => _setQtyValue(Math.max(MIN_QTY, value - 1))}
        disabled={value === MIN_QTY}
      >
        <RemoveCircleOutlineIcon />
      </IconButton>
      <TextField
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
      <IconButton
        color="primary"
        disabled={value === max}
        size="large"
        onClick={() => _setQtyValue(Math.min(max, value + 1))}
      >
        <AddCircleOutlineIcon />
      </IconButton>
    </div>
  );
};
