import {Paper} from '@mui/material';
import React, {Fragment} from 'react';

import styles from './Payments.module.scss';

const PAYMENT_FAQ = [
  {
    question: "How do I pay for a Bookshelf purchase?",
    answer:
      "Bookshelf currently offers card payment methods. Whatever \
    your online mode of payment, you can rest assured that Bookshelf's \
    trusted payment gateway partners use secure encryption technology \
    to keep your transaction details confidential at all times.",
  },
  {
    question:
      "Are there any hidden charges when I make a purchase on Bookshelf?",
    answer:
      "There are NO hidden charges when you make a purchase on Bookshelf. \
    The prices listed for all the items are final and all-inclusive. The price \
    you see on the product page is exactly what you pay. Delivery charges may be\
     extra depending on the seller policy. Please check individual seller for the same.",
  },
  {
    question: "Is it safe to use my credit/debit card on?",
    answer:
      "Your online transaction on Bookshelf is secure with the highest \
    levels of transaction security currently available on the Internet. \
    All credit card and debit card payments on Bookshelf are processed \
    through secure and trusted payment gateways managed by leading banks.",
  },
];
const PaymentInfo = () => {
  return (
    <Paper className={styles.layout} elevation={2}>
      <div className={styles.heading}>Payments</div>
      <div className={styles.content}>
        {PAYMENT_FAQ.map((faq) => (
          <Fragment key={faq.question}>
            <div className={styles.subheading}>Q: {faq.question}</div>
            <div>{faq.answer}</div>
          </Fragment>
        ))}
      </div>
    </Paper>
  );
};

export const Payments = React.memo(PaymentInfo);
