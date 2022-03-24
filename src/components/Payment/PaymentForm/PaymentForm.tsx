import {LoadingButton} from '@mui/lab';
import {Button, Paper} from '@mui/material';
import {CardElement, useElements, useStripe} from '@stripe/react-stripe-js';
import {StripeCardElementOptions} from '@stripe/stripe-js';
import {useContext, useState} from 'react';
import {batch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';

import {AppContext} from '../../../App/App';
import payment from '../../../assets/card-payment.svg';
import orderSuccess from '../../../assets/success.jpg';
import axios from '../../../core/axios';
import environment from '../../../Environment/environment';
import {
  CartThunks,
  orderActions,
  OrderThunks,
  useAppDispatch,
} from '../../../redux';
import {GenericDialog} from '../../../shared/components';
import {APP_ACTIONS, HTML_SPECIAL_CHARS} from '../../../shared/immutables';
import {CartItem} from '../../../shared/models';
import styles from './PaymentForm.module.scss';

const CARD_OPTIONS: StripeCardElementOptions = {
  iconStyle: 'solid',
  style: {
    base: {
      iconColor: '#c4f0ff',
      color: '#fff',
      fontWeight: 500,
      fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
      fontSize: '16px',
      fontSmoothing: 'antialiased',
      ':-webkit-autofill': {color: '#fce883'},
      '::placeholder': {color: '#87bbfd'},
    },
    invalid: {
      iconColor: '#f44336',
      color: '#f44336',
    },
  },
};

export const PaymentForm = ({amount, products, orderType}) => {
  const [success, setSuccess] = useState(false);
  const [open, setOpen] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  const {appState, dispatchAppAction} = useContext(AppContext);
  const stripe = useStripe();
  const elements = useElements();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = async e => {
    e.preventDefault();
    setProcessingPayment(true);
    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });
    if (!error) {
      try {
        const {id} = paymentMethod;
        const response = await axios.post(`${environment.API_URL}/payment`, {
          amount,
          id,
        });

        if (response.data.success) {
          setSuccess(true);
          setOpen(true);

          const orderDetails = products.map((pdt: Partial<CartItem>) => {
            return {
              bookId: pdt.book._id,
              price: pdt.price,
              quantity: pdt.quantity,
            };
          });
          const data = {
            value: amount,
            paymentMethod: 'Card',
            orderDetails,
          };
          axios
            .post(
              `${environment.API_URL}/orders/new?orderType=${orderType}`,
              data,
            )
            .catch(() => {
              toast.error('Error occurred while placing order');
            });
        }
      } catch (error) {
        const message = error?.message ?? 'Failure while doing payment!!';
        toast.error(message);
      } finally {
        setProcessingPayment(false);
      }
    } else {
      toast.error(error.message);
      setProcessingPayment(false);
    }
  };

  const handleClose = () => {
    setOpen(false);

    dispatch(CartThunks.getCartItems());
    dispatch(orderActions.refreshData());
    navigate('/orders');
  };

  const handleCancel = () => {
    // go back to previos route
    navigate(-1);
  };

  return (
    <>
      <Paper elevation={2} className={styles.layout}>
        <div className={styles.leftLayout}>
          <div className={styles.title}>Order Summary</div>
          <div className={styles.content}>
            {products.map(product => (
              <div className={styles.pdtDescription} key={product._id}>
                <div>
                  <span>Title: </span>
                  <span>{product.title}</span>
                </div>
                <div>
                  <span>Price: {HTML_SPECIAL_CHARS.RUPEE}</span>
                  <span>{product.price}</span>
                </div>
                <div>
                  <span>Quantity: </span>
                  <span>{product.qtyOrdered}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.rightLayout}>
          <div className={styles.cardDetailsMsg}>
            Please enter card details to process payment of{' '}
            {HTML_SPECIAL_CHARS.RUPEE} {amount}
          </div>
          <form className={styles.paymentForm} onSubmit={handleSubmit}>
            <fieldset className={styles.formGroup}>
              <div className={styles.formRow}>
                <CardElement
                  options={CARD_OPTIONS}
                  className={styles.stripeCard}
                />
              </div>
            </fieldset>
            <div className={styles.buttons}>
              <LoadingButton
                className={styles.btn}
                type="submit"
                variant="contained"
                size="small"
                disabled={success}
                loading={processingPayment}
              >
                Pay
              </LoadingButton>
              <Button
                className={styles.btn}
                variant="outlined"
                size="small"
                aria-label="cancel"
                disabled={success}
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          </form>
          <img src={payment} className={styles.image} alt="Payment" />
        </div>
      </Paper>
      {success && (
        <GenericDialog
          open={open}
          onDialogClose={handleClose}
          title="Payment Successful"
        >
          <div className={styles.confirmationMsg}>
            <img
              className={styles.successImg}
              src={orderSuccess}
              alt="Payment successful"
            />
            <div className={styles.infoMessage}>
              Your payment of amount:{' '}
              <span className={styles.impText}>
                {HTML_SPECIAL_CHARS.RUPEE} {amount}
              </span>{' '}
              is successful. You will shortly receive delivery details on your
              email-id:{' '}
              <span className={styles.impText}>{appState.user.email}</span>
            </div>
          </div>
        </GenericDialog>
      )}
    </>
  );
};
