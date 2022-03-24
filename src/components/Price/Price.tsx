import {Divider, Grid} from '@mui/material';
import {useContext, useEffect, useState} from 'react';

import {HTML_SPECIAL_CHARS} from '../../shared/immutables';
import {CartContext} from '../Cart/Cart';
import styles from './Price.module.scss';

export const Price = ({deliveryFee, address}) => {
  const [total, setTotal] = useState(0);
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);

  const {cartState} = useContext(CartContext);

  useEffect(() => {
    let priceToPay = 0;
    let qty = 0;
    cartState.products?.forEach(pdt => {
      priceToPay += pdt.price * pdt.quantity;
      qty += pdt.quantity;
    });
    setPrice(priceToPay);
    setQuantity(qty);
    const total = priceToPay + +deliveryFee;
    setTotal(total);
  }, [cartState, deliveryFee]);

  const gridRow = (key, value) => {
    return (
      <Grid direction="row" spacing={4} className={styles.detailRow}>
        <Grid xs={8}>
          <span className={styles.key}>{key}</span>
        </Grid>
        <Grid xs={4}>{value}</Grid>
      </Grid>
    );
  };

  return (
    <div className={styles.card}>
      <div className={styles.heading}>PRICE DETAILS</div>
      <Divider />
      <div className={styles.tabularDetails}>
        {gridRow(
          `PRICE (${quantity} ${quantity > 1 ? 'ITEMS' : 'ITEM'})`,
          `${HTML_SPECIAL_CHARS.RUPEE} ${price}`,
        )}
        {gridRow('DELIVERY FEE', `${HTML_SPECIAL_CHARS.RUPEE} ${deliveryFee}`)}
        {gridRow('TOTAL', `${HTML_SPECIAL_CHARS.RUPEE} ${total}`)}
      </div>
      {address && (
        <div className={styles.deliveryBlock}>
          <Divider />
          <div className={styles.title}>DELIVERY DETAILS</div>
          <div className={styles.address}>{address}</div>
        </div>
      )}
    </div>
  );
};
