import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import {useLocation} from 'react-router-dom';

import environment from '../../../Environment/environment';
import {OrderTypes} from '../../../shared/enums';
import {PaymentForm} from '../PaymentForm/PaymentForm';

const stripeTestPromise = loadStripe(environment.STRIPE_API_KEY);

const StripeContainer = () => {
  const location = useLocation();

  const amount = location.state?.amount ?? 0;
  const products = location.state?.products ?? [];
  const orderType = location.state?.orderType ?? OrderTypes.BUY_NOW;
  return (
    <Elements stripe={stripeTestPromise}>
      <PaymentForm amount={amount} products={products} orderType={orderType} />
    </Elements>
  );
};

export default StripeContainer;
