import {CircularProgress} from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import {LoopCircleLoading} from 'react-loadingg';
import styles from './Overlay.module.scss';

export function Overlay({showBackdrop = false, showCircularSpinner = false}) {
  const spinner = <LoopCircleLoading color="#3f51b5" />;
  const circularSpinner = <CircularProgress className={styles.overlay} />;
  if (!!showBackdrop) {
    return (
      <Backdrop sx={{zIndex: theme => theme.zIndex.drawer + 1}} open={true}>
        {showCircularSpinner ? circularSpinner : spinner}
      </Backdrop>
    );
  }
  return <>{showCircularSpinner ? circularSpinner : spinner}</>;
}
