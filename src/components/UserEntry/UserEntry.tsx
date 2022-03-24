import {AnimatePresence} from 'framer-motion';
import {useReducer} from 'react';

import loginImage from '../../assets/signup.png';
import {userEntryReducer} from '../../reducers';
import {useAppDispatch, useAppSelector} from '../../redux';
import {authActions} from '../../redux/slices';
import {GenericDialog} from '../../shared/components';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import {UserEntryState} from './UserEntry.constant';
import styles from './UserEntry.module.scss';

export const UserEntry = ({showForm}) => {
  const [state, dispatchUserEntryAction] = useReducer(userEntryReducer, {
    userEntryState: showForm,
    title: '',
  });

  const dispatch = useAppDispatch();

  const handleDialogClose = () => {
    dispatch(authActions.finalizeAuth());
  };
  const {title, userEntryState} = state;

  const openState = useAppSelector(state => state.auth.userEntryState);

  return (
    <AnimatePresence>
      <GenericDialog
        className={styles.dialog}
        open={!!openState}
        onDialogClose={handleDialogClose}
        image={loginImage}
        title={title}
        addAnimation={true}
      >
        {userEntryState === UserEntryState.Login ? (
          <LoginForm userAction={dispatchUserEntryAction} />
        ) : (
          <SignUpForm userAction={dispatchUserEntryAction} />
        )}
      </GenericDialog>
    </AnimatePresence>
  );
};
