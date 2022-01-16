import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import {useState} from 'react';

const MIN_QTY = 1;

export const QuantityPicker = ({qty, max, setQty}) => {
  const [value, setValue] = useState(qty);

  const _setQtyValue = newValue => {
    setValue(newValue);
    setQty(newValue);
  };

  return (
    <ButtonGroup disableElevation variant="outlined" color="primary">
      <Button
        variant="contained"
        onClick={() => _setQtyValue(Math.max(MIN_QTY, value - 1))}
        disabled={value === MIN_QTY}
      >
        -
      </Button>
      <Button style={{pointerEvents: 'none'}}>{value}</Button>
      <Button
        onClick={() => _setQtyValue(Math.min(max, value + 1))}
        disabled={value === max}
        variant="contained"
      >
        +
      </Button>
    </ButtonGroup>
  );
};
