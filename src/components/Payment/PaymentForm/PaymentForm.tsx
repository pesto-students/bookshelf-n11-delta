import {CardElement, useElements, useStripe} from "@stripe/react-stripe-js";
import {StripeCardElementOptions} from "@stripe/stripe-js";
import {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";

import {AppContext} from "../../../App/App";
import payment from "../../../assets/payment.png";
import axios from "../../../core/axios";
import environment from "../../../Environment/environment";
import {GenericDialog} from "../../../shared/components";
import {HTML_SPECIAL_CHARS} from "../../../shared/immutables";
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

export const PaymentForm = ({amount}) => {
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
          console.log("Successful payment");
          setSuccess(true);
          setOpen(true);
        }
      } catch (error) {
        console.log("Error", error);
      }
    } else {
      console.log(error.message);
    }
  };

  const handleClose = () => {
    setOpen(false);
    navigate("/");
  };

  return (
    <>
      {!success ? (
        <div className={styles.layout}>
          <div className={styles.cardDetailsMsg}>
            Please enter card details to process payment
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
            <button className={styles.pay}>Pay</button>
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
            Your payment of amount: {HTML_SPECIAL_CHARS.RUPEE} {amount} is
            successful. You will shortly receive delivery details on your
            email-id: {appState.user.email}
          </div>
        </GenericDialog>
      )}
    </>
  );
};
