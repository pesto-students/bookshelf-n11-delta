import {Button, Divider, Paper} from '@mui/material';
import {useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';

import emptyCart from '../../assets/empty-cart.jpeg';
import {CartThunks, useAppDispatch, useAppSelector} from '../../redux';
import {cartSelectors} from '../../redux/slices';
import {BookCartTile, Overlay} from '../../shared/components';
import {OrderTypes} from '../../shared/enums';
import styles from './CartList.module.scss';

const CartList = () => {
  const navigate = useNavigate();
  const cartItems = useAppSelector(state =>
    cartSelectors.selectAll(state.cart),
  );
  const isLoaded = useAppSelector(state => state.cart.isLoaded);
  const isLoading = useAppSelector(state => state.cart.isLoading);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isLoaded) {
      dispatch(CartThunks.getCartItems);
    }
  }, []);

  const qtyUpdate = (id, value) => {
    const orderDetails = [];
    cartItems.forEach(item => {
      if (item.book._id === id && value === 0) {
        // don't add anything to cart Item
      } else {
        const quantity = item.book._id === id ? value : item.quantity;
        orderDetails.push({
          bookId: item.book._id,
          price: item.price,
          quantity,
        });
      }
    });
    dispatch(CartThunks.updateCartItem({id, orderDetails, value}));
  };

  const checkout = () => {
    navigate('/buy', {
      state: {
        cartItems,
        orderType: OrderTypes.CART,
      },
    });
  };

  return (
    <>
      {!isLoaded || isLoading ? (
        <Overlay showBackdrop={true} />
      ) : (
        <Paper className={styles.layout} elevation={2}>
          <div className={styles.header}>
            <Button
              className={styles.btn}
              component={Link}
              to="/"
              aria-label="shop more"
              variant={cartItems?.length ? 'outlined' : 'contained'}
            >
              CONTINUE SHOPPING
            </Button>
            <div className={styles.title}>
              My Cart ({cartItems?.length ?? 0})
            </div>
            <Button
              variant="contained"
              onClick={checkout}
              aria-label="checkout"
              disabled={!cartItems?.length}
            >
              PROCEED TO CHECKOUT
            </Button>
          </div>
          <Divider />
          {cartItems?.length ? (
            cartItems.map(cartItem => (
              <div key={cartItem.book._id}>
                <BookCartTile
                  item={cartItem}
                  qtyUpdate={(id, value) => qtyUpdate(id, value)}
                  showDelete={true}
                />
              </div>
            ))
          ) : (
            <div className={styles.emptyCart}>
              <img src={emptyCart} alt="empty-cart" className={styles.image} />
              <div className={styles.msg}>Your cart is currently empty</div>
            </div>
          )}
        </Paper>
      )}
    </>
  );
};

export default CartList;
