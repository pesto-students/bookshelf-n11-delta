import {Box, Button, Paper, Step, StepLabel, Stepper} from '@mui/material';
import {createContext, useEffect, useReducer, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import environment from '../../Environment/environment';

import {CartReducer, ICartContext} from '../../reducers';
import {useAppSelector} from '../../redux';
import {BookCartTile} from '../../shared/components';
import {CART_ACTIONS} from '../../shared/immutables';
import AddressConfirmation from '../AddressConfirmation/AddressConfirmation';
import {Price} from '../Price/Price';
import styles from './Cart.module.scss';

export const CartContext = createContext(null);
const steps = ['Delivery Address', 'Place Order'];

const Cart = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentUser = useAppSelector(state => state.auth.user);
  const initialState: ICartContext = {
    products: location.state.cartItems,
    totalPrice: 0,
    orderType: location.state.orderType,
    address: null,
  };

  const [cartState, dispatchCartActions] = useReducer(
    CartReducer,
    initialState,
  );

  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const processPayment = () => {
    let total = +environment.DELIVERY_FEE;
    cartState.products.forEach(pdt => {
      total += pdt.quantity * pdt.price;
    });
    navigate('/payment', {
      state: {
        amount: total,
        products: cartState.products,
        orderType: cartState.orderType,
      },
    });
  };

  const [address, setAddress] = useState(null);

  useEffect(() => {
    const addresses = currentUser?.addresses ?? [];
    const primaryAdd =
      addresses.find(address => !!address?.default) ?? addresses[0];
    if (!!primaryAdd) {
      const locationAdd = `${primaryAdd.addressLine1}, ${primaryAdd.city}, ${primaryAdd.state}, PIN: ${primaryAdd.pincode}`;
      setAddress(locationAdd);
    }
  }, []);

  const qtyUpdate = (id, value) => {
    dispatchCartActions({
      type: CART_ACTIONS.UPDATE_QTY,
      data: {id, value},
    });
  };

  return (
    <Paper className={styles.paper} elevation={2}>
      <Box className={styles.stepper}>
        <Stepper activeStep={activeStep}>
          {steps.map(label => {
            return (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Box>
      <div className={styles.layout}>
        <CartContext.Provider value={{cartState, dispatchCartActions}}>
          <div className={styles.leftLayout}>
            {activeStep === 0 ? (
              <div className={styles.borderLayoutBox}>
                <AddressConfirmation handleDelivery={handleNext} />
              </div>
            ) : (
              <>
                {cartState.products.map(item => (
                  <BookCartTile
                    item={item}
                    key={item.book._id}
                    qtyUpdate={(id, value) => qtyUpdate(id, value)}
                    showDelete={false}
                  />
                ))}
              </>
            )}
          </div>
          <div className={styles.rightLayout}>
            <Price deliveryFee={environment.DELIVERY_FEE} />
            {activeStep === steps.length - 1 && (
              <div className={styles.borderLayoutBox}>
                <div>
                  Order confirmation will be sent to:{' '}
                  <span className={styles.boldText}>{currentUser?.email}</span>
                </div>
                <Button
                  variant="contained"
                  size="small"
                  onClick={processPayment}
                  aria-label="place order"
                >
                  PLACE ORDER
                </Button>
              </div>
            )}
          </div>
        </CartContext.Provider>
      </div>
      <Button
        color="inherit"
        className={styles.backBtn}
        disabled={activeStep === 0}
        onClick={handleBack}
      >
        Back
      </Button>
    </Paper>
  );
};

export default Cart;
