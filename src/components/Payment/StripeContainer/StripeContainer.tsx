import {loadStripe} from "@stripe/stripe-js";
import environment from "../../../Environment/environment";
import {Elements} from "@stripe/react-stripe-js";
import {PaymentForm} from "../PaymentForm/PaymentForm";
import {useLocation} from "react-router-dom";

const stripeTestPromise = loadStripe(environment.STRIPE_API_KEY);

export const StripeContainer = () => {
  const location = useLocation();

  const amount = location.state?.amount ?? 0;
  const products = location.state?.products ?? [];
  return (
    <Elements stripe={stripeTestPromise}>
      <PaymentForm amount={amount} products={products}/>
    </Elements>
  );
};
