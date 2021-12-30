import {Paper} from '@mui/material';
import {memo} from 'react';

import styles from './AboutUs.module.scss';


const AboutUsComp = () => {
  return (
    <Paper className={styles.layout} elevation={2}>
      <div className={styles.heading}>About Us</div>
      <div className={styles.content}>
      </div>
    </Paper>
  );
};

export const AboutUs = memo(AboutUsComp);
