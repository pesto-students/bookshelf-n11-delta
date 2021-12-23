import {Button} from "@mui/material";
import {CardElement, useElements, useStripe} from "@stripe/react-stripe-js";
import {StripeCardElementOptions} from "@stripe/stripe-js";
import {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";

import {AppContext} from "../../../App/App";
import payment from "../../../assets/payment.png";
import orderSuccess from "../../../assets/success.jpg";
import axios from "../../../core/axios";
import environment from "../../../Environment/environment";
import {GenericDialog} from "../../../shared/components";
import {HTML_SPECIAL_CHARS} from "../../../shared/immutables";
import {CartItem} from "../../../shared/models";
import styles from "./PaymentForm.module.scss";

const CARD_OPTIONS: StripeCardElementOptions = {
  iconStyle: "solid",
  style: {
    base: {
      iconColor: "#c4f0ff",
      color: "#fff",
      fontWeight: 500,
      fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      ":-webkit-autofill": {color: "#fce883"},
      "::placeholder": {color: "#87bbfd"},
    },
    invalid: {
      iconColor: "#f44336",
      color: "#f44336",
    },
  },
};

toast.configure();
export const PaymentForm = ({amount, products}) => {
  const [success, setSuccess] = useState(false);
  const [open, setOpen] = useState(false);

  const {appState} = useContext(AppContext);
  const stripe = useStripe();
  const elements = useElements();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: "card",
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
              bookId: pdt._id,
              price: pdt.price,
              quantity: pdt.qtyOrdered,
            };
          });
          const data = {
            value: amount,
            paymentMethod: "Card",
            orderDetails,
          };
          axios
            .post(`${environment.API_URL}/orders/new`, data)
            .catch((err) =>
              console.log("Error occurred while placing order", err)
            );
        }
      } catch (error) {
        toast.error(error?.message);
      }
    } else {
      toast.error(error.message);
    }
  };

  const handleClose = () => {
    setOpen(false);
    navigate("/orders");
  };

  const handleCancel = () => {
    // go back to previos route
    navigate(-1);
  };

  return (
    <>
      {!success ? (
        <div className={styles.layout}>
          <div className={styles.cardDetailsMsg}>
            Please enter card details to process payment of{" "}
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
              <Button
                style={{minWidth: "100px"}}
                type="submit"
                variant="contained"
                size="small"
              >
                Pay
              </Button>
              <Button
                style={{minWidth: "100px"}}
                variant="outlined"
                size="small"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          </form>
          <img src={payment} className={styles.image} />
        </div>
      ) : (
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
              Your payment of amount:{" "}
              <span className={styles.impText}>
                {HTML_SPECIAL_CHARS.RUPEE} {amount}
              </span>{" "}
              is successful. You will shortly receive delivery details on your
              email-id:{" "}
              <span className={styles.impText}>{appState.user.email}</span>
            </div>
          </div>
        </GenericDialog>
      )}
    </>
  );
};
