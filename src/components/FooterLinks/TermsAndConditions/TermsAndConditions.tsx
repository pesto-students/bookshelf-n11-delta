import {Paper} from '@mui/material';
import {Fragment, memo} from 'react';

import tAndC from '../../../assets/terms-and-condition.svg';
import styles from './TermsAndConditions.module.scss';
import {TERMS_AND_CONDITIONS} from './TermsContent';

const TermsAndCond = () => {
  return (
    <Paper className={styles.layout} elevation={2}>
      <div className={styles.headerInfo}>
        <div className={styles.leftLayout}>
          <div className={styles.heading}>Terms & Conditions</div>
          <div className={styles.content}>
            <div>
              Bookshelf offers this website, including all information, tools
              and services available from this site to you, the user,
              conditioned upon your acceptance of all terms, conditions,
              policies and notices stated here.
            </div>
            <div>
              By visiting our site and/ or purchasing something from us, you
              engage in our “Service” and agree to be bound by the following
              terms and conditions (“Terms of Service”, “Terms”), including
              those additional terms and conditions and policies referenced
              herein and/or available by hyperlink.
            </div>
            <div>
              Please read these Terms of Service carefully before accessing or
              using our website. By accessing or using any part of the site, you
              agree to be bound by these Terms of Service. If you do not agree
              to all the terms and conditions of this agreement, then you may
              not access the website or use any services. If these Terms of
              Service are considered an offer, acceptance is expressly limited
              to these Terms of Service.
            </div>
            <div>
              Any new features or tools which are added to the current store
              shall also be subject to the Terms of Service. You can review the
              most current version of the Terms of Service at any time on this
              page. We reserve the right to update, change or replace any part
              of these Terms of Service by posting updates and/or changes to our
              website. It is your responsibility to check this page periodically
              for changes. Your continued use of or access to the website
              following the posting of any changes constitutes acceptance of
              those changes.
            </div>
          </div>
        </div>
        <div className={styles.rightLayout}>
          <img
            className={styles.image}
            src={tAndC}
            alt="terms and conditions"
          />
        </div>
      </div>
      <div className={styles.content}>
        {TERMS_AND_CONDITIONS.map((term, index) => (
          <Fragment key={term.title}>
            <div className={styles.subheading}>
              SECTION {index + 1} - {term.title}
            </div>
            <div>{term.content}</div>
          </Fragment>
        ))}
      </div>
    </Paper>
  );
};

export const TermsAndConditions = memo(TermsAndCond);
